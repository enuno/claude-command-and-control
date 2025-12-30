---
description: "Real-time inter-agent communication, result aggregation, conflict resolution, consensus building, and progress tracking for multi-agent workflows"
allowed-tools: ["Read", "Edit", "Bash(git:status)", "Bash(git:log)", "Bash(git:diff)", "Bash(ps)", "Bash(find)"]
author: "Engineering Standards Committee"
version: "1.0.0"
---

# Coordinate Workflow

## Purpose
Monitor and coordinate active multi-agent workflows in real-time, facilitating inter-agent communication, aggregating results, resolving conflicts, building consensus, and tracking progress toward completion.

## When to Use
- Multiple agents actively working on parallel tasks
- Need to monitor progress across distributed agents
- Agents report blockers requiring orchestrator intervention
- Results from parallel agents need synthesis or conflict resolution
- Handoffs between agent roles require coordination

## Prerequisites
- MULTI_AGENT_PLAN.md exists with active tasks
- AGENT_REGISTRY.md tracks spawned agents
- Multiple agents currently running (Status: "In Progress")
- Git worktrees or containers set up for each agent

## Project-Specific Customization

**To use this template in your project:**

1. Copy to `.claude/commands/coordinate-workflow.md`
2. Customize progress check intervals based on task complexity
3. Adjust conflict resolution strategies to match team preferences
4. Modify notification thresholds for blocker escalation
5. Configure result aggregation rules for your domain

## Workflow

### Phase 1: Status Discovery and Health Check

**Step 1.1: Load Current State**
```bash
# Read multi-agent plan
cat MULTI_AGENT_PLAN.md

# Read agent registry
cat AGENT_REGISTRY.md

# Count active agents
ACTIVE_COUNT=$(grep "Running" AGENT_REGISTRY.md | wc -l)
echo "Active agents: ${ACTIVE_COUNT}"
```

**Step 1.2: Agent Health Check**
```markdown
For each agent in AGENT_REGISTRY.md with Status="Running":

Check 1: Process alive?
```bash
AGENT_PID=$(grep "${AGENT_ID}" AGENT_REGISTRY.md | awk '{print $NF}')
if ps -p ${AGENT_PID} > /dev/null; then
  echo "✓ Agent ${AGENT_ID} process alive"
else
  echo "✗ Agent ${AGENT_ID} process dead - marking as FAILED"
  # Update AGENT_REGISTRY.md status to "Failed"
fi
```

Check 2: Making progress?
```bash
WORKTREE=$(grep "${AGENT_ID}" AGENT_REGISTRY.md | awk '{print $(NF-1)}')
LAST_COMMIT_TIME=$(cd "${WORKTREE}" && git log -1 --format=%ct 2>/dev/null)
NOW=$(date +%s)
IDLE_SECONDS=$((NOW - LAST_COMMIT_TIME))
IDLE_MINUTES=$((IDLE_SECONDS / 60))

if [ ${IDLE_MINUTES} -gt 30 ]; then
  echo "⚠ Agent ${AGENT_ID} idle for ${IDLE_MINUTES} minutes"
  # Flag for potential stuck agent
fi
```

Check 3: Task status current?
```bash
# Compare AGENT_REGISTRY.md vs MULTI_AGENT_PLAN.md
REGISTRY_STATUS=$(grep "${AGENT_ID}" AGENT_REGISTRY.md | awk '{print $5}')
PLAN_STATUS=$(grep "${TASK_ID}" MULTI_AGENT_PLAN.md | grep "Status" | awk '{print $NF}')

if [ "${REGISTRY_STATUS}" != "${PLAN_STATUS}" ]; then
  echo "⚠ Status mismatch for ${AGENT_ID}: Registry says ${REGISTRY_STATUS}, Plan says ${PLAN_STATUS}"
  # Reconcile status (plan takes precedence)
fi
```
```

