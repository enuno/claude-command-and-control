---
description: "Generate or update a current project or feature plan, including priorities, key tasks, pending reviews, and deadlines. Helps teams align before coding sessions."
allowed-tools: ["Read", "Search", "Edit", "Bash(git:log)", "Bash(git:branch)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Plan

## Purpose
Create or refresh a comprehensive project or feature plan that aligns stakeholders, clarifies priorities, identifies bottlenecks, and tracks progress.

## Planning Steps

### 1. Gather Planning Context
```bash
# Review recent work
!git log --oneline --since="1 week ago" --decorate

# List active branches
!git branch -a | grep -v "remotes/origin/main"

# Check for planning documents
!find . -name "*PLAN*" -o -name "*TODO*" -o -name "*ROADMAP*" | grep -v node_modules
```

### 2. Load Existing Documentation
Read (if available):
- `@DEVELOPMENT_PLAN.md` - Existing development plan
- `@TODO.md` - Task list
- `@MULTI_AGENT_PLAN.md` - Multi-agent coordination
- `@ARCHITECTURE.md` - System design constraints
- `@README.md` - Project overview

### 3. Analyze Current State

Assess and display:
- **Current Phase**: [Which development phase are we in?]
- **Blockers**: [Any items blocking progress?]
- **Dependencies**: [Cross-team or external dependencies?]
- **Review Queue**: [Pending code reviews or approvals?]
- **Deadlines**: [Upcoming milestones or release dates?]

### 4. Define or Update Plan

Create/update `DEVELOPMENT_PLAN.md` or feature plan with:

```markdown
# [Project/Feature] Plan

**Last Updated**: [DATE]
**Status**: [On Track / At Risk / Behind Schedule]
**Owner**: [Name/Team]

## Overview
[1-2 sentence summary of goals and scope]

## Objectives
1. [Primary objective with success criteria]
2. [Secondary objective with success criteria]
3. [Tertiary objective with success criteria]

## Timeline

| Phase | Duration | Target Date | Status |
|-------|----------|-------------|--------|
| Phase 1: [Name] | [Est. 2 weeks] | [Date] | [Status] |
| Phase 2: [Name] | [Est. 3 weeks] | [Date] | [Status] |
| Phase 3: [Name] | [Est. 1 week] | [Date] | [Status] |

## Key Tasks by Priority

### 🔴 Critical Path (Must Complete)
- [ ] Task 1: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]
- [ ] Task 2: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]
- [ ] Task 3: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]

### 🟡 High Priority (Should Complete)
- [ ] Task 1: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]
- [ ] Task 2: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]

### 🟢 Nice to Have (Lower Priority)
- [ ] Task 1: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]
- [ ] Task 2: [Description] - Owner: [Name], Due: [Date], Status: [Not Started/In Progress/Done]

## Dependencies

### External Dependencies
- [Service/Team]: [Description of dependency and impact if delayed]
- [Service/Team]: [Description of dependency and impact if delayed]

### Cross-Team Coordination
- **Frontend Team**: [Required coordination]
- **Backend Team**: [Required coordination]
- **DevOps**: [Required coordination]

## Known Blockers

| Blocker | Impact | Resolution | Owner | ETA |
|---------|--------|-----------|-------|-----|
| [Issue] | [Priority] | [Plan to resolve] | [Name] | [Date] |
| [Issue] | [Priority] | [Plan to resolve] | [Name] | [Date] |

## Review & Approval Queue

### Pending Code Reviews
- [PR #123]: Feature X - Waiting for: [Name] - Requested: [Date]
- [PR #124]: Bugfix Y - Waiting for: [Name] - Requested: [Date]

### Pending Design Review
- [Design]: Feature Z - Waiting for: [Name] - Requested: [Date]

### Pending Product/Stakeholder Sign-Off
- [Feature]: Feature A - Waiting for: [Name] - Requested: [Date]

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| [Risk] | High/Med/Low | High/Med/Low | [Strategy] |
| [Risk] | High/Med/Low | High/Med/Low | [Strategy] |

## Success Metrics

- [Metric 1]: [Baseline] → [Target]
- [Metric 2]: [Baseline] → [Target]
- [Metric 3]: [Baseline] → [Target]

## Team Communication

**Standups**: [Frequency and format]
**Status Updates**: [Frequency and format]
**Escalation Path**: [Who to contact if issues arise]

## Notes & Context
[Any additional context, decisions made, or important information]

---
```

### 5. Create Aligned Task Breakdown

Create or update `TODO.md` with actionable items:

```markdown
# TODO / Task Breakdown

## This Week (Dates)

### Architect Tasks
- [ ] [Task] - Due: [Date] - Assigned: [Name]
- [ ] [Task] - Due: [Date] - Assigned: [Name]

### Builder Tasks
- [ ] [Task] - Due: [Date] - Assigned: [Name]
- [ ] [Task] - Due: [Date] - Assigned: [Name]

### Validator Tasks
- [ ] [Task] - Due: [Date] - Assigned: [Name]
- [ ] [Task] - Due: [Date] - Assigned: [Name]

### DevOps Tasks
- [ ] [Task] - Due: [Date] - Assigned: [Name]

## Next Week (Dates)

### High Priority
- [ ] [Task] - Blocked by: [What]
- [ ] [Task] - Blocked by: [What]

### Medium Priority
- [ ] [Task]
- [ ] [Task]

## Backlog (No Target Date)

- [ ] [Idea/Enhancement]
- [ ] [Idea/Enhancement]

---
```

### 6. Display Plan Summary

Show formatted summary:
```
╔════════════════════════════════════════════════════╗
║           PLAN CREATED/UPDATED                     ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]
STATUS: [On Track / At Risk / Behind]

TIMELINE:
  Phase 1: [Date] (In Progress)
  Phase 2: [Date] (Scheduled)
  Phase 3: [Date] (Scheduled)

CRITICAL TASKS THIS WEEK:
  1. [Task 1] - Owner: [Name]
  2. [Task 2] - Owner: [Name]
  3. [Task 3] - Owner: [Name]

BLOCKERS:
  • [Blocker 1]
  • [Blocker 2]

PENDING REVIEWS: [Count]
DEPENDENCIES: [Count to track]

Plan saved to:
  • DEVELOPMENT_PLAN.md
  • TODO.md

Ready to execute! Use /test-all or /pr commands to start.
```

## Key Features

- **Priority-Based Organization**: Clear separation of critical, high, and nice-to-have tasks
- **Dependency Tracking**: Identifies external and cross-team dependencies
- **Blocker Management**: Highlights what's blocking progress and who's responsible
- **Review Queue Visibility**: Shows what's waiting for approval
- **Team Alignment**: Ensures all stakeholders understand timeline and expectations
- **Progress Tracking**: Enables easy status updates over time

## When to Use /plan

- At the start of a new project or feature initiative
- Weekly/bi-weekly to refresh and adjust priorities
- When blockers emerge that require plan adjustments
- Before major milestones or releases
- After significant team changes

## Collaboration

After creating/updating plan:
1. Share plan summary with team leads
2. Request feedback on priorities and dependencies
3. Get sign-off from key stakeholders
4. Update task assignments in TODO.md
5. Broadcast plan via Slack/email for visibility