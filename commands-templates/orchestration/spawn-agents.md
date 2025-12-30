---
description: "Dynamic agent instantiation based on task requirements with role assignment, context isolation, permission scoping, and resource allocation"
allowed-tools: ["Read", "Edit", "Task", "Bash(ps)", "Bash(git:status)"]
author: "Engineering Standards Committee"
version: "1.0.0"
---

# Spawn Agents

## Purpose
Dynamically instantiate specialized AI agents based on task requirements, automatically assigning appropriate roles, scoping permissions, isolating context, and optimizing resource allocation.

## When to Use
- Need to delegate specific tasks to specialized agents
- Starting multi-agent workflow from MULTI_AGENT_PLAN.md
- Scaling up parallel development workstreams
- Responding to bottlenecks by adding specialized agents

## Prerequisites
- MULTI_AGENT_PLAN.md exists with defined tasks (or task requirements provided inline)
- AGENTS.md configuration loaded
- Agent role templates available (Architect, Builder, Validator, Scribe, DevOps, Researcher)
- Sufficient system resources for multiple concurrent agents

## Project-Specific Customization

**To use this template in your project:**

1. Copy to `.claude/commands/spawn-agents.md`
2. Customize agent role definitions to match your team structure
3. Adjust model selection strategy based on budget constraints
4. Modify resource allocation limits based on system capacity
5. Configure context isolation strategy (worktrees, containers, or hybrid)

## Workflow

### Phase 1: Task Analysis and Role Assignment

**Step 1.1: Load Task Requirements**
```markdown
Option A: Read from MULTI_AGENT_PLAN.md
- Load existing plan
- Identify tasks with Status="Not Started" or "Pending"
- Filter tasks where dependencies are satisfied

Option B: Accept inline task definition
- Prompt user for task description
- Classify task type automatically
- Generate temporary task specification
```

**Step 1.2: Automatic Role Classification**
```markdown
Analyze task description to determine appropriate agent role:

Task Classification Rules:
1. **Architect** if task involves:
   - "design", "architecture", "planning", "system design"
   - "API specification", "data model", "schema design"
   - "requirements analysis", "feasibility study"

2. **Builder** if task involves:
   - "implement", "develop", "code", "build", "create"
   - "feature", "functionality", "component", "module"
   - "refactor", "optimize", "migrate"

3. **Validator** if task involves:
   - "test", "review", "audit", "validate", "verify"
   - "security", "penetration test", "vulnerability scan"
   - "coverage", "quality assurance", "QA"

4. **Scribe** if task involves:
   - "document", "write docs", "API reference", "guide"
   - "README", "tutorial", "how-to", "documentation"
   - "comments", "docstrings", "annotations"

5. **DevOps** if task involves:
   - "deploy", "CI/CD", "infrastructure", "pipeline"
   - "Docker", "Kubernetes", "container", "cloud"
   - "monitoring", "logging", "observability"

6. **Researcher** if task involves:
   - "research", "evaluate", "compare", "analyze"
   - "proof of concept", "spike", "investigation"
   - "vendor selection", "technology assessment"

Multi-role tasks:
- Assign primary role based on dominant keywords
- Note secondary capabilities needed in task context
```

**Step 1.3: Model Selection Strategy**
```markdown
Assign model based on task complexity and role:

Model Selection Matrix:
┌────────────┬──────────────┬──────────────┬──────────────┐
│    Role    │   Simple     │   Moderate   │   Complex    │
├────────────┼──────────────┼──────────────┼──────────────┤
│ Architect  │ Sonnet 4     │ Opus 4       │ Opus 4       │
│ Builder    │ Haiku 3.5    │ Sonnet 4     │ Opus 4       │
│ Validator  │ Sonnet 4     │ Sonnet 4     │ Opus 4       │
│ Scribe     │ Haiku 3.5    │ Sonnet 4     │ Sonnet 4     │
│ DevOps     │ Sonnet 4     │ Sonnet 4     │ Opus 4       │
│ Researcher │ Sonnet 4     │ Opus 4       │ Opus 4       │
└────────────┴──────────────┴──────────────┴──────────────┘

Complexity Assessment:
- **Simple**: Single file, clear requirements, <100 lines of code
- **Moderate**: Multiple files, some ambiguity, 100-500 lines
- **Complex**: Architecture decisions, high ambiguity, 500+ lines

Cost Optimization:
- Default to Sonnet 4 for most tasks (balance of quality and cost)
- Upgrade to Opus 4 only for critical planning or complex reasoning
- Downgrade to Haiku 3.5 for formatting, simple docs, repetitive tasks
```

