# Cloudflare Web Analytics

> Privacy-first, free web analytics with Core Web Vitals, real user monitoring, and automatic SPA support.

## Quick Reference

### Key Features

| Feature | Description |
|---------|-------------|
| **Privacy-First** | No cookies, no personal data, no fingerprinting |
| **Free** | Available on all Cloudflare plans including free |
| **Core Web Vitals** | LCP, CLS, INP, FCP metrics |
| **SPA Support** | Automatic single-page application tracking |
| **No DNS Required** | Works without Cloudflare proxy |
| **6-Month Retention** | Historical data access |

### Setup Methods

| Method | When to Use |
|--------|------------|
| **Automatic** | Sites proxied through Cloudflare |
| **Manual JS** | Non-proxied sites, custom control |
| **Pages** | Cloudflare Pages projects (one-click) |

## Installation

### Automatic Setup (Proxied Sites)

For sites already using Cloudflare's proxy:

1. Go to **Analytics & Logs** > **Web Analytics** in Cloudflare dashboard
2. Select your hostname from the dropdown
3. Web Analytics is enabled by default

**Note:** Sites with `Cache-Control: public, no-transform` headers require manual setup.

### Manual JavaScript Snippet

Add before the closing `</body>` tag:

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_SITE_TOKEN"}'
></script>
```

**Get your token:**
1. Go to **Web Analytics** in Cloudflare dashboard
2. Click **Add a site**
3. Enter your hostname
4. Copy the generated snippet

### Cloudflare Pages

1. Go to your Pages project
2. Navigate to **Metrics** section
3. Click **Enable Web Analytics**
4. Analytics automatically added on next deployment

## Beacon Configuration

### Basic Configuration

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN"}'
></script>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | string | required | Your site token |
| `spa` | boolean | `true` | Enable SPA tracking |

### Disable SPA Tracking

**Using data attribute:**
```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN", "spa": false}'
></script>
```

**Using query string (GTM):**
```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js?token=YOUR_TOKEN&spa=false"
></script>
```

## Single Page Application (SPA) Support

### How It Works

Cloudflare Web Analytics automatically tracks SPA navigation by:
1. Overriding the `pushState` method
2. Listening to `onpopstate` events
3. Sending measurements when routes change

Route changes send data for the previous route to the beacon endpoint. The last route measurement is sent when the user leaves the tab using `Navigator.sendBeacon`.

### Supported Frameworks

| Framework | Support |
|-----------|---------|
| React | Full |
| Vue.js | Full |
| Angular | Full |
| Next.js | Full |
| Nuxt.js | Full |
| Hash-based routers | Not supported |

### Limitations

- **Hash-based routing** not supported (e.g., `example.com/#/page`)
- Older browsers fall back to AJAX, which can lose final route data
- Network conditions may cause occasional data loss

## Metrics & Dimensions

### High-Level Metrics

| Metric | Description |
|--------|-------------|
| **Visits** | Page view from different website or direct link |
| **Page Views** | Successful HTTP response with HTML content-type |
| **Page Load Time** | Total time required to load the page |
| **Core Web Vitals** | Google's user experience metrics |

### Core Web Vitals

| Metric | Description | Rating |
|--------|-------------|--------|
| **LCP** (Largest Contentful Paint) | Main content load time | Good/Needs Improvement/Poor |
| **INP** (Interaction to Next Paint) | UI responsiveness to interactions | Good/Needs Improvement/Poor |
| **CLS** (Cumulative Layout Shift) | Visual stability during load | Good/Needs Improvement/Poor |

**Note:** Core Web Vitals currently only work in Chromium browsers. Safari and Firefox support coming soon.

### Additional Performance Metrics

| Metric | Description |
|--------|-------------|
| **FCP** (First Contentful Paint) | Time to first content render |
| **TTFB** (Time to First Byte) | Server response time |
| **First Paint** | Time to any visual change |

### Available Dimensions

| Dimension | Description |
|-----------|-------------|
| **Country** | Visitor's country |
| **Host** | Domain of the site's URL |
| **Path** | Internal links referring visits |
| **Referer** | External links referring visits |
| **Device Type** | Desktop, mobile, or tablet |
| **Browser** | Chrome, Safari, Firefox, etc. |
| **Operating System** | Windows, macOS, iOS, Android, etc. |
| **Site** | Website's domain name |

### Bot Filtering

Enable **Exclude Bots** filter to remove automated traffic for accurate user metrics.

## Dashboard Features

### Filtering Data

1. Navigate to **Web Analytics**
2. Select your website
3. Click **Add filter**
4. Choose dimension from dropdown
5. Click **Apply**

### Time Range Selection

- Default: Previous 24 hours
- Use dropdown to select preset ranges
- Drag on graphs to select custom periods

### Data Breakdown

Below visualizations, view detailed breakdowns by:
- Country
- Device type
- Browser
- Path
- Referrer

## Rules Configuration

### Creating Rules

Rules control tracking for specific websites or paths:

1. Go to **Web Analytics** > **Manage site**
2. Select **Advanced options**
3. Click **Add rule**
4. Specify action and hostname/path
5. Click **Update**

**Note:** Rules are only available for sites proxied through Cloudflare.

### Rule Precedence

Configuration rules take priority over Web Analytics rules. If a configuration rule disables tracking, it overrides any Web Analytics rule enabling it.

## Privacy Features

### Data Collection

Cloudflare Web Analytics is designed with privacy in mind:

