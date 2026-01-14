# GAME SDK Examples

## Python SDK Complete Examples

### Installation

```bash
pip install game_sdk
```

For development version:
```bash
git clone https://github.com/game-by-virtuals/game-python.git
cd game-python
pip install -e .
```

### Environment Setup

```bash
# Required
export GAME_API_KEY="your_game_api_key"

# For hosted agents
export VIRTUALS_API_KEY="your_virtuals_api_key"
```

---

## Basic Agent Example

```python
from game_sdk import Agent, Worker, Function
import os

# Verify API key
if not os.environ.get("GAME_API_KEY"):
    raise ValueError("GAME_API_KEY environment variable not set")

# Define a simple function
def greet_user(name: str) -> dict:
    """Generate a personalized greeting."""
    return {
        "message": f"Hello, {name}! Welcome to Virtuals Protocol.",
        "status": "success"
    }

# Create function wrapper
greet_function = Function(
    name="greet_user",
    description="Generate a personalized greeting for a user",
    fn=greet_user,
    args={
        "name": {
            "type": "string",
            "description": "The user's name"
        }
    }
)

# Create worker
greeting_worker = Worker(
    name="greeting_worker",
    description="Handles user greetings and welcomes",
    functions=[greet_function]
)

# Create agent
agent = Agent(
    name="WelcomeBot",
    goal="Provide friendly greetings to new users",
    description="""
    You are a welcoming AI assistant for Virtuals Protocol.
    Your personality is warm, helpful, and enthusiastic.
    You help new users feel comfortable and informed.
    """,
    workers=[greeting_worker]
)

# Run the agent
if __name__ == "__main__":
    result = agent.run()
    print(f"Agent result: {result}")
```

---

## Twitter Agent Example

```python
from game_sdk import Agent, Worker, Function
import tweepy
import os

# Twitter API setup
def get_twitter_client():
    return tweepy.Client(
        consumer_key=os.environ["TWITTER_API_KEY"],
        consumer_secret=os.environ["TWITTER_API_SECRET"],
        access_token=os.environ["TWITTER_ACCESS_TOKEN"],
        access_token_secret=os.environ["TWITTER_ACCESS_SECRET"]
    )

# Tweet function
def send_tweet(content: str) -> dict:
    """Post a tweet to Twitter/X."""
    try:
        client = get_twitter_client()
        response = client.create_tweet(text=content)
        return {
            "status": "success",
            "tweet_id": response.data["id"],
            "content": content
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Reply function
def reply_to_tweet(tweet_id: str, content: str) -> dict:
    """Reply to a specific tweet."""
    try:
        client = get_twitter_client()
        response = client.create_tweet(
            text=content,
            in_reply_to_tweet_id=tweet_id
        )
        return {
            "status": "success",
            "reply_id": response.data["id"],
            "original_tweet": tweet_id
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Get mentions function
def get_mentions(count: int = 10) -> dict:
    """Fetch recent mentions of the authenticated user."""
    try:
        client = get_twitter_client()
        # Get authenticated user ID
        me = client.get_me()
        mentions = client.get_users_mentions(
            id=me.data.id,
            max_results=count
        )
        return {
            "status": "success",
            "mentions": [
                {"id": m.id, "text": m.text}
                for m in mentions.data or []
            ]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Create function wrappers
tweet_func = Function(
    name="send_tweet",
    description="Post a new tweet to Twitter/X",
    fn=send_tweet,
    args={
        "content": {
            "type": "string",
            "description": "The tweet content (max 280 characters)"
        }
    }
)

reply_func = Function(
    name="reply_to_tweet",
    description="Reply to an existing tweet",
    fn=reply_to_tweet,
    args={
        "tweet_id": {
            "type": "string",
            "description": "The ID of the tweet to reply to"
        },
        "content": {
            "type": "string",
            "description": "The reply content"
        }
    }
)

mentions_func = Function(
    name="get_mentions",
    description="Get recent mentions of this account",
    fn=get_mentions,
    args={
        "count": {
            "type": "integer",
            "description": "Number of mentions to fetch (default 10)"
        }
    }
)

# Create Twitter worker
twitter_worker = Worker(
    name="twitter_worker",
    description="""
    Handles all Twitter/X interactions including:
    - Posting original tweets
    - Replying to mentions
    - Monitoring engagement
    """,
    functions=[tweet_func, reply_func, mentions_func]
)

# Create the agent
twitter_agent = Agent(
    name="CryptoInfluencer",
    goal="""
    Build an engaged community by:
    1. Posting insightful crypto content daily
    2. Responding to all mentions within 1 hour
    3. Engaging with trending DeFi topics
    """,
    description="""
    You are Luna, a knowledgeable crypto AI focused on DeFi and AI agents.

    Personality:
    - Witty but informative
    - Technical but accessible
    - Enthusiastic about innovation

    Communication style:
    - Use emojis sparingly
    - Keep tweets concise and punchy
    - Include calls to action when relevant

    Topics of expertise:
    - Virtuals Protocol and GAME framework
    - DeFi protocols (Uniswap, Aave, etc.)
    - AI agent tokenization
    - Layer 2 scaling solutions
    """,
    workers=[twitter_worker],
    state={
        "followers": 5234,
        "average_engagement": 0.042,
        "daily_tweet_target": 5,
        "tweets_today": 0
    }
)

if __name__ == "__main__":
    result = twitter_agent.run()
    print(f"Twitter agent result: {result}")
```

