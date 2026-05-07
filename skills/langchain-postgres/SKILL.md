---
name: langchain-postgres
description: LangChain PostgreSQL integration — PGVectorStore (v2, recommended) and PGVector (v1 legacy) for pgvector RAG, PostgresChatMessageHistory for persistent chat, HNSW/IVFFlat index management, hybrid search, async-first engine via PGEngine, and custom metadata columns.
---

# LangChain Postgres Skill

Expert assistance for `langchain-postgres`: pgvector-backed vector store and PostgreSQL chat history for LangChain. Use **v2 API** (`PGVectorStore` + `PGEngine`) for new projects; v1 (`PGVector`) is legacy.

**Install**:
```bash
pip install -U langchain-postgres psycopg[binary] psycopg-pool
# Start PostgreSQL with pgvector:
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password pgvector/pgvector:pg16
```

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Creating a pgvector store (v2)** — using `PGEngine` + `PGVectorStore.create()` or `create_sync()`
- **Using legacy PGVector (v1)** — constructing `PGVector` with `connection_string` directly
- **Initializing the vector table** — calling `engine.init_vectorstore_table()` before first use
- **Adding HNSW or IVFFlat indexes** — using `apply_vector_index()` with `HNSWIndex` or `IVFFlatIndex`
- **Hybrid search** — configuring `HybridSearchConfig` with `weighted_sum_ranking` or `reciprocal_rank_fusion`
- **Adding custom metadata columns** — using `Column` / `ColumnDict` in table initialization
- **Persisting chat history in Postgres** — using `PostgresChatMessageHistory` with sync or async psycopg connections
- **Async vector store operations** — using `AsyncPGVectorStore` or the async methods on `PGVectorStore`
- **Managing indexes** — calling `drop_vector_index()`, `reindex()`, `is_valid_index()`

## Quick Reference

### v2 API — PGEngine + PGVectorStore (recommended for new projects)

```python
from langchain_postgres.v2.engine import PGEngine
from langchain_postgres.v2.vectorstores import PGVectorStore
from langchain_openai import OpenAIEmbeddings

# Step 1: create engine (manages async connection pool)
engine = PGEngine.from_connection_string(
    url="postgresql+asyncpg://user:password@localhost:5432/mydb"
)

# Step 2: initialize the table (run once)
engine.init_vectorstore_table(
    table_name="my_vectors",
    vector_size=1536,           # must match embedding dimension
    # overwrite_existing=False  # set True to recreate
)

# Step 3: create the vector store (use factory, NOT constructor)
vector_store = PGVectorStore.create_sync(
    engine=engine,
    embedding_service=OpenAIEmbeddings(),
    table_name="my_vectors",
)

# Add documents
from langchain_core.documents import Document
docs = [Document(page_content="LangChain is a framework.", metadata={"source": "docs"})]
vector_store.add_documents(docs)

# Search
results = vector_store.similarity_search("What is LangChain?", k=3)

# Cleanup
engine.close()
```

### v2 API — async usage

```python
import asyncio
from langchain_postgres.v2.engine import PGEngine
from langchain_postgres.v2.vectorstores import PGVectorStore
from langchain_openai import OpenAIEmbeddings

async def main():
    engine = PGEngine.from_connection_string(
        url="postgresql+asyncpg://user:password@localhost:5432/mydb"
    )
    await engine.ainit_vectorstore_table("my_vectors", vector_size=1536)

    store = await PGVectorStore.create(
        engine=engine,
        embedding_service=OpenAIEmbeddings(),
        table_name="my_vectors",
    )

    await store.aadd_documents(docs)
    results = await store.asimilarity_search("LangChain", k=3)
    await engine.close()

asyncio.run(main())
```

### v2 API — HNSW index for fast approximate search

```python
from langchain_postgres.v2.indexes import HNSWIndex, HNSWQueryOptions, DistanceStrategy

# Apply HNSW index after loading data
vector_store.apply_vector_index(
    HNSWIndex(
        name="hnsw_idx",
        distance_strategy=DistanceStrategy.COSINE,
        m=16,           # max connections per node (default 16)
        ef_construction=64,  # build-time search width (default 64)
    )
)

# Use optimized query options at search time
results = vector_store.similarity_search(
    "my query",
    k=5,
    query_options=HNSWQueryOptions(ef_search=40),
)

# IVFFlat for larger datasets
from langchain_postgres.v2.indexes import IVFFlatIndex, IVFFlatQueryOptions
vector_store.apply_vector_index(
    IVFFlatIndex(name="ivfflat_idx", lists=100)
)
results = vector_store.similarity_search(
    "my query", k=5, query_options=IVFFlatQueryOptions(probes=10)
)
```

### v2 API — hybrid search (vector + full-text)

