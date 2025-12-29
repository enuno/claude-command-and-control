/**
 * Miner Controller
 *
 * REST API controller for miner operations.
 * Handles request validation, response formatting, and delegates to repositories.
 *
 * @module api/rest/controllers/miner
 */

import { Request, Response, NextFunction, Router } from 'express';
import { z } from 'zod';
import { createChildLogger } from '../../../utils/logger';
import { ValidationError, MinerNotFoundError } from '../../../utils/errors';
import {
  IMinerRepository,
  IMinerStatusRepository,
  MinerEntity,
  MinerRegistrationSchema,
  MinerFilterSchema,
  PaginationSchema,
  PowerTargetSchema,
  HashrateTargetSchema,
} from '../../../repositories';
import { BraiinsClient } from '../../braiins';

const controllerLogger = createChildLogger({ module: 'miner-controller' });

/**
 * Standard API response wrapper.
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Formats a successful API response.
 */
function success<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

/**
 * Parses and validates request data with Zod.
 */
function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }
  return result.data;
}

/**
 * Controller dependencies.
 */
export interface MinerControllerDependencies {
  minerRepo: IMinerRepository;
  statusRepo: IMinerStatusRepository;
  braiins: BraiinsClient;
}

/**
 * Creates the miner controller router.
 *
 * @param deps - Controller dependencies
 * @returns Express router with miner endpoints
 */
