---
name: langchain-perplexity
description: LangChain Perplexity AI integration — ChatPerplexity (chat model with built-in web search and date/domain filtering), PerplexitySearchRetriever for RAG, PerplexitySearchResults tool, PerplexityEmbeddings, and reasoning output parsers (ReasoningJsonOutputParser, strip_think_tags).
---

# LangChain Perplexity Skill

Expert assistance for `langchain-perplexity`: Perplexity AI integration for LangChain. The key differentiator is `ChatPerplexity` — a chat model with **real-time web search built in at the model level**, plus domain filtering, date filtering, and reasoning model support.

**Install**: `pip install -U langchain-perplexity`  
**Setup**: `export PPLX_API_KEY=your_api_key`

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Using ChatPerplexity** — chat completions with built-in real-time web search
- **Filtering web search by domain** — using `search_domain_filter` to restrict sources
- **Filtering by date** — using `search_recency_filter`, `search_after_date_filter`, or `search_before_date_filter`
- **Disabling web search** — setting `disable_search=True` to use Perplexity as a plain LLM
- **Using reasoning models** — setting `reasoning_effort` on `sonar-reasoning` or `sonar-deep-research`
- **Parsing reasoning output** — using `ReasoningJsonOutputParser` or `strip_think_tags()` to clean `<think>` tags
- **Web search for RAG** — using `PerplexitySearchRetriever` to retrieve live search results as documents
- **Search as a tool** — using `PerplexitySearchResults` in a tool-calling agent
- **Generating embeddings** — using `PerplexityEmbeddings`
- **Returning images or related questions** — setting `return_images=True` or `return_related_questions=True`

## Quick Reference

### ChatPerplexity — basic usage

```python
from langchain_perplexity import ChatPerplexity

model = ChatPerplexity(
    model="sonar",          # sonar | sonar-pro | sonar-reasoning | sonar-deep-research
    temperature=0.7,
    max_tokens=1024,
    # pplx_api_key="...",   # or set PPLX_API_KEY env var
)

# Invoke (web search runs automatically)
messages = [
    ("system", "You are a helpful assistant."),
    ("human", "What are the latest LangChain releases?"),
]
response = model.invoke(messages)
print(response.content)
print(response.response_metadata)   # includes citations, search results

# Stream
for chunk in model.stream(messages):
    print(chunk.content, end="", flush=True)
```

### Filter web search by domain and recency

```python
from langchain_perplexity import ChatPerplexity

model = ChatPerplexity(
    model="sonar-pro",
    search_domain_filter=["arxiv.org", "github.com"],   # only these sources
    search_recency_filter="week",                        # hour|day|week|month
    # search_after_date_filter="2025-01-01",            # ISO date string
    # search_before_date_filter="2026-01-01",
    return_images=False,
    return_related_questions=True,
)

response = model.invoke("What are recent advances in RAG systems?")
```

### Disable web search (use as plain LLM)

```python
from langchain_perplexity import ChatPerplexity

model = ChatPerplexity(
    model="sonar",
    disable_search=True,    # turn off web search entirely
    temperature=0.5,
)

response = model.invoke("Explain transformer attention mechanisms.")
```

### Reasoning model with effort control

```python
from langchain_perplexity import ChatPerplexity

model = ChatPerplexity(
    model="sonar-reasoning",
    reasoning_effort="high",     # low | medium | high
    temperature=0.2,
)

response = model.invoke("Prove that sqrt(2) is irrational.")
print(response.content)   # final answer (think tags stripped or separated)
```

### Parse reasoning model output

```python
from langchain_perplexity import ChatPerplexity
from langchain_perplexity.output_parsers import (
    ReasoningJsonOutputParser,
    ReasoningStructuredOutputParser,
    strip_think_tags,
)

model = ChatPerplexity(model="sonar-reasoning")
raw = model.invoke("What is 17 * 23? Respond with JSON: {result: number}")

# Option 1: strip <think> tags from raw content
clean_content = strip_think_tags(raw.content)

# Option 2: parse reasoning + answer as structured JSON
parser = ReasoningJsonOutputParser()
parsed = parser.parse(raw.content)
# parsed["thinking"] → reasoning trace
# parsed["answer"] → final answer

# Option 3: structured output with Pydantic
from pydantic import BaseModel

class MathResult(BaseModel):
    result: int

structured_parser = ReasoningStructuredOutputParser.from_pydantic(MathResult)
result = structured_parser.parse(raw.content)
```

