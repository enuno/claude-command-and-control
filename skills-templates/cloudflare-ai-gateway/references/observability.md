# Cloudflare-Ai-Gateway - Observability

**Pages:** 2

---

## Print logs from the API client using the default log library logger (default: false).

**URL:** llms-txt#print-logs-from-the-api-client-using-the-default-log-library-logger-(default:-false).

export CLOUDFLARE_API_CLIENT_LOGGING=true

---

## Test load distribution with health monitoring

**URL:** llms-txt#test-load-distribution-with-health-monitoring

**Contents:**
- macOS
- Windows
- Linux
  - [chrony](https://chrony-project.org)
  - [systemd-timesyncd](https://man7.org/linux/man-pages/man5/timesyncd.conf.5.html)
  - [ntpd](https://linux.die.net/man/5/ntp.conf)
- Client configuration
- TLS
- Desktop alerts
- Using multiple sources

for i in {1..6}; do
  echo "Request $i:"
  curl -s https://www.example.com
  sleep 2
done
bash
Request 1:
Hello, this is 198.51.100.15!
Request 2:
Hello, this is 203.0.113.10!
Request 3:
Hello, this is 198.51.100.15!
Request 4:
Hello, this is 203.0.113.10!
Request 5:
Hello, this is 203.0.113.10!
Request 6:
Hello, this is 198.51.100.15!
bash
git add main.tf
git commit -m "Step 4 - Create load balancer (LB) monitor, LB pool, and LB"
git push
plaintext
   server time.cloudflare.com iburst
   plaintext
   systemctl restart chronyd
   plaintext
   [Time]
   NTP=time.cloudflare.com
   plaintext
   systemctl restart systemd-timesyncd
   plaintext
   server time.cloudflare.com iburst
   plaintext
   systemctl restart ntpd
   json
{
  "servers": [
    {
      "name": "Cloudflare-Roughtime-2",
      "publicKeyType": "ed25519",
      "publicKey": "0GD7c3yP8xEc4Zl2zeuN2SlLvDVVocjsPSL8/Rl/7zg=",
      "addresses": [
        {
          "protocol": "udp",
          "address": "roughtime.cloudflare.com:2003"
        }
      ]
    }
  ]
}
go
servers, skipped, err := roughtime.LoadConfig("roughtime.config")
go
t0 := time.Now()
rt, err := roughtime.Get(&servers[0], attempts, timeout, nil)
go
t1, radius := rt.Now()
delta := t1.Sub(t0.Now())
now := func() time.Time {
  return time.Now().Add(delta)
}
go
skew := time.Duration(math.Abs(float64(delta)))
if skew > 10*time.Second {
  summary := "Check your clock!"
  body := fmt.Sprintf("%s says it's off by %v.", servers[0].Name, skew)
  cmd := exec.Command("notify-send", "-i", "clock", summary, body)
  if err := cmd.Run(); err != nil {
    // error handling ...
  }
}
go
t0 := time.Now()
res := roughtime.Do(servers, attempts, timeout, nil)
go
thresh := 10 * time.Second
delta, err := roughtime.MedianDeltaWithRadiusThresh(res, t0, thresh)
go
chain := roughtime.NewChain(results)
ok, err := chain.Verify(nil)
if err != nil || !ok {
  // error handling ...
}
go
roughtime.SetLogger(log.New(os.Stdout, "", 0))
go
go install github.com/cloudflare/roughtime/cmd/getroughtime@latest
getroughtime -ping roughtime.cloudflare.com:2003 -pubkey 0GD7c3yP8xEc4Zl2zeuN2SlLvDVVocjsPSL8/Rl/7zg=
sh
dig TXT roughtime.cloudflare.com | grep -oP 'TXT\s"\K.*?(?=")'
bash
   curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets/$WIDGET_ID" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "ephemeral_id": true
     }'
   bash
   curl -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets/$WIDGET_ID" \
     -H "Authorization: Bearer $API_TOKEN"
   json
{
  "success": true,
  "challenge_ts": "2022-02-28T15:14:30.096Z",
  "hostname": "example.com",
  "error-codes": [],
  "action": "login",
  "cdata": "sessionid-123456789",
  "metadata": {
    "ephemeral_id": "x:9f78e0ed210960d7693b167e"
  }
}
bash
    curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets/$WIDGET_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
    "domains": ["example.com", "app.example.com", "api.example.com"]
    }'
  bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets/$WIDGET_ID" \
-H "Authorization: Bearer $API_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "offlabel": true
}'
bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets" \
-H "Authorization: Bearer $API_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "name": "Branded Widget",
    "domains": ["example.com"],
    "mode": "managed",
    "offlabel": true
}'
bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets/$WIDGET_ID" \
-H "Authorization: Bearer $API_TOKEN"
mermaid
flowchart LR
    A[<b>Loading</b><br /><small>Widget is processing the challenge.</small> ] --> B[<b>Interaction*</b><br /><small>Visitor needs to check the box. <br />*Managed mode only.</small>] 
    B --> C[<b>Success</b><br /><small>The Challenge was completed successfully.</small>]
