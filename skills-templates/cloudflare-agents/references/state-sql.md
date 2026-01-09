# Cloudflare Agents State Management & SQL Database

## State Management Overview

Cloudflare Agents provide built-in state management with:
- **Persistence** - State survives agent restarts and hibernation
- **Thread Safety** - Concurrent updates are handled safely
- **Zero Latency** - State is colocated with the agent
- **Auto Sync** - Connected clients automatically receive updates
- **JSON Serialization** - Any JSON-serializable data supported

## Server-Side State API

### Defining State Type

```typescript
interface AppState {
  users: User[];
  messages: Message[];
  config: {
    maxUsers: number;
    allowGuests: boolean;
  };
  stats: {
    totalMessages: number;
    activeUsers: number;
  };
}

interface User {
  id: string;
  name: string;
  role: "admin" | "member" | "guest";
  joinedAt: string;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}
```

### Initial State

```typescript
class AppAgent extends Agent<Env, AppState> {
  initialState: AppState = {
    users: [],
    messages: [],
    config: {
      maxUsers: 100,
      allowGuests: true,
    },
    stats: {
      totalMessages: 0,
      activeUsers: 0,
    },
  };
}
```

### Reading State

```typescript
class AppAgent extends Agent<Env, AppState> {
  // State is read-only via this.state
  async getStatus() {
    return {
      userCount: this.state.users.length,
      messageCount: this.state.messages.length,
      isOpen: this.state.users.length < this.state.config.maxUsers,
    };
  }

  async findUser(userId: string) {
    return this.state.users.find(u => u.id === userId);
  }
}
```

### Updating State

```typescript
class AppAgent extends Agent<Env, AppState> {
  // Always spread existing state for partial updates
  async addUser(user: User) {
    this.setState({
      ...this.state,
      users: [...this.state.users, user],
      stats: {
        ...this.state.stats,
        activeUsers: this.state.stats.activeUsers + 1,
      },
    });
  }

  async removeUser(userId: string) {
    this.setState({
      ...this.state,
      users: this.state.users.filter(u => u.id !== userId),
      stats: {
        ...this.state.stats,
        activeUsers: this.state.stats.activeUsers - 1,
      },
    });
  }

  async addMessage(message: Message) {
    this.setState({
      ...this.state,
      messages: [...this.state.messages, message],
      stats: {
        ...this.state.stats,
        totalMessages: this.state.stats.totalMessages + 1,
      },
    });
  }

  async updateConfig(updates: Partial<AppState["config"]>) {
    this.setState({
      ...this.state,
      config: {
        ...this.state.config,
        ...updates,
      },
    });
  }
}
```

### State Update Events

```typescript
class AppAgent extends Agent<Env, AppState> {
  onStateUpdate(state: AppState, source: "server" | Connection) {
    console.log(`State updated by: ${source}`);

    // Handle server-initiated updates
    if (source === "server") {
      // Broadcast to external systems, webhooks, etc.
    }

    // Handle client-initiated updates
    if (typeof source !== "string") {
      // source is a Connection object
      console.log(`Client ${source.id} updated state`);
    }

    // Trigger side effects
    if (state.users.length >= state.config.maxUsers) {
      this.notifyAdmins("Room is full");
    }
  }
}
```

## Client-Side State Sync

### React useAgent Hook

```tsx
import { useAgent } from "agents/react";
import { useState, useEffect } from "react";

function App() {
  const [state, setState] = useState<AppState | null>(null);

  const agent = useAgent({
    agent: "app-agent",
    name: "room-1",
    onStateUpdate: (newState: AppState) => {
      setState(newState);
    },
    onOpen: () => {
      console.log("Connected to agent");
    },
    onClose: () => {
      console.log("Disconnected from agent");
    },
  });

  // Update state via agent
  const addUser = (name: string) => {
    agent.setState({
      ...state,
      users: [...state.users, { id: crypto.randomUUID(), name, role: "member", joinedAt: new Date().toISOString() }],
    });
  };

  if (!state) return <div>Connecting...</div>;

  return (
    <div>
      <h1>Users: {state.users.length}</h1>
      <button onClick={() => addUser("New User")}>Add User</button>
    </div>
  );
}
```

