# Cloudflare Agents API Reference

## Agent Class

The core class for building agents on Cloudflare.

### Class Definition

```typescript
import { Agent } from "agents";

class Agent<Env, State> {
  // Environment bindings (Workers AI, KV, D1, etc.)
  env: Env;

  // Current state (read-only, use setState to modify)
  state: State;

  // Optional initial state that persists across restarts
  initialState?: State;
}
```

### Type Parameters

| Parameter | Description |
|-----------|-------------|
| `Env` | Environment bindings type (Workers AI, KV, D1, R2, etc.) |
| `State` | Agent state type (must be JSON-serializable) |

## Lifecycle Hooks

### onStart()

Called when an agent instance initializes or resumes from hibernation.

```typescript
class MyAgent extends Agent<Env, State> {
  async onStart() {
    // Initialize connections, load data, etc.
    console.log("Agent started with state:", this.state);

    // Example: Initialize database tables
    this.sql`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      created_at TEXT
    )`;
  }
}
```

### onRequest(request)

Handle incoming HTTP requests.

```typescript
async onRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/status") {
    return Response.json({ status: "ok", state: this.state });
  }

  if (request.method === "POST" && url.pathname === "/action") {
    const body = await request.json();
    await this.processAction(body);
    return Response.json({ success: true });
  }

  return new Response("Not found", { status: 404 });
}
```

### onConnect(connection, ctx)

Triggered when a WebSocket connection is established.

```typescript
onConnect(connection: Connection, ctx: ConnectionContext) {
  // Access original HTTP request
  const url = new URL(ctx.request.url);
  const token = url.searchParams.get("token");
  const userAgent = ctx.request.headers.get("User-Agent");

  // Validate connection
  if (!this.validateToken(token)) {
    connection.close(4001, "Invalid token");
    return;
  }

  // Store per-connection state
  connection.setState({ userId: token, connectedAt: Date.now() });

  // Accept and send welcome
  connection.accept();
  connection.send(JSON.stringify({
    type: "welcome",
    connectionId: connection.id,
    state: this.state,
  }));
}
```

### onMessage(connection, message)

Process incoming WebSocket messages.

```typescript
onMessage(connection: Connection, message: WSMessage) {
  // message is ArrayBuffer | ArrayBufferView | string
  const data = JSON.parse(message as string);

  switch (data.type) {
    case "ping":
      connection.send(JSON.stringify({ type: "pong" }));
      break;

    case "action":
      this.handleAction(data.payload, connection);
      break;

    case "subscribe":
      this.addSubscriber(connection, data.channel);
      break;
  }
}
```

### onError(connection, error)

Handle WebSocket connection errors.

```typescript
onError(connection: Connection, error: Error) {
  console.error(`Connection ${connection.id} error:`, error.message);

  // Log to analytics
  this.env.ANALYTICS?.writeDataPoint({
    blobs: ["websocket_error", connection.id, error.message],
  });
}
```

### onClose(connection, code, reason, wasClean)

Handle WebSocket disconnections.

```typescript
onClose(
  connection: Connection,
  code: number,
  reason: string,
  wasClean: boolean
) {
  console.log(`Connection ${connection.id} closed: ${code} ${reason}`);

  // Clean up connection-specific resources
  this.removeSubscriber(connection);

  // Update agent state
  this.setState({
    ...this.state,
    connectedClients: this.state.connectedClients - 1,
  });
}
```

### onStateUpdate(state, source)

Called when state updates occur.

```typescript
onStateUpdate(state: State, source: "server" | Connection) {
  console.log(`State updated by ${source}:`, state);

  // Example: Broadcast state changes to all clients
  if (source === "server") {
    this.broadcastState(state);
  }

  // Example: Persist to external database
  if (state.needsSync) {
    this.syncToExternalDB(state);
  }
}
```

## State Management

### setState(state)

Update agent state. Persists to storage and notifies all connected clients.

```typescript
// Full state replacement
this.setState({
  counter: 0,
  users: [],
  lastUpdated: new Date().toISOString(),
});

// Partial update (spread existing state)
this.setState({
  ...this.state,
  counter: this.state.counter + 1,
});

// Complex state update
async incrementScore(userId: string, points: number) {
  const scores = { ...this.state.scores };
  scores[userId] = (scores[userId] || 0) + points;

  this.setState({
    ...this.state,
    scores,
    lastUpdated: new Date().toISOString(),
  });
}
```

### initialState

Define default state for new agent instances.

```typescript
class GameAgent extends Agent<Env, GameState> {
  initialState: GameState = {
    players: [],
    round: 0,
    status: "waiting",
    scores: {},
    config: {
      maxPlayers: 4,
      roundTime: 60,
    },
  };
}
```

## SQL Database API

### Basic Queries

```typescript
// Simple select
const users = this.sql`SELECT * FROM users`;

// Parameterized query (prevents SQL injection)
const userId = "user-123";
const [user] = this.sql`SELECT * FROM users WHERE id = ${userId}`;

// Insert
this.sql`INSERT INTO users (id, name, email)
         VALUES (${id}, ${name}, ${email})`;

// Update
this.sql`UPDATE users SET name = ${newName} WHERE id = ${id}`;

// Delete
this.sql`DELETE FROM users WHERE id = ${id}`;
```

### Typed Queries

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// Type parameter for result inference
const users = this.sql<User>`SELECT * FROM users`;
// users is User[]

