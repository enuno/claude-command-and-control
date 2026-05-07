# Understanding the `.claude/` Directory Structure: Organization & Best Practices

## Overview

The `.claude/` folder is the **control center** for how Claude Code behaves in your project. It holds instructions, custom commands, skill definitions, agent configurations, permission rules, and session metadata.

Most Claude Code users treat this folder like a black box—they know it exists, but they've never fully understood what goes where or why. This document maps the entire anatomy of the `.claude/` folder, from files you'll use daily to ones you'll set once and forget.

**Key principle**: Once you understand what lives where and why, you can configure Claude Code to behave exactly the way your team needs it to.

---

## Part 1: Two Folders, Not One

Before diving into components, understand a critical distinction: there are actually **two** `.claude/` directories in play:

### Project-Level `.claude/` (committed to git)

- **Location**: `your-project/.claude/`
- **Scope**: Team configuration, shared across everyone who clones the repo
- **Git status**: Committed, tracked, part of version control
- **Contents**: Instructions, custom commands, skill definitions, rules, agents, permissions
- **Purpose**: Enforce consistent behavior and tooling across the team

### Global `~/.claude/` (in your home directory)

- **Location**: `~/.claude/` (your machine only)
- **Scope**: Personal preferences and machine-local state
- **Git status**: Never committed, isolated to your machine
- **Contents**: Personal instructions, custom commands/skills/agents, session history, auto-memory
- **Purpose**: Capture your individual working style without affecting team members

This separation is intentional: **team rules live in the repo, personal preferences live on your machine**.

---

## Part 2: The Core Files

### `CLAUDE.md` — Your Instruction Manual

**Location**:
- Project-level: `project-root/CLAUDE.md` (or `project-root/.claude/CLAUDE.md` for organization)
- Global: `~/.claude/CLAUDE.md`

**Purpose**: This is the single most important file in the entire system. When Claude Code starts a session, it reads `CLAUDE.md` first and keeps it in the system prompt for the entire conversation.

**Effect**: Whatever you write in `CLAUDE.md`, Claude will follow. Always.

#### What to Include in `CLAUDE.md`

**Write:**
- Build, test, and lint commands (`npm run test`, `make build`, `cargo test`, etc.)
- Key architectural decisions ("we use a monorepo with Turborepo," "API uses Express + PostgreSQL")
- Non-obvious gotchas ("TypeScript strict mode is on; unused variables are errors")
- Import conventions, naming patterns, and error handling styles
- File and folder structure for the main modules
- How to run the development server and common workflows

**Don't Write:**
- Anything that belongs in a linter or formatter config (eslintrc, prettierrc, etc.)
- Full documentation you can already link to (point to README instead)
- Long paragraphs explaining theory or philosophy

#### Size Matters

Keep `CLAUDE.md` under 200 lines. Files longer than that eat too much context, and Claude's instruction adherence actually drops. Be ruthless about brevity.

#### Multi-Level `CLAUDE.md`

Claude reads multiple `CLAUDE.md` files and combines them:
- `~/.claude/CLAUDE.md` — Global, applies to all projects
- `project-root/CLAUDE.md` — Team instructions for this project
- `project-root/.claude/CLAUDE.md` — Alternative location (if you prefer it in `.claude/`)
- `subdirectory/CLAUDE.md` — Folder-specific rules (if you have complex subdirectories)

All of them load together. This lets you have global principles that apply everywhere while also having project-specific rules.

#### Example: Minimal but Effective `CLAUDE.md`

```markdown
# Project: Acme API

## Commands
npm run dev    # Start dev server
npm run test   # Run tests (Jest)
npm run lint   # ESLint + Prettier check
npm run build  # Production build

## Architecture
- Express REST API, Node 20
- PostgreSQL via Prisma ORM
- All handlers in src/handlers/
- Shared types in src/types/

## Conventions
- Use zod for request validation in every handler
- Return shape is always { data, error }
- Never expose stack traces to the client
- Use the logger module, not console.log

## Watch Out For
- Tests use a real local DB, not mocks. Run `npm run db:test:reset` first
- Strict TypeScript: no unused imports, ever
```

That's ~20 lines. It gives Claude everything needed to work productively without constant clarification.

---

### `CLAUDE.local.md` — Personal Overrides

**Location**: `project-root/CLAUDE.local.md`

**Purpose**: For preferences specific to you, not the whole team.

**Example use cases**:
- You prefer a different test runner
- You want Claude to use a specific file-reading pattern
- You have personal coding principles that don't apply to the team

**Key property**: Automatically gitignored. Your personal tweaks never land in the repo.

Claude reads both `CLAUDE.md` and `CLAUDE.local.md` together, with `CLAUDE.local.md` taking precedence for conflicts.

