# Langflow Repository File Structure

This document outlines the file organization of the Langflow repository and provides context for understanding the codebase architecture.

---

## Repository Overview

```
langflow/
├── src/                          # Main source code directory
│   ├── backend/                  # Python backend (FastAPI)
│   │   ├── langflow/             # Core Langflow package
│   │   │   ├── api/              # REST API endpoints
│   │   │   ├── components/       # Built-in component library
│   │   │   ├── custom/           # Custom component framework
│   │   │   ├── graph/            # Flow execution engine
│   │   │   ├── interface/        # Component interface definitions
│   │   │   ├── mcp/              # Model Context Protocol implementation
│   │   │   ├── services/         # Business logic services
│   │   │   ├── database/         # Database models and migrations
│   │   │   └── utils/            # Utility functions
│   │   └── tests/                # Backend test suite
│   └── frontend/                 # React/TypeScript frontend
│       ├── src/                  # Frontend source code
│       │   ├── components/       # React UI components
│       │   ├── pages/            # Page-level components
│       │   ├── stores/           # State management (Zustand)
│       │   ├── modals/           # Modal dialogs
│       │   ├── icons/            # Custom icons
│       │   └── utils/            # Frontend utilities
│       ├── public/               # Static assets
│       └── tests/                # Frontend test suite
├── docs/                         # Documentation source
├── docker/                       # Docker-related files
│   ├── Dockerfile                # Production image
│   ├── Dockerfile.dev            # Development image
│   └── docker-compose.yml        # Multi-container setup
├── scripts/                      # Build and deployment scripts
├── .github/                      # GitHub workflows (CI/CD)
├── requirements.txt              # Python dependencies
├── package.json                  # JavaScript dependencies
├── pyproject.toml                # Python project configuration
├── LICENSE                       # MIT License
└── README.md                     # Main documentation
```

---

## Core Directories

### `/src/backend/langflow/`

**Purpose**: Core Python package containing all backend logic.

**Key Subdirectories**:

#### `/api/`
REST API endpoint definitions using FastAPI:
- `v1/` - API version 1 endpoints
  - `flows.py` - Flow CRUD operations
  - `run.py` - Flow execution endpoints
  - `auth.py` - Authentication and API keys
  - `mcp.py` - MCP server endpoints
  - `files.py` - File upload/download

#### `/components/`
Built-in component library (200+ components):
- `agents/` - Agent components (OpenAI, Tool-calling)
- `chains/` - LangChain chain wrappers
- `embeddings/` - Embedding providers (OpenAI, Cohere, Hugging Face)
- `llms/` - Language model integrations (OpenAI, Anthropic, Google)
- `prompts/` - Prompt templates
- `tools/` - Agent tools (Calculator, Web Search, URL)
- `vectorstores/` - Vector database connectors (Pinecone, Weaviate, Chroma)
- `data/` - Data loaders and processors
- `mcp/` - MCP client/server components

**Component Structure Example**:
```python
# /components/llms/openai.py
from langflow.custom import Component
from langflow.io import MessageTextInput, FloatInput
from langflow.schema import Message

class OpenAIComponent(Component):
    display_name = "OpenAI"
    description = "OpenAI language models"

    inputs = [
        MessageTextInput(name="input_value"),
        FloatInput(name="temperature", default=0.7),
    ]

    outputs = [Output(name="output", method="generate")]

    def generate(self) -> Message:
        # Implementation
        pass
```

#### `/custom/`
Custom component framework:
- `custom_component.py` - Base Component class
- `component_schema.py` - Input/output type definitions
- `validators.py` - Component validation logic
- `utils.py` - Helper functions

**Used By**: Developers creating custom components

#### `/graph/`
Flow execution engine:
- `graph_builder.py` - Constructs execution graph from flow JSON
- `executor.py` - Executes flow nodes in dependency order
- `state_manager.py` - Manages component state and caching
- `vertex.py` - Individual component execution wrapper

**Execution Flow**:
```
Flow JSON → Graph Builder → Dependency Resolution → Execute Vertices → Return Outputs
```

#### `/mcp/`
Model Context Protocol implementation:
- `client.py` - MCP client for connecting to external servers
- `server.py` - MCP server exposing flows as tools
- `transports/`
  - `stdio.py` - Local process communication
  - `http.py` - HTTP/SSE transport
- `tools.py` - Tool discovery and execution

**Architecture**:
```
External App ←→ MCP Client ←→ MCP Server ←→ Langflow Flows
```

#### `/services/`
Business logic layer:
- `auth/` - Authentication and authorization
- `database/` - Database service layer
- `flow/` - Flow management
- `cache/` - Caching service
- `settings/` - Configuration management

#### `/database/`
Database models and migrations:
- `models/` - SQLAlchemy ORM models
  - `flow.py` - Flow model
  - `user.py` - User model
  - `api_key.py` - API key model
  - `message.py` - Chat message model
- `migrations/` - Alembic database migrations

