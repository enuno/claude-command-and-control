# Claude Dispatch – Mining & Infra Ops Quickstart

Use Dispatch as a remote control for your Cowork-based NOC brain: log analysis, incident triage, and reporting from your phone while rigs and clusters run. [x](https://x.com/heynavtoor/status/2034679349157536233)

## Prerequisites

- Claude Desktop on your primary NOC / jump host (March 2026 Dispatch release). [x](https://x.com/heynavtoor/status/2034679349157536233)
- Claude mobile app (iOS/Android) on your phone. [x](https://x.com/heynavtoor/status/2034679349157536233)
- Paid Claude plan with Cowork + relevant connectors (Git, email, tickets, docs, Slack/Discord, etc.). [x](https://x.com/heynavtoor/status/2034679349157536233)
- Cowork configured on the NOC box with:  
  - Context files (runbooks, environment overviews, topology maps, escalation policies). [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Skills for log analysis, incident triage, report generation, and change summaries. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## One-time Setup on NOC Host

1. **Enable Dispatch** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - On the NOC / monitoring machine, open Claude Desktop → **Cowork** → **Dispatch**.  
   - Click **Get started**.  
   - Enable:  
     - “Allow file access” (runbooks, configs, log exports, infra docs).  
     - “Keep computer awake while Dispatch is active” (or handle via OS power profile).  

2. **Pair Phone to NOC Host** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - On desktop, leave QR code visible.  
   - On mobile, open Claude app → tap **Dispatch** → scan QR.  
   - Confirm the single persistent Dispatch thread appears on both.  

3. **Connectivity Smoke Test** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - From phone: `What infra and mining folders/logs can you see right now?`  
   - Verify it lists your mining, infra, and logs directories.  
   - If not, re-check Dispatch file access on desktop. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Recommended Global Instructions (Infra-Specific)

In Cowork Global Instructions, add something like: [x](https://x.com/heynavtoor/status/2034679349157536233)

> When receiving a message via Dispatch, assume the context is mining and infrastructure operations.  
> 1) Always restate the task,  
> 2) Ask for clarification if any system, site, or environment is ambiguous,  
> 3) Never perform destructive operations; limit yourself to analysis, summaries, and draft responses or runbooks.

This keeps remote, terse phone commands safe and predictable. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Core Dispatch Workflows for Mining / Infra

### 1. Overnight Miner & Node Health Summary

Run as you wake up or between meetings.

- `Scan the latest overnight log exports for my mining fleet and summarize any anomalies, offline rigs, hashrate drops, or thermal issues. Prioritize by impact.`  
- `Summarize Grafana/Prometheus exports from the last 8 hours for power usage, temp, and hashrate per pod. Highlight anything outside normal bands.`  

Requires: log exports and metrics snapshots written to a known folder, plus a “mining-health-summary” skill. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 2. Incident Triage While Away From Keyboard

For pager pings or NOC alerts when you are not at a terminal.

- `Using the most recent alert JSON from Alertmanager and associated logs, triage the incident: probable root cause, blast radius, immediate mitigations, and what to check first when I'm back at a keyboard.`  
- `Review the last 50 lines of each incident log for pod TH-03 and tell me if this looks like power, cooling, network, or ASIC failure.`  

Claude stays read-only; you apply actions when you are back on a shell. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 3. Log & Config Diffs

Use Dispatch to get human-readable diffs and change impact notes.

- `Diff yesterday's nginx / reverse-proxy config snapshot against today's and summarize functional changes, with a focus on mining API and monitoring endpoints.`  
- `Review the last two Ansible/Terraform run logs and list infrastructure changes that could affect mining uptime, latency to pools, or cooling systems.`  

You can bind these into a “change-diff-analyzer” skill. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 4. Runbook and SOP Lookup

Turn Dispatch into a pocket runbook index.

- `Find the incident runbook for "stratum disconnects on site MX-02" and summarize the first three remediation steps.`  
- `Search my runbooks for anything related to "immersion cooling leak" and give me the key checks and safety steps.`  

This relies on context files and a well-tagged runbook directory. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 5. Fleet & Site Reporting

Have it prep reports while you drive or walk.

- `Using yesterday's CSV exports, generate a concise report: hashrate, uptime, power usage effectiveness, and revenue per pod for all sites. Format as a markdown brief for investors.`  
- `Create a daily NOC report summarizing mining incidents, resolved tickets, and any config changes applied in the last 24 hours.`  

You can later paste the generated report into Notion, email, or your internal portal. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 6. Change Impact and Risk Notes

For planned maintenance or config changes.

- `Given the planned firmware update described in firmware_update_plan.md, analyze potential risks to uptime, cooling budgets, and power draw. Propose a rollback and validation checklist.`  
- `Review the new BGP / WAN design doc and summarize any single points of failure that could isolate a mining site from pools.`  

Great for sanity checks before you approve a change from your phone. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Reliability & Safety Practices for Ops

- Keep Dispatch tasks **read-only and analysis-oriented**: summarize, classify, diff, prioritize, recommend. [x](https://x.com/heynavtoor/status/2034679349157536233)
- Funnel destructive actions through human review (you or on-call) before they hit Ansible/Terraform/Kubernetes. [x](https://x.com/heynavtoor/status/2034679349157536233)
- For every high-value workflow (health summary, incident triage, daily report), run it locally a few times while watching the desktop until it is stable, then treat it as a standard Dispatch command. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Sample Daily Ops Routine (Dispatch-Centric)

- **Morning (before terminal):**  
  - `Summarize last night's mining and infra incidents, hashrate anomalies, and any nodes or pods that need manual intervention today. Output as a prioritized list.`  

- **Midday (between site visits / meetings):**  
  - `Generate a quick status brief for partners: current hashrate per site, major incidents in the last 24 hours, and any upcoming maintenance windows.`  

- **Evening (pre-sleep):**  
  - `Check today's logs for recurring error patterns across miners or clusters that appeared at least 3 times. Group them and suggest candidates for automation or configuration changes.`  
