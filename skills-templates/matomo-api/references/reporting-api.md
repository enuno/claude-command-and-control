# Matomo Reporting API Reference

## Endpoint

```
https://your-matomo-domain.example/index.php?module=API&method=MODULE.METHOD
```

## Authentication

### Token Authentication
```
&token_auth=YOUR_TOKEN
```

- Create tokens in: Administration > Personal > Security > Auth tokens
- Never share URLs containing tokens publicly
- Use POST requests with token in body for enhanced security

### Session Tokens
```
&force_api_session=1
```
Valid only while logged in to Matomo UI.

## Standard Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `idSite` | Integer or comma-separated | Website ID(s) |
| `period` | day, week, month, year, range | Time period |
| `date` | YYYY-MM-DD or magic keyword | Specific date |
| `format` | xml, json, csv, tsv, html, rss | Output format |
| `segment` | Segment expression | Filter visitors |
| `language` | Locale code (e.g., en, de) | Response language |

## Date Magic Keywords

| Keyword | Description |
|---------|-------------|
| `today` | Current date |
| `yesterday` | Previous day |
| `lastWeek` | Previous 7 days |
| `lastMonth` | Previous 30 days |
| `lastYear` | Previous 365 days |
| `lastX` | Last X days (e.g., `last7`) |
| `previousX` | Previous X days (e.g., `previous30`) |

### Date Ranges
```
&date=2024-01-01,2024-01-31
```

## Response Formats

| Format | Description |
|--------|-------------|
| `xml` | XML structured data |
| `json` | JSON structured data |
| `csv` | Comma-separated values |
| `tsv` | Tab-separated values |
| `html` | HTML table |
| `rss` | RSS feed (for time series) |
| `original` | Raw PHP data structure |

## Filtering Parameters

| Parameter | Description |
|-----------|-------------|
| `filter_limit` | Max rows returned (default: 100, -1 for all) |
| `filter_offset` | Skip first N rows |
| `filter_sort_column` | Column to sort by |
| `filter_sort_order` | asc or desc |
| `filter_pattern` | Regex pattern to match |
| `filter_pattern_recursive` | Apply pattern to subtables |
| `filter_column` | Column to apply pattern to |
| `filter_truncate` | Max rows per subtable |
| `hideColumns` | Comma-separated columns to hide |
| `showColumns` | Comma-separated columns to show |

## Data Structure Parameters

| Parameter | Description |
|-----------|-------------|
| `expanded` | Include subtables in response (1 or 0) |
| `flat` | Flatten hierarchical data (1 or 0) |
| `idSubtable` | Specific subtable to return |
| `pivotBy` | Pivot data by dimension |
| `pivotByColumn` | Column to use for pivot values |
| `pivotByColumnLimit` | Max pivot columns |

## Major API Modules

### VisitsSummary
Overall visit statistics.

```
?module=API&method=VisitsSummary.get&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `VisitsSummary.get` - All summary metrics
- `VisitsSummary.getVisits` - Total visits
- `VisitsSummary.getUniqueVisitors` - Unique visitors
- `VisitsSummary.getActions` - Total actions
- `VisitsSummary.getBounceCount` - Bounced visits

### Actions
Page views, downloads, outlinks.

```
?module=API&method=Actions.getPageUrls&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `Actions.getPageUrls` - Page URL report
- `Actions.getPageTitles` - Page title report
- `Actions.getEntryPageUrls` - Entry pages
- `Actions.getExitPageUrls` - Exit pages
- `Actions.getDownloads` - Download tracking
- `Actions.getOutlinks` - Outbound link tracking
- `Actions.getSiteSearchKeywords` - Site search terms

### Events
Custom event tracking.

```
?module=API&method=Events.getCategory&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `Events.getCategory` - Events by category
- `Events.getAction` - Events by action
- `Events.getName` - Events by name

### Referrers
Traffic sources.

```
?module=API&method=Referrers.getAll&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `Referrers.getAll` - All referrer data
- `Referrers.getReferrerType` - By referrer type
- `Referrers.getKeywords` - Search keywords
- `Referrers.getSearchEngines` - Search engines
- `Referrers.getWebsites` - Referring websites
- `Referrers.getSocials` - Social networks
- `Referrers.getCampaigns` - Marketing campaigns

### UserCountry
Geographic data.

```
?module=API&method=UserCountry.getCountry&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `UserCountry.getCountry` - By country
- `UserCountry.getRegion` - By region
- `UserCountry.getCity` - By city
- `UserCountry.getContinent` - By continent

### DevicesDetection
Device and browser information.

```
?module=API&method=DevicesDetection.getType&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `DevicesDetection.getType` - Device types
- `DevicesDetection.getBrand` - Device brands
- `DevicesDetection.getModel` - Device models
- `DevicesDetection.getOsFamilies` - OS families
- `DevicesDetection.getBrowsers` - Browser types
- `DevicesDetection.getBrowserVersions` - Browser versions

