# Cloudflare Agents MCP Integration

## Overview

The Cloudflare Agents SDK provides comprehensive support for the Model Context Protocol (MCP):
- **MCP Server**: Build agents that expose tools, resources, and prompts to AI assistants
- **MCP Client**: Connect agents to external MCP servers to access their capabilities

## What is MCP?

Model Context Protocol (MCP) is an open standard that connects AI systems with external applications. Think of it like a USB-C port for AI - a standardized way to connect AI agents to different services.

### MCP Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   MCP Host      │────>│   MCP Client    │────>│   MCP Server    │
│ (Claude, Cursor)│     │ (in Host/Agent) │     │ (Your Agent)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **MCP Hosts**: AI assistants (Claude, Cursor), AI agents, or applications
- **MCP Clients**: Connect to MCP servers and invoke tools
- **MCP Servers**: Expose tools, prompts, and resources

## Building MCP Servers

### McpAgent Class

```typescript
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export class MyMcpServer extends McpAgent<Env> {
  server = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
  });

  async init() {
    // Register tools, resources, and prompts
    this.registerTools();
    this.registerResources();
    this.registerPrompts();
  }

  private registerTools() {
    // Simple tool
    this.server.tool(
      "get_weather",
      "Get current weather for a city",
      {
        city: z.string().describe("City name"),
      },
      async ({ city }) => {
        const weather = await this.fetchWeather(city);
        return {
          content: [{ type: "text", text: JSON.stringify(weather) }],
        };
      }
    );

    // Tool with database access
    this.server.tool(
      "search_records",
      "Search database records",
      {
        query: z.string().describe("Search query"),
        limit: z.number().optional().describe("Max results"),
      },
      async ({ query, limit = 10 }) => {
        const results = this.sql`
          SELECT * FROM records
          WHERE name LIKE ${"%" + query + "%"}
          LIMIT ${limit}
        `;
        return {
          content: [{ type: "text", text: JSON.stringify(results) }],
        };
      }
    );

    // Tool that modifies data
    this.server.tool(
      "create_record",
      "Create a new record",
      {
        name: z.string(),
        data: z.record(z.any()),
      },
      async ({ name, data }) => {
        const id = crypto.randomUUID();
        this.sql`
          INSERT INTO records (id, name, data, created_at)
          VALUES (${id}, ${name}, ${JSON.stringify(data)}, ${new Date().toISOString()})
        `;
        return {
          content: [{ type: "text", text: `Created record ${id}` }],
        };
      }
    );
  }

  private registerResources() {
    // Static resource
    this.server.resource(
      "config://settings",
      "Application configuration",
      async () => {
        return {
          content: [{
            type: "text",
            text: JSON.stringify(this.state.config),
          }],
        };
      }
    );

    // Dynamic resource with URI template
    this.server.resource(
      "database://records/{id}",
      "Database record by ID",
      async (uri) => {
        const id = uri.split("/").pop();
        const [record] = this.sql`SELECT * FROM records WHERE id = ${id}`;
        return {
          content: [{
            type: "text",
            text: record ? JSON.stringify(record) : "Not found",
          }],
        };
      }
    );

    // List resource
    this.server.resource(
      "database://records",
      "All database records",
      async () => {
        const records = this.sql`SELECT * FROM records LIMIT 100`;
        return {
          content: [{
            type: "text",
            text: JSON.stringify(records),
          }],
        };
      }
    );
  }

  private registerPrompts() {
    // Simple prompt
    this.server.prompt(
      "summarize_records",
      "Summarize database records",
      async () => {
        const records = this.sql`SELECT * FROM records`;
        return {
          messages: [{
            role: "user",
            content: {
              type: "text",
              text: `Please summarize these records:\n${JSON.stringify(records, null, 2)}`,
            },
          }],
        };
      }
    );

    // Prompt with arguments
    this.server.prompt(
      "analyze_record",
      "Analyze a specific record",
      {
        record_id: z.string().describe("Record ID to analyze"),
      },
      async ({ record_id }) => {
        const [record] = this.sql`SELECT * FROM records WHERE id = ${record_id}`;
        return {
          messages: [{
            role: "user",
            content: {
              type: "text",
              text: `Please analyze this record:\n${JSON.stringify(record, null, 2)}`,
            },
          }],
        };
      }
    );
  }
}
```

### Wrangler Configuration

```jsonc
{
  "name": "my-mcp-server",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "durable_objects": {
    "bindings": [
      {
        "name": "MCP_SERVER",
        "class_name": "MyMcpServer"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["MyMcpServer"]
    }
  ]
}
```

### MCP Server Features

#### Hibernation Support

McpAgent instances automatically support hibernation:
- State preserved during inactivity
- Only consume resources when processing requests
- Full context and conversation history maintained

```typescript
class StatefulMcpServer extends McpAgent<Env> {
  // State persists through hibernation
  initialState = {
    requestCount: 0,
    lastAccess: null,
  };

  async init() {
    this.server.tool("get_stats", "Get server stats", {}, async () => {
      this.setState({
        ...this.state,
        requestCount: this.state.requestCount + 1,
        lastAccess: new Date().toISOString(),
      });
      return {
        content: [{ type: "text", text: JSON.stringify(this.state) }],
      };
    });
  }
}
```

#### Authorization

```typescript
import { McpAgent } from "agents/mcp";

class SecureMcpServer extends McpAgent<Env> {
  async onRequest(request: Request): Promise<Response> {
    // Validate authorization header
    const authHeader = request.headers.get("Authorization");
    if (!this.validateAuth(authHeader)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Continue to MCP handling
    return super.onRequest(request);
  }

  private validateAuth(header: string | null): boolean {
    if (!header?.startsWith("Bearer ")) return false;
    const token = header.slice(7);
    return token === this.env.MCP_API_KEY;
  }
}
```

