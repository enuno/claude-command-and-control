---
name: [skill-name]
version: 1.0.0
author: [your-team]
created: [YYYY-MM-DD]
last_updated: [YYYY-MM-DD]
status: active
complexity: complex
category: [category]
tags: [tag1, tag2, tag3]
token_budget: [8000-20000]
---

# [Skill Name]

## Description
[3-4 sentences describing:
- What problem this solves
- When it's applicable
- Key capabilities
- Expected outcomes]

## When to Use This Skill
- [Explicit trigger 1 with detailed context]
- [Explicit trigger 2 with detailed context]
- [Explicit trigger 3 with detailed context]
- [Explicit trigger 4 with detailed context]
- [Explicit trigger 5 with detailed context]

## When NOT to Use This Skill
- [Negative case 1 with alternative and reasoning]
- [Negative case 2 with alternative and reasoning]
- [Negative case 3 with alternative and reasoning]

## Prerequisites

### Required Context
- [Context item 1 with format specification]
- [Context item 2 with format specification]
- [Context item 3 with format specification]

### Required Access
- [Permission 1 with scope]
- [Permission 2 with scope]

### Required Tools/Dependencies
- [Tool 1: version requirement]
- [Tool 2: version requirement]
- [MCP Server: API access requirement]

### Pre-Execution Validation
Run these checks before starting:
```


# Check 1

command-to-verify-prerequisite-1

# Check 2

command-to-verify-prerequisite-2

```

## Workflow Architecture

**Multi-Phase Execution Pattern:**
```

Phase 1: Discovery & Analysis
↓
Phase 2: Planning & Validation
↓
Phase 3: Implementation
↓
Phase 4: Verification & Refinement
↓
Phase 5: Finalization & Handoff

```

**Feedback Loops:**
- Phase 3 ↔ Phase 4: Iterative refinement
- Phase 4 → Phase 2: Re-planning if validation fails

---

## Phase 1: Discovery & Analysis

**Purpose**: Gather all necessary context and understand requirements

### Step 1.1: Context Loading
```


# Load required files

[specific commands to load context]

```

**Load Priority:**
1. [Essential file 1]
2. [Essential file 2]
3. [Supporting file 3]

**Context Injection Strategy:**
- Summarize files > 2000 lines
- Focus on [specific sections]
- Reference external docs via URL

### Step 1.2: Requirement Analysis
Analyze loaded context for:
- [Analysis dimension 1]
- [Analysis dimension 2]
- [Analysis dimension 3]

**Decision Matrix:**

| Condition | Action |
|-----------|--------|
| [Condition A] | [Proceed to Step 1.3] |
| [Condition B] | [Request clarification] |
| [Condition C] | [Abort with reason] |

### Step 1.3: Scope Definition
Create internal scope document:

```


## Scope: [Skill Execution ID]

**Inputs:**

- 
- 

**Constraints:**

- [Constraint 1]
- [Constraint 2]

**Success Criteria:**

- [Criterion 1]
- [Criterion 2]

**Estimated Complexity:** [Low|Medium|High]

```

**Phase 1 Output**: Scope definition document

---

## Phase 2: Planning & Validation

**Purpose**: Create execution plan and validate feasibility

### Step 2.1: Plan Generation
Generate detailed execution plan:

```


## Execution Plan: [Skill Name]

### Approach

[Chosen strategy with rationale]

### Task Breakdown

1. [Task 1]
    - Subtask 1.1
    - Subtask 1.2
2. [Task 2]
    - Subtask 2.1
    - Subtask 2.2

### Risk Assessment

- Risk 1: [Mitigation strategy]
- Risk 2: [Mitigation strategy]


### Resource Requirements

- Time estimate: [X minutes]
- Token estimate: [Y tokens]
- External calls: [Z API calls]

```

### Step 2.2: Plan Validation
Validate plan against:
- [ ] Aligns with prerequisites
- [ ] Within token budget
- [ ] No external dependencies without approval
- [ ] Security constraints met
- [ ] Performance requirements achievable

**Decision Point:**
- IF validation passes → Proceed to Phase 3
- IF validation fails → Loop back to Step 2.1 with adjustments
- IF unresolvable → Request human guidance

**Phase 2 Output**: Validated execution plan

---

## Phase 3: Implementation

**Purpose**: Execute the planned workflow

### Step 3.1: [Implementation Sub-Task 1]
[Detailed instructions for sub-task 1]

**Implementation Pattern:**
```

[Code template or command pattern]

```

