# FastMCP Skill Implementation Plan

**Goal:** Create a comprehensive Claude skill for developing Model Context Protocol (MCP) servers using the FastMCP framework.

**Architecture:** A single SKILL.md file that provides structured guidance for FastMCP development, organized by progressive disclosure from basics to advanced patterns. The skill will use a rigid workflow approach with required checklists, covering the complete development lifecycle from initial server setup through production deployment.

**Tech Stack:**
- FastMCP Python framework (v2.11.0+)
- Model Context Protocol (MCP) specification
- Claude Desktop integration
- Python 3.8+ with type hints and async/await

---

## Testing Plan

**Manual Verification Tests:**

1. **Skill Activation Test**: Verify the skill activates when users request FastMCP development tasks
   - Test phrases: "Create an MCP server", "Build a FastMCP tool", "Add resources to my MCP server"
   - Expected: Skill loads and presents checklist

2. **Completeness Test**: Verify all critical FastMCP concepts are covered
   - Check: Tools, Resources, Prompts, Context, Authentication, Deployment
   - Expected: Each concept has clear examples and activation criteria

3. **Example Validation Test**: Verify code examples are syntactically correct and follow best practices
   - Test: Extract all code blocks and run through Python syntax validator
   - Expected: All examples parse successfully with no syntax errors

4. **Integration Test with creating-skills workflow**: Verify the skill follows Nori skill creation patterns
   - Test: Skill has proper frontmatter, `<required>` blocks, and structure
   - Expected: Matches pattern from other skills in `/home/elvis/.claude/skills/`

5. **Progressive Disclosure Test**: Verify information is organized from beginner to advanced
   - Test: Read through skill linearly
   - Expected: Can understand basics before encountering advanced patterns

**Integration Tests (Invoke skill via Claude):**

6. **Basic Tool Creation Test**: Invoke skill to create a simple MCP tool
   - Input: "Create an MCP server with a tool that adds two numbers"
   - Expected: Skill guides through FastMCP setup, provides Python AND TypeScript examples
   - Verify: Generated code is syntactically valid and follows best practices

7. **Resource Creation Test**: Invoke skill to add a resource to existing server
   - Input: "Add a resource to my MCP server that reads files"
   - Expected: Skill provides URI template pattern, security validation, Python/TypeScript examples
   - Verify: Generated resource includes path validation and error handling

8. **Claude Desktop Integration Test**: Invoke skill for integration help
   - Input: "How do I integrate my MCP server with Claude Desktop?"
   - Expected: Skill provides fastmcp CLI command, manual config, environment variable guidance
   - Verify: Installation command and config are correct and complete

9. **Version Migration Test**: Invoke skill for v2 to v3 migration
   - Input: "I want to migrate my FastMCP server from v2 to v3"
   - Expected: Skill provides breaking changes list, migration steps, compatibility matrix
   - Verify: Migration guidance is accurate and complete

10. **Creating-Skills Integration Test**: Invoke both skills in sequence
    - Input: "Create a custom skill for working with my company's API using MCP"
    - Expected: Skills compose correctly, creating-skills invokes fastmcp skill for MCP implementation
    - Verify: Workflow is smooth and guidance is coherent

NOTE: I will write all validation tests AND integration tests before I add the SKILL.md implementation.

---

## Implementation Steps

### Phase 1: Setup and Structure (5-10 minutes)

**Task 1.1: Create skill directory**
- Navigate to: `/home/elvis/claude-command-and-control/.worktrees/create-fastmcp-skill/skills/`
- Create directory: `mkdir -p fastmcp`
- Verify: `ls -la skills/fastmcp/`

**Task 1.2: Create SKILL.md skeleton**
- Create file: `skills/fastmcp/SKILL.md`
- Add frontmatter with name, description, and metadata
- Add `<required>` block with checklist items
- Verify: File exists and has valid YAML frontmatter

### Phase 2: Write Core Content (30-45 minutes)

**Task 2.1: Write "When to Use This Skill" section**
- Document activation criteria:
  - User asks to create/modify MCP servers
  - User asks about FastMCP tools, resources, or prompts
  - User wants to integrate with Claude Desktop
  - User needs MCP server deployment guidance
- Include negative cases (when NOT to use)
- Verify: Clear, actionable trigger conditions

**Task 2.2: Write "Quick Start" section**
- Minimal working example (add function with @mcp.tool decorator)
- Claude Desktop installation command
- Verification steps
- Verify: Complete end-to-end quick start flow

**Task 2.3: Write "Core Concepts" section**
- **Tools**: Function decorators, parameters, return types, async/sync
  - Include: Type hints, validation modes, ToolError handling
  - Example (Python): Database query tool with security
  - Example (TypeScript): API wrapper with validation
- **Resources**: Static vs dynamic, URI templates, MIME types
  - Include: RFC 6570 patterns, ResourceError handling
  - Example (Python): File system resource with path validation
  - Example (TypeScript): REST API resource wrapper
