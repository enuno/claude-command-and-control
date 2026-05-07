# Claude Dispatch – Ops & Engineering README

Use Claude Dispatch as a remote control for your Cowork system from your phone: generic productivity, mining ops, and Kubernetes/SRE workflows. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## 1. Core Concept & Requirements

- Dispatch creates **one persistent conversation** between Claude Desktop (engine) and Claude Mobile (remote control). [x](https://x.com/heynavtoor/status/2034679349157536233)
- All work runs on your desktop: files, skills, connectors, and global instructions are inherited from your Cowork setup. [x](https://x.com/heynavtoor/status/2034679349157536233)
- Requirements:  
  - Updated Claude Desktop (March 2026 Dispatch release). [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Updated Claude mobile app (iOS/Android). [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Paid Claude plan (Max now; Pro rolling out). [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Desktop must be awake; Dispatch dies if the app closes or the machine sleeps. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## 2. One-Time Setup

1. **Enable Dispatch on Desktop** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - Open Claude Desktop → **Cowork** → **Dispatch** → **Get started**.  
   - Turn on:
     - “Allow file access” (so Dispatch can use your full Cowork graph).  
     - “Keep computer awake while Dispatch is active.”  

2. **Pair Phone** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - Desktop shows QR code.  
   - On phone: open Claude app → **Dispatch** → scan QR.  
   - Verify you see the same single thread on both devices.  

3. **Test** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - From phone: `What files do you have access to right now?`  
   - Expect a list of folders/files from your Cowork setup; if not, re-check file access.  

***

## 3. Global Instructions (Recommended)

Add to Cowork Global Instructions: [x](https://x.com/heynavtoor/status/2034679349157536233)

```text
When receiving a message via Dispatch:

1) Assume terse, mobile-origin prompts.
2) Restate the task before executing.
3) Ask for clarification if any system, site, or environment is ambiguous.
4) Do not perform destructive operations; limit to analysis, summaries, drafts, and recommendations.
```

Extend this with domain-specific notes per section below.

***

## 4. Generic Dispatch Workflows

Use short, single-purpose, information-focused tasks. [x](https://x.com/heynavtoor/status/2034679349157536233)

- **Email & day planning**  
  - `Summarize my top 10 unread emails and flag anything urgent.`  
  - `Check my calendar for today and prepare briefing docs for each meeting using files from my project folder.`  

- **Docs & research**  
  - `Read the three most recent documents in my Research folder and give me a one-paragraph summary of each.`  

- **Knowledge tools (Notion / Slack)**  
  - `Summarize my recent Notion notes.`  
  - `What were the key messages in the marketing Slack channel today?`  

- **Admin / expenses**  
  - `Process all receipt images from my receipts folder and create a categorized spreadsheet.`  

Reliability is highest for summarize / list / find / retrieve / analyze; weakest for multi-app “do X then Y then Z” chains. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## 5. Mining & Infra Ops Workflows

Assumes Cowork on a NOC/jump host with mining runbooks, log exports, topology docs, and infra skills available. [x](https://x.com/heynavtoor/status/2034679349157536233)

- **Fleet & site health**  
  - `Scan the latest overnight log exports for my mining fleet and summarize anomalies, offline rigs, hashrate drops, or thermal issues, prioritized by impact.`  
  - `Summarize power usage, temps, and hashrate per pod from yesterday’s metrics exports and flag anything outside normal bands.`  

- **Incident triage (read-only)**  
  - `Using the latest incident logs and alerts for pod TH-03, classify the issue as power, cooling, network, or ASIC failure and list first checks for on-call.`  

- **Change & config diffs**  
  - `Diff yesterday's nginx/proxy configs vs today’s and summarize changes that could affect mining APIs or monitoring endpoints.`  
  - `Review the last two Ansible/Terraform run logs and list infra changes that could affect mining uptime or latency to pools.`  

- **Runbooks & reporting**  
  - `Find the runbook for "stratum disconnects on site MX-02" and summarize the first remediation steps.`  
  - `Using yesterday’s CSV exports, draft a concise hashrate/uptime/revenue per pod report for all sites in markdown.`  

Keep Dispatch in analysis-only mode; you apply actual changes at the terminal. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## 6. Kubernetes / SRE Workflows

Assumes SRE host has exports from Prometheus/Alertmanager/kubectl and SRE runbooks. [x](https://x.com/heynavtoor/status/2034679349157536233)

- **Cluster & SLO brief**  
  - `Using the latest metrics and alert exports, summarize cluster health: pods not ready, crash loops, error rates, and any SLO burn over the last 12 hours.`  
  - `Group firing alerts by service and severity, and flag anything likely to violate SLOs in the next 6 hours.`  

- **Alert & pod triage**  
  - `From the last Alertmanager JSON and logs, triage active alerts: probable root cause, blast radius, first diagnostic steps, and likely owner team.`  
  - `Analyze the latest pods/events export for prod and list CrashLoopBackOff, OOMKilled, or unschedulable pods, grouped by namespace with likely causes.`  

- **Release / config diffs**  
  - `Diff the last two versions of deployment manifests for the checkout service and summarize changes that might affect latency, error rates, or resource usage.`  
  - `Compare the last two Git commits touching Kubernetes manifests and highlight high-risk changes from an SRE perspective.`  

- **Runbooks and postmortems**  
  - `Find the runbook for "p95 latency SLO violation on checkout" and summarize the first five steps.`  
  - `Using today’s incident logs, alerts, and Slack transcript, build a chronological outage timeline and a draft postmortem skeleton.`  

Again, keep all suggestions non-destructive; treat outputs as guidance and draft artifacts. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## 7. Usage Patterns & Constraints

- **Best practices**  
  - One clear action per message, favor read-only operations. [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Use skills for repeated workflows (e.g., “mining-health-summary”, “k8s-change-diff”). [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Test each new workflow locally a few times before trusting it remotely. [x](https://x.com/heynavtoor/status/2034679349157536233)

- **Current limitations**  
  - Single thread only, no per-workflow conversations. [x](https://x.com/heynavtoor/status/2034679349157536233)
  - No notifications yet; you must check the Dispatch thread manually. [x](https://x.com/heynavtoor/status/2034679349157536233)
  - No scheduling control; scheduled tasks are separate. [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Performance is variable on large file / multi-connector workflows. [x](https://x.com/heynavtoor/status/2034679349157536233)