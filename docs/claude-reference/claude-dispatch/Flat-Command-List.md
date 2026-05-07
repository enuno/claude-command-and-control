# Claude Dispatch – Flat Command List

> All commands assume Claude Dispatch is paired to a desktop running Cowork with access to your files, skills, and connectors.

- Summarize my top 10 unread emails and flag anything urgent.
- Check my calendar for today and prepare briefing docs using files in my project folder.
- Read the three most recent documents in my Research folder and give me a one-paragraph summary of each.
- Summarize my recent Notion notes.
- What were the key messages in the marketing Slack channel today?
- Process all receipt images from my receipts folder and create a categorized spreadsheet.
- Good morning. Summarize my top emails, check my calendar for today, and list any files that changed in my project folder yesterday.
- Draft a reply to the email from [person] about [topic]. Keep it under 100 words.
- Prepare a briefing doc for my 10am meeting using the latest files in my project folder.

- Scan the latest overnight mining logs and summarize anomalies, offline rigs, hashrate drops, or thermal issues, prioritized by impact.
- Summarize power usage, temps, and hashrate per pod from yesterday’s metrics exports; flag anything outside normal bands.
- Using the latest incident logs and alerts for pod TH-03, classify the issue and list first checks for on-call.
- Diff yesterday's proxy/config snapshots vs today’s and summarize changes that could affect mining APIs or monitoring endpoints.
- Review the last two Ansible/Terraform run logs and list infra changes that could affect mining uptime or latency to pools.
- Find the runbook for "stratum disconnects on site MX-02" and summarize the first remediation steps.
- Using yesterday’s CSV exports, draft a markdown report with hashrate, uptime, power efficiency, and revenue per pod for all sites.

- Using the latest metrics and alert exports, summarize cluster health: pods not ready, crash loops, error rates, and any SLO burn over the last 12 hours.
- Group all firing alerts by service and severity and flag anything likely to violate SLOs in the next 6 hours.
- From the last Alertmanager JSON and logs, triage active alerts: probable root cause, blast radius, first diagnostic steps, and likely owner team.
- Analyze the latest pods/events export for prod and list CrashLoopBackOff, OOMKilled, or unschedulable pods, grouped by namespace with likely causes.
- Diff the last two versions of deployment manifests for the checkout service and summarize changes that might affect latency, error rates, or resource usage.
- Compare the last two Git commits that touched Kubernetes manifests and highlight high-risk changes from an SRE perspective.
- Find the runbook for "p95 latency SLO violation on checkout" and summarize the first five steps.
- Using today’s incident logs, alerts, and Slack/Teams transcript, build a chronological outage timeline and a draft postmortem skeleton.
