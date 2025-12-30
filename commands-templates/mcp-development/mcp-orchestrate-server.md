# /mcp-orchestrate-server - Multi-Agent MCP Server Development

**Version**: 1.0.0
**Category**: MCP Orchestration
**Paradigm**: Multi-Agent (Hybrid Approach)
**Last Updated**: December 29, 2025

---

## Purpose

Orchestrate multi-agent development of complex MCP servers. Decomposes server development into parallel workstreams, spawns specialized agents with appropriate skills, and coordinates integration. Use when building MCP servers with multiple tools, resources, and prompts that can be developed concurrently.

---

## When to Use Multi-Agent Approach

**✅ Use Multi-Agent When**:
- Developing 5+ MCP tools simultaneously
- Researching multiple API integrations in parallel
- Building multiple MCP servers for comparison
- Exploring alternative implementation approaches
- Time-sensitive deliverables requiring parallel work

**❌ Don't Use Multi-Agent For**:
- Single tool implementation (use `/mcp-tool-create`)
- Sequential MCP development
- Simple servers (< 3 tools)
- Context-heavy design decisions

**Decision Matrix**:
| Server Complexity | Tools | Resources | Prompts | Approach |
|-------------------|-------|-----------|---------|----------|
| Simple | 1-2 | 0-1 | 0-1 | Skills-First (`/mcp-server-build`) |
| Moderate | 3-5 | 1-3 | 1-2 | Skills-First with task breakdown |
| Complex | 6+ | 4+ | 3+ | Multi-Agent Orchestration (this command) |

---

## Usage

```bash
/mcp-orchestrate-server
```

**Agent will ask**:
- Server purpose and scope
- API/service to integrate
- Estimated number of tools/resources/prompts
- Timeline requirements

---

## Workflow (Multi-Agent Orchestration)

### Phase 1: Planning & Decomposition

**Orchestrator Agent loads**: `multi-agent-planner` skill

1. **Gather Requirements**:
   - Server name and purpose
   - External service/API to integrate
   - API documentation URL
   - Estimated complexity (tools count, resources, prompts)

2. **Load MCP Builder Skill for Research Phase**:
   ```
   Agent loads: mcp-builder skill Phase 1 (Deep Research)
   ```

3. **API Research** (Can be parallelized):

   **Option A: Sequential Research** (single agent):
   - Agent studies API documentation
   - Identifies endpoints to implement
   - Maps endpoints to MCP tools/resources

   **Option B: Parallel Research** (multi-agent):
   ```
   Spawn 2-3 Researcher Agents:
   - Agent 1: Authentication & authorization endpoints
   - Agent 2: Core data/CRUD endpoints
   - Agent 3: Advanced features/streaming endpoints

   Each loads: mcp-builder skill + researcher-role-skill
   ```

4. **Create MULTI_AGENT_PLAN.md**:
   ```markdown
   # MCP Server: braiins-os-mcp-server

   ## Overview
   - **Service**: Braiins OS API
   - **Total Tools**: 15
   - **Total Resources**: 5
   - **Total Prompts**: 3
   - **Estimated Timeline**: 2-3 days with 4 parallel agents

   ## Task Breakdown

   ### Parallel Group 1: Authentication & Core Tools (Day 1)
   - **Agent**: Builder-1 (loads mcp-builder + builder-role-skill)
   - **Tasks**:
     - Tool: authenticate
     - Tool: list_miners
     - Tool: get_miner_status
     - Resource: miner_fleet_summary

   ### Parallel Group 2: Configuration Tools (Day 1)
   - **Agent**: Builder-2 (loads mcp-builder + builder-role-skill)
   - **Tasks**:
     - Tool: update_pool_config
     - Tool: update_power_settings
     - Tool: update_fan_settings
     - Resource: miner_config_schema

   ### Parallel Group 3: Firmware & Advanced Tools (Day 2)
   - **Agent**: Builder-3 (loads mcp-builder + builder-role-skill)
   - **Tasks**:
     - Tool: update_firmware
     - Tool: reboot_miner
     - Tool: factory_reset
     - Prompt: troubleshoot_offline_miner

   ### Parallel Group 4: Monitoring & Resources (Day 2)
   - **Agent**: Builder-4 (loads mcp-builder + builder-role-skill)
   - **Tasks**:
     - Resource: miner_logs
     - Resource: hashrate_history
     - Prompt: optimize_power_efficiency

   ### Sequential Group 5: Testing & Validation (Day 3)
   - **Agent**: Validator (loads mcp-builder + validator-role-skill)
   - **Dependencies**: All parallel groups complete
   - **Tasks**:
     - Create 10 evaluation questions
     - Run evaluation harness
     - Fix failing evaluations

   ### Sequential Group 6: Documentation & Integration (Day 3)
   - **Agent**: Scribe (loads scribe-role-skill)
   - **Dependencies**: Testing complete
   - **Tasks**:
     - Update README.md with all tools
     - Create API documentation
     - Write deployment guide
   ```

