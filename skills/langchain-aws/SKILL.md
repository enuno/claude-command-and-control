---
name: langchain-aws
description: LangChain AWS integration — ChatBedrockConverse (Claude/Nova/Llama/Mistral on Bedrock), BedrockEmbeddings, AmazonKnowledgeBasesRetriever, BedrockAgentsRunnable, BedrockRerank, BedrockPromptCachingMiddleware, CodeInterpreterToolkit, BrowserToolkit (computer use), Neptune graph chains, and SageMaker endpoint.
---

# LangChain AWS Skill

Expert assistance for `langchain-aws`: connect LangChain to AWS services — Bedrock chat models, embeddings, Knowledge Base RAG, Bedrock Agents, prompt caching, computer use tools (code interpreter + browser), Neptune graph, SageMaker, and Amazon Q.

**Install**: `pip install -U langchain-aws`  
**Setup**: Configure AWS credentials via `~/.aws/credentials`, env vars, or IAM role.

Reference: `references/api.md` (500 KB — full API reference).

## When to Use This Skill

Activate when:
- **Using Bedrock chat models** — `ChatBedrockConverse` with Claude, Nova, Llama, Mistral, or Titan
- **Generating embeddings on Bedrock** — `BedrockEmbeddings` (text or multimodal)
- **RAG from Bedrock Knowledge Base** — `AmazonKnowledgeBasesRetriever`
- **Running Bedrock Agents** — `BedrockAgentsRunnable` or `BedrockInlineAgentsRunnable`
- **Prompt caching on Bedrock** — `BedrockPromptCachingMiddleware`
- **Reranking documents** — `BedrockRerank` for improved RAG relevance
- **Computer use (code interpreter)** — `CodeInterpreterToolkit` / `create_code_interpreter_toolkit()`
- **Computer use (browser)** — `BrowserToolkit` / `create_browser_toolkit()`
- **Neptune graph Q&A** — `create_neptune_opencypher_qa_chain()` or SPARQL chain
- **SageMaker LLM endpoints** — `SagemakerEndpoint`
- **Amazon Q Business** — `AmazonQ` runnable
- **Bedrock document reranking** — `BedrockRerank`

## Quick Reference

### ChatBedrockConverse — Bedrock chat models

```python
from langchain_aws import ChatBedrockConverse

model = ChatBedrockConverse(
    model="anthropic.claude-3-5-sonnet-20241022-v2:0",
    temperature=0,
    max_tokens=None,
    region_name="us-east-1",              # AWS region
    # credentials_profile_name="default", # AWS profile (optional)
)

# Invoke
messages = [
    ("system", "You are a helpful assistant."),
    ("human", "Explain quantum entanglement."),
]
response = model.invoke(messages)
print(response.content)

# Stream
for chunk in model.stream(messages):
    print(chunk.content, end="", flush=True)
```

### Tool calling and structured output

```python
from langchain_aws import ChatBedrockConverse
from langchain_core.tools import tool
from pydantic import BaseModel

model = ChatBedrockConverse(model="anthropic.claude-3-haiku-20240307-v1:0")

@tool
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"Sunny, 22°C in {city}"

# Tool calling
model_with_tools = model.bind_tools([get_weather])
result = model_with_tools.invoke("What's the weather in Paris?")

# Structured output
class Review(BaseModel):
    rating: int
    summary: str

structured = model.with_structured_output(Review)
review = structured.invoke("Review the AWS re:Invent conference.")
```

### BedrockEmbeddings

```python
from langchain_aws import BedrockEmbeddings

# Text embeddings
embeddings = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v2:0",
    region_name="us-east-1",
)
vec = embeddings.embed_query("What is RAG?")
vecs = embeddings.embed_documents(["LangChain doc 1", "LangChain doc 2"])

# Multimodal embeddings (text + image)
embeddings = BedrockEmbeddings(
    model_id="amazon.nova-2-multimodal-embeddings-v1:0",
    dimensions=256,
    region_name="us-east-1",
)
```

### AmazonKnowledgeBasesRetriever — RAG from Bedrock KB

```python
from langchain_aws import AmazonKnowledgeBasesRetriever

retriever = AmazonKnowledgeBasesRetriever(
    knowledge_base_id="ABCDEF1234",      # Bedrock Knowledge Base ID
    retrieval_config={
        "vectorSearchConfiguration": {
            "numberOfResults": 5,
        }
    },
    region_name="us-east-1",
    # min_score_confidence=0.5,          # filter low-confidence results
)

docs = retriever.invoke("What is our return policy?")
for doc in docs:
    print(doc.page_content[:200])
    print(doc.metadata)   # source location, score, etc.
```

### BedrockRerank — improve RAG with cross-encoder reranking

