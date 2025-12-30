/**
 * Unregister Miner Tool
 *
 * Removes a miner from the MCP server.
 *
 * @module mcp/tools/unregister-miner
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const UnregisterMinerArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
});

export const unregisterMinerTool: MCPToolDefinition = {
  schema: {
    name: 'unregister_miner',
    description: 'Remove a miner from the MCP server',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The miner ID to remove',
        },
      },
      required: ['minerId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = UnregisterMinerArgsSchema.parse(args);
      await context.minerService.unregisterMiner(validated.minerId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Miner '${validated.minerId}' unregistered`,
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
              error: error instanceof Error ? error.message : 'Failed to unregister miner',
              suggestion: 'Use list_miners to see registered miners',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
