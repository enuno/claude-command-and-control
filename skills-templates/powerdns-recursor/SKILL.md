# PowerDNS Recursor

> High-performance recursive DNS resolver with DNSSEC validation, Lua scripting, and Response Policy Zones.

## Quick Reference

### Installation

**Debian/Ubuntu:**
```bash
apt-get install pdns-recursor
```

**RHEL/CentOS:**
```bash
yum install pdns-recursor  # Requires EPEL
```

**FreeBSD:**
```bash
pkg install powerdns-recursor
```

**macOS:**
```bash
brew install pdnsrec
```

### Essential Commands

| Command | Description |
|---------|-------------|
| `rec_control ping` | Check if server is running |
| `rec_control get-all` | Show all statistics |
| `rec_control wipe-cache domain.com` | Clear cache for domain |
| `rec_control wipe-cache domain.com$` | Clear cache for domain subtree |
| `rec_control dump-cache /tmp/cache` | Dump cache to file |
| `rec_control trace-regex '.*\.example\.com\.$'` | Enable query tracing |
| `rec_control get-tas` | List trust anchors |
| `rec_control add-nta domain.com reason` | Add negative trust anchor |

### Minimal Configuration

**YAML format (`recursor.yml`):**
```yaml
incoming:
  listen:
    - 127.0.0.1:53
    - '[::1]:53'
  allow_from:
    - 127.0.0.0/8
    - 10.0.0.0/8
    - 172.16.0.0/12
    - 192.168.0.0/16

dnssec:
  validation: process

recursor:
  threads: 4
```

**Traditional format (`recursor.conf`):**
```ini
local-address=127.0.0.1, ::1
allow-from=127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
dnssec=process
threads=4
```

## DNSSEC Validation

### Validation Modes

| Mode | Behavior |
|------|----------|
| `off` | No DNSSEC processing, DO bit not set |
| `process-no-validate` | Provides DNSSEC RRsets, no validation |
| `process` | Validates when client requests (DO/AD bit) - **Default since 4.5.0** |
| `log-fail` | Validates all, logs failures, doesn't enforce |
| `validate` | Full validation, SERVFAIL on bogus data |

### Configuration

```yaml
dnssec:
  validation: validate

  # Custom trust anchors
  trustanchors:
    - name: '.'
      dsrecords:
        - '63149 13 1 a59da3f5c1b97fcd5fa2b3b2b0ac91d38a60d33a'
    - name: example.com
      dsrecords:
        - '44030 8 2 D4C3D5552B8679FAEEBC317E5F048B614B2E5F607DC57F1553182D49AB2179F7'

  # Trust anchor file (BIND format)
  trustanchorfile: /usr/share/dns/root.key

  # Negative trust anchors (bypass validation)
  negative_trustanchors:
    - name: broken-dnssec.example.com
      reason: Misconfigured DNSSEC
```

### Runtime Trust Anchor Management

```bash
# Add trust anchor
rec_control add-ta domain.example 63149 13 1 a59da3f5c1b97fcd5fa2b3b2b0ac91d38a60d33a

# View trust anchors
rec_control get-tas

# Add negative trust anchor (bypass validation)
rec_control add-nta domain.example "Broken DNSSEC keyroll"

# View negative trust anchors
rec_control get-ntas

# Remove negative trust anchor
rec_control clear-nta domain.example
```

## Forwarding

### Forward Specific Zones

```yaml
recursor:
  forward_zones:
    - zone: internal.corp
      forwarders:
        - 10.0.0.1
        - 10.0.0.2
    - zone: example.com
      forwarders:
        - 192.168.1.10:5353
      recurse: false  # Non-recursive (to authoritative)

  forward_zones_recurse:
    - zone: external.example
      forwarders:
        - 8.8.8.8
        - 8.8.4.4
```

**Traditional format:**
```ini
forward-zones=internal.corp=10.0.0.1;10.0.0.2
forward-zones-recurse=external.example=8.8.8.8;8.8.4.4
```

### Forward All Traffic

```yaml
recursor:
  forward_zones:
    - zone: .
      forwarders:
        - 8.8.8.8
        - 8.8.4.4
      recurse: true
```

## Response Policy Zones (RPZ)

RPZ enables DNS-based security filtering by modifying responses based on policy rules.

### Configure RPZ in Lua

Create `/etc/powerdns/recursor.lua`:

