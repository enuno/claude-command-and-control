# MCP SDK Examples

Comprehensive code examples for implementing MCP servers and clients across TypeScript and Python.

## TypeScript Server Examples

### Complete Weather Server

```typescript
import { McpServer, StdioServerTransport } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
  capabilities: {
    tools: { listChanged: true },
    resources: { subscribe: true, listChanged: true },
    prompts: { listChanged: true }
  }
});

// Tool: Get current weather
server.tool(
  "get_weather",
  {
    description: "Get current weather for a location",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name (e.g., 'San Francisco')"
        },
        units: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          default: "celsius",
          description: "Temperature units"
        }
      },
      required: ["city"]
    }
  },
  async ({ city, units = "celsius" }) => {
    try {
      const weather = await fetchWeatherAPI(city);
      const temp = units === "fahrenheit"
        ? weather.temp * 9/5 + 32
        : weather.temp;

      return {
        content: [{
          type: "text",
          text: `Weather in ${city}: ${temp}°${units === "fahrenheit" ? "F" : "C"}, ${weather.condition}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching weather: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Get forecast
server.tool(
  "get_forecast",
  {
    description: "Get weather forecast for upcoming days",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" },
        days: { type: "number", minimum: 1, maximum: 7, default: 3 }
      },
      required: ["city"]
    }
  },
  async ({ city, days = 3 }) => {
    const forecast = await fetchForecastAPI(city, days);

    const forecastText = forecast.map(day =>
      `${day.date}: ${day.high}°/${day.low}° - ${day.condition}`
    ).join("\n");

    return {
      content: [{
        type: "text",
        text: `${days}-day forecast for ${city}:\n${forecastText}`
      }]
    };
  }
);

// Resource: Weather alerts
server.resource(
  "weather://alerts/{region}",
  {
    name: "Weather Alerts",
    description: "Active weather alerts for a region",
    mimeType: "application/json"
  },
  async (uri, { region }) => {
    const alerts = await fetchAlertsAPI(region);

    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(alerts, null, 2)
      }]
    };
  }
);

// Resource: Cached locations
const cachedLocations = new Map<string, object>();

server.resource(
  "weather://cache",
  {
    name: "Cached Locations",
    description: "Previously queried weather locations",
    mimeType: "application/json"
  },
  async () => {
    return {
      contents: [{
        uri: "weather://cache",
        mimeType: "application/json",
        text: JSON.stringify(Object.fromEntries(cachedLocations))
      }]
    };
  }
);

