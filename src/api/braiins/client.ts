/**
 * Braiins OS+ API Client
 *
 * HTTP client for communicating with Braiins OS miners.
 * Handles authentication, request retries, and error handling.
 *
 * @module api/braiins/client
 */

import { ERROR_CODES, HTTP_STATUS } from '../../config/constants';
import { AppError, UnauthorizedError } from '../../utils/errors';
import { createChildLogger } from '../../utils/logger';
import type {
  MinerConnectionConfig,
  BraiinsClientOptions,
  LoginResponse,
  MinerInfo,
  ErrorsResponse,
  HashboardsResponse,
  HashboardEnableRequest,
  HashboardEnableResponse,
  PoolsResponse,
  CreatePoolGroupRequest,
  PoolGroup,
  HashrateTarget,
  PowerTarget,
  QuickRampConfig,
  PerformanceProfilesResponse,
  TunerStateResponse,
  DpsConfigRequest,
  DpsConfigResponse,
  CoolingConfigRequest,
  NetworkConfigResponse,
  NetworkConfigRequest,
} from './types';

const clientLogger = createChildLogger({ module: 'braiins-client' });

/**
 * Default client configuration.
 */
const DEFAULT_OPTIONS: Required<BraiinsClientOptions> = {
  defaultTimeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
};

/**
 * Braiins API error with additional context.
 */
export class BraiinsApiError extends AppError {
  constructor(
    message: string,
    public readonly minerHost: string,
    public readonly endpoint: string,
    statusCode: number = HTTP_STATUS.BAD_GATEWAY,
    retryable = false
  ) {
    super(ERROR_CODES.GRPC_CONNECTION_FAILED, message, statusCode, retryable, {
      minerHost,
      endpoint,
    });
    this.name = 'BraiinsApiError';
  }
}

/**
 * Session state for an authenticated miner connection.
 */
interface MinerSession {
  token: string;
  expiresAt: number;
  config: MinerConnectionConfig;
}

/**
 * Braiins OS API Client interface.
 */
export interface BraiinsClient {
  // Authentication
  authenticate(config: MinerConnectionConfig): Promise<string>;
  isAuthenticated(host: string): boolean;

  // Miner Information
  getMinerInfo(host: string): Promise<MinerInfo>;
  getErrors(host: string): Promise<ErrorsResponse>;

  // Hashboards
  getHashboards(host: string): Promise<HashboardsResponse>;
  setHashboardsEnabled(host: string, request: HashboardEnableRequest): Promise<HashboardEnableResponse>;

  // Pools
  getPools(host: string): Promise<PoolsResponse>;
  createPoolGroup(host: string, request: CreatePoolGroupRequest): Promise<PoolGroup>;
  updatePools(host: string, pools: PoolsResponse): Promise<void>;

  // Performance
  setHashrateTarget(host: string, target: HashrateTarget): Promise<HashrateTarget>;
  incrementHashrateTarget(host: string, increment: HashrateTarget): Promise<HashrateTarget>;
  decrementHashrateTarget(host: string, decrement: HashrateTarget): Promise<HashrateTarget>;
  setPowerTarget(host: string, target: PowerTarget): Promise<PowerTarget>;
  incrementPowerTarget(host: string, increment: PowerTarget): Promise<PowerTarget>;
  decrementPowerTarget(host: string, decrement: PowerTarget): Promise<PowerTarget>;
  setQuickRamp(host: string, config: QuickRampConfig): Promise<void>;
  getPerformanceProfiles(host: string): Promise<PerformanceProfilesResponse>;
  getTunerState(host: string): Promise<TunerStateResponse>;

  // DPS
  configureDps(host: string, config: DpsConfigRequest): Promise<DpsConfigResponse>;

  // Cooling
  setCooling(host: string, config: CoolingConfigRequest): Promise<void>;

  // Network
  getNetworkConfig(host: string): Promise<NetworkConfigResponse>;
  setNetworkConfig(host: string, config: NetworkConfigRequest): Promise<void>;

  // System
  reboot(host: string): Promise<void>;

  // Session management
  disconnect(host: string): void;
  disconnectAll(): void;
}

