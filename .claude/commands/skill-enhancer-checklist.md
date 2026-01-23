# Skill Enhancement Checklist (v3.0)

**Version**: 3.0.0
**Command**: `/skill-enhancer`
**Purpose**: Systematic, production-grade skill enhancement workflow
**Quality Standard**: ≥20/25 (80%) for production deployment

Quick reference for skill enhancement workflow following production-grade patterns from [Document 02](../../docs/best-practices/02-Individual-Command-Creation.md), [Document 08](../../docs/best-practices/08-Claude-Skills-Guide.md), and [Document 09](../../docs/best-practices/09-Developing-High-Impact-Claude-Skills.md).

---

## Pre-Execution Validation

### Layer 1: Input Validation
- [ ] Verify one of: `skill-name`, `--incoming`, or `--path` provided
- [ ] Sanitize skill name (no path separators, special characters)
- [ ] Validate `--path` parameter (no directory traversal patterns)
- [ ] Check `--focus` parameter format (comma-separated, valid areas)

### Layer 2: Skill Existence
- [ ] Determine skill path based on parameters
- [ ] Verify skill directory exists
- [ ] Confirm SKILL.md file present
- [ ] Check directory permissions (read/write access)

### Layer 3: Structure Validation
- [ ] Validate YAML frontmatter syntax
- [ ] Verify minimum content requirements (≥50 lines recommended)
- [ ] Check required sections present (Description, When to Use, Example)
- [ ] Ensure proper markdown formatting

### Layer 4: Prerequisites
- [ ] Verify skill-seekers installed (`skill-seekers --version` or `pip show skill-seekers`)
- [ ] Check disk space available (≥100MB required)
- [ ] Confirm Python 3.8+ available (`python3 --version`)
- [ ] Validate environment variables if needed (OPENAI_API_KEY for full AI enhancement)

---

## Pre-Enhancement

### Skill Location
- [ ] Identify skill location (skills-templates/ or INTEGRATION/incoming/)
- [ ] Verify SKILL.md exists
- [ ] Check directory structure (knowledge/, examples/, references/)
- [ ] Note current version number
- [ ] Document skill path for audit trail

### Quality Assessment (Baseline)
- [ ] Read current SKILL.md thoroughly
- [ ] Evaluate description clarity (action-oriented?)
- [ ] Check example coverage (count, input/output pairs)
- [ ] Review error handling comprehensiveness
- [ ] Identify missing capabilities
- [ ] **Run quality scorer**: `python3 .claude/quality/skill_scorer.py skills-templates/[skill-name]`
- [ ] **Record baseline score**: ___ /25 (___%)

### Preparation
- [ ] Verify skill-seekers installed (`skill-seekers --version`)
- [ ] Ensure backup directory has space (≥1MB per skill)
- [ ] Document enhancement goals (specific improvements desired)
- [ ] Note which areas to focus on (`--focus` parameter)
- [ ] Review production-grade checklist (this document)

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
- [ ] Check version incremented (semantic versioning)
- [ ] Verify new examples added (count before/after)
- [ ] Review knowledge files updated (check timestamps)
- [ ] Validate YAML frontmatter (no syntax errors)
- [ ] Inspect diff: `git diff skills-templates/[skill-name]/`

---

## Quality Scoring (Before/After Comparison)

### Run Quality Assessment
- [ ] **Before enhancement**: Record baseline score from Pre-Enhancement phase
- [ ] **After enhancement**: Re-run quality scorer on enhanced skill
- [ ] **Command**: `python3 .claude/quality/skill_scorer.py skills-templates/[skill-name]`
- [ ] **Record after score**: ___ /25 (___%)

### Analyze Results
- [ ] Calculate score increase: after_score - before_score = ___ points
- [ ] Calculate percentage gain: (increase / before_score) × 100 = ___%
- [ ] Verify minimum improvement: ≥2 points OR ≥10% gain
- [ ] Check quality gate: after_score ≥20/25 (80%)

### Breakdown Analysis
- [ ] **Structure** (0-5): ___ (Required sections, YAML, minimum length)
- [ ] **Examples** (0-5): ___ (Count 2-5, input/output clarity, applicability)
- [ ] **Triggers** (0-5): ___ (Action verbs, clarity, specificity)
- [ ] **Knowledge** (0-5): ___ (File count, depth, coverage)
- [ ] **Documentation** (0-5): ___ (Prerequisites, workflow, troubleshooting)

