# Cloudflare-Workers - Runtime Apis

**Pages:** 2

---

## Cache rule configuring cache settings and defining custom cache keys

**URL:** llms-txt#cache-rule-configuring-cache-settings-and-defining-custom-cache-keys

**Contents:**
- Set Browser Cache TTL
- Resulting cache status
- Resulting cache status
- General workflow for cache-tags
- Add Cache-Tag HTTP response headers
- A few things to remember
- Purge using cache-tags
- Resulting cache status
- Purge by device type
- Purge by geo

resource "cloudflare_ruleset" "cache_rules_example" {
  zone_id     = "<ZONE_ID>"
  name        = "Set cache settings"
  description = "Set cache settings for incoming requests"
  kind        = "zone"
  phase       = "http_request_cache_settings"

rules {
    ref         = "cache_settings_custom_cache_key"
    description = "Set cache settings and custom cache key for example.net"
    expression  = "(http.host eq \"example.net\")"
    action      = "set_cache_settings"
    action_parameters {
      edge_ttl {
        mode    = "override_origin"
        default = 60
        status_code_ttl {
          status_code = 200
          value       = 50
        }
        status_code_ttl {
          status_code_range {
            from = 201
            to   = 300
          }
          value = 30
        }
      }
      browser_ttl {
        mode = "respect_origin"
      }
      serve_stale {
        disable_stale_while_updating = true
      }
      respect_strong_etags = true
      cache_key {
        ignore_query_strings_order = false
        cache_deception_armor      = true
        custom_key {
          query_string {
            exclude {
              all = true
            }
          }
          header {
            include        = ["habc", "hdef"]
            check_presence = ["habc_t", "hdef_t"]
            exclude_origin = true
          }
          cookie {
            include        = ["cabc", "cdef"]
            check_presence = ["cabc_t", "cdef_t"]
          }
          user {
            device_type = true
            geo         = false
          }
          host {
            resolved = true
          }
        }
      }
      origin_error_page_passthru = false
    }
  }
}
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "files": [
        {
            "url": "http://my.website.com/",
            "headers": {
                "CF-Device-Type": "mobile"
            }
        }
    ]
  }'
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "files": [
        {
            "url": "http://my.website.com/",
            "headers": {
                "CF-IPCountry": "ES"
            }
        }
    ]
  }'
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "files": [
        {
            "url": "http://my.website.com/",
            "headers": {
                "accept-language": "zh-CN"
            }
        }
    ]
  }'
bash
https://api.cloudflare.com/client/v4/zones/<zone_id>/environments
json
{
  "result": {
    "environments": [
      {
        "name": "Production",
        "ref": "12abcd3e45f678940a573f51834a54",
        "version": 0,
        "expression": "(cf.zone.name eq \"example.com\")",
        "locked_on_deployment": false,
        "position": {
          "before": "5d41402abc4b2a76b9719d911017c"
        }
      },
      {
        "name": "Staging",
        "ref": "5d41402abc4b2a76b9719d911017c",
        "version": 0,
        "expression": "((cf.edge.server_ip in {1.2.3.4 5.6.7.8})) and (cf.zone.name eq \"example.com\")",
        "locked_on_deployment": false,
        "position": {
          "before": "49f0bad299687c62334182178bfd",
          "after": "12abcd3e45f678940a573f51834a54"
        }
      },
      {
        "name": "Development",
        "ref": "49f0bad299687c62334182178bfd",
        "version": 0,
        "expression": "((any(http.request.cookies[\"development\"][*] eq \"true\"))) and (cf.zone.name eq \"example.com\")",
        "locked_on_deployment": false,
        "position": {
          "after": "5d41402abc4b2a76b9719d911017c"
        }
      }
    ]
  },
  "success": true,
  "errors": [],
  "messages": []
}
bash
https://api.cloudflare.com/client/v4/zones/<zone_id>/purge_cache/
bash
https://api.cloudflare.com/client/v4/zones/<zone_id>/environments/5d41402abc4b2a76b9719d911017c/purge_cache/
bash
https://api.cloudflare.com/client/v4/zones/<zone_id>/environments/49f0bad299687c62334182178bfd/purge_cache/
html
<link rel="shortcut icon" href="<FAVICON_LINK>" />
txt
not cf.response.error_type in {"managed_challenge" "iuam" "legacy_challenge" "country_challenge"}
js
fetch("/my-api-endpoint").then((response) => {
  if (response.headers.get("cf-mitigated") === "challenge") {
    // Handle challenged response
  } else {
    // Process response as usual
  }
});
txt
"ssl": {
    "cloudflare_branding": true
  }
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames/$CUSTOM_HOSTNAME_ID" \
  --request PATCH \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  --json '{
    "ssl": {
        "method": "http",
        "type": "dv"
    },
    "custom_metadata": {
        "customer_id": "12345",
        "redirect_to_https": true,
        "security_tag": "low"
    }
  }'
js
  export default {
    /**
     * Fetch and add a X-Customer-Id header to the origin based on hostname
     * @param {Request} request
     */
    async fetch(request, env, ctx) {
      const customer_id = request.cf.hostMetadata.customer_id;
      const newHeaders = new Headers(request.headers);
      newHeaders.append("X-Customer-Id", customer_id);

const init = {
        headers: newHeaders,
        method: request.method,
      };
      return fetch(request.url, init);
    },
  };
  ts
  export default {
    /**
     * Fetch and add a X-Customer-Id header to the origin based on hostname
     * @param {Request} request
     */
    async fetch(request, env, ctx): Promise<Response> {
      const customer_id = request.cf.hostMetadata.customer_id;
      const newHeaders = new Headers(request.headers);
      newHeaders.append("X-Customer-Id", customer_id);

const init = {
        headers: newHeaders,
        method: request.method,
      };
      return fetch(request.url, init);
    },
  } satisfies ExportedHandler<Env>;
  txt
lookup_json_string(cf.hostname.metadata, "security_tag") eq "low"
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames" \
  --request POST \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  --json '{
    "hostname": "<CUSTOM_HOSTNAME>",
    "ssl": {
        "method": "http",
        "type": "dv",
        "settings": {
            "http2": "on",
            "min_tls_version": "1.2",
            "tls_1_3": "on",
            "early_hints": "on"
        },
        "bundle_method": "ubiquitous",
        "wildcard": false
    }
  }'
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames?hostname=%7Bhostname%7D" \
  --request GET \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames/$CUSTOM_HOSTNAME_ID" \
  --request PATCH \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  --json '{
    "ssl": {
        "method": "http",
        "type": "dv",
        "settings": {
            "http2": "on",
            "min_tls_version": "1.2",
            "tls_1_3": "on",
            "early_hints": "on"
        }
    }
  }'
plaintext
example.com CAA 0 issue "pki.goog; cansignhttpexchanges=yes"
example.com CAA 0 issuewild "pki.goog; cansignhttpexchanges=yes"

example.com CAA 0 issue "letsencrypt.org"
example.com CAA 0 issuewild "letsencrypt.org"

example.com CAA 0 issue "ssl.com"
example.com CAA 0 issuewild "ssl.com"
sh
  curl --request PATCH \\
  https://api.cloudflare.com/client/v4/zones/{zone_id}/custom_hostnames/{custom_hostname_id} \\
  --header "X-Auth-Email: <EMAIL>" \\
  --header "X-Auth-Key: <API_KEY>" \\
  --header "Content-Type: application/json" \\
  --data '{
    "ssl": {
        "method": "txt",
        "type": "dv",
        "certificate_authority": ""
    }
  }'
  txt
Since no host is 64 characters or fewer, Cloudflare Branding is required. Please check your input and try again. (1469)
mermaid
flowchart TD
accTitle: O2O-enabled traffic flow diagram

subgraph Cloudflare
  B[Customer-owned zone]
  C[SaaS Provider-owned zone]
end

D[SaaS Provider Origin]

A --> B
B --> C
C --> D
mermaid
flowchart TD
accTitle: Your zone using a SaaS provider, but without O2O

subgraph Cloudflare
    B[SaaS Provider-owned zone]
end

C[SaaS Provider Origin]

A --> B
B --> C
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames" \
  --request POST \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  --json '{
    "hostname": "<CUSTOM_HOSTNAME>",
    "ssl": {
        "wildcard": false
    }
  }'
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames" \
  --request GET \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames/$CUSTOM_HOSTNAME_ID" \
  --request PATCH \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  --json '{
    "custom_metadata": {
        "customer_id": "12345",
        "security_level": "low"
    }
  }'
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_ratelimit/entrypoint" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "rules": [
        {
            "action": "block",
            "ratelimit": {
                "characteristics": [
                    "cf.colo.id",
                    "ip.src"
                ],
                "period": 10,
                "requests_per_period": 2,
                "mitigation_timeout": 60
            },
            "expression": "lookup_json_string(cf.hostname.metadata, \"security_level\") eq \"low\" and http.request.uri contains \"login\""
        }
    ]
  }'
txt
mystore.example.com CNAME customers.saasprovider.com
mermaid
flowchart TD
accTitle: How traffic routing works with a CNAME target
A[Request to <code>mystore.example.com</code>] --> B[<code>customers.saasprovider.com</code>]
B --> C[<code>proxy-fallback.saasprovider.com</code>]
bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/<account-id>/workers/dispatch/namespaces/<your-namespace>/scripts/<script-name>" \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer <api-token>" \
  -F 'metadata={
    "main_module": "worker.js",
    "bindings": [
      {
        "type": "kv_namespace",
        "name": "USER_KV",
        "namespace_id": "<your-namespace-id>"
      }
    ]
  }' \
  -F 'worker.js=@/path/to/worker.js'
bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/<account-id>/workers/dispatch/namespaces/<your-namespace>/scripts/<script-name>" \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer <api-token>" \
  -F 'metadata={
    "bindings": [
      {
        "type": "r2_bucket",
        "name": "STORAGE",
        "bucket_name": "<your-bucket-name>"
      }
    ],
    "keep_bindings": ["kv_namespace"]
  }'
js
export default {
  async fetch(request, env) {
    try {
      // parse the URL, read the subdomain
      let workerName = new URL(request.url).host.split(".")[0];
      let userWorker = env.dispatcher.get(
        workerName,
        {},
        {
          // set limits
          limits: { cpuMs: 10, subRequests: 5 },
        },
      );
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith("Worker not found")) {
        // we tried to get a worker that doesn't exist in our dispatch namespace
        return new Response("", { status: 404 });
      }
      return new Response(e.message, { status: 500 });
    }
  },
};
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "dispatch_namespaces": [
      {
        "binding": "DISPATCHER",
        "namespace": "my-dispatch-namespace"
      }
    ]
  }
  toml
  [[dispatch_namespaces]]
  binding = "DISPATCHER"
  namespace = "my-dispatch-namespace"
  js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

// Use hostname, path, or any combination as the routing key
      const routingKey = url.hostname;

// Lookup user Worker name from KV store
      const userWorkerName = await env.USER_ROUTING.get(routingKey);

if (!userWorkerName) {
        return new Response("Route not configured", { status: 404 });
      }

// Optional: Cache the KV lookup result
      const userWorker = env.DISPATCHER.get(userWorkerName);
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith("Worker not found")) {
        return new Response("", { status: 404 });
      }
      return new Response(e.message, { status: 500 });
    }
  },
};
js
export default {
  async fetch(request, env) {
    try {
      // Extract user Worker name from subdomain
      // Example: customer1.example.com -> customer1
      const url = new URL(request.url);
      const userWorkerName = url.hostname.split(".")[0];

// Get user Worker from dispatch namespace
      const userWorker = env.DISPATCHER.get(userWorkerName);
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith("Worker not found")) {
        // User Worker doesn't exist in dispatch namespace
        return new Response("", { status: 404 });
      }
      // Could be any other exception from fetch() or from the dispatched Worker
      return new Response(e.message, { status: 500 });
    }
  },
};
js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/").filter(Boolean);

if (pathParts.length === 0) {
        return new Response("Invalid path", { status: 400 });
      }

// example.com/customer-1 -> routes to 'customer-1' worker
      const userWorkerName = pathParts[0];

const userWorker = env.DISPATCHER.get(userWorkerName);
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith("Worker not found")) {
        return new Response("", { status: 404 });
      }
      return new Response(e.message, { status: 500 });
    }
  },
};
js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const userWorkerName = url.hostname.split(".")[0];

// Look up customer plan from your database or KV
      const customerPlan = await env.CUSTOMERS.get(userWorkerName);

// Set limits based on plan type
      const plans = {
        enterprise: { cpuMs: 50, subRequests: 50 },
        pro: { cpuMs: 20, subRequests: 20 },
        free: { cpuMs: 10, subRequests: 5 },
      };
      const limits = plans[customerPlan] || plans.free;

const userWorker = env.DISPATCHER.get(userWorkerName, {}, { limits });
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith("Worker not found")) {
        return new Response("", { status: 404 });
      }
      if (e.message.includes("CPU time limit")) {
        // Track limit violations with Analytics Engine
        env.ANALYTICS.writeDataPoint({
          indexes: [userWorkerName],
          blobs: ["cpu_limit_exceeded"],
        });
        return new Response("CPU limit exceeded", { status: 429 });
      }
      return new Response(e.message, { status: 500 });
    }
  },
};
js
export default {
  async fetch(request, env) {
    const hostname = new URL(request.url).hostname;

// Get custom hostname metadata for routing decisions
    const hostnameData = await env.KV.get(`hostname:${hostname}`, {
      type: "json",
    });

if (!hostnameData?.workerName) {
      return new Response("Hostname not configured", { status: 404 });
    }

// Route to the appropriate user Worker
    const userWorker = env.DISPATCHER.get(hostnameData.workerName);
    return await userWorker.fetch(request);
  },
};
js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const subdomain = url.hostname.split(".")[0];

// Route based on subdomain
    if (subdomain && subdomain !== "saas") {
      const userWorker = env.DISPATCHER.get(subdomain);
      return await userWorker.fetch(request);
    }

return new Response("Invalid subdomain", { status: 400 });
  },
};
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "dispatch_namespaces": [
      {
        "binding": "dispatcher",
        "namespace": "<NAMESPACE_NAME>",
        "outbound": {
          "service": "<SERVICE_NAME>",
          "parameters": [
            "params_object"
          ]
        }
      }
    ]
  }
  toml
  [[dispatch_namespaces]]
  binding = "dispatcher"
  namespace = "<NAMESPACE_NAME>"
  outbound = {service = "<SERVICE_NAME>", parameters = ["params_object"]}
  js
export default {
  async fetch(request, env) {
    try {
      // parse the URL, read the subdomain
      let workerName = new URL(request.url).host.split(".")[0];

let context_from_dispatcher = {
        customer_name: workerName,
        url: request.url,
      };

let userWorker = env.dispatcher.get(
        workerName,
        {},
        {
          // outbound arguments. object name must match parameters in the binding
          outbound: {
            params_object: context_from_dispatcher,
          },
        },
      );
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith("Worker not found")) {
        // we tried to get a worker that doesn't exist in our dispatch namespace
        return new Response("", { status: 404 });
      }
      return new Response(e.message, { status: 500 });
    }
  },
};
js
export default {
  // this event is fired when the dispatched Workers make a subrequest
  async fetch(request, env, ctx) {
    // env contains the values we set in `dispatcher.get()`
    const customer_name = env.customer_name;
    const original_url = env.url;

// log the request
    ctx.waitUntil(
      fetch("https://logs.example.com", {
        method: "POST",
        body: JSON.stringify({
          customer_name,
          original_url,
        }),
      }),
    );

const url = new URL(original_url);
    if (url.host === "api.example.com") {
      // pre-auth requests to our API
      const jwt = make_jwt_for_customer(customer_name);

let headers = new Headers(request.headers);
      headers.set("Authorization", `Bearer ${jwt}`);

// clone the request to set new headers using existing body
      let new_request = new Request(request, { headers });

return fetch(new_request);
    }

return fetch(request);
  },
};
json
{
  "/index.html": {
    "hash": "08f1dfda4574284ab3c21666d1ee8c7d4",
    "size": 1234
  },
  "/styles.css": {
    "hash": "36b8be012ee77df5f269b11b975611d3",
    "size": 5678
  }
}
bash
POST /accounts/{account_id}/workers/dispatch/namespaces/{namespace}/scripts/{script_name}/assets-upload-session
bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME/assets-upload-session" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  --data '{
    "manifest": {
      "/index.html": {
        "hash": "08f1dfda4574284ab3c21666d1ee8c7d4",
        "size": 1234
      },
      "/styles.css": {
        "hash": "36b8be012ee77df5f269b11b975611d3",
        "size": 5678
      }
    }
  }'
bash
Authorization: Bearer <upload-session-token>
json
"buckets": [
  [
    "08f1dfda4574284ab3c21666d1ee8c7d4",
    "36b8be012ee77df5f269b11b975611d3"
  ]
]
bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/assets/upload?base64=true" \
  -H "Authorization: Bearer <upload-session-token>" \
  -F "08f1dfda4574284ab3c21666d1ee8c7d4=<BASE64_OF_INDEX_HTML>" \
  -F "36b8be012ee77df5f269b11b975611d3=<BASE64_OF_STYLES_CSS>"
json
{
  "success": true,
  "errors": [],
  "messages": [],
  "result": {
    "jwt": "<completion-token>"
  }
}
bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME" \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer $API_TOKEN" \
  -F 'metadata={
    "main_module": "index.js",
    "assets": {
      "jwt": "<completion-token>",
      "config": {
        "html_handling": "auto-trailing-slash"
      }
    },
    "compatibility_date": "2025-01-24"
  };type=application/json' \
  -F 'index.js=@/path/to/index.js;type=application/javascript'
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "name": "my-static-site",
    "main": "./src/index.js",
    "compatibility_date": "2025-01-29",
    "assets": {
      "directory": "./public",
      "binding": "ASSETS"
    }
  }
  toml
  name = "my-static-site"
  main = "./src/index.js"
  compatibility_date = "2025-01-29"

