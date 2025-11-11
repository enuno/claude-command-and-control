---
description: "Initialize a new Claude coding session: capture project status, load key context, and record developer intent."
allowed-tools: ["Read", "Search", "Bash(git:status)", "Bash(git:branch)", "Bash(git:log)", "Edit"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Start Session

## Purpose
Initialize a productive coding session by establishing context, understanding project state, and aligning on session goals.

## Session Initialization Steps

### 1. Load Project Context
```bash
# Show current branch
!git branch --show-current

# Show uncommitted changes summary
!git status --porcelain

# Show recent commits
!git log --oneline --decorate -10
```

### 2. Read Key Documentation
Read the following files in order (if they exist):
- `@README.md` - Project overview
- `@AGENTS.md` - Universal standards
- `@CLAUDE.md` - Claude-specific configuration
- `@DEVELOPMENT_PLAN.md` - Current project plan
- `@TODO.md` - Task list and priorities
- `@MULTI_AGENT_PLAN.md` - Multi-agent coordination (if applicable)

### 3. Assess Current State
Display to user:
- **Active Branch**: [current branch]
- **Uncommitted Changes**: [count and types]
- **Recent Work**: [last 5 commits]
- **Loaded Context**: [list of files read]

### 4. Gather Session Intent

Prompt user for:
```
Session Setup Questions:

1. What are your primary goals for this session?
   [Allow user to list 1-3 specific objectives]

2. Which agent role(s) will be participating?
   - Architect (planning)
   - Builder (implementation)
   - Validator (testing/review)
   - Scribe (documentation)
   - DevOps (infrastructure)
   - Researcher (investigation)
   [User selects appropriate roles]

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
║          SESSION INITIALIZED SUCCESSFULLY          ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]
BRANCH: [active-branch]
STATUS: Ready to work

GOALS:
  1. [Goal 1]
  2. [Goal 2]
  3. [Goal 3]

ACTIVE ROLES:
  • Architect
  • Builder
  • Validator

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