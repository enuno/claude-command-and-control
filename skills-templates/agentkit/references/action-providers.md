# AgentKit Action Providers Reference

## Overview

Action Providers are modular components that give AgentKit agents specific capabilities. Each provider bundles related actions that agents can use to interact with blockchain protocols and services.

## Core Action Providers

### walletActionProvider

Basic wallet operations.

```typescript
import { walletActionProvider } from "@coinbase/agentkit";

// Actions included:
// - get_wallet_details: Get wallet address and network info
// - get_balance: Get native token balance
// - native_transfer: Transfer native tokens (ETH, SOL, etc.)
```

**Example Usage:**
```
User: "What's my wallet address?"
Agent calls: get_wallet_details()
Response: "Your wallet address is 0x1234... on base-sepolia"

User: "Send 0.01 ETH to 0xabcd..."
Agent calls: native_transfer({ to: "0xabcd...", amount: "0.01" })
Response: "Transferred 0.01 ETH. Transaction: 0x..."
```

### cdpApiActionProvider

CDP platform-specific actions.

```typescript
import { cdpApiActionProvider } from "@coinbase/agentkit";

// Actions included:
// - request_faucet_funds: Get testnet tokens
// - trade: Execute token swaps via CDP
// - register_basename: Register .base.eth names
// - get_address_reputation: Check address reputation score
```

**Example Usage:**
```
User: "Get me some testnet ETH"
Agent calls: request_faucet_funds({ asset: "eth" })
Response: "Requested testnet ETH from faucet"

User: "Swap 100 USDC for ETH"
Agent calls: trade({ fromAsset: "USDC", toAsset: "ETH", amount: "100" })
Response: "Swapped 100 USDC for 0.05 ETH"
```

### erc20ActionProvider

ERC-20 token operations.

```typescript
import { erc20ActionProvider } from "@coinbase/agentkit";

// Actions included:
// - transfer: Transfer ERC-20 tokens
// - get_balance: Get token balance
// - approve: Approve spending allowance
// - check_allowance: Check current allowance
// - get_token_info: Get token metadata
```

**Example Usage:**
```
User: "Transfer 50 USDC to 0xabcd..."
Agent calls: transfer({
  token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  to: "0xabcd...",
  amount: "50"
})
Response: "Transferred 50 USDC"

User: "Approve Uniswap to spend my USDC"
Agent calls: approve({ token: "USDC", spender: "0x...", amount: "1000" })
Response: "Approved 1000 USDC spending"
```

## DeFi Action Providers

### compoundActionProvider

Compound V3 lending protocol.

```typescript
import { compoundActionProvider } from "@coinbase/agentkit";

const provider = compoundActionProvider({ networkId: "base-mainnet" });

// Actions:
// - supply: Deposit assets
// - withdraw: Withdraw assets
// - borrow: Borrow against collateral
// - repay: Repay borrowed assets
// - get_position: Get lending position details
```

**Example Usage:**
```
User: "Supply 100 USDC to Compound"
Agent calls: supply({ asset: "USDC", amount: "100" })
Response: "Supplied 100 USDC to Compound. Current APY: 4.5%"

User: "Borrow 0.01 ETH"
Agent calls: borrow({ asset: "ETH", amount: "0.01" })
Response: "Borrowed 0.01 ETH. Borrow APY: 3.2%"
```

### aaveActionProvider

Aave V3 lending protocol.

```typescript
import { aaveActionProvider } from "@coinbase/agentkit";

const provider = aaveActionProvider({ networkId: "base-mainnet" });

// Actions:
// - supply: Deposit assets
// - withdraw: Withdraw assets
// - borrow: Borrow against collateral
// - repay: Repay borrowed assets
// - get_user_data: Get account health and positions
```

### morphoActionProvider

Morpho lending protocol.

```typescript
import { morphoActionProvider } from "@coinbase/agentkit";

// Actions:
// - morpho_deposit: Deposit into Morpho vault
// - morpho_withdraw: Withdraw from Morpho vault
// - get_morpho_position: Get position details
```

