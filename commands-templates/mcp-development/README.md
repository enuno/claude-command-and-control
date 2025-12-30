# MCP Development Commands

**Version**: 1.0.0
**Last Updated**: December 29, 2025
**Paradigm**: Skills-First with Multi-Agent Support

---

## Overview

Comprehensive command suite for building Model Context Protocol (MCP) servers using the skills-first paradigm. Commands range from simple single-tool creation to complex multi-agent orchestration for large-scale MCP server development.

---

## Command Philosophy

### Skills-First Approach (Default)

**Most MCP development should use skills-first approach**:
- Single agent loads `mcp-builder` skill dynamically
- Follows 4-phase workflow (Research → Implementation → Review → Evaluation)
- 35% more token-efficient than multi-agent
- Better context management
- Simpler to use

**Use skills-first commands when**:
- Building 1-5 tools
- Sequential development workflow
- Standard complexity
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

#### 1. `/mcp-init` - Initialize MCP Server Project
**Purpose**: Set up new MCP server with proper structure, dependencies, and configuration

**Usage**:
```bash
/mcp-init
```

**When to use**:
- Starting new MCP server project
- Need proper TypeScript/Python project structure
- Want to follow MCP best practices from start

**Output**:
- Complete project structure
- Dependencies installed
- Basic server implementation
- Documentation templates

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

#### 3. `/mcp-server-build` - Full Server Development
**Purpose**: End-to-end MCP server development (1-5 tools) using skills-first approach

**Usage**:
```bash
/mcp-server-build
```

**When to use**:
- Building complete MCP server
- Small-to-moderate complexity (1-5 tools)
- Sequential development workflow
- Want comprehensive guidance through all 4 phases

**Timeline**: 4-6 hours (single agent, sequential)

**Output**:
- Complete MCP server (tools, resources, prompts)
- 10 evaluation questions
- Comprehensive documentation
- Production-ready implementation

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
| **New project** | `/mcp-init` | Skills-First | 15 min |
| **Add 1 tool** | `/mcp-tool-create` | Skills-First | 30 min |
| **Build server (1-3 tools)** | `/mcp-server-build` | Skills-First | 3-4 hours |
| **Build server (4-5 tools)** | `/mcp-server-build` | Skills-First | 5-6 hours |
| **Build server (6+ tools)** | `/mcp-orchestrate-server` | Multi-Agent | 2-3 days |
| **Add 4+ tools to existing** | `/mcp-parallel-tools` | Multi-Agent | 2-3 hours |
| **Create evaluations** | `/mcp-evaluation-create` | Skills-First | 1-2 hours |
| **Research multiple APIs** | `/mcp-orchestrate-server` (research phase) | Multi-Agent | 1-2 hours |

---

## Typical Workflows

### Simple MCP Server (1-3 Tools)

```bash
# 1. Initialize project
/mcp-init

# 2. Build complete server (skills-first)
/mcp-server-build

# 3. Create evaluations
/mcp-evaluation-create

# 4. Test
/mcp-test

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

### Complex MCP Server (6+ Tools)

```bash
# 1. Initialize project
/mcp-init

# 2. Multi-agent orchestration
/mcp-orchestrate-server

# (Orchestrator coordinates:)
#  - Parallel tool development (4 agents)
#  - Integration & quality gates
#  - Evaluation creation
#  - Documentation

# Total time: ~2-3 days (60% faster than sequential)
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
