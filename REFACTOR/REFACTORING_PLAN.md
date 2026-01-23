# claude-command-and-control: Structural Refactoring Plan

**Version**: 1.0  
**Status**: Proposed  
**Last Updated**: January 23, 2026  
**Author**: Architecture Review  
**Scope**: Complete structural reorganization

---

## Executive Summary

The `claude-command-and-control` repository currently suffers from **structural fragmentation** that creates maintainability debt, discovery friction, and confusion between template libraries and active instances. This plan consolidates three overlapping directory hierarchies into a unified, hierarchical architecture that supports both template management and active production usage.

**Key Improvements**:
- âœ… Eliminate 90% of directory duplication
- âœ… Single source of truth for all templates
- âœ… Clear separation: templates vs. active instances
- âœ… Intuitive discovery hierarchy (by role, complexity, domain)
- âœ… Backward-compatible migration path

---

## 1. Current State Analysis

### 1.1 Directory Fragmentation

**Root-level @-prefixed directories** (source of confusion):

```
@commands-templates/          # 13 command templates
â”œâ”€â”€ core/
â”œâ”€â”€ integration/
â””â”€â”€ orchestration/            # ðŸ”´ DUPLICATE #1

@agents-templates/            # Agent templates
â”œâ”€â”€ orchestration/            # ðŸ”´ DUPLICATE #2
â””â”€â”€ [role-based agents]

@skills-templates/            # 31 skill templates
â””â”€â”€ orchestration/            # ðŸ”´ DUPLICATE #3
```

**Competing `templates/` directory**:

```
templates/
â”œâ”€â”€ commands/                 # OVERLAPS with @commands-templates/
â”œâ”€â”€ orchestration/            # OVERLAPS with multiple sources
â”œâ”€â”€ skills/
â””â”€â”€ [other templates]
```

**Active instances scattered**:

```
skills/                        # 20 active production skills
commands/                      # Some active commands?
agents/                        # Some active agents?
```

**Result**: Users must search 4+ locations to find a template

### 1.2 Skills Confusion

| Concern | Impact | Severity |
|---------|--------|----------|
| **20 vs 31 skills unclear** | Duplicate maintenance burden | ðŸ”´ High |
| **No distinction between templates and instances** | Unclear what's production-ready vs. example | ðŸ”´ High |
| **`skills/` vs `@skills-templates/` purpose** | Impossible to discover which to copy from | ðŸ”´ High |
| **Cross-references use inconsistent paths** | Links break during reorganization | ðŸŸ¡ Medium |

### 1.3 Orchestration Fragmentation

Three separate orchestration directories:

1. **`@commands-templates/orchestration/`** - Multi-agent coordination commands
2. **`@agents-templates/orchestration/`** - Orchestrator agents
3. **`@skills-templates/orchestration/`** - Orchestration skills

**Problem**: Related concepts scattered across filesystem, no unified planning directory

---

## 2. Proposed Unified Architecture

### 2.1 High-Level Structure

