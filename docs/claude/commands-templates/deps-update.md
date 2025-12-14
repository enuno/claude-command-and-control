---
description: "Reviews all external dependencies or packages, flags outdated or vulnerable ones, and (optionally) proposes safe upgrades."
allowed-tools: ["Read", "Search", "Edit", "Bash(npm:*)", "Bash(pip:*)", "Bash(mvn:*)", "Bash(cargo:*)", "Bash(go:*)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Deps Update

## Purpose
Audit project dependencies for outdated versions, security vulnerabilities, and available upgrades with safety assessment and recommendations.

## Dependency Audit Steps

### 1. Discover Project Type and Package Manager

```bash
# Detect package manager and manifest files
!find . -maxdepth 2 -type f \( \
  -name "package.json" \
  -o -name "package-lock.json" \
  -o -name "requirements.txt" \
  -o -name "Pipfile" \
  -o -name "setup.py" \
  -o -name "pom.xml" \
  -o -name "Cargo.toml" \
  -o -name "go.mod" \
  -o -name "Gemfile" \
  \) 2>/dev/null

# Show current package manager version
!npm --version 2>/dev/null || pip --version 2>/dev/null || mvn --version 2>/dev/null
```

### 2. Analyze Dependencies by Type

#### Node.js (npm/yarn)
```bash
# List all dependencies and their versions
!npm list --all 2>/dev/null || npm ls 2>/dev/null

# Check for outdated packages
!npm outdated --all 2>/dev/null

# Security audit
!npm audit 2>/dev/null

# Detailed vulnerability report
!npm audit --json 2>/dev/null | jq '.vulnerabilities'
```

#### Python (pip)
```bash
# List installed packages
!pip list --outdated 2>/dev/null

# Check for security vulnerabilities
!pip install safety 2>/dev/null && safety check 2>/dev/null

# Check specific requirements file
!pip list -o 2>/dev/null && pip-audit 2>/dev/null
```

#### Java (Maven)
```bash
# Check for dependency updates
!mvn versions:display-dependency-updates 2>/dev/null

# Check for plugin updates
!mvn versions:display-plugin-updates 2>/dev/null

# OWASP dependency check
!mvn org.owasp:dependency-check-maven:check 2>/dev/null
```

#### Rust (Cargo)
```bash
# Check for outdated dependencies
!cargo outdated 2>/dev/null

# Security audit
!cargo audit 2>/dev/null

# Show dependency tree
!cargo tree 2>/dev/null
```

#### Go (go mod)
```bash
# List dependencies
!go list -m all 2>/dev/null

# Check for updates
!go list -u -m all 2>/dev/null

# Security scanning (using nancy)
!nancy sleuth 2>/dev/null
```

### 3. Categorize and Risk-Assess

Classify dependencies as:
- **Direct Dependencies**: Explicitly required by project
- **Transitive Dependencies**: Required by other dependencies
- **Outdated**: New versions available
- **Vulnerable**: Known security issues
- **Abandoned**: No longer maintained

### 4. Generate Dependency Report

Create **DEPENDENCY_REPORT.md**:

```markdown
# Dependency Audit Report

**Report Generated**: [ISO 8601 timestamp]
**Project**: [Project Name]
**Package Manager**: [npm/pip/maven/cargo/etc]
**Last Updated**: [Date dependencies were last updated]

---

## 🎯 Executive Summary

| Category | Count | Status | Action |
|----------|-------|--------|--------|
| Total Dependencies | [N] | ℹ️ | - |
| Direct | [N] | ℹ️ | - |
| Transitive | [N] | ℹ️ | - |
| **Critical Vulnerabilities** | **[N]** | **🔴** | **URGENT** |
| **High Vulnerabilities** | **[N]** | **🟠** | **High Priority** |
| **Outdated (Major)** | **[N]** | **🟡** | **Should Update** |
| **Outdated (Minor)** | **[N]** | **🟢** | **Can Update** |
| **Up to Date** | **[N]** | **✅** | - |

**Overall Status**: 🟢 HEALTHY / 🟡 CAUTION / 🔴 CRITICAL

---

## 🔴 Critical Security Vulnerabilities

### Vulnerability #1: [Package Name]
- **Severity**: CRITICAL
- **Current Version**: [Version]
- **Vulnerable Range**: [Version range]
- **Fixed Version**: [Version]
- **CVE**: [CVE ID]
- **Description**: [Vulnerability description]
- **Risk**: [Potential impact]
- **Action Required**: IMMEDIATE UPDATE

**Update Command**:
\`\`\`bash
npm update [package-name]
# or
npm install [package-name]@[fixed-version]
\`\`\`

---

### Vulnerability #2: [Package Name]
[Same structure as above]

---

## 🟠 High-Priority Vulnerabilities

### Vulnerability #1: [Package Name]
- **Severity**: HIGH
- **Current Version**: [Version]
- **Fixed Version**: [Version]
- **CVE**: [CVE ID]
- **Description**: [Vulnerability description]

**Update Command**:
\`\`\`bash
npm install [package-name]@[fixed-version]
\`\`\`

---

## 🟡 Outdated Dependencies (Major Version Available)

| Package | Current | Latest | Type | Breaking Changes | Risk |
|---------|---------|--------|------|------------------|------|
| [Name] | 1.x | 3.x | Major | Yes | High |
| [Name] | 4.x | 5.x | Major | Yes | Medium |
| [Name] | 2.x | 4.x | Major | No | Low |

### Recommended Updates (Major Versions)

**Package #1: [Name]**
- Current: 1.2.3
- Latest: 3.0.0
- Change: Major version (breaking changes)
- Recommended: Yes, when major refactoring planned
- Risk: High (requires code changes)

**Migration Steps**:
1. Read changelog: [Link]
2. Check breaking changes: [List]
3. Update: \`npm install [package]@3\`
4. Test thoroughly
5. Fix compatibility issues

---

## 🟢 Outdated Dependencies (Minor/Patch Available)

| Package | Current | Latest | Update Type |
|---------|---------|--------|-------------|
| [Name] | 2.4.0 | 2.5.1 | Minor |
| [Name] | 1.2.0 | 1.2.5 | Patch |

**Safe to update immediately** (no breaking changes expected):
\`\`\`bash
npm update
\`\`\`

---

## ✅ Up to Date Dependencies

[List of N dependencies that are current]

---

## 📊 Dependency Statistics

### By Type
```
Production Dependencies:    [N]
Development Dependencies:   [N]
Transitive Dependencies:    [N]
```

### By Age
| Age | Count | Average Version |
|-----|-------|-----------------|
| 0-6 months | [N] | Latest |
| 6-12 months | [N] | Current |
| 1-2 years | [N] | Slightly behind |
| 2+ years | [N] | Outdated |

### Vulnerabilities Over Time
```
[Chart description or data]
Critical:  [N] this month, [N] last quarter
High:      [N] this month, [N] last quarter
Medium:    [N] this month, [N] last quarter
```

---

## 🔧 Update Strategy

### Phase 1: Emergency (Complete Today)
- [ ] Update critical security vulnerabilities
- [ ] Run test suite
- [ ] Deploy to staging
- [ ] Verify functionality
- **Time Estimate**: 1-2 hours

### Phase 2: High Priority (Complete This Week)
- [ ] Update high-severity vulnerabilities
- [ ] Update outdated major versions with critical fixes
- [ ] Test in staging
- [ ] Merge to main
- **Time Estimate**: 2-4 hours

### Phase 3: Maintenance (Schedule for Sprint)
- [ ] Update minor version outdates
- [ ] Update patch versions
- [ ] Review and merge PR
- **Time Estimate**: 1 hour per update

### Phase 4: Future (Plan Ahead)
- [ ] Monitor for new vulnerabilities
- [ ] Schedule quarterly dependency updates
- [ ] Evaluate new major versions for adoption
- **Frequency**: Monthly or quarterly

---

## 🛡️ Security Scanning Tools

### Tools Configured
- [npm audit](https://docs.npmjs.com/cli/audit) - Built-in npm vulnerability scanner
- [Snyk](https://snyk.io/) - Advanced vulnerability detection
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/) - Multi-language scanning
- [GitHub Security](https://github.com/features/security) - Automated alerts

### Recent Scans
- Last scan: [Date and time]
- Vulnerability trend: [Improving / Stable / Degrading]
- Next scheduled scan: [Date]

---

## 📋 Update Commands

### Update All Safe Packages
\`\`\`bash
npm update
\`\`\`

### Update Specific Package
\`\`\`bash
npm install [package-name]@[version]
\`\`\`

### Fix Critical Vulnerabilities Only
\`\`\`bash
npm audit fix --force
\`\`\`

### Check What Would be Updated
\`\`\`bash
npm outdated
\`\`\`

### Full Audit Report
\`\`\`bash
npm audit --json
\`\`\`

---

## ⚠️ Known Issues & Considerations

### Potential Breaking Changes
- [Package X]: Version 3.0 changed API - requires code updates
- [Package Y]: Deprecation notice - plan for replacement

### Compatibility Concerns
- [Package Z] incompatible with [Other Package] version
- [Package] requires Node 18+ (current: 16)

### Performance Implications
- [Package] upgrade may improve performance by ~15%
- [Package] upgrade may increase bundle size by ~20%

---

## 🎯 Recommendations

### Immediate Actions (Do Today)
1. **Critical Vulnerabilities**: Update [Package 1], [Package 2]
   - Expected time: 30 minutes
   - Risk: Low (security patches)
   - Command: \`npm install [package]@latest\`

2. **High Vulnerabilities**: Update [Package 3]
   - Expected time: 1 hour (may require tests)
   - Risk: Medium (minor version update)

### Short-Term (This Week)
1. Update outdated minor versions: [List]
   - Time: 2-4 hours
   - Test coverage needed: Full suite
   - Risk: Low (backward compatible)

### Long-Term (Next Month)
1. Plan major version upgrades:
   - [Package]: 1.x → 2.x (review changelog)
   - [Package]: 2.x → 3.x (breaking changes)
   - Estimated effort: 1-2 sprints

---

## 📞 Deployment Plan

### Testing Before Update
- [ ] Run full test suite
- [ ] Test in staging environment
- [ ] Verify no breaking changes
- [ ] Check performance impact

### Deployment Steps
1. Create feature branch: \`git checkout -b deps/update\`
2. Update dependencies
3. Run tests and commit
4. Create PR
5. Code review and merge
6. Deploy to production

### Rollback Plan
If issues occur:
1. Revert commit: \`git revert\`
2. Deploy previous version
3. Document issue
4. Create follow-up task

---

## 📅 Dependency Maintenance Schedule

- **Weekly**: Check for critical vulnerabilities
- **Monthly**: Run full dependency audit
- **Quarterly**: Plan major version upgrades
- **Annually**: Evaluate technology choices

---

**Report Generated**: [Timestamp]  
**Next Audit**: [Scheduled date]  
**Maintainer**: [Team/Person]  
**Status**: [Last updated, changes made]

---
```

### 5. Display Dependency Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║        DEPENDENCY AUDIT COMPLETED                  ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]
PACKAGE MANAGER: npm/pip/maven/cargo

DEPENDENCY OVERVIEW:
  Total Dependencies: [N]
    - Direct: [N]
    - Transitive: [N]

SECURITY STATUS:
  🔴 Critical: [N] - URGENT ACTION REQUIRED
  🟠 High: [N] - Update this week
  🟡 Medium: [N] - Schedule for next sprint
  🟢 Low: [N] - Monitor and update

OUTDATED PACKAGES:
  Major Updates Available: [N]
  Minor Updates Available: [N]
  Patch Updates Available: [N]

TOP PRIORITIES:
  1. 🔴 [Package] - Critical vulnerability, update now
  2. 🔴 [Package] - Critical vulnerability, update now
  3. 🟠 [Package] - High priority, update this week

SAFE TO UPDATE:
  ✅ [N] packages have no breaking changes

RECOMMENDED ACTIONS:

  Immediate (1-2 hours):
    npm install [package]@latest
    npm install [package]@latest

  This Week (2-4 hours):
    npm update

  Schedule for Sprint:
    Review major version upgrades

Full Report: DEPENDENCY_REPORT.md
Time to Complete Updates: ~[X] hours
```

## Key Features

- **Multi-Language**: Supports npm, pip, Maven, Cargo, Go
- **Vulnerability Scanning**: Detects security issues with CVE data
- **Version Analysis**: Identifies outdated and available upgrades
- **Risk Assessment**: Categorizes by severity and breaking changes
- **Safe Recommendations**: Suggests backward-compatible updates first
- **Detailed Report**: Comprehensive DEPENDENCY_REPORT.md
- **Update Strategy**: Phased approach to minimize risk
- **Audit Trail**: Tracks dependency changes over time

## Vulnerability Severity Levels

| Level | Description | Action | Timeframe |
|-------|---|---|---|
| 🔴 Critical | Remote code execution, auth bypass | Update immediately | Hours |
| 🟠 High | Major data breach, significant impact | Update ASAP | Days |
| 🟡 Medium | Moderate security risk | Schedule update | Weeks |
| 🟢 Low | Minor security issue | Monitor | Quarterly |

## When to Use /deps-update

- Weekly security monitoring
- Before deployments
- When receiving security alerts
- Quarterly maintenance windows
- After major framework updates
- Before major releases
- During onboarding to understand tech debt

## Best Practices

1. **Regular Audits**: Run weekly for critical, monthly for full
2. **Test Thoroughly**: Always test updates in staging first
3. **Prioritize Security**: Fix vulnerabilities before features
4. **Update Often**: Easier to update incrementally than in bulk
5. **Document Changes**: Keep changelog of dependency updates
6. **Automate**: Use Dependabot, Snyk, or similar tools
7. **Review Breaking Changes**: Check changelogs before major updates
8. **Monitor Performance**: Ensure updates don't degrade performance