[assets]
  directory = "./public"
  binding = "ASSETS"
  js
export default {
  async fetch(request, env, ctx) {
    return env.ASSETS.fetch(request);
  },
};
bash
npx wrangler deploy --name <USER_WORKER_NAME> --dispatch-namespace <NAMESPACE_NAME>
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts/$SCRIPT_NAME/tags" \
  --request GET \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts/$SCRIPT_NAME/tags" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts/$SCRIPT_NAME/tags/$TAG" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts/$SCRIPT_NAME/tags/$TAG" \
  --request DELETE \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts?tags=production%3Ayes" \
  --request GET \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts?tags=customer-123%3Ayes" \
  --request DELETE \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
jsonc
  {
    "dispatch_namespaces": [
      {
        "binding": "DISPATCH_NAMESPACE",
        "namespace": "production",
        "remote": true
      }
    ]
  }
  toml
  [[dispatch_namespaces]]
  binding = "DISPATCH_NAMESPACE"
  namespace = "production"
  remote = true
  sh
npm install cloudflare
bash
  # First, create the worker script file
  cat > worker.mjs << 'EOF'
  export default {
    async fetch(request, env, ctx) {
      return new Response("Hello from user Worker!");
    },
  };
  EOF

# Deploy using multipart form (required for ES modules)
  curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME" \
    -H "Authorization: Bearer $API_TOKEN" \
    -F 'metadata={"main_module": "worker.mjs"};type=application/json' \
    -F 'worker.mjs=@worker.mjs;type=application/javascript+module'
  typescript
  import Cloudflare from "cloudflare";

const client = new Cloudflare({
    apiToken: process.env.API_TOKEN,
  });

async function deployUserWorker(
    accountId: string,
    namespace: string,
    scriptName: string,
    scriptContent: string,
  ) {
    const scriptFile = new File([scriptContent], `${scriptName}.mjs`, {
      type: "application/javascript+module",
    });

const result =
      await client.workersForPlatforms.dispatch.namespaces.scripts.update(
        namespace,
        scriptName,
        {
          account_id: accountId,
          metadata: {
            main_module: `${scriptName}.mjs`,
          },
          files: [scriptFile],
        },
      );

// Usage
  await deployUserWorker(
    "your-account-id",
    "production",
    "customer-123",
    `export default {
    async fetch(request, env, ctx) {
      return new Response("Hello from customer 123!");
    },
  };`,
  );
  bash
  curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME" \
    -H "Authorization: Bearer $API_TOKEN" \
    -F 'metadata={"main_module": "worker.mjs", "bindings": [{"type": "kv_namespace", "name": "MY_KV", "namespace_id": "your-kv-namespace-id"}], "tags": ["customer-123", "production", "pro-plan"], "compatibility_date": "2024-01-01"};type=application/json' \
    -F 'worker.mjs=@worker.mjs;type=application/javascript+module'
  typescript
  import Cloudflare from "cloudflare";

const client = new Cloudflare({
    apiToken: process.env.API_TOKEN,
  });

async function deployWorkerWithBindingsAndTags(
    accountId: string,
    namespace: string,
    scriptName: string,
    scriptContent: string,
    kvNamespaceId: string,
    tags: string[],
  ) {
    const scriptFile = new File([scriptContent], `${scriptName}.mjs`, {
      type: "application/javascript+module",
    });

const result =
      await client.workersForPlatforms.dispatch.namespaces.scripts.update(
        namespace,
        scriptName,
        {
          account_id: accountId,
          metadata: {
            main_module: `${scriptName}.mjs`,
            compatibility_date: "2024-01-01",
            bindings: [
              {
                type: "kv_namespace",
                name: "MY_KV",
                namespace_id: kvNamespaceId,
              },
            ],
            tags: tags, // e.g., ["customer-123", "production", "pro-plan"]
          },
          files: [scriptFile],
        },
      );

// Usage
  const scriptContent = `export default {
    async fetch(request, env, ctx) {
      const value = await env.MY_KV.get("key") || "default";
      return new Response(value);
    },
  };`;

await deployWorkerWithBindingsAndTags(
    "your-account-id",
    "production",
    "customer-123-app",
    scriptContent,
    "kv-namespace-id",
    ["customer-123", "production", "pro-plan"],
  );
  bash
  curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME/assets-upload-session" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "manifest": {
        "/index.html": {
          "hash": "<sha256-hash-first-16-bytes-hex>",
          "size": 1234
        },
        "/styles.css": {
          "hash": "<sha256-hash-first-16-bytes-hex>",
          "size": 567
        }
      }
    }'
  bash
  curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/assets/upload?base64=true" \
    -H "Authorization: Bearer $JWT_FROM_STEP_1" \
    -F '<hash1>=<base64-encoded-content>' \
    -F '<hash2>=<base64-encoded-content>'
  bash
  curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME" \
    -H "Authorization: Bearer $API_TOKEN" \
    -F 'metadata={"main_module": "worker.mjs", "assets": {"jwt": "<completion-token>"}, "bindings": [{"type": "assets", "name": "ASSETS"}]};type=application/json' \
    -F 'worker.mjs=export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };type=application/javascript+module'
  typescript
  interface AssetFile {
    path: string; // e.g., "/index.html"
    content: string; // base64 encoded content
    size: number; // file size in bytes
  }

async function hashContent(base64Content: string): Promise<string> {
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Use first 16 bytes (32 hex chars) per API requirement
    return hashArray
      .slice(0, 16)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

async function deployWorkerWithAssets(
    accountId: string,
    namespace: string,
    scriptName: string,
    assets: AssetFile[],
  ) {
    const apiToken = process.env.API_TOKEN;
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers`;

// Step 1: Build manifest
    const manifest: Record<string, { hash: string; size: number }> = {};
    const hashToAsset = new Map<string, AssetFile>();

for (const asset of assets) {
      const hash = await hashContent(asset.content);
      const path = asset.path.startsWith("/") ? asset.path : "/" + asset.path;
      manifest[path] = { hash, size: asset.size };
      hashToAsset.set(hash, asset);
    }

// Step 2: Create upload session
    const sessionResponse = await fetch(
      `${baseUrl}/dispatch/namespaces/${namespace}/scripts/${scriptName}/assets-upload-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manifest }),
      },
    );

const sessionData = (await sessionResponse.json()) as {
      success: boolean;
      result?: { jwt: string; buckets?: string[][] };
    };

if (!sessionData.success || !sessionData.result) {
      throw new Error("Failed to create upload session");
    }

let completionToken = sessionData.result.jwt;
    const buckets = sessionData.result.buckets;

// Step 3: Upload assets in buckets
    if (buckets && buckets.length > 0) {
      for (const bucket of buckets) {
        const formData = new FormData();
        for (const hash of bucket) {
          const asset = hashToAsset.get(hash);
          if (asset) {
            formData.append(hash, asset.content);
          }
        }

const uploadResponse = await fetch(
          `${baseUrl}/assets/upload?base64=true`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${completionToken}` },
            body: formData,
          },
        );

const uploadData = (await uploadResponse.json()) as {
          success: boolean;
          result?: { jwt?: string };
        };

if (uploadData.result?.jwt) {
          completionToken = uploadData.result.jwt;
        }
      }
    }

// Step 4: Deploy worker with assets binding
    const workerCode = `
  export default {
    async fetch(request, env) {
      return env.ASSETS.fetch(request);
    }
  };`;

const deployFormData = new FormData();
    const metadata = {
      main_module: `${scriptName}.mjs`,
      assets: { jwt: completionToken },
      bindings: [{ type: "assets", name: "ASSETS" }],
    };

deployFormData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" }),
    );
    deployFormData.append(
      `${scriptName}.mjs`,
      new Blob([workerCode], { type: "application/javascript+module" }),
    );

const deployResponse = await fetch(
      `${baseUrl}/dispatch/namespaces/${namespace}/scripts/${scriptName}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: deployFormData,
      },
    );

return deployResponse.json();
  }

// Usage
  await deployWorkerWithAssets("your-account-id", "production", "customer-site", [
    {
      path: "/index.html",
      content: btoa("<html><body>Hello World</body></html>"),
      size: 37,
    },
    {
      path: "/styles.css",
      content: btoa("body { font-family: sans-serif; }"),
      size: 33,
    },
  ]);
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts" \
    -H "Authorization: Bearer $API_TOKEN"
  typescript
  async function listWorkers(accountId: string, namespace: string) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/dispatch/namespaces/${namespace}/scripts`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      },
    );

const data = (await response.json()) as {
      success: boolean;
      result: Array<{ id: string; tags?: string[] }>;
    };

return data.result;
  }

// Usage
  const workers = await listWorkers("your-account-id", "production");
  console.log(workers);
  bash
  curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts?tags=customer-123:yes" \
    -H "Authorization: Bearer $API_TOKEN"
  typescript
  async function deleteWorkersByTag(
    accountId: string,
    namespace: string,
    tag: string,
  ) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/dispatch/namespaces/${namespace}/scripts?tags=${tag}:yes`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      },
    );

return response.json();
  }

// Usage: Delete all Workers for a customer
  await deleteWorkersByTag("your-account-id", "production", "customer-123");
  bash
  curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/dispatch/namespaces/$NAMESPACE_NAME/scripts/$SCRIPT_NAME" \
    -H "Authorization: Bearer $API_TOKEN"
  typescript
  import Cloudflare from "cloudflare";

const client = new Cloudflare({
    apiToken: process.env.API_TOKEN,
  });

async function deleteWorker(
    accountId: string,
    namespace: string,
    scriptName: string,
  ) {
    const result =
      await client.workersForPlatforms.dispatch.namespaces.scripts.delete(
        namespace,
        scriptName,
        { account_id: accountId },
      );

// Usage
  await deleteWorker("your-account-id", "production", "customer-123");
  bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/dispatch/namespaces/{namespace_name}" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "{namespace_name}",
    "trusted_workers": true
  }'
mermaid
flowchart TB
    %% Accessibility
    accTitle: Access session durations
    accDescr: Flowchart describing the order of enforcement for Access sessions

%% In with user traffic
    start["User goes to Access application"]
    start--"WARP authentication enabled" -->warpsession[WARP session expired?]
    start-- "WARP authentication disabled" --> policysession[Policy session expired?]

warpsession--"Yes"-->idp[Prompt to log in to IdP]
		warpsession--"No"-->accessgranted[Access granted]

policysession--"Yes"-->globalsession[Global session expired?]
		policysession--"No"-->accessgranted

globalsession--"Yes"-->idp
		globalsession--"No"-->refreshtoken[Check identity against Access policies]
		refreshtoken-->accessgranted
		idp-->refreshtoken
json
{
  "mcpServers": {
    "example-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://<subdomain>.<domain>.com/mcp"
      ]
    }
  }
}
sh
rm -rf ~/.mcp-auth
mermaid
flowchart LR
accTitle: Link MCP servers and self-hosted applications in Access
    subgraph SaaS["Access for SaaS <br> OIDC app"]
        mcp["MCP server <br> for internal apps"]
    end

subgraph "Access self-hosted app"
        app1[Admin dashboard]
    end

subgraph "Access self-hosted app"
        app2[Company wiki]
    end

User --> client["MCP client"]
    client --> mcp
    mcp -- Access token --> app1
		mcp -- Access token --> app2
		idp[Identity provider] <--> SaaS
bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps" \
       --request GET \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
     json
     {
       "id": "3537a672-e4d8-4d89-aab9-26cb622918a1",
       "uid": "3537a672-e4d8-4d89-aab9-26cb622918a1",
       "type": "saas",
       "name": "mcp-server-cf-access",
       ...
     }
     bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/policies" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "Allow MCP server",
         "decision": "non_identity",
         "include": [
             {
                 "linked_app_token": {
                     "app_uid": "3537a672-e4d8-4d89-aab9-26cb622918a1"
                 }
             }
         ]
       }'
     json
     {
         "created_at": "2025-08-06T20:06:23Z",
         "decision": "non_identity",
         "exclude": [],
         "id": "a38ab4d4-336d-4f49-9e97-eff8550c13fa",
         "include": [
           {
             "linked_app_token": {
               "app_uid": "6cdc3892-f9f1-4813-a5ce-38c2753e1208"
             }
           }
         ],
         "name": "Allow MCP server",
         ...
     }
     txt
Authorization: Bearer ACCESS_TOKEN
sh
   npm create cloudflare@latest -- mcp-server-cf-access --template=cloudflare/ai/demos/remote-mcp-cf-access
   sh
   cd mcp-server-cf-access
   sh
   npx wrangler kv namespace create "OAUTH_KV"
   sh
   {
     "kv_namespaces": [
       {
         "binding": "OAUTH_KV",
         "id": "<YOUR_KV_NAMESPACE_ID>"
       }
     ]
   }
   jsonc
   "kv_namespaces": [
     {
       "binding": "OAUTH_KV",
       "id": "<YOUR_KV_NAMESPACE_ID>"
     }
   ],
   sh
   npx wrangler deploy
   bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "MCP server",
         "type": "saas",
         "saas_app": {
             "auth_type": "oidc",
             "redirect_uris": [
                 "https://mcp-server-cf-access.<YOUR_SUBDOMAIN>.workers.dev/callback"
             ],
             "grant_type": [
                 "authorization_code",
                 "refresh_tokens"
             ],
             "refresh_token_options": {
                 "lifetime": "90d"
             }
         },
         "policies": [
             "f174e90a-fafe-4643-bbbc-4a0ed4fc8415"
         ],
         "allowed_idps": []
       }'
     sh
   wrangler secret put ACCESS_CLIENT_ID
   wrangler secret put ACCESS_CLIENT_SECRET
   wrangler secret put ACCESS_TOKEN_URL
   wrangler secret put ACCESS_AUTHORIZATION_URL
   wrangler secret put ACCESS_JWKS_URL
   sh
   openssl rand -hex 32
   sh
   wrangler secret put COOKIE_ENCRYPTION_KEY
   sh
   npm create cloudflare@latest my-worker -- --template https://github.com/cloudflare/workers-access-external-auth-example
   sh
   cd my-worker
   sh
   npx wrangler kv namespace create "KV"
   txt
     [[kv_namespaces]]
      binding = "KV"
      id = "YOUR_KV_NAMESPACE_ID"
   jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "name": "my-worker",
    "workers_dev": true,
    "compatibility_date": "2024-08-06",
    "main": "index.js",
    "kv_namespaces": [
      {
        "binding": "KV",
        "id": "YOUR_KV_NAMESPACE_ID"
      }
    ],
    "vars": {
      "TEAM_DOMAIN": "<TEAM_NAME>.cloudflareaccess.com",
      "DEBUG": false
    }
  }
  toml
  name = "my-worker"
  workers_dev = true
  compatibility_date = "2024-08-06"
  main = "index.js"

[[kv_namespaces]]
  binding = "KV"
  id = "YOUR_KV_NAMESPACE_ID"

[vars]
  TEAM_DOMAIN="<TEAM_NAME>.cloudflareaccess.com"
  DEBUG=false
  sh
   npx wrangler deploy
   sh
   cd my-worker
   sh
   npx wrangler deploy
   sh
   wrangler tail -f pretty
   js
   {
   "success": true,
   "iat": 1655409315,
   "exp": 1655409375,
   "nonce": "9J2E9Xg6wYj8tlnA5MV4Zgp6t8rzmS0Q"
   }
   bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/groups" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Lisbon-team",
      "include": [
          {
              "geo": {
                  "country_code": "PT"
              }
          }
      ],
      "exclude": [],
      "require": [
          {
              "email_domain": {
                  "domain": "team.com"
              }
          }
      ],
      "is_default": false
    }'
  bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps/$APP_ID/policies/$POLICY_ID/make_reusable" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
txt
   -----BEGIN CERTIFICATE-----
   <intermediate.pem>
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   <rootCA.pem>
   -----END CERTIFICATE-----
   sh
   curl -sv https://auth.example.com
   sh
   curl -sv https://auth.example.com --cert example.pem --key key.pem
   sh
    openssl genrsa -aes256 -out rootCA.key 4096
   sh
   openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.pem
   sh
    openssl genrsa -aes256 -out intermediate.key 4096
   sh
   openssl req -new -sha256 -key intermediate.key -out intermediate.csr
   txt
   subjectKeyIdentifier = hash
   authorityKeyIdentifier = keyid:always,issuer
   basicConstraints = critical, CA:true
   keyUsage = critical, cRLSign, keyCertSign
   sh
    openssl x509 -req -in intermediate.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out intermediate.pem -days 1825 -sha256 -extfile v3_intermediate_ca.ext
   sh
   cat intermediate.pem rootCA.pem > ca-chain.pem
   sh
    openssl genrsa -out client.key 2048
   sh
   openssl req -new -key client.key -out client.csr
   sh
    openssl x509 -req -in client.csr -CA intermediate.pem -CAkey intermediate.key -CAcreateserial -out client.pem -days 365 -sha256
   sh
   openssl verify -CAfile ca-chain.pem client.pem
   sh
   client.pem: OK
   json
     {
       "CN": "Access Testing CA",
       "key": {
         "algo": "rsa",
         "size": 4096
       },
       "names": [
         {
           "C": "US",
           "L": "Austin",
           "O": "Access Testing",
           "OU": "TX",
           "ST": "Texas"
         }
       ]
     }
     json
     {
       "signing": {
         "default": {
           "expiry": "8760h"
         },
         "profiles": {
           "server": {
             "usages": ["signing", "key encipherment", "server auth"],
             "expiry": "8760h"
           },
           "client": {
             "usages": ["signing", "key encipherment", "client auth"],
             "expiry": "8760h"
           }
         }
       }
     }
     sh
   cfssl gencert -initca ca-csr.json | cfssljson -bare ca
   sh
   ls
   sh
   ca-config.json ca-csr.json ca-key.pem ca.csr  ca.pem
   json
   {
     "CN": "James Royal",
     "hosts": [""],
     "key": {
       "algo": "rsa",
       "size": 4096
     },
     "names": [
       {
         "C": "US",
         "L": "Austin",
         "O": "Access",
         "OU": "Access Admins",
         "ST": "Texas"
       }
     ]
   }
   sh
   cfssl gencert -ca=ca.pem -ca-key=ca-key.pem  -config=ca-config.json -profile=client client-csr.json | cfssljson -bare client
   sh
   cfssl gencrl serials.txt ../mtls-test/ca.pem ../mtls-test/ca-key.pem | base64 -D > ca.crl
   bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/access/certificates/settings" \
  --request PUT \
  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  --json '{
    "settings": [
        {
            "hostname": "<HOSTNAME>",
            "china_network": false,
            "client_certificate_forwarding": true
        }
    ]
  }'
