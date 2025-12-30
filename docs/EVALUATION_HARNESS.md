# MCP Server Evaluation Harness Guide

**Version:** 1.0.0
**Last Updated:** December 2025
**Purpose:** Validate MCP server tool, resource, and prompt implementations

---

## Table of Contents

1. [Overview](#overview)
2. [Evaluation Template Structure](#evaluation-template-structure)
3. [Running Evaluations](#running-evaluations)
4. [Creating Custom Evaluations](#creating-custom-evaluations)
5. [Interpreting Results](#interpreting-results)
6. [Best Practices](#best-practices)

---

## Overview

The MCP Server Evaluation Harness provides a standardized way to test that your MCP tools, resources, and prompts work correctly from an AI agent's perspective. Unlike traditional unit tests that verify code correctness, evaluations verify **agent usability** - whether an AI agent can successfully use your tools to accomplish real-world tasks.

### Why Evaluation Harnesses?

**Traditional Tests vs. Evaluations:**

| Aspect | Unit/Integration Tests | Evaluation Harness |
|--------|----------------------|-------------------|
| **Perspective** | Developer/code-centric | Agent/user-centric |
| **What's Tested** | Function correctness | Task completeness |
| **Input Format** | Direct function calls | Natural language queries |
| **Success Criteria** | Exact output match | Semantic correctness |
| **Purpose** | Verify implementation | Validate usability |

**Example:**

```typescript
// Unit Test (Developer Perspective)
it('should return miner status', async () => {
  const result = await getMinerStatus('miner-001');
  expect(result.online).toBe(true);
  expect(result.hashrate).toBeDefined();
});

// Evaluation (Agent Perspective)
<question>What is the current status of miner-001? Include hashrate and temperature.</question>
<answer>
  Status: running
  Hashrate: 95 TH/s
  Temperature: 65°C
</answer>
```

The evaluation tests whether an agent can:
1. Understand the natural language query
2. Select the correct tool (`get_miner_status`)
3. Extract the right parameters (`minerId: 'miner-001'`)
4. Format the response appropriately (hashrate + temperature)

---

## Evaluation Template Structure

### File Format

Evaluations are written in XML for structured, machine-readable validation.

**Location**: `tests/evaluations/evaluation-template.xml`

### Template Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<evaluation>
  <metadata>
    <version>1.0.0</version>
    <created>2025-12-29</created>
    <total_questions>10</total_questions>
    <passing_criteria>10/10 correct</passing_criteria>
  </metadata>

  <qa_pair id="1">
    <question>Natural language query an agent would ask</question>
    <answer>Expected answer or outcome</answer>
    <tools_used>Comma-separated list of tools/resources</tools_used>
    <complexity>simple | medium | complex</complexity>
    <category>monitoring | configuration | troubleshooting | batch_operations</category>
  </qa_pair>

  <!-- More qa_pairs... -->
</evaluation>
```

### Field Definitions

#### `<metadata>`
- `version`: Evaluation harness version (semantic versioning)
- `created`: Creation date (YYYY-MM-DD)
- `total_questions`: Number of Q&A pairs in this evaluation
- `passing_criteria`: Success threshold (e.g., "10/10 correct", "8/10 correct")

#### `<qa_pair>`
- `id`: Unique identifier for this question (sequential numbering recommended)
- `<question>`: The query an AI agent would ask (natural language)
- `<answer>`: Expected answer or outcome (can be structured or narrative)
- `<tools_used>`: Tools, resources, or prompts expected to be invoked
- `<complexity>`: Difficulty level
  - `simple`: Single tool invocation, straightforward parameters
  - `medium`: Multiple tools or conditional logic required
  - `complex`: Multi-step workflow, error handling, or prompt usage
- `<category>`: Task category
  - `monitoring`: Status queries, log retrieval, fleet overview
  - `configuration`: Settings changes, pool updates, power targets
  - `troubleshooting`: Diagnosing issues, connectivity tests, log analysis
  - `batch_operations`: Multi-miner operations, firmware updates

---

## Running Evaluations

### Automated Evaluation

**Using the Evaluation Runner (Planned)**:

```bash
# Run full evaluation suite
npm run evaluate

# Run specific category
npm run evaluate -- --category=monitoring

# Run with detailed output
npm run evaluate -- --verbose

# Generate HTML report
npm run evaluate -- --report=html --output=./reports/evaluation.html
```

**Expected Output**:

```
MCP Server Evaluation Results
================================

✅ Question 1: Simple Tool Invocation
   Category: monitoring | Complexity: simple
   Tools Used: get_miner_status
   Status: PASS
   Duration: 245ms

✅ Question 2: Resource Query
   Category: monitoring | Complexity: simple
   Tools Used: braiins:///fleet/summary (resource)
   Status: PASS
   Duration: 120ms

❌ Question 6: Batch Firmware Update
   Category: batch_operations | Complexity: complex
   Tools Used: list_miners, update_miner_firmware, check_job_status
   Status: FAIL
   Reason: Agent did not call check_job_status for progress tracking
   Duration: 1.2s

================================
Results: 9/10 PASSED (90%)
Passing Criteria: 10/10 (100%)
Status: FAILED
```

### Manual Evaluation

For manual testing with Claude or another AI agent:

1. **Start your MCP server**:
   ```bash
   npm run dev
   ```

2. **Connect Claude Code to your server**:
   ```json
   // .claude/mcp_settings.json
   {
     "mcpServers": {
       "braiins-os": {
         "command": "node",
         "args": ["dist/index.js"],
         "env": { "NODE_ENV": "development" }
       }
     }
   }
   ```

3. **Ask evaluation questions directly**:
   ```
   You: What is the current status of miner-001? Include hashrate and temperature.

   Claude: [Uses get_miner_status tool]
   Status: running
   Hashrate: 95 TH/s
   Temperature: 65°C
   ```

4. **Verify against expected answer**:
   - Did Claude select the right tool?
   - Are all required fields present?
   - Is the information semantically correct?

---

## Creating Custom Evaluations

### Step 1: Identify Test Scenarios

**Good Evaluation Questions Cover:**
- **Happy Path**: Tools work as expected with valid inputs
- **Edge Cases**: Empty results, boundary conditions, optional parameters
- **Error Handling**: Invalid inputs, unreachable miners, timeouts
- **Multi-Tool Workflows**: Complex tasks requiring multiple tools
- **Prompt Guidance**: Scenarios where prompts should guide the agent

**Example Scenarios:**

```xml
<!-- Happy Path: Simple status query -->
<qa_pair id="1">
  <question>Show me the status of miner-001</question>
  <answer>Status: online, Hashrate: 95 TH/s</answer>
  <tools_used>get_miner_status</tools_used>
  <complexity>simple</complexity>
  <category>monitoring</category>
</qa_pair>

<!-- Edge Case: Offline miner -->
<qa_pair id="2">
  <question>What's the status of miner-999 (offline miner)?</question>
  <answer>Status: offline. Last seen: 2 hours ago. Suggestion: Use ping_miner to test connectivity.</answer>
  <tools_used>get_miner_status</tools_used>
  <complexity>simple</complexity>
  <category>monitoring</category>
</qa_pair>

<!-- Error Handling: Invalid miner ID -->
<qa_pair id="3">
  <question>Get status for miner-invalid</question>
  <answer>Error: Miner not found. Suggestion: Use list_miners to see all registered miners.</answer>
  <tools_used>get_miner_status</tools_used>
  <complexity>simple</complexity>
  <category>monitoring</category>
</qa_pair>

<!-- Multi-Tool Workflow: Batch firmware update with validation -->
<qa_pair id="4">
  <question>Update firmware to 2.1.0 on all miners with hashrate > 95 TH/s</question>
  <answer>
    [Agent should:]
    1. Use list_miners to filter miners
    2. Use update_miner_firmware with filtered list
    3. Use check_job_status to track progress
  </answer>
  <tools_used>list_miners, update_miner_firmware, check_job_status</tools_used>
  <complexity>complex</complexity>
  <category>batch_operations</category>
</qa_pair>

<!-- Prompt Guidance: Troubleshooting workflow -->
<qa_pair id="5">
  <question>Miner-005 is offline. Help me troubleshoot it.</question>
  <answer>
    [Agent should use troubleshoot_miner_offline prompt, which guides through:]
    1. Check last known status
    2. Ping miner
    3. Check logs
    4. Suggest remediation
  </answer>
  <tools_used>troubleshoot_miner_offline (prompt), ping_miner, get_miner_logs</tools_used>
  <complexity>complex</complexity>
  <category>troubleshooting</category>
</qa_pair>
```

### Step 2: Write XML Structure

```xml
<qa_pair id="YOUR_ID">
  <question>
    Natural language query that an agent would receive.
    Be specific about what information is requested.
  </question>

  <answer>
    Expected output format. Include:
    - Key data fields (status, hashrate, temperature, etc.)
    - Expected tool behavior (e.g., "should call X then Y")
    - Error messages and suggestions (if applicable)

    For complex workflows, use structured format:
    Step 1: Action
    Step 2: Action
    Result: Expected outcome
  </answer>

  <tools_used>
    Comma-separated list of tools/resources/prompts.
    Format: tool_name, resource:uri, or prompt_name (prompt)
    Example: get_miner_status, braiins:///fleet/summary (resource), troubleshoot_miner_offline (prompt)
  </tools_used>

  <complexity>
    simple | medium | complex
  </complexity>

  <category>
    monitoring | configuration | troubleshooting | batch_operations
  </category>
</qa_pair>
```

### Step 3: Add to Evaluation File

Add your Q&A pair to `tests/evaluations/evaluation-template.xml`, incrementing the `id` and updating `<total_questions>` in metadata.

---

## Interpreting Results

### Success Criteria

**PASS Conditions:**
- Agent selects correct tool(s) or resource(s)
- All required parameters provided correctly
- Response includes expected information
- Error handling (if applicable) provides actionable guidance
- Multi-tool workflows follow logical order

**FAIL Conditions:**
- Wrong tool selected
- Missing required parameters
- Incorrect response format
- Missing expected information
- Error messages lack actionable guidance
- Multi-tool workflows out of order or incomplete

### Common Failure Patterns

#### 1. Tool Selection Failure

**Symptom:** Agent uses wrong tool or doesn't know which tool to use

**Example:**
```
Question: "Show me fleet summary"
Expected: Uses braiins:///fleet/summary resource
Actual: Calls get_miner_status for each miner individually
```

**Root Cause:** Tool/resource descriptions not clear enough

**Fix:** Improve tool descriptions to disambiguate use cases

#### 2. Parameter Extraction Failure

**Symptom:** Agent calls correct tool but with wrong parameters

**Example:**
```
Question: "Update firmware to 2.1.0 on miner-001 and miner-002"
Expected: update_miner_firmware({ minerIds: ["miner-001", "miner-002"], version: "2.1.0" })
Actual: update_miner_firmware({ minerId: "miner-001,miner-002", version: "2.1.0" })
```

**Root Cause:** Input schema not clear (array vs. comma-separated string)

**Fix:** Clarify input schema in tool definition

#### 3. Response Formatting Failure

**Symptom:** Agent returns data but in unusable format

**Example:**
```
Question: "What's the hashrate of miner-001?"
Expected: "95 TH/s"
Actual: "{ hashrate: { gigahash_per_second: 95000 } }"
```

**Root Cause:** Agent doesn't know how to format output for end user

**Fix:** Provide output examples in tool descriptions

#### 4. Workflow Incompleteness

**Symptom:** Agent starts workflow but doesn't complete it

**Example:**
```
Question: "Update firmware on all online miners"
Expected: list_miners → update_miner_firmware → check_job_status
Actual: list_miners → update_miner_firmware [stops here]
```

**Root Cause:** Agent doesn't know to track async operations

**Fix:** Clarify in tool description that background jobs should be tracked

---

## Best Practices

### Writing Good Evaluation Questions

1. **Be Specific**: "Get miner status" → "Get status for miner-001 including hashrate and temperature"
2. **Test Edge Cases**: Include offline miners, invalid IDs, empty results
3. **Vary Complexity**: Mix simple (1 tool) and complex (multi-tool workflows)
4. **Cover Error Paths**: Test that agents handle errors gracefully
5. **Use Natural Language**: Write questions as users would actually ask them

### Evaluation Coverage

**Aim for:**
- **All Tools**: At least one evaluation per tool (simple happy path)
- **All Resources**: Test each resource URI pattern
- **All Prompts**: Validate guided workflows work end-to-end
- **Error Scenarios**: Test common error codes for each tool
- **Batch Operations**: Test batch limits, partial failures

**Example Coverage Matrix:**

| Tool | Happy Path | Edge Case | Error Handling | Batch |
|------|-----------|-----------|----------------|-------|
| `get_miner_status` | ✅ Q1 | ✅ Q2 (offline) | ✅ Q3 (invalid ID) | ✅ Q4 (multi-miner) |
| `update_miner_firmware` | ✅ Q6 | ✅ Q7 (version validation) | ✅ Q8 (batch limit) | ✅ Q6 |
| `ping_miner` | ✅ Q4 | ✅ Q9 (unreachable) | - | - |

### Maintaining Evaluations

1. **Update with Code Changes**: When tool signatures change, update evaluations
2. **Add Regressions**: When bugs are fixed, add evaluation to prevent regression
3. **Review Quarterly**: Ensure evaluations still represent real-world usage
4. **Version Evaluations**: Use semantic versioning in metadata

---

## Example: Complete Evaluation Flow

### 1. Question Definition

```xml
<qa_pair id="11">
  <question>Change the pool for miner-001 to stratum+tcp://pool.example.com:3333 with worker name "worker1"</question>
  <answer>
    Pool configuration updated:
    - Miner: miner-001
    - New Pool: stratum+tcp://pool.example.com:3333
    - Worker: worker1
    - Status: Success
  </answer>
  <tools_used>update_pool_config</tools_used>
  <complexity>medium</complexity>
  <category>configuration</category>
</qa_pair>
```

### 2. Agent Execution

```
Agent receives question: "Change the pool for miner-001 to stratum+tcp://pool.example.com:3333 with worker name 'worker1'"

Agent reasoning:
- Task: Update pool configuration
- Tool needed: update_pool_config
- Parameters:
  - minerIds: ["miner-001"]
  - poolUrl: "stratum+tcp://pool.example.com:3333"
  - username: "worker1"

Agent action:
{
  "tool": "update_pool_config",
  "parameters": {
    "minerIds": ["miner-001"],
    "poolUrl": "stratum+tcp://pool.example.com:3333",
    "username": "worker1"
  }
}

Tool response:
{
  "success": 1,
  "failed": 0,
  "results": [
    { "minerId": "miner-001", "success": true }
  ]
}

Agent output:
"Pool configuration updated:
- Miner: miner-001
- New Pool: stratum+tcp://pool.example.com:3333
- Worker: worker1
- Status: Success"
```

### 3. Validation

**Check:**
- ✅ Correct tool selected (`update_pool_config`)
- ✅ Correct parameters extracted
- ✅ Response formatted appropriately
- ✅ All required information present

**Result:** PASS

---

## Advanced Topics

### Testing Prompts

Prompts are harder to evaluate because they return conversational workflows rather than structured data.

**Evaluation Strategy:**
1. **Verify Workflow Steps**: Check that all expected steps are mentioned
2. **Tool Recommendations**: Verify prompt suggests correct tools
3. **Conditional Logic**: Test different paths based on outcomes

**Example:**

```xml
<qa_pair id="12">
  <question>Miner miner-010 is offline. Walk me through troubleshooting.</question>
  <answer>
    [Prompt should include:]
    - Step 1: Check last known status
    - Step 2: Use ping_miner to test connectivity
    - Step 3: Based on ping result:
      - If reachable: Check logs, suggest reboot
      - If unreachable: Check physical connections, network
    - Provide actionable next steps
  </answer>
  <tools_used>troubleshoot_miner_offline (prompt), ping_miner, get_miner_logs</tools_used>
  <complexity>complex</complexity>
  <category>troubleshooting</category>
</qa_pair>
```

### Testing Resources

Resources should be evaluated for:
1. **Correct URI resolution**
2. **Cache behavior** (optional - can be tested separately)
3. **Response structure**

**Example:**

```xml
<qa_pair id="13">
  <question>Show me the current configuration for miner-001</question>
  <answer>
    [Should use resource: braiins:///miner/miner-001/config]

    Configuration:
    - Hostname: miner-001.local
    - Pools: [pool1, pool2]
    - Power Limit: 3200W
    - Tuner Mode: power_target
  </answer>
  <tools_used>braiins:///miner/miner-001/config (resource)</tools_used>
  <complexity>simple</complexity>
  <category>monitoring</category>
</qa_pair>
```

---

## Troubleshooting

### Evaluation Failures

**Issue:** "Agent doesn't select expected tool"
- **Check:** Tool description clarity
- **Fix:** Add examples to tool descriptions
- **Fix:** Disambiguate similar tools

**Issue:** "Agent uses correct tool but wrong parameters"
- **Check:** Input schema documentation
- **Fix:** Add parameter examples
- **Fix:** Use Zod for strict validation

**Issue:** "Agent doesn't follow multi-step workflow"
- **Check:** Tool descriptions mention next steps
- **Fix:** Create prompt to guide workflow
- **Fix:** Add "next steps" to tool responses

---

## Resources

- **Evaluation Template**: `tests/evaluations/evaluation-template.xml`
- **Example Evaluations**: See template for 10 pre-built Q&A pairs
- **MCP Documentation**: https://modelcontextprotocol.io
- **Tool Definitions**: `src/mcp/tools/`
- **Resource Definitions**: `src/mcp/resources/`
- **Prompt Definitions**: `src/mcp/prompts/`

---

**Document Version:** 1.0.0
**Last Updated:** December 2025
**Maintainer:** Braiins OS MCP Server Team
