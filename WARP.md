# Global WARP.md Configuration for Professional & Home Lab Development

## Document Overview

**Purpose**: This WARP.md file establishes universal guidelines for AI agents working across professional software development and home lab infrastructure projects. It ensures consistent, secure, and maintainable code generation while aligning with industry best practices.

**Scope**: Global configuration applicable to all projects. Project-specific overrides can be defined in subdirectory WARP.md files.

**Compatible With**: WARP.md, AGENTS.md, CLAUDE.md, .cursorrules, and other AI agent configuration standards.

***

## 1. Core Development Principles

### 1.1 Code Quality Standards

**Always prioritize**:

- **Readability over cleverness**: Write self-documenting code with clear variable names and logical structure
- **Maintainability**: Code should be easily understood and modified by future developers (including yourself)
- **Security by design**: Never hardcode credentials, API keys, or sensitive data; use environment variables and secrets management
- **Test-driven development**: Write tests before or alongside implementation; minimum 80% code coverage for critical paths
- **Incremental changes**: Break complex features into small, testable chunks that can be validated independently

**Code Review Requirements**:

- All AI-generated code must undergo human review before merging to main branches
- Run static analysis tools (linters, type checkers, security scanners) on all generated code
- Validate that generated code follows project-specific conventions and patterns


### 1.2 Documentation Standards

**Every code change must include**:

- Clear inline comments explaining *why*, not just *what*
- Updated README.md files when functionality changes
- API documentation for all public interfaces
- Architecture decision records (ADRs) for significant design choices
- Changelog entries following Keep a Changelog format

**Documentation format**: Use Markdown for all documentation files. Follow conventional file naming:

- `README.md` - Project overview and setup instructions
- `ARCHITECTURE.md` - System design and component relationships
- `CONTRIBUTING.md` - Development workflow and contribution guidelines
- `CHANGELOG.md` - Version history and notable changes
- `TROUBLESHOOTING.md` - Common issues and solutions

***

## 2. Technology Stack Preferences

### 2.1 Programming Languages & Frameworks

**Primary Languages** (in order of preference):

1. **Python** (3.11+) - Data processing, automation, backend services
2. **TypeScript/JavaScript** (Node.js 18+) - Full-stack web applications, APIs
3. **Go** (1.21+) - High-performance services, CLI tools, infrastructure components
4. **Bash/Shell** - System automation, deployment scripts (prefer `#!/usr/bin/env bash`)

**Web Development**:

- **Frontend**: React 18+ with TypeScript, Next.js 14+ for full-stack applications
- **Backend**: FastAPI (Python), Express (Node.js), or Go Fiber
- **API Design**: RESTful with OpenAPI 3.0+ specification, consider GraphQL for complex data requirements
- **Authentication**: OAuth 2.0, JWT tokens, consider Auth0 or similar for enterprise-grade auth

**Infrastructure & DevOps**:

- **Containerization**: Docker (multi-stage builds) with Docker Compose for local development
- **Orchestration**: Kubernetes (k3s for home lab, managed services for production)
- **Infrastructure as Code**: Terraform (>= 1.5) with remote state in cloud storage
- **Configuration Management**: Ansible for server configuration, Helm for Kubernetes
- **CI/CD**: GitHub Actions (preferred), GitLab CI, or Jenkins for legacy systems


### 2.2 Database & Storage

**Database Selection Guide**:

- **Relational**: PostgreSQL 15+ (default choice for ACID requirements)
- **Document Store**: MongoDB 7+ (flexible schema, JSON documents)
- **Key-Value**: Redis 7+ (caching, session storage, message queuing)
- **Time-Series**: InfluxDB or Prometheus for metrics and monitoring data
- **Object Storage**: MinIO (self-hosted) or S3-compatible cloud storage

**Data Best Practices**:

- Always use connection pooling and prepared statements
- Implement database migrations with versioning (Flyway, Alembic, or Prisma)
- Never expose database credentials in code; use environment variables
- Implement database backups with automated testing of restore procedures

***

## 3. Home Lab Specific Guidelines

### 3.1 Infrastructure Architecture

**Home Lab Environment Standards**:

