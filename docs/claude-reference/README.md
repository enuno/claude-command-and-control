# Claude Reference Documentation

This directory contains detailed reference documentation that has been externalized from CLAUDE.md for token optimization.

## Available References

| Document | Description | Load Via Skill |
|----------|-------------|----------------|
| [github-actions.md](github-actions.md) | GitHub Actions workflows, CI/CD pipelines, security scanning | `Skill("github-actions-reference")` |
| [advanced-orchestration.md](advanced-orchestration.md) | Enterprise DAG execution, agent pools, state management | See `docs/best-practices/15-Advanced-Orchestration-Patterns.md` |
| [observability.md](observability.md) | OpenTelemetry, Prometheus, KPIs, decision confidence | See `docs/best-practices/06-Production-Deployment-and-Maintenance.md` |
| [hooks-overview.md](hooks-overview.md) | Hook lifecycle, security patterns, production use cases | See `docs/best-practices/05-Testing-and-Quality-Assurance.md` |
| [compliance.md](compliance.md) | SOC 2, HIPAA, GDPR requirements and implementations | See `docs/best-practices/06-Production-Deployment-and-Maintenance.md` |

## Usage Pattern

Instead of loading all content upfront in CLAUDE.md, these references use **progressive disclosure**:

1. **CLAUDE.md** contains trigger tables and brief summaries
2. **Reference docs** contain full details
3. **Skills** load references on-demand when needed
4. **Main docs** (`docs/best-practices/`) contain comprehensive guides

## Token Savings

**Before optimization:**
- CLAUDE.md: 1,500 lines, ~68KB, ~30-40k tokens (estimated)

**After optimization:**
- CLAUDE.md: ~500-700 lines target
- Reference docs: Load on-demand only
- **Estimated savings:** 30-50% reduction

## Maintenance

These reference files should be updated when:
- GitHub Actions workflows change
- New orchestration patterns are added
- Observability metrics evolve
- Compliance requirements update
- Hook patterns are enhanced
