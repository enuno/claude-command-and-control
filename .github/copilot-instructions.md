# Repository-wide GitHub Copilot Instructions

These instructions apply to **all Copilot usage** in this repository.

> For full development standards, see:  
> - [`AGENTS.md`](../AGENTS.md)  
> - [`ARCHITECTURE.md`](../ARCHITECTURE.md)  
> - [`COPILOT.md`](../COPILOT.md)  

---

## 1. Project Structure Overview

Key directories (may evolve):

- `src/`
  - `mcp/` – MCP server, tools, and transport implementations.
  - `braiins/` – Braiins OS API client integration (gRPC, HTTP).
  - `core/` – cross-cutting utilities (logging, errors, config).
  - `redis/` – Redis client configuration and cache repositories.
  - `auth/` – authentication/authorization logic (OAuth, tokens).
- `tests/`
  - `unit/`, `integration/`, `e2e/` – test suites per test type.
- `config/` – configuration files, environment templates.

Copilot should **infer patterns from existing files in these directories** and suggest similar structures.

> Reference: Node.js Project Layout Best Practices [https://github.com/goldbergyoni/nodebestpractices#1-project-structure-practices](https://github.com/goldbergyoni/nodebestpractices#1-project-structure-practices)

---

## 2. Testing Commands & Expectations

Copilot-generated code must be compatible with the following commands:

```
npm run lint           # ESLint
npm run test           # Unit tests (Jest)
npm run test:integration  # Integration tests
npm run test:e2e       # End-to-end tests (if configured)
npm run test:coverage  # Coverage report (target: >= 80%)
```

Expectations:

- New features must include **accompanying tests**.
- Copilot may propose **test skeletons**, but humans finalize assertions and edge cases.
- Avoid using `any` in TypeScript tests unless absolutely necessary and justified.

> Reference: Jest Best Practices [https://github.com/jest-community/awesome-jest](https://github.com/jest-community/awesome-jest)  
> Reference: Code Coverage Best Practices [https://martinfowler.com/bliki/TestCoverage.html](https://martinfowler.com/bliki/TestCoverage.html)

---

## 3. Code Style Enforcement

Copilot suggestions must conform to:

- **TypeScript**: strict mode enabled (no implicit any, strictNullChecks).
- **ESLint**: project-specific rules configured in `.eslintrc.*`.
- **Prettier**: formatting enforced on save / CI.

Conventions:

- Use **named exports** for services and core utilities.
- Use **PascalCase** for classes and **camelCase** for variables/functions.
- Prefer **async/await** over raw Promises.

Example:

```
// GOOD (Copilot suggestions should look like this)
export class MinerConfigService {
  constructor(private readonly braiinsClient: BraiinsGrpcClient) {}

  async updateConfig(ip: string, config: MinerConfig): Promise<void> {
    // ...
  }
}
```

> Reference: ESLint Docs [https://eslint.org/docs/latest/use/configure](https://eslint.org/docs/latest/use/configure)  
> Reference: Prettier Docs [https://prettier.io/docs/en/index.html](https://prettier.io/docs/en/index.html)

---

## 4. Pull Request Checklist (For Copilot-Generated Changes)

When Copilot suggestions are used, PRs must ensure:

1. **Compilation & Linting**
   - [ ] `npm run lint` passes
   - [ ] TypeScript compiles without errors

2. **Testing**
   - [ ] New or changed code has tests
   - [ ] `npm test` passes
   - [ ] Coverage remains ≥ 80% (`npm run test:coverage`)

3. **Security & Secrets**
   - [ ] No secrets or credentials committed
   - [ ] Auth changes reviewed against `.github/instructions/security.md`

4. **Architecture & API**
   - [ ] Changes align with `ARCHITECTURE.md`
   - [ ] Public API surface documented (if applicable)

> Reference: GitHub PR Review Guidelines [https://docs.github.com/en/pull-requests](https://docs.github.com/en/pull-requests)  
> Reference: Conventional Commits [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 5. Security Considerations for Copilot

Copilot **must not** suggest or introduce:

- Hard-coded API keys, passwords, or tokens.
- Disabled TLS/SSL verification in production paths.
- Insufficient input validation for miner IPs or user-provided parameters.

Safe patterns:

- Use environment variables (`process.env`) and configuration modules.
- Validate and sanitize all external inputs.
- Use HTTPS/TLS, OAuth per `.github/instructions/security.md`.

> Reference: OWASP Top 10 [https://owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten)  
> Reference: Node.js Security Best Practices [https://nodejs.org/en/docs/guides/security](https://nodejs.org/en/docs/guides/security)