- **Hypervisor**: Proxmox VE (preferred) or VMware ESXi for virtualization
- **Container Platform**: Docker + Portainer for management, or k3s for Kubernetes learning
- **Network**: VLANs for network segmentation (management, services, guest, IoT)
- **Monitoring**: Prometheus + Grafana stack for metrics; Uptime Kuma for service monitoring
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) or Grafana Loki for centralized logging
- **Reverse Proxy**: Traefik or Nginx Proxy Manager with automatic SSL via Let's Encrypt

**Resource Management**:

- Document resource allocation (CPU, RAM, storage) for each VM/container
- Use labels and tags consistently across all infrastructure components
- Maintain an inventory of IP addresses, hostnames, and service mappings
- Implement automatic backup schedules with off-site replication


### 3.2 Home Lab Security

**Security Hardening**:

- Disable default credentials on all devices and services
- Implement network segmentation with firewall rules between VLANs
- Use SSH keys for authentication; disable password-based SSH access
- Deploy fail2ban or similar intrusion prevention systems
- Keep a separate management network isolated from production services
- Regular security audits with tools like OpenVAS or Nessus

**Secrets Management**:

- Use HashiCorp Vault, Bitwarden, or 1Password for credential storage
- Never commit secrets to version control (use .gitignore and .env.example files)
- Rotate credentials quarterly for non-production, monthly for production-like environments

***

## 4. Development Workflow & Git Practices

### 4.1 Git Workflow

**Branch Strategy** (Git Flow):

- `main` - Production-ready code, protected branch
- `develop` - Integration branch for features
- `feature/*` - Individual feature development
- `hotfix/*` - Emergency production fixes
- `release/*` - Release preparation branches

**Commit Standards**:

- Use Conventional Commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`
- Example: `feat(api): add user authentication endpoint`
- Include ticket/issue numbers in commit messages: `Fixes #123`
- Write imperative mood commit messages: "Add feature" not "Added feature"

**Pull Request Requirements**:

- Descriptive title and body explaining what and why
- Link to related issues or documentation
- Passes all CI/CD checks (tests, linting, security scans)
- Minimum one approval from code owner or team lead
- No merge conflicts with target branch


### 4.2 Code Review Guidelines

**Reviewer Checklist**:

- Does the code solve the stated problem?
- Is the code readable and maintainable?
- Are there adequate tests with good coverage?
- Are security best practices followed?
- Is documentation updated appropriately?
- Are there any performance concerns?
- Does it follow project coding standards?

***

## 5. Testing & Quality Assurance

### 5.1 Testing Strategy

**Test Pyramid**:

1. **Unit Tests** (70%) - Test individual functions and methods in isolation
2. **Integration Tests** (20%) - Test component interactions and API endpoints
3. **End-to-End Tests** (10%) - Test complete user workflows

**Testing Tools**:

- **Python**: pytest, unittest, coverage.py
- **JavaScript/TypeScript**: Jest, Vitest, Playwright (E2E)
- **Go**: Built-in testing package, testify for assertions
- **API Testing**: Postman collections, RestAssured, or Supertest

**Test-Driven AI Workflow**:

- When requesting code from AI agents, first request test cases
- Example: "Write comprehensive test cases for a password reset feature that handles valid requests, expired tokens, invalid emails, and security edge cases"
- Review and approve tests before requesting implementation
- This ensures requirements are clear and implementation can be validated


### 5.2 Continuous Integration

**CI Pipeline Requirements**:

1. **Build**: Compile/transpile code and dependencies
2. **Lint**: Run code style and syntax checks
3. **Test**: Execute full test suite with coverage reporting
4. **Security Scan**: Check dependencies for vulnerabilities (Snyk, Trivy, OWASP Dependency-Check)
5. **Build Artifacts**: Create Docker images or deployment packages
6. **Deploy**: Automatic deployment to staging/development environments

**Quality Gates**:

- Minimum 80% code coverage for new code
- Zero critical security vulnerabilities
- All linting and formatting checks pass
- All tests pass successfully
- Build completes in under 10 minutes

***

## 6. AI Agent Interaction Guidelines

### 6.1 Effective Prompting

**Always provide in your prompts**:

