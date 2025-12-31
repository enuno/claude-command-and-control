/**
 * OpenAI + Twilio Voice Integration
 *
 * Complete example for building AI voice assistants using
 * Twilio ConversationRelay and OpenAI's GPT models.
 *
 * Based on: https://github.com/robinske/cr-demo
 */

require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const WebSocket = require('ws');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const required = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'OPENAI_API_KEY',
    'NGROK_URL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
  }

  console.log('✓ Environment variables validated');
}

// Validate environment before initializing
validateEnvironment();

// Configuration
const config = {
  port: process.env.PORT || 3000,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
  ngrokUrl: process.env.NGROK_URL
};

/**
 * Voice-optimized system prompt
 */
const SYSTEM_PROMPT = `You are a helpful voice assistant. Follow these rules:
- Answer in 2-3 sentences maximum
- Spell out all numbers (say "twenty-three" not "23")
- NO emojis, bullets, or special formatting
- Use natural conversational language
- Keep responses under 30 seconds when spoken
- Ask clarifying questions if needed`;

/**
 * Validate Twilio request signature
 */
function validateTwilioRequest(req, res, next) {
  if (process.env.VALIDATE_TWILIO_SIGNATURE === 'false') {
    return next();
  }

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const isValid = twilio.validateRequest(
    config.twilioAuthToken,
    twilioSignature,
    url,
    req.body
  );

  if (!isValid) {
    console.error('Invalid Twilio signature');
    return res.status(403).send('Forbidden');
  }

  next();
}

/**
 * Incoming call handler
 */
app.post('/twiml', validateTwilioRequest, (req, res) => {
  console.log('Incoming call from:', req.body.From);

  // Validate required fields
  if (!req.body.From || !req.body.To) {
    console.error('Missing required fields in webhook');
    return res.status(400).send('Bad Request');
  }

  const twiml = new twilio.twiml.VoiceResponse();
  const connect = twiml.connect();

  connect.conversationRelay({
    url: `wss://${config.ngrokUrl.replace('https://', '')}/websocket`,
    voice: 'Polly.Joanna',
    language: 'en-US',
    transcriptionProvider: 'deepgram'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

/**
 * WebSocket server for ConversationRelay
 */
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket server errors
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

wss.on('connection', (ws, req) => {
  console.log('WebSocket connected');

  // Set connection timeout
  const connectionTimeout = setTimeout(() => {
    console.log('WebSocket connection timeout');
    ws.close();
  }, 300000); // 5 minutes

  ws.on('error', (error) => {
    console.error('WebSocket connection error:', error);
    clearTimeout(connectionTimeout);
  });

  let conversationHistory = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];
  let streamingResponse = '';
  let callSid = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Session start
      if (data.event === 'start') {
        callSid = data.callSid;
        console.log('Call started:', callSid);

        // Send greeting
        const greeting = 'Hello! I\'m your AI assistant. How can I help you today?';
        ws.send(JSON.stringify({
          type: 'text',
          text: greeting
        }));

        conversationHistory.push({
          role: 'assistant',
          content: greeting
        });
      }

      // Handle user speech transcription
      if (data.event === 'transcription' && data.text) {
        console.log('User:', data.text);

        conversationHistory.push({
          role: 'user',
          content: data.text
        });

        // Get AI response
        await getOpenAIResponse(ws, conversationHistory);
      }

      // Handle interruptions
      if (data.event === 'interruption') {
        console.log('User interrupted - stopping current response');
        streamingResponse = '';
        // In production, you would stop the current OpenAI stream here
      }

      // Session end
      if (data.event === 'stop') {
        console.log('Call ended:', callSid);
        console.log('Final conversation:', conversationHistory);
      }

    } catch (error) {
      console.error('WebSocket error:', error);
      handleError(ws);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
    clearTimeout(connectionTimeout);
  });
});

/**
 * Get response from OpenAI
 */
async function getOpenAIResponse(ws, conversationHistory) {
  try {
    // Option 1: Non-streaming (simpler, higher latency)
    const response = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: conversationHistory,
      max_tokens: 150,  // Limit response length
      temperature: 0.7
    });

    const aiMessage = response.choices[0].message.content;
    console.log('AI:', aiMessage);

    ws.send(JSON.stringify({
      type: 'text',
      text: aiMessage
    }));

    conversationHistory.push({
      role: 'assistant',
      content: aiMessage
    });

  } catch (error) {
    console.error('OpenAI error:', error);
    handleError(ws);
  }
}

