---
name: langsmith
description: LangSmith Python SDK — trace, evaluate, and monitor LLM applications. Covers @traceable decorator, trace context manager, Client API, evaluate() / aevaluate(), comparative evaluation, custom evaluators, dataset management, prompt caching, ASGI middleware, and pytest plugin.
---

# LangSmith Skill

Expert assistance for the LangSmith Python SDK: observability, evaluation, and dataset management for LLM applications.

**Install**: `pip install langsmith`  
**Setup**: `export LANGSMITH_API_KEY="ls__..."` and `export LANGSMITH_TRACING=true`

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Tracing functions** — adding `@traceable` to instrument agent steps, LLM calls, or tool executions
- **Manual tracing** — using `trace` context manager or `tracing_context()` for fine-grained control
- **Running evaluations** — calling `evaluate()` or `aevaluate()` on a dataset with custom evaluators
- **Comparative A/B evaluation** — passing a tuple of experiment IDs to compare two runs
- **Writing custom evaluators** — using `@run_evaluator` or `summary_evaluators` for dataset-level scoring
- **Managing datasets** — creating, updating, or querying examples via `Client`
- **Attaching files to traces** — using `Attachment` for images, audio, or binary data
- **Tracing ASGI/WSGI apps** — using `TracingMiddleware` for FastAPI/Starlette/Django
- **Pytest integration** — using `LangSmithPlugin` for test-level tracing
- **Prompt caching** — using `PromptCache` or `AsyncPromptCache`
- **Handling LangSmith errors** — catching `LangSmithAPIError`, `LangSmithRateLimitError`, etc.

## Quick Reference

### Instrument a function with @traceable

```python
from langsmith import traceable

@traceable(name="my_llm_call", run_type="llm")
def call_llm(prompt: str) -> str:
    return llm.invoke(prompt)

@traceable(name="my_tool", tags=["tool", "search"])
def search(query: str) -> list[str]:
    return search_index.query(query)

# Async works too
@traceable
async def async_agent(inputs: dict) -> dict:
    result = await llm.ainvoke(inputs["prompt"])
    return {"output": result}
```

### Manual trace context manager

```python
from langsmith.run_helpers import trace, tracing_context

# Explicit span with full control
with trace(name="my_pipeline", run_type="chain") as run:
    run.metadata["version"] = "v2"
    result = run_pipeline(inputs)
    run.end(outputs={"result": result})

# Set tracing context for a block
with tracing_context(project_name="my-project", tags=["prod"]):
    result = agent.invoke(inputs)
```

### Add metadata to the current run

```python
from langsmith.run_helpers import get_current_run_tree, set_run_metadata

@traceable
def my_step(inputs: dict) -> dict:
    # Attach metadata to whatever run is active
    set_run_metadata({"user_id": inputs["user_id"], "model": "claude-sonnet-4-6"})

    run = get_current_run_tree()
    run.name = f"step-{inputs['step_id']}"

    return process(inputs)
```

### Run evaluation on a dataset

```python
from langsmith import Client

client = Client()

def target(inputs: dict) -> dict:
    return {"answer": my_agent.invoke(inputs["question"])}

def correctness_evaluator(run, example) -> dict:
    score = llm_judge(run.outputs["answer"], example.outputs["expected"])
    return {"key": "correctness", "score": score}

def length_summary_evaluator(runs, examples) -> dict:
    avg_len = sum(len(r.outputs["answer"]) for r in runs) / len(runs)
    return {"key": "avg_length", "score": avg_len}

results = client.evaluate(
    target,
    data="my-dataset-name",          # dataset name, ID, or list of Examples
    evaluators=[correctness_evaluator],
    summary_evaluators=[length_summary_evaluator],
    experiment_prefix="my-exp",
    max_concurrency=4,               # None = unlimited, 0 = sequential
    num_repetitions=3,               # run each example 3x
    blocking=True,                   # wait for completion
    error_handling="log",            # or "ignore"
)
```

### Async evaluation

```python
from langsmith.evaluation import aevaluate

results = await aevaluate(
    async_target,
    data="my-dataset",
    evaluators=[correctness_evaluator],
    max_concurrency=10,
)
```

### Comparative A/B evaluation

