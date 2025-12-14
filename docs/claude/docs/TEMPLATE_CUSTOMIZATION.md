# **Template Adaptation Prompt for Project-Specific Claude Commands, Agents, and Skills**

## 🎯 **Purpose**

This prompt template helps you leverage the `claude-command-and-control` repository to create custom, project-specific Claude commands, agents, and skills tailored to your unique development workflow, tech stack, and team structure.

***

## 📋 **How to Use This Prompt**

Copy the template below and fill in your project-specific details, then provide it to Claude (in Cursor IDE, Claude.ai, or any Claude-enabled environment) to generate customized templates.

***

## 🔧 **Universal Adaptation Prompt Template**

```markdown
# Project-Specific Claude Template Adaptation Request

## Context
I'm using the claude-command-and-control repository (https://github.com/enuno/claude-command-and-control) as a git submodule in my project. I need to adapt the generic templates to create project-specific Claude commands, agents, and/or skills.

## Project Information

### Project Details
- **Project Name**: [Your project name]
- **Project Type**: [e.g., Web API, Mobile App, Data Pipeline, Infrastructure, ML Model]
- **Primary Language(s)**: [e.g., Python, TypeScript, Go, Rust]
- **Tech Stack**: [Key frameworks, libraries, tools - e.g., FastAPI, React, Kubernetes, PostgreSQL]
- **Repository URL**: [Your repo URL or "N/A if private"]
- **Development Environment**: [e.g., Docker containers, local dev, cloud workspaces]

### Team Structure
- **Team Size**: [Solo developer, 2-5 devs, 5-10 devs, 10+ devs]
- **Collaboration Model**: [Solo, pair programming, code review workflow, multi-agent AI-assisted]
- **Primary Communication**: [GitHub PRs, Slack, linear issues, etc.]

### Current Workflow Challenges
[Describe 2-3 specific pain points in your current development workflow]
1. [Challenge 1 - e.g., "Inconsistent PR descriptions across team members"]
2. [Challenge 2 - e.g., "Manual deployment checklist prone to human error"]
3. [Challenge 3 - e.g., "Documentation falls out of sync with code changes"]

### Security & Compliance Requirements
- **Security Level**: [Low/Medium/High - affects allowed-tools permissions]
- **Compliance Standards**: [e.g., SOC2, HIPAA, PCI-DSS, or "None"]
- **Restricted Operations**: [Any operations that require human approval - e.g., database mutations, production deployments]
- **Secret Management**: [How secrets are handled - e.g., .env files, Vault, AWS Secrets Manager]

---

## Template Adaptation Request

### What I Need (Select One or More)

#### [ ] Commands
**Base Template**: [e.g., start-session, pr, test-all, docs]
**Adaptation Goal**: [What specific behavior needs customization]

**Project-Specific Customizations Needed**:
- **File Paths**: [e.g., "Our docs are in /documentation not /docs"]
- **Tool Commands**: [e.g., "We use pnpm not npm", "pytest instead of jest"]
- **Workflow Steps**: [e.g., "Must update Notion database after PR creation"]
- **Validation Rules**: [e.g., "All commits must reference Linear.app tickets"]
- **Output Format**: [e.g., "Generate reports as JSON for CI/CD consumption"]

**Example Usage Scenario**:
[Describe a specific situation where this command would be used]
```

Example: "Developer finishes implementing a feature on branch feat/user-auth.
They run /pr and need it to:

1. Run our custom pre-commit hooks (black, mypy, ruff)
2. Generate PR description using our Linear.app ticket template
3. Auto-assign reviewers based on CODEOWNERS
4. Post PR link to \#engineering Slack channel
5. Update Linear.app ticket status to 'In Review'"
```

#### [ ] Agents
**Base Template**: [e.g., architect, builder, validator, scribe, devops]
**Adaptation Goal**: [What role specialization is needed]

**Project-Specific Customizations Needed**:
- **Domain Expertise**: [e.g., "Builder must understand Kubernetes CRDs"]
- **Tools & Access**: [e.g., "DevOps needs kubectl, helm, terraform access"]
- **Context Files**: [Which project files agent must always load - e.g., API_STANDARDS.md, ARCHITECTURE.md]
- **Validation Criteria**: [e.g., "Validator must check OpenAPI spec compliance"]
- **Handoff Protocols**: [How this agent coordinates with others]

**Example Agent Workflow**:
[Describe a multi-step task this agent would handle]
```

Example: "Validator agent receives Builder's completed API endpoint.
Must:

1. Verify OpenAPI spec updated with new route
2. Check unit tests achieve >80% coverage
3. Run integration tests against staging DB
4. Validate request/response examples in docs
5. Security scan for SQL injection vulnerabilities
6. Generate test coverage report for PR comment"
```

#### [ ] Skills
**Base Template**: [e.g., documentation-update, skill-creator, file-categorization]
**Adaptation Goal**: [What repeating workflow needs automation]

**Project-Specific Customizations Needed**:
- **Trigger Conditions**: [When this skill activates - e.g., "On PR merge to main"]
- **Input Requirements**: [What data/context skill needs]
- **Workflow Steps**: [Detailed automation sequence]
- **Success Criteria**: [How to validate skill executed correctly]
- **Failure Recovery**: [What to do if skill encounters errors]

**Example Skill Workflow**:
[Describe the repeating task this skill automates]
```

Example: "After merging feature branch to main, skill must:

1. Extract version bump from CHANGELOG.md
2. Update package.json version field
3. Generate GitHub release notes from commit messages
4. Build and tag Docker image with new version
5. Update Helm chart version in k8s/Chart.yaml
6. Post release announcement to Slack \#releases"
```

---

## Template Requirements

### Security & Permissions
**Allowed Tools** (select appropriate level):
- [ ] **Read-Only** (`["Read", "Search"]`) - No file modifications
- [ ] **Development** (`["Read", "Search", "Edit", "Test", "Bash(git:*)"]`) - Standard development
- [ ] **Operations** (`["Read", "Edit", "Bash(git:*)", "Bash(docker:*)", "Bash(kubectl:*)"]`) - Infrastructure work
- [ ] **Custom** - Specify: `[Your custom allowed-tools array]`

**Human Approval Required For**:
[List operations requiring confirmation - e.g., "Merging to main", "Deleting files", "Production deployments"]

### Documentation Standards
- **Code Comments**: [Style - e.g., Google docstrings, JSDoc, rustdoc]
- **API Documentation**: [Format - e.g., OpenAPI/Swagger, GraphQL schema, gRPC proto]
- **Architecture Docs**: [Location and format - e.g., /docs/architecture/*.md, ADRs in /decisions/]
- **Changelog Format**: [Convention - e.g., Keep a Changelog, Conventional Commits]

### Quality Gates
**Required Before PR Merge**:
- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage >= [X]%
- [ ] Linter/formatter passes
- [ ] Security scan clean
- [ ] Documentation updated
- [ ] Changelog entry added
- [ ] [Other project-specific checks]

**Testing Framework Details**:
- **Unit Tests**: [Framework - e.g., pytest, jest, go test]
- **Integration Tests**: [Framework and setup]
- **E2E Tests**: [Framework and environment]
- **Coverage Tool**: [e.g., coverage.py, Istanbul, go cover]
- **Test Command**: [e.g., `npm test`, `pytest tests/`, `go test ./...`]

### Integration Points
**External Systems to Integrate**:
- [ ] **Issue Tracking**: [e.g., Jira, Linear, GitHub Issues] - API details: [URL/auth method]
- [ ] **CI/CD**: [e.g., GitHub Actions, GitLab CI, Jenkins] - Integration method: [webhooks, API calls]
- [ ] **Communication**: [e.g., Slack, Discord, Teams] - Webhook URL: [Location of secret]
- [ ] **Monitoring**: [e.g., Datadog, New Relic, Prometheus] - How to trigger alerts: [API/config]
- [ ] **Documentation**: [e.g., Notion, Confluence, GitBook] - Sync method: [API, git submodule]

---

## Output Requirements

### Deliverables Requested
Please generate:
1. **Adapted Template File(s)**: Complete .md files ready to use in my `.claude/` directory
2. **Configuration Variables Reference**: Document of all `{{PLACEHOLDER}}` variables I need to configure
3. **Installation Instructions**: Step-by-step setup guide specific to my project
4. **Testing Procedure**: How to validate the templates work correctly
5. **Example Usage Scenarios**: 2-3 concrete examples demonstrating the templates in action

### File Locations
- **Commands**: Should be created in `.claude/commands/[command-name].md`
- **Agents**: Should be created in `.claude/agents/[agent-name].md`
- **Skills**: Should be created in `.claude/skills/[skill-name]/SKILL.md`

### Success Criteria
The adapted templates should:
- [ ] Work without modification after variable substitution
- [ ] Follow repository security model (explicit allowed-tools)
- [ ] Include comprehensive inline documentation
- [ ] Handle common error conditions gracefully
- [ ] Integrate seamlessly with existing project workflow
- [ ] Be maintainable by team members unfamiliar with claude-command-and-control

---

## Additional Context

### Reference Documentation
Available in claude-command-and-control repository:
- **Core Principles**: `@docs/best-practices/01-Introduction-and-Core-Principles.md`
- **Command Creation**: `@docs/best-practices/02-Individual-Command-Creation.md`
- **Agent Configuration**: `@docs/best-practices/03-Individual-Agent-Configuration.md`
- **Skills Guide**: `@docs/best-practices/08-Claude-Skills-Guide.md`
- **Multi-Agent Orchestration**: `@docs/best-practices/11-multi-agent-development-architecture.md`

### Special Considerations
[Any unique aspects of your project that need special handling]
- [e.g., "Monorepo with 10 microservices - commands need to handle workspace selection"]
- [e.g., "Requires VPN connection for production deployments - agents must validate connectivity"]
- [e.g., "Multi-region deployment - must coordinate rollouts across 3 AWS regions"]

---

## Questions for Claude

Before you generate the templates, please ask me clarifying questions about:
1. [Specific aspect you want guidance on - e.g., "How should error reporting work?"]
2. [Area where multiple approaches exist - e.g., "Should agents spawn subagents or work sequentially?"]
3. [Security/compliance gray areas - e.g., "Can DevOps agent auto-merge hotfixes?"]
```


***

## 📚 **Quick Start Examples**

### Example 1: Adapting `/start-session` for Python FastAPI Project

```markdown
## Context
Project: FastAPI microservices API
Language: Python 3.11
Stack: FastAPI, SQLAlchemy, PostgreSQL, Docker, Kubernetes

## Template Adaptation Request
**Base Template**: start-session.md
**Adaptation Goal**: Initialize session with Python environment validation and database connection check

**Customizations Needed**:
- Load `@API_STANDARDS.md` and `@DATABASE_SCHEMA.md` in addition to standard files
- Validate Python virtual environment is activated
- Check PostgreSQL connection via `docker-compose ps db`
- Load OpenAPI spec from `app/api/openapi.json`
- Display last 3 database migrations from `alembic/versions/`

**Security**: Development level - allow Read, Search, Edit, Bash(git:*), Bash(docker:ps), Bash(python:*)
```


### Example 2: Creating Project-Specific Builder Agent

