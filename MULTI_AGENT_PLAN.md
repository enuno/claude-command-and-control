# MULTI_AGENT_PLAN.md: braiins-os-mcp-server Development
**Created:** 2025-12-29
**Project:** Braiins OS MCP Server
**Orchestration Type:** Hybrid Multi-Agent + Skills-First
**Estimated Timeline:** 2-3 days with parallel agents

---

## Executive Summary

### Current Project State (Analysis Complete)

**✅ Foundation Complete:**
- MCP server infrastructure implemented (`src/mcp/server.ts`)
- 8 MCP tools implemented and tested
- 2 MCP resources implemented
- 0 MCP prompts (directory exists but empty)
- gRPC client integration complete
- Redis caching layer integrated
- Test infrastructure in place

**🔨 Current Implementation:**

**Tools (8/15 target):**
1. ✅ `register_miner` - Register new miner with fleet
2. ✅ `unregister_miner` - Remove miner from fleet
3. ✅ `get_miner_status` - Get real-time miner status
4. ✅ `get_miner_info` - Get detailed miner information
5. ✅ `get_fleet_status` - Get aggregated fleet metrics
6. ✅ `reboot_miner` - Reboot a miner
7. ✅ `set_power_target` - Set power consumption target
8. ✅ `set_hashrate_target` - Set hashrate target

**Resources (2/5 target):**
1. ✅ `braiins:///fleet/summary` - Aggregated fleet metrics
2. ✅ `braiins:///miner/{id}/status` - Individual miner status

**Prompts (0/3 target):**
- Infrastructure ready, no prompts implemented yet

**📋 Remaining Work:**

**Missing High-Priority Tools:**
- `update_miner_firmware` - Firmware update with progress tracking (CRITICAL)
- `update_pool_config` - Change mining pool settings
- `ping_miner` - Test miner connectivity
- `get_miner_logs` - Retrieve miner logs
- `list_miners` - List all registered miners with filters
- `check_job_status` - Query background job progress
- `factory_reset` - Reset miner to factory defaults

**Missing Resources:**
- `braiins:///miner/{id}/logs` - Miner log history
- `braiins:///miner/{id}/config` - Miner configuration
- `braiins:///jobs/{id}` - Job status and progress

**Missing Prompts:**
- `troubleshoot_miner_offline` - Guided offline miner diagnostics
- `optimize_power_efficiency` - Power optimization workflow
- `batch_firmware_update` - Guided batch firmware update

---

## Orchestration Strategy

### Why Multi-Agent?

**Complexity Assessment:**
- **Total Components**: 7 new tools + 3 new resources + 3 new prompts = **13 components**
- **Complexity Level**: **Complex** (6+ tools threshold exceeded)
- **Timeline Pressure**: User requested session (90min target)
- **Parallelization Opportunity**: High (most tools are independent)

**Decision:** Use **Multi-Agent Orchestration** to achieve 60% faster completion.

### Agent Assignment Matrix

| Agent Role | Count | Model | Skills Loaded | Workstream |
|------------|-------|-------|---------------|------------|
| **Orchestrator** | 1 | Sonnet 4.5 | mcp-server-dev, multi-agent-planner | Coordination, integration |
| **Builder-1** | 1 | Sonnet 4.5 | mcp-server-dev, builder-role-skill | Firmware & Pool Tools |
| **Builder-2** | 1 | Sonnet 4.5 | mcp-server-dev, builder-role-skill | Monitoring & Logs Tools |
| **Builder-3** | 1 | Sonnet 4.5 | mcp-server-dev, builder-role-skill | Job Management & Utility Tools |
| **Builder-4** | 1 | Sonnet 4.5 | mcp-server-dev, builder-role-skill | Prompts & Resources |
| **Validator** | 1 | Sonnet 4.5 | mcp-server-dev, validator-role-skill | Testing & evaluation |
| **Scribe** | 1 | Sonnet 4.5 | scribe-role-skill | Documentation updates |

**Total Agents:** 7 (1 orchestrator + 4 parallel builders + 1 validator + 1 scribe)

---

## Phase 1: Parallel Workstreams (Day 1 - 4 hours)

### Workstream 1: Firmware & Pool Management Tools
**Agent:** Builder-1
**Priority:** CRITICAL
**Estimated Time:** 4 hours
**Dependencies:** None (can start immediately)

**Tasks:**
1. **Tool: `update_miner_firmware`**
   - Input: `{ minerIds: string[], version: string, force?: boolean, detailLevel?: "concise" | "verbose" }`
   - Output: `{ jobId, status, progress: { total, completed, failed } }`
   - Implementation:
     - Create background job
     - Download firmware from Braiins feed
     - Flash firmware via gRPC (with retry logic)
     - Track progress in Redis
     - Invalidate status caches on completion
   - Tests: Unit (happy path + errors), Integration (job tracking)

