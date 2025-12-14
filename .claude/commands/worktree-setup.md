---
description: "Automated git worktree lifecycle management with branch strategy enforcement, workspace isolation, configuration replication, health checks, and cleanup procedures."
allowed-tools: ["Bash(git:*)", "Bash(find)", "Bash(rm)", "Read", "Edit"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Worktree Setup

## Purpose
Automate the complete lifecycle of git worktrees for multi-agent development workflows: creation with standardized branch naming, configuration replication, isolation validation, health monitoring, and safe cleanup after task completion.

## When to Use
- Starting multi-agent feature development (spawn-agents command)
- Creating isolated development environments per task
- Enforcing consistent branch naming conventions across team
- Managing multiple parallel development streams
- Scaling development from single to multi-worktree workflows
- Decommissioning completed worktrees post-merge

## Prerequisites
- Git repository with clean working directory on main branch
- At least one agent task from MULTI_AGENT_PLAN.md to process
- Sufficient disk space for worktrees (2-3x repo size)
- Read/write permissions on repository directory
- Optional: Repository configuration files to replicate (.gitignore, .editorconfig, etc)

## Project-Specific Customization

**To use this template in your project:**

1. Copy to `.claude/commands/worktree-setup.md`
2. Customize branch naming convention in Step 2.1 to match team standards
3. Update configuration files list in Step 3.1 to replicate project-specific configs
4. Adjust health check thresholds in Step 5 based on project requirements
5. Modify cleanup retention policy in Step 7 if needed
6. Set environment variables in `.env.worktree` for automation

**Configuration File (`.env.worktree`):**
```bash
# Branch naming strategy: {prefix}/{role}/{task-id}/{description}
BRANCH_PREFIX="feat"
WORKTREE_BASE_PATH="${PROJECT_ROOT}/.worktrees"

# Health check configuration
HEALTH_CHECK_MAX_UNCOMMITTED=100
HEALTH_CHECK_MAX_DISK_USAGE_PCT=80
HEALTH_CHECK_TIMEOUT_MINUTES=120

# Cleanup configuration
CLEANUP_AFTER_MERGE_DAYS=1
ARCHIVE_COMPLETED_WORKTREES=true
ARCHIVE_PATH="${PROJECT_ROOT}/.worktree-archive"
```

## Workflow

### Phase 1: Worktree Initialization

**Step 1.1: Validate Repository State**
```bash
# Ensure main branch is up-to-date and clean
git fetch origin main

# Check for uncommitted changes
UNCOMMITTED=$(git status --porcelain | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
  echo "ERROR: Working directory not clean. Commit or stash changes first."
  exit 1
fi

# Verify no orphaned worktrees from previous runs
ORPHANED=$(git worktree list --porcelain | grep -v "^prune" | wc -l)
if [ "$ORPHANED" -gt 20 ]; then
  echo "WARNING: Found $ORPHANED worktrees. Consider cleanup."
fi

# Show current state
git status --short
git log --oneline -5
```

**Step 1.2: Load Task Configuration**
```markdown
Load task definition from MULTI_AGENT_PLAN.md:
- Task ID: {{TASK_ID}}
- Agent Role: {{AGENT_ROLE}} (architect|builder|validator|scribe|devops|researcher)
- Task Description: {{TASK_DESCRIPTION}}
- Base Branch: {{BASE_BRANCH}} (default: main)
- Dependencies: {{TASK_DEPENDENCIES}} (list of prerequisite tasks)
```

**Step 1.3: Verify Task Dependencies**
```bash
# Check if all prerequisite tasks are completed
DEPENDENCIES="{{TASK_DEPENDENCIES}}"
for dep_task in $DEPENDENCIES; do
  STATUS=$(grep "^| $dep_task |" MULTI_AGENT_PLAN.md | grep -o "✅\|⏳\|❌")
  if [ "$STATUS" != "✅" ]; then
    echo "ERROR: Dependency $dep_task not complete. Status: $STATUS"
    exit 1
  fi
done

echo "All dependencies satisfied ✓"
```

### Phase 2: Branch Strategy Enforcement

**Step 2.1: Generate Branch Name**
```bash
# Standardized naming: {prefix}/{role}/{task-id}/{kebab-case-description}
BRANCH_PREFIX="${BRANCH_PREFIX:-feat}"
AGENT_ROLE="{{AGENT_ROLE}}"
TASK_ID="{{TASK_ID}}"
TASK_DESC="{{TASK_DESCRIPTION}}"

# Sanitize description to kebab-case
SANITIZED_DESC=$(echo "$TASK_DESC" | \
  tr '[:upper:]' '[:lower:]' | \
  sed 's/[^a-z0-9]/-/g' | \
  sed 's/-\+/-/g' | \
  sed 's/^-\|-$//g' | \
  cut -c1-30)

BRANCH_NAME="${BRANCH_PREFIX}/${AGENT_ROLE}/${TASK_ID}/${SANITIZED_DESC}"

echo "Generated branch: $BRANCH_NAME"

# Validate branch name (no spaces, special chars, etc)
if ! [[ "$BRANCH_NAME" =~ ^[a-z0-9]([a-z0-9._/-]*[a-z0-9])?$ ]]; then
  echo "ERROR: Invalid branch name: $BRANCH_NAME"
  exit 1
fi

# Check if branch already exists
if git show-ref --quiet --verify "refs/heads/$BRANCH_NAME"; then
  echo "ERROR: Branch already exists: $BRANCH_NAME"
  exit 1
fi
```

**Step 2.2: Validate Naming Convention Compliance**
```bash
# Enforce team naming conventions
VALID_PREFIXES="feat|fix|refactor|docs|test|chore"
VALID_ROLES="architect|builder|validator|scribe|devops|researcher"

if ! [[ "$BRANCH_PREFIX" =~ ^($VALID_PREFIXES)$ ]]; then
  echo "ERROR: Invalid prefix '$BRANCH_PREFIX'. Allowed: $VALID_PREFIXES"
  exit 1
fi

if ! [[ "$AGENT_ROLE" =~ ^($VALID_ROLES)$ ]]; then
  echo "ERROR: Invalid role '$AGENT_ROLE'. Allowed: $VALID_ROLES"
  exit 1
fi

if ! [[ "$TASK_ID" =~ ^[A-Z]+-[0-9]+$ ]]; then
  echo "WARNING: Task ID '$TASK_ID' doesn't follow pattern PROJ-123. Proceeding anyway."
fi

echo "Branch naming convention validated ✓"
```

### Phase 3: Workspace Isolation Setup

**Step 3.1: Create Worktree Directory**
```bash
# Create worktree base directory
WORKTREE_BASE="${WORKTREE_BASE_PATH:-./.worktrees}"
WORKTREE_DIR="${WORKTREE_BASE}/${BRANCH_NAME}"

mkdir -p "$WORKTREE_BASE"

# Create git worktree (lightweight clone of repo)
git worktree add --track -b "$BRANCH_NAME" "$WORKTREE_DIR" origin/main

if [ $? -ne 0 ]; then
  echo "ERROR: Failed to create worktree at $WORKTREE_DIR"
  rm -rf "$WORKTREE_DIR"
  exit 1
fi

echo "Created worktree at: $WORKTREE_DIR"
cd "$WORKTREE_DIR"
```

**Step 3.2: Replicate Configuration Files**
```bash
# Copy essential configuration files to maintain consistency
CONFIG_FILES=(
  ".gitignore"
  ".editorconfig"
  ".prettierrc"
  ".eslintrc.json"
  "tsconfig.json"
  "package.json"
  "Dockerfile"
  ".env.example"
  ".github/workflows"
  "pytest.ini"
  "pyproject.toml"
  "Makefile"
)

REPO_ROOT="$(git rev-parse --show-toplevel)"

for config_file in "${CONFIG_FILES[@]}"; do
  src="${REPO_ROOT}/${config_file}"
  dst="$(pwd)/${config_file}"

  if [ -e "$src" ] && [ ! -e "$dst" ]; then
    if [ -d "$src" ]; then
      cp -r "$src" "$dst"
      echo "Copied directory: $config_file"
    else
      cp "$src" "$dst"
      echo "Copied file: $config_file"
    fi
  fi
done

# Verify core config files exist
if [ ! -f ".gitignore" ]; then
  cp "${REPO_ROOT}/.gitignore" . 2>/dev/null || echo "WARNING: .gitignore not copied"
fi
```

**Step 3.3: Setup Worktree Metadata**
```bash
# Create worktree context file for agent reference
cat > .worktree-context.md << 'CONTEXT_EOF'
# Worktree Context

- **Worktree ID**: {{WORKTREE_ID}}
- **Branch**: {{BRANCH_NAME}}
- **Agent Role**: {{AGENT_ROLE}}
- **Task ID**: {{TASK_ID}}
- **Created**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
- **Base Branch**: {{BASE_BRANCH}}
- **Parent PID**: {{PARENT_PID}}

## Task Description
{{TASK_DESCRIPTION}}

## Handoff Instructions
1. Complete task according to acceptance criteria in MULTI_AGENT_PLAN.md
2. Commit regularly with clear messages
3. Push to remote branch: `git push -u origin {{BRANCH_NAME}}`
4. Create pull request and mark task as complete
5. Upon merge, cleanup worktree using `worktree-setup --cleanup`

## Environment
```bash
cd "$(pwd)"
git status
```

CONTEXT_EOF

echo "Created worktree metadata: .worktree-context.md"
```

### Phase 4: Configuration Integrity Validation

**Step 4.1: Verify Worktree Integrity**
```bash
# Ensure worktree is properly initialized
git status > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "ERROR: Worktree git status failed"
  exit 1
fi

# Check branch is correct
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
  echo "ERROR: On wrong branch. Expected $BRANCH_NAME, got $CURRENT_BRANCH"
  exit 1
fi

# Verify tracking branch
TRACKING=$(git config --local branch.${BRANCH_NAME}.remote)
if [ -z "$TRACKING" ]; then
  echo "WARNING: Branch not tracking remote. Setting up..."
  git branch -u origin/"$BRANCH_NAME" || true
fi

echo "Worktree integrity verified ✓"
```

**Step 4.2: Validate Configuration Replication**
```bash
# Verify essential files were replicated
REQUIRED_CONFIGS=(".gitignore" "package.json")
MISSING=()

for config in "${REQUIRED_CONFIGS[@]}"; do
  if [ ! -e "$config" ]; then
    MISSING+=("$config")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "WARNING: Missing configs: ${MISSING[*]}"
  echo "Install dependencies manually or copy from parent repo"
else
  echo "Configuration files verified ✓"
fi
```

### Phase 5: Worktree Health Checks

**Step 5.1: Initial Health Assessment**
```bash
# Check disk usage
DISK_USAGE=$(du -s . | awk '{print $1}')
MAX_DISK=$(df . | awk 'NR==2 {print $4}')
USAGE_PCT=$((100 * DISK_USAGE / MAX_DISK))

echo "Disk usage: ${USAGE_PCT}% (${DISK_USAGE}K / ${MAX_DISK}K)"

if [ "$USAGE_PCT" -gt "${HEALTH_CHECK_MAX_DISK_USAGE_PCT:-80}" ]; then
  echo "WARNING: Disk usage high. Consider cleanup."
fi

# Check git object database integrity
git fsck --full > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Git object database healthy ✓"
else
  echo "WARNING: Git object database integrity check failed"
fi

# Verify remote connectivity
git fetch --dry-run origin > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Remote connectivity verified ✓"
else
  echo "ERROR: Cannot reach remote repository"
  exit 1
fi
```

**Step 5.2: Generate Health Report**
```bash
# Create health check report
cat > .worktree-health.json << 'HEALTH_EOF'
{
  "check_timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "worktree_id": "{{WORKTREE_ID}}",
  "branch": "{{BRANCH_NAME}}",
  "status": "healthy",
  "checks": {
    "git_status": "pass",
    "branch_tracking": "pass",
    "remote_connectivity": "pass",
    "disk_usage_pct": {{USAGE_PCT}},
    "object_database": "pass"
  },
  "metadata": {
    "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "last_check": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "agent_role": "{{AGENT_ROLE}}",
    "task_id": "{{TASK_ID}}"
  }
}
HEALTH_EOF

echo "Health report generated: .worktree-health.json"
```

### Phase 6: Multi-Worktree Conflict Prevention

**Step 6.1: Lock Acquisition**
```bash
# Prevent concurrent modifications to shared resources
LOCK_DIR="${REPO_ROOT}/.worktree-locks"
mkdir -p "$LOCK_DIR"

WORKTREE_LOCK="${LOCK_DIR}/${BRANCH_NAME}.lock"
exec 200>"$WORKTREE_LOCK"
flock -n 200

if [ $? -ne 0 ]; then
  echo "ERROR: Worktree already in use by another process"
  exit 1
fi

echo "$$" > "$WORKTREE_LOCK"
echo "Lock acquired for worktree: $BRANCH_NAME"

# Register cleanup trap to release lock
trap "rm -f '$WORKTREE_LOCK'" EXIT
```

**Step 6.2: Dependency Conflict Detection**
```bash
# Check for other worktrees with conflicting dependencies
EXISTING_WORKTREES=$(git worktree list --porcelain | grep -v "^prune" | awk '{print $2}' | wc -l)

if [ "$EXISTING_WORKTREES" -gt 10 ]; then
  echo "WARNING: Found $EXISTING_WORKTREES active worktrees. Cleanup stale ones."
  git worktree prune
fi

# List all active worktrees for reference
echo ""
echo "Active worktrees:"
git worktree list --porcelain | grep -v "^prune" | while read line; do
  PATH=$(echo $line | awk '{print $2}')
  BRANCH=$(echo $line | awk '{print $3}' | sed 's/\[//; s/\]//')
  echo "  $BRANCH @ $PATH"
done
```

### Phase 7: Cleanup and Decommissioning

**Step 7.1: Mark Worktree for Cleanup (Post-Merge)**
```bash
# After PR is merged, mark worktree for cleanup
# Run this command when task completion is confirmed

REPO_ROOT="$(git rev-parse --show-toplevel)"
BRANCH_NAME="{{BRANCH_NAME}}"
WORKTREE_PATH="${REPO_ROOT}/.worktrees/${BRANCH_NAME}"

# Verify branch is merged
MERGED=$(git branch -r --merged origin/main | grep "$BRANCH_NAME")
if [ -z "$MERGED" ]; then
  echo "ERROR: Branch not merged to main. Push PR or merge first."
  exit 1
fi

echo "✓ Branch merged to main"

# Archive metadata before cleanup
if [ -d "$WORKTREE_PATH" ]; then
  ARCHIVE_PATH="${REPO_ROOT}/.worktree-archive"
  mkdir -p "$ARCHIVE_PATH"

  if [ -f "$WORKTREE_PATH/.worktree-context.md" ]; then
    cp "$WORKTREE_PATH/.worktree-context.md" \
       "$ARCHIVE_PATH/${BRANCH_NAME}-context.md"
  fi

  if [ -f "$WORKTREE_PATH/.worktree-health.json" ]; then
    cp "$WORKTREE_PATH/.worktree-health.json" \
       "$ARCHIVE_PATH/${BRANCH_NAME}-health.json"
  fi
fi
```

**Step 7.2: Remove Worktree Safely**
```bash
# Remove worktree and delete branch
git worktree remove "$WORKTREE_PATH" --force

if [ $? -eq 0 ]; then
  echo "✓ Removed worktree: $WORKTREE_PATH"
else
  echo "ERROR: Failed to remove worktree. Manual cleanup may be needed."
  exit 1
fi

# Delete local branch
git branch -D "$BRANCH_NAME"

# Delete remote branch (optional, usually done via PR merge)
git push origin --delete "$BRANCH_NAME" 2>/dev/null || \
  echo "INFO: Remote branch already deleted or requires different permissions"

echo "✓ Cleanup complete for: $BRANCH_NAME"
```

**Step 7.3: Batch Cleanup (Orphaned Worktrees)**
```bash
# Run periodically to clean up abandoned worktrees
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_BASE="${REPO_ROOT}/.worktrees"
THRESHOLD_DAYS=7

echo "Scanning for orphaned worktrees older than $THRESHOLD_DAYS days..."

if [ ! -d "$WORKTREE_BASE" ]; then
  echo "No worktree directory found"
  exit 0
fi

CURRENT_TIME=$(date +%s)
CLEANUP_COUNT=0

for worktree_dir in "$WORKTREE_BASE"/*; do
  if [ ! -d "$worktree_dir" ]; then
    continue
  fi

  MODIFIED_TIME=$(stat -f%m "$worktree_dir" 2>/dev/null || stat -c%Y "$worktree_dir")
  AGE_DAYS=$(((CURRENT_TIME - MODIFIED_TIME) / 86400))

  if [ "$AGE_DAYS" -gt "$THRESHOLD_DAYS" ]; then
    BRANCH_NAME=$(basename "$worktree_dir")
    echo "Removing orphaned worktree (${AGE_DAYS}d old): $BRANCH_NAME"
    git worktree remove "$worktree_dir" --force 2>/dev/null
    ((CLEANUP_COUNT++))
  fi
done

echo "✓ Cleanup complete: Removed $CLEANUP_COUNT orphaned worktrees"
```

## Error Handling

### Common Issues and Recovery

**Worktree creation fails:**
```bash
# Clean up partial worktree
git worktree remove <path> --force
# Ensure branch doesn't exist: git branch -D <branch-name>
# Retry worktree creation
```

**Lock file conflicts:**
```bash
# Check if process is still running
ps -p $(cat .worktree-locks/branch-name.lock) 2>/dev/null
# If not running, safely remove lock
rm -f .worktree-locks/branch-name.lock
```

**Disk space exhausted:**
```bash
# Run batch cleanup immediately
git worktree prune
# Remove abandoned worktrees older than 1 day
find .worktrees -maxdepth 1 -type d -mtime +1 -exec rm -rf {} \;
```

**Remote tracking issues:**
```bash
# Reset tracking relationship
git branch -u origin/branch-name
git fetch origin branch-name:refs/remotes/origin/branch-name
```

## Security Considerations

1. **File Permissions**: Worktrees inherit parent repository permissions
2. **Lock Files**: Use file locking to prevent concurrent modifications
3. **Configuration Isolation**: Each worktree maintains separate git config
4. **Cleanup**: Always cleanup after task completion to prevent disk bloat
5. **Archive Policy**: Archive metadata before deletion for audit trails
6. **Branch Protection**: Enforce branch protection rules on main/develop

## Performance Optimization

- **Worktree Reuse**: Consider worktree pooling for frequent tasks
- **Disk I/O**: Monitor disk usage, cleanup orphaned worktrees regularly
- **Lock Contention**: Keep lock duration minimal
- **Shallow Clones**: For large repos, consider `--depth 1` option in worktree add

## Example Execution

```bash
# 1. Initialize session with task configuration
task_id="PROJ-123"
agent_role="builder"
branch_name="feat/builder/PROJ-123/add-user-authentication"

# 2. Create worktree
git worktree add --track -b "$branch_name" \
  ".worktrees/${branch_name}" origin/main

# 3. Enter worktree
cd ".worktrees/${branch_name}"

# 4. Install dependencies (if needed)
npm install  # or: pip install -r requirements.txt

# 5. Begin work
# ... make changes, commit regularly ...

# 6. Push and create PR
git push -u origin "$branch_name"

# 7. After merge, cleanup
git worktree remove . --force
cd - && git branch -D "$branch_name"
```

## Integration with Multi-Agent Workflows

**From spawn-agents command:**
```bash
# spawn-agents creates task with isolation="worktree"
# → worktree-setup creates isolated workspace
# → agent begins work in isolated context
# → Upon completion, worktree-setup --cleanup removes environment
```

**From MULTI_AGENT_PLAN.md:**
```markdown
| Task ID | Agent | Status | Worktree | Branch |
|---------|-------|--------|----------|--------|
| PROJ-1  | Builder | ✅ | .worktrees/feat/builder/PROJ-1/... | feat/builder/PROJ-1/... |
| PROJ-2  | Validator | ⏳ | .worktrees/feat/validator/PROJ-2/... | feat/validator/PROJ-2/... |
```

## Version History

### v1.0 (2025-11-29)
- Initial release
- Git worktree lifecycle automation
- Branch naming convention enforcement
- Configuration replication
- Worktree health checks
- Multi-worktree conflict prevention
- Cleanup automation
- Lock-based concurrency control
- Archive policy support
