# Individual Agent Configuration: Setup and Best Practices

## Purpose
This document explains how to configure Claude agents for specialized, efficient, and secure automation. It covers agent role assignment, configuration file structure, context management, and permission settings.

## Agent Role Specialization
Assign distinct responsibilities to each agent:
- Architect: Planning, system design
- Builder: Code implementation and modification
- Validator: Testing and review
- Scribe: Documentation
- Researcher: Information gathering

Clearly define agents’ scope to avoid overlap and enable modular workflows.

## Agent Configuration Files

### AGENTS.md (Central Authority)
- Organization-wide standards for all agents
- Defines agent roles, conventions, code style, tooling permissions, and security requirements
- Reference in project-specific files via imports or links

### CLAUDE.md (Tool-Specific Agent Config)
- Imports universal guidelines from AGENTS.md
- Tool-specific agent instructions, allowed actions, and integration points
- Workflow examples with agent handoff and collaboration flows
- Tool use and permission boundaries (e.g., allowed-tools sections)
- Context management policies

### Example CLAUDE.md Structure
```markdown
# Claude Agent Configuration

## Import Universal Standards
Refer to AGENTS.md for core policies.

## Agent Roles and Permissions
- builder: Bash(git:*), Edit, Read, Test
- validator: Test, Review, Read

## Workflow Example
Builder starts: implements feature → validator: tests & reviews output → scribe documents results

## Context Management

### Context Engineering Principles
Apply context engineering to optimize agent effectiveness:
- **Minimize tokens, maximize signal**: Find smallest set of high-signal tokens
- **Progressive disclosure**: Load context in layers (index → context → details)
- **Just-in-time retrieval**: Load full context only when task requires it
- **Waste ratio target**: >80% of consumed context should be relevant

### Practical Guidelines
- Use only relevant recent commits, source files, and planning docs as agent context
- Inject summaries or key files with `@` context reference
- Summarize or trim context for long sessions (compaction)
- Isolate context per agent instance for multi-agent workflows
- Use structured note-taking (NOTES.md) for long-horizon task continuity

## Security and Audit
- Grant least privilege; specify allowed-tools per role
- Track agent actions in audit logs
```

## Memory and Persistence
(For agents with cross-session awareness)
- Summaries saved after each session or major change
- Isolate memory per project for data hygiene
- Provide user controls to review and update memory summaries
- Never persist sensitive tokens or credentials

## Testing Integration
- Define required test coverage in CLAUDE.md
- Assign validator or “test” agent for automated pre-deployment checks
- Require agents to validate their own outputs where feasible

## Anti-Patterns
- Do not overload a single agent with conflicting responsibilities
- Avoid unscoped context (can pollute and destabilize agent behavior)
- Do not grant unnecessary shell/network permissions
- Ensure explicit review before agent actions modify production environments

---

**See Also:**
- Document 4 for instructions on orchestrating multiple agents within a project
- [LLM Production Optimization](14-LLM-Production-Optimization.md) for detailed context engineering techniques

---

**Document Version**: 1.1.0
**Last Updated**: January 2026