### Phase 2: Context Isolation Setup

**Step 2.1: Choose Isolation Strategy**
```markdown
Decision Matrix:

┌─────────────────────────┬────────────────┬─────────────┐
│      Criterion          │  Git Worktree  │  Container  │
├─────────────────────────┼────────────────┼─────────────┤
│ Setup Time              │ < 1 second     │ 1-3 minutes │
│ Disk Overhead           │ Minimal        │ High        │
│ Process Isolation       │ No             │ Yes         │
│ Security Boundary       │ Filesystem     │ Full        │
│ Resource Control        │ No             │ Yes         │
│ Recommended For         │ Trusted agents │ Untrusted   │
└─────────────────────────┴────────────────┴─────────────┘

Selection Algorithm:
IF task requires untrusted code execution OR compliance requirements:
  → Use container isolation
ELSE IF task requires dependency isolation:
  → Use container isolation
ELSE:
  → Use git worktree isolation (default for speed)
```

**Step 2.2: Git Worktree Setup (Default)**
```bash
# Generate unique worktree identifier
AGENT_ID="agent-$(date +%s)-$(shuf -i 1000-9999 -n 1)"
TASK_ID="{{TASK_ID_FROM_PLAN}}"
ROLE="{{AGENT_ROLE}}"
BRANCH_NAME="task/${TASK_ID}-${ROLE,,}"
WORKTREE_PATH="../worktrees/${BRANCH_NAME}"

# Create isolated worktree
git worktree add "${WORKTREE_PATH}" -b "${BRANCH_NAME}"

# Copy agent configuration
cp AGENTS.md "${WORKTREE_PATH}/" 2>/dev/null || true
cp CLAUDE.md "${WORKTREE_PATH}/" 2>/dev/null || true
cp .env.example "${WORKTREE_PATH}/.env" 2>/dev/null || true

# Copy shared planning document
cp MULTI_AGENT_PLAN.md "${WORKTREE_PATH}/" 2>/dev/null || true

echo "✓ Worktree created: ${WORKTREE_PATH}"
echo "✓ Branch: ${BRANCH_NAME}"
echo "✓ Agent ID: ${AGENT_ID}"
```

**Step 2.3: Container Setup (Security Mode)**
```bash
# Generate DevContainer configuration for agent
mkdir -p ".devcontainer-${AGENT_ID}"

cat > ".devcontainer-${AGENT_ID}/devcontainer.json" << EOF
{
  "name": "Agent ${AGENT_ID} - ${ROLE}",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  },
  "runArgs": [
    "--read-only",
    "--tmpfs=/tmp:rw,noexec,nosuid,size=500m",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "--network=none",
    "--memory=4g",
    "--cpus=2.0"
  ],
  "mounts": [
    "source=\${localWorkspaceFolder},target=/workspace,type=bind,readonly",
    "source=\${localWorkspaceFolder}/.agent-output-${AGENT_ID},target=/output,type=bind"
  ],
  "containerEnv": {
    "AGENT_ID": "${AGENT_ID}",
    "AGENT_ROLE": "${ROLE}",
    "TASK_ID": "${TASK_ID}"
  },
  "postCreateCommand": "pip install -r requirements.txt"
}
EOF

# Launch container
devcontainer up --workspace-folder ".devcontainer-${AGENT_ID}"

echo "✓ Container launched: agent-${AGENT_ID}"
echo "✓ Role: ${ROLE}"
echo "✓ Resource limits: 4GB RAM, 2 CPUs"
```

### Phase 3: Permission Scoping

**Step 3.1: Load Role-Specific Permissions**
```markdown
Read agent configuration template for role:

For Architect:
- allowed-tools: ["Read", "Search", "Edit(planning docs only)", "Bash(git:log)", "Bash(git:diff)", "Bash(find)", "Bash(grep)"]
- prohibited: Direct code modification, deployment, external network

For Builder:
- allowed-tools: ["Read", "Edit", "Write", "Bash(git:*)", "Bash(npm:*)", "Bash(pip:*)", "Bash(cargo:*)"]
- prohibited: Merge to main, force push, deployment commands

For Validator:
- allowed-tools: ["Read", "Bash(npm:test)", "Bash(pytest)", "Bash(cargo:test)", "Edit(test files only)"]
- prohibited: Modifying source code, deployment

For Scribe:
- allowed-tools: ["Read", "Edit(*.md)", "Write(*.md)", "Bash(find)"]
- prohibited: Code modification, git operations beyond reading

For DevOps:
- allowed-tools: ["Read", "Edit(infra files)", "Bash(docker:*)", "Bash(kubectl:*)", "Bash(terraform:*)"]
- prohibited: Production deployment without approval

For Researcher:
- allowed-tools: ["Read", "WebSearch", "WebFetch", "Edit(research docs)"]
- prohibited: Code modification, deployment
```