### Quality Gate Decision
- [ ] **✅ PASSED** (≥20/25): Ready for production deployment
- [ ] **⚠️ NEEDS WORK** (<20/25): Manual refinement required
- [ ] Document specific areas needing improvement if below threshold

---

## JSON Output Validation

### Parse JSON Result
- [ ] Verify JSON output format: `jq . enhancement-result.json`
- [ ] Check `status` field: "success" or "error"
- [ ] Verify `skill` section present (name, location, backup)
- [ ] Confirm `quality` section present (before, after, improvement)
- [ ] Validate `changes` section (skill_md, examples, knowledge)
- [ ] Check `metrics` section (duration, API calls, tokens)

### Extract Key Metrics
- [ ] Quality improvement: `jq -r '.quality.improvement.percentage_gain' enhancement-result.json`
- [ ] Final score: `jq -r '.quality.after.score' enhancement-result.json`
- [ ] Enhancement duration: `jq -r '.metrics.enhancement_duration_seconds' enhancement-result.json`
- [ ] Token usage: `jq -r '.metrics.token_usage' enhancement-result.json`

### CI/CD Integration Validation
- [ ] JSON parseable by automated tools (no syntax errors)
- [ ] All required fields present for decision-making
- [ ] Numeric fields properly typed (numbers, not strings)
- [ ] Arrays formatted correctly (examples.new_files, next_steps)

---

## Hooks Integration Verification

### PostToolUse Hook Check
- [ ] Verify hook file exists: `.claude/hooks/posttooluse_enhancement_quality.sh`
- [ ] Check hook permissions: `chmod +x .claude/hooks/posttooluse_enhancement_quality.sh`
- [ ] Validate hook configuration in `.claude/settings.json`
- [ ] Test hook execution manually (if applicable)
- [ ] Verify blocking semantics: exit code 2 stops workflow

### Hook Behavior Validation
- [ ] Hook runs after skill-seekers enhance command
- [ ] Quality scoring executed automatically
- [ ] Below-threshold enhancement blocked with clear error
- [ ] Above-threshold enhancement allowed to proceed
- [ ] Error messages actionable (specific criteria to improve)

### UserPromptSubmit Hook (Optional)
- [ ] Verify `.claude/hooks/userpromptsubmit_review_enhancement.sh` if using block-at-submit pattern
- [ ] Confirm uncommitted enhancements block new prompts
- [ ] Test review/commit workflow

---

## Security Validation

### Input Sanitization Check
- [ ] Skill name sanitized (no special characters, path separators)
- [ ] Path parameters validated (no directory traversal: `../`)
- [ ] No system directory access (`/etc`, `/usr`, `/var`)
- [ ] Path canonicalization applied (`realpath -m`)

### Permission Scope Verification
- [ ] Review `allowed-tools` in skill-enhancer.md frontmatter
- [ ] Verify argument-level scoping (e.g., `Bash(pip:install,show)`)
- [ ] Confirm no wildcards for dangerous commands
- [ ] Check no write access to system directories

### Audit Trail Check
- [ ] Verify audit log exists: `.claude/audit/skill-enhancements.jsonl`
- [ ] Check log entry created for this enhancement
- [ ] Confirm all required fields present (timestamp, user, skill, quality, outcome)
- [ ] Validate log format (valid JSON Lines)

---

## Quality Validation

### Structure Check
- [ ] YAML frontmatter valid (parseable by PyYAML)
- [ ] Required sections present (Description, When to Use, Example)
- [ ] Proper markdown formatting (headers, lists, code blocks)
- [ ] All references resolve (no broken links)
- [ ] Minimum content length met (≥50 lines)

### Content Check
- [ ] Description action-oriented (clear purpose statement)
- [ ] Instructions clear and specific (step-by-step)
- [ ] Examples include input/output (2-5 examples)
- [ ] Error handling comprehensive (common issues documented)
- [ ] Edge cases documented (non-happy-path scenarios)

### Testing
- [ ] Test skill in real workflow (actual use case)
- [ ] Verify triggers work correctly (skill activates as expected)
- [ ] Check examples execute properly (reproducible)
- [ ] Validate error handling (intentionally trigger errors)
- [ ] Confirm no regressions (existing functionality intact)

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

## CI/CD Integration Validation

### GitHub Actions Workflow Check
- [ ] Verify workflow file exists: `.github/workflows/skill-enhancement.yml`
- [ ] Check workflow triggers configured (schedule, workflow_dispatch)
- [ ] Confirm secrets available (`ANTHROPIC_API_KEY`)
- [ ] Validate matrix strategy (parallel skill processing)
- [ ] Test quality gate enforcement (CI fails if score <20)

