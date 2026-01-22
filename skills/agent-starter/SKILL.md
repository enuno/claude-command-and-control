---
name: agent-starter
version: 1.0.0
author: OpenServ Labs (skill created from GitHub repo)
created: 2026-01-22
last_updated: 2026-01-22
status: active
complexity: moderate
category: ai-agent-development
tags: [ai-agents, typescript, openserv-sdk, agent-framework, autonomous-agents]
source: https://github.com/openserv-labs/agent-starter
---

# OpenServ Agent Starter

## Description
This skill provides guidance for building autonomous AI agents using the OpenServ SDK, a TypeScript framework that simplifies agent development. Use this skill when creating AI agents with capabilities, testing them locally, deploying to the OpenServ platform, and understanding the agent development lifecycle.

## When to Use This Skill
- When building autonomous AI agents with custom capabilities
- When setting up a new OpenServ SDK project
- When implementing agent capabilities with type-safe schemas
- When testing agents locally before platform deployment
- When exposing local development servers with tunneling tools
- When deploying AI agents to production hosting services
- When integrating agents with the OpenServ platform

## When NOT to Use This Skill
- For non-OpenServ agent frameworks (LangChain, AutoGPT, etc.)
- For static chatbot implementations without capabilities
- When building non-TypeScript/JavaScript agents
- For agents not requiring external capabilities or tools

