# Hooks for Quality Assurance and Policy Enforcement

**Full documentation:** `docs/best-practices/05-Testing-and-Quality-Assurance.md#production-grade-hooks-for-quality-assurance`

## Overview

Claude Code hooks provide deterministic, event-driven policy enforcement for agentic workflows.

## Hook Lifecycle Events

**11 distinct events:**
- **Operational**: PreToolUse, PostToolUse, PermissionRequest
- **Interaction**: UserPromptSubmit, Notification, Stop
- **Specialized**: SubagentStop, SessionStart, SessionEnd, PreCompact

## Key Benefits

- **Mandatory Execution**: If configured, hooks WILL run
- **Blocking Semantics**: Exit code 2 halts workflow
- **Structured Control**: JSON output enables sophisticated logic
- **Production Proven**: 40% → 85% refactor success rate, 20% → 84% TDD activation

## Communication Protocol

**Input (stdin)**: JSON event context
**Output**: Exit codes + JSON
- **Exit 0**: Success
- **Exit 2**: Blocking error (stderr fed to Claude)
- **Exit other**: Non-blocking warning

## Quick Example

```bash
#!/bin/bash
# Block dangerous commands
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -E "(rm -rf /|sudo)" > /dev/null; then
  echo "❌ Dangerous command blocked" >&2
  exit 2
fi

exit 0
```

## Design Principles

1. **Determinism Over Guidance**: Use hooks for must-enforce policies
2. **Block-at-Submit**: Prefer UserPromptSubmit for complex workflows
3. **Composability**: Each hook enforces one policy
4. **Observable**: Log all executions
5. **Minimize Overhead**: <1s execution time

## Production Use Cases

- **Enterprise Monorepo**: 40% → 85% refactor success rate
- **TDD Enforcement**: 20% → 84% TDD activation rate
- **Policy-as-Code (OPA)**: 90% permission prompt reduction
