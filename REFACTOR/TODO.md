# TODO.md: claude-command-and-control Refactoring Execution Checklist

**Status**: Ready for Phase 1  
**Last Updated**: January 23, 2026  
**Total Tasks**: 87  
**Phases**: 6

---

## PHASE 1: Planning & Validation (Week 1)

### 1.1 Current State Documentation

- [ ] **Create FILE_INVENTORY.txt**
  - [ ] `find . -type f -name "*.md" | grep -E "(commands|agents|skills|orchestration)" > FILE_INVENTORY.txt`
  - [ ] Manually categorize each file (template type, category)
  - [ ] Note file sizes and modification dates
  - [ ] **Deliverable**: FILE_INVENTORY.txt (complete)

- [ ] **Create DUPLICATES.txt**
  - [ ] `diff -r @commands-templates/ templates/commands/ > DUPLICATES_COMMANDS.txt`
  - [ ] `diff -r @agents-templates/ templates/agents/ > DUPLICATES_AGENTS.txt`
  - [ ] `diff -r @skills-templates/ templates/skills/ > DUPLICATES_SKILLS.txt`
  - [ ] Analyze: Are differences meaningful or just formatting?
  - [ ] Document merge strategy for each duplicate pair
  - [ ] **Deliverable**: DUPLICATES.txt (complete)

- [ ] **Create REFERENCES.txt**
  - [ ] `grep -r "@commands-templates" . > REFERENCES_COMMANDS.txt`
  - [ ] `grep -r "@agents-templates" . > REFERENCES_AGENTS.txt`
  - [ ] `grep -r "@skills-templates" . > REFERENCES_SKILLS.txt`
  - [ ] Count total references (aim for ~100-150)
  - [ ] Note which files have most references (priority for updates)
  - [ ] **Deliverable**: REFERENCES.txt (complete)

### 1.2 Skills Audit (Most Complex)

- [ ] **Inventory: 20 Active Skills**
  - [ ] `ls -la skills/ > ACTIVE_SKILLS_LIST.txt`
  - [ ] For each skill, document:
    - [ ] Skill name and version
    - [ ] Description/purpose
    - [ ] Dependencies
    - [ ] Last modified date
    - [ ] Active projects using it
  - [ ] **Deliverable**: ACTIVE_SKILLS_INVENTORY.md (detailed table)

- [ ] **Inventory: 31 Template Skills**
  - [ ] `ls -la @skills-templates/ > TEMPLATE_SKILLS_LIST.txt`
  - [ ] For each skill, document same fields as above
  - [ ] **Deliverable**: TEMPLATE_SKILLS_INVENTORY.md (detailed table)

- [ ] **Merge Analysis: 20 vs 31**
  - [ ] Create comparison table with columns:
    - [ ] Skill name (active)
    - [ ] Exists in templates? (Y/N)
    - [ ] Version difference?
    - [ ] Merge strategy (keep template | keep active | merge | deprecate)
  - [ ] For "merge" entries, document specific differences
  - [ ] For "deprecate" entries, document obsolescence reason
  - [ ] **Deliverable**: SKILL_MERGE_STRATEGY.md (decision document)

- [ ] **Categorization Decision**
  - [ ] Group skills by domain:
    - [ ] Development (code generation, testing, debugging)
    - [ ] Infrastructure (DevOps, deployment, monitoring)
    - [ ] Documentation (writing, analysis, planning)
    - [ ] Orchestration (multi-agent coordination)
  - [ ] Note any skills that don't fit (create new category or reconsider)
  - [ ] Document why each categorization makes sense
  - [ ] **Deliverable**: SKILL_CATEGORIZATION.md (domain mapping)

### 1.3 Commands & Agents Audit

- [ ] **Commands Audit**
  - [ ] List all 13 commands from @commands-templates/
  - [ ] Check for duplicates in templates/commands/
  - [ ] Document categorization: core / integration / orchestration
  - [ ] Note any custom commands in projects (not in templates)
  - [ ] **Deliverable**: COMMANDS_AUDIT.md

- [ ] **Agents Audit**
  - [ ] List all agents from @agents-templates/
  - [ ] Document each agent's role (architect, builder, validator, etc.)
  - [ ] Identify orchestrator agents vs. specialist agents
  - [ ] Note any custom agents in use
  - [ ] **Deliverable**: AGENTS_AUDIT.md

### 1.4 Orchestration Consolidation Planning

- [ ] **Map Orchestration Across 3 Directories**
  - [ ] List all files in `@commands-templates/orchestration/`
  - [ ] List all files in `@agents-templates/orchestration/`
  - [ ] List all files in `@skills-templates/orchestration/`
  - [ ] Identify overlaps vs. unique contributions
  - [ ] Document which directory "owns" each concept
  - [ ] **Deliverable**: ORCHESTRATION_MAPPING.md

- [ ] **Planning Directory Design**
  - [ ] Decide: Include MULTI_AGENT_PLAN.md template? (YES)
  - [ ] Decide: Include AGENT_REGISTRY.md template? (YES)
  - [ ] Decide: Create patterns subdirectory? (YES - parallel execution, sequential handoff, fan-out)
  - [ ] **Deliverable**: ORCHESTRATION_DESIGN.md