```
claude-command-and-control/
â”‚
â”œâ”€â”€ .claude/                           # ðŸ”µ ACTIVE INSTANCES
â”‚   â”œâ”€â”€ commands/                      # Active commands in production
â”‚   â”œâ”€â”€ agents/                        # Active agent configs
â”‚   â”œâ”€â”€ skills/                        # Active skills deployed
â”‚   â””â”€â”€ README.md                      # "These are live, do not edit templates here"
â”‚
â”œâ”€â”€ library/                           # ðŸ”µ CONSOLIDATED TEMPLATES (SINGLE SOURCE OF TRUTH)
â”‚   â”œâ”€â”€ commands/
â”‚   â”‚   â”œâ”€â”€ core/                      # start, test, pr, commit, etc.
â”‚   â”‚   â”‚   â”œâ”€â”€ [13 command templates]
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”œâ”€â”€ integration/               # Content management, publishing
â”‚   â”‚   â”‚   â”œâ”€â”€ [templates]
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”œâ”€â”€ orchestration/             # Multi-agent coordination commands
â”‚   â”‚   â”‚   â”œâ”€â”€ spawn-agents.md
â”‚   â”‚   â”‚   â”œâ”€â”€ coordinate-workflow.md
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â””â”€â”€ README.md                  # Discovery guide
â”‚   â”‚
â”‚   â”œâ”€â”€ agents/
â”‚   â”‚   â”œâ”€â”€ roles/                     # Specialist agents
â”‚   â”‚   â”‚   â”œâ”€â”€ architect/
â”‚   â”‚   â”‚   â”œâ”€â”€ builder/
â”‚   â”‚   â”‚   â”œâ”€â”€ validator/
â”‚   â”‚   â”‚   â”œâ”€â”€ scribe/
â”‚   â”‚   â”‚   â”œâ”€â”€ devops/
â”‚   â”‚   â”‚   â”œâ”€â”€ researcher/
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”œâ”€â”€ orchestration/             # Orchestrator agents
â”‚   â”‚   â”‚   â”œâ”€â”€ multi-agent-controller/
â”‚   â”‚   â”‚   â”œâ”€â”€ workflow-manager/
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚
â”‚   â”œâ”€â”€ skills/
â”‚   â”‚   â”œâ”€â”€ by-category/               # Primary organizational view
â”‚   â”‚   â”‚   â”œâ”€â”€ development/           # Code generation, testing, debugging
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ [skills]
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”‚   â”œâ”€â”€ infrastructure/        # DevOps, deployment, monitoring
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ [skills]
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”‚   â”œâ”€â”€ documentation/         # Writing, analyzing, planning
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ [skills]
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”‚   â”œâ”€â”€ orchestration/         # Multi-agent coordination
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ multi-agent-planner-skill/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ parallel-executor-skill/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ worktree-manager-skill/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ agent-communication-skill/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”‚   â””â”€â”€ [other categories]/
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ by-complexity/             # Secondary organizational view
â”‚   â”‚   â”‚   â”œâ”€â”€ minimal/               # Proof-of-concept skills
â”‚   â”‚   â”‚   â”œâ”€â”€ standard/              # Production-ready skills
â”‚   â”‚   â”‚   â””â”€â”€ comprehensive/         # Feature-rich skills
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ README.md                  # Navigation guide
â”‚   â”‚
â”‚   â”œâ”€â”€ orchestration/                 # ðŸ”µ CONSOLIDATED PLANNING
â”‚   â”‚   â”œâ”€â”€ planning/
â”‚   â”‚   â”‚   â”œâ”€â”€ MULTI_AGENT_PLAN.md    # Template for multi-agent plans
â”‚   â”‚   â”‚   â”œâ”€â”€ AGENT_REGISTRY.md      # Track available agents/capabilities
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â”œâ”€â”€ patterns/                  # Reusable orchestration patterns
â”‚   â”‚   â”‚   â”œâ”€â”€ parallel-execution/
â”‚   â”‚   â”‚   â”œâ”€â”€ sequential-handoff/
â”‚   â”‚   â”‚   â”œâ”€â”€ fan-out-fan-in/
â”‚   â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚
â”‚   â””â”€â”€ README.md                      # Library overview & navigation
â”‚
â”œâ”€â”€ examples/                          # ðŸ”µ WORKING IMPLEMENTATIONS
â”‚   â”œâ”€â”€ commands/
â”‚   â”‚   â”œâ”€â”€ parallel-feature-dev.md    # Real command execution trace
â”‚   â”‚   â”œâ”€â”€ complex-pr-workflow.md
â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”œâ”€â”€ agents/
â”‚   â”‚   â”œâ”€â”€ feature-team-setup.md      # How agents were configured
â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”œâ”€â”€ skills/
â”‚   â”‚   â”œâ”€â”€ custom-testing-skill.md    # From generic to specialized
â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”œâ”€â”€ orchestration/
â”‚   â”‚   â”œâ”€â”€ 5-agent-full-pipeline.md   # End-to-end orchestration
â”‚   â”‚   â”œâ”€â”€ parallel-validation.md
â”‚   â”‚   â”œâ”€â”€ hierarchical-agents.md
â”‚   â”‚   â”œâ”€â”€ skill-composition.md
â”‚   â”‚   â””â”€â”€ README.md
â”‚   â”‚
â”‚   â””â”€â”€ README.md
â”‚
â”œâ”€â”€ docs/                              # ðŸŸ¢ UNCHANGED
â”‚   â”œâ”€â”€ best-practices/
â”‚   â”œâ”€â”€ references/
â”‚   â””â”€â”€ tutorials/
â”‚
â”œâ”€â”€ INTEGRATION/                       # ðŸŸ¢ UNCHANGED
â”œâ”€â”€ MAINTENANCE/                       # ðŸŸ¢ UNCHANGED
â”œâ”€â”€ configs/                           # Shared configurations
â”‚
â”œâ”€â”€ README.md                          # Updated structure guide
â”œâ”€â”€ CLAUDE.md                          # Updated project instructions
â””â”€â”€ MIGRATION_GUIDE.md                 # ðŸ”µ NEW: User migration instructions

```

