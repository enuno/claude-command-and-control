---
name: twilio-voice
description: Comprehensive Twilio Voice API assistance with AI integration patterns
---

# Twilio Voice Skill

Comprehensive assistance for building voice applications with Twilio Voice API, including AI-powered voice assistants, ConversationRelay integrations, and production-ready implementation patterns.

## When to Use This Skill

This skill should be triggered when:

**Core Voice Development:**
- Implementing Twilio Voice API integrations
- Building interactive voice response (IVR) systems
- Debugging Twilio voice applications
- Working with TwiML (Twilio Markup Language)
- Setting up voice webhooks and call routing

**AI-Powered Voice Applications:**
- Building conversational AI voice assistants
- Integrating Twilio with LLMs (OpenAI, Langflow, etc.)
- Implementing real-time bidirectional voice streaming
- Creating voice-based customer service automation
- Developing natural language phone interactions

**Advanced Features:**
- Working with ConversationRelay for real-time AI conversations
- Implementing voice streaming with low latency
- Building voice applications with function calling
- Managing conversation context and memory
- Handling interruptions and turn-taking in voice conversations

## Quick Reference

### Common Patterns

#### 1. ConversationRelay Integration
```javascript
// Real-time AI voice conversation setup
app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  const connect = twiml.connect();

  connect.conversationRelay({
    url: 'wss://your-app.ngrok.io/ws',
    voice: 'Polly.Joanna',
    language: 'en-US'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});
```

#### 2. Langflow + Twilio Integration
```javascript
// Forward transcriptions to Langflow for AI processing
conversationRelay.on('transcription', async (data) => {
  const response = await fetch(`${LANGFLOW_URL}/api/v1/run/${FLOW_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LANGFLOW_API_KEY}`
    },
    body: JSON.stringify({
      message: data.text,
      session_id: data.callSid
    })
  });

  const aiResponse = await response.json();
  conversationRelay.say(aiResponse.message);
});
```

#### 3. Voice-Optimized Prompts
```javascript
// Best practices for AI voice responses
const systemPrompt = `
You are a helpful voice assistant. Follow these guidelines:
- Answer carefully and concisely (2-3 sentences max)
- Spell out ALL numbers (say "twenty-three" not "23")
- NO emojis, bullet points, or special symbols
- Use natural conversational language
- Avoid markdown or formatting
- Keep responses under 30 seconds when spoken
`;
```

#### 4. Webhook Configuration
```javascript
// Basic Twilio webhook handler
app.post('/twiml', (req, res) => {
  const twiml = new VoiceResponse();

  twiml.say({
    voice: 'Polly.Joanna'
  }, 'Hello! How can I help you today?');

  twiml.gather({
    input: 'speech',
    action: '/process-speech',
    timeout: 3
  });

  res.type('text/xml');
  res.send(twiml.toString());
});
```

#### 5. Development Setup with ngrok
```bash
# Expose local server for Twilio webhooks
ngrok http 3000

# Configure Twilio phone number webhook URL:
# https://your-subdomain.ngrok.io/voice
```

## Integration Patterns

### AI Voice Assistant Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Phone     │ ──────> │    Twilio    │ ──────> │  Your      │
│   Caller    │         │    Voice     │         │  Server    │
│             │ <────── │  +Conversation│ <────── │  (Node.js) │
└─────────────┘         │    Relay     │         └────────────┘
                        └──────────────┘               │
                                                       │
                        ┌──────────────┐               │
                        │   AI Service │ <─────────────┘
                        │  (OpenAI/    │
                        │   Langflow)  │
                        └──────────────┘
```

**Flow:**
1. Caller dials Twilio number
2. Twilio webhook triggers your server's `/voice` endpoint
3. Server responds with TwiML including ConversationRelay
4. ConversationRelay establishes WebSocket for bidirectional audio
5. Audio transcribed and sent to AI service
6. AI response synthesized and streamed back to caller

### Common Use Cases

#### Customer Service Automation
```javascript
// Route calls based on intent
const intentRouter = {
  'billing': handleBillingInquiry,
  'support': handleTechnicalSupport,
  'sales': transferToSales
};

