# Claude Skills Directory

This directory contains the repository's skill library. Each skill is a reusable workflow automation unit that can be invoked across different projects and sessions.

## Overview

**Skills** are portable workflow automation units that complement commands and agents:
- **Commands**: Quick session shortcuts (`/test`, `/pr`, `/integration-scan`)
- **Agents**: Role-specialized project execution (Builder, Validator, Integration Manager)
- **Skills**: Cross-project reusable workflows (debugging, workspace management, content creation)

---

## Available Skills (11 Total)

### Development Workflow Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[root-cause-tracing](root-cause-tracing/SKILL.md)** | Systematically traces bugs backward through call stack to find original trigger | Debugging errors deep in execution, tracing invalid data sources |
| **[subagent-driven-development](subagent-driven-development/SKILL.md)** | Dispatches fresh subagent for each task with code review between tasks | Executing plans with independent tasks, fast iteration with quality gates |
| **[using-git-worktrees](using-git-worktrees/SKILL.md)** | Creates isolated git worktrees with smart directory selection and safety verification | Feature work needing isolation, working on multiple branches simultaneously |

### Integration & Automation Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[documentation-update](documentation-update/SKILL.md)** | Reusable logic for updating repository documentation (README, indices, tables) while preserving formatting | Adding entries to README tables after integration, maintaining indices |
| **[file-categorization](file-categorization/SKILL.md)** | Categorizes files as Command, Agent, Skill, or Documentation based on structure and content analysis | Processing files in integration pipelines, auto-routing files |

### Content & Documentation Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[content-research-writer](content-research-writer/SKILL.md)** | Assists in writing high-quality content by conducting research, adding citations, improving hooks | Writing blog posts, articles, newsletters, educational content, tutorials |

### Contribution & Sharing Skills

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[sharing-skills](sharing-skills/SKILL.md)** | Guides process of contributing skills upstream via pull request | Sharing broadly useful patterns back to repository |

### Meta Skills & Framework

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[using-superpowers](using-superpowers/SKILL.md)** | **CRITICAL**: Establishes mandatory workflows for finding and using skills | Starting any conversation, ensuring skill discovery and usage |

### Skill Development & Orchestration

| Skill | Description | Key Use Cases |
|-------|-------------|---------------|
| **[skill-creator](skill-creator/SKILL.md)** | Guides creation of new skills with templates and best practices | Building new automation, creating workflow skills |
| **[agent-skill-bridge](agent-skill-bridge/SKILL.md)** | Integrates agents and skills for coordinated workflows | Coordinating agents with skills in complex systems |
| **[skill-orchestrator](skill-orchestrator/SKILL.md)** | Coordinates multiple skills in complex workflows | Multi-skill workflows, chaining skills together |

---

## Using Skills

Skills are invoked using the Skill tool in Claude Code:

```
Use the [skill-name] skill to [accomplish task]
```

**Examples**:
```
Use the using-git-worktrees skill to set up an isolated workspace for feature work
```

```
Use the root-cause-tracing skill to debug this error
```

```
Use the content-research-writer skill to help me write an article about AI agents
```

### Skill Discovery

The **using-superpowers** skill is a meta-skill that ensures proper skill discovery:
- Automatically checked at the start of each conversation
- Prevents bypassing relevant skills
- Enforces mandatory skill usage workflows
- Integrates with TodoWrite for checklist tracking

**This skill is CRITICAL** for the skill system to function properly.

---

## Creating New Skills

### Quick Start

Use the skill-creator skill:
```
Use the skill-creator skill to help me build a skill for [your workflow]
```

### Choose a Template

Based on complexity:
- **Simple workflows** → `../templates/skills/minimal-skill-template.md`
- **Moderate workflows** → `../templates/skills/standard-skill-template.md`
- **Complex workflows** → `../templates/skills/comprehensive-skill-template.md`

### Best Practices