**Step 1.3: Generate Status Dashboard**
```markdown
Create real-time dashboard:

╔══════════════════════════════════════════════════════════════════════╗
║              MULTI-AGENT WORKFLOW STATUS DASHBOARD                   ║
╚══════════════════════════════════════════════════════════════════════╝

WORKFLOW: {{FEATURE_NAME}}
STARTED: {{START_TIME}}
ELAPSED: {{ELAPSED_TIME}}

OVERALL PROGRESS:
┌────────────────────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░ 40% │
└────────────────────────────────────────────────────┘

TASKS: 4 Completed | 3 In Progress | 2 Blocked | 1 Not Started

ACTIVE AGENTS:
┌─────────────┬────────┬───────────┬─────────┬──────────┬──────────┐
│  Agent ID   │  Role  │   Task    │ Status  │  Idle    │  Health  │
├─────────────┼────────┼───────────┼─────────┼──────────┼──────────┤
│ agent-1234  │Builder │  T2-impl  │Running  │  2 min   │    ✓     │
│ agent-5678  │Builder │  T3-impl  │Running  │  5 min   │    ✓     │
│ agent-9012  │Validator│  T4-test │Blocked  │ 25 min   │    ⚠     │
└─────────────┴────────┴───────────┴─────────┴──────────┴──────────┘

BLOCKERS:
  ⚠ T4 (Validator): Waiting for T2 implementation to merge
  ⚠ T5 (Scribe): API spec incomplete, needs Architect clarification

RECENT ACTIVITY:
  • 14:45 - agent-1234 committed: "Implement user authentication API"
  • 14:40 - agent-5678 committed: "Add JWT token generation"
  • 14:30 - agent-9012 updated status to "Blocked"

NEXT ACTIONS:
  1. Review blocker for T4 - check if T2 ready for handoff
  2. Investigate agent-9012 idle time (approaching 30 min threshold)
  3. Prepare for result aggregation when T2/T3 complete
```

### Phase 2: Inter-Agent Communication Facilitation

**Step 2.1: Detect Communication Needs**
```markdown
Scenarios requiring orchestrator intervention:

1. **Handoff Ready**:
   - Upstream task (T1) marked "Completed"
   - Downstream task (T2) has T1 as dependency
   - Action: Notify T2 agent that dependency is satisfied

2. **Blocker Escalation**:
   - Agent marks task as "Blocked"
   - Blocker description indicates decision needed
   - Action: Analyze blocker, provide resolution or escalate to user

3. **Shared Resource Conflict**:
   - Multiple agents modifying same file (detected via git status)
   - Action: Coordinate to avoid conflicts, assign ownership

4. **Information Request**:
   - Agent needs data from another agent's worktree
   - Action: Facilitate read-only access or data transfer
```

**Step 2.2: Implement Communication Protocol**
```markdown
Create INTER_AGENT_MESSAGES.md (if doesn't exist):

---
# Inter-Agent Communication Log

## Message Format
FROM: [Sender Agent ID or "Orchestrator"]
TO: [Recipient Agent ID or "All"]
TYPE: [Handoff|Blocker|Question|Update|Directive]
TIMESTAMP: [ISO 8601]
MESSAGE: [Content]
STATUS: [Sent|Acknowledged|Resolved]

---

## Active Messages

### Message 1
FROM: Orchestrator
TO: agent-9012 (Validator)
TYPE: Handoff
TIMESTAMP: 2025-11-29T14:50:00Z
MESSAGE: |
  Task T2 (Builder - agent-1234) has completed implementation.
  Branch feature/t2-impl is ready for your validation.

  Actions for you:
  1. Merge feature/t2-impl into your worktree
  2. Run test suite against implementation
  3. Update MULTI_AGENT_PLAN.md with test results

  Implementation details:
  - 15 commits
  - 450 lines of code added
  - API endpoints: /auth/login, /auth/logout, /auth/refresh
  - Documentation: docs/api/authentication.md

STATUS: Sent

---

### Message 2
FROM: agent-9012 (Validator)
TO: Orchestrator
TYPE: Blocker
TIMESTAMP: 2025-11-29T14:30:00Z
MESSAGE: |
  I cannot proceed with test creation for T4 because:
  1. No implementation exists yet in my worktree (expected from T2)
  2. API specification document is incomplete (section 3.2 missing)

  To unblock:
  - Option A: Wait for T2 completion and merge
  - Option B: Architect agent completes API spec section 3.2
  - Option C: I write tests against current partial spec (risky)

  Recommend Option A. Estimated wait: 15-20 minutes based on T2 progress.

STATUS: Acknowledged

---
```

