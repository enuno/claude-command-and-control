---
name: mempalace
description: MemPalace local-first AI memory system. Use when setting up persistent memory for Claude Code sessions, mining project files or conversation transcripts, querying past context, configuring MCP tools, managing the knowledge graph, or troubleshooting palace operations.
triggers:
  - When setting up persistent memory for Claude Code or another AI agent
  - When mining project files, repos, or conversation transcripts into a palace
  - When searching past sessions or retrieving forgotten context
  - When wiring auto-save hooks (stop hook, precompact hook)
  - When configuring the MCP server (29 tools) for palace reads/writes
  - When working with the knowledge graph (entities, relationships, timelines)
  - When backfilling existing JSONL transcripts into memory
  - When troubleshooting palace repair, deduplication, or migration
  - When adding a new storage backend or customizing the embedding model
  - When running LongMemEval or other memory benchmarks
---

# MemPalace Skill

MemPalace (v3.3.6) is a local-first AI memory system. It stores conversation history and project content verbatim — no summarization, no paraphrasing, no external API calls by default. Retrieval uses hybrid BM25 + semantic search, achieving 96.6% R@5 on LongMemEval with zero LLM involvement.

## When to Use This Skill

- Setting up persistent memory for Claude Code or another LLM agent
- Mining project files (`mempalace mine`) or Claude Code transcripts (`--mode convos`)
- Retrieving forgotten context from past sessions (`mempalace search`, `wake-up`)
- Wiring auto-save hooks so sessions survive context compression
- Installing and configuring the MCP server (29 palace tools)
- Managing the knowledge graph (entities, predicates, temporal relationships)
- Backfilling existing `~/.claude/projects/` JSONL transcripts
- Repairing, deduplicating, or migrating a corrupted or upgraded palace
- Writing custom storage backends or switching embedding models
- Reproducing or extending memory benchmarks

## Core Architecture

```
Palace structure:
  WING   — broad category (person, project, topic)
    └── ROOM   — time-based grouping (day, session)
          └── DRAWER — verbatim text chunk (exact words)

Index layer (AAAK dialect):
  Compressed pointers → DRAWER locations
  LLM scans AAAK index to know which drawer to open — no full content read needed

Knowledge Graph (SQLite):
  ENTITY → PREDICATE → ENTITY  (with valid_from / valid_to dates)
```

### 4-Layer Memory Stack (token budget)

| Layer | Tokens | Loaded | Purpose |
|-------|--------|--------|---------|
| L0 | ~100 | Always | Identity — `~/.mempalace/identity.txt` |
| L1 | ~500–800 | Always | Essential story — top moments from the palace |
| L2 | ~200–500 each | On demand | Wing/topic content when referenced |
| L3 | Unlimited | On demand | Full ChromaDB semantic search |

`mempalace wake-up` loads L0+L1 (~600–900 tokens total), leaving 95%+ of context free.

## Install

```bash
# Recommended — isolates deps, puts CLI on PATH
uv tool install mempalace

# Or with pipx
pipx install mempalace

# Inside an activated venv only
pip install mempalace
```

Python 3.9+ required. ChromaDB is the default backend (~300 MB for the embedding model).

First-run setup (choose embedding model, configure palace path):
```bash
python -m mempalace.onboarding
```

## Key CLI Commands

### Initialize a palace for a project
```bash
mempalace init ~/projects/myapp
```

### Mine content into the palace
```bash
# Project source files
mempalace mine ~/projects/myapp

# Claude Code conversation transcripts
mempalace mine ~/.claude/projects/ --mode convos

# Scope to a specific wing (person/project)
mempalace mine ~/.claude/projects/myapp --wing myapp
```

### Sweep — store one drawer per message (per-message granularity)
```bash
# Idempotent and resume-safe; run periodically for fine-grained recall
mempalace sweep ~/.claude/projects/myapp/
```

### Search past sessions
```bash
mempalace search "why did we switch to GraphQL"
mempalace search "auth bug fix" --wing myapp
```

### Load memory context for a new session
```bash
mempalace wake-up
```

### Knowledge graph
```bash
# Query graph (entities, relationships, timelines)
mempalace status          # palace overview
```

### Hooks
```bash
mempalace hook install    # wire stop + precompact hooks
mempalace hook status     # verify hooks are active
```

### Repair and maintenance
```bash
mempalace repair          # consistency checks
mempalace repair --status # dry-run report
mempalace migrate         # ChromaDB version migration
```

## Claude Code Hooks

Two hooks ship with MemPalace for automatic session persistence:

