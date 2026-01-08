# x402 Bazaar Discovery Layer

## Overview

The Bazaar is a machine-readable catalog enabling developers and AI agents to discover and integrate with x402-compatible API endpoints. It functions as a "search index for payable APIs," facilitating autonomous service discovery and consumption without pre-baked integrations.

## Key Benefits

### For Buyers
- Programmatically discover available x402-enabled services
- Visibility into capabilities, pricing, and schemas
- Filter services by category, price, or network

### For Sellers
- Automatic global visibility for x402-enabled services
- Reach developers and AI agents without marketing
- API metadata enhances discoverability

### For AI Agents
- Dynamic service discovery
- Query → Discover → Pay → Use workflow
- No hardcoded integrations needed

## API Reference

### Discovery Endpoint

**URL:** `https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources`

**Method:** GET

**Response:**
```json
{
  "resources": [
    {
      "url": "https://api.weather.example/forecast",
      "description": "Real-time weather forecast API",
      "category": "weather",
      "tags": ["forecast", "temperature", "humidity"],
      "pricing": {
        "price": "$0.001",
        "asset": "USDC",
        "network": "eip155:8453"
      },
      "schema": {
        "input": {
          "type": "object",
          "properties": {
            "location": { "type": "string" }
          }
        },
        "output": {
          "type": "object",
          "properties": {
            "temperature": { "type": "number" },
            "conditions": { "type": "string" }
          }
        }
      }
    }
  ]
}
```

### Response Schema Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | Full endpoint URL |
| `description` | string | Human-readable description |
| `category` | string | Service category |
| `tags` | array | Search tags |
| `pricing.price` | string | USD price per request |
| `pricing.asset` | string | Payment asset (e.g., USDC) |
| `pricing.network` | string | CAIP-2 network identifier |
| `schema.input` | object | JSON Schema for input parameters |
| `schema.output` | object | JSON Schema for response |
| `timeout` | number | Request timeout (seconds) |
| `recipient` | string | Payment recipient wallet |

## Registering Your Service

### Automatic Registration

APIs using the CDP facilitator are automatically listed when enabling the bazaar extension:

```typescript
app.use(paymentMiddleware(server, {
  facilitatorUrl: "https://api.cdp.coinbase.com/platform/v2/x402",
  routes: {
    "/api/data": {
      price: "$0.01",
      network: "eip155:8453",
      recipient: "0xYourWallet",
      extensions: {
        bazaar: {
          discoverable: true,
          category: "data",
          tags: ["analytics", "metrics"],
          description: "Real-time analytics data API"
        }
      }
    }
  }
}));
```

### Required Fields

| Field | Required | Description |
|-------|----------|-------------|
| `discoverable` | Yes | Must be `true` to list |
| `category` | Recommended | Helps with filtering |
| `tags` | Recommended | Improves searchability |
| `description` | Recommended | Explains service purpose |

### Schema Enhancement

Adding input/output schemas improves AI agent accuracy:

```typescript
extensions: {
  bazaar: {
    discoverable: true,
    category: "weather",
    tags: ["forecast", "temperature"],
    description: "Weather forecast by location",
    schema: {
      input: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name or coordinates"
          },
          units: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            default: "fahrenheit"
          }
        },
        required: ["location"]
      },
      output: {
        type: "object",
        properties: {
          temperature: { type: "number" },
          conditions: { type: "string" },
          humidity: { type: "number" },
          forecast: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                high: { type: "number" },
                low: { type: "number" }
              }
            }
          }
        }
      }
    }
  }
}
```

## Querying the Bazaar

### Basic Discovery

```typescript
async function discoverServices() {
  const response = await fetch(
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
  );
  return await response.json();
}
```

### Filter by Category

```typescript
async function findWeatherAPIs() {
  const services = await discoverServices();
  return services.resources.filter(s => s.category === "weather");
}
```

### Filter by Price

```typescript
async function findCheapAPIs(maxPrice: number) {
  const services = await discoverServices();
  return services.resources.filter(s => {
    const price = parseFloat(s.pricing.price.replace("$", ""));
    return price <= maxPrice;
  });
}
```

### Filter by Network

```typescript
async function findBaseAPIs() {
  const services = await discoverServices();
  return services.resources.filter(
    s => s.pricing.network === "eip155:8453"
  );
}
```

## AI Agent Integration

### Discovery Flow

```typescript
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";

async function agentWorkflow(query: string) {
  // 1. Discover relevant services
  const services = await discoverServices();

  // 2. Find service matching query
  const relevant = services.resources.find(s =>
    s.description.toLowerCase().includes(query.toLowerCase()) ||
    s.tags.some(t => t.includes(query.toLowerCase()))
  );

  if (!relevant) {
    return { error: "No matching service found" };
  }

  // 3. Make paid request
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const response = await fetchWithPayment(relevant.url);
  return await response.json();
}
```

### LLM Function Calling

```typescript
// Provide discovered services as available functions
const tools = services.resources.map(service => ({
  type: "function",
  function: {
    name: service.url.split("/").pop(),
    description: `${service.description} (Cost: ${service.pricing.price})`,
    parameters: service.schema?.input || {
      type: "object",
      properties: {}
    }
  }
}));
```

## Supported Networks

| Network | Identifier | Status |
|---------|------------|--------|
| Base Mainnet | `eip155:8453` | Active |
| Base Sepolia | `eip155:84532` | Active |
| Solana Mainnet | Coming soon | Planned |

## Categories

Common service categories:

| Category | Description |
|----------|-------------|
| `weather` | Weather and climate data |
| `data` | General data APIs |
| `ai` | AI/ML inference services |
| `finance` | Financial data and trading |
| `search` | Search and discovery |
| `media` | Image, video, audio processing |
| `analytics` | Analytics and metrics |
| `geo` | Geolocation services |

## Best Practices

### For Sellers

1. **Clear descriptions**: Write descriptions that explain what your API does
2. **Relevant tags**: Use tags that buyers will search for
3. **Complete schemas**: Define input/output schemas for AI agent compatibility
4. **Accurate pricing**: Set competitive prices for your market
5. **Reliable uptime**: Maintain high availability for listed services

### For Buyers

1. **Filter wisely**: Use category and price filters to narrow results
2. **Check schemas**: Verify input/output schemas match your needs
3. **Test on testnet**: Try services on testnet before mainnet
4. **Cache discovery**: Don't query Bazaar on every request
5. **Handle failures**: Implement fallback for unavailable services

## Development Status

The Bazaar is in early development. Features and APIs may evolve based on feedback.

**Current limitations:**
- Limited to CDP facilitator users
- Category list not yet standardized
- No authentication/API keys yet
- Search functionality basic

**Planned features:**
- Full-text search
- User ratings/reviews
- Usage statistics
- Multiple facilitator support
- Advanced filtering
