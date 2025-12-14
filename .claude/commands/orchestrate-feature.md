---
description: "Multi-agent feature development orchestration with automated MULTI_AGENT_PLAN.md generation, parallel task execution, and git worktree isolation"
allowed-tools: ["Read", "Edit", "Write", "Bash(git:*)", "Bash(mkdir)", "Bash(find)", "Task"]
author: "Engineering Standards Committee"
version: "1.0.0"
---

# Orchestrate Feature Development

## Purpose
Orchestrate complex feature development by decomposing requirements into parallel tasks, spawning specialized agents in isolated git worktrees, and coordinating execution through structured planning.

## When to Use
- Complex features requiring multiple specialized agents (frontend + backend + testing + docs)
- Features benefiting from exploring multiple implementation approaches in parallel
- Large-scale refactoring or architectural changes
- Features with clear task boundaries and minimal cross-dependencies

## Prerequisites
- Clean working directory or committed changes
- Feature requirements clearly documented
- Existing architecture documentation (ARCHITECTURE.md, AGENTS.md)
- Git repository initialized

## Project-Specific Customization

**To use this template in your project:**

1. Copy to `.claude/commands/orchestrate-feature.md`
2. Customize agent role names to match your team structure
3. Adjust `allowed-tools` based on your security requirements
4. Modify worktree directory structure preferences
5. Configure parallel execution limits based on system resources

## Orchestration Workflow

### Phase 1: Requirements Analysis and Task Decomposition

**Step 1.1: Load Feature Context**
```markdown
Prompt user for feature specification:

## Feature Requirements
**Feature Name**: [User provides name]
**Description**: [User describes feature goals]
**Complexity**: [Simple/Moderate/Complex]
**Priority**: [High/Medium/Low]
**Dependencies**: [List any prerequisite features or systems]

Read supporting documentation:
- @README.md
- @ARCHITECTURE.md
- @AGENTS.md
- @DEVELOPMENT_PLAN.md (if exists)
- @MULTI_AGENT_PLAN.md (if exists)
```

**Step 1.2: Analyze and Decompose**
```markdown
Using Claude Opus 4 (orchestrator-level reasoning):

1. Break feature into discrete, independent subtasks
2. Identify parallelization opportunities
3. Map subtasks to specialized agent roles:
   - Architect: System design, API specifications
   - Builder: Implementation, code generation
   - Validator: Testing, code review, security audit
   - Scribe: Documentation, API docs
   - DevOps: Infrastructure, deployment configuration

4. Create dependency graph:
   - Which tasks must run sequentially?
   - Which tasks can run in parallel?
   - What are the handoff points between agents?

5. Estimate complexity and effort for each subtask
```

**Step 1.3: Generate Multi-Agent Plan**
```markdown
Create or update MULTI_AGENT_PLAN.md:

---
# Multi-Agent Plan: [Feature Name]

## Project Goal
[1-2 sentence summary of feature objective]

## Parallel Execution Strategy
- **Isolation Method**: Git Worktrees
- **Agent Distribution**: [N] agents across [M] independent tasks
- **Coordination**: Shared MULTI_AGENT_PLAN.md with atomic status updates
- **Merge Strategy**: [Describe how results will be integrated]

## Task Assignment Matrix

| Task ID | Task Description | Agent Role | Worktree Path | Branch | Parallel Group | Status | Dependencies |
|---------|------------------|------------|---------------|--------|----------------|--------|--------------|
| T1 | [Task description] | Architect | ../worktrees/feature-arch | feature/{{FEATURE_NAME}}-arch | A | Not Started | - |
| T2 | [Task description] | Builder | ../worktrees/feature-impl-1 | feature/{{FEATURE_NAME}}-impl-1 | B | Not Started | T1 |
| T3 | [Task description] | Builder | ../worktrees/feature-impl-2 | feature/{{FEATURE_NAME}}-impl-2 | B | Not Started | T1 |
| T4 | [Task description] | Validator | ../worktrees/feature-tests | feature/{{FEATURE_NAME}}-tests | C | Not Started | T2,T3 |
| T5 | [Task description] | Scribe | ../worktrees/feature-docs | feature/{{FEATURE_NAME}}-docs | C | Not Started | T2,T3 |

**Parallel Groups**:
- Group A: Architecture and planning (1 agent)
- Group B: Parallel implementations (2 agents exploring different approaches)
- Group C: Validation and documentation (2 agents in parallel)

## Success Criteria
- [ ] All subtasks completed and validated
- [ ] Tests passing in all worktrees
- [ ] Documentation complete
- [ ] Code review completed
- [ ] Integration conflicts resolved
- [ ] Final merge to main branch successful

## Communication Protocol
- **Status Updates**: Agents update this file's Status column atomically
- **Blockers**: Add comments in "Notes" section below
- **Questions**: Create issues in QUESTIONS.md for orchestrator review
- **Handoffs**: Document completion artifacts in respective task rows

## Merge Strategy
1. Review all parallel implementation approaches (T2, T3)
2. Select best implementation or cherry-pick optimal components
3. Integrate tests (T4) and documentation (T5)
4. Final validation by Validator agent
5. Merge to main via pull request

## Notes and Blockers
[Agents append status updates, questions, and blockers here]

---
```

