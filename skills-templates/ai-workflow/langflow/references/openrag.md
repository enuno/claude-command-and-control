# OpenRAG - Production RAG Platform Reference

**Repository**: https://github.com/langflow-ai/openrag
**Documentation**: https://docs.openr.ag/
**Homepage**: https://www.openr.ag
**Version**: v0.2.0 (December 2025)
**License**: Apache License 2.0
**Stars**: 23

---

## Overview

OpenRAG is a comprehensive, single-package Retrieval-Augmented Generation platform built on Langflow, Docling, and OpenSearch. It provides a complete solution for building production-ready document Q&A systems with integrated document processing, semantic search, and conversational AI capabilities.

### Core Technology Stack

**Frontend**:
- Framework: Next.js 15+
- Language: TypeScript
- UI Components: React 18+
- Styling: Tailwind CSS

**Backend**:
- Framework: Starlette (ASGI)
- Language: Python 3.10+
- Package Manager: uv

**AI & Search**:
- Workflow Engine: Langflow
- Document Processing: Docling
- Vector Database: OpenSearch
- Observability: Langfuse (optional)

**Language Distribution**:
- Python: 64.4%
- TypeScript: 33.6%
- Makefile: 0.8%
- CSS: 0.5%
- Shell: 0.4%
- Dockerfile: 0.3%
- JavaScript: <0.1%

---

## Key Features

### Document Management
- **Multi-Format Support**: PDF, TXT, DOCX, Markdown, HTML
- **Advanced Extraction**: Docling-powered processing for complex layouts, tables, and images
- **Cloud Integration**: OneDrive and SharePoint support (v0.2.0+)
- **Batch Processing**: Upload and process multiple documents simultaneously
- **Configurable Timeouts**: Adjust ingestion timeout limits per document type
- **Version Control**: Track document versions and updates

### Intelligent Search
- **Semantic Search**: Vector similarity search with OpenSearch
- **Hybrid Search**: Combines full-text and vector search for optimal results
- **Context Retrieval**: Retrieves relevant document chunks for grounded responses
- **Reranking**: Optional reranking of search results for improved relevance
- **Metadata Filtering**: Filter by document metadata (date, source, type)

### Conversational AI
- **Multi-LLM Support**: OpenAI, Anthropic, Ollama, IBM Granite, Mistral, and more
- **Tool Calling**: Agent workflows with tool selection and execution
- **Session Management**: Persistent conversation history and context
- **Streaming Responses**: Real-time response streaming for better UX
- **Citation Tracking**: Source attribution for all generated answers
- **Prompt Templates**: Customizable prompt templates for different use cases

### Enterprise Features
- **Langfuse Integration**: Comprehensive observability and monitoring
- **Authentication**: Configurable user authentication and access control
- **API Access**: RESTful API and Python SDK for programmatic integration
- **Terminal UI (TUI)**: Command-line interface for system management
- **Container Management**: Automatic Docker/Podman container orchestration
- **Configuration Management**: Centralized configuration at `~/.openrag/`

---

## Installation Methods

### 1. Quick Start (uvx - No Installation)
```bash
# Run latest version
uvx openrag

# Run specific version
uvx --from openrag==0.2.0 openrag
```

**Pros**:
- No local installation required
- Isolated execution environment
- Always run specific versions
- Easy testing and evaluation

**Cons**:
- Downloads package each time (unless cached)
- Cannot customize installation

### 2. Python Package Installation
```bash
# Create project with uv
uv init my-openrag-project
cd my-openrag-project

# Add OpenRAG to project
uv add openrag

# Run OpenRAG
uv run openrag
```

**Pros**:
- Integrated with existing Python projects
- Customizable configuration
- Development-friendly
- Version pinning in project

**Cons**:
- Requires Python 3.10+
- Need to manage virtual environment

### 3. Docker/Podman Deployment

**Managed Containers (Recommended)**:
```bash
# OpenRAG manages containers automatically
uv run openrag
# Containers are started and managed via TUI
```

