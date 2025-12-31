# Langflow - Visual AI Workflow Platform

⭐ **142,000 GitHub Stars** | 🍴 **8,200 Forks** | 📦 **Used by 1,500+ Projects** | 📜 **MIT License**

## Overview

**Langflow** is a powerful, open-source Python platform that revolutionizes AI application development through visual workflow design. Built on LangChain, it enables developers to create sophisticated AI agents, multi-agent systems, and LLM-powered applications using an intuitive drag-and-drop interface—without sacrificing the power and flexibility of Python customization.

### Why Langflow?

- **Visual-First Development**: Build complex AI workflows 10x faster with drag-and-drop components
- **MCP Native**: First-class Model Context Protocol support as both client and server
- **Production-Ready**: Enterprise-grade security, observability, and deployment options
- **Massive Community**: 331 contributors, active Discord community, extensive documentation
- **Fully Customizable**: Drop down to Python whenever you need custom logic

---

## Key Features

### 🎨 Visual Development Environment

#### Interactive Canvas
The **Workspace** provides a comprehensive visual editor with:
- Infinite canvas with pan/zoom/search capabilities
- Color-coded ports indicating data types (message, tool, embeddings, etc.)
- Real-time validation of component connections
- Undo/redo support for iterative development
- Component grouping for creating reusable patterns

#### Component Library (200+ Built-in Components)
- **LLM Providers**: OpenAI, Anthropic, Cohere, Google, Hugging Face, and more
- **Data Sources**: Vector stores, databases, file loaders, web scrapers
- **Agents**: OpenAI Assistant, Tool-calling agents, Custom agents
- **Tools**: Calculator, Web Search, URL fetcher, File operations, Custom Python tools
- **MCP Servers**: Built-in MCP client/server components for tool integration
- **Processing**: Text splitters, parsers, transformers, embeddings
- **Memory**: Chat memory, conversation buffers, entity memory

#### Playground Testing Interface
- **Real-Time Interaction**: Test flows immediately with chat interface
- **Agent Visibility**: See which tools agents select and why
- **Memory Inspection**: View and modify LLM conversation history
- **Granular Control**: Test individual components or entire workflows
- **Debug Information**: Inspect inputs, outputs, and intermediate states

### 🤖 AI Agents & Multi-Agent Systems

#### Agent Capabilities
```python
Agent Components Include:
├── OpenAI Assistant (with code interpreter, file search)
├── Tool-Calling Agent (autonomous tool selection)
├── Custom Agent (full Python control)
└── Zero-Shot React Agent (reasoning + action loops)
```

**Built-in Features**:
- **Chat Memory**: Session-based conversation context (enabled by default)
- **Tool Integration**: Automatic tool discovery and execution
- **Custom Instructions**: System prompts for specialized behavior
- **Multi-Model Support**: Switch between LLM providers seamlessly

#### Multi-Agent Coordination
Langflow excels at orchestrating multiple agents:

**Example Workflow**:
```
User Query → Router Agent (determines intent)
              ↓
         [Research Agent] ← Web Search + URL Tools
              ↓
         [Analysis Agent] ← Calculator + Data Tools
              ↓
         [Summary Agent] → Final Response
```

### 🔌 Model Context Protocol (MCP) Integration

#### MCP Client Mode
Connect to external MCP servers to extend agent capabilities:

**Configuration Options**:
1. **STDIO Mode** (Local Servers):
   - Command: Path to server executable
   - Arguments: Server startup args
   - Example: `node /path/to/mcp-server/index.js --port 3000`

2. **HTTP/SSE Mode** (Remote Servers):
   - URL: Server endpoint
   - Headers: Authentication tokens
   - Example: `https://api.example.com/mcp`

3. **JSON Configuration**:
   ```json
   {
     "mcpServers": {
       "fetch": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-fetch"]
       }
     }
   }
   ```

**Environment Variables**:
Use `.env` files to manage server credentials and configuration.

**Tool Caching**:
Enable caching for performance optimization with frequently-used MCP tools.

#### MCP Server Mode
Expose Langflow flows as MCP tools:

```bash
# Deploy flow as MCP server
langflow run --mcp-server --flow-id abc123

# Other applications can now discover and use your flow as a tool
```

**Use Cases**:
- Expose complex workflows to Claude Desktop
- Share AI capabilities across development team
- Build tool ecosystems with standardized interfaces

---

## Installation & Setup

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Python** | 3.10-3.13 (macOS/Linux)<br>3.10-3.12 (Windows) | Latest stable |
| **CPU** | Dual-core | Multi-core |
| **RAM** | 2GB | 4GB+ |
| **Disk** | 500MB | 2GB+ |
| **Browser** | Any modern browser | Chrome (for best compatibility) |

### Installation Methods

#### 1. Python Package (Recommended for Developers)

```bash
# Install uv package manager
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment
uv venv langflow-env

# Activate environment
# macOS/Linux:
source langflow-env/bin/activate
# Windows PowerShell:
langflow-env\Scripts\activate
# Windows CMD:
langflow-env\Scripts\activate.bat

# Install Langflow
uv pip install langflow

# Launch application
uv run langflow run

# Access at http://127.0.0.1:7860
```

**Optional: Install with all integrations**:
```bash
uv pip install langflow[all]  # Includes all optional dependencies
```

#### 2. Docker (Recommended for Production)

**Basic Deployment**:
```bash
# Pull latest image
docker pull langflowai/langflow:latest

# Run container
docker run -d \
  --name langflow \
  -p 7860:7860 \
  -v langflow-data:/app/data \
  langflowai/langflow:latest

# Access at http://localhost:7860
```

**Production Deployment with Environment Variables**:
```bash
docker run -d \
  --name langflow \
  -p 7860:7860 \
  -e LANGFLOW_AUTO_LOGIN=False \
  -e LANGFLOW_SECRET_KEY=$(python3 -c "from secrets import token_urlsafe; print(token_urlsafe(32))") \
  -e LANGFLOW_CORS_ORIGINS=https://yourdomain.com \
  -v langflow-data:/app/data \
  langflowai/langflow:latest
```

#### 3. Langflow Desktop (Recommended for Non-Technical Users)

**Download**:
- macOS: https://www.langflow.org/desktop (macOS 13+)
- Windows: https://www.langflow.org/desktop

**Features**:
- Standalone application with built-in dependencies
- No Python installation required
- Automatic updates

**Limitations**:
- No Shareable Playground feature
- No Voice Mode
- Desktop-only (no server deployment)

#### 4. Kubernetes (Enterprise Production)

**Deployment Example**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langflow
  namespace: ai-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: langflow
  template:
    metadata:
      labels:
        app: langflow
    spec:
      containers:
      - name: langflow
        image: langflowai/langflow:1.7.1
        ports:
        - containerPort: 7860
        env:
        - name: LANGFLOW_AUTO_LOGIN
          value: "false"
        - name: LANGFLOW_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: langflow-secrets
              key: secret-key
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: data
          mountPath: /app/data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: langflow-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: langflow-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 7860
  selector:
    app: langflow
```

---

## Quick Start Guide

### Creating Your First Flow

#### Step 1: Access Langflow
After installation, navigate to `http://127.0.0.1:7860` (or your deployment URL).

#### Step 2: Start from Template
1. Click **New Flow** in the top navigation
2. Select **Simple Agent** template from the gallery
3. Flow opens with pre-configured components:
   - **Chat Input** component
   - **Agent** component (with OpenAI model)
   - **Calculator** tool
   - **URL** tool
   - **Chat Output** component

#### Step 3: Configure API Keys
1. Click the **Agent** component
2. In the sidebar, find **OpenAI API Key** field
3. Enter your API key: `sk-...`
   - Get free tier key: https://platform.openai.com/api-keys
4. Click **Save**

#### Step 4: Test in Playground
1. Click **Playground** button (chat icon) in top-right
2. Enter a test query:
   ```
   What is 25 * 48? Also, fetch the content from https://example.com
   ```