### moonwellActionProvider

Moonwell lending protocol.

```typescript
import { moonwellActionProvider } from "@coinbase/agentkit";

// Actions:
// - supply: Deposit assets
// - withdraw: Withdraw assets
// - borrow: Borrow against collateral
// - repay: Repay borrowed assets
```

### jupiterActionProvider

Jupiter DEX aggregator for Solana.

```typescript
import { jupiterActionProvider } from "@coinbase/agentkit";

// Actions:
// - swap: Execute token swap via Jupiter
// - get_quote: Get swap quote
```

**Example Usage:**
```
User: "Swap 10 SOL for USDC"
Agent calls: swap({ fromToken: "SOL", toToken: "USDC", amount: "10" })
Response: "Swapped 10 SOL for 2150 USDC via Jupiter"
```

## NFT Action Providers

### erc721ActionProvider

ERC-721 NFT operations.

```typescript
import { erc721ActionProvider } from "@coinbase/agentkit";

// Actions:
// - mint_nft: Mint new NFT (if contract supports)
// - transfer_nft: Transfer NFT to another address
// - get_nft_balance: Get NFT balance
// - get_token_uri: Get NFT metadata URI
```

**Example Usage:**
```
User: "Mint an NFT from contract 0x1234..."
Agent calls: mint_nft({ contractAddress: "0x1234...", to: "myAddress" })
Response: "Minted NFT #42"

User: "Transfer my NFT to 0xabcd..."
Agent calls: transfer_nft({
  contractAddress: "0x1234...",
  tokenId: "42",
  to: "0xabcd..."
})
Response: "Transferred NFT #42"
```

### zoraActionProvider

Zora NFT platform integration.

```typescript
import { zoraActionProvider } from "@coinbase/agentkit";

// Actions:
// - create_collection: Create Zora collection
// - mint_zora_nft: Mint from Zora collection
// - list_for_sale: List NFT for sale
```

### openseaActionProvider

OpenSea marketplace integration.

```typescript
import { openseaActionProvider } from "@coinbase/agentkit";

// Actions:
// - list_nft: List NFT for sale
// - buy_nft: Purchase NFT
// - cancel_listing: Cancel existing listing
// - get_floor_price: Get collection floor price
```

## Token Action Providers

### wethActionProvider

Wrapped ETH operations.

```typescript
import { wethActionProvider } from "@coinbase/agentkit";

// Actions:
// - wrap_eth: Convert ETH to WETH
// - unwrap_eth: Convert WETH to ETH
```

**Example Usage:**
```
User: "Wrap 1 ETH"
Agent calls: wrap_eth({ amount: "1" })
Response: "Wrapped 1 ETH to 1 WETH"
```

## Social Action Providers

### farcasterActionProvider

Farcaster social protocol integration.

```typescript
import { farcasterActionProvider } from "@coinbase/agentkit";

// Actions:
// - post_cast: Post a cast (message)
// - reply_to_cast: Reply to existing cast
// - get_feed: Get user's feed
// - get_notifications: Get notifications
```

**Example Usage:**
```
User: "Post 'Hello from my AI agent!' to Farcaster"
Agent calls: post_cast({ text: "Hello from my AI agent!" })
Response: "Posted cast successfully"
```

### twitterActionProvider

Twitter/X integration.

```typescript
import { twitterActionProvider } from "@coinbase/agentkit";

// Actions:
// - post_tweet: Post a tweet
// - get_timeline: Get user timeline
// - reply_to_tweet: Reply to tweet
```

## Naming Action Providers

### basenameActionProvider

Basename (.base.eth) registration.

```typescript
import { basenameActionProvider } from "@coinbase/agentkit";

// Actions:
// - register_basename: Register new basename
// - resolve_basename: Resolve basename to address
// - set_primary_basename: Set primary basename
```

**Example Usage:**
```
User: "Register myagent.base.eth"
Agent calls: register_basename({ name: "myagent" })
Response: "Registered myagent.base.eth"
```