// Prompt: Weather report
server.prompt(
  "weather_report",
  {
    name: "Weather Report",
    description: "Generate a detailed weather report",
    arguments: [
      { name: "city", description: "City for the report", required: true },
      { name: "style", description: "Report style (formal/casual)", required: false }
    ]
  },
  async ({ city, style = "casual" }) => {
    const weather = await fetchWeatherAPI(city);

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a ${style} weather report for ${city}. Current conditions: ${weather.temp}°C, ${weather.condition}, humidity: ${weather.humidity}%, wind: ${weather.wind} km/h.`
          }
        }
      ]
    };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP server running on stdio");
}

main().catch(console.error);
```

### Database Query Server

```typescript
import { McpServer, StdioServerTransport } from "@modelcontextprotocol/sdk/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const server = new McpServer({
  name: "database-server",
  version: "1.0.0"
});

// Tool: Execute SELECT query (read-only)
server.tool(
  "query",
  {
    description: "Execute a read-only SQL query",
    inputSchema: {
      type: "object",
      properties: {
        sql: {
          type: "string",
          description: "SQL SELECT query to execute"
        },
        params: {
          type: "array",
          items: { type: "string" },
          description: "Query parameters for prepared statement"
        }
      },
      required: ["sql"]
    }
  },
  async ({ sql, params = [] }) => {
    // Security: Only allow SELECT queries
    const normalizedSql = sql.trim().toLowerCase();
    if (!normalizedSql.startsWith("select")) {
      return {
        content: [{ type: "text", text: "Error: Only SELECT queries are allowed" }],
        isError: true
      };
    }

    try {
      const result = await pool.query(sql, params);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            rowCount: result.rowCount,
            rows: result.rows
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Query error: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool: Describe table schema
server.tool(
  "describe_table",
  {
    description: "Get schema information for a table",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Table name" }
      },
      required: ["table"]
    }
  },
  async ({ table }) => {
    // Validate table name (prevent injection)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      return {
        content: [{ type: "text", text: "Error: Invalid table name" }],
        isError: true
      };
    }

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table]);

    return {
      content: [{
        type: "text",
        text: `Schema for ${table}:\n` +
          result.rows.map(col =>
            `  ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`
          ).join("\n")
      }]
    };
  }
);

// Resource: List all tables
server.resource(
  "db://tables",
  {
    name: "Database Tables",
    description: "List of all tables in the database",
    mimeType: "application/json"
  },
  async () => {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    return {
      contents: [{
        uri: "db://tables",
        mimeType: "application/json",
        text: JSON.stringify(result.rows.map(r => r.table_name))
      }]
    };
  }
);

// Resource template: Table data preview
server.resource(
  "db://preview/{table}",
  {
    name: "Table Preview",
    description: "Preview first 10 rows of a table",
    mimeType: "application/json"
  },
  async (uri, { table }) => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error("Invalid table name");
    }

    const result = await pool.query(
      `SELECT * FROM ${table} LIMIT 10`
    );

    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(result.rows, null, 2)
      }]
    };
  }
);

// Prompt: Generate query
server.prompt(
  "generate_query",
  {
    name: "Generate SQL Query",
    description: "Help generate a SQL query for a specific task",
    arguments: [
      { name: "task", description: "What you want to query", required: true },
      { name: "tables", description: "Relevant table names", required: false }
    ]
  },
  async ({ task, tables }) => {
    // Get schema info for context
    let schemaContext = "";
    if (tables) {
      const tableList = tables.split(",").map(t => t.trim());
      for (const table of tableList) {
        const result = await pool.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = $1
        `, [table]);

        schemaContext += `\nTable ${table}: ${result.rows.map(r => `${r.column_name} (${r.data_type})`).join(", ")}`;
      }
    }

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Generate a SQL query for: ${task}\n\nAvailable schema:${schemaContext || " (schema not specified)"}\n\nProvide only the SQL query.`
        }
      }]
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
```

### File System Server with Subscriptions

