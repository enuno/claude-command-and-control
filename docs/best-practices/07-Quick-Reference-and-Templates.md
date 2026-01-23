# Quick Reference and Templates: Claude Commands, Agents, and Skills

## Purpose
This document provides ready-to-use patterns and templates for quickly creating new commands, agents, and skills, fostering consistency and efficiency.

---

## Command File Template
```markdown
---
description: "Describe the command's function (1-2 lines)"
allowed-tools: ["Bash(git:*)", "Test", "Read"]
author: "Your Name"
version: "1.0"
---

# [Command Name]

1. !git status --porcelain
2. [Additional steps with shell commands, editor actions, or context references]
3. Provide a summary/result at the end.
```

---

## Agent Role Assignment Table
| Role        | Description                         | Example Permissions                |
|-------------|-------------------------------------|-------------------------------------|
| Architect   | Planning, system design             | "Read", "Edit", "Plan"              |
| Builder     | Code, implementation, modifications | "Bash(git:*)", "Edit"               |
| Validator   | Testing, QA, review                 | "Test", "Review"                    |
| Scribe      | Documentation and comments          | "Read", "Write", "Document"          |
| Researcher  | Information gathering, analysis     | "Read", "Search"                    |

---

## Skill Template Quick Reference

### Skill Complexity Decision Matrix
| Complexity | Token Budget | When to Use | Template |
|------------|--------------|-------------|----------|
| **Simple** | 500-2K | Single-step, deterministic workflows | `templates/skills/minimal-skill-template.md` |
| **Moderate** | 2K-8K | Multi-step with decision points | `templates/skills/standard-skill-template.md` |
| **Complex** | 8K-20K | Multi-phase with feedback loops | `templates/skills/comprehensive-skill-template.md` |

### Minimal Skill Template Structure
```markdown
---
name: [skill-name]
version: 1.0.0
author: [your-team]
created: [YYYY-MM-DD]
status: active
complexity: simple
---

# [Skill Name]

## Description
[One sentence: Action verb + object + specific outcome]

## When to Use This Skill
- [Explicit trigger 1]
- [Explicit trigger 2]
- [Explicit trigger 3]

## When NOT to Use This Skill
- [Alternative skill/command to use instead]

## Prerequisites
- [Required context/data/permission 1]
- [Required context/data/permission 2]

## Workflow
### Step 1: [Action Name]
[Clear, imperative instruction]

### Step 2: [Action Name]
[Clear, imperative instruction]

## Examples
### Example 1: [Happy Path]
**Input:** [Concrete sample]
**Expected Output:** [Concrete sample]

## Quality Standards
- [Acceptance criterion 1]
- [Acceptance criterion 2]

## Common Pitfalls
- ❌ [What to avoid]
- ✅ [What to do instead]
```

### Meta-Skills Quick Reference
| Skill | Purpose | Use When |
|-------|---------|----------|
| **skill-creator** | Creates new skills following best practices | Building new workflow automation |
| **agent-skill-bridge** | Integrates skills with agents | Coordinating agent-skill handoffs |
| **skill-orchestrator** | Coordinates multiple skills | Complex multi-skill workflows |

---

## Sample Multi-Agent Plan (Markdown Table)
| Task             | Agent      | Status      |
|------------------|------------|-------------|
| Architect spec   | Architect  | Complete    |
| Build feature    | Builder    | In Progress |
| Write tests      | Validator  | Not Started |
| Document feature | Scribe     | Not Started |

---

## Sample QA Checklist
- [ ] All required arguments and context validated
- [ ] Allowed-tools explicitly scoped
- [ ] Documentation and comments up to date
- [ ] Tests included and passing
- [ ] Error handling implemented
- [ ] Change log entry created

---

## Production-Grade Command Templates

### Minimal Command Template

Use for simple, single-step workflows with clear inputs/outputs:

```markdown
---
description: "Brief one-line description of what this command does"
allowed-tools: ["Read", "Bash(git:*)"]
author: "Your Name"
version: "1.0.0"
---

# Command Name

## Purpose
Single sentence describing the command's goal.

## Usage
`/command-name [arg1] [arg2]`

## Steps
1. !git status --porcelain
2. Provide summary of changes

## Expected Output
Description of what the command returns or displays.
```

