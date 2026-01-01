# Cloudflare-Ai-Gateway - Providers

**Pages:** 26

---

## bge-m3

**URL:** llms-txt#bge-m3

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Embeddings • baai

Multi-Functionality, Multi-Linguality, and Multi-Granularity embeddings model.

| Model Info | |
| - | - |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 60,000 tokens |
| Unit Pricing | $0.012 per M input tokens |

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `query` string min 1

A query you wish to perform against the provided contexts. If no query is provided the model with respond with embeddings for contexts

* `contexts` array required

List of provided contexts. Note that the index in this array is important, as the response will refer to it.

* `text` string min 1

One of the provided context content

* `truncate_inputs` boolean

When provided with too long context should the model error out or truncate the context to fit?

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `truncate_inputs` boolean

When provided with too long context should the model error out or truncate the context to fit?

* `requests` array required

Batch of the embeddings requests to run using async-queue

* `query` string min 1

A query you wish to perform against the provided contexts. If no query is provided the model with respond with embeddings for contexts

* `contexts` array required

List of provided contexts. Note that the index in this array is important, as the response will refer to it.

* `text` string min 1

One of the provided context content

* `truncate_inputs` boolean

When provided with too long context should the model error out or truncate the context to fit?

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `truncate_inputs` boolean

When provided with too long context should the model error out or truncate the context to fit?

Index of the context in the request

Score of the context under the index.

The pooling method used in the embedding process.

Embeddings of the requested text values

Floating point embedding representation shaped by the embedding model

The pooling method used in the embedding process.

* `request_id` string

The async request id that can be used to obtain the results.

The following schemas are based on JSON Schema

<page>
---
title: bge-reranker-base · Cloudflare Workers AI docs
description: >+
  Different from embedding model, reranker uses question and document as input
  and directly output similarity instead of embedding. You can get a relevance
  score by inputting query and passage to the reranker. And the score can be
  mapped to a float value in [0,1] by sigmoid function.

chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/
  md: https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    // Can be a string or array of strings]
    const stories = [
      "This is a story about an orange cloud",
      "This is a story about a llama",
      "This is a story about a hugging emoji",
    ];


    const embeddings = await env.AI.run(
      "@cf/baai/bge-m3",
      {
        text: stories,
      }
    );


    return Response.json(embeddings);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests




ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


stories = [
  'This is a story about an orange cloud',
  'This is a story about a llama',
  'This is a story about a hugging emoji'
]


response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/baai/bge-m3",
  headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
  json={"text": stories}
)


print(response.json())
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/baai/bge-m3  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "text": ["This is a story about an orange cloud", "This is a story about a llama", "This is a story about a hugging emoji"] }'
```

Example 4 (json):
```json
{
      "type": "object",
      "oneOf": [
          {
              "title": "Input Query and Contexts",
              "properties": {
                  "query": {
                      "type": "string",
                      "minLength": 1,
                      "description": "A query you wish to perform against the provided contexts. If no query is provided the model with respond with embeddings for contexts"
                  },
                  "contexts": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "text": {
                                  "type": "string",
                                  "minLength": 1,
                                  "description": "One of the provided context content"
                              }
                          }
                      },
                      "description": "List of provided contexts. Note that the index in this array is important, as the response will refer to it."
                  },
                  "truncate_inputs": {
                      "type": "boolean",
                      "default": false,
                      "description": "When provided with too long context should the model error out or truncate the context to fit?"
                  }
              },
              "required": [
                  "contexts"
              ]
          },
          {
              "title": "Input Embedding",
              "properties": {
                  "text": {
                      "oneOf": [
                          {
                              "type": "string",
                              "description": "The text to embed",
                              "minLength": 1
                          },
                          {
                              "type": "array",
                              "description": "Batch of text values to embed",
                              "items": {
                                  "type": "string",
                                  "description": "The text to embed",
                                  "minLength": 1
                              },
                              "maxItems": 100
                          }
                      ]
                  },
                  "truncate_inputs": {
                      "type": "boolean",
                      "default": false,
                      "description": "When provided with too long context should the model error out or truncate the context to fit?"
                  }
              },
              "required": [
                  "text"
              ]
          },
          {
              "properties": {
                  "requests": {
                      "type": "array",
                      "description": "Batch of the embeddings requests to run using async-queue",
                      "items": {
                          "type": "object",
                          "oneOf": [
                              {
                                  "title": "Input Query and Contexts",
                                  "properties": {
                                      "query": {
                                          "type": "string",
                                          "minLength": 1,
                                          "description": "A query you wish to perform against the provided contexts. If no query is provided the model with respond with embeddings for contexts"
                                      },
                                      "contexts": {
                                          "type": "array",
                                          "items": {
                                              "type": "object",
                                              "properties": {
                                                  "text": {
                                                      "type": "string",
                                                      "minLength": 1,
                                                      "description": "One of the provided context content"
                                                  }
                                              }
                                          },
                                          "description": "List of provided contexts. Note that the index in this array is important, as the response will refer to it."
                                      },
                                      "truncate_inputs": {
                                          "type": "boolean",
                                          "default": false,
                                          "description": "When provided with too long context should the model error out or truncate the context to fit?"
                                      }
                                  },
                                  "required": [
                                      "contexts"
                                  ]
                              },
                              {
                                  "title": "Input Embedding",
                                  "properties": {
                                      "text": {
                                          "oneOf": [
                                              {
                                                  "type": "string",
                                                  "description": "The text to embed",
                                                  "minLength": 1
                                              },
                                              {
                                                  "type": "array",
                                                  "description": "Batch of text values to embed",
                                                  "items": {
                                                      "type": "string",
                                                      "description": "The text to embed",
                                                      "minLength": 1
                                                  },
                                                  "maxItems": 100
                                              }
                                          ]
                                      },
                                      "truncate_inputs": {
                                          "type": "boolean",
                                          "default": false,
                                          "description": "When provided with too long context should the model error out or truncate the context to fit?"
                                      }
                                  },
                                  "required": [
                                      "text"
                                  ]
                              }
                          ]
                      }
                  }
              },
              "required": [
                  "requests"
              ]
          }
      ]
  }
