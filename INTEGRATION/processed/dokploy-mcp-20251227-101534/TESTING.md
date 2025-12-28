# Testing Strategy: Dokploy MCP Skill

## Test Scenarios

### Scenario 1: Happy Path - Complete Application Deployment

**Input**:
```
User: "Deploy my Express API from GitHub to Dokploy production"
Repository: https://github.com/test/express-api
Branch: main
Environment: production
```

**Expected**:
1. Project created with production environment
2. Application created and linked to GitHub
3. Build type configured (Dockerfile detected)
4. Environment variables set
5. Deployment initiated
6. Domain configured with SSL
7. Status = "done"

**Pass Criteria**:
- All MCP tools execute without errors
- Application status transitions: idle → running → done
- Domain resolves correctly
- SSL certificate provisioned
- Application accessible via HTTPS

---

### Scenario 2: Edge Case - Multi-Environment Duplication

**Input**:
```
User: "Clone production environment to create staging-v2 with all 5 services"
Source: production (3 apps, 2 databases)
Target: staging-v2
Include all services: Yes
```

**Expected**:
1. Source environment analyzed
2. All services (apps + databases) identified
3. New environment created
4. Services duplicated with new IDs
5. Environment variables updated for staging context
6. Domains reconfigured (.staging-v2.example.com)

**Pass Criteria**:
- All 5 services cloned successfully
- No ID conflicts between source and target
- Environment variables properly scoped to staging
- Domains use staging subdomain pattern
- Source environment remains unchanged

---

### Scenario 3: Error Handling - Missing Environment Variables

**Input**:
```
User: "Deploy my app"
Application: Node.js API
Missing: DATABASE_URL in environment configuration
```

**Expected**:
1. Skill detects missing required variable
2. Warns user before deployment
3. Asks for DATABASE_URL value
4. Updates configuration
5. Proceeds with deployment

**Pass Criteria**:
- Skill identifies missing variable before deploy
- Clear error message to user
- Graceful recovery after providing variable
- Deployment succeeds after fix

---

### Scenario 4: Error Recovery - Stuck Deployment

**Input**:
```
User: "My deployment is stuck at 'running' for 20 minutes"
Application ID: app_stuck_123
Status: running (expected: done)
```

**Expected**:
1. Skill checks application status
2. Identifies stuck deployment
3. Cancels deployment
4. Cleans deployment queues
5. Investigates root cause (checks logs, config)
6. Suggests fixes
7. Redeploys with corrections

**Pass Criteria**:
- Deployment successfully cancelled
- Queues cleaned
- Root cause identified (e.g., missing env var, wrong port)
- Redeployment succeeds
- Final status = "done"

---

### Scenario 5: Database Provisioning with High Availability

**Input**:
```
User: "Create PostgreSQL 16 database with 3 replicas and external access"
Environment: production
Replicas: 3
External Port: 5432
```

**Expected**:
1. PostgreSQL database created
2. Performance tuning applied
3. Replica count set to 3
4. Resource limits configured
5. External port exposed
6. Deployment successful
7. All replicas healthy

**Pass Criteria**:
- Database status = "done"
- 3 replicas running
- External port accessible
- Health checks passing on all replicas
- Replication lag <100ms

---

## Manual Testing Checklist

### Prerequisites
- [ ] Dokploy server accessible
- [ ] `DOKPLOY_URL` environment variable set
- [ ] `DOKPLOY_API_KEY` environment variable set
- [ ] MCP server `@ahdev/dokploy-mcp` installed
- [ ] Test GitHub repository available

### Project Management Tests
- [ ] Create new project
- [ ] List all projects
- [ ] Retrieve specific project by ID
- [ ] Update project configuration
- [ ] Duplicate project/environment
- [ ] Delete project

### Application Deployment Tests
- [ ] Create application
- [ ] Configure GitHub provider
- [ ] Configure GitLab provider
- [ ] Configure Docker provider
- [ ] Set build type (Dockerfile)
- [ ] Set build type (Nixpacks)
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Check deployment status
- [ ] Monitor application metrics
- [ ] Redeploy application
- [ ] Stop application
- [ ] Start application
- [ ] Delete application

### Database Management Tests
- [ ] Create PostgreSQL database
- [ ] Configure database environment
- [ ] Set external port
- [ ] Deploy database
- [ ] Check database status
- [ ] Update resource limits
- [ ] Configure replicas
- [ ] Stop database
- [ ] Start database
- [ ] Delete database