### Standard Command Template

Use for moderate complexity workflows with multiple steps and conditional logic:

```markdown
---
description: "Comprehensive description of command purpose and workflow"
allowed-tools: ["Bash(git:*,npm:*)", "Edit", "Read", "Test"]
author: "Your Name / Team Name"
version: "1.0.0"
---

# Command Name

## Purpose
Detailed explanation of what this command does and when to use it.

## Usage
`/command-name [required-arg] [optional-arg]`

**Arguments:**
- `required-arg`: Description of required parameter
- `optional-arg`: Description of optional parameter (default: value)

## Prerequisites
- List any required context, tools, or environment setup
- Example: "Must be run from project root directory"
- Example: "Requires npm packages installed"

## Workflow Steps
1. **Validate environment**: !git branch --show-current
2. **Run quality checks**:
   - !npm run lint
   - !npm test
3. **Conditional logic**: If tests fail, exit with error message
4. **Execute main operation**: Based on arguments provided
5. **Provide summary**: List of files changed, tests passed, next steps

## Error Handling
- **If git not in clean state**: Prompt user to commit or stash changes
- **If tests fail**: Display failure details, suggest fixes
- **If invalid arguments**: Show usage help

## Examples
### Example 1: Happy Path
```bash
/command-name feature-branch
```
Expected: Creates feature branch, runs tests, provides status

### Example 2: With Optional Arguments
```bash
/command-name feature-branch --skip-tests
```
Expected: Creates feature branch, skips test execution

## Version History
- 1.0.0 (2026-01-23): Initial release
```

### Orchestration Command Template

Use for complex multi-agent or multi-step workflows requiring coordination:

```markdown
---
description: "Orchestrates multi-phase workflow with quality gates and validation"
allowed-tools: ["Bash(git:*,npm:*,gh:*)", "Edit", "Write", "Read", "Test", "Task"]
author: "Platform Team"
version: "1.0.0"
---

# Multi-Agent Orchestration Command

## Purpose
Coordinates complex workflow involving multiple agents, phases, and quality gates.

## Usage
`/orchestrate-feature [feature-name] [--parallel]`

**Flags:**
- `--parallel`: Execute independent tasks concurrently (default: sequential)

## Architecture Overview
```
Lead Orchestrator (Opus 4)
├── Phase 1: Planning (Architect agent)
├── Phase 2: Implementation (Builder agents x3, parallel if --parallel flag)
├── Phase 3: Validation (Validator agent)
└── Phase 4: Integration (Scribe agent)
```

## Phase 1: Planning
1. **Spawn Architect Agent**: Use Task tool with architect-agent.md
2. **Generate Technical Spec**:
   - Architecture decisions documented in `.claude/features/{feature-name}/architecture.md`
   - API contracts defined in `.claude/features/{feature-name}/api-spec.yaml`
3. **Quality Gate**: Architect agent must exit successfully before proceeding

## Phase 2: Implementation
1. **Task Decomposition**: Break feature into 3-5 independent modules
2. **Spawn Builder Agents**:
   - If `--parallel` flag: Launch 3 agents in separate worktrees
   - If sequential: Execute tasks one at a time
3. **Tool Invocations**:
   ```bash
   git worktree add ../agent-1 -b feature/{feature-name}-module-1
   git worktree add ../agent-2 -b feature/{feature-name}-module-2
   git worktree add ../agent-3 -b feature/{feature-name}-module-3
   ```
4. **Quality Gate**: All builder agents must pass TDD workflow (tests written first, all passing)

## Phase 3: Validation
1. **Spawn Validator Agent**: Use Task tool with validator-agent.md
2. **Run Comprehensive Tests**:
   - Unit tests: !npm test
   - Integration tests: !npm run test:integration
   - E2E tests: !npm run test:e2e
3. **Security Scan**: !npm audit --audit-level=moderate
4. **Quality Gate**: Zero critical vulnerabilities, 90%+ test coverage

## Phase 4: Integration
1. **Merge Worktrees**: Integrate all module branches into feature branch
2. **Conflict Resolution**: If conflicts detected, spawn conflict-resolution agent
3. **Generate Documentation**: Spawn Scribe agent to create:
   - API documentation
   - User guide updates
   - Changelog entry
4. **Create Pull Request**:
   ```bash
   gh pr create --title "{feature-name}" --body "$(cat .claude/features/{feature-name}/summary.md)"
   ```

## Error Handling
- **Phase 1 Failure**: Provide architecture feedback, iterate on planning
- **Phase 2 Failure**: Identify failing module, spawn debug agent for targeted fix
- **Phase 3 Failure**: Block PR creation, provide test failure details to builder agents
- **Phase 4 Failure**: Manual conflict resolution required, pause workflow

## Observability
- **Metrics Tracked**:
  - Total execution time per phase
  - Token usage per agent
  - Quality gate pass/fail rates
- **Logging**: All agent outputs logged to `.claude/features/{feature-name}/execution.log`

## Success Criteria
- [ ] All 4 phases completed successfully
- [ ] All quality gates passed
- [ ] PR created with comprehensive description
- [ ] Documentation updated
- [ ] Zero security vulnerabilities

## Version History
- 1.0.0 (2026-01-23): Initial orchestration command
```

