# Braiins OS MCP Server Commands

**Version**: 1.0.0 (Braiins OS Edition)
**Project**: braiins-os-mcp-server
**Service**: Braiins OS API (gRPC + REST)
**Last Updated**: December 29, 2025
**Paradigm**: Skills-First with Multi-Agent Support

---

## Overview

Comprehensive command suite for building and enhancing the Braiins OS MCP server. This server enables AI agents to manage Braiins OS ASIC miners for Bitcoin mining operations through the Model Context Protocol (MCP). Commands are tuned specifically for this project with Braiins OS defaults, examples, and workflows.

---

## Project Context

**Braiins OS MCP Server**:
- **Language**: TypeScript (Node.js 20.x LTS)
- **Service**: Braiins OS API for ASIC miner management
- **Tech Stack**: @modelcontextprotocol/sdk, @grpc/grpc-js, Redis, Zod
- **Architecture**: MCP server → gRPC client → Braiins OS miners
- **Caching**: Redis for fleet operation optimization

**Existing MCP Tools**:
- `authenticate` - API key authentication
- `list_miners` - List all miners in fleet
- `get_miner_status` - Real-time miner status
- `update_pool_config` - Update mining pool settings
- `update_firmware` - Firmware update with progress tracking

## Command Philosophy

### Skills-First Approach (Default)

**Most development should use skills-first approach**:
- Single agent loads `mcp-builder` skill dynamically
- Follows 4-phase workflow (Research → Implementation → Review → Evaluation)
- 35% more token-efficient than multi-agent
- Better context management for Braiins OS API integration
- Simpler to use

**Use skills-first commands when**:
- Adding 1-5 related MCP tools
- Sequential development workflow
- Standard complexity (similar to existing tools)
- Context needs to flow between phases

### Multi-Agent Approach (When Needed)

**Use multi-agent orchestration only for**:
- 6+ tools needing parallel development
- Researching multiple API integrations simultaneously
- Time-sensitive deliverables
- Exploring multiple implementation approaches

**Performance Tradeoff**:
- 60% faster wall-clock time (parallel execution)
- 3x more tokens (coordination overhead)
- Requires orchestrator agent
- More complex setup

---

## Available Commands

### Core MCP Development (Skills-First)

#### 1. `/mcp-init` - Initialize Braiins OS MCP Server
**Purpose**: Initialize or verify Braiins OS MCP server project structure and dependencies

**Usage**:
```bash
/mcp-init
```

**When to use**:
- Adding new MCP tools to the Braiins OS server
- Setting up development environment for new contributors
- Verifying project dependencies and structure
- Initializing new feature branches

**Output**:
- Verified project structure (src/mcp/, src/api/grpc/, src/cache/)
- Checked dependencies (@grpc/grpc-js, redis, etc.)
- Verified existing MCP tools
- Ready to add new tools

**Project defaults**: TypeScript, Braiins OS API, gRPC + Redis

**Skills used**: `mcp-builder` (Phase 1)

---

#### 2. `/mcp-tool-create` - Create MCP Tool
**Purpose**: Create a new MCP tool following agent-centric design principles

**Usage**:
```bash
/mcp-tool-create
```

**When to use**:
- Adding new capability to existing MCP server
- Exposing API endpoint as MCP tool
- Need guidance on tool design

**Output**:
- Tool implementation file
- Unit tests
- Documentation
- Updated server registration

**Skills used**: `mcp-builder` (Phase 2), `builder-role-skill`

**Example**:
```typescript
// Creates tool with:
// - Zod/Pydantic schema
// - Actionable error messages
// - Concise/detailed modes
// - Proper annotations
```

---

#### 3. `/mcp-server-build` - Build Braiins OS MCP Tools
**Purpose**: Develop new MCP tools for Braiins OS server (1-5 tools) using skills-first approach

**Usage**:
```bash
/mcp-server-build
```

**When to use**:
- Adding new miner management capabilities
- Small-to-moderate complexity (1-5 related tools)
- Sequential development workflow
- Want comprehensive guidance through all 4 phases

**For Braiins OS**:
- Project context pre-loaded (braiins-os-mcp-server)
- Braiins OS API documentation automatically referenced
- Existing utilities available (gRPC pool, Redis cache, formatters)

**Timeline**: 4-6 hours (single agent, sequential)

**Output**:
- New MCP tools integrated into existing server
- Unit and integration tests
- Updated documentation
- Production-ready implementation

**Example tools you can add**:
- Advanced monitoring (hashrate trends, temperature alerts)
- Batch operations (multi-miner updates)
- Optimization tools (power efficiency suggestions)

**Skills used**: `mcp-builder` (all 4 phases)