### Phase 2: Worktree and Agent Initialization

**Step 2.1: Create Git Worktrees**
```bash
# Read MULTI_AGENT_PLAN.md to get worktree specifications
# For each task in the plan:

# Example for Task T1 (Architect)
git worktree add ../worktrees/feature-{{FEATURE_NAME}}-arch -b feature/{{FEATURE_NAME}}-arch

# Example for Task T2 (Builder - Implementation 1)
git worktree add ../worktrees/feature-{{FEATURE_NAME}}-impl-1 -b feature/{{FEATURE_NAME}}-impl-1

# Example for Task T3 (Builder - Implementation 2)
git worktree add ../worktrees/feature-{{FEATURE_NAME}}-impl-2 -b feature/{{FEATURE_NAME}}-impl-2

# Copy shared configuration to each worktree
for worktree in ../worktrees/feature-{{FEATURE_NAME}}-*; do
  cp .env.example "$worktree/.env" 2>/dev/null || true
  cp AGENTS.md "$worktree/" 2>/dev/null || true
  cp CLAUDE.md "$worktree/" 2>/dev/null || true
  cp MULTI_AGENT_PLAN.md "$worktree/"
done
```

**Step 2.2: Spawn Agent Sessions**
```markdown
For each task with Status="Not Started" and no pending dependencies:

Use Task tool to spawn specialized agents:
---
subagent_type: "general-purpose"
model: "sonnet"  # Use efficient model for worker agents
prompt: |
  You are the {{AGENT_ROLE}} agent working on Task {{TASK_ID}}: {{TASK_DESCRIPTION}}

  ## Your Worktree
  Path: {{WORKTREE_PATH}}
  Branch: {{BRANCH_NAME}}

  ## Your Task
  {{DETAILED_TASK_DESCRIPTION_FROM_PLAN}}

  ## Context
  - Review MULTI_AGENT_PLAN.md for overall feature goals
  - Read AGENTS.md for project standards
  - Follow {{AGENT_ROLE}} best practices from agent configuration
  - You have full independence within your worktree

  ## Deliverables
  {{EXPECTED_OUTPUT_DESCRIPTION}}

  ## Success Criteria
  {{ACCEPTANCE_CRITERIA}}

  ## Coordination
  1. Update MULTI_AGENT_PLAN.md Status column to "In Progress" when you start
  2. Update to "Blocked" if you encounter issues (add details to Notes)
  3. Update to "Completed" when finished
  4. Commit your changes with message: "[{{AGENT_ROLE}}] {{TASK_ID}}: {{BRIEF_DESCRIPTION}}"

  ## Constraints
  - Work ONLY within your worktree directory
  - Do NOT merge or modify other branches
  - Do NOT modify shared configuration files
  - Read MULTI_AGENT_PLAN.md for status of dependencies

  Begin your task now.
---

Mark task as "Agent Spawned" in orchestrator tracking.
```