**Step 2.3: Execute Communication Actions**
```markdown
For each message requiring action:

Type: Handoff
1. Verify upstream task truly complete (check commits, tests)
2. Prepare handoff package:
   - Commit IDs to merge
   - Documentation references
   - Specific acceptance criteria
3. Update downstream agent's context (append to their task description)
4. Notify via MULTI_AGENT_PLAN.md update

Type: Blocker
1. Analyze blocker description
2. Determine resolution:
   a) Orchestrator can resolve → Take action and notify agent
   b) Requires another agent → Coordinate handoff
   c) Requires user input → Escalate with context
3. Update INTER_AGENT_MESSAGES.md with resolution
4. Change task status from "Blocked" to "In Progress"

Type: Question
1. Identify which agent or resource has the answer
2. If another agent: Facilitate information exchange
3. If orchestrator knowledge: Provide answer directly
4. If unknown: Research or escalate to user

Type: Update
1. Broadcast to all relevant agents
2. Update MULTI_AGENT_PLAN.md with new information
3. Check if update unblocks any waiting tasks
```

### Phase 3: Result Aggregation and Synthesis

**Step 3.1: Detect Completion of Parallel Tasks**
```markdown
Monitor for scenario:
- Multiple agents assigned to same "Parallel Group" in MULTI_AGENT_PLAN.md
- All agents in group mark their tasks as "Completed"
- Trigger: Result aggregation required

Example:
Parallel Group B: "Implementation Variants"
- T2 (Builder - OAuth impl): Completed ✓
- T3 (Builder - JWT impl): Completed ✓
→ Trigger aggregation to select best approach
```

**Step 3.2: Collect Results from Each Agent**
```bash
# For each completed task in parallel group:

TASK_ID="T2"
AGENT_ID="agent-1234"
WORKTREE=$(grep "${AGENT_ID}" AGENT_REGISTRY.md | awk '{print $(NF-1)}')

# Extract implementation details
cd "${WORKTREE}"

echo "=== Results from ${TASK_ID} (${AGENT_ID}) ==="
echo "Branch: $(git branch --show-current)"
echo "Commits: $(git log --oneline origin/main..HEAD | wc -l)"
echo "Files changed: $(git diff --name-only origin/main..HEAD | wc -l)"
echo "Lines added: $(git diff --stat origin/main..HEAD | tail -1 | awk '{print $4}')"
echo "Lines deleted: $(git diff --stat origin/main..HEAD | tail -1 | awk '{print $6}')"

# Run quality checks
echo "Linting: $(npm run lint 2>&1 | grep -c 'error' || echo '0 errors')"
echo "Tests: $(npm test 2>&1 | grep -c 'passing' || echo 'unknown')"

# Check documentation
echo "Documentation: $(find docs -name '*.md' -newer ../main-branch-ref | wc -l) files"
```

**Step 3.3: Comparative Analysis**
```markdown
Create RESULT_COMPARISON.md:

---
# Result Comparison: {{PARALLEL_GROUP_NAME}}

## Task T2: OAuth 2.0 Implementation (agent-1234)

### Quantitative Metrics
- Commits: 15
- Files changed: 12
- Lines of code: +450, -30
- Test coverage: 87%
- Linting errors: 0
- Build time: 2.3s
- Bundle size: +45KB

### Qualitative Assessment
**Strengths**:
- Well-structured, follows OAuth 2.0 spec precisely
- Comprehensive error handling
- Excellent documentation

**Weaknesses**:
- Larger bundle size impact
- More complex setup for developers
- Additional dependencies (oauth2-server library)

**Implementation Highlights**:
- Uses Authorization Code flow with PKCE
- Refresh token rotation implemented
- Supports multiple OAuth providers (Google, GitHub, Microsoft)

---

## Task T3: JWT Implementation (agent-5678)

### Quantitative Metrics
- Commits: 18
- Files changed: 10
- Lines of code: +380, -20
- Test coverage: 92%
- Linting errors: 0
- Build time: 1.9s
- Bundle size: +28KB

### Qualitative Assessment
**Strengths**:
- Simpler implementation, easier to maintain
- Better performance (stateless)
- Smaller bundle size impact

**Weaknesses**:
- Token revocation requires additional infrastructure
- Less suitable for third-party integrations
- Refresh token handling more manual

**Implementation Highlights**:
- Uses RS256 algorithm with key rotation
- Short-lived access tokens (15 min)
- Refresh tokens stored in httpOnly cookies

---

## Recommendation

**Selected Approach**: JWT Implementation (T3)

**Rationale**:
1. **Performance**: Stateless nature better for our microservices architecture
2. **Scalability**: No server-side session storage required
3. **Bundle Size**: 38% smaller than OAuth approach
4. **Test Coverage**: 5% higher coverage
5. **Maintainability**: Simpler codebase

**Components to Cherry-Pick from T2**:
- OAuth provider integrations (for social login)
- Error handling middleware
- Token exchange endpoint pattern

**Integration Strategy**:
1. Use T3 as base implementation
2. Add social login from T2 (3-4 components)
3. Hybrid: JWT for our API, OAuth for third-party logins
4. Estimated integration effort: 2-3 hours

---
```