**Phases**:
1. **Research & Planning** - API study, implementation plan
2. **Implementation** - Tools, resources, prompts
3. **Review & Refine** - Quality checks, testing
4. **Evaluations** - 10 complex questions

---

### Multi-Agent Orchestration (For Complex Servers)

#### 4. `/mcp-orchestrate-server` - Multi-Agent MCP Development
**Purpose**: Orchestrate parallel development of complex MCP servers (6+ tools)

**Usage**:
```bash
/mcp-orchestrate-server
```

**When to use**:
- Building MCP server with 6+ tools
- Researching multiple APIs in parallel
- Time-sensitive deliverables
- Want to explore multiple approaches

**Timeline**: 2-3 days (with 4+ parallel agents)

**Output**:
- Complete MCP server (15+ tools possible)
- Multi-agent coordination summary
- Quality gate validations
- Comprehensive documentation

**Agents used**:
- Orchestrator Lead (planning, coordination)
- Builder Agents × 4 (parallel tool development)
- Validator Agent (testing, evaluations)
- Scribe Agent (documentation)

**Skills used**:
- `multi-agent-planner` (orchestrator)
- `mcp-builder` (all agents)
- `builder-role-skill`, `validator-role-skill`, `scribe-role-skill`

**Workflow**:
1. Create MULTI_AGENT_PLAN.md
2. Spawn 4 builder agents in worktrees
3. Parallel tool development (Groups 1-4)
4. Integration & quality gates
5. Evaluation & testing
6. Documentation & deployment

---

#### 5. `/mcp-parallel-tools` - Parallel Tool Development
**Purpose**: Develop multiple MCP tools in parallel (subset of full orchestration)

**Usage**:
```bash
/mcp-parallel-tools --count=4
```

**When to use**:
- Need to add 4+ tools to existing server
- Each tool is independent
- Want parallel development without full orchestration

**Timeline**: ~2-3 hours (for 4 tools in parallel)

**Output**:
- Multiple tool implementations
- Tests for each tool
- Integration into existing server

---

### Quality & Validation

#### 6. `/mcp-evaluation-create` - Create Evaluation Harness
**Purpose**: Generate 10 complex evaluation questions to test MCP server

**Usage**:
```bash
/mcp-evaluation-create
```

**When to use**:
- After implementing MCP tools
- Need to verify agent can use tools effectively
- Want to test realistic, complex scenarios

**Output**:
- 10 complex, realistic questions
- Verified answers (manually solved)
- evaluation.xml file
- (Optional) Evaluation harness execution results

**Skills used**: `mcp-builder` (Phase 4)

