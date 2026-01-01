# Cloudflare-Ai-Search - Configuration

**Pages:** 16

---

## Configuration - exported from the prior steps

**URL:** llms-txt#configuration---exported-from-the-prior-steps

**Contents:**
- 5. Query the data with R2 SQL
  - 5.1. View recent transactions
  - 5.2. Filter the raw transactions into a new table to highlight high-value transactions
- Conclusion
- Pairing-based Cryptography
- BLS Signatures
  - Key Generation
  - Signature Generation
  - Signature Verification
- Threshold BLS Signature

STREAM_ENDPOINT = os.environ["STREAM_ENDPOINT"]# From the stream you created
API_TOKEN = os.environ["WRANGLER_R2_SQL_AUTH_TOKEN"] #the same one created earlier
EVENTS_TO_SEND = 1000 # Feel free to adjust this

def generate_transaction():
    """Generate some random transactions with occasional fraud"""

# User IDs
    high_risk_users = [1001, 1002, 1003, 1004, 1005]
    normal_users = list(range(1006, 2000))

user_id = random.choice(high_risk_users + normal_users)
    is_high_risk_user = user_id in high_risk_users

# Generate amounts
    if random.random() < 0.05:
        amount = round(random.uniform(5000, 50000), 2)
    elif random.random() < 0.03:
        amount = round(random.uniform(0.01, 1.00), 2)
    else:
        amount = round(random.uniform(10, 500), 2)

# Locations
    normal_locations = ["NEW_YORK", "LOS_ANGELES", "CHICAGO", "MIAMI", "SEATTLE", "SAN FRANCISCO"]
    high_risk_locations = ["UNKNOWN_LOCATION", "VPN_EXIT", "MARS", "BAT_CAVE"]

if is_high_risk_user and random.random() < 0.3:
        location = random.choice(high_risk_locations)
    else:
        location = random.choice(normal_locations)

# Merchant categories
    normal_merchants = ["GROCERY", "GAS_STATION", "RESTAURANT", "RETAIL"]
    high_risk_merchants = ["GAMBLING", "CRYPTO", "MONEY_TRANSFER", "GIFT_CARDS"]

if random.random() < 0.1:  # 10% high-risk merchants
        merchant_category = random.choice(high_risk_merchants)
    else:
        merchant_category = random.choice(normal_merchants)

# Series of checks to either increase fraud score by a certain margin
    fraud_score = 0
    if amount > 2000: fraud_score += 0.4
    if amount < 1: fraud_score += 0.3
    if location in high_risk_locations: fraud_score += 0.5
    if merchant_category in high_risk_merchants: fraud_score += 0.3
    if is_high_risk_user: fraud_score += 0.2

# Compare the fraud scores
    is_fraud = random.random() < min(fraud_score * 0.3, 0.8)

# Generate timestamps (some fraud happens at unusual hours)
    base_time = datetime.now(timezone.utc)
    if is_fraud and random.random() < 0.4:  # 40% of fraud at night
        hour = random.randint(0, 5)  # Late night/early morning
        transaction_time = base_time.replace(hour=hour)
    else:
        transaction_time = base_time - timedelta(
            hours=random.randint(0, 168)  # Last week
        )

return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": user_id,
        "amount": amount,
        "transaction_timestamp": transaction_time.isoformat(),
        "location": location,
        "merchant_category": merchant_category,
        "is_fraud": True if is_fraud else False
    }

def send_batch_to_stream(events, batch_size=100):
    """Send events to Cloudflare Stream in batches"""

headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }

total_sent = 0
    fraud_count = 0

for i in range(0, len(events), batch_size):
        batch = events[i:i + batch_size]
        fraud_in_batch = sum(1 for event in batch if event["is_fraud"] == True)

try:
            response = requests.post(STREAM_ENDPOINT, headers=headers, json=batch)

if response.status_code in [200, 201]:
                total_sent += len(batch)
                fraud_count += fraud_in_batch
                print(f"Sent batch of {len(batch)} events (Total: {total_sent})")
            else:
                print(f"Failed to send batch: {response.status_code} - {response.text}")

except Exception as e:
            print(f"Error sending batch: {e}")

return total_sent, fraud_count

def main():
    print("Generating fraud detection data...")

# Generate events
    events = []
    for i in range(EVENTS_TO_SEND):
        events.append(generate_transaction())
        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1} events...")

fraud_events = sum(1 for event in events if event["is_fraud"] == True)
    print(f"📊 Generated {len(events)} total events ({fraud_events} fraud, {fraud_events/len(events)*100:.1f}%)")

# Send to stream
    print("Sending data to Pipeline stream...")
    sent, fraud_sent = send_batch_to_stream(events)

print(f"\nComplete!")
    print(f"   Events sent: {sent:,}")
    print(f"   Fraud events: {fraud_sent:,} ({fraud_sent/sent*100:.1f}%)")
    print(f"   Data is now flowing through your pipeline!")

if __name__ == "__main__":
    main()
bash
pip install requests
python fraud_data_generator.py
bash
npx wrangler r2 sql query "$WAREHOUSE" "
SELECT
    transaction_id,
    user_id,
    amount,
    location,
    merchant_category,
    is_fraud,
    transaction_timestamp
FROM fraud_detection.transactions
WHERE __ingest_ts > '2025-09-24T01:00:00Z'
AND is_fraud = true
LIMIT 10"
bash
npx wrangler pipelines sinks create fraud_filter_sink \
  --type "r2-data-catalog" \
  --bucket "fraud-pipeline" \
  --roll-interval 30 \
  --namespace "fraud_detection" \
  --table "fraud_transactions" \
  --catalog-token $WRANGLER_R2_SQL_AUTH_TOKEN
bash
npx wrangler pipelines create fraud_events_pipeline \
  --sql "INSERT INTO fraud_filter_sink SELECT * FROM raw_events_stream WHERE is_fraud=true and amount > 1000"
bash
npx wrangler r2 sql query "$WAREHOUSE" "
SELECT
    transaction_id,
    user_id,
    amount,
    location,
    merchant_category,
    is_fraud,
    transaction_timestamp
FROM fraud_detection.fraud_transactions
LIMIT 10"
bash
npx wrangler r2 sql query "$WAREHOUSE" "
SELECT
    transaction_id,
    user_id,
    amount,
    location,
    merchant_category,
    is_fraud,
    transaction_timestamp
FROM fraud_detection.fraud_transactions
WHERE is_fraud = false
LIMIT 10"
text
Query executed successfully with no results
sh
  npm create cloudflare@latest -- hello-agent
  sh
  yarn create cloudflare hello-agent
  sh
  pnpm create cloudflare@latest hello-agent
  sh
cd hello-agent
sh
npm i @cloudflare/realtime-agents
jsonc
  {
    "$schema": "./node_modules/wrangler/config-schema.json",
    "ai": {
      "binding": "AI"
    }
  }
  toml
  [ai]
  binding = "AI"
  js
  import {
    DeepgramSTT,
    TextComponent,
    RealtimeKitTransport,
    ElevenLabsTTS,
    RealtimeAgent,
  } from "@cloudflare/realtime-agents";

class MyTextProcessor extends TextComponent {
    env;

constructor(env) {
      super();
      this.env = env;
    }

async onTranscript(text, reply) {
      const { response } = await this.env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          prompt: text,
        },
      );
      reply(response);
    }
  }

export class MyAgent extends RealtimeAgent {
    constructor(ctx, env) {
      super(ctx, env);
    }

async init(agentId, meetingId, authToken, workerUrl, accountId, apiToken) {
      // Construct your text processor for generating responses to text
      const textProcessor = new MyTextProcessor(this.env);
      // Construct a Meeting object to join the RTK meeting
      const rtkTransport = new RealtimeKitTransport(meetingId, authToken);

// Construct a pipeline to take in meeting audio, transcribe it using
      // Deepgram, and pass our generated responses through ElevenLabs to
      // be spoken in the meeting
      await this.initPipeline(
        [
          rtkTransport,
          new DeepgramSTT(this.env.DEEPGRAM_API_KEY),
          textProcessor,
          new ElevenLabsTTS(this.env.ELEVENLABS_API_KEY),
          rtkTransport,
        ],
        agentId,
        workerUrl,
        accountId,
        apiToken,
      );

const { meeting } = rtkTransport;

// The RTK meeting object is accessible to us, so we can register handlers
      // on various events like participant joins/leaves, chat, etc.
      // This is optional
      meeting.participants.joined.on("participantJoined", (participant) => {
        textProcessor.speak(`Participant Joined ${participant.name}`);
      });
      meeting.participants.joined.on("participantLeft", (participant) => {
        textProcessor.speak(`Participant Left ${participant.name}`);
      });

// Make sure to actually join the meeting after registering all handlers
      await meeting.join();
    }

async deinit() {
      // Add any other cleanup logic required
      await this.deinitPipeline();
    }
  }

export default {
    async fetch(request, env, _ctx) {
      const url = new URL(request.url);
      const meetingId = url.searchParams.get("meetingId");
      if (!meetingId) {
        return new Response(null, { status: 400 });
      }

const agentId = meetingId;
      const agent = env.MY_AGENT.idFromName(meetingId);
      const stub = env.MY_AGENT.get(agent);
      // The fetch method is implemented for handling internal pipeline logic
      if (url.pathname.startsWith("/agentsInternal")) {
        return stub.fetch(request);
      }

// Your logic continues here
      switch (url.pathname) {
        case "/init":
          // This is the authToken for joining a meeting, it can be passed
          // in query parameters as well if needed
          const authHeader = request.headers.get("Authorization");
          if (!authHeader) {
            return new Response(null, { status: 401 });
          }

// We just need the part after `Bearer `
          await stub.init(
            agentId,
            meetingId,
            authHeader.split(" ")[1],
            url.host,
            env.ACCOUNT_ID,
            env.API_TOKEN,
          );

return new Response(null, { status: 200 });
        case "/deinit":
          await stub.deinit();
          return new Response(null, { status: 200 });
      }

return new Response(null, { status: 404 });
    },
  };
  ts
  import { DeepgramSTT, TextComponent, RealtimeKitTransport, ElevenLabsTTS, RealtimeAgent } from '@cloudflare/realtime-agents';

class MyTextProcessor extends TextComponent {
    env: Env;

constructor(env: Env) {
      super();
      this.env = env;
    }

async onTranscript(text: string, reply: (text: string) => void) {
      const { response } = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt: text,
      });
      reply(response!);
    }
  }

export class MyAgent extends RealtimeAgent<Env> {
    constructor(ctx: DurableObjectState, env: Env) {
      super(ctx, env);
    }

async init(agentId: string, meetingId: string, authToken: string, workerUrl: string, accountId: string, apiToken: string) {
      // Construct your text processor for generating responses to text
      const textProcessor = new MyTextProcessor(this.env);
      // Construct a Meeting object to join the RTK meeting
      const rtkTransport = new RealtimeKitTransport(meetingId, authToken);

// Construct a pipeline to take in meeting audio, transcribe it using
      // Deepgram, and pass our generated responses through ElevenLabs to
      // be spoken in the meeting
      await this.initPipeline(
        [
          rtkTransport,
          new DeepgramSTT(this.env.DEEPGRAM_API_KEY),
          textProcessor,
          new ElevenLabsTTS(this.env.ELEVENLABS_API_KEY),
          rtkTransport,
        ],
        agentId,
        workerUrl,
        accountId,
        apiToken,
      );

const { meeting } = rtkTransport;

// The RTK meeting object is accessible to us, so we can register handlers
      // on various events like participant joins/leaves, chat, etc.
      // This is optional
      meeting.participants.joined.on('participantJoined', (participant) => {
        textProcessor.speak(`Participant Joined ${participant.name}`);
      });
      meeting.participants.joined.on('participantLeft', (participant) => {
        textProcessor.speak(`Participant Left ${participant.name}`);
      });

// Make sure to actually join the meeting after registering all handlers
      await meeting.join();
    }

async deinit() {
      // Add any other cleanup logic required
      await this.deinitPipeline();
    }
  }

export default {
    async fetch(request, env, _ctx): Promise<Response> {
      const url = new URL(request.url);
      const meetingId = url.searchParams.get('meetingId');
      if (!meetingId) {
        return new Response(null, { status: 400 });
      }

const agentId = meetingId;
      const agent = env.MY_AGENT.idFromName(meetingId);
      const stub = env.MY_AGENT.get(agent);
      // The fetch method is implemented for handling internal pipeline logic
      if (url.pathname.startsWith('/agentsInternal')) {
        return stub.fetch(request);
      }

// Your logic continues here
      switch (url.pathname) {
        case '/init':
          // This is the authToken for joining a meeting, it can be passed
          // in query parameters as well if needed
          const authHeader = request.headers.get('Authorization');
          if (!authHeader) {
            return new Response(null, { status: 401 });
          }

// We just need the part after `Bearer `
          await stub.init(agentId, meetingId, authHeader.split(' ')[1], url.host, env.ACCOUNT_ID, env.API_TOKEN);

return new Response(null, { status: 200 });
        case '/deinit':
          await stub.deinit();
          return new Response(null, { status: 200 });
      }

return new Response(null, { status: 404 });
    },
  } satisfies ExportedHandler<Env>;
  json
  "compatibility_flags": ["nodejs_compat"],
  "migrations": [
    {
      "new_sqlite_classes": ["MyAgent"],
      "tag": "v1",
    },
  ],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "MyAgent",
        "name": "MY_AGENT",
      },
    ],
  },
sh
npx wrangler login
sh
npx wrangler deploy
sh
https://hello-agent.<YOUR_SUBDOMAIN>.workers.dev
sh
curl -X POST https://hello-agent.<YOUR_SUBDOMAIN>.workers.dev/init?meetingId=<REALTIME_KIT_MEETING_ID> -H "Authorization: Bearer <REALTIME_KIT_AUTH_TOKEN>"
ts
interface AudioQualityConstraints {
  echoCancellation?: boolean,
  noiseSupression?: boolean,
  autoGainControl?: boolean,
  enableStereo?: boolean,
  enableHighBitrate?: boolean
}

interface VideoQualityConstraints {
  width: { ideal: number },
  height: { ideal: number },
  frameRate?: { ideal: number },
}

interface ScreenshareQualityConstraints {
  width?: { max: number },
  height?: { max: number },
  frameRate?: {
    ideal: number,
    max: number
  },
  displaySurface?: 'window' | 'monitor' | 'browser';
  selfBrowserSurface?: 'include' | 'exclude'
}

interface MediaConfiguration {
  video?: VideoQualityConstraints,
  audio?: AudioQualityConstraints,
  screenshare?: ScreenshareQualityConstraints,
}

interface RecordingConfig {
  fileNamePrefix?: string;
  videoConfig?: {
    height?: number;
    width?: number;
    codec?: string;
  };
}

interface DefaultOptions {
  video?: boolean;
  audio?: boolean;
  mediaConfiguration?: MediaConfiguration;
  isNonPreferredDevice?: (device: MediaDeviceInfo) => boolean;
  autoSwitchAudioDevice?: boolean;
  recording?: RecordingConfig;
}
bash
curl https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/realtime/kit/{APP_ID}/meetings/{MEETING_ID} \
--request PATCH \
--header "Authorization: Bearer <CLOUDFLARE_API_TOKEN>" \
--header "Content-Type: application/json" \
--data '{ "status": "INACTIVE" }'
bash
curl --location 'https://api.cloudflare.com/client/v4/accounts/<account_id>/realtime/kit/apps' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <api_token>' \
--data '{"name": "My First Cloudflare RealtimeKit app"}'
bash
curl --location 'https://api.cloudflare.com/client/v4/accounts/<account_id>/realtime/kit/<app_id>/meetings' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <api_token>' \
--data '{"title": "My First Cloudflare RealtimeKit meeting"}'
bash
curl --location 'https://api.cloudflare.com/client/v4/accounts/<account_id>/realtime/kit/<app_id>/meetings/<meeting_id>/participants' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <api_token>' \
--data '{
  "name": "Mary Sue",
  "preset_name": "<preset_name>",
  "custom_participant_id": "<uuid_of_the_user_in_your_system>"
}'
ts
  initMeeting({
    overrides: {
      simulcastConfig: {
        disable: false,
        encodings: [{ scaleResolutionDownBy: 2 }],
      },
    },
  });
  ts
  meeting.participants.broadcastMessage("<message_type>", { message: "Hi" }, {
    meetingIds: ["<connected_meeting_id>"],
  });
  mermaid
graph LR
    A[Publisher] -->|Arbitrary data| B[Cloudflare Realtime SFU]
    B -->|Arbitrary data| C@{ shape: procs, label: "Subscribers"}
mermaid
sequenceDiagram
    participant WA as WebRTC Agent
    participant BS as Backend Server
    participant CA as Realtime API

Note over BS: Client Joins

WA->>BS: Request
    BS->>CA: POST /sessions/new
    CA->>BS: newSessionResponse
    BS->>WA: Response

WA->>BS: Request
    BS->>CA: POST /sessions/<ID>/tracks/new (Offer)
    CA->>BS: newTracksResponse (Answer)
    BS->>WA: Response

WA-->>CA: ICE Connectivity Check
    Note over WA: iceconnectionstatechange (connected)
    WA-->>CA: DTLS Handshake
    Note over WA: connectionstatechange (connected)

WA<<->>CA: *Media Flow*

Note over BS: Remote Client Joins

WA->>BS: Request
    BS->>CA: POST /sessions/<ID>/tracks/new
    CA->>BS: newTracksResponse (Offer)
    BS->>WA: Response

WA->>BS: Request
    BS->>CA: PUT /sessions/<ID>/renegotiate (Answer)
    CA->>BS: OK
    BS->>WA: Response

Note over BS: Remote Client Leaves

WA->>BS: Request
    BS->>CA: PUT /sessions/<ID>/tracks/close
    CA->>BS: closeTracksResponse
    BS->>WA: Response

Note over BS: Client Leaves

WA->>BS: Request
    BS->>CA: PUT /sessions/<ID>/tracks/close
    CA->>BS: closeTracksResponse
    BS->>WA: Response
mermaid
graph LR
    A[WebRTC Client] <--> B[Realtime SFU Session]
    B <--> C[Media Transport Adapter]
    C <--> D[External Endpoint]
plaintext
POST /v1/apps/{appId}/adapters/{adapterType}/new
POST /v1/apps/{appId}/adapters/{adapterType}/close
mermaid
graph LR
    A[Publisher] -->|Low quality| B[Cloudflare Realtime SFU]
    A -->|Medium quality| B
    A -->|High quality| B
B -->|Low quality| C@{ shape: procs, label: "Subscribers"}
B -->|Medium quality| D@{ shape: procs, label: "Subscribers"}
B -->|High quality| E@{ shape: procs, label: "Subscribers"}
txt
a=simulcast:send f;h;q
a=rid:f send
a=rid:h send
a=rid:q send
js
const transceiver = peerConnection.addTransceiver(track, {
  direction: "sendonly",
  sendEncodings: [
    { scaleResolutionDownBy: 1, rid: "f" },
    { scaleResolutionDownBy: 2, rid: "h" },
    { scaleResolutionDownBy: 4, rid: "q" },
  ],
});
graphql
query concurrentConnections {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $dateFrom, date_leq: $dateTo }
      ) {
        dimensions {
          datetimeFiveMinutes
        }
        avg {
          concurrentConnectionsFiveMinutes
        }
        sum {
          egressBytes
          ingressBytes
        }
      }
    }
  }
}
json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 816
              },
              "dimensions": {
                "datetimeFiveMinutes": "2025-12-02T03:45:00Z"
              },
              "sum": {
                "egressBytes": 207314144,
                "ingressBytes": 8534200
              }
            },
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 1945
              },
              "dimensions": {
                "datetimeFiveMinutes": "2025-12-02T16:00:00Z"
              },
              "sum": {
                "egressBytes": 462909020,
                "ingressBytes": 128434592
              }
            },

]
        }
      ]
    }
  ]
}
plaintext
query egressByTurnKey{
  viewer {
    usage: accounts(filter: { accountTag: $accountId }) {
        callsTurnUsageAdaptiveGroups(
          filter: {
          date_geq: $dateFrom,
          date_leq: $dateTo
        }
          limit: 2
          orderBy: [sum_egressBytes_DESC]
        ) {
          dimensions {
            keyId
          }
          sum {
            egressBytes
          }
        }
      }
    },
    "errors": null
  }
plaintext
{
  "data": {
    "viewer": {
      "usage": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "dimensions": {
                "keyId": "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
              },
              "sum": {
                "egressBytes": 160040068147
              }
            }
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query topTurnCustomIdentifiers {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        filter: { date_geq: $dateFrom, date_leq: $dateTo }
        limit: 1
        orderBy: [sum_egressBytes_DESC]
      ) {
        dimensions {
          customIdentifier
        }
        sum {
          egressBytes
        }
      }
    }
  }
}
plaintext
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "dimensions": {
                "customIdentifier": "some identifier"
              },
              "sum": {
                "egressBytes": 160040068147
              }
            }
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        filter: {
          date_geq: $dateFrom
          date_leq: $dateTo
          customIdentifier: "tango"
        }
        limit: 100
        orderBy: []
      ) {
        dimensions {
          keyId
          customIdentifier
        }
        sum {
          egressBytes
        }
      }
    }
  }
}
plaintext
{
  "data": {
    "viewer": {
      "usage": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "dimensions": {
                "customIdentifier": "tango",
                "keyId": "74007022d80d7ebac4815fb776b9d3ed"
              },
              "sum": {
                "egressBytes": 162641324
              }
            }
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        filter: { date_geq: $dateFrom, date_leq: $dateTo }
        limit: 100
        orderBy: [datetimeMinute_ASC]
      ) {
        dimensions {
          datetimeMinute
        }
        sum {
          egressBytes
        }
      }
    }
  }
}
plaintext
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "dimensions": {
                "datetimeMinute": "2025-12-01T00:00:00Z"
              },
              "sum": {
                "egressBytes": 159512
              }
            },
            {
              "dimensions": {
                "datetimeMinute": "2025-12-01T00:01:00Z"
              },
              "sum": {
                "egressBytes": 133818
              }
            },
            ... (more data here)
           ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        limit: 100
        filter: { date_geq: $dateFrom, date_leq: $dateTo }
        orderBy: [sum_egressBytes_DESC]
      ) {
        dimensions {
          datacenterCity
          datacenterCode
          datacenterRegion
          datacenterCountry
        }
        sum {
          egressBytes
          ingressBytes
        }
        avg {
          concurrentConnectionsFiveMinutes
        }
      }
    }
  }
}
json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 3135
              },
              "dimensions": {
                "datacenterCity": "Columbus",
                "datacenterCode": "CMH",
                "datacenterCountry": "US",
                "datacenterRegion": "ENAM"
              },
              "sum": {
                "egressBytes": 47720931316,
                "ingressBytes": 19351966366
              }
            },
            ...
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        limit: 1000
        filter: {
          keyId: "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
          date_geq: $dateFrom
          date_leq: $dateTo
        }
        orderBy: [datetimeFiveMinutes_ASC]
      ) {
        dimensions {
          datetimeFiveMinutes
          keyId
        }
        sum {
          egressBytes
          ingressBytes
        }
        avg {
          concurrentConnectionsFiveMinutes
        }
      }
    }
  }
}
json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 130
              },
              "dimensions": {
                "datetimeFiveMinutes": "2025-12-01T00:00:00Z",
                "keyId": "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
              },
              "sum": {
                "egressBytes": 609156,
                "ingressBytes": 464326
              }
            },
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 118
              },
              "dimensions": {
                "datetimeFiveMinutes": "2025-12-01T00:05:00Z",
                "keyId": "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
              },
              "sum": {
                "egressBytes": 534948,
                "ingressBytes": 401286
              }
            },
            ...
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        limit: 1000
        filter: {
          keyId: "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
          date_geq: $dateFrom
          date_leq: $dateTo
        }
        orderBy: [datetimeFiveMinutes_ASC]
      ) {
        dimensions {
          datetimeFiveMinutes
          keyId
        }
        sum {
          egressBytes
          ingressBytes
        }
        avg {
          concurrentConnectionsFiveMinutes
        }
      }
    }
  }
}
json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 130
              },
              "dimensions": {
                "datetimeFiveMinutes": "2025-12-01T00:00:00Z",
                "keyId": "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
              },
              "sum": {
                "egressBytes": 609156,
                "ingressBytes": 464326
              }
            },
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 118
              },
              "dimensions": {
                "datetimeFiveMinutes": "2025-12-01T00:05:00Z",
                "keyId": "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
              },
              "sum": {
                "egressBytes": 534948,
                "ingressBytes": 401286
              }
            },
            ...
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $dateFrom, date_leq: $dateTo }
        orderBy: [datetimeHour_ASC, sum_egressBytes_DESC]
      ) {
        dimensions {
          datetimeHour
          datacenterCity
          datacenterCountry
        }
        sum {
          egressBytes
          ingressBytes
        }
      }
    }
  }
}
json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "dimensions": {
                "datacenterCity": "Chennai",
                "datacenterCountry": "IN",
                "datetimeHour": "2025-12-01T00:00:00Z"
              },
              "sum": {
                "egressBytes": 3416216,
                "ingressBytes": 498927214
              }
            },
            {
              "dimensions": {
                "datacenterCity": "Mumbai",
                "datacenterCountry": "IN",
                "datetimeHour": "2025-12-01T00:00:00Z"
              },
              "sum": {
                "egressBytes": 1267076,
                "ingressBytes": 1140140
              }
            },
            ...
          ]
        }
      ]
    }
  },
  "errors": null
}
graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      callsTurnUsageAdaptiveGroups(
        limit: 10
        filter: { date_geq: $dateFrom, date_leq: $dateTo }
        orderBy: [sum_egressBytes_DESC, sum_ingressBytes_DESC]
      ) {
        dimensions {
          keyId
          customIdentifier
        }
        sum {
          egressBytes
          ingressBytes
        }
        avg {
          concurrentConnectionsFiveMinutes
        }
      }
    }
  }
}
json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "callsTurnUsageAdaptiveGroups": [
            {
              "avg": {
                "concurrentConnectionsFiveMinutes": 837305
              },
              "dimensions": {
                "customIdentifier": "",
                "keyId": "82a58d0aeabfa8f4a4e0c4a9efc9cda5"
              },
              "sum": {
                "egressBytes": 160040068147,
                "ingressBytes": 154955460564
              }
            }
          ]
        }
      ]
    }
  },
  "errors": null
}
mermaid
---
title: Cloudflare Realtime TURN pricing
---
flowchart LR
    Client[TURN Client]
    Server[TURN Server]

Client -->|"Ingress (free)"| Server
    Server -->|"Egress (charged)"| Client

Server <-->|Not part of billing| PeerA[Peer A]
bash
curl https://rtc.live.cloudflare.com/v1/turn/keys/$TURN_KEY_ID/credentials/generate-ice-servers \
--header "Authorization: Bearer $TURN_KEY_API_TOKEN" \
--header "Content-Type: application/json" \
--data '{"ttl": 86400}'
json
{
  "iceServers": [
    {
      "urls": [
        "stun:stun.cloudflare.com:3478",
        "stun:stun.cloudflare.com:53"
      ]
    },
    {
      "urls": [
        "turn:turn.cloudflare.com:3478?transport=udp",
        "turn:turn.cloudflare.com:53?transport=udp",
        "turn:turn.cloudflare.com:3478?transport=tcp",
        "turn:turn.cloudflare.com:80?transport=tcp",
        "turns:turn.cloudflare.com:5349?transport=tcp",
        "turns:turn.cloudflare.com:443?transport=tcp"
      ],
      "username": "bc91b63e2b5d759f8eb9f3b58062439e0a0e15893d76317d833265ad08d6631099ce7c7087caabb31ad3e1c386424e3e",
      "credential": "ebd71f1d3edbc2b0edae3cd5a6d82284aeb5c3b8fdaa9b8e3bf9cec683e0d45fe9f5b44e5145db3300f06c250a15b4a0"
    }
  ]
}
js
const myPeerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.cloudflare.com:3478",
        "stun:stun.cloudflare.com:53"
      ]
    },
    {
      urls: [
        "turn:turn.cloudflare.com:3478?transport=udp",
        "turn:turn.cloudflare.com:53?transport=udp",
        "turn:turn.cloudflare.com:3478?transport=tcp",
        "turn:turn.cloudflare.com:80?transport=tcp",
        "turns:turn.cloudflare.com:5349?transport=tcp",
        "turns:turn.cloudflare.com:443?transport=tcp"
      ],
      "username": "bc91b63e2b5d759f8eb9f3b58062439e0a0e15893d76317d833265ad08d6631099ce7c7087caabb31ad3e1c386424e3e",
      "credential": "ebd71f1d3edbc2b0edae3cd5a6d82284aeb5c3b8fdaa9b8e3bf9cec683e0d45fe9f5b44e5145db3300f06c250a15b4a0"
    },
  ],
});
bash
curl --request POST \
https://rtc.live.cloudflare.com/v1/turn/keys/$TURN_KEY_ID/credentials/$USERNAME/revoke \
--header "Authorization: Bearer $TURN_KEY_API_TOKEN"
bash
curl https://rtc.live.cloudflare.com/v1/turn/keys/$TURN_KEY_ID/credentials/generate \
--header "Authorization: Bearer $TURN_KEY_API_TOKEN" \
--header "Content-Type: application/json" \
--data '{"ttl": 864000, "customIdentifier": "user4523958"}'
plaintext
query{
  viewer {
    usage: accounts(filter: { accountTag: "8846293bd06d1af8c106d89ec1454fe6" }) {
        callsTurnUsageAdaptiveGroups(
          filter: {
          datetimeMinute_gt: "2024-07-15T02:07:07Z"
          datetimeMinute_lt: "2024-08-10T02:07:05Z"
        }
          limit: 100
          orderBy: [customIdentifier_ASC]
        ) {
          dimensions {
            customIdentifier
          }
          sum {
            egressBytes
          }
        }
      }
    }
  }
plaintext
query{
  viewer {
    usage: accounts(filter: { accountTag: "8846293bd06d1af8c106d89ec1454fe6" }) {
        callsTurnUsageAdaptiveGroups(
          filter: {
          datetimeMinute_gt: "2024-07-15T02:07:07Z"
          datetimeMinute_lt: "2024-08-10T02:07:05Z"
          customIdentifier: "myCustomer1111"
        }
          limit: 1
          orderBy: [customIdentifier_ASC]
        ) {
          dimensions {
            customIdentifier
          }
          sum {
            egressBytes
          }
        }
      }
    }
  }
```

<page>
---
title: TURN Feature Matrix · Cloudflare Realtime docs
lastUpdated: 2025-12-05T18:35:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/turn/rfc-matrix/
  md: https://developers.cloudflare.com/realtime/turn/rfc-matrix/index.md
---

## TURN client to TURN server protocols

| Protocol | Support | Relevant specification |
| - | - | - |
| UDP | ✅ | [RFC 5766](https://datatracker.ietf.org/doc/html/rfc5766) |
| TCP | ✅ | [RFC 5766](https://datatracker.ietf.org/doc/html/rfc5766) |
| TLS | ✅ | [RFC 5766](https://datatracker.ietf.org/doc/html/rfc5766) |
| DTLS | No | [draft-petithuguenin-tram-turn-dtls-00](http://tools.ietf.org/html/draft-petithuguenin-tram-turn-dtls-00) |

## TURN client to TURN server protocols

| Protocol | Support | Relevant specification |
| - | - | - |
| TURN (base RFC) | ✅ | [RFC 5766](https://datatracker.ietf.org/doc/html/rfc5766) |
| TURN REST API | ✅ (See [FAQ](https://developers.cloudflare.com/realtime/turn/faq/#does-cloudflare-realtime-turn-support-the-expired-ietf-rfc-draft-draft-uberti-behave-turn-rest-00)) | [draft-uberti-behave-turn-rest-00](http://tools.ietf.org/html/draft-uberti-behave-turn-rest-00) |
| Origin field in TURN (Multi-tenant TURN Server) | ✅ | [draft-ietf-tram-stun-origin-06](https://tools.ietf.org/html/draft-ietf-tram-stun-origin-06) |
| ALPN support for STUN & TURN | ✅ | [RFC 7443](https://datatracker.ietf.org/doc/html/rfc7443) |
| TURN Bandwidth draft specs | No | [draft-thomson-tram-turn-bandwidth-01](http://tools.ietf.org/html/draft-thomson-tram-turn-bandwidth-01) |
| TURN-bis (with dual allocation) draft specs | No | [draft-ietf-tram-turnbis-04](http://tools.ietf.org/html/draft-ietf-tram-turnbis-04) |
| TCP relaying TURN extension | No | [RFC 6062](https://datatracker.ietf.org/doc/html/rfc6062) |
| IPv6 extension for TURN | No | [RFC 6156](https://datatracker.ietf.org/doc/html/rfc6156) |
| oAuth third-party TURN/STUN authorization | No | [RFC 7635](https://datatracker.ietf.org/doc/html/rfc7635) |
| DTLS support (for TURN) | No | [draft-petithuguenin-tram-stun-dtls-00](https://datatracker.ietf.org/doc/html/draft-petithuguenin-tram-stun-dtls-00) |
| Mobile ICE (MICE) support | No | [draft-wing-tram-turn-mobility-02](http://tools.ietf.org/html/draft-wing-tram-turn-mobility-02) |

<page>
---
title: What is TURN? · Cloudflare Realtime docs
description: TURN (Traversal Using Relays around NAT) is a protocol that assists
  in traversing Network Address Translators (NATs) or firewalls in order to
  facilitate peer-to-peer communications. It is an extension of the STUN
  (Session Traversal Utilities for NAT) protocol and is defined in RFC 8656.
lastUpdated: 2025-04-08T20:01:03.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/turn/what-is-turn/
  md: https://developers.cloudflare.com/realtime/turn/what-is-turn/index.md
---

TURN (Traversal Using Relays around NAT) is a protocol that assists in traversing Network Address Translators (NATs) or firewalls in order to facilitate peer-to-peer communications. It is an extension of the STUN (Session Traversal Utilities for NAT) protocol and is defined in [RFC 8656](https://datatracker.ietf.org/doc/html/rfc8656).

## How do I use TURN?

Just like you would use a web browser or cURL to use the HTTP protocol, you need to use a tool or a library to use TURN protocol in your application.

Most users of TURN will use it as part of a WebRTC library, such as the one in their browser or part of [Pion](https://github.com/pion/webrtc), [webrtc-rs](https://github.com/webrtc-rs/webrtc) or [libwebrtc](https://webrtc.googlesource.com/src/).

You can use TURN directly in your application too. [Pion](https://github.com/pion/turn) offers a TURN client library in Golang, so does [webrtc-rs](https://github.com/webrtc-rs/webrtc/tree/master/turn) in Rust.

## Key concepts to know when understanding TURN

1. **NAT (Network Address Translation)**: A method used by routers to map multiple private IP addresses to a single public IP address. This is commonly done by home internet routers so multiple computers in the same network can share a single public IP address.

2. **TURN Server**: A relay server that acts as an intermediary for traffic between clients behind NATs. Cloudflare Realtime TURN service is a example of a TURN server.

3. **TURN Client**: An application or device that uses the TURN protocol to communicate through a TURN server. This is your application. It can be a web application using the WebRTC APIs or a native application running on mobile or desktop.

4. **Allocation**: When a TURN server creates an allocation, the TURN server reserves an IP and a port unique to that client.

5. **Relayed Transport Address**: The IP address and port reserved on the TURN server that others on the Internet can use to send data to the TURN client.

1. A TURN client sends an Allocate request to a TURN server.
2. The TURN server creates an allocation and returns a relayed transport address to the client.
3. The client can then give this relayed address to its peers.
4. When a peer sends data to the relayed address, the TURN server forwards it to the client.
5. When the client wants to send data to a peer, it sends it through the TURN server, which then forwards it to the peer.

TURN works similar to a VPN (Virtual Private Network). However TURN servers and VPNs serve different purposes and operate in distinct ways.

A VPN is a general-purpose tool that encrypts all internet traffic from a device, routing it through a VPN server to enhance privacy, security, and anonymity. It operates at the network layer, affects all internet activities, and is often used to bypass geographical restrictions or secure connections on public Wi-Fi.

A TURN server is a specialized tool used by specific applications, particularly for real-time communication. It operates at the application layer, only affecting traffic for applications that use it, and serves as a relay to traverse NATs and firewalls when direct connections between peers are not possible. While a VPN impacts overall internet speed and provides anonymity, a TURN server only affects the performance of specific applications using it.

## Why is TURN Useful?

TURN is often valuable in scenarios where direct peer-to-peer communication is impossible due to NAT or firewall restrictions. Here are some key benefits:

1. **NAT Traversal**: TURN provides a way to establish connections between peers that are both behind NATs, which would otherwise be challenging or impossible.

2. **Firewall Bypassing**: In environments with strict firewall policies, TURN can enable communication that would otherwise be blocked.

3. **Consistent Connectivity**: TURN offers a reliable fallback method when direct or NAT-assisted connections fail.

4. **Privacy**: By relaying traffic through a TURN server, the actual IP addresses of the communicating parties can be hidden from each other.

5. **VoIP and Video Conferencing**: TURN is crucial for applications like Voice over IP (VoIP) and video conferencing, ensuring reliable connections regardless of network configuration.

6. **Online Gaming**: TURN can help online games establish peer-to-peer connections between players behind different types of NATs.

7. **IoT Device Communication**: Internet of Things (IoT) devices can use TURN to communicate when they're behind NATs or firewalls.

<page>
---
title: Registrant contact updates · Cloudflare Registrar docs
description: It is important that you keep your contact details accurate and
  up-to-date. ICANN rules state that if you do not have updated contact
  information, your domain name registration may be suspended or even cancelled.
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/domain-contact-updates/
  md: https://developers.cloudflare.com/registrar/account-options/domain-contact-updates/index.md
---

It is important that you keep your contact details accurate and up-to-date. [ICANN rules state](https://www.icann.org/resources/pages/registrant-contact-information-wdrp-2017-08-31-en) that if you do not have updated contact information, your domain name registration may be suspended or even cancelled.

The contact information you can update includes:

* First name
* Last name
* Email
* Organization
* Phone
* Address including City, State/Province, Postal code & Country

To update your registrant contacts:

1. In the Cloudflare dashboard, go to the **Manage domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find **Default contact** and select **Edit**.

3. Update the relevant information, and select **Save**.

4. Find the domain where you want to update your contact information, and select **Manage**.

5. Select the **Contacts** tab, and edit the contact information.

If you change any of the following fields, Cloudflare Registrar will require a Change of Registrant approval before the changes are finalized:

* First name
* Last name
* Organization
* Email address

If you update any of the fields mentioned above, Cloudflare Registrar will send an approval email to the current registrant's email address. The approval email contains a link to a web page where the requested change may be viewed and approved or rejected. If the pending change is not approved or rejected within seven days, the request will automatically be canceled.

If you do not update these fields, your contact information is updated immediately and no further action is required.

After selecting the link in the approval email Cloudflare sends you, you have the option to accept or reject the contact changes. If you select the **Accept** button, your domain will be transfer-locked for 60 days.

If you do not want your domain to be locked, be sure to select the **Do not apply 60 day transfer lock** checkbox *before* selecting the **Accept** button. This applies to all supported TLDs, including `.uk`.

## Changing email contact

If the registrant contact update also includes a change to the email address, Cloudflare sends a second approval email to the new (requested) email address. Both the old (original) email address and the new one have to approve the change for the change to be successfully completed.

Only the current registrant may opt out of the transfer lock, however. The approval page for the new registrant will not include the option to opt out.

## 60-day transfer lock

After the changes for the registrant contact are approved, the domain will be placed on a transfer lock for 60 days. This happens when you approve changes to the registrant contacts without checking the box to prevent the transfer lock.

This transfer lock prevents the transfer of the domain to another registrar, and the transfer to another Cloudflare account. It does not prevent additional updates to the domain name.

If the registrant contact is updated again while the domain is in the 60-day lock period, the lock expiration will be further extended to 60 days from the most recent update.

<page>
---
title: Domain management · Cloudflare Registrar docs
description: When your domain is registered with Cloudflare, you can review your
  domain status in Overview.
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/domain-management/
  md: https://developers.cloudflare.com/registrar/account-options/domain-management/index.md
---

When your domain is registered with Cloudflare, you can review your domain status in **Overview**.

1. In the Cloudflare dashboard, go to the **Manage domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. From **Overview**, scroll down to **Domain Registration** to review the current expiration date.

3. Select **Manage domain** to review the Auto-Renew status for your domain.

## Billing information

Domain registrations will not appear in the **Active Subscriptions** section of the dashboard, as Registrar is not subscription based. To check information related to your domain billing:

1. In the Cloudflare dashboard, go to the **Manage Domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain you want to check and select **Manage**.

3. Refer to **Registration** for information regarding your domain fees. From here, you can also opt to [renew or extend](https://developers.cloudflare.com/registrar/account-options/renew-domains/) your domain registration.

## Edit WHOIS records

Cloudflare redacts WHOIS information from your domain by default. However, we do store the authentic WHOIS record for your domain. You may edit the WHOIS contact data for any domain. To do that:

1. In the Cloudflare dashboard, go to the **Manage Domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain you want to edit and select **Manage** > **Contacts**.

3. Select **Edit** in any of the contacts you previously set up. This allows you to update the contact information for the selected domain only. It will not update the contact information for other domains within the account.

Refer to [Registrant contact updates](https://developers.cloudflare.com/registrar/account-options/domain-contact-updates/) for more information.

## Edit Default Contact information

The first time you transfer or register a new domain, a Cloudflare Registrar creates a Default Contact with information that can be used for future transfers and registrations. The contact data may be updated at any time in the dashboard. Updating the Default Contact data will not update the contact information for any domains already in the account. This Default Contact data is only used to prepopulate contact information for new registrations and transfers.

It is important that you keep this information accurate and up-to-date. Refer to [Registrant contact updates](https://developers.cloudflare.com/registrar/account-options/domain-contact-updates/) for important information about this topic, and to learn how to update this information.

## Delete a domain registration

Domains using Cloudflare Registrar will be deleted automatically after expiration if they have not been renewed. The exact timing varies, refer to [What happens when a domain expires?](https://developers.cloudflare.com/registrar/faq/#what-happens-when-a-domain-expires) for more details.

Deletion is irreversible

Deleting a domain registration from Cloudflare Registrar starts an irreversible process. At the end of that process, the domain will be available for anyone to purchase at any domain registrar. This means you should only delete your registration if you are comfortable losing it. If you intend to keep the domain but use another registrar, refer to [Transfer domain from Cloudflare to another registrar](https://developers.cloudflare.com/registrar/account-options/transfer-out-from-cloudflare/).

There may be instances where users may wish to delete a domain prior to expiration. In most cases a domain may be deleted prior to expiration by following these steps:

1. In the Cloudflare dashboard, go to the **Manage Domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Under the **Configuration** tab on the Manage page you will find a **Delete** button.

3. If the domain is deletable the button will be active. The button will be disabled if your domain cannot be deleted and you should refer to the Registrar [FAQ](https://developers.cloudflare.com/registrar/faq/#why-am-i-unable-to-delete-my-registrar-domain).

4. Once you click the Delete button, you will be presented with a confirmation window. If you proceed, an email will be sent to all users with the Super Admin role in the account. The email contains a deletion authorization token that must be entered into the window which appears to confirm and complete the deletion.

Once all steps are completed, the domain will then be scheduled for deletion. To understand more about the timelines and potential reasons why a domain cannot be deleted, refer to the Registrar [FAQ](https://developers.cloudflare.com/registrar/faq/#domain-deletions).

<page>
---
title: iCloud Custom Email Domains · Cloudflare Registrar docs
description: With iCloud Custom Email Domain, you can now purchase a custom
  domain right from iCloud Settings through Cloudflare and have it automatically
  set up with your iCloud Mail account. It's great if you want to create a
  custom email domain for you or your family, such as @examplefamily.com.
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/icloud-domains/
  md: https://developers.cloudflare.com/registrar/account-options/icloud-domains/index.md
---

With [iCloud Custom Email Domain](https://support.apple.com/kb/HT212514), you can now purchase a custom domain right from iCloud Settings through Cloudflare and have it automatically set up with your iCloud Mail account. It's great if you want to create a custom email domain for you or your family, such as @examplefamily.com.

You will need an active iCloud+ subscription to add a custom email domain.

## Purchase custom email domain

If you want to buy a custom email domain, go to your [iCloud](https://www.icloud.com/settings/) settings and scroll down to **Custom Email Domain**.

## Log in to Cloudflare

Once you have bought a custom email domain, you can manage your domain and other options through the [Cloudflare Dashboard](https://dash.cloudflare.com/login).

### Signing in with Apple

If you had signed up with Apple, signing into Cloudflare is as easy as clicking the “Sign in with Apple” button.

### Signing in with Cloudflare

If you had signed up with Cloudflare, signing into Cloudflare can be done with your email and password.

## Billing information

### Supported payment methods

For domain registration, Cloudflare supports the following payment methods:

* Credit Card
* PayPal
* Apple Pay (available if you have a wallet with a valid payment method and are using an iOS device or Safari on macOS)

For domain renewals, Apple Pay does not currently support recurring payments. You can either add another payment method (Credit Card or PayPal) for automatic renewals or log into [your account](#log-in-to-cloudflare) near the renewal date and use Apple Pay.

### Local currency price estimates

Users may see a price estimate in both U.S. Dollars and a local currency. This is only an estimate based on the current exchange rate.

The final payment will be charged in US dollars.

If you are not receiving emails intended for your new email address, review your DNS records in the Cloudflare dashboard:

1. Log into the [Cloudflare dashboard](#log-in-to-cloudflare).
2. Go to **DNS**.
3. Your domain should have records similar to the following:

![Your iCloud custom email domain should have a specific set of records created by default.](https://developers.cloudflare.com/_astro/icloud-custom-domain-dns-example.DXfRAhRV_Zk6ejy.webp)

If your domain has records similar to those listed above and you are still experiencing problems with your new email address, contact [Apple Support](https://support.apple.com/).

If you try to visit your new domain, your browser will show an error or empty page.

That's because there's more to setting up a website than purchasing a domain name (which you just did) and setting up email records (which we just did for you).

If you want your domain to be a fully functioning website, you will need to:

1. **Build your website**: Either using [Cloudflare Pages](https://developers.cloudflare.com/pages/), a website builder, or files hosted on a server.
2. **Update your Cloudflare DNS**: To direct visitors looking for your domain name to the actual content on your website ([detailed guide](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-zone-apex/)).

After you buy a domain through iCloud, Cloudflare Registrar automatically enables a landing page for it. This temporary page informs your visitors that you still do not have a website. This feature is only available to new domain registrations, when you buy a domain through an Apple device.

### Disable Landing Page

If you do not want to have Landing Page enabled:

1. In the Cloudflare dashboard, go to the **Manage domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain you want to disable Landing Page for, and select **Manage** > **Configuration**.

3. Scroll to Landing Page and select **Disable**.

You now have Landing Page disabled. The page can also be re-enabled through the same process.

Customers must disable the landing page before they can add DNS records to point to a new website.

<page>
---
title: Move a Cloudflare Registrar domain registration between accounts ·
  Cloudflare Registrar docs
description: Cloudflare supports the move (transfer) of domain registrations
  between Cloudflare accounts when the source and target account both confirm
  the move. The move will result in the loss of all configurations and settings
  for the domain in the source account.
lastUpdated: 2025-05-29T18:16:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/inter-account-transfer/
  md: https://developers.cloudflare.com/registrar/account-options/inter-account-transfer/index.md
---

Cloudflare supports the move (transfer) of domain registrations between Cloudflare accounts when the source and target account both confirm the move. The move will result in the loss of all configurations and settings for the domain in the source account.

This process only applies to domains which are registered with Cloudflare Registrar. For domains with other registrars, refer to [Move a domain between Cloudflare accounts](https://developers.cloudflare.com/fundamentals/manage-domains/move-domain/).

Before proceeding, please be aware of the following:

* WHOIS contact information will be moved as is.
* No other configuration will be moved.
* After successful move, the registration will be transfer-locked for 30 days.
* The target account will become responsible for domain renewals going forward.

## 1. Prepare for the move

Before you request the move, you will need to do the following:

* Obtain the [account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/) of the new account.
* Add the domain as a website to the new account and select a plan.
* [Disable DNSSEC](https://developers.cloudflare.com/dns/dnssec/#disable-dnssec) for the domain and ensure it is set up and ready in the new dashboard account you intend to move it to.

The following pre-conditions must be met before the domain can be moved:

* The domain must be added to the new account as a website and a plan must be selected.
* The domain must not be administratively locked, such as being locked due to a dispute or court order.
* The domain must not have any of the following registry statuses: `pendingDelete`, `redemptionPeriod`, or `pendingTransfer`.
* The registrant email address must be verified.
* A pending Change of Registrant request cannot be present. If there is a pending request, it should be completed before initiating the move request.
* DNSSEC must be turned off. It can be re-enabled on the new zone once the move completes.
* If the current zone is locked, the lock must be released.

## 2. Submit the move request

You can now submit the move request under the **Configuration** tab of the **Manage Domain** page. Begin the submission process by selecting the **Start** button and follow the instructions.

**Important**: Review the pre-conditions described above. If those conditions have not been met, the domain move will not be completed.

Once the move request has been submitted, the gaining account will receive an email notifying them of the request and will provide instructions for how to approve the request.

The gaining account must log into their account and go to **Manage Domains** (under Domain Registration). A message will appear at the top of the page stating that there are domains requiring action to be taken.

Select **View Actions** to display the domains with a pending move along and choose to accept or reject the request. Action must be taken within five days of the request.

If no action is taken within the five days, the request will be automatically canceled.

<page>
---
title: Renew domains with Cloudflare Registrar · Cloudflare Registrar docs
description: Cloudflare Registrar enrolls your domain to auto-renew by default.
  Unlike other registrars, your domain will only renew at the list price set by
  the registry. When a domain has the auto-renew setting turned on, Cloudflare
  will attempt to automatically renew the domain prior to expiration.
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/renew-domains/
  md: https://developers.cloudflare.com/registrar/account-options/renew-domains/index.md
---

## Automatic renewal of domain

Cloudflare Registrar enrolls your domain to auto-renew by default. Unlike other registrars, your domain will only renew at the list price set by the registry. When a domain has the auto-renew setting turned on, Cloudflare will attempt to automatically renew the domain prior to expiration.

There is no guarantee that the renewal will succeed. Renewals may fail for various reasons, including billing failures and registry downtime. While Cloudflare will make several attempts to renew, it is strongly recommended you frequently review your account to ensure your domains have been renewed.

If you decide you no longer need the domain, [disable auto-renew for your domain](#set-up-automatic-renewals). Once disabled, your domain will not renew upon expiration.

The first auto-renew attempt will occur approximately 30 days prior to expiration. If you wish to disable auto-renew, do so at least 30 days prior to the expiration date.

You can continue to keep your domain registered with Cloudflare for the time remaining until the expiration date. If you decide you want to keep the domain, enable auto-renew at any time prior to expiration.

## Set up automatic renewals

If you want your domains to renew automatically, keep the default settings for your domain (**Auto Renew** should be set to **On**). To find this setting:

1. In the Cloudflare dashboard, go to the **Manage domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain you want to automatically renew, and make sure the **Auto-renew** toggle is enabled.

Cloudflare attempts to renew these domains automatically 30 days before their expiration date. Several more attempts are made if the first attempt fails. The last attempt to renew is made on the day before expiration. You can also [manually renew](#renew-a-domain-manually) a domain at any time.

If multiple domains are auto-renewed on the same date, only one charge will be made to the primary payment method.

If the renewal fails, you will receive an email notification and Cloudflare will try to renew the domain three additional times. If these attempts fail, you must manually renew your domain.

If you want to delete your domain from Cloudflare, **disable** Auto-Renew first.

## Renew a domain manually

You can renew a domain at any time. To renew a domain registered with Cloudflare:

1. In the Cloudflare dashboard, go to the **Manage domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain you want to renew and select **Manage**.

3. In **Registration** select **Renew/Extend Domain**.

4. In the **Renew for** drop-down menu, choose a number of years to renew your domain (up to 10 years).

5. Select **Renew** and then **Purchase**.

Once Cloudflare validates your payment, the status of your domain changes to **Renewal Pending**. After the renewal is finished, the status changes back to **Active**.

## Renewal notifications

Once a domain is registered, Registrar sends the following expiration notices to the Super Admin of the domain:

* A monthly email listing all domains set to renew automatically within the next 45 days.
* A monthly email listing all domains expiring in the next 60-90 days.

In addition to the Super Admin, the following expiration notices are sent to the WHOIS Registrant contact associated with the domain:

* A weekly email listing all domains expiring within the next month.
* A daily email listing all domains expiring in seven days.
* An email one day after a domain expires.
* An email 20 days after the expiration date.

If you do not renew your domain before the expiration date, your domain will enter a Redemption Grace Period (RGP) for 30 days. These domains are not deleted and you can restore them to your account, but restoration may require an additional fee. You cannot transfer domains during the RGP.

All renewals are final and Cloudflare will not issue refunds.

When renewing a domain, additional years are always added to the current expiration date regardless of when the renewal takes place.

<page>
---
title: Transfer domain from Cloudflare to another registrar · Cloudflare
  Registrar docs
description: "Cloudflare Registrar makes it easy to transfer your domain to
  another registrar. Be aware that ICANN rules prohibit a domain from being
  transferred if:"
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/transfer-out-from-cloudflare/
  md: https://developers.cloudflare.com/registrar/account-options/transfer-out-from-cloudflare/index.md
---

Cloudflare Registrar makes it easy to transfer your domain to another registrar. Be aware that ICANN rules prohibit a domain from being transferred if:

* The domain has been transferred within the last 60 days;
* The domain was registered within the last 60 days;
* If the WHOIS registrant information has been modified in the last 60 days (even if redacted).

Follow the instructions below to transfer your domain out from Cloudflare.

Anyone with super-admin and admin permissions for a zone can also manage your domains. This means these users can also unlock domains or obtain authorization codes to transfer domains to other registrars. Be careful who you give these account roles to.

## 1. Unlock your domain at Cloudflare

1. In the Cloudflare dashboard, go to the **Manage Domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain you want to transfer, and select **Manage**.

3. Select **Configuration** > **Unlock**.

4. Select **Confirm and Unlock** to confirm that you want to unlock your domain.

5. Copy the auth code (also referred to as authentication code and authorization code) generated by Cloudflare, and use at your new registrar.

If you lose your authentication code, you can get a new one by:

* Selecting the **Regenerate** button;
* Locking the domain and repeating steps 1-6.

## 2. Transfer to a new registrar

1. Go to your new registrar.
2. You will be asked for the authorization code from Cloudflare (it might be called EPP in some systems). Input the code created for you from the Cloudflare dashboard.
3. Your new registrar will send the transfer request to the registry for your domain. The registry will then send it to Cloudflare. After Cloudflare receives the message, you can manually approve the transfer to initiate it immediately.
4. You will need to confirm the approval. You can also reject it at this stage. If you reject it, Cloudflare will reapply the registrar lock.
5. If you do not manually approve the transfer, the transfer will auto-approve on the fifth day after receiving the request. In either case, when your transfer out completes Cloudflare will remove the domain from your account and you will not be charged for future renewals.

<page>
---
title: WHOIS redaction · Cloudflare Registrar docs
description: Cloudflare Registrar provides personal data redaction on WHOIS
  information, if permitted by the registry.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/account-options/whois-redaction/
  md: https://developers.cloudflare.com/registrar/account-options/whois-redaction/index.md
---

Cloudflare Registrar provides personal data redaction on WHOIS information, if permitted by the registry.

WHOIS is a standard for publishing the contact and nameserver information for all registered domains. Each registrar maintains their own WHOIS service. Anyone can query the registrar’s WHOIS service to reveal the data behind a given domain.

However, broadcasting the registrant contact information via the WHOIS service can cause spam mail to be delivered to your personal addresses. Cloudflare Registrar offers personal data redaction on WHOIS for free, that meets current ICANN guidelines.

Cloudflare’s WHOIS service can be found at <https://rdap.cloudflare.com/>. Select **WHOIS** as the search type.

## What is WHOIS redaction?

WHOIS redaction removes most contact information categorized as personal data (such as registrant name, email address, postal address) from the published WHOIS record for a domain. These fields will read `Data Redacted`. The nameserver, domain lock information, and date records for a domain are still available publicly. The following fields will continue to show in WHOIS, due to ICANN policy:

* Registrant state/province
* Registrant country

Cloudflare still maintains the authoritative, unredacted, record of your WHOIS data. You can modify this information at any time. Refer to [Registrant contact updates](https://developers.cloudflare.com/registrar/account-options/domain-contact-updates) for more information.

RDAP (Registration Data Access Protocol) is a new standard for querying domain contact and nameserver information for all registered domains. This new protocol offers some advantages over WHOIS, including standardized data access, support for internationalization, and secure access controls. RDAP is intended to eventually replace WHOIS. However, Cloudflare currently provides both WHOIS and RDAP search capability.

Cloudflare’s RDAP service can be found at <https://rdap.cloudflare.com/>. Select **RDAP** as the search type.

## How can third parties reach registrants?

As part of the ICANN guidelines, registrars must have a method for third parties to reach the registrant without revealing their identity. Cloudflare has a form available where third parties can [submit a message for a given domain on Cloudflare Registrar](https://www.cloudflare.com/abuse/form). Cloudflare will forward the message to the registrant email on file for that domain.

<page>
---
title: Domain Name System Security Extensions (DNSSEC) · Cloudflare Registrar docs
description: The domain name system (DNS) translates domain names into numeric
  Internet addresses. However, DNS is a fundamentally insecure protocol. It does
  not guarantee where DNS records come from and accepts any requests given to
  it.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/get-started/enable-dnssec/
  md: https://developers.cloudflare.com/registrar/get-started/enable-dnssec/index.md
---

The domain name system (DNS) translates domain names into numeric Internet addresses. However, DNS is a fundamentally insecure protocol. It does not guarantee where DNS records come from and accepts any requests given to it.

[DNSSEC](https://developers.cloudflare.com/dns/dnssec/) creates a secure layer to the domain name system by adding cryptographic signatures to DNS records. By doing so, your request can check the signature to verify that the record you need comes from the authoritative nameserver and was not altered along the way.

## Enable or disable DNSSEC

Cloudflare Registrar offers one-click DNSSEC activation for free to all customers:

1. In Cloudflare dashboard, go to the **Manage Domains** page.

[Go to **Manage domains**](https://dash.cloudflare.com/?to=/:account/registrar/domains)

2. Find the domain that you want to activate DNSSEC and select **Manage**.

3. Select **Configuration** > **Enable DNSSEC**. If DNSSEC was previously activated, select **Disable DNSSEC** to disable it.

Cloudflare publishes delegation signer (DS) records in the form of [CDS and CDNSKEY records](https://www.cloudflare.com/dns/dnssec/how-dnssec-works/) for a domain delegated to Cloudflare. Cloudflare Registrar scans those records at regular intervals, gathers those details and sends them to your domain's registry.

This process can take one to two days after you first enable DNSSEC.

If your domain is not on Cloudflare Registrar, you can enable DNSSEC in [**DNS**](https://developers.cloudflare.com/dns/dnssec/) on the Cloudflare dashboard.

When DNSSEC has been successfully applied to your domain, Cloudflare shows you a confirmed status. Go to [**DNS** > **Settings**](https://dash.cloudflare.com/?to=/:account/:zone/dns/settings) in the Cloudflare dashboard, and scroll down to **DNSSEC**.

You can also confirm this by reviewing the [WHOIS information](https://lookup.icann.org/) for your domain. Domains with DNSSEC will read `signedDelegation` in the DNSSEC field.

<page>
---
title: Register a new domain · Cloudflare Registrar docs
description: The registration process may take up to 30 seconds to complete.
  Once the registration is complete, the browser will navigate to the domain
  management page where you may update the contacts, change the auto-renew
  settings, and add additional years to the term. You will also receive a
  confirmation email regarding your new domain registration.
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/get-started/register-domain/
  md: https://developers.cloudflare.com/registrar/get-started/register-domain/index.md
---

## Prerequisites and restrictions

* Cloudflare Registrar is only available for customers that use Cloudflare as their authoritative DNS provider (also known as a [full setup](https://developers.cloudflare.com/dns/zone-setups/)).
* Cloudflare Registrar does not currently support internationalized domain names (IDNs), also known as Unicode.
* You must have a [verified account email address](https://developers.cloudflare.com/fundamentals/user-profiles/verify-email-address/), to transfer or register domains.

## How to register a new domain

If you are registering a `.us` domain, refer to the [Additional requirements for .US domains](https://developers.cloudflare.com/registrar/top-level-domains/us-domains/) before proceeding.

1. In the Cloudflare dashboard, go to the **Register domains** page.

[Go to **Register domains**](https://dash.cloudflare.com/?to=/:account/registrar/register)

2. In the search box, enter the domain name you wish to register, and select **Search**. You may also enter one or more keywords. The search results will contain a list of suggested domains. If the domain you entered does not appear in the list, this means it is not available for registration.

Cloudflare Registrar currently does not support internationalized domain names (IDNs), also known as unicode. For that reason, you cannot search for words with special characters, such as `à`, `ü`, `ç`, among others.

1. Select **Purchase** on the domain you wish to register. In rare instances, a domain that is not available for registration may appear in the search results. After selecting **Purchase**, a definitive availability check will be performed to confirm that the domain is actually available for registration.

2. Select the term (number of years) you wish to register the domain from the **Payment option** drop-down menu. Most top-level domains (TLDs) can be registered for a maximum of ten years. Some TLDs may have different term limits and these will be reflected in the drop-down options.

The expiration date and price will update automatically based on the term selected. The **Renew On** date is the date that the system will attempt to auto-renew the domain. All registrations have Auto-renew turned on by default. However, you may [disable this option](https://developers.cloudflare.com/registrar/account-options/renew-domains/) at any time.

3. Enter the contact details for the domain. These details will be used to create all of the required contacts (Registrant, Admin, Technical, and Billing), and may be updated after registration is completed. Refer to [Contact requirements](#contact-requirements) to learn the specific requirements for each contact field.

If you have previously registered or transferred a domain name, the form will be filled in advance with the information from your default contact. If not, you will need to fill out the form.

It is important that you provide complete and accurate contact information. If you do not follow this recommendation, the domain registration may be suspended and/or canceled.

1. In **Payment**, select which type of payment you want to use. If you already have a billing profile, Cloudflare uses this information to automatically fill the form. If there is no billing profile, you need to enter your payment information.

2. Review the terms and conditions, including the Domain Registration Agreement, Self-serve Subscription Agreement, and the Privacy Policy.

3. Select **Complete purchase** to continue. By selecting **Complete purchase**, you acknowledge that you are accepting the terms of the agreements.

The registration process may take up to 30 seconds to complete. Once the registration is complete, the browser will navigate to the domain management page where you may update the contacts, change the auto-renew settings, and add additional years to the term. You will also receive a confirmation email regarding your new domain registration.

## Contact requirements

At this time, you can only use ASCII characters for contact data. If the default contact has non-ASCII characters, you will need to update the domain contact details before proceeding. Cloudflare recommends that you update your default contact information to include ASCII characters only.

| Field | Required? | Restrictions |
| - | - | - |
| First Name | Yes | Minimum of two letters. |
| Last Name | Yes | Minimum of two letters. |
| Email | Yes | Must be a properly formatted email address. |
| Organization | No | Optional for most TLDs. In some cases, the Organization field may be populated by default with data from First and Last names. |
| Phone number | Yes | Must select a valid country code from the drop-down options. Only numbers will be accepted in the phone number field. |
| Ext | No | Only numbers may be entered. |
| Address 1 | Yes | May not be all numeric. |
| Address 2 | No | - |
| City | Yes | - |
| State | Yes | - |
| Country | Yes | You must select one from the drop-down options. |
| Postal Code | Yes | Must be a properly formatted postal code. |

When you register a domain with Cloudflare, your personal information is redacted when permitted by the registry. Refer to [WHOIS redaction](https://developers.cloudflare.com/registrar/account-options/whois-redaction/) for more information.

To improve the security of your domain, enable [Domain Name System Security Extensions](https://developers.cloudflare.com/registrar/get-started/enable-dnssec/) to create a secure layer with a cryptographic signature.

<page>
---
title: Transfer your domain to Cloudflare · Cloudflare Registrar docs
description: This page contains generic instructions on how to transfer your
  domain to Cloudflare.
lastUpdated: 2025-10-09T15:47:46.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/
  md: https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/index.md
---

Transferring your domain to Cloudflare tells your registry that a different registrar can now set those authoritative records for you. The relationship is based on trust. Registries only trust one registrar at any given time to make changes on your behalf.

Transferring a domain to a new registrar informs the registry that they should instead trust that new registrar to modify information. The process requires some action steps at your new and previous registrar. Each registrar handles transfers a bit differently, but in general, they follow a pattern based on rules set by ICANN, the organization responsible for regulating domain registration.

Most domain transfers add one additional year to your current registration term. After the transfer, your domain registration will be set to auto-renew by default.

This page contains generic instructions on how to transfer your domain to Cloudflare from most registrars.

All domains using Cloudflare Registrar must use Cloudflare for authoritative DNS on a [full setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/)[1](#user-content-fn-1). This means [onboarding your domain](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) by [updating your nameservers](https://developers.cloudflare.com/dns/nameservers/update-nameservers/) to your assigned Cloudflare nameservers. You cannot change to another DNS provider's nameservers while using Cloudflare Registrar.

1. Meaning Cloudflare is your primary, authoritative DNS provider. [↩](#user-content-fnref-1)

## Before transferring a domain to Cloudflare

* Create [a Cloudflare account](https://developers.cloudflare.com/fundamentals/account/create-account/).
* [Add the domain](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) you are transferring to your Cloudflare account.
* [Review your DNS records](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/#review-dns-records) in the Cloudflare dashboard.
* If needed, plan for [DNSSEC disablement](#disable-dnssec).
* [Change your DNS nameservers](https://developers.cloudflare.com/dns/zone-setups/full-setup/) to Cloudflare.
* If initiating multiple transfers, notify your financial institution to prevent them from flagging these charges as fraudulent.
* Renew your domain if it is within 15 days of expiration.
* Do not make any changes to the Registrant contact information. Updating the Registrant contact may result in your current registrar locking the domain for 60 days.
* Make sure your account has a valid credit card on file.
* If you are transferring a `.us` domain, refer to the [Additional requirements for .US domains](https://developers.cloudflare.com/registrar/top-level-domains/us-domains/) before proceeding.

If you are onboarding an existing domain to Cloudflare, make sure DNSSEC **is disabled** at your registrar. Otherwise, your domain will experience connectivity errors when you change your nameservers.

1. Take note of the TTL value for the DS record at your current registrar.

2. Remove DS records at your current registrar.

Provider-specific instructions

This is not an exhaustive list of how to update DS records in other providers, but the following links may be helpful:

* [DNSimple](https://support.dnsimple.com/articles/cloudflare-ds-record/)
   * [Domaindiscount24](https://support.domaindiscount24.com/hc/articles/4409759478161)
   * [DreamHost](https://help.dreamhost.com/hc/en-us/articles/219539467)
   * [Dynadot](https://www.dynadot.com/help/question/set-DNSSEC)
   * [Enom](https://support.enom.com/support/solutions/articles/201000065386)
   * [Gandi](https://docs.gandi.net/en/domain_names/advanced_users/dnssec.html)
   * [GoDaddy](https://www.godaddy.com/en-ph/help/add-a-ds-record-23865)
   * [Hostinger](https://www.hostinger.com/support/3667267-how-to-use-dnssec-records-at-hostinger/)
   * [Hover](https://support.hover.com/support/solutions/articles/201000064716)
   * [InMotion Hosting](https://www.inmotionhosting.com/support/edu/cpanel/enable-dnssec-cloudflare/)
   * [INWX](https://kb.inwx.com/en-us/3-nameserver/131)
   * [Joker.com](https://joker.com/faq/books/jokercom-faq-en/page/dnssec)
   * [Name.com](https://www.name.com/support/articles/205439058-managing-dnssec)
   * [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9722/2232/managing-dnssec-for-domains-pointed-to-custom-dns/)
   * [NameISP](https://support.nameisp.com/knowledgebase/dns)
   * [Namesilo](https://www.namesilo.com/support/v2/articles/domain-manager/ds-records)
   * [OVH](https://help.ovhcloud.com/csm/en-dns-secure-domain-dnssec?id=kb_article_view\&sysparm_article=KB0051637)
   * [Squarespace](https://support.squarespace.com/hc/articles/4404183898125-Nameservers-and-DNSSEC-for-Squarespace-managed-domains#toc-dnssec)
   * [Registro.br](https://registro.br/tecnologia/dnssec/?secao=tutoriais-dns)
   * [Porkbun](https://kb.porkbun.com/article/93-how-to-install-dnssec) (do not fill out **keyData**)
   * [TransIP](https://www.transip.eu/knowledgebase/150-secure-domains-custom-nameservers-dnssec/)

3. Wait at least the time corresponding to the DS record TTL. It is usually 24 hours, but refer to the value you got in step 1.

4. Follow the steps to [transfer your domain](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/#set-up-a-domain-transfer) to Cloudflare Registrar.

5. [Enable DNSSEC](https://developers.cloudflare.com/dns/dnssec/#1-activate-dnssec-in-cloudflare) at Cloudflare. This will automatically add your DS to the zone parent via Cloudflare Registrar.

Why you have to disable DNSSEC

When your domain has [DNSSEC enabled](https://www.cloudflare.com/learning/dns/dns-security/#what-is-dnssec), your DNS provider digitally signs all your DNS records. This action prevents anyone else from issuing false DNS records on your behalf and redirecting traffic intended for your domain.

However, having a single set of signed records also prevents Cloudflare from issuing new DNS records on your behalf (which is part of using Cloudflare for your authoritative nameservers). So if you change your nameservers without disabling DNSSEC, DNSSEC will prevent Cloudflare's DNS records from resolving properly.

To transfer your domain, it must meet the following requirements:

* ICANN rules prohibit a domain from being transferred if it has been registered or previously transferred within the last 60 days or if the WHOIS Registrant contact information was modified in the last 60 days (even if redacted).

* Your account at your current registrar must be active. If your domain has expired, you may be able to transfer the domain. If the domain is in the `RedemptionPeriod` you will likely need to restore the domain first before the transfer can proceed.

The transfer of an expired domain may result in an additional year NOT being added during the transfer.

* Your domain cannot be an internationalized domain name (IDNs) as Cloudflare does not currently support them. These domains are also known as unicode.

* Domains that have a status of `serverHold`, `serverTransferProhibited`, `pendingDelete`, `pendingTransfer`, or `RedemptionPeriod` may not be transferred.

* Domains that have a status of `clientTransferProhibited` (Transfer Lock) will not show as available for transfer. You will have to unlock the domain at your current registrar before being able to proceed.

If your domain is listed as available for transfer in the Cloudflare dashboard, these restrictions have already been checked.

## Set up a domain transfer

To begin, complete the following steps in your current registrar to transfer your domain to Cloudflare. Below, you will find links for detailed transfer instructions from some of the most popular registrars:

* [Enom](https://support.enom.com/support/solutions/articles/201000065324-preparing-your-domain-for-transfer)
* [GoDaddy](https://www.godaddy.com/help/transfer-my-domain-away-from-godaddy-3560)
* [Ionos by 1&1](https://www.ionos.com/help/domains/domain-transfers/#acc4514)
* [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/258/84/what-should-i-do-to-transfer-a-domain-from-namecheap/)
* [Network Solutions](https://www.networksolutions.com/help/article/transfer-out-of-network-solutions)
* [Squarespace](https://support.squarespace.com/hc/articles/205812338-Transferring-a-domain-away-from-Squarespace)

### 1. Log in to your registrar account

Log in to the registrar account where the domain is currently registered.

### 2. Unlock the domain

Registrars include a lightweight safeguard to prevent unauthorized users from starting domain transfers. This is known as registrar lock, but you might also see it referred to as domain lock. In WHOIS, it may appear as `clientTransferProhibited`. When enabled, the lock prevents any other registrar from attempting to initiate a transfer.

Only the registrant can enable or disable this lock, typically through the administration interface of the registrar. To proceed with a transfer, remove this lock if it is enabled.

### 3. Remove WHOIS privacy

In most cases, domains may be transferred even if WHOIS privacy services have been enabled. However, some registrars may prohibit the transfer if the WHOIS privacy service has been enabled.

### 4. Request an authorization code

Your new registrar needs to confirm with your old registrar that the transfer flow is authorized. To do that, your old registrar will provide an authorization code to you.

This code is often referred to as an authorization code, auth code, authinfo code, or transfer code. You will need to input that code to complete your transfer to Cloudflare. Cloudflare will use it to confirm the transfer is authentic.

### 5. Initiate your transfer to Cloudflare

From your Cloudflare Account Home, go to the **Transfer Domains** page.

[Go to **Transfer domains**](https://dash.cloudflare.com/?to=/:account/registrar/transfer)

Cloudflare Registrar will display the zones available for transfer.

You will be presented with the price for each transfer. When you transfer a domain, you are required by ICANN to pay to extend its registration by one year from the expiration date. You can remove domains from your transfer by selecting **x**.

If you do not have a payment method on file, add one at this step before proceeding.

You will not be billed at this step. Cloudflare will only bill your card when you input the auth code and confirm the contact information at the conclusion of your transfer request.

In some cases, premium (non-standard priced) domains may not be detected immediately. Pricing will be confirmed with the registry before submission, and you will have the opportunity to review and approve any price adjustments.

In most cases, transferring a domain adds one additional year to its registration term. However, the following exceptions apply:

* Transferring a `.uk` domain does not extend its registration by an additional year.
* If the transfer is completed within 45 days of the domain's expiration, the extra year may not be added. This is determined by the domain's Registry.
* If the domain already has more than nine years remaining, a full year may not be added. This is also subject to Registry policy.

Sites can be unavailable to transfer for a few reasons, including:

* You did not [add your domain](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) to your Cloudflare.
* The site was registered in the last 60 days.
* Cloudflare does not yet support the TLD.
* The domain has a status that does not allow for a transfer.
* You failed to follow the steps highlighted above in [creating an account with your domain](https://developers.cloudflare.com/fundamentals/account/create-account/) and [changing your DNS nameservers to Cloudflare](https://developers.cloudflare.com/dns/zone-setups/full-setup/).

If you have an [unverified account email address](https://developers.cloudflare.com/fundamentals/user-profiles/verify-email-address/), you will not be able to transfer or register domains. Verify your account email address before proceeding.

### 6. Input your authorization code

In the next page, input the authorization code for each domain you are transferring. You also need to unlock each domain so that Cloudflare can process your request. For more information, refer to the instructions provided by your [current registrar on how to transfer your domain](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/#set-up-a-domain-transfer).

### 7. Confirm or input your contact information

In the final stage of the transfer process, input the contact information for your registration. Cloudflare Registrar redacts this information by default but is required to collect the authentic contact information for this registration. It is important that you provide accurate WHOIS contact information. You may be required to verify the contact information. Failure to provide accurate information and/or failure to verify the information may result in suspension or deletion of your domain.

You can always [modify the contact information](https://developers.cloudflare.com/registrar/account-options/domain-contact-updates/) later, if needed.

After entering the contact information, agree to the domain registration terms of service by selecting **Confirm transfer**.

### 8. Approve the transfer

Once you have requested your transfer, Cloudflare will begin processing it, and send a Form of Authorization (FOA) email to the registrant, if the information is available in the public WHOIS database. The FOA is what authorizes the domain transfer.

After this step, your previous registrar will also email you to confirm your request to transfer. Most registrars will include a link to confirm the transfer request. If you select that link, you can accelerate the transfer operation. If you do not act on the email, the registrar can wait up to five days to process the transfer to Cloudflare. You may also be able to approve the transfer from within your current registrar dashboard.

Registrants transferring a `.us` domain will always receive a FOA email.

## Bulk domain transfers

The process for transferring domains in bulk to Cloudflare is the same process as transferring a single domain. Even if you transfer multiple domains in bulk, you will be charged for each domain as bulk billing is not yet available.

You can check the status of your transfer in **Account Home** > **Overview** > **Domain Registration** for your domain. Below, you can find a list of the possible transfer statuses.

* **Transfer in progress**: Your request has been submitted by Cloudflare to your previous registrar. Cloudflare is now waiting on them to confirm they have received the request. If this status persists for more than a day (24 hours), ensure that the domain has been unlocked at your current registrar and any WHOIS privacy services have been removed.

* **Pending approval**: Your current registrar has received the transfer request. They can now wait up to five days to release the domain. If you want to move faster, you can manually approve the transfer for immediate release in the dashboard of most registrars.

* **Transfer rejected**: your transfer has been rejected. This can occur if you canceled the request at your current registrar instead of approving it. If you still wish to transfer, you can select **Retry** and initiate a new transfer request.

As mentioned in [Review DNS records in Cloudflare](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/#review-dns-records), when moving your domain to Cloudflare Registrar, you might need to configure your DNS records to correctly point traffic to your web host. Cloudflare automatically scans for common records and adds them to your account's DNS page, but the scan is not guaranteed to find all existing DNS records.

Refer to your web host's documentation to learn what type of records you need to configure and where they should point, to avoid downtime.

For example, Netlify asks customers that host websites with them to add a `CNAME` record pointing `<YOUR-DOMAIN>` to `apex-loadbalancer.netlify.com`, and another `CNAME` record pointing `www` to `<YOUR-DOMAIN>.netlify.app`, depending on which one is the primary domain.

![An example of DNS management in Cloudflare's DNS dashboard](https://developers.cloudflare.com/_astro/dns-management.0LI9Ggoq_2X8BL.webp)

You may also want to [enable DNSSEC](https://developers.cloudflare.com/dns/dnssec/#1-activate-dnssec-in-cloudflare).

<page>
---
title: Learn how to manage a .UK domain with Cloudflare. · Cloudflare Registrar docs
description: "Cloudflare currently supports the transfer of .uk, co.uk, org.uk,
  and me.uk domains. To transfer a .uk domain to Cloudflare from another
  registrar follow these steps:"
lastUpdated: 2025-09-15T15:28:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/top-level-domains/uk-domains/
  md: https://developers.cloudflare.com/registrar/top-level-domains/uk-domains/index.md
---

## How to transfer a .UK domain to Cloudflare

Cloudflare currently supports the transfer of `.uk`, `co.uk`, `org.uk`, and `me.uk` domains. To transfer a `.uk` domain to Cloudflare from another registrar follow these steps:

1. In the Cloudflare dashboard, go to the **Transfer domains** page.

[Go to **Transfer domains**](https://dash.cloudflare.com/?to=/:account/registrar/transfer)

Cloudflare will show you a list of domains that are eligible for transfer (see below for restrictions). If you do not see your domain, [add the domain you want to transfer](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) to your Cloudflare account before you try to transfer your `.uk` domain. 2. Select the domains you wish to transfer. 3. Proceed to checkout. Note that there is no fee to transfer a `.uk` domain and an additional year is NOT added during the transfer process. 4. After checkout, request your current registrar to update the [IPS tag](https://en.wikipedia.org/wiki/Internet_Provider_Security) to `CLOUDFLARE`. If the transfer is not completed within 24 hours, ask your registrar again to update the IPS tag. The transfer will be automatically canceled if not completed within 30 days. 5. Cloudflare will receive a notice once your registrar updates the IPS tag. After that, we will finish transferring your domain.

If you request your current registrar to update the IPS tag before completing the checkout process, the transfer request will be automatically rejected. You must complete the checkout process before requesting the IPS tag update.

For security reasons, domains transferred to Cloudflare Registrar are locked for 60 days before they can be transferred out to another Registrar.

## Transfer a .UK domain to another registrar

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/login) and select your account.
2. Go to **Domain Registration** > **Manage Domains**.
3. Find the domain you want to transfer, and select **Manage**.
4. Select **Configuration** > **Unlock**.
5. Enter the IPS tag of the registrar you wish to transfer to.

Your new registrar is responsible for accepting the transfer. Cloudflare has no visibility into why a transfer might not be accepted by the new registrar.

If you do not know the IPS tag, contact your new registrar for instructions. Your new registrar may require you to follow some additional steps before starting the transfer process.

<page>
---
title: Learn how to manage a .US domain with Cloudflare. · Cloudflare Registrar docs
description: "If you want to register a .us domain, you must have a genuine
  connection to the United States as described in the usTLD Nexus Policy. When
  registering a domain name, registrants must identify the category under which
  they qualify for the usTLD Nexus Requirement:"
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/registrar/top-level-domains/us-domains/
  md: https://developers.cloudflare.com/registrar/top-level-domains/us-domains/index.md
---

## Registration requirements for .US domains

If you want to register a `.us` domain, you must have a genuine connection to the United States as described in the [usTLD Nexus Policy](https://www.about.us/policies). When registering a domain name, registrants must identify the category under which they qualify for the usTLD Nexus Requirement:

**C11**: A natural person who is a United States Citizen; or

**C12**: A natural person who is a permanent resident of the United States of America, or any of its possessions or territories.

**C21**: A U.S.-based organization or company formed within one of the fifty (50) U.S. states, the District of Columbia, or any of the United States possessions or territories, or organized or otherwise constituted under the laws of a state of the United States of America, the District of Columbia or any of its possessions or territories or a U.S. federal, state, or local government entity or a political subdivision thereof.

**C31**: A foreign entity or organization that has a bona fide presence in the United States of America or any of its possessions or territories who regularly engages in lawful activities, sales of goods or services or other business, commercial or non-commercial, including not-for-profit relations in the United States; or

**C32**: A foreign entity that has an office or other facility in the United States.

The nexus category information will be supplied to the .US registry. Failure to provide accurate information and/or to respond to requests for information may result in the suspension or cancellation of the domain registration.

### Application purpose

In addition to nexus information, registrants must also identify their intended use of the domain name. The possible options are:

* Personal use
* For-profit business
* Non-profit business or organization
* Government
* Education

### .US WHOIS requirements

The .US registry requires that domain contact data is displayed in the public WHOIS database. Redaction and/or use of WHOIS privacy services is prohibited. This is a registry policy that all registrars must comply with.

### .US domain transfers

Transferring a `.us` domain works in a similar way to other domains, but always requires approval via the Form of Authorization (FOA) email. You must select the approve link within five days for the transfer to proceed. If you do not respond, the transfer request will be cancelled.

Refer to [Transfer your domain to Cloudflare](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/) for more information.

<page>
---
title: Content Delivery Network (CDN) Reference Architecture · Cloudflare
  Reference Architecture docs
description: This reference architecture discusses the traditional challenges
  customers face with web applications, how the Cloudflare CDN resolves these
  challenges, and CDN architecture and design.
lastUpdated: 2025-10-13T13:40:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/cdn/
  md: https://developers.cloudflare.com/reference-architecture/architectures/cdn/index.md
---

Every day, users of the Internet enjoy the benefits of performance and reliability provided by [content delivery networks](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) (CDNs). CDNs have become a must-have to combat latency and a requirement for any major company delivering content to users on the Internet. While providing performance and reliability for customers, CDNs also enable companies to further secure their applications and cut costs. This document discusses the traditional challenges customers face with web applications, how the Cloudflare CDN resolves these challenges, and CDN architecture and design.

### Who is this document for and what will you learn?

This reference architecture is designed for IT or network professionals with some responsibility over or familiarity with their organization's existing infrastructure. It is useful to have some experience with technologies and concepts important to content delivery, including caching, DNS and firewalls.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

- What is a CDN? | [Website](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) (5 minute read)
- Analyst Report: [Cloudflare named Leader in 2024 GigaOm Radar for Content Delivery Networks](https://www.cloudflare.com/lp/gigaom-radar-cdn/) (20 minute read)

Those who read this reference architecture will learn:

* How Cloudflare CDN can significantly improve the delivery of content to your customers
* How anycast IP routing is important in ensuring reliable CDN performance
* The range of tiered caching options and how to choose the one for your needs

## Traditional challenges deploying web applications

Over the last several years, especially with the advent of the COVID-19 pandemic and the focus on remote work, there has been a significant growth in Internet traffic, further growing the need to efficiently manage network traffic, cut latency, and increase performance.

Companies running their applications in the cloud or on-premise are faced with the challenges of:

1. Implementing solutions to increase performance
2. As demand grows, scaling out their architecture to meet availability and redundancy concerns
3. Securing their environments and applications from growing Internet threats
4. Reining in growing costs related to doing all of the above

With companies serving customers across the globe, the above challenges require a significant undertaking. Traditionally, a website/application is deployed centrally and replicated to another region for availability, or the website/application is deployed across a handful of servers, sometimes across multiple data centers for resiliency.

The servers hosting the websites are called origin servers. When clients access a website, they make a request for resources from the server. Navigating to one website can generate hundreds of requests from the browser for HTML, CSS, images, videos, etc. With versions of HTTP prior to HTTP/2, each of these HTTP requests would also require a new TCP connection.

Enhancements in HTTP/2 and HTTP/3 allow for multiplexing multiple requests to the same server over a single TCP connection, thus saving server resources. However, compute and network resources are still consumed as servers respond to these requests. As more clients access the website, the following can result:

* The origin server starts to become overloaded with requests, impacting availability; companies start looking at scaling out to handle the additional load
* As each request has to make its way to the origin server, performance and user experience is impacted due to latency
* The latency for end users becomes proportional to the distance between the client and origin server, thus resulting in varying experiences based on client location. This is especially true for specific countries that may experience latency due to traffic from or to that country, like China.
* As origin servers respond to the increasing requests, bandwidth, egress, and compute costs increase drastically
* Even as customers scale out to handle the increased demand in traffic, they are left exposed to both infrastructure-level and application-level distributed denial-of-service (DDoS) attacks

In Figure 1 below, there is no CDN present and there is an origin server sitting in the US. As clients access the website, the first step is DNS resolution, typically done by the user’s ISP. The next step is the HTTP request sent directly to the origin server. The user experience will vary depending on their location. For example, you can see the latency is much lower for users in the US, where the origin server is located. For users outside the US, the latency increases, thus resulting in a higher round-trip time (RTT).

As more clients make requests to the origin server, the load on the network and server increases, resulting in higher latency and higher costs for resource and bandwidth use.

From a security perspective, the origin server is also vulnerable to DDoS attacks at both the infrastructure and application layer. A DDoS attack could be initiated from a botnet sending millions of requests to the origin server, consuming resources and preventing it from serving legitimate clients.

Further, in terms of resiliency, if the origin server temporarily goes offline, all content is inaccessible to users.

![Figure 1: Diagram of HTTP web requests between DNS and origin server without a CDN.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure1.BH2E9Wnc_Z2dhi1l.svg)

## How a CDN tackles web application challenges

A CDN helps address the challenges customers face around latency, performance, availability, redundancy, security, and costs. A CDN's core goal is to decrease latency and increase performance for websites and applications by caching content as close as possible to end users or those accessing the content.

CDNs decrease latency and increase performance by having many data center locations across the globe that cache the content from the origin. The goal is to have content cached as close as possible to users, so content is cached at the edge of the CDN provider's network.

* **Improved website load time**: Instead of every client making a request to the origin server, which could be located a considerable distance away, the request is routed to a local server that responds with cached content, thus decreasing latency and increasing overall performance. Regardless of where the origin server and clients are located, performance will be more consistent for all users, as the CDN will serve locally cached content when possible.

* **Increased content availability and redundancy:** Because every client request no longer needs to be sent to the origin server, CDNs provide not only performance benefits, but also availability and redundancy. Requests are load balanced over local servers with cached content; these servers respond to local requests, significantly decreasing overall load on the origin server. The origin server only is contacted when needed (when content is not cached or for dynamic non-cacheable content).

* **Improved website security:** A CDN acts as a reverse proxy and sits in front of origin servers. Thus it can provide enhanced security such as DDoS mitigation, improvements to security certificates, and other optimizations.

* **Reduced bandwidth costs:** Because CDNs use cached content to respond to requests, the number of requests sent to the origin server is reduced, thus also reducing associated bandwidth costs.

### Routing requests to CDN nodes

An important difference in some CDN implementations is how they route traffic to the respective local CDN nodes. Routing requests to CDN nodes can be done via two different methods:

**DNS unicast routing**

In this method, recursive DNS queries redirect requests to CDN nodes; the client’s DNS resolver forwards requests to the CDN’s authoritative nameserver. CDNs based on DNS unicast routing are not ideal in that clients may be geographically dispersed from the DNS resolver. Decisions on closest-proximity CDN nodes are based on the client's DNS server instead of client’s IP address. Also, if any changes are needed for the DNS response, there is a dependency on DNS time to live (TTL) expiration.

Further, since DNS routing uses unicast addresses, traffic is routed directly to a specific node, creating possible concerns when there are traffic spikes, as in a DDoS attack.

Another challenge with DNS-based CDNs is that DNS is not very graceful upon failover. Typically a new session or application must be started for the DNS resolver with a different IP address to take over.

The Cloudflare CDN, which is discussed in more detail in the next section, uses anycast routing. Anycast allows for nodes on a network to have the same IP address. The same IP address is announced from multiple nodes in different locations, and client redirection is handled via the Internet’s routing protocol, BGP.

Using an anycast-based CDN has several advantages:

* Incoming traffic is routed to the nearest data center with the capacity to process the requests efficiently.
* Availability and redundancy is inherently provided. Since multiple nodes have the same IP address, if one node were to fail, requests are simply routed to another node in close proximity.
* Because anycast distributes traffic across multiple data centers, it increases the overall surface area, thus preventing any one location from becoming overwhelmed with requests. For this reason, anycast networks are very resilient to DDoS attacks.

## Introducing the Cloudflare CDN

Cloudflare provides a Software as a Service (SaaS) model for CDN. With Cloudflare’s SaaS model, customers benefit from the Cloudflare CDN without having to manage or maintain any infrastructure or software.

The benefits of the Cloudflare CDN can be attributed to the below two points, discussed in more detail in this section.

1. CDNs inherently increase performance by caching content on servers close to the user
2. The unique Cloudflare architecture and integrated ecosystem

Figure 2 shows a simplified view of the Cloudflare CDN. Clients are receiving their response back from a server on Cloudflare’s global anycast network closest to where the clients are located, thus drastically reducing the latency and RTT. The diagram depicts a consistent end-user experience regardless of the physical location of the clients and origin.

![Figure 2 is a diagram representing the traffic between a client and a server on Cloudflare's global anycast network at different client locations.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure2.DP9jXMC9_ZzHUMS.svg)

## Cloudflare CDN architecture and design

Figure 3 is a view of the Cloudflare CDN on the global anycast network. In addition to using anycast for network performance and resiliency, the Cloudflare CDN leverages Tiered Cache to deliver optimized results while saving costs for customers. Customers can also [enable Argo Smart Routing](https://developers.cloudflare.com/argo-smart-routing/get-started/) to find the fastest network path to route requests to the origin server. These capabilities are discussed in detail in the remainder of this document.

![Figure 3: Diagram representing requests coming from an end user, protected by Cloudflare products including WAF and DDoS protection, and traveling through the anycast Network to reach the origin server using Smart Tiered Cache.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure3.CcIfEHZq_1mhfV1.svg)

In the above diagram, there are a few important key points to understand about the Cloudflare CDN and the global anycast network it resides on:

* An important differentiator is that Cloudflare utilizes one global network and runs every service on every server in every Cloudflare data center, thus providing end users the closest proximity to Cloudflare’s services, with the highest scale, resiliency, and performance.
* Cloudflare is a reverse proxy, meaning it receives requests from clients and proxies the requests back to the customer’s origin servers. Thus, every request traverses through Cloudflare’s network before reaching the customer’s network. Since Cloudflare has hardened and protected its infrastructure at the edge (ingress), all customers are consequently also protected from infrastructure-level and volumetric DDoS attacks. Requests and traffic must go through the protected Cloudflare network before reaching the customer’s origin server.
* The Cloudflare CDN leverages the Cloudflare global anycast network. Thus the incoming request is routed to and answered by the node closest to the user.
* The inherent benefits of anycast are decreased latency, network resiliency, higher availability, and increased security due to larger surface area for absorbing both legitimate traffic loads and DDoS attacks. Cloudflare’s global anycast network spans [hundreds of cities worldwide](https://www.cloudflare.com/network/), reaching 95% of the world’s Internet-connected population within 50 milliseconds while providing over 405 Tbps network capacity and DDoS protection capability.
* Edge nodes within the Cloudflare network cache content from the origin server and are able to respond to requests via a cached copy. Cloudflare also provides [DNS](https://developers.cloudflare.com/dns/), [DDoS protection](https://developers.cloudflare.com/ddos-protection/), [WAF](https://developers.cloudflare.com/waf/), and other performance, reliability, and security services using the same edge architecture.
* [Argo](https://developers.cloudflare.com/argo-smart-routing/) uses optimized routing and caching technology across the Cloudflare network to deliver responses to users more quickly, reliably, and securely. Argo includes Smart Routing and [Tiered Cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/). Cloudflare leverages Argo to provide an enhanced CDN solution.

Once a site is onboarded, standard caching is configured by default. With standard caching, each data center acts as a direct reverse proxy for the origin servers. A cache miss in any data center results in a request being sent to the origin server from the ingress data center.

Although standard caching works, it is not the most optimal design — cached content closer to the client may already exist in other Cloudflare data centers, and origin servers are sometimes unnecessarily overloaded as a result. Thus, it is best to enable Tiered Cache, which is included with every Cloudflare plan. With Tiered Cache, certain data centers are reverse proxies to the origin for other data centers, resulting in more cache hits and faster response times.

Tiered Cache leverages the scale of Cloudflare’s network to minimize requests to customer origins. When a request comes into a Cloudflare data center, if the requested content is not locally cached, other Cloudflare data centers are checked for the cached content.

Cloudflare data centers have shorter distances and faster paths between them than the connections between data centers and customer origin servers, optimizing the response to the client with a significant improvement in cache hit ratio. The Cloudflare CDN leverages Argo Smart Routing data to determine the best upper tier data centers to use for Tiered Cache. Argo Smart Routing can also be enabled as an add-on to provide the fastest paths between data centers and origin servers for cache misses and other types of dynamic traffic.

The Cloudflare CDN allows customers to configure tiered caching. Note that depending on the Cloudflare plan, different topologies are available for Tiered Cache. By default, tiered caching is disabled and can be enabled under the caching tab of the main menu. ​​

#### Tiered Cache topologies

The different cache topologies allow customers to control how Cloudflare interacts with origin servers to help ensure higher cache hit ratios, fewer origin connections, and reduced latency.

| **Smart Tiered Cache Topology (all plans)** | **Generic Global Tiered Topology (Enterprise only)** | **Custom Tiered Cache Topology (Enterprise only)** |
| - | - | - |
| Recommended for most deployments. It is the default configuration once Tiered Cache is enabled. | Recommended for those who have high traffic that is spread across the globe and desire the highest cache usage and best performance possible. | Recommended for customers who have additional data on their user base and have specific geographic regions they would like to focus on. |
| Ideal for customers who want to leverage CDN for performance but minimize requests to origin servers and bandwidth utilization between Cloudflare and origin servers. | Generic Global Tiered Topology balances between cache efficiency and latency. Instructs Cloudflare to use all Tier 1 data centers as upper tiers. | Custom Tiered Cache Topology allows customers to set a custom topology that fits specific needs (ex: upper tiers in specific geographic locations serving more customers). |
| Cloudflare will dynamically find the single best upper tier for an origin using Argo performance and routing data. | | Engage your account team to build a custom topology. |

### Traffic flow: Tiered Cache, Smart Tiered Cache topology

In Figure 4, Tiered Caching is enabled with Smart Tiered Cache Topology. The diagram depicts two separate traffic flows, summarized below. The first traffic flow (Client 1) is a request from a client that comes into Data Center 1. The second traffic flow (Client 2) is a subsequent request for the same resource into a different data center, Data Center 2.

![Figure 4: The same diagram as Figure 3 demonstrating requests between end users and origin server over the anycast Network, with bidirectional arrows indicating traffic flow enabled by Smart Tiered Cache.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure4.kIutXMs6_Z1zLO2B.svg)

| Request 1 | Request 2 |
| - | - |
| First request received in Data Center 1 results in cache miss, as request had not been made previously by any client. | Second request by a different client received in Data Center 3 results in cache miss, as request had not been made previously by any client served by Data Center 3. |
| No cached content found, so Data Center 1 checks with its upper tier data center to request a copy of the content. | No cached content found, so Data Center 3 checks with the upper tier data center to request a copy of the content. |
| Upper tier data center also does not have content cached locally, so it makes a request to the origin server for content. Upon receiving the content, the upper tier data center caches it locally and relays the content to the requesting lower tier data center. The lower tier data center caches the content and responds to the client. | Cached content found at the upper tier data center. Data Center 3 retrieves and caches this content locally and responds to the client. |

In Figure 4, the top end user traffic flow displays the traffic flow when a client request is received by a data center closest to the client, Data Center 1. Since there is nothing locally cached on the ingress data center and tiered caching is enabled, a request is sent to the upper tier data center to request a copy of the content to cache. Because the upper tier data center also does not have the content cached, it sends the request to the origin server, caches the received content upon response, and responds to the lower tier data center with the cached content. The lower tier data center caches the content and responds to the client.

Notice that when a new request for the same content is made to another data center (bottom end user traffic flow), Data Center 3, the content is not locally cached; however, the content is retrieved from the upper tier data center, where it was cached from the first request for the same content.

With the upper tier data center returning the cached content for the second request, the trip to the origin server is prevented, resulting in higher cache hit ratios, faster response times, saved bandwidth cost between the Cloudflare network and the origin server, and reduced load on the origin server responding to requests.

### Regional Tiered Cache

The main difference between Smart Tiered Cache and Global tiered cache is the number of upper tiers that can talk to the origin servers. With Smart Tiered Cache the closest upper tier to the origin is selected using Argo performance and routing data. This means that all requests that experience a cache `MISS` at a lower tier will funnel through this single upper tier and have a higher percentage chance of a cache `HIT` to avoid sending traffic to an origin server. However, the downside to this architecture is that the lower tier could be located across the globe from the upper tier. Even if the upper tier can fulfill the request from its cache, the distance between the upper tier and lower tier could still add latency to the response depending on the distance traveled. To summarize, Smart Tiered Cache ensures that all requests for cache flow through a single upper tier cache location which increases cache `HIT` percentages, and reduces requests to the origin server, however it can result in higher latencies fulfilling those requests since the upper tier could be located far away from the lower tier that originated the request.

With Generic Global Tiered Cache, Cloudflare uses its largest data centers around the globe as upper tier cache which means, in general, that the upper tier cache is much closer to the lower tier cache. This can greatly reduce latency when lower tiers need to pass requests to upper tiers. However, this ultimately will increase the amount of requests serviced by the origin as each upper tier cache will need to populate from the origin. To summarize, Generic Global Tiered cache can improve response times when cache is populated, but will also increase load on the origin servers.

Regional Tiered Cache combines the best of both of these strategies together by adding an additional layer of cache to the architecture. Using the Regional Tiered Cache option with Smart Tiered Caching means that while a single upper tier cache location exists closest to the origin, a Regional Tier layer has been added between the upper and lower tier that is geographically closer to the lower tier. Now, requests from lower tiers will now check a Regional Tier for cache before being sent to an upper tier. A single Regional Tier can accept requests from several lower tier caches and because of that, can greatly improve performance and latency for globally available applications.

Regional Tiered Caching is recommended for use with Smart Tiered Caching and Custom Tiered Caching. However, Regional Tiered Cache is not beneficial for customers with many upper tiers in many regions like Generic Global Tiered Cache.

#### Traffic flow: Tiered Cache, Smart Tiered Cache with Regional Tiered Cache

In Figure 5, Tiered Caching is enabled with Smart Tiered Cache Topology. The diagram depicts the topology of Smart Tiered Cache with Regional Tiered Cache enabled. Lower tier caches, when they experience a cache `MISS` will first send those requests to a more local, regional hub data center to see if the cache can handle the request. If not, the request will continue on to the upper tier and then origin server, if necessary.

![Figure 5: Diagram illustrating requests between an end user and origin server with lower, regional and upper tiered caching enabled.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure5.B3Tq_F2z_Z1zLO2B.svg)

### Argo Smart Routing

Argo Smart Routing is a service that finds optimized routes across the Cloudflare network to deliver responses to users more quickly. As discussed earlier, Cloudflare CDN leverages Argo Smart Routing to determine the best upper tier data centers for Tiered Cache.

In addition, Argo Smart Routing can be enabled to ensure the fastest paths over the Cloudflare network are taken between upper tier data centers and origin servers at all times. Without Argo Smart Routing, communication between upper tier data centers to origin servers are still intelligently routed around problems on the Internet to ensure origin reachability.

Argo Smart Routing accelerates traffic by taking into account real-time data and network intelligence from routing nearly 50 million HTTP requests per second; it ensures the fastest and most reliable network paths are traversed over the Cloudflare network to the origin server. On average, Argo Smart Routing accounts for 30% faster performance on web assets.

#### Traffic Flow: Tiered Cache, Smart Tiered Cache Topology with Argo Smart Routing

Figure 6 details the traffic flow when Tiered Cache and Argo Smart Routing are not enabled. The request comes into the closest data center, and, because content is not locally cached and Tiered Cache is not enabled, the request is sent directly to the origin server for the content. Also, since Argo Smart Routing is not enabled, a reliable, but perhaps not the fastest, path is taken when communicating with the origin server.

![Figure 6: Diagram with bidirectional arrows indicating a request between an end user and origin server without Argo Smart Routing enabled.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure6.CUGfxAW8_Z1zLO2B.svg)

Figure 7 articulates the traffic flow with both Tiered Cache and Argo Smart Routing enabled. When a request is received by Data Center 1 and there is a cache miss, the cache of the upper tier data center, Data Center 6, is checked. If the cached content is not found at the upper tier data center, with Argo Smart Routing enabled, the request is sent on the fastest path from the upper tier data center to the origin.

The fastest path is determined by the Argo network intelligence capabilities, which take into account real-time network data such as congestion, latency, and RTT.

**With the Cloudflare CDN, Argo Smart Routing is used when:**

1. There is a cache miss and the request needs to be sent to the origin server to retrieve the content.
2. There is a request for non-cacheable content, such as dynamic content (ex: APIs), and the request must go to the origin server.

![Figure 7: Diagram with bidirectional arrows indicating a request between an end user and origin server, with Argo Smart Routing enabled to improve speed.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure7.Cxfbf7KH_ZL1y5X.svg)

Expanding on the idea of Tiered Cache, Cache Reserve further utilizes the scale and speed of the Cloudflare network while additionally leveraging R2, Cloudflare’s persistent object storage, to cache content even longer. Cache Reserve helps customers reduce bills by eliminating egress fees from origins while also providing multiple layers of resiliency and protection to make sure that content is reliably available which improves website performance by having content load faster. Basically, Cache Reserve is an additional higher tier of cache with longer retention duration.

While Cache Reserve can function without Tiered Cache enabled, it is recommended that Tiered Cache be enabled with Cache Reserve. Tiered Cache will funnel, and potentially eliminate, requests to Cache Reserve which eliminates redundant read operations and redundant storage of cached content reducing egress and storage fees. Enabling Cache Reserve via the Cloudflare dashboard will check and provide a warning if you try to use Cache Reserve without Tiered Cache enabled.

Cache Reserve has a retention period of 30 days which means it will hold cached content for 30 days regardless of cached headers or TTL policy. The TTL policy still affects the content’s freshness which means when content cache TTL expires inside of Cache Reserve, the content will need to be revalidated by checking the origin for any updates. The TTL policy can be set by any number of methods, such as Cache-Control, CDN-Cache-Control response headers, Edge Cache TTL, cache TTL by status code, or Cache Rules. Every time cache is read from Cache Reserve, the retention timer is reset to 30 days. After 30 days, if the cached content has not been read from Cache Reserve, the cache will be deleted.

There are three main criteria to match for content to be considered cacheable via Cache Reserve:

1. The content must be cacheable. See the [Cache documentation](https://developers.cloudflare.com/cache/) for more details on cacheable content.
2. TTL is set to at least 10 hours. This can be set by any method from the previous paragraph.
3. The Content-Length header must be used in the response header. Please note, this means that the \[Transfer-Method “chunked” will prevent Cache Reserve from being populated.

When combined with Tiered Caching and Argo Smart Routing, Cache Reserve can be a powerful tool for increasing cache hits and in turn reducing load on origin servers while also improving performance by bringing the content closer to the end user.

Using [Image Resizing](https://developers.cloudflare.com/images/transform-images/) with Cache Reserve will not result in resized images being stored in Cache Reserve since Image Resizing takes place after reading from Cache Reserve. Resized images will be cached in other available tiers when they are served after resizing.

### Traffic flow: Cache Reserve topology

Figure 8 illustrates how Cache Reserve can help reduce load on an origin server while also helping repopulate cache stores in both upper and lower tier data centers.

![Figure 8: Traffic between end users and an origin server showing Cache Reserve as the final step in the architecture of the Cloudflare CDN solution.](https://developers.cloudflare.com/_astro/ref-arch-cdn-figure8.B8u-UV7X_Z1zLO2B.svg)

### China Network & Global Acceleration for clients in China

Latency depends not just on how far the client is from the origin or cache, but can also be significantly affected by the geographic region of the traffic — like China. To address these latency challenges, Cloudflare provides two key solutions:

1. [China Network](https://developers.cloudflare.com/china-network/) provides in-China caching for end users located in China, regardless of the origin location. This solution is provided by collaborating with JD Cloud and uses their data centers to ensure the fastest and most reliable cache performance for Chinese users compared to data centers outside of China.
2. [Global Acceleration](https://developers.cloudflare.com/china-network/concepts/global-acceleration/) offers reliable and secure connectivity to streamline content from origins to JD Cloud data centers in China. This is particularly beneficial for dynamic content like web applications and API calls.

To summarize, the Cloudflare CDN is SaaS that helps address the challenges customers face around latency, performance, availability, redundancy, security, and costs. The Cloudflare CDN leverages Cloudflare’s global anycast network and Tiered Cache to deliver optimized results while saving costs for customers. Customers can also (enable Argo Smart)\[argo-smart-routing/get-started/] Routing to ensure the fastest network path is used to route requests to the origin server and also choose to enable Cache Reserve to increase cache hits to further save costs and increase performance of their website or application.

<page>
---
title: Reference Architecture using Cloudflare SASE with Microsoft · Cloudflare
  Reference Architecture docs
description: This reference architecture explains how Microsoft and Cloudflare
  can be integrated together. By leveraging Cloudflare's secure network access,
  risky user isolation, and application and data visibility, organizations can
  consolidate management.
lastUpdated: 2025-10-27T15:00:52.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/cloudflare-sase-with-microsoft/
  md: https://developers.cloudflare.com/reference-architecture/architectures/cloudflare-sase-with-microsoft/index.md
---

In today's rapidly evolving digital landscape, organizations are increasingly embracing cloud migration to modernize their environments and enhance productivity. Microsoft has emerged as a leading provider of cloud applications and services, offering a comprehensive suite of solutions to support hybrid work. However, this shift to the cloud also presents new challenges and risks that must be addressed to ensure the security and integrity of an organization's resources.

As organizations migrate to hybrid and multi-cloud environments, they often face the complexity of managing a combination of Software as a Service (SaaS), self-hosted, and non-web applications. This heterogeneous ecosystem can complicate the process of securing and controlling access to these resources. Additionally relying on legacy, often on-premises, Virtual Private Network (VPN) solutions to securely connect users to applications can introduce security gaps and hinder employee productivity. To overcome these challenges and achieve greater security outcomes, organizations can benefit from partnering with Cloudflare, a leading provider of cloud security and performance solutions. Cloudflare offers seamless integration with Microsoft's cloud ecosystem, enabling customers to eliminate security gaps, enhance performance, and ensure reliability across their hybrid work environments.

In this reference architecture diagram, we will explore how the combination of Cloudflare's Secure Access Service Edge (SASE) platform and Microsoft's cloud applications and services can help you attain a Zero Trust security posture and accelerate cloud modernization and productivity while providing comprehensive security for hybrid work. By leveraging Cloudflare's secure network access, risky user isolation, and application and data visibility, organizations can consolidate management through a unified interface and enable secure access to any resource, regardless of location.

### Who is this document for and what will you learn?

This reference architecture is designed for IT or security professionals with some responsibility over or familiarity with their organization's Microsoft deployments. It is designed to help you understand the different ways in which Microsoft and Cloudflare can be integrated together in terms of your Zero Trust and SASE programs.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

- Solution Brief: [Cloudflare One](https://cfl.re/SASE-SSE-platform-brief) (3 minute read)
- Whitepaper: [Reference Architecture for Internet-Native Transformation](https://cfl.re/internet-native-transformation-wp) (10 minute read)
- Blog: [Zero Trust, SASE, and SSE: foundational concepts for your next-generation network](https://blog.cloudflare.com/zero-trust-sase-and-sse-foundational-concepts-for-your-next-generation-network/) (14 minute read)

Those who read this reference architecture will learn:

* How Cloudflare and Microsoft can be integrated together to protect users, devices, applications and networks from a Zero Trust perspective

This document is also accompanied by a reference architecture with a more indepth look at [Cloudflare and SASE](https://developers.cloudflare.com/reference-architecture/architectures/sase/).

While this document examines Cloudflare at a technical level, it does not offer fine detail about every product in the platform. Visit the [developer documentation](https://developers.cloudflare.com/) for further information specific to a product area or use case.

## Integration of Cloudflare with Microsoft

Cloudflare's [Zero Trust Network Access](https://www.cloudflare.com/zero-trust/products/access/) (ZTNA) provides a faster and safer alternative to traditional VPNs. It replaces on-premises VPN infrastructure and protects any application, regardless of whether it is hosted in an on-premises network, public cloud, or as Software as a Service (SaaS). By integrating with Microsoft Intune and Microsoft Entra ID (formerly Azure Active Directory), Cloudflare's ZTNA service enables organizations to enforce default-deny, Zero Trust rules and provide conditional access to internal resources based on user identity and device posture.

Microsoft and Cloudflare can be integrated in the following ways.

* Using Microsoft [Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/whatis) for authentication to all Cloudflare protected resources
* Leveraging Microsoft [Intune](https://learn.microsoft.com/en-us/mem/intune/fundamentals/what-is-intune) device posture in Cloudflare policies to ensure only managed, trusted devices have access to protected resources
* Using Cloudflare [CASB](https://developers.cloudflare.com/cloudflare-one/integrations/cloud-and-saas/) to inspect your [Microsoft 365](https://www.microsoft.com/en-us/microsoft-365/what-is-microsoft-365) tenants and alert on security findings for incorrectly configured accounts and shared files containing sensitive data
* Using Cloudflare's [Secure Web Gateway](https://developers.cloudflare.com/cloudflare-one/traffic-policies/) to control access to Microsoft SaaS applications such as Outlook, OneDrive and Teams
* Using Cloudflare's [Email security](https://developers.cloudflare.com/email-security/) service to increase protection of email from phishing attacks and business email compromise.

### Microsoft Entra ID with Cloudflare

Cloudflare's integration with Entra ID allows you to leverage your identities in Entra for authentication to any Cloudflare protected application. Groups can also be imported via SCIM to be used in access policies, simplifying management and abstracting access control by managing group membership in Entra ID.

* Entra ID enables administrators to create and enforce policies on both applications and users using Conditional Access policies.
* It offers a wide range of parameters to control user access to applications, such as user risk level, sign-in risk level, device platform, location, client apps, and more.
* Security teams can define their security controls in Entra ID and enforce them at the network layer, for every request, with Cloudflare's ZTNA service.

![Figure 1: Microsoft Entra ID integrates with Cloudflare for ZTNA access to SaaS and self hosted applications.](https://developers.cloudflare.com/_astro/cloudflare-sase-with-microsoft-fig1.DLUixQrQ_RtHfR.svg)

### Microsoft Intune with Cloudflare

Cloudflare is able to enforce access policies that include information about device posture. Intune can be integrated into Cloudflare so that information about Intune managed and protected devices can be used to enforce access control to Cloudflare protected resources.

* With a device connected using our [agent](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/), Cloudflare's ZTNA service can leverage the enhanced telemetry and context provided by Intune regarding a user's device posture and compliance state.
* Intune provides detailed information about the security status and configuration of user devices, enabling more informed access control decisions.
* This integration allows administrators to ensure that only compliant and secure devices are granted access to critical networks and applications.

![Figure 2: Figure 2: Using Intune and Cloudflare device posture data for secure application access.](https://developers.cloudflare.com/_astro/cloudflare-sase-with-microsoft-fig2.B-u59e7U_Z13eFbO.svg)

### Cloudflare CASB for Microsoft 365

As companies adopt numerous SaaS applications, maintaining consistent security, visibility, and performance becomes increasingly difficult. With each application having unique configurations and security requirements, IT teams face challenges in staying compliant and protecting sensitive data across the diverse landscape.

Cloudflare CASB (Cloud Access Security Broker) addresses these challenges by providing extensive visibility across Microsoft 365 and other popular SaaS applications. This visibility enables organizations to quickly identify misconfigurations, exposed files, user access, and third-party access, ensuring a secure and compliant SaaS environment.

Learn more about how our CASB solution can [protect data at rest here](https://developers.cloudflare.com/reference-architecture/diagrams/security/securing-data-at-rest/).

### Cloudflare's Secure Web Gateway for improved security to Microsoft SaaS applications

Cloudflare's Secure Web Gateway (SWG) can help organizations achieve safe and secure access to Microsoft 365 in the following ways:

1. Traffic inspection and filtering: Cloudflare's SWG inspects all user and device traffic destined for the Internet, including traffic to Microsoft 365. This allows organizations to apply security policies, content filtering, and threat prevention measures to ensure that only legitimate and authorized traffic reaches Microsoft 365 services. As seen above, policies can be designed so that only managed, secure devices can access any part of the Microsoft 365 and Azure platform.
2. Data protection with DLP profiles: Traffic is not only inspected based on device posture and identity information, but our DLP engine can also examine the content of the request and allow/block downloads/uploads of confidential information to and from Microsoft 365 and Azure.
3. Enforce Cloudflare gateway: Microsoft 365 can be configured to accept user traffic only from a specific range of IP addresses. Cloudflare makes it possible to define and associate IP addresses attached to all traffic leaving the SWG. This means that organizations can configure Microsoft 365 to only accept traffic coming from the IP address range designated by Cloudflare SWG, ensuring that all traffic has been inspected and approved by Cloudflare's security policies before reaching Microsoft 365.

By leveraging Cloudflare SWG as a secure gateway for Microsoft 365 access, organizations can benefit from advanced threat protection, granular access controls, traffic inspection, and centralized visibility, ensuring a safe and secure experience for their users while mitigating risks and maintaining compliance.

### Cloudflare's Email security for improved email protection

Phishing is the root cause of upwards of 90% of breaches that lead to financial loss and brand damage. Cloudflare's email security solution sits in front of all email going to your Microsoft 365 tenant, filtering out spam, bulk, malicious and spoof content. The solution can leverage Microsoft [rules for quarantine actions](https://developers.cloudflare.com/email-security/deployment/inline/setup/office-365-area1-mx/use-cases/four-user-quarantine-admin-quarantine/), allowing you to fine tune how different email detections are handled.

![Figure 3: Cloud email security protects all Microsoft 365 inboxes.](https://developers.cloudflare.com/_astro/cloudflare-sase-with-microsoft-fig3.B5Jderoc_Z2650Bq.svg)

It is also possible to configure cloud email security to scan [Microsoft 365 inboxes via API](https://developers.cloudflare.com/email-security/deployment/api/), avoiding the need to make changes to existing DNS records.

By leveraging Cloudflare and its integrations with Microsoft, organizations can establish a Zero Trust security posture that goes beyond the limitations of traditional network security models. With Cloudflare's Zero Trust Network Access (ZTNA), organizations can replace self hosted VPNs and enforce conditional access based on user identity and device posture. The integration with Microsoft Entra ID allows for authentication and access control, while Microsoft Intune provides device posture information. Additionally, Cloudflare's CASB offers visibility into the security of Microsoft 365 configuration, the Secure Web Gateway inspects and filters traffic to Microsoft 365, and Email security protects against phishing attacks, ensuring a secure and compliant environment. This approach enables faster and more secure access to applications, while providing granular control over user access based on identity and device posture.

![Figure 4: A summary of Cloudflare SASE and Microsoft integrations.](https://developers.cloudflare.com/_astro/cloudflare-sase-with-microsoft-fig4.DEjQxEbH_Z13JrsG.svg)

* [Overview of Microsoft and Cloudflare partnership](https://www.cloudflare.com/partners/technology-partners/microsoft/)
* [Set up Microsoft Entra ID (formerly Azure Active Directory) as an identity provider](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/entra-id/#set-up-entra-id-as-an-identity-provider)

<page>
---
title: Enhancing security posture with SentinelOne and Cloudflare One ·
  Cloudflare Reference Architecture docs
description: The integration between Cloudflare One and SentinelOne provides
  organizations with a comprehensive security solution. The integration works
  through a service-to-service posture check that identifies devices based on
  their serial numbers.
lastUpdated: 2025-10-23T02:03:04.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/cloudflare-sase-with-sentinelone/
  md: https://developers.cloudflare.com/reference-architecture/architectures/cloudflare-sase-with-sentinelone/index.md
---

The integration between Cloudflare One and SentinelOne provides organizations with a comprehensive security solution that combines endpoint protection with [Zero Trust Network Access](https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/). This integration enables organizations to make access decisions based on device security posture, ensuring that only healthy and compliant devices can access protected resources. This reference architecture describes how organizations can implement and leverage this integration to enhance their security posture. The integration can assist in advancing an organization's or agency's Zero Trust Architecture Maturity Model, with the goal of one's organization eventually achieving Advanced or Optimal across all [CISA's 5 Pillars of Zero Trust.](https://www.cisa.gov/sites/default/files/2023-04/CISA_Zero_Trust_Maturity_Model_Version_2_508c.pdf)

## Who is this document for and what will you learn?

This reference architecture is designed for IT and security professionals who are implementing or planning to implement a Zero Trust security model using Cloudflare and SentinelOne. It provides detailed guidance on integration setup, configuration options, and common deployment scenarios. To build a stronger baseline understanding of these technologies, we recommend reviewing both platforms' core documentation.

Recommended resources for a stronger understanding of Cloudflare's SentinelOne integration:

* [SentinelOne device posture integration](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/sentinelone/)

## Integration overview

Cloudflare One can integrate with SentinelOne to enforce device-based access policies for applications and resources. The integration works through a service-to-service posture check that identifies devices based on their serial numbers. This allows organizations to ensure that only managed and secure devices can access sensitive resources.

## Technical components

### SentinelOne components

The SentinelOne platform provides critical endpoint security capabilities:

The SentinelOne agent must be deployed on all managed devices and provides real-time security monitoring and threat detection. Key posture data points include:

* Infection status of the device
* Number of active threats detected
* Agent activity status
* Network connectivity status
* Operational state of the agent

The SentinelOne Management Console provides centralized control and visibility, including the APIs necessary for integration with Cloudflare.

### Cloudflare components

Cloudflare's Zero Trust infrastructure provides the policy enforcement layer:

The WARP client must be deployed alongside the SentinelOne agent on managed devices. This client creates the secure connection to Cloudflare's network and enables device posture checking.

The Cloudflare dashboard provides the configuration interface for:

* Service provider integration settings
* Device posture policies
* Access policies that incorporate device posture checks

## Implementation architecture

### Authentication and authorization flow

![Figure 1: SentinelOne is used in Cloudflare policies as part of authorization flow.](https://developers.cloudflare.com/_astro/figure1.DqycNoJs_ixsmT.svg)

When a user attempts to access a protected resource, the following sequence occurs:

1. The user's device connects to Cloudflare's network through the WARP client.
2. Cloudflare queries the SentinelOne API to check the device's security posture.
3. The SentinelOne platform returns current device status including infection state, threats, and agent health.
4. Cloudflare evaluates this information against configured policies.
5. Access is granted or denied based on policy evaluation.

### Integration setup

The integration requires specific configuration steps:

First, a service account must be created in SentinelOne with appropriate permissions. This involves generating an API token and noting the REST API URL for your instance.

Next, SentinelOne must be configured as a service provider in the Cloudflare Zero Trust dashboard. This includes:

* Providing the API token and REST API URL
* Setting an appropriate polling frequency
* Testing the connection to ensure proper communication

Finally, device posture checks must be configured to define the security requirements for access. For detailed setup instructions, refer to [SentinelOne device posture integration](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/sentinelone/).

## Security capabilities

### Device posture verification

The integration enables robust device security verification through multiple attributes:

Infection Status monitoring ensures that compromised devices cannot access sensitive resources. Active Threat Detection prevents devices with ongoing security incidents from maintaining access. Agent Health Monitoring confirms that the security stack remains functional and properly configured.

### User risk detection

SentinelOne provides [endpoint detection and response (EDR)](https://www.sentinelone.com/cybersecurity-101/endpoint-security/what-is-endpoint-detection-and-response-edr/) signals that help determine user risk scores. This allows organizations to identify and manage users who may present security risks, enabling proactive security measures before incidents occur.

![Figure 2: SentinelOne and Cloudflare Zero Trust technical architecture.](https://developers.cloudflare.com/_astro/figure2.BaY3MgFK_Z2qcC2g.svg)

The integration architecture begins at the managed endpoint device level, where two critical components coexist. The SentinelOne agent serves as the primary security enforcer, continuously monitoring the device for threats, assessing device health, and providing real-time security status updates. Alongside it, the Cloudflare WARP client establishes secure connectivity and manages the device's interaction with Cloudflare's Zero Trust infrastructure. These components work in tandem to ensure both endpoint security and secure network access.

When a user attempts to access protected resources, the architecture initiates a sophisticated verification process. The WARP client first establishes a secure tunnel to Cloudflare's global network, creating an encrypted channel for all communications. This connection ensures that all traffic between the device and protected resources remains secure and can be properly evaluated against security policies.

### Cloudflare Zero Trust platform operations

At the heart of the architecture lies the Cloudflare Zero Trust platform, which consists of three main engines working in concert. The **Device Posture Engine** serves as the first line of defense, actively querying the SentinelOne platform to verify the device's security status. It checks multiple attributes including infection status, active threats, agent health, and network connectivity state. This information forms the foundation for access decisions.

The **Access Policy Engine** then takes this device posture information and combines it with other contextual factors to make access decisions. It evaluates predefined policies that can include criteria such as device security status, user identity, location, and other risk factors. This engine ensures that only devices meeting all security requirements can access protected resources.

The **Secure Web Gateway** adds another layer of protection by filtering all traffic, preventing access to malicious sites, and enforcing data loss prevention policies. This component ensures that even after access is granted, all traffic is continuously monitored and protected.

### SentinelOne platform integration

The SentinelOne platform plays a crucial role in this architecture through three main components. The **Management Console** provides centralized control over all endpoints, allowing security teams to configure policies, monitor device status, and respond to security events. The **API Services** component facilitates real-time communication with Cloudflare, providing critical security information about managed devices.

The **Security Analytics** component continuously processes security telemetry from all endpoints, identifying threats, assessing risks, and providing detailed security insights. This information flows to Cloudflare through **API Services**, enabling dynamic access decisions based on the latest security intelligence.

### Authentication and access flow

When a user requires access to protected resources, the architecture follows a specific flow:

First, the device's security status is evaluated through the **SentinelOne agent**, which reports detailed health and security information to the SentinelOne platform. Simultaneously, the **Cloudflare WARP client** initiates the access request to Cloudflare's Zero Trust platform.

Next, Cloudflare's **Device Posture Engine** queries the SentinelOne platform through its **API Services** to verify the device's security status. This check includes all current security metrics, threat status, and compliance information. The **Access Policy Engine** then evaluates this information against defined security policies.

If all security requirements are met, access is granted through the secure tunnel established by the WARP client. Throughout the session, continuous monitoring ensures that any change in device security status can trigger immediate reevaluation of access permissions.

### Security and monitoring capabilities

The architecture provides comprehensive security through multiple mechanisms. At the endpoint level, the SentinelOne agent provides advanced threat detection and response capabilities. The **Security Analytics** component processes this security telemetry in real-time, enabling quick identification of threats and security issues.

Cloudflare's **Secure Web Gateway** provides network-level protection, filtering traffic and preventing access to malicious resources. This component works in conjunction with the **Access Policy Engine** to ensure that all traffic, both to internal and external resources, meets security requirements.

## Operational benefits

This integrated architecture delivers several key operational benefits. It enables organizations to implement true Zero Trust access control, where every access request is verified based on current security status. The integration between SentinelOne and Cloudflare provides seamless security enforcement, combining endpoint protection with network-level access control.

The architecture also supports dynamic policy enforcement, where changes in device security status can automatically trigger access restrictions. This ensures that compromised or non-compliant devices can be quickly isolated from sensitive resources, maintaining organizational security.

## Deployment considerations

### Network architecture

Organizations should consider their network architecture when implementing this integration. Key factors include:

* Distribution of endpoints across different networks
* Bandwidth and latency requirements for posture checks
* Integration with existing security tools and workflows

The integration between Cloudflare One and SentinelOne requires thoughtful planning to ensure successful implementation. At its foundation, organizations need to prepare their environment by having the SentinelOne agent and Cloudflare WARP client deployed on all devices that will be subject to posture checks. This foundational step ensures that both security monitoring and secure network connectivity are in place before building additional security controls.

When implementing the integration, organizations should approach it as a service provider relationship where SentinelOne acts as a trusted source of device security information. This relationship is established through secure API communications, with careful attention paid to proper credential management and regular verification of the connection between the platforms. The integration relies on SentinelOne's ability to provide real-time device security status, which Cloudflare then uses to make access decisions.

Effective policy design is crucial for security and usability. Consider implementing policies that:

* Start with basic hygiene requirements and gradually increase security requirements
* Account for different user roles and access needs
* Include fallback options for exceptional circumstances

Policy configuration represents another crucial aspect of the deployment. Organizations can leverage SentinelOne's detailed device posture information to create nuanced access policies. These policies can take into account multiple factors such as device infection status, active threats, and agent health. By monitoring these various attributes, organizations can ensure that only devices meeting their security requirements can access protected resources.

Regular testing and monitoring play vital roles in maintaining the effectiveness of the integration. Through Cloudflare's logging and testing capabilities, organizations can verify that posture checks are functioning as intended and that policies are being enforced correctly. This ongoing verification helps ensure that the security benefits of the integration are consistently realized.

The integration between Cloudflare One and SentinelOne provides organizations with a powerful tool for implementing Zero Trust security principles. By combining endpoint protection with access control, organizations can ensure that only secure and compliant devices can access sensitive resources. This approach significantly reduces the risk of compromised devices accessing corporate resources while maintaining user productivity through seamless authentication and authorization processes.

* [Overview of SentinelOne and Cloudflare partnership](https://www.cloudflare.com/partners/technology-partners/sentinelone/)

<page>
---
title: Understanding Email Security Deployments · Cloudflare Reference
  Architecture docs
description: This reference architecture describes the key architecture of
  Cloudflare Email security.
lastUpdated: 2025-12-02T17:23:00.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/email-security-deployments/
  md: https://developers.cloudflare.com/reference-architecture/architectures/email-security-deployments/index.md
---

Email continues to be a mission critical method for communication between people and organizations. This also makes email an ideal channel for attackers to exploit in their attempts to take over accounts, steal data, and gain access to internal systems. Being able to reduce spam, defeat phishing, and malware attacks is critical for the security of your organization. Over 90% of cybersecurity incidents begin with an email attack.

Cloudflare Email security service is a market leading solution that can be deployed in a variety of ways to support different needs for each organization. This document outlines the different methods to deploy Email security and why you would choose any specific model.

## Strengthen your email infrastructure with Cloudflare Email security

Email remains a critical communication channel for businesses of all sizes. However, email also serves as a prime target for cyber attacks, including phishing, spam, and malware. To safeguard your organization sensitive data and reputation, a robust email security solution is essential.

Cloudflare Email security offers a comprehensive suite of tools and technologies designed to protect your email infrastructure from a wide range of threats. By implementing Cloudflare Email security, you can significantly enhance your organization security posture and mitigate the risks associated with email-borne attacks.

This reference architecture provides a detailed overview of how to deploy and configure Cloudflare Email security to optimize your email security posture. This reference architecture will delve into key components and best practices to ensure the seamless integration of this solution into your existing IT infrastructure.

### Who is this reference architecture for and what will you learn?

This reference architecture is designed for IT or security professionals who are looking at using Cloudflare to secure aspects of their business. This reference architecture is designed for a broad audience, including:

* **IT security professionals**: Security engineers, architects, and administrators responsible for designing, implementing, and managing Email security solutions.
* **Network engineers**: Network engineers who manage network infrastructure and email gateways.
* **Cloud architects**: Cloud architects who design and implement cloud-based Email security solutions.
* **Security and IT decision-makers**: Managers and executives who need to understand the technical aspects of Email security and make informed decisions.

Whether you are a seasoned security expert or a newcomer to Email security, this document will provide you with the necessary information to effectively deploy and manage Cloudflare Email security.

To build a stronger understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (five-minute read) or [Video](https://www.cloudflare.com/what-is-cloudflare/video) (two minutes)
* [Cloudflare Blog](https://blog.cloudflare.com/tag/cloud-email-security/) | [Email security](https://blog.cloudflare.com/tag/cloud-email-security/) and [Phishing](https://blog.cloudflare.com/tag/phishing/)
* CISA | [Phishing Guidance: Stopping the Attack Cycle at Phase One](https://www.cisa.gov/publications/phishing-guidance-stopping-attack-cycle-phase-one)

By the end of this reference architecture, you will have learned how Cloudflare protects your email and what considerations should be made for choosing how to deploy. You will learn about the specific components, technologies, and configurations involved in the Cloudflare Email security solution. This includes how it integrates with existing email infrastructure and leverages cloud-based services.

## Email security deployment options

Cloudflare Email security is a modern approach to solving phishing attacks. Cloudflare solution is built upon AI and Machine Learning utilizing elastics services in addition to benefiting from Cloudflare expansive threat intelligence network. Cloudflare Email security was designed as the only true Cloud Elastic Service with shared intelligence and [Supervised ML](https://www.ibm.com/think/topics/supervised-learning) capable of any deployment method available for email. However, choosing the right deployment model is crucial for maximizing the benefits of Email security.

This document will discuss the following methods to deploy and where you would use them:

* [Inline or MX](https://developers.cloudflare.com/cloudflare-one/email-security/setup/pre-delivery-deployment/mx-inline-deployment/)
* [Microsoft 365 API integration](https://developers.cloudflare.com/cloudflare-one/email-security/setup/post-delivery-deployment/api/m365-api/)
* [Journaling](https://developers.cloudflare.com/cloudflare-one/email-security/setup/post-delivery-deployment/bcc-journaling/journaling-setup/m365-journaling/) or [BCC](https://developers.cloudflare.com/cloudflare-one/email-security/setup/post-delivery-deployment/bcc-journaling/bcc-setup/gmail-bcc-setup/enable-gmail-integration/) with auto-move
* Hybrid deployment

## Choose a deployment model

Before you choose a deployment option, it is important to consider your needs and desired experience. Our best practice is typically to go with an MX deployment when we are the primary phishing protection in place. The key reasons for this are as follows:

* [Pre-delivery](https://developers.cloudflare.com/cloudflare-one/email-security/setup/pre-delivery-deployment/mx-inline-deployment/) remediation allows us to tune how messages are delivered by appending to the subject/body, applying URL Rewriting to Cloudflare [Remote Browser Isolation](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/), and delivering messages into the junk folder or downstream email quarantine. This enables you to design with a specific user experience in mind.
* We can remove messages before they are consumed by systems that ingest emails such as a ServiceNow or an Archiving Solution.
* We remove the risk of dwell time issues where there is a time difference between delivery to the inbox and when the message is moved from the inbox.
* We can support hybrid deployments such as a mix of Microsoft 365 and Microsoft Exchange or Microsoft 365 and Google Workspace.

If those needs are not important or you are using layered security that does not include another API-based solution, then our API method is quick and efficient to deploy with no changes to your mail flow. If you want the benefits of API without the risk of API Throttling, then Journal/BCC is the best choice as the ingestion method does not use API calls. However, if you want the protection of an MX deployment along with the benefits of API for internal messaging, then our hybrid deployment is ideal.

Should your needs change, know that you have the flexibility to change deployment methods as you see fit without having to repurchase our solution. The only caveat is that Advantage and CyberSafe customers are limited to Inline deployments while Enterprise licensing benefits from all capabilities.

Before you commit to a specific deployment, Cloudflare suggests you review all of the options, weigh your needs, and consult with your account team as needed.

## Deployment options

With an Inline deployment, all emails destined for one or more domains are filtered through Cloudflare before they are delivered to the user's inbox. Cloudflare can be deployed anywhere in your email processing chain. When deployed as the first hop, you will need to update the domain's DNS MX records to point to Cloudflare. If you prefer Cloudflare to inspect messages after your existing SEG (Secure Email Gateway), Cloudflare can be inserted as a hop in the processing chain, and will then forward processed messages downstream to the next hop. Based on policies, messages are blocked and/or quarantined if they are marked as Spam, Malicious, Bulk, and more.

![Inline deployment](https://developers.cloudflare.com/_astro/Inline_MX.CF8OdSfC_1YRlXt.svg)

The diagram above describes the following:

1. Email arrives at Cloudflare based on [MX records](https://www.cloudflare.com/en-gb/learning/dns/dns-records/dns-mx-record/).

2. Cloudflare inspects email body, header, and attachments and assigns the appropriate disposition:

* Malicious
   * Spam
   * Bulk
   * Suspicious
   * Spoof
   * Clean

3. Apply any policy, such as allow or block certain domains.

4. Quarantine high risk emails

5. All messages that received a [disposition](https://developers.cloudflare.com/cloudflare-one/email-security/reference/dispositions-and-attributes/#dispositions) by Cloudflare will have the header `X-CFEmailSecurity-Disposition` added. This header can be used by downstream systems to enact any special handling (rerouting, external quarantining, and more).

6. Forward on all valid email traffic.

7. Subject and/or body modifications can be applied to the messages to add visible information for the end-user about the disposition.

From a security perspective, the Inline deployment is the preferred method of deployment, because it scans every email and stops malicious content from reaching the user inbox. This removes all exposure risks to users.

#### Benefits of Inline deployment

* Messages are processed and blocked before delivery to the user mailbox.
* Inline deployment allows you to modify the message, adding subject or body mark-ups such as appending \[SPAM] or \[EXTERNAL SPAM] to the subject.
* Provides high availability and adaptive message pooling as Cloudflare will continue to accept incoming emails in queue, even when the downstream services are not available. When the downstream services are restored, messages will resume delivery for the queue.
* Messages with an assigned [disposition](https://developers.cloudflare.com/cloudflare-one/email-security/reference/dispositions-and-attributes/#dispositions) that are not quarantined receive an `X-header` that may be used for advanced handling downstream.
* Compatible with all mail systems including Microsoft Exchange On-Prem, Postfix, Lotus Notes, Google Workspace, Microsoft 365, and more.

Before deploying Email security via Inline deployment, you will need to consider the following:

1. Redirecting deployments where mail flows into Microsoft Exchange or Microsoft 365 first, then to an Email security solution by way of mail flow rules for scanning/remediation, and then back into Microsoft 365 is not supported by Microsoft. While Cloudflare is technically capable of this deployment, it creates attribution (recognizing the original sender) and delivery issues.
2. If Cloudflare is going to be the MX, this will require DNS changes. If there are many domains, each DNS zone needs to be updated.
3. Inline deployment can increase complexity in the SMTP architecture if Cloudflare is not deployed as MX such as Inline behind a traditional SEG (Mimecast/ProofPoint).
4. Inline deployment may require policy duplication on multiple solutions and the MTA. For example, Cloudflare, SEGs, and MTA treat allow policies in significantly different ways and may all need exception handling for the same message.
5. In a layered deployment, some vendors such as Mimecast and Barracuda can only function as the MX. In this scenario, you would configure Cloudflare Inline behind those vendors.
6. When using Mimecast, it is recommended to disable URL Rewriting as it makes it impossible for Cloudflare to decode and crawl URLs. If this feature remains enabled, our link following capabilities are limited to domain reputation and age.

#### Inline (Cisco Connector)

Cisco offers a unique capability to integrate with Cloudflare using a connector as MX or behind Cloudflare with a supportable Hairpin deployment. This deployment functions the same as Inline in all other considerations. Refer to Cisco as MX Record and Cisco - Email security as MX Record.

An alternative approach is to integrate via the Graph [API](https://developers.cloudflare.com/cloudflare-one/email-security/setup/post-delivery-deployment/api/m365-api/) in Microsoft 365. In this model, emails are delivered directly to the user inbox, where Cloudflare then receives copies of messages, scans them, and moves them as configured by [disposition](https://developers.cloudflare.com/cloudflare-one/email-security/reference/dispositions-and-attributes/#dispositions).

This is performed by subscribing to all user mailboxes on the authorized domains. You have the ability to choose if the scope should be restricted to the Inbox only, or All Folders during the authorization process. Upon delivery to the mailbox, the subscription triggers an action within Microsoft 365 that sends Cloudflare a copy of the email to be scanned and assigned a disposition. Once the disposition has been assigned, our solution will look at the [auto-move](https://developers.cloudflare.com/cloudflare-one/email-security/settings/auto-moves/) policy and perform the desired action.

![API deployment](https://developers.cloudflare.com/_astro/API.C1s_LKzB_ZIh0Do.svg)

The diagram above describes the following:

1. An email is delivered directly to the user inbox via an existing route.

2. Cloudflare retrieves messages for inspection via email vendors API. Cloudflare inspects email body, header, and attachments and assigns the appropriate disposition:

* Malicious
   * Spam
   * Bulk
   * Suspicious
   * Spoof
   * Clean

3. Apply any policy, such as allow or block certain domains.

4. Messages are moved per policy in the Cloudflare solution. The following actions are available:

* Inbox
   * Junk
   * Trash
   * Soft Delete (User Recoverable)
   * Hard Delete (Admin Recoverable)

Under normal circumstances, this process is typically performed in less than 2-3 seconds from inbox delivery to the move request. There is no SLA from Google or Microsoft 365 on how long they will take to perform the action. If the move action is not successful, our solution will retry numerous times every five minutes.

#### Benefits of API deployment

* Easy way to add protection in complex email architectures with no changes to mail flow operations.
* Agentless deployment for Microsoft 365.
* Microsoft 365 Defender/ATP operates on the message first.
* This method can be used for a Proof of Value to collect and report on emails without requiring changes to mail flow. In this scenario you would leave the remediation policy not configured to prevent actions being taken.

Before deploying Email security via [API deployment](https://developers.cloudflare.com/cloudflare-one/email-security/setup/post-delivery-deployment/api/m365-api/), you will need to consider the following:

* Depending on the API infrastructure, Microsoft 365 or Google outages and maintenance windows will increase message dwell time in the inbox as emails cannot be scanned or remediated until after delivery to the user. This is a limitation of all API vendors.

* Microsoft 365 may throttle API requests to the Graph API on a Service by Service basis. The Mail API with Graph is within the Outlook Services section. These limits could be abused by a threat actor to functionally disable any API based deployment granting an additional window for attack. The limits are as follows:

* 10,000 API requests in a 10 minute period
  * Four concurrent requests
  * 150 megabytes (MB) upload (PATCH, POST, PUT) in a five-minute period
  * Refer to [Outlook service limits](https://learn.microsoft.com/en-us/graph/throttling-limits#outlook-service-limits)

* The Gmail API is subject to a daily usage limit that applies to all requests made from your application, and per-user rate limits. Each limit is identified in terms of quota units, or an abstract unit of measurement representing Gmail resource usage. The main request limits are described as follows:

* Per user rate limit of 250 quota units per user per second, moving average (allows short bursts).
  * Per-method Quota Usage is based on the number of quota units consumed by a request depending on the method called.
  * For example, `messages.get` and `messages.attachments.get` consume five quota units. Refer to [Per-method quota usage](https://developers.google.com/gmail/api/reference/quota#per-method_quota_usage)

* Requires read/write access into mailboxes which some security/email teams may not allow.

* Only Microsoft 365 has true API support. Google allows for API remediation but still requires a Compliance Rule to deliver emails using SMTP for scanning. On-prem Exchange requires PowerShell and does not have APIs for auto-moves.

* Messages cannot be modified after delivery as per Microsoft 365/Google requirements. This means we cannot perform URL Rewriting to Cloudflare [email link isolation](https://developers.cloudflare.com/cloudflare-one/email-security/investigation/search-email/#open-links) or append text to the email subject or body. Those features are only available using an Inline deployment.

BCC/Journaling is very similar to API deployments with the exception of how emails are delivered to Cloudflare. As with API the email is delivered to the mailbox first, but at the same time an account specific email address is added to the email so a copy is transmitted via SMTP to Cloudflare for evaluation.

Once Cloudflare receives the email, it will scan and determine the [disposition](https://developers.cloudflare.com/cloudflare-one/email-security/reference/dispositions-and-attributes/#dispositions) of the email. Once an email has a disposition our solution will look at the API authorizations and [auto-move](https://developers.cloudflare.com/cloudflare-one/email-security/settings/auto-moves/) policy and perform the desired action. This method is less at risk to API Throttling as the APIs for Microsoft 365 and Google are only used to remediate emails.

![BCC/Journaling deployment](https://developers.cloudflare.com/_astro/Journaling_Diagram.Dn7_4rh7_ZkpAyi.svg)

During a proof of value, this deployment can be configured with any Email security solution or mail platform that allows for adding a BCC recipient to gain visibility into what those solutions are missing that Cloudflare would block.

#### Benefits of BCC/Journaling deployment

* Easy way to add protection in complex email architectures with no changes to mail flow operations.
* Agentless deployment for Microsoft 365. Microsoft 365 would transmit emails after delivery to Cloudflare and the API Authorization can be configured with a Remediation policy to move emails with a disposition out of the inbox.
* Google makes use of Compliance Rules for BCC which can be combined with an API Authorization to move emails after delivery. This provides for the same outcome as the API deployment detailed above.
* Microsoft 365 and Google operate on the message first. This provides a more layered approach taking advantage of the security capabilities of Microsoft 365/Google in addition to Cloudflare.
* You can control the scope of messages inspected (external, internal, or both)
* This method can be used for a Proof of Value to collect and report on emails without requiring changes to mail flow. This does not require an API Authorization to be in place. If the API is configured for Microsoft 365 or Google, you would leave the Remediation policy not configured to prevent actions being taken.

Before deploying Email security via BCC/Journaling deployment, you will need to consider the following:

* Same limitations of API.
* Depends on Google or Microsoft 365 to deliver messages via SMTP.
* May require a Connector in Microsoft 365 to facilitate direct communication.
* Messages cannot be modified after delivery as per Microsoft 365/Google requirements. This means we cannot perform URL Rewriting to Cloudflare Email Link Isolation or append text to the email Subject or Body. Those features are only available using an Inline deployment.

Hybrid utilizes an Inline deployment for external emails and BCC/Journaling for internal emails. This is facilitated by using both deployment methods but configuring Cloudflare for two hops in BCC/Journal mode. This scenario provides all of the added benefits of an MX delivery for external messages, while also providing remediation of bad emails from internal sources. Here are some scenarios where this is helpful.

If you have mailboxes where emails are consumed by services such as ticketing systems, CRMs (Customer Relationship Management systems), or Legal Archiving. Each of these integrations run the risk of malicious emails being delivered into those systems where no API-based Email security solution can remediate the problem. The only deployment capable of protecting you would be Inline. If you had additional concerns about malware being spread internally or compromised accounts being used to phish users internally, you would have a gap requiring the purchase of both an Inline solution and an API solution. This would create other problems as you may need to manage policies related to email delivery in three different solutions (MX, API, and Microsoft 365/Google).

Cloudflare's hybrid deployment allows us to collapse all of those use cases into a single solution by allowing quarantining of messages at the Cloudflare edge in addition to evaluating internal email and removing them when needed. This improves security while decreasing vendor spend, management overhead, and risk due to the complexity of managing three different policy sets.

Hybrid deployment combines the benefits of Inline deployment for external emails and BCC/Journaling for internal emails.

When you choose hybrid deployment, you need to consider that:

* Internal email detections are limited due to a lack of information such as Email Authentication, Sending Server, and Delivery Path. Only the content within the body of the email can be analyzed.
* Internal emails may have higher False Positives when using Protecting Users with impersonation registry.

## Automated Post Delivery

Cloudflare offers automated workflows based on continuous analysis and submissions. These features enable Cloudflare to move messages using the API [auto-move](https://developers.cloudflare.com/cloudflare-one/email-security/settings/auto-moves/) policy after delivery. This is best paired with the phish submissions or third-party user submissions.

### Post Delivery Response

Cloudflare will continue to re-evaluate emails already delivered to your inbox at a fixed time interval in search for phishing sites or campaigns not previously known to Cloudflare. If any email messages fitting these new criteria are found, Cloudflare retracts them.

### Phish Submission Response

Cloudflare will [auto-move](https://developers.cloudflare.com/cloudflare-one/email-security/settings/auto-moves/) emails already delivered that are reported by you as phishing, and are found to be malicious by Cloudflare. Auto-move will occur according to your configuration.

### Submission Handling

Cloudflare prioritizes Administrator Submissions for false positives and negatives through the Cloudflare dashboard. This approach enables faster review times and helps Cloudflare proactively identify and correct issues that may affect multiple users improving the overall product experience. It is recommended that administrators review user submissions, identify all related messages, and submit as verified false positive/false negatives via the Cloudflare dashboard. These submissions will be reviewed and used to improve Machine Learning Models, Detections, and Engines in the future.

To summarize, Email security offers three core deployment models: API, BCC/Journaling, and Inline (or MX). Inline is the preferred deployment model as it filters and remediates malicious messages before they reach the user inbox, thereby removing dwell time risk and allowing for features like URL Rewriting and message modification.

API and BCC/Journaling models are post-delivery solutions, integrating directly with platforms like Microsoft 365 or Google Workspace to inspect and [auto-move](https://developers.cloudflare.com/cloudflare-one/email-security/settings/auto-moves/) emails after they have landed in the user mailbox. While these post-delivery methods are easier to deploy and require no mail flow changes, they face limitations such as API throttling risks and the inability to modify message content (like subjects or body text).

Finally, the hybrid deployment combines the benefits of Inline for external email protection (critical for systems like CRM or ticketing that ingest email) with BCC/Journaling for internal email evaluation.

<page>
---
title: Load Balancing Reference Architecture · Cloudflare Reference Architecture docs
description: This reference architecture is for organizations looking to deploy
  both global and local traffic management load balancing solutions. It is
  designed for IT, web hosting, and network professionals with some
  responsibility over or familiarity with their organization's existing
  infrastructure.
lastUpdated: 2025-11-19T12:11:06.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/load-balancing/
  md: https://developers.cloudflare.com/reference-architecture/architectures/load-balancing/index.md
---

Cloudflare Load Balancing is a SaaS offering that allows organizations to host applications for a global user base while vastly reducing concerns of maintenance, failover, resiliency, and scalability. Using Cloudflare Load Balancing allows organizations to address the following challenges:

* Efficiently handling large volumes of incoming traffic, especially during unexpected surges or spikes.
* Ensuring applications and services remain accessible to users.
* Maintaining quick response times and optimal performance for all users, especially during high traffic periods.
* Adapting to changing traffic demands and ensuring the infrastructure can accommodate growth.
* Helping applications and services resist Distributed Denial of Service (DDoS) attacks.

Cloudflare Load Balancing is built on Cloudflare’s connectivity cloud, ​​a unified, intelligent platform of programmable cloud-native services that enable secure any-to-any connectivity between all networks (enterprise and Internet), cloud environments, applications, and users. It is one of the largest global networks, with data centers spanning over 330 cities and interconnection with over 13,000 network peers. It also has a greater presence in core Internet exchanges than many other large technology companies.

As a result, Cloudflare operates within \~50 ms of \~95% of the world’s Internet-connected population. And since all Cloudflare services are designed to run across every network location, all requests are routed, inspected, and filtered close to their source, resulting in strong performance and consistent user experiences.

This document describes a reference architecture for organizations looking to deploy both global and local traffic management load balancing solutions.

### Who is this document for and what will you learn?

This reference architecture is designed for IT, web hosting, and network professionals with some responsibility over or familiarity with their organization's existing infrastructure. It is useful to have some experience with networking concepts such as routing, DNS, and IP addressing, as well as basic understanding of load balancer functionality.

To build a stronger baseline understanding of Cloudflare and its load balancing solution, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

- Solution Brief: [Cloudflare Private Network Load Balancing](https://cf-assets.www.cloudflare.com/slt3lc6tev37/4mn2dtdw7TvSwCUJw8mMf5/f1fa6269f4468c432560b2c9f5ebd38a/Cloudflare_Local_Traffic_Manager_Solution_Brief.pdf) (5 minute read)
- Solution Brief: [Cloudflare GTM Load Balancing](https://cf-assets.www.cloudflare.com/slt3lc6tev37/5OWUduF4YBKYADj3zREAX6/5241a81a3fc4ff1db7c9bade14991b23/Cloudflare_Global_Traffic_Manager__GTM__Solution_Brief.pdf) (5 minute read)
- Blog: [Elevate load balancing with Private IPs and Cloudflare Tunnels: a secure path to efficient traffic distribution](https://blog.cloudflare.com/elevate-load-balancing-with-private-ips-and-cloudflare-tunnels-a-secure-path-to-efficient-traffic-distribution/) (13 minutes)

Those who read this reference architecture will learn:

* How Cloudflare Load Balancing can address both Private Network Load Balancing and global traffic management use cases.
* How Cloudflare’s global network enhances the functionality of Cloudflare Load Balancing.
* The capabilities of Cloudflare Load Balancers, and how they apply to various use cases.
* The structure of Cloudflare Load Balancers and their various configurations.

## Handling dynamic workloads in modern applications

### Concepts and terminology

In this document, the term “endpoint” is any service or hardware that intercepts and processes incoming public or private traffic. Since load balancing can be used for more than just web servers, the term endpoint has been chosen to represent all possible types of origins, hostnames, private or public IP addresses, virtual IP addresses (VIPs), servers, and other dedicated hardware boxes. It could be on-premises or hosted in a public or private cloud — and could even be a third-party load balancer.

Steering is a load balancer’s main function — the process of handling, sending, and forwarding requests based on a set of policies. These policies generally take many factors into account, including request URL, URL path, HTTP headers, configured weights, priority, and endpoint latency, responsiveness, capacity, and load.

[Layer 7](https://www.cloudflare.com/learning/ddos/what-is-layer-7/) of the [OSI model](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/), also known as the application layer, is where protocols such as SSH, FTP, NTP, SMTP, and HTTP(S) reside. When this document refers to layer 7 or layer 7 load balancers, it means HTTP(S)-based services. The Cloudflare layer 7 stack allows Cloudflare to apply services like DDoS protection, Bot Management. WAF, CDN, Load Balancing and more to a customer's website to improve performance, availability, and security.

Layer 4 of the [OSI model](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/) — also called the transport layer — is responsible for end-to-end communication between two devices. Network services that operate at layer 4 can support a much broader set of services and protocols. Cloudflare’s public layer 4 load balancers are enabled by a product called Spectrum, which works as a layer 4 reverse proxy. In addition to offering load balancing, Spectrum provides protection from [DDoS attacks](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/) and can conceal the endpoint IP addresses.

#### SSL/TLS Offloading

SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) are cryptographic protocols used to secure connections over the Internet. SSL and TLS offloading, also known as SSL/TLS termination or SSL/TLS acceleration, is a technique used in load balancers and web servers to handle the SSL/TLS encryption and decryption process without affecting an endpoint’s performance. SSL/TLS offloading improves server performance, simplifies certificate management, and enhances scalability by offloading the resource-intensive encryption and decryption tasks to dedicated devices, helping endpoints remain dedicated to serving content and application logic.

### Challenges addressed by load balancers

Modern websites, or any applications for that matter, face three main challenges:

1. **Performance:** Ensuring that the application responds to users requests and input in a timely manner
2. **Availability:** Maintaining the uptime for the application, so it is always able to respond to user requests
3. **Scalability:** Growing, shrinking, or relocating application resources based on user behavior or demand.

Application performance can be affected by several factors, but the most common cause of performance issues is the amount of usage or load placed on an endpoint. An endpoint generally has a finite amount of compute resources it can provide. If too many requests arrive at once, or if the type of requests cause increased CPU/memory usage, the endpoint will respond slower or fail to respond at all.

To address these challenges, endpoints can be upgraded with more compute resources. But during idle or low-usage times, the organization ends up paying for underutilized resources. Organizations may also deploy multiple endpoints — but to seamlessly steer traffic between them, a load balancing solution is needed to make this process seamless to the end user.

Figure 1 shows how load might be distributed without a load balancer:

![Endpoint load is not distributed evenly without a load balancer](https://developers.cloudflare.com/_astro/lb-ref-arch-1.D0yttOOR_Z5jog7.svg)

Load balancers allow organizations to host several endpoints and portion out traffic between them, ensuring no single endpoint gets overwhelmed. The load balancer handles all incoming requests and forwards them to the appropriate endpoint. The client doesn’t need any knowledge of endpoint availability or load — it just needs to send the request to the load balancer and the load balancer handles the rest. Figure 2 shows how a load balancer can evenly distribute traffic from users across a set of endpoints.

![A load balancer helps evenly distribute requests across multiple endpoints](https://developers.cloudflare.com/_astro/lb-ref-arch-2.DiqlVt64_1JJ2DB.svg)

Another performance-related issue has to do with the distance between a client and an endpoint. Whether due to the mere fact of traveling farther, or having to make more network hops, a request that travels a longer distance generally has a higher round-trip time (RTT).

RTT becomes important at scale. For example, if a client and endpoint are both located in the United States, it would be reasonable to expect a RTT of 25ms. If the client has 20 requests it needs responses to, the total time required to handle them sequentially (not including compute time) would be 500ms (20 x 25ms). And if the same client connected from the APAC region the RTT might be upwards of 150ms, resulting in an undesirable total loading time of 3000ms (20 x 150ms). (Certainly, request streaming enhancements in HTTP/2 and HTTP/3 might change this math — but in websites with dynamic or interactive content, where a response’s information is used to generate additional requests, the example still holds in general.) Figure 3 illustrates how this happens.

![Latency compounds based on the number of requests](https://developers.cloudflare.com/_astro/lb-ref-arch-3.D0FbXMvI_Z2hnSD3.svg)

In the same way a load balancer can pass traffic to a less-busy endpoint, it can also pass traffic to a geographically closer endpoint, resulting in a more responsive experience for the client. Specifically, the load balancer performs a lookup of the IP address that sent the request, determines its location, and selects the closest or most region-appropriate endpoint to send it to (this is similar to functionality provided by DNS solutions like GeoDNS).

Service availability encompasses both unintentional and intentional downtime of endpoints behind a load balancer. Several factors can contribute to unintentional downtime, including hardware failure, software bugs, network issues, and ISP or other vendor issues. Even for the most advanced organizations, these issues are inevitable.

Load balancers solve these issues by always monitoring the health of endpoints. If an endpoint is slow to respond to a health check, or fails to respond entirely, the endpoint is marked as unhealthy. Several methods exist for monitoring, including basic health tests like ICMP (ping) and TCP connection tests. More advanced health tests can be used like issuing an HTTP GET request and ensuring a specific response code and response body are returned from the endpoint. Once an endpoint is in a degraded state, the load balancer will send fewer or no requests its way in favor of healthier endpoints. As the endpoint becomes operational again and the load balancer is able to receive responses to its health checks, the endpoint is marked as operational and has traffic steered towards it once more.

Intentional downtime comes in a few different forms, including capacity changes, hardware or infrastructure upgrades, and software updates. Load balancers gracefully remove traffic from one or more endpoints to allow for such maintenance.

Effective application scaling helps organizations meet customer or user demand and avoid unnecessary billing or charges. During traffic increases, organizations may need to temporarily deploy more endpoints to ensure the service stays performant and available. However, constantly having enough endpoints online to meet your maximum possible traffic could be costly regardless whether the endpoint is located on-premises or via a cloud provider like AWS, GCP, or Azure. Load balancers allow for dynamic increases or decreases in capacity by monitoring requests, connections, and latency to the endpoints.

Another type of scale to consider is geographic scale. As services grow in popularity, endpoint location becomes more important. Users in a different geographic region than an endpoint may have slower response times and receive a lower quality of service than users in the same region. As organizations deploy new endpoints in different regions, they have to decide how they want to distribute their traffic. This challenge has been met by different layers of load balancing called global traffic management (GTM) and Private Network Load Balancing. This document describes both of these in detail in the following section — but in summary, the GTM load balancer handles the initial request (typically via DNS) and then selects and steers traffic to the Private Network Load Balancer that is deployed close to endpoints in the appropriate geographic region.

### Types of traffic management

As mentioned, load balancing for global applications and services comes in two layers. The first layer is called Global Traffic Management or Manager (GTM), which may also be called Global Server Load Balancing (GSLB). The second layer is called Private Network Load Balancing, which may also be referred to as Server Load Balancing (SLB). This section will define the purpose of these different types of load balancing and how they work together.

#### Global traffic manager / global traffic management (GTM)

A Global Traffic Manager is responsible for routing requests, generally from the Internet, to the proper region or data center. Many GTM load balancers operate at the DNS layer, allowing them to:

* Resolve a DNS request to an IP address based on geographic region or physical location.
* Provide the IP of the endpoint or service closest to the client, so it can connect.

Figure 4 shows how a GTM load balancer is used to select a data center based on the client location or region.

![Global traffic management steers traffic to the proper region or data center](https://developers.cloudflare.com/_astro/lb-ref-arch-4.OnwMof7d_Z1K1cGR.svg)

Global Traffic Managers can also proxy traffic and perform a variety of inspections, including reading/changing/deleting headers in HTTP requests and modifying URLs based on region or geographic location. GTM functionality is best implemented by cloud-based load balancers (like Cloudflare) since the goal is to steer traffic from anywhere in the world. Hardware load balancers exist in a single physical location, which means the further traffic originates from the load balancer, the slower the end-user experience. A cloud-based load balancer can run in many different geographic locations, helping it provide a performant solution for DNS-only, layer 4, and layer 7 contexts.

#### Private Network Load Balancing

Private Network Load Balancing steers traffic within a data center or geographic location. A Private Network Load Balancer can be responsible for load balancing, SSL/TLS offloading, content switching, and other application delivery functions. Private Network Load Balancing ensures efficient distribution of client requests across multiple endpoints to improve performance and ensure high availability. Private Network Load Balancers are usually placed inside private networks and are used to load balance publicly or privately accessible resources. In Figure 5 below, the GTM load balancer has selected the Europe data center to direct a request to the Europe data center’s Private Network Load Balancer which will then steer it to the appropriate endpoint.

![Private Network Load Balancing is responsible for steering to the final endpoint or destination](https://developers.cloudflare.com/_astro/lb-ref-arch-5.F19YgVWw_1xKcgo.svg)

Private Network Load Balancer and their endpoints usually sit behind firewalls. But while endpoints may be protected on private networks, accessibility to the Private Network Load Balancer can be either public or private depending on deployment requirements. A Private Network Load Balancer will monitor total requests, connections, and endpoint health to ensure requests are steered towards endpoints capable of responding in a timely manner.

#### On-premises vs cloud-based load balancers

There are two main load balancer architectures:

* On-premises load balancers

* Typically hardware-based, but also can be virtualized or software-based
  * Focused on maximum performance

* Cloud-based load balancers

* Software deployed public cloud infrastructure
  * Handle requests closer to the originator of the request

Each approach has advantages and disadvantages. On-premises load balancers usually exist inside of private networks completely controlled by the organization. These load balancers are collocated with the endpoints they are load balancing, so latency and RTT time should be minimal. The disadvantage of these on-premises load balancers is that they are restricted to a single physical location. Which means traffic from other regions can have long RTT and high latency in responses. Also, adding another data center requires purchasing and deploying all new equipment. On-premises load balancers also typically require cloud-based load balancers for geographic traffic steering to get requests routed by a geographically local or region-appropriate data center. The advantages of cloud-based load balancers is that they can operate in almost any geographic region without concern for rack space, power, cooling, or maintenance and can scale without concern for new chassis, modules, or larger network connections. Cloud-based load balancers do however increase latency and RTT between the load balancer and the endpoints as they are not typically colocated with the endpoints they are steering traffic toward.

## Cloudflare Load Balancing architecture and design

Cloudflare has offered cloud-based GTM since 2016 and started adding Private Network Load Balancing capabilities in 2023. This section will review the entire Cloudflare Load Balancing architecture and dive deep into the different configurations and options available. First, however, it's important to understand the benefits that Cloudflare Load Balancers have simply by running on Cloudflare’s global network.

### Inherent advantages in the Cloudflare architecture

Cloudflare Load Balancing is built on Cloudflare’s connectivity cloud, ​​a unified, intelligent platform of programmable cloud-native services that enable any-to-any connectivity between all networks (enterprise and Internet), cloud environments, applications, and users. It is one of the largest global networks, with data centers spanning over 330 cities and interconnection with over 13,000 network peers. It also has a greater presence in core Internet exchanges than many other large technology companies.

As a result, Cloudflare operates within \~50 ms of \~95% of the world’s Internet-connected population. And since all Cloudflare services are designed to run across every network location, all traffic is connected, inspected, and filtered close to the source for the best performance and consistent user experience.

Cloudflare’s load balancing solution benefits from our use of anycast technology. Anycast allows Cloudflare to announce the IP addresses of our services from every data center worldwide, so traffic is always routed to the Cloudflare data center closest to the source. This means traffic inspection, authentication, and policy enforcement take place close to the end user, leading to consistently high-quality experiences.

Using anycast ensures the Cloudflare network is well balanced. If there is a sudden increase in traffic on the network, the load can be distributed across multiple data centers – which in turn, helps maintain consistent and reliable connectivity for users. Further, Cloudflare’s large network capacity and AI/ML-optimized smart routing also help ensure that performance is constantly optimized.

By contrast, many other SaaS-based load balancing providers use Unicast routing in which a single IP address is associated with a single endpoint and/or data center. In many such architectures, a single IP address is then associated with a specific application, which means requests to access that application may have very different network routing experiences depending on how far that traffic needs to travel. For example, performance may be excellent for employees working in the office next to the application’s endpoints, but poor for remote employees or those working overseas. Unicast also complicates scaling traffic loads — that single service location must ramp up resources when load increases, whereas anycast networks can share traffic across many data centers and geographies.

Figure 6 shows how using the Cloudflare network allows geographically disparate users to connect to their resources as fast as possible.

![Cloudflare’s global anycast network ensures that the closest data center is always selected](https://developers.cloudflare.com/_astro/lb-ref-arch-6.Bw_DeAYw_1p6IbN.svg)

Figure 6, above, shows other Cloudflare services are also running in each of these data centers since Cloudflare runs every service in every data center so users have a consistent experience everywhere. For example, Cloudflare’s layer 7 load balancer will also be able to take advantage of other services such as DDoS protection, CDN/Cache, Bot Management, or WAF. All of these additional services can help protect your service from unnecessary traffic whether it be malicious requests (blocked by DDoS Protection, Bot Management, or WAF) or requests that can be served via cache rather than a request to endpoint. All of these services can be combined as needed to make a service or offering as protected, resilient, and performant as possible.

![Cloudflare Layer 7 features can be used together to further secure a service](https://developers.cloudflare.com/_astro/lb-ref-arch-7.BB-S-4sn_1aRfuI.svg)

Cloudflare also has a [network optimization service](https://blog.cloudflare.com/orpheus-saves-internet-requests-while-maintaining-speed/) that is constantly running at all data centers to ensure that Cloudflare provides the best path between Cloudflare data centers and also track all the available paths to endpoints. This allows Cloudflare to ensure that endpoints can always be reached and reroute traffic to alternate Cloudflare data centers, if necessary, to reach an endpoint. After the load balancer has made a decision on which endpoint to steer the traffic, the traffic is then forwarded to Cloudflare’s network optimization service to determine the best path to reach the destination. The path can be affected by a feature called Argo Smart Routing which, when enabled, uses timed TCP connections to find the Cloudflare data center with the fastest RTT to the endpoint. Figure 8 shows how Argo Smart Routing can help improve connection time to endpoints.

![Argo Smart Routing finds the fastest path between requester and endpoint](https://developers.cloudflare.com/_astro/lb-ref-arch-8.DxPypMMy_22dvJA.svg)

Another way traffic flow can be affected is by the use of Cloudflare Tunnels. This document covers Cloudflare Tunnels in depth in the following section. Because Cloudflare Tunnels connect endpoints to specific Cloudflare data centers, traffic destined for those endpoints must traverse those data centers to reach the endpoint. Figure 9 shows how connections to private endpoints connected via Cloudflare Tunnel must pass through the data center where the tunnel terminates.

![Requests take different paths depending on whether the endpoint is public or connected over Cloudflare Tunnel](https://developers.cloudflare.com/_astro/lb-ref-arch-9.coisSp9H_1EAgtQ.svg)

Usually, GTM and Private Network Load Balancers are either separate hardware or separate SaaS (GTM) and hardware Private Network Load Balancing components. Cloudflare’s GTM and Private Network Load Balancing capabilities are combined into a single SaaS offering which greatly simplifies configuration and management. There is no need to create a GTM load balancer and steer traffic to more local Private Network Load Balancers. All endpoints can be directly connected to Cloudflare and traffic is steered to the correct region, data center, and endpoint all from a single load balancer configuration. While the concepts of GTM and Private Network Load Balancing features will persist, their implementation in Cloudflare will be done in a way that keeps load balancer configurations as simple and straightforward as possible. Figure 10 illustrates how global traffic can be steered from any geographic region to a specific endpoint as needed.

![Combining GTM and Private Network Load Balancing functions into a single load balancer configuration](https://developers.cloudflare.com/_astro/lb-ref-arch-10.BICXl4Ld_Z1YULLg.svg)

### The structure of a Cloudflare Load Balancer

A Cloudflare Load Balancer, often referred to as a Virtual IP (VIP), is configured with an entrypoint. Typically, this entrypoint is a DNS record. The load balancer first applies a defined traffic steering algorithm to select an endpoint pool, which is a group of endpoints selected based on function, geographic area, or region. A load balancer configuration can have one or multiple endpoint pools, and each endpoint pool can have one or many endpoints. After selecting an endpoint pool, the load balancer applies an endpoint steering algorithm to the list of endpoints and selects an endpoint to steer the traffic towards. Figure 11 shows the basic steps from client request to endpoint within a Cloudflare Load Balancer.

![The steps within a Cloudflare Load Balancer](https://developers.cloudflare.com/_astro/lb-ref-arch-11.Bx2sEYiV_Z1UOFqd.svg)

The definition of a Cloudflare Load Balancer is divided into three main components:

1. Health monitors: these components are responsible for observing the health of endpoints and categorizing them as healthy or critical (unhealthy).
2. Endpoint pools: this is where endpoints are defined and where health monitors and endpoint steering are applied.
3. Load balancers: in this component, lists of endpoint pools and traffic steering policies are applied.

The following sections detail the options available and considerations for configuring a Cloudflare Load Balancer, starting with steering, which is utilized in both endpoint pool and load balancer configurations.

### Steering types and methods

Steering is the core function of a load balancer and steering methods ultimately determine which endpoint is going to be selected when a load balancer is engaged. From the load balancer’s perspective, steering can be applied in two key areas.

The first is called ‘traffic steering’, and it is responsible for determining which endpoint pool will handle incoming requests, typically based on proximity or geographic region of the requester. The concept of traffic steering closely aligns with the idea of global traffic management.

The second area where steering is applied is after a region, data center, or endpoint pool has been selected. At this point, the load balancer needs to select the single endpoint responsible for handling the request or connection, referred to as ‘endpoint steering’. Steering at both of these levels is done by applying steering methods tailored to the specific needs of the customer deploying the load balancer. There are several different algorithms to choose from, but not all algorithms are applicable to both steering types.

Below is an in-depth review of all the steering methods Cloudflare offers. At the end of this section, there is a quick reference table which can be helpful in understanding which algorithms are applicable to which use cases.

#### Traffic steering

Traffic steering selects the group of endpoints, also called an endpoint pool. The most common use of traffic steering is to select the endpoint pool based on the least latent response times, geographic region, or physical location. Traffic steering is closely aligned to global traffic management and serves as the initial step in directing traffic to an endpoint.

#### Endpoint steering

Endpoint steering is responsible for selecting which endpoint will receive the request or connection. Endpoint steering can randomly select an endpoint, a previously selected endpoint (if session affinity is enabled), or it can be used to select the least utilized, fastest responding, endpoint for a request or connection. Endpoint steering is closely related to Private Network Load Balancing, as it is responsible for selecting the final destination of a request or connection.

#### Weighted steering

Weighted steering takes into account the differences in endpoint pools and endpoints that will be responsible for handling requests from a load balancer. Endpoint weight, which is a required field for every endpoint, is only used when specific steering methods are chosen. Similarly, endpoint pool weight is only needed when specific steering methods are selected. Please see the [steering options overview](#steering-options-overview) section for a quick reference for when weights are applied.

Weight influences the randomness of endpoint pool or endpoint selection for a single request or connection within a load balancer. Weight does not consider historical data or current connection information, which means that weight may have variations in distribution over shorter timeframes. However, over longer periods of time and with significant traffic, the distribution will more closely resemble the desired weights applied in configuration. It’s important to note that session affinity will also override weight settings after the initial connection, as session affinity is intended to direct subsequent requests to the same endpoint pool or endpoint. Figure 12 shows a weight example for two endpoint pools with equal capacity and probability of being selected.

![A pair of endpoint pools with equal probability of being selected](https://developers.cloudflare.com/_astro/lb-ref-arch-12.Buje8NxO_OS9v8.svg)

Specific algorithms, such as Least Outstanding Request Steering, take into account the number of open requests and connections. Weight is used to determine which endpoints or endpoint pools can handle a greater number of open requests or connections. Essentially, weight defines the capacity of endpoints or endpoint pools, regardless of the selected steering method.

Weight is defined as any number between 0.00 and 1.00. It’s important to note that the total weight of the endpoint pools or the endpoints within an endpoint pool do not need to equal 1. Instead, the weights will be added together, and then an individual weight value is divided by that sum to get the probability of that endpoint being selected.

Weight to percentage equation: (endpoint weight) ÷ (sum of all weights in the pool) = (% of traffic to endpoint)

Below are some examples with diagrams to help in understanding how weight is used for distributing traffic. In these examples, it is assumed that the goal is to evenly distribute traffic across all endpoints with the same capacity or compute resources. [Random](#random-steering) traffic steering will be used to demonstrate traffic distribution across three endpoint pools.

* There are three endpoint pools defined, all with a weight of 1
* Each endpoint pool has a 33% probability of being selected

Example math for weight of 1: (1) ÷ (1 + 1 + 1) = (.3333) (or 33.33%)

![A set of three endpoint pools all with equal probability](https://developers.cloudflare.com/_astro/lb-ref-arch-13.BIZS6w9__Z2cTOVH.svg)

In this example, it was simple to apply 1 to all the weight values for each of the endpoint pools. However, it should be noted that any number between 0.01 and 1.00 could have been used as long as the same number was used across all three endpoint pools. For instance, setting all three pools to .1 or even .7 would have resulted in an equal probability that each pool would be selected to receive traffic.

Since the sum of the weights is used to calculate the probability, organizations can use any number of values to make these inputs easier to understand. In the following examples, since each endpoint has the same capacity, a value of .1 weight is assigned to each endpoint, and the sum of these values is used as the weight for the endpoint pool.

* There are three endpoint pools defined
* Each endpoint pool has a different number of endpoints, but all endpoints have equal capacity
* To evenly distribute load across endpoints, each endpoint pool needs a different probability

![Three endpoint pools with different numbers of endpoints](https://developers.cloudflare.com/_astro/lb-ref-arch-14.ChU-xE19_Z2bnfwR.svg)

Example math for weight of .4 : (.4) ÷ (.4 + .5 + .6) = (.2667) (or 26.67%)

Example math for weight of .5 : (.5) ÷ (.4 + .5 + .6) = (.3333) (or 33.33%)

Example math for weight of .6 : (.6) ÷ (.4 + .5 + .6) = (.4000) (or 40.00%)

It is possible that endpoints do not all have the same capacity. In the following example, one of the endpoint pool’s endpoints has twice the capacity of the endpoints in the other two endpoint pools.

* There are three endpoint pools defined
* Endpoint pool 1 has endpoints that have double the capacity compared to those in endpoint pool 2 and endpoint pool 3
* The goal is to place double the amount of traffic to endpoint pool 1 per endpoint
* Endpoint pool 1 has 4 endpoints but with double capacity, the weight of each endpoint will be valued at .2 for a total of .8 for the endpoint pool

![Three endpoint pools with different numbers of endpoints and endpoints of different capacity](https://developers.cloudflare.com/_astro/lb-ref-arch-15.CJwKtgsv_ZhFknv.svg)

Example math for weight of .8 : (.4) ÷ (.8 + .5 + .6) = (.4211) (or 42.11%)

Example math for weight of .5 : (.5) ÷ (.8 + .5 + .6) = (.2632) (or 26.32%)

Example math for weight of .6 : (.6) ÷ (.8 + .5 + .6) = (.3157) (or 31.57%)

In this final example, since the four endpoints in endpoint pool 1 are double the capacity of other endpoints, the calculation treats endpoint pool 1 as if it essentially has 8 endpoints instead of 4. Therefore, the weight value of .8 instead of .4 as shown in example 2.

These are just three simple examples illustrating how weight can be used to distribute load across endpoint pools or endpoints. The same calculations are used for weights applied to endpoints within an endpoint pool as well. However, the impact of using weights within different steering methods is similar, although with slightly modified calculations, as covered in the sections below.

Weights are most useful when one endpoint pool might have more resources than another endpoint pool or when endpoints within an endpoint pool do not have equal capacity. Weight helps to ensure that all resources are used equally given their capabilities.

#### Steering methods

Off - failover is the most basic of traffic steering policies. It uses the order of the endpoint pools as a priority list for selecting which pool to direct traffic towards. If the first pool in the list is healthy and able to receive traffic, that is the pool that will be selected. Since off - failover isn’t available for endpoint steering, another steering method will be used to select an endpoint. Off - failover is commonly used in active/passive failover scenarios where a primary data center or group of endpoints is used to handle traffic, and only under failure conditions, is traffic steered towards a backup endpoint pool.

##### Random steering

Random steering is available for both traffic steering and endpoint steering. Random spreads traffic across resources based on the weight defined at both the load balancer configuration and within the endpoint pool. The weight values set at the load balancer for each endpoint pool can differ from the weight value set per endpoint within that endpoint pool. For example, within a load balancer configuration, 70% of traffic can be sent to one of two endpoint pools, then within that endpoint pool, the traffic can be evenly distributed across four endpoints. The previous section, [weighted steering](#weighted-steering), provides a detailed explanation of how weight is used and the calculations that determine the selection of an endpoint pool or endpoint.

Hash steering is an endpoint steering algorithm that uses endpoint weight and the request’s source IP address to select an endpoint. The result is that every request from the same IP address will always steer to the same endpoint. It’s important to note that altering the order of endpoints or adding or removing endpoints from the endpoint pool could result in different outcomes when using the hash algorithm.

Geo steering is a traffic steering algorithm available to enterprise plan customers that is used to tie endpoint pools to specific countries or geographic regions. This option can be useful for improving performance by steering traffic to endpoints closer to users. It also aids in complying with laws and regulations by steering requests from users in specific regions to resources within the same region or to resources designed to meet specific regulatory requirements.

##### Dynamic steering

Dynamic steering is a traffic steering algorithm available to enterprise plan customers that creates round trip time (RTT) profiles. RTT values are collected each time a health probe request is made and based on the response from the endpoint to the monitor request. When a request is made, Cloudflare inspects the RTT data and sorts pools by their RTT values. If there is no existing RTT data for your pool in a region or colocation center, Cloudflare directs traffic to the pools in failover order. When enabling dynamic steering the first time for an endpoint pool, allow 10 minutes for the change to take effect as Cloudflare builds an RTT profile for that pool. Dynamic steering doesn’t use geographic boundaries in its decision making process and solely focuses on selecting the lowest RTT endpoint pool.

##### Proximity steering

Proximity steering is a traffic steering algorithm available to enterprise plan customers that steers traffic to the closest physical data center based on where the request endpointated.

Cloudflare determines the requester’s physical location using the following methods, in this order:

1. [EDNS Client Subnet](https://developers.google.com/speed/public-dns/docs/ecs) information, if provided in the DNS request
2. Geolocation information of the resolver used to reach Cloudflare
3. GPS location of the Cloudflare data center handling the request

Proximity steering requires providing GPS coordinates for all endpoint pools, allowing Cloudflare to calculate the closest endpoint pool based on the requesting IP, DNS resolver, or Cloudflare data center.

##### Least outstanding requests steering (LORS)

Least outstanding request steering (LORS) is available to enterprise plan customers and can be used for both traffic and endpoint steering.

LORS uses the number of unanswered HTTP requests to influence steering and is only functional when used with Cloudflare Layer 7 proxied Cloudflare Load Balancers. If LORS is assigned to any other type of load balancer, its behavior will be equivalent to random steering. LORS uses the counts of open requests, along with weight, to create a new transformed weight that is used for the steering decision.

Equation for LORS transformed weight:

* weight / (count + 1) = transformedWeight

Reminder for random weight calculation:

* weight / (total weight) = probability of being selected

Here’s an example of LORS:

* Pool A has a weight of 0.4
* Pool B has a weight of 0.6
* Pool A has 3 open requests
* Pool B has 0 open requests
* Relevant equation
  * weight / (count + 1) = transformedWeight
* Pool A's transformed weight: 0.4 / (3 + 1) = 0.1
* Pool B's transformed weight: 0.6 / (0 + 1) = 0.6
* Relevant equation
  * weight / (total weight) = probability of being selected
* Pool A’s probability of being steered toward: 0.1 / (0.1+0.6) = .1429 (14.29%)
* Pool B’s probability of being steered toward: 0.6 / (0.1+0.6) = .8571 (85.71%)

In this example, the next connection has a 14.29% probability of being steered to Pool A and a 85.71% probability of being steered to Pool B. While it’s likely that traffic will be steered towards Pool B, it is still possible for it to be steered to Pool A. In situations with lighter load conditions, there will be more variation in the steering results, which may not precisely match the configured weights. However, as the load increases, the actual steering results will closely match the configured weights.

When non-L7 proxied load balancers are used with LORS, the open request count information is not available. As a result, the denominator will always be 1. Since dividing any number by 1 doesn’t change the numerator, and in this case, the numerator is the weight, steering decisions will be made solely on weight. This results in the random method described above.

LORS is best used if endpoint pools or endpoints are easily overwhelmed by spikes in concurrent requests. It is well-suited for applications that value endpoint health over factors like latency, geographic alignment, or other metrics. This is especially useful when some or all requests put a heavy load on an endpoint and take a significant amount of time to generate a response.

#### Steering options overview

| Steering Method | Traffic Steering | Endpoint Steering | Weight-based | Enterprise-only |
| - | - | - | - | - |
| Off - Failover | X | | | |
| Random | X | X | X | |
| Hash | | X | X | X |
| Geo | X | | | X |
| Dynamic | X | | | X |
| Proximity | X | | | X |
| Least Outstanding Requests | X | X | X | X |

All traffic steering methods marked above as Enterprise-only can also be obtained as a self-service add-on as well. All endpoint steering methods marked as Enterprise-Only require an enterprise plan with Cloudflare.

A health monitor determines the health of endpoints once they are configured inside an endpoint pool. Health monitors generate probes, which are connection attempts to endpoints. Health monitors use the responses to the probes to record endpoint health. Health monitors serve as templates that include service type, path, and port, and advanced features such as interval, timeout, and protocol specific settings for evaluating endpoint health. The health monitor template is then applied to the endpoint pool, which contains endpoints hosting similar services. Once a health monitor is attached to the endpoint pool, the endpoint address is used as the destination for the health monitor probe. A single health monitor can be used across many endpoint pools, and health monitors are account-level objects, allowing them to be leveraged by multiple zones within the same Cloudflare account.

By default, health monitor probes are sent directly to the endpoint address, bypassing the entire layer 7 stack. This means that actual traffic to the endpoint through the load balancer will receive different treatment than the health monitor probe. Depending on the configuration, this could result in a health monitor reporting an endpoint as healthy, even if actual connections or requests are failing.

The Simulate Zone feature ensures that health monitor probes follow the same path as actual requests, passing through the entire layer 7 stack. This ensures health monitors take the exact same path through the network and through other layer 7 processes to reach the endpoint.

The Simulate Zone feature is required for health monitors when certain features are enabled, such as [Authenticated Origin Pulls (AOP)](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/), where probes would fail if they weren’t being provided with the proper mTLS certificate for authentication on the origin. Simulate Zone also ensures health monitor probes use the same path provided by [Argo Smart Routing](https://developers.cloudflare.com/argo-smart-routing/) and the same [Dedicated CDN Egress IPs](https://developers.cloudflare.com/smart-shield/configuration/dedicated-egress-ips/) when organizations leverage [Smart Shield Advanced](https://developers.cloudflare.com/smart-shield/get-started/#packages-and-availability) to restrict the edge IP addresses that Cloudflare uses to reach their endpoints.

![HTTPS health monitor to monitor the status of an endpoint](https://developers.cloudflare.com/_astro/lb-ref-arch-16.BYSozQzy_1111Rp.webp)

Health monitor Probes can be configured as the following types:

* HTTP
* HTTPS
* TCP
* UDP ICMP
* ICMP Ping
* SMTP
* LDAP

Once a health monitor is defined, it can be assigned to an endpoint and the probes will be sent to the endpoint at the interval defined. There are two additional settings to note in regards to the health monitor configuration within the endpoint pool. The first is the Health Threshold, which is used to determine how many endpoints within the pool need to be healthy in order to consider the endpoint pool to be healthy or degraded.

* Endpoint pool in healthy state
  * Contains only healthy endpoints

* Endpoint pool in degraded state
  * Contains at least one critical endpoint but remains at or above the health threshold setting

* Endpoint pool in critical state

* Contains healthy endpoints below the health threshold
  * Not capable of handling traffic; removed from all steering decisions.

![Comparison of three endpoint pools with different numbers of healthy endpoints](https://developers.cloudflare.com/_astro/lb-ref-arch-17.BM3mVtFf_n523H.svg)

The second setting after defining the health monitor in the endpoint pool is to define which regions the health monitor probes should source from inside the Cloudflare global network. The available selections are listed below:

* All Regions (Default)
* All Data Centers (Enterprise Only)
* Western North America
* Eastern North America
* Western Europe
* Eastern Europe
* Northern South America
* Southern South America
* Oceania
* Middle East
* Northern Africa
* Southern Africa
* Southern Asia
* Southeast Asia
* Northeast Asia

![Endpoint pool settings to further customize the health monitors](https://developers.cloudflare.com/_astro/lb-ref-arch-18.BeeIf21t_2sOzXz.webp)

With the exception of “All Regions” and “All Data Centers”, health monitor probes will only originate from data centers in the selected region or regions. For locally relevant services, it may not matter whether or not a data center on the other side of the world can reach the endpoints. Therefore, limiting checks to a specific region or a set of regions may make sense. The selection of “All Regions” or “All Data Centers” is intended to be used for globally available services where reaching a set of endpoints could be crucial to the function of the application.

### Endpoints and endpoint pools

Endpoints are the actual servers that handle connections and requests after a load balancer has applied all its policies. Endpoints can be physical servers, virtual machines, or serverless applications. As long as they can handle a request or connection from a user or client, they can be considered an endpoint. There are several different methods of defining and connecting endpoints to Cloudflare and the next section details those methods.

#### Connecting endpoints to Cloudflare

Cloudflare endpoints can be defined in two ways, by IP address or by hostname. IP addresses are the most straightforward and basic of connection methods, hostnames offer a few options to consider. A hostname can be defined in Cloudflare DNS and it can be proxied or DNS-only (unproxied). Another option, of course, is that the hostname is not in a domain which Cloudflare is an authoritative DNS server for which means Cloudflare will rely on outside DNS servers to resolve that hostname to an IP address. Cloudflare Tunnel can also be used and offers two different options as well. These methods are discussed below in this section.

##### Cloudflare proxied, DNS, IP, and non-Cloudflare endpoints

As mentioned in the “HTTP(S) Load Balancing” section above, load balancing is the very last process run before a request is sent to an endpoint. In the case of however, even if an endpoint is proxied via Cloudflare’s edge, after the load balancer, the request is forwarded directly to the endpoint without passing through the layer 7 stack again. This doesn’t mean the endpoint is unprotected or uncached, however. As long as the load balancer itself is proxied then all those protections are provided to the load balancer rather than the endpoints. Any direct communication with the endpoint can still be proxied and treated with Cloudflare’s layer 7 stack, but communication with an endpoint places all the processing in front of the load balancer, not the endpoint. Figure 19 illustrates the difference of where the Cloudflare layer 7 stack is placed in relation to the endpoint(s).

![Load balancing is the last process before dispatching to the endpoint](https://developers.cloudflare.com/_astro/lb-ref-arch-19.CKZfc_hA_rdOtw.svg)

There are very few differences from a load balancer perspective when it comes to what type of endpoint is defined as part of an endpoint pool. Once the traffic and endpoint steering policies and the load balancer rules are applied, the Cloudflare Load Balancing service instructs the L7 stack where to forward the incoming request or connection. This request is sent directly to the endpoint. Depending on the type of connection to the endpoint, there may be a different path. Features like Argo Smart Routing or tunnel-connected endpoints that are terminated at different Cloudflare data centers will route traffic differently rather than sending the request out of the Cloudflare edge, over the internet, directly to the endpoint. Regardless of the path, however, load balancing is the last process in the stack and this means that traffic doesn’t receive any additional treatment. So while the connection to endpoint can change the path from Cloudflare to the endpoint, the treatment or processing doesn’t change once an endpoint is selected.

##### Cloudflare Tunnel

Cloudflare Tunnel is an outbound connection that enables organizations to simplify their firewall configurations, reduce complexity, enhance security, and more easily join their assets to the Cloudflare network. The executable that creates these tunnels is called cloudflared and may be referenced in this document and diagrams that follow.

Cloudflare Tunnel (cloudflared) can be installed directly on the endpoint or any server with IP connectivity to the endpoint. And because the connection to Cloudflare is initiated from where Cloudflare Tunnel was installed to Cloudflare, the only access needed is outbound access to Cloudflare. A single Cloudflare Tunnel can transport traffic to one or many different endpoints in one of two different ways, one which results in the endpoint being publicly accessible and one which keeps the endpoint completely only accessible privately.

Cloudflare Tunnel can be installed on the endpoint itself or on any server with layer 3 (IP) connectivity to the endpoint or endpoints that need to be connected to Cloudflare. The decision to separate cloudflared could be made for many different reasons including but not limited to isolating the endpoint(s) and ensuring their performance, having separate teams that manage network level connectivity and endpoints, or separation for architectural simplicity where servers have segregated roles or responsibilities.

![A single cloudflared instance tunnels traffic for multiple endpoints](https://developers.cloudflare.com/_astro/lb-ref-arch-20.BehqGz1M_Z2cqnXw.svg)

A single cloudflared instance will create 4 different tunnels, two tunnels in two different Cloudflare data centers. This model ensures high availability and mitigates the risk of individual connection failures. This means in event a single connection, server, or data center goes offline, the endpoints will remain available. Cloudflare Tunnel also allows organizations to deploy additional instances of cloudflared, for availability and failover scenarios. These unique instances are called replicas. Each replica establishes four new connections which serve as additional points of ingress to the endpoint(s). Each of the replicas will point to the same tunnel. This ensures that your network remains up in the event a single host running cloudflared goes down. By design, replicas do not offer any level of traffic steering (random, hash, or round-robin).

###### Public hostname

The public endpoint method allows organizations to define a tunnel that points to a specific service or port running on an endpoint. The tunnel can terminate on the endpoint or on any server with IP connectivity to the endpoint. Using this public hostname method requires that each service that will be accessed over the tunnel is defined in the tunnel configuration. When configured, a unique tunnel ID, such as d74b3a46-f3a3-4596-9049-da7e72c876f5, will be created for the IP and port or service for which the tunnel is connecting traffic. This tunnel ID is then created into a unique public hostname in the Cloudflare-owned domain of cfargotunnel.com which results in a DNS A record being created that points directly to that service, I.E. d74b3a46-f3a3-4596-9049-da7e72c876f5.cfargotunnel.com. While this hostname is public it can only be accessed or utilized by traffic that is sent through the account that owns the Cloudflare Tunnel configuration. No other accounts would be able to access or send traffic directly to this DNS address. A DNS CNAME record created outside of the account that owns the cfargotunnel.com hostname will not be able to send traffic through that specificCloudflare Tunnel.

When configured via the Dashboard, Cloudflare automatically creates a CNAME record in the DNS zone that refers to the cfargotunnel.com hostname. For example, a CNAME record of myTunnelService.example.com could be created to point the A record of d74b3a46-f3a3-4596-9049-da7e72c876f5.cfargotunnel.com. The main benefit being the ease of use and administration as the CNAME record is much more suggestive about its purpose and belongs to the customer DNS zone.

Another option is to create these tunnels and services on the host running cloudflared. This is called a [locally-managed tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/). When working with locally-managed tunnels, the CNAME entry is not created automatically however, so the organization would have to configure this manually, after the tunnel and service is defined.

From a load balancer perspective, it's very important to understand how these tunnels can be used as an endpoint. An endpoint can only be defined by using the cfargotunnel.com hostname. Using a public CNAME record that points to the cfargotunnel.com address will not work properly and is not supported. This is especially important for endpoint services that don’t operate on ports 80 or 443. Cloudflare Load Balancers default to these two ports to access the services running on the endpoints. If an organization has services running on other ports, they will need to configure a Cloudflare Tunnel with a [catch-all rule](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/configuration-file/#how-traffic-is-matched) to reach that port. This configuration allows a Cloudflare Load Balancer to reach the service via port 443 while having Cloudflare tunnel proxy the connection to the desired port on the endpoint.

The second method is for private subnets. This method allows organizations to define private IP addresses and a subnet mask which will be used to create a private virtual network within the Cloudflare global network. The private subnet method does not allow the definition of a port and as such, once a subnet and mask are defined, the entire subnet can be reached over that tunnel but only to users within the organization that are allowed access via defined Zero Trust policies.

This subnet then gets added to the virtual network inside of Cloudflare where the customer can control how users can access it and which users can access it. This subnet can be defined for any desired subnetting or routing, including using a 32-bit mask (single IP address, i.e., 10.0.0.1/32). The allowed subnet does not need to exist on the host that is running the cloudflared process either. All that is required is layer 3 or IP connectivity between the host running cloudflared and the subnet that is going to be reachable over Cloudflare Tunnel.

#### Endpoint pool details

Within the endpoint pool, there are several configuration options. This section details what these configuration options are and how they alter the behavior of a Cloudflare Load Balancer.

##### Endpoint steering

The first configuration, besides defining a name and description of the endpoint pool, is to determine the endpoint steering method. Endpoint steering is responsible for ultimately selecting the endpoint or endpoint that will receive the request or connection attempt (please refer to the [Steering methods](#steering-methods) section for a detailed description of each method).

Individual endpoints are defined within endpoint pools, and the endpoint pool allows for one or more endpoints to be defined per pool.

* The *endpoint name* is primarily used for reference, reporting, and analytics; it does not affect the function of the load balancer or endpoint pool.

* The *endpoint address*, however, defines a resource that the load balancer can use to handle a request or connection.

* Endpoints within an endpoint pool must be accessible over port 80 or 443. If the endpoint is not listening on port 80 or 443, then either a proxy service or network port forwarding device needs to be placed in front of the endpoint to map port 80 or 443 to the port that the service is actually listening on.
  * Another method for mapping ports of endpoints to 80 or 443 is to connect to the endpoint service using [Cloudflare Tunnel](#cloudflare-tunnel), and then use the hostname created through that process as the endpoint address. This will automatically map the intended endpoint port to port 443.

*Endpoint address* can be defined in one of the following ways:

* Publicly routable IP address
* Cloudflare-proxied publicly reachable hostname
* Publicly reachable non-Cloudflare hostname
* Private, non-publicly routable IP address with the selection of a virtual network

##### Virtual networks

Using public IPs and hostnames of any type require no additional configuration. In those scenarios, the virtual network should be set to the default value of “*none*”. The “*none*” setting signals that these resources will be accessible on the public Internet, routed via Cloudflare’s global edge network.

The use of the *virtual network* option is reserved for private IP resources. This setting maps to IP subnets that are hosted behind [Cloudflare Tunnel configurations](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/). A virtual network should be selected that has a route to the IP address of the endpoint. To navigate to this setting in the Cloudflare Dashboard, select *Networks - Routes* from the Zero Trust page.

##### Endpoint weight

*Endpoint weight* is only used for the random, hash, and least outstanding request steering methods; it must always be defined as part of the endpoint definition. (Please refer to the [Weighted Steering](#weighted-steering) section for more information on how weights are used for endpoint selection.)

##### Host header modification

Endpoint pools allow for the host header to be modified before dispatching a request to an endpoint. This configuration only applies to the HTTP(S) layer 7 load balancer (it will be ignored when used with layer 4 load balancers, including private IP and Spectrum).

Within a layer 7 load balancer where requests are HTTP(S)-based, the Host header tells the endpoint which website is being requested, as a single endpoint may host several different web domains. When an endpoint is specifically configured to host a web domain, it may either not respond or send a failure response to a request for a resource, if it does not believe it is hosting the resource requested in the Host header (i.e., if there are mismatched Host headers).

* Say a user tries to reach `www.example.com`. The load balancer will be configured with the hostname of `www.example.com`to receive all the requests.
* Since the endpoints can’t have the same public hostname in DNS, its hostname is `endpoint1.example.com`.
* When the user makes a request to `www.example.com,` the Host header will be set to` www.example.com,` as well. The endpoint will need to be configured to respond to Host headers of `www.example.com`.
* In some cases (such as with certain cloud or SaaS applications), however, endpoints aren’t configurable in that manner, so the endpoint may receive a request with an unknown Host header and fail to respond appropriately.
* In this example, in the endpoint configuration, setting the Host header for the endpoint to the endpoint address of `endpoint1.example.com` will replace the Host header of `www.example.com` with `endpoint1.example.com`, and will allow the endpoint to properly respond to this request.

Figure 21 highlights the potential problem of mismatched Host headers:

![Mismatched Host headers may result in the endpoint rejecting the request](https://developers.cloudflare.com/_astro/lb-ref-arch-21.Bs0qP_r-_Z2k4TJ6.svg)

Also, at the endpoint pool, GPS coordinates for the pool (which are used with proximity traffic steering) can be defined. If proximity steering is not being used, then these coordinates are not required (please refer to the [Proximity Steering](#proximity-steering)).

[Load shedding](https://developers.cloudflare.com/load-balancing/additional-options/load-shedding/) — a real-time response available to administrators to protect against endpoints in a pool that are [becoming unhealthy ](https://developers.cloudflare.com/load-balancing/understand-basics/health-details/)— is also configured on the endpoint pool.

The load shedding setting is not intended to be enabled unless an administrator is trying to actively protect an endpoint pool from becoming unhealthy. It is activated, for example, when an endpoint that is still responding to requests is experiencing increased CPU or memory usage, increased response times, or occasionally failing to respond at all.

When an endpoint pool’s health begins to degrade, load shedding can help direct some of the existing loads from one endpoint pool to another.

Depending on the health of the endpoint pool, it may be enough to simply shed or redirect new requests and connections away from the endpoint pool. This policy applies to traffic, which is not subject to any session affinity rules since these are new connections that haven’t had an endpoint pool or endpoint selected yet (and, therefore, will not potentially affect the end user experience).

Should an endpoint pool approach critical failure due to load, the next option is to shed additional session affinity traffic. This will start to redirect requests and connections that are bound to endpoint pools through session affinity as well. However, please note that because this process can ultimately change the user’s endpoint, it could impact the end user’s experience. Ultimately, the impact is determined by the application that is being load balanced, and how much connection context is shared between endpoints.

##### Health monitors

Health monitors are attached to endpoints at the endpoint pool as well as health threshold and the health check region selection. Details of these options can be found in the [health monitor](#health-monitors) section.

Load balancing within Cloudflare combines both GTM and Private Network Load Balancing into a single load balancer configuration. While certain features or terms may align more with GTM or Private Network Load Balancing, for Cloudflare customers, both are combined into a single, easy-to-manage instance.

Depending on their specific use case, organizations can leverage different types of Cloudflare Load Balancers. The following section highlights the main differences between the deployment models, and articulates when each type of load balancer should be implemented.

Figure 22 highlights all the possible combinations of load balancers and endpoints supported by Cloudflare:

![All the possible combinations of load balancer and endpoint types](https://developers.cloudflare.com/_astro/lb-ref-arch-22-ALT.DPr9OdxY_1NmnXS.svg)

#### Deployment models

Cloudflare offers three load balancing deployment models, each of which support different use cases, functionality, and privacy requirements.

* [Layer 7 HTTP(S) load balancing](#layer-7-https-load-balancing)
* [DNS-only load balancing](#dns-only-load-balancing)
* [Spectrum load balancing](#spectrum-load-balancing)

Except for the DNS-only load balancing option described in more detail below, all of the deployment models anchor traffic through the load balancer. This means the user or client creating the request or connection is never aware of the endpoints that are being used to service the request or connection. Endpoint information can certainly be exposed — if desired — through the use of headers, but this is not default behavior for any of these anchored deployment models.

The following explores the four main deployment models (and their differences) in more detail.

##### Layer 7 HTTP(S) load balancing

First, the most common model is the **HTTP(S)-based layer 7 proxied load balancer**. These load balancers exist on Cloudflare’s edge and are publicly reachable. Amongst other features, this model supports [WebSockets](https://developers.cloudflare.com/network/websockets/), which are open connections between the client and endpoint allowing for data to be passed back and forth between the two.

Because this same layer 7 security stack also provides WAF, DDoS protection, Bot Management, Zero Trust, and other services, accessing these public load balancers can be restricted to authenticated and authorized users as needed. (Please refer to [Securing Load Balancers](#protecting-and-securing-load-balancers) for more information.)

In this layer 7 stack, load balancing can further improve the performance, reliability, and reachability of an organization’s public-facing web assets. The endpoints for these load balancers may be deployed in public cloud, private cloud, on-premises, or any combination thereof within the same load balancer. (Please refer to [Connecting endpoints to Cloudflare](#connecting-endpoints-to-cloudflare) for more details about how to connect endpoints to Cloudflare’s edge network).

![Layer 7 load balancing request flow to two different types of endpoints](https://developers.cloudflare.com/_astro/lb-ref-arch-23-ALT.DRZo2XIF_1NmnXS.svg)

As illustrated in Figure 23 above, the load balancing component of the layer 7 stack is the last process run on a request as it moves towards the endpoint. This can have a large positive impact on increasing performance and reducing load on endpoints.

For example, caching can prevent requests from ever reaching the endpoint and can be responded to without ever having to engage the load balancers. Also, WAF, DDoS protection, and Bot Management can eliminate attack traffic altogether — leaving more capacity for legitimate traffic.

Once a request reaches the load balancer process, the request is always sent directly to the endpoint that was selected. This means that even if the endpoint is proxied through Cloudflare, the request will be sent directly to the endpoint and receives no further processing.

For customized treatment after the load balancer selects an endpoint, the load balancer’s Custom Rules are applied. (This is covered in detail in the [Load balancers](#load-balancers) section below).

**Important notes about Layer 7 HTTP(S) load balancers:**

* Layer 7 HTTP(S) load balancers support both public and private endpoints
* Layer 7 HTTP(S) load balancers will only support HTTP(S) and WebSocket traffic
* Zero trust policies can be applied to Layer 7 HTTP(S) load balancers

##### DNS-only load balancing

Cloudflare’s DNS-only load balancer is an unproxied load balancer. This means that only the initial DNS request for the resource — not the actual traffic — passes through the Cloudflare edge. Therefore, instead of a DNS request resolving to a Cloudflare IP and then moving through the layer 7 stack as seen earlier in Figure 7, Cloudflare receives a DNS request for a DNS-only load balancer, applies all the appropriate load balancing policies, then returns an IP address to the requesting client to reach out directly.

Because all the traffic between the client and the endpoint will travel directly between the two and not through Cloudflare’s layer 7 stack, any type of IP traffic can be supported by a DNS-only load balancer.

![The orange cloud icon represents a proxied Layer 7 Cloudflare Load Balancer](https://developers.cloudflare.com/_astro/lb-ref-arch-24.Bw_izDOL_2nwuob.webp)

![The gray cloud icon represents an unproxied (DNS-only) load balancer](https://developers.cloudflare.com/_astro/lb-ref-arch-25.Dz4ThM-k_Z1j5Aba.webp)

Even though Cloudflare does not proxy these types of load balancer connections, the health monitor service is still monitoring the health on all the endpoints in the pool. Based on the health or availability of an endpoint, a Cloudflare DNS-only load balancer will either add or remove an applicable endpoint to a DNS response to ensure that traffic is being steered to healthy endpoints.

![DNS-only load balancers only use Cloudflare to respond to a DNS request](https://developers.cloudflare.com/_astro/lb-ref-arch-26.BB1TuXz__i3C3S.svg)

After a DNS-only load balancer has selected an endpoint pool via traffic steering, one or many IP addresses may be returned in the DNS response.

The decision to send one or many IP addresses within the DNS response is based on the weight assigned to the endpoints within the selected endpoint pool:

* If all the weights are equal across all endpoints, all IP addresses of all the endpoints will be returned in DNS response.
* If at least one endpoint is specified with a unique weight within the endpoint pool, then only a single IP address will be returned in the DNS response — regardless of the endpoint steering method selected on the endpoint pool.

This gives organizations the flexibility to allow applications to be aware of all the endpoints and perform local failover, or to allow Cloudflare to provide a single IP for an application to utilize.

Figure 27 shows how the defined weight within an endpoint pool can affect how a DNS-only load balancer responds.

![DNS-only load balancers can respond to DNS requests with one or many IP addresses](https://developers.cloudflare.com/_astro/lb-ref-arch-27.CJr7dL0T_17dOG.svg)

Please note that DNS-only load balancers have a few limitations compared to proxied load balancers:

* The load balancer no longer hides the endpoint’s IP address from the client as it is sent back to the client directly.
* They do not have the built-in layer 7 stack services mentioned in the previous model; i.e., DNS-only load balancers do not include caching, WAF, DDoS protection, or Zero Trust support.
* Session affinity is limited to `ip_cookie`, which will select an endpoint deterministically and then map that endpoint to the client IP address for all subsequent requests.
* Finally, because connections are not proxied through the load balancer for DNS only, certain steering methods will not work either. For example, [LORS](#least-outstanding-requests-steering-lors) will not work since Cloudflare will not be aware of the connections to the endpoints. These steering methods will revert to random weighted steering.

For more information on additional steering methods, please refer to the [Steering](#steering) section.

There are also client and resolver DNS cache considerations when using DNS-only load balancers. The cache life is determined by the DNS server answering the request. The [Time-to-Live (TTL)](https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/) value tells a DNS requester how long the response is valid before the client should send a new DNS request to see if the destination has changed. The TTL is calculated in seconds, so — for example — a TTL value of 3600 equates to a TTL of one hour. However, standard DNS TTL values are usually either 12 or 24 hours or 43200 and 86400 respectively.

The TTL of a DNS-only load balancer is set to 30 (seconds). This ensures that as endpoint health changes or endpoints are added or deleted, the DNS-only load balancer is queried more often to provide the most accurate list of available endpoints possible.

**Important notes about DNS-only load balancers:**

* DNS-only load balancers support only public endpoints
* DNS-only load balancers do not proxy traffic — and — as such, are not involved in the connections to endpoint
* DNS-only load balancers only respond to a DNS request with an IP address or set of IP addresses

##### Spectrum load balancing

Cloudflare also offers another ingress method via the [Spectrum](https://developers.cloudflare.com/spectrum/) product.

Where the layer 7 stack only supported HTTP(S) and WebSockets, Spectrum offers support for any TCP- or UDP-based protocol. A Cloudflare Load Balancer using Spectrum as an ingress for traffic operates at layer 4, where both TCP and UDP protocols exist. Any service that utilizes TCP or UDP for transport can leverage Spectrum with a Cloudflare Load Balancer including SSH, FTP, NTP, SMTP, and more.

Given the breadth of services and protocols this represents, the treatment provided is more generalized than what is offered with the layer 7 HTTP(S) stack. For example, Cloudflare Spectrum supports features such as TLS/SSL offloading, DDoS protection, IP Access lists, Argo Smart Routing, and session persistence with our layer 4 load balancers.

![Spectrum-based load balancing supports public endpoints](https://developers.cloudflare.com/_astro/lb-ref-arch-28-ALT.Dwf-s8s__1NmnXS.svg)

Cloudflare layer 4 Spectrum load balancers are publicly accessible. Access to these load balancing resources can be managed using a Spectrum configuration called *IP Access Rules,* which can be defined as part of a WAF configuration, but are limited to rules created with the “allow” or “block” action for specific IP addresses, subnets, countries, or [Border Gateway Protocol (BGP)](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/) Autonomous System Numbers (ASNs).

In addition to being public, Spectrum load balancers are always proxied. The proxy setting shown earlier (Figures 24 and 25) will be ignored when Spectrum is configured as the ingress path for the load balancer. All traffic destined for Spectrum-based load balancers will always pass through the Cloudflare edge.

**Important notes about Spectrum load balancers:**

* Spectrum load balancers support both public and private endpoints
* Spectrum load balancers are initially created as Layer 7 HTTP(S) load balancers. A Spectrum application is then created with a Load Balancer endpoint type, and the load balancer that has already been created is selected.
* Spectrum load balancers are always proxied, regardless of the proxy setting on the load balancer configuration
* There is no ability to change the ingress port from the Internet via Spectrum to the endpoint; i.e., if the traffic comes in on port 22 to Spectrum, it will be steered to port 22 on the endpoint
* Spectrum load balancers only support session affinity using the hash endpoint steering method
* Spectrum load balancers do not support Custom Rules

##### Deployment models at-a-glance

| Load Balancer Model | Public | Proxied | OSI Layer | Traffic Type |
| - | - | - | - | - |
| Layer 7 HTTP(S) | X | X | 7 | HTTP(S) |
| DNS-Only | X | | 7 (DNS) | IP-Based |
| Spectrum | X | X | 4 | TCP/UDP |

#### Load balancer details

The hostname setting is the publicly-reachable hostname for the load balancer. The hostname must be created within the zone for which the load balancer is being created.

The proxy setting determines whether Cloudflare will proxy traffic for the load balancer or simply provide a DNS reply with the endpoints for the client to directly connect. This is covered in detail in the [Deployment models](#deployment-models) section.

##### Session affinity

Session affinity, also known as session persistence or sticky sessions, keeps a client connected to the same endpoint for all subsequent requests after the first request or connection. This can be an important feature for applications that don’t share session data — the context of a user’s interaction with a web application — between endpoints. For example, if a new endpoint were selected in the middle of a client session and information about the session (e.g. the contents of a user’s shopping cart) were lost, the user experience for that application would be poor.

Cloudflare offers three methods for enabling session affinity:

1. **By Cloudflare cookie only (cookie):** On the first request to a proxied load balancer, a cookie is generated, encoding information of which endpoint the request will be forwarded to. Subsequent requests (by the same client to the same load balancer) will be sent to the endpoint that the cookie encodes for a) the duration of the cookie and b) as long as the endpoint remains healthy. If the cookie has expired or the endpoint is unhealthy, a new endpoint will be calculated and used.
2. **By Cloudflare cookie and Client IP fallback (ip\_cookie):** This behaves similar to the cookie method above, except that the cookie is generated based on the client IP address. In this case, requests from the same IP address always get steered towards the same endpoint for a) the duration of the cookie and b) as long as the endpoint remains healthy. If the cookie has expired or the endpoint is unhealthy, a new endpoint will be calculated and used.
3. **By HTTP header (header):** On the first request to a proxied load balancer, a session key is generated based on the configured HTTP headers. Subsequent requests to the load balancer with the same headers will be sent to the same endpoint, for a) the duration of the session or b) as long as the endpoint remains healthy. If the session has been idle for the duration of session affinity time-to-live (TTL) seconds or the endpoint is unhealthy, then a new endpoint will be calculated and used.

These three session affinity options only apply to layer 7 HTTP(S) load balancers. Session affinity requires a TTL, which determines how long the load balancer will route subsequent requests to a specific endpoint. The default TTL is 82,800 seconds (23 hours), but it can be set for anywhere from 1,800 seconds (30 minutes) to 604,800 seconds (seven days).

For cookie-based session affinity, the expiration timer is never reset, meaning that the timer is counting down from the start of the session — regardless of the session being idle or active. HTTP header-based session affinity will reset the expiration timer every time there is activity in the session.

##### Endpoint draining

Endpoint draining is a subfeature of session affinity. It allows for sessions to gracefully expire from an endpoint while not allowing new sessions to be created on that same endpoint. Endpoint draining is useful for maintenance, as it does not require administrators to arbitrarily or abruptly cut off user sessions in order to remove all active sessions from an endpoint.

The endpoint drain TTL is the amount of time that endpoints will be allowed to maintain active sessions before being forcefully terminated. Once the endpoint drain TTL is set, endpoint draining is started by disabling an endpoint (or multiple endpoints) within an endpoint pool. As seen in the below image, administrators can monitor the time remaining on an endpoint drawing operation from the load balancer UI.

![Endpoint draining in process from web user interface](https://developers.cloudflare.com/_astro/lb-ref-arch-30.todYN9Ax_Z1UWTmb.webp)

Endpoint draining is only applicable for session affinity because without session affinity, subsequent requests or connections are not guaranteed to be steered to the same endpoint. Thus, disabling an endpoint does not have an impact on user experience.

##### Zero-downtime failover

Zero-downtime failover automatically sends traffic to endpoints within an endpoint pool during transient network issues.

Zero-downtime failover will trigger a single retry only if there is another healthy endpoint in the pool and a [521, 522, 523, 525 or 526 error code](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-521/) is occurring. No other error codes will trigger a zero-downtime failover operation.

These response codes are not returned from the endpoint, but from requests made by upstream Cloudflare services to an organization's endpoints.

Zero-downtime failover has three modes of operation:

1. **None (Off):** No failover will take place and users may receive error messages or a poor user experience.
2. **Temporary:** Traffic will be sent to other endpoint(s) until the endpointal endpoint is available again.
3. **Sticky:** The session affinity cookie is updated and subsequent requests are sent to the new endpoint moving forward as needed. This is not supported when session affinity is using HTTP header mode.

##### Adaptive routing - failover across pools

*Adaptive routing - failover across pools* extends the functionality of zero-downtime failover by allowing failover to extend to endpoints in another endpoint pool, rather than only failing over to an endpoint in the *same* pool.

Endpoint pools are configured in a priority order and can be rearranged as needed. This priority order is only considered when using *Off - Failover traffic steering;* otherwise, endpoint pools will be selected based on the criteria outlined in the [Steering methods](#steering-methods) section.

The endpoint pools assigned to a load balancer represent the entire collection of endpoints that could possibly handle requests or connections through the load balancer. An endpoint pool typically contains endpoints that all have the same capabilities and are in the data center or geographic region. All endpoints in a pool should be capable of handling any request directed to an endpoint pool. For more information about endpoint pools, please refer to the [Endpoint pools](#endpoint-pools) section.

A fallback pool is the pool of last resort. When all endpoint pools are unavailable or unhealthy, the fallback pool will be used for all requests and connections. While health monitor data is always considered when steering traffic within a load balancer, a fallback pool does not rely on this data and is not subject to it.

##### Health monitors

Health monitors are usually configured as part of the endpoint pool. Health monitors can be added, changed, or deleted as part of the load balancer configuration. Please see the [Health monitors](#health-monitors) section for more information.

##### Traffic steering

Traffic steering is the method of steering between endpoint pools. For help understanding which traffic steering method to select, please see the [Steering types and methods](#steering-types-and-methods) section.

[Custom rules](https://developers.cloudflare.com/load-balancing/additional-options/load-balancing-rules/) allow users to perform actions on requests or connections before the load balancer finishes its decision process. Custom rules are configured with expressions that match certain [fields](https://developers.cloudflare.com/load-balancing/additional-options/load-balancing-rules/reference/) in requests or connections. Once the expression is created to match traffic, an [action](https://developers.cloudflare.com/load-balancing/additional-options/load-balancing-rules/actions/) is assigned for when a request or connection matches the expression.

Custom rules are a powerful tool for customizing the steering and output from a load balancer before the request or connection is sent to the endpoint. For example, the HTTP method (e.g. GET, PUT, POST) could be matched to ensure that POST messages are sent to a specific endpoint pool dedicated to handling receiving information from clients.

Alternatively, that session affinity TTL could be reset based on a request going to a specific URL path to ensure that the client has enough time to complete the transaction.

It is not possible to document all of the potential combinations of fields that can be matched and actions that can be taken. However, the following resources describe all of the fields and actions that are currently available:

* [Supported fields and operators](https://developers.cloudflare.com/load-balancing/additional-options/load-balancing-rules/reference/)
* [Load Balancing actions](https://developers.cloudflare.com/load-balancing/additional-options/load-balancing-rules/actions/)

If the default behavior of a load balancer is not covered in the documents listed above, it is likely that a custom rule can help meet unique use case requirements.

### Protecting and securing load balancers

#### Inherent security

All Cloudflare Load Balancer deployment models come with inherent protections. The following section briefly highlights the default security Cloudflare provides, as well as optional protections that can be added in front of Cloudflare Load Balancers:

* Proxied HTTP layer 7 load balancer (Public)

* [DDoS protection](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/) to protect against attacks
  * WAF with [Cloudflare managed ruleset](https://developers.cloudflare.com/waf/managed-rules/reference/cloudflare-managed-ruleset/) and [OWASP ruleset](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/) to block known vulnerabilities and exploits

* DNS-only load balancer (Public)
  * [DNS DDoS protection](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/) to ensure a DNS-only load balancer is always available

* Spectrum layer 4 load balancer (Public)
  * [DDoS Protection](https://developers.cloudflare.com/spectrum/about/ddos-for-spectrum/) to protect against layer 4 attacks

#### Additional options

Cloudflare offers additional security layers that can be used in conjunction with load balancing to protect any services — including websites, APIs, HTTP(S)-based services, and more:

* Proxied HTTP layer 7 load balancer (Public)

* [Bot management](https://developers.cloudflare.com/bots/) to control which bots can access resources
  * [WAF](https://developers.cloudflare.com/waf/) for creating custom rules for web applications
  * [Page Shield](https://developers.cloudflare.com/page-shield/) for monitoring script usage on web applications
  * [API Shield](https://developers.cloudflare.com/api-shield/) for protecting APIs

* DNS-only load balancer (Public)
  * [DNSSEC](https://developers.cloudflare.com/dns/dnssec/) to ensure authenticity of DNS records

* Spectrum layer 4 load balancer (Public)
  * [IP Access Rules](https://developers.cloudflare.com/spectrum/reference/configuration-options/#ip-access-rules) for controlling access to public layer 4 load balancers

The Cloudflare global anycast network is a powerful platform for load balancing. A load balancing configuration in Cloudflare is accessible in over 330 cities across the world and has virtually unlimited capacity and bandwidth.

These load balancers operate within approximately 50ms of about 95% of the Internet-connected population, including endpoints that allow Cloudflare Load Balancers to perform both GTM and Private Network Load Balancing. Cloudflare now combines these two distinct load balancing concepts into a single load balancer. This helps enable organizations to steer traffic to geographically-relevant data centers, then select the proper endpoint to handle the request.

With Cloudflare Tunnel, endpoints can be located within private networks and still be utilized by Cloudflare Load Balancers. Cloudflare offers public layer 7 load balancers — that supports both HTTP(S) and WebSockets, as well as public layer 4 load balancers that can steer any TCP or UDP traffic. This means that Cloudflare can offer load balancing services to all organizations and users, no matter their location, use cases, or existing configurations.

<page>
---
title: Magic Transit Reference Architecture · Cloudflare Reference Architecture docs
description: This reference architecture describes the key architecture,
  functionalities, and network deployment options of Cloudflare Magic Transit.
lastUpdated: 2025-10-13T13:40:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/magic-transit/
  md: https://developers.cloudflare.com/reference-architecture/architectures/magic-transit/index.md
---

The purpose of this document is to describe the key architecture, functionalities, and network deployment options of [Cloudflare Magic Transit](https://developers.cloudflare.com/magic-transit/) — a BGP-based DDoS protection and traffic acceleration service for Internet-facing network infrastructure.

### Who is this document for and what will you learn?

This reference architecture is designed for IT or network professionals with some responsibility over or familiarity with their organization's existing network infrastructure. It is useful to have some experience with technologies and concepts important to content delivery, including routers, DNS and firewalls.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

- Blog: [Magic Transit makes your network smarter, better, stronger, and cheaper to operate](https://blog.cloudflare.com/magic-transit) (14 minute read)

Those who read this reference architecture will learn:

* How Cloudflare Magic Transit protects your network infrastructure from denial of service attacks (DDoS)
* How to architecture Magic Transit into your existing network infrastructure

## What Is Magic Transit?

Protecting network infrastructure from DDoS attacks demands a unique combination of strength and speed. Volumetric attacks can easily overwhelm hardware boxes and their bandwidth-constrained Internet links. And most cloud-based solutions redirect traffic to centralized scrubbing centers, which impacts network performance significantly.

Cloudflare Magic Transit provides DDoS protection and traffic acceleration for on-premise, cloud, and hybrid networks. With data centers spanning [hundreds of cities](https://www.cloudflare.com/network/) and offering hundreds of Tbps in mitigation capacity, Magic Transit can detect and mitigate attacks close to their source of origin in under three seconds globally on average — all while routing traffic faster than the public Internet.

![Figure 1: Magic transit overview](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-1.BqSmsUYf_Z1CXccO.webp)

At a high level, Magic Transit works as follows:

* **Connect:** Using Border Gateway Protocol (BGP) route announcements to the Internet, and the Cloudflare anycast network, customer traffic is ingested at a Cloudflare data center closest to the source.

* **Protect and Process:** All customer traffic is inspected for attacks. Advanced and automated mitigation techniques are applied immediately upon detecting an attack. Additional functions such as load balancing, next-generation firewall, content caching, and serverless compute are also available as a service.

* **Accelerate:** Clean traffic is routed over Cloudflare’s low-latency network links for optimal throughput and handed off over IP tunnels (either GRE or IPsec) or private network interconnects (PNI) to the origin network. Magic Transit uses anycast IP addresses for Cloudflare’s tunnel endpoints, meaning that any server in any data center is capable of encapsulating and decapsulating packets for the same tunnel. For more details specifically on tunnels and encapsulation, refer to [GRE and IPsec tunnels](https://developers.cloudflare.com/magic-transit/reference/gre-ipsec-tunnels/).

### Baking resilience into our network using anycast

Magic Transit uses anycast IP addresses for its end of the network tunnel endpoints — so a single tunnel configured from a customer’s network to Cloudflare connects to all Cloudflare global data centers (excluding the [China Network](https://developers.cloudflare.com/china-network/)). This does not add strain on the router; from the router’s perspective, it is a single tunnel to a single IP endpoint.

This works because while the tunnel endpoint is technically bound to an IP address, it need not be bound to a specific device. Any device that can strip off the outer headers and then route the inner packet can handle any packet sent over the tunnel.

In the event of a network outage or other issues, tunnels fail over automatically — with no impact to a customer’s network performance.

## Deployment Architectures for Magic Transit

### Default Configuration (Ingress Only, Direct Server Return)

By default, Magic Transit processes traffic in the ingress direction only (from the Internet to the customer network). The server return traffic back to the clients is routed by the customer's DC edge router via its uplinks to the Internet/ISP based on the edge router’s default routing table. This server return traffic will not transit through Cloudflare via tunnels. This is referred to as Direct Server Return (DSR).

The network diagram in Figure 2 illustrates such a Magic Transit setup, and the end-to-end packet flow of Magic Transit-protected traffic. The tunnel in this setup uses GRE for encapsulation.

![Figure 2: Reference Configuration of Magic Transit anycast Tunnel (GRE) With Default DSR Option](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-2.XvKY3pME_Z2GoNl.webp)

* Cloudflare provides the customer with a pair of anycast IP addresses for the Cloudflare end of the tunnel endpoints. These are publicly routable IP addresses from Cloudflare-owned address space. The pair of anycast IP addresses can be used to configure two tunnels for network redundancy, although only one is required for a basic configuration. The above configuration shows a single tunnel, with the Cloudflare end of the tunnel endpoint address being 192.0.2.1.

* The customer end of the anycast GRE tunnel needs to be a publicly routable address. It is typically the IP address of the WAN interface on the customer edge router. In this example it is 192.0.2.153.

* The IP addresses of the tunnel interfaces are RFC 1918 private addresses. These addresses are only "locally significant" within the particular Magic Transit service instance that they are part of. Therefore, the customer can select any RFC 1918 addresses they desire, as long as they do not overlap with those of other tunnels configured within the same Magic Transit service instance.

* As best practice, given the tunnels are point-to-point connections, a /31 subnet is sufficient for allocating the 2 IP addresses required for a given tunnel. In the above example, the 10.10.10.0/31 subnet is chosen, with the Cloudflare end of the tunnel interface being 10.10.10.0/31 and the customer's DC edge router side being 10.10.10.1/31.

* Once the tunnel is configured, a route is configured in the Magic Transit service instance to forward traffic destined to a given customer prefix onto the correct tunnel.

* Traffic destined to customer prefix 203.0.113.0/24 is routed onto the tunnel whose remote end (i.e. the customer’s end, from the Cloudflare network's perspective) of the tunnel interface is 10.10.10.1.

* Given this is a Direct Server Return (DSR) setup, the server return traffic follows the default route (ip route 0/0) configured on the customer edge router and is sent to its uplink peer (i.e. customer’s ISP's router), en route back to the clients over the Internet. This return traffic does not traverse Cloudflare network.

**Note:** The smallest IP prefix size (i.e. with the longest IP subnet mask) that most ISPs accept in each other's BGP advertisements is /24; e.g. x.x.x.0/24 or y.y.y.0/23 are okay, but z.z.z.0/25 is not. Therefore, the smallest IP prefix size Cloudflare Magic Transit can advertise on behalf of the customers is /24.

### Magic Transit With Egress Option Enabled

When Magic Transit is deployed with the Egress option enabled, egress traffic from the customer's network flows over the Cloudflare network as well. This deployment option provides symmetry to the traffic flow, where both client-to-server and server-return traffic flow through the Cloudflare network. This implementation provides added security and reliability to the server-return traffic, as afforded by the Cloudflare network.

The following network diagram illustrates the end-to-end packet flow between the end client and customer network when the Magic Transit Egress option is enabled.

![Figure 3: Magic Transit With Egress Option Enabled](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-3._h1mIh77_r8Xu4.webp)

* The ingress traffic flow is the same as in the Default Configuration use case above.

* For egress traffic to be received and processed by Magic Transit, the source IP addresses of the traffic need to be in the range of the Magic Transit-protected IP prefixes, and the destination IP addresses need to be public Internet routable, i.e. non-RFC 1918 addresses.

It is worth noting that for customers who bring their own public IP addresses ([BYOIP](https://developers.cloudflare.com/byoip/)) for cloud-hosted services, the Magic Transit Egress option can provide additional value by eliminating the need for them to purchase and implement BYOIP services with their cloud providers, reducing their cloud bill and lowering operational costs.

To accomplish this, the IP tunnels that on-ramps to Magic Transit are configured between the cloud providers' VPCs and the Cloudflare network. With the Magic Transit Egress option, both directions of client-server traffic would flow through these tunnels. The BYOIP addresses in the tunneled packets are hidden behind the outer tunnel endpoint IP addresses and the tunnel header, making them "invisible" to the underlying cloud provider network elements between the VPCs and the Cloudflare network.

### Magic Transit Over Cloudflare Network Interconnect (CNI)

[Cloudflare Network Interconnect (CNI)](https://developers.cloudflare.com/network-interconnect/) allows customers to connect their network infrastructure directly to Cloudflare – bypassing the public Internet – for a more reliable, performant, and secure experience.

* CNI is provisioned by the cross-connect providers as a set of layer 2 connections, and Cloudflare allocates a pair of IP addresses from Cloudflare’s own Internet-routable IP address block for each connection.

* Cloudflare coordinates with the customer to configure these links and to establish a BGP peering session over the links during CNI onboarding.

* Once the BGP session is up between the Cloudflare network and the customer edge router that are connected via CNI, Cloudflare-owned prefixes will be advertised over this CNI link to the customer edge router.

Figure 4 illustrates a reference configuration for Magic Transit over CNI, and its associated packet flow.

**Note:** The example demonstrated here is for the default Magic Transit service without the Egress option enabled. As described in earlier sections, in Magic Transit Direct Server Return mode (i.e. Ingress only), the server return traffic will be routed by the customer edge router to the clients via their ISP through the public Internet.

![Figure 4: Reference Configuration of Magic Transit Over CNI (Default DSR Option)](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-4.CCh1ixzi_2vP0v3.webp)

When the Magic Transit Egress option is enabled and utilized, the server return traffic can be sent back to the clients through the Cloudflare network, via the IP tunnels that are configured over the CNI connections. Figure 5 illustrates one such example.

![Figure 5: Reference Configuration of Magic Transit Over CNI with Egress Option Enabled](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-5.Dru7wSdW_Z1Qcnn2.webp)

### Magic Transit Protecting Public Cloud-Hosted Services

Magic Transit protects services hosted on-premise and in the cloud. This use case illustrates the configuration for a cloud-hosted deployment.

![Figure 6: Protect Multi-Cloud-Based Services With Magic Transit (Egress Option Enabled)](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-6.Cik4bTwC_w3xvf.webp)

* In this example, a given customer has two cloud VPC deployments spread across two different cloud providers, and in two different geographical regions.

* In this example, the customer’s /24 or larger prefix is split into multiple smaller (i.e. longer subnet mask length) prefixes (e.g. /26) and assigned to the various VPCs in different locations. Upon establishing the tunnels from the Cloudflare network to each of the VPCs, the customer can configure routes centrally in the Magic Transit configuration to route traffic to the respective VPCs. Such configuration can be made via API or UI dashboard.

Note that with the Magic Transit Egress option, the customer can bypass each cloud provider's BYOIP services, its associated fees, and the configuration and operations complexity, by sending egress traffic (i.e. server return or server-to-Internet traffic from the protected prefix) through the Cloudflare global network via the Magic Transit tunnels.

### Magic Transit and Magic WAN

In addition to protecting and routing traffic for external-facing services of an enterprise (i.e. north-south Internet-routable traffic) with the Cloudflare Magic Transit service, customers can protect east-west "intra-enterprise" internal traffic (e.g. RFC 1918 private addresses), interconnecting all the sites of an enterprise, using [Cloudflare Magic WAN](https://developers.cloudflare.com/magic-wan/).

Magic WAN replaces legacy WAN architectures with the Cloudflare network, providing global connectivity, cloud-based security, performance, and control through one simple user interface.

The Cloudflare Magic Transit and Magic WAN services combined provide a holistic, secure, reliable, and performant global network-as-a-service solution for an entire enterprise, protecting and accelerating north-south as well as east-west traffic.

Both services can either be deployed in the same service instance, or, for customers who prefer to keep the administration and traffic flow of external, Internet-facing networks and internal corporate networks completely separate, different service instances can be deployed for Magic Transit and Magic WAN.

Figure 7 illustrates an example of deploying Magic Transit and Magic WAN services in separate service instances.

![Figure 7: Magic Transit + Magic WAN Provide Network-as-a-Service for the Entire Enterprise](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-7.DESTWgck_1uQaxo.webp)

* In the example, GRE tunnels are used to connect the customer's various sites over the Cloudflare global anycast network. The Cloudflare anycast IP address for the Magic Transit service instance is 192.0.2.1, while the one for the Magic WAN service instance is 192.0.2.2. The Magic Transit service is enabled with the Egress option.

* The Magic Transit service protects and routes external-facing front-end client-server traffic. The Magic WAN service protects and routes enterprise internal traffic such as that of internal applications, back-end database sync, and branch-to-DC and branch-to-branch traffic.

### Magic Firewall: Control and Filter Unwanted Traffic Before It Reaches the Enterprise Network

While Magic Transit protects customers’ services from DDoS attacks, many network administrators want to be able to control and block other unwanted or potentially malicious traffic. [Cloudflare Magic Firewall](https://developers.cloudflare.com/magic-firewall/) enforces consistent network security policies across the entire customer WAN, including headquarters, branch offices, and virtual private clouds, and allows customers to deploy fine-grained filtering rules globally in seconds — all from a common dashboard.

Magic Firewall is deployed and configured as part of Magic Transit. All ingress traffic flowing through Cloudflare edge data centers, whose destination prefixes are protected by Magic Transit, can be filtered by Magic Firewall.

![Figure 8: Magic Firewall Blocks Unwanted and Malicious Traffic at the Internet Edge](https://developers.cloudflare.com/_astro/magic-transit-ref-arch-8.BRW-6GQa_Za9Jbz.webp)

In Magic Firewall rules, administrators can match and filter network traffic not only based on the typical 5-tuple (source/destination IP, source/destination port, protocol) information carried in the IP packet header but also other packet information such as IP packet length, IP header length, TTL, etc. In addition, geographical information such as the name of the Cloudflare data center/colo, the region, and the country the data centers are located in can also be used in configuring Magic Firewall rules (geo-blocking).

For further details on Magic Firewall and its configuration, please refer to this [blog post](https://blog.cloudflare.com/introducing-magic-firewall/) and our [developer docs](https://developers.cloudflare.com/magic-firewall/).

## A Note on Always-On and On-Demand Deployments

A cloud DDoS mitigation service provider can monitor traffic for threats at all times (the always-on deployment model) or reroute traffic only when an attack is detected (on-demand). This decision affects response time and time-to-mitigation. In some cases, it also has repercussions for latency.

In an on-demand deployment model, inbound traffic is monitored and measured at the network edge to detect volumetric attacks. During normal operations, or "peacetime," all traffic directly reaches applications and infrastructure without any delay or redirection. Traffic is diverted to the cloud scrubbing provider only in the case of an active DDoS attack. In many cases, a customer is required to call the service provider to redirect traffic, thereby increasing the response time.

The always-on mode is a hands-off approach to DDoS mitigation that does not require the customer to do anything in the event of an attack. The organization’s traffic is always routed through the cloud provider’s data centers for threat inspection, even during peacetime. This minimizes the time from detection to mitigation, and there is no service interruption.

Of all approaches and deployment options, the always-on method provides the most comprehensive protection.

However, depending on the provider, diverting all traffic through the DDoS mitigation provider’s cloud might add latency that is suboptimal for business-critical applications. Cloudflare is architected so that customers do not incur a latency penalty as a result of attacks — even for always-on deployments. Analyzing traffic at the edge is the only way to mitigate at scale without impacting performance.

This is because ingesting traffic via anycast ensures that traffic travels only to the nearest Cloudflare data center for inspection. With data centers in [hundreds of cities worldwide](https://www.cloudflare.com/network/), it is likely to be a short distance. This eliminates the trombone effect.

In many cases, [traffic is faster when routed over Cloudflare](https://www.cloudflare.com/static/360e550c8890054d5e5835efb9fb8dd1/Magic_Transit_protects_networks_while_also_improving_performance__1_.pdf) than over the public Internet. We believe customers should not have to sacrifice performance to achieve comprehensive security.

Cloudflare offers comprehensive network services to connect and protect on-premise, cloud-hosted, and hybrid enterprise networks. Cloudflare provides various connectivity and deployment options to suit customers' unique architectures.

* Cloudflare Magic Transit is a cloud-native network security solution that uses the power of the Cloudflare global network to protect organizations against DDoS attacks.

* Magic Transit comes with a built-in network firewall that helps customers phase out on-premise firewalls and deploy network security as-a-service that scales.

* In addition to protecting and routing traffic for external-facing services of an enterprise (i.e. north-south Internet-routable traffic), customers can connect and protect east-west “intra-enterprise” internal traffic using Cloudflare Magic WAN.

If you would like to learn more about Magic Transit, Magic WAN, or Magic Firewall, please [reach out](https://www.cloudflare.com/magic-transit/) to us for a demo.

<page>
---
title: Multi-vendor Application Security and Performance Reference Architecture
  · Cloudflare Reference Architecture docs
description: This reference architecture describes how a multi-vendor approach
  for application security and performance can be accomplished.
lastUpdated: 2025-11-19T12:11:06.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/multi-vendor/
  md: https://developers.cloudflare.com/reference-architecture/architectures/multi-vendor/index.md
---

Over time and with the rapidly evolving application security and performance industries, companies have come to deploy multiple vendors to provide services. Sometimes customers opt for using multiple vendors for reasons of regulatory/company compliance, resiliency, performance, or cost.

Although some customers look to implement multi-vendor solutions for various reasons discussed in this document, multi-vendor deployments can introduce additional complexity, higher operational costs due to multiple dashboards and configurations, and a steeper learning curve. Additionally, while trying to establish a baseline of supported features across multiple vendors, customers can end up having a minimum common denominator setup, not taking advantage of the latest capabilities/innovations from a vendor. Customers should carefully consider the goals and requirements, and weigh pros and cons with all stakeholders, before proceeding with a multi-vendor deployment.

This document examines why some customers deploy a multiple or dual vendor approach and how Cloudflare can be incorporated into such a solution. Specifically, this document describes how a multi-vendor approach for application security and performance can be accomplished. This document is targeted for architects and those interested in using multi-vendor cloud-based solutions for security and performance.

### Who is this document for and what will you learn?

This reference architecture is designed for IT, security or network professionals with some responsibility over or familiarity with their organization’s existing network infrastructure. It is useful to have some experience with technologies and concepts important to application security and performance, including proxies, DNS and firewalls.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

Those who read this reference architecture will learn:

* How Cloudflare application security and performance capabilities can work alongside existing technology vendors
* Understanding the decisions to be made when using many vendors

## Cloud based security and performance providers

Before discussing multi-vendor security and performance solutions, it’s important to note how cloud-based solutions providing these services work in general and how traffic is routed through them.

Cloud-based security and performance providers like Cloudflare work as a reverse proxy. A reverse proxy is a server that sits in front of web servers and forwards client requests to those web servers. Reverse proxies are typically implemented to help increase security, performance, and reliability.

![Figure 1: Client request to origin server](https://developers.cloudflare.com/_astro/Figure_1.DmJWHu1Y_Z20GdDb.webp)

Normal traffic flow without a reverse proxy would involve a client sending a DNS lookup request, receiving the origin IP address, and communicating directly to the origin server(s). This is visualized in Figure 1.

When a reverse proxy is introduced, the client still sends a DNS lookup request to its resolver, which is the first stop in the DNS lookup. In this case, the DNS resolver returns a vendor’s reverse proxy IP address to the client and the client then makes a request to the vendor’s reverse proxy. The cloud-based proxy solution can now provide additional security, performance, and reliability services like [CDN](https://www.cloudflare.com/cdn/), [WAF](https://www.cloudflare.com/waf/), [DDoS](https://www.cloudflare.com/ddos/), [API Shield](https://www.cloudflare.com/products/api-shield/), [Bot Management](https://www.cloudflare.com/products/bot-management/) capabilities, etc, before deciding, based on security policy, whether to route the client request to the respective origin server(s). This is visualized in Figure 2.

![Figure 2: Client request routed through reverse proxy for additional security and performance services](https://developers.cloudflare.com/_astro/Figure_2.Ca4wC8bv_Z1yo7bq.webp)

In some cases, the vendor providing the reverse proxy also provides DNS services; this is visualized in Figure 3 below. This can be beneficial for managing all services from a single dashboard and for operational simplicity.

![Figure 3: Same vendor providing DNS and security/performance services via proxy](https://developers.cloudflare.com/_astro/Figure_3.CznC1gz__Z1LcAPc.webp)

## Cloudflare’s reverse proxy architecture and solution

Cloudflare provides a reverse proxy architecture using its global [anycast network](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/) for the respective security, performance, and reliability services it provides. Anycast is a network addressing and routing method in which incoming requests can be routed to a variety of different locations or ‘nodes’ advertising the same IP address space. Cloudflare is extremely performant and reliable thanks to anycast, as well as its global presence in [hundreds of cities worldwide](https://www.cloudflare.com/network/). Cloudflare is also directly connected to 12,000 networks, including every major ISP, cloud provider, and enterprise, and within \~50 ms from 95% of the world’s Internet-connected population.

Cloudflare has one global network with every service running on every server in every Cloudflare data center. Since Cloudflare’s network uses anycast, the closest data center to the client will respond to the client request. This decreases latency while improving network resiliency, availability, and security due to the increased overall distribution of traffic across Cloudflare's network.

[Cloudflare’s global anycast network](https://www.cloudflare.com/network/) provides the following advantages:

* Incoming traffic is routed to the nearest data center with the capacity to process the requests efficiently.
* Availability and redundancy is inherently provided. Since multiple nodes advertise the same IP address, if one node were to fail, requests are simply routed to another node in close proximity.
* Because anycast distributes traffic across multiple data centers, it increases overall distribution of traffic across Cloudflare’s network, preventing any one location from becoming overwhelmed with requests. For this reason, anycast networks are very resilient to DDoS attacks.

![Figure 4: Cloudflare providing DNS and security/performance services via global anycast network](https://developers.cloudflare.com/_astro/Figure_4.BQ6xEEwJ_29Soyq.webp)

## Cloudflare onboarding options

This section provides a brief overview of the Cloudflare onboarding options which are useful to understand prior to looking into the details around a multi-vendor solution. The method of onboarding allows for variance in how the multi-vendor solution is deployed/configured. If you’re already familiar with the Cloudflare onboarding options, you can jump to the next section discussing multi-vendor solutions.

Cloudflare provides multiple options to easily onboard and consume security, performance, and reliability services. One of the advantages of cloud solutions offered via proxy setup is the ease of onboarding and getting started because it primarily involves DNS configuration to route client requests through the proxy. However, even within the onboarding with DNS configuration, Cloudflare offers multiple options and flexibility.

The core requirement is, traffic must be proxied through Cloudflare; this is also referred to as ‘orange-clouded,’ because the traffic to the site is being proxied through Cloudflare. Within the dashboard, you will see the status for a specific DNS entry as ‘Proxied’ and the orange cloud icon as shown in Figure 5 below.

![Figure 5: Cloudflare configured to proxy traffic for site https://api2.cf-tme.com](https://developers.cloudflare.com/_astro/Figure_5.BkWvJnng_Z1gxDtP.webp)

There are several methods to proxy traffic through Cloudflare and the method used will depend on customer requirements.

**1. Full DNS setup - Cloudflare as primary DNS provider**

Cloudflare is configured as the primary DNS provider and A records are configured to proxy traffic through Cloudflare. When the proxy is enabled on a DNS record, the response will be Cloudflare anycast IP addresses allowing for Cloudflare to be the proxy.

**2. Secondary DNS setup with Secondary DNS override**

Cloudflare is configured as a secondary provider and all DNS records are transferred from the primary provider. Cloudflare provides a feature called [Secondary DNS override](https://developers.cloudflare.com/dns/zone-setups/zone-transfers/cloudflare-as-secondary/proxy-traffic/) that allows customers to override the response served from Cloudflare secondary nameservers. This allows for customers to take advantage of leveraging zone transfers to automatically sync between DNS providers. It also provides the flexibility to update select records in Cloudflare DNS to redirect certain traffic to another service provider like Cloudflare. In this case, the response will be Cloudflare anycast IP addresses allowing for Cloudflare to be the proxy.

**3. Partial / CNAME setup**

In this setup, Cloudflare is not the authoritative DNS provider and the customer manages DNS records externally.

Converting to CNAME setup ensures the hostname eventually resolves to Cloudflare IPs. This is useful when customers don’t want to change their current DNS setup but still want to use other Cloudflare services.

If a customer's current DNS provider doesn’t support CNAME on the zone apex (sometimes called the "root domain" or "naked domain") like Cloudflare does with [CNAME Flattening](https://developers.cloudflare.com/dns/cname-flattening/), you must purchase Static IPs from Cloudflare and create an A record to those Static IPs in the provider DNS. In Cloudflare, you can then create an A record to point the zone apex to the origin.

Many customers using Cloudflare services take advantage of the cross-product integration and innovations along with simplicity of a single UI for management and operational simplicity and use multiple Cloudflare services together like CDN and WAF. Although not recommended, it’s also possible to use security services like WAF with other CDN providers by setting up DNS to forward traffic through Cloudflare via CNAME and disabling Cloudflare caching via Cache Rules.

Typically customers opt for a multi-vendor approach for reasons of regulatory/company compliance, resiliency, performance, and cost.

### Regulatory/company compliance

Some customers may have to comply with regulatory/company policy of not being dependent on a single vendor for all security, performance, and reliability services. This could be done for reasons of a company’s policy of mitigating risk for specific vendor outages/issues and/or for leverage to mitigate against increased vendor pricing/costs. For compliance with these policies, a multi-vendor strategy is required.

When a single vendor is used for all security and performance services, this may be perceived as a single point of failure. This can be driven by regulatory pressure to improve reliability in all critical systems, outages experienced with an incumbent vendor, or uncertainty with the long term reliability of a single vendor.

In many cases a single vendor may be very well connected and provide the expected level of performance within a certain region, but less so in other regions; this could be due to a number of reasons including investment, limited resources, geopolitical reasons, etc. Many customers desire to fully optimize speed in performance critical applications and media by implementing a multi-vendor approach that is often coupled with real time performance monitoring to steer traffic to the most optimal vendor based on that data.

Just like the performance of a particular vendor can vary based on content, time of day, and location, so can the cost, and sending particular traffic through a particular vendor can help optimize the overall cost of the delivery. Typically these benefits are seen driving a multi-vendor strategy in very specific use cases, such as for high volume media traffic, as the cost of onboarding and managing multiple vendors typically increases monetary and resource costs outside of specific niche use cases. Additionally, adopting a multi-vendor approach helps avoid vendor lock-in with any single provider, offering greater flexibility and negotiating power across vendors.

## Multi-vendor solution considerations

Any multi-vendor architecture will contain several components an organization must decide on prior to implementing, both on the business and technical side. Additionally, there are several things to keep in mind to help optimize your setup to align with Cloudflare’s strengths and unique differentiators.

Optimize for feature set and delivery methodology. Cloudflare is able to offer feature parity with most major vendors, with custom features easily delivered through our serverless compute service. For delivery methodology, Cloudflare’s anycast architecture is unique in that every server can deliver every service that Cloudflare offers, making it an optimal candidate for an active/active approach.

Leverage Cloudflare’s API and rapid deployment capabilities wherever possible. Since Cloudflare offers every feature API first, and config changes typically are visible in a few seconds, this makes it easy for teams to test and deploy changes in a programmatic fashion without having to wait for long deployment times.

Avoid a “stacked” approach. This means avoid having Cloudflare placed in the request flow behind another vendor. We often hear companies consider stacking vendors with the hope of providing defense in depth by running the same traffic through each layer in a linear fashion. In theory this would allow for both vendors' policies to be run, and any bad traffic not caught by one vendor is hopefully caught by the next. What we see in practice when this setup is used is very different. The main disadvantage is the loss of full traffic visibility when sitting behind another vendor, which hinders many of Cloudflare’s threat intelligence powered services such as Bot Management, Rate Limiting, DDoS mitigation, & IP reputation database. This is also highly suboptimal from the performance side since the traffic must pass through two networks each with their own processing and connection overhead before going back to origin. Also, it creates unnecessary complexity in operations, management, and support.

One note on a stacked approach is that in certain cases for particular point solutions, it can make sense to place one vendor solution in front of the other, such as particular bot management solutions and API gateways, especially when migrating towards a new vendor/provider. In these scenarios it’s important to understand where each solution falls in the request flow to optimize effectiveness.

While Cloudflare and many providers maintain a high degree of availability and a robust fault tolerant architecture, some customers have a further desire to reduce dependency and respectively single vendor point of failures. It’s important to plan for a worst case scenario where some or all of a vendor's services are down and how to work around that in a short timeframe. Customers must consider how to have redundancy across DNS providers, networks, and origin connectivity to eliminate the risk of a single vendor/component failure cascading into a widespread outage.

While the specifics may vary widely depending on the vendor and business case, the technical considerations for a multi-vendor deployment can be bucketed into three areas: routing logic, configuration management and origin connectivity.

The first and likely most important decision that must be made when looking at a multi-vendor strategy is how to route traffic to each provider. This depends on both the business logic driving the multi-vendor strategy and the technical capabilities of each vendor in question. Traffic to each provider will be routed using DNS and shift depending on the current conditions and needs of the business. Cloudflare can support configurations as an authoritative DNS provider, secondary DNS provider, or non-Cloudflare DNS (CNAME) setups for a zone.

![Figure 6: Client request being routed to origin server(s) in a multi-vendor setup](https://developers.cloudflare.com/_astro/Figure_6.Bij5Z-XO_CqOKb.webp)

DNS based load balancing and health checks can be leveraged here so that client requests to the domain/site are distributed across healthy origin server(s). The DNS provider monitors the health of the servers and DNS responds to the client request using a round-robin approach with the respective IPs.

If a multi-vendor DNS approach is also desired for DNS-level resiliency, a variety of configurations are possible here with multiple authoritative nameservers from different vendors. See the ‘Multi-vendor DNS setup options’ section in this document for additional details. The key here is ensuring consistent configurations across multiple providers. Depending on the DNS setup/configuration, this consistency can be resolved using different approaches such as zone transfers, automation via tools such as Terraform or OctoDNS, monitoring/automation via scripting, or even manual configuration.

While many vendors can deliver a similar end user experience, configuration and management can differ greatly between providers, which drives up the cost of a successful implementation. Ultimately that means the business must become familiar with each vendor's configuration logic and develop a system to map between them. Wherever possible, seek out vendors that optimize for management simplicity, automation support, and rapid deployment to help minimize the cost and management overhead.

API support for all vendor’s product functionality becomes critical here. Maintaining consistent configuration is important not only in the routing in certain multi-vendor DNS setups but also for maintaining consistency between all of the respective services such as WAF, API security, etc. as traffic can be routed to either provider. Automation tools such as Terraform or custom scripted automation tools will leverage the APIs to maintain this consistency between vendors.

Another important decision that must be made is how each provider will connect back into your organization. This will largely depend on the vendor's capabilities plus the technical and security requirements of your organization.

Clients will make requests over the Internet and the requests will be routed to the respective vendor’s proxy service on the vendor’s cloud. In the most basic scenario, the proxy will simply route the traffic over the Internet to the origin; this is the default setup.

If the customer wants more security or additional performance benefits, they may decide to also leverage vendor offered connectivity options such as encrypted tunnels to origin or direct connect options from customer data centers directly to Cloudflare data centers via cross connect from a customer’s equipment to Cloudflare. Vendors may also offer accelerated routing capabilities where they actively monitor the fastest paths over the Internet to ensure the most optimal routes to the origin are used.

Cloudflare offers all of these connectivity options along with Smart Routing to ensure the fastest paths to origin are used. These connectivity options are discussed in more detail in the ‘Cloudflare connectivity options’ section of this document.

**Operations and Troubleshooting**

Some important considerations when designing a multi-vendor solution are operations and troubleshooting. Having a multi-vendor solution can raise operational costs and also impact troubleshooting as you now have two different environments to manage and troubleshoot.

A primary focus for Cloudflare has always been operational simplicity and providing visibility. Cloudflare provides a single unified dashboard where all security, performance, and reliability services can be accessed from a consistent operationally simple UI.

Additionally, Cloudflare offers logging, analytics and security analytics dashboards. Logs with additional details are also accessible from the UI. Customers have granular data that can be used for analysis and troubleshooting.

Figure 7 below shows a view of Cloudflare Security Analytics which brings together all of Cloudflare’s detection capabilities in one place. This provides security engineers and admins with a quick view of current traffic and security insights in regards to their site.

![Figure 7: Cloudflare Security Analytics](https://developers.cloudflare.com/_astro/Figure_7.QuPc0brB_F7baC.webp)

In addition to analytics for each product and security analytics shown above, you can also view logs within the UI and export logs to Cloudflare or third party clouds or products for additional analysis.

In Figure 8 below a Logpush is being configured to automatically export logs to an external destination.

![Figure 8: Cloudflare Logpush for exporting logs to external destinations](https://developers.cloudflare.com/_astro/Figure_8.DnHWeRK__2arTtA.webp)

When selecting the vendors for a multi-vendor solution you should ensure you select vendors where the below criteria is met:

* The vendor provides for operational simplicity with a single consistent UI for all operations where users can easily manage and get things done in one place.
* The vendor has useful security analytics to give an understanding of a sites’ traffic, security insights, and useful data for troubleshooting.
* The vendor has the ability to export logs/request data to third party clouds/applications.
* The vendor has an API first approach and provides APIs for all operations so tasks can be easily automated.
* The vendor is reputable and can provide effective support and help when needed.
* Employees are trained and have expertise or are comfortable using the vendor’s products.

## Common deployments

### Multi-vendor active-active security and different provider for DNS

The below diagram describes a typical multi-vendor setup in which both vendors are ‘active’ meaning they are both serving traffic for the same resource (`www.example.com`) and traffic is split between the two.

On the routing front, this example shows the authoritative DNS living outside of the two providers and load balancing between them. This DNS provider could be self hosted or live on another third party provider. Traffic is directed to each provider by responding to queries for `www.example.com` with a provider specific CNAME record or static IP for apex domain traffic. To achieve this traffic split, the third party DNS provider does need to have some ability to load balance the traffic. Most major DNS providers will have some mechanism to perform DNS based load balancing with varying degrees of complexity and configurability. This could mean round robining between records in the simplest case, or varying the response based on client location, health check data and more.

![Figure 9: Multi-vendor setup with Cloudflare and another vendor and different provider for DNS](https://developers.cloudflare.com/_astro/Figure_9.yGPacbGy_ZjFcJV.webp)

Depending on the authoritative DNS provider, traffic can be evenly split between the two or adjusted dynamically. Oftentimes customers will choose to inform the DNS routing with performance/availability data sourced from a third party monitoring service such as Thousandeyes or Catchpoint and adjust DNS responses based on that data. Third party monitoring services are often used to capture full HTTP request/response metrics to route based on real-time performance. Traffic can easily be shifted away from a provider by updating the authoritative DNS and waiting for the record TTL to expire.

It’s important to note here that the third party services are looking at end-to-end application performance metrics, not just DNS response time or limited data used by DNS resolvers. The DNS records will be updated based on the performance data to reflect the correct security vendor’s proxy to point to.

Both providers’ configurations are kept in sync by the administrators, pushing out changes via Terraform which makes calls to each provider's API. Keep in mind that while Cloudflare does have full API support for every feature, this may not be the case for every provider.

If only one external DNS provider is used, it does create a single point of failure if that DNS provider has an outage. A way to mitigate this risk is to implement a multi-vendor DNS solution; this is discussed in more detail in the [Multi-vendor DNS options](#multi-vendor-dns-setup-options) section in this document.

Another challenge of a parallel approach is keeping configurations in sync across providers to deliver a consistent end user experience. This means the administrators need to be familiar with the configuration management of both vendors and understand how feature parity can be achieved.

Once traffic is routed to the security and performance service provider via DNS, all security and performance services and respective policies are applied, and the traffic is then routed over the Internet back to the origin where the customer’s firewall is allowing IPs specified by each provider.

### Multi-vendor active-active security with multi-vendor DNS from same providers

The below example describes a setup where the DNS providers are also the security proxy vendors, and DNS records are kept in sync via zone transfers. A multi-vendor DNS solution is recommended as the preferred and most resilient solution.

here are different setups possible between the different DNS vendors and these are discussed in more detail in the ‘Multi-vendor DNS setup’ section of this document with advantages/disadvantages of each.

In this example, there are multiple authoritative DNS providers used where one is primary and the other is secondary. Per the use of secondary DNS and respective standard, zone transfers easily allow DNS configurations between different providers to remain synced.

In order to point requests to both providers (for the same hosts) in this model, the vendor set up as secondary must be able to overwrite records intended to go through a proxy. Without the ability to overwrite records as a secondary, the destination for all primary records would remain static and reduce the flexibility and resilience of the overall setup; Cloudflare provides this capability with [Secondary DNS override](https://developers.cloudflare.com/dns/zone-setups/zone-transfers/cloudflare-as-secondary/proxy-traffic/). For example, if the provider such as Cloudflare is set up as a secondary, Cloudflare will have DNS automatically synced to them from the primary via zone transfer, and can use Secondary DNS override to update the A record to point to its own proxy/services.

While DNS based load balancing isn’t required here, it’s helpful to have at each provider so requests can be predictably split across multiple vendors, otherwise the traffic split is largely dictated by the client resolver nameserver selection.

![Figure 10: Multi-vendor setup with Cloudflare and another vendor with multi-vendor DNS from same providers.](https://developers.cloudflare.com/_astro/Figure_10.C8edWi-O_1vGWHF.webp)

At the authoritative DNS provider, each vendor has their NS records listed and the client will select a nameserver based on their resolver. The resolver will receive the full set of authoritative nameservers upon request. The logic used by most resolvers typically takes into account resolution time as well as availability. In this scenario, the resolvers are used to make the decision on which name server to use based on performance/availability data they already have.

It’s important to note here that typically the DNS resolvers have already seen queries and responses associated with the nameservers used. For example, the nameserver the vendor assigns to the customer may already be used by other sites for their authoritative DNS and the resolvers already have a strong historical baseline of performance data to start leveraging immediately.

In this example, we are also seeing records being kept in sync via periodic zone transfers. Cloudflare is able to support both outgoing and incoming zone transfers. Traffic is directed to each proxy by either a provider specific CNAME record or static IP.

The configuration on the DNS side can vary; the different options are discussed in more detail in the next section. DNS can be set up with one provider acting as primary and the other acting as secondary. The DNS provider acting as primary is where all the DNS configuration is done and the secondary DNS receives the configuration copy via zone transfer.

Some DNS providers like [Cloudflare](https://developers.cloudflare.com/dns/zone-setups/zone-transfers/cloudflare-as-secondary/proxy-traffic/) offer the capability where secondary DNS can overwrite the A and AAAA records. This allows the provider to rewrite the A/AAAA record to proxy traffic through a different vendor as desired. In this case the secondary DNS provider will provide a different response than the primary for the same hostname. This means that depending on what nameserver a client resolver queries, the request will be routed to the vendor’s respective network. This allows for flexibility and reduced complexity by relying on the client resolver for traffic steering and failover if the nameservers are slow or unreachable. This comes at the cost of direct control and predictability over what provider a client selects.

Another variation is to have specific applications/hostnames hosted through specific providers. That could mean, in the above example, both the primary and secondary DNS servers have `www.example.com` mapped to a Cloudflare address, regardless of which provider resolves the initial DNS query.

## Multi-vendor DNS setup options

The important routing decision is dictated by DNS. As discussed, there are multiple configurations possible for a multi-DNS setup. The below assumes you are using two DNS providers which are also the providers for the security solution.

**1. Two authoritative - one primary and one secondary**

This setup involves setting one provider as a primary and the second provider as a secondary. The purpose of secondary DNS is to support multi-DNS solutions where synchronization between the configurations of primary and secondary is automated.

In this setup both DNS providers are authoritative but only one is primary and the source of truth and where DNS configuration changes/updates are made. The configuration changes/updates on primary are synced to the secondary DNS provider via zone transfers managed by the provider. DNS of both providers answer DNS queries.

The advantage and main use case with this deployment model is that it uses a standard for syncing DNS across multiple providers and was created for just this reason, and the DNS provider is responsible for the zone transfers. This option provides simplicity in maintaining DNS synchronization between providers.

Sometimes customers may decide to use another option due to the following:

* The requirement of updating DNS records when the record management and zone transfer pipeline is down.
* Not wanting to rely on a third party/vendor for the DNS synchronization and desiring more control.
* Having specific restrictions/regulations excluding this option.

This setup is recommended for customers who desire simplicity offered by a secondary DNS and provider for maintaining synchronization.

* Uses standard (AXFR, IXFR) to keep DNS synced and done automatically via Zone Transfers.
* Simplicity as the DNS provider is responsible for DNS synchronization.

* If the record management and zone transfer pipeline is down, DNS records cannot be updated.
* Some customers do not want to rely on a vendor/3rd party for DNS sync and desire more control and flexibility.

**2. Two authoritative - both primary**

Some customers may also want to have the added assurance of being able to update DNS records when the record management and zone transfer pipeline is down. They also may not want to rely on a third party/vendor for DNS synchronization and desire more control. In this case, both DNS providers can be used as primary.

In this setup each DNS provider is authoritative and primary. There is no secondary DNS and changes/updates to DNS can be made at either provider; also, both DNS providers answer DNS queries.

Synchronization of the DNS configuration between providers is critical, and in this setup it now becomes the customer’s responsibility to keep DNS in sync at both providers. Customers typically do this synchronization with automation tools like OctoDNS, Terraform, or via custom automation leveraging the vendors’ APIs.

This setup is recommended for customers who desire the most flexible and resilient option that supports updating DNS records even when the record management and zone transfer pipeline is down and/or customers who want more control over DNS synchronization.

* If control plane is down on one provider, DNS records can still be updated at the other.
* More control and no reliance on DNS provider for DNS synchronization.

* More complexity in keeping DNS between providers synced.
* Customer is responsible for DNS synchronization which can be done via automation tools, automated via vendor APIs, or manually.

**3. One or more authoritative - hidden primary and multiple secondary**

In a hidden primary setup, users establish an unlisted primary server to store all zone files and changes, then enable one or more secondary servers to receive and resolve queries. Although most of the time the primary is authoritative, it doesn’t have to be. In this option, the primary is not listed with the registrar. The primary does not respond to queries and its main purpose is being the single source of truth.

Although the secondary servers essentially fulfill the function of a primary server, the hidden setup allows users to hide their origin IP and shield it from attacks. Additionally, the primary can be taken offline for maintenance without causing DNS service to be disrupted.

This setup is recommended for customers who desire simplicity offered by a secondary DNS and provider for maintaining synchronization. This solution also provides for flexibility in taking the primary offline as needed with less impact.

* Allows customers to maintain DNS record management on their infrastructure and use standard to keep DNS synced automatically via Zone Transfers.
* Primary is used only for source of truth and maintaining DNS records and can be taken offline for maintenance /administration.

* If the record management and zone transfer pipeline is down, DNS records cannot be updated.
* Some customers do not want to rely on a vendor/3rd party for DNS sync and desire more control.

## Configuration and management best practices

![Figure 11: Configuration via Terraform for multi-vendor setup with Cloudflare and other vendor](https://developers.cloudflare.com/_astro/Figure_11.Dt7KSeKt_Z1AmogL.webp)

Figure 11 depicts a typical pattern seen when managing configurations across both Cloudflare and other providers in parallel. In this example, we are assuming that the same workloads are being split through both providers and the admin team is updating both configurations via API through Terraform. This can also be tied into an internal CI/CD pipeline to match your typical developer workflow. All Cloudflare functions can be configured via API and are delivered first via API. This diagram also depicts logs being sent to a common SIEM and native alerting functions that can be delivered via e-mail, webhook, or PagerDuty for alerts based on performance, security or administrative criteria.

With the wide variety of customization options Cloudflare provides (Ruleset Engine, native features, Worker customizations), Cloudflare can likely meet feature parity with most other major vendors out in the market, however it's not guaranteed that these features will be configurable in the same manner. This is where working closely with your Cloudflare account team becomes critical in understanding the key differences in operation and best practices to align your workflow with Cloudflare.

## Connectivity options

For a multi-vendor offering it's important to consider the methods that each provider offers for connectivity to the origin(s) and the trade offs in security, performance, and resiliency. Cloudflare offers several options that fit most use cases and can be deployed in parallel with per application (hostname/DNS record) granularity to fit a hybrid customer environment.

### Internet (default)

In the most basic scenario, the proxy will simply route the traffic over the Internet to the origin; this is the default setup for all vendors. In this setup the client and origin are both endpoints directly connected to the Internet via their respective ISPs. The request is routed over the Internet from the client to the vendor proxy (via DNS configuration) before the proxy routes the request over the Internet to the customer's origin.

The below diagram describes the default connectivity to origins as requests flow through the Cloudflare network. When a request hits a proxied DNS record and needs to reach the origin, Cloudflare will send traffic from the network over the Internet from a set of Cloudflare owned addresses.

![Figure 12: Connectivity from Cloudflare to origin server(s) via Internet](https://developers.cloudflare.com/_astro/Figure_12.D0NtsXlk_38Hxx.webp)

Optionally, customers can also choose to leverage [Dedicated CDN Egress IPs](https://developers.cloudflare.com/smart-shield/configuration/dedicated-egress-ips/), which allocates customer-specific IPs that Cloudflare will use to connect back to your origins. We recommend allowlisting traffic from only these networks to avoid direct access. In addition to IP blocking at the origin side firewall, we also strongly recommend additional verification of traffic via either the "Full (Strict)" SSL setting or mTLS auth to ensure all traffic is sourced from requests passing through the customer configured zones.

Cloudflare also supports [Bring Your Own IP (BYOIP)](https://developers.cloudflare.com/byoip/). When BYOIP is configured, the Cloudflare global network will announce a customer’s own IP prefixes and the prefixes can be used with the respective Cloudflare Layer 7 services.

### Private connection - tunnel or VPN

Another option is to have a private tunnel/connection over the Internet for additional security. Some vendors offer private connectivity via tunnels or VPNs which can be encrypted or unencrypted; these vary in complexity/management and require additional security/firewall updates to allow for connectivity. A traditional VPN setup is also limited via a centralized vendor location back to the origin.

Cloudflare offers [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) which is tunneling software that provides an encrypted tunnel between your origin(s) and Cloudflare’s network. Also, since Cloudflare leverages anycast on its global network, the origin(s) will, like clients, connect to the closest Cloudflare data center(s).

When you run a tunnel, a lightweight daemon in your infrastructure, cloudflared, establishes four outbound-only connections between the origin server and the Cloudflare network. These four connections are made to four different servers spread across at least two distinct data centers providing robust resiliency. It is possible to install many cloudflared instances to increase resilience between your origin servers and the Cloudflare network.

Cloudflared creates an encrypted tunnel between your origin web server(s) and Cloudflare’s nearest data center(s), all without opening any public inbound ports. This provides for simplicity and speed of implementation as there are no security changes needed on the firewall. This solution also lowers the risk of firewall misconfigurations which could leave your company vulnerable to attacks.

The firewall and security posture is hardened by locking down all origin server ports and protocols via your firewall. Once Cloudflare Tunnel is in place and respective security applied, all requests on HTTP/S ports are dropped, including volumetric DDoS attacks. Data breach attempts, such as snooping of data in transit or brute force login attacks, are blocked entirely.

![Figure 13: Connectivity from Cloudflare to origin server(s) via Cloudflare Tunnel](https://developers.cloudflare.com/_astro/Figure_13.CsKShnx8_rs0l1.webp)

The above diagram describes the connectivity model through Cloudflare Tunnel. Note, this option provides you with a secure way to connect your resources to Cloudflare without a publicly routable IP address. Cloudflare Tunnel can connect HTTP web servers, SSH servers, remote desktops, and other protocols safely to Cloudflare.

### Direct connection

Most vendors also provide an option of directly connecting to their network. Direct connections provide security, reliability, and performance benefits over using the public Internet. These direct connections are done at peering facilities, Internet Exchanges (IXs) where Internet Service Providers (ISPs) and Internet networks can interconnect with each other, or through vendor partners.

![Figure 14: Connectivity from Cloudflare to origin server(s) via Cloudflare Network Interconnect (CNI)](https://developers.cloudflare.com/_astro/Figure_14.pA3d5-ag_Z2vVWnb.webp)

The above diagram describes origin connectivity through [Cloudflare Network Interconnect (CNI)](https://blog.cloudflare.com/cloudflare-network-interconnect/) which allows you to connect your network infrastructure directly with Cloudflare and communicate only over those direct links. CNI allows customers to interconnect branch and headquarter locations directly with Cloudflare. Customers can interconnect with Cloudflare in one of three ways: over a private network interconnect (PNI) available at [Cloudflare peering facilities](https://www.peeringdb.com/net/4224), via an IX at any of the [many global exchanges Cloudflare participates in](https://bgp.he.net/AS13335#_ix), or through one of our [interconnection platform partners](https://blog.cloudflare.com/cloudflare-network-interconnect-partner-program).

Cloudflare’s global network allows for ease of connecting to the network regardless of where your infrastructure and employees are.

## Additional routing and security options

Most vendors also provide additional capabilities for enhanced/optimized routing and additional security capabilities when communicating with the origin. You should check with respective vendor documentation to confirm support if parity is expected in terms of performance and security capabilities.

Cloudflare offers [Argo Smart Routing](https://developers.cloudflare.com/argo-smart-routing/) for finding and using optimized routes across the Cloudflare network to deliver responses to users more quickly and Authenticated Origin Pulls (mTLS) to ensure requests to your origin server come from the Cloudflare network

### Argo Smart Routing

Argo Smart Routing is a service that finds optimized routes across the Cloudflare network to deliver responses to users more quickly.

Argo Smart Routing accelerates traffic by taking into account real-time data and network intelligence from routing over 28 million HTTP requests per second; it ensures the fastest and most reliable network paths are traversed over the Cloudflare network to the origin server. On average, Argo Smart Routing accounts for 30% faster performance on web assets.

In addition, Cloudflare CDN leverages Argo Smart Routing to determine the best upper tier data centers for Argo Tiered Cache. Argo Smart Routing can be enabled to ensure the fastest paths over the Cloudflare network are taken between upper tier data centers and origin servers at all times. Without Argo Smart Routing, communication between upper tier data centers to origin servers are still intelligently routed around problems on the Internet to ensure origin reachability. For more information on Argo Smart Routing as it relates to CDN, see the [Cloudflare CDN Reference Architecture](https://developers.cloudflare.com/reference-architecture/architectures/cdn/).

### Authenticated Origin Pulls (mTLS)

Authenticated Origin Pulls helps ensure requests to your origin server come from the Cloudflare network, which provides an additional layer of security on top of [Full](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/) or [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/) SSL/TLS encryption modes Cloudflare offers.

This authentication becomes particularly important with the [Cloudflare Web Application Firewall (WAF)](https://developers.cloudflare.com/waf/). Together with the WAF, you can make sure that all traffic is evaluated before receiving a response from your origin server.

If you want your domain to be [FIPS](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standards) compliant, you must upload your own certificate. This option is available for both [zone-level](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/zone-level/) and [per-hostname](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/per-hostname/) authenticated origin pulls.

To summarize, a successful multi-vendor strategy for application security and performance requires careful consideration of your business objectives, infrastructure requirements, and vendor capabilities. There are several options to choose from when deploying a multi-vendor strategy with various advantages and limitations to each. Cloudflare can support these configurations by delivering services through the Cloudflare Global Network that are highly resilient, performant, and cost effective to fit your organizations multi-vendor strategy.

[Download this page as a PDF](https://developers.cloudflare.com/reference-architecture/static/multi-vendor-application-security-performance.pdf)

<page>
---
title: Evolving to a SASE architecture with Cloudflare · Cloudflare Reference
  Architecture docs
description: This reference architecture explains how organizations can work
  towards a SASE architecture using Cloudflare.
lastUpdated: 2025-12-02T17:49:01.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/sase/
  md: https://developers.cloudflare.com/reference-architecture/architectures/sase/index.md
---

Download a [PDF version](https://developers.cloudflare.com/reference-architecture/static/cloudflare-evolving-to-a-sase-architecture.pdf) of this reference architecture.

Cloudflare One is a secure access service edge (SASE) platform that protects enterprise applications, users, devices, and networks. By progressively adopting Cloudflare One, organizations can move away from their patchwork of hardware appliances and other point solutions and instead consolidate security and networking capabilities on one unified control plane. Such network and security transformation helps address key challenges modern businesses face, including:

* Securing access for any user to any resource with Zero Trust practices
* Defending against cyber threats, including multi-channel phishing and ransomware attacks
* Protecting data in order to comply with regulations and prevent leaks
* Simplifying connectivity across offices, data centers, and cloud environments

Cloudflare One is built on Cloudflare's [connectivity cloud](https://www.cloudflare.com/connectivity-cloud/), ​​a unified, intelligent platform of programmable cloud-native services that enable any-to-any connectivity between all networks (enterprise and Internet), cloud environments, applications, and users. It is one of the [largest global networks](https://www.cloudflare.com/network/), with data centers spanning [hundreds of cities worldwide](https://www.cloudflare.com/network/) and interconnection with over 13,000 network peers. It also has a greater presence in [core Internet exchanges](https://bgp.he.net/report/exchanges#_participants) than many other large technology companies.

As a result, Cloudflare operates within \~50 ms of \~95% of the world's Internet-connected population. And since all Cloudflare services are designed to run across every network location, all traffic is connected, inspected, and filtered close to the source for the best performance and consistent user experience.

This document describes a reference architecture for organizations working towards a SASE architecture, and shows how Cloudflare One enables such security and networking transformation.

### Who is this document for and what will you learn?

This reference architecture is designed for IT or security professionals with some responsibility over or familiarity with their organization's existing infrastructure. It is useful to have some experience with technologies important to securing hybrid work, including identity providers (IdPs), user directories, single sign on (SSO), endpoint security or management (EPP, XDR, UEM, MDM), firewalls, routers, and point solutions like packet or content inspection hardware, threat prevention, and data loss prevention technologies.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

- Solution Brief: [Cloudflare One](https://cfl.re/SASE-SSE-platform-brief) (3 minute read)
- Whitepaper: [Overview of Internet-Native SASE Architecture](https://cfl.re/internet-native-sase-architecture-whitepaper) (10 minute read)
- Blog: [Zero Trust, SASE, and SSE: foundational concepts for your next-generation network](https://blog.cloudflare.com/zero-trust-sase-and-sse-foundational-concepts-for-your-next-generation-network/) (14 minute read)

Those who read this reference architecture will learn:

* How Cloudflare One protects an organization's employees, devices, applications, data, and networks
* How Cloudflare One fits into your existing infrastructure, and how to approach migration to a SASE architecture
* How to plan for deploying Cloudflare One

While this document examines Cloudflare One at a technical level, it does not offer fine detail about every product in the platform. Instead, it looks at how all the services in Cloudflare One enable networking and network security to be consolidated on one architecture. Visit the [developer documentation](https://developers.cloudflare.com/) for further information specific to a product area or use case.

## Disintegration of the traditional network perimeter

Traditionally, most employees worked in an office and connected locally to the company network via Ethernet or Wi-Fi. Most business systems (e.g. file servers, printers, applications) were located on and accessible only from this internal network. Once connected, users would typically have broad access to local resources. A security perimeter was created around the network to protect against outsider threats, most of which came from the public Internet. The majority of business workloads were hosted on-premises and only accessible inside the network, with very little or no company data or applications existing on the Internet.

However, three important trends created problems for this "castle and moat" approach to IT security:

1. **Employees became more mobile**. Organizations increasingly embrace remote / hybrid work and support the use of personal (i.e. not company-owned) devices.
2. **Cloud migration accelerated**. Organizations are moving applications, data, and infrastructure from expensive on-premises data centers to public or private cloud environments in order to improve flexibility, scalability, and cost-effectiveness.
3. **Cyber threats evolved**. The above trends expand an organization's attack surface. For example, attack campaigns have become more sophisticated and persistent in exploiting multiple channels to infiltrate organizations, and cybercriminals face lower barriers to entry with the popularity of the "cybercrime-as-a-service" black market.

Traditional perimeter-based security has struggled to adapt to these changes. In particular, extending the "moat" outwards has introduced operational complexity for administrators, poor experiences for users, and inconsistency in how security controls are applied across users and applications.

![With many different methods to connect networks and filter/block traffic, managing access to company applications is costly and time consuming.](https://developers.cloudflare.com/_astro/cf1-ref-arch-1.DR89R8uB_Z1q6eem.svg)

The diagram above shows an example of this adapted perimeter-based approach, in which a mix of firewalls, WAN routers, and VPN concentrators are connected with dedicated WAN on-ramps consisting of MPLS circuits and/or leased lines. The diagram also demonstrates common problem areas. In an effort to centralize policy, organizations sometimes force all employee Internet traffic through their VPN infrastructure, which results in slow browsing and user complaints. Employees then seek workarounds — such as using non-approved devices — which increases their exposure to Internet-borne attacks when they work from home or on public Wi-Fi. In addition, IT teams are unable to respond quickly to changing business needs due to the complexity of their network infrastructure.

Such challenges are driving many organizations to prioritize goals like:

* Accelerating business agility by supporting remote / hybrid work with secure any-to-any access
* Improving productivity by simplifying policy management and by streamlining user experiences
* Reducing cyber risk by protecting users and data from phishing, ransomware, and other threats across all channels
* Consolidating visibility and controls across networking and security
* Reducing costs by replacing expensive appliances and infrastructure (e.g. VPNs, hardware firewalls, and MPLS connections)

## Understanding a SASE architecture

In recent years, [secure access service edge](https://www.cloudflare.com/learning/access-management/security-service-edge-sse/), or SASE, has emerged as an aspirational architecture to help achieve these goals. In a SASE architecture, network connectivity and security are unified on a single cloud platform and control plane for consistent visibility, control, and experiences from any user to any application.

SASE platforms consist of networking and security services, all underpinned by supporting operational services and a policy engine:

* Network services forward traffic from a variety of networks into a single global corporate network. These services provide capabilities like firewalling, routing, and load balancing.
* Security services apply to traffic flowing over the network, allowing for filtering of certain types of traffic and control over who can access what.
* Operational services provide platform-wide capabilities like logging, API access, and comprehensive Infrastructure-as-Code support through providers like Terraform.
* A policy engine integrates across all services, allowing admins to define policies which are then applied across all the connected services.

![Cloudflare's SASE cloud platform offers network, security, and operational services, as well as policy engine features, to provide zero trust connectivity between a variety of user identities, devices and access locations to customer applications, infrastructure and networks.](https://developers.cloudflare.com/_astro/cf1-ref-arch-2.BMHjAM9W_Z2qkFk1.svg)

## Cloudflare One: single-vendor, single-network SASE

Most organizations move towards a SASE architecture progressively rather than all at once, prioritizing key security and connectivity use cases and adopting services like [Zero Trust Network Access](https://www.cloudflare.com/learning/access-management/what-is-ztna/) (ZTNA) or [Secure Web Gateway](https://www.cloudflare.com/learning/access-management/what-is-a-secure-web-gateway/) (SWG). Some organizations choose to use SASE services from multiple vendors. For most organizations, however, the aspiration is to consolidate security with a single vendor, in order to achieve simplified management, comprehensive visibility, and consistent experiences.

[Cloudflare One](https://www.cloudflare.com/cloudflare-one/) is a single-vendor SASE platform where all services are designed to run across all locations. All traffic is inspected closest to its source, which delivers consistent speed and scale everywhere. And thanks to composable and flexible on-ramps, traffic can be routed from any source to reach any destination.

Cloudflare's connectivity cloud also offers many other services that improve application performance and security, such as [API Gateway](https://www.cloudflare.com/learning/security/api/what-is-an-api-gateway/), [Web Application Firewall](https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/), [Content Delivery](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/), or [DDoS mitigation](https://www.cloudflare.com/learning/ddos/ddos-mitigation/), all of which can complement an organization's SASE architecture. For example, our Content Delivery Network (CDN) features can be used to improve the performance of a self hosted company intranet. Cloudflare's full range of services are illustrated below.

![Cloudflare's anycast network allows provides services on all connected servers to enable secure connections on public and home networks and at corporate offices.](https://developers.cloudflare.com/_astro/cf1-ref-arch-4.Bjts0g1J_Z1wuo2t.svg)

### Cloudflare's anycast network

Cloudflare's SASE platform benefits from our use of [anycast](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/) technology. Anycast allows Cloudflare to announce the IP addresses of our services from every data center worldwide, so traffic is always routed to the Cloudflare data center closest to the source. This means traffic inspection, authentication, and policy enforcement take place close to the end user, leading to consistently high-quality experiences.

Using anycast ensures the Cloudflare network is well balanced. If there is a sudden increase in traffic on the network, the load can be distributed across multiple data centers – which in turn, helps maintain consistent and reliable connectivity for users. Further, Cloudflare's large [network capacity](https://www.cloudflare.com/network/) and [AI/ML-optimized smart routing](https://blog.cloudflare.com/meet-traffic-manager/) also help ensure that performance is constantly optimized.

By contrast, many other SASE providers use Unicast routing in which a single IP address is associated with a single server and/or data center. In many such architectures, a single IP address is then associated with a specific application, which means requests to access that application may have very different network routing experiences depending on how far that traffic needs to travel. For example, performance may be excellent for employees working in the office next to the application's servers, but poor for remote employees or those working overseas. Unicast also complicates scaling traffic loads — that single service location must ramp up resources when load increases, whereas anycast networks can share traffic across many data centers and geographies.

![Cloudflare's anycast network ensures fast and reliable connectivity, whereas Unicast routing often sends all traffic to a single IP address, resulting in slower and failure prone connections.](https://developers.cloudflare.com/_astro/cf1-ref-arch-5.DVAtCA4Y_1Fsa2c.svg)

## Deploying a SASE architecture with Cloudflare

To understand how SASE fits into an organization's IT infrastructure, see the diagram below, which maps out all the common components of said infrastructure. Subsequent sections of this guide will add to the diagram, showing where each part of Cloudflare's SASE platform fits in.

![Typical enterprise IT infrastructure may consist of different physical locations, devices and data centers that require connectivity to multiple cloud and on-premises applications.](https://developers.cloudflare.com/_astro/cf1-ref-arch-6.CZw0spTE_ZNkzzQ.svg)

In the diagram's top half there are a variety of Internet resources (e.g. Facebook), SaaS applications (e.g. ServiceNow), and applications running in an [infrastructure-as-a-service (IaaS)](https://www.cloudflare.com/learning/cloud/what-is-iaas/) platform (e.g. AWS). This example organization has already deployed cloud based [identity providers](https://www.cloudflare.com/learning/access-management/what-is-an-identity-provider/) (IdP), [unified endpoint management](https://www.cloudflare.com/learning/security/glossary/what-is-endpoint/) (UEM) and endpoint protection platforms (EPP) as part of a Zero Trust initiative.

In the bottom half are a variety of users, devices, networks, and locations. Users work from a variety of locations: homes, headquarters and branch offices, airports, and others. The devices they use might be managed by the organization or may be personal devices. In addition to the cloud, applications run in a data center in the organization's headquarters and in a data center operators' colo facility ([Equinix](https://www.equinix.com/), in this example).

A SASE architecture will define, secure, and streamline how each user and device will connect to the various resources in the diagram. Over the following sections, this guide will show ways to integrate Cloudflare One into the above infrastructure:

* **Applications and services**: Placing access to private applications and services behind Cloudflare
* **Networks**: Connecting entire networks to Cloudflare
* **Forwarding device traffic**: Facilitating access to Cloudflare-protected resources from any device
* **Verifying users and devices**: Identifying which users access requests come from, and which devices those users have

### Connecting applications

This journey to a SASE architecture starts with an organization needing to provide remote access to non-Internet facing, internal-only web applications and services (e.g. SSH or RDP). Organizations typically deploy VPN appliances to connect users to the company network where the applications are hosted. However, many applications now live in cloud Infrastructure-as-a-Service platforms, where traditional VPN solutions are hard to configure. This often results in poor application and connectivity performance for users.

#### Tunnels to self-hosted applications

[Zero Trust Network Access](https://www.cloudflare.com/learning/access-management/what-is-ztna/) (ZTNA) is a SASE service that secures access to self-hosted applications and services. ZTNA functionality can be divided broadly into two categories: 1) establishing connectivity between Cloudflare's network and the environments where the applications are running, and 2) setting policies to define how users are able to access these applications. In this section, we first examine the former — how to connect apps to Cloudflare.

Connectivity to self-hosted applications is facilitated through tunnels that are created and maintained by a software connector, [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/). `cloudflared` is a lightweight daemon installed in an organizations' infrastructure that creates a tunnel via an outbound connection to Cloudflare's global network. The connector can be installed in a variety of ways:

* In the OS installed on the bare metal server
* In the OS that is running in a virtualized environment
* In a [container](https://hub.docker.com/r/cloudflare/cloudflared) running in a Docker or Kubernetes environment

`cloudflared` runs on Windows, Linux, or macOS operating systems and creates an encrypted tunnel using QUIC, a modern protocol that uses UDP (instead of TCP) for fast tunnel performance and modern encryption standards. Generally speaking, there are two approaches for how users can deploy `cloudflared` in their environment:

1. **On the same server and operating system where the application or service is running**. This is typically in high-risk or compliance deployments where organizations require independent tunnels per application. `cloudflared` consumes a small amount of CPU and RAM, so impact to server performance is marginal.
2. **On a dedicated server(s) in the same network where the applications run**. This often takes the form of multiple containers in a Docker or Kubernetes environment.

`cloudflared` manages multiple outbound connections back to Cloudflare and usually requires no changes to network firewalls. Those connections are spread across servers in more than one Cloudflare data center for reliability and failover. Traffic destined for a tunnel is forwarded to the connection that is geographically closest to the request, and if a `cloudflared` connection isn't responding, the tunnel will automatically failover to the next available.

For more control over the traffic routed through each tunnel connection, users can integrate with the Cloudflare [load balancing](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/public-load-balancers/) service. To ensure reliable local connectivity, organizations should deploy more than one instance of `cloudflared` across their application infrastructure. For example, with ten front-end web servers running in a Kubernetes cluster, you might deploy three kubernetes services [running `cloudflared` replicas](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/kubernetes/).

![Using cloudflared, multiple outbound connections are created back to Cloudflare across multiple data centers to improve overall performance and reliability.](https://developers.cloudflare.com/_astro/cf1-ref-arch-7.Dk3BnKM8_1nIUVR.svg)

Once tunnels have been established, there are two methods for how user traffic is forwarded to your application or service. Each method below is protected by policies managed by the ZTNA service that enforces authentication and access (which will be explored in further depth [later in this document](#secure-access-to-self-hosted-apps-and-services)).

##### Public hostname

Each public hostname is specific to an address, protocol, and port associated with a private application, allowing for narrow access to a specific service when there might be multiple applications running on the same host.

For example, organizations can define a public hostname (`mywebapp.domain.com`) to provide access to a web server running on `https://localhost:8080`, while ensuring no access to local Kubernetes services.

* A hostname is created in a public DNS zone and all requests to that hostname are first routed to the Cloudflare network, inspected against configured security and access policies, before being routed through the tunnel to the secured private resource
* Multiple hostnames can be defined per tunnel, with each hostname mapping to a single application (service address and port)
* Support for HTTP/HTTPS protocols
* Access to resources only requires a browser
* When Cloudflare's device client is deployed on an user device, policies can leverage additional contextual signals (e.g. determining whether the device is managed or running the latest OS) in policy enforcement
* For access to SSH/VNC services, Cloudflare renders an SSH/VNC terminal using webassembly in the browser

Applications exposed this way receive all of the benefits of Cloudflare's leading DNS, CDN, and DDoS services as well as our web application firewall (WAF), API, and bot services, all without exposing application servers directly to the Internet.

##### Private network

In some cases, users may want to leverage ZTNA policies to provide access to many applications on an entire private network. This allows for greater flexibility over the ways clients connect and how services are exposed. It also enables communication to resources over protocols other than HTTP. In this scenario, users specify the subnet for the private network they wish to be accessible via Cloudflare.

* `cloudflared`, combined with Cloudflare device agent, provides access to private networks, allowing for any arbitrary L4 TCP, UDP or ICMP connections
* One or many networks can be configured using CIDR notation (e.g. 172.21.0.16/28)
* Access to resources on the private network requires the Cloudflare device agent to be installed on clients, and at least one Cloudflare Tunnel server on the connecting network

For both methods, it is important to note that `cloudflared` only proxies inbound traffic to a private application or network. It does not become a gateway or "on-ramp" back to Cloudflare for the network that it proxies inbound connections to. This means that if the web server starts its own connection to another Internet-based API, that connection will not be routed via Cloudflare Tunnel and will instead be routed via the host server's default route and gateway.

This is the desirable outcome in most network topologies, but there are some instances in which network services need to communicate directly with a remotely-connected user, or with services on other segmented networks.

If users require connections that originate from the server or network to be routed through Cloudflare, there are multiple on-ramps through which to achieve this, which will be explained further in the "Connecting Networks" section.

#### SaaS applications

SaaS applications are inherently always connected to and accessed via the public Internet. As a result, the aforementioned tunnel-and-app-connector approach does not apply. Instead, organizations with a SASE architecture inspect and enforce policies on Internet-bound SaaS traffic via a [secure web gateway](https://www.cloudflare.com/learning/access-management/what-is-a-secure-web-gateway/) (SWG), which serves as a cloud-native forward proxy.

The SWG includes policies that examine outbound traffic requests and inbound content responses to determine if the user, device, or network location has access to resources on the Internet. Organizations can use these policies to control access to approved SaaS applications, as well as detect and block the use of unapproved applications (also known as [shadow IT](https://www.cloudflare.com/learning/access-management/what-is-shadow-it/)).

Some SaaS applications allow organizations to configure an IP address allowlist, which limits access to the application based on the source IP address of the request. With Cloudflare, organizations can obtain dedicated [egress IP](https://developers.cloudflare.com/cloudflare-one/traffic-policies/egress-policies/dedicated-egress-ips/) addresses, which can be used as the source address for all traffic leaving their network. When combined with an allowlist in a SaaS application, organizations can ensure that users are only able to access applications if they are first connected to Cloudflare. (More detail on this approach is outlined in a later section about connecting user devices.)

Another method to secure access to SaaS applications is to configure single sign-on (SSO) so that Cloudflare becomes an identity proxy — acting as the identity provider (IDP) — as part of the authentication and authorization process.

* Apply consistent access policies across both self-hosted and SaaS applications
* Layer device security posture into the authentication process (e.g. users can ensure that only managed devices, running the latest operating system and passing all endpoint security checks, are able to access SaaS applications)
* Ensure that certain network routes are used for access (e.g. users can require that devices are connected to Cloudflare using the device agent, which allows them to filter traffic to the SaaS application and prevent downloads of protected data)
* Centralize SSO applications to Cloudflare and create one SSO integration from Cloudflare to their IdP — making both infrastructure and access policies SSO-agnostic (e.g. users can allow access to critical applications only when MFA is used, no matter which IdP is used to authenticate)

When Cloudflare acts as the SSO service to an application, user authentication is still handled by an organization's existing identity provider, but is proxied via Cloudflare, where additional access restrictions can be applied. The diagram below is a high-level example of a typical request flow:

![The flow of SSO requests is proxied through Cloudflare, where the IdP is still used to authenticate, but Cloudflare provides additional access controls.](https://developers.cloudflare.com/_astro/cf1-ref-arch-8.B5wnNeFj_CONnJ.svg)

The last method of connecting SaaS applications to Cloudflare's SASE architecture is with an API-based [cloud access security broker](https://www.cloudflare.com/learning/access-management/what-is-a-casb/) (CASB). The Cloudflare CASB integrates via API to [popular SaaS suites](https://developers.cloudflare.com/cloudflare-one/integrations/cloud-and-saas/) — including Google Workspace, Microsoft 365, Salesforce, and more — and continuously scans these applications for misconfigurations, unauthorized user activity, and other security risks.

Native integration with the Cloudflare [data loss prevention](https://www.cloudflare.com/learning/access-management/what-is-dlp/) (DLP) service enables CASB to scan for sensitive or regulated data that may be stored in files with incorrect permissions — further risking leaks or unauthorized access. CASB reports findings that alert IT teams to items such as:

* Administrative accounts without adequate MFA
* Company-sensitive data in files stored with public access permissions
* Missing application configurations (e.g. domains missing SPF/DMARC records)

#### Checkpoint: Connecting applications to Cloudflare

Now, this is what the architecture of a typical organization might look like once they have integrated with Cloudflare services. It is important to note that Cloudflare is designed to secure organizations' existing applications and services in the following ways:

* All self-hosted applications and services are only accessible through Cloudflare and controlled by policies defined by the Cloudflare ZTNA
* SaaS application traffic is filtered and secured via the Cloudflare SWG
* SaaS services are scanned via the Cloudflare CASB to check for configuration and permissions of data at rest

![Access to all applications is now only available via Cloudflare.](https://developers.cloudflare.com/_astro/cf1-ref-arch-9.DbbzPtNJ_Z2ns51a.svg)

### Connecting networks

Once an organization's applications and services have been integrated, it is time to connect Cloudflare to their existing networks. Regional offices, corporate headquarters, retail locations, data centers, and cloud-hosted infrastructure all need to forward traffic to the new corporate SASE network.

When all traffic flows through Cloudflare, SASE services perform the following actions:

* Granting application access
* Filtering general Internet-bound traffic (e.g. blocking access to sites that host malware)
* Isolating web sites to protect users from day-zero or unknown harmful Internet content
* Filtering traffic to identify data defined by DLP policies — then blocking the download/upload of that data to insecure devices or applications
* Providing visibility into the use of non-approved applications and allowing admins to either block or apply policies around their use

There are several approaches for connecting networks to Cloudflare, which can provide further flexibility in how an organization provides access to SASE-protected resources:

1. **Use software agents to create tunnels from host machines back to Cloudflare**. This is typically the method favored by users who own their own servers and applications.
2. **Set up IPsec or GRE tunnels from network routers and firewalls to connect them to the Cloudflare WAN service**. This is the approach that network administrators use when they want to forward traffic to and from entire networks.
3. **Connect a network directly to Cloudflare**. This method works best when an organization's network resides in a supported data center, usually one that is colocated with a Cloudflare data center.

These methods will be explained further in the next sections.

#### Using software agents

There are two software-based methods of connecting networks to Cloudflare, depending on the type of applications that currently exist on the network.

##### Client-to-server connectivity

As described in the previous section, [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/) proxies requests to applications and services on private networks. It installs on servers in the private network and creates secure tunnels to Cloudflare over the Internet. These connections are balanced across multiple Cloudflare data centers for reliability and can be made via multiple connectors, which helps increase the capacity of the tunnels.

Using `cloudflared`, Cloudflare Tunnel supports client to server connections over the Tunnel. Any service or application running behind the Tunnel will use the default routing table when initiating outbound connectivity.

This model is appropriate for a majority of scenarios, in which external users need to access resources within a private network that does not require bidirectionally-initiated communication.

![Requests initiated from a client are securely tunneled to Cloudflare via a device agent, while requests from inside the private network follow the default route.](https://developers.cloudflare.com/_astro/cf1-ref-arch-10.PVIlTF5F_Zqb29Q.svg)

For bidirectional, or meshed connectivity, organizations should use the WARP Connector.

##### Mesh connectivity

The [WARP Connector](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/warp-connector/) is a lightweight solution for site-to-site, bidirectional, and mesh networking connectivity that does not require changes to underlying network routing infrastructure. WARP Connector software is installed on a Linux server within an organization's network, which then becomes a gateway for other local networks that need to on-ramp traffic to Cloudflare.

This provides a lightweight solution to support services such as Microsoft's System Center Configuration Manager (SCCM), Active Directory server updates, VOIP and SIP traffic, and developer workflows with complex CI/CD pipeline interaction. It can either be run supplementally to `cloudflared` and Magic WAN, or can be a standalone remote access and site-to-site connector to the Cloudflare network.

The WARP Connector can proxy both user-to-network and network-to-network connectivity, or can be used to establish an overlay network of Carrier Grade NAT ([CGNAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT)) addressed endpoints to provide secure, direct connectivity to established resources using CGNAT IP ranges. This helps address overlapping network IP range challenges, point-solution access problems, or the process of shifting network design without impacting a greater underlying system.

![In an example scenario, a developer might push code to a git repository, which ends up in a Kubernetes cluster in a staging network. From staging, it is accessed by a QA tester. All of this traffic is routed and protected via WARP Connector.](https://developers.cloudflare.com/_astro/cf1-ref-arch-11.CZ1ltr0Y_qGFis.svg)

Cloudflare Tunnel via `cloudflared` is the primary method for connecting users to applications and services on private networks because it is a simpler, more granular and agile solution for many application owners (vs. IP tunnel based connectivity technology, like [IPsec](https://www.cloudflare.com/learning/network-layer/what-is-ipsec/) and [GRE](https://www.cloudflare.com/learning/network-layer/what-is-gre-tunneling/)). Cloudflare Tunnel via WARP Connector is the preferred method for mesh or other software-defined networking — most of which require bidirectional connectivity — when organizations do not want to make changes to the underlying network routing or edge infrastructure.

#### Using network equipment

Where it is not optimal or possible to install software agents, networks can also be connected to Cloudflare using existing network equipment, such as routers and network firewalls. To do this, organizations create IPsec or GRE tunnels that connect to Cloudflare's cloud-native [Magic WAN](https://www.cloudflare.com/network-services/products/magic-wan/) service. With Magic WAN, existing network hardware can connect and route traffic from their respective network locations to Cloudflare through a) secure, IPsec-based tunnels over the Internet or, b) across [Cloudflare Network Interconnect](https://www.cloudflare.com/network-services/products/network-interconnect/) (CNI) — private, direct connections that link existing network locations to the nearest Cloudflare data center.

Cloudflare's WAN service uses a "light-branch, heavy-cloud" architecture that represents the evolution of software-defined WAN (SD-WAN) connectivity. With Magic WAN, as depicted in the network architecture diagram below, the Cloudflare global network functions as a centrally-managed connectivity hub that securely and efficiently routes traffic between all existing network locations:

![Cloudflare's Connectivity Cloud securely links a variety of network locations to the Internet through products such as Firewall, ZTNA, CASB and Load Balancer.](https://developers.cloudflare.com/_astro/cf1-ref-arch-12.D-EXKLBe_ZzagoI.svg)

As previously described, Cloudflare uses a routing technique called [anycast](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/) to globally advertise all of the services and endpoints on the Cloudflare network, including the endpoints for WAN IP tunnels.

With [anycast IPsec](https://blog.cloudflare.com/anycast-ipsec/) or anycast GRE tunnels, each tunnel configured from an organization's network device (e.g. edge router, firewall appliance, etc.) connects to hundreds of global Cloudflare data centers. Traffic sourced from an organization's network location is sent directly over these tunnels and always routes to the closest active Cloudflare data center. If the closest Cloudflare data center is unavailable, the traffic is automatically rerouted to the next-closest data center.

![In an example scenario, IPsec traffic from an office network's router would be sent to the closest Cloudflare data center.](https://developers.cloudflare.com/_astro/cf1-ref-arch-13.5dK35i5D_CCed1.svg)

To further network resiliency, Magic WAN also supports Equal Cost Multi-Path (ECMP) routing between the Cloudflare network and an organization's network location(s). With ECMP, traffic can be load-balanced across multiple anycast IP tunnels, which helps increase throughput and maximize network reliability. In the event of network path failure of one or more tunnels, traffic can be automatically failed over to the remaining healthy tunnels.

The simplest and easiest way to on-ramp existing network locations to the Magic WAN service is to deploy Cloudflare Magic WAN Connector, a lightweight appliance you can install in corporate network locations to automatically connect, steer, and shape any IP traffic through secure IPsec tunnels. When the WAN Connector is installed into a network, it will automatically establish communication with the Cloudflare network, download and provision relevant configurations, establish resilient IPsec tunnels, and route connected site network traffic to Cloudflare.

The WAN Connector can be deployed as either a hardware or virtual appliance, making it versatile for a variety of user network environments — on-premises, virtual, or public cloud. Management, configuration, observability, and software updates for WAN Connectors is centrally managed from Cloudflare via either the dashboard or the Cloudflare API. As of 2023, the WAN Connector is currently best-suited for connecting small and medium-sized networks to Cloudflare (e.g. small offices and retail stores).

In situations where deploying the WAN Connector is not feasible or desirable, organizations can securely connect their site networks to Cloudflare by configuring IPsec tunnels from their existing IPsec-capable network devices, including WAN or SD-WAN routers, firewalls, and cloud VPN gateways. Please refer to the Cloudflare [documentation](https://developers.cloudflare.com/magic-wan/configuration/manually/third-party/) for up-to-date examples of validated IPsec devices.

There may also be situations where network-layer encryption is not necessary — for example, when a site's WAN-bound traffic is already encrypted at the application layer (via TLS), or when an IPsec network device offers very limited throughput performance as it encrypts and decrypts IPsec traffic. Under these circumstances, organizations can connect to the Cloudflare network using [GRE tunnels](https://developers.cloudflare.com/magic-wan/configuration/manually/how-to/configure-tunnel-endpoints/).

Organizations may also connect their network locations directly to the Cloudflare network via [Cloudflare Network Interconnect](https://www.cloudflare.com/network-services/products/network-interconnect/) (CNI). Cloudflare [supports a variety of options](https://developers.cloudflare.com/network-interconnect/) to connect your network to Cloudflare:

* Direct CNI for Magic WAN and Magic Transit
* Classic CNI for Magic Transit
* Cloud CNI for Magic WAN and Magic Transit
* Peering via either an internet exchange, or a private network interconnect (PNI).

The following table summarizes the different methods of connecting networks to Cloudflare:

| **Use case** | **Recommended** | **Alternative solution** |
| - | - | - |
| Remote users connecting to applications on private networks in a Zero Trust model (e.g. most VPN replacement scenarios) | **Cloudflare Tunnel (with `cloudflared`)** | **Magic WAN** Alternative option if `cloudflared` not suitable for environment |
| Site-to-site connectivity between branches, headquarters, and data centers | **Magic WAN** | **Cloudflare Tunnel (with WARP Connector)** Alternative option if routing changes cannot be made at perimeter |
| Egress traffic from physical sites or cloud environments to cloud security inspection (e.g. most common SWG and branch firewall replacement scenarios) | **Magic WAN** | **N/A** |
| Service-initiated communication with remote users (e.g. AD or SCCM updates, DevOps workflows, VOIP) | **Cloudflare Tunnel (with WARP Connector)** | **Magic WAN** Alternative option if inbound source IP fidelity not required |
| Mesh networking and peer-to-peer connectivity | **Cloudflare Tunnel (with WARP Connector)** | **N/A** |

Each of these methods of connecting and routing traffic can be deployed concurrently from any location. The following diagram highlights how different connectivity methods can be used in a single architecture.

Note the following traffic flows:

* All traffic connected via a WARP Connector or device agent can communicate with each other over the mesh network

* Developers working from home can communicate with the production and staging servers in the cloud
  * The employee in the retail location, as well as the developer at home, can receive VOIP calls on their laptop

* A HPC Cluster in AWS represents a proprietary solution in which no third-party software agents can be installed; as a result, it uses an IPsec connection to Magic WAN

* In the retail location, the Magic WAN Connector routes all traffic to Cloudflare via an IPsec tunnel
  * An employee's laptop running the device agent creates its own secure connection to Cloudflare that is routed over the IPsec tunnel

* The application owner of the reporting system maintains a connection to Cloudflare using `cloudflared` and doesn't require any networking help to expose their application to employees

![Connecting and routing traffic can be created using various methods such as Cloudflare Network Interconnect, IPSEC tunnels, WARP Connector and cloudflared.](https://developers.cloudflare.com/_astro/cf1-ref-arch-14.BMsYJBWD_155tSw.svg)

*Note: All of the endpoints connected via the WARP Connector or device agent are automatically assigned IP addresses from the 100.96.0.0/12 address range, while endpoints connected to Magic WAN retain their assigned RFC1918 private IP addresses. `cloudflared` can be deployed in any of the locations by an application owner to provide hostname-based connectivity to the application.*

Once the networks, applications, and user devices are connected to Cloudflare — regardless of the connection methods and devices used — all traffic can be inspected, authenticated, and filtered by the Cloudflare SASE services, then securely routed to their intended destinations. Additionally, consistent policies can be applied across all traffic, no matter how it arrives at Cloudflare.

#### Checkpoint: Connecting networks to Cloudflare

Now this is what a SASE architecture looks like where corporate network traffic from everywhere is forwarded to and processed by Cloudflare. In this architecture, it is possible to make a network connection from any remote location, office location or data center and connect to applications and services living in SaaS infrastructure, cloud-hosted infrastructure or an organization's own on-premise data centers.

![Traffic from all networks, North and South, as well as East and West, is now flowing through and secured by Cloudflare.](https://developers.cloudflare.com/_astro/cf1-ref-arch-15.BL6UWZPA_ZLNfeP.svg)

### Forwarding device traffic

The previous sections explain using ZTNA to secure access to self-hosted applications and using an SWG to inspect and filter traffic destined for the Internet. When a user is working on a device in any of the company networks that is connected to Cloudflare's connectivity cloud, all that traffic is inspected and policies applied without disrupting the user's workflow. Yet, users are not always (or ever) in the office; they work from home, on the road, or from other public networks. How do you ensure they have reliable access to your internal applications? How do you ensure their Internet browsing is secure no matter their work location?

There are several approaches to ensure that traffic from a user device which isn't connected to an existing Cloudflare protected network, are also forwarding traffic through Cloudflare and be protected.

* [Install an agent on the device](#connecting-with-a-device-agent)
* [Modify browser proxy configuration](#browser-proxy-configuration)
* [Direct the user to a remote browser instance](#using-remote-browser-instances)
* [Modify DNS configuration](#agentless-dns-filtering)

#### Connecting with a device agent

The preferred method of ensuring device traffic is forwarded to Cloudflare is to install the device agent (also referred to as [Cloudflare WARP](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp)). The agent runs on Windows, macOS, Linux, iOS, and Android/ChromeOS, and creates a secure connection to Cloudflare where all non-local traffic is sent. Because of Cloudflare's use of anycast networking, the device agent always connects to the nearest Cloudflare server to ensure the best performance for the user. The device agent also collects local machine and network information, which is sent in the request to enrich the policy in Cloudflare.

To allow for flexibility in how different devices and users connect, there are multiple [deployment modes](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/configure-warp/warp-modes/):

* A full L4 traffic proxy
* L7 DNS proxy
* L7 HTTP proxy
* The ability to just collect device posture information

For example, organizations might have an office that continues to use an existing [DNS filtering](https://www.cloudflare.com/learning/access-management/what-is-dns-filtering/) service, so they can configure the agent to just proxy network and HTTP traffic.

The agent can also be configured with flexible routing controls that allow for scenarios in which traffic destined for office printers is not sent to the Cloudflare network but, instead, routed to the local network. These [split tunnel configurations](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/configure-warp/route-traffic/split-tunnels/) can be made specific to groups of users, types of device operating system, or networks and by default, traffic destined to all private [IPv4 and IPv6 ranges](https://datatracker.ietf.org/doc/html/rfc1918) is sent to the device's default gateway. If the application the user is attempting to reach is not in public DNS, you can configure the hostname and domain to be resolved with [local DNS services](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/cloudflared/private-dns/), so that the device agent does not attempt to resolve these using Cloudflare DNS.

![Using the device agent allows Internet and company application bound traffic to be secured by Cloudflare's SWG and ZTNA services.](https://developers.cloudflare.com/_astro/cf1-ref-arch-16.DBOEvI3k_Z19SAh0.svg)

The agent is more than just a network proxy; it is able to examine the device's security posture, such as if the operating system is fully up-to-date or if the hard disk is encrypted. Cloudflare's integrations with [CrowdStrike](https://www.cloudflare.com/partners/technology-partners/crowdstrike/endpoint-partners/), [SentinelOne](https://www.cloudflare.com/partners/technology-partners/sentinelone/), and other third-party services also provide additional data about the security posture of the device. All of this information is associated with each request and, therefore, available for use in company policies — as explained in the "Unified Management" section.

The agent can be [deployed](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/deployment/) to a device either manually or using existing endpoint management (UEM) technologies. Using the agent, users register and authenticate their device to Cloudflare with the integrated identity providers. Identity information — combined with information about the local device — is then used in your SWG and ZTNA policies (including inline CASB capabilities shared across these Cloudflare services).

#### Browser proxy configuration

When it is not possible to install software on the device, there are agentless approaches.

One option is to configure the browser to forward HTTP requests to Cloudflare by configuring proxy server details in the browser or OS. Although this can be done manually, it is more common for organizations to automate the configuration of browser proxy settings using Internet-hosted [Proxy Auto-Configuration](https://developers.cloudflare.com/cloudflare-one/networks/resolvers-and-proxies/proxy-endpoints/) (PAC) files. The browser identifies the PAC file location in several ways:

* MDM software configuring the setting in the browser
* In Windows domains, Group Policy Objects (GPO) can configure the browser's PAC file
* Browsers can use [Web Proxy Auto-Discovery](https://datatracker.ietf.org/doc/html/draft-ietf-wrec-wpad-01) (WPAD)

From there, configure a proxy endpoint where the browser will send all HTTP requests to. If using this method, please note that:

* Filtering HTTPS traffic will also require [installing and trusting Cloudflare root certificates](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/user-side-certificates/) on the devices.
* A proxy endpoint will only proxy traffic sourced from a set of known IP addresses, such as the pool of public IP addresses used by a site's NAT gateway, that the administrator must specify.

#### Using remote browser instances

Another option to ensure device traffic is sent to Cloudflare is to use [remote browser isolation](https://www.cloudflare.com/learning/access-management/what-is-browser-isolation/) (RBI). When a remote user attempts to visit a website, the corresponding requests and responses are handled by a headless remote browser running in the Cloudflare network that functions as a "clone" of the user device's local browser. This shields the user's device from potential harmful content and code execution that may be downloaded from the website it visits.

RBI renders the received content in an isolated and secure cloud environment. Instead of executing the web content locally, the user device receives commands for how to "draw" the final rendered web page over a highly optimized protocol supported by all HTML5-compliant browsers on all operating systems. Because the remote browser runs on Cloudflare's servers, SWG policies are automatically applied to all browser requests.

Ensuring access to sites is protected with RBI does not require any local software installation or reconfiguring the user's browser. Below are [several ways](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/setup/) to accomplish this:

* Typically, a remote browser session is started as the result of an SWG policy — the user just requests websites without being notified that the content is loading in a remote browser.
* Organizations can also provide users with a link that automatically ensures RBI always processes each request.
* Organizations can also opt to use the ZTNA service to redirect all traffic from self-hosted applications via RBI instances.

All requests via a remote browser pass through the Cloudflare SWG; therefore, policies can enforce certain website access limitations. For instance, browser isolation policies can be established to:

* Disable copy/paste between a remote web page and the user's local machine; this can prevent the employee from pasting proprietary code into third-party chatbots.
* Disable printing of remote web content to prevent contractors from printing confidential information
* Disable file uploads/downloads to ensure sensitive company data is not sent to — or downloaded from — certain websites.
* Disable keyboard input (in combination with other policies) to limit data being exposed, such as someone typing in passwords to a phishing site.

Isolating web applications and applying policies to risky websites helps organizations limit data loss from cyber threats or user error. And, like many Cloudflare One capabilities, RBI can be leveraged across other areas of the SASE architecture. Cloudflare's [email security](https://www.cloudflare.com/learning/email-security/what-is-email-security/) service, for example, can automatically rewrite and isolate suspicious links in emails. This "email link isolation" capability helps protect the user from potential malicious activity such as credential harvesting phishing.

#### Agentless DNS Filtering

Another option for securing traffic via the Cloudflare network is to configure the device to forward DNS traffic to Cloudflare to be inspected and filtered. First [DNS locations](https://developers.cloudflare.com/cloudflare-one/traffic-policies/initial-setup/dns/#connect-dns-locations) are created which allow policies to be applied based on different network locations. They can be determined either by the source IP address for the request or you can use "[DNS over TLS](https://www.cloudflare.com/learning/dns/dns-over-tls/)" or "[DNS over HTTPS](https://www.cloudflare.com/learning/dns/dns-over-tls/)".

When using source IP addresses, either the device will need to be told which DNS servers to use, or the local DNS server on the network the device is connected to needs to forward all DNS queries to Cloudflare. For DNS over TLS or HTTPS support, the devices need to be configured and support varies. Our recommendation is to use DNS over HTTPS which has wider operating system support.

All of the above methods result in only the DNS requests — not all traffic — being sent to Cloudflare. SWG DNS policies are then implemented at this level to manage access to corporate network resources.

#### Summary of SWG capabilities for each traffic forwarding method

The following table summarizes SWG capabilities for the various methods of forwarding traffic to Cloudflare (as of Oct 2023):

| | IP tunnel or Interconnect (Magic WAN) | Device Agent (WARP)\*1 | Remote Browser | Browser proxy | DNS proxy |
| - | - | - | - | - | - |
| Types of traffic forwarded | TCP/UDP | TPC/UDP | HTTP | HTTP | DNS |
| **Policy types** | | | | | |
| DNS | Yes | Yes | Yes | Yes | Yes |
| HTTP/S\*2 | Yes | Yes | Yes | Yes | N/A |
| Network (L3/L4 parameter) | Yes | Yes | Yes | Yes | No |
| **Data available in policies** | | | | | |
| Identity information | No | Yes | Yes | No | No\*3 |
| Device posture | No | Yes | No | No | No |
| **Capabilities** | | | | | |
| Remote browser isolation | Yes | Yes | Yes | Yes | N/A |
| Enforce egress IP | Yes | Yes | Yes | Yes | N/A |

1. Running the device agent in DNS over HTTP mode provides user identity information, in addition to the same capabilities as connecting via DNS.
2. To filter HTTPS traffic, the Cloudflare [certificate](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/user-side-certificates/) needs to be installed on each device. This can be automated when using the device agent.
3. If configuring DNS over HTTPS, it is possible to inject a [service token](https://developers.cloudflare.com/cloudflare-one/networks/resolvers-and-proxies/dns/dns-over-https/#filter-doh-requests-by-user) into the request, which associates the query with an authenticated user.

#### Checkpoint: Forwarding device traffic to Cloudflare

By connecting entire networks or individual devices, organizations can now route user traffic to Cloudflare for secure access to privately-hosted applications and secure public Internet access.

Once traffic from all user devices is forwarded to the Cloudflare network, it is time for organizations to revisit their high-level SASE architecture:

![With all devices and networks connected, any traffic destined for company applications and services all flows through Cloudflare, where policies are applied to determine access.](https://developers.cloudflare.com/_astro/cf1-ref-arch-17.Cv4XcukK_Z1KCWhH.svg)

### Verifying users and devices

At this point in implementing SASE architecture, organizations have the ability to route and secure traffic beginning from the point a request is made from a browser on a user's device, all the way through Cloudflare's network to either a company-hosted private application/service or to the public Internet.

But, before organizations define policies to manage that access, they need to know who is making the request and determine the security posture of the device.

#### Integrating identity providers

The first step in any access decision is to determine who is making the request – i.e., to authenticate the user.

Cloudflare integrates with identity providers that manage secure access to resources for organizations' employees, contractors, partners, and other users. This includes support for integrations with any [SAML](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/generic-saml/) - or OpenID Connect ([OIDC](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/generic-oidc/)) - compliant service; Cloudflare One also includes pre-built integrations with [Okta](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/okta/), [Microsoft Entra ID (formerly Azure Active Directory)](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/entra-id/), [Google Workspace](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google-workspace/), as well as consumer IdPs such as [Facebook](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/facebook-login/), [GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/) and [LinkedIn](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/linkedin/).

Multiple IdPs can be integrated, allowing organizations to apply policies to a wide range of both internal and external users. When a user attempts to access a Cloudflare secured application or service, they are redirected to authenticate via one of the integrated IdPs. When using the device agent, users must also authenticate to one of their organization's configured IdPs.

![Users are presented with a list of integrated identity providers before accessing protected applications.](https://developers.cloudflare.com/_astro/cf1-ref-arch-18.dg0Dmn3U_18nofX.svg)

Once a user is authenticated, Cloudflare receives that user's information, such as username, group membership, authentication method (password, whether MFA was involved and what type), and other associated attributes (i.e., the user's role, department, or office location). This information from the IdP is then made available to the policy engine.

In addition to user identities, most corporate directories also contain groups to which those identities are members. Cloudflare supports the importing of group information, which is then used as part of the policy. Group membership is a critical part of aggregating single identities so that policies can be less complex. It is far easier — for example — to set a policy allowing all employees in the sales department to access Salesforce, than to identify each user in the sales organization.

Cloudflare also supports authentication of devices that are not typically associated with a human user – such as an IoT device monitoring weather conditions at a factory. For those secure connections, organizations can generate [service tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) or create [Mutual TLS](https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/) (mTLS) certificates that can be deployed to such devices or machine applications.

#### Trusting devices

Not only does the user identity need to be verified, but the security posture of the user's device needs to be assessed. The device agent is able to provide a range of device information, which Cloudflare uses to build comprehensive security policies.

The following built-in posture checks are available:

* [Application check](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/application-check/): Checks that a specific application process is running
* [File check](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/file-check/): Checks for the presence of a file
* [Firewall](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/firewall/): Checks if a firewall is running
* [Disk encryption](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/disk-encryption/): Checks if/how many disks are encrypted
* [Domain joined](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/domain-joined/): Checks if the device is joined to a Microsoft Active Directory domain
* [OS version](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/os-version/): Checks what version of the OS is running
* [Unique Client ID](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/device-uuid/): When using an MDM too, organizations can assign a verifiable UUID to a mobile, desktop, or laptop device
* [Device serial number](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/corp-device/): Checks to see if the device serial matches a list of company desktop/laptop computers

Cloudflare One can also integrate with any deployed endpoint security solution, such as [Microsoft Endpoint Manager](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/microsoft/), [Tanium](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/taniums2s/), [Carbon Black](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/carbon-black/), [CrowdStrike](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/crowdstrike/), [SentinelOne](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/sentinelone/), and more. Any data from those products can be passed to Cloudflare for use in access decisions.

All of the above device information, combined with data on the user identity and also the network the device is on, is available in Cloudflare to be used as part of the company policy. For example, organizations could choose to only allow administrators to SSH into servers when all of the following conditions are met: their device is free from threats, running the latest operating system, and joined to the company domain.

Because this information is available for every network request, any time a device posture changes, its ability to connect to an organization's resources is immediately impacted.

#### Integrating email services

Email — the #1 communication tool for many organizations and the most common channel by which phishing attacks occur — is another important corporate resource that should be secured via a SASE architecture. Phishing is the root cause of upwards of 90% of breaches that lead to financial loss and brand damage.

Cloudflare's email security service scans for signs of malicious content or attachments before they can reach the inbox, and also proactively scans the Internet for attacker infrastructure and attack delivery mechanisms, looking for programmatically-created domains that are used to host content as part of a planned attack. Our service uses all this data to also protect against business and vendor email compromises ([BEC](https://www.cloudflare.com/learning/email-security/business-email-compromise-bec/) / [VEC](https://www.cloudflare.com/learning/email-security/what-is-vendor-email-compromise/)), which are notoriously hard to detect due to their lack of payloads and ability to look like legitimate email traffic.

Instead of deploying tunnels to manage and control traffic to email servers, Cloudflare provides two methods of email security [setup](https://developers.cloudflare.com/email-security/deployment/):

* [Inline](https://developers.cloudflare.com/email-security/deployment/inline/): Redirect all inbound email traffic through Cloudflare before they reach a user's inbox by modifying MX records
* [API](https://developers.cloudflare.com/email-security/deployment/api/): Integrate Cloudflare directly with an email provider such as Microsoft 365 or Gmail

Modifying MX records (inline deployment) forces all inbound email traffic through our cloud email security service where it is scanned, and — if found to be malicious — blocked from reaching a user's inbox. Because the service works at the MX record level, it is possible to use the email security service with any [SMTP-compliant](https://www.cloudflare.com/learning/email-security/what-is-smtp/) email service.

![Protecting email with Cloudflare using MX records ensures all emails are scanned and categorized.](https://developers.cloudflare.com/_astro/cf1-ref-arch-19.B4iJKLu2_Z22e1gD.svg)

Organizations can also opt to integrate email security directly with their email service via APIs. Note that this approach has two drawbacks: there are fewer integrations Cloudflare supports and there is always a small delay between the email being delivered to the service and Cloudflare detecting it via the API.

![Protecting email with Cloudflare using APIs avoids the need to change DNS policy, but introduces delays into email detection and limits the types of email services that can be protected.](https://developers.cloudflare.com/_astro/cf1-ref-arch-20.CpqyyvgC_Z2fainl.svg)

#### Checkpoint: A complete SASE architecture with Cloudflare

The steps above provide a complete view of evolving to SASE architecture using Cloudflare One. As the diagram below shows, secure access to all private applications, services, and networks — as well as ensuring the security of users' general Internet access — is now applied to all users in the organization, internal or external.

![A fully deployed SASE solution with Cloudflare protects every aspect of your business. Ensuring all access to applications is secured and all threats from the Internet mitigated.](https://developers.cloudflare.com/_astro/cf1-ref-arch-21.B4dzMu9Q_1OT1sz.svg)

For ease of use, the entire Cloudflare One platform can be configured via [API](https://developers.cloudflare.com/api/); and with Cloudflare's [Terraform provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs), organizations can manage the Cloudflare global network using the same tools they use to automate the rest of their infrastructure. This allows IT teams to fully manage their Cloudflare One infrastructure, including all the policies detailed in the next section, using code. There are also (as of Oct 2023) more than 500 [GitHub](https://github.com/cloudflare) repositories, many of which allow IT teams to use and build tools to manage their Cloudflare deployment.

## Unified management

Now that all users, devices, applications, networks, and other components are seamlessly integrated within a SASE architecture, Cloudflare One provides a centralized platform for comprehensive management. Because of the visibility Cloudflare has across the entire IT infrastructure, Cloudflare can aggregate signals from various sources, including devices, users, and networks. These signals can inform the creation of policies that govern access to organization resources.

Before we go into the details of how policies can be written to manage access to applications, services, and networks connected to Cloudflare, it's worth taking a look at the two main enforcement points in Cloudflare's SASE platform that control access: SWG and the ZTNA services. These services are configured through a single administrative dashboard, simplifying policy management across the entire SASE deployment.

The following diagram illustrates the flow of a request through these services, including the application of policies and the source of data for these policies. In the diagram below, the user request can either enter through the SWG or ZTNA depending on the type of service requested. It's also possible to combine both services, such as implementing a SWG HTTP policy that uses DLP service to inspect traffic related to a privately hosted application behind a ZTNA Cloudflare Tunnel. This configuration enables organizations to block downloads of sensitive data from internal applications that organizations have authorized for external access.

![User requests to the Internet or self hosted applications go through our SWG and/or ZTNA service. Administrators have a single dashboard to manage policies across both.](https://developers.cloudflare.com/_astro/cf1-ref-arch-23.By2O_HTZ_Z1BmCAS.svg)

In the following sections, we introduce examples of how different policies can be configured to satisfy specific use cases. While these examples are not exhaustive, the goal is to demonstrate common ways Cloudflare One can be configured to address the challenges organizations encounter in its transition to a SASE architecture.

Connecting an IdP to Cloudflare provides the ability to make access decisions based on factors such as group membership, authentication method, or specific user attributes. Cloudflare's device agent also supplies additional signals for policy considerations, such as assessing the operating system or verifying the device's serial number against company-managed devices. However, there are features that allow users to incorporate additional data into deployment for building powerful policies.

Cloudflare's vast intelligent network continually monitors billions of web assets and [categorizes them](https://developers.cloudflare.com/cloudflare-one/traffic-policies/domain-categories/) based on our threat intelligence and general knowledge of Internet content. You can use our free [Cloudflare Radar](https://radar.cloudflare.com/) service to examine what categories might be applied to any specific domain. Policies can then include these categories to block known and potential security risks on the public Internet, as well as specific categories of content.

Additionally, Cloudflare's SWG offers the flexibility to create and maintain customized [lists of data](https://developers.cloudflare.com/cloudflare-one/reusable-components/lists/). These lists can be uploaded via CSV files, manually maintained, or integrated with other processes and applications using the Cloudflare API. A list can contain the following data:

* URLs
* Hostnames
* Serial numbers (macOS, Windows, Linux)
* Emails
* IP addresses
* Device IDs (iOS, Android)

For example, organizations can maintain a list of IP addresses of all remote office locations, of short term contractors' email addresses, or trusted company domains. These lists can be used in a policy to allow contractors access to a specific application if their traffic is coming from a known office IP address.

### DLP profiles and datasets

Cloudflare looks at various aspects of a request, including the source IP, the requested domain, and the identity of the authenticated user initiating the request. Cloudflare also offers a DLP service which has the ability to detect and block requests based on the presence of sensitive content. The service has built in DLP profiles for common data types such as financial information, personally identifiable information (PII), and API keys.

There is even a profile for source code, so users can detect and block the transfer of C++ or Python files. Organizations can create customized DLP profiles and use regular expressions to define the patterns of data they are looking for. For data that is hard to define a pattern for, datasets can be used which match exact data values. These datasets allow for the bulk upload of any data to be matched, such as lists of customer account IDs or sensitive project names. These profiles and data sets can be incorporated into policies to prevent users from downloading large files containing confidential customer data.

To reduce the risk of false positives, internal users have the option to establish a match count on the profile. This means that a specific number of matches within the data are required before profile triggers. This approach prevents scenarios where a random string resembling PII or a credit card number would trigger the profile unnecessarily. By implementing a match count, the policy demands that multiple data elements align with the profile, significantly increasing its accuracy.

Organizations can further increase the accuracy of the DLP profile by enabling context analysis. This feature requires certain proximity keywords to exist within approximately 1000 characters of a match. For example, the string "123-45-6789" will only count as a detection if it is in proximity to keywords such as "ssn". This contextual requirement bolsters the accuracy of the detection process.

The DLP service seamlessly integrates with both Cloudflare's SWG and API-driven CASB services. In the case of the API CASB, DLP profiles are selected for scanning each integration with each SaaS application. This customization allows tailored detection criteria based on the type of data you wish to secure within each application.

For the SWG service, DLP profiles can be included into any policy to detect the existence of sensitive data in any request passing through the gateway. The most common action associated with this detection is to block the request, providing a robust layer of security.

Access Groups are a powerful tool in the ZTNA service for aggregating users or devices into a unified entity that can be referenced within a policy. Within Cloudflare, multiple pieces of information can be combined into a single Access Group, efficiently reusing data across multiple policies while maintaining it in one centralized location.

Consider an Access Group designed to manage access to critical server infrastructure. The same Access Group can be used in a device agent policy that prevents administrators from disabling their connection to Cloudflare. This approach streamlines policy management and ensures consistency across various policy implementations.

Below is a diagram featuring an Access Group named "Secure Administrators," which uses a range of attributes to define the characteristics of secure administrators. The diagram shows the addition of two other Access Groups within "Secure Administrators". The groups include devices running on either the latest Windows or macOS, along with the requirement that the device must have either File Vault or Bitlocker enabled.

![An example of using Access Groups can be for grouping up many device, network or user attributes into a single policy that can be reused across applications.](https://developers.cloudflare.com/_astro/cf1-ref-arch-24.aWooHqll_2v76br.svg)

Consistent with Cloudflare's overarching flexibility, Access Groups can be created, updated, and applied to policies through Cloudflare API or using Terraform. This allows a seamless integration with existing IT systems and processes, ensuring a cohesive approach to access management.

Now that we have a solid understanding of all the components available, let's zoom in and take a look at some common use cases and how they are configured. Keep in mind that Cloudflare's policy engines are incredibly powerful and flexible, so these examples are just a glimpse into the capabilities of Cloudflare's SASE platform.

### Example use cases

#### Secure access to self hosted apps and services

One common driver for moving to a SASE architecture is replacing existing VPN connectivity with a more flexible and secure solution. Cloudflare One SASE architecture enables high performance and secure access to self hosted applications from anywhere in the world. However, the next step entails defining the policies that control access to resources.

In this example, consider two services: a database administration application ([pgadmin](https://www.pgadmin.org/) for example) and an SSH daemon running on the database server. The diagram below illustrates the flow of traffic and highlights the ZTNA service. It's important to note that all other services still retain the ability to inspect the request. For instance, the contractor using their personal cell phone in Germany should only have access to the db admin tool, while the employee on a managed device can access both the db admin tool and SSH into the database server.

![An employee working on a managed device at home can access both the db admin tool as well as the SSH service. However a contractor in Germany only has access to the db admin tool.](https://developers.cloudflare.com/_astro/cf1-ref-arch-25.DbM82XF7_1gYxP5.svg)

The policies that enable access rely on two Access Groups.

* Users who authenticate through Okta and are part of the Okta group labeled "Contractors"
  * Authentication requires the use of a hardware token

* Database and IT administrators

* Users who authenticate through Okta and are in the Okta groups "IT administrators" or "Database administrators"
  * Authentication requires the use of a hardware token
  * Users should be on a device with a serial number in the "Managed Devices" list

Both of these groups are then used in two different access policies.

* Database administration tool access

* Database and IT admins are allowed access
  * Members of the "Contractor" access group are allowed access, but each authenticated session requires the user to complete a justification request
  * The admin tool is rendered in an isolated browser on Cloudflare's Edge network and file downloads are disabled

* Database server SSH access

* "Database and IT administrators" group is allowed access
  * Their device must pass a Crowdstrike risk score of at least 80
  * Access must come from a device that is running our device agent and is connected to Cloudflare

These policies show that contractors are only allowed access to the database administration tool and do not have SSH access to the server. IT and database administrators can access the SSH service only when their devices are securely connected to Cloudflare via the device agent. Every element of the access groups and policies is evaluated for every login, so an IT administrator using a compromised laptop or a contractor unable to authenticate with a hardware token will be denied access.

Both user groups will connect to Cloudflare through the closest and fastest access point of Cloudflare's globally distributed network, resulting in a high quality experience for all users no matter where they are.

#### Threat defense for distributed offices and remote workers

Another reason for using a SASE solution is to apply company security policies consistently across all users (whether they are employees or contractors) in the organization, regardless of where they work. The Cloudflare One SASE architecture shows that all user traffic, whether routed directly on the device or through the connected network, will go through Cloudflare. Cloudflare's SWG then handles inspection of this traffic. Depending on the connection method, policies can be applied either to the HTTP or DNS request. For example:

![Blocking high risk websites can be done by selecting a few options in the SWG policy](https://developers.cloudflare.com/_astro/cf1-ref-arch-26.CctZYYxb_1NLKw6.svg)

This can then be applied to secure and protect all users in one policy. Cloudflare can write another policy allowing access to social media websites while isolating all sessions in a remote browser hosted on Cloudflare's network.

![Isolating all social media websites can be done by identifying the application or website name and selecting what actions the user can take, such as stopping them from copy and pasting or printing.](https://developers.cloudflare.com/_astro/cf1-ref-arch-27.BlDxrRwj_Znjbgg.svg)

With this setup, every request to a social media website ensures the following security measures:

* Any content on the social media website that contains harmful code is prevented from executing on the local device
* External users are restricted from downloading content from the site that could potentially be infected with malware or spyware

#### Data protection for regulatory compliance

Because Cloudflare One has visibility over every network request, Cloudflare can create policies that apply to the data in the request. This means that the DLP services can be used to detect the download of content from an application and block it for specific user demographics. Let's look at the following policy.

![Our DLP policies allow for the inspection of content in a request and blocking it.](https://developers.cloudflare.com/_astro/cf1-ref-arch-28.DKy2S5nx_Znjbgg.svg)

This policy would prevent contractors from downloading a file containing customer accounts information. Furthermore, Cloudflare can configure an additional policy to block the same download if the user's device does not meet specific security posture requirements. This ensures the consistent enforcement of a common rule: no sensitive customer data can be downloaded onto a device that does not meet the required security standards.

DLP policies can also be applied in the other direction, ensuring that company sensitive documents are not uploaded to non approved cloud storage or social media.

![A DLP policy can also examine if a HTTP PUT, i.e. a file upload, is taking place to a non approved application where the request contains sensitive data.](https://developers.cloudflare.com/_astro/cf1-ref-arch-29.BGL4hCeF_Znjbgg.svg)

### Visibility across the deployment

At this point in the SASE journey, users have re-architectured the IT network and security infrastructure to fully leverage all the capabilities of the Cloudflare One SASE platform. A critical element in long term deployment involves establishing complete visibility into the organization and the ability to diagnose and quickly resolve issues.

For quick analysis, Cloudflare provides built-in dashboards and analytics that offers a daily overview of the deployment's operational status. As traffic flows through Cloudflare, the dashboard will alert internal users to the most frequently used SaaS applications, enabling quick actions if any unauthorized applications are accessed by external users. Moreover, all logging information from all Cloudflare One services is accessible and searchable from the administrator's dashboard. This makes it efficient to filter for specific blocked requests, with each log containing useful information such as the user's identity, device information, and the specific rule that triggered the block. This can be very handy in the early stages of deployment where rules can often need tweaking.

However, many organizations rely on existing dedicated tools to manage long term visibility over the performance of their infrastructure. To support this, Cloudflare allows the export of all logging information into such tools. Every aspect of Cloudflare One is logged and can be exported. Cloudflare offers built in integrations for continuous transmission of small data batches to a variety of platforms, including AWS, Google Cloud Storage, SumoLogic, Azure, Splunk, Datadog, and any S3 compatible service. This flexibility allows organizations to selectively choose which fields to control the type and volume of data to incorporate into existing tools.

On top of logs which are related to traffic and policies, Cloudflare also audits management activity. All administrative actions and changes to Cloudflare Tunnels are logged. This allows for change management auditing and, like all other logs, can be exported into other tools as part of a wider change management monitoring solution.

#### Digital Experience Monitoring

Cloudflare has [deep insight](https://radar.cloudflare.com/) into the performance of the Internet and connected networks and devices. This knowledge empowers IT administrators with visibility into minute-by-minute experiences of their end-users, enabling swift resolution of issues that impact productivity.

The Digital Experience Monitoring (DEM) service enables IT to run constant tests against user devices to determine the quality of the connection to company resources. The results of these tests are available on the Cloudflare One dashboard, enabling IT administrators to review and identify root causes when a specific user encounters difficulties accessing an application. These issues could stem from the user's local ISP or a specific underperforming SaaS service provider. This data is invaluable in helping administrators in diagnosing and addressing poor user experiences, leading to faster issue resolution.

The dashboard shows a comprehensive summary of the entire device fleet, displaying real-time and historical connectivity metrics for all organization devices. IT admins can then drill down into specific devices for further analysis.

Having acquired a comprehensive understanding of Cloudflare's SASE platform, you are now well-equipped to integrate it with existing infrastructure. This system efficiently secures access to applications for both employees and external users, starting from the initial request on the device and extending across every network to the application, regardless of its location. This powerful new model for securing networks, applications, devices, and users is built on the massive Cloudflare network and managed through an intuitive management interface.

It's worth noting that many of the capabilities described in this document can be used for free, without any time constraints, for up to 50 users. [Sign up](https://dash.cloudflare.com/sign-up) for an account and head to the [Cloudflare One](https://one.dash.cloudflare.com/) section. While this document has provided an overview of the platform as a whole, for those interested in delving deeper into specific areas, we recommend exploring the following resources.

| Topic | Content |
| - | - |
| Cloudflare Tunnels | [Understanding Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) - [Open source repository for `cloudflared`](https://github.com/cloudflare/cloudflared) |
| WAN as a Service | [Cloudflare Magic WAN documentation](https://developers.cloudflare.com/magic-wan/) |
| Secure Web Gateway | [How to build Gateway policies](https://developers.cloudflare.com/cloudflare-one/traffic-policies/) |
| Zero Trust Network Access | [How to build Access policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/) |
| Remote Browser Isolation | [Understanding browser isolation](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/) |
| API-Driven CASB | [Scanning SaaS applications](https://developers.cloudflare.com/cloudflare-one/integrations/cloud-and-saas/) |
| Email security | [Understanding Cloudflare Email security](https://developers.cloudflare.com/email-security/) |
| Replacing your VPN | [Using Cloudflare to replace your VPN](https://developers.cloudflare.com/learning-paths/replace-vpn/concepts/) |

If you would like to discuss your SASE requirements in greater detail and connect with one of our architects, please visit <https://www.cloudflare.com/cloudflare-one/> and request a consultation.

<page>
---
title: Cloudflare Security Architecture · Cloudflare Reference Architecture docs
description: This document provides insight into how this network and platform
  are architected from a security perspective, how they are operated, and what
  services are available for businesses to address their own security
  challenges.
lastUpdated: 2025-11-21T18:29:21.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/architectures/security/
  md: https://developers.cloudflare.com/reference-architecture/architectures/security/index.md
---

Today, everything and everyone needs to be connected to everything everywhere, all the time, and everything must be secure. However, many businesses are not built on infrastructure that supports this reality. Historically, employees worked in an office where most business systems (file servers, printers, applications) were located on and accessible only from the private office network. A security perimeter was created around the network to protect against outsider threats, most of which came from the public Internet.

However, as Internet bandwidth increased and more people needed to do work outside of the office, VPNs allowed employees access to internal systems from anywhere they could get an Internet connection. Applications then started to move beyond the office network, living in the cloud either as SaaS applications or hosted in IaaS platforms. Companies rushed to expand access to their networks and invest in new, dynamic methods to detect, protect, and manage the constantly evolving security landscape. But this has left many businesses with complex policies and fragile networks with many point solutions trying to protect different points of access.

Since 2010, Cloudflare has been building a unique, large-scale network on which we run a set of security services that allow organizations to build improved connectivity and better protect their public and private networks, applications, users, and data. This document provides insight into how this network and platform are architected from a security perspective, how they are operated, and what services are available for businesses to address their own security challenges. The document comprises two main sections:

* How Cloudflare builds and operates its secure global network.
* How to protect your business infrastructure and assets using Cloudflare services built on the network.

### Who is this document for and what will you learn?

This document is designed for IT and security professionals who are looking at using Cloudflare to secure aspects of their businesses. It is aimed primarily at Chief Information Security Officers (CSO/CISO) and their direct teams who are responsible for the overall security program at their organizations. Because the document covers the security of the entire Cloudflare platform it does not go into deep details about any particular service. Instead, please visit our [Architecture Center](https://www.cloudflare.com/architecture/) to find specific information for a service or product.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://youtu.be/XHvmX3FhTwU?feature=shared) (2 minutes)

- [How Cloudflare strengthens security everywhere you do business](https://cf-assets.www.cloudflare.com/slt3lc6tev37/is7XGR7xZ8CqW0l9EyHZR/1b4311823f602f72036385a66fb96e8c/Everywhere_Security-Cloudflare-strengthens-security-everywhere-you_do-business.pdf) (10 minutes)

## Secure global network

Any cloud security solution needs to be fast and always available. Our network protects over 20% of Internet web properties, operates in over 330 cities, and is 50 ms away from 95% of the Internet-connected population. Each server in each data center runs every service, so that traffic is inspected in one pass and acted upon close to the end user. These servers are connected together by over 13,000 network peers with over 405 Tbps network capacity. Cloudflare’s network is also connected to [every Internet exchange](https://bgp.he.net/report/exchanges#_participants) (more than Microsoft, AWS, and Google) to ensure that we are able to peer traffic from any part of the Internet.

With millions of customers using Cloudflare, the network serves over [57 million HTTP requests](https://radar.cloudflare.com/traffic) per second on average, with more than 77 million HTTP requests per second at peak. As we analyze all this traffic, we detect and block an average of [209 billion cyber threats each day](https://radar.cloudflare.com/security-and-attacks). This network runs at this massive scale to ensure that customers using our security products experience low latency, access to high bandwidth, and a level of reliability that ensures the ongoing security of their business. (Note metrics are correct as of June 2024.)

The Cloudflare network is not like a traditional enterprise network. It has been designed from the ground up using a service isolation, least privilege, and zero trust architecture. Public-facing edge servers, and the data centers they reside in, can be seen as islands in a vast lake of connectivity — where nothing trusts anything without strong credentials and tight access policies.

![The Cloudflare network has data centers in over 320 major cities.](https://developers.cloudflare.com/_astro/security-ref-arch-1.WLeUmjWV_NNKU5.svg)

A unique aspect of the network's security architecture is how we use anycast networking. In every data center we broadcast the entire Cloudflare network range (IPv6 and IPv4) for both UDP and TCP. [Border Gateway Protocol](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/) (BGP) ensures routers all around the Internet provide the shortest possible path for any user to the nearest Cloudflare server where traffic is inspected. From a security perspective, this is very important. During distributed denial-of-service (DDoS) attacks to customers behind our network, a combination of high bandwidth capacity and distribution of requests across thousands of local servers helps ensure our network stays performant and available, even during some of the largest attacks in [Internet history](https://blog.cloudflare.com/cloudflare-mitigates-record-breaking-71-million-request-per-second-ddos-attack).

Server updates, such as access policies, rate limiting, and firewall rules, are performed by our [Quicksilver service](https://blog.cloudflare.com/introducing-quicksilver-configuration-distribution-at-internet-scale). Customer changes are reflected across the entire network in seconds, allowing customers to respond to changing business requirements and ensuring policies are quickly implemented globally.

Every level of the network conforms to strict hardened security controls. Processes running on the edge are designed with a need-to-know basis and run with least privilege. We have our own key management system to ensure keys are secured at rest and in transit and that the right access to keys is given at the right time. To ensure tight control over and detailed visibility of changes to the network, all infrastructure is managed via code ([IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code)).

Cloudflare designs and owns all the servers in our network. There are two main types.

* **Private core servers**: The control plane where all customer configuration, logging, and other data lives.
* **Public edge servers**: Where Internet and privately tunneled traffic terminates to the Cloudflare network, to be inspected and then routed to its destination.

Server hardware is designed by Cloudflare and built by industry-respected manufacturers that complete a comprehensive supply chain and security review. Every server runs an identical software stack, allowing for consistent hardware design. The operating system on edge servers is also a single design and built from a highly modified Linux distribution, tailored for the scale and speed of our platform. Cloudflare is a significant contributor to the Linux kernel, and we regularly share information on how we secure our [servers and services](https://blog.cloudflare.com/the-linux-kernel-key-retention-service-and-why-you-should-use-it-in-your-next-application), helping the Linux community and the rest of the Internet benefit from our [engineering](https://blog.cloudflare.com/linux-kernel-hardening).

Every server runs all Cloudflare products and services that customers use to secure their networks and applications. Later in this document we provide an overview of these services, but for the moment it's important to provide insight into the development of the software. From the initial design of every product, the engineering team works hand in hand with security, compliance, and risk teams to review all aspects of the service. These teams can be viewed as part of the engineering and product teams, not an external group. They are essential to the development of everything we do at Cloudflare and we have some of the most respected professionals in the industry. Code is reviewed by security teams at every stage of development, and we implement many automated systems to analyze software looking for vulnerabilities. Threat modeling and penetration testing frameworks such as [OWASP](https://owasp.org/www-project-web-security-testing-guide/latest/3-The_OWASP_Testing_Framework/), [STRIDE](https://en.wikipedia.org/wiki/STRIDE_\(security\)), and [DREAD](https://en.wikipedia.org/wiki/DREAD_\(risk_assessment_model\)) are used during design, development, and the release process.

Many of our products run on our [serverless runtime](https://developers.cloudflare.com/workers/) environment, which leverages the very latest techniques in service isolation. We anticipated this secure runtime environment could be very valuable to our customers, so we productized it, allowing them to [build](https://developers.cloudflare.com/workers/reference/how-workers-works/) and [run](https://blog.cloudflare.com/cloud-computing-without-containers) their own applications on our network. More about that at the very end of this document.

To ensure we are delivering the most secure network and platform possible, we are always innovating. New technologies need to be created to solve the ever-increasing range of security threats and challenges. Cloudflare leads many initiatives, such as further securing BGP using [RPKI](https://isbgpsafeyet.com/), and we regularly contribute to working IETF groups on many common Internet security protocols. We strive to help increase and monitor [IPv6 adoption](https://radar.cloudflare.com/adoption-and-usage), which inherently creates a more secure Internet, and we stay ahead of future challenges by deploying technologies such as [post-quantum cryptography](https://blog.cloudflare.com/post-quantum-for-all) before any increase in computing power from quantum computers threatens existing cryptographic techniques.

### Operational security

Not only must the design of the network be secure, but so should how we run and maintain it. We operate at a massive scale, and the common design of our servers helps optimize software deployments and monitoring. Defining who has access to maintain the network is fully automated, following infrastructure-as-code practices with role-based access controls (RBAC) and least privilege controls used everywhere.

Customers send sensitive information to our products and services. The mission for the Cloudflare compliance team is to ensure the underlying infrastructure that supports these services meets [industry compliance standards](https://www.cloudflare.com/trust-hub/compliance-resources/) such as FedRAMP, SOC II, ISO, PCI certifications, C5, privacy, and regulatory frameworks. The compliance team works with all engineering organizations to help integrate these requirements as part of the way we work. From a compliance perspective, our areas of focus include:

* Privacy and security of customer data
* Maintaining compliance validations
* Helping customers with their own compliance
* Monitoring the changes to the regulatory landscape
* Providing feedback to regulatory bodies on upcoming changes

We also run a [bug bounty program](https://hackerone.com/cloudflare), giving incentives for the community to find and report vulnerabilities to us for financial reward.

In summary, Cloudflare not only has built the right technology to secure our network, but also has well-staffed and mature teams ensuring that the right processes are created, followed, and monitored. As Cloudflare has grown over the past decade, we've accrued some of the best security knowledge in the industry, which in turn has attracted top talent to come work with us. This effect compounds each year, bringing our security skills and knowledge to greater heights. We are also very transparent about how Cloudflare runs and secures its network, and we [often blog](https://blog.cloudflare.com/secure-by-design-principles) about our processes and evolving approach to security.

## Using Cloudflare to protect your business

The reason the Cloudflare network exists is to provide services to customers to protect their own assets, such as users, applications, and data. The following section details what these services are, their basic architecture, and how they are used by customers. Note that this section does not go into extensive detail on each service. Instead, please refer to our [Architecture Center](https://cloudflare.com/architecture) or [product documentation](https://developers.cloudflare.com/directory/) to understand more about a specific product, service, or solution. The goal in this document is to provide information about the overall set of security services available and the general use cases they are designed for. As such, we provide a table of contents so you can jump to a section of interest.

1. [Securing public and private resources](#securing-public-and-private-resources)

2. [Protecting public resources](#protecting-public-resources)

1. [Common attacks and protection](#common-attacks-and-protection)

1. [DDoS attacks](#ddos-attacks)
      2. [Zero-day attacks](#zero-day-attacks)
      3. [Unauthorized access](#unauthorized-access)
      4. [Client-side attacks](#client-side-attacks)
      5. [Data exfiltration](#data-exfiltration)
      6. [Credential stuffing](#credential-stuffing)
      7. [Brute force attacks](#brute-force-attacks)
      8. [Credit card skimming](#credit-card-skimming)
      9. [Inventory hoarding](#inventory-hoarding)
      10. [Fuzzing (vulnerability scanning)](#fuzzing-vulnerability-scanning)
      11. [Cross-Site Scripting (XSS) attacks](#cross-site-scripting-xss-attacks)
      12. [Remote Code Execution (RCE) attacks](#remote-code-execution-rce-attacks)
      13. [SQL injection (SQLi) attacks](#sql-injection-sqli-attacks)
      14. [Malware](#malware)

2. [Cloudflare application security products](#cloudflare-application-security-products)

1. [Security Analytics](#security-analytics)
      2. [Web Application Firewall (WAF)](#web-application-firewall-waf)
      3. [Rate limiting](#rate-limiting)
      4. [L7 DDoS](#l7-ddos)
      5. [API Shield](#api-shield)
      6. [Bot Management](#bot-management)
      7. [Page Shield](#page-shield)
      8. [SSL/TLS](#ssltls)
      9. [Security Center](#security-center)
      10. [Cloudflare for SaaS](#cloudflare-for-saas)

3. [Cloudflare network security products](#cloudflare-network-security-products)

1. [Magic Transit](#magic-transit)
      2. [Magic WAN](#magic-wan)
      3. [Magic Firewall](#magic-firewall)
      4. [Magic Network Monitoring](#magic-network-monitoring)
      5. [Spectrum](#spectrum)

3. [Protecting private resources](#protecting-private-resources)

1. [Securing connectivity to private resources](#securing-connectivity-to-private-resources)
   2. [User connectivity](#user-connectivity)
   3. [Integrating identity systems](#integrating-identity-systems)
   4. [Access control](#access-control)
   5. [Protecting data](#protecting-data)
   6. [Securing Internet access](#securing-internet-access)

4. [Observability](#observability)

5. [Developer platform](#developer-platform)

In general, what customers need to effectively combat and protect against the growing breadth and complexity of threats is a unified security solution that provides visibility, analytics, detection, and mitigation in an operationally consistent and efficient manner. Cloudflare addresses these needs in several ways:

* Operational consistency: Cloudflare has a single dashboard/UI for all administrative tasks.
* Operational simplicity: Cloudflare is well-known for minimizing operational complexity with well-designed user interfaces that minimize manual configurations and UI workflows. Additionally, cross-product integrations allow for automating configurations and policies.
* Continuous innovation: Cloudflare continues to innovate across its broad security portfolio with unique differentiating capabilities such as its CAPTCHA replacement product, Turnstile, and the industry-first API Sequence Mitigation capability.
* Workload location agnostic: Cloudflare was built first and foremost around performance and security services. As such, it was built from the ground up to be workload location agnostic with multi-cloud inherently being a top use case. Customers can deploy workloads in multiple clouds and/or on-prem and get the same operational consistency.
* Performance and scale: All Cloudflare services run on every server in every data center on the same global cloud, allowing for maximum performance in terms of global reachability and latency and ability to scale out, leveraging the full capacity of Cloudflare’s global infrastructure.
* API first: Cloudflare is API first. All configurations and capabilities available from the UI/dashboard are also available from the API. Cloudflare can easily be configured with Terraform to support automation for customer workflows/processes.

Cloudflare’s security services that protect networks, applications, devices, users, and data can be grouped into the following categories.

![Cloudflare has a wide range of security services across SASE/SSE, application and network security.](https://developers.cloudflare.com/_astro/security-ref-arch-2.40SWzQcS_ZeLtJd.svg)

Note this list is focused on security and doesn't include products such as our content delivery network (CDN), load balancing, and domain name services (DNS).

### Securing public and private resources

There are two main types of resources our customers are trying to secure:

* **Public resources** are defined as any content, asset, or infrastructure that has an interface available and accessible to the general Internet, such as brand websites, ecommerce sites, and APIs. They can also be defined by the fact they are accessible by anonymous users or people who register themselves to gain access, such as social media websites, video streaming services, and banking services.
* **Private resources** are defined as content, assets, or infrastructure with the intended set of users constrained to a single company, organization, or set of customers. These services typically require accounts and credentials to gain access. Examples of such resources are the company HR system, source code repositories, and a point of sale (POS) system residing on a retail branch network. These resources are typically accessible only by employees, partners, and other trusted, known identities.

Public and private resources can also include both infrastructure-level components like servers and consumed resources like websites and API endpoints. Communication over networks and the Internet happens in different stages and levels as shown in the open systems interconnection (OSI) model diagram below.

![The network OSI model describes network communication from the physical through to the application layer.](https://developers.cloudflare.com/_astro/security-ref-arch-3.D6GGUlec_Zyqm9m.svg)

Cloudflare can protect at multiple layers of the OSI model, and in this document we are primarily concerned with protecting resources at layers 3, 4, and 7.

* Layer 3, referred to as the “network layer,” is responsible for facilitating data transfer between two different networks. The network layer breaks up segments from the transport layer into smaller units, called packets, on the sender’s device and reassembles these packets on the receiving device. The network layer is where routing takes place — finding the best physical path for the data to reach its destination.
* Layer 4, referred to as the “transport layer,” is responsible for end-to-end communication between the two devices. This includes taking data from the session layer and breaking it up into chunks called “segments” before sending it to layer 3.

Cloudflare security products that can be used for L3 and L4 security include Cloudflare’s network services offerings, including [Magic Transit](https://developers.cloudflare.com/magic-transit/), [Magic Firewall](https://developers.cloudflare.com/magic-firewall/), [Magic WAN](https://developers.cloudflare.com/magic-wan/), [Magic Network Monitoring](https://developers.cloudflare.com/magic-network-monitoring/), and [Spectrum](https://developers.cloudflare.com/spectrum/).

* Layer 7, referred to as the “application layer,” is the top layer of the data processing that occurs just below the surface or behind the scenes of the software applications that users interact with. HTTP and API requests/responses are layer 7 events.

Cloudflare has a suite of application security products that includes [Web Application Firewall](https://developers.cloudflare.com/waf/) (WAF), [Rate Limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/), [L7 DDoS](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/), [API Shield](https://developers.cloudflare.com/api-shield/), [Bot Management](https://developers.cloudflare.com/bots/), and [Page Shield](https://developers.cloudflare.com/page-shield/).

Note that SaaS applications could be considered both public and private. For example, Salesforce has direct Internet-facing access but contains very private information and is usually only accessible by employee accounts that are provisioned by IT. For the purpose of this document, we will consider SaaS applications as private resources.

These are general guidelines because with Cloudflare it's possible to have very sensitive internal applications be protected by publicly accessible remote access services. We will explain more as we continue through this document.

### Protecting public resources

Businesses rely on public websites and API endpoints for daily ecommerce transactions and brand awareness, and often the entire business is an online service. High availability, performance, and security are top concerns, and customers use Cloudflare to ensure their businesses stay up and running. Cloudflare security services help prevent fraud, data exfiltration, and attacks that can create liability, cause losses and brand damage, and slow down or halt business.

Public assets need to be protected on multiple fronts and from various attacks; therefore, multiple different security capabilities need to be implemented. Additionally, customers must tackle the operational efficiency of solutions they implement. Managing multiple point products for mitigating different attacks or having multiple vendors to meet company security objectives and requirements creates many operational inefficiencies and issues, such as multiple UIs/dashboards, training, lack of cross-product integrations, etc.

The diagram below shows a typical request for a public asset going through the Cloudflare network. Our security services are part of many capabilities, and Cloudflare acts as a reverse proxy where requests are routed to the closest data center and performance and security services are applied prior to that request being routed onto the destination. These services can easily be consolidated and used together regardless of where workloads are deployed; the operations and implementation remain consistent. Note: the diagram doesn't detail all of Cloudflare's services.

![Every request through Cloudflare passes once for inspection across all security products.](https://developers.cloudflare.com/_astro/security-ref-arch-4.PP-9vg85_1LJP4c.svg)

The diagram highlights the following:

* The [world's fastest DNS service](https://www.dnsperf.com/) provides fast resolution of public hostnames
* Ensure data compliance by [choosing geographic locations](https://www.cloudflare.com/data-localization/) for the inspection and storage of data
* Spectrum extends Cloudflare security capabilities to all UDP/TCP applications
* Security services inspect a request in one pass
* Application performance services also act on the request in the same pass
* [Smart routing](https://developers.cloudflare.com/argo-smart-routing/) finds the lowest latency path between Cloudflare and the public destination

#### Common attacks and protection

Cloudflare's broad product portfolio protects against a wide variety of attacks. Several common attacks are described in more detail below and include a reference to the Cloudflare products that are used to mitigate the specific attack.

A [distributed denial-of-service (DDoS) attack](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/) is a malicious attempt to disrupt the availability of a targeted server, service, or network by overwhelming the target or its surrounding infrastructure with a flood of traffic. The goal is to slow down or crash a program, service, computer, or network, or to fill up capacity so that no one else can use or receive the service. DDoS attacks can occur at L3, L4, or L7, and Cloudflare provides protections at all these different layers.

![DDoS attacks are prevented at layers 3, 4 and 7.](https://developers.cloudflare.com/_astro/security-ref-arch-5.Dk00_Til_Z17epiP.svg)

Cloudflare’s L7 DDoS Protection prevents denial of service at layer 7; Spectrum protects at layer 4; and Magic Transit protects at layer 3. In addition to the core DDoS-specific security products, Cloudflare provides advanced rate limiting capabilities to allow for throttling traffic based on very granular request data, including headers information and API tokens. Cloudflare’s Bot Management capabilities can also limit denial-of-service attacks by effectively mitigating bot traffic.

Products: [L7 DDoS](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/), [Spectrum](https://developers.cloudflare.com/spectrum/), [Magic Transit](https://developers.cloudflare.com/magic-transit/)

##### Zero-day attacks

A zero-day exploit (also called a zero-day threat) is an attack that takes advantage of a security vulnerability that does not have a fix in place. It is referred to as a "zero-day" threat because once the flaw is discovered, the developer or organization has "zero days" to then come up with a solution.

Web Application Firewall (WAF) [Managed Rules](https://developers.cloudflare.com/waf/managed-rules/) allow you to deploy pre-configured managed rulesets that provide immediate protection against the following:

* Zero-day vulnerabilities
* Top 10 attack techniques
* Use of stolen/exposed credentials
* Extraction of sensitive data

WAF checks incoming web requests and filters undesired traffic based on sets of rules (rulesets) deployed at the edge. These managed rulesets are maintained and regularly updated by Cloudflare. From the extensive threat intelligence obtained from across our global network, Cloudflare is able to quickly detect and classify threats. As new attacks/threats are identified, Cloudflare will automatically push WAF rules to customers to ensure they are protected against the latest zero-day attacks.

Additionally, Cloudflare provides for [WAF Attack Score](https://developers.cloudflare.com/waf/detections/attack-score/), which complements Cloudflare managed rules by detecting attack variations. These variations are typically achieved by malicious actors via fuzzing techniques that are trying to identify ways to bypass existing security policies. WAF classifies each request using a machine learning algorithm, assigning an attack score from 1 to 99 based on the likelihood that the request is malicious. Rules can then be written which use these scores to determine what traffic is permitted to the application.

![Machine learning maintains lists of managed rules to determine if the request should be let through the WAF or not.](https://developers.cloudflare.com/_astro/security-ref-arch-6.DGieuMIT_kwSAC.svg)

Products: [WAF - Cloudflare Managed Rules](https://developers.cloudflare.com/waf/managed-rules/)

##### Unauthorized access

Unauthorized access can result from broken authentication or broken access control due to vulnerabilities in authentication, weak passwords, or easily bypassed authorization. Cloudflare mTLS (mutual TLS) and JWT (JSON Web Tokens) validation can be used to bolster authentication. Clients or API requests that don’t have a valid certificate or JWT can be denied access via security policy. Customers can create and manage mTLS certificates from the Cloudflare dashboard or an API. Cloudflare’s WAF and [Exposed Credentials Check](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/) managed ruleset can be used to detect compromised credentials being used in authentication requests. WAF policies can also be used to restrict access to applications/paths based on different request criteria.

Products: [SSL/TLS - mTLS](https://developers.cloudflare.com/ssl/client-certificates/enable-mtls/), [API Shield (JWT Validation)](https://developers.cloudflare.com/api-shield/security/jwt-validation/), [WAF](https://developers.cloudflare.com/waf/)

##### Client-side attacks

Client-side attacks like [Magecart](https://blog.cloudflare.com/detecting-magecart-style-attacks-for-pageshield) involve compromising third-party libraries, compromising a website, or exploiting vulnerabilities in order to exfiltrate sensitive user data to an attacker-controlled domain. Page Shield leverages Cloudflare’s position in the network as a reverse proxy to receive information directly from the browser about:

1. What JavaScript files/modules are being loaded
2. Outbound connections made
3. Inventory of cookies used by the application (planned to be available late 2024)

Page Shield uses threat-feed detections of malicious JavaScript domains and URLs. In addition, it can download JavaScript source files and run them through a machine learning classifier to identify malicious behavior and activity; the result is a JS Integrity Score designating if the JavaScript file is malicious. Page Shield can also detect changes to JavaScript files. Alerts using emails, webhooks, and PagerDuty can be set based on different criteria such as new resources identified, code changes, and malicious code/domains/URLs.

Page Shield [Content Security policies](https://developers.cloudflare.com/page-shield/policies/) can be created and applied to add an additional level of security that helps detect and mitigate certain types of attacks, including:

* Content/code injection
* Cross-site scripting (XSS)
* Embedding malicious resources
* Malicious iframes (clickjacking)

Products: [Page Shield](https://developers.cloudflare.com/page-shield/)

##### Data exfiltration

Data exfiltration is the process of acquiring sensitive data through malicious tactics or through misconfigured services. Cloudflare Sensitive Data Detection addresses common data loss threats. Within the WAF, these rules monitor the download of specific sensitive data — for example, financial and personally identifiable information. Specific patterns of sensitive data are matched upon and logged. Sensitive data detection is also integrated with API Shield so customers are alerted on any API responses returning sensitive data matches.

Products: [WAF - Sensitive Data Detection](https://developers.cloudflare.com/waf/managed-rules/)

##### Credential stuffing

Credential stuffing is a cyberattack in which credentials obtained from a data breach on one service are used to attempt to log in to another unrelated service. Usually, automation tools or scripting are used to loop through a vast number of stolen credentials, sometimes augmented with additional data in the hopes of achieving account takeover.

Cloudflare Bot Management can be used to detect potentially malicious bots. Cloudflare challenges can also be used to challenge suspect requests and stop automated attempts to gain access. WAF policies can be used with specific request criteria to prevent attacks. Additionally, Cloudflare’s WAF and Exposed Credentials Check managed ruleset can be used to detect compromised credentials being used in auth requests. Rate limiting can also throttle requests and effectiveness of malicious credential stuffing techniques.

Products: [Bot Management](https://developers.cloudflare.com/bots/), [WAF](https://developers.cloudflare.com/waf/), [Rate Limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/)

##### Brute force attacks

Brute force attacks attempt to guess passwords or clues, using random characters sometimes combined with common password suggestions. Usually, automation tools or scripting are used to loop through a vast number of possibilities in a short amount of time.

Cloudflare Bot Management can be used to detect potentially malicious bots. Cloudflare challenges can also be used to challenge suspect requests and stop automated brute force attacks. WAF and rate limiting policies can be used with specific request criteria to apply granular policies on application login pages to block or throttle traffic.

Products: [Bot Management](https://developers.cloudflare.com/bots/), [WAF](https://developers.cloudflare.com/waf/), [Rate Limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/)

##### Credit card skimming

Credit card skimming is a fraudulent method to skim payment information from websites. Page Shield can be used to detect clients using malicious JavaScript libraries or making connections to known malicious domains or URLs. Page Shield will also detect changes to files/code being used on a site and give a JS Integrity Score to JavaScript files assessing whether the code is malicious. Content Security Policies (CSPs) can be deployed to enforce a positive security model. These capabilities can prevent compromised code from performing malicious behavior such as credit card skimming.

Products: [Page Shield](https://developers.cloudflare.com/page-shield/)

##### Inventory hoarding

Inventory hoarding is when malicious bots are used to buy large quantities of products online, preventing legitimate consumers from purchasing them. This can cause many issues for businesses, including creating artificial scarcity, causing inflated prices, and disrupting access for legitimate customers. Cloudflare Bot Management can be used to detect potentially malicious bots. Cloudflare challenges can also be used to challenge suspect requests and stop automated processes. WAF policies can be used with specific request criteria to prevent attacks.

Products: [Bot management](https://developers.cloudflare.com/bots/), [WAF](https://developers.cloudflare.com/waf/)

##### Fuzzing (vulnerability scanning)

[Fuzzing](https://owasp.org/www-community/Fuzzing) is an automated testing method used by malicious actors that uses various combinations of data and patterns to inject invalid, malformed, or unexpected inputs into a system. The malicious user hopes to find defects and vulnerabilities that can then be exploited. Cloudflare WAF leverages machine learning to detect fuzzing based attempts to bypass security policies. The WAF attack score complements managed rules and highlights the likeliness of an attack.

Bot Management can detect potentially malicious bots by automating vulnerability scanning. With API Shield, customers can employ schema validation and sequence mitigation to prevent the automated scanning and fuzzing techniques with APIs.

Products: [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/), [API Shield](https://developers.cloudflare.com/api-shield/)

##### Cross-Site Scripting (XSS) attacks

Cross-Site Scripting (XSS) attacks are a type of injection attack in which malicious scripts are injected into websites and then used by the end user’s browser to access sensitive user information such as session tokens, cookies, and other information.

Cloudflare WAF leverages machine learning to detect attempts to bypass security policies and provides a specific WAF Attack Score for the likeliness the request is an XSS attack.

Products: [WAF](https://developers.cloudflare.com/waf/)

##### Remote Code Execution (RCE) attacks

In a remote code execution (RCE) attack, an attacker runs malicious code on an organization’s computers or network. The ability to execute attacker-controlled code can be used for various purposes, including deploying additional malware or stealing sensitive data.

Cloudflare WAF leverages machine learning to detect attempts to bypass security policies and provides a specific WAF Attack Score for the likeliness the request is an RCE attack.

Products: [WAF](https://developers.cloudflare.com/waf/)

##### SQL injection (SQLi) attacks

Structured Query Language Injection (SQLi) is a code injection technique used to modify or retrieve data from SQL databases. By inserting specialized SQL statements into an entry field, an attacker is able to execute commands that allow for the retrieval of data from the database, the destruction of sensitive data, or other manipulative behaviors.

Cloudflare WAF leverages machine learning to detect attempts to bypass security policies and provides a specific WAF Attack Score for the likeliness the request is an SQLi attack.

Products: [WAF](https://developers.cloudflare.com/waf/)

Malware can refer to viruses, worms, trojans, ransomware, spyware, adware, and other types of harmful software. A key distinction of malware is that it needs to be intentionally malicious; any software that unintentionally causes harm is not considered to be malware.

When Uploaded Content Scanning is enabled, content scanning attempts to detect items such as uploaded files, and scans them for malicious signatures like malware. The scan results, along with additional metadata, are exposed as fields available in WAF custom rules, allowing customers to implement fine-grained mitigation rules.

Products: [WAF - Uploaded Content Scanning](https://developers.cloudflare.com/waf/detections/malicious-uploads/)

#### Cloudflare application security products

This document has covered some common attacks and Cloudflare products used to detect and mitigate respective threats. Below we highlight and provide some additional details on each product across Cloudflare’s application and network security portfolio.

##### Security Analytics

Security Analytics brings together all of Cloudflare’s security detection capabilities within one dashboard. Customers can get a quick view and insight on mitigated and unmitigated traffic, attack traffic, bot traffic, malicious content upload attempts, and details around rate limiting analysis and account takeover analysis. Right from the dashboard displaying detected threats, with the click of a button customers can take action to put in place policies to mitigate.

![All security detection can be seen from a single dashboard.](https://developers.cloudflare.com/_astro/security-ref-arch-7.BelBfrod_1gNuws.svg)

##### Web Application Firewall (WAF)

Using Cloudflare [WAF](https://developers.cloudflare.com/waf/), customers can deploy custom rules based on very granular request criteria to mitigate specific threats or to block requests with certain HTTP anomalies. In addition, customers can deploy Cloudflare managed rules to mitigate zero-day attacks, common OWASP Top 10 attacks, requests using known leaked credentials, and requests extracting sensitive data.

[WAF Managed Rules](https://developers.cloudflare.com/waf/managed-rules/) allow customers to deploy pre-configured managed rulesets that provide immediate protection against:

* Zero-day vulnerabilities
* Top 10 attack techniques
* Use of stolen/exposed credentials
* Extraction of sensitive data

[Rate limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/) can be used to mitigate various attacks, including volumetric attacks, credential stuffing, web scraping, and DoS attacks. Cloudflare rate limiting allows customers to define rate limits for requests matching an expression, and the action to perform when those rate limits are reached. Rate limiting can be granular based on specific request or header criteria and can also be based on sessions or API tokens. Customers can configure actions including logging, blocking, and challenges for when the specified rate is exceeded.

Customers can also configure which request criteria is used as a counter for determining when to throttle or block after a limit is exceeded. Customers can implement two different behaviors for rate limiting:

1. **Block for the selected duration**. Once the rate is exceeded, the WAF will block all requests during the selected duration before the counter is reset.

![All actions are blocked once the rate limit is reached.](https://developers.cloudflare.com/_astro/security-ref-arch-8.DyW4Rkuf_ZsTNBh.svg)

1. **Throttle requests over the maximum configured rate**. The WAF will block any requests exceeding the configured rate, and the remaining requests will be allowed. The analogy for this behavior is a sliding window effect.

![All security detection can be seen from a single dashboard.](https://developers.cloudflare.com/_astro/security-ref-arch-9.CXEx1mEx_2pFTXG.svg)

The Cloudflare [HTTP DDoS Attack Protection](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/) managed ruleset is a set of pre-configured rules used to match known DDoS attack vectors at layer 7 (application layer) on the Cloudflare global network. The rules match known attack patterns and tools, suspicious patterns, protocol violations, requests causing large amounts of origin errors, excessive traffic hitting the origin/cache, and additional attack vectors at the application layer. Cloudflare updates the list of rules in the managed ruleset on a regular basis.

[API Shield](https://developers.cloudflare.com/api-shield/) is Cloudflare’s API management and security product. API Shield delivers visibility via API discovery and analytics, provides endpoint management, implements a positive security model, and prevents API abuse.

![All security detection can be seen from a single dashboard.](https://developers.cloudflare.com/_astro/security-ref-arch-10.B6IOqcpe_ZJaA5p.svg)

API Gateway’s API Discovery is used to learn all API endpoints in a customer’s environment using machine learning. After this step, customers can save endpoints to Endpoint Management so additional API performance and error information can be collected and security policies can be applied.

Customers can enable a positive security model using mTLS, JWT validation, and schema validation and protect against additional API abuse with rate limiting and volumetric abuse protection as well as sequence mitigation and GraphQL protections.

![API Shield has many stages, discovery, review, using a positive security model, abuse protection, data protection and endpoint management/monitoring.](https://developers.cloudflare.com/_astro/security-ref-arch-11.CCbosnqv_QMJd4.svg)

[Bot Management](https://developers.cloudflare.com/bots/) is used to mitigate various malicious activities, including web scraping, price scraping, inventory hoarding, and credential stuffing. Cloudflare has multi-layered bot mitigation capabilities that include heuristics, machine learning, anomaly detection, and JS fingerprinting. Bot management also assigns a bot score to every request. WAF rules can be created around bot scores to create very granular security policies.

![Bot management can filter good and bad bots.](https://developers.cloudflare.com/_astro/security-ref-arch-12.8OEt5sGB_1NPN6C.svg)

Additionally, Cloudflare can take the action of challenging clients if it suspects undesired bot activity. Cloudflare offers its [challenge](https://developers.cloudflare.com/cloudflare-challenges/) platform where the appropriate type of challenge is dynamically chosen based on the characteristics of a request. This helps avoid CAPTCHAs, which result in a poor customer experience.

Depending on the characteristics of a request, Cloudflare will choose an appropriate type of challenge, which may include but is not limited to:

* A non-interactive challenge page (similar to the current JS Challenge).
* A custom interactive challenge (such as clicking a button).
* Private Access Tokens (using recent Apple operating systems).

With [Turnstile](https://developers.cloudflare.com/turnstile/), Cloudflare has completely moved away from CAPTCHA. Turnstile is Cloudflare’s smart CAPTCHA alternative. It can be embedded into any website without sending traffic through Cloudflare and works without showing visitors a CAPTCHA. Turnstile allows you to run challenges anywhere on your site in a less intrusive way and uses APIs to communicate with Cloudflare’s Managed Challenge platform.

![Turnstile can be deployed to totally avoid presenting users with a CAPTCHA.](https://developers.cloudflare.com/_astro/security-ref-arch-13.Dw5VEN0r_MRCY7.svg)

[Page Shield](https://developers.cloudflare.com/page-shield/) ensures the safety of website visitors’ browser environment and protects against client-side attacks like Magecart. By using a Content Security Policy (CSP) deployed with a report-only directive to collect information from the browser, Page Shield tracks loaded resources like scripts and detects new resources or connections being made by the browser. Additionally, Page Shield alerts customers if it detects scripts from malicious domains or URLs — or connections being made from the browser to malicious domains or URLs.

Page Shield can download JavaScript source files and run them through a machine learning classifier to identify malicious behavior and activity; the result is a JS Integrity Score designating if the JavaScript file is malicious.

Cloudflare’s [SSL/TLS](https://developers.cloudflare.com/ssl/) provides a number of features to meet customer encryption requirements and certificate management needs. An SSL/TLS certificate is what enables websites and applications to establish secure connections. With SSL/TLS, a client — such as a browser — can verify the authenticity and integrity of the server it is connecting with, and use encryption to exchange information.

Cloudflare’s global network is at the core of several products and services that Cloudflare offers. In terms of SSL/TLS, this means instead of only one certificate, there can actually be two certificates involved in a single request: an edge certificate and an origin certificate.

![SSL/TLS can be used for both Cloudflare to user, and origin server to Cloudflare security.](https://developers.cloudflare.com/_astro/security-ref-arch-14.JS7QlPBw_Z2lNlqq.svg)

Edge certificates are presented to clients visiting the customer’s website or application. Origin certificates guarantee the security and authentication on the other side of the network, between Cloudflare and the origin server of the customer's website or application. [SSL/TLS encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/) control whether and how Cloudflare will use both these certificates, and you can choose between different modes.

Customers can also enable [mutual Transport Layer Security (mTLS)](https://developers.cloudflare.com/ssl/client-certificates/enable-mtls/) for hostnames and API endpoints to bolster security for authentication, enforcing that only devices with valid certificates can gain access. Additional security features like [Authenticated Origin Pulls](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/) can be configured to help ensure requests to the origin server come from the Cloudflare network. [Keyless SSL](https://developers.cloudflare.com/ssl/keyless-ssl/) allows security-conscious clients to upload their own custom certificates and benefit from Cloudflare, but without exposing their TLS private keys. With [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/), customers can also issue and validate certificates for their own customers.

##### Security Center

[Cloudflare Security Center](https://developers.cloudflare.com/security-center/) offers attack surface management (ASM) that inventories IT assets, enumerates potential security issues, controls phishing and spoofing risks, and enables security teams to investigate and mitigate threats in a few clicks. The Security Center is a great starting point for security analysts to get a global view of all potential issues across all applications/domains.

Key capabilities offered:

* Inventory and review IT infrastructure assets like domains, ASNs, and IPs.
* Manage an always up-to-date list of misconfigurations and risks in Cloudflare IT assets.
* Query threat data gathered from the Cloudflare network to investigate and respond to security risks.
* Gain full control over who sends email on your organization's behalf with DMARC Management.

##### Cloudflare for SaaS

If you build and host your own SaaS product offering, then [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/) might be of interest. It allows customers to extend the security and performance benefits of Cloudflare’s network to their customers via their own custom or vanity domains. Cloudflare for SaaS offers multiple configuration options. In the below diagram, custom hostnames are routed to a default origin server called “fallback origin”.

![Bring Cloudflare security to customer domains using your SaaS application.](https://developers.cloudflare.com/_astro/security-ref-arch-15.BuEBz4JW_UYXfL.svg)

#### Cloudflare network security products

[Magic Transit](https://developers.cloudflare.com/magic-transit/) protects entire IP subnets from DDoS attacks, providing for sub-second threat detection while also accelerating network traffic. It uses Cloudflare’s global network to mitigate attacks, employing standards-based networking protocols like BGP, GRE, and IPsec for routing and encapsulation.

All network assets, whether on-premises or in private or public-hosted cloud environments, can easily be protected by sitting behind and being advertised from the Cloudflare network providing over 405 Tbps network capacity.

![Magic Transit can secure your private network links.](https://developers.cloudflare.com/_astro/security-ref-arch-16.D6MVHn2o_Z1anBNe.svg)

With [Magic WAN](https://developers.cloudflare.com/magic-wan/), customers can securely connect any traffic source — data centers, offices, devices, cloud properties — to Cloudflare’s network and configure routing policies to get the bits where they need to go. Magic WAN supports a variety of on-ramps, including anycast GRE and IPsec tunnels, Cloudflare Network Interconnect, Cloudflare Tunnel, WARP, and a variety of network on-ramp partners. Magic WAN can help end reliance on traditional SD-WAN appliances and securely connect users, offices, data centers, and hybrid cloud over the Cloudflare global network without relying on vendor-specific hardware or software.

[Magic Firewall](https://developers.cloudflare.com/magic-firewall/) is Cloudflare’s firewall-as-a-service solution delivered from Cloudflare’s global network and is integrated with Magic Transit and Magic WAN. It allows for enforcing consistent network security policies across customers’ entire WAN, including headquarters, branch offices, and virtual private clouds. Customers can deploy granular rules that globally filter on protocol, port, IP addresses, packet length, and bit field match.

##### Magic Network Monitoring

[Magic Network Monitoring](https://developers.cloudflare.com/magic-network-monitoring/) is a cloud network flow monitoring solution that gives customers end-to-end network traffic visibility, DDoS attack type identification, and volumetric traffic alerts. When a DDoS attack is detected, an alert can be received via email, webhook, or PagerDuty.

[Spectrum](https://developers.cloudflare.com/spectrum/) is a reverse proxy product that extends the benefits of Cloudflare to all TCP/UDP applications providing L4 DDoS protection. Spectrum also provides an IP firewall allowing customers to deny IPs or IP ranges to granularly control traffic to application servers. Customers can also configure rules to block visitors from a specified country or even an Autonomous System Number (ASN).

### Protecting private resources

Private resources typically contain highly sensitive, company confidential information and either by way of laws and regulations, or by the nature of the confidentiality of the data, access to them is much more restricted. Traditionally, private applications were only accessible on private networks in company buildings that users had to have physical access to. But as we all know today, access to private resources needs to take place from a wide range of locations, and paradoxically, private applications can live in very public locations. Most SaaS applications are exposed to the public Internet.

The following are typical attributes of private resources:

* Users have been pre-authorized and provisioned. They can't just sign up. They need to be given specific access to the resource either directly or via access control mechanisms such as certificates, group membership, or role assignment.
* Network access to a self-hosted resource is typically over-managed, private network routes and not accessible via the general Internet.
* Private resources that live in data centers (physical or virtual) and are connected to networks that are hosted and managed by the business, which are either on-premises or virtual private networks running in public cloud infrastructure.

As mentioned, traditional access to private resources required physical access to the network by being in the office connected via Ethernet. As remote access needs increased, companies installed on-premises VPN servers that allowed users and devices to "dial in" to these private networks. Many applications have left these private networks and instead migrated to SaaS applications or are hosted in public cloud infrastructure. This traditional approach has become unmanageable and costly, with a variety of technologies providing network connectivity and access control.

Another important thing to note is that many of the services used for securing and providing connectivity for public resources can also be used for private resources. The most obvious here is Magic WAN and Magic Firewall. Customers also use our WAF in front of privately hosted applications that are only accessible through private networks. The idea is that even if access to an application is only from trusted private connections, it is still possible for an attacker to compromise what seems to be a trusted device; therefore, application injection attacks and other vulnerabilities can be exploited by devices with existing trusted network access. This is exactly in line with the idea of a Zero Trust security program. Read more about the approaches to Zero Trust using a SASE platform in our [SASE reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/).

As we describe the following Cloudflare services, you will learn how the Cloudflare network and our methods of connecting it to your own private networks provides greater security, flexibility, and a more centralized control plane for access to private resources. The following diagram illustrates the sort of environment that represents a typical customer's private infrastructure.

![Cloudflare's SASE platform can protect users and devices no matter where in your enterprise network, or not, they reside.](https://developers.cloudflare.com/_astro/security-ref-arch-18.D5ODORV0_ZNkzzQ.svg)

Protecting internal resources can be broken down into the following areas.

* Securing connectivity between the user and the application/network.
* Identity systems providing authentication and maintaining user identities and group membership.
* Policies controlling user access to applications/data.
* Data protection controls to identify and protect sensitive and confidential data.
* Protecting users and devices from attacks (malware, phishing, etc.) that originate from access to the Internet.
* Operational visibility to IT and security teams.

#### Securing connectivity to private resources

Many privately hosted applications and networks do not have direct connectivity to the Internet. As mentioned previously, access traditionally has been enabled by one of two methods. One is when users connect physically to the same networks the private resources reside on, i.e. walking into the office and connecting to the office WiFi. The other is creating a virtual private network (VPN) connection over the Internet and "dialing in" to the private company network.

However, the need today is still the same. You have private networks with private applications — and remote users need access. You should regard Cloudflare as your new enterprise network, where all authorized users (employees, contractors, partners) can connect to any private application from anywhere. This means your network topology will feature Cloudflare in the middle, providing connectivity from all networks to each other.

![Cloudflare's SASE platform can also connect a wide variety of networks together into one larger, new corporate network.](https://developers.cloudflare.com/_astro/security-ref-arch-19.DZCNQ04z_Z1osvwt.svg)

In the above diagram you can see a variety of private networks and end user devices connected to Cloudflare, which then facilitates the routing and access controls between those networks, and therefore the applications and other resources. This is often regarded as East to West traffic. Because traffic originates from, and is destined for, a privately managed network.

Because all network traffic routes through Cloudflare, security controls are defined and apply to all traffic as it flows between networks. As long as a network, device, or user is connected to Cloudflare, you can identify it and apply policy. It also means things like data protection can be simplified — one single rule can be implemented to detect the transfer of and access to sensitive data and can be applied across the entire network with ease.

Existing private infrastructure can be complex. Cloudflare provides a variety of methods by which businesses can connect their networks and user devices into this new enterprise network. We often call these methods "on-ramps," which describes how traffic for a specific network or device is routed into Cloudflare. The following table outlines these different methods.

| Method | Description | Common Use |
| - | - | - |
| [Magic WAN](https://developers.cloudflare.com/magic-wan/) | IPsec or GRE tunnel from networking devices to Cloudflare, routing entire network traffic. | Connecting existing network routers to Cloudflare. Allowing all traffic into and out of the network to go through Cloudflare. |
| [Magic WAN Connector](https://developers.cloudflare.com/magic-wan/configuration/connector/) | Appliance-based IPsec or GRE tunnel from networking devices to Cloudflare, routing entire network traffic. | Uses the same technology as Magic WAN; however, instead of using existing networking devices, a dedicated appliance or virtual machine is used — the Magic WAN Connector. |
| [cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) | Software agent deployed on servers or alongside services like Kubernetes for creating a tunnel for incoming connections to private applications or networks. | IT admins or application owners can easily install this tunnel software to expose their application to the Cloudflare network. |
| [WARP Connector](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/warp-connector/) | Software agent deployed on servers for creating a tunnel for incoming and outgoing connections to private applications or networks. | Similar to cloudflared, but supports East to West traffic and is often used in place of Magic WAN when there is no ability to create an IPsec tunnel from existing devices. |
| [WARP Desktop Agent](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/) | Software agent deployed on user devices, creating a tunnel for traffic to and from private applications and networks. | Connecting end user devices like phones and laptops to be part of the Cloudflare network. |
| [Cloudflare Network Interconnect](https://www.cloudflare.com/network-services/products/network-interconnect/) | Direct connection between your physical networks and Cloudflare. | When your applications live in the same data centers we operate in, we can connect those networks directly to Cloudflare. |

For more details on how these methods work, please refer to our [SASE reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/).

#### User connectivity

All the above methods are for connecting networks and applications to Cloudflare, and some users will be on devices connected directly to those networks. They might be in the corporate headquarters or working from a branch or retail location. However, many users are working from home, sitting in a coffee shop, or working on a plane. Cloudflare provides the following methods for connecting users to Cloudflare. This is the same concept of installing a VPN client on a user device, with the difference that the connection is made to our global network and not to your own VPN applicances.

For the best user experience and the greatest degree of access control, we recommend deploying our [device agent](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/) to devices. Supported on Windows, macOS, Linux, iOS, and Android, the agent performs two main roles. First, it routes all traffic from the device to Cloudflare, allowing for access to all your existing connected private networks and applications. Second, the agent provides device posture information such as operating system version, encrypted storage status, and other details. This information is then associated with the authenticated user and can be used as part of access control policy. The agent can be installed manually, but most enterprises deploy it using their device management (MDM) software.

There may be instances where you cannot install software on end user devices. In those instances, Cloudflare provides a proxy endpoint where browsers can be configured to on-ramp their traffic to Cloudflare. This is either done manually by the end user, or by using [automated browser configuration](https://developers.cloudflare.com/cloudflare-one/networks/resolvers-and-proxies/proxy-endpoints/) files.

##### Isolated browser

In some situations, you have no ability to modify the end device in any way. In those instances we provide the ability for a user to access a browser that runs directly on our edge network. This [browser isolation service](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/) requires users to point their browser at a Cloudflare URL, which in turn runs a headless, secure browser on one of our edge servers. Secure vectors are then used over HTTPS and WebRTC connections. For more information, refer to [this architecture](https://developers.cloudflare.com/reference-architecture/diagrams/sase/sase-clientless-access-private-dns/).

#### Integrating identity systems

Users cannot just sign up and access your private resources; their identity and associated credentials are typically created and managed in an enterprise identity provider (IdP). Cloudflare integrates with both [enterprise and consumer-based identity services](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/), as well as providing a simple one-time password (OTP) via email service for when you have a need to authenticate a user with only an email address.

Cloudflare supports integrations with multiple identity providers, including of the same type. So if you manage an Okta instance for your employees, but may have acquired another company with its own Okta instance, both can be integrated with Cloudflare. Cloudflare then acts as a proxy for the SSO process. Applications are configured using SAML and OIDC to use Cloudflare for authentication and then Cloudflare in turn redirects users through the authentication flow of an integrated IdP. Group information can also be synchronized via SCIM into Cloudflare to be used in access control policies.

![Many different IdP's can be integrated, from Google, Microsoft and Github as well as any SAML or OAuth system.](https://developers.cloudflare.com/_astro/security-ref-arch-20.CGOXN25S_ixsmT.svg)

This centralization of identity into a common access control layer allows you to build clearly defined and easily managed policies that can be applied across the entire network. If you then decide to migrate from one IdP to another vendor, you only need to change one identity integration with Cloudflare, and all your downstream applications and existing policies will continue to work.

The focus on this document is about security, and now that applications, devices, identities, and networks are all connected, every request to and from any resource on the network, and also to the Internet, is now subject to Cloudflare's access control and firewall services. There are two services that apply policy-based controls to traffic.

* **Zero Trust Network Access**: Our [Access](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/) product manages access to specific networks or applications that are deemed private. It enforces authentication either for users via an existing identity provider, or for other applications via service tokens or mTLS.
* **Secure Web Gateway**: Our [Gateway](https://developers.cloudflare.com/cloudflare-one/traffic-policies/) product is used to analyze traffic and apply policies, no matter the destination. It is most commonly used to allow, block, or isolate traffic that is destined for the Internet. This can be used to apply access controls to SaaS applications, but any traffic flowing through Cloudflare can be inspected and acted upon by Gateway. Therefore it can also be used to add additional access controls to non-Internet, private tunneled applications.

![Cloudflare's ZTNA and SWG services can be combined to secure both private and Internet access.](https://developers.cloudflare.com/_astro/security-ref-arch-21.CYH5oM7H_14D6gt.svg)

Both of these technologies can be combined to ensure appropriate access to private applications. For users with our [device agent](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/) installed, the policies can also include device-level requirements. When combined with identity data, policies such as the following can be written to control access to, for example, an internal database administration tool.

* User must have authenticated via the company IdP, and used MFA as part of the authentication
* User must be in the "Database Administrators" group in the IdP
* User device must have a Crowdstrike risk score above 70
* User device must be on the very latest release of the operating system

It is possible to define access groups of users that can be applied across multiple policies. This allows IT and security administrators to create a single definition of what a secure administrator looks like, which is then reusable across many policies.

![Policies can easily be written which define tight access groups to private resources.](https://developers.cloudflare.com/_astro/security-ref-arch-22.DQuxIF4A_1ABuvo.svg)

All traffic is flowing through Cloudflare, so therefore all data is flowing through Cloudflare. This allows you to apply data controls on that traffic. Typically, employees are allowed access to sensitive applications and data only on managed devices where the device agent installs Cloudflare certificates that allow Cloudflare to terminate SSL connections on our network. This in turn allows for inspection of the contents of HTTPS web traffic and policy can be written to manage and secure that data.

Cloudflare has a [data loss prevention](https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/) (DLP) service that defines profiles that can be used to identify sensitive data. These profiles are then used in Gateway policies to match specific traffic and either allow, block, or isolate it.

The same DLP profiles can also be used in our Cloud Access Security Broker (CASB) service, where Cloudflare is integrated via APIs to SaaS applications. We then scan the storage and configuration of those applications looking for misconfiguration or sensitive data that's publicly exposed.

#### Securing Internet access

A lot of this section has focused on protecting access to private networks and applications, but a business must also protect their employees and their devices. Our [secure web gateway](https://developers.cloudflare.com/cloudflare-one/traffic-policies/) (SWG) service sits between users connected to Cloudflare and any resource they are attempting to access, both public and private. Policies can be written to prevent employees from accessing high-risk websites or known sites that distribute malware. Policies can also be written to mitigate phishing attacks by blocking access to domains and websites known to be part of phishing campaigns. Protecting users and their devices from Internet threats also reduces associated risks of those same users and devices accessing private resources.

Another critical private resource to secure is email. This is often one of the most private of all resources, as it contains confidential communications across your entire organization. It's also a common attack surface, mostly by way of phishing attacks. [Email security](https://www.cloudflare.com/zero-trust/products/email-security/) (CES) examines all emails in your employee's inboxes and detects spoofed, malicious, or suspicious emails and can be configured to act accordingly. CES can be integrated by changing your domain MX records and redirecting all email via Cloudflare. Another option, for Microsoft and Google, is to integrate via API and inspect email already in a user’s inbox. For suspicious emails, links in the email are rewritten to leverage Cloudflare's [browser isolation service](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/) so that when a user heads to that website, their local machine is protected against any malicious code that might be running in the browser.

![Cloud email security filters unwanted email traffic from your users inboxes.](https://developers.cloudflare.com/_astro/security-ref-arch-23.DIu_T4WS_ZFJOVf.svg)

No matter if your resources are private or public, visibility into what's going on is critical. The Cloudflare administrative dashboard has a wide range of built-in dashboards and reports to get a quick overview. Notifications can also be configured to inform admins, either via email or services such as PagerDuty, of important events.

All Cloudflare services provide detailed logs into activity. These logs can also be exported into other security monitoring or SIEM tools via our log shipping integrations. There are built-in integrations for common services such as AWS, Datadog, Splunk, New Relic, and Sumo Logic. But we also support generic distribution of logs into Azure and Google storage as well as Amazon S3 and S3-compatible services.

In summary, the following diagram details how Cloudflare's SASE services can connect and secure access to your private resources. For a more in-depth review, please read our [SASE reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/).

![Cloud email security filters unwanted email traffic from your users inboxes.](https://developers.cloudflare.com/_astro/security-ref-arch-24.DyfzYaJH_1OT1sz.svg)

## Developer platform

Many of Cloudflare's security services are built on a highly optimized serverless compute platform based on [V8 Isolates](https://blog.cloudflare.com/cloud-computing-without-containers) which powers our developer platform. Like all our services, serverless compute workloads run on all servers in our global network. While our security services offer a wide range of features, customers always want the ultimate flexibility of writing their own custom solution. Customers therefore can use Cloudflare Workers and its accompanying services (R2, D1, KV, Queues) to interact with network traffic as it flows to and from their resources, as well as implementing complex security logic.

The following use cases show how our customers’ security teams have used our [developer platform](https://workers.cloudflare.com/):

* In our ZTNA service, Cloudflare Access, when a request is made to access a private resource, that request can include a call to a Cloudflare Worker, passing in everything known about the user. Custom business logic can then be implemented to determine access. For example:

* Only allow access during employee working hours. Check via API calls to employee systems.
  * Allow access only if an incident has been declared in PagerDuty.

* Implement honeypots for bots: Because Workers can be attached to routes of any Cloudflare-protected resource, you can examine the bot score of a request and then redirect or modify the request if you suspect it's not legitimate traffic. For example, execute the request but modify the response to redact information or change values to protect data.

* Write complex web application firewall (WAF) type rules: As described above, our WAF is very powerful for protecting your public-facing applications. But with Workers, you can write incredibly complex rules based on information provided in the [IncomingRequestCfProperties](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties), which expose metadata for every request. These properties contain extensive information and can be expressed as code for effective rule implementation.

* Enhance traffic with extra security information: Your downstream application may have other security products in front of it, or maybe provides other security if certain HTTP headers exist. Using Workers, you can enhance any requests to the application and add in headers to help the downstream application implement greater security controls.

* Write your own authentication service: Some customers have extreme requirements, and the power of Workers allows you, as we have with our own product suite, to write entire authentication stacks. One such customer [did just this](https://www.cloudflare.com/case-studies/epam/). While this isn't common, it's an example of the flexibility of using Cloudflare. You can mix complex code that you write with our own products to fine-tune exactly the right security outcome.

Using Workers for implementing some of your security controls has the following advantages:

* **Advanced logic and testability**: Enables the implementation of highly sophisticated logic that's easily testable through unit tests.
* **Accessibility to developers**: Security features are accessible to a broader audience due to native support in languages like JavaScript, TypeScript, Rust, and Python, catering to developers' familiarity.
* **Granularity and flexibility**: Offers unparalleled granularity, with support for regex, JSON parsing, and easy access to request/response headers and bodies enriched by Cloudflare. Policies can be designed based on any feature of the request/response.
* **Response modification**: While traditional security stacks often focus solely on requests, Workers empowers effortless modification of responses. For instance, verbose error messages can be obscured to enhance security.
* **Implement DevSecOps lifecycles**: Workers makes it very easy to adhere to DevSecOps best practices like version control, code audits, automated tests, gradual roll-outs, and rollback capabilities.

However, you should also consider the following:

* **Cost**: By adding Workers into the request process, you will incur extra costs. However, this might be acceptable for the scenarios where the significant security outcome is highly beneficial.
* **Latency**: While minimal, there will always be some impact on traffic latency because you are running your own logic on every request.
* **Requires developer skill set**: This is a bit obvious, but worth mentioning. Using Workers requires a development team to create, test, and maintain whatever code is implemented.

You can review some examples of how our Workers platform can be used for [security](https://developers.cloudflare.com/workers/examples/?tags=Security) or [authentication](https://developers.cloudflare.com/workers/examples/?tags=Authentication) use cases.

You should now have a good understanding of the massive scale of the Cloudflare network, how it's secured and operated, and the broad range of services available to you for protecting your business assets. We have built the future of networking and security, and we invite you to consider using our services to better secure your business.

In summary, the benefits of using Cloudflare for your business’s security are:

* Protect all your business assets, public or private.
* Leverage a comprehensive range of security services on a single platform.
* Rely on a massively scaled network with high performance and reliability.
* Implement security controls once, in a single dashboard, and impact traffic from anywhere.
* Empower DevSecOps teams with full API and Terraform support.

We have a very simple [self-service signup](https://dash.cloudflare.com/sign-up), where many of our services can be evaluated for free. If you wish to work with our expert team to evaluate Cloudflare, please [reach out](https://www.cloudflare.com/plans/enterprise/contact/).

<page>
---
title: Designing ZTNA access policies for Cloudflare Access · Cloudflare
  Reference Architecture docs
description: This guide is for customers looking to deploy Cloudflare's ZTNA
  service. It provides best practices and guidelines for how to effectively
  build the right policies.
lastUpdated: 2025-10-24T20:47:24.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/design-guides/designing-ztna-access-policies/
  md: https://developers.cloudflare.com/reference-architecture/design-guides/designing-ztna-access-policies/index.md
---

Organizations today are increasingly adopting a [Zero Trust security](https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/) posture to safeguard company assets and infrastructure in a constantly evolving threat landscape. The traditional security associated with legacy network design assumes trust within the corporate network perimeter. In contrast, Zero Trust operates on the principle of "Never trust, always verify" and implements continuous [authentication and strict access controls](https://www.cloudflare.com/learning/access-management/what-is-access-control/) for all users, devices, and applications, regardless of their location or network.

Typically two technologies play a role in a Zero Trust architecture. First, a [Secure Web Gateway (SWG)](https://www.cloudflare.com/learning/access-management/what-is-a-secure-web-gateway/) filters outbound traffic destined for the Internet and blocks users from accessing high risk websites such as those involved in phishing campaigns. Then, to enable remote access for users to SaaS apps, internally-hosted applications and networks, Zero Trust Network Access ([ZTNA](https://www.cloudflare.com/learning/access-management/what-is-ztna/)) services are used to create secure tunnels and provide access for remote users into private applications.

This guide is for customers looking to deploy Cloudflare's ZTNA service ([Access](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)) and provides best practices and guidelines for how to effectively build the right policies. If you have not already done so, we recommend also reading Cloudflare's [SASE reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/), which goes into detail on all aspects of how to use Cloudflare as part of your Zero Trust initiatives.

### Who is this document for and what will you learn?

This document is aimed at administrators who are evaluating or have adopted Cloudflare to replace existing VPN services or provide new remote access to internal resources. This serves as a starting point for designing your first ZTNA policies and as an ongoing reference. This guide covers three main sections:

* **Technical prerequisites**: What needs to be in place before you can secure access to your first application and define access policies.
* **Building policies**: The main components of an access policy and how they are combined.
* **Use cases**: Common use cases and policies that can serve as blueprints for your own policy designs.

This design guide assumes you have a basic understanding of Cloudflare's ZTNA solution, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/). Therefore, this guide focuses on designing effective access policies and assumes you have already configured [DNS](https://developers.cloudflare.com/cloudflare-one/traffic-policies/initial-setup/dns/), [identity](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/) and [device posture providers](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/) as well as [created connectivity](https://developers.cloudflare.com/cloudflare-one/networks/) to self-hosted applications and related networks.

By the end of this guide, you will be equipped to implement granular access policies that enforce Zero Trust principles across various common enterprise scenarios.

This section covers the essential architectural components and concepts to understand before you can design granular access policies.

We recommend reading the [SASE reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/) to get a deeper understanding of connecting applications, identity providers, and device posture providers.

Cloudflare allows organizations to facilitate application access using our [connectivity cloud](https://www.cloudflare.com/connectivity-cloud/), which securely connects users, applications and data regardless of their location. Core to the platform is Cloudflare's [extensive global network](https://www.cloudflare.com/network/) which delivers low-latency connectivity for users worldwide. By running every service in every data center, Cloudflare applies networking, performance and security functions in a single pass, eliminating the need to route traffic through multiple, specialized security servers, and therefore reduces latency and avoids performance bottlenecks.

![Figure 1 shows the basic components involved in remote access with Cloudflare's ZTNA service.](https://developers.cloudflare.com/_astro/figure1.CjKTWbna_Z19SAh0.svg)

There are two main ways to provide access to private applications and networks: by public hostname, where requests are proxied to the application, or by private IP, where the user is on a device or network that is connecting them to their private corporate network via Cloudflare.

### Active domain in Cloudflare

To use public hostnames, you need to have an [active domain](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) in Cloudflare. Most customers use Cloudflare as their primary DNS service, but it is possible to configure domains for use with Access and maintain [DNS records elsewhere](https://developers.cloudflare.com/dns/zone-setups/partial-setup/).

### Network route to applications

For Cloudflare to control access, it needs to be in front of the application and have a secure and reliable network route for successfully authenticated users. Requests for application access come to Cloudflare first, where policy is applied, and then if successful, user requests are routed to the application.

Cloudflare supports access to the following types of applications:

* SaaS applications on the Internet
* Self-hosted applications accessed via public hostname
* Self-hosted applications accessed via private IP

For SaaS and other Internet-facing applications, access from Cloudflare is simple — it is already on the Internet. But for self-hosted applications, you create a tunnel from Cloudflare to the private network where the application is running. There are two methods for doing this:

* Our recommended approach is to use [software agents](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) such as [cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/) or [WARP connector](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/warp-connector/). (Note, only cloudflared currently supports proxying of public hostnames to private applications.)
* For network-based connectivity, [Magic WAN](https://developers.cloudflare.com/magic-wan/) uses IPsec or GRE tunnels connecting Cloudflare to existing network appliances that are connected to the private networks, and [Network Interconnect](https://developers.cloudflare.com/network-interconnect/) creates direct connectivity if your applications run on servers in a data center Cloudflare operates in. (For migrating from existing legacy VPN solutions to network-based tunnels, you may find [this guide](https://developers.cloudflare.com/reference-architecture/design-guides/network-vpn-migration/) useful.)

Once we have established connectivity to your applications, it is time to facilitate user access. Depending on your policy requirements (more on this later) users can access the application directly over an Internet connection to a public hostname, or — for greater security — we recommend using our [device agent](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/), Cloudflare WARP, which creates a tunnel directly to Cloudflare and also provides information about their device for use in access policies.

A critical part of application access is authenticating a user. Cloudflare has a [built-in authentication](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) method based on email. But we highly recommend configuring a third-party identity provider. We support both consumer and enterprise [identity providers](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/), and any SAML or OpenID compliant service can be used. Group membership is one of the most common attributes of defining application access and can be defined manually or imported using the System for Cross-Domain Identity Management ([SCIM](https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/)).

The final prerequisite for building really effective access policies is to configure [device posture](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/). When using the [device agent](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/), Cloudflare has access to a [variety of information](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/) about the device which can then be used in an access policy. When using an [agentless method](https://developers.cloudflare.com/reference-architecture/diagrams/sase/sase-clientless-access-private-dns/) to access applications, only the user identity information is available. We also support using device posture information from [other vendors](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/), such as Microsoft, Crowdstrike and Sentinel One.

![Figure 2 - two employees with different devices trying to access the same corporate application. Only the user with the device agent can access the SSH service.](https://developers.cloudflare.com/_astro/figure2.BibmIt2I_1gYxP5.svg)

To quickly summarize the architecture described so far, Cloudflare is:

* In front of network access to the application.
* Integrated with your identity providers.
* Aware of device posture details for your users using our device agent or a third party vendor.

When a user makes a request to access an application, they must first authenticate, then, before access is granted, policies in the application are evaluated based on the data associated with the requesting user. Policies and other application specific settings are defined in an Access application.

### Access application types

Cloudflare Access supports four main types of applications:

* **Self-hosted** refers to applications that your organization hosts and manages, either on premises or in the cloud. Cloudflare creates a public hostname which it uses to proxy traffic through a secure tunnel to the application. While access via public hostnames is supported if your server is just publicly facing on the Internet, we recommend you use `cloudflared` to create a secure, outbound-only connection from your application to Cloudflare's edge. Once that occurs, Cloudflare will then reverse proxy the target application/content to your users.
* **Private IP** applications are similarly privately hosted, but lack fully-qualified public hostnames. Access can be facilitated via `cloudflared`, WARP Connector, Cloudflare Magic WAN, or Cloudflare Network Interconnect. Remote users not connected to a network already connected to Cloudflare will need to use the device client to get access to the application via private IP and to avoid using IP addresses with users, use [internal DNS services](https://developers.cloudflare.com/cloudflare-one/traffic-policies/resolver-policies/#use-cases) to resolve private hostnames to private IP addresses. But it is possible to provide access without any software deployed to the client by using our agentless [browser isolation service](https://developers.cloudflare.com/reference-architecture/diagrams/sase/sase-clientless-access-private-dns/).
* **SaaS** applications are accessed over the public Internet, and therefore do not require any tunnel connectivity to Cloudflare. Instead, Access acts as an identity proxy between users and the SaaS application. When a user attempts to access the SaaS app, they are first authenticated by Cloudflare, which redirects to your main identity service. SaaS applications are then configured via SAML or OAuth to trust Cloudflare. This allows organizations to implement additional security layers (like device posture checks) and centralize access control for their SaaS applications, even if the SaaS or identity provider does not natively support these features.
* **Infrastructure** applications enable users to control access to individual servers, clusters or databases in a private network. Infrastructure apps work by defining a 'target' proxied over `cloudflared`, but allows users to group multiple machines under the same target - essentially, allowing users to define common access policies across potentially disparate infrastructure resources. Built-in access and command logging capabilities means organizations can maintain detailed audit trails for compliance and security investigation purposes.

It is possible to configure SaaS applications to accept traffic only coming from Cloudflare. This forces all SaaS application traffic to be proxied and routed via Cloudflare Gateway which, in turn, allows for the use of security controls to inspect and filter traffic such as downloads of sensitive company data from SaaS applications. The second use case below will describe how to achieve this.

Access applications typically map directly to a single application. However, it is possible to have an Access application, and its associated policies sit in front of more than one application endpoint. This might be a range of IPs related to multiple Windows RDP servers where you wish to implement a common access policy. The same idea can also be applied to public hostnames, where you might have more than one hostname that refers to several applications you wish to have the same policies. For instance, you might have wiki.domain.com and wiki.domain.co.uk — different application instances, but with common access policy requirements.

Next, we examine the main elements of a ZTNA-protected application that need to be understood to create effective access policies, then later in the document we will examine some use cases that apply those specific elements.

Authenticating a user's identity is a key component of any Zero Trust policy. When attempting to log into an application, a user will be redirected to a configured identity provider. If a user fails to authenticate with the identity provider, Cloudflare will not accept their request for the application.

As mentioned above, Cloudflare can be integrated with all your identity providers (IdPs), both enterprise and consumer. Then at the application and policy level, you choose which IdPs you want to allow for authentication. For example, you may have an application that only a limited number of employees can access. Therefore, you would only enable your corporate IdP. For another application, you may wish to allow access to a wider group of non-employee users, such as contractors or third-party partners. Some of those users you might authenticate via their GitHub or LinkedIn credentials.

When a user attempts to access an application they will be presented with a sign-in page where they choose which IdP to authenticate with. For applications with only a single IdP, you can automatically redirect the user to that IdP. It is also possible to configure the application to display every possible IdP that has been configured, allowing you to add new providers in the future without the need to update the policy.

![Figure 3 - How employees from different parts of the organization authenticate to the same application.](https://developers.cloudflare.com/_astro/figure3.eRr6LFPW_18nofX.svg)

After authentication, the IdP is going to send information about the identity back to Cloudflare. Depending on the IdP, this information may include [Authentication Method Reference](https://datatracker.ietf.org/doc/html/rfc8176) (amr) values, IdP groups, SAML attributes or OIDC claims which can then be used in policies.

When using our device agent, users must also authenticate and can be presented a custom list of IdPs. Once the agent is authenticated, they are able to connect to Cloudflare and it is possible to configure applications to skip authentication, instead trusting the existing authentication session associated with the device agent.

Now we arrive at the main focus of this guide: the policies which define access to applications. This is where the real work is done to define who has access, and how. Before looking at example use cases, here is a breakdown of how policies work.

![Figure 4 - Our ZNTA service Access can use a wide variety of attributes in an access policy.](https://developers.cloudflare.com/_astro/figure4.Hsz5t8u9_2jA9r2.svg)

Each application can contain multiple policies, and are evaluated in order. Because multiple policies — each with multiple sets of rules — can get quite complex, there is a policy tester where you provide a username and see how the user is evaluated against all the policies and rules. Policies consist of the following elements:

While it seems obvious what this is for, we highly recommend having a strategy for naming your policies. This is because you will likely create similar policies across multiple applications, such as "Allow all full-time employees" or "Block high-risk users". Using the same naming scheme across all applications will vastly streamline your ability to review application access and to understand the full list of policies in the future.

The Action field in a policy determines what happens when a user or service matches the policy's criteria. There are four main types of actions:

* **Allow** grants access to the application. A login page will be presented to a user on initial access request.
* **Block** denies access to the application. This is generally not required because Access is denied by default. The only reason users should implement a block policy is for testing a specific policy condition or short-circuiting policy evaluation. If a block policy has higher precedent than an Allow, and a user matches the block policy, all other policy evaluation ceases.
* **Bypass** allows users or services to disable any enforcement for traffic before accessing the application. For example, a specific endpoint in an application may need to be broadly accessible over the Internet.
* **Service Auth** allows you to authenticate requests from other services or applications using [mTLS](https://developers.cloudflare.com/ssl/client-certificates/enable-mtls/) or [service tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/). No login page will be presented to the user or service if they meet this policy criteria. This is designed so that non-user requests, such as those from other applications, can access secured resources.

Cloudflare Access is a deny by default service, which means if a request does not match any policy action, the default action is "Block."

#### Session duration

Session duration refers to the length of time a user's authentication remains valid after they have successfully logged in to an application. Typically, the session duration is set for 24 hours, but you can also set durations for sensitive applications to expire immediately. This approach aligns with the core Zero Trust principle of "never trust, always verify." Even if a user initially presents the appropriate device posture and identity context, continuous verification ensures that access rights are reassessed with each new request. This method significantly reduces the risk window, as it removes the assumption that the initial authentication and authorization state remains valid over an extended period.

These are the main focus of a policy. Rules define all the attributes that dictate if the policy allows or denies access, or renders the application in an isolated browser. They are composed of a selector and value, which is essentially the attribute you wish to evaluate and the data you are evaluating.

Each rule is a filter to determine which users this policy is going to affect. There are several categories of rules:

* **Include** rules define who or what is eligible for access. When a user matches an "Include" rule, they become a candidate for access, subject to other rules types in the policy. These rules use OR logic — satisfying any one is sufficient. For example, you may make an application available to a specific group, but need to add in contractors for an email list, and as long as the user matches one of these (group membership, or a valid email) they are included in the rule. Every policy must have at least one Include clause.

* **Require** rules set mandatory conditions that must be met for access to be granted. Unlike Include rules, "Require" rules use AND logic — every rule must be met. This is typically used to layer security on top of the basic access criteria defined by Include rules. For example, administrators can require that anyone trying to access an application use specific MFA methods.

* **Exclude** rules define exceptions to access, overriding other rule types. If a user matches an "Exclude" rule, they're denied access regardless of other policy conditions. For example, a user may meet a requirement to use a MFA method during login, but if their specific [multifactor authentication (MFA) method](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/mfa-requirements/) is defined in an Exclude rule, they will be blocked by the policy. Alternatively, if a user is associated with a 'high risk' IdP group, they can be excluded on that basis even if they meet all the other posture requirements.

A useful way to imagine how these different types of rules are applied, is to imagine a funnel. Include selectors define what attributes of the user, traffic or device are included in the policy that will be Allowed, Blocked and so on. Require then further filters from that list what attributes must be associated with the user with the Exclude type filtering out users who have matched both the Include and Require.

![Figure 5 - Policies and rules are evaluated in a funnel. With Include rules aggregating all users, Require rules mandating specific requirements and Exclude rules removing user identities from the policy evaluation.](https://developers.cloudflare.com/_astro/figure5.DEijf6Ia_au3nz.svg)

The above diagram visualises an example for the policy "All employees and contractors on secure devices using strong MFA". Anyone in the group "All Employees" or contractors who have authenticated with a username in their company domain will match this policy. They are required to be using a device that has the latest OS and is using encrypted storage. They must have authenticated with an MFA factor, but not SMS. Also, they must be accessing the application via Cloudflare's secure web gateway.

There are many different [types of selectors](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/#selectors). While every possible selector is not listed here, the following lists specific outcomes that organizations using Cloudflare Access typically desire when building policies. This will help you understand how to achieve a specific outcome.

* **Is user traffic coming over Cloudflare Gateway?** Guaranteeing that a user only accesses an application over our SWG, Cloudflare Gateway, is a great way to prevent unauthorized access due to phishing or credential theft. Additionally, you can ensure all traffic bound to the application is logged and filtered by Cloudflare Gateway.

You can configure this control by enabling the "gateway" device posture check and then requiring "gateway" in your application policies. Requiring "gateway" is more flexible than relying solely on the device agent because users can also on-ramp from Browser Isolation or a Magic WAN-connected site, both of which provide traffic logging and filtering. Additionally, when using the device agent, this allows you to guarantee that a user is coming from a compliant device that has passed a set of device posture checks.

Requiring the gateway is enforced continuously for [self-hosted applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/). For SaaS apps, it is only enforced at the time of login. However, a dedicated egress IP can be leveraged in tandem to enforce that traffic always goes via Cloudflare Gateway.

* **Does the user belong to an existing group, or have specific identity attributes?** If your IdP supports SCIM, group membership information can be imported into Cloudflare, where it can be used in policies. Group information can also come from the SAML or OAuth data sent as part of authentication. In fact, when OIDC or SAML is used and claims are sent, they can be used in a policy. So if your users authenticate to your IDP using SAML, and the resulting token contains their "role," you can query that value in the rule.

* **Which identity service was used for authentication ?** Similar to IdP groups and attributes, this "Login methods" selector asks which identity service was used, and, like IdP groups, this is better suited to an access group rather than a specific line item on an access policy. Login methods allow you to apply different policies to specific users who authenticated with certain identity providers. For example, you might only allow users who have authenticated with a consumer identity such as GitHub or LinkedIn to gain access if their authentication method included a hard token-based MFA.

This is an atypical scenario, but if you do need to enable multiple IdPs for authentication, then you can use this selector to make sure users are authenticating with a specific service. The value of this requirement becomes clearer when dealing with multiple layered security policies, and need to define different levels of access based on the login.

* **Individual or organizational emails** All identity services provide an email address, which in many cases matches the individual's username. Using an email in a policy can be useful when wanting to allow access to an entire domain of users, but they might authenticate via a consumer IdP that allows for any email. For example, you might only allow access for users who have authenticated via GitHub using their @company.com email address.

Another good use of this selector is if you are managing a [list of emails](https://developers.cloudflare.com/cloudflare-one/reusable-components/lists/) of users that might be high risk or have been blocked from a specific application. You can use an Exclude rule, with your list to ensure a subset of users cannot access an application.

* **How did the user authenticate?** When an identity provider authenticates a user and then redirects them back to Cloudflare, it includes information about what authentication method was used. This is typically sent as [Authentication Method Reference](https://datatracker.ietf.org/doc/html/rfc8176) data. Using this you can check if MFA was used and what type.

This can be useful to define different levels of credential requirements for different applications. For example, a general company application might just require that MFA was used and not care how. But a really sensitive administration tool might require a FIDO2 hardware-based security key,and therefore explicitly deny access if only an OTP via SMS is used as part of the authentication process.

* **What country is the request coming from?** You can set rules based on the geographic lookup of the incoming request. This could be useful for restricting access to certain countries where you do business.

* **What IP range is the request coming from?** You can set rules based on the IP range of the incoming request. This could be allowing access only from your corporate network IP ranges.

* **Is it possible to verify device or user information from a list?** Sometimes, you might want to grant or restrict access based on specific device or user characteristics that do not fit neatly into other categories. This is where [lists](https://developers.cloudflare.com/cloudflare-one/reusable-components/lists/) come in handy: you can define or import a list of contractor emails, or a list of approved device serial numbers and use those as criteria within an Access policy. These lists can be updated manually or via our [API](https://developers.cloudflare.com/api/resources/zero_trust/subresources/gateway/subresources/lists/methods/create/), allowing for integration with other device or user management systems.

* **Is the device's security posture adequate?** This is where the device client provides telemetry on the native device making the access request. It accomplishes this by performing device-level scans. Is the device's hard drive encrypted? The agent can check if technologies like BitLocker or FileVault are active, in addition to checking for specific volume names. If you are protecting a sensitive application, or something that holds critical information, this is an effective requirement to enforce.

* **Is the request being made by another process or application?** It is not always a real human on a device attempting to access an application. This makes it useful to leverage Cloudflare Access to manage communication to APIs by other software. The request may contain service tokens, mutual TLS certificates, and SSH certificates, which enables logins for automated processes and machine-to-machine communication. Using service auth options within Cloudflare also centralizes the storage and lifecycle management of these tokens and certificates.

* **What does your third-party tool say about your device?** Many organizations use other specialized tools for endpoint security, such as Crowdstrike, SentinelOne, or Microsoft Intune, to provide telemetry regarding the security posture of the device making the application request. Rather than require the user to navigate multiple UIs, you can integrate these tools into Cloudflare One via their API, and apply their insights into device posture attributes that can be enforced during an application login.

Some third-party device posture integrations can be used even when the user device does not have our agent installed. Instead, the third party integration matches the user based on email and provides information directly to Cloudflare.

#### Additional settings

Below are a few additional application settings to consider that help improve security.

##### Isolate application

Sometimes you want to manage access to a self-hosted application for less trusted, third-party users such as contractors or partners. You might want to allow them to read content in an application, but limit their ability to download files, copy and paste data, and print the page. Cloudflare Access allows you to render the application in a remote [browser](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/isolate-application/) (using [remote browser isolation, or RBI](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/)) so that the application is rendered using a headless browser on our network versus sending all the content down to the user's browser. This allows Cloudflare to then enforce a range of controls over how the user can interact with the content.

The setting is at the policy level, so one policy can allow trusted users (such as employees) to access applications normally, while another policy with browser isolation enabled can apply the RBI service for contractors.

This setting forces traffic to an isolated browser before being delivered to the end user, which means all traffic is then inspected and managed by Cloudflare Gateway. To limit what the user can do, you need to create an accompanying policy in the gateway, which also identifies the same users and then enforces the [controls](https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/isolation-policies/#policy-settings) you wish to limit access. Note that it is important to write the Gateway policy such that it only enforces RBI for the same group of users accessing the application that the Cloudflare Access policy applies to. Otherwise, the policy will default to enforce browser isolation for all users.

It is possible to actually enforce RBI for the same set of users if they attempt to access the application using a non-secured device. In this case, you would continue to define a policy for employees in Cloudflare Access. But then, also create a policy in Cloudflare Gateway to isolate the application if users going to the same application URL have failed a device posture check that deems the device is not managed or secure. This could be if the device does not have the company endpoint security client (Crowdstrike or SentinelOne for example) installed, or has failed a security check. We will demonstrate this in the use cases below.

Inversely, isolating the browser also protects the local device from anyone attempting to exploit vulnerabilities or execute malicious code against the application.

You may wish to audit an application's every authentication event and capture justification details. This setting creates a more well-defined audit trail of user access, and allows administrators to review and analyze access patterns and justifications. When enabled, users will be prompted to provide a brief explanation before gaining access. This can be particularly useful for sensitive applications or during specific time periods, such as outside normal business hours.

##### Temporary authentication

Add an additional layer of access control by requiring users to obtain "temporary authentication" approval from designated authorizers before accessing the application. When enabled, users requesting access will trigger a notification to authorized approvers.

One of the most important parts of defining ZTNA policies is to leverage reusable elements called [Access Groups](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/groups/). Each access group uses the same rules we've just described to define users, traffic or devices. These groups can then be used across many policies to allow, deny, bypass, or isolate access to an application.

For example, you can define "Employees" once as an Access Group, and then use that in every application policy where you want to refer to employees. Updates to this Access Group would then be reflected in every policy. This is also a good way to include nested logic (for example, users with a Linux device and has antivirus software enabled)

Below is a diagram featuring an Access Group named "Secure Administrators," which uses a range of attributes to define the characteristics of secure administrators. The diagram shows the addition of two other Access Groups within "Secure Administrators". The groups include devices running on either the latest Windows or macOS, along with the requirement that the device must have either File

![Figure 6 - An access group that matches to IT administrators on secure systems.](https://developers.cloudflare.com/_astro/cf1-ref-arch-24.aWooHqll_2v76br.svg)

Now that the basic infrastructure to secure access to an application and the policy systems have been covered, let's dive into some common use cases.

### Only allow company wiki access to users on trusted devices

Many companies host some sort of internal content system where confidential company information resides. Wiki's are a common type of application that allows employees to collaborate easily with anyone. But because this information is confidential, it is important to both validate the user authentication with strong credentials, and also ensure that their access is via a secure device, via a secure connection.

However, sometimes company users use non-company devices and need to access the wiki. You may wish to set up a policy that allows this, but limits the user's actions. For instance, prevent them from editing the data, or from copying and pasting it to their unmanaged device. This use case explains how to set up a Cloudflare Access application to define secure access for employees, giving them fully functional access when they are on a secured device over a secured connection, but still allow them some limited access from a non secure device.

First, create an Access application with the following parameters:

| Name | Company Wiki |
| - | - |
| Type | Self-hosted |
| Public Hostname | wiki.mycustomerexample.com |
| Authentication | Company Microsoft Entra IdP |
| Policies | Employees on trusted devices Employees using untrusted devices |

Before we examine how the two policies are defined, observe an example where an Access Group was created to identify an employee and approved devices were running the latest operating system version.

#### Access Group: Secure employees

This access group is going to be used in both policies, and its sole goal is to identify what a "Secure Employee" is.

| Name | Secure Employees |
| - | - |
| **Include** | |
| Azure AD Groups | "Full-Time Employees" |
| **Require** | |
| Azure AD Groups | "Completed security training" |
| OS Version | "Latest version of macOS", "Latest version of Windows", "Latest Kernel version for Linux" |

This is a very simple Access Group, with just two group selectors. Note that because we are checking membership based on groups from a specific directory, it also implies that the user must have authenticated to that directory. It means in the future, if you move to another identity provider or change the group membership requirements for what defines a Full-Time Employee, you change just this Access Group once.

As you can see, it defines that "all employees" are those in the Azure AD group "Full Time Employees", who are also in the group "Completed security training." The first selector defines the initial scope of the Access Group, and the second selector requires that they must also be in that specific group.

This Access Group requires that three [device posture checks](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/) have been created for the [OS version](https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/warp-client-checks/os-version/). For example, the posture check "Latest version of macOS" is defined as "macOS version is greater than or equal to 15.1" and reflects the latest version the company considers stable and secure (vs. the very latest OS version). Once included in the Access policy, this will enforce the logic we’ve established here - if any user wants to sign in as a 'Secure Employee', they'll need to meet these requirements.

#### Employees on trusted devices

Now we define the first policy in the application. First, select the Access Group that has already been defined. Then, define the following rules to determine how users authenticate and how they connect to the application.

| Policy name | Employees on trusted devices |
| - | - |
| Action | Allow |
| Access groups | Include - Secure employees |
| **Rules** | |
| Require | |
| Authentication Method | MFA - Multiple Factor Authentication |
| Gateway | On |
| **Additional settings** | |
| Isolate Application | No |

This policy ensures that users can gain full access to your company wiki only if they have passed the following requirements:

* They are full-time employees on devices with the latest operating system.
* Users have authenticated using MFA.
* Users are accessing the application via a device that has the Cloudflare device agent running.

#### Employees using untrusted devices

The second policy should handle users who are not on secure devices. Note that this policy is second in the list of policies in the application and therefore will be evaluated when users do not meet the requirements of the first policy.

| Policy name | Employees using untrusted devices |
| - | - |
| Action | Allow |
| Access groups | Include - All Employees |
| **Rules** | |
| Require | |
| Authentication Method | MFA - Multiple Factor Authentication |
| **Additional settings** | |
| Isolate Application | Yes |

Although this policy is very similar to the first, it removes the requirement to have a device on the latest operating system and also using our device agent. The user is still required to be a full-time employee authenticated with strong, MFA-backed credentials.

But notice we now enable "Isolate Application." What does this mean? This forces all requests to the application to now be rendered on our RBI technology. RBI will prevent the wiki UX from loading directly in the end user's browser, and instead renders the content in a headless browser running on a server in Cloudflare's global cloud network. Then, the results of that render are securely and efficiently communicated down to the end user's browser. Because of this, the request is also sent via our SWG service, which enables you to write a policy that controls how users can interact with the wiki.

**Gateway HTTP Policy**

| Isolate company applications for users on insecure devices | |
| - | - |
| Action | Isolate |
| **Traffic** | |
| Domain in | wiki.mycustomerexample.com |
| **Device Posture** | |
| Passed device posture not in | Warp Check |
| **Settings** | |
| Disable copy / paste | Yes |
| Disable file downloads | Yes |
| Disable file uploads | Yes |
| Disable keyboard | Yes |
| Disable printing | Yes |

In the example above, the SWG policy is matching any traffic heading to your company wiki, then enforcing RBI (to match the ZTNA application policy) and then disabling all interaction with the wiki.

It also adds the device posture check "WARP Check (Mac OS)" to scan the user's device for the presence of our device agent. If the user's device does not have the agent installed and enabled, then the device posture check cannot occur and they will automatically fail to meet the policy requirements. If the user does have the device agent enabled, then they will pass the posture check and be granted full wiki access. Note that WARP is the name used for our device agent.

Essentially, the employee on an insecure device is permitted to view the wiki in a "read-only" mode, but is restricted from further interactions like uploading/downloading or copying/pasting confidential information.

This policy approach accomplishes several objectives:

1. It enforces the use of trusted devices for full access to the wiki, aligning with your Zero Trust security goals.
2. It provides a fallback option for employees using personal devices, allowing them to access the wiki in a limited, secure manner through browser isolation.
3. It incentivizes employees to use their company devices and/or keep WARP enabled, which is a net positive for an organization's security posture.
4. It demonstrates the power and flexibility of more granular security controls achieved by combining Cloudflare Access policies with Cloudflare Gateway HTTP policies.

This approach both secures your wiki and establishes a model for protecting other applications — allowing your organization to maintain strong cyber hygiene while adapting to the realities of hybrid work scenarios.

### Secure access to Salesforce

The second use case implements a secure access strategy that also requires the use of the device client. However, the implementation is slightly more involved than the previous wiki example.

Before addressing the specifics, you will learn about the benefits of securing access to SaaS apps through Cloudflare. After all, Salesforce and other major SaaS providers already offer robust security features, including their own access controls, MFA, and audit logs. So why do some organizations still choose to route their SaaS traffic through Cloudflare?

The key benefit here is centralizing security policy enforcement across your entire IT ecosystem. By routing Salesforce access through Cloudflare, you are not just securing Salesforce – you are integrating it into a broader Zero Trust strategy that includes a single point of visibility for all user activity, and reduces the complexity of managing multiple security systems. It also allows you to implement the enforcement of many different IdPs for access to a single SaaS application.

In the context of this use case, it is important to protect Salesforce — which contains sensitive customer data — against misuse, and to secure access only to authorized users. We are going to design a secure access policy that can cover both of these objectives.

The first step is to configure an [egress IP policy under Cloudflare Gateway](https://developers.cloudflare.com/cloudflare-one/traffic-policies/egress-policies/). This allows you to purchase and assign specific IPs to your users that have their traffic filtered via Gateway. Then in Salesforce, you can enforce that access is only permitted for traffic with a source IP that matches the one in your egress policy. This combination ensures that the only way to get access to Salesforce is via Cloudflare.

| Egress Policy | |
| - | - |
| **Identity** | |
| User Group Names | All Employees |
| **Select Egress IP** | |
| Use dedicated Cloudflare Egress IPs | \[203.0.113.88] |

This is important not only for securing access to Salesforce, but also for adequately protecting its contents while in use. The next step is to examine the access policy which is similar to the one we just created for the wiki. However, this policy is limiting access to members of the Sales or Executives groups. We are also using our Crowdstrike integration to ensure that users are on company managed devices.

| Policy name | Account executives on trusted devices |
| - | - |
| Action | Allow |
| **Include** | |
| Member of group | Sales, Executives |
| **Require** | |
| Authentication method | MFA - multi-factor authentication |
| Gateway | On |
| Crowdstrike Service to Service | Overall Score above 80 |

The second policy now applies to all employees but we are going to apply a few more steps before access is granted.

| Policy name | Employees on trusted devices |
| - | - |
| Action | Allow |
| **Include** | |
| Member of group | All Employees |
| **Require** | |
| Authentication method | MFA - multi-factor authentication |
| Gateway | On |
| Crowdstrike Service to Service | Overall Score above 80 |
| **Additional Settings** | |
| Purpose justification | On |
| Temporary authentication | On |
| Email addresses of approvers | <salesforce-admin@company.com> |

We are going to add in temporary authentication to this second policy. That means if Cloudflare determines that the incoming request is from someone outside of the Sales or Executives department, an administrator will need to explicitly grant them temporary access. In context, this policy could be used to secure access to Salesforce for employees outside the Sales department, as the customer information could be sensitive and confidential.

This approach is important for several reasons:

* It allows for human oversight on potentially risky access attempts, reducing the chance of unauthorized access through compromised or insecure devices.
* It provides flexibility for legitimate users to access the application even when their device fails to meet the highest security standards. This encourages users to maintain good security practices on their devices.
* In addition, since all user traffic is routed through Cloudflare, we can enforce additional security measures (such as preventing the download of sensitive data) via web traffic policies.

### Only allow secure admins access to database tools

This scenario covers protecting a PostgreSQL database administration tool. This represents a privately-hosted, high-value target due to its access to sensitive data. It also requires taking extra care in designing secure access for it. Given the nature of database tools, access policies will not be layered for this use case.

| Policy name | Only IT admin access |
| - | - |
| Action | Allow |
| **Include** | |
| Assign a group | IT Admins |
| **Require** | |
| Authentication method | MFA - multi-factor authentication |
| Gateway | On |
| Device Posture - Serial Number List | Company Managed Device Serial Numbers |
| OS Version | Latest version of Windows |
| Domain Joined | Joined to corporate AD domain |
| **Exclude** | |
| Authentication method | SMS |
| **Additional Settings** | |
| Purpose justification | On |

Here, we are introducing a high number of security posture checks, starting with MFA. We have two expressions regarding MFA: the first one requires that users authenticate with a MFA method. The second 'excludes' expression pointing out that SMS is not considered a valid authentication method. We do this because SMS is one of the easier methods for attackers to exploit and subvert, and therefore [considered less secure](https://sec.okta.com/articles/2020/05/sms-two-factor-authentication-worse-just-good-password) than other MFA methods. As a result, we are only allowing access when the user provides stronger credentials such as a hard key or an OTP from an authenticator app. Enforcing these stricter MFA requirements reduces the risk of credential-based attacks, and makes it much more challenging for potential attackers to gain unauthorized access to this critical database—even if they have obtained the user's password.

Other posture elements here include:

* Requiring the latest OS.
* The user's device is joined to a Microsoft Active Directory domain.
* The user's device is explicitly a company-managed device (shown by referencing a list of managed device serial numbers).

These combined posture checks ensure that only up-to-date, company-controlled devices within your managed environment can access the database, further reducing the attack surface and the risk of access from potentially compromised or uncontrolled endpoints.

Under additional settings, we are also requiring that users enter a purpose justification for accessing the database. This allows your security teams to analyze access patterns and identify potentially suspicious behavior. This set of security controls also ensures that access to your critical database is tightly regulated, logged, and justified — significantly reducing the risk of unauthorized access or misuse.

This level of protection and visibility would be significantly more complex and resource-intensive to achieve with disparate, standalone security solutions. Centralizing security policy enforcement via Cloudflare allows you to simplify how you implement fine-grained access to critical internal resources.

### Secure RDP access

This final use case centers on securing remote access to devices via RDP in two ways — self-hosted or private IP. Both options offer unique benefits, but ultimately it comes down to your priorities: is it more important to simplify access, or to tightly monitor activity?

We will start with the self-hosted option — proxying port 3389 over a tunnel, mapping it to a hostname.

| Application Configuration | |
| - | - |
| Application Name | RDP service on database server |
| Hostname | rdp.databaseserver.company.internal |

| Policy name | Admin Access |
| - | - |
| Action | Allow |
| **Include** | |
| Member of Group | IT Admins |
| **Require** | |
| Authentication method | MFA - multi-factor authentication |
| Gateway | On |
| WARP | On |
| Device Posture - Serial Number List | Company Managed Device Serial Numbers |
| External Evaluation | \[Time Evaluator URL] |

Inside the policy, we have made this application available to our new access group for IT Admins. Under "Require," we are enforcing the use of Cloudflare WARP specifically (as opposed to only Cloudflare Gateway). The user must be on a company-managed device, with an active device client that is authenticated to the company's instance of Cloudflare, MFA must be used during login, and there is an additional option below for external evaluation.

[External evaluation](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/external-evaluation/) means we have an API endpoint containing some sort of [access logic](https://github.com/cloudflare/workers-access-external-auth-example) — in this case, time of day access. We are making an API call to this endpoint, and defining the key that Cloudflare is using to verify that the response came from the API. This is useful for several reasons:

External evaluation allows users to create bespoke security posture checks based on criteria that may not be covered by the default set of posture checks. For this example, we will be using a service built on [Cloudflare Workers](https://workers.cloudflare.com/).

* Restricting access to the terminal outside of business hours implements a form of time-based access control. This adds an extra layer of security by limiting the window of opportunity for potential attackers.

Now, you will learn how to secure RDP access as a private IP application:

| Application Configuration | |
| - | - |
| Application Name | RDP |
| Destination IP | 169.254.255.254 |

As mentioned before, private IP applications work because Cloudflare proxies the IP range across its network. The nature of this application necessitates the use of the device client, as unless the user is connected to Cloudflare (and more specifically, unless they can take advantage of the WARP-to-Tunnel connectivity), they will not be able to reach non-local RFC 1918 addresses.

| Traffic | |
| - | - |
| Destination IP | 169.254.255.254 |
| Destination Port | 3389 |
| **Identity** | |
| User Group Names | Server Admins |
| **Device Posture** | |
| Passed Device Posture Checks | WARP Check (Mac OS) (File) Latest Version of macOS (OS version) |
| **Action** | Allow |
| **Enforce WARP client session duration** | 60m0s |

Defining the application here is simple, as Cloudflare automatically fills in the IP range, and you need to limit the detected protocol to RDP. However, the rules for private IP applications are slightly different. You will notice they appear as network policies under the Cloudflare Gateway menu, despite managing them in Access. Certain options, such as checking for MFA and external evaluation, do not appear here. However, these attributes can be verified when the user activates their device client and authenticates to their organization.

One option available here is enforcing the device agent client session duration. This means that after a certain amount of time, the user will be forced to reauthenticate. This feature allows you to take a Zero Trust approach to protecting private IP applications as well. It ensures that even if a user's credentials are compromised or their device is left unattended, the potential window for unauthorized access is limited. By regularly requiring reauthentication, we are continuously verifying the user's identity and authorization status, aligning with the core Zero Trust principle of "never trust, always verify."

By combining granular access controls with detailed activity logging, Cloudflare provides a comprehensive security solution for protecting and monitoring access to critical resources in a Zero Trust methodology.

Successful ZTNA implementation is about more than just technical configuration — it requires careful consideration of your organization's specific needs, user workflows, and security requirements. Cloudflare's flexibility allows you to start with basic secure access policies, then evolve them as your organization's needs change and security requirements mature. By following the principles and practices outlined in this guide, you can create a robust security posture that protects you as precisely and transparently as possible.

If you are interested in learning more about ZTNA, SASE, or other aspects of the Cloudflare One platform, please visit our [reference architecture library](https://developers.cloudflare.com/reference-architecture/) or our [developer docs](https://developers.cloudflare.com/) to get started.

* [Cloudflare SASE reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/)
* [Using Cloudflare SASE with Microsoft](https://developers.cloudflare.com/reference-architecture/architectures/cloudflare-sase-with-microsoft/)
* [How to deploy Cloudflare ZTNA](https://developers.cloudflare.com/learning-paths/clientless-access/concepts/)

<page>
---
title: Extend Cloudflare's benefits to SaaS providers' end-customers ·
  Cloudflare Reference Architecture docs
description: Learn how to use Cloudflare to extend performance, security, and
  data localization to your end users.
lastUpdated: 2025-10-21T14:33:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/design-guides/extending-cloudflares-benefits-to-saas-providers-end-customers/
  md: https://developers.cloudflare.com/reference-architecture/design-guides/extending-cloudflares-benefits-to-saas-providers-end-customers/index.md
---

A key aspect of developing a Software-as-a-service (SaaS) application is ensuring its security against the wide array of potential attacks it faces on the Internet. Cloudflare's network and security services can be used to protect your customers using your SaaS application, off-loading the risk to a vendor with experience in [protecting applications](https://radar.cloudflare.com/reports/ddos).

This design guide illustrates how providers, building and hosting their own product/application offering, can leverage Cloudflare to extend the security, performance, and compliance benefits of Cloudflare's network to their end-customers.

The following diagrams visualize the use of the following services:

* Data Localization Suite (specifically, [Regional Services](https://developers.cloudflare.com/data-localization/regional-services/))
* [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/)
* [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) to securely expose web applications (with [public hostnames](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) and [private networks](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/))
* Load Balancers to manage traffic and ensure reliability and performance, implementing Global Traffic Management (GTM) and [Private Network Load Balancing](https://developers.cloudflare.com/load-balancing/private-network/).

This setup is ideal for SaaS providers who need to ensure minimal downtime, auto-renewal of SSL/TLS certificates, efficiently distribute traffic to healthy endpoints, and regional traffic management for compliance and performance optimization.

This document assumes that the provider's application DNS is registered and managed through Cloudflare as the primary and authoritative DNS provider. You can find details on how to set this up in the [Cloudflare DNS Zone Setup Guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/).

This solution supports subdomains under your own zone while also allowing your customers to use their own domain names (vanity or custom domains) with your services. For example, for each customer you may create the custom hostname `mycustomer.myappexample.com` but also want to allow them to use their own domain, `app.mycustomerexample.com` to point to their tenant on your service. Each subdomain (`mycustomer.myappexample.com`) can be created on the main domain (`myappexample.com`) through the [Cloudflare API](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records), allowing you to easily automate the creation of DNS records when your customers create an account on your service.

Before looking at how Cloudflare can be configured to protect your SaaS application through your custom hostnames, it's worth reviewing the benefits of taking this approach.

| Benefit | Description |
| - | - |
| Minimized Downtime | Ensure [minimal downtime](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/issue-and-validate/validate-certificates/#minimize-downtime) not only during custom hostname migrations to Cloudflare for SaaS but also throughout the entire lifecycle of the application. |
| Security and Performance | Extends Cloudflare's [security](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/waf-for-saas/) and [performance](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/performance/) benefits to end-customers through their custom domains. |
| Auto-Renewal | Automates the [renewal](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/issue-and-validate/renew-certificates/) and management process for custom hostname certificates. |
| Apex Proxying | Supports end-customers using [domain apex](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/realtime-validation/#apex-proxying) (otherwise known as root domain) as custom hostnames. Used where your DNS service doesn't allow [CNAMEs for root domains](https://developers.cloudflare.com/dns/cname-flattening/), instead a [static IP](https://developers.cloudflare.com/byoip/address-maps/#static-ips-or-byoip) is used to allow an A record to be used. |
| Smart Load Balancing | Use the load balancer as [custom origins](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/custom-origin/) to steer traffic with [session affinity](https://developers.cloudflare.com/load-balancing/understand-basics/session-affinity/). In the context of Cloudflare for SaaS, a custom origin lets you send traffic from one or more custom hostnames to somewhere besides your default proxy fallback origin. |
| Orange-to-Orange (O2O) | For end-customers who already proxy traffic through Cloudflare, [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/) may be required. Generally, it's recommended for those end-customers to [not proxy](https://developers.cloudflare.com/dns/proxy-status/#dns-only-records) the hostnames used by the SaaS provider. If the Orange-to-Orange functionality is required, please review the [product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/). |
| Regional Services | Allows [regional traffic management](https://developers.cloudflare.com/data-localization/regional-services/) to comply with data localization requirements. |

## Products included in this guide

The following products are used to deliver this solution.

| Product | Function |
| - | - |
| [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/) | Extends the security and performance benefits of Cloudflare’s network to your customers through their own custom or vanity domains. This includes [Certificate Management](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/), [WAF for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/waf-for-saas/), [Early Hints for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/performance/early-hints-for-saas/) and [Cache for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/performance/cache-for-saas/). |
| [DDoS Protection](https://developers.cloudflare.com/ddos-protection/) | Volumetric attack protection is automatically enabled for [proxied](https://developers.cloudflare.com/dns/proxy-status/) hostnames. |
| [Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) (part of the Data Localization Suite) | Restrict inspection of data (processing) to only those data centers within jurisdictional boundaries. |
| [Load Balancer](https://developers.cloudflare.com/load-balancing/) | Distributes traffic across your endpoints, which reduces endpoint strain and latency and improves the experience for end users. |
| [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) | Secure method to connect to customers' networks and servers without creating holes in [firewalls](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/). cloudflared is the daemon (software) installed on origin servers to create a secure tunnel from applications back to Cloudflare. |

## Cloudflare for SaaS examples

The primary objective of using Cloudflare is to ensure that all requests to your application's custom hostname are routed through Cloudflare's security and performance services first to apply security controls and routing or load balancing of traffic. Since the origin server often needs to be publicly accessible, securing the connection between Cloudflare and the origin server is crucial. For comprehensive guidance on securing origin servers, please refer to Cloudflare's documentation: [Protect your origin server](https://developers.cloudflare.com/fundamentals/security/protect-your-origin-server/).

The diagrams below begin by illustrating the simplest approach to achieving this goal, followed by more complex configurations.

### Standard fallback origin setup

This standard Cloudflare for SaaS setup is the most commonly used and easiest to implement for most providers. Typically, these providers are SaaS companies, which develop and deliver software as a service solutions. This setup requires only a single DNS record to direct requests to Cloudflare, which then proxies the traffic to your application using an A record.

![Figure 1: Standard fallback origin setup.](https://developers.cloudflare.com/_astro/standard-fallback-origin-setup.DrGJNOUB_Z1el3om.svg)

1. The custom hostname (`custom.example.com`) is configured as a CNAME record pointing to the fallback origin of the provider. The fallback origin is the server or servers that Cloudflare will route traffic to by default when a request is made to the custom hostname. This DNS record does not need to be managed within Cloudflare; it just needs to point to the Cloudflare-hosted record from the provider (`fallback.myappexample.com`).
2. The Fallback Origin is set up as an A record that points to the public IP address of the origin server. Cloudflare will route traffic sent to the custom hostnames to this origin server by default.

The origin server receives the details of the custom domain through either the [host header or SNI](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/connection-details/). This enables the origin server to determine which application to direct the request to. This method is applicable for both custom hostnames (for example, `app.mycustomerexample.com`) and vanity domains (for example, `customer1.myappexample.com`). Since all requests for your application are now routed through the Cloudflare network, you can leverage a range of security and performance services for every request, including:

* [Web Application Firewall](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/waf-for-saas/)
* [Access control policies](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/secure-with-access/)
* [Caching of application content](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/performance/cache-for-saas/)
* [Support browser early hints](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/performance/early-hints-for-saas/)
* [Image Transformations](https://developers.cloudflare.com/images/)
* [Waiting Room](https://developers.cloudflare.com/waiting-room/)
* [Workers for Platform](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/)

For implementation details to get started, review the [developer documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/).

### Standard fallback origin setup with regional services

This approach introduces using Cloudflare's [Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) solution to regionalize TLS termination and HTTP processing to confirm with any compliance regulations that dictate your service process data in specific geographic locations. This ensures that traffic destined for the origin server is handled exclusively within the chosen region.

![Figure 2: Standard fallback origin setup with regional services.](https://developers.cloudflare.com/_astro/standard-fallback-origin-setup-regional-services.DgKfyYv8_29Ja7E.svg)

1. The custom hostname (`custom.example.com`) is configured as a CNAME record that points to a regionalized SaaS hostname (`eu-customers.myappexample.com`). This configuration ensures that all processing, including TLS termination, occurs exclusively within the specified geographic region.
2. The regionalized SaaS hostname is set up as a CNAME record that directs traffic to the standard [Fallback Origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#1-create-fallback-origin) of the SaaS provider (`fallback.myappexample.com`).
3. The fallback origin is set up as an A record that points to the public IP address of the origin server. Cloudflare will route traffic sent to the custom hostnames to this origin server by default.

### Cloudflare Tunnel as fallback origin setup with regional services

For enhanced security, rather than exposing your application servers directly to the Internet via public IPs, SaaS providers can use [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/). These tunnels connect your network to Cloudflare's nearest data centers, allowing SaaS applications to be accessed through [public hostnames](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/). As a result, Cloudflare becomes the sole entry point for end-customers from the public Internet into your application network.

![Figure 3: Cloudflare Tunnel as Fallback Origin Setup with Regional Services.](https://developers.cloudflare.com/_astro/cloudflare-tunnel-fallback-origin-setup-regional-services.h18fhKDd_Z1RlVxB.svg)

1. The custom hostname (`custom.example.com`) is configured as a CNAME record that points to a regionalized SaaS hostname (`eu-customers.myappexample.com`). This configuration ensures that all processing, including TLS termination, occurs exclusively within the specified geographic region.
2. The regionalized SaaS hostname is set up as a CNAME record that directs traffic to the standard [Fallback Origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#1-create-fallback-origin) of the SaaS provider (`fallback.myappexample.com`).
3. The fallback origin is a CNAME DNS record that points to a [public hostname](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) exposed by Cloudflare Tunnel. This public hostname should be configured to route traffic to your application, for example, `localhost:8080`.

This setup is ideal for SaaS providers that do not need granular load balancing, such as [geo-based traffic steering](https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/), across multiple origin servers. It's also well-suited for simple testing and development environments, where [protecting your origin server](https://developers.cloudflare.com/fundamentals/security/protect-your-origin-server/) by only allowing requests through the Cloudflare Tunnel is sufficient. However, for distributed applications requiring load balancing at both global and local levels, we recommend using [Cloudflare's Load Balancer](https://developers.cloudflare.com/load-balancing/) with global and private network load balancing capabilities.

### Global Traffic Management (GTM) & Private Network Load Balancing as custom origin setup

Cloudflare offers a powerful set of load balancing capabilities. These allow you to reliably steer traffic to different origin servers where your SaaS applications are hosted, whether through public hostnames (as described above) or private IP addresses. This setup helps prevent origin overload by distributing traffic across multiple servers and enhances security by only permitting requests through the Cloudflare Tunnel.

![Figure 4: Global Traffic Management (GTM) & Private Network Load Balancing as custom origin setup.](https://developers.cloudflare.com/_astro/gtm-ltm-custom-origin-setup.C_l8lMsz_2p0TxJ.svg)

1. The custom hostname (`custom.example.com`) is configured as a CNAME record pointing to a Cloudflare [regionalized Load Balancer](https://developers.cloudflare.com/data-localization/how-to/load-balancing/) (`eu-lb.myappexample.com`). This ensures that all processing, including TLS termination, takes place within a specified geographic region. Additionally, the SaaS provider needs to set up the load balancer as the [custom origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/custom-origin/) for the custom hostname.

2. The regional load balancer is set up with [origin pools](https://developers.cloudflare.com/load-balancing/pools/) to distribute requests across multiple downstream servers. Each pool can be configured to use either [public hostnames](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) with Global Traffic Management (GTM) or [private network](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/) addresses with Private Network Load Balancing. In the diagram above, we utilize both options:

* Origin pool 1 uses the [Cloudflare Tunnel hostname](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/dns/) (`<UUID>.cfargotunnel.com`) as the endpoint or origin server for handling those requests. When using a public hostname, it is necessary to set the [HTTP host header value](https://developers.cloudflare.com/load-balancing/additional-options/override-http-host-headers/) to match the public hostname configured and exposed by the [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/). This ensures that the origin server can correctly route the incoming requests.
   * Origin pool 2 uses the private IP address or private network (that is, `10.0.0.5`) within the SaaS provider's internal network, where the SaaS application resides. This pool must be configured to operate within the specified [virtual network](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/cloudflared/tunnel-virtual-networks/) to ensure proper routing of requests.

3. Cloudflare Tunnel exposes both [public hostnames](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) with GTM and [private networks](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/) (private IPs) with Private Network Load Balancing.

For enhanced granularity in application serving and scalability, it is generally recommended to use private networks rather than public hostnames. Private networks enable Cloudflare to preserve and accurately pass the host header to the origin server. In contrast, when using public hostnames, providers must configure the [header value](https://developers.cloudflare.com/load-balancing/additional-options/override-http-host-headers/) on the load balancer, which is restricted to one public hostname per load balancer endpoint, potentially limiting flexibility.

Be aware of the Zero Trust [Tunnel limitations](https://developers.cloudflare.com/cloudflare-one/account-limits/#cloudflare-tunnel), Cloudflare for SaaS [connection request details](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/connection-details/), and the Custom Origin [SNI specification](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/custom-origin/#sni-rewrites). For further information about the Cloudflare Load Balancer, review its [reference architecture](https://developers.cloudflare.com/reference-architecture/architectures/load-balancing/).

As a SaaS provider, it is advisable to automate most, if not all, of these processes using [APIs](https://developers.cloudflare.com/fundamentals/api/), [SDKs](https://developers.cloudflare.com/fundamentals/api/reference/sdks/), scripts, [Terraform](https://developers.cloudflare.com/terraform/), or other automation tools.

An example of a high-level migration plan can be [downloaded here](https://developers.cloudflare.com/reference-architecture/static/example-cloudflare-saas-migration-plan.pdf).

It is highly recommended to migrate to Cloudflare for SaaS in phases and address any issues as they arise, particularly with [Domain Control Validation (DCV)](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/troubleshooting/). Be sure to review the [validation status](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/validation-status/) and relevant [documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/) during the process.

By leveraging Cloudflare's infrastructure, SaaS providers can deliver secure, reliable, and performance services to their end-customers. This ensures a seamless and secure user experience while meeting compliance requirements, such as regionalization.

Several Cloudflare customers are currently using the Cloudflare for SaaS solution (formerly known as SSL for SaaS). Notable public use cases include:

* [Shopify](https://www.cloudflare.com/case-studies/shopify/)
* [Porsche Informatik](https://www.cloudflare.com/case-studies/porsche-informatik/)
* [Divio](https://www.cloudflare.com/case-studies/divio/)
* [mogenius](https://www.cloudflare.com/case-studies/mogenius/)
* [Quickbutik](https://www.cloudflare.com/case-studies/quickbutik/)

Additionally, when migrating to Cloudflare for SaaS, it is crucial to have a runbook and clear public documentation to communicate relevant details to your end-customers. Excellent public examples of this are the [Salesforce CDN](https://help.salesforce.com/s/articleView?id=sf.community_builder_cdn.htm\&type=5) and [Shopify](https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains) documentation.

<page>
---
title: Leveraging Cloudflare for your SaaS applications · Cloudflare Reference
  Architecture docs
description: This document provides a reference and guidance for using
  Cloudflare for Platforms. It is designed for SaaS application owners,
  engineers, or architects who want to learn how to make their application more
  scalable and secure.
lastUpdated: 2025-12-29T17:29:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/reference-architecture/design-guides/leveraging-cloudflare-for-your-saas-applications/
  md: https://developers.cloudflare.com/reference-architecture/design-guides/leveraging-cloudflare-for-your-saas-applications/index.md
---

When building a SaaS application, it is common to create unique hostnames for each customer account (or tenant), for example `app.customer.com`. It is important to ensure that all communication to this application hostname is done using SSL/TLS and therefore a certificate must be created for your customer's hostname on your application. Certificate management is hard, and often application architects and developers would use a [multi-domain certificate](https://www.cloudflare.com/learning/ssl/types-of-ssl-certificates/) (MDC), so they can buy and add just one certificate that has hundreds of domains listed. However, this does not scale well when your application reaches thousands and millions of customers.

Also, a customer of your application might wish to have their main website domain hosted directly on your application. So that, for example, `www.customer.com` is actually delivering content directly from your SaaS application.

Many SaaS applications have caching and security solutions, such as Cloudflare, in front of their applications and as such need to onboard these hostnames. This is often done using a "Zone" model, where inside Cloudflare, or another vendor such as AWS Cloudfront, a "Zone" is created for `app.customer.com`. This means that, as each new customer is onboarded, a new "Zone" must be created - this might be manageable in the tens and hundreds of customers but, when you get to thousands and millions, management of all these zones and their configurations is hard.

Cloudflare for Platforms extends far beyond this traditional model of most edge providers, by managing traffic across many hostnames and domains in one "Zone". You can now manage `www.customer1.com` and `www.customer2.net`, and millions more hostnames, through the same configuration while also customizing features as needed.

This document provides a reference and guidance for using Cloudflare for Platforms. The document is split into three main sections.

* Overview of the SaaS model and the common challenges Cloudflare for Platforms solves
* SSL certificate issuance in a SaaS model
* Customizing the experience for each of your clients

### Who is this document for and what will you learn?

This reference architecture is designed for SaaS application owners, engineers, or architects who want to learn how to make their application more scalable and secure through Cloudflare.

To build a stronger baseline understanding of Cloudflare, we recommend the following resources:

* What is Cloudflare? | [Website](https://www.cloudflare.com/what-is-cloudflare/) (5 minute read) or [video](https://www.youtube.com/watch?v=XHvmX3FhTwU) (2 minutes)
* [Cloudflare Ruleset Engine](https://developers.cloudflare.com/ruleset-engine/) - We will discuss integrations with the ruleset engine. Familiarity with that feature will be helpful.
* [Cloudflare Workers](https://developers.cloudflare.com/workers/) - We will also discuss integrations with Cloudflare Workers, our serverless application platform. A basic familiarity with this platform will be helpful.

Those who read this reference architecture will learn:

* How Cloudflare's unique offering can solve key challenges for SaaS applications
* How to customize the Cloudflare experience for each of your end customers
* Tools to integrate serverless applications, for each of your clients, through Workers for Platforms

## Why Cloudflare for Platforms?

Software as a Service (SaaS) has been a key innovation of the cloud computing era. On premises managed legacy enterprise software - such as accounting, HR, and CRMs - required dedicated attention from IT personnel to establish a platform (whether dedicated hardware, VMs, or cloud instances) for each application in the enterprise. The SaaS model allows providers, like Shopify and Salesforce, to extend their own platform to their customers instead. Now, the customer does not have to provision hardware or consider any other infrastructure concerns; instead, they subscribe to access to the SaaS platform which is always up to date, secure and available.

### Third party hostname challenges

For many SaaS applications, it is important to provide a service under the client's own domain. Their domain is important for branding, security, and organization; and many clients have heavily invested in the right `.com` to represent their business. Many clients with domains linked to their brand will push back against deploying their applications on the provider's domain.

This is especially true for customer-facing applications like an e-commerce solution. You would want to expose this as `shop.example.com`, not `example.shop.com`. To secure traffic to the SaaS application, the provider ("shop") needs a certificate for their customer, `example.com`.

![Figure 1: eCommerce flow through a SaaS platform.](https://developers.cloudflare.com/_astro/figure1.T_DPd5f7_USkI4.svg)

This is a challenge for SaaS solutions, as certificate issuance is tightly controlled through the [DCV Validation process](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/dcv-flow/). The owner of a domain needs to authorize any certificates, and traditional methods of validation are driven by the domain owner and deliver the certificate only to them.

![Figure 2: Certificates cannot be automatically renewed on legacy platforms. They will expire and break traffic without manual action.](https://developers.cloudflare.com/_astro/figure2.BYh8B09n_Z2iz2dA.svg)

This poses a dilemma: the SaaS model offers clear advantages but introduces a new challenge of its own. A novel solution would let providers and end customers both get the most out of the SaaS model.

## Issuing SSL certificates through Cloudflare for Platforms

### Manage certificates for any hostname on the Internet

Cloudflare for SaaS provides a unique solution to these common challenges for SaaS providers. By leveraging Cloudflare's position as a low-latency, global network, we can transparently manage certificate issuance for end clients while also providing several other benefits to a SaaS platform.

### Secure and powerful validation modes

Cloudflare has a unique ability to manage the Domain Control Validation (DCV) process in a SaaS scenario. In a traditional model, certificate issuers ask domain owners to place a [particular token](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/dcv-flow/#dcv-tokens) (either a DNS TXT record or a small text file) at their origin in order to validate that they are authorized for that domain. This has to be done repeatedly at certificate renewal, which has become more common with recent security improvements.

![Figure 3: The DCV process.](https://developers.cloudflare.com/_astro/figure3.DZ4GG0vx_Z1s3EeY.svg)

Since Cloudflare's network can easily sit in between the client and the SaaS provider, we can automatically respond with the correct DCV token on behalf of any domain that points traffic to the SaaS provider on Cloudflare.

![Figure 4: Certificates automatically renew on Cloudflare-enabled platforms.](https://developers.cloudflare.com/_astro/figure4.TeeqPEfC_vBp7j.svg)

Instead of repeatedly performing a complex process at every certificate renewal, the client performs a much simpler process only once.

**Examples:**

Example 1 (unknown):
```unknown
Install the required Python dependency and run the script:
```

Example 2 (unknown):
```unknown
## 5. Query the data with R2 SQL

Now you can analyze your fraud detection data using R2 SQL. Here are some example queries:

### 5.1. View recent transactions
```

Example 3 (unknown):
```unknown
### 5.2. Filter the raw transactions into a new table to highlight high-value transactions

Create a new sink that will write the filtered data to a new Apache Iceberg table in R2 Data Catalog:
```

Example 4 (unknown):
```unknown
Now you will create a new SQL query to process data from the original `raw_events_stream` stream and only write flagged transactions that are over the `amount` of 1,000.
```

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
plaintext
<value>._domainkey.example.com CNAME <hostname>.<service provider domain>
txt
NS records with that host already exist. (Code:81056)
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
  curl "https://api.cloudflare.com/client/v4/zones" \
    --request POST \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "name": "<YOUR_DOMAIN>",
      "account": {
          "id": "<YOUR_ACCOUNT_ID>"
      }
    }'
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID" \
    --request GET \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  txt
*macOS/Linux*

whois <DOMAIN_NAME>
dig ns <DOMAIN_NAME> @1.1.1.1
dig ns <DOMAIN_NAME> @8.8.8.8
dig <DOMAIN_NAME> +trace

nslookup -type=ns <DOMAIN_NAME> 1.1.1.1
nslookup -type=ns <DOMAIN_NAME> 8.8.8.8
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

## Example of overriding settings on a per-user basis

**URL:** llms-txt#example-of-overriding-settings-on-a-per-user-basis

---

## Step 1: Create a new version with updated settings (doesn't affect live traffic)

**URL:** llms-txt#step-1:-create-a-new-version-with-updated-settings-(doesn't-affect-live-traffic)

POST /workers/workers/{id}/versions
{
  "compatibility_date": "$today",
  "bindings": [
    {
      "name": "MY_NEW_ENV_VAR",
      "text": "new_value",
      "type": "plain_text"
    }
  ],
  "modules": [...]
}

---

## Configuration file is stored at:

**URL:** llms-txt#configuration-file-is-stored-at:

---

## R2 Configuration

**URL:** llms-txt#r2-configuration

fs.native-s3.enabled=true
s3.region=auto
s3.aws-access-key=<Your R2 access key>
s3.aws-secret-key=<Your R2 secret>
s3.endpoint=<Your R2 endpoint>
s3.path-style-access=true

---

## Worker settings (the parent resource)

**URL:** llms-txt#worker-settings-(the-parent-resource)

PUT /workers/workers/{id}
{
  "name": "payment-service",
  "tags": ["production"],
  "logpush": true,
}
sh

**Examples:**

Example 1 (unknown):
```unknown

```

---

## Build Spark session with Iceberg configurations

**URL:** llms-txt#build-spark-session-with-iceberg-configurations

spark = SparkSession.builder \
  .appName("R2DataCatalogExample") \
  .config('spark.jars.packages', 'org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.6.1,org.apache.iceberg:iceberg-aws-bundle:1.6.1') \
  .config("spark.sql.extensions", "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions") \
  .config("spark.sql.catalog.my_catalog", "org.apache.iceberg.spark.SparkCatalog") \
  .config("spark.sql.catalog.my_catalog.type", "rest") \
  .config("spark.sql.catalog.my_catalog.uri", CATALOG_URI) \
  .config("spark.sql.catalog.my_catalog.warehouse", WAREHOUSE) \
  .config("spark.sql.catalog.my_catalog.token", TOKEN) \
  .config("spark.sql.catalog.my_catalog.header.X-Iceberg-Access-Delegation", "vended-credentials") \
  .config("spark.sql.catalog.my_catalog.s3.remote-signing-enabled", "false") \
  .config("spark.sql.defaultCatalog", "my_catalog") \
  .getOrCreate()
spark.sql("USE my_catalog")

---

## Version settings (the "code")

**URL:** llms-txt#version-settings-(the-"code")

POST /workers/workers/{id}/versions
{
  "compatibility_date": "$today",
  "bindings": [...],
  "modules": [...]
}
sh

**Examples:**

Example 1 (unknown):
```unknown
#### `/workers` API endpoints now support UUIDs (in addition to names)

The `/workers/workers/` path now supports addressing a Worker by both its immutable UUID and its mutable name.
```

---

## This is the sshd server system-wide configuration file.  See

**URL:** llms-txt#this-is-the-sshd-server-system-wide-configuration-file.--see

---

## configuration must be re-generated after changing Port, AddressFamily, or

**URL:** llms-txt#configuration-must-be-re-generated-after-changing-port,-addressfamily,-or

---

## Next time you run wrangler deploy, this will use the configuration in your newly generated wrangler.jsonc file

**URL:** llms-txt#next-time-you-run-wrangler-deploy,-this-will-use-the-configuration-in-your-newly-generated-wrangler.jsonc-file

* You must use Wrangler version 4.24.4 or later in order to use this feature

<page>
---
title: WARP client for macOS (version 2025.7.106.1) · Changelog
description: WARP client for macOS (version 2025.7.106.1)
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/changelog/2025-09-10-warp-macos-beta/
  md: https://developers.cloudflare.com/changelog/2025-09-10-warp-macos-beta/index.md
---

---

## R2 Data Catalog Configuration

**URL:** llms-txt#r2-data-catalog-configuration

**Contents:**
- Example usage

iceberg.catalog.type=rest
iceberg.rest-catalog.uri=<Your R2 Data Catalog URI>
iceberg.rest-catalog.warehouse=<Your R2 Data Catalog warehouse>
iceberg.rest-catalog.security=OAUTH2
iceberg.rest-catalog.oauth2.token=<Your R2 authentication token>
bash
   # Create a local directory for the catalog configuration
   mkdir -p trino-catalog

# Place your r2.properties file in the catalog directory
   cp r2.properties trino-catalog/

# Run Trino with the catalog configuration
   docker run -d \
     --name trino-r2 \
     -p 8080:8080 \
     -v $(pwd)/trino-catalog:/etc/trino/catalog \
     trinodb/trino:latest
   bash
   # Connect to the Trino CLI
   docker exec -it trino-r2 trino
   sql
   -- Show all schemas in the R2 catalog
   SHOW SCHEMAS IN r2;

-- Show all schemas in the R2 catalog
   CREATE SCHEMA r2.example_schema

-- Create a table with some values in it
   CREATE TABLE r2.example_schema.yearly_clicks (
       year,
       clicks
   )
   WITH (
      partitioning = ARRAY['year']
   )
   AS VALUES
       (2021, 10000),
       (2022, 20000);

-- Show tables in a specific schema
   SHOW TABLES IN r2.example_schema;

-- Query your Iceberg table
   SELECT * FROM r2.example_schema.yearly_clicks;
   shell
aws configure
sh
AWS Access Key ID [None]: <ACCESS_KEY_ID>
AWS Secret Access Key [None]: <SECRET_ACCESS_KEY>
Default region name [None]: auto
Default output format [None]: json
sh

**Examples:**

Example 1 (unknown):
```unknown
## Example usage

1. Start Trino with the R2 catalog configuration:
```

Example 2 (unknown):
```unknown
2. Connect to Trino and query your R2 Data Catalog:
```

Example 3 (unknown):
```unknown
3. In the Trino CLI, run the following commands:
```

Example 4 (unknown):
```unknown
</page>

<page>
---
title: aws CLI · Cloudflare R2 docs
description: You must generate an Access Key before getting started. All
  examples will utilize access_key_id and access_key_secret variables which
  represent the Access Key ID and Secret Access Key values you generated.
lastUpdated: 2025-12-02T15:31:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/examples/aws/aws-cli/
  md: https://developers.cloudflare.com/r2/examples/aws/aws-cli/index.md
---

You must [generate an Access Key](https://developers.cloudflare.com/r2/api/tokens/) before getting started. All examples will utilize `access_key_id` and `access_key_secret` variables which represent the **Access Key ID** and **Secret Access Key** values you generated.



With the [`aws`](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) CLI installed, you may run [`aws configure`](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) to configure a new profile. You will be prompted with a series of questions for the new profile's details.
```

---

## Disable a couple of Cloudflare settings for API requests

**URL:** llms-txt#disable-a-couple-of-cloudflare-settings-for-api-requests

**Contents:**
- Additional resources
- For Error Pages
- For Custom Error Assets, inline responses, and Error Pages
- Custom error rules
  - Response type
  - Response code
  - Asset
  - JSON response / HTML response / Text response / XML response
- Custom error assets
  - Asset name

resource "cloudflare_ruleset" "http_config_rules_example" {
  zone_id     = "<ZONE_ID>"
  name        = "Config rules ruleset"
  description = "Set configuration rules for incoming requests"
  kind        = "zone"
  phase       = "http_config_settings"

rules {
    ref         = "disable_obfuscation_bic"
    description = "Disable email obfuscation and BIC for API requests"
    expression  = "(http.request.uri.path matches \"^/api/\")"
    action      = "set_config"
    action_parameters {
      email_obfuscation = false
      bic               = false
    }
  }
}
html
<meta name="referrer" (...) />
txt
  (starts_with(http.request.uri.path, "/hr-app/"))
  txt
  hr-server.example.com
  txt
  hr-server.example.com
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID" \
    --request PUT \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "rules": [
          {
              "ref": "hr_app_overrides",
              "expression": "starts_with(http.request.uri.path, \"/hr-app/\")",
              "description": "Origin rule for the company HR application",
              "action": "route",
              "action_parameters": {
                  "host_header": "hr-server.example.com",
                  "origin": {
                      "host": "hr-server.example.com"
                  }
              }
          }
      ]
    }'
  json
  {
    "result": {
      "id": "<RULESET_ID>",
      "name": "Origin Rules ruleset",
      "description": "Zone-level ruleset that will execute origin rules.",
      "kind": "zone",
      "version": "2",
      "rules": [
        {
          "ref": "hr_app_overrides",
          "id": "<RULE_ID>",
          "version": "1",
          "action": "route",
          "action_parameters": {
            "host_header": "hr-server.example.com",
            "origin": {
              "host": "hr-server.example.com"
            }
          },
          "expression": "starts_with(http.request.uri.path, \"/hr-app/\")",
          "description": "Origin rule for the company HR application",
          "last_updated": "2022-06-03T14:42:04.219025Z",
          "ref": "<RULE_REF>"
        }
      ],
      "last_updated": "2022-06-03T14:42:04.219025Z",
      "phase": "http_request_origin"
    },
    "success": true,
    "errors": [],
    "messages": []
  }
  txt
  starts_with(http.request.uri.path, "/team/calendar/")
  txt
  8081
  bash
  curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID" \
    --request PUT \
    --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --json '{
      "rules": [
          {
              "ref": "calendar_app_change_port",
              "expression": "starts_with(http.request.uri.path, \"/team/calendar/\")",
              "description": "Origin rule for the team calendar application",
              "action": "route",
              "action_parameters": {
                  "origin": {
                      "port": 8081
                  }
              }
          }
      ]
    }'
  json
  {
    "result": {
      "id": "<RULESET_ID>",
      "name": "Origin Rules ruleset",
      "description": "Zone-level ruleset that will execute origin rules.",
      "kind": "zone",
      "version": "2",
      "rules": [
        {
          "ref": "calendar_app_change_port",
          "id": "<RULE_ID>",
          "version": "1",
          "action": "route",
          "action_parameters": {
            "origin": {
              "port": 8081
            }
          },
          "expression": "starts_with(http.request.uri.path, \"/team/calendar/\")",
          "description": "Origin rule for the team calendar application",
          "last_updated": "2022-06-03T14:42:04.219025Z",
          "ref": "<RULE_REF>"
        }
      ],
      "last_updated": "2022-06-03T14:42:04.219025Z",
      "phase": "http_request_origin"
    },
    "success": true,
    "errors": [],
    "messages": []
  }
  tf

**Examples:**

Example 1 (unknown):
```unknown
Use the `ref` field to get stable rule IDs across updates when using Terraform. Adding this field prevents Terraform from recreating the rule on changes. For more information, refer to [Troubleshooting](https://developers.cloudflare.com/terraform/troubleshooting/rule-id-changes/#how-to-keep-the-same-rule-id-between-modifications) in the Terraform documentation.

## Additional resources

For additional guidance on using Terraform with Cloudflare, refer to the following resources:

* [Terraform documentation](https://developers.cloudflare.com/terraform/)
* [Cloudflare Provider for Terraform](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs) (reference documentation)

</page>

<page>
---
title: Error page types · Cloudflare Rules docs
description: "The following error page types will only be shown in the
  Cloudflare dashboard if you have customized their error pages in the past:"
lastUpdated: 2025-06-04T08:56:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/rules/custom-errors/reference/error-page-types/
  md: https://developers.cloudflare.com/rules/custom-errors/reference/error-page-types/index.md
---

| Page type | Description | API identifier |
| - | - | - |
| WAF block | The page displayed when visitors are blocked by a [Web Application Firewall](https://developers.cloudflare.com/waf/) rule. This page returns a `403` status code. | `waf_block` |
| IP/Country block | The page displayed when a request originates from a [blocked IP address or country](https://developers.cloudflare.com/waf/tools/ip-access-rules/). This page returns a `403` status code. | `ip_block` |
| IP/Country challenge | Presents a challenge to visitors from specified IP addresses or countries. This page returns a `403` status code. For more information, refer to [IP Access rules](https://developers.cloudflare.com/waf/tools/ip-access-rules/). | `country_challenge` |
| 500 class errors | 500 class error pages are displayed when a web server is unable to process a request. For more information, refer to [Cloudflare 5XX errors](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/). | `500_errors` |
| 1000 class errors | 1000 class error pages are displayed when a domain’s configuration, security settings, or origin setup prevents Cloudflare from completing a request. For more information, refer to [Cloudflare 1XXX errors](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/). | `1000_errors` |
| Managed challenge / I'm Under Attack Mode | Presents different types of challenges to a visitor depending on the nature of their request and your security settings. This page returns a `403` status code. For more information, refer to [Under Attack mode](https://developers.cloudflare.com/fundamentals/reference/under-attack-mode/). | `managed_challenge` |
| Rate limiting block | Displayed to visitors when they have been blocked by a [rate limiting rule](https://developers.cloudflare.com/waf/rate-limiting-rules/). This page returns a `429` status code. | `ratelimit_block` |

The following error page types will only be shown in the Cloudflare dashboard if you have customized their error pages in the past:

| Page type | API identifier |
| - | - |
| Interactive Challenge | `basic_challenge` |
| JavaScript Challenge | `under_attack` |

These types of challenges are being discouraged in favor of managed challenges. Refer to [Challenge pages](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/) for more information.

</page>

<page>
---
title: Custom error tokens · Cloudflare Rules docs
description: Each custom error token provides diagnostic information or specific
  functionality that appears on the error page. Certain error pages require a
  page-specific custom error token.
lastUpdated: 2025-08-11T18:12:25.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/
  md: https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/index.md
---

## For Error Pages

Each custom error token provides diagnostic information or specific functionality that appears on the error page. Certain error pages require a page-specific custom error token.

To display a custom page for each error, create a separate page per error. For example, to create an error page for both **IP/Country Block** and **Interactive Challenge**, you must design and publish two separate pages.

The following custom error tokens are required by their respective error pages:

| Token | Required for |
| - | - |
| `::CAPTCHA_BOX::` | Interactive Challenge Country Challenge (Managed Challenge) Managed Challenge / I'm Under Attack Mode (Interstitial Page) |
| `::IM_UNDER_ATTACK_BOX::` | Non-Interactive Challenge (JS Challenge) |
| `::CLOUDFLARE_ERROR_500S_BOX::` | 5XX Errors |
| `::CLOUDFLARE_ERROR_1000S_BOX::` | 1XXX Errors |

Each custom error token has a default look and feel. However, you can use CSS to stylize each custom error tag using each tag's class ID. All the external resources like images, CSS, and scripts will be inlined during the process. As such, all external resources need to be available (that is, they must return `200 OK`) otherwise an error will be thrown.

## For Custom Error Assets, inline responses, and Error Pages

A custom error asset, inline response, or error page may also include the following error tokens, which will be replaced with their real values before sending the response to the visitor:

| Token | Description |
| - | - |
| `::CLIENT_IP::` | The visitor's IP address. |
| `::RAY_ID::` | A unique identifier given to every request that goes through Cloudflare. |
| `::GEO::` | The country or region associated with the visitor's IP address. |

</page>

<page>
---
title: Custom Errors parameters · Cloudflare Rules docs
description: "Custom error rules define when a custom error gets triggered and
  the content that is served to visitors. Rule parameters are the following:"
lastUpdated: 2025-11-11T11:19:11.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/rules/custom-errors/reference/parameters/
  md: https://developers.cloudflare.com/rules/custom-errors/reference/parameters/index.md
---

## Custom error rules

[Custom error rules](https://developers.cloudflare.com/rules/custom-errors/#custom-error-rules) define when a custom error gets triggered and the content that is served to visitors. Rule parameters are the following:

### Response type

API name: *N/A* (handled via [`asset_name`](#asset) and [`content_type`](#response) parameters)

The content type of the inline response to send to the website visitor (JSON, HTML, Text, or XML), or **Custom error asset** if sending the content of a custom error asset.

When using the API you must either set the `asset_name` or set both the `content_type` and `content` parameters. Refer to [JSON response / HTML response / Text response / XML response](#response).

### Response code

API name: **`status_code`** Integer Optional

The HTTP status code of the response. If provided, this value will override the current response status code.

The status code must be between `400` and `999`.

### Asset

API name: **`asset_name`** String Optional

The name of the [custom error asset](#custom-error-assets) you previously uploaded (in the dashboard, you can create an asset when creating the rule). The asset may include [error tokens](https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/) that will be replaced with real values before sending the error response to the visitor.

A custom error rule can only reference an asset defined in the same scope as the rule (that is, in the same zone or account).

In the dashboard, this parameter is only available when you select `Custom error asset` in **Response type**.

When using the API, you must provide either the `asset_name` or the `content` parameter.

### JSON response / HTML response / Text response / XML response

API names: **`content`** String Optional and **`content_type`** String Required

The response body to return. It can include [error tokens](https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/) that will be replaced with real values before sending the error response to the visitor.

You must provide either the `asset_name` or the `content` parameter.

The maximum content size is 10 KB.

When using the API you must also set the `content_type` parameter, which defines the content type of the returned response. The value must be one of the following:

* `text/html`
* `text/plain`
* `application/json`
* `text/xml`

Warning

If you create an HTML error response, make sure the `referrer` meta tag is not present in the HTML code since it will disrupt [Cloudflare challenges](https://developers.cloudflare.com/cloudflare-challenges/):
```

Example 2 (unknown):
```unknown
## Custom error assets

A [custom error asset](https://developers.cloudflare.com/rules/custom-errors/#custom-error-assets) corresponds to a web resource such as an HTML web page (including any referenced images, CSS, and JavaScript code) that Cloudflare fetches and saves based on a URL you provide, to be served to visitors as an error page.

Custom error assets have the following parameters:

### Asset name

API name: **`name`** String Required

The name of the custom error asset. Example value: `"500_error_template"`.

An asset name can contain the following characters:

* Uppercase and lowercase letters (`A-Z` and `a-z`)
* Numbers (`0-9`)
* The underscore (`_`) character

The maximum length is 200 characters.

### Description

API name: **`description`** String Optional

A string describing the custom error asset. Example value: `"Standard 5xx error template page"`.

### Asset address

API name: **`url`** String Required

The URL of the page you want Cloudflare to fetch and store, to be served later to visitors as error pages according to the configured [custom error rules](#custom-error-rules). Example value: `"https://example.com/errors/500.html"`.

When you create or update an asset and provide a URL, Cloudflare collects any images, CSS, and JavaScript code used in the page, minifies the content, and saves it internally.

The content of the page at the specified URL may include [error tokens](https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/) that will be replaced with real values before sending the error response to the visitor.

When using the dashboard, you can later trigger another fetch to get the latest version of the page along with its resources, and store it internally.

When using the API, if you update an asset and provide the same URL, Cloudflare will fetch the URL again, along with its resources, and store it internally.

The maximum asset size is 1.5 MB.

</page>

<page>
---
title: Change the HTTP Host header and DNS record · Cloudflare Rules docs
description: Create an origin rule to change the HTTP `Host` header and the
  resolved DNS record.
lastUpdated: 2025-10-13T13:40:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/rules/origin-rules/examples/change-http-host-header/
  md: https://developers.cloudflare.com/rules/origin-rules/examples/change-http-host-header/index.md
---

The following origin rule overrides the HTTP `Host` header to `hr-server.example.com` for all requests with a URI path starting with `/hr-app/`. It also overrides the DNS record to the same hostname.

The `Host` header override only updates the header value; the DNS record override will handle the rerouting of incoming requests. For more information on these overrides, refer to [Available settings](https://developers.cloudflare.com/rules/origin-rules/features/).

* Dashboard

  Expression when using the Expression Builder:

  | Field | Operator | Value |
  | - | - | - |
  | URI Path | starts with | `/hr-app/` |

  Expression when using the Expression Editor:
```

Example 3 (unknown):
```unknown
Value after **Host Header** > **Rewrite to**:
```

Example 4 (unknown):
```unknown
Value after **DNS Record** > **Override to**:
```

---

## ipsec.conf - strongSwan IPsec configuration file

**URL:** llms-txt#ipsec.conf---strongswan-ipsec-configuration-file

config setup
    charondebug="all"
    uniqueids = yes

conn %default
    ikelifetime=24h
    rekey=yes
    reauth=no
    keyexchange=ikev2
    authby=secret
    dpdaction=restart
    closeaction=restart

---

## PasswordAuthentication.  Depending on your PAM configuration,

**URL:** llms-txt#passwordauthentication.--depending-on-your-pam-configuration,

---
