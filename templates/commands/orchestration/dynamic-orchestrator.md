---
name: dynamic-orchestrator
version: 1.0.0
description: Dynamically spawn and manage agents based on runtime workload with auto-scaling
category: orchestration
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - TodoWrite
tags:
  - orchestration
  - dynamic-scaling
  - agent-pool
  - auto-scaling
  - resource-management
author: Claude Command and Control
created: 2026-01-21
updated: 2026-01-21
---

# Dynamic Orchestrator Command

## Purpose

Manage agent lifecycle dynamically based on runtime workload. This command:

- Maintains agent pool with pre-warmed agents
- Auto-scales agents based on queue depth and load
- Monitors agent health and replaces unhealthy agents
- Optimizes resource utilization and costs
- Provides predictive scaling using historical patterns

**Use when**: Workload varies significantly, agent initialization is expensive, or you need guaranteed response times.

**Don't use when**: Workload is constant and predictable, or agent initialization is fast (< 1 second).

## Usage

```bash
/dynamic-orchestrator <task-queue-file> [--min-agents=N] [--max-agents=M] [--scaling-strategy=STRATEGY]
```

### Arguments

- `task-queue-file` (required): File containing tasks to execute (one per line or JSON array)
- `--min-agents` (optional): Minimum pool size (default: 2)
- `--max-agents` (optional): Maximum pool size (default: 10)
- `--scaling-strategy` (optional): Scaling strategy
  - `reactive`: Scale based on current queue depth (default)
  - `predictive`: Scale based on historical patterns
  - `manual`: Fixed pool size (no auto-scaling)
- `--agent-model` (optional): Model for spawned agents (default: claude-sonnet-4)
- `--health-check-interval` (optional): Seconds between health checks (default: 60)

## Configuration File

Create `.dynamic-orchestrator.yml` for advanced configuration:

```yaml
# .dynamic-orchestrator.yml
pool:
  min_size: 3
  max_size: 20
  warmup_time: 30
  max_tasks_per_agent: 100  # Recycle after N tasks

scaling:
  strategy: predictive
  scale_up_threshold: 5      # Queue depth to trigger scale-up
  scale_down_threshold: 2    # Idle agents to trigger scale-down
  cooldown_period: 60        # Seconds between scaling actions

health:
  check_interval: 60
  failure_threshold: 3       # Health check failures before replacement
  timeout: 10               # Health check timeout

agent:
  model: claude-sonnet-4
  skills: [builder-skill, validator-skill]  # Pre-load skills
  timeout: 600              # Task timeout per agent

monitoring:
  metrics_enabled: true
  metrics_interval: 30
  log_level: info
```

## Task Queue Format

### Simple Format (one task per line)

```
# tasks.txt
/builder implement authentication system
/validator run unit tests
/researcher analyze performance bottlenecks
/builder implement caching layer
```

### JSON Format (for complex tasks)

```json
[
  {
    "id": "task-1",
    "command": "/builder",
    "args": "implement authentication",
    "priority": "high",
    "skills": ["builder-skill", "security-skill"],
    "timeout": 900
  },
  {
    "id": "task-2",
    "command": "/validator",
    "args": "run tests",
    "priority": "medium",
    "skills": ["validator-skill"],
    "timeout": 600
  }
]
```

## Execution Flow

1. **Initialize Pool**: Create minimum number of agents (pre-warming)
2. **Load Tasks**: Read task queue file
3. **Monitor Loop**:
   - Check queue depth
   - Check agent health
   - Make scaling decisions
   - Assign tasks to available agents
4. **Execute Tasks**: Agents process assigned tasks
5. **Auto-Scale**:
   - Scale up if queue is deep and capacity exists
   - Scale down if too many idle agents
6. **Health Management**: Replace unhealthy agents automatically
7. **Generate Report**: Create execution summary with metrics

## Auto-Scaling Behavior

### Reactive Scaling

Scales based on current queue depth:

```
Queue Depth > scale_up_threshold (5):
  → Add agents (up to max_size)

Idle Agents > scale_down_threshold (2):
  → Remove idle agents (down to min_size)

Cooldown Period:
  → Wait 60s between scaling actions
```

**Example**:
```
[10:00:00] Pool: 3 agents, Queue: 10 tasks
[10:00:01] SCALE UP: Queue depth (10) > threshold (5)
[10:00:01] Adding 5 agents... (pool size: 3 → 8)
[10:00:15] Pool: 8 agents, Queue: 3 tasks
[10:05:00] SCALE DOWN: 5 idle agents > threshold (2)
[10:05:01] Removing 3 agents... (pool size: 8 → 5)
```

### Predictive Scaling

Uses historical load patterns to pre-scale:

```
Current Time: 14:00 (2 PM)
Historical Data: At 2 PM, average queue depth = 15

Prediction: Load will increase in 10 minutes
Action: Pre-scale from 5 → 12 agents

Result: Agents ready when load arrives (no latency spike)
```

