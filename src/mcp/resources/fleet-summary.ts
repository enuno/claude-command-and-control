/**
 * Fleet Summary Resource
 *
 * Provides aggregated metrics for all managed miners.
 * Cached for 30 seconds to optimize fleet-wide queries.
 *
 * URI: braiins:///fleet/summary
 *
 * @module mcp/resources/fleet-summary
 */

import type { MCPResourceDefinition, ResourceContext, ResourceContent } from './types';

export const fleetSummaryResource: MCPResourceDefinition = {
  uriTemplate: 'braiins:///fleet/summary',
  name: 'Fleet Summary',
  description: 'Aggregated metrics for all managed miners (cached for 30s)',
  mimeType: 'application/json',

  handler: async (_uri: string, context: ResourceContext): Promise<ResourceContent> => {
    try {
      // Get fleet status from service
      const fleetStatus = await context.minerService.getFleetStatus();

      return {
        uri: 'braiins:///fleet/summary',
        mimeType: 'application/json',
        text: JSON.stringify({
          totalMiners: fleetStatus.totalMiners,
          onlineMiners: fleetStatus.onlineMiners,
          offlineMiners: fleetStatus.offlineMiners,
          totalHashrate: `${fleetStatus.totalHashrateThs} TH/s`,
          averageTemperature: `${fleetStatus.avgTemperatureCelsius}°C`,
          totalPower: `${fleetStatus.totalPowerWatts}W`,
          minerCount: fleetStatus.miners.length,
          lastUpdated: fleetStatus.calculatedAt,
        }),
      };
    } catch (error) {
      return {
        uri: 'braiins:///fleet/summary',
        mimeType: 'application/json',
        text: JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to get fleet summary',
          suggestion: 'Ensure miners are registered and reachable',
        }),
      };
    }
  },
};
