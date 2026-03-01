# MEMORY.md – Lessons & Patterns

This file captures high-signal decisions, patterns, and operational lessons from working on the claude-command-and-control repository. Use these insights to accelerate future work and avoid repeating mistakes.

---

## Integration Pipeline Pattern

**Workflow**: Worktree → Feature Branch → PR → CI Checks → Main → Remote Push

When integrating new skills or documentation into the repository:

1. Create an isolated worktree (not on main)
2. Use `/integration-scan` to categorize incoming files
3. Use `/integration-process` to move files to target locations
4. Use `/integration-validate` to verify quality (100/100 for skills, 95+/100 for docs)
5. Use `/integration-update-docs` to automatically update README tables and indices
6. Commit with descriptive message (e.g., `docs(skills): integrate [name]`)
7. Push to remote main branch
8. Cleanup with `scripts/cleanup-integration.sh` (removes files >30 days old)

**Why**: This phased approach ensures quality, maintains audit trails, prevents Git history corruption, and keeps documentation in sync automatically.

**Example**: terraform-best-practices (Jan 29) followed this pattern: created 1 skill, generated report, updated skills/README.md count from 32→33, committed, pushed to remote.

---

## Documentation Auto-Updates

**Pattern**: Integration process automatically updates README tables when new skills are added.

- `skills/README.md`: Maintained by `/integration-update-docs`, tracks count and categories
- Main `README.md`: Pre-Built Skills table also updated automatically
- Entries inserted in alphabetical order within categories
- Skills README count reflects current repository state (now 33+ skills)

**Gotcha**: Table formatting must be preserved (pipe delimiters, blank lines). If update fails, verify markdown syntax in source tables.

---

## Skill Integration Checklist

When adding a new skill to the repository:

- ✅ Validate skill structure: YAML frontmatter (name, description, version)
- ✅ Check quality: 456+ lines for main SKILL.md, supporting docs bundled in skill folder
- ✅ Test activation: Skill discoverable via Skill tool
- ✅ Commit message: Follow `docs(skills): integrate [skill-name]` convention
- ✅ Push to main: Ensure remote is updated
- ✅ Documentation: Tables updated, count incremented

**Reference**: Terraform-best-practices example (8 HCL examples, 2600+ reference lines, Anton Babenko source attribution) shows the quality bar.

---

## File Movement & Git Tracking

**Observation**: Git recognizes skill file moves from `INTEGRATION/incoming/` to `skills/` as rename operations, preserving file history.

- Source files marked as deleted from `INTEGRATION/incoming/`
- Destination files appear as untracked in `skills/[name]/`
- Git add + commit correctly records this as movement, not deletion + creation
- This preserves full git blame and history for skill files

**Implication**: Safe to move files between directories during integration—Git history is maintained.

---

## Integration Reports as Audit Trail

**Pattern**: Each integration step generates timestamped reports in `INTEGRATION/logs/`:

- `scan-report-[TIMESTAMP].md`: File categorization and validation
- `integration-report-[TIMESTAMP].md`: Processing results, file manifest, audit trail
- `validation-report-[TIMESTAMP].md`: Quality scores (100/100 ideal), security audit, link verification
- `doc-update-report-[TIMESTAMP].md`: Documentation changes applied

**Value**: These reports provide:
- Complete audit trail of what was integrated and when
- Quality metrics for each file type
- Next steps and recommended git commands
- Proof of successful validation for compliance/review

---

## Integration Directory Maintenance

**Tool**: `scripts/cleanup-integration.sh` (280 lines, created Jan 29)

- Removes files older than configurable threshold (default: 30 days)
- Extracts dates from filenames (YYYYMMDD-HHMMSS) and file content (Integration Date, created, Generated fields)
- Supports `--dry-run` for safe preview, `--days N` for custom thresholds
- Creates deletion manifests for audit
- Cleans empty directories automatically

**Example**: Initial run freed ~1.0MB by removing 69 stale logs from Nov-Dec 2025.

**Lesson**: Run periodically to prevent INTEGRATION directory from accumulating technical debt. Can be automated in CI or scheduled tasks.

---

## Skill Quality Metrics

**Scoring Rubric** (from validation reports):

**Skills (100 points)**:
- Valid YAML frontmatter: 20 pts
- Clear description: 15 pts
- "When to Use" section: 15 pts
- Examples with real data: 20 pts
- No security issues: 30 pts

**Documentation (100 points)**:
- Structure & organization: 30 pts
- Cross-references valid: 20 pts
- Complete examples: 20 pts
- Accessibility/clarity: 20 pts
- No security issues: 10 pts

**Target**: Aim for 95+ for all integrated content.

---

## Repository Scale

- **Skills Count**: Now 33+ total (was 32 on Jan 29)
- **Skill Categories**: 9 sections (Bitcoin Mining, Development Workflow, Integration & Automation, Design & UI/UX, Content & Documentation, Data Storage, Marketing & SEO, Contribution & Sharing, Meta Skills)
- **Commands**: Located in `.claude/commands/`
- **Docs**: 17+ files in `docs/best-practices/`, plus reference guides in `docs/references/`, plus `docs/claude-reference/`

---

## Conventions & Anti-Patterns

### ✅ DO

- Prefer editing existing commands/skills in place over creating new slightly-different copies
- Use worktrees for feature work (keeps main clean)
- Keep CLAUDE.md focused on rules that change behavior (not general LLM tips)
- Organize MEMORY.md by topic (patterns, lessons, gotchas) not chronologically
- Use links in docs instead of inlining (reference supporting files on demand)

### ❌ DON'T

- Force-push to main (use PRs and CI checks instead)
- Commit secrets or credentials (use placeholders and env vars)
- Inline large checklists or examples in skill files (move to `skills/[name]/docs/` subdirectories)
- Copy raw claude-mem observations verbatim into CLAUDE.md or MEMORY.md (compress and synthesize)
- Let CLAUDE.md grow beyond ~1,500 tokens (lean on external docs)

---

## Current Session Learnings (March 1, 2026)

**Accomplished**:
1. Completed claude-mem-mastery skill integration end-to-end
2. Updated skills/README.md (added claude-mem-mastery entry)
3. Updated main README.md (added Pre-Built Skills entry)
4. Created documentation update report with audit trail
5. Created this MEMORY.md from claude-mem mining

**Integration Stats**:
- 17 files processed (1 skill + 4 supporting docs + 12 Raycast reference docs)
- All validations passed (100% for skill, 95%+ for documentation)
- 2 documentation files modified (skills/README.md, README.md)
- 0 broken links introduced
- Ready for commit to main branch

**Key Decision**: Used absolute paths in worktree file operations to avoid Git LFS pointer warnings and path resolution issues.

---

## Next Steps (When Resuming)

1. Commit the integration changes: `git add README.md skills/README.md && git commit -m "docs: integrate claude-mem-mastery skill"`
2. Push to remote main
3. Optional: Run cleanup-integration.sh to remove old log files from INTEGRATION directory
4. Optional: Archive processed integration metadata to long-term storage
5. Consider: Scheduling periodic cleanup task for INTEGRATION directory

---

**Last Updated**: March 1, 2026 (Initial creation from integration workflow)
**Next Review**: After next major integration cycle
