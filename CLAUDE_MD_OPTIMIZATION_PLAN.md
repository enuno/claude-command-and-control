# CLAUDE.md Optimization Plan

**Goal:** Reduce CLAUDE.md from ~64KB (1,500 lines) to below 40k tokens while maintaining agent effectiveness

**Architecture:** Progressive disclosure pattern - keep essential project context and trigger tables in CLAUDE.md, externalize detailed documentation to `/docs/claude-reference/` files that agents load on-demand

**Tech Stack:** Markdown, git worktrees, progressive disclosure patterns

---

## Current State Analysis

**File Size:** 64KB, 1,500 lines, ~7,500 words
**Estimated Tokens:** ~40-50k tokens (needs verification)
**Target:** < 40k tokens (20-30% reduction required)

**Largest Sections (candidates for externalization):**
1. GitHub Actions Automation: 180 lines (1191-1371)
2. Observability and Monitoring: 151 lines (719-870)
3. Advanced Orchestration Patterns: 139 lines (580-719)
4. Hooks for Quality Assurance and Policy Enforcement: 134 lines (72-206)
5. Compliance and Regulatory Alignment: 92 lines (206-298)
6. Quick Reference: 88 lines (1103-1191)
7. Enhanced Documentation References: 84 lines (1390-1474)
8. Skills Development Standards: 77 lines (870-947)

**Research Findings:**
- 50-90% token reduction achievable with progressive disclosure
- Skills-based approach: 85-90% reduction per conversation
- Keep CLAUDE.md at 150-500 lines for optimal performance
- U-shaped attention pattern: beginning/end content processed best
- @ file references are NOT lazy-loaded (avoid them)

---

## Testing Plan

**Verification Strategy:**

1. **Token Count Verification**
   - Measure current token count of CLAUDE.md using Claude API or approximation
   - After optimization, verify token count is < 40k
   - Document reduction percentage

2. **Functionality Verification**
   - Verify all internal links work correctly
   - Ensure external reference files are created
   - Check that all workflows mentioned in docs are still accessible
   - Verify Skills remain discoverable

3. **Completeness Verification**
   - Ensure no content is lost (all content either in CLAUDE.md or externalized)
   - Verify core principles and project standards remain clear
   - Check that common workflows are still easily discoverable

4. **Agent Performance Testing**
   - Test that agents can still find orchestration patterns
   - Verify compliance guidance remains accessible
   - Check that Skills discovery works
   - Ensure hooks documentation is findable

NOTE: I will verify all references work before finalizing the optimization.

---

## Implementation Steps

### Phase 1: Setup and Baseline (5 min)

**Step 1:** Create reference documentation directory
```bash
mkdir -p docs/claude-reference
```

**Step 2:** Backup current CLAUDE.md
```bash
cp CLAUDE.md CLAUDE.md.backup
```

**Step 3:** Measure current token count (estimate)
```bash
# Approximate: word count * 1.3 = token count
wc -w CLAUDE.md
# Document baseline
```

### Phase 2: Externalize Large Sections (20-30 min)

**Step 4:** Create GitHub Actions reference document
- Extract "GitHub Actions Automation" section (180 lines)
- Create `docs/claude-reference/github-actions.md`
- Replace section with 3-5 line summary + link
- Estimated savings: ~175 lines

**Step 5:** Create Advanced Orchestration reference
- Extract "Advanced Orchestration Patterns" section (139 lines)
- Create `docs/claude-reference/advanced-orchestration.md`
- Replace with summary table + link to existing doc (it already references `docs/best-practices/15-Advanced-Orchestration-Patterns.md`)
- Estimated savings: ~130 lines

**Step 6:** Create Observability reference
- Extract "Observability and Monitoring" section (151 lines)
- Create `docs/claude-reference/observability.md`
- Replace with 5-10 line summary + link
- Estimated savings: ~140 lines

**Step 7:** Create Hooks reference
- Extract "Hooks for Quality Assurance and Policy Enforcement" section (134 lines)
- Create `docs/claude-reference/hooks-overview.md`
- Replace with 10-15 line summary + link (already references `docs/best-practices/05-Testing-and-Quality-Assurance.md`)
- Estimated savings: ~120 lines

**Step 8:** Create Compliance reference
- Extract "Compliance and Regulatory Alignment" section (92 lines)
- Create `docs/claude-reference/compliance.md`
- Replace with 5-10 line summary + link
- Estimated savings: ~85 lines

**Step 9:** Consolidate Skills documentation
- "Skills Development Standards" section already references templates
- Compress to just trigger table + link to `docs/best-practices/08-Claude-Skills-Guide.md`
- Estimated savings: ~60 lines

**Step 10:** Streamline Quick Reference
- "Quick Reference" section has redundant examples
- Keep only command list, move workflow examples to separate doc
- Create `docs/claude-reference/workflow-examples.md`
- Estimated savings: ~50 lines

**Step 11:** Compress Enhanced Documentation References
- Section lists documents that have been enhanced
- Replace with simple bullet list + links to actual docs
- Estimated savings: ~70 lines

### Phase 3: Optimize Remaining Content (10-15 min)

**Step 12:** Compress code examples
- Replace verbose bash/python examples with minimal versions
- Link to full examples in reference docs
- Estimated savings: ~50 lines

**Step 13:** Consolidate redundant sections
- Identify overlapping content between sections
- Merge or cross-reference
- Estimated savings: ~30 lines

**Step 14:** Apply progressive disclosure to Command/Agent standards
- Keep trigger tables and essential patterns
- Move detailed specifications to references
- Estimated savings: ~40 lines

