# AGENTS.md: Universal AI Coding Agents Instruction Manual
**braiins-os-mcp-server** | Last Updated: December 2025 | Version 1.0

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Code Discovery](#code-discovery)
3. [Code Editing Standards](#code-editing-standards)
4. [Code Quality](#code-quality)
5. [Tool Use & Permissions](#tool-use--permissions)
6. [Git Operations](#git-operations)
7. [Testing Strategy](#testing-strategy)
8. [Security Policies](#security-policies)
9. [Collaboration Patterns](#collaboration-patterns)

---

## Project Overview

### Executive Summary
**braiins-os-mcp-server** is a Model Context Protocol (MCP) server that bridges AI agents to Braiins OS miner firmware APIs. It enables Claude and other AI models to monitor, configure, and manage ASIC miners running Braiins OS+ through a standardized interface.

### Business Context
- **Use Case:** AI-assisted mining operations management across multiple deployment models (local, dedicated, shared, hybrid)
- **Target Users:** Mining technicians, operations teams, automation engineers
- **Success Metrics:** API uptime >99.5%, <500ms response latency, zero data loss on operations

### Technology Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Runtime** | Node.js | LTS (20.x) | Native async/await, npm ecosystem, gRPC support |
| **Language** | TypeScript | 5.3+ | Type safety, IDE support, refactoring confidence |
| **RPC Protocol** | gRPC | 1.9+ | Efficient binary protocol, streaming support |
| **CLI** | grpcurl | Latest | Protocol buffer inspection, testing |
| **Caching** | Redis | 7.x | Session management, rate limiting, pub/sub |
| **Client Lib** | redis | 4.6+ | Connection pooling, pipeline support |
| **Containerization** | Docker | 24.x | Multi-deployment patterns, dependency isolation |
| **Package Manager** | npm | 10.x | Monorepo support via workspaces |

### Architecture Patterns

The project supports **4 deployment models**:

```
1. LOCAL (⚙️ On-Premise)
   └─ Transport: STDIO
   └─ Security: Local network only
   └─ Use: Technician's workstation with direct miner access
   └─ MCP Client: Claude on technician's machine

2. MANAGED-DEDICATED (☁️ User-Isolated)
   └─ Transport: HTTP + SSE
   └─ Security: OAuth 2.0 per-user isolation
   └─ Use: Each team/user gets containerized instance
   └─ MCP Client: Claude Desktop + remote container

3. MANAGED-SHARED (🏢 Multi-Tenant)
   └─ Transport: Remote HTTP + OAuth
   └─ Security: JWT + tenant isolation
   └─ Use: Multiple users → shared mining fleet
   └─ MCP Client: Web app or Claude API client

4. HYBRID (🔀 Local + Cloud)
   └─ Transport: Local STDIO + Cloud HTTP
   └─ Security: Local auth + cloud OAuth
   └─ Use: On-site control + remote monitoring
   └─ MCP Client: Local Claude + cloud aggregator
```

---

## Code Discovery

### Project Structure

```
braiins-os-mcp-server/
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── server.ts                # HTTP/STDIO transport setup
│   ├── mcp/
│   │   ├── resources.ts         # MCP resource definitions
│   │   ├── tools.ts             # Tool implementations
│   │   └── prompts.ts           # Claude prompt templates
│   ├── api/
│   │   ├── grpc/
│   │   │   ├── client.ts        # gRPC client wrapper
│   │   │   └── types.ts         # Generated from .proto files
│   │   ├── rest/
│   │   │   ├── routes.ts        # Express router setup
│   │   │   └── middleware.ts    # Auth, logging, error handling
│   │   └── handlers/
│   │       ├── miner.ts         # Miner control operations
│   │       ├── firmware.ts      # Firmware management
│   │       ├── monitoring.ts    # Telemetry & metrics
│   │       └── auth.ts          # Authentication flows
│   ├── cache/
│   │   ├── redis.ts             # Redis client & connection pool
│   │   ├── session.ts           # Session management
│   │   └── pubsub.ts            # Event broadcasting
│   ├── models/
│   │   ├── miner.ts             # Miner data model
│   │   ├── fleet.ts             # Fleet aggregation model
│   │   └── event.ts             # Event schema
│   ├── utils/
│   │   ├── logger.ts            # Winston-based logging
│   │   ├── errors.ts            # Custom error classes
│   │   ├── validators.ts        # Input validation
│   │   └── crypto.ts            # Encryption helpers
│   ├── config/
│   │   ├── env.ts               # Environment variables (zod)
│   │   ├── deployment.ts        # Deployment-specific config
│   │   └── constants.ts         # Shared constants
│   └── types/
│       ├── mcp.ts               # MCP protocol types
│       ├── api.ts               # API request/response types
│       └── index.ts             # Re-exports
├── proto/
│   ├── braiins.proto            # gRPC service definitions
│   └── generated/               # Compiled .pb.ts files (auto-generated)
├── tests/
│   ├── unit/
│   │   ├── api/
│   │   ├── cache/
│   │   └── utils/
│   ├── integration/
│   │   ├── grpc-api.test.ts
│   │   ├── rest-api.test.ts
│   │   ├── auth.test.ts
│   │   └── redis.test.ts
│   ├── e2e/
│   │   ├── miner-control.test.ts
│   │   ├── firmware-update.test.ts
│   │   └── multi-tenant.test.ts
│   └── fixtures/
│       ├── miner.fixtures.ts
│       └── responses.fixtures.ts
├── docker/
│   ├── Dockerfile               # Multi-stage production build
│   ├── Dockerfile.dev           # Development image
│   └── docker-compose.yml       # Local + Redis setup
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # Unit + integration tests
│   │   ├── security.yml         # SAST + dependency scan
│   │   └── deploy.yml           # CD to production
│   ├── instructions/
│   │   ├── testing.md           # Test-driven development
│   │   ├── api-design.md        # RESTful standards
│   │   ├── security.md          # Auth & encryption
│   │   └── deployment.md        # CI/CD pipeline
│   └── copilot-instructions.md  # Repository-wide AI guidance
├── config/
│   ├── eslint.config.js         # ESLint rules
│   ├── prettier.config.js       # Code formatting
│   ├── tsconfig.json            # TypeScript config
│   ├── jest.config.js           # Test runner
│   └── redis.conf               # Redis development config
├── docs/
│   ├── ARCHITECTURE.md          # System design & diagrams
│   ├── API.md                   # OpenAPI/REST documentation
│   ├── DEPLOYMENT.md            # Multi-model deployment guide
│   └── TROUBLESHOOTING.md       # Common issues & solutions
├── .env.example                 # Environment template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── .eslintrc.json               # Linter configuration
├── .prettierrc.json             # Formatter configuration
└── README.md                    # Project overview

### Key Files by Agent Responsibility
- **Architect Agent:** `ARCHITECTURE.md`, `src/config/`, `proto/braiins.proto`
- **Builder Agent:** `src/api/`, `src/mcp/`, `tests/unit/`
- **Validator Agent:** `tests/`, `.github/workflows/ci.yml`
- **Scribe Agent:** `docs/`, `README.md`, API documentation
- **DevOps Agent:** `docker/`, `.github/workflows/`, `config/`
- **Researcher Agent:** `docs/ARCHITECTURE.md`, dependency analysis
```

### Naming Conventions

#### File Names
- **TypeScript files:** `camelCase.ts` (except `.test.ts` files)
- **Protocol buffers:** `snake_case.proto`
- **Configuration files:** `.lower-kebab-case.json|js|yml`
- **Documentation:** `UPPER_CASE.md` for project-level, `lower-case.md` for guides

#### Variables & Functions
- **Constants:** `UPPER_SNAKE_CASE` (only for true constants)
- **Classes:** `PascalCase`
- **Interfaces:** `PascalCase` with `I` prefix optional
- **Functions:** `camelCase` (async functions end with `Async`)
- **Private methods:** `_camelCase()`
- **Boolean variables:** `isActive`, `hasError`, `canAccess`

#### API Endpoints
- RESTful nouns: `/api/v1/miners/:id/firmware`
- Actions via HTTP verbs: GET (read), POST (create), PUT (update), DELETE (remove)
- Sub-resources: `/api/v1/fleets/:fleetId/miners/:minerId/config`
- Collections: `/api/v1/miners?status=online&pool=antpool`

### Code Search Patterns

**Common searches for codebase navigation:**

```bash
# Find all error handlers
grep -r "catch\|throw\|Error" src/ --include="*.ts"

# Find authentication logic
grep -r "auth\|token\|verify" src/ --include="*.ts" | grep -v node_modules

# Find Redis operations
grep -r "redis\|cache\|set\|get" src/cache/ --include="*.ts"

# Find gRPC client calls
grep -r "client\." src/api/grpc/ --include="*.ts"

# Find all TODO/FIXME comments
grep -r "TODO\|FIXME\|HACK" src/ --include="*.ts"

# Find type definitions
grep -r "interface\|type " src/types/ --include="*.ts"

# Find all test files
find . -name "*.test.ts" -o -name "*.spec.ts"
```

---

## Code Editing Standards

### Style Guide

**This project uses automated tooling for consistency:**

#### ESLint Configuration
```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "destructuredArrayIgnorePattern": "^_"
    }],
    "@typescript-eslint/explicit-function-return-types": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "max-line-length": ["warn", 120],
    "indent": ["error", 2, { "SwitchCase": 1 }]
  }
}
```

**Run before every commit:**
```bash
npm run lint              # Check violations
npm run lint:fix         # Auto-fix violations
npm run format           # Prettier formatting
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### Code Organization

#### File Structure Within Classes
```typescript
export class MinerController {
  // 1. Static constants
  private static readonly LOG_PREFIX = '[MinerController]';

  // 2. Private fields with types
  private cache: RedisCache;
  private logger: Logger;

  // 3. Constructor
  constructor(cache: RedisCache, logger: Logger) {
    this.cache = cache;
    this.logger = logger;
  }

  // 4. Public methods (alphabetical order)
  public async getMiner(id: string): Promise<Miner> { }
  public async listMiners(filters: MinerFilter): Promise<Miner[]> { }
  public async updateMiner(id: string, updates: Partial<Miner>): Promise<Miner> { }

  // 5. Private helper methods
  private validateMinerId(id: string): void { }
  private formatMinerResponse(raw: RawMiner): Miner { }
}
```

#### TypeScript Best Practices
```typescript
// ✅ Always specify return types
async function getMiner(id: string): Promise<Miner> {
  return this.api.miner.get(id);
}

// ✅ Use interfaces for external APIs
interface MinerResponse {
  id: string;
  status: 'online' | 'offline';
  hashrate: number;
}

// ✅ Use enums for fixed options
enum MinerStatus {
  Online = 'online',
  Offline = 'offline',
  Maintenance = 'maintenance',
}

// ✅ Use strict null checks
const miner: Miner | null = await this.getMiner(id);
if (!miner) {
  throw new MinerNotFoundError(id);
}

// ❌ Avoid 'any' type
function processMiner(miner: any) { } // Bad!

// ✅ Use generics for flexibility
async function cache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = await this.redis.get<T>(key);
  if (cached) return cached;
  const result = await fn();
  await this.redis.set(key, result, 3600);
  return result;
}
```

### Documentation Standards

#### JSDoc Comments
```typescript
/**
 * Retrieves a miner by ID from the API, with caching.
 * 
 * @param id - The unique miner identifier (UUID v4)
 * @returns The miner object with current firmware version
 * @throws {MinerNotFoundError} If miner does not exist
 * @throws {ApiError} If API call fails after 3 retries
 * 
 * @example
 * const miner = await controller.getMiner('550e8400-e29b-41d4-a716-446655440000');
 * console.log(miner.hashrate);
 */
async getMiner(id: string): Promise<Miner> {
  this.logger.debug(`Fetching miner ${id}`);
  
  // First try cache
  const cached = await this.cache.get<Miner>(`miner:${id}`);
  if (cached) return cached;
  
  // Then fetch from API
  const miner = await this.api.getMiner(id);
  
  // Store in cache for 1 hour
  await this.cache.set(`miner:${id}`, miner, 3600);
  
  return miner;
}
```

#### Comment Guidelines
- **WHY before HOW:** Explain business logic, not code syntax
- **Avoid obvious comments:** `const id = miner.id; // Get ID` (redundant)
- **Mark workarounds:** `// TODO: Remove this once grpcurl supports streaming (#234)`
- **Document decisions:** `// Using Set for O(1) lookup instead of Array.includes() for perf`

### Error Handling

#### Custom Error Classes
```typescript
// src/utils/errors.ts
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class MinerNotFoundError extends ApiError {
  constructor(id: string) {
    super('MINER_NOT_FOUND', `Miner ${id} not found`, 404, false);
    this.name = 'MinerNotFoundError';
  }
}

export class GrpcConnectionError extends ApiError {
  constructor(host: string, port: number) {
    super(
      'GRPC_CONNECTION_FAILED',
      `Cannot connect to gRPC server at ${host}:${port}`,
      503,
      true  // retryable!
    );
  }
}
```

#### Error Handling Pattern
```typescript
async function updateMiner(id: string, config: MinerConfig): Promise<void> {
  try {
    // Validate input
    if (!id || !config) {
      throw new ValidationError('id and config required');
    }

    // Call API with retry logic
    await this.retryAsync(
      () => this.grpc.updateMiner(id, config),
      { maxAttempts: 3, backoffMs: 1000 }
    );

    // Invalidate cache
    await this.cache.delete(`miner:${id}`);
    
  } catch (error) {
    // Specific error handling
    if (error instanceof GrpcConnectionError) {
      this.logger.error('gRPC unavailable, queuing for retry', { id, error });
      await this.queue.enqueue({ action: 'updateMiner', id, config });
      throw error;
    }
    
    if (error instanceof MinerNotFoundError) {
      this.logger.warn(`Miner not found: ${id}`);
      throw error;
    }
    
    // Generic error handling
    this.logger.error('Unexpected error updating miner', { id, error });
    throw new ApiError('UPDATE_FAILED', 'Failed to update miner', 500);
  }
}
```

### Code Review Checklist

**Before requesting review, verify:**
- [ ] Code passes `npm run lint` without warnings
- [ ] Code passes `npm run format` (or run it)
- [ ] All functions have return type annotations
- [ ] JSDoc comments on public methods
- [ ] Error handling for all async operations
- [ ] No `console.log()` statements (use logger instead)
- [ ] No hardcoded secrets or credentials
- [ ] No deprecated API calls
- [ ] Related tests updated or added

---

## Code Quality

### Quality Standards

**Target Coverage:** >85% across all modules
- Unit tests: Line coverage ≥85%
- Critical paths: Branch coverage ≥90%
- Integration tests: Happy path + 3 failure scenarios

### Testing Philosophy

We practice **Test-Driven Development (TDD)** with 3 testing levels:

```
┌─────────────────────────────────────────────────┐
│ E2E Tests (2-3 scenarios)                       │
│ Real miner connections, full workflows          │
│ Slow but critical (10-30s per test)             │
└─────────────────────────────────────────────────┘
          ↓ Mocks external services
┌─────────────────────────────────────────────────┐
│ Integration Tests (5-8 per module)              │
│ API boundaries, real cache/DB, mocked gRPC      │
│ Medium speed (1-5s per test)                    │
└─────────────────────────────────────────────────┘
          ↓ Mocks internal collaborators
┌─────────────────────────────────────────────────┐
│ Unit Tests (2-4 per function)                   │
│ Pure logic, all dependencies mocked             │
│ Very fast (< 100ms per test)                    │
└─────────────────────────────────────────────────┘
```

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run specific suite
npm test -- tests/unit/api/grpc

# Watch mode (development)
npm test -- --watch

# Coverage report (HTML)
npm test -- --coverage
open coverage/index.html

# Integration tests only (requires Redis)
npm run test:integration

# E2E tests only (requires test miners)
npm run test:e2e

# Quick smoke test (< 30 seconds)
npm run test:smoke
```

### Writing Tests

**Unit Test Template:**
```typescript
// tests/unit/api/miner.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { MinerController } from '../../../src/api/handlers/miner';
import { RedisCache } from '../../../src/cache/redis';
import { GrpcClient } from '../../../src/api/grpc/client';

describe('MinerController', () => {
  let controller: MinerController;
  let mockCache: jest.Mocked<RedisCache>;
  let mockGrpc: jest.Mocked<GrpcClient>;

  beforeEach(() => {
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockGrpc = {
      getMiner: jest.fn(),
    } as any;

    controller = new MinerController(mockCache, mockGrpc);
  });

  describe('getMiner', () => {
    it('should return miner from cache if available', async () => {
      const minerId = 'test-miner-1';
      const cachedMiner = { id: minerId, status: 'online' };
      mockCache.get.mockResolvedValue(cachedMiner);

      const result = await controller.getMiner(minerId);

      expect(result).toEqual(cachedMiner);
      expect(mockCache.get).toHaveBeenCalledWith(`miner:${minerId}`);
      expect(mockGrpc.getMiner).not.toHaveBeenCalled();
    });

    it('should fetch from API if cache miss', async () => {
      const minerId = 'test-miner-1';
      const apiMiner = { id: minerId, status: 'online' };
      mockCache.get.mockResolvedValue(null);
      mockGrpc.getMiner.mockResolvedValue(apiMiner);

      const result = await controller.getMiner(minerId);

      expect(result).toEqual(apiMiner);
      expect(mockCache.set).toHaveBeenCalledWith(`miner:${minerId}`, apiMiner, 3600);
    });

    it('should throw MinerNotFoundError when API returns null', async () => {
      mockCache.get.mockResolvedValue(null);
      mockGrpc.getMiner.mockResolvedValue(null);

      await expect(controller.getMiner('invalid-id')).rejects.toThrow(MinerNotFoundError);
    });
  });
});
```

**Integration Test Template:**
```typescript
// tests/integration/rest-api.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../../src/server';
import { RedisClient } from '../../../src/cache/redis';

describe('REST API - Miners Endpoint', () => {
  let app: any;
  let redis: RedisClient;

  beforeAll(async () => {
    redis = new RedisClient({ host: 'localhost', port: 6379 });
    app = await createApp({ cache: redis });
    await app.listen(0);
  });

  afterAll(async () => {
    await redis.flushAll();
    await app.close();
  });

  describe('GET /api/v1/miners/:id', () => {
    it('should return miner details with 200 status', async () => {
      const response = await request(app)
        .get('/api/v1/miners/test-miner-1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 'test-miner-1');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('hashrate');
    });

    it('should return 404 for non-existent miner', async () => {
      await request(app)
        .get('/api/v1/miners/non-existent')
        .expect(404);
    });
  });
});
```

---

## Tool Use & Permissions

### Required Commands

**All agents must have access to:**

```bash
# Package management
npm install                  # Install dependencies
npm update                   # Update packages
npm ci                      # Clean install (CI/CD)

# Build & compile
npm run build               # Compile TypeScript → JavaScript
npm run prebuild            # Generate gRPC types from .proto
npm run dev                 # Watch mode (auto-rebuild)

# Code quality
npm run lint                # Check ESLint violations
npm run lint:fix            # Auto-fix violations
npm run format              # Prettier formatting
npm run type-check          # TypeScript strict checks

# Testing
npm test                    # All tests with coverage
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests
npm run test:e2e            # End-to-end tests
npm run test:watch          # Watch mode

# Runtime
npm start                   # Production server
npm run dev                 # Development server
npm run docker:build        # Build Docker image
npm run docker:run          # Run in Docker

# Documentation
npm run docs:generate       # Generate API docs from JSDoc
npm run docs:serve          # Serve docs locally

# Monitoring
npm run health-check        # Verify all services running
npm run logs                # Tail application logs
```

### Restricted Operations (Require Human Approval)

❌ **DO NOT** without explicit human approval:

1. **Production Data Manipulation**
   - Direct database modifications
   - Redis cache clearing in production
   - Deleting customer data or configurations

2. **Infrastructure Changes**
   - Modifying deployment configurations
   - Changing environment variables in production
   - Scaling infrastructure up/down

3. **Security Operations**
   - Rotating API keys or secrets
   - Modifying authentication policies
   - Changing access control rules
   - Disabling security checks

4. **Dangerous Git Operations**
   - Force pushing (`git push --force`)
   - Rewriting commit history (`git rebase`)
   - Deleting branches without discussion
   - Merging to production without CI passing

5. **External Service Integration**
   - Connecting to live mining pools without testing
   - Modifying billing or payment systems
   - Accessing customer gRPC servers without approval

### Conditional Permissions (Subject to Code Review)

⚠️ **Review Required Before Merge:**

- Changes to `src/auth/`, `src/security/`, `src/crypto/`
- Database schema migrations
- API contract changes (breaking changes)
- Configuration schema updates
- Dependency version bumps to majors
- Performance-critical algorithms
- Error handling in critical paths

---

## Git Operations

### Branch Strategy

**We follow Git Flow with hotfixes:**

```
┌─ main (production) ◄─┐
│                     ├─ release/1.2.0 (release prep)
├─ develop (staging) ◄─┤
│                     ├─ feature/* (feature development)
│                     ├─ fix/* (bug fixes)
│                     └─ refactor/* (code cleanup)
└─ hotfix/* (production patches) ◄─ main emergency fixes
```

### Branch Naming Convention

```bash
# Features (from develop)
feature/miner-firmware-update         # New functionality
feature/enable-multi-tenant           # Feature enablement

# Bug fixes
fix/grpc-connection-timeout           # Non-critical bug
fix/auth-token-expiration             # Bug in develop

# Refactoring
refactor/redis-client-abstraction     # Code quality
refactor/extract-validation-logic     # Maintainability

# Hotfixes (from main, merge back to develop)
hotfix/critical-auth-bypass           # Emergency production fix
hotfix/memory-leak-in-cache           # Production data issue

# Release branches (from develop to main)
release/1.2.0                         # Release preparation
release/1.2.1                         # Patch release
```

### Commit Message Format

**Conventional Commits** ([https://www.conventionalcommits.org](https://www.conventionalcommits.org)):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, no logic change)
- `refactor`: Code restructuring without feature change
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD configuration changes
- `revert`: Reverting a previous commit

**Examples:**

```bash
# Feature
feat(miner): add firmware version check endpoint
This allows clients to verify compatible firmware versions
before attempting updates. Implements #456.

# Bug fix
fix(grpc): handle connection timeout gracefully
Previously, timeout errors were not caught, causing
the server to crash. Now retries with exponential backoff.
Fixes #234

# Performance
perf(cache): add redis clustering for distributed cache hits
Reduces latency by 200ms on multi-tenant deployments.

# Documentation
docs(api): add OpenAPI spec for authentication endpoints

# Testing
test(miner): add coverage for firmware update failure scenarios

# Refactoring
refactor(auth): extract OAuth verification to separate module
No behavior change, improves testability and reusability.
```

**Commit Message Checklist:**
- [ ] Type is one of: feat, fix, docs, style, refactor, perf, test, chore, ci, revert
- [ ] Scope is relevant module (miner, auth, cache, grpc, etc.)
- [ ] Subject is lowercase, imperative, present tense
- [ ] Subject is < 50 characters
- [ ] Body wrapped at 72 characters
- [ ] Body explains WHY, not WHAT
- [ ] Footer references issue number (#123) or BREAKING CHANGE

### Pull Request Process

1. **Create feature branch from develop:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   ```

2. **Commit regularly with conventional format:**
   ```bash
   git commit -m "feat(miner): add firmware update endpoint"
   ```

3. **Push and create Pull Request:**
   ```bash
   git push origin feature/my-feature
   # Opens PR on GitHub with template
   ```

4. **PR Template (auto-filled):**
   ```markdown
   ## Description
   Briefly describe the changes and why they're needed.

   ## Related Issue
   Fixes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added
   - [ ] Integration tests added
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests pass locally (npm test)
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   - [ ] Security review completed (if applicable)
   ```

5. **CI Pipeline Runs Automatically:**
   ```bash
   ✅ npm run lint           # ESLint check
   ✅ npm run type-check     # TypeScript verification
   ✅ npm test               # Unit + integration tests
   ✅ npm run security-audit # Dependency vulnerabilities
   ```

6. **Code Review & Merge:**
   - Minimum 2 approvals required
   - No "Request Changes" reviews
   - All CI checks passing
   - Squash and merge (keeps history clean)

### Merge Policies

**To main (Production Release):**
- Source: release/* or hotfix/* branch only
- Approvals: 2 senior engineers + 1 product review
- CI: All checks must pass
- Action: Create git tag (v1.2.0)
- Follow-up: Merge back to develop

**To develop (Staging):**
- Source: feature/*, fix/*, refactor/* branches
- Approvals: 1 engineer review minimum
- CI: All checks must pass
- Action: Auto-deploy to staging environment

**To feature branch:**
- May rebase on develop if behind (avoid force-push)
- Communicate large rebases to team

---

## Testing Strategy

### Test Pyramid

```
        △ E2E Tests (1-2 tests)
       / \
      /   \  Integration Tests (8-15 tests)
     /     \
    /       \ Unit Tests (25-50 tests)
   /_________\
```

### Unit Tests

**Coverage Targets:**
- All utility functions: 100%
- Controllers/Handlers: >85%
- Models/Types: >80%
- Critical paths: 100% (auth, payment, data loss)

**Command:**
```bash
npm run test:unit -- --coverage
```

**Template:**
```typescript
describe('ClassName', () => {
  let instance: ClassName;
  let mockDep: jest.Mocked<Dependency>;

  beforeEach(() => {
    mockDep = { /* mocks */ };
    instance = new ClassName(mockDep);
  });

  describe('methodName', () => {
    it('should [expected behavior] when [condition]', async () => {
      const result = await instance.methodName(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should throw [ErrorType] when [error condition]', async () => {
      await expect(instance.methodName(invalid))
        .rejects.toThrow(ErrorType);
    });
  });
});
```

### Integration Tests

**Coverage Targets:**
- API endpoints: Request → Response → Database
- External service mocking (gRPC server, Redis)
- Happy path + 3 failure scenarios per endpoint

**Command:**
```bash
# Requires: Redis running (docker-compose up redis)
npm run test:integration
```

**Template:**
```typescript
describe('MinerAPI Integration', () => {
  let app: any;
  let redis: RedisClient;

  beforeAll(async () => {
    redis = new RedisClient();
    app = await createApp({ cache: redis });
  });

  it('should update miner and invalidate cache', async () => {
    // Set up test data
    await redis.set('miner:1', { id: '1', status: 'online' });

    // Make API request
    const response = await request(app)
      .put('/api/v1/miners/1')
      .send({ status: 'offline' });

    // Verify response
    expect(response.status).toBe(200);

    // Verify cache was invalidated
    const cached = await redis.get('miner:1');
    expect(cached).toBeNull();
  });
});
```

### E2E Tests

**Coverage Targets:**
- Critical user journeys (firmware update flow, multi-miner operations)
- Real services (Redis, gRPC server, optional: real miners in staging)
- Deployment validation

**Command:**
```bash
# Requires: Docker Compose with all services
npm run test:e2e
```

**Template:**
```typescript
describe('E2E: Firmware Update Flow', () => {
  it('should update firmware on multiple miners and track progress', async () => {
    // Create test miners
    const miners = await setupTestMiners(3);
    
    // Initiate firmware update
    const updateResponse = await api.post('/api/v1/firmware/update', {
      minerIds: miners.map(m => m.id),
      version: '2.0.1',
    });
    
    const taskId = updateResponse.body.taskId;
    
    // Poll for completion
    let updates = [];
    for (let i = 0; i < 30; i++) {
      const progress = await api.get(`/api/v1/tasks/${taskId}`);
      updates.push(progress.body.status);
      
      if (progress.body.completed) break;
      await sleep(1000);
    }
    
    // Verify all miners updated
    expect(updates[updates.length - 1]).toBe('completed');
    const updated = await api.get('/api/v1/miners?firmware=2.0.1');
    expect(updated.body.length).toBe(3);
  });
});
```

### Code Coverage Reports

```bash
# Generate HTML coverage report
npm test -- --coverage --coverageReporters=html

# View in browser
open coverage/index.html

# Enforce minimum thresholds
npm test -- --coverage --collectCoverageFrom='src/**/*.ts' \
  --coveragePathIgnorePatterns='/node_modules/' \
  --coverageThreshold='{
    "global": { "lines": 85, "functions": 85, "branches": 80 }
  }'
```

---

## Security Policies

### Authentication & Authorization

#### Authentication Flow (OAuth 2.0)

```
User/AI Agent → Auth Endpoint (POST /oauth/token)
                     ↓
            [Verify credentials]
                     ↓
        Return JWT (exp: 1h, refresh: 7d)
                     ↓
        Store refresh token in HttpOnly cookie
```

**JWT Payload:**
```json
{
  "sub": "user-id-uuid",
  "email": "user@mining.io",
  "role": "technician|operator|admin",
  "tenant": "fleet-id-uuid",
  "iat": 1703000000,
  "exp": 1703003600
}
```

#### Authorization Levels

| Role | Permissions | Use Case |
|------|------------|----------|
| **technician** | Read miner status, restart, reboot | On-site support |
| **operator** | All technician + firmware update, config change | Remote operations |
| **admin** | All operations + user management, audit logs | System administration |
| **api_service** | Specific scopes (read-only, write-pool) | Service integrations |

**Code Example:**
```typescript
// Middleware
@UseMiddleware(authenticateJWT)
@Authorized(['operator', 'admin'])  // Role-based access control
async updateMinerConfig(id: string, config: MinerConfig): Promise<void> {
  // Verify tenant isolation
  if (this.req.user.tenant !== config.tenantId) {
    throw new ForbiddenError('Cannot access other tenant data');
  }
  // Continue with update
}
```

### Data Handling

#### Sensitive Data Classification

| Data Type | Classification | Handling |
|-----------|----------------|----------|
| Miner IP/hostname | **SENSITIVE** | Encrypt at rest, audit all access |
| Pool credentials | **HIGHLY SENSITIVE** | Vault storage, no logs, rotate quarterly |
| User passwords | **HIGHLY SENSITIVE** | bcrypt hash, no plaintext anywhere |
| Firmware binaries | **SENSITIVE** | Signed checksums, integrity validation |
| Operation logs | **INTERNAL** | Retention: 90 days, PII redaction |

#### Data Encryption

```typescript
// src/utils/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Encrypt sensitive fields before storage
export function encryptPoolCredentials(credentials: PoolAuth): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(credentials), 'utf8'),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

// Never log credentials
export function maskCredentials(creds: any): any {
  return {
    ...creds,
    password: '***MASKED***',
    apiKey: creds.apiKey?.substring(0, 4) + '...***',
  };
}
```

### API Key Management

**Rules:**
1. API keys stored in encrypted vault only (not code, not .env files)
2. Keys rotated every 90 days
3. All API key usage logged and monitored
4. Rate limiting per key: 1000 req/hour
5. Dead key detection: unused for 30 days → automatic revocation

```typescript
// Environment variables (example)
VAULT_ADDR=https://vault.mining.internal
VAULT_TOKEN=hvs.*** (from CI/CD secrets)
// NOT in git, NOT in plaintext!
```

### Secure Coding Practices

```typescript
// ❌ DON'T: Hardcode secrets
const API_KEY = 'sk_live_123456789';

// ✅ DO: Use environment variables with validation
const API_KEY = env.API_KEY; // Fails at startup if missing

// ❌ DON'T: Log sensitive data
logger.info('Updating miner', { minerId, poolPassword: '123' });

// ✅ DO: Mask sensitive fields
logger.info('Updating miner', { minerId });

// ❌ DON'T: Use default credentials
const redis = new Redis('redis://user:password@localhost');

// ✅ DO: Rotate and use vault
const redis = new Redis(getRedisURL());

// ❌ DON'T: Accept arbitrary input
const minerId = req.query.id; // Could be '; DROP TABLE miners; --

// ✅ DO: Validate and sanitize
const minerId = validateUUID(req.query.id);

// ❌ DON'T: Trust external APIs
const miner = await externalApi.getMiner(id);
minerStatus = miner.status;

// ✅ DO: Validate external responses
const miner = MinerSchema.parse(await externalApi.getMiner(id));
const minerStatus = Object.values(MinerStatus).includes(miner.status)
  ? miner.status
  : MinerStatus.Unknown;
```

### Dependency Security

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically (review changes!)
npm audit fix

# Enforce in CI (fail on high severity)
npm audit --audit-level=high
```

**Dependency Policy:**
- Only production dependencies in `dependencies`
- Dev tools in `devDependencies`
- Monthly security audits
- Patch updates automatic (auto-merge)
- Minor/major updates require review

---

## Collaboration Patterns

### Multi-Agent Workflow

**For a feature spanning multiple agents:**

```
┌──────────────────────────────────────────────────┐
│ 1. ARCHITECT AGENT (System Design)               │
│    Tasks:                                        │
│    - Review feature spec and constraints         │
│    - Design data models and API contract         │
│    - Identify integration points                 │
│    - Output: Design document, database schema    │
│    Hands off to: Builder                         │
└──────────────────────────────────────────────────┘
             ↓ (Approval from humans)
┌──────────────────────────────────────────────────┐
│ 2. BUILDER AGENT (Implementation)                │
│    Tasks:                                        │
│    - Write code from design                      │
│    - Implement unit tests (TDD)                  │
│    - Create fixtures and mocks                   │
│    - Output: PR with complete feature            │
│    Hands off to: Validator                       │
└──────────────────────────────────────────────────┘
             ↓ (Code review)
┌──────────────────────────────────────────────────┐
│ 3. VALIDATOR AGENT (Quality Assurance)           │
│    Tasks:                                        │
│    - Run full test suite                         │
│    - Verify coverage >85%                        │
│    - Test edge cases and error scenarios         │
│    - Integration test with other components      │
│    - Output: QA report, approved for merge       │
│    Hands off to: DevOps                          │
└──────────────────────────────────────────────────┘
             ↓ (All checks pass)
┌──────────────────────────────────────────────────┐
│ 4. DEVOPS AGENT (Deployment & Monitoring)        │
│    Tasks:                                        │
│    - Run E2E tests in staging                    │
│    - Deploy to production                        │
│    - Monitor metrics and logs                    │
│    - Output: Deployment report, monitoring setup │
│    Hands off to: Architect/Scribe                │
└──────────────────────────────────────────────────┘
             ↓ (In production)
┌──────────────────────────────────────────────────┐
│ 5. SCRIBE AGENT (Documentation)                  │
│    Tasks:                                        │
│    - Update API docs                             │
│    - Update user guides                          │
│    - Add changelog entry                         │
│    - Output: Updated documentation               │
└──────────────────────────────────────────────────┘
```

### Communication Protocol

**Agent Status Updates (via GitHub comments on PR):**

```markdown
@Architect - Architecture review needed
Proposal: Add tenant isolation middleware
Linked design doc: [ARCHITECTURE.md#tenant-isolation](...)
```

```markdown
@Builder - Ready for implementation
Status: Implementation in progress on feature/tenant-isolation
Coverage target: >85%
ETA: 2 days
```

```markdown
@Validator - Ready for QA
PR: [#456](...)
Test results:
- Unit: 47/47 passing
- Coverage: 87%
- Ready for integration tests
```

**Escalation Path for Blockers:**

```
Agent detects blocker
    ↓ (documents in PR comment with @mention)
    ↓ (waits 4 hours for response)
    ↓
Did someone respond?
    ├─ YES: unblock and continue
    └─ NO: escalate to #engineering-channel in Slack
           with detailed context and decision needed
```

### Decision-Making Authority

**Architect Agent:** Data model, API contract, deployment strategy
**Builder Agent:** Implementation approach, refactoring decisions
**Validator Agent:** QA strategy, test coverage requirements
**DevOps Agent:** Infrastructure decisions, monitoring setup
**Product Team (human):** Feature priority, business trade-offs

**Conflict Resolution:**
- Technical disagreements: Archer agent has final say
- Timeline conflicts: Project lead decides
- Security concerns: Security team must approve

---

## Version Control & Releases

### Semantic Versioning

Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- **MAJOR (1.X.X):** Breaking API changes, incompatible deployments
- **MINOR (X.2.X):** New features, backward compatible
- **PATCH (X.X.3):** Bug fixes, no new features

### Release Process

```bash
# 1. Create release branch
git checkout -b release/1.2.0

# 2. Update version
npm version minor      # Updates package.json

# 3. Update CHANGELOG.md
# Document all changes since last release

# 4. Create PR to main
git push origin release/1.2.0

# 5. After review & CI passes, merge to main
# GitHub automatically creates release notes from commits

# 6. Tag release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# 7. Merge release branch back to develop
git checkout develop
git pull origin develop
git merge release/1.2.0
```

---

## Appendix: Quick Reference

### Common Commands

```bash
# Setup
git clone https://github.com/Ryno-Crypto-Mining-Services/braiins-os-mcp-server
cd braiins-os-mcp-server
npm install
npm run build

# Development
npm run dev              # Start dev server
npm test -- --watch     # Watch tests

# Before commit
npm run lint:fix        # Fix style issues
npm test                # Run tests
git commit -m "feat(scope): message"

# Merge to main
git checkout develop
git pull origin develop
npm test                # Final verification
git push origin feature/...
# Create PR, get 2 approvals, merge
```

### Links & Resources

- **Braiins API Docs:** [https://deepwiki.com/braiins/bos-plus-api](https://deepwiki.com/braiins/bos-plus-api)
- **MCP Protocol:** [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **gRPC Basics:** [https://grpc.io/docs/languages/node](https://grpc.io/docs/languages/node)
- **TypeScript Handbook:** [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- **Jest Testing:** [https://jestjs.io/docs](https://jestjs.io/docs)

---

**Document Versioning:**
- Version 1.0 - Initial comprehensive guide for braiins-os-mcp-server
- Last Updated: December 2025
- Maintainer: Architecture Team

*This document is the source of truth for all AI agent behavior on this project. Update this file when policies change.*
