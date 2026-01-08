# Coinbase Developer Platform (CDP) x402 Documentation

## Overview

The Coinbase Developer Platform (CDP) hosts the primary x402 facilitator service, providing fee-free USDC payment verification and settlement on Base network. CDP offers comprehensive infrastructure for implementing the x402 payment protocol.

## CDP Facilitator

### Base URL

```
https://api.cdp.coinbase.com/platform/v2/x402
```

### Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/verify` | POST | Verify payment payload validity | Yes |
| `/settle` | POST | Submit payment to blockchain | Yes |
| `/discovery/resources` | GET | List x402-enabled services (Bazaar) | No |

### Authentication

CDP API authentication is required for verify and settle endpoints:

```bash
# Environment variables
CDP_API_KEY_ID=your_key_id
CDP_API_KEY_SECRET=your_key_secret
```

The discovery/list endpoint can be used without authentication.

## Verify Endpoint

### Purpose

Cryptographic validation of payment payloads without blockchain interaction. Response time: ~100ms.

### Request

```http
POST /platform/v2/x402/verify
Content-Type: application/json
Authorization: Bearer <CDP_TOKEN>
```

### Request Body

```json
{
  "x402Version": 1,
  "paymentPayload": {
    "x402Version": 1,
    "scheme": "exact",
    "network": "eip155:8453",
    "payload": {
      "from": "0xPayerAddress",
      "to": "0xRecipientAddress",
      "value": "1000000",
      "validAfter": 0,
      "validBefore": 1704844800,
      "nonce": "0x...",
      "signature": "0x..."
    }
  },
  "paymentRequirements": {
    "scheme": "exact",
    "network": "eip155:8453",
    "payTo": "0xRecipientAddress",
    "maxAmountRequired": "1000000",
    "resource": "/api/paid-endpoint",
    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  }
}
```

### Response

```json
{
  "isValid": true,
  "invalidReason": null
}
```

Or on failure:

```json
{
  "isValid": false,
  "invalidReason": "Insufficient balance"
}
```

## Settle Endpoint

### Purpose

Submit validated payment to blockchain and await confirmation. Response time: ~2 seconds on Base.

### Request

```http
POST /platform/v2/x402/settle
Content-Type: application/json
Authorization: Bearer <CDP_TOKEN>
```

### Request Body

Same structure as verify endpoint.

### Response

```json
{
  "success": true,
  "txID": "0x1234567890abcdef..."
}
```

The `txID` (transaction hash) can be used to verify the on-chain settlement.

## Discovery/Bazaar Endpoint

### Purpose

Query the x402 Bazaar to discover available paid services. Powers service discovery for AI agents and developers.

### Request

```http
GET /platform/v2/x402/discovery/resources
Accept: application/json
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Maximum number of services to return |
| `offset` | number | Pagination offset (default: 0) |
| `max_price` | string | Maximum price filter in atomic units |

### Example

```bash
curl "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?limit=10" \
  -H "Accept: application/json"
```

### Response

```json
{
  "resources": [
    {
      "url": "https://api.example.com/data",
      "description": "Premium data API",
      "methods": ["GET"],
      "price": "1000000",
      "network": "eip155:8453",
      "asset": "USDC"
    }
  ],
  "total": 100,
  "offset": 0,
  "limit": 10
}
```

## Network Support

### CAIP-2 Network Identifiers

CDP uses Chain Agnostic Improvement Proposal 2 (CAIP-2) format for network identification:

| Network | CAIP-2 Identifier | Status |
|---------|-------------------|--------|
| Base Mainnet | `eip155:8453` | Production |
| Base Sepolia | `eip155:84532` | Testnet |
| Solana Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | Production |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | Testnet |

### Supported Assets

| Asset | Network | Contract Address |
|-------|---------|-----------------|
| USDC | Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC | Base Sepolia | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| USDC | Solana | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

## Quickstart for Sellers

### 1. Install Dependencies

```bash
npm install @x402/express @x402/evm
```

### 2. Configure Middleware

```typescript
import express from "express";
import { paymentMiddleware } from "@x402/express";

const app = express();

// CDP Facilitator configuration
const facilitatorUrl = "https://api.cdp.coinbase.com/platform/v2/x402";

