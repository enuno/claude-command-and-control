---
name: cloudflare-workers
version: 1.1.0
description: Cloudflare Workers serverless platform for edge computing with V8 runtime, Wrangler CLI, Miniflare local simulator, and C3 scaffolding
---

# Cloudflare Workers Skill

Comprehensive assistance with Cloudflare Workers development, including the Wrangler CLI, Miniflare local development, and C3 project scaffolding.

## When to Use This Skill

This skill should be triggered when:
- Creating new Cloudflare Workers projects
- Working with Wrangler CLI commands
- Developing Workers locally with Miniflare
- Deploying Workers to Cloudflare's edge network
- Configuring Workers KV, Durable Objects, R2, D1, or Queues
- Debugging and testing Workers
- Setting up CI/CD for Workers

## Quick Start

### Create a New Project (C3)

```bash
# Interactive project creation
npm create cloudflare@latest

# Create with specific framework
npm create cloudflare@latest my-app -- --framework=next
npm create cloudflare@latest my-api -- --framework=hono

# Accept defaults (quick start)
npm create cloudflare@latest my-worker -- -y

# TypeScript or JavaScript
npm create cloudflare@latest my-worker -- --lang=ts
npm create cloudflare@latest my-worker -- --lang=js
```

### Supported Frameworks

C3 supports: **Angular, Astro, Docusaurus, Gatsby, Hono, Next.js, Nuxt, Qwik, React, Remix, SolidStart, SvelteKit, Vue**

### C3 Options

| Option | Description |
|--------|-------------|
| `--framework` | Specify web framework (next, react, svelte, etc.) |
| `--type` | hello-world, hello-world-durable-object, scheduled, queues, openapi |
| `--category` | hello-world, web-framework, demo, remote-template |
| `--template` | Use external Git-hosted template |
| `--lang` | ts, js, or python |
| `--deploy` | Enable/disable automatic deployment (default: true) |
| `--git` | Initialize Git repository (default: true) |
| `-y` | Accept all defaults |

---

## Wrangler CLI Reference

### Authentication

```bash
# Login to Cloudflare (opens browser)
wrangler login

# Logout
wrangler logout

# Check current user
wrangler whoami
```

### Development

```bash
# Start local dev server with hot reload
wrangler dev

# Dev with specific config
wrangler dev --config wrangler.staging.toml

# Dev on specific port
wrangler dev --port 3000

# Local mode (no Cloudflare connection)
wrangler dev --local
```

### Deployment

```bash
# Deploy to Cloudflare
wrangler deploy

# Deploy to specific environment
wrangler deploy --env staging

# Deploy with dry run
wrangler deploy --dry-run

# Delete a Worker
wrangler delete

# Delete from specific environment
wrangler delete --env staging
```

### Version Management

```bash
# Upload version without deploying
wrangler versions upload

# Deploy version with gradual rollout
wrangler versions deploy

# List deployments
wrangler deployments list

# View deployment status
wrangler deployments status

# Rollback to previous version
wrangler rollback
```

### Monitoring & Logs

```bash
# Stream real-time logs
wrangler tail

# Filter by HTTP status
wrangler tail --status 500

# Filter by HTTP method
wrangler tail --method POST

# Filter by IP address
wrangler tail --ip-address 192.168.1.1

# Sample rate (0-1)
wrangler tail --sampling-rate 0.1
```

### KV Commands

```bash
# Create namespace
wrangler kv namespace create MY_KV

# List namespaces
wrangler kv namespace list

# Put a value
wrangler kv key put --binding=MY_KV "key" "value"

# Get a value
wrangler kv key get --binding=MY_KV "key"

# List keys
wrangler kv key list --binding=MY_KV

# Delete key
wrangler kv key delete --binding=MY_KV "key"

# Bulk operations (from JSON file)
wrangler kv bulk put --binding=MY_KV data.json
wrangler kv bulk delete --binding=MY_KV keys.json
```

### R2 Storage Commands

```bash
# Create bucket
wrangler r2 bucket create my-bucket

# List buckets
wrangler r2 bucket list

# Upload object
wrangler r2 object put my-bucket/path/file.txt --file=./local-file.txt

# Download object
wrangler r2 object get my-bucket/path/file.txt

# Delete object
wrangler r2 object delete my-bucket/path/file.txt

# Configure CORS
wrangler r2 bucket cors set my-bucket --rules='[{"origins":["*"]}]'

# Custom domain
wrangler r2 bucket domain add my-bucket my-cdn.example.com
```

