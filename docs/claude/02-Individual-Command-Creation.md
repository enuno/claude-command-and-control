# Individual Command Creation: Technical Specifications and Best Practices

## Purpose
This document details how to create, structure, and maintain Claude custom slash commands for project and personal automation, ensuring efficiency, reusability, and security.

## Command Structure Overview
Claude Code commands are markdown-based prompt templates, triggered with `/command-name` syntax and placed in either project or user command directories for instant reuse.

### Command File Placement
- **Personal commands:** `~/.claude/commands/`
- **Project commands:** `.claude/commands/` (versioned with repository)

## Anatomy of a Claude Command File
### Required Sections
1. **Frontmatter** (YAML block at top):
   - `description`: What this command does
   - `allowed-tools`: Array of tools/operations permitted
   - `author`: Creator or maintainer
   - `version`: Semantic version string (e.g., 1.0)

2. **Prompt Body**: Natural language describing the workflow; leverage sections, numbered steps, and variable placeholders

3. **Dynamic Arguments**
   - Use `$1`, `$2`, etc. for positional arguments in the command
   - Reference dynamic context with `@file`, environment variables, or command outputs

4. **Tool/Script Execution**
   - Prefix command-line steps with `!`, e.g., `!git status --porcelain`
   - Reference editor operations or toolchain functions,
     e.g., `Edit`, `Read`, `Test`

5. **Context Injection**
   - Use `@` to inject file contents or other context

## Recommended Practices

### Naming
- Concise, descriptive, verb-noun phrases (e.g., `/prepare-pr`, `/deploy-check`)
- Standardize naming for modular composition (e.g., `/lint`, `/test`, `/build`, `/release`)

### Scope
- Keep each command focused on a single responsibility.
- For complex flows, create parent commands that invoke simpler subordinate commands.
- Avoid feature bloat; prefer separate commands for distinct subtasks.

### Documentation
- Always describe what, why, and how the command functions in the `description`.
- Use inline comments in the prompt body for non-obvious logic.

### Security
- Strictly specify `allowed-tools` to prevent dangerous operations by default (e.g., restrict shell, file system, or network access).
- Use pre-tool-use hooks to validate and sanitize dynamic input before execution.

### Versioning and Review
- Increment semantic version with changes.
- Use code review and static analysis for any command used by a team or with system privileges.

### Templates and Reusability
- Store reusable boilerplate for command patterns
- Reference these templates for new commands or composite workflows

## Example: Comprehensive PR Command
```markdown
---
description: "Run all pre-PR quality checks and open PR."
allowed-tools: ["Bash(git:*)", "Edit", "Test"]
author: "Jane Doe"
version: "1.1"
---

# Prepare PR

1. !git status --porcelain
2. !npm run lint:fix
3. !npm test
4. !git add .
5. Prompt for commit message (using $1 if set)
6. !git commit -m "$COMMIT_MSG"
7. !gh pr create --title "$TITLE" --body "$BODY"

Provide a summary of checks and PR link at the end.
```

## Anti-Patterns to Avoid
- Do not use hardcoded values that may break across projects.
- Avoid excessive command chaining in a single file. Keep subcommands reusable.
- Never grant shell wildcards (`*`) in allowed-tools unnecessarily.

## Maintenance
- Periodically audit and prune unused or stale commands
- Update documentation and increment version on any logic changes
- Run static analysis for shell or tool-based commands prior to use

---
See Document 3 for agent configuration and integration with these commands.