---
name: observability-tracker
version: 1.0.0
description: Monitor orchestration with distributed tracing, metrics, and health checks
category: orchestration
allowed-tools:
  - Read
  - Write
  - Bash
tags:
  - orchestration
  - observability
  - monitoring
  - tracing
  - metrics
author: Claude Command and Control
created: 2026-01-21
updated: 2026-01-21
---

# Observability Tracker Command

## Purpose

Comprehensive observability for multi-agent orchestration. This command:

- Implements distributed tracing across agents
- Collects metrics (latency, throughput, success rate)
- Monitors agent health and dependencies
- Generates real-time dashboards
- Provides alerting and anomaly detection

**Use when**: Production deployments, complex workflows, or debugging distributed systems.

**Don't use when**: Simple workflows or observability overhead not justified.

## Usage

```bash
/observability-tracker start <orchestration-id> [--export=FORMAT] [--alerts=CONFIG]
```

### Arguments

- `orchestration-id` (required): Identifier for the orchestration to monitor
- `--export` (optional): Export format
  - `prometheus`: Prometheus metrics endpoint
  - `jaeger`: Jaeger tracing
  - `json`: JSON log files (default)
- `--alerts` (optional): Alert configuration file
- `--dashboard` (optional): Launch live dashboard (default: true)

## Configuration

```yaml
# .observability-tracker.yml
tracing:
  enabled: true
  sample_rate: 1.0        # 100% sampling
  export_format: jaeger

metrics:
  enabled: true
  collection_interval: 30  # seconds
  retention_days: 30
  metrics:
    - task_duration_ms
    - task_success_rate
    - agent_utilization
    - token_usage
    - error_rate

health_checks:
  enabled: true
  interval: 60
  timeout: 10
  endpoints:
    - name: agent_pool
      check: http://localhost:8080/health
    - name: state_coordinator
      check: http://localhost:8081/health

alerts:
  enabled: true
  channels:
    - type: log
      level: warning
    - type: github_issue
      repo: owner/repo
      labels: [alert, orchestration]
  rules:
    - name: high_error_rate
      condition: error_rate > 0.1
      severity: critical
    - name: slow_tasks
      condition: p95_latency_ms > 10000
      severity: warning
```

## Features

### 1. Distributed Tracing

```
Trace ID: abc123
Span Tree:
  orchestrate_feature (45.2s)
  ├─ spawn_agents (2.1s)
  │  ├─ spawn_agent_1 (1.2s)
  │  └─ spawn_agent_2 (1.1s)
  ├─ execute_tasks (42.0s)
  │  ├─ task_1 [agent-1] (15.3s)
  │  ├─ task_2 [agent-2] (12.7s)
  │  └─ task_3 [agent-1] (14.0s)
  └─ aggregate_results (1.1s)

Critical Path: orchestrate_feature → execute_tasks → task_1
Total Duration: 45.2s
```

### 2. Metrics Collection

**Counters**:
- `tasks_started_total`
- `tasks_completed_total`
- `tasks_failed_total`
- `agents_spawned_total`

**Gauges**:
- `active_agents`
- `queue_depth`
- `agent_pool_utilization`

**Histograms**:
- `task_duration_ms` (p50, p95, p99)
- `agent_spawn_time_ms`
- `token_usage_per_task`

### 3. Health Monitoring

```
Health Status Dashboard
======================

Components:
  ✓ Agent Pool          - Healthy (10/10 agents)
  ✓ State Coordinator   - Healthy
  ✓ DAG Executor        - Healthy
  ⚠️ External API       - Degraded (high latency)
  ❌ Database           - Unhealthy (connection failed)

Overall Status: DEGRADED

Last Health Check: 2s ago
Next Check: 58s
```

### 4. Real-Time Dashboard

```
Observability Dashboard - orchestration-abc123
==============================================

Traces (Last Hour):
  Total: 145
  Avg Duration: 12.3s
  P95 Duration: 28.7s
  P99 Duration: 45.2s

Metrics:
  Tasks/min: 8.5
  Success Rate: 97.2%
  Error Rate: 2.8%
  Agent Utilization: 65%

Current Traces:
  trace-001 | orchestrate_feature  | 15.2s (in progress)
  trace-002 | dag_execution        | 42.5s (completed)
  trace-003 | dynamic_scaling      | 8.7s (in progress)

Recent Errors:
  [15:23:45] task_5 failed: Connection timeout
  [15:20:12] agent-7 health check failed
  [15:18:33] token budget warning (90% used)

Press 'v' to view trace, 'a' for alerts, 'q' to quit
```

## Trace Visualization

```bash
# View specific trace
/observability-tracker view-trace abc123

# Output:
trace-abc123: orchestrate_feature (45.2s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

spawn_agents (2.1s)
├─ spawn_agent_1 (1.2s)
│  Logs: Agent spawned successfully
│  Tags: model=claude-sonnet-4, skills=[builder]
└─ spawn_agent_2 (1.1s)

execute_tasks (42.0s) ← CRITICAL PATH
├─ task_1 [agent-1] (15.3s) ← SLOWEST
│  Logs:
│    [0.0s] Task started
│    [5.2s] Loaded builder-skill
│    [15.1s] Implementation complete
│  Tags: priority=high, tokens=12500
│  Result: SUCCESS
├─ task_2 [agent-2] (12.7s)
└─ task_3 [agent-1] (14.0s)

aggregate_results (1.1s)

Metrics:
  Total Duration: 45.2s
  Task Time: 42.0s (93%)
  Overhead: 3.2s (7%)
  Tokens Used: 45,000
  Cost: $0.15
```