### D1 Database Commands

```bash
# Create database
wrangler d1 create my-database

# List databases
wrangler d1 list

# Execute SQL
wrangler d1 execute my-database --command="SELECT * FROM users"

# Execute from file
wrangler d1 execute my-database --file=./schema.sql

# Create migration
wrangler d1 migrations create my-database migration-name

# Apply migrations
wrangler d1 migrations apply my-database

# Time travel (point-in-time recovery)
wrangler d1 time-travel info my-database
wrangler d1 time-travel restore my-database --timestamp=2024-01-01T00:00:00Z
```

### Secrets Management

```bash
# Add secret (interactive prompt)
wrangler secret put MY_SECRET

# Delete secret
wrangler secret delete MY_SECRET

# List secrets
wrangler secret list

# Bulk upload from file
wrangler secret bulk secrets.json
```

### Queues Commands

```bash
# Create queue
wrangler queues create my-queue

# List queues
wrangler queues list

# Add consumer
wrangler queues consumer add my-queue my-worker
```

### TypeScript Types

```bash
# Generate types from wrangler.toml bindings
wrangler types

# Include runtime types
wrangler types --include-runtime
```

### Global Options

| Option | Description |
|--------|-------------|
| `--config` | Specify custom config file |
| `--env` | Target specific environment |
| `--cwd` | Run from different directory |
| `--env-file` | Load environment variables from file |
| `--help` | Show command help |

---

## Configuration (wrangler.toml)

### Basic Configuration

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Enable workers.dev subdomain
workers_dev = true

# Account ID (or use CLOUDFLARE_ACCOUNT_ID env var)
account_id = "your-account-id"
```

### Routes & Domains

```toml
# Single route
route = { pattern = "example.com/*", zone_name = "example.com" }

# Multiple routes
routes = [
  { pattern = "example.com/api/*", zone_name = "example.com" },
  { pattern = "api.example.com/*", zone_name = "example.com" }
]

# Custom domain
routes = [
  { pattern = "api.example.com", custom_domain = true }
]
```

### KV Bindings

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "abc123..."

# Preview namespace (for wrangler dev)
[[kv_namespaces]]
binding = "MY_KV"
id = "abc123..."
preview_id = "def456..."
```

### R2 Buckets

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"
```

### D1 Databases

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "abc123..."
```

### Durable Objects

```toml
[durable_objects]
bindings = [
  { name = "MY_DO", class_name = "MyDurableObject" }
]

[[migrations]]
tag = "v1"
new_classes = ["MyDurableObject"]
```

### Queues

```toml
# Producer
[[queues.producers]]
binding = "MY_QUEUE"
queue = "my-queue"

# Consumer
[[queues.consumers]]
queue = "my-queue"
max_batch_size = 10
max_batch_timeout = 30
```

### Environment Variables

```toml
[vars]
API_URL = "https://api.example.com"
DEBUG = "false"
```

### Scheduled Triggers (Cron)

```toml
[triggers]
crons = [
  "0 * * * *",      # Every hour
  "0 0 * * *",      # Daily at midnight
  "*/5 * * * *"     # Every 5 minutes
]
```

### Development Settings

```toml
[dev]
ip = "localhost"
port = 8787
local_protocol = "http"
```

### Environment-Specific Configuration

```toml
# Staging environment
[env.staging]
name = "my-worker-staging"
vars = { DEBUG = "true" }

[env.staging.routes]
pattern = "staging.example.com/*"
zone_name = "example.com"

# Production environment
[env.production]
name = "my-worker-production"
vars = { DEBUG = "false" }
```

### Resource Limits

```toml
[limits]
cpu_ms = 50
```

### Observability

```toml
[observability]
enabled = true

[observability.logs]
enabled = true
invocation_logs = true
head_sampling_rate = 1
```

---

## Miniflare (Local Development)

Miniflare is a local simulator for Cloudflare Workers using the `workerd` runtime.

### Installation

```bash
npm install miniflare --save-dev
```

### Programmatic Usage