**Requires**: 7 days of historical data for accuracy

## Monitoring Dashboard

The command provides real-time monitoring:

```
Dynamic Orchestrator - Live Dashboard
=====================================

Pool Status:
  Total Agents: 8
  Available: 3
  Busy: 5
  Unhealthy: 0
  Utilization: 62.5%

Task Queue:
  Pending: 12
  In Progress: 5
  Completed: 143
  Failed: 2

Performance:
  Avg Task Duration: 4m 23s
  P95 Task Duration: 8m 12s
  Throughput: 1.8 tasks/min
  Success Rate: 98.6%

Scaling:
  Last Action: Scale up (+3 agents)
  Next Check: 45s
  Strategy: predictive

Costs (Estimated):
  Tokens Used: 1.2M
  Cost Today: $3.45
  Projected Daily: $12.30
```

Press 'q' to quit, 'r' to refresh

## Agent Lifecycle Management

### Pre-Warming

```
[10:00:00] Initializing agent pool...
[10:00:01]   ▶ Spawning agent-1 (model: claude-sonnet-4)
[10:00:03]   ▶ Loading skills: builder-skill, validator-skill
[10:00:05]   ✓ agent-1 ready
[10:00:05]   ▶ Spawning agent-2
[10:00:07]   ✓ agent-2 ready
[10:00:07]   ▶ Spawning agent-3
[10:00:09]   ✓ agent-3 ready
[10:00:10] ✅ Pool initialized (3 agents ready)
```

### Health Checking

```
[10:15:00] Health check: agent-5
[10:15:01]   ❌ Health check failed (timeout)
[10:15:01]   Retry 1/3...
[10:15:03]   ❌ Health check failed (timeout)
[10:15:03]   Retry 2/3...
[10:15:05]   ❌ Health check failed (timeout)
[10:15:05]   ⚠️  agent-5 marked unhealthy (3 failures)
[10:15:06]   🔄 Spawning replacement agent-9...
[10:15:08]   ✓ agent-9 ready
[10:15:09]   🗑️  Terminating agent-5
```

### Agent Recycling

Agents are recycled after processing many tasks to prevent memory leaks:

```
[11:30:15] agent-3 reached task limit (100 tasks)
[11:30:16] 🔄 Recycling agent-3...
[11:30:17]   Completing current task: /builder implement feature
[11:30:25]   Task complete
[11:30:26]   Terminating agent-3
[11:30:27]   Spawning replacement agent-10
[11:30:29]   ✓ agent-10 ready
```

## Task Assignment Strategies

### Round-Robin (Default)

```
Tasks: [T1, T2, T3, T4, T5]
Agents: [A1, A2, A3]

Assignment:
  T1 → A1
  T2 → A2
  T3 → A3
  T4 → A1 (round back)
  T5 → A2
```

### Least-Loaded

```
Agent Load:
  A1: 3 tasks
  A2: 1 task
  A3: 2 tasks

New task assigned to: A2 (least loaded)
```

### Skill-Based

```
Task: /builder implement auth
Required Skills: [builder-skill, security-skill]

Agents:
  A1: [builder-skill] ❌
  A2: [builder-skill, security-skill] ✓
  A3: [validator-skill] ❌

Assigned to: A2
```

Configure in `.dynamic-orchestrator.yml`:
```yaml
assignment:
  strategy: skill-based  # or round-robin, least-loaded
```

## Error Handling

### Agent Spawn Failure

```
❌ ERROR: Failed to spawn agent

Attempt: 3/3
Error: Claude API rate limit exceeded
Retry in: 60 seconds

Action:
  1. Reducing spawn rate
  2. Will retry with exponential backoff
  3. Current tasks queued safely

Tip: Consider increasing --max-agents more gradually
```

### Task Timeout

```
⚠️  Task timeout: task-5

Agent: agent-4
Task: /builder implement complex feature
Timeout: 600 seconds (10 minutes)
Status: In progress for 612 seconds

Action:
  1. Terminating agent-4 (force stop)
  2. Marking task as failed
  3. Spawning replacement agent
  4. Moving to next task in queue

To increase timeout:
  Edit .dynamic-orchestrator.yml:
    agent.timeout: 1200  # 20 minutes
```

### Pool Exhaustion

```
⚠️  Pool exhausted - all agents busy

Queue: 15 tasks waiting
Pool: 10/10 agents (all busy)
Max agents reached

Options:
  1. Increase --max-agents=20
  2. Wait for current tasks to complete
  3. Optimize task duration

Current avg task duration: 8m 15s
Estimated wait time: ~8-10 minutes
```

## Performance Optimization

### Optimal Pool Sizing

**Formula**:
```
min_size = baseline_load
max_size = 2-3x peak_load

Example:
  Baseline: 5 tasks/hour → min_size = 2
  Peak: 30 tasks/hour → max_size = 10-15
```

