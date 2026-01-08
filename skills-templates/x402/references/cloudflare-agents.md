# Cloudflare Agents SDK x402 Integration

## Overview

Cloudflare has embedded x402 directly into its Agents SDK and Model Context Protocol (MCP) infrastructure, enabling AI agents to pay per use for data access, tool execution, or inference APIs. This integration is part of the x402 Foundation partnership between Cloudflare and Coinbase.

## Key Features

- **withX402**: Wrapper to add payment support to MCP servers
- **paidTool()**: Method to define tools with USD pricing
- **withX402Client**: Client wrapper for agents to pay for tools
- **Human-in-the-loop**: Optional payment confirmation callbacks
- **Automatic payments**: Support for autonomous agent transactions

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ AI Agent        │────>│ MCP Server      │────>│ x402 Facilitator│
│ (withX402Client)│     │ (withX402)      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                        │
         │  1. Call paid tool   │                        │
         │─────────────────────>│                        │
         │                      │                        │
         │  2. 402 Payment Req  │                        │
         │<─────────────────────│                        │
         │                      │                        │
         │  3. Sign & Pay       │                        │
         │─────────────────────>│                        │
         │                      │                        │
         │                      │  4. Verify & Settle    │
         │                      │───────────────────────>│
         │                      │                        │
         │                      │  5. Confirmation       │
         │                      │<───────────────────────│
         │                      │                        │
         │  6. Tool Result      │                        │
         │<─────────────────────│                        │
```

## Server-Side Implementation

### Basic Setup with withX402

```typescript
import { McpServer } from "@cloudflare/agents";
import { withX402 } from "@cloudflare/agents/x402";
import { z } from "zod";

// x402 configuration
const X402_CONFIG = {
  network: "base-sepolia",                    // or "base" for mainnet
  recipient: "0xYourWalletAddress",           // Your payment receiving wallet
  facilitatorUrl: "https://x402.org/facilitator"
};

// Create MCP server with x402 support
const server = withX402(
  new McpServer({
    name: "MyPaidMCPServer",
    version: "1.0.0"
  }),
  X402_CONFIG
);
```

### Defining Paid Tools

```typescript
// Paid tool with $0.01 price
server.paidTool(
  "analyze-data",                    // Tool name
  "Analyzes data using AI model",    // Description
  0.01,                              // Price in USD
  {                                  // Input schema (Zod)
    data: z.string(),
    format: z.enum(["json", "csv"]).optional()
  },
  {},                                // Additional options
  async ({ data, format }) => {
    // Tool implementation
    const analysis = await performAnalysis(data, format);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(analysis)
      }]
    };
  }
);

// Another paid tool with different pricing
server.paidTool(
  "generate-image",
  "Generates an image from a prompt",
  0.05,  // $0.05 per image
  { prompt: z.string() },
  {},
  async ({ prompt }) => {
    const imageUrl = await generateImage(prompt);
    return {
      content: [{
        type: "image",
        data: imageUrl,
        mimeType: "image/png"
      }]
    };
  }
);
```

### Mixing Paid and Free Tools

```typescript
// Free tool - no price parameter
server.tool(
  "get-server-time",
  "Returns current server time",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: new Date().toISOString()
      }]
    };
  }
);

// Paid tool - has price parameter
server.paidTool(
  "get-premium-data",
  "Returns premium data",
  0.001,  // $0.001
  {},
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(await fetchPremiumData())
      }]
    };
  }
);
```

## Client-Side Implementation

### withX402Client for Agent Payments

```typescript
import { withX402Client } from "@cloudflare/agents/x402";
import { privateKeyToAccount } from "viem/accounts";

// Create wallet account
const account = privateKeyToAccount(
  process.env.AGENT_PRIVATE_KEY as `0x${string}`
);

