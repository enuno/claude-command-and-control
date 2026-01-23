# Documentation Migration: docs/claude → docs/best-practices

## Overview

On January 23, 2026, we merged `docs/claude/` into `docs/best-practices/` to eliminate redundancy and create a single source of truth for all documentation.

## Document Number Changes

| Old Reference | New Location | Notes |
|---------------|--------------|-------|
| docs/claude/02 | docs/best-practices/02 | Enhanced version (18K, production patterns) |
| docs/claude/05 | docs/best-practices/05 | Enhanced version (48K, comprehensive hooks) |
| docs/claude/06 | docs/best-practices/06 | Enhanced version (21K, compliance) |
| docs/claude/07 | docs/best-practices/07 | Enhanced version (32K, templates) |
| docs/claude/09 | docs/best-practices/09 | Developing High-Impact Claude Skills |
| docs/claude/12 | docs/best-practices/14 | Production-Grade Skills Development |
| docs/best-practices/09 (Agent-Skills) | docs/best-practices/10 | Renumbered |
| docs/best-practices/09 (Multi-Agent) | docs/best-practices/11 | Renumbered |
| docs/best-practices/12 | docs/best-practices/13 | Skills-First Planning |
| docs/best-practices/13 | docs/best-practices/15 | MCP Registry |
| docs/best-practices/14 | docs/best-practices/16 | LLM Production Optimization |
| docs/best-practices/15 | docs/best-practices/17 | Advanced Orchestration Patterns |

## Final Structure

All documentation now lives in `docs/best-practices/`:

```
01-Introduction-and-Core-Principles.md
02-Individual-Command-Creation.md
03-Individual-Agent-Configuration.md
04-Multi-Agent-Orchestration.md
05-Testing-and-Quality-Assurance.md
06-Production-Deployment-and-Maintenance.md
07-Quick-Reference-and-Templates.md
08-Claude-Skills-Guide.md
09-Developing-High-Impact-Claude-Skills.md
10-Agent-Skills-vs-Multi-Agent.md
11-Multi-Agent-Architecture-and-Skills-Integration.md
12-hybrid-ai-agent-multi-git-worktree-development.md
13-Skills-First-Planning-and-Orchestration.md
14-Production-Grade-Skills-Development.md
15-MCP-Registry-Best-Practices.md
16-LLM-Production-Optimization.md
17-Advanced-Orchestration-Patterns.md
```

**Total: 17 comprehensive documents**
- No duplicates
- Sequential numbering
- Single source of truth

## Updating References

If you have bookmarks or scripts referencing `docs/claude/`, update them to `docs/best-practices/`.

All cross-references in CLAUDE.md have been updated automatically.

## Benefits

- **Eliminated 700+ KB of redundant content**
- **Single authoritative documentation source**
- **Clear sequential numbering (01-17)**
- **No more conflicting versions**
- **Easier to maintain and update**

## History

- **Before merge**: Two separate directories with 50% overlapping content
- **After merge**: One comprehensive directory with all enhanced content
- **Deprecated**: docs/claude/ directory (removed January 23, 2026)

## Questions?

If you encounter broken links or have questions about the new structure, please open an issue.
