# x402 Deferred Payments

## Overview

The deferred payment scheme is a proposal by Cloudflare as part of the x402 Foundation initiative. It addresses limitations of immediate settlement for certain use cases where aggregated or delayed payments provide benefits.

## Why Deferred Payments?

### Limitations of Immediate Settlement

The standard x402 `exact` scheme settles payments on-chain immediately. While this works well for many cases, it has limitations:

1. **Dispute Handling**: No window for chargebacks or disputes
2. **Transaction Costs**: Many small transactions = many on-chain fees
3. **Latency**: Blockchain confirmation adds latency to requests
4. **Aggregation**: Repetitive requests could be batched for efficiency

### Deferred Scheme Benefits

- **Delayed Settlement**: Time window for dispute resolution
- **Aggregated Payments**: Multiple requests settle as single transaction
- **Lower Fees**: Batch settlement reduces per-transaction costs
- **Flexibility**: Supports traditional payment rails alongside crypto
- **Performance**: No blockchain wait during request/response

## How It Works

### Payment Flow

```
┌────────┐                    ┌────────┐                    ┌─────────────┐
│ Client │                    │ Server │                    │ Facilitator │
└────┬───┘                    └────┬───┘                    └──────┬──────┘
     │                             │                               │
     │  1. GET /resource           │                               │
     │─────────────────────────────>                               │
     │                             │                               │
     │  2. 402 Payment Required    │                               │
     │    scheme: "deferred"       │                               │
     │<─────────────────────────────                               │
     │                             │                               │
     │  3. Sign commitment         │                               │
     │  (HTTP Message Signature)   │                               │
     │                             │                               │
     │  4. GET /resource           │                               │
     │    Signature: ...           │                               │
     │─────────────────────────────>                               │
     │                             │                               │
     │                             │  5. Record commitment         │
     │                             │─────────────────────────────────>
     │                             │                               │
     │                             │  6. Commitment accepted       │
     │                             │<─────────────────────────────────
     │                             │                               │
     │  7. 200 OK + Resource       │                               │
     │<─────────────────────────────                               │
     │                             │                               │
     │                             │                               │
     │  ... Later (batch window)   │                               │
     │                             │                               │
     │                             │  8. Batch settle              │
     │                             │─────────────────────────────────>
     │                             │                               │
     │                             │  9. Settlement confirmation   │
     │                             │<─────────────────────────────────
     │                             │                               │
```

### Key Differences from `exact` Scheme

| Aspect | exact | deferred |
|--------|-------|----------|
| Settlement Timing | Immediate | Batched/Delayed |
| Signature Type | EIP-3009 Authorization | HTTP Message Signature |
| Dispute Window | None | Configurable |
| On-chain Transactions | Per request | Per batch |
| Payment Rails | Crypto only | Crypto + Traditional |

## HTTP Message Signatures

The deferred scheme uses HTTP Message Signatures (RFC 9421) for cryptographic commitment without immediate blockchain interaction.

### Signature Components

```
POST /resource HTTP/1.1
Host: api.example.com
Date: Thu, 08 Jan 2026 12:00:00 GMT
Content-Type: application/json
Signature-Input: sig1=("@method" "@path" "date" "content-type"); \
  keyid="client-key-001"; alg="ecdsa-p256-sha256"
Signature: sig1=:base64signature:
X-Payment-Commitment: eyJ...base64...}
```

### Commitment Payload

```json
{
  "x402Version": 2,
  "scheme": "deferred",
  "commitment": {
    "amount": "1000",
    "asset": "USDC",
    "from": "0xClientWallet",
    "to": "0xServerWallet",
    "validUntil": 1704844800,
    "settlementWindow": 86400,
    "batchId": "batch-2026-01-08"
  },
  "signature": "..."
}
```

### Commitment Fields

| Field | Description |
|-------|-------------|
| `amount` | Total committed amount |
| `asset` | Payment asset (USDC) |
| `from` | Payer wallet address |
| `to` | Recipient wallet address |
| `validUntil` | Commitment expiration timestamp |
| `settlementWindow` | Seconds before settlement required |
| `batchId` | Identifier for batch grouping |

## Settlement Options

### 1. Stablecoin Settlement

Traditional blockchain settlement, but batched:

```typescript
// Facilitator aggregates commitments
const batch = {
  commitments: [
    { from: "0xA", to: "0xB", amount: "1000" },
    { from: "0xA", to: "0xB", amount: "500" },
    { from: "0xA", to: "0xB", amount: "2000" }
  ],
  totalAmount: "3500"
};

// Single on-chain transaction settles all
await facilitator.settleBatch(batch);
```