js
   import { initializeApp } from "firebase/app";
   import { getAppCheck, initializeAppCheck } from "firebase/app-check";
   import {
       CloudflareProviderOptions,
   } from '@cloudflare/turnstile-firebase-app-check';

const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_PROJECT_ID.appspot.com",
   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
   appId: "YOUR_APP_ID",
   };

const app = initializeApp(firebaseConfig);

// Initialize App Check
   const siteKey = 'YOUR-SITEKEY';
   const HTTP_ENDPOINT = '${function:ext-cloudflare-turnstile-app-check-provider-tokenExchange.url}';

const cpo = new CloudflareProviderOptions(HTTP_ENDPOINT, siteKey);
   const provider = new CustomProvider(cpo);

initializeAppCheck(app, { provider });

// retrieve App Check token from Cloudflare Turnstile
   cpo.getToken().then(({ token }) => {
       document.getElementById('app-check-token').innerHTML = token;
   });
   js
import express from "express";
import { initializeApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

const expressApp = express();
const firebaseApp = initializeApp();

const appCheckVerification = async (req, res, next) => {
    const appCheckToken = req.header("X-Firebase-AppCheck");

if (!appCheckToken) {
        res.status(401);
        return next("Unauthorized");
    }

try {
        const appCheckClaims = await getAppCheck().verifyToken(appCheckToken);

// If verifyToken() succeeds, continue with the next middleware function in the stack.
        return next();
    } catch (err) {
        res.status(401);
        return next("Unauthorized");
    }
}

expressApp.get("/yourApiEndpoint", [appCheckVerification], (req, res) => {
    // Handle request.
});
html
<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  async
  defer
></script>
html
<link rel="preconnect" href="https://challenges.cloudflare.com">
html
<div class="cf-turnstile" data-sitekey="<YOUR-SITE-KEY>"></div>
html
<div
  class="cf-turnstile"
  data-sitekey="<YOUR-SITE-KEY>"
  data-theme="light"
  data-size="normal"
  data-callback="onSuccess"
></div>
html
<!DOCTYPE html>
<html>
<head>
    <title>Login Form</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
    <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />

<!-- Turnstile widget with basic configuration -->
        <div class="cf-turnstile" data-sitekey="<YOUR-SITE-KEY>"></div>
        <button type="submit">Log in</button>
    </form>

</body>
</html>
html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Implicit Rendering with Cloudflare Turnstile</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
  <h1>Contact Us</h1>
  <form action="/submit" method="POST">
    <label for="name">Name:</label><br>
    <input type="text" id="name" name="name" required><br>
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br>
    <!-- Turnstile Widget -->
    <div class="cf-turnstile" data-sitekey="<YOUR-SITE-KEY>"></div>
    <br>
    <button type="submit">Submit</button>
  </form>
</body>
</html>
html
<form action="/contact" method="POST" id="contact-form">
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <!-- Widget with callbacks and custom configuration -->
  <div
    class="cf-turnstile"
    data-sitekey="<YOUR-SITE-KEY>"
    data-theme="auto"
    data-size="flexible"
    data-callback="onTurnstileSuccess"
    data-error-callback="onTurnstileError"
    data-expired-callback="onTurnstileExpired"
  ></div>
  <button type="submit" id="submit-btn" disabled>Send Message</button>
</form>

<script>
  function onTurnstileSuccess(token) {
    console.log("Turnstile success:", token);
    document.getElementById("submit-btn").disabled = false;
  }
  function onTurnstileError(errorCode) {
    console.error("Turnstile error:", errorCode);
    document.getElementById("submit-btn").disabled = true;
  }
  function onTurnstileExpired() {
    console.warn("Turnstile token expired");
    document.getElementById("submit-btn").disabled = true;
  }
</script>
html
<!-- Compact widget for newsletter signup -->
<form action="/newsletter" method="POST">
  <input type="email" name="email" placeholder="Email" />
  <div
    class="cf-turnstile"
    data-sitekey="<YOUR-SITE-KEY>"
    data-size="compact"
    data-action="newsletter"
  ></div>
  <button type="submit">Subscribe</button>
</form>

<!-- Normal widget for contact form -->
<form action="/contact" method="POST">
  <input type="text" name="name" placeholder="Name" />
  <input type="email" name="email" placeholder="Email" />
  <textarea name="message" placeholder="Message"></textarea>
  <div
    class="cf-turnstile"
    data-sitekey="<YOUR-SITE-KEY>"
    data-action="contact"
    data-theme="dark"
  ></div>
  <button type="submit">Send</button>
</form>
html
<form action="/submit" method="POST">
  <input type="text" name="data" />
  <div class="cf-turnstile" data-sitekey="<YOUR-SITE-KEY>"></div>
  <!-- Hidden field automatically added: -->
  <!-- <input type="hidden" name="cf-turnstile-response" value="TOKEN_VALUE" /> -->
  <button type="submit">Submit</button>
</form>
html
<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
  defer
></script>
html
<div id="turnstile-container"></div>
js
const widgetId = turnstile.render("#turnstile-container", {
  sitekey: "<YOUR-SITE-KEY>",
  callback: function (token) {
    console.log("Success:", token);
  },
});
js
turnstile.reset(widgetId);
js
const responseToken = turnstile.getResponse(widgetId);
js
turnstile.remove(widgetId)
html
<!DOCTYPE html>
<html>
  <head>
    <title>Explicit Rendering</title>
    <script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      defer
    ></script>
  </head>
  <body>
    <form id="login-form">
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <div id="turnstile-widget"></div>
      <button type="submit">Login</button>
    </form>

<script>
      window.onload = function () {
        turnstile.render("#turnstile-widget", {
          sitekey: "<YOUR-SITE-KEY>",
          callback: function (token) {
            console.log("Turnstile token:", token);
            // Handle successful verification
          },
          "error-callback": function (errorCode) {
            console.error("Turnstile error:", errorCode);
          },
        });
      };
    </script>
  </body>
</html>
html
<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad"
  defer
></script>
<div id="widget-container"></div>
<script>
  function onTurnstileLoad() {
    turnstile.render("#widget-container", {
      sitekey: "<YOUR-SITE-KEY>",
      theme: "light",
      callback: function (token) {
        console.log("Challenge completed:", token);
      },
    });
  }
</script>
html
<div id="dynamic-form-container"></div>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>

<script>
  class TurnstileManager {
    constructor() {
      this.widgets = new Map();
    }
    createWidget(containerId, config) {
      // Wait for Turnstile to be ready
      turnstile.ready(() => {
        const widgetId = turnstile.render(containerId, {
          sitekey: config.sitekey,
          theme: config.theme || "auto",
          size: config.size || "normal",
          callback: (token) => {
            console.log(`Widget ${widgetId} completed:`, token);
            if (config.onSuccess) config.onSuccess(token, widgetId);
          },
          "error-callback": (error) => {
            console.error(`Widget ${widgetId} error:`, error);
            if (config.onError) config.onError(error, widgetId);
          },
        });

this.widgets.set(containerId, widgetId);
        return widgetId;
      });
    }
    removeWidget(containerId) {
      const widgetId = this.widgets.get(containerId);
      if (widgetId) {
        turnstile.remove(widgetId);
        this.widgets.delete(containerId);
      }
    }
    resetWidget(containerId) {
      const widgetId = this.widgets.get(containerId);
      if (widgetId) {
        turnstile.reset(widgetId);
      }
    }
  }

// Usage
  const manager = new TurnstileManager();

// Create a widget when user clicks a button
  document.getElementById("show-form-btn").addEventListener("click", () => {
    document.getElementById("dynamic-form-container").innerHTML = `
        <form>
            <input type="email" placeholder="Email" />
            <div id="turnstile-widget"></div>
            <button type="submit">Submit</button>
        </form>
    `;
    manager.createWidget("#turnstile-widget", {
      sitekey: "<YOUR-SITE-KEY>",
      theme: "dark",
      onSuccess: (token) => {
        // Handle successful verification
        console.log("Form ready for submission");
      },
    });
  });
</script>
js
// Render a widget
const widgetId = turnstile.render("#container", {
  sitekey: "<YOUR-SITE-KEY>",
  callback: handleSuccess,
});

// Get the current token
const token = turnstile.getResponse(widgetId);

// Check if widget is expired
const isExpired = turnstile.isExpired(widgetId);

// Reset the widget (clears current state)
turnstile.reset(widgetId);

// Remove the widget completely
turnstile.remove(widgetId);
js
// Render widget but don't run challenge yet
const widgetId = turnstile.render("#container", {
  sitekey: "<YOUR-SITE-KEY>",
  execution: "execute", // Don't auto-execute
});

// Later, run the challenge when needed
turnstile.execute("#container");
js
WebView webView = findViewById(R.id.webview);
WebSettings webSettings = webView.getSettings();

// Required: Enable JavaScript
webSettings.setJavaScriptEnabled(true);

// Required: Enable DOM storage
webSettings.setDomStorageEnabled(true);

// Recommended: Enable other web features
webSettings.setLoadWithOverviewMode(true);
webSettings.setUseWideViewPort(true);
webSettings.setAllowFileAccess(true);
webSettings.setAllowContentAccess(true);

// Load your web content with Turnstile
webView.loadUrl("https://yoursite.com/protected-form");
js
import WebKit

class ViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!

override func viewDidLoad() {
        super.viewDidLoad()

// Configure WebView
        let configuration = WKWebViewConfiguration()
        configuration.preferences.javaScriptEnabled = true

// Load your web content with Turnstile
        if let url = URL(string: "https://yoursite.com/protected-form") {
            webView.load(URLRequest(url: url))
        }
    }
}
js
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      source={{ uri: 'https://yoursite.com/protected-form' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
    />
  );
}
js
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class WebViewScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialUrlRequest: URLRequest(
        url: Uri.parse('https://yoursite.com/protected-form')
      ),
      initialOptions: InAppWebViewGroupOptions(
        crossPlatform: InAppWebViewOptions(
          javaScriptEnabled: true,
          useShouldOverrideUrlLoading: false,
        ),
        android: AndroidInAppWebViewOptions(
          domStorageEnabled: true,
        ),
        ios: IOSInAppWebViewOptions(
          allowsInlineMediaPlayback: true,
        ),
      ),
    );
  }
}
js
// Android - Set consistent User Agent
webSettings.setUserAgentString(webSettings.getUserAgentString());
js
// iOS - Maintain default User Agent
webView.customUserAgent = webView.value(forKey: "userAgent") as? String
html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' challenges.cloudflare.com 'unsafe-inline';
  connect-src 'self' challenges.cloudflare.com;
  frame-src 'self' challenges.cloudflare.com;