js
const tlsHeaders = {
    'X-CERT-ISSUER-DN': request.cf.tlsClientAuth.certIssuerDN,
    'X-CERT-SUBJECT-DN': request.cf.tlsClientAuth.certSubjectDN,
    'X-CERT-ISSUER-DN-L': request.cf.tlsClientAuth.certIssuerDNLegacy,
    'X-CERT-SUBJECT-DN-L': request.cf.tlsClientAuth.certSubjectDNLegacy,
    'X-CERT-SERIAL': request.cf.tlsClientAuth.certSerial,
    'X-CERT-FINGER': request.cf.tlsClientAuth.certFingerprintSHA1,
    'X-CERT-VERIFY': request.cf.tlsClientAuth.certVerify,
    'X-CERT-NOTBE': request.cf.tlsClientAuth.certNotBefore,
    'X-CERT-NOTAF': request.cf.tlsClientAuth.certNotAfter
};
bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/service_tokens" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "CI/CD token",
         "duration": "8760h"
       }'
     json
     "result": {
       "client_id": "88bf3b6d86161464f6509f7219099e57.access",
       "client_secret": "bdd31cbc4dec990953e39163fbbb194c93313ca9f0a6e420346af9d326b1d2a5",
       "created_at": "2025-09-25T22:26:26Z",
       "expires_at": "2026-09-25T22:26:26Z",
       "id": "3537a672-e4d8-4d89-aab9-26cb622918a1",
       "name": "CI/CD token",
       "updated_at": "2025-09-25T22:26:26Z",
       "duration": "8760h",
       "client_secret_version": 1
     }
     tf
     resource "cloudflare_zero_trust_access_service_token" "example_service_token" {
       account_id = var.cloudflare_account_id
       name       = "Example service token"
       duration  = "8760h"

lifecycle {
         create_before_destroy = true
       }
     }
     tf
        output "example_service_token_client_id" {
          value     = cloudflare_zero_trust_access_service_token.example_service_token.client_id
        }

output "example_service_token_client_secret" {
          value     = cloudflare_zero_trust_access_service_token.example_service_token.client_secret
          sensitive = true
        }
        sh
        terraform apply
        sh
        terraform output -raw example_service_token_client_id
        sh
        terraform output -raw example_service_token_client_secret
        tf
       resource "vault_generic_secret" "example_service_token" {
         path         = "kv/cloudflare/example_service_token"

data_json = jsonencode({
           "CLIENT_ID"     = cloudflare_access_service_token.example_service_token.client_id
           "CLIENT_SECRET" = cloudflare_access_service_token.example_service_token.client_secret
         })
       }
     sh
curl -H "CF-Access-Client-Id: <CLIENT_ID>" -H "CF-Access-Client-Secret: <CLIENT_SECRET>" https://app.example.com
bash
   curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps/$APP_ID" \
     --request GET \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   bash
   curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps/$APP_ID" \
     --request PUT \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     --json '{
       "domain": "app.example.com",
       "type": "self_hosted",
       "read_service_tokens_from_header": "Authorization"
     }'
   sh
   curl -H "Authorization: {\"cf-access-client-id\": \"<CLIENT_ID>\", \"cf-access-client-secret\": \"<CLIENT_SECRET>\"}" https://app.example.com
   sh
curl -H "cookie: CF_Authorization=<CF_AUTHORIZATION_COOKIE>" https://app.example.com
sh
curl -H "cf-access-token: <CF_AUTHORIZATION_COOKIE>" https://app.example.com
bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block file types",
      "description": "Block the upload or download of files based on their type",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(http.upload.file.types[*] in {\"docx\"}) and any(http.download.file.types[*] in {\"pdf\"})",
      "identity": "",
      "device_posture": ""
    }'
  txt
X-CFEmailSecurity-Disposition: [Value]
txt
X-CFEmailSecurity-Disposition: UCE
txt
X-CFEmailSecurity-Attribute: [Value]
X-CFEmailSecurity-Attribute: [Value2]
graphql
   query GatewaySampleQuery($accountTag: string!, $start: Time) {
     viewer {
       accounts(filter: { accountTag: $accountTag }) {
         gatewayResolverQueriesAdaptiveGroups(
           filter: { datetime_gt: $start }
           limit: 10
         ) {
           count
           dimensions {
             queryNameReversed
             resolverDecision
           }
         }
       }
     }
   }
   json
   {
     "globalShortcut": "",
     "mcpServers": {
       "cloudflare-dex-analysis": {
         "command": "npx",
         "args": ["mcp-remote", "https://dex.mcp.cloudflare.com/mcp"]
       }
     }
   }
   json
   {
     "globalShortcut": "",
     "mcpServers": {
       "cloudflare-dex-analysis": {
         "command": "npx",
         "args": ["mcp-remote", "https://dex.mcp.cloudflare.com/mcp"]
       }
     }
   }
   bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/logs/access_requests?limit=25&direction=desc&since=2020-07-01T05%3A20%3A00Z&until=2020-10-01T05%3A20%3A00Z" \
    --request GET \
    --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \
    --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
  json
  {
    "success": true,
    "errors": [],
    "messages": [],
    "result": [
      {
        "user_email": "michelle@example.com",
        "ip_address": "198.41.129.166",
        "app_uid": "df7e2w5f-02b7-4d9d-af26-8d1988fca630",
        "app_domain": "test.example.com/admin",
        "action": "login",
        "connection": "saml",
        "allowed": false,
        "created_at": "2014-01-01T05:20:00.12345Z",
        "ray_id": "187d944c61940c77"
      }
    ]
  }
  json
{
   "ClientIP": "198.51.100.206",
   "ClientRequestHost": "jira.widgetcorp.tech",
   "ClientRequestMethod": "GET",
   "ClientRequestURI": "/secure/Dashboard/jspa",
   "ClientRequestUserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
   "EdgeEndTimestamp": "2019-11-10T09:51:07Z",
   "EdgeResponseBytes": 4600,
   "EdgeResponseStatus": 200,
   "EdgeStartTimestamp": "2019-11-10T09:51:07Z",
   "RayID": "5y1250bcjd621y99",
   "RequestHeaders":{"cf-access-user":"srhea"}
},
{
   "ClientIP": "198.51.100.206",
   "ClientRequestHost": "jira.widgetcorp.tech",
   "ClientRequestMethod": "GET",
   "ClientRequestURI": "/browse/EXP-12",
   "ClientRequestUserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
   "EdgeEndTimestamp": "2019-11-10T09:51:27Z",
   "EdgeResponseBytes": 4570,
   "EdgeResponseStatus": 200,
   "EdgeStartTimestamp": "2019-11-10T09:51:27Z",
   "RayID": "yzrCqUhRd6DVz72a",
   "RequestHeaders":{"cf-access-user":"srhea"}
}
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/logpush/jobs \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>" \
--header "Content-Type: application/json" \
--data '{
  ...
  "output_options": {
      "field_names": ["ColoName", "Datetime", "Direction", "IPDestinationAddress", "IPDestinationSubnet", "IPProtocol","IPSourceAddress", "IPSourceSubnet", "Outcome", "RuleID", "RulesetID", "SampleInterval", "Verdict"],
  },
  "filter": "{\"where\":{\"or\":[{\"and\":[{\"key\":\"MitigationSystem\",\"operator\":\"eq\",\"value\":\"magic-firewall\"},{\"key\":\"RulesetID\",\"operator\":\"!eq\",\"value\":\"\"},{\"key\":\"Outcome\",\"operator\":\"eq\",\"value\":\"pass\"},{\"key\":\"Verdict\",\"operator\":\"eq\",\"value\":\"drop\"}]}]}}"
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/logpush/jobs \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>" \
--header "Content-Type: application/json" \
--data '{
  ...
  "output_options": {
      "field_names": ["ColoName", "Datetime", "Direction", "IPDestinationAddress", "IPDestinationSubnet", "IPProtocol","IPSourceAddress", "IPSourceSubnet", "Outcome", "RuleID", "RulesetID", "SampleInterval", "Verdict"],
  },
  "filter": "{\"where\":{\"or\":[{\"and\":[{\"key\":\"MitigationSystem\",\"operator\":\"eq\",\"value\":\"magic-firewall\"},{\"key\":\"RulesetID\",\"operator\":\"!eq\",\"value\":\"\"},{\"or\":[{\"key\":\"Outcome\",\"operator\":\"eq\",\"value\":\"drop\"},{\"key\":\"Verdict\",\"operator\":\"eq\",\"value\":\"pass\"}]}]}]}}"
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/logpush/jobs \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>" \
--header "Content-Type: application/json" \
--data '{
  ...
  "output_options": {
      "field_names": ["ColoName", "Datetime", "Direction", "IPDestinationAddress", "IPDestinationSubnet", "IPProtocol","IPSourceAddress", "IPSourceSubnet", "Outcome", "RuleID", "RulesetID", "SampleInterval", "Verdict"],
  },
  "filter": "{\"where\":{\"and\":[{\"key\":\"MitigationSystem\",\"operator\":\"eq\",\"value\":\"magic-firewall\"},{\"key\":\"RulesetID\",\"operator\":\"eq\",\"value\":\"\"}]}}"
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/logpush/jobs \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>" \
--header "Content-Type: application/json" \
--data '{
  ...
  "output_options": {
      "field_names": ["ColoName", "Datetime", "Direction", "IPDestinationAddress", "IPDestinationSubnet", "IPProtocol","IPSourceAddress", "IPSourceSubnet", "Outcome", "RuleID", "RulesetID", "SampleInterval", "Verdict"],
  },
  "filter": "{\"where\":{\"and\":[{\"key\":\"MitigationSystem\",\"operator\":\"eq\",\"value\":\"magic-firewall\"},{\"key\":\"RulesetID\",\"operator\":\"!eq\",\"value\":\"\"}]}}"
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/logpush/jobs \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>" \
--header "Content-Type: application/json" \
--data '{
  ...
  "output_options": {
      "field_names": ["ColoName", "Datetime", "Direction", "IPDestinationAddress", "IPDestinationSubnet", "IPProtocol","IPSourceAddress", "IPSourceSubnet", "Outcome", "RuleID", "RulesetID", "SampleInterval", "Verdict"],
  },
  "filter": "{\"where\":{\"key\":\"MitigationSystem\",\"operator\":\"eq\",\"value\":\"magic-firewall\"}}"
}'
json
{
  "ResourceRecords": [
    {
      "type": "5",
      "data": "d3d3LmV4YW1wbGUuY29tAAABAAUAAABleGFtcGxlLmNvbQ=="
    },
    {
      "type": "1",
      "data": "ZXhhbXBsZS5jb20AAAEAAQAAAQIDBAUGBwgJ"
    }
  ],
  "ResourceRecordsJSON": "[{\"name\":\"www.example.com\",\"type\":\"CNAME\",\"class\":\"IN\",\"ttl\":300,\"rdata\":\"example.com.\"},{\"name\":\"example.com\",\"type\":\"A\",\"class\":\"IN\",\"ttl\":300,\"rdata\":\"203.0.113.0\"}]"
}
txt
    https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
    bash
Set-ADFSRelyingPartyTrust -TargetName "Name of RPT Display Name" -SamlResponseSignature "MessageAndAssertion"
txt
   https://hostnameOfADFS/adfs/ls/
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/saml-metadata
   json
{
  "config": {
    "issuer_url": "https://<your-team-name>.cloudflareaccess.com/",
    "sso_target_url": "https://adfs.example.com/adfs/ls/",
    "attributes": ["email"],
    "email_attribute_name": "",
    "sign_request": false,
    "idp_public_cert": "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
  },
  "type": "saml",
  "name": "adfs saml example"
}
txt
https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
json
{
  "config": {
    "issuer_url": "https://portal.sso.eu-central-1.amazonaws.com/saml/assertion/b2yJrC4kjy3ZAS0a2SeDJj74ebEAxozPfiURId0aQsal3",
    "sso_target_url": "https://portal.sso.eu-central-1.amazonaws.com/saml/assertion/b2yJrC4kjy3ZAS0a2SeDJj74ebEAxozPfiURId0aQsal3",
    "attributes": ["email"],
    "email_attribute_name": "email",
    "sign_request": true,
    "idp_public_certs": [
      "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
    ]
  },
  "type": "saml",
  "name": "AWS IAM SAML example"
}
txt
       https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
       json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>",
    "auth_url": "https://<your user pool domain>/oauth2/authorize",
    "token_url": "https://<your user pool domain>/oauth2/token",
    "certs_url": "https://cognito-idp.<region>.amazonaws.com/<your user pool ID>/.well-known/jwks.json",
    "scopes": ["openid", "email", "profile"],
    "claims": ["sub", "cognito:username", "name", "cognito:groups"]
  },
  "type": "oidc",
  "name": "Amazon Cognito example"
}
txt
    https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
    json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>",
    "centrify_account": "https://abc123.my.centrify.com/",
    "centrify_app_id": "exampleapp"
  },
  "type": "centrify",
  "name": "my example idp"
}
txt
    https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
    txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/saml-metadata
   json
{
  "config": {
    "issuer_url": "https://abc123.my.centrify.com/baaa2117-0ec0-4d76-84cc-abccb551a123",
    "sso_target_url": "https://abc123.my.centrify.com/applogin/appKey/baaa2117-0ec0-4d76-84cc-abccb551a123/customerId/abc123",
    "attributes": ["email"],
    "email_attribute_name": "",
    "sign_request": false,
    "idp_public_cert": "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
  },
  "type": "saml",
  "name": "centrify saml example"
}
json
   add authentication samlIdPProfile samlProf_CloudflareAccess \
       -samlIdPCertName SAML_Signing \
       -assertionConsumerServiceURL "https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback" \
       -samlIssuerName "https://idp.yourdomain.com/saml/login" \
       -rejectUnsignedRequests OFF \
       -NameIDFormat emailAddress \
       -Attribute1 email \
       -Attribute1Expr "AAA.USER.ATTRIBUTE(\"email\")" \
       -Attribute1Format Basic \
       -serviceProviderID "https://idp.yourdomain.com/saml/login"