```python
from langchain_aws import BedrockRerank
from langchain_aws import AmazonKnowledgeBasesRetriever

reranker = BedrockRerank(
    model_id="amazon.rerank-v1:0",
    region_name="us-east-1",
    top_n=3,                             # return top-3 after reranking
)

# Use as a ContextualCompressionRetriever
from langchain.retrievers import ContextualCompressionRetriever

retriever = AmazonKnowledgeBasesRetriever(knowledge_base_id="ABCDEF1234")
compression_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=retriever,
)
docs = compression_retriever.invoke("return policy for electronics")
```

### BedrockPromptCachingMiddleware

```python
from langchain_aws import ChatBedrockConverse
from langchain_aws.middleware.prompt_caching import BedrockPromptCachingMiddleware

model = ChatBedrockConverse(model="anthropic.claude-3-5-sonnet-20241022-v2:0")

# Wrap model with prompt caching
cached_model = BedrockPromptCachingMiddleware(model=model)

# First call: populates cache
response1 = cached_model.invoke([("human", "Explain the AWS Shared Responsibility Model.")])

# Second call: uses cache (faster + cheaper)
response2 = cached_model.invoke([("human", "Summarize the AWS Shared Responsibility Model.")])
```

### BedrockAgentsRunnable — run Bedrock Agents

```python
from langchain_aws.agents import BedrockAgentsRunnable

agent = BedrockAgentsRunnable(
    agent_id="AGENT_ID_HERE",
    agent_alias_id="AGENT_ALIAS_ID",
    region_name="us-east-1",
)

response = agent.invoke({"input": "What is my account balance?"})
print(response["output"])
```

### CodeInterpreterToolkit — Bedrock computer use (code)

```python
from langchain_aws.tools.code_interpreter_toolkit import create_code_interpreter_toolkit
from langchain_aws import ChatBedrockConverse
from langgraph.prebuilt import create_react_agent

# Create toolkit for Bedrock code interpreter
tools = create_code_interpreter_toolkit(
    sandbox_id="SANDBOX_ID",
    region_name="us-east-1",
)

model = ChatBedrockConverse(model="amazon.nova-pro-v1:0")
agent = create_react_agent(model, tools)
result = agent.invoke({"messages": [("human", "Plot a histogram of the dataset and save it as chart.png")]})
```

### BrowserToolkit — Bedrock computer use (web)

```python
from langchain_aws.tools.browser_toolkit import create_browser_toolkit
from langchain_aws import ChatBedrockConverse
from langgraph.prebuilt import create_react_agent

tools = create_browser_toolkit(
    session_id="SESSION_ID",
    region_name="us-east-1",
)

model = ChatBedrockConverse(model="amazon.nova-pro-v1:0")
agent = create_react_agent(model, tools)
result = agent.invoke({"messages": [("human", "Go to langchain.com and summarize the homepage.")]})
```

## Key Bedrock Model IDs

| Provider | Model ID | Notes |
|----------|----------|-------|
| Anthropic | `anthropic.claude-3-5-sonnet-20241022-v2:0` | Recommended Claude |
| Anthropic | `anthropic.claude-3-haiku-20240307-v1:0` | Fast/cheap Claude |
| Amazon | `amazon.nova-pro-v1:0` | Nova Pro (multimodal) |
| Amazon | `amazon.nova-lite-v1:0` | Nova Lite (fast) |
| Amazon | `amazon.nova-micro-v1:0` | Nova Micro (text only) |
| Meta | `meta.llama3-1-8b-instruct-v1:0` | Llama 3.1 8B |
| Mistral | `mistral.mistral-large-2402-v1:0` | Mistral Large |
| Embeddings | `amazon.titan-embed-text-v2:0` | Titan text embeddings |
| Embeddings | `amazon.nova-2-multimodal-embeddings-v1:0` | Nova multimodal |
| Reranking | `amazon.rerank-v1:0` | Bedrock reranker |

## AWS Authentication

```python
# Option 1: Default credentials (IAM role, env vars, ~/.aws/credentials)
model = ChatBedrockConverse(model="...", region_name="us-east-1")

# Option 2: Named profile
model = ChatBedrockConverse(
    model="...",
    credentials_profile_name="my-profile",
    region_name="us-east-1",
)

# Option 3: Explicit credentials
model = ChatBedrockConverse(
    model="...",
    aws_access_key_id="...",
    aws_secret_access_key="...",
    aws_session_token="...",    # optional
    region_name="us-east-1",
)
```

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-aws`  
GitHub: `https://github.com/langchain-ai/langchain-aws`  
Bedrock setup: `https://docs.aws.amazon.com/bedrock/latest/userguide/setting-up.html`
