---
name: state-coordinator
version: 1.0.0
description: Manage shared state across distributed agents with conflict resolution
category: orchestration
allowed-tools:
  - Read
  - Write
  - Task
  - TodoWrite
tags:
  - orchestration
  - state-management
  - distributed-systems
  - conflict-resolution
  - CRDT
author: Claude Command and Control
created: 2026-01-21
updated: 2026-01-21
---

# State Coordinator Command

## Purpose

Coordinate shared state across multiple agents with automatic conflict resolution. This command:

- Provides centralized state management for distributed agents
- Implements CRDT (Conflict-Free Replicated Data Types) for automatic conflict resolution
- Supports atomic operations and compare-and-swap
- Persists state for recovery
- Tracks state versions and changes

**Use when**: Multiple agents need to share state, concurrent updates are expected, or you need strong consistency.

**Don't use when**: No shared state needed, single agent workflow, or agents can work completely independently.

## Usage

```bash
/state-coordinator start [--state-file=FILE] [--mode=MODE] [--persistence=LEVEL]
```

### Arguments

- `--state-file` (optional): Initial state JSON file (default: empty state)
- `--mode` (optional): Consistency mode
  - `strong`: Serializable consistency (default)
  - `eventual`: Eventual consistency (CRDT)
  - `causal`: Causal consistency
- `--persistence` (optional): Persistence level
  - `memory`: No persistence (default)
  - `disk`: Write-ahead log
  - `distributed`: Replicated storage

## State File Format

```json
{
  "workflow_status": "in_progress",
  "completed_tasks": [],
  "pending_tasks": [
    {"id": "task-1", "status": "pending"},
    {"id": "task-2", "status": "pending"}
  ],
  "agent_assignments": {
    "agent-1": ["task-1"],
    "agent-2": ["task-2"]
  },
  "shared_results": {}
}
```

## Operations

### Read State

```bash
# Agents read state
state-coordinator read workflow_status
# → "in_progress"

state-coordinator read pending_tasks
# → [{"id": "task-1", ...}, ...]
```

### Write State

```bash
# Simple write
state-coordinator write workflow_status "completed"

# Write with conflict resolution
state-coordinator write pending_tasks '[...]' --resolver=merge_lists

# Atomic update multiple keys
state-coordinator atomic-update '{"key1": "value1", "key2": "value2"}'
```

### Compare-and-Swap

```bash
# Atomic counter increment
current=$(state-coordinator read counter)
state-coordinator cas counter $current $((current + 1))
# → true (if successful, false if value changed)
```

### Subscribe to Changes

```bash
# Agent subscribes to state changes
state-coordinator subscribe workflow_status --callback=on_status_change

# Callback triggered when workflow_status changes
```

## Conflict Resolution Strategies

### Merge Lists (OR-Set CRDT)

```python
# Agent A adds task-1
state-coordinator add-to-set pending_tasks task-1

# Agent B adds task-2 concurrently
state-coordinator add-to-set pending_tasks task-2

# Result (automatic merge):
pending_tasks = [task-1, task-2]  # No conflict!
```

### Last-Write-Wins

```yaml
resolver: last-write-wins
# Latest write wins (based on timestamp)
```

### Custom Resolver

```yaml
resolver: custom
resolver_fn: |
  def resolve(old_value, new_value):
      # Merge two task lists
      return list(set(old_value + new_value))
```

## Event Sourcing Mode

Track all state changes as events:

```bash
state-coordinator start --mode=event-sourcing

# All operations create events
state-coordinator write task_status "completed"
# → Event: {type: "task_completed", task_id: "task-1", timestamp: ...}

# Replay events to reconstruct state
state-coordinator replay
# → Rebuilds current state from event log
```

## Examples

### Example 1: Distributed Task List

```bash
# Initialize shared task list
cat > initial-state.json <<EOF
{
  "pending_tasks": [],
  "completed_tasks": []
}
EOF

/state-coordinator start --state-file=initial-state.json --mode=eventual

# Agent 1 adds task
state-coordinator add-to-set pending_tasks "implement-auth"

# Agent 2 adds task concurrently
state-coordinator add-to-set pending_tasks "write-tests"

# Agent 3 marks task complete
state-coordinator move-between-sets pending_tasks completed_tasks "implement-auth"

# Check state
state-coordinator read pending_tasks
# → ["write-tests"]

state-coordinator read completed_tasks
# → ["implement-auth"]
```

### Example 2: Atomic Counter for Progress Tracking

```bash
# Initialize counter
state-coordinator write tasks_completed 0

# Multiple agents increment concurrently
while true; do
  current=$(state-coordinator read tasks_completed)
  if state-coordinator cas tasks_completed $current $((current + 1)); then
    echo "Incremented to $((current + 1))"
    break
  fi
  # Retry if CAS failed
done
```

### Example 3: State Snapshot for Recovery

```bash
# Take snapshot
state-coordinator snapshot > state-snapshot-$(date +%Y%m%d-%H%M%S).json

# Restore from snapshot
state-coordinator restore state-snapshot-20260121-100000.json
```

## Integration Patterns

### With DAG Executor

```yaml
# DAG executor uses state coordinator for task status
tasks:
  task1:
    command: |
      state-coordinator write task1_status "in_progress"
      /builder implement feature
      state-coordinator write task1_status "completed"
```

### With Dynamic Orchestrator

```yaml
# Pool manager stores agent assignments in shared state
pool:
  state_backend: state-coordinator
  state_key: agent_assignments
```

## Output Files

```
.state-coordinator/
├── state-current.json          # Current state
├── state-history/
│   ├── snapshot-TIMESTAMP.json
│   └── ...
├── event-log.txt              # Event sourcing log
└── metrics/
    ├── state-versions.json
    └── conflict-resolutions.json
```

## Related Documentation

- **Document 15**: Section 4 (State Management Patterns)
- **Skill**: `distributed-state-sync-skill`
- **Agent**: `state-manager.md`

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- CRDT support (OR-Set, G-Counter)
- Event sourcing mode
- Atomic operations
- Snapshot/restore

---

**Status**: Production Ready
**Complexity**: High
**Prerequisites**: Understanding of distributed systems
