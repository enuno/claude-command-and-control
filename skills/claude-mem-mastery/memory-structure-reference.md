# memory-structure-reference.md

Reference for how Claude should structure and maintain `MEMORY.md` (and optional topic files) so project memory stays compact, useful, and easy to evolve.

This file supports the `claude-mem-coded-assistant` SKILL and assumes project‑level memory lives alongside `CLAUDE.md` in the repo root.

---

## 1. Purpose and Location

### 1.1 Purpose

`MEMORY.md` serves as:

- A **human- and agent-readable index** of important project learnings.
- A bridge between:
  - Detailed history in claude-mem.
  - Concise, actionable rules in `CLAUDE.md`.
- The first place Claude should look to avoid:
  - Re‑debugging known issues.
  - Re‑evaluating resolved design choices.
  - Forgetting critical operational constraints.

### 1.2 Recommended Layout

For this project, use:

```text
repo-root/
  CLAUDE.md          # main project instructions (entry point)
  MEMORY.md          # curated lessons and directions (index)
  .claude/
    SKILL.md
    claude-mem-usage.md
    memory-structure-reference.md
    claude-md-layout-reference.md
    example-diffs.md
```

- `MEMORY.md` lives at project root so Claude and other tools treat it as a primary memory artifact.
- Additional deep-dive memory can live in separate topic files (see §4).

---

## 2. Top-Level Structure for MEMORY.md

### 2.1 Standard Template

Claude should keep `MEMORY.md` close to the following structure:

```markdown
# Project Memory

> Curated lessons and directions synthesized from claude-mem and real work.
> Use this to avoid repeating mistakes and to keep the project healthy.

## 1. Architectural Decisions

## 2. Implementation Patterns & Anti-Patterns

## 3. Debugging Playbooks

## 4. DevOps & Operations

## 5. Open Questions / Next Directions
```

Each section should hold **compact bullets**, not long narratives. The file should be short enough to scan in 1–2 minutes (ideally a few hundred lines, not a full book).

---

## 3. Section Patterns & Examples

This section defines how Claude should format each section.

### 3.1 Architectural Decisions

Purpose:

- Capture **long-lived design choices** that affect current and future work.

Entry pattern:

```markdown
## 1. Architectural Decisions

- [YYYY-MM-DD] **Decision:** Short human-readable title.
  - Context: 1–2 sentences explaining the situation.
  - Rationale:
    - Bullet 1 (major reason).
    - Bullet 2 (trade-off or constraint).
  - Impact:
    - Bullet 1 (what should change going forward).
    - Bullet 2 (who/what is affected).
  - Source: claude-mem IDs (e.g., `mem:123, mem:241`) and/or PRs/issues.
```

Example:

```markdown
- [2026-02-20] **Decision:** Use job queue X for payouts
  - Context: Payout job concurrency was causing DB connection exhaustion.
  - Rationale:
    - Queue X gives backpressure and visibility we lacked with raw cron.
    - Native retry semantics reduce our custom retry code.
  - Impact:
    - All new payout flows must enqueue work via `PayoutQueueService`.
    - Direct cron-based payout scripts are deprecated.
  - Source: mem:452, mem:459, PR #231
```


### 3.2 Implementation Patterns & Anti‑Patterns

Purpose:

- Preserve **how** we implement things when they work well (or go wrong).

Entry pattern:

```markdown
## 2. Implementation Patterns & Anti-Patterns

- [YYYY-MM-DD] **Pattern:** Short title.
  - Applies to: modules/services/files.
  - Do:
    - Bullet 1 (positive rule).
    - Bullet 2 (positive rule).
  - Avoid:
    - Bullet 1 (what broke last time).
    - Bullet 2 (known anti-pattern).
  - Source: claude-mem IDs, PRs/issues.
```

Example:

```markdown
- [2026-02-21] **Pattern:** Retrying flaky upstream APIs
  - Applies to: `services/upstreamClient.ts`, `jobs/*`
  - Do:
    - Use `withRetry()` helper from `retry.ts` with circuit breaker enabled.
    - Log retry attempts at debug level and final failures at warn.
  - Avoid:
    - Manual `for` loops with `setTimeout` for retries.
    - Retrying non-idempotent POSTs without explicit approval.
  - Source: mem:501, mem:507, PR #239
```


### 3.3 Debugging Playbooks

Purpose:

- Capture **repeatable troubleshooting recipes** for classes of issues.

Entry pattern:

```markdown
## 3. Debugging Playbooks

- [YYYY-MM-DD] **Issue Class:** Short title.
  - Symptom:
    - Short description of what the user/system sees.
  - Root cause:
    - 1–2 sentences or bullets explaining the underlying problem.
  - Fix steps:
    - Bullet 1 (check).
    - Bullet 2 (fix).
    - Bullet 3 (verification command/test).
  - Verification:
    - Bullet list of checks/tests to confirm resolution.
  - Next time:
    - 1–3 bullets on how to avoid this issue in the future.
  - Source: claude-mem IDs, PRs/issues, runbooks.
```

Example:

```markdown
- [2026-02-18] **Issue Class:** Intermittent DB connection resets (ECONNRESET)
  - Symptom:
    - Jobs fail sporadically with ECONNRESET during heavy load.
  - Root cause:
    - Connection pool exhausted under high concurrency, with no backoff.
  - Fix steps:
    - Check DB connection usage via `db:pool:stats` dashboard.
    - Increase pool size cautiously and enable queueing.
    - Add jittered exponential backoff to connection retries.
  - Verification:
    - Load test with job runner at 2x normal volume.
    - Confirm no ECONNRESET events in logs for 30 minutes.
  - Next time:
    - Bake backoff and pooling decisions into `dbClient` abstraction.
  - Source: mem:421, mem:422, incident #17
```


### 3.4 DevOps & Operations

Purpose:

- Describe **how to run and protect** the system in production.

Entry pattern:

```markdown
## 4. DevOps & Operations

- [YYYY-MM-DD] **Topic:** Short title.
  - Environment: prod / staging / dev.
  - Rules:
    - Bullet 1 (deploy / rollback rule).
    - Bullet 2 (monitoring / alert rule).
  - Notes:
    - Extra clarifications or links to runbooks/dashboards.
  - Source: incidents, SRE notes, claude-mem IDs.
```

Example:

```markdown
- [2026-02-19] **Topic:** Safe rollout of payout engine
  - Environment: prod
  - Rules:
    - Use canary rollout at 5% → 25% → 50% → 100% over 30–60 minutes.
    - Auto-rollback if error rate doubles baseline for >5 minutes.
  - Notes:
    - See `RUNBOOK-payouts.md` for step-by-step commands and dashboards.
  - Source: mem:480, incident review 2026-02-19
```


### 3.5 Open Questions / Next Directions

Purpose:

- Track **what’s undecided** and where experiments or ADRs are needed.

Entry pattern:

```markdown
## 5. Open Questions / Next Directions

- [YYYY-MM-DD] **Question:** Short title.
  - Context:
    - 1–2 sentences on why this matters.
  - Options:
    - Option A – summary.
    - Option B – summary.
  - Next steps:
    - Bullet list of decisions or experiments needed.
  - Source: claude-mem IDs, planning docs, ADRs.
```

Example:

```markdown
- [2026-02-22] **Question:** Event-driven vs polling for payout status
  - Context:
    - Current polling loop adds load and has ~5–10 min latency on updates.
  - Options:
    - Option A – webhook-based events from provider.
    - Option B – keep polling but reduce scope and add backoff.
  - Next steps:
    - Spike both approaches in staging and compare complexity + latency.
  - Source: mem:530, DESIGN-payouts-events.md
```


---

## 4. Optional Topic Files

To keep `MEMORY.md` lean, Claude can create **topic-specific files** for deep dives and link to them.

### 4.1 Recommended Topic Files

Under the same project root or a dedicated memory directory (pick one and stick with it):

```text
repo-root/
  MEMORY.md
  mem-debugging.md
  mem-architecture.md
  mem-devops.md
  mem-api-conventions.md
```

- `MEMORY.md`:
    - High‑level index and summaries.
- Topic files:
    - Longer narratives, detailed examples, stack traces, or complex runbooks.
    - Linked from `MEMORY.md` entries.

Example link from `MEMORY.md` to a topic file:

```markdown
- [2026-02-18] **Issue Class:** Intermittent DB connection resets (ECONNRESET)
  - Symptom:
    - Jobs fail sporadically with ECONNRESET during heavy load.
  - Root cause:
    - Connection pool exhausted under high concurrency, with no backoff.
  - Fix steps:
    - See detailed runbook in `mem-debugging.md` → "ECONNRESET playbook".
  - Next time:
    - Bake backoff and pooling decisions into `dbClient` abstraction.
  - Source: mem:421, mem:422, incident #17
```


---

## 5. Maintenance & Pruning

### 5.1 When to Update

Claude should update `MEMORY.md` when:

- New decisions are made.
- Non‑trivial bugs are fixed.
- New patterns or anti‑patterns emerge.
- Significant infra / operations lessons are learned.
- Open questions are resolved (and moved into decisions).


### 5.2 When and How to Prune

If `MEMORY.md` grows too long or noisy:

- **Compress older entries**:
    - Replace multiple old entries with a **rollup** summary per section.
- **Move detail down**:
    - Push long content into topic files, keep only a link and short summary.
- **Drop obsolete items**:
    - Remove entries that:
        - Refer to removed systems.
        - Have been superseded by newer decisions.

Example rollup:

```markdown
- [2025-11 – 2026-01] **Rollup:** Early payout engine lessons
  - Context:
    - Multiple incidents around DB load and payout retries.
  - Key lessons:
    - Centralize retry logic in `retry.ts` and avoid ad-hoc loops.
    - Prefer queue-based processing over cron for high-volume flows.
  - Details:
    - See `mem-architecture.md` → "Payout engine evolution (2025-11–2026-01)".
```


---

## 6. Safety and Red Lines

Claude must **never** write the following into `MEMORY.md` or topic files:

- Raw secrets:
    - API keys, private keys, passwords, tokens.
- Sensitive identifiers:
    - Production IPs, internal hostnames, customer data.
- Full log dumps or stack traces that reveal secrets.

Instead:

- Use generic placeholders (e.g., `<PROD_DB_HOST>`).
- Reference secret management docs or Vault paths.

---

## 7. Quick Checklist for Updating MEMORY.md

When Claude proposes an update to `MEMORY.md`, it should confirm:

- [ ] Does this entry help us **avoid a repeat mistake** or **reuse a good pattern**?
- [ ] Is the entry short and structured (bullets, not walls of text)?
- [ ] Does it include a date, clear title, and relevant section?
- [ ] Does it reference relevant claude-mem IDs and/or PRs/issues?
- [ ] Could a new contributor understand and apply it within 30 seconds?
- [ ] Are there **no secrets** or sensitive details?

If the answer to any is “no,” Claude should revise before presenting the patch.

