/**
 * Miner Service
 *
 * High-level service for miner operations that combines
 * the Braiins API client with caching and business logic.
 *
 * @module services/miner
 */

import { BraiinsClient, MinerConnectionConfig, MinerInfo, HashboardsResponse, PoolsResponse, TunerStateResponse, ErrorsResponse, HashrateTarget, PowerTarget } from '../api/braiins';
import { RedisClient, cacheKeys, cacheTTL } from '../cache/redis';
import { MinerNotFoundError, ValidationError } from '../utils/errors';
import { createChildLogger } from '../utils/logger';

const serviceLogger = createChildLogger({ module: 'miner-service' });

/**
 * Miner registration entry.
 */
export interface MinerRegistration {
  id: string;
  name: string;
  host: string;
  port?: number;
  username: string;
  password: string;
  useTls?: boolean;
  tenantId?: string;
  tags?: string[];
}

/**
 * Miner status summary.
 */
export interface MinerStatusSummary {
  id: string;
  name: string;
  host: string;
  online: boolean;
  info?: MinerInfo;
  hashboards?: HashboardsResponse;
  pools?: PoolsResponse;
  tunerState?: TunerStateResponse;
  errors?: ErrorsResponse;
  lastUpdated: string;
}

/**
 * Fleet status summary.
 */
export interface FleetStatusSummary {
  totalMiners: number;
  onlineMiners: number;
  offlineMiners: number;
  totalHashrateThs: number;
  avgTemperatureCelsius: number;
  totalPowerWatts: number;
  miners: MinerStatusSummary[];
  calculatedAt: string;
}

/**
 * Miner service interface.
 */
export interface MinerService {
  // Registration
  registerMiner(registration: MinerRegistration): Promise<void>;
  unregisterMiner(minerId: string): Promise<void>;
  getRegisteredMiners(): Promise<MinerRegistration[]>;

  // Status
  getMinerStatus(minerId: string): Promise<MinerStatusSummary>;
  getFleetStatus(tenantId?: string): Promise<FleetStatusSummary>;
  refreshMinerStatus(minerId: string): Promise<MinerStatusSummary>;

  // Operations
  rebootMiner(minerId: string): Promise<void>;
  setHashrateTarget(minerId: string, target: HashrateTarget): Promise<void>;
  setPowerTarget(minerId: string, target: PowerTarget): Promise<void>;

  // Cleanup
  disconnectAll(): void;
}

/**
 * Creates a miner service instance.
 *
 * @param braiins - Braiins API client
 * @param cache - Redis cache client (optional)
 * @returns Miner service instance
 */