**Self-Managed Containers**:
```yaml
# docker-compose.yml
version: '3.8'
services:
  opensearch:
    image: opensearchproject/opensearch:latest
    environment:
      - discovery.type=single-node
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=YourSecurePassword123!
    ports:
      - "9200:9200"

  langflow:
    image: langflowai/langflow:latest
    ports:
      - "7860:7860"

  openrag:
    image: openrag:latest
    environment:
      - OPENSEARCH_URL=http://opensearch:9200
      - LANGFLOW_URL=http://langflow:7860
    ports:
      - "3000:3000"
```

**Pros**:
- Production-ready
- Isolated environments
- Easy scaling
- Container orchestration

**Cons**:
- Requires Docker/Podman
- More complex setup for self-managed

---

## Architecture

### System Architecture
```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js)                 │
│   - Document Upload UI                       │
│   - Chat Interface                           │
│   - Configuration Dashboard                  │
└──────────────┬──────────────────────────────┘
               │ REST API
               ▼
┌─────────────────────────────────────────────┐
│         Backend (Starlette)                  │
│   - API Endpoints                            │
│   - Session Management                       │
│   - Authentication                           │
└──────┬───────────┬──────────────────────────┘
       │           │
       ▼           ▼
┌─────────────┐ ┌──────────────────────────┐
│  Langflow   │ │      OpenSearch          │
│  Workflows  │ │  - Vector Embeddings     │
│  - Ingest   │ │  - Full-Text Search      │
│  - Retrieve │ │  - Metadata Storage      │
│  - Chat     │ │  - Hybrid Search         │
└──────┬──────┘ └──────────────────────────┘
       │
       ▼
┌─────────────────┐
│    Docling      │
│  - PDF Extract  │
│  - Layout Parse │
│  - Table Extract│
└─────────────────┘
```

### Data Flow

**Document Ingestion**:
1. User uploads document via frontend
2. Backend receives file and metadata
3. Docling processes document (extract text, tables, layout)
4. Langflow workflow chunks and embeds text
5. OpenSearch stores embeddings and metadata
6. User receives success confirmation

**Query & Response**:
1. User asks question via chat interface
2. Backend processes query through Langflow
3. Query is embedded using same model
4. OpenSearch performs hybrid search (vector + full-text)
5. Top-K relevant chunks retrieved
6. LLM generates response with retrieved context
7. Response streamed back to frontend with citations

### Storage Structure

**Configuration Directory**: `~/.openrag/`
```
~/.openrag/
├── config/
│   ├── .env                 # Environment variables
│   ├── langflow.json        # Langflow configuration
│   └── opensearch.json      # OpenSearch settings
├── uploads/                 # Uploaded documents
│   ├── processed/           # Successfully processed
│   ├── failed/              # Failed processing
│   └── pending/             # Awaiting processing
├── indexes/                 # OpenSearch indexes
│   ├── documents/           # Document metadata
│   └── embeddings/          # Vector embeddings
└── logs/                    # Application logs
    ├── ingestion.log        # Document processing logs
    ├── api.log              # API request logs
    └── search.log           # Search query logs
```

---

## Configuration

### Environment Variables

**LLM Provider Configuration**:
```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20250930

# Ollama (Local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# IBM Granite
WATSONX_API_KEY=...
WATSONX_PROJECT_ID=...
GRANITE_MODEL=ibm/granite-3.3-8b-instruct
```

**OpenSearch Configuration**:
```bash
OPENSEARCH_URL=https://localhost:9200
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=YourSecurePassword123!
OPENSEARCH_INDEX_NAME=openrag_documents
```

**Langfuse (Optional Observability)**:
```bash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

**Application Settings**:
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Backend
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000

# Document Processing
DOCLING_TIMEOUT=300  # seconds
MAX_UPLOAD_SIZE=50   # MB
CHUNK_SIZE=512       # tokens
CHUNK_OVERLAP=64     # tokens
```

---

## API Reference

### Chat Endpoint
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "What are the key findings in the research paper?",
  "session_id": "abc123",
  "stream": true
}

Response (SSE Stream):
data: {"type": "token", "content": "The key"}
data: {"type": "token", "content": " findings"}
data: {"type": "source", "content": "doc1.pdf, page 5"}
data: {"type": "done"}
```

### Document Upload Endpoint
```bash
POST /api/documents/upload
Content-Type: multipart/form-data

