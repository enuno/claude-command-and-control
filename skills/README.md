# Claude Skills Directory

This directory contains the repository's skill library. Each skill is a reusable workflow automation unit that can be invoked across different projects and sessions.

## Overview

**Skills** are portable workflow automation units that complement commands and agents:
- **Commands**: Quick session shortcuts (`/test`, `/pr`, `/integration-scan`)
- **Agents**: Role-specialized project execution (Builder, Validator, Integration Manager)
- **Skills**: Cross-project reusable workflows (debugging, workspace management, content creation)

---

## Available Skills (33 Total)

### Bitcoin Mining Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[braiins-ecosystem](braiins-ecosystem/SKILL.md)** | Unified Braiins ecosystem covering firmware, pool, toolbox, manager, proxy, and insights | Complete mining stack setup, integrated workflows |
| **[braiins-insights](braiins-insights/SKILL.md)** | Bitcoin mining profitability calculator with IRR analysis | ROI calculations, cash flow projections, break-even analysis |
| **[braiins-manager](braiins-manager/SKILL.md)** | Web-based dashboard for mining operations monitoring | Fleet monitoring, real-time metrics, multi-user access control |
| **[braiins-os](braiins-os/SKILL.md)** | ASIC firmware with autotuning and Stratum V2 support | Firmware management, API integration, OS feeds |
| **[braiins-pool](braiins-pool/SKILL.md)** | Bitcoin mining pool with FPPS rewards and Lightning payouts | Pool setup, reward calculations, Lightning withdrawals, solo mining |
| **[braiins-proxy](braiins-proxy/SKILL.md)** | High-performance Stratum V2 mining proxy | Large-scale operations, hashrate aggregation, farm proxy deployment |
| **[braiins-toolbox](braiins-toolbox/SKILL.md)** | Batch management tool for Bitcoin mining operations | Network scanning, firmware/system/miner management, performance tuning |
| **[farm-monitor](farm-monitor/SKILL.md)** | Bitcoin mining fleet monitoring and management | Fleet visibility, operational monitoring |

### Development Workflow Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[fastmcp](fastmcp/SKILL.md)** | Model Context Protocol (MCP) server development with FastMCP framework - tools, resources, prompts, authentication, Claude Desktop integration, and production deployment with Python and TypeScript examples | Creating MCP servers, integrating with Claude Desktop, building AI-powered tools and data access layers, production MCP deployment, v2/v3 migration |
| **[openserv-agents](openserv-agents/SKILL.md)** | Complete OpenServ platform guide - SDK, API, and no-code agent development | Building autonomous AI agents, multi-agent orchestration, "Second Brain" architecture, BRAID framework, deployment strategies, production hosting |
| **[raycast](raycast/SKILL.md)** | Raycast extension development framework for creating extensions with API integration, UI components, TypeScript patterns, and React | Building Raycast extensions, implementing extension APIs (Environment, Clipboard, Storage, OAuth), creating UI components (List, ActionPanel, Form), debugging extension code |
| **[root-cause-tracing](root-cause-tracing/SKILL.md)** | Systematically traces bugs backward through call stack to find original trigger | Debugging errors deep in execution, tracing invalid data sources |
| **[software-architecture](software-architecture/SKILL.md)** | Clean Architecture & DDD guidance for quality-focused development | Software design, architecture decisions, code quality, anti-patterns |
| **[subagent-driven-development](subagent-driven-development/SKILL.md)** | Dispatches fresh subagent for each task with code review between tasks | Executing plans with independent tasks, fast iteration with quality gates |
| **[terraform-best-practices](terraform-best-practices/SKILL.md)** | Comprehensive Terraform infrastructure-as-code best practices from Anton Babenko's community guide covering infrastructure sizing, modules, state management, naming conventions, and tool recommendations | Designing Terraform project structure, scaling IaC implementations, choosing Terraform vs Terragrunt, establishing coding standards, troubleshooting common Terraform problems |
| **[using-git-worktrees](using-git-worktrees/SKILL.md)** | Creates isolated git worktrees with smart directory selection and safety verification | Feature work needing isolation, working on multiple branches simultaneously |

