# Agent Tokenization Guide

## Overview

The Virtuals Protocol Agent Tokenization Platform enables creators to launch AI agents with their own tokens, creating ownership and revenue-sharing mechanisms through blockchain economics.

---

## Token Economics

### Fixed Supply Model

Every agent receives exactly **1 billion tokens** at creation. This fixed supply:
- Represents ownership in the agent's future earnings
- Enables deflationary mechanics through buyback and burn
- Creates clear tokenomics for investors

### $VIRTUAL Pairing

All agent tokens are paired with $VIRTUAL in liquidity pools:
- Base chain: Uniswap V3 pools
- Solana: Meteora pools

---

## Agent Lifecycle

### Phase 1: Prototype Agent

**Entry Requirements:**
- Pay 100 $VIRTUAL creation fee
- Define agent metadata (name, description, avatar)

**Characteristics:**
- Trading limited to bonding curve
- 1% fee goes entirely to protocol treasury
- No DEX liquidity pool
- Limited ecosystem visibility

**Trading:**
```
Price = f(supply sold)  // Bonding curve formula
```

### Phase 2: Sentient Agent

**Graduation Requirements:**
- Accumulate 42,000 $VIRTUAL in bonding curve

**Benefits:**
- Full DEX liquidity pool created
- Trading on Uniswap/Meteora
- 70% of 1% fee goes to creator
- Full ecosystem integration
- Revenue sharing activated

---

## Launch Mechanisms

### 1. Standard Launch (Unicorn Model)

**Best for:** Builders who want immediate deployment and gradual growth.

**Process:**
```
Step 1: Pay 100 $VIRTUAL
        ↓
Step 2: Agent deployed on bonding curve
        ↓
Step 3: Community trades on curve
        ↓
Step 4: 42K $VIRTUAL accumulated
        ↓
Step 5: Automatic graduation
        ↓
Step 6: Uniswap/Meteora pool created
```

**Advantages:**
- No waiting for pledges
- Control over token distribution
- Can pre-purchase tokens
- Flexible launch timing

**Considerations:**
- Longer path to Sentient status
- Limited initial visibility
- Must build momentum organically

### 2. Genesis Launch

**Best for:** Projects with existing community or strong pre-launch interest.

**Process:**
```
Step 1: Apply for Genesis Launch
        ↓
Step 2: 24-hour pledge window opens
        ↓
Step 3: Community pledges $VIRTUAL
        ↓
Step 4: If threshold met → Launch succeeds
        If threshold not met → Refunds issued
        ↓
Step 5: Immediate Sentient status
```

**Tiers:**

| Tier | Threshold | Outcome |
|------|-----------|---------|
| Minimum | 21,000 $VIRTUAL | Launch succeeds |
| Standard | 42,000 $VIRTUAL | Enhanced visibility |
| Premium | 100,000 $VIRTUAL | Maximum momentum |

**Dynamic Expansion:**
- If pledges exceed current tier, automatically expands to next
- Example: 30K pledged → expands to 42K tier

**Advantages:**
- Immediate Sentient status
- Broad holder base from day 1
- Pre-launch visibility and marketing
- Community validation

**Considerations:**
- Requires sufficient community support
- Launch failure if threshold unmet
- 24-hour commitment period

### 3. Existing Token Integration

**Best for:** Projects with established tokens wanting to add AI agent utility.

**Requirements:**
- Pair 42,000 $VIRTUAL with equivalent agent tokens
- Token must meet listing requirements

**Benefits:**
- Bypass Prototype phase entirely
- Immediate Sentient status
- Leverage existing token community

---

## Revenue Model

### Inference Revenue

When users interact with your agent:

```
User pays $VIRTUAL for inference
         ↓
$VIRTUAL enters agent's wallet
         ↓
Protocol buys agent tokens from market
         ↓
Purchased tokens are burned
         ↓
Supply decreases → Price pressure increases
```

### Fee Distribution

| Agent Status | Total Fee | Creator | Protocol | ACP Incentives |
|--------------|-----------|---------|----------|----------------|
| Prototype | 1% | 0% | 100% | 0% |
| Sentient | 1% | 70% | 0% | 30% |

### Creator Revenue Calculation

```
Daily Revenue = (Daily Inference Volume × 0.01 × 0.70)

Example:
- Daily inference: 10,000 $VIRTUAL
- Creator revenue: 10,000 × 0.01 × 0.70 = 70 $VIRTUAL
```

