# The Only AI Agent Architecture Guide You'll Ever Need

I spent the last few months obsessing over one question: if someone asked me to build them an AI agent today, what would I actually recommend?
Not the theoretical answer. Not the "it depends" consultant-speak. The specific tools, the exact architecture, the stack I'd bet my reputation on for their situation.
So I pulled apart every framework, memory system, LLM routing strategy, and data layer I could find. I talked to builders. I tested combinations. I read documentation until my eyes glazed over.
What came out is this guide.
It's opinionated. It's specific. And it maps real client profiles to real stacks - with setup checklists you can actually follow.
Whether you're building agents for clients or trying to understand what your AI consultant should be recommending, this is the architecture playbook.

## The Six-Layer Agent Stack

Here's the mental model that makes everything click.
Every custom AI agent - no matter how simple or complex - breaks down into six layers. Think of it like building a house: you don't pick the paint color before you pour the foundation.

```
         ┌──────────────────┐
         │  AGENT HARNESS   │ ← Orchestration & glue
         ├──────────────────┤
         │       LLM        │ ← The reasoning engine
         ├──────────────────┤
         │     SKILLS       │ ← Domain expertise modules
         ├──────────────────┤
         │ SESSION & MEMORY │ ← Context persistence & recall
         ├──────────────────┤
         │      TOOLS       │ ← Single-purpose integrations
         ├──────────────────┤
         │      DATA        │ ← Your personalized foundation
         └──────────────────┘
```

Each layer depends on the one beneath it. Get the foundation wrong and nothing above it works right.
Most people start at the top -"which AI model should I use?" - and work their way down. That's backwards. You start with data. Always.

## Layer 1: Data - The Foundation Everything Else Stands On

The data layer is the bedrock. Every decision above it depends on what data you have, where it lives, how sensitive it is, and how it needs to be accessed.
Skip this layer or rush through it, and you'll rebuild later. I've seen it happen too many times.
The Three Types of Data Storage You Need to Know
Vector Databases are what make "find me something similar" work. They store embeddings - mathematical representations of your content - and retrieve them based on meaning, not just keywords. This is the engine behind RAG (Retrieval Augmented Generation), which is how agents pull in relevant context from your data.

```
Database    Deployment             Best For                            Compliance
 ─────────── ────────────────────── ─────────────────────────────────── ──────────────────────────
 Pinecone    Managed cloud          Enterprise RAG, sub-10ms latency    SOC 2, HIPAA, ISO 27001
 Qdrant      Self-hosted or cloud   Privacy-first, advanced filtering   Self-hosted = full control
 Weaviate    Self-hosted or cloud   Hybrid search + knowledge graphs    Self-hosted option
 ChromaDB    Local/embedded         Prototyping, developer speed        Local only
 pgvector    PostgreSQL extension   Teams already on Postgres           Inherits Postgres compliance
 Milvus      Distributed            Billions of vectors, GPU accel.     Enterprise options
```
 
**Document Stores** hold the raw source material and structured metadata alongside it.

```
 Store           Best For                                Agent Integration
  ─────────────── ─────────────────────────────────────── ──────────────────────────────────────────
  MongoDB         Converged data (vectors + docs + mem)   Native vector search, flexible schema
  Elasticsearch   Hybrid BM25 + vector search, analytics  Agent Builder framework, real-time indexing
  PostgreSQL      Relational data + vector via pgvector   Familiar, ACID-compliant, battle-tested
```

**Graph Databases** capture relationships between entities. When your agent needs to answer "how are these two things connected?" or traverse complex webs of information, that's graph territory.

```
Database         Best For                              Query Language
 ──────────────── ───────────────────────────────────── ─────────────────
 Neo4j            Knowledge graphs, 75% of Fortune 100  Cypher
 Amazon Neptune   AWS-native, serverless scaling         Gremlin + SPARQL
 FalkorDB         Lightweight, fast graph operations     Cypher-compatible
```

### The Data Privacy Decision That Shapes Everything

The first question with any client - before tools, before models, before anything: **where does the data live and who can see it?**

This single question determines half your architecture.

**Public/Non-Sensitive Data** - Cloud-managed services are fine. Pinecone, managed Qdrant Cloud, or Weaviate Cloud. Lower operational burden, faster time-to-value. Most solopreneurs and small businesses live here.

**Proprietary but Non-Regulated** - Hybrid approach. Self-host the vector DB (Qdrant or Milvus) while using managed LLM APIs. Your data stays on your infrastructure; only queries hit the cloud.

**Regulated (HIPAA, SOC 2, GDPR)** - Full self-hosting or private cloud. Self-hosted Qdrant + on-premise Neo4j + customer-managed encryption keys. LLM inference via Azure Private Endpoints or self-hosted open-source models. Budget $8K-25K additional for compliance implementation. This is where things get real.