**Requirements for questions**:
- Independent (not dependent on others)
- Read-only (non-destructive)
- Complex (3-5 tool calls required)
- Realistic (real use cases)
- Verifiable (single clear answer)
- Stable (answer won't change)

---

#### 7. `/mcp-test` - Test MCP Server
**Purpose**: Run comprehensive tests on MCP server

**Usage**:
```bash
/mcp-test
```

**Includes**:
- Unit tests
- Integration tests
- Evaluation harness (if available)
- Build validation

---

#### 8. `/mcp-validate` - Validate MCP Server
**Purpose**: Validate server implementation against MCP best practices

**Usage**:
```bash
/mcp-validate
```

**Checks**:
- Tool annotations complete
- Error messages are actionable
- Input schemas use strict validation
- Response formats support concise/detailed modes
- Documentation is comprehensive

---

## Decision Matrix: Which Command to Use?

| Scenario | Command | Approach | Timeline |
|----------|---------|----------|----------|
| **Start session** | `/start-session` | - | 2 min |
| **Verify project** | `/mcp-init` | Skills-First | 5 min |
| **Add 1 miner tool** | `/mcp-tool-create` | Skills-First | 30 min |
| **Add 2-3 related tools** | `/mcp-server-build` | Skills-First | 3-4 hours |
| **Add 4-5 tools** | `/mcp-server-build` | Skills-First | 5-6 hours |
| **Add major suite (6+ tools)** | `/mcp-orchestrate-server` | Multi-Agent | 2-3 days |
| **Parallel tool dev (4+)** | `/mcp-parallel-tools` | Multi-Agent | 2-3 hours |
| **Create evaluations** | `/mcp-evaluation-create` | Skills-First | 1-2 hours |
| **Run tests** | `/test-all` | - | 5 min |
| **Close session** | `/close-session` | - | 2 min |

---

## Typical Workflows for Braiins OS Server

### Add New Miner Management Tools (1-3 Tools)

```bash
# 1. Start session (load project context)
/start-session

# 2. Verify/initialize project structure
/mcp-init

# 3. Build new MCP tools (skills-first)
/mcp-server-build
# Example: Add reboot_miner, factory_reset, get_hashrate_history

# 4. Create evaluations
/mcp-evaluation-create

# 5. Test
npm test

# Total time: ~4-5 hours
```

### Moderate MCP Server (4-5 Tools)

```bash
# 1. Initialize project
/mcp-init

# 2. Build complete server (skills-first, longer)
/mcp-server-build

# 3. Create evaluations
/mcp-evaluation-create

# Total time: ~6-7 hours
```

### Add Major Feature Suite (6+ Tools)

```bash
# Example: Complete fleet analytics & automation suite

# 1. Start session
/start-session

# 2. Multi-agent orchestration
/mcp-orchestrate-server

# (Orchestrator coordinates:)
#  - Builder-1: Fleet analytics tools (4 tools)
#  - Builder-2: Automation tools (3 tools)
#  - Builder-3: Alert & monitoring (3 tools)
#  - Builder-4: Reporting tools (2 tools)
#  - Validator: Testing & evaluation
#  - Scribe: Documentation

# Total time: ~2-3 days (60% faster than sequential)
# Tools added: 12 new MCP tools for comprehensive fleet management
```

### Add Tools to Existing Server

**Add 1-2 tools** (Sequential):
```bash
/mcp-tool-create
# Repeat for second tool
```

**Add 4+ tools** (Parallel):
```bash
/mcp-parallel-tools --count=4
```

---

## Skills Reference

All commands leverage these skills:

**Primary Skills**:
- `mcp-builder` - Comprehensive 4-phase MCP development guide
  - Phase 1: Deep Research and Planning
  - Phase 2: Implementation
  - Phase 3: Review and Refine
  - Phase 4: Create Evaluations

**Supporting Skills**:
- `multi-agent-planner` - Orchestration and task decomposition
- `builder-role-skill` - TDD workflow, implementation patterns
- `validator-role-skill` - Testing and quality assurance
- `scribe-role-skill` - Documentation generation

**Orchestration Skills**:
- `parallel-executor` - Concurrent task execution
- `worktree-manager` - Git worktree management
- `agent-communication` - Inter-agent messaging

---

## Performance Metrics

### Skills-First Approach
- **Token Efficiency**: 5-7x baseline
- **Context Management**: Centralized, efficient
- **Coordination**: None needed
- **Best For**: 1-5 tools, sequential work
- **Timeline**: 4-6 hours (complete server)

### Multi-Agent Approach
- **Token Efficiency**: 15x baseline (coordination overhead)
- **Wall-Clock Time**: 60% faster (parallel)
- **Coordination**: High (orchestrator + monitoring)
- **Best For**: 6+ tools, parallel work
- **Timeline**: 2-3 days (complex server, but faster than 5-7 days sequential)

---

## Best Practices

### 1. Start with Skills-First
- Default to `/mcp-server-build` unless clearly need multi-agent
- Simpler, more efficient, easier to use
- Better for learning MCP development

### 2. Use Multi-Agent Strategically
- Only when genuinely need parallelization
- Requires more setup and coordination
- Worth it for 6+ tools or time-sensitive work

### 3. Always Create Evaluations
- Use `/mcp-evaluation-create` after implementation
- 10 complex questions validate real-world usage
- Essential for quality assurance

### 4. Follow 4-Phase Workflow
- Phase 1 (Research): Comprehensive API study
- Phase 2 (Implementation): Systematic tool creation
- Phase 3 (Review): Quality checks and testing
- Phase 4 (Evaluations): Realistic question generation

---

## Related Documentation

- **MCP Builder Skill**: `docs/claude/skills-templates/mcp-builder/SKILL.md`
- **Multi-Agent Orchestration**: `docs/best-practices/04-Multi-Agent-Orchestration.md`
- **Skills vs Multi-Agent**: `docs/best-practices/09-Agent-Skills-vs-Multi-Agent.md`
- **Multi-Agent Planner Skill**: `docs/claude/skills-templates/orchestration/multi-agent-planner-skill.md`

---

## References

- **MCP Protocol**: https://modelcontextprotocol.io/llms-full.txt
- **TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk
- **Python SDK**: https://github.com/modelcontextprotocol/python-sdk
- **MCP Best Practices**: `skills-templates/mcp-builder/reference/mcp_best_practices.md`

---

## Command Template Structure

Each command follows this structure:
- **Purpose**: Clear description
- **When to Use**: Decision criteria
- **Usage**: How to invoke
- **Workflow**: Step-by-step process
- **Skills Used**: Which skills are loaded
- **Output**: What gets created
- **Error Handling**: Common issues
- **Permissions**: Required tools
- **Related Commands**: Connected workflows

---

**Status**: ✅ Production Ready
**Total Commands**: 8
**Paradigm**: Skills-First (default), Multi-Agent (when needed)
**Maintained By**: MCP Development Team
