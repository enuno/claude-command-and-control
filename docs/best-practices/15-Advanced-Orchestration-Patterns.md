# Advanced Orchestration Patterns for Production AI Agent Systems

**Production Best Practices for Complex Multi-Agent Workflows**

**Version**: 1.0.0
**Target Audience**: Senior engineers, DevOps specialists, and AI orchestration architects
**Last Updated**: January 21, 2026
**Prerequisites**: Documents 04, 11, 12 (Multi-Agent Orchestration, Hybrid Development, Skills-First)

---

## Document Overview

### Purpose

This document provides comprehensive guidance for implementing **advanced orchestration patterns** in production AI agent systems. While Documents 04, 11, and 12 cover foundational multi-agent coordination, this guide addresses enterprise-grade patterns for:

- Complex dependency management with conditional execution
- Dynamic resource allocation and agent lifecycle management
- Distributed state synchronization and conflict resolution
- Advanced fault tolerance and recovery mechanisms
- Performance optimization and cost management
- Real-time monitoring and observability
- Production-scale workflow orchestration

### When to Use This Document

**Use advanced orchestration patterns when**:
- ✅ Managing 10+ parallel agents with complex dependencies
- ✅ Building mission-critical systems requiring fault tolerance
- ✅ Optimizing for cost and performance at scale
- ✅ Coordinating distributed workflows across environments
- ✅ Implementing production systems with SLA requirements

**Skip advanced patterns if**:
- ❌ Simple sequential workflows (use single agent + skills)
- ❌ Small-scale parallelization (< 5 agents)
- ❌ Prototyping or exploratory work
- ❌ One-off automation tasks

### Pattern Catalog Overview

This document covers **8 major pattern categories**:

| Category | Complexity | Use Cases | Key Patterns |
|----------|------------|-----------|--------------|
| **Dependency Management** | Medium-High | Task orchestration | DAG, Conditional execution |
| **Dynamic Management** | Medium | Variable workloads | Pool management, Auto-scaling |
| **State Management** | High | Shared state | CRDT, Event sourcing |
| **Error Handling** | Medium-High | Fault tolerance | Circuit breaker, Saga |
| **Communication** | Medium | Event-driven | Pub/sub, Message queue |
| **Performance** | Medium | Optimization | Throttling, Load balancing |
| **Workflow Patterns** | Low-High | Data processing | Fan-out/fan-in, Map-reduce |
| **Observability** | Medium | Monitoring | Tracing, Metrics, Health checks |

### How to Use This Document

1. **Understand the Pattern**: Read the theory and use cases
2. **Review Prerequisites**: Ensure you have the required infrastructure
3. **Study the Implementation**: Examine code examples and algorithms
4. **Apply to Your Scenario**: Adapt the pattern to your specific needs
5. **Test Thoroughly**: Validate behavior under failure conditions
6. **Monitor in Production**: Track metrics and iterate

---

## 1. Introduction and Foundations

### The Advanced Orchestration Imperative

As AI agent systems scale beyond simple coordinator-worker patterns, new challenges emerge:

**Complexity Challenges**:
- Tasks with non-linear dependencies (conditional execution, cycles)
- Dynamic workloads requiring runtime agent spawning/termination
- Shared state requiring synchronization across distributed agents
- Cascading failures requiring sophisticated recovery mechanisms
- Performance optimization under token budget constraints

**Production Requirements**:
- 99.9%+ reliability for mission-critical workflows
- Cost optimization (API usage, compute resources)
- Real-time monitoring and alerting
- Graceful degradation under failure
- Compliance and audit trails

**The Solution**: Advanced orchestration patterns provide proven, production-tested approaches to these challenges.

### Architecture Evolution

```
Level 0: Single Agent + Skills
├── Best for: Sequential workflows, standard development tasks
├── Complexity: Low
└── Token overhead: 5-7x baseline

Level 1: Basic Multi-Agent (Document 04)
├── Best for: Parallel independent tasks, breadth-first research
├── Complexity: Medium
└── Token overhead: 15x baseline

Level 2: Hybrid with Worktrees (Document 11)
├── Best for: Parallel development on same codebase
├── Complexity: Medium-High
└── Overhead: Filesystem isolation, Git management

Level 3: Advanced Orchestration (This Document)
├── Best for: Complex workflows, production systems, fault tolerance
├── Complexity: High
└── Overhead: Dependency management, state sync, monitoring
```

**Decision Principle**: Use the simplest approach that meets your requirements. Don't use advanced patterns for simple problems.

### Core Concepts

#### 1. Orchestration vs Choreography

**Orchestration** (Centralized Control):
```
┌──────────────────────────────────┐
│   Central Orchestrator           │
│   • Knows entire workflow        │
│   • Directs all agents           │
│   • Handles failures centrally   │
└──────┬───────┬──────┬──────┬─────┘
       │       │      │      │
       ▼       ▼      ▼      ▼
    Agent1  Agent2  Agent3  Agent4
```

**Choreography** (Decentralized Coordination):
```
Agent1 ──→ Agent2
  │           │
  ▼           ▼
Agent3 ──→ Agent4
(Each agent knows only its part)
```

**When to use each**:
- **Orchestration**: Complex workflows, central monitoring needed, SLA requirements
- **Choreography**: Loose coupling, autonomous agents, event-driven systems

#### 2. Stateful vs Stateless Agents

**Stateless Agents**:
- Execute task and terminate
- No shared state between invocations
- Easier to scale horizontally
- Simpler failure recovery

**Stateful Agents**:
- Maintain state across invocations
- Share state with other agents
- More complex but powerful
- Requires state synchronization patterns

#### 3. Synchronous vs Asynchronous Execution

**Synchronous**:
- Orchestrator waits for each agent to complete
- Simpler to reason about
- Limited parallelization

**Asynchronous**:
- Agents execute independently
- Maximum parallelization
- Requires coordination mechanisms (promises, futures, callbacks)

---

## 2. Complex Dependency Management

### Overview

Real-world workflows often involve tasks with complex dependencies:
- Task B depends on outputs from Task A
- Task C can only run if Task A succeeds AND Task B completes
- Task D runs conditionally based on Task C's result
- Cyclic dependencies must be detected and prevented

**Solution**: Model workflows as **Directed Acyclic Graphs (DAGs)** and execute using topological sorting.

### DAG Execution Pattern

#### Theory

A **Directed Acyclic Graph (DAG)** represents tasks as nodes and dependencies as directed edges:

```
    A
   / \
  B   C
  |   |
  D   E
   \ /
    F
```

**Execution order**: A → (B, C in parallel) → (D, E in parallel) → F

**Key Properties**:
- **Acyclic**: No task depends on itself (directly or transitively)
- **Ordered**: Topological sort determines execution sequence
- **Parallelizable**: Independent tasks execute concurrently

#### When to Use

✅ **Use DAG execution when**:
- Tasks have complex dependencies
- Maximizing parallelization is critical
- Need to detect circular dependencies
- Workflow changes frequently (DAG is data-driven)

❌ **Don't use DAG execution when**:
- Simple sequential workflow (overhead not justified)
- No parallelization possible (linked list is simpler)
- Dependencies are uniform (use pipeline pattern instead)

#### Implementation: Kahn's Algorithm

**Algorithm**: Topological sort with cycle detection

```python
from collections import defaultdict, deque
from typing import Dict, List, Set, Any

class DAGExecutor:
    """
    Executes tasks based on dependency graph using Kahn's algorithm.

    Supports:
    - Parallel execution of independent tasks
    - Cycle detection
    - Conditional dependencies
    - Result passing between tasks
    """

    def __init__(self, tasks: Dict[str, callable], dependencies: Dict[str, List[str]]):
        """
        Args:
            tasks: Map of task_id -> executable function
            dependencies: Map of task_id -> list of task_ids it depends on
        """
        self.tasks = tasks
        self.dependencies = dependencies
        self.results = {}
        self.graph = defaultdict(list)
        self.in_degree = defaultdict(int)

    def build_graph(self):
        """Build adjacency list and calculate in-degrees."""
        # Initialize in-degree for all tasks
        for task_id in self.tasks:
            self.in_degree[task_id] = 0

        # Build graph and calculate in-degrees
        for task_id, deps in self.dependencies.items():
            for dep_id in deps:
                self.graph[dep_id].append(task_id)
                self.in_degree[task_id] += 1

    def detect_cycle(self) -> bool:
        """
        Detect cycles using DFS.
        Returns True if cycle found, False otherwise.
        """
        visited = set()
        rec_stack = set()

        def dfs(node: str) -> bool:
            visited.add(node)
            rec_stack.add(node)

            for neighbor in self.graph[node]:
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True

            rec_stack.remove(node)
            return False

        for task_id in self.tasks:
            if task_id not in visited:
                if dfs(task_id):
                    return True
        return False

    def execute(self) -> Dict[str, Any]:
        """
        Execute DAG using Kahn's algorithm.
        Returns map of task_id -> result.
        """
        self.build_graph()

        # Detect cycles
        if self.detect_cycle():
            raise ValueError("Cycle detected in dependency graph")

        # Find tasks with no dependencies (in-degree = 0)
        ready_queue = deque([
            task_id for task_id in self.tasks
            if self.in_degree[task_id] == 0
        ])

        executed_count = 0

        while ready_queue:
            # Get batch of ready tasks
            batch_size = len(ready_queue)
            current_batch = [ready_queue.popleft() for _ in range(batch_size)]

            # Execute batch in parallel
            batch_results = self._execute_batch(current_batch)
            self.results.update(batch_results)
            executed_count += len(current_batch)

            # Update ready queue with newly available tasks
            for task_id in current_batch:
                for dependent_id in self.graph[task_id]:
                    self.in_degree[dependent_id] -= 1
                    if self.in_degree[dependent_id] == 0:
                        ready_queue.append(dependent_id)

        # Verify all tasks executed
        if executed_count != len(self.tasks):
            raise RuntimeError(
                f"DAG execution incomplete: {executed_count}/{len(self.tasks)} tasks executed. "
                f"Likely due to undetected cycle or missing dependencies."
            )

        return self.results

    def _execute_batch(self, task_ids: List[str]) -> Dict[str, Any]:
        """
        Execute a batch of tasks in parallel.
        Override this method to customize parallel execution.
        """
        results = {}
        for task_id in task_ids:
            # Get dependency results to pass as context
            dep_results = {
                dep_id: self.results[dep_id]
                for dep_id in self.dependencies.get(task_id, [])
            }

            # Execute task with dependency results as context
            try:
                result = self.tasks[task_id](dep_results)
                results[task_id] = {"status": "success", "result": result}
            except Exception as e:
                results[task_id] = {"status": "failed", "error": str(e)}
                # In production, implement retry logic here

        return results
```

#### Usage Example