---

## Production-Grade Hook Templates

### PreToolUse Security Hook Template

Use to block dangerous operations before execution:

```bash
#!/bin/bash
# .claude/hooks/pretooluse_security.sh

# Read JSON event from stdin
INPUT=$(cat)

# Extract tool name and command
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.path // empty')

# Security Check 1: Block dangerous Bash commands
if [[ "$TOOL_NAME" == "Bash" ]]; then
  DENY_PATTERNS="(rm -rf /|sudo|chmod 777|curl.*\||wget.*\||nc -l|dd if=)"

  if echo "$COMMAND" | grep -E "$DENY_PATTERNS" > /dev/null; then
    echo "❌ Security Policy Violation: Dangerous command blocked" >&2
    echo "Command: $COMMAND" >&2
    echo "Pattern matched: High-risk operation" >&2
    echo '{"decision": "deny", "reason": "Command matches high-risk pattern"}' # JSON to stdout
    exit 2  # Blocking error
  fi

  # Allow list: Safe read-only commands (auto-approve, skip user prompt)
  ALLOW_PATTERNS="^(ls|cat|grep|find|git status|npm test)( |$)"

  if echo "$COMMAND" | grep -E "$ALLOW_PATTERNS" > /dev/null; then
    echo '{"decision": "allow"}' # Auto-approve
    exit 0
  fi
fi

# Security Check 2: Block access to sensitive files
if [[ "$TOOL_NAME" =~ ^(Read|Edit|Write)$ ]]; then
  SENSITIVE_PATTERNS="(\.env|\.aws/credentials|\.ssh/id_rsa|secrets\.yaml|\.pem$)"

  if echo "$FILE_PATH" | grep -E "$SENSITIVE_PATTERNS" > /dev/null; then
    echo "❌ Access Denied: Sensitive file access blocked" >&2
    echo "File: $FILE_PATH" >&2
    echo '{"decision": "deny", "reason": "File matches sensitive pattern"}' # JSON to stdout
    exit 2  # Blocking error
  fi
fi

# Security Check 3: Path traversal prevention
if [[ "$FILE_PATH" =~ \.\. ]]; then
  echo "❌ Path Traversal Detected: Relative paths not allowed" >&2
  echo '{"decision": "deny", "reason": "Path contains .. (traversal attempt)"}' # JSON to stdout
  exit 2  # Blocking error
fi

# All checks passed
exit 0
```

**Configuration** (`.claude/settings.json`):
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/pretooluse_security.sh",
        "timeout": 5
      }]
    }, {
      "matcher": "Read|Edit|Write",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/pretooluse_security.sh",
        "timeout": 3
      }]
    }]
  }
}
```

### PostToolUse Quality Hook Template

Use to enforce code quality after file modifications:

```bash
#!/bin/bash
# .claude/hooks/posttooluse_quality.sh

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.path // empty')

