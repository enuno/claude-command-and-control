---
name: cloudflare-agents
version: "1.0.0"
description: Cloudflare Agents SDK - Build and deploy AI-powered agents on Cloudflare's edge with real-time WebSocket communication, persistent state, SQL storage, task scheduling, MCP integration, and human-in-the-loop workflows.
---

# Cloudflare Agents SDK Skill

The Cloudflare Agents SDK enables you to build and deploy AI-powered agents that run on Cloudflare's global edge network. Agents can autonomously perform tasks, communicate with clients in real-time via WebSockets, call AI models, persist state, schedule tasks, run asynchronous workflows, browse the web, query data from databases, support human-in-the-loop interactions, and act as MCP (Model Context Protocol) servers or clients.

**Core Value**: Agents deploy on Cloudflare's Durable Objects - stateful micro-servers that can scale to tens of millions and run close to users for low-latency interactivity.

## When to Use This Skill

This skill should be triggered when:
- Building AI agents that need persistent state and real-time communication
- Creating chatbots or conversational AI interfaces on Cloudflare Workers
- Implementing WebSocket-based real-time applications
- Deploying agents with embedded SQL databases (SQLite)
- Scheduling tasks with delays, dates, or cron expressions
- Building human-in-the-loop approval workflows for AI tool execution
- Creating or connecting to MCP (Model Context Protocol) servers
- Deploying stateful AI applications on edge infrastructure
- Building multi-user collaborative AI applications
- Integrating with Vercel AI SDK on Cloudflare Workers

## Quick Reference

### Installation

```bash
# Add to existing Workers project
npm i agents

# Or create new project from starter template
npm create cloudflare@latest agents-starter -- --template=cloudflare/agents-starter

# Navigate and run
cd agents-starter
mv .env.local .env
npm install
npm run dev
```

### Package Imports

```typescript
// Core Agent classes
import { Agent } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import { McpAgent } from "agents/mcp";

// Client-side
import { AgentClient } from "agents/client";

// React hooks
import { useAgent } from "agents/react";
import { useAgentChat } from "agents/ai-react";

// Routing
import { routeAgentRequest, getAgentByName } from "agents";
```

### Basic Agent Setup

```typescript
import { Agent, routeAgentRequest } from "agents";

// Define your Agent class
export class MyAgent extends Agent<Env, State> {
  // Optional: Set initial state
  initialState = {
    counter: 0,
    messages: [],
  };

  // Called when agent starts or resumes
  async onStart() {
    console.log("Agent started");
  }

  // Handle HTTP requests
  async onRequest(request: Request): Promise<Response> {
    return new Response("Hello from Agent!");
  }

  // Handle WebSocket connections
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    console.log(`Client connected: ${connection.id}`);
  }

  // Handle WebSocket messages
  async onMessage(connection: Connection, message: WSMessage) {
    const data = JSON.parse(message as string);
    connection.send(JSON.stringify({ received: data }));
  }

  // Handle state updates
  onStateUpdate(state: State, source: "server" | Connection) {
    console.log("State updated:", state);
  }
}

// Export default handler with routing
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return routeAgentRequest(request, env);
  },
};
```

### Configuration (wrangler.jsonc)

```jsonc
{
  "name": "my-agent",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "durable_objects": {
    "bindings": [
      {
        "name": "MY_AGENT",
        "class_name": "MyAgent"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["MyAgent"]
    }
  ]
}
```

## Agent API Reference

### Agent Class

The base class for all agents, providing lifecycle hooks and capabilities.

```typescript
class Agent<Env, State> {
  // Properties
  env: Env;                    // Environment bindings
  state: State;                // Current state (read-only)
  initialState?: State;        // Optional default state

  // Lifecycle hooks
  onStart(): void | Promise<void>;
  onRequest(request: Request): Response | Promise<Response>;
  onConnect(connection: Connection, ctx: ConnectionContext): void;
  onMessage(connection: Connection, message: WSMessage): void;
  onError(connection: Connection, error: Error): void;
  onClose(connection: Connection, code: number, reason: string, wasClean: boolean): void;
  onStateUpdate(state: State, source: "server" | Connection): void;

  // State management
  setState(state: Partial<State>): void;

  // SQL database
  sql`query`: SQLResult;

  // Task scheduling
  schedule(when: number | Date | string, callback: string, data?: any): string;
  getSchedule(id: string): Schedule | undefined;
  getSchedules(criteria?: ScheduleCriteria): Schedule[];
  cancelSchedule(id: string): void;

  // MCP integration
  addMcpServer(name: string, url: string, ...): void;
  removeMcpServer(id: string): void;
  getMcpServers(): McpServer[];
}
```

