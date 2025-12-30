/**
 * Get Miner Status Tool
 *
 * Retrieves current status of a miner including hashrate, temperature, pools, and errors.
 *
 * @module mcp/tools/get-miner-status
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const GetMinerStatusArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
  refresh: z.boolean().optional(),
});

export const getMinerStatusTool: MCPToolDefinition = {
  schema: {
    name: 'get_miner_status',
    description: 'Get the current status of a miner including hashrate, temperature, pools, and errors',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner',
        },
        refresh: {
          type: 'boolean',
          description: 'Force refresh from device (bypass cache)',
        },
      },
      required: ['minerId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = GetMinerStatusArgsSchema.parse(args);

      const status = validated.refresh
        ? await context.minerService.refreshMinerStatus(validated.minerId)
        : await context.minerService.getMinerStatus(validated.minerId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              ...status,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to get miner status',
              suggestion: 'Verify the miner ID is correct and the miner is reachable',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