```lua
-- Load RPZ from file
rpzFile("/etc/powerdns/rpz/blocklist.rpz")

-- Load RPZ from primary server with IXFR updates
rpzPrimary("192.0.2.4", "policy.rpz", {
    refresh = 60,
    maxReceivedMBytes = 100
})

-- RPZ with TSIG authentication
rpzPrimary("192.0.2.4", "secure-policy.rpz", {
    tsigname = "rpz-key",
    tsigalgo = "hmac-sha256",
    tsigsecret = "base64-secret-here=="
})

-- RPZ with custom policy action
rpzFile("/etc/powerdns/rpz/redirect.rpz", {
    defpol = Policy.Custom,
    defcontent = "walled-garden.example.com"
})

-- RPZ with extended error reporting (RFC 8914)
rpzPrimary("192.0.2.4", "policy.rpz", {
    extendedErrorCode = 15,
    extendedErrorExtra = "Blocked by security policy"
})
```

Enable in configuration:
```yaml
recursor:
  lua_config_file: /etc/powerdns/recursor.lua
```

### RPZ Policy Actions

| Policy | Effect |
|--------|--------|
| `Policy.Drop` | Silently drop query |
| `Policy.NXDOMAIN` | Return NXDOMAIN |
| `Policy.NODATA` | Return empty answer |
| `Policy.Truncate` | Truncate UDP (force TCP) |
| `Policy.Custom` | Return custom CNAME |
| `Policy.NoAction` | Continue normal resolution |

## Lua Scripting

### Enable Lua Scripts

```yaml
recursor:
  lua_dns_script: /etc/powerdns/dns-script.lua
  lua_config_file: /etc/powerdns/config.lua
```

### Available Hooks

| Hook | When Called | Return |
|------|-------------|--------|
| `ipfilter(rem, loc, dh)` | Before parsing query | `true` = drop |
| `gettag(remote, ednssubnet, ...)` | Discovering cache location | tag value |
| `preresolve(dq)` | Before resolution | `true` = modified |
| `postresolve(dq)` | After resolution | `true` = modified |
| `nxdomain(dq)` | On NXDOMAIN response | `true` = modified |
| `nodata(dq)` | On empty response | `true` = modified |
| `preoutquery(dq)` | Before outgoing query | `true` = modified |
| `prerpz(dq)` | Before RPZ processing | `true` = bypass |

### Common Lua Scripts

**Block specific domains:**
```lua
function preresolve(dq)
    if dq.qname:equal("blocked.com") or
       dq.qname:isPartOf(newDN("malware.example")) then
        dq.rcode = pdns.NXDOMAIN
        return true
    end
    return false
end
```

**IP-based filtering:**
```lua
badips = newNMG()
badips:addMask("192.0.2.0/24")
badips:addMask("198.51.100.0/24")

function ipfilter(rem, loc, dh)
    return badips:match(rem)
end
```

**Redirect responses:**
```lua
function postresolve(dq)
    if dq.qname:isPartOf(newDN("redirect.example")) then
        local records = dq:getRecords()
        for k, v in pairs(records) do
            if v.type == pdns.A then
                v:changeContent("10.0.0.1")
                v.ttl = 300
            end
        end
        dq:setRecords(records)
        return true
    end
    return false
end
```

**Synthetic responses for NXDOMAIN:**
```lua
function nxdomain(dq)
    if dq.qname:isPartOf(newDN("internal.corp")) then
        dq.rcode = 0
        dq:addAnswer(pdns.A, "192.168.1.1", 300)
        return true
    end
    return false
end
```

**Query logging:**
```lua
function preresolve(dq)
    pdnslog("Query: " .. dq.qname:toString() ..
            " from " .. dq.remoteaddr:toString())
    return false
end
```

### DNSQuestion Object

| Property/Method | Description |
|-----------------|-------------|
| `dq.qname` | Query domain name (DNSName) |
| `dq.qtype` | Query type (number) |
| `dq.rcode` | Response code |
| `dq.remoteaddr` | Client IP (ComboAddress) |
| `dq.localaddr` | Server IP |
| `dq.variable` | Set true to disable caching |
| `dq:addAnswer(type, content, ttl)` | Add answer record |
| `dq:getRecords()` | Get response records |
| `dq:setRecords(records)` | Set response records |
| `dq:discardPolicy(name)` | Skip RPZ policy |

## HTTP API

### Enable Webserver

```yaml
webservice:
  webserver: true
  address: 127.0.0.1
  port: 8082
  api_key: your-secret-key
  password: optional-web-password
  allow_from:
    - 127.0.0.1
    - ::1
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/v1/servers/localhost` | Server information |
| `/api/v1/servers/localhost/statistics` | All statistics |
| `/api/v1/servers/localhost/config` | Configuration |
| `/api/v1/servers/localhost/zones` | Zone information |
| `/api/v1/servers/localhost/cache/flush` | Flush cache |
| `/metrics` | Prometheus metrics |

### API Examples

