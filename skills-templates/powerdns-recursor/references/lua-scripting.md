# PowerDNS Recursor Lua Scripting Reference

Complete reference for Lua scripting in PowerDNS Recursor.

## Configuration

### Enable Lua Scripts

```yaml
# recursor.yml
recursor:
  lua_dns_script: /etc/powerdns/dns-script.lua    # Query processing
  lua_config_file: /etc/powerdns/config.lua       # Configuration (RPZ)
  lua_maintenance_interval: 1                      # Maintenance callback interval
```

```ini
# recursor.conf
lua-dns-script=/etc/powerdns/dns-script.lua
lua-config-file=/etc/powerdns/config.lua
lua-maintenance-interval=1
```

## Hook Functions

### Hook Execution Order

```
1. ipfilter()       - Before parsing, drop packets
2. gettag()         - Determine cache location
3. prerpz()         - Before RPZ policies
4. preresolve()     - Before resolution
5. preoutquery()    - Before each outgoing query
6. [Resolution happens]
7. nxdomain()       - If NXDOMAIN
8. nodata()         - If empty answer
9. postresolve()    - Before sending response
10. policyEventFilter() - When policy triggers
```

## ipfilter(remoteip, localip, dh)

Called immediately after packet cache check, before parsing.

**Parameters:**
- `remoteip` (ComboAddress) - Client IP address
- `localip` (ComboAddress) - Server IP receiving query
- `dh` (DNSHeader) - Query header

**Returns:** `true` to drop packet, `false` to allow

**Example - Block IP ranges:**
```lua
badips = newNMG()
badips:addMask("192.0.2.0/24")
badips:addMask("198.51.100.0/24")

function ipfilter(rem, loc, dh)
    return badips:match(rem)
end
```

**Example - Block queries with AD bit:**
```lua
function ipfilter(rem, loc, dh)
    return dh:getAD()
end
```

## gettag(remote, ednssubnet, localip, qname, qtype, ednsoptions, tcp, proxyprotocolvalues)

Called to determine packet cache location and assign tags.

**Parameters:**
- `remote` (ComboAddress) - Client IP
- `ednssubnet` (Netmask) - EDNS Client Subnet
- `localip` (ComboAddress) - Server IP
- `qname` (DNSName) - Query domain
- `qtype` (int) - Query type
- `ednsoptions` (table) - EDNS options
- `tcp` (bool) - True if TCP
- `proxyprotocolvalues` (table) - Proxy protocol values

**Returns:** Integer tag, optional policy data, optional device ID/name

**Example - Tag by subnet:**
```lua
function gettag(remote, ednssubnet, localip, qname, qtype, ednsoptions, tcp)
    if remote:isPartOf(newNM("10.0.0.0/8")) then
        return 1  -- Internal
    else
        return 2  -- External
    end
end
```

## preresolve(dq)

Called before resolution begins.

**Parameters:** `dq` (DNSQuestion)

**Returns:** `true` if query modified, `false` to continue normal resolution

**Example - Block domains:**
```lua
blocklist = newDS()
blocklist:add("malware.com")
blocklist:add("ads.example.net")

function preresolve(dq)
    if blocklist:check(dq.qname) then
        dq.rcode = pdns.NXDOMAIN
        return true
    end
    return false
end
```

**Example - Respond with static answer:**
```lua
function preresolve(dq)
    if dq.qname:equal("internal.local") and dq.qtype == pdns.A then
        dq:addAnswer(pdns.A, "192.168.1.1", 300)
        return true
    end
    return false
end
```

**Example - Log all queries:**
```lua
function preresolve(dq)
    pdnslog("Query: " .. dq.qname:toString() ..
            " type=" .. dq.qtype ..
            " from=" .. dq.remoteaddr:toString())
    return false
end
```

## postresolve(dq)

Called after resolution, before sending response.

**Parameters:** `dq` (DNSQuestion)

**Returns:** `true` if response modified, `false` to send as-is