## Oracle Action Providers

### pythActionProvider

Pyth Network price oracle.

```typescript
import { pythActionProvider } from "@coinbase/agentkit";

// Actions:
// - get_price: Get current price from Pyth
// - get_price_feed: Get price feed details
```

**Example Usage:**
```
User: "What's the current ETH price?"
Agent calls: get_price({ symbol: "ETH/USD" })
Response: "ETH/USD: $3,450.25 (Pyth Oracle)"
```

## Payment Action Providers

### x402ActionProvider

x402 payment protocol integration.

```typescript
import { x402ActionProvider } from "@coinbase/agentkit";

// Actions:
// - make_x402_payment: Pay for x402-protected resources
// - check_x402_requirements: Check payment requirements
```

**Example Usage:**
```
User: "Access the premium API at api.example.com/data"
Agent calls: make_x402_payment({
  url: "https://api.example.com/data",
  amount: "0.01"
})
Response: "Paid $0.01 USDC, data retrieved successfully"
```

## Python Action Providers

Python has equivalent action providers with slightly different naming:

```python
from coinbase_agentkit import (
    wallet_action_provider,
    cdp_api_action_provider,
    erc20_action_provider,
    compound_action_provider,
    morpho_action_provider,
    pyth_action_provider,
)

agent_kit = AgentKit.from_config(
    wallet_provider=wallet_provider,
    action_providers=[
        wallet_action_provider(),
        erc20_action_provider(),
        compound_action_provider(network_id="base-sepolia"),
    ]
)
```

## Creating Custom Action Providers

### TypeScript Custom Provider

```typescript
import { ActionProvider, CreateAction } from "@coinbase/agentkit";
import { z } from "zod";

class MyCustomActionProvider extends ActionProvider {
  constructor(private config: { apiKey: string }) {
    super();
  }

  @CreateAction({
    name: "my_custom_action",
    description: "Does something custom with the provided data",
    schema: z.object({
      input: z.string().describe("The input data to process"),
      options: z.object({
        format: z.enum(["json", "text"]).optional(),
      }).optional(),
    }),
  })
  async myCustomAction(params: {
    input: string;
    options?: { format?: "json" | "text" }
  }): Promise<string> {
    // Your implementation
    const result = await this.processData(params.input);
    return params.options?.format === "json"
      ? JSON.stringify(result)
      : result.toString();
  }

  private async processData(input: string): Promise<any> {
    // Custom logic here
    return { processed: input };
  }
}

// Usage
const customProvider = new MyCustomActionProvider({ apiKey: "..." });
const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [customProvider],
});
```

### Python Custom Provider

```python
from coinbase_agentkit import ActionProvider, create_action
from pydantic import BaseModel, Field

class MyActionInput(BaseModel):
    data: str = Field(description="Input data")

class MyCustomActionProvider(ActionProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        super().__init__()

    @create_action(
        name="my_custom_action",
        description="Process custom data",
        schema=MyActionInput,
    )
    async def my_custom_action(self, params: MyActionInput) -> str:
        result = await self.process_data(params.data)
        return f"Processed: {result}"

    async def process_data(self, data: str) -> str:
        return data.upper()

# Usage
custom_provider = MyCustomActionProvider(api_key="...")
agent_kit = AgentKit.from_config(
    wallet_provider=wallet_provider,
    action_providers=[custom_provider],
)
```

## Action Provider Configuration

### Selective Action Registration

```typescript
// Only include specific providers
const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [
    walletActionProvider,      // Basic wallet ops
    erc20ActionProvider,       // Token transfers
    // Skip DeFi providers if not needed
  ],
});
```

### Network-Specific Configuration

```typescript
// Configure providers for specific networks
const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [
    walletActionProvider,
    compoundActionProvider({ networkId: "base-mainnet" }),
    aaveActionProvider({ networkId: "ethereum-mainnet" }),
  ],
});
```

## Additional Action Providers (Q1 2025+)

### Swap & Bridge Providers

#### zeroXActionProvider