- **Programming language** and version: "Using Python 3.11..."
- **Framework/library versions**: "With FastAPI 0.104..."
- **Specific requirements**: Input/output formats, constraints, edge cases
- **Context**: Relevant existing code, architecture patterns, conventions
- **Success criteria**: How to validate the solution works correctly

**Example Good Prompt**:

```
Using TypeScript with React 18 and Tailwind CSS, create a responsive user 
profile card component that:
- Accepts props for name, avatar URL, bio, and social links
- Displays a placeholder image if avatar URL is invalid
- Truncates bio text after 3 lines with a "Read more" button
- Follows our project's component structure in src/components/
- Includes unit tests using Jest and React Testing Library
- Uses semantic HTML and ARIA attributes for accessibility
```

**Example Poor Prompt**:

```
Make a profile card
```


### 6.2 Iterative Development with AI

**Best Practices**:

- Start conversations with clear project context from WARP.md or CLAUDE.md
- Request explanations alongside code to understand the approach
- Ask for multiple solution approaches when tackling complex problems
- Validate AI outputs incrementally rather than accepting large code blocks blindly
- Start a fresh conversation if context exceeds ~50 exchanges to avoid drift

**Steering AI Agents**:

- Use Warp's diff view to review changes line-by-line before acceptance
- Interject with refinements as code is generated: "Add error handling for network timeouts"
- Reference specific files or code sections with @ mentions
- Use slash commands efficiently: `/init` for project setup, `/docs` for documentation


### 6.3 Multi-Agent Coordination

**When to use multiple AI agents**:

- **Architectural Planning**: Claude for high-level system design
- **Rapid Implementation**: GitHub Copilot for boilerplate and repetitive code
- **Multi-file Refactoring**: Cursor for complex cross-file changes
- **Testing & Validation**: Cline for automated test execution
- **DevOps & Infrastructure**: Gemini CLI for terminal-based workflows

**Parallel Development Pattern**:
For complex features, run separate AI instances on different aspects:

- Instance 1: Frontend UI components
- Instance 2: Backend API implementation
- Instance 3: Testing, integration, and documentation

Each instance maintains focused context without confusion from unrelated concerns

***

## 7. Security & Compliance

### 7.1 Security Requirements

**Authentication & Authorization**:

- Implement multi-factor authentication (MFA) for production systems
- Use role-based access control (RBAC) with principle of least privilege
- Enforce strong password policies: minimum 12 characters, complexity requirements
- Implement rate limiting and request throttling on all public APIs
- Log all authentication attempts and authorization failures

**Data Protection**:

- Encrypt sensitive data at rest using AES-256 or equivalent
- Use TLS 1.3 for all data in transit
- Implement proper input validation and sanitization to prevent injection attacks
- Never log sensitive information (passwords, tokens, PII)
- Comply with GDPR/CCPA for user data handling

**Secrets Management**:

- Store secrets in environment variables or dedicated vaults (HashiCorp Vault, AWS Secrets Manager)
- Rotate API keys and credentials quarterly minimum
- Use separate credentials for each environment (dev, staging, production)
- Never commit `.env` files; use `.env.example` as a template
- Scan commits for accidentally exposed secrets using tools like git-secrets or TruffleHog


### 7.2 AI Agent Governance

**Agent Permissions & Guardrails**:

- AI agents require explicit approval for:
    - Deleting files or databases
    - Modifying production configurations
    - Executing privileged system commands
    - Making external API calls that incur costs
    - Committing and pushing to protected branches

**Audit & Compliance**:

- Log all AI-generated code with timestamps and prompts used
- Maintain version history of WARP.md and agent configuration files
- Review AI agent activities quarterly to identify patterns and improve workflows
- Document agent capabilities and limitations for team awareness

***

## 8. Monitoring & Observability

### 8.1 Logging Standards

**Log Levels** (use appropriately):

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages about application flow
- **WARNING**: Potential issues that don't prevent functionality
- **ERROR**: Errors that impact specific operations
- **CRITICAL**: System-level failures requiring immediate attention

**Structured Logging**:

- Use JSON format for machine-readable logs
- Include: timestamp, level, message, service name, correlation ID, user ID (if applicable)
- Centralize logs using ELK Stack, Grafana Loki, or cloud-native solutions
- Implement log retention policies: 30 days for dev, 90 days for production


### 8.2 Metrics & Alerting

**Key Metrics to Monitor**:

- **Application**: Request rate, error rate, response time, throughput
- **Infrastructure**: CPU usage, memory usage, disk I/O, network traffic
- **Business**: User signups, transaction volume, feature usage
- **Security**: Failed login attempts, unauthorized access, API rate limit hits

**Alerting Strategy**:

- Define clear SLOs (Service Level Objectives) and SLIs (Service Level Indicators)
- Alert on SLO violations, not every anomaly
- Include runbook links in alert messages
- Implement escalation policies: warning → critical → on-call
- Use PagerDuty, Opsgenie, or similar for critical production alerts

***

## 9. Deployment & Release Management

### 9.1 Deployment Strategy

**Environment Progression**:

1. **Local Development**: Developer machines with Docker Compose
2. **Development/Integration**: Shared environment, automatic deployments from `develop` branch
3. **Staging**: Production-like environment, automatic deployments from `release/*` branches
4. **Production**: Manual approval required, deployed from `main` branch

**Deployment Methods**:

- **Rolling Deployment**: Gradual replacement of instances (default for stateless services)
- **Blue-Green Deployment**: Switch traffic between two identical environments
- **Canary Deployment**: Route small percentage of traffic to new version first
- **Feature Flags**: Enable/disable features without redeployment using LaunchDarkly or similar


### 9.2 Rollback Procedures

**Pre-deployment**:

- Tag releases with semantic versioning: `v1.2.3`
- Create database backups before schema migrations
- Document rollback steps in deployment runbook
- Test rollback procedures in staging environment

**Rollback Triggers**:

- Error rate exceeds 5% of requests
- Critical functionality broken (login, payments, core features)
- Security vulnerability discovered in deployment
- Performance degradation beyond acceptable thresholds

**Rollback Process**:

1. Notify team via communication channel (Slack, Teams)
2. Execute automated rollback script or manual procedure
3. Verify rollback success with smoke tests
4. Conduct post-incident review within 24 hours

***

## 10. Performance Optimization

### 10.1 Code Performance

**General Guidelines**:

- Profile before optimizing; don't guess at bottlenecks
- Use caching strategically (Redis, CDN, browser cache)
- Implement database query optimization: indexes, query analysis, connection pooling
- Lazy load resources when possible; avoid loading unused dependencies
- Minimize network requests; batch API calls where appropriate
- Use async/await patterns for I/O-bound operations

**Performance Budgets**:

- API response time: < 200ms for p95
- Web page load time: < 3 seconds
- Database queries: < 50ms for simple queries
- Background jobs: Complete within defined SLAs


### 10.2 Infrastructure Optimization

**Resource Efficiency**:

- Right-size compute resources; avoid over-provisioning
- Implement auto-scaling for variable workloads
- Use spot instances or preemptible VMs for non-critical workloads
- Optimize Docker images: use multi-stage builds, minimal base images
- Implement CDN for static assets and media files

***

## 11. Disaster Recovery & Business Continuity

### 11.1 Backup Strategy

**3-2-1 Backup Rule**:

- **3** copies of data
- **2** different storage media types
- **1** copy off-site

**Backup Schedule**:

- **Databases**: Automated daily backups, retain for 30 days
- **Configuration Files**: Version controlled in Git
- **Application Data**: Daily incremental, weekly full backups
- **Infrastructure State**: Terraform state stored in remote backend with versioning
- **Test Restores**: Monthly validation of backup integrity and restore procedures


### 11.2 Incident Response

**Incident Classification**:

- **P0 (Critical)**: Complete service outage, data loss, security breach
- **P1 (High)**: Major feature broken, significant performance degradation
- **P2 (Medium)**: Minor feature broken, some users affected
- **P3 (Low)**: Cosmetic issues, minimal user impact

**Response Process**:

1. **Detection**: Automated monitoring alerts or user reports
2. **Triage**: Assess severity and assign incident commander
3. **Communication**: Update status page, notify stakeholders
4. **Resolution**: Execute runbook procedures, apply fixes
5. **Post-Mortem**: Document timeline, root cause, action items (blameless)

