# Skill Enhancement Checklist

Quick reference for systematic skill enhancement. Use this to ensure all enhancement aspects are covered.

---

## Pre-Enhancement Analysis

### Skill Assessment
- [ ] Load and read current SKILL.md
- [ ] Review YAML frontmatter (name, description, version, tags)
- [ ] Check current file size and token count
- [ ] List all resources (examples/, knowledge/, references/, tests/)
- [ ] Identify referenced scripts or templates

### Quality Evaluation
- [ ] Description clarity (action-oriented, triggers clear?)
- [ ] Instruction specificity (steps actionable?)
- [ ] Example coverage (concrete input→output demonstrations?)
- [ ] Edge case handling (documented scenarios?)
- [ ] Error handling (clear guidance for failures?)
- [ ] Specification compliance (matches Agent Skills standard?)

### Improvement Identification
- [ ] Clarity issues in current instructions
- [ ] Missing error handling or edge cases
- [ ] Outdated patterns or deprecated syntax
- [ ] Scope creep or unfocused objectives
- [ ] Token efficiency opportunities
- [ ] Integration gaps with other skills/tools

---

## Enhancement Planning

### Requirements Gathering
- [ ] What new information needs integration?
- [ ] Are there specific pain points or failures?
- [ ] What's the priority (quality/capabilities/performance)?
- [ ] Should this modify existing or create variant?

### Change Design
- [ ] How does new info fit existing workflow?
- [ ] Should it extend or refactor current steps?
- [ ] Will it require new resources or dependencies?
- [ ] Are there backward compatibility concerns?
- [ ] What testing scenarios are needed?

### Plan Documentation
- [ ] Document enhancement objectives
- [ ] List specific changes planned
- [ ] Identify structural modifications
- [ ] Note specification alignment items
- [ ] Assess backward compatibility impact
- [ ] Estimate enhancement time

### User Approval
- [ ] Present plan to user
- [ ] Get confirmation to proceed
- [ ] Clarify any ambiguities
- [ ] Document approved approach

---

## Implementation

### Backup & Safety
- [ ] Create backup: `SKILL.md.backup-[timestamp]`
- [ ] Create directory backup if major changes
- [ ] Verify backups created successfully
- [ ] Document backup locations

### YAML Frontmatter Updates
- [ ] Update `description` (action-oriented, clear triggers)
- [ ] Add/update `tags` (relevant, searchable keywords)
- [ ] Increment `version` (follow semver: patch/minor/major)
- [ ] Set `updated` date (current date)
- [ ] Add `changelog` summary (what changed)
- [ ] Update `when-to-use` (if trigger conditions changed)

