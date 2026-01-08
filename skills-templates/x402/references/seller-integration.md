# x402 Seller Integration Guide

## Overview

This guide enables API sellers to integrate cryptocurrency payments using x402, supporting both testnet and mainnet deployments across Base and Solana networks.

## Prerequisites

- Crypto wallet for receiving funds (EVM-compatible)
- Node.js/npm, Go, or Python installed
- Existing API or server infrastructure

## Installation by Framework

### Express.js
```bash
npm install @x402/express @x402/core @x402/evm
```

### Next.js
```bash
npm install @x402/next @x402/core @x402/evm
```

### Hono
```bash
npm install @x402/hono @x402/core @x402/evm
```

### Go
```bash
go get github.com/coinbase/x402/go
```

### Python
```bash
pip install x402  # Uses v1 patterns
```

## Express.js Implementation

```typescript
import express from "express";
import { paymentMiddleware } from "@x402/express";
import { x402Server } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

const app = express();

// Initialize x402 server
const server = new x402Server();
registerExactEvmScheme(server);

// Configure payment middleware
app.use(paymentMiddleware(server, {
  facilitatorUrl: "https://x402.org/facilitator",  // Testnet
  routes: {
    "/api/premium": {
      price: "$0.01",                    // USD price
      network: "eip155:84532",           // Base Sepolia
      recipient: "0xYourWalletAddress"   // Your wallet
    },
    "/api/data": {
      price: "$0.001",
      network: "eip155:84532",
      recipient: "0xYourWalletAddress"
    }
  }
}));

// Protected routes
app.get("/api/premium", (req, res) => {
  res.json({
    message: "Premium content",
    data: { /* your data */ }
  });
});

app.get("/api/data", (req, res) => {
  res.json({ items: [/* your items */] });
});

app.listen(3000, () => {
  console.log("Server running with x402 payments");
});
```

## Next.js Implementation

```typescript
// middleware.ts
import { createPaymentMiddleware } from "@x402/next";
import { x402Server } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

const server = new x402Server();
registerExactEvmScheme(server);

export default createPaymentMiddleware(server, {
  facilitatorUrl: "https://x402.org/facilitator",
  routes: {
    "/api/paid": {
      price: "$0.01",
      network: "eip155:84532",
      recipient: process.env.WALLET_ADDRESS!
    }
  }
});

export const config = {
  matcher: ["/api/paid/:path*"]
};
```

## Go Implementation

```go
package main

import (
    "net/http"
    "os"

    "github.com/coinbase/x402/go/pkg/x402"
    "github.com/coinbase/x402/go/pkg/middleware"
    evmscheme "github.com/coinbase/x402/go/pkg/evm/scheme"
)

func main() {
    // Initialize x402 server
    server := x402.NewServer()
    evmscheme.RegisterExactEvmScheme(server)

    // Configure routes
    config := middleware.Config{
        FacilitatorURL: "https://x402.org/facilitator",
        Routes: map[string]middleware.RouteConfig{
            "/api/data": {
                Price:     "0.01",
                Network:   "eip155:84532",
                Recipient: os.Getenv("WALLET_ADDRESS"),
            },
        },
    }

    // Create handler
    handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"data": "protected content"}`))
    })

    // Wrap with payment middleware
    protectedHandler := middleware.PaymentMiddleware(server, config)(handler)

    http.Handle("/api/data", protectedHandler)
    http.ListenAndServe(":8080", nil)
}
```

## Network Configuration

### Testnet (Development)

| Network | Identifier | Facilitator |
|---------|------------|-------------|
| Base Sepolia | `eip155:84532` | `https://x402.org/facilitator` |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | `https://x402.org/facilitator` |

### Mainnet (Production)

| Network | Identifier | Facilitator |
|---------|------------|-------------|
| Base | `eip155:8453` | `https://api.cdp.coinbase.com/platform/v2/x402` |
| Solana | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | `https://api.cdp.coinbase.com/platform/v2/x402` |

## Pricing Configuration

Prices are specified in USD:

```typescript
routes: {
  "/api/cheap": {
    price: "$0.001",  // Tenth of a cent
    // ...
  },
  "/api/standard": {
    price: "$0.01",   // One cent
    // ...
  },
  "/api/premium": {
    price: "$1.00",   // One dollar
    // ...
  }
}
```

## Solana Support

```typescript
import { registerExactSvmScheme } from "@x402/svm/exact/server";

const server = new x402Server();
registerExactEvmScheme(server);  // EVM support
registerExactSvmScheme(server);  // Solana support

app.use(paymentMiddleware(server, {
  facilitatorUrl: "https://x402.org/facilitator",
  routes: {
    "/api/evm-endpoint": {
      price: "$0.01",
      network: "eip155:84532",
      recipient: "0xEvmWallet"
    },
    "/api/solana-endpoint": {
      price: "$0.01",
      network: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
      recipient: "SolanaWalletPublicKey"
    }
  }
}));
```

## Enable Bazaar Discovery

Make your API discoverable to AI agents:

```typescript
routes: {
  "/api/weather": {
    price: "$0.001",
    network: "eip155:8453",
    recipient: "0xYourWallet",
    extensions: {
      bazaar: {
        discoverable: true,
        category: "weather",
        tags: ["forecast", "temperature", "api"],
        description: "Real-time weather data API"
      }
    }
  }
}
```

## Testing Your Integration

### 1. Request Without Payment
```bash
curl https://localhost:3000/api/premium
```
**Expected**: HTTP 402 with `PAYMENT-REQUIRED` header

### 2. Inspect Payment Requirements
```bash
curl -I https://localhost:3000/api/premium
```
The `PAYMENT-REQUIRED` header contains Base64-encoded JSON with:
- Price in asset units
- Network identifier
- Recipient wallet
- Payment scheme

### 3. Use x402 Client for Full Flow
Test with the buyer client library to verify end-to-end payment flow.

## Production Checklist

- [ ] Change facilitator URL to mainnet
- [ ] Update network identifiers to mainnet
- [ ] Verify wallet address is correct
- [ ] Test with small amounts first
- [ ] Monitor payment receipts
- [ ] Set up error logging
- [ ] Configure rate limiting (optional)
- [ ] Enable Bazaar discovery (optional)

## Mainnet Migration

Simply update configuration:

```typescript
// From testnet
facilitatorUrl: "https://x402.org/facilitator",
network: "eip155:84532",  // Base Sepolia

// To mainnet
facilitatorUrl: "https://api.cdp.coinbase.com/platform/v2/x402",
network: "eip155:8453",   // Base Mainnet
```

## Error Handling

The middleware automatically handles:
- Invalid payment signatures
- Expired payment payloads
- Insufficient payment amounts
- Network mismatches

Custom error handling:

```typescript
app.use(paymentMiddleware(server, {
  // ... config
  onPaymentError: (error, req, res) => {
    console.error('Payment failed:', error);
    // Custom error response
  },
  onPaymentSuccess: (payment, req) => {
    console.log('Payment received:', payment.amount);
    // Log or track successful payments
  }
}));
```