**Expected Intermediate Output:**
```

[Sample output from this step]

```

### Step 3.2: [Implementation Sub-Task 2]
[Detailed instructions for sub-task 2]

**Conditional Logic:**
```

IF [condition A]:
Execute [action A]
Update state: [state change]
ELSE IF [condition B]:
Execute [action B]
Update state: [state change]
ELSE:
Execute [fallback action]
Log: [warning message]

```

### Step 3.3: [Implementation Sub-Task 3]
[Detailed instructions with error handling]

**Error Handling:**
- **Error Type 1**: [Recovery action]
- **Error Type 2**: [Recovery action]
- **Unrecoverable**: [Rollback procedure]

**Phase 3 Output**: Initial implementation artifact

---

## Phase 4: Verification & Refinement

**Purpose**: Validate implementation and iteratively improve

### Step 4.1: Automated Validation
Run automated checks:

```


# Check 1: [What it validates]

[validation command 1]

# Check 2: [What it validates]

[validation command 2]

# Check 3: [What it validates]

[validation command 3]

```

**Validation Results Matrix:**

| Check | Pass | Fail Action |
|-------|------|-------------|
| Check 1 | → Step 4.2 | → Fix in Phase 3, retry |
| Check 2 | → Step 4.2 | → Adjust parameters, retry |
| Check 3 | → Step 4.2 | → Request human review |

### Step 4.2: Quality Assessment
Assess against quality standards:

**Dimension 1: [Quality Aspect]**
- Target: [Specific threshold]
- Actual: [Measured value]
- Status: [PASS | FAIL | ACCEPTABLE]

**Dimension 2: [Quality Aspect]**
- Target: [Specific threshold]
- Actual: [Measured value]
- Status: [PASS | FAIL | ACCEPTABLE]

### Step 4.3: Iterative Refinement
**Refinement Loop** (max 3 iterations):

```

Iteration N:

1. Identify gap: [What needs improvement]
2. Apply fix: [Specific change]
3. Re-validate: [Run validation again]
4. IF improved AND within budget → Continue
5. IF max iterations reached → Proceed with best effort
```

**Phase 4 Output**: Validated, refined artifact

---

## Phase 5: Finalization & Handoff

**Purpose**: Prepare final output and document results

### Step 5.1: Final Formatting
Apply final formatting standards:
- [Formatting rule 1]
- [Formatting rule 2]
- [Formatting rule 3]

### Step 5.2: Documentation Generation
Create supplementary documentation:

```


## [Skill Name] Execution Summary

**Execution ID**: [Unique ID]
**Timestamp**: [ISO 8601]
**Duration**: [X minutes]
**Token Usage**: [Y tokens]

**Inputs:**

- 
- 

**Outputs:**

- 
- 

**Quality Metrics:**

- 
- 

**Issues Encountered:**

- 
- 

**Recommendations:**

- [Recommendation 1]
- [Recommendation 2]

```

### Step 5.3: Handoff Protocol

**Handoff to [Next Agent/Process]:**
```


***
TO: [Recipient Agent/Process]
FROM: [This Skill]
RE: [Subject]

**Deliverables:**

- 
- 

**Next Steps:**

1. [Action 1]
2. [Action 2]

**Open Items:**

- 
- 

**Contact:**
For questions about this execution, reference ID: [Execution ID]
***
```

**Phase 5 Output**: Final deliverables + documentation

---

## Examples

### Example 1: [Complex Happy Path Scenario]
**Context**: [Detailed setup with multiple factors]