const [user] = this.sql<User>`SELECT * FROM users WHERE id = ${id}`;
// user is User | undefined
```

### Advanced Patterns

```typescript
// Create tables on start
async onStart() {
  this.sql`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`;

  this.sql`CREATE INDEX IF NOT EXISTS idx_messages_user
           ON messages(user_id)`;
}

// Aggregate queries
async getStats() {
  const [stats] = this.sql`
    SELECT
      COUNT(*) as total_messages,
      COUNT(DISTINCT user_id) as unique_users,
      MAX(created_at) as last_message
    FROM messages
  `;
  return stats;
}

// Join queries
async getUserMessages(userId: string) {
  return this.sql`
    SELECT m.*, u.name as user_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.user_id = ${userId}
    ORDER BY m.created_at DESC
    LIMIT 100
  `;
}
```

## Task Scheduling

### schedule(when, callback, data)

Schedule a task for future execution.

```typescript
// Delay in seconds
const taskId = this.schedule(60, "sendReminder", { message: "Check in" });

// Specific Date
const taskId = this.schedule(
  new Date("2025-12-25T00:00:00Z"),
  "sendHolidayGreeting",
  { userId: "user-123" }
);

// Cron expression (daily at 9am UTC)
const taskId = this.schedule("0 9 * * *", "dailyReport", {});

// Cron expression (every 5 minutes)
const taskId = this.schedule("*/5 * * * *", "healthCheck", {});
```

### Callback Methods

```typescript
class SchedulerAgent extends Agent<Env, State> {
  // Callback must match the string passed to schedule()
  async sendReminder(data: { message: string }) {
    console.log("Reminder:", data.message);
    // Send notification via email, push, etc.
  }

  async dailyReport() {
    const stats = await this.getStats();
    await this.sendEmail("admin@example.com", "Daily Report", stats);
  }
}
```

### Managing Schedules

```typescript
// Get specific schedule
const schedule = this.getSchedule(taskId);
// Returns: { id, type, callback, data, scheduledAt } | undefined

// Get all schedules
const all = this.getSchedules();

// Filter by criteria
const delayed = this.getSchedules({ type: "delayed" });
const crons = this.getSchedules({ type: "cron" });
const byCallback = this.getSchedules({ description: "sendReminder" });
const inRange = this.getSchedules({
  timeRange: {
    start: new Date("2025-01-01"),
    end: new Date("2025-12-31"),
  },
});

// Cancel a schedule
this.cancelSchedule(taskId);
```

## Connection Interface

```typescript
interface Connection {
  // Unique identifier for this connection
  id: string;

  // Per-connection state
  state: any;

  // Update connection state
  setState(state: any): void;

  // Send message to client
  send(message: string | ArrayBuffer): void;

  // Close connection
  close(code?: number, reason?: string): void;

  // Accept incoming connection
  accept(): void;
}

interface ConnectionContext {
  // Original HTTP request that initiated WebSocket
  request: Request;
}
```

## AIChatAgent Class

Extended Agent for building chat interfaces.

```typescript
import { AIChatAgent } from "agents/ai-chat-agent";

class MyChatAgent extends AIChatAgent<Env> {
  // Built-in: this.messages contains conversation history

  async onChatMessage(onFinish: (result: any) => void) {
    return createDataStreamResponse({
      execute: async (dataStream) => {
        const stream = streamText({
          model: openai("gpt-4o"),
          messages: this.messages,
          tools: {
            // Define tools here
          },
          onFinish,
        });
        stream.mergeIntoDataStream(dataStream);
      },
    });
  }
}
```

**Features:**
- `this.messages` - Built-in conversation history
- Resumable streaming (reconnects continue from last position)
- Cross-tab/device message synchronization

## McpAgent Class

Agent that acts as an MCP server.

```typescript
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

class MyMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
  });

  async init() {
    // Register tools
    this.server.tool("tool_name", "description", schema, handler);

    // Register resources
    this.server.resource("uri", "description", handler);

    // Register prompts
    this.server.prompt("prompt_name", "description", handler);
  }
}
```

## MCP Client Methods

### addMcpServer(name, url, callbackHost, agentsPrefix, options)

Connect to an external MCP server.

```typescript
await this.addMcpServer(
  "external-tools",                    // Server name/ID
  "https://mcp-server.example.com",    // Server URL
  this.env.CALLBACK_HOST,              // Your agent's callback URL
  "/agents",                           // Agents route prefix
  {
    transport: "streamable-http",      // Transport type
    headers: { "X-API-Key": "..." },   // Optional headers
  }
);
```

### removeMcpServer(id)

Disconnect from an MCP server.

```typescript
await this.removeMcpServer("external-tools");
```

### getMcpServers()

Get state of all connected MCP servers.

```typescript
const servers = this.getMcpServers();
// Returns array of { id, name, url, state, tools }
```

## Routing Helpers

### routeAgentRequest(request, env, options)

Automatically route requests to agents.

```typescript
import { routeAgentRequest } from "agents";

export default {
  async fetch(request: Request, env: Env) {
    return routeAgentRequest(request, env, {
      onBeforeConnect: async (request) => {
        // Validate WebSocket connections
        if (!isAuthenticated(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        return null; // Continue
      },
      onBeforeRequest: async (request) => {
        // Validate HTTP requests
      },
    });
  },
};
```

### getAgentByName(binding, name)

Get agent instance by name.

```typescript
import { getAgentByName } from "agents";

const agent = getAgentByName(env.MY_AGENT, "user-123");

// Call methods directly (RPC)
const result = await agent.processRequest(data);

// Forward HTTP request
return agent.fetch(request);
```
