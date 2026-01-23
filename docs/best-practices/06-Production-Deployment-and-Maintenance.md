# Production Deployment and Maintenance

## Purpose
This document provides best practices for securely deploying, monitoring, and maintaining Claude commands and agents in live environments.

## Deployment Patterns

- Use CI/CD to automatically format, test, and deploy command/agent code
- Integrate pre- and post-deployment hooks for safety checks and environment setup
- Deploy to staging before promoting to production for all but trivial changes
- Enable rollbacks to previous agent/command versions on failure

## Security Best Practices

- Restrict allowed-tools and agent permissions for live environments
- Use short-lived credentials for integrations
- Audit command/agent actions centrally (timestamp, action, actor, outcome)
- Require manual approval or two-person review for production-impacting changes

## Observability and Feedback Loops

### Overview: Production-Grade Monitoring for Agentic Systems

Effective observability transforms agentic coding from experimental tooling to mission-critical infrastructure. Production systems require real-time visibility into agent decision-making, tool selection confidence, performance bottlenecks, and policy compliance—enabling rapid iteration and continuous improvement.

### OpenTelemetry and Prometheus Integration

**OpenTelemetry** provides distributed tracing for agent workflows, capturing execution spans across tool calls, hook invocations, and subagent coordination. Combined with **Prometheus** metrics and **SigNoz** visualization, teams gain comprehensive observability into agentic systems.

#### Implementation Architecture

**Instrumentation Stack:**
```
Agent Workflow → OpenTelemetry SDK → SigNoz (Collector + Storage + UI)
                       ↓
                 Prometheus Metrics → Grafana Dashboards
```

**Key Traces:**
- **Session Span**: Root span covering entire user session (prompt submission → response delivery)
- **Tool Call Spans**: Each tool execution (Bash, Edit, Write, Read) creates a child span with attributes:
  - `tool_name`: Which tool was invoked
  - `tool_input`: Command/file path/content (sanitized for secrets)
  - `execution_time_ms`: Duration
  - `exit_code`: Success (0) or error
  - `token_count`: Tokens consumed
- **Hook Execution Spans**: PreToolUse, PostToolUse, Stop hooks tracked with:
  - `hook_name`: Which hook fired
  - `decision`: allow/deny/block
  - `exit_code`: Hook result
  - `policy_violation`: Boolean flag

**Example: Hook Instrumentation with OpenTelemetry**
```python
#!/usr/bin/env python3
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
import sys, json, subprocess, time

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("claude_hook_PreToolUse") as span:
    event = json.load(sys.stdin)
    span.set_attribute("tool_name", event["tool_name"])
    span.set_attribute("session_id", event["session_id"])

    start = time.time()
    result = subprocess.run([".claude/hooks/actual_validator.sh"],
                          input=json.dumps(event),
                          text=True,
                          capture_output=True)
    elapsed_ms = (time.time() - start) * 1000

    span.set_attribute("exit_code", result.returncode)
    span.set_attribute("execution_time_ms", elapsed_ms)

    if result.returncode == 2:
        span.add_event("policy_violation", {"reason": result.stderr})

    sys.exit(result.returncode)
```

**Dashboard Widgets** (SigNoz Example):
- **Hook Execution Heatmap**: Visualizes when hooks run (time of day, day of week); identifies peak load
- **Policy Violation Trends**: Line chart of security vs. quality vs. compliance violations over 30 days
- **Latency Percentiles**: Histogram of hook execution times; alerts on p95 > 2s
- **Error Rate**: % of hooks failing (exit code != 0); alerts on rate > 5%
- **Cost Attribution**: Token usage per command/agent/feature; identifies optimization opportunities

**Prometheus Metrics:**
```prometheus
# Hook execution duration histogram
claude_hook_duration_seconds{hook_name="PreToolUse/bash_security", exit_code="0"} 0.123

# Tool call success rate counter
claude_tool_success_total{tool_name="Bash"} 1247
claude_tool_failure_total{tool_name="Bash"} 18

# Session token usage gauge
claude_session_tokens{session_id="550e8400-...", model="claude-sonnet-4"} 12450

# Policy violation counter
claude_policy_violations_total{violation_type="security", severity="high"} 3
```

