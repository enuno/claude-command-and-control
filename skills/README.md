# Claude Skills Library

This directory contains meta-skills that help you create, integrate, and orchestrate Claude Skills within the Command and Control framework.

## What Are Skills?

**Claude Skills** are portable, reusable workflow automation units that complement commands and agents:

- **Commands**: Quick session shortcuts (`/test`, `/pr`)
- **Agents**: Role-specialized project execution (Builder, Validator)
- **Skills**: Cross-project reusable workflows (PR review, code formatting, doc generation)

## Available Meta-Skills

### skill-creator
**Purpose**: Guides the creation of high-quality Claude Skills following established best practices.

**Use when**:
- Creating a new skill from scratch
- Standardizing a repetitive workflow
- Documenting tribal knowledge as automation

**Documentation**: [skill-creator/SKILL.md](skill-creator/SKILL.md)

---

### agent-skill-bridge
**Purpose**: Facilitates seamless integration between Claude Skills and the existing Agent framework.

**Use when**:
- A skill needs to invoke an agent for specialized work
- An agent needs to leverage a skill for a standardized workflow
- Orchestrating multi-agent workflows that include skills

**Documentation**: [agent-skill-bridge/SKILL.md](agent-skill-bridge/SKILL.md)

---

### skill-orchestrator
**Purpose**: Coordinates execution of multiple specialized skills in complex workflows.

**Use when**:
- Workflow requires 3+ different specialized skills
- Skills have dependencies on each other's outputs
- Parallel skill execution would improve performance

**Documentation**: [skill-orchestrator/SKILL.md](skill-orchestrator/SKILL.md)

---

## Quick Start

### Creating Your First Skill

1. **Identify a repetitive workflow** (used ≥3x per week)

2. **Use the skill creator**:
   ```
   "Use skill-creator skill to help me build a skill for [your workflow]"
   ```

3. **Choose your template**:
   - **Simple workflows** → `templates/skills/minimal-skill-template.md`
   - **Moderate workflows** → `templates/skills/standard-skill-template.md`
   - **Complex workflows** → `templates/skills/comprehensive-skill-template.md`

4. **Test and deploy**

## Resources

- **Templates**: `/templates/skills/`
- **Documentation**: `/docs/best-practices/08-Claude-Skills-Guide.md`
- **Command Templates**: `/templates/commands/`
- **Agent Templates**: `/templates/agents/`

## Integration Patterns

### Pattern 1: Skill → Agent
```
User Request → Skill (orchestrator) → Agent (specialized execution) → Skill (synthesis)
```

### Pattern 2: Agent → Skill
```
User Request → Agent (project lead) → Skill (standardized subprocess) → Agent (continue)
```

### Pattern 3: Orchestrated Workflow
```
User Request → Orchestrator Skill → [Agent A, Agent B, Skill C] → Results Synthesis
```

## Best Practices

1. **Clear Triggers**: Use explicit action verbs and specific nouns
2. **Concrete Examples**: Provide 2-5 examples with real data
3. **Prerequisites**: List all required context and permissions
4. **Quality Standards**: Define measurable success criteria
5. **Common Pitfalls**: Document what to avoid with corrections

## Version History

- **1.0.0** (2025-11-22): Initial meta-skills library
  - skill-creator: Systematic skill creation guidance
  - agent-skill-bridge: Agent-skill integration patterns
  - skill-orchestrator: Multi-skill coordination

## Maintainer

Claude Command and Control Project

For questions or contributions, see the main [README.md](../README.md).
