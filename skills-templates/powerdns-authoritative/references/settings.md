# PowerDNS Authoritative Server Settings Reference

Complete reference for all configuration settings in `/etc/powerdns/pdns.conf`.

## Network & Binding

### `local-address`
**Default:** `0.0.0.0, ::`

IPv4 and/or IPv6 addresses to listen on. Supports optional port specification.

```ini
local-address=0.0.0.0
local-address=192.0.2.1:5300, [2001:db8::1]:5300
local-address=0.0.0.0, ::
```

### `local-port`
**Default:** `53`

Default DNS port. Can be overridden per-address in `local-address`.

### `receiver-threads`
**Default:** `1`

Number of threads listening for incoming UDP queries. Increase for high-traffic servers.

```ini
receiver-threads=4
```

### `tcp-fast-open`
**Default:** `0` (disabled)

Enable TCP Fast Open with specified queue size.

```ini
tcp-fast-open=64
```

### `tcp-idle-timeout`
**Default:** `5`

Seconds before closing idle TCP connections.

### `max-tcp-connections`
**Default:** `20`

Maximum concurrent TCP connections per thread.

### `max-tcp-connection-duration`
**Default:** `0` (unlimited)

Maximum lifetime of a TCP connection in seconds.

## Primary/Secondary Operation

### `primary`
**Default:** `no`

Enable primary server mode. Required for sending NOTIFY and serving as authoritative source.

```ini
primary=yes
```

### `secondary`
**Default:** `no`

Enable secondary server mode. Required for receiving zone transfers.

```ini
secondary=yes
```

### `autosecondary`
**Default:** `no`

Automatically provision secondary zones from configured primaries (autoprimaries/supermasters).

```ini
autosecondary=yes
```

### `xfr-cycle-interval`
**Default:** `60`

Interval (seconds) between SOA checks on primaries and REFRESH checks on secondaries.

```ini
xfr-cycle-interval=120
```

### `default-soa-content`
**Default:** `a]hostmasters.{.ns.@ 0 10800 3600 604800 3600`

Template for new zone SOA records. Variables:
- `{.}` - Zone name with trailing dot
- `{#}` - Zone name without trailing dot

### `soa-minimum-ttl`
**Default:** `3600`

Minimum TTL for SOA records.

### `soa-refresh-default`
**Default:** `10800`

Default REFRESH value for SOA records.

### `soa-retry-default`
**Default:** `3600`

Default RETRY value for SOA records.

### `soa-expire-default`
**Default:** `604800`

Default EXPIRE value for SOA records.

## Security & Access Control

### `allow-axfr-ips`
**Default:** `127.0.0.0/8,::1`

IP ranges allowed to perform AXFR (zone transfers) without TSIG.

```ini
allow-axfr-ips=192.0.2.10/32,192.0.2.11/32,127.0.0.0/8
```

### `allow-notify-from`
**Default:** `0.0.0.0/0,::/0`

IP ranges allowed to send NOTIFY messages.

```ini
allow-notify-from=192.0.2.1/32
```

### `allow-dnsupdate-from`
**Default:** `127.0.0.0/8,::1`

IP ranges allowed to send DNS UPDATE requests.

```ini
allow-dnsupdate-from=10.0.0.0/8,192.168.0.0/16
```

### `dnsupdate`
**Default:** `no`

Enable dynamic DNS updates (RFC 2136).

```ini
dnsupdate=yes
```

### `only-notify`
**Default:** (empty)

If set, only send NOTIFY to these IP addresses.

```ini
only-notify=192.0.2.10,192.0.2.11
```

### `also-notify`
**Default:** (empty)

Additional servers to notify on zone changes.

```ini
also-notify=192.0.2.20,192.0.2.21
```

### `setuid` / `setgid`
User and group to run as after binding to privileged ports.

```ini
setuid=pdns
setgid=pdns
```

### `chroot`
Directory to chroot into after startup.

