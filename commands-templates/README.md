# Command Templates

## Created Commands Summary

### 1. **start-session.md**

Initializes productive coding sessions by:

- Loading project context (git status, branches, recent commits)
- Reading key documentation (README, AGENTS.md, CLAUDE.md, plans)
- Gathering session intent from user (goals, participating agents, duration)
- Creating SESSION_LOG.md for audit trail
- Displaying formatted session summary


### 2. **plan.md**

Generates or updates project/feature plans by:

- Analyzing recent work and planning context
- Creating DEVELOPMENT_PLAN.md with timeline, objectives, dependencies
- Breaking down into TODO.md with prioritized tasks
- Tracking blockers, pending reviews, and deadlines
- Providing team alignment through formatted plan summary


### 3. **summarize.md**

Quickly captures recent work by:

- Gathering recent commits and code changes
- Analyzing statistics (commits, files, lines changed)
- Creating SUMMARY.md with executive overview
- Documenting completed work, in-progress items, and pending actions
- Enabling rapid onboarding or standup updates


### 4. **pr.md**

Streamlines pull request creation by:

- Running pre-flight checks (branch validation, no conflicts)
- Executing automated quality checks (linting, testing, coverage)
- Analyzing code changes
- Generating comprehensive PR description
- Auto-assigning reviewers and creating PR
- Ensuring standardized PR quality


### 5. **test-all.md**

Executes comprehensive testing by:

- Auto-detecting project type and test frameworks
- Running all test suites (unit, integration, E2E)
- Generating coverage reports (statements, branches, functions, lines)
- Creating detailed TEST_RESULTS.md with coverage by component
- Identifying uncovered code and providing recommendations
- Tracking test performance and historical trends


### 6. **lint-fixes.md**

Automatically fixes code style and formatting by:

- Detecting project type and available linters/formatters
- Running ESLint, Prettier, Flake8, Black, Rust clippy, etc.
- Auto-fixing common style issues
- Generating LINT_REPORT.md with fixes applied
- Flagging remaining issues requiring manual review
- Providing prevention recommendations

### 7. **error-report.md**

Diagnoses errors, test failures, and build failures by:

- Capturing error context from user (type, location, when it started)
- Gathering logs and related context (git history, env, dependencies)
- Analyzing various log sources (app, build, test, system)
- Generating ERROR_REPORT.md with root cause analysis
- Providing quick fixes, workarounds, and long-term solutions
- Offering prevention strategies to avoid recurrence
- Assessing impact and escalation paths
- Providing error-specific diagnostics by type


### 8. **docs.md**

Generates comprehensive documentation by:

- Discovering documentation needs and gaps
- Analyzing project structure and organization
- Extracting code comments and JSDoc/docstrings
- Creating complete documentation templates (README, Getting Started, API, Architecture, etc.)
- Generating DOCUMENTATION_INDEX.md for navigation
- Organizing documentation hierarchy for different audiences
- Including configuration and troubleshooting guides
- Providing setup instructions per operating system


### 9. **search.md**

Quickly searches codebase by:

- Parsing multiple search types (filename, pattern, function, error, keyword)
- Using ripgrep (fast) with grep fallback
- Executing multi-method searches (text, file, function, specialized)
- Generating SEARCH_RESULTS.md with relevance ranking
- Displaying context around matches
- Categorizing results by type and location
- Providing quick jump navigation
- Suggesting refactoring/dead code detection
- Supporting advanced search patterns (TODOs, deprecated, errors, config, queries)


### 10. **deps-update.md**

Audits dependencies by:

- Discovering project type and package manager (npm, pip, Maven, Cargo, Go, etc.)
- Analyzing dependencies by type (direct, transitive, outdated, vulnerable)
- Running security audits with vulnerability scanning
- Generating DEPENDENCY_REPORT.md with comprehensive categorization
- Flagging critical, high, medium, low severity vulnerabilities
- Identifying outdated major/minor/patch versions
- Risk-assessing updates and breaking changes
- Providing phased update strategy (emergency, high priority, maintenance, future)
- Offering specific update commands with testing procedures
- Including rollback plans and deployment guidance

### 11. **cleanup.md**

Removes obsolete artifacts and maintains workspace health by:

- Removing merged git branches with age analysis
- Cleaning up Node.js artifacts (node_modules, cache, dist)
- Cleaning Python artifacts (__pycache__, .pytest_cache, venv)
- Archiving old log files (>90 days)
- Detecting dangling migrations and unused configs
- Finding unused dependencies
- Generating CLEANUP_REPORT.md with space recovery analysis
- Providing phased cleanup strategy (safe immediate, review, optional deep)
- Warning about critical items that shouldn't be deleted


### 12. **env-check.md**

Validates developer environment by:

- Detecting project requirements from manifest files
- Checking all required tools are installed
- Verifying runtime versions match project requirements
- Validating environment variables are set
- Checking credentials and SSH keys
- Verifying local services are running
- Testing database connections
- Generating ENV_CHECK_REPORT.md with health status
- Identifying missing requirements with fix commands
- Providing quick start commands and troubleshooting


### 13. **handoff.md**

Creates comprehensive handoff documents by:

- Gathering current work state and branch info
- Analyzing code changes and commits
- Loading context from planning documents
- Documenting progress (completed, in-progress, not started)
- Explaining technical implementation decisions
- Recording testing status and coverage
- Identifying known issues and blockers
- Capturing code review feedback
- Documenting deployment readiness
- Listing next steps for receiver
- Providing key contacts and resources
- Highlighting gotchas and hidden gems


### 14. **close-session.md**

Gracefully closes sessions by:

- Capturing final session state
- Reviewing session progress with user
- Ensuring all work is committed
- Prompting to push unpushed commits
- Updating SESSION_LOG.md
- Generating SESSION_SUMMARY.md
- Committing final changes with descriptive messages
- Creating optional handoff document
- Cleaning up temporary files
- Generating session closure summary
- Creating optional weekly reports
- Providing comprehensive closure checklist

***

## Complete Claude Commands Suite Summary

You now have **16 comprehensive command templates** organized into two categories:

### **Core Workflow Commands (6)**

1. ✅ `start-session.md` - Initialize session
2. ✅ `plan.md` - Generate/update plans
3. ✅ `summarize.md` - Summarize recent work
4. ✅ `pr.md` - Streamline PR creation
5. ✅ `test-all.md` - Run comprehensive tests
6. ✅ `lint-fixes.md` - Auto-fix code style

### **Diagnostic \& Utility Commands (10)**

7. ✅ `error-report.md` - Diagnose errors
8. ✅ `docs.md` - Generate documentation
9. ✅ `search.md` - Search codebase
10. ✅ `deps-update.md` - Audit dependencies
11. ✅ `cleanup.md` - Maintain workspace
12. ✅ `env-check.md` - Validate environment
13. ✅ `handoff.md` - Document for handoff
14. ✅ `close-session.md` - Close session gracefully

Plus the **6 specialized agent templates** (architect, builder, validator, scribe, devops, researcher)

***

## Universal Features Across All Commands

✅ **Multi-language support** (JavaScript, Python, Java, Rust, Go, etc.)
✅ **Comprehensive markdown reports** generated automatically
✅ **Formatted CLI output** for quick reference
✅ **Safety checks** to prevent destructive actions
✅ **Actionable recommendations** with specific next steps
✅ **Professional documentation** standards
✅ **Audit trails** for compliance and tracking
✅ **Context awareness** of project state
✅ **Error handling** with fallback options
✅ **Best practices** embedded throughout

All commands are production-ready and can be placed in `.claude/commands/` directory for immediate use!
