# Multi-Agent Orchestration Plan

**Project:** [Project/Feature Name]
**Created:** [YYYY-MM-DD HH:MM]
**Orchestrator:** [orchestrator-lead-001 / other]
**Model:** Claude Opus 4
**Status:** [Planning / In Progress / Integration / Completed]

---

## 1. Architecture Decision

### Why Multi-Agent Orchestration?

**Decision Justification:**
<!-- Explain why you chose multi-agent orchestration over single agent + skills -->

Example:
> This feature requires parallel exploration of three different authentication approaches (OAuth, JWT, session-based). Using multi-agent orchestration allows simultaneous implementation and comparison, reducing time-to-decision from 6 hours (sequential) to 2 hours (parallel). The stochastic variation across implementations will provide valuable insights for selecting the optimal approach.

**Decision Matrix Checklist:**

- [ ] Tasks can execute in parallel without dependencies
- [ ] Breadth-first exploration adds value (e.g., comparing approaches)
- [ ] Scale requires concurrency (large codebase, multiple independent modules)
- [ ] Time savings justify orchestration overhead (>40% reduction expected)
- [ ] Context isolation is beneficial (independent workstreams)

**Alternative Considered:** Single agent + skills
- Would require: Sequential implementation (estimated 6 hours)
- Token cost: ~15K tokens
- Decision: Multi-agent preferred due to parallelization benefit

### Token and Cost Estimates

| Approach | Agents | Token Usage | Estimated Cost | Time |
|----------|--------|-------------|----------------|------|
| **Single Agent + Skills** | 1 | 15K tokens | $0.30 | 6 hours |
| **Multi-Agent (Selected)** | 1 orch + 3 workers | 45K tokens | $0.75 | 2 hours |
| **Hybrid** | 1 orch + 4 workers | 55K tokens | $0.90 | 2.5 hours |

**Selected Approach:** Multi-Agent
**ROI Analysis:** 66% time reduction, 2.5x cost increase → Time-sensitive work justifies cost

---

## 2. Project Goal and Scope

### Feature Objective

<!-- 1-2 sentence description of what this orchestration will accomplish -->

**Example:**
> Implement and compare three authentication strategies (OAuth 2.0, JWT, session-based) for the user management API. Deliverable: Working implementations of all three approaches with performance benchmarks, security analysis, and recommendation for production deployment.

### Success Criteria

- [ ] All implementations complete with passing tests
- [ ] Performance benchmarks collected (latency, throughput, memory)
- [ ] Security audit passed for all approaches
- [ ] Documentation complete for each implementation
- [ ] Comparative analysis report with recommendation
- [ ] Integration conflicts resolved
- [ ] Code review completed by security team
- [ ] Final merge to main branch successful

### Constraints and Assumptions

**Constraints:**
- Deadline: Complete within 2 days
- Budget: Maximum $5 API cost for orchestration
- Resources: 4 concurrent agent slots available
- Dependencies: Auth middleware must remain backward compatible

**Assumptions:**
- Existing user database schema can support all three approaches
- Test environment is available for benchmarking
- Security team available for review within 24 hours

---

## 3. Task Assignment Matrix

| Task ID | Description | Agent/Skills | Worktree | Branch | Parallel Group | Status | Dependencies | Estimate |
|---------|-------------|--------------|----------|--------|----------------|--------|--------------|----------|
| T1 | Design auth architecture & API contracts | Architect / `architecture-skill`, `api-design-skill` | `../arch` | `feature/auth-arch` | A | Not Started | - | 1h |
| T2 | Implement OAuth 2.0 approach | Builder-1 / `builder-skill`, `oauth-skill`, `validator-skill` | `../oauth` | `feature/auth-oauth` | B | Not Started | T1 | 3h |
| T3 | Implement JWT approach | Builder-2 / `builder-skill`, `jwt-skill`, `validator-skill` | `../jwt` | `feature/auth-jwt` | B | Not Started | T1 | 3h |
| T4 | Implement session-based approach | Builder-3 / `builder-skill`, `session-skill`, `validator-skill` | `../session` | `feature/auth-session` | B | Not Started | T1 | 3h |
| T5 | Performance benchmarking & comparison | Validator / `validator-skill`, `performance-skill` | `../bench` | `feature/auth-bench` | C | Not Started | T2, T3, T4 | 2h |
| T6 | Security audit all approaches | Validator / `validator-skill`, `security-skill` | `../audit` | `feature/auth-audit` | C | Not Started | T2, T3, T4 | 2h |
| T7 | Documentation & decision report | Scribe / `documentation-skill`, `analysis-skill` | `../docs` | `feature/auth-docs` | D | Not Started | T5, T6 | 1.5h |

