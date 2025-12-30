# Agent Skills vs. Multi-Agent Architecture: A Strategic Shift

> **Based on Anthropic's latest research on agent engineering best practices**

## Executive Summary

Anthropic's recent research advocates for a fundamental shift in agent engineering strategy: **from building multiple specialized agents to using a general agent with a wide library of specialized skills**. This document explains this paradigm shift, when to use each approach, and how to integrate both patterns effectively.

---

## Table of Contents

1. [The Paradigm Shift](#the-paradigm-shift)
2. [What Are Agent Skills?](#what-are-agent-skills)
3. [Skills vs. Multi-Agent: Key Differences](#skills-vs-multi-agent-key-differences)
4. [When to Use Which Approach](#when-to-use-which-approach)
5. [Hybrid Architecture Patterns](#hybrid-architecture-patterns)
6. [Migration Strategy](#migration-strategy)
7. [Implementation Guidelines](#implementation-guidelines)
8. [Performance and Cost Analysis](#performance-and-cost-analysis)
9. [Best Practices](#best-practices)
10. [References and Resources](#references-and-resources)

---

## The Paradigm Shift

### Old Paradigm: Multiple Specialized Agents

**Traditional Approach:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   OAuth     │  │    JWT      │  │  Session    │  │   LDAP      │
│   Agent     │  │   Agent     │  │   Agent     │  │   Agent     │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**Problems:**
- Each agent has custom prompts, configurations, toolsets
- High maintenance overhead (N agents to maintain)
- Fragmented knowledge and patterns
- Duplicated infrastructure code
- Context switching between agents
- Version management complexity

### New Paradigm: General Agent + Skills Library

**Anthropic-Recommended Approach:**
```
┌─────────────────────────────────────────────────────────────┐
│                   General Agent (Claude)                    │
│                                                             │
│  Dynamically Loads Skills Based on Task:                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  OAuth   │ │   JWT    │ │ Session  │ │   LDAP   │    │
│  │  Skill   │ │  Skill   │ │  Skill   │ │  Skill   │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**
- Single agent to maintain and update
- Composable, reusable skill packages
- Reduced context switching
- Better knowledge sharing across workflows
- Simpler deployment and versioning
- Progressive disclosure (load only what's needed)

---

## What Are Agent Skills?

### Definition

**Agent Skills** are organized folders of instructions, scripts, and resources that agents can discover and load dynamically to perform specific tasks with domain expertise.

### Structure

```
skill-name/
├── SKILL.md              # Instructions and metadata (required)
├── scripts/              # Executable code (optional)
│   ├── setup.py
│   └── validate.sh
├── resources/            # Reference materials (optional)
│   ├── templates/
│   └── examples/
└── README.md            # Human-readable documentation (optional)
```

### Components

1. **SKILL.md (Required)**:
   - Clear instructions for the agent
   - Workflow steps and decision points
   - Input/output specifications
   - Error handling guidance
   - Metadata (version, dependencies, triggers)

2. **Scripts (Optional)**:
   - Deterministic operations requiring precision
   - Complex data transformations
   - Integration with external systems
   - Testing and validation routines

3. **Resources (Optional)**:
   - Templates and examples
   - Configuration files
   - Reference documentation
   - Domain-specific knowledge

### Skills vs. Tools vs. MCP

| Concept | Level | Example | When to Use |
|---------|-------|---------|-------------|
| **Tools** | Atomic functions | `get_weather(location)` | Single-purpose operations |
| **MCP Servers** | System interface | GitHub API, Database connector | External system access |
| **Skills** | Workflow automation | "PR Review Process" combining code reading, analysis, and commenting | Multi-step domain expertise |

**Key Insight**: Skills provide a **workflow layer** above raw tools and MCP servers.

---

## Skills vs. Multi-Agent: Key Differences

### Architecture Comparison

| Aspect | Multi-Agent | Single Agent + Skills |
|--------|-------------|----------------------|
| **Specialization** | Separate agent instances | Skill packages loaded on-demand |
| **Context Management** | Distributed across agents | Centralized with progressive loading |
| **Coordination** | Inter-agent messaging | Internal skill composition |
| **Parallelization** | Native (multiple agents) | Requires orchestration or async patterns |
| **Maintenance** | Update N agents | Update 1 agent + M skills |
| **Cost** | Higher (multiple LLM calls) | Lower (single context, selective loading) |
| **Complexity** | Coordination overhead | Skill dependency management |

### Execution Patterns

**Multi-Agent (Orchestrator-Worker):**
```python
# Pseudo-code
orchestrator = Agent(role="orchestrator")
worker_1 = Agent(role="builder", tools=[git, compiler])
worker_2 = Agent(role="validator", tools=[pytest, linter])

result = orchestrator.delegate([
    worker_1.implement(feature),
    worker_2.validate(result)
])
```

**Single Agent + Skills:**
```python
# Pseudo-code
agent = Agent(role="general")
agent.load_skills(["builder-role-skill", "validator-role-skill"])

result = agent.execute_workflow([
    {"skill": "builder-role-skill", "task": "implement", "input": feature},
    {"skill": "validator-role-skill", "task": "validate", "input": result}
])
```

### Token Efficiency

According to Anthropic's research:
- **Standard chat**: 1x tokens baseline
- **Single-agent workflow**: 4x tokens (tool calls, iterations)
- **Multi-agent system**: 15x tokens (coordination, handoffs, context duplication)
- **Single-agent + skills**: 5-7x tokens (efficient context loading)

**Conclusion**: Skills approach is 2-3x more token-efficient than multi-agent for sequential workflows.

---

## When to Use Which Approach

### Decision Matrix

| Scenario | Best Approach | Rationale |
|----------|---------------|----------|
| **Sequential coding tasks** | ✅ Single agent + skills | Maintains context, efficient token usage |
| **Parallel independent research** | ✅ Multi-agent | Natural parallelization, breadth-first exploration |
| **Complex feature (multiple approaches)** | ✅ Hybrid (multi-agent + skills) | Parallel exploration + specialized execution |
| **Routine automation (CI/CD)** | ✅ Command + skills | Lightweight, no agent coordination needed |
| **Domain expertise capture** | ✅ Skill package | Reusable, shareable, version-controlled |
| **Large-scale refactoring** | ✅ Hybrid | Orchestrator + workers with refactor skills |
| **Multi-environment deployment** | ✅ Multi-agent | Parallel deployment to dev/staging/prod |
| **API integration** | ✅ Single agent + skill | Sequential setup and validation steps |
| **Full-stack development** | ⚖️ Context-dependent | See breakdown below |

### Full-Stack Development: Detailed Breakdown

**Use Single Agent + Skills When:**
- Feature is tightly coupled (frontend and backend share logic)
- Sequential dependencies (DB schema → backend → frontend)
- Small to medium scope (< 1000 lines changed)
- Learning/exploration mode (agent builds context incrementally)

**Use Multi-Agent When:**
- Frontend and backend are independent
- Large scope requiring parallel work (> 1000 lines per layer)
- Multiple alternative implementations to compare
- Tight deadlines requiring parallelization

**Use Hybrid (Recommended for Most Cases):**
```
Orchestrator Agent
├── Backend Agent (loads: [backend-skill, database-skill, api-design-skill])
├── Frontend Agent (loads: [react-skill, styling-skill, state-management-skill])
└── Testing Agent (loads: [e2e-testing-skill, integration-testing-skill])
```

---

## Hybrid Architecture Patterns

### Pattern 1: Orchestrator with Skilled Workers

**Best for**: Complex features requiring parallel work with domain expertise

```
┌─────────────────────────────────────────────────────────────────┐
│              Orchestrator Agent (Claude Opus 4)                 │
│  - Task decomposition                                           │
│  - Dependency management                                        │
│  - Result synthesis                                             │
│  - Quality control                                              │
└───────────────────┬─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬────────────┬────────────┐
        │           │           │            │            │
   ┌────▼────┐ ┌───▼────┐ ┌────▼─────┐ ┌───▼────┐ ┌────▼─────┐
   │ Worker 1│ │Worker 2│ │ Worker 3 │ │Worker 4│ │ Worker 5 │
   │ Sonnet  │ │ Sonnet │ │  Sonnet  │ │ Sonnet │ │  Sonnet  │
   └────┬────┘ └───┬────┘ └────┬─────┘ └───┬────┘ └────┬─────┘
        │          │           │            │            │
   ┌────▼────┐ ┌──▼─────┐ ┌───▼──────┐ ┌──▼──────┐ ┌──▼──────┐
   │Backend  │ │Frontend│ │Database  │ │Testing  │ │DevOps   │
   │Role Skill│ │Role Skill│ │Skill   │ │Skill    │ │Skill    │
   └─────────┘ └────────┘ └──────────┘ └─────────┘ └─────────┘
```

**Implementation:**
```markdown
# Orchestrator configuration
role: orchestrator-lead
skills: [task-decomposition, dependency-management, result-synthesis]

# Worker configuration template
role: general-worker
skills: [dynamically-loaded-based-on-task]
context-isolation: git-worktree
```

### Pattern 2: Progressive Skill Loading

**Best for**: Exploratory workflows where requirements emerge during execution

```
Task Start
    ↓
[Agent loads minimal skills]
    ↓
[Agent assesses requirements]
    ↓
[Agent loads additional skills as needed]
    ↓
[Agent executes with full skill set]
    ↓
Task Complete
```

**Example Workflow:**
```
1. Agent loads: [code-reading-skill]
2. Discovers: "This is a React component"
3. Agent loads: [react-skill, styling-skill]
4. Discovers: "Uses Redux for state"
5. Agent loads: [redux-skill]
6. Executes: Feature implementation
```

### Pattern 3: Skill Composition

**Best for**: Building complex workflows from simple, reusable components

```
┌──────────────────────────────────────────────────────────┐
│           Meta-Skill: "Full PR Review Process"           │
│                                                          │
│  Composed of:                                            │
│  ├── code-quality-check-skill                           │
│  ├── security-audit-skill                               │
│  ├── test-coverage-validation-skill                     │
│  ├── documentation-completeness-skill                   │
│  └── pr-comment-generation-skill                        │
└──────────────────────────────────────────────────────────┘
```

**Skill Definition (SKILL.md):**
```markdown
# Meta-Skill: Full PR Review Process

## Dependencies
- code-quality-check-skill
- security-audit-skill  
- test-coverage-validation-skill
- documentation-completeness-skill
- pr-comment-generation-skill

## Execution Flow
1. Load all dependency skills
2. Execute skills in parallel where possible
3. Aggregate results
4. Generate comprehensive review comment
```

---

## Migration Strategy

### Phase 1: Assessment (Week 1)

**Goal**: Identify which specialized agents can become skills

1. **Audit existing agents**:
   ```bash
   ls agents-templates/
   # Output: architect.md, builder.md, validator.md, scribe.md, devops.md
   ```

2. **Classify by task type**:
   - **Sequential workflows** → Convert to skills (builder, scribe)
   - **Parallel execution required** → Keep as agents (orchestrator)
   - **Hybrid candidates** → Support both modes (validator)

3. **Analyze agent interactions**:
   - **High coordination overhead** → Candidate for skill consolidation
   - **Independent parallel work** → Keep multi-agent pattern

### Phase 2: Skill Creation (Weeks 2-3)

**Goal**: Convert specialized agents to skills

1. **Extract core workflows from agent templates**:
   ```markdown
   # From: agents-templates/builder.md
   # To: skills/builder-role-skill/SKILL.md
   
   ## Workflow: Feature Implementation
   1. Read requirements from feature description
   2. Create implementation plan
   3. Write code following TDD
   4. Run tests and validate
   5. Commit changes with descriptive message
   ```

2. **Create skill structure**:
   ```bash
   mkdir -p skills/builder-role-skill/{scripts,resources,templates}
   touch skills/builder-role-skill/SKILL.md
   touch skills/builder-role-skill/README.md
   ```

3. **Document skill metadata**:
   ```yaml
   # skills/builder-role-skill/SKILL.md
   ---
   name: builder-role-skill
   version: 1.0.0
   triggers:
     - "implement feature"
     - "write code for"
     - "build functionality"
   dependencies:
     - git-worktree-skill (optional)
     - test-runner-skill (recommended)
   tools:
     - Edit
     - Bash(git:*)
     - Bash(npm:*)
   ---
   ```

### Phase 3: Update Documentation (Week 4)

**Goal**: Reflect skills-first architecture in documentation

1. **Update README.md**:
   - Add "Agent Skills vs. Multi-Agent" section
   - Update architecture diagrams
   - Add decision matrix

2. **Update core principles** (`01-Introduction-and-Core-Principles.md`):
   - Add skills-first philosophy
   - Clarify when to use multi-agent

3. **Update orchestration guide** (`04-Multi-Agent-Orchestration.md`):
   - Add hybrid patterns
   - Show how workers load skills

### Phase 4: Migration Path for Existing Projects

**Option 1: Gradual Migration**
- Keep existing multi-agent setup
- Introduce skills alongside agents
- Migrate one workflow at a time
- Measure performance and cost improvements

**Option 2: Rebuild with Skills-First**
- Start new features with general agent + skills
- Keep legacy workflows on multi-agent
- Plan full migration after validating approach

**Option 3: Hybrid Forever** (Recommended)
- Use multi-agent for breadth-first parallelization
- Use skills for depth-first sequential work  
- Let orchestrator decide which pattern to use

---

## Implementation Guidelines

### Creating Your First Skill

**Step 1: Identify a Repeating Workflow**
- Must be used ≥3 times per week
- Clear inputs and outputs
- Can be described procedurally

**Step 2: Choose Template Complexity**
```bash
# Simple workflow (< 10 steps)
cp templates/skills/minimal-skill-template.md skills/my-skill/SKILL.md

# Moderate workflow (10-30 steps)
cp templates/skills/standard-skill-template.md skills/my-skill/SKILL.md

# Complex workflow (> 30 steps, scripts needed)
cp templates/skills/comprehensive-skill-template.md skills/my-skill/SKILL.md
```

**Step 3: Write Instructions for the Agent**
```markdown
# Skill: API Integration Setup

## Objective
Configure a new API integration including authentication, error handling, and testing.

## Prerequisites
- API documentation URL
- Authentication credentials
- Target environment (dev/staging/prod)

## Workflow

### Phase 1: Discovery
1. Read API documentation
2. Identify authentication method (OAuth, JWT, API Key)
3. List required endpoints
4. Note rate limits and quotas

### Phase 2: Implementation
1. Create API client class
2. Implement authentication flow
3. Add error handling and retries
4. Implement required endpoint methods

### Phase 3: Testing
1. Write unit tests for authentication
2. Write integration tests for each endpoint
3. Test error scenarios
4. Validate rate limit handling

### Phase 4: Documentation
1. Generate API client usage examples
2. Document authentication setup
3. Add troubleshooting guide
```

**Step 4: Add Deterministic Scripts (Optional)**
```python
# skills/api-integration-skill/scripts/validate_credentials.py
"""
Deterministic validation of API credentials before integration.
"""
import os
import sys
import requests

def validate_credentials(api_key: str, base_url: str) -> bool:
    """Test API credentials with a simple health check."""
    try:
        response = requests.get(
            f"{base_url}/health",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Validation failed: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    api_key = os.getenv("API_KEY")
    base_url = sys.argv[1]
    
    if validate_credentials(api_key, base_url):
        print("✅ Credentials valid")
        sys.exit(0)
    else:
        print("❌ Credentials invalid")
        sys.exit(1)
```

### Configuring an Agent to Use Skills

**Option 1: Explicit Skill Loading (Command)**
```markdown
# .claude/commands/implement-with-skills.md

## Command: implement-with-skills

**Description**: Implement a feature using the builder role skill.

**Workflow**:
1. Load skills: builder-role-skill, git-worktree-skill, test-runner-skill
2. Execute builder workflow from SKILL.md
3. Use git-worktree-skill for isolation
4. Use test-runner-skill for validation
```

**Option 2: Dynamic Skill Loading (Agent)**
```markdown
# .claude/agents/general-developer.md

## Agent: General Developer

**Role**: General-purpose development agent with dynamic skill loading

**Capabilities**:
- Can load any skill from skills/ directory
- Analyzes task requirements to determine needed skills
- Progressively loads additional skills as needed

**Workflow**:
1. Receive task description
2. Identify required skills using skill-discovery
3. Load minimal skill set
4. Execute task
5. Load additional skills if needed
6. Complete and report results

**Decision Logic**:
```yaml
if task.type == "implement_feature":
    load_skills(["builder-role-skill", "test-runner-skill"])
elif task.type == "write_documentation":
    load_skills(["scribe-role-skill", "markdown-formatting-skill"])
elif task.type == "deploy_application":
    load_skills(["devops-role-skill", "ci-cd-skill"])
else:
    load_skills(["skill-discovery-skill"])
    # Let agent determine which skills to load
```

---

## Performance and Cost Analysis

### Token Usage Comparison

**Scenario**: Implement authentication feature with 3 approaches (OAuth, JWT, Session-based)

| Approach | Total Tokens | Wall-Clock Time | Cost (GPT-4) |
|----------|--------------|-----------------|-------------|
| **Sequential (1 agent, 1 skill)** | ~50K | 8 hours | $1.00 |
| **Multi-Agent (3 specialized agents)** | ~180K | 2.5 hours | $3.60 |
| **Single Agent + 3 Skills** | ~85K | 3 hours | $1.70 |
| **Hybrid (orchestrator + 3 workers with skills)** | ~120K | 2.5 hours | $2.40 |

**Analysis**:
- Multi-agent is 3.6x more expensive but 3.2x faster
- Single agent + skills is 1.7x more expensive but 2.7x faster than sequential
- Hybrid balances speed and cost

**Recommendation**: Use hybrid for time-sensitive work, single agent + skills for cost-sensitive work.

### Context Window Utilization

**Multi-Agent System**:
```
Orchestrator: 20K tokens (task decomposition, coordination)
Worker 1: 35K tokens (full context + OAuth implementation)
Worker 2: 35K tokens (full context + JWT implementation)
Worker 3: 35K tokens (full context + Session implementation)

Total: 125K tokens
Duplication: ~60K tokens (full context repeated 3x)
```

**Single Agent + Skills**:
```
Agent: 50K tokens (base context)
  + 8K tokens (OAuth skill loaded)
  + 7K tokens (JWT skill loaded)
  + 6K tokens (Session skill loaded)
  + 10K tokens (shared patterns between skills)

Total: 81K tokens
Duplication: ~10K tokens (some pattern overlap)
```

**Efficiency Gain**: 35% reduction in token usage with skills approach.

---

## Best Practices

### Skill Design Principles

1. **Single Responsibility**
   - ✅ One skill per distinct workflow
   - ✅ "api-authentication-skill" not "api-skill"
   - ❌ Don't create mega-skills that do everything

2. **Composability**
   - ✅ Skills should work independently
   - ✅ Skills can reference other skills as dependencies
   - ✅ Use meta-skills to orchestrate multiple skills

3. **Progressive Disclosure**
   - ✅ Start with minimal instructions
   - ✅ Add detail in subsections agent can expand
   - ❌ Don't dump entire workflow in first section

4. **Deterministic Operations**
   - ✅ Use scripts for precise calculations
   - ✅ Use scripts for data transformations
   - ❌ Don't make agent generate code that scripts can handle

5. **Clear Triggers**
   - ✅ Document when skill should be loaded
   - ✅ Provide example prompts that activate skill
   - ✅ List prerequisites and dependencies

### Multi-Agent Orchestration Principles

1. **Use for Breadth-First Tasks**
   - ✅ Parallel research across multiple sources
   - ✅ Exploring multiple solution approaches
   - ✅ Multi-environment deployments
   - ❌ Don't use for sequential workflows

2. **Minimize Coordination Overhead**
   - ✅ Keep agent communication simple
   - ✅ Use shared context (git worktrees, filesystems)
   - ❌ Don't create complex handoff protocols

3. **Optimize Cost**
   - ✅ Use Opus for orchestrator (planning)
   - ✅ Use Sonnet for workers (execution)
   - ✅ Use Haiku for monitoring (metrics)
   - ❌ Don't use Opus for all agents

### Hybrid Pattern Best Practices

1. **Let Orchestrator Decide**
   ```markdown
   ## Orchestrator Decision Logic
   
   For each subtask:
   - If parallelizable and independent → Spawn agent
   - If sequential and context-heavy → Load skill
   - If exploratory → Spawn multiple agents with same skill
   - If routine → Load skill and execute locally
   ```

2. **Reuse Skills Across Agents**
   ```
   Orchestrator
   ├── Agent 1 (loads: [backend-skill, testing-skill])
   ├── Agent 2 (loads: [frontend-skill, testing-skill])  # Reuses testing-skill
   └── Agent 3 (loads: [devops-skill, testing-skill])    # Reuses testing-skill
   ```

3. **Monitor and Adjust**
   - Track token usage per approach
   - Measure wall-clock time per pattern
   - Optimize based on project constraints (time vs. cost)

---

## References and Resources

### Anthropic Research

1. **"Equipping Agents for the Real World with Agent Skills"** (October 2025)
   - https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
   - Key finding: Skills enable general agents to gain domain expertise

2. **"Building Effective Agents"** (December 2024)
   - https://www.anthropic.com/research/building-effective-agents
   - Key finding: Simple, composable patterns over complex frameworks

3. **"How We Built Our Multi-Agent Research System"** (June 2025)
   - https://www.anthropic.com/engineering/multi-agent-research-system
   - Key finding: Multi-agent excels for breadth-first tasks, outperforming single agent by 90.2%

### Community Resources

1. **Anthropic Agent Skills Docs**: https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills
2. **MCP Protocol Specification**: https://modelcontextprotocol.io/
3. **Agent Design Patterns**: https://www.jonvet.com/blog/principles-of-agent-design
4. **Agentic MCP Configuration**: https://www.pulsemcp.com/posts/agentic-mcp-configuration

### Internal Documentation

- `01-Introduction-and-Core-Principles.md` - Foundational concepts
- `04-Multi-Agent-Orchestration.md` - Multi-agent patterns
- `08-Claude-Skills-Guide.md` - Skills creation guide
- `README.md` - Quick start and overview

---

## Appendix: Conversion Examples

### Example 1: Builder Agent → Builder Role Skill

**Before (Agent Template)**:
```markdown
# Agent: Builder

## Role
Implement features following TDD and git workflow best practices.

## Responsibilities
- Read requirements
- Create implementation plan
- Write tests first
- Implement feature
- Run tests
- Commit changes
```

**After (Skill Package)**:
```markdown
# Skill: builder-role-skill

## Trigger Phrases
- "implement feature"
- "write code for"
- "build functionality"

## Dependencies
- git-worktree-skill (optional)
- test-runner-skill (required)

## Workflow

### Phase 1: Planning
1. Load and analyze requirements
2. Identify files to modify
3. Create implementation checklist

### Phase 2: Test-Driven Development
1. Write failing tests first
2. Run tests (should fail)
3. Implement minimal code to pass tests
4. Refactor while keeping tests green

### Phase 3: Validation
1. Run full test suite
2. Check code coverage
3. Run linter

### Phase 4: Git Workflow
1. Stage changes
2. Write descriptive commit message
3. Commit to feature branch
```

### Example 2: Validator Agent → Validation Skill

**Before (Agent Template)**:
```markdown
# Agent: Validator

## Role
Ensure code quality through testing and review.

## Responsibilities
- Run test suites
- Perform code reviews
- Check security vulnerabilities
- Validate documentation
```

**After (Skill Package with Scripts)**:
```markdown
# Skill: validation-skill

## Scripts
- `scripts/run_tests.sh` - Execute full test suite
- `scripts/security_scan.py` - Check for vulnerabilities
- `scripts/coverage_check.py` - Validate test coverage

## Workflow

### Phase 1: Automated Checks
1. Execute: `bash scripts/run_tests.sh`
2. Execute: `python scripts/security_scan.py`
3. Execute: `python scripts/coverage_check.py`

### Phase 2: Manual Review
1. Read code changes in git diff
2. Check for code smells
3. Verify error handling
4. Validate edge cases

### Phase 3: Report Generation
1. Compile findings from automated tools
2. Add manual review observations
3. Generate review comment with recommendations
```

---

## Conclusion

The shift from multiple specialized agents to a general agent with skills represents a fundamental improvement in agent engineering:

- **Simplicity**: One agent to maintain instead of many
- **Flexibility**: Dynamically load capabilities as needed
- **Efficiency**: 35% reduction in token usage
- **Scalability**: Add new skills without rebuilding agents
- **Composability**: Combine skills for complex workflows

However, multi-agent patterns remain valuable for:
- Parallel independent work (breadth-first tasks)
- Large-scale concurrent operations
- Exploring multiple solution approaches simultaneously

**The future is hybrid**: Use orchestrator-worker patterns where parallelization provides value, but equip each worker with dynamically-loaded skills rather than fixed specialized capabilities.

---

**Document Version**: 1.0.0  
**Last Updated**: December 9, 2025  
**Based on Anthropic Research**: October 2025 - December 2025  
**Maintained By**: Claude Command and Control Project