---

## Part 3: Organizing Instructions at Scale

### `rules/` Folder — Modular, Maintainable Instructions

**Location**: `.claude/rules/`

**Purpose**: As your team grows, a single `CLAUDE.md` becomes unwieldy (300+ lines, hard to maintain). The `rules/` folder solves this by splitting instructions by concern.

Every markdown file in `.claude/rules/` automatically loads alongside your `CLAUDE.md`:

```
.claude/rules/
├── code-style.md
├── testing.md
├── api-conventions.md
├── security.md
└── database.md
```

#### Advantages

- Each rule stays focused and maintainable
- Team members can own different files (e.g., the API owner maintains `api-conventions.md`)
- No merge conflicts over single giant files
- Rules load lazily; only relevant ones apply

#### Path-Scoped Rules

Add YAML frontmatter to a rule file, and it only activates for matching file paths:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---

# API Design Rules

- All handlers return { data, error } shape
- Use zod for request body validation
- Never expose internal error details to clients
```

Claude won't load this rule when editing a React component. It only activates for `src/api/` and `src/handlers/`.

Rules without a `paths` field load unconditionally, every session.

#### When to Use `.rules/`

When your `CLAUDE.md` exceeds ~200 lines or covers more than 3 distinct topics, split it into `rules/`:
- `rules/code-style.md` — Formatting, naming, structure
- `rules/testing.md` — Test patterns, coverage expectations
- `rules/api-conventions.md` — REST design, error handling
- `rules/security.md` — Auth, secrets, validation

---

## Part 4: Custom Commands & Slash Commands

### `.claude/commands/` — Slash Commands Your Team Uses

**Location**: `.claude/commands/`

**Purpose**: Out of the box, Claude Code has built-in slash commands like `/help` and `/compact`. The `commands/` folder lets you add custom ones.

**How it works**: Every markdown file becomes a slash command. Filename → command name:
- `review.md` → `/project:review`
- `fix-issue.md` → `/project:fix-issue`
- `deploy.md` → `/project:deploy`

#### Example: A Code Review Command

Create `.claude/commands/review.md`:

```markdown
---
description: Review the current branch diff for issues before merging
---

## Changes to Review

!`git diff --name-only main...HEAD`

## Detailed Diff

!`git diff main...HEAD`

Review the above changes for:
1. Code quality issues
2. Security vulnerabilities
3. Missing test coverage
4. Performance concerns

Give specific, actionable feedback per file.
```

Now run `/project:review` and Claude:
1. Automatically runs the git commands
2. Embeds the real diff into the prompt
3. Reviews based on your project's actual changes

The `!` backtick syntax runs shell commands and embeds output—that's what makes these genuinely useful.

#### Passing Arguments to Commands

Use `$ARGUMENTS` to pass text after the command name:

```markdown
---
description: Investigate and fix a GitHub issue
argument-hint: [issue-number]
---

Look at issue #$ARGUMENTS in this repo.

!`gh issue view $ARGUMENTS`

Understand the bug, trace it to the root cause, fix it, and write a
test that would have caught it.
```

Running `/project:fix-issue 234` feeds issue #234 directly into the prompt.

#### Personal vs. Project Commands

- **Project commands** (`.claude/commands/`): Committed, shared with team, show as `/project:command-name`
- **Personal commands** (`~/.claude/commands/`): Your machine only, available across all projects, show as `/user:command-name`

Personal commands are great for:
- Daily standup helpers
- Commit message generators following your convention
- Quick security scans
- Custom debugging workflows

---

## Part 5: Reusable Workflows with Skills

### `.claude/skills/` — Auto-Invoked Workflows

**Location**: `.claude/skills/` (project) or `~/.claude/skills/` (personal)

**Key distinction from commands**:
- **Commands** wait for you to type `/command-name`
- **Skills** watch the conversation and invoke themselves when the task matches

Each skill lives in its own subdirectory with a `SKILL.md` file:

```
.claude/skills/
├── security-review/
│   ├── SKILL.md
│   └── DETAILED_GUIDE.md
├── deploy/
│   ├── SKILL.md
│   └── templates/
│       └── release-notes.md
└── performance-audit/
    └── SKILL.md
```

#### How Skills Work

The `SKILL.md` uses YAML frontmatter to describe when to use it:

```markdown
---
name: security-review
description: >
  Comprehensive security audit. Use when reviewing code for
  vulnerabilities, before deployments, or when the user mentions security.
allowed-tools: Read, Grep, Glob
---

Analyze the codebase for security vulnerabilities:

1. SQL injection and XSS risks
2. Exposed credentials or secrets
3. Insecure configurations
4. Authentication and authorization gaps

