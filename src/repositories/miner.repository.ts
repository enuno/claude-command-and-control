/**
 * Miner Repository Implementation
 *
 * Implements the IMinerRepository interface with in-memory storage.
 * Can be replaced with a database implementation in production.
 *
 * @module repositories/miner
 */

import { createChildLogger } from '../utils/logger';
import { MinerNotFoundError, ValidationError } from '../utils/errors';
import { RedisClient, cacheKeys, cacheTTL } from '../cache/redis';
import { BraiinsClient } from '../api/braiins';
import type {
  IMinerRepository,
  IMinerStatusRepository,
  MinerEntity,
  MinerRegistrationInput,
  MinerFilter,
  Pagination,
  PaginatedResult,
  MinerStatus,
  FleetStatus,
} from './types';

const repoLogger = createChildLogger({ module: 'miner-repository' });

/**
 * Creates a miner repository with in-memory storage.
 *
 * @param cache - Optional Redis client for caching
 * @returns Miner repository instance
 */
export function createMinerRepository(cache: RedisClient | null): IMinerRepository {
  const miners = new Map<string, MinerEntity>();

  return {
    async create(input: MinerRegistrationInput): Promise<MinerEntity> {
      if (miners.has(input.id)) {
        throw new ValidationError(`Miner with ID '${input.id}' already exists`);
      }

      const now = new Date();
      const entity: MinerEntity = {
        id: input.id,
        name: input.name,
        host: input.host,
        port: input.port ?? 80,
        username: input.username ?? 'root',
        password: input.password,
        useTls: input.useTls ?? false,
        tenantId: input.tenantId,
        tags: input.tags ?? [],
        createdAt: now,
        updatedAt: now,
      };

      miners.set(input.id, entity);

      // Cache the entity
      if (cache) {
        await cache.set(cacheKeys.miner(input.id), entity, cacheTTL.SESSION);
      }

      repoLogger.info('Miner created', { id: input.id, host: input.host });
      return entity;
    },

    async findById(id: string): Promise<MinerEntity | null> {
      // Check cache first
      if (cache) {
        const cached = await cache.get<MinerEntity>(cacheKeys.miner(id));
        if (cached) {
          repoLogger.debug('Cache hit for miner', { id });
          return cached;
        }
      }

      const entity = miners.get(id) ?? null;

      // Populate cache on miss
      if (entity && cache) {
        await cache.set(cacheKeys.miner(id), entity, cacheTTL.SESSION);
      }

      return entity;
    },

    async findAll(filter?: MinerFilter, pagination?: Pagination): Promise<PaginatedResult<MinerEntity>> {
      let results = Array.from(miners.values());

      // Apply filters
      if (filter) {
        if (filter.tenantId) {
          results = results.filter((m) => m.tenantId === filter.tenantId);
        }

        if (filter.tags && filter.tags.length > 0) {
          results = results.filter((m) => filter.tags!.some((tag) => m.tags.includes(tag)));
        }
      }

      // Apply sorting
      const sortBy = pagination?.sortBy ?? 'name';
      const sortOrder = pagination?.sortOrder ?? 'asc';
      const sortMultiplier = sortOrder === 'asc' ? 1 : -1;

      results.sort((a, b) => {
        const aVal = a[sortBy as keyof MinerEntity] ?? '';
        const bVal = b[sortBy as keyof MinerEntity] ?? '';
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * sortMultiplier;
        }
        return 0;
      });

      // Apply pagination
      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 20;
      const total = results.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const paginatedData = results.slice(offset, offset + limit);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    },

    async update(id: string, input: Partial<MinerRegistrationInput>): Promise<MinerEntity> {
      const existing = miners.get(id);
      if (!existing) {
        throw new MinerNotFoundError(id);
      }

      const updated: MinerEntity = {
        ...existing,
        ...input,
        id: existing.id, // ID cannot be changed
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      };

      miners.set(id, updated);

      // Update cache
      if (cache) {
        await cache.set(cacheKeys.miner(id), updated, cacheTTL.SESSION);
      }

      repoLogger.info('Miner updated', { id });
      return updated;
    },

    async delete(id: string): Promise<void> {
      if (!miners.has(id)) {
        throw new MinerNotFoundError(id);
      }

      miners.delete(id);

      // Clear cache
      if (cache) {
        await cache.delete(cacheKeys.miner(id));
        await cache.delete(cacheKeys.miner(`status:${id}`));
      }

      repoLogger.info('Miner deleted', { id });
    },

    async exists(id: string): Promise<boolean> {
      return miners.has(id);
    },

    async findByIds(ids: string[]): Promise<MinerEntity[]> {
      return ids.map((id) => miners.get(id)).filter((m): m is MinerEntity => m !== undefined);
    },

    async findByTenant(tenantId: string): Promise<MinerEntity[]> {
      return Array.from(miners.values()).filter((m) => m.tenantId === tenantId);
    },

    async findByTags(tags: string[]): Promise<MinerEntity[]> {
      return Array.from(miners.values()).filter((m) => tags.some((tag) => m.tags.includes(tag)));
    },
  };
}

/**
 * Creates a miner status repository.
 *
 * @param braiins - Braiins API client
 * @param minerRepo - Miner repository for entity access
 * @param cache - Optional Redis client for caching
 * @returns Miner status repository instance
 */
