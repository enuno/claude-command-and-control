/**
 * Reboot Miner Tool
 *
 * Sends a reboot command to a miner.
 *
 * @module mcp/tools/reboot-miner
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const RebootMinerArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
});

export const rebootMinerTool: MCPToolDefinition = {
  schema: {
    name: 'reboot_miner',
    description: 'Reboot a miner',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner',
        },
      },
      required: ['minerId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = RebootMinerArgsSchema.parse(args);
      await context.minerService.rebootMiner(validated.minerId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Reboot command sent to miner '${validated.minerId}'`,
              note: 'Miner will be temporarily offline during reboot',
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
              error: error instanceof Error ? error.message : 'Failed to reboot miner',
              suggestion: 'Verify the miner ID is correct using list_miners tool',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
