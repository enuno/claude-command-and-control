---
name: langchain-openrouter
description: LangChain OpenRouter integration — ChatOpenRouter gives access to hundreds of models (Claude, GPT-4o, Gemini, Llama, etc.) through a single API key. Supports provider routing preferences, reasoning models, plugins, tool calling, structured output, and request attribution/tracing.
---

# LangChain OpenRouter Skill

Expert assistance for `langchain-openrouter`: one class (`ChatOpenRouter`) that routes to hundreds of models from OpenAI, Anthropic, Google, Meta, and more through a single API and API key.

**Install**: `pip install -U langchain-openrouter`  
**Setup**: `export OPENROUTER_API_KEY=your_api_key`  
**Models**: `https://openrouter.ai/models`

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Switching between model providers** — using `ChatOpenRouter` with different `model` strings
- **Routing to a specific provider** — using `openrouter_provider={"order": [...]}` to prefer one backend
- **Using reasoning models** — setting `reasoning` param for models like `deepseek/deepseek-r1`
- **Tool calling** — using `.bind_tools()` with any OpenRouter model
- **Structured output** — using `.with_structured_output()` with a Pydantic schema
- **Adding app attribution** — setting `app_url`, `app_title`, `app_categories` for marketplace
- **Grouping requests** — using `session_id` for observability
- **Tracing broadcast metadata** — using `trace` param
- **Using OpenRouter plugins** — setting `plugins` param

## Quick Reference

### ChatOpenRouter — basic usage

```python
from langchain_openrouter import ChatOpenRouter

# Use any model from openrouter.ai/models
model = ChatOpenRouter(
    model="anthropic/claude-sonnet-4-6",
    temperature=0.7,
    max_tokens=1024,
    # api_key="...",  # or set OPENROUTER_API_KEY env var
)

response = model.invoke("Explain quantum entanglement in plain English.")
print(response.content)

# Stream
for chunk in model.stream("Write a haiku about code:"):
    print(chunk.content, end="", flush=True)
```

### Switch models with one variable

```python
from langchain_openrouter import ChatOpenRouter

# GPT-4o
model = ChatOpenRouter(model="openai/gpt-4o", temperature=0)

# Gemini Flash (fast, cheap)
model = ChatOpenRouter(model="google/gemini-2.0-flash", temperature=0)

# Llama 3.1 (open source, free tier)
model = ChatOpenRouter(model="meta-llama/llama-3.1-8b-instruct", temperature=0.5)

# DeepSeek R1 (reasoning)
model = ChatOpenRouter(model="deepseek/deepseek-r1", temperature=0)
```

### Force routing to a specific provider

```python
from langchain_openrouter import ChatOpenRouter

# Force anthropic/claude-sonnet-4-5 to route through Anthropic (not a proxy)
model = ChatOpenRouter(
    model="anthropic/claude-sonnet-4-6",
    openrouter_provider={
        "order": ["Anthropic"],          # try Anthropic first
        # "allow_fallbacks": False,      # fail if Anthropic unavailable
        # "require_parameters": True,    # only use providers that support all params
    },
)

# Route through Azure OpenAI
model = ChatOpenRouter(
    model="openai/gpt-4o",
    openrouter_provider={"order": ["Azure"]},
)
```

### Reasoning models

```python
from langchain_openrouter import ChatOpenRouter

model = ChatOpenRouter(
    model="deepseek/deepseek-r1",
    reasoning={
        "effort": "high",       # low | medium | high
        # "exclude": False,     # True to hide reasoning from response
    },
    temperature=0,
)

response = model.invoke("What is the 100th Fibonacci number?")
print(response.content)
# response.additional_kwargs may contain reasoning trace
```

### Tool calling

```python
from langchain_openrouter import ChatOpenRouter
from langchain_core.tools import tool

@tool
def get_stock_price(ticker: str) -> float:
    """Get the current stock price for a ticker symbol."""
    return 150.25  # mock

model = ChatOpenRouter(model="openai/gpt-4o-mini")
model_with_tools = model.bind_tools([get_stock_price])

response = model_with_tools.invoke("What's the current AAPL price?")
print(response.tool_calls)
```

