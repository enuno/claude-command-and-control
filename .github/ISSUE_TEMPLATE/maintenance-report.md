---
name: Maintenance Report
about: Automated repository maintenance report from monthly scans
title: '🔧 Monthly Maintenance Report - [DATE]'
labels: ['maintenance', 'automated', 'monthly-report']
assignees: ''
---

## Repository Maintenance Report

**Date:** <!-- Auto-populated by workflow -->
**Workflow:** Maintenance Scan
**Status:** ✅ Completed

### Summary

- **Total Files Analyzed:** <!-- Auto-populated -->
- **Stale Files Detected:** <!-- Auto-populated -->
- **Health Score:** <!-- Auto-populated -->

---

<!-- Full maintenance report content auto-populated by workflow -->

---

### Action Items

- [ ] Review stale files list
- [ ] Update or archive outdated content
- [ ] Refresh documentation as needed
- [ ] Apply recommended updates
- [ ] Close this issue when maintenance is complete

### Resources

- **Full Report:** Download from workflow artifacts
- **Maintenance Logs:** Available in workflow artifacts (30-day retention)
- **Command Documentation:** `.claude/commands/maintenance-scan.md`

### Next Steps

1. Review each flagged file in the report
2. For stale files, decide: update, archive, or remove
3. Update file modification times for files that are still valid
4. Create PRs for any necessary updates
5. Re-run `/maintenance-scan` to verify health score improvement

### Priority Levels

#### 🔴 High Priority (>90 days old)
Files that have not been updated in over 90 days and require immediate attention.

#### 🟡 Medium Priority (60-90 days old)
Files that should be reviewed and updated within the next 2 weeks.

#### 🟢 Low Priority (30-60 days old)
Files to keep an eye on - review at your convenience.

### Common Actions

**Update File (Still Valid):**
```bash
# Touch file to update modification time
touch path/to/file.md

# Or make actual content updates
git add path/to/file.md
git commit -m "docs: refresh [file] with latest information"
```

**Archive Outdated File:**
```bash
# Move to archive directory
mkdir -p archive/
git mv path/to/file.md archive/
git commit -m "docs: archive outdated [file]"
```

**Remove Deprecated File:**
```bash
# Remove file entirely
git rm path/to/file.md
git commit -m "docs: remove deprecated [file]"
```

### Maintenance Best Practices

1. **Keep Documentation Current:** Update docs when features change
2. **Regular Reviews:** Set calendar reminders for quarterly reviews
3. **Version Control:** Always commit changes with descriptive messages
4. **Cross-Reference:** Update related files when making changes
5. **Deprecation Notes:** Add deprecation warnings before removing content

### Metrics to Track

- [ ] Health Score: Target ≥ 95/100
- [ ] Stale File Count: Target ≤ 5
- [ ] Average File Age: Target ≤ 60 days
- [ ] Documentation Coverage: All features documented
- [ ] Link Validity: All links working

### Estimated Time

**Review:** <!-- Auto-calculated: stale_count / 10 --> hours
**Updates:** 1-2 hours per file
**Total:** <!-- Auto-calculated --> hours

---

*This issue template is used by the Maintenance Scan workflow to create monthly maintenance reports.*

**Close this issue once all maintenance tasks are complete and health score is ≥ 95/100.**