### Cost Optimization

**Strategies**:
1. **Use Haiku for simple tasks**: Configure `agent.model: claude-haiku-3-5`
2. **Aggressive recycling**: Set `max_tasks_per_agent: 50` (recycle often)
3. **Scale down quickly**: Set `scale_down_threshold: 1` (remove idle agents fast)
4. **Pre-load skills**: Avoid repeated skill loading overhead

**Cost Tracking**:
```yaml
monitoring:
  cost_tracking: true
  daily_budget: 50.00  # USD
  alert_threshold: 0.8  # Alert at 80% of budget
```

## Output Files

```
.dynamic-orchestrator/
├── pool-config.yml               # Validated configuration
├── task-queue-processed.json    # Processed task queue
├── execution-log.txt             # Detailed log
├── metrics/
│   ├── pool-metrics-TIMESTAMP.json
│   ├── task-metrics-TIMESTAMP.json
│   └── cost-metrics-TIMESTAMP.json
├── health-checks/
│   └── agent-health-TIMESTAMP.json
└── reports/
    ├── execution-summary.md
    ├── performance-report.md
    └── cost-analysis.md
```

## Examples

### Example 1: Basic Auto-Scaling

```bash
# Create task queue
cat > tasks.txt <<EOF
/builder implement user authentication
/builder implement user authorization
/researcher analyze security best practices
/validator security audit
/builder implement rate limiting
/validator integration tests
EOF

# Run with auto-scaling
/dynamic-orchestrator tasks.txt --min-agents=2 --max-agents=8
```

### Example 2: Predictive Scaling

```yaml
# .dynamic-orchestrator.yml
scaling:
  strategy: predictive
  history_days: 7

agent:
  model: claude-sonnet-4
```

```bash
# Run with predictive scaling
/dynamic-orchestrator tasks.json
```

### Example 3: Skill-Based Assignment

```json
// tasks-with-skills.json
[
  {
    "command": "/builder",
    "args": "implement frontend",
    "skills": ["builder-skill", "ui-ux-skill"]
  },
  {
    "command": "/builder",
    "args": "implement API",
    "skills": ["builder-skill", "api-skill"]
  }
]
```

```yaml
# .dynamic-orchestrator.yml
assignment:
  strategy: skill-based

pool:
  agents:
    - model: claude-sonnet-4
      skills: [builder-skill, ui-ux-skill]
      count: 2
    - model: claude-sonnet-4
      skills: [builder-skill, api-skill]
      count: 2
```

```bash
/dynamic-orchestrator tasks-with-skills.json
```

## Integration with Other Commands

### Chain with DAG Executor

```bash
# Use dynamic orchestrator for each DAG task
/dag-executor workflow.yml --task-executor=/dynamic-orchestrator
```

### Export Metrics

```bash
# Export metrics to monitoring system
/dynamic-orchestrator tasks.txt --metrics-export=prometheus
```

## Troubleshooting

### Memory Leaks

**Problem**: Memory usage grows over time

**Solution**: Reduce `max_tasks_per_agent`:
```yaml
pool:
  max_tasks_per_agent: 50  # Recycle more frequently
```

### Slow Scale-Up

**Problem**: Agents not spawning fast enough during load spike

**Solution**: Increase `min_size` for faster initial capacity:
```yaml
pool:
  min_size: 5  # More agents pre-warmed
```

### Cost Overruns

**Problem**: Daily costs exceed budget

**Solution**:
1. Use Haiku model: `agent.model: claude-haiku-3-5`
2. Reduce max agents: `pool.max_size: 5`
3. Enable cost limits:
```yaml
monitoring:
  daily_budget: 20.00
  auto_stop: true  # Stop when budget exceeded
```

## Best Practices

1. **Start Conservative**: Begin with small min/max, scale up based on metrics
2. **Monitor Costs**: Track token usage and costs daily
3. **Health Checks**: Enable health checking for production
4. **Skill Pre-Loading**: Pre-load common skills to reduce latency
5. **Task Batching**: Group similar tasks for efficiency
6. **Graceful Shutdown**: Allow in-progress tasks to complete
7. **Historical Analysis**: Use predictive scaling after collecting 7 days data

## Related Documentation

- **Document 15**: Advanced Orchestration Patterns (Section 3: Dynamic Management)
- **Command**: `/dag-executor` - Task dependencies
- **Skill**: `agent-pool-manager-skill` - Pool management
- **Agent**: `pool-manager.md` - Pool manager agent

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- Auto-scaling (reactive and predictive)
- Agent health monitoring
- Multiple assignment strategies
- Cost tracking and budgets
- Real-time dashboard

---

**Status**: Production Ready
**Complexity**: Medium
**Prerequisites**: Understanding of auto-scaling concepts
**Estimated Learning Time**: 45 minutes