add authentication samlIdPPolicy samlPol_CloudflareAccess -rule true -action samlProf_CloudflareAccess
   bind authentication vserver nsidp -policy samlPol_CloudflareAccess
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/identity_providers" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Entra ID example",
      "type": "azureAD",
      "config": {
          "client_id": "<your client id>",
          "client_secret": "<your client secret>",
          "directory_id": "<your azure directory uuid>",
          "support_groups": true
      }
    }'
  tf
     resource "cloudflare_zero_trust_access_identity_provider" "microsoft_entra_id" {
       account_id = var.cloudflare_account_id
       name       = "Entra ID example"
       type       = "azureAD"
       config      = {
         client_id                  = var.entra_id_client_id
         client_secret              = var.entra_id_client_secret
         directory_id               = var.entra_id_directory_id
         support_groups             = true
         }
     }
     bash
   curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/identity_providers/$IDENTITY_PROVIDER_ID" \
     --request GET \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   bash
   curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/identity_providers/$IDENTITY_PROVIDER_ID" \
     --request PUT \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     --json '{
       "id": "f174e90a-fafe-4643-bbbc-4a0ed4fc8415",
       "type": "azureAD",
       "uid": "f174e90a-fafe-4643-bbbc-4a0ed4fc8415",
       "name": "Entra ID",
       "version": "31e74e9b4f033e16b604552091a72295",
       "config": {
           "azure_cloud": "default",
           "client_id": "<CLIENT_ID>",
           "conditional_access_enabled": false,
           "directory_id": "<AZURE_DIRECTORY_ID>",
           "redirect_url": "https://<TEAM_NAME>.cloudflareaccess.com/cdn-cgi/access/callback",
           "prompt": "login",
           "support_groups": true
       },
       "scim_config": {
           "enabled": true,
           "user_deprovision": true,
           "seat_deprovision": false,
           "group_member_deprovision": false,
           "identity_update_behavior": "automatic"
       },
       "scim_base_url": "https://<TEAM_NAME>.cloudflareaccess.com/populations/f174e90a-fafe-4643-bbbc-4a0ed4fc8415/scim/v2"
     }'
   txt
    https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
    json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "facebook",
  "name": "my example idp"
}
txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/identity_providers" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Generic OIDC example",
      "type": "oidc",
      "config": {
          "client_id": "<your client id>",
          "client_secret": "<your client secret>",
          "auth_url": "https://accounts.google.com/o/oauth2/auth",
          "token_url": "https://accounts.google.com/o/oauth2/token",
          "certs_url": "https://www.googleapis.com/oauth2/v3/certs",
          "pkce_enabled": false,
          "email_claim_name": "email",
          "claims": [
              "employeeID",
              "groups"
          ],
          "scopes": [
              "openid",
              "email",
              "profile"
          ]
      }
    }'
  tf
     resource "cloudflare_zero_trust_access_identity_provider" "generic_oidc_example" {
       account_id = var.cloudflare_account_id
       name       = "Generic OIDC example"
       type       = "oidc"
       config      = {
         client_id = "<your client id>"
         client_secret = "<your client secret>"
         auth_url = "https://accounts.google.com/o/oauth2/auth"
         token_url = "https://accounts.google.com/o/oauth2/token"
         certs_url = "https://www.googleapis.com/oauth2/v3/certs"
         pkce_enabled = false
         email_claim_name = "email"
         claims = ["employeeID", "groups"]
         scopes = ["openid", "email", "profile"]
       }
     }
     json
     "oidc_fields": {
       "oid": "54eb1ed2-7150-44e6-bbe4-ead24c132fd4"
     },
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   tf
     resource "cloudflare_zero_trust_access_identity_provider" "generic_saml_example" {
       account_id = var.cloudflare_account_id
       name       = "Generic SAML example"
       type       = "saml"
       config      = {
         sso_target_url = "https://example.com/1234/sso/saml"
         issuer_url = "https://example.com/1234"
         idp_public_certs = ["-----BEGIN CERTIFICATE-----\nXXXXX\n-----END CERTIFICATE-----"]
         sign_request = false
         email_attribute_name = "email"
         attributes = ["employeeID", "groups"]
       }
     }
     txt
   https://<your-team-name>.cloudflareaccess.com
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "github",
  "name": "my example idp"
}
txt
   https://<your-team-name>.cloudflareaccess.com
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "google",
  "name": "my example idp"
}
txt
      https://<your-team-name>.cloudflareaccess.com/
      txt
      https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
      json
{
  "config": {
    "issuer_url": "jumpcloud",
    "sso_target_url": "https://sso.myexample.jumpcloud.com/saml2/cloudflareaccess",
    "attributes": ["email", "name", "username"],
    "email_attribute_name": "",
    "sign_request": false,
    "idp_public_cert": "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
  },
  "type": "saml",
  "name": "jumpcloud saml example"
}
txt
    https://<your-team-name>.cloudflareaccess.com
    txt
    https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
    json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>",
    "apps_domain": "mycompany.com"
  },
  "type": "google-apps",
  "name": "my example idp"
}
txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   txt
    https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
    json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "linkedin",
  "name": "my example idp"
}
txt
   <your-team-name>
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>",
    "okta_account": "https://dev-abc123.oktapreview.com"
  },
  "type": "okta",
  "name": "my example idp"
}
txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "issuer_url": "http://www.okta.com/exkbhqj29iGxT7GwT0h7",
    "sso_target_url": "https://dev-abc123.oktapreview.com/app/myapp/exkbhqj29iGxT7GwT0h7/sso/saml",
    "attributes": ["email", "group"],
    "email_attribute_name": "",
    "sign_request": false,
    "idp_public_certs": [
      "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
    ]
  },
  "type": "saml",
  "name": "okta saml example"
}
bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/identity_providers" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "One-time PIN login",
      "type": "onetimepin",
      "config": {}
    }'
  tf
     resource "cloudflare_zero_trust_access_identity_provider" "onetimepin_login" {
       account_id = var.cloudflare_account_id
       name       = "One-time PIN login"
       type       = "onetimepin"
       config      = {}
     }
     txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>",
    "onelogin_account": "https://mycompany.onelogin.com"
  },
  "type": "onelogin",
  "name": "my example idp"
}
txt
   https://<your-team-name>.cloudflareaccess.com
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/saml-metadata
   json
{
  "config": {
    "issuer_url": "https://app.onelogin.com/saml/metadata/1b84ee45-d4fa-4373-8853-abz438942123",
    "sso_target_url": "https://sandbox.onelogin.com/trust/saml2/http-post/sso/123456",
    "attributes": ["email"],
    "email_attribute_name": "",
    "sign_request": false,
    "idp_public_cert": "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
  },
  "type": "saml",
  "name": "onelogin saml example"
}
txt
https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
json
{
  "config": {
    "issuer_url": "https://example.cloudflareaccess.com/cdn-cgi/access/callback",
    "sso_target_url": "https://sso.connect.pingidentity.com/sso/idp/SSO.saml2?idpid=aebe6668-32fe-4a87-8c2b-avcd3599a123",
    "attributes": ["PingOne.AuthenticatingAuthority", "PingOne.idpid"],
    "email_attribute_name": "",
    "sign_request": false,
    "idp_public_cert": "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC.....GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
  },
  "type": "saml",
  "name": "ping saml example"
}
txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>",
    "ping_env_id": "<your ping environment id>"
  },
  "type": "ping",
  "name": "my example idp"
}
txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/saml-metadata
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/public-cert
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/public-cert
   txt
   https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
   json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "yandex",
  "name": "my example idp"
}
mermaid
sequenceDiagram
    participant WARP
		participant Cloudflare Access
    participant External API
    WARP->>Cloudflare Access: Client ID and Secret
		Cloudflare Access->>External API: Application token
		WARP->>External API: JSON with user and device identity
    External API-->>WARP: JSON with 0-100 result
json
{
  "devices": {
    [
      {
        "device_id": "9ece5fab-7398-488a-a575-e25a9a3dec07",
        "email": "jdoe@mycompany.com",
        "serial_number": "jdR44P3d",
        "mac_address": "74:1d:3e:23:e0:fe",
        "virtual_ipv4": "100.96.0.10",
        "hostname": "string",
      },
      {...},
      {...}
    ]
  }
}
json
{
  "result": {
    "9ece5fab-7398-488a-a575-e25a9a3dec07": {
      "s2s_id": "",
      "score": 10
    },
    "device_id2": {...},
    "device_id3": {...}
  }
}
bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/proxy_endpoints" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "kind": "identity",
         "name": "any_name"
       }'
     json
     {
       "result": {
         "kind": "identity",
         "id": "d969d7bf-ec28-4291-9af0-86825f472c21",
         "name": "Identity Proxy Endpoint",
         "created_at": "2014-01-01T05:20:00.12345Z",
         "updated_at": "2014-01-01T05:20:00.12345Z",
         "subdomain": "3ele0ss56t"
       },
       "success": true,
       "errors": [],
       "messages": []
     }
     bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "domain": "<SUBDOMAIN>.proxy.cloudflare-gateway.com",
         "name": "Proxy Endpoint App",
         "session_duration": "12h",
         "type": "proxy_endpoint",
         "policies": [
             {
                 "id": "<ACCESS_POLICY_ID>"
             }
         ]
       }'
     bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/proxy_endpoints" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "any_name",
         "ips": [
             "<PUBLIC_IP>",
             "<PUBLIC_IP2>",
             "<PUBLIC_IP3>"
         ]
       }'
     json
     {
       "result": {
         "id": "d969d7bf-ec28-4291-9af0-86825f472c21",
         "name": "test",
         "created_at": "2022-03-02T10:57:18.094789Z",
         "updated_at": "2022-03-02T10:57:18.094789Z",
         "ips": ["90.90.241.229/8"],
         "subdomain": "3ele0ss56t"
       },
       "success": true,
       "errors": [],
       "messages": []
     }
     txt
     <SUBDOMAIN>.proxy.cloudflare-gateway.com
     txt
https://pac.cloudflare-gateway.com/<account-id>/<slug>
bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/proxy_endpoints" \
       --request GET \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
     json
     {
       "success": true,
       "result": {
         "id": "ed35569b41ce4d1facfe683550f54086",
         "created_at": "2014-01-01T05:20:00.12345Z",
         "ips": ["192.0.2.1/32"],
         "name": "DevOps team",
         "subdomain": "oli3n9zkz5.proxy.cloudflare-gateway.com",
         "updated_at": "2014-01-01T05:20:00.12345Z"
       }
     }
     bash
     dig A example.cloudflare-gateway.com +short
     txt
     162.159.36.5
     162.159.36.20
     bash
     dig AAAA example.cloudflare-gateway.com +short
     txt
     2606:4700:54::a29f:2407
     2606:4700:5c::a29f:2e07
     powershell
     Resolve-DnsName -Name example.cloudflare-gateway.com -Type A
     txt
     Name                                           Type   TTL   Section    IPAddress
     ----                                           ----   ---   -------    ---------
     example.cloudflare-gateway.com                 A      300   Answer     162.159.36.5
     example.cloudflare-gateway.com                 A      300   Answer     162.159.36.20
     powershell
     Resolve-DnsName -Name example.cloudflare-gateway.com -Type AAAA
     txt
     Name                                           Type   TTL   Section    IPAddress
     ----                                           ----   ---   -------    ---------
     example.cloudflare-gateway.com                 AAAA   300   Answer     2606:4700:5c::a29f:2e07
     example.cloudflare-gateway.com                 AAAA   300   Answer     2606:4700:54::a29f:2407
     txt
https://<your-team-name>.cloudflareaccess.com/browser/<URL>
html
<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting website to a remote browser</title>
    <script>
      window.location.href =
        "https://<your-team-name>.cloudflareaccess.com/browser/<URL>}";
    </script>
    <noscript>
      <meta
        http-equiv="refresh"
        content="0; url=https://<your-team-name>.cloudflareaccess.com/browser/<URL>"
      />
    </noscript>
  </head>
  <body>
    <p>
      This website is being redirected to a remote browser. Select
      <a href="https://<your-team-name>.cloudflareaccess.com/browser/<URL>"
        >here</a
      >
      if you are not automatically redirected.
    </p>
  </body>
</html>
html
   <!doctype html>
   <html>
     <body>
       <h1>Access denied.</h1>

<p>To obtain access, contact your IT administrator.</p>
     </body>
   </html>
   txt
cloudflare.com/redirect-path?querystring=Y
tf
     resource "cloudflare_zero_trust_gateway_settings" "team_name" {
       account_id = var.cloudflare_account_id
       settings = {
         block_page = {
           enabled = true //do not use the default Gateway block page
           mode = "customized_block_page" //use a custom block page
           name = "Cloudflare"
           logo_path = "https://logos.com/a.png"
           header_text = "--header--"
           footer_text = "--footer--"
           mailto_address = "admin@example.com"
           mailto_subject = "Blocked Request"
           background_color = "#ffffff"
           suppress_footer = false
         }
       }
     }
     bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/certificates" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/certificates/$CERTIFICATE_ID/activate" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/configuration" \
    --request PUT \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "settings": {
          "certificate": {
              "id": "{certificate_id}",
              "in_use": true
          }
      }
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow corporate domains",
      "description": "Allow any internal corporate domains added to a list",
      "precedence": 0,
      "enabled": true,
      "action": "allow",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.domains[*] in $<LIST_UUID>)",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-DNS-SecurityCategories-Blocklist",
      "description": "Block security categories based on Cloudflare'\''s threat intelligence",
      "precedence": 20,
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.security_category[*] in {68 178 80 83 176 175 117 131 134 151 153})",
      "identity": ""
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "block_security_threats" {
    account_id  = var.cloudflare_account_id
    name        = "All-DNS-SecurityCategories-Blocklist"
    description = "Block security categories based on Cloudflare's threat intelligence"
    precedence  = 20
    enabled     = true
    action      = "block"
    filters     = ["dns"]
    traffic     = "any(dns.security_category[*] in {68 178 80 83 176 175 117 131 134 151 153})"
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-DNS-ContentCategories-Blocklist",
      "description": "Block common content categories that may pose a risk",
      "precedence": 30,
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.content_category[*] in {17 85 87 102 157 135 138 180 162 32 169 177 128 15 115 119 124 141 161})",
      "identity": ""
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "block_content_categories" {
    account_id  = var.cloudflare_account_id
    name        = "All-DNS-ContentCategories-Blocklist"
    description = "Block common content categories that may pose a risk"
    enabled     = true
    action      = "block"
    filters     = ["dns"]
    traffic     = "any(dns.content_category[*] in {17 85 87 102 157 135 138 180 162 32 169 177 128 15 115 119 124 141 161})"
    identity    = ""
  }
  json
{
  "categories": [2, 67, 125, 133]
}
bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-DNS-Bock-Category-Matches-In-Request",
      "description": "Block all category matches in the request EDNS context",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "dns.categories_in_request_context_matches",
      "identity": ""
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "block_content_categories" {
    account_id  = var.cloudflare_account_id
    name        = "All-DNS-Bock-Category-Matches-In-Request"
    description = "Block all category matches in the request EDNS context"
    enabled     = true
    action      = "block"
    filters     = ["dns"]
    traffic     = "dns.categories_in_request_context_matches"
    identity    = ""
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-DNS-Application-Blocklist",
      "description": "Block access to unauthorized AI applications",
      "precedence": 40,
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(app.type.ids[*] in {25})",
      "identity": ""
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "block_unauthorized_apps" {
    account_id  = var.cloudflare_account_id
    name        = "All-DNS-Application-Blocklist"
    description = "Block access to unauthorized AI applications"
    enabled     = true
    action      = "block"
    filters     = ["dns"]
    traffic     = "any(app.type.ids[*] in {25})"
    identity    = ""
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block banned countries",
      "description": "Block access to banned countries",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.dst.geo.country[*] in {\"AF\" \"BY\" \"CD\" \"CU\" \"IR\" \"IQ\" \"KP\" \"MM\" \"RU\" \"SD\" \"SY\" \"UA\" \"ZW\"})",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block top-level domains",
      "description": "Block top-level domains that are frequently used for malicious practices",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.domains[*] matches \"[.](cn|ru)$\") or any(dns.domains[*] matches \"[.](rest|hair|top|live|cfd|boats|beauty|mom|skin|okinawa)$\") or any(dns.domains[*] matches \"[.](zip|mobi)$\")",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block phishing attacks",
      "description": "Block attempts to phish specific domains targeting your organization",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "not(any(dns.domains[*] in $<LIST_UUID>)) and any(dns.domains[*] matches \".*okta.*\\|.*cloudflare.*\\|.*mfa.*\\|.sso.*\")",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block online tracking",
      "description": "Block domains used for tracking at an OS level",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.domains[*] in $<LIST_UUID>)",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block malicious IPs",
      "description": "Block specific IP addresses that are known to be malicious or pose a threat to your organization",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.resolved_ips[*] in $<LIST_UUID>)",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Turn on CIPA filter",
      "description": "Block access to unwanted or harmful online content for children",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.content_category[*] in {182})",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Hide explicit search results",
      "description": "Force SafeSearch on search engines to filter explicit or offensive content",
      "enabled": true,
      "action": "safesearch",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.content_category[*] in {145})",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Check user identity",
      "description": "Filter traffic based on a user identity group name",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(app.ids[*] in {606})",
      "identity": "any(identity.groups.name[*] in {\"Contractors\"})"
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow social media for Marketing",
      "description": "Allow access to social media sites for users in the Marketing group",
      "precedence": 1,
      "enabled": true,
      "action": "allow",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.content_category[*] in {149})",
      "identity": "any(identity.groups.name[*] in {\"Marketing\"})"
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block social media",
      "description": "Block social media for all other users",
      "precedence": 2,
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "any(dns.content_category[*] in {149})",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Force IPv4",
      "description": "Force users to connect with IPv4 by blocking IPv6 resolution",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "dns.query_rtype == \"AAAA\"",
      "identity": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Force IPv6",
      "description": "Force users to connect with IPv6 by blocking IPv4 resolution",
      "enabled": true,
      "action": "block",
      "filters": [
          "dns"
      ],
      "traffic": "dns.query_rtype == \"A\"",
      "identity": ""
    }'
  sh
   dig example.com
   sh
   ; <<>> DiG 9.10.6 <<>> example.com
   ;; global options: +cmd
   ;; Got answer:
   ;; ->>HEADER<<- opcode: QUERY, status: REFUSED, id: 6503
   ;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
   ;example.com.                   IN      A

;; Query time: 46 msec
   ;; SERVER: 172.64.36.1#53(172.64.36.1)
   ;; WHEN: Tue Mar 10 20:22:18 CDT 2020
   ;; MSG SIZE  rcvd: 29
   sh
   dig example.com
   sh
   ; <<>> DiG 9.10.6 <<>> example.com
   ;; global options: +cmd
   ;; Got answer:
   ;; ->>HEADER<<- opcode: QUERY, status: NOERROR id: 14531
   ;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
   ; EDNS: version: 0, flags:; udp: 1452
   ;; QUESTION SECTION:
   ;example.com.                   IN      A

;;ANSWER SECTION:
   example.com.            60      IN      A                  162.159.36.12
   example.com.            60      IN      A                  162.159.46.12

;; Query time: 53 msec
   ;; SERVER: 172.64.36.1#53(172.64.36.1)
   ;; WHEN: Tue Mar 10 20:19:52 CDT 2020
   ;; MSG SIZE  rcvd: 83
   txt
  <NAME_OF_CATEGORY>.testcategory.com
  sh
   curl 'https://<DOH_SUBDOMAIN>.cloudflare-gateway.com/dns-query?type=TXT&name=o-o.myaddr.google.com' -H 'Accept: application/dns-json' | json_pp
   json
   {
     "AD": false,
     "Answer": [
       {
         "TTL": 60,
         "data": "\"108.162.218.211\"",
         "name": "o-o.myaddr.google.com",
         "type": 16
       },
       {
         "TTL": 60,
         "data": "\"edns0-client-subnet 136.62.0.0/24\"",
         "name": "o-o.myaddr.google.com",
         "type": 16
       }
     ],
     "CD": false,
     "Question": [
       {
         "name": "o-o.myaddr.google.com",
         "type": 16
       }
     ],
     "RA": true,
     "RD": true,
     "Status": 0,
     "TC": false
   }
   sh
   curl ifconfig.me
   sh
   136.62.12.156%
   bash
