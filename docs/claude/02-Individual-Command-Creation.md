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

---

## Production-Grade Command Architecture

### Three-Tier Command Hierarchy

Production Claude Code implementations employ a three-tier command hierarchy that separates personal automation, team workflows, and organizational standards:

**1. User-Level Commands** (`~/.claude/commands/`):
- **Purpose**: Personal productivity tools for individual developers
- **Versioning**: Outside project repositories, enabling private experimentation
- **Use Cases**: Personalized commit message formats, custom test runners, individual analysis scripts
- **Scope**: Developer-specific workflows without team coordination overhead

**2. Project-Level Commands** (`.claude/commands/`):
- **Purpose**: Team-shared workflows versioned with repositories
- **Versioning**: Git-tracked, ensuring consistency across team members
- **Use Cases**: CI/CD integration, deployment checks, code review preparation
- **Scope**: Codify institutional knowledge, ensuring consistent execution regardless of seniority

**3. Organization-Wide Standards** (`/Library/Application Support/ClaudeCode/CLAUDE.md` on macOS, `~/.config/claude-code/CLAUDE.md` on Linux):
- **Purpose**: System-level deployment of company-wide coding standards
- **Versioning**: Centrally managed, propagated to all Claude Code instances
- **Use Cases**: Security policies, architectural conventions, compliance requirements
- **Scope**: Enforce baseline compliance without manual synchronization

**Benefits**:
- Clear separation of concerns (personal vs team vs organization)
- Reduced configuration drift across developers
- Centralized governance for compliance-critical standards

### Command Composability and Orchestration

Commands should be designed as **atomic operations** that compose into higher-order workflows.

**Atomic Commands** (Single Responsibility):
```markdown
# /lint - Run linter with auto-fix
!npm run lint:fix

# /test - Execute test suite
!npm test

# /commit - Stage and commit changes
!git add .
!git commit -m "$1"
```

**Orchestration Commands** (Compose Atomic Operations):
```markdown
---
description: "Complete PR workflow: lint, test, commit, create PR"
allowed-tools: ["Bash(git:*)", "Edit", "Test", "GitHub"]
---

# /pr - Prepare Pull Request

1. Run linter: /lint
2. Run tests: /test
3. Commit changes: /commit "$1"
4. Create PR: !gh pr create --title "$2" --body "$3"

Expected output: PR URL and quality check summary
```

**Programmatic Invocation with SlashCommand Tool**:

Agents can invoke commands programmatically within reasoning loops:

```markdown
# Orchestration agent workflow
1. Invoke /run-tests via SlashCommand tool
2. Evaluate results (pass/fail)
3. Conditionally execute:
   - If pass: /deploy-staging
   - If fail: /revert-commit
4. Implement autonomous CI/CD pipeline
```

**Benefits**:
- **Reusability**: Atomic commands used across multiple workflows
- **Maintainability**: Fix `/lint` once, all composed commands benefit
- **Testability**: Validate atomic operations independently

### Permission-Based Architecture

Claude Code implements a **tiered permission system** balancing power with safety.

**Permission Modes**:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `default` | Prompts on first use of each tool | Standard development |
| `acceptEdits` | Auto-accepts file edit permissions for session | Rapid iteration |
| `plan` | Analysis without file modification or execution | Planning phase |
| `dontAsk` | Auto-denies tools unless pre-approved | High-security environments |
| `bypassPermissions` | Skips all prompts (use cautiously) | Trusted automation only |

**allowed-tools Patterns**:

```yaml
# Minimal permissions (read-only)
allowed-tools: ["Read", "Grep", "Glob"]

# Git operations only
allowed-tools: ["Bash(git:*)"]

# Full development workflow
allowed-tools: ["Bash(git:*,npm:*)", "Edit", "Write", "Test"]

# High-risk (requires justification)
allowed-tools: ["Bash"] # Unrestricted shell access
```

**Precedence Hierarchy**: `deny` → `ask` → `allow`

Deny rules always take priority, implementing defense-in-depth controls.

**Best Practice**: Use most restrictive permissions initially; expand only as needed with clear justification documented in command frontmatter.

### Progressive Disclosure for Commands

Rather than embedding complete documentation inline, production implementations use **progressive disclosure** to manage context bloat.

**Pattern: Reference External Documentation**:

```markdown
# .claude/commands/deploy.md

---
description: "Deploy application following company deployment standards"
allowed-tools: ["Bash(git:*,gh:*)", "Read"]
---

# Deploy Application

## Standards
See `.claude/rules/deployment.md` for deployment procedures.

## Pre-Deployment Checks
Refer to `.claude/rules/security.md` for security validation.

## Steps
1. Verify branch: !git branch --show-current
2. Run deployment script: !./scripts/deploy.sh $1
3. Validate: See DEPLOYMENT.md for post-deploy validation

Expected output: Deployment status and validation results
```

