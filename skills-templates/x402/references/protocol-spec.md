# x402 Protocol Specification

## Overview

x402 is an open payment standard that enables services to charge for access to their APIs and content directly over HTTP using the `402 Payment Required` status code.

## HTTP 402 Status Code

The HTTP 402 status code was reserved in the original HTTP specification for future use with digital payment systems. x402 activates this status code for API-native cryptocurrency payments.

## Protocol Flow

```
┌────────┐                    ┌────────┐                    ┌─────────────┐
│ Client │                    │ Server │                    │ Facilitator │
└────┬───┘                    └────┬───┘                    └──────┬──────┘
     │                             │                               │
     │  1. GET /paid-resource      │                               │
     │─────────────────────────────>                               │
     │                             │                               │
     │  2. 402 Payment Required    │                               │
     │    PAYMENT-REQUIRED: {...}  │                               │
     │<─────────────────────────────                               │
     │                             │                               │
     │  3. Sign payment payload    │                               │
     │  (wallet signature)         │                               │
     │                             │                               │
     │  4. GET /paid-resource      │                               │
     │    PAYMENT-SIGNATURE: {...} │                               │
     │─────────────────────────────>                               │
     │                             │                               │
     │                             │  5. POST /verify              │
     │                             │─────────────────────────────────>
     │                             │                               │
     │                             │  6. Verification result       │
     │                             │<─────────────────────────────────
     │                             │                               │
     │                             │  7. POST /settle              │
     │                             │─────────────────────────────────>
     │                             │                               │
     │                             │  8. Settlement confirmation   │
     │                             │<─────────────────────────────────
     │                             │                               │
     │  9. 200 OK + Resource       │                               │
     │    PAYMENT-RESPONSE: {...}  │                               │
     │<─────────────────────────────                               │
     │                             │                               │
```

## HTTP Headers

### PAYMENT-REQUIRED (Server → Client)

Sent with HTTP 402 response. Contains Base64-encoded JSON with payment requirements.

**Format:**
```json
{
  "x402Version": 2,
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "maxAmountRequired": "10000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "recipient": "0x...",
      "extra": {
        "name": "USDC",
        "decimals": 6
      }
    }
  ],
  "timeout": 300,
  "description": "Access to premium API",
  "mimeType": "application/json"
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `x402Version` | number | Protocol version (currently 2) |
| `accepts` | array | List of accepted payment methods |
| `accepts[].scheme` | string | Payment scheme identifier |
| `accepts[].network` | string | CAIP-2 network identifier |
| `accepts[].maxAmountRequired` | string | Maximum amount in asset units |
| `accepts[].asset` | string | Token contract address |
| `accepts[].recipient` | string | Payment recipient address |
| `timeout` | number | Payment validity window (seconds) |
| `description` | string | Human-readable description |
| `mimeType` | string | Expected response content type |

### PAYMENT-SIGNATURE (Client → Server)

Sent with retry request after receiving 402. Contains Base64-encoded signed payment payload.

**Format:**
```json
{
  "x402Version": 2,
  "scheme": "exact",
  "network": "eip155:8453",
  "payload": {
    "signature": "0x...",
    "authorization": {
      "from": "0x...",
      "to": "0x...",
      "value": "10000",
      "validAfter": 0,
      "validBefore": 1700000000,
      "nonce": "0x..."
    }
  }
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `x402Version` | number | Protocol version |
| `scheme` | string | Payment scheme used |
| `network` | string | Network for payment |
| `payload` | object | Scheme-specific signed data |

### PAYMENT-RESPONSE (Server → Client)

Sent with successful response. Contains Base64-encoded settlement confirmation.

**Format:**
```json
{
  "x402Version": 2,
  "scheme": "exact",
  "network": "eip155:8453",
  "transactionHash": "0x...",
  "settlementTimestamp": 1700000000,
  "status": "settled"
}
```

## Encoding

All headers use Base64 encoding for the JSON payload:

```javascript
// Encoding
const header = Buffer.from(JSON.stringify(payload)).toString('base64');

// Decoding
const payload = JSON.parse(Buffer.from(header, 'base64').toString());
```

## Network Identifiers (CAIP-2)

The protocol uses CAIP-2 chain identifiers:

| Network | CAIP-2 Identifier |
|---------|-------------------|
| Ethereum Mainnet | `eip155:1` |
| Base Mainnet | `eip155:8453` |
| Base Sepolia | `eip155:84532` |
| Solana Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` |

## Payment Schemes

### exact

The primary scheme for exact payment amounts. Uses EIP-3009 for EVM chains.

**EVM (exact-evm):**
- Uses USDC's `transferWithAuthorization` function
- Gasless for payers (gas paid by facilitator)
- Signature authorizes specific transfer amount

**Solana (exact-svm):**
- Uses SPL Token transfers
- Transaction signed by payer's keypair

## Supported Assets

| Asset | Network | Contract Address |
|-------|---------|------------------|
| USDC | Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC | Base Sepolia | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| USDC | Solana | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

## Error Responses

| Status | Meaning |
|--------|---------|
| 402 | Payment required - inspect PAYMENT-REQUIRED header |
| 400 | Invalid payment signature or payload |
| 402 | Payment verification failed |
| 402 | Payment already used (replay attack) |
| 503 | Facilitator unavailable |

## Security Considerations

1. **Replay Protection**: Each payment authorization includes nonce and validity window
2. **Amount Verification**: Facilitator verifies payment amount matches requirement
3. **Recipient Verification**: Payment can only go to specified recipient
4. **Signature Verification**: Cryptographic verification of payer authorization
5. **Time Bounds**: Payments have limited validity windows

## Stateless Design

The protocol is fully stateless:
- No session tokens or cookies required
- No account creation needed
- Each request is independent
- Wallet address serves as identity

## Compatibility

x402 is:
- HTTP-native (works with any HTTP client/server)
- Vendor-agnostic (any facilitator implementation)
- Blockchain-agnostic (EVM, Solana, extensible)
- Client-agnostic (browsers, servers, AI agents)
