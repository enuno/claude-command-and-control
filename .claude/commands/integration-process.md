---
description: "Process validated files from integration scan and move to proper locations with batch processing support"
allowed-tools: ["Read", "Bash(mv)", "Bash(cp)", "Bash(mkdir)", "Bash(ls)", "Edit", "Task"]
author: "Claude Command and Control"
version: "2.0"
---

# Integration Process

## Purpose
Process files that have been validated by `/integration-scan`, moving them to appropriate target locations, creating backups, and generating integration reports.

**Supports Two Modes**:
1. **Standard Mode**: Process files sequentially (1-10 files)
2. **Batch Mode**: Process large volumes in parallel (10+ files)

## Prerequisites
- `/integration-scan` must have been run
- Scan report exists at `/INTEGRATION/logs/scan-report-[timestamp].md`
- Files marked as ✅ Ready in scan report

## Mode Selection

### Determine Processing Mode

After loading scan report, check file count:

```
If files_to_process >= 10:
  → Use BATCH MODE (parallel processing)
Else:
  → Use STANDARD MODE (sequential processing)
```

**Batch Mode Advantages** (10+ files):
- Parallel processing of independent file types
- Faster overall completion
- Optimized resource utilization
- Progress tracking across workers

**Standard Mode Advantages** (1-10 files):
- Simpler execution
- Easier debugging
- Lower overhead
- Sequential audit trail

---

## Standard Mode Workflow

Use for 1-10 files. Sequential processing.

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

---

## Batch Mode Workflow

Use for 10+ files. Parallel processing by category.

### 1. Load and Analyze Scan Report

```bash
!ls -t /INTEGRATION/logs/scan-report-*.md | head -1
```

Read scan report and categorize files:
```
Commands: [count] files
Agents: [count] files
Skills: [count] files
Documentation: [count] files

Total: [count] files (≥10, using BATCH MODE)
```

### 2. Organize into Processing Groups

**Group files by category** for parallel processing:

```markdown
**Batch 1**: Commands (Worker 1)
- command1.md
- command2.md
- command3.md

**Batch 2**: Agents (Worker 2)
- agent1.md
- agent2.md

**Batch 3**: Skills (Worker 3)
- skill1.md
- skill2.md
- skill3.md
- skill4.md
- skill5.md

**Batch 4**: Documentation (Worker 4)
- doc1.md
- doc2.md
```

### 3. Display Batch Processing Plan

```
╔═══════════════════════════════════════════════════╗
║       BATCH INTEGRATION STARTING                   ║
╚═══════════════════════════════════════════════════╝

MODE: Batch Processing (Parallel)
SCAN REPORT: [filename]
TOTAL FILES: [count]

PARALLEL PROCESSING PLAN:

Worker 1 - Commands ([count] files)
  → Target: .claude/commands/
  → Estimated time: [X] seconds

Worker 2 - Agents ([count] files)
  → Target: agents-templates/
  → Estimated time: [Y] seconds

Worker 3 - Skills ([count] files)
  → Target: skills/*/SKILL.md
  → Estimated time: [Z] seconds

Worker 4 - Documentation ([count] files)
  → Target: docs/*/
  → Estimated time: [W] seconds

EXPECTED COMPLETION: [max(X,Y,Z,W)] seconds
OPTIMIZATION: [percentage]% faster than sequential

Proceed with parallel batch integration? [Confirm]
```

### 4. Spawn Parallel Workers

**IMPORTANT**: Use single message with multiple Task tool calls.

```
Task 1: Process all Commands
  - Read scan report
  - Filter for Command category
  - Process each command file
  - Report results

Task 2: Process all Agents
  - Read scan report
  - Filter for Agent category
  - Process each agent file
  - Report results

Task 3: Process all Skills
  - Read scan report
  - Filter for Skill category
  - Process each skill file (create directories)
  - Report results

Task 4: Process all Documentation
  - Read scan report
  - Filter for Documentation category
  - Process each doc file
  - Report results

All tasks spawn simultaneously.
```

**Worker Task Template**:
```markdown
BATCH PROCESSING TASK: [Category]

Input:
- Scan report: [path]
- Category filter: [Command|Agent|Skill|Documentation]
- Source directory: /INTEGRATION/incoming/
- Target directory: [category-specific]

Process:
1. Read scan report
2. Extract files for this category
3. For each file:
   a. Check if target exists (backup if needed)
   b. Copy to target location
   c. Verify copy succeeded
   d. Move original to /INTEGRATION/processed/
   e. Log operation
4. Count successes/failures
5. Generate category report

Output:
- Category integration report
- Success count
- Failure count (if any)
- Backup count

Timeline: Complete within 60 seconds
```

### 5. Monitor Parallel Execution

While workers are processing:

