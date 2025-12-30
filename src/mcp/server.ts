/**
 * MCP Server Module
 *
 * Creates and configures the Model Context Protocol server
 * with resources, tools, and prompts for miner management.
 *
 * @module mcp/server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createBraiinsClient, BraiinsClient } from '../api/braiins';
import { RedisClient } from '../cache/redis';
import { SERVER_INFO, MCP_SCHEMES } from '../config/constants';
import type { AppConfig } from '../config/env';
import { createMinerService, MinerService } from '../services/miner.service';
import { createChildLogger } from '../utils/logger';
import { ALL_RESOURCES } from './resources';
import type { ResourceContext } from './resources/types';
import { ALL_TOOLS, TOOL_HANDLERS, type ToolContext } from './tools';

const mcpLogger = createChildLogger({ module: 'mcp' });

/**
 * Dependencies for MCP server.
 */
export interface MCPDependencies {
  redis: RedisClient | null;
  config: AppConfig;
}

/**
 * MCP server with service access.
 */
export interface MCPServerWithServices {
  server: Server;
  minerService: MinerService;
  braiinsClient: BraiinsClient;
}

/**
 * Creates and configures the MCP server.
 *
 * @param deps - Server dependencies
 * @returns Configured MCP server instance with services
 */
export async function createMCPServer(deps: MCPDependencies): Promise<MCPServerWithServices> {
  // Create Braiins API client
  const braiinsClient = createBraiinsClient({
    defaultTimeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
  });

  // Create miner service
  const minerService = createMinerService(braiinsClient, deps.redis);

  const server = new Server(
    {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    }
  );

  // ==================== Resources ====================
  // Resources are things Claude can read

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    mcpLogger.debug('Listing resources');

    const miners = await minerService.getRegisteredMiners();

    // Start with registered resource definitions
    const resources = ALL_RESOURCES.map((resource) => ({
      uri: resource.uriTemplate,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
    }));

    // Add legacy resources for backward compatibility
    resources.push(
      {
        uri: `${MCP_SCHEMES.MINER}list`,
        name: 'Miner List',
        description: 'List of all registered miners',
        mimeType: 'application/json',
      },
      {
        uri: `${MCP_SCHEMES.FLEET}status`,
        name: 'Fleet Status (Legacy)',
        description: 'Aggregated status of the mining fleet',
        mimeType: 'application/json',
      }
    );

    // Add individual miner resources
    for (const miner of miners) {
      resources.push({
        uri: `${MCP_SCHEMES.MINER}${miner.id}`,
        name: `Miner: ${miner.name}`,
        description: `Status and configuration for ${miner.name} (${miner.host})`,
        mimeType: 'application/json',
      });
    }

    return { resources };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    mcpLogger.debug('Reading resource', { uri });

    // Create resource context
    const resourceContext: ResourceContext = {
      minerService,
      braiinsClient,
    };

    // Try to match against registered resource handlers
    for (const resource of ALL_RESOURCES) {
      // Simple pattern matching for now (can be improved with regex)
      const templatePrefix = resource.uriTemplate.split('{')[0];
      if (templatePrefix && uri.startsWith(templatePrefix)) {
        try {
          const content = await resource.handler(uri, resourceContext);
          return {
            contents: [content],
          };
        } catch (error) {
          mcpLogger.error('Resource handler error', { uri, error });
          // Continue to legacy handlers if resource handler fails
        }
      }
    }

    // Legacy resource handlers for backward compatibility
    if (uri.startsWith(MCP_SCHEMES.MINER)) {
      const path = uri.replace(MCP_SCHEMES.MINER, '');

      if (path === 'list') {
        const miners = await minerService.getRegisteredMiners();
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                miners: miners.map((m) => ({
                  id: m.id,
                  name: m.name,
                  host: m.host,
                  tags: m.tags,
                })),
                total: miners.length,
              }),
            },
          ],
        };
      }

      // Single miner by ID
      try {
        const status = await minerService.getMinerStatus(path);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(status),
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
                minerId: path,
              }),
            },
          ],
        };
      }
    }

    if (uri.startsWith(MCP_SCHEMES.FLEET)) {
      const fleetStatus = await minerService.getFleetStatus();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(fleetStatus),
          },
        ],
      };
    }

    throw new Error(`Unknown resource URI: ${uri}`);
  });

  // ==================== Tools ====================
  // Tools are things Claude can do

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    mcpLogger.debug('Listing tools');

    return {
      tools: ALL_TOOLS.map((tool) => tool.schema),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    mcpLogger.info('Tool called', { name, args });

    try {
      // Lookup tool handler from registry
      const handler = TOOL_HANDLERS.get(name);
      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      // Create tool context
      const context: ToolContext = {
        minerService,
        braiinsClient,
      };

      // Execute tool handler
      return await handler(args ?? {}, context);
    } catch (error) {
      mcpLogger.error('Tool execution failed', { name, error });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            }),
          },
        ],
        isError: true,
      };
    }
  });

  mcpLogger.info('MCP server configured', {
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
  });

  return {
    server,
    minerService,
    braiinsClient,
  };
}
