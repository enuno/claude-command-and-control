---
name: langchain-neo4j
description: LangChain Neo4j integration — Neo4jGraph for Cypher queries and schema inspection, GraphCypherQAChain for natural-language-to-Cypher Q&A, Neo4jVector for vector/hybrid RAG, Neo4jSaver LangGraph checkpointer, Neo4jChatMessageHistory, and GraphDocument/Node/Relationship for knowledge graph construction.
---

# LangChain Neo4j Skill

Expert assistance for `langchain-neo4j`: connect LangChain to Neo4j for graph-powered RAG, natural language Cypher queries, vector search, knowledge graph construction, and LangGraph state persistence.

**Install**: `pip install -U langchain-neo4j`  
**Docker**: `docker run -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest`  
**Env vars**: `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Connecting to Neo4j** — creating a `Neo4jGraph` with url/username/password or token
- **Running Cypher queries** — calling `graph.query()` for read/write operations
- **Inspecting graph schema** — using `graph.schema` or `enhanced_schema=True`
- **Natural language graph Q&A** — using `GraphCypherQAChain.from_llm()` to answer questions with Cypher
- **Vector RAG on Neo4j** — using `Neo4jVector.from_documents()` or hybrid search
- **Hybrid search (vector + full-text)** — setting `search_type=SearchType.HYBRID`
- **Custom Cypher retrieval** — using `retrieval_query` on `Neo4jVector`
- **Building knowledge graphs** — using `GraphDocument`, `Node`, `Relationship` + `graph.add_graph_documents()`
- **LangGraph checkpointing in Neo4j** — using `Neo4jSaver` or `AsyncNeo4jSaver`
- **Persisting chat history in Neo4j** — using `Neo4jChatMessageHistory`

## Quick Reference

### Neo4jGraph — connect and query

```python
from langchain_neo4j import Neo4jGraph

graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    # database="neo4j",          # default: "neo4j"
    # enhanced_schema=True,      # scan for example values
    # sanitize=True,             # remove large list properties (e.g. embeddings)
    # timeout=30.0,              # transaction timeout in seconds
)

# Run a Cypher query
results = graph.query("MATCH (n:Person) RETURN n.name LIMIT 5")
print(results)

# Inspect schema (auto-loaded on init)
print(graph.schema)

# Refresh schema after schema changes
graph.refresh_schema()
```

### GraphCypherQAChain — natural language → Cypher → answer

```python
from langchain_neo4j import Neo4jGraph, GraphCypherQAChain
from langchain_openai import ChatOpenAI

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,
    allow_dangerous_requests=True,   # required safety flag
    top_k=5,                         # max Cypher results to pass to answer LLM
    return_intermediate_steps=True,  # include generated Cypher in output
)

result = chain.invoke({"query": "Who directed The Matrix?"})
print(result["result"])
print(result["intermediate_steps"])  # shows generated Cypher
```

### Neo4jVector — vector store RAG

```python
from langchain_neo4j import Neo4jVector
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

embeddings = OpenAIEmbeddings()

# Create from documents
vector_store = Neo4jVector.from_documents(
    documents=[Document(page_content="Neo4j is a graph database.")],
    embedding=embeddings,
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    index_name="my_index",
    node_label="Chunk",
)

# Add more documents
vector_store.add_documents([Document(page_content="LangChain is an LLM framework.")])

# Similarity search
results = vector_store.similarity_search("graph database", k=3)

# Search with scores
results = vector_store.similarity_search_with_score("graph database", k=3)
```

### Neo4jVector — hybrid search (vector + full-text)

```python
from langchain_neo4j import Neo4jVector
from langchain_neo4j.vectorstores.neo4j_vector import SearchType
from langchain_openai import OpenAIEmbeddings

vector_store = Neo4jVector.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings(),
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    search_type=SearchType.HYBRID,        # vector + full-text
    keyword_index_name="keyword_index",   # Neo4j full-text index name
)

results = vector_store.similarity_search("graph database LLM", k=5)
```

### Neo4jVector — custom Cypher retrieval query

```python
from langchain_neo4j import Neo4jVector
from langchain_openai import OpenAIEmbeddings