**Air-Gapped / Government** - Everything on-premise. Self-hosted open-source LLMs (Kim K2.5 Thinking, DeepSeek, MiniMax, Mistral), local vector DB, local graph DB. Zero external API calls. If you're in this world, you already know it.

The Data Pipeline: How Raw Stuff Becomes Agent-Ready

Raw data must be parsed, chunked, embedded, and indexed before agents can use it. Here's the flow:

```
Raw Sources → Parsing → Chunking → Enrichment → Embedding → Storage
(PDF, DOCX,   (Extract   (Semantic   (Metadata,   (Model-     (Vector DB
 HTML, CSV)    text)      segments)   cleaning)    specific)   + Doc Store)
```

Here's the thing nobody tells you: **chunking strategy matters more than most people realize.** Smaller chunks give focused retrieval but lose context. Larger chunks preserve context but may include noise. Semantic chunking - splitting by meaning rather than character count - is the current best practice.

Keep tables together. Preserve code blocks intact. Use overlap between chunks to maintain continuity.

**Tool to try:** Unstructured.io - open-source platform that handles multi-format parsing, intelligent chunking, and metadata preservation.

Data Layer Setup Checklist

```
- [ ] Audit client data sources (types, volume, sensitivity classification)
- [ ] Determine data residency requirements (region, on-premise, cloud)
- [ ] Select compliance framework (SOC 2, HIPAA, GDPR, or none)
- [ ] Choose vector database based on scale and deployment model
- [ ] Choose document store for raw content and metadata
- [ ] Evaluate need for knowledge graph (if relationship queries are critical)
- [ ] Design chunking strategy (semantic preferred, with overlap)
- [ ] Set up embedding pipeline (model selection: OpenAI ada-002, Cohere, or self-hosted)
- [ ] Implement encryption at rest (AES-256) and in transit (TLS 1.2+)
- [ ] Define data retention and deletion policies
- [ ] Set up incremental update pipeline for ongoing ingestion
```
 
---
 
## Layer 2: Tools - The Agent's Hands
 
Tools are how agents interact with the outside world. Each tool does exactly one thing, takes defined inputs, and produces predictable outputs.
 
The Single Responsibility Principle is non-negotiable here. A tool that does two things is two tools that should be separated. Period.
 
### What Makes a Good Tool
 
A well-designed tool is four things: atomic (one operation), deterministic (predictable output), typed (JSON schema inputs/outputs), and least-privileged (minimum necessary permissions).
 
Vague parameter descriptions cause agents to make wrong choices. Strong typing and clear documentation are the difference between a reliable agent and one that hallucinates its way through your workflow.
 
### Three Ways to Build Tools
 
**Python Tools via Astral UV** - This is my favorite for speed-to-build. UV enables truly self-contained Python scripts using PEP 723 inline metadata. Dependencies are declared inside the script itself, and uv run installs them in an ephemeral virtual environment.
 
No virtualenv management. No requirements.txt. No dependency conflicts between tools.

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx", "beautifulsoup4"]
# ///
import httpx
from bs4 import BeautifulSoup

def scrape_title(url: str) -> str:
    resp = httpx.get(url)
    return BeautifulSoup(resp.text, "html.parser").title.string
```

UV is specifically designed for agent skill distribution: write once, run identically everywhere. Use uv lock for deterministic reproducibility.

**Go CLI Tools** - Go compiles to a single binary with zero runtime dependencies. No "did you install Python 3.12?" conversations. The Cobra framework (used by Docker, Kubernetes, Hugo) provides battle-tested CLI scaffolding. Go's performance characteristics make tight agent feedback loops viable at scale.

**MCP (Model Context Protocol) Servers** - MCP is the open standard for connecting LLM clients to external tools and data sources. An MCP server exposes tools via tools/list (discovery) and tools/call (execution) endpoints with JSON Schema contracts. Pre-built MCP servers exist for Google Drive, Slack, GitHub, Postgres, and dozens of other services.

### When to Use What
```
Approach           When to Use                                        Trade-off
 ────────────────── ────────────────────────────────────────────────── ──────────────────────────────
 UV Python scripts  Rapid development, data processing, API integrations  Slower execution than compiled
 Go CLI binaries    Performance-critical, cross-platform distribution     Longer development cycle
 MCP servers        Standardized integrations, multi-agent ecosystems     Protocol overhead
 HTTP callables     Existing REST APIs, microservices                     Network latency
