---
description: "Enhance existing Claude skills with AI-powered improvements, quality refinements, and capability additions using Skill Seekers"
allowed-tools: ["Bash(pip)", "Bash(skill-seekers)", "Bash(skill-seekers-enhance)", "Bash(python3)", "Bash(which)", "Bash(ls)", "Bash(mkdir)", "Bash(mv)", "Bash(cp)", "Read", "Edit", "Write"]
author: "Claude Command and Control"
version: "2.0"
---

# Skill Enhancer

## Purpose
Upgrade existing Claude skills with AI-powered enhancements using [Skill Seekers](https://github.com/yusufkaraaslan/Skill_Seekers). Improves skill quality, adds missing capabilities, and ensures specification compliance while maintaining backward compatibility.

## Features
- 🤖 **AI-Powered Enhancement** - Automatic quality improvements using Skill Seekers
- 📊 **Quality Analysis** - Pre and post-enhancement evaluation
- 🔄 **Version Management** - Semantic versioning with detailed changelogs
- ✨ **Capability Addition** - Extend skills with new features
- 🔍 **Specification Compliance** - Align with latest Agent Skills standards
- 💾 **Safe Backup** - Automatic backup before modifications
- 🧪 **Testing Framework** - Validation before and after enhancement
- 📦 **Integration Ready** - Works with `/integration-scan` pipeline

## Usage

### Basic Enhancement
```bash
# Enhance a skill in skills-templates/
/skill-enhancer api-documentation-generator

# Enhance with specific focus
/skill-enhancer database-migration --focus "error-handling,examples"
```

### Enhancement from INTEGRATION/incoming
```bash
# Enhance newly created skill
/skill-enhancer --incoming fastapi

# Enhance and move to integration
/skill-enhancer --incoming react-hooks --finalize
```

### Custom Location Enhancement
```bash
# Enhance skill at custom path
/skill-enhancer --path /path/to/skill/directory
```

## Parameters

| Parameter | Description | Required | Example |
|-----------|-------------|----------|---------|
| `skill-name` | Skill directory name in skills-templates/ | Yes* | `api-documentation` |
| `--incoming` | Skill in INTEGRATION/incoming/ | No | `fastapi` |
| `--path` | Custom skill directory path | No | `/path/to/skill` |
| `--focus` | Specific areas to improve | No | `"examples,error-handling"` |
| `--finalize` | Move from incoming to skills-templates | No | (flag) |
| `--no-backup` | Skip backup creation (not recommended) | No | (flag) |

*One of: `skill-name`, `--incoming`, or `--path` is required.

## Workflow

### 1. Dependency Check

```bash
# Verify skill-seekers is installed
!which skill-seekers || python3 -m pip show skill-seekers
```

**If not installed:**
```bash
!pip install skill-seekers
!skill-seekers --version
```

Display:
```
🔧 Installing Skill Seekers...
✅ Skill Seekers v2.2.0 installed successfully
```

### 2. Locate & Analyze Skill

**Determine skill path:**
```bash
# If skill-name provided
SKILL_PATH="skills-templates/[skill-name]"

# If --incoming provided
SKILL_PATH="INTEGRATION/incoming/[skill-name]"

# If --path provided
SKILL_PATH="[custom-path]"

# Verify skill exists
!test -d $SKILL_PATH && echo "✅ Skill found" || echo "❌ Skill not found"
!test -f $SKILL_PATH/SKILL.md && echo "✅ SKILL.md found" || echo "❌ SKILL.md missing"
```

**Read current skill:**
```bash
# Display current skill info
!head -30 $SKILL_PATH/SKILL.md
```

**Analyze skill structure:**
```bash
# Check resources
!ls -la $SKILL_PATH/

# Count knowledge files
!find $SKILL_PATH/knowledge -type f 2>/dev/null | wc -l

# Count examples
!find $SKILL_PATH/examples -type f 2>/dev/null | wc -l
```

Display analysis:
```
🔍 ANALYZING SKILL: [skill-name]
═══════════════════════════════════════════

📋 CURRENT STATE:
  Location: [skill-path]
  SKILL.md: ✓ ([size])

📂 RESOURCES:
  • knowledge/: [X] files
  • examples/: [X] files
  • references/: [X] files

🎯 ENHANCEMENT TARGETS:
  • Quality improvements
  • Example expansion
  • Error handling
  • Edge case documentation
```

### 3. Create Backup

**Unless --no-backup specified:**
```bash
# Create backup with timestamp
BACKUP_PATH="${SKILL_PATH}.backup-$(date +%Y%m%d-%H%M%S)"
!cp -r $SKILL_PATH $BACKUP_PATH

# Verify backup
!test -d $BACKUP_PATH && echo "✅ Backup created: $BACKUP_PATH"
```

Display:
```
💾 Creating backup...
✅ Backup: [backup-path]
```

### 4. Run Enhancement

**Use Skill Seekers enhance command:**
```bash
# Navigate to skill directory parent
cd $(dirname $SKILL_PATH)

# Run enhancement (Skill Seekers operates on directory)
!skill-seekers-enhance $(basename $SKILL_PATH)

# Or with focus areas
!skill-seekers-enhance $(basename $SKILL_PATH) --focus [focus-areas]
```

Display progress:
```
✨ ENHANCING SKILL...
═══════════════════════════════════════════

🤖 Running AI-powered enhancement
⏳ This may take 3-5 minutes...

Enhancement areas:
  • Description clarity
  • Instruction specificity
  • Example completeness
  • Error handling coverage
  • Edge case documentation
```

**Monitor enhancement:**
```bash
# Skill Seekers provides real-time feedback
# Output will show:
# - Analyzing current content
# - Identifying improvement areas
# - Generating enhancements
# - Updating SKILL.md
# - Enhancing knowledge files
# - Expanding examples
```

### 5. Verify Enhancements

**Check what changed:**
```bash
# Compare sizes
OLD_SIZE=$(du -sh $BACKUP_PATH/SKILL.md | cut -f1)
NEW_SIZE=$(du -sh $SKILL_PATH/SKILL.md | cut -f1)

# Show diff summary
!echo "Size: $OLD_SIZE → $NEW_SIZE"

# Check version updated
!grep "^version:" $SKILL_PATH/SKILL.md
```

**Review enhancements:**
```bash
# Read enhanced SKILL.md header
!head -50 $SKILL_PATH/SKILL.md

# Check for new examples
!ls -la $SKILL_PATH/examples/

# Check for updated knowledge
!ls -la $SKILL_PATH/knowledge/
```

Display results:
```
🧪 VERIFICATION
═══════════════════════════════════════════

CHANGES DETECTED:
  • SKILL.md: [old-size] → [new-size]
  • Examples: [old-count] → [new-count]
  • Knowledge: [old-count] → [new-count]

ENHANCEMENTS APPLIED:
  ✅ Description improved
  ✅ Examples expanded
  ✅ Error handling added
  ✅ Edge cases documented
  ✅ Version incremented
```

### 6. Quality Check

**Run basic validation:**
```bash
# Check YAML frontmatter valid
!python3 -c "import yaml; yaml.safe_load(open('$SKILL_PATH/SKILL.md').read().split('---')[1])"

# Verify required files
!test -f $SKILL_PATH/SKILL.md && echo "✅ SKILL.md"
```

Display:
```
✓ QUALITY VALIDATION
═══════════════════════════════════════════

STRUCTURE:
  ✅ YAML frontmatter valid
  ✅ SKILL.md properly formatted
  ✅ Required sections present

CONTENT:
  ✅ Description clear and actionable
  ✅ Examples demonstrate usage
  ✅ Error handling documented
```

### 7. Finalize (Optional)

**If --finalize flag provided:**
```bash
# Move from INTEGRATION/incoming to skills-templates
!mkdir -p skills-templates
!mv INTEGRATION/incoming/[skill-name] skills-templates/[skill-name]

# Run integration scan
@.claude/commands/integration-scan.md
```

Display:
```
📦 FINALIZING...
✅ Moved: INTEGRATION/incoming/[skill-name] → skills-templates/[skill-name]
🔍 Running integration scan...
```

### 8. Final Summary

```
╔═══════════════════════════════════════════════════╗
║       SKILL ENHANCEMENT COMPLETED                  ║
╚═══════════════════════════════════════════════════╝

SKILL: [skill-name]
LOCATION: [final-path]
BACKUP: [backup-path]

IMPROVEMENTS:
  ✨ AI-powered quality enhancements
  ✨ [X] new examples added
  ✨ Error handling expanded
  ✨ Edge cases documented
  ✨ Version incremented

METRICS:
  📏 Size: [old-size] → [new-size]
  📊 Examples: [old-count] → [new-count]
  📚 Knowledge: [old-count] → [new-count]

QUALITY: ✅ Enhanced and validated

NEXT STEPS:
  1. Review: [skill-path]/SKILL.md
  2. Test: "Use [skill-name] skill to..."
  3. [If not finalized] Run /integration-scan
  4. Commit changes to version control

Time: [X] minutes | Status: ✅ Ready
```

## Enhancement Patterns

### Pattern 1: Quality-Focused Enhancement
**When**: Skill works but output is inconsistent
**Approach**:
- Use Skill Seekers AI enhancement
- Focus on clarity and examples
- No new capabilities, just refinement

```bash
/skill-enhancer my-skill --focus "clarity,examples"
```

### Pattern 2: Capability Addition
**When**: Skill needs new features
**Approach**:
- Manually add new sections first
- Then enhance with Skill Seekers
- Validate new capabilities work

```bash
# 1. Manually add new capability to SKILL.md
# 2. Run enhancement
/skill-enhancer my-skill --focus "new-feature"
```

### Pattern 3: Newly Created Skill Enhancement
**When**: Just created skill with /create-skill
**Approach**:
- Skill already in INTEGRATION/incoming
- Enhance before finalizing
- Move to skills-templates when done

```bash
/skill-enhancer --incoming new-skill --finalize
```

### Pattern 4: Batch Enhancement
**When**: Multiple skills need updating
**Approach**:
- Enhance one at a time
- Create backups for all
- Track versions carefully

```bash
for skill in skill1 skill2 skill3; do
  /skill-enhancer $skill
done
```

## Error Handling

### Skill Not Found
```
❌ ERROR: Skill directory not found
Path checked: [path]

Solutions:
  • Verify skill name spelling
  • Check skills-templates/ directory
  • Use --path for custom locations
  • Use --incoming for INTEGRATION/incoming skills

List available skills:
  ls skills-templates/
  ls INTEGRATION/incoming/
```

### Enhancement Failed
```
❌ ERROR: Enhancement process failed
Reason: [error-message]

Common fixes:
  • Ensure SKILL.md is valid YAML frontmatter
  • Check internet connection (AI enhancement requires API)
  • Verify skill-seekers is latest version
  • Try without --focus flag
  • Review backup and retry

Restore from backup:
  rm -rf [skill-path]
  cp -r [backup-path] [skill-path]
```

### Missing SKILL.md
```
❌ ERROR: SKILL.md not found in skill directory
Path: [skill-path]

This is not a valid skill directory.
Expected structure:
  skill-name/
    ├── SKILL.md (required)
    ├── knowledge/
    ├── examples/
    └── references/
```

### API Key Missing (for AI enhancement)
```
⚠️  WARNING: OpenAI API key not set
Enhancement will use basic improvements only.

To enable full AI enhancement:
  export OPENAI_API_KEY="sk-..."

Or skip AI enhancement:
  Manual enhancement required
```

## Integration with Workflow

**Enhancement Pipeline**:
```
/create-skill → INTEGRATION/incoming/[skill]
    ↓
/skill-enhancer --incoming [skill]  ← You are here
    ↓
/skill-enhancer --incoming [skill] --finalize
    ↓
skills-templates/[skill] ✅
    ↓
/integration-scan (verify)
    ↓
Production-ready skill
```

**Quality Pipeline**:
```
Existing skill in skills-templates/
    ↓
/maintenance-scan (identify stale skills)
    ↓
/skill-enhancer [skill-name]
    ↓
Updated skill with version bump
    ↓
/integration-validate (quality check)
    ↓
Commit to version control
```

## Examples

### Example 1: Enhance Newly Created Skill
```bash
# Create skill
/create-skill --config configs/fastapi.json

# Enhance it (still in incoming)
/skill-enhancer --incoming fastapi

# Review and finalize
/skill-enhancer --incoming fastapi --finalize
```

**Result**: Enhanced FastAPI skill moved to skills-templates/ with:
- Improved description and triggers
- Expanded examples
- Better error handling
- Version 1.0 → 1.1

### Example 2: Update Existing Skill
```bash
# Enhance existing skill
/skill-enhancer database-migration

# Focus on specific areas
/skill-enhancer database-migration --focus "error-handling,examples"
```

**Result**: database-migration skill enhanced with:
- More robust error handling
- Additional examples
- Edge case documentation
- Backup in skills-templates/database-migration.backup-[timestamp]

### Example 3: Custom Path Enhancement
```bash
# Enhance skill at custom location
/skill-enhancer --path ~/my-skills/custom-skill

# With backup disabled (not recommended)
/skill-enhancer --path ~/my-skills/custom-skill --no-backup
```

## Tips & Best Practices

### Before Enhancement
- [ ] Review current skill thoroughly
- [ ] Identify specific improvement areas
- [ ] Check if major version bump needed
- [ ] Ensure skill-seekers is up to date
- [ ] Verify backup directory has space

### During Enhancement
- [ ] Let Skill Seekers AI do the heavy lifting
- [ ] Use --focus for targeted improvements
- [ ] Monitor enhancement progress
- [ ] Check for errors in output

### After Enhancement
- [ ] Review SKILL.md changes carefully
- [ ] Test enhanced skill in real workflow
- [ ] Verify version was incremented
- [ ] Check all referenced files exist
- [ ] Update related documentation if needed

### Version Bumping
Enhancement automatically updates version based on changes:
- **Patch (1.0.0 → 1.0.1)**: Minor improvements, typo fixes
- **Minor (1.0.0 → 1.1.0)**: New examples, enhanced error handling
- **Major (1.0.0 → 2.0.0)**: Breaking changes (rare for enhancements)

### Quality Markers
Good enhancements should:
- Improve clarity without changing core behavior
- Add concrete examples with real inputs/outputs
- Enhance error messages and recovery paths
- Maintain backward compatibility
- Follow specification standards

## Dependencies

- **Required**: Python 3.8+, pip, skill-seekers package
- **Optional**: OpenAI API key (for full AI enhancement)
- **Directory Structure**: Valid skill with SKILL.md

## Troubleshooting

### "Command not found: skill-seekers-enhance"
```bash
# Use standard skill-seekers command
skill-seekers enhance [skill-directory]

# Or install/update skill-seekers
pip install --upgrade skill-seekers
```

### Enhancement produces minimal changes
```
Issue: Skill Seekers made few changes

Possible reasons:
  • Skill already high quality
  • AI determined no improvements needed
  • API key not set (basic mode only)

Solutions:
  • Manually review and add content
  • Set OpenAI API key for full AI enhancement
  • Use --focus to target specific areas
```

### Backup directory exists
```bash
# Remove old backup first
rm -rf skills-templates/[skill-name].backup-*

# Or specify different backup name
mv skills-templates/[skill-name] skills-templates/[skill-name].backup-manual
```

## Related Commands

- **`/create-skill`** - Create new skills from documentation
- **`/integration-scan`** - Categorize and validate skills
- **`/integration-validate`** - Comprehensive quality checks
- **`/maintenance-scan`** - Identify skills needing enhancement

## Special Considerations

### For Production Skills
- Test extensively before deploying
- Maintain previous version as backup
- Monitor skill activation after enhancement
- Gather user feedback
- Document all changes in version control

### For Team-Shared Skills
- Communicate enhancement to team
- Document breaking changes if any
- Provide migration guide if needed
- Version carefully using semantic versioning
- Get team review before finalizing

### For Complex Skills
- Break enhancements into smaller iterations
- Test each change independently
- Consider creating variants for major changes
- Document enhancement roadmap

## Version History

- **2.0** (2025-12-31): Repository-specific adaptation
  - Integrated with Skill Seekers enhance command
  - Aligned with skills-templates/ directory structure
  - Integration with INTEGRATION/incoming pipeline
  - Streamlined workflow matching skill-creator
  - Added --incoming and --finalize flags
  - Simplified output and process flow
  - Config-driven approach

- **1.0** (2025-12-31): Initial template
  - Manual enhancement workflow
  - Comprehensive step-by-step process

---

**Last Updated**: December 31, 2025
**Dependencies**: skill-seekers package, valid skill directory structure
**Integration**: Works with /create-skill and integration pipeline
**Estimated Runtime**: 5-15 minutes depending on skill size