```typescript
import { McpServer, StdioServerTransport } from "@modelcontextprotocol/sdk/server";
import { watch } from "fs";
import { readFile, readdir, stat } from "fs/promises";
import { join, resolve } from "path";

const server = new McpServer({
  name: "filesystem-server",
  version: "1.0.0",
  capabilities: {
    resources: { subscribe: true, listChanged: true }
  }
});

// Root directory for file access
const ROOT_DIR = process.env.FS_ROOT || process.cwd();

// Track subscriptions
const subscriptions = new Map<string, Set<() => void>>();

// Helper: Validate path is within root
function validatePath(filePath: string): string {
  const resolved = resolve(ROOT_DIR, filePath);
  if (!resolved.startsWith(ROOT_DIR)) {
    throw new Error("Access denied: Path outside root directory");
  }
  return resolved;
}

// Resource: File content
server.resource(
  "file://{path}",
  {
    name: "File Content",
    description: "Read file content",
    mimeType: "text/plain"
  },
  async (uri, { path }) => {
    const fullPath = validatePath(path);
    const content = await readFile(fullPath, "utf-8");

    return {
      contents: [{
        uri: uri.href,
        mimeType: getMimeType(path),
        text: content
      }]
    };
  }
);

// Resource: Directory listing
server.resource(
  "dir://{path}",
  {
    name: "Directory Listing",
    description: "List directory contents",
    mimeType: "application/json"
  },
  async (uri, { path }) => {
    const fullPath = validatePath(path || "");
    const entries = await readdir(fullPath, { withFileTypes: true });

    const listing = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = join(fullPath, entry.name);
        const stats = await stat(entryPath);
        return {
          name: entry.name,
          type: entry.isDirectory() ? "directory" : "file",
          size: stats.size,
          modified: stats.mtime.toISOString()
        };
      })
    );

    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(listing, null, 2)
      }]
    };
  }
);

// Handle resource subscriptions
server.on("resources/subscribe", async ({ uri }) => {
  const url = new URL(uri);
  if (url.protocol === "file:") {
    const path = validatePath(url.pathname);

    // Set up file watcher
    const watcher = watch(path, (eventType) => {
      if (eventType === "change") {
        server.notify("notifications/resources/updated", { uri });
      }
    });

    // Store cleanup function
    if (!subscriptions.has(uri)) {
      subscriptions.set(uri, new Set());
    }
    subscriptions.get(uri)!.add(() => watcher.close());
  }
});

server.on("resources/unsubscribe", async ({ uri }) => {
  const cleanups = subscriptions.get(uri);
  if (cleanups) {
    cleanups.forEach(cleanup => cleanup());
    subscriptions.delete(uri);
  }
});

// Tool: Search files
server.tool(
  "search_files",
  {
    description: "Search for files matching a pattern",
    inputSchema: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "Glob pattern (e.g., '*.ts')" },
        directory: { type: "string", description: "Directory to search in" }
      },
      required: ["pattern"]
    }
  },
  async ({ pattern, directory = "" }) => {
    const searchDir = validatePath(directory);
    const { glob } = await import("glob");

    const matches = await glob(pattern, {
      cwd: searchDir,
      nodir: true
    });

    return {
      content: [{
        type: "text",
        text: `Found ${matches.length} files:\n${matches.join("\n")}`
      }]
    };
  }
);

// Tool: Read file
server.tool(
  "read_file",
  {
    description: "Read contents of a file",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path relative to root" },
        encoding: { type: "string", default: "utf-8" }
      },
      required: ["path"]
    }
  },
  async ({ path, encoding = "utf-8" }) => {
    const fullPath = validatePath(path);
    const content = await readFile(fullPath, encoding as BufferEncoding);

    return {
      content: [{
        type: "text",
        text: content
      }]
    };
  }
);

function getMimeType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    ts: "text/typescript",
    js: "text/javascript",
    json: "application/json",
    md: "text/markdown",
    txt: "text/plain",
    html: "text/html",
    css: "text/css"
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

const transport = new StdioServerTransport();
server.connect(transport);
```

---

## Python Server Examples

### Complete Weather Server

```python
import asyncio
import json
import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    Tool, TextContent, Resource, ResourceContents,
    Prompt, PromptMessage, GetPromptResult
)

server = Server("weather-server")

# In-memory cache
weather_cache = {}

@server.tool()
async def get_weather(city: str, units: str = "celsius") -> list[TextContent]:
    """
    Get current weather for a location.

    Args:
        city: City name (e.g., 'San Francisco')
        units: Temperature units - 'celsius' or 'fahrenheit'
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.weather.example/current",
            params={"city": city}
        )
        data = response.json()

    temp = data["temp"]
    if units == "fahrenheit":
        temp = temp * 9/5 + 32

    # Cache the result
    weather_cache[city] = data

    return [TextContent(
        type="text",
        text=f"Weather in {city}: {temp}°{'F' if units == 'fahrenheit' else 'C'}, {data['condition']}"
    )]

@server.tool()
async def get_forecast(city: str, days: int = 3) -> list[TextContent]:
    """
    Get weather forecast for upcoming days.

    Args:
        city: City name
        days: Number of days (1-7)
    """
    if not 1 <= days <= 7:
        return [TextContent(type="text", text="Error: days must be between 1 and 7")]

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.weather.example/forecast",
            params={"city": city, "days": days}
        )
        forecast = response.json()["days"]

    forecast_lines = [
        f"{day['date']}: {day['high']}°/{day['low']}° - {day['condition']}"
        for day in forecast
    ]

    return [TextContent(
        type="text",
        text=f"{days}-day forecast for {city}:\n" + "\n".join(forecast_lines)
    )]

@server.resource("weather://alerts/{region}")
async def get_alerts(region: str) -> str:
    """Active weather alerts for a region."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.weather.example/alerts",
            params={"region": region}
        )
    return response.text

@server.resource("weather://cache")
async def get_cache() -> str:
    """Previously queried weather locations."""
    return json.dumps(weather_cache, indent=2)

@server.prompt()
async def weather_report(city: str, style: str = "casual") -> GetPromptResult:
    """
    Generate a detailed weather report.

    Args:
        city: City for the report
        style: Report style - 'formal' or 'casual'
    """
    # Fetch current weather for context
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.weather.example/current",
            params={"city": city}
        )
        weather = response.json()

    return GetPromptResult(
        messages=[
            PromptMessage(
                role="user",
                content=TextContent(
                    type="text",
                    text=f"""Generate a {style} weather report for {city}.

Current conditions:
- Temperature: {weather['temp']}°C
- Condition: {weather['condition']}
- Humidity: {weather['humidity']}%
- Wind: {weather['wind']} km/h

Please include recommendations for outdoor activities."""
                )
            )
        ]
    )

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

### Database Query Server

```python
import asyncio
import json
import re
from typing import Optional
import asyncpg
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, GetPromptResult, PromptMessage