```

---

## deepseek-r1-distill-qwen-32b

**URL:** llms-txt#deepseek-r1-distill-qwen-32b

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • DeepSeek

@cf/deepseek-ai/deepseek-r1-distill-qwen-32b

DeepSeek-R1-Distill-Qwen-32B is a model distilled from DeepSeek-R1 based on Qwen2.5. It outperforms OpenAI-o1-mini across various benchmarks, achieving new state-of-the-art results for dense models.

| Model Info | |
| - | - |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 80,000 tokens |
| Terms and License | [link](https://github.com/deepseek-ai/DeepSeek-R1/blob/main/LICENSE) |
| Unit Pricing | $0.50 per M input tokens, $4.88 per M output tokens |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/deepseek-ai/deepseek-r1-distill-qwen-32b)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: detr-resnet-50 · Cloudflare Workers AI docs
description: DEtection TRansformer (DETR) model trained end-to-end on COCO 2017
  object detection (118k annotated images).
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/detr-resnet-50/
  md: https://developers.cloudflare.com/workers-ai/models/detr-resnet-50/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/deepseek-ai/deepseek-r1-distill-qwen-32b \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## deepseek-coder-6.7b-instruct-awq Beta

**URL:** llms-txt#deepseek-coder-6.7b-instruct-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • thebloke

@hf/thebloke/deepseek-coder-6.7b-instruct-awq

Deepseek Coder is composed of a series of code language models, each trained from scratch on 2T tokens, with a composition of 87% code and 13% natural language in both English and Chinese.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| Terms and License | [link](https://huggingface.co/TheBloke/deepseek-coder-6.7B-instruct-AWQ) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@hf/thebloke/deepseek-coder-6.7b-instruct-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: deepseek-r1-distill-qwen-32b · Cloudflare Workers AI docs
description: DeepSeek-R1-Distill-Qwen-32B is a model distilled from DeepSeek-R1
  based on Qwen2.5. It outperforms OpenAI-o1-mini across various benchmarks,
  achieving new state-of-the-art results for dense models.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/deepseek-r1-distill-qwen-32b/
  md: https://developers.cloudflare.com/workers-ai/models/deepseek-r1-distill-qwen-32b/index.md
---

![DeepSeek logo](https://developers.cloudflare.com/_astro/deepseek.Dn1KbMH4.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@hf/thebloke/deepseek-coder-6.7b-instruct-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@hf/thebloke/deepseek-coder-6.7b-instruct-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@hf/thebloke/deepseek-coder-6.7b-instruct-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@hf/thebloke/deepseek-coder-6.7b-instruct-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## mistral-7b-instruct-v0.1-awq Beta

**URL:** llms-txt#mistral-7b-instruct-v0.1-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • thebloke

@hf/thebloke/mistral-7b-instruct-v0.1-awq

Mistral 7B Instruct v0.1 AWQ is an efficient, accurate and blazing-fast low-bit weight quantized Mistral variant.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| More information | [link](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-AWQ) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@hf/thebloke/mistral-7b-instruct-v0.1-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: mistral-7b-instruct-v0.2 · Cloudflare Workers AI docs
description: "The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an
  instruct fine-tuned version of the Mistral-7B-v0.2. Mistral-7B-v0.2 has the
  following changes compared to Mistral-7B-v0.1: 32k context window (vs 8k
  context in v0.1), rope-theta = 1e6, and no Sliding-Window Attention."
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/mistral-7b-instruct-v0.2/
  md: https://developers.cloudflare.com/workers-ai/models/mistral-7b-instruct-v0.2/index.md
---

![MistralAI logo](https://developers.cloudflare.com/_astro/mistralai.Bn9UMUMu.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@hf/thebloke/mistral-7b-instruct-v0.1-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@hf/thebloke/mistral-7b-instruct-v0.1-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@hf/thebloke/mistral-7b-instruct-v0.1-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@hf/thebloke/mistral-7b-instruct-v0.1-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## zephyr-7b-beta-awq Beta

**URL:** llms-txt#zephyr-7b-beta-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas
- Create and run tunnel (`cloudflared`)
- Cloud platform setup guides
- Next steps
- VPC Service configuration

Text Generation • thebloke

@hf/thebloke/zephyr-7b-beta-awq

Zephyr 7B Beta AWQ is an efficient, accurate and blazing-fast low-bit weight quantized Zephyr model variant.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| More information | [link](https://huggingface.co/TheBloke/zephyr-7B-beta-AWQ) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@hf/thebloke/zephyr-7b-beta-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: Cloudflare Tunnel · Cloudflare Workers VPC
description: Cloudflare Tunnel creates secure connections from your
  infrastructure to Cloudflare's global network, providing the network
  connectivity that allows Workers to access your private resources.
lastUpdated: 2025-11-14T21:25:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-vpc/configuration/tunnel/
  md: https://developers.cloudflare.com/workers-vpc/configuration/tunnel/index.md
---

Cloudflare Tunnel creates secure connections from your infrastructure to Cloudflare's global network, providing the network connectivity that allows Workers to access your private resources.

When you create a VPC Service, you specify a tunnel ID and target service. Workers VPC then routes requests from your Worker to the specified tunnel, which establishes a connection to the specified hostname or IP address, such that the target service receives the request and returns a response back to your Worker.

To allow members to create VPC Services that represent a target service reachable via a tunnel, you must assign them the **Connectivity Directory Admin** role. Members must possess **Connectivity Directory Bind** role to bind to existing VPC Services from worker.

The tunnel maintains persistent connections to Cloudflare, eliminating the need for inbound firewall rules or public IP addresses.

This section provides tunnel configuration specific to Workers VPC use cases. For comprehensive tunnel documentation including monitoring and advanced configurations, refer to the [full Cloudflare Tunnel documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/).

## Create and run tunnel (`cloudflared`)

Cloudflare Tunnel requires the installation of a lightweight and highly scalable server-side daemon, `cloudflared`, to connect your infrastructure to Cloudflare.

Version and Configuration

Ensure you are running `cloudflared` version 2025.7.0 or later (latest version recommended) to ensure proper DNS resolution and connectivity. Older versions are not supported.

Workers VPC also requires Cloudflare Tunnel to connect using the [QUIC transport protocol](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/cloudflared-parameters/run-parameters/#protocol) using `auto` or `quic`. Ensure outbound UDP traffic on port 7844 is allowed through your firewall for QUIC connections.

Cloudflare Tunnels can be created one of two ways:

1. **Remotely-managed tunnels (recommended):** Remotely-managed configurations are stored on Cloudflare, allowing you to manage the tunnel from any machine using the dashboard, API, or Terraform.
2. **Locally-managed tunnels:** A locally-managed tunnel is created by running `cloudflared tunnel create <NAME>` on the command line. Tunnel configuration is stored in your local cloudflared directory.

For Workers VPC, we recommend creating a remotely-managed tunnel through the dashboard. Follow the [Tunnels for Workers VPC dashboard setup guide](https://developers.cloudflare.com/workers-vpc/get-started/) to create your tunnel with provided installation commands shown in the dashboard.

For locally-managed tunnels, refer to the [`cloudflared` locally-managed tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/) guide. For manual installation, refer to the [`cloudflared` downloads page](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/) for platform-specific installation instructions.

Cloudflare Tunnels can either be configured for usage with [Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/) or [Workers VPC](https://developers.cloudflare.com/workers-vpc/).

Use Tunnels with Zero Trust when you are exposing internal applications securely to your employees with Cloudflare Access and hostnames.

Use Tunnels with Workers VPC when you want to access private APIs, private databases, internal services or other HTTP services within your cloud or on-premise private network from Workers.

The same `cloudflared` instance can be used to cover both Zero Trust and Workers VPC use cases simultaneously.

[Ingress configurations](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/configuration-file/) for locally-managed tunnels are only relevant when using tunnels to expose services to the public internet, and are not required for Workers VPC as routing is handled by the VPC Service configuration.

## Cloud platform setup guides

For platform-specific tunnel deployment instructions for production workloads:

* [AWS](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/aws/) - Deploy tunnels in Amazon Web Services
* [Azure](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/azure/) - Deploy tunnels in Microsoft Azure
* [Google Cloud](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/google-cloud-platform/) - Deploy tunnels in Google Cloud Platform
* [Kubernetes](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/kubernetes/) - Deploy tunnels in Kubernetes clusters
* [Terraform](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/terraform/) - Deploy tunnels using Infrastructure as Code

Refer to the full Cloudflare Tunnel documentation on [how to setup Tunnels for high availability and failover with replicas](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-availability/).

We do not recommend using `cloudflared` in autoscaling setups because downscaling (removing replicas) will break existing user connections to that replica. Additionally, `cloudflared` does not load balance across replicas; replicas are strictly for high availability and requests are routed to the nearest replica.

* Configure [VPC Services](https://developers.cloudflare.com/workers-vpc/configuration/vpc-services/) to connect your tunnels to Workers
* Review [hardware requirements](https://developers.cloudflare.com/workers-vpc/configuration/tunnel/hardware-requirements/) for capacity planning
* Review the [complete Cloudflare Tunnel documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) for advanced features

<page>
---
title: VPC Services · Cloudflare Workers VPC
description: VPC Services are the core building block of Workers VPC. They
  represent specific resources in your private network that Workers can access
  through Cloudflare Tunnel.
lastUpdated: 2025-11-13T14:53:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-vpc/configuration/vpc-services/
  md: https://developers.cloudflare.com/workers-vpc/configuration/vpc-services/index.md
---

VPC Services are the core building block of Workers VPC. They represent specific resources in your private network that Workers can access through Cloudflare Tunnel.

You can use bindings to connect to VPC Services from Workers. Every request made to a VPC Service using its `fetch` function will be securely routed to the configured service in the private network.

VPC Services enforce that requests are routed to their intended service without exposing the entire network, securing your workloads and preventing server-side request forgery (SSRF).

Members must possess **Connectivity Directory Bind** role to bind to existing VPC Services from Workers. Creating VPC Services requires members to possess the **Connectivity Directory Admin** role.

Workers VPC is currently in beta. Features and APIs may change before general availability. While in beta, Workers VPC is available for free to all Workers plans.

## VPC Service configuration

A VPC Service consists of:

* **Type**: Currently only `http` is supported (support for `tcp` coming soon)
* **Tunnel ID**: The Cloudflare Tunnel that provides network connectivity
* **Hostname or IPv4/IPv6 addresses**: The hostname, or IPv4 and/or IPv6 addresses to use to route to your service from the tunnel in your private network
* **Ports**: HTTP and/or HTTPS port configuration (optional, defaults to 80/443)
* **Resolver IPs**: Optionally, a specific resolver IP can be provided -- when not provided, `cloudflared` will direct DNS traffic to the currently configured default system resolver.

Requests are encrypted in flight until they reach your network via a tunnel, regardless of the scheme used in the URL provided to `fetch`. If the `http` scheme is used, a plaintext connection is established to the service from the tunnel.

The `https` scheme can be used for an encrypted connection within your network, between the tunnel and your service. When the `https` scheme is specified, a hostname provided to the `fetch()` operation is utilized as the Server Name Indication (SNI) value.

VPC Services default to allowing both `http` and `https` schemes to be used. You can provide values for only one of `http_port` or `https_port` to enforce the use of a particular scheme.

When Workers VPC is unable to establish a connection to your service, `fetch()` will throw an exception.

The [VPC Service configuration](https://developers.cloudflare.com/workers-vpc/configuration/vpc-services/#vpc-service-configuration) host and port(s) will always be used to connect and route requests to your services, even if a different host or port is present in the URL provided to the `fetch()` operation in the Worker code.

The host provided in the `fetch()` operation is not used to route requests, and instead only populates the `Host` field for a HTTP request, or `Host` and the Server Name Indication (SNI) value presented to your service for a HTTPS request.

The port provided in the `fetch()` operation is ignored — the port specified in the VPC Service configuration for the provided scheme will be used.

## Configuration example

The following is an example of a VPC Service for a service using custom HTTP and HTTPS ports, and both IPv4 and IPv6 addresses. These configurations represent the expected contract of the [REST API for creating a VPC Service](https://developers.cloudflare.com/api/resources/connectivity/subresources/directory/subresources/services/), a type of service within the broader connectivity directory.

The following is an example of a VPC Service for a service using custom HTTP and HTTPS ports as well, using a hostname. Note that since we are using a hostname, we must provide our service with a `resolver_network` that optionally has `resolver_ips`.

## Workers binding configuration

Once you have created a VPC Service, you can bind it to your Worker:

You can have multiple VPC service bindings:

* Set up [Cloudflare Tunnel](https://developers.cloudflare.com/workers-vpc/configuration/tunnel/) for your environment
* Learn about the [Service Binding API](https://developers.cloudflare.com/workers-vpc/api/)
* Refer to [examples](https://developers.cloudflare.com/workers-vpc/examples/) of common use cases

<page>
---
title: Access a private API or website · Cloudflare Workers VPC
description: This example demonstrates how to access a private REST API that is
  not exposed to the public internet. In this guide, we will configure a VPC
  Service for an internal API, create a Worker that makes requests to that API,
  and deploy the Worker to validate our changes.
lastUpdated: 2025-11-12T17:52:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-vpc/examples/private-api/
  md: https://developers.cloudflare.com/workers-vpc/examples/private-api/index.md
---

This example demonstrates how to access a private REST API that is not exposed to the public internet. In this guide, we will configure a VPC Service for an internal API, create a Worker that makes requests to that API, and deploy the Worker to validate our changes.

* A virtual machine/EC2 instance running in your VPC/virtual network
* A private API or website running in your VPC/virtual network with security rules allowing access to the virtual machine that will be running `cloudflared`
* Workers account with Workers VPC access

## 1. Set up Cloudflare Tunnel

A Cloudflare Tunnel creates a secure connection from your private network to Cloudflare. This tunnel will allow Workers to securely access your private resources.

1. Navigate to the [Workers VPC dashboard](https://dash.cloudflare.com/?to=/:account/workers/vpc/tunnels) and select the **Tunnels** tab.

2. Select **Create** to create a new tunnel.

3. Enter a name for your tunnel (for example, `private-api-tunnel`) and select **Save tunnel**.

4. Choose your operating system and architecture. The dashboard will provide specific installation instructions for your environment.

5. Follow the provided commands to download and install `cloudflared` on your VM, and execute the service installation command with your unique token.

The dashboard will confirm when your tunnel is successfully connected. Note the tunnel ID for the next step.

## 2. Create the Workers VPC Service

First, create a Workers VPC Service for your internal API:

You can also create a VPC Service for a service using its hostname:

Note the service ID returned for the next step.

## 3. Configure your Worker

Update your `wrangler.toml`:

## 4. Implement the Worker

In your Workers code, use the VPC Service binding in order to send requests to the service:

This guide demonstrates how you could create a simple proxy in your Workers. However, you could use VPC Services to fetch APIs directly and manipulate the responses to enable you to build more full-stack and backend functionality on Workers.

## 5. Deploy and test

Now, you can deploy and test your Worker that you have created:

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@hf/thebloke/zephyr-7b-beta-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@hf/thebloke/zephyr-7b-beta-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@hf/thebloke/zephyr-7b-beta-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@hf/thebloke/zephyr-7b-beta-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## tinyllama-1.1b-chat-v1.0 Beta

**URL:** llms-txt#tinyllama-1.1b-chat-v1.0-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • tinyllama

@cf/tinyllama/tinyllama-1.1b-chat-v1.0

The TinyLlama project aims to pretrain a 1.1B Llama model on 3 trillion tokens. This is the chat model finetuned on top of TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 2,048 tokens |
| More information | [link](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/tinyllama/tinyllama-1.1b-chat-v1.0)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: uform-gen2-qwen-500m · Cloudflare Workers AI docs
description: "UForm-Gen is a small generative vision-language model primarily
  designed for Image Captioning and Visual Question Answering. The model was
  pre-trained on the internal image captioning dataset and fine-tuned on public
  instructions datasets: SVIT, LVIS, VQAs datasets."
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/uform-gen2-qwen-500m/
  md: https://developers.cloudflare.com/workers-ai/models/uform-gen2-qwen-500m/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/tinyllama/tinyllama-1.1b-chat-v1.0", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/tinyllama/tinyllama-1.1b-chat-v1.0", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/tinyllama/tinyllama-1.1b-chat-v1.0 \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## openchat-3.5-0106 Beta

**URL:** llms-txt#openchat-3.5-0106-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • openchat

@cf/openchat/openchat-3.5-0106

OpenChat is an innovative library of open-source language models, fine-tuned with C-RLFT - a strategy inspired by offline reinforcement learning.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 8,192 tokens |
| More information | [link](https://huggingface.co/openchat/openchat-3.5-0106) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/openchat/openchat-3.5-0106)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: openhermes-2.5-mistral-7b-awq · Cloudflare Workers AI docs
description: OpenHermes 2.5 Mistral 7B is a state of the art Mistral Fine-tune,
  a continuation of OpenHermes 2 model, which trained on additional code
  datasets.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/openhermes-2.5-mistral-7b-awq/
  md: https://developers.cloudflare.com/workers-ai/models/openhermes-2.5-mistral-7b-awq/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/openchat/openchat-3.5-0106", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/openchat/openchat-3.5-0106", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/openchat/openchat-3.5-0106",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/openchat/openchat-3.5-0106 \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## deepseek-coder-6.7b-base-awq Beta

**URL:** llms-txt#deepseek-coder-6.7b-base-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • thebloke

@hf/thebloke/deepseek-coder-6.7b-base-awq

Deepseek Coder is composed of a series of code language models, each trained from scratch on 2T tokens, with a composition of 87% code and 13% natural language in both English and Chinese.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| Terms and License | [link](https://huggingface.co/TheBloke/deepseek-coder-6.7B-base-AWQ) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@hf/thebloke/deepseek-coder-6.7b-base-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: deepseek-math-7b-instruct · Cloudflare Workers AI docs
description: DeepSeekMath-Instruct 7B is a mathematically instructed tuning
  model derived from DeepSeekMath-Base 7B. DeepSeekMath is initialized with
  DeepSeek-Coder-v1.5 7B and continues pre-training on math-related tokens
  sourced from Common Crawl, together with natural language and code data for
  500B tokens.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/deepseek-math-7b-instruct/
  md: https://developers.cloudflare.com/workers-ai/models/deepseek-math-7b-instruct/index.md
---

![DeepSeek logo](https://developers.cloudflare.com/_astro/deepseek.Dn1KbMH4.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@hf/thebloke/deepseek-coder-6.7b-base-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@hf/thebloke/deepseek-coder-6.7b-base-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@hf/thebloke/deepseek-coder-6.7b-base-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@hf/thebloke/deepseek-coder-6.7b-base-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## qwen1.5-14b-chat-awq Beta

**URL:** llms-txt#qwen1.5-14b-chat-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • Qwen

@cf/qwen/qwen1.5-14b-chat-awq

Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud. AWQ is an efficient, accurate and blazing-fast low-bit weight quantization method, currently supporting 4-bit quantization.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 7,500 tokens |
| More information | [link](https://huggingface.co/qwen/qwen1.5-14b-chat-awq) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/qwen/qwen1.5-14b-chat-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: qwen1.5-7b-chat-awq · Cloudflare Workers AI docs
description: Qwen1.5 is the improved version of Qwen, the large language model
  series developed by Alibaba Cloud. AWQ is an efficient, accurate and
  blazing-fast low-bit weight quantization method, currently supporting 4-bit
  quantization.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/qwen1.5-7b-chat-awq/
  md: https://developers.cloudflare.com/workers-ai/models/qwen1.5-7b-chat-awq/index.md
---

![Qwen logo](https://developers.cloudflare.com/_astro/qwen.B8ST_F2H.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/qwen/qwen1.5-14b-chat-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/qwen/qwen1.5-14b-chat-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/qwen/qwen1.5-14b-chat-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/qwen/qwen1.5-14b-chat-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## qwen1.5-1.8b-chat Beta

**URL:** llms-txt#qwen1.5-1.8b-chat-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • Qwen

@cf/qwen/qwen1.5-1.8b-chat

Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 32,000 tokens |
| More information | [link](https://huggingface.co/qwen/qwen1.5-1.8b-chat) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/qwen/qwen1.5-1.8b-chat)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: qwen1.5-14b-chat-awq · Cloudflare Workers AI docs
description: Qwen1.5 is the improved version of Qwen, the large language model
  series developed by Alibaba Cloud. AWQ is an efficient, accurate and
  blazing-fast low-bit weight quantization method, currently supporting 4-bit
  quantization.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/qwen1.5-14b-chat-awq/
  md: https://developers.cloudflare.com/workers-ai/models/qwen1.5-14b-chat-awq/index.md
---

![Qwen logo](https://developers.cloudflare.com/_astro/qwen.B8ST_F2H.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/qwen/qwen1.5-1.8b-chat", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/qwen/qwen1.5-1.8b-chat", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/qwen/qwen1.5-1.8b-chat",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/qwen/qwen1.5-1.8b-chat \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## Using azure-cli

**URL:** llms-txt#using-azure-cli

**Contents:**
- Set up your Okta SCIM application
- Integrate the Cloudflare API
- Configure user & group sync in Okta
- Restore Super Administrator after group misconfiguration
- 1. Allow Hyperdrive access
  - AWS Console
  - Retrieve the database endpoint (Aurora)
  - Retrieve the database endpoint (RDS MySQL)
- 2. Create your user

az login
az account get-access-token --resource https://graph.microsoft.com

(payload with accessToken returned)
curl
curl -X POST 'https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
    "displayName": "Entra API create application test"
}'
curl
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.applicationServicePrincipal",
  "application": {
    "id": "343a8552-f9d9-471c-b677-d37062117cc8", //
    "appId": "03d8207b-e837-4be9-b4e6-180492eb3b61",
    "applicationTemplateId": "8adf8e6e-67b2-4cf2-a259-e3dc5476c621",
    "createdDateTime": "2025-01-30T00:37:44Z",
    "deletedDateTime": null,
    "displayName": "Entra API create application test",
    "description": null,
    // ... snipped rest of large application payload
  },
  "servicePrincipal": {
    "id": "a8cb133d-f841-4eb9-8bc9-c8e9e8c0d417", // Note this ID for the subsequent request
    "deletedDateTime": null,
    "accountEnabled": true,
    "appId": "03d8207b-e837-4be9-b4e6-180492eb3b61",
    "applicationTemplateId": "8adf8e6e-67b2-4cf2-a259-e3dc5476c621",
    "appDisplayName": "Entra API create application test",
  // ...snipped rest of JSON payload
}
}
curl
curl -X POST 'https://graph.microsoft.com/v1.0/servicePrincipals/<SERVICE_PRINCIPAL_ID>/synchronization/jobs' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
    "templateId": "scim"
}'
curl
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#servicePrincipals('a8cb133d-f841-4eb9-8bc9-c8e9e8c0d417')/synchronization/jobs/$entity",
  "id": "scim.5b223a2cc249463bbd9a791550f11c76.03d8207b-e837-4be9-b4e6-180492eb3b61",
  "templateId": "scim",
  "schedule": {
    "expiration": null,
    "interval": "PT40M",
    "state": "Disabled"
  },
}
// ... snipped rest of JSON payload
curl
 --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
  "value": [
    {
      "key": "BaseAddress",
      "value": "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/scim/v2"
    },
    {
      "key": "SecretToken",
      "value": "<SCIM_PROVISIONING_API_TOKEN_VALUE>"
    }
  ]
}'
curl
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/members" \
  -H "Authorization: Bearer YOUR_SCIM_AOT" \
  -H "Content-Type: application/json"
curl
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/members/{member_id}" \
  -H "Authorization: Bearer YOUR_SCIM_AOT" \
  -H "Content-Type: application/json" \
  -d '{
    "roles": [
      {
        "id": "33666b9c79b9a5273fc7344ff42f953d"
      }
    ]
  }'
sh

**Examples:**

Example 1 (unknown):
```unknown
**2. Create a new application via template.**