**Example - Modify A records:**
```lua
function postresolve(dq)
    local records = dq:getRecords()
    local modified = false

    for k, v in pairs(records) do
        if v.type == pdns.A and v.content == "203.0.113.1" then
            v:changeContent("10.0.0.1")
            v.ttl = 60
            modified = true
        end
    end

    if modified then
        dq:setRecords(records)
        return true
    end
    return false
end
```

**Example - Add records:**
```lua
function postresolve(dq)
    if dq.qname:isPartOf(newDN("example.com")) then
        dq:addRecord(pdns.TXT, '"Modified by Lua"', pdns.place.ADDITIONAL, 300)
        return true
    end
    return false
end
```

## nxdomain(dq)

Called when resolution returns NXDOMAIN.

**Parameters:** `dq` (DNSQuestion)

**Returns:** `true` if handled, `false` to return NXDOMAIN

**Example - Redirect NXDOMAIN:**
```lua
function nxdomain(dq)
    -- Redirect all NXDOMAIN to search page
    if dq.qtype == pdns.A then
        dq.rcode = 0
        dq:addAnswer(pdns.A, "192.168.1.100", 60)
        return true
    end
    return false
end
```

**Example - Synthesize internal domains:**
```lua
function nxdomain(dq)
    if dq.qname:isPartOf(newDN("internal.corp")) then
        dq.rcode = 0
        dq:addAnswer(pdns.A, "10.0.0.1", 300)
        return true
    end
    return false
end
```

## nodata(dq)

Called when resolution returns empty answer (NODATA).

**Parameters:** `dq` (DNSQuestion)

**Returns:** `true` if handled, `false` to return NODATA

**Example - Synthesize AAAA from A:**
```lua
function nodata(dq)
    if dq.qtype == pdns.AAAA then
        -- Trigger DNS64 synthesis
        dq.followupFunction = "getFakeAAAARecords"
        dq.followupPrefix = "64:ff9b::"
        dq.followupName = dq.qname
        return true
    end
    return false
end
```

## preoutquery(dq)

Called before each outgoing authoritative query.

**Parameters:** `dq` (DNSQuestion)

**Returns:** `true` if modified, `false` to continue

**Note:** Setting `dq.rcode = -3` aborts the entire client query.

**Example - Block queries to specific nameservers:**
```lua
function preoutquery(dq)
    if dq.remoteaddr:isPartOf(newNM("192.0.2.0/24")) then
        dq.rcode = -3  -- Abort
        return true
    end
    return false
end
```

## prerpz(dq)

Called before RPZ policies are applied.

**Parameters:** `dq` (DNSQuestion)

**Returns:** `true` to bypass RPZ, `false` to apply normally

**Example - Bypass RPZ for specific clients:**
```lua
function prerpz(dq)
    if dq.remoteaddr:isPartOf(newNM("10.0.0.0/24")) then
        -- Skip all RPZ policies for this subnet
        return true
    end

    -- Skip specific policy for internal domains
    if dq.qname:isPartOf(newDN("internal.corp")) then
        dq:discardPolicy("blocklist")
    end

    return false
end
```

## policyEventFilter(event)

Called when an RPZ or filtering policy matches.

**Parameters:** `event` (PolicyEvent)

**Returns:** `true` to ignore policy, `false` to apply

**Example - Override policy for trusted domains:**
```lua
function policyEventFilter(event)
    if event.qname:isPartOf(newDN("trusted.example.com")) then
        event.appliedPolicy.policyKind = pdns.policykinds.NoAction
        return true
    end
    return false
end
```

## maintenance()

Called periodically based on `lua_maintenance_interval`.

**Parameters:** None
**Returns:** None

**Example - Reload blocklist:**
```lua
function maintenance()
    -- Reload external blocklist
    blocklist = newDS()
    for line in io.lines("/etc/powerdns/blocklist.txt") do
        blocklist:add(line)
    end
    pdnslog("Blocklist reloaded")
end
```

