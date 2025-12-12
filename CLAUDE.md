# Project Context & Standards: Claude Command & Control Repository

> **Living Document Notice**: This CLAUDE.md file is a living document designed to evolve with AI agent development standards, command/agent patterns, and orchestration best practices. Version updates follow semantic versioning (MAJOR.MINOR.PATCH).

## Document Version
- **Version**: 3.0.0  
- **Last Updated**: December 1, 2025
- **Review Cycle**: Quarterly or upon significant AI agent ecosystem updates
- **Maintainer**: @enuno
- **Repository**: https://github.com/enuno/claude-command-and-control

---

## Project Mission

The **Claude Command and Control** repository provides comprehensive instruction manuals, templates, and best practices for creating Claude commands, configuring AI agents, and orchestrating multi-agent workflows. This project serves as the definitive resource for building robust, production-ready AI agent systems.

---

## Core Principles

### Skills-First Development Philosophy
- **Skills as Primary Building Block**: Portable workflow automation units that agents dynamically load
- **General Agent + Skills**: Default to single agent with skill loading; use multi-agent only for parallelization
- **Progressive Disclosure**: Load only what's needed per task phase (35% token reduction vs multi-agent)
- **Command-Centric Design**: Slash commands are primary interface for agent workflows
- **Composable Capabilities**: Combine skills for complex workflows
- **Template-Driven**: Reusable patterns captured as production-tested templates
- **Documentation as Protocol**: Instructions are executable specifications, not mere guidelines

### Agent Development Standards
- **Role Specialization** (Skills): Capabilities packaged as skills (builder-skill, validator-skill, etc.)
- **Multi-Agent When Needed**: Use orchestrator-worker pattern only for parallel, independent tasks
- **Hybrid Architecture**: Orchestrators spawn workers that each load appropriate skills
- **Context Efficiency**: Skills maintain context better than separate agent instances

### Repository Structure Standards
- **Modular Organization**: Separate directories for commands, agents, skills, and documentation
- **Template Library**: Production-ready templates for immediate use
- **Best Practice Documentation**: Eleven manuals covering all aspects
- **Integration System**: Automated content ingestion and quality validation
- **Maintenance System**: Proactive staleness detection and update proposals

---

## Security & Quality Standards

### Command Security
- **Explicit Permission Scopes**: Define `allowed-tools` restrictively for each command
- **Input Validation**: Sanitize all dynamic values and user inputs
- **Approval Gates**: Human confirmation required for destructive operations
- **Audit Logging**: Log all command executions with timestamps and parameters
- **Version Control**: Semantic versioning for all command changes (1.0 → 1.1 → 2.0)

### Agent Security
- **Least Privilege**: Grant minimum necessary permissions per agent role
- **Context Isolation**: Prevent context pollution between agent interactions
- **Security Boundaries**: Clear definitions of what each agent can/cannot access
- **Handoff Protocols**: Structured communication patterns for agent collaboration
- **Memory Management**: Explicit memory scoping and cleanup procedures

### Multi-Agent Orchestration Security
- **Worktree Isolation**: Git worktrees provide filesystem separation
- **Container Option**: Full process isolation for security-critical workflows
- **Resource Quotas**: Limit CPU/memory/disk per agent
- **Permission Inheritance**: Explicit permission models for spawned agents
- **Audit Trails**: Complete logging of all agent actions and communications

---

## Repository Components

### Core Documentation (7 Manuals)
1. **01-Introduction-and-Core-Principles.md** - Foundational philosophy and architecture
2. **02-Individual-Command-Creation.md** - Technical specifications for slash commands
3. **03-Individual-Agent-Configuration.md** - Agent setup and configuration
4. **04-Multi-Agent-Orchestration.md** - Coordinating multiple agents
5. **05-Testing-and-Quality-Assurance.md** - Validation strategies
6. **06-Production-Deployment-and-Maintenance.md** - Operations and monitoring
7. **07-Quick-Reference-and-Templates.md** - Boilerplate and cheat sheets
8. **08-Claude-Skills-Guide.md** - Skills creation and integration

