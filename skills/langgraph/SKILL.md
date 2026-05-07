---
name: langgraph
description: LangGraph (Python) — build stateful, controllable agent graphs with checkpointing, streaming, persistence, interrupts, fault tolerance, and durable execution. Covers both Graph API (StateGraph) and Functional API (@entrypoint/@task).
---

# LangGraph Skill

Expert assistance for building LangGraph agents in Python: stateful graphs, checkpointing, human-in-the-loop interrupts, streaming, fault tolerance, and deployment.

**Two APIs to choose from:**
- **Graph API** — `StateGraph`, nodes, edges: explicit DAG control flow
- **Functional API** — `@entrypoint`, `@task`: imperative Python-style workflows

Reference corpus: **30 LangGraph pages** in `references/llms-txt.md` (5.4 MB) and `references/llms.md` (104 KB). For full content with code, use `../langchain-deepagents/references/llms-full.md`.

## When to Use This Skill

Activate when:
- **Building a StateGraph** — defining nodes, edges, and state types with Graph API
- **Using the Functional API** — `@entrypoint` / `@task` for imperative agent logic
- **Adding persistence/memory** — wiring up `InMemorySaver` or `PostgresSaver` checkpointers
- **Implementing human-in-the-loop** — using `interrupt()` to pause and resume execution
- **Streaming agent output** — configuring streaming modes (values, updates, messages, events)
- **Handling fault tolerance** — per-node retries, timeouts, and error handlers
- **Durable execution** — replaying from checkpoints, time travel, state updates
- **Deploying LangGraph** — local server, LangSmith Deployment, `langgraph.json` config
- **Debugging graph state** — inspecting thread state, replaying past runs, updating state

## Quick Reference

### Graph API — define a StateGraph

```python
from typing import TypedDict
from langgraph.graph import START, StateGraph
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):
    foo: str

def my_node(state: State) -> State:
    return {"foo": state["foo"].upper()}

# Build graph
graph = StateGraph(State)
graph.add_node("my_node", my_node)
graph.add_edge(START, "my_node")

# Compile with checkpointer for persistence
checkpointer = InMemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Invoke with thread_id for stateful conversations
result = app.invoke({"foo": "hello"}, config={"configurable": {"thread_id": "1"}})
```

### Separate input/output state types

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class InputState(TypedDict):
    user_input: str

class OutputState(TypedDict):
    graph_output: str

class OverallState(TypedDict):
    foo: str
    user_input: str
    graph_output: str

# Graph sees OverallState internally; caller sees InputState/OutputState
graph = StateGraph(OverallState, input=InputState, output=OutputState)
```

### Functional API — @entrypoint and @task

```python
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.func import entrypoint, task
from langgraph.types import RetryPolicy

@task(retry=RetryPolicy(max_attempts=3))
def fetch_data(query: str) -> str:
    return call_api(query)

@entrypoint(checkpointer=InMemorySaver())
def my_workflow(inputs: dict) -> dict:
    data = fetch_data(inputs["query"]).result()
    return {"output": process(data)}
```

### Human-in-the-loop with interrupt

```python
from langgraph.types import interrupt

def review_node(state: State) -> State:
    # Pauses here and returns control to caller
    human_decision = interrupt({"question": "Approve this action?", "data": state["action"]})
    if human_decision == "approve":
        return {"approved": True}
    return {"approved": False}

# Resume by invoking with Command
from langgraph.types import Command
app.invoke(Command(resume="approve"), config={"configurable": {"thread_id": "1"}})
```

### Streaming

```python
# Stream state values after each node
for chunk in app.stream({"foo": "hello"}, config={"configurable": {"thread_id": "1"}},
                         stream_mode="values"):
    print(chunk)

# Stream only updates (deltas)
for chunk in app.stream(inputs, config=config, stream_mode="updates"):
    print(chunk)

# Stream LLM tokens (messages mode)
for chunk in app.stream(inputs, config=config, stream_mode="messages"):
    print(chunk)
```

### Fault tolerance — per-node retries and timeouts

```python
from langgraph.graph import StateGraph
from langgraph.types import RetryPolicy

graph = StateGraph(State)
graph.add_node(
    "flaky_node",
    my_node,
    retry=RetryPolicy(max_attempts=3, backoff_factor=2.0),
)
```

### Time travel — replay from checkpoint

```python
# Get thread history
history = list(app.get_state_history(config={"configurable": {"thread_id": "1"}}))

# Pick a prior checkpoint and replay from it
past_checkpoint = history[2].config
result = app.invoke(None, config=past_checkpoint)

# Update state at a checkpoint before replaying
app.update_state(config=past_checkpoint, values={"foo": "corrected"})
```

## Key LangGraph Concepts

| Concept | Graph API | Functional API |
|---------|-----------|----------------|
| Entry point | `graph.add_edge(START, node)` | `@entrypoint` decorator |
| Unit of work | Node function | `@task` function |
| State | `TypedDict` class | Input dict |
| Persistence | `compile(checkpointer=...)` | `@entrypoint(checkpointer=...)` |
| Streaming | `app.stream(stream_mode=...)` | Same |
| Interrupts | `interrupt()` inside node | `interrupt()` inside task |

## Reference Files

| File | Location | Contents |
|------|----------|----------|
| `references/llms-txt.md` | This skill | 5.4 MB — full site corpus summaries |
| `references/llms.md` | This skill | 104 KB — all doc URLs with descriptions |
| `llms-full.md` | `../langchain-deepagents/references/` | 10 MB — complete content + all code |

## LangGraph Doc Index (Python)

Key pages at `docs.langchain.com/oss/python/langgraph/`:

| Topic | Path |
|-------|------|
| Overview | `/overview` |
| Graph API | `/graph-api` and `/use-graph-api` |
| Functional API | `/functional-api` and `/use-functional-api` |
| Quickstart | `/quickstart` |
| Persistence | `/persistence` |
| Memory | `/add-memory` |
| Interrupts / HITL | `/interrupts` |
| Streaming | `/streaming` |
| Fault tolerance | `/fault-tolerance` |
| Durable execution | `/durable-execution` |
| Time travel | via `/persistence` (checkpoint replay) |
| Choosing APIs | `/choosing-apis` |
| Deployment | `/deploy` |
| Local server | `/local-server` |
| Observability | `/observability` |
| Testing | `/test` |
| Backward compat | `/backward-compatibility` |
| Agentic RAG | `/agentic-rag` |
| SQL agent | `/sql-agent` |

## Updating

```bash
skill-seekers scrape --url "https://docs.langchain.com/oss/python/langgraph/overview" --name langgraph
```