```typescript
import { Miniflare } from "miniflare";

const mf = new Miniflare({
  script: `
    export default {
      async fetch(request, env) {
        return new Response("Hello from Miniflare!");
      }
    }
  `,
  modules: true,
});

// Dispatch a request
const response = await mf.dispatchFetch("http://localhost/");
console.log(await response.text());

// Cleanup
await mf.dispose();
```

### With Bindings

```typescript
const mf = new Miniflare({
  scriptPath: "./src/index.ts",
  modules: true,
  kvNamespaces: ["MY_KV"],
  r2Buckets: ["MY_BUCKET"],
  d1Databases: ["DB"],
  durableObjects: {
    MY_DO: "MyDurableObject"
  },
  bindings: {
    API_KEY: "secret-key"
  }
});

// Access bindings
const bindings = await mf.getBindings();
await bindings.MY_KV.put("key", "value");
```

### Persistence Options

```typescript
const mf = new Miniflare({
  scriptPath: "./src/index.ts",
  modules: true,
  kvPersist: true,           // Persist to .mf/kv
  r2Persist: "./data/r2",    // Custom path
  d1Persist: true,
  cachePersist: true,
});
```

### Multiple Workers

```typescript
const mf = new Miniflare({
  workers: [
    {
      name: "api",
      scriptPath: "./api/index.ts",
      modules: true,
      routes: ["*/api/*"]
    },
    {
      name: "frontend",
      scriptPath: "./frontend/index.ts",
      modules: true,
      routes: ["*"]
    }
  ]
});
```

### Debugging with Inspector

```typescript
const mf = new Miniflare({
  scriptPath: "./src/index.ts",
  modules: true,
  inspectorPort: 9229,  // Connect Chrome DevTools
  verbose: true,        // Detailed logging
});
```

### Core API Methods

| Method | Description |
|--------|-------------|
| `dispatchFetch(url, init?)` | Send HTTP request to worker |
| `getBindings()` | Get all worker bindings |
| `getWorker(name?)` | Get specific worker instance |
| `getCaches()` | Get CacheStorage instance |
| `getD1Database(binding)` | Get D1 database instance |
| `dispose()` | Cleanup and shutdown |

---

## Common Patterns

### Basic Fetch Handler

