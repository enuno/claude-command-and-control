# Skills Registry

This directory contains the skills registry for dynamic skill discovery and loading by the general agent.

## Purpose

The skills registry enables the **skills-first paradigm** where a general-purpose agent dynamically loads capabilities as modular skills rather than using specialized agent instances for each task.

## How Skills Work

### 1. Skill Discovery

The general agent references `registry.json` to:
- Find available skills by category
- Identify appropriate skills based on triggers
- Understand skill purpose and capabilities

### 2. Progressive Loading

Skills are loaded **progressively** as needed:

```
Feature Implementation Example:
1. architect-skill (design phase)
2. builder-skill (implementation phase)
3. validator-skill (testing phase)
4. scribe-skill (documentation phase)

Result: 35% token reduction vs loading all capabilities upfront
```

### 3. Skill Composition

Multiple skills can be composed for complex workflows:

```
Bug Fix Example:
- root-cause-tracing + builder-skill (investigate + fix)
- validator-skill (add regression tests)
- documentation-update (update docs)
```

## Available Skills

### By Category

- **Meta** (4 skills): skill-creator, skill-orchestrator, agent-skill-bridge, using-superpowers
- **Development** (2 skills): using-git-worktrees, subagent-driven-development
- **Debugging** (1 skill): root-cause-tracing
- **Maintenance** (1 skill): documentation-update
- **Writing** (1 skill): content-research-writer
- **Integration** (1 skill): file-categorization
- **Orchestration** (4 skills): multi-agent-planner, parallel-executor, worktree-manager, agent-communication

### By Use Case

**Feature Implementation**:
```bash
# Will use builder-role-skill (Phase 4 - in progress)
# Currently falls back to general development patterns
```

**Bug Investigation**:
```bash
# Use root-cause-tracing skill
```

**Documentation**:
```bash
# Use scribe-role-skill (Phase 4 - in progress)
# Currently: documentation-update for repo docs
```

**Multi-Agent Orchestration**:
```bash
# Use orchestration skills when parallelization needed
```

## Registry Structure

```json
{
  "skills": [
    {
      "name": "skill-name",
      "path": "../../skills/skill-name",
      "category": "category-name",
      "description": "What this skill does",
      "triggers": ["phrases that activate this skill"]
    }
  ]
}
```

## When to Create New Skills

Create a new skill when:
- Workflow repeats **≥3 times per week**
- Multiple team members would benefit
- Pattern is project-agnostic
- Clear trigger conditions exist

Use `skill-creator` skill to create new skills:
```
"Use skill-creator skill to help me build a skill for [your workflow]"
```

## Skill Development Status

### ✅ Production Skills (Active)
- skill-creator
- documentation-update
- using-git-worktrees
- root-cause-tracing
- file-categorization
- content-research-writer
- skill-orchestrator
- subagent-driven-development
- agent-skill-bridge
- using-superpowers

### 🚧 Orchestration Skills (Templates)
- multi-agent-planner-skill
- parallel-executor-skill
- worktree-manager-skill
- agent-communication-skill

### 📋 Phase 4: Agent → Skill Conversions (Planned)
- builder-role-skill
- validator-role-skill
- architect-role-skill
- scribe-role-skill
- devops-role-skill
- researcher-role-skill

## References

- **Skills Directory**: `../../skills/`
- **Skills Templates**: `../../skills-templates/`
- **Agent Skills Guide**: `../../docs/best-practices/09-Agent-Skills-vs-Multi-Agent.md`
- **Skills Guide**: `../../docs/best-practices/08-Claude-Skills-Guide.md`

## Maintenance

This registry is automatically updated when:
- New skills are added to `/skills/` directory
- Skills are removed or deprecated
- Skill metadata changes

**Last Updated**: 2025-12-12
**Version**: 1.0.0
**Maintained By**: Claude Command and Control Project
