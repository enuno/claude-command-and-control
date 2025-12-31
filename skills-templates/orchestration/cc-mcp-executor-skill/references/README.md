# Code Executor Skill for Claude Code

A comprehensive Claude Code skill that enables efficient multi-tool MCP workflows by launching subagents that write and execute code, reducing token overhead by up to 98%.

## Overview

This skill teaches Claude Code how to handle complex MCP workflows efficiently using a **subagent architecture**. Instead of loading all MCP tool schemas into the main context (causing token bloat), Claude Code launches a subagent that writes TypeScript or Python code to compose multiple MCP tool calls.

### Key Benefits

- **98% Token Reduction**: Main context has NO MCP servers → no token bloat (1.6k vs 141k tokens)
- **Multi-Tool Composition**: Combine multiple MCP operations in single code execution
- **Complex Logic**: Loops, conditionals, data transformations, retry logic
- **Parallel Execution**: Fetch from multiple sources simultaneously
- **Cached Patterns**: 12 proven script examples (6 TypeScript + 6 Python)
- **Progressive Disclosure**: Load MCP tools only in subagent context

## Architecture

```
Main Claude Code (NO MCP servers configured)
    ↓
    Recognizes multi-tool MCP workflow
    ↓
    Launches subagent via Task tool
    ↓
Subagent (HAS MCP servers configured)
    ↓
    Writes TypeScript/Python code
    ↓
    Executes via Bash (deno run / python)
    ↓
    Code imports local MCP client library
    ↓
    MCP client calls tools via MCP protocol
    ↓
    Returns results to main context
```

**Why this works:**
- Main context stays clean (no MCP schemas loaded)
- Subagent context is isolated and disposable
- Code execution allows complex multi-tool composition
- Results summarized and returned to main

## Prerequisites

### Required

1. **Claude Code** (terminal or web version)
   - Get it: https://docs.claude.com/en/docs/claude-code

2. **Deno** (for TypeScript execution)
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

3. **Python 3.8+** (for Python execution)
   ```bash
   python3 --version  # Should be 3.8 or higher
   ```

4. **MCP Servers** you want to use
   - Filesystem: `@modelcontextprotocol/server-filesystem`
   - PostgreSQL: `mcp-server-postgres`
   - SQLite: `mcp-server-sqlite`
   - GitHub: `mcp-server-github`
   - Or your custom MCP servers

### NOT Required

- ❌ code-executor-MCP server (we implement MCP client locally)
- ❌ MCP servers in main Claude Code configuration (keeps context clean)

## Installation

### Step 1: Install the Skill

```bash
# Clone this repository
git clone https://github.com/mcfearsome/cc-mcp-executor-skill.git

# Install for main Claude Code instance (global)
cp -r cc-mcp-executor-skill/code-executor ~/.claude/skills/

# OR install for specific project (local)
mkdir -p .claude/skills
cp -r cc-mcp-executor-skill/code-executor .claude/skills/
```

### Step 2: Configure Subagent MCP Servers

Create `~/.claude/subagent-mcp.json` (or project-specific `.claude/subagent-mcp.json`):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp", "/home/user/projects"]
    },
    "postgres": {
      "command": "mcp-server-postgres",
      "args": ["--connection", "postgresql://localhost/mydb"]
    },
    "github": {
      "command": "mcp-server-github",
      "args": ["--token-file", "/home/user/.github-token"]
    }
  }
}
```

### Step 3: Understand MCP Client Configuration

The MCP client library reads configuration from `~/.mcp.json` or `MCP_CONFIG_PATH` env var.

**CRITICAL: Do NOT symlink or globally export MCP_CONFIG_PATH**

Why? If you symlink `~/.claude/subagent-mcp.json` to `~/.mcp.json`, or globally export `MCP_CONFIG_PATH`, then **main Claude Code will load all MCP servers**, defeating the entire purpose (98% token reduction).

**Correct approach:**

The subagent sets `MCP_CONFIG_PATH` temporarily in the Bash execution command:

```bash
MCP_CONFIG_PATH=~/.claude/subagent-mcp.json deno run --allow-read --allow-run --allow-env script.ts
```

This way:
- ✅ Main Claude Code has NO MCP servers loaded (keeps context clean)
- ✅ Subagent execution sets `MCP_CONFIG_PATH` temporarily
- ✅ MCP client reads from subagent config only during code execution
- ✅ Token overhead isolated to subagent context

**No action needed in this step** - the subagent handles setting `MCP_CONFIG_PATH` automatically when executing code.

### Step 4: Verify Installation

```bash
# Check skill is installed
ls -la ~/.claude/skills/code-executor/

