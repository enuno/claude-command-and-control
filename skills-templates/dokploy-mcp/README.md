# Dokploy MCP Skill

**Version**: 1.0.0
**Category**: DevOps Automation
**Complexity**: Complex

## Quick Start

Invoke this skill by saying:

```
"Deploy to Dokploy"
"Create a new Dokploy project"
"Provision PostgreSQL on Dokploy"
"Connect GitHub to my Dokploy app"
```

## What This Skill Does

AI-powered deployment management that orchestrates complete workflows using the Dokploy MCP server. Automates project lifecycle, application deployment, database provisioning, Git provider configuration, and build system management across 43 specialized tools.

## Prerequisites

- **Dokploy Server**: Access to Dokploy API with credentials
- **Environment Variables**:
  - `DOKPLOY_URL` - API endpoint (e.g., `https://dokploy.example.com/api`)
  - `DOKPLOY_API_KEY` - Authentication token
- **MCP Server**: `@ahdev/dokploy-mcp` installed and configured

## Key Features

### Project Management (6 tools)
- List, retrieve, create, update, duplicate, and delete projects
- Environment duplication for staging/testing scenarios
- Project-level environment variable management

### Application Management (24 tools)
- Complete lifecycle: deploy, redeploy, start, stop, reload
- Multi-provider Git integration: GitHub, GitLab, Bitbucket, Gitea, custom Git, Docker
- Flexible build systems: Dockerfile, Nixpacks, Heroku Buildpacks, Paketo, Static, Railpack
- Environment variables and build arguments configuration
- Monitoring and metrics access
- Traefik reverse proxy configuration

### Database Management (13 tools)
- PostgreSQL instance provisioning and configuration
- Lifecycle operations: deploy, start, stop, rebuild
- External port exposure for client access
- Environment tuning and resource limits
- High availability with replica configuration

### Domain & Networking (8 tools)
- Domain creation with automatic SSL (Let's Encrypt)
- DNS validation before certificate provisioning
- Custom certificate support
- Path-based routing and port mapping

## Examples

See `SKILL.md` for detailed examples including:

1. **Deploy Node.js API from GitHub** - Complete production deployment with PostgreSQL
2. **Deploy React SPA with Nixpacks** - Auto-detect and deploy modern JavaScript frameworks
3. **Troubleshoot Failed Deployment** - Systematic debugging and recovery
4. **Multi-Environment Duplication** - Clone production to staging
5. **Database Migration and Scaling** - High-availability PostgreSQL with replication

## Integration

**Works with:**
- **Agents**: Builder (code preparation), DevOps (infrastructure), Validator (testing)
- **Commands**: `/deploy`, `/rollback`, `/check-deployment`, `/scale-app`
- **MCP Servers**: `dokploy-mcp` (primary), `github`, `gitlab` (optional)

## Common Use Cases

### Full-Stack Deployment
```
1. Create project and environment
2. Provision PostgreSQL database
3. Deploy backend API (Node.js/Python/Go)
4. Deploy frontend (React/Vue/Next.js)
5. Configure domains with SSL
6. Monitor and scale as needed
```

### CI/CD Integration
```
1. Git push triggers webhook
2. Dokploy auto-deploys to staging
3. Run tests via Validator agent
4. Promote to production on success
5. Monitor metrics and logs
```

### Database Management
```
1. Create PostgreSQL with custom config
2. Configure replication for HA
3. Expose external port for backups
4. Tune performance parameters
5. Monitor and scale resources
```

## Versioning

- **1.0.0** (2025-12-27): Initial release with 43 Dokploy MCP tools

## Troubleshooting

**Issue**: Skill doesn't invoke
**Solution**: Use explicit trigger phrases like "deploy to Dokploy" or "manage Dokploy deployment"

**Issue**: MCP server not found
**Solution**: Verify `@ahdev/dokploy-mcp` is installed and configured in Claude settings

**Issue**: Deployment stuck at "running"
**Solution**: See SKILL.md troubleshooting section for systematic debugging steps

**Issue**: SSL certificate fails
**Solution**: Validate DNS configuration with `domain-validateDomain` tool first

## Repository Note

The original `andradehenrique/dokploy-mcp` repository has been moved to the official Dokploy organization at https://github.com/Dokploy/mcp. For the latest updates and documentation, please visit the official repository.

## Support

For issues, questions, or contributions:
- **Official MCP Server**: https://github.com/Dokploy/mcp
- **Dokploy Platform**: https://dokploy.com
- **Documentation**: See SKILL.md for comprehensive usage guide
