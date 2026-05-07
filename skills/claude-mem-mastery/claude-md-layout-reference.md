# claude-md-layout-reference.md

Guidance for how Claude should structure and maintain `CLAUDE.md` for this project so it stays small, sharp, and aligned with Anthropic’s best practices.

This file supports the `claude-mem-coded-assistant` SKILL and works together with `MEMORY.md` and claude-mem.

---

## 1. Purpose and Size Budget

### 1.1 Role of CLAUDE.md

`CLAUDE.md` is the **primary control file** for how Claude should work in this project.

It should:

- Give Claude a compact mental model of:
  - What this project is.
  - How to edit, test, and run it.
  - Key conventions and gotchas.
- Act as the **top of the memory stack**:
  - Repo‑local instructions override global ones.
  - `MEMORY.md` and claude-mem feed into `CLAUDE.md`, not the other way around.

### 1.2 Recommended Size

Based on current guidance and field experience:

- Hard upper bound: **~5,000 words** (beyond this, latency and quality degrade).
- Practical sweet spot for this project:
  - **1–3k words** (~1–1.5k tokens) for `CLAUDE.md`.
  - Enough for:
    - Project overview.
    - How to work in this repo.
    - Current architecture rules.
    - Patterns & gotchas.
    - DevOps guardrails.
    - Pointers to deeper docs.

Rule of thumb:

> “If a line in CLAUDE.md doesn’t materially change Claude’s behavior, it probably doesn’t belong here.”

---

## 2. Standard Section Layout

Claude should maintain `CLAUDE.md` using this section scaffold (with project-specific content):

```markdown
# Project Instructions for Claude

## 1. Project Overview

## 2. How to Work in This Repo

## 3. Current Architectural Directions

## 4. Patterns & Gotchas

## 5. DevOps & Safety Guardrails

## 6. Using claude-mem & MEMORY.md
```

Optionally, for large teams or specialized workflows, additional sections like “Agent Roles” or “Subprojects/Paths” can be added, but only if they significantly affect behavior.[web:97]

Below is what each section should contain.

---

## 3. Section-by-Section Guidance

### 3.1 Project Overview

Purpose:

- Give Claude a quick mental model of the project’s **intent, stack, and constraints**.

Recommended content:

```markdown
## 1. Project Overview

- What this project is (1–2 bullets).
- Core tech stack (frontend, backend, data stores, infra).
- Key business or technical constraints (e.g., latency, throughput, compliance).
```

Example:

```markdown
## 1. Project Overview

- This is a modular, liquid‑cooled Bitcoin mining orchestration system with a REST + gRPC control plane.
- Backend: Go + PostgreSQL, infra via Terraform + Kubernetes on green‑energy sites.
- Hard constraints: no mainnet RPC calls from test environments, minimize downtime for active miners.
```


### 3.2 How to Work in This Repo

Purpose:

- Define **day‑to‑day workflow expectations** (style, testing, commands).

Recommended content:

```markdown
## 2. How to Work in This Repo

- Code style: pointers to `.claude/rules` or existing style docs.
- Testing: commands and expectations.
- Branching & PR workflow: brief.
- Any critical local setup (if not covered elsewhere).
```

Example:

```markdown
## 2. How to Work in This Repo

- Code style:
  - Follow `.clauderules/code-style.md` for formatting and naming.
  - Keep functions small and pure where practical.
- Testing:
  - Run `npm test` for unit tests and `npm run test:integration` before proposing large changes.
  - Do not skip tests unless user explicitly requests it.
- Git & PRs:
  - Target feature branches, never commit directly to `main`.
  - Keep PRs focused on a single concern.
```

**Important**

- Use **links/pointers**, not full guides:
    - E.g. `See .clauderules/testing.md for details` instead of duplicating test matrix.


### 3.3 Current Architectural Directions

Purpose:

- Expose **current, high‑impact architectural rules** derived from `MEMORY.md` and actual decisions.[web:115]

Recommended content:

```markdown
## 3. Current Architectural Directions

- 3–7 bullets capturing current major decisions.
- Each bullet should be a forward-looking rule, not a history lesson.
- Reference source docs or MEMORY.md sections when needed.
```

Example:

```markdown
## 3. Current Architectural Directions

- All mining control operations should flow through the `ControlPlaneService` API; do not talk to miners directly from UI code.
- Use event-driven updates for miner state; polling is allowed only in diagnostics tools.
- Persist telemetry into `metrics_*` tables, not transactional tables, to keep OLTP loads stable.
- When adding new services, expose gRPC first and layer REST on top for external clients.
```


### 3.4 Patterns & Gotchas

Purpose:

- Highlight **frequent patterns and traps** so Claude doesn’t repeat mistakes.

