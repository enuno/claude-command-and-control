---
name: langchain-deepagents
description: LangChain Deep Agents (Python) — build, deploy, and customize stateful long-running agents with virtual filesystems, subagents, human-in-the-loop, and LangSmith observability. Also covers LangGraph, LangChain OSS chains/retrievers, and Agent Server API.
---

# LangChain Deep Agents Skill

Expert assistance for building LangChain Deep Agents in Python: stateful agents with virtual filesystems, parallel subagents, tool permissions, human-in-the-loop, and deployment via LangSmith.

Reference corpus: **1473 pages** of official docs in `references/llms-txt.md` (5.4 MB) and `references/llms-full.md` (10 MB). Use `view references/llms-full.md` when detailed implementation is needed.

## When to Use This Skill

Activate when:
- **Building a Deep Agent** — creating a stateful agent with virtual filesystem, backends, or subagents
- **Configuring subagents** — setting up parallel or async subagents with permission inheritance
- **Implementing human-in-the-loop** — adding approval gates for sensitive tool calls
- **Deploying to LangSmith** — setting up `langgraph.json`, Agent Server, or deployment pipelines
- **Tracing and evaluating** — instrumenting agents with `@traceable`, running `client.evaluate()`
- **Debugging LangGraph state** — working with `StateGraph`, checkpointers, or thread state
- **Using Agent Server API** — managing threads, runs, assistants, crons, or streaming
- **Integrating retrievers or chains** — connecting vector stores, RAG pipelines, or tool middleware

## Quick Reference

### Create a basic Deep Agent with state and checkpointer

```python
from langgraph.graph import StateGraph, MessagesState
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent

# Checkpointer persists agent state across runs
checkpointer = InMemorySaver()

agent = create_agent(
    skills=[...],          # Skill middleware layers
    checkpointer=checkpointer,
)
```

### Trace agent functions with LangSmith

```python
from langsmith import traceable
from langsmith.schemas import Attachment
from pathlib import Path

@traceable
def my_agent_step(inputs: dict) -> dict:
    # Automatically traced in LangSmith
    return {"output": process(inputs)}

# Attach files to traces
@traceable
def analyze_file(path: Path) -> dict:
    attachment = Attachment(mime_type="text/plain", data=path.read_bytes())
    return {"result": process(attachment)}
```

### Evaluate agent with LangSmith client

```python
from langsmith import Client

client = Client()

def target(inputs):
    return {"output": my_agent.invoke(inputs)}

def accuracy_evaluator(run, example):
    score = evaluate_output(run.outputs, example.outputs)
    return {"key": "accuracy", "score": score}

# Non-blocking: stream results as they arrive
results = client.evaluate(
    target,
    data="my_test_dataset",
    evaluators=[accuracy_evaluator],
    blocking=False,
)
for result in results:
    print(result)
```

### Distributed tracing across services (LangGraph)

```python
import langsmith as ls
from langgraph.graph import StateGraph, MessagesState

# Accept trace context propagated from upstream callers
# Headers passed via config["configurable"]["langsmith-trace"]
def my_node(state: MessagesState, config: dict):
    trace_headers = config.get("configurable", {})
    with ls.trace(headers=trace_headers):
        return process(state)
```

### Subagent permission scoping

```python
# Subagents inherit parent permissions by default.
# Setting permissions REPLACES (does not extend) parent rules.
subagent_spec = {
    "name": "restricted-subagent",
    "permissions": [
        {"path": "/workspace", "access": "read-write"},
        # Parent's other permissions are NOT inherited
    ]
}
```

### LangSmith custom authentication handler

```python
from langgraph_sdk.auth import Auth

auth = Auth()

@auth.authenticate
async def handler(request):
    user = await validate_token(request.headers.get("Authorization"))
    return {
        "identity": user.id,
        "role": user.role,
        # Accessible in graph via config["configurable"]["langgraph_auth_user"]
    }
```

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/llms-txt.md` | 5.4 MB | Full doc corpus — summaries of 1473 pages |
| `references/llms-full.md` | 10 MB | Complete page content with all code examples |
| `references/llms.md` | 104 KB | Site index — all doc URLs with descriptions |
| `references/index.md` | 1 KB | Category index |

**To find specific content:** Search `references/llms.md` for topic URLs, then look up full content in `references/llms-full.md`.

## Key Deep Agents Topics (Python)

From `references/llms.md` — Python-specific deep agents docs at `/oss/python/deepagents/`:

- **Overview & quickstart**: `/oss/python/deepagents/overview`
- **Subagents**: `/oss/python/deepagents/subagents` — parallel execution, permission scoping
- **Human-in-the-loop**: `/oss/python/deepagents/human-in-the-loop` — approval gates for tool calls
- **Backends & filesystem**: `/oss/python/deepagents/backends` — CompositeBackend, virtual FS, route prefixes
- **Context engineering**: `/oss/python/deepagents/context-engineering` — managing long-running context
- **Frontend (todo list pattern)**: `/oss/python/deepagents/frontend/todo-list` — `useStream` + custom state keys
- **Data analysis example**: `/oss/python/deepagents/data-analysis`
- **Deep research example**: `/oss/python/deepagents/deep-research`

## Agent Server API Quick Reference

| Operation | Method + Path |
|-----------|--------------|
| Create thread | `POST /threads` |
| Stream run | `POST /threads/{id}/runs/stream` |
| Create assistant | `POST /assistants` |
| Schedule cron | `POST /crons` |
| Store/retrieve state | `PUT/GET /store/{namespace}/{key}` |
| Health check | `GET /ok` |
| Server info | `GET /info` |

## Security Best Practices for Sandboxed Agents

- Enable human-in-the-loop for **all** tool calls when using sensitive credentials
- Block or restrict sandbox network access to limit data exfiltration paths
- Use narrowest possible credential scope with shortest possible lifetime
- `CompositeBackend` requires explicit route prefixes — path restrictions alone cannot prevent sandbox filesystem access via shell commands
- Treat all sandbox outputs as **untrusted input** before acting on them
- Apply middleware to filter/redact sensitive patterns in tool outputs

## Updating

To re-scrape with tighter scope (deep agents section only):
```bash
skill-seekers scrape --url "https://docs.langchain.com/oss/python/deepagents/overview" --name langchain-deepagents
```
