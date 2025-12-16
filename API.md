# Braiins OS Public REST API Documentation

## Overview
The Braiins OS Public REST API provides programmatic access to configure and monitor Bitcoin mining hardware running Braiins OS firmware. This API enables remote management of miner settings, performance tuning, pool configuration, and system monitoring.

**Base URL**: Contact your miner's IP address or hostname
**Authentication**: Token-based (Bearer token in Authorization header)

---

## Authentication

### POST /api/v1/login
Authenticates a user using username and password credentials.

**Request Body:**
```json
{
  "username": "root",
  "password": "1234"
}
```

**Parameters:**
- `username` (string, required): User account name
- `password` (string, required): User password

**Response:**
```json
{
  "token": "string",
  "timeout_s": 0
}
```

**Response Fields:**
- `token`: Authentication token for subsequent API requests
- `timeout_s`: Token expiration time in seconds

---

### PUT /api/v1/password
Updates or removes the user password. Requires authentication.

**Request Body:**
```json
{
  "password": "1234"
}
```

**Parameters:**
- `password` (string|null, optional): New password. Set to `null` to remove password

**Response:** Success confirmation

---

## Miner Information

### GET /api/v1/info
Retrieves comprehensive miner information including hardware details, firmware version, and system status.

**Response:**
```json
{
  "uid": "string",
  "serial_number": "string",
  "hostname": "string",
  "mac_address": "string",
  "platform": 0,
  "bos_mode": 0,
  "bos_version": {},
  "kernel_version": "string",
  "control_board_soc_family": 0,
  "miner_identity": {},
  "psu_info": {},
  "sticker_hashrate": {},
  "status": 0,
  "system_uptime": 0,
  "system_uptime_s": 0,
  "bosminer_uptime_s": 0
}
```

**Response Fields:**
- `uid`: Unique miner identifier
- `serial_number`: Hardware serial number
- `hostname`: Network hostname
- `mac_address`: MAC address of network interface
- `bos_version`: Braiins OS firmware version details
- `system_uptime_s`: System uptime in seconds
- `bosminer_uptime_s`: Mining software uptime in seconds

---

### GET /api/v1/errors
Retrieves all active errors and warnings from the miner.

**Response:**
```json
{
  "errors": [
    {
      "message": "string",
      "timestamp": "string",
      "components": [
        {
          "name": "string",
          "index": 0
        }
      ],
      "error_codes": [
        {
          "code": "string",
          "reason": "string",
          "hint": "string"
        }
      ]
    }
  ]
}
```

**Response Fields:**
- `errors[]`: Array of error objects
  - `message`: Human-readable error description
  - `timestamp`: When the error occurred
  - `components[]`: Affected hardware components
  - `error_codes[]`: Specific error codes with reasons and hints

---

## Hashboard Management

### GET /api/v1/hashboards
Retrieves detailed information about all hashboards including status, temperature, voltage, and performance statistics.

**Response:**
```json
{
  "hashboards": [
    {
      "id": "string",
      "board_name": "string",
      "model": "string",
      "serial_number": "string",
      "enabled": true,
      "chip_type": "string",
      "chips_count": 0,
      "current_voltage": {},
      "current_frequency": {},
      "board_temp": {},
      "lowest_inlet_temp": {},
      "highest_outlet_temp": {},
      "highest_chip_temp": {},
      "stats": {}
    }
  ]
}
```

**Response Fields:**
- `id`: Hashboard identifier
- `enabled`: Whether hashboard is currently active
- `chips_count`: Number of ASIC chips on board
- `current_voltage`: Operating voltage
- `current_frequency`: Operating frequency
- Temperature readings: `board_temp`, `lowest_inlet_temp`, `highest_outlet_temp`, `highest_chip_temp`
- `stats`: Performance statistics

---

### POST /api/v1/hashboards/enable
Enables or disables specific hashboards by ID.

**Request Body:**
```json
{
  "enable": false,
  "hashboard_ids": ["1", "3"]
}
```

