# AgentKit Framework Integrations Reference

## Overview

AgentKit is framework-agnostic and integrates with multiple AI agent frameworks. This reference covers detailed integration patterns for each supported framework.

## LangChain Integration

### TypeScript (LangGraph)

```typescript
import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// Setup AgentKit
const walletProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
});

const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [
    cdpApiActionProvider,
    erc20ActionProvider,
    walletActionProvider,
  ],
});

// Get LangChain tools
const tools = await getLangChainTools(agentKit);

// Create LLM
const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

// Create agent with memory
const memory = new MemorySaver();
const agent = createReactAgent({
  llm,
  tools,
  checkpointSaver: memory,
});

// Run with conversation context
async function chat(userMessage: string, threadId: string) {
  const config = { configurable: { thread_id: threadId } };

  const stream = await agent.stream(
    { messages: [new HumanMessage(userMessage)] },
    config
  );

  let response = "";
  for await (const chunk of stream) {
    if (chunk.agent?.messages?.[0]?.content) {
      response = chunk.agent.messages[0].content;
    }
  }
  return response;
}

// Example conversation
const threadId = "user-session-123";
await chat("What's my wallet address?", threadId);
await chat("Get some testnet ETH", threadId);
await chat("Check my balance", threadId);
```

### Python (LangGraph)

```python
import asyncio
from coinbase_agentkit import AgentKit, CdpWalletProvider
from coinbase_agentkit_langchain import get_langchain_tools
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# Setup AgentKit
wallet_provider = CdpWalletProvider.configure_with_wallet(
    network_id="base-sepolia"
)

agent_kit = AgentKit.from_config(wallet_provider=wallet_provider)

# Get LangChain tools
tools = get_langchain_tools(agent_kit)

# Create LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Create agent with memory
memory = MemorySaver()
agent = create_react_agent(llm, tools, checkpointer=memory)

# Chat function
async def chat(message: str, thread_id: str) -> str:
    config = {"configurable": {"thread_id": thread_id}}

    result = await agent.ainvoke(
        {"messages": [{"role": "user", "content": message}]},
        config
    )

    return result["messages"][-1].content

# Example usage
async def main():
    thread_id = "user-session-123"
    print(await chat("What's my wallet address?", thread_id))
    print(await chat("Request testnet funds", thread_id))

asyncio.run(main())
```

### Streaming Responses

```typescript
// TypeScript streaming
async function streamChat(userMessage: string, threadId: string) {
  const config = { configurable: { thread_id: threadId } };

  const stream = await agent.stream(
    { messages: [new HumanMessage(userMessage)] },
    config
  );

  for await (const chunk of stream) {
    // Handle different chunk types
    if (chunk.agent) {
      console.log("Agent:", chunk.agent.messages[0].content);
    }
    if (chunk.tools) {
      console.log("Tool call:", chunk.tools);
    }
  }
}
```

```python
# Python streaming
async def stream_chat(message: str, thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}

    async for chunk in agent.astream(
        {"messages": [{"role": "user", "content": message}]},
        config
    ):
        if "agent" in chunk:
            print("Agent:", chunk["agent"]["messages"][-1].content)
        if "tools" in chunk:
            print("Tool call:", chunk["tools"])
```

## Vercel AI SDK Integration

### Basic Setup

```typescript
import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText, CoreMessage } from "ai";

// Setup AgentKit
const walletProvider = await CdpWalletProvider.configureWithWallet({
  networkId: "base-sepolia",
});

const agentKit = await AgentKit.from({ walletProvider });

// Get Vercel AI tools
const tools = getVercelAITools(agentKit);

// Generate response
const { text, toolCalls, toolResults } = await generateText({
  model: openai("gpt-4o"),
  tools,
  maxSteps: 10,  // Allow multiple tool calls
  prompt: "What is my wallet balance?",
});

console.log("Response:", text);
console.log("Tool calls:", toolCalls);
```

### Streaming with Vercel AI SDK

