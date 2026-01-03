# Turbo Upload Service - Core Upload Infrastructure

**Repository:** [ardriveapp/turbo-upload-service](https://github.com/ardriveapp/turbo-upload-service)
**Language:** TypeScript (97.9%)
**Stars:** 11
**Forks:** 6
**License:** AGPL-3.0 (strong copyleft)
**Purpose:** Core data bundling and upload infrastructure for Arweave delivery

---

## Overview

The **Turbo Upload Service** is the core infrastructure component that powers the entire Turbo ecosystem. It handles the critical operations of packaging ANS-104 "data items" and reliably delivering them to Arweave's permanent storage network.

**Architectural Philosophy**: Designed for AWS at-scale deployment while maintaining flexibility for smaller Docker-enabled environments through LocalStack and ArLocal integrations.

---

## System Architecture

### Two-Component Design

**1. Upload Service**
- Accepts incoming data uploads
- Supports single-request and multipart upload modes
- HTTP API with comprehensive documentation
- Multi-signature support (Arweave, Ethereum, Solana keys)

**2. Fulfillment Service**
- Asynchronous backend processing
- Reliable Arweave delivery guarantees
- Job queue management via SQS
- Retry and error handling mechanisms

### Supporting Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Database** | PostgreSQL | Data persistence and transaction tracking |
| **Object Storage** | S3 | Chunked upload storage |
| **Job Queues** | SQS | Asynchronous task coordination |
| **Migrations** | Knex | Database schema management |
| **Framework** | Koa | HTTP routing and middleware |

---

## Multi-Chain Signature Support

The service accepts data items signed with:
- **Arweave** private keys (native)
- **Ethereum** private keys (EVM compatible)
- **Solana** private keys (SPL compatible)

This enables cross-blockchain upload workflows and wallet integration flexibility.

---

## Development Environment Setup

### System Requirements

**Required**:
- nvm (Node version management)
- yarn (package manager)
- Docker (containerization)
- AWS CLI (for cloud deployments)

**Optional**:
- husky (Git hooks)
- localstack (local AWS simulation)

### Quick Start with Docker

**1. Configure Wallet**:
```bash
# Edit .env.localstack with your Arweave JWK
# Format: Escaped JSON wallet key
ARWEAVE_WALLET="{\"kty\":\"RSA\",\"n\":\"...\"}"
```

**2. Launch Service**:
```bash
docker compose --env-file ./.env.localstack up upload-service
```

**3. Access Service**:
- Upload Service: `http://localhost:3000`
- API Documentation: `http://localhost:3000/api-docs`

**Important**: Database and queue state persistence is operator responsibility across service runs.

### Local Development Setup

**Step-by-Step Installation**:

```bash
# 1. Environment configuration
cp .env.sample .env
# Edit .env with your values

# 2. Install dependencies
yarn

# 3. Build TypeScript
yarn build

# 4. Database setup
yarn db:up                # Start PostgreSQL container (port 5432)
yarn db:migrate:latest    # Apply all migrations

# 5. Start service
yarn start                # Production mode
yarn start:watch          # Development mode with hot-reload
```

---

## Database Management

### PostgreSQL Operations

**Start/Stop Database**:
```bash
# Launch PostgreSQL container on port 5432
yarn db:up

# Stop and remove container (deletes data volume)
yarn db:down
```

**Migration Management**:
```bash
# View applied migrations
yarn db:migrate:list

# Apply pending migrations
yarn db:migrate:latest

# Create new migration
yarn db:migrate:new MIGRATION_NAME

# Rollback options
yarn db:migrate:rollback          # Revert last migration
yarn db:migrate:rollback --all    # Revert all migrations
yarn db:migrate:down MIGRATION_NAME  # Revert specific migration
```

**Environment-Specific Commands**:
```bash
# Execute against specific environment
yarn dotenv -e .env.dev yarn db:migrate:latest
yarn dotenv -e .env.staging yarn db:up
```

### Migration Workflow

**Creating a Migration**:

1. **Define Schema Changes** in `schema.ts`
2. **Generate Migration File**:
   ```bash
   yarn db:migrate:new add_upload_metadata_table
   ```
3. **Construct Queries** in `src/db/arch/migrator.ts`
4. **Update Generated Migration** with up/down logic
5. **Apply Migration**:
   ```bash
   yarn db:migrate:latest
   ```

**Best Practices**:
- Always provide rollback logic (`down` function)
- Test migrations locally before production
- Never modify existing migrations (create new ones)
- Use descriptive migration names (verb_noun format)
- Document complex migrations with comments

---

## Docker Deployment

### Building Container Images

```bash
# Build with Node version from .nvmrc
docker build \
  --build-arg NODE_VERSION=$(cat .nvmrc | cut -c2-8) \
  --build-arg NODE_VERSION_SHORT=$(cat .nvmrc | cut -c2-3) .
```

### Docker Compose Deployment

**Full Stack** (upload + payment + arlocal + postgres):
```bash
docker compose up -d
```

**Upload Service Only** (with postgres):
```bash
docker compose up upload-service --build
```

**View Logs**:
```bash
docker compose logs -f upload-service
docker compose logs -f fulfillment-service
```

**Stop Services**:
```bash
docker compose down              # Stop containers
docker compose down -v           # Stop and remove volumes
```

---

## Testing Strategy

### Test Suite Organization

**Unit Tests** - Fast, isolated function testing:
```bash
yarn test:unit
```

**Integration Tests (Local)** - Tests against local containers:
```bash
yarn test:integration:local
```

**Integration Tests (Docker)** - Isolated container execution (recommended):
```bash
yarn test:docker
```

**Full Test Suite** - Unit + integration against postgres and arlocal:
```bash
yarn test:local
```

### Targeted Testing

**Run specific test suites** using `-g` flag:
```bash
# Test Router module only
yarn test:integration:local -g "Router"

# Test Upload endpoints
yarn test:integration:local -g "Upload"

# Test Payment flow
yarn test:integration:local -g "Payment"
```

### Continuous Testing

**Watch mode for targeted tests**:
```bash
# Run Router tests every 30 seconds
watch -n 30 'yarn test:integration:local -g "Router"'

# Useful for TDD workflows
```

---

## Configuration Management

### Environment Variables

**Required Variables**:
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/turbo_upload

# Node Environment
NODE_ENV=development  # or 'production'

# Arweave Wallet (escaped JSON)
ARWEAVE_WALLET="{\"kty\":\"RSA\",\"n\":\"...\",\"e\":\"AQAB\",...}"

# AWS Configuration (for production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# S3 Storage
S3_BUCKET_NAME=turbo-uploads
S3_ENDPOINT=http://localhost:4566  # LocalStack for local dev

# SQS Queues
SQS_QUEUE_URL=http://localhost:4566/000000000000/turbo-queue

# Service Configuration
PORT=3000
LOG_LEVEL=info
```

**Development vs Production**:

| Environment | Configuration | Purpose |
|-------------|---------------|---------|
| **Development** | `.env` file, LocalStack | Local testing with AWS simulation |
| **Staging** | `.env.staging` file | Pre-production validation |
| **Production** | AWS Parameter Store/Secrets Manager | Secure credential management |

### LocalStack Configuration

For local AWS service simulation:
```bash
# .env.localstack
AWS_ENDPOINT=http://localhost:4566
S3_ENDPOINT=http://localhost:4566
SQS_ENDPOINT=http://localhost:4566
DYNAMODB_ENDPOINT=http://localhost:4566
```

---

## API Endpoints

### Upload Service HTTP Routes

**Documentation**: Access `/api-docs` endpoint when service is running for comprehensive Swagger/OpenAPI documentation.

**Common Endpoints** (inferred from typical upload service patterns):

**Upload Operations**:
- `POST /upload` - Single-file upload
- `POST /upload/multipart` - Multipart upload initialization
- `PUT /upload/multipart/:id/part` - Upload part chunk
- `POST /upload/multipart/:id/complete` - Complete multipart upload

**Status & Monitoring**:
- `GET /health` - Service health check
- `GET /status/:txId` - Upload transaction status
- `GET /metrics` - Service metrics

**Note**: Refer to `/api-docs` endpoint for complete, current API specification.

---

## Deployment Considerations

### AWS Production Deployment

**Infrastructure Requirements**:
- RDS PostgreSQL instance (Multi-AZ recommended)
- S3 bucket for upload storage (versioning enabled)
- SQS queues for job processing
- EC2/ECS/Fargate for service hosting
- Application Load Balancer for routing
- CloudWatch for logging and monitoring

**Deployment Checklist**:
- [ ] Database migrations applied to production RDS
- [ ] Environment variables configured in secure store
- [ ] S3 bucket created with appropriate permissions
- [ ] SQS queues configured with dead-letter queues
- [ ] Load balancer health checks configured
- [ ] CloudWatch alarms for critical metrics
- [ ] Backup and disaster recovery procedures tested
- [ ] Auto-scaling policies configured
- [ ] SSL/TLS certificates installed

### Security Best Practices

**Implemented**:
- Environment variable configuration (no hardcoded secrets)
- Secure wallet key storage (never in version control)
- Database password protection
- AWS credential management
- Knex query parameterization (SQL injection prevention)

**Recommended**:
- Rate limiting on upload endpoints
- Request size validation
- Virus scanning for uploaded files
- DDoS protection via AWS Shield
- WAF rules for common attack patterns
- Audit logging for all uploads
- Regular security vulnerability scans

---

## Integration with Turbo Ecosystem

### Service Interactions

```
Client Upload Request
    ↓
turbo-sdk (client SDK)
    ↓
turbo-upload-service (this service)
    ↓ ┌─────────────────────────┐
    ├─→ Upload Service (HTTP API)
    │     ↓
    │   S3 Storage (chunks)
    │     ↓
    │   SQS Queue (job submission)
    │     ↓
    └─→ Fulfillment Service (async)
          ↓
        Arweave Network (permanent storage)
          ↓
        Transaction Confirmation
```

### Payment Integration

Works with **turbo-payment-service** to:
- Validate user balance before upload
- Deduct credits after successful upload
- Handle cryptocurrency and fiat payments
- Provide transaction receipts

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js | JavaScript execution environment |
| **Language** | TypeScript (97.9%) | Type-safe development |
| **Web Framework** | Koa | HTTP routing and middleware |
| **Database** | PostgreSQL | Persistent data storage |
| **Migrations** | Knex | Schema versioning |
| **Object Storage** | S3 | Upload chunk storage |
| **Job Queues** | SQS | Async task management |
| **Containerization** | Docker | Local dev and deployment |
| **AWS Simulation** | LocalStack | Local cloud environment |
| **Linting** | ESLint + Prettier | Code quality |
| **Git Hooks** | Husky | Pre-commit validation |

---

## Repository Statistics

- **Total Commits**: Not specified
- **Contributors**: Not specified in README
- **Stars**: 11
- **Forks**: 6
- **Watchers**: Not specified
- **License**: AGPL-3.0
- **Primary Language**: TypeScript (97.9%)
- **Website**: [ardrive.io/turbo](https://ardrive.io/turbo)

---

## AGPL-3.0 License Implications

⚠️ **Critical for Commercial Use**:

**License Requirements**:
- Source code disclosure for network-accessible deployments
- All modifications must be open-sourced
- Derivative works must use same license
- SaaS deployments trigger copyleft obligations

**Implications**:
- Not suitable for proprietary cloud services without compliance
- Forked services must publish source code
- Network use = distribution (unlike Apache 2.0)
- Commercial SaaS requires legal review

**Compliance Options**:
1. Open-source your deployment
2. Seek commercial licensing from ArDrive
3. Use turbo-sdk (Apache 2.0) for client integration only

---

## Common Operational Tasks

### Starting the Service

**Local Development**:
```bash
# 1. Start database
yarn db:up

# 2. Apply migrations
yarn db:migrate:latest

# 3. Start service with hot-reload
yarn start:watch
```

**Docker Production**:
```bash
# Full production stack
docker compose -f docker-compose.prod.yml up -d
```

### Database Maintenance

**Check Migration Status**:
```bash
yarn db:migrate:list
```

**Apply New Migrations**:
```bash
yarn db:migrate:latest
```

**Rollback Failed Migration**:
```bash
yarn db:migrate:rollback
```

**Backup Database** (local):
```bash
docker exec postgres-container pg_dump -U postgres turbo_upload > backup.sql
```

### Troubleshooting Upload Issues

1. **Check service logs**:
   ```bash
   docker compose logs -f upload-service
   ```

2. **Verify database connectivity**:
   ```bash
   docker exec upload-service yarn db:migrate:list
   ```

3. **Check S3 bucket permissions**:
   ```bash
   aws s3 ls s3://turbo-uploads/
   ```

4. **Monitor SQS queue depth**:
   ```bash
   aws sqs get-queue-attributes --queue-url $SQS_QUEUE_URL
   ```

5. **Review API documentation**:
   ```
   http://localhost:3000/api-docs
   ```

---

## Related Services & Tools

**Within Turbo Ecosystem**:
- **turbo-sdk** - TypeScript client SDK for uploads
- **turbo-python-sdk** - Python client SDK
- **turbo-payment-service** - Payment processing backend
- **x402-turbo-upload** - Minimal CLI tool
- **turbo-upload-service** (this service) - Core upload infrastructure

**External Dependencies**:
- **Arweave** - Permanent storage network
- **PostgreSQL** - Database
- **AWS S3** - Object storage
- **AWS SQS** - Job queues
- **Docker** - Containerization
- **LocalStack** - Local AWS simulation

---

## Use Cases

### For Platform Operators

**Running Your Own Turbo Infrastructure**:
- Deploy on AWS for scalable upload service
- Integrate with custom payment systems
- White-label upload infrastructure
- Multi-tenant upload platforms
- Enterprise Arweave integration

### For DevOps Teams

**Infrastructure Management**:
- Docker-based deployments
- Database migration workflows
- Multi-environment configuration
- Monitoring and alerting setup
- Scaling upload infrastructure

### For Backend Developers

**Service Integration**:
- Understanding upload service architecture
- Building custom upload clients
- Integrating payment systems
- Implementing retry logic
- Monitoring upload reliability

---

## Limitations & Considerations

### AGPL-3.0 License Impact

⚠️ **Commercial Deployment Restrictions**:
- Closed-source SaaS deployments not permitted without compliance
- All network-accessible modifications must be open-sourced
- Consider license implications before cloud deployment

### Production Requirements

**Not Included (External Setup Required)**:
- AWS infrastructure provisioning
- Load balancing configuration
- Auto-scaling policies
- Advanced monitoring dashboards
- Disaster recovery procedures
- Geographic replication
- CDN integration for global uploads

### Operational Responsibility

**Operators Must Manage**:
- Database state persistence across restarts
- Queue state management
- S3 bucket lifecycle policies
- Log rotation and retention
- Backup and restore procedures
- Security updates and patches

---

## Additional Resources

- **Website**: https://ardrive.io/turbo/
- **Repository**: https://github.com/ardriveapp/turbo-upload-service
- **Client SDK**: https://github.com/ardriveapp/turbo-sdk
- **Payment Service**: https://github.com/ardriveapp/turbo-payment-service
- **Knex Documentation**: http://knexjs.org/
- **Koa Framework**: https://koajs.com/
- **Arweave Docs**: https://docs.arweave.org/

---

**Last Updated**: January 3, 2026
**Document Version**: 1.0
**Source**: GitHub repository and README analysis

**Key Architecture**: Two-component system (Upload + Fulfillment)
**Deployment**: AWS-optimized with Docker support
**License**: AGPL-3.0 (strong copyleft - review implications)
