---
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(npm audit:*), Bash(npm outdated:*), Read(*), Write(*), Edit(*), Grep(*)
description: Close session by documenting work, updating docs, committing and pushing changes
---

# Session Close Workflow

Complete the current coding session by documenting work, ensuring documentation is current, and committing changes.

## Phase 1: Assess Current State

1. **Check Git Status** (if in a git repository):
   - Run `!git status` to see all uncommitted changes
   - Run `!git log --oneline -10` to see recent commit history
   - Run `!git diff HEAD` to review all changes since last commit

2. **Review Recent Work**:
   - Examine the conversation history to identify what was accomplished
   - Note any files that were created, modified, or deleted
   - Identify any features added, bugs fixed, or refactoring completed

## Phase 2: Document Work Completed

3. **Create Session Summary**:
   - Create or update `session-work.md` in the current directory
   - Document:
     - **Date and Time**: Current session timestamp
     - **Work Completed**: List all tasks accomplished with file references
     - **Changes Made**: Summarize code changes, new features, bug fixes
     - **Files Modified**: List all files created/modified with line references
     - **Decisions Made**: Document any architectural or technical decisions

## Phase 3: Identify Remaining Work

4. **Document Incomplete Tasks**:
   - Add to `session-work.md`:
     - **TODO Items**: List any pending tasks or features
     - **Known Issues**: Document any bugs or problems discovered
     - **Next Steps**: Outline recommended next actions
     - **Blockers**: Note any dependencies or blockers

## Phase 4: Verify Documentation

5. **Check Project Documentation**:
   - Look for README.md, CHANGELOG.md, CONTRIBUTING.md, or other docs
   - Verify if documentation needs updates based on changes made
   - Check if any new features need to be documented
   - Review inline code comments for accuracy

6. **Suggest Documentation Updates**:
   - If documentation is outdated, list specific sections that need updates
   - Offer to update documentation files before committing

## Phase 5: Security & Dependency Check

7. **Run Security Checks** (if applicable):
   - For Node.js projects: Run `!npm audit` to check for vulnerabilities
   - For Node.js projects: Run `!npm outdated` to check for updates
   - For Python projects: Check for security advisories
   - For Go projects: Check for module vulnerabilities
   - Note any security issues in `session-work.md`

8. **Review Dependencies**:
   - Check for deprecated packages
   - Note any package upgrades needed per CLAUDE.md standards
   - Document security vulnerabilities found

## Phase 6: Git Operations

9. **Prepare Commit** (if changes exist):
   - Review all changes one final time
   - Stage all relevant files with `git add`
   - Ensure `.env`, `credentials.json`, and other sensitive files are NOT staged
   - Verify `.gitignore` is properly configured

10. **Create Commit**:
    - Create a descriptive commit message following repository conventions
    - Include session-work.md in the commit
    - Format: `<type>: <description>`
    - Types: feat, fix, docs, refactor, test, chore, etc.

11. **Push Changes** (if requested):
    - Check current branch with `git branch --show-current`
    - Push to remote with `git push`
    - Verify push was successful
    - Provide confirmation with commit hash and branch

## Phase 7: Session Summary

12. **Final Report**:
    - Display the session-work.md contents
    - Confirm all documentation is updated
    - Confirm all changes are committed and pushed
    - Provide quick summary of session accomplishments

## Output Format

The `session-work.md` file should follow this structure:

```markdown
# Session Work Summary

**Date**: [Current date and time]
**Session Duration**: [Estimated time]

## Work Completed

### Features Added
- [Feature 1] (file_path:line_number)
- [Feature 2] (file_path:line_number)

### Bugs Fixed
- [Bug description] (file_path:line_number)

### Refactoring
- [What was refactored] (file_path:line_number)

### Documentation Updates
- [Doc updates made]

## Files Modified

- `path/to/file1.ext` - [Brief description of changes]
- `path/to/file2.ext` - [Brief description of changes]

## Technical Decisions

- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

## Work Remaining

### TODO
- [ ] [Task 1]
- [ ] [Task 2]

### Known Issues
- [Issue 1]
- [Issue 2]

### Next Steps
1. [Recommended next action]
2. [Recommended next action]

## Security & Dependencies

### Vulnerabilities
- [Any security issues found]

### Package Updates Needed
- [Packages that need upgrading]

### Deprecated Packages
- [Deprecated packages to replace]

## Git Summary

**Branch**: [branch-name]
**Commit**: [commit-hash]
**Commits in this session**: [number]
**Files changed**: [number]

## Notes

[Any additional notes, context, or observations]
```

---

**Note**: This command will guide you through a systematic session closure process. It will create a comprehensive record of your work and ensure all changes are properly documented and committed.