### Decision Confidence Scores and Tool Selection Margins

Production agentic systems track **decision confidence** to identify when agents require additional context or skill refinement. Decision margins measure the gap between the chosen option and top alternatives—narrowing margins signal degrading confidence over time.

**Confidence Scoring Pattern:**

Commands and agents can log decision metadata structured as JSON:

```json
{
  "decision_type": "tool_selection",
  "timestamp": "2026-01-23T10:45:32Z",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "task": "implement user authentication",
  "decision": {
    "chosen": "Passport.js",
    "confidence": 0.73,
    "alternatives": [
      {"tool": "Auth0 SDK", "confidence": 0.68},
      {"tool": "Custom JWT", "confidence": 0.52}
    ],
    "margin": 0.05
  }
}
```

**Margin Analysis:**
- **Margin > 0.20**: High confidence, clear winner
- **Margin 0.10-0.20**: Moderate confidence, acceptable
- **Margin < 0.10**: Low confidence, consider providing additional context or examples
- **Margin < 0.05**: Critical—agent may benefit from skill refinement or human guidance

**Alerting on Low Confidence:**
```yaml
# Prometheus alert rule
- alert: LowDecisionConfidence
  expr: claude_decision_margin < 0.10
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Agent decision confidence degrading"
    description: "Decision margin {{ $value }} below threshold for session {{ $labels.session_id }}"
```

### Automated Quality Checks with Code Review Subagents

Code review subagents execute in **independent context windows**, evaluating implementation quality without bias from original reasoning. This autonomous review layer catches errors before human code review, reducing cognitive load and accelerating feedback cycles.

**Pattern: Code Review Command with Subagent**

```markdown
# .claude/commands/code-review.md

---
description: "Analyze git diff with fresh context for quality issues"
allowed-tools: ["Bash(git:*)", "Read", "Task"]
---

# Code Review with Subagent

Analyze the current diff with independent evaluation:

1. **Read current diff**: !git diff HEAD
2. **Spawn review subagent with clean context**:
   - Use Task tool with subagent_type=code-reviewer
   - Provide diff as input
   - No access to original implementation reasoning
3. **Evaluate**:
   - Security vulnerabilities (SQL injection, XSS, CSRF)
   - Performance issues (N+1 queries, memory leaks)
   - Style violations (linting, formatting, naming conventions)
   - Logic errors (off-by-one, null checks, edge cases)
4. **Generate review comments with line numbers**:
   - Structured JSON for CI integration
   - Severity levels (critical, high, medium, low)
   - Actionable suggestions for remediation
5. **Return results**:
   - Exit 0 if no critical issues
   - Exit 2 if blocking issues found
   - Provide detailed report to Claude
```

**Benefits:**
- **Unbiased evaluation**: Subagent doesn't inherit implementation context, catches assumptions
- **Parallel execution**: Review runs while developer continues other work
- **CI/CD integration**: Structured JSON output feeds automated workflows
- **Consistency**: Same review standards applied across all code changes

**Metrics to Track:**
- **Detection rate**: % of bugs caught by subagent before human review
- **False positive rate**: % of subagent findings incorrectly flagged
- **Time savings**: Human code review duration (baseline vs. with subagent pre-screening)

### Iterative Improvement Through Usage Analytics

Organizations track command usage patterns, failure modes, and performance metrics to prioritize optimization efforts:

**Analytics Framework:**

1. **Frequency Analysis**:
   - Which commands are most-used? Where should documentation investment focus?
   - Which agents handle the most sessions? Candidates for performance optimization
   - Example: `/test-all` used 450 times/week, `/deploy-check` only 12 times/week
   - **Action**: Invest in test command optimization, consider deprecating low-use commands

2. **Failure Correlation**:
   - What environmental conditions predict errors?
   - Example finding: Low retrieval scores + high token counts = 3x failure rate
   - **Action**: Implement retrieval quality gates, chunk large contexts into multiple prompts