3. Watch the agent:
   - Select Calculator tool for math (25 * 48 = 1200)
   - Select URL tool for web content
   - Combine results in final response
4. View tool execution details in the interface

#### Step 5: Customize and Iterate
**Add More Tools**:
1. Search components panel for "Web Search"
2. Drag **Web Search** component onto canvas
3. Enable **Tool Mode** toggle in component settings
4. Connect to Agent's **Tools** input port

**Add System Instructions**:
1. Click Agent component
2. Find **System Message** field
3. Add instructions:
   ```
   You are a helpful research assistant. Always cite your sources
   when using web search or URL tools. Be concise and accurate.
   ```

**Save and Deploy**:
1. Click **Save** in top toolbar
2. Name your flow: `Research Assistant`
3. Export as JSON: **File → Export → JSON**
4. Deploy via API: Use REST endpoint to run flow externally

---

## Core Concepts

### Components

Components are the fundamental building blocks of Langflow applications. Each component:
- Represents a specific function or integration
- Has input/output ports (color-coded by data type)
- Contains configurable parameters
- Executes Python code under the hood

**Port Color Guide**:
| Color | Data Type | Examples |
|-------|-----------|----------|
| 🟦 Blue | Message | Chat messages, text content |
| 🟩 Green | Tool | Calculator, Web Search, URL |
| 🟨 Yellow | Embedding | Vector representations |
| 🟪 Purple | Agent | Agent instances |
| 🟧 Orange | Data | Structured data, JSON |

**Component States**:
- **Active**: Component will execute when flow runs
- **Frozen**: Component output cached, skips re-execution (speeds up testing)
- **Error**: Component configuration invalid or execution failed

### Flows

Flows represent complete AI application workflows composed of interconnected components.

**Flow Properties**:
- **Nodes**: Individual components
- **Edges**: Connections between component ports
- **Canvas**: Visual editing surface
- **Configuration**: Flow-level settings (name, description, tags)

**Flow Operations**:
- **Run**: Execute entire flow from Chat Input to Chat Output
- **Export**: Save as JSON for sharing or backup
- **Import**: Load flows from JSON files
- **Embed**: Generate HTML/iframe code for external websites
- **API Deploy**: Create REST endpoint for programmatic access

### Edges and Connections

Connections between components define data flow and execution order.

**Connection Rules**:
- Ports must have compatible data types (color-coded)
- Some components allow multiple incoming connections
- Execution order determined by dependency graph
- Circular dependencies prevented automatically

**Dynamic Connections**:
Some components add/remove ports based on configuration:
- Adding tools to an agent creates new tool input ports
- LLM components may add temperature/max tokens inputs
- Data loaders expose format-specific parameters

---

## Advanced Features

### Custom Components

Create specialized components using Python:

```python
from langflow.custom import Component
from langflow.io import MessageTextInput, Output
from langflow.schema import Message

class WeatherComponent(Component):
    display_name = "Weather Lookup"
    description = "Fetches current weather for a city"

    inputs = [
        MessageTextInput(
            name="city",
            display_name="City Name",
            info="City to get weather for"
        ),
        MessageTextInput(
            name="api_key",
            display_name="API Key",
            password=True,
            info="OpenWeatherMap API key"
        )
    ]

    outputs = [
        Output(display_name="Weather", name="weather", method="get_weather")
    ]

    def get_weather(self) -> Message:
        import requests

        city = self.city
        api_key = self.api_key

        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
        response = requests.get(url)
        data = response.json()

        temp_kelvin = data['main']['temp']
        temp_celsius = temp_kelvin - 273.15
        description = data['weather'][0]['description']

        result = f"Weather in {city}: {temp_celsius:.1f}°C, {description}"
        return Message(text=result)
```

**Usage**:
1. Save as `weather_component.py`
2. Place in Langflow's custom components directory
3. Restart Langflow
4. Component appears in Components panel under "Custom"

### Component Grouping

Create reusable patterns by grouping components:

1. Select multiple components (Shift + Click or drag selection box)
2. Right-click → **Group Components**
3. Name the group: `RAG Pipeline`
4. Grouped components:
   - Appear as single component in library
   - Maintain internal connections
   - Expose only external input/output ports
   - Can be reused across flows

