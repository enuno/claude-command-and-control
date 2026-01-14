# PowerDNS Authoritative Server

> Versatile authoritative nameserver supporting multiple backends with DNSSEC, dynamic updates, and REST API.

## Quick Reference

### Installation

**Debian/Ubuntu:**
```bash
# From PowerDNS repository (recommended)
echo "deb [arch=amd64] http://repo.powerdns.com/ubuntu focal-auth-master main" | sudo tee /etc/apt/sources.list.d/pdns.list
sudo apt-get update
sudo apt-get install pdns-server pdns-backend-mysql
```

**RHEL/CentOS:**
```bash
sudo yum install pdns pdns-backend-mysql
```

**FreeBSD:**
```bash
sudo pkg install dns/powerdns
```

**macOS:**
```bash
brew install pdns
```

### Essential Commands

| Command | Description |
|---------|-------------|
| `pdns_control ping` | Check if server is running |
| `pdns_control rping` | Show backend status |
| `pdnsutil list-all-zones` | List all zones |
| `pdnsutil check-zone example.com` | Validate zone |
| `pdnsutil rectify-zone example.com` | Fix DNSSEC records |
| `pdnsutil secure-zone example.com` | Enable DNSSEC |
| `pdnsutil show-zone example.com` | Display zone info |

### Minimal Configuration

```ini
# /etc/powerdns/pdns.conf

# Backend (MySQL example)
launch=gmysql
gmysql-host=127.0.0.1
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=secret

# Network
local-address=0.0.0.0
local-port=53

# Mode
primary=yes

# API (optional)
api=yes
api-key=changeme
webserver=yes
webserver-address=127.0.0.1
webserver-port=8081
```

## Backends

### Available Backends

| Backend | Module | Use Case |
|---------|--------|----------|
| MySQL/MariaDB | `gmysql` | Production databases |
| PostgreSQL | `gpgsql` | Enterprise databases |
| SQLite3 | `gsqlite3` | Small/testing setups |
| BIND | `bind` | Zone file compatibility |
| LMDB | `lmdb` | High-performance K/V |
| GeoIP | `geoip` | Geographic routing |
| LDAP | `ldap` | Directory integration |
| Lua2 | `lua2` | Scripted backends |
| Pipe | `pipe` | External programs |
| Remote | `remote` | Distributed queries |

### MySQL Backend Setup

```ini
# /etc/powerdns/pdns.conf
launch=gmysql
gmysql-host=127.0.0.1
gmysql-port=3306
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=secret
gmysql-dnssec=yes
```

**Initialize database:**
```bash
mysql -u root -p
CREATE DATABASE powerdns;
GRANT ALL ON powerdns.* TO 'powerdns'@'localhost' IDENTIFIED BY 'secret';
USE powerdns;
SOURCE /usr/share/doc/pdns-backend-mysql/schema.mysql.sql;
```

### PostgreSQL Backend Setup

```ini
launch=gpgsql
gpgsql-host=127.0.0.1
gpgsql-dbname=powerdns
gpgsql-user=powerdns
gpgsql-password=secret
gpgsql-dnssec=yes
```

### SQLite3 Backend Setup

```ini
launch=gsqlite3
gsqlite3-database=/var/lib/powerdns/pdns.sqlite3
gsqlite3-dnssec=yes
```

**Initialize:**
```bash
sqlite3 /var/lib/powerdns/pdns.sqlite3 < /usr/share/doc/pdns-backend-sqlite3/schema.sqlite3.sql
```

### BIND Backend (Zone Files)

```ini
launch=bind
bind-config=/etc/powerdns/named.conf
```

## Zone Management

### Create Zone with pdnsutil

```bash
# Create primary zone
pdnsutil create-zone example.com ns1.example.com

# Add records
pdnsutil add-record example.com @ A 3600 192.0.2.1
pdnsutil add-record example.com @ MX 3600 "10 mail.example.com"
pdnsutil add-record example.com www A 3600 192.0.2.2
pdnsutil add-record example.com mail A 3600 192.0.2.3

# Verify zone
pdnsutil check-zone example.com
```

### Create Secondary Zone

```bash
pdnsutil create-secondary-zone example.com 192.0.2.10
```

### Zone Operations

```bash
# List all zones
pdnsutil list-all-zones

# Show zone details
pdnsutil show-zone example.com

# Edit zone interactively
pdnsutil edit-zone example.com

# Delete zone
pdnsutil delete-zone example.com

# Export zone
pdnsutil list-zone example.com

# Load from zone file
pdnsutil load-zone example.com /path/to/example.com.zone
```

## DNSSEC

### Enable DNSSEC

```bash
# Secure zone with default settings (ECDSA256)
pdnsutil secure-zone example.com

# Show DS records for registrar
pdnsutil show-zone example.com

# Rectify zone (fix DNSSEC metadata)
pdnsutil rectify-zone example.com
```

### Key Management

