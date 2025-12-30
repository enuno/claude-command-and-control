/**
 * Miner Status Resource
 *
 * Provides detailed status information for a specific miner.
 * Supports URI pattern: braiins:///miner/{minerId}/status
 *
 * @module mcp/resources/miner-status
 */

import type { MCPResourceDefinition, ResourceContext, ResourceContent } from './types';

export const minerStatusResource: MCPResourceDefinition = {
  uriTemplate: 'braiins:///miner/{minerId}/status',
  name: 'Miner Status',
  description: 'Detailed status information for a specific miner',
  mimeType: 'application/json',

  handler: async (uri: string, context: ResourceContext): Promise<ResourceContent> => {
    try {
      // Extract minerId from URI pattern: braiins:///miner/{minerId}/status
      const match = uri.match(/braiins:\/\/\/miner\/([^/]+)\/status/);
      if (!match?.[1]) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: 'Invalid URI format',
            expected: 'braiins:///miner/{minerId}/status',
            suggestion: 'Provide a valid miner ID in the URI',
          }),
        };
      }

      const minerId = match[1];

      // Get miner status from service
      const status = await context.minerService.getMinerStatus(minerId);

      // Return the full status object with basic summary
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          minerId: status.id,
          name: status.name,
          host: status.host,
          online: status.online,
          lastUpdated: status.lastUpdated,
          info: status.info ?? null,
          hashboards: status.hashboards ?? null,
          pools: status.pools ?? null,
          tunerState: status.tunerState ?? null,
          hasErrors: (status.errors?.errors.length ?? 0) > 0,
        }),
      };
    } catch (error) {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to get miner status',
          suggestion: 'Verify the miner ID exists using list_miners tool',
        }),
      };
    }
  },
};
