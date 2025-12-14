# GitHub Copilot Usage Guide for `braiins-os-mcp-server`

> **See [`AGENTS.md`](./AGENTS.md) for core development standards, coding style, and workflows.**  
> This document adds **Copilot-specific** guidance for this repository.

---

## 1. Goals for Copilot in This Project

Copilot is used to:

- Accelerate **boilerplate** generation (TypeScript, gRPC clients, Redis utilities, tests).
- Suggest **code patterns that conform to project standards** from `AGENTS.md`.
- Help maintain **consistency** across:
  - MCP server handlers
  - Braiins OS API integration code
  - Redis caching utilities
  - Test suites and mocks

Copilot is **not** a replacement for:

- Architectural decision-making (see `ARCHITECTURE.md`).
- Security review and threat modeling (see `.github/instructions/security.md`).
- Manual code review and testing.

> Reference standards:  
> - TypeScript Deep Dive [https://basarat.gitbook.io/typescript](https://basarat.gitbook.io/typescript)  
> - GitHub Copilot Docs [https://docs.github.com/en/copilot](https://docs.github.com/en/copilot)

---

## 2. How to Use Copilot Effectively

### 2.1 Prompting Patterns

Use **task-oriented prompts** in comments:

```
// HUMAN: Implement a typed gRPC client wrapper for Braiins OS API.
// Constraints: use async/await, handle timeouts, no any, follow error handling from src/core/errors.
// AI: Copilot will suggest initial implementation here.
export class BraiinsGrpcClient {
  // ...
}
```

Then **review and refine**:

- Keep Copilot’s scaffolding.
- Adjust types, error handling, and logging to align with:
  - `src/core/errors.ts`
  - `src/core/logging.ts`
  - Conventions in `AGENTS.md` and `ARCHITECTURE.md`.

### 2.2 Preferred Use Cases

Use Copilot primarily for:

1. **Boilerplate & Repetitive Code**
   - MCP tool/command wiring.
   - Type-safe DTOs for Braiins OS API.
   - Redis key helpers and typed repositories.

2. **Test Generation**
   - Jest unit tests for pure functions and service classes.
   - Integration test skeletons for gRPC-to-MCP flows.

3. **Scaffolding New Modules**
   - New MCP tools (e.g., miner reboot, config update).
   - New transport implementations (STDIO, HTTP SSE).

Avoid using Copilot to:

- Generate **security-sensitive logic** (auth, key management) without **human validation**.
- Write **database/Redis data migration** scripts without review by a human DevOps/DB expert.

> Reference standards:  
> - Jest Docs [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)  
> - OWASP Secure Coding Practices [https://owasp.org/www-project-secure-coding-practices](https://owasp.org/www-project-secure-coding-practices)

---

## 3. Integration with VS Code Workflow

### 3.1 Recommended Settings

Add to your user or workspace settings as needed:

```
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": false
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.format.enable": true
}
```

- **Copilot completions** are allowed in TypeScript, JSON, and Markdown.
- **Prettier** + **ESLint** enforce style and lint rules (see `AGENTS.md` and `.eslintrc`).

### 3.2 Typical Flow

1. **Create/Modify File**  
   - Start writing function signatures, interfaces, or comments describing your intent.
2. **Let Copilot Suggest**  
   - Accept parts that match standards.
   - Reject or edit what does not align.
3. **Run Local Quality Gates**
   - `npm run lint`
   - `npm run test`
   - `npm run test:integration` (if applicable)
4. **Commit** with **Conventional Commits** format (see `AGENTS.md`).

---

## 4. Code Generation Patterns

### 4.1 Service / Repository Classes

Preferred pattern:

```
// HUMAN: Service contract defined based on architecture & AGENTS.md
export interface MinerMonitoringService {
  getMinerStatus(ip: string): Promise<MinerStatus>;
}

// AI: Copilot can scaffold implementation following existing patterns from src/services/*
export class MinerMonitoringServiceImpl implements MinerMonitoringService {
  constructor(
    private readonly braiinsClient: BraiinsGrpcClient,
    private readonly cache: MinerCacheRepository
  ) {}

  async getMinerStatus(ip: string): Promise<MinerStatus> {
    // Copilot can suggest caching + API call pattern; human reviews.
  }
}
```

### 4.2 Test Files

File naming convention: `*.spec.ts` for Jest tests.

```
// HUMAN: Define test intent; Copilot generates test bodies following patterns.
describe("MinerMonitoringServiceImpl", () => {
  it("returns cached status when available", async () => {
    // Copilot suggests mock setup; human ensures correctness.
  });

  it("falls back to Braiins API when cache miss", async () => {
    // ...
  });
});
```

### 4.3 MCP Tool Handlers

```
// HUMAN: Describe tool schema & behavior; Copilot scaffolds handler.
export const getMinerStatsTool = {
  name: "get_miner_stats",
  // ...
};

// HANDLER: Copilot helps based on prior handlers in src/mcp/tools/*
export async function handleGetMinerStats(args: GetMinerStatsArgs): Promise<GetMinerStatsResult> {
  // ...
}
```

> Reference standards:  
> - Node.js Best Practices [https://github.com/goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)  
> - TypeScript Style Guide (Airbnb-like) [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript)

---

## 5. Limitations and Guardrails

- **Security & Secrets**
  - Never let Copilot introduce hard-coded secrets, API keys, or credentials.
  - Use environment variables and secret management per `.github/instructions/security.md`.

- **Deprecated APIs**
  - Avoid older Node.js or `grpc` APIs; prefer actively maintained libraries as described in `ARCHITECTURE.md`.

- **Human Review Required**
  - All Copilot-generated code must pass:
    - ESLint + Prettier
    - Unit tests (`npm test`)
    - Peer review via Pull Request

> Reference standards:  
> - 12-Factor App Config [https://12factor.net/config](https://12factor.net/config)  
> - OWASP Top 10 [https://owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten)