```python
# Pass two experiment IDs to compare them with the same evaluators
results = client.evaluate(
    (experiment_id_a, experiment_id_b),   # tuple of two existing experiments
    evaluators=[correctness_evaluator],
    # summary_evaluators must be omitted for comparative mode
)

# Or use evaluate_comparative() for custom side-by-side evaluators
from langsmith.evaluation import evaluate_comparative

def compare(runs_a, runs_b) -> dict:
    return {"key": "preference", "score": judge_preference(runs_a, runs_b)}

evaluate_comparative([exp_id_a, exp_id_b], evaluators=[compare])
```

### Custom evaluator decorator

```python
from langsmith.evaluation import run_evaluator

@run_evaluator
def my_evaluator(run, example) -> dict:
    prediction = run.outputs.get("answer", "")
    expected = example.outputs.get("expected", "")
    return {
        "key": "exact_match",
        "score": int(prediction.strip() == expected.strip()),
        "comment": f"Got: {prediction!r}",
    }

results = client.evaluate(target, data="dataset", evaluators=[my_evaluator])
```

### Attach files to a trace

```python
from langsmith import traceable
from langsmith.schemas import Attachment
from pathlib import Path

@traceable
def analyze_image(image_path: Path) -> dict:
    attachment = Attachment(
        mime_type="image/png",
        data=image_path.read_bytes(),
    )
    # Attachment is automatically linked to the active run
    return {"result": vision_model.invoke(image_path)}
```

### ASGI middleware (FastAPI / Starlette)

```python
from fastapi import FastAPI
from langsmith.middleware import TracingMiddleware

app = FastAPI()
app.add_middleware(TracingMiddleware)  # traces every request as a LangSmith run

@app.post("/chat")
async def chat(request: ChatRequest):
    return {"response": await agent.ainvoke(request.message)}
```

### Pytest plugin

```python
# conftest.py — enable LangSmith tracing for all tests
# Install: pip install langsmith[pytest]
# Run: pytest --langsmith  (or set LANGSMITH_TEST_TRACKING=true)
# Tests appear as experiments in LangSmith UI

def test_my_agent():
    result = my_agent.invoke({"question": "What is 2+2?"})
    assert result["answer"] == "4"
```

## API Reference

### Tracing

| Function/Class | Description |
|----------------|-------------|
| `@traceable(name, run_type, tags, metadata)` | Decorator to trace any function |
| `trace(name, run_type, ...)` | Context manager for manual spans |
| `tracing_context(project_name, tags, ...)` | Configure tracing for a block |
| `get_current_run_tree()` | Get the active `RunTree` object |
| `set_run_metadata(metadata)` | Add metadata to the active run |
| `set_tracing_parent(run)` | Manually set parent run for distributed tracing |
| `as_runnable(fn)` | Convert a `@traceable` function to a LangChain `Runnable` |
| `ensure_traceable(fn)` | Ensure a function is `@traceable` (no-op if already is) |

### Evaluation

| Function | Description |
|----------|-------------|
| `client.evaluate(target, data, evaluators, ...)` | Run experiment on a dataset |
| `aevaluate(target, data, evaluators, ...)` | Async version |
| `evaluate_existing(experiment_id, evaluators)` | Score an already-captured experiment |
| `evaluate_comparative([exp_a, exp_b], evaluators)` | Compare two experiments |
| `@run_evaluator` | Decorator for custom per-example evaluators |

### Client

| Method | Description |
|--------|-------------|
| `Client(api_key, api_url)` | Main SDK client |
| `client.create_dataset(name)` | Create a dataset |
| `client.create_examples(inputs, outputs, dataset_id)` | Add examples |
| `client.list_runs(project_name, filter)` | Query traced runs |
| `client.read_run(run_id)` | Get a specific run |
| `client.share_run(run_id)` | Get a shareable URL |

### Error types

| Error | When raised |
|-------|-------------|
| `LangSmithAPIError` | HTTP errors from the API |
| `LangSmithRateLimitError` | 429 rate limit hit |
| `LangSmithAuthError` | Invalid API key |
| `LangSmithNotFoundError` | Resource doesn't exist |
| `LangSmithConnectionError` | Network connectivity issues |
| `LangSmithRequestTimeout` | Request timed out |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference (all classes, methods, signatures) |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langsmith`  
GitHub: `https://github.com/langchain-ai/langsmith-sdk`
