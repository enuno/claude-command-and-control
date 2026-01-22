---
name: performance-optimizer
version: 1.0.0
description: Monitor and optimize orchestration performance (throttling, load balancing, token budgets)
category: orchestration
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
tags:
  - orchestration
  - performance
  - optimization
  - throttling
  - cost-management
author: Claude Command and Control
created: 2026-01-21
updated: 2026-01-21
---

# Performance Optimizer Command

## Purpose

Monitor and optimize orchestration performance in real-time. This command:

- Implements rate limiting and throttling
- Manages token budgets and costs
- Load balances across agents
- Provides performance profiling and recommendations
- Optimizes resource utilization

**Use when**: Performance optimization is critical, costs need control, or you have strict SLAs.

**Don't use when**: Small-scale workflows or performance not a concern.

## Usage

```bash
/performance-optimizer <orchestration-process> [--enable=FEATURES] [--budget=AMOUNT]
```

### Arguments

- `orchestration-process` (required): PID or name of running orchestration
- `--enable` (optional): Comma-separated features
  - `throttling`: Rate limiting
  - `load-balancing`: Distribute work evenly
  - `token-budget`: Cost control
  - `caching`: Result caching
  - `all`: All features (default)
- `--budget` (optional): Daily token budget (default: 1000000)
- `--target-latency` (optional): Target P95 latency in ms (default: 5000)

## Configuration

```yaml
# .performance-optimizer.yml
throttling:
  enabled: true
  rate: 10.0          # requests per second
  burst: 20           # burst capacity

load_balancing:
  strategy: least-loaded  # round-robin, least-loaded, weighted
  health_weight: 0.3      # Weight for agent health

token_budget:
  daily_limit: 1000000
  alert_threshold: 0.8    # Alert at 80%
  auto_stop: false        # Don't auto-stop

caching:
  enabled: true
  ttl: 3600              # 1 hour
  max_size: 1000         # max cached items

optimization:
  auto_tune: true
  profile_interval: 60
  recommendation_threshold: 0.2  # 20% improvement needed
```

## Features

### 1. Rate Limiting (Token Bucket)

```
Rate: 10 requests/second
Burst: 20 requests

Behavior:
  - Sustained: 10 req/s
  - Bursts: Up to 20 req in quick succession
  - Refill: 10 tokens/second
```

### 2. Load Balancing

**Round-Robin**:
```
Agents: [A1, A2, A3]
Tasks: [T1→A1, T2→A2, T3→A3, T4→A1, ...]
```

**Least-Loaded**:
```
Agent Load: A1=5, A2=2, A3=8
Next Task → A2 (least loaded)
```

**Health-Weighted**:
```
Agents:
  A1: load=3, health=100% → score=3.0
  A2: load=2, health=80%  → score=2.5
  A3: load=4, health=90%  → score=4.4

Next Task → A2 (best score)
```

### 3. Token Budget Management

```
Daily Budget: 1,000,000 tokens
Current Usage: 750,000 (75%)

Status: ⚠️  Approaching limit

Actions:
  - Switch to Haiku for simple tasks
  - Enable caching
  - Reduce max_parallel

Projected Daily Total: 1,050,000
  ❌ Will exceed budget by 5%
```

### 4. Response Caching

```
Cache Hit: /research "Claude best practices"
  → Returning cached result (age: 15m)
  → Saved: 5,000 tokens

Cache Miss: /research "Latest Claude updates"
  → Executing task...
  → Caching result (TTL: 60m)
```

## Real-Time Dashboard

```
Performance Optimizer - Live Metrics
====================================

Rate Limiting:
  Current Rate: 8.5 req/s
  Available Tokens: 15/20
  Throttled Requests: 3

Load Balancing:
  Agent A1: 45% (healthy)
  Agent A2: 30% (healthy)
  Agent A3: 25% (degraded)
  Strategy: health-weighted

Token Budget:
  Used Today: 750,000 / 1,000,000 (75%)
  Remaining: 250,000
  Burn Rate: 125,000/hour
  Time to Limit: 2.0 hours

Caching:
  Hit Rate: 35%
  Cached Items: 145 / 1000
  Memory Usage: 12 MB

Performance:
  Avg Latency: 3,200ms (target: 5,000ms) ✓
  P95 Latency: 4,800ms ✓
  P99 Latency: 6,200ms ⚠️
  Throughput: 12 tasks/min
```