server = Server("database-server")

# Database connection pool
pool: Optional[asyncpg.Pool] = None

async def get_pool():
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            dsn=os.environ.get("DATABASE_URL")
        )
    return pool

@server.tool()
async def query(sql: str, params: list[str] = None) -> list[TextContent]:
    """
    Execute a read-only SQL query.

    Args:
        sql: SQL SELECT query to execute
        params: Query parameters for prepared statement
    """
    # Security: Only allow SELECT queries
    normalized = sql.strip().lower()
    if not normalized.startswith("select"):
        return [TextContent(
            type="text",
            text="Error: Only SELECT queries are allowed"
        )]

    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            if params:
                rows = await conn.fetch(sql, *params)
            else:
                rows = await conn.fetch(sql)

        result = [dict(row) for row in rows]
        return [TextContent(
            type="text",
            text=json.dumps({
                "rowCount": len(result),
                "rows": result
            }, indent=2, default=str)
        )]
    except Exception as e:
        return [TextContent(type="text", text=f"Query error: {str(e)}")]

@server.tool()
async def describe_table(table: str) -> list[TextContent]:
    """
    Get schema information for a table.

    Args:
        table: Table name to describe
    """
    # Validate table name
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', table):
        return [TextContent(type="text", text="Error: Invalid table name")]

    pool = await get_pool()
    async with pool.acquire() as conn:
        columns = await conn.fetch("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = $1
            ORDER BY ordinal_position
        """, table)

    schema_lines = [
        f"  {col['column_name']}: {col['data_type']}"
        f"{'NOT NULL' if col['is_nullable'] == 'NO' else ''}"
        for col in columns
    ]

    return [TextContent(
        type="text",
        text=f"Schema for {table}:\n" + "\n".join(schema_lines)
    )]

@server.resource("db://tables")
async def list_tables() -> str:
    """List of all tables in the database."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        tables = await conn.fetch("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)

    return json.dumps([t['table_name'] for t in tables])

@server.resource("db://preview/{table}")
async def preview_table(table: str) -> str:
    """Preview first 10 rows of a table."""
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', table):
        raise ValueError("Invalid table name")

    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(f"SELECT * FROM {table} LIMIT 10")

    return json.dumps([dict(row) for row in rows], indent=2, default=str)

@server.prompt()
async def generate_query(task: str, tables: str = None) -> GetPromptResult:
    """
    Help generate a SQL query for a specific task.

    Args:
        task: What you want to query
        tables: Comma-separated list of relevant table names
    """
    schema_context = ""

    if tables:
        pool = await get_pool()
        async with pool.acquire() as conn:
            for table in tables.split(","):
                table = table.strip()
                columns = await conn.fetch("""
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_name = $1
                """, table)

                col_info = ", ".join(
                    f"{c['column_name']} ({c['data_type']})"
                    for c in columns
                )
                schema_context += f"\nTable {table}: {col_info}"

    return GetPromptResult(
        messages=[
            PromptMessage(
                role="user",
                content=TextContent(
                    type="text",
                    text=f"""Generate a SQL query for: {task}

Available schema:{schema_context or " (schema not specified)"}

Provide only the SQL query."""
                )
            )
        ]
    )

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    import os
    asyncio.run(main())
```

### HTTP API Server

```python
import asyncio
import json
from typing import Any
import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent

server = Server("api-server")

