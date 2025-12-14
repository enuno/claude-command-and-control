---
description: "Compiles up-to-date documentation by crawling READMEs, comments, and code, then outputs or updates markdown documentation files."
allowed-tools: ["Read", "Search", "Edit", "Bash(find)", "Bash(grep)", "Bash(head)", "Bash(tail)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Docs

## Purpose
Generate or refresh comprehensive documentation by analyzing codebase, comments, structure, and existing docs, then producing clean, up-to-date markdown files.

## Documentation Generation Steps

### 1. Discover Documentation Needs

```bash
# Find existing documentation
!find . -name "*.md" -type f | grep -v node_modules | sort

# Identify documentation gaps
!find . -name "README*" -o -name "*.md" 2>/dev/null | wc -l

# Check for inline documentation
!grep -r "^\s*///" . --include="*.js" --include="*.ts" 2>/dev/null | head -20

# Look for JSDoc/docstrings
!grep -r "@param\|@returns\|def " . --include="*.js" --include="*.py" 2>/dev/null | head -20
```

### 2. Analyze Project Structure

```bash
# Show project organization
!find . -type d -maxdepth 2 | grep -v node_modules | head -20

# Identify main source files
!find ./src -type f \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.java" \) 2>/dev/null | head -20

# Find configuration files
!find . -maxdepth 2 -type f \( -name "*.config.*" -o -name ".env*" -o -name "Dockerfile" \) 2>/dev/null

# Identify entry points
!grep -l "main\|export\|module.exports" src/*.{js,ts,py} 2>/dev/null | head -5
```

### 3. Identify Documentation Gaps

Ask user:

```
Documentation Audit

1. Which documentation areas need attention?
   ☐ README.md (project overview)
   ☐ GETTING_STARTED.md (setup instructions)
   ☐ API.md (API reference)
   ☐ ARCHITECTURE.md (system design)
   ☐ CONTRIBUTING.md (contribution guidelines)
   ☐ CONFIGURATION.md (config options)
   ☐ EXAMPLES.md (code examples)
   ☐ TROUBLESHOOTING.md (common issues)
   ☐ Other: [specify]

2. What's the primary audience?
   - Developers
   - Users/end-users
   - DevOps/operations
   - All of the above

3. Preferred documentation style?
   - Detailed and thorough
   - Quick and concise
   - Tutorial-oriented
   - Reference-oriented
```

### 4. Generate Documentation Files

Create **DOCUMENTATION_INDEX.md** and specific docs:

#### README.md

```markdown
# [Project Name]

[One-sentence description of what this project does]

## Overview

[2-3 paragraph description covering:
- Problem it solves
- Who it's for
- Key features
- Why it's unique]

## Quick Start

[Minimal steps to get running]

\`\`\`bash
# Installation
[Installation command]

# Basic usage
[Basic usage example]
\`\`\`

## Features

- **Feature 1**: [Description and why it matters]
- **Feature 2**: [Description and why it matters]
- **Feature 3**: [Description and why it matters]

## Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Detailed setup guide
- [API Reference](docs/API.md) - Complete API documentation
- [Architecture](docs/ARCHITECTURE.md) - System design overview
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## Installation

See [Getting Started Guide](docs/GETTING_STARTED.md)

## Usage

[Basic usage overview and key examples]

See [full documentation](docs/) for detailed guides

## Requirements

- [Requirement 1]: version X.X+
- [Requirement 2]: version Y.Y+
- [Requirement 3]: optional, for [feature]

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[License type] - See [LICENSE](LICENSE) file

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/org/repo/issues)
- 💬 [Discussions](https://github.com/org/repo/discussions)
- 📧 [Email](mailto:support@example.com)

## Authors & Contributors

- [Creator Name] - [Role]
- [Contributor Name] - [Contribution]
```

#### GETTING_STARTED.md

```markdown
# Getting Started with [Project Name]

## Prerequisites

- [Runtime/Language] X.X or higher
- [Tool/Framework] X.X or higher
- [Other requirement] (optional)

## Installation

### macOS
\`\`\`bash
# Using Homebrew
brew install [package]

# Or using manual installation
[Installation steps]
\`\`\`

### Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt-get update
sudo apt-get install [package]

[Additional Linux-specific steps]
\`\`\`

### Windows
\`\`\`powershell
# Using Chocolatey
choco install [package]

# Or manual installation
[Installation steps]
\`\`\`

## Configuration

### Environment Setup

Create a `.env` file:
\`\`\`bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
\`\`\`

Required environment variables:
- `API_KEY`: Your API key from [service]
- `DATABASE_URL`: Connection string for database
- `NODE_ENV`: Set to 'development' or 'production'

### Initial Setup

\`\`\`bash
# Install dependencies
npm install
# or
pip install -r requirements.txt

# Initialize database (if needed)
npm run setup:db
# or
python manage.py migrate

# Verify installation
npm run verify
# or
python -m verify
\`\`\`

## Your First Run

\`\`\`bash
# Start development server
npm start
# or
python app.py

# Visit in browser
open http://localhost:3000
\`\`\`

## Common Issues

### Installation fails with permission error
**Solution**: Use `sudo` or adjust npm permissions

### Port already in use
**Solution**: \`lsof -i :3000\` to find process, or set PORT=3001

### Database connection fails
**Solution**: Verify DATABASE_URL and ensure service is running

## Next Steps

- [Read API Documentation](API.md)
- [See Usage Examples](EXAMPLES.md)
- [Explore Architecture](ARCHITECTURE.md)
```

#### API.md (example)

```markdown
# API Reference

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

All requests require Bearer token in Authorization header:

\`\`\`
Authorization: Bearer YOUR_TOKEN
\`\`\`

Obtain token via:
\`\`\`bash
POST /auth/token
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password"
}
\`\`\`

## Endpoints

### Users

#### List Users
\`\`\`
GET /users?page=1&limit=10
\`\`\`

Response:
\`\`\`json
{
  "data": [
    {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
\`\`\`

#### Get User
\`\`\`
GET /users/:id
\`\`\`

Response:
\`\`\`json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-01-01T00:00:00Z"
}
\`\`\`

[Continue with remaining endpoints...]
```

#### ARCHITECTURE.md

```markdown
# System Architecture

## Overview

[Diagram description or ASCII art]

## Components

### Frontend
- Technology: [Framework]
- Responsibilities: [What it does]
- Key files: [Important files]

### Backend
- Technology: [Language/Framework]
- Responsibilities: [What it does]
- Key files: [Important files]

### Database
- Type: [Database type]
- Schema: [Brief schema description]
- Responsibilities: [What it stores]

### Infrastructure
- Hosting: [Cloud provider/setup]
- Deployment: [How it deploys]
- Scaling: [How it scales]

## Data Flow

1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

[Or provide sequence diagram description]

## Design Patterns

- [Pattern 1]: [Why used]
- [Pattern 2]: [Why used]
- [Pattern 3]: [Why used]

## Scalability

[How the system scales]

## Security

[Security considerations and measures]
```

### 5. Extract Code Comments

For API/Reference documentation:

```bash
# Extract JSDoc comments
!grep -B2 "^\s*/\*\*" src/**/*.js 2>/dev/null | head -100

# Extract Python docstrings
!grep -B2 '"""' src/**/*.py 2>/dev/null | head -100

# Find documented functions
!grep -r "function\|def\|const.*=" src/ --include="*.js" --include="*.py" 2>/dev/null | grep -B1 "@param\|\"\"\"" | head -50
```

### 6. Create Documentation Index

Create **DOCUMENTATION_INDEX.md**:

```markdown
# Documentation Index

## Getting Started
- [Quick Start](README.md) - Project overview and quick setup
- [Getting Started Guide](docs/GETTING_STARTED.md) - Detailed installation and setup
- [First Steps](docs/FIRST_STEPS.md) - Your first project

## Usage
- [User Guide](docs/USAGE.md) - How to use the project
- [Examples](docs/EXAMPLES.md) - Code examples and recipes
- [Configuration](docs/CONFIGURATION.md) - All configuration options
- [CLI Reference](docs/CLI.md) - Command-line interface

## API Reference
- [REST API](docs/API.md) - HTTP API endpoints
- [SDK](docs/SDK.md) - SDK documentation
- [Webhooks](docs/WEBHOOKS.md) - Webhook specifications

## Architecture & Design
- [Architecture](docs/ARCHITECTURE.md) - System design
- [Data Model](docs/DATA_MODEL.md) - Database schema
- [API Design](docs/API_DESIGN.md) - API design principles

## Operations & Deployment
- [Deployment Guide](docs/DEPLOYMENT.md) - How to deploy
- [Configuration](docs/CONFIGURATION.md) - Production configuration
- [Monitoring](docs/MONITORING.md) - Monitoring setup
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues

## Development
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Development Setup](docs/DEVELOPMENT.md) - Developer environment
- [Testing Guide](docs/TESTING.md) - How to test
- [Code Style](docs/CODE_STYLE.md) - Code standards

## Community
- [FAQ](docs/FAQ.md) - Frequently asked questions
- [Changelog](CHANGELOG.md) - Version history
- [Roadmap](ROADMAP.md) - Future plans
- [License](LICENSE) - Project license
```

### 7. Generate Documentation Summary

Display formatted output:

```
╔════════════════════════════════════════════════════╗
║        DOCUMENTATION GENERATED/UPDATED             ║
╚════════════════════════════════════════════════════╝

PROJECT: [Project Name]

DOCUMENTATION CREATED/UPDATED:
  ✅ README.md - Project overview
  ✅ GETTING_STARTED.md - Setup guide
  ✅ API.md - API reference
  ✅ ARCHITECTURE.md - System design
  ✅ TROUBLESHOOTING.md - Common issues
  ✅ DOCUMENTATION_INDEX.md - Full index

DOCUMENTATION INDEX:
  📖 Getting Started (2 docs)
  📖 Usage (3 docs)
  📖 API Reference (2 docs)
  📖 Architecture (2 docs)
  📖 Operations (3 docs)
  📖 Development (3 docs)

STATISTICS:
  Total Documentation Files: [N]
  Total Pages: ~[N]
  Total Words: ~[N,000]
  Estimated Read Time: ~[X] hours

COVERAGE:
  API Endpoints: 100% documented
  Configuration: 95% documented
  Examples: [X] provided
  Common Issues: [X] addressed

Next Steps:
  1. Review generated documentation
  2. Add missing examples: /search [pattern]
  3. Update as code changes
  4. Host on GitHub Pages or wiki

Location: docs/
Index: docs/DOCUMENTATION_INDEX.md
```

## Key Features

- **Automated Discovery**: Finds existing docs and gaps
- **Multiple Formats**: README, Getting Started, API, Architecture, Troubleshooting
- **Comment Extraction**: Pulls documentation from code comments
- **Example Integration**: Includes code examples and usage patterns
- **Index Generation**: Creates navigation structure
- **Comprehensive**: Covers all documentation needs
- **Maintainable**: Easy to update as code changes

## Documentation Templates Included

- **README.md**: Project overview and quick start
- **GETTING_STARTED.md**: Installation and setup
- **API.md**: API reference with examples
- **ARCHITECTURE.md**: System design and components
- **CONFIGURATION.md**: All config options
- **TROUBLESHOOTING.md**: Common issues and solutions
- **CONTRIBUTING.md**: How to contribute
- **CHANGELOG.md**: Version history
- **DOCUMENTATION_INDEX.md**: Navigation and index

## When to Use /docs

- Starting a new project
- Onboarding new team members
- Before major release
- When code changes significantly
- To ensure documentation stays current
- For open-source projects
- Before submitting to marketplaces

## Best Practices

1. **Keep Updated**: Run periodically as code changes
2. **Make Accessible**: Host online (GitHub, Wiki, etc.)
3. **Include Examples**: Real code examples are essential
4. **Be Specific**: Avoid vague explanations
5. **Use Visuals**: Diagrams and screenshots help
6. **Test Instructions**: Verify setup docs actually work
7. **Link Between Docs**: Cross-reference related content
8. **Maintain Index**: Keep navigation current