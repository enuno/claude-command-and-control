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