### 2.2 Directory Rationale

#### `.claude/` - Active Production Instances

**Purpose**: Contains ONLY currently-deployed, in-use components

**Characteristics**:
- Edited frequently during project work
- Not versioned; ephemeral
- Project-specific, not templates
- Clear warning: "Do not edit for templates; copy from library/"

**Rationale**: 
- Separates "what I'm using" from "what I could use"
- Prevents accidental template edits
- Makes cleanup/reset easy (just delete)

#### `library/` - Single Source of Truth

**Purpose**: Central repository for all template components

**Three organizational views**:

1. **`by-category/`** (Primary for skills)
   - Discovery by domain (what does this category do?)
   - Natural mental model
   - Example: "I need a DevOps skill" â†’ `library/skills/by-category/infrastructure/`

2. **`by-complexity/`** (Secondary for skills)
   - Discovery by scaffolding level
   - Example: "I want to understand minimal skills" â†’ `library/skills/by-complexity/minimal/`

3. **Role-based** (For agents)
   - Each specialist role in dedicated directory
   - Clear responsibilities

#### `orchestration/` - Consolidated Planning

**Purpose**: All orchestration concepts in one place

**Three sections**:
1. **`planning/`** - MULTI_AGENT_PLAN.md and AGENT_REGISTRY.md templates
2. **`patterns/`** - Reusable patterns (parallel execution, handoff, fan-out)
3. Integrated with skills/orchestration for implementation

---

## 3. Migration Strategy

### 3.1 Phase 1: Planning & Validation (Week 1)

**Deliverables**:
- âœ… This REFACTORING_PLAN.md
- âœ… TODO.md with detailed task breakdown
- âœ… Dependency map (which files reference what)
- âœ… Risk assessment

**Actions**:
```bash
# Create complete inventory
find . -type f -name "*.md" | grep -E "(commands|agents|skills|orchestration)" > FILE_INVENTORY.txt

# Identify duplicates
diff -r @commands-templates/ templates/commands/ > DUPLICATES.txt

# Find all references to @-prefixed paths
grep -r "@commands-templates" . > REFERENCES.txt
grep -r "@agents-templates" . >> REFERENCES.txt
grep -r "@skills-templates" . >> REFERENCES.txt
```

**Exit Criteria**:
- Complete file inventory
- All duplicates documented
- All cross-references identified
- Risk mitigation strategies defined

---

### 3.2 Phase 2: Create New Structure (Week 2)

**Create library/ hierarchy without deleting anything**:

```bash
# Create new library structure
mkdir -p library/{commands,agents,skills,orchestration}
mkdir -p library/commands/{core,integration,orchestration}
mkdir -p library/agents/{roles,orchestration}
mkdir -p library/skills/{by-category,by-complexity}
mkdir -p library/skills/by-category/{development,infrastructure,documentation,orchestration}
mkdir -p library/skills/by-complexity/{minimal,standard,comprehensive}
mkdir -p library/orchestration/{planning,patterns}

# Create .claude structure
mkdir -p .claude/{commands,agents,skills}
```

**Create README.md files** (see Section 4.1)

**Exit Criteria**:
- All directories exist
- README.md files document each section
- No files moved yet (parallel structure only)

---

### 3.3 Phase 3: Intelligently Move Templates (Week 3)

**Consolidate skills** (most complex due to 20 vs 31 duplication):