```
 
### Tools Layer Setup Checklist

```
- [ ] Inventory required integrations (APIs, databases, file systems, services)
- [ ] Classify each integration as a single-purpose tool
- [ ] Choose implementation language per tool (UV Python for speed, Go for performance)
- [ ] Define JSON schemas for all tool inputs and outputs
- [ ] Implement least-privilege credentials (scoped API keys per tool)
- [ ] Set up MCP server for tools that need standardized discovery
- [ ] Write tool documentation (clear parameter descriptions reduce agent errors)
- [ ] Create error handling patterns (tools should return structured errors, not crash)
- [ ] Test each tool in isolation before agent integration
- [ ] Set up tool versioning strategy
```

## Layer 3: Skills - This Is Where It Gets Interesting

Skills represent a genuine paradigm shift. Released as an open standard by Anthropic in December 2025, skills are now adopted by Microsoft (VS Code, GitHub Copilot), OpenAI (Codex), Google (Gemini CLI), Cursor, Goose, and dozens of other platforms.

This is the layer most people don't know about yet. And it's a game-changer for how agents actually perform.

### Skills vs. Tools: What's the Difference?

Tools execute operations and return results. Skills inject domain expertise and behavioral guidance into the agent's reasoning.

A tool is "call this API." A skill is "here's how an expert approaches this entire domain - including which tools to use, in what order, and what to watch out for."

```
Aspect            Tools                        Skills
 ───────────────── ──────────────────────────── ──────────────────────────────────────────────────
 Context loading   All schemas loaded upfront   Progressive disclosure (~100 bytes metadata upfront)
 Token cost        High schema overhead         500x more efficient than MCP for large libraries
 Function          Execute specific actions     Guide reasoning and approach
 Extensibility     Requires code changes        Drop a SKILL.md file, no code
 Portability       Framework-specific           Works across all compatible agents
```

Here's the key insight: **enterprises need both.** Tools provide action capability. Skills provide reasoning strategy. An agent with only tools lacks domain expertise. An agent with only skills can't execute.
 
### How Skills Work Under the Hood

``` 
 .agent/skills/
 ├── contract-review/
 │   ├── SKILL.md          # Entry point: YAML frontmatter + markdown
 │   ├── scripts/          # Executable code (Python, Bash)
 │   ├── references/       # Supporting documentation
 │   ├── assets/           # Templates, fonts, images
 │   └── templates/        # Structured prompts or forms
```
 
The SKILL.md file has two parts: YAML frontmatter (name, description, compatibility) and a markdown body with full instructions. At startup, only the frontmatter metadata loads - about 100 bytes per skill. When the agent determines a skill is relevant, it loads the full SKILL.md. Referenced resources load on-demand.
 
### Why Progressive Disclosure Matters

This is the core innovation that most people miss.

Traditional MCP servers with 90+ tools consume 50,000+ tokens of JSON schema before the agent even starts reasoning. That's expensive, slow, and wasteful.

Skills use a three-tier loading model:

1. **Metadata** - Name + description only (~100 bytes). Always in context.
2. **Full instructions** - Complete SKILL.md body. Loaded when activated.
3. **Resources** - Scripts, templates, references. Loaded on-demand.

An agent can have access to thousands of skills without context window bloat. That's 500x more efficient. Not an exaggeration  actual measured difference.

### Skills Layer Setup Checklist

```
- [ ] Identify domain expertise areas the agent needs
- [ ] Audit existing 40,000+ community skills at agentskills.io
- [ ] Write custom SKILL.md files for client-specific domains
- [ ] Keep SKILL.md body under 500 lines (best practice)
- [ ] Structure skills with scripts/, references/, and templates/ subdirectories
- [ ] Implement progressive disclosure in the agent framework
- [ ] Test skill activation triggers (does the agent load the right skill?)
- [ ] Set up cross-platform distribution if needed
- [ ] Create skill evaluation pipeline (test prompts, grading criteria)
- [ ] Version control all skills alongside the codebase
```

## Layer 4: Session & Memory - What Separates a Chatbot from an Agent

Memory is the line between "helpful tool" and "genuinely useful agent." The session layer persists context across interactions. The memory layer enables the agent to recall, learn, and evolve.

Without memory, every conversation starts from zero. With it, your agent gets smarter over time.

### The Five Types of Agent Memory

This maps to cognitive science, and understanding it will change how you think about agent design:

```
Type                  Purpose                                   Storage                    Lifetime
 ───────────────────── ───────────────────────────────────────── ────────────────────────── ──────────────
 Working Memory        Active context for current decision       In-context window          Single turn
 Short-Term (Episodic) Full conversation history, tool call logs JSON session files         One session
 Medium-Term           Compressed summaries, extracted facts     Vector DB + session store  Days to weeks
 Long-Term (Semantic)  User preferences, relationships, patterns Vector DB + knowledge graph Persistent
 Procedural            Agent behavior rules and strategies       Skills + system prompts    Permanent