**Step 2.3: Set Up Monitoring**
```markdown
Create ORCHESTRATION_LOG.md to track:
- Timestamp of each agent spawn
- Agent ID and assigned task
- Worktree path and branch
- Expected completion criteria
- Actual completion timestamp

Format:
---
# Orchestration Log: {{FEATURE_NAME}}

## Session Metadata
- **Orchestration Start**: {{ISO_TIMESTAMP}}
- **Orchestrator Model**: Claude Opus 4
- **Total Tasks**: {{N}}
- **Parallel Groups**: {{M}}

## Agent Execution Timeline

| Agent ID | Task ID | Role | Status | Started | Completed | Worktree | Notes |
|----------|---------|------|--------|---------|-----------|----------|-------|
| agent-1 | T1 | Architect | Running | 14:23:10 | - | ../worktrees/feature-arch | - |
| agent-2 | T2 | Builder | Running | 14:25:03 | - | ../worktrees/feature-impl-1 | - |
| agent-3 | T3 | Builder | Running | 14:25:08 | - | ../worktrees/feature-impl-2 | - |

## Completion Summary
[Updated when all tasks complete]
---
```

### Phase 3: Progress Monitoring and Coordination

**Step 3.1: Periodic Status Checks**
```bash
# Every 5-10 minutes, check agent progress:

# Read current MULTI_AGENT_PLAN.md
cat MULTI_AGENT_PLAN.md | grep "Status" | grep -v "Completed"

# Check git status in each active worktree
for worktree in ../worktrees/feature-{{FEATURE_NAME}}-*; do
  echo "=== $worktree ==="
  cd "$worktree" && git status --short && git log -1 --oneline
done
```

**Step 3.2: Dependency Resolution**
```markdown
When task with dependencies shows "Completed":
1. Identify dependent tasks in MULTI_AGENT_PLAN.md
2. Check if all dependencies are now satisfied
3. Spawn agents for newly unblocked tasks (repeat Step 2.2)

Example:
- Task T1 (Architect) completes
- Tasks T2 and T3 (Builders) depend on T1
- Both T2 and T3 can now start in parallel
- Spawn agent-2 and agent-3 simultaneously
```

**Step 3.3: Handle Blockers**
```markdown
If agent reports "Blocked" status:
1. Read blocker details from MULTI_AGENT_PLAN.md Notes section
2. Assess if orchestrator can resolve:
   - Missing requirements → Clarify and update plan
   - Dependency issues → Coordinate with other agents
   - Technical questions → Provide architectural guidance
3. If unresolvable, escalate to user
4. Update MULTI_AGENT_PLAN.md with resolution
5. Change task status back to "In Progress"
```

### Phase 4: Result Integration and Validation

**Step 4.1: Collect Completed Work**
```bash
# When all tasks show "Completed" status:

# List all feature branches
git branch --list "feature/{{FEATURE_NAME}}-*"

# Review commits in each worktree
for worktree in ../worktrees/feature-{{FEATURE_NAME}}-*; do
  echo "=== Commits in $worktree ==="
  cd "$worktree" && git log --oneline origin/main..HEAD
done
```

**Step 4.2: Implementation Selection (for parallel approaches)**
```markdown
If multiple parallel implementations (e.g., T2 and T3):

Compare approaches:
1. **Code Quality**: Run linter/formatter on both
2. **Test Coverage**: Compare test suite completeness
3. **Performance**: Benchmark if applicable
4. **Maintainability**: Assess code complexity
5. **Alignment**: Check adherence to architecture

Selection strategies:
- **Best-of-N**: Choose single best implementation
- **Cherry-pick**: Take best components from each
- **Hybrid**: Merge complementary approaches

Document decision in MULTI_AGENT_PLAN.md:
---
## Implementation Selection
**Chosen Approach**: {{SELECTED_BRANCH}}
**Rationale**: {{DETAILED_REASONING}}
**Incorporated Elements**:
- From T2: {{COMPONENTS}}
- From T3: {{COMPONENTS}}
---
```

