/**
 * MCP Tools Registry
 *
 * Exports all available MCP tools for the Braiins OS server.
 *
 * @module mcp/tools
 */

import { checkJobStatusTool } from './check-job-status';
import { factoryResetTool } from './factory-reset';
import { getFleetStatusTool } from './get-fleet-status';
import { getMinerInfoTool } from './get-miner-info';
import { getMinerLogsTool } from './get-miner-logs';
import { getMinerStatusTool } from './get-miner-status';
import { listMinersTool } from './list-miners';
import { pingMinerTool } from './ping-miner';
import { rebootMinerTool } from './reboot-miner';
import { registerMinerTool } from './register-miner';
import { setHashrateTargetTool } from './set-hashrate-target';
import { setPowerTargetTool } from './set-power-target';
import type { MCPToolDefinition } from './types';
import { unregisterMinerTool } from './unregister-miner';
import { checkFirmwareJobStatusTool, updateMinerFirmwareTool } from './update-miner-firmware';
import { updatePoolConfigTool } from './update-pool-config';

/**
 * All available MCP tools.
 * Tools are automatically registered with the MCP server.
 */
export const ALL_TOOLS: MCPToolDefinition[] = [
  registerMinerTool,
  unregisterMinerTool,
  listMinersTool,
  getMinerStatusTool,
  getMinerInfoTool,
  getMinerLogsTool,
  getFleetStatusTool,
  pingMinerTool,
  rebootMinerTool,
  setPowerTargetTool,
  setHashrateTargetTool,
  updateMinerFirmwareTool,
  checkFirmwareJobStatusTool,
  checkJobStatusTool,
  updatePoolConfigTool,
  factoryResetTool,
];

/**
 * Tool lookup by name for handler dispatch.
 */
export const TOOL_HANDLERS = new Map<string, MCPToolDefinition['handler']>(
  ALL_TOOLS.map((tool) => [tool.schema.name, tool.handler])
);

// Re-export types for convenience
export type { MCPToolDefinition, ToolArguments, ToolContext, ToolHandler, ToolResult } from './types';