### Vanilla JavaScript AgentClient

```typescript
import { AgentClient } from "agents/client";

const client = new AgentClient({
  agent: "app-agent",
  name: "room-1",
});

let currentState: AppState;

// Listen for state updates
client.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "state") {
    currentState = data.state;
    updateUI(currentState);
  }
});

// Update state
function addUser(name: string) {
  client.send(JSON.stringify({
    type: "setState",
    state: {
      ...currentState,
      users: [...currentState.users, { id: crypto.randomUUID(), name }],
    },
  }));
}
```

## SQL Database

Each Agent instance has an embedded SQLite database with zero-latency access.

### Database Characteristics

| Feature | Value |
|---------|-------|
| Max Size | 1 GB per agent |
| Max Row Size | 2 MB |
| Latency | ~0ms (colocated) |
| Consistency | Immediate read-after-write |
| Isolation | Per-agent (no cross-agent access) |

### Schema Management

```typescript
class DataAgent extends Agent<Env, State> {
  async onStart() {
    // Create tables
    this.sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'member',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.sql`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        channel TEXT DEFAULT 'general',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    // Create indexes
    this.sql`CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id)`;
    this.sql`CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel)`;
    this.sql`CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)`;
  }
}
```

### CRUD Operations

```typescript
class DataAgent extends Agent<Env, State> {
  // Create
  async createUser(id: string, name: string, email: string) {
    this.sql`
      INSERT INTO users (id, name, email)
      VALUES (${id}, ${name}, ${email})
    `;
  }

  // Read single
  async getUser(id: string): Promise<User | undefined> {
    const [user] = this.sql<User>`
      SELECT * FROM users WHERE id = ${id}
    `;
    return user;
  }

  // Read multiple
  async getUsers(limit = 100): Promise<User[]> {
    return this.sql<User>`
      SELECT * FROM users
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
  }

  // Update
  async updateUser(id: string, updates: Partial<User>) {
    if (updates.name) {
      this.sql`UPDATE users SET name = ${updates.name}, updated_at = ${new Date().toISOString()} WHERE id = ${id}`;
    }
    if (updates.email) {
      this.sql`UPDATE users SET email = ${updates.email}, updated_at = ${new Date().toISOString()} WHERE id = ${id}`;
    }
    if (updates.role) {
      this.sql`UPDATE users SET role = ${updates.role}, updated_at = ${new Date().toISOString()} WHERE id = ${id}`;
    }
  }

  // Delete
  async deleteUser(id: string) {
    // Delete related messages first
    this.sql`DELETE FROM messages WHERE user_id = ${id}`;
    // Delete user
    this.sql`DELETE FROM users WHERE id = ${id}`;
  }
}
```

### Query Patterns

```typescript
class DataAgent extends Agent<Env, State> {
  // Search with LIKE
  async searchUsers(query: string): Promise<User[]> {
    const pattern = `%${query}%`;
    return this.sql<User>`
      SELECT * FROM users
      WHERE name LIKE ${pattern} OR email LIKE ${pattern}
      LIMIT 50
    `;
  }

  // Pagination
  async getMessagesPaginated(channel: string, page: number, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    return this.sql<Message>`
      SELECT * FROM messages
      WHERE channel = ${channel}
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
  }

  // Aggregations
  async getStats() {
    const [stats] = this.sql<{
      total_users: number;
      total_messages: number;
      messages_today: number;
    }>`
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM messages) as total_messages,
        (SELECT COUNT(*) FROM messages WHERE created_at >= date('now')) as messages_today
    `;
    return stats;
  }

  // Joins
  async getMessagesWithUsers(channel: string) {
    return this.sql<Message & { user_name: string }>`
      SELECT m.*, u.name as user_name
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.channel = ${channel}
      ORDER BY m.created_at DESC
      LIMIT 100
    `;
  }

  // Group by
  async getMessageCountByChannel() {
    return this.sql<{ channel: string; count: number }>`
      SELECT channel, COUNT(*) as count
      FROM messages
      GROUP BY channel
      ORDER BY count DESC
    `;
  }

