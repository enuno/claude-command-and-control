# Coinbase Payments MCP

## Overview

Payments MCP is an MCP server and companion wallet app from Coinbase that combines wallets, onramps, and payments via x402 into a single solution for agentic commerce. It enables AI agents to autonomously discover and pay for services without API keys, complex seed phrases, or manual intervention.

**Key value proposition**: The first tool that lets popular LLMs like Claude, Gemini, and Codex access a wallet, onramp, and payments, all with no API key required.

## Features

- **Wallet Creation**: Sign in with just an email (no developer setup or API keys required)
- **User-Friendly Interface**: Configure agents, set spend limits, manage transactions without code
- **Integrated x402 Bazaar Explorer**: Discover APIs and services your agent can pay for
- **Built-in Onramp**: Guest checkout in supported regions for instant transactions
- **Local Desktop Operation**: Runs locally for speed and security
- **Spend Limits**: Agents have dedicated funds with explicit limits - no access to main wallet

## Supported MCP Clients

| Client | Value | Auto-Config |
|--------|-------|-------------|
| Claude Desktop | `claude` | Yes |
| Claude Code | `claude-code` | Yes |
| Codex CLI | `codex` | Yes |
| Gemini CLI | `gemini` | Yes |
| Cherry Studio | - | Yes |
| Other Tools | `other` | Manual only |

## Installation

### Basic Installation

```bash
# Interactive installation (prompts for client selection)
npx @coinbase/payments-mcp

# Explicit install command
npx @coinbase/payments-mcp install
```

### Auto-Configuration

```bash
# Claude Desktop with auto-config
npx @coinbase/payments-mcp --client claude --auto-config

# Claude Code with auto-config
npx @coinbase/payments-mcp --client claude-code --auto-config

# Codex with auto-config
npx @coinbase/payments-mcp --client codex --auto-config

# Gemini with auto-config
npx @coinbase/payments-mcp --client gemini --auto-config

# Skip auto-config prompts
npx @coinbase/payments-mcp --client claude --no-auto-config
```

### Management Commands

```bash
# Check installation status
npx @coinbase/payments-mcp status

# Force reinstallation
npx @coinbase/payments-mcp install --force

# Uninstall
npx @coinbase/payments-mcp uninstall

# Verbose logging
npx @coinbase/payments-mcp install --verbose
```

## Manual Configuration

For manual setup, add to your MCP client configuration:

```json
{
  "mcpServers": {
    "payments-mcp": {
      "command": "node",
      "args": ["/Users/your-home-dir/.payments-mcp/bundle.js"]
    }
  }
}
```

### Configuration File Locations

