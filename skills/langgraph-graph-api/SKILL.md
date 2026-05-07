---
name: langgraph-graph-api
description: LangGraph Graph API (Python) — build explicit DAG agent workflows with StateGraph, typed state, nodes, edges, Command routing, Send fan-out, checkpointers, interrupts, and streaming. Use when you need explicit control flow and graph topology.
---

# LangGraph Graph API Skill

Expert assistance for the LangGraph **Graph API**: explicit, declarative agent graphs using `StateGraph`, typed state, nodes, and edges. Use this API when you need visible, inspectable control flow and want to define your agent as a directed graph.

**When to choose Graph API over Functional API:**
- You want an explicit graph topology you can visualize
- Your workflow has clear, named stages (nodes)
- You need conditional branching between well-defined steps
- You're building a new agent from scratch (not wrapping an existing one)

Full corpus: `../langgraph/references/llms-txt.md` (5.4 MB) and `../../langchain-deepagents/references/llms-full.md` (10 MB).

## When to Use This Skill

Activate when:
- **Defining a StateGraph** — creating nodes, edges, and graph topology
- **Typing agent state** — designing `TypedDict` state schemas (input, output, overall, private)
- **Routing between nodes** — using `Command` for single routing or `Send` for parallel fan-out
- **Adding persistence** — wiring `InMemorySaver` or `PostgresSaver` checkpointers
- **Implementing HITL** — calling `interrupt()` inside a node to pause execution
- **Streaming graph output** — choosing between `values`, `updates`, `messages`, or `events` modes
- **Using Pydantic state** — validating state fields with `BaseModel` instead of `TypedDict`
- **Building multi-agent systems** — routing between specialized subgraph agents

## Quick Reference

### Minimal StateGraph

```python
from typing import TypedDict
from langgraph.graph import START, END, StateGraph
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):
    input: str
    result: str

def process(state: State) -> State:
    return {"result": state["input"].upper()}

graph = StateGraph(State)
graph.add_node("process", process)
graph.add_edge(START, "process")
graph.add_edge("process", END)

app = graph.compile(checkpointer=InMemorySaver())
result = app.invoke({"input": "hello"}, config={"configurable": {"thread_id": "1"}})
```

### Separate input / output / private state types

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class InputState(TypedDict):
    user_input: str

class OutputState(TypedDict):
    graph_output: str

class OverallState(TypedDict):  # Internal full state
    foo: str
    user_input: str
    graph_output: str

class PrivateState(TypedDict):  # Only visible within a single node
    bar: str

def node_1(state: InputState) -> OverallState:
    return {"foo": state["user_input"] + " processed"}

def node_2(state: OverallState) -> PrivateState:
    return {"bar": state["foo"] + " private"}

def node_3(state: PrivateState) -> OutputState:
    return {"graph_output": state["bar"]}

graph = StateGraph(OverallState, input=InputState, output=OutputState)
graph.add_node("node_1", node_1)
graph.add_node("node_2", node_2)
graph.add_node("node_3", node_3)
```

### Conditional routing with Command

```python
from langgraph.types import Command
from langgraph.graph import StateGraph, START

def router(state: State) -> Command:
    if state["type"] == "math":
        return Command(goto="math_agent")
    return Command(goto="general_agent")

# Fan-out to multiple agents in parallel with Send
from langgraph.types import Send

def parallel_router(state: State):
    return [
        Send("agent_a", {"task": state["task_a"]}),
        Send("agent_b", {"task": state["task_b"]}),
    ]
```

### LLM-based router with Pydantic state

```python
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

class RouteDecision(BaseModel):
    target: str = Field(description="Which agent to route to")

router_llm = init_chat_model("anthropic:claude-sonnet-4-6").with_structured_output(RouteDecision)

class State(BaseModel):  # Pydantic validates all state writes
    query: str
    route: str = ""
    result: str = ""
```

### Human-in-the-loop interrupt

```python
from langgraph.types import interrupt, Command

def approval_node(state: State) -> State:
    decision = interrupt({
        "prompt": "Approve this action?",
        "action": state["pending_action"],
    })
    return {"approved": decision == "yes"}

# Resume after interrupt
app.invoke(
    Command(resume="yes"),
    config={"configurable": {"thread_id": "1"}},
)
```

### Streaming modes

```python
config = {"configurable": {"thread_id": "1"}}

# Full state after every node
for chunk in app.stream(inputs, config, stream_mode="values"):
    print(chunk)

# Only the delta from each node
for chunk in app.stream(inputs, config, stream_mode="updates"):
    print(chunk)

# LLM token-by-token (for nodes with chat models)
for chunk in app.stream(inputs, config, stream_mode="messages"):
    print(chunk)
```

### Per-node retries and fault tolerance

```python
from langgraph.types import RetryPolicy

graph.add_node(
    "api_call",
    call_external_api,
    retry=RetryPolicy(max_attempts=3, backoff_factor=2.0),
)
```

### Time travel — inspect and replay

```python
# Get full thread history
history = list(app.get_state_history(config={"configurable": {"thread_id": "1"}}))

# Replay from a prior checkpoint
past_config = history[2].config
app.invoke(None, config=past_config)

# Patch state at a checkpoint, then replay
app.update_state(config=past_config, values={"result": "corrected"})
app.invoke(None, config=past_config)
```

## Graph API Concepts

| Concept | Type/Function | Notes |
|---------|--------------|-------|
| Graph builder | `StateGraph(State)` | Declare before compiling |
| Entry point | `add_edge(START, node)` | `START` is a sentinel |
| Exit | `add_edge(node, END)` | `END` is a sentinel |
| Node | `add_node(name, fn)` | Any callable `(State) -> State` |
| Static edge | `add_edge(a, b)` | Always go from a to b |
| Conditional edge | `add_conditional_edges(a, router)` | Router returns node name |
| Routing w/ state | `Command(goto=name)` | Return from node |
| Parallel fan-out | `Send(node, state)` | Return list of Send |
| Persistence | `compile(checkpointer=...)` | Required for HITL + memory |
| Interrupt | `interrupt(payload)` inside node | Pauses; resume with `Command(resume=...)` |
| PubSub channel | `Topic` | Accumulate values across steps |

## Reference Files

| File | Location |
|------|----------|
| LangGraph Python docs index | `../langgraph/references/llms.md` |
| 1473-page corpus summaries | `../langgraph/references/llms-txt.md` |
| Full content + all code | `../../langchain-deepagents/references/llms-full.md` |

Key doc pages: `docs.langchain.com/oss/python/langgraph/graph-api`, `/use-graph-api`, `/choosing-apis`
