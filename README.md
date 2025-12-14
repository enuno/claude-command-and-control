# README.md: braiins-os-mcp-server
**AI-Assisted Mining Operations Management via Model Context Protocol**

> Bridge between AI agents (Claude, Copilot) and Braiins OS miner firmware using Model Context Protocol

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x LTS
- Docker & Docker Compose
- Git

### Installation (5 minutes)

```bash
# Clone repository
git clone https://github.com/Ryno-Crypto-Mining-Services/braiins-os-mcp-server
cd braiins-os-mcp-server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development environment
npm run dev
```

You should see:
```
MCP Server listening on STDIO
✅ Ready to receive requests from Claude
```

---

## 📋 What This Project Does

**braiins-os-mcp-server** is a Model Context Protocol (MCP) server that enables Claude and other AI agents to safely interact with Braiins OS ASIC miners.

### Common Tasks

**Monitor miner status:**
```
Claude: "What's the status of miner-123?"
└─ Server queries gRPC API
└─ Returns: status, hashrate, temperature, uptime
```

**Update firmware:**
```
Claude: "Update miners 1,2,3 to firmware v2.0.1"
└─ Server creates background job
└─ Tracks progress: downloaded, flashing, verifying
└─ Returns job ID and progress tracking
```

**Manage fleet:**
```
Claude: "Show fleet aggregated metrics"
└─ Returns: total hashrate, error rate, avg temp
└─ Cached for performance (30s TTL)
```

---

## 🏗️ Architecture Overview

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design**

```
AI Agents (Claude, Copilot)
        │
    [MCP Server] ← This project
        │
    ├─ gRPC Client → Braiins OS Miners
    ├─ REST API → HTTP Clients
    └─ Redis → Caching & Pub/Sub
```

### Deployment Options

| Pattern | Transport | Use Case |
|---------|-----------|----------|
| **Local** | STDIO | On-site technician with local miners |
| **Dedicated** | HTTP+SSE | Each user gets isolated container |
| **Shared** | HTTP+OAuth | Multiple users, shared fleet |
| **Hybrid** | Local + Cloud | On-site + cloud monitoring |

