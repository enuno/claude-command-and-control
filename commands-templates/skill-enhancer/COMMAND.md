---
description: "Enhance, upgrade, or maintain existing Claude skills with new information, best practices, or requirements while preserving core functionality"
allowed-tools: ["Read", "Edit", "Write", "Grep", "Glob", "Bash(ls)", "Bash(mkdir)", "Bash(cp)", "Bash(git)"]
author: "Claude Command and Control"
version: "1.0"
---

# Skill Enhancer

## Purpose
Upgrade existing Claude skills with new information, best practices, or additional requirements while maintaining their core identity and functionality. Transforms skills from good to excellent through systematic quality improvements, capability additions, and specification compliance.

## Features
- 🔍 **Comprehensive Analysis** - Deep evaluation of existing skill structure
- ✨ **Quality Improvement** - Enhance clarity, examples, and edge case handling
- 🚀 **Capability Addition** - Integrate new features while maintaining backward compatibility
- 📊 **Specification Compliance** - Align with latest Agent Skills standards
- 🔄 **Version Management** - Semantic versioning with complete changelog
- 🧪 **Testing Framework** - Validation scenarios before and after enhancement
- 📝 **Documentation Updates** - Automatic README and index updates

## Usage

### Basic Enhancement
```bash
/skill-enhancer skills/api-documentation-generator
```

### With Specific Requirements
```bash
/skill-enhancer skills/api-documentation-generator \
  --add "OpenAPI 3.1 support" \
  --improve "error response documentation"
```

### Quality-Focused Enhancement
```bash
/skill-enhancer skills/database-migration \
  --priority quality \
  --focus "examples,error-handling"
```

### Specification Compliance Update
```bash
/skill-enhancer skills/legacy-skill \
  --comply-with latest \
  --create-variant
```

## Parameters

| Parameter | Description | Required | Example |
|-----------|-------------|----------|---------|
| `skill-path` | Path to skill directory | Yes | `skills/api-docs/` |
| `--add` | New capabilities to add | No | `"OpenAPI 3.1 support"` |
| `--improve` | Specific areas to improve | No | `"examples,error-handling"` |
| `--priority` | Enhancement priority | No | `quality\|capabilities\|performance` |
| `--focus` | Specific sections to enhance | No | `"examples,edge-cases"` |
| `--comply-with` | Spec version to align with | No | `latest\|v2.0` |
| `--create-variant` | Create new variant instead of modifying | No | (flag) |
| `--test-scenarios` | Custom test scenarios file | No | `tests/scenarios.md` |

## Workflow

### Step 1: Skill Analysis & Assessment (3-5 min)

**Load and analyze the existing skill:**

```bash
# Read the current SKILL.md
!cat [skill-path]/SKILL.md

# Check for referenced resources
!ls -la [skill-path]/
```

**Evaluate current state:**

Display to user:
```
🔍 ANALYZING SKILL: [skill-name]
═══════════════════════════════════════════

📋 CURRENT STATE:
  Version: [current-version]
  Tags: [tag-list]
  Size: [file-size]

📂 RESOURCES FOUND:
  • SKILL.md ✓
  • examples/ ([X] files) [if exists]
  • knowledge/ ([X] files) [if exists]
  • references/ ([X] files) [if exists]
  • tests/ ([X] files) [if exists]

🎯 QUALITY ASSESSMENT:
  • Description clarity: [Good|Needs Improvement]
  • Instruction specificity: [Good|Needs Improvement]
  • Examples coverage: [Good|Needs Improvement]
  • Edge case handling: [Good|Needs Improvement]
  • Error handling: [Good|Needs Improvement]
  • Specification compliance: [✅|⚠️|❌]

💡 IMPROVEMENT OPPORTUNITIES IDENTIFIED:
  1. [Specific issue or opportunity]
  2. [Specific issue or opportunity]
  3. [Specific issue or opportunity]
```

**Ask the user:**

