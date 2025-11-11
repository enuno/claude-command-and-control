---
description: "Produces a markdown summary of the current work state, open issues, and context to hand a feature or bugfix to another developer or agent."
allowed-tools: ["Read", "Search", "Edit", "Bash(git:*)", "Bash(find)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Handoff

## Purpose
Create a comprehensive handoff document capturing the current work state, progress, decisions, blockers, and context to enable seamless transition to another developer or agent.

## Handoff Generation Steps

### 1. Gather Current Work State

```bash
# Current branch and status
!git branch --show-current
!git status --porcelain
!git log --oneline --decorate -20

# What branch are we on?
CURRENT_BRANCH=$(git branch --show-current)
```

### 2. Analyze Changes

```bash
# Changes since main
!git diff --stat main..HEAD

# Show commits on this branch
!git log --oneline main..HEAD

# List files changed
!git diff --name-status main..HEAD

# Get diff summary
!git diff --stat main..HEAD | tail -1
```

### 3. Load Context

Read relevant documentation:
- `@DEVELOPMENT_PLAN.md` - What we're building
- `@IMPLEMENTATION_PLAN.md` - How we're building it
- `@TODO.md` - Task breakdown
- `@README.md` - Project overview
- `@ARCHITECTURE.md` - System design
- `@.env.example` - Environment setup

### 4. Examine Related Issues/PRs

```bash
# Look for issue references in commits
!git log main..HEAD --grep="#" --oneline

# Find PR references
!git log main..HEAD --all --grep="PR\|pull request" --oneline

# Search for TODO/FIXME in new code
!git diff main..HEAD | grep -E "TODO|FIXME|HACK"
```

### 5. Generate Handoff Document

Create **HANDOFF.md**:

```markdown
# Work Handoff Document

**Prepared By**: [Your name]
**Prepared Date**: [ISO 8601 timestamp]
**Project**: [Project Name]
**Feature/Issue**: [Title]
**Issue #**: [#XXX]

---

## 📋 Executive Summary

[1-2 paragraph summary covering:
- What work was being done
- Current progress status
- Key decisions made
- Known blockers or issues]

---

## 🎯 Feature/Task Overview

### Objective
[Clear statement of what this feature/bugfix is supposed to accomplish]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Business Value
[Why this matters and who benefits]

---

## 📊 Progress Status

### Completed
- ✅ [Task 1]: [Brief description]
- ✅ [Task 2]: [Brief description]
- ✅ [Task 3]: [Brief description]
- **Subtotal**: 60% complete

### In Progress
- 🚧 [Task 4]: [Description] - ~70% done
- 🚧 [Task 5]: [Description] - ~40% done
- **Subtotal**: 30% in work

### Not Started
- ⏳ [Task 6]: [Description] - [Reason not started]
- ⏳ [Task 7]: [Description] - [Reason not started]
- **Subtotal**: 10% remaining

### Overall Status
**Progress**: 60% complete
**Estimated Completion**: [Date/Timeline]
**Risk Level**: [Green/Yellow/Red]

---

## 🔀 Current Branch

**Branch Name**: `feature/[feature-name]`
**Created**: [Date]
**Last Commit**: [Commit message] ([N] minutes ago)
**Base Branch**: main
**Commits**: [N] commits ahead of main

### Recent Commits
```
abc1234 - feat: implement user authentication
def5678 - test: add auth unit tests
ghi9012 - fix: resolve session timeout issue
```

### Changes Summary
- Files Changed: [N]
- Lines Added: +[N]
- Lines Deleted: -[N]
- Net Change: ±[N]

### Files Modified
```
src/auth/login.js       (+85, -12)
src/auth/middleware.js  (+45, -8)
tests/auth.test.js      (+120, -0)
docs/AUTH.md            (+50, -5)
```

---

## 💻 Technical Implementation

### Architecture Decisions
1. **Decision 1**: [What was decided and why]
   - Alternative considered: [What else was considered]
   - Rationale: [Why this was chosen]
   - Trade-offs: [Any compromises made]

2. **Decision 2**: [Decision and rationale]

### Key Implementation Details

#### Database Changes
```sql
-- Migration file: db/migrations/001_add_auth_tables.sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  token VARCHAR(255),
  expires_at TIMESTAMP
);
```

#### API Endpoints
- `POST /auth/login` - Authenticate user, return JWT token
- `POST /auth/logout` - Invalidate session
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/me` - Get current user info

#### Key Files Modified
1. **src/auth/login.js**: Main authentication logic
2. **src/middleware/auth.js**: Authentication middleware
3. **tests/auth.test.js**: Test suite for auth

#### Libraries/Dependencies Added
- `bcryptjs@2.4.3` - Password hashing
- `jsonwebtoken@9.0.0` - JWT token handling
- `dotenv@16.0.0` - Environment variables

---

## 🧪 Testing Status