/**
 * Creates a Braiins OS API client.
 *
 * @param options - Client configuration options
 * @returns Braiins API client instance
 */
export function createBraiinsClient(options: BraiinsClientOptions = {}): BraiinsClient {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const sessions = new Map<string, MinerSession>();

  /**
   * Gets the base URL for a miner.
   */
  function getBaseUrl(minerConfig: MinerConnectionConfig): string {
    const protocol = minerConfig.useTls ? 'https' : 'http';
    const port = minerConfig.port ?? (minerConfig.useTls ? 443 : 80);
    return `${protocol}://${minerConfig.host}:${port}`;
  }

  /**
   * Gets an active session for a host, or throws if not authenticated.
   */
  function getSession(host: string): MinerSession {
    const session = sessions.get(host);
    if (!session) {
      throw new UnauthorizedError(`Not authenticated to miner at ${host}`);
    }

    // Check if token is expired (with 60s buffer)
    if (Date.now() > session.expiresAt - 60000) {
      sessions.delete(host);
      throw new UnauthorizedError(`Session expired for miner at ${host}`);
    }

    return session;
  }

  /**
   * Makes an authenticated HTTP request with retry logic.
   */
  async function request<T>(host: string, method: string, endpoint: string, body?: unknown): Promise<T> {
    const session = getSession(host);
    const url = `${getBaseUrl(session.config)}${endpoint}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        clientLogger.debug(`API request attempt ${attempt}`, {
          host,
          method,
          endpoint,
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.defaultTimeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            sessions.delete(host);
            throw new UnauthorizedError('Authentication token rejected');
          }

          const errorText = await response.text().catch(() => 'Unknown error');
          throw new BraiinsApiError(`API request failed: ${response.status} ${errorText}`, host, endpoint, response.status, response.status >= 500);
        }

        // Handle empty responses
        const text = await response.text();
        if (!text) {
          return {} as T;
        }

        return JSON.parse(text) as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry auth errors
        if (error instanceof UnauthorizedError) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === config.maxRetries) {
          break;
        }

        clientLogger.warn(`Request failed, retrying...`, {
          host,
          endpoint,
          attempt,
          error: lastError.message,
        });

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, config.retryDelay * Math.pow(2, attempt - 1)));
      }
    }

    throw new BraiinsApiError(`Request failed after ${config.maxRetries} attempts: ${lastError?.message}`, host, endpoint, HTTP_STATUS.BAD_GATEWAY, true);
  }

  return {
    // ==================== Authentication ====================

    async authenticate(minerConfig: MinerConnectionConfig): Promise<string> {
      const url = `${getBaseUrl(minerConfig)}/api/v1/login`;

      clientLogger.info('Authenticating to miner', { host: minerConfig.host });

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.defaultTimeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: minerConfig.username,
            password: minerConfig.password,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new UnauthorizedError(`Authentication failed: ${response.status}`);
        }

        const data = (await response.json()) as LoginResponse;

        // Store session
        sessions.set(minerConfig.host, {
          token: data.token,
          expiresAt: Date.now() + data.timeout_s * 1000,
          config: minerConfig,
        });

        clientLogger.info('Authentication successful', {
          host: minerConfig.host,
          expiresIn: data.timeout_s,
        });

        return data.token;
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }
        throw new BraiinsApiError(`Failed to authenticate: ${error instanceof Error ? error.message : 'Unknown error'}`, minerConfig.host, '/api/v1/login', HTTP_STATUS.BAD_GATEWAY, true);
      }
    },

    isAuthenticated(host: string): boolean {
      const session = sessions.get(host);
      if (!session) {
        return false;
      }
      return Date.now() < session.expiresAt - 60000;
    },

    // ==================== Miner Information ====================

    async getMinerInfo(host: string): Promise<MinerInfo> {
      return request<MinerInfo>(host, 'GET', '/api/v1/info');
    },

    async getErrors(host: string): Promise<ErrorsResponse> {
      return request<ErrorsResponse>(host, 'GET', '/api/v1/errors');
    },

    // ==================== Hashboards ====================

    async getHashboards(host: string): Promise<HashboardsResponse> {
      return request<HashboardsResponse>(host, 'GET', '/api/v1/hashboards');
    },

    async setHashboardsEnabled(host: string, req: HashboardEnableRequest): Promise<HashboardEnableResponse> {
      return request<HashboardEnableResponse>(host, 'POST', '/api/v1/hashboards/enable', req);
    },

    // ==================== Pools ====================

    async getPools(host: string): Promise<PoolsResponse> {
      return request<PoolsResponse>(host, 'GET', '/api/v1/pools');
    },

    async createPoolGroup(host: string, req: CreatePoolGroupRequest): Promise<PoolGroup> {
      return request<PoolGroup>(host, 'POST', '/api/v1/pools', req);
    },

    async updatePools(host: string, pools: PoolsResponse): Promise<void> {
      await request<void>(host, 'PUT', '/api/v1/pools', pools);
    },

    // ==================== Performance ====================

    async setHashrateTarget(host: string, target: HashrateTarget): Promise<HashrateTarget> {
      return request<HashrateTarget>(host, 'POST', '/api/v1/performance/hashrate-target', target);
    },

    async incrementHashrateTarget(host: string, increment: HashrateTarget): Promise<HashrateTarget> {
      return request<HashrateTarget>(host, 'POST', '/api/v1/performance/hashrate-target/increment', increment);
    },

    async decrementHashrateTarget(host: string, decrement: HashrateTarget): Promise<HashrateTarget> {
      return request<HashrateTarget>(host, 'POST', '/api/v1/performance/hashrate-target/decrement', decrement);
    },

    async setPowerTarget(host: string, target: PowerTarget): Promise<PowerTarget> {
      return request<PowerTarget>(host, 'POST', '/api/v1/performance/power-target', target);
    },

    async incrementPowerTarget(host: string, increment: PowerTarget): Promise<PowerTarget> {
      return request<PowerTarget>(host, 'POST', '/api/v1/performance/power-target/increment', increment);
    },

    async decrementPowerTarget(host: string, decrement: PowerTarget): Promise<PowerTarget> {
      return request<PowerTarget>(host, 'POST', '/api/v1/performance/power-target/decrement', decrement);
    },

    async setQuickRamp(host: string, rampConfig: QuickRampConfig): Promise<void> {
      await request<void>(host, 'POST', '/api/v1/performance/quick-ramp', rampConfig);
    },

    async getPerformanceProfiles(host: string): Promise<PerformanceProfilesResponse> {
      return request<PerformanceProfilesResponse>(host, 'GET', '/api/v1/performance/profiles');
    },

    async getTunerState(host: string): Promise<TunerStateResponse> {
      return request<TunerStateResponse>(host, 'GET', '/api/v1/performance/tuner-state');
    },

    // ==================== DPS ====================

    async configureDps(host: string, dpsConfig: DpsConfigRequest): Promise<DpsConfigResponse> {
      return request<DpsConfigResponse>(host, 'POST', '/api/v1/dps', dpsConfig);
    },

    // ==================== Cooling ====================

    async setCooling(host: string, coolingConfig: CoolingConfigRequest): Promise<void> {
      await request<void>(host, 'POST', '/api/v1/cooling', coolingConfig);
    },

    // ==================== Network ====================

    async getNetworkConfig(host: string): Promise<NetworkConfigResponse> {
      return request<NetworkConfigResponse>(host, 'GET', '/api/v1/network');
    },

    async setNetworkConfig(host: string, networkConfig: NetworkConfigRequest): Promise<void> {
      await request<void>(host, 'POST', '/api/v1/network', networkConfig);
    },

    // ==================== System ====================

    async reboot(host: string): Promise<void> {
      await request<void>(host, 'POST', '/api/v1/actions/reboot');
    },

    // ==================== Session Management ====================

    disconnect(host: string): void {
      sessions.delete(host);
      clientLogger.debug('Disconnected from miner', { host });
    },

    disconnectAll(): void {
      const count = sessions.size;
      sessions.clear();
      clientLogger.info('Disconnected from all miners', { count });
    },
  };
}
