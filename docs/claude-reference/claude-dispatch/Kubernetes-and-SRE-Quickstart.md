# Claude Dispatch – Kubernetes & SRE Quickstart

Use Dispatch as a pocket SRE assistant: read-only analysis of pods, deployments, alerts, SLOs, and change logs from your phone while clusters run. [x](https://x.com/heynavtoor/status/2034679349157536233)

## Prerequisites

- Claude Desktop on your primary SRE / jump host (with March 2026 Dispatch release). [x](https://x.com/heynavtoor/status/2034679349157536233)
- Claude mobile app on iOS/Android, paired to that host. [x](https://x.com/heynavtoor/status/2034679349157536233)
- Paid Claude plan with Cowork enabled. [x](https://x.com/heynavtoor/status/2034679349157536233)
- On the SRE host, Cowork configured with:  
  - Context files: cluster overviews, SLOs, on-call policy, escalation trees, runbooks. [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Skills: alert triage, log analysis, incident timelines, postmortem drafts, change-diff analyzer. [x](https://x.com/heynavtoor/status/2034679349157536233)
  - Access to exported logs/metrics (e.g., Loki/Prometheus dumps, `kubectl` output, incidents folder).  

***

## One-time Setup (SRE Host)

1. **Enable Dispatch on the SRE box** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - Open Claude Desktop → **Cowork** → **Dispatch**.  
   - Click **Get started**.  
   - Turn on:  
     - “Allow file access” for logs, reports, runbooks, and cluster state exports.  
     - “Keep computer awake while Dispatch is active” (or handle in OS power settings).  

2. **Pair your phone** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - Show QR on desktop, open Claude mobile → **Dispatch** → scan.  
   - Verify single persistent Dispatch thread visible on both devices.  

3. **Connectivity smoke test** [x](https://x.com/heynavtoor/status/2034679349157536233)
   - From phone: `What SRE and kubernetes folders/logs can you see right now?`  
   - Confirm it lists log dirs, exports, and runbooks; if not, re-check file-access toggle.  

***

## Recommended Global Instructions (Kubernetes/SRE)

In Cowork Global Instructions, add something like: [x](https://x.com/heynavtoor/status/2034679349157536233)

> When receiving a message via Dispatch, assume context is Kubernetes/SRE operations.  
> 1) Restate the task,  
> 2) Ask for clarification if cluster/environment is ambiguous,  
> 3) Do not perform any destructive or write actions; limit to analysis, summaries, diffs, and draft commands or runbook steps only.

This keeps remote commands safe and predictable. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Core Dispatch Workflows for Kubernetes/SRE

### 1. Cluster & SLO Morning Health Brief

- `Using the latest Prometheus and alert exports, summarize cluster health across all environments: pods not ready, crash loops, error rates, and any SLO burn over the last 12 hours.`  
- `From the last alert dump, list all firing alerts grouped by service and severity, and flag anything that threatens SLOs within the next 6 hours.`  

Dispatch reads metrics/alert exports and runbooks, you skim on phone before a keyboard. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 2. Alert Triage While On-Call

- `Given the most recent Alertmanager JSON and associated logs, triage active alerts: probable root cause, blast radius, suggested first checks, and likely owner team.`  
- `For service api-gateway, analyze the last 200 lines of logs and current alerts to determine whether this is a rollout regression, dependency issue, or infra problem.`  

You then decide actions (e.g., rollback, scaling) on a terminal. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 3. Pod / Deployment Incident Analysis (From Exports)

Assumes you periodically export structured output (e.g., via cron or tools) to files.

- `Review the latest kubectl exports (pods, deployments, events) for cluster prod and summarize any pods in CrashLoopBackOff, high restart counts, or unschedulable pods and likely causes.`  
- `From the last events export, identify recurring reasons (ImagePullBackOff, OOMKilled, FailedScheduling) and group by namespace.`  

Helpful when you have JSON/YAML snapshots but no shell handy. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 4. Release & Config Change Diffs

- `Diff yesterday's deployment manifests or Helm values for the checkout service against today's and summarize functional changes, with emphasis on things that could affect latency, error rates, or resource usage.`  
- `Compare the last two Git commits that touched Kubernetes manifests and list changes that are high risk from an SRE perspective.`  

Bind to a “k8s-change-diff” skill to standardize analysis. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 5. Runbook & Playbook Lookup

- `Find the runbook for "p95 latency SLO violation on checkout" and summarize the first five diagnostic steps.`  
- `Search SRE docs for "CrashLoopBackOff playbook" and give me the short version: common causes and standard checks.`  

Makes phone-based guidance sane without opening a wiki. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

### 6. Incident Timeline & Postmortem Drafting

After an incident, from your phone:

- `Using the incident log exports, alerts, and Slack/Teams transcript from today’s outage, build a chronological incident timeline: detection, mitigation, and resolution.`  
- `Draft a postmortem skeleton for the 502 spike on checkout: summary, impact, root cause hypotheses, contributing factors, and follow-up actions.`  

You refine later in your PM/postmortem system. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Reliability & Safety Practices

- Keep Dispatch tasks **read-only**: analyze logs, summarize alerts, diff configs, draft commands, draft docs. [x](https://x.com/heynavtoor/status/2034679349157536233)
- Avoid multi-connector chains from mobile (e.g., “read logs, open PR, and notify Slack”) until reliability matures; keep each message single-purpose. [x](https://x.com/heynavtoor/status/2034679349157536233)
- For any standard workflow (SLO brief, alert triage, release diff), validate it locally a few times while watching the desktop, then treat it as a standard Dispatch command from your phone. [x](https://x.com/heynavtoor/status/2034679349157536233)

***

## Sample Daily SRE Routine with Dispatch

- **Morning:**  
  - `Summarize overnight alerts, SLO burn rates, and any pods or deployments in a bad state for prod and staging. Output a prioritized checklist for my shift.`  

- **Midday (between meetings / travel):**  
  - `Given today’s deployment change logs and alerts, identify any services where new versions correlate with error-rate or latency spikes.`  

- **Evening:**  
  - `Scan today’s incident and alert history for repeating issues across services and propose 3–5 candidate reliability improvements or automation opportunities.`  