**Skills Column Format:** `agent-role / skill1, skill2, skill3`
- Agent role: High-level responsibility (Architect, Builder, Validator, Scribe)
- Skills: Specific skills the agent loads for this task

**Parallel Group Strategy:**
- **Group A** (Sequential): Architecture/planning - must complete first
- **Group B** (Parallel): Three independent implementations - run simultaneously
- **Group C** (Parallel): Benchmarking and security - both analyze all implementations
- **Group D** (Sequential): Documentation - synthesizes results from C

**Dependency Graph:**
```
T1 (Architecture)
├─→ T2 (OAuth)    ┐
├─→ T3 (JWT)      ├─→ T5 (Benchmarking) ┐
└─→ T4 (Session)  ┘                     ├─→ T7 (Documentation)
    └─→ T6 (Security Audit)  ──────────┘
```

---

## 4. Parallel Execution Strategy

### Isolation Method

**Selected:** Git Worktrees
- **Rationale:** Fast setup (<1s), minimal overhead, sufficient isolation for trusted code
- **Base Repository:** `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature`
- **Worktree Parent:** `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/`

**Alternative:** Docker Containers
- **When to use:** Untrusted code, strict resource limits needed, compliance requirements
- **Not selected because:** Trusted internal development, speed prioritized

### Agent Distribution and Model Selection

| Task | Agent | Model | Rationale |
|------|-------|-------|-----------|
| T1 | Architect | Opus 4 | Complex architectural decisions require high reasoning |
| T2-T4 | Builder | Sonnet 4 | Moderate complexity implementation, cost-efficient |
| T5-T6 | Validator | Sonnet 4 | Systematic testing and auditing, balanced capability |
| T7 | Scribe | Sonnet 4 | Documentation synthesis, cost-efficient |

**Cost Optimization:**
- Total agents: 1 Opus + 5 Sonnet instances
- Estimated cost: $0.60-0.90 for full orchestration
- Savings vs all-Opus: 64% cost reduction

### Coordination Mechanism

**Status Tracking:** Atomic updates to this `MULTI_AGENT_PLAN.md` file
- Agents update their own Status column (Not Started → In Progress → Completed)
- Orchestrator monitors every 5 minutes
- Completion triggers downstream task notifications

**Communication Channel:** `INTER_AGENT_MESSAGES.md`
- Formal message structure for handoffs, blockers, questions
- Orchestrator routes messages between agents
- Status field tracks message lifecycle (Sent → Acknowledged → Resolved)

**Blocker Escalation:** Notes section (below)
- Agents append blockers with severity and required resolution
- Orchestrator triages within 10 minutes
- Human escalation for decisions requiring domain expertise

### Merge Strategy

**Selected:** Cherry-pick integration with comparison
1. All three implementations complete in isolated worktrees (T2, T3, T4)
2. Benchmarking and security audits run in separate worktrees analyzing all branches (T5, T6)
3. Decision report (T7) recommends approach based on data
4. Orchestrator cherry-picks selected approach to main
5. Archive alternative implementations for reference

**Conflict Prevention:**
- Architecture defined first (T1) establishes API contracts
- Implementations follow contract, minimal overlap
- Integration tests validate contract adherence

**Validation Before Merge:**
- [ ] All tests passing in selected approach
- [ ] Security audit approved
- [ ] Performance meets requirements (p95 latency <100ms)
- [ ] Documentation complete
- [ ] Code review approved

---

## 5. Skills Composition Plan

### Required Skills Per Task

| Task | Primary Skill | Supporting Skills | Skill Dependencies |
|------|---------------|-------------------|-------------------|
| T1 | `architecture-skill` | `api-design-skill` | None |
| T2 | `builder-skill` | `oauth-skill`, `validator-skill` | None |
| T3 | `builder-skill` | `jwt-skill`, `validator-skill` | None |
| T4 | `builder-skill` | `session-skill`, `validator-skill` | None |
| T5 | `validator-skill` | `performance-skill`, `benchmarking-skill` | Requires T2, T3, T4 artifacts |
| T6 | `validator-skill` | `security-skill`, `audit-skill` | Requires T2, T3, T4 code |
| T7 | `documentation-skill` | `analysis-skill` | Requires T5, T6 reports |