- **Prompts**: Message templates, multi-message conversations
  - Include: PromptResult structure, role parameter
  - Example (Python): Code review workflow prompt
  - Example (TypeScript): Analysis workflow prompt
- **Context**: Dependency injection, logging, progress, LLM sampling
  - Include: CurrentContext(), all context methods
  - Example (Python): Long-running operation with progress reporting
  - Example (TypeScript): Multi-step workflow with context
- Verify: Each concept has definition, Python AND TypeScript examples, and common patterns

**Task 2.4: Write "Claude Desktop Integration" section**
- Installation methods (fastmcp CLI vs manual config)
- Environment variable handling
- Common integration issues and solutions
- Verification steps (hammer icon check)
- Verify: Complete integration workflow with troubleshooting

**Task 2.5: Write "Authentication and Security" section**
- OAuth providers (Google, GitHub, Azure)
- Token verification
- Security best practices (HTTPS, error masking, input validation)
- Default insecurity warning
- Example: Secure server with OAuth
- Verify: Clear security guidance with actionable steps

**Task 2.6: Write "Advanced Patterns" section**
- Dependency injection with `Depends()`
- Server composition and proxying
- Dynamic component management
- Testing with Client
- Example: Multi-server composition
- Verify: Advanced patterns are optional enhancements, not requirements

**Task 2.7: Write "Common Pitfalls" section**
- Environment isolation in Claude Desktop
- Absolute paths requirement
- Functions with `*args`/`**kwargs` not supported
- Context scoped to single request
- Security defaults
- Each pitfall with example and solution
- Verify: All major gotchas from research covered

**Task 2.8: Write "Deployment" section**
- Transport options (STDIO, HTTP, SSE)
- FastMCP Cloud deployment
- Production checklist
- Example (Python): Production server configuration
- Example (TypeScript): Production deployment
- Verify: Complete deployment workflow

**Task 2.9: Write "FastMCP v3 Beta Features" section**
- New features in v3 beta
- Breaking changes from v2
- Migration guide for v2 to v3
- Version compatibility matrix
- Clear markers for beta vs stable
- Example: v3-specific features
- Verify: Clear guidance on when to use v2 vs v3

**Task 2.10: Write "Integration with Creating-Skills Workflow" section**
- How to use this skill with creating-skills
- When to compose both skills
- Workflow for creating custom MCP-based skills
- Example: Creating a domain-specific MCP skill
- Verify: Clear integration pattern with creating-skills

### Phase 3: Add Required Workflow (15-20 minutes)

**Task 3.1: Write comprehensive `<required>` checklist**
Items to include:
1. Determine server purpose and components needed
2. Create FastMCP server file with basic structure
3. Implement tools with type hints and validation
4. Add resources if data access needed
5. Add prompts if workflow guidance needed
6. Configure Claude Desktop integration
7. Test server locally
8. Add authentication for production
9. Deploy using appropriate transport
10. Verify integration with Claude Desktop

Each step should have clear guidelines underneath

**Task 3.2: Add workflow decision matrices**
- When to use tools vs resources vs prompts
- When to use STDIO vs HTTP vs SSE transport
- When to use FastMCP vs official SDK
- Verify: Clear decision criteria for common choices

### Phase 4: Add Examples and Templates (20-30 minutes)

**Task 4.1: Add "Complete Examples" section**
Include full working examples:
- Basic CRUD API wrapper
- Database integration with security
- File system access with validation
- Multi-step workflow with prompts and context
- Production server with OAuth
Each example should be copy-paste ready
- Verify: All examples are complete and runnable

**Task 4.2: Add "Templates" section**
Provide boilerplate for common patterns:
- Tool function template
- Resource URI template
- Prompt template
- Production server config template
- Verify: Templates cover 80% of common use cases

### Phase 5: Documentation and Polish (10-15 minutes)

**Task 5.1: Add "References" section**
- Official FastMCP documentation links
- Model Context Protocol specification
- Claude Desktop integration guide
- Community resources (Discord, GitHub)
- Verify: All links are current and accessible

**Task 5.2: Add "Version Compatibility" section**
- FastMCP v2 vs v3 beta notes
- Python version requirements
- Breaking changes to watch for
- Verify: Clear version guidance

**Task 5.3: Review and format**
- Check all markdown formatting
- Verify code blocks have language tags
- Check heading hierarchy
- Ensure consistent terminology
- Verify: Professional, polished presentation

### Phase 6: Integration and Testing (10-15 minutes)

**Task 6.1: Run validation tests**
- Execute all manual verification tests from Testing Plan
- Document any issues found
- Fix issues
- Re-run tests until all pass
- Verify: All tests passing

**Task 6.2: Compare with similar skills**
- Read `/home/elvis/.claude/skills/builder-role-skill/SKILL.md`
- Read `/home/elvis/.claude/skills/github-actions-reference/SKILL.md`
- Verify structure matches established patterns
- Adjust if needed
- Verify: Consistent with existing skill patterns

