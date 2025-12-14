# Multi-Agent Orchestration: Patterns and Best Practices

## Purpose
This document describes how to coordinate multiple Claude agents and commands for highly efficient, scalable, and reliable workflows. It covers orchestration architecture, communication, planning documents, and anti-patterns to avoid.

## Orchestrator-Worker Architecture

### Lead Agent (Orchestrator)
- Receives user or project requests
- Decomposes requirements into actionable subtasks
- Assigns subtasks to specialized subagents
- Monitors subtask progress/completion
- Synthesizes results
- Handles error recovery and quality control

### Subagents (Workers)
- Execute focused, well-defined tasks
- Return structured outputs and metadata
- Operate in parallel with isolated context as needed

## Planning and Task Distribution

### Shared Planning Document
- Use a standard file, e.g., `MULTI_AGENT_PLAN.md`, to outline:
  - Overall project goal
  - Task breakdown and dependencies
  - Assignment of agents to tasks
  - Status of each subtask (not started / in progress / done)
- The architect agent maintains the plan, and all agents read/write task status as they work

### Task Handoffs and Collaboration
- Clearly define natural handoff points (e.g., after builder agent finishes code, validator agent takes over)
- Specify expected outputs and success criteria for each phase
- Enable agents to communicate status or blockers using update comments or plan fields

## Communication Protocols

- Use structured message formats when agents interact directly
- Include task IDs, agent roles, objectives, context, expected output, and metadata
- Trace all exchanges via an audit log or a shared message file

## Parallelization and Independence

- Where possible, assign non-dependent tasks to multiple agents simultaneously
- Each agent maintains independent context (buffers/window) to avoid information bleed
- Compare, synthesize, or select the best result among outputs if duplicate tasks are run in parallel (e.g., two independent implementations for risk mitigation)

## Anti-Patterns to Avoid
- Conflicting assignments: No single task should be assigned ambiguously to more than one agent (unless by design)
- Lost context: Always re-read planning documents and recent changes if the agent context expires or is inconsistent
- Over-coordination: Avoid deep hierarchies that introduce latency without benefit
- Poor error handling: Lead agent should always detect and recover from agent failures

## Monitoring and Iteration
- Agents should record the outcome of their step in the plan
- Periodically run static checks and status audits across planning documents
- The orchestrator agent or a designated reviewer should periodically summarize completed, ongoing, and blocked work

---
See Document 5 for agent testing, validation, and quality assurance workflows.