/**
 * Miner Logs Resource
 *
 * Provides access to recent log entries from a specific miner.
 * Supports URI pattern: braiins:///miner/{minerId}/logs
 *
 * @module mcp/resources/miner-logs
 */

import type { MCPResourceDefinition, ResourceContext, ResourceContent } from './types';

/**
 * Log entry interface
 */
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
}

export const minerLogsResource: MCPResourceDefinition = {
  uriTemplate: 'braiins:///miner/{minerId}/logs',
  name: 'Miner Logs',
  description: 'Recent log entries from a specific miner (cached for 5 seconds)',
  mimeType: 'application/json',

  handler: async (uri: string, context: ResourceContext): Promise<ResourceContent> => {
    try {
      // Extract minerId from URI pattern: braiins:///miner/{minerId}/logs
      const match = uri.match(/braiins:\/\/\/miner\/([^/]+)\/logs/);
      if (!match?.[1]) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: 'Invalid URI format',
            expected: 'braiins:///miner/{minerId}/logs',
            suggestion: 'Provide a valid miner ID in the URI',
          }),
        };
      }

      const minerId = match[1];

      // Parse optional query parameters from URI
      const urlParams = new URLSearchParams(uri.split('?')[1] ?? '');
      const lines = Math.min(parseInt(urlParams.get('lines') ?? '100', 10), 1000);
      const level = urlParams.get('level') as 'error' | 'warn' | 'info' | 'debug' | null;
      const since = urlParams.get('since');

      // Get miner registration to verify it exists
      const miners = await context.minerService.getRegisteredMiners();
      const miner = miners.find((m) => m.id === minerId);

      if (!miner) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: `Miner '${minerId}' not found`,
            suggestion: 'Verify the miner ID exists using list_miners tool',
          }),
        };
      }

      // TODO: Implement actual log retrieval from Braiins API
      // For now, returning mock data structure with proper format
      //
      // Once Braiins API provides log endpoint, replace with:
      // const logs = await context.braiinsClient.getLogs(miner.host, {
      //   lines,
      //   level,
      //   since,
      // });

      const mockLogs: LogEntry[] = [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Log retrieval not yet implemented for miner ${minerId}`,
        },
      ];

      // Filter by level if specified
      const levelPriority = { error: 0, warn: 1, info: 2, debug: 3 };
      const filteredLogs = level
        ? mockLogs.filter((log) => levelPriority[log.level] <= levelPriority[level])
        : mockLogs;

      // Filter by timestamp if specified
      const timeLogs = since
        ? filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(since))
        : filteredLogs;

      // Limit to requested number of lines
      const limitedLogs = timeLogs.slice(0, lines);
      const truncated = timeLogs.length > lines;

      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          minerId,
          minerName: miner.name,
          host: miner.host,
          logs: limitedLogs,
          total: limitedLogs.length,
          truncated,
          filters: {
            lines,
            level,
            since,
          },
          lastUpdated: new Date().toISOString(),
          note: 'Log retrieval API not yet available - mock data returned. Awaiting Braiins OS API log endpoint implementation.',
        }),
      };
    } catch (error) {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to retrieve miner logs',
          suggestion: 'Verify the miner exists and is reachable using ping_miner tool',
        }),
      };
    }
  },
};
