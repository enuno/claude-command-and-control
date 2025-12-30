---
description: "Initialize Braiins OS MCP Server coding session: capture project status, load key context, and record developer intent."
allowed-tools: ["Read", "Search", "Bash(git:status)", "Bash(git:branch)", "Bash(git:log)", "Bash(docker:ps)", "Edit"]
author: "Ryno Crypto Mining Services"
project: "braiins-os-mcp-server"
version: "1.0"
---

# Start Session - Braiins OS MCP Server

## Purpose
Initialize a productive coding session for the Braiins OS MCP server by establishing project context, verifying infrastructure, and aligning on development goals.

## Session Initialization Steps

### 1. Load Project Context
```bash
# Show current branch
!git branch --show-current

# Show uncommitted changes summary
!git status --porcelain

# Show recent commits
!git log --oneline --decorate -10

# Check Redis status (required for caching)
!docker ps --filter "name=redis" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check if Docker Compose services are running
!docker-compose ps
```

### 2. Read Key Documentation
Read the following files in order (if they exist):
- `@README.md` - Braiins OS MCP server overview
- `@CLAUDE.md` - Project-specific MCP development instructions
- `@DEVELOPMENT_PLAN.md` - MCP tool implementation roadmap
- `@ARCHITECTURE.md` - System architecture (MCP, gRPC, Redis)
- `@docs/claude/AGENT_STRATEGY_UPDATE_SUMMARY.md` - Skills-first paradigm
- `@MULTI_AGENT_PLAN.md` - Multi-agent orchestration (if applicable)

### 3. Assess Current State
Display to user:
- **Project**: braiins-os-mcp-server (Braiins OS API MCP Server)
- **Active Branch**: [current branch]
- **Uncommitted Changes**: [count and types]
- **Recent Work**: [last 5 commits]
- **Infrastructure**:
  - Redis: [running/stopped]
  - Docker Compose: [services status]
- **Loaded Context**: [list of files read]
- **Existing MCP Tools**: authenticate, list_miners, get_miner_status, update_pool_config, update_firmware

### 4. Gather Session Intent

Prompt user for:
```
Session Setup Questions:

1. What are your primary goals for this session?
   [Allow user to list 1-3 specific objectives]

2. Which approach will you use?
   - Skills-First (default): Single agent + mcp-builder skill (1-5 tools)
   - Multi-Agent: Orchestrated parallel development (6+ tools)

   If Skills-First, which workflows?
   - MCP Tool Development (add/modify MCP tools)
   - gRPC Client Enhancement (improve gRPC integration)
   - Redis Caching (optimize cache patterns)
   - Testing & Evaluation (create evaluation harness)
   - Documentation (update API docs)
   [User selects appropriate workflows]

3. Are there any known blockers or context from previous sessions?
   [User provides relevant background]

4. Time commitment for this session?
   - Quick (< 30 min)
   - Standard (30-90 min)
   - Extended (90+ min)
   [User indicates expected duration]
```

### 5. Create Session Log

Create or update `SESSION_LOG.md` with:
```markdown
# Session Log - [DATE] [TIME]

## Session Metadata
- **Start Time**: [ISO 8601 timestamp]
- **Duration Target**: [Quick/Standard/Extended]
- **Active Branch**: [branch name]
- **Uncommitted Changes**: [summary]

## Session Goals
1. [Goal 1]
2. [Goal 2]
3. [Goal 3]

## Participating Agents
- [Role 1] ✓
- [Role 2] ✓

## Context Loaded
- README.md ✓
- AGENTS.md ✓
- CLAUDE.md ✓
- DEVELOPMENT_PLAN.md ✓
- TODO.md ✓

## Notes
[Any context from user about blockers or previous work]

---
```

### 6. Summarize Session Setup

Display a formatted summary:
```
╔════════════════════════════════════════════════════╗
║    BRAIINS OS MCP SERVER SESSION INITIALIZED      ║
╚════════════════════════════════════════════════════╝

PROJECT: braiins-os-mcp-server
SERVICE: Braiins OS API (gRPC + REST)
BRANCH: [active-branch]
STATUS: Ready to work

INFRASTRUCTURE:
  ✓ Redis: [running/stopped]
  ✓ Docker Compose: [status]

GOALS:
  1. [Goal 1]
  2. [Goal 2]
  3. [Goal 3]

APPROACH:
  • Skills-First: mcp-builder skill loaded
  • Workflows: [selected workflows]

EXISTING MCP TOOLS:
  • authenticate, list_miners, get_miner_status
  • update_pool_config, update_firmware

CONTEXT: Fully loaded and ready
TIME: [Start time] → ~[Estimated end time]

Ready to begin! What would you like to do first?
```

## Key Features

- **Automated Discovery**: Automatically detects and loads relevant documentation
- **State Capture**: Records exact project state at session start
- **Intent Alignment**: Ensures developer and agent roles are synchronized
- **Audit Trail**: Creates session log for later reference and handoff
- **Flexibility**: Works with or without AGENTS.md setup

## Error Handling

If critical files missing:
- Continue gracefully, noting what's unavailable
- Suggest creating missing files if appropriate
- Don't block session startup

## Next Steps After Session Start

1. Proceed with stated goals using appropriate agent roles
2. Reference SESSION_LOG.md for ongoing context
3. Use `/close-session` command when work is complete