**Step 3.4: Consensus Building (if needed)**
```markdown
If multiple valid approaches and no clear winner:

Create CONSENSUS_VOTE.md:
---
# Implementation Consensus Vote

## Candidates
1. T2: OAuth 2.0 (agent-1234)
2. T3: JWT (agent-5678)

## Voting Criteria (weighted)
- Performance (30%): T3 wins (stateless, faster)
- Security (25%): T2 wins (standard protocol)
- Maintainability (20%): T3 wins (simpler)
- Feature completeness (15%): T2 wins (third-party providers)
- Bundle size (10%): T3 wins (smaller)

## Weighted Scores
- T2: 0.25×2 + 0.30×1 + 0.20×1 + 0.15×2 + 0.10×1 = 1.40
- T3: 0.25×1 + 0.30×2 + 0.20×2 + 0.15×1 + 0.10×2 = 1.65

## Decision: T3 (JWT) with components from T2

---

Escalate to user if:
- Scores within 5% (too close to call)
- Strategic considerations beyond metrics
- Stakeholder preferences matter
```

### Phase 4: Conflict Resolution

**Step 4.1: Detect Conflicts**
```markdown
Types of conflicts to detect:

1. **File-Level Conflicts**:
   - Multiple agents modified same file in different worktrees
   - Detected when attempting to merge branches

2. **Architectural Conflicts**:
   - Agents made incompatible design decisions
   - Example: T2 uses REST, T3 uses GraphQL for same feature

3. **Data Model Conflicts**:
   - Database schema changes conflict
   - Migration scripts from different agents incompatible

4. **Dependency Conflicts**:
   - Agents added different versions of same library
   - Agents added conflicting libraries

Detection methods:
```bash
# Simulate merge to detect conflicts
git merge --no-commit --no-ff feature/t2-impl feature/t3-impl

if [ $? -ne 0 ]; then
  echo "Merge conflicts detected:"
  git diff --name-only --diff-filter=U
  git merge --abort
fi
```
```

**Step 4.2: Conflict Resolution Strategies**
```markdown
Resolution Strategy Matrix:

┌──────────────────────┬───────────────────┬─────────────────┐
│  Conflict Type       │   Auto-Resolve?   │   Strategy      │
├──────────────────────┼───────────────────┼─────────────────┤
│ Formatting only      │       Yes         │ Run formatter   │
│ Import order         │       Yes         │ Run linter      │
│ Documentation        │       Yes         │ Combine both    │
│ Code logic           │       No          │ User decides    │
│ Architecture         │       No          │ User decides    │
│ Data model           │       No          │ User decides    │
│ Dependencies         │       Maybe       │ Use newer ver   │
└──────────────────────┴───────────────────┴─────────────────┘

Auto-Resolution Process:
```bash
# For auto-resolvable conflicts:

# 1. Formatting conflicts
npm run format  # or prettier/black/rustfmt

# 2. Import conflicts
npm run lint --fix

# 3. Documentation merge
# Combine sections from both, mark duplicates
cat file-from-t2.md file-from-t3.md | sort -u > merged.md

# 4. Re-test after auto-resolution
npm test