### 1.5 Dependency Analysis

- [ ] **Build Reference Graph**
  - [ ] For each skill, document which other skills it imports/depends on
  - [ ] For each command, document which agents/skills it uses
  - [ ] For each agent, document which skills it requires
  - [ ] Create visual dependency graph (text-based acceptable)
  - [ ] Identify any circular dependencies (should be zero!)
  - [ ] **Deliverable**: DEPENDENCY_GRAPH.md + DEPENDENCY_GRAPH.txt

- [ ] **Import Statement Analysis**
  - [ ] Find all `import` statements across codebase
  - [ ] Find all `from X import Y` statements
  - [ ] List all files that need path updates
  - [ ] Note which imports use relative vs. absolute paths
  - [ ] **Deliverable**: IMPORT_ANALYSIS.md

### 1.6 Risk Assessment

- [ ] **Document Breaking Changes**
  - [ ] List all @-prefixed paths (count: ~100+)
  - [ ] Estimate effort to update each path category
  - [ ] Assess severity of each breaking change
  - [ ] Document which users/projects affected
  - [ ] **Deliverable**: BREAKING_CHANGES.md

- [ ] **Identify Edge Cases**
  - [ ] Check for symlinks (may break during move)
  - [ ] Check for hard-coded paths in scripts
  - [ ] Check for references in documentation
  - [ ] Check for GitHub Actions workflows using old paths
  - [ ] **Deliverable**: EDGE_CASES.md