2. **Tool: `update_pool_config`**
   - Input: `{ minerIds: string[], poolUrl: string, username: string, password?: string }`
   - Output: `{ success: number, failed: number, details?: array }`
   - Implementation:
     - Validate pool URL (stratum protocol)
     - Update via gRPC in parallel (max 10 concurrent)
     - Atomic rollback on any failure
     - Cache invalidation
   - Tests: Unit (validation), Integration (gRPC calls)

**Deliverables:**
- ✅ 2 new tools fully implemented
- ✅ Unit tests (>85% coverage)
- ✅ Integration tests
- ✅ Documentation in tool JSDoc

---

### Workstream 2: Monitoring & Logs Tools
**Agent:** Builder-2
**Priority:** HIGH
**Estimated Time:** 3 hours
**Dependencies:** None (can start immediately)

**Tasks:**
1. **Tool: `get_miner_logs`**
   - Input: `{ minerId: string, lines?: number, level?: "error" | "warn" | "info", since?: ISO8601 }`
   - Output: `{ logs: array, total: number, truncated: boolean }`
   - Implementation:
     - Fetch logs via gRPC
     - Filter by level and time
     - Return concise format (timestamp, level, message)
   - Tests: Unit (filtering logic), Integration (gRPC)

2. **Tool: `ping_miner`**
   - Input: `{ minerId: string, timeout?: number }`
   - Output: `{ reachable: boolean, latency?: string, error?: { suggestions: string[] } }`
   - Implementation:
     - gRPC connectivity test with timeout
     - Actionable error messages with suggestions
     - Cache result for 10 seconds
   - Tests: Unit (timeout handling), Integration (connectivity)

3. **Resource: `braiins:///miner/{id}/logs`**
   - Returns recent logs for specified miner
   - Cached for 5 seconds (logs change frequently)
   - Pagination support via URI parameters

**Deliverables:**
- ✅ 2 new tools implemented
- ✅ 1 new resource implemented
- ✅ Tests + documentation

---

### Workstream 3: Job Management & Utility Tools
**Agent:** Builder-3
**Priority:** HIGH
**Estimated Time:** 3 hours
**Dependencies:** None (can start immediately)

**Tasks:**
1. **Tool: `list_miners`**
   - Input: `{ status?: "online" | "offline", tags?: string[], sortBy?: "name" | "hashrate" }`
   - Output: `{ miners: array, total: number, filters: object }`
   - Implementation:
     - Query database with filters
     - Sort and paginate results
     - Return concise miner list
   - Tests: Unit (filtering), Integration (database)

2. **Tool: `check_job_status`**
   - Input: `{ jobId: string, detailLevel?: "concise" | "verbose" }`
   - Output: `{ jobId, status, progress, errors?, completedAt? }`
   - Implementation:
     - Query job queue in Redis
     - Return current status and progress
     - Include error details if failed
   - Tests: Unit (status parsing), Integration (Redis)

3. **Tool: `factory_reset`**
   - Input: `{ minerId: string, confirm: boolean }`
   - Output: `{ success: boolean, message: string }`
   - Implementation:
     - Require `confirm: true` to prevent accidents
     - Call gRPC reset endpoint
     - Clear all cached data for miner
   - Tests: Unit (confirmation check), Integration (gRPC)

4. **Resource: `braiins:///jobs/{id}`**
   - Returns job status and detailed progress
   - Real-time updates via Redis pub/sub

**Deliverables:**
- ✅ 3 new tools implemented
- ✅ 1 new resource implemented
- ✅ Tests + documentation

---

### Workstream 4: Prompts & Additional Resources
**Agent:** Builder-4
**Priority:** MEDIUM
**Estimated Time:** 4 hours
**Dependencies:** Tools from other workstreams (can reference tool names)

**Tasks:**
1. **Prompt: `troubleshoot_miner_offline`**
   - Input: `minerId: string`
   - Output: Multi-turn conversation with diagnostic steps
   - Implementation:
     - Check last known status
     - Suggest `ping_miner` tool
     - Suggest `get_miner_logs` tool
     - Provide troubleshooting decision tree
   - Tests: Integration test (full prompt flow)

2. **Prompt: `optimize_power_efficiency`**
   - Input: `minerId: string, targetEfficiency?: number`
   - Output: Guided workflow to optimize power settings
   - Implementation:
     - Get current power and hashrate
     - Suggest optimal power target
     - Use `set_power_target` tool
     - Monitor results

3. **Prompt: `batch_firmware_update`**
   - Input: `minerIds: string[], version: string`
   - Output: Step-by-step batch update workflow
   - Implementation:
     - Pre-flight checks (connectivity, space)
     - Use `update_miner_firmware` tool
     - Monitor with `check_job_status`
     - Rollback guidance on failures

