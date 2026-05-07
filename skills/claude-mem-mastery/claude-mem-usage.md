# claude-mem-usage.md

Guidance for Claude on how to use the claude‑mem MCP tools efficiently to learn from past work, update MEMORY.md, and improve CLAUDE.md.

This file is a **reference** for the `claude-mem-coded-assistant` SKILL. It assumes the claude-mem MCP server is already installed, running, and connected.

---

## 1. Mental Model

claude-mem gives Claude **project memory** across sessions via MCP tools.

- It stores:
  - Observations (decisions, bugfixes, discoveries, refactors).
  - Narratives, facts, concepts, and related files.
- It exposes **three core tools** that follow a 3‑layer, progressive‑disclosure workflow:
  1. `search` → fast index view (IDs, titles, types, concepts, file paths).
  2. `timeline` → chronological context around interesting IDs or queries.
  3. `get_observations` → full details for **only** the IDs you care about.

Think of it as:

> “Index and filter first, then fetch details for just the important parts.”

This is ~10x more token‑efficient than pulling history directly.

---

## 2. Available MCP Tools

The exact schema may vary slightly by version, but conceptually claude-mem exposes:

### 2.1 `search` – Index Search

**Purpose**

- Get a compact list of relevant observations, without loading full narratives.

**Typical parameters** (may be named slightly differently depending on implementation):

- `query` (string): Text query; more specific is better (e.g., `"db connection timeout"`, `"bitcoin payout scheduler"`).
- `type` (string or array): Filter by observation type, e.g.:
  - `"decision"`, `"bugfix"`, `"refactor"`, `"discovery"`, `"change"`, `"gotcha"`, `"feature"`, etc.[web:51]
- `project` (string): Project name / repo key, if supported.
- `orderBy` (string): Sorting, usually `"date_desc"` (newest first) or `"date_asc"`.
- `limit` (number): Max results (start small: 5–20).

**Returns** (index view, low token cost):

- `id` – Observation ID.
- `type` – Classification (`decision`, `bugfix`, etc.).
- `title` / `summary`.
- `createdAt` / date.
- `concepts` / `tags`.
- `files` / `paths`.

### 2.2 `timeline` – Chronological Context

**Purpose**

- Understand what was happening **before and after** an observation or around a query.

**Typical parameters**:

- `anchor` (number): Observation ID to center on.
- `query` (string): Alternative way to auto‑find an anchor if you don’t have an ID.
- `depth_before` (number): # items before anchor (default ~3–5, max ~20).
- `depth_after` (number): # items after anchor (default ~3–5, max ~20).
- `project` (string): Project filter.

**Returns**

- A chronological list of:
  - Observations.
  - Sessions / prompts (implementation‑dependent).
- Gives narrative arc: what led up to a discovery/bug, what happened next.

### 2.3 `get_observations` – Full Details

**Purpose**

- Fetch **complete** details for a **small set** of selected IDs.

**Typical parameters**:

- `ids` (array<number>, required): Observation IDs selected from `search` + `timeline`.
- `orderBy` (string): `"date_desc"` (default) or `"date_asc"`.
- `limit` (number, optional): Max observations to return.
- `project` (string, optional): Project filter.

**Returns**

Full observation objects (~500–1000 tokens each) including:

- Title, subtitle.
- Narrative / description.
- Extracted facts and concepts.
- Related files / paths.
- Timestamps and other metadata.

**Important**

- Always **batch** IDs: `get_observations(ids=[...])` instead of one call per ID.
- Only call this for items you’ve already filtered as important.

---

## 3. Core Workflow Pattern

Claude should always use claude-mem with a **3‑step progressive disclosure** workflow:

> **Step 1 – `search` → Step 2 – `timeline` → Step 3 – `get_observations`**

This minimizes wasted tokens and keeps context sharp.

### 3.1 Step 1 – Search (Index First)

**Goal**

- Find candidate observations relevant to the current task, **cheaply**.

**Example strategies**:

- When revisiting a feature:
  - `query="feature-name"` + `project="<repo-or-project-key>"`.
- When debugging:
  - `query="error message substring"` or `"db connection timeout"`.
- When looking for design decisions:
  - `query="payments architecture"` + `type="decision"`.

**Best practices**:

1. Start with **small `limit`** (3–10), then expand if needed.
2. Filter by:
   - `type` (decision/bugfix/refactor/gotcha).
   - `project` (current repository).
3. Skim index fields only:
   - IDs, types, titles, concepts, files.

**What to look for**

- Items that:
  - Match current file paths or modules.
  - Are marked as decisions / gotchas / trade‑offs.
  - Mention current infra / services / APIs.

### 3.2 Step 2 – Timeline (Context Around Candidates)

**Goal**

- Understand the **story** around promising IDs.

**How**

- For a shortlist of IDs from `search`:
  - Call `timeline(anchor=<id>, depth_before=3, depth_after=3, project="<project>")`.
- Or:
  - `timeline(query="keyword", depth_before=2, depth_after=2, project="<project>")` if you don’t have an ID yet.

**Use timeline to:**

- See the lead‑up to a bug/discovery:
  - What attempts failed?
  - What context was loaded?
- See what happened after:
  - Did a fix work?
  - Were there follow‑up changes?

**Outcome**

- A smaller set of **truly relevant** IDs for `get_observations`.

### 3.3 Step 3 – Get Observations (Details Only for Filtered IDs)

**Goal**

- Pull full details for **just the important observations**.

**How**

- After reviewing `search` + `timeline`, pick IDs that:
  - Changed architecture / contracts.
  - Fixed non‑trivial bugs.
  - Defined important patterns or gotchas.