``` 

### How to Persist Sessions

**JSON File-Based Sessions** - The simplest approach. Each session is a directory with metadata, individual turn files, and accumulated agent state. Git-friendly, zero infrastructure, easy to debug. Not scalable for concurrent users, but perfect for prototyping.

**Database-Backed Sessions** - For production. Options include SQLite (development), PostgreSQL (production ACID), Redis (sub-1ms latency), MongoDB (flexible schema), and DynamoDB (AWS serverless).

---

### How Agents Remember: Two Architectures

**Vector Search (Semantic Recovery)** - Store conversation turns and facts as embeddings. Retrieve by semantic similarity. Best for "find me something related to X" queries. This is your broad recall system.

**Knowledge Graphs (Structured Recovery)** - Store entities and relationships with temporal metadata. Best for "how are X and Y connected?" and "what changed about X over time?" queries. Graphiti (by Zep) is the leading engine here — it combines semantic embeddings with keyword search and graph traversal.

**The production recommendation: use both.** Hybrid memory combines vector search for broad semantic recall with knowledge graphs for structured relationship queries and session files for conversation continuity.

```
┌─────────────────────────────────────┐
│   WORKING MEMORY (Context Window)   │
│  Current conversation + task state  │
│  Lifetime: Single interaction       │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   SEMANTIC LAYER (Vector Search)    │
│  Embeddings of past interactions    │
│  Metadata filtering + similarity    │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  KNOWLEDGE LAYER (Graph Database)   │
│  Entity relationships + temporal    │
│  validity + logical inference       │
└─────────────────────────────────────┘
```

### Memory Frameworks Worth Knowing

**Mem0** - Universal memory layer. Works with OpenAI, LangGraph, CrewAI. SOC 2 and HIPAA compliant. Self-improving through priority scoring. 26% improvement over OpenAI baseline, 91% lower p95 latency, 90% token cost savings. This is the easiest on-ramp.

**Letta (formerly MemGPT)** - OS-inspired memory management where agents actively edit their own memory. Core Memory (always visible) + Archival Memory (unlimited, search-on-demand). Enables personality evolution and user learning over time. Fascinating technology.

**Zep / Graphiti** - Temporal knowledge graph platform. Real-time graph updates without batch recomputation. Outperforms MemGPT by 18.5% accuracy in LongMemEval benchmarks.

**Supermemory** - Visualizes memories as interconnected knowledge graphs with backend API for storage, processing, and retrieval.

### Session & Memory Setup Checklist

```
- [ ] Define memory requirements (how far back does the agent need to remember?)
- [ ] Choose session persistence (JSON files for dev, database for production)
- [ ] Select vector database for semantic memory
- [ ] Evaluate need for knowledge graph (Graphiti/Neo4j for relationship-heavy domains)
- [ ] Choose memory framework (Mem0 for general use, Zep for temporal, Letta for self-editing)
- [ ] Implement hierarchical summarization (recent turns verbatim, older ones compressed)
- [ ] Set up memory consolidation pipeline
- [ ] Define memory cleanup policies (TTL, relevance decay, conflict resolution)
- [ ] Implement multi-agent memory sharing if applicable
- [ ] Test memory recovery accuracy
- [ ] Monitor memory growth and token costs over time
```

---

## Layer 5: The LLM - Picking the Brain

The LLM layer is where reasoning happens. But the choice here isn't just "which model." It's "which models, when, and how do they work together."

This is where most people overspend or underperform. Getting the routing right is the difference between a $200/month agent and a $2,000/month one that produces the same results.

### The Current Model Landscape

```
Model                    In / Out (/M tokens)  Speed         Reasoning               Context      Best For
 ──────────────────────── ───────────────────── ───────────── ─────────────────────── ──────────── ──────────────────────────────────
 Claude Opus 4.6          $5 / $25              71 tok/s      Elite (1,606 Elo)       200K (1M β)  Autonomous agents, complex reasoning
 Claude Sonnet 4.5        $3 / $15              ~95 tok/s     Excellent (77.2% SWE)   200K (1M β)  Fast iteration, dev tools, code
 GPT-5.2                  $2.50 / $10           Good          Elite (80% SWE)         400K         Enterprise code, multi-doc reasoning
 GPT-o1                   $15 / $60             Slow          Expert-level reasoning  128K         Deep reasoning (27x cost of alternatives)
 Gemini 3 Pro             $2 / $12              ~130 tok/s    Very High (90.1% MMLU)  1M+          Production agents, knowledge tasks
 Gemini 3 Flash           $0.075 / $0.40        Very fast     High (88.6% MMLU)       200K+        High-volume, budget agents
 Llama 4 Maverick (OSS)   Self-hosted           Variable      Very Strong (400B)      1M           Privacy-first, on-premise agents
 Llama 4 Scout (OSS)      Self-hosted           Variable      Strong                  10M          Extreme context (entire codebases)
 DeepSeek R1 (OSS)        $0.55 / $2.19         Moderate      Expert reasoning        128K         Budget reasoning (27x cheaper than o1)
 Qwen3-Coder-Next (OSS)   Self-hosted           Very fast     Strong (70.6% SWE)      262K         Coding agents, edge deployment