### Goals
Goal conversions.

```
?module=API&method=Goals.get&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `Goals.get` - All goals summary
- `Goals.getGoal` - Specific goal by ID
- `Goals.getItemsSku` - Ecommerce SKUs
- `Goals.getItemsName` - Ecommerce product names
- `Goals.getItemsCategory` - Ecommerce categories

### Live
Real-time visitor data.

```
?module=API&method=Live.getLastVisitsDetails&idSite=1&period=day&date=today&format=json
```

**Methods:**
- `Live.getLastVisitsDetails` - Recent visitor details
- `Live.getCounters` - Real-time counters

### SitesManager
Website management.

```
?module=API&method=SitesManager.getSitesIdWithAtLeastViewAccess&format=json
```

**Methods:**
- `SitesManager.getSitesIdWithAtLeastViewAccess` - Accessible sites
- `SitesManager.getSiteFromId` - Site details
- `SitesManager.getAllSites` - All sites (admin)
- `SitesManager.addSite` - Create new site
- `SitesManager.updateSite` - Update site settings

### UsersManager
User management (admin only).

**Methods:**
- `UsersManager.getUsers` - List users
- `UsersManager.getUser` - User details
- `UsersManager.addUser` - Create user
- `UsersManager.deleteUser` - Remove user
- `UsersManager.setUserAccess` - Set permissions

## Segmentation

Add segment parameter to filter visitors:

```
&segment=deviceType==smartphone;countryCode==us
```

### Operators
| Operator | Description |
|----------|-------------|
| `==` | Equals |
| `!=` | Not equals |
| `<=` | Less than or equal |
| `>=` | Greater than or equal |
| `<` | Less than |
| `>` | Greater than |
| `=@` | Contains |
| `!@` | Does not contain |
| `=^` | Starts with |
| `=$` | Ends with |

### Combining Conditions
- `;` - AND
- `,` - OR

### Common Segments
```
# Mobile visitors
deviceType==smartphone

# From United States
countryCode==us

# Returning visitors
visitorType==returning

# Specific campaign
campaignName==summer_sale

# Event category
eventCategory==Video

# High-value visitors (revenue > 100)
revenue>=100
```

## Bulk Requests

Combine multiple API calls:

```
?module=API&method=API.getBulkRequest
&urls[0]=method%3DVisitsSummary.get%26idSite%3D1%26period%3Dday%26date%3Dtoday
&urls[1]=method%3DActions.getPageUrls%26idSite%3D1%26period%3Dday%26date%3Dtoday
&format=json
```

## Metadata API

Get information about available reports:

```
# All report metadata
?module=API&method=API.getReportMetadata&idSite=1&format=json

# Available segments
?module=API&method=API.getSegmentsMetadata&idSite=1&format=json

# Processed report
?module=API&method=API.getProcessedReport&idSite=1&period=day&date=today&apiModule=VisitsSummary&apiAction=get&format=json
```

## Core Metrics

| Metric | Description |
|--------|-------------|
| `nb_uniq_visitors` | Unique visitors |
| `nb_visits` | Total visits |
| `nb_actions` | Total actions (pageviews + events + downloads) |
| `nb_actions_per_visit` | Actions per visit |
| `avg_time_on_site` | Average visit duration (seconds) |
| `bounce_rate` | Percentage of single-page visits |
| `nb_conversions` | Goal conversions |
| `conversion_rate` | Conversion percentage |
| `revenue` | Total revenue |
| `nb_pageviews` | Page views |
| `nb_downloads` | Downloads |
| `nb_outlinks` | Outbound link clicks |
| `nb_searches` | Site searches |
| `nb_events` | Events tracked |

## Error Handling

Errors return JSON/XML with error details:

```json
{
  "result": "error",
  "message": "Error description"
}
```

Common errors:
- Invalid token_auth
- Invalid idSite
- Missing required parameters
- Permission denied
- Rate limiting

## Rate Limiting

For bulk data extraction:
1. Use bulk requests
2. Implement caching
3. Respect server limits
4. Consider archiving data locally

## Complete Examples

### Daily Visits Summary
```
https://matomo.example.com/index.php
  ?module=API
  &method=VisitsSummary.get
  &idSite=1
  &period=day
  &date=today
  &format=json
  &token_auth=YOUR_TOKEN
```

### Top 10 Pages This Month
```
https://matomo.example.com/index.php
  ?module=API
  &method=Actions.getPageUrls
  &idSite=1
  &period=month
  &date=today
  &format=json
  &filter_limit=10
  &token_auth=YOUR_TOKEN
```

### Mobile Traffic by Country
```
https://matomo.example.com/index.php
  ?module=API
  &method=UserCountry.getCountry
  &idSite=1
  &period=week
  &date=today
  &format=json
  &segment=deviceType==smartphone
  &token_auth=YOUR_TOKEN
```
