---
description: "Execute every test suite discovered in the project (unit, integration, e2e) and output a consolidated pass/fail and coverage summary."
allowed-tools: ["Read", "Search", "Test", "Bash(npm:*)", "Bash(pytest)", "Bash(mvn:*)", "Bash(cargo:*)", "Bash(go:test)", "Bash(find)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Test All

## Purpose
Comprehensively run all test suites in the project, generate coverage reports, and provide a consolidated quality summary.

## Test Discovery & Execution

### 1. Detect Project Type and Test Framework

```bash
# Check for test configuration files to identify framework
!find . -maxdepth 2 -type f \( \
  -name "package.json" \
  -o -name "pytest.ini" \
  -o -name "setup.cfg" \
  -o -name "tox.ini" \
  -o -name "pom.xml" \
  -o -name "Cargo.toml" \
  -o -name "go.mod" \
  -o -name "gradle.build" \
  \) | head -10

# Identify test directory structure
!find . -type d -name "__tests__" -o -name "tests" -o -name "test" | head -5
```

### 2. Run All Test Suites

#### JavaScript/Node.js (npm/yarn)
```bash
# Run all tests with coverage
!npm test -- --coverage --passWithNoTests

# If jest config exists
!npm run test:unit 2>/dev/null && npm run test:integration 2>/dev/null && npm run test:e2e 2>/dev/null

# Run with detailed output
!npm test -- --verbose --coverage
```

#### Python (pytest)
```bash
# Run all tests with coverage
!pytest --cov=. --cov-report=term-missing --cov-report=html -v

# Run different test markers
!pytest -m "unit" --cov=. -v 2>/dev/null
!pytest -m "integration" --cov=. -v 2>/dev/null
!pytest -m "e2e" --cov=. -v 2>/dev/null
```

#### Java/Maven
```bash
# Run all tests with coverage
!mvn clean test jacoco:report

# Run specific test suites
!mvn test -Dtest=UnitTests 2>/dev/null
!mvn test -Dtest=IntegrationTests 2>/dev/null
```

#### Rust (cargo)
```bash
# Run all tests
!cargo test --all

# Run with coverage (if tarpaulin installed)
!cargo tarpaulin --out Html --output-dir coverage 2>/dev/null

# Run integration tests
!cargo test --test '*' 2>/dev/null
```

#### Go
```bash
# Run all tests with coverage
!go test -v -coverprofile=coverage.out ./...

# Generate HTML coverage report
!go tool cover -html=coverage.out -o coverage.html 2>/dev/null
```

### 3. Analyze Test Results

```bash
# Compile test results from various sources
UNIT_TESTS=$(npm test -- --listTests 2>/dev/null | wc -l || pytest --collect-only -q 2>/dev/null | wc -l)
PASSING=$(grep -c "PASSED\|✓\|ok" test-results.txt 2>/dev/null || echo "0")
FAILING=$(grep -c "FAILED\|✗\|FAIL" test-results.txt 2>/dev/null || echo "0")

# Get coverage percentages
COVERAGE=$(grep -oP 'Statements\s+:\s+\K[0-9.]+' coverage-summary.json 2>/dev/null || echo "N/A")
```

### 4. Generate Comprehensive Test Report

Create **TEST_RESULTS.md**:

```markdown
# Test Results Report

**Report Generated**: [ISO 8601 timestamp]
**Project**: [Project Name]
**Duration**: [X.XXs]

---

## 📊 Summary

| Metric | Result | Target | Status |
|--------|--------|--------|--------|
| Total Tests | [N] | N/A | ℹ️ |
| Tests Passed | [N] | 100% | ✅ / ❌ |
| Tests Failed | [N] | 0 | ✅ / ❌ |
| Tests Skipped | [N] | 0 | ✅ / ⚠️ |
| **Pass Rate** | **[X]%** | **100%** | **✅ / ❌** |

---

## 🧪 Test Coverage

### Overall Coverage
| Type | Coverage | Target | Status |
|------|----------|--------|--------|
| **Statements** | **[X]%** | **80%** | ✅ / ⚠️ / ❌ |
| **Branches** | **[X]%** | **75%** | ✅ / ⚠️ / ❌ |
| **Functions** | **[X]%** | **80%** | ✅ / ⚠️ / ❌ |
| **Lines** | **[X]%** | **80%** | ✅ / ⚠️ / ❌ |

### Coverage by Component

| Component | Statements | Branches | Functions | Lines | Coverage |
|-----------|-----------|----------|-----------|-------|----------|
| src/auth | 95% | 92% | 96% | 95% | ✅ 94.7% |
| src/api | 87% | 84% | 89% | 87% | ⚠️ 86.7% |
| src/utils | 91% | 88% | 93% | 91% | ✅ 90.7% |
| src/models | 78% | 71% | 80% | 78% | ❌ 76.7% |

### Uncovered Code

**High Priority** (Core functionality not tested):
- src/models/User.js, lines 45-52: [Description]
- src/auth/tokens.js, lines 120-135: [Description]

**Medium Priority** (Edge cases):
- src/utils/helpers.js, lines 200-210: [Description]

**Low Priority** (Error handling):
- src/api/errors.js, lines 35-45: [Description]

---

## ✅ Test Suite Results

### Unit Tests: [N] tests
**Duration**: [X.XXs]
**Status**: ✅ ALL PASSED / ❌ [N] FAILED

```
✅ auth/authentication.test.js         15 passed in 1.23s
✅ auth/tokens.test.js                 8 passed in 0.54s
✅ models/user.test.js                 12 passed in 0.89s
✅ utils/validators.test.js            9 passed in 0.67s
✅ utils/helpers.test.js               11 passed in 0.72s
```

**Top 5 Slowest Tests**:
1. auth/oauth.test.js (2.34s)
2. models/user.test.js (1.23s)
3. api/endpoints.test.js (0.98s)
4. utils/validators.test.js (0.87s)
5. auth/tokens.test.js (0.76s)

### Integration Tests: [N] tests
**Duration**: [X.XXs]
**Status**: ✅ ALL PASSED / ❌ [N] FAILED

```
✅ api/users-integration.test.js       6 passed in 2.10s
✅ api/auth-integration.test.js        5 passed in 1.87s
✅ database/migrations.test.js         4 passed in 3.45s
```

### End-to-End Tests: [N] tests
**Duration**: [X.XXs]
**Status**: ✅ ALL PASSED / ❌ [N] FAILED / ⏭️ [N] SKIPPED

```
✅ flows/user-registration.e2e.js      1 passed in 5.23s
✅ flows/login-logout.e2e.js           1 passed in 3.87s
⏭️ flows/oauth-flow.e2e.js             1 skipped (requires external service)
```

---

## ❌ Failed Tests (if any)

### Failed Test #1: [Test Name]
**File**: src/__tests__/auth.test.js:145
**Duration**: 0.34s
**Error**:
```
AssertionError: expected 'password123' to be encrypted
  at Context.<anonymous> (src/__tests__/auth.test.js:145:12)
```

**Root Cause**: Password hashing not applied in flow
**Impact**: Critical - security vulnerability
**Fix**: Apply bcrypt hashing before storage

---

## ⚠️ Warnings & Issues

### Slow Tests (> 1 second)
- database/migrations.test.js (3.45s) - Consider mocking external DB calls
- flows/user-registration.e2e.js (5.23s) - Long E2E expected, but optimize if possible

### Coverage Gaps
- src/models/User.js: 78% (Below 80% target) - Add tests for edge cases
- src/api/errors.js: 72% (Below 80% target) - Add error scenario tests

### Tests to Review
- [Test]: Flaky behavior detected - sometimes passes, sometimes fails
- [Test]: Depends on specific timing - may fail in CI

---

## 📈 Trend Analysis

### Historical Coverage
- Last Run (1 day ago): 87.3%
- Week Ago: 85.6%
- Month Ago: 82.1%

**Trend**: ✅ Improving (+2.2% this week)

### Test Count Growth
- Last Run: 85 tests
- Week Ago: 82 tests
- Month Ago: 76 tests

**Trend**: ✅ Growing (+9 tests this month)

---

## 🎯 Recommendations

### Immediate Actions
1. ❌ [CRITICAL] Fix failing test: [Test Name] in [file]
2. ⚠️ [HIGH] Improve coverage in src/models/ to 85%+
3. ⚠️ [MEDIUM] Optimize slow test in database/migrations

### Short-Term Improvements
- Add integration tests for OAuth flow
- Implement mocking for external API calls
- Add E2E tests for user workflows

### Long-Term Goals
- Maintain 90%+ statement coverage
- Achieve 85%+ branch coverage
- Keep test suite under 60 seconds total runtime

---

## 📋 Environment & Configuration

**Node/Python/Java Version**: [Version]
**Test Framework**: [Jest/Pytest/JUnit/etc]
**Coverage Tool**: [Tool name]
**CI/CD**: [Pipeline name]

**Test Configuration Files**:
- jest.config.js
- pytest.ini
- coverage.rc

---

## 📞 Quick Actions

### Re-run Specific Test Suite
```bash
npm test -- --testPathPattern="auth"
pytest tests/test_auth.py -v
mvn test -Dtest=AuthTests
```

### Generate HTML Coverage Report
```bash
npm run coverage:report
pytest --cov=. --cov-report=html
mvn jacoco:report
```

### Debug Failed Test
```bash
npm test -- --testNamePattern="failing test name" --verbose
pytest -vv tests/test_file.py::test_name
mvn test -Dtest=TestClass#testMethod
```

---

**Full Report Generated**: [Timestamp]  
**Next Test Run**: [Scheduled time]  
**Reporting Issues**: [Link to testing guide]

---
```

### 5. Display Test Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║            ALL TESTS EXECUTED                      ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]

SUMMARY:
  Unit Tests:        [N] passed, [N] failed
  Integration Tests: [N] passed, [N] failed
  E2E Tests:         [N] passed, [N] failed
  Total:             [N] passed, [N] failed ✅ / ❌

COVERAGE:
  Statements: [X]% (Target: 80%) ✅ / ❌
  Branches:   [X]% (Target: 75%) ✅ / ❌
  Functions:  [X]% (Target: 80%) ✅ / ❌
  Lines:      [X]% (Target: 80%) ✅ / ❌

DURATION: [X.XXs]

RECOMMENDATIONS:
  [If issues detected, list top recommendations]

Full Report: TEST_RESULTS.md
Coverage Report: coverage/index.html

NEXT STEPS:
  ✅ All tests pass - Ready for PR
  ❌ Tests failing - Fix before PR
  ⚠️ Coverage low - Add tests before PR
```

## Quality Gates

- ✅ **All Tests Pass**: 100% pass rate required
- ✅ **Coverage Threshold**: Default 80%+ (configurable)
- ⚠️ **No Regressions**: Coverage shouldn't decrease
- ✅ **Reasonable Duration**: Target < 2 minutes total

## Key Features

- **Multi-Framework**: Detects and runs JavaScript, Python, Java, Rust, Go tests
- **Comprehensive Coverage**: Statement, branch, function, and line coverage
- **Component Analysis**: Shows coverage by module/component
- **Trend Tracking**: Historical coverage and test count
- **Actionable Insights**: Specific recommendations for improvement
- **Detailed Reporting**: Pass/fail breakdown with timing analysis

## When to Use /test-all

- After implementing a feature
- Before creating a PR
- Before production deployment
- In CI/CD pipeline as quality gate
- As part of release validation
- When refactoring to ensure no regressions