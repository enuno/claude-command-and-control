# Project Context & Standards: MCP Server Development

> **Living Document Notice**: This CLAUDE.md file is a living document designed to evolve with MCP protocol updates, technology standards, and community discoveries. Version updates follow semantic versioning (MAJOR.MINOR.PATCH).

## Document Version
- **Version**: 2.0.0  
- **Last Updated**: December 1, 2025
- **Review Cycle**: Quarterly or upon MCP specification updates
- **Maintainer**: Engineering Standards Committee
- **MCP Protocol Version**: Latest stable release

---

## Core Principles

### Agent-First MCP Development Philosophy
- **Protocol Compliance First**: Always adhere to the Model Context Protocol specification strictly[66][69][75]
- **Modular Server Architecture**: Build MCP servers from discrete, composable tools with clear interfaces[128][130]
- **Interoperable Design**: Ensure servers work seamlessly across Claude Code, Cursor, and other MCP clients[66][128]
- **Automated Tool Discovery**: Enable agents to dynamically understand server capabilities through schemas[128]
- **Documentation as Protocol**: Treat tool documentation with the same rigor as server code[23][43]

### Code Portability & Scalability Standards
- **Client-Agnostic Design**: Test with multiple MCP clients (Claude Desktop, Cursor, custom implementations)[66][128]
- **Environment Independence**: Support both STDIO and HTTP+SSE communication modes[133]
- **Configuration Externalization**: Use MCP server configuration files, never hardcode connection details[82][126]
- **Container-Ready Thinking**: Design for containerized MCP server deployments[117][127]
- **Cross-Platform Compatibility**: Test on Windows, macOS, and Linux environments[32][128]

---

## MCP Server Development Standards

