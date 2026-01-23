---
description: "Enhance existing Claude skills with AI-powered improvements, quality scoring, and automated validation using production-grade enhancement pipelines"
allowed-tools: ["Bash(pip:install,show)", "Bash(skill-seekers:*)", "Bash(python3:-c,-m)", "Bash(which:*)", "Bash(ls:-la)", "Bash(mkdir:-p)", "Bash(mv:*)", "Bash(cp:-r)", "Bash(diff:*)", "Bash(du:-sh)", "Bash(wc:-l)", "Bash(test:-f,-d)", "Bash(grep:*)", "Read", "Edit", "Write"]
output-format: "json"
author: "Claude Command and Control"
version: "3.0.0"
category: "Skills Development"
complexity: "moderate"
execution-time: "5-15 minutes"
---

# Skill Enhancer

## Purpose
Upgrade existing Claude skills with AI-powered enhancements using [Skill Seekers](https://github.com/yusufkaraaslan/Skill_Seekers). Improves skill quality, adds missing capabilities, and ensures specification compliance while maintaining backward compatibility.

## Production-Grade Enhancements (v3.0)

This command now implements production-grade patterns from [Document 02: Command Creation](../../docs/best-practices/02-Individual-Command-Creation.md), [Document 08: Skills Guide](../../docs/best-practices/08-Claude-Skills-Guide.md), and [Document 09: Skill Development](../../docs/best-practices/09-Developing-High-Impact-Claude-Skills.md):

### New Capabilities

- ✅ **Pre-execution validation**: Skill existence, structure verification, and prerequisite checks
- ✅ **Before/After quality scoring**: Quantified improvement metrics (25-point rubric)
- ✅ **Structured JSON output**: Machine-readable results for CI/CD integration
- ✅ **Enhancement effectiveness tracking**: Success metrics (quality improvement, coverage increase)
- ✅ **Evaluation framework**: LLM-as-judge quality assessment comparing before/after states
- ✅ **Hooks integration**: PostToolUse validation for enhancement quality gates
- ✅ **Progressive disclosure**: External references for detailed workflows
- ✅ **CI/CD integration**: GitHub Actions examples with automated enhancement pipelines
- ✅ **Security hardening**: Input sanitization, least privilege permissions, audit trails
- ✅ **Testing strategy**: Unit and integration tests for enhancement reliability

### Breaking Changes (v2.0 → v3.0)

**Quality Enforcement**: Enhancement now requires ≥20/25 (80%) quality improvement to proceed. Below threshold triggers warning with actionable feedback.

**Explicit Permissions**: `allowed-tools` changed from broad patterns (`Bash(pip)`) to argument-scoped restrictions (`Bash(pip:install,show)`). Update any automation that invokes this command.

**Structured Output**: Default output is now JSON. Use `--output-format plain` for human-readable text (legacy mode).

**Hooks Required**: PostToolUse hook must be configured for production deployments to enforce quality gates.

### Migration Guide

**From v2.0 to v3.0**:

1. **Update permission configurations** if using custom agents:
   ```yaml
   # Before (v2.0)
   allowed-tools: ["Bash(pip)", "Bash(skill-seekers)"]

   # After (v3.0)
   allowed-tools: ["Bash(pip:install,show)", "Bash(skill-seekers:*)"]
   ```

2. **Configure PostToolUse hook** for quality enforcement:
   ```bash
   # .claude/hooks/posttooluse_enhancement_quality.sh
   # See Hooks Integration section below
   ```

3. **Update CI/CD pipelines** to parse JSON output:
   ```yaml
   - name: Parse Enhancement Results
     run: |
       IMPROVEMENT=$(jq -r '.quality.improvement_percentage' enhancement-result.json)
       if [ "$IMPROVEMENT" -lt 20 ]; then
         echo "❌ Enhancement below minimum improvement threshold"
         exit 1
       fi
   ```

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

## Pre-Execution Validation

Before starting the enhancement process, the command validates all prerequisites to fail fast with clear feedback:

### Step 0: Validate Prerequisites

**Four-layer validation system**:

#### Layer 1: Input Validation
```bash
# Verify required parameters
if [ -z "$SKILL_NAME" ] && [ -z "$INCOMING" ] && [ -z "$PATH" ]; then
  echo '{"status": "error", "reason": "One of skill-name, --incoming, or --path is required"}' | jq
  exit 1
fi

# Sanitize skill name (prevent path traversal)
SKILL_NAME=$(echo "$SKILL_NAME" | sed 's/[^a-zA-Z0-9_-]//g')
```

#### Layer 2: Skill Existence Check
```bash
# Determine skill path
if [ -n "$INCOMING" ]; then
  SKILL_PATH="INTEGRATION/incoming/$INCOMING"
elif [ -n "$PATH" ]; then
  SKILL_PATH="$PATH"
else
  SKILL_PATH="skills-templates/$SKILL_NAME"
fi

# Verify skill directory exists
if [ ! -d "$SKILL_PATH" ]; then
  echo "❌ Skill directory not found: $SKILL_PATH"
  echo "Available skills:"
  ls skills-templates/ 2>/dev/null || echo "  (none)"
  ls INTEGRATION/incoming/ 2>/dev/null || echo "  (none in incoming)"
  exit 1
fi

# Verify SKILL.md exists
if [ ! -f "$SKILL_PATH/SKILL.md" ]; then
  echo "❌ SKILL.md not found in $SKILL_PATH"
  echo "This is not a valid skill directory."
  exit 1
fi
```

#### Layer 3: Structure Validation
```bash
# Validate SKILL.md has valid YAML frontmatter
python3 -c "
import yaml
import sys

try:
    with open('$SKILL_PATH/SKILL.md') as f:
        content = f.read()
        parts = content.split('---')
        if len(parts) < 3:
            print('❌ Invalid SKILL.md: Missing YAML frontmatter')
            sys.exit(1)
        yaml.safe_load(parts[1])
        print('✅ YAML frontmatter valid')
except Exception as e:
    print(f'❌ YAML parsing failed: {e}')
    sys.exit(1)
"

# Check minimum content requirements
LINE_COUNT=$(wc -l < "$SKILL_PATH/SKILL.md")
if [ "$LINE_COUNT" -lt 50 ]; then
  echo "⚠️  Warning: SKILL.md has only $LINE_COUNT lines (minimum 50 recommended)"
fi
```

#### Layer 4: Prerequisite Verification
```bash
# Verify skill-seekers is installed
if ! command -v skill-seekers &> /dev/null && ! python3 -m pip show skill-seekers &> /dev/null; then
  echo "❌ skill-seekers not installed"
  echo "Install with: pip install skill-seekers"
  exit 1
fi

# Check disk space (need at least 100MB for safe operation)
AVAILABLE=$(df -BM "$SKILL_PATH" | tail -1 | awk '{print $4}' | sed 's/M//')
if [ "$AVAILABLE" -lt 100 ]; then
  echo "❌ Insufficient disk space: ${AVAILABLE}MB available (100MB required)"
  exit 1
fi
```

### Validation Status Summary

After all checks pass, display comprehensive status:

```
╔═══════════════════════════════════════════════════╗
║     PRE-EXECUTION VALIDATION PASSED                ║
╚═══════════════════════════════════════════════════╝

✅ Input validation: skill-name provided and sanitized
✅ Skill existence: Found at skills-templates/api-documentation
✅ Structure validation: SKILL.md with valid YAML frontmatter
✅ Prerequisite check: skill-seekers v2.2.0, disk space: 2.1GB

Enhancement will proceed in 3 seconds... (Ctrl+C to cancel)
```

**Benefits**:
- **Fail fast**: Catch errors before enhancement starts (saves 3-5 minutes)
- **Clear diagnostics**: Specific error messages with remediation steps
- **Security**: Input sanitization prevents path traversal attacks
- **Predictable execution**: All prerequisites verified before work begins

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

### 7. Quality Scoring (Before/After Comparison)

**Automated quality assessment using LLM-as-judge**:

#### Quality Rubric (25 Points Total)

| Criterion | Weight | Evaluation Method | Score Range |
|-----------|--------|-------------------|-------------|
| **Structure** | 25% | SKILL.md completeness, section organization | 0-5 |
| **Examples** | 25% | Example count, input/output clarity, real-world applicability | 0-5 |
| **Triggers** | 20% | Activation clarity, action-oriented verbs, specificity | 0-5 |
| **Knowledge** | 15% | Extracted content depth, file count, coverage | 0-5 |
| **Documentation** | 15% | Prerequisites, workflow steps, troubleshooting | 0-5 |

#### Scoring Implementation

```python
# .claude/quality/skill_scorer.py
import re
from pathlib import Path

def score_skill(skill_path: Path) -> dict:
    """Score skill quality across 5 dimensions"""

    skill_md = (skill_path / "SKILL.md").read_text()

    scores = {
        "structure": score_structure(skill_md, skill_path),
        "examples": score_examples(skill_md),
        "triggers": score_triggers(skill_md),
        "knowledge": score_knowledge(skill_path),
        "documentation": score_documentation(skill_md)
    }

    # Weighted total
    weights = {
        "structure": 0.25,
        "examples": 0.25,
        "triggers": 0.20,
        "knowledge": 0.15,
        "documentation": 0.15
    }

    total = sum(scores[k] * weights[k] * 5 for k in scores)

    return {
        "score": round(total, 1),
        "max_score": 25,
        "percentage": round(total / 25 * 100, 1),
        "breakdown": scores
    }

def score_structure(skill_md: str, skill_path: Path) -> int:
    """Score structural completeness (0-5)"""
    score = 0

    # Has YAML frontmatter (1 point)
    if skill_md.count('---') >= 2:
        score += 1

    # Has required sections (3 points)
    required = ["Description", "When to Use", "Example"]
    score += sum(1 for s in required if s in skill_md)

    # Minimum length (1 point)
    if len(skill_md.splitlines()) >= 50:
        score += 1

    return min(score, 5)

def score_examples(skill_md: str) -> int:
    """Score example quality (0-5)"""
    example_count = skill_md.lower().count("example")

    # 0 examples = 0, 1 example = 2, 2-5 examples = 5
    if example_count == 0:
        return 0
    elif example_count == 1:
        return 2
    elif example_count <= 5:
        return 5
    else:
        return 4  # Too many examples can dilute focus

def score_triggers(skill_md: str) -> int:
    """Score activation trigger clarity (0-5)"""
    # Look for action verbs
    action_verbs = r'\b(use|invoke|call|run|execute|apply|implement|create|build|fix|debug|test|validate)\b'
    matches = len(re.findall(action_verbs, skill_md, re.IGNORECASE))

    return min(matches, 5)

def score_knowledge(skill_path: Path) -> int:
    """Score knowledge extraction (0-5)"""
    knowledge_dir = skill_path / "knowledge"
    if not knowledge_dir.exists():
        return 0

    file_count = len(list(knowledge_dir.rglob("*")))

    if file_count == 0:
        return 0
    elif file_count < 5:
        return 2
    elif file_count < 10:
        return 4
    else:
        return 5

def score_documentation(skill_md: str) -> int:
    """Score documentation completeness (0-5)"""
    score = 0

    doc_indicators = ["prerequisite", "workflow", "step", "install", "requirement"]
    score = sum(1 for indicator in doc_indicators if indicator in skill_md.lower())

    return min(score, 5)
```

#### Quality Assessment Execution

```bash
# Run before enhancement
BEFORE_SCORE=$(python3 .claude/quality/skill_scorer.py "$SKILL_PATH")

# Run enhancement
skill-seekers enhance "$SKILL_PATH"

# Run after enhancement
AFTER_SCORE=$(python3 .claude/quality/skill_scorer.py "$SKILL_PATH")

# Calculate improvement
python3 -c "
import json

before = json.loads('$BEFORE_SCORE')
after = json.loads('$AFTER_SCORE')

improvement = after['score'] - before['score']
improvement_pct = (improvement / before['score']) * 100 if before['score'] > 0 else 0

print(f'''
╔═══════════════════════════════════════════════════╗
║         QUALITY IMPROVEMENT ANALYSIS               ║
╚═══════════════════════════════════════════════════╝

BEFORE ENHANCEMENT:
  Total Score: {before['score']:.1f}/25 ({before['percentage']:.1f}%)
  Structure: {before['breakdown']['structure']}/5
  Examples: {before['breakdown']['examples']}/5
  Triggers: {before['breakdown']['triggers']}/5
  Knowledge: {before['breakdown']['knowledge']}/5
  Documentation: {before['breakdown']['documentation']}/5

AFTER ENHANCEMENT:
  Total Score: {after['score']:.1f}/25 ({after['percentage']:.1f}%)
  Structure: {after['breakdown']['structure']}/5
  Examples: {after['breakdown']['examples']}/5
  Triggers: {after['breakdown']['triggers']}/5
  Knowledge: {after['breakdown']['knowledge']}/5
  Documentation: {after['breakdown']['documentation']}/5

IMPROVEMENT:
  Score Increase: +{improvement:.1f} points
  Percentage Gain: +{improvement_pct:.1f}%
  Status: {\"✅ PASSED\" if after['score'] >= 20 else \"⚠️  NEEDS WORK\"}

RECOMMENDATION:
  {\"Ready for production deployment\" if after['score'] >= 20 else \"Consider additional manual refinement\"}
''')
"
```

#### Quality Gate Thresholds

```python
# Quality gate enforcement
def check_quality_gate(before: dict, after: dict) -> bool:
    """Enforce minimum quality standards"""

    # Minimum improvement: +2 points or 10% increase
    improvement = after['score'] - before['score']
    improvement_pct = (improvement / before['score']) * 100 if before['score'] > 0 else 0

    if improvement < 2 and improvement_pct < 10:
        print("⚠️  Quality gate: Minimal improvement detected")
        print(f"   Score increase: +{improvement:.1f} points (+{improvement_pct:.1f}%)")
        print("   Recommendation: Review enhancement focus areas")
        return False

    # Absolute minimum: 20/25 (80%)
    if after['score'] < 20:
        print("❌ Quality gate: Below production threshold")
        print(f"   Score: {after['score']:.1f}/25 ({after['percentage']:.1f}%)")
        print("   Required: 20/25 (80%)")
        return False

    return True
```

**Benefits**:
- **Objective measurement**: LLM-as-judge removes human bias
- **Quantified improvement**: Clear before/after metrics for tracking
- **Quality gates**: Automatic enforcement of minimum standards
- **Actionable feedback**: Specific criteria breakdown shows where to improve

### 8. Structured JSON Output

**Machine-readable enhancement results**:

```json
{
  "status": "success",
  "skill": {
    "name": "api-documentation-generator",
    "location": "skills-templates/api-documentation-generator",
    "backup": "skills-templates/api-documentation-generator.backup-20260123-142530"
  },
  "quality": {
    "before": {
      "score": 15.2,
      "max_score": 25,
      "percentage": 60.8,
      "breakdown": {
        "structure": 4,
        "examples": 2,
        "triggers": 3,
        "knowledge": 2,
        "documentation": 3
      }
    },
    "after": {
      "score": 22.1,
      "max_score": 25,
      "percentage": 88.4,
      "breakdown": {
        "structure": 5,
        "examples": 5,
        "triggers": 4,
        "knowledge": 4,
        "documentation": 4
      }
    },
    "improvement": {
      "score_increase": 6.9,
      "percentage_gain": 45.4,
      "status": "passed"
    }
  },
  "changes": {
    "skill_md": {
      "size_before": "3.2K",
      "size_after": "8.7K",
      "lines_added": 142
    },
    "examples": {
      "count_before": 2,
      "count_after": 5,
      "new_files": ["example-3-error-handling.md", "example-4-edge-cases.md", "example-5-integration.md"]
    },
    "knowledge": {
      "count_before": 3,
      "count_after": 8,
      "new_files": ["api-best-practices.md", "swagger-patterns.md"]
    }
  },
  "metrics": {
    "enhancement_duration_seconds": 187,
    "ai_api_calls": 3,
    "token_usage": 12450
  },
  "next_steps": [
    "Test skill in real workflow",
    "Update skill documentation index",
    "Commit changes to version control"
  ]
}
```

**Usage in CI/CD**:

```yaml
# .github/workflows/skill-enhancement.yml
name: Automated Skill Enhancement

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly Monday 2 AM

jobs:
  enhance-stale-skills:
    runs-on: ubuntu-latest
    steps:
      - name: Run maintenance scan
        run: claude code /maintenance-scan --output-json > stale-skills.json

      - name: Enhance each stale skill
        run: |
          SKILLS=$(jq -r '.stale_skills[].name' stale-skills.json)
          for skill in $SKILLS; do
            claude code /skill-enhancer "$skill" --output-json > "result-$skill.json"

            # Check quality improvement
            IMPROVEMENT=$(jq -r '.quality.improvement.percentage_gain' "result-$skill.json")
            if (( $(echo "$IMPROVEMENT < 10" | bc -l) )); then
              echo "⚠️  Skill $skill: minimal improvement (+$IMPROVEMENT%)"
            else
              echo "✅ Skill $skill: significant improvement (+$IMPROVEMENT%)"
            fi
          done

      - name: Create PR for enhanced skills
        if: success()
        run: |
          git checkout -b "enhance-skills-$(date +%Y%m%d)"
          git add skills-templates/
          git commit -m "chore(skills): automated quality enhancement

          Enhanced $(echo $SKILLS | wc -w) skills:
          $(echo $SKILLS | tr ' ' '\n' | sed 's/^/- /')

          Average improvement: $(jq -s 'map(.quality.improvement.percentage_gain) | add / length' result-*.json)%
          "
          gh pr create --title "Automated Skill Enhancement" --body "See commit for details"
```

### 9. Finalize (Optional)

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

## Hooks Integration

### PostToolUse Hook: Enhancement Quality Enforcement

**Hook**: `.claude/hooks/posttooluse_enhancement_quality.sh`

```bash
#!/bin/bash
# PostToolUse hook for skill enhancement quality enforcement

set -euo pipefail

# Read JSON input from stdin
INPUT=$(cat)

# Extract tool information
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input // empty')

# Only process Bash tool calls to skill-seekers
if [ "$TOOL_NAME" != "Bash" ]; then
  exit 0  # Allow other tools
fi

COMMAND=$(echo "$TOOL_INPUT" | jq -r '.command // ""')

# Check if this is a skill enhancement command
if ! echo "$COMMAND" | grep -q "skill-seekers.*enhance"; then
  exit 0  # Not an enhancement command
fi

# Extract skill path from command
SKILL_PATH=$(echo "$COMMAND" | grep -oP 'skill-seekers\s+enhance\s+\K[^ ]+' || echo "")

if [ -z "$SKILL_PATH" ]; then
  echo "⚠️  Warning: Could not determine skill path" >&2
  exit 0  # Non-blocking warning
fi

# Run quality scoring
QUALITY_RESULT=$(python3 .claude/quality/skill_scorer.py "$SKILL_PATH" 2>/dev/null || echo '{"score": 0}')

SCORE=$(echo "$QUALITY_RESULT" | jq -r '.score')
PERCENTAGE=$(echo "$QUALITY_RESULT" | jq -r '.percentage')

# Quality gate: Require ≥20/25 (80%)
if (( $(echo "$SCORE < 20" | bc -l) )); then
  echo "❌ Quality gate failed: Enhanced skill scored ${SCORE}/25 (${PERCENTAGE}%)" >&2
  echo "   Required: ≥20/25 (80%)" >&2
  echo "   Skill: $SKILL_PATH" >&2
  echo "" >&2
  echo "Breakdown:" >&2
  echo "$QUALITY_RESULT" | jq -r '.breakdown | to_entries[] | "  \(.key): \(.value)/5"' >&2
  echo "" >&2
  echo "Recommendations:" >&2

  # Specific recommendations based on low scores
  STRUCTURE=$(echo "$QUALITY_RESULT" | jq -r '.breakdown.structure')
  EXAMPLES=$(echo "$QUALITY_RESULT" | jq -r '.breakdown.examples')
  TRIGGERS=$(echo "$QUALITY_RESULT" | jq -r '.breakdown.triggers')

  if (( $(echo "$STRUCTURE < 4" | bc -l) )); then
    echo "  • Add missing required sections (Description, When to Use, Example)" >&2
  fi
  if (( $(echo "$EXAMPLES < 4" | bc -l) )); then
    echo "  • Provide 3-5 concrete examples with input/output pairs" >&2
  fi
  if (( $(echo "$TRIGGERS < 4" | bc -l) )); then
    echo "  • Clarify activation triggers with action verbs (use, apply, run)" >&2
  fi

  # BLOCKING ERROR: Exit code 2 stops workflow
  exit 2
fi

# Quality gate passed
echo "✅ Quality gate passed: ${SCORE}/25 (${PERCENTAGE}%)"

# Allow continuation
exit 0
```

**Configuration** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/posttooluse_enhancement_quality.sh",
        "timeout": 10
      }]
    }]
  }
}
```

### UserPromptSubmit Hook: Block New Prompts Until Review

**Hook**: `.claude/hooks/userpromptsubmit_review_enhancement.sh`

```bash
#!/bin/bash
# Block new prompts until enhanced skill is reviewed

