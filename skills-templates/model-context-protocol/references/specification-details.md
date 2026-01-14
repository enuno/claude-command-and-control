# MCP Specification Details

> **Source**: Official MCP Specification at modelcontextprotocol.io
> **Version**: 2024-11-05
> **Last Updated**: 2026-01-10

This reference provides detailed protocol specification information beyond the main SKILL.md guide.

---

## Protocol Version

The current stable specification version is **2024-11-05**. Version negotiation occurs during initialization.

```json
// Client sends in initialize request
{
  "protocolVersion": "2024-11-05",
  "capabilities": { ... },
  "clientInfo": { "name": "my-client", "version": "1.0.0" }
}

// Server responds
{
  "protocolVersion": "2024-11-05",
  "capabilities": { ... },
  "serverInfo": { "name": "my-server", "version": "1.0.0" }
}
```

---

## JSON-RPC 2.0 Requirements

MCP uses JSON-RPC 2.0 with specific requirements:

### Message Types

| Type | Has `id` | Expects Response |
|------|----------|------------------|
| Request | Yes (string/integer) | Yes |
| Response | Yes (matches request) | N/A |
| Notification | No | No |

### ID Field Requirements

- **MUST NOT** be null for requests
- **MUST** be a string or integer
- **MUST** be unique within a session
- Server echoes the same ID in responses

### Error Codes

| Code | Name | Description |
|------|------|-------------|
| -32700 | Parse error | Invalid JSON |
| -32600 | Invalid Request | Not a valid JSON-RPC request |
| -32601 | Method not found | Unknown method |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Server-side error |

---

## Lifecycle Specification

### Initialize Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

### Initialize Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true },
      "prompts": { "listChanged": true },
      "logging": {}
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    },
    "instructions": "Optional instructions for the client about how to interact with this server."
  }
}
```

### Initialized Notification

After receiving the initialize response, client MUST send:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

The server MUST NOT send requests before receiving this notification.

### Shutdown Procedures

**stdio Transport:**
1. Client closes its stdin to the server
2. Server detects EOF and exits gracefully
3. Client waits for server process to exit
4. If timeout, client MAY forcefully terminate

**HTTP Transport:**
1. Client sends HTTP DELETE with `Mcp-Session-Id` header
2. Server invalidates session
3. Server returns 404 for any subsequent requests with that session ID

---

## Tools Specification

### Tool Definition Schema

```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or coordinates"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "default": "celsius"
      }
    },
    "required": ["location"]
  },
  "annotations": {
    "audience": ["user", "assistant"],
    "priority": 0.8
  }
}
```

### tools/list Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "cursor": "optional-pagination-cursor"
  }
}
```

### tools/list Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get current weather",
        "inputSchema": { ... }
      }
    ],
    "nextCursor": "next-page-cursor-or-null"
  }
}
```

### tools/call Request

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "San Francisco",
      "units": "fahrenheit"
    },
    "_meta": {
      "progressToken": "progress-123"
    }
  }
}
```

### tools/call Response

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy"
      }
    ],
    "isError": false
  }
}
```

### Tool Error vs JSON-RPC Error

- **isError: true** - Tool executed but encountered an expected error (file not found, validation failed)
- **JSON-RPC error** - Protocol-level failure (invalid params, internal error)

```json
// Tool execution error
{
  "result": {
    "content": [{ "type": "text", "text": "File not found: /missing.txt" }],
    "isError": true
  }
}

// Protocol error
{
  "error": {
    "code": -32602,
    "message": "Invalid params: missing required field 'location'"
  }
}
```

---

## Resources Specification

### Resource Types

**Static Resource:**
```json
{
  "uri": "file:///config.json",
  "name": "Configuration",
  "description": "Application configuration file",
  "mimeType": "application/json"
}
```

**Resource Template:**
```json
{
  "uriTemplate": "postgres://{database}/{table}",
  "name": "Database Table",
  "description": "Access database tables",
  "mimeType": "application/json"
}
```

### resources/read Response

**Text Content:**
```json
{
  "result": {
    "contents": [
      {
        "uri": "file:///README.md",
        "mimeType": "text/markdown",
        "text": "# Project\n\nDescription here..."
      }
    ]
  }
}
```

**Binary Content (Blob):**
```json
{
  "result": {
    "contents": [
      {
        "uri": "file:///image.png",
        "mimeType": "image/png",
        "blob": "iVBORw0KGgoAAAANSUhEUgAA..."
      }
    ]
  }
}
```

### Resource Subscriptions

**Subscribe:**
```json
{
  "method": "resources/subscribe",
  "params": { "uri": "file:///config.json" }
}
```

**Update Notification:**
```json
{
  "method": "notifications/resources/updated",
  "params": { "uri": "file:///config.json" }
}
```

**List Changed Notification:**
```json
{
  "method": "notifications/resources/list_changed"
}
```

---

## Prompts Specification

### Prompt Definition

```json
{
  "name": "code_review",
  "description": "Review code for quality and best practices",
  "arguments": [
    {
      "name": "code",
      "description": "The code to review",
      "required": true
    },
    {
      "name": "language",
      "description": "Programming language",
      "required": false
    },
    {
      "name": "focus",
      "description": "Areas to focus on",
      "required": false
    }
  ]
}
```

### prompts/get Response

```json
{
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review the following Python code:\n\ndef hello():\n    print('world')"
        }
      }
    ]
  }
}
```

### Message Content Types

```json
// Text
{ "type": "text", "text": "Hello world" }

// Image
{
  "type": "image",
  "data": "base64-encoded-data",
  "mimeType": "image/png"
}

