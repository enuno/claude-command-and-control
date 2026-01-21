# Fly.io Blueprints: Production Patterns

This document provides an overview of Fly.io's architectural blueprints - real-world patterns you can learn from and build on.

## Categories

### 1. Architecture Patterns

Focus on application structure and design tradeoffs:

- **Multiple Machine Resilience** - High availability with geographic redundancy
- **N-Tier Architecture** - Layered application design
- **Shared Nothing** - Stateless, horizontally scalable services
- **Session Persistence** - Sticky sessions for stateful applications
- **Multi-Region Databases** - Global data distribution with fly-replay
- **Remote MCP Server** - Model Context Protocol integration

### 2. Deployment & Developer Workflow

Setup-once, adjust-on-ship practices:

- **Docker Integration** - Container-based deployment
- **Custom Deployment Workflows** - Automated CI/CD pipelines
- **Zero-Downtime Deployments** - Seamless rolling updates
- **Application Rollback** - Quick recovery from bad deploys
- **GitHub Preview Environments** - PR-based ephemeral deployments
- **Environment Isolation** - Staging/production separation
- **Per-User Dev Environments** - Individual developer Machines
- **Base Image Optimization** - Faster builds with multi-stage Dockerfiles
- **Private Docker Registry** - Custom image management

### 3. Networking & Connectivity

Connection patterns and security:

- **Private Application Access** - Flycast for internal services
- **WireGuard VPN** - Secure network access
- **Cross-Deployment Bridging** - Inter-app communication
- **User Machine Connectivity** - SSH and console access
- **SSH Server Deployment** - Secure remote access

### 4. Scaling, Performance & Observability

Reliability and monitoring:

- **User Application Observability** - Logging and metrics
- **Machine Autoscaling** - Automatic capacity adjustment
- **Private App Autostart/Autostop** - Cost-efficient internal services
- **Concurrency Limits** - Request handling configuration
- **Volume Forking** - Fast Machine initialization
- **Healthcare Production Guidance** - Regulated environment patterns

### 5. Background Jobs & Automation

Asynchronous and scheduled work:

- **Infrastructure Automation** - Terraform alternatives
- **Distributed Work Queues** - Background job processing
- **Cron-Based Scheduling** - Periodic tasks
- **Supercronic Execution** - Enhanced cron functionality

## Key Blueprint: Resilient Applications

### Overview

Build production-ready applications with multiple Machines for high availability.

### Architecture

**Service-Based Apps**:
- Automatically receive 2 identical Machines
- Autostop/autostart enabled by default
- Traffic automatically routed to healthy Machines

**Apps with Volumes**:
- Receive only 1 Machine initially
- Requires manual replication setup
- Volumes tied to specific regions

**Worker Processes**:
- Use standby Machines
- Automatically start if primary fails
- Cost-efficient for background jobs

### Configuration

```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

  [http_service.concurrency]
    type = "requests"
    soft_limit = 200
    hard_limit = 250
```

### Scaling Commands

```bash
# Basic redundancy
fly scale count 2

# Geographic distribution
fly scale count 20 --region ams,ewr,gig

# Standby worker
fly machine clone <id> --standby-for <id>
```

### Cost Model

**Stopped Machines**:
- Charge only for rootfs storage
- ~$0.18/month for 1.2GB image
- No CPU or RAM charges

**Running Machines**:
- Full resource charges apply
- Use autostop for cost optimization

### When to Implement

**Recommended**:
- Production systems with paying users
- Customer-facing services
- Regulated environments
- Geographic availability requirements

**Optional**:
- Side projects
- Staging environments
- Internal tools
- Development instances

## Key Blueprint: Zero-Downtime Deployments

### Default Behavior

With multiple Machines, Fly.io automatically:
1. Builds new image
2. Creates new Machine with updated code
3. Waits for health checks to pass
4. Routes traffic to new Machine
5. Destroys old Machine

### Rolling Deployment Strategy

```bash
# Explicit rolling deployment
fly deploy --strategy rolling

# With custom parameters
fly deploy --strategy rolling --max-unavailable 1
```

### Health Check Configuration

```toml
[[services.http_checks]]
  interval = "10s"
  timeout = "2s"
  grace_period = "5s"
  method = "GET"
  path = "/health"

  [[services.http_checks.headers]]
    X-Health-Check = "fly"
```

### Rollback Procedure

```bash
# View release history
fly releases

# Rollback to previous
fly releases rollback

# Rollback to specific version
fly releases rollback --version 42
```

## Key Blueprint: GitHub Preview Environments

