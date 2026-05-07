---
name: langchain-mcp-adapters
description: LangChain MCP Adapters — connect LangChain agents to MCP (Model Context Protocol) servers. Load MCP tools, prompts, and resources as LangChain-compatible objects. Supports stdio, SSE, StreamableHTTP, and WebSocket transports. Includes interceptors, callbacks, and multi-server management.
---

# LangChain MCP Adapters Skill

Expert assistance for `langchain-mcp-adapters`: the official LangChain bridge to MCP (Model Context Protocol) servers. Converts MCP tools, prompts, and resources into LangChain-native objects usable by any LangChain agent or chain.

**Install**: `pip install langchain-mcp-adapters`

Reference: `references/api.md` (500 KB — full API reference) and `references/llms.md` (28 KB — index).

## When to Use This Skill

Activate when:
- **Connecting to MCP servers** — using `MultiServerMCPClient` or `create_session()` to connect via stdio, SSE, HTTP, or WebSocket
- **Loading MCP tools** — calling `load_mcp_tools()` or `client.get_tools()` to get `BaseTool`-compatible tools
- **Configuring connection types** — choosing between `StdioConnection`, `SSEConnection`, `StreamableHttpConnection`, `WebsocketConnection`
- **Adding tool interceptors** — implementing `ToolCallInterceptor` for retry, caching, rate limiting, or auth
- **Handling MCP callbacks** — using `LoggingMessageCallback`, `ProgressCallback`, or `ElicitationCallback`
- **Loading MCP resources or prompts** — calling `load_mcp_resources()`, `get_mcp_resource()`, or `load_mcp_prompt()`
- **Prefixing tool names** — avoiding name collisions across multiple MCP servers with `tool_name_prefix=True`
- **Converting to FastMCP** — using `to_fastmcp()` to expose LangChain tools as a FastMCP server

## Quick Reference

### Connect to multiple MCP servers and load tools

```python
from langchain_mcp_adapters.client import MultiServerMCPClient

async with MultiServerMCPClient(
    connections={
        "filesystem": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
        },
        "weather": {
            "transport": "streamable_http",
            "url": "https://weather-mcp.example.com/mcp",
        },
    },
    tool_name_prefix=True,   # tools become "filesystem_read_file", "weather_search"
) as client:
    tools = await client.get_tools()
    # Use tools with any LangChain agent
    agent = create_react_agent(llm, tools)
```

### Connection types

```python
from langchain_mcp_adapters.sessions import (
    StdioConnection, SSEConnection, StreamableHttpConnection, WebsocketConnection
)

# stdio — local process (most common for CLI tools)
stdio: StdioConnection = {
    "transport": "stdio",
    "command": "python",
    "args": ["-m", "my_mcp_server"],
    "env": {"MY_API_KEY": "..."},
    "cwd": "/path/to/server",
}

# StreamableHTTP — remote server (recommended for network)
http: StreamableHttpConnection = {
    "transport": "streamable_http",
    "url": "https://my-mcp-server.example.com/mcp",
    "headers": {"Authorization": "Bearer my-token"},
    "timeout": timedelta(seconds=30),
}

# SSE — legacy remote (use streamable_http for new servers)
sse: SSEConnection = {
    "transport": "sse",
    "url": "https://my-mcp-server.example.com/sse",
}
```

### Load tools from a single session

```python
from langchain_mcp_adapters.sessions import create_session
from langchain_mcp_adapters.tools import load_mcp_tools

async with create_session(connection) as session:
    tools: list[BaseTool] = await load_mcp_tools(
        session=session,
        server_name="my_server",
        tool_name_prefix=True,   # prefix tool names with server_name
    )
```

### Tool call interceptors (middleware / onion pattern)