### Progressive Loading Order

**Phase 1 - Planning (T1):**
```
Architect loads:
1. architecture-skill (assess existing patterns)
2. api-design-skill (define contracts)
```

**Phase 2 - Parallel Implementation (T2, T3, T4):**
```
Each Builder loads:
1. builder-skill (TDD workflow, git operations)
2. [domain-skill] (oauth-skill / jwt-skill / session-skill)
3. validator-skill (self-validation before handoff)
```

**Phase 3 - Validation (T5, T6):**
```
Validators load:
1. validator-skill (base testing framework)
2. [specialty-skill] (performance-skill / security-skill)
3. analysis-skill (comparative analysis)
```

**Phase 4 - Synthesis (T7):**
```
Scribe loads:
1. documentation-skill (structured writing)
2. analysis-skill (data synthesis)
```

### Skill Version Pinning

**Reproducibility:** Pin skill versions for this orchestration

```yaml
skills:
  architecture-skill: "v1.2.0"
  api-design-skill: "v1.0.0"
  builder-skill: "v2.1.0"
  oauth-skill: "v1.0.0"
  jwt-skill: "v1.0.0"
  session-skill: "v1.0.0"
  validator-skill: "v2.0.0"
  performance-skill: "v1.1.0"
  security-skill: "v1.3.0"
  documentation-skill: "v1.0.0"
  analysis-skill: "v1.0.0"
```

**Update Policy:** Lock versions at orchestration start, update only if critical bug fix needed

---

## 6. Communication Protocol

### Status Update Mechanism (Atomic)

**Update Format:**
Agents directly edit their Status column in the Task Assignment Matrix (Section 3)

**Valid Status Values:**
- `Not Started` - Task not yet begun
- `In Progress` - Active work
- `Blocked` - Waiting on dependency or decision
- `Completed` - Deliverable ready for handoff
- `Failed` - Unrecoverable error, needs orchestrator intervention

**Atomicity:**
- Single-column updates only (Status or Notes)
- No multi-task status updates in one edit
- Use git-like optimistic locking (orchestrator resolves conflicts)

### Blocker Reporting Format

**Location:** Notes and Blockers section (below)

**Format:**
```markdown
### [Task ID] - [Agent ID] - [Timestamp]
**Severity:** [Critical / High / Medium / Low]
**Blocker Type:** [Dependency / Decision / Technical / Resource]
**Description:** [Clear explanation of what's blocking progress]
**Required Resolution:** [What's needed to unblock]
**Escalation:** [Yes/No - needs human intervention?]
```

**Example:**
```markdown
### T2 - builder-oauth-001 - 2025-12-13 14:30
**Severity:** High
**Blocker Type:** Decision
**Description:** OAuth provider configuration requires client secret. Unclear which provider to use (Google, GitHub, Auth0).
**Required Resolution:** Product decision on OAuth provider, or permission to implement all three.
**Escalation:** Yes - business decision required
```

### Handoff Documentation

**Trigger:** When task status changes to `Completed`

**Handoff Message Structure:**
Post to `INTER_AGENT_MESSAGES.md`:

```markdown
---
FROM: [agent-id]
TO: [downstream-agent-id] or "Orchestrator"
TYPE: Handoff
TASK: [Task ID]
TIMESTAMP: [ISO 8601]
STATUS: Sent

**Deliverables:**
- Branch: [branch-name]
- Commits: [X commits, Y lines changed]
- Files Modified: [List key files]
- Artifacts: [Links to generated documents]

**Validation:**
- [ ] Tests passing (X/X tests)
- [ ] Linting clean (0 errors)
- [ ] Documentation updated
- [ ] Self-review completed

**Notes for Downstream:**
[Any important context, gotchas, or decisions made]

**Context References:**
@file-path:line-number (key implementation details)
---
```

### Inter-Agent Message Structure

**Message Types:**
1. **Handoff** - Task complete, passing to next agent
2. **Blocker** - Cannot proceed, need help
3. **Question** - Need information from another agent
4. **Update** - Broadcast important changes affecting others
5. **Directive** - Orchestrator instruction to agent(s)

