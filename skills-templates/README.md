# Claude Skills Templates

This directory contains production-ready skill templates and examples for Claude AI workflows. Skills are portable workflow automation units that can be used across Claude.ai, Claude Code, and the Claude API.

## 📚 What Are Skills?

**Skills** are reusable workflow automation units that teach Claude how to perform specific tasks according to your requirements. They enable Claude to:

- Execute standardized workflows consistently
- Apply specialized knowledge across projects
- Integrate tools and external services
- Automate complex multi-step processes

## 🗂️ Directory Structure

### Business & Marketing (5 skills)
| Skill | Description |
|-------|-------------|
| **[brand-guidelines](brand-guidelines/)** | Applies Anthropic's official brand colors and typography to artifacts for consistent visual identity |
| **[competitive-ads-extractor](competitive-ads-extractor/)** | Extracts and analyzes competitors' ads from ad libraries to understand messaging and creative approaches |
| **[domain-name-brainstormer](domain-name-brainstormer/)** | Generates creative domain name ideas and checks availability across multiple TLDs (.com, .io, .dev, .ai) |
| **[internal-comms](internal-comms/)** | Resources for writing internal communications (status reports, newsletters, FAQs) using company formats |
| **[lead-research-assistant](lead-research-assistant/)** | Identifies and qualifies high-quality leads by analyzing your product and target companies |

### Cloud Infrastructure (7 skills)
| Skill | Description |
|-------|-------------|
| **[cloudflare-ai-gateway](cloudflare-ai-gateway/)** | Unified interface to AI providers (OpenAI, Azure OpenAI, Anthropic, HuggingFace, Cloudflare Workers AI) with caching, rate limiting, request/response logging, and analytics dashboard for cost tracking and performance monitoring |
| **[cloudflare-ai-search](cloudflare-ai-search/)** | Semantic search and vector embeddings in Cloudflare Workers for building AI-powered search experiences with vector-based retrieval and embedding model integration |
| **[cloudflare-kv](cloudflare-kv/)** | Low-latency key-value storage at the edge with Workers KV - provides get/put/delete/list operations for persistent data access in edge computing environments |
| **[cloudflare-pages](cloudflare-pages/)** | Full-stack JAMstack platform with global CDN, serverless Pages Functions (routing, middleware, TypeScript), native bindings (KV, R2, D1, Durable Objects, Queues, AI), 31+ framework presets, Git/Wrangler deployment, and preview deployments |
| **[cloudflare-pulumi](cloudflare-pulumi/)** | Infrastructure as Code for Cloudflare resources with multi-language support (TypeScript, Python, Go) - automates deployment and management of Workers, Pages, DNS, Firewall, R2, and other Cloudflare services |
| **[cloudflare-r2](cloudflare-r2/)** | S3-compatible object storage with zero egress fees - provides blob storage with complete S3 API compatibility, bucket management, lifecycle policies, public buckets, presigned URLs, and data migration tools |
| **[cloudflare-workers](cloudflare-workers/)** | Serverless edge computing platform with V8 runtime - provides runtime APIs, fetch handlers, Durable Objects for stateful applications, KV bindings, and Workers AI integration for deploying code globally |

### Communication & Email (2 skills)
| Skill | Description |
|-------|-------------|
| **[communication/twilio-voice](communication/twilio-voice/)** | Comprehensive Twilio Voice API assistance with AI integration patterns including OpenAI Realtime API, function-calling voice agents, Conversational Intelligence analytics, and production-ready implementation examples |
| **[mailgun](mailgun/)** | Mailgun email API service - transactional email, email validation, routing, and deliverability optimization for developers |

### Creative & Media (6 skills)
| Skill | Description |
|-------|-------------|
| **[artifacts-builder](artifacts-builder/)** | Suite of tools for creating elaborate React/Tailwind/shadcn UI artifacts with build pipeline |
| **[canvas-design](canvas-design/)** | Creates beautiful visual art in PNG and PDF using design philosophy principles |
| **[image-enhancer](image-enhancer/)** | Improves image quality by enhancing resolution, sharpness, and clarity for professional use |
| **[lobe-vidol](lobe-vidol/)** | LobeVidol virtual idol creation platform - VRM character customization, MMD dance choreography (VMD/PMX), 22+ AI provider integrations, TTS/STT voice conversation, touch responses, and self-hosting via Vercel/Docker |
| **[slack-gif-creator](slack-gif-creator/)** | Creates animated GIFs optimized for Slack with validators for size constraints |
| **[theme-factory](theme-factory/)** | Applies professional font and color themes to artifacts (10 pre-set themes included) |