```bash
# 1. Audit: Which skills in 20 are missing in 31?
diff -r skills/ @skills-templates/ > SKILL_AUDIT.txt

# 2. Merge: Keep comprehensive versions, de-duplicate
# FOR EACH SKILL:
#   - Compare versions
#   - Merge if materially different (version metadata, examples, etc.)
#   - Keep one canonical version with "See also:" links
#   - Document decision in SKILL_AUDIT.txt

# 3. Move merged skills to library/skills/by-category/
# Categorize by domain (development, infrastructure, etc.)
# Symlink to by-complexity for secondary organization
```

**Move commands**:
```bash
# Consolidate @commands-templates/ and templates/commands/
# Move to library/commands/{core,integration,orchestration}/

# Update ALL @commands-templates/ references:
find . -type f -name "*.md" -exec sed -i \
  's|@commands-templates|library/commands|g' {} \;
```

**Move agents**:
```bash
# Move @agents-templates/ to library/agents/roles/ (specialist agents)
# Move orchestration agents to library/agents/orchestration/

# Update all references
find . -type f -name "*.md" -exec sed -i \
  's|@agents-templates|library/agents|g' {} \;
```

**Consolidate orchestration**:
```bash
# Move planning templates from @*-templates/orchestration/ to:
# library/orchestration/planning/

# Move skill implementations to:
# library/skills/by-category/orchestration/

# Move agent implementations to:
# library/agents/orchestration/

# Move command implementations to:
# library/commands/orchestration/

# Create library/orchestration/patterns/ for reusable patterns
```

**Exit Criteria**:
- All templates moved to `library/`
- No more `@commands-templates/`, `@agents-templates/`, `@skills-templates/`
- Minimal `templates/` directory (only README explaining migration)
- All references updated

---

### 3.4 Phase 4: Establish Active Instances (Week 4)

**Mirror active components to `.claude/`**:

```bash
# Identify which skills are actually in production use
grep -r "from skills import\|import skills\|skills\/" CLAUDE.md > ACTIVE_SKILLS.txt

# Copy active instances to .claude/
cp -r [identified skills] .claude/skills/
cp -r [identified commands] .claude/commands/
cp -r [identified agents] .claude/agents/

# Add .claude/README.md
# Content: "These are ACTIVE INSTANCES. Templates are in library/. 
#           Do not treat this as source of truth; changes here affect production."
```

**Update references in CLAUDE.md**:

```bash
# Change references from:
# "from skills import X" 
# to:
# "from .claude/skills/X import Y"

find . -name "CLAUDE.md" -exec sed -i \
  's|from skills import|from .claude/skills import|g' {} \;
```

**Exit Criteria**:
- `.claude/` contains only active instances
- No duplication between `.claude/` and `library/`
- CLAUDE.md updated with new paths
- Clear documentation in `.claude/README.md`

---

### 3.5 Phase 5: Update Documentation (Week 5)

**Update main README.md**:
- New directory structure diagram
- Quick navigation guide
- Migration notices for existing users

**Update CLAUDE.md**:
- New path references
- Updated project instructions
- Deprecation notes for old paths

**Create MIGRATION_GUIDE.md**:
- Before/after examples
- Breaking changes listed
- Automated migration script (if feasible)
- FAQ section

**Update all cross-references**:
```bash
# Find all remaining old-style references
grep -r "@commands-templates\|@agents-templates\|@skills-templates" . \
  --include="*.md" > REMAINING_REFS.txt

# Manually update or create redirect comments
```

**Exit Criteria**:
- No broken internal links (verify with link checker)
- MIGRATION_GUIDE.md complete
- README.md reflects new structure
- All documentation updated

---

### 3.6 Phase 6: Testing & Validation (Week 6)

**Functional testing**:

```bash
# 1. Verify all commands still work
# For each command in .claude/commands/:
#   - Manually test or run integration tests
#   - Verify references resolve

# 2. Verify all agents still work
# For each agent in .claude/agents/:
#   - Test instantiation
#   - Verify skill references resolve

# 3. Verify all skills still work
# For each skill in .claude/skills/:
#   - Test invocation
#   - Verify dependencies resolved

# 4. Test GitHub Actions workflows (if any)
# Ensure CI/CD still works with new structure
```

**Documentation validation**:

```bash
# Check for broken internal links
# Use markdown link checker or manual verification

# Verify all examples in examples/ are correct
# Re-run any executable examples
```

