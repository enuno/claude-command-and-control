/**
 * MCP Prompts Registry
 *
 * Exports all available MCP prompts for the Braiins OS server.
 *
 * @module mcp/prompts
 */

import { batchFirmwareUpdatePrompt } from './batch-firmware-update';
import { optimizePowerEfficiencyPrompt } from './optimize-power-efficiency';
import { troubleshootMinerOfflinePrompt } from './troubleshoot-miner-offline';
import type { MCPPromptDefinition } from './types';

/**
 * All available MCP prompts.
 * Prompts are automatically registered with the MCP server.
 */
export const ALL_PROMPTS: MCPPromptDefinition[] = [
  troubleshootMinerOfflinePrompt,
  optimizePowerEfficiencyPrompt,
  batchFirmwareUpdatePrompt,
];

/**
 * Prompt lookup by name for handler dispatch.
 */
export const PROMPT_HANDLERS = new Map<string, MCPPromptDefinition['handler']>(
  ALL_PROMPTS.map((prompt) => [prompt.name, prompt.handler])
);

// Re-export types for convenience
export type {
  MCPPromptDefinition,
  PromptArgument,
  PromptContext,
  PromptHandler,
  PromptMessage,
  PromptMessageRole,
} from './types';