1. **Define clear triggers**: 3-5 "When to Use" statements
2. **Use concrete examples**: Real data, not placeholders
3. **Document thoroughly**: Purpose, process, integration points
4. **Test extensively**: 5-10 real scenarios before deployment
5. **Follow standards**: See `docs/best-practices/08-Claude-Skills-Guide.md`

---

## Skill Categories Explained

### Development Workflow Skills
Skills that enhance the software development process:
- Debugging (root-cause-tracing)
- Parallel development (using-git-worktrees)
- Plan execution (subagent-driven-development)

### Integration & Automation Skills
Skills for automating repository maintenance:
- File processing (file-categorization)
- Documentation maintenance (documentation-update)

### Content & Documentation Skills
Skills for content creation:
- Research-backed writing (content-research-writer)

### Contribution & Sharing Skills
Skills for community engagement:
- Upstream contributions (sharing-skills)

### Meta Skills & Framework
Skills that govern the skill system itself:
- Skill discovery (using-superpowers) - **MANDATORY**

### Skill Development & Orchestration
Skills for working with skills:
- Creating skills (skill-creator)
- Coordinating skills (skill-orchestrator, agent-skill-bridge)

---

## Skill Integration with Commands & Agents

### Skills Used by Commands

**Integration Commands**:
- `/integration-scan` uses **file-categorization** for automated file routing
- `/integration-update-docs` uses **documentation-update** for README maintenance

**Maintenance Commands**:
- `/maintenance-review` coordinates with **Research Specialist** agent

### Skills Used by Agents

**Integration Manager Agent**:
- Uses **file-categorization** for incoming file analysis
- Uses **documentation-update** for index maintenance

**Maintenance Manager Agent**:
- Coordinates research workflows
- Manages stale file reviews

**Builder Agent**:
- Uses **using-git-worktrees** for isolated feature development
- Uses **subagent-driven-development** for plan execution

---

## Skill Quality Standards

All skills in this repository meet these criteria:
- ✅ Valid YAML frontmatter with `name` and `description`
- ✅ Clear "When to Use" section with specific triggers
- ✅ Comprehensive "What This Skill Does" section
- ✅ Examples with real data (not placeholders)
- ✅ No security vulnerabilities
- ✅ Proper markdown structure
- ✅ Integration documentation (how it works with commands/agents)

---

## Resources

### Documentation
- **Comprehensive Guide**: `../docs/best-practices/08-Claude-Skills-Guide.md`
- **Skill Templates**: `../templates/skills/`
- **Command Integration**: `../.claude/commands/integration-scan.md`
- **Agent Integration**: `../agents-templates/integration-manager.md`

### Examples
- All skills in this directory serve as examples
- Check `skill-creator/SKILL.md` for creation guidance
- Review `using-superpowers/SKILL.md` for meta-skill patterns

### Support
- Issues: GitHub Issues tracker
- Discussions: Repository discussions
- Documentation: `docs/best-practices/`

---

## Statistics

**Total Skills**: 11
- Development Workflow: 3
- Integration & Automation: 2
- Content & Documentation: 1
- Contribution & Sharing: 1
- Meta Skills: 1
- Skill Development: 3

**Average Skill Size**: ~200-400 lines
**Quality Score**: 100/100 (all skills validated)
**Integration Coverage**: 100% (all skills documented for integration)

---

## Recent Additions

**November 2025**:
- ✨ content-research-writer (2025-11-23)
- ✨ root-cause-tracing (2025-11-23)
- ✨ sharing-skills (2025-11-23)
- ✨ subagent-driven-development (2025-11-23)
- ✨ using-git-worktrees (2025-11-23)
- ✨ using-superpowers (2025-11-23)
- ✨ file-categorization (2025-11-23)
- ✨ documentation-update (2025-11-23)

---

**Last Updated**: November 23, 2025
**Maintained By**: Claude Command and Control Repository
**Version**: 2.0.0
