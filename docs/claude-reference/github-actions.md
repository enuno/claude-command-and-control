# GitHub Actions Automation

The repository includes comprehensive GitHub Actions workflows for automated maintenance, security scanning, and content integration.

## Workflow Status Badges

![Maintenance Scan](https://github.com/enuno/claude-command-and-control/actions/workflows/maintenance-scan.yml/badge.svg)
![Integration Pipeline](https://github.com/enuno/claude-command-and-control/actions/workflows/integration-pipeline.yml/badge.svg)
![Security Scanning](https://github.com/enuno/claude-command-and-control/actions/workflows/security-scanning.yml/badge.svg)
![PR Validation](https://github.com/enuno/claude-command-and-control/actions/workflows/pr-validation.yml/badge.svg)
![Link Checker](https://github.com/enuno/claude-command-and-control/actions/workflows/link-checker.yml/badge.svg)
![Research Monitor](https://github.com/enuno/claude-command-and-control/actions/workflows/research-monitor.yml/badge.svg)

## Automated Workflows

### Core Automation

**Maintenance Scan** (`.github/workflows/maintenance-scan.yml`)
- **Schedule:** Monthly on the 1st @ 2 AM UTC
- **Purpose:** Identifies stale files (>30 days old) and generates health reports
- **Output:** GitHub Issue with maintenance report
- **Invokes:** `/maintenance-scan` command via Claude CLI
- **Cost:** ~$0.03/month

**Integration Pipeline** (`.github/workflows/integration-pipeline.yml`)
- **Schedule:** Hourly during work hours (9 AM-5 PM Mon-Fri)
- **Trigger:** New files in `INTEGRATION/incoming/`
- **Purpose:** Automated content ingestion and processing
- **Pipeline:** Scan → Validate → Process → Create PR
- **Quality Gates:** Max 5 files, all must pass validation
- **Cost:** ~$1.80/month

**Research Monitor** (`.github/workflows/research-monitor.yml`)
- **Schedule:** Weekly Monday @ 9 AM UTC
- **Purpose:** Monitor Claude Code research sources
- **Sources:**
  - Anthropic Blog RSS feed
  - anthropics/anthropic-sdk-python releases
  - anthropics/anthropic-sdk-typescript releases
  - modelcontextprotocol/servers releases
- **Output:** GitHub Issue with new research summary
- **Downloads:** New content to `INTEGRATION/incoming/`
- **Cost:** ~$0.06/month

### Security & Quality

**Security Scanning** (`.github/workflows/security-scanning.yml`)
- **Schedule:** Daily @ 3 AM UTC + on push/PR
- **Components:**
  - CodeQL Analysis (Python & JavaScript)
  - TruffleHog secret scanning
  - ShellCheck for shell scripts
  - Dependency Review (PRs only)
- **Output:** Security alerts + GitHub Issues for findings
- **Cost:** Free (GitHub native tools)

**PR Validation** (`.github/workflows/pr-validation.yml`)
- **Trigger:** All pull requests
- **Validates:**
  - Command frontmatter and structure
  - Agent configuration format
  - Skill file structure
  - allowed-tools definitions
- **Invokes:** `/code-review` command via Claude CLI
- **Mode:** Non-blocking (advisory feedback)
- **Cost:** ~$1.20/month

**Link Checker** (`.github/workflows/link-checker.yml`)
- **Schedule:** Weekly Wednesday @ 10 AM UTC
- **Purpose:** Validate all markdown links
- **Checks:** docs/, templates/, commands/, agents/, root files
- **Output:** GitHub Issue if broken links found
- **Cost:** Free

### Infrastructure

**Composite Action: setup-claude** (`.github/actions/setup-claude/`)
- Installs Claude CLI in workflows
- Handles authentication with `ANTHROPIC_API_KEY`
- Caches installation for faster runs
- Used by all workflows that invoke commands

**Dependabot** (`.github/dependabot.yml`)
- **Schedule:** Weekly (Mon/Tue/Wed)
- **Monitors:**
  - GitHub Actions dependencies
  - Python packages (skills)
  - npm packages (hooks)
- **Configuration:** Max 3 PRs at once per ecosystem

## Setup Instructions

### Required Secrets

Configure in **Settings → Secrets and variables → Actions**:

```
Name: ANTHROPIC_API_KEY
Value: <your-anthropic-api-key>
Description: Claude CLI authentication for command invocation
```

### Testing Workflows

All workflows support manual dispatch:

1. Go to **Actions** tab
2. Select workflow from left sidebar
3. Click **Run workflow** button
4. Configure inputs (if any)
5. Click **Run workflow**

## Cost Breakdown

**Monthly Anthropic API Costs:**
- Maintenance Scan: $0.03
- Integration Pipeline: $1.80
- PR Validation: $1.20
- Research Monitor: $0.06
- **Total: ~$3.09/month**

**GitHub Actions:**
- Free for public repositories
- All workflows <5 min runtime

## Monitoring & Maintenance

### Weekly Review
- Check Actions tab for failed workflows
- Review auto-created issues
- Triage integration PRs
- Monitor API usage

### Monthly Review
- Review maintenance report (1st of month)
- Audit security alerts
- Check workflow execution times
- Update research source list if needed

### Quarterly Review
- Update workflow configurations
- Rotate `ANTHROPIC_API_KEY`
- Review cron schedules
- Gather stakeholder feedback

## Troubleshooting

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "claude: command not found" | Check `ANTHROPIC_API_KEY` secret is set |
| "Permission denied" | Add required permissions to job |
| "No files to process" | Normal - workflow exits gracefully |
| "API rate limit exceeded" | Workflow retries with backoff |

**Debug Steps:**
1. Check workflow logs in Actions tab
2. Download artifacts for detailed logs
3. Verify secrets are configured
4. Test command locally with Claude CLI
5. Create issue if problem persists

## Workflow Files

All workflow files are in `.github/workflows/`:
- `maintenance-scan.yml` - Monthly repository health checks
- `integration-pipeline.yml` - Hourly content processing
- `security-scanning.yml` - Daily security audits
- `pr-validation.yml` - Automated PR quality checks
- `research-monitor.yml` - Weekly research tracking
- `link-checker.yml` - Weekly link validation

Configuration files:
- `.github/dependabot.yml` - Dependency update automation
- `.github/markdown-link-check.json` - Link checker rules
- `.github/ISSUE_TEMPLATE/maintenance-report.md` - Issue template