```markdown
## Context
Project: Kubernetes infrastructure automation
Language: Go
Stack: Kubernetes, Helm, Terraform, AWS

## Template Adaptation Request
**Base Template**: builder.md (agent)
**Adaptation Goal**: Builder specialized in Kubernetes CRD development

**Customizations Needed**:
- Must understand Kubernetes API conventions
- Required context: `@k8s/API_CONVENTIONS.md`, `@k8s/CONTROLLER_PATTERNS.md`
- Allowed tools: kubectl, helm, kubebuilder
- Must validate CRD manifests with `kubectl apply --dry-run=client`
- Generate corresponding Go controller stubs using kubebuilder
- Create Helm chart templates automatically

**Handoff Protocol**: After implementation, passes to Validator agent who runs e2e tests in kind cluster
```


### Example 3: Custom Skill for Release Automation

```markdown
## Context
Project: Open-source TypeScript library
Language: TypeScript
Stack: npm, GitHub Actions, semantic-release

## Template Adaptation Request
**Base Template**: skill-creator.md → create new skill
**Adaptation Goal**: Automate semantic versioning release workflow

**Workflow Steps**:
1. Parse commit messages since last release (conventional commits)
2. Determine version bump (patch/minor/major)
3. Update package.json version
4. Generate CHANGELOG.md entry from commits
5. Create git tag with version
6. Build npm package with `npm run build`
7. Publish to npm with `npm publish --dry-run` first
8. Create GitHub release with changelog
9. Post announcement to Discord #releases webhook

**Trigger**: Manual `/release` command or on merge to main with [release] tag
**Security**: Requires human approval before `npm publish` step
```


***

## 🎯 **Best Practices for Template Adaptation**

### Do's ✅

- **Be Specific**: Provide exact file paths, command syntax, and tool versions
- **Include Examples**: Real-world scenarios help Claude understand context
- **Document Constraints**: Security, compliance, and technical limitations upfront
- **Request Validation**: Ask for testing procedures and success criteria
- **Think Iteratively**: Start with one template, refine, then expand


### Don'ts ❌

- **Don't Assume**: Claude doesn't know your internal conventions - be explicit
- **Don't Skip Security**: Always define allowed-tools and approval gates
- **Don't Forget Error Handling**: Specify what should happen when things fail
- **Don't Overload**: Adapt one template at a time for complex projects
- **Don't Hardcode Secrets**: Use placeholders like `{{SLACK_WEBHOOK_URL}}`

***

## 🔄 **Iterative Refinement Workflow**

1. **Initial Generation**: Use adaptation prompt to create first draft
2. **Manual Testing**: Try template in real development scenario
3. **Identify Gaps**: Note what doesn't work or what's missing
4. **Refine Prompt**: Add missed requirements and re-generate
5. **Team Review**: Have teammates test and provide feedback
6. **Finalize**: Document configuration variables and commit to repo
7. **Maintain**: Update templates as project evolves

***

## 📖 **Integration with Repository Structure**

When using templates created from this adaptation process, organize them as:

```
your-project/
├── .claude/
│   ├── commands/
│   │   ├── start-session.md          # Adapted from template
│   │   ├── deploy-staging.md         # Project-specific
│   │   └── run-migrations.md         # Project-specific
│   ├── agents/
│   │   ├── k8s-builder.md            # Specialized builder
│   │   ├── api-validator.md          # API-focused validator
│   │   └── docs-scribe.md            # Documentation specialist
│   └── skills/
│       ├── release-automation/
│       │   └── SKILL.md
│       └── database-migration/
│           └── SKILL.md
├── docs/
│   └── claude/                        # Git submodule
│       ├── README.md                  # claude-command-and-control
│       ├── docs/
│       ├── templates/
│       └── ...
└── README.md
```

Reference submodule templates in your project's `CLAUDE.md`:

```markdown
# Claude Configuration

## Template Sources
This project uses templates adapted from claude-command-and-control:
- Base repository: docs/claude/
- Project-specific implementations: .claude/
- Adaptation documentation: docs/TEMPLATE_CUSTOMIZATION.md
```