**Use Cases**:
- Standard RAG patterns (embed → store → retrieve)
- Authentication workflows
- Data preprocessing pipelines
- Multi-step agent workflows

### Flow Versioning

Langflow provides version control features:

**Component Versions**:
- When you copy a component, it maintains its original version
- Update component: Right-click → **Update to Latest**
- Prevents breaking changes in existing flows

**Flow Snapshots**:
- Export flow as JSON with timestamp
- Maintain library of flow versions
- Rollback by importing older JSON

**Best Practices**:
```bash
# Create versioned exports
langflow-flows/
├── research-agent-v1.0.json
├── research-agent-v1.1.json
├── research-agent-v2.0.json
└── README.md (changelog)
```

### Observability Integration

#### LangSmith Setup
```bash
# Set environment variables
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=ls-...
export LANGCHAIN_PROJECT=langflow-production

# Restart Langflow
uv run langflow run
```

**Features**:
- Trace every LLM call, tool execution, and agent decision
- Monitor latency and token usage
- Debug failures with full context
- A/B test prompt variations

#### LangFuse Setup (Open Source Alternative)
```bash
# Self-hosted observability
export LANGFUSE_PUBLIC_KEY=pk-...
export LANGFUSE_SECRET_KEY=sk-...
export LANGFUSE_HOST=https://langfuse.yourdomain.com

# Restart Langflow
uv run langflow run
```

**Features**:
- Open-source alternative to LangSmith
- Self-hosted deployment option
- Cost tracking per flow run
- User analytics and segmentation

---

## Deployment Strategies

### Local Development Sharing (ngrok)

Share your local instance with collaborators:

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Start Langflow
uv run langflow run

# In another terminal, expose port 7860
ngrok http 7860

# Share generated URL: https://abc123.ngrok.io
```

**Use Cases**:
- Demo flows to stakeholders
- Collaborate with remote team members
- Test webhooks from external services

**Security Note**: Anyone with the ngrok URL can access your instance. Use ngrok authentication for sensitive demos.

### Docker Compose (Local Production)

```yaml
version: '3.8'

services:
  langflow:
    image: langflowai/langflow:1.7.1
    ports:
      - "7860:7860"
    environment:
      - LANGFLOW_AUTO_LOGIN=False
      - LANGFLOW_SECRET_KEY=${LANGFLOW_SECRET_KEY}
      - LANGFLOW_DATABASE_URL=postgresql://user:pass@postgres:5432/langflow
    volumes:
      - langflow-data:/app/data
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=langflow
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=langflow
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - langflow
    restart: unless-stopped

volumes:
  langflow-data:
  postgres-data:
```

### Reverse Proxy with Caddy (Auto HTTPS)

```caddyfile
# Caddyfile
langflow.yourdomain.com {
    reverse_proxy localhost:7860

    # Optional: Basic auth
    basicauth {
        admin $2a$14$hashed_password
    }

    # Rate limiting
    rate_limit {
        zone langflow {
            key {remote_host}
            events 100
            window 1m
        }
    }
}
```

**Deploy**:
```bash
# Install Caddy
sudo apt install caddy

# Start Langflow
uv run langflow run

# Start Caddy (auto-manages HTTPS certificates)
sudo caddy run --config Caddyfile
```

### Google Cloud Platform (Cloud Run)

```bash
# Build container
docker build -t gcr.io/your-project/langflow:latest .

# Push to Google Container Registry
docker push gcr.io/your-project/langflow:latest

# Deploy to Cloud Run
gcloud run deploy langflow \
  --image gcr.io/your-project/langflow:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars LANGFLOW_AUTO_LOGIN=False,LANGFLOW_SECRET_KEY=$SECRET_KEY \
  --memory 2Gi \
  --cpu 2
