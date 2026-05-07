---
name: langgraph-functional-api
description: LangGraph Functional API (Python) — build stateful agent workflows with @entrypoint and @task decorators. Imperative Python style with LangGraph persistence, streaming, HITL, and durable execution. Ideal for wrapping existing agents (CrewAI, AutoGen, Strands) or complex parallel task logic.
---

# LangGraph Functional API Skill

Expert assistance for the LangGraph **Functional API**: imperative, Python-native agent workflows using `@entrypoint` and `@task` decorators. Gets you LangGraph persistence, streaming, and human-in-the-loop with minimal boilerplate — especially useful for wrapping existing agents or frameworks.

**When to choose Functional API over Graph API:**
- You're wrapping an existing agent (CrewAI, AutoGen, Strands, etc.)
- Your workflow is naturally imperative (sequential Python logic with branches)
- You need parallel task execution without defining a graph topology
- You want to add persistence/streaming to an agent you didn't write in LangGraph

Full corpus: `../langgraph/references/llms-txt.md` (5.4 MB) and `../../langchain-deepagents/references/llms-full.md` (10 MB).

## When to Use This Skill

Activate when:
- **Writing @entrypoint workflows** — defining the top-level entry to a LangGraph application
- **Defining @task functions** — wrapping individual operations with checkpointing and retries
- **Running tasks in parallel** — invoking multiple tasks concurrently and awaiting results
- **Wrapping third-party agents** — integrating CrewAI, AutoGen, Strands, or any framework
- **Configuring durable execution** — choosing `exit`, `async`, or `sync` durability modes
- **Using tasks inside Graph API nodes** — mixing both APIs in one graph
- **Handling RunControl / GraphDrained** — controlling graph execution lifecycle programmatically
- **Streaming from functional workflows** — getting token-level or state-level streaming output

## Quick Reference

### Minimal @entrypoint + @task

```python
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.func import entrypoint, task

@task
def fetch_data(query: str) -> str:
    return call_api(query)  # Any IO operation

@task
def process_data(raw: str) -> str:
    return transform(raw)

@entrypoint(checkpointer=InMemorySaver())
def my_workflow(inputs: dict) -> dict:
    raw = fetch_data(inputs["query"]).result()
    processed = process_data(raw).result()
    return {"output": processed}

# Invoke with thread_id for persistence
result = my_workflow.invoke(
    {"query": "hello"},
    config={"configurable": {"thread_id": "1"}},
)
```

### Parallel task execution

```python
from langgraph.func import entrypoint, task

@task
def search_web(query: str) -> str:
    return web_search(query)

@task
def search_docs(query: str) -> str:
    return doc_search(query)

@entrypoint(checkpointer=InMemorySaver())
def research_workflow(inputs: dict) -> dict:
    # Launch both tasks concurrently
    web_future = search_web(inputs["query"])
    docs_future = search_docs(inputs["query"])

    # Collect results (blocks until both done)
    web_result = web_future.result()
    docs_result = docs_future.result()

    return {"web": web_result, "docs": docs_result}
```

### Task retry policy

```python
from langgraph.func import entrypoint, task
from langgraph.types import RetryPolicy

@task(retry=RetryPolicy(max_attempts=3, backoff_factor=2.0))
def flaky_api_call(payload: dict) -> dict:
    return requests.post(API_URL, json=payload).json()

@entrypoint(checkpointer=InMemorySaver())
def workflow(inputs: dict) -> dict:
    result = flaky_api_call(inputs).result()
    return {"result": result}
```

### Durable execution modes

```python
from langgraph.runtime import RunControl

# Choose durability level — trade-off: performance vs crash recovery
control = RunControl(
    durability="sync"    # "exit" | "async" | "sync"
    # exit: fastest, saves only at exit (no mid-run crash recovery)
    # async: saves asynchronously (good balance)
    # sync: saves before every step (slowest, most durable)
)
```

### Human-in-the-loop interrupt in a task