```bash
# List keys
pdnsutil list-keys example.com

# Add KSK
pdnsutil add-zone-key example.com ksk active ecdsa384

# Add ZSK
pdnsutil add-zone-key example.com zsk active ecdsa256

# Key rollover
pdnsutil activate-zone-key example.com 12345
pdnsutil deactivate-zone-key example.com 12344
pdnsutil remove-zone-key example.com 12344

# Export DS record
pdnsutil export-zone-ds example.com
```

### NSEC3 Configuration

```bash
# Enable NSEC3
pdnsutil set-nsec3 example.com '1 0 10 abcd'

# Parameters: algorithm flags iterations salt
# Disable NSEC3 (use NSEC)
pdnsutil unset-nsec3 example.com
```

### Supported Algorithms

| Algorithm | Name | Recommendation |
|-----------|------|----------------|
| 13 | ECDSAP256SHA256 | Recommended (default) |
| 14 | ECDSAP384SHA384 | High security |
| 15 | ED25519 | Modern, fast |
| 16 | ED448 | Highest security |
| 8 | RSASHA256 | Legacy compatibility |

## HTTP API

### Enable API

```ini
# /etc/powerdns/pdns.conf
api=yes
api-key=your-secret-key
webserver=yes
webserver-address=127.0.0.1
webserver-port=8081
webserver-allow-from=127.0.0.1,::1
```

### API Examples

**List zones:**
```bash
curl -H 'X-API-Key: your-secret-key' \
  http://127.0.0.1:8081/api/v1/servers/localhost/zones
```

**Create zone:**
```bash
curl -X POST -H 'X-API-Key: your-secret-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "example.com.",
    "kind": "Native",
    "nameservers": ["ns1.example.com.", "ns2.example.com."]
  }' \
  http://127.0.0.1:8081/api/v1/servers/localhost/zones
```

**Add records:**
```bash
curl -X PATCH -H 'X-API-Key: your-secret-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "rrsets": [{
      "name": "www.example.com.",
      "type": "A",
      "ttl": 3600,
      "changetype": "REPLACE",
      "records": [{"content": "192.0.2.1", "disabled": false}]
    }]
  }' \
  http://127.0.0.1:8081/api/v1/servers/localhost/zones/example.com.
```

**Delete record:**
```bash
curl -X PATCH -H 'X-API-Key: your-secret-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "rrsets": [{
      "name": "www.example.com.",
      "type": "A",
      "changetype": "DELETE"
    }]
  }' \
  http://127.0.0.1:8081/api/v1/servers/localhost/zones/example.com.
```

**Trigger AXFR:**
```bash
curl -X PUT -H 'X-API-Key: your-secret-key' \
  http://127.0.0.1:8081/api/v1/servers/localhost/zones/example.com./axfr-retrieve
```

**Send NOTIFY:**
```bash
curl -X PUT -H 'X-API-Key: your-secret-key' \
  http://127.0.0.1:8081/api/v1/servers/localhost/zones/example.com./notify
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/servers` | List servers |
| GET | `/api/v1/servers/{id}/zones` | List zones |
| POST | `/api/v1/servers/{id}/zones` | Create zone |
| GET | `/api/v1/servers/{id}/zones/{zone}` | Get zone |
| PUT | `/api/v1/servers/{id}/zones/{zone}` | Update zone |
| DELETE | `/api/v1/servers/{id}/zones/{zone}` | Delete zone |
| PATCH | `/api/v1/servers/{id}/zones/{zone}` | Modify records |
| PUT | `/api/v1/servers/{id}/zones/{zone}/axfr-retrieve` | Trigger AXFR |
| PUT | `/api/v1/servers/{id}/zones/{zone}/notify` | Send NOTIFY |
| GET | `/api/v1/servers/{id}/zones/{zone}/export` | Export zone |

## Dynamic DNS Updates (RFC 2136)

### Enable DNS Updates

```ini
# /etc/powerdns/pdns.conf
dnsupdate=yes
allow-dnsupdate-from=127.0.0.0/8,10.0.0.0/8
```

### TSIG Authentication

```bash
# Generate TSIG key
pdnsutil generate-tsig-key mykey hmac-sha512

# Allow key for zone updates
pdnsutil set-meta example.com TSIG-ALLOW-DNSUPDATE mykey

# Per-zone IP restrictions
pdnsutil set-meta example.com ALLOW-DNSUPDATE-FROM 10.0.0.0/8
```

### nsupdate Example

```bash
nsupdate -k /etc/powerdns/mykey.key << EOF
server 127.0.0.1
zone example.com
update add test.example.com 3600 A 192.0.2.100
send
EOF
```

### SOA Serial Updates

```bash
# Configure auto-increment behavior
pdnsutil set-meta example.com SOA-EDIT-DNSUPDATE INCREASE
```

Options: `DEFAULT`, `INCREASE`, `EPOCH`, `SOA-EDIT`

## Lua Records

### Enable Lua Records

```ini
# /etc/powerdns/pdns.conf
enable-lua-records=yes
```

Or per-zone:
```bash
pdnsutil set-meta example.com ENABLE-LUA-RECORDS 1
```

