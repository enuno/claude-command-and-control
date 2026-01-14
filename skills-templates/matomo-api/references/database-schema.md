# Matomo Database Schema Reference

## Overview

Matomo persists two main data categories:
- **Log Data** - Raw analytics from the tracker
- **Archive Data** - Aggregated, cached analytics

## Log Data Tables

### log_visit
Stores individual visits (sessions).

| Column | Type | Description |
|--------|------|-------------|
| `idvisit` | bigint | Primary key |
| `idsite` | int | Website ID |
| `idvisitor` | binary(8) | Visitor fingerprint |
| `user_id` | varchar(200) | User ID (if set) |
| `visit_first_action_time` | datetime | First action timestamp |
| `visit_last_action_time` | datetime | Last action timestamp |
| `visit_total_time` | int | Total visit duration (seconds) |
| `visit_total_actions` | int | Number of actions in visit |
| `visit_total_events` | int | Number of events |
| `visit_total_searches` | int | Number of site searches |
| `visitor_returning` | tinyint | 1 if returning visitor |
| `visitor_count_visits` | int | Total visits by this visitor |
| `visitor_seconds_since_last` | int | Seconds since previous visit |
| `referer_type` | tinyint | Referrer type (1=direct, 2=search, 3=website, 6=campaign) |
| `referer_name` | varchar(255) | Referrer name (search engine, website) |
| `referer_url` | text | Full referrer URL |
| `referer_keyword` | varchar(255) | Search keyword |
| `config_browser_name` | varchar(40) | Browser name |
| `config_browser_version` | varchar(20) | Browser version |
| `config_os` | char(3) | Operating system code |
| `config_os_version` | varchar(100) | OS version |
| `config_device_type` | tinyint | Device type |
| `config_device_brand` | varchar(100) | Device brand |
| `config_device_model` | varchar(100) | Device model |
| `config_resolution` | varchar(18) | Screen resolution |
| `location_ip` | varbinary(16) | Visitor IP address |
| `location_country` | char(3) | Country code |
| `location_region` | char(3) | Region code |
| `location_city` | varchar(255) | City name |
| `location_latitude` | decimal(9,6) | Latitude |
| `location_longitude` | decimal(9,6) | Longitude |
| `custom_var_k1` - `k5` | varchar(200) | Custom variable names |
| `custom_var_v1` - `v5` | varchar(200) | Custom variable values |

### log_link_visit_action
Tracks individual actions within visits.

| Column | Type | Description |
|--------|------|-------------|
| `idlink_va` | bigint | Primary key |
| `idsite` | int | Website ID |
| `idvisit` | bigint | Foreign key to log_visit |
| `idvisitor` | binary(8) | Visitor fingerprint |
| `server_time` | datetime | Action timestamp |
| `idaction_url` | int | Foreign key to log_action (URL) |
| `idaction_url_ref` | int | Previous page URL |
| `idaction_name` | int | Foreign key to log_action (title) |
| `idaction_name_ref` | int | Previous page title |
| `idaction_event_category` | int | Event category |
| `idaction_event_action` | int | Event action |
| `idaction_content_name` | int | Content name |
| `idaction_content_piece` | int | Content piece |
| `idaction_content_target` | int | Content target |
| `idaction_content_interaction` | int | Content interaction |
| `time_spent_ref_action` | int | Time on previous page (seconds) |
| `pageview_position` | int | Position in visit |
| `search_cat` | varchar(200) | Site search category |
| `search_count` | int | Site search results count |
| `custom_var_k1` - `k5` | varchar(200) | Page-level custom vars |
| `custom_var_v1` - `v5` | varchar(200) | Page-level custom values |

### log_action
Stores action definitions (URLs, titles, events).

| Column | Type | Description |
|--------|------|-------------|
| `idaction` | int | Primary key |
| `name` | varchar(4096) | Action value (URL, title, etc.) |
| `hash` | int | CRC32 hash for fast lookup |
| `type` | tinyint | Action type |
| `url_prefix` | tinyint | URL prefix variant |

**Action Types:**
| Type | Description |
|------|-------------|
| 1 | Page URL |
| 2 | Outlink |
| 3 | Download |
| 4 | Page title |
| 5 | Ecommerce item SKU |
| 6 | Ecommerce item name |
| 7 | Ecommerce item category |
| 8 | Site search keyword |
| 10 | Event category |
| 11 | Event action |
| 12 | Event name |
| 13 | Content name |
| 14 | Content piece |
| 15 | Content target |
| 16 | Content interaction |

### log_conversion
Records goal conversions.