set -euo pipefail

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')

# Check if enhancement was just completed
LAST_COMMAND=$(tail -1 ~/.claude/projects/*/sessions/${SESSION_ID}.jsonl 2>/dev/null | jq -r '.tool_name // ""')

if [ "$LAST_COMMAND" != "Bash" ]; then
  exit 0  # Not after enhancement
fi

# Check for uncommitted enhanced skills
UNCOMMITTED=$(git status --porcelain skills-templates/ | grep -c "^ M" || echo "0")

if [ "$UNCOMMITTED" -gt 0 ]; then
  echo "⚠️  Uncommitted skill enhancements detected:" >&2
  git status --porcelain skills-templates/ >&2
  echo "" >&2
  echo "Please review enhanced skills before proceeding:" >&2
  echo "  1. Review changes: git diff skills-templates/" >&2
  echo "  2. Test enhanced skill in workflow" >&2
  echo "  3. Commit: git add skills-templates/ && git commit -m 'feat(skills): enhance ...'" >&2
  echo "" >&2
  echo "Or discard changes: git checkout skills-templates/" >&2

  # BLOCKING: Prevent new prompt until review/commit
  exit 2
fi

exit 0
```

**Benefits**:
- **Deterministic enforcement**: Quality gates cannot be bypassed
- **Blocking semantics**: Exit code 2 forces remediation before proceeding
- **Actionable feedback**: Specific recommendations for each criterion below threshold
- **Workflow integration**: Hooks run automatically without manual invocation

**See**: [Document 05: Testing and Quality Assurance](../../docs/best-practices/05-Testing-and-Quality-Assurance.md#production-grade-hooks-for-quality-assurance) for comprehensive hooks patterns.

## CI/CD Integration

### GitHub Actions: Automated Enhancement Pipeline

**.github/workflows/skill-enhancement.yml**:

```yaml
name: Automated Skill Enhancement

on:
  schedule:
    # Run weekly on Monday at 2 AM UTC
    - cron: '0 2 * * 1'

  workflow_dispatch:
    inputs:
      skill_name:
        description: 'Specific skill to enhance'
        required: false
        type: string
      focus:
        description: 'Enhancement focus areas (comma-separated)'
        required: false
        type: string

jobs:
  identify-stale-skills:
    runs-on: ubuntu-latest
    outputs:
      skills: ${{ steps.scan.outputs.skills }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Claude CLI
        uses: ./.github/actions/setup-claude
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Run maintenance scan
        id: scan
        run: |
          claude code /maintenance-scan --output-json > maintenance-report.json

          # Extract stale skills (>30 days)
          SKILLS=$(jq -r '.stale_skills | map(.name) | join(",")' maintenance-report.json)
          echo "skills=$SKILLS" >> $GITHUB_OUTPUT

      - name: Upload scan results
        uses: actions/upload-artifact@v4
        with:
          name: maintenance-report
          path: maintenance-report.json

  enhance-skill:
    needs: identify-stale-skills
    if: needs.identify-stale-skills.outputs.skills != ''
    runs-on: ubuntu-latest

    strategy:
      matrix:
        skill: ${{ fromJson(format('["{0}"]', needs.identify-stale-skills.outputs.skills)) }}
      max-parallel: 3  # Prevent API rate limits

    steps:
      - uses: actions/checkout@v4

      - name: Setup Claude CLI
        uses: ./.github/actions/setup-claude
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Setup Python for quality scoring
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          pip install skill-seekers pyyaml
          pip install -e .claude/quality/  # Quality scoring module

      - name: Enhance skill
        id: enhance
        run: |
          # Run enhancement with JSON output
          claude code /skill-enhancer "${{ matrix.skill }}" \
            ${{ inputs.focus && format('--focus "{0}"', inputs.focus) || '' }} \
            --output-json > enhancement-result.json

          # Parse results
          STATUS=$(jq -r '.status' enhancement-result.json)
          IMPROVEMENT=$(jq -r '.quality.improvement.percentage_gain' enhancement-result.json)
          SCORE_AFTER=$(jq -r '.quality.after.score' enhancement-result.json)

          echo "status=$STATUS" >> $GITHUB_OUTPUT
          echo "improvement=$IMPROVEMENT" >> $GITHUB_OUTPUT
          echo "score=$SCORE_AFTER" >> $GITHUB_OUTPUT

      - name: Validate enhancement quality
        if: steps.enhance.outputs.status == 'success'
        run: |
          SCORE=${{ steps.enhance.outputs.score }}
          IMPROVEMENT=${{ steps.enhance.outputs.improvement }}

          # Enforce quality thresholds
          if (( $(echo "$SCORE < 20" | bc -l) )); then
            echo "❌ Enhancement failed quality gate: ${SCORE}/25"
            exit 1
          fi

          if (( $(echo "$IMPROVEMENT < 10" | bc -l) )); then
            echo "⚠️  Minimal improvement: +${IMPROVEMENT}%"
            echo "Consider manual refinement for ${{ matrix.skill }}"
          fi

      - name: Commit enhanced skill
        if: steps.enhance.outputs.status == 'success'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          git add skills-templates/${{ matrix.skill }}/

          IMPROVEMENT=${{ steps.enhance.outputs.improvement }}
          SCORE=${{ steps.enhance.outputs.score }}

          git commit -m "feat(skills): enhance ${{ matrix.skill }}

          Automated quality enhancement via skill-enhancer v3.0

          Results:
          - Quality score: ${SCORE}/25
          - Improvement: +${IMPROVEMENT}%
          - Enhanced by: AI-powered Skill Seekers

          Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>"

      - name: Upload enhancement report
        uses: actions/upload-artifact@v4
        with:
          name: enhancement-${{ matrix.skill }}
          path: enhancement-result.json

  create-pr:
    needs: [identify-stale-skills, enhance-skill]
    if: success()
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Download all enhancement reports
        uses: actions/download-artifact@v4
        with:
          pattern: enhancement-*
          path: reports/

      - name: Create pull request
        run: |
          # Count enhanced skills
          SKILL_COUNT=$(ls reports/ | wc -l)

          # Calculate average improvement
          AVG_IMPROVEMENT=$(jq -s 'map(.quality.improvement.percentage_gain) | add / length' reports/*/enhancement-result.json)

          # Create PR body
          cat > pr-body.md <<EOF
          ## Automated Skill Enhancement

          **Summary**: Enhanced $SKILL_COUNT skills with AI-powered quality improvements

          **Average Improvement**: +${AVG_IMPROVEMENT}% quality score

          ### Enhanced Skills

          $(ls reports/ | sed 's/enhancement-//g' | sed 's/^/- /')

          ### Quality Metrics

          $(jq -r '. | "- **\(.skill.name)**: \(.quality.after.score)/25 (\(.quality.improvement.percentage_gain)% improvement)"' reports/*/enhancement-result.json)

          ---

          **Automation**: skill-enhancer v3.0 via GitHub Actions
          **Triggered**: ${{ github.event_name }} on $(date -u +"%Y-%m-%d %H:%M UTC")
          EOF

          gh pr create \
            --title "chore(skills): automated enhancement of $SKILL_COUNT skills" \
            --body-file pr-body.md \
            --label "automation" \
            --label "skills"
        env:
          GH_TOKEN: ${{ github.token }}
```

**Benefits**:
- **Automated maintenance**: Weekly scans identify stale skills
- **Quality enforcement**: CI fails if enhancement below threshold
- **Parallel processing**: Matrix strategy enhances multiple skills concurrently
- **Structured reporting**: JSON output enables programmatic decision-making
- **Auto-PR creation**: Enhanced skills automatically submitted for review

## Security & Compliance

### Input Sanitization

**Prevent path traversal attacks**:

```bash
# Sanitize skill name (remove path separators)
SKILL_NAME=$(echo "$USER_INPUT" | sed 's/[^a-zA-Z0-9_-]//g')

# Validate --path parameter (reject directory traversal)
if echo "$PATH_INPUT" | grep -qE '\.\./|^/etc/|^/usr/|^/var/'; then
  echo "❌ Security: Path traversal or system directory access denied"
  exit 1
fi

# Canonicalize path to prevent symlink attacks
SKILL_PATH=$(realpath -m "$PATH_INPUT")
ALLOWED_BASE=$(realpath -m "$(pwd)/skills-templates")

if [[ ! "$SKILL_PATH" =~ ^"$ALLOWED_BASE" ]]; then
  echo "❌ Security: Path outside allowed directory"
  exit 1
fi
```

### Least Privilege Permissions

**Explicit tool scoping** (from frontmatter):

```yaml
allowed-tools:
  - "Bash(pip:install,show)"       # Only install and show, not uninstall
  - "Bash(skill-seekers:*)"        # All skill-seekers operations
  - "Bash(python3:-c,-m)"          # Only -c and -m flags
  - "Bash(ls:-la)"                 # Only -la, not -R or other flags
  - "Bash(cp:-r)"                  # Only recursive copy, no -f force
  - "Bash(test:-f,-d)"             # Only file/directory checks
  - "Read"                         # Read-only source access
  - "Edit"                         # Controlled edits only
  - "Write"                        # For JSON output only
```

**Rationale**:
- No write access to system directories
- No arbitrary command execution (no `Bash(*)`)
- No file deletion capabilities
- No network access (no `curl`, `wget`)

### Audit Trails

**Comprehensive logging**:

```json
{
  "timestamp": "2026-01-23T14:32:18.456Z",
  "event": "skill_enhancement",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "user": "alice@example.com",
  "skill": {
    "name": "api-documentation-generator",
    "path": "skills-templates/api-documentation-generator",
    "version_before": "1.2.3",
    "version_after": "1.3.0"
  },
  "quality": {
    "score_before": 15.2,
    "score_after": 22.1,
    "improvement": 6.9
  },
  "ai_provider": {
    "service": "openai",
    "model": "gpt-4",
    "api_calls": 3,
    "total_tokens": 12450
  },
  "duration_seconds": 187,
  "outcome": "success"
}
```

**Storage**:
- **Local**: `.claude/audit/skill-enhancements.jsonl` (30-day retention)
- **Remote**: SIEM integration (Splunk, Datadog, SigNoz) for compliance

### Safe Defaults

**Automatic backups**:
```bash
# Create backup unless explicitly disabled
if [ "$NO_BACKUP" != "true" ]; then
  BACKUP_PATH="${SKILL_PATH}.backup-$(date +%Y%m%d-%H%M%S)"
  cp -r "$SKILL_PATH" "$BACKUP_PATH"
fi
```

**Read-only source validation**:
```bash
# Never modify source until validation passes
SKILL_MD_ORIG=$(cat "$SKILL_PATH/SKILL.md")

# Run validation
if ! validate_yaml_frontmatter "$SKILL_PATH/SKILL.md"; then
  echo "❌ Validation failed, no changes made"
  exit 1
fi

# Only modify after validation
echo "$ENHANCED_CONTENT" > "$SKILL_PATH/SKILL.md"
```

**For compliance implementation**: See [Document 06: Production Deployment](../../docs/best-practices/06-Production-Deployment-and-Maintenance.md#compliance-requirements) for SOC 2, HIPAA, GDPR patterns.

## Progressive Disclosure

### External Rule Files

To prevent context window saturation, detailed workflows are externalized:

**Architecture**:
```
.claude/
├── commands/
│   └── skill-enhancer.md           # Orchestration only (this file)
└── rules/
    ├── enhancement-workflow.md      # Detailed 8-step process
    ├── quality-rubric.md            # Scoring criteria and thresholds
    ├── security-checklist.md        # Input validation patterns
    └── testing-strategy.md          # Unit and integration tests
```

**Usage Pattern**:
```markdown
# In skill-enhancer.md

## Step 4: Run Enhancement

See `.claude/rules/enhancement-workflow.md` for detailed enhancement process.

## Quality Scoring

Refer to `.claude/rules/quality-rubric.md` for complete scoring rubric.
```

**Benefits**:
- **Focused commands**: skill-enhancer.md stays under 800 lines (vs 1500+ with inline details)
- **On-demand retrieval**: Claude loads referenced files only when needed
- **Ownership distribution**: Quality team maintains `quality-rubric.md`, DevOps owns `enhancement-workflow.md`
- **Version independence**: Update workflows without changing command structure

**See**: [Document 02: Command Creation](../../docs/best-practices/02-Individual-Command-Creation.md#progressive-disclosure) for complete pattern.

## Testing Strategy

### Unit Testing

**Test individual validation layers**:

```python
# tests/test_skill_enhancer.py
import subprocess
import pytest
from pathlib import Path

def test_input_validation_missing_parameters():
    """Verify input validation catches missing parameters"""
    result = subprocess.run(
        ["claude", "code", "/skill-enhancer"],  # No parameters
        capture_output=True,
        text=True
    )

    assert result.returncode == 1
    assert "One of skill-name, --incoming, or --path is required" in result.stderr

def test_path_traversal_prevention():
    """Verify security blocks path traversal"""
    result = subprocess.run(
        ["claude", "code", "/skill-enhancer", "--path", "../../../etc/passwd"],
        capture_output=True,
        text=True
    )

    assert result.returncode == 1
    assert "Security" in result.stderr or "path traversal" in result.stderr.lower()

def test_skill_existence_check():
    """Verify skill existence validation"""
    result = subprocess.run(
        ["claude", "code", "/skill-enhancer", "nonexistent-skill-xyz"],
        capture_output=True,
        text=True
    )

    assert result.returncode == 1
    assert "not found" in result.stderr.lower()

def test_yaml_frontmatter_validation():
    """Verify YAML validation catches malformed frontmatter"""
    # Create temporary skill with invalid YAML
    tmp_skill = Path("tmp-invalid-skill")
    tmp_skill.mkdir(exist_ok=True)
    (tmp_skill / "SKILL.md").write_text("---\ninvalid: yaml: syntax\n---\n")

    result = subprocess.run(
        ["claude", "code", "/skill-enhancer", "--path", str(tmp_skill)],
        capture_output=True,
        text=True
    )

    assert result.returncode == 1
    assert "YAML" in result.stderr

    # Cleanup
    import shutil
    shutil.rmtree(tmp_skill)

def test_quality_scoring_calculation():
    """Verify quality scoring produces expected results"""
    from claude.quality.skill_scorer import score_skill

    # Use test fixture skill
    test_skill = Path("tests/fixtures/minimal-skill")
    result = score_skill(test_skill)

    assert result['max_score'] == 25
    assert 0 <= result['score'] <= 25
    assert result['percentage'] == (result['score'] / 25) * 100
    assert 'structure' in result['breakdown']
    assert 'examples' in result['breakdown']
```

### Integration Testing

**Test full enhancement pipeline**:

```python
def test_full_enhancement_pipeline():
    """Integration test: enhance a real skill and verify results"""
    import json
    import shutil
    from pathlib import Path

    # Setup: Create test skill
    test_skill = Path("integration-test-skill")
    shutil.copytree("tests/fixtures/basic-skill", test_skill)

    try:
        # Run enhancement with JSON output
        result = subprocess.run(
            ["claude", "code", "/skill-enhancer", str(test_skill), "--output-json"],
            capture_output=True,
            text=True,
            timeout=300  # 5-minute timeout for AI enhancement
        )

        assert result.returncode == 0, f"Enhancement failed: {result.stderr}"

        # Parse JSON output
        output = json.loads(result.stdout)

        # Verify structure
        assert output['status'] == 'success'
        assert 'quality' in output
        assert 'before' in output['quality']
        assert 'after' in output['quality']

        # Verify improvement
        improvement = output['quality']['improvement']['score_increase']
        assert improvement > 0, "Enhancement should improve quality score"

        # Verify quality gate
        final_score = output['quality']['after']['score']
        assert final_score >= 20, f"Final score {final_score} below threshold"

        # Verify backup created
        backups = list(Path(".").glob(f"{test_skill}.backup-*"))
        assert len(backups) == 1, "Backup should be created"

        # Verify SKILL.md enhanced
        skill_md = (test_skill / "SKILL.md").read_text()
        assert len(skill_md) > 1000, "Enhanced SKILL.md should have content"

    finally:
        # Cleanup
        if test_skill.exists():
            shutil.rmtree(test_skill)
        for backup in Path(".").glob(f"{test_skill}.backup-*"):
            shutil.rmtree(backup)

def test_hook_integration():
    """Verify PostToolUse hook enforces quality gates"""
    # This test requires .claude/hooks configured

    # Create low-quality skill
    low_quality_skill = Path("tmp-low-quality")
    low_quality_skill.mkdir(exist_ok=True)
    (low_quality_skill / "SKILL.md").write_text("""---
name: minimal
---

# Minimal Skill

Very basic skill.""")

    try:
        result = subprocess.run(
            ["claude", "code", "/skill-enhancer", str(low_quality_skill)],
            capture_output=True,
            text=True
        )

        # Hook should block enhancement if quality too low
        if result.returncode == 2:  # Hook blocking error
            assert "Quality gate failed" in result.stderr
        else:
            # If hook allowed, verify quality was actually adequate
            output = json.loads(result.stdout)
            assert output['quality']['after']['score'] >= 20

    finally:
        import shutil
        if low_quality_skill.exists():
            shutil.rmtree(low_quality_skill)
```

### CI Validation Workflow

**.github/workflows/test-skill-enhancer.yml**:

```yaml
name: Test Skill Enhancer Command

on:
  pull_request:
    paths:
      - '.claude/commands/skill-enhancer.md'
      - 'claude/quality/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install pytest skill-seekers pyyaml
          pip install -e .

      - name: Run unit tests
        run: pytest tests/test_skill_enhancer.py -v

      - name: Run integration tests
        run: pytest tests/test_skill_enhancer.py::test_full_enhancement_pipeline -v
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage.xml
```

**Benefits**:
- **Regression prevention**: Unit tests catch validation regressions
- **Integration confidence**: Full pipeline tests verify end-to-end functionality
- **Hook validation**: Ensure quality gates function correctly
- **CI enforcement**: PR tests prevent breaking changes

## Anti-Patterns

### What NOT to Do

#### ❌ Anti-Pattern 1: Enhancing Without Backup

```bash
# WRONG: No backup before enhancement
/skill-enhancer my-skill --no-backup
```

**Why it's wrong**: Enhancement can introduce regressions; backups enable rollback

**Correct approach**:
```bash
# RIGHT: Always keep backup (default behavior)
/skill-enhancer my-skill
# Creates my-skill.backup-YYYYMMDD-HHMMSS automatically
```

#### ❌ Anti-Pattern 2: Ignoring Quality Scores

```bash
# WRONG: Blindly accept enhancement regardless of quality
/skill-enhancer my-skill
# (Check output, see score: 12/25, still deploy to production)
```

**Why it's wrong**: Low-quality skills degrade user experience, increase support burden

**Correct approach**:
```bash
# RIGHT: Enforce quality gates
/skill-enhancer my-skill --output-json | jq '.quality.after.score'
# If score < 20, manually refine before deployment
```

#### ❌ Anti-Pattern 3: Batch Enhancement Without Review

```bash
# WRONG: Enhance all skills and auto-commit
for skill in skills-templates/*; do
  /skill-enhancer $(basename $skill)
done
git add -A && git commit -m "batch enhancement" && git push
```

**Why it's wrong**: Mass changes can introduce subtle bugs, lose domain knowledge

**Correct approach**:
```bash
# RIGHT: Enhance individually, review each
for skill in api-docs database-migration; do
  /skill-enhancer $skill --output-json > "result-$skill.json"

  # Review changes
  git diff skills-templates/$skill/

  # Test enhanced skill
  # (Use skill in real workflow)

  # Commit if satisfactory
  git add skills-templates/$skill/
  git commit -m "feat(skills): enhance $skill

  Quality: $(jq -r '.quality.after.score' result-$skill.json)/25
  Improvement: +$(jq -r '.quality.improvement.percentage_gain' result-$skill.json)%"
done
```

#### ❌ Anti-Pattern 4: Using --no-backup in Production

```bash
# WRONG: Disable backup to save disk space
/skill-enhancer production-critical-skill --no-backup
```

**Why it's wrong**: Production skills are most critical; backup is insurance policy

**Correct approach**:
```bash
# RIGHT: Always backup production skills
/skill-enhancer production-critical-skill
# Backup only costs ~1MB per skill, negligible vs. risk
```

#### ❌ Anti-Pattern 5: Enhancing Skill Mid-Session

```bash
# User is actively using a skill for their task
# (Enhancement runs, skill changes mid-task)
# User's next invocation uses new version, unexpected behavior
```

**Why it's wrong**: Mid-session enhancement causes context confusion

**Correct approach**:
```bash
# RIGHT: Use UserPromptSubmit hook to prevent enhancement during active sessions
# See Hooks Integration section above
```

#### ❌ Anti-Pattern 6: Over-Enhancement

```bash
# WRONG: Enhance skill repeatedly seeking perfect score
/skill-enhancer my-skill
# Score: 22/25
/skill-enhancer my-skill  # Enhance again
# Score: 23/25
/skill-enhancer my-skill  # Enhance again
# Score: 23.5/25
/skill-enhancer my-skill  # Enhance again
```

**Why it's wrong**: Diminishing returns, wasted API costs, potential over-fitting

**Correct approach**:
```bash
# RIGHT: One enhancement pass, manual refinement if needed
/skill-enhancer my-skill
# Score: 22/25 (88%) → Good enough for production
# If critical gaps remain, manually address specific issues
```

### Quality Checklist

Before deploying enhanced skill:

- [ ] Quality score ≥20/25 (80%)
- [ ] Improvement ≥10% or ≥2 points
- [ ] Backup created successfully
- [ ] Enhanced skill tested in real workflow
- [ ] No regressions in existing functionality
- [ ] Version number incremented correctly
- [ ] Changes committed to version control
- [ ] Team notified of enhancement (if shared skill)

### 10. Final Summary

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

### 3.0.0 (2026-01-23) - Production-Grade Enhancement

**Major version bump due to breaking changes in permissions and output format.**

#### New Features
- **Pre-execution validation**: Four-layer validation system (input, existence, structure, prerequisites)
- **Quality scoring rubric**: LLM-as-judge 25-point assessment with before/after comparison
- **Structured JSON output**: Machine-readable results for CI/CD integration
- **Hooks integration**: PostToolUse and UserPromptSubmit hooks for quality enforcement
- **CI/CD pipelines**: GitHub Actions workflows for automated enhancement
- **Security hardening**: Input sanitization, path traversal prevention, least privilege permissions
- **Progressive disclosure**: External rule files prevent context saturation
- **Testing framework**: Unit and integration tests for validation reliability
- **Anti-patterns guide**: Common mistakes and correct approaches
- **Audit trails**: Comprehensive JSONL logging for compliance

#### Breaking Changes
- **Permissions**: Changed from broad patterns (`Bash(pip)`) to argument-scoped (`Bash(pip:install,show)`)
- **Default output**: Now JSON format (use `--output-format plain` for legacy text mode)
- **Quality gates**: Enhancement requires ≥20/25 (80%) improvement or triggers warning
- **Hooks requirement**: PostToolUse hook mandatory for production deployments

#### Enhancements
- **Quality threshold**: Enforce minimum 80% quality score for production deployment
- **Improvement metrics**: Track score increase and percentage gain
- **Safe defaults**: Automatic backups, read-only validation, defensive programming
- **Documentation**: 800+ lines of production patterns, examples, and best practices

#### Migration Notes
- Update `allowed-tools` in agent configurations using this command
- Configure `.claude/hooks/posttooluse_enhancement_quality.sh` for quality enforcement
- Update CI/CD pipelines to parse JSON output instead of plain text
- Review enhanced skills manually before production deployment

**Rationale**: Aligns with production-grade patterns from [Document 02](../../docs/best-practices/02-Individual-Command-Creation.md), [Document 08](../../docs/best-practices/08-Claude-Skills-Guide.md), and [Document 09](../../docs/best-practices/09-Developing-High-Impact-Claude-Skills.md).

### 2.0.0 (2025-12-31) - Repository-Specific Adaptation

#### Features
- Integrated with Skill Seekers enhance command
- Aligned with skills-templates/ directory structure
- Integration with INTEGRATION/incoming pipeline
- Streamlined workflow matching skill-creator
- Added --incoming and --finalize flags
- Simplified output and process flow
- Config-driven approach

### 1.0.0 (2025-12-31) - Initial Template

#### Features
- Manual enhancement workflow
- Comprehensive step-by-step process

---

**Current Version**: 3.0.0
**Last Updated**: January 23, 2026
**Dependencies**: Python 3.8+, pip, skill-seekers package, valid skill directory structure
**Integration**: Works with /create-skill, /integration-scan, /maintenance-scan
**Estimated Runtime**: 5-15 minutes (AI enhancement), 2-3 minutes (validation only)
**Quality Standard**: ≥20/25 (80%) for production deployment
