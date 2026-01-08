---
name: x402
description: x402 open payment standard for HTTP-native crypto payments. Use for API monetization, AI agent payments, micropayments, and integrating USDC payments into web services using HTTP 402 status code.
---

# x402 Payment Protocol Skill

The open payment standard that enables services to charge for access to their APIs and content directly over HTTP using the `402 Payment Required` status code. Enables crypto-native payments without accounts or traditional payment processors.

## When to Use This Skill

This skill should be triggered when:
- Implementing paid APIs with cryptocurrency payments
- Building AI agent payment capabilities
- Setting up micropayment systems for web services
- Integrating USDC payments into HTTP APIs
- Working with HTTP 402 Payment Required responses
- Building MCP servers with payment handling
- Discovering or registering services on the x402 Bazaar

## Quick Reference

### Installation

**Seller (Node.js):**
```bash
# Express
npm install @x402/express @x402/core @x402/evm

# Next.js
npm install @x402/next @x402/core @x402/evm

# Hono
npm install @x402/hono @x402/core @x402/evm
```

**Buyer (Node.js):**
```bash
# Fetch wrapper
npm install @x402/fetch @x402/evm

# Axios wrapper
npm install @x402/axios @x402/evm

# Solana support
npm install @x402/svm
```

**Go:**
```bash
go get github.com/coinbase/x402/go
```

**Python:**
```bash
pip install x402  # v1 patterns
```

### Network Identifiers (CAIP-2)

| Network | Identifier |
|---------|------------|
| Base Mainnet | `eip155:8453` |
| Base Sepolia (Testnet) | `eip155:84532` |
| Solana Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` |

### Facilitator URLs

| Environment | URL |
|-------------|-----|
| Testnet | `https://x402.org/facilitator` |
| Mainnet (CDP) | `https://api.cdp.coinbase.com/platform/v2/x402` |

### Payment Flow

```
1. Client → Server: HTTP request for paid resource
2. Server → Client: 402 Payment Required + PAYMENT-REQUIRED header
3. Client: Signs payment payload with wallet
4. Client → Server: Retry with PAYMENT-SIGNATURE header
5. Server → Facilitator: Verify and settle payment
6. Server → Client: 200 OK + resource + PAYMENT-RESPONSE header
```

### Seller Setup (Express Example)

```typescript
import express from "express";
import { paymentMiddleware } from "@x402/express";
import { x402Server } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

const app = express();
const server = new x402Server();
registerExactEvmScheme(server);

app.use(paymentMiddleware(server, {
  facilitatorUrl: "https://x402.org/facilitator",
  routes: {
    "/api/paid-endpoint": {
      price: "$0.01",  // USD price
      network: "eip155:84532",  // Base Sepolia
      recipient: "0xYourWalletAddress"
    }
  }
}));

app.get("/api/paid-endpoint", (req, res) => {
  res.json({ data: "Premium content" });
});
```

### Buyer Setup (Fetch Example)

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

// Create wallet signer
const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);

// Setup x402 client
const client = new x402Client();
registerExactEvmScheme(client, { signer });

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Make paid request (handles 402 automatically)
const response = await fetchWithPayment("https://api.example.com/paid-endpoint");
const data = await response.json();
```

### Multi-Network Support

```typescript
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { registerExactSvmScheme } from "@x402/svm/exact/client";

