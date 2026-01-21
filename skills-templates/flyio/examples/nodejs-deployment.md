# Example: Node.js Express API Deployment on Fly.io

This example demonstrates deploying a Node.js Express API to Fly.io with database integration, secrets management, and autoscaling.

## Project Structure

```
my-api/
├── src/
│   ├── index.js
│   ├── routes/
│   └── models/
├── package.json
├── Dockerfile
├── .dockerignore
└── fly.toml
```

## Application Code (src/index.js)

```javascript
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API endpoints
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

## Package.json

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "description": "Example Express API for Fly.io",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["npm", "start"]
```

## .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.*
*.md
.DS_Store
```

## fly.toml Configuration

```toml
app = "my-api"
primary_region = "ord"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  protocol = "tcp"
  internal_port = 8080
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 1

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  # Health check
  [[services.http_checks]]
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "GET"
    path = "/health"

[vm]
  size = "shared-cpu-1x"
  memory_mb = 512

# Autoscaling configuration
[[auto_scale]]
  min_count = 1
  max_count = 10
```

## Deployment Steps

### 1. Create Fly.io App

```bash
cd my-api
fly launch
```

This will:
- Detect Node.js application
- Create `fly.toml` if it doesn't exist
- Prompt for app name and region
- Build Docker image
- Deploy initial version

### 2. Create Postgres Database

```bash
fly postgres create --name my-api-db
```

Choose:
- Region: Same as app (ord)
- VM size: Development (shared-cpu-1x, 256MB)
- Volume size: 10GB

### 3. Attach Database to App

```bash
fly postgres attach --app my-api my-api-db
```

This sets the `DATABASE_URL` secret automatically.

### 4. Set Additional Secrets

```bash
fly secrets set \
  JWT_SECRET=your-secret-key \
  API_KEY=your-api-key
```

### 5. Initialize Database Schema

```bash
fly ssh console --app my-api

# Inside the Machine
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(\`
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
\`).then(() => { console.log('Table created'); process.exit(0); });
"
```

Or use migrations:
```bash
npm install -D db-migrate db-migrate-pg
fly ssh console --app my-api -C "npm run migrate"
```

### 6. Scale Application

```bash
# Scale to 2 Machines for high availability
fly scale count 2 --region ord

# Add Machines in another region
fly scale count 1 --region iad

# Increase resources if needed
fly scale vm shared-cpu-2x --memory 1024
```

### 7. Configure Autoscaling

```bash
fly autoscale set min=1 max=10
```

### 8. Monitor Deployment

```bash
# Check status
fly status

# View logs
fly logs

# Monitor metrics
fly dashboard
```

## Testing

### Local Testing

```bash
# Set environment variables
export DATABASE_URL=postgres://localhost/myapi_dev
export PORT=8080

# Run locally
npm start

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/items
```

### Production Testing

```bash
# Get app URL
fly info

# Test health endpoint
curl https://my-api.fly.dev/health

# Test API
curl https://my-api.fly.dev/api/items

curl -X POST https://my-api.fly.dev/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "This is a test"}'
```

## Updating the Application

```bash
# Make code changes
git add .
git commit -m "Update API endpoints"

# Deploy update
fly deploy

# Monitor deployment
fly logs
```

## Rollback

```bash
# List releases
fly releases

# Rollback to previous version
fly releases rollback
```

## Cost Estimate

**Free Tier Usage:**
- 1 shared-cpu-1x Machine (256MB): FREE
- Postgres: 1 shared-cpu-1x Machine + 10GB volume: FREE
- Outbound data: 100GB/month FREE
- IPv4: Shared (included)

**Scaling Beyond Free Tier:**
- Each additional Machine: ~$5-10/month depending on size
- Additional storage: $0.15/GB/month
- Outbound data: $0.02/GB after free tier

## Troubleshooting

### App Won't Start

```bash
# Check logs
fly logs

# SSH into Machine
fly ssh console

# Verify environment
fly secrets list
```

### Database Connection Issues

```bash
# Check Postgres status
fly status --app my-api-db

# Verify connection string
fly ssh console -C "echo \$DATABASE_URL"

# Test connection manually
fly ssh console
node -e "const {Pool}=require('pg');new Pool({connectionString:process.env.DATABASE_URL}).query('SELECT NOW()').then(r=>console.log(r.rows))"
```

### Performance Issues

```bash
# Check resource usage
fly dashboard

# Increase Machine size
fly scale vm shared-cpu-2x --memory 1024

# Add more Machines
fly scale count 3
```

## Best Practices Applied

1. ✅ **Multi-stage Docker build** - Reduces image size
2. ✅ **Non-root user** - Security best practice
3. ✅ **Health checks** - Automatic recovery
4. ✅ **Secrets management** - No hardcoded credentials
5. ✅ **Connection pooling** - Database efficiency
6. ✅ **Autoscaling** - Cost optimization
7. ✅ **Multi-region** - High availability
8. ✅ **Monitoring** - Observability

## Next Steps

- Add authentication (JWT, OAuth)
- Implement rate limiting
- Set up CI/CD with GitHub Actions
- Add Redis caching
- Configure log aggregation
- Set up alerts and monitoring
- Implement API documentation (Swagger/OpenAPI)
- Add integration tests
