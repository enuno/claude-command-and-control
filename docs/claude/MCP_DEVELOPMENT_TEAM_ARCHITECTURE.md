# Skills-First Multi-Agent MCP Server Development Team

**Project:** braiins-os-mcp-server
**Version:** 1.0.0
**Created:** December 29, 2025
**Based on:** Anthropic Skills-First Paradigm + MCP Builder Best Practices

---

## Executive Summary

This document defines a **skills-first multi-agent development team** specifically optimized for Model Context Protocol (MCP) server development. The architecture prioritizes **single agent + dynamically-loaded skills** for sequential workflows while leveraging **multi-agent orchestration** only for parallelizable tasks.

### Key Principles

1. **Skills as Primary Building Block**: MCP development workflows packaged as portable, reusable skills
2. **Command-Triggered Workflows**: Slash commands provide the primary interface for development tasks
3. **Progressive Context Loading**: Load only what's needed per phase (35% token reduction)
4. **Hybrid Orchestration**: Use multi-agent patterns when parallel execution provides value
5. **Evaluation-Driven Development**: Every MCP tool validated through comprehensive evaluations

### Performance Metrics

- **35% reduction** in token usage (skills vs multi-agent for sequential work)
- **4-phase workflow** ensures comprehensive MCP server quality
- **10 evaluation questions** per MCP server validate AI agent usability
- **Parallel skill conversion** reduces wall-clock time by 85%

---

## Architecture Overview

### The Skills-First Paradigm

```
┌─────────────────────────────────────────────────────────────────┐
│              General Agent (Claude Sonnet 4.5)                  │
│                                                                 │
│  Dynamically Loads Skills Based on Development Phase:          │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ MCP Builder  │ │  gRPC Client │ │Redis Caching │          │
│  │   Skill      │ │     Skill    │ │    Skill     │          │
│  │  (4 phases)  │ │ (connection) │ │(invalidation)│          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │  Validator   │ │   Architect  │ │    Scribe    │          │
│  │    Skill     │ │     Skill    │ │    Skill     │          │
│  │  (testing)   │ │   (design)   │ │    (docs)    │          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘

**Benefits:**
- Context flows naturally through development phases
- Skills compose for complex workflows (e.g., mcp-builder + validator-skill)
- Single agent to configure and maintain
- 35% more token-efficient than multi-agent approach
```

### When to Use Multi-Agent Orchestration

**✅ Use Multi-Agent For:**

1. **Parallel Skill Conversions** - Converting 5 agent templates → skills simultaneously
2. **Parallel Research** - Investigating multiple Braiins OS API endpoints independently
3. **Parallel Testing** - Running evaluation harnesses on multiple MCP servers concurrently
4. **Comparison Through Diversity** - Building 2-3 alternative tool implementations to compare

**❌ Don't Use Multi-Agent For:**

- Sequential MCP tool implementation (builder-skill handles this)
- Single MCP server development (use mcp-builder-skill)
- Documentation generation (scribe-skill)
- Code review and validation (validator-skill)

### Decision Matrix

| MCP Development Task | Sequential? | Parallel? | Approach |
|---------------------|-------------|-----------|----------|
| Implement single MCP tool | ✓ | ✗ | Agent + mcp-builder-skill |
| Build complete MCP server | ✓ | ✗ | Agent + mcp-builder + validator |
| Create 10 evaluation questions | ✓ | ✗ | Agent + mcp-builder-skill (Phase 4) |
| Research 5 Braiins OS endpoints | ✗ | ✓ | Multi-agent (5 researchers) |
| Convert 5 agent templates → skills | ✗ | ✓ | Multi-agent (5 converters) |
| Optimize gRPC + Redis integration | ✓ | ✗ | Agent + grpc-skill + redis-skill |
| Test 3 MCP servers in parallel | ✗ | ✓ | Multi-agent (3 evaluators) |

---

## Core Skills for MCP Development

### 1. mcp-builder-skill

**Purpose:** Comprehensive 4-phase MCP server development workflow

**Phases:**

1. **Deep Research and Planning**
   - Study MCP protocol documentation (modelcontextprotocol.io/llms-full.txt)
   - Study framework docs (Python SDK, TypeScript SDK)
   - Exhaustively study target API documentation
   - Create comprehensive implementation plan

2. **Implementation**
   - Set up project structure (Python or Node/TypeScript)
   - Implement core infrastructure (API helpers, error handling)
   - Implement tools systematically (input schema, docstrings, logic, annotations)
   - Follow language-specific best practices

