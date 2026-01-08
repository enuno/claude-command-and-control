# x402 GitHub Repository Reference

## Repository Overview

- **URL**: https://github.com/coinbase/x402
- **License**: Apache 2.0
- **Languages**: TypeScript (55.1%), Go (24.0%), Python (19.8%)
- **Stats**: 5.2k stars, 969 forks, 133+ contributors

## Repository Structure

```
x402/
├── docs/                    # GitBook documentation source
├── examples/                # Reference implementations
│   ├── typescript/
│   │   ├── clients/        # Client examples (fetch, axios, mcp)
│   │   ├── servers/        # Server examples (express, hono, next)
│   │   └── fullstack/      # Full-stack examples (next, miniapp)
│   ├── go/
│   │   ├── clients/        # Go client examples
│   │   └── servers/        # Go server examples
│   └── python/             # Python examples
├── packages/               # TypeScript/JavaScript packages
│   ├── core/              # @x402/core
│   ├── evm/               # @x402/evm
│   ├── svm/               # @x402/svm
│   ├── fetch/             # @x402/fetch
│   ├── axios/             # @x402/axios
│   ├── express/           # @x402/express
│   ├── hono/              # @x402/hono
│   ├── next/              # @x402/next
│   ├── paywall/           # @x402/paywall
│   └── extensions/        # @x402/extensions
├── go/                     # Go implementation
│   └── pkg/
│       ├── x402/          # Core Go package
│       ├── middleware/    # HTTP middleware
│       └── evmscheme/     # EVM scheme implementation
├── python/                 # Python implementation
├── specs/                  # Protocol specifications
│   └── schemes/
│       ├── exact/         # Exact scheme specs
│       │   ├── scheme_exact_evm.md
│       │   └── scheme_exact_svm.md
│       └── escrow/        # Escrow scheme proposal
├── ROADMAP.md             # Development roadmap
└── README.md              # Project overview
```

## Package Reference

### Core Package (@x402/core)

```typescript
import {
  x402Client,
  x402ResourceServer,
  FacilitatorClient,
  PaymentRequired,
  PaymentPayload,
  PaymentResponse
} from "@x402/core";
```

**Key exports:**
- `x402Client` - Client-side payment handler
- `x402ResourceServer` - Server-side resource protection
- `FacilitatorClient` - Facilitator communication
- Types for all protocol messages

### EVM Package (@x402/evm)

```typescript
// Client-side
import { registerExactEvmScheme } from "@x402/evm/exact/client";

// Server-side
import { ExactEvmScheme } from "@x402/evm/exact/server";
```

**Supported Networks:**
- Base Mainnet (eip155:8453)
- Base Sepolia (eip155:84532)
- Any EVM-compatible chain

**EIP-3009 Implementation:**
- `transferWithAuthorization` for gasless transfers
- Signature-based authorization
- Nonce and validity window for replay protection

### SVM Package (@x402/svm)

```typescript
// Client-side
import { registerExactSvmScheme } from "@x402/svm/exact/client";

// Server-side
import { ExactSvmScheme } from "@x402/svm/exact/server";
```

**Supported Networks:**
- Solana Mainnet (solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp)
- Solana Devnet (solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1)

### HTTP Client Packages

**@x402/fetch:**
```typescript
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";

const client = new x402Client();
registerExactEvmScheme(client, { signer });

const fetchWithPayment = wrapFetchWithPayment(fetch, client);
const response = await fetchWithPayment("https://api.example.com/paid");
```

**@x402/axios:**
```typescript
import { x402Client, wrapAxiosWithPayment } from "@x402/axios";

const client = new x402Client();
registerExactEvmScheme(client, { signer });

const axiosWithPayment = wrapAxiosWithPayment(axios, client);
const response = await axiosWithPayment.get("https://api.example.com/paid");
```

### Server Framework Packages

**@x402/express:**
```typescript
import { paymentMiddleware } from "@x402/express";

app.use(paymentMiddleware(resourceServer, {
  facilitatorUrl: FACILITATOR_URL,
  routes: {
    "/api/data": { price: "$0.01", network: "eip155:8453", recipient: "0x..." }
  }
}));
```

**@x402/hono:**
```typescript
import { paymentMiddleware } from "@x402/hono";

app.use("/api/*", paymentMiddleware({
  facilitatorUrl: FACILITATOR_URL,
  routes: { ... }
}));
```

**@x402/next:**
```typescript
import { withPayment } from "@x402/next";

export const GET = withPayment(
  async (req) => { /* handler */ },
  { price: "$0.01", network: "eip155:8453", recipient: "0x..." }
);
```

## Go Implementation

### Installation

```bash
go get github.com/coinbase/x402/go
```

### Server Setup

```go
package main

import (
    "github.com/coinbase/x402/go/pkg/x402"
    "github.com/coinbase/x402/go/pkg/middleware"
    "github.com/coinbase/x402/go/pkg/evmscheme"
)

func main() {
    // Create server and register schemes
    server := x402.NewServer()
    evmscheme.RegisterExactEvmScheme(server)

    // Configure payment middleware
    config := middleware.Config{
        FacilitatorURL: "https://x402.org/facilitator",
        Routes: map[string]middleware.RouteConfig{
            "/api/data": {
                Price:     "0.01",
                Network:   "eip155:8453",
                Recipient: "0xYourWallet",
            },
        },
    }

    // Wrap handler
    handler := middleware.PaymentMiddleware(server, config)(yourHandler)
    http.ListenAndServe(":8080", handler)
}
```

### Client Setup