3. **Cost Attribution**:
   - Which skills/commands consume most tokens?
   - Opportunities for model downselection (Opus → Sonnet)?
   - Example: Architecture planning uses 15K tokens/session (appropriate for Opus), but simple refactoring uses 12K tokens (could use Sonnet)
   - **Action**: Route simple tasks to Sonnet 4, achieving 28.4% cost reduction while maintaining 96.7% performance

4. **User Satisfaction**:
   - Net Promoter Score (NPS) for AI-generated code, segmented by task complexity
   - Weekly developer surveys: "How helpful was Claude today?" (1-5 scale)
   - Free-text feedback: "What should Claude do better?"
   - Example: NPS 72 for feature implementation, but only 45 for bug fixes
   - **Action**: Enhance debugging skills, add systematic-debugging workflow

**Continuous Improvement Cycles:**
- **Weekly**: Failure pattern reviews, identify top 3 error categories
- **Monthly**: Cost analysis, model selection optimization, command usage trends
- **Quarterly**: Security audits, compliance alignment, skill effectiveness evaluation

**Usage Analytics Dashboard:**
```
Command Usage (Last 30 Days)
┌──────────────────┬───────┬────────┬──────────┐
│ Command          │ Count │ Tokens │ Success% │
├──────────────────┼───────┼────────┼──────────┤
│ /test-all        │ 1,847 │ 8.2M   │ 94.3%    │
│ /pr              │   892 │ 12.4M  │ 89.7%    │
│ /lint-fixes      │   743 │ 2.1M   │ 98.1%    │
│ /deploy-check    │    47 │ 1.8M   │ 91.5%    │
└──────────────────┴───────┴────────┴──────────┘

Top Failure Categories
1. Test timeouts (23%) - Action: Add timeout configuration
2. Linting errors (18%) - Action: Pre-commit hook enforcement
3. Type errors (15%) - Action: Enhance TypeScript checking
```

## Audit Trails and Change Management

### Decision Trails and Tool Usage Tracking

Every agent action must be traceable for forensic analysis, compliance, and continuous improvement. Production systems maintain **comprehensive audit trails** capturing who did what, when, why, and with what outcome.

**Audit Log Structure:**

```json
{
  "timestamp": "2026-01-23T14:32:18.456Z",
  "event_type": "tool_execution",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "user": "alice@example.com",
  "project": "api-server",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test -- src/auth/*.test.ts"
  },
  "tool_output": {
    "exit_code": 0,
    "duration_ms": 2340,
    "tests_passed": 24,
    "tests_failed": 0
  },
  "decision_context": {
    "prompt": "Run tests for authentication module",
    "confidence": 0.89,
    "alternatives_considered": ["Run all tests", "Run only unit tests"]
  },
  "policy_checks": {
    "PreToolUse/bash_security": "allow",
    "PostToolUse/test_validator": "allow"
  }
}
```

**Storage and Retention:**

1. **Local Logs**: Append to `.claude/audit.jsonl` for immediate developer visibility
   - Retention: 30 days
   - Purpose: Debugging recent sessions, developer productivity tracking

2. **Remote Logs**: POST to SIEM (Splunk, Datadog, SigNoz) for centralized monitoring
   - Retention: Per compliance requirements (typically 1-7 years)
   - Purpose: Security forensics, compliance audits, organizational analytics

3. **Session Transcripts**: Full conversation history in `~/.claude/projects/{id}/sessions/{id}.jsonl`
   - Retention: Until project deleted
   - Purpose: Session replay, debugging, model fine-tuning

### Performance Metrics

Track agent and command performance to identify optimization opportunities and ensure SLA compliance:

**Key Performance Indicators (KPIs):**

