---
description: "Scan repository for stale files (>30 days old) and generate maintenance report"
allowed-tools: ["Read", "Bash(find)", "Bash(git:log)", "Bash(stat)", "Bash(ls)"]
author: "Claude Command and Control"
version: "1.0"
---

# Maintenance Scan

## Purpose
Scan the entire repository for files that haven't been modified in more than 30 days, categorize them by type and importance, and generate a prioritized maintenance report for review.

## Workflow

### 1. Define Scan Parameters

**Exclusions** (directories/files to skip):
- `.git/`
- `node_modules/`
- `venv/`, `__pycache__/`, `.pyc` files
- `/INTEGRATION/`
- `/MAINTENANCE/logs/`
- `SESSION_LOG.md`
- `.DS_Store`, `.gitkeep`
- Binary files (images, PDFs, archives)

**Threshold**: Files not modified in last 30 days

**Priority Levels**:
- **High**: Core documentation, agent templates, command files
- **Medium**: Supporting docs, skill templates, examples
- **Low**: Archives, deprecated files, experimental code

### 2. Scan Repository

```bash
# Find all files modified more than 30 days ago, excluding directories
!find . -type f -mtime +30 \
  ! -path './.git/*' \
  ! -path './node_modules/*' \
  ! -path './*venv*/*' \
  ! -path './__pycache__/*' \
  ! -path './INTEGRATION/*' \
  ! -path './MAINTENANCE/logs/*' \
  ! -name '*.pyc' \
  ! -name '.DS_Store' \
  ! -name '.gitkeep' \
  ! -name 'SESSION_LOG.md' \
  -exec stat -f "%Sm %N" -t "%Y-%m-%d" {} \;
```

### 3. Categorize Stale Files

For each discovered file, determine:

1. **File Type**:
   - Command (`.claude/commands/*.md`)
   - Agent Template (`agents-templates/*.md`, `templates/agents/*.md`)
   - Skill Template (`skills-templates/*.md`, `templates/skills/*.md`, `skills/*/*.md`)
   - Best Practice Doc (`docs/best-practices/*.md`)
   - Core Config (`CLAUDE.md`, `README.md`, `AGENTS.md`)
   - Supporting Doc (other `.md` files)
   - Code File (`.py`, `.js`, `.sh`, etc.)
   - Other

2. **Priority Level**:
   - **High Priority**:
     - Core documentation (`CLAUDE.md`, `README.md`, `AGENTS.md`)
     - Best practices docs (`docs/best-practices/*.md`)
     - Active command files (`.claude/commands/*.md`)
     - Agent and skill templates
   - **Medium Priority**:
     - Supporting documentation
     - Example files
     - Template variations
   - **Low Priority**:
     - Archived files
     - Experimental code
     - Deprecated templates

3. **Staleness Degree**:
   - 30-60 days: 🟡 Moderately stale
   - 61-90 days: 🟠 Quite stale
   - 91+ days: 🔴 Very stale

### 4. Generate Maintenance Report

Create `/MAINTENANCE/todo/stale-files-[timestamp].md`:

```markdown
# Stale Files Maintenance Report
**Generated**: [ISO 8601 timestamp]
**Threshold**: Files not modified in 30+ days
**Total Stale Files**: [count]

---

## Executive Summary

| Priority | Count | Avg Age (days) | Oldest File |
|----------|-------|----------------|-------------|
| High     | X     | Y              | file.md (Z days) |
| Medium   | X     | Y              | file.md (Z days) |
| Low      | X     | Y              | file.md (Z days) |

**Staleness Distribution**:
- 🟡 Moderately stale (30-60 days): X files
- 🟠 Quite stale (61-90 days): X files
- 🔴 Very stale (91+ days): X files

---

## High Priority Files (Requires Immediate Review)

### Best Practice Documentation
| File | Last Modified | Age | Staleness | Action Needed |
|------|---------------|-----|-----------|---------------|
| docs/best-practices/XX.md | YYYY-MM-DD | X days | 🟡/🟠/🔴 | Research latest patterns, update examples |

### Command Files
| File | Last Modified | Age | Staleness | Action Needed |
|------|---------------|-----|-----------|---------------|
| .claude/commands/example.md | YYYY-MM-DD | X days | 🟡/🟠/🔴 | Test with current Claude version, update syntax |

### Agent Templates
| File | Last Modified | Age | Staleness | Action Needed |
|------|---------------|-----|-----------|---------------|
| templates/agents/example.md | YYYY-MM-DD | X days | 🟡/🟠/🔴 | Validate against Doc 03, update permissions |

### Skill Templates
| File | Last Modified | Age | Staleness | Action Needed |
|------|---------------|-----|-----------|---------------|
| templates/skills/example.md | YYYY-MM-DD | X days | 🟡/🟠/🔴 | Test workflows, update trigger conditions |

---

## Medium Priority Files (Review When Possible)

### Supporting Documentation
[Table format similar to above]

### Example Files
[Table format similar to above]

---

## Low Priority Files (Archive or Review Later)

[Table format similar to above]

---

## Recommended Actions by File

### High Priority Batch 1 (Immediate)
- [ ] **docs/best-practices/XX.md** (X days old)
  - Research: Latest Claude Code features, agent orchestration patterns
  - Update: Examples, version numbers, deprecated syntax
  - Validate: Against current repository structure

- [ ] **.claude/commands/example.md** (X days old)
  - Test: Run command with current Claude version
  - Update: Allowed-tools if needed, command syntax
  - Document: Any breaking changes

[Continue for each high-priority file]

### Medium Priority Batch
[Similar checklist format]

### Low Priority / Candidates for Deprecation
- [ ] **path/to/file** (X days old) - Consider archiving or removing

---

## Research Topics Identified

Based on stale files, the following research topics are recommended:

1. **[Topic Area]** (e.g., "Agent Orchestration Patterns")
   - Affected Files: [list]
   - Research Questions:
     - What are the latest best practices for [topic]?
     - Have any libraries/tools been deprecated?
     - Are there new Claude features that improve this?
   - Priority: High/Medium/Low

2. **[Topic Area]**
   [Similar structure]

---

## Integration with Maintenance Workflow

### Next Steps:

1. **Review this report**: Prioritize files based on your current needs

2. **For High Priority files**:
   ```
   /maintenance-review path/to/stale-file.md
   ```
   This will trigger the Maintenance Manager Agent to:
   - Research latest best practices
   - Propose updates or new templates
   - Generate action items for DEVELOPMENT_PLAN.md

3. **Bulk processing**:
   Run `/maintenance-review` with `--batch` flag to process multiple files

4. **Schedule regular scans**:
   Set up monthly `/maintenance-scan` runs to catch staleness early

---

## Statistics

**Scan Coverage**:
- Total files scanned: [count]
- Files excluded (binary, ignored dirs): [count]
- Files analyzed: [count]
- Stale files identified: [count]
- Staleness rate: [percentage]%

**Age Distribution**:
```
30-45 days:  ████████████░░░░░░░░ X files
46-60 days:  ███████░░░░░░░░░░░░░ X files
61-75 days:  ████░░░░░░░░░░░░░░░░ X files
76-90 days:  ██░░░░░░░░░░░░░░░░░░ X files
90+ days:    █░░░░░░░░░░░░░░░░░░░ X files
```

**By File Type**:
- Commands: X stale / Y total ([percentage]%)
- Agents: X stale / Y total ([percentage]%)
- Skills: X stale / Y total ([percentage]%)
- Docs: X stale / Y total ([percentage]%)
- Code: X stale / Y total ([percentage]%)
- Other: X stale / Y total ([percentage]%)

---

## Health Score

**Repository Freshness Score**: [X]/100

Calculated based on:
- % of high-priority files up to date (40% weight)
- % of medium-priority files up to date (30% weight)
- % of low-priority files up to date (10% weight)
- Average age of stale files (20% weight)

**Interpretation**:
- 90-100: Excellent - Repository is well-maintained
- 75-89: Good - Some files need attention
- 60-74: Fair - Maintenance backlog exists
- <60: Poor - Significant maintenance required

---

## Report Metadata

- **Scan Duration**: [seconds]
- **Files Processed**: [count]/[total]
- **Errors Encountered**: [count]
- **Report Path**: /MAINTENANCE/todo/stale-files-[timestamp].md
- **Next Recommended Scan**: [date 30 days from now]
```

### 5. Display Summary to User

```
╔═══════════════════════════════════════════════════╗
║       MAINTENANCE SCAN COMPLETED                   ║
╚═══════════════════════════════════════════════════╝

REPOSITORY: claude-command-and-control
THRESHOLD: 30+ days

STALE FILES FOUND: [count]
  🔴 High Priority: [count]
  🟠 Medium Priority: [count]
  🟡 Low Priority: [count]

STALENESS BREAKDOWN:
  🟡 Moderately stale (30-60 days): [count]
  🟠 Quite stale (61-90 days): [count]
  🔴 Very stale (91+ days): [count]

REPOSITORY HEALTH SCORE: [X]/100

REPORT SAVED: /MAINTENANCE/todo/stale-files-[timestamp].md

NEXT STEPS:
  → Review high-priority files first
  → Run '/maintenance-review <file>' to research updates
  → Use '/maintenance-plan-update' to add items to dev plan

OLDEST FILE: [filename] ([X] days)
FRESHEST STALE FILE: [filename] ([X] days)
```

### 6. Generate Quick Action List

For immediate use, create `/MAINTENANCE/todo/quick-actions-[timestamp].md`:

```markdown
# Quick Maintenance Actions - [Date]

## Review These Files First (Top 5 Priority)

1. [ ] `path/to/file1.md` - [X days old] - [Brief reason]
2. [ ] `path/to/file2.md` - [X days old] - [Brief reason]
3. [ ] `path/to/file3.md` - [X days old] - [Brief reason]
4. [ ] `path/to/file4.md` - [X days old] - [Brief reason]
5. [ ] `path/to/file5.md` - [X days old] - [Brief reason]

## Commands to Run

```bash
# Review individual files
/maintenance-review path/to/file1.md

# Batch review high priority
/maintenance-review --batch --priority high

# Update development plan with findings
/maintenance-plan-update
```

## Research Topics

1. [ ] Research: [Topic identified from stale files]
2. [ ] Research: [Another topic]

---

For full details, see: /MAINTENANCE/todo/stale-files-[timestamp].md
```

## Error Handling

- If no stale files found, display success message and congratulate on repository health
- Handle permission errors gracefully and note them in report
- If excluded directories don't exist, continue scan without error
- Log any files that cannot be read or analyzed

## Performance Considerations

- For large repositories (>1000 files), show progress indicator
- Process files in batches of 100 to avoid memory issues
- Cache file metadata to speed up subsequent scans
- Use parallel processing for file analysis if possible

## Integration with Other Commands

- **After this**: Run `/maintenance-review` on priority files
- **Then**: Use `/maintenance-plan-update` to add tasks to DEVELOPMENT_PLAN.md
- **Automate**: Schedule monthly runs via CI/CD or cron job

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Dependencies**: `/MAINTENANCE` directory structure must exist
**Estimated Runtime**: 5-30 seconds depending on repository size