```python
from langchain_mcp_adapters.interceptors import ToolCallInterceptor, MCPToolCallRequest, MCPToolCallResult

class RateLimitInterceptor(ToolCallInterceptor):
    async def intercept(self, request: MCPToolCallRequest, handler) -> MCPToolCallResult:
        await rate_limiter.acquire()
        return await handler(request)   # call next interceptor or actual tool

class RetryInterceptor(ToolCallInterceptor):
    async def intercept(self, request: MCPToolCallRequest, handler) -> MCPToolCallResult:
        for attempt in range(3):
            try:
                return await handler(request)
            except Exception:
                if attempt == 2:
                    raise

# First interceptor = outermost layer
client = MultiServerMCPClient(
    connections={...},
    tool_interceptors=[RateLimitInterceptor(), RetryInterceptor()],
)
```

### Callbacks

```python
from langchain_mcp_adapters.callbacks import LoggingMessageCallback, ProgressCallback

# Log all MCP messages
logging_cb = LoggingMessageCallback()

# Track progress of long-running operations
progress_cb = ProgressCallback(on_progress=lambda p: print(f"Progress: {p}%"))

client = MultiServerMCPClient(
    connections={...},
    callbacks=[logging_cb, progress_cb],
)
```

### Load MCP resources and prompts

```python
from langchain_mcp_adapters.resources import load_mcp_resources, get_mcp_resource
from langchain_mcp_adapters.prompts import load_mcp_prompt

async with create_session(connection) as session:
    # Load all resources as LangChain Blobs
    resources = await load_mcp_resources(session)

    # Get a specific resource
    blob = await get_mcp_resource(session, uri="file:///data/config.json")

    # Load a prompt and convert to LangChain messages
    messages = await load_mcp_prompt(session, name="summarize", arguments={"text": "..."})
```

### Convert LangChain tools to FastMCP server

```python
from langchain_mcp_adapters.tools import to_fastmcp
from langchain_community.tools import DuckDuckGoSearchRun

lc_tools = [DuckDuckGoSearchRun()]
fastmcp_server = to_fastmcp(lc_tools)   # expose as MCP server
fastmcp_server.run()
```

## API Reference

### `MultiServerMCPClient`

```
MultiServerMCPClient(
    connections: dict[str, Connection] | None = None,
    callbacks: Callbacks | None = None,
    tool_interceptors: list[ToolCallInterceptor] | None = None,
    tool_name_prefix: bool = False,
)
```

| Method | Returns | Description |
|--------|---------|-------------|
| `get_tools()` | `list[BaseTool]` | All tools from all connected servers |
| `get_prompt(server, name, args)` | `list[BaseMessage]` | Load a prompt as LangChain messages |
| `get_resources(server)` | `list[Blob]` | Load resources from a server |
| `session(server)` | context manager | Access raw MCP session for a server |

### Connection types

| Type | Transport | Best For |
|------|-----------|----------|
| `StdioConnection` | `"stdio"` | Local CLI tools, local MCP servers |
| `StreamableHttpConnection` | `"streamable_http"` | Remote servers (recommended) |
| `SSEConnection` | `"sse"` | Legacy remote servers |
| `WebsocketConnection` | `"websocket"` | Bidirectional real-time connections |

### Key functions

| Function | Description |
|----------|-------------|
| `load_mcp_tools(session, ...)` | Convert all MCP tools to `BaseTool` list |
| `convert_mcp_tool_to_langchain_tool(tool, session)` | Convert one MCP tool |
| `to_fastmcp(tools)` | Expose LangChain tools as FastMCP server |
| `load_mcp_resources(session)` | Load all resources as Blobs |
| `get_mcp_resource(session, uri)` | Load specific resource by URI |
| `load_mcp_prompt(session, name, args)` | Load prompt as LangChain messages |
| `create_session(connection)` | Create a raw MCP session (context manager) |

## Reference Files

| File | Size | Contents |
|------|------|----------|
| `references/api.md` | 500 KB | Full API reference (all classes, methods, signatures) |
| `references/llms.md` | 28 KB | Doc index |
| `references/llms-full.md` | 500 KB | Complete page content |

Source: `https://reference.langchain.com/python/langchain-mcp-adapters`
GitHub: `https://github.com/langchain-ai/langchain-mcp-adapters`