const client = new x402Client();
registerExactEvmScheme(client, { signer: evmSigner });
registerExactSvmScheme(client, { signer: svmSigner });
```

### HTTP Headers

| Header | Direction | Purpose |
|--------|-----------|---------|
| `PAYMENT-REQUIRED` | Server → Client | Payment requirements (Base64 JSON) |
| `PAYMENT-SIGNATURE` | Client → Server | Signed payment payload (Base64 JSON) |
| `PAYMENT-RESPONSE` | Server → Client | Settlement confirmation (Base64 JSON) |

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **seller-integration.md** - Complete seller/server setup guide
- **buyer-integration.md** - Complete buyer/client setup guide
- **protocol-spec.md** - HTTP 402 protocol specification
- **facilitator.md** - Facilitator API and settlement
- **bazaar.md** - Service discovery layer
- **mcp-integration.md** - MCP server with x402 payments

## Key Concepts

### What is x402?

x402 activates the previously reserved HTTP `402 Payment Required` status code for API-native cryptocurrency payments. It enables:

- **Frictionless Payments**: No accounts, no session tokens, just wallets
- **Machine-to-Machine**: AI agents can pay for APIs programmatically
- **Micropayments**: Sub-cent transactions without payment processor fees
- **Stateless**: Each request is independent; no persistent credentials

### Architecture Roles

**Client**: Initiates requests, signs payments with crypto wallet
**Server**: Enforces payment requirements, delivers resources
**Facilitator**: Verifies payments, handles blockchain settlement

### Supported Tokens

- **USDC**: Primary supported stablecoin
- **Networks**: Base (EVM), Solana (SVM)
- **Fee-free**: CDP facilitator offers zero-fee USDC settlement

## Common Patterns

### Enable Bazaar Discovery

```typescript
app.use(paymentMiddleware(server, {
  facilitatorUrl: "https://api.cdp.coinbase.com/platform/v2/x402",
  routes: {
    "/api/weather": {
      price: "$0.001",
      network: "eip155:8453",
      recipient: "0xYourWallet",
      extensions: {
        bazaar: {
          discoverable: true,
          category: "weather",
          tags: ["forecast", "api"]
        }
      }
    }
  }
}));
```

### Query Bazaar for Services

```typescript
const response = await fetch(
  "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
);
const services = await response.json();
```

### Go Seller Implementation

```go
import (
    "github.com/coinbase/x402/go/pkg/x402"
    "github.com/coinbase/x402/go/pkg/middleware"
)

server := x402.NewServer()
evmscheme.RegisterExactEvmScheme(server)

config := middleware.Config{
    FacilitatorURL: "https://x402.org/facilitator",
    Routes: map[string]middleware.RouteConfig{
        "/api/data": {
            Price:     "0.01",
            Network:   "eip155:84532",
            Recipient: "0xYourWallet",
        },
    },
}

handler := middleware.PaymentMiddleware(server, config)(yourHandler)
```

### Go Buyer Implementation

```go
import (
    "github.com/coinbase/x402/go/pkg/x402"
    evmsigners "github.com/coinbase/x402/go/pkg/evm/signers"
)

signer, _ := evmsigners.NewClientSignerFromPrivateKey(os.Getenv("EVM_PRIVATE_KEY"))
client := x402.NewClient()
evmscheme.RegisterExactEvmScheme(client, signer)

httpClient := x402http.WrapHTTPClientWithPayment(http.DefaultClient, client)
resp, _ := httpClient.Get("https://api.example.com/paid-endpoint")
```

## Error Handling

Common errors:
- **Missing scheme**: Register payment scheme before making requests
- **Insufficient balance**: Ensure wallet has USDC on correct network
- **Invalid signature**: Check private key format and network match
- **Payment timeout**: Retry with fresh payment payload

```typescript
try {
  const response = await fetchWithPayment(url);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Add USDC to wallet');
  } else if (error.code === 'SCHEME_NOT_REGISTERED') {
    console.error('Register payment scheme first');
  }
}
```

## Testing

1. Use testnet facilitator: `https://x402.org/facilitator`
2. Use testnet networks: `eip155:84532` (Base Sepolia)
3. Get testnet USDC from faucets
4. Verify 402 response includes `PAYMENT-REQUIRED` header
5. Verify successful response includes `PAYMENT-RESPONSE` header

## Resources

- [x402 Documentation](https://x402.gitbook.io/x402)
- [GitHub Repository](https://github.com/coinbase/x402)
- [x402.org Landing Page](https://x402.org)
- [Vercel Starter Template](https://vercel.com/templates/next.js/x402-starter)
- [CDP Wallet API](https://docs.cdp.coinbase.com)

## Notes

- x402 was developed by Coinbase as an open standard
- The protocol is vendor-agnostic and works with any facilitator
- Currently supports USDC on Base and Solana networks
- AI agents can use x402 for autonomous payments
- MCP integration enables Claude and other AI assistants to make payments
