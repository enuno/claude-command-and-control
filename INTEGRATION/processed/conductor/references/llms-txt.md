# Conductor - Llms-Txt

**Pages:** 40

---

## Setting up a workspace

**URL:** llms-txt#setting-up-a-workspace

**Contents:**
- Example

Source: https://docs.conductor.build/guides/how-to-setup

When you create a new workspace, Conductor will copy in all your git files.

To get any other files you need—like dependencies, .env files, or build files—use a setup script.

[conductor.json](/core/conductor-json):

**Examples:**

Example 1 (unknown):
```unknown
conductor-setup.sh:
```

---

## Nested source directories

**URL:** llms-txt#nested-source-directories

**Contents:**
- Older repos
- Get help

Source: https://docs.conductor.build/tips/nesting-issues

Workspaces are now created at `~/conductor/workspaces/` instead of inside your repository. This means no more need to add `.conductor` to gitignore or exclude it from your build tools, and helps prevent agents from getting confused about where to edit files.

For repos added to Conductor before 0.25.0 (December 3, 2025), workspaces are still stored in the `.conductor` folder inside your repository root. Some dev tools have trouble with nested source directories.

To migrate to the new system:

1. Find the workspace name in the sidebar
2. Next to the name, click on the "Repository details" button
3. Click "Remove". (Warning: This will delete all your workspaces and chats.)
4. Add the repository again

If you run into any issues, please reach out to us at [humans@conductor.build](mailto:humans@conductor.build).

---

## Django

**URL:** llms-txt#django

Source: https://docs.conductor.build/quickstart/django

Conductor works well with Django apps. Here's a basic [conductor.json](/core/conductor.json) to add to the root directory of your project.

Once added, every new workspace will automatically copy your environment variables and install dependencies.

If you use a virtual environment, you may prefer to create a fresh one per workspace:

**Examples:**

Example 1 (unknown):
```unknown
If you use a virtual environment, you may prefer to create a fresh one per workspace:
```

---

## Enable Azure AI Foundry integration

**URL:** llms-txt#enable-azure-ai-foundry-integration

export CLAUDE_CODE_USE_FOUNDRY=1

---

## Workflow

**URL:** llms-txt#workflow

**Contents:**
- Create one workspace per feature
- Develop
- Review and test changes
- Create PR + Merge
- Archive

Source: https://docs.conductor.build/workflow

Here are our recommendations for how to get the most out of Conductor:

## Create one workspace per feature

For each feature or bugfix, create a new workspace.

You can quickly create a new workspace by using **⌘⇧N** or clicking the three dots (•••) button next to the "New workspace" button. This allows you to create a workspace from a pull request, branch, or Linear issue.

<img alt="Workflow" />

Use Claude Code directly in Conductor, or open the workspace in your favorite IDE to make edits.

<img alt="Open in IDE" />

## Review and test changes

Review changes in the Diff Viewer (⌘D). Use the Terminal or Run panel to test changes.

See [this guide](/guides/how-to-run) for more on how to run your web server or app server within a workspace.

Create a PR (⌘⇧P). If any checks fail, Conductor will help you fix them.

Once everything looks good, merge!

<img alt="Repository details" />

When you're done working on that feature, archive the workspace. You can always restore the workspace later — including your chat history — from the repository details page.

---

## Using run scripts

**URL:** llms-txt#using-run-scripts

**Contents:**
- Example
- How it works
- Nonconcurrent mode

Source: https://docs.conductor.build/guides/how-to-run

Use a run script to easily launch your web server, app, or unit tests from a button in Conductor.

[conductor.json](../tips/conductor-json):

The run script runs in your workspace directory ([`$CONDUCTOR_WORKSPACE_PATH`](/tips/conductor-env)).

In this example, we start a web server running on ([`$CONDUCTOR_PORT`](/tips/conductor-env)). Conductor allocates ten ports to each workspace (`$CONDUCTOR_PORT` through `$CONDUCTOR_PORT+9`).

## Nonconcurrent mode

If you can't run multiple dev servers at once, use `nonconcurrent` mode. In this mode, whenever you click the run button, Conductor will kill any in-progress run scripts before starting the new one.

For more details about how run scripts work, see [Scripts](/core/scripts).

**Examples:**

Example 1 (unknown):
```unknown
## How it works

The run script runs in your workspace directory ([`$CONDUCTOR_WORKSPACE_PATH`](/tips/conductor-env)).

In this example, we start a web server running on ([`$CONDUCTOR_PORT`](/tips/conductor-env)). Conductor allocates ten ports to each workspace (`$CONDUCTOR_PORT` through `$CONDUCTOR_PORT+9`).

## Nonconcurrent mode

If you can't run multiple dev servers at once, use `nonconcurrent` mode. In this mode, whenever you click the run button, Conductor will kill any in-progress run scripts before starting the new one.
```