The template ID 8adf8e6e-67b2-4cf2-a259-e3dc5476c621 is the suggested template to create non-gallery apps in the Entra docs. Replace `<accessToken>` and `displayName` with your values.
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
**3. Create a provisioning job**

To enable provisioning, you will also need to create a job. Note the SERVICE\_PRINCIPAL\_ID in the previous request will be used in the request below. The SCIM templateId is an Entra provided template.
```

Example 4 (unknown):
```unknown

```

---

## cmu requestCertificate -c="US" -o="Example, Inc." -cn="azure-dedicatedhsm.example.com" -s="California" -l="San Francisco" -publichandle=48 -privatehandle=51 -outputfile="rsa.csr" -sha256withrsa

**URL:** llms-txt#cmu-requestcertificate--c="us"--o="example,-inc."--cn="azure-dedicatedhsm.example.com"--s="california"--l="san-francisco"--publichandle=48--privatehandle=51--outputfile="rsa.csr"--sha256withrsa

**Contents:**
- 3. Obtain and upload a signed certificate from your Certificate Authority (CA)
- 4. Modify your gokeyless config file and restart the service
- Before you start
- 1. Create a VM
- 2. Deploy the keyless server
- 3. Set up the Azure CLI
- 4. Set up the Managed HSM
- 5. Restart gokeyless
- PKCS#11 URI
- Examples

Please enter password for token in slot 0 : ********
Using "CKM_SHA256_RSA_PKCS" Mechanism
yaml
private_key_stores:
  - dir: /etc/keyless/keys
yaml
- uri: pkcs11:token=KeylessSSL;object=myrsakey?module-path=/usr/safenet/lunaclient/lib/libCryptoki2_64.so&pin-value=password&max-sessions=1
sh
sudo systemctl restart gokeyless.service
sudo systemctl status gokeyless.service -l
plaintext
brew install azure-cli
sh
   az login
   az group create --name HSMgroup --location southcentralus
   plaintext
   az keyvault key import --hsm-name "KeylessHSM" --name "hsm-pub-keyless" --pem-file server.key
   plaintext
      az keyvault role assignment create  --hsm-name KeylessHSM --assignee $(az vm identity show --name "hsmtestvm" --resource-group "HSMgroup" --query principalId -o tsv) --scope / --role "Managed HSM Crypto User"
      plaintext
sudo systemctl restart gokeyless.service
sudo systemctl status gokeyless.service -l
sh
pkcs11-tool --module <module path> --list-token-slots
bash
pkcs11-tool --module <module path> --pin <pin> \
    --list-token-slots --login --list-objects
txt
pkcs11:path-component[?query-component]
txt
private_key_stores:
- uri: pkcs11:token=SoftHSM2%20RSA%20Token;id=%03?module-path=/usr/lib64/libsofthsm2.so&pin-value=1234
- uri: pkcs11:token=accelerator;object=thaleskey?module-path=/opt/nfast/toolkits/pkcs11/libcknfast.so
- uri: pkcs11:token=YubiKey%20PIV;id=%00?module-path=/usr/lib64/libykcs11.so&pin-value=123456&max-sessions=1
- uri: pkcs11:token=elab2parN;id=%04?module-path=/usr/lib/libCryptoki2_64.so&pin-value=crypto1
txt
pkcs11-tool --module /opt/nfast/toolkits/pkcs11/libcknfast.so -O
txt
Using slot 0 with a present token (0x1d622495)
Private Key Object; RSA
  label:      rsa-privkey
  ID:         105013281578de42ea45f5bfac46d302fb006687
  Usage:      decrypt, sign, unwrap
warning: PKCS11 function C_GetAttributeValue(ALWAYS_AUTHENTICATE) failed: rv = CKR_ATTRIBUTE_TYPE_INVALID (0x12)

Public Key Object; RSA 2048 bits
  label:      rsa-privkey
  ID:         105013281578de42ea45f5bfac46d302fb006687
  Usage:      encrypt, verify, wrap
yaml
private_key_stores:
  - dir: /etc/keyless/keys
yaml
- uri: pkcs11:token=accelerator;object=rsa-privkey?module-path=/opt/nfast/toolkits/pkcs11/libcknfast.so&max-sessions=4
sh
sudo systemctl restart gokeyless.service
sudo systemctl status gokeyless.service -l
sh
sudo systemctl restart gokeyless.service
sudo systemctl status gokeyless.service -l
txt
vm$ ssh admin@hsm

[cloudflare-hsm.softlayer.com] lunash:>partition create -partition KeylessSSL

Type 'proceed' to create the partition, or
          'quit' to quit now.
          > proceed
'partition create' successful.

Command Result : 0 (Success)
bash
[cloudflare-hsm.softlayer.com] lunash:>client assignpartition -client cloudflare-vm.softlayer.com -partition KeylessSSL

'client assignPartition' successful.

Command Result : 0 (Success)
txt
vm$ lunacm
LunaCM v7.1.0-379. Copyright (c) 2006-2017 SafeNet.

Slot Id ->              0
    Label ->
    Serial Number ->        XXXXXXXXXXXXX
    Model ->                LunaSA 7.0.0
    Firmware Version ->     7.0.1
    Configuration ->        Luna User Partition With SO (PW) Signing With Cloning Mode
    Slot Description ->     Net Token Slot

lunacm:>partition init -label KeylessSSL -domain cloudflare

Enter password for Partition SO: ********

Re-enter password for Partition SO: ********

You are about to initialize the partition.
  All contents of the partition will be destroyed.

Are you sure you wish to continue?

Type 'proceed' to continue, or 'quit' to quit now ->proceed

Command Result : No Error
txt
vm$ cmu generatekeypair -keyType=RSA -modulusBits=2048 -publicExponent=65537 -sign=1 -verify=1 -labelpublic=myrsakey -labelprivate=myrsakey -keygenmech=1  -id=a000
Please enter password for token in slot 0 : ********

**Examples:**

Example 1 (unknown):
```unknown
***

