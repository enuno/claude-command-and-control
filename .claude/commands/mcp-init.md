# /mcp-init - Initialize Braiins OS MCP Server

**Version**: 1.0.0 (Braiins OS Edition)
**Category**: Core MCP Development
**Paradigm**: Skills-First (Single Agent)
**Project**: braiins-os-mcp-server
**Last Updated**: December 29, 2025

---

## Purpose

Initialize or enhance the Braiins OS MCP server project with proper structure, dependencies, and configuration. This command sets up the foundation for building high-quality MCP tools that enable AI agents to manage Braiins OS ASIC miners for Bitcoin mining operations.

---

## When to Use

- Adding new MCP tools to the Braiins OS server
- Setting up development environment for new contributors
- Initializing new feature branches with proper structure
- Need to verify project dependencies and structure

---

## Usage

```bash
/mcp-init
```

**Project Defaults**:
- Language: TypeScript (Node.js 20.x LTS)
- Server name: braiins-os-mcp-server
- Service: Braiins OS API (gRPC + REST)
- Dependencies: @modelcontextprotocol/sdk, @grpc/grpc-js, zod, redis

---

## Workflow (Skills-First Approach)

### Phase 1: Skill Loading & Context Gathering

**Agent loads**: `mcp-builder` skill dynamically

1. **Load Braiins OS Context**:
   - Project uses TypeScript + Node.js 20.x
   - Integrates with Braiins OS API via gRPC
   - Redis for caching fleet operations
   - API Documentation: https://github.com/braiins/bos-plus-api

2. **Load MCP Builder Skill**:
   ```
   Use Skill tool to load: mcp-builder
   ```

3. **Verify Project Structure**:
   - Check if src/mcp/, src/api/grpc/, src/cache/ exist
   - Verify package.json dependencies
   - Check .env.example configuration

### Phase 2: Project Structure Creation

**Braiins OS MCP Server Structure**:
```
braiins-os-mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── server.ts             # Transport setup (STDIO/HTTP)
│   ├── mcp/
│   │   ├── tools/           # MCP tools (authenticate, list_miners, etc.)
│   │   ├── resources/       # MCP resources (fleet_summary, miner_logs)
│   │   └── prompts/         # MCP prompts (troubleshoot_offline)
│   ├── api/
│   │   ├── grpc/           # gRPC client implementation
│   │   │   ├── client.ts   # gRPC client
│   │   │   ├── pool.ts     # Connection pooling
│   │   │   └── retry.ts    # Retry logic
│   │   └── rest/           # REST API endpoints
│   ├── cache/
│   │   └── redis.ts        # Redis caching layer
│   ├── models/             # Data models (TypeScript interfaces)
│   └── utils/              # Utility functions
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── evaluations/        # MCP evaluation harness
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── .env.example            # Environment variables template
├── README.md               # Documentation
├── CLAUDE.md               # Claude-specific instructions
└── DEVELOPMENT_PLAN.md     # Implementation roadmap
```

**For Python**:
```
project-name/
├── src/
│   ├── __init__.py
│   ├── server.py            # MCP server entry point
│   ├── tools/               # MCP tools
│   ├── resources/           # MCP resources
│   ├── prompts/             # MCP prompts
│   └── utils/               # Helper functions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── evaluations/         # MCP evaluation harness
├── pyproject.toml           # Dependencies
├── requirements.txt         # Dependencies list
├── .env.example            # Environment variables template
├── README.md               # Documentation
└── DEVELOPMENT.md          # MCP development guide
```

### Phase 3: Dependencies Installation

**Braiins OS MCP Server Dependencies**:
```json
{
  "name": "braiins-os-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "@grpc/grpc-js": "^1.9.0",
    "@grpc/proto-loader": "^0.7.0",
    "zod": "^3.22.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0"
  }
}
```

**Python**:
```toml
[project]
name = "mcp-server-name"
version = "1.0.0"
dependencies = [
    "mcp>=1.0.0",
    "pydantic>=2.0.0",
    "httpx>=0.27.0"
]
```

### Phase 4: Basic Server Implementation

**Create minimal working server**:

**TypeScript**:
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new Server(
  {
    name: "mcp-server-name",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    },
  }
);

