# PowerDNS Recursor Settings Reference

Complete reference for all configuration settings in `recursor.conf` or `recursor.yml`.

## Network & Binding

### `incoming.listen` / `local-address`
**Default:** `127.0.0.1, ::1`

IPv4 and/or IPv6 addresses to listen on. Supports port specification.

```yaml
# YAML
incoming:
  listen:
    - 0.0.0.0:53
    - '[::]:53'
    - 192.0.2.1:5300
```

```ini
# Traditional
local-address=0.0.0.0, ::
local-address=192.0.2.1:5300
```

### `incoming.port` / `local-port`
**Default:** `53`

Default DNS port. Can be overridden per-address in listen configuration.

### `incoming.allow_from` / `allow-from`
**Default:** `127.0.0.0/8, 10.0.0.0/8, 100.64.0.0/10, 169.254.0.0/16, 192.168.0.0/16, 172.16.0.0/12, ::1/128, fc00::/7, fe80::/10`

Networks allowed to query this server.

```yaml
incoming:
  allow_from:
    - 192.168.0.0/16
    - 10.0.0.0/8
    - '2001:db8::/32'
```

### `incoming.reuseport` / `reuseport`
**Default:** `yes`

Enable SO_REUSEPORT for kernel-based load distribution across threads.

### `incoming.distributor_threads` / `distributor-threads`
**Default:** `0` (disabled)

Number of threads to distribute queries to workers. Enable for high-volume scenarios.

### `incoming.max_tcp_clients` / `max-tcp-clients`
**Default:** `128`

Maximum concurrent TCP connections.

### `incoming.max_concurrent_requests_per_tcp_connection`
**Default:** `10`

Maximum queries per TCP connection (pipelining).

## Threading & Performance

### `recursor.threads` / `threads`
**Default:** `2`

Number of worker threads. Set to CPU cores minus distributor threads.

```yaml
recursor:
  threads: 8
```

### `incoming.tcp_threads` / `tcp-threads`
**Default:** `1`

TCP handler threads. New in version 5.0.0.

### `recursor.max_mthreads` / `max-mthreads`
**Default:** `2048`

Maximum simultaneous MTasker threads (concurrent queries being processed).

### `recursor.max_qperq` / `max-qperq`
**Default:** `50`

Maximum outgoing queries per client query during resolution.

### `recursor.cpu_map` / `cpu-map`
**Default:** (empty)

Pin worker threads to specific CPUs. Useful for NUMA systems.

```yaml
recursor:
  cpu_map: 0=0 1=1 2=2 3=3
```

### `recursor.stack_cache_size` / `stack-cache-size`
**Default:** `0`

Number of MThread stacks to cache. Reduces allocation overhead.

## Caching

### `recordcache.max_entries` / `max-cache-entries`
**Default:** `1000000`

Maximum entries in the record cache. Each entry uses ~850 bytes.

```yaml
recordcache:
  max_entries: 5000000
```

### `recordcache.max_ttl` / `max-cache-ttl`
**Default:** `86400` (24 hours)

Maximum TTL for cached records.

### `recordcache.max_negative_ttl` / `max-negative-ttl`
**Default:** `3600` (1 hour)

Maximum TTL for negative cache entries (NXDOMAIN, NODATA).

### `packetcache.max_entries` / `max-packetcache-entries`
**Default:** `500000`

Maximum entries in the packet cache. Each entry uses ~500 bytes.

### `packetcache.ttl` / `packetcache-ttl`
**Default:** `86400`

TTL for packet cache entries.

### `packetcache.negative_ttl` / `packetcache-negative-ttl`
**Default:** `60`

TTL for negative packet cache entries.

## DNSSEC

### `dnssec.validation` / `dnssec`
**Default:** `process`

DNSSEC validation mode.

| Value | Description |
|-------|-------------|
| `off` | No DNSSEC processing |
| `process-no-validate` | Process but don't validate |
| `process` | Validate when client requests (DO/AD) |
| `log-fail` | Validate all, log failures |
| `validate` | Full validation, SERVFAIL on bogus |

```yaml
dnssec:
  validation: validate
```

### `dnssec.trustanchors`
**Default:** Built-in root trust anchor

Custom trust anchors.

```yaml
dnssec:
  trustanchors:
    - name: '.'
      dsrecords:
        - '63149 13 1 a59da3f5c1b97fcd5fa2b3b2b0ac91d38a60d33a'
    - name: example.com
      dsrecords:
        - '44030 8 2 D4C3D5552B8679FAEEBC317E5F048B614B2E5F607DC57F1553182D49AB2179F7'
```

### `dnssec.trustanchorfile` / `lua-dns-script`
**Default:** (empty)

Path to BIND-format trust anchor file.

```yaml
dnssec:
  trustanchorfile: /usr/share/dns/root.key
```

### `dnssec.negative_trustanchors`
**Default:** (empty)

Zones where DNSSEC validation should be skipped.

```yaml
dnssec:
  negative_trustanchors:
    - name: broken.example.com
      reason: Misconfigured DNSSEC
```

## Forwarding

### `recursor.forward_zones` / `forward-zones`
**Default:** (empty)

Forward specific zones to authoritative servers (non-recursive).

```yaml
recursor:
  forward_zones:
    - zone: internal.corp
      forwarders:
        - 10.0.0.1
        - 10.0.0.2
```