```

---

### Single Vendor vs. Multi-Model: The Real Decision

**Single Vendor (e.g., Claude-only via Claude Agent SDK)** - Simpler implementation, deterministic performance, easier compliance. Risk: vendor lock-in. Choose this when you're starting out, trust the vendor's roadmap, and want to move fast.

**Multi-Model Orchestration** - Route requests to the best model for each task. Up to 85% cost savings documented. Higher availability through fallback. This is the production play.

---

### Three Routing Patterns That Work

**Task-Type Routing** - Route by what the agent is doing:

- Classification/summarization → Gemini Flash (cheap, fast)
- Code generation → OpenAI Codex (best-in-class)
- Complex reasoning → Claude Opus (best-in-class)
- Multimodal → Gemini Pro (1M context, vision)
- Real-time chat → fastest available model (xAI for socials)

**Cascade Routing** - Start cheap, escalate on uncertainty:

1. Run query through small model with confidence threshold (e.g., 0.7)
2. If confident, accept the response
3. If not, escalate to mid-tier
4. If still uncertain, escalate to frontier
5. Result: 85% cost reduction with 95% quality maintenance

**Fallback Routing** - Primary → secondary → tertiary. Monitor provider health every 30 seconds. Automatic circuit breaking on failures. This keeps your agent running when providers go down.

---

### The Routing Infrastructure

**OpenRouter** - Fully managed, zero infrastructure. Monitors provider health, automatically routes away from degraded providers. Best for teams that don't want to manage routing.

**LiteLLM** - Open-source proxy you self-host. Redis-based usage tracking, multiple routing strategies. Best for teams wanting control. Can use OpenRouter as a backend provider for a hybrid approach.

**Helicone** - Observability layer. 8ms P50 latency overhead. Native cost tracking, Redis caching (up to 95% cost reduction on repeated queries). Essential for production multi-model deployments.

---

### When to Self-Host

Self-host when:
- Processing millions of tokens/day (cost savings exceed hardware costs)
- Data cannot leave your infrastructure
- Operating in regulated industries

**Don't** self-host for: prototyping, low volume (under 100K tokens/day), limited MLOps expertise, or when you need capabilities only proprietary models offer.

### LLM Layer Setup Checklist

```
- [ ] Profile workload types (reasoning, classification, generation, multimodal)
- [ ] Decide single-vendor vs multi-model based on volume and complexity
- [ ] If multi-model: set up routing infrastructure (OpenRouter or LiteLLM)
- [ ] Define model assignments per task type
- [ ] Implement cascade routing with confidence thresholds (if cost-sensitive)
- [ ] Set up fallback chains with health monitoring
- [ ] Implement rate limiting per provider
- [ ] Set up observability (Helicone or equivalent)
- [ ] If self-hosting: provision GPU infrastructure, set up vLLM
- [ ] Benchmark routing strategy on held-out traffic before production
```

---

## Layer 6: The Agent Harness - The Glue That Holds It All Together

The agent harness is the orchestration layer that binds everything below it into a functioning system. It manages the agent loop (prompt → reason → act → observe → repeat), coordinates tools and skills, and handles state management.

This is where your philosophy about building shows up.

The Frameworks Worth Knowing

**Pi-Mono** - Minimal, opinionated coding agent toolkit. Four core tools only (read, write, edit, bash). System prompt under 1,000 tokens. Supports 20+ LLM providers. Open source.

```
Pi-Mono
 ─────────────── ────────────────────────────────────────────────────────────
 Best For        Developers who want minimal foundations to extend
 LLM Support     20+ providers (OpenAI, Anthropic, Google, Mistral, Bedrock)
 Limitation      Smaller ecosystem, requires CLI comfort
```

The philosophy: "What you leave out matters more than what you put in." If you believe in stack simplicity, this one's for you.

**Claude Agent SDK** - Anthropic's official SDK. Same agent loop and tools system that powers Claude Code, packaged as a programmable library. Python and TypeScript. Automatic context management with message summarization. Native MCP support.

```
Claude Agent SDK
 ─────────────── ────────────────────────────────────────────────────────────
 Best For        Production Claude deployments with security requirements
 LLM Support     Claude models only
 Limitation      Vendor lock-in to Anthropic
```

**MindStudio** - Visual, no-code agent builder. 200+ model access, 1,000+ pre-built integrations. Average build time 15 minutes to 1 hour. If you're building for non-technical clients, this is your answer.

```
MindStudio
 ─────────────── ────────────────────────────────────────────────────────────
 Best For        Business users, rapid prototyping, non-technical teams
 LLM Support     200+ models from multiple providers
 Limitation      Proprietary SaaS, limited customization, no self-hosting
```

**OpenClaw** - Free, open-source (MIT), self-hosted agent that connects to messaging platforms (WhatsApp, Telegram, Discord, Slack). 100+ pre-configured skills. Semantic Snapshots for web automation that use 100x fewer tokens than screenshots.

```
OpenClaw
 ─────────────── ────────────────────────────────────────────────────────────
 Best For        multi-channel agents, self-hosting
 LLM Support     Any API-compatible LLM
 Limitation      Requires infrastructure knowledge, steeper learning curve
