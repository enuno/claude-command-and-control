# Cloudflare-Pages - Framework Guides

**Pages:** 13

---

## Step 2: Explicitly deploy when ready (now affects live traffic)

**URL:** llms-txt#step-2:-explicitly-deploy-when-ready-(now-affects-live-traffic)

POST /workers/scripts/{script_name}/deployments
{
  "strategy": "percentage",
  "versions": [
    {
      "percentage": 100,
      "version_id": "new_version_id"
    }
  ]
}
sh

**Examples:**

Example 1 (unknown):
```unknown
#### Settings are clearly organized by scope

Configuration is now logically divided: [**Worker settings**](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/) (like `name` and `tags`) persist across all versions, while [**Version settings**](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/) (like `bindings` and `compatibility_date`) are specific to each code snapshot.
```

---

## Set the environment for both build and deploy

**URL:** llms-txt#set-the-environment-for-both-build-and-deploy

CLOUDFLARE_ENV=production npm run build & wrangler deploy
```

When using `@cloudflare/vite-plugin`, the build process generates a ["redirected deploy config"](https://developers.cloudflare.com/workers/wrangler/configuration/#generated-wrangler-configuration) that is flattened to only contain the active environment. Wrangler will validate that the environment specified matches the environment used during the build to prevent accidentally deploying a Worker built for one environment to a different environment.

* [System environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/)
* [Environments](https://developers.cloudflare.com/workers/wrangler/environments/)

<page>
---
title: Crawler drilldowns with extended actions menu · Changelog
description: Drill down into individual crawler behavior with status code charts
  and export data for use in WAF rules, Redirect Rules, and robots.txt files.
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/changelog/2025-11-10-ai-crawl-control-crawler-info/
  md: https://developers.cloudflare.com/changelog/2025-11-10-ai-crawl-control-crawler-info/index.md
---

---

## create new project with create-react-app

**URL:** llms-txt#create-new-project-with-create-react-app

npx create-react-app new-app

---

## Manage Versions and Deployments here or outside of Terraform

**URL:** llms-txt#manage-versions-and-deployments-here-or-outside-of-terraform

---

## Deploy your built static site

**URL:** llms-txt#deploy-your-built-static-site

---

## This will deploy to production, not dev

**URL:** llms-txt#this-will-deploy-to-production,-not-dev

**Examples:**

Example 1 (unknown):
```unknown
#### Use with build tools

The `CLOUDFLARE_ENV` environment variable is particularly useful when working with build tools like Vite. You can set the environment once during the build process, and it will be used for both building and deploying your Worker:
```

---

## Current Deployment ID: 80b72e19-da82-4465-83a2-c12fb11ccc72

**URL:** llms-txt#current-deployment-id:-80b72e19-da82-4465-83a2-c12fb11ccc72

**Contents:**
- Next steps
- Viewing audit logs
- Logged operations
- Example log entry
- View metrics in the dashboard
- Billing Notifications
- Error list
- Automatic retries
- View logs
- Report issues

json
{
  "action": { "info": "CreateDatabase", "result": true, "type": "create" },
  "actor": {
    "email": "<ACTOR_EMAIL>",
    "id": "b1ab1021a61b1b12612a51b128baa172",
    "ip": "1b11:a1b2:12b1:12a::11a:1b",
    "type": "user"
  },
  "id": "a123b12a-ab11-1212-ab1a-a1aa11a11abb",
  "interface": "API",
  "metadata": {},
  "newValue": "",
  "newValueJson": { "database_name": "my-db" },
  "oldValue": "",
  "oldValueJson": {},
  "owner": { "id": "211b1a74121aa32a19121a88a712aa12" },
  "resource": {
    "id": "11a21122-1a11-12bb-11ab-1aa2aa1ab12a",
    "type": "d1.database"
  },
  "when": "2024-08-09T04:53:55.752Z"
}
js
try {
    // This is an intentional misspelling
    await db.exec("INSERTZ INTO my_table (name, employees) VALUES ()");
} catch (e: any) {
    console.error({
        message: e.message
    });
}
json
{
  "message": "D1_EXEC_ERROR: Error in line 1: INSERTZ INTO my_table (name, employees) VALUES (): sql error: near \"INSERTZ\": syntax error in INSERTZ INTO my_table (name, employees) VALUES () at offset 0"
}
graphql
query D1ObservabilitySampleQuery(
  $accountTag: string!
  $start: Date
  $end: Date
  $databaseId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      d1AnalyticsAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $start, date_leq: $end, databaseId: $databaseId }
        orderBy: [date_DESC]
      ) {
        sum {
          readQueries
          writeQueries
        }
        dimensions {
          date
          databaseId
        }
      }
    }
  }
}
graphql
query D1ObservabilitySampleQuery2(
  $accountTag: string!
  $start: Date
  $end: Date
  $databaseId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      d1AnalyticsAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $start, date_leq: $end, databaseId: $databaseId }
        orderBy: [date_DESC]
      ) {
        quantiles {
          queryBatchTimeMsP90
        }
        dimensions {
          date
          databaseId
        }
      }
    }
  }
}
graphql
query D1ObservabilitySampleQuery3(
  $accountTag: string!
  $start: Date
  $end: Date
  $databaseId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      d1AnalyticsAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $start, date_leq: $end, databaseId: $databaseId }
      ) {
        sum {
          readQueries
          writeQueries
        }
      }
    }
  }
}
sh
npx wrangler d1 insights <database_name> --sort-type=sum --sort-by=count --limit=3
sh
 ⛅️ wrangler 3.95.0
-------------------

-------------------
🚧 `wrangler d1 insights` is an experimental command.
🚧 Flags for this command, their descriptions, and output may change between wrangler versions.
-------------------

[
  {
    "query": "SELECT tbl_name as name,\n                   (SELECT ncol FROM pragma_table_list(tbl_name)) as num_columns\n            FROM sqlite_master\n            WHERE TYPE = \"table\"\n              AND tbl_name NOT LIKE \"sqlite_%\"\n              AND tbl_name NOT LIKE \"d1_%\"\n              AND tbl_name NOT LIKE \"_cf_%\"\n            ORDER BY tbl_name ASC;",
    "avgRowsRead": 2,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.49505,
    "totalDurationMs": 0.9901,
    "numberOfTimesRun": 2,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT * FROM Customers",
    "avgRowsRead": 4,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.1873,
    "totalDurationMs": 0.1873,
    "numberOfTimesRun": 1,
    "queryEfficiency": 1
  },
  {
    "query": "SELECT * From Customers",
    "avgRowsRead": 0,
    "totalRowsRead": 0,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 1.0225,
    "totalDurationMs": 1.0225,
    "numberOfTimesRun": 1,
    "queryEfficiency": 0
  }
]
sh
npx wrangler d1 insights <database_name> --sort-type=avg --sort-by=time --limit=3
sh
⛅️ wrangler 3.95.0
-------------------

-------------------
🚧 `wrangler d1 insights` is an experimental command.
🚧 Flags for this command, their descriptions, and output may change between wrangler versions.
-------------------

[
  {
    "query": "SELECT * From Customers",
    "avgRowsRead": 0,
    "totalRowsRead": 0,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 1.0225,
    "totalDurationMs": 1.0225,
    "numberOfTimesRun": 1,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT tbl_name as name,\n                   (SELECT ncol FROM pragma_table_list(tbl_name)) as num_columns\n            FROM sqlite_master\n            WHERE TYPE = \"table\"\n              AND tbl_name NOT LIKE \"sqlite_%\"\n              AND tbl_name NOT LIKE \"d1_%\"\n              AND tbl_name NOT LIKE \"_cf_%\"\n            ORDER BY tbl_name ASC;",
    "avgRowsRead": 2,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.49505,
    "totalDurationMs": 0.9901,
    "numberOfTimesRun": 2,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT * FROM Customers",
    "avgRowsRead": 4,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.1873,
    "totalDurationMs": 0.1873,
    "numberOfTimesRun": 1,
    "queryEfficiency": 1
  }
]
sh
npx wrangler d1 insights <database_name> --sort-type=sum --sort-by=writes --limit=10 --timePeriod=7d
sh
⛅️ wrangler 3.95.0
-------------------

-------------------
🚧 `wrangler d1 insights` is an experimental command.
🚧 Flags for this command, their descriptions, and output may change between wrangler versions.
-------------------

[
  {
    "query": "SELECT * FROM Customers",
    "avgRowsRead": 4,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.1873,
    "totalDurationMs": 0.1873,
    "numberOfTimesRun": 1,
    "queryEfficiency": 1
  },
  {
    "query": "SELECT * From Customers",
    "avgRowsRead": 0,
    "totalRowsRead": 0,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 1.0225,
    "totalDurationMs": 1.0225,
    "numberOfTimesRun": 1,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT tbl_name as name,\n                   (SELECT ncol FROM pragma_table_list(tbl_name)) as num_columns\n            FROM sqlite_master\n            WHERE TYPE = \"table\"\n              AND tbl_name NOT LIKE \"sqlite_%\"\n              AND tbl_name NOT LIKE \"d1_%\"\n              AND tbl_name NOT LIKE \"_cf_%\"\n            ORDER BY tbl_name ASC;",
    "avgRowsRead": 2,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.49505,
    "totalDurationMs": 0.9901,
    "numberOfTimesRun": 2,
    "queryEfficiency": 0
  }
]
sh
npx wrangler d1 info <database_name>
plaintext
...
│ version           │ alpha                                 │
...
sh
npx wrangler d1 backup create <alpha_database_name>
sh
npx wrangler d1 backup download <alpha_database_name> <backup_id> # See available backups with wrangler d1 backup list <database_name>
sh
sqlite3 db_dump.sqlite3 .dump > db.sql
sql
   CREATE TABLE _cf_KV (
      key TEXT PRIMARY KEY,
      value BLOB
   ) WITHOUT ROWID;
   sh
npx wrangler d1 create <new_database_name>
sh
npx wrangler d1 execute <new_database_name> --remote --file=./db.sql
sh
npx wrangler d1 delete <alpha_database_name>
json
"meta": {
  "duration": 0.20472300052642825,
  "size_after": 45137920,
  "rows_read": 5000,
  "rows_written": 0
}
ts
// retrieve bookmark from previous session stored in HTTP header
const bookmark = request.headers.get("x-d1-bookmark") ?? "first-unconstrained";

const session = env.DB.withSession(bookmark);
const result = await session
  .prepare(`SELECT * FROM Customers WHERE CompanyName = 'Bs Beverages'`)
  .run();
// store bookmark for a future session
response.headers.set("x-d1-bookmark", session.getBookmark() ?? "");
json
"meta": {
  "duration": 0.20472300052642825,
  "size_after": 45137920,
  "rows_read": 5000,
  "rows_written": 0
}
sh
$ wrangler d1 create your-database --experimental-backend
sh
wrangler d1 backup list existing-db
sh
┌──────────────┬──────────────────────────────────────┬────────────┬─────────┐
│ created_at   │ id                                   │ num_tables │ size    │
├──────────────┼──────────────────────────────────────┼────────────┼─────────┤
│ 1 hour ago   │ 54a23309-db00-4c5c-92b1-c977633b937c │ 1          │ 95.3 kB │
├──────────────┼──────────────────────────────────────┼────────────┼─────────┤
│ <...>        │ <...>                                │ <...>      │ <...>   │
├──────────────┼──────────────────────────────────────┼────────────┼─────────┤
│ 2 months ago │ 8433a91e-86d0-41a3-b1a3-333b080bca16 │ 1          │ 65.5 kB │
└──────────────┴──────────────────────────────────────┴────────────┴─────────┘%
sh
wrangler d1 backup create example-db
sh
┌─────────────────────────────┬──────────────────────────────────────┬────────────┬─────────┬───────┐
│ created_at                  │ id                                   │ num_tables │ size    │ state │
├─────────────────────────────┼──────────────────────────────────────┼────────────┼─────────┼───────┤
│ 2023-02-04T15:49:36.113753Z │ 123a81a2-ab91-4c2e-8ebc-64d69633faf1 │ 1          │ 65.5 kB │ done  │
└─────────────────────────────┴──────────────────────────────────────┴────────────┴─────────┴───────┘
sh
wrangler d1 backup download example-db 123a81a2-ab91-4c2e-8ebc-64d69633faf1
sh
🌀 Downloading backup 123a81a2-ab91-4c2e-8ebc-64d69633faf1 from 'example-db'
🌀 Saving to /Users/you/projects/example-db.123a81a2.sqlite3
🌀 Done!
sh
wrangler d1 backup restore existing-db  6cceaf8c-ceab-4351-ac85-7f9e606973e3
sh
Restoring existing-db from backup 6cceaf8c-ceab-4351-ac85-7f9e606973e3....
Done!
json
"meta": {
  "duration": 0.20472300052642825,
  "size_after": 45137920,
  "rows_read": 5000,
  "rows_written": 0
}
sql
CREATE TABLE some_table (
    -- other columns omitted
    some_generated_column AS <function_that_generates_the_column_data>
)
json
{
    "measurement": {
        "temp_f": "77.4",
        "aqi": [21, 42, 58],
        "o3": [18, 500],
        "wind_mph": "13",
        "location": "US-NY"
    }
}
sql
CREATE TABLE sensor_readings (
    event_id INTEGER PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    raw_data TEXT,
    location as (json_extract(raw_data, '$.measurement.location')) STORED
);
sql
ALTER TABLE sensor_readings
ADD COLUMN location as (json_extract(raw_data, '$.measurement.location'));
sql
ALTER TABLE your_table
-- date(timestamp, 'unixepoch') converts a Unix timestamp to a YYYY-MM-dd formatted date
ADD COLUMN formatted_date AS (date(timestamp, 'unixepoch'))
sql
-- Filter out "expired" results based on your generated column:
-- SELECT * FROM your_table WHERE current_date() > expires_at
ALTER TABLE your_table
-- calculates a date (YYYY-MM-dd) 30 days from the timestamp.
ADD COLUMN expires_at AS (date(timestamp, '+30 days'));
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "d1_databases": [
      {
        "binding": "<BINDING_NAME>",
        "database_name": "<DATABASE_NAME>",
        "database_id": "<UUID>",
        "preview_database_id": "<UUID>",
        "migrations_table": "<d1_migrations>",
        "migrations_dir": "<FOLDER_NAME>"
      }
    ]
  }
  toml
  [[ d1_databases ]]
  binding = "<BINDING_NAME>" # i.e. if you set this to "DB", it will be available in your Worker at `env.DB`
  database_name = "<DATABASE_NAME>"
  database_id = "<UUID>"
  preview_database_id = "<UUID>"
  migrations_table = "<d1_migrations>" # Customize this value to change your applied migrations table name
  migrations_dir = "<FOLDER_NAME>" # Specify your custom migration directory
  sh
wrangler d1 time-travel info YOUR_DATABASE
sh
🚧 Time Traveling...
⚠️ The current bookmark is '00000085-0000024c-00004c6d-8e61117bf38d7adb71b934ebbf891683'
⚡️ To restore to this specific bookmark, run:
 `wrangler d1 time-travel restore YOUR_DATABASE --bookmark=00000085-0000024c-00004c6d-8e61117bf38d7adb71b934ebbf891683`
sh
wrangler d1 time-travel info YOUR_DATABASE --timestamp="2023-07-09T17:31:11+00:00"
sh
wrangler d1 time-travel restore YOUR_DATABASE --timestamp=UNIX_TIMESTAMP
sh
🚧 Restoring database YOUR_DATABASE from bookmark 00000080-ffffffff-00004c60-390376cb1c4dd679b74a19d19f5ca5be

⚠️ This will overwrite all data in database YOUR_DATABASE.
In-flight queries and transactions will be cancelled.

✔ OK to proceed (y/N) … yes
⚡️ Time travel in progress...
✅ Database YOUR_DATABASE restored back to bookmark 00000080-ffffffff-00004c60-390376cb1c4dd679b74a19d19f5ca5be

↩️ To undo this operation, you can restore to the previous bookmark: 00000085-ffffffff-00004c6d-2510c8b03a2eb2c48b2422bb3b33fad5
sh
wrangler d1 time-travel info YOUR_DATABASE
sh
🚧 Time Traveling...
⚠️ The current bookmark is '00000085-0000024c-00004c6d-8e61117bf38d7adb71b934ebbf891683'
⚡️ To restore to this specific bookmark, run:
 `wrangler d1 time-travel restore YOUR_DATABASE --bookmark=00000085-0000024c-00004c6d-8e61117bf38d7adb71b934ebbf891683`
sql
-- Defer foreign key enforcement in this transaction.
PRAGMA defer_foreign_keys = on

-- Run your CREATE TABLE or ALTER TABLE / COLUMN statements
ALTER TABLE users ...

-- This is implicit if not set by the end of the transaction.
PRAGMA defer_foreign_keys = off
sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    email_address TEXT,
    name TEXT,
    metadata TEXT
)

CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    status INTEGER,
    item_desc TEXT,
    shipped_date INTEGER,
    user_who_ordered INTEGER,
    FOREIGN KEY(user_who_ordered) REFERENCES users(user_id)
)
sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    email_address TEXT,
)

CREATE TABLE scores (
    score_id INTEGER PRIMARY KEY,
    game TEXT,
    score INTEGER,
    player_id INTEGER,
    FOREIGN KEY(player_id) REFERENCES users(user_id) ON DELETE CASCADE
)
sql
SELECT json_extract('not valid JSON: just a string', '$')
txt
ERROR 9015: SQL engine error: query error: Error code 1: SQL error or missing database (malformed
  JSON)`