### AIChatAgent Class

Extended Agent class for building chat interfaces with AI models.

```typescript
import { AIChatAgent } from "agents/ai-chat-agent";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, createDataStreamResponse } from "ai";

export class ChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish: (result: any) => void) {
    return createDataStreamResponse({
      execute: async (dataStream) => {
        const openai = createOpenAI({
          apiKey: this.env.OPENAI_API_KEY,
        });

        const stream = streamText({
          model: openai("gpt-4o"),
          messages: this.messages,  // Built-in message history
          onFinish,
        });

        stream.mergeIntoDataStream(dataStream);
      },
    });
  }
}
```

**Features:**
- Automatic resumable streaming (reconnects resume from last position)
- Works across browser tabs and devices
- Built-in message history via `this.messages`

## State Management

### Server-Side State

```typescript
interface GameState {
  players: string[];
  score: number;
  status: "waiting" | "playing" | "finished";
}

class GameAgent extends Agent<Env, GameState> {
  initialState: GameState = {
    players: [],
    score: 0,
    status: "waiting",
  };

  async addPlayer(name: string) {
    this.setState({
      ...this.state,
      players: [...this.state.players, name],
    });
  }

  async startGame() {
    this.setState({
      ...this.state,
      status: "playing",
    });
  }

  onStateUpdate(state: GameState, source: "server" | Connection) {
    // Triggered on every state change
    // source indicates if change was from server or a client
    console.log(`State updated by ${source}:`, state);
  }
}
```

### Client-Side Synchronization (React)

```tsx
import { useAgent } from "agents/react";
import { useState, useEffect } from "react";

function GameInterface() {
  const [state, setState] = useState({ players: [], score: 0 });

  const agent = useAgent({
    agent: "game-agent",
    name: "room-123",  // Unique instance identifier
    onStateUpdate: (newState) => setState(newState),
  });

  const addPlayer = (name: string) => {
    agent.setState({
      ...state,
      players: [...state.players, name],
    });
  };

  return (
    <div>
      <h2>Players: {state.players.join(", ")}</h2>
      <button onClick={() => addPlayer("Player")}>Join</button>
    </div>
  );
}
```

**State Characteristics:**
- Persisted across Agent restarts
- Thread-safe for concurrent updates
- Zero-latency (colocated with Agent)
- JSON-serializable data
- Automatic sync to all connected clients

## SQL Database

Each Agent has an embedded SQLite database with zero-latency access.

```typescript
class DataAgent extends Agent<Env, State> {
  // Basic query
  async getUser(userId: string) {
    const [user] = this.sql`SELECT * FROM users WHERE id = ${userId}`;
    return user;
  }

  // Typed query
  async getUsers(): User[] {
    return this.sql<User>`SELECT * FROM users ORDER BY created_at DESC`;
  }

  // Insert data
  async createUser(name: string, email: string) {
    this.sql`INSERT INTO users (name, email, created_at)
             VALUES (${name}, ${email}, ${new Date().toISOString()})`;
  }

  // Transaction-like operations
  async transferCredits(from: string, to: string, amount: number) {
    this.sql`UPDATE users SET credits = credits - ${amount} WHERE id = ${from}`;
    this.sql`UPDATE users SET credits = credits + ${amount} WHERE id = ${to}`;
  }
}
```

**Database Limits:**
- Up to 1GB per Agent instance
- Each task/row up to 2MB
- Immediate read-after-write consistency

## Task Scheduling

Schedule tasks for future execution using delays, dates, or cron expressions.