```

### Other Frameworks Worth Mentioning

**CrewAI** - Multi-agent orchestration with role-based teams. 100+ built-in tools, 5.76x faster than LangGraph for certain tasks.

**LangGraph** - Low-level DAG-based orchestration from LangChain. Durable execution with failure recovery. Human-in-the-loop with state inspection.

**Dify** - Open-source platform combining visual workflow builder, RAG engine, agent capabilities, and model management.

---

### Agent Architecture Patterns

**Single Agent** - One agent, all tools. Works well with up to 10-15 tools. Simpler to build and debug. Sufficient for well-bounded tasks.

**Multi-Agent with Subagents** - Primary agent delegates to specialized subagents. Each gets its own context window and tools. Anthropic research shows multi-agent Claude Opus 4 + Sonnet subagents outperformed single-agent Opus 4 by 90.2%. That's not a typo.

**Router Pattern** — Lightweight agent classifies incoming requests and dispatches to specialists. Each specialist handles one domain. Clean separation of concerns.

**Pipeline Pattern** -Sequential agents, each performing one step. Output of one becomes input to the next. Good for workflows with clear stages.

**Human-in-the-Loop** - Agent proposes actions at critical checkpoints. Human approves, modifies, or rejects. Essential for high-stakes decisions. Non-negotiable for anything touching money, legal, or customer-facing communication.

### Agent Harness Setup Checklist

```
- [ ]  Assess team technical capability (no-code, low-code, full-code)
- [ ]  Evaluate single-agent vs multi-agent requirement
- [ ]  Select framework based on LLM strategy (vendor-specific vs multi-model)
- [ ]  Implement agent loop with proper error handling and retry logic
- [ ]  Configure tool and skill discovery and loading
- [ ]  Set up session management and memory integration
- [ ]  Implement human-in-the-loop checkpoints for high-stakes actions
- [ ]  Set up logging and observability for agent decisions
- [ ]  Define agent permission boundaries
- [ ]  Test end-to-end: user request → reasoning → tool use → response
- [ ]  Set up CI/CD for agent deployment and skill updates
```

---

## The Six Patterns: Matching Stacks to Real Situations

This is where the guide gets practical. Instead of wading through options, find the pattern that matches your client and follow the prescription.

### Pattern 1: The Startup MVP

Who this is for: Early-stage company, small team, limited budget, needs to move fast, non-sensitive data.

### The Stack:
- Data: ChromaDB (embedded) + PostgreSQL
- Tools: UV Python scripts + MCP servers for SaaS integrations
- Skills: Community skills from agentskills.io + 2-3 custom SKILL.md files
- Memory: JSON file sessions + ChromaDB for semantic search
- LLM: Single vendor (Claude via API or GPT-5.3)
- Harness: Pi-Mono or Claude Agent SDK
- Why this works: Minimal infrastructure, fast iteration, low cost. ChromaDB embeds directly in the application. UV scripts deploy instantly. Single-vendor = - LLM avoids routing complexity. Everything runs on a single server.
- Monthly cost: $50-200 (LLM API costs only)

### Setup Checklist:

```
- [ ] Set up PostgreSQL for application data
- [ ] Initialize ChromaDB for vector storage (embedded mode)
- [ ] Create UV Python tools for core integrations
- [ ] Write 2-3 custom SKILL.md files for domain expertise
- [ ] Configure Pi-Mono or Claude Agent SDK with single model
- [ ] Implement JSON session files for conversation persistence
- [ ] Deploy to single server or container
- [ ] Set up basic logging
- [ ] Test end-to-end with representative user scenarios
- [ ] Monitor API costs weekly
```

### Pattern 2: The Enterprise Knowledge Worker

**Who this is for:** Mid-to-large company, proprietary data, compliance requirements (SOC 2 minimum), needs multi-department access, internal knowledge base.

### The Stack:
- Data: Qdrant (self-hosted) + MongoDB + Neo4j
- Tools: Go CLI binaries + MCP servers + internal REST APIs
- Skills: Custom enterprise skills + curated community skills
- Memory: Mem0 (SOC 2 compliant) + Graphiti knowledge graph + PostgreSQL sessions
- LLM: Multi-model via LiteLLM (Claude for reasoning, Gemini for multimodal, GPT for chat)
- Harness: LangGraph or CrewAI (multi-agent for departmental specialization)

Why this works: Self-hosted vector DB keeps data on-premise. Knowledge graph captures organizational relationships. Multi-model routing optimizes cost and capability. Multi-agent architecture lets departments have specialized agents that share institutional memory.

Monthly cost: $2,000-10,000 (infrastructure + API costs)

### Setup Checklist:

```
- [ ] Deploy Qdrant cluster on internal infrastructure
- [ ] Set up MongoDB for document storage with vector search
- [ ] Deploy Neo4j for organizational knowledge graph
- [ ] Build data ingestion pipeline (Unstructured.io + embedding pipeline)
- [ ] Develop Go CLI tools for internal system integrations
- [ ] Set up MCP servers for approved SaaS tools
- [ ] Write enterprise SKILL.md files per department
- [ ] Deploy Mem0 with SOC 2 configuration
- [ ] Set up Graphiti for temporal knowledge graph
- [ ] Configure LiteLLM proxy with model routing rules
- [ ] Implement role-based agent access controls
- [ ] Set up Helicone for cost and usage monitoring
- [ ] Deploy multi-agent system
- [ ] Implement human-in-the-loop for sensitive operations
- [ ] Set up audit logging for compliance
- [ ] Run security review and penetration testing
- [ ] Create disaster recovery and failover procedures
```

### Pattern 3: The Privacy-First Autonomous Agent

Who this is for: Regulated industry (healthcare, finance, government), strict data residency, cannot use cloud LLM APIs, needs autonomous operation.

### The Stack:
- Data: Qdrant (self-hosted) + PostgreSQL + Neo4j (all on-premise)
- Tools: Go CLI binaries (zero external dependencies) + local MCP servers
- Skills: Fully custom skills (no external marketplace dependencies)
- Memory: Letta (MemGPT) for self-editing memory + local Graphiti + SQLite sessions
- LLM: Self-hosted Llama 4 Maverick or DeepSeek-V3 via vLLM
- Harness: OpenClaw (self-hosted, MIT licensed) or Pi-Mono

Why this works: Zero data leaves the network. Open-source everything, auditable top to bottom. Self-hosted LLMs via vLLM for inference. Letta's OS-inspired memory management enables long-running autonomous agents.

Monthly cost: $5,000-20,000 (GPU infrastructure + engineering time)

### Setup Checklist:

```
- [ ] Provision GPU infrastructure (NVIDIA A100/H100 or equivalent)
- [ ] Deploy vLLM for model inference
- [ ] Set up Qdrant on dedicated servers with encryption at rest
- [ ] Deploy PostgreSQL with row-level security
- [ ] Set up Neo4j Community Edition for knowledge graph
- [ ] Build all tools as Go CLI binaries (no external API calls)
- [ ] Write comprehensive custom skills for all agent capabilities
- [ ] Deploy Letta for memory management
- [ ] Set up Graphiti with local graph backend
- [ ] Configure OpenClaw or Pi-Mono with local model endpoints
- [ ] Implement network isolation (no egress to public internet)
- [ ] Set up comprehensive audit logging
- [ ] Conduct security audit and compliance review
- [ ] Create operational runbooks for model updates and maintenance
- [ ] Set up monitoring and alerting (Prometheus + Grafana)
- [ ] Document data flow diagrams for compliance auditors
```

### Pattern 4: The No-Code Business Automator

Who this is for: Non-technical team, needs workflow automation (customer support, lead qualification, data processing), speed-to-value is the priority.

### The Stack:
- Data: Managed cloud (Pinecone or Weaviate Cloud)
- Tools: Pre-built integrations (1,000+ via MindStudio or Dify)
- Skills: Template-based workflows
- Memory: Platform-managed sessions
- LLM: Multi-model via platform (200+ models in MindStudio)
- Harness: MindStudio or Dify

Why this works: 15 minutes to first working agent. No infrastructure to manage. Pre-built integrations with existing business software. Visual workflow builder makes iteration accessible to non-developers.

Monthly cost: $100-500 (platform subscription + per-use API costs)

### Setup Checklist:

```
- [ ] Sign up for MindStudio or deploy Dify Cloud
- [ ] Identify top 3 automation workflows to build
- [ ] Connect existing business tools (CRM, email, Slack, etc.)
- [ ] Select LLM model per workflow (cost vs quality trade-off)
- [ ] Build first agent using template or visual builder
- [ ] Test with representative scenarios
- [ ] Set up webhook triggers for automated activation
- [ ] Train team on workflow editing and monitoring
- [ ] Set up usage alerts and cost monitoring
- [ ] Iterate based on production feedback