```go
package main

import (
    "github.com/coinbase/x402/go/pkg/x402"
    x402http "github.com/coinbase/x402/go/pkg/http"
    "github.com/coinbase/x402/go/pkg/evmscheme"
)

func main() {
    client := x402.NewClient()
    evmscheme.RegisterExactEvmScheme(client, privateKey)

    httpClient := x402http.WrapHTTPClientWithPayment(http.DefaultClient, client)
    resp, _ := httpClient.Get("https://api.example.com/paid-endpoint")
}
```

## Python Implementation

### Installation

```bash
pip install x402
```

### Basic Usage

```python
from x402 import X402Client
from x402.schemes.exact import register_exact_evm

client = X402Client()
register_exact_evm(client, private_key=PRIVATE_KEY)

response = client.get("https://api.example.com/paid")
```

## Schemes Architecture

### What is a Scheme?

A **scheme** is a logical method for moving money. The same scheme may require different implementations on different blockchains.

| Scheme | Description | Status |
|--------|-------------|--------|
| `exact` | Transfer specific amount | Production |
| `upto` | Transfer up to max amount | Planned |
| `escrow` | Pre-funded usage-based | Proposed |

### exact Scheme

The `exact` scheme transfers a specific amount for access:
- Pay exactly $X to access resource
- Amount known before request
- Single atomic transaction

**EVM Implementation (EIP-3009):**
```typescript
// Authorization structure
{
  from: "0xPayer",
  to: "0xRecipient",
  value: "1000000",  // 1 USDC (6 decimals)
  validAfter: 0,
  validBefore: 1700000000,
  nonce: "0x..."
}
```

**SVM Implementation:**
```typescript
// SPL Token transfer
{
  from: "PayerPubkey",
  to: "RecipientPubkey",
  amount: 1000000,
  mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"  // USDC mint
}
```

### escrow Scheme (Proposed)

For usage-based APIs where cost is unknown upfront:

```
1. Client locks funds in escrow
2. Server provides service
3. Server claims consumed amount
4. Remainder returned to client
```

Use cases:
- LLM APIs (pay per token)
- Compute APIs (pay per second)
- Storage APIs (pay per byte)

## Payment Flow (12 Steps)

```
┌─────────┐                    ┌─────────┐                    ┌─────────────┐
│ Client  │                    │ Server  │                    │ Facilitator │
└────┬────┘                    └────┬────┘                    └──────┬──────┘
     │                              │                                │
     │ 1. Request resource          │                                │
     │─────────────────────────────>│                                │
     │                              │                                │
     │ 2. 402 + PaymentRequired     │                                │
     │<─────────────────────────────│                                │
     │                              │                                │
     │ 3. Select & create payload   │                                │
     │                              │                                │
     │ 4. Request + PAYMENT-SIG     │                                │
     │─────────────────────────────>│                                │
     │                              │                                │
     │                              │ 5. Verify (local or facilitator)
     │                              │─────────────────────────────────>
     │                              │                                │
     │                              │ 6. Validation result           │
     │                              │<─────────────────────────────────
     │                              │                                │
     │ 7. Fulfill (if valid)        │                                │
     │<─────────────────────────────│                                │
     │                              │                                │
     │                              │ 8. Settle payment              │
     │                              │─────────────────────────────────>
     │                              │                                │
     │                              │ 9. Submit to blockchain        │
     │                              │                                │
     │                              │ 10. Await confirmation         │
     │                              │                                │
     │                              │ 11. Execution response         │
     │                              │<─────────────────────────────────
     │                              │                                │
     │ 12. 200 OK + PAYMENT-RESPONSE│                                │
     │<─────────────────────────────│                                │
```

## Example Implementations

### TypeScript MCP Client

Location: `examples/typescript/clients/mcp`

```typescript
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

// Setup client
const account = privateKeyToAccount(PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer: account });

// Create payment-enabled fetch
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Use in MCP server
server.tool("paid-api", "Calls paid API", {}, async () => {
  const response = await fetchWithPayment("https://api.example.com/data");
  return { content: [{ type: "text", text: await response.text() }] };
});
```

### TypeScript Next.js Fullstack

Location: `examples/typescript/fullstack/next`

```typescript
// app/api/paid/route.ts
import { withPayment } from "@x402/next";

export const GET = withPayment(
  async (req) => {
    return Response.json({ data: "Premium content" });
  },
  {
    price: "$0.01",
    network: "eip155:8453",
    recipient: process.env.RECIPIENT_ADDRESS!,
    facilitatorUrl: process.env.FACILITATOR_URL!,
  }
);
```

### TypeScript Hono Server

Location: `examples/typescript/servers/hono`

```typescript
import { Hono } from "hono";
import { paymentMiddleware } from "@x402/hono";

const app = new Hono();

app.use("/api/premium/*", paymentMiddleware({
  facilitatorUrl: "https://x402.org/facilitator",
  routes: {
    "/api/premium/data": {
      price: "$0.01",
      network: "eip155:8453",
      recipient: "0xYourWallet"
    }
  }
}));

app.get("/api/premium/data", (c) => c.json({ premium: true }));

export default app;
```

## Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/coinbase/x402.git
cd x402

# Install dependencies (TypeScript)
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Proposing New Schemes

1. Create specification in `specs/schemes/[scheme-name]/`
2. Include EVM and SVM implementations
3. Open GitHub issue for discussion
4. Submit PR with reference implementation

## Resources

- [GitHub Repository](https://github.com/coinbase/x402)
- [Documentation](https://x402.gitbook.io/x402)
- [Examples Directory](https://github.com/coinbase/x402/tree/main/examples)
- [Protocol Specifications](https://github.com/coinbase/x402/tree/main/specs)
- [Roadmap](https://github.com/coinbase/x402/blob/main/ROADMAP.md)
- [Issues](https://github.com/coinbase/x402/issues)
