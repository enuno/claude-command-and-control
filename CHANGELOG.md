# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [2026-01-23] - FastMCP Skill Addition

#### Added
- **skills/fastmcp/SKILL.md**: Comprehensive Model Context Protocol (MCP) server development skill using FastMCP framework
  - Python and TypeScript examples for all core concepts
  - Tools, Resources, Prompts, and Context implementation patterns
  - Claude Desktop integration with installation methods (CLI and manual)
  - Authentication and security best practices (OAuth, token verification)
  - Production deployment guidance (STDIO, HTTP, SSE transports)
  - FastMCP v2 stable and v3 beta coverage with migration guide
  - Integration with creating-skills workflow for custom MCP-based skills
  - Complete validation test suite (10 tests)
  - 45 Python examples, 9 TypeScript examples, 5,518 words
- **skills/fastmcp/validation_tests.md**: Comprehensive test suite for skill validation
- **skills/fastmcp/run_validation_tests.sh**: Automated test runner script

#### Changed
- Updated skills/README.md: Added fastmcp to Development Workflow Skills section
- Updated skill count: 30 → 31 total skills

### [2026-01-23] - CLAUDE.md Optimization (v4.0.0)

#### Changed
- **MAJOR:** Restructured CLAUDE.md from 1,500 lines to 538 lines (64% reduction)
- **File size reduced:** 64KB → 24KB (62.5% reduction)
- **Estimated token reduction:** 67% (9,750 → 3,231 tokens via word count estimation)
- Implemented progressive disclosure pattern for context optimization

#### Added
- **docs/claude-reference/**: New directory for externalized CLAUDE.md content
  - `github-actions.md`: GitHub Actions workflows and CI/CD automation (180 lines)
  - `advanced-orchestration.md`: Enterprise orchestration patterns summary (95 lines)
  - `observability.md`: Production observability stack and KPIs (85 lines)
  - `hooks-overview.md`: Hook lifecycle and production use cases (70 lines)
  - `compliance.md`: SOC 2, HIPAA, GDPR requirements (60 lines)
  - `README.md`: Reference documentation index
- **skills/github-actions-reference/**: Skill for loading GitHub Actions documentation on-demand

#### Removed (Archived to CLAUDE.md.backup)
- 962 lines of detailed documentation (now externalized)
- Historical integration notes (per user request)
- Redundant code examples and verbose sections
- Duplicate content across multiple sections

#### Optimizations Applied
1. **Progressive Disclosure**: Summaries in CLAUDE.md, details in external references
2. **Skills-Based Loading**: Created skill for GitHub Actions reference (others link to existing docs)
3. **Link-Based References**: Use markdown links (not @ references to avoid eager loading)
4. **Condensed Tables**: Reduced verbose sections to decision matrices and trigger tables
5. **External Documentation**: Link to comprehensive docs in `docs/best-practices/`

#### Migration Notes
- All content preserved (either in optimized CLAUDE.md or externalized files)
- Original backed up to `CLAUDE.md.backup` in worktree
- All internal links verified and functional
- Version bumped from 3.0.0 → 4.0.0 (major restructuring)

#### Rationale
Research from 100+ production deployments shows:
- 50-90% token reduction achievable with progressive disclosure
- Skills-first approach: 35-54% token savings per conversation
- U-shaped attention pattern: beginning/end content processed best
- @ file references are NOT lazy-loaded (must avoid)
- Target: Keep CLAUDE.md at 150-700 lines for optimal performance

This optimization brings CLAUDE.md well below the 40k token threshold while maintaining all essential context through on-demand loading patterns.

---

### [2026-01-23] - Documentation Consolidation

#### Changed
- **BREAKING:** Merged `docs/claude/` into `docs/best-practices/`
- All documentation references updated to point to `docs/best-practices/`
- Documents 09-17 renumbered sequentially to resolve conflicts
  - 09 (Agent-Skills) → 10
  - 09 (Multi-Agent) → 11
  - 12 → 13 (Skills-First Planning)
  - 13 → 15 (MCP Registry)
  - 14 → 16 (LLM Production Optimization)
  - 15 → 17 (Advanced Orchestration Patterns)

#### Added
- **MIGRATION.md**: Complete documentation of directory restructuring and document number mapping
- docs/best-practices/09-Developing-High-Impact-Claude-Skills.md (from docs/claude)
- docs/best-practices/14-Production-Grade-Skills-Development.md (from docs/claude)

#### Removed
- `docs/claude/` directory (all content merged into docs/best-practices)
- Duplicate 10-Developing-High-Impact-Claude-Skills.md in best-practices
- Duplicate 111K hybrid-ai-agent file

#### Enhanced
- **02-Individual-Command-Creation.md**: Now 18K with production patterns, 3-tier command hierarchy, composability, CI/CD integration, hooks introduction
- **05-Testing-and-Quality-Assurance.md**: Now 48K with comprehensive hooks lifecycle model, security analysis (CVE-2025-54795), 3 production case studies with quantified results
- **06-Production-Deployment-and-Maintenance.md**: Now 21K with observability frameworks, compliance requirements (SOC 2, HIPAA, GDPR), audit trail specifications
- **07-Quick-Reference-and-Templates.md**: Now 32K with inline command templates, hook templates, implementation checklists

#### Summary

This consolidation eliminates 700+ KB of redundant content by merging two documentation directories that served the same purpose. All documentation now resides in `docs/best-practices/` with:
- 17 comprehensive documents (01-17)
- Sequential numbering with no gaps
- Single authoritative source
- Enhanced content from recent production-grade integrations

See [MIGRATION.md](MIGRATION.md) for complete document number mapping and migration details.

---

*Previous changes were not tracked in CHANGELOG. This is the first formal changelog entry.*
