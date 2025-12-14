# Testing and Quality Assurance for Claude Commands and Agents

## Purpose
This document explains strategies for validating, testing, and assuring the quality, safety, and correctness of Claude commands and agents throughout their lifecycle.

## Testing Framework Overview

- Ensure agents and commands work as specified under realistic project scenarios
- Detect errors and regression proactively before production use
- Implement both automated and manual review loops

## Types of Testing
### Prompt-Driven Testing
- Design natural language prompts or scenarios for agents/commands to handle
- Validate correct responses, tool usage, and code modifications
- Use benchmark datasets for reproducibility when possible

### Static Analysis
- Run shell safety, linting, and configuration validation tools on command files
- Scan for dangerous patterns in allowed-tools or execution logic
- Confirm versioning and documentation fields are present and correct

### Automated Test Suites
- Configure agents to trigger test execution on code changes (e.g., npm test, pytest)
- Use hooks to run tests before approving PRs or merging changes
- Require passing status for deployment or release

### Manual Review and Peer Validation
- Require human review of code, configuration, and command files for security and correctness
- Use structured checklists covering role assignments, permission boundaries, context handling, and error recovery

## Quality Assurance Checklist
- Clear and tested command arguments ($1, $2, ...) and context references (@file)
- Allowed-tools explicitly scoped and validated
- Documentation and rationale in frontmatter and prompt body
- Validation or test steps included in command/agent workflow where feasible
- Proper error handling and clear user-facing messages
- Audit entries/logs of material actions

## Ongoing Maintenance
- Retest all commands and agents after significant model updates or toolchain changes
- Iterate on test coverage and expand edge cases based on observed failures
- Schedule regular audits for permission creep, stale commands, and agent role drift