export function createMinerController(deps: MinerControllerDependencies): Router {
  const router = Router();
  const { minerRepo, statusRepo, braiins } = deps;

  // ==================== CRUD Operations ====================

  /**
   * POST /miners
   * Register a new miner.
   */
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validate(MinerRegistrationSchema, req.body);

      controllerLogger.info('Registering miner', { id: input.id, host: input.host });

      // Verify connectivity by authenticating
      await braiins.authenticate({
        host: input.host,
        port: input.port ?? 80,
        username: input.username ?? 'root',
        password: input.password,
        useTls: input.useTls ?? false,
      });

      // Create miner with defaults applied
      const minerInput = {
        ...input,
        port: input.port ?? 80,
        username: input.username ?? 'root',
        useTls: input.useTls ?? false,
        tags: input.tags ?? [],
      };
      const miner = await minerRepo.create(minerInput);

      res.status(201).json(
        success(
          {
            id: miner.id,
            name: miner.name,
            host: miner.host,
            port: miner.port,
            useTls: miner.useTls,
            tags: miner.tags,
            createdAt: miner.createdAt.toISOString(),
          },
          { action: 'created' }
        )
      );
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /miners
   * List miners with optional filtering and pagination.
   */
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse query parameters
      const filterInput = validate(MinerFilterSchema, {
        status: (req.query.status as string) ?? 'all',
        tenantId: req.query.tenantId,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        minHashrateThs: req.query.minHashrate ? Number(req.query.minHashrate) : undefined,
        maxHashrateThs: req.query.maxHashrate ? Number(req.query.maxHashrate) : undefined,
        pool: req.query.pool,
        firmware: req.query.firmware,
        model: req.query.model,
      });

      const paginationInput = validate(PaginationSchema, {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: (req.query.sortBy as string) ?? 'name',
        sortOrder: (req.query.sortOrder as string) ?? 'asc',
      });

      // Apply defaults to ensure required fields are present
      const filter = {
        ...filterInput,
        status: filterInput.status ?? 'all',
      } as const;

      const pagination = {
        ...paginationInput,
        page: paginationInput.page ?? 1,
        limit: paginationInput.limit ?? 20,
        sortBy: paginationInput.sortBy ?? 'name',
        sortOrder: paginationInput.sortOrder ?? 'asc',
      } as const;

      controllerLogger.debug('Listing miners', { filter, pagination });

      const result = await minerRepo.findAll(filter as any, pagination as any);

      // Optionally include status data
      const includeStatus = req.query.includeStatus === 'true';
      type MinerWithOptionalStatus = MinerEntity & {
        status?: {
          online: boolean;
          hashrateThs: number;
          temperatureCelsius: number;
          powerWatts: number;
        } | null;
      };
      let minersWithStatus: MinerWithOptionalStatus[] = result.data;

      if (includeStatus && result.data.length > 0) {
        const statusMap = await statusRepo.getStatuses(result.data.map((m) => m.id));

        minersWithStatus = result.data.map((miner) => {
          const status = statusMap.get(miner.id);
          return {
            ...miner,
            status: status
              ? {
                  online: status.online,
                  hashrateThs: status.hashrateThs,
                  temperatureCelsius: status.maxTemperatureCelsius,
                  powerWatts: status.powerWatts,
                }
              : null,
          };
        });
      }

      res.json(
        success(
          {
            miners: minersWithStatus.map((m) => ({
              id: m.id,
              name: m.name,
              host: m.host,
              port: m.port,
              useTls: m.useTls,
              tags: m.tags,
              tenantId: m.tenantId,
              ...(m.status ? { status: m.status } : {}),
            })),
          },
          {
            pagination: result.pagination,
          }
        )
      );
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /miners/:id
   * Get a specific miner by ID.
   */
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      controllerLogger.debug('Getting miner', { id });

      const miner = await minerRepo.findById(id);
      if (!miner) {
        throw new MinerNotFoundError(id);
      }

      res.json(
        success({
          id: miner.id,
          name: miner.name,
          host: miner.host,
          port: miner.port,
          useTls: miner.useTls,
          tags: miner.tags,
          tenantId: miner.tenantId,
          createdAt: miner.createdAt.toISOString(),
          updatedAt: miner.updatedAt.toISOString(),
        })
      );
    } catch (error) {
      next(error);
    }
  });

  /**
   * PATCH /miners/:id
   * Update a miner.
   */
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      // Partial validation - only validate fields that are provided
      const updateSchema = MinerRegistrationSchema.partial().omit({ id: true, password: true });
      const input = validate(updateSchema, req.body);

      controllerLogger.info('Updating miner', { id, fields: Object.keys(input) });

      const miner = await minerRepo.update(id, input);

      res.json(
        success(
          {
            id: miner.id,
            name: miner.name,
            host: miner.host,
            port: miner.port,
            useTls: miner.useTls,
            tags: miner.tags,
            updatedAt: miner.updatedAt.toISOString(),
          },
          { action: 'updated' }
        )
      );
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /miners/:id
   * Remove a miner.
   */
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      controllerLogger.info('Deleting miner', { id });

      // Disconnect from the miner
      const miner = await minerRepo.findById(id);
      if (miner) {
        braiins.disconnect(miner.host);
      }

      await minerRepo.delete(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // ==================== Status Operations ====================

  /**
   * GET /miners/:id/status
   * Get real-time status of a miner.
   */
  router.get('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      const refresh = req.query.refresh === 'true';

      controllerLogger.debug('Getting miner status', { id, refresh });

      // Check miner exists
      const exists = await minerRepo.exists(id);
      if (!exists) {
        throw new MinerNotFoundError(id);
      }

      // Invalidate cache if refresh requested
      if (refresh) {
        await statusRepo.invalidateStatus(id);
      }

      const status = await statusRepo.getStatus(id);
      if (!status) {
        throw new MinerNotFoundError(id);
      }

      res.json(
        success({
          id: status.id,
          name: status.name,
          host: status.host,
          online: status.online,
          hashrateThs: status.hashrateThs,
          maxTemperatureCelsius: status.maxTemperatureCelsius,
          powerWatts: status.powerWatts,
          info: status.info,
          hashboards: status.hashboards,
          pools: status.pools,
          tunerState: status.tunerState,
          errors: status.errors,
          lastUpdated: status.lastUpdated.toISOString(),
        })
      );
    } catch (error) {
      next(error);
    }
  });

  // ==================== Operations ====================

  /**
   * POST /miners/:id/reboot
   * Reboot a miner.
   */
  router.post('/:id/reboot', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      controllerLogger.info('Rebooting miner', { id });

      const miner = await minerRepo.findById(id);
      if (!miner) {
        throw new MinerNotFoundError(id);
      }

      // Ensure authenticated
      if (!braiins.isAuthenticated(miner.host)) {
        await braiins.authenticate({
          host: miner.host,
          port: miner.port,
          username: miner.username,
          password: miner.password,
          useTls: miner.useTls,
        });
      }

      await braiins.reboot(miner.host);
      await statusRepo.invalidateStatus(id);

      res.json(
        success(
          {
            id,
            message: 'Reboot command sent successfully',
            note: 'Miner will be temporarily offline during reboot',
          },
          { action: 'reboot' }
        )
      );
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /miners/:id/power-target
   * Set power consumption target.
   */
  router.post('/:id/power-target', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      const input = validate(PowerTargetSchema, req.body);

      controllerLogger.info('Setting power target', { id, watts: input.watts });

      const miner = await minerRepo.findById(id);
      if (!miner) {
        throw new MinerNotFoundError(id);
      }

      // Ensure authenticated
      if (!braiins.isAuthenticated(miner.host)) {
        await braiins.authenticate({
          host: miner.host,
          port: miner.port,
          username: miner.username,
          password: miner.password,
          useTls: miner.useTls,
        });
      }

      await braiins.setPowerTarget(miner.host, { watt: input.watts });
      await statusRepo.invalidateStatus(id);

      res.json(
        success(
          {
            id,
            powerTargetWatts: input.watts,
            message: `Power target set to ${input.watts}W`,
            note: 'Tuner will adjust to reach target over time',
          },
          { action: 'power-target' }
        )
      );
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /miners/:id/hashrate-target
   * Set hashrate target.
   */
  router.post('/:id/hashrate-target', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('Miner ID is required');
      }

      const input = validate(HashrateTargetSchema, req.body);

      controllerLogger.info('Setting hashrate target', { id, terahashPerSecond: input.terahashPerSecond });

      const miner = await minerRepo.findById(id);
      if (!miner) {
        throw new MinerNotFoundError(id);
      }

      // Ensure authenticated
      if (!braiins.isAuthenticated(miner.host)) {
        await braiins.authenticate({
          host: miner.host,
          port: miner.port,
          username: miner.username,
          password: miner.password,
          useTls: miner.useTls,
        });
      }

      await braiins.setHashrateTarget(miner.host, { terahash_per_second: input.terahashPerSecond });
      await statusRepo.invalidateStatus(id);

      res.json(
        success(
          {
            id,
            hashrateTargetThs: input.terahashPerSecond,
            message: `Hashrate target set to ${input.terahashPerSecond} TH/s`,
            note: 'Tuner will adjust to reach target over time',
          },
          { action: 'hashrate-target' }
        )
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}

/**
 * Creates the fleet controller router.
 *
 * @param deps - Controller dependencies
 * @returns Express router with fleet endpoints
 */
export function createFleetController(deps: MinerControllerDependencies): Router {
  const router = Router();
  const { statusRepo } = deps;

  /**
   * GET /fleet/status
   * Get aggregated fleet status.
   */
  router.get('/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.query.tenantId as string | undefined;

      controllerLogger.debug('Getting fleet status', { tenantId });

      const fleetStatus = await statusRepo.getFleetStatus(tenantId);

      res.json(
        success({
          total: fleetStatus.total,
          online: fleetStatus.online,
          offline: fleetStatus.offline,
          totalHashrateThs: fleetStatus.totalHashrateThs,
          avgTemperatureCelsius: Math.round(fleetStatus.avgTemperatureCelsius * 10) / 10,
          totalPowerWatts: fleetStatus.totalPowerWatts,
          errors: fleetStatus.errors,
          miners: fleetStatus.miners.map((m) => ({
            id: m.id,
            name: m.name,
            host: m.host,
            online: m.online,
            hashrateThs: m.hashrateThs,
            temperatureCelsius: m.maxTemperatureCelsius,
            powerWatts: m.powerWatts,
          })),
          calculatedAt: fleetStatus.calculatedAt.toISOString(),
        })
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}