**Step 3.2: Generate Agent-Specific Configuration**
```markdown
Create temporary agent configuration file:

---
# Agent Configuration: ${AGENT_ID}

## Agent Metadata
- **Agent ID**: ${AGENT_ID}
- **Role**: ${ROLE}
- **Task ID**: ${TASK_ID}
- **Model**: ${SELECTED_MODEL}
- **Created**: ${ISO_TIMESTAMP}
- **Isolation**: ${WORKTREE_PATH} or ${CONTAINER_ID}

## Task Assignment
**Objective**: ${TASK_DESCRIPTION}

**Success Criteria**:
- ${CRITERION_1}
- ${CRITERION_2}
- ${CRITERION_3}

**Dependencies**:
- ${DEP_1}: ${STATUS}
- ${DEP_2}: ${STATUS}

## Allowed Tools
${ROLE_SPECIFIC_ALLOWED_TOOLS}

## Context Access
- **Shared Documents**: MULTI_AGENT_PLAN.md (read-write), AGENTS.md (read-only)
- **Project Files**: Full read access within worktree/container
- **External Resources**: ${ALLOWED_EXTERNAL_RESOURCES}

## Coordination Protocol
1. Update MULTI_AGENT_PLAN.md status to "In Progress" on start
2. Commit work with format: "[${ROLE}] ${TASK_ID}: ${MESSAGE}"
3. Update status to "Completed" or "Blocked" on finish
4. Document blockers in MULTI_AGENT_PLAN.md Notes section

## Resource Limits
- **Context Window**: 200K tokens
- **Execution Time**: ${ESTIMATED_TIME} (soft limit)
- **Memory**: ${MEMORY_LIMIT} (if containerized)
- **CPU**: ${CPU_LIMIT} (if containerized)

---
```

### Phase 4: Agent Instantiation

**Step 4.1: Spawn Agent with Task Tool**
```markdown
Use Task tool to instantiate agent:

Parameters:
- subagent_type: "general-purpose"
- model: ${SELECTED_MODEL}  # From Step 1.3
- description: "${ROLE} agent for ${TASK_ID}"
- prompt: |
    You are an AI agent with the ${ROLE} role, assigned to Task ${TASK_ID}.

    ## Your Identity
    - Agent ID: ${AGENT_ID}
    - Role: ${ROLE}
    - Specialization: ${ROLE_DESCRIPTION_FROM_TEMPLATE}

    ## Your Environment
    - Working Directory: ${WORKTREE_PATH or /workspace}
    - Branch: ${BRANCH_NAME}
    - Isolation: ${ISOLATION_TYPE}

    ## Your Mission
    ${TASK_DESCRIPTION}

    ## Success Criteria
    You must achieve the following:
    ${ACCEPTANCE_CRITERIA_LIST}

    ## Context You Should Load
    1. Read @MULTI_AGENT_PLAN.md to understand your place in the overall workflow
    2. Read @AGENTS.md for project standards and conventions
    3. Read @${ROLE}.md for role-specific best practices (if exists)
    4. Review dependencies: ${DEPENDENCY_LIST}

    ## Tools You Have Access To
    ${ALLOWED_TOOLS_YAML}

    ## Workflow Expectations
    1. **Start**: Update MULTI_AGENT_PLAN.md → Status: "In Progress"
    2. **Work**: Follow ${ROLE} best practices, commit incremental progress
    3. **Communicate**: If blocked, update MULTI_AGENT_PLAN.md → Status: "Blocked", add details to Notes
    4. **Complete**: Update MULTI_AGENT_PLAN.md → Status: "Completed", commit final work

    ## Constraints
    - You MUST work only within your worktree/container
    - You MUST NOT modify files outside your scope
    - You MUST NOT merge branches (orchestrator handles merges)
    - You MUST follow the allowed-tools restrictions

    ## Deliverables Expected
    ${EXPECTED_OUTPUTS_LIST}

    ## Quality Standards
    - Code must pass linting (if applicable)
    - Tests must be included (if applicable)
    - Documentation must be clear and complete
    - Follow project conventions from AGENTS.md

    ## Emergency Protocol
    If you encounter unresolvable issues:
    1. Document the issue clearly in MULTI_AGENT_PLAN.md Notes
    2. Update status to "Blocked"
    3. List specific information/decisions needed to proceed

    You may now begin your task. Start by reading MULTI_AGENT_PLAN.md to understand the full context.
```

