---
description: "Run comprehensive quality checks on integrated files"
allowed-tools: ["Read", "Bash(find)", "Bash(grep)", "Bash(yamllint)", "Bash(markdownlint)"]
author: "Claude Command and Control"
version: "1.0"
---

# Integration Validate

## Purpose
Perform comprehensive quality assurance checks on recently integrated files to ensure they meet repository standards, are properly structured, and integrate correctly with existing content.

## Prerequisites
- Files have been integrated via `/integration-process`
- Integration report exists at `/INTEGRATION/logs/integration-report-[timestamp].md`

## Workflow

### 1. Load Integration Report

```bash
# Find most recent integration report
!ls -t /INTEGRATION/logs/integration-report-*.md | head -1
```

Read the report to identify which files were integrated and where.

### 2. Structure Validation

For each integrated file, verify:

#### YAML Frontmatter Validation
```bash
# Check that frontmatter is valid YAML
# For skills
!head -20 skills/*/SKILL.md | grep -A 10 "^---"

# For commands
!head -20 .claude/commands/*.md | grep -A 10 "^---"

# For agents
!head -20 agents-templates/*.md
```

**Validation Checks:**
- ✅ Frontmatter starts with `---` and ends with `---`
- ✅ Required fields present (varies by type)
- ✅ YAML syntax is valid
- ✅ No duplicate keys

#### Required Fields by Type

**Skills:**
- `name:` - Skill identifier
- `description:` - What the skill does

**Commands:**
- `description:` - What the command does
- `allowed-tools:` - Tool permissions array
- `author:` - Creator
- `version:` - Semantic version

**Agents:**
- Agent Identity section with Role, Version, Purpose
- Core Responsibilities
- Allowed Tools and Permissions

### 3. Documentation Consistency

Check cross-references and links:

```bash
# Find all markdown links
!grep -r "\[.*\](.*)" skills/ agents-templates/ .claude/commands/ | grep -v ".git"

# Check for broken relative paths
# Verify referenced files exist
```

**Validation Checks:**
- ✅ All `@filename` references point to existing files
- ✅ All relative links are valid
- ✅ No broken cross-references
- ✅ Referenced commands/agents/skills exist

### 4. Security Audit

Scan for security concerns:

```bash
# Check for hardcoded credentials
!grep -ri "password\|api_key\|secret\|token" skills/ agents-templates/ .claude/commands/ --exclude-dir=.git

# Check for overly permissive tool access
!grep "allowed-tools.*Bash(\*)" .claude/commands/*.md

# Check for path traversal patterns
!grep "\.\./\|\.\.\\\" skills/ agents-templates/ .claude/commands/
```

**Security Checks:**
- ✅ No hardcoded credentials (passwords, API keys, tokens)
- ✅ No overly permissive `allowed-tools: ["Bash(*)"]`
- ✅ No path traversal attempts (`../`)
- ✅ No command injection vulnerabilities
- ✅ Input validation for dynamic values
- ✅ No base64-encoded secrets

### 5. Quality Scoring

For each integrated file, calculate quality score:

**Skills (out of 100):**
- Valid frontmatter: 20 points
- Clear description: 15 points
- "When to Use" section: 15 points
- Examples with real data: 20 points
- No security issues: 30 points

**Commands (out of 100):**
- Valid frontmatter: 20 points
- Clear description: 10 points
- Restricted allowed-tools: 25 points
- Workflow documented: 15 points
- Error handling: 10 points
- No security issues: 20 points

**Agents (out of 100):**
- Clear role definition: 20 points
- Workflow patterns: 20 points
- Restricted permissions: 25 points
- Context management: 15 points
- No security issues: 20 points

### 6. Integration Checks

Verify files integrate properly with repository:

```bash
# Check naming conventions
!ls skills/*/SKILL.md | sed 's|skills/||; s|/SKILL.md||' | sort

# Verify directory structure
!find skills/ -type f -name "SKILL.md" -o -type f -name "README.md"

# Check for duplicate names
!find skills/ -name "SKILL.md" -exec basename {} \; | sort | uniq -d
```

