# Matomo Tracking HTTP API Reference

## Endpoint
```
https://your-matomo-domain.example/matomo.php
```

Accepts GET or POST requests with query parameters for tracking visits, page views, events, and conversions.

## Required Parameters

| Parameter | Description |
|-----------|-------------|
| `idsite` | Website ID being tracked (integer) |
| `rec` | Must be set to `1` to enable tracking |

## Recommended Parameters

| Parameter | Description |
|-----------|-------------|
| `action_name` | Title of the tracked action (page title for pageviews) |
| `url` | Full URL of the current action |
| `_id` | 16-character hexadecimal visitor ID |
| `rand` | Random value to prevent caching |
| `apiv` | API version (currently `1`) |

## User Identification

| Parameter | Description |
|-----------|-------------|
| `_id` | Unique visitor ID (16 hex chars, lowercase) |
| `uid` | User ID - identifies logged-in users across devices |
| `cid` | Forces visitor ID (requires token_auth) |
| `new_visit` | Set to `1` to force a new visit |

## Page View Parameters

| Parameter | Description |
|-----------|-------------|
| `action_name` | Page title |
| `url` | Page URL |
| `urlref` | Referrer URL |
| `_cvar` | Custom variables (JSON) |
| `_idvc` | Visit count for this visitor |
| `_viewts` | Unix timestamp of previous visit |
| `_idts` | Unix timestamp of first visit |
| `_rcn` | Campaign name |
| `_rck` | Campaign keyword |

## Page Performance Timing (milliseconds)

| Parameter | Description |
|-----------|-------------|
| `pf_net` | Network time |
| `pf_srv` | Server time |
| `pf_tfr` | Transfer time |
| `pf_dm1` | DOM interactive time |
| `pf_dm2` | DOM complete time |
| `pf_onl` | Onload time |

## Event Tracking

| Parameter | Description |
|-----------|-------------|
| `e_c` | Event category (required) |
| `e_a` | Event action (required) |
| `e_n` | Event name (optional) |
| `e_v` | Event value - numeric (optional) |

**Example:**
```
?idsite=1&rec=1&e_c=Videos&e_a=Play&e_n=Product Demo&e_v=1
```

## Content Tracking

| Parameter | Description |
|-----------|-------------|
| `c_n` | Content name |
| `c_p` | Content piece |
| `c_t` | Content target |
| `c_i` | Content interaction |

## Goal Conversion

| Parameter | Description |
|-----------|-------------|
| `idgoal` | Goal ID to trigger conversion |
| `revenue` | Monetary value for conversion |

**Example:**
```
?idsite=1&rec=1&idgoal=1&revenue=49.99
```

## Ecommerce Tracking

| Parameter | Description |
|-----------|-------------|
| `idgoal=0` | Indicates ecommerce order |
| `ec_id` | Order ID (required for orders) |
| `revenue` | Total order value (required) |
| `ec_st` | Subtotal |
| `ec_tx` | Tax amount |
| `ec_sh` | Shipping cost |
| `ec_dt` | Discount amount |
| `ec_items` | JSON array of items |

**Item Array Format:**
```json
[
  ["SKU123", "Product Name", "Category", 29.99, 2],
  ["SKU456", "Another Product", "Category2", 19.99, 1]
]
```

**Example:**
```
?idsite=1&rec=1&idgoal=0&ec_id=ORDER-001&revenue=79.97
&ec_items=[["SKU123","Widget","Electronics",29.99,2],["SKU456","Gadget","Electronics",19.99,1]]
```

## Site Search

| Parameter | Description |
|-----------|-------------|
| `search` | Search keyword |
| `search_cat` | Search category |
| `search_count` | Number of results |

## Link Tracking

| Parameter | Description |
|-----------|-------------|
| `link` | URL of the link |
| `download` | URL of the download |

## Device & Browser

| Parameter | Description |
|-----------|-------------|
| `res` | Screen resolution (e.g., "1920x1080") |
| `h` | Current hour (0-23) |
| `m` | Current minute (0-59) |
| `s` | Current second (0-59) |
| `ua` | User agent string |
| `lang` | Browser language |
| `cookie` | Set to `1` if cookies enabled |

## Geolocation (requires token_auth)

| Parameter | Description |
|-----------|-------------|
| `cip` | Override IP address |
| `country` | Two-letter country code |
| `region` | Region code |
| `city` | City name |
| `lat` | Latitude |
| `long` | Longitude |

## Custom Timestamp (requires token_auth)

| Parameter | Description |
|-----------|-------------|
| `cdt` | Datetime (Unix timestamp or ISO 8601) |

## Custom Variables

Format: JSON-encoded array
```json
{"1":["Name1","Value1"],"2":["Name2","Value2"]}
```

| Parameter | Scope |
|-----------|-------|
| `_cvar` | Visit scope |
| `cvar` | Page scope |

## Custom Dimensions

| Parameter | Description |
|-----------|-------------|
| `dimension1` | Custom dimension 1 value |
| `dimension2` | Custom dimension 2 value |
| `dimensionN` | Custom dimension N value |

## Authentication

| Parameter | Description |
|-----------|-------------|
| `token_auth` | API authentication token |

Required for: `cip`, `cdt`, `country`, `region`, `city`, `lat`, `long`, `cid`

## Bulk Tracking

Send multiple tracking requests in a single HTTP request:

```json
POST /matomo.php
Content-Type: application/json

{
  "requests": [
    "?idsite=1&rec=1&action_name=Page1&url=https://example.org/page1",
    "?idsite=1&rec=1&action_name=Page2&url=https://example.org/page2"
  ],
  "token_auth": "optional_auth_token"
}
```

## Bot Tracking (Matomo 5.7.0+)

| Parameter | Description |
|-----------|-------------|
| `recMode` | Controls bot vs. visit processing |
| `bots=1` | Forces normal visit tracking regardless of bot detection |

## Response

Successful tracking returns a 1x1 transparent GIF image.

To disable GIF response:
```
&send_image=0
```

## Debugging

Add `&debug=1` to see detailed processing information (requires token_auth).

## Complete Example

```
https://matomo.example.com/matomo.php
  ?idsite=1
  &rec=1
  &action_name=Product%20Page
  &url=https://example.org/products/widget
  &urlref=https://google.com/search?q=widget
  &_id=abc123def4567890
  &rand=123456789
  &apiv=1
  &e_c=Products
  &e_a=View
  &res=1920x1080
  &cookie=1
```