```javascript
export default {
  async fetch(request, env, ctx) {
    return new Response('Hello World!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

### JSON API Response

```javascript
export default {
  async fetch(request, env, ctx) {
    const data = { message: 'Hello from Workers', timestamp: Date.now() };
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Router Pattern

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/api/users':
        return handleUsers(request, env);
      case '/api/posts':
        return handlePosts(request, env);
      default:
        return new Response('Not Found', { status: 404 });
    }
  }
};
```

### Request Method Handling

```javascript
export default {
  async fetch(request, env, ctx) {
    switch (request.method) {
      case 'GET':
        return handleGet(request, env);
      case 'POST':
        const body = await request.json();
        return handlePost(body, env);
      case 'PUT':
        return handlePut(request, env);
      case 'DELETE':
        return handleDelete(request, env);
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  }
};
```

### Workers KV Storage

```javascript
export default {
  async fetch(request, env, ctx) {
    // Write to KV
    await env.MY_KV.put('key', 'value', { expirationTtl: 3600 });

    // Read from KV
    const value = await env.MY_KV.get('key');

    // Read as JSON
    const data = await env.MY_KV.get('data', { type: 'json' });

    // Delete from KV
    await env.MY_KV.delete('key');

    // List keys
    const list = await env.MY_KV.list({ prefix: 'user:' });

    return new Response(value);
  }
};
```

### D1 Database

```javascript
export default {
  async fetch(request, env, ctx) {
    // Query
    const { results } = await env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(1).all();

    // Insert
    await env.DB.prepare(
      "INSERT INTO users (name, email) VALUES (?, ?)"
    ).bind("John", "john@example.com").run();

    // Batch
    const batch = await env.DB.batch([
      env.DB.prepare("INSERT INTO users (name) VALUES (?)").bind("Alice"),
      env.DB.prepare("INSERT INTO users (name) VALUES (?)").bind("Bob"),
    ]);

    return Response.json(results);
  }
};
```

### R2 Object Storage

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
      case 'PUT':
        await env.MY_BUCKET.put(key, request.body, {
          httpMetadata: {
            contentType: request.headers.get('Content-Type')
          }
        });
        return new Response('Uploaded');

      case 'GET':
        const object = await env.MY_BUCKET.get(key);
        if (!object) return new Response('Not Found', { status: 404 });
        return new Response(object.body, {
          headers: { 'Content-Type': object.httpMetadata.contentType }
        });

      case 'DELETE':
        await env.MY_BUCKET.delete(key);
        return new Response('Deleted');
    }
  }
};
```

### Durable Objects

```javascript
// Worker entry point
export default {
  async fetch(request, env, ctx) {
    const id = env.COUNTER.idFromName('global');
    const stub = env.COUNTER.get(id);
    return stub.fetch(request);
  }
};

// Durable Object class
export class Counter {
  constructor(state, env) {
    this.state = state;
  }

  async fetch(request) {
    let count = (await this.state.storage.get('count')) || 0;

    if (request.method === 'POST') {
      count++;
      await this.state.storage.put('count', count);
    }

    return Response.json({ count });
  }
}
```

### Queues Producer/Consumer

```javascript
// Producer
export default {
  async fetch(request, env, ctx) {
    await env.MY_QUEUE.send({
      type: 'email',
      to: 'user@example.com',
      subject: 'Hello'
    });
    return new Response('Queued');
  }
};

// Consumer
export default {
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      console.log('Processing:', message.body);
      // Process message
      message.ack();
    }
  }
};
```

### CORS Headers

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const response = await handleRequest(request, env);
    return new Response(response.body, {
      ...response,
      headers: { ...response.headers, ...corsHeaders }
    });
  }
};
```

### Caching with Cache API

```javascript
export default {
  async fetch(request, env, ctx) {
    const cache = caches.default;

    // Try cache first
    let response = await cache.match(request);

    if (!response) {
      // Cache miss - fetch from origin
      response = await fetch(request);

      // Cache for 1 hour
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'max-age=3600');

      ctx.waitUntil(cache.put(request, response.clone()));
    }

    return response;
  }
};
```

### Scheduled Events (Cron)

```javascript
export default {
  async scheduled(event, env, ctx) {
    console.log('Cron executed at:', new Date(event.scheduledTime));

    // Perform background task
    await env.MY_KV.put('last_run', event.scheduledTime.toString());

    // Make external API call
    await fetch('https://api.example.com/webhook', {
      method: 'POST',
      body: JSON.stringify({ timestamp: event.scheduledTime })
    });
  }
};
```

### Error Handling

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const data = await env.MY_KV.get('key');

      if (!data) {
        return Response.json(
          { error: 'Not Found' },
          { status: 404 }
        );
      }

      return Response.json({ data });

    } catch (error) {
      console.error('Worker error:', error);

      return Response.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
};
```

### Environment Variables & Secrets

```javascript
export default {
  async fetch(request, env, ctx) {
    // Access variables from wrangler.toml [vars]
    const apiUrl = env.API_URL;

    // Access secrets (wrangler secret put)
    const apiKey = env.API_KEY;

    const response = await fetch(`${apiUrl}/data`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response;
  }
};
```

---

## TypeScript Support

### Type Generation

```bash
# Generate types from wrangler.toml
wrangler types

# Output to custom file
wrangler types --outdir ./types
```

### worker-configuration.d.ts

```typescript
// Auto-generated by wrangler types
interface Env {
  MY_KV: KVNamespace;
  MY_BUCKET: R2Bucket;
  DB: D1Database;
  MY_DO: DurableObjectNamespace;
  API_KEY: string;
}
```

### Typed Handler

```typescript
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const value = await env.MY_KV.get('key');
    return new Response(value);
  }
};
```

---

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **configuration.md** - Detailed wrangler.toml reference
- **getting_started.md** - Setup and first Worker guide
- **platform.md** - Platform capabilities and limits
- **runtime_apis.md** - Web APIs and Workers-specific APIs

Use `view` to read specific reference files when detailed information is needed.

---

## Resources

- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)
- [Workers SDK GitHub](https://github.com/cloudflare/workers-sdk)
- [Miniflare](https://miniflare.dev/)

---

## Notes

- Enhanced from workers-sdk repository documentation
- Includes Wrangler CLI, Miniflare local development, and C3 scaffolding
- Code examples use ES modules format (recommended)
- wrangler.toml examples can also use wrangler.jsonc format
