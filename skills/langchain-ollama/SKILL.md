---
name: langchain-ollama
description: LangChain Ollama integration — run local LLMs with ChatOllama (chat completions, tool calling, structured output, reasoning/thinking mode), OllamaLLM (raw text completions), and OllamaEmbeddings. Connects to a local Ollama server at localhost:11434.
---

# LangChain Ollama Skill

Expert assistance for `langchain-ollama`: run local LLMs via Ollama with full LangChain integration — chat, completions, embeddings, tool calling, and structured output.

**Install**:
```bash
pip install -U langchain-ollama
# Pull a model: ollama pull llama3.1
# Linux: start server with `ollama serve`  (Mac: runs automatically)
```

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Using ChatOllama** — chat completions with local models, including streaming and multi-turn
- **Enabling reasoning/thinking mode** — setting `reasoning=True` on supported models (DeepSeek-R1, etc.)
- **Tool calling with local models** — binding tools to `ChatOllama` for function/tool use
- **Structured output** — using `.with_structured_output()` for JSON/Pydantic output
- **Raw text completions** — using `OllamaLLM` for non-chat completion tasks
- **Generating embeddings** — using `OllamaEmbeddings` for RAG or similarity search
- **Connecting to a remote Ollama server** — setting `base_url` to a non-localhost instance
- **Controlling generation params** — `temperature`, `num_predict`, `top_k`, `top_p`, `seed`

## Quick Reference

### ChatOllama — invoke and stream

```python
from langchain_ollama import ChatOllama

model = ChatOllama(
    model="llama3.1",
    temperature=0.8,
    num_predict=256,
    # base_url="http://remote-server:11434",  # default: localhost:11434
    # validate_model_on_init=True,            # check model exists on startup
)

# Invoke
messages = [
    ("system", "You are a helpful translator. Translate the user sentence to French."),
    ("human", "I love programming."),
]
response = model.invoke(messages)
print(response.content)

# Stream
for chunk in model.stream("Explain recursion in one paragraph."):
    print(chunk.content, end="", flush=True)
```

### Reasoning / thinking mode (DeepSeek-R1, QwQ, etc.)

```python
from langchain_ollama import ChatOllama

model = ChatOllama(
    model="deepseek-r1:7b",
    reasoning=True,   # separates reasoning from final answer
    # reasoning=False  → suppress thinking entirely
    # reasoning=None   → default; <think> tags appear in content
)

response = model.invoke("What is 17 * 23?")
print(response.content)                                      # final answer only
print(response.additional_kwargs.get("reasoning_content"))  # reasoning trace
```

### Tool calling

```python
from langchain_ollama import ChatOllama
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    return f"The weather in {city} is sunny and 22°C."

model = ChatOllama(model="llama3.1")
model_with_tools = model.bind_tools([get_weather])

response = model_with_tools.invoke("What's the weather in Paris?")
print(response.tool_calls)
# [{'name': 'get_weather', 'args': {'city': 'Paris'}, 'id': '...'}]
```

### Structured output (JSON / Pydantic)

```python
from langchain_ollama import ChatOllama
from pydantic import BaseModel, Field

class Translation(BaseModel):
    original: str = Field(description="The original text")
    translated: str = Field(description="The translated text")
    language: str = Field(description="Target language")

model = ChatOllama(model="llama3.1")
structured = model.with_structured_output(Translation)

result = structured.invoke("Translate 'Hello world' to Spanish")
print(result.translated)   # "Hola mundo"
```

### OllamaLLM — raw text completions

```python
from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="llama3.1",
    temperature=0.7,
    num_predict=256,
    top_k=40,
    top_p=0.9,
    seed=42,              # reproducible output
    format="json",        # force JSON output format
    keep_alive="5m",      # how long model stays loaded (default "5m")
)

response = llm.invoke("The capital of France is")
print(response)

# Stream raw text
for chunk in llm.stream("Write a haiku about code:"):
    print(chunk, end="", flush=True)
```

### OllamaEmbeddings — generate embeddings for RAG

```python
from langchain_ollama import OllamaEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore

embed = OllamaEmbeddings(model="nomic-embed-text")

# Embed a single query
query_vec = embed.embed_query("What is LangChain?")

# Embed a batch of documents
doc_vecs = embed.embed_documents([
    "LangChain is a framework for LLM applications.",
    "Ollama runs LLMs locally.",
])

# Use in a vector store
vectorstore = InMemoryVectorStore(embed)
vectorstore.add_texts(["LangChain is a framework.", "Ollama runs locally."])
results = vectorstore.similarity_search("What is LangChain?", k=1)
```

### Connect to remote Ollama server

```python
from langchain_ollama import ChatOllama, OllamaEmbeddings

chat = ChatOllama(
    model="llama3.1",
    base_url="http://192.168.1.100:11434",
)

embed = OllamaEmbeddings(
    model="nomic-embed-text",
    base_url="http://192.168.1.100:11434",
)
```

## API Reference

### ChatOllama key parameters

| Param | Type | Description |
|-------|------|-------------|
| `model` | `str` | Ollama model name (e.g. `"llama3.1"`, `"deepseek-r1:7b"`) |
| `reasoning` | `bool \| None` | `True`=separate reasoning, `False`=suppress, `None`=raw tags |
| `temperature` | `float` | Sampling temperature (0.0–1.0) |
| `num_predict` | `int \| None` | Max tokens to generate |
| `base_url` | `str \| None` | Ollama server URL (default: `http://localhost:11434`) |
| `validate_model_on_init` | `bool` | Check model exists on startup |
| `format` | `str \| None` | Output format (e.g. `"json"`) |
| `keep_alive` | `str \| None` | How long model stays loaded in memory |

### OllamaLLM key parameters

| Param | Type | Description |
|-------|------|-------------|
| `model` | `str` | Ollama model name |
| `temperature` | `float \| None` | Sampling temperature |
| `num_predict` | `int \| None` | Max tokens |
| `top_k` | `int \| None` | Limit to K most probable tokens |
| `top_p` | `float \| None` | Nucleus sampling parameter |
| `mirostat` | `int \| None` | Mirostat sampling for perplexity control |
| `seed` | `int \| None` | Random seed for reproducibility |
| `base_url` | `str` | Ollama server URL |
| `keep_alive` | `str \| None` | Model memory retention |
| `format` | `str \| None` | Output format |

### OllamaEmbeddings key parameters

| Param | Type | Description |
|-------|------|-------------|
| `model` | `str` | Embedding model (e.g. `"nomic-embed-text"`, `"mxbai-embed-large"`) |
| `base_url` | `str \| None` | Ollama server URL |

## Common Ollama CLI commands

```bash
ollama pull llama3.1              # download a chat model
ollama pull nomic-embed-text      # download an embedding model
ollama pull deepseek-r1:7b        # download a reasoning model
ollama list                       # list downloaded models
ollama serve                      # start server (Linux/WSL)
ollama ps                         # show running models
ollama rm llama3.1                # remove a model
```

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference (all params, methods) |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-ollama`  
Models: `https://ollama.com/library`