### Template Library Structure
```
templates/
├── commands/              # Slash command templates
│   ├── core/             # Core workflow commands
│   ├── quality/          # QA and testing commands
│   ├── utility/          # Helper commands
│   └── orchestration/    # Multi-agent commands
├── agents/               # Agent configuration templates
│   ├── architect.md      # System design agent
│   ├── builder.md        # Implementation agent
│   ├── validator.md      # Testing agent
│   ├── scribe.md         # Documentation agent
│   ├── devops.md         # Infrastructure agent
│   └── orchestration/    # Orchestration agents
└── skills/               # Reusable workflow skills
    ├── minimal-skill-template.md
    ├── standard-skill-template.md
    └── comprehensive-skill-template.md
```

### Integration & Maintenance Systems
```
INTEGRATION/
├── incoming/      # New content drop zone
├── processed/     # Successfully integrated files
├── failed/        # Files that failed validation
└── logs/          # Integration audit trails

MAINTENANCE/
├── reports/       # Staleness analysis and proposals
└── todo/          # Action items for updates
```

---

## Command Development Standards

### Command Anatomy
```markdown
# Command Name
Version: 1.0
Description: Clear one-line description

## Purpose
Detailed explanation of what this command does

## Usage
/command-name [arguments]

## Parameters
- param1: Description and type
- param2: Description and type (optional)

## Permissions
allowed-tools: ["Read", "Search", "Edit"]

## Examples
Example usage scenarios

## Error Handling
Common errors and resolutions

## Version History
- 1.0: Initial release
```

### Command Naming Conventions
- Use verb-noun pattern: `/start-session`, `/prepare-pr`, `/deploy-check`
- Lowercase with hyphens (kebab-case)
- Descriptive and action-oriented
- Maximum 3 words for clarity
- Avoid abbreviations unless universal

### Command Categories
1. **Core Workflow**: start-session, close-session, plan, summarize
2. **Quality Assurance**: test-all, lint-fixes, error-report, deps-update
3. **Utility**: docs, search, cleanup, env-check
4. **Integration**: integration-scan, maintenance-scan
5. **Orchestration**: orchestrate-feature, spawn-agents, coordinate-workflow

---

## Agent Development Standards

### Agent Configuration Template
```yaml
name: "Agent Name"
role: "Specific Role"
model: "claude-sonnet-4" or "claude-opus-4"
version: "1.0"

permissions:
  allowed-tools: ["Read", "Search", "Edit", "Test"]
  restricted-paths: ["/secrets", "/credentials"]
  
context:
  scope: "Focused area of responsibility"
  memory: "Explicit memory management strategy"
  
responsibilities:
  - Primary responsibility 1
  - Primary responsibility 2
  
collaboration:
  handoff-protocol: "Clear communication pattern"
  dependencies: ["Agent names it depends on"]
```

### Agent Role Taxonomy
| Agent | Model | Purpose | Key Capabilities |
|-------|-------|---------|------------------|
| **Architect** | Opus 4 | System design | Architecture assessment, planning docs, design decisions |
| **Builder** | Sonnet 4 | Implementation | Feature development, TDD, git workflow |
| **Validator** | Sonnet 4 | Testing & review | Test creation, code review, security audits |
| **Scribe** | Sonnet 4 | Documentation | API docs, guides, architecture docs |
| **DevOps** | Sonnet 4 | Infrastructure | CI/CD, IaC, monitoring setup |
| **Researcher** | Sonnet 4 | Technical research | Tech evaluation, feasibility studies |
| **Integration Manager** | Sonnet 4 | Content ingestion | File categorization, quality validation |

### Orchestration Agent Roles
| Agent | Model | Purpose | Optimization |
|-------|-------|---------|--------------|
| **Orchestrator Lead** | Opus 4 | Workflow coordination | High capability for planning |
| **Task Coordinator** | Sonnet 4 | Dependency management | Efficient for coordination |
| **Integration Orchestrator** | Sonnet 4 | Result merging | Efficient for integration |
| **Monitoring Agent** | Haiku 3.5 | Progress tracking | Minimal cost for monitoring |

---

## Multi-Agent Orchestration Patterns

**IMPORTANT**: Anthropic's latest research shows that for most workflows, a **single general agent with skills** is more efficient than multiple specialized agents. This section focuses on the specific scenarios where multi-agent orchestration provides value.

### When to Use Multi-Agent

✅ **Use Multi-Agent When:**
1. **Breadth-First Parallelization** - Research across independent sources, exploring multiple solution approaches
2. **Scale Requires Concurrency** - Large codebases needing parallel analysis, high-volume data processing
3. **Comparison Through Diversity** - Want multiple implementations to compare, leveraging stochastic variation