**Modular Rules Architecture**:

```
.claude/
├── commands/
│   ├── deploy.md
│   ├── test.md
│   └── pr.md
└── rules/
    ├── deployment.md       # Deployment procedures
    ├── security.md          # Security standards
    ├── testing.md           # Test conventions
    └── code-style.md        # Formatting rules
```

**Benefits**:
- **Prevents context window saturation**: Commands stay focused
- **Enables on-demand retrieval**: Claude loads referenced files only when needed
- **Supports ownership distribution**: Security team maintains `security.md`, DevOps owns `deployment.md`

### Semantic Versioning for Commands

Command files require **semantic versioning** (MAJOR.MINOR.PATCH) tracking breaking changes, features, and fixes.

**Version Increment Rules**:

| Change Type | Version Increment | Example |
|-------------|-------------------|---------|
| **Breaking Change** | MAJOR (reset MINOR/PATCH to 0) | Change argument order, remove functionality, alter output format |
| **New Feature** | MINOR (increment MINOR, reset PATCH to 0) | Add new argument, add new output field |
| **Bug Fix** | PATCH (increment PATCH only) | Fix timeout handling, correct validation logic |

**Examples**:
- `1.5.2` → `2.0.0` (breaking: removed `--force` flag)
- `2.0.0` → `2.1.0` (feature: added `--dry-run` mode)
- `2.1.0` → `2.1.1` (fix: corrected timeout handling)

**Dependency Management**:

Downstream consumers (orchestration commands, CI/CD pipelines) can specify compatibility constraints:

```markdown
---
dependencies:
  - command: /lint
    version: "^1.0.0"  # Compatible with 1.x.x
  - command: /deploy
    version: "~2.1.0"  # Compatible with 2.1.x
---
```

### CI/CD Pipeline Integration

Claude Code integrates into CI/CD pipelines as **containerized steps**, feeding context via environment variables and returning structured JSON.

**GitHub Actions Example**:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Claude Code Review
        uses: anthropic/claude-code-action@v1
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          command: /code-review
          args: ${{ github.event.pull_request.diff_url }}

      - name: Post Review Comments
        if: ${{ steps.claude-review.outputs.issues-found }}
        uses: actions/github-script@v7
        with:
          script: |
            const review = ${{ steps.claude-review.outputs.review-json }}
            github.rest.pulls.createReview({
              ...context.repo,
              pull_number: context.issue.number,
              body: review.summary,
              event: review.approve ? 'APPROVE' : 'REQUEST_CHANGES',
              comments: review.line_comments
            })
```

**Command Design for CI Integration**:

```markdown
---
description: "Automated code review with structured JSON output"
allowed-tools: ["Read", "Grep", "Bash(git:*)"]
output-format: "json"
---

# /code-review - Analyze PR diff

1. Fetch diff: !git diff HEAD~1
2. Analyze for:
   - Security vulnerabilities
   - Performance issues
   - Style violations
3. Generate review comments with line numbers
4. Output JSON:
   {
     "approve": boolean,
     "summary": string,
     "line_comments": [{line, file, comment}]
   }
```

**Guardrails for Safe Automation**:
- Scope limits: Explicit file/line caps in prompts
- Commit to feature branches, never directly to protected branches
- Require passing CI checks (tests, linters, SAST) before merge
- Track cost metrics to prevent runaway token usage

### Introduction to Hooks: Runtime Validation

**Hooks** provide **deterministic, event-driven policy enforcement** for commands, bridging the gap between soft guidance (documentation) and mandatory controls.

**What Are Hooks?**

Hooks are shell scripts or executables that intercept the command execution lifecycle at well-defined events:

- **PreToolUse**: Fires before tool execution (validation, blocking dangerous operations)
- **PostToolUse**: Fires after completion (auto-formatting, test execution, logging)
- **PermissionRequest**: Override permission decisions (auto-approve safe ops, auto-deny high-risk)
- **Stop**: Fires when agent stops (session summarization, CI/CD triggers)

**Why Use Hooks with Commands?**

Commands provide **instructions** (what to do); hooks provide **enforcement** (what is allowed).

**Example: Security Hook for Commands**:

```bash
#!/bin/bash
# .claude/hooks/bash_security.sh

INPUT=$(cat)  # Read JSON from stdin
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# Block dangerous commands
if echo "$COMMAND" | grep -E "(rm -rf /|sudo|chmod 777)" > /dev/null; then
  echo "❌ Dangerous command blocked by policy" >&2
  exit 2  # Blocking error
fi