**Task 6.3: Update skills directory README**
- Add fastmcp skill to `/home/elvis/claude-command-and-control/.worktrees/create-fastmcp-skill/skills/README.md`
- Include description, activation triggers
- Verify: Skill is discoverable

**Task 6.4: Create integration test suite**
- Create test file: `skills/fastmcp/integration_tests.md`
- Document test cases from Testing Plan (tests 6-10)
- Create test invocation script for automated testing
- Verify: Test suite is complete and executable

**Task 6.5: Run integration tests**
- Execute each integration test case
- Document results
- Fix any issues found
- Re-run until all tests pass
- Verify: All integration tests passing

**Task 6.6: Commit changes**
- Stage: `git add skills/fastmcp/`
- Commit: `git commit -m "feat(skills): add comprehensive fastmcp skill for MCP server development

Includes:
- Python and TypeScript examples
- FastMCP v2 and v3 beta coverage
- Integration with creating-skills workflow
- Complete integration test suite"`
- Verify: Clean git status

---

## File Paths

All file paths are absolute and account for worktree:
- **Skill directory**: `/home/elvis/claude-command-and-control/.worktrees/create-fastmcp-skill/skills/fastmcp/`
- **Main skill file**: `/home/elvis/claude-command-and-control/.worktrees/create-fastmcp-skill/skills/fastmcp/SKILL.md`
- **Skills README**: `/home/elvis/claude-command-and-control/.worktrees/create-fastmcp-skill/skills/README.md`

---

## Testing Details

**Validation Strategy**: Manual verification tests focus on skill BEHAVIOR (activation, completeness, usability) rather than implementation details. Tests verify:
1. Skill activates for appropriate user requests
2. Content is complete and accurate
3. Examples are syntactically valid and follow best practices
4. Structure matches established Nori skill patterns
5. Information progresses logically from basics to advanced

**No Mock Testing**: Tests validate real skill content against actual FastMCP documentation and best practices from research.

**Behavior Testing**: Tests focus on whether skill achieves its goal (helping developers build FastMCP servers effectively) rather than testing internal structure.

---

## Implementation Details

1. **Single SKILL.md file** - Entire skill in one markdown file for easy loading
2. **Multi-language examples** - Python AND TypeScript/JavaScript examples for all core concepts
3. **Progressive disclosure** - Basics first, advanced patterns later, optional sections clearly marked
4. **Rigid workflow** - `<required>` checklist with detailed guidelines for each step
5. **Production-ready examples** - All code examples include error handling, type hints, security considerations
6. **Decision matrices** - Clear criteria for choosing between options (tools vs resources, transport types, etc.)
7. **Common pitfalls prominently featured** - Environment isolation, security defaults, and other gotchas from research
8. **Integration-focused** - Claude Desktop integration is core workflow, not optional addendum
9. **Version-aware** - FastMCP v2 stable AND v3 beta content with clear version markers
10. **Template-driven** - Boilerplate templates reduce cognitive load for common patterns
11. **Creating-skills integration** - Composable with creating-skills workflow for custom MCP-based skills
12. **Integration test suite** - Complete test suite that invokes skill via Claude and verifies behavior
13. **Link to authoritative sources** - FastMCP docs, MCP spec, Claude Desktop guide for deep dives

---

## Questions - ANSWERED

1. **Should the skill include TypeScript/JavaScript examples?** ✅ YES - Include both TypeScript/JavaScript and Python examples to cover broader MCP ecosystem.

2. **Should the skill cover building MCP clients or only servers?** ✅ CONFIRMED - Focus primarily on servers as planned.

3. **How to handle FastMCP v3 beta content?** ✅ INCLUDE - Add FastMCP v3 beta content alongside v2 stable with clear version markers.

4. **Should the skill integrate with existing `creating-skills` workflow?** ✅ YES - Integrate with creating-skills workflow for composability.

5. **Testing strategy**: ✅ ADD INTEGRATION TESTS - Create integration tests that invoke the skill via Claude and verify output.

---

## Edge Cases

1. **User has FastMCP installed but wrong version** - Skill should check version and guide upgrade if needed
2. **User on Windows** - Claude Desktop config path differs on Windows, skill should note platform differences
3. **User wants to proxy remote MCP server** - Advanced pattern, ensure it's in Advanced Patterns section
4. **User wants server composition** - Advanced pattern, ensure clear example of combining servers
5. **User encounters environment isolation issues** - Very common, make sure troubleshooting is prominent
6. **User wants authentication but doesn't have OAuth credentials** - Guide to token verification fallback
7. **User deploying to production without HTTPS** - Security warning should be unmissable
8. **User has async/sync confusion** - Clear guidance on when each is appropriate and how FastMCP handles both
9. **User tries to use `*args`/`**kwargs` in tool** - Common mistake, clear error explanation in Common Pitfalls
10. **User expects Context to persist across requests** - Common misunderstanding, clarify Context lifecycle

---