sql
CREATE TABLE some_table (
    -- other columns omitted
    raw_data TEXT -- JSON: {"measurement":{"aqi":[21,42,58],"wind_mph":"13","location":"US-NY"}}
    location AS (json_extract(raw_data, '$.measurement.location')) STORED
)
json
{
    "measurement": {
        "temp_f": "77.4",
        "aqi": [21, 42, 58],
        "o3": [18, 500],
        "wind_mph": "13",
        "location": "US-NY"
    }
}
sql
-- Extract the temperature value
json_extract(sensor_reading, '$.measurement.temp_f')-- returns "77.4" as TEXT
sql
-- Extract the maximum PM2.5 air quality reading
sensor_reading -> '$.measurement.aqi[3]' -- returns 58 as a JSON number
sql
-- Extract the o3 (ozone) array in full
sensor_reading -\-> '$.measurement.o3' -- returns '[18, 500]' as TEXT
json
{
    "user_id": "abc12345",
    "previous_logins": ["2023-03-31T21:07:14-05:00", "2023-03-28T08:21:02-05:00", "2023-03-28T05:52:11-05:00"]
}
sql
json_array_length(login_history, '$.previous_logins') --> returns 3 as an INTEGER
json
{"history": ["2023-05-13T15:13:02+00:00", "2023-05-14T07:11:22+00:00", "2023-05-15T15:03:51+00:00"]}
sql
UPDATE users
SET login_history = json_insert(login_history, '$.history[#]', '2023-05-15T20:33:06+00:00')
WHERE user_id = 'aba0e360-1e04-41b3-91a0-1f2263e1e0fb'
sql
UPDATE users
SET last_audited = '2023-05-16T11:24:08+00:00'
WHERE id IN (SELECT value FROM json_each('[183183, 13913, 94944]'))
sql
key|value|type|id|fullkey|path
0|183183|integer|1|$[0]|$
1|13913|integer|2|$[1]|$
2|94944|integer|3|$[2]|$
ts
const stmt = context.env.DB
    .prepare("UPDATE users SET last_audited = ? WHERE id IN (SELECT value FROM json_each(?1))")
const resp = await stmt.bind(
    "2023-05-16T11:24:08+00:00",
    JSON.stringify([183183, 13913, 94944])
    ).run()