3. **Review and Refine**
   - Code quality review (DRY, composability, consistency)
   - Test and build (avoid hanging processes, use evaluation harness)
   - Quality checklist validation

4. **Create Evaluations**
   - Generate 10 complex, realistic evaluation questions
   - Verify answers through manual solving
   - Output XML evaluation file format

**Key Outputs:**
- Production-ready MCP server (Python or TypeScript)
- Comprehensive tool descriptions with examples
- 10-question evaluation suite (XML format)
- Quality checklist validation

**When to Use:** Building any new MCP server from scratch

**Dependencies:** None (standalone skill)

---

### 2. grpc-client-dev-skill

**Purpose:** gRPC client development patterns for Braiins OS miners

**Key Patterns:**

1. **Connection Pooling**
   - Maintain connection pool (max 100 connections)
   - Evict oldest connections when pool full
   - Configure keepalive timeouts (30s/10s)

2. **Retry Logic**
   - Exponential backoff with configurable delays
   - maxRetries interpretation (retries after initial attempt)
   - Don't retry auth errors or 4xx client errors
   - Retry only on transient failures

3. **Stream Handling**
   - Real-time miner status updates via gRPC streams
   - Async iterator patterns for status streams
   - Publish to Redis pub/sub for real-time updates

4. **Error Recovery**
   - Graceful degradation on connection failures
   - Circuit breaker patterns for offline miners
   - Detailed error messages guiding agents toward solutions

**Key Outputs:**
- Connection pool implementation
- Retry utility functions with exponential backoff
- Stream handler for real-time updates
- Error handling utilities with actionable messages

**When to Use:** Implementing gRPC communication with Braiins OS miners

**Dependencies:** Braiins OS API documentation, gRPC library knowledge

---

### 3. redis-caching-patterns-skill

**Purpose:** Redis caching strategies for MCP server performance optimization

**Key Patterns:**

1. **Cache Invalidation Strategies**
   - **Time-Based TTL**: For slowly-changing data (fleet metrics, 30s TTL)
   - **Event-Based Invalidation**: When data changes (miner config updates)
   - **Cache-Aside with Write-Through**: Read from cache, write to source + cache

2. **TTL Strategies by Data Type**
   - Miner status: 10 seconds (frequently updated)
   - Fleet metrics: 30 seconds (aggregated data)
   - Configuration: Event-based (invalidate on update)
   - Logs: No cache (real-time data)

3. **Pub/Sub for Real-Time Updates**
   - Publisher: gRPC streams → Redis pub/sub
   - Subscriber: MCP server subscribes to events
   - Channels: `events:miner:{id}`, `events:fleet`

4. **Performance Optimization**
   - Batch operations for fleet-wide queries
   - Pipeline commands to reduce round trips
   - Character limits to prevent context overflow (25,000 tokens)

**Key Outputs:**
- Cache utility functions (get/set/invalidate)
- Pub/Sub event publisher and subscriber
- TTL configuration per data type
- Performance monitoring patterns

**When to Use:** Optimizing MCP server performance for fleet operations

**Dependencies:** Redis client library, basic caching concepts

---

### 4. mcp-evaluation-skill

**Purpose:** Comprehensive evaluation creation for MCP servers

**Evaluation Requirements:**

- **Independent**: Not dependent on other questions
- **Read-only**: Only non-destructive operations required
- **Complex**: Requiring multiple tool calls and deep exploration
- **Realistic**: Based on real use cases humans care about
- **Verifiable**: Single, clear answer via string comparison
- **Stable**: Answer won't change over time

**Question Generation Process:**

1. **Tool Inspection**: List all available MCP tools and understand capabilities
2. **Content Exploration**: Use READ-ONLY operations to explore available data
3. **Question Generation**: Create 10 complex, multi-step questions
4. **Answer Verification**: Manually solve each question to verify correctness

**XML Format:**

```xml
<evaluation>
  <qa_pair>
    <question>Find the miner with highest hashrate in fleet-001. What is its temperature?</question>
    <answer>65°C</answer>
  </qa_pair>
  <!-- 9 more qa_pairs -->
</evaluation>
```

**Key Outputs:**
- 10 evaluation questions in XML format
- Verified answers for each question
- Question complexity distribution (2-3 simple, 5-6 moderate, 2-3 complex)

**When to Use:** Phase 4 of MCP development (Create Evaluations)

**Dependencies:** mcp-builder-skill (Phase 1-3 complete), evaluation.md reference guide

---

