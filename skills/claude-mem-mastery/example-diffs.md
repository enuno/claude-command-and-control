# example-diffs.md

Example before/after patches for `CLAUDE.md` and `MEMORY.md` so Claude can see what “good” edits look like and propose minimal diffs instead of wholesale rewrites.

Use these as patterns, not as literal content.

---

## 1. CLAUDE.md Diff – Promote a Lesson from MEMORY.md

### 1.1 Context

A recurring DB connection issue has been captured in `MEMORY.md` under “Debugging Playbooks”. We now want `CLAUDE.md` to include a **forward‑looking rule** so Claude avoids re‑introducing the problem.

`MEMORY.md` (excerpt):

```markdown
## 3. Debugging Playbooks

- [2026-02-18] **Issue Class:** Intermittent DB connection resets (ECONNRESET)
  - Symptom:
    - Jobs fail sporadically with ECONNRESET during heavy load.
  - Root cause:
    - Connection pool exhausted under high concurrency, with no backoff.
  - Fix steps:
    - Check DB pool stats; increase pool size cautiously.
    - Add jittered exponential backoff to connection retries.
  - Next time:
    - Use the shared db client helper with backoff instead of manual loops.
```


### 1.2 Before – CLAUDE.md (excerpt)

```markdown
## 4. Patterns & Gotchas

- Do:
  - Use repository interfaces instead of ad-hoc SQL.
- Avoid:
  - Writing complex business logic directly in controllers.
```


### 1.3 After – CLAUDE.md (excerpt)

```diff
 ## 4. Patterns & Gotchas

 - Do:
   - Use repository interfaces instead of ad-hoc SQL.
+  - Use the shared DB client helper with jittered exponential backoff for outbound DB connections.
 - Avoid:
   - Writing complex business logic directly in controllers.
+  - Implementing manual retry loops around DB calls; this caused ECONNRESET incidents under load (see MEMORY.md → "Intermittent DB connection resets").
```


### 1.4 Notes for Claude

- Only **two bullets** added, both directly derived from `MEMORY.md`.
- No history copied; just rules and a pointer back to the playbook.
- This stays within the token budget and changes future behavior.

---

## 2. CLAUDE.md Diff – Replace Stale Decision with New One

### 2.1 Context

An old architectural decision about polling is replaced by a newer event‑driven approach, already captured in `MEMORY.md` → “Architectural Decisions”.

### 2.2 Before – CLAUDE.md (excerpt)

```markdown
## 3. Current Architectural Directions

- Use a polling loop every 30 seconds to update miner status from the control plane.
- Miner state is persisted via direct writes from the polling cron job.
```


### 2.3 After – CLAUDE.md (excerpt)

```diff
 ## 3. Current Architectural Directions

-- Use a polling loop every 30 seconds to update miner status from the control plane.
-- Miner state is persisted via direct writes from the polling cron job.
+- Prefer event-driven miner state updates:
+  - The control plane publishes state changes as events; subscribers update views.
+- Polling is allowed only in diagnostics tools and must not write directly to primary state tables (see MEMORY.md → "Event-driven vs polling for payout status").
```


### 2.4 Notes for Claude

- Old guidance is **removed**, not left to conflict with new behavior.
- New content references the relevant decision in `MEMORY.md` instead of re‑explaining the entire debate.

---

## 3. MEMORY.md Diff – Add a New Debugging Playbook

### 3.1 Context

claude-mem shows a recent incident where a payout job silently failed due to misconfigured environment variables. We want a new debugging playbook entry.

### 3.2 Before – MEMORY.md (excerpt)

```markdown
## 3. Debugging Playbooks

- [2026-02-18] **Issue Class:** Intermittent DB connection resets (ECONNRESET)
  ...
```


### 3.3 After – MEMORY.md (excerpt)

```diff
 ## 3. Debugging Playbooks

 - [2026-02-18] **Issue Class:** Intermittent DB connection resets (ECONNRESET)
   ...
+
+- [2026-02-23] **Issue Class:** Payout job silently failing due to env misconfig
+  - Symptom:
+    - Payout job appears to run but no payouts are created; logs show only INFO messages.
+  - Root cause:
+    - `PAYOUTS_ENABLED` was unset in staging, defaulting to `false`.
+  - Fix steps:
+    - Confirm env vars in staging via `env:dump` command or CI configuration.
+    - Set `PAYOUTS_ENABLED=true` in staging and redeploy.
+  - Verification:
+    - Trigger a test payout and confirm records in `payouts` table and logs.
+  - Next time:
+    - Add a startup check that logs and alerts if `PAYOUTS_ENABLED` is false in non-local environments.
+  - Source:
+    - mem:612, mem:617, incident #21
```