  // Date filtering
  async getRecentMessages(hours: number) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    return this.sql<Message>`
      SELECT * FROM messages
      WHERE created_at >= ${cutoff}
      ORDER BY created_at DESC
    `;
  }
}
```

### Transaction-Like Operations

SQLite in Durable Objects doesn't support explicit transactions, but operations within a single request are atomic.

```typescript
class DataAgent extends Agent<Env, State> {
  async transferCredits(fromUserId: string, toUserId: string, amount: number) {
    // Check balance first
    const [fromUser] = this.sql<{ credits: number }>`
      SELECT credits FROM users WHERE id = ${fromUserId}
    `;

    if (!fromUser || fromUser.credits < amount) {
      throw new Error("Insufficient credits");
    }

    // Perform transfer (both operations in same request = atomic)
    this.sql`UPDATE users SET credits = credits - ${amount} WHERE id = ${fromUserId}`;
    this.sql`UPDATE users SET credits = credits + ${amount} WHERE id = ${toUserId}`;

    // Log transaction
    this.sql`
      INSERT INTO transactions (from_user, to_user, amount, created_at)
      VALUES (${fromUserId}, ${toUserId}, ${amount}, ${new Date().toISOString()})
    `;
  }
}
```

## State vs SQL: When to Use Which

| Use Case | Recommendation |
|----------|----------------|
| Real-time UI state | State (auto-sync to clients) |
| User preferences | State |
| Chat messages | SQL (queryable history) |
| Analytics/metrics | SQL (aggregations) |
| User profiles | SQL (searchable) |
| Session data | State |
| Audit logs | SQL (immutable records) |
| Game state | State (real-time updates) |
| Leaderboards | SQL (sorting, pagination) |

## Combining State and SQL

```typescript
class HybridAgent extends Agent<Env, AppState> {
  initialState: AppState = {
    onlineUsers: [],
    currentTopic: "",
  };

  async onConnect(connection: Connection, ctx: ConnectionContext) {
    const userId = this.getUserIdFromRequest(ctx.request);

    // Load user from SQL
    const [user] = this.sql<User>`SELECT * FROM users WHERE id = ${userId}`;

    // Update real-time state
    this.setState({
      ...this.state,
      onlineUsers: [...this.state.onlineUsers, user],
    });
  }

  async onClose(connection: Connection) {
    const userId = connection.state?.userId;

    // Update real-time state
    this.setState({
      ...this.state,
      onlineUsers: this.state.onlineUsers.filter(u => u.id !== userId),
    });

    // Log to SQL
    this.sql`
      INSERT INTO user_sessions (user_id, action, timestamp)
      VALUES (${userId}, 'disconnect', ${new Date().toISOString()})
    `;
  }

  async sendMessage(userId: string, content: string) {
    // Store in SQL for history
    this.sql`
      INSERT INTO messages (user_id, content, created_at)
      VALUES (${userId}, ${content}, ${new Date().toISOString()})
    `;

    // Broadcast via state for real-time delivery
    // (Or use WebSocket directly for messages)
  }
}
```

## Best Practices

### State Management

1. **Keep state minimal** - Only include data that needs real-time sync
2. **Use immutable updates** - Always spread existing state
3. **Batch updates** - Combine related changes into single setState call
4. **Validate on update** - Check state validity in onStateUpdate

### SQL Database

1. **Create indexes** - For frequently queried columns
2. **Use parameterized queries** - Template literals prevent SQL injection
3. **Limit result sets** - Always use LIMIT for potentially large queries
4. **Clean up old data** - Schedule periodic cleanup tasks
5. **Monitor size** - Stay well under 1GB limit

### Error Handling

```typescript
class SafeAgent extends Agent<Env, State> {
  async safeStateUpdate(updates: Partial<State>) {
    try {
      this.setState({
        ...this.state,
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("State update failed:", error);
      // Handle error (notify admin, retry, etc.)
    }
  }

  async safeQuery<T>(query: () => T[]): Promise<T[]> {
    try {
      return query();
    } catch (error) {
      console.error("SQL query failed:", error);
      return [];
    }
  }
}
```