## Prerequisites
- Basic knowledge of JavaScript/TypeScript
- Node.js installed (v16+ recommended)
- OpenServ account (https://platform.openserv.ai)
- Optional: OpenAI API key for local testing
- Understanding of async/await patterns in JavaScript

## Workflow

### Phase 1: Project Setup
**Purpose**: Initialize agent development environment

#### Step 1.1: Clone Starter Template
```bash
git clone https://github.com/openserv-labs/agent-starter.git
cd agent-starter
npm install
```

**Expected Output**: Project cloned with all dependencies installed

#### Step 1.2: Configure Environment
```bash
# Copy example environment file
cp .env.example .env
```

**Edit .env file**:
```bash
OPENSERV_API_KEY=your_openserv_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional for local testing
PORT=7378  # Default agent server port
```

**Validation**:
- [ ] .env file created
- [ ] OPENSERV_API_KEY configured
- [ ] PORT number set (default 7378)

**Expected Output**: Environment configured for development

#### Step 1.3: Understand Project Structure
```
agent-starter/
├── src/
│   └── index.ts       # Agent core logic and server
├── .env               # Environment variables
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript config
```

**Expected Output**: Clear understanding of minimal project structure

### Phase 2: Agent Implementation
**Purpose**: Create agent with custom capabilities

#### Step 2.1: Define Agent with System Prompt
```typescript
import { Agent } from '@openserv/sdk'

const agent = new Agent({
  systemPrompt: 'You are an agent that sums two numbers'
})
```

**Key Concepts**:
- System prompt guides agent behavior
- Agent handles request routing automatically
- SDK manages communication with OpenServ platform

**Expected Output**: Agent instance created with behavior guidance

#### Step 2.2: Add Capabilities
```typescript
import { z } from 'zod'

agent.addCapability({
  name: 'sum',
  description: 'Sums two numbers',
  schema: z.object({
    a: z.number(),
    b: z.number()
  }),
  async run({ args }) {
    return `${args.a} + ${args.b} = ${args.a + args.b}`
  }
})
```

**Capability Structure**:
- **name**: Unique identifier for the capability
- **description**: Explains when to use this capability
- **schema**: Zod schema for type-safe validation
- **run**: Async function that implements capability logic

**Decision Point**:
- IF capability needs external API → Add API client in run function
- IF capability needs state → Consider adding state management
- IF capability needs validation → Enhance Zod schema

**Expected Output**: Type-safe capability with automatic validation

#### Step 2.3: Start Agent Server
```typescript
agent.start()
```

**What This Does**:
1. Launches HTTP server on configured port
2. Registers endpoints for OpenServ platform communication
3. Sets up request parsing and response formatting
4. Handles capability invocation automatically

**Expected Output**: Server listening on configured port (default 7378)

### Phase 3: Local Testing with process()
**Purpose**: Test agent behavior before platform deployment

#### Step 3.1: Implement Local Test Function
```typescript
async function main() {
  const result = await agent.process({
    messages: [
      {
        role: 'user',
        content: 'add 13 and 29'
      }
    ]
  })

  console.log('Result:', result.choices[0].message.content)
}

main()
```

**How process() Works**:
1. Sends user message to LLM (using OpenAI API key)
2. LLM determines if capabilities should be invoked
3. If needed, invokes capabilities with appropriate arguments
4. Returns response for testing

**Expected Output**: Local test results without platform deployment

#### Step 3.2: Test Multiple Scenarios
```typescript
async function main() {
  // Test case 1: Simple addition
  const test1 = await agent.process({
    messages: [{ role: 'user', content: 'add 13 and 29' }]
  })
  console.log('Test 1:', test1.choices[0].message.content)

  // Test case 2: Different phrasing
  const test2 = await agent.process({
    messages: [{ role: 'user', content: 'what is the sum of 42 and 58?' }]
  })
  console.log('Test 2:', test2.choices[0].message.content)

  // Test case 3: Edge case
  const test3 = await agent.process({
    messages: [{ role: 'user', content: 'add negative five and seven' }]
  })
  console.log('Test 3:', test3.choices[0].message.content)
}
```

**Validation**:
- [ ] Simple inputs work correctly
- [ ] Different phrasings are handled
- [ ] Edge cases are managed
- [ ] Error handling is robust

**Expected Output**: Comprehensive test coverage before deployment

### Phase 4: Platform Integration with Tunneling
**Purpose**: Expose local development server to OpenServ platform

#### Step 4.1: Choose Tunneling Tool

**Option A: ngrok (Recommended)**
```bash
# Install ngrok from https://ngrok.com/download

# Expose local port
ngrok http 7378
```

**Look for**:
```
Forwarding https://abc123.ngrok-free.app -> http://localhost:7378
```

**Option B: localtunnel (Open Source)**
```bash
# Install globally
npm install -g localtunnel

# Expose port
lt --port 7378
```

**Expected Output**: Public HTTPS URL for local development server

#### Step 4.2: Start Development Server
```bash
# Development mode with auto-restart
npm run dev

# Or standard start
npm start
```

**Expected Output**: Agent server running and accessible via tunnel

### Phase 5: OpenServ Platform Registration
**Purpose**: Register agent on OpenServ platform

#### Step 5.1: Register Agent
**Platform Steps**:
1. Navigate to Developer → Add Agent
2. Enter agent name and description
3. List agent capabilities (sum, etc.)
4. Set Agent Endpoint to tunnel URL (e.g., `https://abc123.ngrok-free.app`)
5. Create Secret Key
6. Copy Secret Key to .env file

**Expected Output**: Agent registered and accessible on platform

#### Step 5.2: Create Project with Agent
**Platform Steps**:
1. Navigate to Projects → Create New Project
2. Give project a name
3. Add registered agent to project
4. Test agent through platform interface

**Expected Output**: Working agent integration on OpenServ platform

### Phase 6: Production Deployment
**Purpose**: Deploy agent for 24/7 availability

#### Step 6.1: Build for Production
```bash
npm run build
```

**Expected Output**: Compiled TypeScript in dist/ or build/ directory

#### Step 6.2: Choose Hosting Service

**Serverless (Beginner-Friendly)**:
- **Vercel**: Free tier, easy GitHub deployment
- **Netlify Functions**: Generous free tier
- **AWS Lambda**: Scalable, more complex setup

**Container-Based (More Control)**:
- **Render**: Easy Docker deployment, free tier
- **Railway**: Developer-friendly platform
- **Fly.io**: Global deployment, generous free tier

**Self-Hosted (Maximum Freedom)**:
- **OpenFaaS**: Functions as a Service for Docker/Kubernetes
- **Dokku**: Lightweight PaaS for any VM

#### Step 6.3: Deploy Agent

**Example: Fly.io Deployment**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
flyctl launch

# Deploy
flyctl deploy
```

**Expected Output**: Production URL (e.g., `https://your-agent.fly.dev`)

#### Step 6.4: Update Platform Configuration
1. Go to OpenServ platform → Developer → Your Agent
2. Update Agent Endpoint to production URL
3. Test agent on platform
4. Submit for review (if publishing publicly)

**Expected Output**: Production agent running 24/7

## Examples

### Example 1: Simple Sum Agent (Starter Template)
**Context**: Create basic agent that sums two numbers

**Input:**
```typescript
const agent = new Agent({
  systemPrompt: 'You are an agent that sums two numbers'
})

agent.addCapability({
  name: 'sum',
  description: 'Sums two numbers',
  schema: z.object({
    a: z.number(),
    b: z.number()
  }),
  async run({ args }) {
    return `${args.a} + ${args.b} = ${args.a + args.b}`
  }
})

agent.start()
```

**Execution Flow:**
1. Agent receives request: "add 13 and 29"
2. LLM determines sum capability should be invoked
3. SDK validates arguments against Zod schema
4. run() function executes: 13 + 29 = 42
5. Response returned to platform

**Expected Output:**
```
42
```

**Rationale**: Demonstrates minimal agent with single capability

### Example 2: Weather Agent with External API
**Context**: Create agent that fetches weather data

**Input:**
```typescript
import axios from 'axios'

const agent = new Agent({
  systemPrompt: 'You are a weather assistant that provides current weather information'
})

agent.addCapability({
  name: 'getWeather',
  description: 'Gets current weather for a city',
  schema: z.object({
    city: z.string(),
    country: z.string().optional()
  }),
  async run({ args }) {
    const apiKey = process.env.WEATHER_API_KEY
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${args.city}`

    try {
      const response = await axios.get(url)
      const data = response.data

      return `Weather in ${args.city}: ${data.current.temp_c}°C, ${data.current.condition.text}`
    } catch (error) {
      return `Unable to fetch weather for ${args.city}`
    }
  }
})

