/**
 * MCP Resources Type Definitions
 *
 * Defines types for MCP resources in the Braiins OS server.
 *
 * @module mcp/resources/types
 */

import type { BraiinsClient } from '../../api/braiins';
import type { MinerService } from '../../services/miner.service';

/**
 * Context passed to resource handlers
 */
export interface ResourceContext {
  minerService: MinerService;
  braiinsClient: BraiinsClient;
}

/**
 * Resource content returned by handlers
 */
export interface ResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

/**
 * Resource handler function signature
 */
export type ResourceHandler = (uri: string, context: ResourceContext) => Promise<ResourceContent>;

/**
 * Complete MCP resource definition
 */
export interface MCPResourceDefinition {
  /** Resource template/pattern for URI matching */
  uriTemplate: string;
  /** Resource name for display */
  name: string;
  /** Human-readable description */
  description: string;
  /** MIME type of resource content */
  mimeType: string;
  /** Handler function to generate resource content */
  handler: ResourceHandler;
}

/**
 * Fleet summary data structure
 */
export interface FleetSummary {
  totalMiners: number;
  onlineMiners: number;
  offlineMiners: number;
  totalHashrate: string;
  averageTemperature: string;
  activeAlerts: number;
  lastUpdated: string;
}

/**
 * Miner status data structure
 */
export interface MinerStatus {
  minerId: string;
  status: 'online' | 'offline' | 'error';
  hashrate: string;
  temperature: string;
  uptime: string;
  lastSeen: string;
  pools: Array<{
    url: string;
    user: string;
    status: 'active' | 'inactive';
  }>;
  issues: string[];
}

/**
 * Job status data structure
 */
export interface JobStatus {
  jobId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  startedAt: string;
  completedAt?: string;
  errors?: Array<{
    minerId: string;
    error: string;
    suggestion: string;
  }>;
}
