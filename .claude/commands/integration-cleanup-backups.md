# Integration Cleanup Backups

## Purpose
Clean out backup archives created during skill enhancement operations. These backups are stored in `/INTEGRATION/processed/` with `.backup-v*` suffixes and can accumulate over time.

## Version
1.0

## Usage
```
/integration-cleanup-backups [options]
```

## Options
- `--dry-run` - List backups without deleting (default behavior)
- `--confirm` - Actually delete the backup files
- `--older-than <days>` - Only target backups older than N days
- `--skill <name>` - Target specific skill backups only

## Workflow

### 1. Scan for Backup Files

```bash
# Find all backup files in processed directory
find /INTEGRATION/processed -name "*.backup-v*" -type f 2>/dev/null
```

### 2. Analyze Backups

For each backup file found, extract:
- Original skill name
- Backup version (from filename)
- File size
- Creation date
- Age in days

### 3. Generate Cleanup Report

Display to user:

```
╔═══════════════════════════════════════════════════╗
║       BACKUP CLEANUP SCAN                          ║
╚═══════════════════════════════════════════════════╝

SCANNED: /INTEGRATION/processed/
BACKUPS FOUND: [count]

BACKUP FILES:

| Skill | Version | Size | Age | Path |
|-------|---------|------|-----|------|
| github-copilot | v1.1.0 | 24KB | 2d | processed/github-copilot/SKILL.md.backup-v1.1.0 |
| mcp-builder | v1.0.0 | 18KB | 5d | processed/mcp-builder/SKILL.md.backup-v1.0.0 |

TOTAL SIZE: [sum] KB
OLDEST BACKUP: [date]
NEWEST BACKUP: [date]

MODE: Dry Run (use --confirm to delete)
```

### 4. Cleanup Actions

**Dry Run Mode (default):**
- List all backups that would be deleted
- Show total space that would be recovered
- Exit without changes

**Confirm Mode:**
```bash
# For each backup file
rm -v "/INTEGRATION/processed/[skill]/SKILL.md.backup-v[version]"
```

After deletion:
```
╔═══════════════════════════════════════════════════╗
║       BACKUP CLEANUP COMPLETED                     ║
╚═══════════════════════════════════════════════════╝

DELETED: [count] backup files
RECOVERED: [size] KB

FILES REMOVED:
  ✅ github-copilot/SKILL.md.backup-v1.1.0
  ✅ mcp-builder/SKILL.md.backup-v1.0.0

REMAINING BACKUPS: [count]
```

### 5. Filtered Cleanup

**By Age:**
```bash
# Find backups older than N days
find /INTEGRATION/processed -name "*.backup-v*" -type f -mtime +[N]
```

**By Skill:**
```bash
# Find backups for specific skill
find /INTEGRATION/processed/[skill-name] -name "*.backup-v*" -type f
```

## Safety Features

1. **Default Dry Run** - Never deletes without explicit `--confirm`
2. **Confirmation Prompt** - Even with `--confirm`, ask user to verify
3. **Preserve Latest** - Option to keep most recent backup per skill
4. **Audit Log** - Record all deletions to `/INTEGRATION/logs/cleanup-[timestamp].md`

## Audit Log Format

Create `/INTEGRATION/logs/cleanup-[timestamp].md`:

```markdown
# Backup Cleanup Log - [Date/Time]

**Mode**: [Dry Run | Confirmed Deletion]
**Operator**: [user]
**Filters Applied**: [age, skill, etc.]

## Files Processed

| File | Size | Age | Action |
|------|------|-----|--------|
| github-copilot/SKILL.md.backup-v1.1.0 | 24KB | 2d | Deleted |

## Summary

- Files scanned: [count]
- Files deleted: [count]
- Space recovered: [size]
- Files preserved: [count]

---

**Log Status**: COMPLETE
```

## Examples

**List all backups (dry run):**
```
/integration-cleanup-backups
```

**Delete all backups:**
```
/integration-cleanup-backups --confirm
```

**Delete backups older than 30 days:**
```
/integration-cleanup-backups --older-than 30 --confirm
```

**Clean specific skill backups:**
```
/integration-cleanup-backups --skill github-copilot --confirm
```

## Error Handling

- **No backups found**: Display "No backup files found" and exit
- **Permission denied**: Log error, continue with accessible files
- **Disk full**: Warn user, suggest manual cleanup

## Permissions
```yaml
allowed-tools: ["Bash", "Read", "Write"]
```

## Related Commands

- `/integration-process` - Creates backups during skill enhancement
- `/skill-enhancer` - Triggers backup creation before updates
- `/integration-scan` - Shows current pipeline state

---

**Version**: 1.0
**Last Updated**: 2026-01-16
**Category**: Integration/Maintenance