### 5. validator-role-skill

**Purpose:** Testing, code review, and quality assurance for MCP servers

**Key Workflows:**

1. **Unit Testing**
   - Test individual MCP tools in isolation
   - Mock gRPC clients and Redis connections
   - Validate input schema enforcement (Pydantic/Zod)
   - Test error handling for edge cases

2. **Integration Testing**
   - Test gRPC + Redis integration patterns
   - Validate cache hit/miss scenarios
   - Test connection pooling under load
   - Verify retry logic with mock failures

3. **E2E Testing**
   - Full MCP server workflow validation
   - Test multi-tool workflows (list miners → update firmware → check status)
   - Validate agent usability through evaluation harness

4. **Security Review**
   - Input validation (SQL injection, command injection)
   - Authentication token handling
   - Error messages don't leak sensitive data
   - Tool annotations match actual behavior (readOnlyHint, destructiveHint)

**Key Outputs:**
- Test suites (unit, integration, E2E)
- Coverage reports (80% application code, 90% critical paths)
- Security audit findings
- Code review feedback

**When to Use:** After implementation, before deployment

**Dependencies:** mcp-builder-skill (implementation complete), testing frameworks (Jest/pytest)

---

### 6. architect-role-skill

**Purpose:** System design and architectural decisions for MCP servers

**Key Workflows:**

1. **API Design**
   - Choose Python (FastMCP) vs TypeScript (MCP SDK)
   - Define tool granularity (consolidated vs atomic operations)
   - Design response formats (concise vs detailed modes)
   - Plan context optimization strategies

2. **Architecture Decision Records (ADRs)**
   - Document major design choices (caching strategy, retry logic)
   - Evaluate trade-offs (token efficiency vs feature richness)
   - Define success criteria (performance, maintainability)

3. **Technology Evaluation**
   - Assess Redis vs in-memory caching
   - Evaluate gRPC vs REST for miner communication
   - Choose Pydantic vs dataclasses (Python)
   - Choose Zod vs TypeScript interfaces (Node)

4. **Quality Standards**
   - Define type safety requirements (strict mode, type hints)
   - Set error handling standards (actionable error messages)
   - Establish documentation requirements (comprehensive docstrings)

**Key Outputs:**
- ADRs for major decisions
- Technology evaluation reports
- Architecture diagrams
- Quality standards documentation

**When to Use:** Phase 1 (Deep Research and Planning)

**Dependencies:** MCP protocol knowledge, target API familiarity, framework docs

---

## Command-Triggered Workflows

### 1. /mcp-build-server

**Purpose:** Build a complete MCP server from scratch

**Workflow:**

```bash
# User invokes command
/mcp-build-server --api braiins-os --language typescript

# Agent loads skills progressively:
1. architect-role-skill (Phase 1: Planning)
   - Research Braiins OS API
   - Design tool architecture
   - Create implementation plan

2. mcp-builder-skill (Phase 2: Implementation)
   - Set up TypeScript project structure
   - Implement core infrastructure
   - Build MCP tools systematically

3. validator-role-skill (Phase 3: Testing)
   - Create test suites
   - Run quality checks
   - Security review

4. mcp-evaluation-skill (Phase 4: Evaluations)
   - Generate 10 evaluation questions
   - Verify answers
   - Create XML evaluation file

# Output: Production-ready MCP server with tests and evaluations
```

**Parameters:**
- `--api`: Target API to integrate (braiins-os, supabase, github, etc.)
- `--language`: Implementation language (python, typescript)
- `--tools`: Specific tools to implement (optional, defaults to comprehensive)

**Estimated Duration:** 2-4 hours (sequential, single agent)

---

### 2. /mcp-optimize-performance

**Purpose:** Optimize existing MCP server performance

**Workflow:**

```bash
# User invokes command
/mcp-optimize-performance --server-path ./src

# Agent loads skills:
1. architect-role-skill (Analyze architecture)
   - Review current implementation
   - Identify performance bottlenecks
   - Propose optimization strategies

2. grpc-client-dev-skill (Optimize gRPC)
   - Implement connection pooling
   - Add retry logic with exponential backoff
   - Optimize stream handling

3. redis-caching-patterns-skill (Add caching)
   - Implement cache-aside pattern
   - Configure TTLs per data type
   - Add pub/sub for real-time updates

4. validator-role-skill (Benchmark)
   - Create performance benchmarks
   - Validate optimizations
   - Measure improvement (token usage, latency)

# Output: Optimized MCP server with 35%+ token reduction
```

