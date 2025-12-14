# CLAUDE.md: Claude-Specific Development Instructions
**braiins-os-mcp-server** | Extends AGENTS.md | December 2025

---

## 📖 Import Statement

**→ See [AGENTS.md](./AGENTS.md) for core development standards**

This document extends AGENTS.md with Claude-specific capabilities and workflows. All foundational standards (Git operations, testing, security, collaboration) are defined in AGENTS.md and apply to Claude development work.

---

## 🧠 Claude-Specific Capabilities

### Context Window Advantage (200K Tokens)

Claude's 200K context window enables capabilities other agents cannot match:

#### 1. Whole-System Architecture Review
**When to use:** Designing multi-component features, identifying circular dependencies, optimizing data flow

**Example workflow:**
```
1. Claude reads: ARCHITECTURE.md + all key modules (src/api/, src/cache/, src/mcp/)
2. Claude identifies: Data flow bottlenecks, missing error handling, schema inconsistencies
3. Claude proposes: Refactored architecture with explicit rationale
4. Output: Design document + migration plan for implementation team
```

**Prompt template:**
```
You have full context of the braiins-os-mcp-server codebase. 
Analyze the data flow for [feature name].
Identify 5 architectural improvements.
For each: explain why, estimate effort, rank by impact.
```

#### 2. Multi-File Refactoring
**When to use:** Cross-cutting concerns (logging, error handling, caching), applying consistent patterns

**Example workflow:**
```
1. Claude scans all error handling in src/api/, src/cache/, src/mcp/
2. Claude identifies: Inconsistent error classes, different retry patterns
3. Claude proposes: Unified error handling framework
4. Output: Refactoring PR with 8-12 modified files, all changes explained
```

**Capability:** Can modify 10-15 files in single response while maintaining consistency

#### 3. Legacy Code Analysis & Modernization
**When to use:** Understanding complex existing implementations, proposing upgrades

**Prompt template:**
```
I'll paste the current implementation of [module].
You will:
1. Explain what it does in 3-5 sentences
2. Identify 3 modernization opportunities
3. Provide refactored code for 1 opportunity
4. Estimate effort for all 3
```

#### 4. Test Suite Design
**When to use:** Planning comprehensive test coverage, creating test scaffolding

**Output:** 50-100 well-structured test cases covering:
- Happy paths
- Error conditions
- Edge cases
- Integration points

### Code Generation Strengths

Claude excels at:

| Task | Approach | Output Quality |
|------|----------|----------------|
| **TypeScript classes** | Provide interface + requirements | Excellent types, proper error handling |
| **gRPC stubs** | Describe .proto structure | Accurate client wrappers with retry logic |
| **Test suites** | Template + edge cases | Comprehensive with good assertions |
| **Documentation** | Existing code + target audience | Detailed with examples |
| **API handlers** | Design spec + existing patterns | Follows project conventions perfectly |

### Workflow Limitations (Be Aware)

⚠️ **Claude cannot:**
- Directly execute npm commands (needs Builder agent)
- Push to GitHub (needs DevOps agent)
- Run tests in real environment (needs CI/CD)
- Access external APIs in real-time
- Modify .env or secrets (propose only)

---

## 🎯 Claude's Preferred Workflows

### Workflow 1: Architecture Design (Start Here for New Features)

**Scope:** Feature conception through API design

**Steps:**
1. **Input:** Product requirement + business context
2. **Analysis:** Review existing architecture in ARCHITECTURE.md
3. **Design:** Propose data model, API endpoints, integration points
4. **Output:** Design document with:
   - Entity-relationship diagram (text-based)
   - API endpoint specifications
   - Database schema
   - Integration points with existing modules
   - Security considerations
   - Testing strategy outline

**Prompt template:**
```
Feature: [Name]
Users: [Who needs this]
Context: [Business reason]

Please design this feature:
1. Core data model (entities, relationships)
2. API endpoints (RESTful specification)
3. Integration with existing modules
4. Security requirements
5. Test scenarios

Reference ARCHITECTURE.md and existing patterns.
```

**Handoff:** Pass design to Builder agent for implementation

