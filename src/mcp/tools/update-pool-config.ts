/**
 * Update Pool Configuration Tool
 *
 * Updates mining pool configuration for one or more Braiins OS miners.
 * Validates pool URLs, updates in batch, and handles failures gracefully.
 *
 * @module mcp/tools/update-pool-config
 */

import { z } from 'zod';
import { createChildLogger } from '../../utils/logger';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const logger = createChildLogger({ module: 'update-pool-config' });

/**
 * Pool URL schema - must use stratum protocol.
 */
const PoolUrlSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith('stratum+tcp://') || url.startsWith('stratum+ssl://'), {
    message: 'Pool URL must use stratum protocol (stratum+tcp:// or stratum+ssl://)',
  });

/**
 * Miner IDs schema - supports batch operations with reasonable limits.
 */
const MinerIdsSchema = z.array(z.string().min(1)).min(1, 'At least one miner ID required').max(100, 'Maximum 100 miners per batch');

/**
 * Input schema for pool configuration update.
 */
const UpdatePoolConfigArgsSchema = z.object({
  minerIds: MinerIdsSchema,
  poolUrl: PoolUrlSchema,
  username: z.string().min(1, 'Pool username is required'),
  password: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional().default(0).describe('Pool priority (0-10, lower is higher priority)'),
  detailLevel: z.enum(['concise', 'verbose']).optional().default('concise').describe('Output detail level'),
});

/**
 * Individual miner pool update result.
 */
interface MinerPoolUpdateResult {
  minerId: string;
  success: boolean;
  error?: string;
  previousPools?: number;
}

/**
 * Updates pool configuration for a single miner.
 *
 * @param minerId - Miner ID to update
 * @param poolUrl - Pool URL
 * @param username - Pool username
 * @param password - Pool password (optional)
 * @param context - Tool context with services
 * @returns Update result
 */
async function updateSingleMinerPool(
  minerId: string,
  poolUrl: string,
  username: string,
  password: string | undefined,
  context: ToolContext
): Promise<MinerPoolUpdateResult> {
  try {
    // Check if miner exists
    const registration = (await context.minerService.getRegisteredMiners()).find((m) => m.id === minerId);

    if (!registration) {
      return {
        minerId,
        success: false,
        error: `Miner ${minerId} not found in registry`,
      };
    }

    // Get current miner status to verify it's online
    const status = await context.minerService.getMinerStatus(minerId);

    if (!status.online) {
      return {
        minerId,
        success: false,
        error: `Miner ${minerId} is offline`,
      };
    }

    // Get current pools configuration
    const currentPools = await context.braiinsClient.getPools(registration.host);
    const previousPoolCount = currentPools.reduce((sum, group) => sum + group.pools.length, 0);

    // Create new pool configuration
    const newPoolConfig = {
      uid: poolUrl, // Use URL as unique ID
      url: poolUrl,
      user: username,
      password: password ?? '',
      enabled: true,
    };

    // Create or update pool group
    const poolGroup = currentPools[0] ?? {
      uid: 'default',
      name: 'Default Pool Group',
      pools: [],
    };

    // Update pool group with new pool (replace existing or add new)
    const updatedPoolGroup = {
      uid: poolGroup.uid || 'default',
      name: poolGroup.name || 'Default Pool Group',
      pools: [newPoolConfig, ...poolGroup.pools.filter((p) => p.url !== poolUrl)].slice(0, 3), // Keep max 3 pools
    };

    // Update pools via Braiins API
    await context.braiinsClient.updatePools(registration.host, [updatedPoolGroup]);

    // Invalidate miner status cache after update
    await context.minerService.refreshMinerStatus(minerId);

    return {
      minerId,
      success: true,
      previousPools: previousPoolCount,
    };
  } catch (error) {
    logger.error('Pool configuration update failed for miner', {
      minerId,
      poolUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      minerId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update Pool Configuration Tool Definition.
 */
export const updatePoolConfigTool: MCPToolDefinition = {
  schema: {
    name: 'update_pool_config',
    description: 'Update mining pool configuration for one or more Braiins OS miners. Validates pool URL, updates configuration, and handles failures gracefully.',
    inputSchema: {
      type: 'object',
      properties: {
        minerIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of miner IDs to update (max 100)',
          minItems: 1,
          maxItems: 100,
        },
        poolUrl: {
          type: 'string',
          description: 'Mining pool URL (must use stratum+tcp:// or stratum+ssl://)',
          pattern: '^stratum\\+(tcp|ssl)://.+',
        },
        username: {
          type: 'string',
          description: 'Pool username (e.g., wallet.workername)',
          minLength: 1,
        },
        password: {
          type: 'string',
          description: 'Pool password (optional, defaults to empty string)',
        },
        priority: {
          type: 'number',
          description: 'Pool priority (0-10, lower number = higher priority, default: 0)',
          minimum: 0,
          maximum: 10,
          default: 0,
        },
        detailLevel: {
          type: 'string',
          enum: ['concise', 'verbose'],
          description: 'Output detail level (default: concise)',
          default: 'concise',
        },
      },
      required: ['minerIds', 'poolUrl', 'username'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = UpdatePoolConfigArgsSchema.parse(args);

      // Process miners sequentially (in production, use concurrency limit with PQueue)
      const results: MinerPoolUpdateResult[] = [];

      for (const minerId of validated.minerIds) {
        const result = await updateSingleMinerPool(minerId, validated.poolUrl, validated.username, validated.password, context);
        results.push(result);
      }

      // Calculate summary
      const successCount = results.filter((r) => r.success).length;
      const failedCount = results.filter((r) => !r.success).length;

      // Return concise or verbose response
      if (validated.detailLevel === 'verbose') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: failedCount === 0,
                  summary: {
                    total: validated.minerIds.length,
                    successful: successCount,
                    failed: failedCount,
                  },
                  poolConfig: {
                    url: validated.poolUrl,
                    username: validated.username,
                    priority: validated.priority,
                  },
                  results: results.map((r) => ({
                    minerId: r.minerId,
                    success: r.success,
                    error: r.error,
                    previousPools: r.previousPools,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Concise response (default)
      const response = {
        success: failedCount === 0,
        successful: successCount,
        failed: failedCount,
        total: validated.minerIds.length,
      };

      // Add error summary if there were failures
      if (failedCount > 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                ...response,
                failedMiners: results.filter((r) => !r.success).map((r) => ({ minerId: r.minerId, error: r.error })),
                suggestions: [
                  'Check that failed miners are online with get_fleet_status',
                  'Verify miner IDs are correct using list_miners',
                  'Ensure pool URL is accessible from miners',
                ],
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ...response,
              message: `Successfully updated pool configuration for ${successCount} miner(s)`,
            }),
          },
        ],
      };
    } catch (error) {
      logger.error('Pool configuration update tool failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to update pool configuration',
              suggestions: [
                'Verify pool URL format (must start with stratum+tcp:// or stratum+ssl://)',
                'Check that username is not empty',
                'Ensure miner IDs are valid',
                'Verify miners are registered and online',
              ],
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