```

### Hugging Face Spaces

1. Create new Space: https://huggingface.co/new-space
2. Select **Docker** as Space SDK
3. Add `Dockerfile`:
   ```dockerfile
   FROM langflowai/langflow:latest
   EXPOSE 7860
   CMD ["langflow", "run", "--host", "0.0.0.0"]
   ```
4. Push code and Langflow automatically deploys
5. Access at: https://huggingface.co/spaces/your-username/langflow

---

## API Usage & Integration

### Authentication

**Generate API Key**:
```bash
# Via CLI
uv run langflow api-key

# Via Settings UI
1. Click profile icon → Settings
2. Navigate to "Langflow API Keys"
3. Click "Add New"
4. Name: "Production API"
5. Copy key (shown once)
```

**Use API Key in Requests**:
```bash
# HTTP Header (recommended)
curl -X POST "https://your-instance/api/v1/run/FLOW_ID" \
  -H "x-api-key: $LANGFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {"message": "Hello, agent!"},
    "tweaks": {}
  }'

# Query Parameter (legacy)
curl -X POST "https://your-instance/api/v1/run/FLOW_ID?x-api-key=$LANGFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {"message": "Hello, agent!"}
  }'
```

### REST API Endpoints

#### Run Flow
```bash
POST /api/v1/run/{flow_id}

# Request Body:
{
  "inputs": {
    "message": "What is the weather in Paris?"
  },
  "tweaks": {
    "ChatInput-abc123": {
      "input_value": "Override default input"
    },
    "Agent-def456": {
      "temperature": 0.7
    }
  },
  "session_id": "user-session-12345"  # For chat memory persistence
}

# Response:
{
  "session_id": "user-session-12345",
  "outputs": [
    {
      "outputs": [
        {
          "results": {
            "message": {
              "text": "The weather in Paris is currently 18°C, partly cloudy."
            }
          }
        }
      ]
    }
  ]
}
```

#### List Flows
```bash
GET /api/v1/flows

# Response:
{
  "flows": [
    {
      "id": "abc-123",
      "name": "Research Assistant",
      "description": "Agent with web search and calculator",
      "updated_at": "2025-12-30T10:00:00Z"
    }
  ]
}
```

#### Export Flow
```bash
GET /api/v1/flows/{flow_id}/export

# Response: JSON flow definition
```

### Python SDK

```python
import requests
import json

class LangflowClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            "x-api-key": api_key,
            "Content-Type": "application/json"
        }

    def run_flow(self, flow_id, message, session_id=None):
        url = f"{self.base_url}/api/v1/run/{flow_id}"
        payload = {
            "inputs": {"message": message},
            "tweaks": {}
        }
        if session_id:
            payload["session_id"] = session_id

        response = requests.post(url, headers=self.headers, json=payload)
        return response.json()

# Usage
client = LangflowClient(
    base_url="https://your-instance.com",
    api_key="lf-..."
)

result = client.run_flow(
    flow_id="abc-123",
    message="What's the capital of France?",
    session_id="user-42"
)

print(result["outputs"][0]["outputs"][0]["results"]["message"]["text"])
```

### JavaScript/TypeScript SDK

```typescript
interface LangflowResponse {
  session_id: string;
  outputs: Array<{
    outputs: Array<{
      results: {
        message: {
          text: string;
        };
      };
    }>;
  }>;
}

class LangflowClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async runFlow(
    flowId: string,
    message: string,
    sessionId?: string
  ): Promise<LangflowResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/run/${flowId}`, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: { message },
        tweaks: {},
        ...(sessionId && { session_id: sessionId }),
      }),
    });

    return response.json();
  }
}

// Usage
const client = new LangflowClient(
  "https://your-instance.com",
  "lf-..."
);

const result = await client.runFlow(
  "abc-123",
  "Explain quantum computing in simple terms",
  "user-session-99"
);

console.log(result.outputs[0].outputs[0].results.message.text);
```

---

## Security Best Practices

### Environment Configuration