## 3. Obtain and upload a signed certificate from your Certificate Authority (CA)

Provide the CSR created in the previous step to your organization's preferred CA, demonstrate control of your domain as requested, and then download the signed SSL certificates. Follow the instructions provided in [Upload Keyless SSL Certificates](https://developers.cloudflare.com/ssl/keyless-ssl/configuration/cloudflare-tunnel/#3-upload-keyless-ssl-certificates).

***

## 4. Modify your gokeyless config file and restart the service

Lastly, we need to modify the configuration file that the key server will read on startup. Be sure to change the `object=mykey` and `pin-value=username:password` values to match the key label you provided and CU user you created.

Open `/etc/keyless/gokeyless.yaml` and immediately after:
```

Example 2 (unknown):
```unknown
add:
```

Example 3 (unknown):
```unknown
With the config file saved, restart `gokeyless` and verify it started successfully.
```

Example 4 (unknown):
```unknown
</page>

<page>
---
title: Azure Managed HSM · Cloudflare SSL/TLS docs
description: This tutorial uses Microsoft Azure’s Managed HSM to deploy a VM
  with the Keyless SSL daemon. Follow these instructions to deploy your keyless
  server.
lastUpdated: 2025-10-09T15:47:46.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-managed-hsm/
  md: https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-managed-hsm/index.md