| Column | Type | Description |
|--------|------|-------------|
| `idvisit` | bigint | Visit ID |
| `idsite` | int | Website ID |
| `idvisitor` | binary(8) | Visitor fingerprint |
| `server_time` | datetime | Conversion timestamp |
| `idgoal` | int | Goal ID (0 = ecommerce) |
| `buster` | int | Unique identifier |
| `idorder` | varchar(100) | Ecommerce order ID |
| `items` | int | Number of items in order |
| `revenue` | float | Conversion revenue |
| `revenue_subtotal` | float | Order subtotal |
| `revenue_tax` | float | Tax amount |
| `revenue_shipping` | float | Shipping cost |
| `revenue_discount` | float | Discount amount |
| `url` | varchar(4096) | Conversion URL |
| `location_country` | char(3) | Country at conversion |
| `visitor_returning` | tinyint | Returning visitor flag |
| `referer_type` | tinyint | Attribution referrer type |
| `referer_name` | varchar(255) | Attribution source |
| `referer_keyword` | varchar(255) | Attribution keyword |
| `custom_var_k1` - `k5` | varchar(200) | Custom variables |
| `custom_var_v1` - `v5` | varchar(200) | Custom values |

### log_conversion_item
Tracks ecommerce items in orders.

| Column | Type | Description |
|--------|------|-------------|
| `idsite` | int | Website ID |
| `idvisitor` | binary(8) | Visitor fingerprint |
| `server_time` | datetime | Order timestamp |
| `idvisit` | bigint | Visit ID |
| `idorder` | varchar(100) | Order ID |
| `idaction_sku` | int | Product SKU action |
| `idaction_name` | int | Product name action |
| `idaction_category` | int | Primary category action |
| `idaction_category2` - `5` | int | Additional categories |
| `price` | float | Unit price |
| `quantity` | int | Quantity ordered |
| `deleted` | tinyint | Soft delete flag |

## Archive Data Tables

### archive_numeric_YYYY_MM
Stores aggregated numeric metrics by month.

| Column | Type | Description |
|--------|------|-------------|
| `idarchive` | int | Archive batch ID |
| `name` | varchar(190) | Metric name |
| `idsite` | int | Website ID |
| `date1` | date | Period start date |
| `date2` | date | Period end date |
| `period` | tinyint | Period type (1=day, 2=week, 3=month, 4=year, 5=range) |
| `ts_archived` | datetime | Archive timestamp |
| `value` | double | Metric value |

### archive_blob_YYYY_MM
Stores aggregated report data by month.

| Column | Type | Description |
|--------|------|-------------|
| `idarchive` | int | Archive batch ID |
| `name` | varchar(190) | Report name |
| `idsite` | int | Website ID |
| `date1` | date | Period start date |
| `date2` | date | Period end date |
| `period` | tinyint | Period type |
| `ts_archived` | datetime | Archive timestamp |
| `value` | mediumblob | Compressed report data |

## Configuration Tables

### site
Website configuration.

| Column | Type | Description |
|--------|------|-------------|
| `idsite` | int | Primary key |
| `name` | varchar(90) | Site name |
| `main_url` | varchar(255) | Primary URL |
| `ts_created` | timestamp | Creation date |
| `ecommerce` | tinyint | Ecommerce enabled |
| `sitesearch` | tinyint | Site search enabled |
| `sitesearch_keyword_parameters` | text | Search keyword params |
| `sitesearch_category_parameters` | text | Search category params |
| `timezone` | varchar(50) | Site timezone |
| `currency` | char(3) | Default currency |
| `excluded_ips` | text | Excluded IP addresses |
| `excluded_parameters` | text | Excluded URL params |
| `excluded_user_agents` | text | Excluded user agents |
| `type` | varchar(255) | Site type (website, intranet, mobileapp, rollup) |
| `keep_url_fragment` | tinyint | Preserve URL fragments |

### site_url
Additional URLs for websites.

| Column | Type | Description |
|--------|------|-------------|
| `idsite` | int | Foreign key to site |
| `url` | varchar(255) | Additional URL |

### goal
Goal definitions.

| Column | Type | Description |
|--------|------|-------------|
| `idsite` | int | Website ID |
| `idgoal` | int | Goal ID |
| `name` | varchar(50) | Goal name |
| `description` | varchar(255) | Goal description |
| `match_attribute` | varchar(20) | Match type (url, title, file, external_website, manually) |
| `pattern` | varchar(255) | Pattern to match |
| `pattern_type` | varchar(25) | Pattern type (contains, exact, regex) |
| `case_sensitive` | tinyint | Case sensitivity |
| `allow_multiple` | tinyint | Allow multiple conversions per visit |
| `revenue` | float | Default revenue |
| `deleted` | tinyint | Soft delete flag |
| `event_value_as_revenue` | tinyint | Use event value as revenue |

