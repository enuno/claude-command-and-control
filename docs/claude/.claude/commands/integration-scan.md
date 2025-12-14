---
description: "Scan and categorize incoming files in /INTEGRATION directory"
allowed-tools: ["Read", "Bash(find)", "Bash(ls)", "Bash(file)", "Bash(wc)"]
author: "Claude Command and Control"
version: "1.0"
---

# Integration Scan

## Purpose
Scan the `/INTEGRATION/incoming` directory for unprocessed files, categorize them by type (Command, Agent, Skill, Documentation, Other), and generate a detailed report for review.

## Workflow

### 1. Check for Incoming Files
```bash
!find ./INTEGRATION/incoming -type f ! -name '.gitkeep' 2>/dev/null
```

If no files found, display:
```
No files pending in /INTEGRATION/incoming directory.
```
Exit gracefully.

### 2. Scan and Categorize Each File

For each file discovered:

1. **Read file metadata:**
   - File name and path
   - File size
   - Last modified date
   - File type (using `file` command)

2. **Analyze content to categorize:**
   - **Command** - Contains frontmatter with `allowed-tools`, or is named `*-command.md` or matches command patterns
   - **Agent** - Contains "Role:", "Responsibilities:", "Agent" in title or filename matches `*-agent.md`
   - **Skill** - Contains frontmatter with `name:`, `description:`, `when-to-use:`, or filename matches `*-skill.md`
   - **Documentation** - Markdown files with standard doc structure (# headers, no YAML frontmatter)
   - **Other** - Everything else (requires manual review)

3. **Extract key information:**
   - For Commands: Extract `description`, `version`, and `allowed-tools` from frontmatter
   - For Agents: Extract role name and primary responsibilities
   - For Skills: Extract `name`, `description`, and trigger conditions
   - For Docs: Extract title and first paragraph

### 3. Generate Scan Report

Create a structured report at `/INTEGRATION/logs/scan-report-[timestamp].md`:

```markdown
# Integration Scan Report
**Generated**: [ISO 8601 timestamp]
**Scanned Directory**: INTEGRATION/incoming
**Files Found**: [count]

---

## Summary by Category

| Category      | Count | Files                                |
|---------------|-------|--------------------------------------|
| Commands      | X     | file1.md, file2.md                   |
| Agents        | X     | agent1.md                            |
| Skills        | X     | skill1.md, skill2.md                 |
| Documentation | X     | doc1.md                              |
| Other         | X     | unknown.txt                          |

---

## Detailed File Analysis

### Commands (X files)
#### 1. [filename]
- **Path**: INTEGRATION/incoming/filename.md
- **Size**: X KB
- **Modified**: YYYY-MM-DD
- **Description**: [extracted from frontmatter]
- **Version**: [if present]
- **Allowed Tools**: [list]
- **Status**: ✅ Ready for processing | ⚠️ Needs review | ❌ Invalid

[Repeat for each command file]

### Agents (X files)
#### 1. [filename]
- **Path**: INTEGRATION/incoming/filename.md
- **Size**: X KB
- **Role**: [extracted role name]
- **Primary Responsibilities**: [brief list]
- **Status**: ✅ Ready | ⚠️ Review needed

[Repeat for each agent file]

### Skills (X files)
#### 1. [filename]
- **Path**: INTEGRATION/incoming/filename.md
- **Name**: [extracted name]
- **Description**: [brief description]
- **Trigger**: [when to use]
- **Status**: ✅ Ready | ⚠️ Review needed

[Repeat for each skill file]

### Documentation (X files)
[List with basic metadata]

### Other (X files - requires manual review)
[List with metadata]

---

## Recommended Next Steps

1. Review the scan report: `/INTEGRATION/logs/scan-report-[timestamp].md`
2. For files marked ✅ Ready: Run `/integration-process` to move and integrate
3. For files marked ⚠️ Review needed: Manually review before processing
4. For files marked ❌ Invalid: Move to `/INTEGRATION/failed` with error notes

---

## Quality Checks Performed

- [x] File type detection
- [x] Frontmatter validation
- [x] Category classification
- [x] Size and metadata extraction
- [x] Structural analysis
```

### 4. Display Summary to User

After generating the report, display:

```
╔═══════════════════════════════════════════════════╗
║       INTEGRATION SCAN COMPLETED                   ║
╚═══════════════════════════════════════════════════╝

SCANNED: INTEGRATION/incoming
FILES FOUND: [count]

BREAKDOWN:
  • Commands: [count]
  • Agents: [count]
  • Skills: [count]
  • Documentation: [count]
  • Other: [count]

REPORT SAVED: /INTEGRATION/logs/scan-report-[timestamp].md

NEXT STEPS:
  → Review the report above
  → Run '/integration-process' to begin integration
  → Use '/integration-validate' for quality checks

Ready files: [count]
Files needing review: [count]
Invalid files: [count]
```

## Error Handling

- If `/INTEGRATION` directory doesn't exist, inform user and suggest running setup
- If permission errors occur, note them in the report
- If a file cannot be categorized, mark it as "Other" and flag for manual review
- Handle binary files gracefully (skip content analysis)

## Security Considerations

- Only read files, never execute or modify during scan
- Sanitize file paths in reports to prevent injection
- Validate that files are within expected directory boundaries
- Log all scan operations for audit trail

## Integration with Other Commands

- **After this**: Run `/integration-process` to move files to proper locations
- **Before production**: Run `/integration-validate` for comprehensive quality checks
- **For automation**: Can be scheduled to run periodically to detect new files

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Dependencies**: `/INTEGRATION` directory structure must exist
