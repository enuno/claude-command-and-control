# /mcp-server-build - Full MCP Server Development (Skills-First)

**Version**: 1.0.0
**Category**: Core MCP Development
**Paradigm**: Skills-First (Single Agent)
**Last Updated**: December 29, 2025

---

## Purpose

Complete end-to-end MCP server development using skills-first approach. Single agent loads `mcp-builder` skill and follows the 4-phase workflow to build a production-ready MCP server. Ideal for small-to-moderate complexity servers (1-5 tools).

---

## When to Use

✅ **Use Skills-First `/mcp-server-build` When**:
- Building MCP server with 1-5 tools
- Sequential development workflow
- Context needs to flow between implementation phases
- Standard MCP server complexity

❌ **Use `/mcp-orchestrate-server` (Multi-Agent) When**:
- 6+ tools needing parallel development
- Multiple independent API integrations
- Time-sensitive deliverables
- Exploring multiple implementation approaches

---

## Usage

```bash
/mcp-server-build
```

**Agent will ask**:
- Server name and purpose
- API/service to integrate
- API documentation URL
- Estimated number of tools (if > 5, suggests `/mcp-orchestrate-server`)

---

## Workflow (Skills-First - Single Agent)

**Agent loads**: `mcp-builder` skill (all 4 phases)

### Phase 1: Deep Research and Planning

**From mcp-builder Phase 1**:

1. **Load MCP Protocol Documentation**:
   ```
   Use WebFetch: https://modelcontextprotocol.io/llms-full.txt
   ```

2. **Load SDK Documentation**:
   - TypeScript: https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md
   - Python: https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md

3. **Study API Documentation** (Comprehensive):
   - Use WebSearch and WebFetch for all available docs
   - Authentication requirements
   - Rate limiting and pagination
   - Available endpoints and parameters
   - Data models and schemas
   - Error responses

4. **Create Implementation Plan**:
   ```markdown
   # MCP Server Implementation Plan: braiins-os-mcp-server

   ## Tool Selection (Priority Ordered)
   1. **authenticate** - API key authentication
   2. **list_miners** - List all miners in fleet
   3. **get_miner_status** - Real-time status for miner
   4. **update_pool_config** - Update mining pool settings
   5. **update_firmware** - Firmware update with progress tracking

   ## Resource Selection
   1. **miner_fleet_summary** - Aggregated fleet metrics
   2. **miner_logs** - Access miner logs

   ## Prompt Templates
   1. **troubleshoot_offline_miner** - Guided troubleshooting workflow

   ## Shared Utilities
   - API request helper (with retry logic)
   - Error handling utilities (actionable messages)
   - Response formatters (JSON + Markdown)
   - Pagination helpers

   ## Input/Output Design
   - Concise mode (default): High-signal only
   - Detailed mode (optional): Full data for debugging
   - Character limit: 25,000 tokens
   - Truncation strategy for large fleets

   ## Error Handling
   - Actionable error messages with next steps
   - Rate limiting: exponential backoff
   - Timeout: 30s default, configurable
   - Authentication errors: Guide to fix
   ```

### Phase 2: Implementation

**From mcp-builder Phase 2**:

1. **Set Up Project Structure** (if not done):
   ```
   Use /mcp-init if project doesn't exist yet
   ```

2. **Implement Core Infrastructure**:

   **Shared Utilities**:
   ```typescript
   // src/utils/api.ts
   export async function makeApiRequest(
     endpoint: string,
     options: RequestOptions
   ): Promise<Response> {
     // Retry logic with exponential backoff
     // Rate limiting handling
     // Timeout management
     // Error transformation to actionable messages
   }

   export function formatResponse(
     data: any,
     mode: "concise" | "detailed"
   ): string {
     if (mode === "concise") {
       // High-signal information only
     } else {
       // Comprehensive data
     }
   }
   ```

3. **Implement Tools Systematically** (One by One):

   **Tool 1: authenticate**
   - Define Zod/Pydantic schema
   - Write comprehensive docstring
   - Implement logic using shared utilities
   - Add tool annotations
   - Write unit tests
   - Verify builds successfully

   **Tool 2: list_miners**
   - (Same process)
   - Reuse API request helper
   - Add pagination support
   - Implement concise/detailed modes

   **Tool 3-5**: (Continue pattern)