4. **Resource: `braiins:///miner/{id}/config`**
   - Returns full miner configuration
   - Cached for 60 seconds

**Deliverables:**
- ✅ 3 new prompts implemented
- ✅ 1 new resource implemented
- ✅ Tests + documentation

---

## Phase 2: Integration & Testing (Day 1 - 2 hours)

### Sequential Task 1: Integration Testing
**Agent:** Validator
**Priority:** CRITICAL
**Dependencies:** All parallel workstreams complete
**Estimated Time:** 2 hours

**Tasks:**
1. **Merge all worktree branches to main**
   ```bash
   git checkout main
   git merge worktree-builder-1/main --no-ff -m "Merge: Firmware & Pool Tools"
   git merge worktree-builder-2/main --no-ff -m "Merge: Monitoring & Logs Tools"
   git merge worktree-builder-3/main --no-ff -m "Merge: Job Management & Utility Tools"
   git merge worktree-builder-4/main --no-ff -m "Merge: Prompts & Resources"
   ```

2. **Resolve any integration conflicts**
   - Shared type definitions
   - Tool/resource registration in `index.ts` files
   - Server configuration

3. **Run Quality Gate**
   ```bash
   npm run type-check    # TypeScript compilation
   npm run lint          # ESLint validation
   npm test              # All unit + integration tests
   npm run test:coverage # Coverage report (target: >85%)
   ```

4. **Integration Test Scenarios**
   - **Firmware Update Workflow**: Update 3 miners → poll status → verify completion
   - **Troubleshooting Workflow**: Offline miner → ping → logs → diagnosis
   - **Batch Operations**: List miners → filter → update pool → verify
   - **Error Recovery**: Connection timeout → retry → actionable errors

**Deliverables:**
- ✅ All branches merged successfully
- ✅ Quality gate passing (lint, types, tests)
- ✅ Integration test suite passing
- ✅ Code coverage >85%

---

## Phase 3: Evaluation & Documentation (Day 2 - 2 hours)

### Sequential Task 2: Evaluation Harness
**Agent:** Validator
**Priority:** HIGH
**Dependencies:** Integration complete
**Estimated Time:** 1 hour

**Tasks:**
1. **Tool Inspection**: Generate list of all 15 tools with capabilities
2. **Create 10 Evaluation Questions**:

**Example Questions:**
```xml
<evaluation>
  <qa_pair>
    <question>Find all miners with hashrate below 90 TH/s. What firmware version is most common among them?</question>
    <answer>2.0.1</answer>
    <tools_used>list_miners, get_miner_info</tools_used>
  </qa_pair>

  <qa_pair>
    <question>Miner miner-005 is offline. Use the troubleshooting workflow to diagnose and fix the issue.</question>
    <answer>Miner unreachable due to network issue. Suggested checking network connectivity.</answer>
    <tools_used>troubleshoot_miner_offline, ping_miner, get_miner_logs</tools_used>
  </qa_pair>

  <qa_pair>
    <question>Update firmware to version 2.1.0 on all miners with tags "production" and hashrate > 95 TH/s. Track progress.</question>
    <answer>Job job-abc123 created with 12 miners. 10 completed successfully, 2 failed.</answer>
    <tools_used>list_miners, update_miner_firmware, check_job_status</tools_used>
  </qa_pair>

  <!-- 7 more questions covering all tool combinations -->
</evaluation>
```

3. **Run Evaluation**: Execute questions and verify answers
4. **Fix Failing Evaluations**: Iterate on tools with failures

**Deliverables:**
- ✅ 10/10 evaluation questions passing
- ✅ Average response time < 2 seconds
- ✅ Evaluation report in `tests/evaluations/`

---

### Sequential Task 3: Documentation Updates
**Agent:** Scribe
**Priority:** MEDIUM
**Dependencies:** Evaluation complete
**Estimated Time:** 1 hour

**Tasks:**
1. **Update README.md**:
   - Tool count: 15 (8 existing + 7 new)
   - Resource count: 5 (2 existing + 3 new)
   - Prompt count: 3 (all new)
   - Installation instructions
   - Usage examples for new tools

2. **Update CLAUDE.md**:
   - Add new tool patterns
   - Document prompt workflows
   - Update performance metrics

3. **Create API.md** (if not exists):
   - Full tool reference with examples
   - Resource URI patterns
   - Prompt usage guide

4. **Update DEVELOPMENT_PLAN.md**:
   - Mark Phase 1-2 as complete
   - Update progress metrics
   - Record multi-agent approach outcomes

**Deliverables:**
- ✅ README.md updated with all new features
- ✅ CLAUDE.md updated with patterns
- ✅ API documentation complete
- ✅ DEVELOPMENT_PLAN.md progress updated

---