### Core Instruction Refinements
- [ ] Use clear section headers (##, ###)
- [ ] Number workflow steps explicitly
- [ ] Keep main SKILL.md focused (<2000 tokens)
- [ ] Use examples showing input→process→output
- [ ] Reference external files for details ("See [filename]")

### New Capability Integration
- [ ] Create "New Feature" section with clear header
- [ ] Document "When to Use" triggers
- [ ] List implementation steps with examples
- [ ] Provide concrete input/output examples
- [ ] Document edge cases for new feature
- [ ] Add error handling for new capability

### Quality Improvements
- [ ] Strengthen skill description (action verbs, clear differentiation)
- [ ] Add missing examples (cover typical + edge cases)
- [ ] Improve instruction clarity (remove ambiguity)
- [ ] Enhance error handling (symptoms, causes, solutions)
- [ ] Document edge cases (scenario, condition, approach)

### Error Handling Additions
- [ ] Identify common error categories
- [ ] Document error symptoms
- [ ] Explain root causes
- [ ] Provide resolution steps
- [ ] Add concrete error/fix examples

### Resource Updates
- [ ] Modify scripts if workflow changed
- [ ] Update templates to match new patterns
- [ ] Refresh documentation references
- [ ] Add new resource files as needed
- [ ] Create new directories if required

### Token Optimization
- [ ] Move detailed content to external files
- [ ] Reference external docs instead of embedding
- [ ] Keep SKILL.md under 2000 tokens
- [ ] Use "See [filename] for details" pattern
- [ ] Verify all external references valid

---

## Quality Assurance

### Description Quality
- [ ] Uses action-oriented language ("Use when..." not "This is...")
- [ ] Clear differentiation from similar skills
- [ ] Triggers on intended use cases
- [ ] Concise but comprehensive

### Instruction Quality
- [ ] Steps are specific and actionable
- [ ] No ambiguity in workflow
- [ ] Examples demonstrate key concepts
- [ ] Edge cases documented with handling
- [ ] Prerequisites clearly listed

### Technical Correctness
- [ ] YAML frontmatter valid (no syntax errors)
- [ ] All referenced files exist
- [ ] Scripts/code tested if modified
- [ ] Links and paths verified
- [ ] File permissions appropriate

### Best Practices Compliance
- [ ] Focused on specific, repeatable tasks
- [ ] Written for Claude, not end users
- [ ] Includes prerequisites and dependencies
- [ ] Error handling guidance present
- [ ] Progressive disclosure of complexity

### Backward Compatibility
- [ ] Existing workflows still supported OR
- [ ] Migration path documented clearly
- [ ] Breaking changes explicitly noted
- [ ] Version bumped appropriately

---

## Testing & Validation

### Test Scenario Creation
- [ ] Scenario 1: Typical use case
- [ ] Scenario 2: New feature (if added)
- [ ] Scenario 3: Edge case handling
- [ ] Scenario 4: Error handling
- [ ] Scenario 5: Integration (if applicable)

### Test Execution
- [ ] Run typical use case → Record result (Pass/Fail)
- [ ] Test new feature → Record result (Pass/Fail)
- [ ] Validate edge case handling → Record result (Pass/Fail)
- [ ] Trigger error conditions → Verify messaging (Pass/Fail)
- [ ] Test integrations → Check compatibility (Pass/Fail)

### Result Analysis
- [ ] Count passed scenarios
- [ ] Count failed scenarios
- [ ] Document failure details
- [ ] Identify required fixes
- [ ] Iterate if failures critical

### Validation Decision
- [ ] All critical tests pass?
- [ ] Acceptable failure rate?
- [ ] Quality meets standards?
- [ ] Ready to proceed? (Yes/Iterate/Major revision)

---

## Documentation & Delivery

### Changelog Creation
- [ ] List all additions (new capabilities, resources, examples)
- [ ] List all changes (modified behavior, improvements)
- [ ] List all fixes (bugs, typos, corrections)
- [ ] Note performance improvements (token optimization, speed)
- [ ] Document breaking changes clearly
- [ ] Provide migration notes (if needed)
- [ ] State backward compatibility status

### Related Documentation Updates
- [ ] Update README if skill listed there
- [ ] Update integration guides if referenced
- [ ] Create migration guide if breaking changes
- [ ] Update skill index if exists
- [ ] Document new prerequisites

### Packaging Verification
- [ ] Verify all files in skill directory
- [ ] Check SKILL.md formatting valid
- [ ] Measure file sizes (optimized?)
- [ ] Count resources (examples, knowledge, etc.)
- [ ] Verify backup locations documented

### Deployment Readiness
- [ ] Files ready in skill directory
- [ ] Installation instructions clear
- [ ] Testing complete and documented
- [ ] User approval obtained
- [ ] Ready for production use

---

## Final Summary

### Enhancement Metrics
- [ ] Version change documented ([old] → [new])
- [ ] Size change measured ([old-size] → [new-size])
- [ ] Example count change noted
- [ ] Tag updates listed
- [ ] Token efficiency improvement calculated

### Testing Results
- [ ] Scenarios run: [count]
- [ ] Scenarios passed: [count]
- [ ] Pass rate: [percentage]%
- [ ] Critical issues resolved?

### Quality Assessment
- [ ] Description quality score
- [ ] Instruction quality score
- [ ] Example coverage score
- [ ] Error handling score
- [ ] Overall quality score

### Compatibility Status
- [ ] Backward compatible? (Yes/No/Migration Required)
- [ ] Breaking changes documented?
- [ ] Migration path provided?
- [ ] Version bumped appropriately?

### Deliverables
- [ ] Enhanced SKILL.md in place
- [ ] Backup created and verified
- [ ] Changelog comprehensive
- [ ] Documentation updated
- [ ] Testing summary complete
- [ ] User approval obtained

---

## Next Steps Checklist

### Immediate (Post-Enhancement)
- [ ] Test enhanced skill in real workflow
- [ ] Monitor skill activation patterns
- [ ] Watch for unexpected behaviors
- [ ] Gather initial feedback

### Short-term (1-7 days)
- [ ] Update team documentation if shared
- [ ] Communicate changes to team
- [ ] Monitor effectiveness metrics
- [ ] Address any quick-fix issues

### Long-term (1-4 weeks)
- [ ] Gather systematic feedback
- [ ] Identify next enhancement opportunities
- [ ] Plan future iterations
- [ ] Document lessons learned

---

## Quick Reference: Version Bumping

**When to use each version increment:**

| Change Type | Old → New | Example |
|-------------|-----------|---------|
| Bug fixes, typos, minor clarifications | `1.0.0` → `1.0.1` | Fixed typo in example |
| New features, backward compatible | `1.0.0` → `1.1.0` | Added OpenAPI 3.1 support |
| Breaking changes, major restructure | `1.0.0` → `2.0.0` | Changed workflow structure |

---

## Quality Score Reference

**Score each area 1-10:**

### Description Quality (1-10)
- 1-3: Unclear, doesn't trigger correctly
- 4-6: Basic but needs improvement
- 7-8: Good, clear triggers
- 9-10: Excellent, action-oriented, perfect triggers

### Instruction Quality (1-10)
- 1-3: Ambiguous, hard to follow
- 4-6: Functional but could be clearer
- 7-8: Clear, actionable steps
- 9-10: Crystal clear, specific, examples for all steps

### Example Coverage (1-10)
- 1-3: Few or no examples
- 4-6: Basic examples only
- 7-8: Good coverage of typical cases
- 9-10: Comprehensive, includes edge cases

### Error Handling (1-10)
- 1-3: Little to no error guidance
- 4-6: Basic error handling
- 7-8: Good error coverage
- 9-10: Comprehensive with recovery paths

**Overall Quality:**
- Average < 5: Major revision needed
- Average 5-6: Iterate on key areas
- Average 7-8: Good, minor improvements
- Average 9-10: Excellent, production-ready

---

## Enhancement Pattern Quick Reference

### Pattern 1: Adding Capability
- [ ] Add new section with clear header
- [ ] Document when to use
- [ ] Provide implementation steps
- [ ] Add concrete examples
- [ ] Test new functionality

### Pattern 2: Quality Improvement
- [ ] Strengthen description
- [ ] Add examples
- [ ] Clarify instructions
- [ ] Document edge cases
- [ ] Improve error handling

### Pattern 3: Performance Optimization
- [ ] Move content to external files
- [ ] Reduce verbosity
- [ ] Streamline workflow
- [ ] Use progressive disclosure
- [ ] Measure token reduction

### Pattern 4: Integration Enhancement
- [ ] Add integration points
- [ ] Update resource references
- [ ] Document dependencies
- [ ] Add integration examples
- [ ] Test with actual integrations

### Pattern 5: Specification Compliance
- [ ] Align YAML structure
- [ ] Adopt new conventions
- [ ] Maintain functionality
- [ ] Add compliance notes
- [ ] Version bump appropriately

---

**Last Updated**: December 31, 2025
**Use**: Print this checklist and check off items as you enhance skills
**Purpose**: Ensure systematic, high-quality skill enhancements
