---
description: "Orchestrate multi-stage validation pipeline with parallel test execution, security auditing, performance benchmarking, and automated go/no-go decision for production readiness."
allowed-tools: ["Read", "Edit", "Task", "Bash(*:test)", "Bash(*:lint)", "Bash(*:audit)", "Bash(git:*)", "Bash(npm:*)", "Bash(pip:*)", "Bash(mvn:*)", "Bash(cargo:*)", "Bash(find)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Quality Gate

## Purpose
Establish comprehensive quality assurance checkpoint that validates code quality, test coverage, security posture, and performance before allowing promotion to production. Automates multi-stage validation with parallel execution across agent worktrees and provides decisive go/no-go decision with detailed metrics dashboard.

## When to Use
- Before creating pull requests to main/master
- Before releasing to production
- Before deploying to staging environment
- During CI/CD pipeline quality gate enforcement
- As mandatory pre-merge validation
- Before hotfix deployment

## Prerequisites
- Complete test suite configured and passing locally
- Linting configuration defined (eslint, flake8, clippy, etc.)
- Security scanning tools available (trivy, snyk, owasp, etc.)
- Git repository clean or all changes committed
- Performance baseline established (if benchmarking enabled)
- .github/QUALITY_GATE.md or project quality standards documented

## Project-Specific Customization

**To use this template in your project:**

1. Copy to `.claude/commands/quality-gate.md`
2. Define coverage thresholds in `QUALITY_GATE.md` (defaults: 80% statements, 75% branches)
3. Configure security scan tools based on project type (Node.js: snyk, Python: bandit, etc.)
4. Set performance benchmarks if applicable
5. Adjust phase timeouts based on project size (defaults: 10min unit tests, 15min integration)
6. Customize go/no-go criteria to match organizational standards

## Workflow

### Phase 1: Pre-Gate Validation

**Step 1.1: Load Quality Standards**
```markdown
Read quality configuration files in order of precedence:
1. `.github/QUALITY_GATE.md` (repository-specific)
2. `QUALITY_GATE.md` (project root)
3. Built-in defaults (see Quality Gate Thresholds section)

Extract and display:
- Coverage thresholds (statements, branches, functions, lines)
- Test timeout limits
- Security scan requirements
- Performance targets
- Compliance requirements
```

**Step 1.2: Git State Validation**
```bash
# Verify clean working state
!git status --porcelain

# Verify branch protection
!git config branch.$(git rev-parse --abbrev-ref HEAD).protected 2>/dev/null || true

# Show commits pending in current branch
!git log --oneline origin/main..HEAD | head -10

# Verify no uncommitted changes
# FAIL if: uncommitted changes exist (unless --force flag)
```

**Step 1.3: Dependency Audit**
```bash
# JavaScript/Node.js
!npm audit --json 2>/dev/null || npm audit summary 2>/dev/null

# Python
!pip check 2>/dev/null && pip list --outdated 2>/dev/null

# Rust
!cargo outdated 2>/dev/null

# Java/Maven
!mvn dependency:check 2>/dev/null
```

### Phase 2: Parallel Quality Validation

Execute stages 2A-2D in parallel using task orchestration:

**Step 2A: Linting & Code Quality (5-10 min)**
```bash
# JavaScript/Node.js
!npm run lint -- --format json > lint-results.json 2>&1

# Python
!flake8 --format=json --output-file=lint-results.json . 2>/dev/null

# Go
!golangci-lint run --out-format json > lint-results.json 2>&1

# Rust
!cargo clippy --message-format=json 2> lint-results.json

# Ruby
!rubocop --format json > lint-results.json 2>/dev/null

Parse results: Extract error count, warning count, critical issues
Status: PASS if error_count == 0, WARN if warning_count > 0
```

**Step 2B: Test Execution Suite (10-20 min)**
```bash
# Unit Tests
!npm test -- --coverage --json --outputFile=test-unit.json 2>/dev/null || \
  pytest tests/unit --cov=src --cov-report=json 2>/dev/null || \
  cargo test --lib -- --test-threads=1 --nocapture 2>/dev/null

# Integration Tests
!npm run test:integration -- --json --outputFile=test-integration.json 2>/dev/null || \
  pytest tests/integration --cov=src --cov-report=json 2>/dev/null

# Extract metrics:
# - Total tests run
# - Pass count / Fail count
# - Duration
# - Coverage: statements%, branches%, functions%, lines%
# Status: PASS if pass_count == total_tests AND coverage >= threshold
```

**Step 2C: Security Audit (5-15 min)**
```bash
# Dependency Vulnerability Scanning
# Node.js
!npm audit --json > security-npm.json 2>/dev/null

# Python
!pip-audit --desc --format=json > security-pip.json 2>/dev/null || true

# Rust
!cargo-audit --json > security-cargo.json 2>/dev/null

# Container/Docker
!trivy image --format=json --output=security-trivy.json . 2>/dev/null || true

# SAST (Static Application Security Testing)
!semgrep --json --output=security-semgrep.json . 2>/dev/null || true

# Secret scanning
!truffleHog git file:. --json > security-secrets.json 2>/dev/null || true

Aggregate security findings:
- Critical vulnerabilities (CVSS >= 9.0): FAIL if any
- High vulnerabilities (CVSS 7.0-8.9): WARN if count > 3
- Medium/Low: Inform but don't block
- Hardcoded secrets: FAIL if any detected
```

**Step 2D: Performance Benchmark (2-10 min)**
```bash
# Load baseline metrics if available
!cat .perf-baseline.json 2>/dev/null || echo "{}"

# Run performance tests
# JavaScript
!npm run perf-test -- --json --output=perf-results.json 2>/dev/null || true

# Python
!pytest tests/perf --benchmark-json=perf-results.json 2>/dev/null || true

# Rust
!cargo bench --no-run 2>/dev/null && cargo bench 2>/dev/null || true

# Compare against baseline:
# - Calculate % change from baseline
# - FAIL if regression > 10% on critical paths
# - WARN if regression > 5% on non-critical paths
# - PASS if performance maintained or improved
```

### Phase 3: Metrics Aggregation & Analysis

**Step 3.1: Compile Quality Dashboard**
```markdown
Create QUALITY_GATE_REPORT.md with comprehensive metrics:

## Quality Gate Report
**Generated**: [ISO 8601 timestamp]
**Git Commit**: [hash]
**Branch**: [current branch]

### Phase Summary

| Phase | Status | Duration | Details |
|-------|--------|----------|---------|
| Linting | ✅ PASS | 4.2s | 0 errors, 2 warnings |
| Unit Tests | ✅ PASS | 18.5s | 127/127 passed |
| Integration Tests | ✅ PASS | 25.3s | 34/34 passed |
| Security Audit | ⚠️ WARN | 8.1s | 1 medium vulnerability |
| Performance | ✅ PASS | 6.2s | 2.3% improvement |

### Coverage Analysis

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Statements | 89% | 80% | ✅ PASS |
| Branches | 76% | 75% | ✅ PASS |
| Functions | 91% | 80% | ✅ PASS |
| Lines | 88% | 80% | ✅ PASS |

**Uncovered High-Risk Areas**:
- src/payment/checkout.js (65% coverage)
- src/auth/oauth.ts (72% coverage)

### Security Findings

| Issue | Severity | CVE | Status |
|-------|----------|-----|--------|
| lodash DoS | Medium | CVE-2021-23337 | Needs patch |
| regex timeout | Low | None | Info only |

### Performance Analysis

| Benchmark | Baseline | Current | Change | Status |
|-----------|----------|---------|--------|--------|
| API response | 145ms | 142ms | -2.1% | ✅ |
| DB query | 320ms | 315ms | -1.6% | ✅ |
| Page load | 2.3s | 2.4s | +4.3% | ⚠️ |

### Code Quality
- Lint errors: 0
- Lint warnings: 2 (non-critical)
- Code style issues: 0
- Complexity violations: 0
```

**Step 3.2: Risk Assessment**
```markdown
Evaluate accumulated risk across all phases:

Risk Scoring Matrix:
- Critical Issues (must fix): 0 → Green
- Critical Issues (must fix): 1+ → Red
- High Priority Issues: 0-2 → Green
- High Priority Issues: 3+ → Yellow
- Medium Issues: Any → Consider trend
- Coverage Regression: None → Green
- Coverage Regression: < 2% → Yellow
- Coverage Regression: >= 2% → Red
```

### Phase 4: Go/No-Go Decision

**Step 4.1: Evaluate Against Quality Criteria**

```markdown
Decision Matrix (ALL must be met for GO):

MANDATORY GATES (Hard Stop):
□ All tests passing (100% pass rate)
□ No critical security vulnerabilities
□ No hardcoded secrets detected
□ Coverage >= configured threshold
□ Zero linting errors
□ No critical performance regressions (>10%)
□ Branch clean or all changes committed

ADVISORY GATES (Informational):
⚠️ Lint warnings present (recommend fix)
⚠️ Minor performance regression (5-10%)
⚠️ Medium severity security issue (not critical)
⚠️ Branch not up to date with main

AUTO-GATE LOGIC:
IF all mandatory gates passed:
  → DECISION: GO ✅
ELSE IF any mandatory gate failed:
  → DECISION: NO-GO ❌
  → Display blocker items needing remediation
ELSE IF only advisory gates violated:
  → DECISION: GO WITH CAUTION ⚠️
  → Require explicit user override
```

**Step 4.2: Generate Decision Report**
```bash
# Create gate decision summary
!cat > QUALITY_GATE_DECISION.md << 'EOF'
# Quality Gate Decision

**Decision**: [GO ✅ / NO-GO ❌ / GO WITH CAUTION ⚠️]
**Timestamp**: [ISO 8601]
**Authorized By**: [User/Agent]
**Commit Hash**: [git hash]

## Decision Rationale

### Passed Validations
[List all passing quality gates]

### Failed Validations
[List any failed gates with remediation guidance]

### Risk Assessment
[Summary of remaining risks]

## Next Steps
[Based on decision, specify next action]
EOF
```

### Phase 5: Output & Dashboard

**Step 5.1: Display Quality Dashboard**
```
╔════════════════════════════════════════════════════╗
║          QUALITY GATE VALIDATION REPORT            ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]
COMMIT: [hash] on [branch]
TIMESTAMP: [ISO 8601]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE SUMMARY:
  Linting & Code Quality         ✅ PASS  (4.2s)
  Test Execution Suite           ✅ PASS  (43.8s)
  Security Audit                 ⚠️ WARN  (8.1s)
  Performance Benchmark          ✅ PASS  (6.2s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COVERAGE METRICS:
  Statements: 89% (Target: 80%) ✅
  Branches:   76% (Target: 75%) ✅
  Functions:  91% (Target: 80%) ✅
  Lines:      88% (Target: 80%) ✅

TEST RESULTS:
  Unit Tests:        127 passed (18.5s)
  Integration Tests: 34 passed (25.3s)
  Total:             161/161 passed ✅

SECURITY:
  Critical:  0 issues
  High:      0 issues
  Medium:    1 issue (lodash vulnerability)
  Low:       1 issue (regex timeout)
  Secrets:   0 detected ✅

PERFORMANCE:
  API Response: 142ms (-2.1% vs baseline) ✅
  DB Query:     315ms (-1.6% vs baseline) ✅
  Page Load:    2.4s (+4.3% vs baseline) ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERALL DECISION: GO ✅

READY FOR:
  ✅ Pull Request Review
  ✅ Staging Deployment
  ✅ Production Release (after PR review)

RECOMMENDATIONS:
  ⚠️ Address lodash medium vulnerability in security PR
  ⚠️ Investigate page load regression (4.3%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETAILED REPORTS:
  Full Report:      QUALITY_GATE_REPORT.md
  Decision Log:     QUALITY_GATE_DECISION.md
  Lint Results:     lint-results.json
  Test Results:     test-results.json
  Security Audit:   security-audit.json
  Performance:      perf-results.json

NEXT STEPS:
  1. Review detailed QUALITY_GATE_REPORT.md
  2. Address any ⚠️ warnings (optional)
  3. If GO: Proceed to PR review and deployment
  4. If NO-GO: Review blockers in QUALITY_GATE_DECISION.md
```

**Step 5.2: Integration Points**
```bash
# Export decision for CI/CD
!echo "QUALITY_GATE_DECISION=GO" >> $GITHUB_ENV

# Post summary comment to PR (if github context available)
!gh pr comment -b "$(cat QUALITY_GATE_DECISION.md)"

# Trigger next stage in pipeline
!curl -X POST $DEPLOY_WEBHOOK_URL \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"commit":"'$(git rev-parse HEAD)'","decision":"GO"}'
```

## Error Handling

### Test Failures
```markdown
IF tests fail during Phase 2B:
1. Capture failing test names and stack traces
2. Extract root cause from test output
3. Suggest immediate remediation steps
4. DO NOT proceed to Phase 3 (halt quality gate)
5. Output: DECISION = NO-GO with remediation path
```

### Security Vulnerabilities
```markdown
IF critical security issue detected (CVSS >= 9.0):
1. Log all vulnerability details
2. FAIL quality gate immediately
3. DECISION = NO-GO with security remediation required
4. Recommend patching or upgrading vulnerable dependency
```

### Performance Regression
```markdown
IF performance degrades > 10%:
1. Capture baseline and current metrics
2. Suggest profiling candidates
3. Decision depends on criticality:
   - Critical path: FAIL quality gate (NO-GO)
   - Non-critical: WARN and allow override
```

### Timeout Handling
```markdown
IF any phase exceeds timeout:
1. Gracefully terminate that phase
2. Mark as TIMEOUT in report
3. Return available partial results
4. Conservative decision: NO-GO (retry or debug)
```

## Security Considerations

- **Credentials**: Never log secrets, API keys, or tokens to reports
- **Audit Trail**: All decisions logged with timestamp and authorizer
- **Approval Workflow**: Critical decisions require explicit approval
- **Access Control**: Gate reports contain sensitive security data (restrict access)
- **Data Retention**: Archive quality gate reports for compliance (30+ days)

## Quality Gate Thresholds (Defaults)

```yaml
coverage:
  statements: 80
  branches: 75
  functions: 80
  lines: 80

timeouts:
  linting: 10m
  unit_tests: 10m
  integration_tests: 15m
  security_audit: 15m
  performance: 10m

performance_regression_threshold: 10%
security_critical_cvss_threshold: 9.0
mandatory_test_pass_rate: 100%
```

## Key Features

- **Parallel Execution**: Phases 2A-2D execute concurrently for speed
- **Comprehensive Metrics**: Coverage, security, performance, code quality in single report
- **Automated Decision**: Objective go/no-go logic removes ambiguity
- **Multi-Language Support**: Detects and uses appropriate tools for JavaScript, Python, Java, Rust, Go
- **Risk Scoring**: Aggregates risk across phases for holistic view
- **Advisory Warnings**: Distinguishes critical blockers from informational warnings
- **Detailed Audit Trail**: All decisions logged with rationale
- **CI/CD Integration**: Integrates with GitHub, GitLab, Jenkins pipelines
- **Remediation Guidance**: Specific next steps for failures

## Integration with CI/CD

```yaml
# GitHub Actions Example
- name: Quality Gate
  run: /.claude/commands/quality-gate.md
  env:
    QUALITY_GATE_STRICT: true

- name: Proceed if GO
  if: env.QUALITY_GATE_DECISION == 'GO'
  run: |
    gh pr review approve
    gh pr merge --auto --squash
```

## Version History

- **1.0** (2025-11-29): Initial comprehensive quality gate with multi-stage validation, parallel execution, security audit, performance benchmarking, and automated go/no-go decision
