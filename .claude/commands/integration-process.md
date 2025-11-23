---
description: "Process validated files from integration scan and move to proper locations"
allowed-tools: ["Read", "Bash(mv)", "Bash(cp)", "Bash(mkdir)", "Bash(ls)", "Edit"]
author: "Claude Command and Control"
version: "1.0"
---

# Integration Process

## Purpose
Process files that have been validated by `/integration-scan`, moving them to appropriate target locations, creating backups, and generating integration reports.

## Prerequisites
- `/integration-scan` must have been run
- Scan report exists at `/INTEGRATION/logs/scan-report-[timestamp].md`
- Files marked as ✅ Ready in scan report

## Workflow

### 1. Load Latest Scan Report

```bash
# Find most recent scan report
!ls -t /INTEGRATION/logs/scan-report-*.md | head -1
```

Read the scan report to identify files marked as ✅ Ready for processing.

### 2. Confirm Files to Process

Display to user:
```
╔═══════════════════════════════════════════════════╗
║       INTEGRATION PROCESS STARTING                 ║
╚═══════════════════════════════════════════════════╝

Based on scan report: [filename]

FILES TO PROCESS:

Commands (X files):
  • file1.md → .claude/commands/
  • file2.md → .claude/commands/

Agents (X files):
  • agent1.md → agents-templates/

Skills (X files):
  • skill1.md → skills/skill1/SKILL.md
  • skill2.md → skills/skill2/SKILL.md

Documentation (X files):
  • doc1.md → docs/[category]/

Total: X files

Proceed with integration? [User must confirm]
```

### 3. Process Each File by Category

#### For Skills

Skills should be placed in individual directories under `skills/`:

```bash
# For each skill file
SKILL_NAME="skill-name"  # Extract from frontmatter 'name:' field
SOURCE="/INTEGRATION/incoming/SKILL-NAME.md"
TARGET="skills/${SKILL_NAME}/SKILL.md"

# Create skill directory
!mkdir -p "skills/${SKILL_NAME}"

# Copy to target (not move yet, keep source for backup)
!cp "${SOURCE}" "${TARGET}"

# Verify copy succeeded
!test -f "${TARGET}" && echo "✅ Created ${TARGET}"

# Move original to processed
!mv "${SOURCE}" "/INTEGRATION/processed/$(basename ${SOURCE})"

# Create metadata file
# Contains: original filename, integration date, target location
```

#### For Commands

Commands go to `.claude/commands/`:

```bash
# For each command file
SOURCE="/INTEGRATION/incoming/command-name.md"
TARGET=".claude/commands/command-name.md"

# Check if file already exists
if [ -f "${TARGET}" ]; then
  # Create backup of existing file
  !cp "${TARGET}" "${TARGET}.backup-$(date +%Y%m%d-%H%M%S)"
  echo "⚠️  Existing file backed up"
fi

# Copy to target
!cp "${SOURCE}" "${TARGET}"

# Verify
!test -f "${TARGET}" && echo "✅ Integrated ${TARGET}"

# Move original to processed
!mv "${SOURCE}" "/INTEGRATION/processed/$(basename ${SOURCE})"
```

#### For Agents

Agents go to `agents-templates/`:

```bash
# For each agent file
SOURCE="/INTEGRATION/incoming/agent-name.md"
TARGET="agents-templates/agent-name.md"

# Check for existing file
if [ -f "${TARGET}" ]; then
  !cp "${TARGET}" "${TARGET}.backup-$(date +%Y%m%d-%H%M%S)"
  echo "⚠️  Existing file backed up"
fi

# Copy and verify
!cp "${SOURCE}" "${TARGET}"
!test -f "${TARGET}" && echo "✅ Integrated ${TARGET}"

# Move to processed
!mv "${SOURCE}" "/INTEGRATION/processed/$(basename ${SOURCE})"
```

#### For Documentation

Documentation goes to appropriate `docs/` subdirectory:

```bash
# Determine category from content or user input
CATEGORY="best-practices"  # or "guides", "tutorials", etc.
SOURCE="/INTEGRATION/incoming/doc-name.md"
TARGET="docs/${CATEGORY}/doc-name.md"

# Ensure category directory exists
!mkdir -p "docs/${CATEGORY}"

# Copy and verify
!cp "${SOURCE}" "${TARGET}"
!test -f "${TARGET}" && echo "✅ Integrated ${TARGET}"

# Move to processed
!mv "${SOURCE}" "/INTEGRATION/processed/$(basename ${SOURCE})"
```

### 4. Create Metadata Records

For each processed file, create a metadata file in `/INTEGRATION/processed/`:

```markdown
# Metadata: [original-filename]

**Integration Date**: [ISO 8601 timestamp]
**Original Path**: /INTEGRATION/incoming/[filename]
**Target Path**: [destination path]
**File Type**: [Command|Agent|Skill|Documentation]
**Status**: Successfully integrated
**Backed Up Existing**: [Yes/No]

## Validation Results
[Copy from scan report]

## Integration Log
[Timestamp] - File copied to target
[Timestamp] - Original moved to processed
[Timestamp] - Metadata created
```

### 5. Generate Integration Report

Create `/INTEGRATION/logs/integration-report-[timestamp].md`:

```markdown
# Integration Report - [Date/Time]

**Scan Report Used**: [scan report filename]
**Files Processed**: X
**Successfully Integrated**: Y
**Failed**: Z
**Skipped**: W

---

## Successfully Integrated

### Commands (Y files)
| Original File | Target Location | Status |
|---------------|-----------------|--------|
| file1.md | .claude/commands/file1.md | ✅ Integrated |
| file2.md | .claude/commands/file2.md | ✅ Integrated |

### Agents (Y files)
| Original File | Target Location | Status |
|---------------|-----------------|--------|
| agent1.md | agents-templates/agent1.md | ✅ Integrated |

### Skills (Y files)
| Original File | Target Location | Status |
|---------------|-----------------|--------|
| skill1.md | skills/skill1/SKILL.md | ✅ Integrated |
| skill2.md | skills/skill2/SKILL.md | ✅ Integrated |

### Documentation (Y files)
| Original File | Target Location | Status |
|---------------|-----------------|--------|
| doc1.md | docs/category/doc1.md | ✅ Integrated |

---

## Files Backed Up

The following existing files were backed up before being overwritten:

| File | Backup Location |
|------|-----------------|
| .claude/commands/existing.md | .claude/commands/existing.md.backup-20251123-0245 |

---

## Failed Integrations

[If any failures occurred]

### [filename] - ❌ Failed
- **Error**: [error message]
- **Location**: Remains in /INTEGRATION/incoming/
- **Action Required**: [remediation steps]

---

## Next Steps

1. ✅ Files successfully integrated to repository
2. 🔄 Run `/integration-update-docs` to update documentation
3. 🔄 Run `/integration-validate` for comprehensive quality checks
4. 📝 Review integrated files manually
5. 🧪 Test new commands/agents/skills
6. ✅ Commit changes with descriptive message

### Recommended Git Commit Message

```
integrate: add [X] new [skills|commands|agents]

Integrated [X] files from INTEGRATION pipeline:
- [List of files with brief descriptions]

All files validated by integration-scan.
Quality score: [score from scan]

Files: [comma-separated list]
```

---

## Integration Statistics

**Processing Time**: [duration]
**Success Rate**: [Y/X * 100]%
**Files Remaining in Incoming**: [count]
**Total Processed to Date**: [running total]

---

## Backup Manifest

All processed files archived to: /INTEGRATION/processed/

| Original File | Archive Location | Archive Date |
|---------------|------------------|--------------|
| file1.md | /INTEGRATION/processed/file1.md | [timestamp] |
| file2.md | /INTEGRATION/processed/file2.md | [timestamp] |

**Retention Policy**: Processed files retained for audit purposes.
**Recovery**: To restore, copy from processed/ back to incoming/ and rerun scan.

---

## Audit Trail

[Timestamp] - Integration process started
[Timestamp] - Loaded scan report: [filename]
[Timestamp] - User confirmed processing of X files
[Timestamp] - Processed skill1.md → skills/skill1/SKILL.md ✅
[Timestamp] - Processed skill2.md → skills/skill2/SKILL.md ✅
[Timestamp] - Processed command1.md → .claude/commands/command1.md ✅
[Timestamp] - All files processed successfully
[Timestamp] - Integration report generated
[Timestamp] - Integration process completed

---

**Report Status**: ✅ COMPLETE
**Integration Status**: [SUCCESS|PARTIAL|FAILED]
**Files Integrated**: Y/X ([percentage]%)
**Action Required**: Run /integration-update-docs
```

