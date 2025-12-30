# ============================================================
# braiins-os-mcp-server - Multi-Stage Production Dockerfile
# ============================================================
# Stage 1: Dependencies
# Stage 2: Build
# Stage 3: Production runtime
# ============================================================

# ==================== Stage 1: Dependencies ====================
FROM node:25-alpine AS deps

# Install build dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --include=dev

# ==================== Stage 2: Build ====================
FROM node:25-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate protocol buffer types (if proto files exist)
RUN if [ -d "proto" ] && [ "$(ls -A proto)" ]; then \
      npm run proto:generate || true; \
    fi

# Build TypeScript
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --production

# ==================== Stage 3: Production Runtime ====================
FROM node:25-alpine AS runner

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 mcp

WORKDIR /app

# Copy built application
COPY --from=builder --chown=mcp:nodejs /app/dist ./dist
COPY --from=builder --chown=mcp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mcp:nodejs /app/package.json ./

# Create logs directory
RUN mkdir -p logs && chown mcp:nodejs logs

# Switch to non-root user
USER mcp

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the server
CMD ["node", "dist/index.js"]

# ==================== Labels ====================
LABEL org.opencontainers.image.title="braiins-os-mcp-server"
LABEL org.opencontainers.image.description="MCP server for Braiins OS+ miner management"
LABEL org.opencontainers.image.vendor="Ryno Crypto Mining Services"
LABEL org.opencontainers.image.version="0.1.0"