# Only process Edit/Write operations on source files
if [[ "$TOOL_NAME" =~ ^(Edit|Write)$ ]]; then

  # Quality Check 1: Auto-format code
  if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    echo "Running ESLint auto-fix on $FILE_PATH..." >&2
    npx eslint --fix "$FILE_PATH" 2>&1

    # Quality Check 2: Type checking (TypeScript)
    if [[ "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
      echo "Running TypeScript type check..." >&2
      npx tsc --noEmit "$FILE_PATH" 2>&1

      if [[ $? -ne 0 ]]; then
        echo "❌ TypeScript Errors Detected" >&2
        echo "Fix type errors before continuing." >&2
        echo '{"decision": "block", "reason": "TypeScript type errors must be resolved"}' # JSON to stdout
        exit 2  # Blocking error
      fi
    fi
  fi

  # Quality Check 3: Python formatting and linting
  if [[ "$FILE_PATH" =~ \.py$ ]]; then
    echo "Running black formatter on $FILE_PATH..." >&2
    black "$FILE_PATH" 2>&1

    echo "Running flake8 linter..." >&2
    flake8 "$FILE_PATH" 2>&1

    if [[ $? -ne 0 ]]; then
      echo "❌ Python Linting Errors Detected" >&2
      echo '{"decision": "block", "reason": "Fix flake8 linting errors"}' # JSON to stdout
      exit 2  # Blocking error
    fi
  fi

  # Quality Check 4: Run unit tests for edited module
  if [[ "$FILE_PATH" =~ ^src/.* ]]; then
    # Extract module name (e.g., src/auth/login.ts → auth/login)
    MODULE=$(echo "$FILE_PATH" | sed 's|^src/||; s|\.[^.]*$||')
    TEST_FILE="tests/${MODULE}.test.*"

    if ls $TEST_FILE 1> /dev/null 2>&1; then
      echo "Running tests for $MODULE..." >&2
      npm test -- "$TEST_FILE" 2>&1

      if [[ $? -ne 0 ]]; then
        echo "⚠️  Tests Failed for $MODULE" >&2
        echo '{"decision": "block", "reason": "Fix failing tests before continuing"}' # JSON to stdout
        exit 2  # Blocking error
      fi
    else
      echo "⚠️  No tests found for $MODULE (expected: $TEST_FILE)" >&2
      # Non-blocking warning (exit 1 instead of 2)
      exit 1
    fi
  fi
fi

# All quality checks passed
exit 0
```

**Configuration**:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit:*.ts|Edit:*.tsx|Edit:*.js|Edit:*.jsx|Edit:*.py|Write:*.ts|Write:*.tsx|Write:*.js|Write:*.jsx|Write:*.py",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/posttooluse_quality.sh",
        "timeout": 30
      }]
    }]
  }
}
```

### UserPromptSubmit Hook Template

Use for block-at-submit pattern (validate before allowing new prompts):

```python
#!/usr/bin/env python3
# .claude/hooks/userpromptsubmit_validator.py

import sys
import json
import subprocess

# Read event from stdin
event = json.load(sys.stdin)
session_id = event.get("session_id")
cwd = event.get("cwd")

# Validation Check 1: Uncommitted lint violations
print("Checking for uncommitted lint violations...", file=sys.stderr)

lint_status = subprocess.run(
    ["git", "diff", "--name-only"],
    capture_output=True,
    text=True,
    cwd=cwd
)

changed_files = lint_status.stdout.strip().split('\n')
has_source_changes = any(
    f.endswith(('.ts', '.tsx', '.js', '.jsx', '.py'))
    for f in changed_files
    if f
)

if has_source_changes:
    lint_result = subprocess.run(
        ["npm", "run", "lint"],
        capture_output=True,
        cwd=cwd
    )

    if lint_result.returncode != 0:
        print(json.dumps({
            "continue": False,
            "stopReason": "❌ Uncommitted lint violations detected.\n\nRun `npm run lint:fix` to auto-fix, then submit your prompt again."
        }))
        sys.exit(0)

# Validation Check 2: Failing tests in working directory
print("Checking for failing tests...", file=sys.stderr)

test_result = subprocess.run(
    ["npm", "test", "--", "--passWithNoTests"],
    capture_output=True,
    cwd=cwd
)

if test_result.returncode != 0:
    print(json.dumps({
        "continue": False,
        "stopReason": "❌ Tests are failing in your working directory.\n\nFix failing tests before submitting new prompts."
    }))
    sys.exit(0)

# Validation Check 3: Untracked sensitive files
print("Checking for untracked sensitive files...", file=sys.stderr)

untracked_result = subprocess.run(
    ["git", "ls-files", "--others", "--exclude-standard"],
    capture_output=True,
    text=True,
    cwd=cwd
)

untracked_files = untracked_result.stdout.strip().split('\n')
sensitive_patterns = ['.env', 'secrets.yaml', '.pem', 'credentials']

sensitive_untracked = [
    f for f in untracked_files
    if any(pattern in f for pattern in sensitive_patterns)
]

if sensitive_untracked:
    print(json.dumps({
        "continue": False,
        "stopReason": f"❌ Untracked sensitive files detected:\n{chr(10).join(sensitive_untracked)}\n\nAdd to .gitignore or delete before continuing."
    }))
    sys.exit(0)

# All validations passed
print("All pre-prompt validations passed.", file=sys.stderr)
sys.exit(0)
```

**Configuration**:
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/userpromptsubmit_validator.py",
        "timeout": 15
      }]
    }]
  }
}
```

### Stop Hook Template

Use for session summarization and CI/CD triggers:

```python
#!/usr/bin/env python3
# .claude/hooks/stop_session_summary.py

