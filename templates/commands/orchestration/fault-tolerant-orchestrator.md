---
name: fault-tolerant-orchestrator
version: 1.0.0
description: Execute workflows with advanced error handling (retry, circuit breaker, saga pattern)
category: orchestration
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - TodoWrite
tags:
  - orchestration
  - fault-tolerance
  - error-handling
  - circuit-breaker
  - saga-pattern
  - retry-logic
author: Claude Command and Control
created: 2026-01-21
updated: 2026-01-21
---

# Fault-Tolerant Orchestrator Command

## Purpose

Execute workflows with comprehensive fault tolerance mechanisms. This command:

- Implements retry logic with exponential backoff
- Uses circuit breakers to prevent cascading failures
- Supports saga pattern for distributed transaction rollback
- Provides bulkhead isolation for resource protection
- Handles partial failures gracefully

**Use when**: Workflows are mission-critical, cascading failures are a risk, or distributed transactions need rollback.

**Don't use when**: Simple workflows with no external dependencies or fault tolerance not required.

## Usage

```bash
/fault-tolerant-orchestrator <workflow-file> [--strategy=STRATEGY] [--max-retries=N]
```

### Arguments

- `workflow-file` (required): Workflow definition with error handling
- `--strategy` (optional): Error handling strategy
  - `retry`: Retry failed tasks (default)
  - `circuit-breaker`: Use circuit breakers
  - `saga`: Distributed transaction with rollback
  - `all`: All strategies combined
- `--max-retries` (optional): Maximum retry attempts per task (default: 3)
- `--circuit-threshold` (optional): Failures before circuit opens (default: 5)

## Workflow Format

```yaml
# fault-tolerant-workflow.yml
tasks:
  deploy_database:
    command: /deploy
    args: "deploy database schema"
    retry:
      max_attempts: 3
      backoff: exponential
      base_delay: 5
    circuit_breaker:
      enabled: true
      failure_threshold: 3
      timeout: 60
    compensation:  # Saga pattern
      command: /rollback
      args: "rollback database schema"

  deploy_api:
    command: /deploy
    args: "deploy API service"
    dependencies: [deploy_database]
    retry:
      max_attempts: 5
      backoff: exponential
    circuit_breaker:
      enabled: true
    compensation:
      command: /rollback
      args: "rollback API deployment"

  smoke_tests:
    command: /validator
    args: "run smoke tests"
    dependencies: [deploy_api]
    timeout: 300
    on_failure: rollback_all  # Trigger full saga rollback

config:
  fault_tolerance:
    global_timeout: 3600
    fail_strategy: saga_rollback
    circuit_breaker_recovery: 120
    bulkhead_size: 10
```

## Error Handling Strategies

### 1. Retry with Exponential Backoff

```yaml
retry:
  max_attempts: 5
  backoff: exponential  # or linear, fixed
  base_delay: 2         # seconds
  max_delay: 60
  jitter: true          # add randomness
```

**Execution**:
```
Attempt 1: Immediate
Attempt 2: Wait 2s
Attempt 3: Wait 4s
Attempt 4: Wait 8s
Attempt 5: Wait 16s
```

### 2. Circuit Breaker

```yaml
circuit_breaker:
  enabled: true
  failure_threshold: 5    # Open after 5 failures
  timeout: 60             # Stay open for 60s
  half_open_max_calls: 1  # Test with 1 call in HALF_OPEN
```

**States**:
- `CLOSED`: Normal operation
- `OPEN`: Fail fast, don't call service
- `HALF_OPEN`: Test if service recovered

### 3. Saga Pattern (Distributed Rollback)

```yaml
saga:
  enabled: true
  compensation_order: reverse  # Rollback in reverse order
  parallel_compensation: false # Sequential rollback
  timeout_per_compensation: 300
```

**Execution**:
```
Forward Flow:
  Step 1: deploy_database ✓
  Step 2: deploy_api ✓
  Step 3: smoke_tests ✗ (FAILED)

Compensation Flow (reverse order):
  Compensate Step 2: rollback API ✓
  Compensate Step 1: rollback database ✓
```

### 4. Bulkhead Pattern

```yaml
bulkhead:
  enabled: true
  max_concurrent: 5     # Max 5 tasks in this bulkhead
  queue_size: 10        # Max 10 waiting
  timeout: 30           # Queue timeout
```

## Real-Time Monitoring

```
Fault-Tolerant Orchestrator - Status
====================================

Circuit Breakers:
  deploy_api: CLOSED (0 failures)
  external_api: OPEN (will retry in 45s)
  database: CLOSED (0 failures)

Retry Stats:
  Total Retries: 12
  Successful: 10
  Failed (max attempts): 2

Saga Status:
  Forward Steps: 3/5 completed
  Compensations: 0 triggered

Bulkheads:
  critical-operations: 3/5 active, 2 queued
  background-tasks: 1/3 active, 0 queued

Health:
  Overall: DEGRADED
  Failed Components: external_api
```

## Examples

### Example 1: Retry with Backoff

