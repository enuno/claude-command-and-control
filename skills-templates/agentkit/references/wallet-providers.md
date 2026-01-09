# AgentKit Wallet Providers Reference

## Overview

AgentKit supports multiple wallet providers for different use cases and blockchain networks. This reference covers detailed configuration and usage for each provider.

## EVM Wallet Providers

### CdpWalletProvider

The standard CDP API Wallet provider. Recommended for most use cases.

```typescript
import { CdpWalletProvider } from "@coinbase/agentkit";

// Create new wallet
const walletProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
});

// Restore from exported data
const walletProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
  cdpWalletData: previouslyExportedData,
});

// Export for persistence
const walletData = await walletProvider.exportWallet();
// Store walletData securely (encrypted database, etc.)
```

**Features:**
- Automatic key management via CDP
- Easy export/import for persistence
- Supports all EVM networks
- Gas estimation and management

### CdpV2EvmWalletProvider

Newer CDP V2 API interface with additional capabilities.

```typescript
import { CdpV2EvmWalletProvider } from "@coinbase/agentkit";

const walletProvider = await CdpV2EvmWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
});
```

**When to use:**
- When V2 API features are needed
- For newer integrations

### SmartWalletProvider

CDP Smart Wallets with account abstraction (ERC-4337).

```typescript
import { SmartWalletProvider, CdpWalletProvider } from "@coinbase/agentkit";

// First create a signer (any wallet provider)
const signer = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
});

// Create smart wallet from signer
const smartWallet = await SmartWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
  signer: signer,
});
```

**Features:**
- Gasless transactions (sponsored gas)
- Batch transactions
- Social recovery options
- Account abstraction (ERC-4337)

### ViemWalletProvider

For projects already using the Viem library.

```typescript
import { ViemWalletProvider } from "@coinbase/agentkit";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const account = privateKeyToAccount(PRIVATE_KEY);
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

const walletProvider = new ViemWalletProvider(client);
```

**When to use:**
- Existing Viem-based projects
- Need direct private key control
- Custom RPC configurations

### PrivyWalletProvider

Integration with Privy embedded wallets for user authentication.

```typescript
import { PrivyWalletProvider } from "@coinbase/agentkit";

const walletProvider = new PrivyWalletProvider({
  appId: process.env.PRIVY_APP_ID,
  networkId: "base-sepolia",
});

// Authenticate user (typically via OAuth)
await walletProvider.authenticate();
```

**When to use:**
- User-facing applications
- Social login authentication
- Embedded wallet UX

### ZeroDevWalletProvider

ZeroDev smart account integration.

```typescript
import { ZeroDevWalletProvider } from "@coinbase/agentkit";

const walletProvider = new ZeroDevWalletProvider({
  projectId: process.env.ZERODEV_PROJECT_ID,
  networkId: "base-sepolia",
});
```

**Features:**
- Paymaster support (sponsored gas)
- Session keys
- Modular accounts

## SVM (Solana) Wallet Providers

### CdpV2SolanaWalletProvider

CDP V2 API for Solana network.

```typescript
import { CdpV2SolanaWalletProvider } from "@coinbase/agentkit";

const walletProvider = await CdpV2SolanaWalletProvider.configureWithWallet({
  networkId: "solana-devnet", // or "solana-mainnet"
});

// Get wallet address
const address = walletProvider.getAddress();
```

**Supported Networks:**
- `solana-mainnet` - Production
- `solana-devnet` - Testing

### SolanaKeypairWalletProvider

Direct keypair-based Solana wallet.

```typescript
import { SolanaKeypairWalletProvider } from "@coinbase/agentkit";
import { Keypair } from "@solana/web3.js";

// From existing keypair
const keypair = Keypair.fromSecretKey(secretKeyArray);
const walletProvider = new SolanaKeypairWalletProvider(keypair, "solana-devnet");

// Generate new keypair
const newKeypair = Keypair.generate();
const walletProvider = new SolanaKeypairWalletProvider(newKeypair, "solana-devnet");
```

