# /mcp-init - Initialize MCP Server Project

**Version**: 1.0.0
**Category**: Core MCP Development
**Paradigm**: Skills-First (Single Agent)
**Last Updated**: December 29, 2025

---

## Purpose

Initialize a new Model Context Protocol (MCP) server project with proper structure, dependencies, and configuration. This command sets up the foundation for building high-quality MCP servers that enable AI agents to interact with external services.

---

## When to Use

- Starting a new MCP server project from scratch
- Need proper TypeScript/Node.js or Python project structure
- Want to follow MCP best practices from the beginning
- Setting up development environment for MCP server development

---

## Usage

```bash
/mcp-init
```

**Optional Parameters**:
- Language: TypeScript (default) or Python
- Server name: Name of the MCP server
- Service: External service to integrate (optional)

---

## Workflow (Skills-First Approach)

### Phase 1: Skill Loading & Context Gathering

**Agent loads**: `mcp-builder` skill dynamically

1. **Ask User Questions**:
   - "What language do you prefer? (TypeScript/Python)"
   - "What is the name of your MCP server?"
   - "Which external service are you integrating? (Optional)"
   - "Do you have API documentation URL?"

2. **Load MCP Builder Skill**:
   ```
   Use Skill tool to load: mcp-builder
   ```

3. **Gather Context** (if service specified):
   - API documentation
   - Authentication requirements
   - Available endpoints

### Phase 2: Project Structure Creation

**For TypeScript**:
```
project-name/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # MCP tools
│   ├── resources/            # MCP resources
│   ├── prompts/              # MCP prompts
│   └── utils/                # Helper functions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── evaluations/          # MCP evaluation harness
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── .env.example              # Environment variables template
├── README.md                 # Documentation
└── DEVELOPMENT.md            # MCP development guide
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

**TypeScript**:
```json
{
  "name": "mcp-server-name",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
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
   # API Configuration
   API_BASE_URL=https://api.example.com
   API_KEY=your_api_key_here

   # Server Configuration
   PORT=3000
   LOG_LEVEL=info
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
Initializing MCP Server: braiins-os-mcp-server
Language: TypeScript
Service: Braiins OS API

✓ Created project structure
✓ Installed dependencies (@modelcontextprotocol/sdk, zod)
✓ Created basic server implementation
✓ Generated README.md and DEVELOPMENT.md
✓ Created .env.example template

Next: Use /mcp-tool-create to add your first MCP tool
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
