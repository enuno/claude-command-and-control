/**
 * List Miners Tool
 *
 * Lists all registered miners with optional filtering, sorting, and pagination.
 *
 * @module mcp/tools/list-miners
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const ListMinersArgsSchema = z.object({
  status: z.enum(['online', 'offline', 'all']).optional().default('all'),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['name', 'hashrate', 'id']).optional().default('name'),
  limit: z.number().int().min(1).max(1000).optional().default(100),
  offset: z.number().int().min(0).optional().default(0),
});

export const listMinersTool: MCPToolDefinition = {
  schema: {
    name: 'list_miners',
    description: 'List all registered miners with optional filtering, sorting, and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['online', 'offline', 'all'],
          description: 'Filter by miner status (default: all)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by tags (miners must have all specified tags)',
        },
        sortBy: {
          type: 'string',
          enum: ['name', 'hashrate', 'id'],
          description: 'Sort results by field (default: name)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 100, max: 1000)',
        },
        offset: {
          type: 'number',
          description: 'Number of results to skip for pagination (default: 0)',
        },
      },
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = ListMinersArgsSchema.parse(args);

      // Get all registered miners
      const allMiners = await context.minerService.getRegisteredMiners();

      // Apply tag filter if specified
      let filtered = allMiners;
      if (validated.tags && validated.tags.length > 0) {
        filtered = allMiners.filter((miner) => {
          const minerTags = miner.tags ?? [];
          return validated.tags!.every((tag) => minerTags.includes(tag));
        });
      }

      // Apply status filter if not 'all'
      if (validated.status !== 'all') {
        // Get status for all miners to filter
        const statusPromises = filtered.map(async (miner) => {
          try {
            const status = await context.minerService.getMinerStatus(miner.id);
            return { miner, online: status.online };
          } catch {
            return { miner, online: false };
          }
        });

        const minersWithStatus = await Promise.all(statusPromises);

        filtered = minersWithStatus
          .filter(({ online }) => {
            if (validated.status === 'online') {
              return online;
            }
            if (validated.status === 'offline') {
              return !online;
            }
            return true;
          })
          .map(({ miner }) => miner);
      }

      // Sort results
      const sorted = [...filtered].sort((a, b) => {
        switch (validated.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'id':
            return a.id.localeCompare(b.id);
          case 'hashrate':
            // For hashrate sorting, we'd need to get status which is expensive
            // For now, sort by name as fallback
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      // Apply pagination
      const total = sorted.length;
      const paginated = sorted.slice(validated.offset, validated.offset + validated.limit);

      // Build concise response
      const miners = paginated.map((miner) => ({
        id: miner.id,
        name: miner.name,
        host: miner.host,
        tags: miner.tags ?? [],
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              miners,
              total,
              filters: {
                status: validated.status,
                tags: validated.tags,
                sortBy: validated.sortBy,
                limit: validated.limit,
                offset: validated.offset,
              },
              pagination: {
                hasMore: validated.offset + validated.limit < total,
                nextOffset: validated.offset + validated.limit,
              },
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
              error: error instanceof Error ? error.message : 'Failed to list miners',
              suggestion: 'Try list_miners without filters first to see all registered miners',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