***

## 12. Collaboration & Communication

### 12.1 Team Communication

**Communication Channels**:

- **Synchronous**: Slack/Teams for real-time discussions, video calls for complex topics
- **Asynchronous**: Email for formal communications, GitHub/GitLab for code discussions
- **Documentation**: Confluence, Notion, or Wiki for knowledge base
- **Status Updates**: Daily standups (15 min), weekly team meetings, monthly retrospectives

**Documentation Culture**:

- Document decisions in ADRs (Architecture Decision Records)
- Maintain up-to-date runbooks for operational procedures
- Share knowledge through internal tech talks and brown bags
- Write post-mortems for incidents and outages


### 12.2 Onboarding

**New Developer Onboarding**:

- Provide comprehensive README.md with setup instructions
- Maintain a `CONTRIBUTING.md` with development workflow
- Offer a "good first issue" label for beginner-friendly tasks
- Pair programming sessions for first week
- Assign a mentor for the first 30 days

***

## 13. Project-Specific Overrides

**Note**: This is a global WARP.md file. Create project-specific `WARP.md` files in repository roots to override these defaults with project-specific requirements.

**Example Override Structure**:

```markdown
# Project Name WARP.md

## Overrides from Global WARP.md
- **Language**: This project uses Java 17 with Spring Boot
- **Database**: MySQL 8.0 instead of PostgreSQL
- **Build Tool**: Maven instead of npm/pip
- **Deployment**: AWS ECS with Fargate

## Project-Specific Rules
[Add project-specific guidelines here]
```

Warp automatically applies rules in this precedence order:

1. Subdirectory WARP.md (most specific)
2. Root directory WARP.md (project-level)
3. Global WARP.md (this file)

***

## 14. Continuous Improvement

### 14.1 Regular Reviews

**Quarterly Activities**:

- Review and update this WARP.md file
- Audit AI agent performance and refine prompts
- Update dependencies and address technical debt
- Conduct security vulnerability assessments
- Review and optimize infrastructure costs

**Annual Activities**:

- Comprehensive architecture review
- Disaster recovery drill and backup restore test
- Technology stack evaluation and upgrade planning
- Team retrospective and process improvements


### 14.2 Learning & Development

**Stay Current**:

- Subscribe to relevant newsletters and blogs (DevOps Weekly, Node Weekly, Python Weekly)
- Attend conferences or watch recorded talks
- Contribute to open-source projects
- Experiment with new technologies in home lab environment
- Share learnings with team through presentations or documentation

***

## 15. Emergency Contacts & Resources

**Critical Resources** (customize for your environment):

- **Documentation**: [Link to internal wiki/Confluence]
- **On-Call Schedule**: [Link to PagerDuty/Opsgenie]
- **Monitoring Dashboard**: [Link to Grafana/Datadog]
- **CI/CD Pipeline**: [Link to GitHub Actions/Jenkins]
- **Infrastructure Management**: [Link to cloud console/Terraform Cloud]
- **Team Chat**: [Slack workspace URL]

**Support Escalation**:

- Level 1: Team lead or senior developer
- Level 2: Engineering manager or DevOps lead
- Level 3: CTO or external vendor support

***

## Document Metadata

- **Version**: 1.0.0
- **Last Updated**: November 19, 2025
- **Owner**: [Your Name/Team]
- **Review Schedule**: Quarterly
- **License**: Internal Use Only

***

## Quick Reference Summary

**For AI Agents working on this codebase**:

✅ **DO**:

- Write tests before or alongside implementation
- Use explicit error handling with meaningful messages
- Follow conventional commit format
- Document complex logic with inline comments
- Request human review for security-sensitive changes
- Use environment variables for configuration
- Implement structured logging with correlation IDs

❌ **DON'T**:

- Hardcode credentials, API keys, or sensitive data
- Skip writing tests for new functionality
- Make breaking changes without version bumps
- Commit directly to main or protected branches
- Delete resources without backup verification
- Merge PRs without passing CI/CD checks
- Expose internal implementation details in public APIs