**Step 4.2: Register Agent in Tracking System**
```markdown
Update AGENT_REGISTRY.md (create if doesn't exist):

---
# Active Agent Registry

| Agent ID | Role | Task ID | Model | Status | Spawned | Worktree/Container | PID |
|----------|------|---------|-------|--------|---------|-------------------|-----|
| agent-1732901234-5678 | Builder | T2 | sonnet-4 | Running | 2025-11-29T14:23:45Z | ../worktrees/task/t2-builder | 12345 |
| agent-1732901240-9012 | Validator | T4 | sonnet-4 | Running | 2025-11-29T14:24:00Z | ../worktrees/task/t4-validator | 12350 |
| ${AGENT_ID} | ${ROLE} | ${TASK_ID} | ${MODEL} | Spawned | ${TIMESTAMP} | ${PATH} | ${PID} |

---
```

**Step 4.3: Setup Monitoring**
```bash
# Create monitoring script for this agent
cat > ".agent-monitor-${AGENT_ID}.sh" << 'EOF'
#!/bin/bash
AGENT_ID="${AGENT_ID}"
WORKTREE="${WORKTREE_PATH}"
CHECK_INTERVAL=60  # seconds

while true; do
  if [ -d "${WORKTREE}" ]; then
    # Check last commit time
    LAST_COMMIT=$(cd "${WORKTREE}" && git log -1 --format=%ct 2>/dev/null)
    NOW=$(date +%s)
    IDLE=$((NOW - LAST_COMMIT))

    # Check if agent is idle > 30 minutes
    if [ ${IDLE} -gt 1800 ]; then
      echo "WARNING: Agent ${AGENT_ID} idle for $((IDLE/60)) minutes"
    fi

    # Check task status
    STATUS=$(grep "${AGENT_ID}" MULTI_AGENT_PLAN.md | grep "Status" | awk '{print $NF}')
    echo "[$(date)] Agent ${AGENT_ID}: Status=${STATUS}, Idle=${IDLE}s"
  fi

  sleep ${CHECK_INTERVAL}
done
EOF

chmod +x ".agent-monitor-${AGENT_ID}.sh"

# Run in background (optional)
# ./.agent-monitor-${AGENT_ID}.sh > ".agent-monitor-${AGENT_ID}.log" 2>&1 &
```

### Phase 5: Resource Allocation and Optimization

**Step 5.1: Calculate Resource Allocation**
```markdown
Determine resource limits based on:
1. **Total System Resources**:
   - Total RAM: $(free -h | grep Mem | awk '{print $2}')
   - Total CPUs: $(nproc)

2. **Currently Active Agents**:
   - Count: $(grep "Running" AGENT_REGISTRY.md | wc -l)
   - Total allocated RAM: ${SUM_OF_AGENT_RAM}
   - Total allocated CPUs: ${SUM_OF_AGENT_CPUS}

3. **Allocation for New Agent**:
   Default limits:
   - RAM: 2GB (can adjust based on task complexity)
   - CPU: 1.0 cores (can adjust based on task type)

   Adjust if:
   - Remaining system RAM < 4GB → Reduce to 1GB
   - Active agents > 5 → Queue agent instead of spawn
   - Task complexity = "Complex" → Increase to 4GB RAM, 2 CPUs
```

**Step 5.2: Implement Queueing (if resources limited)**
```markdown
If system resources insufficient:

Create AGENT_QUEUE.md:
---
# Agent Spawn Queue

| Queue Position | Task ID | Role | Model | Priority | Waiting Since | Trigger Condition |
|----------------|---------|------|-------|----------|---------------|-------------------|
| 1 | T5 | Builder | sonnet-4 | High | 2025-11-29T14:30:00Z | Wait for agent-1732901234 to complete |
| 2 | T6 | Scribe | haiku-3.5 | Low | 2025-11-29T14:31:00Z | Wait for RAM > 4GB available |

---

Queue Processing Rules:
1. Check queue every 2 minutes
2. Spawn highest priority agent when resources available
3. Prioritization:
   - High: Blocking other tasks
   - Medium: On critical path
   - Low: Parallel work, non-blocking
```