**User migration support**:
- Create PR with all changes
- Document migration path in PR description
- Provide automated script if possible
- Monitor for user questions/issues

**Exit Criteria**:
- All tests pass
- No broken links
- Examples execute correctly
- GitHub Actions workflows functional

---

## 4. Documentation Standards for New Structure

### 4.1 README.md Pattern (Each Section)

```markdown
# [Category] Templates

**Purpose**: Clear one-liner describing contents

## Quick Start

[Copy-paste starter template]

## Directory Structure

[Tree diagram]

## Using Templates

1. Choose template from [relevant subcategory]
2. Copy to .claude/[type]/ 
3. Update configuration [specific fields]
4. Deploy with [specific command]

## Templates Included

| Template | Purpose | Complexity | Best For |
|----------|---------|-----------|----------|
| template-1 | ... | minimal | ... |

## See Also

- [Related category]
- [Best practices link]
- [Tutorials link]

## Contributing

To add a template:
1. Create in appropriate subcategory
2. Include proper SKILL.md or equivalent header
3. Update this README
```

### 4.2 Template Header Standard

```markdown
# [Template Name]

**Type**: skill | command | agent | orchestration-pattern  
**Category**: development | infrastructure | documentation | orchestration  
**Complexity**: minimal | standard | comprehensive  
**Status**: stable | beta | experimental  
**Version**: 1.0  

## Overview

[One paragraph describing what this template does]

## Use Cases

- [Use case 1]
- [Use case 2]

## Requirements

- Claude model [version]
- Tool access: [list]
- External dependencies: [list]

## Getting Started

### Installation

```bash
cp library/[path/to/template] .claude/[type]/[name]/
```

### Configuration

```json
{
  "key": "value"
}
```

### First Use

```bash
[command to invoke]
```

## Key Features

- Feature 1: Description
- Feature 2: Description

## Examples

### Example 1: [Scenario]

[Complete working example]

## Troubleshooting

### Problem 1

[Solution]

## Related Templates

- [Related template 1]
- [Related template 2]

## References

- [Reference 1]
- [Official documentation]
```

---

## 5. Breaking Changes & Deprecation Strategy

### 5.1 Breaking Changes

| Change | Impact | Mitigation |
|--------|--------|-----------|
| `@commands-templates/` â†’ `library/commands/` | All references break | Automated sed replacement (see Phase 3) |
| `@agents-templates/` â†’ `library/agents/` | All references break | Automated sed replacement |
| `@skills-templates/` â†’ `library/skills/` | All references break | Automated sed replacement |
| Skills: 20 â†’ merged set | Existing references may change | SKILL_AUDIT.txt documents merges |
| Direct skill imports change | Code using `from skills import X` breaks | Update CLAUDE.md with new paths |

### 5.2 Deprecation Timeline

**Weeks 1-2**: Announce plan, gather feedback  
**Week 3-4**: Execute migration, old paths still resolve via deprecation notice  
**Week 5-6**: Provide migration guide, support users  
**Week 7+**: Old paths removed, full cutover

### 5.3 Migration Script

```bash
#!/bin/bash
# migrate-references.sh

# Backup original files
git checkout -b refactor/structure-consolidation
git add .

# Replace all @-prefixed references
find . -type f -name "*.md" \
  -exec sed -i 's|@commands-templates|library/commands|g' {} \;

find . -type f -name "*.md" \
  -exec sed -i 's|@agents-templates|library/agents|g' {} \;

find . -type f -name "*.md" \
  -exec sed -i 's|@skills-templates|library/skills|g' {} \;

# Update import statements (if applicable)
find . -type f \( -name "*.py" -o -name "*.js" -o -name "*.ts" \) \
  -exec sed -i 's|from skills import|from .claude/skills import|g' {} \;

echo "âœ… Migration complete. Review changes and commit."
git diff

```

---

## 6. Success Criteria

### 6.1 Structural Metrics

- âœ… **Zero duplicate template directories**: No @-prefixed directories remain
- âœ… **Single source of truth**: Each template exists in ONE location
- âœ… **Clear instance distinction**: `.claude/` contains ONLY active instances
- âœ… **Intuitive hierarchy**: New users find templates in <2 minutes

### 6.2 Functional Metrics