| Client | Config File Location |
|--------|---------------------|
| Claude Desktop | `~/.config/claude/claude_desktop_config.json` (Linux/Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Claude Code | `~/.claude/settings.json` |

## CLI Options

| Option | Description |
|--------|-------------|
| `--client, -c <client>` | Specify MCP client (claude, claude-code, codex, gemini, other) |
| `--auto-config` | Automatically configure without prompting |
| `--no-auto-config` | Skip automatic configuration prompts |
| `--verbose, -v` | Enable detailed logging |
| `--force, -f` | Force reinstallation even if current |
| `--help, -h` | Display usage information |

## File Locations

- **Installation Directory**: `~/.payments-mcp/`
- **Main Bundle**: `~/.payments-mcp/bundle.js`

## Wallet Features

### Bazaar Explorer

The companion wallet app provides:
- Browse Bazaar tab to explore x402 services
- Filter by category and price
- Copy prompts for agent use
- Add funds via Coinbase Onramp
- View transaction history

### Security Model

- Agents have dedicated funds you explicitly provide
- No access to your main wallet
- Impossible for agent to accumulate unexpected charges
- Configurable spend limits
- Local execution for security

## Use Cases

With Payments MCP, AI agents can:

1. **Pay for Compute**: Access cloud computing resources
2. **Retrieve Paywalled Data**: Access subscription content
3. **Tip Creators**: Reward content creators automatically
4. **Business Operations**: Handle lightweight transactions
5. **API Access**: Discover and use paid APIs via Bazaar

## Integration with x402

Payments MCP builds on the x402 protocol:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  AI Agent   │────>│ Payments MCP│────>│ x402 Service│
│ (Claude/etc)│     │   Server    │     │  (Bazaar)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │  1. Request tool  │                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │  2. Discover API  │
       │                   │──────────────────>│
       │                   │                   │
       │                   │  3. 402 Payment   │
       │                   │<──────────────────│
       │                   │                   │
       │                   │  4. Auto-pay x402 │
       │                   │──────────────────>│
       │                   │                   │
       │  5. Return result │  6. Return data   │
       │<──────────────────│<──────────────────│
```

## x402-mcp (Vercel)

Vercel provides `x402-mcp` for integrating x402 payments with MCP servers and AI SDK.

### Installation

```bash
npm install x402-mcp
```

### Creating Paid MCP Tools

```typescript
import { createPaidMcpHandler } from "x402-mcp";
import z from "zod";

const handler = createPaidMcpHandler(
  (server) => {
    server.paidTool(
      "premium_analysis",
      { price: 0.01 },  // $0.01 per call
      { data: z.string() },
      async (args) => {
        const result = await analyzeData(args.data);
        return { content: [{ type: "text", text: result }] };
      }
    );
  },
  { recipient: process.env.WALLET_ADDRESS }
);

export { handler as GET, handler as POST };
```

### Client Integration with AI SDK

```typescript
import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { withPayment } from "x402-mcp";

// Create payment-enabled MCP client
const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(url),
}).then((client) => withPayment(client, { account }));

// Get available tools (including paid ones)
const tools = await mcpClient.tools();
```

### API Route Protection

```typescript
import { paymentMiddleware } from "x402-next";

export const middleware = paymentMiddleware({
  "/api/premium": {
    price: 0.01,
    config: { description: "Access to premium API" }
  },
});
```

### Client-Side Fetch

```typescript
import { wrapFetchWithPayment } from "x402-fetch";

const fetchWithPay = wrapFetchWithPayment(fetch, client);
const response = await fetchWithPay("https://api.example.com/paid-endpoint");
```

## Troubleshooting

### Common Issues

1. **Missing npm in PATH**
   - Ensure Node.js and npm are installed
   - Add npm to system PATH

2. **Permission Errors (Windows)**
   - Run terminal as Administrator
   - Check file permissions in `~/.payments-mcp/`

3. **Network Connectivity**
   - Check internet connection
   - Verify firewall settings

4. **Installation Verification**
   ```bash
   npx @coinbase/payments-mcp status
   npx @coinbase/payments-mcp install --verbose
   ```

## Related Projects

| Project | Description |
|---------|-------------|
| [payments-mcp](https://github.com/coinbase/payments-mcp) | Official Coinbase Payments MCP |
| [x402-mcp](https://vercel.com/blog/introducing-x402-mcp-open-protocol-payments-for-mcp-tools) | Vercel x402 MCP integration |
| [base-mcp](https://github.com/base/base-mcp) | Base Network MCP for on-chain tools |
| [x402](https://github.com/coinbase/x402) | Core x402 protocol |

## Resources

- [Payments MCP Announcement](https://www.coinbase.com/developer-platform/discover/launches/payments-mcp)
- [GitHub Repository](https://github.com/coinbase/payments-mcp)
- [CDP Payments MCP Docs](https://docs.cdp.coinbase.com/payments-mcp/welcome)
- [MCP Tools Reference](https://docs.cdp.coinbase.com/payments-mcp/tools-reference)
- [x402-mcp (Vercel)](https://vercel.com/blog/introducing-x402-mcp-open-protocol-payments-for-mcp-tools)
- [x402 AI Starter Template](https://vercel.com/templates/ai/x402-ai-starter)

## Security

- Report vulnerabilities through Coinbase's HackerOne program
- Do not report security issues via public GitHub issues
- Licensed under Apache License 2.0