❌ **Don't Use Multi-Agent For:**
- Sequential workflows (use single agent + skills)
- Context-heavy tasks (use single agent + progressive skill loading)
- Standard development tasks (feature implementation, bug fixes, documentation, testing)

### Decision Matrix

| Task Type | Sequential? | Parallel? | Recommended Approach |
|-----------|-------------|-----------|--------------------|
| Bug fix | ✓ | ✗ | Single agent + builder skill |
| Feature (small) | ✓ | ✗ | Single agent + builder + test skills |
| Feature (large) | ✗ | ✓ | Multi-agent with skills per agent |
| Research | ✗ | ✓ | Multi-agent (breadth-first) |
| Refactoring | ✓ | ✗ | Single agent + refactor skill |
| Multiple approaches | ✗ | ✓ | Multi-agent + same skill per agent |

---

### The Hybrid AI Agent Development Pattern
```
┌─────────────────────────────────────────────┐
│   Lead Orchestrator (Claude Opus 4)        │
│   • Decomposes feature into parallel tasks │
│   • Spawns specialized agents in worktrees │
│   • Monitors progress and coordinates       │
│   • Synthesizes results and resolves        │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┼───────┬────────┬────────┐
       ▼       ▼       ▼        ▼        ▼
   Architect Builder Builder Validator ...
   (worktree) (worktree) (worktree) (worktree)
```

### Orchestration Workflow
1. **Planning**: `/orchestrate-feature` - Create MULTI_AGENT_PLAN.md
2. **Spawning**: `/spawn-agents` - Instantiate agents in isolated worktrees
3. **Coordination**: `/coordinate-workflow` - Monitor progress, resolve blockers
4. **Validation**: `/quality-gate` - Multi-stage validation pipeline
5. **Integration**: Merge results from parallel workstreams

### Decision Matrix: When to Use Orchestration
| Scenario | Use Orchestration? | Pattern |
|----------|-------------------|---------|
| Simple bug fix (< 100 lines) | ❌ No | Single Builder |
| Feature < 500 lines | ❌ No | Builder + Validator |
| Complex feature, multiple approaches | ✅ Yes | Parallel builders + comparison |
| Large refactoring | ✅ Yes | Architect + parallel builders |
| Full-stack feature | ✅ Yes | Specialized agents per layer |
| Technical POC | ✅ Yes | Parallel researchers |

---

## Skills Development Standards

### The Skills-First Paradigm

**Skills** are portable workflow automation units that represent the **primary building block** for AI agent capabilities:

```
Commands < Skills < Agents < Multi-Agent Systems
```

- **Commands**: Quick session shortcuts (`/test`, `/pr`)
- **Skills**: Reusable workflow automation (builder-skill, validator-skill)
- **Agents**: General-purpose with skill loading capability
- **Multi-Agent**: Orchestration for parallelization

### Why Skills Win

| Aspect | Multiple Agents | Single Agent + Skills |
|--------|-----------------|---------------------|
| Maintenance | Update N agents | Update 1 agent + M skills |
| Token Efficiency | 15x baseline | 5-7x baseline (35% savings) |
| Context Management | Distributed, duplicated | Centralized, progressive |
| Composability | Agent coordination overhead | Native skill composition |
| Sharing | Copy entire agent configs | Share skill packages |
| Versioning | N agent versions | 1 agent + M skill versions |

### When to Use Each

**Skills (Default Choice)**:
- Any sequential workflow
- Standard development tasks
- Depth-first problem solving
- Context-heavy operations

**Multi-Agent (Special Cases)**:
- Parallel independent research
- Exploring multiple approaches
- Breadth-first tasks
- Scale requiring concurrency

**Hybrid (Complex Features)**:
- Orchestrator + workers with skills
- Best of both worlds

### Skill Templates
- **Minimal**: `templates/skills/minimal-skill-template.md` (simple workflows)
- **Standard**: `templates/skills/standard-skill-template.md` (moderate complexity)
- **Comprehensive**: `templates/skills/comprehensive-skill-template.md` (complex workflows)

### Pre-Built Skills
- **agent-skill-bridge**: Integrates agents and skills
- **content-research-writer**: Writing with research and citations
- **documentation-update**: Update repository tables and indices
- **file-categorization**: Categorize files by type
- **root-cause-tracing**: Systematic debugging
- **skill-creator**: Creates new skills
- **skill-orchestrator**: Coordinates multiple skills
- **subagent-driven-development**: Execute plans with fresh subagents
- **using-git-worktrees**: Isolated workspace management
- **using-superpowers**: Meta-skill for skill discovery

