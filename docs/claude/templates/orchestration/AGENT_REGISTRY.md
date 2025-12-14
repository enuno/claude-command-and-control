# Agent Registry

**Version:** 1.0.0
**Last Updated:** 2025-12-13
**Purpose:** Track available agents, their capabilities, and operational parameters for orchestration workflows

---

## Overview

This registry catalogs all agents available for orchestration, with emphasis on the **skills-first paradigm**. Agents dynamically load skills based on task requirements rather than having fixed, specialized roles.

**Key Principles:**
- Default to single agent + skills (35% token reduction)
- Use multi-agent only for parallelization
- Hybrid approach: Orchestrator + workers with skills

---

## Registry Entries

### 1. Orchestrator Lead Agent

#### Metadata
| Property | Value |
|----------|-------|
| **Agent ID** | `orchestrator-lead-001` |
| **Name** | Orchestrator Lead |
| **Role** | Lead coordinator for multi-agent workflows |
| **Model** | Claude Opus 4 |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Orchestration Role** | Orchestrator |
| **Created** | 2025-12-01 |
| **Last Updated** | 2025-12-13 |

#### Capability Declaration (Skills-First)

**Available Skills:**
- `multi-agent-planner-skill` v1.0 - Task decomposition and dependency mapping
- `parallel-executor-skill` v1.0 - Concurrent task execution
- `worktree-manager-skill` v1.0 - Git worktree lifecycle management
- `agent-communication-skill` v1.0 - Inter-agent messaging
- `result-synthesis-skill` v1.0 - Aggregate outputs from multiple agents
- `skill-orchestrator` v1.0 - Coordinate multiple skills in complex workflows

**Skill Discovery Strategy:** Progressive loading based on orchestration phase
- Planning phase: Load `multi-agent-planner-skill`
- Execution phase: Load `parallel-executor-skill`, `worktree-manager-skill`
- Integration phase: Load `result-synthesis-skill`
- Throughout: `agent-communication-skill` for coordination

**Skill Loading Pattern:**
```
1. Analyze user request
2. Load multi-agent-planner-skill
3. Decompose into parallelizable tasks
4. Load parallel-executor-skill + worktree-manager-skill
5. Spawn worker agents (each loads domain-specific skills)
6. Load agent-communication-skill for monitoring
7. Load result-synthesis-skill for integration
```

**Derived Capabilities:**
- Request decomposition (break complex features into parallel subtasks)
- Agent spawning and coordination (select and instantiate specialized workers)
- Result synthesis (aggregate and validate outputs)
- Quality assurance (validate integrated work products)
- Error recovery (detect failures, implement retry logic)
- Human escalation (identify situations requiring intervention)

#### Tool Permissions and Security

**Allowed Tools:**
- `Read`, `Edit`, `Write` - Document manipulation
- `Task` - Spawn and manage subagent instances
- `Bash` (restricted):
  - Git operations: `status`, `log`, `branch`, `diff`, `worktree`
  - Exploration: `find`, `grep`, `ls`
  - Process monitoring: `ps`

**Restricted Paths:**
- No access to `/secrets`, `/credentials`
- No modifications to production config without approval

**Approval Gates:**
- Require human approval for:
  - Main branch modifications
  - Destructive git operations (force push, hard reset)
  - Production deployments
  - Security-sensitive changes

**Isolation Level:** Shared context (orchestrator maintains full context, distributes slices to workers)

**Operational Scope:**
- Coordinate 2-10 concurrent subagents
- Manage dependency graphs with up to 50 task nodes
- Handle sequential and parallel execution patterns

#### Collaboration Metadata

**Partner Agents:**
- `task-coordinator-001` - Dependency optimization specialist
- `integration-orchestrator-001` - Result merging coordinator
- `monitoring-agent-001` - Real-time execution tracking
- Any worker agents (builders, validators, scribes, etc.)

**Handoff Protocols:**
- **To Task Coordinator:** Send `MULTI_AGENT_PLAN.md` → Receive `EXECUTION_SCHEDULE.md`
- **To Workers:** Send task context slice → Receive completed deliverables
- **From Monitoring:** Receive status updates, alerts, performance metrics
- **To Integration Orchestrator:** Send parallel workflow results → Receive `INTEGRATION_REPORT.md`

**Message Format:**
```markdown
FROM: orchestrator-lead-001
TO: [target-agent-id]
TYPE: [Handoff|Directive|Query|Update]
TIMESTAMP: [ISO 8601]
CONTEXT: @file-references
MESSAGE: [Content]
```

**Dependency Relationships:**
- Depends on: None (top-level orchestrator)
- Depended on by: All worker agents and coordination agents

**Communication Patterns:**
- Asynchronous messaging via `INTER_AGENT_MESSAGES.md`
- Status tracking via atomic updates to `MULTI_AGENT_PLAN.md`
- Blocker escalation via Notes section in plan
- Completion notifications via handoff messages

#### Performance and Cost Tracking

**Token Budget by Agent Type:**
- Orchestrator (full context): 30K-50K tokens
- Worker agents (task-specific slices): 5K-15K tokens each
- Monitoring agent (lightweight state): 2K-5K tokens

