/**
 * gRPC Client Module
 *
 * Provides a gRPC client wrapper for Braiins OS+ miner communication
 * with connection management, retry logic, and error handling.
 *
 * @module api/grpc/client
 */

import * as grpc from '@grpc/grpc-js';
import { GRPC_CONFIG } from '../../config/constants';
import { GrpcConnectionError } from '../../utils/errors';
import { createChildLogger } from '../../utils/logger';

const grpcLogger = createChildLogger({ module: 'grpc' });

/**
 * gRPC client configuration options.
 */
export interface GrpcConfig {
  defaultHost: string;
  defaultPort: number;
  useTls: boolean;
  timeout?: number;
}

/**
 * Miner connection information.
 */
export interface MinerConnection {
  host: string;
  port: number;
}

/**
 * gRPC client interface for miner operations.
 */
export interface GrpcClient {
  /**
   * Get miner status.
   */
  getMinerStatus(connection: MinerConnection): Promise<MinerStatus>;

  /**
   * List all hashboards.
   */
  getHashboards(connection: MinerConnection): Promise<Hashboard[]>;

  /**
   * Get current firmware version.
   */
  getFirmwareVersion(connection: MinerConnection): Promise<FirmwareInfo>;

  /**
   * Reboot the miner.
   */
  rebootMiner(connection: MinerConnection): Promise<void>;

  /**
   * Update miner configuration.
   */
  setConfiguration(connection: MinerConnection, config: MinerConfig): Promise<void>;

  /**
   * Start firmware update.
   */
  startFirmwareUpdate(connection: MinerConnection, firmwareUrl: string): Promise<string>;

  /**
   * Check firmware update progress.
   */
  getFirmwareUpdateProgress(connection: MinerConnection, taskId: string): Promise<UpdateProgress>;

  /**
   * Test connection to a miner.
   */
  testConnection(connection: MinerConnection): Promise<boolean>;

  /**
   * Close all connections.
   */
  close(): Promise<void>;
}

/**
 * Miner status response.
 */
export interface MinerStatus {
  online: boolean;
  uptime: number;
  hashrate: number;
  temperature: number;
  fanSpeed: number;
  powerConsumption: number;
  efficiency: number;
  poolUrl: string;
  workerName: string;
  shares: {
    accepted: number;
    rejected: number;
    stale: number;
  };
}

/**
 * Hashboard information.
 */
export interface Hashboard {
  id: number;
  status: 'active' | 'disabled' | 'error';
  temperature: number;
  hashrate: number;
  chips: {
    total: number;
    active: number;
    disabled: number;
  };
}

/**
 * Firmware information.
 */
export interface FirmwareInfo {
  version: string;
  buildDate: string;
  model: string;
  features: string[];
}

/**
 * Miner configuration.
 */
export interface MinerConfig {
  poolUrl?: string;
  poolUser?: string;
  poolPassword?: string;
  frequency?: number;
  voltage?: number;
  fanSpeed?: number;
  autotuneEnabled?: boolean;
}

/**
 * Update progress information.
 */
export interface UpdateProgress {
  taskId: string;
  status: 'pending' | 'downloading' | 'installing' | 'rebooting' | 'completed' | 'failed';
  progress: number;
  message: string;
  error?: string;
}

/**
 * Creates a gRPC client with the specified configuration.
 *
 * @param config - gRPC client configuration
 * @returns gRPC client instance
 */
export async function createGrpcClient(config: GrpcConfig): Promise<GrpcClient> {
  // Connection pool to reuse channels
  const connections = new Map<string, grpc.Channel>();

  /**
   * Gets or creates a gRPC channel for a miner.
   */
  function getChannel(connection: MinerConnection): grpc.Channel {
    const key = `${connection.host}:${connection.port}`;

    let channel = connections.get(key);
    if (!channel) {
      const credentials = config.useTls ? grpc.credentials.createSsl() : grpc.credentials.createInsecure();

      channel = new grpc.Channel(key, credentials, {
        'grpc.keepalive_time_ms': 30000,
        'grpc.keepalive_timeout_ms': 10000,
        'grpc.max_receive_message_length': 50 * 1024 * 1024, // 50MB
      });

      connections.set(key, channel);
      grpcLogger.debug('Created new gRPC channel', { host: connection.host, port: connection.port });
    }

    return channel;
  }

  /**
   * Execute a gRPC call with retry logic.
   */
  async function withRetry<T>(operation: string, connection: MinerConnection, fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    let backoff: number = GRPC_CONFIG.INITIAL_BACKOFF_MS;

    for (let attempt = 1; attempt <= GRPC_CONFIG.MAX_RETRIES; attempt++) {
      try {
        grpcLogger.debug(`gRPC ${operation} attempt ${attempt}`, {
          host: connection.host,
          port: connection.port,
        });
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        grpcLogger.warn(`gRPC ${operation} failed (attempt ${attempt})`, {
          host: connection.host,
          port: connection.port,
          error: lastError.message,
        });

        if (attempt < GRPC_CONFIG.MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, backoff));
          backoff = Math.min(backoff * GRPC_CONFIG.BACKOFF_MULTIPLIER, GRPC_CONFIG.MAX_BACKOFF_MS);
        }
      }
    }

    throw new GrpcConnectionError(connection.host, connection.port, lastError?.message);
  }

  // Placeholder implementation - actual gRPC calls will be implemented
  // once proto files are added and types are generated

  return {
    async getMinerStatus(connection: MinerConnection): Promise<MinerStatus> {
      return withRetry('getMinerStatus', connection, async () => {
        // TODO: Implement actual gRPC call when proto types are generated
        grpcLogger.debug('getMinerStatus called', connection);
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async getHashboards(connection: MinerConnection): Promise<Hashboard[]> {
      return withRetry('getHashboards', connection, async () => {
        grpcLogger.debug('getHashboards called', connection);
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async getFirmwareVersion(connection: MinerConnection): Promise<FirmwareInfo> {
      return withRetry('getFirmwareVersion', connection, async () => {
        grpcLogger.debug('getFirmwareVersion called', connection);
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async rebootMiner(connection: MinerConnection): Promise<void> {
      return withRetry('rebootMiner', connection, async () => {
        grpcLogger.debug('rebootMiner called', connection);
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async setConfiguration(connection: MinerConnection, minerConfig: MinerConfig): Promise<void> {
      return withRetry('setConfiguration', connection, async () => {
        grpcLogger.debug('setConfiguration called', { ...connection, config: minerConfig });
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async startFirmwareUpdate(connection: MinerConnection, firmwareUrl: string): Promise<string> {
      return withRetry('startFirmwareUpdate', connection, async () => {
        grpcLogger.debug('startFirmwareUpdate called', { ...connection, firmwareUrl });
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async getFirmwareUpdateProgress(connection: MinerConnection, taskId: string): Promise<UpdateProgress> {
      return withRetry('getFirmwareUpdateProgress', connection, async () => {
        grpcLogger.debug('getFirmwareUpdateProgress called', { ...connection, taskId });
        throw new Error('Not implemented - waiting for proto file generation');
      });
    },

    async testConnection(connection: MinerConnection): Promise<boolean> {
      try {
        const channel = getChannel(connection);
        const state = channel.getConnectivityState(true);
        return state === grpc.connectivityState.READY || state === grpc.connectivityState.IDLE;
      } catch {
        return false;
      }
    },

    async close(): Promise<void> {
      for (const [key, channel] of connections) {
        channel.close();
        grpcLogger.debug('Closed gRPC channel', { key });
      }
      connections.clear();
    },
  };
}