4. **Implement Resources**:
   ```typescript
   @resource({
     uri: "braiins://fleet/summary",
     name: "Fleet Summary",
     description: "Aggregated metrics for all miners"
   })
   async getFleetSummary(): Promise<FleetSummary> {
     // Use shared utilities
     // Cache for 30 seconds
   }
   ```

5. **Implement Prompts**:
   ```typescript
   @prompt({
     name: "troubleshoot_offline_miner",
     description: "Guided troubleshooting for offline miners"
   })
   async troubleshootMinerOffline(minerId: string) {
     // Multi-step guided workflow
   }
   ```

### Phase 3: Review and Refine

**From mcp-builder Phase 3**:

1. **Code Quality Review**:
   - [ ] DRY: No duplicated code between tools
   - [ ] Composability: Shared logic extracted
   - [ ] Consistency: Similar operations, similar formats
   - [ ] Error Handling: All external calls handled
   - [ ] Type Safety: Full coverage (TypeScript strict mode)
   - [ ] Documentation: Every tool has comprehensive docs

2. **Test and Build**:
   ```bash
   # TypeScript
   npm run build        # Must succeed
   npm test            # All tests pass

   # Python
   python -m py_compile src/server.py
   pytest tests/       # All tests pass
   ```

3. **Quality Checklist** (Language-Specific):

   **TypeScript**:
   - [ ] Zod schemas with `.strict()`
   - [ ] No `any` types
   - [ ] Explicit `Promise<T>` return types
   - [ ] Tool annotations complete
   - [ ] Actionable error messages
   - [ ] Unit tests cover edge cases
   - [ ] Build succeeds

   **Python**:
   - [ ] Pydantic v2 models with `model_config`
   - [ ] Type hints throughout
   - [ ] Tool annotations complete
   - [ ] Actionable error messages
   - [ ] Unit tests cover edge cases
   - [ ] Syntax check passes

### Phase 4: Create Evaluations

**From mcp-builder Phase 4**:

1. **Tool Inspection**:
   - List all implemented tools
   - Understand each tool's capabilities
   - Note which tools work together

2. **Content Exploration** (Read-Only):
   - Use tools to explore actual data
   - Understand data structure and relationships
   - Identify interesting patterns

