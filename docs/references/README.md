# Reference Documentation

This directory contains authoritative reference documentation from official sources.

## Research & Empirical Evidence

| Document | Description |
|----------|-------------|
| **[skillsbench-research-2026.md](skillsbench-research-2026.md)** | Comprehensive summary of SkillsBench benchmark research (Li et al., 2026) - the first systematic evaluation of Agent Skills efficacy across 84 tasks, 11 domains, and 7,308 evaluation trajectories. Provides empirical validation for skills-based development practices. |
| **[ai-agent-architecture-guide.md](ai-agent-architecture-guide.md)** | Reference architecture guide for AI agent systems with comprehensive implementation patterns |

## Agent Skills Specification

The Agent Skills format is an open standard originally developed by Anthropic for portable AI agent capabilities. These documents are the official specification, integrated from [agentskills.io](https://agentskills.io).

| Document | Description |
|----------|-------------|
| **[agent-skills-specification.md](agent-skills-specification.md)** | Complete format specification for SKILL.md files including frontmatter fields, directory structure, and validation rules |
| **[agent-skills-overview.md](agent-skills-overview.md)** | Introduction to Agent Skills - what they are, how they work, and why they matter |
| **[agent-skills-integration-guide.md](agent-skills-integration-guide.md)** | Guide for building skills-compatible agents and tools |

## Why These References Matter

The Agent Skills standard is supported by major AI development tools:
- Claude Code (Anthropic)
- Claude AI
- Cursor
- GitHub Copilot
- VS Code
- OpenCode
- Amp
- Letta
- Goose (Block)
- OpenAI Codex

By following this specification, skills created in this repository are portable across all compatible platforms.

## Using These References

**When creating new skills**: Follow the specification in `agent-skills-specification.md`

**When building tools**: See `agent-skills-integration-guide.md` for implementation patterns

**For context**: Read `agent-skills-overview.md` to understand the skill ecosystem

## External Resources

- [agentskills.io](https://agentskills.io) - Official documentation site
- [Example Skills](https://github.com/anthropics/skills) - Official example skills from Anthropic
- [skills-ref Library](https://github.com/agentskills/agentskills/tree/main/skills-ref) - Python SDK for skill validation

---

**Integrated**: December 21, 2025
**Source**: Anthropic's Agent Skills open standard
**License**: Open standard, open to contributions