### Phase 2: Spawn Worker Agents in Parallel

**Orchestrator uses**: `spawn-agents` command

```bash
# Orchestrator spawns 4 builder agents in parallel
/spawn-agents --agents="builder-1,builder-2,builder-3,builder-4" \
              --isolation="worktree" \
              --skills="mcp-builder,builder-role-skill"
```

**Worktree Structure**:
```
project/
├── main/                           # Orchestrator workspace
│   └── MULTI_AGENT_PLAN.md
├── worktree-builder-1/             # Builder-1 isolated workspace
│   └── src/tools/authenticate.ts
├── worktree-builder-2/             # Builder-2 isolated workspace
│   └── src/tools/update_pool.ts
├── worktree-builder-3/             # Builder-3 isolated workspace
│   └── src/tools/update_firmware.ts
└── worktree-builder-4/             # Builder-4 isolated workspace
    └── src/resources/miner_logs.ts
```

**Each Worker Agent**:
1. Loads specified skills (`mcp-builder`, `builder-role-skill`)
2. Receives task list from MULTI_AGENT_PLAN.md
3. Works independently in isolated worktree
4. Follows mcp-builder skill Phase 2 (Implementation)
5. Runs own tests before signaling completion

### Phase 3: Coordination & Progress Monitoring

**Orchestrator uses**: `coordinate-workflow` command

```bash
/coordinate-workflow --plan="MULTI_AGENT_PLAN.md" \
                     --interval="5min"
```

**Monitoring**:
```
═══════════════════════════════════════════════════════════
  MCP Server Development Progress
═══════════════════════════════════════════════════════════

Parallel Group 1: Authentication & Core Tools
  Builder-1  [████████████████░░░░] 80% (3/4 tools complete)
  Status: Working on get_miner_status

Parallel Group 2: Configuration Tools
  Builder-2  [████████████████████] 100% (4/4 tools complete)
  Status: All tasks complete, ready for integration

Parallel Group 3: Firmware & Advanced Tools
  Builder-3  [███████░░░░░░░░░░░░] 40% (1/3 tools, 0/1 prompts)
  Status: update_firmware in progress

Parallel Group 4: Monitoring & Resources
  Builder-4  [██████████░░░░░░░░░░] 50% (1/2 resources, 0/1 prompts)
  Status: miner_logs complete, working on hashrate_history

Blocked: None
Next Milestone: All parallel groups → Day 2 (Testing)
```

**Orchestrator Responsibilities**:
- Monitor each worker's progress
- Resolve blockers (API questions, shared utilities)
- Coordinate shared resource creation (e.g., common types file)
- Trigger sequential groups when dependencies complete

### Phase 4: Integration & Validation

**Integration Orchestrator Agent loads**: `integration-orchestrator-role`

1. **Merge Worker Results**:
   ```bash
   # From orchestrator workspace
   git checkout main
   git merge worktree-builder-1/main --no-ff -m "Merge Builder-1: Auth & Core Tools"
   git merge worktree-builder-2/main --no-ff -m "Merge Builder-2: Config Tools"
   git merge worktree-builder-3/main --no-ff -m "Merge Builder-3: Firmware Tools"
   git merge worktree-builder-4/main --no-ff -m "Merge Builder-4: Monitoring"
   ```

2. **Resolve Integration Conflicts**:
   - Shared types/interfaces
   - Common utility functions
   - Server registration code

3. **Run Quality Gate**:
   ```bash
   /quality-gate --components="all" \
                 --tests="unit,integration" \
                 --coverage="80"
   ```