```typescript
import { streamText } from "ai";

// Stream response
const result = await streamText({
  model: openai("gpt-4o"),
  tools,
  maxSteps: 10,
  prompt: "Transfer 0.01 ETH to 0xabcd...",
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}

// Get final result
const finalText = await result.text;
const toolResults = await result.toolResults;
```

### Next.js API Route

```typescript
// app/api/chat/route.ts
import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { openai } from "@ai-sdk/openai";
import { streamText, Message } from "ai";

// Initialize AgentKit (cache for performance)
let agentKit: AgentKit | null = null;

async function getAgentKit() {
  if (!agentKit) {
    const walletProvider = await CdpWalletProvider.configureWithWallet({
      networkId: process.env.NETWORK_ID || "base-sepolia",
    });
    agentKit = await AgentKit.from({ walletProvider });
  }
  return agentKit;
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const kit = await getAgentKit();
  const tools = getVercelAITools(kit);

  const result = await streamText({
    model: openai("gpt-4o"),
    tools,
    maxSteps: 10,
    messages,
  });

  return result.toDataStreamResponse();
}
```

### React Frontend

```tsx
// components/Chat.tsx
"use client";

import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={`mb-4 ${m.role === "user" ? "text-right" : ""}`}>
            <span className="font-bold">{m.role === "user" ? "You" : "Agent"}:</span>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about your wallet..."
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

## MCP (Model Context Protocol) Integration

### MCP Server Setup

```typescript
import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getMcpTools } from "@coinbase/agentkit-model-context-protocol";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  // Setup AgentKit
  const walletProvider = await CdpWalletProvider.configureWithWallet({
    networkId: process.env.NETWORK_ID || "base-sepolia",
  });

  const agentKit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      cdpApiActionProvider,
      erc20ActionProvider,
      walletActionProvider,
    ],
  });

  // Create MCP server
  const server = new McpServer({
    name: "agentkit",
    version: "1.0.0",
  });

  // Register AgentKit tools
  const tools = getMcpTools(agentKit);

  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      async (args) => {
        const result = await tool.handler(args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }
    );
  }

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AgentKit MCP server running");
}

main().catch(console.error);
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "agentkit": {
      "command": "node",
      "args": ["/path/to/agentkit-mcp-server.js"],
      "env": {
        "CDP_API_KEY_NAME": "your_key_name",
        "CDP_API_KEY_PRIVATE_KEY": "your_private_key",
        "NETWORK_ID": "base-sepolia",
        "OPENAI_API_KEY": "your_openai_key"
      }
    }
  }
}
```

### Claude Code Configuration

```json
{
  "mcpServers": {
    "agentkit": {
      "command": "npx",
      "args": ["@coinbase/agentkit-mcp"],
      "env": {
        "CDP_API_KEY_NAME": "your_key_name",
        "CDP_API_KEY_PRIVATE_KEY": "your_private_key"
      }
    }
  }
}
```

### Available MCP Tools

When configured, these tools become available in Claude:

| Tool | Description |
|------|-------------|
| `get_wallet_details` | Get wallet address and network |
| `get_balance` | Get native token balance |
| `native_transfer` | Transfer native tokens |
| `erc20_transfer` | Transfer ERC-20 tokens |
| `request_faucet_funds` | Get testnet tokens |
| `trade` | Swap tokens via CDP |
| ... | All configured action providers |

## OpenAI Agents SDK Integration (Python)

### Basic Setup

```python
from agents import Agent, Runner
from coinbase_agentkit import AgentKit, CdpWalletProvider
from coinbase_agentkit_openai_agents_sdk import get_openai_tools

# Setup AgentKit
wallet_provider = CdpWalletProvider.configure_with_wallet(
    network_id="base-sepolia"
)

agent_kit = AgentKit.from_config(wallet_provider=wallet_provider)

# Get OpenAI tools
tools = get_openai_tools(agent_kit)

# Create agent
agent = Agent(
    name="Crypto Agent",
    instructions="""You are an AI agent with a crypto wallet.
    You can help users check balances, transfer tokens, and interact with DeFi protocols.
    Always confirm transaction details before executing.""",
    tools=tools,
)