---

## Workspaces and branches

**URL:** llms-txt#workspaces-and-branches

**Contents:**
  - Switching branches
  - Starting from an existing branch
  - One workspace per branch

Source: https://docs.conductor.build/tips/workspaces-and-branches

The easiest way to identify a workspace is by which branch it's on.
For instance, this workspace is on the `scroll-to-bottom-btn` branch:

<img alt="Sidebar" />

(The secondary name shown, `warsaw-v2`, is the directory name.)

When you create a new workspace, Conductor will create a new branch for it. When you start your first chat, Conductor will instruct the agent to rename this branch to match what you're working on.

### Switching branches

If what you're working on changes, you can check out a different branch:

...or rename the current branch:

...or create a new branch:

### Starting from an existing branch

If you have an existing branch and you want to start a new workspace from it, you can follow these steps:

1. Use <kbd>⌘</kbd> + <kbd>shift</kbd> + <kbd>N</kbd> or click the `...` icon next to the "New workspace" button
2. Choose the "Branches" tab and select a branch

You could also create a new workspace and then switch to the branch you want using the instructions in the "Switching branches" section above.

### One workspace per branch

A branch can only be checked out in one workspace at a time.

If you want to check out the `scroll-to-bottom-btn` branch in `tokyo`, but you already have
that branch checked out in `warsaw`, try one of these:

* In `tokyo`, run `git checkout -b scroll-to-bottom-btn-2 scroll-to-bottom-btn` to create a new branch based off of `scroll-to-bottom-btn`
* In `warsaw`, switch to any other branch (e.g., `git checkout -b dummy`), then in `tokyo` run `git checkout scroll-to-bottom-btn`

**Examples:**

Example 1 (unknown):
```unknown
...or rename the current branch:
```

Example 2 (unknown):
```unknown
...or create a new branch:
```

---

## Rails

**URL:** llms-txt#rails

Source: https://docs.conductor.build/quickstart/rails

Conductor works well with Rails apps. Here's a basic [conductor.json](/core/conductor.json) to add to the root directory of your project.

Once added, every new workspace will automatically copy your database configuration, master key, and install dependencies.