# Configuration
API_BASE_URL = "https://api.example.com"
API_KEY = os.environ.get("API_KEY", "")

async def make_request(
    method: str,
    endpoint: str,
    data: dict = None,
    params: dict = None
) -> dict:
    """Helper for API requests."""
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=method,
            url=f"{API_BASE_URL}{endpoint}",
            json=data,
            params=params,
            headers={"Authorization": f"Bearer {API_KEY}"}
        )
        response.raise_for_status()
        return response.json()

@server.tool()
async def api_get(endpoint: str, params: dict = None) -> list[TextContent]:
    """
    Make a GET request to the API.

    Args:
        endpoint: API endpoint path (e.g., '/users')
        params: Query parameters
    """
    try:
        result = await make_request("GET", endpoint, params=params)
        return [TextContent(
            type="text",
            text=json.dumps(result, indent=2)
        )]
    except httpx.HTTPError as e:
        return [TextContent(type="text", text=f"API Error: {str(e)}")]

@server.tool()
async def api_post(endpoint: str, data: dict) -> list[TextContent]:
    """
    Make a POST request to the API.

    Args:
        endpoint: API endpoint path
        data: Request body data
    """
    try:
        result = await make_request("POST", endpoint, data=data)
        return [TextContent(
            type="text",
            text=json.dumps(result, indent=2)
        )]
    except httpx.HTTPError as e:
        return [TextContent(type="text", text=f"API Error: {str(e)}")]

@server.tool()
async def api_put(endpoint: str, data: dict) -> list[TextContent]:
    """
    Make a PUT request to the API.

    Args:
        endpoint: API endpoint path
        data: Request body data
    """
    try:
        result = await make_request("PUT", endpoint, data=data)
        return [TextContent(
            type="text",
            text=json.dumps(result, indent=2)
        )]
    except httpx.HTTPError as e:
        return [TextContent(type="text", text=f"API Error: {str(e)}")]

@server.tool()
async def api_delete(endpoint: str) -> list[TextContent]:
    """
    Make a DELETE request to the API.

    Args:
        endpoint: API endpoint path
    """
    try:
        result = await make_request("DELETE", endpoint)
        return [TextContent(
            type="text",
            text=f"Deleted successfully: {json.dumps(result)}"
        )]
    except httpx.HTTPError as e:
        return [TextContent(type="text", text=f"API Error: {str(e)}")]

@server.resource("api://endpoints")
async def list_endpoints() -> str:
    """Available API endpoints."""
    endpoints = {
        "users": {
            "GET /users": "List all users",
            "GET /users/{id}": "Get user by ID",
            "POST /users": "Create new user",
            "PUT /users/{id}": "Update user",
            "DELETE /users/{id}": "Delete user"
        },
        "products": {
            "GET /products": "List all products",
            "GET /products/{id}": "Get product by ID",
            "POST /products": "Create new product"
        }
    }
    return json.dumps(endpoints, indent=2)

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    import os
    asyncio.run(main())
```

---

## Client Examples

### TypeScript Client

```typescript
import { McpClient, StdioClientTransport } from "@modelcontextprotocol/sdk/client";
import { spawn } from "child_process";

