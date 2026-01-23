# Observability and Monitoring

**Full documentation:** `docs/best-practices/06-Production-Deployment-and-Maintenance.md#observability-and-feedback-loops`

## Production Observability Stack

Effective observability transforms agentic coding from experimental tooling to mission-critical infrastructure.

### OpenTelemetry + Prometheus + SigNoz Integration

**Architecture:**
```
Agent Workflow → OpenTelemetry SDK → SigNoz (Collector + Storage + UI)
                       ↓
                 Prometheus Metrics → Grafana Dashboards
```

**Key Metrics:**
- Hook execution duration histogram
- Tool call success/failure rates
- Session token usage
- Policy violation counters

**Dashboard Widgets:**
- Hook Execution Heatmap
- Policy Violation Trends
- Latency Percentiles (p95 alert > 2s)
- Error Rate (alert > 5%)
- Cost Attribution

### Decision Confidence Scores

Track decision margins between chosen option and alternatives:
- **Margin > 0.20**: High confidence
- **Margin 0.10-0.20**: Moderate confidence
- **Margin < 0.10**: Low confidence, needs context
- **Margin < 0.05**: Critical, needs human guidance

### Key Performance Indicators

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Response Latency** | < 3s (p95) | p95 > 5s |
| **Token Usage** | < 15K/session | > 25K/session |
| **Success Rate** | > 95% | < 90% |
| **Cost per Task** | < $0.50 | > $2.00 |
| **Hook Execution** | < 1s (p95) | p95 > 3s |
| **Policy Compliance** | 100% | < 99% |

### Continuous Improvement Cycles

- **Weekly**: Failure pattern reviews
- **Monthly**: Cost analysis, model optimization
- **Quarterly**: Security audits, skill effectiveness