**Production Environment Variables**:
```bash
# Disable auto-login (require authentication)
export LANGFLOW_AUTO_LOGIN=False

# Generate secure secret key (CRITICAL)
export LANGFLOW_SECRET_KEY=$(python3 -c "from secrets import token_urlsafe; print(token_urlsafe(32))")

# Restrict CORS origins (no wildcards in production)
export LANGFLOW_CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# Database connection (use managed service in production)
export LANGFLOW_DATABASE_URL=postgresql://user:pass@db.internal:5432/langflow

# Log level
export LANGFLOW_LOG_LEVEL=INFO

# Disable development features
export LANGFLOW_DEV_MODE=False
```

### Network Security

**Reverse Proxy Configuration (Nginx)**:
```nginx
server {
    listen 443 ssl http2;
    server_name langflow.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/langflow.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/langflow.yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=langflow_limit:10m rate=10r/s;
    limit_req zone=langflow_limit burst=20 nodelay;

    location / {
        proxy_pass http://127.0.0.1:7860;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### API Key Management

**Key Rotation Strategy**:
1. Generate new API key: `Settings → API Keys → Add New`
2. Update applications with new key
3. Verify applications working with new key
4. Delete old API key: `Settings → API Keys → Delete`
5. Rotate every 90 days (minimum)

**Key Scoping** (Multi-User Environments):
- API keys inherit creator's privileges
- Single-user: Keys have superuser access
- Multi-user: Keys restricted to creator's resources
- Use separate keys for different applications

### Data Protection

**Sensitive Data Handling**:
```python
# Custom component with secure credential handling
from langflow.custom import Component
from langflow.io import SecretStrInput, MessageTextInput

class SecureDatabaseComponent(Component):
    inputs = [
        MessageTextInput(name="query", display_name="SQL Query"),
        SecretStrInput(
            name="db_password",
            display_name="Database Password",
            password=True,  # Masked in UI, encrypted at rest
            load_from_db=True  # Load from secure storage
        )
    ]

    # Password never exposed in logs or exports
```

**Flow Export Security**:
- Exported flows DO NOT include API keys or passwords
- Credential fields marked as "password=True" are excluded
- Re-enter credentials after importing flows

---

## Troubleshooting

### Common Issues

#### Port 7860 Already in Use
```bash
# Find process using port
lsof -i :7860  # macOS/Linux
netstat -ano | findstr :7860  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
uv run langflow run --port 8080
```

#### Missing Python Dependencies
```bash
# Install all optional dependencies
uv pip install langflow[all]

# Specific integration issues
uv pip install langflow[openai]    # OpenAI
uv pip install langflow[anthropic] # Anthropic Claude
uv pip install langflow[cohere]    # Cohere
uv pip install langflow[google]    # Google (Gemini)
```

#### Docker Container Won't Start
```bash
# View detailed logs
docker logs langflow-container --tail 100

# Check disk space
docker system df

# Recreate with fresh state
docker rm -f langflow-container
docker volume rm langflow-data
docker run -d \
  --name langflow-container \
  -p 7860:7860 \
  -v langflow-data:/app/data \
  langflowai/langflow:latest

# Check container health
docker inspect langflow-container | grep -A 10 State
```

#### Component Connection Errors
- **Port color mismatch**: Ensure data types match (blue → blue, green → green)
- **Invalid configuration**: Check component parameters for required fields
- **Circular dependencies**: Langflow prevents; review flow logic
- **Missing API keys**: Verify credentials in component settings

#### MCP Server Connection Failures

**STDIO Mode Issues**:
```bash
# Test server command manually
node /path/to/mcp-server/index.js --debug

# Common issues:
# - Incorrect path to executable
# - Missing Node.js dependencies (run npm install)
# - Wrong arguments format
```

**HTTP/SSE Mode Issues**:
```bash
# Test endpoint connectivity
curl https://api.example.com/mcp/health

# Common issues:
# - Firewall blocking outbound connections
# - Invalid API keys in headers
# - CORS not configured on MCP server
```

**Environment Variable Loading**:
```bash
# Verify .env file location
ls -la ~/.langflow/.env  # Should be in Langflow config dir