**Parameters:**
- `enable` (boolean, required): True to enable, false to disable
- `hashboard_ids` (string[], required): Array of hashboard IDs to modify

**Response:**
```json
{
  "hashboards": [
    {
      "id": "string",
      "is_enabled": true
    }
  ]
}
```

---

## Cooling Management

### POST /api/v1/cooling
Sets the active cooling mode for the miner.

**Request Body:**
```json
{
  "hydro": {
    "target_temperature": {},
    "hot_temperature": {},
    "dangerous_temperature": {}
  }
}
```

**Cooling Modes:**
- `auto`: Automatic temperature-based fan control (0-200°C range)
- `manual`: Manual fan speed control
- `immersion`: Immersion cooling configuration
- `hydro`: Hydro cooling with temperature targets

**Response:** Confirmation with applied cooling configuration

---

## Performance Tuning

### POST /api/v1/performance/hashrate-target
Sets the target hashrate for the miner.

**Request Body:**
```json
{
  "terahash_per_second": 190
}
```

**Parameters:**
- `terahash_per_second` (number, required): Target hashrate in TH/s

**Response:**
```json
{
  "terahash_per_second": 190
}
```

---

### POST /api/v1/performance/hashrate-target/increment
Increments the current hashrate target by specified amount.

**Request Body:**
```json
{
  "terahash_per_second": 10
}
```

---

### POST /api/v1/performance/hashrate-target/decrement
Decrements the current hashrate target by specified amount.

**Request Body:**
```json
{
  "terahash_per_second": 10
}
```

---

### POST /api/v1/performance/power-target/increment
Increments the power target by specified watts.

**Request Body:**
```json
{
  "watt": 100
}
```

**Response:**
```json
{
  "watt": 3730
}
```

---

### POST /api/v1/performance/power-target/decrement
Decrements the power target by specified watts.

**Request Body:**
```json
{
  "watt": 100
}
```

---

### POST /api/v1/performance/mode
Sets the performance mode for the miner.

**Request Body:**
```json
{
  "tunermode": {
    "target": {
      "powertarget": {
        "power_target": {
          "watt": 2000
        }
      }
    }
  }
}
```

**Parameters:**
- `tunermode.target.powertarget.power_target.watt`: Target power consumption in watts

---

### POST /api/v1/performance/quick-ramp
Configures quick ramping times for power curtailment scenarios.

**Request Body:**
```json
{
  "up_s": 5,
  "down_s": 2
}
```

**Parameters:**
- `up_s` (integer, required): Ramp-up time in seconds (≥ 0)
- `down_s` (integer, required): Ramp-down time in seconds (≥ 0)

---

### GET /api/v1/performance/profiles
Retrieves saved performance profiles including power and hashrate targets.

**Response:**
```json
{
  "power_target_profiles": [
    {
      "target": {
        "watt": 2000
      },
      "estimated_power_consumption": {
        "watt": 2000
      },
      "measured_hashrate": {
        "gigahash_per_second": 12345
      },
      "created": {
        "seconds": 1744000000,
        "nanos": 0
      }
    }
  ],
  "hashrate_target_profiles": []
}
```

---

### GET /api/v1/performance/tuner-state
Retrieves current tuner state and active performance profile.

**Response:**
```json
{
  "overall_tuner_state": 1,
  "mode_state": {
    "powertargetmodestate": {
      "current_target": {
        "watt": 3000
      },
      "profile": {
        "target": {
          "watt": 3000
        },
        "estimated_power_consumption": {
          "watt": 3000
        },
        "measured_hashrate": {
          "gigahash_per_second": 12345
        },
        "created": {
          "seconds": 1744000000,
          "nanos": 0
        }
      }
    }
  }
}
```

---

## Dynamic Performance Scaling (DPS)

### POST /api/v1/dps
Configures Dynamic Performance Scaling settings for automated power management.

**Request Body:**
```json
{
  "save_action": 1,
  "enable": true,
  "enable_shutdown": true,
  "mode": 1,
  "shutdown_duration": {
    "hours": 4
  },
  "target": {
    "target": {
      "powertarget": {
        "min_power_target": {
          "watt": 3210
        },
        "power_step": {
          "watt": 20
        }
      }
    }
  }
}
```