```
BATCH INTEGRATION IN PROGRESS...

Worker 1 (Commands): ⏳ Processing...
Worker 2 (Agents): ⏳ Processing...
Worker 3 (Skills): ⏳ Processing...
Worker 4 (Docs): ⏳ Processing...

[Updates as workers complete]

Worker 2 (Agents): ✅ Complete (2/2 files)
Worker 1 (Commands): ✅ Complete (3/3 files)
Worker 4 (Docs): ✅ Complete (2/2 files)
Worker 3 (Skills): ⏳ Processing 4/5...
Worker 3 (Skills): ✅ Complete (5/5 files)

ALL WORKERS COMPLETE
```

### 6. Aggregate Results

Once all parallel workers complete:

**Read all category reports**:
```bash
# Each worker generated a partial report
!ls /INTEGRATION/logs/batch-commands-*.md
!ls /INTEGRATION/logs/batch-agents-*.md
!ls /INTEGRATION/logs/batch-skills-*.md
!ls /INTEGRATION/logs/batch-docs-*.md
```

**Combine statistics**:
```
Total Processed: [sum of all categories]
Total Successes: [sum of successes]
Total Failures: [sum of failures]
Total Backups: [sum of backups created]

Processing Time: [duration]
Speed vs Sequential: [percentage]% faster
```

### 7. Generate Unified Batch Report

Create `/INTEGRATION/logs/batch-integration-report-[timestamp].md`:

```markdown
# Batch Integration Report - [Date/Time]

**Mode**: Batch Processing (Parallel)
**Scan Report**: [filename]
**Workers**: 4 (parallel execution)
**Total Files**: X
**Processing Time**: [duration]
**Speed Improvement**: [percentage]% vs sequential

---

## Batch Processing Summary

| Worker | Category | Files | Successes | Failures | Backups | Time |
|--------|----------|-------|-----------|----------|---------|------|
| 1 | Commands | 3 | 3 | 0 | 1 | 15s |
| 2 | Agents | 2 | 2 | 0 | 0 | 12s |
| 3 | Skills | 5 | 5 | 0 | 0 | 25s |
| 4 | Docs | 2 | 2 | 0 | 0 | 10s |
| **Total** | **All** | **12** | **12** | **0** | **1** | **25s** |

**Overall Success Rate**: 100%
**Bottleneck Worker**: Worker 3 (Skills - 25s)
**Optimization**: Well-balanced workload

---

## Integration Details by Category

### Commands Integration (Worker 1)

**Files Processed**: 3
**Target Directory**: .claude/commands/
**Status**: ✅ All successful

| File | Target | Status | Backed Up |
|------|--------|--------|-----------|
| integration-parallel.md | .claude/commands/integration-parallel.md | ✅ | Yes |
| maintenance-batch.md | .claude/commands/maintenance-batch.md | ✅ | No |
| cleanup-stale.md | .claude/commands/cleanup-stale.md | ✅ | No |

### Agents Integration (Worker 2)

**Files Processed**: 2
**Target Directory**: agents-templates/
**Status**: ✅ All successful

| File | Target | Status | Backed Up |
|------|--------|--------|-----------|
| validator.md | agents-templates/validator.md | ✅ | No |
| scribe.md | agents-templates/scribe.md | ✅ | No |

### Skills Integration (Worker 3)

**Files Processed**: 5
**Target Directory**: skills/*/SKILL.md
**Status**: ✅ All successful

| File | Target | Status | Directory Created |
|------|--------|--------|-------------------|
| debugging-skill.md | skills/debugging/SKILL.md | ✅ | Yes |
| testing-skill.md | skills/testing/SKILL.md | ✅ | Yes |
| refactoring-skill.md | skills/refactoring/SKILL.md | ✅ | Yes |
| deployment-skill.md | skills/deployment/SKILL.md | ✅ | Yes |
| monitoring-skill.md | skills/monitoring/SKILL.md | ✅ | Yes |

### Documentation Integration (Worker 4)

**Files Processed**: 2
**Target Directory**: docs/best-practices/
**Status**: ✅ All successful

| File | Target | Status | Backed Up |
|------|--------|--------|-----------|
| 09-Parallel-Processing.md | docs/best-practices/09-Parallel-Processing.md | ✅ | No |
| 10-Batch-Operations.md | docs/best-practices/10-Batch-Operations.md | ✅ | No |

---

## Performance Analysis

**Parallel Execution Timeline**:
```
0s    - All workers started simultaneously
12s   - Worker 2 (Agents) completed
15s   - Worker 1 (Commands) completed
10s   - Worker 4 (Docs) completed
25s   - Worker 3 (Skills) completed ← Bottleneck