### 3.4 Notes for Claude

- This is a **new entry**; other entries are untouched.
- It uses the standard structure from `memory-structure-reference.md`.
- It includes `Source` IDs to re‑hydrate context later via claude-mem.

---

## 4. MEMORY.md Diff – Compress Old Entries into a Rollup

### 4.1 Context

The “Architectural Decisions” section has many old entries about the early payout engine evolution. They’re still useful, but too detailed for `MEMORY.md`’s first 200 lines that load into Claude by default.

We compress them into a **rollup** and move detail to `mem-architecture.md`.

### 4.2 Before – MEMORY.md (excerpt)

```markdown
## 1. Architectural Decisions

- [2025-11-10] **Decision:** Initial polling design for payout engine
  ...
- [2025-12-01] **Decision:** Introduce job queue for payouts
  ...
- [2026-01-05] **Decision:** Split payout service into writer/reader
  ...
```


### 4.3 After – MEMORY.md (excerpt)

```diff
 ## 1. Architectural Decisions

-- [2025-11-10] **Decision:** Initial polling design for payout engine
-  ...
-- [2025-12-01] **Decision:** Introduce job queue for payouts
-  ...
-- [2026-01-05] **Decision:** Split payout service into writer/reader
-  ...
+- [2025-11 – 2026-01] **Rollup:** Early payout engine evolution
+  - Context:
+    - Multiple iterations to handle load, retries, and data consistency.
+  - Key lessons:
+    - Prefer queue-based processing over cron for payout workloads.
+    - Separate write paths from read views to protect OLTP performance.
+  - Details:
+    - See `mem-architecture.md` → "Payout engine evolution (2025-11–2026-01)" for the full history.
```


### 4.4 Notes for Claude

- Three fine‑grained decisions replaced by one rollup.
- The rollup gives enough context for behavior, with a pointer to a deeper topic file.

---

## 5. Combined Diff – Update Both MEMORY.md and CLAUDE.md

### 5.1 Context

A new architectural decision is made: “Use event‑driven updates for miner state”. It should appear in both:

- `MEMORY.md` → full decision entry.
- `CLAUDE.md` → concise rule in “Current Architectural Directions”.


### 5.2 MEMORY.md Patch (excerpt)

```diff
 ## 1. Architectural Decisions

+- [2026-02-22] **Decision:** Prefer event-driven miner state updates
+  - Context:
+    - Polling for miner state created unnecessary load and stale data during spikes.
+  - Rationale:
+    - Event-driven updates reduce database writes and improve freshness.
+    - Better aligns with how the control plane already emits events.
+  - Impact:
+    - New features must subscribe to miner state events instead of polling where feasible.
+    - Polling is now limited to diagnostics tools.
+  - Source:
+    - mem:701, mem:705, DESIGN-miner-events.md
```


### 5.3 CLAUDE.md Patch (excerpt)

```diff
 ## 3. Current Architectural Directions

 - All mining control operations should flow through the `ControlPlaneService` API; do not talk to miners directly from UI code.
-- Use a polling loop every 30 seconds to update miner status from the control plane.
+- Prefer event-driven miner state updates:
+  - Subscribe to control-plane events for miner state changes.
+  - Polling is allowed only in diagnostics tools and must not write directly to primary state tables.
```


### 5.4 Notes for Claude

- `MEMORY.md` holds the **full decision**; `CLAUDE.md` holds the **rule**.
- Both patches are small and targeted.
- This pattern is ideal for the `claude-mem-coded-assistant` SKILL.

---

## 6. Checklist for Drafting Diffs

When Claude drafts diffs for these files, it should aim for:

- **Small, focused hunks**:
    - Only modify what is necessary.
- **Preserve structure**:
    - Keep headings, ordering, and formatting stable.
- **Forward‑looking wording**:
    - Rules and patterns, not transcripts or blow‑by‑blow history.
- **Links instead of bulk text**:
    - Reference `MEMORY.md`, topic files, or docs instead of copying them.
- **No secrets**:
    - Never introduce credentials, tokens, or sensitive environment details.[web:48]

If a draft diff violates any of these, Claude should revise before presenting it.