### Workflow Configuration

```yaml
# .github/workflows/preview.yml
name: Deploy Preview
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Flyctl
        uses: superfly/flyctl-actions@1.3
        with:
          version: latest

      - name: Deploy Preview
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        run: |
          PR_NUMBER=${{ github.event.pull_request.number }}
          APP_NAME="myapp-pr-${PR_NUMBER}"

          # Create app if doesn't exist
          flyctl apps create "$APP_NAME" --org my-org || true

          # Deploy
          flyctl deploy --app "$APP_NAME" --remote-only

          # Get URL
          URL=$(flyctl info --app "$APP_NAME" --json | jq -r '.Hostname')
          echo "Preview URL: https://$URL"

  cleanup-preview:
    runs-on: ubuntu-latest
    if: github.event.action == 'closed'
    steps:
      - name: Destroy Preview App
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        run: |
          PR_NUMBER=${{ github.event.pull_request.number }}
          flyctl apps destroy "myapp-pr-${PR_NUMBER}" --yes
```

### Cost Optimization

- Use autostop/autostart for preview apps
- Destroy apps on PR close
- Limit to specific branches/repositories
- Use smaller Machine sizes for previews

## Key Blueprint: Background Jobs with Supercronic

### Dockerfile

```dockerfile
FROM node:18-alpine

# Install supercronic
RUN apk add --no-cache supercronic

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .

# Copy crontab
COPY crontab /etc/crontab

# Use supercronic as entrypoint
CMD ["supercronic", "/etc/crontab"]
```

### Crontab Configuration

```
# Run every 5 minutes
*/5 * * * * node /app/jobs/cleanup.js

# Daily backup at 2 AM
0 2 * * * node /app/jobs/backup.js

# Hourly report
0 * * * * node /app/jobs/report.js
```

### fly.toml Configuration

```toml
app = "myapp-worker"
primary_region = "ord"

[build]
  dockerfile = "Dockerfile.worker"

# No HTTP service needed for cron workers
[processes]
  worker = "supercronic /etc/crontab"

[vm]
  size = "shared-cpu-1x"
  memory_mb = 256

# Keep worker running always
[auto_stop_machines]
  enabled = false
```

## Key Blueprint: Distributed Work Queue

### Architecture

**Queue Manager** (Redis/PostgreSQL):
```bash
# Create Redis for queue
fly redis create --name myapp-queue
```

**Worker Machines**:
```bash
# Deploy worker pool
fly scale count 3 --process worker

# Regional workers
fly scale count 2 --region ord --process worker
fly scale count 1 --region ams --process worker
```

### Configuration

```toml
[processes]
  web = "node server.js"
  worker = "node worker.js"

# Web service configuration
[[services]]
  processes = ["web"]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

# Worker configuration (no external service)
[vm]
  processes = ["worker"]
  size = "shared-cpu-1x"
  memory_mb = 512
```

### Worker Code Example

```javascript
// worker.js
const Queue = require('bull');
const Redis = require('ioredis');

const client = new Redis(process.env.REDIS_URL);
const queue = new Queue('jobs', { redis: client });

queue.process('email', async (job) => {
  await sendEmail(job.data);
});

queue.process('report', 5, async (job) => {
  // Process up to 5 jobs concurrently
  await generateReport(job.data);
});
```

## Best Practices

### Architecture

1. **Separate Concerns** - Use process groups for web/worker/cron
2. **Stateless Services** - Store state in volumes or databases
3. **Health Checks** - Always configure for production services
4. **Graceful Shutdown** - Handle SIGTERM for clean stops

### Deployment

1. **Start Small** - Begin with 2 Machines, scale as needed
2. **Test Rollbacks** - Practice rollback procedures
3. **Monitor Deployments** - Watch logs during deploys
4. **Use Staging** - Test changes in staging first

### Cost

1. **Right-Size Machines** - Don't over-provision
2. **Use Autostop** - Enable for low-traffic services
3. **Regional Strategy** - Deploy only where users are
4. **Clean Up** - Destroy unused preview/test apps

### Security

1. **Private Networking** - Use Flycast for internal services
2. **Secrets Management** - Never commit credentials
3. **TLS Everywhere** - Enable HTTPS for all services
4. **Least Privilege** - Scope deploy tokens appropriately

## Resources

- **Blueprints Index**: https://fly.io/docs/blueprints/
- **Community Examples**: https://community.fly.io
- **GitHub Examples**: https://github.com/fly-apps

---

**Last Updated**: 2026-01-21
**Source**: Fly.io Blueprints Documentation
