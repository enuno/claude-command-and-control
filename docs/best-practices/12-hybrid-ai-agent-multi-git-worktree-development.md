# **Hybrid AI Agent Development: Git Worktrees + Container Isolation**

**Mission:** Create a comprehensive best practices document that synthesizes two cutting-edge approaches for enabling **parallel, concurrent AI agent development** on the same codebase.

**Research Sources:**

1. **Analyze** the existing best practices framework at: `https://github.com/enuno/claude-command-and-control/tree/main/docs/best-practices`
    - Extract structural patterns, documentation conventions, and organizational principles
    - Identify gaps where parallel development strategies could be integrated
2. **Deep-dive** into these two methodologies:
    - **Claude Code + Git Worktrees**: Lightweight parallel development using isolated working directories with shared Git history
    - **Container-Based Agent Isolation**: Full sandbox environments using Docker/DevContainers for security and reproducibility

**Deliverable Requirements:**

Create a **production-ready best practices document** that:

- **Synthesizes** both approaches into a unified hybrid methodology
- **Defines** clear decision criteria for when to use worktrees vs. containers vs. both
- **Provides** step-by-step implementation workflows with executable commands
- **Addresses** critical considerations:
    - Conflict prevention and merge strategies
    - Resource management (disk space, memory, initialization overhead)
    - Security boundaries and process isolation
    - IDE/tooling configuration for multi-workspace development
    - Cleanup and maintenance procedures
    - Monitoring and progress tracking across parallel sessions
- **Includes** real-world scenarios and anti-patterns
- **Matches** the style, tone, and technical depth of the existing documentation at the referenced GitHub repo
- **Optimizes** for DevOps/infrastructure engineers working with autonomous AI agents in production environments

**Target Audience:** Senior DevOps engineers, infrastructure architects, and AI agent orchestration specialists building autonomous development systems.

**Format:** Structured markdown with code examples, decision trees, architecture diagrams (described), and quick-reference command snippets.

***

**Key Enhancements Made:**

- Added **specific URLs and citations** to research sources
- Made objectives **measurable and concrete** (e.g., "synthesis," "decision criteria," "step-by-step")
- Expanded **critical considerations** that weren't in the original
- Specified **target audience** to guide tone and technical depth
- Added **deliverable format** requirements for consistency
- Emphasized **hybrid methodology** as the core innovation
- Included **anti-patterns and real-world scenarios** for practical value
<span style="display:none"></span>

<div align="center">⁂</div>

: [https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)