```
🤔 ENHANCEMENT PLANNING

Based on the analysis, I've identified several improvement areas.

Please clarify:

1. What new information or requirements should be incorporated?
   [User provides context or references]

2. Are there specific pain points or failures with the current skill?
   [User describes issues they've encountered]

3. What's the priority for this enhancement?
   a) Quality (clarity, examples, documentation)
   b) Capabilities (new features, integrations)
   c) Maintainability (structure, reusability)
   d) Performance (token efficiency, speed)

   Your choice: [User selects]

4. Should this create a new variant or modify the existing skill?
   [Modify existing | Create variant]
```

### Step 2: Enhancement Planning (2-3 min)

**Create detailed enhancement plan:**

Display to user:
```
📋 ENHANCEMENT PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 OBJECTIVES:
  Priority: [Quality|Capabilities|Maintainability|Performance]
  Scope: [Focused|Moderate|Comprehensive]

📥 NEW INFORMATION INTEGRATION:
  • [What's being added]
  • [How it fits existing workflow]
  • [New resources required]

✨ QUALITY IMPROVEMENTS:
  • [Specific improvement 1]
  • [Specific improvement 2]
  • [Specific improvement 3]

🔧 STRUCTURAL CHANGES:
  • [Section additions/removals]
  • [Resource reorganization]
  • [Format updates]

📊 SPECIFICATION ALIGNMENT:
  • [Compliance items]
  • [Format updates needed]
  • [Breaking changes]

⚠️  BACKWARD COMPATIBILITY:
  Status: [Fully Compatible|Migration Needed|Breaking Changes]
  Impact: [Low|Medium|High]
  [Migration notes if needed]

⏱️  ESTIMATED TIME: [X] minutes

PROCEED WITH THIS PLAN? [User confirms]
```

### Step 3: Implement Enhancements (10-20 min)

**Create backup:**

```bash
# Backup original skill
!cp [skill-path]/SKILL.md [skill-path]/SKILL.md.backup-$(date +%Y%m%d-%H%M%S)

# Backup entire directory if major changes
!tar -czf [skill-path]-backup-$(date +%Y%m%d-%H%M%S).tar.gz [skill-path]/
```

Display:
```
💾 Backup created: [backup-path]
```

**Update YAML Frontmatter:**

```yaml
---
name: [skill-name]  # Keep consistent unless renaming
description: [Enhanced description - action-oriented, clear triggers]
tags: [relevant, updated, keywords]
version: [incremented-version]  # 1.0 → 1.1 or 2.0
updated: [current-date]
changelog: |
  v[new-version]: [Summary of changes]
  - Added: [new capabilities]
  - Changed: [modifications]
  - Fixed: [corrections]
when-to-use: |
  [Refined and expanded trigger conditions]
---
```

**Implement changes systematically:**

1. **For Quality Improvements:**
   - Strengthen description with action-oriented language
   - Add concrete examples with input→process→output
   - Expand edge case documentation
   - Enhance error handling guidance

2. **For New Capabilities:**
   ```markdown
   ## New Feature: [Feature Name]

   ### When to Use
   [Clear trigger conditions for this feature]

   ### Implementation Steps
   1. [Specific action with example]
   2. [Specific action with example]
   3. [Specific action with example]

   ### Example
   **Input:**
   ```
   [Concrete example input]
   ```

   **Process:**
   [What the skill does]

   **Output:**
   ```
   [Expected result]
   ```

   ### Edge Cases
   - **Scenario**: [specific situation]
     - **Approach**: [how to handle]
   ```

3. **For Error Handling:**
   ```markdown
   ## Error Handling

   ### Common Issues

   #### [Issue Category]
   **Symptoms:**
   - [How to recognize this error]

   **Root Cause:**
   - [Why this happens]

   **Resolution:**
   1. [Specific step]
   2. [Specific step]

   **Example:**
   ```
   Error: [actual error message]
   Fix: [actual fix command/approach]
   ```
   ```