If you use environment variables via `.env` files (with the [dotenv](https://github.com/bkeepers/dotenv) gem), you can include that too:

**Examples:**

Example 1 (unknown):
```unknown
If you use environment variables via `.env` files (with the [dotenv](https://github.com/bkeepers/dotenv) gem), you can include that too:
```

---

## Testing

**URL:** llms-txt#testing

**Contents:**
- Run scripts
- Spotlight testing
- Choosing a testing approach
- Running multiple services at once

Source: https://docs.conductor.build/core/testing

Automate testing in Conductor

Once you've made changes in a workspace, it's time to test! Conductor offers two ways to speed up the testing cycle.

The `run` script in Conductor allows you to easily launch your web server, app, or unit tests from a button in the Conductor UI.

<img alt="Run script" />

The script will run in your workspace directory. You can run multiple dev servers at once by reading the `$CONDUCTOR_PORT` environment variable in your script. Learn more in our [run scripts guide](/guides/how-to-run).

Spotlight testing allows you to test your application by copying the changes in your workspace *back* to your repository root directory using a button in the Conductor UI.

<img alt="Spotlight testing" />

Enabling spotlight in a workspace automatically syncs the changes in your workspace back to your repository's root directory every time a change is made.

You'll then have access to a terminal in your repository root directory in the Conductor UI. Learn more in our [spotlight testing guide](/guides/spotlight-testing).

<Note>
  Spotlight testing is in experimental mode. Enable it under `Settings` -> `Experimental`.

If you run into any issues using spotlight testing, please reach out to us at [humans@conductor.build](mailto:humans@conductor.build).
</Note>

## Choosing a testing approach

There are a few key differences to keep in mind when choosing a testing approach:

* With spotlight testing, you can only test one workspace at a time.
* Using run scripts requires your repository to be able to run from different workspace directories on your machine.
* Consider how costly the initial build is for your repository. If it's expensive, spotlight testing can help you reuse build artifacts that already exist by running from your repository root.
* If your application depends on a single external resource (like a database or a specific port), spotlight testing (or run scripts in nonconcurrent mode) can help prevent resource conflicts.

## Running multiple services at once

Conductor only supports automating testing one service at a time. If your application requires multiple services to be tested at once (i.e. a backend and a frontend), check out our [using multiple repositories](/tips/using-multiple-repos) guide.

---

## Parallel agents

**URL:** llms-txt#parallel-agents

Source: https://docs.conductor.build/core/parallel-agents

Run multiple Claude Codes at once

Creating parallel agents in Conductor is easy. Just press <kbd>⌘</kbd> + <kbd>N</kbd> to create a new workspace. Claude will start working in an isolated environment where it can make changes without interfering with other Claudes.

---

## Build the app

**URL:** llms-txt#build-the-app

**Contents:**
- How it works
- More tips
- Next steps

The setup script runs in your new workspace directory ([`$CONDUCTOR_WORKSPACE_PATH`](/tips/conductor-env)) as soon as it's created.

In this example, we copy the .env file from the repository root directory ([`$CONDUCTOR_ROOT_PATH`](/tips/conductor-env)) into each new workspace.

The repo root directory is a good place to store files you might want to share across workspaces. You can copy or symlink them depending on your needs.

Here's the [setup script we use for Conductor](https://gist.github.com/cbh123/10b4e522252eb9d900872921fbeb736d) and a walkthrough of how it works: <video />

For long-running processes that should run in the background while you develop, add a [run script](/core/scripts#run-script).

For more details about how setup scripts work, see [Scripts](/core/scripts).

---

## Install dependencies

**URL:** llms-txt#install-dependencies

---

## Configuration with conductor.json

**URL:** llms-txt#configuration-with-conductor.json

**Contents:**
- Shared configuration
- Local configuration
- Under the hood

Source: https://docs.conductor.build/core/conductor-json

Conductor uses the `conductor.json` file to configure [scripts](./scripts).

## Shared configuration

The best way to use `conductor.json` is to create it in the root directory of your workspace and then check it into git.

This will let you version your configuration along with your code, and let new developers get started quickly using Conductor in your repo.

## Local configuration

Alternatively, you can create the `conductor.json` file in your repo root directory. This configuration will apply across all your workspaces.

You can get to the repo root directory by clicking the repository name in the sidebar and then clicking the Open button.

Conductor looks for a `conductor.json` file in three places:

1. **The root of your workspace.** In a workspace `~/my-repo/.conductor/tokyo`, Conductor will look for `~/my-repo/.conductor/tokyo/conductor.json`.
2. **The root of the default branch on remote.** Typically this will be `origin/main`.
3. **The root of your repository.** In a repository `~/my-repo`, Conductor will look for `~/my-repo/conductor.json`.

---

## Checkpoints

**URL:** llms-txt#checkpoints

**Contents:**
- Restoring Checkpoints
- How Checkpoints Work

Source: https://docs.conductor.build/core/checkpoints

View turn by turn changes in a workspace and revert to previous turns

<img alt="checkpoint diff" />

Checkpoints are automatic snapshots of Claude's changes to your codebase. They show you what changes Claude made in its most recent turn, and let you revert to previous turns.

## Restoring Checkpoints

To restore to a previous turn, click the revert icon that appears when hovering your message.

<img alt="checkpoint revert" />

Clicking the revert icon will **permanently delete** all user and AI messages from the selected turn and later. All code changes made since that user message was sent will also be reverted. Once the reversion is complete, Claude will have no knowledge of the changes or conversation you deleted.

## How Checkpoints Work

* Checkpoints are stored locally, separate from your working branch's Git history.
* Before Claude responds to each user message, Conductor configures a Claude Code hook to commit the working branch state to a private Git ref
* Each checkpoint therefore captures all AI and user code changes between when the previous and current user messages were sent.

<Note>
  Checkpoints are only supported for Claude Code.

Exercise caution when using checkpoints if multiple chats are running in the same workspace.
</Note>

---

## FAQ and known issues

**URL:** llms-txt#faq-and-known-issues

**Contents:**
- Which versions of Claude Code and Codex does Conductor use?
- How does Conductor authenticate to Claude Code and Codex?
- What permissions do agents have?
- Why does Conductor request access to Downloads, Reminders, etc.?
- How does Conductor make money?
- Why doesn't undo (cmd+z) work when I'm writing a message?
- Why do I see garbage when I switch between terminal windows (or see other issues with the terminal)?

Source: https://docs.conductor.build/faq

Frequently asked questions and known issues with Conductor

## Which versions of Claude Code and Codex does Conductor use?

Conductor comes bundled with its own installation of Claude Code and Codex. You can find them at `~/Library/Application Support/com.conductor.app/bin`. Do not update or modify them, or they might be incompatible with Conductor.

## How does Conductor authenticate to Claude Code and Codex?

By default, Conductor uses the auth tokens already saved on your machine. If you're logged into Claude Code with an API key, Conductor uses that; if you're logged in with Claude Pro or Max, Conductor uses that. You can also override this by setting an API key in Settings → Env.

## What permissions do agents have?

Agents in Conductor run with the same permissions as your user account. They can read and write files, run shell commands, and access anything you can access on your machine.

Agents run directly on your system without sandboxing.

Most users don't experience any problems with this. If you want to be extra safe, you can run Conductor on a separate machine or VM dedicated to development work.

## Why does Conductor request access to Downloads, Reminders, etc.?

When an agent or your shell tries to read a file in one of those macOS-protected folders, the system shows a permissions popup. Conductor itself doesn't need access—it's just passing through whatever your agent is trying to do.

## How does Conductor make money?

Right now we don't. We're a small team running on seed funding from a few great investors who believe in our vision. At some point we plan to charge for collaboration features that help teams make the most of AI agents, but for now we're focused on making Conductor an amazing free tool.

## Why doesn't undo (cmd+z) work when I'm writing a message?

The library we use to do @-mentions breaks the undo history. Sorry! We're looking into other solutions.

## Why do I see garbage when I switch between terminal windows (or see other issues with the terminal)?

We're streaming output from your shell along to the UI, and at some point along the way, the stream is probably getting corrupted. We're still working to track down this bug.

---

## Your first workspace

**URL:** llms-txt#your-first-workspace

**Contents:**
  - New workspace
  - Creating additional workspaces

Source: https://docs.conductor.build/first-workspace

Once you've [installed Conductor](./installation), it's time to add your first repository.

You can add a repo from a local folder or from a Git URL.

<img alt="Add Repo" />

<Note>
  Conductor requires you to be logged in to GitHub in your terminal
  environment. To confirm you're logged in, run `gh auth status` in your
  terminal.
</Note>

After you add a repo, Conductor will create a new workspace for you.

<img alt="New Workspace" />

<Note>
  Each workspace is an isolated copy and branch of your Git repo. Conductor only copies files tracked in git, but you can use a [setup script](/core/scripts) to automatically copy files (like `.env` or run `pnpm install`) into the workspace. We'll get to that later!
</Note>

### Creating additional workspaces

You can create new workspaces at any time by using **⌘⇧N** or clicking the three dots (•••) button next to the "New workspace" button.

<img alt="Create workspace from button" />

This allows you to create a workspace from:

* A specific branch
* A GitHub pull request
* A Linear issue

This is useful when you want to work on multiple features in parallel or start work on an existing issue or PR.

You now have two choices:

1. You can open the workspace in your favorite IDE (⌘O) and keep developing there.
2. You can use the built in chat to ask Claude Code to help you with your project.

Next, let's learn the [Conductor workflow →](/workflow).

---

## export ANTHROPIC_FOUNDRY_BASE_URL=https://{resource}.services.ai.azure.com

**URL:** llms-txt#export-anthropic_foundry_base_url=https://{resource}.services.ai.azure.com

---

## Using spotlight testing

**URL:** llms-txt#using-spotlight-testing

**Contents:**
- Enabling spotlight testing
- Spotlighting a workspace
- Hot reloading
- Why spotlight?

Source: https://docs.conductor.build/guides/spotlight-testing

<video>
  <source type="video/mp4" />
</video>

Use spotlight testing to test your workspace changes in your repository's root directory.

<img alt="Spotlight testing" />

## Enabling spotlight testing

Spotlight testing is experimental. To enable it, go to `Settings` -> `Experimental` and toggle on "Use spotlight testing".

If you run into any issues, please reach out to us at [humans@conductor.build](mailto:humans@conductor.build)!

## Spotlighting a workspace

When you have changes ready to test in a workspace, use the spotlight button in the Conductor UI to copy the changes back to your repository's root directory.

You'll then have access to a terminal in your repository root directory in the Conductor UI. Use this terminal to test your application.

When you turn spotlight mode off, your original state in your repository root will be restored.

<img alt="Spotlight testing" />

Enabling spotlight mode adds a file watcher to your workspace. Whenever changes are detected, Conductor will create a [checkpoint](/core/checkpoints) commit of your workspace and check it out in your repository root.

If your development server supports hot reloading, you'll see workspace changes reflected without having to take any manual action.

Spotlight testing is a great fit for:

* **Directory-dependent applications** - Spotlight runs your app in your repository's root directory, so you don't have to build workarounds if your application has assumptions about what directory on a machine it runs from.
* **Long initial builds** - If your first build takes a long time but subsequent incremental builds are fast, spotlight testing enables reuse of build artifacts that already exist by running from one location.
* **External resource dependencies** - If your app depends on a single external resource (like a database or a specific port), spotlight testing leverages your existing resource setups in the repository root.

---

## Using monorepos

**URL:** llms-txt#using-monorepos

**Contents:**
- Adding a monorepo
- Working with specific directories
- Running Multiple Services at Once
- Using Git Submodules

Source: https://docs.conductor.build/tips/using-monorepos

Conductor supports monorepos out of the box.

While we know the experience isn't perfect yet, below are some tips and common questions we hear. If you have other questions or feedback about using monorepos in Conductor, please reach out to us at [humans@conductor.build](mailto:humans@conductor.build).

Adding a monorepo to Conductor is the same as [adding any other repository](/first-workspace).

When you add a monorepo to Conductor, workspaces are created at the repository's root level. That means agents have access to all packages and services in your monorepo by default.

## Working with specific directories

Frequently, you might want your agents to only work on a few directories in your monorepo. If you have multiple directories with similar file names, agents can get confused when grep'ing or glob'ing.

When you create a workspace for your monorepo, you can select which working directories will be visible in the workspace.

<img alt="Select working directories" />

Any directories not selected will be hidden in the workspace using `git sparse checkout` ([docs](https://git-scm.com/docs/git-sparse-checkout)).

You can also add/remove directories from the workspace at any time by clicking the "Select working directories" button in the git panel.

<img alt="Select working directories button" />

## Running Multiple Services at Once

To run multiple services at once in a workspace, we recommend creating a [run script](/core/scripts#run-script) that launches *all* of the services you need.

## Using Git Submodules

If your monorepo uses git submodules, we recommend putting `git submodule update --init --recursive` in your
[setup script](/core/scripts#setup-script). This will automatically initialize and clone all submodules on workspace creation.

---

## Use with Cursor or VSCode

**URL:** llms-txt#use-with-cursor-or-vscode

**Contents:**
- Open a workspace
- Naming Cursor windows

Source: https://docs.conductor.build/guides/use-with-cursor

Tips for using Conductor alongside VSCode IDEs

From your workspace, click "Open In" (or click cmd+O) to open Cursor in the workspace directory. (If you've already opened it, this will focus the Cursor window.)

## Naming Cursor windows

If you open many workspaces in Cursor, you might find it hard to keep track of which window corresponds to which workspace. To make this easier

1. In Cursor, go to User Settings (⌘⇧P -> "Preferences: Open User Settings")
2. Search for `window.title`
3. Set it to this value:

You will now see the branch name in the title bar, like

**Examples:**

Example 1 (unknown):
```unknown
${activeRepositoryBranchName}${separator}${rootName}${separator}${profileName}
```

Example 2 (unknown):
```unknown
my-feature — tokyo
```

---

## Diff viewer

**URL:** llms-txt#diff-viewer

Source: https://docs.conductor.build/core/diff-viewer

See the changes Claude made to your codebase and sync with GitHub

Once Claude has finished working, you can see the changes it made to your codebase in the Diff Viewer.

Conductor will recommend each action to take on the way to merging your PR.

<img alt="Conductor Diff Viewer" />

<img alt="Conductor Diff Viewer - Merge" />

---

## Scripts

**URL:** llms-txt#scripts

**Contents:**
- Getting started
- Setup script
- Run script
  - Run script mode
- Archive script

Source: https://docs.conductor.build/core/scripts

Automate repeated actions with `conductor.json`

To get the most out of Conductor, you can automate repeated actions using scripts.
Conductor lets you define three scripts:

1. Setup script: runs each time you create a workspace
2. Run script: runs when you click the "Run" button in the bottom-right corner of the screen
3. Archive script: runs when you archive a workspace

Your scripts are stored in a `conductor.json` file in the root of your workspace.

To configure these scripts, create a `conductor.json` file in the root of your workspace. For example:

In setup scripts, as in the terminal, you can use any of the [Conductor environment variables](/tips/conductor-env). The scripts run using zshell.

Scripts are the trickiest part of Conductor. If you're having trouble, reach out to us at [humans@conductor.build](mailto:humans@conductor.build).

When Conductor creates a workspace, it copies in all your git files.

Use the setup script to set up any files that aren't tracked in git: for instance, you might install dependencies or copy `.env` files.

The setup script will run inside the newly-created workspace directory.

If your app uses a `.env` file, we recommend these steps:

1. Go to the repository settings page (click the repo name in the left sidebar)
2. Choose "Open In" to open the repository root directory in Finder or an IDE
3. If your `.env` file isn't already in the repository root, copy it there
4. In your setup script, symlink .env into the workspace with `ln -s "$CONDUCTOR_ROOT_PATH/.env" .env`

Use the run script to easily launch your web server, app, or unit tests from a button in Conductor.

Example: `python3 -m http.server --port $CONDUCTOR_PORT`

If you can't run multiple dev servers at once, use `nonconcurrent` mode. In this mode, whenever you click the run button, Conductor will kill any in-progress run scripts before starting the new one.

When you archive a workspace, Conductor deletes the workspace directory. Use the archive script to clean up any resources that live outside this directory.

For example, our archive script cleans up the Application Support directory:

**Examples:**

Example 1 (unknown):
```unknown
In setup scripts, as in the terminal, you can use any of the [Conductor environment variables](/tips/conductor-env). The scripts run using zshell.

Scripts are the trickiest part of Conductor. If you're having trouble, reach out to us at [humans@conductor.build](mailto:humans@conductor.build).

## Setup script

When Conductor creates a workspace, it copies in all your git files.

Use the setup script to set up any files that aren't tracked in git: for instance, you might install dependencies or copy `.env` files.

The setup script will run inside the newly-created workspace directory.

If your app uses a `.env` file, we recommend these steps:

1. Go to the repository settings page (click the repo name in the left sidebar)
2. Choose "Open In" to open the repository root directory in Finder or an IDE
3. If your `.env` file isn't already in the repository root, copy it there
4. In your setup script, symlink .env into the workspace with `ln -s "$CONDUCTOR_ROOT_PATH/.env" .env`

## Run script

Use the run script to easily launch your web server, app, or unit tests from a button in Conductor.

Example: `python3 -m http.server --port $CONDUCTOR_PORT`

### Run script mode

If you can't run multiple dev servers at once, use `nonconcurrent` mode. In this mode, whenever you click the run button, Conductor will kill any in-progress run scripts before starting the new one.
```

Example 2 (unknown):
```unknown
## Archive script

When you archive a workspace, Conductor deletes the workspace directory. Use the archive script to clean up any resources that live outside this directory.

For example, our archive script cleans up the Application Support directory:
```

---

## Or provide the full base URL:

**URL:** llms-txt#or-provide-the-full-base-url:

---

## Elixir + Phoenix

**URL:** llms-txt#elixir-+-phoenix

Source: https://docs.conductor.build/quickstart/phoenix

Conductor works well with Phoenix LiveView apps. Here's a basic [conductor.json](/core/conductor.json) to add to the root directory of your project.

Once added, every new workspace will automatically copy your environment configuration and install dependencies.

If you use runtime configuration with `config/runtime.exs` and secrets, you may want to copy those too:

**Examples:**

Example 1 (unknown):
```unknown
If you use runtime configuration with `config/runtime.exs` and secrets, you may want to copy those too:
```

---

## Azure resource name (replace {resource} with your resource name)

**URL:** llms-txt#azure-resource-name-(replace-{resource}-with-your-resource-name)

export ANTHROPIC_FOUNDRY_RESOURCE={resource}

---

## NextJS + Vercel

**URL:** llms-txt#nextjs-+-vercel

Source: https://docs.conductor.build/quickstart/nextjs

Conductor works well with NextJS apps. Here's a basic [conductor.json](/core/conductor.json) to add to the root directory of your project.

Once added, every new workspace will automatically copy your `.env.local` and `.vercel` configuration, and then install dependencies.

---

## Use with Bedrock, Vertex, GLM

**URL:** llms-txt#use-with-bedrock,-vertex,-glm

**Contents:**
- Bedrock Example
- GLM Example
- Azure AI Example

Source: https://docs.conductor.build/guides/providers

Connect Conductor to different model providers

<img alt="Environment Variables" />

Conductor runs using your local Claude Code login. You can check your auth status by running `claude /login` in your terminal.

We also support running Claude Code on AWS Bedrock, Google Vertex AI, or any Anthropic API compatible provider, like GLM.

Go to `Settings` -> `Env` to set environment variables. Check out the [Claude Code docs](https://code.claude.com/docs/en/third-party-integrations) for a full list of environment variables.

For example, if you want to use Bedrock, you can set your env variables like this:

Docs here: [https://docs.z.ai/scenario-example/develop-tools/claude](https://docs.z.ai/scenario-example/develop-tools/claude).

**Examples:**

Example 1 (unknown):
```unknown
## GLM Example

Docs here: [https://docs.z.ai/scenario-example/develop-tools/claude](https://docs.z.ai/scenario-example/develop-tools/claude).
```

Example 2 (unknown):
```unknown
## Azure AI Example
```

---

## Migrating to conductor.json

**URL:** llms-txt#migrating-to-conductor.json

**Contents:**
- How to migrate
- Alternative: local conductor.json
- Troubleshooting

Source: https://docs.conductor.build/tips/migration-conductor-json

<img alt="Migration conductor.json" />

To make it easier to share configurations, as of version 0.11.0, we store your setup and run scripts in a `conductor.json` file.

If you had previously added scripts using the UI, when you upgrade you'll see a new workspace called "Migrate conductor.json".

In the migration workspace:

1. Click "Create migration PR"
2. Merge it

In the PR, Conductor has written your existing scripts into a new `conductor.json` file. (If you see any other changes in the PR, consider removing them before merging.)

A few seconds after you merge, your other workspaces will be able to use scripts again. For more on how this works, see [conductor.json precedence](/tips/scripts#conductor-json-precedence).

If you run into any issues with the migration, reach out to us at [humans@conductor.build](mailto:humans@conductor.build).

## Alternative: local conductor.json

If you'd rather not commit conductor.json, you can follow these steps instead:

1. Go to the repository settings page (click the repo name in the left sidebar)
2. Choose "Open In" to open the repository root directory in Finder or an IDE
3. Create a `conductor.json` file

If you had trouble with the migration, try clicking on the repo name in the sidebar and opening the "Debug your conductor.json migration" section.

Or, send us an email at [humans@conductor.build](mailto:humans@conductor.build)

---

## Running multiple processes

**URL:** llms-txt#running-multiple-processes

**Contents:**
- Avoid & for backgrounding

Source: https://docs.conductor.build/tips/multiple-processes

If your run script spawns multiple processes, make sure they're in the same process group so they can be properly cleaned up by using [concurrently](https://www.npmjs.com/package/concurrently) or a similar tool:

## Avoid & for backgrounding

If you use & to background a process, it will run in a separate process group. This can lead to "port already in use" and similar errors.

When Conductor stops the run script, only the worker will be terminated. The server will continue to run, holding ports, memory, and other resources.

**Examples:**

Example 1 (unknown):
```unknown

```

Example 2 (unknown):
```unknown
## Avoid & for backgrounding

If you use & to background a process, it will run in a separate process group. This can lead to "port already in use" and similar errors.

For example:
```

---

## From issue to PR

**URL:** llms-txt#from-issue-to-pr

Source: https://docs.conductor.build/guides/issue-to-pr

Conductor development lifecycle

Here's a complete walkthrough of how to go from an issue to a PR with Conductor.

<iframe title="Introducing Conductor" />

---

## Privacy

**URL:** llms-txt#privacy

**Contents:**
- What data do we use?
- Where do you store my chats?
- What types of data does Conductor collect?
- Where does my network traffic go?
- What data do the model providers collect? Are my messages used for training?
- Is my data encrypted? Who can access my data?

Source: https://docs.conductor.build/account/privacy

What we do (and don't do) with your data

## What data do we use?

We don't look at your chats, and we don't want to. Your chats are between you and your AI.

We do collect analytics data, like what features you use, crash logs, etc. This helps us fix bugs and learn which parts of Conductor to improve.

## Where do you store my chats?

Your chat history is saved locally in the Application Support directory `~/Library/Application Support/com.conductor.app`. None of it is stored on our servers.

## What types of data does Conductor collect?

Most app data is stored locally on your computer in the Application Support directory.

Here's what we store elsewhere:

In an encrypted Postgres database served by Fly, we store:

* Your account data (such as your email address, and if you integrate with GitHub, installation data)

We store analytics data in [PostHog](https://posthog.com/) when an event occurs in the app, such as

* You create a workspace, select a model, or send a message (including metadata like which model was involved and which app features you’re using)
* A model provider returns an error (including the error message)
* An unexpected error occurs (including the error message and stack trace)

PostHog stores data about your computer, like your OS and IP address.

We don't capture or store any session recordings.

## Where does my network traffic go?

All network traffic goes straight to your model provider. By default, this is Anthropic, but you can set a custom provider (like Bedrock or Vertex) in `Settings` -> `Providers`.

## What data do the model providers collect? Are my messages used for training?

You can find the privacy policy of our model providers here:

* [Anthropic](https://www.anthropic.com/legal/privacy)
* [OpenAI](https://openai.com/policies/row-privacy-policy/)

## Is my data encrypted? Who can access my data?

Any data we store (like your email) is encrypted in a Fly Postgres database or on PostHog's servers (both SOC 2 compliant). It can be accessed only by Conductor employees.

---

## Codex

**URL:** llms-txt#codex

Source: https://docs.conductor.build/tips/codex

Run OpenAI's Codex in Conductor

<img alt="Codex selected in the model picker" />

As of November 2025, Codex is available in Conductor!

To use the Codex Agent, select it in the model picker. Run Codex by itself or alongside Claude Code in separate tabs. We've found Codex helpful for precise, fast, and surgical edits.

---

## Using multiple repositories

**URL:** llms-txt#using-multiple-repositories

**Contents:**
- /add-dir
- Running Multiple Services at Once

Source: https://docs.conductor.build/tips/using-multiple-repos

Conductor supports using multiple repositories at once.

While we know the experience isn't perfect yet, below are some tips and common questions we hear. If you have other questions or feedback about using multiple repositories in Conductor, please reach out to us at [humans@conductor.build](mailto:humans@conductor.build).

To link multiple directories together in Conductor, we recommend:

1. Add each directory to Conductor
2. Create a workspace for each directory
3. In one workspace, enter `/add-dir` and select the other workspaces you'd like to link together.

<img alt="Add directory" />

Now, agents in this workspace will be able to access files and code from the other linked workspaces.

## Running Multiple Services at Once

To run multiple services from different repositories at once, we recommend creating a [run script](/core/scripts#run-script) for each repository.

---

## Slash commands

**URL:** llms-txt#slash-commands

**Contents:**
- Setting up slash commands

Source: https://docs.conductor.build/core/slash-commands

Run custom commands within a chat

<img alt="slash command" />

Custom slash commands allow you to define frequently-used prompts as Markdown files that Claude Code can execute.

## Setting up slash commands

Create custom commands by adding Markdown files to the `.claude/commands/` directory:

Learn more about slash commands [here](https://docs.anthropic.com/en/docs/claude-code/slash-commands).

---

## MCP

**URL:** llms-txt#mcp

**Contents:**
- Adding MCP servers

Source: https://docs.conductor.build/core/mcp

Connect to external tools and data sources

Conductor can connect to external tools and data sources through the Model Context Protocol (MCP). MCP servers give Claude Code access to your tools, databases, and APIs.

Learn more about MCP [here](https://docs.anthropic.com/en/docs/claude-code/mcp).

## Adding MCP servers

Add an MCP server using the Claude Code CLI:

For example, to add Context7 (documentation search):

Our favorite MCPs are Context7 (documentation search) and Linear (issue management).

**Examples:**

Example 1 (unknown):
```unknown
For example, to add Context7 (documentation search):
```

---

## Copy .env file

**URL:** llms-txt#copy-.env-file

cp $CONDUCTOR_ROOT_PATH/.env .env

---

## Conductor environment variables

**URL:** llms-txt#conductor-environment-variables

Source: https://docs.conductor.build/tips/conductor-env

Conductor makes these environment variables available in your terminal and [scripts](/core/scripts):

| Variable                   | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| CONDUCTOR\_WORKSPACE\_NAME | Workspace name                                         |
| CONDUCTOR\_WORKSPACE\_PATH | Workspace path                                         |
| CONDUCTOR\_ROOT\_PATH      | Path to the repository root directory                  |
| CONDUCTOR\_DEFAULT\_BRANCH | Name of the default branch (defaults to `main`)        |
| CONDUCTOR\_PORT            | First in a range of 10 ports assigned to the workspace |

---

## Welcome

**URL:** llms-txt#welcome

**Contents:**
- Get started
- Talk to us
- Learn more

Source: https://docs.conductor.build/index

Conductor is a Mac app that lets you run a bunch of Claude Codes at once.

Each Claude gets an isolated copy of your codebase. See at a glance what they're working on, then review and merge their changes, all in one place.

<iframe title="Introducing Conductor" />

<CardGroup>
  <Card title="Download" icon="download" href="/installation">
    Get Conductor running on your Mac.
  </Card>

<Card title="Your First Workspace" icon="comment" href="/first-workspace">
    Start conducting.
  </Card>
</CardGroup>

Join the Conductor community and get support from the team.

<CardGroup>
  <Card title="Message the Founders" icon="envelope" href="mailto:humans@conductor.build">
    Tell us your bugs, ideas, and any other feedback!
  </Card>
</CardGroup>

Conductor is packed with features:

* [Parallel agents](./core/multiple-models)
* [Diff viewer](./core/diff-viewer)
* [MCP](./core/mcp)
* [Slash commands](./core/slash-commands)

---

## Set models to your resource's deployment names

**URL:** llms-txt#set-models-to-your-resource's-deployment-names

**Contents:**
- See more

export ANTHROPIC_DEFAULT_SONNET_MODEL='claude-sonnet-4-5'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='claude-haiku-4-5'
export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-5'
```

See Claude Code docs for a full list of variables here: [https://code.claude.com/docs/en/third-party-integrations](https://code.claude.com/docs/en/third-party-integrations)

---

## Install

**URL:** llms-txt#install

**Contents:**
- Download for Mac
- Setup

Source: https://docs.conductor.build/installation

Get Conductor up and running

1. Go to [conductor.build](https://conductor.build) and click "Download Conductor"
2. Drag the Conductor app to your Applications folder
3. Open Conductor.

<Note>
  Conductor isn't available yet for Windows or Linux, but we're working on it.
  [Sign up here](https://docs.google.com/forms/d/1jPQsC8oLNIyjHW3WOsUxK2XNm0Z-BAzdooZuMs9cbFM/viewform) and we'll let you know you when it's ready.
</Note>

1. Conductor requires you to be logged in to GitHub in your terminal environment. To confirm you're logged in, run `gh auth status` in your terminal.

2. If you already use Claude Code, you're all set. Otherwise [set up Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup) and run `claude /login`.

You're ready to start conducting!

---