: [https://www.anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices)

: [https://www.youtube.com/watch?v=an-Abb7b2XM](https://www.youtube.com/watch?v=an-Abb7b2XM)

: [https://stevekinney.com/courses/ai-development/git-worktrees](https://stevekinney.com/courses/ai-development/git-worktrees)

: [https://dev.to/siddhantkcode/isolating-ai-agents-with-devcontainer-a-secure-and-scalable-approach-4hi4](https://dev.to/siddhantkcode/isolating-ai-agents-with-devcontainer-a-secure-and-scalable-approach-4hi4)

: [https://www.infoq.com/news/2025/08/container-use/](https://www.infoq.com/news/2025/08/container-use/)

: [https://kitemetric.com/blogs/secure-ai-agents-with-devcontainers-isolated-dev-environments](https://kitemetric.com/blogs/secure-ai-agents-with-devcontainers-isolated-dev-environments)

Now I'll generate the comprehensive best practices document based on all the research gathered.

# Hybrid AI Agent Development: Git Worktrees + Container Isolation

**Production Best Practices for Parallel, Concurrent AI Agent Development**

**Version**: 1.0.0
**Target Audience**: Senior DevOps engineers, infrastructure architects, and AI agent orchestration specialists
**Last Updated**: November 23, 2025

***

## 1. Introduction and Executive Summary

### The Parallel Development Imperative

The emergence of autonomous AI coding agents has fundamentally transformed software development workflows. Traditional sequential development—where a single agent works through tasks one-by-one—leaves significant productivity gains untapped. Modern development demands parallel execution strategies that leverage the non-deterministic nature of large language models as a feature rather than a limitation.

**The Core Insight**: Running multiple AI agents simultaneously on different implementations of the same specification produces diverse, valid solutions. This enables developers to select optimal implementations, cherry-pick superior approaches, or validate correctness through redundancy.

This document synthesizes two proven isolation methodologies into a unified hybrid framework:

- **Git Worktrees**: Lightweight filesystem isolation sharing Git history
- **Container-Based Isolation**: Full sandbox environments using Docker/DevContainers


### Document Scope and Target Audience

**Primary Audience**: Infrastructure engineers and DevOps specialists building autonomous AI agent orchestration systems in production environments.

**Prerequisites**:

- Advanced Git proficiency including branching strategies and merge workflows
- Docker and container orchestration experience
- Understanding of CI/CD pipeline architecture
- Familiarity with Claude Code, Cursor, or similar AI coding agents

**Out of Scope**: Basic Git tutorials, Docker fundamentals, or introductory AI agent concepts.

### Key Decision Framework Overview

| **Criterion** | **Git Worktrees** | **Containers** | **Hybrid** |
| :-- | :-- | :-- | :-- |
| **Isolation Level** | Filesystem only | Full process isolation | Maximum isolation |
| **Setup Time** | Instant (<1 second) | Minutes (image build) | Minutes (first-time) |
| **Disk Overhead** | Minimal (shared .git) | High (per-container layers) | Moderate |
| **Security** | Shared OS/kernel | Process-level sandboxing | Defense-in-depth |
| **Use Case** | Feature variants, testing | Untrusted code, compliance | Production systems |

**Decision Rule**: Use worktrees for speed and efficiency when agents are trusted; use containers when security, reproducibility, or complete isolation are paramount; use hybrid for mission-critical production systems.

### Quick Start Guide

**30-Second Worktree Setup**:

```bash
# Create three isolated development environments
git worktree add ../feature-auth-v1 -b auth-oauth
git worktree add ../feature-auth-v2 -b auth-jwt  
git worktree add ../feature-auth-v3 -b auth-saml

# Launch agents in parallel terminals
cd ../feature-auth-v1 && code . && claude-code "implement OAuth 2.0"
cd ../feature-auth-v2 && cursor "implement JWT authentication"
cd ../feature-auth-v3 && cline "implement SAML SSO"
```

**5-Minute Container Setup**:

```bash
# Create DevContainer configuration
mkdir -p .devcontainer
cat > .devcontainer/devcontainer.json << 'EOF'
{
  "name": "AI Agent Sandbox",
  "image": "mcr.microsoft.com/devcontainers/python:3.11",
  "runArgs": ["--read-only", "--cap-drop=ALL", "--network=none"],
  "mounts": ["source=${localWorkspaceFolder},target=/workspace,type=bind"]
}
EOF

# Launch container-isolated agent
devcontainer up --workspace-folder .
```


***

## 2. Foundational Concepts

### Git Worktrees: Lightweight Isolation Mechanism

**Definition**: Git worktrees create multiple working directories from a single repository, each with independent filesystem state while sharing Git object storage.

**Core Characteristics**:

- **Instant creation**: Sub-second worktree initialization
- **Shared history**: All worktrees reference the same `.git` directory
- **Isolated checkouts**: Each worktree has independent file state and branch
- **Space-efficient**: No repository duplication, only working files

**Technical Implementation**:

```bash
# Primary repository structure
project/.git/              # Shared Git object database
project/worktrees/
├── feature-a/            # Worktree 1: branch feature-a
├── feature-b/            # Worktree 2: branch feature-b
└── feature-c/            # Worktree 3: branch feature-c
```

Each worktree maintains its own:

- Working directory files
- Index (staging area)
- HEAD pointer
- Branch checkout

But shares:

- Commit history
- Git objects (blobs, trees, commits)
- Configuration (remotes, hooks)
- References (all branches visible)

**Key Benefits**:

- **No file conflicts**: Agents operate on completely separate filesystems
- **No context pollution**: Each agent sees only its branch's files
- **Instant switching**: No stashing or checkout overhead
- **Parallel execution**: Run unlimited concurrent agents


### Container-Based Isolation: Full Sandbox Environments

**Definition**: Containers encapsulate applications with their dependencies in isolated process namespaces, providing security boundaries and reproducible environments.

**Core Characteristics**:

- **Process isolation**: Each container runs in separate namespace
- **Resource limits**: Enforced CPU, memory, and I/O constraints
- **Network isolation**: Configurable network access policies
- **Filesystem isolation**: Read-only root filesystems, volume mounts
- **Reproducibility**: Declarative environment definitions

**DevContainer Architecture**:

```json
{
  "name": "Secure AI Agent Environment",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  },
  "runArgs": [
    "--read-only",           // Immutable filesystem
    "--cap-drop=ALL",        // Remove all Linux capabilities
    "--security-opt=no-new-privileges",
    "--network=none"         // Offline execution
  ],
  "mounts": [
    "source=${localWorkspaceFolder},target=/workspace,type=bind,readonly"
  ],
  "containerEnv": {
    "AGENT_MODE": "isolated"
  }
}
```

**Security Boundaries**:

- **Capability dropping**: Remove dangerous Linux capabilities (CAP_SYS_ADMIN, CAP_NET_RAW)
- **Seccomp profiles**: Restrict system calls at kernel level
- **AppArmor/SELinux**: Mandatory access control policies
- **Resource quotas**: Prevent resource exhaustion attacks
- **Network segmentation**: Control internet and inter-container communication

**Key Benefits**:

- **Complete isolation**: Agent cannot access host system
- **Auditability**: All actions logged and traceable
- **Reproducibility**: Guaranteed consistent environment
- **Security compliance**: Meets enterprise security requirements


### The Hybrid Approach: When to Combine Both

**Definition**: Hybrid methodology uses containers as the primary isolation layer, with git worktrees providing lightweight filesystem separation within each container.

**Architecture Pattern**:

```
Container 1 (Agent A)              Container 2 (Agent B)
├── Git Worktree: feature-x-v1    ├── Git Worktree: feature-y-v1  
├── Isolated dependencies          ├── Isolated dependencies
├── Network: restricted            ├── Network: restricted
└── Resources: 2GB RAM, 2 CPU      └── Resources: 2GB RAM, 2 CPU
```

**When to Use Hybrid**:

- Production environments requiring defense-in-depth security
- Untrusted AI-generated code execution
- Compliance requirements mandating audit trails
- Projects with complex dependency isolation needs
- Multi-tenant agent orchestration platforms

**Implementation Tools**:

- **Container Use (Dagger)**: Pairs containerization with git worktree automation
- **DevContainers + Worktree Scripts**: Manual integration approach
- **Custom orchestration**: Kubernetes-based agent scheduling with worktree management


### Integration with Existing Claude Command and Control Patterns

**Alignment with Agent-First Architecture**:

The parallel development patterns described in this document extend the modular, orchestrator-worker architecture established in the Claude Command and Control framework:

**Orchestrator Enhancements**:

```markdown
# MULTI_AGENT_PLAN.md (Extended for Parallel Execution)

## Project Goal
Implement authentication system with three parallel approaches

## Parallel Execution Strategy
- **Isolation Method**: Git worktrees
- **Agent Distribution**: 3 agents, independent branches
- **Coordination**: Shared planning document, atomic status updates

## Task Assignment
| Agent ID | Worktree Path | Branch | Task | Status |
|----------|---------------|--------|------|--------|
| agent-1 | ../auth-oauth | oauth-impl | OAuth 2.0 flow | In Progress |
| agent-2 | ../auth-jwt | jwt-impl | JWT authentication | Complete |
| agent-3 | ../auth-saml | saml-impl | SAML SSO | Not Started |

## Merge Strategy
- Review all implementations
- Select JWT implementation (best performance)
- Cherry-pick OAuth social login components
- Archive SAML implementation
```

**Configuration Integration**:

Extend `CLAUDE.md` with parallel execution directives:

```markdown
# Claude Agent Configuration

## Import Universal Standards
See AGENTS.md for core policies.

## Parallel Execution Configuration

### Worktree Management
- **Location**: `~/projects/worktrees/<project>/<branch>`
- **Naming Convention**: `<feature>-<agent-id>-<timestamp>`
- **Cleanup Policy**: Remove worktrees after PR merge

### Context Isolation
- Each agent maintains independent 200K token context window
- Agents read shared MULTI_AGENT_PLAN.md for coordination
- No cross-agent file dependencies allowed
- Atomic status updates to prevent race conditions

### Tool Permissions (Worktree Mode)
allowed-tools:
  - "Read"              # Local worktree files only
  - "Edit"              # Scoped to worktree directory
  - "Bash(git:status|add|commit|push)"  # Local Git operations
  - "Bash(npm:test)"    # Testing within worktree

restricted-operations:
  - "Bash(git:merge)"   # Merge reserved for orchestrator
  - "Bash(rm:-rf)"      # Dangerous deletions blocked
```


***

## 3. Decision Criteria and Selection Matrix

### Worktrees-Only Scenarios

**Optimal Use Cases**:

**1. Feature Implementation Variants**

- **Scenario**: Generate 3-5 different approaches to the same feature specification
- **Benefit**: Explore solution space, select optimal implementation
- **Requirements**: Trusted agents, no security constraints, shared development environment

**2. Rapid Prototyping**

- **Scenario**: Test multiple UI frameworks or architectural patterns
- **Benefit**: Instant setup, minimal overhead, easy comparison
- **Requirements**: Local development only, no compliance requirements

**3. Documentation and Testing Parallelization**

- **Scenario**: Different agents write tests, docs, and implementation simultaneously
- **Benefit**: Complete isolation prevents interference
- **Requirements**: Well-defined module boundaries, clear task assignment

**4. Multi-Feature Development**

- **Scenario**: Work on authentication while agent works on payment integration
- **Benefit**: Zero context switching, parallel progress
- **Requirements**: Independent codebases, minimal cross-feature dependencies

**Selection Criteria Checklist**:

- ✅ Agents are trusted (Claude Code, Cursor with permissions)
- ✅ Host environment is secure and controlled
- ✅ Dependencies are stable and shared
- ✅ No compliance or audit requirements
- ✅ Speed and efficiency are primary goals
- ✅ Filesystem isolation is sufficient

**Command Pattern**:

```bash
# Automation script for worktree-based parallel development
#!/bin/bash
PROJECT_NAME="myapp"
FEATURES=("auth" "payments" "notifications")

for feature in "${FEATURES[@]}"; do
  git worktree add ../worktrees/$feature -b feature-$feature
  
  # Copy shared configuration
  cp .cursorrules ../worktrees/$feature/
  cp .env.example ../worktrees/$feature/.env
  
  # Launch agent in new terminal
  tmux new-window -n "$feature" \
    "cd ../worktrees/$feature && claude-code 'Implement $feature module'"
done
```


### Container-Only Scenarios

**Optimal Use Cases**:

**1. Untrusted or Experimental AI Code**

- **Scenario**: Agent generates code from unverified specifications
- **Benefit**: Full sandboxing prevents malicious code execution
- **Requirements**: Docker runtime, security-hardened images

**2. Compliance and Audit Requirements**

- **Scenario**: Financial services, healthcare, government projects
- **Benefit**: Complete audit trail, reproducible environments
- **Requirements**: Signed containers, centralized logging, immutable infrastructure

**3. Complex Dependency Isolation**

- **Scenario**: Multiple agents require conflicting Python versions or system libraries
- **Benefit**: Each container has isolated dependency tree
- **Requirements**: CI/CD integration, container registry

**4. Cloud-Based Agent Execution**

- **Scenario**: Remote development environments, cloud IDEs, serverless agents
- **Benefit**: Consistent environments, resource metering, multi-tenancy
- **Requirements**: Kubernetes or cloud container service

**Selection Criteria Checklist**:

- ✅ Security is paramount (untrusted code, production data)
- ✅ Compliance mandates audit trails and reproducibility
- ✅ Dependency conflicts exist across agents
- ✅ Remote execution required (cloud, CI/CD)
- ✅ Setup time (minutes) is acceptable overhead
- ✅ Process-level isolation is required

**DevContainer Configuration**:

```json
// .devcontainer/devcontainer.json
{
  "name": "Production AI Agent Sandbox",
  "build": {
    "dockerfile": "Dockerfile",
    "args": {
      "VARIANT": "3.11-bullseye"
    }
  },
  "runArgs": [
    "--read-only",
    "--tmpfs=/tmp:rw,noexec,nosuid,size=100m",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "--security-opt=seccomp=seccomp-profile.json",
    "--network=none",
    "--memory=4g",
    "--cpus=2.0"
  ],
  "mounts": [
    "source=${localWorkspaceFolder},target=/workspace,type=bind,readonly",
    "source=${localWorkspaceFolder}/.agent-output,target=/output,type=bind"
  ],
  "containerEnv": {
    "PYTHONDONTWRITEBYTECODE": "1",
    "PIP_NO_CACHE_DIR": "1"
  },
  "postCreateCommand": "pip install -r requirements.txt"
}
```


### Hybrid Scenarios

**Optimal Use Cases**:

**1. Enterprise Production Systems**

- **Scenario**: Multiple agents working on microservices with strict security policies
- **Architecture**: Containers provide security boundary, worktrees enable parallel branches
- **Benefit**: Defense-in-depth security plus lightweight filesystem isolation

**2. Multi-Tenant Agent Platforms**

- **Scenario**: SaaS platform running customer-owned agents
- **Architecture**: Per-tenant containers with worktree-based branch management
- **Benefit**: Resource isolation per customer, efficient branch management

**3. CI/CD Pipeline Integration**

- **Scenario**: Automated testing of multiple PR variants in parallel
- **Architecture**: Containerized test runners with worktree checkouts
- **Benefit**: Clean, disposable environments with fast branch switching

**4. Large-Scale Refactoring Projects**

- **Scenario**: 10+ agents working on codebase transformation
- **Architecture**: Container orchestration (Kubernetes) with worktree coordination
- **Benefit**: Scalable execution with safety guarantees

**Selection Criteria Checklist**:

- ✅ Both security AND speed are critical requirements
- ✅ Production deployment with compliance needs
- ✅ Multi-tenant or multi-customer execution
- ✅ Large-scale orchestration (10+ agents)
- ✅ Budget for infrastructure complexity
- ✅ Team has container and Git expertise

**Container Use Integration Example**:

```bash
# Using Dagger's Container Use tool
# Automatically creates container + worktree per agent

# Install Container Use MCP server
npm install -g @dagger/container-use

# Configure in Claude Code
# .mcp/config.json
{
  "servers": {
    "container-use": {
      "command": "npx",
      "args": ["-y", "@dagger/container-use"],
      "env": {
        "CONTAINER_USE_IMAGE": "custom-agent-image:latest"
      }
    }
  }
}

# Agent executes in isolated container + worktree automatically
# Changes committed to dedicated branch
# Pull and review when ready
```


### Anti-Patterns and Red Flags

**❌ Worktree Anti-Patterns**:

**1. Shared Worktree Without Coordination**

```bash
# WRONG: Multiple agents modifying same worktree
cd ../worktrees/feature-a
claude-code "implement login" &
cursor "implement logout" &  # Both agents will conflict!
```

**Correct**: One agent per worktree, or explicit file-level ownership.

**2. Neglecting Cleanup**

```bash
# WRONG: Accumulating stale worktrees
$ git worktree list
feature-a     abc123 [feature-a]
feature-b     def456 [feature-b]
old-feature-1 789ghi [old-feature-1]  # Merged 3 months ago
old-feature-2 012jkl [old-feature-2]  # Merged 3 months ago
```

**Correct**: Regular pruning with `git worktree prune` and removal.

**3. Forgetting Shared Configuration**

```bash
# WRONG: Creating worktree without propagating config
git worktree add ../feature-x -b feature-x
# Missing: .cursorrules, .env, MCP configs
```

**Correct**: Automation scripts that copy configuration files.

**❌ Container Anti-Patterns**:

**1. Over-Permissioned Containers**

```json
// WRONG: Granting unnecessary privileges
{
  "runArgs": ["--privileged", "--cap-add=ALL"]
}
```

**Correct**: Principle of least privilege, drop all capabilities by default.

**2. Mutable Container State**

```json
// WRONG: Allowing writes to container filesystem
{
  "runArgs": []  // Defaults allow write access
}
```

**Correct**: Read-only root filesystem with explicit tmpfs for temporary data.

**3. Shared Docker Socket**

```json
// WRONG: Mounting Docker daemon socket
{
  "mounts": [
    "source=/var/run/docker.sock,target=/var/run/docker.sock"
  ]
}
```

**Correct**: Never expose Docker socket; use rootless Docker or socket proxy.

**❌ Orchestration Anti-Patterns**:

**1. No Progress Tracking**

```bash
# WRONG: Launching agents with no monitoring
for i in {1..10}; do
  claude-code "implement feature $i" &
done
# How do you know what's done? What failed?
```

**Correct**: Centralized progress tracking with shared planning document.

**2. Duplicate Work Assignment**

```markdown
# WRONG: Ambiguous task assignment
- Task: "Fix authentication" - Assigned to: agent-1, agent-2
```

**Correct**: Explicit ownership with conflict prevention mechanisms.

**3. No Merge Strategy**

```bash
# WRONG: Creating 5 parallel implementations with no plan
# How do you merge? What criteria determine winner?
```

**Correct**: Pre-defined selection criteria or manual review process.

### Decision Tree and Selection Flowchart

```
┌─────────────────────────────────────────┐
│ Do you need parallel AI agent execution? │
└───────────┬─────────────────────────────┘
            │
            ├─NO──► Use standard single-agent workflow
            │
            └─YES─► Continue
                    │
┌───────────────────┴──────────────────────┐
│ Do you have security/compliance          │
│ requirements for agent isolation?        │
└───────────┬──────────────────────────────┘
            │
            ├─YES─► Are agents generating untrusted code?
            │       │
            │       ├─YES─► Use Containers Only
            │       │       (DevContainers, full sandboxing)
            │       │
            │       └─NO──► Do you need audit trails?
            │               │
            │               ├─YES─► Use Containers Only
            │               │
            │               └─NO──► Continue to resource check
            │
            └─NO──► Do agents require different dependencies
                    │ (Python versions, conflicting libraries)?
                    │
                    ├─YES─► Use Containers or Hybrid
                    │       (Dependency isolation critical)
                    │
                    └─NO──► Is speed/efficiency paramount?
                            │
                            ├─YES─► Use Worktrees Only
                            │       (Sub-second setup, minimal overhead)
                            │
                            └─NO──► Are you running 10+ agents?
                                    │
                                    ├─YES─► Use Hybrid
                                    │       (Scalability + isolation)
                                    │
                                    └─NO──► Use Worktrees Only
                                            (Simple, fast, effective)
```

**Quick Decision Matrix**:


| **Requirement** | **Recommended Approach** |
| :-- | :-- |
| Trusted agents, local development | Worktrees Only |
| Untrusted code execution | Containers Only |
| Compliance/audit requirements | Containers Only |
| Conflicting dependencies | Containers or Hybrid |
| Cloud-based execution | Containers or Hybrid |
| 10+ parallel agents | Hybrid |
| Sub-second setup time | Worktrees Only |
| Production deployment | Hybrid |


***

## 4. Implementation Workflow: Git Worktrees

### Core Setup and Initialization

**Prerequisites**:

- Git version 2.35+ (for modern worktree features)
- Base repository with clean working directory
- Understanding of branch naming conventions

**Step 1: Repository Structure Design**

```bash
# Recommended directory structure
~/projects/
├── myapp/                    # Main repository
│   ├── .git/                # Shared Git database
│   ├── src/
│   ├── tests/
│   └── README.md
├── worktrees/
│   └── myapp/               # Worktrees root
│       ├── feature-a/       # Worktree 1
│       ├── feature-b/       # Worktree 2
│       └── bugfix-x/        # Worktree 3
```

**Step 2: Creating Worktrees**

```bash
# Navigate to main repository
cd ~/projects/myapp

# Create worktree with new branch
git worktree add ../worktrees/myapp/feature-auth -b feature/auth-implementation

# Create worktree from existing branch
git worktree add ../worktrees/myapp/feature-payments feature/payments-existing

# Verify worktrees
git worktree list
# Output:
# ~/projects/myapp                           abc123 [main]
# ~/projects/worktrees/myapp/feature-auth    def456 [feature/auth-implementation]
# ~/projects/worktrees/myapp/feature-payments ghi789 [feature/payments-existing]
```

**Step 3: Configuration Propagation**

```bash
# Copy critical configuration files to new worktree
WORKTREE_PATH="../worktrees/myapp/feature-auth"

cp .cursorrules "$WORKTREE_PATH/"
cp .claude-code.json "$WORKTREE_PATH/"
cp .env.example "$WORKTREE_PATH/.env"
cp -r .mcp/ "$WORKTREE_PATH/"

# Copy VS Code workspace settings
mkdir -p "$WORKTREE_PATH/.vscode"
cp .vscode/settings.json "$WORKTREE_PATH/.vscode/"
```


### Automation Scripts and Bash Utilities

**Comprehensive Worktree Manager Script**:

```bash
#!/bin/bash
# worktree-manager.sh - Comprehensive worktree automation
# Usage: ./worktree-manager.sh <command> [options]

set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_BASE="$(dirname "$PROJECT_ROOT")/worktrees/$(basename "$PROJECT_ROOT")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function: Create new worktree with full configuration
create_worktree() {
    local branch_name="$1"
    local worktree_path="$WORKTREE_BASE/$branch_name"
    
    echo -e "${GREEN}Creating worktree: $branch_name${NC}"
    
    # Create worktree
    git worktree add "$worktree_path" -b "$branch_name"
    
    # Copy configuration files
    echo "Copying configuration..."
    cp "$PROJECT_ROOT/.cursorrules" "$worktree_path/" 2>/dev/null || true
    cp "$PROJECT_ROOT/.env.example" "$worktree_path/.env" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/.mcp" "$worktree_path/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/.vscode" "$worktree_path/" 2>/dev/null || true
    
    # Install dependencies if needed
    if [ -f "$worktree_path/package.json" ]; then
        echo "Installing npm dependencies..."
        (cd "$worktree_path" && npm install --silent)
    fi
    
    echo -e "${GREEN}✓ Worktree created: $worktree_path${NC}"
    echo "Open with: code $worktree_path"
}

# Function: List all worktrees with status
list_worktrees() {
    echo -e "${GREEN}Active Worktrees:${NC}"
    git worktree list
    
    echo ""
    echo -e "${GREEN}Worktree Status:${NC}"
    git worktree list --porcelain | while IFS= read -r line; do
        if [[ $line == worktree* ]]; then
            path="${line#worktree }"
            if [ -d "$path" ]; then
                cd "$path"
                branch=$(git branch --show-current)
                status=$(git status --short | wc -l)
                echo "  $branch: $status uncommitted changes"
            fi
        fi
    done
}

# Function: Remove worktree with cleanup
remove_worktree() {
    local identifier="$1"
    local worktree_path
    
    # Find worktree path
    if [ -d "$WORKTREE_BASE/$identifier" ]; then
        worktree_path="$WORKTREE_BASE/$identifier"
    else
        worktree_path=$(git worktree list --porcelain | grep -A2 "branch.*$identifier" | grep "worktree" | cut -d' ' -f2)
    fi
    
    if [ -z "$worktree_path" ]; then
        echo -e "${RED}Worktree not found: $identifier${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Removing worktree: $worktree_path${NC}"
    
    # Check for uncommitted changes
    if ! git -C "$worktree_path" diff-index --quiet HEAD --; then
        echo -e "${RED}Warning: Uncommitted changes detected${NC}"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
    
    # Remove worktree
    git worktree remove "$worktree_path" --force
    echo -e "${GREEN}✓ Worktree removed${NC}"
}

# Function: Interactive cleanup of merged worktrees
cleanup_merged() {
    echo -e "${GREEN}Checking for merged branches...${NC}"
    
    git worktree list --porcelain | while IFS= read -r line; do
        if [[ $line == worktree* ]]; then
            path="${line#worktree }"
            if [ -d "$path" ] && [ "$path" != "$PROJECT_ROOT" ]; then
                cd "$path"
                branch=$(git branch --show-current)
                
                # Check if branch is merged to main
                if git branch --merged main | grep -q "^[* ] $branch$"; then
                    echo -e "${YELLOW}Branch '$branch' is merged to main${NC}"
                    read -p "Remove this worktree? (y/N) " -n 1 -r
                    echo
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        git worktree remove "$path"
                        echo -e "${GREEN}✓ Removed: $path${NC}"
                    fi
                fi
            fi
        fi
    done
    
    # Prune stale worktrees
    git worktree prune
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# Function: Launch agent in worktree
launch_agent() {
    local branch_name="$1"
    local agent_command="${2:-claude-code}"
    local prompt="${3:-}"
    
    local worktree_path="$WORKTREE_BASE/$branch_name"
    
    if [ ! -d "$worktree_path" ]; then
        echo -e "${RED}Worktree not found: $branch_name${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Launching agent in: $branch_name${NC}"
    
    # Open in VS Code and start agent
    code "$worktree_path"
    
    if [ -n "$prompt" ]; then
        # Launch agent with prompt in new terminal
        osascript -e "tell application \"Terminal\" to do script \"cd $worktree_path && $agent_command '$prompt'\""
    fi
}

# Main command dispatcher
case "${1:-help}" in
    create)
        create_worktree "${2:-}"
        ;;
    list)
        list_worktrees
        ;;
    remove)
        remove_worktree "${2:-}"
        ;;
    cleanup)
        cleanup_merged
        ;;
    launch)
        launch_agent "${2:-}" "${3:-claude-code}" "${4:-}"
        ;;
    help|*)
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  create <branch>           Create new worktree"
        echo "  list                      List all worktrees with status"
        echo "  remove <branch>           Remove worktree"
        echo "  cleanup                   Remove merged worktrees"
        echo "  launch <branch> [agent]   Launch agent in worktree"
        ;;
esac
```

**Make script executable and add to PATH**:

```bash
chmod +x worktree-manager.sh
sudo ln -s "$(pwd)/worktree-manager.sh" /usr/local/bin/wt

# Usage examples
wt create feature/new-auth-system
wt list
wt launch feature/new-auth-system claude-code "implement OAuth 2.0"
wt cleanup
```


### IDE Configuration for Multi-Workspace Development

**VS Code Multi-Root Workspace Configuration**:

```json
// myapp.code-workspace
{
  "folders": [
    {
      "name": "Main Repo",
      "path": "~/projects/myapp"
    },
    {
      "name": "Feature: Authentication",
      "path": "~/projects/worktrees/myapp/feature-auth"
    },
    {
      "name": "Feature: Payments",
      "path": "~/projects/worktrees/myapp/feature-payments"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": true,
      "**/.git": true
    },
    "search.exclude": {
      "**/node_modules": true
    }
  },
  "extensions": {
    "recommendations": [
      "anthropic.claude-code",
      "github.copilot"
    ]
  },
  "launch": {
    "configurations": [
      {
        "name": "Debug Auth Worktree",
        "type": "node",
        "request": "launch",
        "cwd": "${workspaceFolder:Feature: Authentication}",
        "program": "${workspaceFolder:Feature: Authentication}/src/index.js"
      }
    ],
    "compounds": [
      {
        "name": "Debug All Worktrees",
        "configurations": [
          "Debug Auth Worktree",
          "Debug Payments Worktree"
        ]
      }
    ]
  }
}
```

**Claude Code Task Automation**:

```json
// .vscode/tasks.json (in worktree)
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Claude Code Agent",
      "type": "shell",
      "command": "~/.claude/local/claude --dangerously-skip-permissions",
      "presentation": {
        "reveal": "always",
        "panel": "new",
        "focus": true
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ]
}
```

**JetBrains IDE Workspace Configuration**:

```bash
# IntelliJ IDEA supports workspaces via plugin
# Install "Workspaces" plugin from JetBrains Marketplace

# Create workspace
File → New → Workspace
# Add worktree projects:
Add Existing Project → Select worktree directories
```


### Agent Configuration and Context Management

**Worktree-Specific CLAUDE.md**:

```markdown
# Claude Agent Configuration (Worktree: feature-auth)

## Import Universal Standards
See AGENTS.md in main repository for core policies.

## Worktree Context
- **Branch**: feature/auth-implementation
- **Worktree Path**: ~/projects/worktrees/myapp/feature-auth
- **Scope**: Authentication module only
- **Coordinator**: agent-orchestrator (main repo)

## Context Boundaries
This agent operates ONLY within this worktree. Do NOT:
- Reference files from other worktrees
- Modify files in main repository
- Merge changes (reserved for orchestrator)
- Make assumptions about other agents' progress

## Task Assignment
**Primary Goal**: Implement OAuth 2.0 authentication flow

**Subtasks**:
1. Create `/auth/oauth` route handlers
2. Implement token exchange logic
3. Add user session management
4. Write integration tests
5. Update API documentation

## Status Reporting
Update MULTI_AGENT_PLAN.md in main repository:
```

git -C ~/projects/myapp add MULTI_AGENT_PLAN.md
git -C ~/projects/myapp commit -m "Status update: OAuth implementation 60% complete"

```

## Allowed Tools (Worktree Mode)
allowed-tools:
  - "Read"              # Worktree files only
  - "Edit"              # Scoped to this worktree
  - "Bash(git:status|add|commit|diff)"
  - "Bash(npm:test|run)"
  - "Bash(curl:*)"      # API testing

restricted-operations:
  - "Bash(git:push)"    # Manual push after review
  - "Bash(git:merge)"   # Orchestrator only
  - "Bash(rm:-rf)"      # Dangerous deletions

## Completion Criteria
- [ ] All OAuth routes implemented
- [ ] 100% test coverage achieved
- [ ] Documentation updated
- [ ] Security review checklist complete
- [ ] Manual testing validated

Upon completion:
1. Commit all changes locally
2. Update status in MULTI_AGENT_PLAN.md
3. Notify orchestrator for review
```

**Context Isolation Enforcement**:

```bash
# Add to worktree .bashrc or shell initialization
export CLAUDE_CONTEXT_ROOT="$(pwd)"
export CLAUDE_RESTRICT_ACCESS=true

# Prevent accidental operations on main repo
alias git-main='git -C ~/projects/myapp'
unalias git  # Force explicit worktree-scoped git usage
```


### Coordination Mechanisms and Task Assignment

**Centralized Planning Document**:

```markdown
# MULTI_AGENT_PLAN.md (Main Repository)

## Project: Authentication System Redesign
**Started**: 2025-11-23  
**Target**: 2025-11-30  
**Orchestrator**: agent-coordinator

---

## Parallel Execution Strategy
**Isolation Method**: Git Worktrees  
**Agent Count**: 3 concurrent agents  
**Merge Strategy**: Review-based selection

---

## Task Breakdown and Assignment

| ID | Agent | Worktree | Branch | Task | Status | Progress | Blocker |
|----|-------|----------|--------|------|--------|----------|---------|
| 1  | agent-oauth | feature-auth-oauth | feature/oauth-impl | OAuth 2.0 implementation | ⏳ In Progress | 60% | None |
| 2  | agent-jwt | feature-auth-jwt | feature/jwt-impl | JWT-based authentication | ✅ Complete | 100% | None |
| 3  | agent-saml | feature-auth-saml | feature/saml-impl | SAML SSO integration | 🔴 Not Started | 0% | Awaiting SAML metadata |

---

## Agent Communication Protocol

### Status Update Format
```

{
"agent_id": "agent-oauth",
"task_id": 1,
"status": "in_progress",
"progress_percent": 60,
"completed_subtasks": ["route_handlers", "token_exchange"],
"blocked_on": null,
"next_steps": ["session_management", "integration_tests"],
"estimated_completion": "2025-11-25T18:00:00Z"
}

```

### Update Frequency
- Critical blockers: Immediate (update plan + alert orchestrator)
- Normal progress: Every 2 hours or major milestone
- Completion: Update plan + commit all changes

---

## File Ownership Matrix
(Prevents concurrent modification conflicts)

| Path | Owner Agent | Read-Only Agents |
|------|-------------|------------------|
| `/src/auth/oauth/**` | agent-oauth | agent-jwt, agent-saml |
| `/src/auth/jwt/**` | agent-jwt | agent-oauth, agent-saml |
| `/src/auth/saml/**` | agent-saml | agent-oauth, agent-jwt |
| `/tests/auth/oauth/**` | agent-oauth | All |
| `/tests/auth/jwt/**` | agent-jwt | All |
| `/docs/auth/**` | Shared (lock required) | All |

**Lock Protocol**: Request lock in plan before editing shared files.

---

## Merge Strategy

### Phase 1: Individual Review (2025-11-26)
- Each agent completes local implementation
- Self-review checklist validation
- Automated test suite passage

### Phase 2: Comparative Analysis (2025-11-27)
- Orchestrator reviews all implementations
- Performance benchmarking (latency, security)
- Code quality assessment (maintainability, testability)

### Phase 3: Selection (2025-11-28)
- JWT implementation selected (best performance)
- OAuth social login features cherry-picked
- SAML deferred to future milestone

### Phase 4: Integration (2025-11-29)
- Merge selected implementation to main
- Integration testing across full stack
- Documentation consolidation

---

## Dependencies and Handoffs

```

graph LR
A[agent-oauth] -->|OAuth tokens| B[agent-jwt validates tokens]
B -->|Session format| C[All agents use JWT sessions]
C -->|Testing| D[agent-validator runs integration tests]
D -->|Documentation| E[agent-scribe updates docs]

```

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SAML metadata delay | High | Medium | Defer SAML; proceed with OAuth/JWT |
| Performance regression | Medium | High | Benchmark before merge; load testing |
| Security vulnerability | Low | Critical | Security checklist + external review |
| Merge conflicts | Low | Low | File ownership prevents conflicts |

---

## Automated Coordination Script

```

\#!/bin/bash

# check-agent-status.sh - Monitors agent progress

PLAN_FILE="MULTI_AGENT_PLAN.md"
ALERT_THRESHOLD=4  \# Hours since last update

git log --all --since="4 hours ago" --format="%h %s" | grep "Status update" || {
echo "⚠️  No status updates in 4 hours - agents may be stuck"
\# Send notification (Slack, email, etc.)
}

# Check for blockers

if grep -q "🔴 Not Started.*Awaiting" "$PLAN_FILE"; then
    echo "⚠️  Agents blocked - manual intervention required"
    grep "🔴 Not Started.*Awaiting" "$PLAN_FILE"
fi

```

**Coordination Rules**:
1. **Atomic Updates**: All status changes committed as single transaction
2. **No Assumptions**: Agents cannot assume other agents' state; always read plan
3. **Explicit Ownership**: File paths assigned to single agent; shared files require locks
4. **Graceful Failures**: Agents report blockers immediately; orchestrator reassigns tasks
5. **Regular Checkpoints**: Scheduled synchronization points for integration testing

---

## 5. Implementation Workflow: Container Isolation

### DevContainer Architecture and Setup

**Production-Grade DevContainer Structure**:

```

project-root/
├── .devcontainer/
│   ├── devcontainer.json          \# Primary configuration
│   ├── Dockerfile                 \# Custom image definition
│   ├── docker-compose.yml         \# Multi-container setup
│   ├── seccomp-profile.json       \# System call restrictions
│   ├── post-create.sh             \# Environment initialization
│   └── agent-configs/
│       ├── agent-1.env
│       └── agent-2.env

```

**Minimal Security-Hardened DevContainer**:

```

// .devcontainer/devcontainer.json
{
"name": "Hardened AI Agent Environment",
"build": {
"dockerfile": "Dockerfile",
"context": "..",
"args": {
"VARIANT": "3.11-slim-bookworm",
"NODE_VERSION": "20"
}
},
"runArgs": [
// Read-only root filesystem
"--read-only",

    // Temporary filesystem for /tmp (100MB, no exec)
    "--tmpfs=/tmp:rw,noexec,nosuid,size=100m",
    
    // Drop ALL Linux capabilities
    "--cap-drop=ALL",
    
    // Prevent privilege escalation
    "--security-opt=no-new-privileges",
    
    // Apply seccomp profile (syscall filtering)
    "--security-opt=seccomp=.devcontainer/seccomp-profile.json",
    
    // Network isolation (offline by default)
    "--network=none",
    
    // Resource limits
    "--memory=4g",
    "--memory-swap=4g",
    "--cpus=2.0",
    "--pids-limit=100",
    
    // User namespace remapping
    "--userns=host"
    ],
"mounts": [
// Source code (read-only)
"source=\${localWorkspaceFolder},target=/workspace,type=bind,readonly",

    // Output directory (writable)
    "source=${localWorkspaceFolder}/.agent-output,target=/output,type=bind",
    
    // Git credentials (read-only)
    "source=${localEnv:HOME}/.gitconfig,target=/home/vscode/.gitconfig,type=bind,readonly"
    ],
"containerEnv": {
"PYTHONDONTWRITEBYTECODE": "1",
"PIP_NO_CACHE_DIR": "1",
"AGENT_MODE": "isolated",
"LOG_LEVEL": "INFO"
},
"containerUser": "vscode",
"remoteUser": "vscode",

"postCreateCommand": "bash .devcontainer/post-create.sh",

"customizations": {
"vscode": {
"extensions": [
"anthropic.claude-code"
],
"settings": {
"terminal.integrated.defaultProfile.linux": "bash",
"files.watcherExclude": {
"**/.git/objects/**": true,
"**/node_modules/**": true
}
}
}
},

"features": {
"ghcr.io/devcontainers/features/common-utils:2": {
"installZsh": false,
"installOhMyZsh": false
}
}
}

```

**Secure Dockerfile**:

```


# .devcontainer/Dockerfile

ARG VARIANT=3.11-slim-bookworm
FROM mcr.microsoft.com/vscode/devcontainers/python:\${VARIANT}

# Install system dependencies

RUN apt-get update \&\& \
apt-get install -y --no-install-recommends \
git \
curl \
ca-certificates \&\& \
apt-get clean \&\& \
rm -rf /var/lib/apt/lists/*

# Create non-root user (vscode user already exists in base image)

# Configure Git safe directory

RUN git config --system --add safe.directory /workspace

# Install Python dependencies

COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt \&\& \
rm /tmp/requirements.txt

# Create output directory with correct permissions

RUN mkdir -p /output \&\& chown vscode:vscode /output

# Security: Remove unnecessary setuid binaries

RUN find / -perm /6000 -type f -exec chmod a-s {} \; || true

# Switch to non-root user

USER vscode

WORKDIR /workspace

# Health check (optional, for orchestration)

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD curl -f http://localhost:8080/health || exit 1

```

**Seccomp Profile (System Call Filtering)**:

```

// .devcontainer/seccomp-profile.json
{
"defaultAction": "SCMP_ACT_ERRNO",
"architectures": [
"SCMP_ARCH_X86_64",
"SCMP_ARCH_X86",
"SCMP_ARCH_X32"
],
"syscalls": [
{
"names": [
"accept", "accept4", "access", "arch_prctl", "bind", "brk",
"capget", "capset", "chdir", "chmod", "chown", "clone",
"close", "connect", "dup", "dup2", "dup3", "epoll_create",
"epoll_ctl", "epoll_wait", "execve", "exit", "exit_group",
"fchdir", "fchmod", "fchown", "fcntl", "fork", "fstat",
"fstatfs", "futex", "getcwd", "getdents", "getegid", "geteuid",
"getgid", "getpid", "getppid", "getuid", "ioctl", "kill",
"listen", "lseek", "mmap", "mprotect", "munmap", "open",
"openat", "pipe", "poll", "prctl", "read", "readlink",
"recvfrom", "recvmsg", "rt_sigaction", "rt_sigprocmask",
"rt_sigreturn", "select", "sendmsg", "sendto", "set_robust_list",
"set_tid_address", "setgid", "setgroups", "setuid", "socket",
"stat", "statfs", "wait4", "write"
],
"action": "SCMP_ACT_ALLOW"
}
]
}

```

**Post-Creation Initialization**:

```

\#!/bin/bash

# .devcontainer/post-create.sh

set -e

echo "🚀 Initializing AI agent environment..."

# Install project dependencies

if [ -f "requirements.txt" ]; then
echo "📦 Installing Python dependencies..."
pip install --no-cache-dir -r requirements.txt
fi

if [ -f "package.json" ]; then
echo "📦 Installing Node dependencies..."
npm ci --prefer-offline --no-audit
fi

# Run initial tests to verify environment

if [ -f "pytest.ini" ]; then
echo "🧪 Running environment verification tests..."
pytest tests/test_environment.py -v || echo "⚠️  Tests failed, but continuing..."
fi

# Create agent workspace directories

mkdir -p /output/{logs,artifacts,reports}

echo "✅ Environment ready for AI agent execution"

```

### Docker Compose for Complex Environments

**Multi-Container Agent Orchestration**:

```


# .devcontainer/docker-compose.yml

version: '3.8'

services:

# Agent 1: Authentication implementation

agent-auth:
build:
context: ..
dockerfile: .devcontainer/Dockerfile
container_name: agent-auth
hostname: agent-auth
read_only: true
tmpfs:
- /tmp:rw,noexec,nosuid,size=100m
cap_drop:
- ALL
security_opt:
- no-new-privileges:true
- seccomp=.devcontainer/seccomp-profile.json
networks:
- agent-network
volumes:
- ../:/workspace:ro
- ../agent-output/auth:/output:rw
environment:
- AGENT_ID=agent-auth
- AGENT_TASK=implement_oauth_authentication
- DATABASE_URL=postgresql://postgres:password@database:5432/testdb
mem_limit: 4g
cpus: 2.0
pids_limit: 100
depends_on:
- database
command: >
bash -c "
cd /workspace \&\&
python -m agent.runner --task implement_oauth
"

# Agent 2: Payment integration

agent-payments:
build:
context: ..
dockerfile: .devcontainer/Dockerfile
container_name: agent-payments
hostname: agent-payments
read_only: true
tmpfs:
- /tmp:rw,noexec,nosuid,size=100m
cap_drop:
- ALL
security_opt:
- no-new-privileges:true
networks:
- agent-network
volumes:
- ../:/workspace:ro
- ../agent-output/payments:/output:rw
environment:
- AGENT_ID=agent-payments
- AGENT_TASK=implement_stripe_integration
mem_limit: 4g
cpus: 2.0
command: >
bash -c "
cd /workspace \&\&
python -m agent.runner --task implement_payments
"

# Shared PostgreSQL database for testing

database:
image: postgres:16-alpine
container_name: agent-database
environment:
- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=password
- POSTGRES_DB=testdb
volumes:
- postgres-data:/var/lib/postgresql/data
networks:
- agent-network
mem_limit: 1g
healthcheck:
test: ["CMD-SHELL", "pg_isready -U postgres"]
interval: 10s
timeout: 5s
retries: 5

# Redis cache (if needed)

cache:
image: redis:7-alpine
container_name: agent-cache
networks:
- agent-network
mem_limit: 512m
command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

# Monitoring and logging

logging:
image: fluent/fluentd:v1.16-1
container_name: agent-logging
volumes:
- ./fluentd.conf:/fluentd/etc/fluent.conf:ro
- ../agent-output/logs:/fluentd/log:rw
networks:
- agent-network
ports:
- "24224:24224"
- "24224:24224/udp"

networks:
agent-network:
driver: bridge
ipam:
config:
- subnet: 172.20.0.0/16

volumes:
postgres-data:

```

**Usage**:
```


# Start all agents in parallel

docker-compose -f .devcontainer/docker-compose.yml up -d

# Monitor logs

docker-compose -f .devcontainer/docker-compose.yml logs -f

# Check agent status

docker-compose -f .devcontainer/docker-compose.yml ps

# Stop all agents

docker-compose -f .devcontainer/docker-compose.yml down

# Complete cleanup (remove volumes)

docker-compose -f .devcontainer/docker-compose.yml down -v

```

### Security Configuration and Least Privilege

**Security Hardening Checklist**:

| **Control** | **Implementation** | **Rationale** |
|-------------|-------------------|---------------|
| **Read-only root FS** | `--read-only` + tmpfs for /tmp | Prevents malicious code from persisting |
| **Drop capabilities** | `--cap-drop=ALL` | Removes all privileged operations |
| **No new privileges** | `--security-opt=no-new-privileges` | Prevents setuid escalation |
| **Seccomp profile** | Whitelist syscalls only | Blocks dangerous kernel operations |
| **Network isolation** | `--network=none` or restricted | Prevents data exfiltration |
| **Resource limits** | Memory, CPU, PID quotas | Prevents DoS/resource exhaustion |
| **Non-root user** | Run as `vscode` user | Limits damage scope |
| **User namespace** | `--userns=host` | Isolate UID/GID mappings |

**Graduated Security Profiles**:

```


# Profile 1: Maximum Security (Untrusted Code)

docker run \
--read-only \
--tmpfs=/tmp:rw,noexec,nosuid,size=50m \
--cap-drop=ALL \
--security-opt=no-new-privileges \
--security-opt=seccomp=strict-profile.json \
--network=none \
--memory=2g --cpus=1.0 --pids-limit=50 \
--user=1000:1000 \
agent-image:latest

# Profile 2: Moderate Security (Trusted Agent, Internet Access)

docker run \
--read-only \
--tmpfs=/tmp:rw,noexec,nosuid,size=100m \
--cap-drop=ALL \
--security-opt=no-new-privileges \
--network=agent-net \
--memory=4g --cpus=2.0 --pids-limit=100 \
--user=1000:1000 \
agent-image:latest

# Profile 3: Development (Minimal Restrictions)

docker run \
--cap-drop=NET_RAW \
--memory=8g --cpus=4.0 \
agent-image:latest

```

### Resource Management and Optimization

**Resource Allocation Strategy**:

```


# .devcontainer/resource-profiles.yml

profiles:

# Small: Simple tasks (linting, formatting)

small:
memory: 1g
cpus: 0.5
pids_limit: 50
disk_quota: 2g

# Medium: Standard development tasks

medium:
memory: 4g
cpus: 2.0
pids_limit: 100
disk_quota: 10g

# Large: Complex compilation, testing

large:
memory: 8g
cpus: 4.0
pids_limit: 200
disk_quota: 20g

# XLarge: ML model inference, large datasets

xlarge:
memory: 16g
cpus: 8.0
pids_limit: 500
disk_quota: 50g

```

**Dynamic Resource Allocation Script**:

```


# resource-manager.py

import docker
import psutil

client = docker.from_env()

def allocate_resources(agent_task_complexity):
"""Dynamically allocate container resources based on task"""

    # Get available system resources
    available_memory = psutil.virtual_memory().available
    available_cpus = psutil.cpu_count()
    
    if agent_task_complexity == "simple":
        return {
            "mem_limit": min(1_000_000_000, available_memory * 0.1),
            "cpu_quota": min(50_000, available_cpus * 50_000 * 0.5),
            "pids_limit": 50
        }
    elif agent_task_complexity == "moderate":
        return {
            "mem_limit": min(4_000_000_000, available_memory * 0.2),
            "cpu_quota": min(200_000, available_cpus * 50_000 * 2),
            "pids_limit": 100
        }
    else:  # complex
        return {
            "mem_limit": min(8_000_000_000, available_memory * 0.3),
            "cpu_quota": min(400_000, available_cpus * 50_000 * 4),
            "pids_limit": 200
        }
    
# Usage in container creation

resources = allocate_resources("moderate")
container = client.containers.run(
"agent-image:latest",
detach=True,
**resources
)

```

**Disk Space Management**:

```


# Monitor container disk usage

docker system df

# Clean up unused resources

docker system prune -af --volumes

# Set disk quotas (using devicemapper or overlay2)

# /etc/docker/daemon.json

{
"storage-driver": "overlay2",
"storage-opts": [
"overlay2.size=10G"  // Max container size
]
}

```

### MCP Server Integration in Containers

**Model Context Protocol (MCP) Configuration**:

```

// .devcontainer/.mcp/config.json
{
"mcpServers": {
"filesystem": {
"command": "npx",
"args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
"env": {
"ALLOWED_PATHS": "/workspace,/output"
}
},
"github": {
"command": "npx",
"args": ["-y", "@modelcontextprotocol/server-github"],
"env": {
"GITHUB_TOKEN": "\${GITHUB_TOKEN}",
"ALLOWED_REPOS": "myorg/myrepo"
}
},
"postgres": {
"command": "npx",
"args": ["-y", "@modelcontextprotocol/server-postgres"],
"env": {
"POSTGRES_URL": "postgresql://postgres:password@database:5432/testdb"
}
}
}
}

```

**Container-Specific MCP Setup**:

```


# Copy MCP configuration into container

mkdir -p .agent-output/mcp-configs

# Generate agent-specific MCP config

cat > .agent-output/mcp-configs/agent-1.json << 'EOF'
{
"mcpServers": {
"filesystem": {
"command": "npx",
"args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace/src/auth"],
"env": {
"ALLOWED_PATHS": "/workspace/src/auth,/output"
}
}
}
}
EOF

# Mount into container

docker run \
-v \$(pwd)/.agent-output/mcp-configs/agent-1.json:/home/vscode/.mcp/config.json:ro \
agent-image:latest

```

---

## 6. Hybrid Methodology: Combining Approaches

### Architecture Patterns for Hybrid Deployment

**Pattern 1: Container-per-Worktree**:

Each git worktree runs inside its own container for maximum isolation.

```

Container 1                    Container 2                    Container 3
├── Worktree: feature-a       ├── Worktree: feature-b       ├── Worktree: feature-c
├── Branch: feat-a            ├── Branch: feat-b            ├── Branch: feat-c
├── Agent: Claude Code        ├── Agent: Cursor             ├── Agent: Cline
└── Network: isolated         └── Network: isolated         └── Network: isolated

```

**Implementation**:
```


# Automation script: hybrid-deploy.sh

\#!/bin/bash

FEATURES=("auth" "payments" "notifications")
BASE_IMAGE="agent-base:latest"
WORKTREE_ROOT="../worktrees"

for feature in "${FEATURES[@]}"; do
    # Create worktree
    git worktree add "$WORKTREE_ROOT/$feature" -b "feature-$feature"

    # Launch container with worktree mount
    docker run -d \
        --name "agent-$feature" \
        --read-only \
        --cap-drop=ALL \
        --network=none \
        --memory=4g --cpus=2.0 \
        -v "$WORKTREE_ROOT/$feature:/workspace:ro" \
        -v "$(pwd)/agent-output/$feature:/output:rw" \
        "$BASE_IMAGE" \
        python -m agent.runner --task "implement_$feature"
    done

```

**Pattern 2: Shared Container with Worktree Isolation**:

Single container runs multiple agent processes, each operating on a different worktree.

```

Container (Orchestrator)
├── Agent Process 1 → Worktree: feature-a
├── Agent Process 2 → Worktree: feature-b
├── Agent Process 3 → Worktree: feature-c
└── Shared Resources: PostgreSQL, Redis

```

**Implementation**:
```


# Inside container, spawn multiple agent processes

docker run -d \
--name "agent-orchestrator" \
-v "$(pwd):/workspace:ro" \
    -v "$(pwd)/worktrees:/worktrees:rw" \
agent-base:latest \
bash -c '
cd /worktrees/feature-a \&\& python -m agent.runner --task auth \&
cd /worktrees/feature-b \&\& python -m agent.runner --task payments \&
cd /worktrees/feature-c \&\& python -m agent.runner --task notifications \&
wait
'

```

**Pattern 3: Kubernetes-Based Agent Cluster**:

Production-grade orchestration using Kubernetes with pod-per-worktree.

```


# k8s-agent-deployment.yaml

apiVersion: v1
kind: ConfigMap
metadata:
name: worktree-config
data:
setup.sh: |
\#!/bin/bash
git worktree add /workspace/\$BRANCH_NAME -b $BRANCH_NAME
    cd /workspace/$BRANCH_NAME
exec python -m agent.runner --task \$AGENT_TASK

***
apiVersion: batch/v1
kind: Job
metadata:
name: agent-auth
spec:
parallelism: 1
template:
spec:
securityContext:
runAsUser: 1000
runAsGroup: 1000
fsGroup: 1000
containers:
- name: agent
image: agent-base:latest
env:
- name: BRANCH_NAME
value: "feature-auth"
- name: AGENT_TASK
value: "implement_oauth"
resources:
requests:
memory: "4Gi"
cpu: "2"
limits:
memory: "4Gi"
cpu: "2"
volumeMounts:
- name: workspace
mountPath: /workspace
- name: output
mountPath: /output
- name: config
mountPath: /scripts
command: ["/bin/bash", "/scripts/setup.sh"]
volumes:
- name: workspace
persistentVolumeClaim:
claimName: git-repo-pvc
- name: output
persistentVolumeClaim:
claimName: agent-output-pvc
- name: config
configMap:
name: worktree-config
defaultMode: 0755
restartPolicy: OnFailure

```

### Container Use + Git Worktrees Integration

**Dagger Container Use Framework**:

Container Use by Dagger automates the hybrid pattern by pairing containerization with git worktree management.

**Setup**:
```


# Install Container Use MCP server

npm install -g @dagger/container-use

# Configure in Claude Code

mkdir -p ~/.config/claude-code/mcp
cat > ~/.config/claude-code/mcp/config.json << 'EOF'
{
"servers": {
"container-use": {
"command": "npx",
"args": ["-y", "@dagger/container-use"],
"env": {
"CONTAINER_USE_IMAGE": "ghcr.io/dagger/container-use:latest",
"WORKTREE_BASE": "../worktrees"
}
}
}
}
EOF

```

**Usage Workflow**:
1. Claude Code invokes Container Use via MCP
2. Container Use creates git worktree for task
3. Spins up container with worktree mounted
4. Agent executes task in isolated environment
5. Changes automatically committed to branch
6. Container terminated after completion
7. Review changes and merge if satisfactory

**Example Conversation**:
```

User: "Implement three different authentication approaches in parallel"

Claude Code (via Container Use):
✓ Created worktree: feature-auth-oauth (branch: auth-oauth)
✓ Container started: agent-oauth-a1b2c3
✓ Created worktree: feature-auth-jwt (branch: auth-jwt)
✓ Container started: agent-jwt-d4e5f6
✓ Created worktree: feature-auth-saml (branch: auth-saml)
✓ Container started: agent-saml-g7h8i9

All agents executing... Monitor with: container-use status

[5 minutes later]

✓ Agent agent-oauth-a1b2c3 complete
Branch: auth-oauth
Commits: 3
Files changed: 12

✓ Agent agent-jwt-d4e5f6 complete
Branch: auth-jwt
Commits: 2
Files changed: 8

Review implementations:
git diff main..auth-oauth
git diff main..auth-jwt

```

### Orchestration Strategies

**Strategy 1: Sequential with Parallelization**:

Break project into phases; parallelize within each phase.

```


# Phase-Based Orchestration Plan

## Phase 1: Foundation (Parallel)

- Agent A: Database schema → Container 1, Worktree: schema
- Agent B: API routes scaffold → Container 2, Worktree: api-scaffold
- Agent C: UI component library → Container 3, Worktree: ui-lib

Wait for Phase 1 completion before proceeding.

## Phase 2: Features (Parallel)

- Agent A: Authentication (uses Phase 1 schema) → Container 1, Worktree: auth
- Agent B: User management (uses Phase 1 schema) → Container 2, Worktree: users
- Agent C: Dashboard UI (uses Phase 1 components) → Container 3, Worktree: dashboard


## Phase 3: Integration (Sequential)

- Orchestrator: Merge selected implementations
- Orchestrator: Integration testing
- Orchestrator: Performance validation

```

**Strategy 2: Dynamic Task Queue**:

Central queue assigns tasks to available agents dynamically.

```


# task-queue-orchestrator.py

import docker
import queue
import threading

client = docker.from_env()
task_queue = queue.Queue()
results = {}

# Define tasks

tasks = [
{"id": 1, "branch": "feature-auth", "task": "implement_oauth"},
{"id": 2, "branch": "feature-payments", "task": "implement_stripe"},
{"id": 3, "branch": "feature-notifications", "task": "implement_email"},
{"id": 4, "branch": "feature-search", "task": "implement_elasticsearch"},
]

# Enqueue tasks

for task in tasks:
task_queue.put(task)

def worker(worker_id):
"""Worker thread that processes tasks from queue"""
while not task_queue.empty():
try:
task = task_queue.get(timeout=1)
except queue.Empty:
break

        print(f"Worker {worker_id} processing task {task['id']}")
        
        # Create worktree
        import subprocess
        subprocess.run([
            "git", "worktree", "add",
            f"../worktrees/{task['branch']}",
            "-b", task['branch']
        ])
        
        # Launch container
        container = client.containers.run(
            "agent-base:latest",
            detach=True,
            name=f"agent-{task['id']}",
            read_only=True,
            cap_drop=["ALL"],
            mem_limit="4g",
            environment={
                "AGENT_TASK": task['task'],
                "BRANCH_NAME": task['branch']
            },
            volumes={
                f"../worktrees/{task['branch']}": {
                    "bind": "/workspace",
                    "mode": "ro"
                }
            }
        )
        
        # Wait for completion
        result = container.wait()
        logs = container.logs().decode('utf-8')
        
        results[task['id']] = {
            "exit_code": result['StatusCode'],
            "logs": logs
        }
        
        # Cleanup
        container.remove()
        task_queue.task_done()
    
# Launch worker threads

num_workers = 4
threads = []
for i in range(num_workers):
t = threading.Thread(target=worker, args=(i,))
t.start()
threads.append(t)

# Wait for all workers to complete

for t in threads:
t.join()

print("All tasks completed:", results)

```

**Strategy 3: Fan-Out / Fan-In Pattern**:

Decompose task into independent subtasks (fan-out), execute in parallel, then consolidate results (fan-in).

```


# fan-out-fan-in.py

import concurrent.futures
import docker

client = docker.from_env()

def execute_agent_task(task):
"""Execute single agent task in container"""
\# Create worktree
import subprocess
subprocess.run([
"git", "worktree", "add",
f"../worktrees/{task['branch']}",
"-b", task['branch']
], check=True)

    # Run container
    container = client.containers.run(
        "agent-base:latest",
        detach=True,
        read_only=True,
        cap_drop=["ALL"],
        environment={"AGENT_TASK": task['task']},
        volumes={
            f"../worktrees/{task['branch']}": {"bind": "/workspace", "mode": "rw"}
        }
    )
    
    # Wait and collect results
    result = container.wait()
    logs = container.logs().decode('utf-8')
    container.remove()
    
    return {
        "task_id": task['id'],
        "branch": task['branch'],
        "exit_code": result['StatusCode'],
        "success": result['StatusCode'] == 0,
        "logs": logs
    }
    
# Fan-out: Execute all tasks in parallel

tasks = [
{"id": 1, "branch": "auth-v1", "task": "implement_oauth"},
{"id": 2, "branch": "auth-v2", "task": "implement_jwt"},
{"id": 3, "branch": "auth-v3", "task": "implement_saml"},
]

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
\# Fan-out
futures = [executor.submit(execute_agent_task, task) for task in tasks]

    # Fan-in: Collect results
    results = [f.result() for f in concurrent.futures.as_completed(futures)]
    
# Analyze and select best implementation

successful_results = [r for r in results if r['success']]
print(f"Successful implementations: {len(successful_results)}/{len(tasks)}")

# Select winner (e.g., based on test coverage, performance metrics)

# Manual review or automated selection logic here

```

### Progress Monitoring Across Both Systems

**Unified Monitoring Dashboard**:

```


# progress-monitor.py

import docker
import git
import time
from rich.console import Console
from rich.table import Table
from rich.live import Live

console = Console()
docker_client = docker.from_env()
repo = git.Repo(".")

def get_container_status():
"""Get status of all running agent containers"""
containers = docker_client.containers.list(filters={"name": "agent-"})

    status = []
    for container in containers:
        stats = container.stats(stream=False)
        status.append({
            "name": container.name,
            "status": container.status,
            "cpu_percent": calculate_cpu_percent(stats),
            "memory_mb": stats['memory_stats']['usage'] / 1024 / 1024,
            "uptime": (time.time() - container.attrs['State']['StartedAt'])
        })
    return status
    def get_worktree_progress():
"""Get progress from each worktree"""
worktrees = repo.git.worktree("list", "--porcelain").split("\n\n")

    progress = []
    for wt in worktrees:
        lines = wt.split("\n")
        if len(lines) < 2:
            continue
        
        path = lines.replace("worktree ", "")
        branch = lines.replace("branch refs/heads/", "")
        
        # Get commit count and file changes
        wt_repo = git.Repo(path)
        commits = len(list(wt_repo.iter_commits(branch, max_count=100)))
        
        # Get uncommitted changes
        changed_files = len(wt_repo.index.diff(None))
        untracked = len(wt_repo.untracked_files)
        
        progress.append({
            "branch": branch,
            "path": path,
            "commits": commits,
            "modified": changed_files,
            "untracked": untracked
        })
    return progress
    def render_dashboard():
"""Render unified monitoring dashboard"""
\# Container status table
container_table = Table(title="Container Status")
container_table.add_column("Container", style="cyan")
container_table.add_column("Status", style="green")
container_table.add_column("CPU %", justify="right")
container_table.add_column("Memory MB", justify="right")

    for c in get_container_status():
        container_table.add_row(
            c['name'],
            c['status'],
            f"{c['cpu_percent']:.1f}",
            f"{c['memory_mb']:.0f}"
        )
    
    # Worktree progress table
    worktree_table = Table(title="Worktree Progress")
    worktree_table.add_column("Branch", style="cyan")
    worktree_table.add_column("Commits", justify="right")
    worktree_table.add_column("Modified", justify="right")
    worktree_table.add_column("Untracked", justify="right")
    
    for w in get_worktree_progress():
        worktree_table.add_row(
            w['branch'],
            str(w['commits']),
            str(w['modified']),
            str(w['untracked'])
        )
    
    return container_table, worktree_table
    
# Live monitoring loop

with Live(console=console, refresh_per_second=1) as live:
while True:
container_table, worktree_table = render_dashboard()
live.update(container_table)
time.sleep(5)

```

**Centralized Logging Aggregation**:

```


# Fluentd configuration for container logs

# fluentd.conf

<source>
@type forward
port 24224
</source>

<filter agent.**>
@type record_transformer
<record>
agent_id \${tag_parts}
timestamp \${time}
</record>
</filter>

<match agent.**>
@type file
path /fluentd/log/agent-\${tag}.log
<buffer tag>
@type file
path /fluentd/log/buffer
flush_interval 10s
</buffer>
<format>
@type json
</format>
</match>

```

---

## 7. Critical Operational Considerations

### Conflict Prevention and Resolution Strategies

**Prevention Strategy 1: File Ownership Matrix**:

Explicitly assign file paths to single agents to prevent concurrent modifications.

```


# FILE_OWNERSHIP.md

| Path Pattern | Owner Agent | Read-Only Access |
| :-- | :-- | :-- |
| `/src/auth/**` | agent-auth | All |
| `/src/payments/**` | agent-payments | All |
| `/tests/auth/**` | agent-auth | All |
| `/tests/integration/**` | Shared (lock required) | All |
| `/docs/**` | agent-scribe | All |
| `/README.md` | Shared (lock required) | All |

**Lock Protocol**:

1. Agent requests lock in MULTI_AGENT_PLAN.md
2. Wait for orchestrator approval (max 5 minutes)
3. Edit file and commit
4. Release lock immediately
```

**Prevention Strategy 2: Module-Based Isolation**:

Design codebase with clear module boundaries that map to agent assignments.

```

src/
├── auth/          ← Agent 1 exclusive ownership
│   ├── oauth.py
│   └── jwt.py
├── payments/      ← Agent 2 exclusive ownership
│   ├── stripe.py
│   └── paypal.py
├── shared/        ← Read-only for all agents
│   └── utils.py
└── api/           ← Generated by orchestrator after merge

```

**Resolution Strategy 1: AI-Assisted Conflict Resolution**:

Modern tools like Cursor, JetBrains AI Assistant, and GitLab AI Merge Agent provide automated conflict resolution.

```


# Using Cursor AI for conflict resolution

# When merge conflict occurs:

git merge feature-branch

# Auto: CONFLICT in src/auth/oauth.py

# Invoke Cursor AI resolution

cursor resolve-conflicts src/auth/oauth.py

# Cursor AI analyzes:

# - Context from both branches

# - Semantic intent of changes

# - Historical merge patterns

# - Code style and conventions

# Generates resolution proposal

# Review and accept if correct

```

**Resolution Strategy 2: Three-Way Merge with Orchestrator Review**:

```


# Merge strategy when multiple implementations exist

# Example: Three different OAuth implementations

# Step 1: Orchestrator compares all implementations

git diff main..auth-oauth > oauth-impl.diff
git diff main..auth-jwt > jwt-impl.diff
git diff main..auth-saml > saml-impl.diff

# Step 2: Automated metrics collection

echo "OAuth implementation:" \&\& wc -l oauth-impl.diff
echo "JWT implementation:" \&\& wc -l jwt-impl.diff
pytest tests/auth/ --cov --branch=auth-oauth --json > oauth-coverage.json
pytest tests/auth/ --cov --branch=auth-jwt --json > jwt-coverage.json

# Step 3: Orchestrator (or human) selects winner

# Criteria: test coverage, code complexity, performance benchmarks

# Step 4: Cherry-pick components from non-selected branches

git checkout main
git merge auth-jwt  \# Winner
git cherry-pick auth-oauth~3  \# Social login component from OAuth impl

# Step 5: Archive non-merged branches

git branch -m auth-oauth archive/auth-oauth-2025-11-23
git branch -m auth-saml archive/auth-saml-2025-11-23

```

### Resource Management (Disk, Memory, CPU)

**Disk Space Considerations**:

**Worktrees**:
- Shared `.git` directory (no duplication)
- Each worktree: Working files only (~project size)
- Example: 500MB codebase × 10 worktrees = ~5GB (not 5GB×10)

**Containers**:
- Base image layers (shared)
- Per-container writable layer (~100MB-1GB)
- Volumes for persistent data
- Example: 2GB image × 10 containers = 2GB + (10 × 500MB) = ~7GB

**Monitoring and Cleanup**:
```


# Monitor disk usage

df -h
docker system df  \# Container disk usage
du -sh worktrees/* | sort -h  \# Worktree sizes

# Cleanup automation

# cleanup-resources.sh

\#!/bin/bash

# Remove merged worktrees

git worktree list | grep -v "main" | while read -r wt; do
branch=$(echo "$wt" | awk '{print $NF}' | tr -d '[]')
    if git branch --merged main | grep -q "$branch"; then
path=$(echo "$wt" | awk '{print $1}')
        git worktree remove "$path" --force
echo "Removed merged worktree: \$path"
fi
done

# Prune stale worktrees

git worktree prune

# Clean Docker resources

docker container prune -f
docker image prune -af
docker volume prune -f

```

**Memory Management**:

```


# Set memory limits per container

docker run --memory=4g --memory-swap=4g agent-image:latest

# Monitor memory usage

docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}"

# Prevent OOM kills with reservation

docker run \
--memory=4g \
--memory-reservation=2g \
--oom-kill-disable=false \
agent-image:latest

```

**CPU Allocation**:

```


# Allocate specific CPU cores

docker run --cpuset-cpus="0,1" agent-image:latest  \# Use cores 0 and 1

# Set CPU quota (percentage)

docker run --cpus=2.5 agent-image:latest  \# 2.5 CPU cores

# Fair scheduling with shares

docker run --cpu-shares=512 agent-low-priority:latest
docker run --cpu-shares=1024 agent-high-priority:latest  \# Gets 2x CPU time

```

### Initialization Overhead and Performance Optimization

**Worktree Initialization**:
- **Time**: <1 second (instant)
- **Overhead**: Minimal (git metadata update)
- **Optimization**: Pre-create common worktrees

```


# Pre-create worktree pool

for i in {1..10}; do
git worktree add ../worktrees/agent-pool-$i -b pool-$i --detach
done

# Assign to agent on demand (checkout branch)

cd ../worktrees/agent-pool-1
git checkout -b feature-auth

```

**Container Initialization**:
- **Time**: 10-60 seconds (depends on image size, dependencies)
- **Overhead**: Image pull, layer extraction, post-create scripts
- **Optimization**:
  1. Pre-build optimized images with dependencies baked in
  2. Use container registries with fast pull times
  3. Layer caching strategies

```


# Optimized multi-stage build

FROM python:3.11-slim AS builder

# Install build dependencies

RUN apt-get update \&\& apt-get install -y gcc
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Production image

FROM python:3.11-slim
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*

# Result: Smaller image, faster startup

```

**Warm Container Pool**:

```


# container-pool.py - Maintain warm container pool

import docker
import queue
import threading

client = docker.from_env()
container_pool = queue.Queue(maxsize=5)

def create_container():
"""Create and return a ready-to-use container"""
return client.containers.run(
"agent-base:latest",
detach=True,
read_only=True,
cap_drop=["ALL"],
mem_limit="4g",
command="sleep infinity"  \# Idle until assigned task
)

def pool_manager():
"""Maintain pool of warm containers"""
while True:
if container_pool.qsize() < 5:
container = create_container()
container_pool.put(container)
time.sleep(1)

# Start pool manager

threading.Thread(target=pool_manager, daemon=True).start()

# Assign task to warm container

def assign_task(task):
container = container_pool.get()
\# Execute task in existing container (fast)
container.exec_run(f"python -m agent.runner --task {task}")
container_pool.put(container)  \# Return to pool

```

### Security Boundaries and Process Isolation

**Defense-in-Depth Layering**:

| **Layer** | **Worktrees** | **Containers** | **Hybrid** |
|-----------|---------------|----------------|------------|
| **Filesystem** | Separate dirs | Isolated mount namespaces | ✓✓ Both |
| **Process** | Shared OS | Separate PID namespaces | ✓✓ Container |
| **Network** | Shared network | Isolated network stack | ✓✓ Container |
| **User** | Same UID | User namespaces | ✓✓ Container |
| **Capabilities** | Full capabilities | Dropped capabilities | ✓✓ Container |
| **Syscalls** | All allowed | Seccomp filtering | ✓✓ Container |

**Security Boundary Testing**:

```


# Test 1: Verify read-only filesystem

docker exec agent-test touch /usr/bin/malicious

# Expected: touch: cannot touch '/usr/bin/malicious': Read-only file system

# Test 2: Verify capability restrictions

docker exec agent-test capsh --print | grep "Current:"

# Expected: Current: =

# Test 3: Verify network isolation

docker exec agent-test ping -c 1 google.com

# Expected: ping: connect: Network is unreachable

# Test 4: Verify resource limits

docker exec agent-test stress --vm 1 --vm-bytes 10G

# Expected: Container OOM-killed at 4GB limit

```

**Audit Logging for Security Events**:

```


# security-audit.py

import docker
import logging

logging.basicConfig(
filename='agent-security-audit.log',
level=logging.INFO,
format='%(asctime)s - %(levelname)s - %(message)s'
)

client = docker.from_env()

def audit_container_creation(container):
"""Log security-relevant container configuration"""
config = container.attrs['HostConfig']

    # Check for dangerous configurations
    if config.get('Privileged'):
        logging.warning(f"Container {container.name} running in privileged mode!")
    
    if 'CAP_SYS_ADMIN' in config.get('CapAdd', []):
        logging.warning(f"Container {container.name} has CAP_SYS_ADMIN!")
    
    if config.get('ReadonlyRootfs') is False:
        logging.warning(f"Container {container.name} has writable root filesystem!")
    
    # Log approved configuration
    logging.info(f"Container {container.name} created with secure config")
    logging.info(f"  Memory limit: {config.get('Memory')}")
    logging.info(f"  CPU quota: {config.get('CpuQuota')}")
    logging.info(f"  Network mode: {config.get('NetworkMode')}")
    ```

### Cleanup and Maintenance Procedures

**Automated Cleanup Schedule**:

```


# cleanup-schedule.sh - Run via cron

\#!/bin/bash

LOG_FILE="/var/log/agent-cleanup.log"

echo "$(date): Starting cleanup" >> "$LOG_FILE"

# 1. Remove merged worktrees (older than 7 days)

find ../worktrees -maxdepth 1 -type d -mtime +7 | while read -r wt; do
branch=$(basename "$wt")
if git branch --merged main | grep -q "$branch"; then
        git worktree remove "$wt" --force
echo "Removed old merged worktree: $wt" >> "$LOG_FILE"
fi
done

# 2. Prune stale worktree metadata

git worktree prune

# 3. Remove stopped containers (older than 24 hours)

docker container prune --filter "until=24h" -f

# 4. Remove unused images (older than 7 days)

docker image prune --filter "until=168h" -af

# 5. Remove unused volumes

docker volume prune -f

# 6. Clean up agent output directories (older than 30 days)

find agent-output/ -type f -mtime +30 -delete

echo "$(date): Cleanup complete" >> "$LOG_FILE"

```

**Add to crontab**:
```


# Run cleanup daily at 2 AM

0 2 * * * /path/to/cleanup-schedule.sh

```

**Manual Cleanup Commands**:

```


# Worktree cleanup

git worktree list | grep "detached" | awk '{print \$1}' | xargs -I {} git worktree remove {}
git worktree prune

# Container cleanup

docker stop \$(docker ps -aq)  \# Stop all containers
docker rm \$(docker ps -aq)    \# Remove all containers
docker system prune -af --volumes  \# Nuclear option: remove everything

# Disk space recovery

git gc --aggressive --prune=now  \# Garbage collect Git objects

```

---

## 8. Monitoring and Progress Tracking

### Real-Time Status Monitoring

**Multi-Agent Status Dashboard**:

```


# status-monitor.py

import docker
import git
import time
import json
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.live import Live

console = Console()
docker_client = docker.from_env()
repo = git.Repo(".")

class AgentMonitor:
def __init__(self):
self.start_time = time.time()

    def get_container_metrics(self):
        """Get real-time metrics for all agent containers"""
        containers = docker_client.containers.list(filters={"name": "agent-"})
        metrics = []
        
        for container in containers:
            stats = container.stats(stream=False)
            
            # Calculate CPU percentage
            cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - \
                        stats['precpu_stats']['cpu_usage']['total_usage']
            system_delta = stats['cpu_stats']['system_cpu_usage'] - \
                          stats['precpu_stats']['system_cpu_usage']
            cpu_percent = (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0.0
            
            # Memory usage
            mem_usage = stats['memory_stats']['usage']
            mem_limit = stats['memory_stats']['limit']
            mem_percent = (mem_usage / mem_limit) * 100.0
            
            metrics.append({
                "name": container.name,
                "status": container.status,
                "cpu_percent": cpu_percent,
                "memory_mb": mem_usage / 1024 / 1024,
                "memory_percent": mem_percent,
                "uptime_seconds": self._get_uptime(container)
            })
        
        return metrics
    
    def get_worktree_status(self):
        """Get status of all active worktrees"""
        worktrees = []
        worktree_list = repo.git.worktree("list", "--porcelain")
        
        for block in worktree_list.split("\n\n"):
            if not block.strip():
                continue
                
            lines = block.split("\n")
            if len(lines) < 2:
                continue
            
            path = lines.replace("worktree ", "")
            branch = None
            for line in lines:
                if line.startswith("branch"):
                    branch = line.replace("branch refs/heads/", "")
            
            if not branch or path == repo.working_dir:
                continue
            
            try:
                wt_repo = git.Repo(path)
                commits = len(list(wt_repo.iter_commits(branch, max_count=100)))
                modified = len(wt_repo.index.diff(None))
                untracked = len(wt_repo.untracked_files)
                
                # Read agent status from planning document
                status = self._read_agent_status(branch)
                
                worktrees.append({
                    "branch": branch,
                    "path": path,
                    "commits": commits,
                    "modified_files": modified,
                    "untracked_files": untracked,
                    "status": status
                })
            except Exception as e:
                console.print(f"[yellow]Warning: Could not read {path}: {e}[/yellow]")
        
        return worktrees
    
    def _read_agent_status(self, branch):
        """Read agent status from MULTI_AGENT_PLAN.md"""
        try:
            with open("MULTI_AGENT_PLAN.md", "r") as f:
                content = f.read()
                # Simple parsing - look for branch name in table
                for line in content.split("\n"):
                    if branch in line and "|" in line:
                        parts = line.split("|")
                        if len(parts) >= 6:
                            return {
                                "task": parts.strip(),
                                "status": parts.strip(),
                                "progress": parts.strip() if len(parts) > 6 else "N/A"
                            }
        except:
            pass
        return {"task": "Unknown", "status": "Unknown", "progress": "N/A"}
    
    def _get_uptime(self, container):
        """Calculate container uptime in seconds"""
        started_at = container.attrs['State']['StartedAt']
        start_time = datetime.fromisoformat(started_at.replace('Z', '+00:00'))
        return (datetime.now(start_time.tzinfo) - start_time).total_seconds()
    
    def render_dashboard(self):
        """Render comprehensive monitoring dashboard"""
        # Header
        elapsed = time.time() - self.start_time
        header = Panel(
            f"[bold cyan]Agent Orchestration Dashboard[/bold cyan]\n"
            f"Runtime: {int(elapsed // 60)}m {int(elapsed % 60)}s",
            border_style="cyan"
        )
        
        # Container metrics table
        container_table = Table(title="Container Resources", show_header=True)
        container_table.add_column("Container", style="cyan", width=20)
        container_table.add_column("Status", style="green", width=10)
        container_table.add_column("CPU %", justify="right", width=8)
        container_table.add_column("Memory", justify="right", width=15)
        container_table.add_column("Uptime", justify="right", width=10)
        
        for metric in self.get_container_metrics():
            status_color = "green" if metric['status'] == "running" else "red"
            container_table.add_row(
                metric['name'],
                f"[{status_color}]{metric['status']}[/{status_color}]",
                f"{metric['cpu_percent']:.1f}%",
                f"{metric['memory_mb']:.0f}MB ({metric['memory_percent']:.1f}%)",
                f"{int(metric['uptime_seconds'])}s"
            )
        
        # Worktree status table
        worktree_table = Table(title="Worktree Progress", show_header=True)
        worktree_table.add_column("Branch", style="cyan", width=25)
        worktree_table.add_column("Task", width=25)
        worktree_table.add_column("Status", width=15)
        worktree_table.add_column("Progress", justify="right", width=10)
        worktree_table.add_column("Changes", justify="right", width=10)
        
        for wt in self.get_worktree_status():
            status_emoji = {
                "Complete": "✅",
                "In Progress": "⏳",
                "Not Started": "🔴",
                "Blocked": "⚠️"
            }.get(wt['status']['status'], "❓")
            
            worktree_table.add_row(
                wt['branch'],
                wt['status']['task'],
                f"{status_emoji} {wt['status']['status']}",
                wt['status']['progress'],
                f"{wt['commits']}c, {wt['modified_files']}m, {wt['untracked_files']}u"
            )
        
        return header, container_table, worktree_table
    
# Main monitoring loop

monitor = AgentMonitor()

with Live(console=console, refresh_per_second=2, screen=True) as live:
while True:
try:
header, container_table, worktree_table = monitor.render_dashboard()

            from rich.layout import Layout
            layout = Layout()
            layout.split_column(
                Layout(header, size=3),
                Layout(container_table),
                Layout(worktree_table)
            )
            
            live.update(layout)
            time.sleep(2)
        except KeyboardInterrupt:
            break
    ```

### Logging and Observability

**Structured Logging Configuration**:

```


# agent-logger.py

import logging
import json
from datetime import datetime

class StructuredLogger:
def __init__(self, agent_id, log_file):
self.agent_id = agent_id
self.logger = logging.getLogger(agent_id)
self.logger.setLevel(logging.INFO)

        # JSON formatter
        formatter = logging.Formatter(
            '%(message)s'
        )
        
        handler = logging.FileHandler(log_file)
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    def log_event(self, event_type, message, **kwargs):
        """Log structured event"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": self.agent_id,
            "event_type": event_type,
            "message": message,
            **kwargs
        }
        self.logger.info(json.dumps(log_entry))
    
# Usage in agent code

logger = StructuredLogger("agent-auth", "logs/agent-auth.log")

logger.log_event("task_started", "Beginning OAuth implementation",
branch="feature-auth-oauth",
estimated_duration="2 hours")

logger.log_event("file_modified", "Updated OAuth handler",
file_path="src/auth/oauth.py",
lines_changed=45)

logger.log_event("test_executed", "Unit tests passed",
test_suite="auth.oauth",
tests_passed=12,
tests_failed=0,
coverage_percent=95.3)

logger.log_event("task_completed", "OAuth implementation finished",
duration_seconds=7200,
commits=3,
files_changed=8)

```

**Centralized Log Aggregation with Fluentd**:

```


# fluentd.conf

<source>
@type tail
path /workspace/logs/agent-*.log
pos_file /var/log/fluentd/agent.pos
tag agent.logs
<parse>
@type json
time_key timestamp
time_format %Y-%m-%dT%H:%M:%S
</parse>
</source>

<filter agent.logs>
  @type record_transformer
  <record>
    hostname "#{Socket.gethostname}"
    environment production
  </record>
</filter>
<match agent.logs>
  @type elasticsearch
  host elasticsearch
  port 9200
  index_name agent-logs
  type_name _doc
  <buffer>
    @type file
    path /var/log/fluentd/buffer/agent
    flush_interval 10s
  </buffer>
</match>
```

### Progress Dashboards and Metrics

**Key Performance Indicators (KPIs)**:

```


# metrics-collector.py

import time
import docker
import json
from datetime import datetime, timedelta

class MetricsCollector:
def __init__(self):
self.client = docker.from_env()
self.start_time = datetime.now()
self.metrics = {
"total_tasks": 0,
"completed_tasks": 0,
"failed_tasks": 0,
"avg_task_duration": 0,
"total_commits": 0,
"total_files_changed": 0,
"agents_active": 0,
"resource_utilization": {}
}

    def collect_metrics(self):
        """Collect current metrics from all agents"""
        containers = self.client.containers.list(filters={"name": "agent-"})
        
        self.metrics["agents_active"] = len(containers)
        
        # Aggregate resource usage
        total_cpu = 0
        total_memory = 0
        
        for container in containers:
            stats = container.stats(stream=False)
            cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - \
                        stats['precpu_stats']['cpu_usage']['total_usage']
            system_delta = stats['cpu_stats']['system_cpu_usage'] - \
                          stats['precpu_stats']['system_cpu_usage']
            cpu_percent = (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0.0
            
            total_cpu += cpu_percent
            total_memory += stats['memory_stats']['usage'] / 1024 / 1024  # MB
        
        self.metrics["resource_utilization"] = {
            "total_cpu_percent": total_cpu,
            "total_memory_mb": total_memory,
            "avg_cpu_per_agent": total_cpu / len(containers) if containers else 0,
            "avg_memory_per_agent": total_memory / len(containers) if containers else 0
        }
        
        # Calculate efficiency metrics
        elapsed_time = (datetime.now() - self.start_time).total_seconds()
        self.metrics["runtime_seconds"] = elapsed_time
        
        if self.metrics["completed_tasks"] > 0:
            self.metrics["avg_task_duration"] = elapsed_time / self.metrics["completed_tasks"]
            self.metrics["throughput_tasks_per_hour"] = (self.metrics["completed_tasks"] / elapsed_time) * 3600
        
        return self.metrics
    
    def export_prometheus_metrics(self):
        """Export metrics in Prometheus format"""
        metrics = self.collect_metrics()
        
        prometheus_output = f"""
    
# HELP agent_tasks_total Total number of tasks assigned

# TYPE agent_tasks_total counter

agent_tasks_total {metrics['total_tasks']}

# HELP agent_tasks_completed Number of completed tasks

# TYPE agent_tasks_completed counter

agent_tasks_completed {metrics['completed_tasks']}

# HELP agent_tasks_failed Number of failed tasks

# TYPE agent_tasks_failed counter

agent_tasks_failed {metrics['failed_tasks']}

# HELP agent_active_count Number of active agents

# TYPE agent_active_count gauge

agent_active_count {metrics['agents_active']}

# HELP agent_cpu_percent Total CPU usage percentage

# TYPE agent_cpu_percent gauge

agent_cpu_percent {metrics['resource_utilization']['total_cpu_percent']}

# HELP agent_memory_mb Total memory usage in MB

# TYPE agent_memory_mb gauge

agent_memory_mb {metrics['resource_utilization']['total_memory_mb']}

# HELP agent_throughput_tasks_per_hour Task completion rate

# TYPE agent_throughput_tasks_per_hour gauge

agent_throughput_tasks_per_hour {metrics.get('throughput_tasks_per_hour', 0)}
"""

        return prometheus_output.strip()
    
# HTTP server to expose metrics

from http.server import HTTPServer, BaseHTTPRequestHandler

collector = MetricsCollector()

class MetricsHandler(BaseHTTPRequestHandler):
def do_GET(self):
if self.path == '/metrics':
self.send_response(200)
self.send_header('Content-Type', 'text/plain')
self.end_headers()
self.wfile.write(collector.export_prometheus_metrics().encode())
else:
self.send_response(404)
self.end_headers()

# Run metrics server on port 9090

server = HTTPServer(('0.0.0.0', 9090), MetricsHandler)
print("Metrics server running on http://localhost:9090/metrics")
server.serve_forever()

```

### Debugging Parallel Agent Sessions

**Interactive Debugging Tools**:

```


# Debug container agent

docker exec -it agent-auth bash

# View agent logs in real-time

docker logs -f agent-auth

# Inspect container filesystem

docker exec agent-auth ls -la /workspace

# Monitor resource usage

docker stats agent-auth

# Copy debug artifacts from container

docker cp agent-auth:/output/debug-trace.log ./debug-logs/

# Attach to running agent process

docker attach agent-auth  \# Ctrl+C to detach

```

**Debugging Checklist**:

| **Issue** | **Diagnosis Command** | **Common Cause** |
|-----------|----------------------|------------------|
| Agent stuck | `docker logs agent-X` | Infinite loop, waiting for input |
| Out of memory | `docker stats agent-X` | Memory leak, large dataset |
| Slow performance | `docker stats agent-X` | CPU/disk throttling |
| Network error | `docker exec agent-X curl google.com` | Network isolation enabled |
| File not found | `docker exec agent-X ls /workspace` | Wrong mount path |
| Permission denied | `docker exec agent-X whoami` | Running as wrong user |

---

## 9. Merge Strategies and Integration

### Manual Merge Workflows

**Review and Selection Process**:

```


# Step 1: Compare all parallel implementations

git fetch --all

# List all feature branches

git branch -a | grep "feature/"

# For each implementation, generate comparison report

for branch in feature-auth-oauth feature-auth-jwt feature-auth-saml; do
echo "=== Analysis: \$branch ==="

    # Code metrics
    echo "Lines of code:"
    git diff main..$branch | grep "^+" | wc -l
    
    echo "Files changed:"
    git diff main..$branch --name-only | wc -l
    
    echo "Commits:"
    git log main..$branch --oneline | wc -l
    
    # Checkout and test
    git worktree add ../review-$branch $branch
    cd ../review-$branch
    
    # Run tests and collect metrics
    pytest --cov --cov-report=json -v > test-results.txt 2>&1
    
    echo "Test coverage:"
    jq '.totals.percent_covered' coverage.json
    
    echo "Test results:"
    grep -E "passed|failed" test-results.txt
    
    cd -
    done

# Step 2: Human review and decision

# Open each worktree for side-by-side comparison

code ../review-feature-auth-oauth \&
code ../review-feature-auth-jwt \&
code ../review-feature-auth-saml \&

# Generate comparison document

cat > IMPLEMENTATION_COMPARISON.md << 'EOF'

# Authentication Implementation Comparison

## Quantitative Metrics

| Implementation | LOC | Files | Commits | Coverage | Tests Passed |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OAuth 2.0 | 450 | 8 | 5 | 92% | 42/45 |
| JWT | 320 | 6 | 3 | 96% | 38/38 |
| SAML | 580 | 12 | 7 | 85% | 31/35 |

## Qualitative Assessment

### OAuth 2.0

**Strengths**: Comprehensive social login support, industry standard
**Weaknesses**: More complex, requires external provider configuration

### JWT

**Strengths**: Simplest implementation, stateless, excellent test coverage
**Weaknesses**: No built-in social login, requires token refresh logic

### SAML

**Strengths**: Enterprise SSO support
**Weaknesses**: Most complex, lower test coverage, overkill for current needs

## Decision: Select JWT Implementation

**Rationale**:

- Best test coverage (96%)
- Simplest codebase (320 LOC)
- Meets current requirements
- Can add social login later by cherry-picking from OAuth branch


## Integration Plan:

1. Merge JWT branch to main
2. Cherry-pick social login components from OAuth branch
3. Archive SAML branch for future enterprise needs
EOF
```

**Step 3: Execute Merge**:

```


# Checkout main and ensure clean state

git checkout main
git pull origin main

# Merge selected implementation (JWT)

git merge --no-ff feature-auth-jwt -m "feat: implement JWT authentication

Comprehensive JWT-based authentication with:

- Token generation and validation
- Refresh token rotation
- Role-based access control
- 96% test coverage

Reviewed alongside OAuth and SAML implementations.
Selected for simplicity and test coverage.

See IMPLEMENTATION_COMPARISON.md for analysis."

# Cherry-pick specific features from other branches

git cherry-pick feature-auth-oauth~2  \# Social login component

# Resolve any conflicts

git status

# ... manual conflict resolution if needed ...

# Run full test suite

pytest tests/ --cov --cov-report=html -v

# Push to main

git push origin main

# Clean up feature branches

git branch -d feature-auth-jwt
git push origin --delete feature-auth-oauth feature-auth-saml

# Archive remaining branches locally

git branch -m feature-auth-oauth archive/oauth-2025-11-23
git branch -m feature-auth-saml archive/saml-2025-11-23

```

### AI-Assisted Conflict Resolution

**Using Cursor AI Merge Resolution**:

```


# When conflict occurs during merge

git merge feature-branch

# Auto: CONFLICT (content): Merge conflict in src/auth/oauth.py

# Invoke Cursor AI

cursor ai-resolve-conflicts

# Cursor analyzes:

# 1. Both versions of conflicting code

# 2. Commit history and intent

# 3. Surrounding context

# 4. Project coding standards

# Example conflict:

# <<<<<<< HEAD

# def authenticate(username, password):

# user = User.query.filter_by(username=username).first()

# return user.verify_password(password)

# =======

# def authenticate(credentials):

# user = db.session.query(User).filter_by(

# username=credentials['username']

# ).first()

# return user and user.check_password(credentials['password'])

# >>>>>>> feature-branch

# Cursor AI suggests:

def authenticate(credentials):
"""Authenticate user with provided credentials.

    Args:
        credentials: Dict with 'username' and 'password' keys
    
    Returns:
        bool: True if authentication successful
    """
    user = User.query.filter_by(
        username=credentials['username']
    ).first()
    return user and user.verify_password(credentials['password'])
    
# Review AI suggestion, accept or modify

# Then mark as resolved

git add src/auth/oauth.py
git commit -m "Merge feature-branch: resolve auth conflicts"

```

**GitLab AI Merge Agent**:

GitLab's AI Merge Agent (released November 2025) automates conflict resolution with 85% success rate.

```


# .gitlab-ci.yml

merge_validation:
stage: test
script:
- gitlab-ai-agent merge-validate $CI_MERGE_REQUEST_IID
  rules:
    - if: '$CI_MERGE_REQUEST_IID'
allow_failure: false

ai_merge:
stage: deploy
script:
- gitlab-ai-agent auto-merge $CI_MERGE_REQUEST_IID
  rules:
    - if: '$CI_MERGE_REQUEST_IID \&\& \$CI_MERGE_REQUEST_APPROVED'
when: manual

```

### Automated Merge Strategies

**Rebase-Based Workflow**:

```


# Update all feature branches with latest main

for branch in \$(git branch | grep "feature/"); do
git checkout \$branch
git rebase main

    if [ $? -ne 0 ]; then
        echo "⚠️  Rebase conflicts in $branch - manual resolution required"
        git rebase --abort
    else
        echo "✅ $branch rebased successfully"
        git push --force-with-lease
    fi
    done

git checkout main

```

**Automated Merge Queue**:

```


# auto-merge-queue.py

import git
import subprocess
import time

repo = git.Repo(".")
merge_queue = [
{"branch": "feature-auth-jwt", "priority": 1},
{"branch": "feature-payments-stripe", "priority": 2},
{"branch": "feature-notifications-email", "priority": 3}
]

def can_merge_cleanly(branch):
"""Check if branch can be merged without conflicts"""
try:
\# Dry-run merge
result = subprocess.run(
["git", "merge", "--no-commit", "--no-ff", branch],
capture_output=True,
text=True
)

        # Abort the dry-run
        subprocess.run(["git", "merge", "--abort"])
        
        return result.returncode == 0
    except:
        return False
    def run_tests():
"""Run test suite"""
result = subprocess.run(["pytest", "tests/", "-v"], capture_output=True)
return result.returncode == 0

def merge_branch(branch):
"""Merge branch with validation"""
print(f"Processing merge: {branch}")

    # Ensure main is up-to-date
    repo.git.checkout("main")
    repo.git.pull("origin", "main")
    
    # Check if merge is clean
    if not can_merge_cleanly(branch):
        print(f"❌ {branch} has merge conflicts - skipping")
        return False
    
    # Execute merge
    repo.git.merge("--no-ff", branch, m=f"Merge {branch}")
    
    # Run tests
    if not run_tests():
        print(f"❌ Tests failed after merging {branch} - rolling back")
        repo.git.reset("--hard", "HEAD~1")
        return False
    
    # Push to remote
    repo.git.push("origin", "main")
    print(f"✅ {branch} merged successfully")
    
    # Delete remote branch
    repo.git.push("origin", "--delete", branch)
    
    return True
    
# Process merge queue

for item in sorted(merge_queue, key=lambda x: x['priority']):
if merge_branch(item['branch']):
time.sleep(5)  \# Brief pause between merges
else:
print(f"⚠️  Manual intervention required for {item['branch']}")

```

### Quality Gates and Testing Requirements

**Pre-Merge Validation Checklist**:

```


# .pre-merge-checklist.yml

validation_gates:
code_quality:
- name: "Linting"
command: "pylint src/"
threshold: "score >= 8.0"

    - name: "Type checking"
      command: "mypy src/ --strict"
      threshold: "zero errors"
    
    - name: "Code formatting"
      command: "black --check src/"
      threshold: "no changes needed"
    testing:
- name: "Unit tests"
command: "pytest tests/unit/ -v"
threshold: "100% pass"

    - name: "Integration tests"
      command: "pytest tests/integration/ -v"
      threshold: "100% pass"
    
    - name: "Coverage"
      command: "pytest --cov=src --cov-report=term"
      threshold: "coverage >= 80%"
    security:
- name: "Dependency audit"
command: "pip-audit"
threshold: "zero high/critical vulnerabilities"

    - name: "Secret scanning"
      command: "gitleaks detect"
      threshold: "zero secrets found"
    performance:
- name: "Load testing"
command: "locust -f tests/load_test.py --headless -u 100 -r 10 --run-time 60s"
threshold: "p95 < 500ms"

```

**Automated Gate Enforcement**:

```

\#!/bin/bash

# pre-merge-validation.sh

set -e  \# Exit on any failure

echo "🔍 Running pre-merge validation gates..."

# Gate 1: Code quality

echo "Running linters..."
pylint src/ --fail-under=8.0
black --check src/
mypy src/ --strict

# Gate 2: Testing

echo "Running test suites..."
pytest tests/ -v --cov=src --cov-report=term --cov-report=html --cov-fail-under=80

# Gate 3: Security

echo "Running security scans..."
pip-audit --strict
gitleaks detect --no-git

# Gate 4: Performance

echo "Running performance tests..."
pytest tests/performance/ -v --benchmark-only

echo "✅ All validation gates passed!"

```

**Integration with CI/CD**:

```


# .github/workflows/pre-merge-validation.yml

name: Pre-Merge Validation

on:
pull_request:
branches: [main]

jobs:
validate:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run validation gates
        run: bash .github/scripts/pre-merge-validation.sh
      
      - name: Upload coverage report
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
      
      - name: Comment PR with results
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const coverage = fs.readFileSync('coverage.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Validation Results\n\n${coverage}`
            });
    ```

---

## 10. Real-World Scenarios and Use Cases

### Feature Implementation Parallelization

**Scenario: E-Commerce Checkout Flow**

Three agents implement different components of checkout simultaneously.

**Setup**:
```


# Create worktrees for parallel development

git worktree add ../worktrees/payment-gateway -b feature/payment-integration
git worktree add ../worktrees/inventory-check -b feature/inventory-validation
git worktree add ../worktrees/order-confirmation -b feature/order-emails

# Launch agents in separate terminals

tmux new-session -d -s agents

tmux send-keys -t agents:0 "cd ../worktrees/payment-gateway \&\& claude-code 'Implement Stripe payment integration with 3D Secure support'" C-m

tmux new-window -t agents:1
tmux send-keys -t agents:1 "cd ../worktrees/inventory-check \&\& cursor 'Implement real-time inventory validation with Redis caching'" C-m

tmux new-window -t agents:2
tmux send-keys -t agents:2 "cd ../worktrees/order-confirmation \&\& cline 'Implement order confirmation email system with templates'" C-m

# Monitor all agents

tmux attach -t agents

```

**File Ownership Matrix**:
```

| Path | Owner | Rationale |
| :-- | :-- | :-- |
| `/src/payments/**` | agent-payment | Payment logic isolation |
| `/src/inventory/**` | agent-inventory | Inventory logic isolation |
| `/src/notifications/**` | agent-emails | Email logic isolation |
| `/src/checkout/checkout_controller.py` | Shared (lock) | Integration point |

```

**Coordination Protocol**:
```


# checkout_controller.py (integration point)

# Each agent implements their interface

# Orchestrator integrates after all complete

class CheckoutController:
def __init__(self):
self.payment_service = PaymentService()  \# Agent 1
self.inventory_service = InventoryService()  \# Agent 2
self.notification_service = NotificationService()  \# Agent 3

    def process_checkout(self, cart, user):
        # Step 1: Validate inventory (Agent 2)
        if not self.inventory_service.validate_availability(cart.items):
            return {"error": "Items out of stock"}
        
        # Step 2: Process payment (Agent 1)
        payment_result = self.payment_service.charge(
            amount=cart.total,
            customer=user
        )
        
        if not payment_result.success:
            return {"error": "Payment failed"}
        
        # Step 3: Reserve inventory
        self.inventory_service.reserve_items(cart.items)
        
        # Step 4: Send confirmation (Agent 3)
        self.notification_service.send_order_confirmation(
            user=user,
            order=payment_result.order
        )
        
        return {"success": True, "order_id": payment_result.order.id}
    ```

**Results**:
- **Parallel Time**: 2 hours (longest agent task)
- **Sequential Time**: 6 hours (sum of all tasks)
- **Speedup**: 3x faster
- **Integration Time**: 30 minutes (orchestrator merges interfaces)

### Architecture Exploration with Multiple Approaches

**Scenario: Database ORM Selection**

Test three different ORM implementations to determine best fit.

**Setup**:
```


# Create containerized worktrees for complete isolation

# Each needs different dependencies

# Approach 1: SQLAlchemy

docker run -d --name agent-sqlalchemy \
--read-only --cap-drop=ALL --memory=4g \
-v \$(pwd)/worktrees/orm-sqlalchemy:/workspace:rw \
agent-base:latest \
bash -c "git worktree add /workspace -b orm-sqlalchemy \&\& cd /workspace \&\& \
pip install sqlalchemy \&\& python -m agent.runner --task implement_sqlalchemy_models"

# Approach 2: Django ORM

docker run -d --name agent-django \
--read-only --cap-drop=ALL --memory=4g \
-v \$(pwd)/worktrees/orm-django:/workspace:rw \
agent-base:latest \
bash -c "git worktree add /workspace -b orm-django \&\& cd /workspace \&\& \
pip install django \&\& python -m agent.runner --task implement_django_models"

# Approach 3: Peewee

docker run -d --name agent-peewee \
--read-only --cap-drop=ALL --memory=4g \
-v \$(pwd)/worktrees/orm-peewee:/workspace:rw \
agent-base:latest \
bash -c "git worktree add /workspace -b orm-peewee \&\& cd /workspace \&\& \
pip install peewee \&\& python -m agent.runner --task implement_peewee_models"

```

**Evaluation Criteria**:
```


# orm-evaluation.yml

evaluation_metrics:
quantitative:
- lines_of_code: "Measure code verbosity"
- query_performance: "Benchmark complex queries (1000 iterations)"
- memory_footprint: "Memory usage under load"
- learning_curve: "Time to implement CRUD operations"

qualitative:
- readability: "Code clarity and maintainability"
- community_support: "Documentation quality, Stack Overflow activity"
- migration_complexity: "Ease of schema evolution"
- tooling_integration: "IDE support, debugging capabilities"

```

**Benchmark Script**:
```


# benchmark-orm.py

import time
import psutil
import docker

client = docker.from_env()

def benchmark_orm(container_name):
"""Run performance benchmarks against ORM implementation"""
container = client.containers.get(container_name)

    # Execute benchmark script inside container
    result = container.exec_run(
        "python tests/orm_benchmark.py --iterations=1000 --output=json"
    )
    
    output = json.loads(result.output.decode())
    
    return {
        "container": container_name,
        "query_time_ms": output['avg_query_time'],
        "memory_mb": output['peak_memory'],
        "lines_of_code": output['loc'],
        "test_coverage": output['coverage_percent']
    }
    
# Run benchmarks

results = [
benchmark_orm("agent-sqlalchemy"),
benchmark_orm("agent-django"),
benchmark_orm("agent-peewee")
]

# Generate comparison report

import pandas as pd
df = pd.DataFrame(results)
print(df.to_markdown(index=False))

# Output:

# | container          | query_time_ms | memory_mb | lines_of_code | test_coverage |

# |--------------------|---------------|-----------|---------------|---------------|

# | agent-sqlalchemy   | 12.3          | 45        | 320           | 92%           |

# | agent-django       | 18.7          | 78        | 450           | 88%           |

# | agent-peewee       | 9.8           | 32        | 280           | 95%           |

# Winner: Peewee (fastest, lowest memory, smallest codebase)

```

### Large-Scale Refactoring Projects

**Scenario: Migrate from JavaScript to TypeScript**

Parallelize refactoring across 50+ files using agent swarm.

**Setup**:
```


# large-refactor-orchestrator.py

import os
import glob
import docker

client = docker.from_env()

# Identify all JavaScript files

js_files = glob.glob("src/**/*.js", recursive=True)
print(f"Found {len(js_files)} JavaScript files to refactor")

# Divide into chunks for parallel processing

chunk_size = 10
file_chunks = [js_files[i:i+chunk_size] for i in range(0, len(js_files), chunk_size)]

agents = []
for i, chunk in enumerate(file_chunks):
\# Create worktree for this chunk
branch_name = f"refactor-ts-chunk-{i}"
subprocess.run([
"git", "worktree", "add",
f"../worktrees/{branch_name}",
"-b", branch_name
])

    # Launch agent in container
    container = client.containers.run(
        "agent-base:latest
    <span style="display:none"></span>