if [ $? -eq 0 ]; then
  echo "✓ Auto-resolved successfully"
  git add .
  git commit -m "Resolve auto-fixable conflicts between T2 and T3"
else
  echo "✗ Auto-resolution failed, escalate to user"
fi
```

Manual Resolution Required:
```markdown
Create CONFLICT_RESOLUTION_NEEDED.md:
---
# Conflict Resolution Required

## Conflict Summary
**Tasks Involved**: T2 (OAuth) vs T3 (JWT)
**Conflict Type**: Architectural
**Files Affected**:
- src/auth/strategy.ts (both modified incompatibly)
- src/middleware/auth.ts (different approaches)

## T2 Approach (OAuth)
```typescript
// Uses passport.js with OAuth strategy
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
```

## T3 Approach (JWT)
```typescript
// Uses jsonwebtoken with custom middleware
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
```

## Resolution Options

### Option A: Pure OAuth (Keep T2)
- Pros: Industry standard, third-party login support
- Cons: More complex, larger dependencies
- Effort: Discard T3 entirely

### Option B: Pure JWT (Keep T3)
- Pros: Simpler, better performance
- Cons: Manual social login integration
- Effort: Discard T2 entirely

### Option C: Hybrid (Combine Both)
- Pros: Best of both worlds
- Cons: Increased complexity
- Effort: 4-6 hours integration work

## Orchestrator Recommendation
**Option C (Hybrid)**: Use JWT as primary strategy, add OAuth for social login

**Integration Plan**:
1. Keep T3 JWT implementation as base
2. Add passport-oauth2 from T2 for social providers
3. Implement strategy selector in middleware
4. Update auth routing to support both flows

**Estimated Effort**: 4 hours
**Risk**: Medium (architectural complexity)

## User Decision Required
Please review options and select preferred approach.
Respond with "A", "B", or "C", or propose alternative.

---
```

Escalate to user and await decision.
```

**Step 4.3: Apply Resolution**
```markdown
Once decision made:

1. **Update MULTI_AGENT_PLAN.md**:
   - Document resolution decision
   - Update merge strategy section
   - Assign integration task (may spawn new agent)

2. **Execute Integration**:
```bash
# Example: Hybrid approach (Option C)

# Create integration branch
git checkout -b integration/auth-hybrid

# Start with JWT base (T3)
git merge feature/t3-jwt-impl

# Cherry-pick OAuth components from T2
git cherry-pick feature/t2-oauth-impl~5..feature/t2-oauth-impl~3

# Manually integrate strategy selector
# (code changes here)

# Test integration
npm test

# If successful, mark as resolved
git tag "conflict-resolved-auth-strategy"
```

3. **Update Communication Log**:
```markdown
Append to INTER_AGENT_MESSAGES.md:
---
## Conflict Resolution Update

TIMESTAMP: 2025-11-29T15:30:00Z
CONFLICT: T2 vs T3 architectural differences
RESOLUTION: Hybrid approach (JWT base + OAuth social login)
DECISION BY: User (selected Option C)
IMPLEMENTATION: integration/auth-hybrid branch
STATUS: Resolved ✓

---
```
```

### Phase 5: Progress Tracking and Reporting

**Step 5.1: Calculate Completion Metrics**
```markdown
Parse MULTI_AGENT_PLAN.md task statuses:

Total tasks: ${TOTAL}
Completed: ${COMPLETED}
In Progress: ${IN_PROGRESS}
Blocked: ${BLOCKED}
Not Started: ${NOT_STARTED}

Overall Progress: ${COMPLETED / TOTAL * 100}%

Critical Path Analysis:
- Longest dependency chain: ${MAX_DEPTH} tasks
- Current position in critical path: ${CURRENT_DEPTH}
- Estimated remaining time: ${ESTIMATE}

Blockers Impact:
- ${BLOCKED} blocked tasks
- Blocking ${DOWNSTREAM_BLOCKED} downstream tasks
- Priority: ${PRIORITY_LEVEL}
```