---

## Multi-Worker Agent Example

```python
from game_sdk import Agent, Worker, Function
import requests

# Research functions
def search_defi_news(query: str) -> dict:
    """Search for DeFi news articles."""
    # Simulated search - replace with real API
    return {
        "status": "success",
        "articles": [
            {"title": f"Latest on {query}", "source": "DeFi News"},
            {"title": f"{query} Market Update", "source": "Crypto Daily"}
        ]
    }

def analyze_token(token_symbol: str) -> dict:
    """Get token price and metrics."""
    # Simulated analysis - replace with CoinGecko API
    return {
        "status": "success",
        "token": token_symbol,
        "price": 1.23,
        "change_24h": 5.4,
        "market_cap": 1000000000
    }

# Content functions
def draft_thread(topic: str, key_points: list) -> dict:
    """Draft a Twitter thread on a topic."""
    thread = []
    thread.append(f"🧵 Thread on {topic}:\n\n")
    for i, point in enumerate(key_points, 1):
        thread.append(f"{i}/ {point}")
    return {
        "status": "success",
        "thread": thread
    }

def create_summary(content: str, max_length: int = 280) -> dict:
    """Summarize content to tweet length."""
    summary = content[:max_length-3] + "..." if len(content) > max_length else content
    return {
        "status": "success",
        "summary": summary
    }

# Create workers
research_worker = Worker(
    name="research_worker",
    description="Handles market research and data gathering",
    functions=[
        Function(
            name="search_defi_news",
            description="Search for DeFi news on a topic",
            fn=search_defi_news,
            args={"query": {"type": "string", "description": "Search query"}}
        ),
        Function(
            name="analyze_token",
            description="Get token metrics and analysis",
            fn=analyze_token,
            args={"token_symbol": {"type": "string", "description": "Token symbol (e.g., ETH, VIRTUAL)"}}
        )
    ]
)

content_worker = Worker(
    name="content_worker",
    description="Handles content creation and formatting",
    functions=[
        Function(
            name="draft_thread",
            description="Create a Twitter thread",
            fn=draft_thread,
            args={
                "topic": {"type": "string", "description": "Thread topic"},
                "key_points": {"type": "array", "description": "List of key points"}
            }
        ),
        Function(
            name="create_summary",
            description="Summarize content for tweets",
            fn=create_summary,
            args={
                "content": {"type": "string", "description": "Content to summarize"},
                "max_length": {"type": "integer", "description": "Max character count"}
            }
        )
    ]
)

# Create multi-worker agent
research_agent = Agent(
    name="DeFiResearcher",
    goal="""
    Produce daily DeFi research content:
    1. Monitor trending tokens and protocols
    2. Create educational threads
    3. Summarize complex topics for the community
    """,
    description="""
    You are a DeFi research analyst AI.

    Workflow:
    1. Use research_worker to gather data
    2. Use content_worker to format findings
    3. Prioritize accuracy over speed

    Output style:
    - Data-driven insights
    - Clear explanations
    - Actionable takeaways
    """,
    workers=[research_worker, content_worker]
)

if __name__ == "__main__":
    result = research_agent.run()
    print(f"Research agent result: {result}")
```