4. **Optimize Token Usage:**
   - Move detailed content to separate files
   - Use `See [filename] for details` pattern
   - Keep SKILL.md focused and under 2000 tokens when possible

**Update referenced resources:**

```bash
# If workflow changed, update scripts
!cat [skill-path]/scripts/[script-name]
# Edit as needed

# If templates changed, update them
!cat [skill-path]/templates/[template-name]
# Edit as needed

# Add new resource files
!mkdir -p [skill-path]/[new-directory]
# Create new files
```

Display progress:
```
🔧 IMPLEMENTING ENHANCEMENTS...

✅ YAML frontmatter updated
✅ Description enhanced
✅ New capabilities added ([count] features)
✅ Examples expanded ([count] new examples)
✅ Error handling strengthened
✅ Edge cases documented ([count] scenarios)
✅ Resource files updated ([count] files)
⏳ Optimizing token usage...
✅ Content reorganized for efficiency

ENHANCEMENT COMPLETE
```

### Step 4: Quality Assurance (3-5 min)

**Run validation checklist:**

Display:
```
🧪 QUALITY ASSURANCE
═══════════════════════════════════════════

VALIDATION CHECKLIST:

📝 Description Quality
  ✅ Action-oriented language
  ✅ Clear differentiation from similar skills
  ✅ Triggers on intended use cases

📚 Instruction Quality
  ✅ Steps are specific and actionable
  ✅ No ambiguity in workflow
  ✅ Examples demonstrate key concepts
  ✅ Edge cases documented

🔧 Technical Correctness
  ✅ YAML frontmatter valid
  ✅ All referenced files exist
  ✅ Scripts/code tested (if modified)
  ✅ Links and paths verified

📊 Best Practices
  ✅ Focused on specific, repeatable tasks
  ✅ Written for Claude, not end users
  ✅ Prerequisites and dependencies listed
  ✅ Error handling guidance present

🔄 Backward Compatibility
  [✅ Fully compatible | ⚠️ Migration path documented | ❌ Breaking changes noted]

OVERALL QUALITY: [Excellent|Good|Needs Iteration]
```

**Identify issues:**

If any validation fails:
```
⚠️  ISSUES FOUND:

1. [Specific issue]
   • Fix: [How to address it]

2. [Specific issue]
   • Fix: [How to address it]

Fixing issues now...
[Apply fixes]
✅ All issues resolved
```

### Step 5: Testing & Validation (5-10 min)

**Create test scenarios:**

```markdown
# Test Scenarios for [skill-name] v[new-version]

## Scenario 1: Typical Use Case
**Input:**
[Example input that represents common usage]

**Expected Behavior:**
[What should happen]

**Test:**
[Run the skill with this input]

**Result:** [✅ Pass | ❌ Fail]
**Notes:** [Any observations]

## Scenario 2: New Feature
**Input:**
[Example using new capability]

**Expected Behavior:**
[What the new feature should do]

**Test:**
[Run the skill with new feature]

**Result:** [✅ Pass | ❌ Fail]
**Notes:** [Any observations]

## Scenario 3: Edge Case
**Input:**
[Edge case scenario]

**Expected Behavior:**
[How skill should handle it]

**Test:**
[Run with edge case]

**Result:** [✅ Pass | ❌ Fail]
**Notes:** [Any observations]

## Scenario 4: Error Handling
**Input:**
[Input that should trigger error handling]

**Expected Behavior:**
[Clear error message and recovery guidance]

**Test:**
[Trigger error condition]

**Result:** [✅ Pass | ❌ Fail]
**Notes:** [Any observations]
```