/**
 * Get streaming response from OpenAI (lower latency)
 */
async function getOpenAIStreamingResponse(ws, conversationHistory) {
  try {
    const stream = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: conversationHistory,
      max_tokens: 150,
      temperature: 0.7,
      stream: true
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        fullResponse += content;

        // Send chunks to Twilio for immediate playback
        ws.send(JSON.stringify({
          type: 'text',
          text: content,
          stream: true
        }));
      }
    }

    console.log('AI (streamed):', fullResponse);

    conversationHistory.push({
      role: 'assistant',
      content: fullResponse
    });

  } catch (error) {
    console.error('OpenAI streaming error:', error);
    handleError(ws);
  }
}

/**
 * Example: Function calling for structured actions
 */
const FUNCTIONS = [
  {
    name: 'check_account_balance',
    description: 'Check the user\'s account balance',
    parameters: {
      type: 'object',
      properties: {
        account_number: {
          type: 'string',
          description: 'The account number to check'
        }
      },
      required: ['account_number']
    }
  },
  {
    name: 'schedule_appointment',
    description: 'Schedule an appointment for the user',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        time: { type: 'string', description: 'Time in HH:MM format' },
        service: { type: 'string', description: 'Type of service requested' }
      },
      required: ['date', 'time', 'service']
    }
  }
];

async function getOpenAIResponseWithFunctions(ws, conversationHistory) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversationHistory,
      functions: FUNCTIONS,
      function_call: 'auto'
    });

    const message = response.choices[0].message;

    // Check if AI wants to call a function
    if (message.function_call) {
      const functionName = message.function_call.name;
      const functionArgs = JSON.parse(message.function_call.arguments);

      console.log(`AI calling function: ${functionName}`, functionArgs);

      // Execute function
      let functionResult;
      if (functionName === 'check_account_balance') {
        functionResult = await checkAccountBalance(functionArgs.account_number);
      } else if (functionName === 'schedule_appointment') {
        functionResult = await scheduleAppointment(functionArgs);
      }

      // Add function result to conversation
      conversationHistory.push({
        role: 'function',
        name: functionName,
        content: JSON.stringify(functionResult)
      });

      // Get AI's final response with function result
      await getOpenAIResponse(ws, conversationHistory);

    } else {
      // Normal text response
      ws.send(JSON.stringify({
        type: 'text',
        text: message.content
      }));

      conversationHistory.push({
        role: 'assistant',
        content: message.content
      });
    }

  } catch (error) {
    console.error('Function calling error:', error);
    handleError(ws);
  }
}

/**
 * Example function implementations
 *
 * ⚠️ WARNING: THESE ARE MOCK FUNCTIONS FOR DEMONSTRATION ONLY
 * DO NOT DEPLOY TO PRODUCTION WITHOUT REPLACING WITH REAL IMPLEMENTATIONS
 *
 * These functions should:
 * - Connect to your actual database/API
 * - Include proper error handling
 * - Validate input parameters
 * - Use authentication/authorization
 * - Log transactions for audit trails
 */
async function checkAccountBalance(accountNumber) {
  // ⚠️ MOCK IMPLEMENTATION - REPLACE IN PRODUCTION
  console.warn('Using mock checkAccountBalance - replace with real implementation');

  // TODO: Replace with real database query
  // Example:
  // const account = await db.accounts.findOne({ number: accountNumber });
  // return { account_number: accountNumber, balance: account.balance, currency: 'USD' };

  return {
    account_number: accountNumber,
    balance: 1234.56,
    currency: 'USD'
  };
}

async function scheduleAppointment({ date, time, service }) {
  // ⚠️ MOCK IMPLEMENTATION - REPLACE IN PRODUCTION
  console.warn('Using mock scheduleAppointment - replace with real implementation');

  // TODO: Replace with real scheduling system
  // Example:
  // const appointment = await schedulingService.create({ date, time, service });
  // return { confirmed: true, appointment_id: appointment.id, date, time, service };

  return {
    confirmed: true,
    appointment_id: 'APT-' + Date.now(),
    date, time, service
  };
}

/**
 * Error handler
 */
function handleError(ws) {
  ws.send(JSON.stringify({
    type: 'text',
    text: 'I apologize, but I\'m having technical difficulties. Please try again in a moment.'
  }));
}

/**
 * Server setup
 */
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Webhook URL: ${config.ngrokUrl}/twiml`);
});

// WebSocket upgrade handler
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

module.exports = { app, server };