---

This tutorial uses [Microsoft Azure’s Managed HSM](https://azure.microsoft.com/en-us/updates/akv-managed-hsm-public-preview/) — a FIPS 140-2 Level 3 certified implementation — to deploy a VM with the Keyless SSL daemon.

***

## Before you start

Make sure you have:

* Followed Microsoft's [tutorial](https://docs.microsoft.com/en-us/azure/key-vault/managed-hsm/quick-create-cli) for provisioning and activating the managed HSM
* Set up a VM for your key server

***

## 1. Create a VM

Create a VM where you will deploy the keyless daemon.

***

## 2. Deploy the keyless server

Follow [these instructions](https://developers.cloudflare.com/ssl/keyless-ssl/configuration/cloudflare-tunnel/#4-set-up-and-activate-key-server) to deploy your keyless server.

***

## 3. Set up the Azure CLI

Set up the Azure CLI (used to access the private key).

For example, if you were using macOS:
```

---

## phi-2 Beta

**URL:** llms-txt#phi-2-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • Microsoft

Phi-2 is a Transformer-based model with a next-word prediction objective, trained on 1.4T tokens from multiple passes on a mixture of Synthetic and Web datasets for NLP and coding.

| Model Info | |
| - | - |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 2,048 tokens |
| More information | [link](https://huggingface.co/microsoft/phi-2) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/microsoft/phi-2)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: phoenix-1.0 · Cloudflare Workers AI docs
description: Phoenix 1.0 is a model by Leonardo.Ai that generates images with
  exceptional prompt adherence and coherent text.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/phoenix-1.0/
  md: https://developers.cloudflare.com/workers-ai/models/phoenix-1.0/index.md
---

![Leonardo logo](https://developers.cloudflare.com/_astro/leonardo.OdhR6aP9.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/microsoft/phi-2", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/microsoft/phi-2", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/microsoft/phi-2",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/microsoft/phi-2 \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## Anthropic API key

**URL:** llms-txt#anthropic-api-key

npx wrangler secret put ANTHROPIC_API_KEY

---

## discolm-german-7b-v1-awq Beta

**URL:** llms-txt#discolm-german-7b-v1-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • thebloke

@cf/thebloke/discolm-german-7b-v1-awq

DiscoLM German 7b is a Mistral-based large language model with a focus on German-language applications. AWQ is an efficient, accurate and blazing-fast low-bit weight quantization method, currently supporting 4-bit quantization.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| More information | [link](https://huggingface.co/TheBloke/DiscoLM_German_7b_v1-AWQ) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/thebloke/discolm-german-7b-v1-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: distilbert-sst-2-int8 · Cloudflare Workers AI docs
description: Distilled BERT model that was finetuned on SST-2 for sentiment classification
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/distilbert-sst-2-int8/
  md: https://developers.cloudflare.com/workers-ai/models/distilbert-sst-2-int8/index.md
---

![HuggingFace logo](https://developers.cloudflare.com/_astro/huggingface.DHiS2HZA.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/thebloke/discolm-german-7b-v1-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/thebloke/discolm-german-7b-v1-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/thebloke/discolm-german-7b-v1-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/thebloke/discolm-german-7b-v1-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## falcon-7b-instruct Beta

**URL:** llms-txt#falcon-7b-instruct-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • tiiuae

@cf/tiiuae/falcon-7b-instruct

Falcon-7B-Instruct is a 7B parameters causal decoder-only model built by TII based on Falcon-7B and finetuned on a mixture of chat/instruct datasets.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| More information | [link](https://huggingface.co/tiiuae/falcon-7b-instruct) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/tiiuae/falcon-7b-instruct)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: flux · Cloudflare Workers AI docs
description: Flux is the first conversational speech recognition model built
  specifically for voice agents.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/flux/
  md: https://developers.cloudflare.com/workers-ai/models/flux/index.md
---

![Deepgram logo](https://developers.cloudflare.com/_astro/deepgram.DVGPhlbc.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/tiiuae/falcon-7b-instruct", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/tiiuae/falcon-7b-instruct", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/tiiuae/falcon-7b-instruct",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/tiiuae/falcon-7b-instruct \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## qwen1.5-7b-chat-awq Beta

**URL:** llms-txt#qwen1.5-7b-chat-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • Qwen

@cf/qwen/qwen1.5-7b-chat-awq

Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud. AWQ is an efficient, accurate and blazing-fast low-bit weight quantization method, currently supporting 4-bit quantization.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 20,000 tokens |
| More information | [link](https://huggingface.co/qwen/qwen1.5-7b-chat-awq) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/qwen/qwen1.5-7b-chat-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: qwen2.5-coder-32b-instruct · Cloudflare Workers AI docs
description: "Qwen2.5-Coder is the latest series of Code-Specific Qwen large
  language models (formerly known as CodeQwen). As of now, Qwen2.5-Coder has
  covered six mainstream model sizes, 0.5, 1.5, 3, 7, 14, 32 billion parameters,
  to meet the needs of different developers. Qwen2.5-Coder brings the following
  improvements upon CodeQwen1.5:"
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/qwen2.5-coder-32b-instruct/
  md: https://developers.cloudflare.com/workers-ai/models/qwen2.5-coder-32b-instruct/index.md
---

![Qwen logo](https://developers.cloudflare.com/_astro/qwen.B8ST_F2H.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/qwen/qwen1.5-7b-chat-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/qwen/qwen1.5-7b-chat-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## gpt-oss-120b

**URL:** llms-txt#gpt-oss-120b

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • OpenAI

@cf/openai/gpt-oss-120b

OpenAI’s open-weight models designed for powerful reasoning, agentic tasks, and versatile developer use cases – gpt-oss-120b is for production, general purpose, high reasoning use-cases.

| Model Info | |
| - | - |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 128,000 tokens |
| Unit Pricing | $0.35 per M input tokens, $0.75 per M output tokens |

\* indicates a required field

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.

* `requests` array required

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.

The following schemas are based on JSON Schema

<page>
---
title: gpt-oss-20b · Cloudflare Workers AI docs
description: OpenAI’s open-weight models designed for powerful reasoning,
  agentic tasks, and versatile developer use cases – gpt-oss-20b is for lower
  latency, and local or specialized use-cases.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/
  md: https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/index.md
---

![OpenAI logo](https://developers.cloudflare.com/_astro/openai.ChTKThcR.svg)

**Examples:**

Example 1 (ts):
```ts
export default {
  async fetch(request, env): Promise<Response> {
    const response = await env.AI.run('@cf/openai/gpt-oss-120b', {
      instructions: 'You are a concise assistant.',
      input: 'What is the origin of the phrase Hello, World?',
    });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests


ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/v1/responses",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "model": "@cf/openai/gpt-oss-120b",
      "input": "Tell me all about PEP-8"
    }
)
result = response.json()
print(result)
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/v1/responses   -H "Content-Type: application/json"   -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN"   -d '{
    "model": "@cf/openai/gpt-oss-120b",
    "input": "What are the benefits of open-source models?"
  }'
```

Example 4 (json):
```json
{
      "oneOf": [
          {
              "type": "object",
              "title": "Responses",
              "properties": {
                  "input": {
                      "anyOf": [
                          {
                              "type": "string"
                          },
                          {
                              "items": {},
                              "type": "array"
                          }
                      ],
                      "description": "Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types"
                  },
                  "reasoning": {
                      "type": "object",
                      "properties": {
                          "effort": {
                              "type": "string",
                              "description": "Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.",
                              "enum": [
                                  "low",
                                  "medium",
                                  "high"
                              ]
                          },
                          "summary": {
                              "type": "string",
                              "description": "A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.",
                              "enum": [
                                  "auto",
                                  "concise",
                                  "detailed"
                              ]
                          }
                      }
                  }
              },
              "required": [
                  "input"
              ]
          },
          {
              "type": "object",
              "title": "Async Request",
              "properties": {
                  "requests": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "input": {
                                  "anyOf": [
                                      {
                                          "type": "string"
                                      },
                                      {
                                          "items": {},
                                          "type": "array"
                                      }
                                  ],
                                  "description": "Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types"
                              },
                              "reasoning": {
                                  "type": "object",
                                  "properties": {
                                      "effort": {
                                          "type": "string",
                                          "description": "Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.",
                                          "enum": [
                                              "low",
                                              "medium",
                                              "high"
                                          ]
                                      },
                                      "summary": {
                                          "type": "string",
                                          "description": "A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.",
                                          "enum": [
                                              "auto",
                                              "concise",
                                              "detailed"
                                          ]
                                      }
                                  }
                              }
                          },
                          "required": [
                              "input"
                          ]
                      }
                  }
              },
              "required": [
                  "requests"
              ]
          }
      ]
  }