Recommended content:

```markdown
## 4. Patterns & Gotchas

- Do / Avoid bullets for recurring implementation patterns.
- Short, specific, and tied to modules or file paths.
- Derived from MEMORY.md’s “Patterns & Anti‑Patterns” and “Debugging Playbooks”.
```

Example:

```markdown
## 4. Patterns & Gotchas

- Do:
  - Use the shared `withRetry` helper for any outbound network calls.
  - Capture miner IDs as UUIDs, not integers, throughout the codebase.
- Avoid:
  - Writing raw SQL in handlers; always go through the repository interfaces.
  - Hardcoding RPC endpoints; use configuration with clear environment separation.
- Debugging:
  - If you see ECONNRESET on DB connections, check MEMORY.md → "Intermittent DB connection resets" for the playbook.
```


### 3.5 DevOps & Safety Guardrails

Purpose:

- Make sure Claude doesn’t break prod and understands key operational constraints.

Recommended content:

```markdown
## 5. DevOps & Safety Guardrails

- Critical deploy, rollback, and environment rules.
- Things Claude must never do without explicit approval.
- Pointers to runbooks or infra docs.
```

Example:

```markdown
## 5. DevOps & Safety Guardrails

- Environments:
  - Local and staging are safe for schema changes; production changes require human approval.
- NEVER:
  - Run destructive DB operations (`DROP`, `TRUNCATE`, bulk `DELETE`) in production without explicit user confirmation.
  - Modify Terraform or Kubernetes manifests for production without a plan and review.
- Deploys:
  - Use canary rollout for new miner firmware; see RUNBOOK-deploy-miners.md for commands and checks.
```


### 3.6 Using claude-mem & MEMORY.md

Purpose:

- Teach Claude **how to use memory**, not just what the project is.[web:94]

Recommended content:

```markdown
## 6. Using claude-mem & MEMORY.md

- Remind Claude to query claude-mem before re-solving past problems.
- Point to MEMORY.md as the first place to look for lessons.
- Briefly summarize the search → timeline → get_observations pattern.
```

Example:

```markdown
## 6. Using claude-mem & MEMORY.md

- Before debugging or redesigning a feature, search claude-mem for past decisions, bugfixes, and discoveries about that area.
- Use MEMORY.md as the curated index of lessons:
  - Start with sections 1 (Architectural Decisions) and 2 (Patterns & Anti‑Patterns).
- When you learn something new:
  - Update MEMORY.md with concise bullets, then refresh this file’s sections 3–5 if behavior needs to change.
```


---

## 4. Progressive Disclosure & External Docs

To keep `CLAUDE.md` lean, Claude should:

- **Link out** instead of inlining full content:
    - `.clauderules/code-style.md`
    - `.clauderules/testing.md`
    - `MEMORY.md` sections
    - `docs/*.md`, runbooks, API specs, ADRs
- Use simple phrases like:
    - “See `.clauderules/testing.md` for the full test matrix.”
    - “See `mem-debugging.md` for detailed ECONNRESET playbook.”

This lets Claude open additional context only when needed, honoring **progressive disclosure**.

---

## 5. Maintenance Rules

### 5.1 When to Update CLAUDE.md

Claude should propose updates when:

- A **new architectural decision** changes how future work should be done.
- A **recurring bug** leads to a stable pattern or anti‑pattern.
- DevOps/infra rules change (deploy process, environment constraints).
- `MEMORY.md` gains high‑impact entries that merit promotion into `CLAUDE.md`.


### 5.2 How to Update

Claude must:

- **Read current CLAUDE.md** and estimate its size.
- Select only **high‑signal** content from MEMORY.md and other docs.
- Convert history into **forward‑looking rules**.
- Propose **minimal diffs**, not wholesale rewrites.
- Respect the ~1–1.5k token budget for this project and avoid adding fluff.

If `CLAUDE.md` starts to feel crowded:

- Remove outdated sections (e.g., old stack choices no longer relevant).
- Merge overlapping bullets.
- Move deep detail into supporting docs and leave a link.

---

## 6. Quick Checklist for Claude

Before presenting changes to `CLAUDE.md`, Claude should confirm:

- [ ] Is the file roughly within the **1–3k word** / ~1–1.5k token range?
- [ ] Does each section follow the layout in §2–3?
- [ ] Does every bullet either:
- Change how Claude behaves, or
- Call out a real gotcha or rule?
- [ ] Are detailed docs referenced, not inlined (progressive disclosure)?
- [ ] Are there no secrets, credentials, or environment-specific tokens?
- [ ] Are new rules consistent with MEMORY.md and the current codebase?

If not, Claude should revise the draft before proposing a patch.