### Pattern 5: The Multi-Channel Personal Assistant

Who this is for: Power user or small team wanting a personal AI assistant across messaging platforms, with local control and privacy.

### The Stack:
- Data: SQLite + ChromaDB (local) (also can use QMD)
- Tools: OpenClaw's 100+ pre-configured agent skills
- Skills: Mix of built-in and custom SKILL.md files
- Memory: OpenClaw persistent memory + local ChromaDB for semantic search
- LLM: Any API (Claude, GPT, or local via Ollama)
- Harness: OpenClaw

Why this works: OpenClaw connects to WhatsApp, Telegram, Discord, Slack, and more from a single self-hosted instance. 100+ pre-built skills cover common automation tasks. Semantic Snapshots enable web automation at 100x fewer tokens than screenshot-based approaches.

Monthly cost: $10-70 (API costs only, runs on existing hardware)

### Setup Checklist:

```
- [ ] Set up server or repurpose existing hardware
- [ ] Deploy OpenClaw
- [ ] Configure messaging channels
- [ ] Set up LLM API keys (or local Ollama for privacy)
- [ ] Enable desired pre-built skills
- [ ] Write custom SKILL.md files for personal workflows
- [ ] Set up scheduled automations
- [ ] Test cross-channel conversations
- [ ] Set up automatic updates and backup
```