Report findings with severity ratings and specific remediation steps.
Reference @DETAILED_GUIDE.md for our security standards.
```

When you say "review this PR for security issues," Claude:
1. Reads the skill description
2. Recognizes it matches your request
3. Automatically invokes the skill

You can also call it explicitly: `/security-review`.

#### Skills vs. Commands: The Key Difference

**Commands**: Single files. You invoke them. Static structure.

**Skills**: Packages of related files. Self-invoke when relevant. Can reference supporting materials:
- `@DETAILED_GUIDE.md` pulls in detailed docs
- `@templates/` references templates
- `@examples/` can reference examples

Skills bundle context alongside the workflow, making them more powerful than commands for complex tasks.

#### Personal Skills

Skills in `~/.claude/skills/` are available across all your projects. Good personal skills:
- A debugging workflow you use everywhere
- A testing template you prefer
- A deployment checklist you've refined

---

## Part 6: Specialized Subagents with Agents

### `.claude/agents/` — Specialized Agent Personas

**Location**: `.claude/agents/` (project) or `~/.claude/agents/` (personal)

**Purpose**: For complex tasks that benefit from a dedicated specialist working in isolation.

Each agent is a markdown file with its own system prompt, tool restrictions, and model preference:

```
.claude/agents/
├── code-reviewer.md
├── security-auditor.md
└── performance-profiler.md
```

#### Example: A Code Reviewer Agent

Create `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: >
  Expert code reviewer. Use PROACTIVELY when reviewing PRs,
  checking for bugs, or validating implementations before merging.
model: sonnet
tools: Read, Grep, Glob
---

You are a senior code reviewer with a focus on correctness and maintainability.

When reviewing code:
- Flag bugs, not just style issues
- Suggest specific fixes, not vague improvements
- Check for edge cases and error handling gaps
- Note performance concerns only when they matter at scale
```

#### How Agents Work

When Claude needs a code review:
1. It spawns the `code-reviewer` agent in its own isolated context window
2. The agent does its work without cluttering your main session
3. It compresses findings and reports back
4. The main session stays clean and focused

#### Why Agents Matter

- **Isolation**: Agent work doesn't compete for context in your main session
- **Tool restrictions**: Explicit about what agents can/can't do. A security auditor only needs `Read`, `Grep`, `Glob`—no file writing
- **Model efficiency**: Use cheaper models (Haiku) for focused read-only tasks. Save Sonnet/Opus for work that needs them
- **Focused expertise**: Each agent has a specialized system prompt, not watered down

---

## Part 7: Permissions & Configuration

### `settings.json` — What Claude Can Do

**Location**: `.claude/settings.json`

**Purpose**: Define what Claude is and isn't allowed to do:
- Which tools can run without asking
- Which commands are forbidden entirely
- Sensitive files that need protection

#### Structure

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

#### Allow List (Auto-Approved)

These run without Claude asking permission:
- `Bash(npm run *)` — Your build/test scripts
- `Bash(git status)`, `Bash(git diff *)` — Git read-only commands
- `Read`, `Write`, `Edit`, `Glob`, `Grep` — File operations

#### Deny List (Blocked Entirely)

These never run, no matter what:
- `Bash(rm -rf *)` — Destructive file operations
- `Bash(curl *)` — Direct network requests
- `Read(./.env)` — Sensitive environment files

#### The Middle Ground

Anything not on either list? Claude asks before proceeding. That safety net is intentional.

### `settings.local.json` — Personal Permission Overrides

**Location**: `.claude/settings.local.json`

**Purpose**: Permission changes you don't want committed (auto-gitignored).

Example: You might want to locally allow something forbidden in the team config:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run test:integration)"
    ]
  }
}
```

---

## Part 8: Global `~/.claude/` for Personal State

You rarely manage this folder directly, but it's useful to know what's in it:

### `~/.claude/CLAUDE.md`

Your global instructions for all projects. Good place for:
- Personal coding principles ("I prefer functional patterns")
- Preferred style conventions
- Anything you want Claude to remember across all repos

### `~/.claude/projects/`

Claude Code automatically saves session transcripts and auto-memory per project here:
- Remembered commands you've discovered
- Architecture patterns it observed
- Insights that persist across sessions
- Use `/memory` to browse and edit

### `~/.claude/commands/` and `~/.claude/skills/`

Personal commands and skills available across all projects (show as `/user:*` instead of `/project:*`).

### `~/.claude/agents/`

Personal agents available everywhere.

---

## Part 9: The Full Picture

Here's how everything fits together:

