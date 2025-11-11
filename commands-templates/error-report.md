---
description: "When an error, test failure, or build failure occurs, generates a diagnostic report summarizing logs, likely root causes, and suggested next steps."
allowed-tools: ["Read", "Search", "Edit", "Bash(git:log)", "Bash(find)", "Bash(tail)", "Bash(grep)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Error Report

## Purpose
Analyze and diagnose errors, test failures, and build failures by examining logs, identifying root causes, and suggesting actionable solutions.

## Error Diagnosis Steps

### 1. Capture Error Context

Ask user for error details:

```
Error Report Generation

1. What type of error are you experiencing?
   - Build failure
   - Test failure
   - Runtime error
   - Deployment failure
   - Other: [describe]

2. Where did the error occur?
   - During build: !npm run build
   - During tests: !npm test
   - In production
   - In development
   - Location: [specify]

3. When did it start occurring?
   - Just started today
   - Started after recent changes
   - Happens intermittently
   - Happens consistently

4. Paste the error message or logs:
   [User provides error output]

5. Has this error occurred before?
   - Yes (previously solved)
   - No (new error)
   - Not sure
```

### 2. Gather Relevant Context

```bash
# Get recent commits that might have caused the issue
!git log --oneline --since="24 hours ago" -20

# Check current git status
!git status --porcelain

# Look for recent error logs
!find . -name "*.log" -type f -mtime -1 2>/dev/null | head -10

# Check error tracking files
!find . -path node_modules -prune -o -name "*error*" -o -name "*crash*" -o -name "*failed*" | head -20

# Get system/environment info
!node --version 2>/dev/null || python --version 2>/dev/null || java -version 2>&1

# Check dependencies for potential issues
!cat package.json 2>/dev/null | grep -A10 '"dependencies"'
```

### 3. Analyze Error Logs

Examine various log sources:

```bash
# Application logs
!tail -100 logs/application.log 2>/dev/null
!tail -100 logs/error.log 2>/dev/null

# Build logs
!tail -100 build.log 2>/dev/null
!tail -100 npm-debug.log 2>/dev/null

# Test logs
!tail -100 test-results.log 2>/dev/null
!tail -100 coverage/lcov-report/index.html 2>/dev/null

# System logs (if accessible)
!dmesg | tail -50 2>/dev/null
!journalctl -n 50 2>/dev/null
```

### 4. Generate Diagnostic Report

Create **ERROR_REPORT.md**:

```markdown
# Error Diagnostic Report

**Report Generated**: [ISO 8601 timestamp]
**Project**: [Project Name]
**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

---

## 📋 Error Summary

### Error Type
- **Category**: [Build/Test/Runtime/Deployment]
- **Status**: ❌ FAILED / ⏸️ BLOCKED / ⚠️ DEGRADED

### Error Message
```
[Full error message from logs]
```

### Stack Trace
```
[Stack trace if available]
```

### Location
- **File**: [filename]
- **Line**: [line number]
- **Function/Component**: [name]

---

## 🔍 Root Cause Analysis

### Primary Cause
[Best hypothesis for what caused the error]

**Evidence**:
1. [Supporting evidence 1]
2. [Supporting evidence 2]
3. [Supporting evidence 3]

### Contributing Factors
- [Factor 1]: [How it contributed]
- [Factor 2]: [How it contributed]
- [Factor 3]: [How it contributed]

### Related Issues
- Similar error on [date] (Issue #[X])
- Possible connection to [recent change]
- May relate to [external service/dependency]

---

## 🔗 Related Changes

### Recent Git Changes (Last 24 hours)
```
commit [sha]: [message]
- Modified: [files]
- Deleted: [files]
- Added: [files]

commit [sha]: [message]
- Modified: [files]
```

### Dependency Changes
- New dependencies added: [list]
- Updated dependencies: [list]
- Removed dependencies: [list]

---

## 🚑 Quick Fix (Immediate Action)

### Quickest Solution
```
Step 1: [Action]
Step 2: [Action]
Step 3: [Action]
```

**Expected Result**: [What should happen]
**Estimated Time**: [Duration]

### Workaround (If quick fix not available)
```
Temporary fix to keep system operational:
1. [Workaround step 1]
2. [Workaround step 2]
3. [Workaround step 3]
```

**Limitations**: [What this doesn't solve]
**Duration**: [How long this is viable]

---

## 🔧 Detailed Solutions

### Solution 1: [Title]
**Approach**: [Description]

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Testing**:
```bash
[Command to verify fix]
```

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

**Risk Level**: Low / Medium / High

---

### Solution 2: [Title]
[Same structure as Solution 1]

---

## 📊 Impact Assessment

### System Impact
- **Users Affected**: [Count/Percentage]
- **Services Down**: [List services]
- **Data at Risk**: [Assessment]
- **Revenue Impact**: [Estimated impact]

### Timeline
- **When Detected**: [Time]
- **Time to Diagnosis**: [Duration]
- **Estimated Resolution**: [Time]
- **Total Expected Downtime**: [Duration]

---

## 🛡️ Prevention for Future

### Immediate Prevention
1. [Action 1] - Prevents recurrence
2. [Action 2] - Prevents recurrence

### Long-Term Prevention
1. **Add Monitoring**: [What to monitor]
2. **Improve Tests**: [Test cases to add]
3. **Update Documentation**: [What to document]
4. **Process Change**: [How to change process]

### Early Detection
- **Alert Threshold**: [What metric triggers alert]
- **Alert Recipients**: [Who should be notified]
- **Escalation Path**: [Who to contact if not resolved in X minutes]

---

## 📝 Related Resources

### Documentation
- [Relevant doc 1]: [Link/location]
- [Relevant doc 2]: [Link/location]

### Similar Issues
- Issue #[X]: [Title] - [How it relates]
- Issue #[Y]: [Title] - [How it relates]

### External References
- [External resource 1]: [URL]
- [External resource 2]: [URL]

---

## 📞 Escalation Path

### If Quick Fix Works
1. Monitor system for 30 minutes
2. Verify no side effects
3. Document resolution in incident tracking
4. Schedule root cause fix for next sprint

### If Quick Fix Fails
1. Escalate to [Team/On-call]
2. Contact [External vendor] if applicable
3. Prepare rollback procedure
4. Consider production incident declaration

### If Critical
- Page on-call engineer: [Process]
- Notify stakeholders: [Distribution list]
- Begin incident response: [Runbook link]

---

## 🎯 Resolution Checklist

- [ ] Root cause identified
- [ ] Immediate fix applied
- [ ] Testing confirms resolution
- [ ] All affected systems verified operational
- [ ] Workarounds removed (if used)
- [ ] Incident logged and documented
- [ ] Team notified of resolution
- [ ] Post-incident review scheduled
- [ ] Prevention measures implemented
- [ ] Documentation updated

---

**Error Report Generated**: [Timestamp]  
**Next Review**: [Scheduled time]  
**Incident Status**: 🔴 CRITICAL / 🟠 MAJOR / 🟡 MINOR / 🟢 RESOLVED

---
```

### 5. Display Diagnostic Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║         ERROR DIAGNOSTIC REPORT GENERATED          ║
╚════════════════════════════════════════════════════╝

ERROR TYPE: [Category]
SEVERITY: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

ERROR MESSAGE:
  [Summary of error]

ROOT CAUSE:
  [Primary hypothesis]

QUICK FIX:
  1. [Action 1]
  2. [Action 2]
  3. [Action 3]

  Time to implement: ~[X] minutes

AFFECTED:
  Users: [Count/Percentage]
  Services: [List]

ESCALATION NEEDED: ✅ YES / ❌ NO / ⚠️ MAYBE

RESOURCES:
  Full Report: ERROR_REPORT.md
  Similar Issues: [Count] found
  Related Docs: [Count] found

NEXT STEPS:
  1. Implement quick fix
  2. Monitor for issues
  3. Schedule root cause analysis
  4. Prevent recurrence
```

### 6. Provide Command-Specific Diagnostics

Based on error type, run targeted diagnostics:

#### Build Failure
```bash
# Clean and rebuild
!npm cache clean --force 2>/dev/null
!rm -rf node_modules package-lock.json 2>/dev/null
!npm install 2>&1 | tail -50

# Check for dependency issues
!npm audit 2>/dev/null
```

#### Test Failure
```bash
# Run failed test with verbose output
!npm test -- --testNamePattern="[failed test]" --verbose

# Run with debugging
!npm test -- --detectOpenHandles
```

#### Runtime Error
```bash
# Check environment variables
!env | grep -E "NODE_ENV|PORT|DATABASE"

# Check process status
!ps aux | grep node 2>/dev/null || ps aux | grep python 2>/dev/null

# Check port conflicts
!lsof -i :3000 2>/dev/null || netstat -tuln | grep 3000
```

#### Deployment Failure
```bash
# Check deployment logs
!docker logs [container] 2>&1 | tail -100 2>/dev/null
!kubectl logs [pod] 2>&1 | tail -100 2>/dev/null
```

## Key Features

- **Comprehensive Analysis**: Gathers logs, context, and related changes
- **Root Cause Hypothesis**: Identifies most likely cause
- **Multiple Solutions**: Offers quick fix, workaround, and long-term solutions
- **Prevention Strategy**: Suggests how to prevent recurrence
- **Impact Assessment**: Quantifies business and user impact
- **Escalation Guidance**: Clear path for when/how to escalate
- **Audit Trail**: Documents all diagnostic steps taken

## Error Categories

| Category | Examples | Investigation |
|----------|----------|---|
| Build Failure | Compilation errors, missing deps | Check build logs, npm audit |
| Test Failure | Unit/integration/E2E test fails | Run specific test verbose, check recent commits |
| Runtime Error | Crashes, exceptions, timeouts | Check application logs, environment |
| Deployment Failure | Can't reach production | Check deployment logs, networking |
| Performance Degradation | Slow response, high memory | Check monitoring, profiling data |
| Integration Failure | External service unavailable | Check service status, networking |

## When to Use /error-report

- Immediately after discovering an error
- When debugging issues that are hard to reproduce
- Before escalating to management or external teams
- To document root causes for post-incident analysis
- When patterns of similar errors emerge
- As part of incident response process

## Best Practices

1. **Run early**: Diagnose as soon as error is detected
2. **Gather context**: Get full error message and logs
3. **Test solutions**: Verify in dev environment first
4. **Document**: Keep error report for future reference
5. **Communicate**: Share report with relevant teams
6. **Prevent**: Implement changes to prevent recurrence
7. **Follow up**: Schedule post-incident review