ipconfig /flushdns
sh
sudo killall -HUP mDNSResponder
sudo killall mDNSResponderHelper
sudo dscacheutil -flushcache
bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "action": "block",
      "name": "Block gambling sites on weekends",
      "traffic": "any(dns.content_category[*] in {\"Gambling\"})",
      "schedule": {
          "sat": "08:00-17:00",
          "sun": "08:00-17:00",
          "timezone": "Europe/Paris"
      }
    }'
  bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "name": "office-no-facebook-policy",
    "action": "block",
    "traffic": "dns.fqdn == \"facebook.com\"",
    "enabled": true,
    "schedule": {
        "time_zone": "America/Chicago",
        "mon": "08:00-12:30,13:30-17:00",
        "tue": "08:00-12:30,13:30-17:00",
        "wed": "08:00-12:30,13:30-17:00",
        "thu": "08:00-12:30,13:30-17:00",
        "fri": "08:00-12:30,13:30-17:00"
    }
  }'
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "name": "clock-in-policy",
    "action": "block",
    "traffic": "dns.fqdn == \"clockin.com\"",
    "enabled": true,
    "schedule": {
        "sat": "00:00-24:00",
        "sun": "00:00-24:00"
    }
  }'
mermaid
    flowchart LR
      subgraph aws["AWS VPC"]
				cloudflared["cloudflared"]
      end
			subgraph cloudflare[Cloudflare]
			  gateway["Gateway"]
			end
			subgraph internet[Internet]
				resolver[1.1.1.1]
				app[Application]
			end
      warp["WARP
			  clients"]--"app.bank.com"-->gateway--"Network traffic"-->cloudflared
			gateway<-.DNS lookup.->resolver
			aws--AWS egress IP -->app
bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/configuration" \
    --request PATCH \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "settings": {
          "host_selector": {
              "enabled": true
          }
      }
    }'
  xml
   <array>
     <dict>
       <key>doh_in_tunnel</key>
       <true/>
     </dict>
   </array>
   bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block sites by hostname",
      "description": "Block all subdomains that use a specific hostname",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "http.request.host matches \".*example.com\"",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block sites by URL",
      "description": "Block specific parts of a site without blocking the hostname",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "http.request.uri matches \"/r/gaming\"",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-HTTP-ContentCategories-Blocklist",
      "description": "Block access to questionable content and potential security risks",
      "precedence": 40,
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(http.request.uri.content_category[*] in {17 85 87 102 157 135 138 180 162 32 169 177 128 15 115 119 124 141 161 2 67 125 133 99})",
      "identity": "",
      "device_posture": ""
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "block_unauthorized_apps" {
    account_id     = var.cloudflare_account_id
    name           = "All-HTTP-ContentCategories-Blocklist"
    description    = "Block access to questionable content and potential security risks"
    precedence     = 40
    enabled        = true
    action         = "block"
    filters        = ["http"]
    traffic        = "any(http.request.uri.content_category[*] in {17 85 87 102 157 135 138 180 162 32 169 177 128 15 115 119 124 141 161 2 67 125 133 99})"
    identity       = ""
    device_posture = ""
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-HTTP-Application-Blocklist",
      "description": "Limit access to shadow IT by blocking web-based tools and applications",
      "precedence": 60,
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(app.type.ids[*] in {25})",
      "identity": "",
      "device_posture": ""
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "all_http_application_blocklist" {
    account_id     = var.cloudflare_account_id
    name           = "All-HTTP-Application-Blocklist"
    description    = "Limit access to shadow IT by blocking web-based tools and applications"
    precedence     = 60
    enabled        = true
    action         = "block"
    filters        = ["http"]
    traffic        = "any(app.type.ids[*] in {25})"
    identity       = ""
    device_posture = ""
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Check user identity",
      "description": "Block access to Salesforce by temporary employees and contractors",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(app.ids[] in {606})",
      "identity": "any(identity.groups.name[] in {\"Contractors\"})",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Bypass incompatible applications",
      "description": "Skip TLS decryption for applications that are incompatible with Gateway",
      "enabled": true,
      "action": "off",
      "filters": [
          "http"
      ],
      "traffic": "any(app.type.ids[*] in {16})",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Require OS version",
      "description": "Perform an OS version check for minimum version",
      "enabled": true,
      "action": "allow",
      "filters": [
          "http"
      ],
      "traffic": "",
      "identity": "",
      "device_posture": "any(device_posture.checks.passed[*] in {\"<POSTURE_CHECK_UUID>\"})"
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Check for specific file",
      "description": "Ensure users have a specific file on their device regardless of operating system",
      "enabled": true,
      "action": "allow",
      "filters": [
          "http"
      ],
      "traffic": "",
      "identity": "",
      "device_posture": "any(device_posture.checks.passed[] in {\"<POSTURE_CHECK_1_UUID>\"}) or any(device_posture.checks.passed[] in {\"<POSTURE_CHECK_2_UUID>\"})"
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Bypass internal site inspection",
      "description": "Bypass TLS decryption for internal sites with self-signed certificates",
      "enabled": true,
      "action": "off",
      "filters": [
          "http"
      ],
      "traffic": "any(http.request.domains[*] in {\"internal.example.com\"})",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block file types",
      "description": "Block the upload or download of files based on their type",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(http.upload.file.types[*] in {\"docx\"}) and any(http.download.file.types[*] in {\"pdf\"})",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Isolate unreviewed or in review application status",
      "description": "Isolate Shadow IT applications that have not been reviewed or are in review in the Application Library",
      "enabled": true,
      "action": "isolate",
      "filters": [
          "http"
      ],
      "traffic": "any(app.statuses[*] == \"unreviewed\") or any(app.statuses[*] == \"in review\")",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block unapproved application status",
      "description": "Block Shadow IT applications that have been marked as unapproved in the Application Library",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(app.statuses[*] == \"unapproved\")",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block Google Drive downloads",
      "description": "Block file downloads from Google Drive",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(app.ids[] in {554}) and http.request.uri.path_and_query matches \".(e=download|export).*\"",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block Google Drive uploads",
      "description": "Block file uploads to Google Drive",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(app.ids[] in {554}) and http.upload.mime matches \".\" and not(http.request.host == \"drivefrontend-pa.clients6.google.com\")",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block Gmail downloads",
      "description": "Block file downloads from Gmail",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "http.request.host == \"mail-attachment.googleusercontent.com\" and http.request.uri.path_and_query matches \"/attachment/u/0\"",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block Google Translate for websites",
      "description": "Block use of Google Translate to translate entire webpages",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(http.request.domains[*] matches \"^(.+\\.)?translate\\.goog$\")",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Filter WebSocket",
      "description": "Filter WebSocket traffic with HTTP response code 101",
      "enabled": true,
      "action": "allow",
      "filters": [
          "http"
      ],
      "traffic": "http.response.status_code == 101",
      "identity": "",
      "device_posture": ""
    }'
  mermaid
flowchart TD
    A(["User starts file download"]) --> B["File sent to AV scanner"]
    B --> C["Malicious file detected?"]
    C -- Yes --> D["Download blocked"]
    C -- No --> G["File sent to sandbox"]
    G --> n1["First time file downloaded?"]
    K["Malicious activity detected?"] -- Yes --> N["Download blocked"]
    K -- No --> n3["Download allowed"]
    n2["Interstitial page displayed for user during scan"] --> n4["File activity monitored"]
    n1 -- Yes --> n2
    n4 --> K
    n1 -- No --> K

B@{ shape: subproc}
    C@{ shape: hex}
    D@{ shape: terminal}
    n1@{ shape: hex}
    K@{ shape: hex}
    N@{ shape: terminal}
    n3@{ shape: terminal}
    n2@{ shape: display}
    n4@{ shape: rect}
    style D stroke:#D50000
    style N stroke:#D50000
    style n3 stroke:#00C853
bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block ChatGPT uploads",
      "description": "Block file uploads to ChatGPT while allowing other usage",
      "enabled": true,
      "action": "block",
      "filters": [
          "http"
      ],
      "traffic": "any(app.ids[*] == 1199) and any(app_control.controls[*] in {1653})",
      "identity": "",
      "device_posture": ""
    }'
  tf
     resource "cloudflare_zero_trust_gateway_settings" "team_name" {
       account_id = var.cloudflare_account_id
       settings = {
         tls_decrypt = {
           enabled = true
         }
       }
     }
     tf
     resource "cloudflare_zero_trust_gateway_settings" "team_name" {
       account_id = var.cloudflare_account_id
       settings = {
         tls_decrypt = {
           enabled = true
         }
       }
     }
     mermaid
flowchart LR
 %% Accessibility
 accTitle: How Gateway routes FedRAMP compliant traffic with Regional Services
 accDescr: Flowchart describing how WARP with Gateway routes traffic to egress from a FedRAMP compliant data center when used with Regional Services in the United States.

%% Flowchart
 subgraph s1["Non-FedRAMP data center"]
        n2["WARP TLS encryption terminated"]
  end
 subgraph s2["FedRAMP data center"]
        n3["Gateway TLS encryption (FIPS) terminated"]
  end
 subgraph s3["Private internal network"]
        n5["FedRAMP compliant cloudflared"]
        n6(["Private server"])
  end
    n1(["User near non-FedRAMP compliant data center"]) -- Gateway TLS connection wrapped with WARP TLS (MASQUE) --> n2
    n2 -- Gateway TLS connection --> n3
    n3 <-- FIPS tunnel --> n5
    n5 --> n6

n5@{ shape: rect}
bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "Block security threats",
         "description": "Block all default Cloudflare DNS security categories",
         "precedence": 0,
         "enabled": true,
         "action": "block",
         "filters": [
             "dns"
         ],
         "traffic": "any(dns.security_category[*] in {68 178 80 83 176 175 117 131 134 151 153})",
         "identity": ""
       }'
     sh
     {
        "success": true,
        "errors": [],
        "messages": []
     }
     bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "Do not inspect applications",
         "description": "Bypass TLS decryption for unsupported applications",
         "precedence": 0,
         "enabled": true,
         "action": "off",
         "filters": [
             "http"
         ],
         "traffic": "any(app.type.ids[*] in {16})",
         "identity": "",
         "device_posture": ""
       }'
     sh
     {
        "success": true,
        "errors": [],
        "messages": []
     }
     bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "Block known risks",
         "description": "Block all default Cloudflare HTTP security categories",
         "precedence": 0,
         "enabled": true,
         "action": "block",
         "filters": [
             "http"
         ],
         "traffic": "any(http.request.uri.security_category[*] in {68 178 80 83 176 175 117 131 134 151 153})",
         "identity": "",
         "device_posture": ""
       }'
     bash
     curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "name": "Enforce device posture",
         "description": "Ensure only devices in Zero Trust organization can connect to application",
         "precedence": 0,
         "enabled": true,
         "action": "block",
         "filters": [
             "l4"
         ],
         "traffic": "any(net.sni.domains[*] == \"internalapp.com\")",
         "identity": "",
         "device_posture": "not(any(device_posture.checks.passed[*] in {\"LIST_UUID\"}))"
       }'
     sh
  {
     "success": true,
     "errors": [],
     "messages": []
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block unauthorized applications",
      "description": "Block access to unauthorized AI applications",
      "enabled": true,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "any(app.type.ids[*] in {25})",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Check user identity",
      "description": "Block access to Salesforce by temporary employees and contractors",
      "enabled": true,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "any(app.ids[*] in {606})",
      "identity": "any(identity.groups.name[*] in {\"Contractors\"})",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "All-NET-ApplicationAccess-Allow",
      "description": "Ensure access to the application comes from authorized WARP clients",
      "precedence": 70,
      "enabled": false,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "any(net.sni.domains[*] == \"internalapp.com\")",
      "device_posture": "not(any(device_posture.checks.passed[*] in {\"<DEVICE_SERIAL_NUMBERS_LIST_UUID>\"}))"
    }'
  tf
  resource "cloudflare_zero_trust_gateway_policy" "all_net_applicationaccess_allow" {
    account_id  = var.cloudflare_account_id
    name        = "All-NET-ApplicationAccess-Allow"
    description = "Ensure access to the application comes from authorized WARP clients"
    precedence  = 70
    enabled     = false
    action      = "block"
    filters     = ["l4"]
    traffic     = "any(net.sni.domains[*] == \"internalapp.com\")"
    posture      =  "not(any(device_posture.checks.passed[*] in {\"${"$"}${cloudflare_zero_trust_list.allowed_devices_sn_list.id}\"}))"
  }
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow HTTP and HTTPS traffic",
      "description": "Restrict traffic to HTTP and HTTPS traffic",
      "enabled": true,
      "action": "allow",
      "filters": [
          "l4"
      ],
      "traffic": "net.detected_protocol == \"tls\" and net.dst.port in {80 443}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block all other traffic",
      "description": "Block all other traffic that is not HTTP or HTTPS",
      "enabled": true,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "net.protocol in {\"tcp\" \"udp\"}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow on inspect all ports",
      "description": "Filter HTTPS traffic when using inspect all ports",
      "enabled": true,
      "action": "allow",
      "filters": [
          "l4"
      ],
      "traffic": "net.detected_protocol == \"tls\" or net.detected_protocol == \"http\"",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow proxy endpoint traffic from specific source IPs",
      "description": "Allow traffic from proxy endpoint users with specific source IPs to reach private network",
      "enabled": true,
      "action": "allow",
      "filters": [
          "l4"
      ],
      "traffic": "net.proxy_endpoint.ids[*] in {\"<PROXY_ENDPOINT_ID>\"} and net.src.ip in {203.0.113.0/24} and net.dst.ip in {10.0.0.0/8}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block all other proxy endpoint traffic",
      "description": "Block any other proxy endpoint traffic from accessing the private network",
      "enabled": true,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "net.proxy_endpoint.ids[*] in {\"<PROXY_ENDPOINT_ID>\"} and net.dst.ip in {10.0.0.0/8}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow authorized proxy endpoint traffic from specific source IPs",
      "description": "Allow traffic from authorization proxy endpoint users with specific source IPs to reach private network",
      "enabled": true,
      "action": "allow",
      "filters": [
          "l4"
      ],
      "traffic": "net.proxy_endpoint.ids[*] in {\"<PROXY_ENDPOINT_ID>\"} and net.src.ip in {203.0.113.0/24} and net.dst.ip in {10.0.0.0/8}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block all other authorized proxy endpoint traffic",
      "description": "Block any other authorization proxy endpoint traffic from accessing the private network",
      "enabled": true,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "net.proxy_endpoint.ids[*] in {\"<PROXY_ENDPOINT_ID>\"} and net.dst.ip in {10.0.0.0/8}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Allow company employees",
      "description": "Allow any users with an organization email to reach the application",
      "enabled": true,
      "action": "allow",
      "filters": [
          "l4"
      ],
      "traffic": "net.dst.ip in {10.0.0.0/8}",
      "identity": "identity.email matches \".*@example.com\"",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Block everyone else",
      "description": "Block any other users from accessing the application",
      "enabled": true,
      "action": "block",
      "filters": [
          "l4"
      ],
      "traffic": "net.dst.ip in {10.0.0.0/8}",
      "identity": "",
      "device_posture": ""
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/gateway/rules" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "Override example.com with 1.1.1.1",
      "description": "Override a site'\''s IP address with another IP",
      "enabled": true,
      "action": "l4_override",
      "filters": [
          "l4"
      ],
      "traffic": "net.dst.ip in {203.0.113.17} and net.dst.port == 80",
      "identity": "",
      "device_posture": "",
      "rule_settings": {
          "l4override": {
              "ip": "1.1.1.1",
              "port": 80
          },
          "override_host": "",
          "override_ips": null
      }
    }'
  sh
sudo adduser jdoe
txt
Match user johndoe
  AuthorizedPrincipalsCommand /bin/echo 'jdoe'
  AuthorizedPrincipalsCommandUser nobody
sh
ssh johndoe@server
txt
Match user vmuser
  AuthorizedPrincipalsFile /etc/ssh/vmusers-list.txt
txt
jdoe
bwayne
robin
txt
Match user vmuser
  AuthorizedPrincipalsCommand /bin/bash -c "echo '%t %k' | ssh-keygen -L -f - | grep -A1 Principals"
  AuthorizedPrincipalsCommandUser nobody
txt
AuthorizedPrincipalsCommand /bin/bash -c "echo '%t %k' | ssh-keygen -L -f - | grep -A1 Principals"
AuthorizedPrincipalsCommandUser nobody
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/gateway_ca" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/gateway_ca" \
  --request GET \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
sh
   cd /etc/ssh
   sh
   vim ca.pub
   txt
   ecdsa-sha2-nistp256 <redacted> open-ssh-ca@cloudflareaccess.org
   bash
   :w !sudo tee %
   :q!
   sh
    sudo vim /etc/ssh/sshd_config
   txt
   PubkeyAuthentication yes
   TrustedUserCAKeys /etc/ssh/ca.pub
   sh
cat /etc/ssh/sshd_config
sh
  sudo systemctl reload ssh
  sh
  sudo systemctl reload sshd
  sh
ssh <username>@<hostname>
sh
ssh-keygen -R <targetIP or hostname>
sh
   ./ssh-log-cli generate-key-pair -o sshkey
   ls
   sh
   README.md    ssh-log-cli    sshkey    sshkey.pub
   sh
   ./ssh-log-cli decrypt -i sshlog -k sshkey
   bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets \
--header "Authorization: Bearer <API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{
  "name": "Example ruleset",
  "kind": "root",
  "phase": "magic_transit",
  "description": "Example ruleset description",
  "rules": [
    {
      "action": "skip",
      "action_parameters": { "ruleset": "current" },
      "expression": "tcp.dstport in { 8080 } ",
      "description": "Allow port 8080"
    },
    {
      "action": "block",
      "expression": "tcp.dstport in { 1..65535 }",
      "description": "Block all TCP ports"
    }
  ]
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets \
--header "Authorization: Bearer <API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{
  "name": "Example ruleset",
  "kind": "root",
  "phase": "magic_transit",
  "description": "Example ruleset description",
  "rules": [
    {
      "action": "block",
      "expression": "ip.src.country == \"BR\"",
      "description": "Block traffic from Brazil"
    }
  ]
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets \
--header "Authorization: Bearer <API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{
  "name": "Example ruleset",
  "kind": "root",
  "phase": "magic_transit",
  "description": "Example ruleset description",
  "rules": [
    {
      "action": "block",
      "expression": "ip.src in $cf.anonymizer",
      "description": "Block traffic from anonymizer proxies"
    }
  ]
}'
bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets
--header "Authorization: Bearer <API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{
  "name": "execute ruleset",
  "description": "Ruleset containing execute rules",
  "kind": "root",
  "phase": "magic_transit_managed",
  "rules": [
    {
      "expression": "true",
      "action": "execute",
      "description": "Enable one rule ",
      "action_parameters": {
        "id": "<MANAGED_RULESET_ID>",
        "version": "latest",
        "overrides": {
          "rules": [
            {
              "id": "<MANAGED_RULE_ID>",
              "enabled": true,
              "action": "log"
            }
          ]
        }
      }
    }
  ]
}'
bash
curl --request PATCH \
https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets/{root_kind_ruleset}/rules/{root_kind_rule} \
--header "Authorization: Bearer <API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{
  "expression": "true",
  "action": "execute",
  "action_parameters": {
    "id": "<MANAGED_RULESET_ID>",
    "version": "latest",
    "overrides": {
      "rules": [
        {
          "id": "<MANAGED_RULE_ID>",
          "enabled": true
        }
      ],
      "categories": [
        {
          "category": "simple",
          "enabled": true,
          "action": "log"
        }
      ]
    }
  }
}'
bash
curl --request PATCH \
https://api.cloudflare.com/client/v4/accounts/{account_id}{account_id}/rulesets/{root_kind_ruleset}/rules/{root_kind_rule} \
--header "Authorization: Bearer <API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{
  "expression": "true",
  "action": "execute",
  "action_parameters": {
    "id": "<MANAGED_RULESET_ID>",
    "version": "latest",
    "overrides": {
      "enabled": true
    }
  }
}'
txt
ip.src == 192.0.2.0
txt
ip.src == 192.0.2.1 && (tcp.flags.push || tcp.flags.reset)
txt
ip.src == 192.0.2.0/24  # bad
ip.src in { 192.0.2.0/24 }  # good
txt
(tcp.dstport == 1000 || tcp.dstport == 1001) && (tcp.dstport == 1002 || tcp.dstport == 1003) && (tcp.dstport == 1004 || tcp.dstport == 1005) && (tcp.dstport == 1006 || tcp.dstport == 1007) && (tcp.dstport == 1008 || tcp.dstport == 1009) && (tcp.dstport == 1010 || tcp.dstport == 1011) && (tcp.dstport == 1012 || tcp.dstport == 1013) && (tcp.dstport == 1014 || tcp.dstport == 1015) && (tcp.dstport == 1016 || tcp.dstport == 1017)
txt
https://api.cloudflare.com/client/v4
txt
https://api.cloudflare.com/client/v4
mermaid
    flowchart TD
      accTitle: Random prefix attacks diagram
      A[End user query to <code>example.com</code>] --"1)"--> B[<code>1.1.1.1 resolver</code>]
      B --"2)"--> C[<code>com.</code> TLD NS]
      C --"3)" <code>NXDOMAIN error</code>--> B
      B --"4)" <code>NXDOMAIN error</code>--> A
      D[Authoritative NS]
mermaid
    flowchart TD
      accTitle: Random prefix attacks diagram
      A[End user query to <code>random.example.com</code>] --"1)"--> B[<code>1.1.1.1 resolver</code>]
      B -- "2)" --> C[<code>com.</code> TLD NS]
      C -- "3)" Query Authoritative NS --> B
      B -- "4)" --> D[Authoritative NS]
      D --"5)" <code>NXDOMAIN error</code>--> B
      B --"6)" <code>NXDOMAIN error</code>--> A
bash
   curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/dns_firewall/$DNS_FIREWALL_ID" \
     --request PATCH \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     --json '{
       "attack_mitigation": {
           "enabled": true,
           "only_when_upstream_unhealthy": true
       }
     }'
   bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dnssec" \
    --request PATCH \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "status": "active",
      "dnssec_multi_signer": true
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "type": "DNSKEY",
      "name": "<ZONE_NAME>",
      "data": {
          "flags": 256,
          "protocol": 3,
          "algorithm": 13,
          "public_key": "<PUBLIC_KEY>"
      },
      "ttl": 3600
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "type": "NS",
      "name": "<ZONE_NAME>",
      "content": "<NS_DOMAIN>",
      "ttl": 86400
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_settings" \
    --request PATCH \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "multi_provider": true
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dnssec" \
    --request PATCH \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "status": "active",
      "dnssec_multi_signer": true
    }'
  bash
curl "https://api.cloudflare.com/client/v4/zones/{zone_id}/dnssec/zsk" \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>"
sh
$ dig <ZONE_NAME> dnskey @<CLOUDFLARE_NAMESERVER> +noall +answer | grep 256
mermaid
flowchart LR
accTitle: Internal DNS zones and CNAME flattening example
accDescr: Diagram exemplifying Internal DNS zones and containing CNAME and A records

subgraph Internal DNS
subgraph Zone 700 - net
A["@ A 192.0.2.10"]
B["xyz CNAME def.example.local"]
end
subgraph View 111 - London
subgraph Zone 600 - example.local
X["@ A 192.0.2.1"]
Y["abc CNAME xyz.net"]
U["def TXT 15192-51"]
Z["def A 192.0.2.9"]
end
end
end
bash
  curl "https://api.cloudflare.com/client/v4/zones/8a904aeb565c42cfa207d98f6edea2f3/dns_settings" \
    --request PATCH \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "internal_dns": {
          "reference_zone_id": "8e64c6fb4b514f3faf64de81efc11e51"
      }
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/zones" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "account": {
          "id": "<ACCOUNT_ID>"
      },
      "name": "<ZONE_NAME>",
      "type": "internal"
    }'
  bash
{
    "deletes": [
        {
            "id": "2bff0ebc4df64beaa44b0dca93e37a28"
        },
        {
            "id": "31d1d6e79ce04b8d93cbc5a13401d728"
        }
    ],
    "patches": [
        {
            "id": "62276440f783445380480484648c1017",
            "content": "192.0.2.46"
        },
        {
            "id": "c942d948dc2343b9b97aed78479c9fb9",
            "name": "update.example.com",
            "proxied": true
        }
    ],
    "puts": [
        {
            "id": "a50364543094428abde0f14061d42b0e",
            "content": "192.0.2.50",
            "name": "change.example.com",
            "type": "A",
            "ttl:": 1
        },
        {
            "id": "3bce0920f19d43949498bd067b05dfa9",
            "content": "192.0.2.45",
            "name": "no-change.example.com",
            "type": "A",
            "proxied": false,
            "ttl:": 3000
        }
    ],
    "posts": [
        {
            "name": "@",
            "type": "A",
            "content": "192.0.2.41",
            "proxied": false,
            "ttl": 3000
        },
        {
            "name": "a.example.com",
            "type": "A",
            "content": "192.0.2.42",
            "proxied": true
        }
    ]
}
bash
   curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
     --request POST \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     --json '{
       "type": "A",
       "name": "mail.example.com",
       "content": "192.0.2.1",
       "ttl": 3600,
       "proxied": false
     }'
   json
   {
     "result": {
       "id": "<ID>",
       "zone_id": "<ZONE_ID>",
       "zone_name": "example.com",
       "name": "mail.example.com",
       "type": "A",
       "content": "192.0.2.1",
       "proxiable": true,
       "proxied": false,
       "ttl": 3600,
       "locked": false,
       "meta": {
         "source": "primary"
       },
       "comment": null,
       "tags": [],
       "created_on": "2023-01-17T20:37:05.368097Z",
       "modified_on": "2023-01-17T20:37:05.368097Z"
     },
     "success": true,
     "errors": [],
     "messages": []
   }
   bash
   curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
     --request POST \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     --json '{
       "type": "MX",
       "name": "example.com",
       "content": "mail.example.com",
       "priority": 5,
       "ttl": 3600
     }'
   json
   {
     "result": {
       "id": "<ID>",
       "zone_id": "<ZONE_ID>",
       "zone_name": "example.com",
       "name": "example.com",
       "type": "MX",
       "content": "mail.example.com",
       "priority": 5,
       "proxiable": false,
       "proxied": false,
       "ttl": 3600,
       "locked": false,
       "meta": {
         "source": "primary"
       },
       "comment": null,
       "tags": [],
       "created_on": "2023-01-17T20:54:23.660869Z",
       "modified_on": "2023-01-17T20:54:23.660869Z"
     },
     "success": true,
     "errors": [],
     "messages": []
   }
   bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/import" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --form "file=@your_formatted_file.txt"
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/export" \
    --request GET \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  txt
; Only tags
a.example.com.  60  IN  A   1.1.1.1 ;   cf_tags=awesome
b.example.com.  60  IN  A   1.1.1.1 ;   cf_tags=tag1,tag2:value2,tag3:"value,with,commas",tag4:"value with \"escaped\" quotation marks"

; Only a comment
c.example.com.  60  IN  A   1.1.1.1 ; just a comment without tags
d.example.com.  60  IN  A   1.1.1.1 ; this comment contains cf_tags= as text cf_tags=

; Comments and tags
e.example.com.  60  IN  A   1.1.1.1 ; simple example cf_tags=important,ticket:THIS-12345
f.example.com.  60  IN  A   1.1.1.1 ; this is the comment cf_tags=tag1:value1,tag2:value2,tag-without-value,another-tag-without-value,tag-with-quoted-value:"because of the comma, quotes are needed"

; Neither attribute
g.example.com.  60  IN  A   1.1.1.1
txt
;; CNAME Records
a.cloudflaredocs.com.  1  IN  CNAME  example.com. ; cf_tags=test:1,cf-flatten-cname
b.cloudflaredocs.com.  1  IN  CNAME  example.com. ; cf_tags=cf-proxied:false
c.cloudflaredocs.com.  1  IN  CNAME  example.com. ; cf_tags=tag-without-value,cf-proxied:true
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "type": "A",
    "name": "www.example.com",
    "content": "192.0.2.1",
    "ttl": 3600,
    "proxied": false
  }'
json
{
  "result": {
    "id": "<ID>",
    "zone_id": "<ZONE_ID>",
    "zone_name": "example.com",
    "name": "www.example.com",
    "type": "A",
    "content": "192.0.2.1",
    "proxiable": true,
    "proxied": false,
    "ttl": 1,
    "locked": false,
    "meta": {
      "source": "primary"
    },
    "comment": null,
    "tags": [],
    "created_on": "2023-01-17T20:37:05.368097Z",
    "modified_on": "2023-01-17T20:37:05.368097Z"
  },
  "success": true,
  "errors": [],
  "messages": []
}
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "type": "CNAME",
    "name": "www.example.com",
    "content": "www.another-example.com",
    "ttl": 3600,
    "proxied": false
  }'
json
{
  "result": {
    "id": "<ID>",
    "zone_id": "<ZONE_ID>",
    "zone_name": "example.com",
    "name": "www.example.com",
    "type": "A",
    "content": "www.another-example.com",
    "proxiable": true,
    "proxied": false,
    "ttl": 1,
    "locked": false,
    "meta": {
      "source": "primary"
    },
    "comment": null,
    "tags": [],
    "created_on": "2023-01-17T20:37:05.368097Z",
    "modified_on": "2023-01-17T20:37:05.368097Z"
  },
  "success": true,
  "errors": [],
  "messages": []
}
bash
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "type": "SRV",
    "name": "_xmpp._tcp.example.com",
    "data": {
        "priority": 10,
        "weight": 5,
        "port": 5223,
        "target": "server.example.com"
    }
  }'
json
{
  "result": {
    "id": "<ID>",
    "zone_id": "<ZONE_ID>",
    "zone_name": "example.com",
    "name": "_xmpp._tcp.example.com",
    "type": "SRV",
    "content": "5 5223 server.example.com",
    "priority": 10,
    "proxiable": false,
    "proxied": false,
    "ttl": 1,
    "locked": false,
    "data": {
      "port": 5223,
      "priority": 10,
      "target": "server.example.com",
      "weight": 5
    },
    "meta": {
      "auto_added": false,
      "managed_by_apps": false,
      "managed_by_argo_tunnel": false,
      "source": "primary"
    },
    "comment": null,
    "tags": [],
    "created_on": "2022-11-08T15:57:39.585977Z",
    "modified_on": "2022-11-08T15:57:39.585977Z"
  },
  "success": true,
  "errors": [],
  "messages": []
}
txt
files  CNAME  files.example.com.s3.amazonaws.com
plaintext
<value>._domainkey.example.com CNAME <hostname>.<service provider domain>
txt
NS records with that host already exist. (Code:81056)
txt
  "zone_defaults": {
    "nameservers": {
      "type": "custom.account"
    }
  }
  txt
     "nameservers": {
       "type": "custom.tenant"
     }
   txt
"zone_defaults": {
  "nameservers": {
    "type": "custom.tenant"
  }
}
bash
curl https://api.cloudflare.com/client/v4/tenants/{tenant_id}/custom_ns \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>" \
--header "Content-Type: application/json" \
--data '{
  "ns_name": "<NS_NAME>",
  "ns_set": <SET>
}'
bash
curl https://api.cloudflare.com/client/v4/tenants/{tenant_id}/custom_ns \
--header "X-Auth-Email: <EMAIL>" \
--header "X-Auth-Key: <API_KEY>"
txt
  "vanity_name_servers": ["ns1.example.com","ns2.example.com"]
  txt
  "vanity_name_servers": []
  bash
     curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/export" \
       --request GET \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
     txt
   www.example.com CNAME www.example.com.cdn.cloudflare.net
   bash

**Examples:**

Example 1 (unknown):
```unknown
Use the `ref` field to get stable rule IDs across updates when using Terraform. Adding this field prevents Terraform from recreating the rule on changes. For more information, refer to [Troubleshooting](https://developers.cloudflare.com/terraform/troubleshooting/rule-id-changes/#how-to-keep-the-same-rule-id-between-modifications) in the Terraform documentation.

For additional guidance on using Terraform with Cloudflare, refer to [Terraform](https://developers.cloudflare.com/terraform/).

</page>

<page>
---
title: Set Browser Cache TTL · Cloudflare Cache (CDN) docs
description: Specify a time for a visitor’s Browser Cache TTL to accelerate the
  page load for repeat visitors to your website. To configure cache duration
  within Cloudflare’s data centers, refer to Edge Cache TTL.
lastUpdated: 2025-09-16T11:22:59.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/set-browser-ttl/
  md: https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/set-browser-ttl/index.md
---

Specify a time for a visitor’s Browser Cache TTL to accelerate the page load for repeat visitors to your website. To configure cache duration within Cloudflare’s data centers, refer to [Edge Cache TTL](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#edge-ttl).

By default, Cloudflare honors the cache expiration set in your `Expires` and `Cache-Control` headers. Cloudflare overrides any `Cache-Control` or `Expires` headers with values set via the **Browser Cache TTL** option under **Caching** on your dashboard if:

* The value of the `Cache-Control` header from the origin web server is less than the **Browser Cache TTL** setting. This means that **Browser cache TTL** value needs to be higher than origin `max-age`.
* The origin web server does not send a `Cache-Control` or an `Expires` header.

Unless specifically set in a [Cache Rule](https://developers.cloudflare.com/cache/how-to/cache-rules/), Cloudflare does not override or insert `Cache-Control` headers if you set **Browser Cache TTL** to **Respect Existing Headers**.

Nevertheless, the value you set via Cache Rule will be ignored if `Cache-Control: max-age` is higher. In other words, you can override to make browsers cache longer than Cloudflare's edge but not less.

## Set Browser Cache TTL

Note

If you modify cached assets, the new asset is not displayed to repeat visitors before the Browser Cache TTL duration. [Purging Cloudflare’s cache](https://developers.cloudflare.com/cache/how-to/purge-cache/) does not affect assets cached in a visitor’s browser.

1. In the Cloudflare dashboard, go to the **Caching** page.

   [Go to **Configuration**](https://dash.cloudflare.com/?to=/:account/:zone/caching/configuration)

2. Under **Browser Cache TTL**, select the desired cache expiration time from the drop-down menu.

The **Respect Existing Headers** option tells Cloudflare to honor the settings in the `Cache-Control` headers from your origin web server.

</page>

<page>
---
title: ​Purge by single-file · Cloudflare Cache (CDN) docs
description: With purge by single-file, cached resources are instantly removed
  from the stored assets in your Content Delivery Network (CDN) across all data
  centers. New requests for the purged asset receive the latest version from
  your origin web server and add it back to your CDN cache within the specific
  Cloudflare data center that served the request.
lastUpdated: 2025-10-06T13:41:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/index.md
---

With purge by single-file, cached resources are instantly removed from the stored assets in your Content Delivery Network (CDN) across all data centers. New requests for the purged asset receive the latest version from your origin web server and add it back to your CDN cache within the specific Cloudflare data center that served the request.

For information on single-file purge rate limits, refer to the [limits](https://developers.cloudflare.com/cache/how-to/purge-cache/#single-file-purge-limits) section.

A single-file purge performed through your Cloudflare dashboard does not clear objects that contain any of the following:

* [Custom cache keys](https://developers.cloudflare.com/cache/how-to/cache-keys/)

* [Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin)

* Any of these request headers:

  * `X-Forwarded-Host`
  * `X-Host`
  * `X-Forwarded-Scheme`
  * `X-Original-URL`
  * `X-Rewrite-URL`
  * `Forwarded`

You can purge objects with these characteristics using an API call to ([purge files by URL](https://developers.cloudflare.com/api/resources/cache/methods/purge/)). In the data/header section of the API call, you must include all headers and cache keys contained in the cached resource, along with their matching values.

Warning

Always use UTF-8 encoded URLs for single-file cache purges. Wildcards are not supported on single file purge, and you must use purge by hostname, prefix, or implement cache tags as an alternative solution.

1. In the Cloudflare dashboard, go to the **Configuration** page.

   [Go to **Configuration**](https://dash.cloudflare.com/?to=/:account/:zone/caching/configuration)

2. Under **Purge Cache**, select **Custom Purge**. The **Custom Purge** window appears.

3. Under **Purge by**, select **URL**.

4. Enter the appropriate value(s) in the text field using the format shown in the example. Be aware that the host part of the URL is not case-sensitive, meaning it will always be converted to lowercase according to RFC standards. However, the path portion is case-sensitive. For example, `https://EXAMPLE.com/helloHI` would be treated as `https://example.com/helloHI`.

