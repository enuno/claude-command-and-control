# Raycast - Utilities

**Pages:** 8

---

## AI

**URL:** llms-txt#ai

**Contents:**
- API Reference
  - AI.ask
- Types
  - AI.Creativity
  - AI.Model
  - AI.AskOptions

The AI API provides developers with seamless access to AI functionality without requiring API keys, configuration, or extra dependencies.

{% hint style="info" %}
Some users might not have access to this API. If a user doesn't have access to Raycast Pro, they will be asked if they want to get access when your extension calls the AI API. If the user doesn't wish to get access, the API call will throw an error.

You can check if a user has access to the API using [`environment.canAccess(AI)`](https://developers.raycast.com/api-reference/environment).
{% endhint %}

Ask AI anything you want. Use this in “no-view” Commands, effects, or callbacks. In a React component, you might want to use the [useAI util hook](https://developers.raycast.com/utilities/react-hooks/useai) instead.

{% tabs %}
{% tab title="Basic Usage" %}

{% tab title="Error handling" %}

{% tab title="Stream answer" %}

{% tab title="User Feedback" %}

{% tab title="Check for access" %}

{% endtab %}
{% endtabs %}

| Name                                     | Description                                                  | Type                              |
| ---------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| prompt<mark style="color:red;">\*</mark> | The prompt to ask the AI.                                    | `string`                          |
| options                                  | Options to control which and how the AI model should behave. | [`AI.AskOptions`](#ai.askoptions) |

A Promise that resolves with a prompt completion.

Concrete tasks, such as fixing grammar, require less creativity while open-ended questions, such as generating ideas, require more.

If a number is passed, it needs to be in the range 0-2. For larger values, 2 will be used. For lower values, 0 will be used.

The AI model to use to answer to the prompt. Defaults to `AI.Model["OpenAI_GPT-4o_mini"]`.

| Model                                            | Description                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| OpenAI\_GPT-5\_mini                              | OpenAI's latest model, great for well-defined tasks and precise prompts.                                           |
| OpenAI\_GPT-5\_nano                              | OpenAI's latest model, great for summarization and classification tasks.                                           |
| OpenAI\_GPT-4.1                                  | OpenAI's flagship model optimized for complex problem solving.                                                     |
| OpenAI\_GPT-4.1\_mini                            | Balanced GPT-4.1 variant optimized for speed and cost efficiency.                                                  |
| OpenAI\_GPT-4.1\_nano                            | Fastest and most cost-effective GPT-4.1 variant.                                                                   |
| OpenAI\_GPT-4                                    | Previous generation GPT-4 model with broad knowledge and complex instruction handling.                             |
| OpenAI\_GPT-4\_Turbo                             | Previous generation GPT-4 with expanded context window.                                                            |
| OpenAI\_GPT-4o                                   | Advanced OpenAI model optimized for speed and complex problem solving.                                             |
| OpenAI\_GPT-4o\_mini                             | Fast and intelligent model for everyday tasks.                                                                     |
| OpenAI\_GPT-5                                    | OpenAI's latest model, great for coding and agentic tasks across domains.                                          |
| OpenAI\_GPT-5\_Codex                             | OpenAI's model optimized for agentic coding tasks in Codex and similar environments.                               |
| OpenAI\_GPT-5.1                                  | OpenAI's model with adaptive reasoning, great for coding and agentic tasks across domains.                         |
| OpenAI\_GPT-5.1\_Codex                           | A version of GPT-5.1 optimized for agentic coding tasks in Codex or similar environments.                          |
| OpenAI\_GPT-5.1\_Instant                         | OpenAI's fastest GPT-5.1 model with adaptive reasoning, optimized for speed and efficiency.                        |
| OpenAI\_GPT-5.2                                  | OpenAI's most capable model for professional work and long-running agents with state-of-the-art tool-calling.      |
| OpenAI\_GPT-5.2\_Instant                         | OpenAI's fast, capable model for everyday work with improved info-seeking, how-tos, and technical writing.         |
| OpenAI\_o3                                       | Advanced model excelling in math, science, coding, and visual tasks.                                               |
| OpenAI\_o4-mini                                  | Fast, efficient model optimized for coding and visual tasks.                                                       |
| OpenAI\_o1                                       | Advanced reasoning model for complex STEM problems.                                                                |
| OpenAI\_o3-mini                                  | Fast reasoning model optimized for STEM tasks.                                                                     |
| Groq\_GPT-OSS\_20b                               | OpenAI's first open-source model, 20b variant.                                                                     |
| Groq\_GPT-OSS\_120b                              | OpenAI's first open-source model, 120b variant.                                                                    |
| Anthropic\_Claude\_4.5\_Haiku                    | Anthropic's offering focusing on being the best combination of performance and speed.                              |
| Anthropic\_Claude\_4\_Sonnet                     | Anthropic's most intelligent model.                                                                                |
| Anthropic\_Claude\_4.5\_Sonnet                   | Anthropic's most intelligent model with the highest intelligence across most tasks.                                |
| Anthropic\_Claude\_4\_Opus                       | Anthropic's model for complex tasks with exceptional fluency.                                                      |
| Anthropic\_Claude\_4.1\_Opus                     | Anthropic's model for complex tasks with exceptional fluency.                                                      |
| Anthropic\_Claude\_4.5\_Opus                     | Anthropic's model for complex tasks with exceptional fluency.                                                      |
| Perplexity\_Sonar                                | Fast Perplexity model with integrated search capabilities.                                                         |
| Perplexity\_Sonar\_Pro                           | Advanced Perplexity model for complex queries with search integration.                                             |
| Groq\_Llama\_4\_Scout                            | Advanced 17B parameter multimodal model with 16 experts.                                                           |
| Groq\_Llama\_3.3\_70B                            | Meta's state-of-the-art model for reasoning and general knowledge.                                                 |
| Groq\_Llama\_3.1\_8B                             | Fast, instruction-optimized open-source model.                                                                     |
| Together\_AI\_Llama\_3.1\_405B                   | Meta's flagship model with advanced capabilities across multiple domains.                                          |
| Mistral\_Nemo                                    | Small, Apache-licensed model built with NVIDIA.                                                                    |
| Mistral\_Large                                   | Top-tier reasoning model with strong multilingual support.                                                         |
| Mistral\_Medium                                  | A powerful, cost-effective, frontier-class multimodal model.                                                       |
| Mistral\_Small\_3                                | Latest enterprise-grade small model with improved reasoning.                                                       |
| Mistral\_Codestral                               | Specialized model for code-related tasks and testing.                                                              |
| Groq\_Kimi\_K2\_Instruct                         | Kimi K2 is a powerful and versatile AI model designed for a wide range of tasks.                                   |
| Groq\_Qwen3-32B                                  | The latest generation of large language models in the Qwen series.                                                 |
| Google\_Gemini\_3\_Flash                         | Fast thinking model with strong balance of speed, performance, and value.                                          |
| Google\_Gemini\_3\_Pro                           | Advanced thinking model for complex problem solving.                                                               |
| Google\_Gemini\_2.5\_Pro                         | Advanced thinking model for complex problem solving.                                                               |
| Google\_Gemini\_2.5\_Flash                       | Fast, well-rounded thinking model.                                                                                 |
| Google\_Gemini\_2.5\_Flash\_Lite                 | Fast model optimized for large-scale text output.                                                                  |
| Together\_AI\_Qwen3-235B-A22B-Instruct-2507-tput | A varied model with enhanced reasoning.                                                                            |
| Together\_AI\_DeepSeek-R1                        | Open-source model matching OpenAI-o1 performance.                                                                  |
| Together\_AI\_DeepSeek-V3                        | Advanced Mixture-of-Experts model.                                                                                 |
| xAI\_Grok-4.1\_Fast                              | xAI's best agentic tool calling model that shines in real-world use cases like customer support and deep research. |
| xAI\_Grok-4                                      | Advanced language model with enhanced reasoning and tool capabilities.                                             |
| xAI\_Grok-4\_Fast                                | xAI's latest advancement in cost-efficient reasoning models.                                                       |
| xAI\_Grok\_Code\_Fast\_1                         | Grok Code Fast 1 is xAI's Coding Agent focused model                                                               |
| xAI\_Grok-3\_Beta                                | Enterprise-focused model for data, coding, and summarization tasks.                                                |
| xAI\_Grok-3\_Mini\_Beta                          | Fast, lightweight model for logic-based tasks.                                                                     |

If a model isn't available to the user (or has been disabled by the user), Raycast will fallback to a similar one.

| Property   | Description                                                                                                                                                                                                                                                      | Type                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| creativity | Concrete tasks, such as fixing grammar, require less creativity while open-ended questions, such as generating ideas, require more. If a number is passed, it needs to be in the range 0-2. For larger values, 2 will be used. For lower values, 0 will be used. | [`AI.Creativity`](#ai.creativity)                                             |
| model      | The AI model to use to answer to the prompt.                                                                                                                                                                                                                     | [`AI.Model`](#ai.model)                                                       |
| signal     | Abort signal to cancel the request.                                                                                                                                                                                                                              | [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) |

**Examples:**

Example 1 (typescript):
```typescript
async function ask(prompt: string, options?: AskOptions): Promise<string> & EventEmitter;
```

Example 2 (typescript):
```typescript
import { AI, Clipboard } from "@raycast/api";

export default async function command() {
  const answer = await AI.ask("Suggest 5 jazz songs");

  await Clipboard.copy(answer);
}
```

Example 3 (typescript):
```typescript
import { AI, showToast, Toast } from "@raycast/api";

export default async function command() {
  try {
    await AI.ask("Suggest 5 jazz songs");
  } catch (error) {
    // Handle error here, eg: by showing a Toast
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to generate answer",
    });
  }
}
```

Example 4 (typescript):
```typescript
import { AI, getSelectedFinderItems, showHUD } from "@raycast/api";
import fs from "fs";

export default async function main() {
  let allData = "";
  const [file] = await getSelectedFinderItems();

  const answer = AI.ask("Suggest 5 jazz songs");

  // Listen to "data" event to stream the answer
  answer.on("data", async (data) => {
    allData += data;
    await fs.promises.writeFile(`${file.path}`, allData.trim(), "utf-8");
  });

  await answer;

  await showHUD("Done!");
}
```

---

## Write Evals for Your AI Extension

**URL:** llms-txt#write-evals-for-your-ai-extension

**Contents:**
- Add an Eval
- Run Your Evals

Make your AI Extension more reliable by writing evals.

We all know that AI is not always reliable. This is why it's important to write evals for your AI Extension. Evals allow you to test your AI Extension and make sure it behaves as expected.

The easiest way to add an eval is to first use your AI Extension. Then, once Raycast AI used your tools to finish its response, you can use the Copy Eval action to copy the eval to your clipboard.

![Copy Eval](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b91e1651293f819adc528349025ebe722373f66e%2Fcopy-eval.webp?alt=media)

You can then paste the eval into the `evals` array in the [`package.json` file](https://developers.raycast.com/information/manifest).

To run your evals, you can use the `npx ray evals` command. This will run the evals and print the results to the console. You get an overview of the evals that failed and the ones that passed. From here you can start improving the names and descriptions of your tools.

Visit [Learn Core Concepts of AI Extensions](https://developers.raycast.com/learn-core-concepts-of-ai-extensions#evals) to learn more about the different types of evals you can write.

**Examples:**

Example 1 (json):
```json
{
  "ai": {
    "evals": [
      {
        "input": "@todo-list what are my open todos",
        "mocks": {
          "get-todos": [
            {
              "id": "Z5lF8F-lSvGCD6e3uZwkL",
              "isCompleted": false,
              "title": "Buy oat milk"
            },
            {
              "id": "69Ag2mfaDakC3IP8XxpXU",
              "isCompleted": false,
              "title": "Play with my cat"
            }
          ]
        },
        "expected": [
          {
            "callsTool": "get-todos"
          }
        ]
      }
    ]
  }
}
```

---

## Follow Best Practices for AI Extensions

**URL:** llms-txt#follow-best-practices-for-ai-extensions

Make the most out of your AI Extension by following best practices.

Working with LLMs can be tricky. Here are some best practices to make the most out of your AI Extension.

1. Use [Confirmations](https://developers.raycast.com/learn-core-concepts-of-ai-extensions#confirmations) to keep the human in the loop. You can use them dynamically based on the user's input. For example, you might ask for confirmation if moving a file would overwrite an existing file but not if it would create a new file.
2. Write [Evals](https://developers.raycast.com/ai/write-evals-for-your-ai-extension) for common use-cases to test your AI Extension and provide users with suggested prompts.
3. Include information in your tool's input on how to format parameters like IDs or dates. For example, you might mention that a date should be provided in ISO 8601 format.
4. Include information in your tool's input on how to get the required parameters. For example, you want to teach AI how to get a team ID that is required to create a new issue.

---

## System Utilities

**URL:** llms-txt#system-utilities

**Contents:**
- API Reference
  - getApplications
  - getDefaultApplication
  - getFrontmostApplication
  - showInFinder
  - trash
  - open
  - captureException
- Types
  - Application

This set of utilities exposes some of Raycast's native functionality to allow deep integration into the user's setup. For example, you can use the Application APIs to check if a desktop application is installed and then provide an action to deep-link into it.

Returns all applications that can open the file or URL.

{% tabs %}
{% tab title="Find Application" %}

{% tab title="List Installed Applications" %}

{% endtab %}
{% endtabs %}

| Name | Description                                                                                                                   | Type            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------- | --------------- |
| path | The path of the file or folder to get the applications for. If no path is specified, all installed applications are returned. | `"fs".PathLike` |

An array of [Application](#application).

### getDefaultApplication

Returns the default application that the file or URL would be opened with.

| Name                                   | Description                                                        | Type            |
| -------------------------------------- | ------------------------------------------------------------------ | --------------- |
| path<mark style="color:red;">\*</mark> | The path of the file or folder to get the default application for. | `"fs".PathLike` |

A Promise that resolves with the default [Application](#application) that would open the file or URL. If no application was found, the promise will be rejected.

### getFrontmostApplication

Returns the frontmost application.

A Promise that resolves with the frontmost [Application](#application). If no application was found, the promise will be rejected.

Shows a file or directory in the Finder.

| Name                                   | Description                     | Type            |
| -------------------------------------- | ------------------------------- | --------------- |
| path<mark style="color:red;">\*</mark> | The path to show in the Finder. | `"fs".PathLike` |

A Promise that resolves when the item is revealed in the Finder.

Moves a file or directory to the Trash.

| Name                                   | Description                             | Type                                 |
| -------------------------------------- | --------------------------------------- | ------------------------------------ |
| path<mark style="color:red;">\*</mark> | The item or items to move to the trash. | `"fs".PathLike` or `"fs".PathLike[]` |

A Promise that resolves when all files are moved to the trash.

Opens a target with the default application or specified application.

| Name                                     | Description                                                                                                                                                                                                                                                        | Type                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| target<mark style="color:red;">\*</mark> | The file, folder or URL to open.                                                                                                                                                                                                                                   | `string`                                  |
| application                              | The application name to use for opening the file. If no application is specified, the default application as determined by the system is used to open the specified file. Note that you can use the application name, app identifier, or absolute path to the app. | `string` or [`Application`](#application) |

A Promise that resolves when the target has been opened.

Report the provided exception to the Developer Hub. This helps in handling failures gracefully while staying informed about the occurrence of the failure.

| Name                                        | Description                       | Type      |
| ------------------------------------------- | --------------------------------- | --------- |
| exception<mark style="color:red;">\*</mark> | The exception you want to report. | `unknown` |

An object that represents a locally installed application on the system.

It can be used to open files or folders in a specific application. Use [getApplications](#getapplications) or [getDefaultApplication](#getdefaultapplication) to get applications that can open a specific file or folder.

| Property                               | Description                                                                    | Type     |
| -------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| name<mark style="color:red;">\*</mark> | The display name of the application.                                           | `string` |
| path<mark style="color:red;">\*</mark> | The absolute path to the application bundle, e.g. `/Applications/Raycast.app`, | `string` |
| bundleId                               | The macOS bundle identifier of the application, e.g. `com.raycast.macos`.      | `string` |
| localizedName                          | The localized name of the application.                                         | `string` |
| windowsAppId                           | The Windows App ID of the application.                                         | `string` |

Supported path types.

**Examples:**

Example 1 (typescript):
```typescript
async function getApplications(path?: PathLike): Promise<Application[]>;
```

Example 2 (typescript):
```typescript
import { getApplications, Application } from "@raycast/api";

// it is a lot more reliable to get an app by its bundle ID than its path
async function findApplication(bundleId: string): Application | undefined {
  const installedApplications = await getApplications();
  return installedApplications.filter((application) => application.bundleId == bundleId);
}
```

Example 3 (typescript):
```typescript
import { getApplications } from "@raycast/api";

export default async function Command() {
  const installedApplications = await getApplications();
  console.log("The following applications are installed on your Mac:");
  console.log(installedApplications.map((a) => a.name).join(", "));
}
```

Example 4 (typescript):
```typescript
async function getDefaultApplication(path: PathLike): Promise<Application>;
```

---

## Create an AI Extension

**URL:** llms-txt#create-an-ai-extension

**Contents:**
- Add AI Tools
- Build Your AI Extension
- Use Your AI Extension

Learn how to turn a regular extension into an AI-powered one.

To turn your regular extension into an AI-powered one, you need to add a set of tools that allow Raycast AI to interact with your extension.

The simplest way to add a tool to your extensions is to open the Manage Extensions command, search for your extension and perform the Add New Tool action via the Action Panel (or press `⌥` `⌘` `T`).

![Add New Tool](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1be2e53c0b44ea6d5b7b3071c72b9747c88ea1f1%2Fadd-new-tool.webp?alt=media)

{% hint style="info" %}
Alternatively you can edit the [`package.json` file](https://developers.raycast.com/information/manifest) manually and add a new entry to the `tools` array.
{% endhint %}

Give the tool a name, a description, and pick a template. The name and description will show up in the UI as well as the Store. The description is passed to AI to help it understand how to use the tool.

## Build Your AI Extension

Just like with regular extensions, you need to build your AI Extension. After you've added a tool, switch to your terminal and navigate to your extension directory. Run `npm install && npm run dev` to start the extension in development mode.

{% hint style="info" %}
`npm run dev` starts the extension in development mode with hot reloading, error reporting and [more](https://developers.raycast.com/information/developer-tools/cli#development).
{% endhint %}

## Use Your AI Extension

Open Raycast, and you'll notice a new list item saying "Ask ..." at the top of the root search. Press `↵` to open it. From there on, you can chat to your AI Extension.

![AI Extension](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-23cf3dba982add079b5ee80f7cad37b49dee0e13%2Fuse-ai-extension.webp?alt=media)

Alternatively, you can open Raycast's AI Chat and start chatting to your AI Extension there. Simply type `@` and start typing the name of your extension.

![AI Chat](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c8184957f84dd38b6ec5234940c1266a9d7519f9%2Fai-chat.webp?alt=media)

🎉 Congratulations! You built your first AI extension. Now you can start adding more tools to your extension to make it more powerful.

---

## Learn Core Concepts of AI Extensions

**URL:** llms-txt#learn-core-concepts-of-ai-extensions

**Contents:**
- Tools
  - Inputs
  - Descriptions
  - Confirmations
- Instructions
- Evals
- Structure
- Expectations
- AI File

Get to know the core concepts of AI extensions.

AI Extensions rely on three core concepts: Tools, Instructions, and Evals. Each of these concepts plays a crucial role in the development of AI Extensions. Let's take a closer look at each of them.

To turn a regular extension into an AI extension, you need to add a set of tools that allow Raycast AI to interact with your extension. A tool is a function that takes an input and returns a value.

Here's an example of a simple tool:

Tools can take an input. For example, a `greet` tool takes a `name` as an input and returns a greeting to the user.

Those inputs can be used to provide more context to the tool. For example, you can pass a title, a description, and a due date to a `createTask` tool.

{% hint style="info" %}
A tool expects a single object as its input.
{% endhint %}

To better teach AI how to use your tools, you can add descriptions as JSDoc comments (eg. `/** ... */`) to tools and their inputs. The better you describe your tools, the more likely AI is to use them correctly.

Sometimes you want to keep the human in the loop. For example, you can ask the user to confirm an action before it is executed. For this, you can export a `confirmation` function.

The `confirmation` function is called before the actual tool is executed. If the user confirms, the tool is executed afterwards. If the user cancels, the tool is not executed.

You can customize the confirmation further by providing details about the action that needs to be confirmed. See [Tool Reference](https://developers.raycast.com/api-reference/tool) for more information.

Sometimes you want to provide additional instructions to the AI that are not specific to a single tool but to the entire AI extension. For example, you can provide a list of do's and don'ts for the AI to follow. Those are defined in the [`package.json` file](https://developers.raycast.com/information/manifest) under the `ai` key.

A user can use multiple AI Extensions in a conversation. Therefore, you should make sure that your instructions don't conflict with the instructions of other AI Extensions. For example, avoid phrases like "You are a ... assistant" because other AI Extensions might provide a different skill set. Instead, you should focus on providing general instructions that describe the specifics of your AI Extension. For example, describe the relationship between issues, projects, and teams for a project management app.

Evals are a way to test your AI extension. Think of them as integrations tests. They are defined in the [`package.json` file](https://developers.raycast.com/information/manifest) under the `ai` key. They are also used as suggested prompts for the user to learn how to make the most out of your AI Extension.

An eval consists of the following parts:

* `input` is a text prompt that you expect from users of your AI Extension. It should include `@` mention the name of your extension (`name` from `package.json`).
* `mocks` – mocked results of tool calls. It is required to give AI the context, i.e. if you write an eval for `@todo-list What are my todos?` you need to provide the actual list in `get-todos` mock.
* `expected` – array of expectations, similar to `expect` statements in unit / integration tests.
* `usedAsExample` – if true, the eval will be used as an example prompt for the user. True by default.

Expectations are used to check if the AI response matches the expected behavior. You have different options to choose from:

* `includes`: Check that AI response includes some substring (case-insensitive), for example `{"includes": "added" }`
* `matches`: Check that AI response matches some regexp, for example check if response contains a Markdown link `{ "matches": "\\[([^\\]]+)\\]\\(([^\\s\\)]+)(?:\\s+\"([^\"]+)\")?\\)" }`
* `meetsCriteria`: Check that AI response meets some plain-text criteria (validated using AI). Useful when AI varies the response and it is hard to match it using `includes` or `matches`. Example: `{ "meetsCriteria": "Tells that label with this name doesn't exist" }`
* `callsTool`: Check that during the request AI called some tool included from your AI extension. There are two forms:
  * Short form to check if AI tool with specific name was called. Example: `{ "callsTool": "get-todos" }`
  * Long form to check tool arguments: `{ callsTool: { name: "name", arguments: { arg1: matcher, arg2: matcher } } }`. Matches could be complex and combine any supported rules:
    * `eq` (used by default for any value that is not object or array)
    * `includes`
    * `matches`
    * `and` (used by default if array is used)
    * `or`
    * `not`

{% tabs %}
{% tab title="Simple Expectation" %}

{% tab title="Nested Expectations" %}

{% tab title="Nested Expectations With Dot Notation" %}

{% tab title="Negative Expectation" %}

{% endtab %}
{% endtabs %}

If your instructions or evals start getting too long and clutter your `package.json` file, you can move them to a separate file. It can be either a `ai.json`, `ai.yaml`, or `ai.json5` file in the root of your extension next to the `package.json` file.

The structure of the AI file is the same as in the `package.json` file.

{% tabs %}
{% tab title="ai.json" %}

{% tab title="ai.yaml" %}

{% tab title="ai.json5" %}

{% endtab %}
{% endtabs %}

{% hint style="info" %}
The AI file is optional. If you don't provide it, Raycast will use the instructions and evals from the `package.json` file. We found that [`yaml`](https://yaml.org/) and [`json5`](https://json5.org/) can be more readable for long instructions.
{% endhint %}

**Examples:**

Example 1 (typescript):
```typescript
export default function tool() {
  return "Hello, world!";
}
```

Example 2 (typescript):
```typescript
type Input = {
  name: string;
};

export default function tool(input: Input) {
  return `Hello, ${input.name}!`;
}
```

Example 3 (typescript):
```typescript
type Input = {
  /**
   * The title of the task
   */
  title: string;
  /**
   * The description of the task
   */
  description?: string;
  /**
   * The due date of the task in ISO 8601 format
   */
  dueDate?: string;
};

export default function tool(input: Input) {
  // ... create the task
}
```

Example 4 (typescript):
```typescript
type Input = {
  /**
   * The first name of the user to greet
   */
  name: string;
};

/**
 * Greet the user with a friendly message
 */
export default function tool(input: Input) {
  return `Hello, ${input.name}!`;
}
```

---

## useAI

**URL:** llms-txt#useai

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Types
  - AsyncState

Hook which asks the AI to answer a prompt and returns the [AsyncState](#asyncstate) corresponding to the execution of the query.

* `prompt` is the prompt to ask the AI.

* `options.creativity` is a number between 0 and 2 to control the creativity of the answer. Concrete tasks, such as fixing grammar, require less creativity while open-ended questions, such as generating ideas, require more.
* `options.model` is a string determining which AI model will be used to answer.
* `options.stream` is a boolean controlling whether to stream the answer or only update the data when the entire answer has been received. By default, the `data` will be streamed.

Including the [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise)'s options:

* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the function as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `revalidate` is a method to manually call the function with the same arguments again.

An object corresponding to the execution state of the function.

**Examples:**

Example 1 (ts):
```ts
function useAI(
  prompt: string,
  options?: {
    creativity?: AI.Creativity;
    model?: AI.Model;
    stream?: boolean;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: T) => void;
    onWillExecute?: (args: Parameters<T>) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  }
): AsyncState<String> & {
  revalidate: () => void;
};
```

Example 2 (tsx):
```tsx
import { Detail } from "@raycast/api";
import { useAI } from "@raycast/utils";

export default function Command() {
  const { data, isLoading } = useAI("Suggest 5 jazz songs");

  return <Detail isLoading={isLoading} markdown={data} />;
}
```

Example 3 (ts):
```ts
// Initial State
{
  isLoading: true, // or `false` if `options.execute` is `false`
  data: undefined,
  error: undefined
}

// Success State
{
  isLoading: false,
  data: string,
  error: undefined
}

// Error State
{
  isLoading: false,
  data: undefined,
  error: Error
}

// Reloading State
{
  isLoading: true,
  data: string | undefined,
  error: Error | undefined
}
```

---

## getAccessToken

**URL:** llms-txt#getaccesstoken

**Contents:**
- Signature
  - Return
- Example

Utility function designed for retrieving authorization tokens within a component. It ensures that your React components have the necessary authentication state, either through OAuth or a personal access token.

{% hint style="info" %}
`getAccessToken` **must** be used within components that are nested inside a component wrapped with [`withAccessToken`](https://developers.raycast.com/utilities/oauth/withaccesstoken). Otherwise, the function will fail with an error.
{% endhint %}

The function returns an object containing the following properties:

* `token`: A string representing the access token.
* `type`: An optional string that indicates the type of token retrieved. It can either be `oauth` for OAuth tokens or `personal` for personal access tokens.

**Examples:**

Example 1 (tsx):
```tsx
function getAccessToken(): {
  token: string;
  type: "oauth" | "personal";
};
```

Example 2 (tsx):
```tsx
import { Detail } from "@raycast/api";
import { authorize } from "./oauth";

function AuthorizedComponent() {
  const { token } = getAccessToken();
  return <Detail markdown={`Access token: ${token}`} />;
}

export default withAccessToken({ authorize })(AuthorizedComponent);
```

---
