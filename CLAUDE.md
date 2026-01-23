# Project Context & Standards: Claude Command & Control Repository

> **Living Document Notice**: This CLAUDE.md file is a living document designed to evolve with AI agent development standards, command/agent patterns, and orchestration best practices. Version updates follow semantic versioning (MAJOR.MINOR.PATCH).

## Document Version
- **Version**: 4.0.0
- **Last Updated**: January 23, 2026
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
- **Documentation as Protocol**: Instructions are executable specifications

### Agent Development Standards
- **Role Specialization** (Skills): Capabilities packaged as skills (builder-skill, validator-skill, etc.)
- **Multi-Agent When Needed**: Use orchestrator-worker pattern only for parallel, independent tasks
- **Hybrid Architecture**: Orchestrators spawn workers that each load appropriate skills
- **Context Efficiency**: Skills maintain context better than separate agent instances

### Repository Structure Standards
- **Modular Organization**: Separate directories for commands, agents, skills, and documentation
- **Template Library**: Production-ready templates for immediate use
- **Best Practice Documentation**: Nine comprehensive manuals covering all aspects
- **Integration System**: Automated content ingestion and quality validation
- **Maintenance System**: Proactive staleness detection and update proposals
- **Advanced Orchestration**: Enterprise-grade patterns for complex multi-agent workflows

---

## Security & Quality Standards

### Command Security
- **Explicit Permission Scopes**: Define `allowed-tools` restrictively for each command
- **Input Validation**: Sanitize all dynamic values and user inputs
- **Approval Gates**: Human confirmation required for destructive operations
- **Audit Logging**: Log all command executions with timestamps and parameters
- **Version Control**: Semantic versioning for all command changes

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

## Hooks for Quality Assurance and Policy Enforcement