### Integration & Automation Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[documentation-update](documentation-update/SKILL.md)** | Reusable logic for updating repository documentation (README, indices, tables) while preserving formatting | Adding entries to README tables after integration, maintaining indices |
| **[dokploy-mcp](../skills-templates/dokploy-mcp/SKILL.md)** | AI-driven deployment management using Dokploy MCP server with 43 tools for projects, applications, and databases | Deploying apps, provisioning PostgreSQL databases, multi-environment management, CI/CD integration |
| **[file-categorization](file-categorization/SKILL.md)** | Categorizes files as Command, Agent, Skill, or Documentation based on structure and content analysis | Processing files in integration pipelines, auto-routing files |
| **[flyio](../skills-templates/flyio/SKILL.md)** | Deploy and scale full-stack applications globally on Fly.io platform | Deploying web applications, APIs, databases, microservices with global distribution and automatic scaling |

### Design & UI/UX Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[ui-ux-pro-max](ui-ux-pro-max/SKILL.md)** | UI/UX design intelligence with searchable database of 50+ styles, color palettes, font pairings, and 8 framework stacks | Frontend design, component styling, landing pages, dashboards, accessibility |

### Content & Documentation Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[content-research-writer](content-research-writer/SKILL.md)** | Assists in writing high-quality content by conducting research, adding citations, improving hooks | Writing blog posts, articles, newsletters, educational content, tutorials |
| **[create-llmstxt-py](create-llmstxt-py/SKILL.md)** | Python script for generating llms.txt and llms-full.txt files using Firecrawl and OpenAI APIs | Making websites LLM-accessible, automated content indexing, documentation extraction, website summaries |
| **[gitbook](gitbook/SKILL.md)** | GitBook documentation platform - creating docs, publishing sites, Git sync, API references | GitBook spaces, change requests, custom domains, OpenAPI integration |
| **[github-pages](github-pages/SKILL.md)** | GitHub Pages static site hosting - setup, configuration, custom domains, Jekyll | Creating GitHub Pages sites, custom domains, Jekyll themes, GitHub Actions |

### Data Storage & Upload Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[turbo-python-sdk](turbo-python-sdk/SKILL.md)** | Python SDK for Ardrive Turbo Upload and Payment Service | Arweave uploads with Python, permanent storage, companion to TypeScript SDK |
| **[turbo-sdk](turbo-sdk/SKILL.md)** | Complete Arweave Turbo ecosystem including client SDKs, core upload infrastructure, payment service backend, and CLI tools | Arweave uploads, permanent storage, ANS-104 bundling, multi-signature support, AWS-scale infrastructure |

### Marketing & SEO Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[google-seo](google-seo/SKILL.md)** | Google SEO best practices and web optimization based on official Google SEO Starter Guide | Creating web content, reviewing pages for SEO, implementing metadata (titles, descriptions, alt text), structuring URLs and site architecture |
| **[google-structured-data](google-structured-data/SKILL.md)** | Schema.org markup for Google Search rich results with JSON-LD templates | Implementing structured data, Article/Product/Event/FAQ markup, JavaScript generation |
| **[google-seo-starter-guide](google-seo-starter-guide/SKILL.md)** | Official Google SEO fundamentals - complete implementation guide | New site SEO setup, URL structure optimization, content strategy, title/meta optimization, image/video SEO, promotion tactics, Search Console monitoring |
| **[google-url-inspection](google-url-inspection/SKILL.md)** | Search Console URL Inspection Tool mastery for indexing diagnosis | Verifying URL indexing, diagnosing crawl errors, testing live URLs, checking JavaScript rendering, requesting re-indexing, troubleshooting indexing issues |
| **[seo](seo/SKILL.md)** | Google SEO research and web traffic monetization with curated resources | SEO best practices, tool comparisons (Semrush, Moz, Ahrefs), search engine optimization, marketing strategies |

### Contribution & Sharing Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[sharing-skills](sharing-skills/SKILL.md)** | Guides process of contributing skills upstream via pull request | Sharing broadly useful patterns back to repository |

### Meta Skills & Framework

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[using-superpowers](using-superpowers/SKILL.md)** | **CRITICAL**: Establishes mandatory workflows for finding and using skills | Starting any conversation, ensuring skill discovery and usage |