// Option 1: With human confirmation
const clientWithConfirmation = withX402Client(mcpClient, {
  account,
  onPaymentRequired: async (paymentInfo) => {
    console.log(`Payment required: $${paymentInfo.amount}`);
    console.log(`Tool: ${paymentInfo.toolName}`);

    // Get user approval (implement your UI here)
    const approved = await promptUser(
      `Allow payment of $${paymentInfo.amount}?`
    );

    return approved;
  }
});

// Option 2: Automatic payment (no confirmation)
const autoPayClient = withX402Client(mcpClient, {
  account,
  onPaymentRequired: null  // Pays automatically
});
```

### Payment Confirmation Interface

```typescript
interface PaymentInfo {
  amount: string;          // USD amount (e.g., "0.01")
  toolName: string;        // Name of the tool being called
  network: string;         // Network identifier
  recipient: string;       // Payment recipient address
  asset: string;           // Payment asset (usually USDC)
}

// Custom confirmation handler
const confirmHandler = async (info: PaymentInfo): Promise<boolean> => {
  // Check spending limits
  if (parseFloat(info.amount) > dailyLimit) {
    console.log("Payment exceeds daily limit");
    return false;
  }

  // Auto-approve small amounts
  if (parseFloat(info.amount) < 0.10) {
    return true;
  }

  // Require human approval for larger amounts
  return await askUserForApproval(info);
};
```

## x402-axios Integration

Use x402-axios within MCP tool implementations to call external paid APIs:

```typescript
import { withPaymentInterceptor } from "x402-axios";
import { privateKeyToAccount } from "viem/accounts";
import axios from "axios";

// Setup payment-enabled axios client
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const paymentClient = withPaymentInterceptor(
  axios.create({ baseURL: "https://paid-api.example.com" }),
  account
);

// MCP tool that calls external paid API
server.tool(
  "get-weather-forecast",
  "Get detailed weather forecast from paid service",
  { location: z.string() },
  async ({ location }) => {
    // This automatically handles 402 responses
    const response = await paymentClient.get("/forecast", {
      params: { location }
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(response.data)
      }]
    };
  }
);
```

## Cloudflare Worker Deployment

### Complete Worker Example

```typescript
import { Hono } from "hono";
import { McpServer } from "@cloudflare/agents";
import { withX402 } from "@cloudflare/agents/x402";
import { paymentMiddleware } from "@x402/hono";
import { z } from "zod";

interface Env {
  RECIPIENT_ADDRESS: string;
  FACILITATOR_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const app = new Hono();

    // MCP endpoint with paid tools
    app.all("/mcp/*", async (c) => {
      const server = withX402(
        new McpServer({ name: "WorkerMCP", version: "1.0.0" }),
        {
          network: "base",
          recipient: env.RECIPIENT_ADDRESS,
          facilitatorUrl: env.FACILITATOR_URL
        }
      );

      server.paidTool(
        "compute",
        "Runs computation",
        0.001,
        { expression: z.string() },
        {},
        async ({ expression }) => {
          const result = eval(expression);  // Note: sanitize in production!
          return { content: [{ type: "text", text: String(result) }] };
        }
      );

      return server.handleRequest(c.req.raw);
    });

    // REST API with payment middleware
    app.use("/api/premium/*", paymentMiddleware({
      facilitatorUrl: env.FACILITATOR_URL,
      routes: {
        "/api/premium/data": {
          price: "$0.01",
          network: "base",
          recipient: env.RECIPIENT_ADDRESS
        }
      }
    }));

    app.get("/api/premium/data", (c) => {
      return c.json({ premium: true, data: "Exclusive content" });
    });

    return app.fetch(request);
  }
};
```

### wrangler.toml Configuration

```toml
name = "x402-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
FACILITATOR_URL = "https://x402.org/facilitator"

# Use secrets for sensitive values
# wrangler secret put RECIPIENT_ADDRESS
```

## Testing

### Testnet Setup

1. Get testnet USDC from Circle faucet for Base Sepolia
2. Configure with testnet facilitator URL
3. Use `base-sepolia` network identifier

```typescript
const testConfig = {
  network: "base-sepolia",
  recipient: "0xYourTestnetWallet",
  facilitatorUrl: "https://x402.org/facilitator"
};
```

### Local Testing with MCP Inspector

```bash
# Start your MCP server
npm run dev

