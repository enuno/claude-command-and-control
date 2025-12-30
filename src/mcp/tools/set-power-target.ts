/**
 * Set Power Target Tool
 *
 * Sets the power consumption target for a miner in watts.
 *
 * @module mcp/tools/set-power-target
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const SetPowerTargetArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
  watts: z.number().positive('Power target must be a positive number'),
});

export const setPowerTargetTool: MCPToolDefinition = {
  schema: {
    name: 'set_power_target',
    description: 'Set the power consumption target for a miner in watts',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner',
        },
        watts: {
          type: 'number',
          description: 'Target power consumption in watts',
        },
      },
      required: ['minerId', 'watts'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = SetPowerTargetArgsSchema.parse(args);

      await context.minerService.setPowerTarget(validated.minerId, { watt: validated.watts });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Power target set to ${validated.watts}W for miner '${validated.minerId}'`,
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
              error: error instanceof Error ? error.message : 'Failed to set power target',
              suggestion: 'Ensure power target is a positive number and miner ID is valid',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