// Example tool
server.setRequestHandler("tools/call", async (request) => {
  // Tool implementation
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**Python**:
```python
from mcp.server import Server, stdio_server
from pydantic import BaseModel

server = Server("mcp-server-name")

@server.tool()
async def example_tool() -> str:
    """Example MCP tool"""
    return "Hello from MCP server!"

if __name__ == "__main__":
    stdio_server(server)
```

### Phase 5: Documentation & Configuration

1. **Create README.md**:
   - Project overview
   - Installation instructions
   - Usage examples
   - Available tools/resources/prompts

2. **Create DEVELOPMENT.md**:
   - Link to mcp-builder skill guidelines
   - Phase-by-phase development workflow
   - Best practices checklist
   - Evaluation creation guide

3. **Create .env.example**:
   ```
   # Redis Configuration
   REDIS_URL=redis://localhost:6379

   # gRPC Configuration
   GRPC_TIMEOUT_MS=30000
   MAX_GRPC_CONNECTIONS=100

   # Server Configuration
   NODE_ENV=development
   LOG_LEVEL=info

   # Braiins OS API (if using REST fallback)
   BRAIINS_API_BASE_URL=https://api.braiins.com
   BRAIINS_API_KEY=your_api_key_here
   ```

### Phase 6: Validation & Next Steps

1. **Build Project**:
   ```bash
   # TypeScript
   npm run build

   # Python
   pip install -e .
   ```

2. **Verify Structure**:
   - All directories created
   - Dependencies installed
   - Basic server runs without errors

3. **Output Next Steps**:
   ```markdown
   ✅ MCP server project initialized successfully!

   **Next Steps**:
   1. Review DEVELOPMENT.md for MCP development guidelines
   2. Use /mcp-tool-create to add your first tool
   3. Use /mcp-resource-create to add resources
   4. Use /mcp-evaluation-create to set up testing

   **Quick Start**:
   - TypeScript: `npm run dev`
   - Python: `python src/server.py`

   **Documentation**:
   - MCP Builder Skill: See mcp-builder skill for comprehensive guide
   - MCP Protocol: https://modelcontextprotocol.io/llms-full.txt
   ```

---

## Skills Used

- **Primary**: `mcp-builder` (loaded dynamically)
- **Secondary**: `skill-creator` (for project structure)

---

## Example Output

```
Initializing Braiins OS MCP Server
Language: TypeScript (Node.js 20.x)
Service: Braiins OS API (gRPC + REST)

✓ Verified project structure (src/mcp/, src/api/grpc/, src/cache/)
✓ Checked dependencies (@modelcontextprotocol/sdk, @grpc/grpc-js, redis)
✓ Verified server implementation (index.ts, server.ts)
✓ Checked documentation (README.md, CLAUDE.md, DEVELOPMENT_PLAN.md)
✓ Verified .env.example template

Current MCP Tools:
  • authenticate - API key authentication
  • list_miners - List all miners in fleet
  • get_miner_status - Real-time miner status
  • update_pool_config - Update mining pool settings
  • update_firmware - Firmware update with progress tracking

Next: Use /mcp-server-build to continue development
```

---

## Error Handling

**Common Errors**:

1. **Directory already exists**:
   - **Error**: `Project directory already exists`
   - **Solution**: Choose different name or remove existing directory

2. **npm/pip not installed**:
   - **Error**: `Command not found: npm`
   - **Solution**: Install Node.js or Python first

3. **Network errors during install**:
   - **Error**: `Failed to fetch package`
   - **Solution**: Check internet connection, try again

---

## Permissions Required

```yaml
allowed-tools:
  - Read        # Check existing files
  - Write       # Create project files
  - Edit        # Modify configuration
  - Bash        # Run npm/pip commands
  - Skill       # Load mcp-builder skill
```

---

## Version History

- **1.0.0** (2025-12-29): Initial release with skills-first approach

---

## Related Commands

- `/mcp-tool-create` - Create new MCP tool
- `/mcp-resource-create` - Create new MCP resource
- `/mcp-evaluation-create` - Set up evaluation harness
- `/mcp-server-build` - Full server development workflow

---

## References

- MCP Builder Skill: `docs/claude/skills-templates/mcp-builder/SKILL.md`
- MCP Protocol Spec: https://modelcontextprotocol.io/llms-full.txt
- TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Python SDK: https://github.com/modelcontextprotocol/python-sdk
