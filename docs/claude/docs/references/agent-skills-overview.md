# What Are Agent Skills?

> **Source**: Official Agent Skills documentation from [agentskills.io](https://agentskills.io)
> **Integrated**: 2025-12-21
> **License**: Open standard maintained by Anthropic

Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows.

---

## Core Concept

At its core, a skill is a folder containing a `SKILL.md` file. This file includes metadata (`name` and `description`, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, templates, and reference materials.

```
my-skill/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```

---

## How Skills Work

Skills use **progressive disclosure** to manage context efficiently:

1. **Discovery**: At startup, agents load only the name and description of each available skill, just enough to know when it might be relevant.

2. **Activation**: When a task matches a skill's description, the agent reads the full `SKILL.md` instructions into context.

3. **Execution**: The agent follows the instructions, optionally loading referenced files or executing bundled code as needed.

This approach keeps agents fast while giving them access to more context on demand.

---

## The SKILL.md File

Every skill starts with a `SKILL.md` file containing YAML frontmatter and Markdown instructions:

```markdown
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
---

# PDF Processing

## When to use this skill
Use this skill when the user needs to work with PDF files...

## How to extract text
1. Use pdfplumber for text extraction...

## How to fill forms
...
```

The following frontmatter is required at the top of `SKILL.md`:

- `name`: A short identifier
- `description`: When to use this skill

The Markdown body contains the actual instructions and has no specific restrictions on structure or content.

---

## Key Advantages

This simple format has some key advantages:

- **Self-documenting**: A skill author or user can read a `SKILL.md` and understand what it does, making skills easy to audit and improve.

- **Extensible**: Skills can range in complexity from just text instructions to executable code, assets, and templates.

- **Portable**: Skills are just files, so they're easy to edit, version, and share.

---

## Why Agent Skills?

Agents are increasingly capable, but often don't have the context they need to do real work reliably. Skills solve this by giving agents access to procedural knowledge and company-, team-, and user-specific context they can load on demand. Agents with access to a set of skills can extend their capabilities based on the task they're working on.

**For skill authors**: Build capabilities once and deploy them across multiple agent products.

**For compatible agents**: Support for skills lets end users give agents new capabilities out of the box.

**For teams and enterprises**: Capture organizational knowledge in portable, version-controlled packages.

---

## What Can Agent Skills Enable?

- **Domain expertise**: Package specialized knowledge into reusable instructions, from legal review processes to data analysis pipelines.
- **New capabilities**: Give agents new capabilities (e.g. creating presentations, building MCP servers, analyzing datasets).
- **Repeatable workflows**: Turn multi-step tasks into consistent and auditable workflows.
- **Interoperability**: Reuse the same skill across different skills-compatible agent products.

---

## Adoption

Agent Skills are supported by leading AI development tools:

- Claude Code
- Claude AI
- Cursor
- GitHub Copilot
- VS Code
- OpenCode
- Amp
- Letta
- Goose
- OpenAI Codex

---

## Open Development

The Agent Skills format was originally developed by [Anthropic](https://www.anthropic.com/), released as an open standard, and has been adopted by a growing number of agent products. The standard is open to contributions from the broader ecosystem.

---

## Next Steps

- [View the specification](agent-skills-specification.md) to understand the full format.
- [Add skills support to your agent](agent-skills-integration-guide.md) to build a compatible client.
- [See example skills](https://github.com/anthropics/skills) on GitHub.
- [Read authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) for writing effective skills.
- [Use the reference library](https://github.com/agentskills/agentskills/tree/main/skills-ref) to validate skills and generate prompt XML.