**Required Fields:**
- FROM: [agent-id]
- TO: [agent-id or "All" or "Orchestrator"]
- TYPE: [Handoff|Blocker|Question|Update|Directive]
- TIMESTAMP: [ISO 8601]
- STATUS: [Sent|Acknowledged|Resolved]
- MESSAGE: [Content]

**Optional Fields:**
- TASK: [Task ID if applicable]
- PRIORITY: [Low|Medium|High|Critical]
- DEADLINE: [Response deadline if time-sensitive]

---

## 7. Validation Gates

### Pre-Execution Checklist

Before starting orchestration, verify:

- [ ] All required skills are available and versioned
- [ ] Worktree parent directory has sufficient disk space (>5GB)
- [ ] Git repository is clean (no uncommitted changes on main)
- [ ] Dependencies installed and up-to-date
- [ ] Test environment accessible
- [ ] Orchestrator has necessary permissions (Task spawning, git operations)
- [ ] Cost budget approved ($5 maximum for this orchestration)
- [ ] Estimated timeline acceptable (2-day completion target)

### Success Criteria Per Phase

**Phase 1 - Planning (Group A):**
- [ ] Architecture document complete with API contracts
- [ ] Contracts reviewed and approved
- [ ] No ambiguities remaining
- [ ] Downstream agents have clear specifications

**Phase 2 - Implementation (Group B):**
- [ ] All three implementations complete
- [ ] Tests passing for each approach (100% pass rate)
- [ ] Code adheres to API contracts
- [ ] Self-review completed by each builder
- [ ] No critical security vulnerabilities (via automated scan)

**Phase 3 - Validation (Group C):**
- [ ] Performance benchmarks collected for all approaches
- [ ] Security audit completed with findings documented
- [ ] All high/critical findings addressed or accepted
- [ ] Comparison data sufficient for decision

**Phase 4 - Synthesis (Group D):**
- [ ] Documentation complete for all approaches
- [ ] Comparative analysis with clear recommendation
- [ ] Recommendation justified with data
- [ ] Implementation guide for selected approach

### Quality Gate Thresholds

**Code Quality:**
- Zero linting errors (warnings acceptable)
- Test coverage ≥80% statements, ≥75% branches
- Code review approved by 1+ reviewers
- No high/critical security vulnerabilities

**Performance:**
- p50 latency ≤50ms
- p95 latency ≤100ms
- p99 latency ≤200ms
- Throughput ≥1000 req/sec
- Memory usage ≤100MB per instance

**Security:**
- No critical vulnerabilities (CVSS ≥9.0)
- No high vulnerabilities (CVSS ≥7.0) unaddressed
- Secrets management compliant with policy
- Authentication follows OWASP guidelines

### Go/No-Go Decision Criteria

**GO (Proceed to Integration):**
- All success criteria met for completed phases
- All quality gates passed
- No unresolved blockers
- Recommendation has clear data support
- Code review approved
- Security audit approved

**NO-GO (Hold or Remediate):**
- Any mandatory quality gate failed
- Unresolved critical or high severity blockers
- Missing required deliverables
- Insufficient data for recommendation
- Security findings require remediation

**GO WITH CAUTION (Conditional):**
- Minor quality gates missed (documented as technical debt)
- Low/medium blockers with workarounds
- Performance slightly below target (within 10%)
- Requires explicit approval from orchestrator + human stakeholder

---

## 8. Notes and Blockers

<!-- Agents: Append your blockers, questions, and important updates here -->
<!-- Use the Blocker Reporting Format from Section 6 -->
<!-- Orchestrator: Track resolution and decisions here -->

### Example Blocker Entry:

```markdown
### T3 - builder-jwt-001 - 2025-12-13 15:45
**Severity:** Medium
**Blocker Type:** Technical
**Description:** JWT library (@auth/jwt v3.2.0) has a known bug with ES256 signatures. Workaround exists but adds complexity.
**Required Resolution:** Decide between: (1) Use workaround, (2) Switch to RS256, (3) Use alternative library
**Escalation:** No - can proceed with RS256 (recommended)
**Resolution:** 2025-12-13 16:00 - Orchestrator approved RS256 approach. Updated T3 implementation plan.
```

---

