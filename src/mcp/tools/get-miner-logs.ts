/**
 * Get Miner Logs Tool
 *
 * Retrieves recent logs from a Braiins OS miner with filtering capabilities.
 * Supports filtering by log level, time range, and line limits.
 *
 * @module mcp/tools/get-miner-logs
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

/**
 * Log entry structure
 */
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
}

/**
 * Input schema for get_miner_logs tool
 */
const GetMinerLogsArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
  lines: z.number().int().min(1).max(1000).optional().default(100),
  level: z.enum(['error', 'warn', 'info', 'debug']).optional(),
  since: z.string().datetime().optional(),
});

/**
 * Get miner logs tool definition
 */
export const getMinerLogsTool: MCPToolDefinition = {
  schema: {
    name: 'get_miner_logs',
    description: 'Retrieve recent logs from a Braiins OS miner. Supports filtering by log level, time range, and line limits. Returns up to 1000 lines.',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner',
        },
        lines: {
          type: 'number',
          description: 'Maximum number of log lines to return (1-1000, default: 100)',
          minimum: 1,
          maximum: 1000,
          default: 100,
        },
        level: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug'],
          description: 'Filter logs by minimum severity level (error = most critical, debug = all logs)',
        },
        since: {
          type: 'string',
          description: 'Filter logs since this ISO8601 timestamp (e.g., "2025-12-29T10:00:00Z")',
          format: 'date-time',
        },
      },
      required: ['minerId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = GetMinerLogsArgsSchema.parse(args);

      // Get miner registration to verify it exists
      const miners = await context.minerService.getRegisteredMiners();
      const miner = miners.find((m) => m.id === validated.minerId);

      if (!miner) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Miner '${validated.minerId}' not found`,
                suggestion: 'Use list_miners tool to see all registered miners',
                possibleCauses: [
                  'Miner ID is incorrect',
                  'Miner has not been registered yet',
                ],
              }),
            },
          ],
          isError: true,
        };
      }

      // TODO: Implement actual log retrieval from Braiins API
      // For now, returning mock data structure with proper error handling
      //
      // Once Braiins API provides log endpoint, replace with:
      // const logs = await context.braiinsClient.getLogs(miner.host, {
      //   lines: validated.lines,
      //   level: validated.level,
      //   since: validated.since,
      // });

      // Mock implementation - returns structured response
      const mockLogs: LogEntry[] = [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Log retrieval not yet implemented for miner ${validated.minerId}`,
        },
      ];

      // Filter by level if specified
      const levelPriority = { error: 0, warn: 1, info: 2, debug: 3 };
      const filteredLogs = validated.level
        ? mockLogs.filter((log) => levelPriority[log.level] <= levelPriority[validated.level!])
        : mockLogs;

      // Filter by timestamp if specified
      const timeLogs = validated.since
        ? filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(validated.since!))
        : filteredLogs;

      // Limit to requested number of lines
      const limitedLogs = timeLogs.slice(0, validated.lines);
      const truncated = timeLogs.length > validated.lines;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              minerId: validated.minerId,
              minerName: miner.name,
              logs: limitedLogs,
              total: limitedLogs.length,
              truncated,
              filters: {
                lines: validated.lines,
                level: validated.level,
                since: validated.since,
              },
              note: 'Log retrieval API not yet available - mock data returned. Awaiting Braiins OS API log endpoint implementation.',
            }),
          },
        ],
      };
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Invalid input parameters',
                details: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
                suggestion: 'Check parameter types and values match the schema',
              }),
            },
          ],
          isError: true,
        };
      }

      // Handle unexpected errors
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to retrieve miner logs',
              suggestion: 'Verify miner connectivity with ping_miner tool, or check miner status',
              possibleCauses: [
                'Miner is offline or unreachable',
                'Network connectivity issues',
                'Miner API temporarily unavailable',
              ],
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