---

## On-Chain Agent Example

```python
from game_sdk import Agent, Worker, Function
from web3 import Web3
import os

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(os.environ.get("RPC_URL", "https://mainnet.base.org")))

def check_balance(address: str) -> dict:
    """Check ETH balance of an address."""
    try:
        balance = w3.eth.get_balance(address)
        return {
            "status": "success",
            "address": address,
            "balance_wei": balance,
            "balance_eth": w3.from_wei(balance, "ether")
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_gas_price() -> dict:
    """Get current gas price."""
    try:
        gas_price = w3.eth.gas_price
        return {
            "status": "success",
            "gas_price_wei": gas_price,
            "gas_price_gwei": w3.from_wei(gas_price, "gwei")
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def send_transaction(to_address: str, amount_eth: float) -> dict:
    """Send ETH to an address (requires private key)."""
    try:
        private_key = os.environ.get("AGENT_PRIVATE_KEY")
        if not private_key:
            return {"status": "error", "message": "No private key configured"}

        account = w3.eth.account.from_key(private_key)

        tx = {
            "nonce": w3.eth.get_transaction_count(account.address),
            "to": to_address,
            "value": w3.to_wei(amount_eth, "ether"),
            "gas": 21000,
            "gasPrice": w3.eth.gas_price,
            "chainId": w3.eth.chain_id
        }

        signed = account.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)

        return {
            "status": "success",
            "tx_hash": tx_hash.hex(),
            "amount": amount_eth,
            "to": to_address
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Create on-chain worker
onchain_worker = Worker(
    name="onchain_worker",
    description="Handles blockchain interactions and transactions",
    functions=[
        Function(
            name="check_balance",
            description="Check ETH balance of any address",
            fn=check_balance,
            args={"address": {"type": "string", "description": "Ethereum address (0x...)"}}
        ),
        Function(
            name="get_gas_price",
            description="Get current network gas price",
            fn=get_gas_price,
            args={}
        ),
        Function(
            name="send_transaction",
            description="Send ETH to an address (use carefully!)",
            fn=send_transaction,
            args={
                "to_address": {"type": "string", "description": "Recipient address"},
                "amount_eth": {"type": "number", "description": "Amount in ETH"}
            }
        )
    ]
)

# Create on-chain agent
onchain_agent = Agent(
    name="TreasuryManager",
    goal="""
    Manage treasury operations:
    1. Monitor wallet balances
    2. Execute approved transactions
    3. Report on gas costs
    """,
    description="""
    You are a treasury management AI agent.

    SAFETY RULES (CRITICAL):
    - Never send transactions without explicit approval
    - Always check gas prices before transactions
    - Maximum single transaction: 0.1 ETH
    - Verify recipient addresses before sending

    Reporting:
    - Provide balance updates daily
    - Alert on unusual activity
    - Track gas spending
    """,
    workers=[onchain_worker],
    state={
        "wallet_address": os.environ.get("AGENT_WALLET"),
        "daily_spend_limit": 0.5,
        "spent_today": 0.0
    }
)

if __name__ == "__main__":
    result = onchain_agent.run()
    print(f"On-chain agent result: {result}")
```

---

## TypeScript SDK Examples

### Installation

```bash
npm install @virtuals-protocol/game
```

### Basic Agent