">
js
// Android - Enable cookies
CookieManager.getInstance().setAcceptCookie(true);
CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
js
// iOS - Configure cookie storage
webView.configuration.websiteDataStore = WKWebsiteDataStore.default()
shell
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
js
    const SECRET_KEY = 'your-secret-key';

async function validateTurnstile(token, remoteip) {
  const formData = new FormData();
  formData.append('secret', SECRET_KEY);
  formData.append('response', token);
  formData.append('remoteip', remoteip);

try {
            const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                body: formData
            });

const result = await response.json();
            return result;
        } catch (error) {
            console.error('Turnstile validation error:', error);
            return { success: false, 'error-codes': ['internal-error'] };
        }

// Usage in form handler
  async function handleFormSubmission(request) {
  const body = await request.formData();
  const token = body.get('cf-turnstile-response');
  const ip = request.headers.get('CF-Connecting-IP') ||
  request.headers.get('X-Forwarded-For') ||
  'unknown';

const validation = await validateTurnstile(token, ip);

if (validation.success) {
            // Token is valid - process the form
            console.log('Valid submission from:', validation.hostname);
            return processForm(body);
        } else {
            // Token is invalid - reject the submission
            console.log('Invalid token:', validation['error-codes']);
            return new Response('Invalid verification', { status: 400 });
        }

}
  json
  const SECRET_KEY = 'your-secret-key';