export function createMinerService(braiins: BraiinsClient, cache: RedisClient | null): MinerService {
  // In-memory registry (would be database in production)
  const minerRegistry = new Map<string, MinerRegistration>();

  /**
   * Gets miner registration or throws.
   */
  function getRegistration(minerId: string): MinerRegistration {
    const registration = minerRegistry.get(minerId);
    if (!registration) {
      throw new MinerNotFoundError(minerId);
    }
    return registration;
  }

  /**
   * Builds connection config from registration.
   */
  function toConnectionConfig(reg: MinerRegistration): MinerConnectionConfig {
    return {
      host: reg.host,
      port: reg.port,
      username: reg.username,
      password: reg.password,
      useTls: reg.useTls,
    };
  }

  /**
   * Ensures miner is authenticated.
   */
  async function ensureAuthenticated(reg: MinerRegistration): Promise<void> {
    if (!braiins.isAuthenticated(reg.host)) {
      await braiins.authenticate(toConnectionConfig(reg));
    }
  }

  /**
   * Fetches full miner status from API.
   */
  async function fetchMinerStatus(reg: MinerRegistration): Promise<MinerStatusSummary> {
    try {
      await ensureAuthenticated(reg);

      // Fetch all data in parallel
      const [info, hashboards, pools, tunerState, errors] = await Promise.all([
        braiins.getMinerInfo(reg.host),
        braiins.getHashboards(reg.host),
        braiins.getPools(reg.host),
        braiins.getTunerState(reg.host),
        braiins.getErrors(reg.host),
      ]);

      return {
        id: reg.id,
        name: reg.name,
        host: reg.host,
        online: true,
        info,
        hashboards,
        pools,
        tunerState,
        errors,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      serviceLogger.warn('Failed to fetch miner status', {
        minerId: reg.id,
        host: reg.host,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        id: reg.id,
        name: reg.name,
        host: reg.host,
        online: false,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  return {
    // ==================== Registration ====================

    async registerMiner(registration: MinerRegistration): Promise<void> {
      if (!registration.id || !registration.host || !registration.username) {
        throw new ValidationError('Miner registration requires id, host, and username');
      }

      minerRegistry.set(registration.id, registration);

      // Store in cache if available
      if (cache) {
        await cache.set(cacheKeys.miner(registration.id), registration, cacheTTL.SESSION);
      }

      serviceLogger.info('Miner registered', {
        minerId: registration.id,
        host: registration.host,
      });
    },

    async unregisterMiner(minerId: string): Promise<void> {
      const reg = minerRegistry.get(minerId);
      if (reg) {
        braiins.disconnect(reg.host);
        minerRegistry.delete(minerId);

        if (cache) {
          await cache.delete(cacheKeys.miner(minerId));
        }

        serviceLogger.info('Miner unregistered', { minerId });
      }
    },

    async getRegisteredMiners(): Promise<MinerRegistration[]> {
      return Array.from(minerRegistry.values());
    },

    // ==================== Status ====================

    async getMinerStatus(minerId: string): Promise<MinerStatusSummary> {
      const reg = getRegistration(minerId);

      // Try cache first
      if (cache) {
        const cached = await cache.get<MinerStatusSummary>(cacheKeys.miner(`status:${minerId}`));
        if (cached) {
          serviceLogger.debug('Cache hit for miner status', { minerId });
          return cached;
        }
      }

      // Fetch from API
      const status = await fetchMinerStatus(reg);

      // Cache the result
      if (cache) {
        await cache.set(cacheKeys.miner(`status:${minerId}`), status, cacheTTL.MINER_STATUS);
      }

      return status;
    },

    async getFleetStatus(tenantId?: string): Promise<FleetStatusSummary> {
      const registrations = Array.from(minerRegistry.values()).filter((reg) => !tenantId || reg.tenantId === tenantId);

      // Fetch status for all miners in parallel
      const statuses = await Promise.all(registrations.map((reg) => this.getMinerStatus(reg.id)));

      // Calculate aggregates
      const onlineMiners = statuses.filter((s) => s.online);
      let totalHashrateThs = 0;
      let totalTemp = 0;
      let tempCount = 0;
      let totalPower = 0;

      for (const status of onlineMiners) {
        // Sum hashrate from hashboards
        if (status.hashboards) {
          for (const board of status.hashboards.hashboards) {
            if (board.stats?.hashrate?.terahash_per_second) {
              totalHashrateThs += board.stats.hashrate.terahash_per_second;
            } else if (board.stats?.hashrate?.gigahash_per_second) {
              totalHashrateThs += board.stats.hashrate.gigahash_per_second / 1000;
            }

            // Track temperature
            if (board.highest_chip_temp?.celsius) {
              totalTemp += board.highest_chip_temp.celsius;
              tempCount++;
            }
          }
        }

        // Get power from tuner state
        if (status.tunerState?.mode_state?.powertargetmodestate?.current_target?.watt) {
          totalPower += status.tunerState.mode_state.powertargetmodestate.current_target.watt;
        }
      }

      return {
        totalMiners: statuses.length,
        onlineMiners: onlineMiners.length,
        offlineMiners: statuses.length - onlineMiners.length,
        totalHashrateThs,
        avgTemperatureCelsius: tempCount > 0 ? totalTemp / tempCount : 0,
        totalPowerWatts: totalPower,
        miners: statuses,
        calculatedAt: new Date().toISOString(),
      };
    },

    async refreshMinerStatus(minerId: string): Promise<MinerStatusSummary> {
      const reg = getRegistration(minerId);

      // Clear cache
      if (cache) {
        await cache.delete(cacheKeys.miner(`status:${minerId}`));
      }

      // Fetch fresh data
      const status = await fetchMinerStatus(reg);

      // Cache the result
      if (cache) {
        await cache.set(cacheKeys.miner(`status:${minerId}`), status, cacheTTL.MINER_STATUS);
      }

      return status;
    },

    // ==================== Operations ====================

    async rebootMiner(minerId: string): Promise<void> {
      const reg = getRegistration(minerId);
      await ensureAuthenticated(reg);

      serviceLogger.info('Rebooting miner', { minerId, host: reg.host });
      await braiins.reboot(reg.host);

      // Invalidate cache
      if (cache) {
        await cache.delete(cacheKeys.miner(`status:${minerId}`));
      }
    },

    async setHashrateTarget(minerId: string, target: HashrateTarget): Promise<void> {
      const reg = getRegistration(minerId);
      await ensureAuthenticated(reg);

      serviceLogger.info('Setting hashrate target', {
        minerId,
        target: target.terahash_per_second,
      });
      await braiins.setHashrateTarget(reg.host, target);

      // Invalidate cache
      if (cache) {
        await cache.delete(cacheKeys.miner(`status:${minerId}`));
      }
    },

    async setPowerTarget(minerId: string, target: PowerTarget): Promise<void> {
      const reg = getRegistration(minerId);
      await ensureAuthenticated(reg);

      serviceLogger.info('Setting power target', {
        minerId,
        target: target.watt,
      });
      await braiins.setPowerTarget(reg.host, target);

      // Invalidate cache
      if (cache) {
        await cache.delete(cacheKeys.miner(`status:${minerId}`));
      }
    },

    // ==================== Cleanup ====================

    disconnectAll(): void {
      braiins.disconnectAll();
      minerRegistry.clear();
    },
  };
}