**Target KPIs:**
- Planning accuracy: >90% of tasks completed as planned
- Parallelization efficiency: >60% time reduction vs sequential
- Cost efficiency: <30% overhead vs single-agent baseline
- Error recovery rate: >95% of failures recovered without human intervention

**Cost Per Invocation Estimates:**
- Opus 4 (orchestrator): $0.15-0.30 per orchestration session
- Sonnet 4 (workers): $0.03-0.08 per task
- Total orchestration: $0.30-0.80 for typical 4-task workflow

**Monitoring Points:**
- Task completion rate (tasks/minute)
- Agent spawn latency (<5 seconds per agent)
- Context refresh frequency (every 10 minutes)
- Bottleneck detection (identify stuck tasks within 2 minutes)

#### Output Artifacts

Generated documents:
- `MULTI_AGENT_PLAN.md` - Central planning document with task matrix
- `ORCHESTRATION_LOG.md` - Execution timeline and agent spawn tracking
- `RESULT_SYNTHESIS.md` - Aggregated deliverables and conflict reports
- `ORCHESTRATION_SUMMARY.md` - Final metrics, changes, next steps

---

### 2. Task Coordinator Agent

#### Metadata
| Property | Value |
|----------|-------|
| **Agent ID** | `task-coordinator-001` |
| **Name** | Task Coordinator |
| **Role** | Dependency optimization and bottleneck detection specialist |
| **Model** | Claude Sonnet 4 |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Orchestration Role** | Worker (coordination specialist) |
| **Created** | 2025-12-01 |
| **Last Updated** | 2025-12-13 |

#### Capability Declaration (Skills-First)

**Available Skills:**
- `dependency-graph-skill` v1.0 - Analyze and optimize task dependencies
- `parallel-optimization-skill` v1.0 - Maximize parallelization opportunities
- `bottleneck-detection-skill` v1.0 - Identify and resolve task blocking
- `resource-balancing-skill` v1.0 - Allocate computational resources

**Skill Discovery Strategy:** Load based on orchestration phase
- Initial analysis: Load `dependency-graph-skill`
- Optimization: Load `parallel-optimization-skill`
- Runtime monitoring: Load `bottleneck-detection-skill`
- Resource management: Load `resource-balancing-skill`

**Derived Capabilities:**
- Dependency graph analysis and validation
- Parallel execution optimization (identify max parallelization)
- Bottleneck detection and mitigation
- Resource balancing across concurrent workflows
- Schedule optimization (minimize total execution time)
- Dynamic rebalancing based on actual task durations

#### Tool Permissions and Security

**Allowed Tools:**
- `Read`, `Edit` - Plan document manipulation
- `Bash` (restricted):
  - Git: `status`
  - Process monitoring: `ps`
- `Task` (query only) - Check agent status/dependencies

