---
name: langchain-redis
description: LangChain Redis integration — RedisVectorStore for RAG, RedisCache and RedisSemanticCache for LLM response caching, RedisChatMessageHistory for persistent conversation memory, and RedisConfig for connection management. Requires Redis Stack (redis/redis-stack-server).
---

# LangChain Redis Skill

Expert assistance for `langchain-redis`: Redis-backed vector store, LLM caching, and chat message history for LangChain applications.

**Install**:
```bash
pip install -U langchain-redis
docker run -p 6379:6379 redis/redis-stack-server:latest
```

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Building a RAG pipeline** — using `RedisVectorStore` to store and search document embeddings
- **Adding LLM caching** — using `RedisCache` (exact match) or `RedisSemanticCache` (similarity-based)
- **Tuning semantic cache sensitivity** — adjusting `distance_threshold` on `RedisSemanticCache`
- **Persisting chat history** — using `RedisChatMessageHistory` to store multi-turn conversations
- **Setting session TTL** — configuring auto-expiry on chat history or vector store keys
- **Filtering vector search** — using `redisvl.query.filter` tags/ranges with `similarity_search`
- **Using a pre-existing Redis client** — passing `redis_client` instead of `redis_url`
- **Configuring the Redis connection** — using `RedisConfig` for index settings and distance metrics

## Quick Reference

### RedisVectorStore — vector store for RAG

```python
from langchain_redis import RedisVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

# Create vector store
vector_store = RedisVectorStore(
    index_name="my-rag-index",
    embeddings=OpenAIEmbeddings(),
    redis_url="redis://localhost:6379",
    # distance_metric="COSINE",      # COSINE | IP | L2
    # indexing_algorithm="FLAT",     # FLAT | HNSW
    # ttl=3600,                      # optional key expiry in seconds
)

# Add documents
docs = [
    Document(page_content="LangChain is an LLM framework.", metadata={"source": "docs"}),
    Document(page_content="Redis is an in-memory data store.", metadata={"source": "wiki"}),
]
ids = vector_store.add_documents(docs)

# Similarity search
results = vector_store.similarity_search("What is LangChain?", k=2)
for doc in results:
    print(f"* {doc.page_content} [{doc.metadata}]")

# Search with score
results_with_scores = vector_store.similarity_search_with_score("LLM framework", k=1)

# Delete documents
vector_store.delete(ids=["doc-id-to-remove"])
```

### RedisVectorStore — from existing Redis client

```python
from langchain_redis import RedisVectorStore
from langchain_openai import OpenAIEmbeddings
from redis import Redis

redis_client = Redis.from_url("redis://localhost:6379")

vector_store = RedisVectorStore(
    embeddings=OpenAIEmbeddings(),
    index_name="my-index",
    redis_client=redis_client,   # use pre-existing connection
)
```

### RedisVectorStore — filtered search

```python
from redisvl.query.filter import Tag, Num

# Filter by metadata tag
results = vector_store.similarity_search(
    "machine learning",
    k=5,
    filter=Tag("source") == "docs",
)

# Combine filters
results = vector_store.similarity_search(
    "neural networks",
    k=3,
    filter=(Tag("category") == "ai") & (Num("year") >= 2023),
)
```

### RedisCache — exact LLM response cache

```python
from langchain_redis import RedisCache
from langchain_core.globals import set_llm_cache

# Cache exact prompt→response pairs in Redis
cache = RedisCache(redis_url="redis://localhost:6379", ttl=3600)
set_llm_cache(cache)

# All subsequent LLM calls are automatically cached
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke("What is Redis?")   # cached after first call
```

### RedisSemanticCache — similarity-based LLM cache

```python
from langchain_redis import RedisSemanticCache
from langchain_openai import OpenAIEmbeddings
from langchain_core.globals import set_llm_cache

semantic_cache = RedisSemanticCache(
    embeddings=OpenAIEmbeddings(),
    redis_url="redis://localhost:6379",
    distance_threshold=0.15,   # 0.0=exact, higher=looser; default 0.2
    ttl=7200,                  # optional expiry in seconds
)
set_llm_cache(semantic_cache)

# "What is Redis?" and "Tell me about Redis" may share a cache entry
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke("What is Redis?")
similar = llm.invoke("Tell me about Redis")  # may hit cache
```

### RedisChatMessageHistory — persistent multi-turn memory

```python
from langchain_redis import RedisChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

history = RedisChatMessageHistory(
    session_id="user-session-abc123",
    redis_url="redis://localhost:6379",
    ttl=3600,          # auto-expire session after 1 hour
    key_prefix="chat:" # Redis key prefix (default: "chat:")
)

# Add messages
history.add_message(HumanMessage(content="Hello!"))
history.add_message(AIMessage(content="Hi! How can I help?"))

# Read history
for msg in history.messages:
    print(f"{msg.type}: {msg.content}")

# Clear session
history.clear()
```

### Use RedisChatMessageHistory with a chain

```python
from langchain_redis import RedisChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(
        session_id=session_id,
        redis_url="redis://localhost:6379",
        ttl=3600,
    )

chain_with_history = RunnableWithMessageHistory(llm, get_session_history)

response = chain_with_history.invoke(
    "What is the capital of France?",
    config={"configurable": {"session_id": "user-123"}},
)
```

## API Reference

### `RedisVectorStore` key parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `index_name` | `str` | — | Name of the Redis search index |
| `embeddings` | `Embeddings` | — | Embedding function |
| `redis_url` | `str` | — | Redis connection URL |
| `redis_client` | `Redis \| None` | `None` | Pre-existing Redis client (overrides url) |
| `distance_metric` | `str` | `"COSINE"` | `COSINE`, `IP`, or `L2` |
| `indexing_algorithm` | `str` | `"FLAT"` | `FLAT` or `HNSW` |
| `ttl` | `int \| None` | `None` | Key expiry in seconds |

### `RedisSemanticCache` key parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `embeddings` | `Embeddings` | — | Embedding function for prompt encoding |
| `redis_url` | `str` | `"redis://localhost:6379"` | Redis connection URL |
| `distance_threshold` | `float` | `0.2` | Max distance for cache hit (lower=stricter) |
| `ttl` | `int \| None` | `None` | Cache entry expiry in seconds |
| `redis_client` | `Redis \| None` | `None` | Pre-existing Redis client |

### `RedisChatMessageHistory` key parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `session_id` | `str` | — | Unique conversation identifier |
| `redis_url` | `str` | `"redis://localhost:6379"` | Redis connection URL |
| `ttl` | `int \| None` | `None` | Session expiry in seconds |
| `key_prefix` | `str` | `"chat:"` | Redis key prefix |
| `redis_client` | `Redis \| None` | `None` | Pre-existing Redis client |
| `overwrite_index` | `bool` | `False` | Overwrite existing index if present |

## `distance_threshold` tuning guide

| Value | Behavior | Use when |
|-------|----------|----------|
| `0.0–0.05` | Very strict — near-identical prompts only | High precision needed |
| `0.1–0.15` | Strict — same question, different wording | Production default |
| `0.2` | Moderate (default) — semantically similar | General use |
| `0.3+` | Loose — related but different questions may match | High cache hit rate |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference (all params, methods) |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

**Requires**: Redis Stack (not plain Redis) — `redis/redis-stack-server` Docker image or Redis Cloud.  
Source: `https://reference.langchain.com/python/langchain-redis`  
GitHub: `https://github.com/langchain-ai/langchain-redis`
