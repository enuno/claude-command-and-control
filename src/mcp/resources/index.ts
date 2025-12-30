/**
 * MCP Resources Registry
 *
 * Exports all available MCP resources for the Braiins OS server.
 *
 * @module mcp/resources
 */

import { fleetSummaryResource } from './fleet-summary';
import { jobStatusResource } from './job-status';
import { minerConfigResource } from './miner-config';
import { minerLogsResource } from './miner-logs';
import { minerStatusResource } from './miner-status';
import type { MCPResourceDefinition } from './types';

/**
 * All available MCP resources.
 * Resources are automatically registered with the MCP server.
 */
export const ALL_RESOURCES: MCPResourceDefinition[] = [
  fleetSummaryResource,
  minerStatusResource,
  minerConfigResource,
  minerLogsResource,
  jobStatusResource,
];

/**
 * Resource lookup by URI template for handler dispatch.
 */
export const RESOURCE_HANDLERS = new Map<string, MCPResourceDefinition['handler']>(
  ALL_RESOURCES.map((resource) => [resource.uriTemplate, resource.handler])
);

// Re-export types for convenience
export type {
  FleetSummary,
  JobStatus,
  MCPResourceDefinition,
  MinerStatus,
  ResourceContent,
  ResourceContext,
  ResourceHandler,
} from './types';
