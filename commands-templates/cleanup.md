---
description: "Deletes or archives obsolete temporary files, branches, and logs; warns about dangling migrations or unused configs. Keeps the workspace healthy."
allowed-tools: ["Read", "Search", "Edit", "Bash(git:*)", "Bash(find)", "Bash(rm)", "Bash(mv)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Cleanup

## Purpose
Remove obsolete artifacts, temporary files, unused branches, stale logs, and dangling configurations to keep the workspace clean and efficient.

## Pre-Cleanup Checks

```bash
# Ensure on a safe branch (not during active work)
!git branch --show-current

# Show uncommitted changes
!git status --porcelain

# Get disk usage before cleanup
!du -sh . 2>/dev/null || ls -lah
```

**⚠️ Safety Check**: 
- If on feature branch with uncommitted changes, ask user to commit/stash first
- If workspace appears to have active work, confirm cleanup is safe

## Cleanup Categories

### 1. Remove Obsolete Git Branches

```bash
# List all branches (local and remote)
!git branch -a

# List branches last committed before 30 days ago
!git branch --merged main --sort=-committerdate | grep -v main

# Show branches that can be safely deleted
!git branch --no-merged main
```

**Action: Prompt user before deleting**

```markdown
# Obsolete Branches to Remove

Safe to Delete (already merged):
- feature/old-feature-1 (merged 45 days ago)
- bugfix/issue-123 (merged 60 days ago)
- experiment/new-ui (merged 30 days ago)

May Still Be Needed (not merged):
- wip/incomplete-feature (not merged, last commit 20 days ago)
- experimental/new-api (not merged, last commit 5 days ago)

Action:
1. Review safe-to-delete list
2. Confirm deletion: yes/no
3. Optionally archive: branch-backup.txt

Delete command:
!git branch -d feature/old-feature-1 feature/branch-2
!git push origin --delete feature/old-feature-1
```

### 2. Clean Up Node.js Artifacts

```bash
# Check npm cache size
!npm cache verify 2>/dev/null

# List node_modules size
!du -sh node_modules 2>/dev/null

# Check for duplicate packages
!npm ls --depth=0 2>/dev/null | grep "deduped\|UNMET"
```

**Cleanup Actions:**

```bash
# Clean npm cache
!npm cache clean --force 2>/dev/null

# Remove node_modules and reinstall (if needed)
# !rm -rf node_modules package-lock.json && npm install

# Clean build artifacts
!rm -rf dist build .next .cache coverage 2>/dev/null
```

### 3. Clean Up Python Artifacts

```bash
# Find Python cache files
!find . -type d -name "__pycache__" -o -name ".pytest_cache" -o -name ".mypy_cache"

# Check virtual environment size
!du -sh venv/ .venv/ 2>/dev/null

# List pip packages (check for unused)
!pip list 2>/dev/null | head -20
```

**Cleanup Actions:**

```bash
# Remove Python cache
!find . -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null
!find . -type d -name ".pytest_cache" -exec rm -r {} + 2>/dev/null
!find . -type d -name ".mypy_cache" -exec rm -r {} + 2>/dev/null

# Remove egg-info directories
!find . -type d -name "*.egg-info" -exec rm -r {} + 2>/dev/null
```

### 4. Clean Up Log Files

```bash
# Find log files older than 7 days
!find . -name "*.log" -type f -mtime +7 2>/dev/null | head -20

# Show log file sizes
!find . -name "*.log" -type f -exec du -h {} + 2>/dev/null | sort -h | tail -10
```

**Cleanup Actions:**

```bash
# Archive old logs instead of deleting
!mkdir -p .cleanup/archived-logs
!find . -name "*.log" -type f -mtime +30 -exec mv {} .cleanup/archived-logs/ \;

# Or delete if safe
!find . -name "*.log" -type f -mtime +90 -delete 2>/dev/null
```

### 5. Detect Dangling Migrations

```bash
# Look for orphaned migration files
!find . -path "*/migrations/*" -name "*.py" -o -name "*.sql" 2>/dev/null | head -20

# Check for migration status
!ls -la db/migrations/ 2>/dev/null || echo "No migrations directory"

# Look for TODO migrations
!grep -r "TODO.*migration\|FIXME.*migration" . --include="*.py" --include="*.js" 2>/dev/null
```

**Warnings:**

```markdown
⚠️ Potential Migration Issues:

1. Orphaned Migration: db/migrations/002_add_users_table.sql
   - Never applied to any environment
   - Status: Ready to remove or apply

2. Incomplete Migration: db/migrations/003_rename_column_pending.py
   - Has TODO comment: "Verify column rename works"
   - Status: Needs review before applying

3. Rolled Back: db/migrations/001_initial_schema.sql
   - Rolled back but file still present
   - Status: Safe to remove if no longer needed
```

### 6. Find Unused Configuration Files

```bash
# Find configuration files
!find . -maxdepth 2 -type f \( \
  -name ".*rc*" \
  -o -name "*.config.*" \
  -o -name ".env*" \
  -o -name "config.*.js" \
  \) 2>/dev/null

# Check for config files not referenced
!grep -r "require.*config\|import.*config" . --include="*.js" --include="*.py" 2>/dev/null | cut -d: -f1 | sort -u
```

**Analysis:**

```markdown
Config Files Found:
- .eslintrc.js (referenced, active)
- .prettierrc (referenced, active)
- webpack.config.old.js (NOT referenced, can remove)
- config.production.js (referenced, active)
- .env.example (referenced, documentation)
- .env.local (not referenced, local only - OK)
```

### 7. Identify Unused Dependencies

```bash
# Compare package.json with actual imports
!npm ls --depth=0 2>/dev/null

# Look for TODO comments about removing deps
!grep -r "TODO.*remove\|FIXME.*dependency\|deprecated" . --include="*.md" 2>/dev/null
```

### 8. Generate Cleanup Report

Create **CLEANUP_REPORT.md**:

```markdown
# Workspace Cleanup Report

**Report Generated**: [ISO 8601 timestamp]
**Project**: [Project Name]
**Current Branch**: [branch name]
**Uncommitted Changes**: [count] files

---

## 📊 Pre-Cleanup Status

### Disk Usage
```
Total: [X]GB
- node_modules/: [X]GB
- dist/build: [X]GB
- .git/: [X]GB
- Logs: [X]MB
- Cache: [X]MB
```

### Git Status
- Branches (local): [N]
- Branches (remote): [N]
- Stashed changes: [N]
- Unmerged branches: [N]

---

## 🗑️ Cleanup Recommendations

### Safe to Remove (No Dependencies)

#### Merged Git Branches (5 branches)
```
Delete these branches (already merged to main):
- feature/old-login (merged 60 days ago)
- bugfix/issue-456 (merged 45 days ago)
- experiment/new-ui (merged 30 days ago)

Commands:
!git branch -d feature/old-login bugfix/issue-456 experiment/new-ui
!git push origin --delete feature/old-login bugfix/issue-456 experiment/new-ui

Expected space recovered: ~500KB
```

#### Build Artifacts
```
- dist/ directory: [X]MB (can be rebuilt)
- .next/ directory: [X]MB (can be rebuilt)
- coverage/ directory: [X]MB (can be regenerated)

Commands:
!rm -rf dist .next coverage build

Expected space recovered: ~[X]MB
```

#### Log Files (>90 days old)
```
- logs/application.log (120 days old): [X]MB
- logs/error.log (100 days old): [X]MB
- npm-debug.log (archived): [X]MB

Action: Archive to .cleanup/archived-logs/ or delete
Expected space recovered: ~[X]MB
```

#### Node.js Cache
```
npm cache: [X]MB
pip cache: [X]MB

Commands:
!npm cache clean --force
!pip cache purge

Expected space recovered: ~[X]MB
```

### Review Before Removing (May Be Needed)

#### Unmerged Branches (3 branches)
```
These branches are NOT merged - keep or manually delete?
- wip/incomplete-feature (last commit 10 days ago)
- experimental/new-api (last commit 5 days ago)
- dev/staging-prep (last commit 2 days ago)

Recommendation: Keep unless confirmed obsolete
```

#### Stashed Changes (2 items)
```
Stashed work found:
- stash@{0}: "wip: feature X" (3 days old)
- stash@{1}: "debug: issue Y" (20 days old)

Recommendation: Review or remove if no longer needed
```

### Configuration Files to Archive

#### Unused Config
```
- webpack.config.old.js - NOT referenced, can remove
- .babelrc.legacy - NOT referenced, can remove

Recommendation: Archive to .cleanup/archived-config/ before deleting
```

#### Dangling Migrations
```
⚠️ Migration Status:
- db/migrations/002_pending.sql - Marked TODO, needs review
- db/migrations/003_rolled_back.sql - Was rolled back, consider removing

Action: Verify before cleanup
```

---

## 🔄 Cleanup Execution Plan

### Phase 1: Safe Cleanup (Execute Immediately)
**Estimated space recovery: ~[X]MB**
**Time: ~5 minutes**

```bash
# Remove build artifacts
!rm -rf dist .next coverage build

# Clean cache
!npm cache clean --force

# Remove old logs
!find . -name "*.log" -type f -mtime +90 -delete

# Delete merged branches (reviewed)
!git branch -d feature/old-login bugfix/issue-456
!git push origin --delete feature/old-login bugfix/issue-456
```

### Phase 2: Review & Confirm
**Time: ~10 minutes**
- [ ] Review unmerged branches - keep/delete?
- [ ] Review stashed changes - keep/discard?
- [ ] Review unused configs - archive/delete?
- [ ] Review dangling migrations - verify/remove?

### Phase 3: Optional Deep Cleanup
**Only if needed**

```bash
# Aggressive node_modules cleanup (force reinstall)
!rm -rf node_modules package-lock.json && npm install

# Prune dangling git objects
!git gc --aggressive --prune=now

# Find and remove unused Python packages
!pip freeze > requirements.txt  # Review, then remove unused
```

---

## 📈 Post-Cleanup Status

### Expected Results
- **Space Recovered**: ~[X]MB
- **Branches Removed**: [N]
- **Logs Archived**: [N] files
- **Cache Cleared**: [X]MB
- **Build time**: [Expected improvement]

### Verification Commands
```bash
# Check space after cleanup
du -sh .

# Verify still works
npm install
npm test

# Confirm git is healthy
git status
git log --oneline | head -5
```

---

## 🛡️ Cleanup Safety Checklist

- [ ] Confirmed current work is committed (no unsaved changes)
- [ ] Reviewed all branches to be deleted
- [ ] Backed up any important stashes
- [ ] Understood that build artifacts can be regenerated
- [ ] Ready to proceed with cleanup

---

## 🔧 Cleanup Commands Reference

### Git Cleanup
```bash
# Delete merged branches locally
git branch --merged main | grep -v main | xargs git branch -d

# Delete remote tracking branches
git fetch --prune

# Remove unreachable objects
git gc --aggressive --prune=now

# Check for dangling commits
git fsck --lost-found
```

### Node.js Cleanup
```bash
# Clean npm cache
npm cache clean --force

# Verify npm
npm verify

# Remove node_modules
rm -rf node_modules package-lock.json
npm install
```

### Python Cleanup
```bash
# Clear pip cache
pip cache purge

# Remove __pycache__
find . -type d -name __pycache__ -exec rm -r {} +

# Remove .pytest_cache
find . -type d -name .pytest_cache -exec rm -r {} +
```

### Docker Cleanup (if applicable)
```bash
# Remove dangling images
docker image prune -a --filter "until=72h"

# Remove unused volumes
docker volume prune -f

# Check space usage
docker system df
```

---

**Report Generated**: [Timestamp]  
**Cleanup Status**: ✅ Ready / ⏳ Pending Review / ❌ Issues Found  
**Next Review**: [Scheduled date]  
**Recommended Frequency**: Monthly

---
```

### 9. Display Cleanup Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║         WORKSPACE CLEANUP ANALYSIS COMPLETE        ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]
CURRENT STATE: [Branch] with [N] uncommitted changes

DISK USAGE:
  Before: [X]GB
  Expected After: [Y]GB
  Potential Recovery: [Z]MB (~[%])

CLEANUP OPPORTUNITIES:

✅ SAFE TO REMOVE (No Dependencies):
  - Merged git branches: [N] branches → ~500KB
  - Build artifacts (dist/): ~[X]MB
  - Old logs (>90d): [N] files → ~[X]MB
  - npm cache: ~[X]MB
  
  Total Recovery: ~[Z]MB

⚠️ REVIEW BEFORE REMOVING:
  - Unmerged branches: [N] (active work?)
  - Stashed changes: [N] (still needed?)
  - Unused configs: [N] files

🔴 WARNINGS:
  - Dangling migrations: [N] (needs review)
  - Deprecated dependencies: [N] (check usage)

RECOMMENDATIONS:

Phase 1 (Immediate): ~5 min
  rm -rf dist .next npm cache clean

Phase 2 (Review): ~10 min
  Check branches, stashes, configs

Phase 3 (Optional): Aggressive cleanup
  Force reinstall, prune git, etc.

Full Report: CLEANUP_REPORT.md
```

## Key Features

- **Multi-Type Cleanup**: Git branches, build artifacts, logs, cache, config
- **Safety First**: Never deletes without confirmation
- **Pre-Cleanup Analysis**: Shows what can be safely removed
- **Space Recovery**: Quantifies disk space that will be freed
- **Dangling Detection**: Finds orphaned migrations and configs
- **Phased Approach**: Safe immediately, review, then optional deep clean
- **Audit Trail**: Complete CLEANUP_REPORT.md for reference

## Cleanup Safety Levels

| Category | Type | Safe to Remove | Confirmation |
|----------|------|---|---|
| Git Branches | Merged | ✅ Yes | Recommended |
| Git Branches | Unmerged | ⚠️ Maybe | Required |
| Build Artifacts | dist/, build/ | ✅ Yes | Quick verify |
| Logs | Old (>90d) | ✅ Yes | Can archive |
| Cache | npm/pip cache | ✅ Yes | Safe |
| Config | Unused | ⚠️ Maybe | Archive first |
| Migrations | Dangling | ❌ No | Manual review |

## When to Use /cleanup

- Weekly workspace maintenance
- Before major refactoring
- When disk space is low
- Before archiving project
- After completed sprints
- When switching to new project
- During onboarding to fresh workspace
- Before production deployment

## Best Practices

1. **Regular Cleanup**: Run weekly or biweekly
2. **Commit First**: Always ensure changes are committed
3. **Archive Don't Delete**: Keep backups of configs/migrations
4. **Review Dangling**: Never auto-delete migrations
5. **Git Backup**: Tag important branches before deletion
6. **Stash Review**: Check stashes before cleanup
7. **Test After**: Verify project still builds/runs
8. **Document**: Keep cleanup report for audit trail