**Step 4.3: Integration and Merge**
```bash
# Create integration branch
git checkout -b feature/{{FEATURE_NAME}}-integration

# Merge selected implementation
git merge feature/{{FEATURE_NAME}}-impl-1  # Selected approach

# Cherry-pick components from alternative if needed
git cherry-pick feature/{{FEATURE_NAME}}-impl-2~3..feature/{{FEATURE_NAME}}-impl-2

# Merge tests and documentation
git merge feature/{{FEATURE_NAME}}-tests
git merge feature/{{FEATURE_NAME}}-docs

# Resolve any conflicts
# Run full test suite
npm test  # or appropriate test command

# If tests pass, create pull request
gh pr create --title "Feature: {{FEATURE_NAME}}" \
  --body "$(cat MULTI_AGENT_PLAN.md)" \
  --base main --head feature/{{FEATURE_NAME}}-integration
```

**Step 4.4: Final Validation**
```markdown
Before merge to main:
1. All tests passing ✓
2. Code review completed ✓
3. Documentation updated ✓
4. No unresolved conflicts ✓
5. Performance benchmarks met ✓
6. Security audit passed (if required) ✓
```

### Phase 5: Cleanup and Retrospective

**Step 5.1: Worktree Cleanup**
```bash
# After successful merge to main:

# Remove feature worktrees
git worktree remove ../worktrees/feature-{{FEATURE_NAME}}-arch
git worktree remove ../worktrees/feature-{{FEATURE_NAME}}-impl-1
git worktree remove ../worktrees/feature-{{FEATURE_NAME}}-impl-2
git worktree remove ../worktrees/feature-{{FEATURE_NAME}}-tests
git worktree remove ../worktrees/feature-{{FEATURE_NAME}}-docs

# Delete feature branches (optional)
git branch -d feature/{{FEATURE_NAME}}-arch
git branch -d feature/{{FEATURE_NAME}}-impl-1
git branch -d feature/{{FEATURE_NAME}}-impl-2
git branch -d feature/{{FEATURE_NAME}}-tests
git branch -d feature/{{FEATURE_NAME}}-docs
git branch -d feature/{{FEATURE_NAME}}-integration
```

**Step 5.2: Archive Orchestration Artifacts**
```bash
# Move orchestration logs to archive
mkdir -p .orchestration-archive/{{FEATURE_NAME}}-{{DATE}}
mv MULTI_AGENT_PLAN.md .orchestration-archive/{{FEATURE_NAME}}-{{DATE}}/
mv ORCHESTRATION_LOG.md .orchestration-archive/{{FEATURE_NAME}}-{{DATE}}/

# Create summary document
cat > .orchestration-archive/{{FEATURE_NAME}}-{{DATE}}/SUMMARY.md << 'EOF'
# Orchestration Summary: {{FEATURE_NAME}}

## Metrics
- **Total Tasks**: {{N}}
- **Parallel Agents**: {{M}}
- **Duration**: {{START}} → {{END}} ({{ELAPSED}})
- **Approaches Explored**: {{COUNT}}
- **Selected Approach**: {{BRANCH}}

## Agent Performance
| Agent | Task | Time | Commits | Status |
|-------|------|------|---------|--------|
| agent-1 | T1 | 23min | 5 | Success |
| agent-2 | T2 | 45min | 12 | Success |
| agent-3 | T3 | 40min | 10 | Success (alternative) |

## Lessons Learned
{{RETROSPECTIVE_NOTES}}

## Recommendations
{{FUTURE_IMPROVEMENTS}}
EOF
```

**Step 5.3: Update Development Plan**
```markdown
Edit DEVELOPMENT_PLAN.md:
- Mark feature as "Completed"
- Update architecture documentation if needed
- Add any new patterns discovered
- Document technical decisions made
```

## Error Handling

### Scenario: Agent Fails or Produces Invalid Output
```markdown
1. Check ORCHESTRATION_LOG.md for agent status
2. Review agent's worktree for error messages or logs
3. Options:
   a) Respawn agent with refined prompt/context
   b) Manually intervene and complete task
   c) Reassign to different agent role
4. Update MULTI_AGENT_PLAN.md with issue resolution
```

### Scenario: Merge Conflicts During Integration
```markdown
1. Identify conflicting files
2. If architectural conflicts:
   - Escalate to user for decision
   - May require orchestrator to reconcile designs
3. If implementation conflicts:
   - Prefer selected approach
   - Cherry-pick non-conflicting improvements
4. Re-run tests after manual conflict resolution
```

