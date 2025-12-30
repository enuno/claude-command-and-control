---
description: "Automatically update documentation after successful integration"
allowed-tools: ["Read", "Edit", "Bash(find)", "Bash(ls)"]
author: "Claude Command and Control"
version: "1.0"
---

# Integration Update Docs

## Purpose
Automatically update repository documentation (README.md, skill indices, CLAUDE.md) after files have been successfully integrated via `/integration-process`.

## Prerequisites
- `/integration-process` has been run successfully
- Integration report exists with list of integrated files
- Files are in their target locations

## Workflow

### 1. Load Integration Report

```bash
# Find most recent integration report
!ls -t /INTEGRATION/logs/integration-report-*.md | head -1
```

Extract:
- List of integrated files
- File types (Command, Agent, Skill, Documentation)
- Target locations

### 2. Update README.md

#### For Skills

Add entries to the Pre-Built Skills table:

```markdown
### Pre-Built Skills

| Skill | Purpose | Use When |
|-------|---------|----------|
| **skill-creator** | Creates new skills | Building new automation |
| **[NEW]** | [Purpose from description] | [When to use] |
```

**Location in README**: Search for "## 🎯 Claude Skills" section, find the Pre-Built Skills table

**Process**:
1. Read skill frontmatter to get name, description
2. Read skill content to get "When to Use" section
3. Format as table row
4. Insert alphabetically in table

#### For Commands

Add to appropriate command category:

```markdown
#### Integration & Maintenance Commands
- **[integration-scan.md](.claude/commands/integration-scan.md)** - [Description]
- **[NEW-command.md](.claude/commands/NEW-command.md)** - [Description]
```

**Categories**:
- Core Workflow Commands
- Quality Assurance Commands
- Utility Commands
- Integration & Maintenance Commands

#### For Agents

Add to Agent Templates table:

```markdown
| Agent | Purpose | Key Capabilities |
|-------|---------|------------------|
| **[Researcher](agents-templates/researcher.md)** | ... | ... |
| **[NEW Agent](agents-templates/new-agent.md)** | [Purpose] | [Capabilities] |
```

### 3. Update/Create skills/README.md

If `skills/README.md` doesn't exist, create it:

```markdown
# Claude Skills Directory

This directory contains the repository's skill library. Each skill is a reusable workflow automation unit.

## Available Skills

### Development Workflow

| Skill | Description | When to Use |
|-------|-------------|-------------|
| [skill-name](skill-name/SKILL.md) | Description | Use cases |

### Contribution & Sharing

[Similar table]

### Content & Documentation

[Similar table]

### Meta Skills

[Similar table]

## Using Skills

Skills are invoked using the Skill tool:
```
[skill name]
```

For complete documentation, see `docs/best-practices/08-Claude-Skills-Guide.md`

## Creating New Skills

Use the `skill-creator` skill to build new skills:
```
Use the skill-creator skill to help me build a skill for [workflow]
```

See templates in `skills-templates/` for reference.
```

**If exists**, update the appropriate table with new skills.

### 4. Update CLAUDE.md (If Needed)

For significant integrations, update workflow patterns:

```markdown
### Integration & Maintenance
When managing repository content and health:
...
[Add new workflows if commands added]
```

Only update if:
- New commands change workflows
- New skills require special mention
- New agents need orchestration guidance

### 5. Update Index Files

Check for and update any index files:

```bash
# Check for index files
!find . -name "INDEX.md" -o -name "index.md" | grep -v ".git"
```

Update each found index with new content.

### 6. Generate Documentation Update Report

Create `/INTEGRATION/logs/doc-update-report-[timestamp].md`:

```markdown
# Documentation Update Report
**Generated**: [ISO 8601 timestamp]
**Integration Report**: integration-report-[timestamp].md
**Files Documented**: X

---

## Documentation Updates Applied

### README.md
- ✅ Added 6 skills to Pre-Built Skills table
  - content-research-writer
  - root-cause-tracing
  - sharing-skills
  - subagent-driven-development
  - using-git-worktrees
  - using-superpowers

- ✅ Updated Integration & Maintenance section

**Changes**:
```diff
+ | **content-research-writer** | Writing assistance with research | Writing articles, documentation |
+ | **root-cause-tracing** | Systematic debugging | Tracing bugs through call stack |
...
```

### skills/README.md
- ✅ Created skills/README.md (file did not exist)
- ✅ Added all 9 skills to organized tables
- ✅ Created skill categories
- ✅ Added usage instructions

**New File Created**: skills/README.md (250 lines)

### CLAUDE.md
- ⏭️  No updates needed (workflows unchanged)

### Index Files
- ✅ Updated docs/INDEX.md
- ✅ No other index files found

---

## Files Modified

| File | Lines Added | Lines Modified | Status |
|------|-------------|----------------|--------|
| README.md | 6 | 0 | ✅ Updated |
| skills/README.md | 250 | 0 | ✅ Created |
| docs/INDEX.md | 3 | 0 | ✅ Updated |

---

## Cross-Reference Check

Verified all links are valid:
- ✅ All skill links point to existing files
- ✅ All command links valid
- ✅ All agent links valid
- ✅ No broken references introduced

---

## Next Steps

1. ✅ Documentation updated successfully
2. 📋 Review changes with git diff
3. 🧪 Verify links work (click through README)
4. ✅ Ready to commit

### Recommended Git Add

```bash
git add README.md skills/README.md docs/INDEX.md
```

---

**Update Status**: ✅ COMPLETE
**Files Updated**: 3
**New Files Created**: 1
**Broken Links**: 0
```

### 7. Display Summary to User

```
╔═══════════════════════════════════════════════════╗
║       DOCUMENTATION UPDATE COMPLETED               ║
╚═══════════════════════════════════════════════════╝

INTEGRATION REPORT: integration-report-[timestamp].md

DOCUMENTATION UPDATED:
  ✅ README.md - Added X skills/commands/agents
  ✅ skills/README.md - Created with full skill index
  ✅ docs/INDEX.md - Updated with new content
  ⏭️  CLAUDE.md - No updates needed

FILES MODIFIED: 3
  • README.md (+X lines)
  • skills/README.md (new file, 250 lines)
  • docs/INDEX.md (+X lines)

REPORT SAVED: /INTEGRATION/logs/doc-update-report-[timestamp].md

NEXT STEPS:
  1. Review changes: git diff README.md skills/README.md
  2. Verify links work
  3. Commit changes:
     git add README.md skills/README.md docs/INDEX.md
     git commit -m "docs: update for integrated [skills/commands/agents]"

READY TO COMMIT: ✅
```

## Update Logic

### Determining What to Update

Based on file types from integration report:

**Skills integrated?** → Update:
- README.md (Pre-Built Skills table)
- skills/README.md (full index)

**Commands integrated?** → Update:
- README.md (command category section)
- .claude/commands/README.md (if exists)

**Agents integrated?** → Update:
- README.md (Agent Templates table)
- agents-templates/README.md (if exists)

**Documentation integrated?** → Update:
- Appropriate index files
- Table of contents if present

### Smart Updates

- **Alphabetical insertion**: Add entries in alphabetical order
- **Category detection**: Determine correct table/section
- **Duplicate prevention**: Check if entry already exists
- **Format preservation**: Maintain existing markdown formatting
- **Link validation**: Ensure all new links are valid

## Error Handling

### Common Issues

**1. README.md Table Not Found**
```
Warning: Could not locate [table name] in README.md
Action: Skip that update, log warning
Fix: Manually add entry or update table location
```

**2. Malformed Table**
```
Error: Table structure in README.md is malformed
Action: Log error, skip update
Fix: Manually correct table syntax
```

**3. File Already Documented**
```
Info: [filename] already present in README.md
Action: Skip duplicate entry
Result: No change needed
```

**4. Cannot Write to File**
```
Error: Permission denied writing to README.md
Action: Report error, skip updates
Fix: Check file permissions
```

## Safety Mechanisms

### Pre-Update Checks
1. Verify target files exist
2. Check files are writable
3. Validate table structure before editing
4. Confirm no duplicate entries

### Backup Strategy
Before each edit:
```bash
# Create backup
!cp README.md README.md.backup-[timestamp]
```

### Rollback Procedure
If updates fail:
```bash
# Restore from backup
!cp README.md.backup-[timestamp] README.md
```

## Integration with Other Commands

### Before this command:
- `/integration-process` - REQUIRED: Files must be integrated
- `/integration-validate` - RECOMMENDED: Ensure files are valid

### After this command:
- `git diff` - Review changes
- `git add` and `git commit` - Commit documentation updates

### Related skills:
- Documentation Update Skill - Reusable update logic
- File Categorization Skill - Determines where to add entries

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Dependencies**: `/integration-process` must be run first
**Estimated Runtime**: 10-30 seconds depending on number of files