Total: 25 seconds
```

**Sequential Estimation**:
```
Commands: 15s
Agents: 12s
Skills: 25s
Docs: 10s
Total: 62 seconds
```

**Speed Improvement**: 59.7% faster (37s saved)

**Load Balancing Assessment**:
- Worker distribution: Good (3+2+5+2 files)
- Time variance: Acceptable (12-25s range)
- Bottleneck: Skills worker (most files + directory creation)
- **Recommendation**: Consider splitting Skills into 2 workers for 10+ skills

---

## Backup Manifest

**Backups Created**: 1

| Original | Backup | Timestamp |
|----------|--------|-----------|
| .claude/commands/integration-parallel.md | .claude/commands/integration-parallel.md.backup-20251123-0830 | 2025-11-23 08:30:45 |

---

## Processed Files Archive

All original files moved to: /INTEGRATION/processed/

| File | Archive Location | Timestamp |
|------|------------------|-----------|
| integration-parallel.md | /INTEGRATION/processed/integration-parallel.md | 2025-11-23 08:30:45 |
| maintenance-batch.md | /INTEGRATION/processed/maintenance-batch.md | 2025-11-23 08:30:46 |
| [... all 12 files listed] | | |

---

## Next Steps

1. ✅ Files successfully integrated across all categories
2. 🔄 Run `/integration-update-docs` to update documentation indices
3. 🔄 Run `/integration-validate` for quality assurance
4. 📝 Review integrated files by category
5. 🧪 Test new commands/agents/skills
6. ✅ Commit changes with batch integration message

### Recommended Git Commit Message

```
integrate: batch process 12 new components

Parallel batch integration of:
- 3 commands (integration-parallel, maintenance-batch, cleanup-stale)
- 2 agents (validator, scribe)
- 5 skills (debugging, testing, refactoring, deployment, monitoring)
- 2 docs (09-Parallel-Processing, 10-Batch-Operations)

Batch processing completed in 25s (59.7% faster than sequential).
All files validated by integration-scan.

Workers: 4 (parallel execution)
Success rate: 100%
```

---

**Report Status**: ✅ COMPLETE
**Integration Mode**: Batch (Parallel)
**Workers**: 4
**Success Rate**: 100%
**Processing Time**: 25 seconds
**Action Required**: Run /integration-update-docs
```

### 8. Display Batch Summary

```
╔═══════════════════════════════════════════════════╗
║       BATCH INTEGRATION COMPLETED                  ║
╚═══════════════════════════════════════════════════╝

BATCH MODE: Parallel Processing
WORKERS: 4 (Commands, Agents, Skills, Docs)

FILES PROCESSED: 12
  ✅ Successfully integrated: 12
  ❌ Failed: 0
  ⏭️  Skipped: 0

INTEGRATION BREAKDOWN:
  • Commands: 3 → .claude/commands/
  • Agents: 2 → agents-templates/
  • Skills: 5 → skills/*/SKILL.md
  • Documentation: 2 → docs/best-practices/

PERFORMANCE:
  ⏱️  Batch completion: 25 seconds
  🚀 Speed improvement: 59.7% vs sequential
  ⚖️  Load balance: Good

BACKUPS CREATED: 1
  See batch report for locations

REPORT SAVED: /INTEGRATION/logs/batch-integration-report-[timestamp].md

PROCESSED FILES ARCHIVED: /INTEGRATION/processed/

NEXT STEPS:
  1. Run '/integration-update-docs' to update indices
  2. Run '/integration-validate' for QA
  3. Test integrated components
  4. Commit with batch message (see report)
```

---

## Batch Mode Best Practices

### Optimal Batch Composition

**Balanced Distribution**:
- Distribute files evenly across workers
- Mix simple and complex files within each worker
- Target similar completion times

**Category-Based Workers**:
- Commands → Worker 1
- Agents → Worker 2
- Skills → Worker 3
- Documentation → Worker 4

**Avoid Bottlenecks**:
- If Skills >10, split into 2 workers
- If any category >15 files, consider sub-batching
- Monitor worker completion times, adjust future batches

### When to Use Sub-Batching

**For very large batches (30+ files)**:

```
Batch 1 (Workers 1-4): Files 1-15
Wait for completion
Aggregate results

Batch 2 (Workers 1-4): Files 16-30
Wait for completion
Aggregate results

Combine all batch reports
```

### Error Handling in Batch Mode

**One Worker Fails**:
- Other workers continue
- Re-run failed worker separately
- Aggregate partial results

**Multiple Workers Fail**:
- Abort remaining workers
- Investigate root cause
- Retry entire batch after fix

**Partial Success**:
- Accept successful integrations
- Document failures in report
- Manually process failed files

---

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

**Version**: 2.0
**Last Updated**: November 23, 2025
**Dependencies**: `/integration-scan` must be run first
**Estimated Runtime**:
- Standard Mode: 5-30 seconds (1-10 files)
- Batch Mode: 15-60 seconds (10+ files, parallel processing)
**New in 2.0**: Batch mode with parallel processing for 10+ files
