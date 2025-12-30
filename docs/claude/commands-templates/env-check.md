---
description: "Runs a health check of the current developer environment—validates tools, runtime versions, env vars, credentials, and local services."
allowed-tools: ["Read", "Search", "Bash(find)", "Bash(which)", "Bash(command)", "Bash(cat)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Env Check

## Purpose
Validate the developer environment by checking required tools, runtimes, environment variables, credentials, and services are properly configured and accessible.

## Environment Check Steps

### 1. Detect Project Requirements

```bash
# Read project manifest files
@package.json           # Node.js requirements
@requirements.txt       # Python requirements
@pom.xml               # Java requirements
@Cargo.toml            # Rust requirements
@go.mod                # Go requirements
@.ruby-version         # Ruby version
@.nvmrc                # Node version
@.python-version       # Python version
@docker-compose.yml    # Service requirements
@.env.example          # Environment template
```

### 2. Check Required Tools

```bash
# Node.js
!node --version 2>/dev/null
!npm --version 2>/dev/null
!which node npm

# Python
!python --version 2>/dev/null || python3 --version 2>/dev/null
!pip --version 2>/dev/null || pip3 --version 2>/dev/null

# Java
!java -version 2>&1 | head -3
!javac -version 2>&1

# Docker
!docker --version 2>/dev/null
!docker-compose --version 2>/dev/null

# Git
!git --version 2>/dev/null
!git config user.name 2>/dev/null
!git config user.email 2>/dev/null

# Other tools
!which make gcc go rust ruby postgres mysql redis 2>/dev/null | xargs -I {} sh -c 'echo {}: {} && {} --version 2>/dev/null'
```

### 3. Verify Runtime Versions

```bash
# Compare with project requirements
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2)
PYTHON_VERSION=$(python --version 2>/dev/null | cut -d' ' -f2)

# Check .nvmrc for required Node version
!cat .nvmrc 2>/dev/null || echo "No .nvmrc found"

# Check .python-version for required Python version
!cat .python-version 2>/dev/null || echo "No .python-version found"
```

### 4. Check Environment Variables

```bash
# List all environment variables
!env | sort

# Check for required env vars from .env.example
!diff <(grep "^[A-Z_]*=" .env.example | cut -d= -f1) <(grep "^[A-Z_]*=" .env 2>/dev/null | cut -d= -f1) || true

# Validate specific critical vars
!echo "NODE_ENV: $NODE_ENV"
!echo "DATABASE_URL: ${DATABASE_URL:0:20}..." (hide sensitive)
!echo "API_KEY: ${API_KEY:0:5}..." (hide sensitive)
```

### 5. Check Credentials and Secrets

```bash
# Check git credentials
!git config --list | grep credential

# Check SSH keys
!ls -la ~/.ssh/

# Check AWS credentials (if applicable)
!ls -la ~/.aws/

# Check local config
!find . -name ".env*" -type f 2>/dev/null | head -10

# Warn about committed secrets
!git log -S "password\|secret\|key\|token" --oneline | head -5 2>/dev/null || echo "No obvious secrets found in recent commits"
```

### 6. Verify Local Services

```bash
# Check if required services are running
!ps aux | grep -E "postgres|mysql|redis|mongod|docker" | grep -v grep

# Check port availability
!lsof -i :3000 2>/dev/null || echo "Port 3000 is available"
!lsof -i :5432 2>/dev/null || echo "Port 5432 is available"
!lsof -i :6379 2>/dev/null || echo "Port 6379 is available"

# Docker status
!docker ps 2>/dev/null || echo "Docker not running"

# Database connection test
!mysql --version 2>/dev/null && echo "MySQL available"
!psql --version 2>/dev/null && echo "PostgreSQL available"
```

### 7. Verify Project Dependencies

```bash
# Check npm packages
!npm list --depth=0 2>/dev/null | head -20

# Check pip packages
!pip list 2>/dev/null | head -20

# Check for dependency issues
!npm audit 2>/dev/null || echo "Run 'npm audit' for details"

# Check for missing dependencies
!npm ls 2>/dev/null | grep "missing\|UNMET" || echo "All dependencies satisfied"
```

### 8. Generate Environment Report

Create **ENV_CHECK_REPORT.md**:

```markdown
# Environment Health Check Report

**Report Generated**: [ISO 8601 timestamp]
**Project**: [Project Name]
**Platform**: [OS - macOS/Linux/Windows]
**Hostname**: [System hostname]

---

## 📊 Summary

**Status**: ✅ HEALTHY / ⚠️ WARNINGS / 🔴 CRITICAL ISSUES

| Category | Status | Issue Count |
|----------|--------|---|
| Required Tools | ✅ OK | 0 |
| Runtime Versions | ✅ OK | 0 |
| Environment Variables | ⚠️ Partial | 3 |
| Credentials | ✅ Configured | - |
| Local Services | ⚠️ Some Down | 1 |
| Dependencies | ✅ OK | 0 |
| **Overall** | **✅ Operational** | - |

---

## 🛠️ Required Tools Status

### Installed & Available

| Tool | Version | Status | Usage |
|------|---------|--------|-------|
| Node.js | v18.16.0 | ✅ OK | Runtime |
| npm | 9.6.4 | ✅ OK | Package manager |
| Git | 2.40.0 | ✅ OK | Version control |
| Docker | 24.0.0 | ✅ OK | Containerization |
| Python | 3.11.2 | ✅ OK | Scripts/Tools |

### Missing Tools (Optional)

| Tool | Required? | Impact | Install |
|------|-----------|--------|---------|
| Java | No | Some features unavailable | Optional |
| Go | No | Tools unavailable | Optional |
| Rust | No | Tools unavailable | Optional |

---

## 🔍 Runtime Version Verification

### Node.js
```
Installed: v18.16.0
Required (from .nvmrc): v18.x
Status: ✅ MATCH
```

### Python
```
Installed: 3.11.2
Required (from .python-version): 3.10.x
Status: ⚠️ NEWER (may cause issues)
Recommendation: Switch to Python 3.10 or update .python-version
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Status | Value | Notes |
|----------|--------|-------|-------|
| NODE_ENV | ✅ Set | production | - |
| PORT | ✅ Set | 3000 | - |
| DATABASE_URL | ✅ Set | postgres://... | - |
| API_KEY | ✅ Set | ••••• | (hidden) |
| SECRET_KEY | ⚠️ Missing | - | Required but not set |

### Optional Variables

| Variable | Status | Value |
|----------|--------|-------|
| DEBUG | Not set | - |
| LOG_LEVEL | Set | info |

### Validation

- [ ] All required variables are set
- [ ] No variables contain hardcoded secrets
- [ ] No sensitive data in .env file checked into git
- [ ] .env file exists and is readable

---

## 🔑 Credentials & Authentication

### Git Configuration
```
User Name: [name] ✅
User Email: [email] ✅
Credential Helper: osxkeychain ✅
SSH Key: ~/.ssh/id_rsa ✅ (exists)
```

### Local Development Services
```
AWS Credentials: ~/.aws/credentials ⚠️ (old, expires [date])
GitHub SSH: Configured ✅
Docker Registry: Configured ✅
```

---

## 🚀 Local Services Status

### Running Services
```
✅ Docker Desktop: Running
✅ PostgreSQL: Running on :5432
⚠️ Redis: NOT running (on-demand service)
❌ MongoDB: NOT running (not needed for this project)
```

### Port Availability
```
3000: ✅ Available
5432: ✅ In Use (PostgreSQL)
6379: ✅ Available
8000: ✅ Available
9000: ✅ Available
```

---

## 📦 Project Dependencies

### npm Packages
```
Installed: 247 packages (direct), 1,089 total
Status: ✅ All dependencies installed
Audit: ⚠️ 5 vulnerabilities (3 low, 2 medium)
  - Run 'npm audit' for details
  - Run 'npm audit fix' to fix automatically
```

### Python Packages
```
Installed: 42 packages
Status: ✅ All requirements satisfied
Outdated: ⚠️ 3 packages have updates
  - Run 'pip list --outdated' for details
```

---

## 🎯 Verification Checklist

- [ ] All required tools installed and accessible
- [ ] Runtime versions match project requirements
- [ ] All required environment variables set
- [ ] Credentials and SSH keys configured
- [ ] All local services running (or can be started)
- [ ] Project dependencies installed
- [ ] No critical security issues

---

## ⚠️ Issues Found

### Issue 1: Missing Environment Variable
- **Severity**: Medium
- **Variable**: SECRET_KEY
- **Impact**: Application may fail to start
- **Fix**: \`export SECRET_KEY=[value]\` or add to .env file
- **Status**: Requires action

### Issue 2: Outdated Python Version
- **Severity**: Low
- **Current**: 3.11.2
- **Expected**: 3.10.x
- **Impact**: Minor compatibility issues possible
- **Fix**: Install Python 3.10.x or update project to support 3.11
- **Status**: For next sprint

### Issue 3: npm Audit Vulnerabilities
- **Severity**: Medium (5 vulnerabilities)
- **Critical**: 0
- **High**: 0
- **Medium**: 2
- **Low**: 3
- **Fix**: Run \`npm audit fix\` or update specific packages
- **Status**: Can proceed, but should fix before release

---

## ✅ Recommendations

### Before Starting Development
1. ✅ Set missing environment variable: SECRET_KEY
2. ⚠️ Fix npm vulnerabilities (not blocking, but important)
3. ✅ Start local services: \`docker-compose up -d\`
4. ✅ Install dependencies: \`npm install\`

### Short-term (This Sprint)
- [ ] Update Python to 3.10.x or update project requirements
- [ ] Fix npm security vulnerabilities
- [ ] Review and refresh AWS credentials

### Long-term (Next Quarter)
- [ ] Plan upgrade path to Node 20.x
- [ ] Evaluate updating dependencies to latest minor versions
- [ ] Set up automatic credential rotation

---

## 🔧 Quick Start Commands

### Start Local Environment
```bash
# Start required services
docker-compose up -d

# Install/update dependencies
npm install
pip install -r requirements.txt

# Verify everything works
npm test
python manage.py test
```

### Verify Environment is Ready
```bash
# Re-run this check
/env-check

# Check specific service
npm start
```

### Fix Common Issues

**Node version mismatch:**
```bash
nvm install 18.16.0
nvm use 18.16.0
```

**Missing environment variable:**
```bash
cp .env.example .env
# Edit .env with your values
```

**npm vulnerabilities:**
```bash
npm audit fix
```

**Database connection refused:**
```bash
docker-compose restart postgres
# Wait 10 seconds for startup
```

---

**Report Generated**: [Timestamp]  
**Environment Status**: ✅ Ready for Development / ⚠️ Some Setup Needed  
**Recheck Command**: `/env-check`  
**Support**: See CONTRIBUTING.md for setup help

---
```

### 9. Display Environment Check Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║      DEVELOPER ENVIRONMENT CHECK COMPLETE          ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]
PLATFORM: [OS] [Version]
STATUS: ✅ READY / ⚠️ WARNINGS / 🔴 ISSUES

TOOLS & RUNTIMES:
  ✅ Node.js: v18.16.0
  ✅ npm: 9.6.4
  ✅ Git: 2.40.0
  ✅ Docker: 24.0.0
  ✅ Python: 3.11.2

ENVIRONMENT:
  ✅ NODE_ENV: production
  ✅ PORT: 3000
  ✅ DATABASE_URL: configured
  ⚠️ SECRET_KEY: missing (needs to be set)

SERVICES:
  ✅ Docker Desktop: running
  ✅ PostgreSQL: running (:5432)
  ⚠️ Redis: stopped (start if needed)

DEPENDENCIES:
  ✅ npm: 247 packages installed
  ⚠️ Audit: 5 vulnerabilities (run 'npm audit fix')

CREDENTIALS:
  ✅ Git user configured
  ✅ SSH keys available
  ✅ AWS configured (expires [date])

ISSUES FOUND: 3
  1. ⚠️ SECRET_KEY not set
  2. ⚠️ npm vulnerabilities (5)
  3. ℹ️ Python 3.11 (expecting 3.10)

NEXT STEPS:
  1. Set environment variable: export SECRET_KEY=[value]
  2. Start services: docker-compose up -d
  3. Install deps: npm install
  4. Run tests: npm test

Full Report: ENV_CHECK_REPORT.md
Ready to develop: ✅ YES / ⚠️ WITH FIXES / ❌ NO
```

## Key Features

- **Comprehensive Validation**: Tools, runtimes, vars, credentials, services
- **Version Matching**: Compares installed vs required versions
- **Credential Security**: Checks for exposed secrets
- **Service Verification**: Checks if required services are running
- **Dependency Audit**: Validates all packages installed correctly
- **Detailed Report**: ENV_CHECK_REPORT.md with full diagnostics
- **Quick Fix Suggestions**: Commands to resolve common issues
- **Multi-Platform**: Works on macOS, Linux, Windows

## Check Categories

| Category | What It Checks | Example Issues |
|----------|---|---|
| Tools | Required CLI tools installed | Missing Docker, Git not configured |
| Runtimes | Correct language/runtime versions | Node 20 vs expected 18 |
| Env Vars | Required environment variables | Missing DATABASE_URL |
| Credentials | Auth tokens, keys, SSH | Expired AWS credentials |
| Services | Running local services | PostgreSQL not running |
| Dependencies | All packages installed | Missing npm packages, vulnerabilities |

## When to Use /env-check

- Before starting a development session
- After cloning a new project
- When onboarding to a project
- When experiencing mysterious failures
- After updating Node, Python, or other runtimes
- After git pull with new env requirements
- In CI/CD pipelines for diagnosis
- Before troubleshooting issues

## Best Practices

1. **Regular Checks**: Run at session start
2. **After Updates**: Check after runtime/tool updates
3. **Share Reports**: Share ENV_CHECK_REPORT with team
4. **Document Issues**: Keep record of environment issues
5. **Automate Fixes**: Script common fixes
6. **Update .env.example**: Keep in sync with requirements
7. **Version Control**: Track required versions in repo
8. **CI/CD Integration**: Run in build pipelines