### Structured output with ChatPerplexity

```python
from langchain_perplexity import ChatPerplexity
from pydantic import BaseModel, Field

class SearchSummary(BaseModel):
    topic: str = Field(description="The main topic")
    key_points: list[str] = Field(description="Key findings")
    sources: list[str] = Field(description="Source URLs cited")

model = ChatPerplexity(model="sonar-pro")
structured = model.with_structured_output(SearchSummary)
result = structured.invoke("What are the main features of LangGraph?")
print(result.key_points)
```

### PerplexitySearchRetriever — live web search for RAG

```python
from langchain_perplexity import PerplexitySearchRetriever

retriever = PerplexitySearchRetriever(
    k=3,                           # number of documents to return
    search_domain_filter=["docs.langchain.com"],
    search_recency_filter="month",
    # pplx_api_key="...",
)

docs = retriever.invoke("LangGraph StateGraph tutorial")
for doc in docs:
    print(doc.page_content[:200])
    print(doc.metadata)
```

### PerplexitySearchResults — search as a tool in an agent

```python
from langchain_perplexity import PerplexitySearchResults
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

search_tool = PerplexitySearchResults()

# Use in a ReAct agent alongside other tools
agent = create_react_agent(
    ChatOpenAI(model="gpt-4o-mini"),
    tools=[search_tool],
)
result = agent.invoke({"messages": [("human", "What happened in AI this week?")]})
```

### PerplexityEmbeddings

```python
from langchain_perplexity import PerplexityEmbeddings

embeddings = PerplexityEmbeddings()

# Embed a query
query_vec = embeddings.embed_query("What is LangChain?")

# Embed documents
doc_vecs = embeddings.embed_documents([
    "LangChain is an LLM framework.",
    "Perplexity is an AI search engine.",
])
```

## Model Selection Guide

| Model | Speed | Search | Reasoning | Use for |
|-------|-------|--------|-----------|---------|
| `sonar` | Fast | ✅ | No | General Q&A, simple factual queries |
| `sonar-pro` | Medium | ✅ | No | Complex questions, higher accuracy |
| `sonar-reasoning` | Slow | ✅ | ✅ | Step-by-step reasoning + live facts |
| `sonar-deep-research` | Very slow | ✅ | ✅ | Extensive research, comprehensive reports |

## API Reference

### `ChatPerplexity` key parameters

| Param | Type | Description |
|-------|------|-------------|
| `model` | `str` | Model name (see table above) |
| `temperature` | `float` | Sampling temperature |
| `max_tokens` | `int` | Max tokens to generate |
| `pplx_api_key` | `str` | API key (or `PPLX_API_KEY` env) |
| `reasoning_effort` | `str` | `"low"`, `"medium"`, `"high"` for reasoning models |
| `disable_search` | `bool` | Turn off web search entirely |
| `search_domain_filter` | `list[str]` | Restrict search to these domains |
| `search_recency_filter` | `str` | `"hour"`, `"day"`, `"week"`, `"month"` |
| `search_after_date_filter` | `str` | ISO date: only results after this date |
| `search_before_date_filter` | `str` | ISO date: only results before this date |
| `return_images` | `bool` | Include images in response metadata |
| `return_related_questions` | `bool` | Include related questions in metadata |
| `language_preference` | `str` | Preferred response language |

### Output parsers

| Class/Function | Description |
|----------------|-------------|
| `strip_think_tags(text)` | Remove `<think>...</think>` from raw content |
| `ReasoningJsonOutputParser` | Parse reasoning + final JSON answer |
| `ReasoningStructuredOutputParser.from_pydantic(schema)` | Parse reasoning + Pydantic model |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-perplexity`  
API Key: `https://www.perplexity.ai/settings/api`