### Phase 6: Completion Reporting

**Step 6.1: Spawn Confirmation**
```markdown
Display to user:

╔══════════════════════════════════════════════════════════╗
║                AGENT SPAWNED SUCCESSFULLY                ║
╚══════════════════════════════════════════════════════════╝

AGENT DETAILS:
  ID: ${AGENT_ID}
  Role: ${ROLE}
  Model: ${SELECTED_MODEL}
  Task: ${TASK_ID} - ${TASK_DESCRIPTION}

ENVIRONMENT:
  Isolation: ${ISOLATION_TYPE}
  Location: ${WORKTREE_PATH or CONTAINER_ID}
  Branch: ${BRANCH_NAME}

RESOURCES:
  Memory: ${RAM_LIMIT}
  CPU: ${CPU_LIMIT}
  Context Window: 200K tokens

MONITORING:
  Status: Check MULTI_AGENT_PLAN.md
  Progress: Check AGENT_REGISTRY.md
  Logs: ${LOG_PATH}

EXPECTED COMPLETION: ~${ESTIMATED_TIME}

The agent is now working autonomously. It will:
  1. Update MULTI_AGENT_PLAN.md when starting work
  2. Commit progress incrementally
  3. Report blockers if encountered
  4. Update status on completion

You can continue with other work. The orchestrator will monitor progress.
```

**Step 6.2: Update Orchestration Log**
```markdown
Append to ORCHESTRATION_LOG.md:

## Agent Spawn Event

**Timestamp**: ${ISO_TIMESTAMP}
**Agent ID**: ${AGENT_ID}
**Task ID**: ${TASK_ID}
**Role**: ${ROLE}
**Model**: ${SELECTED_MODEL}
**Isolation**: ${ISOLATION_TYPE}
**Resource Allocation**: ${RAM_LIMIT} RAM, ${CPU_LIMIT} CPU
**Expected Duration**: ${ESTIMATED_TIME}
**Status**: Active

---
```

## Error Handling

### Scenario: Insufficient System Resources
```markdown
If RAM < 2GB available:
1. Add task to AGENT_QUEUE.md
2. Notify user: "Agent queued due to insufficient resources"
3. Suggest: "Consider terminating idle agents to free resources"
4. Monitor for resource availability every 2 minutes
```

### Scenario: Invalid Task Description
```markdown
If cannot classify task to a role:
1. Prompt user to clarify:
   "I couldn't determine the appropriate agent role for this task.
    Please specify: Architect, Builder, Validator, Scribe, DevOps, or Researcher"
2. Show classification keywords to help user decide
3. Allow manual override of automatic classification
```

### Scenario: Worktree Creation Fails
```markdown
If git worktree command fails:
1. Check if branch already exists: git branch --list ${BRANCH_NAME}
2. If exists: Use alternative name ${BRANCH_NAME}-v2
3. If directory exists: Clean up: git worktree remove ${WORKTREE_PATH} --force
4. Retry worktree creation
5. If still fails: Fall back to container isolation
```

### Scenario: Agent Spawn Fails
```markdown
If Task tool returns error:
1. Log error details to ORCHESTRATION_LOG.md
2. Mark task as "Failed to Spawn" in MULTI_AGENT_PLAN.md
3. Options:
   a) Retry with different model
   b) Retry with simpler prompt
   c) Fall back to manual execution
   d) Escalate to user
```

## Cost Optimization Strategies

### Model Selection Economics
```markdown
Cost Comparison (per 1M tokens):
- Claude Opus 4: $15.00 input, $75.00 output
- Claude Sonnet 4: $3.00 input, $15.00 output
- Claude Haiku 3.5: $0.25 input, $1.25 output

Example feature with 6 tasks:
All Opus 4: ~$450 estimated cost
Optimized Mix (1 Opus, 4 Sonnet, 1 Haiku): ~$120 estimated cost
Savings: 73% cost reduction with minimal quality impact

Recommendation:
- Use Opus 4 for orchestrator only (1 agent)
- Use Sonnet 4 for all specialized workers (default)
- Use Haiku 3.5 for simple, repetitive tasks
```

