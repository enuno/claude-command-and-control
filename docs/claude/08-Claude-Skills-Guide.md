# Claude Skills: Creation, Integration, and Best Practices

## Overview

This chapter extends the Claude Command and Control framework to support **Claude Skills** - reusable, portable workflow automation units that complement the existing command and agent architecture.

## Relationship to Commands and Agents

| Feature | Commands | Agents | Skills |
|---------|----------|--------|--------|
| **Purpose** | Quick shortcuts | Role-specialized execution | Reusable workflows |
| **Scope** | Single action | Multi-step project execution | Specific workflow automation |
| **Persistence** | Session-specific | Project-specific | Cross-project portable |
| **Invocation** | `/command` syntax | Direct agent assignment | Natural language triggers |
| **Context** | Minimal | Full project | Scoped to workflow |
| **Best For** | Repetitive actions | Complex multi-phase work | Standardized processes |

## When to Use Skills

**Create a skill when:**
- Workflow repeats ≥3 times per week
- Process has clear, documented steps
- Multiple team members perform same task
- Standardization improves quality
- Automation saves ≥30 min per use

**Use commands when:**
- Single action needed
- Session-specific context required
- Quick shortcut desired

**Use agents when:**
- Complex multi-phase development
- Role specialization needed
- Deep project context required

## Quick Start

### Step 1: Identify Workflow to Automate

Ask:
- What repetitive task frustrates the team?
- What manual process is error-prone?
- What workflow has tribal knowledge that should be documented?

### Step 2: Choose Template Complexity

- **Simple** (500-2K tokens): Single-step, deterministic → Use `minimal-skill-template.md`
- **Moderate** (2K-8K tokens): Multi-step with decisions → Use `standard-skill-template.md`
- **Complex** (8K-20K tokens): Multi-phase with loops → Use `comprehensive-skill-template.md`

### Step 3: Use Skill Creator

```
"Use the skill-creator skill to help me build a skill for [your workflow]"
```

The skill-creator will guide you through:
1. Requirements gathering
2. Scoping and complexity assessment
3. Trigger phrase definition
4. Example collection
5. Quality validation
6. Testing strategy

### Step 4: Test and Iterate

1. Create skill following template
2. Test with 5-10 real scenarios
3. Refine based on failures
4. Document common pitfalls
5. Deploy to team

## Integration Patterns

### Pattern 1: Skill Invokes Agent

```
User Request
↓
Skill (workflow orchestrator)
↓
Agent (specialized execution)
↓
Skill (synthesize results)
```

**Use when**: Skill needs deep project context or role specialization

**Example**: Code review skill invokes Validator agent for detailed analysis

### Pattern 2: Agent Invokes Skill

```
User Request
↓
Agent (project lead)
↓
Skill (standardized subprocess)
↓
Agent (continue workflow)
```

**Use when**: Agent needs standardized workflow step

**Example**: Builder agent invokes code-formatter skill for consistent styling

### Pattern 3: Orchestrated Workflow

```
User Request
↓
Orchestrator Skill
├→ Agent A (parallel)
├→ Agent B (parallel)
└→ Skill C (synthesis)
```

**Use when**: Complex workflow needs coordination of multiple agents and skills

**Example**: Feature development orchestrator coordinates Architect, Builder, and testing skills

## Best Practices

### Trigger Phrase Design

**✅ DO:**
- Use explicit action verbs: "create", "review", "generate", "analyze"
- Include specific nouns: "pull request", "API documentation", "commit message"
- Add context qualifiers: "for code review", "from commit history"

**❌ DON'T:**
- Use vague terms: "help with code", "work on stuff"
- Overlap with other skills: "review code" (too similar to code-review skill)
- Be overly narrow: "review JavaScript authentication code on Tuesdays" (too specific)

### Example Collection

**Minimum**: 2 examples (happy path + edge case)
**Recommended**: 5 examples (happy path + 2 edge cases + error scenario + complex case)

**Each example must include:**
- Concrete input (real data, not placeholders)
- Complete expected output (actual content, not "see docs")
- Rationale (why this example matters)

### Documentation Standards

**Every skill must have:**
- Clear description (100-150 characters for UI)
- Explicit triggers (3-5 "When to Use" statements)
- Negative triggers (2-3 "When NOT to Use" statements)
- Prerequisites clearly stated
- Step-by-step workflow
- Quality standards
- Common pitfalls
- Version history