```yaml
# retry-workflow.yml
tasks:
  call_external_api:
    command: /api-client
    args: "fetch user data"
    retry:
      max_attempts: 5
      backoff: exponential
      base_delay: 1
      max_delay: 30
      jitter: true
      retry_on:  # Only retry these errors
        - ConnectionError
        - TimeoutError
        - RateLimitError
```

```bash
/fault-tolerant-orchestrator retry-workflow.yml --strategy=retry
```

Output:
```
[10:00:00] Executing: call_external_api
[10:00:01] ❌ Attempt 1 failed: ConnectionError
[10:00:02] 🔄 Retry 1/5 (wait 1.2s)...
[10:00:03] ❌ Attempt 2 failed: ConnectionError
[10:00:04] 🔄 Retry 2/5 (wait 2.4s)...
[10:00:07] ✓ Attempt 3 succeeded
```

### Example 2: Circuit Breaker Protection

```yaml
# circuit-breaker-workflow.yml
tasks:
  call_flaky_service:
    command: /external-call
    args: "service.example.com/api"
    circuit_breaker:
      failure_threshold: 3
      timeout: 60
      half_open_max_calls: 1
```

```bash
/fault-tolerant-orchestrator circuit-breaker-workflow.yml --strategy=circuit-breaker
```

Output:
```
[10:00:00] Circuit: CLOSED
[10:00:01] ❌ Call failed (1/3)
[10:00:02] ❌ Call failed (2/3)
[10:00:03] ❌ Call failed (3/3)
[10:00:04] 🔴 Circuit: OPEN (will retry in 60s)
[10:00:05] ⚡ Failing fast (circuit OPEN)
[10:01:04] 🟡 Circuit: HALF_OPEN (testing...)
[10:01:05] ✓ Call succeeded
[10:01:06] 🟢 Circuit: CLOSED (service recovered)
```

### Example 3: Saga Pattern Rollback

```yaml
# saga-workflow.yml
tasks:
  reserve_inventory:
    command: /inventory
    args: "reserve items"
    compensation:
      command: /inventory
      args: "release reservation"

  charge_payment:
    command: /payment
    args: "charge card"
    dependencies: [reserve_inventory]
    compensation:
      command: /payment
      args: "refund charge"

  send_confirmation:
    command: /email
    args: "send order confirmation"
    dependencies: [charge_payment]
    compensation:
      command: /email
      args: "send cancellation notice"
```

```bash
/fault-tolerant-orchestrator saga-workflow.yml --strategy=saga
```

Output (if charge_payment fails):
```
[10:00:00] ▶ reserve_inventory
[10:00:05] ✓ reserve_inventory
[10:00:06] ▶ charge_payment
[10:00:10] ❌ charge_payment FAILED (card declined)
[10:00:11] 🔄 Starting saga compensation...
[10:00:12]   ▶ Compensate: charge_payment (skip - never succeeded)
[10:00:13]   ▶ Compensate: reserve_inventory
[10:00:15]   ✓ Released inventory reservation
[10:00:16] ✅ Saga rollback complete
```

## Error Scenarios

### Compensation Failure

```
⚠️  CRITICAL: Compensation failed

Task: reserve_inventory
Compensation: release reservation
Error: Database connection timeout

Status: PARTIALLY ROLLED BACK
Manual intervention required

Completed compensations:
  ✓ send_confirmation → cancellation email sent
  ✓ charge_payment → refund issued
  ❌ reserve_inventory → FAILED (items still reserved)

Action Required:
  1. Check database connectivity
  2. Manually release reservation for order #12345
  3. Update incident log
```

### Circuit Stuck Open

```
⚠️  Circuit breaker stuck OPEN

Service: external_api
Duration: 10 minutes
Last successful call: 10:00:00
Failed calls (fast-fail): 45

Suggested Actions:
  1. Check external service status
  2. Review logs: .fault-tolerant/circuit-breaker-logs.txt
  3. Manual circuit reset:
     /fault-tolerant-orchestrator reset-circuit external_api
```

## Output Files

```
.fault-tolerant/
├── execution-log.txt
├── circuit-breaker-state.json
├── retry-history.json
├── saga-compensations.json
└── reports/
    ├── fault-tolerance-report.md
    └── incident-log.md
```

## Best Practices

1. **Idempotent Operations**: Ensure tasks can be safely retried
2. **Compensation Testing**: Test rollback logic thoroughly
3. **Circuit Breaker Tuning**: Adjust thresholds based on service SLAs
4. **Monitor Patterns**: Track circuit states and retry rates
5. **Timeouts Everywhere**: Set reasonable timeouts for all operations
6. **Graceful Degradation**: Continue with partial success when possible

## Related Documentation

- **Document 15**: Section 5 (Advanced Error Handling)
- **Skill**: `saga-pattern-skill`, `circuit-breaker-skill`
- **Agent**: `resilience-orchestrator.md`

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- Retry with exponential backoff
- Circuit breaker pattern
- Saga pattern with compensation
- Bulkhead isolation

---

**Status**: Production Ready
**Complexity**: High
**Prerequisites**: Understanding of distributed systems fault tolerance