### Parallelization ROI
```markdown
Sequential vs. Parallel Execution:

Sequential (1 agent at a time):
- Time: 6 tasks × 30 min avg = 180 minutes
- Cost: Lower (1 agent active at a time)
- Resource usage: Minimal

Parallel (6 agents simultaneously):
- Time: max(task durations) = ~45 minutes
- Cost: Higher (6 agents active)
- Resource usage: High

Break-even Analysis:
- If time savings > 2x AND budget allows → Parallelize
- If tasks are dependent → Sequential mandatory
- If exploring multiple approaches → Parallelize (stochastic value)
```

## Advanced Features

### Dynamic Agent Scaling
```markdown
Auto-scaling rules (future enhancement):

Scale UP when:
- Task queue length > 5
- All current agents busy > 30 minutes
- Critical path tasks waiting

Scale DOWN when:
- Agents idle > 10 minutes
- Queue empty
- Resource utilization < 30%

Implementation:
- Monitor AGENT_QUEUE.md and AGENT_REGISTRY.md
- Apply scaling rules every 5 minutes
- Respect resource limits and budget constraints
```

### Agent Reassignment
```markdown
If agent produces low-quality output:
1. Detect via validation failure or user feedback
2. Terminate underperforming agent
3. Reassign task to different agent with:
   - Different model (upgrade to Opus if was Sonnet)
   - Refined prompt with failure context
   - Additional constraints or examples
4. Track reassignment in ORCHESTRATION_LOG.md
```

### Multi-Project Agent Pools
```markdown
For organizations with multiple projects:

Create centralized agent pool:
- Shared infrastructure (containers or worktrees)
- Task queue across projects
- Priority-based scheduling
- Cost allocation per project

Benefits:
- Better resource utilization
- Reduced idle time
- Cross-project learning
- Centralized monitoring
```

## Security Considerations

### Agent Capability Restrictions
```markdown
Least Privilege Principle:
- Agents receive ONLY tools needed for their specific task
- Read-only access to shared documents except MULTI_AGENT_PLAN.md
- Cannot access filesystem outside worktree/container
- Cannot make network requests (unless DevOps role)

Verification:
- Pre-spawn validation of allowed-tools list
- Runtime monitoring of tool usage
- Post-completion audit of all commands executed
```

### Credential Management
```markdown
Agent access to secrets:
- NO hardcoded credentials in prompts
- Use environment variables for sensitive data
- Copy .env.example to agent worktree (user fills values)
- Container mode: Mount secrets as read-only volumes
- Rotate credentials after agent termination
```

## Example Execution Scenarios

### Example 1: Spawn from Planning Document
```markdown
Command: /spawn-agents

System reads MULTI_AGENT_PLAN.md
Finds 3 tasks ready to start (dependencies satisfied)

Output:
✓ Spawning 3 agents for parallel execution...

Agent 1:
  ID: agent-1732901234-5678
  Role: Builder
  Task: T2 - Implement OAuth 2.0 flow
  Model: Sonnet 4
  Worktree: ../worktrees/task/t2-builder

Agent 2:
  ID: agent-1732901240-9012
  Role: Builder
  Task: T3 - Implement JWT authentication
  Model: Sonnet 4
  Worktree: ../worktrees/task/t3-builder

Agent 3:
  ID: agent-1732901245-3456
  Role: Validator
  Task: T4 - Security testing
  Model: Sonnet 4
  Worktree: ../worktrees/task/t4-validator

All agents active and working. Estimated completion: 45-60 minutes.
```

### Example 2: Spawn Single Agent Inline
```markdown
Command: /spawn-agents --task "Refactor authentication module for testability" --role Builder

Output:
✓ Task analyzed and classified
✓ Role: Builder (auto-detected from "refactor" keyword)
✓ Model: Sonnet 4 (moderate complexity assessment)
✓ Isolation: Git worktree (default for trusted code)

Agent Spawned:
  ID: agent-1732902000-7890
  Task: Refactor authentication module
  Worktree: ../worktrees/task/refactor-auth-builder
  Branch: task/refactor-auth-builder

Agent is now working. Check MULTI_AGENT_PLAN.md for progress.
```

## Integration with Other Commands

**Workflow Integration:**
```markdown
1. /orchestrate-feature → Creates MULTI_AGENT_PLAN.md
2. /spawn-agents → Instantiates agents for tasks ← (this command)
3. /coordinate-workflow → Monitors and coordinates active agents
4. /quality-gate → Validates agent outputs before merge
```

## Version History

- **1.0.0** (2025-11-29): Initial release with dynamic role assignment and resource allocation

---

**Template Version**: 1.0.0
**Last Updated**: November 29, 2025
**Maintained By**: Engineering Standards Committee
**Review Cycle**: Quarterly