async function validateTurnstile(token, remoteip) {
      try {
          const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  secret: SECRET_KEY,
                  response: token,
                  remoteip: remoteip
              })
          });

const result = await response.json();
          return result;
      } catch (error) {
          console.error('Turnstile validation error:', error);
          return { success: false, 'error-codes': ['internal-error'] };
      }
  }
  php
  <?php
  function validateTurnstile($token, $secret, $remoteip = null) {
      $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

$data = [
          'secret' => $secret,
          'response' => $token
      ];

if ($remoteip) {
          $data['remoteip'] = $remoteip;
      }

$options = [
          'http' => [
              'header' => "Content-type: application/x-www-form-urlencoded\r\n",
              'method' => 'POST',
              'content' => http_build_query($data)
          ]
      ];

$context = stream_context_create($options);
      $response = file_get_contents($url, false, $context);

if ($response === FALSE) {
          return ['success' => false, 'error-codes' => ['internal-error']];
      }

return json_decode($response, true);

// Usage
  $secret_key = 'your-secret-key';
  $token = $_POST['cf-turnstile-response'] ?? '';
  $remoteip = $\_SERVER['HTTP_CF_CONNECTING_IP'] ??
  $\_SERVER['HTTP_X_FORWARDED_FOR'] ??
  $\_SERVER['REMOTE_ADDR'];

$validation = validateTurnstile($token, $secret_key, $remoteip);

if ($validation['success']) {
  // Valid token - process form
  echo "Form submission successful!";
  // Process your form data here
  } else {
  // Invalid token - show error
  echo "Verification failed. Please try again.";
  error_log('Turnstile validation failed: ' . implode(', ', $validation['error-codes']));
  }
  ?>
  python
  import requests

def validate_turnstile(token, secret, remoteip=None):
      url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

data = {
          'secret': secret,
          'response': token
      }

if remoteip:
          data['remoteip'] = remoteip

try:
          response = requests.post(url, data=data, timeout=10)
          response.raise_for_status()
          return response.json()
      except requests.RequestException as e:
          print(f"Turnstile validation error: {e}")
          return {'success': False, 'error-codes': ['internal-error']}

# Usage with Flask
  from flask import Flask, request, jsonify

app = Flask(__name__)
  SECRET_KEY = 'your-secret-key'

@app.route('/submit-form', methods=['POST'])
  def submit_form():
      token = request.form.get('cf-turnstile-response')
      remoteip = request.headers.get('CF-Connecting-IP') or \
                 request.headers.get('X-Forwarded-For') or \
                 request.remote_addr

validation = validate_turnstile(token, SECRET_KEY, remoteip)

if validation['success']:
          # Valid token - process form
          return jsonify({'status': 'success', 'message': 'Form submitted successfully'})
      else:
          # Invalid token - reject submission
          return jsonify({
              'status': 'error',
              'message': 'Verification failed',
              'errors': validation['error-codes']
          }), 400
  java
  import org.springframework.web.client.RestTemplate;
  import org.springframework.util.LinkedMultiValueMap;
  import org.springframework.util.MultiValueMap;
  import org.springframework.http.HttpEntity;
  import org.springframework.http.HttpHeaders;
  import org.springframework.http.MediaType;
  import org.springframework.http.ResponseEntity;

@Service
  public class TurnstileService {
  private static final String SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  private final String secretKey = "your-secret-key";
  private final RestTemplate restTemplate = new RestTemplate();

public TurnstileResponse validateToken(String token, String remoteip) {
          HttpHeaders headers = new HttpHeaders();
          headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
          params.add("secret", secretKey);
          params.add("response", token);
          if (remoteip != null) {
              params.add("remoteip", remoteip);
          }

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

try {
              ResponseEntity<TurnstileResponse> response = restTemplate.postForEntity(
                  SITEVERIFY_URL, request, TurnstileResponse.class);
              return response.getBody();
          } catch (Exception e) {
              TurnstileResponse errorResponse = new TurnstileResponse();
              errorResponse.setSuccess(false);
              errorResponse.setErrorCodes(List.of("internal-error"));
              return errorResponse;
          }
      }

// Controller usage
  @PostMapping("/submit-form")
  public ResponseEntity<?> submitForm(
  @RequestParam("cf-turnstile-response") String token,
  HttpServletRequest request) {

String remoteip = request.getHeader("CF-Connecting-IP");
      if (remoteip == null) {
          remoteip = request.getHeader("X-Forwarded-For");
      }
      if (remoteip == null) {
          remoteip = request.getRemoteAddr();
      }

TurnstileResponse validation = turnstileService.validateToken(token, remoteip);

if (validation.isSuccess()) {
          // Valid token - process form
          return ResponseEntity.ok("Form submitted successfully");
      } else {
          // Invalid token - reject submission
          return ResponseEntity.badRequest()
              .body("Verification failed: " + validation.getErrorCodes());
      }

}
  csharp
  using System.Text.Json;

public class TurnstileService
  {
      private readonly HttpClient _httpClient;
      private readonly string _secretKey = "your-secret-key";
      private const string SiteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

public TurnstileService(HttpClient httpClient)
      {
          _httpClient = httpClient;
      }

public async Task<TurnstileResponse> ValidateTokenAsync(string token, string remoteip = null)
      {
          var parameters = new Dictionary<string, string>
          {
              { "secret", _secretKey },
              { "response", token }
          };

if (!string.IsNullOrEmpty(remoteip))
          {
              parameters.Add("remoteip", remoteip);
          }

var postContent = new FormUrlEncodedContent(parameters);

try
          {
              var response = await _httpClient.PostAsync(SiteverifyUrl, postContent);
              var stringContent = await response.Content.ReadAsStringAsync();

return JsonSerializer.Deserialize<TurnstileResponse>(stringContent);
          }
          catch (Exception ex)
          {
              return new TurnstileResponse
              {
                  Success = false,
                  ErrorCodes = new[] { "internal-error" }
              };
          }
      }
  }

// Controller usage
  [HttpPost("submit-form")]
  public async Task<IActionResult> SubmitForm([FromForm] string cfTurnstileResponse)
  {
      var remoteip = HttpContext.Request.Headers["CF-Connecting-IP"].FirstOrDefault() ??
                     HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault() ??
                     HttpContext.Connection.RemoteIpAddress?.ToString();

var validation = await _turnstileService.ValidateTokenAsync(cfTurnstileResponse, remoteip);

if (validation.Success)
      {
          // Valid token - process form
          return Ok("Form submitted successfully");
      }
      else
      {
          // Invalid token - reject submission
          return BadRequest($"Verification failed: {string.Join(", ", validation.ErrorCodes)}");
      }
  }
  js
const crypto = require("crypto");

async function validateWithRetry(token, remoteip, maxRetries = 3) {
  const idempotencyKey = crypto.randomUUID();

for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();
      formData.append("secret", SECRET_KEY);
      formData.append("response", token);
      formData.append("remoteip", remoteip);
      formData.append("idempotency_key", idempotencyKey);

const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
        },
      );

const result = await response.json();

if (response.ok) {
        return result;
      }

// If this is the last attempt, return the error
      if (attempt === maxRetries) {
        return result;
      }

// Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      );
    } catch (error) {
      if (attempt === maxRetries) {
        return { success: false, "error-codes": ["internal-error"] };
      }
    }
  }
}
js
async function validateTurnstileEnhanced(
  token,
  remoteip,
  expectedAction = null,
  expectedHostname = null,
) {
  const validation = await validateTurnstile(token, remoteip);

if (!validation.success) {
    return {
      valid: false,
      reason: "turnstile_failed",
      errors: validation["error-codes"],
    };
  }

// Check if action matches expected value (if specified)
  if (expectedAction && validation.action !== expectedAction) {
    return {
      valid: false,
      reason: "action_mismatch",
      expected: expectedAction,
      received: validation.action,
    };
  }

// Check if hostname matches expected value (if specified)
  if (expectedHostname && validation.hostname !== expectedHostname) {
    return {
      valid: false,
      reason: "hostname_mismatch",
      expected: expectedHostname,
      received: validation.hostname,
    };
  }

// Check token age (warn if older than 4 minutes)
  const challengeTime = new Date(validation.challenge_ts);
  const now = new Date();
  const ageMinutes = (now - challengeTime) / (1000 * 60);

if (ageMinutes > 4) {
    console.warn(`Token is ${ageMinutes.toFixed(1)} minutes old`);
  }

return {
    valid: true,
    data: validation,
    tokenAge: ageMinutes,
  };
}

