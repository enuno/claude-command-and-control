/**
 * Factory Reset Tool
 *
 * Resets a miner to factory defaults. This is a destructive operation
 * that requires explicit confirmation to prevent accidents.
 *
 * @module mcp/tools/factory-reset
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const FactoryResetArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
  confirm: z.boolean(),
});

export const factoryResetTool: MCPToolDefinition = {
  schema: {
    name: 'factory_reset',
    description:
      'Reset a miner to factory defaults. WARNING: This will erase all configuration, pool settings, and custom tuning profiles. Requires explicit confirmation.',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner to reset',
        },
        confirm: {
          type: 'boolean',
          description: 'Must be set to true to confirm the factory reset. This prevents accidental resets.',
        },
      },
      required: ['minerId', 'confirm'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = FactoryResetArgsSchema.parse(args);

      // Safety check: require explicit confirmation
      if (!validated.confirm) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Factory reset requires confirmation',
                suggestion: 'Set confirm: true to proceed with factory reset',
                warning:
                  'Factory reset will erase ALL configuration including pool settings, tuning profiles, and network config',
              }),
            },
          ],
          isError: true,
        };
      }

      // Get miner registration to ensure it exists
      const miners = await context.minerService.getRegisteredMiners();
      const miner = miners.find((m) => m.id === validated.minerId);

      if (!miner) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Miner ${validated.minerId} not found`,
                suggestion: 'Use list_miners to see all registered miners',
              }),
            },
          ],
          isError: true,
        };
      }

      // TODO: Implement actual factory reset via Braiins API
      // The Braiins OS+ API doesn't currently expose a factory reset endpoint
      // This would need to be implemented by:
      // 1. Clearing all pool configurations
      // 2. Resetting tuning profiles to defaults
      // 3. Clearing network configuration (optional)
      // 4. Rebooting the miner
      //
      // For now, we'll return a message indicating this is not yet implemented

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: 'Factory reset not yet implemented',
              suggestion:
                'Factory reset functionality requires additional Braiins API endpoints. As a workaround, you can manually reset pool configs and tuning profiles, then reboot the miner.',
              workaround: {
                steps: [
                  '1. Clear pool configurations using update_pool_config',
                  '2. Reset tuning to default using set_power_target or set_hashrate_target',
                  '3. Reboot miner using reboot_miner',
                ],
              },
            }),
          },
        ],
        isError: true,
      };

      // When implemented, the code would look like:
      // await context.braiinsClient.factoryReset(miner.host);
      // await context.minerService.refreshMinerStatus(validated.minerId);
      //
      // return {
      //   content: [
      //     {
      //       type: 'text',
      //       text: JSON.stringify({
      //         success: true,
      //         message: `Miner ${validated.minerId} has been reset to factory defaults`,
      //         note: 'The miner will reboot and may take a few minutes to come back online',
      //       }),
      //     },
      //   ],
      // };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to perform factory reset',
              suggestion: 'Verify the miner ID is correct and the miner is reachable',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
