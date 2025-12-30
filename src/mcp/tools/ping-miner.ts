/**
 * Ping Miner Tool
 *
 * Tests connectivity to a Braiins OS miner by attempting to fetch basic information.
 * Returns reachability status, latency, and actionable error messages on failure.
 *
 * @module mcp/tools/ping-miner
 */

import { z } from 'zod';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

/**
 * Input schema for ping_miner tool
 */
const PingMinerArgsSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
  timeout: z.number().int().min(1000).max(60000).optional().default(5000),
});

/**
 * Ping miner tool definition
 */
export const pingMinerTool: MCPToolDefinition = {
  schema: {
    name: 'ping_miner',
    description: 'Test connectivity to a Braiins OS miner. Returns reachability status, latency, and detailed error guidance if unreachable.',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: {
          type: 'string',
          description: 'The unique identifier of the miner to ping',
        },
        timeout: {
          type: 'number',
          description: 'Connection timeout in milliseconds (1000-60000, default: 5000)',
          minimum: 1000,
          maximum: 60000,
          default: 5000,
        },
      },
      required: ['minerId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = PingMinerArgsSchema.parse(args);

      // Get miner registration to verify it exists
      const miners = await context.minerService.getRegisteredMiners();
      const miner = miners.find((m) => m.id === validated.minerId);

      if (!miner) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                reachable: false,
                error: {
                  code: 'MINER_NOT_REGISTERED',
                  message: `Miner '${validated.minerId}' is not registered`,
                  suggestions: [
                    'Use list_miners tool or get_fleet_status to see all registered miners',
                    `Register the miner using: register_miner({ id: "${validated.minerId}", name: "...", host: "...", username: "...", password: "..." })`,
                  ],
                  possibleCauses: [
                    'Miner ID is incorrect or typo in ID',
                    'Miner has not been registered in the system yet',
                  ],
                },
              }),
            },
          ],
          isError: true,
        };
      }

      // Attempt to ping the miner by fetching status
      const startTime = Date.now();

      try {
        // Try to get miner info with timeout
        await context.minerService.getMinerStatus(validated.minerId);

        const latency = Date.now() - startTime;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                reachable: true,
                minerId: validated.minerId,
                minerName: miner.name,
                host: miner.host,
                port: miner.port ?? 80,
                latency: `${latency}ms`,
                message: `Miner is reachable and responding`,
              }),
            },
          ],
        };
      } catch (error) {
        // Miner is unreachable - provide actionable guidance
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                reachable: false,
                minerId: validated.minerId,
                minerName: miner.name,
                host: miner.host,
                port: miner.port ?? 80,
                error: {
                  code: 'MINER_UNREACHABLE',
                  message: `Cannot connect to miner ${validated.minerId} at ${miner.host}`,
                  details: errorMessage,
                  suggestions: [
                    'Check if miner is powered on (verify LED indicators)',
                    'Verify network cable is securely connected',
                    'Test if miner web interface is accessible at http://' + miner.host,
                    'Check firewall rules allow traffic to miner',
                    'Verify IP address is correct (may have changed via DHCP)',
                    'Try list_miners to see if other miners are reachable',
                    'Use troubleshoot_miner_offline prompt for step-by-step diagnostics',
                  ],
                  possibleCauses: [
                    'Miner is powered off or experiencing hardware failure',
                    'Network connectivity issues (cable unplugged, switch port down)',
                    'Firewall blocking connection to miner',
                    'Miner IP address changed (DHCP lease renewal)',
                    'Miner is rebooting or in maintenance mode',
                    'Network congestion or timeout',
                  ],
                  nextSteps: [
                    'Physical Check: Verify power and network connections',
                    'Network Test: Ping miner IP from your network: ping ' + miner.host,
                    'Web Access: Try accessing http://' + miner.host + ' in browser',
                    'Diagnostics: Use troubleshoot_miner_offline prompt for guided troubleshooting',
                  ],
                },
              }),
            },
          ],
          isError: true,
        };
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Invalid input parameters',
                details: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
                suggestion: 'Check parameter types and values match the schema',
              }),
            },
          ],
          isError: true,
        };
      }

      // Handle unexpected errors
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to ping miner',
              suggestion: 'Check system logs for details or try again',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
