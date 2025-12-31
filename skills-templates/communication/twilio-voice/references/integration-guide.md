# Twilio Voice + AI Integration Guide

Complete guide for integrating Twilio Voice with AI services to build intelligent voice assistants.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Quick Start](#quick-start)
3. [ConversationRelay Deep Dive](#conversationrelay-deep-dive)
4. [AI Service Integration](#ai-service-integration)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### How It Works

```
Phone Call → Twilio → Your Server → AI Service → Response → Twilio → Caller
            ↑                                                         ↓
            └─────────── ConversationRelay WebSocket ────────────────┘
```

### Key Components

1. **Twilio Voice** - Handles telephony (incoming calls, audio)
2. **ConversationRelay** - Bi-directional WebSocket for real-time audio
3. **Your Server** - Orchestrates conversation flow
4. **AI Service** - Generates responses (OpenAI, Langflow, etc.)
5. **ngrok/Tunnel** - Exposes local server for development

### Message Flow

1. **Incoming Call**: Twilio receives call → POSTs to your `/voice` endpoint
2. **TwiML Response**: Your server returns TwiML with ConversationRelay config
3. **WebSocket Connection**: Twilio establishes bidirectional audio stream
4. **Speech-to-Text**: User speech transcribed and sent to your server
5. **AI Processing**: Transcription sent to AI service (OpenAI, Langflow)
6. **Text-to-Speech**: AI response synthesized and streamed to caller
7. **Continuous Loop**: Steps 4-6 repeat throughout conversation
8. **Call End**: WebSocket closes, conversation saved

---

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install twilio express dotenv openai ws

# Install ngrok for local development
npm install -g ngrok

# Or use Homebrew on macOS
brew install ngrok
```

### Minimal Working Example

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook: Handle incoming calls
app.post('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const connect = twiml.connect();

  connect.conversationRelay({
    url: `wss://${process.env.NGROK_URL.replace('https://', '')}/ws`,
    voice: 'Polly.Joanna',
    language: 'en-US'
  });

  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Setup Steps

1. **Create Twilio Account**: Sign up at https://www.twilio.com
2. **Get Phone Number**: Buy a voice-enabled number
3. **Enable ConversationRelay**: In Twilio Console → Voice → Settings
4. **Start ngrok**: `ngrok http 3000`
5. **Configure Webhook**: Set phone number webhook to `https://your-url.ngrok.io/voice`
6. **Call Your Number**: Test the integration

---

## ConversationRelay Deep Dive

### Configuration Options

```javascript
connect.conversationRelay({
  // Required
  url: 'wss://your-server.com/websocket',  // Your WebSocket endpoint

  // Audio Settings
  voice: 'Polly.Joanna',             // AWS Polly voice name
  language: 'en-US',                 // Language code
  ttsSampleRate: '24000',            // Audio quality: 8000, 16000, 24000

  // Transcription
  transcriptionProvider: 'deepgram', // or 'google'

  // Advanced
  dtmfDetection: false,              // Detect touch-tone inputs
  debug: true                        // Enable debug logging
});
```

### WebSocket Events

```javascript
ws.on('message', (message) => {
  const data = JSON.parse(message);

  switch(data.event) {
    case 'start':
      // Session initiated
      console.log('Call started:', data.callSid);
      break;

    case 'transcription':
      // User spoke
      console.log('User said:', data.text);
      // Send to AI for processing
      break;

    case 'interruption':
      // User interrupted current playback
      console.log('User interrupted');
      // Stop current response
      break;

    case 'dtmf':
      // User pressed phone key
      console.log('Key pressed:', data.digit);
      break;

    case 'stop':
      // Call ended
      console.log('Call ended');
      break;
  }
});
```

### Sending Responses

```javascript
// Send text to be spoken
ws.send(JSON.stringify({
  type: 'text',
  text: 'Hello! How can I help you?'
}));

// Stream text in chunks (lower latency)
ws.send(JSON.stringify({
  type: 'text',
  text: 'First part...',
  stream: true
}));
```

---

## AI Service Integration

### Option 1: OpenAI Integration

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAIResponse(userMessage, conversationHistory) {
  const messages = [
    {
      role: 'system',
      content: `You are a voice assistant. Keep responses under 3 sentences.
                Spell out all numbers. No emojis or formatting.`
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    max_tokens: 150,
    temperature: 0.7
  });

  return response.choices[0].message.content;
}
```

### Option 2: Langflow Integration

```javascript
async function queryLangflow(message, sessionId) {
  const response = await fetch(
    `${process.env.LANGFLOW_URL}/api/v1/run/${process.env.LANGFLOW_FLOW_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LANGFLOW_API_KEY}`
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId,
        stream: false
      })
    }
  );

  const data = await response.json();
  return data.outputs[0].outputs[0].results.message.text;
}
```

### Option 3: Custom LLM/API

```javascript
async function queryCustomLLM(message) {
  const response = await fetch(process.env.CUSTOM_LLM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CUSTOM_LLM_API_KEY}`
    },
    body: JSON.stringify({
      prompt: message,
      max_tokens: 150,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.response;
}
```

### Streaming Responses (Lower Latency)

```javascript
async function streamOpenAIResponse(ws, messages) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';

    if (content) {
      // Stream each chunk to caller immediately
      ws.send(JSON.stringify({
        type: 'text',
        text: content,
        stream: true
      }));
    }
  }
}
```

---

## Production Deployment

### From ngrok to Production

1. **Get a Domain**: Register a domain name
2. **SSL Certificate**: Obtain Let's Encrypt cert or use Cloudflare
3. **Deploy Server**: Use AWS, GCP, Heroku, or Vercel
4. **Update Twilio**: Change webhook from ngrok to your domain
5. **Environment Variables**: Set production credentials

### Production Server Setup (Node.js on AWS)

```bash
# Install Node.js on EC2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone your repository
git clone https://your-repo.git
cd your-project
npm install

# Start with PM2
pm2 start server.js --name twilio-voice
pm2 startup
pm2 save

# Configure nginx reverse proxy
sudo apt-get install nginx
# Edit /etc/nginx/sites-available/default
# Add SSL with certbot
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name voice.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name voice.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/voice.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/voice.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### Environment Variables (Production)

```bash
# .env.production
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4

PORT=3000
NODE_ENV=production

# Use your actual domain
PRODUCTION_URL=https://voice.yourdomain.com

# Enable security
VALIDATE_TWILIO_SIGNATURE=true

# Logging
LOG_LEVEL=info
SAVE_TRANSCRIPTS=true
TRANSCRIPT_DIR=/var/log/twilio-voice/conversations
```

### Monitoring & Logging

```javascript
// Add request logging
const morgan = require('morgan');
app.use(morgan('combined'));

// Error tracking with Sentry
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. WebSocket Connection Fails

**Symptoms**: Call connects but no audio, WebSocket errors in logs

**Solutions**:
- Verify ngrok is running and URL is correct
- Check firewall allows WebSocket connections (port 443)
- Ensure TwiML has correct `wss://` URL (not `ws://`)
- Test WebSocket independently: `wscat -c wss://your-url/ws`

#### 2. Twilio Can't Reach Webhook

**Symptoms**: Call doesn't connect, "Application Error" message

**Solutions**:
- Verify ngrok is running: `curl https://your-url.ngrok.io/voice`
- Check server is listening on correct port
- Review ngrok web interface (http://localhost:4040) for request logs
- Verify webhook URL in Twilio Console is correct

#### 3. AI Responses Not Playing

**Symptoms**: WebSocket connects, transcription works, but no audio response

**Solutions**:
- Check AI service is responding (log response text)
- Verify response is being sent to WebSocket
- Ensure text doesn't contain special characters
- Test with simple hard-coded response first

#### 4. High Latency/Delays

**Symptoms**: Long pauses between user speech and AI response

**Solutions**:
- Use streaming mode for AI responses
- Reduce max_tokens in AI request
- Choose faster AI model (gpt-3.5-turbo vs gpt-4)
- Check server/AI service latency
- Use Twilio's edge locations closer to users

#### 5. ConversationRelay Not Available

**Symptoms**: "ConversationRelay is not enabled" error

**Solutions**:
- Enable in Twilio Console: Voice → Settings → ConversationRelay
- May require account verification
- Contact Twilio support if unavailable

### Debug Logging

```javascript
// Enable detailed logging
const DEBUG = process.env.NODE_ENV === 'development';

function log(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', new Date().toISOString(), ...args);
  }
}

// Log all WebSocket messages
ws.on('message', (message) => {
  log('WebSocket received:', message.toString());
  // ... handle message
});

// Log all AI requests/responses
async function getAIResponse(text) {
  log('AI Request:', text);
  const response = await queryAI(text);
  log('AI Response:', response);
  return response;
}
```

### Testing Tools

```bash
# Test webhook endpoint
curl -X POST https://your-url.ngrok.io/voice \
  -d "From=%2B1234567890" \
  -d "To=%2B0987654321"

# Test WebSocket connection
npm install -g wscat
wscat -c wss://your-url.ngrok.io/ws

# Monitor ngrok traffic
# Visit: http://localhost:4040

# Test Twilio validation
node test-twilio-signature.js
```

### Performance Monitoring

```javascript
// Track response times
const responseStart = Date.now();
const aiResponse = await getAIResponse(userMessage);
const responseTime = Date.now() - responseStart;
console.log(`AI response time: ${responseTime}ms`);

// Alert if slow
if (responseTime > 2000) {
  console.warn('Slow AI response:', responseTime);
  // Consider caching, faster model, or optimization
}
```

---

## Additional Resources

### Official Documentation
- Twilio Voice: https://www.twilio.com/docs/voice
- ConversationRelay: https://www.twilio.com/docs/voice/twiml/connect/conversation-relay
- OpenAI API: https://platform.openai.com/docs
- Langflow: https://docs.langflow.org

### Example Projects
- langflow-twilio-voice: https://github.com/langflow-ai/langflow-twilio-voice
- cr-demo: https://github.com/robinske/cr-demo
- Twilio samples: https://github.com/TwilioDevEd

### Community
- Twilio Community: https://www.twilio.com/community
- Stack Overflow: Tag `[twilio]`
- GitHub Discussions: Relevant project repos

---

**Version**: 1.1
**Last Updated**: December 2025
**Maintained By**: Twilio Voice Skill Contributors
