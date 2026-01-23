# Compliance and Regulatory Alignment

**Full documentation:** `docs/best-practices/06-Production-Deployment-and-Maintenance.md#compliance-requirements`

## Enterprise Compliance Standards

Production Claude Code deployments align with industry regulatory requirements through systematic audit trails, access controls, and governance frameworks.

### SOC 2 Type II Compliance

**Requirements:**
- Comprehensive audit trails
- Access controls with least privilege
- Change management workflows
- Continuous monitoring and incident response

**Implementation:**
- Audit logging to `.claude/audit.jsonl` + remote SIEM
- `allowed-tools` restrict agent capabilities
- All changes reviewed via PR
- Real-time dashboards with alerting

### HIPAA (Healthcare)

**Requirements:**
- PHI never transmitted to LLM APIs
- Agent processing limited to metadata
- Human review for patient-facing content
- Encryption at rest and in transit

**Implementation:**
- PostToolUse hooks redact PHI patterns
- `allowed-tools` prevent Read access to PHI directories
- Every action logged with user, timestamp
- Session transcripts encrypted (AES-256)

### GDPR (European Union)

**Requirements:**
- Data residency (EU boundaries)
- Right to deletion
- Data minimization
- Consent management

**Implementation:**
- Claude for Enterprise via AWS eu-west-1/eu-central-1
- `/delete-session` command removes all artifacts
- Hooks strip PII before sending to LLMs
- Developers opt-in per-project

## Audit Trail Requirements

**Comprehensive Logging:**
```json
{
  "timestamp": "2026-01-23T14:32:18.456Z",
  "event_type": "tool_execution",
  "session_id": "550e8400-...",
  "user": "alice@example.com",
  "tool_name": "Bash",
  "policy_checks": {
    "PreToolUse/bash_security": "allow"
  }
}
```

**Storage:**
- Local: `.claude/audit.jsonl` (30-day retention)
- Remote: SIEM (1-7 year retention)