```
your-project/
├── CLAUDE.md           # Team instructions (committed)
├── CLAUDE.local.md     # Your personal overrides (gitignored)
│
└── .claude/
    ├── settings.json       # Permissions + config (committed)
    ├── settings.local.json # Personal overrides (gitignored)
    │
    ├── commands/           # Custom slash commands (/project:*)
    │   ├── review.md
    │   ├── fix-issue.md
    │   └── deploy.md
    │
    ├── rules/              # Modular instruction files
    │   ├── code-style.md
    │   ├── testing.md
    │   ├── api-conventions.md
    │   └── security.md
    │
    ├── skills/             # Auto-invoked workflows
    │   ├── security-review/
    │   │   ├── SKILL.md
    │   │   └── DETAILED_GUIDE.md
    │   └── deploy/
    │       ├── SKILL.md
    │       └── templates/
    │
    └── agents/             # Specialized subagent personas
        ├── code-reviewer.md
        ├── security-auditor.md
        └── performance-profiler.md

~/.claude/
├── CLAUDE.md   # Your global instructions
├── settings.json
├── commands/   # Your personal commands (all projects)
├── skills/     # Your personal skills (all projects)
├── agents/     # Your personal agents (all projects)
└── projects/   # Session history + auto-memory
```

---

## Part 10: A Practical Progression

If you're starting from scratch, here's a progression that works:

### Stage 1: Foundation (Week 1)

1. Run `/init` inside Claude Code. It generates a starter `CLAUDE.md` by reading your project.
2. Edit it down to essentials—aim for under 150 lines.
3. Add `.claude/settings.json` with allow/deny rules appropriate for your stack.
   - At minimum: allow your run commands, deny `.env` reads.

### Stage 2: Early Efficiency (Week 2-3)

4. Create one or two commands for workflows you do most frequently.
   - Code review (`/project:review`)
   - Issue fixing (`/project:fix-issue`)

### Stage 3: Scaling Instructions (Month 1)

5. As your `CLAUDE.md` gets crowded (>200 lines), split it into `.claude/rules/`.
   - Scope rules by path where it makes sense.

### Stage 4: Personal Preferences (Month 1)

6. Add `~/.claude/CLAUDE.md` with personal principles.
   - Example: "always write types before implementations"
   - Example: "prefer functional patterns over class-based"

### Stage 5: Automating Recurrence (Month 2+)

7. Identify recurring complex workflows and package them as skills.
   - Security audit workflows
   - Deployment checklists
   - Complex debugging patterns

### Stage 6: Specialized Roles (Month 3+)

8. Create agents for specialized tasks (only if you have genuinely isolated, complex workflows).
   - Code reviewer working in isolation
   - Performance auditor
   - Security scanner

**95% of projects stop at Stage 4 and are completely functional.** Stages 5-6 are optimization for teams with complex, recurring workflows.

---

## Part 11: Key Insights

### `CLAUDE.md` Is Your Highest-Leverage File

Get that right first. Everything else is optimization. Spend 30 minutes writing a clear, concise `CLAUDE.md`. Skip the elaborate `.rules/` folder and fancy skills if you haven't nailed the basics.

### Clarity Compounds

The more clearly you define:
- Who you are as a team
- What your project does
- What rules Claude should follow

The less time you spend correcting Claude and the more time it spends doing useful work.

### Start Small, Refine as You Go

Don't build an elaborate `.claude/` structure upfront. Start with `CLAUDE.md` and `settings.json`. Add `.rules/` when your instructions get crowded. Add commands for workflows you repeat. Add skills when you have genuinely complex, recurrent tasks.

Treat the `.claude/` folder like any other piece of infrastructure in your project: something that pays dividends every day once it's set up properly.

---

## Part 12: Checklist for Your Project

Use this to audit your `.claude/` setup:

- [ ] **CLAUDE.md exists** and is under 200 lines
- [ ] **CLAUDE.md documents** your commands, architecture, conventions, and gotchas
- [ ] **settings.json exists** with reasonable allow/deny rules
- [ ] **Sensitive files** (`.env`, secrets) are in the deny list
- [ ] **Build commands** (npm, make, cargo, etc.) are in the allow list
- [ ] **At least one custom command** exists for workflows you do frequently
- [ ] **`.claude/` folder is gitignored** if it contains sensitive content (it shouldn't at project level, but be explicit)
- [ ] **`CLAUDE.local.md` exists** if you have personal team-specific overrides
- [ ] **`rules/` folder is used** if `CLAUDE.md` exceeds 200 lines
- [ ] **Every rule has a clear purpose** (not just "miscellaneous stuff")

---

## References

For deeper guidance on specific topics:
- See `docs/best-practices/02-Individual-Command-Creation.md` for detailed command patterns
- See `docs/best-practices/09-Developing-High-Impact-Claude-Skills.md` for skill best practices
- See `docs/best-practices/03-Individual-Agent-Configuration.md` for agent design
