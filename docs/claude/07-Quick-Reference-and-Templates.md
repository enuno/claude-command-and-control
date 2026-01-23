# Quick Reference and Templates: Claude Commands, Agents, and Skills

## Purpose
This document provides ready-to-use patterns and templates for quickly creating new commands, agents, and skills, fostering consistency and efficiency.

---

## Command File Template
```markdown
---
description: "Describe the command's function (1-2 lines)"
allowed-tools: ["Bash(git:*)", "Test", "Read"]
author: "Your Name"
version: "1.0"
---

# [Command Name]

1. !git status --porcelain
2. [Additional steps with shell commands, editor actions, or context references]
3. Provide a summary/result at the end.
```

---

## Agent Role Assignment Table
| Role        | Description                         | Example Permissions                |
|-------------|-------------------------------------|-------------------------------------|
| Architect   | Planning, system design             | "Read", "Edit", "Plan"              |
| Builder     | Code, implementation, modifications | "Bash(git:*)", "Edit"               |
| Validator   | Testing, QA, review                 | "Test", "Review"                    |
| Scribe      | Documentation and comments          | "Read", "Write", "Document"          |
| Researcher  | Information gathering, analysis     | "Read", "Search"                    |

---

## Skill Template Quick Reference

### Skill Complexity Decision Matrix
| Complexity | Token Budget | When to Use | Template |
|------------|--------------|-------------|----------|
| **Simple** | 500-2K | Single-step, deterministic workflows | `templates/skills/minimal-skill-template.md` |
| **Moderate** | 2K-8K | Multi-step with decision points | `templates/skills/standard-skill-template.md` |
| **Complex** | 8K-20K | Multi-phase with feedback loops | `templates/skills/comprehensive-skill-template.md` |

### Minimal Skill Template Structure
```markdown
---
name: [skill-name]
version: 1.0.0
author: [your-team]
created: [YYYY-MM-DD]
status: active
complexity: simple
---

# [Skill Name]

## Description
[One sentence: Action verb + object + specific outcome]

## When to Use This Skill
- [Explicit trigger 1]
- [Explicit trigger 2]
- [Explicit trigger 3]

## When NOT to Use This Skill
- [Alternative skill/command to use instead]

## Prerequisites
- [Required context/data/permission 1]
- [Required context/data/permission 2]

## Workflow
### Step 1: [Action Name]
[Clear, imperative instruction]

### Step 2: [Action Name]
[Clear, imperative instruction]

## Examples
### Example 1: [Happy Path]
**Input:** [Concrete sample]
**Expected Output:** [Concrete sample]

## Quality Standards
- [Acceptance criterion 1]
- [Acceptance criterion 2]

## Common Pitfalls
- ❌ [What to avoid]
- ✅ [What to do instead]
```

### Meta-Skills Quick Reference
| Skill | Purpose | Use When |
|-------|---------|----------|
| **skill-creator** | Creates new skills following best practices | Building new workflow automation |
| **agent-skill-bridge** | Integrates skills with agents | Coordinating agent-skill handoffs |
| **skill-orchestrator** | Coordinates multiple skills | Complex multi-skill workflows |

---

## Sample Multi-Agent Plan (Markdown Table)
| Task             | Agent      | Status      |
|------------------|------------|-------------|
| Architect spec   | Architect  | Complete    |
| Build feature    | Builder    | In Progress |
| Write tests      | Validator  | Not Started |
| Document feature | Scribe     | Not Started |

---

## Sample QA Checklist
- [ ] All required arguments and context validated
- [ ] Allowed-tools explicitly scoped
- [ ] Documentation and comments up to date
- [ ] Tests included and passing
- [ ] Error handling implemented
- [ ] Change log entry created

---

## Production-Grade Skills Checklists

### Skill Creation Checklist

Use this checklist when creating new skills following evaluation-driven development methodology:

| # | Phase | Task | Status |
|---|-------|------|--------|
| 1 | **Scoping** | Define clear success criteria (what does "done" look like?) | ⬜ |
| 2 | **Scoping** | Identify 2-5 concrete examples (happy path + edge cases) | ⬜ |
| 3 | **Scoping** | Determine token budget tier (Simple: <2K, Moderate: 2K-8K, Complex: 8K-20K) | ⬜ |
| 4 | **Evaluation** | **Create evaluation.json BEFORE writing SKILL.md** | ⬜ |
| 5 | **Evaluation** | Define multi-dimensional rubric (factual accuracy, completeness, citations, tool efficiency) | ⬜ |
| 6 | **Evaluation** | Set minimum score thresholds per criterion | ⬜ |
| 7 | **Development** | Write SKILL.md following standard template | ⬜ |
| 8 | **Development** | Keep description under 1024 characters (single-line YAML) | ⬜ |
| 9 | **Development** | Include explicit "When to Use" and "When NOT to Use" sections | ⬜ |
| 10 | **Development** | Implement progressive disclosure (SKILL.md <500 lines, use separate reference docs) | ⬜ |
| 11 | **Testing** | Test with Creator Claude (write/execute skill) | ⬜ |
| 12 | **Testing** | Test with Tester Claude (follow only SKILL.md instructions) | ⬜ |
| 13 | **Testing** | Run evaluation suite, verify all rubric thresholds met | ⬜ |
| 14 | **Testing** | Test context degradation (25%, 50%, 75% context utilization) | ⬜ |
| 15 | **Documentation** | Create troubleshooting.md documenting failed approaches | ⬜ |
| 16 | **Deployment** | Add activation logging to track real-world invocation rates | ⬜ |
| 17 | **Deployment** | Deploy to staging, monitor for 1 week before production | ⬜ |

### Activation Reliability Checklist

Ensure skills activate reliably when needed (target: >80% activation rate):

| # | Area | Check | Status |
|---|------|-------|--------|
| 1 | **Description** | Description is single-line YAML (no multiline breaks) | ⬜ |
| 2 | **Description** | Description under 1024 characters (excess truncated silently) | ⬜ |
| 3 | **Description** | Includes BOTH what skill does AND specific trigger keywords | ⬜ |
| 4 | **Triggers** | "When to Use" section has 3-5 explicit, concrete triggers | ⬜ |
| 5 | **Triggers** | Trigger phrases use action verbs + specific nouns (not vague terms) | ⬜ |
| 6 | **Triggers** | No overlap with other skills in system (checked against skill registry) | ⬜ |
| 7 | **Scope** | Total active skills count ≤32 (detection ceiling for reliable selection) | ⬜ |
| 8 | **Context** | SKILL.md file <500 lines (use references for details) | ⬜ |
| 9 | **Hooks** | CLAUDE.md has forced evaluation hook (if mission-critical skill) | ⬜ |
| 10 | **Testing** | Activation logging enabled to measure real-world invocation rate | ⬜ |
| 11 | **Validation** | Tested activation rate ≥75% across 10+ realistic user queries | ⬜ |

### Maintenance Checklist

Regular maintenance cadence to keep skills effective and current:

| Frequency | Task | Owner | Status |
|-----------|------|-------|--------|
| **Monthly** | Review activation logs, identify skills with <50% invocation rate | Tech Lead | ⬜ |
| **Monthly** | Analyze error logs, fix bugs causing failures | Engineer | ⬜ |
| **Monthly** | Review user feedback, prioritize top 3 improvement requests | Product | ⬜ |
| **Quarterly** | Update skill dependencies (APIs, libraries, MCP servers) | DevOps | ⬜ |
| **Quarterly** | Refresh examples with recent real-world scenarios | Engineer | ⬜ |
| **Quarterly** | Review and update evaluations to match evolved requirements | QA | ⬜ |
| **Quarterly** | Audit skill performance metrics (time saved, quality scores) | Product | ⬜ |
| **Quarterly** | Archive or deprecate skills with <30-day usage gap | Tech Lead | ⬜ |
| **Annual** | Major version update considering ecosystem changes | Architect | ⬜ |
| **Annual** | Consolidate overlapping skills to reduce total count | Architect | ⬜ |
| **Annual** | Review entire skill library for architectural consistency | Architect | ⬜ |
| **Continuous** | Update troubleshooting.md when failed approaches discovered | Engineer | ⬜ |
| **Continuous** | Increment version on any SKILL.md changes | Engineer | ⬜ |