## DNSQuestion Object

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `dq.qname` | DNSName | Query domain name |
| `dq.qtype` | int | Query type (pdns.A, pdns.AAAA, etc.) |
| `dq.qclass` | int | Query class |
| `dq.rcode` | int | Response code |
| `dq.remoteaddr` | ComboAddress | Client IP |
| `dq.localaddr` | ComboAddress | Server IP |
| `dq.variable` | bool | Set true to disable caching |
| `dq.wantsRPZ` | bool | Whether RPZ should apply |
| `dq.tag` | int | Tag from gettag() |
| `dq.requestorId` | string | Requestor ID |
| `dq.deviceId` | string | Device ID |
| `dq.deviceName` | string | Device name |
| `dq.appliedPolicy` | Policy | Currently applied policy |
| `dq.followupFunction` | string | Function for async processing |
| `dq.followupName` | DNSName | Domain for followup |
| `dq.followupPrefix` | string | Prefix for followup |
| `dq.udpAnswer` | string | UDP query response |
| `dq.udpCallback` | string | UDP callback function |

### Methods

| Method | Description |
|--------|-------------|
| `dq:addAnswer(type, content, [ttl], [name])` | Add answer record |
| `dq:addRecord(type, content, place, [ttl], [name])` | Add record to specific section |
| `dq:getRecords()` | Get all response records |
| `dq:setRecords(records)` | Replace response records |
| `dq:getEDNSOption(code)` | Get EDNS option value |
| `dq:getEDNSOptions()` | Get all EDNS options |
| `dq:getEDNSSubnet()` | Get EDNS Client Subnet |
| `dq:getEDNSFlags()` | Get EDNS flags |
| `dq:getDH()` | Get DNS header |
| `dq:addPolicyTag(tag)` | Add policy tag |
| `dq:getPolicyTags()` | Get policy tags |
| `dq:discardPolicy(name)` | Skip named policy |

### Record Placement

```lua
pdns.place.ANSWER      -- Answer section
pdns.place.AUTHORITY   -- Authority section
pdns.place.ADDITIONAL  -- Additional section
```

## DNSName Object

### Creation

```lua
local name = newDN("example.com")
local name = newDN("example.com.")  -- With trailing dot
```

### Methods

| Method | Description |
|--------|-------------|
| `name:toString()` | Convert to string |
| `name:toStringNoDot()` | String without trailing dot |
| `name:equal(other)` | Exact match |
| `name:isPartOf(parent)` | Is subdomain of parent |
| `name:countLabels()` | Number of labels |
| `name:getRawLabels()` | Get label array |
| `name:chopOff()` | Remove leftmost label |
| `name:canonCompare(other)` | Canonical comparison |

**Example:**
```lua
local qname = newDN("www.example.com")
qname:isPartOf(newDN("example.com"))  -- true
qname:isPartOf(newDN("com"))          -- true
qname:equal(newDN("www.example.com")) -- true
```

## ComboAddress Object

### Creation

```lua
local addr = newCA("192.0.2.1")
local addr = newCA("2001:db8::1")
local addr = newCA("192.0.2.1:5353")  -- With port
```

### Methods

| Method | Description |
|--------|-------------|
| `addr:toString()` | IP as string |
| `addr:toStringWithPort()` | IP:port as string |
| `addr:getPort()` | Get port number |
| `addr:isIPv4()` | True if IPv4 |
| `addr:isIPv6()` | True if IPv6 |
| `addr:isMappedIPv4()` | True if IPv4-mapped IPv6 |
| `addr:truncate(bits)` | Truncate to network |

## NetmaskGroup Object

For IP range matching.

### Creation

```lua
local nmg = newNMG()
nmg:addMask("192.0.2.0/24")
nmg:addMask("10.0.0.0/8")
nmg:addMask("2001:db8::/32")
```

### Methods

| Method | Description |
|--------|-------------|
| `nmg:addMask(mask)` | Add network/mask |
| `nmg:match(addr)` | Check if address matches |
| `nmg:toString()` | String representation |