# Run agent
async def main():
    result = await Runner.run(agent, "What's my wallet address?")
    print(result.final_output)

    result = await Runner.run(agent, "Check my ETH balance")
    print(result.final_output)

import asyncio
asyncio.run(main())
```

### Multi-Turn Conversation

```python
from agents import Agent, Runner, RunContext

agent = Agent(
    name="Crypto Agent",
    instructions="You are a helpful crypto assistant.",
    tools=get_openai_tools(agent_kit),
)

async def chat_session():
    context = RunContext()

    # First message
    result = await Runner.run(agent, "What's my wallet address?", context=context)
    print(f"Agent: {result.final_output}")

    # Follow-up (maintains context)
    result = await Runner.run(agent, "Send 0.01 ETH to that address", context=context)
    print(f"Agent: {result.final_output}")

asyncio.run(chat_session())
```

## Pydantic AI Integration (Python)

```python
from pydantic_ai import Agent
from coinbase_agentkit import AgentKit, CdpWalletProvider
from coinbase_agentkit_pydantic_ai import get_pydantic_tools

# Setup AgentKit
wallet_provider = CdpWalletProvider.configure_with_wallet(
    network_id="base-sepolia"
)

agent_kit = AgentKit.from_config(wallet_provider=wallet_provider)

# Get Pydantic AI tools
tools = get_pydantic_tools(agent_kit)

# Create agent
agent = Agent(
    model="openai:gpt-4o",
    tools=tools,
    system_prompt="You are a crypto assistant with wallet capabilities.",
)

# Run agent
result = agent.run_sync("What is my wallet balance?")
print(result.data)
```

## Framework Comparison

| Feature | LangChain | Vercel AI | MCP | OpenAI SDK |
|---------|-----------|-----------|-----|------------|
| Streaming | Yes | Yes | Via client | Yes |
| Memory | Built-in | Manual | Via client | Context-based |
| TypeScript | Yes | Yes | Yes | No |
| Python | Yes | No | No | Yes |
| Web Integration | Good | Excellent | Client-dependent | Good |
| Complexity | Medium | Low | Low | Low |
| Best For | Complex agents | Web apps | Desktop apps | Simple agents |

## Advanced Patterns

### Multi-Framework Agent

```typescript
// Use different frameworks for different purposes
import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { getMcpTools } from "@coinbase/agentkit-model-context-protocol";

const agentKit = await AgentKit.from({ walletProvider });

// Same AgentKit, different frameworks
const langchainTools = await getLangChainTools(agentKit);  // For complex reasoning
const vercelTools = getVercelAITools(agentKit);            // For web streaming
const mcpTools = getMcpTools(agentKit);                    // For desktop clients
```

### Tool Filtering

```typescript
// Filter tools based on use case
const allTools = await getLangChainTools(agentKit);

// Read-only tools
const readOnlyTools = allTools.filter(tool =>
  ["get_wallet_details", "get_balance", "get_price"].includes(tool.name)
);

// Transaction tools
const txTools = allTools.filter(tool =>
  ["native_transfer", "erc20_transfer", "swap"].includes(tool.name)
);

// Create specialized agents
const readOnlyAgent = createReactAgent({ llm, tools: readOnlyTools });
const txAgent = createReactAgent({ llm, tools: txTools });
```

## Resources

- [LangChain Integration Guide](https://docs.cdp.coinbase.com/agent-kit/core-concepts/langchain)
- [Vercel AI SDK Guide](https://docs.cdp.coinbase.com/agent-kit/core-concepts/vercel-ai-sdk)
- [MCP Integration Guide](https://docs.cdp.coinbase.com/agent-kit/core-concepts/model-context-protocol)
- [OpenAI Agents SDK](https://docs.cdp.coinbase.com/agent-kit/core-concepts/openai-agents-sdk)
- [Framework Examples](https://github.com/coinbase/agentkit/tree/main/examples)