**Parameters:**
- `--server-path`: Path to existing MCP server
- `--targets`: Optimization targets (latency, tokens, memory)

**Estimated Duration:** 3-6 hours

---

### 3. /mcp-create-evaluations

**Purpose:** Generate comprehensive evaluation suite for MCP server

**Workflow:**

```bash
# User invokes command
/mcp-create-evaluations --server-path ./dist/index.js

# Agent loads mcp-evaluation-skill:
1. Tool Inspection (Phase 1)
   - List all available MCP tools
   - Understand tool capabilities
   - Identify workflow patterns

2. Content Exploration (Phase 2)
   - Use READ-ONLY tools to explore data
   - Identify interesting data relationships
   - Find edge cases worth testing

3. Question Generation (Phase 3)
   - Create 10 complex questions
   - Ensure independence and stability
   - Balance simple/moderate/complex

4. Answer Verification (Phase 4)
   - Manually solve each question
   - Verify answers are correct
   - Output XML evaluation file

# Output: evaluations.xml with 10 verified questions
```

**Parameters:**
- `--server-path`: Path to MCP server to evaluate
- `--count`: Number of questions (default: 10)
- `--complexity`: Distribution (default: 2 simple, 6 moderate, 2 complex)

**Estimated Duration:** 1-2 hours

---

### 4. /mcp-parallel-research

**Purpose:** Research multiple API endpoints in parallel (multi-agent)

**Workflow:**

```bash
# User invokes command
/mcp-parallel-research --endpoints "5 Braiins OS endpoints for fleet management"

# MULTI-AGENT ORCHESTRATION (breadth-first parallelization)

# Orchestrator spawns 5 researcher agents:
┌─────────────────────────────────┐
│   Orchestrator Lead             │
│   (Current Session)             │
└───────────┬─────────────────────┘
            │
   ┌────────┼────────┬────────┬────────┐
   │        │        │        │        │
┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐
│Agent1│ │Agent2│ │Agent3│ │Agent4│ │Agent5│
│/status││/config│ │/pools ││/hashrate││/logs │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘

Each agent independently:
1. Loads researcher-role-skill
2. Studies endpoint documentation
3. Analyzes request/response patterns
4. Documents use cases and limitations
5. Returns findings to orchestrator

Orchestrator synthesizes:
- Aggregates all endpoint documentation
- Identifies overlapping capabilities
- Recommends tool consolidation opportunities
- Creates comprehensive API reference

# Output: Comprehensive API research report (85% faster than sequential)
```

**Parameters:**
- `--endpoints`: Endpoint descriptions or count
- `--depth`: Research depth (quick, thorough, exhaustive)

**Estimated Duration:** 30-60 minutes (parallel) vs 2-4 hours (sequential)

**Performance Gain:** 85% wall-clock time reduction

---

### 5. /mcp-convert-agents-to-skills

**Purpose:** Convert multiple agent templates to skills in parallel

**Workflow:**

```bash
# User invokes command
/mcp-convert-agents-to-skills --templates "validator,architect,scribe,devops,researcher"

# MULTI-AGENT ORCHESTRATION (parallel conversions)

# Orchestrator spawns 5 converter agents:
┌─────────────────────────────────────────┐
│   Orchestrator Lead                     │
│   • Coordinates 5 parallel converters  │
│   • Validates outputs                   │
│   • Updates skills registry             │
└───────────┬─────────────────────────────┘
            │
   ┌────────┼────────┬────────┬────────┐
   │        │        │        │        │
┌──▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
│Worker1│ │Worker2│ │Worker3│ │Worker4│ │Worker5│
│Valid. │ │Arch.  │ │Scribe │ │DevOps │ │Research│
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘

Each worker independently:
1. Loads skill-creator-skill
2. Reads source agent template
3. Extracts workflow patterns
4. Creates SKILL.md with frontmatter
5. Generates supporting resources
6. Validates skill structure

Orchestrator integrates:
- Validates all 5 skills
- Updates .claude/skills/registry.json
- Cross-references in documentation
- Creates before/after examples

# Output: 5 new skills in 90 minutes (vs 7.5 hours sequential)
```

**Parameters:**
- `--templates`: Agent template names to convert
- `--validate-only`: Run validation without conversion

**Estimated Duration:** 90 minutes (parallel) vs 7.5 hours (sequential)

**Performance Gain:** 85% wall-clock time reduction

---

### 6. /mcp-hybrid-workflow