### Context Management Checklist

Optimize context window utilization for multi-skill environments:

| # | Strategy | Implementation | Status |
|---|----------|----------------|--------|
| 1 | **Progressive Disclosure** | SKILL.md metadata <100 tokens per skill in system prompt | ⬜ |
| 2 | **Progressive Disclosure** | SKILL.md body <500 lines, reference docs for deep content | ⬜ |
| 3 | **Progressive Disclosure** | Bundled resources loaded only when skill activated | ⬜ |
| 4 | **CLAUDE.md** | Persistent context defined in CLAUDE.md (project standards, conventions) | ⬜ |
| 5 | **CLAUDE.md** | CLAUDE.md <10K tokens to avoid overwhelming initial load | ⬜ |
| 6 | **Subagents** | Complex workflows spawn subagents with isolated context | ⬜ |
| 7 | **Compaction** | Context compaction triggered at 75% utilization threshold | ⬜ |
| 8 | **Monitoring** | Instrumentation tracks context size per skill activation | ⬜ |
| 9 | **Limits** | Total concurrent active skills ≤32 (token budget constraint) | ⬜ |

### Enterprise Deployment Checklist

Phased rollout strategy for production skill deployment:

#### Phase 1: Pilot (Week 1-2)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Select 2-3 early adopter engineers for pilot | Tech Lead | ⬜ |
| 2 | Deploy skill to pilot group only | DevOps | ⬜ |
| 3 | Provide 1-hour training session on skill usage | Product | ⬜ |
| 4 | Enable detailed activation logging and error tracking | DevOps | ⬜ |
| 5 | Gather daily feedback from pilot users | Product | ⬜ |
| 6 | Fix critical bugs within 24 hours | Engineer | ⬜ |
| 7 | Measure key metrics: activation rate, time saved, quality scores | Product | ⬜ |

#### Phase 2: Staged Rollout (Week 3-4)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Expand to 25% of team if pilot metrics meet thresholds | Tech Lead | ⬜ |
| 2 | Create internal documentation and FAQ | Scribe | ⬜ |
| 3 | Set up support channel (Slack/Teams) for questions | Product | ⬜ |
| 4 | Monitor error rates, rollback if >10% failure rate | DevOps | ⬜ |
| 5 | Conduct weekly review meeting with expanded user group | Tech Lead | ⬜ |
| 6 | Update skill based on feedback (minor version bump) | Engineer | ⬜ |

#### Phase 3: Full Deployment (Week 5-6)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Deploy to entire organization if stage 2 successful | DevOps | ⬜ |
| 2 | Announce via all-hands meeting and email | Product | ⬜ |
| 3 | Schedule quarterly review for skill effectiveness | Tech Lead | ⬜ |
| 4 | Transition to standard maintenance cadence (see Maintenance Checklist) | Tech Lead | ⬜ |
| 5 | Document lessons learned and update deployment playbook | Scribe | ⬜ |
| 6 | Celebrate success and recognize pilot contributors | Tech Lead | ⬜ |

---

## Memory Summary Example
```
Project: Analytics Dashboard v2
Priorities: Finish data pipeline, review UI
Preferred workflow: TDD and code review
Recurring blockers: Flaky tests, unclear API docs
Team roles: Anna (architect), Quang (builder), Tara (QA)
```

---
Use this document as a starting point for all new Claude command, agent, and skill workflows.

---

**Document Version**: 1.1.0
**Last Updated**: January 23, 2026
**Maintained By**: Claude Command and Control Project
**Review Cycle**: Quarterly