| Metric | Target | Measurement | Alert Threshold |
|--------|--------|-------------|-----------------|
| **Response Latency** | < 3s (p95) | Time from tool call to completion | p95 > 5s |
| **Token Usage** | < 15K/session | Tokens consumed per session | > 25K/session |
| **Success Rate** | > 95% | % of commands completing without error | < 90% |
| **Cost per Task** | < $0.50 | API costs (model + tools) per feature | > $2.00 |
| **Hook Execution Time** | < 1s (p95) | Hook duration (PreToolUse, PostToolUse) | p95 > 3s |
| **Policy Compliance** | 100% | % of operations passing policy checks | < 99% |

**Performance Dashboard Example:**
```
Agent Performance Summary (Last 7 Days)
┌─────────────────────┬─────────┬──────────┬──────────┐
│ Metric              │ Current │ Target   │ Status   │
├─────────────────────┼─────────┼──────────┼──────────┤
│ Response Latency    │ 2.4s    │ <3s      │ ✅ Good  │
│ Token Usage (avg)   │ 12.3K   │ <15K     │ ✅ Good  │
│ Success Rate        │ 94.2%   │ >95%     │ ⚠️  Low   │
│ Cost per Task       │ $0.38   │ <$0.50   │ ✅ Good  │
│ Hook Latency (p95)  │ 0.8s    │ <1s      │ ✅ Good  │
│ Policy Compliance   │ 99.4%   │ 100%     │ ⚠️  Review│
└─────────────────────┴─────────┴──────────┴──────────┘
```

### User Feedback Collection

Systematic feedback collection enables data-driven improvements:

**Feedback Mechanisms:**

1. **Inline Ratings**: After each agent response
   ```
   How helpful was this response?
   👍 Helpful | 👎 Not Helpful | 🤷 Unsure
   ```

2. **Session Surveys**: Post-completion (5-question max)
   ```
   1. Did Claude complete your task? [Yes/No/Partially]
   2. Quality of generated code? [1-5 scale]
   3. Time saved vs. manual implementation? [< 50% / 50-70% / > 70%]
   4. Would you use Claude again for similar tasks? [Yes/No]
   5. What should Claude do better? [Free text]
   ```

3. **Weekly NPS**: Net Promoter Score tracking
   ```
   How likely are you to recommend Claude Code to a colleague? [0-10]

   Segmentation: Task type, developer seniority, project complexity
   ```

4. **Feedback Integration with Analytics**:
   - Low ratings (1-2 stars) trigger automatic issue creation
   - Patterns in free-text feedback inform skill development priorities
   - NPS correlation with usage frequency identifies adoption barriers

### Compliance Requirements

Enterprise deployments align with industry standards through systematic audit trails and governance frameworks:

#### SOC 2 Type II Compliance

**Requirements:**
- Comprehensive audit trails demonstrating security controls
- Access controls with principle of least privilege
- Change management workflows with approval gates
- Continuous monitoring and incident response

**Implementation:**
- **Audit Logging**: All tool executions logged with timestamp, user, action, outcome
- **Permission Scoping**: `allowed-tools` restrict agent capabilities; hooks enforce policies
- **Change Management**: All command/agent changes reviewed via PR, tested in staging before production
- **Monitoring**: Real-time dashboards (SigNoz, Datadog) with alerting on policy violations

**Evidence Collection:**
- Monthly audit reports: Tool usage, policy violations, remediation actions
- Quarterly security reviews: Hook effectiveness, false positive rates, security incidents
- Annual penetration testing: Adversarial prompt injection, command injection attempts

#### HIPAA (Healthcare)

**Requirements:**
- PHI (Protected Health Information) never transmitted to LLM APIs
- Agent processing limited to metadata and structural information
- Human review required for any patient-facing content
- Encryption at rest and in transit

**Implementation:**
- **Data Redaction**: PostToolUse hooks scan outputs for PHI patterns (SSN, medical record numbers), replace with `[REDACTED]`
- **Access Controls**: `allowed-tools` prevent Read access to directories containing PHI
- **Audit Trails**: Every agent action logged with user, timestamp, data accessed
- **Encryption**: Session transcripts encrypted (AES-256), decryption keys managed via HashiCorp Vault