app.use(paymentMiddleware({
  facilitatorUrl,
  routes: {
    "/api/premium": {
      price: "$0.01",
      network: "eip155:8453",
      recipient: process.env.RECIPIENT_ADDRESS!,
      asset: "USDC"
    }
  }
}));

app.get("/api/premium", (req, res) => {
  res.json({ data: "Premium content" });
});
```

### 3. Register with Bazaar (Optional)

To make your endpoint discoverable:

```typescript
import { bazaarResourceServerExtension, declareDiscoveryExtension } from "@x402/express";

app.use(paymentMiddleware({
  facilitatorUrl,
  extensions: [bazaarResourceServerExtension],
  routes: {
    "/api/premium": {
      price: "$0.01",
      network: "eip155:8453",
      recipient: process.env.RECIPIENT_ADDRESS!,
      discovery: declareDiscoveryExtension({
        description: "Premium data API",
        inputSchema: { type: "object", properties: {} },
        outputSchema: { type: "object", properties: { data: { type: "string" } } }
      })
    }
  }
}));
```

## Quickstart for Buyers

### 1. Install Dependencies

```bash
# For fetch-based clients
npm install @x402/fetch @x402/evm

# For axios-based clients
npm install @x402/axios @x402/evm

# For Solana support
npm install @x402/svm
```

### 2. Create Payment Client

```typescript
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

// Create wallet account
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

// Setup x402 client
const client = new x402Client();
registerExactEvmScheme(client, { signer: account });

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Use payment-enabled fetch
const response = await fetchWithPayment("https://api.example.com/premium");
const data = await response.json();
```

### 3. Service Discovery

```typescript
// Discover available services from Bazaar
const discovery = await fetch(
  "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
);
const services = await discovery.json();

// Find services matching criteria
const affordableServices = services.resources.filter(
  s => parseInt(s.price) < 1000000 // Less than $1 USDC
);
```

## SDK Support

### TypeScript/JavaScript

Full SDK support via `@x402/*` packages:
- `@x402/core` - Core protocol types and utilities
- `@x402/evm` - EVM network support (Base)
- `@x402/svm` - Solana network support
- `@x402/fetch` - Fetch wrapper
- `@x402/axios` - Axios wrapper
- `@x402/express` - Express middleware
- `@x402/hono` - Hono middleware
- `@x402/next` - Next.js integration

### Go

```bash
go get github.com/coinbase/x402/go
```

### Python

```bash
pip install x402
```

Note: Python SDK is under development for x402 v2. For immediate v2 support, use TypeScript or Go.

## Testing

### Testnet Configuration

For testing, use the community testnet facilitator:

```typescript
const testConfig = {
  facilitatorUrl: "https://x402.org/facilitator",
  network: "eip155:84532", // Base Sepolia
  // or for Solana: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
};
```

### Getting Testnet USDC

1. Visit Circle's USDC faucet for Base Sepolia
2. Connect your testnet wallet
3. Request testnet USDC

## Fees

The CDP facilitator is **fee-free** for USDC settlements on Base network.

## FAQ

### What networks are supported?
CDP supports Base (EVM) mainnet/testnet and Solana mainnet/devnet.

### How fast is settlement?
Verification takes ~100ms. Settlement on Base takes ~2 seconds.

### Is there a minimum payment amount?
The protocol supports micropayments as low as $0.001 (1000 atomic units).

### How do I get my API listed in Bazaar?
Register the bazaar extension and include discovery metadata in your route configuration. The facilitator automatically catalogs your service when processing payments.

### Can I run my own facilitator?
Yes, x402 is an open protocol. However, CDP's hosted facilitator is recommended for ease of use and zero fees.

## Resources

- [CDP x402 Welcome](https://docs.cdp.coinbase.com/x402/welcome)
- [Quickstart for Sellers](https://docs.cdp.coinbase.com/x402/quickstart-for-sellers)
- [Quickstart for Buyers](https://docs.cdp.coinbase.com/x402/quickstart-for-buyers)
- [How x402 Works](https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works)
- [x402 Bazaar](https://docs.cdp.coinbase.com/x402/bazaar)
- [FAQ](https://docs.cdp.coinbase.com/x402/support/faq)
- [x402 GitHub](https://github.com/coinbase/x402)
- [x402 GitBook](https://x402.gitbook.io/x402)
