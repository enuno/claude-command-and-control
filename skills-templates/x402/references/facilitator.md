# x402 Facilitator

## Overview

The facilitator is an optional but recommended service that streamlines payment verification and settlement between clients and servers. It eliminates the need for servers to maintain direct blockchain connectivity or implement their own payment verification logic.

## Key Responsibilities

1. **Payment Verification** - Confirms that client payment payloads meet server requirements
2. **Blockchain Settlement** - Submits validated payments to the blockchain on behalf of servers
3. **Response Delivery** - Returns verification and settlement results enabling servers to fulfill requests

**Important**: The facilitator does not custody funds. It executes transactions based on signed client payloads.

## Available Facilitators

### CDP (Coinbase Developer Platform)

| Environment | URL |
|-------------|-----|
| Testnet | `https://x402.org/facilitator` |
| Mainnet | `https://api.cdp.coinbase.com/platform/v2/x402` |

**Features:**
- Fee-free USDC settlement on Base
- Automatic gas sponsorship
- Bazaar integration for service discovery

### PayAI

Alternative facilitator supporting multiple networks:
- Solana
- Base
- Polygon
- Additional EVM chains

## API Endpoints

### POST /verify

Validates a payment signature against requirements.

**Request:**
```json
{
  "x402Version": 2,
  "paymentRequirements": {
    "scheme": "exact",
    "network": "eip155:8453",
    "maxAmountRequired": "10000",
    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "recipient": "0xSellerWallet"
  },
  "paymentPayload": {
    "x402Version": 2,
    "scheme": "exact",
    "network": "eip155:8453",
    "payload": {
      "signature": "0x...",
      "authorization": {
        "from": "0xBuyerWallet",
        "to": "0xSellerWallet",
        "value": "10000",
        "validAfter": 0,
        "validBefore": 1700000000,
        "nonce": "0x..."
      }
    }
  }
}
```

**Response (Success):**
```json
{
  "valid": true,
  "invalidReason": null
}
```

**Response (Failure):**
```json
{
  "valid": false,
  "invalidReason": "Signature verification failed"
}
```

### POST /settle

Submits a verified payment for blockchain settlement.

**Request:**
```json
{
  "x402Version": 2,
  "paymentPayload": {
    "x402Version": 2,
    "scheme": "exact",
    "network": "eip155:8453",
    "payload": {
      "signature": "0x...",
      "authorization": {
        "from": "0xBuyerWallet",
        "to": "0xSellerWallet",
        "value": "10000",
        "validAfter": 0,
        "validBefore": 1700000000,
        "nonce": "0x..."
      }
    }
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "network": "eip155:8453",
  "settlementTimestamp": 1700000000
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Insufficient balance",
  "errorCode": "INSUFFICIENT_FUNDS"
}
```

## Verification Process

```
┌────────┐    ┌────────┐    ┌─────────────┐
│ Client │    │ Server │    │ Facilitator │
└────┬───┘    └────┬───┘    └──────┬──────┘
     │             │               │
     │ Request     │               │
     │────────────>│               │
     │             │               │
     │ 402 + Req   │               │
     │<────────────│               │
     │             │               │
     │ Sign        │               │
     │             │               │
     │ Req + Sig   │               │
     │────────────>│               │
     │             │               │
     │             │ POST /verify  │
     │             │──────────────>│
     │             │               │
     │             │ valid: true   │
     │             │<──────────────│
     │             │               │
```

## Settlement Process

```
┌────────┐    ┌────────┐    ┌─────────────┐    ┌────────────┐
│ Client │    │ Server │    │ Facilitator │    │ Blockchain │
└────┬───┘    └────┬───┘    └──────┬──────┘    └─────┬──────┘
     │             │               │                  │
     │             │ POST /settle  │                  │
     │             │──────────────>│                  │
     │             │               │                  │
     │             │               │ Submit tx        │
     │             │               │─────────────────>│
     │             │               │                  │
     │             │               │ tx confirmed     │
     │             │               │<─────────────────│
     │             │               │                  │
     │             │ txHash        │                  │
     │             │<──────────────│                  │
     │             │               │                  │
     │ 200 + Data  │               │                  │
     │<────────────│               │                  │
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_SIGNATURE` | Payment signature verification failed |
| `INSUFFICIENT_FUNDS` | Payer wallet has insufficient balance |
| `EXPIRED_AUTHORIZATION` | Payment validity window has passed |
| `INVALID_NETWORK` | Unsupported network identifier |
| `INVALID_SCHEME` | Unsupported payment scheme |
| `ALREADY_USED` | Payment authorization already settled |
| `AMOUNT_MISMATCH` | Payment amount doesn't match requirement |
| `RECIPIENT_MISMATCH` | Payment recipient doesn't match requirement |

## Using Without Facilitator

Servers can handle verification and settlement directly:

```typescript
// Direct verification (requires blockchain connectivity)
import { verifyPaymentSignature } from "@x402/evm/verify";

const isValid = await verifyPaymentSignature({
  signature: paymentPayload.payload.signature,
  authorization: paymentPayload.payload.authorization,
  chainId: 8453, // Base
});

// Direct settlement (requires wallet and gas)
import { settlePayment } from "@x402/evm/settle";

const txHash = await settlePayment({
  paymentPayload,
  wallet: serverWallet,
  provider: ethersProvider,
});
```

**Considerations for direct handling:**
- Must maintain blockchain node connection
- Must pay gas fees
- Must handle transaction monitoring
- Must implement replay protection

## Custom Facilitator Implementation

To build a custom facilitator:

```typescript
import express from "express";
import { createVerifier, createSettler } from "@x402/core/facilitator";

const app = express();

const verifier = createVerifier({
  supportedSchemes: ["exact"],
  supportedNetworks: ["eip155:8453", "eip155:84532"],
});

const settler = createSettler({
  privateKey: process.env.FACILITATOR_PRIVATE_KEY,
  rpcUrls: {
    "eip155:8453": "https://mainnet.base.org",
    "eip155:84532": "https://sepolia.base.org",
  },
});

app.post("/verify", async (req, res) => {
  const result = await verifier.verify(req.body);
  res.json(result);
});

app.post("/settle", async (req, res) => {
  const result = await settler.settle(req.body);
  res.json(result);
});
```

## Best Practices

1. **Use CDP for production** - Free settlement, reliable infrastructure
2. **Test on testnet first** - Use `x402.org/facilitator` for development
3. **Handle errors gracefully** - Check response status before proceeding
4. **Log transactions** - Keep records of settlement hashes
5. **Monitor settlements** - Verify funds arrive in recipient wallet