**When to use:**
- Direct key management
- Existing Solana workflows
- Development/testing

## Python Wallet Providers

### CdpWalletProvider (Python)

```python
from coinbase_agentkit import CdpWalletProvider

# Create new wallet
wallet_provider = CdpWalletProvider.configure_with_wallet(
    network_id="base-sepolia"
)

# Restore from data
wallet_provider = CdpWalletProvider.configure_with_wallet(
    network_id="base-sepolia",
    cdp_wallet_data=previous_data
)

# Export
wallet_data = wallet_provider.export_wallet()
```

### CdpV2SolanaWalletProvider (Python)

```python
from coinbase_agentkit import CdpV2SolanaWalletProvider

wallet_provider = CdpV2SolanaWalletProvider.configure_with_wallet(
    network_id="solana-devnet"
)
```

## Wallet Provider Interface

All wallet providers implement a common interface:

```typescript
interface WalletProvider {
  // Get wallet address
  getAddress(): string;

  // Get network ID
  getNetworkId(): string;

  // Sign message
  signMessage(message: string): Promise<string>;

  // Sign typed data (EVM only)
  signTypedData(data: TypedData): Promise<string>;

  // Send transaction
  sendTransaction(tx: Transaction): Promise<string>;

  // Get balance
  getBalance(): Promise<bigint>;

  // Export wallet data (if supported)
  exportWallet?(): Promise<WalletData>;
}
```

## Network Configuration

### EVM Networks

| Network | ID | Chain ID | RPC |
|---------|-----|----------|-----|
| Base Mainnet | `base-mainnet` | 8453 | Default CDP |
| Base Sepolia | `base-sepolia` | 84532 | Default CDP |
| Ethereum Mainnet | `ethereum-mainnet` | 1 | Default CDP |
| Ethereum Sepolia | `ethereum-sepolia` | 11155111 | Default CDP |
| Arbitrum | `arbitrum-mainnet` | 42161 | Default CDP |
| Optimism | `optimism-mainnet` | 10 | Default CDP |
| Polygon | `polygon-mainnet` | 137 | Default CDP |

### Solana Networks

| Network | ID | Cluster |
|---------|-----|---------|
| Solana Mainnet | `solana-mainnet` | mainnet-beta |
| Solana Devnet | `solana-devnet` | devnet |

## Best Practices

### Wallet Persistence

```typescript
import * as fs from "fs";

// Export and save wallet
const walletData = await walletProvider.exportWallet();
fs.writeFileSync("wallet.json", JSON.stringify(walletData));

// Restore wallet
const savedData = JSON.parse(fs.readFileSync("wallet.json", "utf8"));
const walletProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
  cdpWalletData: savedData,
});
```

**Security Notes:**
- Encrypt wallet data at rest
- Never commit wallet data to git
- Use environment variables or secure vaults
- Rotate wallets periodically for high-value operations

### Multi-Network Setup

```typescript
// Create providers for multiple networks
const baseProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
});

const ethereumProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "ethereum-sepolia",
});

const solanaProvider = await CdpV2SolanaWalletProvider.configureWithWallet({
  networkId: "solana-devnet",
});

// Use appropriate provider based on action
```

### Error Handling

```typescript
try {
  const walletProvider = await CdpWalletProvider.configureWithWallet({
    networkId: "base-sepolia",
  });
} catch (error) {
  if (error.code === "INVALID_API_KEY") {
    console.error("Check CDP_API_KEY_NAME and CDP_API_KEY_PRIVATE_KEY");
  } else if (error.code === "NETWORK_ERROR") {
    console.error("Network connection failed");
  }
  throw error;
}
```

## Resources

- [Wallet Management Guide](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management)
- [CDP API Documentation](https://docs.cdp.coinbase.com/)
- [Smart Wallets](https://docs.cdp.coinbase.com/smart-wallets/welcome)
