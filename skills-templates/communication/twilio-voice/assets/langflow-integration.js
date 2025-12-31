/**
 * Langflow + Twilio Voice Integration
 *
 * Complete example for building AI-powered voice assistants using
 * Twilio ConversationRelay and Langflow workflows.
 *
 * Based on: https://github.com/langflow-ai/langflow-twilio-voice
 */

require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const WebSocket = require('ws');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration
const config = {
  port: process.env.PORT || 3000,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  langflowUrl: process.env.LANGFLOW_URL || 'http://localhost:7860',
  langflowFlowId: process.env.LANGFLOW_FLOW_ID,
  langflowApiKey: process.env.LANGFLOW_API_KEY,
  ngrokUrl: process.env.NGROK_URL
};

/**
 * Incoming call handler - Sets up ConversationRelay
 */
app.post('/voice', (req, res) => {
  console.log('Incoming call from:', req.body.From);

  const twiml = new twilio.twiml.VoiceResponse();
  const connect = twiml.connect();

  // Configure ConversationRelay for real-time conversation
  connect.conversationRelay({
    url: `wss://${config.ngrokUrl.replace('https://', '')}/ws`,
    voice: 'Polly.Joanna',        // AWS Polly voice
    language: 'en-US',
    transcriptionProvider: 'deepgram',  // Or 'google'
    ttsSampleRate: '24000'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

/**
 * WebSocket handler for ConversationRelay
 */
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
  console.log('ConversationRelay WebSocket connected');

  let sessionId = null;
  let conversationHistory = [];

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Initialize session
      if (data.event === 'start') {
        sessionId = data.callSid;
        console.log('Session started:', sessionId);

        // Send greeting
        ws.send(JSON.stringify({
          type: 'text',
          text: 'Hello! How can I help you today?'
        }));
      }

      // Handle transcriptions from caller
      if (data.event === 'transcription' && data.text) {
        console.log('User said:', data.text);

        // Send to Langflow
        const aiResponse = await queryLangflow(data.text, sessionId);

        // Send AI response back to caller
        ws.send(JSON.stringify({
          type: 'text',
          text: aiResponse
        }));

        // Update conversation history
        conversationHistory.push({
          role: 'user',
          content: data.text
        });
        conversationHistory.push({
          role: 'assistant',
          content: aiResponse
        });
      }

      // Handle interruptions
      if (data.event === 'interruption') {
        console.log('User interrupted');
        // Stop current speech and be ready for new input
      }

      // Session end
      if (data.event === 'stop') {
        console.log('Session ended:', sessionId);
        console.log('Conversation history:', conversationHistory);
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'I apologize, but I encountered an error. Please try again.'
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
  });
});

/**
 * Query Langflow workflow
 */
async function queryLangflow(message, sessionId) {
  try {
    const response = await fetch(
      `${config.langflowUrl}/api/v1/run/${config.langflowFlowId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.langflowApiKey}`
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId,
          stream: false  // Set to true for streaming responses
        })
      }
    );

    const data = await response.json();

    // Extract response text from Langflow output
    // Format may vary based on your flow configuration
    return data.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
           data.message ||
           'I\'m sorry, I didn\'t understand that.';

  } catch (error) {
    console.error('Langflow error:', error);
    return 'I apologize, but I\'m having trouble processing your request right now.';
  }
}

/**
 * HTTP server with WebSocket upgrade
 */
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Webhook URL: ${config.ngrokUrl}/voice`);
  console.log(`WebSocket URL: wss://${config.ngrokUrl.replace('https://', '')}/ws`);
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

/**
 * Voice-optimized system prompt for Langflow
 *
 * Configure this in your Langflow workflow's Prompt component:
 */
const VOICE_SYSTEM_PROMPT = `
You are a helpful voice assistant speaking over the phone. Follow these guidelines:

CRITICAL VOICE RULES:
- Keep responses to 2-3 sentences maximum
- Spell out ALL numbers (say "twenty-three" not "23")
- NO emojis, bullet points, or special formatting
- Use natural conversational language
- Avoid technical jargon unless necessary
- Speak responses in under 30 seconds

CONVERSATION STYLE:
- Be friendly and professional
- Ask clarifying questions if needed
- Provide clear next steps
- Use phrases like "Would you like me to..." for options

EXAMPLES:
Bad: "Here are 3 options: 1) ... 2) ... 3) ..."
Good: "I can help you with that in a few ways. Would you like me to check your account balance, or would you prefer to speak with a specialist?"

Bad: "Your balance is $1,234.56"
Good: "Your balance is one thousand, two hundred thirty-four dollars and fifty-six cents"
`;

module.exports = { app, server };