**Restricted Operations:**
- NO agent spawning (Orchestrator Lead's responsibility)
- NO code implementation or testing
- NO destructive operations on plans
- MUST preserve semantic dependencies
- REQUIRE Orchestrator approval for major plan restructuring

**Isolation Level:** Task-specific context (receives MULTI_AGENT_PLAN.md and optimization parameters)

**Operational Scope:**
- Analyze dependency graphs with 10-100 task nodes
- Optimize for 2-10 concurrent agent execution slots
- Achieve 30-60% execution time reduction through parallelization
- Detect and resolve circular dependencies

#### Collaboration Metadata

**Partner Agents:**
- `orchestrator-lead-001` - Sends plans, receives optimized schedules
- `monitoring-agent-001` - Receives real-time performance data
- `integration-orchestrator-001` - Coordinates timing of parallel workflow completion

**Handoff Protocol:**
- **From Orchestrator:** Receive `MULTI_AGENT_PLAN.md` + resource constraints
- **To Orchestrator:** Send `EXECUTION_SCHEDULE.md` with optimization results
- **From Monitoring:** Receive performance metrics for dynamic rebalancing
- **To Monitoring:** Send tracking requests with alert conditions

**Dependency Relationships:**
- Depends on: Orchestrator Lead (for plan input)
- Depended on by: Orchestrator Lead (for optimized execution schedule)

#### Performance and Cost Tracking

**Token Budget:** 8K-15K tokens per optimization session

**Target KPIs:**
- Parallelization improvement: 30-60% time reduction
- Bottleneck detection speed: <2 minutes to identify stuck tasks
- Resource utilization: >80% of available agent slots used
- Optimization accuracy: <10% deviation from actual execution time

**Cost Per Invocation:** $0.02-0.05 per optimization session (Sonnet 4)

**Output Artifacts:**
- `EXECUTION_SCHEDULE.md` - Phased plan with parallel groups and resource allocation
- `BOTTLENECK_ANALYSIS.md` - Identified bottlenecks with severity and mitigation strategies
- `RESOURCE_ALLOCATION_PLAN.md` - Agent slot assignments over time

---

## Template for New Agent Entries

### [Agent Number]. [Agent Name]

#### Metadata
| Property | Value |
|----------|-------|
| **Agent ID** | `[unique-identifier]` |
| **Name** | [Display Name] |
| **Role** | [Specific responsibility] |
| **Model** | Claude [Opus 4 / Sonnet 4 / Haiku 3.5] |
| **Version** | [Semantic version] |
| **Status** | [Active / Inactive / Deprecated] |
| **Orchestration Role** | [Orchestrator / Worker / Single-Agent] |
| **Created** | [YYYY-MM-DD] |
| **Last Updated** | [YYYY-MM-DD] |

#### Capability Declaration (Skills-First)

**Available Skills:**
- `skill-name` vX.X - Description
- `skill-name` vX.X - Description

**Skill Discovery Strategy:** [How agent determines which skills to load]

**Skill Loading Pattern:**
```
1. [Step-by-step pattern]
2. [When to load which skills]
```

**Derived Capabilities:**
- [Capability 1 - from which skill]
- [Capability 2 - from which skill]

#### Tool Permissions and Security

**Allowed Tools:**
- [List of allowed tools with restrictions]

**Restricted Paths/Operations:**
- [Paths agent cannot access]
- [Operations requiring approval]

**Approval Gates:**
- [What requires human approval]

**Isolation Level:** [Worktree / Container / Shared Context]

**Operational Scope:**
- [Quantified boundaries, e.g., "Process 10-100 files"]

#### Collaboration Metadata

**Partner Agents:**
- `agent-id` - [Relationship description]

**Handoff Protocols:**
- **From [Agent]:** [What is received]
- **To [Agent]:** [What is sent]

**Dependency Relationships:**
- Depends on: [List of agents]
- Depended on by: [List of agents]

**Communication Patterns:**
- [Synchronous/asynchronous patterns]

#### Performance and Cost Tracking

**Token Budget:** [Range in tokens]

**Target KPIs:**
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

**Cost Per Invocation:** [Estimated cost]

**Monitoring Points:**
- [What to track]

**Output Artifacts:**
- `FILENAME.md` - Description

---

## Model Selection Economics

**Decision Matrix:**

| Agent Role | Simple Task | Moderate Task | Complex Task |
|-----------|-------------|---------------|--------------|
| **Orchestrator** | Sonnet 4 | Opus 4 | Opus 4 |
| **Architect** | Sonnet 4 | Opus 4 | Opus 4 |
| **Builder** | Haiku 3.5 | Sonnet 4 | Opus 4 |
| **Validator** | Sonnet 4 | Sonnet 4 | Opus 4 |
| **Scribe** | Haiku 3.5 | Sonnet 4 | Sonnet 4 |
| **DevOps** | Sonnet 4 | Sonnet 4 | Opus 4 |
| **Monitoring** | Haiku 3.5 | Haiku 3.5 | Sonnet 4 |

**Cost Optimization Strategy:**
- Use **Sonnet 4** as default (best cost/quality balance)
- Upgrade to **Opus 4** for critical planning, complex reasoning
- Downgrade to **Haiku 3.5** for simple, repetitive, or monitoring tasks
- **Result:** 28-73% cost reduction vs all-Opus approach

**Performance Benchmarks:**
- Opus 4: High reasoning capability, $15/$75 per MTok (input/output)
- Sonnet 4: Balanced capability, $3/$15 per MTok
- Haiku 3.5: Fast and efficient, $0.25/$1.25 per MTok

---

## Skills-First Decision Framework

**Use Single Agent + Skills When:**
- ✅ Tasks are sequential and context-dependent
- ✅ Workflow is depth-first (deep investigation)
- ✅ Context continuity is important
- ✅ Standard development tasks (features, bugs, docs)

**Use Multi-Agent Orchestration When:**
- ✅ Tasks are parallel and independent
- ✅ Breadth-first exploration needed
- ✅ Comparing multiple implementation approaches
- ✅ Scale requires concurrency

**Use Hybrid (Orchestrator + Workers with Skills) When:**
- ✅ Complex feature requiring parallelization
- ✅ Multiple approaches need comparison
- ✅ Large refactoring across codebase
- ✅ Full-stack feature development

**Token Efficiency Comparison:**
| Approach | Token Usage | Cost | Best For |
|----------|-------------|------|----------|
| Single agent, 1 skill | 5-7x baseline | Low | Simple tasks |
| Single agent, 3 skills | 5-7x baseline | Low | Sequential workflows |
| Multi-agent (3 agents) | 15x baseline | High | Parallel research |
| Hybrid (1 orch + 3 workers) | 10-12x baseline | Medium | Complex features |

**35% token reduction** with skills-first vs traditional multi-agent approach

---

## Registry Maintenance

**Update Frequency:** Review quarterly or after major orchestration pattern changes

**Version Control:** All changes to this registry should be tracked with semantic versioning
- MAJOR: Breaking changes to agent capabilities or interfaces
- MINOR: New agent additions or capability enhancements
- PATCH: Documentation updates, clarifications

**Change Log:**
- v1.0.0 (2025-12-13): Initial registry with Orchestrator Lead and Task Coordinator examples

**Contribution Guidelines:** Submit new agent entries via pull request with:
- Complete metadata section
- Skills-first capability declaration
- Practical examples from actual usage
- Performance and cost estimates