## Execution Timeline

### Planned Schedule

| Phase | Group | Tasks | Start | End | Duration |
|-------|-------|-------|-------|-----|----------|
| Planning | A | T1 | Day 1, 09:00 | Day 1, 10:00 | 1h |
| Implementation | B | T2, T3, T4 | Day 1, 10:00 | Day 1, 13:00 | 3h (parallel) |
| Validation | C | T5, T6 | Day 1, 13:00 | Day 1, 15:00 | 2h (parallel) |
| Synthesis | D | T7 | Day 1, 15:00 | Day 1, 16:30 | 1.5h |
| Integration | - | Merge | Day 1, 16:30 | Day 1, 17:00 | 0.5h |
| **Total** | | | | | **8 hours** |

### Actual Execution Log

<!-- Orchestrator updates this as tasks complete -->

| Task ID | Agent ID | Started | Completed | Actual Duration | Status | Notes |
|---------|----------|---------|-----------|-----------------|--------|-------|
| T1 | architect-001 | - | - | - | Not Started | - |
| T2 | builder-oauth-001 | - | - | - | Not Started | - |
| T3 | builder-jwt-001 | - | - | - | Not Started | - |
| T4 | builder-session-001 | - | - | - | Not Started | - |
| T5 | validator-perf-001 | - | - | - | Not Started | - |
| T6 | validator-sec-001 | - | - | - | Not Started | - |
| T7 | scribe-001 | - | - | - | Not Started | - |

---

## Integration Summary

<!-- Orchestrator completes after all tasks done -->

### Selected Approach
**Decision:** [OAuth 2.0 / JWT / Session-based]

**Rationale:**
- [Data-driven justification from T7 analysis]

### Performance Comparison

| Approach | p50 Latency | p95 Latency | Throughput | Memory |
|----------|-------------|-------------|------------|--------|
| OAuth 2.0 | - | - | - | - |
| JWT | - | - | - | - |
| Session | - | - | - | - |

### Security Findings

| Approach | Critical | High | Medium | Low | Status |
|----------|----------|------|--------|-----|--------|
| OAuth 2.0 | - | - | - | - | - |
| JWT | - | - | - | - | - |
| Session | - | - | - | - | - |

### Final Deliverables

- [ ] Selected implementation merged to main
- [ ] Tests integrated into CI/CD pipeline
- [ ] Documentation published
- [ ] Alternative implementations archived
- [ ] Retrospective completed

---

## Retrospective

<!-- Complete after orchestration finishes -->

### What Went Well
- [Success 1]
- [Success 2]

### What Could Improve
- [Improvement 1]
- [Improvement 2]

### Metrics

| Metric | Target | Actual | Delta |
|--------|--------|--------|-------|
| Total Duration | 8 hours | - | - |
| Total Cost | $0.75 | - | - |
| Time Savings vs Sequential | 66% | - | - |
| Quality Gate Pass Rate | 100% | - | - |

### Lessons Learned
- [Lesson 1: What we learned about orchestration patterns]
- [Lesson 2: Skills composition insights]
- [Lesson 3: Model selection effectiveness]

### Recommendations for Future Orchestrations
- [Recommendation 1]
- [Recommendation 2]

---

## Appendix

### Related Documents
- `INTER_AGENT_MESSAGES.md` - Inter-agent communication log
- `ORCHESTRATION_LOG.md` - Detailed execution timeline
- `INTEGRATION_REPORT.md` - Result synthesis and conflict analysis
- Architecture decision (T1): `docs/architecture/auth-comparison.md`
- Final recommendation (T7): `docs/decisions/auth-strategy-decision.md`

### Skill Versions Used
See Section 5 - Skills Composition Plan

### Worktree Locations
- Orchestrator: `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature` (main)
- T1 (arch): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/arch`
- T2 (oauth): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/oauth`
- T3 (jwt): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/jwt`
- T4 (session): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/session`
- T5 (bench): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/bench`
- T6 (audit): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/audit`
- T7 (docs): `/Users/elvis/Documents/Git/HomeLab-Tools/auth-feature-worktrees/docs`

### Emergency Contacts
- Orchestrator failure: Escalate to human operator
- Security blockers: Contact security team (@security-team)
- Infrastructure issues: Contact DevOps (@devops-team)
- Business decisions: Contact product owner (@product-owner)