```typescript
class SchedulerAgent extends Agent<Env, State> {
  async scheduleReminder(userId: string, message: string, when: Date) {
    // Schedule with Date
    const taskId = this.schedule(when, "sendReminder", { userId, message });
    return taskId;
  }

  async scheduleDelay(seconds: number) {
    // Schedule with delay in seconds
    this.schedule(seconds, "delayedTask", { data: "payload" });
  }

  async scheduleCron() {
    // Schedule with cron expression (runs daily at 9am UTC)
    this.schedule("0 9 * * *", "dailyReport", {});
  }

  // Callback methods (must match callback string)
  async sendReminder(data: { userId: string; message: string }) {
    // Send notification to user
    console.log(`Reminder for ${data.userId}: ${data.message}`);
  }

  async delayedTask(data: { data: string }) {
    console.log("Delayed task executed:", data);
  }

  async dailyReport() {
    // Generate daily report
  }

  // Query scheduled tasks
  async listSchedules() {
    const all = this.getSchedules();
    const pending = this.getSchedules({ type: "scheduled" });
    const crons = this.getSchedules({ type: "cron" });
    return { all, pending, crons };
  }

  // Cancel a task
  async cancelTask(taskId: string) {
    this.cancelSchedule(taskId);
  }
}
```

**Schedule Types:**
- `"scheduled"` - One-time at specific Date
- `"delayed"` - After N seconds
- `"cron"` - Recurring via cron expression

## WebSocket Communication

### Server-Side

```typescript
class ChatRoomAgent extends Agent<Env, State> {
  onConnect(connection: Connection, ctx: ConnectionContext) {
    // Access request headers, cookies, URL
    const url = new URL(ctx.request.url);
    const token = url.searchParams.get("token");

    // Validate and accept connection
    if (!this.validateToken(token)) {
      connection.close(4001, "Unauthorized");
      return;
    }

    // Store connection-specific state
    connection.setState({ userId: token });

    // Send welcome message
    connection.send(JSON.stringify({ type: "welcome", state: this.state }));
  }

  onMessage(connection: Connection, message: WSMessage) {
    const data = JSON.parse(message as string);

    switch (data.type) {
      case "chat":
        this.broadcastMessage(connection, data.content);
        break;
      case "typing":
        this.broadcastTyping(connection);
        break;
    }
  }

  onClose(connection: Connection, code: number, reason: string, wasClean: boolean) {
    console.log(`Client ${connection.id} disconnected: ${reason}`);
  }

  onError(connection: Connection, error: Error) {
    console.error(`Connection error: ${error.message}`);
  }

  private broadcastMessage(sender: Connection, content: string) {
    // Broadcast to all connections (accessed via this mechanism)
    // Implementation depends on tracking connections
  }
}
```

### Client-Side (Vanilla JS)

```typescript
import { AgentClient } from "agents/client";

const client = new AgentClient({
  agent: "chat-room-agent",
  name: "room-general",
});

client.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
});

client.addEventListener("open", () => {
  client.send(JSON.stringify({ type: "chat", content: "Hello!" }));
});

client.addEventListener("close", (event) => {
  console.log("Disconnected:", event.reason);
});
```

### Client-Side (React)

```tsx
import { useAgent } from "agents/react";

function ChatRoom() {
  const [messages, setMessages] = useState([]);

  const agent = useAgent({
    agent: "chat-room-agent",
    name: "room-general",
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      setMessages((prev) => [...prev, data]);
    },
    onOpen: () => console.log("Connected"),
    onClose: () => console.log("Disconnected"),
  });

  const sendMessage = (content: string) => {
    agent.send(JSON.stringify({ type: "chat", content }));
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
      <input onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage(e.target.value);
      }} />
    </div>
  );
}
```

## AI Chat with useAgentChat

Build complete chat interfaces with the `useAgentChat` hook.

```tsx
import { useAgent } from "agents/react";
import { useAgentChat } from "agents/ai-react";

function AIChat() {
  const agent = useAgent({
    agent: "chat-agent",
    name: "session-123",
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearHistory,
  } = useAgentChat({
    agent,
    maxSteps: 10,  // Max tool invocations per message
  });

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>

      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

## Human-in-the-Loop

Implement approval workflows for sensitive AI tool executions.

### Server-Side

```typescript
import { AIChatAgent } from "agents/ai-chat-agent";
import { streamText, tool } from "ai";

