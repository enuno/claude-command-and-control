---
name: cloudflare-workers
description: Cloudflare Workers serverless platform for edge computing with V8 runtime
---

# Cloudflare-Workers Skill

Comprehensive assistance with cloudflare-workers development, generated from official documentation.

## When to Use This Skill

This skill should be triggered when:
- Working with cloudflare-workers
- Asking about cloudflare-workers features or APIs
- Implementing cloudflare-workers solutions
- Debugging cloudflare-workers code
- Learning cloudflare-workers best practices

## Quick Reference

### Common Patterns

#### Basic Fetch Handler
```javascript
export default {
  async fetch(request, env, ctx) {
    return new Response('Hello World!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

#### JSON API Response
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

#### Router Pattern
```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/users') {
      return handleUsers(request, env);
    } else if (url.pathname === '/api/posts') {
      return handlePosts(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};
```

#### Workers KV Storage
```javascript
export default {
  async fetch(request, env, ctx) {
    // Write to KV
    await env.MY_KV.put('key', 'value', { expirationTtl: 3600 });

    // Read from KV
    const value = await env.MY_KV.get('key');

    // Delete from KV
    await env.MY_KV.delete('key');

    // List keys
    const list = await env.MY_KV.list({ prefix: 'user:' });

    return new Response(value);
  }
};
```

#### CORS Headers
```javascript
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

export default {
  async fetch(request, env, ctx) {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    return new Response('OK', { headers: corsHeaders() });
  }
};
```

#### Durable Objects
```javascript
// Worker binding
export default {
  async fetch(request, env, ctx) {
    const id = env.MY_DURABLE_OBJECT.idFromName('my-object');
    const stub = env.MY_DURABLE_OBJECT.get(id);
    return stub.fetch(request);
  }
};

// Durable Object class
export class MyDurableObject {
  constructor(state, env) {
    this.state = state;
  }

  async fetch(request) {
    // Durable storage operations
    await this.state.storage.put('counter', 1);
    const value = await this.state.storage.get('counter');

    return new Response(`Counter: ${value}`);
  }
}
```

#### Caching with Cache API
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

#### Environment Variables & Secrets
```javascript
export default {
  async fetch(request, env, ctx) {
    // Access environment variables
    const apiKey = env.API_KEY;
    const dbUrl = env.DATABASE_URL;

    // Use secrets in API calls
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response;
  }
};
```

#### Scheduled Events (Cron Triggers)
```javascript
export default {
  async scheduled(event, env, ctx) {
    // Runs on schedule (e.g., every hour)
    console.log('Cron job executed at:', new Date(event.scheduledTime));

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

#### Error Handling
```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const data = await env.MY_KV.get('key');

      if (!data) {
        return new Response('Not Found', { status: 404 });
      }

      return new Response(data);

    } catch (error) {
      console.error('Worker error:', error);

      return new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};
```

#### Request Method Handling
```javascript
export default {
  async fetch(request, env, ctx) {
    switch (request.method) {
      case 'GET':
        return handleGet(request, env);
      case 'POST':
        return handlePost(request, env);
      case 'PUT':
        return handlePut(request, env);
      case 'DELETE':
        return handleDelete(request, env);
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  }
};

async function handlePost(request, env) {
  const body = await request.json();
  // Process POST data
  return new Response(JSON.stringify({ success: true }));
}
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **configuration.md** - Configuration documentation
- **getting_started.md** - Getting Started documentation
- **other.md** - Other documentation
- **platform.md** - Platform documentation
- **runtime_apis.md** - Runtime Apis documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
The quick reference section above contains common patterns extracted from the official docs.

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed explanations
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, boilerplate, or example projects here.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from common usage examples in the docs

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