file: [binary file data]
metadata: {"title": "Research Paper", "tags": ["AI", "ML"]}

Response:
{
  "document_id": "doc-123",
  "status": "processing",
  "estimated_time": 30
}
```

### Document Status Endpoint
```bash
GET /api/documents/{document_id}/status

Response:
{
  "document_id": "doc-123",
  "status": "completed",
  "chunks": 42,
  "embeddings": 42,
  "errors": []
}
```

### Search Endpoint
```bash
POST /api/search
Content-Type: application/json

{
  "query": "machine learning techniques",
  "top_k": 5,
  "filters": {"tags": ["AI"]}
}

Response:
{
  "results": [
    {
      "chunk_id": "chunk-456",
      "document_id": "doc-123",
      "text": "Machine learning techniques include...",
      "score": 0.92,
      "metadata": {"page": 5, "title": "Research Paper"}
    }
  ],
  "total": 5
}
```

---

## Python SDK

```python
from openrag import OpenRAGClient

# Initialize client
client = OpenRAGClient(
    api_url="http://localhost:8000",
    api_key="your-api-key"
)

# Upload document
doc = client.upload_document(
    file_path="research.pdf",
    metadata={"title": "ML Research", "tags": ["AI"]}
)
print(f"Uploaded: {doc.id}")

# Wait for processing
doc.wait_for_completion()

# Query documents
response = client.chat(
    message="What are the main conclusions?",
    session_id="my-session"
)
print(response.content)

# Stream responses
for chunk in client.chat_stream(
    message="Explain the methodology",
    session_id="my-session"
):
    print(chunk.content, end="", flush=True)

# Search documents
results = client.search(
    query="neural networks",
    top_k=10,
    filters={"tags": ["AI"]}
)
for result in results:
    print(f"{result.score}: {result.text[:100]}...")

# List documents
docs = client.list_documents(tags=["AI"])
for doc in docs:
    print(f"{doc.id}: {doc.title} ({doc.status})")

# Delete document
client.delete_document("doc-123")
```

---

## Recent Updates

### v0.2.0 (December 23, 2025)
**Major Features**:
- OneDrive and SharePoint integration with redirect handling
- SDK improvements for chat endpoints
- Langfuse observability integration
- Image pruning options in TUI
- Better password validation for OpenSearch
- Centralized storage location (`~/.openrag`)

**Bug Fixes**:
- Follow redirects for OneDrive + SharePoint
- SDK chat endpoint fixes
- Indentation corrections

### v0.1.55 (December 19, 2025)
**Features**:
- Langfuse observability support
- Full OS queries for agent
- SDKs for programmatic access
- Image pruning in TUI
- Factory reset improvements

**Improvements**:
- Better OpenSearch password validation
- Auto-refresh for welcome screen
- Legacy config directory cleanup
- Documentation updates

### v0.1.54 (December 17, 2025)
**Features**:
- Centralized storage location for OpenRAG
- Multiple model provider support

**Improvements**:
- Model provider key examples
- Better error messages
- TUI detection improvements
- Documentation restructuring

---

## Troubleshooting

### Container Startup Issues

**Problem**: OpenSearch container fails to start
```bash
# Check Docker/Podman status
docker ps -a

# View OpenSearch logs
docker logs openrag-opensearch

# Common fix: Password requirements
# OpenSearch requires password with:
# - Minimum 8 characters
# - At least one uppercase letter
# - At least one lowercase letter
# - At least one digit
# - At least one special character
```

**Problem**: Port conflicts
```bash
# Check port usage
lsof -i :9200  # OpenSearch
lsof -i :7860  # Langflow
lsof -i :3000  # Frontend

# Solution: Stop conflicting services or change ports in .env
```

### Document Ingestion Failures

**Problem**: PDF extraction errors
```bash
# Check Docling service
curl http://localhost:7860/health

# Increase timeout for large documents
export DOCLING_TIMEOUT=600  # 10 minutes

