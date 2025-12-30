# Braiins OS MCP Server API Documentation

**Version:** 1.0.0
**Last Updated:** December 2025
**Protocol:** Model Context Protocol (MCP)

---

## Table of Contents

1. [Overview](#overview)
2. [MCP Tools](#mcp-tools)
3. [MCP Resources](#mcp-resources)
4. [MCP Prompts](#mcp-prompts)
5. [Error Handling](#error-handling)
6. [Usage Examples](#usage-examples)

---

## Overview

The Braiins OS MCP Server provides AI agents with safe, structured access to Braiins OS ASIC miners through the Model Context Protocol. This document describes all available tools, resources, and prompts.

### Design Principles

- **Agent-Centric**: Responses optimized for AI agent consumption (concise by default)
- **Batch Operations**: Most tools support multiple miners for efficiency
- **Background Jobs**: Long operations return job IDs for async tracking
- **Actionable Errors**: Error messages include remediation suggestions
- **Caching**: Frequently accessed data cached with appropriate TTLs

---

## MCP Tools

### 1. register_miner

**Description**: Register a new miner for management by the MCP server.

**Input Schema**:
```typescript
{
  id: string;           // Unique miner identifier
  name: string;         // Human-readable name
  host: string;         // IP address or hostname
  port?: number;        // gRPC port (default: 50051)
  username?: string;    // Authentication username
  password?: string;    // Authentication password
}
```

**Returns**:
```typescript
{
  success: boolean;
  minerId: string;
  message: string;
}
```

**Example Usage**:
```json
{
  "id": "miner-001",
  "name": "Antminer S19 Pro #1",
  "host": "192.168.1.100",
  "username": "root",
  "password": "admin"
}
```

**Errors**:
- `MINER_ALREADY_REGISTERED`: Miner ID already exists
- `INVALID_HOST`: Cannot resolve host address
- `CONNECTION_FAILED`: Cannot connect to miner

---

### 2. unregister_miner

**Description**: Remove a miner from management.

**Input Schema**:
```typescript
{
  minerId: string;      // Miner ID to unregister
  force?: boolean;      // Force removal even if unreachable (default: false)
}
```

**Returns**:
```typescript
{
  success: boolean;
  message: string;
}
```

**Example Usage**:
```json
{
  "minerId": "miner-001",
  "force": false
}
```

---

### 3. list_miners

**Description**: List all registered miners with optional filtering and pagination.

**Input Schema**:
```typescript
{
  filter?: {
    status?: 'online' | 'offline' | 'all';  // Filter by status (default: 'all')
    search?: string;                         // Search by name or ID
  };
  pagination?: {
    page?: number;      // Page number (default: 1)
    limit?: number;     // Results per page (default: 50, max: 100)
  };
}
```

**Returns**:
```typescript
{
  miners: Array<{
    id: string;
    name: string;
    host: string;
    online: boolean;
    lastSeen: string;   // ISO 8601 timestamp
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**Example Usage**:
```json
{
  "filter": { "status": "online" },
  "pagination": { "page": 1, "limit": 20 }
}
```

---

### 4. get_miner_status

**Description**: Get comprehensive status for one or more miners.

**Input Schema**:
```typescript
{
  minerId: string | string[];     // Single miner or array of miner IDs
  refresh?: boolean;              // Bypass cache (default: false)
  detailLevel?: 'concise' | 'verbose';  // Response detail (default: 'concise')
}
```

**Returns (Concise)**:
```typescript
{
  minerId: string;
  status: 'online' | 'offline' | 'error';
  hashrate: string;      // e.g., "95 TH/s"
  temperature: string;   // e.g., "65°C"
  uptime: string;        // e.g., "7d 3h 15m"
  issues: string[];      // Array of warning/error messages
}
```

**Returns (Verbose)**:
```typescript
{
  minerId: string;
  status: 'online' | 'offline' | 'error';
  hardware: {
    model: string;
    serialNumber: string;
    firmwareVersion: string;
  };
  hashrate: {
    current: string;
    average24h: string;
    peak: string;
  };
  temperature: {
    current: number;
    average: number;
    limit: number;
    sensors: Array<{ name: string; temp: number }>;
  };
  pools: Array<{
    url: string;
    user: string;
    active: boolean;
    acceptedShares: number;
    rejectedShares: number;
  }>;
  uptime: {
    seconds: number;
    formatted: string;
  };
  issues: Array<{
    severity: 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
  }>;
}
```

**Example Usage**:
```json
{
  "minerId": ["miner-001", "miner-002"],
  "detailLevel": "concise"
}
```

---

### 5. get_miner_info

**Description**: Get miner hardware and firmware information.

**Input Schema**:
```typescript
{
  minerId: string;
}
```

**Returns**:
```typescript
{
  uid: string;
  serialNumber: string;
  hostname: string;
  macAddress: string;
  platform: string;
  firmwareVersion: {
    current: string;
    major: number;
    minor: number;
    patch: number;
  };
  hardware: {
    brand: string;
    model: string;
    chipType: string;
    chipCount: number;
  };
}
```

---

### 6. get_miner_logs

**Description**: Retrieve miner logs with optional filtering.

**Input Schema**:
```typescript
{
  minerId: string;
  level?: 'debug' | 'info' | 'warning' | 'error';  // Minimum log level
  lines?: number;        // Number of recent lines (default: 100, max: 1000)
  search?: string;       // Filter logs by keyword
}
```

**Returns**:
```typescript
{
  minerId: string;
  logs: Array<{
    timestamp: string;   // ISO 8601
    level: string;
    message: string;
  }>;
  totalLines: number;
  filtered: boolean;
}
```

---

### 7. get_fleet_status

**Description**: Get aggregated metrics for all managed miners.

**Input Schema**:
```typescript
{
  refresh?: boolean;     // Bypass cache (default: false)
}
```

**Returns**:
```typescript
{
  totalMiners: number;
  onlineMiners: number;
  offlineMiners: number;
  totalHashrate: string;        // e.g., "2.5 PH/s"
  averageTemperature: string;   // e.g., "65°C"
  totalPowerConsumption: string; // e.g., "32.5 kW"
  activeAlerts: number;
  lastUpdated: string;          // ISO 8601 timestamp
}
```

---

### 8. ping_miner

**Description**: Test connectivity to a miner.

**Input Schema**:
```typescript
{
  minerId: string;
  timeout?: number;      // Timeout in milliseconds (default: 5000)
}
```

**Returns**:
```typescript
{
  minerId: string;
  reachable: boolean;
  latency?: string;      // e.g., "45ms" (if reachable)
  error?: {
    code: string;
    message: string;
    suggestions: string[];
  };
}
```

---

### 9. reboot_miner

**Description**: Gracefully reboot a miner.

**Input Schema**:
```typescript
{
  minerId: string;
  force?: boolean;       // Force reboot without graceful shutdown (default: false)
}
```

**Returns**:
```typescript
{
  success: boolean;
  minerId: string;
  message: string;
  estimatedDowntime: string;  // e.g., "3-5 minutes"
}
```

---

### 10. set_power_target

**Description**: Configure miner power consumption limit.

**Input Schema**:
```typescript
{
  minerId: string | string[];    // Single or multiple miners
  powerTarget: number;           // Target power in watts
}
```

**Returns**:
```typescript
{
  success: number;      // Number of miners updated successfully
  failed: number;
  results: Array<{
    minerId: string;
    success: boolean;
    previousPower: number;
    newPower: number;
    error?: string;
  }>;
}
```

---

### 11. set_hashrate_target

**Description**: Configure miner hashrate target.

**Input Schema**:
```typescript
{
  minerId: string | string[];
  hashrateTarget: number;        // Target in TH/s
}
```

**Returns**: Same format as `set_power_target`

---

### 12. update_miner_firmware

**Description**: Update firmware on one or more miners. Returns job ID for async tracking.

**Input Schema**:
```typescript
{
  minerIds: string[];            // Array of miner IDs (max: 100)
  version: string;               // Firmware version (semantic versioning, e.g., "2.0.1")
  force?: boolean;               // Skip version checks (default: false)
}
```

**Returns**:
```typescript
{
  jobId: string;                 // Job ID for status tracking
  status: 'pending' | 'running';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  estimatedCompletion: string;   // ISO 8601 timestamp
}
```

**Example Usage**:
```json
{
  "minerIds": ["miner-001", "miner-002", "miner-003"],
  "version": "2.0.1",
  "force": false
}
```

**Errors**:
- `INVALID_VERSION`: Version must follow semantic versioning
- `BATCH_LIMIT_EXCEEDED`: Maximum 100 miners per batch

---

### 13. check_firmware_job_status

**Description**: Check progress of a firmware update job.

**Input Schema**:
```typescript
{
  jobId: string;
}
```

**Returns**:
```typescript
{
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
    current?: string;    // Currently processing miner ID
  };
  results: Array<{
    minerId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    duration?: string;   // e.g., "5m 32s"
    error?: string;
  }>;
  startedAt: string;
  completedAt?: string;
}
```

---

### 14. check_job_status

**Description**: Generic job status query (works for any background job).

**Input Schema**:
```typescript
{
  jobId: string;
}
```

**Returns**: Same format as `check_firmware_job_status`

---

### 15. update_pool_config

**Description**: Update mining pool configuration for one or more miners.

**Input Schema**:
```typescript
{
  minerIds: string[];
  poolUrl: string;               // stratum+tcp:// or stratum+ssl://
  username: string;
  password?: string;
  priority?: number;             // Pool priority (0-10, default: 0)
}
```

**Returns**:
```typescript
{
  success: number;
  failed: number;
  results: Array<{
    minerId: string;
    success: boolean;
    error?: string;
  }>;
}
```

**Example Usage**:
```json
{
  "minerIds": ["miner-001", "miner-002"],
  "poolUrl": "stratum+tcp://pool.example.com:3333",
  "username": "user.worker1",
  "priority": 0
}
```

---

### 16. factory_reset

**Description**: Perform factory reset on a miner. Requires confirmation.

**Input Schema**:
```typescript
{
  minerId: string;
  confirm: boolean;              // Must be true to proceed
}
```

**Returns**:
```typescript
{
  success: boolean;
  minerId: string;
  message: string;
  estimatedDowntime: string;
}
```

**Errors**:
- `CONFIRMATION_REQUIRED`: Must set confirm=true

---

## MCP Resources

### 1. braiins:///fleet/summary

**Description**: Aggregated fleet metrics (cached for 30 seconds).

**URI Pattern**: `braiins:///fleet/summary`

**Returns**:
```typescript
{
  totalMiners: number;
  onlineMiners: number;
  offlineMiners: number;
  totalHashrateThs: number;
  avgTemperatureCelsius: number;
  totalPowerWatts: number;
  calculatedAt: string;
}
```

**Cache TTL**: 30 seconds

**When to Use**: Get quick fleet overview without making multiple API calls.

---

### 2. braiins:///miner/{id}/status

**Description**: Real-time miner status (cached for 10 seconds).

**URI Pattern**: `braiins:///miner/miner-001/status`

**Returns**:
```typescript
{
  id: string;
  name: string;
  host: string;
  online: boolean;
  info: {
    firmwareVersion: { current: string; };
    hardware: { brand: string; model: string; };
    uptime: number;
  };
  hashboards: Array<{
    id: string;
    enabled: boolean;
    temperature: number;
    hashrate: number;
  }>;
  pools: Array<{
    url: string;
    user: string;
    active: boolean;
    alive: boolean;
  }>;
  lastUpdated: string;
}
```

**Cache TTL**: 10 seconds

**When to Use**: Get real-time status for a specific miner.

---

### 3. braiins:///miner/{id}/config

**Description**: Complete miner configuration (cached for 60 seconds).

**URI Pattern**: `braiins:///miner/miner-001/config`

**Returns**:
```typescript
{
  minerId: string;
  hostname: string;
  pools: Array<{
    url: string;
    user: string;
    priority: number;
  }>;
  tuner: {
    mode: string;
    target: number;
  };
  fans: {
    mode: string;
    targetSpeed: number;
  };
  powerLimit: number;
  lastUpdated: string;
}
```

**Cache TTL**: 60 seconds

**When to Use**: Review full miner configuration before making changes.

---

### 4. braiins:///miner/{id}/logs

**Description**: Recent miner log entries (cached for 30 seconds).

**URI Pattern**: `braiins:///miner/miner-001/logs`

**Returns**:
```typescript
{
  minerId: string;
  logs: Array<{
    timestamp: string;
    level: 'debug' | 'info' | 'warning' | 'error';
    message: string;
  }>;
  totalLines: number;
  fetchedAt: string;
}
```

**Cache TTL**: 30 seconds

**When to Use**: Quick diagnostics without calling `get_miner_logs` tool.

---

### 5. braiins:///jobs/{id}

**Description**: Background job status (real-time, no caching).

**URI Pattern**: `braiins:///jobs/update-20251228-abc123`

**Returns**:
```typescript
{
  jobId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  startedAt: string;
  completedAt?: string;
}
```

**Cache TTL**: None (always fresh)

**When to Use**: Monitor long-running operations in real-time.

---

## MCP Prompts

### 1. troubleshoot_miner_offline

**Description**: Step-by-step guided workflow to diagnose and fix offline miners.

**Arguments**:
```typescript
{
  minerId: string;     // Required: Miner ID to troubleshoot
}
```

**Workflow**:
1. Check last known status
2. Test network connectivity with `ping_miner`
3. Review logs with `get_miner_logs`
4. Suggest remediation based on findings:
   - Reboot if ping succeeds
   - Check network/firewall if ping fails
   - Review hardware if logs show errors

**Example Invocation**:
```json
{
  "minerId": "miner-001"
}
```

**Returns**: Multi-turn conversation guiding the agent through diagnostics.

---

### 2. optimize_power_efficiency

**Description**: Guided workflow to optimize miner power settings for efficiency.

**Arguments**:
```typescript
{
  minerId: string;              // Required: Miner to optimize
  targetEfficiency?: string;    // Optional: Target W/TH (e.g., "30")
}
```

**Workflow**:
1. Analyze current performance (power, hashrate, efficiency)
2. Calculate current efficiency (W/TH)
3. Compare to target or industry benchmarks
4. Recommend power target adjustments
5. Suggest monitoring period

**Example Invocation**:
```json
{
  "minerId": "miner-001",
  "targetEfficiency": "30"
}
```

---

### 3. batch_firmware_update

**Description**: Enterprise-grade batch firmware update workflow with pre-flight checks.

**Arguments**:
```typescript
{
  minerIds: string;     // Required: Comma-separated IDs or "all"
  version: string;      // Required: Target firmware version
}
```

**Workflow**:
1. **Pre-Flight Checks**: Validate all miners are online and reachable
2. **Risk Assessment**: Analyze batch size and recommend phased rollout for large fleets
3. **Execution Plan**: Provide options (full batch vs. phased rollout)
4. **Monitoring Guidance**: Explain how to track progress with `check_job_status`
5. **Validation Steps**: Post-update verification checklist
6. **Failure Recovery**: Troubleshooting for failed updates

**Example Invocation**:
```json
{
  "minerIds": "miner-001,miner-002,miner-003",
  "version": "2.0.1"
}
```

**Validations**:
- Version must follow semantic versioning (e.g., "2.0.1")
- Maximum 100 miners per batch
- All miners must be registered

---

## Error Handling

### Error Response Format

All MCP tools return errors in a consistent format:

```typescript
{
  success: false;
  error: {
    code: string;              // Machine-readable error code
    message: string;           // Human-readable error message
    details?: {
      suggestion?: string;     // What the agent should try next
      possibleCauses?: string[]; // Common reasons for this error
      relatedTools?: string[]; // Tools that might help resolve the issue
    };
  };
}
```

### Common Error Codes

| Code | Description | Suggested Action |
|------|-------------|------------------|
| `MINER_NOT_FOUND` | Miner ID not registered | Use `list_miners` to see all miners |
| `MINER_UNREACHABLE` | Cannot connect to miner | Use `ping_miner` to test connectivity |
| `INVALID_INPUT` | Input validation failed | Check parameter types and constraints |
| `BATCH_LIMIT_EXCEEDED` | Too many items in batch | Reduce batch size or split into multiple calls |
| `OPERATION_TIMEOUT` | Operation took too long | Retry or increase timeout |
| `FIRMWARE_UPDATE_FAILED` | Firmware update encountered error | Check `check_job_status` for details |
| `CACHE_ERROR` | Redis cache unavailable | Operation will work but may be slower |
| `GRPC_CONNECTION_ERROR` | Cannot establish gRPC connection | Check miner network and firewall |

---

## Usage Examples

### Example 1: Fleet Status Overview

```typescript
// Get quick fleet overview
const fleetSummary = await mcpServer.readResource('braiins:///fleet/summary');

console.log(`Fleet: ${fleetSummary.totalMiners} miners`);
console.log(`Online: ${fleetSummary.onlineMiners}`);
console.log(`Total Hashrate: ${fleetSummary.totalHashrateThs} TH/s`);
```

### Example 2: Batch Firmware Update

```typescript
// Step 1: Get list of miners
const { miners } = await mcpServer.callTool('list_miners', {
  filter: { status: 'online' }
});

// Step 2: Use guided prompt for batch update
const workflow = await mcpServer.callPrompt('batch_firmware_update', {
  minerIds: miners.map(m => m.id).join(','),
  version: '2.0.1'
});

// Step 3: Execute update (following prompt guidance)
const updateResult = await mcpServer.callTool('update_miner_firmware', {
  minerIds: miners.map(m => m.id),
  version: '2.0.1'
});

// Step 4: Monitor progress
const jobStatus = await mcpServer.callTool('check_job_status', {
  jobId: updateResult.jobId
});
```

### Example 3: Troubleshoot Offline Miner

```typescript
// Use guided troubleshooting prompt
const troubleshootWorkflow = await mcpServer.callPrompt('troubleshoot_miner_offline', {
  minerId: 'miner-001'
});

// Follow the workflow steps provided by the prompt
// Example: Ping the miner
const pingResult = await mcpServer.callTool('ping_miner', {
  minerId: 'miner-001',
  timeout: 5000
});

if (!pingResult.reachable) {
  console.log('Suggestions:', pingResult.error.details.suggestions);
}
```

### Example 4: Monitor Specific Miner

```typescript
// Option 1: Use resource for cached status
const status = await mcpServer.readResource('braiins:///miner/miner-001/status');

// Option 2: Use tool for fresh status with details
const detailedStatus = await mcpServer.callTool('get_miner_status', {
  minerId: 'miner-001',
  refresh: true,
  detailLevel: 'verbose'
});
```

---

## Best Practices

### For AI Agents

1. **Use Resources for Read Operations**: Resources are cached and faster for status queries
2. **Use Batch Operations**: Always prefer batch tools over loops (e.g., update 10 miners in one call vs. 10 separate calls)
3. **Check Job Status Periodically**: Long operations return job IDs - poll with `check_job_status` every 30-60 seconds
4. **Follow Prompt Workflows**: Prompts provide guided workflows for complex operations
5. **Request Verbose Mode Only When Needed**: Default concise mode saves context tokens

### For Developers

1. **Cache Awareness**: Understand TTLs - use `refresh: true` when you need real-time data
2. **Error Handling**: Always check `success` field and handle errors gracefully
3. **Batch Limits**: Respect batch limits (typically 100 items)
4. **Async Operations**: Firmware updates and large batches are async - use job tracking
5. **Testing**: Use evaluation templates in `tests/evaluations/` to validate tool behavior

---

**Documentation Version**: 1.0.0
**Last Updated**: December 2025
**For Issues**: See [GitHub Issues](https://github.com/braiins/braiins-os-mcp-server/issues)
