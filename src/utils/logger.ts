/**
 * Logger Module
 *
 * Provides structured logging using Winston with support for
 * different log levels, transports, and log rotation.
 *
 * @module utils/logger
 */

import { createLogger as winstonCreateLogger, format, transports, type Logger, type transport } from 'winston';
import { LOG_CONFIG } from '../config/constants';

const { combine, timestamp, printf, colorize, errors } = format;

/**
 * Custom log format for structured logging
 */
const structuredFormat = printf(({ level, message, timestamp, ...meta }) => {
  // Mask sensitive data in metadata
  const sanitizedMeta = maskSensitiveData(meta);

  // Truncate very long messages
  const messageStr = typeof message === 'string' ? message : String(message);
  const truncatedMessage =
    messageStr.length > LOG_CONFIG.MAX_MESSAGE_LENGTH
      ? messageStr.substring(0, LOG_CONFIG.MAX_MESSAGE_LENGTH) + '... [truncated]'
      : messageStr;

  const metaString = Object.keys(sanitizedMeta).length > 0 ? ` ${JSON.stringify(sanitizedMeta)}` : '';

  // Explicitly convert to strings to satisfy @typescript-eslint/restrict-template-expressions
  return `${String(timestamp)} [${String(level).toUpperCase()}] ${truncatedMessage}${metaString}`;
});

/**
 * Masks sensitive fields in log metadata
 */
function maskSensitiveData(obj: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (LOG_CONFIG.SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      masked[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value as Record<string, unknown>);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Determines log level from environment
 */
function getLogLevel(): string {
  const level = process.env.LOG_LEVEL?.toLowerCase();
  const validLevels = ['error', 'warn', 'info', 'debug'];
  return (level !== undefined && validLevels.includes(level)) ? level : 'info';
}

/**
 * Creates the Winston logger instance
 */
function createLogger(): Logger {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  const loggerTransports: transport[] = [];

  // Console transport (always enabled except in test)
  if (!isTest) {
    loggerTransports.push(
      new transports.Console({
        format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), structuredFormat),
      })
    );
  }

  // File transport for production
  if (isProduction) {
    // Error logs
    loggerTransports.push(
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: combine(timestamp(), errors({ stack: true }), format.json()),
      })
    );

    // Combined logs
    loggerTransports.push(
      new transports.File({
        filename: 'logs/combined.log',
        format: combine(timestamp(), errors({ stack: true }), format.json()),
      })
    );
  }

  return winstonCreateLogger({
    level: getLogLevel(),
    transports: loggerTransports,
    // Don't exit on handled exceptions
    exitOnError: false,
  });
}

/**
 * Main logger instance for application-wide logging.
 *
 * @example
 * logger.info('Server started', { port: 3000 });
 * logger.error('Failed to connect', { error: err });
 */
export const logger = createLogger();

/**
 * Creates a child logger with additional default metadata.
 *
 * @param meta - Default metadata to include in all log messages
 * @returns Child logger instance
 *
 * @example
 * const moduleLogger = createChildLogger({ module: 'grpc' });
 * moduleLogger.info('Connected to miner', { minerId: '123' });
 */
export function createChildLogger(meta: Record<string, unknown>): Logger {
  return logger.child(meta);
}

/**
 * Log an operation with timing information.
 *
 * @param operation - Name of the operation
 * @param fn - Async function to execute
 * @returns Result of the function
 *
 * @example
 * const result = await logOperation('getMiner', async () => {
 *   return await minerRepo.findById(id);
 * });
 */
export async function logOperation<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const startTime = Date.now();
  logger.debug(`Starting operation: ${operation}`);

  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    logger.info(`Operation completed: ${operation}`, { durationMs: duration });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Operation failed: ${operation}`, {
      durationMs: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