## Troubleshooting

### Issue: Skill Doesn't Invoke

**Diagnosis:**
1. Check trigger phrases match "When to Use"
2. Verify no overlap with other skills
3. Confirm prerequisites are met

**Fix:**
- Make triggers more explicit
- Add negative triggers to eliminate overlap
- Simplify prerequisites

### Issue: Skill Invokes But Fails

**Diagnosis:**
1. Review workflow steps for clarity
2. Check if examples cover the scenario
3. Verify prerequisites were actually met

**Fix:**
- Add more specific instructions to failing step
- Add example covering this scenario
- Strengthen prerequisite validation

### Issue: Wrong Skill Invoked

**Diagnosis:**
1. Review "When NOT to Use" sections
2. Check for trigger phrase overlap
3. Examine skill descriptions for clarity

**Fix:**
- Add negative triggers to both skills
- Make descriptions more distinct
- Rename skills to be more specific

## Advanced Topics

### Multi-Skill Orchestration

Use `skill-orchestrator` skill for workflows requiring 3+ skills:

```
"Use skill-orchestrator to coordinate:

1. Research skill (gather data)
2. Analysis skill (process data)
3. Report skill (generate output)"
```

Orchestrator handles:
- Dependency management
- Parallel execution
- Error recovery
- Result synthesis

### Agent-Skill Integration

Use `agent-skill-bridge` skill to facilitate handoffs:

```
"Use agent-skill-bridge to integrate:

- PR-review skill invokes Validator agent
- Builder agent invokes code-formatter skill"
```

Bridge handles:
- Context translation
- Handoff protocols
- Bidirectional communication
- Error propagation

### Performance Optimization

**Token Budget:**
- Simple skills: <2K tokens
- Moderate skills: 2K-8K tokens
- Complex skills: 8K-20K tokens
- Add 20% overhead for orchestration

**Execution Time:**
- Simple: <30 seconds
- Moderate: <5 minutes
- Complex: <15 minutes
- Consider splitting if longer

**Parallel Execution:**
- Identify independent skill invocations
- Use skill-orchestrator for coordination
- Measure time savings (typically 30-50%)

## Migration Path

### From Commands to Skills

**When to migrate:**
- Command used by multiple teams
- Command needs examples/documentation
- Command workflow evolving

**Migration process:**
1. Document command as skill workflow
2. Add examples from real usage
3. Define explicit triggers
4. Test skill alongside command
5. Deprecate command after validation

### From Agent Workflows to Skills

**When to migrate:**
- Agent workflow is standardized
- Same workflow across multiple projects
- Workflow is self-contained
- No deep project context needed

**Migration process:**
1. Extract workflow from agent config
2. Generalize project-specific parts
3. Add examples covering variations
4. Test across multiple projects
5. Reference skill from agent config

## Metrics and Success

**Track these KPIs:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time Saved | 10+ hrs/week per team | Before/after time tracking |
| Adoption Rate | 80% team using weekly | Usage logs |
| Quality Improvement | 20% fewer bugs | Bug tracker analysis |
| Consistency | 90% output conformity | Quality audits |
| ROI | 5x development cost | (Time saved × rate) / dev cost |

## Resources

**Templates:**
- `templates/skills/minimal-skill-template.md`
- `templates/skills/standard-skill-template.md`
- `templates/skills/comprehensive-skill-template.md`

**Meta-Skills:**
- `skills/skill-creator/SKILL.md` - Creates new skills
- `skills/agent-skill-bridge/SKILL.md` - Integrates agents and skills
- `skills/skill-orchestrator/SKILL.md` - Coordinates multiple skills

**Official Documentation:**
- [Claude Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Skill Authoring Guide](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/quickstart)

## Conclusion

Claude Skills extend the Command and Control framework with portable, reusable workflow automation. By following these templates and best practices, teams can:

- **Standardize** common workflows
- **Scale** expertise across team members
- **Accelerate** repetitive tasks
- **Improve** consistency and quality

**Next Steps:**
1. Identify 3 high-value workflows to automate
2. Use skill-creator to build first skill
3. Test with real scenarios
4. Deploy to team
5. Measure impact
6. Iterate based on feedback

---

**Document Version**: 1.0.0
**Last Updated**: November 22, 2025
**Maintained By**: Claude Command and Control Project
**Review Cycle**: Quarterly