### Skill Development & Orchestration

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[skill-creator](skill-creator/SKILL.md)** | Guides creation of new skills with templates and best practices | Building new automation, creating workflow skills |
| **[agent-skill-bridge](agent-skill-bridge/SKILL.md)** | Integrates agents and skills for coordinated workflows | Coordinating agents with skills in complex systems |
| **[skill-orchestrator](skill-orchestrator/SKILL.md)** | Coordinates multiple skills in complex workflows | Multi-skill workflows, chaining skills together |

---

## Using Skills

Skills are invoked using the Skill tool in Claude Code:

```
Use the [skill-name] skill to [accomplish task]
```

**Examples**:
```
Use the using-git-worktrees skill to set up an isolated workspace for feature work
```

```
Use the root-cause-tracing skill to debug this error
```

```
Use the content-research-writer skill to help me write an article about AI agents
```

### Skill Discovery

The **using-superpowers** skill is a meta-skill that ensures proper skill discovery:
- Automatically checked at the start of each conversation
- Prevents bypassing relevant skills
- Enforces mandatory skill usage workflows
- Integrates with TodoWrite for checklist tracking

**This skill is CRITICAL** for the skill system to function properly.

---

## Creating New Skills

### Quick Start

Use the skill-creator skill:
```
Use the skill-creator skill to help me build a skill for [your workflow]
```

### Choose a Template

Based on complexity:
- **Simple workflows** → `../templates/skills/minimal-skill-template.md`
- **Moderate workflows** → `../templates/skills/standard-skill-template.md`
- **Complex workflows** → `../templates/skills/comprehensive-skill-template.md`

### Best Practices

1. **Define clear triggers**: 3-5 "When to Use" statements
2. **Use concrete examples**: Real data, not placeholders
3. **Document thoroughly**: Purpose, process, integration points
4. **Test extensively**: 5-10 real scenarios before deployment
5. **Follow standards**: See `docs/best-practices/08-Claude-Skills-Guide.md`

---

## Skill Categories Explained

### Bitcoin Mining Skills
Skills for Bitcoin mining operations and management:
- Mining ecosystem (braiins-ecosystem)
- Profitability analysis (braiins-insights)
- Fleet monitoring (braiins-manager, farm-monitor)
- ASIC firmware (braiins-os)
- Mining pool operations (braiins-pool)
- Network infrastructure (braiins-proxy)
- Batch operations (braiins-toolbox)

### Development Workflow Skills
Skills that enhance the software development process:
- AI agent development (openserv-agents)
- Software architecture (software-architecture)
- Debugging (root-cause-tracing)
- Parallel development (using-git-worktrees)
- Plan execution (subagent-driven-development)

### Design & UI/UX Skills
Skills for frontend design and user experience:
- UI/UX design intelligence (ui-ux-pro-max)

### Integration & Automation Skills
Skills for automating repository maintenance:
- File processing (file-categorization)
- Documentation maintenance (documentation-update)

### Content & Documentation Skills
Skills for content creation and documentation:
- Research-backed writing (content-research-writer)
- LLM-accessible website indexing (create-llmstxt-py)
- GitBook documentation platform (gitbook)
- GitHub Pages static hosting (github-pages)

### Data Storage & Upload Skills
Skills for permanent data storage and uploads to Arweave:
- Python uploads (turbo-python-sdk)
- TypeScript uploads (turbo-sdk)

### Marketing & SEO Skills
Skills for search engine optimization and web marketing:
- Google SEO best practices (google-seo)
- Structured data markup (google-structured-data)
- SEO best practices and tools (seo)

### Contribution & Sharing Skills
Skills for community engagement:
- Upstream contributions (sharing-skills)

### Meta Skills & Framework
Skills that govern the skill system itself:
- Skill discovery (using-superpowers) - **MANDATORY**

### Skill Development & Orchestration
Skills for working with skills:
- Creating skills (skill-creator)
- Coordinating skills (skill-orchestrator, agent-skill-bridge)

---

## Skill Integration with Commands & Agents

### Skills Used by Commands

**Integration Commands**:
- `/integration-scan` uses **file-categorization** for automated file routing
- `/integration-update-docs` uses **documentation-update** for README maintenance

**Maintenance Commands**:
- `/maintenance-review` coordinates with **Research Specialist** agent

### Skills Used by Agents

**Integration Manager Agent**:
- Uses **file-categorization** for incoming file analysis
- Uses **documentation-update** for index maintenance