### Workflow 2: Implementation Review (During Development)

**Scope:** Reviewing Builder's code before merge

**Steps:**
1. **Input:** GitHub PR with code changes
2. **Analysis:** Review against AGENTS.md standards
3. **Feedback:** Provide improvement suggestions
4. **Output:** Detailed review with:
   - Code quality assessment
   - Security issues (if any)
   - Performance observations
   - Suggestions (not requirements) for improvement

**Review checklist:**
```markdown
## Code Quality
- [ ] Consistent with style guide (AGENTS.md #Code Editing Standards)
- [ ] Proper TypeScript types (no 'any')
- [ ] Error handling for all async operations
- [ ] JSDoc comments on public methods

## Testing
- [ ] Tests follow template in AGENTS.md
- [ ] Coverage >85%
- [ ] Both happy path and error scenarios

## Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Sensitive data properly masked in logs

## Performance
- [ ] No obvious N+1 queries
- [ ] Caching strategy appropriate
- [ ] No unnecessary deep copies

## Architecture
- [ ] Follows established patterns
- [ ] Integrates cleanly with existing modules
- [ ] No circular dependencies
```

**Handoff:** Send feedback to Builder for revisions

### Workflow 3: Complex Problem-Solving

**Scope:** Debugging difficult issues, optimizing bottlenecks

**Example scenarios:**
- "Why is gRPC connection timing out under load?"
- "How can we reduce latency for multi-tenant queries?"
- "What's causing the memory leak in the cache?"

**Approach:**
1. **Gather context:** Ask for logs, error traces, relevant code
2. **Analyze root cause:** Use reasoning to trace problem
3. **Propose solutions:** Multiple options with trade-offs
4. **Recommend validation:** How to test the fix

**Prompt template:**
```
Issue: [Problem description]
Symptom: [What users see]
Affected code: [Files/modules]
Logs: [Paste relevant error traces]

Analyze this issue:
1. What's the root cause? (reasoning)
2. Is it architectural or implementation?
3. Propose 2-3 solutions with trade-offs
4. Which approach is best for this codebase? Why?
5. How would you test the fix?
```

---

## 🛠️ Claude + GitHub Copilot Integration

### Division of Labor

| Task | Claude | Copilot | Reason |
|------|--------|---------|--------|
| **System design** | ✅ Lead | - | Needs full context |
| **Architecture review** | ✅ Lead | - | Requires big-picture thinking |
| **Autocomplete during coding** | - | ✅ Lead | Real-time productivity |
| **Complex algorithm** | ✅ Lead | - | Needs explanation/reasoning |
| **Boilerplate generation** | - | ✅ Lead | Speed + pattern matching |
| **Test scaffolding** | ✅ Lead | ✅ Assist | Claude for structure, Copilot for fill-in |
| **Bug analysis** | ✅ Lead | - | Needs full codebase context |
| **Documentation** | ✅ Lead | - | Needs narrative coherence |
| **Quick refactoring** | - | ✅ Lead | Local scope, immediate |

### Workflow Example: Adding New Feature

```
┌─ CLAUDE: Architecture & Design
│  Input: Feature spec
│  Output: Design document, API spec, data model
│  Duration: 30 minutes
│
├─ COPILOT: Boilerplate & Scaffolding
│  Input: Design document
│  Tasks: Generate file structure, basic class skeletons
│  Duration: 15 minutes
│
├─ COPILOT: Active Coding (Autocomplete)
│  Input: Skeleton code
│  Tasks: Implement business logic with suggestions
│  Duration: 2-3 hours
│  (Developer refines suggestions, ensures quality)
│
├─ COPILOT: Test Scaffolding
│  Input: Implementation
│  Tasks: Generate test boilerplate
│  Duration: 30 minutes
│
├─ CLAUDE: Test Design & Review
│  Input: Implementation + test scaffold
│  Tasks: Design comprehensive test cases
│  Duration: 1 hour
│
├─ COPILOT: Fill in Tests
│  Input: Test outline
│  Tasks: Implement assertions and fixtures
│  Duration: 30 minutes
│
└─ CLAUDE: Final Review
   Input: PR with code + tests
   Output: Approval or improvement suggestions
   Duration: 30 minutes
```