### 6. Display Summary to User

```
╔═══════════════════════════════════════════════════╗
║       INTEGRATION COMPLETED                        ║
╚═══════════════════════════════════════════════════╝

FILES PROCESSED: X
  ✅ Successfully integrated: Y
  ❌ Failed: Z
  ⏭️  Skipped: W

INTEGRATION BREAKDOWN:
  • Commands: [count] → .claude/commands/
  • Agents: [count] → agents-templates/
  • Skills: [count] → skills/*/SKILL.md
  • Documentation: [count] → docs/*/

BACKUPS CREATED: [count]
  See integration report for backup locations

REPORT SAVED: /INTEGRATION/logs/integration-report-[timestamp].md

PROCESSED FILES ARCHIVED: /INTEGRATION/processed/

NEXT STEPS:
  1. Review integrated files in their new locations
  2. Run '/integration-update-docs' to update README/indices
  3. Run '/integration-validate' for quality assurance
  4. Test new commands/agents/skills
  5. Commit with suggested message (see report)

GIT STATUS:
  New files: [count]
  Modified files: [count if overwrites]
  Ready to commit: [Yes/No]
```

## Error Handling

### Common Errors

**1. Target Directory Doesn't Exist**
```
Error: Target directory 'skills/' not found
Action: Create directory structure
Fix: mkdir -p skills/ agents-templates/ .claude/commands/ docs/
```

**2. Permission Denied**
```
Error: Permission denied writing to [path]
Action: Check file permissions
Fix: Verify user has write access to target directories
```

**3. File Already Exists (No Backup)**
```
Warning: [target] already exists
Action: Create backup before overwriting
Fix: Automatically creates .backup-[timestamp] file
```

**4. Invalid Scan Report**
```
Error: No scan report found or scan report is malformed
Action: Run /integration-scan first
Fix: Ensure scan report exists and is properly formatted
```

**5. Source File Missing**
```
Error: File listed in scan report not found in incoming/
Action: File may have been moved or deleted
Fix: Re-run /integration-scan to get current state
```

### Error Recovery

For any failed integrations:
1. File remains in `/INTEGRATION/incoming/`
2. Error logged in integration report
3. User notified of specific issue
4. Can be retried after fixing issue

### Rollback Procedure

If integration needs to be rolled back:
```bash
# Restore from backups (if overwrites occurred)
!cp .claude/commands/file.md.backup-[timestamp] .claude/commands/file.md

# Move files back from processed to incoming
!mv /INTEGRATION/processed/[filename] /INTEGRATION/incoming/

# Delete newly created files (if no backup)
!rm skills/newskill/SKILL.md
!rmdir skills/newskill  # if empty
```

## Security Considerations

### Pre-Integration Checks

Before moving any file:
1. **Verify scan report status**: Only process files marked ✅ Ready
2. **Validate file paths**: Ensure no path traversal attempts (../)
3. **Check file types**: Ensure file extension matches category
4. **Size limits**: Warn if file >1MB (unusual for markdown)

### Safe File Operations

- Always use `cp` before `mv` to ensure target is valid
- Create backups before overwriting existing files
- Verify write operations succeeded before deleting source
- Log all file operations for audit trail

### Permissions

- Ensure target directories are writable
- Don't create files with overly permissive permissions
- Maintain git file permissions where applicable

## Integration with Other Commands

### Before this command:
- `/integration-scan` - REQUIRED: Validates and categorizes files

### After this command:
- `/integration-update-docs` - Updates README, indices, etc.
- `/integration-validate` - Runs comprehensive quality checks
- `git add` and `git commit` - Commit integrated files

### Related agents:
- Integration Manager - Can orchestrate this command
- Builder Agent - May trigger integration after creating new content

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Dependencies**: `/integration-scan` must be run first
**Estimated Runtime**: 5-30 seconds depending on file count