**Integration Checks:**
- ✅ File naming follows conventions
- ✅ Directory structure is correct
- ✅ No duplicate skill/command/agent names
- ✅ Files are in expected locations
- ✅ No orphaned files

### 7. Markdown Syntax Validation

Check markdown formatting:

```bash
# Basic syntax check
!grep -n "^#\{7,\}" skills/*/SKILL.md  # Too many header levels
!grep -n "\[\]\(" skills/*/SKILL.md   # Empty link text
!grep -n "^-.*-$" skills/*/SKILL.md   # Horizontal rules
```

**Markdown Checks:**
- ✅ Headers use proper levels (# to ######)
- ✅ Lists are properly formatted
- ✅ Code blocks have closing backticks
- ✅ No empty links
- ✅ Tables are well-formed

### 8. Generate Validation Report

Create `/INTEGRATION/logs/validation-report-[timestamp].md`:

```markdown
# Integration Validation Report
**Generated**: [ISO 8601 timestamp]
**Integration Report**: integration-report-[timestamp].md
**Files Validated**: X

---

## Overall Results

| Category | Files | Avg Score | Pass Rate |
|----------|-------|-----------|-----------|
| Skills   | X     | Y/100     | Z%        |
| Commands | X     | Y/100     | Z%        |
| Agents   | X     | Y/100     | Z%        |
| **Total** | **X** | **Y/100** | **Z%** |

**Overall Status**: [✅ PASS | ⚠️ WARNINGS | ❌ FAIL]

---

## Detailed Validation Results

### Skills

#### content-research-writer
- **Location**: skills/content-research-writer/SKILL.md
- **Quality Score**: 95/100
- **Structure**: ✅ Valid
- **Security**: ✅ No issues
- **Documentation**: ✅ Complete
- **Issues**: None
- **Recommendations**: None

#### root-cause-tracing
[Similar structure for each skill]

### Commands

[Detailed results for each command]

### Agents

[Detailed results for each agent]

---

## Security Audit Results

### Critical Issues (Must Fix): 0
[List any critical security issues found]

### Warnings (Should Fix): 0
[List security warnings]

### Information: 0
[List informational security notes]

**Security Status**: ✅ No critical issues found

---

## Structure Validation

### Frontmatter Validation
- ✅ All files have valid YAML frontmatter
- ✅ Required fields present in all files
- ✅ No syntax errors

### File Organization
- ✅ All files in correct directories
- ✅ Naming conventions followed
- ✅ No duplicate names

### Cross-References
- ✅ All internal links valid
- ✅ All referenced files exist
- ⚠️ 2 external links not verified (require network)

---

## Quality Issues Found

### High Priority (Fix Before Commit): 0
[List critical quality issues]

### Medium Priority (Fix Soon): 0
[List medium priority issues]

### Low Priority (Nice to Have): 0
[List cosmetic or minor issues]

**Quality Status**: ✅ No blocking issues

---

## Integration Consistency

### Repository Standards Compliance
- ✅ Follows Document 02 standards (Commands)
- ✅ Follows Document 03 standards (Agents)
- ✅ Follows Document 08 standards (Skills)

### Documentation Coverage
- ✅ All skills have "When to Use" sections
- ✅ All commands have workflow documentation
- ✅ All agents have role definitions

### Example Quality
- ✅ Examples use real data (not placeholders)
- ✅ Examples are comprehensive
- ✅ Examples follow best practices

---

## Recommendations

### Immediate Actions
[None if all validations passed]

### Future Improvements
1. Consider adding more examples to [file]
2. Add error handling documentation to [file]
3. Cross-reference with related skills in [file]

---

## File-by-File Summary

| File | Type | Score | Security | Structure | Issues |
|------|------|-------|----------|-----------|--------|
| content-research-writer/SKILL.md | Skill | 95/100 | ✅ | ✅ | 0 |
| root-cause-tracing/SKILL.md | Skill | 98/100 | ✅ | ✅ | 0 |
| sharing-skills/SKILL.md | Skill | 100/100 | ✅ | ✅ | 0 |
| subagent-driven-development/SKILL.md | Skill | 100/100 | ✅ | ✅ | 0 |
| using-git-worktrees/SKILL.md | Skill | 98/100 | ✅ | ✅ | 0 |
| using-superpowers/SKILL.md | Skill | 100/100 | ✅ | ✅ | 0 |

---

## Test Recommendations

For each integrated file, recommended tests:

### Skills
1. **using-superpowers**: Test skill discovery workflow
2. **using-git-worktrees**: Create test worktree
3. **subagent-driven-development**: Execute 2-task plan
4. **root-cause-tracing**: Apply to sample bug
5. **sharing-skills**: Dry-run PR creation
6. **content-research-writer**: Write test section

### Commands
[Test recommendations for commands]

### Agents
[Test recommendations for agents]

---

## Validation Statistics

**Execution Time**: [seconds]
**Files Scanned**: X
**Total Checks Performed**: Y
**Issues Found**: Z
**Critical Issues**: 0
**Warnings**: 0
**Pass Rate**: 100%

---

## Next Steps

1. ✅ Validation complete - All files passed
2. 🔄 Run `/integration-update-docs` to update README
3. 🧪 Execute recommended tests
4. ✅ Ready to commit

### If Issues Found:
1. Review detailed results above
2. Fix critical issues before committing
3. Address warnings when possible
4. Re-run validation after fixes
5. Commit only when validation passes

---

**Validation Status**: ✅ COMPLETE
**Ready for Commit**: [Yes/No]
**Recommended Action**: [Commit|Fix Issues|Review Warnings]
```

### 9. Display Summary to User

```
╔═══════════════════════════════════════════════════╗
║       INTEGRATION VALIDATION COMPLETED             ║
╚═══════════════════════════════════════════════════╝

FILES VALIDATED: X
AVERAGE QUALITY SCORE: Y/100

RESULTS:
  ✅ Structure: All valid
  ✅ Security: No issues found
  ✅ Quality: Z% pass rate
  ✅ Integration: Consistent

ISSUES FOUND:
  ❌ Critical: 0
  ⚠️  Warnings: 0
  ℹ️  Info: 0

REPORT SAVED: /INTEGRATION/logs/validation-report-[timestamp].md

STATUS: [✅ READY TO COMMIT | ⚠️ REVIEW WARNINGS | ❌ FIX ISSUES]

NEXT STEPS:
  [If all passed]
  → Run '/integration-update-docs' to update README
  → Test integrated files
  → Commit with confidence ✅

  [If issues found]
  → Review validation report for details
  → Fix critical issues before committing
  → Re-run validation after fixes
```

## Error Handling

### Common Issues

**1. Invalid YAML Frontmatter**
```
Error: Frontmatter syntax error in [file]
Action: Review YAML syntax, check for unclosed quotes, missing colons
Fix: Edit file to correct YAML structure
```

**2. Security Violation**
```
Warning: Hardcoded credential found in [file]:[line]
Action: Remove credential, use environment variable instead
Fix: Replace with placeholder and document in setup guide
```

**3. Broken Cross-Reference**
```
Warning: Referenced file '[path]' does not exist
Action: Update link or create missing file
Fix: Correct the reference path or remove broken link
```

**4. Overly Permissive Tools**
```
Error: Command '[name]' grants unrestricted bash access
Action: Restrict allowed-tools to specific commands
Fix: Change ["Bash(*)"] to specific tool list
```

## Validation Levels

Can run at different thoroughness levels:

**Quick Validation** (30 seconds):
- Structure checks only
- Security scan
- Basic quality metrics

**Standard Validation** (1-2 minutes):
- All quick checks
- Cross-reference validation
- Markdown syntax
- Quality scoring

**Comprehensive Validation** (3-5 minutes):
- All standard checks
- Deep security audit
- Lint all markdown
- Validate all examples
- Test cross-references

## Integration with Other Commands

### Before this command:
- `/integration-process` - Files must be integrated first

### After this command:
- `/integration-update-docs` - If validation passes
- Manual fixes - If validation fails

### Related agents:
- Validator Agent - Can run this command
- Integration Manager - Includes this in workflow

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Dependencies**: `/integration-process` must be run first
**Estimated Runtime**: 30 seconds - 5 minutes depending on validation level