- **No cookies** stored in browser
- **No personal data** collected
- **No localStorage/sessionStorage** access
- **No IP address** logging
- **No fingerprinting** techniques

### EU Visitor Exclusion

Exclude visitors from EU data centers:

1. Go to **Web Analytics** > **Manage site**
2. Enable **EU visitor exclusion**

Free plan customers have EU traffic automatically excluded.

### Query String Handling

Query strings are **not logged** to avoid collecting potentially sensitive data. UTM parameter support may be added in the future.

## GraphQL API

### Endpoint

```
POST https://api.cloudflare.com/client/v4/graphql
```

### Authentication

**API Token (Recommended):**
```bash
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "..."}'
```

**API Key:**
```bash
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "X-Auth-Email: your@email.com" \
  -H "X-Auth-Key: YOUR_GLOBAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "..."}'
```

### Query Structure

```graphql
{
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      # Dataset and fields
    }
  }
}
```

### Basic Query Example

```graphql
query {
  viewer {
    zones(filter: { zoneTag: "YOUR_ZONE_ID" }) {
      httpRequestsAdaptiveGroups(
        filter: {
          datetime_gt: "2024-01-01T00:00:00Z"
          datetime_lt: "2024-01-02T00:00:00Z"
        }
        limit: 10
        orderBy: [datetime_DESC]
      ) {
        dimensions {
          datetime
          deviceType
        }
        count
      }
    }
  }
}
```

### Query Variables

```json
{
  "query": "query($zoneTag: String!, $start: Time!, $end: Time!) { ... }",
  "variables": {
    "zoneTag": "YOUR_ZONE_ID",
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-02T00:00:00Z"
  }
}
```

### Common Filters

| Filter | Description |
|--------|-------------|
| `datetime_gt` | Greater than timestamp |
| `datetime_lt` | Less than timestamp |
| `date` | Specific date |
| `limit` | Maximum results |
| `orderBy` | Sort order (e.g., `datetime_DESC`) |

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS errors | Hostname mismatch | Verify hostname matches configured site |
| No data appearing | Ad-blockers | Use automatic injection for proxied sites |
| Missing final route | SPA data loss | Expected behavior in older browsers |
| Automatic setup fails | Cache headers | Use manual JS snippet instead |

### Ad-Blocker Impact

The JavaScript beacon may be blocked by:
- AdBlock Plus
- Brave browser
- DuckDuckGo extension

**Solution:** For proxied sites, use automatic injection (edge analytics cannot be blocked).

### Hostname Verification

Cloudflare uses postfix matching for hostname validation. Ensure your domain exactly matches the configured analytics site.

### Cache-Control Issues

Automatic injection doesn't work with:
```
Cache-Control: public, no-transform
```

**Solution:** Use manual JavaScript snippet installation.

## Limitations

| Limitation | Details |
|------------|---------|
| **Account limit** | Soft limit of 10 sites per account (contact support to increase) |
| **Single snippet** | Only one JS snippet per page |
| **Custom events** | Not currently supported |
| **UTM parameters** | Not yet supported |
| **Hash routing** | Not supported for SPAs |
| **Browser support** | Core Web Vitals require Chromium |

## Best Practices

### 1. Use Automatic Setup When Possible

For proxied sites, automatic injection provides:
- Ad-blocker resistance (edge measurement)
- No code changes needed
- Automatic updates

### 2. Place Script Correctly

```html
<body>
  <!-- Your content -->

  <!-- Place beacon just before closing body tag -->
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token": "YOUR_TOKEN"}'
  ></script>
</body>
```

### 3. Verify SPA Compatibility

Before deployment, confirm your SPA uses History API routing (not hash-based).

### 4. Monitor Core Web Vitals

Regularly check CWV scores and address:
- **Poor LCP**: Optimize largest content element loading
- **Poor INP**: Reduce JavaScript execution time
- **Poor CLS**: Reserve space for dynamic content

### 5. Use Bot Filtering

Enable bot exclusion for accurate user metrics in production environments.

## Integration Examples

### React Application

```jsx
// public/index.html
<!DOCTYPE html>
<html>
<head>
  <title>My React App</title>
</head>
<body>
  <div id="root"></div>
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token": "YOUR_TOKEN"}'
  ></script>
</body>
</html>
```

### Next.js

```jsx
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "YOUR_TOKEN"}'
        />
      </body>
    </Html>
  )
}
```

### Vue.js (Vite)

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My Vue App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token": "YOUR_TOKEN"}'
  ></script>
</body>
</html>
```

### Google Tag Manager

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js?token=YOUR_TOKEN"
></script>
```

For SPA with GTM, disable SPA tracking if managing navigation events manually:
```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js?token=YOUR_TOKEN&spa=false"
></script>
```

## When to Use This Skill

- Setting up Cloudflare Web Analytics for websites
- Configuring analytics for single-page applications
- Implementing privacy-first analytics
- Querying analytics data via GraphQL API
- Troubleshooting Web Analytics issues
- Monitoring Core Web Vitals performance
- Integrating analytics with modern JavaScript frameworks

## Resources

- [Official Documentation](https://developers.cloudflare.com/web-analytics/)
- [GraphQL API Docs](https://developers.cloudflare.com/analytics/graphql-api/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Web Analytics Product Page](https://www.cloudflare.com/web-analytics/)
- [Community Forum](https://community.cloudflare.com/c/analytics/9)