0x Protocol swap integration.

```typescript
import { zeroXActionProvider } from "@coinbase/agentkit";

// Actions:
// - swap: Execute token swap via 0x
// - get_quote: Get swap quote
// - get_price: Get token price
```

#### sushiActionProvider

SushiSwap DEX integration.

```typescript
import { sushiActionProvider } from "@coinbase/agentkit";

// Actions:
// - swap: Execute swap via SushiSwap
// - add_liquidity: Add liquidity to pool
// - remove_liquidity: Remove liquidity from pool
```

#### acrossActionProvider

Across Protocol cross-chain bridge.

```typescript
import { acrossActionProvider } from "@coinbase/agentkit";

// Actions:
// - bridge: Bridge tokens across chains
// - get_bridge_quote: Get bridge quote
// - check_bridge_status: Check bridge transaction status
```

### Streaming & Payments

#### superfluidActionProvider

Superfluid token streaming protocol.

```typescript
import { superfluidActionProvider } from "@coinbase/agentkit";

// Actions:
// - create_stream: Create token stream
// - update_stream: Modify stream rate
// - delete_stream: Stop and delete stream
// - get_stream_info: Get stream details
```

**Example:**
```
User: "Stream 100 USDC per month to 0xabcd..."
Agent calls: create_stream({
  token: "USDCx",
  receiver: "0xabcd...",
  flowRate: "100/month"
})
```

#### onrampActionProvider

Fiat-to-crypto onramp.

```typescript
import { onrampActionProvider } from "@coinbase/agentkit";

// Actions:
// - create_onramp_session: Create onramp purchase session
// - get_onramp_status: Check onramp transaction status
```

### Token Creation & Launch

#### clankerActionProvider

Clanker token creation platform.

```typescript
import { clankerActionProvider } from "@coinbase/agentkit";

// Actions:
// - create_token: Create new Clanker token
// - get_token_info: Get token details
```

#### flaunchActionProvider

Token launch functionality.

```typescript
import { flaunchActionProvider } from "@coinbase/agentkit";

// Actions:
// - launch_token: Launch new token
// - configure_launch: Configure launch parameters
```

#### wowActionProvider

WOW memecoin trading.

```typescript
import { wowActionProvider } from "@coinbase/agentkit";

// Actions:
// - trade_wow: Trade WOW tokens
// - get_wow_price: Get WOW token price
```

### Data & Analytics

#### defillamaActionProvider

DefiLlama data aggregation.

```typescript
import { defillamaActionProvider } from "@coinbase/agentkit";

// Actions:
// - get_tvl: Get protocol TVL
// - get_protocol_info: Get protocol details
// - get_yields: Get yield data
```

#### messariActionProvider

Messari research data.

```typescript
import { messariActionProvider } from "@coinbase/agentkit";

// Actions:
// - get_asset_metrics: Get asset metrics
// - get_market_data: Get market data
```

#### zerionActionProvider

Zerion portfolio tracking.

```typescript
import { zerionActionProvider } from "@coinbase/agentkit";

// Actions:
// - get_portfolio: Get portfolio summary
// - get_transactions: Get transaction history
```

### DeFi Aggregation

#### ensoActionProvider

Enso DeFi aggregation.

```typescript
import { ensoActionProvider } from "@coinbase/agentkit";

// Actions:
// - route: Find best DeFi route
// - execute: Execute DeFi action
// - get_positions: Get DeFi positions
```

#### yelayActionProvider

Yelay vault operations.

```typescript
import { yelayActionProvider } from "@coinbase/agentkit";

// Actions:
// - deposit_vault: Deposit to vault
// - withdraw_vault: Withdraw from vault
// - get_vault_info: Get vault details
```

#### vaultsfyiActionProvider

Vaults.fyi integration.

```typescript
import { vaultsfyiActionProvider } from "@coinbase/agentkit";

// Actions:
// - get_vaults: List available vaults
// - get_vault_apy: Get vault APY
```

### Infrastructure & External

#### sshActionProvider

SSH operations for server management.