export function createMinerStatusRepository(
  braiins: BraiinsClient,
  minerRepo: IMinerRepository,
  cache: RedisClient | null
): IMinerStatusRepository {
  /**
   * Ensures authentication for a miner.
   */
  async function ensureAuth(entity: MinerEntity): Promise<void> {
    if (!braiins.isAuthenticated(entity.host)) {
      await braiins.authenticate({
        host: entity.host,
        port: entity.port,
        username: entity.username,
        password: entity.password,
        useTls: entity.useTls,
      });
    }
  }

  /**
   * Fetches real-time status from a miner.
   */
  async function fetchStatus(entity: MinerEntity): Promise<MinerStatus> {
    try {
      await ensureAuth(entity);

      const [info, hashboards, pools, tunerState, errors] = await Promise.all([
        braiins.getMinerInfo(entity.host),
        braiins.getHashboards(entity.host),
        braiins.getPools(entity.host),
        braiins.getTunerState(entity.host),
        braiins.getErrors(entity.host),
      ]);

      // Calculate aggregates
      let hashrateThs = 0;
      let maxTemp = 0;
      let powerWatts = 0;

      if (hashboards?.hashboards) {
        for (const board of hashboards.hashboards) {
          if (board.stats?.hashrate?.terahash_per_second) {
            hashrateThs += board.stats.hashrate.terahash_per_second;
          } else if (board.stats?.hashrate?.gigahash_per_second) {
            hashrateThs += board.stats.hashrate.gigahash_per_second / 1000;
          }

          if (board.highest_chip_temp?.celsius) {
            maxTemp = Math.max(maxTemp, board.highest_chip_temp.celsius);
          }
        }
      }

      if (tunerState?.mode_state?.powertargetmodestate?.current_target?.watt) {
        powerWatts = tunerState.mode_state.powertargetmodestate.current_target.watt;
      }

      return {
        id: entity.id,
        name: entity.name,
        host: entity.host,
        online: true,
        info,
        hashboards,
        pools,
        tunerState,
        errors,
        hashrateThs,
        maxTemperatureCelsius: maxTemp,
        powerWatts,
        lastUpdated: new Date(),
      };
    } catch (error) {
      repoLogger.warn('Failed to fetch miner status', {
        id: entity.id,
        host: entity.host,
        error: error instanceof Error ? error.message : 'Unknown',
      });

      return {
        id: entity.id,
        name: entity.name,
        host: entity.host,
        online: false,
        hashrateThs: 0,
        maxTemperatureCelsius: 0,
        powerWatts: 0,
        lastUpdated: new Date(),
      };
    }
  }

  return {
    async getStatus(minerId: string): Promise<MinerStatus | null> {
      const entity = await minerRepo.findById(minerId);
      if (!entity) return null;

      // Check cache
      if (cache) {
        const cached = await cache.get<MinerStatus>(cacheKeys.miner(`status:${minerId}`));
        if (cached) {
          repoLogger.debug('Cache hit for miner status', { minerId });
          return {
            ...cached,
            lastUpdated: new Date(cached.lastUpdated),
          };
        }
      }

      const status = await fetchStatus(entity);

      // Cache result
      if (cache) {
        await cache.set(cacheKeys.miner(`status:${minerId}`), status, cacheTTL.MINER_STATUS);
      }

      return status;
    },

    async getStatuses(minerIds: string[]): Promise<Map<string, MinerStatus>> {
      const result = new Map<string, MinerStatus>();
      const entities = await minerRepo.findByIds(minerIds);

      // Fetch all in parallel
      const statuses = await Promise.all(entities.map((e) => fetchStatus(e)));

      for (const status of statuses) {
        result.set(status.id, status);

        // Cache each
        if (cache) {
          await cache.set(cacheKeys.miner(`status:${status.id}`), status, cacheTTL.MINER_STATUS);
        }
      }

      return result;
    },

    async getFleetStatus(tenantId?: string): Promise<FleetStatus> {
      // Get all miners (filtered by tenant if provided)
      const { data: miners } = await minerRepo.findAll(
        tenantId ? { status: 'all', tenantId } : { status: 'all' },
        { page: 1, limit: 1000, sortBy: 'name', sortOrder: 'asc' }
      );

      // Fetch all statuses in parallel
      const statuses = await Promise.all(miners.map((m) => fetchStatus(m)));

      // Calculate aggregates
      const online = statuses.filter((s) => s.online);
      let totalHashrate = 0;
      let totalTemp = 0;
      let tempCount = 0;
      let totalPower = 0;
      let totalErrors = 0;

      for (const status of statuses) {
        if (status.online) {
          totalHashrate += status.hashrateThs;
          totalPower += status.powerWatts;

          if (status.maxTemperatureCelsius > 0) {
            totalTemp += status.maxTemperatureCelsius;
            tempCount++;
          }
        }

        if (status.errors?.errors) {
          totalErrors += status.errors.errors.length;
        }
      }

      return {
        total: statuses.length,
        online: online.length,
        offline: statuses.length - online.length,
        totalHashrateThs: totalHashrate,
        avgTemperatureCelsius: tempCount > 0 ? totalTemp / tempCount : 0,
        totalPowerWatts: totalPower,
        errors: totalErrors,
        miners: statuses,
        calculatedAt: new Date(),
      };
    },

    async invalidateStatus(minerId: string): Promise<void> {
      if (cache) {
        await cache.delete(cacheKeys.miner(`status:${minerId}`));
        repoLogger.debug('Status cache invalidated', { minerId });
      }
    },
  };
}