5. Perform any additional instructions to complete the form.

6. Review your entries.

7. Select **Purge**.

Note

For information on how to use single-file purge to purge assets cached by a Workers fetch, refer to [Single file purge assets cached by a Worker](https://developers.cloudflare.com/workers/reference/how-the-cache-works/#single-file-purge-assets-cached-by-a-worker).

For information on how to purge assets cached by [Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/) operations, refer to [Purge assets stored with the Cache API](https://developers.cloudflare.com/workers/reference/how-the-cache-works/#purge-assets-stored-with-the-cache-api).

Warning

If you have a [Transform Rule](https://developers.cloudflare.com/rules/transform/) in place that is modifying part of a URL path, you must use the non-transform (end user) URL when performing single file purge so that purge can take effect.

## Resulting cache status

Purging by single-file deletes the resource, resulting in the `CF-Cache-Status` header being set to [`MISS`](https://developers.cloudflare.com/cache/concepts/cache-responses/#miss) for subsequent requests.

</page>

<page>
---
title: ​Purge cache by hostname · Cloudflare Cache (CDN) docs
description: Purging by hostname means that all assets at URLs with a host that
  matches one of the provided values will be instantly purged from the cache.
lastUpdated: 2025-10-06T13:41:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-hostname/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-hostname/index.md
---

Purging by hostname means that all assets at URLs with a host that matches one of the provided values will be instantly purged from the cache.

1. In the Cloudflare dashboard, go to the **Configuration** page.

   [Go to **Configuration**](https://dash.cloudflare.com/?to=/:account/:zone/caching/configuration)

2. Under **Purge Cache**, select **Custom Purge**. The **Custom Purge** window appears.

3. Under **Purge by**, select **Hostname**.

4. Follow the syntax instructions:

   * One hostname per line.
   * Separated by commas.
   * You can purge up to 30 hostnames at a time.

5. Enter the appropriate value(s) in the text field using the format shown in the example.

6. Select **Purge**.

For information on rate limits, refer to the [Availability and limits](https://developers.cloudflare.com/cache/how-to/purge-cache/#availability-and-limits) section.

## Resulting cache status

Purging by hostname deletes the resource, resulting in the `CF-Cache-Status` header being set to [`MISS`](https://developers.cloudflare.com/cache/concepts/cache-responses/#miss) for subsequent requests.

If [tiered cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/) is used, purging by hostname may return `EXPIRED`, as the lower tier tries to revalidate with the upper tier to reduce load on the latter. Depending on whether the upper tier has the resource or not, and whether the end user is reaching the lower tier or the upper tier, `EXPIRED` or `MISS` are returned.

</page>

<page>
---
title: Purge cache by cache-tags · Cloudflare Cache (CDN) docs
description: Cache-tag purging makes multi-file purging easier because you can
  instantly bulk purge by adding cache-tags to your assets, such as webpages,
  image files, and more.
lastUpdated: 2025-10-06T13:41:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-tags/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-tags/index.md
---

Cache-tag purging makes multi-file purging easier because you can instantly bulk purge by adding cache-tags to your assets, such as webpages, image files, and more.

## General workflow for cache-tags

1. Add tags to the `Cache-Tag` HTTP response header from your origin web server for your web content, such as pages, static assets, etc.
2. [Ensure your web traffic is proxied](https://developers.cloudflare.com/dns/proxy-status/) through Cloudflare.
3. Cloudflare associates the tags in the `Cache-Tag` HTTP header with the content being cached.
4. Use specific cache-tags to instantly purge your Cloudflare CDN cache of all content containing that cache-tag from your dashboard or [using our API](https://developers.cloudflare.com/api/resources/cache/methods/purge/).
5. Cloudflare forces a [cache MISS](https://developers.cloudflare.com/cache/concepts/cache-responses/#miss) on content with the purged cache-tag.

Warning

Be careful when purging. A cache MISS can cause execution delays by requiring a fetch from your origin server.

## Add Cache-Tag HTTP response headers

You add cache-tags to your web content in `Cache-Tag` HTTP response headers to allow the client and server to pass additional information in requests or responses. HTTP headers consist of a specific case-insensitive name followed by a colon `:` and the valid value, for example, `Cache-Tag:tag1,tag2,tag3`. Use commas to separate the tags when you want to use multiple cache-tags.

When your content reaches our edge network, Cloudflare:

* Removes the `Cache-Tag` HTTP header before sending the response to your website visitor or passing the response to a [Worker](https://developers.cloudflare.com/workers/). Your end users or Worker never see `Cache-Tag` HTTP headers on your Cloudflare-enabled website.
* Removes whitespaces from the header and any before and after cache-tag names: `tag1`, `tag2` and `tag1,tag2` are considered the same.
* Removes all repeated and trailing commas before applying cache-tags: `tag1,,,tag2` and `tag1,tag2` are considered the same.

## A few things to remember

* A single HTTP response can have more than one `Cache-Tag` HTTP header field.
* The minimum length of a cache-tag is one byte.
* Individual tags do not have a maximum length, but the aggregate `Cache-Tag` HTTP header cannot exceed 16 KB after the header field name, which is approximately 1,000 unique tags. Length includes whitespace and commas but does not include the header field name.
* For cache purges, the maximum length of a cache-tag in an API call is 1,024 characters.
* The `Cache-Tag` HTTP header must only contain printable ASCII encoded characters.
* Spaces are not allowed in cache-tags.
* Case is not sensitive. For example, `Tag1` and `tag1` are considered the same.

## Purge using cache-tags

1. In the Cloudflare dashboard, go to the **Configuration** page.

   [Go to **Configuration**](https://dash.cloudflare.com/?to=/:account/:zone/caching/configuration)

2. Under **Purge Cache**, select **Custom Purge**. The **Custom Purge** window appears.

3. Under **Purge by**, select **Tag**.

4. In the text box, enter your tags to use to purge the cached resources. To purge multiple cache-tagged resources, separate each tag with a comma or have one tag per line.

5. Select **Purge**.

For information on rate limits, refer to the [Availability and limits](https://developers.cloudflare.com/cache/how-to/purge-cache/#availability-and-limits) section.

## Resulting cache status

Purging by tag deletes the resource, resulting in the `CF-Cache-Status` header being set to [`MISS`](https://developers.cloudflare.com/cache/concepts/cache-responses/#miss) for subsequent requests.

If [Tiered Cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/) is used, purging by tag may return `EXPIRED`, as the lower tier tries to revalidate with the upper tier to reduce load on the latter. Depending on whether the upper tier has the resource or not, and whether the end user is reaching the lower tier or the upper tier, `EXPIRED` or `MISS` are returned.

</page>

<page>
---
title: Purge cache key resources · Cloudflare Cache (CDN) docs
description: Instantly purge resources that use Cache Keys via the Cloudflare
  API. If you use Cloudflare's Purge by URL, include the headers and query
  strings that are in your custom Cache Key.
lastUpdated: 2025-07-09T13:51:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-cache-key/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-cache-key/index.md
---

Instantly purge resources that use Cache Keys via the [Cloudflare API](https://developers.cloudflare.com/api/resources/cache/methods/purge/). If you use [Cloudflare's Purge by URL](https://developers.cloudflare.com/api/resources/cache/methods/purge/#purge-cached-content-by-url), include the headers and query strings that are in your custom Cache Key.

Currently, it is not possible to purge a URL stored through Cache API that uses a custom cache key set by a Worker. Instead, use a [custom key created by Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#cache-key). Alternatively, purge your assets using purge everything, purge by tag, purge by host or purge by prefix.

To instantly purge by `device_type`, `geo`, or `lang` use `CF-Device-Type`, `CF-IPCountry` or `accept-language`, respectively. [Purge by Tag / Host](https://developers.cloudflare.com/api/resources/cache/methods/purge/#purge-cached-content-by-tag-host-or-prefix) and [Purge Everything](https://developers.cloudflare.com/api/resources/cache/methods/purge/#purge-all-cached-content) are not impacted by the use of custom Cache Keys.

## Purge by device type

For a Cache Key based on device type, purge the asset by passing the `CF-Device-Type` header with the API purge request (valid headers include mobile, desktop, and tablet).

Refer to the example API request below to instantly purge all mobile assets on the root webpage.

Required API token permissions

At least one of the following [token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) is required:

* `Cache Purge`
```

Example 2 (unknown):
```unknown
## Purge by geo

Instantly purge resources for a location-based Cache Key by specifying the two-letter country code. Spain is used in the example below.

Required API token permissions

At least one of the following [token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) is required:

* `Cache Purge`
```

Example 3 (unknown):
```unknown
## Purge by language

For a Cache Key based on language, purge the asset by passing the `accept-language` header. Refer to the example API request below to instantly purge all assets in Chinese (PRC).

Required API token permissions

At least one of the following [token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) is required:

* `Cache Purge`
```

Example 4 (unknown):
```unknown
</page>

<page>
---
title: ​Purge everything · Cloudflare Cache (CDN) docs
description: To maintain optimal site performance, Cloudflare strongly
  recommends using single-file (by URL) purging instead of a complete cache
  purge.
lastUpdated: 2025-10-06T13:41:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-everything/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-everything/index.md
---

To maintain optimal site performance, Cloudflare strongly recommends using single-file (by URL) purging instead of a complete cache purge.

Purging everything instantly clears all resources from your CDN cache in all Cloudflare data centers. Each new request for a purged resource returns to your origin server to validate the resource. If Cloudflare cannot validate the resource, Cloudflare fetches the latest version from the origin server and replaces the cached version. When a site with heavy traffic contains a lot of assets, requests to your origin server can increase substantially and result in slow site performance.

1. In the Cloudflare dashboard, go to the **Configuration** page.

   [Go to **Configuration**](https://dash.cloudflare.com/?to=/:account/:zone/caching/configuration)

2. Under **Purge Cache**, select **Purge Everything**. A warning window appears.

3. If you agree, select **Purge Everything**.

Note

When purging everything for a non-production cache environment, all files for that specific cache environment will be purged. However, when purging everything for the production environment, all files will be purged across all environments.

For information on rate limits, refer to the [Availability and limits](https://developers.cloudflare.com/cache/how-to/purge-cache/#availability-and-limits) section.

## Resulting cache status

Purge Everything invalidates the resource, resulting in the `CF-Cache-Status` header indicating [`EXPIRED`](https://developers.cloudflare.com/cache/concepts/cache-responses/#expired) for subsequent requests.

</page>

<page>
---
title: P​urge varied images · Cloudflare Cache (CDN) docs
description: Purging varied images instantly purges all content variants for
  that URL. This behavior occurs so that if an image changes, you can easily
  update the cache with a single purge request instead of trying to determine
  the potential number of out-of-date variants. The behavior is true regardless
  of purge type used, such as single file, tag, or hostname.
lastUpdated: 2025-09-16T13:55:30.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-varied-images/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-varied-images/index.md
---

Purging varied images instantly purges all content variants for that URL. This behavior occurs so that if an image changes, you can easily update the cache with a single purge request instead of trying to determine the potential number of out-of-date variants. The behavior is true regardless of [purge type](https://developers.cloudflare.com/cache/how-to/purge-cache/) used, such as [single file](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/), [tag](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-tags/), or [hostname](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-hostname/).

</page>

<page>
---
title: Purge zone versions via API · Cloudflare Cache (CDN) docs
description: "To purge zone versions via the Cloudflare API, follow these steps:"
lastUpdated: 2024-12-16T12:00:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-zone-versions/
  md: https://developers.cloudflare.com/cache/how-to/purge-cache/purge-zone-versions/index.md
---

To purge zone versions via the Cloudflare API, follow these steps:

## Step 1: Retrieve the environment ID

First, retrieve your zone's environment ID by sending a request to the following API endpoint:
```

---

## Bundler will show a lot of output as it fetches the dependencies

**URL:** llms-txt#bundler-will-show-a-lot-of-output-as-it-fetches-the-dependencies

**Contents:**
- Configuring your Pages project
- Migrating your custom domain
- What's next?
- 2025-04-18
- 2025-02-26
- 2024-12-19
- 2024-10-24
- 2023-09-13
- 2023-08-23
- 2023-08-01

sh
git add Gemfile Gemfile.lock
git commit -m "deps: added Gemfiles"
git push origin main
sh
CF_API_TOKEN=<YOUR_CF_API_TOKEN> CF_ACCOUNT_ID=<ACCOUNT_ID> CF_PAGES_PROJECT_NAME=<PROJECT_NAME> npm start
sh
CF_API_TOKEN=<YOUR_CF_API_TOKEN> CF_ACCOUNT_ID=<ACCOUNT_ID> CF_PAGES_PROJECT_NAME=<PROJECT_NAME> CF_DELETE_ALIASED_DEPLOYMENTS=true npm start
sh

**Examples:**

Example 1 (unknown):
```unknown
This should complete successfully. If not, verify that you have copied the `github-pages` line above exactly, and have not commented it out with a leading `#`.

You will now need to commit these files to your repository so that Cloudflare Pages can reference them in the following steps:
```

Example 2 (unknown):
```unknown
## Configuring your Pages project

With your GitHub Pages project now explicitly specifying its dependencies, you can start configuring Cloudflare Pages. The process is almost identical to [deploying a Jekyll site](https://developers.cloudflare.com/pages/framework-guides/deploy-a-jekyll-site/).

Note

If you are configuring your Cloudflare Pages site for the first time, refer to the [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/), which explains how to connect your existing Git repository to Cloudflare Pages.

To deploy your site to Pages:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application** > **Pages** > **Import an existing Git repository**.

3. Select the new GitHub repository that you created and, in the **Set up builds and deployments** section, provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `jekyll build` |
| Build directory | `_site` |

After you have configured your site, you can begin your first deploy. You should see Cloudflare Pages installing `jekyll`, your project dependencies, and building your site, before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit new code to your Jekyll site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes look to your site before deploying them to production.

## Migrating your custom domain

If you are using a [custom domain with GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), you must update your DNS record(s) to point at your new Cloudflare Pages deployment. This will require you to update the `CNAME` record at the DNS provider for your domain to point to `<your-pages-site>.pages.dev`, replacing `<your-username>.github.io`.

Note that it may take some time for DNS caches to expire and for this change to be reflected, depending on the DNS TTL (time-to-live) value you set when you originally created the record.

Refer to the [adding a custom domain](https://developers.cloudflare.com/pages/configuration/custom-domains/#add-a-custom-domain) section of the Get started guide for a list of detailed steps.

## What's next?

* Learn how to [customize HTTP response headers](https://developers.cloudflare.com/pages/how-to/add-custom-http-headers/) for your Pages site using Cloudflare Workers.
* Understand how to [rollback a potentially broken deployment](https://developers.cloudflare.com/pages/configuration/rollbacks/) to a previously working version.
* [Configure redirects](https://developers.cloudflare.com/pages/configuration/redirects/) so that visitors are always directed to your 'canonical' custom domain.

</page>

<page>
---
title: Changelog · Cloudflare Pages docs
description: Subscribe to RSS
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/platform/changelog/
  md: https://developers.cloudflare.com/pages/platform/changelog/index.md
---

[Subscribe to RSS](https://developers.cloudflare.com/pages/platform/changelog/index.xml)

## 2025-04-18

**Action recommended - Node.js 18 end-of-life and impact on Pages Build System V2**

* If you are using [Pages Build System V2](https://developers.cloudflare.com/pages/configuration/build-image/) for a Git-connected Pages project, note that the default Node.js version, **Node.js 18**, will end its LTS support on **April 30, 2025**.

* Pages will not change the default Node.js version in the Build System V2 at this time, instead, we **strongly recommend pinning a modern Node.js version** to ensure your builds are consistent and secure.

* You can [pin any Node.js version](https://developers.cloudflare.com/pages/configuration/build-image/#override-default-versions) by:

  1. Adding a `NODE_VERSION` environment variable with the desired version specified as the value.
  2. Adding a `.node-version` file with the desired version specified in the file.

* Pinning helps avoid unexpected behavior and ensures your builds stay up-to-date with your chosen runtime. We also recommend pinning all critical tools and languages that your project relies on.

## 2025-02-26

**Support for pnpm 10 in build system**

* Pages build system now supports building projects that use **pnpm 10** as the package manager. If your build previously failed due to this unsupported version, retry your build. No config changes needed.

## 2024-12-19

**Cloudflare GitHub App Permissions Update**

* Cloudflare is requesting updated permissions for the [Cloudflare GitHub App](https://github.com/apps/cloudflare-workers-and-pages) to enable features like automatically creating a repository on your GitHub account and deploying the new repository for you when getting started with a template. This feature is coming out soon to support a better onboarding experience.

  * **Requested permissions:**

    * [Repository Administration](https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps?apiVersion=2022-11-28#repository-permissions-for-administration) (read/write) to create repositories.
    * [Contents](https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps?apiVersion=2022-11-28#repository-permissions-for-contents) (read/write) to push code to the created repositories.

  * **Who is impacted:**

    * Existing users will be prompted to update permissions when GitHub sends an email with subject "\[GitHub] Cloudflare Workers & Pages is requesting updated permission" on December 19th, 2024.
    * New users installing the app will see the updated permissions during the connecting repository process.

  * **Action:** Review and accept the permissions update to use upcoming features. *If you decline or take no action, you can continue connecting repositories and deploying changes via the Cloudflare GitHub App as you do today, but new features requiring these permissions will not be available.*

  * **Questions?** Visit [#github-permissions-update](https://discord.com/channels/595317990191398933/1313895851520688163) in the Cloudflare Developers Discord.

## 2024-10-24

**Updating Bun version to 1.1.33 in V2 build system**

* Bun version is being updated from `1.0.1` to `1.1.33` in Pages V2 build system. This is a minor version change, please see details at [Bun](https://bun.sh/blog/bun-v1.1.33).
* If you wish to use a previous Bun version, you can [override default version](https://developers.cloudflare.com/pages/configuration/build-image/#overriding-default-versions).

## 2023-09-13

**Support for D1's new storage subsystem and build error message improvements**

* Added support for D1's [new storage subsystem](https://blog.cloudflare.com/d1-turning-it-up-to-11/). All Git builds and deployments done with Wrangler v3.5.0 and up can use the new subsystem.
* Builds which fail due to exceeding the [build time limit](https://developers.cloudflare.com/pages/platform/limits/#builds) will return a proper error message indicating so rather than `Internal error`.
* New and improved error messages for other build failures

## 2023-08-23

**Commit message limit increase**

* Commit messages can now be up to 384 characters before being trimmed.

## 2023-08-01

**Support for newer TLDs**

* Support newer TLDs such as `.party` and `.music`.

## 2023-07-11

**V2 build system enabled by default**

* V2 build system is now default for all new projects.

## 2023-07-10

**Sped up project creation**

* Sped up project creation.

## 2023-05-19

**Build error message improvement**

* Builds which fail due to Out of memory (OOM) will return a proper error message indicating so rather than `Internal error`.

## 2023-05-17

**V2 build system beta**

* The V2 build system is now available in open beta. Enable the V2 build system by going to your Pages project in the Cloudflare dashboard and selecting **Settings** > [**Build & deployments**](https://dash.cloudflare.com?to=/:account/pages/view/:pages-project/settings/builds-deployments) > **Build system version**.

## 2023-05-16

**Support for Smart Placement**

* [Smart placement](https://developers.cloudflare.com/workers/configuration/smart-placement/) can now be enabled for Pages within your Pages Project by going to **Settings** > [**Functions**](https://dash.cloudflare.com?to=/:account/pages/view/:pages-project/settings/functions).

## 2023-03-23

**Git projects can now see files uploaded**

* Files uploaded are now visible for Git projects, you can view them in the [Cloudflare dashboard](https://dash.cloudflare.com?to=/:account/pages/view/:pages-project/:pages-deployment/files).

## 2023-03-20

**Notifications for Pages are now available**

* Notifications for Pages events are now available in the [Cloudflare dashboard](https://dash.cloudflare.com?to=/:account/notifications). Events supported include:

  * Deployment started.
  * Deployment succeeded.
  * Deployment failed.

## 2023-02-14

**Analytics Engine now available in Functions**

* Added support for [Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) in Functions.

## 2023-01-05

**Queues now available in Functions**

* Added support for [Queues](https://developers.cloudflare.com/queues/) producer in Functions.

## 2022-12-15

**API messaging update**

Updated all API messaging to be more helpful.

## 2022-12-01

**Ability to delete aliased deployments**

* Aliased deployments can now be deleted. If using the API, you will need to add the query parameter `force=true`.

## 2022-11-19

**Deep linking to a Pages deployment**

* You can now deep-link to a Pages deployment in the dashboard with `:pages-deployment`. An example would be `https://dash.cloudflare.com?to=/:account/pages/view/:pages-project/:pages-deployment`.

## 2022-11-17

**Functions GA and other updates**

* Pages functions are now GA. For more information, refer to the [blog post](https://blog.cloudflare.com/pages-function-goes-ga/).

* We also made the following updates to Functions:

  * [Functions metrics](https://dash.cloudflare.com?to=/:account/pages/view/:pages-project/analytics/production) are now available in the dashboard.
  * [Functions billing](https://developers.cloudflare.com/pages/functions/pricing/) is now available.
  * The [Unbound usage model](https://developers.cloudflare.com/workers/platform/limits/#response-limits) is now available for Functions.
  * [Secrets](https://developers.cloudflare.com/pages/functions/bindings/#secrets) are now available.
  * Functions tailing is now available via the [dashboard](https://dash.cloudflare.com?to=/:account/pages/view/:pages-project/:pages-deployment/functions) or with Wrangler (`wrangler pages deployment tail`).

## 2022-11-15

**Service bindings now available in Functions**

* Service bindings are now available in Functions. For more details, refer to the [docs](https://developers.cloudflare.com/pages/functions/bindings/#service-bindings).

## 2022-11-03

**Ansi color codes in build logs**

Build log now supports ansi color codes.

## 2022-10-05

**Deep linking to a Pages project**

* You can now deep-link to a Pages project in the dashboard with `:pages-project`. An example would be `https://dash.cloudflare.com?to=/:account/pages/view/:pages-project`.

## 2022-09-12

**Increased domain limits**

Previously, all plans had a maximum of 10 [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) per project.

Now, the limits are:

* **Free**: 100 custom domains.
* **Pro**: 250 custom domains.
* **Business** and **Enterprise**: 500 custom domains.

## 2022-09-08

**Support for \_routes.json**

* Pages now offers support for `_routes.json`. For more details, refer to the [documentation](https://developers.cloudflare.com/pages/functions/routing/#functions-invocation-routes).

## 2022-08-25

**Increased build log expiration time**

Build log expiration time increased from 2 weeks to 1 year.

## 2022-08-08

**New bindings supported**

* R2 and D1 [bindings](https://developers.cloudflare.com/pages/functions/bindings/) are now supported.

## 2022-07-05

**Added support for .dev.vars in wrangler pages**

Pages now supports `.dev.vars` in `wrangler pages`, which allows you to use use environmental variables during your local development without chaining `--env`s.

This functionality requires Wrangler v2.0.16 or higher.

## 2022-06-13

**Added deltas to wrangler pages publish**

Pages has added deltas to `wrangler pages publish`.

We now keep track of the files that make up each deployment and intelligently only upload the files that we have not seen. This means that similar subsequent deployments should only need to upload a minority of files and this will hopefully make uploads even faster.

This functionality requires Wrangler v2.0.11 or higher.

## 2022-06-08

**Added branch alias to PR comments**

* PR comments for Pages previews now include the branch alias.

</page>

<page>
---
title: Known issues · Cloudflare Pages docs
description: "Here are some known bugs and issues with Cloudflare Pages:"
lastUpdated: 2025-12-12T21:19:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/platform/known-issues/
  md: https://developers.cloudflare.com/pages/platform/known-issues/index.md
---

Here are some known bugs and issues with Cloudflare Pages:

## Builds and deployment

* GitHub and GitLab are currently the only supported platforms for automatic CI/CD builds. [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) allows you to integrate your own build platform or upload from your local computer.

* Incremental builds are currently not supported in Cloudflare Pages.

* Uploading a `/functions` directory through the dashboard's Direct Upload option does not work (refer to [Using Functions in Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/#functions)).

* Commits/PRs from forked repositories will not create a preview. Support for this will come in the future.

## Git configuration

* If you deploy using the Git integration, you cannot switch to Direct Upload later. However, if you already use a Git-integrated project and do not want to trigger deployments every time you push a commit, you can [disable/pause automatic deployments](https://developers.cloudflare.com/pages/configuration/git-integration/#disable-automatic-deployments). Alternatively, you can delete your Pages project and create a new one pointing at a different repository if you need to update it.

## Build configuration

* `*.pages.dev` subdomains currently cannot be changed. If you need to change your `*.pages.dev` subdomain, delete your project and create a new one.

* Hugo builds automatically run an old version. To run the latest version of Hugo (for example, `0.101.0`), you will need to set an environment variable. Set `HUGO_VERSION` to `0.101.0` or the Hugo version of your choice.

* By default, Cloudflare uses Node `12.18.0` in the Pages build environment. If you need to use a newer Node version, refer to the [Build configuration page](https://developers.cloudflare.com/pages/configuration/build-configuration/) for configuration options.

* For users migrating from Netlify, Cloudflare does not support Netlify's Forms feature. [Pages Functions](https://developers.cloudflare.com/pages/functions/) are available as an equivalent to Netlify's Serverless Functions.

## Custom Domains

* It is currently not possible to add a custom domain with

  * a wildcard, for example, `*.domain.com`.
  * a Worker already routed on that domain.

* It is currently not possible to add a custom domain with a Cloudflare Access policy already enabled on that domain.

* Cloudflare's Load Balancer does not work with `*.pages.dev` projects; an `Error 1000: DNS points to prohibited IP` will appear.

* When adding a custom domain, the domain will not verify if Cloudflare cannot validate a request for an SSL certificate on that hostname. In order for the SSL to validate, ensure Cloudflare Access or a Cloudflare Worker is allowing requests to the validation path: `http://{domain_name}/.well-known/acme-challenge/*`.

* [Advanced Certificates](https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/) cannot be used with Cloudflare Pages due to Cloudflare for SaaS's [certificate prioritization](https://developers.cloudflare.com/ssl/reference/certificate-and-hostname-priority/).

## Pages Functions

* [Functions](https://developers.cloudflare.com/pages/functions/) does not currently support adding/removing polyfills, so your bundler (for example, webpack) may not run.

* `passThroughOnException()` is not currently available for Advanced Mode Pages Functions (Pages Functions which use an `_worker.js` file).

* `passThroughOnException()` is not currently as resilient as it is in Workers. We currently wrap Pages Functions code in a `try`/`catch` block and fallback to calling `env.ASSETS.fetch()`. This means that any critical failures (such as exceeding CPU time or exceeding memory) may still throw an error.

## Enable Access on your `*.pages.dev` domain

If you would like to enable [Cloudflare Access](https://www.cloudflare.com/teams-access/)] for your preview deployments and your `*.pages.dev` domain, you must:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your Pages project.

3. Go to **Settings** > **Enable access policy**.

4. Select **Manage** on the Access policy created for your preview deployments.

5. Under **Access** > **Applications**, select your project.

6. Select **Configure**.

7. Under **Public hostname**, in the **Subdomain** field, delete the wildcard (`*`) and select **Save application**. You may need to change the **Application name** at this step to avoid an error.

At this step, your `*.pages.dev` domain has been secured behind Access. To resecure your preview deployments:

1. Go back to your Pages project > **Settings** > **General** > and reselect **Enable access policy**.
2. Review that two Access policies, one for your `*.pages.dev` domain and one for your preview deployments (`*.<YOUR_SITE>.pages.dev`), have been created.

If you have a custom domain and protected your `*.pages.dev` domain behind Access, you must:

1. Select **Add an application** > **Self hosted** in [Cloudflare Zero Trust](https://one.dash.cloudflare.com/).
2. Input an **Application name** and select your custom domain from the *Domain* dropdown menu.
3. Select **Next** and configure your access rules to define who can reach the Access authentication page.
4. Select **Add application**.

Warning

If you do not configure an Access policy for your custom domain, an Access authentication will render but not work for your custom domain visitors. If your Pages project has a custom domain, make sure to add an Access policy as described above in steps 10 through 13 to avoid any authentication issues.

If you have an issue that you do not see listed, let the team know in the Cloudflare Workers Discord. Get your invite at [discord.cloudflare.com](https://discord.cloudflare.com), and share your bug report in the #pages-general channel.

## Delete a project with a high number of deployments

You may not be able to delete your Pages project if it has a high number (over 100) of deployments. The Cloudflare team is tracking this issue.

As a workaround, review the following steps to delete all deployments in your Pages project. After you delete your deployments, you will be able to delete your Pages project.

1. Download the `delete-all-deployments.zip` file by going to the following link: <https://pub-505c82ba1c844ba788b97b1ed9415e75.r2.dev/delete-all-deployments.zip>.
2. Extract the `delete-all-deployments.zip` file.
3. Open your terminal and `cd` into the `delete-all-deployments` directory.
4. In the `delete-all-deployments` directory, run `npm install` to install dependencies.
5. Review the following commands to decide which deletion you would like to proceed with:

* To delete all deployments except for the live production deployment (excluding [aliased deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/#preview-aliases)):
```

Example 3 (unknown):
```unknown
* To delete all deployments except for the live production deployment (including [aliased deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/#preview-aliases), for example, `staging.example.pages.dev`):
```

Example 4 (unknown):
```unknown
To find your Cloudflare API token, log in to the [Cloudflare dashboard](https://dash.cloudflare.com), select the user icon on the upper righthand side of your screen > go to **My Profile** > **API Tokens**.

You need a token with `Cloudflare Pages Edit` permissions.

To find your Account ID, refer to [Find your zone and account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).

## Use Pages as Origin in Cloudflare Load Balancer

[Cloudflare Load Balancing](https://developers.cloudflare.com/load-balancing/) will not work without the host header set. To use a Pages project as target, make sure to select **Add host header** when [creating a pool](https://developers.cloudflare.com/load-balancing/pools/create-pool/#create-a-pool), and set both the host header value and the endpoint address to your `pages.dev` domain.

Refer to [Use Cloudflare Pages as origin](https://developers.cloudflare.com/load-balancing/pools/cloudflare-pages-origin/) for a complete tutorial.

</page>

<page>
---
title: Limits · Cloudflare Pages docs
description: Below are limits observed by the Cloudflare Free plan. For more
  details on removing these limits, refer to the Cloudflare plans page.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/platform/limits/
  md: https://developers.cloudflare.com/pages/platform/limits/index.md
---

Below are limits observed by the Cloudflare Free plan. For more details on removing these limits, refer to the [Cloudflare plans](https://www.cloudflare.com/plans) page.

Need a higher limit?

To request an adjustment to a limit, complete the [Limit Increase Request Form](https://forms.gle/ukpeZVLWLnKeixDu7). If the limit can be increased, Cloudflare will contact you with next steps.

## Builds

Each time you push new code to your Git repository, Pages will build and deploy your site. You can build up to 500 times per month on the Free plan. Refer to the Pro and Business plans in [Pricing](https://pages.cloudflare.com/#pricing) if you need more builds.

Builds will timeout after 20 minutes. Concurrent builds are counted per account.

## Custom domains

Based on your Cloudflare plan type, a Pages project is limited to a specific number of custom domains. This limit is on a per-project basis.

| Free | Pro | Business | Enterprise |
| - | - | - | - |
| 100 | 250 | 500 | 500[1](#user-content-fn-1) |

## Files

Pages uploads each file on your site to Cloudflare's globally distributed network to deliver a low latency experience to every user that visits your site. Cloudflare Pages sites can contain up to 20,000 files.

## File size

The maximum file size for a single Cloudflare Pages site asset is 25 MiB.

Larger Files

To serve larger files, consider uploading them to [R2](https://developers.cloudflare.com/r2/) and utilizing the [public bucket](https://developers.cloudflare.com/r2/buckets/public-buckets/) feature. You can also use [custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/#connect-a-bucket-to-a-custom-domain), such as `static.example.com`, for serving these files.

## Functions

Requests to [Pages functions](https://developers.cloudflare.com/pages/functions/) count towards your quota for Workers plans, including requests from your Function to KV or Durable Object bindings.

Pages supports the [Standard usage model](https://developers.cloudflare.com/workers/platform/pricing/#example-pricing-standard-usage-model).

## Headers

A `_headers` file can have a maximum of 100 header rules.

An individual header in a `_headers` file can have a maximum of 2,000 characters. For managing larger headers, it is recommended to implement [Pages Functions](https://developers.cloudflare.com/pages/functions/).

## Preview deployments

You can have an unlimited number of [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) active on your project at a time.

## Redirects

A `_redirects` file can have a maximum of 2,000 static redirects and 100 dynamic redirects, for a combined total of 2,100 redirects. It is recommended to use [Bulk Redirects](https://developers.cloudflare.com/pages/configuration/redirects/#surpass-_redirects-limits) when you have a need for more than the `_redirects` file supports.

## Users

Your Pages site can be managed by an unlimited number of users via the Cloudflare dashboard. Note that this does not correlate with your Git project – you can manage both public and private repositories, open issues, and accept pull requests via without impacting your Pages site.

## Projects

Cloudflare Pages has a soft limit of 100 projects within your account in order to prevent abuse. If you need this limit raised, contact your Cloudflare account team or use the Limit Increase Request Form at the top of this page.

In order to protect against abuse of the service, Cloudflare may temporarily disable your ability to create new Pages projects, if you are deploying a large number of applications in a short amount of time. Contact support if you need this limit increased.

## Footnotes

1. If you need more custom domains, contact your account team. [↩](#user-content-fnref-1)

</page>

<page>
---
title: Choose a data or storage product · Cloudflare Pages docs
lastUpdated: 2025-05-09T17:32:11.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/platform/storage-options/
  md: https://developers.cloudflare.com/pages/platform/storage-options/index.md
---


</page>

<page>
---
title: Add a React form with Formspree · Cloudflare Pages docs
description: Learn how to add a React form with Formspree, a back-end service
  that handles form processing and storage.
lastUpdated: 2025-10-09T15:47:46.000Z
chatbotDeprioritize: false
tags: Forms,JavaScript
source_url:
  html: https://developers.cloudflare.com/pages/tutorials/add-a-react-form-with-formspree/
  md: https://developers.cloudflare.com/pages/tutorials/add-a-react-form-with-formspree/index.md
---

Almost every React website needs a form to collect user data. [Formspree](https://formspree.io/) is a back-end service that handles form processing and storage, allowing developers to include forms on their website without writing server-side code or functions.

In this tutorial, you will create a `<form>` component using React and add it to a single page application built with `create-react-app`. Though you are using `create-react-app` (CRA), the concepts will apply to any React framework including Next.js, Gatsby, and more. You will use Formspree to collect the submitted data and send out email notifications when new submissions arrive, without requiring any server-side coding.

You will deploy your site to Cloudflare Pages. Refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/) to familiarize yourself with the platform.

## Setup

To begin, create a new React project on your local machine with `create-react-app`. Then create a [new GitHub repository](https://repo.new/), and attach the GitHub location as a remote destination:
```

---