## MCP Client Integration

Connect your agent to external MCP servers.

### Adding MCP Servers

```typescript
class AgentWithMcp extends Agent<Env, State> {
  async onStart() {
    // Connect to external MCP server
    await this.addMcpServer(
      "weather-service",                          // Unique server ID
      "https://weather-mcp.example.com",          // Server URL
      this.env.MCP_CALLBACK_HOST,                 // Your agent's callback URL
      "/agents",                                  // Route prefix
      {
        transport: "streamable-http",             // Recommended transport
        headers: {
          "X-API-Key": this.env.WEATHER_API_KEY,
        },
      }
    );

    // Connect to another MCP server
    await this.addMcpServer(
      "database-tools",
      "https://db-mcp.example.com",
      this.env.MCP_CALLBACK_HOST,
      "/agents"
    );
  }
}
```

### Managing MCP Connections

```typescript
class AgentWithMcp extends Agent<Env, State> {
  async getMcpStatus() {
    const servers = this.getMcpServers();
    return servers.map(server => ({
      id: server.id,
      name: server.name,
      state: server.state,  // idle, connecting, authenticating, connected, discovering, ready
      tools: server.tools,
    }));
  }

  async disconnectMcp(serverId: string) {
    await this.removeMcpServer(serverId);
  }
}
```

### MCPConnectionState

```typescript
enum MCPConnectionState {
  idle = "idle",
  connecting = "connecting",
  authenticating = "authenticating",
  connected = "connected",
  discovering = "discovering",
  ready = "ready",
}
```

### Using MCP Tools in AI Workflows

```typescript
import { AIChatAgent } from "agents/ai-chat-agent";
import { streamText } from "ai";

class AiAgentWithMcp extends AIChatAgent<Env> {
  async onStart() {
    // Connect to MCP servers
    await this.addMcpServer(
      "tools",
      "https://tools-mcp.example.com",
      this.env.CALLBACK_HOST,
      "/agents"
    );
  }

  async onChatMessage(onFinish) {
    // MCP tools are automatically available to the AI model
    const servers = this.getMcpServers();
    const mcpTools = servers.flatMap(s => s.tools || []);

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const stream = streamText({
          model: openai("gpt-4o"),
          messages: this.messages,
          tools: {
            // Include MCP tools
            ...Object.fromEntries(
              mcpTools.map(tool => [
                `${tool.serverId}_${tool.name}`,  // Namespaced to prevent conflicts
                {
                  description: tool.description,
                  parameters: tool.inputSchema,
                  execute: async (args) => {
                    return this.invokeMcpTool(tool.serverId, tool.name, args);
                  },
                },
              ])
            ),
          },
          onFinish,
        });
        stream.mergeIntoDataStream(dataStream);
      },
    });
  }
}
```

## Transport Types

### Streamable HTTP (Recommended)

```typescript
await this.addMcpServer(
  "server-id",
  "https://mcp-server.example.com",
  callbackHost,
  prefix,
  { transport: "streamable-http" }
);
```

Benefits:
- More efficient data streaming
- Reduced overhead
- Enhanced connection stability
- Better error recovery
- Automatic fallback if not available

### Server-Sent Events (SSE)

```typescript
await this.addMcpServer(
  "server-id",
  "https://mcp-server.example.com",
  callbackHost,
  prefix,
  { transport: "sse" }
);
```

Use when streamable HTTP is not supported by the server.

## MCP Elicitation

Request user input during tool execution.

```typescript
class InteractiveMcpServer extends McpAgent<Env> {
  async init() {
    this.server.tool(
      "confirm_action",
      "Perform an action that requires confirmation",
      {
        action: z.string(),
      },
      async ({ action }, { elicit }) => {
        // Request user confirmation
        const response = await elicit({
          type: "confirm",
          message: `Are you sure you want to ${action}?`,
          options: ["Yes", "No"],
        });

        if (response === "Yes") {
          await this.performAction(action);
          return { content: [{ type: "text", text: "Action completed" }] };
        } else {
          return { content: [{ type: "text", text: "Action cancelled" }] };
        }
      }
    );

    this.server.tool(
      "get_user_input",
      "Request additional information from user",
      {
        prompt: z.string(),
      },
      async ({ prompt }, { elicit }) => {
        // Request text input
        const userInput = await elicit({
          type: "text",
          message: prompt,
        });

        return {
          content: [{ type: "text", text: `User provided: ${userInput}` }],
        };
      }
    );
  }
}
```

Features:
- Confirmations
- Forms
- Multi-step processes
- Durable storage preserves elicitation state during hibernation

## Cloudflare's MCP Servers

Cloudflare provides managed MCP servers you can connect to:

- **Workers** - Manage Workers and Workers AI
- **KV** - Key-value storage operations
- **R2** - Object storage operations
- **D1** - SQL database operations
- **Pages** - Static site deployments
- **DNS** - DNS record management

Connect via OAuth on supported clients (Claude, Windsurf, AI Playground).

## Best Practices

### Tool Design

1. **Goal-oriented tools** - Build for specific user goals, not API wrappers
2. **Fewer, well-designed tools** - Better than many granular ones
3. **Detailed descriptions** - Help AI understand how to use tools correctly
4. **Parameter constraints** - Document expected values and limits

### Security

1. **Scoped permissions** - Deploy focused MCP servers with narrow permissions
2. **Validate inputs** - Always validate tool arguments
3. **Rate limiting** - Protect against abuse
4. **Audit logging** - Track all tool invocations

### Performance

1. **Use hibernation** - Let servers sleep during inactivity
2. **Batch operations** - Combine related tool calls when possible
3. **Cache results** - Store frequently accessed data
4. **Monitor latency** - Track tool execution times
