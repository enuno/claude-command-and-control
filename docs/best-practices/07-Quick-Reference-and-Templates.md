# Quick Reference and Templates: Claude Commands and Agents

## Purpose
This document provides ready-to-use patterns and templates for quickly creating new commands and agents, fostering consistency and efficiency.

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
Use this document as a starting point for all new Claude command and agent workflows.