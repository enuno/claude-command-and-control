---
description: "Read the most recent changes, discussions, or diffs and provide a human-understandable summary. Useful for onboarding, standups, or quickly catching up."
allowed-tools: ["Read", "Search", "Bash(git:log)", "Bash(git:diff)", "Bash(git:show)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Summarize

## Purpose
Provide a quick, human-readable summary of recent work, code changes, and project state to enable rapid onboarding and alignment.

## Summarization Steps

### 1. Gather Recent Context
```bash
# Get recent commits (default: last week)
!git log --oneline --since="1 week ago" --decorate

# Show commits with details
!git log --since="1 week ago" --pretty=format:"%h - %s (%an, %ar)"

# List active branches
!git branch -a

# Get current branch
!git branch --show-current

# Show staged and unstaged changes
!git status --porcelain
```

### 2. Analyze Code Changes

```bash
# Show diff stats for recent changes
!git diff --stat main..HEAD

# Show summary of changed files
!git diff --name-status main..HEAD

# Get file change details (if specific files)
!git log -p --since="1 week ago" -- src/[module] | head -100
```

### 3. Load Planning Context

Read (if available):
- `@SESSION_LOG.md` - Previous session notes
- `@DEVELOPMENT_PLAN.md` - Project goals and phases
- `@TODO.md` - Task list and status
- `@MULTI_AGENT_PLAN.md` - Multi-agent work breakdown
- `@README.md` - Project overview

### 4. Create Summary Report

Generate **SUMMARY.md** with:

```markdown
# Work Summary

**Report Generated**: [ISO 8601 timestamp]
**Scope**: [Last 1 week / Since DATE / Last N commits]
**Project**: [Project Name]

---

## 📋 Executive Summary

[1-2 paragraph high-level overview of recent work, including:
- What major features/fixes were completed
- What's currently in progress
- Any significant blockers or pivots
- Overall project health and trajectory]

---

## 🎯 Completed Work

### Feature/Fix #1: [Name]
- **PR**: #[number]
- **Status**: ✅ MERGED / 🔄 IN REVIEW / 🚀 DEPLOYED
- **What Changed**: [Brief description of changes]
- **Impact**: [How this affects users/system]
- **Files Modified**: [Count and key files]
  - src/module/file1.js
  - src/module/file2.js
- **Author(s)**: [Names]
- **Date**: [When merged]

### Feature/Fix #2: [Name]
[Same structure as above]

---

## 🚧 In Progress

### Work Item #1: [Name]
- **Assigned**: [Name(s)]
- **Branch**: feature/[name]
- **Progress**: [X%] - Currently working on [specific task]
- **Blockers**: [Any blockers or waiting on something?]
- **Expected Completion**: [Date]
- **PR Status**: [Draft PR / Waiting for review / Ready to merge]

### Work Item #2: [Name]
[Same structure as above]

---

## 📊 Statistics

### Code Activity
- **Total Commits**: [Count]
- **Total Files Changed**: [Count]
- **Lines Added**: [+X]
- **Lines Deleted**: [-X]
- **Net Change**: [±X]

### File Categories Changed
- Backend: [Count files]
- Frontend: [Count files]
- Tests: [Count files]
- Documentation: [Count files]
- Infrastructure/Config: [Count files]

### Author Contributions (This Period)
- [Name]: [X commits / Y files]
- [Name]: [X commits / Y files]
- [Name]: [X commits / Y files]

---

## 🔄 Pending Actions

### Code Reviews Waiting
- [PR #XX]: [Title] - Requested from: [Names] - Since: [Date]
- [PR #YY]: [Title] - Requested from: [Names] - Since: [Date]

### Blockers & Issues
1. [Blocker]: [Description] - Owner: [Name] - Severity: [Critical/High/Medium]
2. [Blocker]: [Description] - Owner: [Name] - Severity: [Critical/High/Medium]

### Dependencies Tracking
- Waiting for: [Team/Service] - Expected: [Date]
- Blocked by: [External issue] - Status: [Status]

---

## 📁 Key Files Modified

### High-Impact Changes
```
src/core/auth.js          (+45, -12)   # Authentication refactor
src/api/users.js          (+102, -58)  # User endpoint improvements
tests/auth.test.js        (+67, -0)    # New auth tests
```

### Infrastructure/Config Changes
```
.github/workflows/ci.yml  (+15, -8)    # CI/CD pipeline update
docker-compose.yml        (+12, -5)    # Development environment
```

### Documentation Changes
```
README.md                 (+8, -2)     # Updated setup instructions
docs/API.md              (+35, -10)    # API documentation updates
```

---

## 🎓 Key Insights & Learnings

### What Went Well
- [Positive observation or successful pattern]
- [Positive observation or successful pattern]
- [Positive observation or successful pattern]

### Challenges Encountered
- [Challenge and how it was addressed]
- [Challenge and how it was addressed]
- [Challenge and how it was addressed]

### Recommended Next Steps
1. [Priority 1 action item]
2. [Priority 2 action item]
3. [Priority 3 action item]

---

## 🗺️ Roadmap Status

### This Week
- [Task]: [Status - On track / At risk / Complete]
- [Task]: [Status - On track / At risk / Complete]

### Next Week
- [Planned task]
- [Planned task]

### Known Upcoming Milestones
- [Milestone]: [Target date]
- [Milestone]: [Target date]

---

## 📞 Quick Links

- **Project**: [Link]
- **Repository**: [Link]
- **Issues Board**: [Link]
- **CI/CD Pipeline**: [Link]
- **Deployment Dashboard**: [Link]

---

## 📝 How to Use This Summary

**For New Team Members**: Read for project overview and recent direction
**For Standup**: Share key completed/in-progress items
**For Planning**: Use for prioritization decisions
**For Management**: Executive summary provides status

---
```

### 5. Display Summary

Show formatted output:
```
╔════════════════════════════════════════════════════╗
║              WORK SUMMARY GENERATED                ║
╚════════════════════════════════════════════════════╝

PERIOD: Last 7 days
PROJECT: [Project Name]

COMPLETED: [N] items
  ✅ [Feature 1]
  ✅ [Feature 2]
  ✅ [Bugfix 1]

IN PROGRESS: [N] items
  🚧 [Work item 1]
  🚧 [Work item 2]

CODE STATS:
  Commits: [N]
  Files Changed: [N]
  Lines: +[X]/-[Y]

BLOCKERS: [N]
  🔴 [Critical blocker]

PENDING REVIEWS: [N]
  PR #[N]: [Title]
  PR #[N]: [Title]

Full summary: SUMMARY.md

Share with team? Use:
  - Slack integration
  - Email update
  - Wiki/Confluence
```

## Key Features

- **Time Flexibility**: Summarize any time period (last day, week, month, custom)
- **Statistics**: Quantifies work through commit, file, and contributor metrics
- **Blocker Visibility**: Flags issues preventing progress
- **Review Tracking**: Shows what's pending approval
- **Insight Extraction**: Identifies patterns, challenges, and learnings
- **Stakeholder Ready**: Provides executive summary for non-technical stakeholders

## When to Use /summarize

- **Onboarding**: New team member joining the project
- **Standups**: Quick status update before team sync
- **Status Reports**: Weekly/bi-weekly stakeholder updates
- **Context Switching**: Jumping back into project after time away
- **Handoff**: Transferring work to another developer or agent

## Output Formats

Default: Markdown file (SUMMARY.md)

Optional:
- Slack/email friendly version
- Executive summary only
- Just statistics
- Git commit log format