- âœ… **All tests pass**: 100% test coverage post-migration
- âœ… **No broken links**: All internal references valid
- âœ… **GitHub Actions functional**: CI/CD pipelines work with new structure
- âœ… **Backward compatibility**: Migration script works for users

### 6.3 Documentation Metrics

- âœ… **README.md updated**: New structure documented
- âœ… **CLAUDE.md updated**: All paths reflect new structure
- âœ… **MIGRATION_GUIDE.md complete**: Users can self-migrate
- âœ… **Examples updated**: All 5 orchestration examples work

---

## 7. Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Breaking changes miss users** | Medium | High | Deprecation warning + migration script |
| **Skills 20 vs 31 merge loses functionality** | Low | High | Complete SKILL_AUDIT.txt + version merge strategy |
| **GitHub Actions break** | Low | High | Test workflows in CI before cutover |
| **Circular dependencies introduced** | Low | Medium | Validate import/reference graph |
| **User confusion during transition** | Medium | Medium | Detailed MIGRATION_GUIDE.md + examples |

---

## 8. Rollback Plan

If critical issues arise:

```bash
# Complete rollback to pre-refactoring state
git revert HEAD~6..HEAD      # Revert all Phase commits
rm -rf library/ .claude/      # Remove new structure
git checkout @commands-templates/ @agents-templates/ @skills-templates/
```

**Decision point**: After Phase 3 (Week 3), if >3 critical issues found, pause and conduct post-mortem.

---

## 9. Timeline & Milestones

| Phase | Duration | Deliverable | Go/No-Go |
|-------|----------|------------|----------|
| 1: Planning | 1 week | REFACTORING_PLAN.md, TODO.md | Stakeholder approval |
| 2: Create structure | 1 week | New directories, READMEs | Pass lint check |
| 3: Move templates | 1 week | Consolidated library/ | Pass all tests |
| 4: Active instances | 1 week | .claude/ populated | Functionality verified |
| 5: Documentation | 1 week | README/CLAUDE/MIGRATION updated | Link check passes |
| 6: Testing & validation | 1 week | All tests pass | Production ready |

**Total Duration**: 6 weeks (phased rollout)

**Start Date**: [Decision required]  
**Target Completion**: [6 weeks from start]

---

## 10. Next Steps

1. âœ… **Review this plan** with team stakeholders
2. âœ… **Validate proposed structure** against real usage patterns
3. âœ… **Approve breaking changes** list
4. âœ… **Generate TODO.md** (detailed task breakdown)
5. âœ… **Execute Phase 1** (Planning & Validation)
6. âœ… **Begin Phase 2** (Create New Structure)

---

## Appendix A: Current Directory Inventory

### Skills Audit

**`skills/`** (20 items):
- List all skills, note which are production-active

**`@skills-templates/`** (31 items):
- List all templates, cross-reference against skills/

**Decision**: Merge versions, consolidate to `library/skills/`

### Commands Audit

**`@commands-templates/`** (13 items):
- start.md, test.md, pr.md, commit.md, etc.

**`templates/commands/`**:
- Compare for duplicates

**Decision**: Consolidate to `library/commands/`

### Agents Audit

**`@agents-templates/`**:
- Specialist agents: architect, builder, validator, scribe, devops, researcher

**`templates/` (agents section)**:
- Check for overlaps

**Decision**: Consolidate to `library/agents/`

---

## Appendix B: Reference Migration Examples

### Before

```markdown
[See @commands-templates/orchestration/spawn-agents.md](/@commands-templates/orchestration/spawn-agents.md)

[Use @agents-templates/orchestration/](/@agents-templates/orchestration/)

[Copy from @skills-templates/orchestration/multi-agent-planner/](/@skills-templates/orchestration/multi-agent-planner/)
```

### After

```markdown
[See library/commands/orchestration/spawn-agents.md](/library/commands/orchestration/spawn-agents.md)

[Use library/agents/orchestration/](/library/agents/orchestration/)

[Copy from library/skills/by-category/orchestration/multi-agent-planner/](/library/skills/by-category/orchestration/multi-agent-planner/)
```

---

**Document Control**

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-01-23 | Architecture Review | Initial comprehensive plan |

**Approval Status**: Pending stakeholder review  
**Last Reviewed**: 2026-01-23