**Step 5.2: Generate Progress Report**
```markdown
Create or update WORKFLOW_PROGRESS.md:

---
# Workflow Progress Report

**Generated**: ${ISO_TIMESTAMP}
**Workflow**: ${FEATURE_NAME}
**Elapsed Time**: ${ELAPSED}

## Progress Summary

Overall: ████████████░░░░░░░░░░░░ 50% (5/10 tasks)

### By Status
- ✓ Completed: 5 tasks (50%)
- ⟳ In Progress: 3 tasks (30%)
- ⚠ Blocked: 2 tasks (20%)
- ○ Not Started: 0 tasks (0%)

### By Role
- Architect: 1/1 complete (100%)
- Builder: 2/4 in progress (50%)
- Validator: 0/2 blocked (0%)
- Scribe: 1/2 complete (50%)
- DevOps: 1/1 complete (100%)

## Timeline

```
Start                   Now                      Projected End
  |======================|===========================|
  14:00               15:30                      17:00

  Elapsed: 90 min
  Remaining: ~90 min (estimated)
  On Track: Yes ✓
```

## Task Details

| ID  | Task | Role | Status | Progress | Est. Remaining | Notes |
|-----|------|------|--------|----------|----------------|-------|
| T1  | Architecture | Architect | ✓ Complete | 100% | - | Delivered on time |
| T2  | OAuth impl | Builder | ✓ Complete | 100% | - | Excellent quality |
| T3  | JWT impl | Builder | ✓ Complete | 100% | - | Selected approach |
| T4  | Security tests | Validator | ⚠ Blocked | 0% | 45 min | Waiting for merge |
| T5  | API docs | Scribe | ⟳ In Progress | 60% | 20 min | On track |
| T6  | Integration tests | Validator | ⚠ Blocked | 0% | 60 min | Waiting for T4 |
| T7  | User guide | Scribe | ✓ Complete | 100% | - | Early completion |
| T8  | CI/CD setup | DevOps | ✓ Complete | 100% | - | Automated pipeline ready |
| T9  | Perf tests | Builder | ⟳ In Progress | 40% | 30 min | Running benchmarks |
| T10 | Final review | Builder | ⟳ In Progress | 20% | 50 min | Started early |

## Blockers

**Priority 1 (Critical Path)**:
- T4 blocked - waiting for T2/T3 merge decision (✓ RESOLVED)
- T6 blocked - depends on T4 completion

**Priority 2 (Non-blocking)**:
- None currently

## Risk Assessment

- **Schedule Risk**: Low - on track for 17:00 completion
- **Quality Risk**: Low - all completed tasks passed validation
- **Integration Risk**: Medium - T2/T3 merge may introduce issues
- **Resource Risk**: Low - all agents healthy and active

## Next Milestones

1. **15:45** - Resolve T4 blocker (merge T2/T3)
2. **16:15** - T4 security tests complete
3. **16:45** - T6 integration tests complete
4. **17:00** - All tasks complete, ready for final merge

---
```

**Step 5.3: Continuous Monitoring Loop**
```markdown
Set up periodic status checks:

```bash
#!/bin/bash
# coordination-monitor.sh

INTERVAL=300  # 5 minutes

while true; do
  echo "[$(date)] Running coordination check..."

  # Update progress dashboard
  /coordinate-workflow --update-only

  # Check for new blockers
  NEW_BLOCKERS=$(grep "Blocked" MULTI_AGENT_PLAN.md | wc -l)
  if [ ${NEW_BLOCKERS} -gt 0 ]; then
    echo "⚠ ${NEW_BLOCKERS} new blockers detected, escalating..."
    # Trigger blocker resolution workflow
  fi

  # Check for completed tasks
  NEWLY_COMPLETED=$(git diff HEAD~1 MULTI_AGENT_PLAN.md | grep "+.*Complete" | wc -l)
  if [ ${NEWLY_COMPLETED} -gt 0 ]; then
    echo "✓ ${NEWLY_COMPLETED} tasks completed since last check"
    # Trigger result aggregation if parallel group complete
  fi

  # Check for idle agents
  IDLE_AGENTS=$(./check-idle-agents.sh | wc -l)
  if [ ${IDLE_AGENTS} -gt 0 ]; then
    echo "⚠ ${IDLE_AGENTS} agents idle > 30 minutes"
    # Notify orchestrator
  fi

  sleep ${INTERVAL}