import sys
import json
import subprocess
from datetime import datetime

# Read event from stdin
event = json.load(sys.stdin)
session_id = event.get("session_id")
transcript_path = event.get("transcript_path")
cwd = event.get("cwd")

print(f"Generating session summary for {session_id}...", file=sys.stderr)

# Extract session metrics from transcript
# (In production, parse transcript_path JSONL file for detailed metrics)

# Summary Metric 1: Files changed
git_diff = subprocess.run(
    ["git", "diff", "--name-status", "HEAD"],
    capture_output=True,
    text=True,
    cwd=cwd
)

files_changed = len([line for line in git_diff.stdout.strip().split('\n') if line])

# Summary Metric 2: Tests status
test_result = subprocess.run(
    ["npm", "test", "--", "--passWithNoTests"],
    capture_output=True,
    text=True,
    cwd=cwd
)

tests_passing = test_result.returncode == 0

# Summary Metric 3: Current branch
branch_result = subprocess.run(
    ["git", "branch", "--show-current"],
    capture_output=True,
    text=True,
    cwd=cwd
)

current_branch = branch_result.stdout.strip()

# Generate summary
summary = {
    "session_id": session_id,
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "duration_minutes": "N/A",  # Parse from transcript in production
    "files_changed": files_changed,
    "current_branch": current_branch,
    "tests_passing": tests_passing,
    "next_steps": []
}

# Determine next steps based on state
if not tests_passing:
    summary["next_steps"].append("❌ Fix failing tests before creating PR")
else:
    summary["next_steps"].append("✅ Tests passing")

if files_changed > 0 and current_branch != "main":
    summary["next_steps"].append("📝 Ready to commit and create PR")
elif current_branch == "main":
    summary["next_steps"].append("⚠️  Working on main branch - consider creating feature branch")

# Save summary to file
summary_path = f".claude/sessions/{session_id}_summary.json"
with open(summary_path, 'w') as f:
    json.dump(summary, f, indent=2)

# Print summary to stderr (visible to user)
print("\n" + "="*50, file=sys.stderr)
print("SESSION SUMMARY", file=sys.stderr)
print("="*50, file=sys.stderr)
print(f"Files Changed: {files_changed}", file=sys.stderr)
print(f"Branch: {current_branch}", file=sys.stderr)
print(f"Tests: {'✅ Passing' if tests_passing else '❌ Failing'}", file=sys.stderr)
print("\nNext Steps:", file=sys.stderr)
for step in summary["next_steps"]:
    print(f"  {step}", file=sys.stderr)
print("="*50 + "\n", file=sys.stderr)

# Optional: Trigger CI/CD if criteria met
if tests_passing and current_branch != "main" and files_changed > 0:
    print("All quality gates passed. Ready for PR creation.", file=sys.stderr)
    # Could trigger automated PR creation here if desired

sys.exit(0)
```

**Configuration**:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/stop_session_summary.py",
        "timeout": 10
      }]
    }]
  }
}
```

---

## Production-Grade Implementation Checklists

### Command Implementation Checklist

Use this checklist when creating production-ready commands:

| # | Phase | Task | Status |
|---|-------|------|--------|
| 1 | **Planning** | Define clear command purpose and success criteria | ⬜ |
| 2 | **Planning** | Identify all required and optional arguments | ⬜ |
| 3 | **Planning** | Determine minimum allowed-tools permissions needed | ⬜ |
| 4 | **Development** | Write frontmatter with description, allowed-tools, author, version | ⬜ |
| 5 | **Development** | Implement workflow steps with clear numbered sequence | ⬜ |
| 6 | **Development** | Add error handling for common failure modes | ⬜ |
| 7 | **Development** | Include validation logic for arguments and prerequisites | ⬜ |
| 8 | **Development** | Provide informative output/summary at completion | ⬜ |
| 9 | **Documentation** | Document all arguments with types and defaults | ⬜ |
| 10 | **Documentation** | Include 2-3 concrete usage examples | ⬜ |
| 11 | **Documentation** | List prerequisites (environment, tools, permissions) | ⬜ |
| 12 | **Testing** | Test happy path with valid arguments | ⬜ |
| 13 | **Testing** | Test error handling with invalid arguments | ⬜ |
| 14 | **Testing** | Verify allowed-tools restrictions work correctly | ⬜ |
| 15 | **Security** | Review for potential command injection vulnerabilities | ⬜ |
| 16 | **Security** | Ensure no secrets hardcoded in command file | ⬜ |
| 17 | **Integration** | Add command to project documentation and README | ⬜ |
| 18 | **Deployment** | Increment version following semantic versioning rules | ⬜ |

### Hook Deployment Checklist

Use this checklist when deploying production hooks:

| # | Phase | Task | Status |
|---|-------|------|--------|
| 1 | **Planning** | Define hook event type (PreToolUse, PostToolUse, UserPromptSubmit, Stop) | ⬜ |
| 2 | **Planning** | Identify tool matchers (Bash, Edit:*.ts, Write, etc.) | ⬜ |
| 3 | **Development** | Implement hook script with proper stdin JSON parsing | ⬜ |
| 4 | **Development** | Add exit code handling (0=success, 2=blocking, other=warning) | ⬜ |
| 5 | **Development** | Implement JSON stdout for advanced control (decision, reason, permissionDecision) | ⬜ |
| 6 | **Development** | Add actionable error messages to stderr | ⬜ |
| 7 | **Testing** | Test hook in isolation with sample JSON inputs | ⬜ |
| 8 | **Testing** | Verify hook blocks correctly (exit 2 prevents workflow continuation) | ⬜ |
| 9 | **Testing** | Measure hook execution time (target: <1s, max: 30s timeout) | ⬜ |
| 10 | **Integration** | Add hook configuration to `.claude/settings.json` with timeout | ⬜ |
| 11 | **Integration** | Test hook with real Claude Code workflow | ⬜ |
| 12 | **Documentation** | Document hook purpose, triggers, error messages in hook catalog | ⬜ |
| 13 | **Deployment** | Stage to dev/staging for 1 week before production rollout | ⬜ |

### Production Readiness Checklist

Use this checklist before deploying to production:

| # | Category | Check | Status |
|---|----------|-------|--------|
| 1 | **Documentation** | All commands have complete frontmatter (description, allowed-tools, author, version) | ⬜ |
| 2 | **Documentation** | README.md updated with command usage examples | ⬜ |
| 3 | **Documentation** | CHANGELOG.md includes all changes since last release | ⬜ |
| 4 | **Testing** | All commands tested on fresh repository clone | ⬜ |
| 5 | **Testing** | Error handling verified for common failure scenarios | ⬜ |
| 6 | **Testing** | Hook configurations tested with blocking/non-blocking scenarios | ⬜ |
| 7 | **Security** | allowed-tools scoped to minimum necessary permissions | ⬜ |
| 8 | **Security** | No secrets or credentials in command files or hooks | ⬜ |
| 9 | **Security** | Security review completed for all Bash commands | ⬜ |
| 10 | **Observability** | Hooks configured for audit logging (if required by compliance) | ⬜ |
| 11 | **Observability** | OpenTelemetry instrumentation added (if using observability stack) | ⬜ |
| 12 | **Performance** | Hook execution times measured (all <3s p95) | ⬜ |
| 13 | **Compliance** | SOC 2 / HIPAA / GDPR requirements met (if applicable) | ⬜ |
| 14 | **Deployment** | Staged rollout plan defined (pilot → 25% → 100%) | ⬜ |
| 15 | **Deployment** | Rollback procedure documented and tested | ⬜ |
| 16 | **Post-Deployment** | Monitoring dashboard configured for key metrics | ⬜ |