// Tools requiring confirmation
const toolsRequiringConfirmation = ["send_email", "make_payment", "delete_data"];

export class ApprovalAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish) {
    return createDataStreamResponse({
      execute: async (dataStream) => {
        const stream = streamText({
          model: openai("gpt-4o"),
          messages: this.messages,
          tools: {
            send_email: tool({
              description: "Send an email to a user",
              parameters: z.object({
                to: z.string(),
                subject: z.string(),
                body: z.string(),
              }),
              // No execute = requires confirmation
            }),
            get_weather: tool({
              description: "Get weather data",
              parameters: z.object({ city: z.string() }),
              execute: async ({ city }) => {
                // Auto-executes without confirmation
                return { temp: 72, conditions: "sunny" };
              },
            }),
          },
          onFinish,
        });
        stream.mergeIntoDataStream(dataStream);
      },
    });
  }
}
```

### Client-Side (React)

```tsx
import { useAgentChat } from "agents/ai-react";

function ApprovalChat() {
  const { messages, handleSubmit, addToolResult } = useAgentChat({
    agent,
    maxSteps: 10,
  });

  const handleApprove = async (toolCallId: string, args: any) => {
    // Execute the tool and return result
    const result = await executeToolOnServer(toolCallId, args);
    addToolResult({ toolCallId, result });
  };

  const handleReject = (toolCallId: string) => {
    addToolResult({ toolCallId, result: "User rejected this action" });
  };

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.content}

          {/* Show approval UI for pending tool calls */}
          {msg.toolInvocations?.map((tool) => (
            tool.state === "call" && (
              <div key={tool.toolCallId} className="approval-prompt">
                <p>Approve {tool.toolName}?</p>
                <pre>{JSON.stringify(tool.args, null, 2)}</pre>
                <button onClick={() => handleApprove(tool.toolCallId, tool.args)}>
                  Approve
                </button>
                <button onClick={() => handleReject(tool.toolCallId)}>
                  Reject
                </button>
              </div>
            )
          ))}
        </div>
      ))}
    </div>
  );
}
```

**Best Practices:**
- Only require confirmation for meaningful consequences (payments, emails, data changes)
- Show complete context including all tool arguments
- Implement timeouts for auto-rejection
- Log all approval decisions for audit

## MCP (Model Context Protocol)

### As MCP Server

Expose your Agent as an MCP server for AI assistants.

```typescript
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export class MyMcpServer extends McpAgent<Env> {
  server = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
  });

  async init() {
    // Register tools
    this.server.tool(
      "search_database",
      "Search the database for records",
      { query: z.string() },
      async (args) => {
        const results = this.sql`SELECT * FROM records WHERE name LIKE ${args.query}`;
        return { content: [{ type: "text", text: JSON.stringify(results) }] };
      }
    );

    // Register resources
    this.server.resource(
      "database://records",
      "Database records",
      async () => {
        const records = this.sql`SELECT * FROM records`;
        return { content: [{ type: "text", text: JSON.stringify(records) }] };
      }
    );
  }
}
```

### As MCP Client

Connect to external MCP servers from your Agent.

```typescript
class AgentWithMcp extends Agent<Env, State> {
  async onStart() {
    // Connect to MCP server
    await this.addMcpServer(
      "weather-service",
      "https://weather-mcp.example.com",
      this.env.MCP_CALLBACK_HOST,
      "/agents"
    );
  }

  async getWeather(city: string) {
    // MCP tools are automatically available
    // Tools are namespaced by server ID
    const servers = this.getMcpServers();
    // Use tools via AI model integration
  }

  async cleanup() {
    await this.removeMcpServer("weather-service");
  }
}
```

**MCP Features:**
- Hibernation support (preserves state during sleep)
- HTTP streamable transport (recommended)
- Automatic tool namespacing
- OAuth authorization support
- Elicitation (user input during tool execution)

## Routing & Calling Agents

### Automatic Routing

```typescript
import { routeAgentRequest } from "agents";