# You should see:
# - SKILL.md (main skill file)
# - SUBAGENT_SETUP.md (configuration guide)
# - lib/ (MCP client libraries)
# - scripts/ (cached patterns)
# - templates/ (starting points)
```

## Quick Start

### Example 1: Simple File Processing

**User Request:**
```
"Read all JSON files in /tmp/data and count total records"
```

**Claude Code (main):**
Recognizes multi-tool workflow → launches subagent

**Subagent:**
- Writes code using `scripts/typescript/file-processing.ts` pattern
- Lists files via `mcp__filesystem__listDirectory`
- Reads each JSON file via `mcp__filesystem__readFile`
- Counts records
- Returns: "Processed 15 files, 1,247 total records"

### Example 2: Multi-Source Data Aggregation

**User Request:**
```
"Fetch users from database, enrich with GitHub profile data, store results"
```

**Claude Code (main):**
Recognizes multi-tool workflow → launches subagent

**Subagent:**
- Uses `scripts/typescript/data-aggregation.ts` pattern
- Fetches users via `mcp__database__query`
- Enriches in parallel via `mcp__github__getUser`
- Stores via `mcp__database__insert`
- Returns: "Enriched 234 users, stored successfully"

### Example 3: Error Recovery

**User Request:**
```
"Fetch data from primary API, fallback to secondary if it fails"
```

**Claude Code (main):**
Recognizes error recovery pattern → launches subagent

**Subagent:**
- Uses `scripts/typescript/error-recovery.ts` pattern
- Tries primary API with retries
- Falls back to secondary on failure
- Returns: "Retrieved from secondary API after primary timeout"

## Skill Structure

```
code-executor/
├── SKILL.md                    # Main skill file (Claude Code reads this)
├── SUBAGENT_SETUP.md           # Configuration guide
├── TYPESCRIPT_GUIDE.md         # TypeScript patterns reference
├── PYTHON_GUIDE.md             # Python patterns reference
├── EXAMPLES.md                 # Complete real-world examples
├── REFERENCE.md                # MCP client API reference
├── lib/                        # MCP client libraries
│   ├── mcp-client.ts           # TypeScript/Deno MCP client
│   └── mcp_client.py           # Python MCP client
├── scripts/                    # Cached executable patterns
│   ├── typescript/
│   │   ├── multi-tool-workflow.ts      # Sequential pipeline
│   │   ├── parallel-execution.ts       # Concurrent operations
│   │   ├── error-recovery.ts           # Retry logic
│   │   ├── file-processing.ts          # Batch file ops
│   │   ├── conditional-logic.ts        # Dynamic tool selection
│   │   └── data-aggregation.ts         # Multi-source merging
│   └── python/
│       ├── multi_tool_workflow.py
│       ├── parallel_execution.py
│       ├── error_recovery.py
│       ├── file_processing.py
│       ├── conditional_logic.py
│       └── data_aggregation.py
└── templates/                  # Minimal starting points
    ├── basic-typescript.template.ts
    ├── basic-python.template.py
    ├── multi-tool.template.ts
    └── multi-tool.template.py
```

## How It Works

### 1. Main Claude Code (YOU)

When you encounter a multi-tool MCP workflow:

1. ✅ Recognize pattern (3+ MCP tools, complex logic, etc.)
2. ✅ Launch subagent via Task tool
3. ✅ Provide clear instructions referencing cached scripts
4. ✅ Specify which MCP tools are available
5. ✅ Define expected output
6. ✅ Receive and report results

**You DON'T:**
- ❌ Have MCP servers configured (keeps context clean)
- ❌ Load MCP tool schemas (no token bloat)
- ❌ Write the code yourself (subagent does it)

### 2. Subagent Execution

The subagent:

1. Reads referenced cached script pattern
2. Writes adapted TypeScript/Python code
3. Imports MCP client library
4. Executes code via Bash
5. Code calls multiple MCP tools as needed
6. Returns summary to main context

### 3. MCP Client Library

Local implementation of MCP protocol client:

**TypeScript (`lib/mcp-client.ts`)**:
```typescript
import { callMCPTool } from '../../lib/mcp-client.ts';