### Cryptocurrency & Payments (7 skills)
| Skill | Description |
|-------|-------------|
| **[aos-sqlite](aos-sqlite/)** | AO SQLite module for permanent, decentralized database on Arweave - SQL queries in AO processes with permanent storage |
| **[arweave-ao-cookbook](arweave-ao-cookbook/)** | Build decentralized applications on AO - permanent compute platform using actor model for parallel processes with native message-passing and permanent storage on Arweave |
| **[arweave-bridge](arweave-bridge/)** | ZigZag Exchange Arweave Bridge - pay with zkSync stablecoins (USDC/USDT/DAI) for permanent Arweave storage at $1/MB, with ECDSA signature authentication and complete Node.js/Python upload examples |
| **[arweave-standards](arweave-standards/)** | Arweave network standards and specifications for building interoperable permaweb applications |
| **[cryptocurrency/bitcoin-mining](cryptocurrency/bitcoin-mining/)** | Comprehensive Bitcoin mining knowledge from 4 industry reports covering 2024 market analysis, mining economics, operational procedures, and heat reuse strategies for sustainable mining |
| **[cryptocurrency/btcpayserver-doc](cryptocurrency/btcpayserver-doc/)** | BTCPay Server documentation - self-hosted Bitcoin payment gateway with 767 files covering setup, integrations (WooCommerce, Shopify, etc.), Lightning Network, wallets, and deployment |
| **[x402](x402/)** | HTTP 402 payment protocol for crypto-native API monetization - implements USDC payments on Base/Solana, AI agent payments, micropayments, Bazaar service discovery, and MCP server integration |

### Development (17 skills)
| Skill | Description |
|-------|-------------|
| **[chezmoi](chezmoi/)** | Dotfiles manager for cross-machine configuration - 56 CLI commands, Go templates with sprig functions, 15+ password manager integrations (1Password, Bitwarden, pass), age/GPG encryption, source state attributes, and script automation (run_once_, run_onchange_) |
| **[development/ansible](development/ansible/)** | Ansible community documentation - infrastructure automation platform with 786 files covering RST documentation sources, build system (nox/Sphinx), contribution guidelines, and development workflows |
| **[dotenvx](dotenvx/)** | Secure environment variable management with AES-256 encryption - encrypt .env files for safe git commits, multi-environment configuration (dev/staging/production), CLI commands (run/encrypt/decrypt/set/get), and integrations for Node.js, Next.js, Docker, GitHub Actions, and Vercel |
| **[ink](ink/)** | Ink - React for CLI applications, build interactive command-line interfaces using React components with Flexbox layout (Box, Text), hooks for input/focus (useInput, useFocus), testing support, and accessibility features |
| **[lobe-cli-toolbox](lobe-cli-toolbox/)** | LobeHub CLI Toolbox - AI-powered command-line tools including lobe-commit (ChatGPT Git commits with Gitmoji), lobe-i18n (automated internationalization), and lobe-label (GitHub label management) |
| **[lobe-tts](lobe-tts/)** | LobeTTS - High-quality TypeScript TTS/STT toolkit with EdgeSpeech, Microsoft, OpenAI engines, React hooks, audio visualization components, and both server and browser support |
| **[t4-stack](t4-stack/)** | T4 Stack full-stack TypeScript starter for React Native + Web - universal apps (iOS, Android, Web, Desktop) with Tamagui UI, tRPC + Hono API, Cloudflare edge deployment, Drizzle ORM + D1 database, Supabase authentication, and Expo + Next.js monorepo structure |
| **[development/building-bitcoin-rust](development/building-bitcoin-rust/)** | Comprehensive 419-page technical guide to building Bitcoin protocol implementation in Rust, covering cryptographic primitives, blockchain architecture, consensus mechanisms, P2P networking, and wallet development |
| **[ar-io-build](ar-io-build/)** | Comprehensive AR.IO build documentation with 398 sections covering AR.IO features, APIs, and best practices |
| **[changelog-generator](changelog-generator/)** | Automatically creates user-facing changelogs from git commits by analyzing history |
| **[conductor](conductor/)** | Build and deployment orchestration with comprehensive Conductor documentation (40 sections, 96 KB) |
| **[fastapi](fastapi/)** | FastAPI modern Python web framework guide with 102 pages covering APIs, async endpoints, dependency injection, and backend development |
| **[just](just/)** | Just command runner for project task automation with 50+ built-in functions and multi-language support |
| **[mcp-builder](mcp-builder/)** | Guide for creating high-quality MCP (Model Context Protocol) servers for external service integration |
| **[opencode](opencode/)** | OpenCode open source AI coding agent - terminal TUI, desktop app, and IDE extension with multi-provider LLM support, custom agents (Build/Plan/General/Explore), 12 built-in tools, granular permissions, MCP integration, and custom commands |
| **[software-architecture](software-architecture/)** | Clean Architecture and Domain Driven Design principles for quality-focused software development |
| **[webapp-testing](webapp-testing/)** | Toolkit for testing local web applications using Playwright for verifying frontend functionality |