## Performance Profiling

```
Performance Profile - Last 60 seconds
=====================================

Slowest Tasks:
  1. /researcher analyze-codebase  - 12.3s
  2. /builder complex-refactor     - 8.7s
  3. /validator integration-tests  - 6.2s

Bottlenecks:
  ⚠️  Agent spawn time: 2.5s avg (optimize: pre-warming)
  ⚠️  Skill loading: 1.2s avg (optimize: pre-load common skills)
  ✓  Task execution: 4.1s avg (acceptable)

Resource Usage:
  CPU: 45% (8/16 cores)
  Memory: 2.3 GB / 16 GB
  Network: 15 MB/s
  API Rate Limit: 65% utilized

Optimization Opportunities:
  1. Pre-warm 2 more agents → -2s latency
  2. Enable caching → -30% token usage
  3. Use Haiku for simple tasks → -40% cost
```

## Auto-Tuning

```
Auto-Tuning Recommendations
==========================

Detected Pattern: High latency during 2-4 PM

Recommendation 1: Increase Agent Pool
  Current: min=3, max=10
  Suggested: min=5, max=15
  Expected Impact: -25% latency

Recommendation 2: Enable Predictive Scaling
  Predicted load spike at 2 PM
  Pre-scale +5 agents at 1:45 PM
  Expected Impact: -40% peak latency

Recommendation 3: Optimize Token Usage
  Switch to Haiku for tasks < 1000 tokens
  Expected Savings: $15/day (45% reduction)

Apply recommendations? [y/N]
```

## Examples

### Example 1: Basic Rate Limiting

```bash
# Start orchestration
/dag-executor workflow.yml &
ORCH_PID=$!

# Apply rate limiting
/performance-optimizer $ORCH_PID --enable=throttling

# Monitor
tail -f .performance-optimizer/metrics.log
```

### Example 2: Token Budget Control

```yaml
# .performance-optimizer.yml
token_budget:
  daily_limit: 500000    # 500K tokens/day
  alert_threshold: 0.9
  auto_stop: true        # Stop at limit

optimization:
  auto_switch_model: true
  haiku_threshold: 1000  # Use Haiku for tasks < 1000 tokens
```

```bash
/performance-optimizer orchestrator-1 --budget=500000
```

Output:
```
[14:00:00] Budget: 250,000 / 500,000 (50%)
[15:30:00] Budget: 450,000 / 500,000 (90%) ⚠️
[15:30:01] Auto-switching to Haiku for simple tasks
[16:45:00] Budget: 495,000 / 500,000 (99%) 🔴
[16:50:00] Budget limit reached - pausing new tasks
```

### Example 3: Load Balancing Optimization

```yaml
load_balancing:
  strategy: weighted
  weights:
    agent-1: 1.0   # Full weight (Opus)
    agent-2: 0.5   # Half weight (lighter tasks)
    agent-3: 1.5   # 1.5x weight (fastest agent)
```

```bash
/performance-optimizer orch-1 --enable=load-balancing
```

## Output Files

```
.performance-optimizer/
├── config.yml
├── metrics.log
├── profiling/
│   ├── profile-TIMESTAMP.json
│   └── recommendations.md
├── budgets/
│   ├── token-usage-daily.csv
│   └── cost-analysis.md
└── reports/
    └── optimization-report-TIMESTAMP.md
```

## Integration

### With Dynamic Orchestrator

```bash
# Apply performance optimization to agent pool
/performance-optimizer dynamic-orch-pid \
  --enable=load-balancing,token-budget \
  --budget=1000000
```

### Export Metrics

```bash
# Export to Prometheus
/performance-optimizer orch-1 --metrics-export=prometheus --metrics-port=9090
```

## Best Practices

1. **Set Realistic Budgets**: Based on historical usage
2. **Monitor Continuously**: Check dashboard regularly
3. **Enable Caching**: For repeated queries
4. **Use Appropriate Models**: Haiku for simple, Opus for complex
5. **Profile Regularly**: Identify bottlenecks weekly
6. **Auto-Tune**: Let system optimize itself

## Related Documentation

- **Document 15**: Section 7 (Performance Optimization)
- **Skill**: `performance-profiler-skill`
- **Agent**: `performance-monitor.md`

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- Rate limiting
- Load balancing
- Token budget management
- Caching
- Auto-tuning

---

**Status**: Production Ready
**Complexity**: Medium
