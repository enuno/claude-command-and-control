---
name: langchain-exa
description: LangChain Exa integration — semantic web search with ExaSearchRetriever (RAG), ExaSearchResults (agent tool), and ExaFindSimilarResults (find similar URLs). Unique features: use_autoprompt (LLM query rewriting), highlights (excerpts), summary (per-result LLM summaries), livecrawl (real-time), and date filtering.
---

# LangChain Exa Skill

Expert assistance for `langchain-exa`: Exa's neural/semantic web search as a LangChain retriever and agent tools.

**Install**: `pip install -U langchain-exa`  
**Setup**: `export EXA_API_KEY=your_api_key`  
**API**: `https://exa.ai`

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Semantic web search for RAG** — using `ExaSearchRetriever` to retrieve live web results as documents
- **Search as an agent tool** — using `ExaSearchResults` for tool-calling in a ReAct agent
- **Finding similar content** — using `ExaFindSimilarResults` to find pages similar to a URL
- **Getting per-result summaries** — setting `summary=True` for LLM-generated page summaries
- **Getting highlighted excerpts** — setting `highlights=True` for relevant snippets from each page
- **Real-time crawling** — setting `livecrawl="always"` to bypass index and crawl live
- **LLM query rewriting** — setting `use_autoprompt=True` for Exa to optimize the query
- **Filtering by domain** — using `include_domains` or `exclude_domains`
- **Filtering by date** — using `start_published_date`, `end_published_date`, `start_crawl_date`, `end_crawl_date`
- **Choosing search type** — setting `type="neural"`, `"keyword"`, or `"auto"`

## Quick Reference

### ExaSearchRetriever — semantic search for RAG

```python
from langchain_exa import ExaSearchRetriever

retriever = ExaSearchRetriever(
    k=5,                                    # number of results
    # exa_api_key="...",                    # or set EXA_API_KEY env var
    use_autoprompt=True,                    # Exa rewrites query for better results
    type="neural",                          # "neural" | "keyword" | "auto"
    highlights=True,                        # include relevant excerpts
    summary=True,                           # include LLM-generated page summary
    livecrawl="always",                     # "always" | "fallback" | "never"
)

docs = retriever.invoke("How does LangGraph handle state persistence?")
for doc in docs:
    print(doc.page_content[:300])
    print(doc.metadata)   # url, title, score, published_date, highlights, summary
```

### Filter by domain and date

```python
from langchain_exa import ExaSearchRetriever

retriever = ExaSearchRetriever(
    k=3,
    include_domains=["arxiv.org", "github.com"],   # only these domains
    # exclude_domains=["reddit.com"],              # block these domains
    start_published_date="2024-01-01",             # ISO date
    end_published_date="2026-01-01",
    # start_crawl_date="2025-01-01",               # filter by when Exa crawled
    use_autoprompt=True,
)

docs = retriever.invoke("LLM agent memory architectures")
```

### ExaSearchResults — search as an agent tool

```python
from langchain_exa import ExaSearchResults
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

search_tool = ExaSearchResults()

# Invoke directly
result = search_tool.invoke({
    "query": "latest LangChain releases 2026",
    "num_results": 3,
})
print(result)   # SearchResponse with Result objects

# Use in a ReAct agent
agent = create_react_agent(
    ChatOpenAI(model="gpt-4o-mini"),
    tools=[search_tool],
)
response = agent.invoke({"messages": [("human", "What happened in AI this week?")]})
```

### ExaFindSimilarResults — find similar URLs

```python
from langchain_exa import ExaFindSimilarResults

find_similar = ExaFindSimilarResults()

# Find pages similar to a given URL
result = find_similar.invoke({
    "url": "https://blog.langchain.dev/langgraph/",
    "num_results": 5,
})
print(result)   # Similar pages with title, url, score
```

### Use in a RAG chain

```python
from langchain_exa import ExaSearchRetriever
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough

retriever = ExaSearchRetriever(
    k=3,
    use_autoprompt=True,
    summary=True,    # get summaries instead of raw text for clean context
)
llm = ChatOpenAI(model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_template("""
Answer based on the following web search results:

{context}

Question: {question}
""")

def format_docs(docs):
    return "\n\n".join(
        f"**{doc.metadata.get('title', 'Untitled')}**\n{doc.page_content}"
        for doc in docs
    )

chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

answer = chain.invoke("What are the latest LangGraph features?")
print(answer)
```

### Combine ExaSearchResults with other tools

```python
from langchain_exa import ExaSearchResults, ExaFindSimilarResults
from langchain_community.tools import WikipediaQueryRun
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

tools = [
    ExaSearchResults(),
    ExaFindSimilarResults(),
    WikipediaQueryRun(),
]

agent = create_react_agent(ChatOpenAI(model="gpt-4o"), tools=tools)
```

## API Reference

### `ExaSearchRetriever` key parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `k` | `int` | `10` | Number of results to return |
| `type` | `str` | `"neural"` | Search type: `"neural"`, `"keyword"`, or `"auto"` |
| `use_autoprompt` | `bool` | `False` | Exa rewrites the query using its own LLM |
| `highlights` | `bool` | `False` | Return relevant text excerpts from each page |
| `summary` | `bool` | `False` | Return LLM-generated summary of each page |
| `livecrawl` | `str` | `"never"` | `"always"`, `"fallback"` (if not indexed), `"never"` |
| `include_domains` | `list[str]` | `None` | Only return results from these domains |
| `exclude_domains` | `list[str]` | `None` | Never return results from these domains |
| `start_published_date` | `str` | `None` | ISO date: only pages published after this |
| `end_published_date` | `str` | `None` | ISO date: only pages published before this |
| `start_crawl_date` | `str` | `None` | ISO date: only pages crawled after this |
| `end_crawl_date` | `str` | `None` | ISO date: only pages crawled before this |
| `exa_api_key` | `str` | `None` | API key (or `EXA_API_KEY` env) |

### Search result fields

Each result includes: `url`, `id`, `title`, `score`, `published_date`, `author`, `text`, `highlights`, `highlight_scores`, `summary`

### Exa vs other search tools

| Feature | Exa | Perplexity | SerpAPI |
|---------|-----|-----------|---------|
| Search type | Semantic + keyword | Web search | Google |
| `find_similar` | ✅ | ❌ | ❌ |
| Per-result summaries | ✅ | ❌ | ❌ |
| Highlights/excerpts | ✅ | ❌ | Limited |
| `livecrawl` | ✅ | Implicit | ❌ |
| Domain filtering | ✅ | ❌ | ❌ |
| Date filtering | ✅ | Limited | ❌ |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-exa`  
API key: `https://exa.ai`  
GitHub: `https://github.com/langchain-ai/langchain/tree/main/libs/partners/exa`
