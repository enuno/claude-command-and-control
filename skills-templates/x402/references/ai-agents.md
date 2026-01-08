# x402 AI Agent Integration

## Overview

x402 was designed from the ground up to enable autonomous AI agent payments. The protocol addresses a major roadblock to fully autonomous AI systems: the lack of a payment system that empowers AI agents to function without human intervention. Legacy payment systems are designed primarily for human interactions, but x402 enables machine-to-machine transactions natively over HTTP.

## Why AI Agents Need x402

### Legacy Payment Limitations

Traditional payment systems require:
- Human account creation and verification
- Session management and authentication
- Manual intervention for purchases
- Credit card processing with high fees
- Subscription models that don't fit per-request pricing

### x402 Advantages for AI Agents

- **No Accounts**: Wallet address is the only identity needed
- **Stateless**: Each request is independent
- **Programmatic**: Standard HTTP headers, no UI required
- **Micropayments**: Sub-cent transactions are economical
- **Instant**: Payments settle in seconds
- **Universal**: Any x402-enabled API is accessible

## Agent Architecture Patterns

### Pattern 1: Direct Wallet Access

Agent has direct access to wallet private key:

```typescript
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

class PaymentEnabledAgent {
  private fetchWithPayment: typeof fetch;

  constructor(privateKey: string) {
    const signer = privateKeyToAccount(privateKey as `0x${string}`);
    const client = new x402Client();
    registerExactEvmScheme(client, { signer });
    this.fetchWithPayment = wrapFetchWithPayment(fetch, client);
  }

  async queryPaidAPI(url: string, params?: object): Promise<any> {
    const response = await this.fetchWithPayment(url, {
      method: "GET",
      headers: params ? { "Content-Type": "application/json" } : undefined,
    });
    return response.json();
  }
}
```

### Pattern 2: MCP Server Bridge

Agent communicates through MCP server that handles payments:

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────────┐
│ Claude Desktop  │────>│ MCP Server  │────>│ x402 API        │
│ (MCP Client)    │     │ (Bridge)    │     │ (Paid Resource) │
└─────────────────┘     └─────────────┘     └─────────────────┘
         │                     │                     │
         │                     │                     │
         └─────────────────────┴──────────┬──────────┘
                                          │
                              ┌───────────▼───────────┐
                              │ x402 Payment Handler  │
                              │ (Wallet Signing)      │
                              └───────────────────────┘
```

See `mcp-integration.md` for full implementation details.

### Pattern 3: Service Discovery Agent

Agent that discovers and uses services dynamically:

```typescript
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";

class DiscoveryAgent {
  private fetchWithPayment: typeof fetch;
  private serviceCache: Map<string, any> = new Map();

  async discoverServices(): Promise<any[]> {
    const response = await fetch(
      "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
    );
    const data = await response.json();

    // Cache services by category
    for (const service of data.resources) {
      this.serviceCache.set(service.url, service);
    }

    return data.resources;
  }

  async findServiceByQuery(query: string): Promise<any | null> {
    const services = await this.discoverServices();

    // Find by description or tags
    return services.find(s =>
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.tags?.some((t: string) => t.toLowerCase().includes(query.toLowerCase()))
    );
  }

  async executeQuery(query: string): Promise<any> {
    const service = await this.findServiceByQuery(query);
    if (!service) {
      return { error: "No matching service found" };
    }

    const response = await this.fetchWithPayment(service.url);
    return response.json();
  }
}
```

## LLM Function Calling Integration

### Providing Services as Tools

```typescript
// Convert discovered services to LLM function definitions
function servicesToTools(services: any[]): any[] {
  return services.map(service => ({
    type: "function",
    function: {
      name: service.url.split("/").pop() || "unknown",
      description: `${service.description} (Cost: ${service.pricing.price})`,
      parameters: service.schema?.input || {
        type: "object",
        properties: {}
      }
    }
  }));
}