---

## 📋 Claude Tool Permissions & Boundaries

### Permitted Operations

✅ **These are encouraged:**

1. **Analysis & Design**
   - Read any source file
   - Analyze full codebase
   - Design systems and APIs
   - Create documentation

2. **Code Review**
   - Comment on PRs
   - Suggest improvements
   - Identify bugs/security issues
   - Propose refactorings

3. **Testing Strategies**
   - Design test plans
   - Create test code
   - Identify coverage gaps
   - Propose testing approaches

4. **Documentation**
   - Write/update guides
   - Create API documentation
   - Document architectural decisions
   - Write troubleshooting guides

5. **Knowledge Transfer**
   - Explain complex systems
   - Create training materials
   - Discuss trade-offs
   - Mentor on patterns/practices

### Restricted Operations

⛔ **These require human approval:**

1. **Cannot modify code directly** (use Builder agent)
   - No git commits
   - No file modifications
   - No pushing branches

2. **Cannot execute commands** (use DevOps agent)
   - No npm install/test/build
   - No docker commands
   - No production deployments

3. **Cannot make security decisions alone**
   - Cannot approve security fixes
   - Cannot rotate keys
   - Cannot modify auth policies

4. **Cannot make business decisions**
   - Cannot prioritize features
   - Cannot make trade-offs between speed/quality
   - Cannot decide on project direction

### Request Patterns

**Correct request to Claude:**
```
"Design the data model for feature X. 
Provide TypeScript interfaces, explain relationships,
suggest database schema. Then pass to Builder for implementation."
```

**Incorrect request:**
```
"Implement feature X end-to-end."
(Claude can't actually modify files or push code)
```

**Correct handoff pattern:**
```
@Claude: Design this system
        ↓ (receives design)
@Builder: Implement from design (code → PR)
        ↓ (receives PR with code)
@Claude: Review implementation
        ↓ (receives feedback)
@Builder: Revise based on review
        ↓ (revised PR)
@Validator: QA and merge
```

---

## 🔄 Integration Points with Other Agents

### With Builder Agent

**Claude → Builder:**
- Design documents (detailed specs, interface definitions)
- Code review feedback (improvement suggestions)
- Test design outlines (test cases, edge cases)

**Builder → Claude:**
- Implementation questions ("How should I handle this edge case?")
- Code for review (PRs with complete features)
- Refactoring requests ("Redesign this module")

**Handoff format:**
```markdown
## Claude Design Output
Feature: Firmware Update Endpoint
Entities: [diagram]
Endpoints: [spec]
Database: [schema]
Integration: [points]
Security: [considerations]

@Builder: Ready for implementation.
Questions? Tag me in PR with `@Claude review-when-ready`
```

### With Architect Agent

**Who decides what:**
- **Architect:** Final authority on overall system design
- **Claude:** Proposes architectural improvements, detailed sub-system design

**When they disagree:**
```
Claude proposes: Microservices for firmware update
Architect decides: Keep monolithic, add background jobs
Resolution: Architect has final say on high-level decisions
```

### With DevOps Agent

**Claude → DevOps:**
- Deployment strategy recommendations
- Infrastructure requirements analysis
- Monitoring/alerting suggestions

**DevOps → Claude:**
- "How should monitoring be structured?"
- "What metrics matter most?"
- "Design the deployment pipeline"

---

## 🎓 Best Practices for Claude on This Project

### 1. Reference Existing Patterns

**Always check for precedents before designing:**

```
❌ "Design an error handler"
✅ "Review src/utils/errors.ts and design error handler
    following existing patterns. Ensure consistency with
    CustomError base class and error classification."
```

### 2. Be Specific About Constraints

**Good prompt:**
```
Design the firmware update API endpoint.
Constraints:
- Must support multiple miners in single request
- Update can take 10-30 minutes
- Must be resumable if connection drops
- Cannot exceed gRPC connection timeout (30s)
- Must not block other operations
```

### 3. Propose, Don't Decide Business Trade-offs