Display results:
```
🧪 TESTING RESULTS
═══════════════════════════════════════════

Test Scenarios: [total]
✅ Passed: [count]
❌ Failed: [count]
⚠️  Warnings: [count]

DETAILED RESULTS:
• Typical use case: ✅ Pass
• New feature test: ✅ Pass
• Edge case handling: ✅ Pass
• Error handling: ✅ Pass

[If failures]
❌ FAILURES REQUIRING ATTENTION:
1. [Scenario name]
   Issue: [What went wrong]
   Fix: [How to address]

RECOMMENDATION: [Proceed|Iterate|Major revision needed]
```

### Step 6: Documentation & Delivery (3-5 min)

**Create comprehensive changelog:**

```markdown
## Changelog

### Version [X.Y.Z] - [Date]

**Added:**
- [New capability or feature with brief description]
- [New resource file with purpose]
- [New example demonstrating specific use case]

**Changed:**
- [Modified behavior with explanation]
- [Improved section with specifics]
- [Restructured content for clarity]

**Fixed:**
- [Bug fix or correction]
- [Typo or formatting issue]
- [Broken link or reference]

**Performance:**
- [Token optimization achieved]
- [Speed improvement noted]

**Breaking Changes:**
- [Any incompatibilities with previous version]
- [Migration path: How to update existing usage]

**Migration Notes:**
If you're upgrading from v[old-version]:
1. [Step to take]
2. [Step to take]
3. [Optional step for specific cases]

**Backward Compatibility:**
[Statement about compatibility with previous version]
```

**Update related documentation:**

```bash
# If skill is in README, update entry
!grep -n "[skill-name]" README.md
# Edit to reflect new capabilities

# If integration guides reference this skill, update them
!grep -r "[skill-name]" docs/
# Update references as needed
```

**Package for deployment:**

```bash
# Verify all files in skill directory
!ls -la [skill-path]/

# Ensure SKILL.md is properly formatted
!head -50 [skill-path]/SKILL.md

# Check file sizes (optimized?)
!du -h [skill-path]/*
```

Display:
```
📦 PACKAGING ENHANCED SKILL
═══════════════════════════════════════════

SKILL: [skill-name]
VERSION: [old-version] → [new-version]
LOCATION: [skill-path]

FILES UPDATED:
  • SKILL.md ([old-size] → [new-size])
  • examples/ ([file-count] files)
  • knowledge/ ([file-count] files)
  • references/ ([file-count] files)
  • [other-directories]

BACKUP LOCATION: [backup-path]

CHANGELOG CREATED: ✅
DOCUMENTATION UPDATED: ✅
TESTING COMPLETED: ✅

QUALITY SCORE: [score]/10
  • Description: [score]/10
  • Instructions: [score]/10
  • Examples: [score]/10
  • Error Handling: [score]/10
```

**Present final summary:**

```
╔═══════════════════════════════════════════════════╗
║       SKILL ENHANCEMENT COMPLETED                  ║
╚═══════════════════════════════════════════════════╝

SKILL: [skill-name]
VERSION: [old-version] → [new-version]
TYPE: [Quality|Capability|Specification|Performance] Enhancement

KEY IMPROVEMENTS:
  ✨ [Major improvement 1]
  ✨ [Major improvement 2]
  ✨ [Major improvement 3]

METRICS:
  📏 Size: [old-size] → [new-size] ([change]%)
  📊 Examples: [old-count] → [new-count]
  🏷️  Tags: [old-count] → [new-count]
  ⚡ Token efficiency: [improvement]%

TESTING:
  ✅ All scenarios passed ([count]/[count])
  ✅ Quality validation passed
  ✅ Specification compliance verified

BACKWARD COMPATIBILITY: [Yes|Migration Required|Breaking Changes]

BACKUP: [backup-path]

READY FOR:
  ✅ Local testing
  ✅ Integration into workflow
  ✅ Team sharing
  ✅ Production deployment

NEXT STEPS:
  1. Test enhanced skill in real workflow
  2. Update team documentation if shared
  3. Monitor skill activation and effectiveness
  4. Gather feedback for future iterations

INSTALLATION:
  Enhanced skill is already in place at: [skill-path]

  To use immediately:
    "Use [skill-name] skill to..."

  For other environments:
    cp -r [skill-path] ~/.claude/skills/

Time: [X] minutes | Quality: ✅ Excellent
```

