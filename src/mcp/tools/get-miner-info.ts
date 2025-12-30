/**
 * Get Miner Info Tool
 *
 * Comprehensive miner information retrieval with context-optimized response modes.
 * Demonstrates MCP best practices for agent-first design.
 *
 * Features:
 * - Concise mode (default): High-signal information only (~150 tokens)
 * - Detailed mode: Comprehensive data for debugging (~500+ tokens)
 * - Actionable error messages with troubleshooting suggestions
 * - Input validation with Zod schemas
 * - Cache control via refresh parameter
 *
 * @module mcp/tools/get-miner-info
 */

import { z } from 'zod';
import type { MinerStatusSummary } from '../../services/miner.service';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

/**
 * Input validation schema with strict typing.
 */
const GetMinerInfoArgsSchema = z
  .object({
    minerId: z
      .string()
      .min(1, 'Miner ID cannot be empty')
      .describe('The unique identifier of the miner'),
    detailLevel: z
      .enum(['concise', 'detailed'])
      .optional()
      .default('concise')
      .describe('Response detail level: concise (default) or detailed'),
    refresh: z
      .boolean()
      .optional()
      .default(false)
      .describe('Force refresh from device, bypassing cache'),
  })
  .strict(); // Reject unknown properties

type GetMinerInfoArgs = z.infer<typeof GetMinerInfoArgsSchema>;

/**
 * Concise response type.
 */
interface ConciseResponse {
  success: true;
  id: string;
  name: string;
  host: string;
  online: boolean;
  lastUpdated: string;
}

/**
 * Detailed response type.
 */
interface DetailedResponse {
  success: true;
  id: string;
  name: string;
  host: string;
  online: boolean;
  info: MinerStatusSummary['info'];
  hashboards: MinerStatusSummary['hashboards'];
  pools: MinerStatusSummary['pools'];
  tunerState: MinerStatusSummary['tunerState'];
  errors: MinerStatusSummary['errors'];
  lastUpdated: string;
}

/**
 * Format miner info in concise mode (optimized for agent context).
 *
 * @param status - Raw miner status from service
 * @returns Concise JSON response (~150 tokens)
 */
function formatConcise(status: MinerStatusSummary): ConciseResponse {
  return {
    success: true,
    id: status.id,
    name: status.name,
    host: status.host,
    online: status.online,
    lastUpdated: status.lastUpdated,
  };
}

/**
 * Format miner info in detailed mode (comprehensive debugging data).
 *
 * @param status - Raw miner status from service
 * @returns Detailed JSON response (~500+ tokens)
 */
function formatDetailed(status: MinerStatusSummary): DetailedResponse {
  return {
    success: true,
    id: status.id,
    name: status.name,
    host: status.host,
    online: status.online,
    info: status.info,
    hashboards: status.hashboards,
    pools: status.pools,
    tunerState: status.tunerState,
    errors: status.errors,
    lastUpdated: status.lastUpdated,
  };
}

/**
 * MCP Tool Definition: get_miner_info
 *
 * Agent-centric design principles:
 * 1. Context-optimized: Concise by default to save agent context
 * 2. Flexible: Detailed mode available when debugging is needed
 * 3. Actionable errors: Error messages guide agents to solutions
 * 4. Type-safe: Zod validation prevents invalid inputs
 * 5. Cache control: Refresh parameter for real-time data
 */
export const getMinerInfoTool: MCPToolDefinition = {
  schema: {
    name: 'get_miner_info',
    description: `Get comprehensive miner information with context-optimized response modes.

**Concise mode (default)**: Returns essential data (status, hashrate, temp, issues) - ~150 tokens
**Detailed mode**: Returns full diagnostic data (sensors, pools, fans, hashboards) - ~500+ tokens

Use concise mode for routine checks. Use detailed mode only when debugging or when comprehensive data is needed.`,
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner (required)',
        },
        detailLevel: {
          type: 'string',
          enum: ['concise', 'detailed'],
          description: 'Response detail level (default: concise)',
        },
        refresh: {
          type: 'boolean',
          description: 'Force refresh from device, bypassing cache (default: false)',
        },
      },
      required: ['minerId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    // Extract minerId early for error handling
    const minerId = typeof args === 'object' && args !== null && 'minerId' in args
      ? String(args.minerId)
      : 'unknown';

    try {
      // Validate and parse arguments
      const validated: GetMinerInfoArgs = GetMinerInfoArgsSchema.parse(args);

      // Fetch miner status (with optional cache bypass)
      const status = validated.refresh
        ? await context.minerService.refreshMinerStatus(validated.minerId)
        : await context.minerService.getMinerStatus(validated.minerId);

      // Format response based on detail level
      const response =
        validated.detailLevel === 'detailed' ? formatDetailed(status) : formatConcise(status);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, validated.detailLevel === 'detailed' ? 2 : 0),
          },
        ],
      };
    } catch (error) {
      // Agent-centric error handling with actionable guidance
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const isNotFoundError = errorMessage.includes('not found') || errorMessage.includes('does not exist');
      const isNetworkError = errorMessage.includes('unreachable') || errorMessage.includes('timeout');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                error: errorMessage,
                minerId,
                // Actionable suggestions based on error type
                suggestion: isNotFoundError
                  ? "Miner ID not found. Use 'register_miner' tool to add this miner, or use 'get_fleet_status' to see all registered miners."
                  : isNetworkError
                    ? "Cannot reach miner. Verify: (1) Miner is powered on, (2) Network connectivity, (3) Firewall rules allow gRPC port 50051, (4) Miner IP address is correct in registration."
                    : "Use 'get_fleet_status' to verify miner registration. Check miner logs for hardware issues. Try 'refresh: true' parameter to bypass cache.",
                // Additional context for debugging
                troubleshootingSteps: [
                  '1. Verify miner exists with get_fleet_status tool',
                  '2. Check network connectivity with ping',
                  '3. Verify gRPC port 50051 is accessible',
                  '4. Check miner logs for hardware errors',
                  '5. Try reboot_miner tool if miner is unresponsive',
                ],
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  },
};