// Usage
const result = await validateTurnstileEnhanced(
  token,
  remoteip,
  "login", // expected action
  "example.com", // expected hostname
);

if (result.valid) {
  // Process the request
  console.log("Validation successful:", result.data);
} else {
  // Handle validation failure
  console.log("Validation failed:", result.reason);
}
json
  {
    "success": true,
    "challenge_ts": "2022-02-28T15:14:30.096Z",
    "hostname": "example.com",
    "error-codes": [],
    "action": "login",
    "cdata": "sessionid-123456789",
    "metadata": {
      "ephemeral_id": "x:9f78e0ed210960d7693b167e"
    }
  }
  json
  {
    "success": false,
    "error-codes": ["invalid-input-response"]
  }
  js
class TurnstileValidator {
  constructor(secretKey, timeout = 10000) {
    this.secretKey = secretKey;
    this.timeout = timeout;
  }

async validate(token, remoteip, options = {}) {
    // Input validation
    if (!token || typeof token !== "string") {
      return { success: false, error: "Invalid token format" };
    }

if (token.length > 2048) {
      return { success: false, error: "Token too long" };
    }

// Prepare request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

try {
      const formData = new FormData();
      formData.append("secret", this.secretKey);
      formData.append("response", token);

if (remoteip) {
        formData.append("remoteip", remoteip);
      }

if (options.idempotencyKey) {
        formData.append("idempotency_key", options.idempotencyKey);
      }

const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        },
      );

const result = await response.json();

// Additional validation
      if (result.success) {
        if (
          options.expectedAction &&
          result.action !== options.expectedAction
        ) {
          return {
            success: false,
            error: "Action mismatch",
            expected: options.expectedAction,
            received: result.action,
          };
        }

if (
          options.expectedHostname &&
          result.hostname !== options.expectedHostname
        ) {
          return {
            success: false,
            error: "Hostname mismatch",
            expected: options.expectedHostname,
            received: result.hostname,
          };
        }
      }

return result;
    } catch (error) {
      if (error.name === "AbortError") {
        return { success: false, error: "Validation timeout" };
      }

console.error("Turnstile validation error:", error);
      return { success: false, error: "Internal error" };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Usage
const validator = new TurnstileValidator(process.env.TURNSTILE_SECRET_KEY);

const result = await validator.validate(token, remoteip, {
  expectedAction: "login",
  expectedHostname: "example.com",
});

if (result.success) {
  // Process the request
} else {
  // Handle failure
  console.log("Validation failed:", result.error);
}
html
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
   js
   // before
   hcaptcha.render(element, {
       sitekey: "00000000-0000-0000-0000-000000000000"
   })
   // after
   turnstile.render(element, {
       sitekey: "1x00000000000000000000AA"
   })
   txt
   https://challenges.cloudflare.com/turnstile/v0/siteverify
   txt
   cf-turnstile-response
   html
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha" async defer></script>
   txt
https://challenges.cloudflare.com/turnstile/v0/siteverify
js
  turnstile.render('#my-widget', {
    sitekey: 'your-sitekey',
    'error-callback': function(errorCode) {
      console.error('Turnstile error occurred:', errorCode);
      handleTurnstileError(errorCode);
      return true; // Indicates we handled the error
    }
  });
  html
  <div class="cf-turnstile"
       data-sitekey="your-sitekey"
       data-error-callback="onTurnstileError"></div>
  js
function handleTurnstileError(errorCode) {
  const errorFamily = Math.floor(errorCode / 1000);

switch(errorFamily) {
    case 100:
      showMessage('Please refresh the page and try again.');
      break;
    case 110:
      showMessage('Configuration error. Please contact support.');
      break;
    case 300:
    case 600:
      showMessage('Security check failed. Please try refreshing or using a different browser.');
      break;
    default:
      showMessage('An unexpected error occurred. Please try again.');
  }
}
js
let retryCount = 0;

turnstile.render('#my-widget', {
  sitekey: 'your-sitekey',
  'error-callback': function(errorCode) {
    retryCount++;

if (retryCount <= 2) {
      console.log(`Turnstile retry attempt ${retryCount}`);
      return false; // Let Turnstile handle the retry
    } else {
      showPersistentErrorMessage(errorCode);
      return true; // We'll handle it from here
    }
  }
});
js
turnstile.render('#my-widget', {
  sitekey: 'your-sitekey',
  retry: 'never',
  'error-callback': function(errorCode) {
    // You control all retry logic
    setTimeout(() => {
      turnstile.reset('#my-widget');
    }, 3000);
  }
});
js
turnstile.render('#my-widget', {
  sitekey: 'your-sitekey',
  retry: 'auto',
  'retry-interval': 8000, // Wait 8 seconds between retries
  'error-callback': handleError
});
js
turnstile.render('#my-widget', {
  sitekey: 'your-sitekey',
  callback: function(token) {
    console.log('Challenge completed successfully');
  },
  'timeout-callback': function() {
    console.log('Challenge timed out - user action required');
    document.getElementById('challenge-notice').textContent =
      'Please complete the security check above to continue.';

// Optionally highlight the widget
    document.getElementById('my-widget').style.border = '2px solid orange';
  },
  'expired-callback': function() {
    console.log('Token expired - challenge needs refresh');
    document.getElementById('challenge-notice').textContent =
      'Security check expired. Please try again.';
  }
});
html
<!-- Development/Testing -->
<div class="cf-turnstile" data-sitekey="1x00000000000000000000AA"></div>

<!-- Production -->
<div class="cf-turnstile" data-sitekey="your-real-sitekey"></div>
js
// Environment-based configuration
const SECRET_KEY = process.env.NODE_ENV === 'production'
  ? process.env.TURNSTILE_SECRET_KEY
  : '1x0000000000000000000000000000000AA';

// Use in validation
const validation = await validateTurnstile(token, SECRET_KEY);
shell

**Examples:**

Example 1 (unknown):
```unknown
Expected output:
```

Example 2 (unknown):
```unknown
You should now see more predictable load distribution with the added benefits of health monitoring and automatic failover.

Merge and verify:
```

Example 3 (unknown):
```unknown
Verify the configuration is working by checking the Cloudflare dashboard under **Traffic** > **Load Balancing**. You should see your monitor, pool, and load balancer with health status indicators. Your load balancer will now:

* Distribute traffic intelligently between origins
* Automatically route around unhealthy servers
* Provide real-time health monitoring

</page>

<page>
---
title: Using Cloudflare's Time Service · Cloudflare Time Services docs
description: Network Time Protocol (NTP) is an Internet protocol designed to
  synchronize time between computer systems communicating over unreliable and
  variable-latency network paths. Cloudflare offers its version of NTP for free
  so you can use our global anycast network to synchronize time from our closest
  server.
lastUpdated: 2025-10-01T17:00:39.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/time-services/ntp/usage/
  md: https://developers.cloudflare.com/time-services/ntp/usage/index.md
---

[Network Time Protocol](https://tools.ietf.org/html/rfc1305) (NTP) is an Internet protocol designed to synchronize time between computer systems communicating over unreliable and variable-latency network paths. Cloudflare offers its version of NTP for free so you can use our [global anycast network](https://www.cloudflare.com/network/) to synchronize time from our closest server.

To use our NTP server, change the time configuration in your device to point to `time.cloudflare.com`.

## macOS

To have your Mac to synchronize time from `time.cloudflare.com`:

1. Go to **System Settings**.
2. Go to **General** > **Date & Time**.
3. Enable **Set date and time automatically**.
4. For **Source**, select **Set...** and enter `time.cloudflare.com` in the text field that appears.

![Screenshot of updating the Date & Time settings on machine running macOS](https://developers.cloudflare.com/_astro/mactime.DBCp2s9r_V3dhb.webp)

## Windows

To have your Windows machine synchronize time from `time.cloudflare.com`:

1. Go to **Control Panel**.
2. Go to **Clock and Region**.
3. Click **Date and Time**.
4. Go to the **Internet Time** tab.
5. Click **Change settings..**
6. For **Server:**, type `time.cloudflare.com` and click **Update now**.
7. Click **OK**.

![Screenshot of updating the Date and Time settings on machine running Windows](https://developers.cloudflare.com/_astro/window.g3wVkbhY_ZXCM2o.webp)

## Linux

Cloudflare's time servers are included in [pool.ntp.org](https://www.ntppool.org/en/) which is the default time service for many Linux distributions and network appliances. If your NTP client is synchronizing from one of the below servers, you are already using Cloudflare's time services.

* [162.159.200.1](https://www.ntppool.org/scores/162.159.200.1)
* [162.159.200.123](https://www.ntppool.org/scores/162.159.200.123)
* [2606:4700:f1::1](https://www.ntppool.org/scores/2606:4700:f1::1)
* [2606:4700:f1::123](https://www.ntppool.org/scores/2606:4700:f1::123)

To manually configure your NTP client to use our time service, please first refer to the documentation for your Linux distribution to determine which NTP client you are using and where the configuration files are stored.

For example:

* [Ubuntu](https://ubuntu.com/server/docs/about-time-synchronisation)
* [Debian](https://wiki.debian.org/NTP)
* [RHEL](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-configuring_ntp_using_the_chrony_suite)

Exact configuration will vary by Linux distribution, but below are some example configurations for popular clients:

### [chrony](https://chrony-project.org)

1. Add `time.cloudflare.com` as a server in the configuration file on your system (e.g., `/etc/chrony/chrony.conf`)
```

Example 4 (unknown):
```unknown
2. Restart the chronyd service.
```

---
