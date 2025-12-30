/**
 * Application Constants
 *
 * Centralized configuration constants for the braiins-os-mcp-server.
 * These values are compile-time constants and should not change at runtime.
 *
 * @module config/constants
 */

/**
 * MCP Server metadata
 */
export const SERVER_INFO = {
  name: 'braiins-os-mcp-server',
  version: '0.1.0',
  description: 'Model Context Protocol server for Braiins OS+ miner management',
} as const;

/**
 * Cache key prefixes for Redis namespacing
 */
export const CACHE_KEYS = {
  MINER: 'miner:',
  FLEET: 'fleet:',
  SESSION: 'session:',
  RATE_LIMIT: 'ratelimit:',
  FIRMWARE: 'firmware:',
  TASK: 'task:',
  JOB: 'job:',
} as const;

/**
 * Default TTL values for cached data (in seconds)
 */
export const CACHE_TTL = {
  MINER_STATUS: 60, // 1 minute
  FLEET_STATUS: 120, // 2 minutes
  FIRMWARE_LIST: 3600, // 1 hour
  SESSION: 86400, // 24 hours
  RATE_LIMIT_WINDOW: 60, // 1 minute
  JOB_STATUS: 3600, // 1 hour
} as const;

/**
 * gRPC connection settings
 */
export const GRPC_CONFIG = {
  DEFAULT_TIMEOUT_MS: 30000, // 30 seconds
  MAX_RETRIES: 3,
  INITIAL_BACKOFF_MS: 1000,
  MAX_BACKOFF_MS: 10000,
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * Firmware update settings
 */
export const FIRMWARE_CONFIG = {
  UPDATE_TIMEOUT_MS: 2700000, // 45 minutes
  PROGRESS_POLL_INTERVAL_MS: 5000, // 5 seconds
  MAX_CONCURRENT_UPDATES: 10,
  CHECKSUM_ALGORITHM: 'sha256',
} as const;

/**
 * API rate limiting defaults
 */
export const RATE_LIMIT_CONFIG = {
  DEFAULT_REQUESTS_PER_MINUTE: 1000,
  AUTH_REQUESTS_PER_MINUTE: 5, // Stricter for auth endpoints
  BURST_MULTIPLIER: 1.5,
} as const;

/**
 * Logging constants
 */
export const LOG_CONFIG = {
  MAX_MESSAGE_LENGTH: 10000,
  SENSITIVE_FIELDS: ['password', 'apiKey', 'secret', 'token', 'authorization'],
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Error codes for API responses
 */
export const ERROR_CODES = {
  // Client errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',

  // Miner-specific errors
  MINER_NOT_FOUND: 'MINER_NOT_FOUND',
  MINER_OFFLINE: 'MINER_OFFLINE',
  MINER_BUSY: 'MINER_BUSY',
  FIRMWARE_INCOMPATIBLE: 'FIRMWARE_INCOMPATIBLE',
  FIRMWARE_UPDATE_FAILED: 'FIRMWARE_UPDATE_FAILED',

  // Connection errors
  GRPC_CONNECTION_FAILED: 'GRPC_CONNECTION_FAILED',
  GRPC_TIMEOUT: 'GRPC_TIMEOUT',
  REDIS_CONNECTION_FAILED: 'REDIS_CONNECTION_FAILED',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * MCP resource URI schemes
 */
export const MCP_SCHEMES = {
  MINER: 'miner://',
  FLEET: 'fleet://',
  FIRMWARE: 'firmware://',
  CONFIG: 'config://',
} as const;