### AI Workflow Development (1 skill)
| Skill | Description |
|-------|-------------|
| **[ai-workflow/langflow](ai-workflow/langflow/)** | Visual AI workflow platform with drag-and-drop interface, 200+ components, MCP client/server support, and enterprise deployment options (142k GitHub stars) |

### AI Platforms & APIs (7 skills)
| Skill | Description |
|-------|-------------|
| **[agentskb](agentskb/)** | AgentsKB - Knowledge Base API for AI Agents with 32K+ technical Q&As from official documentation for grounded, accurate AI responses |
| **[langchainjs](langchainjs/)** | LangChain.js - TypeScript framework for building LLM-powered applications with agents, chains, RAG, tools, memory, and integrations for OpenAI, Anthropic, Google, and hundreds of other providers |
| **[langsmith-agent-builder](langsmith-agent-builder/)** | LangSmith Agent Builder - No-code platform for creating AI agents with built-in tools (Gmail, Slack, GitHub, Linear), OAuth integrations, MCP server support, Slack deployment, and programmatic invocation via LangGraph SDK |
| **[lobe-chat](lobe-chat/)** | LobeChat open-source AI agent workspace (70k+ GitHub stars) - multi-provider LLM support (OpenAI, Claude, Gemini, Ollama, 20+ providers), 505+ pre-built agents, 40+ plugins, knowledge base with RAG, MCP integration, and self-hosting via Docker/Vercel |
| **[moonshot-ai](moonshot-ai/)** | Moonshot AI Kimi API - trillion-parameter MoE model (1T total, 32B active) with 256K context, OpenAI-compatible API, native tool calling, streaming, LiteLLM integration, and competitive pricing for agentic AI applications |
| **[openrouter](openrouter/)** | Unified API gateway for 100+ AI models from multiple providers (OpenAI, Anthropic, Google, Meta, Mistral) - comprehensive documentation (331 KB) covering multi-provider routing, cost optimization, and model comparison |
| **[venice-ai](venice-ai/)** | Privacy-focused AI platform assistance with 49 pages of comprehensive documentation (248 KB) covering platform features, API integration, authentication, and best practices |

### AI Agent Platforms (4 skills)
| Skill | Description |
|-------|-------------|
| **[agentkit](agentkit/)** | Coinbase CDP AgentKit for building AI agents with crypto wallets - 50+ TypeScript actions, 30+ Python actions, multi-chain support (Base, Ethereum, Arbitrum, Optimism, Polygon, Solana), framework integrations (LangChain, Vercel AI SDK, MCP, OpenAI Agents SDK) |
| **[cloudflare-agents](cloudflare-agents/)** | Cloudflare Agents SDK for building AI-powered agents on edge infrastructure - Agent, AIChatAgent, McpAgent classes, WebSocket communication, persistent state management, SQLite database (up to 1GB), task scheduling, human-in-the-loop workflows, MCP server/client integration |
| **[elizaos](elizaos/)** | ElizaOS TypeScript framework for autonomous AI agents - multi-platform support (Discord, Telegram, Twitter, Farcaster), blockchain integration (EVM, Solana DeFi), 90+ plugins, character configuration, memory system, multi-agent orchestration, REST API, and deployment options (Docker, AWS ECS, TEE) |
| **[virtuals-protocol](virtuals-protocol/)** | Virtuals Protocol for tokenized AI agents on Base/Solana - GAME Framework SDK (Python/TypeScript), Agent Tokenization Platform (bonding curves, Prototype→Sentient lifecycle), Agent Commerce Protocol (ACP), $VIRTUAL token economics, and comprehensive code examples |

