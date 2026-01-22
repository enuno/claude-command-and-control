---
name: dag-executor
version: 1.0.0
description: Execute tasks with complex dependencies using DAG (Directed Acyclic Graph) topological sorting
category: orchestration
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - TodoWrite
tags:
  - orchestration
  - dependencies
  - dag
  - parallel-execution
  - topological-sort
author: Claude Command and Control
created: 2026-01-21
updated: 2026-01-21
---

# DAG Executor Command

## Purpose

Execute a workflow with complex task dependencies using DAG (Directed Acyclic Graph) execution. This command:

- Analyzes task dependency graph and detects cycles
- Executes tasks in topological order (dependencies first)
- Maximizes parallelization of independent tasks
- Supports conditional execution based on results
- Handles task failures with configurable strategies

**Use when**: Tasks have complex dependencies, you need maximum parallelization, or you want to detect circular dependencies.

**Don't use when**: Simple sequential workflows (use pipeline instead) or no parallelization needed.

## Usage

```bash
/dag-executor <workflow-file> [--validate-only] [--max-parallel=N] [--fail-strategy=STRATEGY]
```

### Arguments

- `workflow-file` (required): Path to workflow definition file (YAML or JSON)
- `--validate-only` (optional): Only validate DAG, don't execute
- `--max-parallel` (optional): Maximum parallel tasks (default: 10)
- `--fail-strategy` (optional): How to handle failures
  - `fail-fast`: Stop immediately on first failure (default)
  - `continue`: Continue executing independent tasks
  - `retry`: Retry failed tasks with exponential backoff

## Workflow File Format

### YAML Format

```yaml
# workflow.yml
tasks:
  analyze_requirements:
    command: /research
    args: "requirements document"
    dependencies: []

  design_frontend:
    command: /architect
    args: "design React frontend"
    dependencies:
      - analyze_requirements

  design_backend:
    command: /architect
    args: "design API backend"
    dependencies:
      - analyze_requirements

  implement_frontend:
    command: /builder
    args: "implement frontend design"
    dependencies:
      - design_frontend
    condition:
      task: design_frontend
      check: status == "success"

  implement_backend:
    command: /builder
    args: "implement backend API"
    dependencies:
      - design_backend

  integration_test:
    command: /validator
    args: "run integration tests"
    dependencies:
      - implement_frontend
      - implement_backend

config:
  max_parallel: 5
  timeout_per_task: 600
  fail_strategy: fail-fast
```

### JSON Format

```json
{
  "tasks": {
    "task1": {
      "command": "/research",
      "args": "analyze codebase",
      "dependencies": []
    },
    "task2": {
      "command": "/builder",
      "args": "implement feature",
      "dependencies": ["task1"]
    }
  },
  "config": {
    "max_parallel": 10,
    "fail_strategy": "fail-fast"
  }
}
```

## Execution Flow

1. **Parse Workflow**: Read and validate workflow file
2. **Build DAG**: Create dependency graph from task definitions
3. **Detect Cycles**: Run cycle detection algorithm (fails if cycles found)
4. **Topological Sort**: Calculate execution order using Kahn's algorithm
5. **Execute Batches**: Run tasks in dependency order
   - Batch 1: Tasks with no dependencies (parallel)
   - Batch 2: Tasks depending only on Batch 1 (parallel)
   - Continue until all tasks complete
6. **Generate Report**: Create execution report with timing and results

## Execution Plan Output

Before execution, the command generates a plan showing:

```
DAG Execution Plan
==================

Dependency Graph:
  analyze_requirements (no dependencies)
  ├─ design_frontend (depends on: analyze_requirements)
  │  └─ implement_frontend (depends on: design_frontend)
  └─ design_backend (depends on: analyze_requirements)
     └─ implement_backend (depends on: design_backend)

  integration_test (depends on: implement_frontend, implement_backend)

Execution Batches:
  Batch 1: analyze_requirements
  Batch 2: design_frontend, design_backend (2 parallel tasks)
  Batch 3: implement_frontend, implement_backend (2 parallel tasks)
  Batch 4: integration_test

Total Tasks: 6
Max Parallelization: 2 tasks
Estimated Duration: 45-60 minutes
```

## Task Result Format

Each task produces a result file in `.dag-executor/results/`:

```json
{
  "task_id": "implement_frontend",
  "status": "success",
  "start_time": "2026-01-21T10:00:00Z",
  "end_time": "2026-01-21T10:15:00Z",
  "duration_seconds": 900,
  "command": "/builder",
  "args": "implement frontend design",
  "output": "Frontend implementation complete. 15 components created.",
  "artifacts": [
    "src/components/Header.tsx",
    "src/components/Dashboard.tsx"
  ],
  "dependencies_met": ["design_frontend"]
}
```

## Error Handling

### Cycle Detection

```
❌ ERROR: Cycle detected in dependency graph

Cycle: task_a → task_b → task_c → task_a

This workflow cannot be executed because tasks have circular dependencies.

Resolution:
1. Review task dependencies in workflow.yml
2. Remove circular dependency
3. Re-run with --validate-only to verify fix
```

### Task Failure

```
❌ Task failed: implement_backend

Task: implement_backend
Command: /builder
Status: FAILED
Error: API design validation failed

Dependent tasks (will not execute):
  - integration_test

Strategy: fail-fast (stopping execution)

To retry with different strategy:
  /dag-executor workflow.yml --fail-strategy=retry
```

### Missing Dependencies

```
❌ Invalid workflow: Missing dependency

Task: implement_frontend
Depends on: design_frontend_v2 (DOES NOT EXIST)

Available tasks:
  - analyze_requirements
  - design_frontend
  - design_backend

Resolution: Fix dependency name or add missing task
```

## Conditional Execution

Tasks can execute conditionally based on previous results:

```yaml
deploy_to_prod:
  command: /deploy
  args: "production"
  dependencies:
    - smoke_tests
  condition:
    task: smoke_tests
    check: "all_tests_passed && performance_acceptable"
```

Supported condition operators:
- `==`, `!=`: Equality checks
- `&&`, `||`: Logical operators
- `status`, `output`, `duration_seconds`: Available fields
- Python expression syntax

## Performance Optimization

### Parallel Execution

Set `max_parallel` to control concurrency:

```yaml
config:
  max_parallel: 20  # Run up to 20 tasks simultaneously
```

**Guidelines**:
- CPU-bound tasks: `max_parallel = CPU cores`
- IO-bound tasks (API calls, research): `max_parallel = 2-3x cores`
- Mixed workload: Start with 10, adjust based on metrics

### Task Timeout

Prevent hanging tasks:

```yaml
config:
  timeout_per_task: 900  # 15 minutes per task
  global_timeout: 3600   # 1 hour for entire workflow
```

## Monitoring and Progress

The command provides real-time progress updates:

```
[10:00:00] Starting DAG execution (6 tasks total)
[10:00:01] Batch 1: Starting 1 task
[10:00:01]   ▶ analyze_requirements
[10:05:23]   ✓ analyze_requirements (5m 22s)
[10:05:24] Batch 2: Starting 2 tasks
[10:05:24]   ▶ design_frontend
[10:05:24]   ▶ design_backend
[10:12:15]   ✓ design_frontend (6m 51s)
[10:13:02]   ✓ design_backend (7m 38s)
[10:13:03] Batch 3: Starting 2 tasks
...
[10:45:30] ✅ DAG execution complete (45m 30s)
[10:45:30] Success: 6/6 tasks
[10:45:30] Report: .dag-executor/execution-report-20260121-100000.md
```

## Output Files

```
.dag-executor/
├── workflow-validated.yml       # Validated workflow (with defaults)
├── dag-graph.dot               # GraphViz visualization
├── dag-graph.png               # Graph visualization (if graphviz installed)
├── execution-plan.md           # Human-readable plan
├── execution-log.txt           # Detailed execution log
├── execution-report-TIMESTAMP.md  # Final report
└── results/
    ├── task1-result.json
    ├── task2-result.json
    └── ...
```

## Examples

### Example 1: Simple Linear Workflow

```yaml
# linear-workflow.yml
tasks:
  step1:
    command: /research
    args: "analyze requirements"
    dependencies: []

  step2:
    command: /builder
    args: "implement solution"
    dependencies: [step1]

  step3:
    command: /validator
    args: "test solution"
    dependencies: [step2]

config:
  fail_strategy: fail-fast
```

```bash
/dag-executor linear-workflow.yml
```

### Example 2: Parallel Feature Development