**Compliance Validation:**
- Weekly automated scans for PHI exposure in agent logs
- Monthly access reviews ensuring least privilege adherence
- Quarterly HIPAA compliance audits by external assessors

#### GDPR (European Union)

**Requirements:**
- Data residency: EU customer data remains within geographic boundaries
- Right to deletion: Users can request removal of all agent-generated artifacts
- Data minimization: Collect only necessary information
- Consent management: Clear opt-in for AI assistance features

**Implementation:**
- **Geographic Restrictions**: Claude for Enterprise deployed via AWS eu-west-1 (Ireland) or eu-central-1 (Frankfurt)
- **Data Deletion**: `/delete-session` command removes session transcripts, audit logs, cached outputs
- **Minimization**: Hooks strip personally identifiable information before sending to LLMs
- **Consent UI**: Developers opt-in to Claude Code per-project; consent logged in audit trail

**Compliance Validation:**
- Data residency verified via network traffic analysis (no cross-border API calls)
- Deletion workflows tested monthly (mock GDPR data subject requests)
- Annual GDPR compliance audits covering data processing, storage, retention

### Change Management Workflows

All production changes to commands, agents, or hooks follow structured review and approval processes:

**Change Process:**

1. **Proposal**: Developer creates PR with:
   - Version bump (semantic versioning)
   - Changelog entry explaining rationale
   - Impact analysis (which teams/projects affected)
   - Testing evidence (CI passing, manual validation)

2. **Review**: Minimum 2 approvals required:
   - Technical reviewer: Code quality, security, performance
   - Security reviewer (if touching permissions, secrets, or compliance): Threat model, attack surface analysis

3. **Staging Deployment**: Changes deployed to staging environment
   - Monitor for 48 hours minimum
   - Check error rates, performance metrics, user feedback
   - Automated rollback if error rate > 5% or latency > 2x baseline

4. **Production Deployment**: Gradual rollout
   - **Week 1**: 10% of users (canary deployment)
   - **Week 2**: 50% of users (if canary metrics acceptable)
   - **Week 3**: 100% rollout
   - Rollback plan documented and tested

5. **Post-Deployment Validation**:
   - Monitor key metrics for 7 days post-rollout
   - Weekly retrospective: What went well? What needs improvement?
   - Document lessons learned in knowledge base

**Audit Trail for Changes:**
```json
{
  "change_id": "CHG-2026-0123",
  "timestamp": "2026-01-23T16:00:00Z",
  "type": "command_update",
  "artifact": ".claude/commands/deploy-check.md",
  "version": "1.2.0 → 1.3.0",
  "author": "bob@example.com",
  "approvers": ["alice@example.com", "security-team@example.com"],
  "rationale": "Add AWS region validation to prevent cross-region deployments",
  "impact": "All deploy-check invocations now validate AWS_REGION environment variable",
  "rollback_plan": "Revert to v1.2.0 via git tag, redeploy via CI pipeline",
  "testing": {
    "unit_tests": "pass",
    "integration_tests": "pass",
    "staging_validation": "48hrs, 0 errors, latency +0.2s (acceptable)"
  }
}
```

## Agent/Command Lifecycle Management

- Retire unused commands/agents, update documentation, and prune stale configurations
- Increment semantic version for all externally visible changes
- Document rationale and expected impact for each update

## Cost Control

- Use efficient models for simple/automatable tasks; reserve most capable models for complex orchestration
- Periodically review command/agent usage and tune scope to prevent cost overrun

---

**For Further Reading:**
- [Document 02: Individual Command Creation](02-Individual-Command-Creation.md) - Commands and hooks integration
- [Document 05: Testing and Quality Assurance](05-Testing-and-Quality-Assurance.md) - Production-grade hooks
- [Document 07: Quick Reference and Templates](07-Quick-Reference-and-Templates.md) - Templates and checklists

---

**Document Version**: 2.0.0
**Last Updated**: January 23, 2026
**Maintained By**: Claude Command and Control Project
**Review Cycle**: Quarterly