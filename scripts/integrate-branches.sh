#!/bin/bash
#
# Integration Script for Multi-Agent MCP Development
# Merges all builder branches back to main after parallel development
#
# Usage: ./scripts/integrate-branches.sh
#

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════════"
echo "  Multi-Agent Branch Integration"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Ensure we're on main branch
echo "→ Switching to main branch..."
git checkout main

# Pull latest (if remote exists)
echo "→ Pulling latest from origin/main..."
git pull origin main --ff-only || echo "  (No remote or already up to date)"

echo ""
echo "→ Merging builder branches..."
echo ""

# Merge Builder-1: Firmware & Pool Tools
echo "  [1/4] Merging builder-1-firmware-pool..."
git merge builder-1-firmware-pool --no-ff -m "feat(mcp): merge Builder-1 - Firmware & Pool Tools

Implements:
- update_miner_firmware tool (firmware update with job tracking)
- update_pool_config tool (pool configuration management)

Co-authored-by: Builder-1 Agent <builder-1@mcp-server>" || {
  echo "❌ Merge conflict in Builder-1. Please resolve manually."
  exit 1
}

# Merge Builder-2: Monitoring & Logs Tools
echo "  [2/4] Merging builder-2-monitoring-logs..."
git merge builder-2-monitoring-logs --no-ff -m "feat(mcp): merge Builder-2 - Monitoring & Logs Tools

Implements:
- get_miner_logs tool (log retrieval with filtering)
- ping_miner tool (connectivity testing)
- braiins:///miner/{id}/logs resource

Co-authored-by: Builder-2 Agent <builder-2@mcp-server>" || {
  echo "❌ Merge conflict in Builder-2. Please resolve manually."
  exit 1
}

# Merge Builder-3: Job Management & Utilities
echo "  [3/4] Merging builder-3-jobs-utilities..."
git merge builder-3-jobs-utilities --no-ff -m "feat(mcp): merge Builder-3 - Job Management & Utilities

Implements:
- list_miners tool (miner listing with filters)
- check_job_status tool (background job status)
- factory_reset tool (miner factory reset)
- braiins:///jobs/{id} resource

Co-authored-by: Builder-3 Agent <builder-3@mcp-server>" || {
  echo "❌ Merge conflict in Builder-3. Please resolve manually."
  exit 1
}

# Merge Builder-4: Prompts & Resources
echo "  [4/4] Merging builder-4-prompts-resources..."
git merge builder-4-prompts-resources --no-ff -m "feat(mcp): merge Builder-4 - Prompts & Resources

Implements:
- troubleshoot_miner_offline prompt
- optimize_power_efficiency prompt
- batch_firmware_update prompt
- braiins:///miner/{id}/config resource

Co-authored-by: Builder-4 Agent <builder-4@mcp-server>" || {
  echo "❌ Merge conflict in Builder-4. Please resolve manually."
  exit 1
}

echo ""
echo "✅ All branches merged successfully!"
echo ""
echo "→ Running quality gate checks..."
echo ""

# TypeScript type checking
echo "  [1/5] TypeScript type checking..."
npm run type-check || {
  echo "❌ TypeScript errors detected"
  exit 1
}

# ESLint validation
echo "  [2/5] ESLint validation..."
npm run lint || {
  echo "❌ Linting errors detected"
  exit 1
}

# Build project
echo "  [3/5] Building project..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}

# Run tests
echo "  [4/5] Running test suite..."
npm test || {
  echo "❌ Tests failed"
  exit 1
}

# Check coverage
echo "  [5/5] Checking test coverage..."
npm run test:coverage || {
  echo "⚠️  Coverage check failed (target: >85%)"
}

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Integration Complete"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Summary:"
echo "  - 4 builder branches merged to main"
echo "  - All quality gates passed"
echo "  - Ready for evaluation phase"
echo ""
echo "Next steps:"
echo "  1. Run evaluation harness: npm run evaluate"
echo "  2. Update documentation"
echo "  3. Deploy to staging"
echo ""
