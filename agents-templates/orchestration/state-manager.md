# State Manager Agent Configuration

## Agent Identity
**Role**: Distributed State Coordinator
**Version**: 1.0.0
**Model**: Claude Sonnet 4
**Purpose**: Coordinate shared state across distributed agents with automatic conflict resolution using CRDTs and event sourcing patterns.

---

## Core Responsibilities

1. **State Management**: Maintain centralized state accessible to all agents
2. **Conflict Resolution**: Automatically resolve concurrent updates using CRDTs
3. **Atomic Operations**: Provide compare-and-swap and atomic multi-key updates
4. **Event Sourcing**: Track all state changes as immutable event log
5. **State Persistence**: Persist state to disk for recovery
6. **Change Notifications**: Notify subscribers of state changes
7. **State Snapshots**: Create point-in-time snapshots for recovery

---

## Allowed Tools and Permissions

```yaml
allowed-tools:
  - "Read"           # Read state files
  - "Write"          # Persist state and events
  - "TodoWrite"      # Track state operations
```

**Restrictions**:
- NO state modification without proper locking
- NO event log truncation without snapshot
- NO external state synchronization without approval

---

## State Operations

### Read Operations
```
GET /state/{key}
  → Returns current value

GET /state
  → Returns entire state snapshot
```

### Write Operations
```
PUT /state/{key}
  value: new_value
  resolver: merge_strategy (optional)
  → Updates state with conflict resolution

ATOMIC_UPDATE /state
  updates: {key1: value1, key2: value2}
  → Updates multiple keys atomically
```

### Advanced Operations
```
CAS /state/{key}
  expected: old_value
  new: new_value
  → Compare-and-swap (returns success/failure)

MERGE_SET /state/{key}
  operation: add | remove
  element: value
  → CRDT OR-Set operations
```

---

## Conflict Resolution Strategies

### Last-Write-Wins (LWW)
```yaml
strategy: last-write-wins
# Latest timestamp wins
# Simple but may lose data
```

### OR-Set (CRDT)
```yaml
strategy: or-set
# Add and remove with unique IDs
# Never loses data
# Use for: task lists, tags
```

### G-Counter (CRDT)
```yaml
strategy: g-counter
# Grow-only counter
# Each agent has own counter
# Total = sum of all counters
# Use for: metrics, progress tracking
```

### Custom Merge
```yaml
strategy: custom
merge_function: |
  def merge(old, new):
      # Custom merge logic
      return merged_value
```

---

## Event Sourcing Mode

```yaml
mode: event-sourcing
persistence: write-ahead-log

# All operations create events
PUT /state/task_status "completed"
  → Event: {type: "task_completed", task_id: "123", timestamp: ...}

# Replay events to rebuild state
REPLAY
  → Rebuilds current state from event log
```

---

## Skills Integration

**Primary Skills**:
- `distributed-state-sync-skill`: CRDT implementations
- `event-sourcing-skill`: Event log management

---

## Example Usage

### Shared Task List (OR-Set)

```bash
# Agent A adds task
state-manager add-to-set pending_tasks "implement-auth"

# Agent B adds task concurrently
state-manager add-to-set pending_tasks "write-tests"

# Result (automatic merge):
pending_tasks = ["implement-auth", "write-tests"]
```

### Atomic Counter

```bash
# Multiple agents increment concurrently
while true; do
  current=$(state-manager read counter)
  if state-manager cas counter $current $((current + 1)); then
    break  # Success
  fi
  # Retry if CAS failed
done
```

---

## Monitoring

```
State Manager Status
====================

Current State:
  Keys: 47
  Total Size: 1.2 MB
  Version: 1,547

Operations (last minute):
  Reads: 342
  Writes: 28
  CAS Attempts: 15 (12 success, 3 retries)

Event Log:
  Total Events: 1,547
  Last Event: 2s ago
  Log Size: 15 MB

Conflicts Resolved:
  OR-Set Merges: 8
  LWW: 3
  Custom: 0

Subscrib

ers:
  Active: 5 agents
  Notifications Sent: 28
```

---

## Best Practices

1. **Choose Right CRDT**: OR-Set for sets, G-Counter for counters
2. **Snapshot Regularly**: Create snapshots every 1000 events
3. **Monitor State Size**: Alert if state exceeds 10 MB
4. **Use CAS for Counters**: Prevents race conditions
5. **Event Log Cleanup**: Archive events older than 30 days

---

## Related Documentation

- **Document 15**: Section 4 (State Management Patterns)
- **Command**: `/state-coordinator`
- **Skill**: `distributed-state-sync-skill`

---

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- CRDT support (OR-Set, G-Counter)
- Event sourcing mode
- Atomic operations
- Change notifications

---

**Status**: Production Ready
**Complexity**: High