```python
from langgraph.types import interrupt, Command
from langgraph.func import entrypoint, task

@task
def get_approval(action: str) -> str:
    return interrupt({"prompt": f"Approve: {action}?"})

@entrypoint(checkpointer=InMemorySaver())
def workflow(inputs: dict) -> dict:
    decision = get_approval(inputs["action"]).result()
    if decision == "yes":
        return {"status": "approved"}
    return {"status": "rejected"}

# Resume after interrupt
workflow.invoke(
    Command(resume="yes"),
    config={"configurable": {"thread_id": "1"}},
)
```

### Wrap a third-party agent (Strands, CrewAI, AutoGen)

```python
from langgraph.func import entrypoint
from langgraph.checkpoint.memory import InMemorySaver

# Example: wrap a Strands agent
from strands import Agent as StrandsAgent
from strands_tools import http_request

strands_agent = StrandsAgent(tools=[http_request])

@entrypoint(checkpointer=InMemorySaver())
def strands_workflow(inputs: dict) -> dict:
    # Your existing agent runs inside @entrypoint
    # Gets LangSmith persistence, streaming, HITL for free
    result = strands_agent(inputs["prompt"])
    return {"output": str(result)}

# Now deployable to LangSmith with full observability
```

### Tasks inside Graph API nodes (mixing APIs)

```python
from langgraph.graph import StateGraph, START
from langgraph.func import task
from langgraph.types import RetryPolicy

@task(retry=RetryPolicy(max_attempts=2))
def llm_call(prompt: str) -> str:
    return llm.invoke(prompt)

# Use @task inside a StateGraph node
def my_node(state: State) -> State:
    # Convert node operations to tasks for granular checkpointing
    result = llm_call(state["input"]).result()
    return {"output": result}

graph = StateGraph(State)
graph.add_node("my_node", my_node)
```

### Streaming from an @entrypoint

```python
# Functional API supports the same stream modes as Graph API
config = {"configurable": {"thread_id": "1"}}

for chunk in my_workflow.stream(inputs, config, stream_mode="updates"):
    print(chunk)

for chunk in my_workflow.stream(inputs, config, stream_mode="messages"):
    print(chunk)  # LLM tokens
```

## Functional API Concepts

| Concept | Decorator/Type | Notes |
|---------|---------------|-------|
| Workflow entry | `@entrypoint(checkpointer=...)` | Top-level callable; required for persistence |
| Unit of work | `@task` | Individually checkpointed; retryable |
| Invoke | `workflow.invoke(inputs, config)` | Blocking call |
| Stream | `workflow.stream(inputs, config, stream_mode=...)` | Streaming call |
| Parallel | Launch multiple tasks, call `.result()` to collect | Like `asyncio.gather` |
| Retry | `@task(retry=RetryPolicy(...))` | Per-task retry logic |
| Durability | `RunControl(durability="sync\|async\|exit")` | Checkpoint frequency |
| Interrupt | `interrupt(payload)` inside task | Pause for human input |
| Resume | `workflow.invoke(Command(resume=value), config)` | Continue after interrupt |
| Third-party | Any callable inside `@entrypoint` | Wrap CrewAI, AutoGen, etc. |

## Functional API vs Graph API

| Need | Use |
|------|-----|
| Explicit graph topology / visualization | Graph API |
| Imperative Python logic | Functional API |
| Wrapping an existing agent | Functional API |
| Named, inspectable stages | Graph API |
| Parallel tasks with dynamic count | Functional API |
| Complex conditional branching | Graph API |
| Minimal boilerplate | Functional API |
| Fan-out with `Send` | Graph API |

## Reference Files

| File | Location |
|------|----------|
| LangGraph Python docs index | `../langgraph/references/llms.md` |
| 1473-page corpus summaries | `../langgraph/references/llms-txt.md` |
| Full content + all code | `../../langchain-deepagents/references/llms-full.md` |

Key doc pages: `docs.langchain.com/oss/python/langgraph/functional-api`, `/use-functional-api`, `/choosing-apis`, `/durable-execution`