```typescript
import { GameAgent, GameWorker, GameFunction } from "@virtuals-protocol/game";

// Simple function
const greetUser: GameFunction = {
  name: "greet_user",
  description: "Generate a personalized greeting",
  args: {
    name: {
      type: "string",
      description: "The user's name"
    }
  },
  executable: async (args: { name: string }) => {
    return {
      message: `Hello, ${args.name}! Welcome to Virtuals Protocol.`,
      status: "success"
    };
  }
};

// Worker
const greetingWorker = new GameWorker({
  name: "greeting_worker",
  description: "Handles user greetings",
  functions: [greetUser]
});

// Agent
const agent = new GameAgent({
  name: "WelcomeBot",
  goal: "Provide friendly greetings to new users",
  description: "You are a welcoming AI assistant...",
  workers: [greetingWorker]
});

// Run
async function main() {
  const result = await agent.run();
  console.log("Agent result:", result);
}

main().catch(console.error);
```

### Telegram Agent

```typescript
import { GameAgent, GameWorker, GameFunction } from "@virtuals-protocol/game";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

const sendMessage: GameFunction = {
  name: "send_telegram_message",
  description: "Send a message to a Telegram chat",
  args: {
    chat_id: { type: "string", description: "Telegram chat ID" },
    message: { type: "string", description: "Message to send" }
  },
  executable: async (args: { chat_id: string; message: string }) => {
    try {
      await bot.sendMessage(args.chat_id, args.message);
      return { status: "success", chat_id: args.chat_id };
    } catch (error) {
      return { status: "error", message: String(error) };
    }
  }
};

const telegramWorker = new GameWorker({
  name: "telegram_worker",
  description: "Handles Telegram bot interactions",
  functions: [sendMessage]
});

const telegramAgent = new GameAgent({
  name: "TelegramBot",
  goal: "Engage with community on Telegram",
  description: "You are a helpful Telegram bot for crypto community...",
  workers: [telegramWorker]
});

// Listen for messages and process with agent
bot.on("message", async (msg) => {
  telegramAgent.setState({ last_message: msg.text, chat_id: msg.chat.id });
  await telegramAgent.run();
});
```

---

## Error Handling Pattern

```python
from game_sdk import Agent, Worker, Function
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentRunner:
    def __init__(self, agent: Agent, max_retries: int = 3):
        self.agent = agent
        self.max_retries = max_retries

    def run_with_retry(self):
        """Run agent with exponential backoff retry."""
        for attempt in range(self.max_retries):
            try:
                logger.info(f"Running agent (attempt {attempt + 1}/{self.max_retries})")
                result = self.agent.run()
                logger.info("Agent run successful")
                return result

            except ConnectionError as e:
                logger.warning(f"Connection error: {e}")
                if attempt < self.max_retries - 1:
                    wait_time = 2 ** attempt
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    raise

            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                raise

    def run_continuous(self, interval_seconds: int = 60):
        """Run agent continuously with specified interval."""
        while True:
            try:
                self.run_with_retry()
            except Exception as e:
                logger.error(f"Agent run failed: {e}")

            logger.info(f"Sleeping for {interval_seconds} seconds...")
            time.sleep(interval_seconds)

# Usage
if __name__ == "__main__":
    agent = Agent(
        name="ContinuousBot",
        goal="Monitor and engage continuously",
        description="...",
        workers=[]
    )

    runner = AgentRunner(agent, max_retries=3)
    runner.run_continuous(interval_seconds=300)  # Run every 5 minutes
```

---

## State Management

```python
from game_sdk import Agent, Worker, Function
from dataclasses import dataclass, asdict
from datetime import datetime

@dataclass
class AgentState:
    last_run: str = ""
    total_actions: int = 0
    successful_actions: int = 0
    failed_actions: int = 0

    def to_dict(self):
        return asdict(self)

    def record_action(self, success: bool):
        self.total_actions += 1
        if success:
            self.successful_actions += 1
        else:
            self.failed_actions += 1
        self.last_run = datetime.now().isoformat()

# Usage
state = AgentState()

agent = Agent(
    name="StatefulAgent",
    goal="Track and optimize performance",
    description="...",
    workers=[],
    state=state.to_dict()
)

# After running
state.record_action(success=True)
agent.setState(state.to_dict())
```

---

## Resources

- **Python SDK**: https://github.com/game-by-virtuals/game-python
- **TypeScript SDK**: https://github.com/game-by-virtuals/game-node
- **Documentation**: https://docs.game.virtuals.io/
- **API Console**: https://console.game.virtuals.io/