### Phase 4: Verification (5-10 min)

**Step 15:** Verify all internal links work
```bash
# Check for broken internal references
grep -n '\[.*\](.*\.md' CLAUDE.md
# Manually verify each link resolves correctly
```

**Step 16:** Verify external reference files exist
```bash
# List all reference docs that should exist
ls -lh docs/claude-reference/
```

**Step 17:** Measure final token count
```bash
wc -w CLAUDE.md
# Calculate: words * 1.3 = estimated tokens
# Verify < 40k
```

**Step 18:** Test agent accessibility
- Verify Skills are discoverable
- Check orchestration patterns are findable
- Ensure compliance guidance is accessible
- Test hooks documentation is reachable

### Phase 5: Documentation (5 min)

**Step 19:** Update CHANGELOG.md
- Document optimization changes
- List externalized sections
- Note token reduction achieved

**Step 20:** Create optimization summary
- Document before/after metrics
- List all new reference files created
- Provide migration notes if needed

---

## Estimated Token Reduction

**Conservative Estimate:**
- Current: ~40-50k tokens
- Externalized content: ~800 lines
- Remaining: ~700 lines
- Target: ~28k tokens (30-40% reduction)
- **Result: Below 40k threshold ✓**

**Optimistic Estimate:**
- Additional compression: ~100 lines
- Remaining: ~600 lines
- Target: ~24k tokens (50% reduction)
- **Result: Significantly below threshold ✓**

---

## Edge Cases and Considerations

**Edge Case 1: Circular References**
- **Risk:** External docs reference CLAUDE.md which references external docs
- **Mitigation:** Ensure reference hierarchy is one-way (CLAUDE.md → references only)

**Edge Case 2: Lost Context**
- **Risk:** Critical information becomes harder to find
- **Mitigation:** Keep comprehensive table of contents and clear links

**Edge Case 3: Agent Performance Degradation**
- **Risk:** Agents struggle to find information
- **Mitigation:** Test common workflows after optimization, adjust if needed

**Edge Case 4: Broken Links**
- **Risk:** Internal references break during reorganization
- **Mitigation:** Verify all links before committing (Step 15)

**Edge Case 5: Documentation Drift**
- **Risk:** Externalized docs become stale
- **Mitigation:** Add references to maintenance schedule

**Edge Case 6: @ Reference Confusion**
- **Risk:** Users might add @ references expecting lazy loading
- **Mitigation:** Add note in CLAUDE.md about NOT using @ for references

---

## Questions and Areas Requiring Clarity

**Question 1:** Should we preserve ALL content or is some truly redundant?
- **Context:** Some sections like "Enhanced Documentation References" are meta-documentation about past integration work
- **Recommendation:** Archive historical integration notes, keep only current state

**Question 2:** How aggressive should compression be?
- **Context:** Could go minimal (150-300 lines) or moderate (500-700 lines)
- **Recommendation:** Target 500-600 lines for balance between brevity and usability

**Question 3:** Should external references use relative or absolute paths?
- **Context:** Git worktrees may affect path resolution
- **Recommendation:** Use relative paths from repository root: `docs/claude-reference/`

**Question 4:** Should we create a Skills-based system for loading these references?
- **Context:** Could create Skills that load specific reference docs on demand
- **Recommendation:** Phase 2 work - start with simple links, evolve to Skills if needed

**Question 5:** Should the optimization be versioned?
- **Context:** Major restructuring might break existing workflows
- **Recommendation:** Yes - bump CLAUDE.md to version 3.1.0 with clear changelog

---

## Testing Details

**Behavior Testing:**
1. Agent can discover available Skills from CLAUDE.md
2. Agent can find orchestration patterns through references
3. Agent can access compliance guidelines through links
4. Agent can locate hooks documentation through references
5. Common workflows remain accessible within 1-2 steps

**Verification Testing:**
1. All internal markdown links resolve correctly
2. All reference files exist in documented locations
3. Token count is < 40k (verified via word count * 1.3)
4. No content is lost (diff between CLAUDE.md.backup externalized files)
5. File size reduced by 30-50%

---

## Implementation Details

1. **Progressive Disclosure Pattern:** Keep trigger tables and summaries, externalize details
2. **Directory Structure:** `/docs/claude-reference/` for optimization-specific docs
3. **Link Format:** Use relative paths without @ prefix to avoid eager loading
4. **Content Preservation:** All content preserved, just reorganized
5. **Version Bump:** 3.0.0 → 3.1.0 (minor version for non-breaking optimization)
6. **Backward Compatibility:** All existing references still work via links
7. **U-Shaped Attention:** Place most critical context at beginning and end
8. **External References:** 6-8 new reference files in `/docs/claude-reference/`
9. **Maintenance:** Add reference files to documentation maintenance scan
10. **Validation:** Verify links before commit, test agent accessibility after

---

## Questions

1. **Preservation vs Deletion:** Should we preserve ALL content including meta-documentation about past integrations, or archive some historical notes?

2. **Compression Level:** How minimal should CLAUDE.md be? Target 150-300 lines (aggressive) or 500-700 lines (moderate)?

3. **Skills Evolution:** Should we create Skills for loading reference docs on-demand, or start with simple markdown links?

4. **Version Numbering:** Is 3.0.0 → 3.1.0 appropriate for this optimization, or should it be 3.0.0 → 4.0.0 for major restructuring?

5. **Metrics Collection:** Should we add instrumentation to track which reference docs are accessed most frequently for future optimization?

---