exit 0  # Allow
```

**Configuration**:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/bash_security.sh",
        "timeout": 5
      }]
    }]
  }
}
```

**Result**: Commands attempting `!sudo rm -rf /` are **blocked** before execution; Claude receives error message and must fix.

**Benefits**:
- **Deterministic Enforcement**: Unlike prompts, hooks *will* run and *cannot* be ignored
- **Blocking Semantics**: Exit code 2 halts workflow until issue resolved
- **Separation of Concerns**: Policy logic in version-controlled scripts, separate from command prompts

**For Comprehensive Hooks Documentation**: See [Document 05: Testing and Quality Assurance](05-Testing-and-Quality-Assurance.md#production-grade-hooks) for formal hook model, lifecycle events, security analysis, and production case studies.

### Reference Architectures

**Small Team Architecture (5-25 Developers)**:

**Toolchain Composition**:
- **Primary**: Claude Code for architecture, planning, complex reasoning (Sonnet 4/Opus 4)
- **Secondary**: GitHub Copilot for rapid boilerplate generation
- **Supporting**: Cursor for multi-file refactors with preview

**Command Strategy**:
- 5-10 core team workflows in `.claude/commands/`
- `/test`, `/lint`, `/pr`, `/deploy-check` as atomic commands
- 2-3 orchestration commands for common workflows (`/prepare-release`)

**Infrastructure**:
- GitHub Actions for CI/CD automation
- CLAUDE.md in repository root with project standards
- Shared Slack channel for notifications via PostToolUse hooks

**Cost Optimization**: Use Sonnet 4 for execution, reserve Opus 4 for architectural decisions (28.4% cost reduction, 96.7% performance maintained)

**Platform Engineering Organization (100+ Developers)**:

**Orchestrator-Worker Pattern**:
- **Lead Orchestrator**: Opus 4 agent decomposes complex requests
- **Specialized Workers**: Sonnet 4 agents handle focused domains (backend, frontend, DevOps)
- **Commands as Building Blocks**: Workers invoke atomic commands programmatically

**Command Strategy**:
- 20-30 atomic commands in `.claude/commands/`
- 10-15 orchestration commands for multi-step workflows
- Organization-wide standards in system-level CLAUDE.md

**Feature Directories**:

```
.claude/
├── features/
│   └── user-authentication/
│       ├── implementation-plan.md
│       ├── to-do.md
│       └── commands/
│           ├── setup-auth.md
│           └── test-auth.md
```

**Governance Framework**:
- Cross-functional council (IT, legal, compliance, operations)
- Policy catalog for approved command behaviors
- Approval workflows for high-risk commands (production deployments)
- Continuous audit of command executions

## Anti-Patterns to Avoid
- Do not use hardcoded values that may break across projects.
- Avoid excessive command chaining in a single file. Keep subcommands reusable.
- Never grant shell wildcards (`*`) in allowed-tools unnecessarily.

## Maintenance
- Periodically audit and prune unused or stale commands
- Update documentation and increment version on any logic changes
- Run static analysis for shell or tool-based commands prior to use
- Review command usage analytics to identify optimization opportunities
- Retire commands with < 1% activation rate

---

## Conclusion

Claude Code commands transform repetitive workflows into reusable, version-controlled automation. By following production-grade patterns—three-tier hierarchy, atomic composition, progressive disclosure, and hook-based enforcement—teams can achieve:

- **Consistency**: Standardized workflows across all team members
- **Safety**: Permission-scoped operations with deterministic validation
- **Velocity**: 2-10x productivity improvements in production environments
- **Governance**: Auditable, policy-compliant automation at scale

**Next Steps**:
1. Identify 3-5 high-value workflows to automate
2. Start with atomic commands using templates from [Document 07](07-Quick-Reference-and-Templates.md)
3. Add hooks for quality/security enforcement (see [Document 05](05-Testing-and-Quality-Assurance.md#production-grade-hooks))
4. Integrate commands into CI/CD pipelines
5. Deploy observability (see [Document 06](06-Production-Deployment-and-Maintenance.md#observability-and-feedback-loops))
6. Measure impact and iterate

**For Further Reading**:
- [Document 03: Individual Agent Configuration](03-Individual-Agent-Configuration.md) - Agent configuration and integration
- [Document 05: Testing and Quality Assurance](05-Testing-and-Quality-Assurance.md) - Comprehensive hooks documentation
- [Document 06: Production Deployment and Maintenance](06-Production-Deployment-and-Maintenance.md) - Observability and audit trails
- [Document 07: Quick Reference and Templates](07-Quick-Reference-and-Templates.md) - Command templates and checklists

---

**Document Version**: 2.0.0
**Last Updated**: January 23, 2026
**Maintained By**: Claude Command and Control Project
**Review Cycle**: Quarterly