# Skills-First Planning and Orchestration

**Version:** 1.0.0
**Last Updated:** December 13, 2025
**Part of:** Claude Command and Control Best Practices Series

---

## Table of Contents

1. [Introduction: The Skills-First Planning Paradigm](#1-introduction-the-skills-first-planning-paradigm)
2. [Decision Framework](#2-decision-framework)
3. [Creating Effective Agent Registries](#3-creating-effective-agent-registries)
4. [Creating Effective Multi-Agent Plans](#4-creating-effective-multi-agent-plans)
5. [Planning Document Lifecycle](#5-planning-document-lifecycle)
6. [Integration with Orchestration Commands](#6-integration-with-orchestration-commands)
7. [Common Patterns and Examples](#7-common-patterns-and-examples)
8. [Anti-Patterns and Pitfalls](#8-anti-patterns-and-pitfalls)
9. [Metrics and Success Criteria](#9-metrics-and-success-criteria)
10. [Quick Reference](#10-quick-reference)

---

## 1. Introduction: The Skills-First Planning Paradigm

### What is Skills-First Planning?

**Skills-first planning** treats **skills** as the primary building block for AI agent capabilities, with multi-agent orchestration reserved for scenarios where parallelization provides clear value.

**Core Hierarchy:**
```
Commands < Skills < Agents < Multi-Agent Systems
```

- **Commands** - Quick session shortcuts (`/test`, `/pr`, `/docs`)
- **Skills** - Reusable workflow automation (builder-skill, validator-skill)
- **Agents** - General-purpose with dynamic skill loading
- **Multi-Agent** - Orchestration for parallelization only

### Why Planning Matters

**Without effective planning:**
- ❌ Over-orchestration (using multi-agent for sequential tasks)
- ❌ Token waste (15x baseline for multi-agent vs 5-7x for skills)
- ❌ Cost inefficiency (2-3x higher costs without clear ROI)
- ❌ Context fragmentation (losing continuity across agent switches)
- ❌ Coordination overhead (message passing, handoffs, conflict resolution)

**With effective planning:**
- ✅ Right tool for the job (decision framework)
- ✅ 35% token reduction (skills vs multi-agent)
- ✅ 28.4% cost optimization (model selection)
- ✅ Maintained quality (96.7% performance parity)
- ✅ 40% faster delivery (when parallelization justified)

### Common Anti-Patterns

**Over-Orchestration:**
```markdown
❌ BAD: Using multi-agent for a bug fix
- Spawns 3 agents (investigator, fixer, tester)
- 45K tokens, $0.75, 2 hour overhead
- Context lost between agents

✅ GOOD: Single agent + skills
- Loads: root-cause-tracing-skill → builder-skill → validator-skill
- 12K tokens, $0.25, 30 minutes
- Full context maintained
```

**Premature Specialization:**
```markdown
❌ BAD: Creating specialized "authentication-agent"
- Fixed role, limited reusability
- Maintenance burden for narrow use case

✅ GOOD: Builder agent + oauth-skill
- Generic builder with domain skill
- Skill reusable across agents and projects
```

### Token and Cost Efficiency Targets

Based on empirical data from production orchestrations:

| Approach | Token Usage (vs baseline) | Relative Cost | Best For |
|----------|---------------------------|---------------|----------|
| Single command | 1x (5K baseline) | Minimal | One-off actions |
| Single agent, 1 skill | 5-7x (25-35K) | Low | Simple tasks |
| Single agent, 3 skills | 5-7x (30-40K) | Low | Sequential workflows |
| Multi-agent (3 agents) | 15x (75K+) | High | Parallel research |
| Hybrid (orch + 3 workers) | 10-12x (50-60K) | Medium | Complex features |

**Efficiency Goal:** Achieve **35% token reduction** by defaulting to skills-first approach

**Cost Goal:** Achieve **28.4% cost reduction** through optimal model selection:
- Haiku 3.5: Monitoring, simple tasks ($0.25/$1.25 per MTok)
- Sonnet 4: Default worker model ($3/$15 per MTok)
- Opus 4: Orchestration, complex reasoning only ($15/$75 per MTok)

---

## 2. Decision Framework

### The Three-Tier Decision Model

#### Tier 1: Single Agent + Skills (Default Choice)

**Use When:**
- ✅ Tasks are sequential and context-dependent
- ✅ Workflow is depth-first (deep investigation, debugging)
- ✅ Context continuity is important
- ✅ Standard development tasks (features, bugs, docs, tests)
- ✅ Iterative refinement required
- ✅ Cost-sensitive work

**Token Efficiency:** 5-7x baseline (30-40K tokens typical)
**Cost:** $0.15-0.40 per session
**Time:** Minimal overhead (<1 min coordination)

**Examples:**
- Bug investigation and fix
- Feature implementation (< 500 lines)
- Refactoring a module
- Writing documentation
- Code review and improvements

**Skills Loaded Progressively:**
```
Phase 1: Investigation
  └─ Load: root-cause-tracing-skill

Phase 2: Implementation
  └─ Load: builder-skill, validator-skill

Phase 3: Documentation
  └─ Load: documentation-skill
```

#### Tier 2: Multi-Agent Orchestration (Parallelization)

**Use When:**
- ✅ Tasks are parallel and truly independent
- ✅ Breadth-first exploration adds value
- ✅ Comparing multiple implementation approaches
- ✅ Scale requires concurrency (large codebase, many modules)
- ✅ Time savings justify cost (>40% reduction expected)
- ✅ Time-sensitive deliverables

**Token Efficiency:** 15x baseline (75K+ tokens typical)
**Cost:** $0.60-1.50 per orchestration
**Time:** 40-66% reduction with parallelization

**Examples:**
- Researching 3 different technical approaches
- Large refactoring across independent modules
- Full-stack feature (backend + frontend + tests parallel)
- Technical proof-of-concept comparisons
- Performance optimization across multiple components

**Orchestration Pattern:**
```
Orchestrator Lead (Opus 4)
├─ Task decomposition
├─ Spawn 3-5 workers (Sonnet 4)
│  ├─ Worker 1 → Loads domain-specific skills
│  ├─ Worker 2 → Loads domain-specific skills
│  └─ Worker 3 → Loads domain-specific skills
└─ Result synthesis and selection
```

#### Tier 3: Hybrid (Orchestrator + Skilled Workers)

**Use When:**
- ✅ Complex feature requiring both parallelization AND depth
- ✅ Multiple approaches need comparison with deep implementation
- ✅ Large-scale refactoring with architectural decisions
- ✅ Full-stack development with specialized domains
- ✅ Balance between speed and context continuity

**Token Efficiency:** 10-12x baseline (50-70K tokens typical)
**Cost:** $0.40-1.00 per orchestration
**Time:** 30-50% reduction vs sequential

**Examples:**
- E-commerce checkout flow (auth + payment + inventory + UI)
- Migration project (analysis + multiple migration paths + validation)
- Platform integration (API design + implementation + testing + docs)
- Architecture modernization (assessment + parallel refactors + integration)

**Hybrid Pattern:**
```
Orchestrator (Opus 4) + skill-orchestrator
├─ Architectural planning
├─ Worker 1 (Sonnet) + [backend-skills]
├─ Worker 2 (Sonnet) + [frontend-skills]
├─ Worker 3 (Sonnet) + [testing-skills]
└─ Integration + documentation
   └─ Orchestrator loads: result-synthesis-skill, documentation-skill
```

### Decision Tree

```
START: New task requested
│
├─ Is context continuity critical?
│  └─ YES → Single Agent + Skills
│
├─ Are tasks truly independent?
│  ├─ NO → Single Agent + Skills
│  └─ YES ↓
│
├─ Will parallelization save >40% time?
│  ├─ NO → Single Agent + Skills (sequential is fine)
│  └─ YES ↓
│
├─ Is time-to-market critical?
│  ├─ NO → Single Agent + Skills (cost-optimize)
│  └─ YES ↓
│
├─ Does each parallel task require deep context?
│  ├─ YES → Hybrid (orchestrator + skilled workers)
│  └─ NO → Multi-Agent (pure parallelization)
│
END: Architecture selected
```

### ROI Calculation

**Formula:**
```
ROI = (Time Saved * Hourly Rate) - (Additional Cost)
      ─────────────────────────────────────────────
              Additional Cost

Where:
- Time Saved = Sequential Time - Parallel Time
- Hourly Rate = Developer equivalent cost (e.g., $100/hr)
- Additional Cost = (Multi-Agent Cost - Single Agent Cost)
```

**Example:**
```
Sequential: 6 hours * $100/hr = $600 value
Parallel: 2 hours * $100/hr = $200 value
Time Saved: 4 hours * $100/hr = $400

Single Agent Cost: $0.30
Multi-Agent Cost: $0.90
Additional Cost: $0.60

ROI = ($400 - $0.60) / $0.60 = 665% return

Conclusion: Multi-agent justified for time-sensitive work
```

---

## 3. Creating Effective Agent Registries

### Purpose of Agent Registries

**Agent registries track:**
- Available agents and their capabilities
- Skills each agent can load (dynamic, not fixed)
- Model selection rationale
- Tool permissions and security boundaries
- Collaboration patterns and handoff protocols
- Performance metrics and cost estimates

**Key Insight:** In skills-first paradigm, registries track **skill compatibility**, not fixed agent roles.

### Skills-First Enhancements to Traditional Agent Configs

**Traditional Agent Config (Anti-Pattern):**
```yaml
name: "Authentication Agent"
role: "Handles all authentication tasks"
capabilities:
  - OAuth 2.0 implementation
  - JWT token management
  - Session handling
  - Password reset flows
```
❌ **Problems:**
- Fixed role limits reusability
- Capabilities are implementation, not transferable
- Maintenance burden for narrow use case

**Skills-First Agent Config (Recommended):**
```yaml
name: "Builder Agent"
role: "General-purpose implementation agent"
orchestration_role: "Worker"
available_skills:
  - builder-skill v2.1.0
  - oauth-skill v1.0.0
  - jwt-skill v1.0.0
  - session-skill v1.0.0
  - validator-skill v2.0.0

skill_discovery_strategy: "progressive_loading"
skill_loading_pattern: |
  1. Analyze task requirements
  2. Load builder-skill (TDD workflow, git ops)
  3. Load domain-specific skill (oauth/jwt/session)
  4. Load validator-skill (self-validation)

derived_capabilities: "Capabilities emerge from skill composition"
```
✅ **Benefits:**
- Generic agent, reusable across domains
- Skills define capabilities (portable, versioned)
- Easy maintenance (update skills, not agents)

### Capability Derivation from Available Skills

**Concept:** Agent capabilities are **derived** from loaded skills, not hardcoded.

**Example - Builder Agent:**
```
Available Skills → Derived Capabilities

builder-skill v2.1.0
  → TDD workflow (red-green-refactor)
  → Git operations (branch, commit, push)
  → Code generation following patterns

oauth-skill v1.0.0
  → OAuth 2.0 provider integration
  → Token management and refresh
  → Authorization code flow implementation

validator-skill v2.0.0
  → Test generation (unit, integration)
  → Code review automation
  → Quality gate validation

COMBINED CAPABILITIES:
  → Implement OAuth authentication with TDD
  → Self-validate before handoff
  → Follow git workflow best practices
```

### Model Selection Economics

**Decision Criteria:**

| Factor | Haiku 3.5 | Sonnet 4 | Opus 4 |
|--------|-----------|----------|--------|
| **Reasoning Complexity** | Low | Medium | High |
| **Context Size** | <20K | <100K | <200K |
| **Task Duration** | <5 min | <30 min | <2 hours |
| **Error Tolerance** | High | Medium | Low |
| **Cost Sensitivity** | High | Medium | Low |
| **Speed Requirement** | Critical | Important | Flexible |

**Economic Guidelines:**

1. **Default to Sonnet 4** - Best cost/quality balance for 80% of work
   - Cost: $3/$15 per MTok (input/output)
   - Use case: Standard implementation, testing, documentation

2. **Upgrade to Opus 4** - When reasoning quality is critical
   - Cost: $15/$75 per MTok (5x more expensive)
   - Use case: Orchestration, architecture, complex debugging
   - ROI: Justify with time savings or quality requirements

3. **Downgrade to Haiku 3.5** - For simple, repetitive work
   - Cost: $0.25/$1.25 per MTok (12x cheaper than Sonnet)
   - Use case: Monitoring, simple formatting, status updates
   - ROI: 90%+ cost savings for eligible tasks

**Cost Optimization Example:**
```
Scenario: 5-agent orchestration

❌ All Opus 4:
  5 agents * $1.50 = $7.50 per orchestration

✅ Optimized Mix:
  1 Opus (orchestrator) * $1.50 = $1.50
  3 Sonnet (workers) * $0.30 = $0.90
  1 Haiku (monitoring) * $0.05 = $0.05
  Total: $2.45 per orchestration

Savings: 67% cost reduction, <5% quality impact
```

### Security and Isolation Specifications

**Isolation Levels:**

1. **Shared Context** (Default for single agent)
   - Agent maintains full context
   - Progressive skill loading
   - No isolation overhead
   - Risk: Context pollution if not managed

2. **Git Worktree** (Default for multi-agent)
   - Filesystem-level isolation
   - Fast setup (<1 second)
   - Minimal disk overhead
   - Risk: Merge conflicts if dependencies overlap

3. **Container** (Security-critical workflows)
   - Full process isolation
   - Resource limits (CPU, memory, network)
   - Read-only root filesystem
   - Risk: Slower setup (1-3 minutes)

**Security Boundaries Decision Matrix:**

| Scenario | Isolation Level | Rationale |
|----------|----------------|-----------|
| Trusted internal code | Shared Context | Speed, no security risk |
| Parallel development | Git Worktree | Balance isolation and speed |
| Untrusted code execution | Container | Full isolation required |
| Compliance requirements | Container | Audit and control needs |
| Rate-limited APIs | Container | Resource quotas |

**Tool Permission Scoping:**

```yaml
# Orchestrator (Opus 4) - Full Privileges
allowed_tools:
  - Read, Edit, Write (all files)
  - Task (spawn subagents)
  - Bash (git, process management)
restricted_paths:
  - /secrets, /credentials (even orchestrator can't access)
approval_gates:
  - main branch modifications
  - destructive git operations

# Worker (Sonnet 4) - Task-Scoped Privileges
allowed_tools:
  - Read, Edit, Write (worktree only)
  - Bash (git within worktree, no spawn)
restricted_paths:
  - Parent repository
  - Other worktrees
  - Production configs
approval_gates:
  - Branch merges (orchestrator only)

# Monitor (Haiku 3.5) - Read-Only
allowed_tools:
  - Read (logs, plans, status)
  - Bash (ps, tail, non-modifying ops)
restricted_paths:
  - Cannot modify any files
approval_gates:
  - Escalate alerts only
```

### Registry Template Usage

**Location:** `templates/orchestration/AGENT_REGISTRY.md`

**When to Create Registry:**
1. Starting new multi-agent orchestration project
2. Onboarding team to orchestration patterns
3. Documenting available agents for reuse
4. Tracking skill compatibility across agents
5. Planning agent ecosystem evolution

**Maintenance:**
- Review quarterly
- Update when skills added/deprecated
- Version with semantic versioning
- Track in git with full history

---

## 4. Creating Effective Multi-Agent Plans

### Purpose: Coordinate Parallel Execution with Skills

**Multi-agent plans serve as:**
- Central source of truth for orchestration state
- Task decomposition and dependency mapping
- Skill composition and loading strategy
- Communication protocol between agents
- Validation gates and success criteria
- Execution timeline and metrics tracking

**Key Principle:** Plans must justify why multi-agent is chosen over single agent + skills.

### Task Decomposition Principles

**1. Maximize Parallelization Opportunities**

Break work into **truly independent** subtasks that can run simultaneously without coordination overhead.

**Example - Authentication Feature:**
```markdown
❌ BAD Decomposition (False Parallelism):
- T1: Design auth schema
- T2: Implement login endpoint (depends on T1 schema)
- T3: Implement logout endpoint (depends on T1 schema)
- T4: Write tests (depends on T2, T3)

Problem: T2 and T3 are falsely "parallel" - both need T1.
Reality: T1 → (T2, T3) → T4 = 4 serial steps, no real parallelization

✅ GOOD Decomposition (True Parallelism):
- T1: Design auth contracts (API spec, no implementation)
- Group B (Parallel - all use same contract):
  - T2: Implement OAuth approach
  - T3: Implement JWT approach
  - T4: Implement session approach
- Group C (Parallel - analyze completed implementations):
  - T5: Performance benchmarks
  - T6: Security audit
- T7: Comparative analysis and selection

Benefit: T2/T3/T4 run simultaneously, T5/T6 run simultaneously
Real time savings: 3x speedup in Group B, 2x in Group C
```

**2. Map Subtasks to Skills (Not Fixed Roles)**

**Anti-Pattern:**
```markdown
T1: Backend work → Backend Agent
T2: Frontend work → Frontend Agent
T3: Testing → QA Agent
```
❌ Problems: Fixed roles, agents not reusable

**Recommended:**
```markdown
T1: API implementation → Builder + [backend-skill, api-design-skill]
T2: UI implementation → Builder + [frontend-skill, react-skill]
T3: E2E testing → Validator + [testing-skill, e2e-skill]
```
✅ Benefits: Same agent type, different skills, reusable pattern

**3. Create Explicit Dependency Graph**

**Dependency Types:**
- **Sequential (→)**: Task B requires Task A's output
- **Parallel (||)**: Tasks can run simultaneously
- **Conditional (?)**: Task depends on decision/validation

**Example Dependency Graph:**
```
T1 (Architecture) → Must complete first
  ├─→ T2 (Implementation A) ┐
  ├─→ T3 (Implementation B) ├─|| Parallel Group B
  └─→ T4 (Implementation C) ┘
       ├─→ T5 (Performance) ┐
       └─→ T6 (Security)    ├─|| Parallel Group C
            └─→ T7 (Selection) → Must be last

Critical Path: T1 → T2/T3/T4 → T5/T6 → T7
Parallelization Benefit: Group B (3→1 slot), Group C (2→1 slot)
Time Savings: ~50% vs purely sequential
```

### Parallel Group Strategy (3-Tier Pattern)

**Pattern:**
```
Group A (Sequential): Foundation
  └─ 1-2 tasks establishing contracts/architecture

Group B (Parallel): Core Work
  └─ 3-5 tasks executing independently

Group C (Parallel): Validation
  └─ 2-3 tasks analyzing Group B outputs

Optional Group D (Sequential): Synthesis
  └─ 1 task integrating results
```

**Example - E-Commerce Checkout:**
```markdown
Group A: Architecture (Sequential)
- T1: Design checkout flow and API contracts
- T2: Define data models and state machine

Group B: Implementation (Parallel)
- T3: Cart management service
- T4: Payment processing integration
- T5: Inventory reservation system
- T6: Order confirmation workflow

Group C: Validation (Parallel)
- T7: Integration testing
- T8: Security audit
- T9: Performance benchmarking

Group D: Deployment (Sequential)
- T10: Documentation and deployment guide
```

**Benefits:**
- Clear dependency structure
- Obvious parallelization points
- Natural validation gates between groups
- Easy to visualize and communicate

### Skills Composition and Loading Order

**Progressive Loading Strategy:**

Instead of pre-loading all skills, agents load skills as workflow progresses.

**Example - Builder Agent on Implementation Task:**
```markdown
Phase 1: Analysis (5 min)
Agent loads:
  - No skills initially
  - Reads requirements, analyzes existing code

Phase 2: Design (10 min)
Agent loads:
  - architecture-skill (pattern analysis)
  - api-design-skill (contract definition)
Creates: Design document

Phase 3: Implementation (60 min)
Agent loads:
  - builder-skill (TDD workflow, git ops)
  - [domain-skill] (e.g., payment-integration-skill)
Creates: Implementation code

Phase 4: Validation (15 min)
Agent loads:
  - validator-skill (test generation)
  - Already has builder-skill from Phase 3
Creates: Test suite

Phase 5: Documentation (10 min)
Agent loads:
  - documentation-skill
  - Uses context from previous phases
Creates: API documentation

Token Savings: Only pay for skills when needed
Context Continuity: Same agent throughout, maintains full context
```

### Communication and Handoff Protocols

**Three Communication Layers:**

1. **Status Updates** (Atomic, in plan document)
   ```markdown
   Agents update Status column directly:
   - Not Started → In Progress → Completed
   - Atomic operation (single column, single task)
   - No conflicts, orchestrator polls every 5-10 minutes
   ```

2. **Blocker Escalation** (Notes section in plan)
   ```markdown
   Format:
   ### [Task ID] - [Agent ID] - [Timestamp]
   **Severity:** Critical / High / Medium / Low
   **Blocker Type:** Dependency / Decision / Technical / Resource
   **Description:** Clear explanation
   **Required Resolution:** What's needed to unblock
   **Escalation:** Yes/No (needs human?)
   ```

3. **Inter-Agent Messages** (`INTER_AGENT_MESSAGES.md`)
   ```markdown
   FROM: builder-oauth-001
   TO: orchestrator-lead-001
   TYPE: Handoff
   TASK: T2
   TIMESTAMP: 2025-12-13T14:30:00Z
   STATUS: Sent

   Deliverables:
   - Branch: feature/auth-oauth
   - Commits: 12 commits, 450 lines
   - Tests: 24 tests passing

   Notes: OAuth 2.0 implementation complete.
   Used Google OAuth provider as specified.
   ```

**Handoff Best Practices:**
- ✅ Clear deliverable documentation
- ✅ Validation checklist completed
- ✅ Context for downstream agent
- ✅ Known issues or gotchas flagged
- ❌ No "over the wall" handoffs without context

### Cost and Token Budgeting

**Budget Estimation Formula:**
```
Total Tokens = (Orchestrator Tokens) + Σ(Worker Tokens) + (Communication Overhead)

Where:
- Orchestrator: 30K-50K (full context)
- Worker: 5K-15K per task (task-specific slice)
- Communication: 2K-5K (plan updates, messages)

Cost = (Tokens / 1M) * (Model Rate)
```

**Example Budget:**
```markdown
Orchestration: 5 tasks, 3 parallel workers

Orchestrator (Opus 4):
  - Planning: 10K tokens * $15/MTok = $0.15
  - Monitoring: 5K tokens * $15/MTok = $0.075
  - Synthesis: 8K tokens * $15/MTok = $0.12
  Total: $0.345

Workers (3x Sonnet 4):
  - Worker 1: 12K tokens * $3/MTok = $0.036
  - Worker 2: 10K tokens * $3/MTok = $0.030
  - Worker 3: 15K tokens * $3/MTok = $0.045
  Total: $0.111

Communication overhead: 3K tokens * $3/MTok = $0.009

Grand Total: $0.465
Budget allocated: $0.75
Remaining: $0.285 (38% buffer)
```

**Budget Controls:**
- Set maximum per orchestration session
- Alert when 80% consumed
- Require approval to exceed budget
- Track actual vs estimated for future planning

### Plan Template Usage

**Location:** `templates/orchestration/MULTIAGENT_PLAN.md`

**When to Create Plan:**
1. Before starting multi-agent orchestration
2. As output of `/orchestrate-feature` command
3. When parallelization ROI is justified
4. For complex features requiring coordination

**Plan Lifecycle:**
```
Creation → Execution → Monitoring → Integration → Retrospective
    ↓          ↓           ↓             ↓            ↓
Template   Agents      Status        Merge       Lessons
filled     update      tracked       complete    captured
```

---

## 5. Planning Document Lifecycle

### Phase 1: Creation (During `/orchestrate-feature`)

**Input:** User feature request

**Orchestrator Actions:**
1. Analyze request and decompose into tasks
2. Decide: Single agent vs multi-agent vs hybrid
3. If multi-agent: Create `MULTI_AGENT_PLAN.md` from template
4. Fill architecture decision section with justification
5. Create task assignment matrix with skills
6. Estimate tokens and cost
7. Define success criteria

**Artifacts Created:**
- `MULTI_AGENT_PLAN.md` - Central planning document
- `INTER_AGENT_MESSAGES.md` - Communication log (empty)
- `ORCHESTRATION_LOG.md` - Execution timeline (metadata only)

**Validation:**
- [ ] Decision justification is data-driven
- [ ] Tasks are truly parallelizable
- [ ] Skills identified per task
- [ ] Dependencies mapped correctly
- [ ] Budget approved

### Phase 2: Execution (Agents Update)

**Agent Actions:**
1. Agent spawned for task
2. Loads task-specific context from plan
3. Updates status: Not Started → In Progress
4. Loads required skills progressively
5. Executes task in isolated worktree
6. Self-validates before completion
7. Updates status: In Progress → Completed
8. Posts handoff message to INTER_AGENT_MESSAGES.md

**Update Mechanism (Atomic):**
```markdown
Agent edits ONLY their own Status cell:

Before:
| T2 | OAuth impl | Builder / oauth-skill | ../oauth | feature/oauth | B | Not Started | T1 |

After:
| T2 | OAuth impl | Builder / oauth-skill | ../oauth | feature/oauth | B | In Progress | T1 |

Later:
| T2 | OAuth impl | Builder / oauth-skill | ../oauth | feature/oauth | B | Completed | T1 |
```

**Concurrency Control:**
- Each agent updates different row (task)
- Same row updates are serial (git merge resolution)
- Notes section is append-only (no conflicts)

### Phase 3: Monitoring (Real-Time Progress Tracking)

**Orchestrator Monitoring Loop:**
```
Every 5-10 minutes:
1. Read MULTI_AGENT_PLAN.md
2. Check status of all tasks
3. Identify completed tasks → notify downstream dependencies
4. Identify blocked tasks → triage and resolve
5. Check budget consumption (alert if >80%)
6. Update ORCHESTRATION_LOG.md with metrics
7. Post updates to INTER_AGENT_MESSAGES.md if needed
```

**Monitoring Agent (Optional - Haiku 3.5):**
```yaml
role: "Real-time monitoring specialist"
model: "Haiku 3.5"
frequency: "Every 30 seconds"
responsibilities:
  - Track task completion rate
  - Detect stuck agents (no progress >10 min)
  - Monitor resource usage
  - Alert on anomalies
  - Generate dashboard updates
cost: "$0.01-0.05 per orchestration"
value: "Early detection of issues"
```

**Dashboard Output (`MONITORING_DASHBOARD.md`):**
```markdown
## Orchestration Status
**Last Updated:** 2025-12-13 14:35:00

| Metric | Value |
|--------|-------|
| Total Tasks | 7 |
| Completed | 3 |
| In Progress | 2 |
| Not Started | 2 |
| Blocked | 0 |
| Success Rate | 100% (3/3) |
| Estimated Completion | 14:55 (20 min) |

## Active Agents
| Agent | Task | Status | Duration |
|-------|------|--------|----------|
| builder-jwt-001 | T3 | In Progress | 45 min |
| builder-session-001 | T4 | In Progress | 42 min |

## Alerts
🟢 All systems normal
```

### Phase 4: Integration (Completion and Merge)

**Orchestrator Integration Process:**

1. **Verify All Tasks Complete**
   ```bash
   # Check all tasks marked "Completed"
   grep "Completed" MULTI_AGENT_PLAN.md | wc -l
   # Should equal total task count
   ```

2. **Collect Deliverables**
   ```markdown
   For each completed task:
   - Branch name
   - Commit count and changes
   - Test results
   - Artifacts generated
   ```

3. **Conflict Detection**
   ```bash
   # Simulate merge of all branches
   git merge --no-commit --no-ff feature/t2 feature/t3 feature/t4
   # Identify conflicts (file, line, semantic)
   ```

4. **Resolution Strategy**
   ```markdown
   If conflicts:
   - Auto-resolve: Formatting, imports, docs
   - Human review: Logic changes, architecture
   - Cherry-pick: Select best implementation
   ```

5. **Integration Testing**
   ```bash
   # Run full test suite on merged code
   npm test
   npm run lint
   npm run security-audit
   ```

6. **Merge to Main**
   ```bash
   # If all tests pass
   git checkout main
   git merge --no-ff feature/integration
   git push origin main
   ```

**Artifacts Created:**
- `INTEGRATION_REPORT.md` - Merge analysis and conflicts
- `RESULT_SYNTHESIS.md` - Combined deliverables
- Updated `MULTI_AGENT_PLAN.md` - Final status

### Phase 5: Retrospective (Lessons Learned Extraction)

**Orchestrator Retrospective Process:**

1. **Calculate Metrics**
   ```markdown
   - Total duration: Actual vs estimated
   - Total cost: Actual vs budget
   - Time savings: vs sequential baseline
   - Quality metrics: Tests passing, issues found
   - Efficiency: Token usage, model selection effectiveness
   ```

2. **Identify Patterns**
   ```markdown
   What went well:
   - Task decomposition was accurate
   - Parallel Group B achieved 3x speedup
   - Skills composition worked smoothly

   What could improve:
   - T2 took 2x longer than estimated (dependency on external API)
   - Communication overhead was higher than expected
   - Should have used Haiku for monitoring (cost optimization)
   ```

3. **Extract Lessons**
   ```markdown
   For future orchestrations:
   1. Add 50% buffer to external API integration tasks
   2. Consider monitoring agent for orchestrations >5 tasks
   3. Pre-validate skill versions to avoid mid-execution updates
   ```

4. **Update Templates**
   ```markdown
   If patterns emerge:
   - Update AGENT_REGISTRY.md with new skill compositions
   - Update MULTIAGENT_PLAN.md template with lessons
   - Document anti-patterns in this guide
   ```

5. **Archive**
   ```bash
   # Move plan to archive for future reference
   mv MULTI_AGENT_PLAN.md docs/orchestrations/archive/2025-12-13-auth-feature.md
   ```

**Continuous Improvement:**
- Quarterly review of archived plans
- Extract common patterns → new skills
- Identify frequently missed estimates → adjust templates
- Track success rate and ROI metrics

---

## 6. Integration with Orchestration Commands

### Command Workflow Overview

```
/orchestrate-feature (Planning)
        ↓
  MULTI_AGENT_PLAN.md created
        ↓
/spawn-agents (Instantiation)
        ↓
  Agents running in worktrees
        ↓
/coordinate-workflow (Monitoring)
        ↓
  Status tracked, blockers resolved
        ↓
/quality-gate (Validation)
        ↓
  All checks passed
        ↓
Integration and merge
```

### 1. `/orchestrate-feature` Creates MULTI_AGENT_PLAN.md

**Command Purpose:** Decompose complex features into parallel tasks and create planning artifacts

**What It Does:**
1. Analyzes feature request
2. Decides: Single agent vs multi-agent vs hybrid
3. If multi-agent:
   - Creates `MULTI_AGENT_PLAN.md` from template
   - Decomposes into parallelizable tasks
   - Assigns skills to each task
   - Estimates tokens and cost
   - Sets up worktree strategy
4. Initializes communication channels
5. Defines success criteria

**Skill Integration:**
```markdown
Orchestrator loads:
- multi-agent-planner-skill (task decomposition)
- worktree-manager-skill (isolation setup)

For each task, specifies:
- Required skills for agent to load
- Skill dependencies
- Progressive loading order
```

**Output:**
- `MULTI_AGENT_PLAN.md` populated with tasks
- `ORCHESTRATION_LOG.md` initialized
- `INTER_AGENT_MESSAGES.md` created

**Usage:**
```bash
/orchestrate-feature "Implement user authentication with OAuth, JWT, and session-based approaches for comparison"
```

### 2. `/spawn-agents` Uses AGENT_REGISTRY.md

**Command Purpose:** Instantiate specialized agents based on task requirements

**What It Does:**
1. Reads task requirements from `MULTI_AGENT_PLAN.md`
2. References `AGENT_REGISTRY.md` for agent capabilities
3. Selects appropriate agent type (builder, validator, etc.)
4. Determines model (Opus/Sonnet/Haiku) based on complexity
5. Sets up isolation (worktree or container)
6. Scopes permissions per agent
7. Spawns agent with task-specific context
8. Tracks agent in `ORCHESTRATION_LOG.md`

**Skill Integration:**
```markdown
spawn-agents reads MULTI_AGENT_PLAN.md:
  Task T2: Builder / oauth-skill, validator-skill

Looks up in AGENT_REGISTRY.md:
  Builder agent available_skills: [builder-skill, oauth-skill, validator-skill]
  ✓ Skills compatible

Spawns agent with directive:
  "Load builder-skill, then oauth-skill for implementation,
   then validator-skill for self-validation"
```

**Model Selection Logic:**
```
Task complexity score:
- Lines of code: +1 per 100 lines
- Dependencies: +1 per external dependency
- Novel patterns: +2 if new pattern
- Risk level: +2 if security/performance critical

Score 0-3: Haiku 3.5
Score 4-7: Sonnet 4
Score 8+: Opus 4

Override: Orchestrator always Opus 4
```

**Output:**
- Agent instances running in worktrees
- `ORCHESTRATION_LOG.md` updated with agent IDs
- Context slices distributed to agents

**Usage:**
```bash
/spawn-agents
# Reads MULTI_AGENT_PLAN.md automatically
# Spawns all agents for "Not Started" tasks in parallel groups
```

### 3. `/coordinate-workflow` Updates Plan Status

**Command Purpose:** Monitor active workflows, facilitate communication, aggregate results

**What It Does:**
1. Polls `MULTI_AGENT_PLAN.md` every 5 minutes
2. Checks agent progress (status updates)
3. Routes messages in `INTER_AGENT_MESSAGES.md`
4. Detects blockers (tasks stuck >10 min)
5. Triages and resolves blockers
6. Notifies downstream agents when dependencies complete
7. Aggregates partial results
8. Updates `ORCHESTRATION_LOG.md` with metrics

**Skill Integration:**
```markdown
Orchestrator loads:
- agent-communication-skill (message routing)
- bottleneck-detection-skill (identify stuck tasks)
- result-synthesis-skill (aggregate outputs)

Progressive loading based on phase:
- Early: Communication only
- Mid: Add bottleneck detection
- Late: Add result synthesis
```

**Coordination Loop:**
```python
while not all_tasks_complete:
    # Poll status (every 5 min)
    plan = read_plan()

    # Check for completions
    completed = [t for t in plan.tasks if t.status == "Completed" and not t.notified]
    for task in completed:
        notify_downstream_agents(task)
        task.notified = True

    # Check for blockers
    blocked = [t for t in plan.tasks if t.status == "Blocked"]
    for task in blocked:
        triage_blocker(task)

    # Update metrics
    update_orchestration_log(plan)

    sleep(5 * 60)  # 5 minutes
```

**Output:**
- Real-time status updates in plan
- Blocker resolutions tracked
- `INTER_AGENT_MESSAGES.md` populated
- `MONITORING_DASHBOARD.md` (if monitoring agent active)

**Usage:**
```bash
/coordinate-workflow
# Starts monitoring loop
# Runs until all tasks complete or user interrupts
```

### 4. `/quality-gate` Validates Against Success Criteria

**Command Purpose:** Comprehensive validation before integration/deployment

**What It Does:**
1. Reads success criteria from `MULTI_AGENT_PLAN.md`
2. Runs parallel validation pipeline:
   - Linting and code quality
   - Test execution suite
   - Security audit
   - Performance benchmarking
3. Aggregates results
4. Compares against thresholds
5. Makes go/no-go decision
6. Generates `QUALITY_GATE_REPORT.md`

**Validation Phases (Parallel):**
```markdown
Phase 1: Code Quality (5-10 min)
  Agent loads: linting-skill, code-quality-skill
  └─ ESLint, Prettier, TypeScript checks

Phase 2: Testing (10-20 min)
  Agent loads: validator-skill, testing-skill
  └─ Unit, integration, e2e tests

Phase 3: Security (5-15 min)
  Agent loads: security-skill, audit-skill
  └─ Dependency scan, SAST, secret detection

Phase 4: Performance (2-10 min)
  Agent loads: performance-skill, benchmarking-skill
  └─ Load tests, profiling, regression checks

All phases run in parallel (max 20 min total)
```

**Decision Logic:**
```markdown
GO:
✓ All tests passing (100%)
✓ Zero critical vulnerabilities
✓ Performance within 10% of baseline
✓ Coverage ≥80%

NO-GO:
✗ Any test failures
✗ Critical vulnerabilities found
✗ Performance regression >10%
✗ Coverage <80%

GO WITH CAUTION:
⚠ Only warnings (no errors)
⚠ Medium vulnerabilities with mitigation
⚠ Performance regression 5-10%
→ Requires explicit approval
```

**Output:**
- `QUALITY_GATE_REPORT.md` - Detailed results
- `QUALITY_GATE_DECISION.md` - Go/no-go with justification
- Updated `MULTI_AGENT_PLAN.md` - Validation status

**Usage:**
```bash
/quality-gate
# Runs all validation phases
# Returns: GO / NO-GO / GO WITH CAUTION
```

### 5. `/worktree-setup` Implements Isolation Strategy

**Command Purpose:** Automate git worktree lifecycle with safety checks

**What It Does:**
1. Reads isolation strategy from `MULTI_AGENT_PLAN.md`
2. Validates repository state (clean working directory)
3. Enforces branch naming convention
4. Creates worktree directories for each agent
5. Replicates configuration files (.env, .gitignore)
6. Runs health checks
7. Prevents multi-worktree conflicts

**Worktree Structure:**
```
/Users/elvis/auth-feature/                 # Main repository
/Users/elvis/auth-feature-worktrees/
  ├── arch/                                # T1 worktree
  │   └── .git, src/, ...
  ├── oauth/                               # T2 worktree
  │   └── .git, src/, ...
  ├── jwt/                                 # T3 worktree
  │   └── .git, src/, ...
  └── session/                             # T4 worktree
      └── .git, src/, ...
```

**Branch Naming Enforcement:**
```
Pattern: feature/[task-id]-[description]

Examples:
✓ feature/t2-auth-oauth
✓ feature/t3-auth-jwt
✗ feature/oauth (missing task ID)
✗ t2-oauth (missing feature prefix)
```

**Health Checks:**
```bash
For each worktree:
✓ Directory created
✓ Branch checked out
✓ Config files present
✓ Dependencies installed
✓ Tests runnable
✗ No uncommitted changes in main
```

**Cleanup (After Integration):**
```bash
/worktree-setup --cleanup
# Safely removes worktrees
# Verifies all changes committed
# Deletes branches if merged
```

**Output:**
- Worktree directories ready for agents
- `WORKTREE_METADATA.md` - Paths and branches
- Health check results

**Usage:**
```bash
# Setup phase
/worktree-setup

# Cleanup phase (after merge)
/worktree-setup --cleanup
```

---

## 7. Common Patterns and Examples

### Pattern 1: Sequential Workflow (Single Agent + 3 Skills)

**Scenario:** Bug investigation and fix

**Characteristics:**
- Context-dependent (need to maintain investigation state)
- Depth-first (deep dive into root cause)
- Iterative refinement
- Low token budget

**Implementation:**
```markdown
Agent: Single Builder Agent (Sonnet 4)

Phase 1: Investigation (15 min)
  Load: root-cause-tracing-skill
  Actions:
    - Analyze error logs
    - Trace execution path
    - Identify root cause
    - Document findings

Phase 2: Fix Implementation (30 min)
  Load: builder-skill (keep root-cause-tracing for context)
  Actions:
    - Implement fix following TDD
    - Write regression test
    - Validate fix resolves issue

Phase 3: Documentation (10 min)
  Load: documentation-skill (keep all previous context)
  Actions:
    - Update CHANGELOG
    - Add code comments
    - Document gotchas

Total: 55 minutes, 35K tokens, $0.25
```

**Key Benefit:** Full context maintained, no coordination overhead

**When to Use:**
- Bug fixes
- Small features (<500 lines)
- Refactoring single module
- Documentation updates

### Pattern 2: Parallel Research (3 Agents with Same Research Skill)

**Scenario:** Evaluate three caching strategies

**Characteristics:**
- Breadth-first (explore multiple options)
- Independent research paths
- Comparison and selection needed
- Medium token budget

**Implementation:**
```markdown
Orchestrator: Opus 4 (planning + synthesis)

Phase 1: Planning (10 min)
  Orchestrator loads: multi-agent-planner-skill
  Creates plan with 3 parallel research tasks

Phase 2: Parallel Research (60 min)
  Researcher 1 (Sonnet 4):
    Load: researcher-skill, redis-skill
    Topic: Redis caching
    Deliverable: Technical report, POC

  Researcher 2 (Sonnet 4):
    Load: researcher-skill, memcached-skill
    Topic: Memcached caching
    Deliverable: Technical report, POC

  Researcher 3 (Sonnet 4):
    Load: researcher-skill, cdn-skill
    Topic: CDN edge caching
    Deliverable: Technical report, POC

Phase 3: Synthesis (20 min)
  Orchestrator loads: result-synthesis-skill, analysis-skill
  Actions:
    - Aggregate 3 reports
    - Compare pros/cons
    - Recommend approach
    - Create decision document

Total: 90 minutes (60 min with parallelization)
       65K tokens, $0.75

Time Savings: 33% vs sequential (3 * 60 min = 180 min)
```

**Key Benefit:** Parallel exploration, stochastic variation in approaches

**When to Use:**
- Technology evaluation
- Multiple solution approaches
- Proof-of-concept comparisons
- Research and analysis tasks

### Pattern 3: Hybrid Feature Development (Orchestrator + 4 Workers)

**Scenario:** E-commerce checkout flow

**Characteristics:**
- Complex, multi-component feature
- Some parallelization possible
- Requires integration
- High token budget

**Implementation:**
```markdown
Orchestrator: Opus 4 (architecture + coordination)

Phase 1: Architecture (30 min)
  Orchestrator loads: architecture-skill, api-design-skill
  Deliverables:
    - System design
    - API contracts
    - Data models
    - Integration plan

Phase 2: Parallel Implementation (120 min)
  Builder 1 (Sonnet 4):
    Load: builder-skill, cart-skill, validator-skill
    Task: Shopping cart management
    Worktree: ../cart

  Builder 2 (Sonnet 4):
    Load: builder-skill, payment-skill, validator-skill
    Task: Payment processing
    Worktree: ../payment

  Builder 3 (Sonnet 4):
    Load: builder-skill, inventory-skill, validator-skill
    Task: Inventory reservation
    Worktree: ../inventory

  Builder 4 (Sonnet 4):
    Load: builder-skill, notification-skill, validator-skill
    Task: Order confirmation
    Worktree: ../notification

Phase 3: Integration Testing (45 min)
  Validator (Sonnet 4):
    Load: validator-skill, e2e-skill, performance-skill
    Task: End-to-end checkout flow testing
    Worktree: ../integration

Phase 4: Synthesis (30 min)
  Orchestrator loads: result-synthesis-skill, documentation-skill
  Actions:
    - Merge all components
    - Resolve integration conflicts
    - Generate documentation
    - Create deployment guide

Total: 225 minutes (120 min with parallelization)
       95K tokens, $1.20

Time Savings: 47% vs sequential (4 * 120 min + 75 min = 555 min)
ROI: 330 min saved * $100/hr / $1.20 cost = 27,400% return
```

**Key Benefit:** Parallelization + deep context per component

**When to Use:**
- Full-stack features
- Multi-component systems
- Large refactorings
- Platform integrations

### Cost Comparison Table with Token Estimates

| Pattern | Approach | Agents | Tokens | Cost | Time | Use Case |
|---------|----------|--------|--------|------|------|----------|
| **Bug Fix** | Single + Skills | 1 Sonnet | 35K | $0.25 | 1h | Simple debugging |
| **Small Feature** | Single + Skills | 1 Sonnet | 40K | $0.30 | 3h | <500 lines |
| **Research** | Multi-Agent | 1 Opus + 3 Sonnet | 65K | $0.75 | 1.5h | Parallel exploration |
| **Medium Feature** | Hybrid | 1 Opus + 4 Sonnet | 95K | $1.20 | 3.75h | Multi-component |
| **Large Refactor** | Hybrid | 1 Opus + 6 Sonnet | 130K | $1.80 | 5h | Independent modules |

**Break-Even Analysis:**
```
Multi-Agent worth it when:
  (Sequential Time - Parallel Time) * Hourly Rate > Additional Cost

Example - Research Pattern:
  (180 min - 90 min) * $100/hr / 60 = $150 value
  Additional cost: $0.75 - $0.30 = $0.45
  ROI: ($150 - $0.45) / $0.45 = 33,200% return

Conclusion: Almost always worth it for parallel research
```

---

## 8. Anti-Patterns and Pitfalls

### Anti-Pattern 1: Over-Orchestration

**Description:** Using multi-agent for tasks better suited to single agent + skills

**Example:**
```markdown
❌ BAD: "Fix typo in README"
  Orchestrator spawns:
  - Investigator agent (finds typo)
  - Editor agent (fixes typo)
  - Reviewer agent (validates fix)

  Result: 45K tokens, $0.60, 30 min overhead

✅ GOOD: Single agent + edit
  Agent: Opens README, fixes typo, commits

  Result: 8K tokens, $0.05, 2 min
```

**Why It Happens:**
- Misunderstanding of when multi-agent adds value
- Copy-pasting orchestration patterns without evaluation
- Premature optimization

**How to Avoid:**
- Use decision tree (Section 2)
- Calculate ROI before orchestrating
- Default to single agent + skills

### Anti-Pattern 2: Fixed Agent Roles

**Description:** Creating specialized agents instead of using skills

**Example:**
```markdown
❌ BAD: Create "OAuth-Agent", "JWT-Agent", "Session-Agent"
  Problems:
  - 3 agent configs to maintain
  - Limited reusability
  - Duplication of base capabilities
  - Breaks down when need different auth type

✅ GOOD: Builder agent + [oauth-skill / jwt-skill / session-skill]
  Benefits:
  - 1 agent config
  - Skills portable across agents
  - Skills versioned independently
  - Easy to add new auth types (just new skill)
```

**Why It Happens:**
- Traditional multi-agent thinking
- Not understanding skills-first paradigm
- Trying to map human roles to agents

**How to Avoid:**
- Always ask: "Can this be a skill instead?"
- Prefer generic agents + domain skills
- Reference AGENT_REGISTRY.md for skill compatibility

### Anti-Pattern 3: Missing Decision Justification

**Description:** Creating multi-agent plan without explaining "why"

**Example:**
```markdown
❌ BAD PLAN:
  Task 1: Architect designs system
  Task 2: Builder implements
  Task 3: Tester validates

  (No justification for why multi-agent vs single agent)

✅ GOOD PLAN:
  ## Architecture Decision

  Why Multi-Agent?
  - 3 independent implementation approaches need comparison
  - Each requires 3 hours of focused work
  - Parallel execution saves 4 hours (66% time reduction)
  - Time-to-market critical (launch in 2 days)
  - Cost justified: $0.90 orchestration vs $300 value of time saved

  Why Not Single Agent + Skills?
  - Would require sequential implementation (9 hours)
  - Miss opportunity for stochastic variation
  - Cannot deliver in 2-day deadline
```

**Why It Happens:**
- Rushing into execution without planning
- Not documenting decision process
- Assuming multi-agent is always better

**How to Avoid:**
- Always fill "Architecture Decision" section
- Use decision matrix checklist
- Calculate and document ROI

### Anti-Pattern 4: Ignoring Cost/Token Budgets

**Description:** Not tracking or respecting budget constraints

**Example:**
```markdown
❌ BAD:
  No budget set
  Orchestrator spawns 10 agents (all Opus 4)
  Runs for 6 hours
  Final cost: $15.50
  Budget shock!

✅ GOOD:
  Budget: $2.00 maximum
  Estimated cost: $1.20 (60% of budget)
  Model selection:
    - 1 Opus for orchestration ($0.40)
    - 4 Sonnet for workers ($0.80)
    - Total: $1.20
  Alert if exceeds 80% ($1.60)
```

**Why It Happens:**
- Not estimating cost upfront
- Using expensive models unnecessarily
- No monitoring or alerts

**How to Avoid:**
- Always set budget before starting
- Use cost estimation formulas (Section 4)
- Alert at 80% consumption
- Optimize model selection (Haiku/Sonnet/Opus)

### Anti-Pattern 5: Poor Isolation Strategies

**Description:** Inadequate workspace isolation causing conflicts

**Example:**
```markdown
❌ BAD:
  All agents work in same directory
  Concurrent edits to same files
  Git conflicts on every commit
  Integration nightmare

  Result: 3 hours wasted on conflict resolution

✅ GOOD:
  Each agent in separate git worktree
  Clear task boundaries (different files/components)
  Minimal overlap
  Conflicts detected early (during planning)

  Result: 10 minutes conflict resolution
```

**Why It Happens:**
- Skipping `/worktree-setup`
- Poor task decomposition (overlapping responsibilities)
- Not validating independence during planning

**How to Avoid:**
- Always use git worktrees for multi-agent
- Validate task independence in planning phase
- Define clear boundaries (API contracts)
- Test merge early (simulate conflicts)

### Red Flags Checklist

Before proceeding with multi-agent orchestration, check for these warning signs:

**Planning Red Flags:**
- [ ] No clear decision justification
- [ ] Tasks have sequential dependencies (not truly parallel)
- [ ] Token/cost budget not estimated
- [ ] Time savings <40% vs sequential
- [ ] Skills not identified per task

**Execution Red Flags:**
- [ ] Agents editing same files frequently
- [ ] More than 50% of messages are blocker reports
- [ ] Budget exceeded without value delivered
- [ ] Integration conflicts taking >2 hours
- [ ] Agents asking orchestrator for decisions constantly

**Outcome Red Flags:**
- [ ] Final cost >3x initial estimate
- [ ] Time savings <20% (not worth orchestration overhead)
- [ ] Quality issues from poor integration
- [ ] Team confused about orchestration process
- [ ] Would have been faster with single agent

**If >3 red flags:** Stop and reconsider approach. Likely better to use single agent + skills.

---

## 9. Metrics and Success Criteria

### Planning Effectiveness Metrics

**Track these metrics for each orchestration:**

1. **Planning Accuracy**
   ```
   Accuracy = (Actual Tasks / Planned Tasks) * 100%

   Target: >90%
   Indicates: Quality of task decomposition

   Example:
   - Planned: 7 tasks
   - Added during execution: 1 task
   - Removed: 0 tasks
   - Actual: 8 tasks
   - Accuracy: 7/8 = 87.5% (slightly below target)
   ```

2. **Dependency Correctness**
   ```
   Correctness = 1 - (Missed Dependencies / Total Dependencies)

   Target: 100%
   Indicates: Accuracy of dependency mapping

   Example:
   - Planned dependencies: 10
   - Missed dependencies: 1 (T5 should have depended on T3)
   - Correctness: 1 - (1/10) = 90% (failed - caused blocker)
   ```

3. **Skill Selection Effectiveness**
   ```
   Effectiveness = (Used Skills / Planned Skills) * 100%

   Target: 80-100%
   Indicates: Accuracy of skill identification

   Example:
   - Planned skills: oauth-skill, validator-skill, documentation-skill
   - Used skills: oauth-skill, validator-skill, security-skill
   - Unplanned: security-skill (should have been identified)
   - Effectiveness: 2/3 = 66.7% (room for improvement)
   ```

### Token Efficiency Targets

**Baseline:** 5K tokens for minimal agent interaction

**Targets by Approach:**

| Approach | Token Multiplier | Target Range | Status |
|----------|-----------------|--------------|---------|
| Single agent, 1 skill | 5-7x | 25-35K | ✅ Efficient |
| Single agent, 3 skills | 5-7x | 30-40K | ✅ Efficient |
| Multi-agent (3 agents) | 10-15x | 50-75K | ⚠️ Justify with parallelization ROI |
| Multi-agent (5+ agents) | 15-20x | 75-100K | 🔴 High - must show clear value |
| Excessive (anti-pattern) | >20x | >100K | ❌ Inefficient |

**35% Reduction Goal:**
```
Traditional Multi-Agent: 15x baseline = 75K tokens
Skills-First (Same Outcome): 10x baseline = 50K tokens
Reduction: (75K - 50K) / 75K = 33.3% ✅ (close to 35% target)
```

**Measurement:**
```
Actual Token Usage / Baseline
  where Baseline = 5K tokens

Track over time:
- Month 1 average: 12x (60K tokens) - need improvement
- Month 2 average: 9x (45K tokens) - getting better
- Month 3 average: 7x (35K tokens) - hit target!
```

### Cost Optimization Goals

**28.4% Cost Reduction Target:**

**Baseline:** All-Opus approach (worst case)
```
5 agents * $1.50 = $7.50 per orchestration
```

**Optimized:** Skills-first with smart model selection
```
1 Opus (orchestrator) * $1.50 = $1.50
3 Sonnet (workers) * $0.30 = $0.90
1 Haiku (monitoring) * $0.05 = $0.05
Total: $2.45

Reduction: ($7.50 - $2.45) / $7.50 = 67.3% ✅
```

**Cost Efficiency Tiers:**

| Efficiency | Cost vs Baseline | Status | Action |
|-----------|-----------------|--------|---------|
| Excellent | <30% | ✅ | Maintain practices |
| Good | 30-50% | ✅ | Minor optimization |
| Acceptable | 50-70% | ⚠️ | Review model selection |
| Poor | 70-100% | 🔴 | Significant improvement needed |
| Wasteful | >100% | ❌ | Reconsider approach |

**Model Selection Metrics:**
```
Track per model type:
- Haiku usage: Target >20% of simple tasks
- Sonnet usage: Target >60% of worker tasks
- Opus usage: Target <20% (orchestration + complex only)

Example Good Distribution:
- Haiku: 25% (monitoring, simple tasks)
- Sonnet: 65% (most implementation work)
- Opus: 10% (orchestration only)
```

### Time Savings from Parallelization

**Formula:**
```
Time Savings % = (Sequential Time - Parallel Time) / Sequential Time * 100%

Where:
- Sequential Time = Sum of all task durations
- Parallel Time = Max duration in each parallel group + sequential overhead
```

**Target:** >40% time savings to justify orchestration overhead

**Example Calculation:**
```markdown
Tasks:
- T1 (sequential): 30 min
- T2, T3, T4 (parallel group): 60 min each
- T5 (sequential): 30 min

Sequential Time:
  30 + 60 + 60 + 60 + 30 = 240 min

Parallel Time:
  30 (T1) + 60 (max of T2/T3/T4) + 30 (T5) + 20 (overhead) = 140 min

Time Savings:
  (240 - 140) / 240 * 100% = 41.7% ✅
```

**Parallelization Efficiency:**
```
Efficiency = (Ideal Speedup / Actual Speedup)

Ideal Speedup = Sequential Time / (Sequential Time / Parallel Tasks)
Actual Speedup = Sequential Time / Parallel Time

Example:
- Sequential: 240 min
- Parallel tasks: 3 (T2, T3, T4)
- Actual parallel: 140 min

Ideal Speedup: 240 / (240/3) = 3x
Actual Speedup: 240 / 140 = 1.71x
Efficiency: 1.71 / 3 = 57% (typical - overhead and dependencies)
```

### Quality Indicators

**Track quality to ensure optimization doesn't degrade outcomes:**

1. **Test Pass Rate**
   ```
   Target: 100% (all tests passing)
   Measure: After integration, before merge

   If <100%: Integration issues, need better task boundaries
   ```

2. **Code Review Issues**
   ```
   Target: <5 issues per 500 lines of code
   Measure: During human code review

   If >10 issues: Quality problems, need better validation
   ```

3. **Integration Conflicts**
   ```
   Target: <10% of files have conflicts
   Measure: During merge of parallel branches

   If >25% conflicts: Poor task decomposition, overlapping work
   ```

4. **Rework Rate**
   ```
   Rework Rate = (Tasks Redone / Total Tasks) * 100%

   Target: <10%
   Indicates: Planning accuracy and task clarity

   Example:
   - Total tasks: 7
   - Tasks requiring rework: 1 (T3 had to be reimplemented)
   - Rework rate: 1/7 = 14.3% (acceptable but room for improvement)
   ```

5. **Bug Density**
   ```
   Bugs per KLOC = (Bugs Found / Lines of Code) * 1000

   Target: <5 bugs per KLOC
   Measure: After deployment, within 30 days

   Compare: Single agent vs multi-agent (should be similar)
   ```

### Dashboard Template

**Create `ORCHESTRATION_METRICS.md` for each project:**

```markdown
# Orchestration Metrics Dashboard

**Project:** Auth Feature Implementation
**Date Range:** 2025-12-01 to 2025-12-13
**Orchestrations:** 3 completed

## Efficiency Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Token Efficiency** | 5-7x baseline | 6.2x avg | ✅ On target |
| **Cost Reduction** | >28.4% | 65% | ✅ Exceeding |
| **Time Savings** | >40% | 52% avg | ✅ Exceeding |
| **Planning Accuracy** | >90% | 93% | ✅ On target |

## Cost Breakdown

| Orchestration | Opus | Sonnet | Haiku | Total | Status |
|--------------|------|--------|-------|-------|--------|
| #1 - Research | $0.40 | $0.90 | $0.05 | $1.35 | ✅ Under budget |
| #2 - Implementation | $0.50 | $1.20 | $0.10 | $1.80 | ✅ Under budget |
| #3 - Refactoring | $0.30 | $0.60 | $0.05 | $0.95 | ✅ Under budget |
| **Total** | $1.20 | $2.70 | $0.20 | **$4.10** | ✅ Budget: $5.00 |

## Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Test Pass Rate | 100% | 100% | ✅ |
| Code Review Issues | <5/500 LOC | 3/500 LOC | ✅ |
| Integration Conflicts | <10% files | 8% files | ✅ |
| Rework Rate | <10% | 7% | ✅ |
| Bug Density | <5/KLOC | 2/KLOC | ✅ |

## Time Savings

| Orchestration | Sequential | Parallel | Savings | Efficiency |
|--------------|-----------|----------|---------|------------|
| #1 - Research | 180 min | 90 min | 50% | 100% |
| #2 - Implementation | 240 min | 140 min | 42% | 56% |
| #3 - Refactoring | 360 min | 180 min | 50% | 100% |
| **Average** | - | - | **47%** | **85%** |

## Lessons Learned

### What's Working
- Parallel research pattern highly effective (50% time savings)
- Sonnet 4 as default worker model balances cost and quality
- Git worktrees prevent most conflicts

### Areas for Improvement
- Implementation tasks have lower efficiency (56%) - dependencies not fully parallelizable
- Need better upfront architecture to reduce integration work
- Consider monitoring agent for orchestrations >5 tasks

### Actions
- [ ] Update MULTIAGENT_PLAN template with implementation efficiency insights
- [ ] Add monitoring agent to next large orchestration
- [ ] Document architecture-first pattern for complex features
```

### Continuous Improvement Loop

```
Orchestration Complete
        ↓
Collect Metrics
        ↓
Analyze vs Targets
        ↓
Identify Patterns
        ↓
Extract Lessons
        ↓
Update Templates ← ┐
        ↓          |
Apply to Next      |
Orchestration ─────┘
```

**Quarterly Review:**
- Aggregate metrics from all orchestrations
- Identify trending issues
- Update templates and documentation
- Share best practices with team
- Set new targets for next quarter

---

## 10. Quick Reference

### Planning Template Checklist

**Before Creating Plan:**
- [ ] Analyzed task for parallelization potential
- [ ] Calculated ROI (time savings vs cost increase)
- [ ] Considered single agent + skills alternative
- [ ] Identified required skills per task
- [ ] Estimated token usage and cost

**Plan Must Include:**
- [ ] Architecture decision justification
- [ ] Task assignment matrix with skills
- [ ] Parallel group strategy
- [ ] Dependency graph
- [ ] Isolation method (worktree/container)
- [ ] Model selection per agent
- [ ] Communication protocol
- [ ] Success criteria
- [ ] Budget (token and cost)

**During Execution:**
- [ ] Agents update status atomically
- [ ] Blockers reported in Notes section
- [ ] Handoffs documented in messages
- [ ] Orchestrator monitors every 5-10 min
- [ ] Budget consumption tracked

**After Completion:**
- [ ] Metrics calculated and recorded
- [ ] Lessons learned documented
- [ ] Templates updated if patterns found
- [ ] Plan archived for future reference

### Decision Tree Diagram

```
┌─────────────────────────────────────┐
│   NEW TASK REQUESTED                │
└─────────────┬───────────────────────┘
              │
              ▼
   ┌──────────────────────────┐
   │ Context continuity       │───YES──→ SINGLE AGENT + SKILLS
   │ critical?                │
   └──────────┬───────────────┘
              │ NO
              ▼
   ┌──────────────────────────┐
   │ Tasks truly              │───NO───→ SINGLE AGENT + SKILLS
   │ independent?             │
   └──────────┬───────────────┘
              │ YES
              ▼
   ┌──────────────────────────┐
   │ Time savings             │───NO───→ SINGLE AGENT + SKILLS
   │ >40%?                    │
   └──────────┬───────────────┘
              │ YES
              ▼
   ┌──────────────────────────┐
   │ Time-to-market           │───NO───→ SINGLE AGENT + SKILLS
   │ critical?                │         (Cost-optimize)
   └──────────┬───────────────┘
              │ YES
              ▼
   ┌──────────────────────────┐
   │ Each task needs          │───YES──→ HYBRID
   │ deep context?            │         (Orchestrator + Skilled Workers)
   └──────────┬───────────────┘
              │ NO
              ▼
        MULTI-AGENT
   (Pure Parallelization)
```

### Command Reference for Orchestration

```bash
# 1. Create orchestration plan
/orchestrate-feature "<feature description>"
  Output: MULTI_AGENT_PLAN.md, ORCHESTRATION_LOG.md

# 2. Set up git worktrees
/worktree-setup
  Output: Worktree directories for each agent

# 3. Spawn agents for tasks
/spawn-agents
  Output: Agent instances running in worktrees

# 4. Monitor progress
/coordinate-workflow
  Output: Real-time status updates, blocker resolution

# 5. Validate quality
/quality-gate
  Output: QUALITY_GATE_REPORT.md, go/no-go decision

# 6. Cleanup (after merge)
/worktree-setup --cleanup
  Output: Worktrees removed, branches deleted if merged
```

### Common Skill Compositions

**Builder Workflows:**
```
Feature Implementation:
  builder-skill + [domain-skill] + validator-skill

Bug Fix:
  root-cause-tracing-skill + builder-skill + validator-skill

Refactoring:
  builder-skill + refactoring-skill + validator-skill
```

**Validator Workflows:**
```
Testing:
  validator-skill + [test-type-skill]

Code Review:
  validator-skill + code-review-skill

Security Audit:
  validator-skill + security-skill
```

**Orchestrator Workflows:**
```
Planning:
  multi-agent-planner-skill + worktree-manager-skill

Coordination:
  agent-communication-skill + bottleneck-detection-skill

Integration:
  result-synthesis-skill + conflict-resolution-skill

Full Orchestration:
  skill-orchestrator (coordinates all above)
```

**Hybrid Workflows:**
```
Complex Feature:
  Orchestrator: architecture-skill + multi-agent-planner-skill
  Workers: builder-skill + [domain-skills] + validator-skill
  Integration: result-synthesis-skill + documentation-skill
```

### Cost Estimation Quick Formula

```
Orchestrator: 40K tokens * $15/MTok = $0.60 (Opus)
Worker (each): 10K tokens * $3/MTok = $0.03 (Sonnet)
Monitor: 5K tokens * $0.25/MTok = $0.001 (Haiku)

Total = Orchestrator + (Workers * Count) + Monitor

Example (5 workers):
  $0.60 + ($0.03 * 5) + $0.001 = $0.751 ≈ $0.75
```

### Success Patterns Summary

✅ **DO:**
- Default to single agent + skills
- Justify multi-agent with ROI calculation
- Use git worktrees for isolation
- Track budget and token usage
- Document lessons learned
- Update templates based on experience

❌ **DON'T:**
- Orchestrate for small/simple tasks
- Create specialized agents (use skills instead)
- Skip architecture decision justification
- Ignore token/cost budgets
- Work in shared directory (causes conflicts)
- Forget to collect metrics

### Template Locations

```
Templates:
  └─ templates/orchestration/
      ├─ AGENT_REGISTRY.md         # Agent capability tracking
      └─ MULTIAGENT_PLAN.md        # Multi-agent planning

Documentation:
  └─ docs/best-practices/
      ├─ 08-Claude-Skills-Guide.md             # Skill creation
      ├─ 09-Multi-Agent-Architecture...md      # Architecture patterns
      └─ 12-Skills-First-Planning...md         # This document

Commands:
  └─ .claude/commands/
      ├─ orchestrate-feature.md
      ├─ spawn-agents.md
      ├─ coordinate-workflow.md
      ├─ quality-gate.md
      └─ worktree-setup.md
```

---

## Appendix: Additional Resources

### Related Documentation
- [08-Claude-Skills-Guide.md](./08-Claude-Skills-Guide.md) - Creating and using skills
- [09-Multi-Agent-Architecture-and-Skills-Integration.md](./09-Multi-Agent-Architecture-and-Skills-Integration.md) - Architecture patterns
- [04-Multi-Agent-Orchestration.md](./04-Multi-Agent-Orchestration.md) - Orchestration fundamentals

### Research References
- Anthropic Research: "Building effective agents" (2024)
- Anthropic Blog: "Skills-first AI agent development" (2025)

### Community Resources
- [GitHub Discussions](https://github.com/enuno/claude-command-and-control/discussions)
- [DeepWiki Documentation](https://deepwiki.com/enuno/claude-command-and-control)

---

**Version History:**
- v1.0.0 (2025-12-13): Initial release

**Maintainer:** [@enuno](https://github.com/enuno)
**License:** MIT
**Repository:** [claude-command-and-control](https://github.com/enuno/claude-command-and-control)