- Call:
  - `get_observations(ids=[id1, id2, id3], orderBy="date_desc", project="<project>")`.

**What to extract**

From each observation, Claude should pull:

- Problem / context.
- Root cause and solution.
- Trade‑offs and rationale.
- Files / services / modules involved.
- Any explicit “next time do X instead of Y” guidance.

These are then **summarized** into `MEMORY.md`, not pasted verbatim.

---

## 4. Using claude-mem to Maintain MEMORY.md

This section connects claude-mem usage to `MEMORY.md` maintenance.

### 4.1 When to Update MEMORY.md

Claude should propose `MEMORY.md` updates when:[web:51][web:55][web:64]

- A significant **design or architecture decision** is made.
- A non‑trivial **bug** is diagnosed and fixed.
- A **refactor** or **infra change** alters how work should be done.
- A recurring pattern / gotcha is discovered (e.g., flaky upstream, schema pitfalls).
- Daily memory maintenance for active repos.

### 4.2 What Goes Into MEMORY.md

From `get_observations` results, Claude should **compress** into:

- **Architectural decisions**
  - Codable as: Date + Decision + Context + Rationale + Impact + Source IDs.
- **Implementation patterns & anti‑patterns**
  - “Do” and “Avoid” bullet lists.
- **Debugging playbooks**
  - Symptom → Root cause → Fix → Verify → Next time.
- **DevOps / ops rules**
  - Deploy flow, rollback triggers, monitoring lessons.
- **Open questions**
  - Unresolved design choices, hypotheses to test.

Each entry should list **source IDs** (e.g., `mem:123, mem:456`) so you can re‑hydrate context later via claude-mem.

### 4.3 What Does *Not* Belong in MEMORY.md

- Raw observation narratives from claude-mem.
- Full stack traces or logs (unless extremely compact and reusable).
- Secrets, tokens, private keys, specific IPs, or credentials.
- One‑off trivia that won’t change future behavior.

---

## 5. Using claude-mem to Improve CLAUDE.md

Claude uses `MEMORY.md` (which is fed by claude-mem) to keep `CLAUDE.md`:

- Small (~1–1.5k tokens).
- Focused on **rules that matter**.
- Up‑to‑date with real project experience.

### 5.1 Flow

1. Use claude-mem workflow (search → timeline → get_observations) when:
   - Starting new work on a feature/module.
   - Seeing errors that feel familiar.
2. Update `MEMORY.md` with new lessons.
3. Periodically refresh `CLAUDE.md` by:
   - Reading `MEMORY.md` sections.
   - Pulling only active, high‑impact rules.
   - Dropping outdated or superseded instructions.

### 5.2 When to Prefer claude-mem vs. Repo Search

Claude should:

- Prefer **claude-mem** when:
  - Looking for **reasoning**, trade‑offs, and bug stories.
  - Wanting to avoid re‑debugging the same issue.
  - Searching across sessions, even if code moved.[web:78][web:88]
- Prefer **file search / code grep** when:
  - You need exact definitions, signatures, or current implementations.

---

## 6. Best Practices & Anti‑Patterns

### 6.1 Best Practices

- **Index first, details later**:
  - Always start with `search`, then `timeline`, then `get_observations`.
- **Filter aggressively**:
  - Use types, project, and specific queries to avoid noisy results.
- **Batch fetch**:
  - Use `get_observations(ids=[...])` with multiple IDs at once.
- **Align with files**:
  - Prefer observations that reference the same files/modules you are modifying.
- **Feed curated summaries into MEMORY.md**:
  - Use claude-mem for depth, but keep `MEMORY.md` lean and structured.

### 6.2 Anti‑Patterns (Avoid These)

- Calling `get_observations` on many IDs without prior filtering.
- Using `timeline` with large depths (e.g., 20/20) by default.
- Copying observation narratives verbatim into `MEMORY.md` or `CLAUDE.md`.
- Treating claude-mem as a replacement for code search.
- Storing secrets or environment‑specific credentials anywhere in the memory system outputs.

---

## 7. Example Scenarios

### 7.1 Re‑debugging a Known Error

1. Notice an error: `"ECONNRESET during payout job"`.
2. Call `search(query="ECONNRESET payout", type="bugfix", project="<project>", limit=5)`.
3. For relevant IDs, call `timeline(anchor=<id>, depth_before=3, depth_after=3, project="<project>")`.
4. Select 1–3 IDs and call `get_observations(ids=[...])`.
5. Update `MEMORY.md` “Debugging Playbooks” with a concise recipe:
   - Symptom, root cause, fix, verification, next time.
6. If this changes how devs should work, update `CLAUDE.md` “Patterns & Gotchas”.

### 7.2 Revisiting a Feature Months Later

1. `search(query="dark mode toggle", type=["feature","decision"], project="<project>", orderBy="date_asc")`.
2. Use `timeline` to see the feature’s evolution.
3. `get_observations` for key milestones.
4. Summarize any critical constraints or decisions into `MEMORY.md` → "Architectural Decisions".
5. Ensure `CLAUDE.md` reflects current rules (e.g., “Dark mode state must be stored in X, not Y”).

---

## 8. Quick Checklist for Claude

When using claude-mem in this repo, Claude should:

- [ ] Start with `search` using a precise query and types.
- [ ] Use `timeline` around promising IDs to understand context.
- [ ] Batch `get_observations` for only the most relevant IDs.
- [ ] Extract **lessons**, not transcripts.
- [ ] Update `MEMORY.md` with concise, structured entries.
- [ ] Periodically refresh `CLAUDE.md` from `MEMORY.md`, respecting the size budget.
- [ ] Never store secrets or raw logs in these files.

If these boxes are checked, claude-mem is being used correctly and efficiently.

