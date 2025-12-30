/**
 * MCP Tool Type Definitions
 *
 * Common types and interfaces for MCP tools.
 *
 * @module mcp/tools/types
 */

import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import type { BraiinsClient } from '../../api/braiins';
import type { MinerService } from '../../services/miner.service';

/**
 * Arguments passed to tool handlers.
 */
export type ToolArguments = Record<string, unknown>;

/**
 * Result of a tool execution (from MCP SDK).
 */
export type ToolResult = CallToolResult;

/**
 * Context available to all tool handlers.
 */
export interface ToolContext {
  minerService: MinerService;
  braiinsClient: BraiinsClient;
}

/**
 * Handler function for a tool.
 */
export type ToolHandler = (args: ToolArguments, context: ToolContext) => Promise<ToolResult>;

/**
 * Complete tool definition with schema and handler.
 */
export interface MCPToolDefinition {
  /** Tool metadata and input schema */
  schema: Tool;
  /** Tool execution handler */
  handler: ToolHandler;
}