### Protocol Compliance[66][69][75]
- ✅ Follow the latest Model Context Protocol specification from [modelcontextprotocol.io](https://modelcontextprotocol.io)
- ✅ Implement proper JSON-RPC 2.0 message handling[66][128]
- ✅ Support capability negotiation during initialization[128]
- ✅ Handle resource cleanup and graceful shutdown[82]
- ✅ Implement proper error responses with descriptive messages[23][43]

### Tool Design Best Practices[43][128]
- **Clear Tool Names**: Use descriptive, action-oriented names (e.g., `get_repository_schema`, `execute_query`)
- **Comprehensive Schemas**: Define complete JSON schemas for all tool parameters[43][128]
- **Input Validation**: Validate all inputs before execution[43]
- **Error Handling**: Return structured error responses with actionable messages[23][43]
- **Idempotent Operations**: Design tools to be safely retryable where possible[2]

### Resource Management[128][130]
- Implement proper connection pooling for external services[127]
- Clean up file handles, database connections, and network sockets[130]
- Use context managers (Python) or defer statements (Go) for cleanup[130]
- Monitor memory usage, especially for long-running servers[128]
- Implement rate limiting for external API calls[127]

### Authentication & Authorization[72][77]
- Follow OAuth 2.0 resource server patterns for authenticated MCP servers[72][77]
- Never store credentials in code or configuration files[77]
- Use environment variables or secure vaults for sensitive data[77][82]
- Implement token refresh logic for long-lived sessions[77]
- Document authentication requirements clearly[43][72]

---

## Security & Dependencies

### Dependency Management
- ✅ Pin exact versions in production (avoid `^` or `~` in package.json)[32]
- ✅ Audit dependencies monthly for security vulnerabilities[32]
- ✅ Use official MCP SDK packages where available[66][123]
- ✅ Keep MCP protocol libraries updated with latest releases[66][77]
- 🔄 Automate security scanning in CI/CD pipelines[36]

### MCP-Specific Security
- Validate all tool inputs against schemas[43][128]
- Implement permission checks for destructive operations[23][43]
- Log all tool executions for audit trails[23]
- Use sandboxed execution environments where possible[94]
- Document security considerations in tool descriptions[23][43]

### Infrastructure Security
- Follow principle of least privilege for MCP server access[32][77]
- Rotate API keys and tokens regularly[77]
- Use TLS for remote MCP server connections[75][128]
- Implement defense-in-depth strategies[32]
- Audit server permissions quarterly[32]

---

## MCP Server Architecture

### Communication Modes[128][133]

#### STDIO Mode (Local Development)[128][133]
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

#### HTTP+SSE Mode (Remote Servers)[128][133]
```json
{
  "mcpServers": {
    "remote-server": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${TOKEN}"
      }
    }
  }
}
```

### Server Lifecycle[82][128]
1. **Initialization**: Negotiate capabilities with client
2. **Tool Discovery**: Expose available tools via `tools/list` request
3. **Request Handling**: Process tool execution requests
4. **Error Management**: Return structured errors for failures
5. **Shutdown**: Clean up resources gracefully on termination

### Tool Implementation Pattern[43][130]
```typescript
// Example: TypeScript MCP Tool
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}

// Implementation
async function executeTool(
  name: string, 
  parameters: Record<string, unknown>
): Promise<ToolResult> {
  // 1. Validate inputs
  // 2. Execute operation
  // 3. Handle errors
  // 4. Return structured result
}
```

---

## Testing & Validation

### MCP Server Testing[23][43]
- **Unit Tests**: Test individual tool functions in isolation
- **Integration Tests**: Test full server lifecycle with mock clients
- **Client Compatibility**: Test with Claude Code, Cursor, and custom clients[66][128]
- **Schema Validation**: Verify all tool schemas are valid JSON Schema[43]
- **Error Scenarios**: Test error handling and edge cases[23]

### Testing Commands
```bash
# Run test suite
npm test

# Test with specific MCP client
claude-code --mcp-config test-config.json

# Validate schemas
npm run validate-schemas

# Integration tests
npm run test:integration
```

### Pre-Deployment Validation[23][36]
- ✅ Test server startup and shutdown
- ✅ Verify tool discovery works correctly
- ✅ Validate all tool schemas
- ✅ Test error handling paths
- ✅ Check for resource leaks
- ✅ Perform security audit

---

## Code Quality Standards

### TypeScript/JavaScript (Primary Language)[123][130]
- Use TypeScript with strict mode enabled
- Define interfaces for all tool parameters and responses[43]
- Leverage async/await for I/O operations[130]
- Use ESLint with MCP-specific rules
- Minimum test coverage: 80%
- Document all exported functions and types

### Python (Alternative)[130]
- Use type hints consistently (Python 3.9+ syntax)
- Follow PEP 8 style guide
- Use Pydantic for data validation[130]
- Leverage async/await for I/O-bound operations
- Write comprehensive docstrings
- Minimum test coverage: 80%

### Go (For Performance-Critical Servers)
- Follow effective Go patterns
- Handle errors explicitly
- Use context for cancellation
- Implement proper concurrency patterns
- Document exported functions
- Run `golangci-lint` in CI

---

## Living Documentation Standards

### MCP-Specific Documentation[23][43][142]
- **Tool Descriptions**: Clear, concise descriptions of what each tool does
- **Parameter Documentation**: Complete documentation for all parameters
- **Usage Examples**: Provide realistic usage examples for each tool[43]
- **Error Codes**: Document all possible error codes and meanings[23]
- **Rate Limits**: Specify any rate limits or quotas[43]

### Maintenance Principles[30][34]
- Update documentation when adding or modifying tools
- Schedule quarterly reviews aligned with MCP spec updates[66][77]
- Use pull requests for all documentation changes
- Tag versions with semantic versioning[65]
- Maintain CHANGELOG.md for breaking changes[34]

### Change Management[34][65]
- Document rationale for architectural decisions (ADRs)
- Track MCP protocol version compatibility
- Use commit messages that reference issues/tickets
- Maintain audit trail of significant updates

---

## MCP Client Integration

### Configuration Files[82][126][142]

#### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

#### Cursor Configuration
```json
{
  "mcpServers": {
    "my-mcp-server": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Testing Integration[66][126]
```bash
# Test with Claude Code
claude --mcp-config ./mcp-config.json

# Test tool discovery
# Verify tools appear in Claude's available tools list

# Test tool execution
# Ask Claude to use specific tools and verify results
```

---

## Version Control & Collaboration

### Git Best Practices
- Write descriptive commit messages (Conventional Commits format)
- Use feature branches (never commit directly to main)
- Require pull request reviews for all changes
- Keep commits atomic and focused
- Tag releases with semantic versioning

### Branch Strategy
- `main` - production-ready code (protected)
- `develop` - integration branch for features
- `feature/*` - individual tool development
- `hotfix/*` - urgent production fixes

### Code Review Standards[36]
- Review for MCP protocol compliance[66][69]
- Check tool schema accuracy[43]
- Validate error handling[23]
- Verify test coverage
- Approve only when all CI checks pass

---

## Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run test:watch

# Lint code
npm run lint
npm run lint:fix

# Type check
npm run type-check
```

### MCP Server Operations
```bash
# Start MCP server (STDIO mode)
node dist/index.js

# Start MCP server (HTTP mode)
node dist/index.js --http --port 3000

# Test server with MCP client
claude --mcp-config config.json

# Validate tool schemas
npm run validate-schemas

# Generate documentation
npm run docs
```

### Docker Deployment
```bash
# Build image
docker build -t my-mcp-server:latest .

# Run container
docker run -d \
  -e API_KEY=$API_KEY \
  --name my-mcp-server \
  my-mcp-server:latest

# View logs
docker logs -f my-mcp-server
```

---

## File Structure Conventions

```
project-root/
├── .claude/                 # Claude-specific config
│   ├── commands/            # Custom slash commands
│   └── settings.json        # Claude settings
├── src/
│   ├── server.ts            # MCP server implementation
│   ├── tools/               # Tool implementations
│   │   ├── tool1.ts
│   │   ├── tool2.ts
│   │   └── index.ts
│   ├── schemas/             # JSON schemas for tools
│   └── utils/               # Helper functions
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── fixtures/            # Test fixtures
├── docs/                    # Documentation
│   ├── tools/               # Tool-specific docs
│   └── examples/            # Usage examples
├── CLAUDE.md                # This file
├── README.md                # Project overview
├── CONTRIBUTING.md          # Contribution guidelines
├── SECURITY.md              # Security policies
├── CHANGELOG.md             # Version history
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── mcp-config.json          # Example MCP configuration
```

---

## References & Resources

### MCP Standards & Specifications
- [Model Context Protocol Official Site](https://modelcontextprotocol.io/)
- [MCP GitHub Repository](https://github.com/anthropics/mcp)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)

### Official Documentation
- [Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp)
- [Cursor MCP Integration](https://cursor.sh/docs/mcp)
- [MCP Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Community Resources
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP Community Discord](https://discord.gg/modelcontextprotocol)
- [MCP Server Registry](https://mcp-registry.io)

### Security & Best Practices
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [OAuth 2.0 RFC](https://oauth.net/2/)
- [12-Factor App Methodology](https://12factor.net/)

### Related Projects
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

---

## AI Agent Integration Notes

### MCP Server Optimization for Claude[23][27][142]
- Keep tool descriptions concise but complete[43]
- Use clear, action-oriented tool names[43]
- Provide realistic usage examples[43]
- Document error conditions explicitly[23]
- Include bash commands for common operations

### Tool Use Conventions[43][128]
- Design tools for single, focused purposes
- Avoid tool sprawl (10-15 tools maximum per server)
- Group related operations into single tools with parameters
- Version control all tool schemas
- Test tool workflows regularly with real agents[66]

### Agent Limitations[23][94]
- Agents cannot access production secrets directly
- Require human approval for destructive operations
- Agents should use read-only tools by default
- Escalate security-sensitive changes for review
- Log all agent tool executions for audit

---

## Evolution Strategy

### MCP Protocol Tracking[66][77][82]
- Monitor MCP specification updates monthly
- Test new MCP features in development environment
- Update server implementation when protocol changes
- Maintain backward compatibility where possible
- Document breaking changes in CHANGELOG.md

### Community Engagement[128][136]
- Participate in MCP community discussions
- Share server implementations and learnings
- Contribute to MCP specification improvements
- Review and test community MCP servers
- Build on existing MCP server patterns

### Continuous Improvement[24][30]
- Gather feedback from Claude Code users regularly
- Incorporate lessons learned from production incidents
- Update based on new MCP ecosystem developments
- Remove deprecated or obsolete MCP features
- Benchmark server performance quarterly

---

**Note**: This document should be reviewed and updated quarterly or whenever significant MCP protocol changes occur. Contributions to improve this living document are encouraged through pull requests.

**MCP Server Maintainers**: Always test your server with multiple MCP clients before deployment. The ecosystem is rapidly evolving, and cross-client compatibility is essential for success.