agent.start()
```

**Expected Output:**
```
User: "What's the weather in London?"
Agent: "Weather in London: 12°C, Partly cloudy"
```

**Rationale**: Shows external API integration and error handling

### Example 3: Multi-Capability Task Agent
**Context**: Create agent with multiple capabilities for task management

**Input:**
```typescript
const agent = new Agent({
  systemPrompt: 'You are a task management assistant'
})

// Capability 1: Create task
agent.addCapability({
  name: 'createTask',
  description: 'Creates a new task',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    dueDate: z.string().optional()
  }),
  async run({ args }) {
    // Store in database or memory
    return `Task created: ${args.title}`
  }
})

// Capability 2: List tasks
agent.addCapability({
  name: 'listTasks',
  description: 'Lists all tasks',
  schema: z.object({}),
  async run({ args }) {
    // Retrieve from database or memory
    return 'Your tasks: 1. Buy groceries, 2. Call dentist'
  }
})

// Capability 3: Complete task
agent.addCapability({
  name: 'completeTask',
  description: 'Marks a task as complete',
  schema: z.object({
    taskId: z.number()
  }),
  async run({ args }) {
    return `Task ${args.taskId} marked complete`
  }
})

agent.start()
```

**Expected Output:**
```
User: "Create a task to buy groceries"
Agent: "Task created: Buy groceries"

User: "Show me my tasks"
Agent: "Your tasks: 1. Buy groceries, 2. Call dentist"

User: "Mark task 1 as done"
Agent: "Task 1 marked complete"
```

**Rationale**: Demonstrates multi-capability agent with state management needs

## Quality Standards

### Output Requirements
- All capabilities must have Zod schemas for type safety (100% compliance)
- System prompts must clearly define agent behavior (100% compliance)
- Error handling must be implemented for all external API calls (100% compliance)
- Agent endpoints must use HTTPS in production (100% compliance)

### Performance Requirements
- Local testing with process(): Complete within 5-10 seconds
- Capability execution: <2 seconds for simple operations
- Platform response time: <5 seconds end-to-end

### Integration Requirements
- Works with OpenServ SDK (TypeScript/JavaScript only)
- Compatible with all major hosting platforms
- Supports local development with tunneling tools
- Integrates with OpenServ platform for agent management

## Common Pitfalls

### Pitfall 1: Missing Environment Variables
**Issue**: Agent fails to start or connect to OpenAI/OpenServ
**Why it happens**: .env file not configured or variables misspelled
**Solution**:
```bash
# Always verify .env file exists and has required variables
cat .env

# Required variables:
OPENSERV_API_KEY=your_key
OPENAI_API_KEY=your_key  # For local testing
PORT=7378
```

### Pitfall 2: Schema Validation Errors
**Issue**: Capability fails with validation error
**Why it happens**: Zod schema doesn't match actual arguments
**Solution**:
```typescript
// Bad - allows any number type including NaN
schema: z.object({
  value: z.number()
})