# Check file format support
# Supported: PDF, TXT, DOCX, Markdown, HTML
# Not supported: Images without OCR, encrypted PDFs
```

**Problem**: Timeout during ingestion
```bash
# Adjust timeout in configuration
# File: ~/.openrag/config/.env
DOCLING_TIMEOUT=600
MAX_UPLOAD_SIZE=100

# Or per-request (API)
POST /api/documents/upload
{
  "timeout": 600  # seconds
}
```

### Search Not Working

**Problem**: No search results returned
```bash
# Verify OpenSearch index
curl -u admin:password http://localhost:9200/_cat/indices

# Check embeddings
curl -u admin:password http://localhost:9200/openrag_documents/_count

# Rebuild index if empty
POST /api/admin/reindex
```

**Problem**: Poor search quality
```bash
# Adjust chunk size for better context
CHUNK_SIZE=1024  # Larger chunks, more context
CHUNK_OVERLAP=128  # More overlap, less info loss

# Try hybrid search (combines vector + full-text)
POST /api/search
{
  "query": "...",
  "search_type": "hybrid",
  "hybrid_weights": {"vector": 0.7, "text": 0.3}
}
```

### LLM Integration Issues

**Problem**: API key errors
```bash
# Verify API keys
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# Test API access
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check model availability
POST /api/admin/models/test
{
  "provider": "openai",
  "model": "gpt-4-turbo-preview"
}
```

**Problem**: Slow responses
```bash
# Enable streaming
POST /api/chat
{
  "message": "...",
  "stream": true  # Stream responses for faster perceived performance
}

# Use faster model
OPENAI_MODEL=gpt-3.5-turbo  # Instead of gpt-4

# Enable caching
POST /api/chat
{
  "message": "...",
  "use_cache": true  # Cache LLM responses
}
```

---

## Best Practices

### Document Preparation
1. **Clean Documents**: Remove unnecessary headers, footers, and formatting
2. **Consistent Naming**: Use descriptive, consistent file names
3. **Metadata Tagging**: Add relevant tags and categories
4. **Size Optimization**: Split very large documents (>50MB) into smaller chunks
5. **Format Selection**: Use PDF or DOCX for best extraction quality

### Search Optimization
1. **Chunk Size**: Adjust based on document type (512 for articles, 1024 for books)
2. **Hybrid Search**: Use for complex queries requiring both semantic and keyword matching
3. **Reranking**: Enable for critical applications requiring highest precision
4. **Metadata Filtering**: Pre-filter by date, source, or category to improve relevance

### Production Deployment
1. **Resource Allocation**:
   - OpenSearch: 4GB+ RAM, 2+ CPU cores
   - Langflow: 2GB+ RAM, 1+ CPU core
   - Backend: 2GB+ RAM, 1+ CPU core
   - Frontend: 1GB+ RAM, 1+ CPU core

2. **Security**:
   - Enable HTTPS for all endpoints
   - Use strong OpenSearch passwords
   - Implement rate limiting on API endpoints
   - Regular security updates for all containers

3. **Monitoring**:
   - Enable Langfuse for observability
   - Monitor OpenSearch cluster health
   - Track ingestion success/failure rates
   - Set up alerts for container failures

4. **Backup**:
   - Regular OpenSearch snapshots
   - Backup `~/.openrag/config/` directory
   - Version control for Langflow workflows
   - Document upload backups

---

## Community & Support

### Official Resources
- **Documentation**: https://docs.openr.ag/
- **GitHub Repository**: https://github.com/langflow-ai/openrag
- **Issue Tracker**: https://github.com/langflow-ai/openrag/issues
- **Discussions**: https://github.com/langflow-ai/openrag/discussions

### Getting Help
1. **Troubleshooting Guide**: https://docs.openr.ag/support/troubleshoot
2. **GitHub Issues**: Report bugs and request features
3. **Community Forum**: Ask questions and share experiences
4. **Documentation**: Comprehensive guides and API references

### Contributing
- **Contributing Guide**: See CONTRIBUTING.md in repository
- **Code of Conduct**: See CODE_OF_CONDUCT.md
- **Security Policy**: See SECURITY.md for reporting vulnerabilities

---

**Last Updated**: December 30, 2025
**Version**: v0.2.0
**Maintainers**: Langflow AI Team
**License**: Apache License 2.0
