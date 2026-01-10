# Agent Client Protocol SDK Examples

## TypeScript SDK

### Installation

```bash
npm install @agentclientprotocol/sdk
```

### Building an Agent

```typescript
import { AgentSideConnection } from '@agentclientprotocol/sdk';
import { v4 as uuid } from 'uuid';

class MyAgent {
  private connection: AgentSideConnection;
  private sessions: Map<string, SessionState> = new Map();

  constructor() {
    this.connection = new AgentSideConnection();
    this.setupHandlers();
  }

  private setupHandlers() {
    // Initialize handler
    this.connection.on('initialize', async (params) => {
      console.log('Client connected:', params.clientInfo?.name);

      return {
        protocolVersion: '1.0.0',
        serverInfo: {
          name: 'MyAgent',
          version: '1.0.0'
        },
        capabilities: {
          modes: {
            currentModeId: 'code',
            availableModes: [
              {
                id: 'ask',
                name: 'Ask Mode',
                description: 'Request permission before changes'
              },
              {
                id: 'code',
                name: 'Code Mode',
                description: 'Full access to modify code'
              }
            ]
          },
          prompt: {
            text: true,
            image: true,
            embeddedContext: true
          }
        }
      };
    });

    // Authentication handler
    this.connection.on('authenticate', async (params) => {
      // Validate API key or token
      if (params.token) {
        const valid = await this.validateToken(params.token);
        if (!valid) {
          throw new Error('Invalid authentication token');
        }
      }
      return { success: true };
    });

    // New session handler
    this.connection.on('session/new', async (params) => {
      const sessionId = uuid();

      this.sessions.set(sessionId, {
        id: sessionId,
        mode: 'code',
        history: []
      });

      return {
        sessionId,
        modes: {
          currentModeId: 'code',
          availableModes: [
            { id: 'ask', name: 'Ask Mode' },
            { id: 'code', name: 'Code Mode' }
          ]
        }
      };
    });

    // Prompt handler
    this.connection.on('session/prompt', async (params) => {
      const { sessionId, prompt } = params;
      const session = this.sessions.get(sessionId);

      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      // Extract text from prompt content
      const userMessage = prompt.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n');

      // Stream thinking indicator
      this.streamUpdate(sessionId, {
        type: 'text_delta',
        delta: 'Analyzing your request...\n'
      });

      // Process with your LLM (example with OpenAI)
      const response = await this.processWithLLM(userMessage, session);

      // Stream the response
      for await (const chunk of response) {
        this.streamUpdate(sessionId, {
          type: 'text_delta',
          delta: chunk
        });
      }

      return {
        stopReason: 'endTurn',
        content: [{ type: 'text', text: response.fullText }]
      };
    });

    // Cancel handler
    this.connection.on('session/cancel', async (params) => {
      const { sessionId } = params;
      console.log(`Cancelling session: ${sessionId}`);
      // Implement cancellation logic
    });
  }

  private streamUpdate(sessionId: string, update: any) {
    this.connection.notify('session/update', {
      sessionId,
      update
    });
  }

  private async validateToken(token: string): Promise<boolean> {
    // Implement your token validation
    return token.length > 0;
  }

  private async processWithLLM(message: string, session: SessionState) {
    // Implement your LLM integration
    // This is a placeholder
    return {
      [Symbol.asyncIterator]: async function* () {
        yield 'Hello! ';
        yield 'I am processing your request...\n';
        yield 'Done!';
      },
      fullText: 'Hello! I am processing your request...\nDone!'
    };
  }

  start() {
    this.connection.listen();
    console.log('Agent started, listening on stdio');
  }
}

interface SessionState {
  id: string;
  mode: string;
  history: any[];
}

// Start the agent
const agent = new MyAgent();
agent.start();
```

### Building a Client