### Unit Tests
```
✅ Auth unit tests: 18 passing
✅ Middleware tests: 5 passing
✅ Session tests: 8 passing
Total: 31 tests passing, 0 failing
Coverage: 92%
```

### Integration Tests
```
⏳ End-to-end auth flow: Not yet started
⏳ Multi-device session: Planned
```

### Test Coverage
- Lines: 92% ✅
- Branches: 85% ✅
- Functions: 90% ✅

### How to Run Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test tests/auth.test.js

# Run with coverage
npm run coverage

# Run in watch mode
npm test -- --watch
```

---

## 🔍 Known Issues & Blockers

### Critical Issues
- **🔴 Issue 1**: [Description]
  - Impact: [What breaks]
  - Workaround: [Temporary solution]
  - Fix: [How to resolve]
  - Estimated Time: [Duration]
  - Owner: [Who should fix]

### Minor Issues
- **🟡 Issue 2**: [Description]
  - Impact: [Minor feature gap]
  - Fix: [What needs to be done]
  - Priority: [Low/Medium]

### Decisions Pending Review
- [Decision 1]: Needs approval from [Person/Team]
- [Decision 2]: Blocked by [External dependency]

---

## 📝 Code Review Feedback

### Previous Review Comments
1. **Comment 1**: [Topic]
   - Status: ✅ Addressed / ⏳ Pending fix
   - Changes made: [If addressed]

2. **Comment 2**: [Topic]
   - Status: ✅ Addressed / ⏳ Pending

### Things to Check
- [ ] Line 45 in auth.js: Consider edge case handling for...
- [ ] Performance: Token refresh might be inefficient with...
- [ ] Security: Validate password requirements match policy

---

## 📚 Documentation

### Documentation Status
- ✅ README updated with new endpoints
- ✅ API documentation complete
- ⏳ Architecture diagram needs update
- ⏳ Deployment guide needs revision

### Documentation Files
- `docs/AUTH.md` - Authentication guide
- `docs/API.md` - Updated API reference
- `README.md` - Updated with auth setup

### For Next Developer
Key docs to review:
1. Read: `docs/AUTH.md` (authentication overview)
2. Read: `docs/API.md` (endpoint details)
3. Check: `ARCHITECTURE.md` (system design)
4. Review: Test files to understand expected behavior

---

## 🚀 Deployment Readiness

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scan passed
- [ ] Performance tested
- [ ] Migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring configured
- [ ] Feature flags set

### Deployment Steps
```bash
# 1. Merge to staging
git checkout staging
git pull origin staging
git merge feature/auth --no-ff

# 2. Deploy to staging
npm run build
npm run migrate
npm start

# 3. Run smoke tests
npm run test:smoke

# 4. If OK, merge to main
git checkout main
git merge staging --no-ff
npm run deploy:production
```

### Rollback Plan
If issues occur:
```bash
# Revert to previous version
git revert [commit-hash]
git push origin main

# Or rollback feature flag
# In config: FEATURE_AUTH_ENABLED=false
```

### Monitoring Setup
- Alert on: [N] failed login attempts
- Monitor: Token refresh latency (target: <100ms)
- Dashboard: [Link to monitoring dashboard]

---

## 🤝 Next Steps for Receiver

### Immediate Actions (First Hour)
1. [ ] Read this entire handoff document
2. [ ] Check out branch: `git checkout feature/auth`
3. [ ] Review recent commits: `git log main..HEAD --stat`
4. [ ] Run test suite: `npm test`
5. [ ] Verify environment: `/env-check`
6. [ ] Start development: `npm start`

### Short-term (Today/Tomorrow)
1. [ ] Resolve the [N] known issues
2. [ ] Complete integration tests
3. [ ] Address code review feedback
4. [ ] Run security scan
5. [ ] Update documentation

### Medium-term (This Sprint)
1. [ ] Test deployment to staging
2. [ ] Get final approval
3. [ ] Schedule production release
4. [ ] Prepare release notes

---

## 📞 Key Contacts & Resources

### Team Members
- **Feature Lead**: [Name] - Ask about design decisions
- **Code Reviewer**: [Name] - For code review questions
- **DevOps**: [Name] - For deployment help
- **Product Manager**: [Name] - For business context

### Relevant Documentation
- Architecture: `docs/ARCHITECTURE.md`
- API Spec: `docs/API.md`
- Contributing: `CONTRIBUTING.md`
- Runbook: `docs/RUNBOOK.md`

### External Resources
- JWT Guide: [Link]
- Password hashing best practices: [Link]
- Our security policy: [Link]

---

## 💡 Hidden Gems & Gotchas

### What Works Well
- The middleware approach is clean and reusable
- Test structure makes it easy to add more tests
- Token refresh mechanism is elegant

### Potential Pitfalls
- ⚠️ Password validation is strict (min 12 chars) - users may complain
- ⚠️ Token expiry is 1 hour - consider if too short/long
- ⚠️ Session table might grow large without pruning

### Performance Notes
- Token validation is fast (~1ms)
- Password hashing takes ~100ms (intentional)
- Database queries are indexed properly

### Security Considerations
- Passwords properly hashed with bcryptjs
- JWT tokens signed with RS256
- HTTPS required for all auth endpoints
- XSS/CSRF protections in place

---

## 🎯 Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| Users can login | ✅ Done | Working well |
| Session management | ✅ Done | Tested |
| Token refresh | ✅ Done | Needs timeout edge case testing |
| Password reset | ⏳ Pending | Blocked by email service |
| Multi-factor auth | ⏳ Pending | Planned for next sprint |

---

## 📋 Quick Reference

### Useful Commands
```bash
# Test
npm test
npm run coverage

