# x402 MCP Server Integration

## Overview

The x402 protocol enables automated payment handling for AI agents accessing paid APIs through Model Context Protocol (MCP) servers. This integration allows Claude Desktop and other MCP clients to seamlessly process payments without manual intervention.

## Architecture

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

## Payment Flow

1. **Request**: Claude makes request through MCP server
2. **402 Detection**: MCP server receives HTTP 402 response with `PAYMENT-REQUIRED` header
3. **Parsing**: Extracts payment requirements from response
4. **Signing**: Uses registered wallet scheme (EVM or SVM) to create payment payload
5. **Retry**: Resends request with `PAYMENT-SIGNATURE` header
6. **Verification**: x402 API validates payment and returns data
7. **Response**: MCP server returns data to Claude

## Prerequisites

- Node.js v20+
- pnpm v10
- Ethereum wallet with USDC or Solana wallet with USDC
- Claude Desktop with MCP support

## Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@x402/axios": "^2.0.0",
    "@x402/core": "^2.0.0",
    "@x402/evm": "^2.0.0",
    "@x402/svm": "^2.0.0",
    "viem": "^2.0.0",
    "@solana/kit": "^2.0.0"
  }
}
```

## Environment Configuration

```bash
# At least one required
EVM_PRIVATE_KEY=0x...your_evm_private_key
SVM_PRIVATE_KEY=...your_solana_private_key_base58

# API configuration
RESOURCE_SERVER_URL=https://api.example.com
ENDPOINT_PATH=/weather
```

## MCP Server Implementation

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { wrapAxiosWithPayment } from "@x402/axios";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { registerExactSvmScheme } from "@x402/svm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Initialize x402 client
const x402 = new x402Client();

// Register EVM signer if available
if (process.env.EVM_PRIVATE_KEY) {
  const evmSigner = privateKeyToAccount(
    process.env.EVM_PRIVATE_KEY as `0x${string}`
  );
  registerExactEvmScheme(x402, { signer: evmSigner });
}

// Register Solana signer if available
if (process.env.SVM_PRIVATE_KEY) {
  const svmSigner = Keypair.fromSecretKey(
    bs58.decode(process.env.SVM_PRIVATE_KEY)
  );
  registerExactSvmScheme(x402, { signer: svmSigner });
}

// Create payment-enabled HTTP client
const httpClient = wrapAxiosWithPayment(axios, x402);

// Create MCP server
const server = new Server(
  {
    name: "x402-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_paid_data",
      description: "Fetch data from a paid API endpoint using x402",
      inputSchema: {
        type: "object",
        properties: {
          endpoint: {
            type: "string",
            description: "API endpoint path",
          },
          params: {
            type: "object",
            description: "Query parameters",
          },
        },
        required: ["endpoint"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_paid_data") {
    const baseUrl = process.env.RESOURCE_SERVER_URL;
    const url = `${baseUrl}${args.endpoint}`;

    try {
      const response = await httpClient.get(url, {
        params: args.params,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Claude Desktop Configuration

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "x402-payments": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "EVM_PRIVATE_KEY": "0x...",
        "RESOURCE_SERVER_URL": "https://api.example.com"
      }
    }
  }
}
```

## Example: Weather API

### Server Tool Definition

```typescript
{
  name: "get_weather",
  description: "Get weather data for a location (costs $0.001 per request)",
  inputSchema: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City name or coordinates"
      }
    },
    required: ["location"]
  }
}
```

### Tool Implementation

```typescript
if (name === "get_weather") {
  const response = await httpClient.get(
    `${process.env.RESOURCE_SERVER_URL}/weather`,
    {
      params: { location: args.location }
    }
  );

  return {
    content: [{
      type: "text",
      text: `Weather for ${args.location}:\n${JSON.stringify(response.data, null, 2)}`
    }]
  };
}
```

### Claude Interaction

```
User: What's the weather in San Francisco?

Claude: I'll check the weather for San Francisco using the paid weather API.

[Tool call: get_weather with location="San Francisco"]

The current weather in San Francisco:
- Temperature: 68°F
- Conditions: Partly cloudy
- Humidity: 72%
- Wind: 12 mph W
```

## Multi-Network Support

The MCP server automatically routes payments based on the API's network requirements:

```typescript
// Register both EVM and Solana signers
registerExactEvmScheme(x402, { signer: evmSigner });
registerExactSvmScheme(x402, { signer: svmSigner });

// Client handles network selection automatically
// Base API → Uses EVM signer
// Solana API → Uses SVM signer
```

## Error Handling

```typescript
server.setRequestHandler("tools/call", async (request) => {
  try {
    // ... tool implementation
  } catch (error) {
    // Payment-specific errors
    if (error.code === "INSUFFICIENT_FUNDS") {
      return {
        content: [{
          type: "text",
          text: "Payment failed: Insufficient USDC balance in wallet"
        }],
        isError: true
      };
    }

    if (error.code === "SCHEME_NOT_REGISTERED") {
      return {
        content: [{
          type: "text",
          text: "Payment failed: No wallet configured for this network"
        }],
        isError: true
      };
    }

    // Generic error
    return {
      content: [{
        type: "text",
        text: `Request failed: ${error.message}`
      }],
      isError: true
    };
  }
});
```

## Security Considerations

1. **Private Key Storage**: Never commit private keys. Use environment variables or secret managers.

2. **Wallet Funding**: Only fund MCP wallets with amounts needed for expected usage.

3. **Spending Limits**: Consider implementing daily/monthly spending limits in the MCP server.

4. **Audit Logging**: Log all payment transactions for monitoring.

```typescript
// Example spending limit
const DAILY_LIMIT = 1.00; // $1.00 USD
let dailySpend = 0;

async function makePayment(amount: number) {
  if (dailySpend + amount > DAILY_LIMIT) {
    throw new Error("Daily spending limit exceeded");
  }
  dailySpend += amount;
  // ... proceed with payment
}
```

## Testing

### Local Testing

```bash
# Set test environment
export EVM_PRIVATE_KEY=0x...testnet_key
export RESOURCE_SERVER_URL=https://testnet-api.example.com

# Run MCP server
node index.js
```

### With MCP Inspector

```bash
npx @modelcontextprotocol/inspector node index.js
```

## Deployment Checklist

- [ ] Use mainnet private keys
- [ ] Update RESOURCE_SERVER_URL to production
- [ ] Fund wallet with mainnet USDC
- [ ] Set appropriate spending limits
- [ ] Enable audit logging
- [ ] Test payment flow end-to-end
- [ ] Monitor wallet balance