## API & Webserver

### `api`
**Default:** `no`

Enable the HTTP REST API.

```ini
api=yes
```

### `api-key`
API authentication key. Required when `api=yes`.

```ini
api-key=your-secret-api-key
```

Supports hashed format (v4.6.0+):
```ini
api-key=$scrypt$...
```

### `webserver`
**Default:** `no`

Enable the built-in webserver.

```ini
webserver=yes
```

### `webserver-address`
**Default:** `127.0.0.1`

IP address for webserver to listen on.

```ini
webserver-address=0.0.0.0
```

### `webserver-port`
**Default:** `8081`

Port for webserver.

### `webserver-allow-from`
**Default:** `127.0.0.1,::1`

IP ranges allowed to access webserver.

```ini
webserver-allow-from=10.0.0.0/8,192.168.0.0/16
```

### `webserver-password`
Basic authentication password for webserver (optional).

### `webserver-loglevel`
**Default:** `normal`

Logging level: `none`, `normal`, `detailed`.

## Performance & Caching

### `cache-ttl`
**Default:** `20`

Seconds to cache query results. Set to `0` to disable.

```ini
cache-ttl=60
```

### `max-cache-entries`
**Default:** `1000000`

Maximum entries in the query cache.

```ini
max-cache-entries=5000000
```

### `query-cache-ttl`
**Default:** `20`

TTL for query cache entries.

### `negquery-cache-ttl`
**Default:** `60`

TTL for negative query cache entries.

### `distributor-threads`
**Default:** `3`

Backend threads per receiver thread.

```ini
distributor-threads=5
```

### `reuseport`
**Default:** `no`

Enable SO_REUSEPORT for better multi-core performance.

```ini
reuseport=yes
```

### `queue-limit`
**Default:** `1500`

Maximum queries queued for processing.

## DNSSEC

### `default-ksk-algorithm`
**Default:** `ecdsa256`

Default algorithm for Key Signing Keys.

Options: `ecdsa256`, `ecdsa384`, `ed25519`, `ed448`, `rsasha256`, `rsasha512`

```ini
default-ksk-algorithm=ed25519
```

### `default-ksk-size`
**Default:** `0` (algorithm default)

Key size for RSA KSKs.

### `default-zsk-algorithm`
**Default:** (empty, uses KSK algorithm)

Default algorithm for Zone Signing Keys.

### `default-zsk-size`
**Default:** `0` (algorithm default)

Key size for RSA ZSKs.

### `max-nsec3-iterations`
**Default:** `100`

Maximum allowed NSEC3 hash iterations.

### `direct-dnskey`
**Default:** `no`

Fetch DNSKEY and DS from backend instead of computing.

## Logging

### `loglevel`
**Default:** `4`

Logging verbosity: 0 (none) to 9 (verbose).

```ini
loglevel=5
```

### `log-dns-details`
**Default:** `no`

Log query details.

### `log-dns-queries`
**Default:** `no`

Log all incoming queries.

### `logging-facility`
Syslog facility. Default varies by platform.

### `log-timestamp`
**Default:** `yes`

Include timestamps in log output.

### `query-logging`
**Default:** `no`

Enable per-query logging.

## Advanced Features

### `lua-records`
**Default:** `no`

Enable Lua record processing.

```ini
enable-lua-records=yes
```

### `enable-lua-records`
**Default:** `no`

Alias for `lua-records`.

Options: `yes`, `no`, `shared`

```ini
enable-lua-records=shared  # Better performance
```

### `lua-records-exec-limit`
**Default:** `1000`

Maximum Lua instructions per record.

### `dname-processing`
**Default:** `no`

Enable DNAME record processing.

```ini
dname-processing=yes
```

### `edns-subnet-processing`
**Default:** `no`

Enable EDNS Client Subnet support.

```ini
edns-subnet-processing=yes
```

### `expand-alias`
**Default:** `no`