---

## Production-Grade Skills Checklists

### Skill Creation Checklist

Use this checklist when creating new skills following evaluation-driven development methodology:

| # | Phase | Task | Status |
|---|-------|------|--------|
| 1 | **Scoping** | Define clear success criteria (what does "done" look like?) | ⬜ |
| 2 | **Scoping** | Identify 2-5 concrete examples (happy path + edge cases) | ⬜ |
| 3 | **Scoping** | Determine token budget tier (Simple: <2K, Moderate: 2K-8K, Complex: 8K-20K) | ⬜ |
| 4 | **Evaluation** | **Create evaluation.json BEFORE writing SKILL.md** | ⬜ |
| 5 | **Evaluation** | Define multi-dimensional rubric (factual accuracy, completeness, citations, tool efficiency) | ⬜ |
| 6 | **Evaluation** | Set minimum score thresholds per criterion | ⬜ |
| 7 | **Development** | Write SKILL.md following standard template | ⬜ |
| 8 | **Development** | Keep description under 1024 characters (single-line YAML) | ⬜ |
| 9 | **Development** | Include explicit "When to Use" and "When NOT to Use" sections | ⬜ |
| 10 | **Development** | Implement progressive disclosure (SKILL.md <500 lines, use separate reference docs) | ⬜ |
| 11 | **Testing** | Test with Creator Claude (write/execute skill) | ⬜ |
| 12 | **Testing** | Test with Tester Claude (follow only SKILL.md instructions) | ⬜ |
| 13 | **Testing** | Run evaluation suite, verify all rubric thresholds met | ⬜ |
| 14 | **Testing** | Test context degradation (25%, 50%, 75% context utilization) | ⬜ |
| 15 | **Documentation** | Create troubleshooting.md documenting failed approaches | ⬜ |
| 16 | **Deployment** | Add activation logging to track real-world invocation rates | ⬜ |
| 17 | **Deployment** | Deploy to staging, monitor for 1 week before production | ⬜ |

### Activation Reliability Checklist

Ensure skills activate reliably when needed (target: >80% activation rate):

| # | Area | Check | Status |
|---|------|-------|--------|
| 1 | **Description** | Description is single-line YAML (no multiline breaks) | ⬜ |
| 2 | **Description** | Description under 1024 characters (excess truncated silently) | ⬜ |
| 3 | **Description** | Includes BOTH what skill does AND specific trigger keywords | ⬜ |
| 4 | **Triggers** | "When to Use" section has 3-5 explicit, concrete triggers | ⬜ |
| 5 | **Triggers** | Trigger phrases use action verbs + specific nouns (not vague terms) | ⬜ |
| 6 | **Triggers** | No overlap with other skills in system (checked against skill registry) | ⬜ |
| 7 | **Scope** | Total active skills count ≤32 (detection ceiling for reliable selection) | ⬜ |
| 8 | **Context** | SKILL.md file <500 lines (use references for details) | ⬜ |
| 9 | **Hooks** | CLAUDE.md has forced evaluation hook (if mission-critical skill) | ⬜ |
| 10 | **Testing** | Activation logging enabled to measure real-world invocation rate | ⬜ |
| 11 | **Validation** | Tested activation rate ≥75% across 10+ realistic user queries | ⬜ |

### Maintenance Checklist

Regular maintenance cadence to keep skills effective and current:

