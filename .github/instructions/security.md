# Security Guidelines

> These rules govern authentication, authorization, data handling, and secrets management.  
> See `AGENTS.md` and `ARCHITECTURE.md` for broader security architecture and flows.

---

## 1. Authentication & Authorization

- Managed deployments (HTTP/OAuth) must:
  - Use **OAuth 2.0 / OIDC** where appropriate.
  - Validate tokens on every request to protected endpoints.
- Local deployments (STDIO) should:
  - Be treated as **trusted developer tools** but still avoid exposing sensitive data.

Always enforce:

- **Least privilege**: Only the minimum required permissions.
- **Separation of concerns**: auth logic in `src/auth/` modules.

> Reference: OAuth 2.0 [https://oauth.net/2/](https://oauth.net/2/)  
> Reference: OWASP Authorization Guidelines [https://owasp.org/www-community/Authorization_Cheat_Sheet](https://owasp.org/www-community/Authorization_Cheat_Sheet)

---

## 2. Secrets and Configuration

- **Never** hard-code secrets, API keys, or passwords.
- Use environment variables and secure secret storage in production (e.g., vaults).
- Local `.env` files should:
  - Be git-ignored.
  - Have a `.env.example` template checked into the repo.

---

## 3. Data Handling

- Treat miner credentials and IPs as **sensitive operational data**.
- Avoid logging:
  - Passwords or access tokens.
  - Full configuration dumps unless redacted.

Apply input validation to:

- Miner IP addresses and hostnames.
- Configuration updates received via API/MCP.

> Reference: OWASP Sensitive Data Exposure [https://owasp.org/Top10/A02_2021-Cryptographic_Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures)  
> Reference: Node.js Security Best Practices [https://nodejs.org/en/docs/guides/security](https://nodejs.org/en/docs/guides/security)

---

## 4. Vulnerability Scanning & Dependencies

- Run security scans in CI (e.g., `npm audit` or equivalent).
- Keep dependencies updated regularly.
- Avoid adding unmaintained or low-quality packages.

---

## 5. Copilot and Security

Copilot must **not**:

- Suggest disabling certificate validation in production (`rejectUnauthorized: false`).
- Insert demo credentials or “temporary” test secrets.

Developers must:

- Review Copilot suggestions for security issues.
- Cross-check against OWASP and this document before merging.

> Reference: OWASP Top 10 [https://owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten)