// Usage with Claude
const services = await discoverServices();
const tools = servicesToTools(services);

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  messages: [{ role: "user", content: userQuery }],
  tools: tools
});
```

### Executing Tool Calls with Payment

```typescript
async function executeToolCall(
  toolCall: any,
  fetchWithPayment: typeof fetch
): Promise<any> {
  const { name, arguments: args } = toolCall;

  // Find service URL by tool name
  const service = services.find(s =>
    s.url.split("/").pop() === name
  );

  if (!service) {
    return { error: `Service ${name} not found` };
  }

  const url = new URL(service.url);
  for (const [key, value] of Object.entries(args)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetchWithPayment(url.toString());
  return response.json();
}
```

## Spending Controls

### Daily/Monthly Limits

```typescript
class SpendingController {
  private dailySpend: number = 0;
  private monthlySpend: number = 0;
  private lastDayReset: Date = new Date();
  private lastMonthReset: Date = new Date();

  constructor(
    private dailyLimit: number = 1.00,  // $1.00 USD
    private monthlyLimit: number = 25.00  // $25.00 USD
  ) {}

  private resetIfNeeded(): void {
    const now = new Date();

    // Reset daily counter
    if (now.getDate() !== this.lastDayReset.getDate()) {
      this.dailySpend = 0;
      this.lastDayReset = now;
    }

    // Reset monthly counter
    if (now.getMonth() !== this.lastMonthReset.getMonth()) {
      this.monthlySpend = 0;
      this.lastMonthReset = now;
    }
  }

  canSpend(amount: number): boolean {
    this.resetIfNeeded();
    return (
      this.dailySpend + amount <= this.dailyLimit &&
      this.monthlySpend + amount <= this.monthlyLimit
    );
  }

  recordSpend(amount: number): void {
    this.dailySpend += amount;
    this.monthlySpend += amount;
  }

  getRemainingBudget(): { daily: number; monthly: number } {
    this.resetIfNeeded();
    return {
      daily: this.dailyLimit - this.dailySpend,
      monthly: this.monthlyLimit - this.monthlySpend
    };
  }
}
```

### Human Approval for Large Transactions

```typescript
class ApprovalGatedAgent {
  constructor(
    private autoApproveThreshold: number = 0.10,  // Auto-approve under $0.10
    private onApprovalRequest: (amount: number, url: string) => Promise<boolean>
  ) {}

  async makePayment(amount: number, url: string): Promise<boolean> {
    if (amount <= this.autoApproveThreshold) {
      return true;
    }

    // Request human approval
    return this.onApprovalRequest(amount, url);
  }
}
```

## Multi-Network Agent

Agent that can pay on multiple blockchains:

```typescript
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { registerExactSvmScheme } from "@x402/svm/exact/client";

class MultiNetworkAgent {
  private client: x402Client;

  constructor(
    evmPrivateKey?: string,
    svmPrivateKey?: string
  ) {
    this.client = new x402Client();

    if (evmPrivateKey) {
      const evmSigner = privateKeyToAccount(evmPrivateKey as `0x${string}`);
      registerExactEvmScheme(this.client, { signer: evmSigner });
    }

    if (svmPrivateKey) {
      const svmSigner = Keypair.fromSecretKey(bs58.decode(svmPrivateKey));
      registerExactSvmScheme(this.client, { signer: svmSigner });
    }
  }

  // Client automatically routes to correct network based on 402 response
  async query(url: string): Promise<any> {
    const fetchWithPayment = wrapFetchWithPayment(fetch, this.client);
    const response = await fetchWithPayment(url);
    return response.json();
  }
}
```

## Audit Logging

```typescript
interface PaymentLog {
  timestamp: Date;
  url: string;
  amount: string;
  network: string;
  transactionHash?: string;
  success: boolean;
  error?: string;
}

class AuditedAgent {
  private logs: PaymentLog[] = [];

  async loggedFetch(url: string): Promise<Response> {
    const log: PaymentLog = {
      timestamp: new Date(),
      url,
      amount: "unknown",
      network: "unknown",
      success: false
    };

    try {
      const response = await this.fetchWithPayment(url);

      // Extract payment info from response header
      const paymentResponse = response.headers.get("PAYMENT-RESPONSE");
      if (paymentResponse) {
        const decoded = JSON.parse(
          Buffer.from(paymentResponse, "base64").toString()
        );
        log.transactionHash = decoded.transactionHash;
        log.network = decoded.network;
      }

      log.success = true;
      return response;
    } catch (error) {
      log.error = error.message;
      throw error;
    } finally {
      this.logs.push(log);
    }
  }

  getAuditLogs(): PaymentLog[] {
    return [...this.logs];
  }
}
```

## Security Best Practices

### 1. Key Isolation

```typescript
// Use separate wallets for different agent instances
const agentWallets = {
  research: process.env.RESEARCH_AGENT_KEY,
  weather: process.env.WEATHER_AGENT_KEY,
  analytics: process.env.ANALYTICS_AGENT_KEY
};
```

### 2. Minimal Funding

```typescript
// Fund agent wallets with only expected usage amounts
// Monitor and refill automatically based on spend rate
const FUNDING_TARGET = 5.00; // $5 USDC
const REFUND_THRESHOLD = 1.00; // Refill when balance drops below $1
```

### 3. Network Restrictions

```typescript
// Only allow specific networks per agent type
const allowedNetworks = {
  production: ["eip155:8453"],  // Base mainnet only
  testing: ["eip155:84532"]     // Base Sepolia only
};
```

### 4. Rate Limiting

```typescript
// Limit requests per minute to prevent runaway spending
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000  // 1 minute
});
```

## Example: Weather Agent

Complete example of an AI agent that queries weather data:

```typescript
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const WEATHER_API = "https://weather.example.com/api/forecast";

class WeatherAgent {
  private fetchWithPayment: typeof fetch;
  private spendingController: SpendingController;

  constructor() {
    const signer = privateKeyToAccount(
      process.env.WEATHER_AGENT_KEY as `0x${string}`
    );
    const client = new x402Client();
    registerExactEvmScheme(client, { signer });
    this.fetchWithPayment = wrapFetchWithPayment(fetch, client);
    this.spendingController = new SpendingController(0.50, 10.00);
  }

  async getWeather(location: string): Promise<any> {
    const estimatedCost = 0.001; // $0.001 per request

    if (!this.spendingController.canSpend(estimatedCost)) {
      return { error: "Spending limit exceeded" };
    }

    const url = `${WEATHER_API}?location=${encodeURIComponent(location)}`;
    const response = await this.fetchWithPayment(url);
    const data = await response.json();

    this.spendingController.recordSpend(estimatedCost);

    return data;
  }

  getBudgetStatus(): { daily: number; monthly: number } {
    return this.spendingController.getRemainingBudget();
  }
}

// Usage
const agent = new WeatherAgent();
const weather = await agent.getWeather("San Francisco");
console.log(weather);
console.log("Remaining budget:", agent.getBudgetStatus());
```

## Partners Supporting AI Agent Payments

- **Anthropic**: Claude integration via MCP
- **AWS**: Cloud deployment support
- **Cloudflare**: Workers and Agents SDK integration
- **Circle**: USDC infrastructure
- **NEAR**: Chain support expansion