const result = await callMCPTool('mcp__filesystem__readFile', {
  path: '/data/file.json'
});
```

**Python (`lib/mcp_client.py`)**:
```python
from lib.mcp_client import call_mcp_tool

result = await call_mcp_tool('mcp__filesystem__readFile', {
    'path': '/data/file.json'
})
```

## When to Use This Skill

### ✅ Use When:

1. **Multi-tool MCP workflows** (3+ tool calls needed)
   - "List files, read each, aggregate data, store in database"

2. **Complex data processing**
   - "Fetch from DB, enrich with API, filter, deduplicate, store"

3. **Conditional tool selection**
   - "Try primary API, fallback to secondary, then cache"

4. **Parallel operations**
   - "Fetch from 5 different APIs simultaneously"

5. **Retry logic and error recovery**
   - "Retry with exponential backoff until success"

### ❌ Don't Use When:

1. **Single simple tool call** - Just call it directly
2. **No MCP tools needed** - Regular task planning
3. **UI/user interaction** - Use slash commands
4. **Simple sequential ops** - Direct calls clearer

## Cached Script Patterns

### TypeScript

1. **multi-tool-workflow.ts** - Sequential pipeline (Fetch → Transform → Validate → Store → Report)
2. **parallel-execution.ts** - Concurrent operations with Promise.all
3. **error-recovery.ts** - Retry logic with exponential backoff
4. **file-processing.ts** - Batch file operations with filtering
5. **conditional-logic.ts** - Dynamic tool selection based on data
6. **data-aggregation.ts** - Multi-source data merging

### Python

Same patterns in Python:
- multi_tool_workflow.py
- parallel_execution.py
- error_recovery.py
- file_processing.py
- conditional_logic.py
- data_aggregation.py

## MCP Tool Naming

**Format**: `mcp__<server>__<tool>`

**Examples**:
- `mcp__filesystem__readFile`
- `mcp__database__query`
- `mcp__github__createPullRequest`

The `<server>` name comes from your subagent MCP configuration.

## Troubleshooting

### Skill Not Activating

**Problem**: Claude Code doesn't use the skill

**Solutions**:
1. Check installation: `ls ~/.claude/skills/code-executor/SKILL.md`
2. Verify YAML frontmatter in SKILL.md
3. Try explicit language: "Use the code-executor skill to handle this multi-tool workflow"

### Tool Not Found

**Problem**: `Error: MCP tool 'mcp__server__tool' not found`

**Solutions**:
1. Check tool name format: `mcp__<server>__<tool>`
2. Verify server in subagent config: `cat ~/.mcp.json`
3. Ensure server is running (test manually)

### MCP Config Not Found

**Problem**: "MCP config file not found: ~/.mcp.json"

**Cause**: Subagent execution command didn't set `MCP_CONFIG_PATH`

**Solutions**:
1. Verify subagent Bash command includes: `MCP_CONFIG_PATH=~/.claude/subagent-mcp.json`
2. Check config file exists: `ls -la ~/.claude/subagent-mcp.json`
3. Review SKILL.md to ensure execution examples include MCP_CONFIG_PATH

**DO NOT**: Symlink or globally export MCP_CONFIG_PATH (this defeats the architecture)

### Permission Denied

**Problem**: Cannot read/write files or access network

**Solutions**:
1. Check Deno permissions: Include `--allow-read --allow-run --allow-env`
2. Verify file paths are in allowed directories (MCP server config)
3. Check MCP server has necessary permissions

### Code Execution Fails

**Problem**: Subagent's code doesn't run

**Solutions**:
1. Check Deno installed: `deno --version`
2. Check Python installed: `python3 --version`
3. Review generated code for syntax errors
4. Check MCP client import paths are correct

## Configuration

### Main Claude Code

**NO MCP servers** in `.mcp.json`:

```json
{
  "mcpServers": {
    // Keep this empty or don't create the file
  }
}
```

### Subagent MCP Servers

Create `~/.claude/subagent-mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/paths"]
    },
    "database": {
      "command": "mcp-server-postgres",
      "args": ["--connection", "postgresql://..."]
    }
  }
}
```

See [SUBAGENT_SETUP.md](./code-executor/SUBAGENT_SETUP.md) for complete configuration guide.

## Security Considerations

1. **Sandboxed Execution**
   - TypeScript: Deno runtime with explicit permissions
   - Python: subprocess with restricted access

2. **MCP Server Security**
   - Filesystem: Limited to allowed paths
   - Database: Use read-only connections where possible
   - Network: Servers can make network requests

3. **Best Practices**
   - Review generated code in sensitive contexts
   - Configure MCP servers with least privilege
   - Use allowlists to restrict tool access
   - Avoid sensitive data in logs

4. **Code Execution Risk**
   - Subagent writes and executes code
   - Audit generated scripts before execution in production
   - Consider running in isolated environments

## Documentation

- **[SKILL.md](./code-executor/SKILL.md)** - Main skill instructions (what Claude Code reads)
- **[SUBAGENT_SETUP.md](./code-executor/SUBAGENT_SETUP.md)** - Complete configuration guide
- **[TYPESCRIPT_GUIDE.md](./code-executor/TYPESCRIPT_GUIDE.md)** - TypeScript patterns and Deno
- **[PYTHON_GUIDE.md](./code-executor/PYTHON_GUIDE.md)** - Python patterns and asyncio
- **[EXAMPLES.md](./code-executor/EXAMPLES.md)** - 6 complete real-world examples
- **[REFERENCE.md](./code-executor/REFERENCE.md)** - MCP client API reference

## Contributing

Contributions welcome! To add new cached scripts or improve documentation:

1. Fork the repository
2. Create a feature branch
3. Add your script to `scripts/typescript/` or `scripts/python/`
4. Include comprehensive header with:
   - Purpose and use case
   - Adaptation instructions
   - Example usage
5. Test the script with actual MCP tools
6. Submit a pull request

## Development

### Adding New Scripts

1. Create script file in appropriate directory
2. Include header documentation
3. Import MCP client library
4. Test with real MCP tools
5. Update README if adding new categories

### Testing Scripts

```bash
# Test TypeScript script
MCP_CONFIG_PATH=~/.claude/subagent-mcp.json \
  deno run --allow-read --allow-run --allow-env scripts/typescript/your-script.ts