**Quality Gate Checks**:
- ✓ All tools registered in server
- ✓ All resources registered
- ✓ All prompts registered
- ✓ No TypeScript/Python errors
- ✓ Unit tests pass
- ✓ Integration tests pass
- ✓ Code coverage ≥ 80%
- ✓ No security vulnerabilities

### Phase 5: Evaluation & Testing

**Validator Agent loads**: `mcp-builder` skill Phase 4 (Create Evaluations)

```bash
/mcp-evaluation-create --tools="all" \
                       --questions=10 \
                       --complexity="complex"
```

**Evaluation Process**:
1. **Tool Inspection**: List all 15 tools and their capabilities
2. **Content Exploration**: Use read-only tools to explore data
3. **Question Generation**: Create 10 complex, realistic questions
4. **Answer Verification**: Solve each question to verify correctness

**Example Evaluation Questions**:
```xml
<evaluation>
  <qa_pair>
    <question>Find all miners in the fleet with hashrate below 90 TH/s and temperature above 70°C. What firmware version is most common among these underperforming miners?</question>
    <answer>2.0.1</answer>
  </qa_pair>
  <!-- 9 more questions -->
</evaluation>
```

5. **Run Evaluation**:
   ```bash
   npm run evaluate
   # Or: python scripts/run_evaluation.py
   ```

6. **Fix Failing Evaluations**:
   - Iterate on tools that fail
   - Improve error messages
   - Add missing capabilities

### Phase 6: Documentation & Deployment

**Scribe Agent loads**: `scribe-role-skill`

1. **Generate Comprehensive README.md**:
   ```markdown
   # MCP Server: braiins-os-mcp-server

   ## Tools (15)

   ### Authentication
   - `authenticate` - Authenticate with API key

   ### Miner Management
   - `list_miners` - List all miners in fleet
   - `get_miner_status` - Get real-time status
   - ... (all 15 tools documented)

   ## Resources (5)
   - `miner_fleet_summary` - Aggregated fleet metrics
   - ... (all 5 resources)

   ## Prompts (3)
   - `troubleshoot_offline_miner` - Guided troubleshooting
   - ... (all 3 prompts)

   ## Installation
   ```bash
   npm install
   npm run build
   ```

   ## Usage
   ```bash
   node dist/index.js
   ```

   ## Evaluation Results
   - 10/10 questions passing
   - Average response time: 1.2s
   ```

2. **Create Deployment Guide**:
   - Claude Desktop configuration
   - Environment variables
   - Troubleshooting common issues

### Phase 7: Cleanup & Summary

1. **Remove Worktrees**:
   ```bash
   git worktree remove worktree-builder-1
   git worktree remove worktree-builder-2
   git worktree remove worktree-builder-3
   git worktree remove worktree-builder-4
   ```

2. **Generate Summary**:
   ```markdown
   ✅ MCP Server Development Complete: braiins-os-mcp-server

   **Development Timeline**:
   - Day 1: Parallel tool development (Groups 1-4)
   - Day 2: Integration & validation
   - Day 3: Testing, documentation, deployment prep

   **Deliverables**:
   - 15 MCP Tools (all tested)
   - 5 MCP Resources
   - 3 MCP Prompts
   - 10 Evaluation Questions (10/10 passing)
   - Comprehensive Documentation

   **Agents Used**:
   - Orchestrator (planning & coordination)
   - Builder-1, Builder-2, Builder-3, Builder-4 (parallel development)
   - Validator (testing & evaluation)
   - Scribe (documentation)

   **Performance Metrics**:
   - Total Time: 2.5 days (vs 5-7 days sequential)
   - Token Efficiency: 15x baseline (multi-agent overhead)
   - Quality: 10/10 evaluations passing

   **Next Steps**:
   1. Deploy to production
   2. Monitor real-world usage
   3. Gather agent feedback
   4. Iterate on tools based on usage patterns
   ```

---

## Orchestration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Orchestrator Lead (Opus 4)                                  │
│ • Creates MULTI_AGENT_PLAN.md with task decomposition       │
│ • Spawns 4 builder agents in parallel worktrees             │
│ • Monitors progress every 5 minutes                          │
│ • Resolves blockers and coordinates shared resources        │
│ • Triggers sequential groups when dependencies complete     │
│ • Synthesizes results and runs quality gates                │
│ Skills: multi-agent-planner, mcp-builder (Phase 1)          │
└─────────────┬───────────────────────────────────────────────┘
              │
     ┌────────┼────────┬────────┬────────┐
     │        │        │        │        │