```yaml
# parallel-features.yml
tasks:
  research:
    command: /research
    args: "analyze requirements"
    dependencies: []

  feature_a:
    command: /builder
    args: "implement feature A"
    dependencies: [research]

  feature_b:
    command: /builder
    args: "implement feature B"
    dependencies: [research]

  feature_c:
    command: /builder
    args: "implement feature C"
    dependencies: [research]

  integration:
    command: /validator
    args: "integration test"
    dependencies: [feature_a, feature_b, feature_c]

config:
  max_parallel: 3  # Run all 3 features in parallel
```

```bash
/dag-executor parallel-features.yml --max-parallel=3
```

### Example 3: Conditional Deployment Pipeline

```yaml
# deployment-pipeline.yml
tasks:
  build:
    command: /builder
    args: "build application"
    dependencies: []

  unit_tests:
    command: /validator
    args: "run unit tests"
    dependencies: [build]

  deploy_staging:
    command: /deploy
    args: "deploy to staging"
    dependencies: [unit_tests]
    condition:
      task: unit_tests
      check: status == "success"

  smoke_tests:
    command: /validator
    args: "run smoke tests on staging"
    dependencies: [deploy_staging]

  deploy_production:
    command: /deploy
    args: "deploy to production"
    dependencies: [smoke_tests]
    condition:
      task: smoke_tests
      check: status == "success" && duration_seconds < 300

config:
  fail_strategy: fail-fast
  timeout_per_task: 600
```

```bash
/dag-executor deployment-pipeline.yml
```

### Example 4: Validate Only (Dry Run)

```bash
# Validate workflow without executing
/dag-executor workflow.yml --validate-only
```

Output:
```
✅ Workflow validation successful

Tasks: 6
Dependencies validated: All tasks have valid dependencies
Cycles: None detected
Execution plan: Generated (.dag-executor/execution-plan.md)

Ready to execute:
  /dag-executor workflow.yml
```

## Integration with Other Commands

### Using Task Tool for Agent Spawning

```yaml
tasks:
  parallel_research:
    command: Task
    args: |
      {
        "subagent_type": "Researcher",
        "prompt": "Research Claude best practices",
        "model": "haiku"
      }
    dependencies: []
```

### Chaining with Other Workflows

```yaml
tasks:
  run_sub_workflow:
    command: /dag-executor
    args: "sub-workflow.yml"
    dependencies: [prepare_data]
```

## Troubleshooting

### High Memory Usage

**Problem**: Workflow consumes too much memory

**Solution**: Reduce `max_parallel`:
```yaml
config:
  max_parallel: 5  # Lower concurrency
```

### Tasks Not Running in Parallel

**Problem**: Expected parallel execution but tasks run sequentially

**Diagnosis**: Check dependencies - tasks with dependencies on each other cannot run in parallel

**Solution**: Review dependency graph, ensure independent tasks have no shared dependencies

### Workflow Hangs

**Problem**: Workflow appears stuck

**Diagnosis**: Check for:
1. Missing task completion signal
2. Deadlock in external command
3. Timeout not configured

**Solution**:
```yaml
config:
  timeout_per_task: 1800  # Add timeout
  global_timeout: 7200
```

## Best Practices

1. **Start Small**: Test workflow with `--validate-only` first
2. **Granular Tasks**: Break large tasks into smaller, independent units
3. **Explicit Dependencies**: Be explicit about dependencies (don't rely on order)
4. **Idempotent Tasks**: Design tasks to be safely re-runnable
5. **Monitor Resources**: Watch CPU/memory usage with high `max_parallel`
6. **Version Control**: Keep workflow files in version control
7. **Documentation**: Document task dependencies and purpose
8. **Error Handling**: Use appropriate `fail_strategy` for your use case

## Related Documentation

- **Document 15**: Advanced Orchestration Patterns (Section 2: Dependency Management)
- **Command**: `/coordinate-workflow` - Real-time coordination
- **Skill**: `task-dependency-resolver-skill` - Dependency analysis
- **Agent**: `dag-orchestrator.md` - DAG execution agent

## Version History

### 1.0.0 (2026-01-21)
- Initial release
- DAG execution with Kahn's algorithm
- Cycle detection
- Conditional execution support
- Multiple fail strategies
- Real-time progress monitoring

---

**Status**: Production Ready
**Complexity**: Medium
**Prerequisites**: Understanding of dependency graphs
**Estimated Learning Time**: 30 minutes
