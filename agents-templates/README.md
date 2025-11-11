# Agent Templates

## 1. **architect.md** - Professional Software Architect

- Analyzes codebases for improvements or guides greenfield projects
- Creates planning documents: DEVELOPMENT_PLAN.md, TODO.md, ARCHITECTURE.md, TECH_STACK.md, SECURITY.md
- Performs architecture assessments with scoring frameworks
- Handles requirements gathering and system design
- Manages handoffs to other specialized agents


## 2. **builder.md** - Professional Full-Stack Developer

- Breaks architecture into implementable multi-phase development plans
- Creates IMPLEMENTATION_PLAN.md with granular task breakdown
- Follows TDD approach with comprehensive quality standards
- Manages git workflows and code integration
- Ensures testing, linting, and documentation before completion


## 3. **validator.md** - Professional QA Tester

- Creates comprehensive test plans and test suites
- Performs code reviews with structured feedback
- Validates test coverage (95%+ for critical paths)
- Conducts security reviews and vulnerability scanning
- Generates VALIDATION_REPORT.md and TEST_PLAN.md


## 4. **scribe.md** - Professional Technical Writer

- Analyzes codebases to produce comprehensive documentation
- Creates README.md, BUILDING.md, DEPLOYMENT.md, API.md, USAGE.md
- Documents build processes, deployment procedures, and usage guides
- Maintains documentation currency with code changes
- Provides detailed troubleshooting sections


## 5. **devops.md** - Professional DevOps Engineer

- Creates CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins)
- Implements Infrastructure as Code (Terraform examples)
- Sets up monitoring with Prometheus, Grafana, and alerting
- Manages multi-environment deployments (dev, QA, staging, prod)
- Implements blue-green deployments and rollback procedures


## 6. **researcher.md** - Professional Technical Researcher

- Conducts technology evaluations with comparison matrices
- Produces comprehensive research reports with recommendations
- Analyzes feature feasibility and competitive implementations
- Investigates technical problems with root cause analysis
- Creates RESEARCH_REPORT.md and RESEARCH_BRIEF.md


# Key Features of All Templates

✅ **Best Practices Integration**:

- Clear role definitions and responsibilities
- Comprehensive allowed-tools configurations with security restrictions
- Detailed workflow patterns with step-by-step procedures
- Context management strategies
- Collaboration protocols between agents
- Quality assurance checklists
- Example session start templates

✅ **Documentation Standards**:

- Semantic versioning (1.0.0)
- Professional structure with clear sections
- Real-world examples and code snippets
- Handoff protocols between agents
- Emergency procedures and troubleshooting

✅ **Security & Quality**:

- Least-privilege permissions
- Approval requirements for critical operations
- Comprehensive validation before production
- Audit trail requirements
- Error handling protocols

Each agent template is production-ready and can be placed in your `.claude/agents/` directory for immediate use with Claude or other AI coding assistants that support agent configurations.