conversationRelay.on('transcription', async (data) => {
  const intent = await detectIntent(data.text);
  await intentRouter[intent](data);
});
```

#### Voice-Based IVR with Natural Language
```javascript
// Replace traditional touch-tone IVR
twiml.gather({
  input: 'speech',
  hints: 'billing, support, sales, account',
  speechTimeout: 'auto'
}).say('How can I help you today?');
```

#### Appointment Scheduling by Voice
```javascript
// Extract structured data from conversation
const extractAppointment = async (transcript) => {
  const prompt = `Extract appointment details: ${transcript}
  Return JSON: { date, time, service }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.choices[0].message.content);
};
```

## Prerequisites

### Twilio Account Setup
- Twilio account with phone number
- ConversationRelay enabled in console
- Account SID and Auth Token
- Voice-enabled phone number

### Development Environment
```bash
# Required packages
npm install twilio express dotenv

# For AI integration
npm install openai  # OpenAI integration
# OR configure Langflow endpoint

# For local development
npm install -g ngrok  # Webhook tunneling
```

### Environment Variables
```bash
# .env file
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# For AI integration
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
# OR
LANGFLOW_URL=http://localhost:7860
LANGFLOW_FLOW_ID=your-flow-id
LANGFLOW_API_KEY=your-api-key

# Server configuration
PORT=3000
NGROK_URL=https://your-subdomain.ngrok.io
```

### Twilio Console Configuration
1. Navigate to Phone Numbers → Active Numbers
2. Select your voice-enabled number
3. Configure Voice & Fax:
   - **A CALL COMES IN**: Webhook → `https://your-ngrok-url.ngrok.io/voice`
   - **HTTP Method**: POST
4. Save configuration

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **other.md** - Core Twilio Voice documentation
- **integration-patterns.md** - AI integration examples (see assets/)
- **best-practices.md** - Voice-optimized development patterns

Use `view` to read specific reference files when detailed information is needed.

## Best Practices

### Voice-Optimized AI Responses
1. **Keep responses concise** - 2-3 sentences maximum
2. **Spell out numbers** - Say "twenty-three" not "23"
3. **Avoid special characters** - No emojis, bullets, or markdown
4. **Use natural language** - Conversational, not formal documentation
5. **Time-bound responses** - Aim for < 30 seconds when spoken
6. **Provide clear next steps** - "Would you like me to..." patterns

### Error Handling
```javascript
// Graceful degradation for voice applications
conversationRelay.on('error', (error) => {
  console.error('ConversationRelay error:', error);

  // Fallback to simple IVR
  const twiml = new VoiceResponse();
  twiml.say('I apologize, but I\'m having trouble right now.');
  twiml.redirect('/fallback-menu');

  res.type('text/xml').send(twiml.toString());
});
```

### Security Considerations
```javascript
// Validate Twilio requests
const twilio = require('twilio');

app.post('/voice', (req, res) => {
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `https://${req.hostname}${req.url}`;

  if (!twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    req.body
  )) {
    return res.status(403).send('Forbidden');
  }

  // Process validated request
  // ...
});
```

### Performance Optimization
- **Use streaming mode** for lower latency AI responses
- **Implement timeouts** to prevent hung connections
- **Cache common responses** for frequently asked questions
- **Monitor call quality metrics** via Twilio Console

## Working with This Skill

### For Beginners
1. Start with basic webhook implementation (Pattern #4)
2. Test with ngrok tunneling (Pattern #5)
3. Experiment with voice-optimized prompts (Pattern #3)
4. Review prerequisites and environment setup

### For AI Integration
1. Choose your AI service (OpenAI, Langflow, or custom LLM)
2. Implement ConversationRelay pattern (#1 or #2)
3. Apply voice-optimization best practices
4. Test conversation flow and interruption handling

### For Production Deployment
1. Move from ngrok to production server with SSL
2. Implement request validation and security measures
3. Set up monitoring and error tracking
4. Configure scaling for call volume
5. Test fallback mechanisms

## Resources

### references/
Organized documentation extracted from official sources:
- **llms.md** - Twilio Voice API overview and core concepts
- **other.md** - Additional documentation and guides
- **index.md** - Quick navigation index

### assets/
Example implementations and templates (added from real-world integrations):
- **langflow-integration.js** - Complete Langflow + Twilio example
- **openai-integration.js** - OpenAI + Twilio Voice assistant
- **voice-prompts.md** - Collection of voice-optimized system prompts
- **.env.example** - Environment variable template

### scripts/
Helper utilities for development:
- **test-webhook.js** - Local webhook testing utility
- **validate-setup.js** - Verify Twilio configuration

### Example Projects
- **langflow-twilio-voice**: https://github.com/langflow-ai/langflow-twilio-voice
- **cr-demo**: https://github.com/robinske/cr-demo

## Notes

### Skill Enhancement History
- **v1.0** - Auto-generated from Twilio Voice documentation (llms.txt)
- **v1.1** - Enhanced with AI integration patterns from production implementations:
  - ConversationRelay integration patterns
  - Langflow + Twilio Voice workflow
  - OpenAI + Twilio Voice integration
  - Voice-optimized prompting best practices
  - Real-world use cases and examples
  - Security and performance guidelines

### Knowledge Sources
1. **Official Documentation**: Twilio Voice API (llms.txt extraction)
2. **Production Patterns**: langflow-ai/langflow-twilio-voice repository
3. **Implementation Examples**: robinske/cr-demo repository
4. **Best Practices**: Voice-optimized AI response guidelines

### Quality Status
- **Content Coverage**: Comprehensive (basic API + AI integrations)
- **Code Examples**: Production-ready patterns included
- **Use Cases**: Customer service, IVR, appointments, voice assistants
- **Integration Support**: Langflow, OpenAI, generic LLM patterns

## Updating

To refresh this skill with updated documentation:
1. **API docs**: Re-run `/create-skill --url https://www.twilio.com/docs/voice --name twilio-voice`
2. **Integration patterns**: Review referenced GitHub repositories for updates
3. **Best practices**: Monitor Twilio blog and community discussions
4. **AI enhancements**: Track ConversationRelay feature releases