sql
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "Employee";
DROP TABLE IF EXISTS "Category";
DROP TABLE IF EXISTS "Customer";
DROP TABLE IF EXISTS "Shipper";
DROP TABLE IF EXISTS "Supplier";
DROP TABLE IF EXISTS "Order";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "OrderDetail";
DROP TABLE IF EXISTS "CustomerCustomerDemo";
DROP TABLE IF EXISTS "CustomerDemographic";
DROP TABLE IF EXISTS "Region";
DROP TABLE IF EXISTS "Territory";
DROP TABLE IF EXISTS "EmployeeTerritory";
DROP VIEW IF EXISTS [ProductDetails_V];
CREATE TABLE IF NOT EXISTS "Employee" ( "Id" INTEGER PRIMARY KEY, "LastName" VARCHAR(8000) NULL, "FirstName" VARCHAR(8000) NULL, "Title" VARCHAR(8000) NULL, "TitleOfCourtesy" VARCHAR(8000) NULL, "BirthDate" VARCHAR(8000) NULL, "HireDate" VARCHAR(8000) NULL, "Address" VARCHAR(8000) NULL, "City" VARCHAR(8000) NULL, "Region" VARCHAR(8000) NULL, "PostalCode" VARCHAR(8000) NULL, "Country" VARCHAR(8000) NULL, "HomePhone" VARCHAR(8000) NULL, "Extension" VARCHAR(8000) NULL, "Photo" BLOB NULL, "Notes" VARCHAR(8000) NULL, "ReportsTo" INTEGER NULL, "PhotoPath" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Category" ( "Id" INTEGER PRIMARY KEY, "CategoryName" VARCHAR(8000) NULL, "Description" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Customer" ( "Id" VARCHAR(8000) PRIMARY KEY, "CompanyName" VARCHAR(8000) NULL, "ContactName" VARCHAR(8000) NULL, "ContactTitle" VARCHAR(8000) NULL, "Address" VARCHAR(8000) NULL, "City" VARCHAR(8000) NULL, "Region" VARCHAR(8000) NULL, "PostalCode" VARCHAR(8000) NULL, "Country" VARCHAR(8000) NULL, "Phone" VARCHAR(8000) NULL, "Fax" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Shipper" ( "Id" INTEGER PRIMARY KEY, "CompanyName" VARCHAR(8000) NULL, "Phone" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Supplier" ( "Id" INTEGER PRIMARY KEY, "CompanyName" VARCHAR(8000) NULL, "ContactName" VARCHAR(8000) NULL, "ContactTitle" VARCHAR(8000) NULL, "Address" VARCHAR(8000) NULL, "City" VARCHAR(8000) NULL, "Region" VARCHAR(8000) NULL, "PostalCode" VARCHAR(8000) NULL, "Country" VARCHAR(8000) NULL, "Phone" VARCHAR(8000) NULL, "Fax" VARCHAR(8000) NULL, "HomePage" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Order" ( "Id" INTEGER PRIMARY KEY, "CustomerId" VARCHAR(8000) NULL, "EmployeeId" INTEGER NOT NULL, "OrderDate" VARCHAR(8000) NULL, "RequiredDate" VARCHAR(8000) NULL, "ShippedDate" VARCHAR(8000) NULL, "ShipVia" INTEGER NULL, "Freight" DECIMAL NOT NULL, "ShipName" VARCHAR(8000) NULL, "ShipAddress" VARCHAR(8000) NULL, "ShipCity" VARCHAR(8000) NULL, "ShipRegion" VARCHAR(8000) NULL, "ShipPostalCode" VARCHAR(8000) NULL, "ShipCountry" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Product" ( "Id" INTEGER PRIMARY KEY, "ProductName" VARCHAR(8000) NULL, "SupplierId" INTEGER NOT NULL, "CategoryId" INTEGER NOT NULL, "QuantityPerUnit" VARCHAR(8000) NULL, "UnitPrice" DECIMAL NOT NULL, "UnitsInStock" INTEGER NOT NULL, "UnitsOnOrder" INTEGER NOT NULL, "ReorderLevel" INTEGER NOT NULL, "Discontinued" INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS "OrderDetail" ( "Id" VARCHAR(8000) PRIMARY KEY, "OrderId" INTEGER NOT NULL, "ProductId" INTEGER NOT NULL, "UnitPrice" DECIMAL NOT NULL, "Quantity" INTEGER NOT NULL, "Discount" DOUBLE NOT NULL);
CREATE TABLE IF NOT EXISTS "CustomerCustomerDemo" ( "Id" VARCHAR(8000) PRIMARY KEY, "CustomerTypeId" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "CustomerDemographic" ( "Id" VARCHAR(8000) PRIMARY KEY, "CustomerDesc" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Region" ( "Id" INTEGER PRIMARY KEY, "RegionDescription" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Territory" ( "Id" VARCHAR(8000) PRIMARY KEY, "TerritoryDescription" VARCHAR(8000) NULL, "RegionId" INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS "EmployeeTerritory" ( "Id" VARCHAR(8000) PRIMARY KEY, "EmployeeId" INTEGER NOT NULL, "TerritoryId" VARCHAR(8000) NULL);
CREATE VIEW [ProductDetails_V] as select p.*, c.CategoryName, c.Description as [CategoryDescription], s.CompanyName as [SupplierName], s.Region as [SupplierRegion] from [Product] p join [Category] c on p.CategoryId = c.id join [Supplier] s on s.id = p.SupplierId;
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA table_list'
sh
🌀 Executing on remote database [DATABASE_NAME] (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 0.5874ms
┌────────┬──────────────────────┬───────┬──────┬────┬────────┐
│ schema │ name                 │ type  │ ncol │ wr │ strict │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Territory            │ table │ 3    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ CustomerDemographic  │ table │ 2    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ OrderDetail          │ table │ 6    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ sqlite_schema        │ table │ 5    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Region               │ table │ 2    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ _cf_KV               │ table │ 2    │ 1  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ ProductDetails_V     │ view  │ 14   │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ EmployeeTerritory    │ table │ 3    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Employee             │ table │ 18   │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Category             │ table │ 3    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Customer             │ table │ 11   │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Shipper              │ table │ 3    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Supplier             │ table │ 12   │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Order                │ table │ 14   │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ CustomerCustomerDemo │ table │ 2    │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ main   │ Product              │ table │ 10   │ 0  │ 0      │
├────────┼──────────────────────┼───────┼──────┼────┼────────┤
│ temp   │ sqlite_temp_schema   │ table │ 5    │ 0  │ 0      │
└────────┴──────────────────────┴───────┴──────┴────┴────────┘
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA table_info("Order")'
sh
🌀 Executing on remote database [DATABASE_NAME] (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 0.8502ms
┌─────┬────────────────┬───────────────┬─────────┬────────────┬────┐
│ cid │ name           │ type          │ notnull │ dflt_value │ pk │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 0   │ Id             │ INTEGER       │ 0       │            │ 1  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 1   │ CustomerId     │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 2   │ EmployeeId     │ INTEGER       │ 1       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 3   │ OrderDate      │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 4   │ RequiredDate   │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 5   │ ShippedDate    │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 6   │ ShipVia        │ INTEGER       │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 7   │ Freight        │ DECIMAL       │ 1       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 8   │ ShipName       │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 9   │ ShipAddress    │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 10  │ ShipCity       │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 11  │ ShipRegion     │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 12  │ ShipPostalCode │ VARCHAR(8000) │ 0       │            │ 0  │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┤
│ 13  │ ShipCountry    │ VARCHAR(8000) │ 0       │            │ 0  │
└─────┴────────────────┴───────────────┴─────────┴────────────┴────┘
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA table_xinfo("Order")'
sh
🌀 Executing on remote database [DATABASE_NAME] (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 0.3854ms
┌─────┬────────────────┬───────────────┬─────────┬────────────┬────┬────────┐
│ cid │ name           │ type          │ notnull │ dflt_value │ pk │ hidden │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 0   │ Id             │ INTEGER       │ 0       │            │ 1  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 1   │ CustomerId     │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 2   │ EmployeeId     │ INTEGER       │ 1       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 3   │ OrderDate      │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 4   │ RequiredDate   │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 5   │ ShippedDate    │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 6   │ ShipVia        │ INTEGER       │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 7   │ Freight        │ DECIMAL       │ 1       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 8   │ ShipName       │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 9   │ ShipAddress    │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 10  │ ShipCity       │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 11  │ ShipRegion     │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 12  │ ShipPostalCode │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
├─────┼────────────────┼───────────────┼─────────┼────────────┼────┼────────┤
│ 13  │ ShipCountry    │ VARCHAR(8000) │ 0       │            │ 0  │ 0      │
└─────┴────────────────┴───────────────┴─────────┴────────────┴────┴────────┘
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA index_list("Territory")'
sh
🌀 Executing on remote database d1-pragma-db (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 0.2177ms
┌─────┬──────────────────────────────┬────────┬────────┬─────────┐
│ seq │ name                         │ unique │ origin │ partial │
├─────┼──────────────────────────────┼────────┼────────┼─────────┤
│ 0   │ sqlite_autoindex_Territory_1 │ 1      │ pk     │ 0       │
└─────┴──────────────────────────────┴────────┴────────┴─────────┘
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA index_info("sqlite_autoindex_Territory_1")'
sh
🌀 Executing on remote database d1-pragma-db (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 0.2523ms
┌───────┬─────┬──────┐
│ seqno │ cid │ name │
├───────┼─────┼──────┤
│ 0     │ 0   │ Id   │
└───────┴─────┴──────┘
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA index_xinfo("sqlite_autoindex_Territory_1")'
sh
🌀 Executing on remote database d1-pragma-db (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 0.6034ms
┌───────┬─────┬──────┬──────┬────────┬─────┐
│ seqno │ cid │ name │ desc │ coll   │ key │
├───────┼─────┼──────┼──────┼────────┼─────┤
│ 0     │ 0   │ Id   │ 0    │ BINARY │ 1   │
├───────┼─────┼──────┼──────┼────────┼─────┤
│ 1     │ -1  │      │ 0    │ BINARY │ 0   │
└───────┴─────┴──────┴──────┴────────┴─────┘
sh
npx wrangler d1 execute [DATABASE_NAME] --command='PRAGMA quick_check'
sh
🌀 Executing on remote database [DATABASE_NAME] (DATABASE_ID):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 commands in 1.4073ms
┌─────────────┐
│ quick_check │
├─────────────┤
│ ok          │
└─────────────┘
sql
-- Defer foreign key enforcement in this transaction.
PRAGMA defer_foreign_keys = on

-- Run your CREATE TABLE or ALTER TABLE / COLUMN statements
ALTER TABLE users ...

-- This is implicit if not set by the end of the transaction.
PRAGMA defer_foreign_keys = off
sql
SELECT name, sql FROM sqlite_master
json
      {
        "name": "users",
        "sql": "CREATE TABLE users ( user_id INTEGER PRIMARY KEY, email_address TEXT, created_at INTEGER, deleted INTEGER, settings TEXT)"
      },
      {
        "name": "idx_ordered_users",
        "sql": "CREATE INDEX idx_ordered_users ON users(created_at DESC)"
      },
      {
        "name": "Order",
        "sql": "CREATE TABLE \"Order\" ( \"Id\" INTEGER PRIMARY KEY, \"CustomerId\" VARCHAR(8000) NULL, \"EmployeeId\" INTEGER NOT NULL, \"OrderDate\" VARCHAR(8000) NULL, \"RequiredDate\" VARCHAR(8000) NULL, \"ShippedDate\" VARCHAR(8000) NULL, \"ShipVia\" INTEGER NULL, \"Freight\" DECIMAL NOT NULL, \"ShipName\" VARCHAR(8000) NULL, \"ShipAddress\" VARCHAR(8000) NULL, \"ShipCity\" VARCHAR(8000) NULL, \"ShipRegion\" VARCHAR(8000) NULL, \"ShipPostalCode\" VARCHAR(8000) NULL, \"ShipCountry\" VARCHAR(8000) NULL)"
      },
      {
        "name": "Product",
        "sql": "CREATE TABLE \"Product\" ( \"Id\" INTEGER PRIMARY KEY, \"ProductName\" VARCHAR(8000) NULL, \"SupplierId\" INTEGER NOT NULL, \"CategoryId\" INTEGER NOT NULL, \"QuantityPerUnit\" VARCHAR(8000) NULL, \"UnitPrice\" DECIMAL NOT NULL, \"UnitsInStock\" INTEGER NOT NULL, \"UnitsOnOrder\" INTEGER NOT NULL, \"ReorderLevel\" INTEGER NOT NULL, \"Discontinued\" INTEGER NOT NULL)"
      }
js
const { results } = await env.DB.prepare(
  "SELECT * FROM Customers WHERE CompanyName LIKE ?",
)
  .bind("%eve%")
  .run();
console.log("results: ", results);
js
results:  [...]
sh
  npm create cloudflare@latest -- d1-example
  sh
  yarn create cloudflare d1-example
  sh
  pnpm create cloudflare@latest d1-example
  sh
cd d1-example
sh
  npm i hono
  sh
  yarn add hono
  sh
  pnpm add hono
  js
import { Hono } from "hono";

const app = new Hono();

app.get("/api/posts/:slug/comments", async (c) => {
  // Do something and return an HTTP response
  // Optionally, do something with `c.req.param("slug")`
});

app.post("/api/posts/:slug/comments", async (c) => {
  // Do something and return an HTTP response
  // Optionally, do something with `c.req.param("slug")`
});

export default app;
sh
npx wrangler d1 create d1-example
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "d1-example",
        "database_id": "4e1c28a9-90e4-41da-8b4b-6cf36e5abb29"
      }
    ]
  }
  toml
  [[ d1_databases ]]
  binding = "DB" # available in your Worker on `env.DB`
  database_name = "d1-example"
  database_id = "4e1c28a9-90e4-41da-8b4b-6cf36e5abb29"
  sh
npx wrangler d1 execute d1-example --remote --command "SELECT name FROM sqlite_schema WHERE type ='table'"
sh
Executing on d1-example:

┌───────┐
│ name  │
├───────┤
│ d1_kv │
└───────┘
sql
DROP TABLE IF EXISTS comments;
CREATE TABLE IF NOT EXISTS comments (
  id integer PRIMARY KEY AUTOINCREMENT,
  author text NOT NULL,
  body text NOT NULL,
  post_slug text NOT NULL
);
CREATE INDEX idx_comments_post_slug ON comments (post_slug);

-- Optionally, uncomment the below query to create data

-- INSERT INTO COMMENTS (author, body, post_slug) VALUES ('Kristian', 'Great post!', 'hello-world');
sh
npx wrangler d1 execute d1-example --remote --file schemas/schema.sql
js
app.get("/api/posts/:slug/comments", async (c) => {
  const { slug } = c.req.param();
  const { results } = await c.env.DB.prepare(
    `
    select * from comments where post_slug = ?
  `,
  )
    .bind(slug)
    .run();
  return c.json(results);
});
js
app.post("/api/posts/:slug/comments", async (c) => {
  const { slug } = c.req.param();
  const { author, body } = await c.req.json();

if (!author) return c.text("Missing author value for new comment");
  if (!body) return c.text("Missing body value for new comment");

const { success } = await c.env.DB.prepare(
    `
    insert into comments (author, body, post_slug) values (?, ?, ?)
  `,
  )
    .bind(author, body, slug)
    .run();

if (success) {
    c.status(201);
    return c.text("Created");
  } else {
    c.status(500);
    return c.text("Something went wrong");
  }
});
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "name": "d1-example",
    "main": "src/worker.js",
    "compatibility_date": "2022-07-15",
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "<YOUR_DATABASE_NAME>",
        "database_id": "<YOUR_DATABASE_UUID>"
      }
    ]
  }
  toml
  name = "d1-example"
  main = "src/worker.js"
  compatibility_date = "2022-07-15"

[[ d1_databases ]]
  binding = "DB" # available in your Worker on env.DB
  database_name = "<YOUR_DATABASE_NAME>"
  database_id = "<YOUR_DATABASE_UUID>"
  sh
npx wrangler deploy
sh

**Examples:**

Example 1 (unknown):
```unknown
Your Worker will be available at `https://python-and-d1.YOUR_SUBDOMAIN.workers.dev`.

If you receive an error deploying:

* Make sure you have configured your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) with the `database_id` and `database_name` of a valid D1 database.
* Ensure `compatibility_flags = ["python_workers"]` is set in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/), which is required for Python.
* Review the [list of error codes](https://developers.cloudflare.com/workers/observability/errors/), and ensure your code does not throw an uncaught exception.

## Next steps

* Refer to [Workers Python documentation](https://developers.cloudflare.com/workers/languages/python/) to learn more about how to use Python in Workers.
* Review the [D1 Workers Binding API](https://developers.cloudflare.com/d1/worker-api/) and how to query D1 databases.
* Learn [how to import data](https://developers.cloudflare.com/d1/best-practices/import-export-data/) to your D1 database.

</page>

<page>
---
title: Audit Logs · Cloudflare D1 docs
description: Audit logs provide a comprehensive summary of changes made within
  your Cloudflare account, including those made to D1 databases. This
  functionality is available on all plan types, free of charge, and is always
  enabled.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/observability/audit-logs/
  md: https://developers.cloudflare.com/d1/observability/audit-logs/index.md
---

[Audit logs](https://developers.cloudflare.com/fundamentals/account/account-security/review-audit-logs/) provide a comprehensive summary of changes made within your Cloudflare account, including those made to D1 databases. This functionality is available on all plan types, free of charge, and is always enabled.

## Viewing audit logs

To view audit logs for your D1 databases, go to the **Audit Logs** page.

[Go to **Audit logs**](https://dash.cloudflare.com/?to=/:account/audit-log)

For more information on how to access and use audit logs, refer to [Review audit logs](https://developers.cloudflare.com/fundamentals/account/account-security/review-audit-logs/).

## Logged operations

The following configuration actions are logged:

| Operation | Description |
| - | - |
| CreateDatabase | Creation of a new database. |
| DeleteDatabase | Deletion of an existing database. |
| [TimeTravel](https://developers.cloudflare.com/d1/reference/time-travel) | Restoration of a past database version. |

## Example log entry

Below is an example of an audit log entry showing the creation of a new database:
```

Example 2 (unknown):
```unknown
</page>

<page>
---
title: Billing · Cloudflare D1 docs
description: D1 exposes analytics to track billing metrics (rows read, rows
  written, and total storage) across all databases in your account.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/observability/billing/
  md: https://developers.cloudflare.com/d1/observability/billing/index.md
---

D1 exposes analytics to track billing metrics (rows read, rows written, and total storage) across all databases in your account.

The metrics displayed in the [Cloudflare dashboard](https://dash.cloudflare.com/) are sourced from Cloudflare's [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). You can access the metrics [programmatically](https://developers.cloudflare.com/d1/observability/metrics-analytics/#query-via-the-graphql-api) via GraphQL or HTTP client.

## View metrics in the dashboard

Total account billable usage analytics for D1 are available in the Cloudflare dashboard. To view current and past metrics for an account:

1. In the Cloudflare dashboard, go to the **Billing** page.

   [Go to **Billing**](https://dash.cloudflare.com/?to=/:account/billing)

2. Go to **Billable Usage**.

From here you can view charts of your account's D1 usage on a daily or month-to-date timeframe.

Note that billable usage history is stored for a maximum of 30 days.

## Billing Notifications

Usage-based billing notifications are available within the [Cloudflare dashboard](https://dash.cloudflare.com) for users looking to monitor their total account usage.

Notifications on the following metrics are available:

* Rows Read
* Rows Written

</page>

<page>
---
title: Debug D1 · Cloudflare D1 docs
description: D1 allows you to capture exceptions and log errors returned when
  querying a database. To debug D1, you will use the same tools available when
  debugging Workers.
lastUpdated: 2025-09-17T08:55:05.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/observability/debug-d1/
  md: https://developers.cloudflare.com/d1/observability/debug-d1/index.md
---

D1 allows you to capture exceptions and log errors returned when querying a database. To debug D1, you will use the same tools available when [debugging Workers](https://developers.cloudflare.com/workers/observability/).

D1's [`stmt.`](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) and [`db.`](https://developers.cloudflare.com/d1/worker-api/d1-database/) methods throw an [Error object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) whenever an error occurs. To capture exceptions, log the `e.message` value.

For example, the code below has a query with an invalid keyword - `INSERTZ` instead of `INSERT`:
```

Example 3 (unknown):
```unknown
The code above throws the following error message:
```

Example 4 (unknown):
```unknown
Note

Prior to [`wrangler` 3.1.1](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%403.1.1), D1 JavaScript errors used the [cause property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) for detailed error messages.

To inspect these errors when using older versions of `wrangler`, you should log `error?.cause?.message`.

## Error list

D1 returns the following error constants, in addition to the extended (detailed) error message:

| Error message | Description | Recommended action |
| - | - | - |
| `D1_ERROR` | Prefix of a specific D1 error. | Refer to "List of D1\_ERRORs" below for more detail about your specific error. |
| `D1_EXEC_ERROR` | Exec error in line x: y error. | |
| `D1_TYPE_ERROR` | Returned when there is a mismatch in the type between a column and a value. A common cause is supplying an `undefined` variable (unsupported) instead of `null`. | Ensure the type of the value and the column match. |
| `D1_COLUMN_NOTFOUND` | Column not found. | Ensure you have selected a column which exists in the database. |

The following table lists specific instances of `D1_ERROR`.

List of D1\_ERRORs

Retry operations

While some D1 errors can be resolved by retrying the operation, retrying is only safe if your query is idempotent (produces the same result when executed multiple times).

Before retrying any failed operation:

* Verify your query is idempotent (for example, read-only operations, or queries such as `CREATE TABLE IF NOT EXISTS`).
* Consider [implementing application-level checks](https://developers.cloudflare.com/d1/best-practices/retry-queries/) to identify if the operation can be retried, and retrying only when it is safe and necessary.

| `D1_ERROR` type | Description | Recommended action |
| - | - | - |
| `No SQL statements detected.` | The input query does not contain any SQL statements. | App action: Ensure the query contains at least one valid SQL statement. |
| `Your account has exceeded D1's maximum account storage limit, please contact Cloudflare to raise your limit.` | The total storage across all D1 databases in the account has exceeded the [account storage limit](https://developers.cloudflare.com/d1/platform/limits/). | App action: Delete unused databases, or upgrade your account to a paid plan. |
| `Exceeded maximum DB size.` | The D1 database has exceeded its [storage limit](https://developers.cloudflare.com/d1/platform/limits/). | App action: Delete data rows from the database, or shard your data into multiple databases. |
| `D1 DB reset because its code was updated.` | Cloudflare has updated the code for D1 (or the underlying Durable Object), and the Durable Object which contains the D1 database is restarting. | Retry the operation. |
| `Internal error while starting up D1 DB storage caused object to be reset.` | The Durable Object containing the D1 database is failing to start. | Retry the operation. |
| `Network connection lost.` | A network error. | Retry the operation. Refer to the "Retry operation" note above. |
| `Internal error in D1 DB storage caused object to be reset.` | An error has caused the D1 database to restart. | Retry the operation. |
| `Cannot resolve D1 DB due to transient issue on remote node.` | The query cannot reach the Durable Object containing the D1 database. | Retry the operation. Refer to the "Retry operation" note above. |
| `Can't read from request stream because client disconnected.` | A query request was made (e.g. uploading a SQL query), but the connection was closed during the query was fully executed. | App action: Retry the operation, and ensure the connection stays open. |
| `D1 DB storage operation exceeded timeout which caused object to be reset.` | A query is trying to write a large amount of information (e.g. GBs), and is taking too long. | App action: Optimize the queries (so that each query takes less time), send fewer requests by spreading the load over time, or shard the queries. |
| `D1 DB is overloaded. Requests queued for too long.` | The requests to the D1 database are queued for too long, either because there are too many requests, or the queued requests are taking too long. | App action: Optimize the queries (so that each query takes less time), send fewer requests by spreading the load over time, or shard the queries. |
| `D1 DB is overloaded. Too many requests queued.` | The request queue to the D1 database is too long, either because there are too many requests, or the queued requests are taking too long. | App action: Optimize the queries (so that each query takes less time), send fewer requests by spreading the load over time, or shard the queries. |
| `D1 DB's isolate exceeded its memory limit and was reset.` | A query loaded too much into memory, causing the D1 database to crash. | App action: Optimize the queries (so that each query takes less time), send fewer requests by spreading the load over time, or shard the queries. |
| `D1 DB exceeded its CPU time limit and was reset.` | A query is taking up a lot of CPU time (e.g. scanning over 9 GB table, or attempting a large import/export). | App action: Split the query into smaller shards. |

## Automatic retries

D1 detects read-only queries and automatically attempts up to two retries to execute those queries in the event of failures with retryable errors.

D1 ensures that any retry attempt does not cause database writes, making the automatic retries safe from side-effects, even if a query causing modifications slips through the read-only detection. D1 achieves this by checking for modifications after every query execution, and if any write occurred due to a retry attempt, the query is rolled back.

Note

Only read-only queries (queries containing only the following SQLite keywords: `SELECT`, `EXPLAIN`, `WITH`) are retried. Queries containing any [SQLite keyword](https://sqlite.org/lang_keywords.html) that leads to database writes are not retried.

## View logs

View a stream of live logs from your Worker by using [`wrangler tail`](https://developers.cloudflare.com/workers/observability/logs/real-time-logs#view-logs-using-wrangler-tail) or via the [Cloudflare dashboard](https://developers.cloudflare.com/workers/observability/logs/real-time-logs#view-logs-from-the-dashboard).

## Report issues

* To report bugs or request features, go to the [Cloudflare Community Forums](https://community.cloudflare.com/c/developers/d1/85).
* To give feedback, go to the [D1 Discord channel](https://discord.com/invite/cloudflaredev).
* If you are having issues with Wrangler, report issues in the [Wrangler GitHub repository](https://github.com/cloudflare/workers-sdk/issues/new/choose).

You should include as much of the following in any bug report:

* The ID of your database. Use `wrangler d1 list` to match a database name to its ID.
* The query (or queries) you ran when you encountered an issue. Ensure you redact any personally identifying information (PII).
* The Worker code that makes the query, including any calls to `bind()` using the [Workers Binding API](https://developers.cloudflare.com/d1/worker-api/).
* The full error text, including the content of [`error.cause.message`](#handle-errors).

## Related resources

* Learn [how to debug Workers](https://developers.cloudflare.com/workers/observability/).
* Understand how to [access logs](https://developers.cloudflare.com/workers/observability/logs/) generated from your Worker and D1.
* Use [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) to run your Worker and D1 locally and [debug issues before deploying](https://developers.cloudflare.com/workers/development-testing/).

</page>

<page>
---
title: Metrics and analytics · Cloudflare D1 docs
description: D1 exposes database analytics that allow you to inspect query
  volume, query latency, and storage size across all and/or each database in
  your account.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/observability/metrics-analytics/
  md: https://developers.cloudflare.com/d1/observability/metrics-analytics/index.md
---

D1 exposes database analytics that allow you to inspect query volume, query latency, and storage size across all and/or each database in your account.

The metrics displayed in the [Cloudflare dashboard](https://dash.cloudflare.com/) charts are queried from Cloudflare’s [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). You can access the metrics [programmatically](#query-via-the-graphql-api) via GraphQL or HTTP client.

## Metrics

D1 currently exports the below metrics:

| Metric | GraphQL Field Name | Description |
| - | - | - |
| Read Queries (qps) | `readQueries` | The number of read queries issued against a database. This is the raw number of read queries, and is not used for billing. |
| Write Queries (qps) | `writeQueries` | The number of write queries issued against a database. This is the raw number of write queries, and is not used for billing. |
| Rows read (count) | `rowsRead` | The number of rows read (scanned) across your queries. See [Pricing](https://developers.cloudflare.com/d1/platform/pricing/) for more details on how rows are counted. |
| Rows written (count) | `rowsWritten` | The number of rows written across your queries. |
| Query Response (bytes) | `queryBatchResponseBytes` | The total response size of the serialized query response, including any/all column names, rows and metadata. Reported in bytes. |
| Query Latency (ms) | `queryBatchTimeMs` | The total query response time, including response serialization, on the server-side. Reported in milliseconds. |
| Storage (Bytes) | `databaseSizeBytes` | Maximum size of a database. Reported in bytes. |

Metrics can be queried (and are retained) for the past 31 days.

### Row counts

D1 returns the number of rows read, rows written (or both) in response to each individual query via [the Workers Binding API](https://developers.cloudflare.com/d1/worker-api/return-object/).

Row counts are a precise count of how many rows were read (scanned) or written by that query. Inspect row counts to understand the performance and cost of a given query, including whether you can reduce the rows read [using indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/). Use query counts to understand the total volume of traffic against your databases and to discern which databases are actively in-use.

Refer to the [Pricing documentation](https://developers.cloudflare.com/d1/platform/pricing/) for more details on how rows are counted.

## View metrics in the dashboard

Per-database analytics for D1 are available in the Cloudflare dashboard. To view current and historical metrics for a database:

1. In the Cloudflare dashboard, go to the **D1** page.

   [Go to **D1 SQL database**](https://dash.cloudflare.com/?to=/:account/workers/d1)

2. Select an existing D1 database.

3. Select the **Metrics** tab.

You can optionally select a time window to query. This defaults to the last 24 hours.

## Query via the GraphQL API

You can programmatically query analytics for your D1 databases via the [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). This API queries the same datasets as the Cloudflare dashboard, and supports GraphQL [introspection](https://developers.cloudflare.com/analytics/graphql-api/features/discovery/introspection/).

D1's GraphQL datasets require an `accountTag` filter with your Cloudflare account ID and include:

* `d1AnalyticsAdaptiveGroups`
* `d1StorageAdaptiveGroups`
* `d1QueriesAdaptiveGroups`

### Examples

To query the sum of `readQueries`, `writeQueries` for a given `$databaseId`, grouping by `databaseId` and `date`:
```

---

## and deploy it

**URL:** llms-txt#and-deploy-it

**Contents:**
  - Why build agents on Cloudflare?
  - Build on the Cloudflare Platform
- Features
  - Manage AI crawlers
  - Analyze AI traffic
  - Track robots.txt
  - Pay Per Crawl
- Use cases
- Related Products
- Features

npx wrangler@latest deploy
sh
npm i agents
js
  import { Agent, AgentNamespace } from "agents";

export class MyAgent extends Agent {
    // Define methods on the Agent:
    // https://developers.cloudflare.com/agents/api-reference/agents-api/
    //
    // Every Agent has built in state via this.setState and this.sql
    // Built-in scheduling via this.schedule
    // Agents support WebSockets, HTTP requests, state synchronization and
    // can run for seconds, minutes or hours: as long as the tasks need.
  }
  ts
  import { Agent, AgentNamespace } from "agents";

export class MyAgent extends Agent {
    // Define methods on the Agent:
    // https://developers.cloudflare.com/agents/api-reference/agents-api/
    //
    // Every Agent has built in state via this.setState and this.sql
    // Built-in scheduling via this.schedule
    // Agents support WebSockets, HTTP requests, state synchronization and
    // can run for seconds, minutes or hours: as long as the tasks need.
  }
  jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "durable_objects": {
      "bindings": [
        {
          "name": "MyAgent",
          "class_name": "MyAgent"
        }
      ]
    },
    "migrations": [
      {
        "tag": "v1",
        "new_sqlite_classes": [
          "MyAgent"
        ]
      }
    ]
  }
  toml
  [[durable_objects.bindings]]
  name = "MyAgent"
  class_name = "MyAgent"

[[migrations]]
  tag = "v1"
  new_sqlite_classes = ["MyAgent"]
  js
  import { Container, getContainer } from "@cloudflare/containers";

export class MyContainer extends Container {
    defaultPort = 4000; // Port the container is listening on
    sleepAfter = "10m"; // Stop the instance if requests not sent for 10 minutes
  }

export default {
    async fetch(request, env) {
      const { "session-id": sessionId } = await request.json();
      // Get the container instance for the given session ID
      const containerInstance = getContainer(env.MY_CONTAINER, sessionId);
      // Pass the request to the container instance on its default port
      return containerInstance.fetch(request);
    },
  };
  jsonc
    {
      "name": "container-starter",
      "main": "src/index.js",
      "compatibility_date": "2025-12-31",
      "containers": [
        {
          "class_name": "MyContainer",
          "image": "./Dockerfile",
          "max_instances": 5
        }
      ],
      "durable_objects": {
        "bindings": [
          {
            "class_name": "MyContainer",
            "name": "MY_CONTAINER"
          }
        ]
      },
      "migrations": [
        {
          "new_sqlite_classes": ["MyContainer"],
          "tag": "v1"
        }
      ]
    }
    toml
    name = "container-starter"
    main = "src/index.js"
    compatibility_date = "2025-12-31"

[[containers]]
    class_name = "MyContainer"
    image = "./Dockerfile"
    max_instances = 5

[[durable_objects.bindings]]
    class_name = "MyContainer"
    name = "MY_CONTAINER"

[[migrations]]
    new_sqlite_classes = [ "MyContainer" ]
    tag = "v1"
    jsonc
  {
    "name": "container-starter",
    "main": "src/index.js",
    "compatibility_date": "2025-12-31",
    "containers": [
      {
        "class_name": "MyContainer",
        "image": "./Dockerfile",
        "max_instances": 5
      }
    ],
    "durable_objects": {
      "bindings": [
        {
          "class_name": "MyContainer",
          "name": "MY_CONTAINER"
        }
      ]
    },
    "migrations": [
      {
        "new_sqlite_classes": ["MyContainer"],
        "tag": "v1"
      }
    ]
  }
  toml
  name = "container-starter"
  main = "src/index.js"
  compatibility_date = "2025-12-31"

[[containers]]
  class_name = "MyContainer"
  image = "./Dockerfile"
  max_instances = 5

[[durable_objects.bindings]]
  class_name = "MyContainer"
  name = "MY_CONTAINER"

[[migrations]]
  new_sqlite_classes = [ "MyContainer" ]
  tag = "v1"
  ts
    import postgres from 'postgres';

export default {
      async fetch(request, env, ctx): Promise<Response> {
        // Hyperdrive provides a unique generated connection string to connect to
        // your database via Hyperdrive that can be used with your existing tools
        const sql = postgres(env.HYPERDRIVE.connectionString);

try {
            // Sample SQL query
            const results = await sql`SELECT * FROM pg_tables`;
            return Response.json(results);
          } catch (e) {
            return Response.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
          }
        },

} satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
    json
      {
        "$schema": "node_modules/wrangler/config-schema.json",
        "name": "WORKER-NAME",
        "main": "src/index.ts",
        "compatibility_date": "2025-02-04",
        "compatibility_flags": [
          "nodejs_compat"
        ],
        "observability": {
          "enabled": true
        },
        "hyperdrive": [
          {
            "binding": "HYPERDRIVE",
            "id": "<YOUR_HYPERDRIVE_ID>",
            "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
          }
        ]
      }
    ts
    import { createConnection  } from 'mysql2/promise';

export default {
      async fetch(request, env, ctx): Promise<Response> {
        const connection = await createConnection({
         host: env.HYPERDRIVE.host,
         user: env.HYPERDRIVE.user,
         password: env.HYPERDRIVE.password,
         database: env.HYPERDRIVE.database,
         port: env.HYPERDRIVE.port,

// This is needed to use mysql2 with Workers
         // This configures mysql2 to use static parsing instead of eval() parsing (not available on Workers)
         disableEval: true
      });

const [results, fields] = await connection.query('SHOW tables;');

return new Response(JSON.stringify({ results, fields }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '\*',
        },
      });
    }} satisfies ExportedHandler<Env>;
    json
      {
        "$schema": "node_modules/wrangler/config-schema.json",
        "name": "WORKER-NAME",
        "main": "src/index.ts",
        "compatibility_date": "2025-02-04",
        "compatibility_flags": [
          "nodejs_compat"
        ],
        "observability": {
          "enabled": true
        },
        "hyperdrive": [
          {
            "binding": "HYPERDRIVE",
            "id": "<YOUR_HYPERDRIVE_ID>",
            "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
          }
        ]
      }
    ts
  import postgres from 'postgres';

export default {
    async fetch(request, env, ctx): Promise<Response> {
      // Hyperdrive provides a unique generated connection string to connect to
      // your database via Hyperdrive that can be used with your existing tools
      const sql = postgres(env.HYPERDRIVE.connectionString);

try {
          // Sample SQL query
          const results = await sql`SELECT * FROM pg_tables`;
          return Response.json(results);
        } catch (e) {
          return Response.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
        }
      },

} satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
  json
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "WORKER-NAME",
      "main": "src/index.ts",
      "compatibility_date": "2025-02-04",
      "compatibility_flags": [
        "nodejs_compat"
      ],
      "observability": {
        "enabled": true
      },
      "hyperdrive": [
        {
          "binding": "HYPERDRIVE",
          "id": "<YOUR_HYPERDRIVE_ID>",
          "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
        }
      ]
    }
  ts
  import { createConnection  } from 'mysql2/promise';

export default {
    async fetch(request, env, ctx): Promise<Response> {
      const connection = await createConnection({
       host: env.HYPERDRIVE.host,
       user: env.HYPERDRIVE.user,
       password: env.HYPERDRIVE.password,
       database: env.HYPERDRIVE.database,
       port: env.HYPERDRIVE.port,

// This is needed to use mysql2 with Workers
       // This configures mysql2 to use static parsing instead of eval() parsing (not available on Workers)
       disableEval: true
    });

const [results, fields] = await connection.query('SHOW tables;');

return new Response(JSON.stringify({ results, fields }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '\*',
      },
    });
  }} satisfies ExportedHandler<Env>;
  json
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "WORKER-NAME",
      "main": "src/index.ts",
      "compatibility_date": "2025-02-04",
      "compatibility_flags": [
        "nodejs_compat"
      ],
      "observability": {
        "enabled": true
      },
      "hyperdrive": [
        {
          "binding": "HYPERDRIVE",
          "id": "<YOUR_HYPERDRIVE_ID>",
          "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
        }
      ]
    }
  ```

[Get started](https://developers.cloudflare.com/hyperdrive/get-started/)

### Connect your database

Connect Hyperdrive to your existing database and deploy a [Worker](https://developers.cloudflare.com/workers/) that queries it.

[Connect Hyperdrive to your database](https://developers.cloudflare.com/hyperdrive/get-started/)

### PostgreSQL support

Hyperdrive allows you to connect to any PostgreSQL or PostgreSQL-compatible database.

[Connect Hyperdrive to your PostgreSQL database](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)

Hyperdrive allows you to connect to any MySQL database.

[Connect Hyperdrive to your MySQL database](https://developers.cloudflare.com/hyperdrive/examples/connect-to-mysql/)

Default-on caching for your most popular queries executed against your database.

[Learn about Query Caching](https://developers.cloudflare.com/hyperdrive/concepts/query-caching/)

**[Workers](https://developers.cloudflare.com/workers/)**

Build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

**[Pages](https://developers.cloudflare.com/pages/)**

Deploy dynamic front-end applications in record time.

[Pricing](https://developers.cloudflare.com/hyperdrive/platform/pricing/)

Learn about Hyperdrive's pricing.

[Limits](https://developers.cloudflare.com/hyperdrive/platform/limits/)

Learn about Hyperdrive limits.

[Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)

Learn more about the storage and database options you can build on with Workers.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Developer Platform.

<page>
---
title: Changelogs | Cloudflare Docs
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/changelog/
  md: https://developers.cloudflare.com/changelog/index.md
---

**Examples:**

Example 1 (unknown):
```unknown
Head to the guide on [building a chat agent](https://developers.cloudflare.com/agents/getting-started/build-a-chat-agent) to learn how the starter project is built and how to use it as a foundation for your own agents.

If you're already building on [Workers](https://developers.cloudflare.com/workers/), you can install the `agents` package directly into an existing project:
```

Example 2 (unknown):
```unknown
And then define your first Agent by creating a class that extends the `Agent` class:

* JavaScript
```

Example 3 (unknown):
```unknown
* TypeScript
```

Example 4 (unknown):
```unknown
Lastly, add the [Durable Objects](https://developers.cloudflare.com/durable-objects/) binding to your wrangler file:

* wrangler.jsonc
```

---

## Next time you run wrangler deploy, this will use the configuration in your newly generated wrangler.jsonc file

**URL:** llms-txt#next-time-you-run-wrangler-deploy,-this-will-use-the-configuration-in-your-newly-generated-wrangler.jsonc-file

* You must use Wrangler version 4.24.4 or later in order to use this feature

<page>
---
title: Built with Cloudflare button · Changelog
description: Our new "Built with Cloudflare" button can be used to share your
  stack of choice with the world.
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/changelog/2025-09-10-built-with-cloudflare-button/
  md: https://developers.cloudflare.com/changelog/2025-09-10-built-with-cloudflare-button/index.md
---

---

## Deploy to the production environment using CLOUDFLARE_ENV

**URL:** llms-txt#deploy-to-the-production-environment-using-cloudflare_env

CLOUDFLARE_ENV=production wrangler deploy

---

## resource "cloudflare_workers_deployment" "my_worker_deployment" {}

**URL:** llms-txt#resource-"cloudflare_workers_deployment"-"my_worker_deployment"-{}

**Examples:**

Example 1 (unknown):
```unknown
#### Deployments are always explicit, never implicit

Creating a version and deploying it are now always explicit, separate actions - never implicit side effects. To update version-specific settings (like bindings), you create a new version with those changes. The existing deployed version remains unchanged until you explicitly deploy the new one.
```

---

## Note: Your workers.dev deployment URL may be different

**URL:** llms-txt#note:-your-workers.dev-deployment-url-may-be-different

**Contents:**
- 8. Test with an optional frontend
- Conclusion
- Prerequisites
- 1. Install HonoX
- 2. Initialize your HonoX application
- 3. Create a database
- 4. Interact with D1
- 5. Create SQL statements
  - Retrieve data from database
  - Insert data into the database

curl https://d1-example.signalnerve.workers.dev/api/posts/hello-world/comments
[
  {
    "id": 1,
    "author": "Kristian",
    "body": "Hello from the comments section!",
    "post_slug": "hello-world"
  }
]
typescript
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use("/api/*", cors());
sh
npm create hono@latest
plaintext
.
├── app
│   ├── global.d.ts // global type definitions
│   ├── routes
│   │   ├── _404.tsx // not found page
│   │   ├── _error.tsx // error page
│   │   ├── _renderer.tsx // renderer definition
│   │   ├── about
│   │   │   └── [name].tsx // matches `/about/:name`
│   │   └── index.tsx // matches `/`
│   └── server.ts // server entry file
├── package.json
├── tsconfig.json
└── vite.config.ts
sh
npx wrangler d1 create staff-directory
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "name": "staff-directory",
    "compatibility_date": "2023-12-01"
  }
  toml
  name = "staff-directory"
  compatibility_date = "2023-12-01"
  jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "staff-directory",
        "database_id": "f495af5f-dd71-4554-9974-97bdda7137b3"
      }
    ]
  }
  toml
  [[d1_databases]]
  binding = "DB"
  database_name = "staff-directory"
  database_id = "f495af5f-dd71-4554-9974-97bdda7137b3"
  ts
import adapter from "@hono/vite-dev-server/cloudflare";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client()],
    };
  } else {
    return {
      plugins: [
        honox({
          devServer: {
            adapter,
          },
        }),
        pages(),
      ],
    };
  }
});
sh
wrangler d1 execute staff-directory --command "SELECT name FROM sqlite_schema WHERE type ='table'"
sql
CREATE TABLE locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_name VARCHAR(255) NOT NULL
);

CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    join_date DATE NOT NULL,
    location_id INTEGER REFERENCES locations(location_id),
    department_id INTEGER REFERENCES departments(department_id)
);

INSERT INTO locations (location_name) VALUES ('London, UK'), ('Paris, France'), ('Berlin, Germany'), ('Lagos, Nigeria'), ('Nairobi, Kenya'), ('Cairo, Egypt'), ('New York, NY'), ('San Francisco, CA'), ('Chicago, IL');

INSERT INTO departments (department_name) VALUES ('Software Engineering'), ('Product Management'), ('Information Technology (IT)'), ('Quality Assurance (QA)'), ('User Experience (UX)/User Interface (UI) Design'), ('Sales and Marketing'), ('Human Resources (HR)'), ('Customer Support'), ('Research and Development (R&D)'), ('Finance and Accounting');
sh
wrangler d1 execute staff-directory --file=./schema.sql
ts
export const findAllEmployees = async (db: D1Database) => {
  const query = `
      SELECT employees.*, locations.location_name, departments.department_name
      FROM employees
      JOIN locations ON employees.location_id = locations.location_id
      JOIN departments ON employees.department_id = departments.department_id
      `;
  const { results } = await db.prepare(query).run();
  const employees = results;
  return employees;
};
ts
export const createEmployee = async (db: D1Database, employee: Employee) => {
  const query = `
      INSERT INTO employees (name, position, join_date, image_url, department_id, location_id)
      VALUES (?, ?, ?, ?, ?, ?)`;

const results = await db
    .prepare(query)
    .bind(
      employee.name,
      employee.position,
      employee.join_date,
      employee.image_url,
      employee.department_id,
      employee.location_id,
    )
    .run();
  const employees = results;
  return employees;
};
ts
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" async />
      </head>
      <body>{children}</body>
    </html>
  )
})
ts
declare module "hono" {
  interface Env {
    Variables: {};
    Bindings: {
      DB: D1Database;
    };
  }
}
ts
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import Counter from '../islands/counter'

const className = css`
  font-family: sans-serif;
`

export default createRoute((c) => {
  const name = c.req.query('name') ?? 'Hono'
  return c.render(
    <div class={className}>
      <h1>Hello, {name}!</h1>
      <Counter />
    </div>,
    { title: name }
  )
})
ts
import { createRoute } from 'honox/factory'
import type { FC } from 'hono/jsx'
import type { Employee } from '../db'
import { findAllEmployees, findAllDepartments, findAllLocations } from '../db'

const EmployeeCard: FC<{ employee: Employee }> = ({ employee }) => {
  const { employee_id, name, image_url, department_name, location_name } = employee;
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md">
      <a href={`/employee/${employee_id}`}>
        <img className="bg-indigo-600 p-4 rounded-t-lg" src={image_url} alt={name} />
        //...
      </a>
    </div>
  );
};

export const GET = createRoute(async (c) => {
  const employees = await findAllEmployees(c.env.DB)
  const locations = await findAllLocations(c.env.DB)
  const departments = await findAllDepartments(c.env.DB)
  return c.render(
    <section className="flex-grow">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl mt-12">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-sky-400">{`Directory `}</span>
      </h1>
      //...
      </section>
      <section className="flex flex-wrap -mx-4">
        {employees.map((employee) => (
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </section>
    </section>
  )
})
ts
import { createRoute } from "honox/factory";
import type { Employee } from "../../db";
import { getFormDataValue, getFormDataNumber } from "../../utils/formData";
import { createEmployee } from "../../db";

export const POST = createRoute(async (c) => {
  try {
    const formData = await c.req.formData();
    const imageFile = formData.get("image_file");
    let imageUrl = "";

// TODO: process image url with R2

const employeeData: Employee = {
      employee_id: getFormDataValue(formData, "employee_id"),
      name: getFormDataValue(formData, "name"),
      position: getFormDataValue(formData, "position"),
      image_url: imageUrl,
      join_date: getFormDataValue(formData, "join_date"),
      department_id: getFormDataNumber(formData, "department_id"),
      location_id: getFormDataNumber(formData, "location_id"),
      location_name: "",
      department_name: "",
    };

await createEmployee(c.env.DB, employeeData);
    return c.redirect("/", 303);
  } catch (error) {
    return new Response("Error processing your request", { status: 500 });
  }
});
sh
wrangler r2 bucket create employee-avatars
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "r2_buckets": [
      {
        "binding": "MY_BUCKET",
        "bucket_name": "employee-avatars"
      }
    ]
  }
  toml
  [[r2_buckets]]
  binding = "MY_BUCKET"
  bucket_name = "employee-avatars"
  ts
declare module "hono" {
  interface Env {
    Variables: {};
    Bindings: {
      DB: D1Database;
      MY_BUCKET: R2Bucket;
    };
  }
}
ts
if (imageFile instanceof File) {
  const key = `${new Date().getTime()}-${imageFile.name}`;
  const fileBuffer = await imageFile.arrayBuffer();

await c.env.MY_BUCKET.put(key, fileBuffer, {
    httpMetadata: {
      contentType: imageFile.type || "application/octet-stream",
    },
  });
  console.log(`File uploaded successfully: ${key}`);
  imageUrl = `https://pub-8d936184779047cc96686a631f318fce.r2.dev/${key}`;
}
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "name": "staff-directory",
    "compatibility_date": "2023-12-01",
    "r2_buckets": [
      {
        "binding": "MY_BUCKET",
        "bucket_name": "employee-avatars"
      }
    ],
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "staff-directory",
        "database_id": "f495af5f-dd71-4554-9974-97bdda7137b3"
      }
    ]
  }
  toml
  name = "staff-directory"
  compatibility_date = "2023-12-01"

[[r2_buckets]]
  binding = "MY_BUCKET"
  bucket_name = "employee-avatars"

[[d1_databases]]
  binding = "DB"
  database_name = "staff-directory"
  database_id = "f495af5f-dd71-4554-9974-97bdda7137b3"
  sh
     npm create cloudflare@latest -- d1-http
     sh
     yarn create cloudflare d1-http
     sh
     pnpm create cloudflare@latest d1-http
     sh
   cd d1-http
   sh
     npm i hono
     sh
     yarn add hono
     sh
     pnpm add hono
     bash
   API_KEY="YOUR_API_KEY"
   sh
   openssl rand -base64 32
   ts
   import { Hono } from "hono";
   import { bearerAuth } from "hono/bearer-auth";
   import { logger } from "hono/logger";
   import { prettyJSON } from "hono/pretty-json";

type Bindings = {
     API_KEY: string;
   };

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", prettyJSON(), logger(), async (c, next) => {
     const auth = bearerAuth({ token: c.env.API_KEY });
     return auth(c, next);
   });
   ts
   // Paste this code at the end of the src/index.ts file

app.post("/api/all", async (c) => {
     return c.text("/api/all endpoint");
   });

app.post("/api/exec", async (c) => {
     return c.text("/api/exec endpoint");
   });

app.post("/api/batch", async (c) => {
     return c.text("/api/batch endpoint");
   });

export default app;
   sh
     npm run dev
     sh
     yarn run dev
     sh
     pnpm run dev
     sh
   curl -H "Authorization: Bearer YOUR_API_KEY" "http://localhost:8787/api/all" --data '{}'
   txt
   /api/all endpoint
   sh
   npx wrangler d1 create d1-http-example
   sh
   ✅ Successfully created DB 'd1-http-example' in region EEUR
   Created your new D1 database.

[[d1_databases]]
   binding = "DB" # i.e. available in your Worker on env.DB
   database_name = "d1-http-example"
   database_id = "1234567890"
   jsonc
     {
       "$schema": "./node_modules/wrangler/config-schema.json",
       "d1_databases": [
         {
           "binding": "DB",
           "database_name": "d1-http-example",
           "database_id": "1234567890"
         }
       ]
     }
     toml
     [[d1_databases]]
     binding = "DB" # i.e. available in your Worker on env.DB
     database_name = "d1-http-example"
     database_id = "1234567890"
     ts
   type Bindings = {
     DB: D1Database;
     API_KEY: string;
   };
   sql
   DROP TABLE IF EXISTS posts;
   CREATE TABLE IF NOT EXISTS posts (
     id integer PRIMARY KEY AUTOINCREMENT,
     author text NOT NULL,
     title text NOT NULL,
     body text NOT NULL,
     post_slug text NOT NULL
   );
   INSERT INTO posts (author, title, body, post_slug) VALUES ('Harshil', 'D1 HTTP API', 'Learn to create an API to query your D1 database.','d1-http-api');
   sh
   npx wrangler d1 execute d1-http-example --file=./schemas/schema.sql
   ts
   // Update the API routes

/**
   * Executes the `stmt.run()` method.
   * https://developers.cloudflare.com/d1/worker-api/prepared-statements/#run
   */

app.post('/api/all', async (c) => {
       return c.text("/api/all endpoint");
     try {
       let { query, params } = await c.req.json();
       let stmt = c.env.DB.prepare(query);
       if (params) {
         stmt = stmt.bind(params);
       }

const result = await stmt.run();
       return c.json(result);
     } catch (err) {
       return c.json({ error: `Failed to run query: ${err}` }, 500);
     }
   });

/**
   * Executes the `db.exec()` method.
   * https://developers.cloudflare.com/d1/worker-api/d1-database/#exec
   */

app.post('/api/exec', async (c) => {
       return c.text("/api/exec endpoint");
     try {
       let { query } = await c.req.json();
       let result = await c.env.DB.exec(query);
       return c.json(result);
     } catch (err) {
       return c.json({ error: `Failed to run query: ${err}` }, 500);
     }
   });

/**
   * Executes the `db.batch()` method.
   * https://developers.cloudflare.com/d1/worker-api/d1-database/#batch
   */

app.post('/api/batch', async (c) => {
       return c.text("/api/batch endpoint");
     try {
       let { batch } = await c.req.json();
       let stmts = [];
       for (let query of batch) {
         let stmt = c.env.DB.prepare(query.query);
         if (query.params) {
           stmts.push(stmt.bind(query.params));
         } else {
           stmts.push(stmt);
         }
       }
       const results = await c.env.DB.batch(stmts);
       return c.json(results);
     } catch (err) {
       return c.json({ error: `Failed to run query: ${err}` }, 500);
     }
   });
   ...
   sh
     npm run dev
     sh
     yarn run dev
     sh
     pnpm run dev
     sh
   curl -H "Authorization: Bearer YOUR_API_KEY" "http://localhost:8787/api/all" --data '{"query": "SELECT title FROM posts WHERE id=?", "params":1}'
   sh
   curl -H "Authorization: Bearer YOUR_API_KEY" "http://localhost:8787/api/batch" --data '{"batch": [ {"query": "SELECT title FROM posts WHERE id=?", "params":1},{"query": "SELECT id FROM posts"}]}'
   sh
   curl -H "Authorization: Bearer YOUR_API_KEY" "localhost:8787/api/exec" --data '{"query": "INSERT INTO posts (author, title, body, post_slug) VALUES ('\''Harshil'\'', '\''D1 HTTP API'\'', '\''Learn to create an API to query your D1 database.'\'','\''d1-http-api'\'')" }'
   sh
   npx wrangler d1 execute d1-http-example --file=./schemas/schema.sql --remote
   sh
   npx wrangler deploy
   sh
    ⛅️ wrangler 3.78.4 (update available 3.78.5)
   -------------------------------------------------------

Total Upload: 53.00 KiB / gzip: 13.16 KiB
   Your worker has access to the following bindings:
   - D1 Databases:
     - DB: d1-http-example (DATABASE_ID)
   Uploaded d1-http (4.29 sec)
   Deployed d1-http triggers (5.57 sec)
     [DEPLOYED_APP_LINK]
   Current Version ID: [BINDING_ID]
   sh
   openssl rand -base64 32
   sh
   [YOUR_API_KEY]
   sh
   npx wrangler secret put API_KEY
   sh
   ✔ Enter a secret value:
   sh
   ✔ Enter a secret value: [YOUR_API_KEY]
   sh
   🌀 Creating the secret for the Worker "d1-http"
   ✨ Success! Uploaded secret API_KEY
   sh
   curl -H "Authorization: Bearer YOUR_API_KEY" "https://DEPLOYED_APP_LINK/api/exec" --data '{"query": "SELECT 1"}'
   sh
npm create cloudflare@latest prisma-d1-example -- --type hello-world
sh
cd prisma-d1-example
sh
  npm i -D prisma
  sh
  yarn add -D prisma
  sh
  pnpm add -D prisma
  sh
  npm i @prisma/client @prisma/adapter-d1
  sh
  yarn add @prisma/client @prisma/adapter-d1
  sh
  pnpm add @prisma/client @prisma/adapter-d1
  sh
  npx prisma init --datasource-provider sqlite
  sh
  yarn prisma init --datasource-provider sqlite
  sh
  pnpm prisma init --datasource-provider sqlite
  prisma
generator client {
  provider        = "prisma-client-js"
  output          = "../src/generated/prisma"
  previewFeatures = ["driverAdapters"]
}
sh
npx wrangler d1 create prisma-demo-db
plaintext
✅ Successfully created DB 'prisma-demo-db' in region WEUR
Created your new D1 database.

{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "prisma-demo-db",
      "database_id": "<D1_DATABASE_ID>"
    }
  ]
}
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "name": "prisma-d1-example",
    "main": "src/index.ts",
    "compatibility_date": "2024-03-20",
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "observability": {
      "enabled": true
    },
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "prisma-demo-db",
        "database_id": "<D1_DATABASE_ID>"
      }
    ]
  }
  toml
  name = "prisma-d1-example"
  main = "src/index.ts"
  compatibility_date = "2024-03-20"
  compatibility_flags = ["nodejs_compat"]
  [observability]
  enabled = true

[[d1_databases]]
  binding = "DB" # i.e. available in your Worker on env.DB
  database_name = "prisma-demo-db"
  database_id = "<D1_DATABASE_ID>"
  sh
npx wrangler d1 migrations create prisma-demo-db create_user_table
prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
sh
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql
sql
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
sh

**Examples:**

Example 1 (unknown):
```unknown
## 8. Test with an optional frontend

This application is an API back-end, best served for use with a front-end UI for creating and viewing comments. To test this back-end with a prebuild front-end UI, refer to the example UI in the [example-frontend directory](https://github.com/cloudflare/workers-sdk/tree/main/templates/worker-d1-api/example-frontend). Notably, the [`loadComments` and `submitComment` functions](https://github.com/cloudflare/workers-sdk/tree/main/templates/worker-d1-api/example-frontend/src/views/PostView.vue#L57-L82) make requests to a deployed version of this site, meaning you can take the frontend and replace the URL with your deployed version of the codebase in this tutorial to use your own data.

Interacting with this API from a front-end will require enabling specific Cross-Origin Resource Sharing (or *CORS*) headers in your back-end API. Hono allows you to enable Cross-Origin Resource Sharing for your application. Import the `cors` module and add it as middleware to your API in `src/worker.js`:
```

Example 2 (unknown):
```unknown
Now, when you make requests to `/api/*`, Hono will automatically generate and add CORS headers to responses from your API, allowing front-end UIs to interact with it without erroring.

## Conclusion

In this example, you built a comments API for powering a blog. To see the full source for this D1-powered comments API, you can visit [cloudflare/workers-sdk/templates/worker-d1-api](https://github.com/cloudflare/workers-sdk/tree/main/templates/worker-d1-api).

</page>

<page>
---
title: Build a Staff Directory Application · Cloudflare D1 docs
description: Build a staff directory using D1. Users access employee info;
  admins add new employees within the app.
lastUpdated: 2025-10-13T13:40:40.000Z
chatbotDeprioritize: false
tags: Hono,TypeScript,SQL
source_url:
  html: https://developers.cloudflare.com/d1/tutorials/build-a-staff-directory-app/
  md: https://developers.cloudflare.com/d1/tutorials/build-a-staff-directory-app/index.md
---

In this tutorial, you will learn how to use D1 to build a staff directory. This application will allow users to access information about an organization's employees and give admins the ability to add new employees directly within the app. To do this, you will first need to set up a [D1 database](https://developers.cloudflare.com/d1/get-started/) to manage data seamlessly, then you will develop and deploy your application using the [HonoX Framework](https://github.com/honojs/honox) and [Cloudflare Pages](https://developers.cloudflare.com/pages).

## Prerequisites

Before moving forward with this tutorial, make sure you have the following:

* A Cloudflare account, if you do not have one, [sign up](https://dash.cloudflare.com/sign-up/workers-and-pages) before continuing.
* A recent version of [npm](https://docs.npmjs.com/getting-started) installed.

If you do not want to go through with the setup now, [view the completed code](https://github.com/lauragift21/staff-directory) on GitHub.

## 1. Install HonoX

In this tutorial, you will use [HonoX](https://github.com/honojs/honox), a meta-framework for creating full-stack websites and Web APIs to build your application. To use HonoX in your project, run the `hono-create` command.

To get started, run the following command:
```

Example 3 (unknown):
```unknown
During the setup process, you will be asked to provide a name for your project directory and to choose a template. When making your selection, choose the `x-basic` template.

## 2. Initialize your HonoX application

Once your project is set up, you can see a list of generated files as below. This is a typical project structure for a HonoX application:
```

Example 4 (unknown):
```unknown
The project includes directories for app code, routes, and server setup, alongside configuration files for package management, TypeScript, and Vite.

## 3. Create a database

To create a database for your project, use the Cloudflare CLI tool, [Wrangler](https://developers.cloudflare.com/workers/wrangler), which supports the `wrangler d1` command for D1 database operations. Create a new database named `staff-directory` with the following command:
```

---

## The endpoint for our worker, change this to wherever you deploy your worker

**URL:** llms-txt#the-endpoint-for-our-worker,-change-this-to-wherever-you-deploy-your-worker

worker_endpoint = "https://myworker.myzone.workers.dev/"

---
