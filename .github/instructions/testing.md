# Testing Instructions and TDD Workflow

> See `AGENTS.md` and `ARCHITECTURE.md` for broader development and architecture context.

---

## 1. Testing Philosophy

We follow a **TDD-first** mindset wherever practical:

1. Write or update tests **first**.
2. Implement or modify code until tests pass.
3. Refactor while keeping tests green.

Coverage target: **≥ 80% line and branch coverage** for `src/`.

> Reference: TDD by Example [https://martinfowler.com/bliki/TestDrivenDevelopment.html](https://martinfowler.com/bliki/TestDrivenDevelopment.html)  
> Reference: Jest Docs [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)

---

## 2. Test Types and Locations

- **Unit Tests**
  - Location: `tests/unit/**/*.spec.ts`
  - Scope: Pure functions, small services, utilities.

- **Integration Tests**
  - Location: `tests/integration/**/*.spec.ts`
  - Scope: Braiins OS API client, Redis, MCP handlers with external dependencies mocked or sandboxed.

- **End-to-End (E2E) Tests**
  - Location: `tests/e2e/**/*.spec.ts`
  - Scope: Full flow from MCP request → Braiins OS → Redis → response.

---

## 3. Commands

```
npm run test              # All tests
npm run test:unit         # Unit tests only (if configured)
npm run test:integration  # Integration tests
npm run test:e2e          # E2E tests
npm run test:coverage     # Coverage report
```

CI must run at least:

- `npm run lint`
- `npm run test:coverage`

---

## 4. TDD Workflow Example

1. **Add/Update Test**

```
// tests/unit/miner-monitoring.spec.ts
describe("MinerMonitoringServiceImpl", () => {
  it("uses cache before calling Braiins API", async () => {
    // Arrange...
    // Act...
    // Assert...
  });
});
```

2. **Run Tests and Watch Fail**
3. **Implement Code in `src/services`**
4. **Refine and Refactor** until tests pass and are clear.

---

## 5. Copilot and Testing

- Copilot may generate **test skeletons** and **mock setups**.
- Human developers must:
  - Refine assertions.
  - Ensure edge cases are covered.
  - Keep tests deterministic and non-flaky.

> Reference: Testing Best Practices [https://martinfowler.com/articles/practical-test-pyramid.html](https://martinfowler.com/articles/practical-test-pyramid.html)  
> Reference: Jest Mock Functions [https://jestjs.io/docs/mock-functions](https://jestjs.io/docs/mock-functions)