// Good - validates reasonable number range
schema: z.object({
  value: z.number().min(-1000000).max(1000000)
})
```

### Pitfall 3: Tunnel URL Changes on Restart
**Issue**: Agent stops working after ngrok restart
**Why it happens**: Free ngrok generates new URL each restart
**Solution**:
- Use ngrok paid plan for static URLs
- Or use localtunnel with custom subdomain
- Or deploy to production hosting early
- Update OpenServ platform endpoint when URL changes

### Pitfall 4: Async Function Not Awaited
**Issue**: Capability returns Promise instead of actual result
**Why it happens**: Forgetting async/await in capability
**Solution**:
```typescript
// Bad - returns Promise
async run({ args }) {
  axios.get(url)  // No await!
}

// Good - returns actual data
async run({ args }) {
  const response = await axios.get(url)
  return response.data
}
```

### Pitfall 5: Port Already in Use
**Issue**: Agent fails to start with "EADDRINUSE" error
**Why it happens**: Another process using port 7378
**Solution**:
```bash
# Find process using port
lsof -i :7378

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=7379
```

## Integration with Command & Control

### Related Agents
- **Builder Agent**: Collaborates on implementing agent capabilities
- **DevOps Agent**: Assists with deployment to hosting platforms
- **Integration Manager Agent**: Helps integrate agent with external APIs

### Related Commands
- `/docs`: Generate documentation for agent capabilities
- `/test-all`: Test all agent capabilities
- `/deploy-check`: Verify deployment configuration

### MCP Dependencies
None required for basic functionality. Optional integrations:
- **GitHub MCP**: For cloning agent-starter template
- **OpenAI MCP**: For testing with process() method

### Orchestration Notes
- **Chained with**: devops-skill (for deployment), testing-skill (for capability testing)
- **Invoked by**: builder-agent, integration-manager
- **Invokes**: None (leaf skill)

## Troubleshooting

### Issue: "Cannot find module '@openserv/sdk'"
**Symptoms**: TypeScript compilation error
**Diagnosis**: OpenServ SDK not installed
**Solution**:
```bash
npm install @openserv/sdk

# Verify installation
npm list @openserv/sdk
```

### Issue: process() Returns Empty Response
**Symptoms**: Local testing produces no output
**Diagnosis**: OpenAI API key missing or invalid
**Solution**:
1. Verify OPENAI_API_KEY in .env
2. Test API key:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```
3. Regenerate key if needed at https://platform.openai.com

### Issue: Agent Not Responding on Platform
**Symptoms**: Platform shows agent as unavailable
**Diagnosis**: Tunnel or server issue
**Solution**:
1. Verify local server is running: `curl http://localhost:7378`
2. Check tunnel is active: Visit tunnel URL in browser
3. Verify Agent Endpoint URL in OpenServ platform matches tunnel URL
4. Check agent logs for errors

### Issue: Capability Not Being Invoked
**Symptoms**: Agent responds but doesn't use capability
**Diagnosis**: Capability description unclear or schema mismatch
**Solution**:
1. Improve capability description to be more specific
2. Test with process() locally to debug
3. Verify schema matches expected input format
4. Check system prompt doesn't contradict capability usage

## Advanced Features

Once comfortable with basics, explore OpenServ SDK advanced methods:

### File Operations
```typescript
agent.addCapability({
  name: 'saveFile',
  schema: z.object({
    filename: z.string(),
    content: z.string()
  }),
  async run({ args, context }) {
    // Use SDK file methods
    await context.files.save(args.filename, args.content)
    return `File saved: ${args.filename}`
  }
})
```

### Task Management
```typescript
agent.addCapability({
  name: 'createTask',
  schema: z.object({
    title: z.string()
  }),
  async run({ args, context }) {
    // Use SDK task methods
    const task = await context.tasks.create({
      title: args.title,
      status: 'pending'
    })
    return `Task created with ID: ${task.id}`
  }
})
```

### User Interaction
```typescript
agent.addCapability({
  name: 'askUser',
  schema: z.object({
    question: z.string()
  }),
  async run({ args, context }) {
    // Use SDK messaging methods
    const response = await context.messaging.ask(args.question)
    return `User responded: ${response}`
  }
})
```

See [OpenServ SDK API Reference](https://github.com/openserv-labs/sdk#api-reference) for complete method documentation.

## Version History
- 1.0.0 (2026-01-22): Initial release
  - Complete agent development workflow
  - Local testing with process() method
  - Platform integration guidance
  - Production deployment strategies
  - 3 comprehensive examples
  - Advanced features documentation
  - Based on agent-starter GitHub repository (33 stars, MIT license)