- [ ] **GitHub Actions Audit**
  - [ ] List all .github/workflows/*.yml files
  - [ ] Identify which workflows reference old path structure
  - [ ] Test workflows locally with new structure
  - [ ] **Deliverable**: GITHUB_ACTIONS_AUDIT.md

### 1.7 Phase 1 Completion

- [ ] **Generate Summary Report**
  - [ ] Document findings from all audits
  - [ ] Confirm feasibility of proposed structure
  - [ ] Get stakeholder approval
  - [ ] **Deliverable**: PHASE1_SUMMARY.md

- [ ] **Create Backup**
  - [ ] `git commit -am "BACKUP: Pre-refactoring state" && git tag backup/v1`
  - [ ] Verify commit hash and tag
  - [ ] **Deliverable**: Git tag backup/v1

- [ ] **Phase 1 Go/No-Go Decision**
  - [ ] All audits complete? âœ…
  - [ ] Risk mitigation strategies defined? âœ…
  - [ ] Stakeholder approval obtained? âœ…
  - [ ] **Decision**: â³ Awaiting approval to proceed to Phase 2

---

## PHASE 2: Create New Structure (Week 2)

### 2.1 Create Directory Hierarchy

- [ ] **Create library/ structure**
  ```bash
  mkdir -p library/{commands,agents,skills,orchestration}
  mkdir -p library/commands/{core,integration,orchestration}
  mkdir -p library/agents/{roles,orchestration}
  mkdir -p library/skills/{by-category,by-complexity}
  mkdir -p library/skills/by-category/{development,infrastructure,documentation,orchestration}
  mkdir -p library/skills/by-complexity/{minimal,standard,comprehensive}
  mkdir -p library/orchestration/{planning,patterns}
  ```
  - [ ] Verify all directories created
  - [ ] **Deliverable**: Directory tree listing

- [ ] **Create .claude/ structure**
  ```bash
  mkdir -p .claude/{commands,agents,skills}
  ```
  - [ ] Verify directories created
  - [ ] **Deliverable**: Directory tree listing

### 2.2 Create README.md Files (Library Root)

- [ ] **library/README.md**
  - [ ] Overview of library purpose
  - [ ] Quick navigation guide
  - [ ] Directory structure diagram
  - [ ] Link to best practices
  - [ ] **Deliverable**: library/README.md (complete)

- [ ] **library/commands/README.md**
  - [ ] Use Section 4.1 pattern from REFACTORING_PLAN.md
  - [ ] List all commands with quick descriptions
  - [ ] Usage instructions (copy, customize, deploy)
  - [ ] Links to command-specific docs
  - [ ] **Deliverable**: library/commands/README.md (complete)

- [ ] **library/agents/README.md**
  - [ ] Use Section 4.1 pattern
  - [ ] Explain roles vs. orchestrators
  - [ ] How to instantiate agents
  - [ ] How to compose agents
  - [ ] **Deliverable**: library/agents/README.md (complete)

- [ ] **library/skills/README.md**
  - [ ] Use Section 4.1 pattern
  - [ ] Explain by-category vs. by-complexity navigation
  - [ ] How to use skills in agents
  - [ ] How to extend/customize skills
  - [ ] **Deliverable**: library/skills/README.md (complete)

- [ ] **library/orchestration/README.md**
  - [ ] Use Section 4.1 pattern
  - [ ] Explain planning directory (templates, templates)
  - [ ] Explain patterns directory (reusable patterns)
  - [ ] Links to 5 orchestration examples
  - [ ] **Deliverable**: library/orchestration/README.md (complete)

### 2.3 Create Subcategory README.md Files

- [ ] **library/commands/{core,integration,orchestration}/README.md**
  - [ ] For each: list templates in that category
  - [ ] Explain when to use each template
  - [ ] Provide copy-paste starter for each
  - [ ] **Deliverable**: 3 README.md files

- [ ] **library/agents/{roles,orchestration}/README.md**
  - [ ] For roles: list specialist agents (architect, builder, etc.)
  - [ ] For orchestration: list orchestrator agents
  - [ ] Explain configuration requirements
  - [ ] **Deliverable**: 2 README.md files

- [ ] **library/skills/by-category/{development,infrastructure,documentation,orchestration}/README.md**
  - [ ] For each: list skills in that category
  - [ ] Provide category-specific guidance
  - [ ] Link to examples using those skills
  - [ ] **Deliverable**: 4 README.md files

- [ ] **library/skills/by-complexity/{minimal,standard,comprehensive}/README.md**
  - [ ] For each: explain complexity level
  - [ ] When to start with minimal vs. standard
  - [ ] How to extend minimal to standard
  - [ ] **Deliverable**: 3 README.md files

- [ ] **library/orchestration/{planning,patterns}/README.md**
  - [ ] Planning: introduce MULTI_AGENT_PLAN.md and AGENT_REGISTRY.md templates
  - [ ] Patterns: list available patterns (parallel, sequential, fan-out)
  - [ ] **Deliverable**: 2 README.md files

### 2.4 Create .claude/ README.md

- [ ] **Write .claude/README.md**
  ```markdown
  # Active Instances

  âš ï¸ **WARNING**: These are LIVE INSTANCES in use by this project.

  - Do NOT use this directory as source of truth for templates
  - Templates are in library/
  - To modify a template, edit in library/ and copy to .claude/
  - To update instances here, pull from library/
  
  ### Current Active Components
  
  - **Commands**: [list]
  - **Agents**: [list]
  - **Skills**: [list]
  ```
  - [ ] **Deliverable**: .claude/README.md (complete)

### 2.5 Create Placeholder Structure Documentation

- [ ] **Create examples/README.md**
  - [ ] Explain purpose of examples/
  - [ ] Note that examples will be populated in Phase 3
  - [ ] **Deliverable**: examples/README.md (placeholder)

- [ ] **Create STRUCTURE.md**
  - [ ] Comprehensive documentation of new structure
  - [ ] Directory tree with descriptions
  - [ ] Migration flowchart
  - [ ] **Deliverable**: STRUCTURE.md (complete)

### 2.6 Phase 2 Completion

- [ ] **Verify Directory Structure**
  ```bash
  # Run this command to verify complete structure
  find library .claude -type d | sort > VERIFIED_STRUCTURE.txt
  ```
  - [ ] All expected directories present
  - [ ] **Deliverable**: VERIFIED_STRUCTURE.txt

- [ ] **Commit New Structure**
  - [ ] `git add library/ .claude/ STRUCTURE.md`
  - [ ] `git commit -m "PHASE2: Create new unified structure (no files moved yet)"`
  - [ ] **Deliverable**: Git commit

- [ ] **Phase 2 Go/No-Go Decision**
  - [ ] All directories created? âœ…
  - [ ] All README.md files complete? âœ…
  - [ ] Documentation clear and correct? âœ…
  - [ ] **Decision**: Ready for Phase 3 (move templates)

---

## PHASE 3: Consolidate Templates (Week 3)

### 3.1 Skills Migration (Most Complex)

**FOR EACH MERGED SKILL** (using SKILL_MERGE_STRATEGY.md):

- [ ] **Skill: [Name]**
  - [ ] Decision: [keep template | keep active | merge | deprecate]
  - [ ] If merge:
    - [ ] Compare files (diff -u active/ template/)
    - [ ] Document meaningful differences
    - [ ] Manually merge or keep version with more features
    - [ ] Update version metadata
  - [ ] Copy final version to: `library/skills/by-category/[category]/[name]/`
  - [ ] Create symlink: `library/skills/by-complexity/[complexity]/[name] -> ../by-category/[category]/[name]`
  - [ ] Update SKILL.md header with new location info
  - [ ] Update any internal references within skill
  - [ ] **Deliverable**: Migrated skill in correct location

**Complete skills migration**:
- [ ] Skill [1]: âœ…
- [ ] Skill [2]: âœ…
- [ ] Skill [3]: âœ…
- [ ] ... (continue for all ~40 merged skills)
- [ ] Skill [40]: âœ…

**Skills Migration Summary**:
- [ ] All merged skills in library/skills/
- [ ] All symlinks created to by-complexity/
- [ ] Old skills/ directory backed up (not deleted yet)
- [ ] **Deliverable**: SKILLS_MIGRATION_COMPLETE.md

### 3.2 Commands Migration

- [ ] **Migrate core commands**
  - [ ] Move all 13 core command templates to: `library/commands/core/`
  - [ ] For each command:
    - [ ] Copy file to correct location
    - [ ] Update internal references (if any)
    - [ ] Verify format and structure
  - [ ] **Deliverable**: All 13 core commands migrated

- [ ] **Migrate integration commands**
  - [ ] Move integration/content-management commands to: `library/commands/integration/`
  - [ ] **Deliverable**: All integration commands migrated

- [ ] **Migrate orchestration commands**
  - [ ] Move spawn-agents.md, coordinate-workflow.md, etc. to: `library/commands/orchestration/`
  - [ ] **Deliverable**: All orchestration commands migrated

**Commands Migration Summary**:
- [ ] Old @commands-templates/ backed up (not deleted yet)
- [ ] Old templates/commands/ backed up (not deleted yet)
- [ ] **Deliverable**: COMMANDS_MIGRATION_COMPLETE.md

### 3.3 Agents Migration

- [ ] **Migrate specialist agents (roles)**
  - [ ] Move architect.md to: `library/agents/roles/architect/`
  - [ ] Move builder.md to: `library/agents/roles/builder/`
  - [ ] Move validator.md to: `library/agents/roles/validator/`
  - [ ] Move scribe.md to: `library/agents/roles/scribe/`
  - [ ] Move devops.md to: `library/agents/roles/devops/`
  - [ ] Move researcher.md to: `library/agents/roles/researcher/`
  - [ ] **Deliverable**: All specialist agents in library/agents/roles/

- [ ] **Migrate orchestration agents**
  - [ ] Move orchestrator agents to: `library/agents/orchestration/`
  - [ ] **Deliverable**: All orchestration agents migrated

**Agents Migration Summary**:
- [ ] Old @agents-templates/ backed up (not deleted yet)
- [ ] **Deliverable**: AGENTS_MIGRATION_COMPLETE.md

### 3.4 Orchestration Consolidation

- [ ] **Consolidate planning templates**
  - [ ] Locate MULTI_AGENT_PLAN.md across 3 directories
  - [ ] Keep best version â†’ `library/orchestration/planning/MULTI_AGENT_PLAN.md`
  - [ ] Locate AGENT_REGISTRY.md across 3 directories
  - [ ] Keep best version â†’ `library/orchestration/planning/AGENT_REGISTRY.md`
  - [ ] **Deliverable**: Planning templates consolidated

- [ ] **Consolidate orchestration skills**
  - [ ] Move all orchestration-specific skills to: `library/skills/by-category/orchestration/`
  - [ ] Include: multi-agent-planner, parallel-executor, worktree-manager, agent-communication
  - [ ] **Deliverable**: Orchestration skills consolidated

- [ ] **Create orchestration patterns directory**
  - [ ] Move or create pattern files to: `library/orchestration/patterns/`
  - [ ] Patterns to include:
    - [ ] parallel-execution.md
    - [ ] sequential-handoff.md
    - [ ] fan-out-fan-in.md
  - [ ] Each pattern includes: when to use, example, code template
  - [ ] **Deliverable**: 3+ patterns documented

**Orchestration Consolidation Summary**:
- [ ] Planning templates in one location âœ…
- [ ] Orchestration skills in one location âœ…
- [ ] Patterns documented âœ…
- [ ] **Deliverable**: ORCHESTRATION_CONSOLIDATION_COMPLETE.md

### 3.5 Update All References

- [ ] **Replace @commands-templates/ references**
  ```bash
  find . -type f -name "*.md" \
    -exec sed -i 's|@commands-templates|library/commands|g' {} \;
  find . -type f -name "*.py" -o -name "*.js" -o -name "*.ts" 2>/dev/null \
    -exec sed -i 's|@commands-templates|library/commands|g' {} \;
  ```
  - [ ] Verify no @commands-templates/ remains: `grep -r "@commands-templates" . | wc -l`
  - [ ] **Deliverable**: 0 references to @commands-templates/

- [ ] **Replace @agents-templates/ references**
  ```bash
  find . -type f -name "*.md" \
    -exec sed -i 's|@agents-templates|library/agents|g' {} \;
  ```
  - [ ] Verify none remain: `grep -r "@agents-templates" . | wc -l`
  - [ ] **Deliverable**: 0 references to @agents-templates/

- [ ] **Replace @skills-templates/ references**
  ```bash
  find . -type f -name "*.md" \
    -exec sed -i 's|@skills-templates|library/skills|g' {} \;
  ```
  - [ ] Verify none remain: `grep -r "@skills-templates" . | wc -l`
  - [ ] **Deliverable**: 0 references to @skills-templates/

- [ ] **Update CLAUDE.md**
  - [ ] Open CLAUDE.md
  - [ ] Replace all old-style references
  - [ ] Verify all paths in CLAUDE.md point to library/ or .claude/
  - [ ] **Deliverable**: Updated CLAUDE.md

- [ ] **Update any Python/JS imports**
  - [ ] Find all `from skills import X` statements
  - [ ] Update to: `from .claude.skills import X` or appropriate path
  - [ ] Test that imports still work
  - [ ] **Deliverable**: Updated import statements

**Reference Update Summary**:
- [ ] @commands-templates/ replaced: 0 remaining
- [ ] @agents-templates/ replaced: 0 remaining
- [ ] @skills-templates/ replaced: 0 remaining
- [ ] CLAUDE.md updated: âœ…
- [ ] Python/JS imports updated: âœ…
- [ ] **Deliverable**: REFERENCE_UPDATE_COMPLETE.md

### 3.6 Clean Up Old Directories

- [ ] **Backup old directories** (before deletion)
  ```bash
  mkdir -p backups/
  mv @commands-templates backups/@commands-templates.bak
  mv @agents-templates backups/@agents-templates.bak
  mv @skills-templates backups/@skills-templates.bak
  mkdir -p backups/templates
  cp -r templates/* backups/templates/
  ```
  - [ ] Verify backups created
  - [ ] **Deliverable**: Backup directory with all old structures

- [ ] **Remove old directories**
  ```bash
  rm -rf @commands-templates/ @agents-templates/ @skills-templates/
  # Keep templates/ for now (may contain other content)
  ```
  - [ ] Verify old directories gone: `ls -la | grep "^d.*@"`
  - [ ] **Deliverable**: Old directories removed

### 3.7 Phase 3 Completion

- [ ] **Run verification checks**
  ```bash
  # Check no old-style paths remain
  grep -r "@commands-templates\|@agents-templates\|@skills-templates" . --include="*.md" | wc -l
  # Should output: 0
  
  # Check all symlinks valid
  find library -type l -exec test ! -e {} \; -print
  # Should output: (nothing)
  
  # Check no duplicates between library/ and old locations
  find . -name "duplicates.txt" -delete  # Clean up
  ```
  - [ ] All old-style paths gone âœ…
  - [ ] All symlinks valid âœ…
  - [ ] No duplicates remain âœ…

- [ ] **Commit consolidated structure**
  - [ ] `git add library/ .claude/ backups/`
  - [ ] `git commit -m "PHASE3: Consolidate templates into unified library/"`
  - [ ] `git tag phase3/consolidation-complete`
  - [ ] **Deliverable**: Git commit and tag

- [ ] **Phase 3 Go/No-Go Decision**
  - [ ] All templates migrated? âœ…
  - [ ] All references updated? âœ…
  - [ ] Old directories backed up and removed? âœ…
  - [ ] Verification checks passed? âœ…
  - [ ] **Decision**: Ready for Phase 4 (active instances)

---

## PHASE 4: Establish Active Instances (Week 4)

### 4.1 Identify Active Skills

- [ ] **Review CLAUDE.md for active skills**
  - [ ] List all skills referenced in project instructions
  - [ ] List all skills actively used in recent commits
  - [ ] **Deliverable**: ACTIVE_SKILLS_FINAL.txt (list of 5-10 active skills)

- [ ] **Identify active commands**
  - [ ] Review recent project activity
  - [ ] List commands used in CLAUDE.md or workflows
  - [ ] **Deliverable**: ACTIVE_COMMANDS_FINAL.txt

- [ ] **Identify active agents**
  - [ ] Review CLAUDE.md for agent specifications
  - [ ] List agents deployed in .claude/ (if any already exist)
  - [ ] **Deliverable**: ACTIVE_AGENTS_FINAL.txt

### 4.2 Populate .claude/ Directory

- [ ] **Copy active skills to .claude/skills/**
  - [ ] For each skill in ACTIVE_SKILLS_FINAL.txt:
    - [ ] `cp -r library/skills/by-category/[category]/[skill] .claude/skills/`
    - [ ] Verify copy successful
  - [ ] **Deliverable**: .claude/skills/ populated with active skills

- [ ] **Copy active commands to .claude/commands/**
  - [ ] For each command in ACTIVE_COMMANDS_FINAL.txt:
    - [ ] `cp library/commands/[category]/[command].md .claude/commands/`
    - [ ] Verify copy successful
  - [ ] **Deliverable**: .claude/commands/ populated

- [ ] **Copy active agents to .claude/agents/**
  - [ ] For each agent in ACTIVE_AGENTS_FINAL.txt:
    - [ ] `cp -r library/agents/[category]/[agent] .claude/agents/`
    - [ ] Verify copy successful
  - [ ] **Deliverable**: .claude/agents/ populated

### 4.3 Update Project References

- [ ] **Update CLAUDE.md to reference .claude/**
  - [ ] Change skill imports from: `from library/skills/...` to `from .claude/skills/...`
  - [ ] Update agent references from: `library/agents/...` to `.claude/agents/...`
  - [ ] Keep template references pointing to `library/` for reference
  - [ ] Example:
    ```markdown
    # Active Skills (in production)
    - Skills are deployed in `.claude/skills/`
    - Source templates available in `library/skills/`
    
    # To Update a Skill:
    1. Edit in `library/skills/by-category/[category]/[name]/`
    2. Test thoroughly
    3. Copy to `.claude/skills/`
    ```
  - [ ] **Deliverable**: Updated CLAUDE.md

- [ ] **Update any agent configuration files**
  - [ ] If agents use configuration files, update paths
  - [ ] Example: `architect-config.json` paths should point to `.claude/skills/`
  - [ ] **Deliverable**: Updated config files

- [ ] **Update any workflow files**
  - [ ] Check if any GitHub Actions workflows reference old paths
  - [ ] Update to reference `.claude/` for active instances
  - [ ] **Deliverable**: Updated .github/workflows/*.yml

### 4.4 Create Deployment Documentation

- [ ] **Create DEPLOYMENT.md**
  - [ ] How to deploy new skill to .claude/
  - [ ] How to test in .claude/ before deploying
  - [ ] How to rollback if something breaks
  - [ ] **Deliverable**: DEPLOYMENT.md (complete)

- [ ] **Create .claude/MANIFEST.txt**
  - [ ] List all active instances and versions
  - [ ] Example:
    ```
    Active Instances Manifest
    Generated: 2026-01-[DATE]
    
    Skills:
    - skill-1 (v1.0) from library/skills/by-category/development/
    - skill-2 (v1.1) from library/skills/by-category/infrastructure/
    
    Commands:
    - core-command-1
    - orchestration-command-1
    
    Agents:
    - architect (v1.0)
    - builder (v1.0)
    - orchestrator (v1.0)
    ```
  - [ ] **Deliverable**: .claude/MANIFEST.txt

### 4.5 Phase 4 Completion

- [ ] **Verify .claude/ structure**
  ```bash
  tree .claude/
  ```
  - [ ] All active instances present
  - [ ] Directory structure matches expectations
  - [ ] **Deliverable**: Tree output

- [ ] **Test active instances**
  - [ ] Test each skill: `python .claude/skills/[name]/test.py`
  - [ ] Test each command: manual execution test
  - [ ] Test each agent: instantiation test
  - [ ] **Deliverable**: TEST_RESULTS.md

- [ ] **Commit active instances**
  - [ ] `git add .claude/ CLAUDE.md .github/workflows/`
  - [ ] `git commit -m "PHASE4: Establish active instances in .claude/"`
  - [ ] `git tag phase4/active-instances-complete`
  - [ ] **Deliverable**: Git commit and tag

- [ ] **Phase 4 Go/No-Go Decision**
  - [ ] All active instances copied? âœ…
  - [ ] All references updated? âœ…
  - [ ] All tests passing? âœ…
  - [ ] Deployment documented? âœ…
  - [ ] **Decision**: Ready for Phase 5 (documentation)

---

## PHASE 5: Update Documentation (Week 5)

### 5.1 Update README.md

- [ ] **Rewrite README.md with new structure**
  - [ ] Update directory structure diagram
  - [ ] New quick-start section
  - [ ] Clear distinction: library/ vs .claude/
  - [ ] New "Getting Started" workflow
  - [ ] Migration notice for existing users
  - [ ] **Deliverable**: Updated README.md

- [ ] **Create STRUCTURE.md (comprehensive)**
  - [ ] Detailed directory tree
  - [ ] Purpose of each directory
  - [ ] When to edit where
  - [ ] Workflows for different tasks
  - [ ] **Deliverable**: STRUCTURE.md (complete)

### 5.2 Create MIGRATION_GUIDE.md

- [ ] **Write migration guide**
  - [ ] Audience: existing users
  - [ ] Before/after examples
  - [ ] Breaking changes listed
  - [ ] Step-by-step migration instructions
  - [ ] FAQ section
  - [ ] Support contact information
  - [ ] **Deliverable**: MIGRATION_GUIDE.md (complete)

### 5.3 Create QUICK_START.md

- [ ] **Write quick start guide**
  - [ ] New users: How to find templates
  - [ ] Copy a template: step-by-step
  - [ ] Customize it: common customizations
  - [ ] Deploy it: to .claude/
  - [ ] Use it: in projects
  - [ ] **Deliverable**: QUICK_START.md (complete)

### 5.4 Create INDEX.md

- [ ] **Create master index of all templates**
  - [ ] Table: All 13 core commands
  - [ ] Table: All 6 specialist agents
  - [ ] Table: All ~40 skills (organized by category)
  - [ ] Table: All 4 orchestration patterns
  - [ ] Brief description of each
  - [ ] Link to full documentation
  - [ ] **Deliverable**: INDEX.md (complete)

### 5.5 Update Existing Documentation

- [ ] **Update docs/best-practices/12-Skills-First-Planning-and-Orchestration.md**
  - [ ] Update path references
  - [ ] Update examples to use new paths
  - [ ] **Deliverable**: Updated documentation

- [ ] **Update all docs/references/agent-skills-specification.md**
  - [ ] Ensure paths point to library/
  - [ ] **Deliverable**: Updated documentation

- [ ] **Update all docs/tutorials/**
  - [ ] Scan for old-style path references
  - [ ] Update each to use new paths
  - [ ] Verify examples still work
  - [ ] **Deliverable**: Updated tutorials

### 5.6 Update Examples

- [ ] **Create/update examples/README.md**
  - [ ] Purpose of examples
  - [ ] How to use examples
  - [ ] List all 5 orchestration examples
  - [ ] **Deliverable**: examples/README.md (complete)

- [ ] **For each example, create markdown file**
  - [ ] examples/orchestration/5-agent-full-pipeline.md
  - [ ] examples/orchestration/parallel-validation.md
  - [ ] examples/orchestration/hierarchical-agents.md
  - [ ] examples/orchestration/skill-composition.md
  - [ ] examples/orchestration/real-world-feature-dev.md
  - [ ] Each includes: scenario, setup, execution, results
  - [ ] **Deliverable**: 5 complete example files

### 5.7 Create Deprecation Notices

- [ ] **Add deprecation notice to old directories (if kept)**
  - [ ] Create @commands-templates/DEPRECATED.md
  - [ ] Create @agents-templates/DEPRECATED.md
  - [ ] Create @skills-templates/DEPRECATED.md
  - [ ] Content: "This directory is deprecated. Use library/ instead."
  - [ ] **Deliverable**: 3 deprecation notice files

### 5.8 Phase 5 Completion

- [ ] **Verify all documentation**
  - [ ] No broken internal links: `grep -r "^\[.*\]\(.*library" docs/ | wc -l` should match expected count
  - [ ] All paths use new convention
  - [ ] All examples reference .claude/ or library/ appropriately
  - [ ] **Deliverable**: Documentation verification report

- [ ] **Commit documentation updates**
  - [ ] `git add README.md STRUCTURE.md MIGRATION_GUIDE.md QUICK_START.md INDEX.md docs/ examples/`
  - [ ] `git commit -m "PHASE5: Update documentation for new structure"`
  - [ ] `git tag phase5/documentation-complete`
  - [ ] **Deliverable**: Git commit and tag

- [ ] **Phase 5 Go/No-Go Decision**
  - [ ] README.md updated? âœ…
  - [ ] Migration guide complete? âœ…
  - [ ] All docs updated? âœ…
  - [ ] No broken links? âœ…
  - [ ] **Decision**: Ready for Phase 6 (testing)

---

## PHASE 6: Testing & Validation (Week 6)

### 6.1 Functional Testing

- [ ] **Test all commands**
  - [ ] For each command in library/commands/:
    - [ ] Run: `[command execution]`
    - [ ] Expected result: [success criteria]
    - [ ] Actual result: [pass/fail]
  - [ ] Document results in COMMAND_TEST_RESULTS.md
  - [ ] **Deliverable**: COMMAND_TEST_RESULTS.md (100% pass)

- [ ] **Test all agents**
  - [ ] For each agent in library/agents/:
    - [ ] Instantiate agent
    - [ ] Load required skills
    - [ ] Verify no errors
  - [ ] Document results in AGENT_TEST_RESULTS.md
  - [ ] **Deliverable**: AGENT_TEST_RESULTS.md (100% pass)

- [ ] **Test all skills**
  - [ ] For each skill in library/skills/:
    - [ ] Import skill module
    - [ ] Execute sample function call
    - [ ] Verify output
  - [ ] Document results in SKILL_TEST_RESULTS.md
  - [ ] **Deliverable**: SKILL_TEST_RESULTS.md (100% pass)

- [ ] **Test all active instances in .claude/**
  - [ ] Verify each instance is accessible
  - [ ] Verify paths resolve correctly
  - [ ] Verify instances work in project context
  - [ ] **Deliverable**: ACTIVE_INSTANCES_TEST_RESULTS.md

### 6.2 Integration Testing

- [ ] **Test command + agents + skills integration**
  - [ ] Execute command that uses agents
  - [ ] Verify agents load required skills
  - [ ] Verify skills execute correctly
  - [ ] Document end-to-end flow
  - [ ] **Deliverable**: INTEGRATION_TEST_RESULTS.md

- [ ] **Test GitHub Actions workflows**
  - [ ] Run workflows that use old directory structure
  - [ ] Verify workflows use updated paths
  - [ ] Run actual workflows in CI/CD
  - [ ] **Deliverable**: GITHUB_ACTIONS_TEST_RESULTS.md

### 6.3 Documentation Validation

- [ ] **Check for broken links**
  ```bash
  # Use markdown link checker (if available) or manual check
  grep -rh "\[.*\](.*)" README.md docs/ library/ | grep -o '\(.*\)' | sort -u | while read link; do
    if [ ! -f "$link" ] && [ ! -d "$link" ]; then
      echo "Broken: $link"
    fi
  done
  ```
  - [ ] Run link checker
  - [ ] Fix any broken links
  - [ ] **Deliverable**: LINK_CHECK_RESULTS.md (0 broken links)

- [ ] **Verify examples execute correctly**
  - [ ] For each example in examples/:
    - [ ] Manually execute or trace through
    - [ ] Verify all paths are correct
    - [ ] Verify all steps work as described
  - [ ] **Deliverable**: EXAMPLE_VALIDATION_RESULTS.md

- [ ] **Review migration guide with test user**
  - [ ] Have someone unfamiliar with project follow MIGRATION_GUIDE.md
  - [ ] Time how long migration takes
  - [ ] Note any confusing sections
  - [ ] Update guide based on feedback
  - [ ] **Deliverable**: MIGRATION_GUIDE_FEEDBACK.md + updated guide

### 6.4 Performance & Safety Checks

- [ ] **Check for circular dependencies**
  ```bash
  # Build dependency graph and check for cycles
  # (Verify using output from Phase 1: DEPENDENCY_GRAPH.md)
  ```
  - [ ] Confirm no circular dependencies introduced
  - [ ] **Deliverable**: CIRCULAR_DEPENDENCY_CHECK.md (0 cycles)

- [ ] **Verify no data loss**
  - [ ] Compare file counts: `find . -type f | wc -l`
  - [ ] Before: X files
  - [ ] After: X files (should be same, minus deleted backups)
  - [ ] **Deliverable**: DATA_LOSS_CHECK.md

- [ ] **Verify backup integrity**
  - [ ] Check backup directories in backups/
  - [ ] Verify all original files present
  - [ ] Calculate checksums to ensure no corruption
  - [ ] **Deliverable**: BACKUP_INTEGRITY_CHECK.md

### 6.5 Stakeholder Validation

- [ ] **Present refactoring to team**
  - [ ] Show new structure
  - [ ] Demonstrate navigation
  - [ ] Show before/after examples
  - [ ] Gather feedback
  - [ ] **Deliverable**: STAKEHOLDER_FEEDBACK.md

- [ ] **Address any outstanding issues**
  - [ ] For each feedback item: fix or explain why not fixing
  - [ ] Update documentation based on feedback
  - [ ] **Deliverable**: ISSUE_RESOLUTION.md

### 6.6 Phase 6 Completion

- [ ] **Generate comprehensive test report**
  - [ ] Combine all test results
  - [ ] Summary: X tests, X passed, 0 failed
  - [ ] Any risks or concerns to monitor
  - [ ] **Deliverable**: PHASE6_TEST_REPORT.md (final)

- [ ] **Create rollback procedure (for safety)**
  - [ ] Document exact steps to rollback if needed
  - [ ] Include git commands
  - [ ] Include backup recovery commands
  - [ ] **Deliverable**: ROLLBACK_PROCEDURE.md

- [ ] **Final commit before release**
  - [ ] `git add [all test results and final docs]`
  - [ ] `git commit -m "PHASE6: Complete testing and validation (all tests pass)"`
  - [ ] `git tag phase6/testing-complete`
  - [ ] `git tag v1.0-refactored`  # Mark as official new version
  - [ ] **Deliverable**: Git commit and tag

- [ ] **Phase 6 Go/No-Go Decision**
  - [ ] All command tests pass? âœ…
  - [ ] All agent tests pass? âœ…
  - [ ] All skill tests pass? âœ…
  - [ ] Integration tests pass? âœ…
  - [ ] Documentation validated? âœ…
  - [ ] No broken links? âœ…
  - [ ] No data loss? âœ…
  - [ ] Stakeholder approval? âœ…
  - [ ] **DECISION**: âœ… APPROVED FOR PRODUCTION RELEASE

---

## POST-REFACTORING: Ongoing Maintenance

### Phase 7: Monitoring (Weeks 7+)

- [ ] **Monitor user feedback** (first 2 weeks)
  - [ ] Watch for support issues
  - [ ] Update MIGRATION_GUIDE.md FAQ
  - [ ] Fix any edge cases discovered
  - [ ] **Deliverable**: Weekly feedback summary

- [ ] **Clean up backups** (after 4 weeks)
  - [ ] If no critical issues found, delete backups/
  - [ ] Confirm with team first
  - [ ] `rm -rf backups/`
  - [ ] **Deliverable**: Confirmation that backups deleted

- [ ] **Update onboarding documentation** (ongoing)
  - [ ] New team members should use new structure only
  - [ ] Update team wiki/handbook
  - [ ] Create video walkthrough (optional)
  - [ ] **Deliverable**: Updated onboarding docs

---

## SUCCESS CHECKLIST: Final Verification

Before marking refactoring as COMPLETE:

**Structure Verification**:
- [ ] Zero @-prefixed directories remain
- [ ] library/ is single source of truth
- [ ] .claude/ contains only active instances
- [ ] No duplicate templates

**Functional Verification**:
- [ ] All 13 core commands work
- [ ] All 6 specialist agents work
- [ ] All ~40 skills work
- [ ] All 4 orchestration patterns documented
- [ ] GitHub Actions workflows pass

**Documentation Verification**:
- [ ] README.md reflects new structure
- [ ] CLAUDE.md has updated paths
- [ ] MIGRATION_GUIDE.md complete
- [ ] All internal links valid (0 broken)
- [ ] All examples execute correctly

**User-Facing Verification**:
- [ ] Users can find templates easily
- [ ] Users can copy-paste templates
- [ ] Users can customize templates
- [ ] Users can deploy to .claude/
- [ ] Migration guide works for existing users

**Production Readiness**:
- [ ] All tests pass (100%)
- [ ] No circular dependencies
- [ ] No data loss
- [ ] Backups verified intact
- [ ] Stakeholder sign-off obtained

---

## End of TODO.md

**Total Tasks**: 87  
**Phases Completed**: 0/6  
**Overall Progress**: 0%

**Next Action**: â³ Awaiting approval to begin Phase 1 (Planning & Validation)

---

**Document Control**

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-01-23 | Draft | Ready for Phase 1 |

**Contact**: Architecture Team  
**Escalation**: [Contact Information]
