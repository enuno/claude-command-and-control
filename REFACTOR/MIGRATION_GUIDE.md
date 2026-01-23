# MIGRATION_GUIDE.md: claude-command-and-control Refactoring

**Version**: 1.0  
**Effective Date**: [Date of cutover]  
**Target Audience**: Existing users of claude-command-and-control  
**Scope**: Updated paths and directory structure

---

## âš¡ Quick Summary

The repository has been **reorganized to eliminate duplication and improve discoverability**:

| Before | After | Why |
|--------|-------|-----|
| `@commands-templates/` | `library/commands/` | Single source of truth |
| `@agents-templates/` | `library/agents/` | Eliminate confusion |
| `@skills-templates/` | `library/skills/` | Clear template hierarchy |
| `skills/` (20) + `@skills-templates/` (31) | `library/skills/` (merged ~40) | Consolidate duplicates |
| `templates/commands/` (overlapped) | `library/commands/` | Remove redundant copies |
| 3 separate orchestration dirs | `library/orchestration/` | Single planning location |

**NEW**: `.claude/` directory contains your ACTIVE instances (what you're using), separate from templates.

---

## Before & After Examples

### Example 1: Finding a Template

**BEFORE**: "Where is the test command template?"
```
âŒ Try: @commands-templates/core/test.md (maybe?)
âŒ Try: templates/commands/test.md (or here?)
âŒ Try: root/commands/test.md (or...?)
ðŸ˜• Result: Multiple locations, unclear which is authoritative
```

**AFTER**: "Where is the test command template?"
```
âœ… location/commands/core/test.md (single authoritative location)
âœ… Copy to: .claude/commands/test.md (your active instance)
ðŸ˜Š Result: Clear hierarchy, obvious where to find things
```

### Example 2: Using a Skill

**BEFORE**:
```markdown
# In your CLAUDE.md or documentation:

From: `@skills-templates/orchestration/multi-agent-planner-skill.md`
Or: `skills/multi-agent-planner/`  # Unclear which to use
```

**AFTER**:
```markdown
# In your CLAUDE.md:

Template: library/skills/by-category/orchestration/multi-agent-planner-skill/
Active instance: .claude/skills/multi-agent-planner-skill/  # What we're using
```

### Example 3: Agents Configuration

**BEFORE**:
```json
{
  "architect_template": "@agents-templates/roles/architect.md",
  "builder_template": "@agents-templates/roles/builder.md",
  "builder_skills": "from @skills-templates/orchestration/..."
}
```

**AFTER**:
```json
{
  "architect_template": "library/agents/roles/architect/",
  "architect_active": ".claude/agents/architect/",  # What's currently deployed
  "builder_template": "library/agents/roles/builder/",
  "builder_active": ".claude/agents/builder/",
  "builder_skills": "from .claude/skills/..."  # Active instances
}
```

---

## Breaking Changes

### ðŸ”´ Path References Must Be Updated

**If you have... Update to...**
```bash
# Commands
@commands-templates/core/          â†’ library/commands/core/
@commands-templates/integration/   â†’ library/commands/integration/
@commands-templates/orchestration/ â†’ library/commands/orchestration/

# Agents
@agents-templates/                 â†’ library/agents/roles/ or library/agents/orchestration/

# Skills
@skills-templates/                 â†’ library/skills/by-category/[category]/
skills/ (for production use)       â†’ .claude/skills/ (active instances)

# Orchestration
@commands-templates/orchestration/ â†’ library/commands/orchestration/ 
@agents-templates/orchestration/   â†’ library/agents/orchestration/
@skills-templates/orchestration/   â†’ library/skills/by-category/orchestration/
templates/orchestration/           â†’ library/orchestration/
```

### âš ï¸ Import Statements

If you have Python/JavaScript code that imports from old paths:

```python
# BEFORE (will break)
from skills import multi_agent_planner

# AFTER (correct)
from .claude.skills import multi_agent_planner
```

### âš ï¸ Project References

If your CLAUDE.md or project files reference old paths:

```markdown
# BEFORE
Skills are in: @skills-templates/
Agents are in: @agents-templates/
Commands are in: @commands-templates/

# AFTER
Templates are in: library/
Active instances are in: .claude/
```

---

## Migration Steps

### Step 1: Update Your Local Repository

```bash
# Fetch latest changes
git fetch origin
git checkout main  # or your main branch

# Create backup branch (just in case)
git checkout -b backup/your-branch-before-migration
git checkout your-working-branch

# Review what changed
git diff origin/main  # to see new structure
```

### Step 2: Update Path References (Automated)

**Use this script** to automatically update references:

```bash
#!/bin/bash
# migrate.sh - Run this in your project directory

echo "ðŸ”„ Migrating path references..."

# Commands
find . -type f \( -name "*.md" -o -name "*.py" -o -name "*.js" \) \
  -exec sed -i 's|@commands-templates|library/commands|g' {} \;

# Agents
find . -type f \( -name "*.md" -o -name "*.py" -o -name "*.js" \) \
  -exec sed -i 's|@agents-templates|library/agents|g' {} \;

# Skills
find . -type f \( -name "*.md" -o -name "*.py" -o -name "*.js" \) \
  -exec sed -i 's|@skills-templates|library/skills|g' {} \;

echo "âœ… Path references updated!"
echo ""
echo "âš ï¸  Manual steps required:"
echo "1. Update CLAUDE.md manually (check for context-specific paths)"
echo "2. Review generated changes: git diff"
echo "3. Test that everything still works"
echo "4. Commit: git add -A && git commit -m 'Migrate to new path structure'"
```

**Run it**:
```bash
chmod +x migrate.sh
./migrate.sh
```

### Step 3: Manual Review

After automated migration, review changes:

```bash
# See what changed
git diff

# Look for these files specifically
cat CLAUDE.md
cat README.md
find . -name "*.yml" -path "*/.github/workflows/*"

# Any files with old-style paths?
grep -r "@commands-templates\|@agents-templates\|@skills-templates" . --include="*.md"
```

### Step 4: Update CLAUDE.md (Manual)

This is context-specific to your project. Example:

**Before**:
```markdown
## Agents

I have access to these specialist agents:
- @agents-templates/roles/architect.md
- @agents-templates/roles/builder.md
- @agents-templates/roles/validator.md

Agent skills:
- From @skills-templates/orchestration/multi-agent-planner
- From @skills-templates/orchestration/parallel-executor
```

**After**:
```markdown
## Agents

Active agents deployed in `.claude/agents/`:
- architect (using templates from library/agents/roles/architect/)
- builder (using templates from library/agents/roles/builder/)
- validator (using templates from library/agents/roles/validator/)

Active skills deployed in `.claude/skills/`:
- multi-agent-planner (template: library/skills/by-category/orchestration/multi-agent-planner/)
- parallel-executor (template: library/skills/by-category/orchestration/parallel-executor/)

To update any agent or skill:
1. Edit the template in library/
2. Test thoroughly
3. Copy updated version to .claude/
```

### Step 5: Test Everything

```bash
# Test commands
./commands/test  # or however you test

# Test agents (if applicable)
python -c "from .claude.skills import multi_agent_planner; print('OK')"

# Test imports (if you have Python code)
python -m pytest tests/ -v

# Run integration tests (if any)
bash scripts/integration-test.sh
```

### Step 6: Commit Your Changes

```bash
# Review final changes
git status
git diff

# Commit
git add .
git commit -m "Migrate to new unified library/ structure

- Update all @commands-templates/ references to library/commands/
- Update all @agents-templates/ references to library/agents/
- Update all @skills-templates/ references to library/skills/
- Update CLAUDE.md with new path structure
- All tests pass
- No functionality changes, structure only"

# Optional: tag this as a migration milestone
git tag migration/to-unified-structure
```

---

## Skills: 20 vs 31 Explanation

**Q: I have 20 skills in `skills/` but 31 in `@skills-templates/`. Which should I use?**

**A: They've been merged into library/skills/.**

The refactoring identified and merged duplicates:
- Some skills existed in both locations (now consolidated into one)
- Some were inactive (removed if obsolete, kept if useful)
- Result: ~40 production-ready + template skills in `library/skills/`

**Your active skills** (whatever you were using before) are now in `.claude/skills/`.

**Template versions** are in `library/skills/by-category/` - use these to:
- Learn how a skill works
- Customize it for your use case
- Copy it to `.claude/skills/` when ready to use

---

## Troubleshooting

### "I can't find [skill/command/agent] anymore!"

1. Search in `library/`:
   ```bash
   find library/ -name "*[search-term]*" -type f
   ```

2. Check `INDEX.md` for complete list:
   ```bash
   grep -i "[search-term]" INDEX.md
   ```

3. Ask for help in [support channel]:
   - Describe what you're trying to do
   - Share the skill/command/agent name
   - We'll help you find it and verify the migration

### "The import statement still doesn't work"

Verify the path is correct:

```bash
# Check if path exists
ls -la library/skills/by-category/[category]/[skill-name]/

# If not found, search for it
find library -name "*[skill-name]*" -type d

# Update import statement with correct path
python -c "from .claude.skills.[skill-name] import X"
```

### "GitHub Actions workflow is broken"

1. Find the workflow file:
   ```bash
   find .github/workflows -name "*.yml"
   ```

2. Update paths in the workflow:
   ```bash
   sed -i 's|@commands-templates|library/commands|g' .github/workflows/*.yml
   ```

3. Test locally:
   ```bash
   # Run workflow actions manually to verify
   ```

### "Tests are failing after migration"

1. Check for import errors:
   ```bash
   grep -r "from skills\|from @\|from templates" . --include="*.py" --include="*.js"
   ```

2. Update any found imports to use new paths

3. Run tests again:
   ```bash
   pytest -v  # or your test command
   ```

### "I'm getting 'path not found' errors"

1. Verify the file exists:
   ```bash
   ls -la [full-path-you-referenced]
   ```

2. Check for typos (especially in path names)

3. Common typo fixes:
   ```bash
   # by-category not by_category
   library/skills/by-category/  âœ…
   library/skills/by_category/  âŒ
   
   # orchestration not orchestration
   library/skills/by-category/orchestration/  âœ…
   ```

---

## New Workflow: Day-to-Day Usage

### Finding a Template

```bash
# 1. Look in INDEX.md or use find
grep "template-name" INDEX.md
# or
find library/ -name "*template-name*"

# 2. View the template
cat library/[type]/[category]/[template-name]/README.md

# 3. Understand requirements
# - Read the template documentation
# - Check dependencies
```

### Using a Template

```bash
# 1. Copy to active instances directory
cp -r library/skills/by-category/[category]/[skill-name] .claude/skills/[skill-name]

# 2. Customize (edit in .claude/, not in library/)
vim .claude/skills/[skill-name]/config.json

# 3. Test it
python -m pytest .claude/skills/[skill-name]/test.py -v

# 4. Deploy (already there, but run any startup scripts)
bash .claude/skills/[skill-name]/setup.sh  # if applicable
```

### Updating a Template

```bash
# 1. Edit in library/ (the source of truth)
vim library/skills/by-category/[category]/[skill-name]/SKILL.md

# 2. Test in library/
# (or copy to temporary location and test)

# 3. Update your active instance
cp -r library/skills/by-category/[category]/[skill-name] .claude/skills/[skill-name]

# 4. Verify active instance works
python -m pytest .claude/skills/[skill-name]/test.py -v

# 5. Commit changes
git add library/ .claude/
git commit -m "Update [skill-name] template and active instance"
```

---

## Support & Questions

### "What if my use case isn't covered by migration steps?"

- **Option A**: Check MIGRATION_GUIDE.md FAQ (below)
- **Option B**: Review STRUCTURE.md for detailed architecture
- **Option C**: Check examples/ for working implementations
- **Option D**: Ask in [support channel] with specifics

### "Where do I find [documentation type]?"

```
README.md              â†’ Overview & quick start
STRUCTURE.md           â†’ Detailed architecture
QUICK_START.md         â†’ Step-by-step guide
INDEX.md               â†’ Master index of all templates
library/*/README.md    â†’ Category-specific guides
examples/              â†’ Working implementations
docs/                  â†’ Best practices & tutorials
```

### "When was this migration?"

This migration took effect on: **[Cutover Date]**

Old paths stop working on: **[Sunset Date]** (typically 4 weeks after cutover)

---

## FAQ

### Q: Do I have to migrate right away?

**A**: Depends on your usage:
- **Using `.claude/` instances only**: Not urgent, can take your time
- **Still copying from old locations**: Migrate when convenient
- **Old paths will be removed on [Sunset Date]**: Plan migration before then

### Q: Will I lose any functionality?

**A**: No. The migration is purely organizational (moving files), not changing behavior.

### Q: Can I keep the old structure?

**A**: The old directories will be removed on [Sunset Date]. We recommend migrating sooner.

### Q: What if I have custom paths in my code?

**A**: Update them using the automated migration script, or manually update each reference.

### Q: How do I verify my migration was successful?

**A**: Run this checklist:
```bash
# 1. No old-style paths remain
grep -r "@commands-templates\|@agents-templates\|@skills-templates" . | wc -l
# Should output: 0

# 2. All tests pass
pytest -v  # or your test command

# 3. New paths work
python -c "from .claude.skills import [skill-name]"  # Should work

# 4. Documentation is clear
cat CLAUDE.md | grep library  # Should find new paths
```

### Q: What if I find a bug after migration?

**A**: 
1. Report it with: error message + full path you were using
2. We'll help you debug it
3. File issue on GitHub with details

### Q: How long does migration take?

**A**: Typically 15-30 minutes:
- Run automated script: 1 minute
- Manual CLAUDE.md review: 10-15 minutes
- Testing: 5-10 minutes
- Commit: 1 minute

### Q: Can I revert if something goes wrong?

**A**: Yes! Keep your `backup/` branch from Step 1:
```bash
git reset --hard backup/your-branch-before-migration
```

---

## Migration Timeline

| Date | Event |
|------|-------|
| [Launch Date] | New structure deployed, migration guide published |
| [Week 1] | Tools & support available, early adopters migrate |
| [Week 2-3] | Most users migrate, questions answered |
| [Week 4] | Final migration support, documentation refinement |
| [Sunset Date] | Old paths removed, migration complete |

---

## Checklist: Confirm Your Migration is Complete

Use this to verify everything is working:

- [ ] All @-prefixed paths replaced in code
- [ ] CLAUDE.md updated with new paths
- [ ] All tests passing
- [ ] .claude/ active instances are working
- [ ] library/ templates accessible
- [ ] No broken imports
- [ ] GitHub Actions workflows updated
- [ ] Documentation reviewed and current
- [ ] Team members notified of changes
- [ ] Git changes committed with clear message

---

## Next Steps

1. **Read** â†’ STRUCTURE.md (understand new architecture)
2. **Understand** â†’ Your current usage (which templates are you using?)
3. **Migrate** â†’ Use automated script + manual review
4. **Test** â†’ Verify everything works
5. **Commit** â†’ Record the migration
6. **Support** â†’ Help team members migrate

---

## Contact & Support

- **Questions?** â†’ [Support Channel]
- **Bug?** â†’ [GitHub Issues]
- **Urgent?** â†’ [Escalation Contact]
- **General Help** â†’ [Documentation]

---

**Document Control**

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-01-23 | Ready | For distribution to users |

**Last Updated**: January 23, 2026  
**Next Review**: [Sunset Date + 1 week]