```typescript
import { ClientSideConnection } from '@agentclientprotocol/sdk';
import { spawn } from 'child_process';

class MyClient {
  private connection: ClientSideConnection;

  constructor() {
    this.connection = new ClientSideConnection();
    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle permission requests from agent
    this.connection.on('session/request_permission', async (params) => {
      const { toolCallId, options } = params;

      // Display permission dialog to user
      console.log('Permission requested:', params.message);
      console.log('Options:', options.map(o => o.label).join(', '));

      // For demo, auto-approve (replace with actual UI)
      return {
        action: 'allow',
        toolCallId
      };
    });

    // Handle session updates (streaming)
    this.connection.on('session/update', (params) => {
      const { update } = params;

      switch (update.type) {
        case 'text_delta':
          process.stdout.write(update.delta);
          break;
        case 'tool_call':
          console.log(`\n[Tool: ${update.title}] Status: ${update.status}`);
          break;
        case 'tool_call_update':
          console.log(`[Tool Update] Status: ${update.status}`);
          break;
      }
    });
  }

  async connectToAgent(command: string, args: string[]) {
    // Spawn agent as subprocess
    const agentProcess = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    // Connect via stdio
    await this.connection.connect(agentProcess.stdin, agentProcess.stdout);

    // Initialize
    const initResult = await this.connection.request('initialize', {
      clientInfo: {
        name: 'MyClient',
        version: '1.0.0'
      },
      capabilities: {
        fs: {
          readTextFile: true,
          writeTextFile: true
        }
      }
    });

    console.log('Connected to agent:', initResult.serverInfo?.name);
    return initResult;
  }

  async createSession(): Promise<string> {
    const result = await this.connection.request('session/new', {});
    return result.sessionId;
  }

  async sendPrompt(sessionId: string, text: string) {
    const result = await this.connection.request('session/prompt', {
      sessionId,
      prompt: {
        content: [{ type: 'text', text }]
      }
    });

    return result;
  }

  async readFile(sessionId: string, path: string) {
    // Called by agent via fs/read_text_file
    // Client implementation would read from actual filesystem
  }
}

// Usage
async function main() {
  const client = new MyClient();

  // Connect to an ACP agent
  await client.connectToAgent('npx', ['my-acp-agent']);

  // Create session
  const sessionId = await client.createSession();

  // Send prompt
  const response = await client.sendPrompt(
    sessionId,
    'Help me refactor this function to use async/await'
  );

  console.log('\nFinal response:', response);
}

main().catch(console.error);
```

---

## Python SDK

### Installation

```bash
pip install agent-client-protocol
```

### Building an Agent

```python
import asyncio
import uuid
from agent_client_protocol import (
    AgentConnection,
    InitializeResult,
    SessionNewResult,
    PromptResult,
    ContentBlock,
    TextContent,
    SessionUpdate,
    TextDeltaUpdate
)

class MyAgent:
    def __init__(self):
        self.connection = AgentConnection()
        self.sessions: dict[str, dict] = {}
        self._setup_handlers()

    def _setup_handlers(self):
        @self.connection.handler("initialize")
        async def handle_initialize(params):
            print(f"Client connected: {params.get('clientInfo', {}).get('name')}")

            return InitializeResult(
                protocolVersion="1.0.0",
                serverInfo={
                    "name": "MyPythonAgent",
                    "version": "1.0.0"
                },
                capabilities={
                    "modes": {
                        "currentModeId": "code",
                        "availableModes": [
                            {"id": "ask", "name": "Ask Mode"},
                            {"id": "code", "name": "Code Mode"}
                        ]
                    },
                    "prompt": {
                        "text": True,
                        "image": True
                    }
                }
            )

        @self.connection.handler("authenticate")
        async def handle_authenticate(params):
            token = params.get("token")
            if token and await self._validate_token(token):
                return {"success": True}
            raise ValueError("Invalid authentication")

        @self.connection.handler("session/new")
        async def handle_session_new(params):
            session_id = str(uuid.uuid4())

            self.sessions[session_id] = {
                "id": session_id,
                "mode": "code",
                "history": []
            }

            return SessionNewResult(
                sessionId=session_id,
                modes={
                    "currentModeId": "code",
                    "availableModes": [
                        {"id": "ask", "name": "Ask Mode"},
                        {"id": "code", "name": "Code Mode"}
                    ]
                }
            )

        @self.connection.handler("session/prompt")
        async def handle_prompt(params):
            session_id = params["sessionId"]
            prompt = params["prompt"]

            session = self.sessions.get(session_id)
            if not session:
                raise ValueError(f"Session not found: {session_id}")

            # Extract user message
            user_message = ""
            for content in prompt.get("content", []):
                if content.get("type") == "text":
                    user_message += content.get("text", "")

            # Stream thinking
            await self._stream_update(session_id, TextDeltaUpdate(
                delta="Processing your request...\n"
            ))

            # Process with LLM
            response = await self._process_with_llm(user_message, session)

            # Stream response chunks
            async for chunk in response:
                await self._stream_update(session_id, TextDeltaUpdate(
                    delta=chunk
                ))

            return PromptResult(
                stopReason="endTurn",
                content=[TextContent(text=response.full_text)]
            )

        @self.connection.handler("session/cancel")
        async def handle_cancel(params):
            session_id = params["sessionId"]
            print(f"Cancelling session: {session_id}")
            # Implement cancellation

    async def _stream_update(self, session_id: str, update):
        await self.connection.notify("session/update", {
            "sessionId": session_id,
            "update": update.dict()
        })

    async def _validate_token(self, token: str) -> bool:
        return len(token) > 0

    async def _process_with_llm(self, message: str, session: dict):
        # Implement your LLM integration
        class Response:
            def __init__(self):
                self.full_text = "Hello! I processed your request."

            async def __aiter__(self):
                yield "Hello! "
                yield "I processed "
                yield "your request."

        return Response()

    async def start(self):
        print("Agent starting...")
        await self.connection.listen()


async def main():
    agent = MyAgent()
    await agent.start()


if __name__ == "__main__":
    asyncio.run(main())
```