### Domain & Networking Tests
- [ ] Validate domain DNS
- [ ] Create domain with Let's Encrypt SSL
- [ ] Update domain configuration
- [ ] Delete domain
- [ ] Test domain accessibility
- [ ] Verify SSL certificate

### Error Handling Tests
- [ ] Handle missing environment variables
- [ ] Handle invalid Git repository
- [ ] Handle deployment timeout
- [ ] Cancel stuck deployment
- [ ] Clean deployment queues
- [ ] Recover from build failure
- [ ] Handle DNS validation failure

### Performance Tests
- [ ] Simple deployment completes <5 minutes
- [ ] Complex deployment completes <10 minutes
- [ ] Database provisioning completes <3 minutes
- [ ] Domain SSL provisioning completes <2 minutes
- [ ] Multi-environment duplication completes <8 minutes

## Automated Testing

### Unit Tests (Tool Invocation)

```javascript
describe("Dokploy MCP Skill - Tool Invocation", () => {
  test("project-create returns valid project object", async () => {
    const result = await use_mcp_tool({
      server_name: "dokploy-mcp",
      tool_name: "project-create",
      arguments: {
        name: "test-project",
        description: "Test project for automated testing"
      }
    });

    expect(result).toHaveProperty("projectId");
    expect(result).toHaveProperty("environmentId");
    expect(result.name).toBe("test-project");
  });

  test("application-deploy initiates deployment", async () => {
    const result = await use_mcp_tool({
      server_name: "dokploy-mcp",
      tool_name: "application-deploy",
      arguments: {
        applicationId: "app_test_123",
        title: "Test deployment"
      }
    });

    expect(result.applicationStatus).toBe("running");
  });

  test("domain-validateDomain checks DNS", async () => {
    const result = await use_mcp_tool({
      server_name: "dokploy-mcp",
      tool_name: "domain-validateDomain",
      arguments: {
        domain: "test.example.com",
        serverIp: "203.0.113.42"
      }
    });

    expect(result).toHaveProperty("valid");
  });
});
```

### Integration Tests (Workflow)

```javascript
describe("Dokploy MCP Skill - Workflows", () => {
  test("complete deployment workflow", async () => {
    // 1. Create project
    const project = await createProject("integration-test");
    expect(project.projectId).toBeDefined();

    // 2. Create application
    const app = await createApplication(project.environmentId, "test-app");
    expect(app.applicationId).toBeDefined();

    // 3. Configure Git
    await configureGitHub(app.applicationId, "test/repo", "main");

    // 4. Deploy
    const deployment = await deployApplication(app.applicationId);
    expect(deployment.applicationStatus).toBe("running");

    // 5. Wait for completion
    const finalStatus = await waitForDeployment(app.applicationId, 300000);
    expect(finalStatus).toBe("done");

    // Cleanup
    await deleteApplication(app.applicationId);
    await deleteProject(project.projectId);
  });

  test("database provisioning with app integration", async () => {
    const project = await createProject("db-test");
    const db = await createPostgres(project.environmentId, "test-db");

    await deployDatabase(db.postgresId);

    const app = await createApplication(project.environmentId, "app-with-db");
    await configureEnvironment(app.applicationId, {
      DATABASE_URL: `postgresql://user:pass@${db.appName}:5432/testdb`
    });

    const deployment = await deployApplication(app.applicationId);
    const finalStatus = await waitForDeployment(app.applicationId, 300000);

    expect(finalStatus).toBe("done");

    // Cleanup
    await deleteApplication(app.applicationId);
    await deleteDatabase(db.postgresId);
    await deleteProject(project.projectId);
  });
});
```

### Smoke Tests (Quick Validation)

```bash
#!/bin/bash
# smoke-test.sh - Quick validation of Dokploy MCP skill

echo "🔍 Dokploy MCP Skill Smoke Tests"

# Test 1: Environment variables
echo "Testing environment variables..."
if [ -z "$DOKPLOY_URL" ]; then
  echo "❌ DOKPLOY_URL not set"
  exit 1
fi
if [ -z "$DOKPLOY_API_KEY" ]; then
  echo "❌ DOKPLOY_API_KEY not set"
  exit 1