### 2. Traditional Payment Rails

Deferred scheme can settle via fiat:

```typescript
// Alternative settlement path
const settlement = {
  method: "ach",
  commitments: batch.commitments,
  bankAccount: "...",
  scheduledDate: "2026-01-09"
};

await facilitator.settleTraditional(settlement);
```

## Use Cases

### High-Frequency APIs

APIs with many requests per second benefit from aggregation:

```typescript
// Instead of 1000 on-chain transactions per day
// Deferred scheme: 1 batch settlement per day

routes: {
  "/api/data": {
    price: "$0.001",
    scheme: "deferred",
    batchWindow: 86400, // 24 hours
    network: "eip155:8453",
    recipient: "0xWallet"
  }
}
```

### Subscription-Like Patterns

Aggregate usage over billing period:

```typescript
// Track usage over billing period
const usageTracking = {
  period: "monthly",
  maxCommitment: "$100.00",
  settlementDay: 1 // First of month
};
```

### Dispute-Sensitive Services

Services needing chargeback capability:

```typescript
// Allow disputes before settlement
const disputeConfig = {
  disputeWindow: 172800, // 48 hours
  settlementDelay: 259200, // 72 hours
  arbitrationContact: "disputes@example.com"
};
```

## Implementation Status

### Current Status

The deferred scheme is **proposed** by Cloudflare as part of x402 Foundation work. It is not yet part of the core x402 specification.

### Cloudflare Integration

Cloudflare is implementing deferred payments in:

- **Cloudflare Workers**: Native x402 support
- **Agents SDK**: AI agent payment handling
- **MCP Servers**: Tool payment marking

### Roadmap

1. **Specification**: Formal RFC for deferred scheme
2. **Reference Implementation**: Open-source facilitator support
3. **SDK Integration**: Client/server library support
4. **Production Deployment**: Cloudflare Workers availability

## Security Considerations

### Commitment Verification

- Signatures must be cryptographically valid
- Timestamps prevent replay attacks
- Commitment amounts must be pre-authorized

### Settlement Guarantees

- Commitments are legally binding
- Facilitator acts as escrow
- Dispute resolution process required

### Risk Management

```typescript
// Sellers should implement credit limits
const creditPolicy = {
  maxOutstandingCommitment: "$1000.00",
  requireUpfrontDeposit: true,
  depositAmount: "$100.00"
};
```

## Comparison with exact Scheme

### When to Use exact

- Single high-value transactions
- One-time API calls
- Immediate settlement required
- No dispute mechanism needed

### When to Use deferred

- High-frequency API usage
- Subscription-like patterns
- Dispute window required
- Cost optimization priority

## Example Configuration

### Server (Seller) Setup

```typescript
import { paymentMiddleware } from "@x402/express";

app.use(paymentMiddleware(server, {
  facilitatorUrl: "https://api.cdp.coinbase.com/platform/v2/x402",
  routes: {
    "/api/high-frequency": {
      price: "$0.0001",
      scheme: "deferred",
      network: "eip155:8453",
      recipient: "0xWallet",
      deferredConfig: {
        batchWindow: 3600,      // 1 hour batches
        maxCommitment: 10000,   // Max $10 per batch
        disputeWindow: 7200     // 2 hour dispute window
      }
    },
    "/api/instant": {
      price: "$0.01",
      scheme: "exact",         // Immediate settlement
      network: "eip155:8453",
      recipient: "0xWallet"
    }
  }
}));
```

### Client (Buyer) Setup

```typescript
import { x402Client } from "@x402/core/client";
import { registerDeferredScheme } from "@x402/deferred/client";

const client = new x402Client();
registerDeferredScheme(client, {
  signer: privateKey,
  maxCommitment: "$100.00",
  autoSettle: true
});
```

## Resources

- [Cloudflare x402 Foundation Announcement](https://blog.cloudflare.com/x402/)
- [HTTP Message Signatures RFC 9421](https://www.rfc-editor.org/rfc/rfc9421.html)
- [x402 GitHub Repository](https://github.com/coinbase/x402)
- [x402 Foundation](https://x402.org)

## Notes

- Deferred payments are a **proposed** extension, not yet standard
- Implementation details may change before release
- Monitor x402 Foundation announcements for updates
- Cloudflare Workers will likely be first production environment