## Metrics Export

### Prometheus Format

```
# HELP task_duration_ms Task execution duration
# TYPE task_duration_ms histogram
task_duration_ms_bucket{le="1000"} 12
task_duration_ms_bucket{le="5000"} 45
task_duration_ms_bucket{le="10000"} 78
task_duration_ms_count 85
task_duration_ms_sum 425000

# HELP tasks_total Total tasks executed
# TYPE tasks_total counter
tasks_total{status="success"} 82
tasks_total{status="failed"} 3
```

### JSON Export

```json
{
  "timestamp": "2026-01-21T15:30:00Z",
  "orchestration_id": "abc123",
  "metrics": {
    "tasks_completed": 85,
    "tasks_failed": 3,
    "success_rate": 0.972,
    "avg_duration_ms": 5000,
    "p95_duration_ms": 12000,
    "p99_duration_ms": 18000,
    "token_usage": 425000,
    "cost_usd": 1.45
  },
  "health": {
    "agent_pool": "healthy",
    "state_coordinator": "healthy",
    "overall": "healthy"
  }
}
```

## Alerting

### Alert Rules

```yaml
alerts:
  rules:
    - name: high_failure_rate
      condition: error_rate > 0.1  # >10% failures
      severity: critical
      message: "Error rate {{ error_rate }} exceeds threshold"
      actions:
        - create_github_issue
        - send_notification

    - name: slow_performance
      condition: p95_latency_ms > 15000  # >15s
      severity: warning
      message: "P95 latency {{ p95_latency_ms }}ms is high"
      actions:
        - log_warning

    - name: budget_alert
      condition: token_usage > 900000  # >90% of 1M
      severity: warning
      message: "Token budget at {{ (token_usage/1000000)*100 }}%"
      actions:
        - create_github_issue
```

### Alert Output

```
🚨 ALERT: high_failure_rate
==========================

Severity: CRITICAL
Time: 2026-01-21 15:45:00 UTC
Orchestration: abc123

Metrics:
  Error Rate: 12.5% (threshold: 10%)
  Failed Tasks: 15/120
  Success Rate: 87.5%

Recent Failures:
  - task_42: Connection timeout
  - task_47: API rate limit
  - task_55: Invalid response

Actions Taken:
  ✓ Created GitHub Issue #156
  ✓ Logged to alert history

Recommended Actions:
  1. Check external API status
  2. Review error logs
  3. Consider circuit breaker
```

## Examples

### Example 1: Basic Monitoring

```bash
# Start orchestration with tracking
/orchestrate-feature feature.yml &
ORCH_ID=$!

# Start observability tracker
/observability-tracker start $ORCH_ID --export=json
```

### Example 2: Prometheus Integration

```bash
# Export to Prometheus
/observability-tracker start orch-1 --export=prometheus --port=9090

# Prometheus scrapes http://localhost:9090/metrics
```

### Example 3: Custom Alerts

```yaml
# alerts.yml
rules:
  - name: agent_unhealthy
    condition: unhealthy_agents > 0
    severity: critical

  - name: high_cost
    condition: hourly_cost_usd > 5.0
    severity: warning
```

```bash
/observability-tracker start orch-1 --alerts=alerts.yml
```

## Output Files

```
.observability-tracker/
├── traces/
│   ├── trace-abc123.json
│   └── trace-def456.json
├── metrics/
│   ├── metrics-2026-01-21.csv
│   └── aggregated-daily.json
├── health-checks/
│   └── health-log.txt
├── alerts/
│   └── alerts-2026-01.log
└── reports/
    ├── daily-summary.md
    └── weekly-analysis.md
```

## Troubleshooting

### High Trace Volume

```yaml
# Reduce sampling rate
tracing:
  sample_rate: 0.1  # 10% sampling
```

### Missing Traces

```
# Check trace propagation
trace_id=$(cat .observability-tracker/current-trace-id)
grep $trace_id .observability-tracker/traces/*.json
```

## Best Practices

1. **Always Enable in Production**: Essential for debugging
2. **Set Appropriate Sampling**: 100% for dev, 10-50% for prod
3. **Monitor the Monitors**: Track observability overhead
4. **Create Runbooks**: Document alert responses
5. **Regular Reviews**: Analyze metrics weekly
6. **Archive Old Data**: Compress traces older than 30 days

## Related Documentation

- **Document 15**: Section 9 (Monitoring and Observability)
- **Skill**: `performance-profiler-skill`
- **Agent**: `performance-monitor.md`

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- Distributed tracing
- Metrics collection
- Health monitoring
- Alerting
- Multiple export formats

---

**Status**: Production Ready
**Complexity**: Medium
