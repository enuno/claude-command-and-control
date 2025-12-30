/**
 * Register Miner Tool
 *
 * Registers a new miner with the MCP server for management.
 *
 * @module mcp/tools/register-miner
 */

import { z } from 'zod';
import type { MinerRegistration } from '../../services/miner.service';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const RegisterMinerArgsSchema = z.object({
  id: z.string().min(1, 'Miner ID is required'),
  name: z.string().min(1, 'Miner name is required'),
  host: z.string().regex(/^[\w.-]+$/, 'Invalid hostname format'),
  port: z.number().int().min(1).max(65535).optional(),
  username: z.string().default('root'),
  password: z.string().min(1, 'Password is required'),
  useTls: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const registerMinerTool: MCPToolDefinition = {
  schema: {
    name: 'register_miner',
    description: 'Register a new miner with the MCP server',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Unique identifier for the miner',
        },
        name: {
          type: 'string',
          description: 'Human-readable name for the miner',
        },
        host: {
          type: 'string',
          description: 'IP address or hostname of the miner',
        },
        port: {
          type: 'number',
          description: 'HTTP port (default: 80)',
        },
        username: {
          type: 'string',
          description: 'Login username (default: root)',
        },
        password: {
          type: 'string',
          description: 'Login password',
        },
        useTls: {
          type: 'boolean',
          description: 'Use HTTPS (default: false)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional tags for organization',
        },
      },
      required: ['id', 'name', 'host', 'password'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      // Validate and parse arguments
      const validated = RegisterMinerArgsSchema.parse(args);

      const registration: MinerRegistration = {
        id: validated.id,
        name: validated.name,
        host: validated.host,
        port: validated.port,
        username: validated.username,
        password: validated.password,
        useTls: validated.useTls,
        tags: validated.tags,
      };

      await context.minerService.registerMiner(registration);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Miner '${registration.name}' registered successfully`,
              minerId: registration.id,
              host: registration.host,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to register miner',
              suggestion: 'Verify miner credentials and network connectivity',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