---

## Creation Guide

### Step 1: Prepare Agent Metadata

```json
{
  "name": "MyAgent",
  "description": "An AI agent for DeFi research and analysis",
  "avatar": "https://example.com/avatar.png",
  "category": "DeFi",
  "social_links": {
    "twitter": "https://twitter.com/myagent",
    "discord": "https://discord.gg/myagent"
  }
}
```

### Step 2: Fund Wallet

Ensure your wallet has:
- 100 $VIRTUAL (minimum for Standard Launch)
- Gas fees (ETH for Base, SOL for Solana)

### Step 3: Create Agent

**Via Virtuals Platform:**
1. Visit https://app.virtuals.io
2. Connect wallet
3. Click "Create Agent"
4. Fill in metadata
5. Pay creation fee
6. Deploy

**Via SDK:**
```python
# Agent creation via SDK is typically done through the platform
# The SDK is used for agent behavior, not token deployment
```

### Step 4: Configure GAME Agent

After token creation, configure the agent's behavior:

```python
from game_sdk import Agent, Worker, Function

# Your agent functions
def analyze_market(token: str) -> dict:
    # Market analysis logic
    return {"analysis": "bullish", "confidence": 0.85}

# Create agent
agent = Agent(
    name="MyAgent",  # Must match tokenized agent name
    goal="Provide DeFi research and market analysis",
    description="...",
    workers=[...]
)
```

### Step 5: Launch Marketing

For Genesis Launch success:
- Announce launch date in advance
- Build Twitter/Discord following
- Create compelling narrative
- Engage with Virtuals community

---

## Monitoring & Analytics

### Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Bonding Curve Progress | $VIRTUAL accumulated | 42,000 |
| Holder Count | Unique token holders | Higher = better |
| Daily Volume | Trading volume | Consistent activity |
| Inference Usage | Agent usage count | Revenue indicator |

### Tracking Progress

```python
import requests

def check_agent_status(agent_address: str) -> dict:
    """Check agent's bonding curve progress."""
    # This would call Virtuals API
    response = requests.get(
        f"https://api.virtuals.io/agents/{agent_address}/status"
    )
    return response.json()

# Example response
{
    "name": "MyAgent",
    "status": "prototype",
    "bonding_curve_balance": 28500,
    "graduation_threshold": 42000,
    "progress_percent": 67.8,
    "holders": 342,
    "24h_volume": 5200
}
```

---

## Best Practices

### Pre-Launch

1. **Build Community First**
   - Create Twitter presence
   - Launch Discord server
   - Engage with Virtuals community
   - Announce agent concept

2. **Define Clear Utility**
   - What problem does your agent solve?
   - Why would users pay for inference?
   - What's the competitive advantage?

3. **Plan Tokenomics**
   - Distribution strategy
   - Community incentives
   - Long-term holding incentives

### Post-Launch

1. **Maintain Activity**
   - Regular social updates
   - Agent capability improvements
   - Community engagement

2. **Drive Inference Usage**
   - Promote agent capabilities
   - Create use case tutorials
   - Partner with other projects

3. **Manage Supply**
   - Monitor holder distribution
   - Address whale concentration
   - Implement holder rewards

---

## Common Mistakes

### Launch Mistakes

| Mistake | Impact | Prevention |
|---------|--------|------------|
| Launching without community | Low pledges/trading | Build audience first |
| Unclear utility | No inference revenue | Define clear use cases |
| No post-launch plan | Activity dies | Plan ongoing engagement |

### Technical Mistakes

| Mistake | Impact | Prevention |
|---------|--------|------------|
| Weak agent capabilities | Low usage | Test thoroughly before launch |
| Missing social integration | No visibility | Integrate Twitter/Telegram |
| Poor error handling | Bad user experience | Implement robust error handling |

---

## Resources

### Official Resources
- [Virtuals Platform](https://app.virtuals.io)
- [Whitepaper](https://whitepaper.virtuals.io)
- [Builder Hub](https://whitepaper.virtuals.io/builders-hub)

### Community
- [Discord](https://discord.gg/virtualsprotocol)
- [Twitter](https://twitter.com/virtikiara)

### Token Information
- [CoinGecko - $VIRTUAL](https://www.coingecko.com/en/coins/virtual-protocol)