async function main() {
  // Launch server
  const serverProcess = spawn("python", ["weather_server.py"]);

  // Create client
  const client = new McpClient({
    name: "weather-client",
    version: "1.0.0",
    capabilities: {
      sampling: {}
    }
  });

  // Connect
  const transport = new StdioClientTransport({
    reader: serverProcess.stdout,
    writer: serverProcess.stdin
  });

  await client.connect(transport);

  // Initialize
  const serverInfo = await client.initialize();
  console.log("Connected to:", serverInfo.serverInfo.name);
  console.log("Capabilities:", serverInfo.capabilities);

  // List tools
  const tools = await client.listTools();
  console.log("\nAvailable tools:");
  tools.tools.forEach(tool => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });

  // Call get_weather tool
  console.log("\n--- Calling get_weather ---");
  const weatherResult = await client.callTool("get_weather", {
    city: "San Francisco",
    units: "fahrenheit"
  });
  console.log("Result:", weatherResult.content[0].text);

  // Call get_forecast tool
  console.log("\n--- Calling get_forecast ---");
  const forecastResult = await client.callTool("get_forecast", {
    city: "San Francisco",
    days: 5
  });
  console.log("Result:", forecastResult.content[0].text);

  // List resources
  const resources = await client.listResources();
  console.log("\nAvailable resources:");
  resources.resources.forEach(res => {
    console.log(`  - ${res.uri}: ${res.description}`);
  });

  // Read resource
  console.log("\n--- Reading weather://cache ---");
  const cache = await client.readResource("weather://cache");
  console.log("Cache:", cache.contents[0].text);

  // List prompts
  const prompts = await client.listPrompts();
  console.log("\nAvailable prompts:");
  prompts.prompts.forEach(prompt => {
    console.log(`  - ${prompt.name}: ${prompt.description}`);
  });

  // Get prompt
  console.log("\n--- Getting weather_report prompt ---");
  const prompt = await client.getPrompt("weather_report", {
    city: "New York",
    style: "formal"
  });
  console.log("Prompt message:", prompt.messages[0].content.text);

  // Cleanup
  await client.close();
  serverProcess.kill();
}

main().catch(console.error);
```

### Python Client

```python
import asyncio
import subprocess
from mcp.client import ClientSession
from mcp.client.stdio import stdio_client

async def main():
    # Launch server
    server_process = subprocess.Popen(
        ["node", "weather_server.js"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    try:
        async with stdio_client(
            server_process.stdout,
            server_process.stdin
        ) as (read, write):
            async with ClientSession(read, write) as session:
                # Initialize
                result = await session.initialize()
                print(f"Connected to: {result.server_info.name}")
                print(f"Capabilities: {result.capabilities}")

                # List tools
                tools = await session.list_tools()
                print("\nAvailable tools:")
                for tool in tools.tools:
                    print(f"  - {tool.name}: {tool.description}")

                # Call tool
                print("\n--- Calling get_weather ---")
                result = await session.call_tool("get_weather", {
                    "city": "London",
                    "units": "celsius"
                })
                print(f"Result: {result.content[0].text}")

                # List resources
                resources = await session.list_resources()
                print("\nAvailable resources:")
                for res in resources.resources:
                    print(f"  - {res.uri}: {res.description}")

                # Read resource
                print("\n--- Reading resource ---")
                content = await session.read_resource("weather://cache")
                print(f"Content: {content.contents[0].text}")

                # Get prompt
                print("\n--- Getting prompt ---")
                prompt = await session.get_prompt("weather_report", {
                    "city": "Paris",
                    "style": "casual"
                })
                print(f"Prompt: {prompt.messages[0].content.text}")

    finally:
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Advanced Patterns

### Server with Sampling

```typescript
// Server that uses LLM via client sampling
server.tool(
  "summarize_document",
  {
    description: "Summarize a document using AI",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", description: "Document content" },
        maxLength: { type: "number", description: "Max summary length" }
      },
      required: ["content"]
    }
  },
  async ({ content, maxLength = 200 }, { sampling }) => {
    // Request LLM completion through client
    const result = await sampling.createMessage({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Summarize the following document in ${maxLength} words or less:\n\n${content}`
        }
      }],
      modelPreferences: {
        hints: [{ name: "claude-3-haiku" }],
        speedPriority: 0.8,
        costPriority: 0.7
      },
      maxTokens: maxLength * 2
    });

    return {
      content: [{
        type: "text",
        text: result.content.text
      }]
    };
  }
);
```

### Multi-Server Client

```typescript
// Connect to multiple MCP servers
async function createMultiServerClient() {
  const clients = new Map<string, McpClient>();

  // Weather server
  const weatherServer = spawn("node", ["weather_server.js"]);
  const weatherClient = new McpClient({ name: "multi-client", version: "1.0.0" });
  await weatherClient.connect(new StdioClientTransport({
    reader: weatherServer.stdout,
    writer: weatherServer.stdin
  }));
  clients.set("weather", weatherClient);

  // Database server
  const dbServer = spawn("python", ["db_server.py"]);
  const dbClient = new McpClient({ name: "multi-client", version: "1.0.0" });
  await dbClient.connect(new StdioClientTransport({
    reader: dbServer.stdout,
    writer: dbServer.stdin
  }));
  clients.set("database", dbClient);

  // Aggregate tools from all servers
  async function listAllTools() {
    const allTools = [];
    for (const [serverName, client] of clients) {
      const tools = await client.listTools();
      allTools.push(...tools.tools.map(t => ({
        ...t,
        server: serverName
      })));
    }
    return allTools;
  }

  // Route tool calls to appropriate server
  async function callTool(toolName: string, args: object) {
    for (const [serverName, client] of clients) {
      const tools = await client.listTools();
      if (tools.tools.some(t => t.name === toolName)) {
        return await client.callTool(toolName, args);
      }
    }
    throw new Error(`Tool not found: ${toolName}`);
  }

  return { clients, listAllTools, callTool };
}
```

### Error Handling Patterns

```typescript
// Comprehensive error handling
server.tool("safe_operation", schema, async (args) => {
  try {
    // Validate inputs
    if (!isValidInput(args)) {
      return {
        content: [{
          type: "text",
          text: "Invalid input: " + getValidationErrors(args).join(", ")
        }],
        isError: true
      };
    }

    // Perform operation
    const result = await performOperation(args);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result)
      }]
    };

  } catch (error) {
    // Log for debugging
    console.error("Tool error:", error);

    // Return user-friendly error
    if (error instanceof ValidationError) {
      return {
        content: [{ type: "text", text: `Validation failed: ${error.message}` }],
        isError: true
      };
    }

    if (error instanceof NetworkError) {
      return {
        content: [{ type: "text", text: `Network error: Please try again later` }],
        isError: true
      };
    }

    // Generic error
    return {
      content: [{ type: "text", text: `Operation failed: ${error.message}` }],
      isError: true
    };
  }
});
```

---

## Testing

### Unit Testing Tools

```typescript
import { describe, it, expect } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server";