**Database Schema**:
```sql
-- Key tables
flows (id, user_id, name, data, created_at, updated_at)
users (id, username, password_hash, is_superuser)
api_keys (id, user_id, key_hash, name, created_at)
messages (id, session_id, text, sender, timestamp)
```

### `/src/frontend/`

**Purpose**: React-based visual editor and UI.

**Key Subdirectories**:

#### `/src/components/`
React UI components:
- `canvas/` - Flow editor canvas
  - `Canvas.tsx` - Main canvas component
  - `Node.tsx` - Component node renderer
  - `Edge.tsx` - Connection edge renderer
  - `MiniMap.tsx` - Canvas minimap
- `chatWidget/` - Playground chat interface
- `sidebarComponent/` - Component library sidebar
- `nodeToolbar/` - Component configuration toolbar

**Technology**:
- React 18
- React Flow (canvas library)
- Tailwind CSS (styling)
- Lucide React (icons)

#### `/src/stores/`
State management using Zustand:
- `flowStore.ts` - Flow state (nodes, edges, canvas position)
- `authStore.ts` - Authentication state
- `apiKeysStore.ts` - API key management
- `messagesStore.ts` - Chat messages

**Example Store**:
```typescript
// flowStore.ts
interface FlowState {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  deleteNode: (id: string) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),
  // ...
}));
```

#### `/src/pages/`
Top-level page components:
- `FlowPage/` - Main flow editor
- `LoginPage/` - Authentication
- `SettingsPage/` - User settings and API keys

---

## Configuration Files

### `pyproject.toml`
Python project configuration:
```toml
[project]
name = "langflow"
version = "1.7.1"
requires-python = ">=3.10,<3.14"

[project.dependencies]
langchain = "^0.1.0"
fastapi = "^0.109.0"
uvicorn = "^0.27.0"
sqlalchemy = "^2.0.0"
# ... 50+ dependencies
```

### `package.json`
JavaScript project configuration:
```json
{
  "name": "langflow-frontend",
  "version": "1.7.1",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-flow-renderer": "^11.10.0",
    "zustand": "^4.5.0"
  }
}
```

### `docker/Dockerfile`
Multi-stage production build:
```dockerfile
# Stage 1: Build frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY src/frontend/package.json .
RUN npm install
COPY src/frontend/ .
RUN npm run build

# Stage 2: Build backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/backend/ .
COPY --from=frontend-builder /app/frontend/dist ./static

EXPOSE 7860
CMD ["langflow", "run", "--host", "0.0.0.0"]
```

---

## Test Structure

### Backend Tests (`/src/backend/tests/`)
```
tests/
├── unit/                         # Unit tests (fast, isolated)
│   ├── test_components.py        # Component functionality
│   ├── test_graph.py             # Graph building/execution
│   ├── test_mcp.py               # MCP client/server
│   └── test_utils.py             # Utility functions
├── integration/                  # Integration tests (slower, DB required)
│   ├── test_api.py               # API endpoints
│   ├── test_flow_execution.py   # End-to-end flow runs
│   └── test_auth.py              # Authentication flows
└── fixtures/                     # Test data
    ├── sample_flows.json         # Example flow definitions
    └── mock_components.py        # Test components
```

**Run Tests**:
```bash
# All tests
pytest src/backend/tests/

# Unit tests only
pytest src/backend/tests/unit/

# Specific test file
pytest src/backend/tests/unit/test_components.py

# With coverage
pytest --cov=langflow src/backend/tests/
```

### Frontend Tests (`/src/frontend/tests/`)
```
tests/
├── components/                   # Component tests
│   ├── Canvas.test.tsx
│   ├── Node.test.tsx
│   └── ChatWidget.test.tsx
└── stores/                       # State management tests
    ├── flowStore.test.ts
    └── authStore.test.ts
```

**Run Tests**:
```bash
cd src/frontend
npm test                          # Run all tests
npm run test:coverage             # With coverage
```

---

## Build Artifacts

### Development Build
```
langflow-dev/
├── .langflow/                    # User config directory
│   ├── langflow.db               # SQLite database (dev only)
│   ├── logs/                     # Application logs
│   └── flows/                    # Exported flow JSONs
└── node_modules/                 # Frontend dependencies
```

### Production Build
```
dist/
├── langflow/                     # Python package
│   ├── __init__.py
│   ├── api/
│   ├── components/
│   └── ...
├── static/                       # Built frontend assets
│   ├── index.html
│   ├── assets/
│   │   ├── index-abc123.js       # Hashed JS bundles
│   │   └── index-def456.css      # Hashed CSS bundles
│   └── favicon.ico
└── langflow-1.7.1-py3-none-any.whl  # Wheel package
```

---

## Important Files

### `/src/backend/langflow/__init__.py`
Package initialization, exports main classes:
```python
from langflow.custom import Component
from langflow.schema import Message, Data
from langflow.graph import Graph

__version__ = "1.7.1"
```

### `/src/backend/langflow/main.py`
FastAPI application entry point:
```python
from fastapi import FastAPI
from langflow.api import router

app = FastAPI(title="Langflow")
app.include_router(router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
```