**Prerequisites Met:**
- ✅ [Prerequisite 1]: [How it's satisfied]
- ✅ [Prerequisite 2]: [How it's satisfied]
- ✅ [Prerequisite 3]: [How it's satisfied]

**Input:**
```

[Comprehensive input data with multiple components]

```

**Execution Trace:**

**Phase 1:**
- Step 1.1 Output: [Intermediate result]
- Step 1.2 Analysis: [Analysis findings]
- Step 1.3 Scope: [Defined scope]

**Phase 2:**
- Step 2.1 Plan: [Generated plan summary]
- Step 2.2 Validation: ✅ Passed

**Phase 3:**
- Step 3.1 Output: [Implementation piece 1]
- Step 3.2 Output: [Implementation piece 2]
- Step 3.3 Output: [Implementation piece 3]

**Phase 4:**
- Iteration 1: [Refinement made]
- Validation: ✅ All checks passed

**Phase 5:**
- Final output delivered

**Expected Output:**
```

[Complete, production-ready output]

```

**Metrics:**
- Execution time: [X minutes]
- Token usage: [Y tokens]
- Quality score: [Z%]

**Rationale**: [Why this example demonstrates full capability]

### Example 2: [Edge Case with Recovery]
**Context**: [Unusual circumstances]

**Input:**
```

[Input with edge case characteristics]

```

**Execution Trace:**

**Phase 3 - Issue Encountered:**
- Step 3.2: [Error detected]
- Error: [Error message]
- Recovery: [Action taken]
- Retry: [Successful result]

**Expected Output:**
```

[Output showing graceful edge case handling]

```

**Rationale**: [Why this edge case matters]

### Example 3: [Validation Failure & Re-planning]
**Context**: [Conditions leading to validation failure]

**Input:**
```

[Input that triggers validation failure]

```

**Execution Trace:**

**Phase 2:**
- Initial Plan: [Plan A]
- Validation: ❌ Failed - [Reason]

**Re-planning Loop:**
- Adjusted Plan: [Plan B]
- Validation: ✅ Passed

**Phase 3-5:**
- [Executed with adjusted plan]

**Expected Output:**
```

[Output showing adaptive planning]

```

**Rationale**: [Demonstrates resilience and adaptation]

### Example 4: [Error Scenario with Graceful Degradation]
**Context**: [Unrecoverable error conditions]

**Input:**
```

[Input that causes unrecoverable error]

```

**Execution Trace:**

**Phase 3:**
- Step 3.2: [Critical error]
- Recovery attempted: [Actions taken]
- Recovery failed: [Why it couldn't recover]

**Graceful Degradation:**
- Partial output generated: [What was salvageable]
- Error documentation: [Detailed error report]
- Recommendations: [What human should do]

**Expected Output:**
```

ERROR: [Clear error message]

Partial Results:
[Whatever could be completed]

Recommendations:

1. [Action user should take]
2. [Alternative approach]

Error Report: [Location of detailed report]

```

**Rationale**: [Demonstrates proper error handling]

---

## Quality Standards

### Output Requirements
- **Completeness**: [Specific criteria with ≥X% threshold]
- **Accuracy**: [Specific criteria with ≥Y% threshold]
- **Format Compliance**: [Standards to meet]
- **Performance**: [Response time ≤Z minutes]

### Process Requirements
- **Token Efficiency**: [Usage ≤N tokens]
- **Iteration Limit**: [Max M refinement loops]
- **Error Rate**: [≤P% failure rate]

### Integration Requirements
- **Agent Compatibility**: [Works seamlessly with agents A, B, C]
- **Command Compatibility**: [Integrates with commands /X, /Y]
- **MCP Compatibility**: [Uses servers S1, S2 correctly]

---

## Performance Considerations

### Optimization Strategies
1. **Context Loading**: [How to minimize context size]
2. **Parallel Execution**: [What can run in parallel]
3. **Caching**: [What can be cached between runs]
4. **Early Termination**: [When to short-circuit]

### Resource Management
- **Memory**: [Expected memory usage]
- **API Calls**: [Estimated external calls]
- **Time Budget**: [Recommended time limit]

### Scaling Considerations
- **Small Scale** (<10 items): [Approach]
- **Medium Scale** (10-100 items): [Approach]
- **Large Scale** (>100 items): [Approach or recommend alternative]

---

## Security & Safety

### Input Validation
```

def validate_inputs(inputs):
"""
Validate all inputs before execution
"""
# Check 1: [What to validate]
if not validate_check_1(inputs):
raise ValueError("[Error message]")

    # Check 2: [What to validate]
    if not validate_check_2(inputs):
        raise ValueError("[Error message]")
    
    return True
    ```

### Sensitive Data Handling
- **PII**: [How to handle personally identifiable information]
- **Secrets**: [Never log, redact in outputs]
- **Access Control**: [What permissions required]

### Approval Gates
**Require human approval for:**
- [ ] [Action type 1 that needs approval]
- [ ] [Action type 2 that needs approval]
- [ ] [Action type 3 that needs approval]

### Audit Trail
Log these events:
- Skill invocation (timestamp, user, inputs)
- Phase transitions
- Validation results
- Errors and recoveries
- Final outputs

---

## Common Pitfalls

### Pitfall 1: [Major Issue Type]
**Issue**: [Detailed problem description]
**Why It Happens**: [Root cause analysis]
**Impact**: [What breaks or degrades]
**Solution**: [Step-by-step prevention/fix]
**Example**: [Concrete example of issue and fix]

### Pitfall 2: [Major Issue Type]
**Issue**: [Detailed problem description]
**Why It Happens**: [Root cause analysis]
**Impact**: [What breaks or degrades]
**Solution**: [Step-by-step prevention/fix]
**Example**: [Concrete example of issue and fix]

### Pitfall 3: [Major Issue Type]
**Issue**: [Detailed problem description]
**Why It Happens**: [Root cause analysis]
**Impact**: [What breaks or degrades]
**Solution**: [Step-by-step prevention/fix]
**Example**: [Concrete example of issue and fix]

### Pitfall 4: [Major Issue Type]
**Issue**: [Detailed problem description]
**Why It Happens**: [Root cause analysis]
**Impact**: [What breaks or degrades]
**Solution**: [Step-by-step prevention/fix]
**Example**: [Concrete example of issue and fix]

---

## Integration with Command & Control

### Agent Orchestration

**Primary Agents:**
- **[Agent 1]**: 
  - Role in this workflow: [Description]
  - Handoff points: [When and what]
  - Communication protocol: [How they interact]

- **[Agent 2]**:
  - Role in this workflow: [Description]
  - Handoff points: [When and what]
  - Communication protocol: [How they interact]

**Supporting Agents:**
- **[Agent 3]**: [How they support]
- **[Agent 4]**: [How they support]

### Command Integration

| Command | Relationship | Usage Pattern |
|---------|--------------|---------------|
| `/[command-1]` | [Prerequisite | Alternative | Follow-up] | [When to use command vs. skill] |
| `/[command-2]` | [Prerequisite | Alternative | Follow-up] | [When to use command vs. skill] |

### MCP Server Dependencies

**[MCP Server 1]:**
- **Purpose**: [What it provides]
- **Endpoints Used**: 
  - `[endpoint-1]`: [Purpose]
  - `[endpoint-2]`: [Purpose]
- **Required Permissions**: [List]
- **Error Handling**: [How to handle MCP errors]

**[MCP Server 2]:**
- **Purpose**: [What it provides]
- **Endpoints Used**: [List]
- **Required Permissions**: [List]

### Multi-Skill Orchestration

**This skill can chain with:**

```

[upstream-skill-1]
↓
THIS SKILL (Phase 1-5)
↓
[downstream-skill-1] OR [downstream-skill-2]

```

**Orchestration Pattern:**
```

1. [Orchestrator Skill] analyzes request
2. IF [condition] → Invokes THIS SKILL
3. THIS SKILL executes Phases 1-5
4. Handoff to [downstream-skill]
5. [Orchestrator Skill] synthesizes results
```

---

## Troubleshooting

### Issue Category 1: Invocation Problems

#### Issue 1.1: Skill Doesn't Invoke
**Symptoms**: [What user experiences]
**Diagnosis Steps**:
1. Check trigger phrase matches "When to Use"
2. Verify prerequisites are met
3. Check for overlapping skills

**Solution**: [Step-by-step fix]

#### Issue 1.2: Wrong Skill Invoked
**Symptoms**: [What happens]
**Diagnosis Steps**:
1. Review "When NOT to Use" section
2. Check trigger phrase specificity
3. Examine other skills in scope

**Solution**: [Step-by-step fix]

### Issue Category 2: Execution Problems

#### Issue 2.1: Phase 2 Validation Fails
**Symptoms**: [What error appears]
**Common Causes**:
- [Cause 1]
- [Cause 2]
**Solution**: [Step-by-step fix]

#### Issue 2.2: Phase 4 Quality Checks Fail
**Symptoms**: [What metrics are out of range]
**Common Causes**:
- [Cause 1]
- [Cause 2]
**Solution**: [Step-by-step fix]

#### Issue 2.3: Token Budget Exceeded
**Symptoms**: [Truncation or timeout]
**Common Causes**:
- [Cause 1]: Context too large
- [Cause 2]: Too many refinement iterations
**Solution**:
1. Reduce context injection
2. Summarize large files
3. Limit iterations to 2
4. Consider splitting into multiple skill calls

### Issue Category 3: Integration Problems

#### Issue 3.1: MCP Server Unavailable
**Symptoms**: [Connection errors]
**Solution**:
1. Check MCP server status
2. Verify credentials
3. Implement fallback [describe fallback]

#### Issue 3.2: Agent Handoff Failed
**Symptoms**: [Next agent doesn't receive data]
**Solution**:
1. Verify handoff format matches expectations
2. Check agent availability
3. Retry with explicit handoff

---

## Monitoring & Observability

### Key Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Success Rate** | ≥90% | <80% |
| **Avg Execution Time** | ≤X min | >2X min |
| **Token Usage** | ≤Y tokens | >1.5Y tokens |
| **Quality Score** | ≥Z% | <0.8Z% |
| **Error Rate** | ≤P% | >2P% |

### Logging Strategy

**Log Levels:**
- **INFO**: Phase transitions, major milestones
- **DEBUG**: Individual step outputs
- **WARN**: Recoverable errors, degraded performance
- **ERROR**: Unrecoverable errors, critical failures

**Sample Log Entry:**
```

{
"timestamp": "2025-11-22T18:30:00Z",
"skill": "skill-name",
"version": "1.0.0",
"execution_id": "exec-12345",
"phase": "3",
"step": "3.2",
"level": "INFO",
"message": "Completed implementation sub-task 2",
"metrics": {
"duration_ms": 1500,
"tokens_used": 450
}
}

```

### Performance Dashboards

**Track Over Time:**
- Invocation frequency
- Success vs. failure rate
- Average execution time trend
- Token usage distribution
- User satisfaction (if collected)

---

## Testing Strategy

### Unit Testing (Skill Components)

**Test Phase 1:**
```

def test_phase1_context_loading():
"""Test that context loads correctly"""
inputs = {"file": "test.md"}
result = execute_phase1(inputs)

    assert result["status"] == "success"
    assert "scope_doc" in result
    assert result["scope_doc"]["complexity"] in ["Low", "Medium", "High"]
    ```

**Test Phase 2:**
```

def test_phase2_plan_validation():
"""Test plan validation logic"""
scope = create_test_scope()
plan = generate_plan(scope)

    is_valid, errors = validate_plan(plan)
    
    assert is_valid == True
    assert len(errors) == 0
    ```

### Integration Testing (Full Workflow)

**Test Happy Path:**
```

def test_full_workflow_happy_path():
"""Test complete workflow with valid inputs"""
inputs = load_test_fixture("happy_path_input.json")

    result = execute_skill(inputs)
    
    assert result["status"] == "success"
    assert result["quality_score"] >= 0.9
    assert result["token_usage"] <= TOKEN_BUDGET
    ```

**Test Edge Cases:**
```

def test_edge_case_large_input():
"""Test behavior with unusually large input"""
inputs = load_test_fixture("large_input.json")

    result = execute_skill(inputs)
    
    # Should still succeed but maybe with summarization
    assert result["status"] in ["success", "partial_success"]
    assert "summarized" in result["notes"]
    ```

**Test Error Handling:**
```

def test_error_recovery():
"""Test graceful error handling"""
inputs = load_test_fixture("error_input.json")

    result = execute_skill(inputs)
    
    assert result["status"] == "error"
    assert "error_message" in result
    assert "recommendations" in result
    ```

### Manual Testing Checklist

- [ ] Skill invokes correctly with trigger phrases
- [ ] Skill doesn't invoke with negative triggers
- [ ] All 4-5 examples produce expected outputs
- [ ] Error scenarios handled gracefully
- [ ] Performance within targets
- [ ] Integration with agents works
- [ ] MCP calls succeed
- [ ] Logging captures key events
- [ ] Documentation accuracy verified

---

## Version History

### 1.0.0 (2025-11-22)
**Initial Release**
- Implemented Phases 1-5 workflow
- Added comprehensive examples
- Integrated with [Agent A], [Agent B]
- MCP server [S1], [S2] support
- Token budget: [Y tokens]
- Target execution time: [X minutes]

**Known Limitations:**
- [Limitation 1]
- [Limitation 2]

**Future Enhancements:**
- [Planned feature 1]
- [Planned feature 2]

---

## Appendix A: Glossary

**[Term 1]**: [Definition]
**[Term 2]**: [Definition]
**[Term 3]**: [Definition]

## Appendix B: References

- [Reference 1]: [Link or description]
- [Reference 2]: [Link or description]
- [Reference 3]: [Link or description]

## Appendix C: Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-22 | 1.0.0 | Initial release | [Author] |

---

**Document Maintained By**: [Team Name]  
**Review Cycle**: Quarterly  
**Next Review**: [Date]  
**Contact**: [Contact information for questions]