### Scenario: Dependency Deadlock
```markdown
If circular dependencies detected:
1. Analyze dependency graph in MULTI_AGENT_PLAN.md
2. Identify cycle: T2 → T3 → T2
3. Resolution strategies:
   - Break cycle by redefining task boundaries
   - Introduce intermediate task to resolve dependency
   - Spawn coordinating agent to handle shared component
4. Update plan and respawn agents
```

## Performance Optimization

### Cost Optimization
```markdown
Model Selection Strategy:
- **Orchestrator**: Use Claude Opus 4 (high capability for planning)
- **Worker Agents**: Use Claude Sonnet 4 (efficient for execution)
- **Simple Tasks**: Use Claude Haiku 3.5 (documentation, formatting)

Estimated cost reduction: 28-35% vs. all-Opus approach
Maintains 96%+ of peak performance quality
```

### Parallelization Limits
```markdown
Recommended concurrent agents:
- **Local Development**: 3-5 agents (depending on system resources)
- **CI/CD**: 5-10 agents (container-based isolation)
- **Cloud**: 10+ agents (with proper orchestration infrastructure)

Monitor:
- CPU usage per agent
- Memory consumption
- I/O bottlenecks (disk, network)
- Git lock contention
```

## Security Considerations

### Worktree Isolation Boundaries
```markdown
Each agent operates in isolated worktree:
- Cannot modify other agent's files
- Cannot merge without orchestrator approval
- Cannot access main branch working directory

However, agents share:
- Git history (read-only)
- Configuration files (copied at spawn time)
- MULTI_AGENT_PLAN.md (read-write with atomic updates)

Security implications:
- Malicious agent cannot corrupt other worktrees
- Malicious agent CAN pollute shared planning document
- Malicious agent CAN push to remote if credentials available

Mitigation:
- Use read-only credentials for worker agents
- Implement pre-commit hooks to validate changes
- Orchestrator performs final security audit before merge
```

### Allowed Tools Justification
```yaml
- "Read": Required to load feature requirements and planning documents
- "Edit": Required to update MULTI_AGENT_PLAN.md and create worktree files
- "Write": Required to generate planning documents and orchestration logs
- "Bash(git:*)": Required for worktree management, commits, merges
- "Bash(mkdir)": Required to create worktree directories
- "Bash(find)": Required to discover project structure
- "Task": Required to spawn specialized subagents
```

## Example Execution

**User Request:**
> "Implement user authentication with OAuth 2.0, JWT, and session-based options. I want to explore different approaches and pick the best one."

**Orchestration Output:**
```markdown
✓ Feature analyzed: User Authentication System
✓ Decomposed into 6 tasks across 4 parallel groups
✓ Created MULTI_AGENT_PLAN.md
✓ Spawned 6 agents in isolated worktrees:
  - agent-1 (Architect): API design and security architecture
  - agent-2 (Builder): OAuth 2.0 implementation
  - agent-3 (Builder): JWT implementation
  - agent-4 (Builder): Session-based implementation
  - agent-5 (Validator): Security audit and penetration testing
  - agent-6 (Scribe): API documentation and integration guides

⏱ Estimated completion: 90-120 minutes

📊 Status dashboard available in ORCHESTRATION_LOG.md
📋 Coordination plan available in MULTI_AGENT_PLAN.md

Monitoring agent progress... (will notify on completion)
```

## Anti-Patterns to Avoid

❌ **Spawning too many agents** - Diminishing returns after 5-7 concurrent agents
❌ **Insufficient task decomposition** - Tasks must be truly independent
❌ **Weak coordination** - Agents must have clear handoff protocols
❌ **Ignoring dependencies** - Dependency graph must be accurate
❌ **Manual worktree management** - Automate worktree lifecycle
❌ **No result validation** - Always validate before integration
❌ **Mixing implementation details in orchestration** - Orchestrator plans, workers implement

## Version History

- **1.0.0** (2025-11-29): Initial release with git worktree orchestration
- Planned features:
  - Container-based agent isolation option
  - Real-time progress dashboard
  - Automated performance benchmarking
  - Cost tracking and optimization recommendations

---

**Template Version**: 1.0.0
**Last Updated**: November 29, 2025
**Maintained By**: Engineering Standards Committee
**Review Cycle**: Quarterly