# Use MCP Inspector
npx @modelcontextprotocol/inspector http://localhost:3000/mcp
```

## Environment Variables

```bash
# Required for servers
RECIPIENT_ADDRESS=0x...          # Your wallet address
FACILITATOR_URL=https://x402.org/facilitator

# Required for clients/agents
AGENT_PRIVATE_KEY=0x...          # Agent's wallet private key

# Network selection
X402_NETWORK=base-sepolia        # or "base" for mainnet
```

## Error Handling

```typescript
server.paidTool(
  "risky-operation",
  "Performs risky operation",
  0.10,
  { input: z.string() },
  {},
  async ({ input }) => {
    try {
      const result = await riskyOperation(input);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }]
      };
    } catch (error) {
      // Payment still charged even on error!
      // Consider implementing refund logic
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);
```

## Best Practices

### 1. Price Appropriately

```typescript
// Consider computation cost + profit margin
server.paidTool("cheap-tool", "Quick operation", 0.001, ...);     // $0.001
server.paidTool("medium-tool", "Standard operation", 0.01, ...);  // $0.01
server.paidTool("expensive-tool", "Heavy compute", 0.10, ...);    // $0.10
```

### 2. Document Costs

```typescript
server.paidTool(
  "generate-report",
  "Generates comprehensive report ($0.05 per request)",  // Include price in description
  0.05,
  ...
);
```

### 3. Implement Spending Limits

```typescript
class SpendingTracker {
  private spent: number = 0;
  private limit: number;

  constructor(dailyLimit: number) {
    this.limit = dailyLimit;
  }

  canSpend(amount: number): boolean {
    return this.spent + amount <= this.limit;
  }

  record(amount: number): void {
    this.spent += amount;
  }
}

const tracker = new SpendingTracker(1.00);  // $1/day limit

const client = withX402Client(mcpClient, {
  account,
  onPaymentRequired: async (info) => {
    const amount = parseFloat(info.amount);
    if (!tracker.canSpend(amount)) {
      console.log("Daily limit reached");
      return false;
    }
    tracker.record(amount);
    return true;
  }
});
```

### 4. Audit Logging

```typescript
server.paidTool(
  "audited-tool",
  "Tool with audit logging",
  0.01,
  { input: z.string() },
  {},
  async ({ input }, context) => {
    // Log payment details
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      tool: "audited-tool",
      payer: context.payerAddress,
      amount: "0.01",
      input: input.substring(0, 100)  // Truncate for privacy
    }));

    return { content: [{ type: "text", text: "Done" }] };
  }
);
```

## Migration from Standard MCP

If you have an existing MCP server:

```typescript
// Before: Standard MCP server
const server = new McpServer({ name: "MyMCP", version: "1.0.0" });
server.tool("my-tool", "Does something", {...}, async () => {...});

// After: Add x402 support
import { withX402 } from "@cloudflare/agents/x402";

const server = withX402(
  new McpServer({ name: "MyMCP", version: "1.0.0" }),
  {
    network: "base",
    recipient: "0xYourWallet",
    facilitatorUrl: "https://api.cdp.coinbase.com/platform/v2/x402"
  }
);

// Existing free tools continue to work
server.tool("my-tool", "Does something", {...}, async () => {...});

// Add new paid tools
server.paidTool("premium-tool", "Premium feature", 0.01, {...}, {}, async () => {...});
```

## Resources

- [Cloudflare Agents x402 Documentation](https://developers.cloudflare.com/agents/x402/)
- [Cloudflare MCP Documentation](https://developers.cloudflare.com/agents/model-context-protocol/)
- [Cloudflare x402 Foundation Announcement](https://blog.cloudflare.com/x402/)
- [x402 Protocol Specification](https://x402.org)
- [Zuplo x402 MCP Tutorial](https://zuplo.com/blog/mcp-api-payments-with-x402)