### `/src/frontend/src/App.tsx`
React application root:
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlowPage from "./pages/FlowPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/flow/:id" element={<FlowPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Development Workflow

### Local Development Setup
```bash
# Clone repository
git clone https://github.com/langflow-ai/langflow.git
cd langflow

# Backend setup
cd src/backend
uv venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
uv pip install -e ".[dev]"  # Editable install with dev dependencies

# Frontend setup
cd ../frontend
npm install

# Run backend (terminal 1)
cd src/backend
uv run langflow run --reload  # Auto-reload on changes

# Run frontend (terminal 2)
cd src/frontend
npm run dev  # Vite dev server with HMR
```

### Build Process
```bash
# Frontend production build
cd src/frontend
npm run build
# Output: dist/ directory

# Backend package build
cd src/backend
python -m build
# Output: dist/langflow-1.7.1-py3-none-any.whl

# Docker image build
docker build -f docker/Dockerfile -t langflowai/langflow:latest .
```

---

## Environment Variables

### Backend (`/src/backend/langflow/.env`)
```bash
# Database
LANGFLOW_DATABASE_URL=postgresql://user:pass@localhost:5432/langflow

# Security
LANGFLOW_SECRET_KEY=your-secret-key-here
LANGFLOW_AUTO_LOGIN=False

# CORS
LANGFLOW_CORS_ORIGINS=https://yourdomain.com

# Logging
LANGFLOW_LOG_LEVEL=INFO
LANGFLOW_LOG_FILE=/var/log/langflow/app.log

# Observability
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls-...

# MCP
LANGFLOW_MCP_ENABLED=true
```

### Frontend (`/src/frontend/.env`)
```bash
VITE_API_URL=http://localhost:7860/api/v1
VITE_ENABLE_ANALYTICS=false
```

---

## CI/CD Workflows

### `/.github/workflows/test.yml`
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -e ".[dev]"
      - run: pytest src/backend/tests/

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: cd src/frontend && npm ci
      - run: cd src/frontend && npm test
```

### `/.github/workflows/release.yml`
Automated release workflow:
1. Run full test suite
2. Build Python package
3. Build frontend assets
4. Build Docker image
5. Publish to PyPI
6. Push Docker image to registry
7. Create GitHub release

---

## Database Migrations

### `/src/backend/langflow/database/migrations/`
Alembic migration scripts:
```
migrations/
├── alembic.ini               # Alembic configuration
├── env.py                    # Migration environment
└── versions/                 # Migration history
    ├── 001_initial_schema.py
    ├── 002_add_api_keys.py
    ├── 003_add_mcp_support.py
    └── 004_add_chat_memory.py
```

**Apply Migrations**:
```bash
# Upgrade to latest
alembic upgrade head

# Downgrade one version
alembic downgrade -1

# View migration history
alembic history

# Create new migration
alembic revision --autogenerate -m "Add new table"
```

---

## Custom Components Development

### Custom Component Location
```
~/.langflow/components/         # User-specific components
├── my_weather_component.py
├── my_database_tool.py
└── my_agent.py
```

### Component Template
```python
# ~/.langflow/components/my_component.py
from langflow.custom import Component
from langflow.io import MessageTextInput, Output
from langflow.schema import Message

class MyComponent(Component):
    display_name = "My Component"
    description = "Does something useful"
    icon = "🔧"  # Optional emoji icon

    inputs = [
        MessageTextInput(
            name="input_text",
            display_name="Input Text",
            info="The text to process"
        )
    ]

    outputs = [
        Output(
            display_name="Result",
            name="result",
            method="process"
        )
    ]

    def process(self) -> Message:
        text = self.input_text
        # Your logic here
        result = text.upper()
        return Message(text=result)
```

**After Creating**:
1. Restart Langflow: `uv run langflow run`
2. Component appears in **Custom** section of component library
3. Drag onto canvas and use like built-in components

---

## Documentation Generation

### `/docs/` Directory
Documentation source files (Markdown):
```
docs/
├── get-started/
│   ├── installation.md
│   ├── quickstart.md
│   └── concepts.md
├── components/
│   ├── llms.md
│   ├── agents.md
│   └── tools.md
├── deployment/
│   ├── docker.md
│   ├── kubernetes.md
│   └── cloud.md
└── api/
    └── rest-api.md
```

**Build Documentation Site**:
```bash
# Install dependencies
pip install mkdocs mkdocs-material

# Serve locally
mkdocs serve
# Access at http://localhost:8000

# Build static site
mkdocs build
# Output: site/ directory
```

---

## Conclusion

Understanding Langflow's file structure enables:
- **Component Development**: Create custom components in proper locations
- **Debugging**: Navigate codebase to find relevant code
- **Contribution**: Know where to add features or fix bugs
- **Deployment**: Understand build artifacts and configuration
- **Integration**: Extend Langflow with plugins and tools

For questions or contributions, refer to the [Contributing Guide](https://github.com/langflow-ai/langflow/blob/main/CONTRIBUTING.md).

---

**Last Updated**: December 30, 2025
**Langflow Version**: 1.7.1
**Documentation Version**: 1.0
