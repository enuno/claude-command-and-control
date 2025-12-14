# Deployment and CI/CD Guidelines

> See `ARCHITECTURE.md` for deployment patterns and `AGENTS.md` for workflow conventions.

---

## 1. Deployment Targets

We support:

1. **Local (Workstation)** – STDIO MCP server for on-site technicians.
2. **Managed-Dedicated** – Per-user containerized HTTP + SSE deployment.
3. **Managed-Shared (Multi-Tenant)** – Multi-tenant HTTP deployment with OAuth.
4. **Hybrid (Local + Remote Gateway)** – Local agent + cloud aggregator.

Each mode should be configurable via environment variables and config files in `config/`.

> Reference: 12-Factor App [https://12factor.net](https://12factor.net)  
> Reference: Docker Best Practices [https://docs.docker.com/develop/dev-best-practices/](https://docs.docker.com/develop/dev-best-practices/)

---

## 2. CI Pipeline (Conceptual)

Typical CI steps:

1. **Install**
   - `npm ci`
2. **Lint & Build**
   - `npm run lint`
   - `npm run build`
3. **Test**
   - `npm run test:coverage`
4. **Security**
   - `npm audit` (or equivalent)
5. **Image Build (if applicable)**
   - `docker build -t braiins-os-mcp-server:commit-sha .`

---

## 3. Environments

- **Development**
  - Can use non-critical Braiins OS demo miners or sandbox.
  - More verbose logging enabled.

- **Staging**
  - Mirrors production settings closely.
  - Used for pre-release validation and integration testing.

- **Production**
  - Strict security and resource limits.
  - Proper monitoring/alerting enabled.

---

## 4. Rollback Procedures

- Containerized deployments should:
  - Use tagged images (e.g., `braiins-os-mcp-server:1.2.3`).
  - Support rolling back to the previous stable tag on failure.

- Keep database/Redis schema changes:
  - Backward-compatible where possible.
  - Accompanied by migration scripts when needed.

> Reference: Blue-Green Deployments [https://martinfowler.com/bliki/BlueGreenDeployment.html](https://martinfowler.com/bliki/BlueGreenDeployment.html)  
> Reference: Rolling Updates in Containers [https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)

---

## 5. Copilot and Deployment

Copilot may help with:

- Dockerfile tweaks.
- CI YAML scaffolding.
- Scripts for environment bootstrapping.

Developers must:

- Validate all deployment-related changes.
- Ensure secrets and credentials are injected securely and not committed.

All deployment changes should be reviewed by a **DevOps engineer** or the **DevOps Agent** as per `AGENT_REGISTRY.md`.
