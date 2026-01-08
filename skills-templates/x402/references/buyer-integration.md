# x402 Buyer Integration Guide

## Overview

This guide walks through how to use x402 to interact with services that require payment. The x402 client libraries handle payment discovery, signing, and retry automatically.

## Prerequisites

- Crypto wallet with USDC (EVM-compatible or Solana)
- Node.js and npm, Go, or Python with pip
- Access to an x402-enabled service

## Installation

### Node.js (Fetch)
```bash
npm install @x402/fetch @x402/evm
```

### Node.js (Axios)
```bash
npm install @x402/axios @x402/evm
```

### Solana Support
```bash
npm install @x402/svm
```

### Go
```bash
go get github.com/coinbase/x402/go
```

### Python
```bash
pip install x402  # Uses v1 patterns
```

## Wallet Signer Setup

### TypeScript/Viem (EVM)

```typescript
import { privateKeyToAccount } from "viem/accounts";

// Load from environment variable
const signer = privateKeyToAccount(
  process.env.EVM_PRIVATE_KEY as `0x${string}`
);
```

### Go (EVM)

```go
import evmsigners "github.com/coinbase/x402/go/pkg/evm/signers"

signer, err := evmsigners.NewClientSignerFromPrivateKey(
    os.Getenv("EVM_PRIVATE_KEY"),
)
if err != nil {
    log.Fatal(err)
}
```

### Python (EVM)

```python
from eth_account import Account
import os

account = Account.from_key(os.getenv("PRIVATE_KEY"))
```

### Solana Signer

```typescript
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const svmSigner = Keypair.fromSecretKey(
  bs58.decode(process.env.SVM_PRIVATE_KEY!)
);
```

## Making Paid Requests

### Fetch Implementation

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

// Setup signer
const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);

// Initialize x402 client
const client = new x402Client();
registerExactEvmScheme(client, { signer });

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Make paid request - handles 402 automatically!
async function getPaidData() {
  const response = await fetchWithPayment("https://api.example.com/paid-endpoint", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}
```

### Axios Implementation

```typescript
import axios from "axios";
import { wrapAxiosWithPayment } from "@x402/axios";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";

const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);

const client = new x402Client();
registerExactEvmScheme(client, { signer });

// Create wrapped axios instance
const axiosWithPayment = wrapAxiosWithPayment(axios, client);

// Make paid request
async function fetchPaidResource() {
  const response = await axiosWithPayment.get("https://api.example.com/paid");
  return response.data;
}
```

### Go Implementation

```go
package main

import (
    "fmt"
    "io"
    "net/http"
    "os"

    "github.com/coinbase/x402/go/pkg/x402"
    x402http "github.com/coinbase/x402/go/pkg/http"
    evmscheme "github.com/coinbase/x402/go/pkg/evm/scheme"
    evmsigners "github.com/coinbase/x402/go/pkg/evm/signers"
)

func main() {
    // Create signer
    signer, err := evmsigners.NewClientSignerFromPrivateKey(
        os.Getenv("EVM_PRIVATE_KEY"),
    )
    if err != nil {
        panic(err)
    }

    // Initialize client
    client := x402.NewClient()
    evmscheme.RegisterExactEvmScheme(client, signer)

    // Wrap HTTP client
    httpClient := x402http.WrapHTTPClientWithPayment(http.DefaultClient, client)

    // Make paid request
    resp, err := httpClient.Get("https://api.example.com/paid-endpoint")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}
```

## Multi-Network Support

Register multiple schemes to handle different blockchains:

```typescript
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { registerExactSvmScheme } from "@x402/svm/exact/client";

const client = new x402Client();

// Register EVM signer (Base, Ethereum, etc.)
registerExactEvmScheme(client, { signer: evmSigner });

// Register Solana signer
registerExactSvmScheme(client, { signer: svmSigner });

const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Client automatically selects correct scheme based on 402 response
const baseResponse = await fetchWithPayment("https://base-api.com/endpoint");
const solanaResponse = await fetchWithPayment("https://solana-api.com/endpoint");
```

## Service Discovery (Bazaar)

Query the x402 Bazaar to find available paid services:

```typescript
async function discoverServices() {
  const response = await fetch(
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
  );
  const services = await response.json();

  // Filter by category
  const weatherApis = services.filter(s => s.category === "weather");

  // Filter by price
  const cheapApis = services.filter(s => parseFloat(s.price) < 0.01);

  return services;
}
```

## Error Handling

```typescript
import { X402Error } from "@x402/core";

async function safePaidRequest(url: string) {
  try {
    const response = await fetchWithPayment(url);
    return await response.json();
  } catch (error) {
    if (error instanceof X402Error) {
      switch (error.code) {
        case 'SCHEME_NOT_REGISTERED':
          console.error('Payment scheme not registered for this network');
          break;
        case 'INSUFFICIENT_FUNDS':
          console.error('Wallet has insufficient USDC balance');
          break;
        case 'PAYMENT_SIGNATURE_FAILED':
          console.error('Failed to sign payment');
          break;
        case 'PAYMENT_VERIFICATION_FAILED':
          console.error('Server rejected payment');
          break;
        default:
          console.error('Payment error:', error.message);
      }
    }
    throw error;
  }
}
```

## Environment Variables

```bash
# EVM (Base, Ethereum)
EVM_PRIVATE_KEY=0x...

# Solana
SVM_PRIVATE_KEY=...base58encoded...

# Optional: Custom facilitator
X402_FACILITATOR_URL=https://custom-facilitator.com
```

## How It Works

1. **Initial Request**: Client sends normal HTTP request
2. **402 Response**: Server returns HTTP 402 with `PAYMENT-REQUIRED` header
3. **Parse Requirements**: Client extracts price, network, recipient
4. **Sign Payment**: Client signs payment payload with wallet
5. **Retry Request**: Client sends request with `PAYMENT-SIGNATURE` header
6. **Verification**: Server verifies payment via facilitator
7. **Settlement**: Payment is settled on blockchain
8. **Response**: Server returns requested resource with `PAYMENT-RESPONSE` header

All of this is handled automatically by the wrapped fetch/axios clients.

## Testing

### Testnet Configuration

```typescript
// Use testnet wallet with testnet USDC
const signer = privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY as `0x${string}`);

// Request testnet endpoints (Base Sepolia)
const response = await fetchWithPayment("https://testnet-api.example.com/paid");
```

### Get Testnet USDC

1. Base Sepolia: Use Coinbase faucet or bridge from Sepolia
2. Solana Devnet: Use `solana airdrop` and swap for USDC

## Best Practices

1. **Secure Key Storage**: Use environment variables or secret managers
2. **Network Matching**: Ensure wallet has funds on correct network
3. **Error Recovery**: Implement retry logic for transient failures
4. **Balance Monitoring**: Check wallet balance before batch operations
5. **Logging**: Log payment transactions for auditing

## Complete Example

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  // Setup
  const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  // Discover services
  const discovery = await fetch(
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
  );
  const services = await discovery.json();
  console.log(`Found ${services.length} paid services`);

  // Use a paid service
  const weatherApi = services.find(s => s.category === "weather");
  if (weatherApi) {
    const weather = await fetchWithPayment(weatherApi.url);
    const data = await weather.json();
    console.log("Weather data:", data);
  }
}

main().catch(console.error);
```