describe("Weather Server", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createWeatherServer();
  });

  it("should return weather for valid city", async () => {
    const result = await server.handleToolCall("get_weather", {
      city: "San Francisco"
    });

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("San Francisco");
    expect(result.isError).toBeUndefined();
  });

  it("should handle invalid city", async () => {
    const result = await server.handleToolCall("get_weather", {
      city: ""
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error");
  });

  it("should convert to fahrenheit", async () => {
    const result = await server.handleToolCall("get_weather", {
      city: "London",
      units: "fahrenheit"
    });

    expect(result.content[0].text).toContain("°F");
  });
});
```

### Integration Testing

```typescript
import { spawn } from "child_process";
import { McpClient, StdioClientTransport } from "@modelcontextprotocol/sdk/client";

describe("Server Integration", () => {
  let server: ChildProcess;
  let client: McpClient;

  beforeAll(async () => {
    server = spawn("node", ["dist/server.js"]);
    client = new McpClient({ name: "test", version: "1.0.0" });

    await client.connect(new StdioClientTransport({
      reader: server.stdout,
      writer: server.stdin
    }));

    await client.initialize();
  });

  afterAll(async () => {
    await client.close();
    server.kill();
  });

  it("should list tools", async () => {
    const tools = await client.listTools();
    expect(tools.tools.length).toBeGreaterThan(0);
  });

  it("should call tool successfully", async () => {
    const result = await client.callTool("get_weather", {
      city: "Tokyo"
    });
    expect(result.content).toBeDefined();
  });
});
```

---

## Best Practices Summary

### Server Development
1. **Clear descriptions** - Models use these to decide tool usage
2. **Strict input validation** - Prevent injection attacks
3. **Helpful error messages** - Guide users to correct usage
4. **Resource templates** - Use URI parameters for dynamic resources
5. **Pagination** - Handle large datasets properly

### Client Development
1. **Handle all capabilities** - Check server supports features before using
2. **Implement timeouts** - Don't block on slow servers
3. **Log JSON-RPC** - Debug message flow
4. **Reconnection logic** - Handle transport failures

### Security
1. **Sanitize all inputs** - Never trust external data
2. **Validate paths** - Prevent directory traversal
3. **Use prepared statements** - For database queries
4. **Rate limit** - Protect against abuse
5. **Audit logging** - Track all operations
