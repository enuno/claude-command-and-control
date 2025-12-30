---
description: "Run all available linters and auto-formatters, repairing common style and syntax issues in one step. Prevents style drift and CI warnings."
allowed-tools: ["Read", "Search", "Edit", "Lint", "Format", "Bash(npm:*)", "Bash(pip:*)", "Bash(mvn:*)", "Bash(cargo:*)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Lint Fixes

## Purpose
Automatically detect and fix code style, formatting, and syntax issues across the entire project in a single command.

## Linting & Formatting Steps

### 1. Detect Project Type and Tools

```bash
# Check for linter/formatter configuration files
!find . -maxdepth 2 -type f \( \
  -name ".eslintrc*" \
  -o -name "prettier.config.*" \
  -o -name "setup.cfg" \
  -o -name "pyproject.toml" \
  -o -name ".pylintrc" \
  -o -name "pom.xml" \
  -o -name "Cargo.toml" \
  -o -name ".golangci.yml" \
  \) | head -10

# Identify package manager and installed linters
!cat package.json 2>/dev/null | grep -A5 '"devDependencies"'
```

### 2. Run Project-Specific Linters and Formatters

#### JavaScript/TypeScript (npm/yarn)
```bash
# Run ESLint with auto-fix
!npm run lint -- --fix 2>/dev/null || npx eslint . --fix 2>/dev/null

# Run Prettier formatter
!npm run format 2>/dev/null || npx prettier --write . 2>/dev/null

# Run TypeScript compiler (if present)
!npx tsc --noEmit 2>/dev/null

# Run StyleLint for CSS/SCSS (if present)
!npx stylelint --fix "**/*.{css,scss}" 2>/dev/null
```

#### Python
```bash
# Run Black formatter
!black . --line-length 100 2>/dev/null

# Run isort for import sorting
!isort . --profile black 2>/dev/null

# Run autopep8 or autopep8
!autopep8 --in-place --aggressive --aggressive -r . 2>/dev/null

# Run pylint or flake8 with warnings
!flake8 . --statistics --max-line-length=100 2>/dev/null

# Run mypy for type checking
!mypy . --ignore-missing-imports 2>/dev/null
```

#### Java/Kotlin
```bash
# Run Maven formatting plugins
!mvn spotless:apply 2>/dev/null

# Run Checkstyle with auto-fix (if configured)
!mvn checkstyle:check 2>/dev/null

# Run formatter
!mvn fmt:format 2>/dev/null
```

#### Rust
```bash
# Run Rust formatter
!cargo fmt --all 2>/dev/null

# Run Clippy linter
!cargo clippy --fix --all-targets --all-features 2>/dev/null
```

#### Go
```bash
# Run gofmt formatter
!gofmt -s -w . 2>/dev/null

# Run goimports
!goimports -w . 2>/dev/null

# Run golangci-lint
!golangci-lint run --fix 2>/dev/null
```

### 3. Universal Checks

```bash
# Remove trailing whitespace from all files
!find . -type f \( -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.go" \) \
  -exec sed -i 's/[[:space:]]*$//' {} +

# Ensure files end with newline
!find . -type f \( -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.go" \) \
  -exec sh -c 'tail -c 1 "$1" | xxd -p | grep -q 0a || echo >> "$1"' _ {} \;

# Check for tab characters and replace with spaces (where appropriate)
# (Only in code files, not Makefiles)
!find . -type f \( -name "*.js" -o -name "*.py" -o -name "*.java" \) \
  -exec sed -i 's/\t/    /g' {} + 2>/dev/null
```

### 4. Generate Linting Report

Create **LINT_REPORT.md**:

```markdown
# Linting & Formatting Report

**Report Generated**: [ISO 8601 timestamp]
**Project**: [Project Name]

---

## 📋 Summary

| Tool | Status | Issues Found | Fixed | Remaining |
|------|--------|--------------|-------|-----------|
| ESLint | ✅ Completed | 23 | 22 | 1 |
| Prettier | ✅ Completed | 15 | 15 | 0 |
| Flake8 | ✅ Completed | 8 | 8 | 0 |
| TypeScript | ⚠️ Warnings | 3 | 0 | 3 |

**Overall Status**: ✅ PASSED / ⚠️ WARNINGS / ❌ FAILED

---

## ✅ Auto-Fixed Issues

### ESLint Fixes (22/23 fixed)
- [Rule]: [Count] occurrences
  - unused-vars: 8 fixed
  - no-console: 5 fixed
  - semi: 9 fixed

### Prettier Formatting (15/15 fixed)
- Line length violations: 8 fixed
- Indentation: 4 fixed
- Quote style: 3 fixed

### Flake8 Fixes (8/8 fixed)
- E501 line too long: 5 fixed
- E303 too many blank lines: 3 fixed

---

## ⚠️ Remaining Issues (Manual Review Required)

### High Priority Issues

**ESLint - Unused Variable** (1 remaining)
```
File: src/utils/helpers.js, Line 45
Error: unused-variable - 'tempVar' is assigned a value but never used
Fix: Remove unused variable or use it
```

### TypeScript Type Errors (3 warnings)

```
File: src/types/user.ts, Line 12
Warning: Type 'string | null' is not assignable to type 'string'
Suggestion: Add null check or use optional chaining
```

---

## 📊 Code Quality Metrics

### Before Fixes
- Style violations: 46
- Formatting issues: 15
- Complex functions: 3
- Duplicate code: 2

### After Fixes
- Style violations: 1 ✅ (97.8% improvement)
- Formatting issues: 0 ✅ (100% fixed)
- Complex functions: 3 ⚠️ (No change)
- Duplicate code: 2 ⚠️ (No change)

---

## 📝 Files Changed

### Modified Files
- src/utils/helpers.js (12 fixes)
- src/api/handlers.js (8 fixes)
- src/models/user.js (7 fixes)
- src/auth/middleware.js (5 fixes)
- tests/auth.test.js (4 fixes)

### Total Changes
- **Files Modified**: 12
- **Lines Changed**: [+X] additions, [-Y] deletions
- **Total Issues Fixed**: 48

---

## 🎯 Recommendations

### Immediate Action
1. Review the 1 remaining ESLint violation in src/utils/helpers.js
2. Fix TypeScript type warnings in src/types/user.ts
3. Commit all auto-fixes

### Preventive Measures
- Configure pre-commit hooks to run linting
- Set up CI/CD to fail on linting errors
- Increase complexity detection threshold
- Add code duplication scanning

### Best Practices
- Use `npm run lint:fix` before each commit
- Run full linting as part of PR process
- Review linting configuration regularly
- Update linter/formatter rules as standards evolve

---

## 🔧 Tools & Configuration

**Active Tools**:
- ESLint v8.x with @airbnb config
- Prettier v3.x (80-char line length)
- Flake8 with Black compatibility
- TypeScript strict mode

**Configuration Files**:
- .eslintrc.json
- .prettierrc
- setup.cfg
- tsconfig.json

---

## 📞 Next Steps

### To Review & Commit Fixes
```bash
# See what changed
git diff --stat

# Review specific changes
git diff src/utils/helpers.js

# Commit all fixes
git add .
git commit -m "fix: auto-format and lint fixes

- ESLint: Fixed 22 style violations
- Prettier: Fixed 15 formatting issues
- Flake8: Fixed 8 PEP8 violations

1 remaining issue requires manual review."
```

### To Run Linting Again
```bash
/lint-fixes
```

### To Run Only Specific Linters
```bash
npm run lint -- --fix              # ESLint only
npm run format                      # Prettier only
black . && isort .                 # Python formatting
```

---

**Report Generated**: [Timestamp]  
**All Fixes Applied**: [Total count]  
**Ready for Commit**: ✅ / ⚠️ / ❌

---
```

### 5. Display Linting Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║         LINTING & FORMATTING COMPLETE              ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]

FIXES APPLIED:
  ✅ ESLint:    22 issues fixed, 1 remaining
  ✅ Prettier:  15 formatting fixes
  ✅ Flake8:    8 PEP8 violations fixed
  ✅ Black:     12 formatting fixes

SUMMARY:
  Total Issues Found: 48
  Total Fixed: 47 (97.9%)
  Remaining (manual): 1

FILES MODIFIED:
  src/utils/helpers.js        (12 fixes)
  src/api/handlers.js         (8 fixes)
  src/models/user.js          (7 fixes)
  src/auth/middleware.js      (5 fixes)
  tests/auth.test.js          (4 fixes)

RECOMMENDATIONS:
  ⚠️ Review: ESLint unused-vars in src/utils/helpers.js:45
  ℹ️ Commit: Run git add . && git commit -m "fix: linting"

Ready for review. Full report: LINT_REPORT.md
```

## Auto-Fix Capabilities

- **Automatic**: Remove unused variables, fix formatting, sort imports
- **Semi-Automatic**: Suggest fixes user must review
- **Manual**: Requires developer review (complex logic changes)

## Quality Gates

- ✅ **No Critical Issues**: All critical/error-level issues fixed
- ✅ **Standard Formatting**: All files formatted consistently
- ⚠️ **Warnings**: May proceed but should review
- ❌ **Errors**: Must fix before proceeding

## Key Features

- **Multi-Language Support**: JavaScript, Python, Java, Rust, Go
- **Comprehensive**: Linting + formatting + type checking
- **Auto-Fix**: Automatically repairs most common issues
- **Detailed Reporting**: Clear explanation of what was fixed
- **Pre-commit Ready**: Output safe to commit immediately
- **CI/CD Integration**: Can be used in automated pipelines

## When to Use /lint-fixes

- After implementing a feature
- Before creating a PR
- When joining an existing project
- As part of standard development workflow
- Before production deployment
- In CI/CD pipeline as quality gate
- After merging conflicting branches