```python
# Define tasks
def task_a(deps):
    """Analyze requirements"""
    print("Task A: Analyzing requirements")
    return {"requirements": ["auth", "api", "database"]}

def task_b(deps):
    """Design auth system (depends on A)"""
    print(f"Task B: Designing auth based on {deps['A']['result']}")
    return {"auth_design": "OAuth2 + JWT"}

def task_c(deps):
    """Design API (depends on A)"""
    print(f"Task C: Designing API based on {deps['A']['result']}")
    return {"api_design": "REST + GraphQL"}

def task_d(deps):
    """Implement auth (depends on B)"""
    print(f"Task D: Implementing {deps['B']['result']}")
    return {"auth_code": "auth.py"}

def task_e(deps):
    """Implement API (depends on C)"""
    print(f"Task E: Implementing {deps['C']['result']}")
    return {"api_code": "api.py"}

def task_f(deps):
    """Integration test (depends on D and E)"""
    print(f"Task F: Testing {deps['D']['result']} + {deps['E']['result']}")
    return {"test_result": "PASSED"}

# Define dependency graph
tasks = {
    "A": task_a,
    "B": task_b,
    "C": task_c,
    "D": task_d,
    "E": task_e,
    "F": task_f
}

dependencies = {
    "A": [],           # No dependencies
    "B": ["A"],        # Depends on A
    "C": ["A"],        # Depends on A
    "D": ["B"],        # Depends on B
    "E": ["C"],        # Depends on C
    "F": ["D", "E"]    # Depends on D and E
}

# Execute
executor = DAGExecutor(tasks, dependencies)
results = executor.execute()

# Execution order:
# Batch 1: A
# Batch 2: B, C (parallel)
# Batch 3: D, E (parallel)
# Batch 4: F
```

### Conditional Dependencies

Extend the DAG pattern to support conditional execution:

```python
class ConditionalDAGExecutor(DAGExecutor):
    """
    Extends DAG executor with conditional dependencies.

    Conditional dependency syntax:
    "B": [("A", lambda result: result["should_continue"])]

    Task B only executes if Task A's result satisfies the condition.
    """

    def __init__(self, tasks, dependencies, conditions=None):
        super().__init__(tasks, dependencies)
        self.conditions = conditions or {}

    def _should_execute(self, task_id: str) -> bool:
        """Check if task should execute based on conditions."""
        if task_id not in self.conditions:
            return True

        for dep_id, condition_fn in self.conditions[task_id]:
            dep_result = self.results[dep_id]
            if dep_result["status"] != "success":
                return False
            if not condition_fn(dep_result["result"]):
                return False

        return True

    def execute(self):
        """Execute DAG with conditional logic."""
        self.build_graph()

        if self.detect_cycle():
            raise ValueError("Cycle detected in dependency graph")

        ready_queue = deque([
            task_id for task_id in self.tasks
            if self.in_degree[task_id] == 0
        ])

        executed_count = 0
        skipped_tasks = set()

        while ready_queue:
            batch_size = len(ready_queue)
            current_batch = [ready_queue.popleft() for _ in range(batch_size)]

            # Filter batch based on conditions
            executable_batch = [
                task_id for task_id in current_batch
                if self._should_execute(task_id)
            ]

            skipped_batch = set(current_batch) - set(executable_batch)
            skipped_tasks.update(skipped_batch)

            # Execute batch
            if executable_batch:
                batch_results = self._execute_batch(executable_batch)
                self.results.update(batch_results)
                executed_count += len(executable_batch)

            # Mark skipped tasks
            for task_id in skipped_batch:
                self.results[task_id] = {"status": "skipped", "reason": "condition not met"}

            # Update ready queue
            for task_id in current_batch:
                for dependent_id in self.graph[task_id]:
                    self.in_degree[dependent_id] -= 1
                    if self.in_degree[dependent_id] == 0:
                        ready_queue.append(dependent_id)

        return self.results
```

**Example: Conditional Deployment Pipeline**

```python
def analyze_changes(deps):
    return {"has_api_changes": True, "has_db_changes": False}

def run_api_tests(deps):
    return {"api_tests": "PASSED"}

def run_db_migrations(deps):
    return {"migrations": "APPLIED"}

def deploy_to_staging(deps):
    return {"staging": "DEPLOYED"}

tasks = {
    "analyze": analyze_changes,
    "api_tests": run_api_tests,
    "db_migrations": run_db_migrations,
    "deploy": deploy_to_staging
}

dependencies = {
    "analyze": [],
    "api_tests": ["analyze"],
    "db_migrations": ["analyze"],
    "deploy": ["api_tests", "db_migrations"]
}

# Conditional execution
conditions = {
    "api_tests": [("analyze", lambda r: r["has_api_changes"])],
    "db_migrations": [("analyze", lambda r: r["has_db_changes"])]
}

executor = ConditionalDAGExecutor(tasks, dependencies, conditions)
results = executor.execute()

# Result: api_tests runs, db_migrations skipped
```

### Deadlock Detection and Prevention

**Deadlock**: Circular wait condition where tasks are stuck waiting for each other.

**Detection Strategy**:
1. **Build wait-for graph** during execution
2. **Run cycle detection** periodically
3. **Abort and report** if cycle found

**Prevention Strategies**:

1. **Resource ordering**: Always acquire resources in fixed order
2. **Timeout-based**: Tasks timeout if waiting too long
3. **Deadlock avoidance**: Don't allow resource allocation that could cause deadlock

```python
class DeadlockDetector:
    """
    Detects deadlocks in running DAG execution.
    Call periodically during execution.
    """

    def __init__(self):
        self.wait_for_graph = defaultdict(set)

    def add_wait(self, agent_id: str, waiting_for: str):
        """Record that agent_id is waiting for resource from waiting_for."""
        self.wait_for_graph[agent_id].add(waiting_for)

    def remove_wait(self, agent_id: str, finished_waiting_for: str):
        """Remove wait relationship when resource acquired."""
        self.wait_for_graph[agent_id].discard(finished_waiting_for)

    def detect_deadlock(self) -> List[List[str]]:
        """
        Detect deadlock cycles using DFS.
        Returns list of deadlock cycles found.
        """
        visited = set()
        rec_stack = set()
        deadlock_cycles = []

        def dfs(node, path):
            visited.add(node)
            rec_stack.add(node)
            path.append(node)

            for neighbor in self.wait_for_graph[node]:
                if neighbor not in visited:
                    dfs(neighbor, path.copy())
                elif neighbor in rec_stack:
                    # Found cycle
                    cycle_start = path.index(neighbor)
                    deadlock_cycles.append(path[cycle_start:])

            rec_stack.remove(node)

        for agent_id in self.wait_for_graph:
            if agent_id not in visited:
                dfs(agent_id, [])

        return deadlock_cycles
```

### Best Practices

1. **Keep DAGs Simple**: Limit to 20-30 tasks per DAG; break into sub-DAGs if larger
2. **Validate Early**: Detect cycles before execution starts
3. **Log Execution Path**: Record which tasks executed and in what order
4. **Handle Failures**: Decide early: fail-fast or continue with partial results
5. **Test Thoroughly**: Test with various dependency patterns and failure scenarios
6. **Monitor Performance**: Track time spent in each batch and overall execution time

### Common Pitfalls

❌ **Anti-Pattern**: Creating DAG from mutable state
```python
# BAD: Dependencies can change during execution
dependencies = global_config.get_dependencies()  # Might change!
```

✅ **Pattern**: Freeze dependencies before execution
```python
# GOOD: Immutable snapshot
dependencies = deepcopy(global_config.get_dependencies())
```

❌ **Anti-Pattern**: Ignoring task failures
```python
# BAD: Silent failure
if task_result.status == "failed":
    pass  # Continue anyway
```

✅ **Pattern**: Explicit failure handling policy
```python
# GOOD: Clear failure policy
if task_result.status == "failed":
    if task_id in critical_tasks:
        raise TaskExecutionError(f"Critical task {task_id} failed")
    else:
        logger.warning(f"Non-critical task {task_id} failed, continuing")
```

---

## 3. Dynamic Agent Management

### Overview

Static agent allocation (spawn N agents at startup) is inefficient for variable workloads:
- Waste resources during low activity periods
- Insufficient capacity during peak loads
- No adaptation to changing task complexity

**Solution**: Dynamic agent management with pool-based allocation and auto-scaling.

### Agent Pool Pattern

#### Theory

An **agent pool** maintains a collection of ready-to-use agents:
- **Pre-warming**: Keep minimum number of agents initialized
- **Dynamic scaling**: Spawn more agents under load
- **Recycling**: Return agents to pool after task completion
- **Health checks**: Remove unhealthy agents from pool

**Benefits**:
- Faster task start (no initialization delay)
- Efficient resource usage
- Automatic scaling
- Fault tolerance (replace failed agents)

#### When to Use

✅ **Use agent pools when**:
- Workload varies significantly over time
- Agent initialization is expensive (> 10 seconds)
- Need guaranteed response time (SLA)
- Running many similar tasks