done
```

Run in background:
```bash
./coordination-monitor.sh > coordination.log 2>&1 &
echo $! > coordination-monitor.pid
```
```

## Error Handling

### Scenario: Agent Stops Responding
```markdown
Detection:
- Agent marked "Running" but no commits for 30+ minutes
- Process still alive but no progress

Actions:
1. Check agent logs for errors
2. Review last commands executed
3. Options:
   a) Send "ping" message via INTER_AGENT_MESSAGES.md
   b) Terminate and respawn with same task
   c) Escalate to user if unclear issue
4. Update AGENT_REGISTRY.md status to "Stalled"
```

### Scenario: Circular Dependency Detected
```markdown
Detection:
- T2 blocked waiting for T3
- T3 blocked waiting for T2

Resolution:
1. Analyze dependency graph
2. Identify break point:
   - Which dependency is weaker?
   - Can one task proceed with partial results?
3. Options:
   a) Break cycle by refining task boundaries
   b) Introduce intermediate task to provide partial data
   c) Re-assign one task to different worktree/agent
4. Update MULTI_AGENT_PLAN.md dependencies
```

### Scenario: Result Aggregation Deadlock
```markdown
If unable to choose between parallel implementations:
1. Calculate objective metrics (performance, size, coverage)
2. If metrics inconclusive, escalate to user
3. Provide comparison dashboard for user decision
4. Option: Merge both as feature flags, A/B test in production
```

## Performance Optimization

### Reduce Coordination Overhead
```markdown
- Batch status checks (every 5 min vs continuous)
- Use git hooks to auto-update MULTI_AGENT_PLAN.md
- Cache agent status locally, refresh on change
- Parallelize health checks across agents
```

### Efficient Result Comparison
```markdown
- Pre-compute metrics during agent execution (not at aggregation time)
- Use git diff statistics instead of full file analysis
- Automated tests run in agent worktree (results cached)
- Lazy evaluation: only compare when both tasks complete
```

## Security Considerations

### Inter-Agent Information Sharing
```markdown
Principle: Agents should share minimal information necessary

Allowed:
- Task status updates
- Completion notifications
- Blocker descriptions
- Public API interfaces

Restricted:
- Internal implementation details (unless requested)
- Sensitive configuration values
- Private keys or credentials
- Full source code (share diffs/summaries only)

Enforcement:
- Orchestrator filters messages through INTER_AGENT_MESSAGES.md
- Read-only access to other agents' worktrees
- No direct inter-agent communication (all via orchestrator)
```

## Integration with Other Commands

**Workflow Sequence:**
```markdown
1. /orchestrate-feature → Create plan
2. /spawn-agents → Instantiate workers
3. /coordinate-workflow → Monitor and coordinate ← (this command)
4. /quality-gate → Validate before merge
5. /worktree-setup → Manage workspace cleanup
```

## Example Execution

**Command**: `/coordinate-workflow`

**Output**:
```markdown
╔══════════════════════════════════════════════════════════════════════╗
║              WORKFLOW COORDINATION ACTIVE                            ║
╚══════════════════════════════════════════════════════════════════════╝

✓ Loaded MULTI_AGENT_PLAN.md (10 tasks)
✓ Loaded AGENT_REGISTRY.md (6 active agents)
✓ Performed health check on all agents

CURRENT STATUS:
  Completed: 5/10 (50%)
  In Progress: 3/10 (30%)
  Blocked: 2/10 (20%)

COORDINATION ACTIONS TAKEN:
  ✓ Resolved blocker for T4 (merged T2/T3)
  ✓ Notified T4 agent that dependency satisfied
  ✓ Detected T2/T3 completion → Started result aggregation
  ✓ Created RESULT_COMPARISON.md
  → User decision required: Select OAuth vs JWT approach

NEXT COORDINATION CHECK: 5 minutes

Monitoring running in background (PID: 12345)
Check WORKFLOW_PROGRESS.md for real-time dashboard
```

## Version History

- **1.0.0** (2025-11-29): Initial release with real-time coordination and conflict resolution

---

**Template Version**: 1.0.0
**Last Updated**: November 29, 2025
**Maintained By**: Engineering Standards Committee
**Review Cycle**: Quarterly