**See [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for implementation roadmap**

---

## 🛠️ Development

### Project Structure

```
src/
├── index.ts                 # MCP server entry point
├── server.ts                # Transport setup (STDIO, HTTP)
├── api/                     # API layer
│   ├── grpc/               # Miner communication
│   ├── rest/               # REST endpoints
│   └── handlers/           # Business logic
├── mcp/                     # MCP protocol
│   ├── resources.ts        # What Claude reads
│   ├── tools.ts            # What Claude can do
│   └── prompts.ts          # Claude guidance
├── cache/                  # Redis caching
├── models/                 # Data models
├── utils/                  # Helpers
├── config/                 # Configuration
└── types/                  # TypeScript types

tests/
├── unit/                   # Unit tests
├── integration/            # Integration tests
└── e2e/                    # End-to-end tests

docs/
├── ARCHITECTURE.md         # System design
├── API.md                  # API documentation
├── DEPLOYMENT.md           # Deployment guide
└── TROUBLESHOOTING.md      # Common issues
```

### Code Quality

```bash
# Style checking
npm run lint              # Check violations
npm run lint:fix          # Auto-fix style issues

# Type checking
npm run type-check        # Verify TypeScript types

# Testing
npm test                  # Run all tests with coverage
npm test -- --watch      # Watch mode (development)

# Formatting
npm run format            # Apply Prettier formatting
```

### Testing Philosophy

We use **Test-Driven Development (TDD)** with three test levels:

```
┌─────────────────┐
│ E2E Tests (2-3) │ Real miner connections, full workflows
├─────────────────┤
│ Integration (8) │ API boundaries, real cache, mock gRPC
├─────────────────┤
│ Unit (25+)      │ Pure logic, all dependencies mocked
└─────────────────┘
```

**Coverage target:** >85% across all modules

**Run tests:**
```bash
npm test                      # All tests + coverage
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests
npm run test:e2e              # End-to-end tests
```

---

## 📚 Documentation

### For AI Agents & Development Teams

- **[AGENTS.md](./AGENTS.md)** - Universal instruction manual for all AI agents
  - Code standards, testing strategy, security policies
  - Git workflow, collaboration patterns
  
- **[CLAUDE.md](./CLAUDE.md)** - Claude-specific instructions
  - Leveraging 200K context window
  - Workflow patterns with other agents
  
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design & patterns
  - High-level architecture
  - Technology stack rationale
  - Design patterns & examples
  
- **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** - 10-week implementation roadmap
  - Phase-by-phase breakdown
  - Sprint structure with deliverables
  - Risk assessment & mitigation
  
- **[MULTIAGENT_PLAN.md](./MULTIAGENT_PLAN.md)** - Multi-agent orchestration
  - Agent roles & responsibilities
  - Communication protocols
  - Quality gates & workflows
  
- **[AGENT_REGISTRY.md](./AGENT_REGISTRY.md)** - Agent capabilities directory
  - Architect, Builder, Validator, Scribe, DevOps, Researcher
  - Success criteria & example prompts
  
- **[TODO.md](./TODO.md)** - Actionable task list
  - Immediate, short-term, medium-term priorities
  - Task format with agent assignments

### For Users & Operators

- **[docs/API.md](./docs/API.md)** - REST API documentation
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues & solutions

---

## 🔐 Security

### Authentication
- OAuth 2.0 for user authentication
- JWT tokens with 1-hour expiry
- Refresh tokens (7-day expiry)
- HttpOnly cookies for secure storage

### Authorization
- Role-based access control (RBAC)
- Tenant isolation for multi-tenant deployments
- Fine-grained resource permissions

### Data Protection
- AES-256 encryption at rest
- TLS 1.3 for transport
- No hardcoded secrets (use environment variables)
- Comprehensive audit logging

**See [AGENTS.md #Security Policies](./AGENTS.md#security-policies) for detailed security guidelines**

---

## 🚀 Deployment

### Local Deployment (Development)

```bash
docker-compose up
# Starts: MCP server + Redis + development environment
```

### Docker Production Build

```bash
# Build multi-stage image
docker build -t braiins-os-mcp:1.0.0 .

# Run container
docker run -e NODE_ENV=production \
           -e OAUTH_CLIENT_ID=xxx \
           -e OAUTH_CLIENT_SECRET=yyy \
           braiins-os-mcp:1.0.0
```

### Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods -l app=braiins-os-mcp
kubectl logs -f deployment/braiins-os-mcp
```

**Complete deployment guide: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**

---

## 📊 Monitoring & Observability

### Health Check

```bash
curl http://localhost:3000/health

# Response
{
  "status": "healthy",
  "uptime": 3600,
  "dependencies": {
    "redis": "connected",
    "grpc": "ready"
  }
}
```

### Metrics (Prometheus)

```
# Endpoint
GET http://localhost:9090/metrics

# Key metrics
grpc_connection_duration_ms
cache_hits_total
api_request_duration_ms
error_rate_total
```

### Dashboards

Access Grafana: `http://localhost:3001`

Available dashboards:
- System Health (uptime, resource usage)
- API Performance (latency, throughput)
- Miner Operations (status, firmware updates)
- Cache Performance (hit rate, eviction)

---

## 🐛 Troubleshooting

### Common Issues

**Q: gRPC connection timeout**
```
A: 1. Check miner is reachable: ping [miner-ip]
   2. Verify gRPC port open: telnet [miner-ip] 50051
   3. Check network firewall rules
   4. Review logs: docker logs [container]
```

**Q: Cache not working**
```
A: 1. Verify Redis running: redis-cli ping
   2. Check cache TTL not 0
   3. Monitor: MONITOR in redis-cli
   4. Clear cache: redis-cli FLUSHALL (caution!)
```

**Q: Authentication failing**
```
A: 1. Verify OAuth credentials in .env
   2. Check token expiration: jwt decode [token]
   3. Review auth logs for details
   4. Ensure HTTPS (required for OAuth)
```

**See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for more issues**

---

## 📖 Contributing

### Developer Workflow

1. **Read** [AGENTS.md](./AGENTS.md) for standards
2. **Create** feature branch: `git checkout -b feature/your-feature`
3. **Code** with TDD: write tests first
4. **Commit** using [conventional commits](https://www.conventionalcommits.org/)
5. **Push** to GitHub: `git push origin feature/your-feature`
6. **Create PR** with description

### Code Review Process

1. **Automated checks** (CI/CD)
   - ESLint & Prettier formatting
   - TypeScript type checking
   - Unit & integration tests
   
2. **Manual review**
   - Architecture compliance (Architect Agent)
   - Code quality (Builder Agent)
   - Test coverage (Validator Agent)
   - Documentation (Scribe Agent)
   
3. **Merge** when all checks pass + 2 approvals

**See [AGENTS.md #Git Operations](./AGENTS.md#git-operations) for detailed workflow**

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 📞 Support & Contact

### For Issues & Questions

1. **Check documentation** first ([AGENTS.md](./AGENTS.md), [ARCHITECTURE.md](./ARCHITECTURE.md))
2. **Search issues** on GitHub
3. **Create new issue** with clear description
4. **Contact:** engineering@rynocrypto.mining

### For Security Issues

🔐 **DO NOT** open public GitHub issue

Email: security@rynocrypto.mining with details

---

## 🔗 External Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Braiins OS+ API Documentation](https://deepwiki.com/braiins/bos-plus-api)
- [gRPC Node.js Documentation](https://grpc.io/docs/languages/node/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)

---

## 🎯 Project Status

| Component | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| **gRPC Client** | ✅ Implemented | 92% | Connection pooling, retry logic |
| **REST API** | ✅ Implemented | 88% | Full CRUD operations |
| **Authentication** | ✅ Implemented | 91% | OAuth 2.0 + JWT |
| **Caching** | ✅ Implemented | 89% | Redis with TTL management |
| **Firmware Updates** | ✅ Implemented | 85% | Job tracking, rollback |
| **Documentation** | ✅ Complete | — | API docs, deployment guides |
| **Monitoring** | ✅ Implemented | — | Prometheus + Grafana |
| **Testing** | ✅ >85% Coverage | — | Unit, integration, E2E |

---

## 📈 Roadmap

### ✅ Phase 1 (Completed): Foundation
- [x] gRPC client & MCP skeleton
- [x] REST API endpoints
- [x] Authentication & authorization
- [x] Caching layer

### ✅ Phase 2 (Current): Production Readiness
- [x] Firmware update workflow
- [x] Monitoring & alerting
- [x] Comprehensive documentation
- [x] E2E testing & validation

### 🔮 Phase 3 (Future): Enhancements
- [ ] Advanced analytics
- [ ] Predictive maintenance
- [ ] GPU mining support
- [ ] Custom pool integration

---

## 🤝 Acknowledgments

Built with guidance from:
- Braiins team (API design consultation)
- Anthropic (Model Context Protocol)
- Open-source community (npm ecosystem)

---

**Project:** braiins-os-mcp-server  
**Repository:** [GitHub](https://github.com/Ryno-Crypto-Mining-Services/braiins-os-mcp-server)  
**Last Updated:** December 2025  
**Maintained By:** Ryno Crypto Mining Services  

---

**Get started:** `npm install && npm run dev` 🚀