### Structured output

```python
from langchain_openrouter import ChatOpenRouter
from pydantic import BaseModel, Field

class MovieReview(BaseModel):
    title: str = Field(description="Movie title")
    rating: float = Field(description="Rating from 0 to 10")
    summary: str = Field(description="Brief review summary")

model = ChatOpenRouter(model="anthropic/claude-sonnet-4-6")
structured = model.with_structured_output(MovieReview)

review = structured.invoke("Review the movie Inception.")
print(f"{review.title}: {review.rating}/10")
```

### Attribution and observability

```python
from langchain_openrouter import ChatOpenRouter

model = ChatOpenRouter(
    model="openai/gpt-4o-mini",
    app_url="https://myapp.example.com",    # shows in OpenRouter dashboard
    app_title="My LLM App",
    app_categories=["productivity", "coding"],
    session_id="user-session-abc123",        # group related requests
    trace={                                   # metadata for broadcast
        "user_id": "user-123",
        "experiment": "v2-prompts",
    },
)
```

## API Reference

### `ChatOpenRouter` key parameters

| Param | Type | Description |
|-------|------|-------------|
| `model` | `str` | Model ID (e.g. `"anthropic/claude-sonnet-4-6"`) |
| `temperature` | `float \| None` | Sampling temperature |
| `max_tokens` | `int \| None` | Max tokens to generate |
| `max_completion_tokens` | `int \| None` | Alias for max_tokens |
| `top_p` | `float \| None` | Nucleus sampling |
| `frequency_penalty` | `float \| None` | Repetition penalty |
| `presence_penalty` | `float \| None` | Topic novelty penalty |
| `seed` | `int \| None` | Reproducibility seed |
| `api_key` | `str \| None` | API key (or `OPENROUTER_API_KEY` env) |
| `openrouter_provider` | `dict` | Provider routing preferences |
| `reasoning` | `dict \| None` | Reasoning config `{"effort": "high"}` |
| `plugins` | `list \| None` | OpenRouter plugins |
| `app_url` | `str \| None` | App URL for attribution |
| `app_title` | `str \| None` | App title for attribution |
| `app_categories` | `list[str] \| None` | Marketplace categories |
| `session_id` | `str \| None` | Group related requests |
| `trace` | `dict \| None` | Broadcast trace metadata |
| `max_retries` | `int` | Max retries (default `2`) |
| `streaming` | `bool` | Enable streaming |

### `openrouter_provider` options

```python
{
    "order": ["Anthropic", "AWS Bedrock"],  # provider preference order
    "allow_fallbacks": True,                 # fall back to other providers
    "require_parameters": True,              # only providers supporting all params
    "data_collection": "deny",               # opt out of training data use
    "only": ["Anthropic"],                   # restrict to specific providers
    "ignore": ["Azure"],                     # exclude specific providers
}
```

## Popular Model IDs

| Provider | Model ID | Notes |
|----------|----------|-------|
| Anthropic | `anthropic/claude-sonnet-4-6` | Latest Sonnet |
| Anthropic | `anthropic/claude-haiku-4-5` | Fast/cheap |
| OpenAI | `openai/gpt-4o` | Most capable GPT-4 |
| OpenAI | `openai/gpt-4o-mini` | Fast/cheap |
| Google | `google/gemini-2.0-flash` | Fast, multimodal |
| Google | `google/gemini-2.5-pro` | Most capable Gemini |
| Meta | `meta-llama/llama-3.1-8b-instruct` | Open source |
| DeepSeek | `deepseek/deepseek-r1` | Reasoning model |
| Mistral | `mistralai/mistral-large` | Strong European model |

Full list: `https://openrouter.ai/models`

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-openrouter`  
Platform docs: `https://openrouter.ai/docs`  
API key: `https://openrouter.ai/keys`