**Purpose:** Complex feature using hybrid orchestration (orchestrator + workers with skills)

**Workflow:**

```bash
# User invokes command
/mcp-hybrid-workflow --feature "Add firmware update capability to MCP server"

# HYBRID ORCHESTRATION (best of both worlds)

# Orchestrator coordinates, workers load skills:
┌───────────────────────────────────────────────────┐
│   Orchestrator Lead (Claude Opus 4.5)            │
│   • Decomposes feature into tasks               │
│   • Spawns workers in git worktrees             │
│   • Monitors progress and coordinates            │
└───────────┬───────────────────────────────────────┘
            │
   ┌────────┼────────┬────────┐
   │        │        │        │
┌──▼────┐ ┌──▼────┐ ┌──▼────┐
│Worker1│ │Worker2│ │Worker3│
│Architect│Builder│Validator│
│worktree1│worktree2│worktree3│
└────────┘ └────────┘ └────────┘

Worker 1 (Architect):
- Loads architect-role-skill
- Designs firmware update state machine
- Creates ADRs for retry strategy
- Returns design doc

Worker 2 (Builder):
- Loads mcp-builder-skill + grpc-client-dev-skill
- Implements update_miner_firmware tool
- Implements check_firmware_job_status tool
- Returns implementation

Worker 3 (Validator):
- Loads validator-role-skill
- Creates test suite for firmware updates
- Tests failure scenarios (offline miners)
- Returns test results

Orchestrator synthesizes:
- Merges design + implementation + tests
- Resolves any conflicts
- Creates comprehensive PR
- Generates documentation

# Output: Complete firmware update feature (design + code + tests + docs)
```

**Parameters:**
- `--feature`: Feature description
- `--parallel-tasks`: Number of parallel workers (default: auto-detect)

**Estimated Duration:** 2-3 hours (hybrid) vs 4-6 hours (sequential single agent)

**Performance Gain:** 40% faster delivery through parallelization

---

## Skill Orchestration Patterns

### Pattern 1: Sequential Skill Loading (Default)

**When to Use:** Most MCP development workflows

**Example:** Building a new MCP tool

```
Agent Loads:
1. architect-role-skill → Design tool interface
2. mcp-builder-skill → Implement tool
3. validator-role-skill → Test tool
4. mcp-evaluation-skill → Create evaluation questions

Context flows naturally through all phases.
Token efficiency: 35% better than multi-agent.
```

### Pattern 2: Parallel Multi-Agent (Breadth-First)

**When to Use:** Independent, parallelizable tasks

**Example:** Researching 5 API endpoints

```
Orchestrator Spawns:
- Agent 1 (researcher-role-skill) → Endpoint 1
- Agent 2 (researcher-role-skill) → Endpoint 2
- Agent 3 (researcher-role-skill) → Endpoint 3
- Agent 4 (researcher-role-skill) → Endpoint 4
- Agent 5 (researcher-role-skill) → Endpoint 5

Wall-clock time: 85% reduction vs sequential.
Use case: Time-sensitive deliverables, large-scale research.
```

### Pattern 3: Hybrid Orchestration (Complex Features)

**When to Use:** Complex features with some parallelization opportunities

**Example:** Full-stack MCP server feature (firmware updates)

```
Orchestrator Coordinates:
- Worker 1 (architect-role-skill) → Design in worktree-1
- Worker 2 (mcp-builder-skill + grpc-client-dev-skill) → Implement in worktree-2
- Worker 3 (validator-role-skill) → Test in worktree-3

Each worker loads appropriate skills.
Filesystem isolation via git worktrees.
Performance: 40% faster than sequential, maintains context quality.
```

---

## Implementation Roadmap

### Phase 1: Core Skills Development ✅ (In Progress)

**Status:** builder-role-skill complete (650 lines), 5 skills in parallel conversion

**Remaining:**
- ✅ validator-role-skill (550 lines) - Worker 1
- ✅ architect-role-skill (400 lines) - Worker 2
- ✅ scribe-role-skill (800 lines) - Worker 3
- ✅ devops-role-skill (850 lines) - Worker 4
- ✅ researcher-role-skill (700 lines) - Worker 5

**Execution:** Multi-agent orchestration (85% time savings: 90 min vs 7.5 hours)

### Phase 2: MCP-Specific Skills Development (Next)

**New Skills to Create:**

1. **grpc-client-dev-skill** (600 lines, 6 hours)
   - Connection pooling patterns
   - Retry logic with exponential backoff
   - Stream handling for real-time updates
   - Error recovery strategies