**Maintenance Manager Agent**:
- Coordinates research workflows
- Manages stale file reviews

**Builder Agent**:
- Uses **using-git-worktrees** for isolated feature development
- Uses **subagent-driven-development** for plan execution

---

## Skill Quality Standards

All skills in this repository meet these criteria:
- ✅ Valid YAML frontmatter with `name` and `description`
- ✅ Clear "When to Use" section with specific triggers
- ✅ Comprehensive "What This Skill Does" section
- ✅ Examples with real data (not placeholders)
- ✅ No security vulnerabilities
- ✅ Proper markdown structure
- ✅ Integration documentation (how it works with commands/agents)

---

## Resources

### Documentation
- **Comprehensive Guide**: `../docs/best-practices/08-Claude-Skills-Guide.md`
- **Skill Templates**: `../templates/skills/`
- **Command Integration**: `../.claude/commands/integration-scan.md`
- **Agent Integration**: `../agents-templates/integration-manager.md`

### Examples
- All skills in this directory serve as examples
- Check `skill-creator/SKILL.md` for creation guidance
- Review `using-superpowers/SKILL.md` for meta-skill patterns

### Support
- Issues: GitHub Issues tracker
- Discussions: Repository discussions
- Documentation: `docs/best-practices/`

---

## Statistics

**Total Skills**: 32
- Bitcoin Mining: 8
- Development Workflow: 5
- Design & UI/UX: 1
- Integration & Automation: 3
- Content & Documentation: 4
- Data Storage & Upload: 2
- Marketing & SEO: 5
- Contribution & Sharing: 1
- Meta Skills: 1
- Skill Development: 3

**Average Skill Size**: ~200-400 lines
**Quality Score**: 100/100 (all skills validated)
**Integration Coverage**: 100% (all skills documented for integration)

---

## Recent Additions

**January 2026**:
- ✨ **google-url-inspection** (2026-01-22) - Search Console URL Inspection Tool mastery
  - Comprehensive guide for Google's URL Inspection Tool in Search Console
  - 7 workflow phases (access tool, inspect URL, analyze details, test live, view rendering, request indexing, troubleshoot)
  - 10 trigger conditions for effective usage
  - 3 practical scenarios (blog post verification, missing product page diagnosis, JavaScript rendering verification)
  - 5 common pitfalls with solutions (over-requesting indexing, assuming permanent rejection, ignoring rendering, URL variant confusion, not fixing before requesting)
  - 4 major troubleshooting scenarios (not in search results, rankings dropped, indexed but not ranking, duplicate content)
  - 8 quality standards checklist
  - 5 authoritative resource links
  - Integration with broader SEO workflow
  - Source: https://support.google.com/webmasters/answer/9012289
  - Version 1.0 with 20 KB

- ✨ **google-seo-starter-guide** (2026-01-22) - Official Google SEO fundamentals
  - Complete implementation guide from Google Search Central's official SEO Starter Guide
  - 7 comprehensive workflow phases (site assessment, URL structure, content optimization, title/meta tags, image/video optimization, promotion, monitoring)
  - 12 trigger conditions covering all SEO fundamentals
  - 3 detailed implementation examples (blog post optimization, e-commerce product page fix, new website launch)
  - Before/After code comparison examples
  - 5 common pitfalls with detailed solutions
  - 4 major troubleshooting scenarios with diagnosis steps
  - 12 authoritative Google Search Central resource links
  - Quality standards checklist with 12 verification items
  - Timeline expectations (hours to months for different changes)
  - Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
  - Version 1.0 with 36 KB

- 🔄 **openserv-agents** (2026-01-22) - Combined OpenServ platform guide
  - **Merged**: agent-starter + openserv-docs into single comprehensive skill
  - Complete OpenServ platform documentation covering SDK, API, and no-code approaches
  - 7 workflow phases (approach selection, platform setup, implementation, local testing, production deployment, QA, marketplace submission)
  - 3 development paths (API for flexibility, SDK for power, no-code for simplicity)
  - 3 comprehensive examples (Text Summarizer with API, Reminder Agent with no-code, Multi-Agent Collaboration with SDK)
  - TypeScript and Python code examples with Zod schemas
  - OpenServ Platform API endpoint documentation
  - "Second Brain" architecture explanation
  - BRAID reasoning framework overview (70x cost reduction)
  - Deployment guides (Railway, Render, Vercel, Fly.io, Dokku, self-hosted)
  - Tunneling integration (ngrok, localtunnel)
  - Tokenization features for crypto startups
  - 5 common pitfalls with solutions
  - 4 troubleshooting scenarios
  - Sources: agent-starter + openserv-docs repositories
  - Version 2.0 with 32 KB (combined from 19 KB + 32 KB)