fi
echo "✅ Environment variables configured"

# Test 2: API connectivity
echo "Testing Dokploy API connectivity..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $DOKPLOY_API_KEY" \
  "$DOKPLOY_URL/health")

if [ "$STATUS" -eq 200 ]; then
  echo "✅ API connectivity verified"
else
  echo "❌ API returned status $STATUS"
  exit 1
fi

# Test 3: MCP server availability
echo "Testing MCP server..."
npx -y @ahdev/dokploy-mcp --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ MCP server available"
else
  echo "❌ MCP server not found"
  exit 1
fi

echo ""
echo "✅ All smoke tests passed!"
```

## Test Data Management

### Test Project Structure
```
test-projects/
├── simple-node-app/
│   ├── package.json
│   ├── Dockerfile
│   └── src/index.js
├── react-spa/
│   ├── package.json
│   ├── vite.config.js
│   └── src/App.tsx
└── python-api/
    ├── requirements.txt
    ├── Dockerfile
    └── main.py
```

### Cleanup Script
```javascript
// cleanup-test-resources.js
async function cleanupTestResources() {
  const projects = await use_mcp_tool({
    server_name: "dokploy-mcp",
    tool_name: "project-all"
  });

  // Delete all test projects (prefixed with "test-" or "integration-")
  for (const project of projects) {
    if (project.name.startsWith("test-") ||
        project.name.startsWith("integration-")) {
      console.log(`Deleting test project: ${project.name}`);
      await use_mcp_tool({
        server_name: "dokploy-mcp",
        tool_name: "project-remove",
        arguments: { projectId: project.projectId }
      });
    }
  }

  console.log("✅ Test resources cleaned up");
}
```

## Performance Benchmarks

| Operation | Target | Acceptable | Unacceptable |
|-----------|--------|------------|--------------|
| Project creation | <2s | <5s | >10s |
| Application creation | <3s | <8s | >15s |
| Simple deployment (Nixpacks) | <3min | <5min | >10min |
| Complex deployment (Dockerfile) | <5min | <8min | >15min |
| Database provisioning | <2min | <4min | >8min |
| Domain SSL provisioning | <1min | <3min | >5min |
| Environment duplication | <5min | <10min | >20min |

## Security Testing

### Security Checklist
- [ ] API keys never logged or exposed
- [ ] Passwords generated with sufficient entropy (≥20 chars)
- [ ] HTTPS enforced for all public domains
- [ ] Database passwords stored as environment variables
- [ ] External ports restricted by firewall rules
- [ ] Git provider tokens have minimum required scopes
- [ ] Secrets not committed to repositories
- [ ] SSL certificates auto-renewed

### Penetration Testing Scenarios
1. Attempt deployment without authentication
2. Try to access other users' projects
3. Test SQL injection in database names
4. Verify environment variable isolation between projects
5. Check for exposed secrets in logs
6. Test rate limiting on API endpoints

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Dokploy MCP Skill

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run smoke tests
        env:
          DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
          DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
        run: ./smoke-test.sh

      - name: Run unit tests
        run: npm test

      - name: Run integration tests
        env:
          DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
          DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
        run: npm run test:integration

      - name: Cleanup test resources
        if: always()
        run: node cleanup-test-resources.js
```

## Test Reporting

Generate test reports with:
- Code coverage (target: >80%)
- Test execution time
- Success/failure rates
- Performance metrics
- Security scan results

Example report format:
```
╔═══════════════════════════════════════════════════╗
║     DOKPLOY MCP SKILL TEST REPORT                 ║
╚═══════════════════════════════════════════════════╝

Test Summary:
  Total Tests: 47
  Passed: 45 ✅
  Failed: 2 ❌
  Skipped: 0

Coverage:
  Statements: 87.3%
  Branches: 82.1%
  Functions: 91.4%
  Lines: 86.9%

Performance:
  Average deployment time: 4m 32s
  95th percentile: 7m 15s
  Fastest deployment: 2m 18s

Security:
  Vulnerabilities found: 0 ✅
  API keys exposed: 0 ✅
  Insecure configurations: 0 ✅

Failed Tests:
  1. Domain SSL provisioning (Let's Encrypt rate limit)
  2. Multi-replica database (timeout waiting for replication)

Recommendations:
  • Increase timeout for replica synchronization tests
  • Use staging SSL certificates for testing
```
