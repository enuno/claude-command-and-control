/**
 * Set Hashrate Target Tool
 *
 * Sets the hashrate target for a miner in TH/s.
 *
 * @module mcp/tools/set-hashrate-target
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const SetHashrateTargetArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
  terahashPerSecond: z.number().positive('Hashrate target must be a positive number'),
});

export const setHashrateTargetTool: MCPToolDefinition = {
  schema: {
    name: 'set_hashrate_target',
    description: 'Set the hashrate target for a miner in TH/s',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner',
        },
        terahashPerSecond: {
          type: 'number',
          description: 'Target hashrate in TH/s',
        },
      },
      required: ['minerId', 'terahashPerSecond'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = SetHashrateTargetArgsSchema.parse(args);

      await context.minerService.setHashrateTarget(validated.minerId, {
        terahash_per_second: validated.terahashPerSecond,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Hashrate target set to ${validated.terahashPerSecond} TH/s for miner '${validated.minerId}'`,
              note: 'Tuner will adjust to reach target over time',
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
              error: error instanceof Error ? error.message : 'Failed to set hashrate target',
              suggestion: 'Ensure hashrate target is a positive number and miner ID is valid',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