```

---

## bge-large-en-v1.5

**URL:** llms-txt#bge-large-en-v1.5

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Embeddings • baai

@cf/baai/bge-large-en-v1.5

BAAI general embedding (Large) model that transforms any given text into a 1024-dimensional vector

| Model Info | |
| - | - |
| More information | [link](https://huggingface.co/BAAI/bge-large-en-v1.5) |
| Maximum Input Tokens | 512 |
| Output Dimensions | 1,024 |
| Batch | Yes |
| Unit Pricing | $0.20 per M input tokens |

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `pooling` string default mean

The pooling method used in the embedding process. \`cls\` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is \`mean\` in order for this to not be a breaking change, but we highly suggest using the new \`cls\` pooling for better accuracy.

* `requests` array required

Batch of the embeddings requests to run using async-queue

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `pooling` string default mean

The pooling method used in the embedding process. \`cls\` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is \`mean\` in order for this to not be a breaking change, but we highly suggest using the new \`cls\` pooling for better accuracy.

Embeddings of the requested text values

Floating point embedding representation shaped by the embedding model

The pooling method used in the embedding process.

* `request_id` string

The async request id that can be used to obtain the results.

The following schemas are based on JSON Schema

<page>
---
title: bge-m3 · Cloudflare Workers AI docs
description: Multi-Functionality, Multi-Linguality, and Multi-Granularity embeddings model.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/bge-m3/
  md: https://developers.cloudflare.com/workers-ai/models/bge-m3/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    // Can be a string or array of strings]
    const stories = [
      "This is a story about an orange cloud",
      "This is a story about a llama",
      "This is a story about a hugging emoji",
    ];


    const embeddings = await env.AI.run(
      "@cf/baai/bge-large-en-v1.5",
      {
        text: stories,
      }
    );


    return Response.json(embeddings);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests




ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


stories = [
  'This is a story about an orange cloud',
  'This is a story about a llama',
  'This is a story about a hugging emoji'
]


response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/baai/bge-large-en-v1.5",
  headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
  json={"text": stories}
)


print(response.json())
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/baai/bge-large-en-v1.5  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "text": ["This is a story about an orange cloud", "This is a story about a llama", "This is a story about a hugging emoji"] }'
```

Example 4 (json):
```json
{
      "type": "object",
      "oneOf": [
          {
              "properties": {
                  "text": {
                      "oneOf": [
                          {
                              "type": "string",
                              "description": "The text to embed",
                              "minLength": 1
                          },
                          {
                              "type": "array",
                              "description": "Batch of text values to embed",
                              "items": {
                                  "type": "string",
                                  "description": "The text to embed",
                                  "minLength": 1
                              },
                              "maxItems": 100
                          }
                      ]
                  },
                  "pooling": {
                      "type": "string",
                      "enum": [
                          "mean",
                          "cls"
                      ],
                      "default": "mean",
                      "description": "The pooling method used in the embedding process. `cls` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is `mean` in order for this to not be a breaking change, but we highly suggest using the new `cls` pooling for better accuracy."
                  }
              },
              "required": [
                  "text"
              ]
          },
          {
              "properties": {
                  "requests": {
                      "type": "array",
                      "description": "Batch of the embeddings requests to run using async-queue",
                      "items": {
                          "properties": {
                              "text": {
                                  "oneOf": [
                                      {
                                          "type": "string",
                                          "description": "The text to embed",
                                          "minLength": 1
                                      },
                                      {
                                          "type": "array",
                                          "description": "Batch of text values to embed",
                                          "items": {
                                              "type": "string",
                                              "description": "The text to embed",
                                              "minLength": 1
                                          },
                                          "maxItems": 100
                                      }
                                  ]
                              },
                              "pooling": {
                                  "type": "string",
                                  "enum": [
                                      "mean",
                                      "cls"
                                  ],
                                  "default": "mean",
                                  "description": "The pooling method used in the embedding process. `cls` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is `mean` in order for this to not be a breaking change, but we highly suggest using the new `cls` pooling for better accuracy."
                              }
                          },
                          "required": [
                              "text"
                          ]
                      }
                  }
              },
              "required": [
                  "requests"
              ]
          }
      ]
  }
```

---

## gpt-oss-20b

**URL:** llms-txt#gpt-oss-20b

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • OpenAI

@cf/openai/gpt-oss-20b

OpenAI’s open-weight models designed for powerful reasoning, agentic tasks, and versatile developer use cases – gpt-oss-20b is for lower latency, and local or specialized use-cases.

| Model Info | |
| - | - |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 128,000 tokens |
| Unit Pricing | $0.20 per M input tokens, $0.30 per M output tokens |

\* indicates a required field

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.

* `requests` array required

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types

Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.

A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.

The following schemas are based on JSON Schema

<page>
---
title: granite-4.0-h-micro · Cloudflare Workers AI docs
description: Granite 4.0 instruct models deliver strong performance across
  benchmarks, achieving industry-leading results in key agentic tasks like
  instruction following and function calling. These efficiencies make the models
  well-suited for a wide range of use cases like retrieval-augmented generation
  (RAG), multi-agent workflows, and edge deployments.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/
  md: https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/index.md
---

