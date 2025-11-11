---
description: "Gracefully close a Claude coding session: summary of progress, update logs, and clear temporary context."
allowed-tools: ["Read", "Search", "Edit", "Bash(git:*)", "Bash(rm)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Close Session

## Purpose
Gracefully conclude a coding session by documenting progress, committing changes, updating logs, and preparing for the next session or developer.

## Session Closing Steps

### 1. Capture Final Session State

```bash
# Show current status
!git branch --show-current
!git status --porcelain

# Get uncommitted changes count
!git status --short | wc -l

# Show final commits this session
!git log --oneline --since="3 hours ago"
```

### 2. Review Session Progress

Prompt user:

```
Session Review

1. What did you accomplish this session?
   [User enters accomplishments]

2. Did you commit your work?
   - Yes, all changes committed
   - Partially committed
   - No, work in progress
   [User selects status]

3. What's left for next session?
   [User describes remaining work]

4. Any blockers or issues?
   [User documents problems]

5. Notes for next developer/session?
   [User provides context]
```

### 3. Ensure Work is Saved

```bash
# Check for uncommitted changes
UNCOMMITTED=$(git status --short | wc -l)

if [ $UNCOMMITTED -gt 0 ]; then
  echo "⚠️ Uncommitted changes detected:"
  git status --short
  echo ""
  echo "Commit now? (yes/no)"
  # Prompt user to commit before closing
fi

# List unpushed commits
!git log origin/main..HEAD --oneline
```

**Actions:**
- If changes uncommitted: Prompt to commit with auto-generated message
- If commits unpushed: Prompt to push to remote
- If branch needs cleanup: Suggest cleanup for next session

### 4. Update Session Log

Update or create `SESSION_LOG.md`:

```markdown
## Session [Date] [Time Start] - [Time End]

**Duration**: [X hours Y minutes]
**Branch**: [branch-name]
**Status**: ✅ Completed / 🚧 In Progress / 🔴 Blocked

### Accomplishments
- [Task 1 completed]
- [Task 2 completed]
- [Task 3 completed]

### Commits
\`\`\`
[Commit 1]
[Commit 2]
[Commit 3]
\`\`\`

### In Progress
- [Task currently being worked on]
- [Estimated completion: next session]

### Blockers/Issues
- [Issue 1]: [Status]
- [Issue 2]: [Status]

### Notes for Next Session
- [Important note 1]
- [Important note 2]
- [Context needed to resume work]

### Time Log
| Activity | Time |
|----------|------|
| Meetings | 30 min |
| Development | 2h |
| Testing | 30 min |
| Code Review | 20 min |
| Other | 10 min |

---
```

### 5. Generate Session Summary

Create **SESSION_SUMMARY.md**:

```markdown
# Session Summary

**Date**: [YYYY-MM-DD]
**Time**: [HH:MM] - [HH:MM]
**Duration**: [X]h [Y]m
**Project**: [Project Name]
**Branch**: [branch-name]

---

## 📊 Session Overview

**Focus**: [What was the main goal]
**Result**: ✅ ACHIEVED / 🟡 PARTIAL / ❌ BLOCKED

---

## ✅ Completed This Session

### Tasks Finished
1. ✅ [Task 1]: [Brief description]
2. ✅ [Task 2]: [Brief description]
3. ✅ [Task 3]: [Brief description]

### Pull Requests
- [PR #123]: [Title] - Status: [Merged/Approved/In Review]
- [PR #124]: [Title] - Status: [Merged/Approved/In Review]

### Issues Resolved
- Closes #[issue-number]: [Title]
- Closes #[issue-number]: [Title]

### Code Changes
- Files modified: [N]
- Lines added: +[N]
- Lines deleted: -[N]
- Tests added: [N]
- Tests passing: [N]/[N]

---

## 🚧 In Progress

### Current Task
**Task**: [Task name]
**Progress**: [X]%
**Est. Completion**: [Next session / Tomorrow / [Date]]

**What's done**:
- [Subtask 1 complete]
- [Subtask 2 complete]

**What's remaining**:
- [Subtask 3 to do]
- [Subtask 4 to do]

**Branch**: [feature-branch-name]
**Commits**: [N] ahead of main

---

## 🔴 Blockers & Issues

### Critical
- [Issue]: [Description]
  - Status: [Status]
  - Owner: [Who's responsible]
  - ETA: [When it will be resolved]

### High Priority
- [Issue]: [Description]
  - Status: [Status]

### Minor
- [Issue]: [Description]

---

## 📝 Key Decisions Made

1. **Decision**: [What was decided]
   - Rationale: [Why this choice]
   - Alternative: [What else was considered]
   - Impact: [How it affects the project]

2. **Decision**: [What was decided]

---

## 🧪 Testing & Quality

### Tests Run
- ✅ Unit tests: [N] passed, [N] failed
- ✅ Integration tests: [N] passed, [N] failed
- ✅ Lint check: [Status]

### Code Review
- Requested from: [Team member]
- Status: [Approved/Pending/Changes Requested]
- Comments: [Key feedback]

---

## 📞 Communication

### Team Updates
- [Who]: [What was communicated]
- [Who]: [Update provided]

### Clarifications Needed
- [Question for Product]: [Question]
- [Question for Design]: [Question]

---

## 🎯 Next Session Priorities

1. **High**: [Task] - [Why important]
2. **Medium**: [Task] - [Why important]
3. **Low**: [Task] - [Why important]

### Recommended Starting Point
Start with [specific task] because [reason]

### Environmental Notes
- No environment issues
- Database needs: [specific action needed]
- Services to start: [List of services]

---

## 📚 Resources & References

### Useful Links
- [Documentation]: [Link]
- [Design Spec]: [Link]
- [Related Issue]: [Link to issue]

### Key Files Touched
- src/[file1].js
- tests/[file2].test.js
- docs/[file3].md

---

## 💾 Session Artifacts

### Generated Files
- [File 1]: [Description]
- [File 2]: [Description]

### Database Changes
- Migration: db/migrations/001_[name].sql
- Status: [Applied/Pending/Rolled back]

### Temporary Files to Cleanup
- [Temp file 1]: Should delete
- [Temp file 2]: Can archive

---

## 🎓 Learnings & Notes

### What Went Well
- [Positive observation]
- [Successful pattern]
- [Thing that was efficient]

### Challenges Encountered
- [Challenge 1]: [How it was resolved]
- [Challenge 2]: [Workaround used]

### For Future Sessions
- [Tip or insight]
- [Best practice discovered]
- [Time-saver found]

---

## ✅ Session Closure Checklist

- [ ] All changes committed
- [ ] Code pushed to remote branch
- [ ] Pull request created (if ready)
- [ ] Tests passing
- [ ] Session documented
- [ ] Issues/blockers recorded
- [ ] Next session priorities identified
- [ ] Team notified if needed

---

**Session Summary Generated**: [Timestamp]  
**Next Session Recommended**: [Date/Time]  
**Total Time: [X]h [Y]m**  
**Status**: ✅ Complete and Ready for Handoff

---
```

### 6. Commit Final Changes

```bash
# Show uncommitted changes
!git status --porcelain

# Prompt user: Commit changes?
# If yes:

!git add .
!git commit -m "session: end of session commit

- Session ended [date/time]
- Final progress: [X]%
- Completed tasks: [list]
- Next session: [description]"

!git push origin $(git branch --show-current)
```

### 7. Create Handoff if Needed

If handing off to another developer:
- Suggest running `/handoff` command
- Generate comprehensive handoff document
- Share with next developer

### 8. Clean Up Temporary Files

```bash
# Remove temporary session files
!rm -f *.tmp SESSION_WORK.md .session-temp 2>/dev/null

# Clear debug logs
!rm -f debug.log console.log 2>/dev/null

# Ask about what to keep/cleanup
"
Temporary files found:
- [Temp file 1]: Delete? (yes/no)
- [Temp file 2]: Archive? (yes/no)
"
```

### 9. Display Session Closure Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║          SESSION CLOSED SUCCESSFULLY               ║
╚════════════════════════════════════════════════════╝

SESSION DATE: [Date]
DURATION: [X]h [Y]m
PROJECT: [Project Name]
BRANCH: [feature-branch]

ACCOMPLISHMENTS: ✅
  ✅ Task 1 completed
  ✅ Task 2 completed
  ✅ Task 3 completed

CODE CHANGES:
  Files Modified: [N]
  Lines: +[X], -[Y]
  Commits: [N]

TESTS:
  ✅ [N] tests passing
  ✅ [N]% coverage

NEXT SESSION:
  Priority 1: [Task]
  Priority 2: [Task]
  Priority 3: [Task]

BLOCKERS:
  [N] issues remaining
  [N] high priority
  [N] low priority

DOCUMENTATION:
  ✅ Session log updated
  ✅ Session summary created
  ✅ Work progress saved

FILES SAVED:
  - SESSION_LOG.md
  - SESSION_SUMMARY.md
  - All changes committed

READY FOR:
  ✅ Next developer
  ✅ Next session
  ✅ Handoff (if needed)

FINAL STATUS:
  Branch: [feature-branch]
  Pushed: ✅ YES
  PRs: [N] open
  Tests: ✅ PASSING

Time logged: [X]h [Y]m
Session closed at: [Time]
Next recommended start: [Date/Time]
```

### 10. Optional: Generate Weekly Report

If Friday or sprint ending:

```markdown
# Weekly Progress Report

**Week Of**: [Date Range]
**Team**: [Your team name]

## Summary
- Tasks completed: [N]
- Bugs fixed: [N]
- Features shipped: [N]
- Lines of code: +[X], -[Y]

## Daily Breakdown
- Monday: [Summary]
- Tuesday: [Summary]
- Wednesday: [Summary]
- Thursday: [Summary]
- Friday: [This session]

## Metrics
- Avg session: [X]h
- Total week: [Y]h
- Tests passing: [Z]%

## Next Week Plan
- [Priority 1]
- [Priority 2]
- [Priority 3]
```

## Session Closure Checklist

- [ ] Reviewed session accomplishments
- [ ] All changes committed with descriptive messages
- [ ] Commits pushed to remote
- [ ] Pull requests created/updated
- [ ] Tests passing and coverage adequate
- [ ] No uncommitted changes remaining
- [ ] Session log updated
- [ ] Session summary generated
- [ ] Next session priorities documented
- [ ] Blockers and issues recorded
- [ ] Temporary files cleaned up
- [ ] Documentation updated
- [ ] Team notified (if needed)
- [ ] Ready for handoff (if needed)

## Key Features

- **Progress Documentation**: Captures what was accomplished
- **Commit Enforcement**: Ensures work is saved
- **Session Logging**: Creates audit trail of work
- **Summary Generation**: Automatic SESSION_SUMMARY.md
- **Blocker Tracking**: Records issues for next session
- **Cleanup**: Removes temporary files
- **Handoff Ready**: Prepares for developer transition
- **Quality Check**: Verifies tests pass before closing

## Session Closure Information Sections

| Section | Purpose | For Next Session |
|---------|---------|---|
| Accomplishments | What was done | Understand progress |
| In Progress | Current task | Resume work |
| Blockers | What's blocking | Know what to avoid |
| Decisions | Why things were done | Understand rationale |
| Next Priorities | What comes next | Know what to start with |
| Testing | Test status | Know test suite state |
| Notes | Context and tips | Quick context loading |

## When to Use /close-session

- End of each development session
- Before extended time off
- End of work day
- End of sprint
- Before handing off to another developer
- Before switching to different project
- At milestone completions

## Best Practices

1. **Always Commit**: Ensure all work is committed before closing
2. **Document Progress**: Record what was accomplished
3. **Note Blockers**: Document anything blocking progress
4. **Update Logs**: Keep SESSION_LOG.md current
5. **Test Before Closing**: Verify tests pass
6. **Create Handoff**: Generate if another developer will continue
7. **Communicate**: Notify team if key milestones reached
8. **Clean Up**: Remove temporary files before closing
9. **Plan Ahead**: Document priorities for next session
10. **Reflect**: Note learnings for improvement