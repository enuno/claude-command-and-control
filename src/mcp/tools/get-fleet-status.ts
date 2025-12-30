/**
 * Get Fleet Status Tool
 *
 * Retrieves aggregated status for all registered miners.
 *
 * @module mcp/tools/get-fleet-status
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const GetFleetStatusArgsSchema = z.object({
  tenantId: z.string().optional(),
});

export const getFleetStatusTool: MCPToolDefinition = {
  schema: {
    name: 'get_fleet_status',
    description: 'Get aggregated status for all registered miners',
    inputSchema: {
      type: 'object',
      properties: {
        tenantId: {
          type: 'string',
          description: 'Optional tenant ID to filter miners',
        },
      },
      required: [],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = GetFleetStatusArgsSchema.parse(args);
      const fleetStatus = await context.minerService.getFleetStatus(validated.tenantId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              ...fleetStatus,
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
              error: error instanceof Error ? error.message : 'Failed to get fleet status',
              suggestion: 'Ensure the tenant ID is valid or omit it to get all miners',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