**Example:**
```lua
local internal = newNMG()
internal:addMask("10.0.0.0/8")
internal:addMask("172.16.0.0/12")
internal:addMask("192.168.0.0/16")

function preresolve(dq)
    if not internal:match(dq.remoteaddr) then
        -- External client
        dq.rcode = pdns.REFUSED
        return true
    end
    return false
end
```

## SuffixMatchGroup (Domain Sets)

For domain suffix matching.

### Creation

```lua
local domains = newDS()
domains:add("example.com")
domains:add("blocked.net")
```

### Methods

| Method | Description |
|--------|-------------|
| `ds:add(domain)` | Add domain |
| `ds:check(name)` | Check if name matches |
| `ds:toString()` | String representation |

**Example:**
```lua
local blocklist = newDS()
blocklist:add("malware.com")
blocklist:add("ads.example.net")
blocklist:add("tracking.org")

function preresolve(dq)
    if blocklist:check(dq.qname) then
        dq.rcode = pdns.NXDOMAIN
        return true
    end
    return false
end
```

## DNS Record Types

```lua
pdns.A          -- 1
pdns.AAAA       -- 28
pdns.CNAME      -- 5
pdns.MX         -- 15
pdns.NS         -- 2
pdns.PTR        -- 12
pdns.SOA        -- 6
pdns.SRV        -- 33
pdns.TXT        -- 16
pdns.CAA        -- 257
pdns.DNSKEY     -- 48
pdns.DS         -- 43
pdns.NSEC       -- 47
pdns.NSEC3      -- 50
pdns.RRSIG      -- 46
```

## Response Codes

```lua
pdns.NOERROR    -- 0
pdns.FORMERR    -- 1
pdns.SERVFAIL   -- 2
pdns.NXDOMAIN   -- 3
pdns.NOTIMP     -- 4
pdns.REFUSED    -- 5
```

## Logging

```lua
pdnslog("Message")                     -- Info level
pdnslog("Message", pdns.loglevels.Debug)
pdnslog("Message", pdns.loglevels.Info)
pdnslog("Message", pdns.loglevels.Warning)
pdnslog("Message", pdns.loglevels.Error)
```

## Complete Examples

### Rate Limiting by Source

```lua
local querycount = {}
local lastclean = os.time()

function preresolve(dq)
    local now = os.time()
    local client = dq.remoteaddr:toString()

    -- Clean every minute
    if now - lastclean > 60 then
        querycount = {}
        lastclean = now
    end

    -- Count queries
    querycount[client] = (querycount[client] or 0) + 1

    -- Rate limit at 100 qps
    if querycount[client] > 6000 then  -- 100/sec * 60sec
        dq.rcode = pdns.REFUSED
        return true
    end

    return false
end
```

### Dynamic DNS Blackhole

```lua
local blackhole = newDS()

function loadBlacklist()
    blackhole = newDS()
    for line in io.lines("/etc/powerdns/blacklist.txt") do
        local domain = line:match("^%s*(.-)%s*$")
        if domain and domain ~= "" and not domain:match("^#") then
            blackhole:add(domain)
        end
    end
    pdnslog("Loaded blacklist with " .. #blackhole .. " domains")
end

-- Load on startup
loadBlacklist()

function maintenance()
    loadBlacklist()
end

function preresolve(dq)
    if blackhole:check(dq.qname) then
        dq.rcode = pdns.NXDOMAIN
        return true
    end
    return false
end
```

### Geographic Response

```lua
-- Requires GeoIP database
local geoip = require("geoip")
local db = geoip.open("/usr/share/GeoIP/GeoLite2-Country.mmdb")

local servers = {
    US = "192.0.2.1",
    EU = "198.51.100.1",
    APAC = "203.0.113.1",
    DEFAULT = "192.0.2.1"
}

function preresolve(dq)
    if dq.qname:equal("geo.example.com") and dq.qtype == pdns.A then
        local country = db:query(dq.remoteaddr:toString())
        local server = servers[country] or servers.DEFAULT
        dq:addAnswer(pdns.A, server, 300)
        return true
    end
    return false
end
```