- ✨ **google-seo** (2026-01-22) - Google SEO best practices skill
  - Comprehensive guidance from Google's official SEO Starter Guide
  - 6 workflow phases (Content Discovery, URL Structure, Metadata, Images, Content Quality, Technical Implementation)
  - 3 real-world examples (documentation site, blog optimization, e-commerce)
  - Concrete code examples (HTML, XML, structured data)
  - Common pitfalls and troubleshooting guide
  - Debunked SEO myths section
  - Version 1.0 with 21 KB

- ✨ **flyio** (2026-01-21) - Fly.io deployment platform skill
  - Complete deployment workflow (install → launch → scale)
  - 30+ common flyctl commands with examples
  - fly.toml configuration reference
  - Node.js Express API deployment example
  - Best practices for performance, security, cost, and reliability
  - Troubleshooting guide
  - Version 1.0 with 52 KB (4 files)

- ✨ **google-structured-data** (2026-01-18) - Schema.org markup skill
  - 8 structured data types (Article, Product, LocalBusiness, FAQ, Event, Breadcrumb, Video, Recipe)
  - JSON-LD templates with required/recommended properties
  - JavaScript generation (GTM, custom JS, React/Next.js, SSR)
  - Implementation checklists and common mistakes
  - Version 1.1 with 762 lines, 20KB

- ✨ **Documentation Platform Skills** (2026-01-17) - 2 new skills
  - gitbook - GitBook documentation platform (1.1 MB, 107 pages from llms.txt)
  - github-pages - GitHub Pages static hosting (140 KB, 10 pages from Article API)
- ✨ **SEO & Content Indexing Skills** (2026-01-03) - 2 new skills
  - seo - Google SEO research with 2,571 GitHub stars, MIT license, covers Semrush/Moz/Ahrefs
  - create-llmstxt-py - Python tool for llms.txt generation, 257 stars, Firecrawl/OpenAI integration
- 🔄 **turbo-sdk v1.3.0** (2026-01-03) - Enhanced with complete infrastructure coverage
  - Added turbo-upload-service core infrastructure component
  - Complete Turbo ecosystem: client SDKs + core upload infrastructure + payment backend + CLI tools
  - Comprehensive infrastructure documentation (AWS, Docker, multi-signature, AGPL-3.0)
- ✨ **Arweave/Turbo SDK Skills** (2026-01-03) - 2 new skills
  - turbo-sdk - TypeScript SDK with 51KB README, 144 releases, Apache 2.0 license
  - turbo-python-sdk - Python SDK companion, MIT license

**December 2025**:
- ✨ **Braiins Bitcoin Mining Ecosystem** (2025-12-28) - 8 new skills
  - braiins-ecosystem - Unified mining stack
  - braiins-pool - FPPS mining pool with 12 Academy references
  - braiins-toolbox - Batch management with 13 Academy references
  - braiins-os - ASIC firmware with 14 API/feed references
  - braiins-insights - Profitability calculator
  - braiins-manager - Web dashboard
  - braiins-proxy - Farm proxy
  - farm-monitor - Fleet monitoring with 7 GitHub references
- ✨ ui-ux-pro-max (2025-12-22) - UI/UX design intelligence with BM25 search
- ✨ software-architecture (2025-12-21) - Clean Architecture & DDD guidance

**November 2025**:
- ✨ content-research-writer (2025-11-23)
- ✨ root-cause-tracing (2025-11-23)
- ✨ sharing-skills (2025-11-23)
- ✨ subagent-driven-development (2025-11-23)
- ✨ using-git-worktrees (2025-11-23)
- ✨ using-superpowers (2025-11-23)
- ✨ file-categorization (2025-11-23)
- ✨ documentation-update (2025-11-23)

---

**Last Updated**: January 22, 2026
**Maintained By**: Claude Command and Control Repository
**Version**: 2.10.0