## Enhancement Patterns

### Pattern 1: Adding New Capability
**Trigger:** Skill needs to handle new use case
**Approach:**
- Add new section with clear trigger conditions
- Extend workflow conditionally (if/else patterns)
- Maintain backward compatibility
- Add examples demonstrating new capability
- Update tests to cover new feature

### Pattern 2: Quality Improvement
**Trigger:** Skill works but outputs inconsistent
**Approach:**
- Add concrete examples with expected I/O
- Clarify ambiguous instructions
- Document edge cases with handling strategies
- Improve error messages and recovery guidance
- Strengthen description for better discovery

### Pattern 3: Performance Optimization
**Trigger:** Skill uses too many tokens or runs slowly
**Approach:**
- Move detailed content to external files
- Reduce verbosity in instructions
- Streamline workflow steps
- Use progressive disclosure pattern
- Reference documentation rather than embedding

### Pattern 4: Integration Enhancement
**Trigger:** Skill needs to work with new tools/skills
**Approach:**
- Add integration points in workflow
- Update resource references
- Document new dependencies
- Add integration examples
- Test with actual integrations

### Pattern 5: Specification Compliance
**Trigger:** Updating to match latest Agent Skills spec
**Approach:**
- Align YAML structure with spec
- Adopt new conventions and patterns
- Maintain existing functionality
- Add compliance notes to changelog
- Version bump appropriately

## Error Handling

### Common Issues

**1. Conflicting Requirements**
```
Error: Enhancement requirements conflict with each other
Example: "Add more examples" + "Reduce token usage"

Resolution:
  1. Clarify priorities with user
  2. Find creative solutions (external files for examples)
  3. Phase enhancements if needed
```

**2. Scope Too Broad**
```
Error: Enhancement scope exceeds single iteration
Example: Complete rewrite + new capabilities + spec compliance

Resolution:
  1. Break into multiple enhancement phases
  2. Create enhancement roadmap
  3. Start with highest priority
  4. Iterate systematically
```

**3. Breaking Changes Unavoidable**
```
Error: Enhancement requires breaking existing functionality
Example: Workflow structure change incompatible with v1.x

Resolution:
  1. Propose creating new skill version/variant
  2. Document migration path clearly
  3. Maintain old version temporarily
  4. Provide side-by-side comparison
```

**4. Resource Constraints**
```
Error: Skill requires resources not available
Example: Integration needs external API access

Resolution:
  1. Document missing prerequisites
  2. Suggest infrastructure changes
  3. Create mock/example implementations
  4. Defer to future enhancement
```

**5. Testing Failures**
```
Error: Enhanced skill fails validation tests
Example: New feature breaks existing workflow

Resolution:
  1. Roll back to last working state (use backup)
  2. Document failure in testing notes
  3. Recommend iterative approach
  4. Identify specific breaking change
```

## Integration with Workflow

**Before this command:**
- Skill exists in repository
- User has identified enhancement needs
- Optional: Issue/feedback documented

**After this command:**
- `/integration-validate` - Validate enhanced skill quality
- `/integration-update-docs` - Update README if needed
- `git commit` - Version the enhancement
- Test in actual workflow

**Related commands:**
- `/create-skill` - Initial skill creation
- `/integration-scan` - If creating new variant
- `/maintenance-scan` - Identify skills needing enhancement

**Related agents:**
- Integration Manager - Can orchestrate enhancement
- Validator agent - Can validate enhancements

## Special Considerations

### For Complex Skills
- Break enhancements into smaller iterations
- Test each change independently before combining
- Consider creating skill variants for major changes
- Use skill orchestration for multi-skill workflows
- Document enhancement roadmap for multi-phase work

