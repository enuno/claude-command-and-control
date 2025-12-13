# Production Deployment and Maintenance

## Purpose
This document provides best practices for securely deploying, monitoring, and maintaining Claude commands and agents in live environments.

## Deployment Patterns

- Use CI/CD to automatically format, test, and deploy command/agent code
- Integrate pre- and post-deployment hooks for safety checks and environment setup
- Deploy to staging before promoting to production for all but trivial changes
- Enable rollbacks to previous agent/command versions on failure

## Security Best Practices

- Restrict allowed-tools and agent permissions for live environments
- Use short-lived credentials for integrations
- Audit command/agent actions centrally (timestamp, action, actor, outcome)
- Require manual approval or two-person review for production-impacting changes

## Observability and Monitoring

- Track key metrics: response latency, token usage, error rates, deployment success rate
- Implement health endpoints and self-monitoring for agent servers
- Enable alerting for critical failures or security events
- Maintain version and change logs with reasons for all config/code deployments

## Agent/Command Lifecycle Management

- Retire unused commands/agents, update documentation, and prune stale configurations
- Increment semantic version for all externally visible changes
- Document rationale and expected impact for each update

## Cost Control

- Use efficient models for simple/automatable tasks; reserve most capable models for complex orchestration
- Periodically review command/agent usage and tune scope to prevent cost overrun

---
See Document 7 for quick reference patterns and starter templates.