### Building a Client

```python
import asyncio
import subprocess
from agent_client_protocol import ClientConnection

class MyClient:
    def __init__(self):
        self.connection = ClientConnection()
        self._setup_handlers()

    def _setup_handlers(self):
        @self.connection.handler("session/request_permission")
        async def handle_permission(params):
            tool_call_id = params["toolCallId"]
            options = params.get("options", [])

            print(f"Permission requested: {params.get('message')}")
            print(f"Options: {[o['label'] for o in options]}")

            # Auto-approve for demo
            return {
                "action": "allow",
                "toolCallId": tool_call_id
            }

        @self.connection.on_notification("session/update")
        def handle_update(params):
            update = params.get("update", {})
            update_type = update.get("type")

            if update_type == "text_delta":
                print(update.get("delta", ""), end="", flush=True)
            elif update_type == "tool_call":
                print(f"\n[Tool: {update.get('title')}] {update.get('status')}")

    async def connect_to_agent(self, command: str, args: list[str]):
        # Spawn agent subprocess
        process = subprocess.Popen(
            [command] + args,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=None
        )

        # Connect
        await self.connection.connect(process.stdin, process.stdout)

        # Initialize
        result = await self.connection.request("initialize", {
            "clientInfo": {
                "name": "MyPythonClient",
                "version": "1.0.0"
            },
            "capabilities": {
                "fs": {
                    "readTextFile": True,
                    "writeTextFile": True
                }
            }
        })

        print(f"Connected to: {result.get('serverInfo', {}).get('name')}")
        return result

    async def create_session(self) -> str:
        result = await self.connection.request("session/new", {})
        return result["sessionId"]

    async def send_prompt(self, session_id: str, text: str):
        result = await self.connection.request("session/prompt", {
            "sessionId": session_id,
            "prompt": {
                "content": [{"type": "text", "text": text}]
            }
        })
        return result


async def main():
    client = MyClient()

    await client.connect_to_agent("python", ["my_agent.py"])

    session_id = await client.create_session()

    response = await client.send_prompt(
        session_id,
        "Help me write a Python function to parse JSON"
    )

    print(f"\nResponse: {response}")


if __name__ == "__main__":
    asyncio.run(main())
```

---

## Tool Call Implementation

### Agent-Side Tool Execution