```bash
# Get server info
curl -H 'X-API-Key: your-secret-key' \
  http://127.0.0.1:8082/api/v1/servers/localhost

# Get statistics
curl -H 'X-API-Key: your-secret-key' \
  http://127.0.0.1:8082/api/v1/servers/localhost/statistics

# Flush cache for domain
curl -X PUT -H 'X-API-Key: your-secret-key' \
  http://127.0.0.1:8082/api/v1/servers/localhost/cache/flush?domain=example.com

# Prometheus metrics
curl http://127.0.0.1:8082/metrics
```

## Performance Tuning

### Thread Configuration

```yaml
recursor:
  threads: 4  # CPU cores minus distributor threads

incoming:
  distributor_threads: 1  # For high-volume scenarios
  reuseport: true  # Kernel load distribution (default)

# CPU pinning for NUMA systems
recursor:
  cpu_map: 0=0 1=1 2=2 3=3
```

### Cache Sizing

```yaml
recordcache:
  max_entries: 2000000  # ~850 bytes per entry

packetcache:
  max_entries: 500000   # ~500 bytes per entry
  ttl: 86400
  negative_ttl: 60
```

### Network Optimization

```yaml
incoming:
  max_tcp_clients: 128
  max_concurrent_requests_per_tcp_connection: 10

recursor:
  max_mthreads: 4096  # Concurrent queries
  max_qperq: 60       # Outgoing queries per client query
```

### System Tuning

```bash
# Increase file descriptors
ulimit -n 65535

# For systemd
# /etc/systemd/system/pdns-recursor.service.d/limits.conf
[Service]
LimitNOFILE=65535

# IPv6 route cache (for scale)
sysctl -w net.ipv6.route.max_size=32768

# Disable conntrack for DNS (performance)
iptables -t raw -A PREROUTING -p udp --dport 53 -j NOTRACK
iptables -t raw -A OUTPUT -p udp --sport 53 -j NOTRACK
```

## Configuration Reference

### Network Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `incoming.listen` | `127.0.0.1, ::1` | Listen addresses |
| `incoming.allow_from` | RFC1918 ranges | Allowed client networks |
| `incoming.port` | `53` | DNS port |
| `incoming.reuseport` | `yes` | Enable SO_REUSEPORT |

### Cache Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `recordcache.max_entries` | `1000000` | Record cache size |
| `recordcache.max_ttl` | `86400` | Max cache TTL |
| `recordcache.max_negative_ttl` | `3600` | Negative cache TTL |
| `packetcache.max_entries` | `500000` | Packet cache size |

### Performance Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `recursor.threads` | `2` | Worker threads |
| `recursor.max_mthreads` | `2048` | Max concurrent queries |
| `recursor.max_qperq` | `50` | Outgoing queries per query |
| `incoming.tcp_threads` | `1` | TCP handler threads |

### Security Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `dnssec.validation` | `process` | DNSSEC mode |
| `recursor.serve_rfc1918` | `yes` | Serve private zones |
| `incoming.allow_notify_from` | empty | NOTIFY sources |

## Troubleshooting

### Check Server Status

```bash
# Ping server
rec_control ping

# View all statistics
rec_control get-all

# Check specific metric
rec_control get cache-entries
rec_control get concurrent-queries
```

### Debug Resolution

```bash
# Enable tracing for domain
rec_control trace-regex '.*\.example\.com\.$'

# Trace all queries (careful - verbose!)
rec_control trace-regex '.*'

# Disable tracing
rec_control trace-regex

# View logs
journalctl -u pdns-recursor -f
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Queries refused | Check `allow_from` includes client network |
| SERVFAIL responses | Check DNSSEC validation, try `rec_control add-nta domain` |
| Slow resolution | Check forwarding config, increase `max_mthreads` |
| High memory usage | Reduce cache sizes, check for memory leaks |
| Cache not working | Verify `dq.variable` not set in Lua scripts |

### Key Metrics to Monitor

```bash
# Cache performance
rec_control get cache-hits
rec_control get cache-misses

# Query handling
rec_control get concurrent-queries
rec_control get over-capacity-drops

# DNSSEC
rec_control get dnssec-validations
rec_control get dnssec-result-bogus
```

## When to Use This Skill

- Setting up recursive DNS resolvers
- Implementing DNS-based security filtering (RPZ)
- Configuring DNSSEC validation
- Writing Lua scripts for DNS manipulation
- Performance tuning high-volume resolvers
- Integrating with threat intelligence feeds
- Building split-horizon DNS architectures

## Resources

- [Official Documentation](https://doc.powerdns.com/recursor/)
- [GitHub Repository](https://github.com/PowerDNS/pdns)
- [PowerDNS Blog](https://blog.powerdns.com/)
- [Community Support](https://github.com/PowerDNS/pdns/discussions)
- IRC: #powerdns on irc.oftc.net
