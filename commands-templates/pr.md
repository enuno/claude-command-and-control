---
description: "Streamline the pull request process: run lint, tests, summarize changes, generate a PR description, and post the link. Ensures standardization before code review."
allowed-tools: ["Read", "Search", "Edit", "Test", "Lint", "Format", "Bash(git:*)", "Bash(npm:*)", "Bash(pip:*)", "Bash(mvn:*)", "Bash(cargo:*)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# PR

## Purpose
Streamline and standardize the pull request creation process by automating quality checks, change summarization, and PR documentation.

## PR Creation Steps

### 1. Pre-Flight Checks

```bash
# Ensure on a feature branch (not main/master)
!git branch --show-current
# Should be: feature/*, bugfix/*, hotfix/*, or similar (NOT main)

# Check for uncommitted changes
!git status --porcelain
# If changes exist, user must commit first

# Verify branch tracking
!git rev-parse --abbrev-ref --symbolic-full-name @{u}
# Should show: origin/[feature-branch]
```

### 2. Run Automated Quality Checks

#### Linting & Formatting
```bash
# Detect project type and run appropriate linter
# JavaScript/Node.js
!npm run lint 2>/dev/null

# Python
!flake8 . 2>/dev/null

# Java/Kotlin
!mvn checkstyle:check 2>/dev/null

# Rust
!cargo clippy 2>/dev/null

# Go
!gofmt -l . 2>/dev/null
```

#### Run Tests
```bash
# JavaScript
!npm test 2>/dev/null

# Python
!pytest 2>/dev/null

# Java/Maven
!mvn test 2>/dev/null

# Rust
!cargo test 2>/dev/null

# Go
!go test ./... 2>/dev/null
```

#### Generate Coverage Report
```bash
# JavaScript/Node.js
!npm run coverage 2>/dev/null

# Python
!pytest --cov 2>/dev/null

# Java/Maven
!mvn jacoco:report 2>/dev/null
```

### 3. Analyze Changes

```bash
# Get target branch (usually main or develop)
TARGET_BRANCH="main"  # or "develop" depending on workflow

# Show summary of changes
!git diff --stat origin/$TARGET_BRANCH...HEAD

# Show commit log
!git log origin/$TARGET_BRANCH...HEAD --oneline

# List changed files with type
!git diff --name-status origin/$TARGET_BRANCH...HEAD
```

### 4. Generate PR Description

Create comprehensive PR description:

```markdown
# PR Description

## Summary
[1-2 sentence summary of what this PR accomplishes]

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring
- [ ] Chore (build, dependencies, configuration)

## What Changed
[Description of the changes made, including:
- What code was modified
- Why these changes were necessary
- How the changes work]

## Related Issues
Fixes #[issue number]
Relates to #[issue number]

## Testing
- [ ] Added/updated unit tests
- [ ] Added/updated integration tests
- [ ] Added/updated end-to-end tests
- [ ] Tested locally and verified working
- [ ] Test coverage: [X]%

## Testing Instructions
```
[Steps to test this feature/fix]

1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected result: [What should happen]
```

## Checklist
- [ ] Code follows style guidelines of this project
- [ ] Self-review completed and code looks good
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] No breaking changes (or documented if breaking)
- [ ] Branch is up to date with target branch

## Performance Impact
- [ ] No performance impact
- [ ] Performance improvement (describe metrics)
- [ ] Performance regression analyzed and acceptable (explain)

## Deployment Notes
[Any special deployment steps, database migrations, env variables, etc.]

## Screenshots/Recordings (if applicable)
[Add images or videos showing the change in action]

## Migration Guide (if breaking change)
[Steps for teams/users to migrate to new behavior]

---

**Files Changed**: [Count]
**Lines Added**: [+Count]
**Lines Deleted**: [-Count]
```

### 5. Prepare Branch and Create PR

```bash
# Ensure up to date with target branch
!git fetch origin

# Rebase on target branch if behind
!git rebase origin/$TARGET_BRANCH

# Push to remote
!git push origin $(git branch --show-current)

# Create PR using GitHub CLI
!gh pr create \
  --title "[Type]: Brief description" \
  --body "$(cat PR_TEMPLATE.md)" \
  --base main \
  --head $(git branch --show-current) \
  --draft false

# OR create PR using GitLab CLI
!gitlab project-member create --project-id . --username reviewer-name
```

### 6. Display PR Summary

Show formatted confirmation:

```
╔════════════════════════════════════════════════════╗
║         PULL REQUEST CREATED SUCCESSFULLY          ║
╚════════════════════════════════════════════════════╝

PR TITLE: [feature-name]: Brief description
PR NUMBER: #[number]
BRANCH: feature/[name] → main
URL: https://github.com/org/repo/pull/[number]

QUALITY CHECKS:
  ✅ Linting: PASSED
  ✅ Tests: PASSED ([N] tests)
  ✅ Coverage: [X]% (Target: 80%+)
  ✅ No conflicts with main branch

CHANGES SUMMARY:
  Files Modified: [N]
  Lines Added: +[X]
  Lines Deleted: -[Y]
  Commits: [N]

NEXT STEPS:
  1. Request reviewers: Use GitHub UI or:
     !gh pr review add #[number] --reviewers [name1],[name2]
  
  2. Wait for code review
  3. Address feedback and push updates
  4. Merge when approved

PR URL: https://github.com/org/repo/pull/[number]
```

### 7. Auto-Add Reviewers (Optional)

```bash
# Request reviewers using project conventions
# (extract from CLAUDE.md or CONTRIBUTORS.md)

!gh pr review add #[PR_NUMBER] \
  --reviewers validator-team,architect-lead \
  --team-reviewers architecture-review
```

## Quality Gates (Must Pass Before PR)

- [ ] **No Linting Errors**: Zero issues
- [ ] **All Tests Pass**: 100% pass rate
- [ ] **Adequate Coverage**: Minimum 80% (configurable)
- [ ] **No Conflicts**: Branch cleanly merges with target
- [ ] **PR Description Complete**: All sections filled out
- [ ] **Commits are Semantic**: Follow conventional commits format
- [ ] **No Secrets**: No API keys, passwords, or private data
- [ ] **Documentation Updated**: If code changes warrant doc updates

## Commit Message Format

Follow conventional commits for better PR summaries:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(auth): add JWT token refresh mechanism

- Implement refresh token endpoint
- Add token expiration validation
- Update authentication middleware
- Add comprehensive tests

Fixes #123
```

## Troubleshooting

### Tests Failing
```
1. Review test output
2. Debug locally: npm test -- --verbose
3. Fix issues in code
4. Commit and push: git push origin [branch]
5. PR automatically updates
```

### Linting Errors
```
1. Auto-fix common issues: npm run lint:fix
2. Review remaining errors
3. Fix manually if needed
4. Commit and push
5. Re-run PR command if needed
```

### Merge Conflicts
```
1. Fetch latest from target branch
2. Rebase: git rebase origin/main
3. Resolve conflicts
4. Push force: git push -f origin [branch]
5. PR automatically resolves
```

## Post-PR Actions

After creating PR:
1. Assign reviewers in GitHub UI
2. Add appropriate labels (bug, feature, documentation, etc.)
3. Link related issues if not auto-detected
4. Watch for CI/CD pipeline results
5. Address feedback promptly
6. Request re-review after changes

## Key Features

- **Automated Quality Checks**: Linting, testing, coverage all validated
- **Semantic PR Description**: Comprehensive, standardized format
- **Multi-Language Support**: Detects and uses appropriate test/lint tools
- **Conflict Detection**: Warns about merge issues early
- **Reviewer Assignment**: Auto-assigns reviewers based on project config
- **Change Summary**: Clear explanation of what changed and why

## When to Use /pr

- After feature/bugfix implementation is complete
- When code is tested locally and passing
- When ready for code review
- Before any production deployment
- To ensure standardized PR quality across team