```typescript
import { sshActionProvider } from "@coinbase/agentkit";

// Actions:
// - execute_command: Execute SSH command
// - upload_file: Upload file via SSH
// - download_file: Download file via SSH
```

#### hyperbolicActionProvider

Hyperbolic AI compute integration.

```typescript
import { hyperbolicActionProvider } from "@coinbase/agentkit";

// Actions:
// - generate_image: Generate AI image
// - generate_text: Generate AI text
```

#### nillionActionProvider

Nillion SecretVault for encrypted data.

```typescript
import { nillionActionProvider } from "@coinbase/agentkit";

// Actions:
// - store_secret: Store encrypted secret
// - retrieve_secret: Retrieve encrypted secret
// - delete_secret: Delete secret
```

### Trading & Markets

#### truemarketsActionProvider

TrueMarkets prediction markets.

```typescript
import { truemarketsActionProvider } from "@coinbase/agentkit";

// Actions:
// - place_bet: Place prediction bet
// - get_markets: Get available markets
```

## Action Provider Summary

### EVM Actions (50+)

| Category | Provider | Key Actions |
|----------|----------|-------------|
| Wallet | walletActionProvider | get_wallet_details, native_transfer, get_balance |
| CDP | cdpApiActionProvider | request_faucet_funds, trade, register_basename |
| ERC20 | erc20ActionProvider | transfer, approve, get_balance |
| DeFi | compoundActionProvider | supply, withdraw, borrow, repay |
| DeFi | aaveActionProvider | supply, withdraw, borrow, repay |
| DeFi | morphoActionProvider | morpho_deposit, morpho_withdraw |
| DeFi | moonwellActionProvider | supply, withdraw, borrow, repay |
| DeFi | ensoActionProvider | route, execute, get_positions |
| DeFi | yelayActionProvider | deposit_vault, withdraw_vault |
| NFT | erc721ActionProvider | mint_nft, transfer_nft |
| NFT | zoraActionProvider | create_collection, mint_zora_nft |
| NFT | openseaActionProvider | list_nft, buy_nft |
| Token | wethActionProvider | wrap_eth, unwrap_eth |
| Token | clankerActionProvider | create_token |
| Token | flaunchActionProvider | launch_token |
| Token | wowActionProvider | trade_wow |
| Swap | zeroXActionProvider | swap, get_quote |
| Swap | sushiActionProvider | swap, add_liquidity |
| Bridge | acrossActionProvider | bridge, get_bridge_quote |
| Stream | superfluidActionProvider | create_stream, update_stream |
| Social | farcasterActionProvider | post_cast, get_feed |
| Social | twitterActionProvider | post_tweet, get_timeline |
| Naming | basenameActionProvider | register_basename |
| Oracle | pythActionProvider | get_price |
| Data | defillamaActionProvider | get_tvl, get_yields |
| Data | messariActionProvider | get_asset_metrics |
| Data | zerionActionProvider | get_portfolio |
| Payment | x402ActionProvider | make_x402_payment |
| Payment | onrampActionProvider | create_onramp_session |
| Infra | sshActionProvider | execute_command |
| Infra | nillionActionProvider | store_secret, retrieve_secret |
| AI | hyperbolicActionProvider | generate_image, generate_text |

### SVM Actions (Solana)

| Category | Provider | Key Actions |
|----------|----------|-------------|
| Wallet | walletActionProvider | get_wallet_details, native_transfer |
| DEX | jupiterActionProvider | swap, get_quote |
| Token | splTokenActionProvider | transfer, get_balance |

## Resources

- [Action Providers Guide](https://docs.cdp.coinbase.com/agent-kit/core-concepts/action-providers)
- [Custom Actions Tutorial](https://docs.cdp.coinbase.com/agent-kit/guides/custom-action-provider)
- [GitHub Examples](https://github.com/coinbase/agentkit/tree/main/examples)
- [AgentKit Q1 Update](https://www.coinbase.com/developer-platform/discover/launches/agentkit-q1-update)