| Frequency | Task | Owner | Status |
|-----------|------|-------|--------|
| **Monthly** | Review activation logs, identify skills with <50% invocation rate | Tech Lead | ⬜ |
| **Monthly** | Analyze error logs, fix bugs causing failures | Engineer | ⬜ |
| **Monthly** | Review user feedback, prioritize top 3 improvement requests | Product | ⬜ |
| **Quarterly** | Update skill dependencies (APIs, libraries, MCP servers) | DevOps | ⬜ |
| **Quarterly** | Refresh examples with recent real-world scenarios | Engineer | ⬜ |
| **Quarterly** | Review and update evaluations to match evolved requirements | QA | ⬜ |
| **Quarterly** | Audit skill performance metrics (time saved, quality scores) | Product | ⬜ |
| **Quarterly** | Archive or deprecate skills with <30-day usage gap | Tech Lead | ⬜ |
| **Annual** | Major version update considering ecosystem changes | Architect | ⬜ |
| **Annual** | Consolidate overlapping skills to reduce total count | Architect | ⬜ |
| **Annual** | Review entire skill library for architectural consistency | Architect | ⬜ |
| **Continuous** | Update troubleshooting.md when failed approaches discovered | Engineer | ⬜ |
| **Continuous** | Increment version on any SKILL.md changes | Engineer | ⬜ |

### Context Management Checklist

Optimize context window utilization for multi-skill environments:

| # | Strategy | Implementation | Status |
|---|----------|----------------|--------|
| 1 | **Progressive Disclosure** | SKILL.md metadata <100 tokens per skill in system prompt | ⬜ |
| 2 | **Progressive Disclosure** | SKILL.md body <500 lines, reference docs for deep content | ⬜ |
| 3 | **Progressive Disclosure** | Bundled resources loaded only when skill activated | ⬜ |
| 4 | **CLAUDE.md** | Persistent context defined in CLAUDE.md (project standards, conventions) | ⬜ |
| 5 | **CLAUDE.md** | CLAUDE.md <10K tokens to avoid overwhelming initial load | ⬜ |
| 6 | **Subagents** | Complex workflows spawn subagents with isolated context | ⬜ |
| 7 | **Compaction** | Context compaction triggered at 75% utilization threshold | ⬜ |
| 8 | **Monitoring** | Instrumentation tracks context size per skill activation | ⬜ |
| 9 | **Limits** | Total concurrent active skills ≤32 (token budget constraint) | ⬜ |

### Enterprise Deployment Checklist

Phased rollout strategy for production skill deployment:

#### Phase 1: Pilot (Week 1-2)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Select 2-3 early adopter engineers for pilot | Tech Lead | ⬜ |
| 2 | Deploy skill to pilot group only | DevOps | ⬜ |
| 3 | Provide 1-hour training session on skill usage | Product | ⬜ |
| 4 | Enable detailed activation logging and error tracking | DevOps | ⬜ |
| 5 | Gather daily feedback from pilot users | Product | ⬜ |
| 6 | Fix critical bugs within 24 hours | Engineer | ⬜ |
| 7 | Measure key metrics: activation rate, time saved, quality scores | Product | ⬜ |

#### Phase 2: Staged Rollout (Week 3-4)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Expand to 25% of team if pilot metrics meet thresholds | Tech Lead | ⬜ |
| 2 | Create internal documentation and FAQ | Scribe | ⬜ |
| 3 | Set up support channel (Slack/Teams) for questions | Product | ⬜ |
| 4 | Monitor error rates, rollback if >10% failure rate | DevOps | ⬜ |
| 5 | Conduct weekly review meeting with expanded user group | Tech Lead | ⬜ |
| 6 | Update skill based on feedback (minor version bump) | Engineer | ⬜ |

#### Phase 3: Full Deployment (Week 5-6)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Deploy to entire organization if stage 2 successful | DevOps | ⬜ |
| 2 | Announce via all-hands meeting and email | Product | ⬜ |
| 3 | Schedule quarterly review for skill effectiveness | Tech Lead | ⬜ |
| 4 | Transition to standard maintenance cadence (see Maintenance Checklist) | Tech Lead | ⬜ |
| 5 | Document lessons learned and update deployment playbook | Scribe | ⬜ |
| 6 | Celebrate success and recognize pilot contributors | Tech Lead | ⬜ |

---

## Memory Summary Example
```
Project: Analytics Dashboard v2
Priorities: Finish data pipeline, review UI
Preferred workflow: TDD and code review
Recurring blockers: Flaky tests, unclear API docs
Team roles: Anna (architect), Quang (builder), Tara (QA)
```

---
Use this document as a starting point for all new Claude command, agent, and skill workflows.

---

**Document Version**: 2.0.0
**Last Updated**: January 23, 2026
**Maintained By**: Claude Command and Control Project
**Review Cycle**: Quarterly