### Pattern 6: The High-Performance Code Agent

Who this is for: Engineering team needing an AI coding assistant that integrates with development workflows, handles large codebases, and operates with minimal latency.

### The Stack:
- Data: pgvector (code embeddings in existing Postgres) + Git repositories
- Tools: UV Python scripts + Go CLI tools + MCP servers (GitHub, Jira, CI/CD)
- Skills: Code-specific skills (refactoring, review, testing, documentation)
- Memory: JSON sessions + vector search over codebase + AGENTS.md for project context
- LLM: Claude Sonnet (primary, highest SWE-bench) + Gemini Flash (fast iteration)
- Harness: Claude Agent SDK or Pi-Mono

Why this works: Claude Opus 4.6 and Codex 5.3. AGENTS.md files provide persistent project knowledge without retrieval overhead. pgvector leverages existing Postgres infrastructure. Multi-model routing uses Claude for complex refactoring and Gemini Flash for quick completions.

Monthly cost: $200-2,000 (API costs scaled by team size)

### Setup Checklist:

```
- [ ] Set up pgvector extension in existing PostgreSQL
- [ ] Index codebase with embedding pipeline (function-level chunking)
- [ ] Create AGENTS.md files for key repositories
- [ ] Write SKILL.md files for code review, refactoring, test generation, documentation
- [ ] Set up MCP servers for GitHub, Jira, and CI/CD
- [ ] Configure dual-model routing
- [ ] Implement codebase-aware context loading (git blame, file history)
- [ ] Set up IDE integration (VS Code, Cursor)
- [ ] Create evaluation pipeline (run agent on known code tasks, measure quality)
- [ ] Monitor token usage and optimize context loading

## Quick Decision Matrix

Don't overthink it. Find your row:

```
Criteria            Pattern 1:  Pattern 2:    Pattern 3:  Pattern 4:  Pattern 5:  Pattern 6:
                     MVP         Enterprise    Privacy     No-Code     Personal    Code
 ─────────────────── ─────────── ───────────── ─────────── ─────────── ─────────── ───────────
 Team size           1-5         10-1000+      5-100       1-50        1-5         5-100
 Technical depth     Developers  Mixed         Deep eng.   Non-tech    Power users Developers
 Data sensitivity    Low         Medium-High   Critical    Low-Medium  Low         Medium
 Budget (monthly)    $50-200     $2K-10K       $5K-20K     $100-500    $10-70      $200-2K
 Time to 1st agent   Days        Weeks         Months      Hours       Days        Days
 LLM approach        Single      Multi-model   Self-hosted Platform    Flexible    Dual-model
```

---

## The Stuff Nobody Talks About (But Should)
### Observability

Every production agent needs three types of visibility: what the agent decided (reasoning traces), what it cost (token and API usage), and how long it took (latency per step).

Helicone provides all three with 8ms overhead. For self-hosted stacks, use Prometheus + Grafana with custom agent metrics.

If you can't see what your agent is doing, you can't improve it. It's that simple.

### Security
Implement least-privilege at every layer. Tools get scoped API keys. Agents get permission boundaries. Human-in-the-loop for irreversible actions. Audit logging for compliance. Credential rotation on schedule.

Never, ever store secrets in skills or session files.

### Testing

Test each layer independently, then test integration. Tools should have unit tests. Skills should have evaluation prompts with expected outcomes. Memory should have recall accuracy tests. End-to-end tests should cover representative user journeys.

The pattern: write skill → create test prompts → run agent → evaluate → iterate. Boring? Yes. Essential? Also yes.

### Cost Management

LLM costs dominate most agent budgets. Three strategies that compound:
Cache repeated queries - up to 95% reduction

- Cascade to cheaper models for simple tasks - up to 85% reduction
- Optimize context loading - skills architecture is 500x more efficient than loading all tool schemas
- Monitor costs weekly. Set alerts for anomalies. A runaway agent loop at $15/M tokens can ruin your weekend.

### Wrapping Up

The AI agent space is moving fast. New frameworks, new models, new patterns every week. But the six-layer mental model holds steady. Data, tools, skills, memory, LLM, harness - in that order, from the ground up.

Don't get caught up chasing shiny objects. Pick the pattern that matches your situation. Follow the checklist. Ship something real.

The best architecture is the one that actually gets built.