Enable ALIAS record expansion.

```ini
expand-alias=yes
```

### `resolver`
Resolver for ALIAS/Lua records requiring external lookups.

```ini
resolver=8.8.8.8:53
```

## Backend Settings

### `launch`
Backends to load. Required.

```ini
launch=gmysql
launch=gmysql,bind
```

### Backend-Specific Prefixes

Each backend uses its module name as prefix:

- `gmysql-*` - MySQL/MariaDB
- `gpgsql-*` - PostgreSQL
- `gsqlite3-*` - SQLite3
- `bind-*` - BIND zone files
- `lmdb-*` - LMDB
- `geoip-*` - GeoIP

## Operational Settings

### `daemon`
**Default:** `no`

Run as daemon (background).

```ini
daemon=yes
```

### `guardian`
**Default:** `no`

Enable guardian process for automatic restarts.

```ini
guardian=yes
```

### `config-dir`
**Default:** `/etc/powerdns`

Configuration directory.

### `module-dir`
**Default:** varies

Directory containing backend modules.

### `socket-dir`
**Default:** `/var/run`

Directory for control socket.

### `version-string`
**Default:** `full`

Version string in responses: `full`, `powerdns`, `anonymous`, or custom.

```ini
version-string=anonymous
```

## Catalog Zones

### `default-catalog-zone`
**Default:** (empty)

Default catalog zone for new zones.

```ini
default-catalog-zone=catalog.example.com
```

## Zone Metadata

Metadata can be set per-zone using `pdnsutil set-meta`:

| Metadata | Description |
|----------|-------------|
| `ALLOW-AXFR-FROM` | Zone-specific AXFR allowlist |
| `ALLOW-DNSUPDATE-FROM` | Zone-specific update allowlist |
| `TSIG-ALLOW-AXFR` | TSIG key for AXFR |
| `TSIG-ALLOW-DNSUPDATE` | TSIG key for updates |
| `SOA-EDIT` | SOA serial update method |
| `SOA-EDIT-DNSUPDATE` | SOA serial for DNS updates |
| `PRESIGNED` | Zone is pre-signed |
| `NSEC3PARAM` | NSEC3 parameters |
| `ENABLE-LUA-RECORDS` | Enable Lua records for zone |

## Example Configurations

### High-Performance Primary

```ini
# /etc/powerdns/pdns.conf

# Backend
launch=gmysql
gmysql-host=127.0.0.1
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=secret
gmysql-dnssec=yes

# Network
local-address=0.0.0.0,::
local-port=53
receiver-threads=4
distributor-threads=4
reuseport=yes
tcp-fast-open=64

# Mode
primary=yes

# Performance
cache-ttl=60
max-cache-entries=5000000
query-cache-ttl=60

# Security
allow-axfr-ips=192.0.2.10/32,192.0.2.11/32

# API
api=yes
api-key=secure-api-key
webserver=yes
webserver-address=127.0.0.1
webserver-port=8081

# Logging
loglevel=4
log-dns-queries=no
```

### Secondary Server

```ini
# /etc/powerdns/pdns.conf

launch=gmysql
gmysql-host=127.0.0.1
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=secret
gmysql-dnssec=yes

local-address=0.0.0.0,::

secondary=yes
autosecondary=no
allow-notify-from=192.0.2.1/32
xfr-cycle-interval=60

cache-ttl=20
```

### Development/Testing

```ini
# /etc/powerdns/pdns.conf

launch=gsqlite3
gsqlite3-database=/var/lib/powerdns/pdns.sqlite3
gsqlite3-dnssec=yes

local-address=127.0.0.1
local-port=5300

primary=yes
secondary=yes
dnsupdate=yes
allow-dnsupdate-from=127.0.0.0/8

api=yes
api-key=test
webserver=yes
webserver-address=127.0.0.1
webserver-port=8081

loglevel=7
log-dns-queries=yes
```