# Test Python script
MCP_CONFIG_PATH=~/.claude/subagent-mcp.json \
  python scripts/python/your_script.py
```

## License

MIT License - See LICENSE file for details

## Related Projects

- [Claude Code](https://docs.claude.com/en/docs/claude-code) - AI coding assistant
- [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol specification
- [Deno](https://deno.land) - Secure TypeScript runtime

## Support

For issues related to:
- **This skill**: Open an issue in this repository
- **Claude Code**: See https://docs.claude.com/en/docs/claude-code
- **MCP Protocol**: See https://modelcontextprotocol.io
- **Deno**: See https://deno.land
- **Specific MCP servers**: Check their respective repositories

## Changelog

### v2.0.0 (2025-11-11) - Subagent Architecture

**BREAKING CHANGES:**
- Complete redesign from code-executor-MCP dependency to subagent architecture
- Main Claude Code no longer needs MCP servers configured
- Subagents handle code execution with local MCP client

**New:**
- Local MCP client libraries (TypeScript + Python)
- Subagent configuration guide
- Completely rewritten SKILL.md for subagent pattern
- Updated all scripts and templates for new architecture

**Benefits:**
- 98% token reduction in main context
- No external dependencies (besides Deno/Python)
- More flexible and efficient execution

### v1.0.0 (2025-11-11) - Initial Release

- 12 cached scripts (6 TypeScript + 6 Python)
- 4 template files
- Comprehensive documentation (5 guide files)
- Support for both TypeScript (Deno) and Python execution

## Acknowledgments

- Inspired by [code-executor-MCP](https://github.com/aberemia24/code-executor-MCP) by aberemia24
- Built for the Claude Code ecosystem by Anthropic
- Thanks to the MCP community for the protocol specification

---

**Ready to get started?** See [SUBAGENT_SETUP.md](./code-executor/SUBAGENT_SETUP.md) for step-by-step setup instructions.
