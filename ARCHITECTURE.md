# ARCHITECTURE.md: System Design & Technical Architecture
**braiins-os-mcp-server** | December 2025

---

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Technology Stack Rationale](#technology-stack-rationale)
4. [Design Patterns](#design-patterns)
5. [API Design](#api-design)
6. [Data Flow Architecture](#data-flow-architecture)
7. [Deployment Patterns](#deployment-patterns)
8. [Security Architecture](#security-architecture)
9. [Scalability & Performance](#scalability--performance)

---

## System Overview

### Purpose

**braiins-os-mcp-server** is a bridge between AI agents (Claude, Copilot, etc.) and Braiins OS mining firmware. It implements the Model Context Protocol (MCP) to provide Claude with standardized access to mining operations.

### Core Value Proposition

```
┌─────────────────────────────────────┐
│ AI Agents (Claude, Copilot, etc.)   │
│ "Monitor miner status", "Update FW" │
└──────────────┬──────────────────────┘
               │
      ┌────────▼──────────┐
      │ MCP Server        │
      │ (This Project)    │
      └────────┬──────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────────┐  ┌────────▼────┐
│ gRPC Client│  │ REST Client  │
│ (Binary)   │  │ (HTTP)       │
└───┬────────┘  └────────┬─────┘
    │                    │
    │  ┌─────────────────┘
    │  │
┌───▼──▼──────────────────────────┐
│ Braiins OS+ Miner Devices       │
│ (ASIC Hardware running firmware)│
└────────────────────────────────┘
```

### Problem Solved

**Without MCP Server:**
- Engineers manually SSH into miners
- No structured API between AI and miners
- No caching layer (slow, many requests)
- No logging/auditing of operations
- Multi-tenant deployments impossible

**With MCP Server:**
- Claude can safely interact with miners
- Standardized API (REST + gRPC)
- Caching reduces load on miners
- Full audit trail of all operations
- Supports local, dedicated, shared, and hybrid deployments

---

## High-Level Architecture

### System Components

```
┌──────────────────────────────────────────────────────────┐
│                    AI Agents (External)                  │
│            Claude (Desktop, Web, API)                    │
└──────────────────────────────────────────────────────────┘
                           │
                  ┌────────▼─────────┐
                  │  Transport Layer │
                  ├──────────────────┤
                  │ • STDIO (local)  │
                  │ • HTTP+SSE       │
                  │ • WebSocket      │
                  └────────┬─────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │     MCP Server (Node.js)            │
        ├──────────────────────────────────────┤
        │ ┌─ MCP Layer                        │
        │ │  • Resources (miner configs)      │
        │ │  • Tools (control operations)     │
        │ │  • Prompts (Claude guidance)      │
        │ │                                   │
        │ ├─ API Handlers                     │
        │ │  • REST (Express)                 │
        │ │  • gRPC (Protocol Buffers)        │
        │ │  • Authentication (OAuth, JWT)    │
        │ │                                   │
        │ ├─ Business Logic                   │
        │ │  • Miner control                  │
        │ │  • Firmware management            │
        │ │  • Fleet aggregation              │
        │ │                                   │
        │ ├─ Cache Layer                      │
        │ │  • Redis (session, rate limit)    │
        │ │  • Miner status caching           │
        │ │                                   │
        │ └─ Infrastructure                   │
        │    • Logging (Winston)              │
        │    • Error handling                 │
        │    • Validators (Zod)               │
        └──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼──────┐  ┌────────▼────┐  ┌────────▼────┐
    │Redis     │  │gRPC Clients │  │HTTP Clients │
    │(Cache)   │  │(Miners)     │  │(Optional)   │
    └──────────┘  └─────────────┘  └─────────────┘
                           │
                  ┌────────▼─────────┐
                  │ Braiins Miners   │
                  │ (Hardware +      │
                  │  Firmware API)   │
                  └──────────────────┘
```

### Layer Responsibilities

| Layer | Technology | Responsibility |
|-------|-----------|-----------------|
| **Transport** | STDIO, HTTP, SSE | Connect agents to MCP server |
| **MCP** | @modelcontextprotocol/sdk | Expose resources/tools/prompts |
| **API** | Express, gRPC | Handle requests, validate input |
| **Business Logic** | TypeScript classes | Miner control, firmware updates |
| **Cache** | Redis | Reduce miner load, speed up responses |
| **Data** | Zod validators | Type-safe data structures |
| **Infrastructure** | Winston, Pino | Logging, monitoring, error handling |

---

## Technology Stack Rationale

### Language & Runtime: Node.js + TypeScript

**Why Node.js?**
- ✅ Async/await native (crucial for I/O-bound operations)
- ✅ npm ecosystem (gRPC, MCP SDK, Redis, testing)
- ✅ Fast startup (important for STDIO transport)
- ✅ Lightweight memory footprint (local deployments)
- ✅ Single-threaded event loop matches MCP model

**Why TypeScript?**
- ✅ Type safety (catch bugs at compile time)
- ✅ Excellent IDE support (autocomplete, refactoring)
- ✅ Self-documenting code (types = documentation)
- ✅ Confidence for refactoring

### Protocol: gRPC (Binary) + REST (HTTP)

**gRPC for Miner Communication:**
```
Miners speak gRPC (efficient binary protocol)
├─ Reason 1: Braiins API uses gRPC
├─ Reason 2: Binary format < text (bandwidth)
├─ Reason 3: Streaming support for real-time data
└─ Reason 4: Better for resource-constrained ASIC devices

Implementation: Node gRPC client wrapping proto definitions
```

**REST for Client Communication:**
```
Agents access MCP via REST (when not using STDIO)
├─ Reason 1: HTTP more universal than gRPC
├─ Reason 2: Easy to debug (browser dev tools)
├─ Reason 3: Proxy-friendly (load balancers, cloud gateways)
└─ Reason 4: Better for web clients

Implementation: Express.js with OpenAPI documentation
```

### Caching: Redis

**Why Redis?**
- ✅ In-memory (fast - <1ms response)
- ✅ Pub/Sub (broadcast miner status changes)
- ✅ Session management (store auth tokens)
- ✅ Rate limiting (sliding window counters)
- ✅ Distributed (works in multi-instance deployments)

**Not suitable for:**
- ❌ Long-term data storage (use database instead)
- ❌ Persistent configuration (use database instead)
- ❌ Audit logs (use structured logging instead)

### Containerization: Docker

**Why Docker?**
- ✅ Isolated environment (prevents version conflicts)
- ✅ Multi-stage builds (small final image)
- ✅ Cloud-native (Kubernetes, ECS support)
- ✅ Deployment consistency (same image everywhere)

**Deployment options:**
```
Local:             STDIO transport + no container
Dedicated:         Docker container per user
Shared:            Single container, multi-tenant isolation
Hybrid:            Local STDIO + cloud HTTP gateway
```

---

## Design Patterns

### 1. Repository Pattern (Data Access)

```typescript
// src/api/repositories/miner.repository.ts
interface IMinerRepository {
  findById(id: string): Promise<Miner>;
  findAll(filters: MinerFilter): Promise<Miner[]>;
  update(id: string, changes: Partial<Miner>): Promise<Miner>;
}

// Implementation with caching
class MinerRepository implements IMinerRepository {
  constructor(private grpc: GrpcClient, private cache: RedisCache) {}

  async findById(id: string): Promise<Miner> {
    // Try cache first
    const cached = await this.cache.get<Miner>(`miner:${id}`);
    if (cached) return cached;

    // Fetch from gRPC
    const miner = await this.grpc.getMiner(id);

    // Store in cache
    await this.cache.set(`miner:${id}`, miner, 3600);

    return miner;
  }
}
```

**Benefits:**
- Decouples business logic from data access
- Easy to mock for testing
- Can swap implementations (memory, database, gRPC)

### 2. Dependency Injection (Loose Coupling)

```typescript
// Constructor injection
class MinerController {
  constructor(
    private repo: IMinerRepository,
    private cache: ICacheService,
    private logger: ILogger
  ) {}

  async getMiner(id: string): Promise<Miner> {
    this.logger.debug(`Getting miner ${id}`);
    return this.repo.findById(id);
  }
}

// Testable without real dependencies
const mockRepo = new MockMinerRepository();
const mockCache = new MockCache();
const mockLogger = new MockLogger();

const controller = new MinerController(mockRepo, mockCache, mockLogger);
```

**Benefits:**
- Easy to test (inject mocks)
- Easy to configure (different implementations per environment)
- Clear dependencies (visible in constructor)

### 3. Command Pattern (Complex Operations)

```typescript
// Encapsulate firmware update as a command
interface ICommand {
  execute(): Promise<void>;
  rollback(): Promise<void>;
}

class UpdateFirmwareCommand implements ICommand {
  constructor(
    private miner: Miner,
    private targetVersion: string,
    private grpc: GrpcClient
  ) {}

  async execute(): Promise<void> {
    console.log(`Starting firmware update: ${this.miner.id} → ${this.targetVersion}`);
    await this.grpc.uploadFirmware(this.miner.id, this.targetVersion);
    await this.grpc.reboot(this.miner.id);
  }

  async rollback(): Promise<void> {
    console.log(`Rolling back firmware for ${this.miner.id}`);
    await this.grpc.revertFirmware(this.miner.id);
  }
}

// Execute with error handling
const cmd = new UpdateFirmwareCommand(miner, '2.0.1', grpc);
try {
  await cmd.execute();
} catch (error) {
  console.error('Update failed, rolling back');
  await cmd.rollback();
  throw error;
}
```

**Benefits:**
- Encapsulates multi-step operations
- Easy to undo (rollback)
- Can queue commands for later execution

### 4. Observer Pattern (Real-Time Updates)

```typescript
// Miners publish status changes
class MinerStatusPublisher {
  constructor(private pubsub: RedisPubSub) {}

  publishStatusChange(miner: Miner): void {
    this.pubsub.publish('miner:status:changed', {
      minerId: miner.id,
      status: miner.status,
      timestamp: Date.now(),
    });
  }
}

// Claude agents subscribe to updates
class MinerStatusSubscriber {
  constructor(private pubsub: RedisPubSub) {}

  subscribeToUpdates(callback: (update: StatusUpdate) => void): void {
    this.pubsub.subscribe('miner:status:changed', callback);
  }
}
```

**Benefits:**
- Decouples publishers from subscribers
- Real-time updates without polling
- Easy to add multiple subscribers

### 5. Factory Pattern (Object Creation)

```typescript
// Create appropriate gRPC client based on environment
class GrpcClientFactory {
  static create(config: GrpcConfig): GrpcClient {
    if (process.env.NODE_ENV === 'test') {
      return new MockGrpcClient();
    }

    return new RealGrpcClient({
      host: config.minerHost,
      port: config.minerPort,
      tls: config.useTls,
    });
  }
}

// Usage
const grpc = GrpcClientFactory.create(config);
```

**Benefits:**
- Centralized object creation
- Easy to swap implementations
- Configuration-driven behavior

---

## API Design

### RESTful Conventions

**Endpoint Structure:**
```
GET    /api/v1/miners              # List all miners
GET    /api/v1/miners/:id          # Get single miner
POST   /api/v1/miners              # Create miner entry
PUT    /api/v1/miners/:id          # Update miner
DELETE /api/v1/miners/:id          # Remove miner

POST   /api/v1/miners/:id/reboot   # Custom action
POST   /api/v1/miners/:id/firmware # Firmware operations

GET    /api/v1/fleets              # List fleets
GET    /api/v1/fleets/:id/status   # Fleet aggregate status

POST   /api/v1/tasks               # Start long-running task
GET    /api/v1/tasks/:id           # Check task progress
```

**Response Format:**
```json
{
  "data": {
    "id": "miner-123",
    "status": "online",
    "hashrate": 14000000000
  },
  "meta": {
    "timestamp": "2025-12-14T08:41:00Z",
    "requestId": "req-abc-123"
  }
}
```

**Error Format:**
```json
{
  "error": {
    "code": "GRPC_CONNECTION_FAILED",
    "message": "Cannot connect to miner at 192.168.1.100:50051",
    "statusCode": 503,
    "details": {
      "minerHost": "192.168.1.100",
      "minerPort": 50051,
      "retryable": true
    }
  }
}
```

### MCP Resource Definitions

```typescript
// What Claude can read (Resources)
const minerResource: MCPResource = {
  uri: 'miner://[minerId]',
  name: `Miner [minerId]`,
  contents: [
    {
      mimeType: 'application/json',
      text: JSON.stringify(minerData),
    },
  ],
};

// What Claude can do (Tools)
const tools: MCPTool[] = [
  {
    name: 'reboot_miner',
    description: 'Gracefully reboot a miner',
    inputSchema: {
      type: 'object',
      properties: {
        minerId: { type: 'string' },
        delaySeconds: { type: 'number' },
      },
      required: ['minerId'],
    },
  },
  // ... more tools
];

// Claude guidance (Prompts)
const prompts: MCPPrompt[] = [
  {
    name: 'mining-operations-assistant',
    description: 'Assist with mining fleet operations',
    arguments: [
      {
        name: 'operation',
        description: 'What operation to help with',
      },
    ],
  },
];
```

---

## Data Flow Architecture

### Request Flow (Happy Path)

```
┌─ AI Agent (Claude)
│  Request: "Get miner status for miner-123"
│
├─ MCP Server receives request
│  1. Validate input (UUID format)
│  2. Check cache for miner:miner-123
│
├─ Cache hit? → Return cached data (< 1ms)
│
├─ Cache miss → Call Repository
│  1. Call gRPC client
│  2. Client connects to miner
│  3. Miner responds with status
│  4. Parse response
│
├─ Store in cache (TTL: 60 seconds)
│
└─ Return to Claude
   Status: online, Hashrate: 14GH/s, Temp: 52°C
```

### Complex Operation Flow (Firmware Update)

```
┌─ Claude: "Update firmware on miners 1,2,3 to v2.0.1"
│
├─ MCP Server: Parse request
│  1. Validate miner IDs exist
│  2. Validate version 2.0.1 is available
│  3. Validate current firmware compatibility
│
├─ Create background job
│  1. Store job metadata in Redis
│  2. Publish "firmware-update-started" event
│  3. Return job ID to Claude
│
├─ Job execution (async):
│  For each miner:
│    1. Check gRPC connection
│    2. Download firmware to miner
│    3. Verify checksum
│    4. Trigger update
│    5. Poll for completion (with timeout)
│    6. Publish status update: "firmware-update-progress"
│
├─ Invalidate cache for updated miners
│  Delete: miner:1, miner:2, miner:3
│
└─ Publish "firmware-update-completed" event
   Result: 3 miners updated, 0 failed
```

### Error Recovery Flow

```
┌─ Operation fails (e.g., gRPC timeout)
│
├─ Error caught in try/catch
│
├─ Classify error
│  - RETRYABLE (timeout, connection loss)
│  - NOT_RETRYABLE (invalid input, not found)
│  - FATAL (authentication failed)
│
├─ If RETRYABLE:
│  1. Exponential backoff (1s → 2s → 4s)
│  2. Max 3 attempts
│  3. If still fails, queue for manual retry
│
├─ If NOT_RETRYABLE:
│  1. Log error with context
│  2. Return meaningful error to Claude
│  3. Suggest remediation
│
├─ If FATAL:
│  1. Alert operations team
│  2. Gracefully degrade (return cached data)
│  3. Disable affected miner from API
│
└─ All errors: write to audit log
   { timestamp, error, userId, minerId, action }
```

---

## Deployment Patterns

### Pattern 1: Local (STDIO Transport)

```
Technician's Laptop
├─ Claude Desktop ← STDIO → MCP Server
├─ gRPC client connects to local miners
└─ Redis (optional, or in-memory cache)

Pros:
- No network required
- Simple, fast
- Full control on laptop

Cons:
- Only works on local network
- Data lost if laptop crashes
```

### Pattern 2: Managed-Dedicated (HTTP + SSE)

```
Cloud (AWS/GCP/Azure)
├─ Docker container per user
├─ HTTP API + Server-Sent Events
├─ Redis instance per user
├─ Auto-scales based on load

Cloud → Local Network
├─ VPN tunnel to miner subnet
└─ gRPC through tunnel

Pros:
- Isolated per user
- Remote access
- Scalable

Cons:
- More infrastructure
- Latency through VPN
- Cost for containers
```

### Pattern 3: Managed-Shared (Multi-Tenant)

```
Production Cloud
├─ Single MCP Server instance
├─ Tenant isolation via JWT claims
├─ Shared Redis with namespaced keys
├─ Central gRPC proxy

┌─ User A ──→ MCP Server
├─ User B ──→ (same instance)
└─ User C ──→ (same instance)

MCP Server enforces:
- Tenant field in JWT
- Queries filtered by tenant
- Cache keys namespaced

Pros:
- Most efficient (single instance)
- Easy to manage
- Lowest cost

Cons:
- Complex isolation
- Single point of failure
- Security critical
```

### Pattern 4: Hybrid (Local + Cloud)

```
Technician's Laptop          Cloud Gateway
├─ MCP STDIO Server ←→ gRPC Proxy ←→ Fleet Dashboard
└─ Direct gRPC              │
   to local miners          │
                 ← gRPC → Shared Fleet
                              │
                         Cloud Analytics

Pros:
- On-site control + cloud monitoring
- Redundancy
- Best of both worlds

Cons:
- Most complex
- Sync issues possible
```

---

## Security Architecture

### Authentication Layers

```
┌─ Transport Layer
│  STDIO: OS-level access control
│  HTTP: TLS 1.3, HTTPS only
│
├─ Protocol Layer
│  Token: JWT with exp + sub claims
│  Scopes: miner:read, miner:write, firmware:write
│
└─ Resource Layer
   Tenant: Verified from JWT sub claim
   RBAC: Role-based access control
```

### Authorization Rules

```typescript
// Example: Only operators can update firmware
@Authorized('operator', 'admin')
async updateFirmware(minerId: string): Promise<void> {
  const tenant = this.req.user.tenant;
  const miner = await this.repo.getMiner(minerId);

  // Verify miner belongs to user's tenant
  if (miner.tenantId !== tenant) {
    throw new ForbiddenError('Cannot access other tenant data');
  }

  // Proceed with update
}
```

### Encryption Standards

| Data | At Rest | In Transit | Key Management |
|------|---------|-----------|-----------------|
| **Miner auth** | AES-256 | TLS 1.3 | Vault (rotate 90d) |
| **Pool creds** | AES-256 | TLS 1.3 | Vault (rotate 30d) |
| **Firmware bin** | - | TLS + signed | Braiins signature |
| **Logs** | Encrypted | HTTPS | AWS KMS |
| **User tokens** | JWT signed | HTTPS only | RS256 key pair |

### Audit Logging

```typescript
// Every operation logged
interface AuditLog {
  timestamp: ISO8601;
  userId: UUID;
  tenantId: UUID;
  action: 'READ' | 'WRITE' | 'DELETE' | 'CONTROL';
  resource: string;
  changes: {
    before?: any;
    after?: any;
  };
  status: 'SUCCESS' | 'FAILURE';
  error?: string;
  ipAddress: string;
}

// Retention: 1 year minimum
// Immutable: Cannot be deleted or modified
// Secured: Encrypted at rest, audit trail monitored
```

---

## Scalability & Performance

### Caching Strategy

```
┌─ Request
│
├─ Cache (Redis) - 1ms - 99% hit rate
│  Key: miner:123, TTL: 60s
│
├─ If miss → API Call - 200ms
│  gRPC to miner
│
└─ Store result, return
```

**Cache Invalidation:**
```typescript
// On successful write operation
await operation.updateMiner(id, changes);

// Invalidate related caches
await cache.delete(`miner:${id}`);           // Specific miner
await cache.delete(`fleet:${fleetId}`);      // Fleet aggregate
await cache.delete(`miner:status:all`);      // Status list
```

### Rate Limiting

```typescript
// Per user, per minute
const limiter = new RateLimiter(redis, {
  points: 1000,        // 1000 requests
  duration: 60,        // per minute
  blockDuration: 60,   // block for 1 minute if exceeded
});

// Usage in middleware
app.use(async (req, res, next) => {
  const userId = req.user.id;
  try {
    await limiter.consume(userId);
    next();
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
});
```

### Database Optimization (When Needed)

```sql
-- Index on frequently queried fields
CREATE INDEX idx_miner_tenant ON miners(tenant_id);
CREATE INDEX idx_miner_status ON miners(status);
CREATE INDEX idx_task_user ON tasks(user_id, created_at);

-- Partitioning for audit logs (time-based)
CREATE TABLE audit_logs_2025_q4 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
```

### Monitoring & Observability

```typescript
// Prometheus metrics
const minerConnectionTime = new Histogram({
  name: 'grpc_connection_duration_ms',
  help: 'Time to establish gRPC connection',
  buckets: [10, 50, 100, 500, 1000],
});

const cacheHitRate = new Counter({
  name: 'cache_hits_total',
  help: 'Cache hits',
  labels: ['resource_type'],
});

// Log structure
logger.info('miner.status_update', {
  minerId: 'miner-123',
  status: 'online',
  latencyMs: 145,
  cacheHit: false,
  timestamp: new Date().toISOString(),
});
```

---

## Key Architectural Decisions

### Decision 1: Why gRPC for Miner Communication?

**Options Considered:**
1. **gRPC (chosen)** - Binary, streaming, efficient
2. **REST** - HTTP-based, easier debugging
3. **WebSocket** - Real-time, but less efficient
4. **Custom** - Full control, but complex

**Decision:** gRPC because:
- Braiins API uses gRPC natively
- Binary format efficient (resource-constrained devices)
- Streaming support (real-time hashrate, temperature)
- Already standardized in mining industry

### Decision 2: Redis Instead of In-Memory Cache

**Trade-off:**
- ✅ Survives process restarts
- ✅ Shared across multiple instances
- ✅ Pub/Sub for event broadcasting
- ❌ Extra dependency, potential bottleneck

**Monitoring:** Alert if Redis latency > 5ms

### Decision 3: MCP Over Custom Protocol

**Why Model Context Protocol?**
- ✅ Standardized (Claude, Copilot support)
- ✅ Resource abstraction (what Claude reads)
- ✅ Tool definitions (what Claude can do)
- ✅ Future-proof (other agents can use it)

---

## References & Standards

- [Braiins OS+ API Documentation](https://deepwiki.com/braiins/bos-plus-api)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [gRPC Best Practices](https://grpc.io/docs/guides/performance-best-practices/)
- [OWASP Security Guidelines](https://owasp.org/www-project-secure-coding-practices/)

---

**Architecture maintained by: Architecture Team**  
**Last reviewed: December 2025**  
**Next review: Q1 2026**
