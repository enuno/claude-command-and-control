# API Design Guidelines

> Applies to internal TypeScript APIs, MCP tools, and any HTTP/gRPC endpoints wired by this server.  
> See `ARCHITECTURE.md` and Braiins OS API docs for external API specifics.

---

## 1. General Conventions

- Use **RESTful patterns** for HTTP-exposed endpoints.
- Use **clear, descriptive names** for MCP tools and methods.
- Use **camelCase** for JSON fields and request/response objects.

Example MCP tool name:

- `getMinerStats`
- `updateMinerConfig`
- `rebootMiner`

> Reference: RESTful API Design [https://restfulapi.net](https://restfulapi.net)  
> Reference: JSON Style Guide [https://google.github.io/styleguide/jsoncstyleguide.xml](https://google.github.io/styleguide/jsoncstyleguide.xml)

---

## 2. Endpoint and Tool Naming

- **Resources** should be nouns: `miners`, `configs`, `firmware`.
- **Actions** should be verbs that operate on resources: `get`, `update`, `reboot`.

HTTP Example:

- `GET /miners/:id`
- `POST /miners/:id/reboot`

MCP Tool Example:

- `get_miner_stats`
- `set_miner_config`
- `upgrade_firmware`

---

## 3. Error Handling

- Use consistent error structures:

```
{
  "error": {
    "code": "MINER_UNREACHABLE",
    "message": "Failed to reach miner at 192.168.1.10",
    "details": {}
  }
}
```

- Map gRPC/Braiins API errors to project-wide error codes in `src/core/errors.ts`.

---

## 4. Versioning & Compatibility

- Prefer **backward-compatible** changes.
- If breaking changes are required in HTTP/MCP APIs, introduce versioned endpoints or tools:
  - `/v1/miners`
  - `get_miner_stats_v2`

> Reference: API Versioning Best Practices [https://martinfowler.com/articles/api-versioning.html](https://martinfowler.com/articles/api-versioning.html)  
> Reference: Braiins OS API docs [https://github.com/braiins/bos-plus-api](https://github.com/braiins/bos-plus-api)

---

## 5. Copilot and API Design

Copilot:

- May suggest request/response DTOs.
- Must **follow existing patterns** in `src/mcp/` and `src/braiins/`.
- Should avoid introducing new naming patterns without human oversight.

Developers must:

- Validate any new endpoints/tools against this document.
- Keep documentation in sync (e.g., update `README.md` or API docs if applicable).