> **Full Documentation**: See [docs/claude-reference/hooks-overview.md](docs/claude-reference/hooks-overview.md) and [Document 05](docs/best-practices/05-Testing-and-Quality-Assurance.md#production-grade-hooks-for-quality-assurance)

### Overview
Claude Code hooks provide deterministic, event-driven policy enforcement for agentic workflows. Unlike prompts, hooks execute with the reliability of shell scripts.

### Key Benefits
- **Mandatory Execution**: If configured, hooks WILL run
- **Blocking Semantics**: Exit code 2 halts workflow
- **Production Proven**: 40% → 85% refactor success rate, 20% → 84% TDD activation

### Hook Lifecycle Events
**Operational**: PreToolUse, PostToolUse, PermissionRequest  
**Interaction**: UserPromptSubmit, Notification, Stop  
**Specialized**: SubagentStop, SessionStart, SessionEnd, PreCompact

### Quick Example
```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')
if echo "$COMMAND" | grep -E "(rm -rf /|sudo)" > /dev/null; then
  echo "❌ Dangerous command blocked" >&2
  exit 2
fi
exit 0
```

---

## Compliance and Regulatory Alignment

> **Full Documentation**: See [docs/claude-reference/compliance.md](docs/claude-reference/compliance.md) and [Document 06](docs/best-practices/06-Production-Deployment-and-Maintenance.md#compliance-requirements)

Production deployments align with SOC 2, HIPAA, and GDPR through systematic audit trails, access controls, and governance frameworks.

### Supported Standards
- **SOC 2 Type II**: Audit trails, access controls, change management workflows
- **HIPAA**: PHI redaction, encryption (AES-256), access controls
- **GDPR**: Data residency (EU), right to deletion, consent management

### Audit Trail Structure
All tool executions logged to `.claude/audit.jsonl` + remote SIEM with timestamp, user, action, outcome, and policy checks.

---

## Repository Components

### Core Documentation (9 Manuals)
1. **01-Introduction-and-Core-Principles.md** - Foundational philosophy
2. **02-Individual-Command-Creation.md** - Command specifications
3. **03-Individual-Agent-Configuration.md** - Agent setup
4. **04-Multi-Agent-Orchestration.md** - Multi-agent coordination
5. **05-Testing-and-Quality-Assurance.md** - Validation strategies
6. **06-Production-Deployment-and-Maintenance.md** - Operations and monitoring
7. **07-Quick-Reference-and-Templates.md** - Boilerplate and cheat sheets
8. **08-Claude-Skills-Guide.md** - Skills creation
9. **17-Advanced-Orchestration-Patterns.md** - Enterprise DAG, state management, resilience

### Template Library
```
templates/
├── commands/              # Slash command templates
│   ├── core/             # Core workflow commands
│   ├── quality/          # QA and testing commands
│   ├── utility/          # Helper commands
│   └── orchestration/    # Multi-agent commands
├── agents/               # Agent configuration templates
└── skills/               # Reusable workflow skills
```

### Integration & Maintenance Systems
```
INTEGRATION/
├── incoming/      # New content drop zone
├── processed/     # Successfully integrated files
└── logs/          # Integration audit trails

MAINTENANCE/
├── reports/       # Staleness analysis and proposals
└── todo/          # Action items for updates
```

---

## Command Development Standards

### Three-Tier Command Hierarchy
1. **User-Level** (`~/.claude/commands/`): Personal productivity tools
2. **Project-Level** (`.claude/commands/`): Team-shared workflows
3. **Organization-Wide** (system CLAUDE.md): Company-wide standards

### Progressive Disclosure Pattern
Keep trigger tables in CLAUDE.md, externalize details to `/docs/claude-reference/`:
```markdown
# .claude/commands/deploy.md
See `.claude/rules/deployment.md` for deployment procedures.
See `.claude/rules/security.md` for security validation.
```

### Command Naming Conventions
- Use verb-noun pattern: `/start-session`, `/prepare-pr`, `/deploy-check`
- Lowercase with hyphens (kebab-case)
- Maximum 3 words for clarity

---

## Agent Development Standards

### Agent Role Taxonomy
| Agent | Model | Purpose | Key Capabilities |
|-------|-------|---------|------------------|
| **Architect** | Opus 4 | System design | Architecture assessment, planning docs |
| **Builder** | Sonnet 4 | Implementation | Feature development, TDD, git workflow |
| **Validator** | Sonnet 4 | Testing & review | Test creation, code review, security audits |
| **Scribe** | Sonnet 4 | Documentation | API docs, guides, architecture docs |
| **DevOps** | Sonnet 4 | Infrastructure | CI/CD, IaC, monitoring setup |

---

## Multi-Agent Orchestration Patterns

> **Full Documentation**: See [docs/claude-reference/advanced-orchestration.md](docs/claude-reference/advanced-orchestration.md) and [Document 17](docs/best-practices/17-Advanced-Orchestration-Patterns.md)

**IMPORTANT**: For most workflows, use a **single general agent with skills** instead of multiple specialized agents.

### When to Use Multi-Agent
✅ **Use When:**
- Breadth-first parallelization (research across independent sources)
- Scale requires concurrency (large codebase parallel analysis)
- Comparison through diversity (multiple implementations to compare)

❌ **Don't Use For:**
- Sequential workflows (use single agent + skills)
- Context-heavy tasks (use progressive skill loading)
- Standard development (features, bugs, docs, tests)

### Decision Matrix
| Task Type | Sequential? | Parallel? | Recommended Approach |
|-----------|-------------|-----------|----------------------|
| Bug fix | ✓ | ✗ | Single agent + builder skill |
| Small feature | ✓ | ✗ | Single agent + builder + test skills |
| Large feature | ✗ | ✓ | Multi-agent with skills per agent |
| Research | ✗ | ✓ | Multi-agent (breadth-first) |
| Refactoring | ✓ | ✗ | Single agent + refactor skill |

### Advanced Orchestration Patterns
**Available patterns** (see full documentation for details):
1. **Complex Dependency Management**: DAG execution, cycle detection, critical path analysis
2. **Dynamic Agent Management**: Agent pools, auto-scaling, health monitoring
3. **State Management**: CRDTs, event sourcing, atomic operations
4. **Advanced Error Handling**: Circuit breaker, saga pattern, bulkhead isolation
5. **Performance Optimization**: Token profiling, bottleneck detection, cost analysis

---

## Observability and Monitoring

> **Full Documentation**: See [docs/claude-reference/observability.md](docs/claude-reference/observability.md) and [Document 06](docs/best-practices/06-Production-Deployment-and-Maintenance.md#observability-and-feedback-loops)

### Production Observability Stack
**OpenTelemetry + Prometheus + SigNoz Integration** for distributed tracing, metrics collection, and dashboard visualization.

### Key Performance Indicators
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Response Latency** | < 3s (p95) | p95 > 5s |
| **Token Usage** | < 15K/session | > 25K/session |
| **Success Rate** | > 95% | < 90% |
| **Cost per Task** | < $0.50 | > $2.00 |
| **Hook Execution** | < 1s (p95) | p95 > 3s |
| **Policy Compliance** | 100% | < 99% |

### Decision Confidence Scores
Track margin between chosen option and alternatives:
- **Margin > 0.20**: High confidence
- **Margin < 0.10**: Low confidence, needs context
- **Margin < 0.05**: Critical, needs human guidance

---

## Skills Development Standards

### The Skills-First Paradigm
**Skills** are the primary building block for AI agent capabilities:
```
Commands < Skills < Agents < Multi-Agent Systems
```

### Why Skills Win
| Aspect | Multiple Agents | Single Agent + Skills |
|--------|-----------------|----------------------|
| Maintenance | Update N agents | Update 1 agent + M skills |
| Token Efficiency | 15x baseline | 5-7x baseline (35% savings) |
| Context Management | Distributed, duplicated | Centralized, progressive |
| Composability | Coordination overhead | Native skill composition |

### Skill Templates
- **Minimal**: `templates/skills/minimal-skill-template.md` (simple workflows)
- **Standard**: `templates/skills/standard-skill-template.md` (moderate complexity)
- **Comprehensive**: `templates/skills/comprehensive-skill-template.md` (complex workflows)

### Pre-Built Skills
**Core Skills:**
- **builder-skill**: Feature development with TDD workflow
- **validator-skill**: Test creation and code review
- **documentation-skill**: API docs and guides
- **root-cause-tracing-skill**: Systematic debugging
- **using-git-worktrees-skill**: Isolated workspace management

**Orchestration Skills:**
- **task-dependency-resolver-skill**: DAG execution, cycle detection
- **agent-pool-manager-skill**: Auto-scaling, health monitoring
- **distributed-state-sync-skill**: CRDT implementations
- **saga-pattern-skill**: Compensating transactions
- **circuit-breaker-skill**: Cascading failure prevention
- **performance-profiler-skill**: Token usage analysis

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

---

## Version Control & Collaboration

### Git Workflow
- **Main Branch**: Production-ready templates and documentation
- **Feature Branches**: `feature/command-name` or `feature/agent-role`
- **Documentation Branches**: `docs/section-name`

### Commit Message Format
```
type(scope): subject

Types: feat, fix, docs, refactor, test, chore
```

---

## Integration & Maintenance Workflows

### Integration Workflow
1. Drop files in `/INTEGRATION/incoming/`
2. Run `/integration-scan` to categorize and validate
3. Review scan report in `/INTEGRATION/logs/`
4. Process validated files to proper locations
5. Update documentation tables and indices
6. Archive to `/INTEGRATION/processed/`

### Maintenance Workflow
1. Run `/maintenance-scan` to identify stale files (>30 days)
2. Research latest best practices
3. Generate update proposals in `/MAINTENANCE/reports/`
4. Evaluate proposals for accuracy
5. Apply approved changes with version bumps
6. Update CHANGELOG.md

---

## Living Documentation Standards

### Documentation Maintenance
- **Quarterly Reviews**: Align with AI ecosystem updates
- **Version Control**: Semantic versioning for all changes
- **Pull Request Workflow**: All changes via reviewed PRs
- **CHANGELOG.md**: Track all significant changes

### Evolution Strategy
- Track Claude ecosystem developments
- Incorporate community feedback
- Research emerging patterns
- Remove deprecated practices
- Benchmark effectiveness metrics

---

## AI Agent Optimization

### CLAUDE.md Best Practices
- Keep file under 40k tokens for efficient loading
- Use clear section headers for navigation
- Provide concrete bash command examples
- Include decision matrices and checklists
- Document common error resolutions

### Tool Use Conventions
- All custom commands in `.claude/commands/`
- All agent configs in `.claude/agents/`
- All skills in `skills/` directory
- Version control all agent instructions

### Agent Limitations & Safety
- Agents cannot access production secrets
- Destructive operations require human approval
- Default to read-only access
- Escalate security-sensitive changes
- Implement audit logging for all actions

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
```
1. Analyze requirements
2. Agent loads: builder-skill, validator-skill
3. Implement with TDD workflow
4. Agent loads: documentation-skill
5. Generate docs and commit
Result: 35% fewer tokens vs multi-agent
```

**Bug Investigation** (Progressive Skill Loading):
```
1. Agent loads: root-cause-tracing-skill
2. Identify issue location
3. Agent loads: builder-skill for fix
4. Agent loads: validator-skill for tests
5. Verify fix and commit
Result: Context maintained throughout
```

### File Structure
```
claude-command-and-control/
├── .claude/
│   ├── commands/          # Active commands
│   └── agents/            # Active agents
├── docs/
│   ├── best-practices/    # 9 core manuals
│   └── claude-reference/  # Externalized CLAUDE.md content
├── templates/
│   ├── commands/          # Command templates
│   ├── agents/            # Agent templates
│   └── skills/            # Skill templates
├── INTEGRATION/           # Content ingestion system
├── MAINTENANCE/           # Repository health system
├── CLAUDE.md              # This file
└── README.md              # Project overview
```

---

## GitHub Actions Automation

> **Full Documentation**: See [docs/claude-reference/github-actions.md](docs/claude-reference/github-actions.md) or use `Skill("github-actions-reference")`

The repository includes comprehensive GitHub Actions workflows for automated maintenance, security scanning, and content integration.

### Workflow Overview
**Core Automation:**
- **Maintenance Scan**: Monthly repository health checks (~$0.03/month)
- **Integration Pipeline**: Hourly content processing (~$1.80/month)
- **Research Monitor**: Weekly research tracking (~$0.06/month)

**Security & Quality:**
- **Security Scanning**: Daily CodeQL, TruffleHog, ShellCheck (Free)
- **PR Validation**: Automated quality checks (~$1.20/month)
- **Link Checker**: Weekly link validation (Free)

**Total Cost**: ~$3.09/month Anthropic API + Free GitHub Actions

### Quick Setup
Configure `ANTHROPIC_API_KEY` secret in repository settings for workflow authentication.

---

## Success Metrics

### Organizational Impact
- **28.4% reduction** in operational costs (efficient model selection)
- **96.7% maintained performance** quality
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

## Enhanced Documentation References

The following documents have been significantly enhanced with production-grade patterns from 100+ enterprise deployments:

- **Document 02**: Three-tier command hierarchy, progressive disclosure, semantic versioning
- **Document 05**: Production-grade hooks (11 events, 3 case studies, security analysis)
- **Document 06**: Observability (OpenTelemetry + Prometheus), compliance (SOC 2, HIPAA, GDPR)
- **Document 07**: Command/hook/checklist templates for rapid development
- **Document 15**: Advanced orchestration (DAG, agent pools, CRDTs, circuit breakers)

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

### Standards
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

**Status**: ✅ Production Ready (Optimized for < 40k tokens)  
**Version**: 4.0.0 (Major restructuring with progressive disclosure)  
**Last Updated**: January 23, 2026  
**Maintained By**: [@enuno](https://github.com/enuno)