![IBM logo](https://developers.cloudflare.com/_astro/ibm.Bqbnu_R0.svg)

**Examples:**

Example 1 (ts):
```ts
export default {
  async fetch(request, env): Promise<Response> {
    const response = await env.AI.run('@cf/openai/gpt-oss-20b', {
      instructions: 'You are a concise assistant.',
      input: 'What is the origin of the phrase Hello, World?',
    });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests


ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/v1/responses",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "model": "@cf/openai/gpt-oss-20b",
      "input": "Tell me all about PEP-8"
    }
)
result = response.json()
print(result)
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/v1/responses   -H "Content-Type: application/json"   -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN"   -d '{
    "model": "@cf/openai/gpt-oss-20b",
    "input": "What are the benefits of open-source models?"
  }'
```

Example 4 (json):
```json
{
      "oneOf": [
          {
              "type": "object",
              "title": "Responses",
              "properties": {
                  "input": {
                      "anyOf": [
                          {
                              "type": "string"
                          },
                          {
                              "items": {},
                              "type": "array"
                          }
                      ],
                      "description": "Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types"
                  },
                  "reasoning": {
                      "type": "object",
                      "properties": {
                          "effort": {
                              "type": "string",
                              "description": "Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.",
                              "enum": [
                                  "low",
                                  "medium",
                                  "high"
                              ]
                          },
                          "summary": {
                              "type": "string",
                              "description": "A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.",
                              "enum": [
                                  "auto",
                                  "concise",
                                  "detailed"
                              ]
                          }
                      }
                  }
              },
              "required": [
                  "input"
              ]
          },
          {
              "type": "object",
              "title": "Responses_Async",
              "properties": {
                  "requests": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "input": {
                                  "anyOf": [
                                      {
                                          "type": "string"
                                      },
                                      {
                                          "items": {},
                                          "type": "array"
                                      }
                                  ],
                                  "description": "Responses API Input messages. Refer to OpenAI Responses API docs to learn more about supported content types"
                              },
                              "reasoning": {
                                  "type": "object",
                                  "properties": {
                                      "effort": {
                                          "type": "string",
                                          "description": "Constrains effort on reasoning for reasoning models. Currently supported values are low, medium, and high. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.",
                                          "enum": [
                                              "low",
                                              "medium",
                                              "high"
                                          ]
                                      },
                                      "summary": {
                                          "type": "string",
                                          "description": "A summary of the reasoning performed by the model. This can be useful for debugging and understanding the model's reasoning process. One of auto, concise, or detailed.",
                                          "enum": [
                                              "auto",
                                              "concise",
                                              "detailed"
                                          ]
                                      }
                                  }
                              }
                          },
                          "required": [
                              "input"
                          ]
                      }
                  }
              },
              "required": [
                  "requests"
              ]
          }
      ]
  }
```

---

## bge-base-en-v1.5

**URL:** llms-txt#bge-base-en-v1.5

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Embeddings • baai

@cf/baai/bge-base-en-v1.5

BAAI general embedding (Base) model that transforms any given text into a 768-dimensional vector

| Model Info | |
| - | - |
| More information | [link](https://huggingface.co/BAAI/bge-base-en-v1.5) |
| Maximum Input Tokens | 512 |
| Output Dimensions | 768 |
| Batch | Yes |
| Unit Pricing | $0.067 per M input tokens |

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `pooling` string default mean

The pooling method used in the embedding process. \`cls\` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is \`mean\` in order for this to not be a breaking change, but we highly suggest using the new \`cls\` pooling for better accuracy.

* `requests` array required

Batch of the embeddings requests to run using async-queue

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `pooling` string default mean

The pooling method used in the embedding process. \`cls\` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is \`mean\` in order for this to not be a breaking change, but we highly suggest using the new \`cls\` pooling for better accuracy.

Embeddings of the requested text values

Floating point embedding representation shaped by the embedding model

The pooling method used in the embedding process.

* `request_id` string

The async request id that can be used to obtain the results.

The following schemas are based on JSON Schema

<page>
---
title: bge-large-en-v1.5 · Cloudflare Workers AI docs
description: BAAI general embedding (Large) model that transforms any given text
  into a 1024-dimensional vector
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/
  md: https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    // Can be a string or array of strings]
    const stories = [
      "This is a story about an orange cloud",
      "This is a story about a llama",
      "This is a story about a hugging emoji",
    ];


    const embeddings = await env.AI.run(
      "@cf/baai/bge-base-en-v1.5",
      {
        text: stories,
      }
    );


    return Response.json(embeddings);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests




ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


stories = [
  'This is a story about an orange cloud',
  'This is a story about a llama',
  'This is a story about a hugging emoji'
]


response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5",
  headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
  json={"text": stories}
)


print(response.json())
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/baai/bge-base-en-v1.5  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "text": ["This is a story about an orange cloud", "This is a story about a llama", "This is a story about a hugging emoji"] }'
```

Example 4 (json):
```json
{
      "type": "object",
      "oneOf": [
          {
              "properties": {
                  "text": {
                      "oneOf": [
                          {
                              "type": "string",
                              "description": "The text to embed",
                              "minLength": 1
                          },
                          {
                              "type": "array",
                              "description": "Batch of text values to embed",
                              "items": {
                                  "type": "string",
                                  "description": "The text to embed",
                                  "minLength": 1
                              },
                              "maxItems": 100
                          }
                      ]
                  },
                  "pooling": {
                      "type": "string",
                      "enum": [
                          "mean",
                          "cls"
                      ],
                      "default": "mean",
                      "description": "The pooling method used in the embedding process. `cls` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is `mean` in order for this to not be a breaking change, but we highly suggest using the new `cls` pooling for better accuracy."
                  }
              },
              "required": [
                  "text"
              ]
          },
          {
              "properties": {
                  "requests": {
                      "type": "array",
                      "description": "Batch of the embeddings requests to run using async-queue",
                      "items": {
                          "properties": {
                              "text": {
                                  "oneOf": [
                                      {
                                          "type": "string",
                                          "description": "The text to embed",
                                          "minLength": 1
                                      },
                                      {
                                          "type": "array",
                                          "description": "Batch of text values to embed",
                                          "items": {
                                              "type": "string",
                                              "description": "The text to embed",
                                              "minLength": 1
                                          },
                                          "maxItems": 100
                                      }
                                  ]
                              },
                              "pooling": {
                                  "type": "string",
                                  "enum": [
                                      "mean",
                                      "cls"
                                  ],
                                  "default": "mean",
                                  "description": "The pooling method used in the embedding process. `cls` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is `mean` in order for this to not be a breaking change, but we highly suggest using the new `cls` pooling for better accuracy."
                              }
                          },
                          "required": [
                              "text"
                          ]
                      }
                  }
              },
              "required": [
                  "requests"
              ]
          }
      ]
  }
```

---

## qwen1.5-0.5b-chat Beta

**URL:** llms-txt#qwen1.5-0.5b-chat-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • Qwen

@cf/qwen/qwen1.5-0.5b-chat

Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 32,000 tokens |
| More information | [link](https://huggingface.co/qwen/qwen1.5-0.5b-chat) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/qwen/qwen1.5-0.5b-chat)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: qwen1.5-1.8b-chat · Cloudflare Workers AI docs
description: Qwen1.5 is the improved version of Qwen, the large language model
  series developed by Alibaba Cloud.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/qwen1.5-1.8b-chat/
  md: https://developers.cloudflare.com/workers-ai/models/qwen1.5-1.8b-chat/index.md
---

![Qwen logo](https://developers.cloudflare.com/_astro/qwen.B8ST_F2H.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/qwen/qwen1.5-0.5b-chat", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/qwen/qwen1.5-0.5b-chat", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/qwen/qwen1.5-0.5b-chat",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/qwen/qwen1.5-0.5b-chat \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## sqlcoder-7b-2 Beta

**URL:** llms-txt#sqlcoder-7b-2-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • defog

@cf/defog/sqlcoder-7b-2

This model is intended to be used by non-technical users to understand data inside their SQL databases.

| Model Info | |
| - | - |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 10,000 tokens |
| Terms and License | [link](https://creativecommons.org/licenses/by-sa/4.0/deed.en) |
| More information | [link](https://huggingface.co/defog/sqlcoder-7b-2) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@cf/defog/sqlcoder-7b-2)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: stable-diffusion-v1-5-img2img · Cloudflare Workers AI docs
description: "Stable Diffusion is a latent text-to-image diffusion model capable
  of generating photo-realistic images. Img2img generate a new image from an
  input image with Stable Diffusion. "
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/stable-diffusion-v1-5-img2img/
  md: https://developers.cloudflare.com/workers-ai/models/stable-diffusion-v1-5-img2img/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@cf/defog/sqlcoder-7b-2", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@cf/defog/sqlcoder-7b-2", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/defog/sqlcoder-7b-2",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/defog/sqlcoder-7b-2 \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---

## bge-small-en-v1.5

**URL:** llms-txt#bge-small-en-v1.5

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Embeddings • baai

@cf/baai/bge-small-en-v1.5

BAAI general embedding (Small) model that transforms any given text into a 384-dimensional vector

| Model Info | |
| - | - |
| More information | [link](https://huggingface.co/BAAI/bge-small-en-v1.5) |
| Maximum Input Tokens | 512 |
| Output Dimensions | 384 |
| Batch | Yes |
| Unit Pricing | $0.02 per M input tokens |

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `pooling` string default mean

The pooling method used in the embedding process. \`cls\` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is \`mean\` in order for this to not be a breaking change, but we highly suggest using the new \`cls\` pooling for better accuracy.

* `requests` array required

Batch of the embeddings requests to run using async-queue

* `text` one of required

Batch of text values to embed

* `items` string min 1

* `pooling` string default mean

The pooling method used in the embedding process. \`cls\` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is \`mean\` in order for this to not be a breaking change, but we highly suggest using the new \`cls\` pooling for better accuracy.

Embeddings of the requested text values

Floating point embedding representation shaped by the embedding model

The pooling method used in the embedding process.

* `request_id` string

The async request id that can be used to obtain the results.

The following schemas are based on JSON Schema

<page>
---
title: deepseek-coder-6.7b-base-awq · Cloudflare Workers AI docs
description: Deepseek Coder is composed of a series of code language models,
  each trained from scratch on 2T tokens, with a composition of 87% code and 13%
  natural language in both English and Chinese.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/deepseek-coder-6.7b-base-awq/
  md: https://developers.cloudflare.com/workers-ai/models/deepseek-coder-6.7b-base-awq/index.md
---

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    // Can be a string or array of strings]
    const stories = [
      "This is a story about an orange cloud",
      "This is a story about a llama",
      "This is a story about a hugging emoji",
    ];


    const embeddings = await env.AI.run(
      "@cf/baai/bge-small-en-v1.5",
      {
        text: stories,
      }
    );


    return Response.json(embeddings);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests




ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


stories = [
  'This is a story about an orange cloud',
  'This is a story about a llama',
  'This is a story about a hugging emoji'
]


response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/baai/bge-small-en-v1.5",
  headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
  json={"text": stories}
)


print(response.json())
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/baai/bge-small-en-v1.5  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "text": ["This is a story about an orange cloud", "This is a story about a llama", "This is a story about a hugging emoji"] }'
```

Example 4 (json):
```json
{
      "type": "object",
      "oneOf": [
          {
              "properties": {
                  "text": {
                      "oneOf": [
                          {
                              "type": "string",
                              "description": "The text to embed",
                              "minLength": 1
                          },
                          {
                              "type": "array",
                              "description": "Batch of text values to embed",
                              "items": {
                                  "type": "string",
                                  "description": "The text to embed",
                                  "minLength": 1
                              },
                              "maxItems": 100
                          }
                      ]
                  },
                  "pooling": {
                      "type": "string",
                      "enum": [
                          "mean",
                          "cls"
                      ],
                      "default": "mean",
                      "description": "The pooling method used in the embedding process. `cls` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is `mean` in order for this to not be a breaking change, but we highly suggest using the new `cls` pooling for better accuracy."
                  }
              },
              "required": [
                  "text"
              ]
          },
          {
              "properties": {
                  "requests": {
                      "type": "array",
                      "description": "Batch of the embeddings requests to run using async-queue",
                      "items": {
                          "properties": {
                              "text": {
                                  "oneOf": [
                                      {
                                          "type": "string",
                                          "description": "The text to embed",
                                          "minLength": 1
                                      },
                                      {
                                          "type": "array",
                                          "description": "Batch of text values to embed",
                                          "items": {
                                              "type": "string",
                                              "description": "The text to embed",
                                              "minLength": 1
                                          },
                                          "maxItems": 100
                                      }
                                  ]
                              },
                              "pooling": {
                                  "type": "string",
                                  "enum": [
                                      "mean",
                                      "cls"
                                  ],
                                  "default": "mean",
                                  "description": "The pooling method used in the embedding process. `cls` pooling will generate more accurate embeddings on larger inputs - however, embeddings created with cls pooling are not compatible with embeddings generated with mean pooling. The default pooling method is `mean` in order for this to not be a breaking change, but we highly suggest using the new `cls` pooling for better accuracy."
                              }
                          },
                          "required": [
                              "text"
                          ]
                      }
                  }
              },
              "required": [
                  "requests"
              ]
          }
      ]
  }
```

---

## qwen3-embedding-0.6b

**URL:** llms-txt#qwen3-embedding-0.6b

**Contents:**
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Embeddings • Qwen

@cf/qwen/qwen3-embedding-0.6b

The Qwen3 Embedding model series is the latest proprietary model of the Qwen family, specifically designed for text embedding and ranking tasks.

| Model Info | |
| - | - |
| Unit Pricing | $0.012 per M input tokens |

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

A single query string

An array of query strings

* `items` string min 1

* `instruction` string default Given a web search query, retrieve relevant passages that answer the query

Optional instruction for the task

A single document string

An array of document strings

* `items` string min 1

Alias for documents: a single text string

Alias for documents: an array of text strings

* `items` string min 1

The following schemas are based on JSON Schema

<page>
---
title: qwq-32b · Cloudflare Workers AI docs
description: QwQ is the reasoning model of the Qwen series. Compared with
  conventional instruction-tuned models, QwQ, which is capable of thinking and
  reasoning, can achieve significantly enhanced performance in downstream tasks,
  especially hard problems. QwQ-32B is the medium-sized reasoning model, which
  is capable of achieving competitive performance against state-of-the-art
  reasoning models, e.g., DeepSeek-R1, o1-mini.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/qwq-32b/
  md: https://developers.cloudflare.com/workers-ai/models/qwq-32b/index.md
---

![Qwen logo](https://developers.cloudflare.com/_astro/qwen.B8ST_F2H.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    // Can be a string or array of strings]
    const stories = [
      "This is a story about an orange cloud",
      "This is a story about a llama",
      "This is a story about a hugging emoji",
    ];


    const embeddings = await env.AI.run(
      "@cf/qwen/qwen3-embedding-0.6b",
      {
        text: stories,
      }
    );


    return Response.json(embeddings);
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (py):
```py
import os
import requests




ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


stories = [
  'This is a story about an orange cloud',
  'This is a story about a llama',
  'This is a story about a hugging emoji'
]


response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/qwen/qwen3-embedding-0.6b",
  headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
  json={"text": stories}
)


print(response.json())
```

Example 3 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/qwen/qwen3-embedding-0.6b  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "text": ["This is a story about an orange cloud", "This is a story about a llama", "This is a story about a hugging emoji"] }'
```

Example 4 (json):
```json
{
      "type": "object",
      "properties": {
          "queries": {
              "oneOf": [
                  {
                      "type": "string",
                      "description": "A single query string",
                      "minLength": 1
                  },
                  {
                      "type": "array",
                      "description": "An array of query strings",
                      "items": {
                          "type": "string",
                          "minLength": 1
                      },
                      "maxItems": 32
                  }
              ]
          },
          "instruction": {
              "type": "string",
              "default": "Given a web search query, retrieve relevant passages that answer the query",
              "description": "Optional instruction for the task"
          },
          "documents": {
              "oneOf": [
                  {
                      "type": "string",
                      "description": "A single document string",
                      "minLength": 1
                  },
                  {
                      "type": "array",
                      "description": "An array of document strings",
                      "items": {
                          "type": "string",
                          "minLength": 1
                      },
                      "maxItems": 32
                  }
              ]
          },
          "text": {
              "oneOf": [
                  {
                      "type": "string",
                      "description": "Alias for documents: a single text string",
                      "minLength": 1
                  },
                  {
                      "type": "array",
                      "description": "Alias for documents: an array of text strings",
                      "items": {
                          "type": "string",
                          "minLength": 1
                      },
                      "maxItems": 32
                  }
              ]
          }
      }
  }
```

---

## llama-2-13b-chat-awq Beta

**URL:** llms-txt#llama-2-13b-chat-awq-beta

**Contents:**
- Playground
- Usage
- Parameters
  - Input
  - Output
- API Schemas

Text Generation • thebloke

@hf/thebloke/llama-2-13b-chat-awq

Llama 2 13B Chat AWQ is an efficient, accurate and blazing-fast low-bit weight quantized Llama 2 variant.

| Model Info | |
| - | - |
| Deprecated | 10/1/2025 |
| Context Window[](https://developers.cloudflare.com/workers-ai/glossary/) | 4,096 tokens |
| More information | [link](https://huggingface.co/TheBloke/Llama-2-13B-chat-AWQ) |
| Beta | Yes |

Try out this model with Workers AI LLM Playground. It does not require any setup or authentication and an instant way to preview and test a model directly in the browser.

[Launch the LLM Playground](https://playground.ai.cloudflare.com/?model=@hf/thebloke/llama-2-13b-chat-awq)

OpenAI compatible endpoints

Workers AI also supports OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations ](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

\* indicates a required field

* `prompt` string required min 1

The input text prompt for the model to generate a response.

Name of the LoRA (Low-Rank Adaptation) model to fine-tune the base model.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `messages` array required

An array of message objects representing the conversation history.

* `role` string required

The role of the message sender (e.g., 'user', 'assistant', 'system', 'tool').

* `content` string required

The content of the message as a string.

* `name` string required

* `code` string required

A list of tools available for the assistant to use.

* `name` string required

The name of the tool. More descriptive the better.

* `description` string required

A brief description of what the tool does.

* `parameters` object required

Schema defining the parameters accepted by the tool.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `type` string required

Specifies the type of tool (e.g., 'function').

* `function` object required

Details of the function tool.

* `name` string required

The name of the function.

* `description` string required

A brief description of what the function does.

* `parameters` object required

Schema defining the parameters accepted by the function.

* `type` string required

The type of the parameters object (usually 'object').

List of required parameter names.

* `properties` object required

Definitions of each parameter.

* `additionalProperties` object

* `type` string required

The data type of the parameter.

* `description` string required

A description of the expected parameter.

* `response_format` object

If true, a chat template is not applied and you must adhere to the specific model's expected formatting.

If true, the response will be streamed back incrementally using SSE, Server Sent Events.

* `max_tokens` integer default 256

The maximum number of tokens to generate in the response.

* `temperature` number default 0.6 min 0 max 5

Controls the randomness of the output; higher values produce more random results.

* `top_p` number min 0.001 max 1

Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses.

* `top_k` integer min 1 max 50

Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.

* `seed` integer min 1 max 9999999999

Random seed for reproducibility of the generation.

* `repetition_penalty` number min 0 max 2

Penalty for repeated tokens; higher values discourage repetition.

* `frequency_penalty` number min -2 max 2

Decreases the likelihood of the model repeating the same lines verbatim.

* `presence_penalty` number min -2 max 2

Increases the likelihood of the model introducing new topics.

* `response` string required

The generated text response from the model

Usage statistics for the inference request

* `prompt_tokens` number 0

Total number of tokens in input

* `completion_tokens` number 0

Total number of tokens in output

* `total_tokens` number 0

Total number of input and output tokens

An array of tool calls requests made during the response generation

The arguments passed to be passed to the tool call request

The name of the tool to be called

The following schemas are based on JSON Schema

<page>
---
title: llama-2-7b-chat-fp16 · Cloudflare Workers AI docs
description: Full precision (fp16) generative text model with 7 billion parameters from Meta
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/models/llama-2-7b-chat-fp16/
  md: https://developers.cloudflare.com/workers-ai/models/llama-2-7b-chat-fp16/index.md
---

![Meta logo](https://developers.cloudflare.com/_astro/meta.x5nlFKBG.svg)

**Examples:**

Example 1 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];


    const stream = await env.AI.run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages,
      stream: true,
    });


    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
} satisfies ExportedHandler<Env>;
```

Example 2 (ts):
```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {


    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@hf/thebloke/llama-2-13b-chat-awq", { messages });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

Example 3 (py):
```py
import os
import requests


ACCOUNT_ID = "your-account-id"
AUTH_TOKEN = os.environ.get("CLOUDFLARE_AUTH_TOKEN")


prompt = "Tell me all about PEP-8"
response = requests.post(
  f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@hf/thebloke/llama-2-13b-chat-awq",
    headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
    json={
      "messages": [
        {"role": "system", "content": "You are a friendly assistant"},
        {"role": "user", "content": prompt}
      ]
    }
)
result = response.json()
print(result)
```

Example 4 (sh):
```sh
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@hf/thebloke/llama-2-13b-chat-awq \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "messages": [{ "role": "system", "content": "You are a friendly assistant" }, { "role": "user", "content": "Why is pizza so good" }]}'
```

---