**Parameters:**
- `save_action` (integer, required): Save configuration action
- `enable` (boolean|null): Enable/disable DPS
- `enable_shutdown` (boolean|null): Enable automatic shutdown during low-demand periods
- `mode` (integer|null): DPS operating mode
- `shutdown_duration.hours`: Duration for shutdown periods
- `target.target.powertarget`: Power target configuration
  - `min_power_target.watt`: Minimum power target
  - `power_step.watt`: Power adjustment step size

**Response:**
```json
{
  "enabled": true,
  "mode": 1,
  "shutdown_enabled": true,
  "shutdown_duration": {
    "hours": 4
  },
  "power_target": {
    "min_power_target": {
      "watt": 3210
    },
    "power_step": {
      "watt": 20
    }
  },
  "hashrate_target": null
}
```

---

## Pool Configuration

### GET /api/v1/pools
Retrieves all configured mining pool groups with their pools and status.

**Response:**
```json
[
  {
    "name": "High Performance",
    "uid": "group1",
    "pools": [
      {
        "uid": "pool1",
        "url": "stratum+tcp://pool.example.com:3333",
        "user": "miner1",
        "enabled": true,
        "active": true,
        "alive": true,
        "stats": {
          "accepted_shares": 1000,
          "rejected_shares": 10,
          "stale_shares": 5,
          "best_share": 1200000,
          "last_difficulty": 800000,
          "generated_work": 5000000,
          "last_share_time": {
            "seconds": 1741260910,
            "nanos": 255441271
          }
        }
      }
    ],
    "strategy": {
      "quota": {
        "value": 70
      }
    }
  }
]
```

**Response Fields:**
- `name`: Pool group name
- `uid`: Unique identifier
- `pools[]`: Array of pool configurations
  - `uid`: Pool identifier
  - `url`: Stratum URL
  - `user`: Mining username/wallet
  - `enabled`: Pool enabled status
  - `active`: Currently active pool
  - `alive`: Pool connection status
  - `stats`: Mining statistics
- `strategy`: Load balancing strategy (quota, fixed share ratio, etc.)

---

### POST /api/v1/pools
Creates a new pool group.

**Request Body:**
```json
{
  "uid": "group1",
  "name": "Pools",
  "pools": [
    {
      "uid": "1",
      "url": "stratum+tcp://pool.example.com:3333",
      "user": "miner1",
      "password": "xxxx",
      "enabled": true
    }
  ],
  "load_balance_strategy": {
    "fixedshareratio": {
      "value": 50
    }
  }
}
```

**Parameters:**
- `uid` (string|null): Group identifier (auto-generated if null)
- `name` (string, required): Display name
- `pools[]` (array, required): Pool configurations
  - `uid`: Pool identifier
  - `url`: Stratum protocol URL
  - `user`: Mining username
  - `password`: Pool password
  - `enabled`: Enable this pool
- `load_balance_strategy`: Strategy object (fixedshareratio, quota, etc.)

---

### PUT /api/v1/pools
Replaces all pool groups with new configuration.

**Request Body:** Array of pool group configurations (same structure as POST /api/v1/pools)

---

### PUT /api/v1/pools/{uid}
Updates a specific pool group by UID.

**Path Parameters:**
- `uid` (string, required): Pool group UID

**Request Body:** Same structure as POST /api/v1/pools

---

## Network Configuration

### GET /api/v1/network
Retrieves network configuration including interfaces, IP addresses, DNS, and gateway.

**Response:**
```json
{
  "name": "eth0",
  "hostname": "miner-01.local",
  "mac_address": "00:1A:2B:3C:4D:5E",
  "protocol": 1,
  "networks": [
    {
      "address": "192.168.1.100",
      "netmask": "255.255.255.0"
    }
  ],
  "default_gateway": "192.168.1.1",
  "dns_servers": [
    "8.8.8.8",
    "8.8.4.4"
  ]
}
```