## Phase 4: Deployment Preparation (Day 2 - 1 hour)

### Final Cleanup & Summary
**Agent:** Orchestrator
**Priority:** LOW
**Estimated Time:** 30 minutes

**Tasks:**
1. **Remove worktrees**:
   ```bash
   git worktree remove worktree-builder-1
   git worktree remove worktree-builder-2
   git worktree remove worktree-builder-3
   git worktree remove worktree-builder-4
   ```

2. **Update SESSION_LOG.md** with outcomes

3. **Create deployment checklist**:
   - Environment variables verified
   - Redis connection tested
   - gRPC endpoints accessible
   - All tests passing

4. **Tag release** (optional):
   ```bash
   git tag -a v1.0.0 -m "MCP Server v1.0.0: Complete tool suite"
   git push origin v1.0.0
   ```

**Deliverables:**
- ✅ Clean repository state
- ✅ Session log updated
- ✅ Deployment checklist complete

---

## Timeline Summary

| Phase | Duration | Agents | Mode | Dependencies |
|-------|----------|--------|------|--------------|
| **Phase 1: Parallel Development** | 4 hours | Builder-1,2,3,4 | Parallel | None |
| **Phase 2: Integration & Testing** | 2 hours | Validator | Sequential | Phase 1 complete |
| **Phase 3: Evaluation & Docs** | 2 hours | Validator, Scribe | Sequential | Phase 2 complete |
| **Phase 4: Cleanup** | 30 min | Orchestrator | Sequential | Phase 3 complete |
| **TOTAL** | **8.5 hours** | 7 agents | Hybrid | — |

**Compared to Sequential**: ~15 hours → **43% time savings**

---

## Success Metrics

### Technical Metrics
- ✅ 15 MCP tools implemented and tested (8 existing + 7 new)
- ✅ 5 MCP resources implemented (2 existing + 3 new)
- ✅ 3 MCP prompts implemented (all new)
- ✅ Code coverage >85%
- ✅ All TypeScript types valid
- ✅ All ESLint rules passing
- ✅ Integration tests passing

### Quality Metrics
- ✅ 10/10 evaluation questions passing
- ✅ Response times <2s per tool
- ✅ Error messages actionable and clear
- ✅ Documentation complete and accurate

### Process Metrics
- ✅ Multi-agent orchestration successful
- ✅ No merge conflicts (or all resolved)
- ✅ All worktrees cleaned up
- ✅ Session log complete

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Integration Conflicts** | High | Medium | Define clear type interfaces upfront |
| **Tool Dependencies** | Medium | Low | Builder-4 references tool names only |
| **Test Failures** | High | Medium | Quality gate catches issues early |
| **Time Overrun** | Medium | Low | Parallel execution reduces overall time |
| **Context Loss** | Low | Very Low | Worktrees isolate agent contexts |

---

## Agent Coordination Protocol

### Communication Channels
1. **MULTI_AGENT_PLAN.md** (this file) - Source of truth for assignments
2. **Git commits** - Progress tracking
3. **Redis pub/sub** (optional) - Real-time status updates
4. **SESSION_LOG.md** - Final outcomes

### Progress Reporting
Each builder agent commits after completing each task:
```bash
git commit -m "feat(tools): implement update_miner_firmware tool"
git commit -m "test(tools): add update_miner_firmware tests"
git commit -m "docs(tools): document update_miner_firmware usage"
```

### Blocker Resolution
If any agent encounters blockers:
1. Document in commit message
2. Mark task as "blocked" in progress tracker
3. Notify orchestrator
4. Orchestrator reassigns or assists

---

## Execution Checklist

### Pre-Execution
- [ ] All agents have access to codebase
- [ ] Git worktrees created (4 for builders)
- [ ] Skills loaded: mcp-server-dev, builder-role-skill, etc.
- [ ] MULTI_AGENT_PLAN.md reviewed and approved by user

### During Execution
- [ ] Orchestrator monitors progress every 15 minutes
- [ ] Builders commit frequently (at least hourly)
- [ ] Quality checks run before integration
- [ ] Blockers documented and resolved quickly

### Post-Execution
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Worktrees removed
- [ ] Session log complete
- [ ] User approval received

---

## Next Steps

**Awaiting user approval to proceed with orchestration.**

Once approved:
1. Orchestrator creates 4 git worktrees
2. Spawns 4 builder agents in parallel
3. Monitors progress and coordinates
4. Triggers sequential phases when dependencies met
5. Delivers complete MCP server with 15 tools, 5 resources, 3 prompts

**Estimated completion:** 8.5 hours (vs 15 hours sequential)

---

**Document Owner:** Orchestrator Agent (Sonnet 4.5)
**Created:** 2025-12-29
**Status:** Awaiting Approval
**Next Review:** After user approval → execution begins