### Orchestration Skills
- **multi-agent-planner-skill**: Automated MULTI_AGENT_PLAN.md generation
- **parallel-executor-skill**: Concurrent task execution
- **worktree-manager-skill**: Git worktree lifecycle management
- **agent-communication-skill**: Inter-agent messaging and handoffs

---

## Testing & Quality Assurance

### Command Testing Checklist
- [ ] Command executes successfully
- [ ] Input validation works correctly
- [ ] Error handling covers edge cases
- [ ] Permissions are restrictive enough
- [ ] Documentation is complete
- [ ] Examples are accurate

### Agent Testing Checklist
- [ ] Agent follows role boundaries
- [ ] Context isolation works properly
- [ ] Handoff protocols function correctly
- [ ] Memory management prevents leaks
- [ ] Permissions are appropriate
- [ ] Collaboration patterns are clear

### Orchestration Testing Checklist
- [ ] Task decomposition is logical
- [ ] Dependencies are correctly mapped
- [ ] Parallel execution works without conflicts
- [ ] Worktree isolation is effective
- [ ] Result synthesis is accurate
- [ ] Error recovery mechanisms function

### Integration System Testing
- [ ] File categorization is accurate
- [ ] Quality validation catches issues
- [ ] Audit trails are complete
- [ ] Documentation updates are correct
- [ ] Failed files are properly quarantined

---

## Version Control & Collaboration

### Git Workflow
- **Main Branch**: Production-ready templates and documentation
- **Feature Branches**: `feature/command-name` or `feature/agent-role`
- **Documentation Branches**: `docs/section-name`
- **Integration Branches**: `integration/content-batch-YYYY-MM-DD`

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New command, agent, or skill
- `fix`: Bug fix or correction
- `docs`: Documentation updates
- `refactor`: Code restructuring
- `test`: Test additions or updates
- `chore`: Maintenance tasks

### Pull Request Template
```markdown
## Type of Change
- [ ] New Command
- [ ] New Agent
- [ ] New Skill
- [ ] Documentation Update
- [ ] Bug Fix

## Description
Clear description of changes

## Testing Done
How this was tested

## Checklist
- [ ] Documentation updated
- [ ] Examples provided
- [ ] Security reviewed
- [ ] Templates validated
```

---

## Integration & Maintenance Workflows

### Integration Workflow
1. **Drop Files**: Place new content in `/INTEGRATION/incoming/`
2. **Scan**: Run `/integration-scan` to categorize and validate
3. **Review**: Check scan report in `/INTEGRATION/logs/`
4. **Process**: Move validated files to proper locations
5. **Update**: Update documentation tables and indices
6. **Archive**: Move to `/INTEGRATION/processed/`

### Maintenance Workflow
1. **Scan**: Run `/maintenance-scan` to identify stale files (>30 days)
2. **Research**: Investigate latest best practices for flagged files
3. **Propose**: Generate update proposals in `/MAINTENANCE/reports/`
4. **Review**: Evaluate proposals for accuracy and relevance
5. **Update**: Apply approved changes with version bumps
6. **Document**: Update CHANGELOG.md with rationale

---

## Living Documentation Standards

### Documentation Maintenance
- **Quarterly Reviews**: Align with AI ecosystem updates
- **Version Control**: Treat docs like code with semantic versioning
- **Pull Request Workflow**: All changes via reviewed PRs
- **CHANGELOG.md**: Track all significant changes
- **ADRs (Architecture Decision Records)**: Document major decisions

### Documentation Categories
1. **Core Manuals**: Comprehensive instruction sets (7 manuals)
2. **Templates**: Production-ready boilerplate code
3. **Examples**: Working implementations with explanations
4. **Quick Reference**: Cheat sheets and command lists
5. **Best Practices**: Proven patterns and anti-patterns

### Evolution Strategy
- Track Claude ecosystem developments
- Incorporate community feedback
- Research emerging patterns
- Remove deprecated practices
- Benchmark effectiveness metrics

---

## AI Agent Optimization

### CLAUDE.md Best Practices
- Keep file under 100KB for efficient loading
- Use clear section headers for navigation
- Provide concrete bash command examples
- Include decision matrices and checklists
- Document common error resolutions
- Update based on agent interaction patterns

