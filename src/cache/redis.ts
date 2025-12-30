/**
 * Redis Client Module
 *
 * Provides a Redis client wrapper with connection pooling,
 * automatic reconnection, and typed operations.
 *
 * @module cache/redis
 */

import Redis from 'ioredis';
import { CACHE_KEYS, CACHE_TTL } from '../config/constants';
import { RedisConnectionError } from '../utils/errors';
import { createChildLogger } from '../utils/logger';

const redisLogger = createChildLogger({ module: 'redis' });

/**
 * Redis client configuration options.
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

/**
 * Redis client interface for caching operations.
 */
export interface RedisClient {
  /**
   * Get a value by key.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set a value with optional TTL.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Delete a key.
   */
  delete(key: string): Promise<boolean>;

  /**
   * Delete keys matching a pattern.
   */
  deletePattern(pattern: string): Promise<number>;

  /**
   * Check if a key exists.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Set TTL on an existing key.
   */
  expire(key: string, ttlSeconds: number): Promise<boolean>;

  /**
   * Increment a counter.
   */
  incr(key: string): Promise<number>;

  /**
   * Publish a message to a channel.
   */
  publish(channel: string, message: unknown): Promise<number>;

  /**
   * Subscribe to a channel.
   */
  subscribe(channel: string, callback: (message: unknown) => void): Promise<void>;

  /**
   * Close the connection.
   */
  quit(): Promise<void>;

  /**
   * Get the underlying Redis instance.
   */
  getClient(): Redis;
}

/**
 * Creates a Redis client with the specified configuration.
 *
 * @param config - Redis connection configuration
 * @returns Redis client instance
 * @throws {RedisConnectionError} If connection fails
 */
export async function createRedisClient(config: RedisConfig): Promise<RedisClient> {
  const client = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db ?? 0,
    keyPrefix: config.keyPrefix ?? '',
    retryStrategy: (times: number) => {
      if (times > 10) {
        redisLogger.error('Max Redis reconnection attempts reached');
        return null;
      }
      const delay = Math.min(times * 200, 5000);
      redisLogger.warn(`Redis reconnecting in ${delay}ms (attempt ${times})`);
      return delay;
    },
    lazyConnect: true,
  });

  // Handle connection events
  client.on('error', (err: Error) => {
    redisLogger.error('Redis error', { error: err.message });
  });

  client.on('connect', () => {
    redisLogger.info('Redis connected');
  });

  client.on('ready', () => {
    redisLogger.info('Redis ready');
  });

  client.on('close', () => {
    redisLogger.warn('Redis connection closed');
  });

  // Attempt connection
  try {
    await client.connect();
  } catch (error) {
    throw new RedisConnectionError(config.host, config.port, error instanceof Error ? error.message : 'Unknown error');
  }

  // Subscriber client for pub/sub (separate connection required)
  let subscriber: Redis | null = null;

  return {
    async get<T>(key: string): Promise<T | null> {
      const value = await client.get(key);
      if (value === null) {
        return null;
      }
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    },

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttlSeconds !== undefined && ttlSeconds > 0) {
        await client.setex(key, ttlSeconds, serialized);
      } else {
        await client.set(key, serialized);
      }
    },

    async delete(key: string): Promise<boolean> {
      const result = await client.del(key);
      return result > 0;
    },

    async deletePattern(pattern: string): Promise<number> {
      const keys = await client.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }
      return client.del(...keys);
    },

    async exists(key: string): Promise<boolean> {
      const result = await client.exists(key);
      return result > 0;
    },

    async expire(key: string, ttlSeconds: number): Promise<boolean> {
      const result = await client.expire(key, ttlSeconds);
      return result === 1;
    },

    async incr(key: string): Promise<number> {
      return client.incr(key);
    },

    async publish(channel: string, message: unknown): Promise<number> {
      const serialized = typeof message === 'string' ? message : JSON.stringify(message);
      return client.publish(channel, serialized);
    },

    async subscribe(channel: string, callback: (message: unknown) => void): Promise<void> {
      if (!subscriber) {
        subscriber = client.duplicate();
        await subscriber.connect();
      }

      await subscriber.subscribe(channel);
      subscriber.on('message', (ch: string, msg: string) => {
        if (ch === channel) {
          try {
            callback(JSON.parse(msg));
          } catch {
            callback(msg);
          }
        }
      });
    },

    async quit(): Promise<void> {
      if (subscriber) {
        await subscriber.quit();
      }
      await client.quit();
    },

    getClient(): Redis {
      return client;
    },
  };
}

/**
 * Cache key generators for consistent key naming.
 */
export const cacheKeys = {
  miner: (id: string): string => `${CACHE_KEYS.MINER}${id}`,
  fleet: (id: string): string => `${CACHE_KEYS.FLEET}${id}`,
  session: (id: string): string => `${CACHE_KEYS.SESSION}${id}`,
  rateLimit: (userId: string): string => `${CACHE_KEYS.RATE_LIMIT}${userId}`,
  firmware: (version: string): string => `${CACHE_KEYS.FIRMWARE}${version}`,
  task: (id: string): string => `${CACHE_KEYS.TASK}${id}`,
  job: (id: string): string => `${CACHE_KEYS.JOB}${id}`,
};

/**
 * Default TTL values exported for convenience.
 */
export const cacheTTL = CACHE_TTL;