### Automated PR Creation
- [ ] Verify PR body includes quality metrics
- [ ] Check PR labels applied correctly (automation, skills)
- [ ] Confirm commit message follows conventions
- [ ] Validate all enhanced skills included in PR

### Performance Metrics
- [ ] Monitor API rate limits (max 3 concurrent enhancements)
- [ ] Track workflow execution time (timeout: 5 minutes per skill)
- [ ] Review cost attribution (token usage per enhancement)
- [ ] Identify optimization opportunities (caching, batching)

---

## Quick Decision Matrix

### When to Enhance?
- ✅ Skill works but output inconsistent
- ✅ Missing examples or error handling (score <20)
- ✅ Just created with /create-skill (baseline quality)
- ✅ Identified by /maintenance-scan (stale, >30 days)
- ✅ Quality score 15-19 (close to threshold)
- ❌ Skill fundamentally broken (fix logic first)
- ❌ Major restructure needed (manual redesign)
- ❌ Quality score <10 (requires manual rewrite)

### Version Bump Guide
| Change Type | Version | Example | Score Impact |
|-------------|---------|---------|-------------|
| Typos, minor fixes | Patch (1.0.1) | Fixed example typo | +0-1 points |
| New examples, improvements | Minor (1.1.0) | Added 5 examples | +2-5 points |
| Breaking changes | Major (2.0.0) | Changed workflow | +5-10 points |

### Focus Areas
| Focus | When to Use | Example | Target Criteria |
|-------|-------------|---------|----------------|
| `clarity` | Instructions confusing | Complex steps | Structure, Documentation |
| `examples` | Need more demonstrations | Only 1-2 examples | Examples criterion |
| `error-handling` | Missing error guidance | No error docs | Documentation |
| `edge-cases` | Missing edge scenarios | Only happy path | Examples, Documentation |
| `triggers` | Activation unclear | Vague conditions | Triggers criterion |
| `all` | Comprehensive enhancement | Default | All 5 criteria |

### Quality Gate Thresholds
| Score Range | Status | Action |
|-------------|--------|--------|
| 0-12 (0-48%) | ❌ Critical | Manual rewrite required |
| 13-19 (52-76%) | ⚠️ Needs Work | Enhance + manual refinement |
| 20-22 (80-88%) | ✅ Production Ready | Deploy with confidence |
| 23-25 (92-100%) | 🌟 Excellent | Best-in-class quality |

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

## Production Deployment Checklist

### Before Production
- [ ] Quality score ≥20/25 (80%)
- [ ] Improvement ≥10% or ≥2 points
- [ ] All tests passing (unit + integration)
- [ ] Backup created and verified
- [ ] Enhanced skill tested in real workflow
- [ ] No regressions detected
- [ ] Version number incremented correctly (semver)
- [ ] Hooks configured and tested

### During Deployment
- [ ] Changes committed to version control
- [ ] Commit message follows conventions
- [ ] PR created (if team workflow)
- [ ] Code review completed (if required)
- [ ] CI/CD pipeline passes
- [ ] Production deployment approved

### After Deployment
- [ ] Monitor skill activation patterns (1-7 days)
- [ ] Gather user feedback
- [ ] Track quality metrics (usage, success rate)
- [ ] Document lessons learned
- [ ] Plan next iteration if needed

---

## v3.0 New Features Summary

**Quality Enforcement**:
- 25-point scoring rubric with LLM-as-judge
- Before/after comparison with quantified improvement
- Minimum threshold: ≥20/25 (80%) for production

**Automation**:
- Pre-execution validation (4 layers)
- Structured JSON output for CI/CD
- GitHub Actions workflow templates
- Hooks integration for deterministic enforcement

**Security**:
- Input sanitization (path traversal prevention)
- Least privilege permissions (argument-scoped tools)
- Audit trails (JSONL format)
- Safe defaults (automatic backups, read-only validation)

**See**: `/skill-enhancer` command for complete implementation details.

---

**Version**: 3.0.0
**Last Updated**: January 23, 2026
**Use With**: /skill-enhancer v3.0.0 command
**Purpose**: Ensure systematic, production-grade quality enhancements
**Quality Standard**: ≥20/25 (80%) for production deployment
**Breaking Changes**: Quality gates enforced, JSON output default, hooks required