❌ **Don't use pools when**:
- Workload is constant and predictable
- Agent initialization is fast (< 1 second)
- Tasks are highly heterogeneous (can't reuse agents)

#### Implementation

```python
import time
import threading
from queue import Queue, Empty
from enum import Enum
from typing import List, Optional, Callable

class AgentState(Enum):
    INITIALIZING = "initializing"
    IDLE = "idle"
    BUSY = "busy"
    UNHEALTHY = "unhealthy"
    TERMINATED = "terminated"

class PooledAgent:
    """Wrapper for agent with lifecycle management."""

    def __init__(self, agent_id: str, spawn_fn: Callable):
        self.agent_id = agent_id
        self.state = AgentState.INITIALIZING
        self.spawn_fn = spawn_fn
        self.agent_instance = None
        self.task_count = 0
        self.last_health_check = time.time()
        self.current_skills = []

    def initialize(self):
        """Initialize the agent instance."""
        self.agent_instance = self.spawn_fn()
        self.state = AgentState.IDLE

    def load_skills(self, skills: List[str]):
        """Load required skills into agent."""
        if not self.agent_instance:
            raise RuntimeError("Agent not initialized")
        # Skill loading logic here
        self.current_skills = skills

    def unload_skills(self):
        """Unload skills to free memory."""
        self.current_skills = []
        # Skill unloading logic here

    def execute_task(self, task):
        """Execute a task."""
        self.state = AgentState.BUSY
        try:
            result = self.agent_instance.execute(task)
            self.task_count += 1
            return result
        finally:
            self.state = AgentState.IDLE

    def health_check(self) -> bool:
        """Check if agent is healthy."""
        try:
            # Implement health check logic
            is_healthy = self.agent_instance.ping()
            self.last_health_check = time.time()
            if not is_healthy:
                self.state = AgentState.UNHEALTHY
            return is_healthy
        except Exception:
            self.state = AgentState.UNHEALTHY
            return False

    def terminate(self):
        """Terminate agent instance."""
        if self.agent_instance:
            self.agent_instance.shutdown()
        self.state = AgentState.TERMINATED

class AgentPool:
    """
    Manages a pool of agents with dynamic scaling.

    Features:
    - Pre-warming (minimum pool size)
    - Auto-scaling (maximum pool size)
    - Health checking
    - Graceful shutdown
    """

    def __init__(
        self,
        spawn_fn: Callable,
        min_size: int = 2,
        max_size: int = 10,
        warmup_time: int = 30,
        max_tasks_per_agent: int = 100,
        health_check_interval: int = 60
    ):
        self.spawn_fn = spawn_fn
        self.min_size = min_size
        self.max_size = max_size
        self.warmup_time = warmup_time
        self.max_tasks_per_agent = max_tasks_per_agent
        self.health_check_interval = health_check_interval

        self.agents: List[PooledAgent] = []
        self.available = Queue()
        self.busy = set()
        self.lock = threading.Lock()
        self.shutdown_flag = threading.Event()

        # Start background threads
        self.health_check_thread = threading.Thread(
            target=self._health_check_loop, daemon=True
        )
        self.health_check_thread.start()

    def initialize(self):
        """Pre-warm the pool with minimum number of agents."""
        print(f"Initializing agent pool with {self.min_size} agents...")
        for i in range(self.min_size):
            agent = self._spawn_agent(f"agent-{i}")
            self.agents.append(agent)
            self.available.put(agent)
        print(f"Agent pool initialized ({len(self.agents)} agents ready)")

    def _spawn_agent(self, agent_id: str) -> PooledAgent:
        """Spawn and initialize a new agent."""
        agent = PooledAgent(agent_id, self.spawn_fn)
        agent.initialize()
        return agent

    def acquire(
        self,
        skills: Optional[List[str]] = None,
        timeout: int = 30
    ) -> Optional[PooledAgent]:
        """
        Acquire an agent from the pool.

        Args:
            skills: Skills to load into agent
            timeout: Maximum wait time in seconds

        Returns:
            PooledAgent or None if timeout
        """
        start_time = time.time()

        while time.time() - start_time < timeout:
            try:
                # Try to get available agent
                agent = self.available.get(timeout=1)

                with self.lock:
                    # Verify agent is still healthy
                    if agent.state != AgentState.IDLE:
                        continue

                    # Check if agent needs recycling (too many tasks)
                    if agent.task_count >= self.max_tasks_per_agent:
                        self._recycle_agent(agent)
                        continue

                    # Load skills and mark as busy
                    if skills:
                        agent.load_skills(skills)
                    self.busy.add(agent)

                return agent

            except Empty:
                # No available agents, try to spawn new one
                with self.lock:
                    if len(self.agents) < self.max_size:
                        new_agent = self._spawn_agent(f"agent-{len(self.agents)}")
                        self.agents.append(new_agent)
                        if skills:
                            new_agent.load_skills(skills)
                        self.busy.add(new_agent)
                        return new_agent

        return None  # Timeout

    def release(self, agent: PooledAgent):
        """Return agent to the pool."""
        with self.lock:
            if agent in self.busy:
                self.busy.remove(agent)
                agent.unload_skills()

                # Check if agent is still healthy
                if agent.state == AgentState.IDLE:
                    self.available.put(agent)
                else:
                    # Replace unhealthy agent
                    self._recycle_agent(agent)

    def _recycle_agent(self, agent: PooledAgent):
        """Terminate and replace an agent."""
        agent.terminate()
        self.agents.remove(agent)

        # Spawn replacement if below minimum
        if len(self.agents) < self.min_size:
            new_agent = self._spawn_agent(f"agent-{len(self.agents)}")
            self.agents.append(new_agent)
            self.available.put(new_agent)

    def _health_check_loop(self):
        """Background thread for periodic health checks."""
        while not self.shutdown_flag.is_set():
            time.sleep(self.health_check_interval)

            with self.lock:
                for agent in self.agents[:]:  # Copy to avoid modification during iteration
                    if time.time() - agent.last_health_check > self.health_check_interval:
                        if not agent.health_check():
                            print(f"Agent {agent.agent_id} failed health check, recycling...")
                            self._recycle_agent(agent)

    def shutdown(self):
        """Gracefully shutdown the pool."""
        print("Shutting down agent pool...")
        self.shutdown_flag.set()

        with self.lock:
            # Terminate all agents
            for agent in self.agents:
                agent.terminate()
            self.agents.clear()

        print("Agent pool shutdown complete")

    def get_stats(self) -> dict:
        """Get pool statistics."""
        with self.lock:
            return {
                "total_agents": len(self.agents),
                "available": self.available.qsize(),
                "busy": len(self.busy),
                "total_tasks_executed": sum(a.task_count for a in self.agents),
                "unhealthy_agents": sum(
                    1 for a in self.agents if a.state == AgentState.UNHEALTHY
                )
            }
```

#### Usage Example

```python
def spawn_claude_agent():
    """Factory function to create agent instance."""
    # Initialize Claude agent
    return ClaudeAgent(model="claude-sonnet-4")

# Create pool
pool = AgentPool(
    spawn_fn=spawn_claude_agent,
    min_size=3,      # Keep 3 agents ready
    max_size=10,     # Scale up to 10 agents
    max_tasks_per_agent=50  # Recycle after 50 tasks
)

pool.initialize()

# Use pool
tasks = ["task1", "task2", "task3", ...]

for task in tasks:
    # Acquire agent with required skills
    agent = pool.acquire(skills=["builder-skill", "validator-skill"])

    if agent:
        try:
            result = agent.execute_task(task)
            print(f"Task result: {result}")
        finally:
            # Always release agent back to pool
            pool.release(agent)
    else:
        print("Failed to acquire agent (timeout)")

# Check stats
print(pool.get_stats())

# Cleanup
pool.shutdown()
```

### Auto-Scaling Strategies

#### Load-Based Scaling

Scale based on work queue depth:

```python
class AutoScalingPool(AgentPool):
    """Agent pool with automatic scaling based on queue depth."""

    def __init__(self, *args, scale_up_threshold=5, scale_down_threshold=2, **kwargs):
        super().__init__(*args, **kwargs)
        self.scale_up_threshold = scale_up_threshold
        self.scale_down_threshold = scale_down_threshold
        self.pending_tasks = Queue()

        # Start auto-scaling thread
        self.scaling_thread = threading.Thread(
            target=self._auto_scale_loop, daemon=True
        )
        self.scaling_thread.start()

    def _auto_scale_loop(self):
        """Background thread for auto-scaling decisions."""
        while not self.shutdown_flag.is_set():
            time.sleep(10)  # Check every 10 seconds

            with self.lock:
                queue_depth = self.pending_tasks.qsize()
                available_capacity = self.available.qsize()

                # Scale up if queue is deep and we have capacity
                if queue_depth > self.scale_up_threshold and len(self.agents) < self.max_size:
                    agents_to_add = min(
                        queue_depth // 2,  # Add half of queue depth
                        self.max_size - len(self.agents)  # Up to max_size
                    )

                    print(f"Scaling up: adding {agents_to_add} agents")
                    for i in range(agents_to_add):
                        agent = self._spawn_agent(f"agent-scale-{len(self.agents)}")
                        self.agents.append(agent)
                        self.available.put(agent)

                # Scale down if too many idle agents
                elif available_capacity > self.scale_down_threshold and len(self.agents) > self.min_size:
                    agents_to_remove = min(
                        available_capacity - self.scale_down_threshold,
                        len(self.agents) - self.min_size
                    )

                    print(f"Scaling down: removing {agents_to_remove} agents")
                    for _ in range(agents_to_remove):
                        try:
                            agent = self.available.get_nowait()
                            agent.terminate()
                            self.agents.remove(agent)
                        except Empty:
                            break
```

#### Predictive Scaling

Scale based on historical patterns:

```python
from collections import deque
from datetime import datetime, timedelta

class PredictiveScalingPool(AutoScalingPool):
    """Agent pool with predictive scaling based on historical load."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.load_history = deque(maxlen=1440)  # 24 hours at 1-minute granularity
        self.history_thread = threading.Thread(
            target=self._record_load_history, daemon=True
        )
        self.history_thread.start()

    def _record_load_history(self):
        """Record load metrics every minute."""
        while not self.shutdown_flag.is_set():
            time.sleep(60)

            with self.lock:
                self.load_history.append({
                    "timestamp": datetime.now(),
                    "queue_depth": self.pending_tasks.qsize(),
                    "busy_agents": len(self.busy),
                    "total_agents": len(self.agents)
                })

    def predict_load(self, minutes_ahead: int = 10) -> float:
        """Predict load N minutes in the future."""
        if len(self.load_history) < 60:
            return 0  # Not enough data

        # Simple prediction: average load at this time of day over past week
        current_time = datetime.now()
        target_time = current_time + timedelta(minutes=minutes_ahead)

        similar_periods = [
            entry["queue_depth"]
            for entry in self.load_history
            if abs((entry["timestamp"].hour * 60 + entry["timestamp"].minute) -
                   (target_time.hour * 60 + target_time.minute)) < 30
        ]

        return sum(similar_periods) / len(similar_periods) if similar_periods else 0

    def _auto_scale_loop(self):
        """Enhanced auto-scaling with prediction."""
        while not self.shutdown_flag.is_set():
            time.sleep(10)

            predicted_load = self.predict_load(minutes_ahead=10)

            with self.lock:
                current_capacity = len(self.agents)

                # Pre-scale based on prediction
                if predicted_load > current_capacity * 0.8:
                    agents_needed = int(predicted_load) - current_capacity
                    if agents_needed > 0 and len(self.agents) < self.max_size:
                        agents_to_add = min(agents_needed, self.max_size - len(self.agents))
                        print(f"Predictive scaling: adding {agents_to_add} agents for predicted load {predicted_load}")

                        for i in range(agents_to_add):
                            agent = self._spawn_agent(f"agent-pred-{len(self.agents)}")
                            self.agents.append(agent)
                            self.available.put(agent)
```

### Best Practices

1. **Set Appropriate Limits**: Min size = baseline load, Max size = 2-3x peak load
2. **Monitor Pool Health**: Track utilization, wait times, failure rates
3. **Implement Health Checks**: Detect and replace unhealthy agents automatically
4. **Recycle Agents**: Prevent memory leaks by recycling agents periodically
5. **Graceful Shutdown**: Wait for in-progress tasks before terminating
6. **Test Scaling**: Simulate load spikes to validate scaling behavior

### Common Pitfalls

❌ **Anti-Pattern**: No maximum pool size
```python
# BAD: Unbounded scaling can exhaust resources
pool = AgentPool(min_size=2, max_size=None)  # Dangerous!
```

✅ **Pattern**: Always set reasonable maximum
```python
# GOOD: Bounded scaling protects resources
pool = AgentPool(min_size=2, max_size=20)
```

❌ **Anti-Pattern**: Ignoring agent failures
```python
# BAD: Reuse failed agent
if agent.execute(task) == "ERROR":
    pool.release(agent)  # Return broken agent to pool
```

✅ **Pattern**: Health check before returning
```python
# GOOD: Verify agent health
result = agent.execute(task)
if result == "ERROR" and not agent.health_check():
    pool.remove(agent)  # Don't return broken agent
else:
    pool.release(agent)
```

---

## 4. State Management Patterns

### Overview

When multiple agents need to share state, challenges emerge:
- **Consistency**: Ensuring all agents see the same state
- **Concurrency**: Handling simultaneous updates
- **Conflicts**: Resolving contradictory changes
- **Persistence**: Surviving agent restarts

**Solutions**: Distributed state management patterns (CRDT, event sourcing, consensus)

### Shared State Synchronization

#### The Problem

Consider two agents working on the same codebase:
```
Time  Agent A                   Agent B
T1    Read file.py (v1)        Read file.py (v1)
T2    Modify line 10           Modify line 15
T3    Write file.py (v2a)      Write file.py (v2b)
T4    ❌ Conflict! Which version wins?
```

**Naive Solutions** (and why they fail):
- **Last-write-wins**: Agent B's changes clobber Agent A's
- **First-write-wins**: Agent B's changes are lost
- **Lock-based**: Agent B waits for Agent A (no parallelism)

#### CRDT Pattern (Conflict-Free Replicated Data Types)

**Theory**: Design data structures where concurrent updates can be merged automatically without conflicts.

**Example**: G-Counter (Grow-only Counter)

```python
class GCounter:
    """
    Grow-only counter that can be updated concurrently.

    Each agent maintains its own counter.
    Total value = sum of all agent counters.
    """

    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.counters = {agent_id: 0}

    def increment(self):
        """Increment this agent's counter."""
        self.counters[self.agent_id] += 1

    def merge(self, other: 'GCounter'):
        """Merge another agent's state."""
        for agent_id, count in other.counters.items():
            if agent_id in self.counters:
                # Take maximum (monotonic increase)
                self.counters[agent_id] = max(
                    self.counters[agent_id],
                    count
                )
            else:
                self.counters[agent_id] = count

    def value(self) -> int:
        """Get total count across all agents."""
        return sum(self.counters.values())

# Usage
agent_a_counter = GCounter("agent-a")
agent_b_counter = GCounter("agent-b")

# Concurrent increments
agent_a_counter.increment()
agent_a_counter.increment()
agent_b_counter.increment()

# Merge (no conflicts!)
agent_a_counter.merge(agent_b_counter)
print(agent_a_counter.value())  # 3 (2 + 1)
```

**Production CRDT**: OR-Set (Observed-Removed Set) for task lists

```python
import uuid
from typing import Set, Tuple, Any

class ORSet:
    """
    Observed-Removed Set CRDT for distributed task lists.

    Supports concurrent add/remove operations.
    """

    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        # Elements stored as (value, unique_id) tuples
        self.added: Set[Tuple[Any, str]] = set()
        self.removed: Set[str] = set()  # Store unique_ids

    def add(self, value: Any) -> str:
        """Add element to set."""
        unique_id = str(uuid.uuid4())
        self.added.add((value, unique_id))
        return unique_id

    def remove(self, value: Any):
        """Remove element from set."""
        # Mark all instances of this value as removed
        for v, uid in self.added:
            if v == value:
                self.removed.add(uid)

    def contains(self, value: Any) -> bool:
        """Check if value is in set."""
        for v, uid in self.added:
            if v == value and uid not in self.removed:
                return True
        return False

    def elements(self) -> Set[Any]:
        """Get all elements in set."""
        return {
            value for value, uid in self.added
            if uid not in self.removed
        }

    def merge(self, other: 'ORSet'):
        """Merge another agent's state."""
        self.added.update(other.added)
        self.removed.update(other.removed)

# Usage: Distributed task list
agent_a_tasks = ORSet("agent-a")
agent_b_tasks = ORSet("agent-b")

# Agent A adds and completes tasks
task1_id = agent_a_tasks.add("Implement auth")
task2_id = agent_a_tasks.add("Write tests")
agent_a_tasks.remove("Implement auth")  # Mark complete

# Agent B adds tasks concurrently
task3_id = agent_b_tasks.add("Write docs")

# Merge (no conflicts!)
agent_a_tasks.merge(agent_b_tasks)
print(agent_a_tasks.elements())  # {"Write tests", "Write docs"}
```

### Event Sourcing Pattern

**Theory**: Instead of storing current state, store sequence of events. State is derived by replaying events.

**Benefits**:
- Complete audit trail
- Time-travel debugging (replay to any point)
- Easy conflict resolution (merge event streams)

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List, Any
from enum import Enum

class EventType(Enum):
    TASK_CREATED = "task_created"
    TASK_COMPLETED = "task_completed"
    FILE_MODIFIED = "file_modified"
    AGENT_SPAWNED = "agent_spawned"

@dataclass
class Event:
    """Immutable event in the event stream."""
    event_id: str
    event_type: EventType
    agent_id: str
    timestamp: datetime
    data: dict

class EventStore:
    """
    Stores and replays events for state reconstruction.
    """

    def __init__(self):
        self.events: List[Event] = []
        self.snapshots = {}  # Periodic state snapshots for performance

    def append(self, event: Event):
        """Append event to stream (append-only)."""
        self.events.append(event)

    def get_events(
        self,
        after_id: str = None,
        event_types: List[EventType] = None
    ) -> List[Event]:
        """Get events matching criteria."""
        filtered = self.events

        if after_id:
            after_idx = next(
                (i for i, e in enumerate(self.events) if e.event_id == after_id),
                -1
            )
            filtered = self.events[after_idx + 1:]

        if event_types:
            filtered = [e for e in filtered if e.event_type in event_types]

        return filtered

    def replay(self, handlers: dict) -> Any:
        """
        Replay all events to reconstruct state.

        Args:
            handlers: Map of event_type -> handler function

        Returns:
            Final state
        """
        state = {}

        for event in self.events:
            if event.event_type in handlers:
                state = handlers[event.event_type](state, event)

        return state

# Usage: Reconstruct workflow state
event_store = EventStore()

# Record events
event_store.append(Event(
    event_id="evt-1",
    event_type=EventType.TASK_CREATED,
    agent_id="orchestrator",
    timestamp=datetime.now(),
    data={"task_id": "task-1", "description": "Implement auth"}
))

event_store.append(Event(
    event_id="evt-2",
    event_type=EventType.AGENT_SPAWNED,
    agent_id="orchestrator",
    timestamp=datetime.now(),
    data={"agent_id": "worker-1", "assigned_task": "task-1"}
))

event_store.append(Event(
    event_id="evt-3",
    event_type=EventType.TASK_COMPLETED,
    agent_id="worker-1",
    timestamp=datetime.now(),
    data={"task_id": "task-1", "result": "success"}
))

# Replay to reconstruct state
def handle_task_created(state, event):
    state.setdefault("tasks", {})[event.data["task_id"]] = {
        "status": "pending",
        "description": event.data["description"]
    }
    return state

def handle_agent_spawned(state, event):
    state.setdefault("agents", {})[event.data["agent_id"]] = {
        "status": "active",
        "assigned_task": event.data["assigned_task"]
    }
    return state

def handle_task_completed(state, event):
    state["tasks"][event.data["task_id"]]["status"] = "completed"
    return state

handlers = {
    EventType.TASK_CREATED: handle_task_created,
    EventType.AGENT_SPAWNED: handle_agent_spawned,
    EventType.TASK_COMPLETED: handle_task_completed
}

final_state = event_store.replay(handlers)
print(final_state)
```

### State Coordinator Pattern

Centralized component managing distributed state:

```python
import threading
from typing import Dict, Callable, Any

class StateCoordinator:
    """
    Centralized coordinator for distributed agent state.

    Features:
    - Atomic updates
    - Conflict resolution
    - State persistence
    - Change notifications
    """

    def __init__(self):
        self.state = {}
        self.lock = threading.RLock()
        self.version = 0
        self.subscribers = []  # Observers for state changes

    def read(self, key: str) -> Any:
        """Read state value."""
        with self.lock:
            return self.state.get(key)

    def write(self, key: str, value: Any, resolver: Callable = None):
        """
        Write state value with conflict resolution.

        Args:
            key: State key
            value: New value
            resolver: Conflict resolution function (old, new) -> resolved
        """
        with self.lock:
            if resolver and key in self.state:
                # Resolve conflict
                old_value = self.state[key]
                resolved_value = resolver(old_value, value)
                self.state[key] = resolved_value
            else:
                # Simple write
                self.state[key] = value

            self.version += 1
            self._notify_subscribers(key, self.state[key])

    def atomic_update(self, updates: Dict[str, Any]):
        """Atomically update multiple keys."""
        with self.lock:
            for key, value in updates.items():
                self.state[key] = value
            self.version += 1
            for key in updates:
                self._notify_subscribers(key, self.state[key])

    def compare_and_swap(self, key: str, expected: Any, new_value: Any) -> bool:
        """
        Atomic compare-and-swap operation.

        Returns True if swap succeeded, False if expected != actual.
        """
        with self.lock:
            if self.state.get(key) == expected:
                self.state[key] = new_value
                self.version += 1
                self._notify_subscribers(key, new_value)
                return True
            return False

    def subscribe(self, callback: Callable[[str, Any], None]):
        """Subscribe to state changes."""
        self.subscribers.append(callback)

    def _notify_subscribers(self, key: str, value: Any):
        """Notify subscribers of state change."""
        for callback in self.subscribers:
            try:
                callback(key, value)
            except Exception as e:
                print(f"Subscriber notification failed: {e}")

    def snapshot(self) -> dict:
        """Get immutable snapshot of current state."""
        with self.lock:
            return {
                "version": self.version,
                "state": dict(self.state)  # Deep copy
            }

# Usage
coordinator = StateCoordinator()

# Conflict resolution function
def merge_task_lists(old_list, new_list):
    """Merge two task lists, removing duplicates."""
    return list(set(old_list + new_list))

# Agent A writes
coordinator.write("pending_tasks", ["task-1", "task-2"])

# Agent B writes concurrently
coordinator.write(
    "pending_tasks",
    ["task-3", "task-2"],
    resolver=merge_task_lists
)

# Result: ["task-1", "task-2", "task-3"] (merged, no duplicates)
print(coordinator.read("pending_tasks"))

# Subscribe to changes
def on_state_change(key, value):
    print(f"State changed: {key} = {value}")

coordinator.subscribe(on_state_change)

# Compare-and-swap for atomic counter increment
while True:
    current = coordinator.read("counter") or 0
    if coordinator.compare_and_swap("counter", current, current + 1):
        break  # Success
    # Retry if value changed
```

### Best Practices

1. **Choose Right Pattern**: CRDT for eventual consistency, Event sourcing for auditability, Coordinator for strong consistency
2. **Minimize Shared State**: Only share what's necessary; prefer message passing
3. **Version Everything**: Track state versions to detect stale reads
4. **Test Concurrent Access**: Simulate multiple agents updating simultaneously
5. **Persist Critical State**: Use durable storage for important state
6. **Handle Partitions**: Plan for network splits and agent failures

---

## 5. Advanced Error Handling

### Overview

Production systems require sophisticated error handling beyond simple try/catch:
- **Retry Logic**: Automatically retry transient failures
- **Circuit Breakers**: Prevent cascading failures
- **Bulkheads**: Isolate failures to prevent spread
- **Saga Patterns**: Handle distributed transaction failures

### Retry Pattern with Exponential Backoff

**Theory**: Transient failures (network glitches, temporary overload) often resolve quickly. Retrying with increasing delays gives system time to recover.

```python
import time
import random
from typing import Callable, Any
from functools import wraps

class RetryConfig:
    """Configuration for retry behavior."""

    def __init__(
        self,
        max_attempts: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 60.0,
        exponential_base: float = 2.0,
        jitter: bool = True
    ):
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        self.jitter = jitter

def retry_with_backoff(config: RetryConfig = None):
    """
    Decorator for retrying functions with exponential backoff.

    Args:
        config: Retry configuration (uses defaults if None)
    """
    if config is None:
        config = RetryConfig()

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            attempt = 0
            while attempt < config.max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1

                    if attempt >= config.max_attempts:
                        # Final attempt failed
                        raise Exception(
                            f"Failed after {config.max_attempts} attempts. Last error: {e}"
                        ) from e

                    # Calculate delay with exponential backoff
                    delay = min(
                        config.base_delay * (config.exponential_base ** (attempt - 1)),
                        config.max_delay
                    )

                    # Add jitter to prevent thundering herd
                    if config.jitter:
                        delay *= (0.5 + random.random())

                    print(f"Attempt {attempt} failed: {e}. Retrying in {delay:.2f}s...")
                    time.sleep(delay)

        return wrapper
    return decorator

# Usage
@retry_with_backoff(RetryConfig(max_attempts=5, base_delay=2.0))
def call_flaky_api(task_id):
    """Simulated flaky API call."""
    if random.random() < 0.7:  # 70% failure rate
        raise ConnectionError("API temporarily unavailable")
    return {"task_id": task_id, "result": "success"}

result = call_flaky_api("task-123")
```

### Circuit Breaker Pattern

**Theory**: Prevent calling failing services to avoid cascading failures and give services time to recover.

**States**:
- **CLOSED**: Normal operation, requests pass through
- **OPEN**: Service is failing, requests fail immediately (fail-fast)
- **HALF_OPEN**: Testing if service recovered, limited requests allowed

```python
import time
import threading
from enum import Enum
from typing import Callable, Any

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    """
    Circuit breaker to prevent cascading failures.

    Transitions:
    CLOSED --[failures >= threshold]--> OPEN
    OPEN --[timeout elapsed]--> HALF_OPEN
    HALF_OPEN --[success]--> CLOSED
    HALF_OPEN --[failure]--> OPEN
    """

    def __init__(
        self,
        failure_threshold: int = 5,
        timeout_seconds: int = 60,
        half_open_max_calls: int = 1
    ):
        self.failure_threshold = failure_threshold
        self.timeout_seconds = timeout_seconds
        self.half_open_max_calls = half_open_max_calls

        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None
        self.half_open_calls = 0
        self.lock = threading.Lock()

    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute function through circuit breaker.

        Raises CircuitBreakerOpen if circuit is open.
        """
        with self.lock:
            if self.state == CircuitState.OPEN:
                # Check if timeout elapsed
                if time.time() - self.last_failure_time > self.timeout_seconds:
                    self.state = CircuitState.HALF_OPEN
                    self.half_open_calls = 0
                    print("Circuit breaker entering HALF_OPEN state")
                else:
                    raise CircuitBreakerOpen(
                        f"Circuit breaker is OPEN. Retry after "
                        f"{self.timeout_seconds - (time.time() - self.last_failure_time):.1f}s"
                    )

            if self.state == CircuitState.HALF_OPEN:
                if self.half_open_calls >= self.half_open_max_calls:
                    raise CircuitBreakerOpen("Circuit breaker HALF_OPEN call limit reached")
                self.half_open_calls += 1

        # Execute function
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e

    def _on_success(self):
        """Handle successful call."""
        with self.lock:
            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                print("Circuit breaker CLOSED (service recovered)")

            self.success_count += 1

    def _on_failure(self):
        """Handle failed call."""
        with self.lock:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.OPEN
                print("Circuit breaker OPEN (recovery test failed)")
            elif self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
                print(f"Circuit breaker OPEN ({self.failure_count} failures)")

    def get_state(self) -> CircuitState:
        """Get current state."""
        with self.lock:
            return self.state

    def reset(self):
        """Manually reset circuit breaker."""
        with self.lock:
            self.state = CircuitState.CLOSED
            self.failure_count = 0
            self.success_count = 0

class CircuitBreakerOpen(Exception):
    """Exception raised when circuit breaker is open."""
    pass

# Usage
circuit_breaker = CircuitBreaker(failure_threshold=3, timeout_seconds=30)

def call_external_service():
    """Simulated external service call."""
    if random.random() < 0.8:  # 80% failure rate
        raise ConnectionError("Service unavailable")
    return "success"

# Try calling service
for i in range(10):
    try:
        result = circuit_breaker.call(call_external_service)
        print(f"Call {i}: {result}")
    except CircuitBreakerOpen as e:
        print(f"Call {i}: Circuit OPEN - {e}")
    except Exception as e:
        print(f"Call {i}: Failed - {e}")
    time.sleep(1)
```

### Saga Pattern (Distributed Transactions)

**Theory**: In distributed systems, we can't use traditional ACID transactions. Sagas coordinate multi-step operations with compensating actions for rollback.

**Example**: Multi-agent feature development

```python
from dataclasses import dataclass
from typing import Callable, List, Any
from enum import Enum

class SagaStepStatus(Enum):
    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    COMPENSATING = "compensating"
    COMPENSATED = "compensated"

@dataclass
class SagaStep:
    """A single step in a saga with compensation."""
    name: str
    action: Callable  # Forward action
    compensation: Callable  # Rollback action
    status: SagaStepStatus = SagaStepStatus.PENDING
    result: Any = None
    error: Exception = None

class Saga:
    """
    Coordinates distributed transactions with compensation.

    If any step fails, executes compensation actions for completed steps.
    """

    def __init__(self, steps: List[SagaStep]):
        self.steps = steps
        self.completed_steps = []

    def execute(self) -> bool:
        """
        Execute saga.

        Returns True if all steps succeeded, False otherwise.
        """
        try:
            # Execute each step
            for step in self.steps:
                step.status = SagaStepStatus.EXECUTING
                print(f"Executing step: {step.name}")

                try:
                    step.result = step.action()
                    step.status = SagaStepStatus.COMPLETED
                    self.completed_steps.append(step)
                    print(f"Step {step.name} completed: {step.result}")

                except Exception as e:
                    step.status = SagaStepStatus.FAILED
                    step.error = e
                    print(f"Step {step.name} failed: {e}")

                    # Compensate for completed steps
                    self._compensate()
                    return False

            print("Saga completed successfully")
            return True

        except Exception as e:
            print(f"Saga failed with exception: {e}")
            self._compensate()
            return False

    def _compensate(self):
        """Execute compensation actions for completed steps (in reverse order)."""
        print("Starting compensation...")

        for step in reversed(self.completed_steps):
            step.status = SagaStepStatus.COMPENSATING
            print(f"Compensating step: {step.name}")

            try:
                step.compensation()
                step.status = SagaStepStatus.COMPENSATED
                print(f"Step {step.name} compensated")

            except Exception as e:
                print(f"Compensation failed for {step.name}: {e}")
                # Log critical error - compensation failed
                # Manual intervention may be required

        print("Compensation complete")

# Usage: Multi-step feature deployment
def deploy_frontend():
    print("  Deploying frontend...")
    if random.random() < 0.2:  # 20% failure
        raise Exception("Frontend deployment failed")
    return "frontend-v1.2.3"

def rollback_frontend():
    print("  Rolling back frontend...")
    return "frontend-v1.2.2"

def deploy_api():
    print("  Deploying API...")
    if random.random() < 0.2:  # 20% failure
        raise Exception("API deployment failed")
    return "api-v2.1.0"

def rollback_api():
    print("  Rolling back API...")
    return "api-v2.0.9"

def run_smoke_tests():
    print("  Running smoke tests...")
    if random.random() < 0.3:  # 30% failure
        raise Exception("Smoke tests failed")
    return "All tests passed"

def notify_rollback():
    print("  Notifying team of rollback...")

# Create saga
deployment_saga = Saga([
    SagaStep("deploy_frontend", deploy_frontend, rollback_frontend),
    SagaStep("deploy_api", deploy_api, rollback_api),
    SagaStep("smoke_tests", run_smoke_tests, notify_rollback)
])

# Execute (will automatically compensate on failure)
success = deployment_saga.execute()
print(f"Deployment {'succeeded' if success else 'failed'}")
```

### Bulkhead Pattern

**Theory**: Isolate resources to prevent failure in one area from consuming all resources.

```python
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import threading

class Bulkhead:
    """
    Isolates resources using separate thread pools.

    Prevents one failing operation from consuming all threads.
    """

    def __init__(self, max_concurrent: int = 5, queue_size: int = 10):
        self.executor = ThreadPoolExecutor(
            max_workers=max_concurrent,
            thread_name_prefix="bulkhead"
        )
        self.semaphore = threading.Semaphore(max_concurrent + queue_size)
        self.active_tasks = 0
        self.lock = threading.Lock()

    def execute(self, func: Callable, *args, timeout: int = 30, **kwargs) -> Any:
        """
        Execute function in isolated thread pool.

        Args:
            func: Function to execute
            timeout: Maximum execution time in seconds
        """
        # Acquire semaphore (blocks if queue is full)
        if not self.semaphore.acquire(timeout=timeout):
            raise BulkheadFull("Bulkhead queue is full")

        try:
            with self.lock:
                self.active_tasks += 1

            # Submit to thread pool
            future = self.executor.submit(func, *args, **kwargs)

            try:
                return future.result(timeout=timeout)
            except TimeoutError:
                future.cancel()
                raise TimeoutError(f"Task exceeded timeout of {timeout}s")

        finally:
            with self.lock:
                self.active_tasks -= 1
            self.semaphore.release()

    def get_stats(self) -> dict:
        """Get bulkhead statistics."""
        with self.lock:
            return {
                "active_tasks": self.active_tasks,
                "available_permits": self.semaphore._value
            }

class BulkheadFull(Exception):
    """Exception raised when bulkhead is at capacity."""
    pass

# Usage: Separate bulkheads for critical and non-critical operations
critical_bulkhead = Bulkhead(max_concurrent=10, queue_size=20)
background_bulkhead = Bulkhead(max_concurrent=3, queue_size=5)

def critical_task():
    """High-priority task."""
    return "critical result"

def background_task():
    """Low-priority task."""
    return "background result"

# Critical tasks get dedicated resources
result = critical_bulkhead.execute(critical_task)

# Background tasks isolated (can't starve critical)
result = background_bulkhead.execute(background_task)
```

### Best Practices

1. **Fail Fast**: Don't retry non-transient errors (authentication, validation)
2. **Limit Retries**: Unbounded retries can cause resource exhaustion
3. **Monitor Circuit Breakers**: Alert when circuits open
4. **Test Compensation**: Ensure saga compensations actually work
5. **Use Timeouts**: Every operation should have a timeout
6. **Log Errors**: Capture context for debugging

---

## 6. Communication Patterns

### Overview

Agents need to communicate and coordinate. Different patterns suit different scenarios:
- **Direct calls**: Synchronous request-response
- **Message queues**: Asynchronous, decoupled communication
- **Pub/Sub**: One-to-many event broadcasting
- **Request-Reply**: Async with correlation

### Message Queue Pattern

**Theory**: Decouple producers and consumers with persistent message queue.

```python
import queue
import threading
import uuid
from dataclasses import dataclass
from typing import Callable, Dict, List
from datetime import datetime

@dataclass
class Message:
    """A message in the queue."""
    id: str
    from_agent: str
    to_agent: str
    message_type: str
    payload: dict
    timestamp: datetime
    correlation_id: str = None

class MessageQueue:
    """
    Persistent message queue for agent communication.

    Features:
    - FIFO ordering
    - Message persistence
    - Dead letter queue
    - Message filtering
    """

    def __init__(self, max_retries: int = 3):
        self.queues: Dict[str, queue.Queue] = {}
        self.dead_letter_queue = queue.Queue()
        self.max_retries = max_retries
        self.retry_counts: Dict[str, int] = {}
        self.lock = threading.Lock()

    def send(self, message: Message):
        """Send message to agent's queue."""
        with self.lock:
            if message.to_agent not in self.queues:
                self.queues[message.to_agent] = queue.Queue()

            self.queues[message.to_agent].put(message)

    def receive(
        self,
        agent_id: str,
        timeout: int = None,
        message_type: str = None
    ) -> Message:
        """
        Receive next message for agent.

        Args:
            agent_id: Agent receiving message
            timeout: Max wait time (None = block forever)
            message_type: Filter by message type

        Returns:
            Next message or None if timeout
        """
        with self.lock:
            if agent_id not in self.queues:
                self.queues[agent_id] = queue.Queue()

        agent_queue = self.queues[agent_id]

        while True:
            try:
                message = agent_queue.get(timeout=timeout)

                # Filter by type if specified
                if message_type and message.message_type != message_type:
                    # Put back and continue
                    agent_queue.put(message)
                    continue

                return message

            except queue.Empty:
                return None

    def ack(self, message: Message):
        """Acknowledge message processed successfully."""
        with self.lock:
            if message.id in self.retry_counts:
                del self.retry_counts[message.id]

    def nack(self, message: Message):
        """
        Negative acknowledge - requeue or send to dead letter queue.
        """
        with self.lock:
            retry_count = self.retry_counts.get(message.id, 0)
            retry_count += 1
            self.retry_counts[message.id] = retry_count

            if retry_count >= self.max_retries:
                # Send to dead letter queue
                print(f"Message {message.id} failed {retry_count} times, moving to DLQ")
                self.dead_letter_queue.put(message)
            else:
                # Requeue
                print(f"Message {message.id} failed, requeuing (attempt {retry_count})")
                self.send(message)

# Usage
mq = MessageQueue()

# Agent A sends task to Agent B
task_message = Message(
    id=str(uuid.uuid4()),
    from_agent="agent-a",
    to_agent="agent-b",
    message_type="TASK_ASSIGNMENT",
    payload={"task_id": "task-123", "description": "Implement auth"},
    timestamp=datetime.now()
)

mq.send(task_message)

# Agent B receives and processes
message = mq.receive("agent-b")
if message:
    try:
        # Process message
        print(f"Processing: {message.payload}")
        mq.ack(message)
    except Exception as e:
        print(f"Processing failed: {e}")
        mq.nack(message)
```

### Pub/Sub Pattern

**Theory**: Publish events to topics, multiple subscribers receive copies.

```python
from typing import Callable, List, Set
from collections import defaultdict

class PubSubBroker:
    """
    Publish-subscribe message broker.

    Features:
    - Topic-based routing
    - Multiple subscribers per topic
    - Wildcard subscriptions
    """

    def __init__(self):
        self.subscribers: Dict[str, Set[Callable]] = defaultdict(set)
        self.lock = threading.Lock()

    def subscribe(self, topic: str, callback: Callable):
        """Subscribe to topic."""
        with self.lock:
            self.subscribers[topic].add(callback)

    def unsubscribe(self, topic: str, callback: Callable):
        """Unsubscribe from topic."""
        with self.lock:
            self.subscribers[topic].discard(callback)

    def publish(self, topic: str, message: dict):
        """
        Publish message to topic.

        All subscribers receive a copy.
        """
        with self.lock:
            callbacks = self.subscribers.get(topic, set())

        # Notify all subscribers (outside lock to prevent deadlock)
        for callback in callbacks:
            try:
                callback(topic, message)
            except Exception as e:
                print(f"Subscriber callback failed: {e}")

# Usage
broker = PubSubBroker()

# Multiple agents subscribe to task events
def agent_a_handler(topic, message):
    print(f"Agent A received on {topic}: {message}")

def agent_b_handler(topic, message):
    print(f"Agent B received on {topic}: {message}")

broker.subscribe("task.completed", agent_a_handler)
broker.subscribe("task.completed", agent_b_handler)

# Orchestrator publishes event
broker.publish("task.completed", {
    "task_id": "task-123",
    "result": "success",
    "agent": "worker-1"
})

# Both Agent A and Agent B receive the event
```

### Best Practices

1. **Use Right Pattern**: Direct calls for RPC, queues for async work, pub/sub for events
2. **Message Versioning**: Version message schemas for backward compatibility
3. **Idempotency**: Ensure messages can be processed multiple times safely
4. **Correlation IDs**: Track request-reply patterns
5. **Monitor Queues**: Alert on queue depth and dead letters

---

## 7. Performance Optimization

### Overview

Production orchestration requires optimization for:
- **Cost**: API tokens, compute resources
- **Latency**: Response time, throughput
- **Reliability**: Success rate, availability

### Throttling and Rate Limiting

**Theory**: Prevent overwhelming APIs or agents with too many concurrent requests.

```python
import time
import threading
from collections import deque

class TokenBucket:
    """
    Token bucket rate limiter.

    Allows bursts while maintaining average rate.
    """

    def __init__(self, rate: float, capacity: int):
        """
        Args:
            rate: Tokens per second
            capacity: Maximum burst size
        """
        self.rate = rate
        self.capacity = capacity
        self.tokens = capacity
        self.last_update = time.time()
        self.lock = threading.Lock()

    def acquire(self, tokens: int = 1, blocking: bool = True) -> bool:
        """
        Acquire tokens from bucket.

        Args:
            tokens: Number of tokens to acquire
            blocking: Wait if insufficient tokens

        Returns:
            True if acquired, False if not available (non-blocking only)
        """
        while True:
            with self.lock:
                now = time.time()
                elapsed = now - self.last_update
                self.last_update = now

                # Refill tokens
                self.tokens = min(
                    self.capacity,
                    self.tokens + elapsed * self.rate
                )

                if self.tokens >= tokens:
                    self.tokens -= tokens
                    return True

                if not blocking:
                    return False

            # Wait before retrying
            time.sleep(0.1)

# Usage: Rate limit API calls
rate_limiter = TokenBucket(rate=10.0, capacity=20)  # 10 req/s, burst of 20

for i in range(100):
    rate_limiter.acquire(tokens=1)
    print(f"Request {i} at {time.time()}")
    # Make API call here
```

### Load Balancing

**Theory**: Distribute work evenly across agents.

```python
class LoadBalancer:
    """
    Distributes tasks across agents using various strategies.
    """

    def __init__(self, agents: List[str], strategy: str = "round-robin"):
        self.agents = agents
        self.strategy = strategy
        self.current_index = 0
        self.request_counts = {agent: 0 for agent in agents}
        self.lock = threading.Lock()

    def select_agent(self) -> str:
        """Select agent using configured strategy."""
        with self.lock:
            if self.strategy == "round-robin":
                agent = self.agents[self.current_index]
                self.current_index = (self.current_index + 1) % len(self.agents)
                self.request_counts[agent] += 1
                return agent

            elif self.strategy == "least-loaded":
                # Select agent with fewest requests
                agent = min(self.agents, key=lambda a: self.request_counts[a])
                self.request_counts[agent] += 1
                return agent

            else:
                raise ValueError(f"Unknown strategy: {self.strategy}")

    def report_completion(self, agent: str):
        """Report task completion to update load."""
        with self.lock:
            self.request_counts[agent] -= 1

# Usage
lb = LoadBalancer(["agent-1", "agent-2", "agent-3"], strategy="least-loaded")

for task in tasks:
    agent = lb.select_agent()
    assign_task(agent, task)
```

### Token Budget Management

Track and optimize API token usage:

```python
class TokenBudget:
    """
    Manages token budget for Claude API calls.
    """

    def __init__(self, daily_budget: int):
        self.daily_budget = daily_budget
        self.used_today = 0
        self.reset_time = time.time() + 86400  # 24 hours
        self.lock = threading.Lock()

    def can_spend(self, tokens: int) -> bool:
        """Check if budget allows spending tokens."""
        with self.lock:
            self._reset_if_needed()
            return self.used_today + tokens <= self.daily_budget

    def spend(self, tokens: int) -> bool:
        """Spend tokens if budget allows."""
        with self.lock:
            self._reset_if_needed()

            if self.used_today + tokens <= self.daily_budget:
                self.used_today += tokens
                return True
            return False

    def _reset_if_needed(self):
        """Reset budget if 24 hours elapsed."""
        if time.time() >= self.reset_time:
            self.used_today = 0
            self.reset_time = time.time() + 86400

    def get_remaining(self) -> int:
        """Get remaining budget."""
        with self.lock:
            self._reset_if_needed()
            return self.daily_budget - self.used_today

# Usage
budget = TokenBudget(daily_budget=1_000_000)  # 1M tokens/day

if budget.can_spend(5000):
    # Make API call
    result = claude.complete(prompt, max_tokens=5000)
    budget.spend(result.usage.total_tokens)
```

### Best Practices

1. **Measure First**: Profile before optimizing
2. **Set Budgets**: Prevent runaway costs
3. **Cache Aggressively**: Reuse results when safe
4. **Batch Operations**: Reduce overhead
5. **Monitor Metrics**: Track latency, cost, throughput

---

## 8. Advanced Workflow Patterns

### Overview

Beyond simple parallel execution, complex workflows require sophisticated coordination patterns.

### Fan-Out/Fan-In Pattern

**Theory**: Split work into parallel tasks (fan-out), then aggregate results (fan-in).

```
        Start
          │
          ▼
    ┌─────┴─────┐
    │ Fan-Out   │
    └┬──┬──┬──┬─┘
     │  │  │  │
     ▼  ▼  ▼  ▼
    T1 T2 T3 T4  (Parallel execution)
     │  │  │  │
     └──┴──┴──┘
          │
          ▼
    ┌─────┴─────┐
    │  Fan-In   │
    └───────────┘
          │
          ▼
        Result
```

**Implementation**:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Callable, Any

class FanOutFanIn:
    """
    Executes tasks in parallel and aggregates results.
    """

    def __init__(self, max_workers: int = 10):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def execute(
        self,
        tasks: List[Callable],
        aggregator: Callable[[List[Any]], Any]
    ) -> Any:
        """
        Fan-out: Execute tasks in parallel
        Fan-in: Aggregate results

        Args:
            tasks: List of callables to execute
            aggregator: Function to combine results

        Returns:
            Aggregated result
        """
        # Fan-out: Submit all tasks
        futures = [self.executor.submit(task) for task in tasks]

        # Collect results as they complete
        results = []
        for future in as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                print(f"Task failed: {e}")
                results.append(None)

        # Fan-in: Aggregate results
        return aggregator(results)

# Usage: Parallel research across multiple sources
def research_source_1():
    return {"source": "anthropic-blog", "findings": [...]}

def research_source_2():
    return {"source": "github-releases", "findings": [...]}

def research_source_3():
    return {"source": "arxiv-papers", "findings": [...]}

def aggregate_research(results):
    """Combine all research findings."""
    all_findings = []
    for result in results:
        if result:
            all_findings.extend(result["findings"])
    return {"total_findings": len(all_findings), "findings": all_findings}

pattern = FanOutFanIn(max_workers=3)
aggregated = pattern.execute(
    tasks=[research_source_1, research_source_2, research_source_3],
    aggregator=aggregate_research
)
```

### Pipeline Pattern

**Theory**: Sequential stages where output of one stage feeds next stage.

```
Input → Stage1 → Stage2 → Stage3 → Output
```

**Implementation**:

```python
from typing import List, Callable, Any

class Pipeline:
    """
    Executes stages sequentially, passing output to next stage.
    """

    def __init__(self, stages: List[Callable[[Any], Any]]):
        self.stages = stages

    def execute(self, initial_input: Any) -> Any:
        """Execute pipeline stages sequentially."""
        current_value = initial_input

        for i, stage in enumerate(self.stages):
            try:
                print(f"Stage {i+1}: {stage.__name__}")
                current_value = stage(current_value)
            except Exception as e:
                raise PipelineError(
                    f"Stage {i+1} ({stage.__name__}) failed: {e}"
                ) from e

        return current_value

class PipelineError(Exception):
    pass

# Usage: Multi-stage data processing
def extract_data(input_path):
    """Stage 1: Extract raw data."""
    return {"raw_data": [...], "metadata": {...}}

def transform_data(data):
    """Stage 2: Transform and clean."""
    transformed = process(data["raw_data"])
    return {"transformed_data": transformed, "metadata": data["metadata"]}

def load_data(data):
    """Stage 3: Load into database."""
    db.insert(data["transformed_data"])
    return {"status": "loaded", "count": len(data["transformed_data"])}

pipeline = Pipeline([extract_data, transform_data, load_data])
result = pipeline.execute(input_path="data.csv")
```

### Map-Reduce Pattern

**Theory**: Map phase applies function to each item in parallel, Reduce phase combines results.

```
Input: [1, 2, 3, 4, 5]

Map:    f(1)  f(2)  f(3)  f(4)  f(5)  (Parallel)
          │     │     │     │     │
        [2]   [4]   [6]   [8]  [10]

Reduce: combine([2, 4, 6, 8, 10])
          │
        Sum: 30
```

**Implementation**:

```python
from typing import List, Callable, TypeVar, Any
from concurrent.futures import ThreadPoolExecutor

T = TypeVar('T')
R = TypeVar('R')

class MapReduce:
    """
    Classic map-reduce pattern for parallel data processing.
    """

    def __init__(self, max_workers: int = 10):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def execute(
        self,
        data: List[T],
        mapper: Callable[[T], R],
        reducer: Callable[[List[R]], Any]
    ) -> Any:
        """
        Map: Apply mapper to each item in parallel
        Reduce: Combine mapped results

        Args:
            data: Input data
            mapper: Function to apply to each item
            reducer: Function to combine results

        Returns:
            Reduced result
        """
        # Map phase (parallel)
        futures = [self.executor.submit(mapper, item) for item in data]
        mapped_results = [f.result() for f in futures]

        # Reduce phase
        return reducer(mapped_results)

# Usage: Analyze 1000+ files in parallel
def analyze_file(file_path):
    """Map: Analyze single file."""
    lines = count_lines(file_path)
    complexity = calculate_complexity(file_path)
    return {"file": file_path, "lines": lines, "complexity": complexity}

def aggregate_results(results):
    """Reduce: Combine all file analyses."""
    total_lines = sum(r["lines"] for r in results)
    avg_complexity = sum(r["complexity"] for r in results) / len(results)
    return {
        "total_files": len(results),
        "total_lines": total_lines,
        "avg_complexity": avg_complexity
    }

mr = MapReduce(max_workers=20)
files = glob.glob("**/*.py", recursive=True)  # 1000+ files
analysis = mr.execute(files, analyze_file, aggregate_results)
```

### Scatter-Gather Pattern

**Theory**: Scatter requests to multiple services, gather responses with timeout.

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Callable, Any, Optional

class ScatterGather:
    """
    Scatter requests to multiple services, gather with timeout.
    """

    def __init__(self, timeout: int = 10, max_workers: int = 10):
        self.timeout = timeout
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def execute(
        self,
        requests: List[Callable],
        aggregator: Callable[[List[Any]], Any] = None
    ) -> List[Any]:
        """
        Scatter: Send requests in parallel
        Gather: Collect responses (with timeout)

        Args:
            requests: List of request functions
            aggregator: Optional function to combine results

        Returns:
            List of results (or aggregated result)
        """
        # Scatter
        futures = {
            self.executor.submit(req): i
            for i, req in enumerate(requests)
        }

        # Gather with timeout
        results = [None] * len(requests)
        for future in as_completed(futures, timeout=self.timeout):
            index = futures[future]
            try:
                results[index] = future.result()
            except Exception as e:
                print(f"Request {index} failed: {e}")
                results[index] = {"error": str(e)}

        # Cancel slow requests
        for future in futures:
            if not future.done():
                future.cancel()

        # Aggregate if requested
        if aggregator:
            return aggregator([r for r in results if r is not None])

        return results

# Usage: Query multiple data sources with timeout
def query_source_a():
    return search_api_a(query="Claude best practices")

def query_source_b():
    return search_api_b(query="Claude best practices")

def query_source_c():
    return search_api_c(query="Claude best practices")

def merge_results(results):
    """Combine search results from all sources."""
    all_results = []
    for result in results:
        if "error" not in result:
            all_results.extend(result.get("hits", []))
    return deduplicate(all_results)

sg = ScatterGather(timeout=5)
combined = sg.execute(
    requests=[query_source_a, query_source_b, query_source_c],
    aggregator=merge_results
)
```

### Choreography vs Orchestration

**Orchestration** (Centralized):
- Central coordinator directs all agents
- Coordinator knows complete workflow
- Easier to understand and debug
- Single point of failure

**Choreography** (Decentralized):
- Agents react to events autonomously
- Each agent knows only its responsibilities
- More resilient (no single point of failure)
- Harder to trace execution flow

**When to use Orchestration**:
- Complex workflows with many decision points
- Need centralized monitoring and control
- SLA requirements
- Clear owner for workflow

**When to use Choreography**:
- Loose coupling required
- Event-driven architecture
- Microservices communication
- High availability critical

---

## 9. Monitoring and Observability

### Overview

Production orchestration requires comprehensive observability:
- **Metrics**: Quantitative measurements (latency, throughput, cost)
- **Logs**: Detailed execution traces
- **Traces**: Request flow through system
- **Health Checks**: Agent and service availability

### Distributed Tracing

**Theory**: Track requests across multiple agents to understand flow and identify bottlenecks.

```python
import time
import uuid
from typing import Optional, Dict, List
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Span:
    """A single unit of work in distributed trace."""
    trace_id: str
    span_id: str
    parent_span_id: Optional[str]
    operation_name: str
    start_time: float
    end_time: Optional[float] = None
    tags: Dict[str, str] = field(default_factory=dict)
    logs: List[Dict] = field(default_factory=list)

    def finish(self):
        """Mark span as complete."""
        self.end_time = time.time()

    def duration(self) -> float:
        """Get span duration in seconds."""
        if self.end_time:
            return self.end_time - self.start_time
        return time.time() - self.start_time

    def log(self, message: str, **fields):
        """Add log entry to span."""
        self.logs.append({
            "timestamp": time.time(),
            "message": message,
            **fields
        })

class Tracer:
    """
    Distributed tracer for multi-agent workflows.
    """

    def __init__(self):
        self.spans: Dict[str, Span] = {}
        self.active_spans: Dict[str, str] = {}  # agent_id -> span_id

    def start_span(
        self,
        operation_name: str,
        agent_id: str,
        parent_span_id: Optional[str] = None,
        trace_id: Optional[str] = None
    ) -> Span:
        """Start new span."""
        if not trace_id:
            # Start new trace
            trace_id = str(uuid.uuid4())

        span = Span(
            trace_id=trace_id,
            span_id=str(uuid.uuid4()),
            parent_span_id=parent_span_id or self.active_spans.get(agent_id),
            operation_name=operation_name,
            start_time=time.time(),
            tags={"agent_id": agent_id}
        )

        self.spans[span.span_id] = span
        self.active_spans[agent_id] = span.span_id

        return span

    def finish_span(self, span_id: str):
        """Finish span."""
        if span_id in self.spans:
            self.spans[span_id].finish()

    def get_trace(self, trace_id: str) -> List[Span]:
        """Get all spans for a trace."""
        return [
            span for span in self.spans.values()
            if span.trace_id == trace_id
        ]

    def visualize_trace(self, trace_id: str):
        """Print trace visualization."""
        spans = sorted(
            self.get_trace(trace_id),
            key=lambda s: s.start_time
        )

        print(f"\nTrace: {trace_id}")
        print("=" * 80)

        for span in spans:
            indent = "  " * self._get_depth(span)
            duration_ms = span.duration() * 1000
            print(f"{indent}{span.operation_name} ({duration_ms:.2f}ms)")

            for log in span.logs:
                print(f"{indent}  └─ {log['message']}")

    def _get_depth(self, span: Span) -> int:
        """Calculate span depth in trace tree."""
        depth = 0
        current = span
        while current.parent_span_id:
            depth += 1
            current = self.spans.get(current.parent_span_id)
            if not current:
                break
        return depth

# Usage
tracer = Tracer()

# Orchestrator starts root span
root_span = tracer.start_span("orchestrate_feature", agent_id="orchestrator")
root_span.log("Starting feature orchestration")

# Spawn agents (child spans)
agent_a_span = tracer.start_span(
    "implement_frontend",
    agent_id="agent-a",
    parent_span_id=root_span.span_id,
    trace_id=root_span.trace_id
)
agent_a_span.log("Frontend implementation started")
time.sleep(0.5)  # Simulate work
agent_a_span.log("Frontend implementation complete")
tracer.finish_span(agent_a_span.span_id)

agent_b_span = tracer.start_span(
    "implement_api",
    agent_id="agent-b",
    parent_span_id=root_span.span_id,
    trace_id=root_span.trace_id
)
agent_b_span.log("API implementation started")
time.sleep(0.3)  # Simulate work
agent_b_span.log("API implementation complete")
tracer.finish_span(agent_b_span.span_id)

root_span.log("Feature orchestration complete")
tracer.finish_span(root_span.span_id)

# Visualize trace
tracer.visualize_trace(root_span.trace_id)
```

### Metrics Collection

```python
import threading
from collections import defaultdict
from typing import Dict, List
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class Metric:
    """A single metric measurement."""
    name: str
    value: float
    timestamp: float
    tags: Dict[str, str]

class MetricsCollector:
    """
    Collects and aggregates metrics from orchestration.
    """

    def __init__(self):
        self.metrics: List[Metric] = []
        self.counters = defaultdict(int)
        self.gauges = defaultdict(float)
        self.histograms = defaultdict(list)
        self.lock = threading.Lock()

    def increment(self, name: str, value: int = 1, **tags):
        """Increment counter metric."""
        with self.lock:
            key = (name, frozenset(tags.items()))
            self.counters[key] += value

            self.metrics.append(Metric(
                name=name,
                value=value,
                timestamp=time.time(),
                tags=tags
            ))

    def gauge(self, name: str, value: float, **tags):
        """Set gauge metric (current value)."""
        with self.lock:
            key = (name, frozenset(tags.items()))
            self.gauges[key] = value

            self.metrics.append(Metric(
                name=name,
                value=value,
                timestamp=time.time(),
                tags=tags
            ))

    def histogram(self, name: str, value: float, **tags):
        """Record histogram value (for percentile calculations)."""
        with self.lock:
            key = (name, frozenset(tags.items()))
            self.histograms[key].append(value)

            self.metrics.append(Metric(
                name=name,
                value=value,
                timestamp=time.time(),
                tags=tags
            ))

    def get_percentile(self, name: str, percentile: float, **tags) -> float:
        """Calculate percentile for histogram."""
        with self.lock:
            key = (name, frozenset(tags.items()))
            values = sorted(self.histograms[key])

            if not values:
                return 0.0

            index = int(len(values) * (percentile / 100.0))
            return values[min(index, len(values) - 1)]

    def summary(self) -> dict:
        """Get metrics summary."""
        with self.lock:
            return {
                "counters": dict(self.counters),
                "gauges": dict(self.gauges),
                "histogram_counts": {k: len(v) for k, v in self.histograms.items()}
            }

# Usage
metrics = MetricsCollector()

# Track task execution
metrics.increment("tasks.started", agent="agent-a", task_type="implementation")
start = time.time()
# ... execute task ...
duration = time.time() - start
metrics.histogram("task.duration_ms", duration * 1000, agent="agent-a")
metrics.increment("tasks.completed", agent="agent-a", status="success")

# Track agent pool
metrics.gauge("agent_pool.size", 10)
metrics.gauge("agent_pool.available", 7)
metrics.gauge("agent_pool.busy", 3)

# Get p95 latency
p95_latency = metrics.get_percentile("task.duration_ms", 95)
print(f"P95 latency: {p95_latency:.2f}ms")
```

### Health Checks

```python
from enum import Enum
from typing import Callable, Dict, List

class HealthStatus(Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"

class HealthCheck:
    """
    Monitors health of agents and dependencies.
    """

    def __init__(self):
        self.checks: Dict[str, Callable[[], bool]] = {}
        self.last_results: Dict[str, HealthStatus] = {}

    def register(self, name: str, check_fn: Callable[[], bool]):
        """Register health check."""
        self.checks[name] = check_fn

    def run_checks(self) -> Dict[str, HealthStatus]:
        """Run all health checks."""
        results = {}

        for name, check_fn in self.checks.items():
            try:
                is_healthy = check_fn()
                results[name] = HealthStatus.HEALTHY if is_healthy else HealthStatus.UNHEALTHY
            except Exception as e:
                print(f"Health check {name} failed: {e}")
                results[name] = HealthStatus.UNHEALTHY

        self.last_results = results
        return results

    def is_healthy(self) -> bool:
        """Check if all components are healthy."""
        if not self.last_results:
            self.run_checks()

        return all(
            status == HealthStatus.HEALTHY
            for status in self.last_results.values()
        )

    def get_summary(self) -> dict:
        """Get health summary."""
        if not self.last_results:
            self.run_checks()

        healthy_count = sum(1 for s in self.last_results.values() if s == HealthStatus.HEALTHY)
        total_count = len(self.last_results)

        return {
            "overall_status": "healthy" if self.is_healthy() else "unhealthy",
            "healthy_checks": healthy_count,
            "total_checks": total_count,
            "checks": {name: status.value for name, status in self.last_results.items()}
        }

# Usage
health = HealthCheck()

# Register checks
health.register("database", lambda: db.ping())
health.register("agent_pool", lambda: pool.available.qsize() > 0)
health.register("api_quota", lambda: budget.get_remaining() > 10000)

# Run checks
results = health.run_checks()
print(health.get_summary())
```

---

## 10. Real-World Scenarios

### Scenario 1: Large-Scale Codebase Refactoring (1000+ Files)

**Challenge**: Refactor 1200 Python files from sync to async/await

**Pattern**: Map-Reduce with Agent Pool

**Implementation**:

```
1. Analysis Phase:
   - Scan all files (Map)
   - Classify by complexity (Reduce)
   - Build dependency graph

2. Execution Phase:
   - Spawn agent pool (10 agents)
   - Partition files by dependencies (DAG)
   - Execute refactoring in waves (topological order)
   - Each agent:
     * Loads refactoring skill
     * Refactors assigned files
     * Runs tests
     * Creates PR

3. Validation Phase:
   - Aggregate all changes
   - Run full test suite
   - Merge PRs in dependency order

Result: 1200 files refactored in 6 hours (vs 3 weeks manually)
```

### Scenario 2: Multi-Environment Deployment Pipeline

**Challenge**: Deploy to dev → staging → prod with validation gates

**Pattern**: Pipeline with Circuit Breakers

**Implementation**:

```
1. Pipeline Stages:
   Stage 1: Deploy to dev
   Stage 2: Run integration tests (dev)
   Stage 3: Deploy to staging (if tests pass)
   Stage 4: Run smoke tests (staging)
   Stage 5: Deploy to prod (if smoke passes)

2. Circuit Breakers:
   - Each environment has circuit breaker
   - Opens if deployment fails 3 times
   - Prevents cascading failures

3. Saga for Rollback:
   - If any stage fails, execute compensations
   - Rollback deployments in reverse order
   - Notify team of failure

Result: 99.8% deployment success rate, <5 min rollback time
```

### Scenario 3: Parallel Research Synthesis (10+ Sources)

**Challenge**: Research and synthesize information from 15 independent sources

**Pattern**: Fan-Out/Fan-In with State Coordinator

**Implementation**:

```
1. Fan-Out Phase:
   - Spawn 15 research agents
   - Each loads research-skill
   - Each assigned one source
   - Parallel research execution

2. State Coordination:
   - Shared state coordinator tracks findings
   - CRDT for conflict-free merging
   - Each agent appends to shared findings

3. Fan-In Phase:
   - Synthesis agent aggregates all findings
   - Removes duplicates (CRDT handles this)
   - Generates comprehensive report

Result: 15 sources researched in 10 minutes (vs 2 hours sequentially)
```

---

## 11. Troubleshooting and Debugging

### Common Issues

**Issue: Deadlock in dependency graph**
```
Symptom: Workflow hangs, some tasks never start
Diagnosis: Run cycle detection algorithm
Solution: Review dependencies, remove cycles
```

**Issue: Agent pool exhaustion**
```
Symptom: Timeout acquiring agents
Diagnosis: Check pool.get_stats(), all agents busy
Solution: Increase max_pool_size or reduce concurrency
```

**Issue: Circuit breaker stuck OPEN**
```
Symptom: All requests fail immediately
Diagnosis: Check circuit_breaker.get_state()
Solution: Verify dependency health, manually reset if recovered
```

**Issue: Token budget exhausted**
```
Symptom: Tasks fail with budget error
Diagnosis: Check budget.get_remaining()
Solution: Optimize prompts, use cheaper model, increase budget
```

### Debugging Strategies

1. **Enable Distributed Tracing**: Visualize request flow
2. **Check Metrics**: Identify bottlenecks (latency, throughput)
3. **Review Logs**: Search for errors and warnings
4. **Isolate Components**: Test agents individually
5. **Reproduce Locally**: Use same inputs in controlled environment

---

## 12. Production Checklist

### Pre-Deployment

- [ ] **Load Testing**: Tested with 2x expected peak load
- [ ] **Failure Testing**: Tested all failure scenarios (agent crash, network, timeout)
- [ ] **Circuit Breakers**: Configured and tested
- [ ] **Retry Logic**: Exponential backoff implemented
- [ ] **Saga Compensations**: Rollback logic tested
- [ ] **Health Checks**: All critical dependencies monitored
- [ ] **Metrics Collection**: Key metrics tracked (latency, cost, throughput)
- [ ] **Distributed Tracing**: Request flow visible
- [ ] **Token Budgets**: Limits set and enforced
- [ ] **Error Handling**: All exceptions caught and logged
- [ ] **Timeouts**: Every operation has timeout
- [ ] **Bulkheads**: Resource isolation configured
- [ ] **Documentation**: Runbooks and troubleshooting guides

### Monitoring

- [ ] **Dashboards**: Real-time metrics visualization
- [ ] **Alerts**: Critical failures trigger notifications
- [ ] **Log Aggregation**: Centralized log collection
- [ ] **Trace Sampling**: Representative traces collected
- [ ] **Cost Tracking**: API usage monitored
- [ ] **SLA Monitoring**: P95 latency tracked

### Operations

- [ ] **Incident Response**: On-call rotation defined
- [ ] **Rollback Plan**: Documented and tested
- [ ] **Capacity Planning**: Growth projections reviewed
- [ ] **Security Review**: Permissions and secrets audited
- [ ] **Compliance**: Audit trails maintained

---

## 13. Pattern Selection Guide

### Decision Matrix

| Your Requirement | Recommended Pattern | Complexity | Prerequisites |
|------------------|---------------------|------------|---------------|
| Tasks with complex dependencies | DAG Execution | Medium | Dependency graph |
| Variable workload | Agent Pool + Auto-scaling | Medium | Metrics collection |
| Shared state across agents | State Coordinator + CRDT | High | Conflict resolution |
| Prevent cascading failures | Circuit Breaker | Medium | Health checks |
| Distributed transaction | Saga Pattern | High | Compensation logic |
| Parallel data processing | Map-Reduce | Low-Medium | Partitionable data |
| Sequential stages | Pipeline | Low | Clear stage interfaces |
| Multi-source aggregation | Scatter-Gather | Medium | Timeout handling |
| Event-driven coordination | Pub/Sub | Medium | Message broker |
| Cost optimization | Token Budget + Throttling | Low | Usage tracking |
| Production monitoring | Tracing + Metrics + Health | Medium | Observability stack |

### Pattern Combinations

**Production-Grade Orchestration** (All patterns):
```
DAG Execution
  + Agent Pool (auto-scaling)
  + State Coordinator (CRDT)
  + Circuit Breakers (fault tolerance)
  + Distributed Tracing (observability)
  + Token Budget (cost control)
```

**Fast Prototyping** (Minimal patterns):
```
Simple Parallel Execution
  + Basic Error Handling (retry)
  + Simple Metrics (counters)
```

---

## 14. Conclusion and Next Steps

### Summary

This document covered **8 major pattern categories** for advanced orchestration:

1. **Dependency Management**: DAG execution, conditional dependencies
2. **Dynamic Management**: Agent pools, auto-scaling
3. **State Management**: CRDT, event sourcing, coordinators
4. **Error Handling**: Retry, circuit breaker, saga, bulkhead
5. **Communication**: Message queues, pub/sub
6. **Performance**: Throttling, load balancing, token budgets
7. **Workflow**: Fan-out/fan-in, pipeline, map-reduce, scatter-gather
8. **Observability**: Tracing, metrics, health checks

### When to Apply

**Start Simple**: Use Document 04 patterns for basic orchestration

**Add Complexity Incrementally**:
1. Add dependency management when tasks have prerequisites
2. Add agent pools when workload varies
3. Add state management when agents need shared state
4. Add error handling when reliability is critical
5. Add observability when debugging complex workflows

**Go Full Production**: Use all patterns when:
- Mission-critical workflows
- SLA requirements
- Cost optimization critical
- Scale exceeds 10+ agents

### Further Reading

- **Document 04**: Multi-Agent Orchestration (basics)
- **Document 11**: Hybrid Development with Worktrees
- **Document 12**: Skills-First Planning
- **Command Templates**: `/orchestrate-feature`, `/dag-executor`
- **Agent Templates**: `orchestrator-lead.md`, `task-coordinator.md`
- **Skill Templates**: `saga-pattern-skill`, `circuit-breaker-skill`

### Getting Started

1. **Choose Your Pattern**: Use decision matrix above
2. **Read Implementation**: Study code examples in this document
3. **Use Templates**: Adapt command/agent/skill templates
4. **Test Thoroughly**: Validate under failure conditions
5. **Monitor in Production**: Track metrics and iterate

---

**Document Version**: 1.0.0
**Last Updated**: January 21, 2026
**Maintained By**: Claude Command and Control Project
**Status**: ✅ COMPLETE - All 14 sections finished