| Hook | Trigger | Purpose |
|------|---------|---------|
| `mempal_save_hook.sh` | Stop | Saves session diary to palace before Claude exits |
| `mempal_precompact_hook.sh` | PreCompact | Saves state before context compression |

**Wire the hooks** (required for automatic persistence):
```bash
mempalace hook install
```

The hooks must find the `mempalace` CLI. If installed via `uv tool`, ensure `~/.local/bin` is on PATH inside the hook:
```bash
export PATH="$HOME/.local/bin:$PATH"
```

## MCP Server

29 MCP tools cover palace reads/writes, knowledge-graph operations, cross-wing navigation, drawer management, and agent diaries.

```bash
# Start MCP server
mempalace mcp
```

Key tool categories:
- Palace read/write (drawers, rooms, wings)
- Knowledge graph (entity add/query/invalidate, timeline)
- Agent diaries (per-agent wings, diary entries)
- Cross-wing navigation and tunnels
- `mempalace_list_agents` — discover agent wings at runtime (no system-prompt bloat)

## Design Principles (non-negotiable)

- **Verbatim always** — never summarizes, paraphrases, or lossy-compresses user data
- **Incremental only** — append-only after initial build; crashes leave existing palace untouched
- **Entity-first** — keyed by real names with DOB/ID disambiguation
- **Local-first** — zero external API by default; BYOK (Anthropic, OpenAI, Google) is explicit and never silent
- **Performance budgets** — hooks <500ms, startup injection <100ms
- **Privacy by architecture** — data physically cannot leave the machine for core operations

## Benchmarks

| Benchmark | Mode | Score |
|-----------|------|-------|
| LongMemEval R@5 (500q) | Raw semantic, no LLM | **96.6%** |
| LongMemEval R@5 (500q) | Hybrid v4, held-out 450q | **98.4%** |
| LongMemEval R@5 (500q) | Hybrid v4 + LLM rerank | ≥99% |
| LoCoMo R@10 (1,986q) | Hybrid v5 | **88.9%** |
| ConvoMem avg recall (250) | All categories | **92.9%** |
| MemBench R@5 (8,500) | All categories | **80.3%** |

Raw 96.6% requires no API key and no LLM at any stage.

## Storage Backends

Default: ChromaDB. To add a custom backend:
1. Subclass `mempalace/backends/base.py`
2. Register in `backends/__init__.py`

## Key Source Files

| Task | File |
|------|------|
| Add an MCP tool | `mempalace/mcp_server.py` — add handler + TOOLS dict entry |
| Change search | `mempalace/searcher.py` |
| Modify mining | `mempalace/miner.py` (files) or `convo_miner.py` (transcripts) |
| Add storage backend | Subclass `mempalace/backends/base.py` |
| Input validation | `mempalace/config.py` — `sanitize_name()` / `sanitize_content()` |
| AAAK compression | `mempalace/dialect.py` |
| 4-layer stack | `mempalace/layers.py` |

## Examples

### Example 1: Claude Code retention setup (fastest path)
```bash
uv tool install mempalace
python -m mempalace.onboarding          # choose embedding model
mempalace init ~/projects/myapp
mempalace mine ~/.claude/projects/ --mode convos --wing myapp
mempalace hook install                  # wire stop + precompact
mempalace wake-up                       # load L0+L1 into context
```

### Example 2: Per-message granularity (sweep after mining)
```bash
# After mining, sweep for one drawer per message
mempalace sweep ~/.claude/projects/myapp/
# Subsequent sweeps are idempotent — safe to run repeatedly
```

### Example 3: Multi-agent palace
```bash
# Each agent gets its own wing and diary
# Discover agents at runtime (no system-prompt bloat):
mempalace_list_agents   # via MCP tool
```

### Example 4: Backfill existing JSONL transcripts
```bash
# Mine all existing Claude Code sessions retroactively
mempalace mine ~/.claude/projects/ --mode convos
# Then sweep for message-level granularity
mempalace sweep ~/.claude/projects/
```

## Resources

- Docs: https://mempalaceofficial.com/guide/getting-started
- CLI reference: https://mempalaceofficial.com/reference/cli
- Python API: https://mempalaceofficial.com/reference/python-api
- MCP tools: https://mempalaceofficial.com/reference/mcp-tools
- Knowledge graph: https://mempalaceofficial.com/concepts/knowledge-graph
- Hooks guide: https://mempalaceofficial.com/guide/hooks
- Retention checklist: https://mempalaceofficial.com/guide/claude-code-retention
- GitHub: https://github.com/MemPalace/mempalace