### Basic Examples

**Health-checked A record:**
```
www  IN  LUA  A  "ifportup(443, {'192.0.2.1', '192.0.2.2'})"
```

**Geographic routing:**
```
www  IN  LUA  A  "pickclosest({'192.0.2.1', '198.51.100.1', '203.0.113.1'})"
```

**Random selection:**
```
www  IN  LUA  A  "pickrandom({'192.0.2.1', '192.0.2.2', '192.0.2.3'})"
```

**Weighted selection:**
```
www  IN  LUA  A  "pickwrandom({{'192.0.2.1', 80}, {'192.0.2.2', 20}})"
```

**Health check with fallback:**
```
www  IN  LUA  A  "ifportup(80, {'192.0.2.1','192.0.2.2'}, {selector='pickclosest'})"
```

### Available Functions

| Function | Description |
|----------|-------------|
| `ifportup(port, addrs)` | Return IPs with open port |
| `ifurlup(url, addrs)` | Return IPs with valid HTTP response |
| `pickclosest(addrs)` | Return geographically closest |
| `pickrandom(addrs)` | Random selection |
| `pickwrandom(addrs)` | Weighted random |
| `pickhashed(addrs)` | Consistent hash based on query |
| `country(code)` | Check if client is in country |
| `continent(code)` | Check if client is in continent |
| `asnum(asn)` | Check client ASN |

## Primary/Secondary Configuration

### Primary Server

```ini
# /etc/powerdns/pdns.conf
primary=yes
secondary=no
xfr-cycle-interval=60
allow-axfr-ips=192.0.2.10/32,192.0.2.11/32
```

### Secondary Server

```ini
# /etc/powerdns/pdns.conf
primary=no
secondary=yes
autosecondary=yes
allow-notify-from=192.0.2.1/32
```

### Create Secondary Zone

```bash
pdnsutil create-secondary-zone example.com 192.0.2.1
```

### TSIG for Zone Transfers

```bash
# On primary: generate key
pdnsutil generate-tsig-key axfr-key hmac-sha256

# On primary: allow TSIG for zone
pdnsutil set-meta example.com TSIG-ALLOW-AXFR axfr-key

# On secondary: import key
pdnsutil import-tsig-key axfr-key hmac-sha256 "base64-key-here"

# On secondary: use TSIG for transfers
pdnsutil set-meta example.com AXFR-MASTER-TSIG axfr-key
```

## Configuration Reference

### Network Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `local-address` | `0.0.0.0, ::` | Listen addresses |
| `local-port` | `53` | Listen port |
| `receiver-threads` | `1` | Listener threads |
| `tcp-fast-open` | `0` | TCP Fast Open size |

### Performance Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `cache-ttl` | `20` | Packet cache TTL (seconds) |
| `max-cache-entries` | `1000000` | Maximum cache size |
| `distributor-threads` | `3` | Backend threads per receiver |
| `query-cache-ttl` | `20` | Query cache TTL |

### Security Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `allow-axfr-ips` | `127.0.0.0/8,::1` | AXFR allowed IPs |
| `allow-notify-from` | `0.0.0.0/0,::/0` | NOTIFY allowed IPs |
| `allow-dnsupdate-from` | `127.0.0.0/8,::1` | DNS update allowed IPs |

### DNSSEC Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `default-ksk-algorithm` | `ecdsa256` | Default KSK algorithm |
| `default-zsk-algorithm` | (empty) | Default ZSK algorithm |
| `max-nsec3-iterations` | `100` | Max NSEC3 iterations |

## Troubleshooting

### Check Server Status

```bash
# Ping server
pdns_control ping

# Backend connectivity
pdns_control rping

# Show configuration
pdns_control show
```

### Debug Queries

```bash
# Trace query
pdns_control trace-regex '.*example.com.*'

# View logs
journalctl -u pdns -f
```

### Validate Zones

```bash
# Check zone
pdnsutil check-zone example.com

# Check all zones
pdnsutil check-all-zones

# Rectify DNSSEC
pdnsutil rectify-all-zones
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Backend connection failed | Check database credentials and connectivity |
| AXFR refused | Verify `allow-axfr-ips` includes secondary |
| DNSSEC validation fails | Run `pdnsutil rectify-zone` |
| Records not updating | Check SOA serial; use `pdns_control reload` |

## When to Use This Skill

- Setting up authoritative DNS servers
- Configuring DNSSEC for zones
- Integrating DNS with databases (MySQL, PostgreSQL)
- Implementing dynamic DNS updates
- Building geographic DNS routing with Lua records
- Managing primary/secondary DNS infrastructure
- Using PowerDNS REST API for automation

## Resources

- [Official Documentation](https://doc.powerdns.com/authoritative/)
- [GitHub Repository](https://github.com/PowerDNS/pdns)
- [PowerDNS Blog](https://blog.powerdns.com/)
- [Community Support](https://github.com/PowerDNS/pdns/discussions)
- IRC: #powerdns on irc.oftc.net