```ini
forward-zones=internal.corp=10.0.0.1;10.0.0.2
```

### `recursor.forward_zones_recurse` / `forward-zones-recurse`
**Default:** (empty)

Forward zones to recursive resolvers.

```yaml
recursor:
  forward_zones_recurse:
    - zone: external.example
      forwarders:
        - 8.8.8.8
        - 8.8.4.4
```

### `recursor.forward_zones_file` / `forward-zones-file`
**Default:** (empty)

Load forwarding configuration from file.

## Lua Scripting

### `recursor.lua_dns_script` / `lua-dns-script`
**Default:** (empty)

Path to Lua DNS processing script.

```yaml
recursor:
  lua_dns_script: /etc/powerdns/dns-script.lua
```

### `recursor.lua_config_file` / `lua-config-file`
**Default:** (empty)

Path to Lua configuration script (for RPZ, etc.).

```yaml
recursor:
  lua_config_file: /etc/powerdns/config.lua
```

### `recursor.lua_maintenance_interval` / `lua-maintenance-interval`
**Default:** `1`

Interval (seconds) between calls to the Lua `maintenance()` function.

## Webserver & API

### `webservice.webserver` / `webserver`
**Default:** `no`

Enable the built-in webserver.

```yaml
webservice:
  webserver: true
```

### `webservice.address` / `webserver-address`
**Default:** `127.0.0.1`

IP address for webserver to listen on.

### `webservice.port` / `webserver-port`
**Default:** `8082`

Port for webserver.

### `webservice.allow_from` / `webserver-allow-from`
**Default:** `127.0.0.1, ::1`

IP ranges allowed to access webserver.

```yaml
webservice:
  allow_from:
    - 127.0.0.1
    - 10.0.0.0/8
```

### `webservice.api_key` / `api-key`
**Default:** (empty)

API authentication key. Required for API access.

```yaml
webservice:
  api_key: your-secret-key
```

### `webservice.password` / `webserver-password`
**Default:** (empty)

Basic authentication password for webserver.

## Logging

### `logging.loglevel` / `loglevel`
**Default:** `6`

Logging verbosity: 0 (none) to 9 (verbose).

```yaml
logging:
  loglevel: 5
```

### `logging.quiet` / `quiet`
**Default:** `yes`

Log query details in structured format.

### `logging.trace` / `trace`
**Default:** (empty)

Enable resolution tracing for specific domains (regex).

### `logging.facility` / `logging-facility`
**Default:** (varies by platform)

Syslog facility (LOCAL0-LOCAL7).

## Security

### `recursor.serve_rfc1918` / `serve-rfc1918`
**Default:** `yes`

Authoritatively serve RFC1918 reverse zones.

### `incoming.allow_notify_from` / `allow-notify-from`
**Default:** (empty)

IP addresses allowed to send NOTIFY messages.

### `incoming.allow_no_rd` / `allow-no-rd`
**Default:** `no`

Allow queries without the Recursion Desired bit.

### `recursor.non_local_bind` / `non-local-bind`
**Default:** `no`

Allow binding to non-existent addresses (for failover).

## Example Configurations

### Basic Resolver

```yaml
# /etc/powerdns/recursor.yml

incoming:
  listen:
    - 192.168.1.1:53
    - '[::1]:53'
  allow_from:
    - 192.168.0.0/16
    - 127.0.0.0/8

dnssec:
  validation: process

recursor:
  threads: 4

logging:
  loglevel: 4
```

### High-Performance Resolver

```yaml
# /etc/powerdns/recursor.yml

incoming:
  listen:
    - 0.0.0.0:53
    - '[::]:53'
  allow_from:
    - 10.0.0.0/8
    - 172.16.0.0/12
    - 192.168.0.0/16
  reuseport: true
  max_tcp_clients: 256
  max_concurrent_requests_per_tcp_connection: 20

recursor:
  threads: 16
  max_mthreads: 8192
  max_qperq: 60

recordcache:
  max_entries: 5000000
  max_ttl: 86400

packetcache:
  max_entries: 1000000

dnssec:
  validation: validate

webservice:
  webserver: true
  address: 127.0.0.1
  port: 8082
  api_key: secure-api-key

logging:
  loglevel: 4
  quiet: true
```

### Security-Focused Resolver

```yaml
# /etc/powerdns/recursor.yml

incoming:
  listen:
    - 127.0.0.1:53
  allow_from:
    - 127.0.0.0/8

dnssec:
  validation: validate
  trustanchorfile: /usr/share/dns/root.key

recursor:
  threads: 4
  lua_config_file: /etc/powerdns/rpz.lua
  lua_dns_script: /etc/powerdns/filter.lua

logging:
  loglevel: 5
```

### Split-Horizon with Forwarding

```yaml
# /etc/powerdns/recursor.yml

incoming:
  listen:
    - 10.0.0.1:53
  allow_from:
    - 10.0.0.0/8

recursor:
  threads: 4

  # Internal zones to corporate DNS
  forward_zones:
    - zone: corp.internal
      forwarders:
        - 10.1.1.1
        - 10.1.1.2
    - zone: 10.in-addr.arpa
      forwarders:
        - 10.1.1.1

  # External resolution via ISP
  forward_zones_recurse:
    - zone: .
      forwarders:
        - 8.8.8.8
        - 8.8.4.4

dnssec:
  validation: process
```
