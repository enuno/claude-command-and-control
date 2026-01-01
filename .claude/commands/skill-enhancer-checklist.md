# Skill Enhancement Checklist

Quick reference for skill enhancement workflow. Use alongside `/skill-enhancer` command.

---

## Pre-Enhancement

### Skill Location
- [ ] Identify skill location (skills-templates/ or INTEGRATION/incoming/)
- [ ] Verify SKILL.md exists
- [ ] Check directory structure (knowledge/, examples/, references/)
- [ ] Note current version number

### Quality Assessment
- [ ] Read current SKILL.md
- [ ] Evaluate description clarity
- [ ] Check example coverage
- [ ] Review error handling
- [ ] Identify missing capabilities

### Preparation
- [ ] Verify skill-seekers installed (`skill-seekers --version`)
- [ ] Ensure backup directory has space
- [ ] Document enhancement goals
- [ ] Note which areas to focus on

---

## Enhancement Process

### Backup Creation
- [ ] Create timestamped backup (auto unless --no-backup)
- [ ] Verify backup exists
- [ ] Document backup location

### Run Enhancement
- [ ] Execute skill-seekers enhance command
- [ ] Monitor progress (3-5 minutes)
- [ ] Watch for errors or warnings
- [ ] Verify completion message

### Verification
- [ ] Compare old vs new SKILL.md size
- [ ] Check version incremented
- [ ] Verify new examples added
- [ ] Review knowledge files updated
- [ ] Validate YAML frontmatter

---

## Quality Validation

### Structure Check
- [ ] YAML frontmatter valid
- [ ] Required sections present
- [ ] Proper markdown formatting
- [ ] All references resolve

### Content Check
- [ ] Description action-oriented
- [ ] Instructions clear and specific
- [ ] Examples include input/output
- [ ] Error handling comprehensive
- [ ] Edge cases documented

### Testing
- [ ] Test skill in real workflow
- [ ] Verify triggers work correctly
- [ ] Check examples execute properly
- [ ] Validate error handling

---

## Finalization

### Integration (if --finalize used)
- [ ] Move from incoming to skills-templates
- [ ] Run /integration-scan
- [ ] Verify categorization correct
- [ ] Check documentation updated

### Documentation
- [ ] Review changelog in SKILL.md
- [ ] Update related documentation
- [ ] Note breaking changes if any
- [ ] Document migration path

### Version Control
- [ ] Review all changes
- [ ] Commit with descriptive message
- [ ] Tag if major version bump
- [ ] Push to repository

---

## Post-Enhancement

### Immediate
- [ ] Test enhanced skill
- [ ] Monitor for issues
- [ ] Gather initial feedback
- [ ] Document lessons learned

### Follow-Up (1-7 days)
- [ ] Check skill activation patterns
- [ ] Address any reported issues
- [ ] Plan future enhancements
- [ ] Share with team if applicable

---

## Quick Decision Matrix

### When to Enhance?
- ✅ Skill works but output inconsistent
- ✅ Missing examples or error handling
- ✅ Just created with /create-skill
- ✅ Identified by /maintenance-scan
- ❌ Skill fundamentally broken (fix first)
- ❌ Major restructure needed (manual work)

### Version Bump Guide
| Change Type | Version | Example |
|-------------|---------|---------|
| Typos, minor fixes | Patch (1.0.1) | Fixed example typo |
| New examples, improvements | Minor (1.1.0) | Added 5 examples |
| Breaking changes | Major (2.0.0) | Changed workflow |

### Focus Areas
| Focus | When to Use | Example |
|-------|-------------|---------|
| `clarity` | Instructions confusing | Complex steps |
| `examples` | Need more demonstrations | Only 1-2 examples |
| `error-handling` | Missing error guidance | No error docs |
| `edge-cases` | Missing edge scenarios | Only happy path |
| `all` | Comprehensive enhancement | Default |

---

## Common Issues

### Minimal Enhancements
**Symptom**: Few changes made
**Cause**: Skill already high quality or API key missing
**Fix**: Manual review or set OpenAI API key

### Enhancement Failed
**Symptom**: Error during enhancement
**Cause**: Invalid YAML, network issues, API issues
**Fix**: Verify SKILL.md structure, check connection, restore from backup

### Version Not Updated
**Symptom**: Version unchanged after enhancement
**Cause**: Enhancement made minimal changes
**Fix**: Manually increment if improvements were made

---

## Integration Pipeline

```
New Skill Creation:
/create-skill → INTEGRATION/incoming/[skill]
    ↓
/skill-enhancer --incoming [skill]
    ↓
/skill-enhancer --incoming [skill] --finalize
    ↓
skills-templates/[skill] ✅

Existing Skill Update:
/maintenance-scan (identify)
    ↓
/skill-enhancer [skill-name]
    ↓
Test & verify
    ↓
Commit to version control ✅
```

---

**Last Updated**: December 31, 2025
**Use With**: /skill-enhancer command
**Purpose**: Ensure systematic, quality enhancements