# Check file format (no spaces around =)
# ✅ Correct:
API_KEY=abc123
# ❌ Incorrect:
API_KEY = abc123
```

### Performance Optimization

#### Flow Execution Speed
- **Freeze static components**: Right-click → Freeze (caches output)
- **Reduce LLM calls**: Batch requests when possible
- **Use streaming**: Enable streaming in Chat Output for perceived speed
- **Optimize prompts**: Shorter prompts = faster responses
- **Cache embeddings**: Reuse vector stores across runs

#### Memory Management
```bash
# Monitor memory usage
docker stats langflow-container  # Docker
ps aux | grep langflow  # Linux/macOS

# Adjust Docker memory limits
docker update --memory 4g langflow-container

# Clear flow cache
rm -rf ~/.langflow/cache/*
```

#### Database Performance (PostgreSQL)
```sql
-- Add indexes for common queries
CREATE INDEX idx_flows_user_id ON flows(user_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);

-- Vacuum database regularly
VACUUM ANALYZE;

-- Monitor slow queries
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
```

---

## Community & Resources

### Official Links
- **Website**: https://www.langflow.org/
- **Documentation**: https://docs.langflow.org/
- **GitHub**: https://github.com/langflow-ai/langflow (142k ⭐)
- **Discord**: https://discord.gg/EqksyE2EX9 (active community support)
- **Twitter**: https://twitter.com/langflow_ai (product updates)
- **YouTube**: Langflow Tutorials (video guides)

### Learning Resources

**Official Documentation**:
- [Quickstart Guide](https://docs.langflow.org/get-started-quickstart)
- [Component Reference](https://docs.langflow.org/concepts-components)
- [API Documentation](https://docs.langflow.org/api-reference-api-examples)
- [Deployment Guides](https://docs.langflow.org/deployment-overview)

**Community Resources**:
- Discord #help channel for troubleshooting
- Discord #show-and-tell for flow sharing
- GitHub Discussions for feature requests
- GitHub Issues for bug reports

### Contributing

Langflow is open-source and welcomes contributions:

1. **Fork Repository**: https://github.com/langflow-ai/langflow
2. **Set Up Development Environment**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/langflow.git
   cd langflow
   make install
   make run
   ```
3. **Make Changes**: Follow code style guidelines
4. **Submit Pull Request**: Include tests and documentation
5. **Community Review**: Maintainers review and provide feedback

**Areas for Contribution**:
- New components for popular integrations
- Bug fixes and performance improvements
- Documentation updates and tutorials
- UI/UX enhancements
- Test coverage expansion

---

## Statistics & Adoption

### GitHub Metrics (December 2025)
- **Stars**: 142,000+
- **Forks**: 8,200+
- **Watchers**: 455
- **Contributors**: 331
- **Used by**: 1,500+ projects
- **Latest Release**: v1.7.1

### Technology Stack
- **Backend**: Python 3.10+, FastAPI, LangChain
- **Frontend**: TypeScript, React, Vite
- **Database**: PostgreSQL (production), SQLite (development)
- **Deployment**: Docker, Kubernetes, Cloud platforms

### License
**MIT License** - Free for commercial and personal use

---

## Version History

### v1.7.1 (December 19, 2025)
- Enhanced MCP client/server integration
- Performance improvements for large flows
- Bug fixes and stability updates
- Improved component library organization

### v1.7.0 (December 2025)
- Native Model Context Protocol support
- Multi-agent coordination improvements
- New observability integrations (LangSmith, LangFuse)
- Enhanced security features

### v1.6.0 (November 2025)
- Desktop application launch (macOS, Windows)
- Improved flow export/import
- Component grouping feature
- Performance optimizations

---

## Conclusion

Langflow transforms AI application development by combining the power of Python with the accessibility of visual design. Whether you're prototyping a simple chatbot, building sophisticated multi-agent systems, or deploying production-grade AI workflows with MCP integration, Langflow provides the tools and flexibility you need.

**Get Started Today**:
```bash
uv pip install langflow
uv run langflow run
# Access at http://127.0.0.1:7860
```

Join the 142,000+ developers building the future of AI applications with Langflow.

---

**Last Updated**: December 30, 2025
**Documentation Version**: 1.0
**Langflow Version**: 1.7.1
