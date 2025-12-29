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

### Creative & Media (5 skills)
| Skill | Description |
|-------|-------------|
| **[artifacts-builder](artifacts-builder/)** | Suite of tools for creating elaborate React/Tailwind/shadcn UI artifacts with build pipeline |
| **[canvas-design](canvas-design/)** | Creates beautiful visual art in PNG and PDF using design philosophy principles |
| **[image-enhancer](image-enhancer/)** | Improves image quality by enhancing resolution, sharpness, and clarity for professional use |
| **[slack-gif-creator](slack-gif-creator/)** | Creates animated GIFs optimized for Slack with validators for size constraints |
| **[theme-factory](theme-factory/)** | Applies professional font and color themes to artifacts (10 pre-set themes included) |

### Cryptocurrency & Payments (2 skills)
| Skill | Description |
|-------|-------------|
| **[cryptocurrency/bitcoin-mining](cryptocurrency/bitcoin-mining/)** | Comprehensive Bitcoin mining knowledge from 4 industry reports covering 2024 market analysis, mining economics, operational procedures, and heat reuse strategies for sustainable mining |
| **[cryptocurrency/btcpayserver-doc](cryptocurrency/btcpayserver-doc/)** | BTCPay Server documentation - self-hosted Bitcoin payment gateway with 767 files covering setup, integrations (WooCommerce, Shopify, etc.), Lightning Network, wallets, and deployment |

### Development (10 skills)
| Skill | Description |
|-------|-------------|
| **[development/ansible](development/ansible/)** | Ansible community documentation - infrastructure automation platform with 786 files covering RST documentation sources, build system (nox/Sphinx), contribution guidelines, and development workflows |
| **[development/building-bitcoin-rust](development/building-bitcoin-rust/)** | Comprehensive 419-page technical guide to building Bitcoin protocol implementation in Rust, covering cryptographic primitives, blockchain architecture, consensus mechanisms, P2P networking, and wallet development |
| **[ar-io-build](ar-io-build/)** | Comprehensive AR.IO build documentation with 398 sections covering AR.IO features, APIs, and best practices |
| **[changelog-generator](changelog-generator/)** | Automatically creates user-facing changelogs from git commits by analyzing history |
| **[conductor](conductor/)** | Build and deployment orchestration with comprehensive Conductor documentation (40 sections, 96 KB) |
| **[fastapi](fastapi/)** | FastAPI modern Python web framework guide with 102 pages covering APIs, async endpoints, dependency injection, and backend development |
| **[just](just/)** | Just command runner for project task automation with 50+ built-in functions and multi-language support |
| **[mcp-builder](mcp-builder/)** | Guide for creating high-quality MCP (Model Context Protocol) servers for external service integration |
| **[software-architecture](software-architecture/)** | Clean Architecture and Domain Driven Design principles for quality-focused software development |
| **[webapp-testing](webapp-testing/)** | Toolkit for testing local web applications using Playwright for verifying frontend functionality |

### Document Processing (5 skills)
| Skill | Description |
|-------|-------------|
| **[document-skills/docx](document-skills/docx/)** | Word document creation, editing, and analysis with tracked changes and comments support |
| **[document-skills/pdf](document-skills/pdf/)** | PDF manipulation toolkit for extracting text/tables, creating PDFs, and handling forms |
| **[document-skills/pptx](document-skills/pptx/)** | PowerPoint presentation creation, editing, and analysis (comprehensive 25K guide) |
| **[document-skills/xlsx](document-skills/xlsx/)** | Excel spreadsheet toolkit with formulas, formatting, data analysis, and visualization |
| **[video-downloader](video-downloader/)** | Downloads videos from YouTube and other platforms for offline viewing or archival |

### Productivity & Organization (6 skills)
| Skill | Description |
|-------|-------------|
| **[content-research-writer](content-research-writer/)** | Assists in writing high-quality content by conducting research, adding citations, and providing feedback |
| **[developer-growth-analysis](developer-growth-analysis/)** | Analyzes Claude Code chat history to identify coding patterns and curate learning resources |
| **[file-organizer](file-organizer/)** | Intelligently organizes files and folders by understanding context and finding duplicates |
| **[invoice-organizer](invoice-organizer/)** | Automatically organizes invoices and receipts for tax preparation |
| **[meeting-insights-analyzer](meeting-insights-analyzer/)** | Analyzes meeting transcripts to uncover behavioral patterns and communication insights |
| **[raffle-winner-picker](raffle-winner-picker/)** | Randomly selects winners from lists or spreadsheets using cryptographically secure randomness |

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

- **Total Skills**: 34
- **Individual Skills**: 26
- **Document Processing Suite**: 4
- **Orchestration Skills**: 4
- **Average Quality Score**: 96.7/100 (from integration validation)
- **Total Content**: ~336K of skill documentation
- **Supporting Files**: 309 (scripts, themes, examples, references)

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

**Last Updated**: 2025-12-28
**Total Skills**: 34
**Repository**: [claude-command-and-control](https://github.com/enuno/claude-command-and-control)