# Dev server
npm start

# Build
npm run build

# Linting
npm run lint
npm run lint:fix

# Database
npm run migrate
npm run migrate:rollback
```

### Directory Structure
```
src/
  auth/
    login.js         ← Main login logic
    middleware.js    ← Auth middleware
    utils.js         ← Helper functions
tests/
  auth.test.js       ← Auth tests
db/
  migrations/        ← DB schemas
docs/
  AUTH.md            ← Auth documentation
```

---

## ✅ Handoff Checklist

Prepared By [Your Name]:
- [ ] Updated this handoff document
- [ ] All uncommitted changes committed
- [ ] Branch pushed to remote
- [ ] Tests passing
- [ ] Code review requested
- [ ] Known issues documented
- [ ] Next developer contacted
- [ ] Shared link to this handoff

---

**Handoff Prepared**: [Timestamp]  
**Prepared By**: [Your name]  
**Next Owner**: [Next developer/agent name]  
**Priority**: [High/Normal/Low]  
**ETA to Resume**: [Expected time to pick up]

**Status**: ✅ Ready for handoff / ⚠️ Needs review / 🔴 Issues to resolve first

---
```

### 6. Display Handoff Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║      HANDOFF DOCUMENT CREATED SUCCESSFULLY         ║
╚════════════════════════════════════════════════════╝

FEATURE: [Feature Name]
ISSUE: #[Number]
BRANCH: feature/[name]
STATUS: [% complete]

PROGRESS:
  ✅ Completed: [N] tasks (60%)
  🚧 In Progress: [N] tasks (30%)
  ⏳ Not Started: [N] tasks (10%)

CHANGES:
  Files: [N] modified
  Lines: +[X], -[Y]
  Commits: [N]

TESTING:
  Unit Tests: [N] passing ✅
  Integration: [N] needed
  Coverage: [X]%

KNOWN ISSUES: [N]
  🔴 Critical: [N]
  🟡 Minor: [N]
  ⏳ Pending: [N]

KEY FILES:
  - src/auth/login.js (+85, -12)
  - src/auth/middleware.js (+45, -8)
  - tests/auth.test.js (+120)

NEXT STEPS FOR RECEIVER:
  1. Read handoff document
  2. Check out branch
  3. Review commits
  4. Run tests
  5. Resolve known issues

HANDOFF READY: ✅ YES / ⚠️ NEEDS REVIEW / ❌ NOT READY

Full Handoff: HANDOFF.md
Time to prepare: ~30 min
Ready to transfer to: [Next person/agent]
```

## Key Features

- **Comprehensive Context**: Progress, code changes, testing, decisions
- **Issue Documentation**: Known problems and blockers clearly listed
- **Testing Status**: Test results and coverage clearly shown
- **Decision Tracking**: Why decisions were made, alternatives considered
- **Deployment Ready**: Pre-deployment checklist and rollback plan
- **Next Steps**: Clear action items for receiver
- **Resource Links**: Team contacts and documentation references
- **Quick Reference**: Commands, structure, and useful information

## Handoff Information Sections

| Section | Purpose | For Receiver |
|---------|---------|---|
| Summary | High-level overview | Quick context |
| Progress | What's done/in-progress | Understand scope |
| Branch Info | Git details | Resume work |
| Technical | Implementation details | Technical context |
| Testing | Test status | Know what's validated |
| Issues | Known problems | Don't waste time on them |
| Decisions | Why things were done | Understand rationale |
| Deployment | Ready for production | Release plan |
| Next Steps | What comes next | Action items |

## When to Use /handoff

- Before taking time off (vacation, sick leave)
- When transitioning work to teammate
- Handing off to another agent
- End of sprint handoff
- Pausing work for extended period
- Documenting complex features
- Before context switching to new task
- Creating continuity in multi-person teams

## Best Practices

1. **Be Thorough**: Include context others might not have
2. **Be Honest**: Document real blockers and issues
3. **Be Specific**: Give exact file locations and line numbers
4. **Be Helpful**: Include commands to quickly resume
5. **Be Clear**: Write for someone unfamiliar with work
6. **Be Organized**: Use clear sections and structure
7. **Be Fresh**: Update right before handing off
8. **Communicate**: Tell receiver handoff is ready