```python
from langchain_postgres.v2.hybrid_search_config import (
    HybridSearchConfig,
    reciprocal_rank_fusion,
    weighted_sum_ranking,
)

# Configure hybrid search on the store
vector_store.apply_hybrid_search_index(
    HybridSearchConfig(
        ranking_function=reciprocal_rank_fusion,   # or weighted_sum_ranking
        # For weighted_sum_ranking:
        # ranking_function=weighted_sum_ranking,
        # alpha=0.7,  # weight for vector score (0=full-text only, 1=vector only)
    )
)

results = vector_store.similarity_search("my query", k=5, search_type="hybrid")
```

### v2 API — custom metadata columns

```python
from langchain_postgres.v2.engine import PGEngine, Column

engine.init_vectorstore_table(
    table_name="my_vectors",
    vector_size=1536,
    metadata_columns=[
        Column(name="source", data_type="TEXT"),
        Column(name="created_at", data_type="TIMESTAMP"),
        Column(name="score", data_type="FLOAT"),
    ],
)
```

### v1 API — legacy PGVector (simple setup)

```python
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings

# Direct constructor (v1 only)
vector_store = PGVector(
    embeddings=OpenAIEmbeddings(),
    collection_name="my_collection",
    connection="postgresql+psycopg://user:password@localhost:5432/mydb",
    # distance_strategy=DistanceStrategy.COSINE,
    # use_jsonb=True,
)

vector_store.add_documents(docs)
results = vector_store.similarity_search("LangChain", k=3)
```

### PostgresChatMessageHistory (sync and async)

```python
import psycopg
from langchain_postgres import PostgresChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

# Create table (run once)
conn_info = "postgresql://user:password@localhost:5432/mydb"
sync_conn = psycopg.connect(conn_info)
PostgresChatMessageHistory.create_tables(sync_conn, "chat_history")

# Use in a session
history = PostgresChatMessageHistory(
    table_name="chat_history",
    session_id="user-session-xyz",
    sync_connection=sync_conn,
)
history.add_messages([
    HumanMessage(content="Hello!"),
    AIMessage(content="Hi! How can I help?"),
])
print(history.messages)
history.clear()

# Async version
async def async_history():
    async_conn = await psycopg.AsyncConnection.connect(conn_info)
    await PostgresChatMessageHistory.acreate_tables(async_conn, "chat_history")
    history = PostgresChatMessageHistory(
        table_name="chat_history",
        session_id="user-abc",
        async_connection=async_conn,
    )
    await history.aadd_messages([HumanMessage(content="Hi")])
    msgs = await history.aget_messages()
```

## v1 vs v2 Decision Guide

| Aspect | v1 `PGVector` | v2 `PGVectorStore` |
|--------|--------------|-------------------|
| Construction | Direct constructor | Factory: `create()` / `create_sync()` |
| Connection | `connection_string` param | `PGEngine.from_connection_string()` |
| Async | Limited | First-class async throughout |
| Indexes | Manual SQL | `apply_vector_index(HNSWIndex(...))` |
| Hybrid search | No | Yes (`HybridSearchConfig`) |
| Custom columns | Limited | `Column` / `ColumnDict` |
| Table management | Auto | `init_vectorstore_table()` required |
| **Use for** | Legacy/simple | **New projects** |

## API Reference

### `PGEngine` (v2)

| Method | Description |
|--------|-------------|
| `PGEngine.from_connection_string(url)` | Create engine from connection string |
| `PGEngine.from_engine(engine)` | Wrap existing SQLAlchemy AsyncEngine |
| `engine.init_vectorstore_table(table, vector_size, ...)` | Create vector table |
| `engine.drop_table(table_name)` | Drop a table |
| `engine.close()` | Close connection pool |

### `PGVectorStore` (v2) key methods

| Method | Description |
|--------|-------------|
| `PGVectorStore.create_sync(engine, embedding, table_name)` | Sync factory |
| `PGVectorStore.create(engine, embedding, table_name)` | Async factory (awaitable) |
| `add_documents(docs)` / `aadd_documents(docs)` | Add documents |
| `similarity_search(query, k)` / `asimilarity_search(...)` | Vector search |
| `similarity_search_with_score(query, k)` | Search with distance scores |
| `max_marginal_relevance_search(query, k, fetch_k)` | MMR diversity search |
| `apply_vector_index(index)` | Apply HNSW or IVFFlat index |
| `apply_hybrid_search_index(config)` | Enable hybrid search |
| `drop_vector_index(name)` | Remove an index |
| `reindex(name)` | Rebuild an index |
| `is_valid_index(name)` | Check index health |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference (all classes, methods) |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

**Requires**: PostgreSQL with `pgvector` extension (`pgvector/pgvector:pg16` Docker image).  
Source: `https://reference.langchain.com/python/langchain-postgres`  
GitHub: `https://github.com/langchain-ai/langchain-postgres`