**Response Fields:**
- `name`: Network interface name
- `hostname`: Miner hostname
- `mac_address`: MAC address
- `protocol`: Network protocol (1 = DHCP, 2 = Static)
- `networks[]`: IP configurations
- `default_gateway`: Default gateway IP
- `dns_servers[]`: DNS server addresses

---

### POST /api/v1/network
Updates network configuration settings.

**Request Body:**
```json
{
  "hostname": "miner-01.local",
  "protocol": {
    "dhcp": {}
  }
}
```

**Parameters:**
- `hostname` (string|null): New hostname (preserves existing if not set)
- `protocol`: Network protocol configuration
  - `dhcp`: DHCP configuration object
  - Alternative: Static IP configuration

**Response:** Confirmation with updated configuration

---

## System Operations

### POST /api/v1/contract
Applies a custom contract/license key.

**Request Body:**
```json
{
  "contract_key": "string"
}
```

**Parameters:**
- `contract_key` (string, required): License contract key

**Response:**
```json
{
  "successful": true
}
```

---

### GET /api/v1/support-archive
Streams a support archive for troubleshooting purposes.

**Query Parameters:**
- `format` (string, required): Archive format
  - `zip`: Compressed ZIP format
  - `bos`: BOS custom format
  - `zipencrypted`: Encrypted ZIP format

**Response:** Binary stream of support archive file

---

## Data Models

### Temperature Object
```json
{
  "celsius": 0
}
```

### Power Object
```json
{
  "watt": 0
}
```

### Hashrate Object
```json
{
  "terahash_per_second": 0,
  "gigahash_per_second": 0
}
```

### Timestamp Object
```json
{
  "seconds": 0,
  "nanos": 0
}
```

### Load Balance Strategies
- **Fixed Share Ratio**: Distributes shares at fixed percentage
- **Quota**: Allocates mining time based on quota values
- **Failover**: Uses backup pools when primary fails

---

## Error Codes

Common HTTP status codes:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or token expired
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

---

## Best Practices

### Security
1. Always use HTTPS in production environments
2. Store authentication tokens securely
3. Implement token refresh logic for long-running applications
4. Never hardcode credentials

### Performance
1. Monitor tuner state before making bulk configuration changes
2. Use quick-ramp settings for curtailment scenarios
3. Allow tuning profiles to stabilize (15-30 minutes) before evaluating
4. Poll error endpoint regularly to detect issues early

### Pool Management
1. Configure multiple pools with failover strategy
2. Monitor pool stats to identify connectivity issues
3. Use fixed share ratio for consistent multi-pool mining
4. Test pool connections before deploying to production

---

## Example Workflows

### Initial Setup
1. Authenticate: `POST /api/v1/login`
2. Get miner info: `GET /api/v1/info`
3. Configure pools: `POST /api/v1/pools`
4. Set performance target: `POST /api/v1/performance/power-target`
5. Verify hashboards: `GET /api/v1/hashboards`

### Monitoring Loop
1. Check errors: `GET /api/v1/errors`
2. Get tuner state: `GET /api/v1/performance/tuner-state`
3. Review pool stats: `GET /api/v1/pools`
4. Monitor hashboard temps: `GET /api/v1/hashboards`

### Power Curtailment
1. Set quick ramp times: `POST /api/v1/performance/quick-ramp`
2. Configure DPS: `POST /api/v1/dps`
3. Adjust power target: `POST /api/v1/performance/power-target/decrement`
4. Monitor tuner response: `GET /api/v1/performance/tuner-state`

---

## Additional Resources

- **OpenAPI Specification**: Download from https://developer.braiins-os.com/latest/openapi.html
- **Official Documentation**: https://braiins-os.com/docs
- **Community Forum**: https://braiins-os.com/forum
- **GitHub Repository**: Check for SDK examples and client libraries

---

## Version Information

**API Version**: v1  
**Document Version**: 1.0  
**Last Updated**: December 2024

---

*This documentation is based on the Braiins OS Public REST API specification. Always refer to the official OpenAPI specification for the most current endpoint details and schema definitions.*