### Tool Use Conventions
- All custom commands in `.claude/commands/`
- All agent configs in `.claude/agents/` or project-specific locations
- All skills in `skills/` directory
- Version control all agent instructions
- Test workflows with real agents regularly

### Agent Limitations & Safety
- Agents cannot access production secrets
- Destructive operations require human approval
- Default to read-only access
- Escalate security-sensitive changes
- Implement audit logging for all actions
- Monitor agent behavior for anomalies

---

## Quick Reference

### Common Commands
```bash
# Development Session
/start-session           # Initialize session with context
/plan                    # Generate or update project plans
/close-session          # End session with summary

# Quality Assurance
/test-all               # Execute comprehensive test suite
/lint-fixes             # Auto-fix code style issues
/deps-update            # Audit and update dependencies

# Multi-Agent Orchestration
/orchestrate-feature    # Multi-agent feature development
/spawn-agents           # Instantiate agents in worktrees
/coordinate-workflow    # Real-time progress tracking
/quality-gate           # Multi-stage validation pipeline

# Integration & Maintenance
/integration-scan       # Scan incoming files
/maintenance-scan       # Identify stale content

# Utility
/docs                   # Generate documentation
/search                 # Search codebase
/cleanup                # Maintain workspace health
```

### Skills-First Workflows

**Feature Implementation** (Single Agent + Skills):
```bash
# Agent loads builder-skill dynamically
1. Analyze requirements
2. Agent loads: builder-skill, validator-skill
3. Implement with TDD workflow
4. Agent loads: documentation-skill
5. Generate docs and commit
# Result: 35% fewer tokens vs multi-agent approach
```

**Bug Investigation** (Progressive Skill Loading):
```bash
# Agent progressively loads skills as needed
1. Agent loads: root-cause-tracing-skill
2. Identify issue location
3. Agent loads: builder-skill for fix
4. Agent loads: validator-skill for tests
5. Verify fix and commit
# Context maintained throughout - no agent switching
```

**Parallel Research** (Multi-Agent with Skills):
```bash
# Hybrid approach: Each agent loads research-skill
1. Orchestrator spawns 3 researcher agents
2. Each loads: researcher-skill + domain-specific context
3. Parallel investigation of alternatives
4. Orchestrator synthesizes findings
# Parallel execution + skills efficiency
```

### File Structure
```
claude-command-and-control/
├── .claude/
│   ├── commands/          # Active commands
│   └── agents/            # Active agents
├── docs/
│   └── best-practices/    # 7 core manuals
├── templates/
│   ├── commands/          # Command templates
│   ├── agents/            # Agent templates
│   └── skills/            # Skill templates
├── commands-templates/    # Production command examples
├── agents-templates/      # Production agent examples
├── skills-templates/      # Production skill examples
├── INTEGRATION/           # Content ingestion system
├── MAINTENANCE/           # Repository health system
├── CLAUDE.md              # This file
├── README.md              # Project overview
└── DEVELOPMENT_PLAN.md    # Roadmap and backlog
```

---

## Success Metrics

### Organizational Impact
- **28.4% reduction** in operational costs (efficient model selection)
- **96.7% maintained performance** quality (optimized architectures)
- **40% faster** feature delivery (multi-agent parallelization)
- **60% reduction** in code review time (automated validation)
- **Zero security incidents** (following security best practices)

### Repository Health Metrics
- Template usage frequency
- Integration success rate
- Maintenance staleness scores
- Community contribution rate
- Documentation freshness
- Command/agent effectiveness

---

## References & Resources

### Core Resources
- [Repository](https://github.com/enuno/claude-command-and-control)
- [Anthropic Claude Documentation](https://docs.anthropic.com)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Community
- [GitHub Discussions](https://github.com/enuno/claude-command-and-control/discussions)
- [Issue Tracker](https://github.com/enuno/claude-command-and-control/issues)
- [DeepWiki](https://deepwiki.com/enuno/claude-command-and-control)

### Standards
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [12-Factor App](https://12factor.net/)

---

**Note**: This document evolves with the AI agent ecosystem. Review quarterly or upon significant updates. Contributions via pull requests are encouraged.

**Status**: ✅ Production Ready  
**Version**: 3.0.0  
**Last Updated**: December 1, 2025  
**Maintained By**: [@enuno](https://github.com/enuno)
