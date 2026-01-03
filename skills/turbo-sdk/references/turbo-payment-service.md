# Turbo Payment Service - Backend Payment Management

**Repository:** [ardriveapp/turbo-payment-service](https://github.com/ardriveapp/turbo-payment-service)
**Language:** TypeScript (99.8%)
**Stars:** 8
**Forks:** 4
**License:** AGPL-3.0 (strong copyleft)
**Purpose:** Backend payment processing and Turbo balance management

---

## Overview

The **Turbo Payment Service** is a production-grade backend system that manages payment processing, cryptocurrency transactions, and Turbo balance accounting for the ArDrive platform. It serves as the payment infrastructure layer for the entire Turbo Upload ecosystem.

---

## Key Features

### Multi-Blockchain Support
- **Ethereum** network integration
- **Solana** network integration
- **Arweave** network integration
- Custom Turbo protocol implementation

### Payment Processing
- Stripe integration for fiat payments
- Cryptocurrency transaction handling
- Programmable fiat top-ups
- Balance management and tracking
- Transaction history and receipts

### Production Infrastructure
- Koa web framework for API routing
- PostgreSQL database with Knex migrations
- Docker containerization support
- Comprehensive testing (unit + integration)
- AWS credential management
- Code quality tools (ESLint, Prettier, Husky)

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js | JavaScript execution environment |
| **Language** | TypeScript (99.8%) | Type-safe development |
| **Web Framework** | Koa | HTTP API routing and middleware |
| **Database** | PostgreSQL | Persistent data storage |
| **Migrations** | Knex | Database schema management |
| **Payment Gateway** | Stripe | Fiat payment processing |
| **Containerization** | Docker | Deployment and dev environment |
| **Testing** | Jest | Unit and integration testing |
| **Linting** | ESLint + Prettier | Code quality and formatting |
| **Git Hooks** | Husky | Pre-commit quality checks |

---

## Local Development Setup

### Prerequisites

```bash
# Required
- yarn (package manager)

# Optional (recommended)
- nvm (Node version management)
- docker (containerization)
- husky (Git hooks)
```

### Initial Setup

**1. Environment Configuration**
```bash
# Copy and configure environment variables
cp .env.sample .env

# Edit .env with your credentials
# For development, set NODE_ENV=test to bypass AWS credential requests
```

**2. Install Dependencies**
```bash
yarn
```

**3. Build Project**
```bash
yarn build
```

**4. Start Database**
```bash
# Launch local PostgreSQL in Docker (port 5432)
yarn db:up
```

**5. Run Migrations**
```bash
# Apply database schema
yarn db:migrate:latest
```

**6. Start Service**
```bash
# Production mode
yarn start

# Development mode with hot-reload (nodemon)
yarn start:watch
```

---

## Database Management

### PostgreSQL via Docker

**Start Database:**
```bash
yarn db:up
# Launches PostgreSQL container on port 5432
```

**Stop and Clean Database:**
```bash
yarn db:down
# Removes container and deletes data volumes
```

**Access Database:**
```bash
# Connect via psql (if installed locally)
psql -h localhost -p 5432 -U postgres -d turbo_payment

# Or use Docker exec
docker exec -it turbo-postgres psql -U postgres -d turbo_payment
```

### Database Migrations

The service uses Knex for schema management with a structured migration workflow.

**Create New Migration:**
```bash
# 1. Add logic to schema.ts
# 2. Generate migration file
yarn db:make:migration MIGRATION_NAME

# 3. Apply migration
yarn db:migrate:latest
```

**Migration Commands:**
```bash
# Apply latest migrations
yarn db:migrate:latest

# Rollback last migration
yarn db:migrate:rollback

# View migration status
yarn db:migrate:status
```

**Migration Best Practices:**
1. Define schema changes in `schema.ts` first
2. Use descriptive migration names (e.g., `add_payment_transactions_table`)
3. Test migrations locally before deploying
4. Always provide rollback logic
5. Never modify existing migrations (create new ones)

---

## Testing

### Test Types

**Unit Tests:**
```bash
yarn test:unit
# Fast, isolated function/module testing
# No external dependencies required
```

**Integration Tests (Local):**
```bash
yarn test:integration:local
# Tests with local Docker PostgreSQL
# Requires yarn db:up first
```

**Integration Tests (Docker):**
```bash
yarn test:docker
# Complete containerized test environment
# Database and service in isolated containers
```

### Targeted Testing

Run specific test suites using `-g` flag:

```bash
# Test specific component
yarn test:integration:local -g 'Router'

# Test specific feature
yarn test:integration:local -g 'Payment Processing'

# Test specific module
yarn test:unit -g 'BalanceService'
```

### Test Coverage

```bash
# Generate coverage report
yarn test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

---

## Docker Deployment

### Complete Dockerized Setup

**Start Everything:**
```bash
yarn start:docker
# Orchestrates service + database in containers
```

**Manual Docker Commands:**

**Option 1: Service + Database in Docker**
```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

**Option 2: Service in Docker + Local PostgreSQL**
```bash
# Build service image
docker build -t turbo-payment-service .

# Run service container (connects to localhost:5432)
docker run -p 3000:3000 \
  --env-file .env \
  --network host \
  turbo-payment-service
```

### Docker Best Practices

- Use `.dockerignore` to exclude unnecessary files
- Multi-stage builds for smaller images
- Environment variables for configuration
- Health checks for container monitoring
- Volume mapping for persistent data
- Network isolation for security

---

## API Architecture

### Koa Web Framework

The service uses Koa for HTTP routing with middleware-based request processing.

**Key Koa Features:**
- Async/await native support
- Middleware composition
- Robust error handling
- Request/response context
- Lightweight and modular

**Typical Request Flow:**
```
Client Request
    ↓
Koa Router (endpoint matching)
    ↓
Authentication Middleware
    ↓
Validation Middleware
    ↓
Business Logic (controllers/services)
    ↓
Database Layer (Knex queries)
    ↓
Response Formatting
    ↓
Client Response
```

### API Endpoints

While specific endpoints aren't detailed in the README, typical payment service endpoints would include:

**Balance Management:**
- `GET /balance/:userId` - Check user balance
- `POST /balance/topup` - Add funds to balance
- `GET /balance/history/:userId` - Transaction history

**Payment Processing:**
- `POST /payments/crypto` - Process cryptocurrency payment
- `POST /payments/stripe` - Process Stripe payment
- `GET /payments/:transactionId` - Get payment status

**Upload Credits:**
- `POST /credits/purchase` - Buy upload credits
- `GET /credits/:userId` - Check available credits
- `POST /credits/consume` - Use credits for upload

*Note: Refer to API documentation for exact endpoints.*

---

## Configuration

### Environment Variables

**Required Variables:**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/turbo_payment

# Node Environment
NODE_ENV=development  # or 'test', 'production'

# API Keys
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AWS (for production credentials)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# Service Configuration
PORT=3000
LOG_LEVEL=info
```

**Development vs Production:**

**Development Mode** (`NODE_ENV=test`):
- Uses local credentials from `.env`
- Bypasses AWS credential requests
- Verbose logging enabled
- Hot-reload with nodemon

**Production Mode** (`NODE_ENV=production`):
- Fetches credentials from AWS
- Minimal logging
- Optimized builds
- Health check endpoints

---

## Payment Integration

### Stripe Integration

**Setup:**
```bash
# Add Stripe API keys to .env
STRIPE_API_KEY=sk_live_xxx  # or sk_test_xxx for testing
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Webhook Handling:**
The service listens for Stripe webhook events to process:
- Payment success confirmations
- Payment failures
- Refund notifications
- Subscription events

**Best Practices:**
- Verify webhook signatures
- Use idempotency keys
- Handle async payment flows
- Log all transactions
- Implement retry logic

### Cryptocurrency Payments

**Supported Networks:**
- Ethereum (ERC-20 tokens)
- Solana (SPL tokens)
- Arweave (AR tokens)

**Payment Flow:**
1. User initiates payment
2. Service generates payment address
3. User sends cryptocurrency
4. Service monitors blockchain
5. Confirms transaction (multiple confirmations)
6. Credits user balance
7. Sends receipt/confirmation

---

## Database Schema

### Core Tables

**Users/Accounts:**
- User identifiers and metadata
- Balance tracking
- Account creation timestamps

**Transactions:**
- Transaction IDs and types
- Payment amounts and currencies
- Status tracking (pending, confirmed, failed)
- Blockchain transaction hashes
- Timestamps and metadata

**Balances:**
- Current user balances
- Currency types
- Last updated timestamps
- Transaction history links

**Payments:**
- Payment method details
- Stripe charge IDs
- Cryptocurrency addresses
- Confirmation counts
- Refund status

---

## Security Considerations

### AGPL-3.0 License

⚠️ **Important**: AGPL-3.0 is a strong copyleft license requiring:
- Source code disclosure for network use
- All modifications must be open-sourced
- Same license for derivative works
- Network interaction triggers copyleft

**Implications:**
- Any service using this code must be open-source
- SaaS deployments require source disclosure
- Fork modifications must be published
- Commercial use requires compliance

### Security Best Practices

**Implemented:**
- Environment variable configuration (no hardcoded secrets)
- AWS credential management for production
- Database password protection
- Stripe webhook signature verification
- Git hooks for pre-commit checks

**Recommended:**
- Rate limiting on API endpoints
- Request validation and sanitization
- SQL injection prevention (Knex handles this)
- HTTPS/TLS for all connections
- Regular dependency updates
- Security audit logging
- Two-factor authentication for admin ops

---

## Testing Best Practices

### Unit Testing Strategy

**What to Test:**
- Business logic functions
- Data validation
- Utility functions
- Error handling

**Example Test Structure:**
```typescript
describe('BalanceService', () => {
  it('should calculate correct balance after topup', () => {
    // Arrange
    const initialBalance = 100;
    const topupAmount = 50;

    // Act
    const newBalance = calculateBalance(initialBalance, topupAmount);

    // Assert
    expect(newBalance).toBe(150);
  });
});
```

### Integration Testing Strategy

**What to Test:**
- API endpoint responses
- Database operations
- External service integrations
- Payment workflows

**Example Test Flow:**
```typescript
describe('Payment API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  it('should process Stripe payment successfully', async () => {
    const response = await request(app)
      .post('/payments/stripe')
      .send({ amount: 1000, currency: 'usd' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });
});
```

---

## Deployment

### Production Deployment Checklist

- [ ] Configure production environment variables
- [ ] Set up AWS credentials securely
- [ ] Configure production database (managed PostgreSQL)
- [ ] Set up Stripe production keys
- [ ] Configure logging and monitoring
- [ ] Set up health check endpoints
- [ ] Configure load balancer
- [ ] Set up SSL/TLS certificates
- [ ] Enable database backups
- [ ] Configure auto-scaling
- [ ] Set up alerting and monitoring
- [ ] Test payment flows end-to-end
- [ ] Verify AGPL-3.0 compliance

### Health Checks

**Endpoint Monitoring:**
```bash
# Service health
curl http://localhost:3000/health

# Database connectivity
curl http://localhost:3000/health/db

# External service status
curl http://localhost:3000/health/stripe
```

**Metrics to Monitor:**
- Request latency
- Error rates
- Database connection pool
- Payment success rates
- Queue depths
- Memory usage
- CPU utilization

---

## Development Workflow

### Git Hooks (Husky)

**Pre-commit:**
- ESLint checks
- Prettier formatting
- TypeScript compilation
- Unit test execution

**Pre-push:**
- Full test suite
- Build verification
- Migration status check

### Code Quality

**Linting:**
```bash
# Run ESLint
yarn lint

# Auto-fix issues
yarn lint:fix
```

**Formatting:**
```bash
# Check formatting
yarn format:check

# Auto-format code
yarn format
```

**Type Checking:**
```bash
# TypeScript compilation check
yarn type-check
```

---

## Common Tasks

### Add New Payment Method

1. Create payment provider interface
2. Implement provider logic
3. Add database migrations for new data
4. Create API endpoints
5. Write unit and integration tests
6. Update documentation
7. Deploy and monitor

### Update Database Schema

1. Modify `schema.ts`
2. Generate migration: `yarn db:make:migration description`
3. Test migration locally
4. Add rollback logic
5. Test rollback
6. Commit migration file
7. Apply to staging/production

### Debug Payment Issues

1. Check service logs
2. Verify database transaction records
3. Check Stripe dashboard (for fiat)
4. Verify blockchain confirmations (for crypto)
5. Review error logs and stack traces
6. Test with reduced scope
7. Fix and redeploy

---

## Repository Statistics

- **Total Commits:** 24 (main branch)
- **Contributors:** 4 active developers
- **Stars:** 8
- **Forks:** 4
- **Watchers:** 4
- **License:** AGPL-3.0
- **Primary Language:** TypeScript (99.8%)
- **Website:** [ardrive.io/turbo](https://ardrive.io/turbo)

---

## Related Services & Tools

**Within Turbo Ecosystem:**
- **turbo-sdk** - TypeScript SDK for uploads
- **turbo-python-sdk** - Python SDK for uploads
- **x402-turbo-upload** - CLI tool for uploads
- **turbo-payment-service** (this service) - Payment backend

**External Dependencies:**
- **Stripe** - Fiat payment processing
- **PostgreSQL** - Database
- **Docker** - Containerization
- **Koa** - Web framework
- **Knex** - Database migrations

---

## Use Cases

### For Backend Developers

**Building with Turbo Payment Service:**
- Integrate payment processing into apps
- Manage user balances programmatically
- Process multi-currency transactions
- Handle cryptocurrency payments
- Implement programmable fiat top-ups

### For ArDrive Platform

**Internal Platform Use:**
- User balance management
- Payment transaction processing
- Stripe integration for fiat
- Cryptocurrency payment handling
- Transaction history and receipts

### For DevOps Teams

**Infrastructure Management:**
- Docker deployment configurations
- Database migration workflows
- Production credential management
- Health monitoring and alerting
- Scaling payment infrastructure

---

## Limitations & Considerations

### AGPL-3.0 License Impact

⚠️ **Commercial Considerations:**
- Network use triggers source disclosure
- Forked services must be open-source
- Not suitable for closed-source SaaS
- Consider alternative license for proprietary use

### Production Requirements

**Not Included (Need External Setup):**
- Load balancing configuration
- Auto-scaling policies
- Advanced monitoring dashboards
- Disaster recovery procedures
- High availability setup
- Geographic replication
- Advanced security features (WAF, DDoS protection)

### Development Limitations

**README Coverage:**
- No detailed API endpoint documentation
- Limited error handling examples
- No performance optimization guidance
- Minimal production deployment details
- No troubleshooting guide

---

## Additional Resources

- **Website:** https://ardrive.io/turbo/
- **Repository:** https://github.com/ardriveapp/turbo-payment-service
- **Main SDK:** https://github.com/ardriveapp/turbo-sdk
- **Contributing:** See CONTRIBUTING.md in repository
- **Code of Conduct:** Contributor Covenant included
- **Issue Tracker:** GitHub Issues

---

**Last Updated:** January 3, 2026
**Document Version:** 1.0
**Source:** GitHub repository and README analysis