### AI Integration Protocols (3 skills)
| Skill | Description |
|-------|-------------|
| **[agent-client-protocol](agent-client-protocol/)** | Agent Client Protocol (ACP) - standardized communication between code editors and AI coding agents (JSON-RPC 2.0), supports 18 agents (Claude Code, Gemini CLI, Goose), 15 clients (Zed, JetBrains, Neovim), with TypeScript/Python SDKs for tool calls, file operations, and session management |
| **[language-server-protocol](language-server-protocol/)** | Language Server Protocol (LSP) - Microsoft's open standard for IDE-language server communication (JSON-RPC 2.0), supports 18+ language servers, 15+ editor integrations, with TypeScript/Python/Java/Rust SDKs for completion, diagnostics, navigation, and code intelligence features |
| **[model-context-protocol](model-context-protocol/)** | Model Context Protocol (MCP) - open standard for connecting AI applications to external data sources, tools, and systems with Host→Client→Server architecture, 10 official SDKs (TypeScript, Python, Go, Kotlin, Swift, Java, C#, Ruby, Rust, PHP), and server primitives (Tools, Resources, Prompts) |

### Document Processing (6 skills)
| Skill | Description |
|-------|-------------|
| **[document-processing/docling](document-processing/docling/)** | IBM Research document processing library for parsing 12+ formats (PDF, DOCX, XLSX) with advanced layout understanding, OCR, table extraction, and AI ecosystem integrations (LangChain, LlamaIndex, MCP server) - 48.4k GitHub stars |
| **[document-skills/docx](document-skills/docx/)** | Word document creation, editing, and analysis with tracked changes and comments support |
| **[document-skills/pdf](document-skills/pdf/)** | PDF manipulation toolkit for extracting text/tables, creating PDFs, and handling forms |
| **[document-skills/pptx](document-skills/pptx/)** | PowerPoint presentation creation, editing, and analysis (comprehensive 25K guide) |
| **[document-skills/xlsx](document-skills/xlsx/)** | Excel spreadsheet toolkit with formulas, formatting, data analysis, and visualization |
| **[video-downloader](video-downloader/)** | Downloads videos from YouTube and other platforms for offline viewing or archival |

### Data Services & Analytics (3 skills)
| Skill | Description |
|-------|-------------|
| **[data-services/weavedb](data-services/weavedb/)** | Decentralized database protocol with zero-knowledge proofs and permanent storage on Arweave - comprehensive documentation (398 KB) covering database setup, API usage, and best practices |
| **[geckoterminal-api](geckoterminal-api/)** | GeckoTerminal DeFi/DEX aggregator API - real-time on-chain prices, OHLCV candlestick data, pool analytics, trade history, and trending tokens across 250+ networks and 1,800+ DEXes with Python/Node.js clients (30 calls/min free tier) |
| **[matomo-api](matomo-api/)** | Matomo (Piwik) analytics platform API - web analytics, tracking implementation, reporting API integration, plugin development, PHP/JavaScript tracking clients, and database schema documentation |

### Documentation & Typesetting (3 skills)
| Skill | Description |
|-------|-------------|
| **[documentation/latex-manual](documentation/latex-manual/)** | Comprehensive LaTeX reference with 6 guides (quick-start, mathematics, formatting, tables/graphics, bibliography, troubleshooting), 5 production templates (article, report, beamer, letter, IEEE), and 3 helper scripts for compilation workflow - covers 90%+ of LaTeX use cases |
| **[documentation/latex-wikibook](documentation/latex-wikibook/)** | Comprehensive LaTeX tutorials from WikiBooks - covers LaTeX fundamentals, best practices, formatting, and document preparation |
| **[starlight](starlight/)** | Starlight documentation theme built on Astro - full-featured docs framework with built-in search (Pagefind), i18n support (20+ languages), MDX components (Tabs, Cards, Steps, FileTree), customizable styling (CSS/Tailwind), and sidebar navigation for creating beautiful documentation websites |

### Infrastructure & DevOps (3 skills)
| Skill | Description |
|-------|-------------|
| **[dokploy](dokploy/)** | Open-source PaaS alternative to Vercel/Netlify/Heroku - deploy applications, databases, and Docker Compose stacks with Traefik routing, Let's Encrypt SSL, and Docker Swarm orchestration |
| **[dokploy-mcp](dokploy-mcp/)** | AI-driven deployment management using Dokploy MCP server - manage projects, applications, databases (PostgreSQL, MySQL, MongoDB, Redis), domains, and deployments via Model Context Protocol |
| **[infrastructure/terraform](infrastructure/terraform/)** | HashiCorp Terraform Infrastructure as Code (IaC) tool for provisioning, managing, and versioning cloud infrastructure across AWS, Azure, GCP, and other providers - comprehensive 33KB guide with state management, modules, and production examples |

### Productivity & Organization (6 skills)
| Skill | Description |
|-------|-------------|
| **[content-research-writer](content-research-writer/)** | Assists in writing high-quality content by conducting research, adding citations, and providing feedback |
| **[developer-growth-analysis](developer-growth-analysis/)** | Analyzes Claude Code chat history to identify coding patterns and curate learning resources |
| **[file-organizer](file-organizer/)** | Intelligently organizes files and folders by understanding context and finding duplicates |
| **[invoice-organizer](invoice-organizer/)** | Automatically organizes invoices and receipts for tax preparation |
| **[meeting-insights-analyzer](meeting-insights-analyzer/)** | Analyzes meeting transcripts to uncover behavioral patterns and communication insights |
| **[raffle-winner-picker](raffle-winner-picker/)** | Randomly selects winners from lists or spreadsheets using cryptographically secure randomness |

### Security & Authentication (2 skills)
| Skill | Description |
|-------|-------------|
| **[passwordless-docs](passwordless-docs/)** | Bitwarden Passwordless.dev documentation - WebAuthn/FIDO2 authentication, SDKs (JavaScript, .NET, Python), React examples, and passkey implementation patterns |
| **[sdk-sm](sdk-sm/)** | Bitwarden Secrets Manager SDK - programmatic secrets management for applications with secure key storage and retrieval |

### Testing/QA (1 skill)
| Skill | Description |
|-------|-------------|
| **[pict-test-designer](pict-test-designer/)** | Designs comprehensive test cases using PICT (Pairwise Independent Combinatorial Testing) for systematic coverage |

### Meta/Development Skills (3 skills)
| Skill | Description |
|-------|-------------|
| **[prompt-engineering](prompt-engineering/)** | Advanced prompt engineering patterns for commands, hooks, skills, and LLM interactions |
| **[skill-creator](skill-creator/)** | Provides guidance for creating effective Claude Skills with specialized knowledge |
| **[skill-share](skill-share/)** | Creates new Claude skills and automatically shares them on Slack using Rube |

### Orchestration Skills (4 skills)
| Skill | Description |
|-------|-------------|
| **[orchestration/multi-agent-planner-skill](orchestration/multi-agent-planner-skill.md)** | Automated MULTI_AGENT_PLAN.md generation with dependency analysis |
| **[orchestration/parallel-executor-skill](orchestration/parallel-executor-skill.md)** | Concurrent task execution with work distribution and result aggregation |
| **[orchestration/worktree-manager-skill](orchestration/worktree-manager-skill.md)** | Git worktree lifecycle management and merge strategies |
| **[orchestration/agent-communication-skill](orchestration/agent-communication-skill.md)** | Inter-agent messaging and handoffs for coordination |

## 🚀 Using Skills

### In Claude.ai
1. Click the skill icon (🧩) in your chat interface
2. Add skills from the marketplace or upload custom skills
3. Claude automatically activates relevant skills based on your task

### In Claude Code
1. Place the skill directory in `~/.claude/skills/`:
   ```bash
   cp -r skills-templates/skill-name ~/.claude/skills/
   ```

2. Start Claude Code:
   ```bash
   claude
   ```

3. The skill loads automatically and activates when relevant

### Via API
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["skill-id-here"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## 🛠️ Supporting Files

Many skills include supporting infrastructure:

### Scripts
- **artifacts-builder/scripts/** - Build pipeline automation
  - `init-artifact.sh` - Initialize React project
  - `bundle-artifact.sh` - Bundle to single HTML file
- **skill-creator/scripts/** - Skill creation automation

### Themes & Templates
- **theme-factory/themes/** - 10 professional themes
  - sunset-boulevard, tech-innovation, arctic-frost, modern-minimalist, etc.
- **internal-comms/examples/** - 4 communication templates
  - FAQ answers, newsletters, general comms, 3P updates

### Reference Documentation
- **mcp-builder/reference/** - MCP best practices (4 docs)
  - Python/Node server examples, evaluation guide
- **document-skills/*/reference/** - Office format specifications
  - OOXML specs, conversion guides, form handling

## 📖 Skill Anatomy

Each skill directory typically contains:

```
skill-name/
├── SKILL.md                 # Required: Main skill file with instructions
├── scripts/                 # Optional: Helper scripts
├── themes/                  # Optional: Theme files
├── examples/                # Optional: Usage examples
├── reference/               # Optional: Reference documentation
└── LICENSE.txt             # Optional: License information
```

### SKILL.md Structure
```markdown
---
name: skill-name
description: Clear description of what this skill does
license: Complete terms in LICENSE.txt (optional)
---

# Skill Name

Detailed description and instructions...

## When to Use This Skill
- Use case 1
- Use case 2
```

## 🎓 Creating New Skills

### Quick Start
1. Use the **skill-creator** skill for guided creation:
   ```
   Use the skill-creator skill to help me build a skill for [your workflow]
   ```

2. Or start from a template:
   - **Minimal**: `../templates/skills/minimal-skill-template.md`
   - **Standard**: `../templates/skills/standard-skill-template.md`
   - **Comprehensive**: `../templates/skills/comprehensive-skill-template.md`

### Best Practices
- Focus on specific, repeatable tasks
- Include clear examples and edge cases
- Write instructions for Claude, not end users
- Test across Claude.ai, Claude Code, and API
- Document prerequisites and dependencies
- Include error handling guidance

## 📊 Skill Statistics

- **Total Skills**: 76
- **Individual Skills**: 68
- **AI Agent Platform Skills**: 4 (AgentKit, Cloudflare Agents, ElizaOS, Virtuals Protocol)
- **AI Platforms & APIs**: 7 (AgentsKB, LangChain.js, LangSmith Agent Builder, LobeChat, Moonshot AI, OpenRouter, Venice AI)
- **Development Skills**: 17 (including chezmoi, Ink, Lobe CLI Toolbox, Lobe TTS)
- **AI Integration Protocol Skills**: 3 (Agent Client Protocol, Language Server Protocol, Model Context Protocol)
- **Cloud Infrastructure Skills**: 7 (Cloudflare Developer Platform)
- **Cryptocurrency & Payments Skills**: 7 (AO SQLite, Arweave AO Cookbook, Arweave Bridge, Arweave Standards, Bitcoin Mining, BTCPayServer, x402)
- **Infrastructure & DevOps**: 3 (Dokploy, Dokploy MCP, Terraform)
- **Security & Authentication**: 2 (Passwordless, Secrets Manager SDK)
- **Document Processing Suite**: 6
- **Orchestration Skills**: 4
- **Average Quality Score**: 97.2/100 (from integration validation)
- **Total Content**: ~1.5 MB of skill documentation (including 378 MB Cloudflare platform docs)
- **Supporting Files**: 400+ (scripts, themes, examples, references)

## 🔗 Resources

### Official Documentation
- [Claude Skills Overview](https://www.anthropic.com/news/skills) - Official announcement
- [Skills User Guide](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [Creating Custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Skills API Documentation](https://docs.claude.com/en/api/skills-guide)
- [Agent Skills Blog Post](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

### Repository Documentation
- [08-Claude-Skills-Guide](../docs/best-practices/08-Claude-Skills-Guide.md) - Comprehensive skills guide
- [09-Agent-Skills-vs-Multi-Agent](../docs/best-practices/09-Agent-Skills-vs-Multi-Agent.md) - Architecture decisions
- [12-Skills-First-Planning-and-Orchestration](../docs/best-practices/12-Skills-First-Planning-and-Orchestration.md) - Planning workflows

### Community
- [Awesome Claude Skills](https://github.com/composiohq/awesome-claude-skills) - Community skill collection
- [Anthropic Skills Repository](https://github.com/anthropics/skills) - Official examples

## 🤝 Contributing

Contributions are welcome! To add a new skill:

1. Create skill directory following the structure above
2. Ensure SKILL.md has valid frontmatter (name, description)
3. Test the skill across platforms
4. Submit a pull request with clear documentation

## 📄 License

Individual skills may have different licenses. Check each skill's directory for specific licensing information. Many skills include a `LICENSE.txt` file.

---

**Last Updated**: 2026-01-14
**Total Skills**: 76
**Repository**: [claude-command-and-control](https://github.com/enuno/claude-command-and-control)