```typescript
// TypeScript agent handling tool calls
async function executeToolCall(
  connection: AgentSideConnection,
  sessionId: string,
  tool: { name: string; args: any }
) {
  const toolCallId = uuid();

  // Report tool call started
  connection.notify('session/update', {
    sessionId,
    update: {
      type: 'tool_call',
      toolCallId,
      title: `Executing ${tool.name}`,
      kind: getToolKind(tool.name),
      status: 'pending'
    }
  });

  // Request permission if needed
  if (requiresPermission(tool.name)) {
    const permission = await connection.request('session/request_permission', {
      sessionId,
      toolCallId,
      message: `Allow ${tool.name}?`,
      options: [
        { label: 'Allow', action: 'allow' },
        { label: 'Deny', action: 'deny' }
      ]
    });

    if (permission.action === 'deny') {
      connection.notify('session/update', {
        sessionId,
        update: {
          type: 'tool_call_update',
          toolCallId,
          status: 'failed',
          error: 'Permission denied by user'
        }
      });
      return { error: 'Permission denied' };
    }
  }

  // Update status to in_progress
  connection.notify('session/update', {
    sessionId,
    update: {
      type: 'tool_call_update',
      toolCallId,
      status: 'in_progress'
    }
  });

  try {
    // Execute the tool
    const result = await tools[tool.name](tool.args);

    // Report completion
    connection.notify('session/update', {
      sessionId,
      update: {
        type: 'tool_call_update',
        toolCallId,
        status: 'completed',
        content: [{ type: 'text', text: JSON.stringify(result) }]
      }
    });

    return result;
  } catch (error) {
    // Report failure
    connection.notify('session/update', {
      sessionId,
      update: {
        type: 'tool_call_update',
        toolCallId,
        status: 'failed',
        error: error.message
      }
    });

    throw error;
  }
}

function getToolKind(toolName: string): string {
  const kindMap: Record<string, string> = {
    'read_file': 'read',
    'write_file': 'edit',
    'delete_file': 'delete',
    'search': 'search',
    'execute_command': 'execute',
    'fetch_url': 'fetch'
  };
  return kindMap[toolName] || 'other';
}

function requiresPermission(toolName: string): boolean {
  const destructiveTools = ['write_file', 'delete_file', 'execute_command'];
  return destructiveTools.includes(toolName);
}
```

---

## File Operations

### Reading Files from Client

```typescript
// Agent requesting file read
async function readFile(
  connection: AgentSideConnection,
  sessionId: string,
  path: string
): Promise<string> {
  const result = await connection.request('fs/read_text_file', {
    sessionId,
    path,
    line: 1,    // Optional: start line (1-based)
    limit: 1000 // Optional: max lines
  });

  return result.content;
}
```

### Writing Files to Client

```typescript
// Agent writing file
async function writeFile(
  connection: AgentSideConnection,
  sessionId: string,
  path: string,
  content: string
): Promise<void> {
  await connection.request('fs/write_text_file', {
    sessionId,
    path,
    content
  });
}
```

### Client-Side File Handler

```typescript
// Client implementing file operations
connection.on('fs/read_text_file', async (params) => {
  const { path, line = 1, limit } = params;

  // Validate path (security!)
  if (!isValidPath(path)) {
    throw new Error('Invalid file path');
  }

  const content = await fs.readFile(path, 'utf-8');
  const lines = content.split('\n');

  // Apply line/limit filters
  const startIndex = line - 1;
  const endIndex = limit ? startIndex + limit : undefined;
  const selectedLines = lines.slice(startIndex, endIndex);

  return {
    content: selectedLines.join('\n')
  };
});

connection.on('fs/write_text_file', async (params) => {
  const { path, content } = params;

  // Validate path
  if (!isValidPath(path)) {
    throw new Error('Invalid file path');
  }

  // Create directories if needed
  await fs.mkdir(dirname(path), { recursive: true });

  // Write file
  await fs.writeFile(path, content, 'utf-8');

  return null;
});
```

---

## Resources

- **TypeScript SDK**: https://github.com/agentclientprotocol/typescript-sdk
- **Python SDK**: https://github.com/agentclientprotocol/python-sdk
- **TypeScript API Reference**: https://agentclientprotocol.github.io/typescript-sdk
- **Python API Reference**: https://agentclientprotocol.github.io/python-sdk
- **Gemini CLI Example**: https://github.com/google-gemini/gemini-cli
