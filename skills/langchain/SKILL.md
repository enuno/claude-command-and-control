---
name: langchain
description: LangChain Python package — new create_agent() factory (builds a LangGraph agent from a model string + tools + middleware), plus a comprehensive middleware system covering HITL, PII redaction, model fallback, rate limiting, auto-summarization, context editing, shell tools, and todo planning.
---

# LangChain Skill

Expert assistance for the `langchain` Python package's new agent API: `create_agent()` — a high-level factory that builds a LangGraph-backed agent with composable middleware for cross-cutting concerns (HITL, PII, fallback, limits, summarization, etc.).

**Install**: `pip install -U langchain`

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Creating an agent with `create_agent()`** — using model strings, tools, and middleware
- **Using init_chat_model strings** — e.g. `"anthropic:claude-sonnet-4-5"` as the `model` param
- **Adding HITL approval gates** — using `HumanInTheLoopMiddleware` per tool
- **Redacting PII** — using `PIIMiddleware` to detect/redact/mask/hash PII in input or output
- **Adding model fallback** — using `ModelFallbackMiddleware` for automatic failover
- **Limiting model or tool calls** — using `ModelCallLimitMiddleware` or `ToolCallLimitMiddleware`
- **Auto-summarizing long conversations** — using `SummarizationMiddleware` on token/message threshold
- **Retrying failed calls** — using `ModelRetryMiddleware` or `ToolRetryMiddleware`
- **Structured agent output** — using `response_format` param on `create_agent()`
- **Composing multiple middleware** — stacking middleware in the `middleware` list

## Quick Reference

### create_agent() — minimal agent

```python
from langchain.agents import create_agent
from langchain_core.tools import tool

@tool
def check_weather(location: str) -> str:
    """Return the weather forecast for a location."""
    return f"It's sunny and 22°C in {location}."

# model can be a string (uses init_chat_model) or a BaseChatModel instance
agent = create_agent(
    model="anthropic:claude-sonnet-4-6",   # or "openai:gpt-4o", "google:gemini-2.0-flash"
    tools=[check_weather],
    system_prompt="You are a helpful assistant.",
)

# Returns a CompiledStateGraph (standard LangGraph interface)
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "What's the weather in Paris?"}]},
    stream_mode="updates",
):
    print(chunk)
```

### HumanInTheLoopMiddleware — per-tool approval gates

```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langchain_core.tools import tool

@tool
def delete_file(path: str) -> str:
    """Delete a file from the filesystem."""
    import os; os.remove(path); return f"Deleted {path}"

@tool
def read_file(path: str) -> str:
    """Read file contents."""
    return open(path).read()

hitl = HumanInTheLoopMiddleware(
    interrupt_on={
        "delete_file": True,    # all decisions: approve/edit/reject/respond
        "read_file": False,     # auto-approve (no interrupt)
        # "write_file": InterruptOnConfig(approve=True, reject=True, description="Approve write?")
    }
)

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[delete_file, read_file],
    middleware=[hitl],
    checkpointer=...,   # required for HITL interrupts
)

# Resume after interrupt (same as LangGraph interrupt pattern)
from langchain_core.messages import HumanMessage
from langgraph.types import Command
agent.invoke(Command(resume="approve"), config={"configurable": {"thread_id": "1"}})
```

### PIIMiddleware — detect and handle PII

```python
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware

# Redact emails and credit cards from user input
pii = PIIMiddleware(
    "email",
    strategy="redact",        # "block" | "redact" | "mask" | "hash"
    apply_to_input=True,      # scan user messages
    apply_to_output=False,    # don't scan agent responses
    apply_to_tool_results=False,
)

# Stack multiple PII middleware
agent = create_agent(
    model="openai:gpt-4o",
    tools=[],
    middleware=[
        PIIMiddleware("email", strategy="redact"),
        PIIMiddleware("credit_card", strategy="mask"),    # ****-****-****-1234
        PIIMiddleware("ip", strategy="hash"),
    ],
)
```

### ModelFallbackMiddleware — automatic model failover

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelFallbackMiddleware

fallback = ModelFallbackMiddleware(
    "openai:gpt-4o-mini",                    # try first on error
    "anthropic:claude-haiku-4-5-20251001",   # then this
    # additional fallbacks...
)

agent = create_agent(
    model="openai:gpt-4o",    # primary model
    tools=[...],
    middleware=[fallback],
)
```

### SummarizationMiddleware — auto-compress long conversations

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

summarizer = SummarizationMiddleware(
    model="openai:gpt-4o-mini",    # model to generate summaries
    trigger=[
        ("fraction", 0.8),         # trigger at 80% of model's context window
        ("messages", 100),         # or at 100 messages, whichever first
    ],
    keep=("messages", 20),         # keep most recent 20 messages after summary
)

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[...],
    middleware=[summarizer],
)
```