**Good:**
```
Option A: Synchronous endpoint (simple, limits to 5 miners)
Option B: Async with job queue (complex, unlimited miners)
Product team should decide based on user needs.
```

**Bad:**
```
We should use async because it's better.
(No business justification, no trade-offs)
```

### 4. Always Explain Your Reasoning

**Good:**
```
I recommend Redis pub/sub for real-time updates because:
1. Miners broadcast status changes frequently (100s/min)
2. Multiple clients need updates (web UI, mobile, Claude)
3. No persistent storage needed (status is ephemeral)
4. Existing Redis infrastructure in place
5. Lower latency than database polling

Alternative: WebSockets
- Pros: Client-initiated connections, more control
- Cons: More server overhead, harder clustering
```

### 5. Create Actionable Handoffs

**When handing off to Builder:**

```markdown
## Implementation Requirements

### 1. Controller Method
- File: src/api/handlers/firmware.ts
- Method: updateMultiple()
- Input validation: array of { minerId, version }
- Error cases: handle 5 scenarios (see #452)

### 2. Tests Required
- Unit: 8 test cases (design in tests/unit/firmware.test.ts)
- Integration: 3 scenarios (see test-design.md)
- Coverage target: >85%

### 3. Integration Points
- gRPC: Use existing client from src/api/grpc/client
- Cache: Invalidate firmware:* keys after update
- Events: Publish firmware-update-started event

### 4. Success Criteria
- [ ] Tests passing with >85% coverage
- [ ] Handles all 5 error cases gracefully
- [ ] Cache invalidation working
- [ ] Logs contain: minerId, version, status

Questions? Comment here.
```

---

## 📊 Measuring Claude's Effectiveness

### Metrics That Matter

| Metric | Target | Notes |
|--------|--------|-------|
| **Design → Implementation time** | < 1 week | Includes review cycle |
| **Code review turnaround** | < 24 hours | Quality feedback |
| **Bug catch rate** | > 80% | Vs. traditional review |
| **Architecture consistency** | 100% | Patterns followed across codebase |
| **Documentation completeness** | 100% | All decisions documented |

### Feedback Loop

**After each major Claude engagement:**

1. Builder/Validator provides feedback: "Design was clear"
2. Track whether design actually implemented as-is
3. Identify improvements for next time
4. Update this document with lessons learned

---

## 🚀 Advanced Claude Workflows

### Workflow: Full Feature Design-to-Deploy

**Scope:** Simple feature from concept to production

**Steps:**

1. **Claude: Architecture (3h)**
   - Design data model, API, integration points
   - Output: Design doc + implementation guide

2. **Builder: Implementation (1d)**
   - Code from design
   - Unit + integration tests
   - Output: PR with tests passing

3. **Claude: Code Review (3h)**
   - Review against AGENTS.md standards
   - Provide improvement suggestions
   - Output: PR comments

4. **Builder: Revisions (4h)**
   - Address Claude feedback
   - Update tests if needed
   - Merge to develop

5. **DevOps: E2E + Deploy (3h)**
   - E2E test in staging
   - Deploy to production
   - Monitor metrics
   - Output: Deployment report

**Total time: 1.5 days (parallelizable)**

### Workflow: Emergency Bug Analysis

**Scenario:** Production bug causing data inconsistency

**Claude's role:**

1. **Gather context:** Logs, error traces, affected code
2. **Root cause analysis:** Trace through system
3. **Impact assessment:** How many users affected?
4. **Propose hotfixes:** Multiple options
5. **Risk assessment:** Which fix to deploy first?
6. **Validation plan:** How to prevent recurrence

**Output:** Debugging report with recommendations

**Handoff:** Builder implements hotfix, DevOps deploys

---

## 📚 Reference Documents

All foundational standards are in **[AGENTS.md](./AGENTS.md)**:
- Code editing standards
- Testing philosophy  
- Security policies
- Git workflow
- Tool permissions

Claude-specific workflows defined in this document.

---

**This document is maintained by: Architecture Team**  
**Last updated: December 2025**  
**Review frequency: Quarterly or after major workflow changes**
Import command and agent standards from docs/claude/