### segment
Saved segment definitions.

| Column | Type | Description |
|--------|------|-------------|
| `idsegment` | int | Primary key |
| `name` | varchar(255) | Segment name |
| `definition` | text | Segment definition |
| `login` | varchar(100) | Owner user |
| `enable_all_users` | tinyint | Shared with all users |
| `enable_only_idsite` | int | Restricted to site |
| `auto_archive` | tinyint | Pre-archive this segment |
| `ts_created` | timestamp | Creation timestamp |
| `ts_last_edit` | timestamp | Last edit timestamp |
| `deleted` | tinyint | Soft delete flag |

## User Management Tables

### user
User accounts.

| Column | Type | Description |
|--------|------|-------------|
| `login` | varchar(100) | Primary key (username) |
| `password` | varchar(255) | Hashed password |
| `alias` | varchar(45) | Display name |
| `email` | varchar(100) | Email address |
| `twofactor_secret` | varchar(40) | 2FA secret |
| `token_auth` | char(32) | Default auth token |
| `superuser_access` | tinyint | Super user flag |
| `date_registered` | timestamp | Registration date |
| `ts_password_modified` | timestamp | Password change date |

### access
User permissions by site.

| Column | Type | Description |
|--------|------|-------------|
| `login` | varchar(100) | User login |
| `idsite` | int | Website ID |
| `access` | varchar(10) | Permission level (view, write, admin) |

### user_token_auth
Additional auth tokens per user.

| Column | Type | Description |
|--------|------|-------------|
| `idusertokenauth` | bigint | Primary key |
| `login` | varchar(100) | User login |
| `description` | varchar(100) | Token description |
| `password` | varchar(191) | Hashed token |
| `hash_algo` | varchar(30) | Hash algorithm |
| `system_token` | tinyint | System-generated flag |
| `last_used` | datetime | Last usage timestamp |
| `date_created` | datetime | Creation date |
| `date_expired` | datetime | Expiration date |
| `secure_only` | tinyint | HTTPS only |

## Premium Feature Tables (Examples)

### Heatmaps & Session Recording
- `site_hsr` - Configuration
- `log_hsr` - Recorded page views
- `log_hsr_event` - Mouse movements, clicks, scrolls
- `log_hsr_blob` - Compressed DOM data

### Form Analytics
- `site_form` - Form configuration
- `log_form` - Form submissions
- `log_form_field` - Field interactions
- `log_form_page` - Form data by page

### A/B Testing
- `experiments` - Test configuration
- `experiments_strategy` - Statistical methods
- `experiments_variations` - Test variants
- `log_abtesting` - Visitor participation

### Funnels
- `funnel` - Funnel definitions
- `funnel_steps` - Funnel steps
- `log_funnel` - Funnel progression data

## Query Examples

### Get Today's Visits
```sql
SELECT * FROM log_visit
WHERE idsite = 1
  AND visit_first_action_time >= CURDATE()
ORDER BY visit_first_action_time DESC
LIMIT 100;
```

### Get Page Views for Visit
```sql
SELECT a.name AS url, an.name AS title, lva.server_time
FROM log_link_visit_action lva
JOIN log_action a ON lva.idaction_url = a.idaction
LEFT JOIN log_action an ON lva.idaction_name = an.idaction
WHERE lva.idvisit = 12345
ORDER BY lva.server_time;
```

### Get Archived Metrics
```sql
SELECT name, value, ts_archived
FROM archive_numeric_2024_01
WHERE idsite = 1
  AND period = 1  -- daily
  AND date1 = '2024-01-15'
  AND name LIKE 'nb_%';
```

### Get Goal Conversions
```sql
SELECT g.name AS goal_name, lc.revenue, lc.server_time
FROM log_conversion lc
JOIN goal g ON lc.idsite = g.idsite AND lc.idgoal = g.idgoal
WHERE lc.idsite = 1
  AND lc.server_time >= '2024-01-01'
ORDER BY lc.server_time DESC;
```

### Get Ecommerce Orders
```sql
SELECT lc.idorder, lc.revenue, lc.items, lc.server_time
FROM log_conversion lc
WHERE lc.idsite = 1
  AND lc.idgoal = 0  -- Ecommerce
ORDER BY lc.server_time DESC;
```

## Performance Notes

- **Denormalization**: Related fields from parent tables are copied to child tables to avoid joins during aggregation
- **Indexes**: Focus on `idsite`, datetime ranges, and period-based queries
- **Partitioning**: Archive tables are partitioned by month (YYYY_MM suffix)
- **Archiving**: Use Matomo's archiving process instead of direct queries when possible