### For Team-Shared Skills
- Document changes thoroughly in changelog
- Communicate breaking changes in advance
- Provide migration scripts or guides if needed
- Version carefully using semantic versioning
- Test across different team member use cases
- Gather feedback before finalizing

### For Production Skills
- Test extensively before deployment
- Maintain previous version as backup
- Monitor skill activation patterns post-update
- Gather user feedback systematically
- Plan rollback procedure
- Document production impact

## Success Criteria

Enhancement is complete when:
- ✅ All requested improvements implemented
- ✅ Skill passes quality validation checklist
- ✅ Testing validates expected behavior
- ✅ Documentation updated and clear
- ✅ User approves final result
- ✅ Backup created and verified
- ✅ Changelog comprehensive
- ✅ Skill ready for deployment

## Tips & Best Practices

### Before Enhancement
- [ ] Read the skill thoroughly
- [ ] Understand current use cases
- [ ] Identify improvement areas systematically
- [ ] Gather new requirements/information
- [ ] Create backup before making changes

### During Enhancement
- [ ] Follow progressive disclosure principles
- [ ] Keep instructions focused and actionable
- [ ] Add concrete examples for all new features
- [ ] Test incrementally as you build
- [ ] Document decisions in changelog

### After Enhancement
- [ ] Run complete validation checklist
- [ ] Test all scenarios including edge cases
- [ ] Update related documentation
- [ ] Version appropriately (semver)
- [ ] Monitor skill effectiveness post-deployment

### Version Bumping Guidelines
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, typos, minor clarifications
- **Minor (1.0.0 → 1.1.0)**: New features, backward compatible
- **Major (1.0.0 → 2.0.0)**: Breaking changes, major restructuring

### Token Optimization
- Move detailed examples to `examples/` directory
- Reference external docs instead of embedding
- Use "See [filename]" pattern for detailed content
- Keep main SKILL.md under 2000 tokens
- Store extensive knowledge in `knowledge/` directory

### Quality Markers
Good enhancements demonstrate:
- Clear, action-oriented descriptions
- Concrete examples with real inputs/outputs
- Comprehensive edge case documentation
- Helpful error messages with recovery paths
- Progressive disclosure of complexity
- Backward compatibility or clear migration path

## Dependencies

- **Required**: Existing skill in `skills/` directory
- **Optional**: Test scenarios file
- **Optional**: New reference materials or documentation

## Troubleshooting

### "Skill not found"
```bash
# Verify skill path
ls -la skills/

# Check skill name spelling
ls -la skills/ | grep [partial-name]

# Ensure SKILL.md exists
test -f skills/[skill-name]/SKILL.md && echo "Found"
```

### "Enhancement conflicts with existing functionality"
```
Issue: New capability breaks existing workflow

Solution:
1. Use conditional logic (if new feature enabled)
2. Add feature flag to YAML frontmatter
3. Create skill variant instead
4. Document breaking change clearly
```

### "Tests fail after enhancement"
```
Issue: Validation scenarios fail

Solution:
1. Review specific failing scenario
2. Compare with backup version
3. Identify what changed
4. Either fix enhancement or update test scenario
5. Document in changelog if test was incorrect
```

## Related Commands

- **`/create-skill`** - Initial skill creation from documentation
- **`/integration-validate`** - Validate skill quality after enhancement
- **`/integration-update-docs`** - Update README with enhanced skills
- **`/maintenance-scan`** - Identify stale skills needing enhancement

## Version History

- **1.0** (2025-12-31): Initial release
  - Systematic enhancement workflow
  - Quality-focused improvements
  - Capability addition framework
  - Specification compliance checking
  - Comprehensive testing validation
  - Version management with changelog
  - Backward compatibility tracking

---

**Last Updated**: December 31, 2025
**Dependencies**: Existing skill in `skills/` directory
**Estimated Runtime**: 20-40 minutes depending on enhancement scope
**Integration**: Works with skill creation and validation workflows