// Audio
{
  "type": "audio",
  "data": "base64-encoded-data",
  "mimeType": "audio/wav"
}

// Resource reference
{
  "type": "resource",
  "resource": {
    "uri": "file:///data.json",
    "mimeType": "application/json",
    "text": "{...}"
  }
}
```

---

## Sampling Specification

### sampling/createMessage Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Summarize this document..."
        }
      }
    ],
    "modelPreferences": {
      "hints": [
        { "name": "claude-3-sonnet" }
      ],
      "costPriority": 0.3,
      "speedPriority": 0.5,
      "intelligencePriority": 0.8
    },
    "systemPrompt": "You are a helpful assistant.",
    "includeContext": "thisServer",
    "maxTokens": 1000
  }
}
```

### Model Preferences

| Field | Range | Description |
|-------|-------|-------------|
| `costPriority` | 0-1 | Higher = prefer cheaper models |
| `speedPriority` | 0-1 | Higher = prefer faster models |
| `intelligencePriority` | 0-1 | Higher = prefer more capable models |

Clients MAY ignore hints and use any model. The preferences are advisory.

### Include Context Options

- `"none"` - No additional context
- `"thisServer"` - Include context from the requesting server
- `"allServers"` - Include context from all connected servers

### Human-in-the-Loop Requirement

> **IMPORTANT**: Implementations SHOULD always allow users to review and approve sampling requests before they are sent to the LLM. This is a security requirement.

Recommended UI pattern:
1. Show the complete request to the user
2. Allow modification before sending
3. Display the response before returning to server
4. Allow user to reject or modify response

---

## Utilities Specification

### Ping

Either party can send ping to check connection health:

```json
// Request
{ "jsonrpc": "2.0", "id": 1, "method": "ping" }

// Response
{ "jsonrpc": "2.0", "id": 1, "result": {} }
```

Receiver MUST respond promptly. Used for:
- Connection health checks
- Keep-alive in long-running sessions
- Latency measurement

### Cancellation

Cancel a pending request:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": "req-123",
    "reason": "User cancelled"
  }
}
```

Receiver SHOULD:
- Stop processing if possible
- Return partial results or error
- Not block waiting for completion

### Progress

For long-running operations:

```json
// Enable progress in request
{
  "method": "tools/call",
  "params": {
    "name": "process_files",
    "_meta": { "progressToken": "token-456" }
  }
}

// Server sends progress notifications
{
  "method": "notifications/progress",
  "params": {
    "progressToken": "token-456",
    "progress": 50,
    "total": 100,
    "message": "Processing file 50 of 100"
  }
}
```

### Completion (Auto-complete)

For resource templates and prompt arguments:

```json
// Request
{
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/resource",
      "uri": "file:///{path}"
    },
    "argument": {
      "name": "path",
      "value": "src/"
    }
  }
}

// Response
{
  "result": {
    "completion": {
      "values": ["src/index.ts", "src/utils/"],
      "total": 15,
      "hasMore": true
    }
  }
}
```

### Logging

Server to client log messages:

```json
{
  "method": "notifications/message",
  "params": {
    "level": "warning",
    "logger": "database",
    "data": "Connection pool exhausted, waiting for available connection"
  }
}
```

**Log Levels** (syslog severity):
1. `debug` - Detailed debug information
2. `info` - Informational messages
3. `notice` - Normal but significant
4. `warning` - Warning conditions
5. `error` - Error conditions
6. `critical` - Critical conditions
7. `alert` - Action must be taken immediately
8. `emergency` - System is unusable

Client can set minimum level:
```json
{
  "method": "logging/setLevel",
  "params": { "level": "warning" }
}
```

---

## Capability Reference

### Server Capabilities

| Capability | Fields | Description |
|------------|--------|-------------|
| `tools` | `listChanged?: boolean` | Server provides tools |
| `resources` | `subscribe?: boolean`, `listChanged?: boolean` | Server provides resources |
| `prompts` | `listChanged?: boolean` | Server provides prompts |
| `logging` | `{}` | Server sends log messages |

### Client Capabilities

| Capability | Fields | Description |
|------------|--------|-------------|
| `sampling` | `{}` | Client supports LLM sampling |
| `roots` | `listChanged?: boolean` | Client provides filesystem roots |

### listChanged Flag

When `listChanged: true`:
- Server MAY send `notifications/tools/list_changed`
- Client SHOULD re-fetch the list when notified
- Enables dynamic capability updates

---

## Transport Specifications

### stdio Transport

**Message Format:**
- JSON-RPC messages separated by newlines
- Messages MUST NOT contain embedded newlines
- Use stdout for JSON-RPC messages only
- Use stderr for debug logging only

**Connection:**
- Client spawns server as subprocess
- Client writes to server's stdin
- Client reads from server's stdout
- Client MAY read stderr for debugging

### Streamable HTTP Transport

**Endpoints:**
- `POST /mcp` - Send messages
- `GET /mcp` - SSE stream (optional)
- `DELETE /mcp` - Close session

**Headers:**
- `Content-Type: application/json`
- `Accept: application/json, text/event-stream`
- `Mcp-Protocol-Version: 2024-11-05`
- `Mcp-Session-Id: <session-id>` (after initialization)

**Security:**
- Validate `Origin` header to prevent DNS rebinding
- Local servers MUST bind to localhost only
- Remote servers MUST use HTTPS
- Use secure session IDs (UUID, cryptographic tokens)

---

## References

- [MCP Specification](https://modelcontextprotocol.io/specification)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
- [RFC 6570 URI Templates](https://tools.ietf.org/html/rfc6570)
- [Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