export default {
  async fetch(request: Request, env: Env) {
    // Routes /agents/:agent/:name automatically
    // e.g., /agents/my-agent/user-123
    return routeAgentRequest(request, env);
  },
};
```

### Manual Routing

```typescript
import { getAgentByName } from "agents";

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/custom/")) {
      const agentName = url.pathname.split("/")[2];
      const agent = getAgentByName(env.MY_AGENT, agentName);
      return agent.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
```

### Direct Method Invocation (RPC)

```typescript
import { getAgentByName } from "agents";

export default {
  async fetch(request: Request, env: Env) {
    const agent = getAgentByName(env.MY_AGENT, "user-123");

    // Call methods directly (no HTTP serialization)
    const response = await agent.chat("Hello!");
    const state = await agent.getState();

    return Response.json({ response, state });
  },
};
```

## Authentication

### Via routeAgentRequest Hooks

```typescript
export default {
  async fetch(request: Request, env: Env) {
    return routeAgentRequest(request, env, {
      onBeforeConnect: async (request) => {
        const token = request.headers.get("Authorization");
        if (!validateToken(token)) {
          return new Response("Unauthorized", { status: 401 });
        }
        return null; // Continue to agent
      },
      onBeforeRequest: async (request) => {
        // Similar validation for HTTP requests
      },
    });
  },
};
```

### Via Middleware (Hono)

```typescript
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { getAgentByName } from "agents";

const app = new Hono();

app.use("/agents/*", jwt({ secret: process.env.JWT_SECRET }));

app.all("/agents/:agent/:name/*", async (c) => {
  const user = c.get("jwtPayload");
  const agent = getAgentByName(c.env.MY_AGENT, c.req.param("name"));
  return agent.fetch(c.req.raw);
});

export default app;
```

## Deployment

```bash
# Deploy to Cloudflare
npm run deploy
# or
wrangler deploy

# Set secrets
wrangler secret put OPENAI_API_KEY
wrangler secret put JWT_SECRET

# View logs
wrangler tail
```

## Related Cloudflare Services

| Service | Integration |
|---------|-------------|
| **Workers AI** | Serverless GPU-powered models via `@cloudflare/ai` |
| **AI Gateway** | Caching, rate limiting, model fallbacks |
| **Vectorize** | Vector database for RAG and semantic search |
| **Workflows** | Stateful execution with automatic retries |
| **D1** | Additional SQL database storage |
| **R2** | Object storage for large files |
| **KV** | Key-value storage for config/cache |

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **api-reference.md** - Complete Agent class API documentation
- **state-sql.md** - State management and SQL database guide
- **mcp-integration.md** - Model Context Protocol server/client guide
- **examples.md** - Full application examples

## Resources

- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Agents API Reference](https://developers.cloudflare.com/agents/api-reference/agents-api/)
- [GitHub: cloudflare/agents](https://github.com/cloudflare/agents)
- [GitHub: cloudflare/agents-starter](https://github.com/cloudflare/agents-starter)
- [npm: @cloudflare/agents](https://www.npmjs.com/package/@cloudflare/agents)
- [MCP Documentation](https://developers.cloudflare.com/agents/model-context-protocol/)
- [Human-in-the-Loop Guide](https://developers.cloudflare.com/agents/guides/human-in-the-loop/)
- [Schedule Tasks](https://developers.cloudflare.com/agents/api-reference/schedule-tasks/)
- [Store and Sync State](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/)
- [Blog: Making Cloudflare the Best Platform for AI Agents](https://blog.cloudflare.com/build-ai-agents-on-cloudflare/)

## Notes

- Agents run on Durable Objects (stateful micro-servers)
- Each Agent instance has its own isolated state and SQLite database
- WebSocket hibernation preserves state during inactivity
- Supports AI SDK v6 with resumable streaming
- MCP servers can be stateful applications (not just API wrappers)
- Global uniqueness: same name = same instance across requests
- Licensed under Apache 2.0

## Version History

- **1.0.0** (2026-01-08): Initial release
  - Core Agent and AIChatAgent documentation
  - State management and SQL database API
  - WebSocket communication patterns
  - Task scheduling (delay, Date, cron)
  - Human-in-the-loop workflows
  - MCP server and client integration
  - React hooks (useAgent, useAgentChat)
  - Authentication patterns
  - Deployment configuration