2. **redis-caching-patterns-skill** (500 lines, 5 hours)
   - Cache invalidation strategies (time-based, event-based)
   - TTL configuration per data type
   - Pub/sub for real-time agent updates
   - Performance optimization patterns

3. **mcp-evaluation-skill** (400 lines, 4 hours)
   - Question generation methodology
   - Answer verification strategies
   - XML format specifications
   - Complexity distribution (simple/moderate/complex)

**Execution:** Sequential single agent + mcp-builder-skill (15 hours total)

**Alternative:** Parallel multi-agent (3 converters, 6 hours) if time-sensitive

### Phase 3: Command Creation (Pending)

**Commands to Create:**

1. `/mcp-build-server` - Build complete MCP server from scratch
2. `/mcp-optimize-performance` - Optimize existing MCP server
3. `/mcp-create-evaluations` - Generate evaluation suite
4. `/mcp-parallel-research` - Research API endpoints in parallel
5. `/mcp-convert-agents-to-skills` - Convert agent templates to skills
6. `/mcp-hybrid-workflow` - Complex features with hybrid orchestration

**Execution:** Sequential single agent + skill-creator-skill (12 hours total)

### Phase 4: Documentation and Testing (Pending)

**Deliverables:**

1. Update CLAUDE.md with skills-first MCP development patterns
2. Create before/after examples (agent-based → skills-first)
3. Performance comparison metrics (token usage, wall-clock time)
4. Integration guide (how to use commands with existing workflow)
5. Troubleshooting guide (common issues and solutions)

**Execution:** Single agent + scribe-role-skill (8 hours)

---

## Success Metrics

### Performance Metrics

- **Token Efficiency**: 35% reduction (skills vs multi-agent for sequential work)
- **Wall-Clock Time**: 85% reduction (parallel multi-agent for independent tasks)
- **Quality**: 80% test coverage minimum, 90% for critical paths
- **Evaluation Coverage**: 10 complex questions per MCP server

### Organizational Impact

- **Development Speed**: 40% faster feature delivery (hybrid orchestration)
- **Maintainability**: Single agent to maintain (vs N specialized agents)
- **Knowledge Sharing**: Portable skills shared across projects
- **Cost Reduction**: 35% fewer tokens = 35% lower API costs

### Quality Standards

- **Type Safety**: TypeScript strict mode, Python type hints throughout
- **Documentation**: Comprehensive docstrings for every MCP tool
- **Error Handling**: Actionable error messages guiding agents
- **Security**: Input validation, no credential leaks, proper tool annotations

---

## Quick Reference

### When to Use Skills-First

✅ **Use Single Agent + Skills For:**
- Building new MCP tools sequentially
- Optimizing existing MCP server performance
- Creating evaluation suites
- Documentation generation
- Code review and validation
- Any depth-first workflow

### When to Use Multi-Agent

✅ **Use Multi-Agent Orchestration For:**
- Parallel API endpoint research (5+ independent endpoints)
- Parallel skill conversions (agent templates → skills)
- Parallel evaluation testing (3+ MCP servers)
- Exploring alternative implementation approaches
- Time-sensitive deliverables requiring concurrency

### When to Use Hybrid

✅ **Use Hybrid Orchestration For:**
- Complex features with some parallel opportunities
- Full-stack MCP server features (design + implement + test)
- Large refactoring with independent components
- Multi-environment deployments (dev/staging/prod)

---

## References

### Core Resources

- **Anthropic Skills Research**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **MCP Protocol Specification**: https://modelcontextprotocol.io/llms-full.txt
- **MCP Python SDK**: https://github.com/modelcontextprotocol/python-sdk
- **MCP TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk

### Internal Documentation

- **AGENT_STRATEGY_UPDATE_SUMMARY.md**: Paradigm shift from multi-agent to skills-first
- **mcp-builder/SKILL.md**: Comprehensive MCP server development guide
- **skill-creator/SKILL.md**: Meta-skill for creating effective skills
- **multi-agent-planner-skill.md**: Automated MULTI_AGENT_PLAN.md generation

### Skills-First Examples

- **builder-role-skill**: 650 lines, feature implementation workflow
- **Before/After Comparison**: docs/best-practices/09-Agent-Skills-vs-Multi-Agent.md

---

**Status:** ✅ Architecture Complete
**Next:** Execute Phase 1 parallel skill conversions
**Version:** 1.0.0
**Last Updated:** December 29, 2025
**Maintained By:** Braiins OS MCP Development Team