3. **Generate 10 Complex Questions**:

   **Requirements**:
   - Independent (not dependent on other questions)
   - Read-only (non-destructive operations)
   - Complex (require 3-5 tool calls, deep exploration)
   - Realistic (based on real use cases)
   - Verifiable (single clear answer, string comparison)
   - Stable (answer won't change over time)

   **Example Questions**:
   ```xml
   <evaluation>
     <qa_pair>
       <question>Find all miners in the fleet with hashrate below 90 TH/s and temperature above 70°C. What is the most common firmware version among these underperforming miners?</question>
       <answer>2.0.1</answer>
     </qa_pair>
     <qa_pair>
       <question>Identify the miner with the highest average temperature over the past 24 hours. What mining pool is this miner currently configured to use?</question>
       <answer>stratum+tcp://pool.braiins.com:3333</answer>
     </qa_pair>
     <!-- 8 more questions -->
   </evaluation>
   ```

4. **Verify Answers**:
   - Manually solve each question using the tools
   - Confirm single, stable answer
   - Document solution path

5. **Save Evaluation**:
   ```bash
   # Save to tests/evaluations/evaluation.xml
   ```

6. **Run Evaluation** (if harness available):
   ```bash
   npm run evaluate
   # Or: python scripts/run_evaluation.py
   ```

---

## Complete Example (Braiins OS MCP Server)

**Timeline**: ~4-6 hours (sequential, single agent)

### Hour 1-2: Phase 1 (Research & Planning)
```
✓ Loaded MCP protocol docs
✓ Loaded TypeScript SDK docs
✓ Studied Braiins OS API docs (WebFetch)
✓ Created implementation plan:
  - 5 tools (authenticate, list_miners, get_status, update_pool, update_firmware)
  - 2 resources (fleet_summary, miner_logs)
  - 1 prompt (troubleshoot_offline)
```

### Hour 3-4: Phase 2 (Implementation)
```
✓ Implemented shared utilities (API requests, formatters, error handlers)
✓ Implemented 5 tools (one by one, with tests)
✓ Implemented 2 resources (with caching)
✓ Implemented 1 prompt template
✓ All builds passing
```

### Hour 5: Phase 3 (Review & Refine)
```
✓ Code quality review passed (DRY, composable, consistent)
✓ TypeScript checklist complete (strict mode, no any, etc.)
✓ All unit tests passing (15 tests)
✓ Build successful
```

### Hour 6: Phase 4 (Evaluations)
```
✓ Created 10 complex evaluation questions
✓ Verified all answers manually
✓ Saved to tests/evaluations/evaluation.xml
✓ (Optional) Ran evaluation harness
```

**Final Output**:
```
✅ MCP Server Complete: braiins-os-mcp-server

**Deliverables**:
- 5 MCP Tools (all tested, all build)
- 2 MCP Resources (cached)
- 1 MCP Prompt Template
- 10 Evaluation Questions (verified)
- Comprehensive Documentation

**Quality Metrics**:
- Build: ✓ Passing
- Tests: ✓ 15/15 passing
- Type Safety: ✓ Full coverage
- Documentation: ✓ Complete

**Token Efficiency**:
- Single agent maintained context throughout
- ~5-7x baseline token usage (vs 15x for multi-agent)
- 35% more efficient than multi-agent approach

**Next Steps**:
1. Test with Claude Desktop
2. Deploy to production
3. Monitor agent usage patterns
4. Iterate based on feedback
```

---

## Benefits of Skills-First Approach

| Aspect | Skills-First (This Command) | Multi-Agent |
|--------|------------------------------|-------------|
| **Context Management** | Centralized, efficient | Distributed, overhead |
| **Token Usage** | 5-7x baseline | 15x baseline |
| **Timeline** | 4-6 hours | 2-3 days (with overhead) |
| **Coordination** | None needed | High orchestrator effort |
| **Best For** | 1-5 tools, sequential | 6+ tools, parallel |
| **Complexity** | Simple to use | Complex setup required |

---

## Skills Used

- **Primary**: `mcp-builder` (all 4 phases)
- **Secondary**: `builder-role-skill` (TDD workflow during Phase 2)

---

## Output

```
═══════════════════════════════════════════════════════════
  MCP Server Development Complete
═══════════════════════════════════════════════════════════

Server: braiins-os-mcp-server
Approach: Skills-First (Single Agent)
Timeline: 5 hours

Tools (5):
  ✓ authenticate
  ✓ list_miners
  ✓ get_miner_status
  ✓ update_pool_config
  ✓ update_firmware

Resources (2):
  ✓ miner_fleet_summary
  ✓ miner_logs

Prompts (1):
  ✓ troubleshoot_offline_miner

Quality:
  ✓ Build passing
  ✓ 15/15 tests passing
  ✓ Type safety: Full coverage
  ✓ 10 evaluation questions created

Next: Deploy to Claude Desktop or production
```

---

## Error Handling

1. **Too many tools (> 5)**:
   - **Warning**: "Consider using /mcp-orchestrate-server for parallel development"
   - **Suggestion**: Continue skills-first or switch to multi-agent

2. **Build fails**:
   - **Error**: TypeScript/Python compilation errors
   - **Solution**: Fix errors incrementally, run tests

3. **Evaluation questions fail**:
   - **Error**: Agent can't answer question
   - **Solution**: Iterate on tool implementation, improve error messages

---

## Permissions Required

```yaml
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill       # Load mcp-builder skill
  - WebFetch    # Load documentation
  - WebSearch   # Research API
```

---

## Version History

- **1.0.0** (2025-12-29): Initial release following 4-phase mcp-builder workflow

---

## Related Commands

- `/mcp-init` - Initialize project first
- `/mcp-tool-create` - Add individual tools
- `/mcp-orchestrate-server` - Multi-agent for complex servers
- `/mcp-evaluation-create` - Generate evaluations only

---

## References

- MCP Builder Skill: `docs/claude/skills-templates/mcp-builder/SKILL.md`
- Skills vs Multi-Agent: `docs/best-practices/09-Agent-Skills-vs-Multi-Agent.md`
- MCP Protocol: https://modelcontextprotocol.io/llms-full.txt