┌────▼─────┐ ┌▼──────┐ ┌▼──────┐ ┌▼──────┐
│Builder-1 │ │Builder-2│ │Builder-3│ │Builder-4│
│(Sonnet 4)│ │(Sonnet4)│ │(Sonnet4)│ │(Sonnet4)│
│Worktree 1│ │Worktree2│ │Worktree3│ │Worktree4│
│          │ │         │ │         │ │         │
│Auth+Core │ │Config   │ │Firmware │ │Monitor  │
│Tools     │ │Tools    │ │Tools    │ │Resources│
│          │ │         │ │         │ │         │
│Skills:   │ │Skills:  │ │Skills:  │ │Skills:  │
│mcp-builder││mcp-builder│mcp-builder│mcp-builder│
│builder   │ │builder  │ │builder  │ │builder  │
└──────────┘ └─────────┘ └─────────┘ └─────────┘

     Sequential Groups (After Parallel Complete):

     ┌──────────┐         ┌──────────┐
     │Validator │         │ Scribe   │
     │(Sonnet 4)│────────▶│(Sonnet 4)│
     │          │         │          │
     │Evaluation│         │   Docs   │
     │& Testing │         │          │
     │          │         │          │
     │Skills:   │         │Skills:   │
     │mcp-builder│         │scribe    │
     │validator │         │          │
     └──────────┘         └──────────┘
```

---

## Skills Used by Each Agent

| Agent Role | Skills Loaded | Purpose |
|------------|---------------|---------|
| **Orchestrator Lead** | multi-agent-planner, mcp-builder (Phase 1) | Planning, coordination, integration |
| **Builder Agents** | mcp-builder (Phase 2), builder-role-skill | Parallel tool/resource implementation |
| **Validator Agent** | mcp-builder (Phase 4), validator-role-skill | Evaluation creation & testing |
| **Scribe Agent** | scribe-role-skill | Documentation generation |

---

## Performance Comparison

| Aspect | Sequential (Skills-First) | Multi-Agent Orchestration |
|--------|---------------------------|---------------------------|
| **Timeline** | 5-7 days | 2-3 days (60% faster) |
| **Token Usage** | 5-7x baseline | 15x baseline |
| **Context Management** | Centralized, efficient | Distributed, overhead |
| **Best For** | Simple-moderate servers | Complex servers (6+ tools) |
| **Coordination Effort** | None | High (orchestrator needed) |
| **Quality** | Consistent | Requires quality gates |

---

## Error Handling

1. **Worker Agent Fails**:
   - **Error**: `Builder-2 crashed during tool implementation`
   - **Recovery**: Orchestrator respawns agent with same task list

2. **Integration Conflicts**:
   - **Error**: `Merge conflict in server.ts`
   - **Resolution**: Integration Orchestrator resolves conflicts manually

3. **Evaluation Failures**:
   - **Error**: `3/10 evaluation questions failing`
   - **Resolution**: Validator iterates on failing tools

---

## Permissions Required

```yaml
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill
  - Task          # For spawning sub-agents
  - TodoWrite     # For progress tracking
```

---

## When NOT to Use This Command

Use simpler alternatives:
- **1-2 tools**: Use `/mcp-tool-create` directly
- **3-5 tools**: Use `/mcp-server-build` (skills-first, single agent)
- **Research only**: Not building yet, just exploring

---

## Version History

- **1.0.0** (2025-12-29): Initial release with hybrid multi-agent + skills approach

---

## Related Commands

- `/mcp-init` - Initialize MCP server project
- `/mcp-server-build` - Skills-first server development (simpler)
- `/mcp-parallel-tools` - Parallel tool development only
- `/spawn-agents` - Spawn worker agents in worktrees
- `/coordinate-workflow` - Monitor multi-agent progress
- `/quality-gate` - Multi-stage validation pipeline

---

## References

- Multi-Agent Orchestration: `docs/best-practices/04-Multi-Agent-Orchestration.md`
- Skills vs Multi-Agent: `docs/best-practices/09-Agent-Skills-vs-Multi-Agent.md`
- Multi-Agent Planner Skill: `skills-templates/orchestration/multi-agent-planner-skill.md`
- MCP Builder Skill: `skills-templates/mcp-builder/SKILL.md`