# Traverse graph relationships after vector search
retrieval_query = """
RETURN node.text AS text,
       score,
       {source: node.source, related: [(node)-[:MENTIONS]->(e) | e.name]} AS metadata
"""

vector_store = Neo4jVector(
    embedding=OpenAIEmbeddings(),
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    retrieval_query=retrieval_query,
)

results = vector_store.similarity_search("AI frameworks", k=3)
```

### Build a knowledge graph with GraphDocument

```python
from langchain_neo4j import Neo4jGraph
from langchain_neo4j.graphs.graph_document import GraphDocument, Node, Relationship
from langchain_core.documents import Document

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")

# Construct graph documents manually
nodes = [
    Node(id="LangChain", type="Framework", properties={"language": "Python"}),
    Node(id="Neo4j", type="Database", properties={"type": "Graph"}),
]
relationships = [
    Relationship(
        source=Node(id="LangChain", type="Framework"),
        target=Node(id="Neo4j", type="Database"),
        type="INTEGRATES_WITH",
    )
]
graph_doc = GraphDocument(
    nodes=nodes,
    relationships=relationships,
    source=Document(page_content="LangChain integrates with Neo4j."),
)

# Write to Neo4j
graph.add_graph_documents([graph_doc], baseEntityLabel=True, include_source=True)
```

### Neo4jSaver — LangGraph checkpointer in Neo4j

```python
from langchain_neo4j import Neo4jSaver
from langgraph.graph import StateGraph, MessagesState
from langgraph.checkpoint.memory import InMemorySaver

# Sync checkpointer
with Neo4jSaver.from_conn_string("bolt://localhost:7687") as saver:
    # or: Neo4jSaver(driver=my_neo4j_driver)
    graph = StateGraph(MessagesState)
    # ... add nodes and edges ...
    app = graph.compile(checkpointer=saver)
    result = app.invoke(inputs, config={"configurable": {"thread_id": "1"}})

# Async checkpointer
from langchain_neo4j import AsyncNeo4jSaver

async with AsyncNeo4jSaver.from_conn_string("bolt://localhost:7687") as saver:
    app = graph.compile(checkpointer=saver)
    result = await app.ainvoke(inputs, config={"configurable": {"thread_id": "1"}})
```

### Neo4jChatMessageHistory

```python
from langchain_neo4j import Neo4jChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

history = Neo4jChatMessageHistory(
    session_id="user-session-123",
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
)

history.add_message(HumanMessage(content="Hello!"))
history.add_message(AIMessage(content="Hi! How can I help?"))

print(history.messages)
history.clear()
```

## API Reference

### `Neo4jGraph` key parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | `str` | — | Neo4j connection URL (e.g. `bolt://localhost:7687`) |
| `username` | `str` | — | Database username |
| `password` | `str` | — | Database password |
| `token` | `str` | — | Auth token (alternative to username/password) |
| `database` | `str` | `"neo4j"` | Database name |
| `enhanced_schema` | `bool` | `False` | Scan for example property values |
| `sanitize` | `bool` | `False` | Remove large list properties from results |
| `timeout` | `float` | `None` | Transaction timeout in seconds |

### `GraphCypherQAChain.from_llm()` key params

| Param | Description |
|-------|-------------|
| `llm` | LLM for Cypher generation and answer synthesis |
| `graph` | `Neo4jGraph` instance |
| `allow_dangerous_requests` | **Required `True`** — security acknowledgement |
| `top_k` | Max Cypher result rows to pass to answer LLM |
| `return_intermediate_steps` | Include generated Cypher in output |
| `return_direct` | Return raw Cypher results, skip answer LLM |
| `cypher_query_corrector` | `CypherQueryCorrector` for auto-fix |

### `Neo4jVector` search types

| `search_type` | Description |
|---------------|-------------|
| `SearchType.VECTOR` | Pure vector similarity (default) |
| `SearchType.HYBRID` | Vector + full-text (Lucene), combined score |

## Security Note

`Neo4jGraph` and `GraphCypherQAChain` can write to the database. Always use credentials scoped to read-only access when building Q&A applications. Set `allow_dangerous_requests=True` explicitly in `GraphCypherQAChain` as acknowledgement of this risk.

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-neo4j`  
GitHub: `https://github.com/langchain-ai/langchain-neo4j`