### ModelCallLimitMiddleware — rate limit model calls

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelCallLimitMiddleware

limiter = ModelCallLimitMiddleware(
    thread_limit=50,        # max model calls across all runs in a thread
    run_limit=10,           # max model calls in a single run
    exit_behavior="end",    # "end" (graceful) | "error" (raise exception)
)

agent = create_agent(
    model="openai:gpt-4o",
    tools=[...],
    middleware=[limiter],
)
```

### Structured agent output with response_format

```python
from langchain.agents import create_agent
from pydantic import BaseModel, Field

class ResearchReport(BaseModel):
    title: str = Field(description="Report title")
    summary: str = Field(description="Executive summary")
    key_findings: list[str] = Field(description="List of key findings")
    confidence: float = Field(description="Confidence score 0-1")

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search_tool],
    response_format=ResearchReport,    # agent returns structured output
    system_prompt="Research the given topic and produce a structured report.",
)

result = agent.invoke({"messages": [{"role": "user", "content": "Research LangGraph"}]})
# result is typed as ResearchReport
```

### Composing multiple middleware

```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    HumanInTheLoopMiddleware,
    PIIMiddleware,
    ModelFallbackMiddleware,
    ModelCallLimitMiddleware,
    SummarizationMiddleware,
)

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[...],
    middleware=[
        PIIMiddleware("email", strategy="redact"),          # outermost
        ModelCallLimitMiddleware(run_limit=20),
        ModelFallbackMiddleware("openai:gpt-4o-mini"),
        SummarizationMiddleware("openai:gpt-4o-mini", trigger=("fraction", 0.8)),
        HumanInTheLoopMiddleware({"delete_file": True}),    # innermost
    ],
    checkpointer=...,   # needed for HITL + persistence
)
```

## API Reference

### `create_agent()` parameters

| Param | Type | Description |
|-------|------|-------------|
| `model` | `str \| BaseChatModel` | Model string (`"provider:model"`) or instance |
| `tools` | `list` | Tools, callables, or dicts |
| `system_prompt` | `str \| SystemMessage` | System prompt |
| `middleware` | `list[AgentMiddleware]` | Middleware stack (first = outermost) |
| `response_format` | `type[BaseModel] \| dict` | Structured output schema |
| `checkpointer` | `Checkpointer` | State persistence (required for HITL) |
| `store` | `BaseStore` | Cross-thread storage |
| `interrupt_before` | `list[str]` | Node names to interrupt before |
| `interrupt_after` | `list[str]` | Node names to interrupt after |
| `name` | `str` | Name for subgraph use |
| `debug` | `bool` | Enable verbose logging |

### Model string format

```python
"provider:model-name"   # e.g.:
"anthropic:claude-sonnet-4-6"
"openai:gpt-4o"
"openai:gpt-4o-mini"
"google:gemini-2.0-flash"
"ollama:llama3.1"
```

### Middleware catalog

| Middleware | Constructor | Key params |
|------------|-------------|------------|
| `HumanInTheLoopMiddleware` | `(interrupt_on)` | Per-tool approve/edit/reject/respond |
| `PIIMiddleware` | `(pii_type, strategy)` | block/redact/mask/hash |
| `ModelFallbackMiddleware` | `(model1, model2, ...)` | Failover chain |
| `ModelCallLimitMiddleware` | `(thread_limit, run_limit)` | Call counting |
| `ToolCallLimitMiddleware` | `(thread_limit, run_limit)` | Tool call counting |
| `ModelRetryMiddleware` | `(max_retries, ...)` | Retry failed model calls |
| `ToolRetryMiddleware` | `(max_retries, ...)` | Retry failed tool calls |
| `SummarizationMiddleware` | `(model, trigger, keep)` | Auto-compress context |
| `ContextEditingMiddleware` | `(edits)` | Modify message history |
| `ShellToolMiddleware` | — | Shell command execution |
| `TodoListMiddleware` | — | Planning with todo lists |
| `LLMToolSelectorMiddleware` | `(model)` | LLM-based tool selection |
| `FilesystemFileSearchMiddleware` | — | File search tools |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain`  
Agent docs: `https://docs.langchain.com/oss/python/langchain/agents`  
Middleware docs: `https://docs.langchain.com/oss/python/langchain/middleware`
