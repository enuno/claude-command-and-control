# Raycast - Other

**Pages:** 31

---

## React hooks

**URL:** llms-txt#react-hooks

---

## Functions

**URL:** llms-txt#functions

---

## executeSQL

**URL:** llms-txt#executesql

**Contents:**
- Signature
  - Arguments
  - Return
- Example

A function that executes a SQL query on a local SQLite database and returns the query result in JSON format.

* `databasePath` is the path to the local SQL database.
* `query` is the SQL query to run on the database.

Returns a `Promise` that resolves to an array of objects representing the query results.

**Examples:**

Example 1 (ts):
```ts
function executeSQL<T = unknown>(databasePath: string, query: string): Promise<T[]>
```

Example 2 (typescript):
```typescript
import { closeMainWindow, Clipboard } from "@raycast/api";
import { executeSQL } from "@raycast/utils";

type Message = { body: string; code: string };

const DB_PATH = "/path/to/chat.db";

export default async function Command() {
  const query = `
    SELECT body, code
    FROM message
    ORDER BY date DESC
    LIMIT 1;
  `;

  const messages = await executeSQL<Message>(DB_PATH, query);

  if (messages.length > 0) {
    const latestCode = messages[0].code;
    await Clipboard.paste(latestCode);
    await closeMainWindow();
  }
}
```

---

## Forked Extensions (community tool)

**URL:** llms-txt#forked-extensions-(community-tool)

**Contents:**
- Features
- Install
- Hint

This extension leverages the [Git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout) feature to efficiently manage your forked extensions. Our goal is to eliminate the need for cloning the entire repository, which can exceed 20 GB in size, by enabling sparse-checkout. With this extension, you can forgo Ray CLI's commands, allowing you to use Git commands directly and regular [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) for managing your extensions.

* Explore full extension list
* Only fork the extension you need to save space
* Remove an extension from forked list
* Synchronize the forked repository with the upstream repository on local

The extension is available on the [Raycast Store](https://www.raycast.com/litomore/forked-extensions).

<p align="center"><a href="https://www.raycast.com/litomore/forked-extensions"><img src="https://www.raycast.com/litomore/forked-extensions/install_button@2x.png?v=1.1" alt=""></a></p>

Please note with this extension you no longer need to use Ray CLI's `pull-contributions` and `publish` commands. Just use Git commands or your favorite Git GUI tool to manage your forked extensions.

---

## getAvatarIcon

**URL:** llms-txt#getavataricon

**Contents:**
- Signature
- Example

Icon to represent an avatar when you don't have one. The generated avatar will be generated from the initials of the name and have a colorful but consistent background.

![Avatar Icon example](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3c6269820bd9ecb9d18550e31d2fff626deefdc5%2Futils-avatar-icon.png?alt=media)

* `name` is a string of the subject's name.
* `options.background` is a hexadecimal representation of a color to be used as the background color. By default, the hook will pick a random but consistent (eg. the same name will the same color) color from a set handpicked to nicely match Raycast.
* `options.gradient` is a boolean to choose whether the background should have a slight gradient or not. By default, it will.

Returns an [Image.Asset](https://developers.raycast.com/api-reference/user-interface/icons-and-images) that can be used where Raycast expects them.

**Examples:**

Example 1 (ts):
```ts
function getAvatarIcon(
  name: string,
  options?: {
    background?: string;
    gradient?: boolean;
  },
): Image.Asset;
```

Example 2 (tsx):
```tsx
import { List } from "@raycast/api";
import { getAvatarIcon } from "@raycast/utils";

export default function Command() {
  return (
    <List>
      <List.Item icon={getAvatarIcon("John Doe")} title="John Doe" />
    </List>
  );
}
```

---

## Getting a Google client ID

**URL:** llms-txt#getting-a-google-client-id

**Contents:**
- Step 1: Access Google Cloud Console
- Step 2: Create a Project (if needed)
- Step 3: Enable Required APIs
- Step 4: Configure OAuth Consent Screen
- Step 5: Create an OAuth Client ID
- Step 6: Use Your New Client ID 🎉

Follow these steps to get a Google client ID:

## Step 1: Access Google Cloud Console

Navigate to the [Google Cloud Console](https://console.developers.google.com/apis/credentials).

## Step 2: Create a Project (if needed)

1. Click **Create Project**.
2. Provide a **Project Name**.
3. Select an optional **Organization**.
4. Click **Create**.

## Step 3: Enable Required APIs

1. Go to **Enabled APIs & services**.
2. Click **ENABLE APIS AND SERVICES**.
3. Search for and enable the required API (e.g., Google Drive API).

## Step 4: Configure OAuth Consent Screen

1. Click on **OAuth consent screen**.
2. Choose **Internal** or **External** (choose **External** if you intend to publish the extension in the Raycast store).
3. Enter these details:
   * **App name**: Raycast (Your Extension Name)
   * **User support email**: <your-email@example.com>
   * **Logo**: Paste Raycast's logo over there ([Link to Raycast logo](https://raycastapp.notion.site/Raycast-Press-Kit-ce1ccf8306b14ac8b8d47b3276bf34e0#29cbc2f3841444fdbdcb1fdff2ea2abf))
   * **Application home page**: <https://www.raycast.com>
   * **Application privacy policy link**: <https://www.raycast.com/privacy>
   * **Application terms of service link**: <https://www.raycast.com/terms-of-service>
   * **Authorized domains**: Click **ADD DOMAIN** then add `raycast.com`
   * **Developer contact**: <your-email@example.com>
4. Add the necessary scopes for your app (visit the [Google OAuth scopes docs](https://developers.google.com/identity/protocols/oauth2/scopes) if you manually need to add scopes)
5. Add your own email as a test user and others if needed
6. Review and go back to the dashboard

## Step 5: Create an OAuth Client ID

1. Go to **Credentials**, click **CREATE CREDENTIALS**, then **OAuth client ID**
2. Choose **iOS** as the application type
3. Set the **Bundle ID** to `com.raycast`.
4. Copy your **Client ID**

## Step 6: Use Your New Client ID 🎉

{% hint style="info" %}
You'll need to publish the app in the **OAuth consent screen** so that everyone can use it (and not only test users). The process can be more or less complex depending on whether you use sensitive or restrictive scopes.
{% endhint %}

---

## usePromise

**URL:** llms-txt#usepromise

**Contents:**
- Signature
  - Arguments
  - Returns
- Example
- Mutation and Optimistic Updates
- Pagination
  - Full Example
- Types
  - AsyncState
  - MutatePromise

Hook which wraps an asynchronous function or a function that returns a Promise and returns the [AsyncState](#asyncstate) corresponding to the execution of the function.

{% hint style="info" %}
The function is assumed to be constant (eg. changing it won't trigger a revalidation).
{% endhint %}

* `fn` is an asynchronous function or a function that returns a Promise.
* `args` is the array of arguments to pass to the function. Every time they change, the function will be executed again. You can omit the array if the function doesn't require any argument.

* `options.abortable` is a reference to an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel a previous call when triggering a new one.
* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the function as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `revalidate` is a method to manually call the function with the same arguments again.
* `mutate` is a method to wrap an asynchronous update and gives some control about how the `usePromise`'s data should be updated while the update is going through. By default, the data will be revalidated (eg. the function will be called again) after the update is done. See [Mutation and Optimistic Updates](#mutation-and-optimistic-updates) for more information.

## Mutation and Optimistic Updates

In an optimistic update, the UI behaves as though a change was successfully completed before receiving confirmation from the server that it was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

You can specify an `optimisticUpdate` function to mutate the data in order to reflect the change introduced by the asynchronous update.

When doing so, you can specify a `rollbackOnError` function to mutate back the data if the asynchronous update fails. If not specified, the data will be automatically rolled back to its previous value (before the optimistic update).

The hook has built-in support for pagination. In order to enable pagination, `fn`'s type needs to change from

> an asynchronous function or a function that returns a Promise

> a function that returns an asynchronous function or a function that returns a Promise

In practice, this means going from

or, if your data source uses cursor-based pagination, you can return a `cursor` alongside `data` and `hasMore`, and the cursor will be passed as an argument the next time the function gets called:

You'll notice that, in the second case, the hook returns an additional item: `pagination`. This can be passed to Raycast's `List` or `Grid` components in order to enable pagination.\
Another thing to notice is that the async function receives a [PaginationOptions](#paginationoptions) argument, and returns a specific data format:

Every time the promise resolves, the hook needs to figure out if it should paginate further, or if it should stop, and it uses `hasMore` for this.\
In addition to this, the hook also needs `data`, and needs it to be an array, because internally it appends it to a list, thus making sure the `data` that the hook *returns* always contains the data for all of the pages that have been loaded so far.\
Additionally, you can also pass a `cursor` property, which will be included along with `page` and `lastItem` in the next pagination call.

An object corresponding to the execution state of the function.

A method to wrap an asynchronous update and gives some control about how the `usePromise`'s data should be updated while the update is going through.

### PaginationOptions

An object passed to a `PaginatedPromise`, it has two properties:

* `page`: 0-indexed, this it's incremented every time the promise resolves, and is reset whenever `revalidate()` is called.
* `lastItem`: this is a copy of the last item in the `data` array from the last time the promise was executed. Provided for APIs that implement cursor-based pagination.
* `cursor`: this is the `cursor` property returned after the previous execution of `PaginatedPromise`. Useful when working with APIs that provide the next cursor explicitly.

**Examples:**

Example 1 (ts):
```ts
type Result<T> = `type of the returned value of the returned Promise`;

function usePromise<T>(
  fn: T,
  args?: Parameters<T>,
  options?: {
    abortable?: RefObject<AbortController | null | undefined>;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: Result<T>) => void;
    onWillExecute?: (args: Parameters<T>) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  },
): AsyncState<Result<T>> & {
  revalidate: () => void;
  mutate: MutatePromise<Result<T> | undefined>;
};
```

Example 2 (tsx):
```tsx
import { Detail, ActionPanel, Action } from "@raycast/api";
import { usePromise } from "@raycast/utils";

export default function Command() {
  const abortable = useRef<AbortController>();
  const { isLoading, data, revalidate } = usePromise(
    async (url: string) => {
      const response = await fetch(url, { signal: abortable.current?.signal });
      const result = await response.text();
      return result;
    },
    ["https://api.example"],
    {
      abortable,
    },
  );

  return (
    <Detail
      isLoading={isLoading}
      markdown={data}
      actions={
        <ActionPanel>
          <Action title="Reload" onAction={() => revalidate()} />
        </ActionPanel>
      }
    />
  );
}
```

Example 3 (tsx):
```tsx
import { Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";

export default function Command() {
  const { isLoading, data, mutate } = usePromise(
    async (url: string) => {
      const response = await fetch(url);
      const result = await response.text();
      return result;
    },
    ["https://api.example"],
  );

  const appendFoo = async () => {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Appending Foo" });
    try {
      await mutate(
        // we are calling an API to do something
        fetch("https://api.example/append-foo"),
        {
          // but we are going to do it on our local data right away,
          // without waiting for the call to return
          optimisticUpdate(data) {
            return data + "foo";
          },
        },
      );
      // yay, the API call worked!
      toast.style = Toast.Style.Success;
      toast.title = "Foo appended";
    } catch (err) {
      // oh, the API call didn't work :(
      // the data will automatically be rolled back to its previous value
      toast.style = Toast.Style.Failure;
      toast.title = "Could not append Foo";
      toast.message = err.message;
    }
  };

  return (
    <Detail
      isLoading={isLoading}
      markdown={data}
      actions={
        <ActionPanel>
          <Action title="Append Foo" onAction={() => appendFoo()} />
        </ActionPanel>
      }
    />
  );
}
```

Example 4 (ts):
```ts
const { isLoading, data } = usePromise(
  async (searchText: string) => {
    const data = await getUser(); // or any asynchronous logic you need to perform
    return data;
  },
  [searchText],
);
```

---

## ESLint

**URL:** llms-txt#eslint

**Contents:**
- Customization
- Migration

Raycast makes it easy to lint your extensions using the CLI's lint command (`ray lint`).

Raycast provides by default an [opinionated ESLint configuration](https://github.com/raycast/eslint-config/blob/main/index.js) that includes everything you need to lint your Raycast extensions. The default configuration is as simple as this:

It abstracts away the different ESLint dependencies used for Raycast extensions and includes different rule-sets.

It also includes Raycast's own ESLint plugin rule-set that makes it easier for you to follow best practices when building extension. For example, there's a [rule](https://github.com/raycast/eslint-plugin/blob/main/docs/rules/prefer-title-case.md) helping you follow the Title Case convention for `Action` components.

You can check Raycast's ESLint plugin rules directly on the [repository documentation](https://github.com/raycast/eslint-plugin#rules).

You're free to turn on/off rules or add new plugins as you see fit for your extensions. For example, you could add the rule [`@raycast/prefer-placeholders`](https://github.com/raycast/eslint-plugin/blob/main/docs/rules/prefer-placeholders.md) for your extension:

To keep the consistency of development experiences across extensions, we don't encourage adding too many personal ESLint preferences to an extension.

Starting with version 1.48.8, the ESLint configuration is included automatically when creating a new extension using the `Create Extension` command. If your extension was created before this version, you can migrate following the steps outlined on the [v1.48.8](https://developers.raycast.com/migration/v1.48.8) page.

**Examples:**

Example 1 (js):
```js
const { defineConfig } = require("eslint/config");
const raycastConfig = require("@raycast/eslint-config");

module.exports = defineConfig([...raycastConfig]);
```

Example 2 (js):
```js
const { defineConfig } = require("eslint/config");
const raycastConfig = require("@raycast/eslint-config");

module.exports = defineConfig([
  ...raycastConfig,
  {
    rules: {
      "@raycast/prefer-placeholders": "warn",
    },
  },
]);
```

---

## useSQL

**URL:** llms-txt#usesql

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Mutation and Optimistic Updates
- Types
  - AsyncState
  - MutatePromise

Hook which executes a query on a local SQL database and returns the [AsyncState](#asyncstate) corresponding to the execution of the query.

* `databasePath` is the path to the local SQL database.
* `query` is the SQL query to run on the database.

* `options.permissionPriming` is a string explaining why the extension needs full disk access. For example, the Apple Notes extension uses `"This is required to search your Apple Notes."`. While it is optional, we recommend setting it to help users understand.

Including the [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise)'s options:

* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the function as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `permissionView` is a React Node that should be returned when present. It will prompt users to grant full disk access (which is required for the hook to work).
* `revalidate` is a method to manually call the function with the same arguments again.
* `mutate` is a method to wrap an asynchronous update and gives some control over how the `useSQL`'s data should be updated while the update is going through. By default, the data will be revalidated (eg. the function will be called again) after the update is done. See [Mutation and Optimistic Updates](#mutation-and-optimistic-updates) for more information.

## Mutation and Optimistic Updates

In an optimistic update, the UI behaves as though a change was successfully completed before receiving confirmation from the server that it was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

You can specify an `optimisticUpdate` function to mutate the data in order to reflect the change introduced by the asynchronous update.

When doing so, you can specify a `rollbackOnError` function to mutate back the data if the asynchronous update fails. If not specified, the data will be automatically rolled back to its previous value (before the optimistic update).

An object corresponding to the execution state of the function.

A method to wrap an asynchronous update and gives some control about how the `useSQL`'s data should be updated while the update is going through.

**Examples:**

Example 1 (ts):
```ts
function useSQL<T>(
  databasePath: string,
  query: string,
  options?: {
    permissionPriming?: string;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: T) => void;
    onWillExecute?: (args: string[]) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  }
): AsyncState<T> & {
  revalidate: () => void;
  mutate: MutatePromise<T | U | undefined>;
  permissionView: React.ReactNode | undefined;
};
```

Example 2 (tsx):
```tsx
import { useSQL } from "@raycast/utils";
import { resolve } from "path";
import { homedir } from "os";

const NOTES_DB = resolve(homedir(), "Library/Group Containers/group.com.apple.notes/NoteStore.sqlite");
const notesQuery = `SELECT id, title FROM ...`;
type NoteItem = {
  id: string;
  title: string;
};

export default function Command() {
  const { isLoading, data, permissionView } = useSQL<NoteItem>(NOTES_DB, notesQuery);

  if (permissionView) {
    return permissionView;
  }

  return (
    <List isLoading={isLoading}>
      {(data || []).map((item) => (
        <List.Item key={item.id} title={item.title} />
      ))}
    </List>
  );
}
```

Example 3 (tsx):
```tsx
import { Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useSQL } from "@raycast/utils";

const NOTES_DB = resolve(homedir(), "Library/Group Containers/group.com.apple.notes/NoteStore.sqlite");
const notesQuery = `SELECT id, title FROM ...`;
type NoteItem = {
  id: string;
  title: string;
};

export default function Command() {
  const { isLoading, data, mutate, permissionView } = useFetch("https://api.example");

  if (permissionView) {
    return permissionView;
  }

  const createNewNote = async () => {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Creating new Note" });
    try {
      await mutate(
        // we are calling an API to do something
        somehowCreateANewNote(),
        {
          // but we are going to do it on our local data right away,
          // without waiting for the call to return
          optimisticUpdate(data) {
            return data?.concat([{ id: "" + Math.random(), title: "New Title" }]);
          },
        },
      );
      // yay, the API call worked!
      toast.style = Toast.Style.Success;
      toast.title = "Note created";
    } catch (err) {
      // oh, the API call didn't work :(
      // the data will automatically be rolled back to its previous value
      toast.style = Toast.Style.Failure;
      toast.title = "Could not create Note";
      toast.message = err.message;
    }
  };

  return (
    <List isLoading={isLoading}>
      {(data || []).map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          actions={
            <ActionPanel>
              <Action title="Create new Note" onAction={() => createNewNote()} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

Example 4 (ts):
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
  data: T,
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
  data: T | undefined,
  error: Error | undefined
}
```

---

## Background Refresh

**URL:** llms-txt#background-refresh

**Contents:**
- Scheduling Commands
  - Manifest
- Running in the background
- Development and Debugging
- Preferences
- Best Practices

Commands of an extension can be configured to be automatically run in the background, without the user manually opening them. Background refresh can be useful for:

* dynamically updating the subtitle of a command in Raycast root search
* refreshing menu bar commands
* other supporting functionality for your main commands

This guide helps you understand when and how to use background refresh and learn about the constraints.

## Scheduling Commands

Raycast supports scheduling commands with mode `no-view` and `menu-bar` at a configured interval.

Add a new property `interval` to a command in the [manifest](https://developers.raycast.com/manifest#command-properties)

The interval specifies that the command should be launched in the background every X seconds (s), minutes (m), hours (h) or days (d). Examples: `10m`, `12h`, `1d`. The minimum value is 10 seconds (`10s`), which should be used cautiously, also see the section on best practices.

Note that the actual scheduling is not exact and might vary within a tolerance level. macOS determines the best time for running the command in order to optimize energy consumption, and scheduling times can also vary when running on battery. To prevent overlapping background launches of the same command, commands are terminated after a timeout that is dynamically adjusted to the interval.

## Running in the background

The entry point of your command stays the same when launched from the background. For no-view commands, a command will run until the Promise of the main async function resolves. Menu bar commands render a React component and run until the `isLoading` property is set to `false`.

You can use the global `environment.launchType` in your command to determine whether the command has been launched by the user (`LaunchType.UserInitiated`) or via background refresh (`LaunchType.Background`).

Raycast auto-terminates the command if it exceeds its maximum execution time. If your command saves some state that is shared with other commands, make sure to use defensive programming, i.e. add handling for errors and data races if the stored state is incomplete or inaccessible.

## Development and Debugging

For local commands under development, errors are shown as usual via the console. Two developer actions in root search help you to run and debug scheduled commands:

* Run in Background: this immediately runs the command with `environment.launchType` set to `LaunchType.Background`.
* Show Error: if the command could not be loaded or an uncaught runtime exception was thrown, the full error can be shown in the Raycast error overlay for development. This action is also shown to users of the installed Store command and provides actions to copy and report the error on the production error overlay.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f56fdf8a10d8451837247c60012963ab7db7c947%2Fbackground-refresh-error.webp?alt=media)

When the background run leads to an error, users will also see a warning icon on the root search command and a tooltip with a hint to show the error via the Action Panel. The tooltip over the subtitle of a command shows the last run time.

You can launch the built-in root search command "Extension Diagnostics" to see which of your commands run in background and when they last ran.

For scheduled commands, Raycast automatically adds command preferences that give users the options to enable and disable background refresh. Preferences also show the last run time of the command.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-475411d88fef4886f8a3f30521b5dedf3f8b4afc%2Fbackground-refresh-preferences.webp?alt=media)

When a user installs the command via the Store, background refresh is initially *disabled* and is activated either when the user opens the command for the first time or enables background refresh in preferences. (This is to avoid automatically running commands in the background without the user being aware of it.)

* Make sure the command is useful both when manually launched by the user or when launched in the background
* Choose the interval value as high as possible - low values mean the command will run more often and consume more energy
* If your command performs network requests, check the rate limits of the service and handle errors appropriately (e.g. automatically retry later)
* Make sure the command finishes as quickly as possible; for menu bar commands, ensure `isLoading` is set to false as early as possible
* Use defensive programming if state is shared between commands of an extension and handle potential data races and inaccessible data

**Examples:**

Example 1 (json):
```json
{
    "name": "unread-notifications",
    "title": "Show Unread Notifications",
    "description": "Shows the number of unread notifications in root search",
    "mode": "no-view",
    "interval": "10m"
},
```

Example 2 (typescript):
```typescript
import { environment, updateCommandMetadata } from "@raycast/api";

async function fetchUnreadNotificationCount() {
  return 10;
}

export default async function Command() {
  console.log("launchType", environment.launchType);
  const count = await fetchUnreadNotificationCount();
  await updateCommandMetadata({ subtitle: `Unread Notifications: ${count}` });
}
```

---

## createDeeplink

**URL:** llms-txt#createdeeplink

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Types
  - DeeplinkType

Function that creates a deeplink for an extension or script command.

There are three ways to use the function.

The first one is for creating a deeplink to a command inside the current extension:

The second one is for creating a deeplink to an extension that is not the current extension:

The third one is for creating a deeplink to a script command:

* `type` is the type of the deeplink. It must be `DeeplinkType.Extension`.
* `command` is the name of the command to deeplink to.
* `launchType` is the type of the launch.
* `arguments` is an object that contains the arguments to pass to the command.
* `fallbackText` is the text to show if the command is not available.
* For intra-extension deeplinks:
  * `ownerOrAuthorName` is the name of the owner or author of the extension.
  * `extensionName` is the name of the extension.

* `type` is the type of the deeplink. It must be `DeeplinkType.ScriptCommand`.
* `command` is the name of the script command to deeplink to.
* `arguments` is an array of strings to be passed as arguments to the script command.

A type to denote whether the deeplink is for a script command or an extension.

**Examples:**

Example 1 (ts):
```ts
function createDeeplink(options: {
  type?: DeeplinkType.Extension,
  command: string,
  launchType?: LaunchType,
  arguments?: LaunchProps["arguments"],
  fallbackText?: string,
}): string;
```

Example 2 (ts):
```ts
function createDeeplink(options: {
  type?: DeeplinkType.Extension,
  ownerOrAuthorName: string,
  extensionName: string,
  command: string,
  launchType?: LaunchType,
  arguments?: LaunchProps["arguments"],
  fallbackText?: string,
}): string;
```

Example 3 (ts):
```ts
function createDeeplink(options: {
  type: DeeplinkType.ScriptCommand,
  command: string,
  arguments?: string[],
}): string;
```

Example 4 (tsx):
```tsx
import { Action, ActionPanel, LaunchProps, List } from "@raycast/api";
import { createDeeplink, DeeplinkType } from "@raycast/utils";

export default function Command(props: LaunchProps<{ launchContext: { message: string } }>) {
  console.log(props.launchContext?.message);

  return (
    <List>
      <List.Item
        title="Extension Deeplink"
        actions={
          <ActionPanel>
            <Action.CreateQuicklink
              title="Create Deeplink"
              quicklink={{
                name: "Extension Deeplink",
                link: createDeeplink({
                  command: "create-deeplink",
                  context: {
                    message: "Hello, world!",
                  },
                }),
              }}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="External Extension Deeplink"
        actions={
          <ActionPanel>
            <Action.CreateQuicklink
              title="Create Deeplink"
              quicklink={{
                name: "Create Triage Issue for Myself",
                link: createDeeplink({
                  ownerOrAuthorName: "linear",
                  extensionName: "linear",
                  command: "create-issue-for-myself",
                  arguments: {
                    title: "Triage new issues",
                  },
                }),
              }}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="Script Command Deeplink"
        actions={
          <ActionPanel>
            <Action.CreateQuicklink
              title="Create Deeplink"
              quicklink={{
                name: "Deeplink with Arguments",
                link: createDeeplink({
                  type: DeeplinkType.ScriptCommand,
                  command: "count-chars",
                  arguments: ["a b+c%20d"],
                }),
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

---

## Introduction

**URL:** llms-txt#introduction

**Contents:**
- Key features
- Overview

Start building your perfect tools with the Raycast API.

Welcome, developers! Our docs cover guides, examples, references, and more to help you build extensions and share them with [our community](https://raycast.com/community) and [your team](https://developers.raycast.com/teams/getting-started).

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8a4f81b2b9ccaf142983dad7a0c7a2ce953467d5%2Fintroduction-hello-world.webp?alt=media)

The Raycast Platform consists of two parts:

* **API:** This allows developers to build rich extensions with React, Node.js, and TypeScript. The docs explain how to use the API to build top-notch experiences.
* **Store:** This lets developers share their extensions with all Raycast users. You'll learn how to [publish your extension](https://developers.raycast.com/basics/publish-an-extension).

Here are a few points that make our ecosystem special:

* **Powerful and familiar tooling:** Extensions are built with TypeScript, React, and Node. Leverage npm's ecosystem to quickly build what you imagine.
* **No-brainer to build UI:** You concentrate on the logic, we push the pixels. Use our built-in UI components to be consistent with all our extensions.
* **Collaborate with our community:** Build your extension, share it with our community, and get inspired by others.
* **Developer experience front and foremost:** A strongly typed API, hot-reloading, and modern tooling that makes it a blast to work with.
* **Easy to start, flexible to scale:** Start with a simple script, add a static UI or use React to go wild. Anything goes.

A quick overview about where to find what in our docs:

* [**Basics:**](https://developers.raycast.com/basics/getting-started) Go over this section to learn how to build extensions in our step-by-step guides.
* [**Teams:**](https://developers.raycast.com/teams/getting-started) Build and share extensions with your teammates to speed up common workflows.
* [**Examples:**](https://developers.raycast.com/examples/doppler) Kickstart your extension by using an open-source example and learn as you go.
* [**Information:**](https://developers.raycast.com/information/best-practices) Get the background knowledge to master your understanding of our platform.
* [**API Reference:**](https://developers.raycast.com/api-reference/ai) Go into details with the API reference that includes code snippets.
* [**Utilities:**](https://developers.raycast.com/utilities/getting-started) A set of utilities to streamline common patterns and operations used in extensions.

---

## useFrecencySorting

**URL:** llms-txt#usefrecencysorting

**Contents:**
- Signature
  - Arguments
  - Return
- Example

Hook to sort an array by its frecency and provide methods to update the frecency of its items.

Frecency is a measure that combines frequency and recency. The more often an item is visited, and the more recently an item is visited, the higher it will rank.

* `data` is the array to sort

* `options.namespace` is a string that can be used to namespace the frecency data (if you have multiple arrays that you want to sort in the same extension).
* `options.key` is a function that should return a unique string for each item of the array to sort. By default, it will use `item.id`. If the items do not have an `id` field, this option is required.
* `options.sortUnvisited` is a function to sort the items that have never been visited. By default, the order of the input will be preserved.

Returns an object with the sorted array and some methods to update the frecency of the items.

* `data` is the sorted array. The order will be preserved for items that have never been visited
* `visitItem` is a method to use when an item is visited/used. It will increase its frecency.
* `resetRanking` is a method that can be used to reset the frecency of an item.

**Examples:**

Example 1 (ts):
```ts
function useFrecencySorting<T>(
  data?: T[],
  options?: {
    namespace?: string;
    key?: (item: T) => string;
    sortUnvisited?: (a: T, b: T) => number;
  },
): {
  data: T[];
  visitItem: (item: T) => Promise<void>;
  resetRanking: (item: T) => Promise<void>;
};
```

Example 2 (tsx):
```tsx
import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { useFetch, useFrecencySorting } from "@raycast/utils";

export default function Command() {
  const { isLoading, data } = useFetch("https://api.example");
  const { data: sortedData, visitItem, resetRanking } = useFrecencySorting(data);

  return (
    <List isLoading={isLoading}>
      {sortedData.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.url} onOpen={() => visitItem(item)} />
              <Action.CopyToClipboard title="Copy Link" content={item.url} onCopy={() => visitItem(item)} />
              <Action title="Reset Ranking" icon={Icon.ArrowCounterClockwise} onAction={() => resetRanking(item)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

---

## Tool

**URL:** llms-txt#tool

**Contents:**
- Types
  - Tool.Confirmation

Tools are a type of entry point for an extension. As opposed to a [command](https://developers.raycast.com/information/terminology#command), they don’t show up in the root search and the user can’t directly interact with them. Instead, they are functionalities that the AI can use to interact with an extension.

### Tool.Confirmation

A tool confirmation is used to ask the user to validate the side-effects of the tool.

{% hint style="info" %}
The tool confirmation is executed *before* the actual tool is executed and receives the same input as the tool. A confirmation returns an optional object that describes what the tool is about to do. It is important to be as clear as possible.

If the user confirms the action, the tool will be executed afterwards. If the user cancels the action, the tool will not be executed.
{% endhint %}

You can return `undefined` to skip the confirmation. This is useful for tools that conditionally perform destructive actions. F.e. when moving a file, you don't need to confirm the action if the file doesn't overwrite another file.

**Examples:**

Example 1 (ts):
```ts
type Confirmation<T> = (input: T) => Promise<
  | undefined
  | {
      /**
       * Defines the visual style of the Confirmation.
       *
       * @remarks
       * Use {@link Action.Style.Regular} to display a regular action.
       * Use {@link Action.Style.Destructive} when your action performs something irreversible like deleting data.
       *
       * @defaultValue {@link Action.Style.Regular}
       */
      style?: Action.Style;
      /**
       * Some name/value pairs that represents the side-effects of the tool.
       *
       * @remarks
       * Use it to provide more context about the tool to the user. For example, list the files that will be deleted.
       *
       * A name/value pair with an optional value won't be displayed if the value is `undefined`.
       */
      info?: {
        name: string;
        value?: string;
      }[];
      /**
       * A string that represents the side-effects of the tool.
       *
       * @remarks
       * Often times this is a question that the user needs to answer. For Example, "Are you sure you want to delete the file?"
       */
      message?: string;
      /**
       * An image that visually represents the side-effects of the tool.
       *
       * @remarks
       * Use an image that is relevant to the side-effects of the tool. For example, a screenshot of the files that will be deleted.
       */
      image?: Image.URL | FileIcon;
    }
>;
```

Example 2 (typescript):
```typescript
import { Tool } from "@raycast/api";

type Input = {
  /**
   * The first name of the user to greet
   */
  name: string;
};

export const confirmation: Tool.Confirmation<Input> = (input) => {
  return {
    message: `Are you sure you want to greet ${input.name}?`,
  };
};
```

---

## Migration

**URL:** llms-txt#migration

**Contents:**
- How to automatically migrate your extensions

This section contains guides to help migrate your extension to a newer version of the API.

## How to automatically migrate your extensions

Whenever possible, we provide tools to automate the migration to a newer version of the API using [codemods](https://github.com/facebook/jscodeshift).

To run the codemods, run the following command in your extension directory:

It will detect the version of the API you were previously using and apply all the migrations that have been available since.

After running it, do go through the updated files and make sure nothing is broken - there are always edge cases.

**Examples:**

Example 1 (bash):
```bash
npx ray migrate
```

Example 2 (bash):
```bash
npx @raycast/migration@latest .
```

---

## v1.28.0

**URL:** llms-txt#v1.28.0

**Contents:**
- Clipboard
- Storage
- Feedback
- Keyboard
- Preferences
- User Interface
  - Color
  - Image
- Misc

This version contains an overhaul of the API surface to improve its discoverability and its usage in a code editor. The aim was to reduce the number of top-level exports to make it easier to find the ones that matter. It also aligns it with the structure of the documentation.

{% hint style="info" %}
The previous API surface is still there, only deprecated. All of your existing extensions will continue to work. You will get helpful hints in your code editor to migrate your extension.
{% endhint %}

The methods related to the [Clipboard](https://developers.raycast.com/api-reference/clipboard) can now be found under the `Clipboard` namespace.

The methods and interfaces related to the [Storage](https://developers.raycast.com/api-reference/storage) can now be found under the `LocalStorage` namespace.

The main changes to the [Feedback](https://developers.raycast.com/api-reference/feedback) methods are related to the Toast:

`showToast` now accepts a `Toast.Options` object as an argument and its style will default to `Toast.Style.Success`.

The interfaces and enumerations of both the Toast and Alert can now be found under their respective namespaces.

The interfaces related to the [Keyboard](https://developers.raycast.com/api-reference/keyboard) can now be found under the `Keyboard` namespace.

We are deprecating the `preferences` constant because we found it to be error-prone. Instead, you should always use `getPreferenceValues()` which allows for a type-safe access with fallback to the defaults.

There are two important changes related to the React components:

* `ActionPanel.Item` has been renamed to `Action`. All the specific actions are now nested under `Action`. This will make it easier to introduce and teach the concept of Action.
* All the props interfaces are now accessible under their respective components

The interfaces related to the [Color](https://developers.raycast.com/api-reference/user-interface/colors) can now be found under the `Color` namespace.

The interfaces and enumerations related to the [Image](https://developers.raycast.com/api-reference/user-interface/icons-and-images) can now be found under the `Image` namespace. `Icon` is still a top-level export.

* We are deprecating the `randomId` utility. It wasn't related to Raycast. Instead, you can use the [`nanoid`](https://github.com/ai/nanoid#readme) dependency.
* We are deprecating the `useId` hook. It was used internally but there shouldn't be a use-case for it in your extensions.
* We are deprecating the `useActionPanel` hook. Use the `ActionPanel` component instead.
* We are deprecating the `render` method. You should `export default` your root component instead.

**Examples:**

Example 1 (js):
```js
import { Clipboard } from "@raycast/api";

// deprecated copyTextToClipboard
await Clipboard.copy("text");

// deprecated clearClipboard
await Clipboard.clear();

// deprecated pasteText
await Clipboard.paste("text");
```

Example 2 (js):
```js
import { LocalStorage } from "@raycast/api";

// deprecated allLocalStorageItems
const items = await LocalStorage.allItems();

// deprecated getLocalStorageItem
const item = await LocalStorage.getItem("key");

// deprecated setLocalStorageItem
await LocalStorage.setItem("key", "value");

// deprecated removeLocalStorageItem
await LocalStorage.removeItem("key");

// deprecated clearLocalStorage
await LocalStorage.clear();

// we didn't expect you to use the Storage interfaces
// but they are now also under LocalStorage

// deprecated LocalStorageValue
LocalStorage.Value;

// deprecated LocalStorageValues
LocalStorage.Values;
```

Example 3 (js):
```js
import { showToast, Toast } from "@raycast/api";

// deprecated new Toast()
const toast = await showToast({ title: "Toast title" }); // Success by default

// deprecated showToast(ToastStyle.Failure, 'Toast title')
await showToast({ title: "Toast title", style: Toast.Style.Failure });
```

Example 4 (js):
```js
import { Alert, Toast } from "@raycast/api";

// deprecated ToastOptions
Toast.Options;

// deprecated ToastActionOptions
Toast.ActionOptions;

// deprecated ToastStyle
Toast.Style;

// deprecated AlertOptions
Alert.Options;

// deprecated AlertActionOptions
Alert.ActionOptions;

// deprecated AlertActionStyle
Alert.ActionStyle;
```

---

## Deeplinks

**URL:** llms-txt#deeplinks

**Contents:**
- Query Parameters

Deeplinks are Raycast-specific URLs you can use to launch any command, as long as it's installed and enabled in Raycast.

They adhere to the following format:

| Name            | Description                                                                                                                                                                                                                                                             | Type     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| author-or-owner | For store extensions, it's the value of the `owner` or the `author` field in the extension's [manifest](https://developers.raycast.com/information/manifest). For built-in extensions (such as `Calendar`), this is always `raycast`.                                   | `string` |
| extension-name  | For store extensions, it's the value of the extension's `name` field in the extension's [manifest](https://developers.raycast.com/information/manifest). For built-in extensions (such as `Calendar`), this is the "slugified" extension name; in this case `calendar`. | `string` |
| command-name    | For store extensions, it's the value of the command's `name` field in the extension's [manifest](https://developers.raycast.com/information/manifest). For built-in commands (such as `My Schedule`), this is the "slugified" command name; in this case `my-schedule`. | `string` |

To make fetching a command's Deeplink easier, each command in the Raycast root now has a `Copy Deeplink` action.

{% hint style="info" %}
Whenever a command is launched using a Deeplink, Raycast will ask you to confirm that you want to run the command. This is to ensure that you are aware of the command you are running.
{% endhint %}

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-612ba5e034fc166e1bc0f57d0035cf242bcf0011%2Fdeeplink-confirmation.webp?alt=media)

| Name         | Description                                                                                                                                                  | Type                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| launchType   | Runs the command in the background, skipping bringing Raycast to the front.                                                                                  | Either `userInitiated` or `background` |
| arguments    | If the command accepts [arguments](https://developers.raycast.com/information/lifecycle/arguments), they can be passed using this query parameter.           | URL-encoded JSON object.               |
| context      | If the command make use of [LaunchContext](https://developers.raycast.com/api-reference/command#launchcontext), it can be passed using this query parameter. | URL-encoded JSON object.               |
| fallbackText | Some text to prefill the search bar or first text input of the command                                                                                       | `string`                               |

**Examples:**

Example 1 (unknown):
```unknown
raycast://extensions/<author-or-owner>/<extension-name>/<command-name>
```

---

## CLI

**URL:** llms-txt#cli

**Contents:**
- Build
- Development
- Lint
- Migrate
- Publish

The Raycast CLI allows you to build, develop, and lint your extension.

The CLI is part of the `@raycast/api` package and is automatically installed in your extension directory during setup. To get a list of the available CLI commands, run the following command inside your extension directory:

`npx ray build` creates an optimized production build of your extension for distribution. This command is used by our CI to publish your extension to the store.

You can use `npx ray build -e dist` to validate that your extension builds properly.

`npx ray develop` starts your extension in development mode. The mode includes the following:

* Extension shows up at the top of the root search for quick access
* Commands get automatically reloaded when you save your changes (you can toggle auto-reloading via Raycast Preferences > Advanced > "Auto-reload on save")
* Error overlays include detailed stack traces for faster debugging
* Log messages are displayed in the terminal
* Status indicator is visible in the navigation title of the command to signal build errors
* Imports the extension to Raycast if it wasn't before

`npx ray lint` runs [ESLint](http://eslint.org) for all files in the `src` directory.

`npx ray migrate` [migrates](https://developers.raycast.com/misc/migration) your extension to the latest version of the `@raycast/api`.

`npx ray publish` verifies, builds, and publishes an extension.

If the extension is private (eg. has an `owner` and no public `access`), it will be published to the organization's private store. This command is only available to users that are part of that organization. Learn more about it [here](https://developers.raycast.com/teams/getting-started).

**Examples:**

Example 1 (bash):
```bash
npx ray help
```

---

## Install an Extension

**URL:** llms-txt#install-an-extension

**Contents:**
- In-app Store
- Web Store
- Use installed extensions

Learn how to find and use extensions from the Raycast Store.

All published extensions are discoverable in the Raycast Store. Use the [web interface](https://raycast.com/store) or the Store command to find what you're looking for.

The easiest way to discover extensions is the in-app store. Open the Store command in Raycast and search for an extension. Press `⌘` `↵` to install the selected extension or press `↵` to see more details about it.

![Store in Raycast](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-61b0b1e3be8f41d44c9b3b7464a431b43824bd03%2Fbasics-inapp-store.webp?alt=media)

Alternatively, you can use our [web store](https://raycast.com/store). Press `⌘` `K` to open the command palette, search for an extension and open it.

![Web Store](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4734fd8f31c97bb29fffbe7be8b532ad55214512%2Fbasics-web-store.webp?alt=media)

Then press the Install Extension button in the top right corner and follow the steps in Raycast.

![Install extension from the Web Store](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0a6cb5bb4070227ee51ef3e30ab727e23e22f0e3%2Fbasics-install-extension.webp?alt=media)

## Use installed extensions

After an extension is installed, you can search for its commands in the root search. The extension can be further configured in the Extensions preferences tab.

---

## Doppler Share Secrets

**URL:** llms-txt#doppler-share-secrets

**Contents:**
- Add form items
- Submit form values
- Wire it up

This example uses a simple form to collect data.

{% hint style="info" %}
The full source code of the example can be found [here](https://github.com/raycast/extensions/tree/main/extensions/doppler-share-secrets#readme). You can install the extension [here](https://www.raycast.com/thomas/doppler-share-secrets).
{% endhint %}

In this example we use a form to collect inputs from a user. To make it interesting, we use [Doppler](http://share.doppler.com) which is a service to make it easy to securely share sensitive information such as API keys or passwords.

![Example: Safely share secrets with Doppler](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b36017e7ee6ad8162b27712895ac0ac036103b4d%2Fexample-doppler-share-secrets.webp?alt=media)

The extension has multiple commands. In this example we're using a simple form with a textfield for the secret, a dropdown for an expiration after views and a second dropdown for an alternate expiration after a maximum of days.

First, we render the static form. For this we add all the mentioned form items:

Both dropdowns set the `storeValue` to true. This restores the last selected value when the command is opened again. This option is handy when your users select the same options often. In this case, we assume that users want to keep the expiration settings persisted.

## Submit form values

Now that we have the form, we want to collect the inserted values, send them to Doppler and copy the URL that allows us to share the information securely. For this, we create a new action:

Let's break this down:

* The `<ShareSecretAction>` returns an [`<Action.SubmitForm>`](https://developers.raycast.com/api-reference/user-interface/actions#action.submitform).
* The `handleSubmit()` gets called when the form is submitted with its values.
  * First we check if the user entered a secret. If not, we show a toast.
  * Then we show a toast to hint that there is a network call in progress to share the secret.
  * We call [Doppler's API](https://docs.doppler.com/reference/share-secret) with the form values
    * If the network response succeeds, we copy the authenticated URL to the clipboard and show a success toast.
    * If the network response fails, we show a failure toast with additional information about the failure.

The last step is to add the `<ShareSecretAction>` to the form:

And there you go. A simple form to enter a secret and get a URL that you can share with others that will "destroy itself" accordingly to your preferences. As next steps, you could use the `<PasteAction>` to paste the link directly to front-most application or add another action that clears the form and let's you create another shareable link.

**Examples:**

Example 1 (typescript):
```typescript
import { Action, ActionPanel, Clipboard, Form, Icon, showToast, Toast } from "@raycast/api";
import got from "got";

export default function Command() {
  return (
    <Form>
      <Form.TextArea id="secret" title="Secret" placeholder="Enter sensitive data to securely share…" />
      <Form.Dropdown id="expireViews" title="Expire After Views" storeValue>
        <Form.Dropdown.Item value="1" title="1 View" />
        <Form.Dropdown.Item value="2" title="2 Views" />
        <Form.Dropdown.Item value="3" title="3 Views" />
        <Form.Dropdown.Item value="5" title="5 Views" />
        <Form.Dropdown.Item value="10" title="10 Views" />
        <Form.Dropdown.Item value="20" title="20 Views" />
        <Form.Dropdown.Item value="50" title="50 Views" />
        <Form.Dropdown.Item value="-1" title="Unlimited Views" />
      </Form.Dropdown>
      <Form.Dropdown id="expireDays" title="Expire After Days" storeValue>
        <Form.Dropdown.Item value="1" title="1 Day" />
        <Form.Dropdown.Item value="2" title="2 Days" />
        <Form.Dropdown.Item value="3" title="3 Days" />
        <Form.Dropdown.Item value="7" title="1 Week" />
        <Form.Dropdown.Item value="14" title="2 Weeks" />
        <Form.Dropdown.Item value="30" title="1 Month" />
        <Form.Dropdown.Item value="90" title="3 Months" />
      </Form.Dropdown>
    </Form>
  );
}
```

Example 2 (tsx):
```tsx
function ShareSecretAction() {
  async function handleSubmit(values: { secret: string; expireViews: number; expireDays: number }) {
    if (!values.secret) {
      showToast({
        style: Toast.Style.Failure,
        title: "Secret is required",
      });
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Sharing secret",
    });

    try {
      const { body } = await got.post("https://api.doppler.com/v1/share/secrets/plain", {
        json: {
          secret: values.secret,
          expire_views: values.expireViews,
          expire_days: values.expireDays,
        },
        responseType: "json",
      });

      await Clipboard.copy((body as any).authenticated_url);

      toast.style = Toast.Style.Success;
      toast.title = "Shared secret";
      toast.message = "Copied link to clipboard";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed sharing secret";
      toast.message = String(error);
    }
  }

  return <Action.SubmitForm icon={Icon.Upload} title="Share Secret" onSubmit={handleSubmit} />;
}
```

Example 3 (typescript):
```typescript
import { Action, ActionPanel, Clipboard, Form, Icon, showToast, Toast } from "@raycast/api";
import got from "got";

export default function Command() {
  return (
    <Form
      actions={
        <ActionPanel>
          <ShareSecretAction />
        </ActionPanel>
      }
    >
      <Form.TextArea id="secret" title="Secret" placeholder="Enter sensitive data to securely share…" />
      <Form.Dropdown id="expireViews" title="Expire After Views" storeValue>
        <Form.Dropdown.Item value="1" title="1 View" />
        <Form.Dropdown.Item value="2" title="2 Views" />
        <Form.Dropdown.Item value="3" title="3 Views" />
        <Form.Dropdown.Item value="5" title="5 Views" />
        <Form.Dropdown.Item value="10" title="10 Views" />
        <Form.Dropdown.Item value="20" title="20 Views" />
        <Form.Dropdown.Item value="50" title="50 Views" />
        <Form.Dropdown.Item value="-1" title="Unlimited Views" />
      </Form.Dropdown>
      <Form.Dropdown id="expireDays" title="Expire After Days" storeValue>
        <Form.Dropdown.Item value="1" title="1 Day" />
        <Form.Dropdown.Item value="2" title="2 Days" />
        <Form.Dropdown.Item value="3" title="3 Days" />
        <Form.Dropdown.Item value="7" title="1 Week" />
        <Form.Dropdown.Item value="14" title="2 Weeks" />
        <Form.Dropdown.Item value="30" title="1 Month" />
        <Form.Dropdown.Item value="90" title="3 Months" />
      </Form.Dropdown>
    </Form>
  );
}

function ShareSecretAction() {
  async function handleSubmit(values: { secret: string; expireViews: number; expireDays: number }) {
    if (!values.secret) {
      showToast({
        style: Toast.Style.Failure,
        title: "Secret is required",
      });
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Sharing secret",
    });

    try {
      const { body } = await got.post("https://api.doppler.com/v1/share/secrets/plain", {
        json: {
          secret: values.secret,
          expire_views: values.expireViews,
          expire_days: values.expireDays,
        },
        responseType: "json",
      });

      await Clipboard.copy((body as any).authenticated_url);

      toast.style = Toast.Style.Success;
      toast.title = "Shared secret";
      toast.message = "Copied link to clipboard";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed sharing secret";
      toast.message = String(error);
    }
  }

  return <Action.SubmitForm icon={Icon.Upload} title="Share Secret" onSubmit={handleSubmit} />;
}
```

---

## getFavicon

**URL:** llms-txt#getfavicon

**Contents:**
- Signature
- Example

Icon showing the favicon of a website.

A favicon (favorite icon) is a tiny icon included along with a website, which is displayed in places like the browser's address bar, page tabs, and bookmarks menu.

![Favicon example](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8383499b76a723de43e610079031cd2543c52a66%2Futils-favicon.png?alt=media)

* `name` is a string of the subject's name.
* `options.fallback` is a [Image.Fallback](https://developers.raycast.com/api-reference/user-interface/icons-and-images#image.fallback) icon in case the Favicon is not found. By default, the fallback will be `Icon.Link`.
* `options.size` is the size of the returned favicon. By default, it is 64 pixels.
* `options.mask` is the size of the [Image.Mask](https://developers.raycast.com/api-reference/user-interface/icons-and-images#image.mask) to apply to the favicon.

Returns an [Image.ImageLike](https://developers.raycast.com/api-reference/user-interface/icons-and-images) that can be used where Raycast expects them.

**Examples:**

Example 1 (ts):
```ts
function getFavicon(
  url: string | URL,
  options?: {
    fallback?: Image.Fallback;
    size?: boolean;
    mask?: Image.Mask;
  },
): Image.ImageLike;
```

Example 2 (tsx):
```tsx
import { List } from "@raycast/api";
import { getFavicon } from "@raycast/utils";

export default function Command() {
  return (
    <List>
      <List.Item icon={getFavicon("https://raycast.com")} title="Raycast Website" />
    </List>
  );
}
```

---

## runAppleScript

**URL:** llms-txt#runapplescript

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Types
  - ParseExecOutputHandler

Function that executes an AppleScript script.

{% hint style="info" %}
Only available on macOS
{% endhint %}

There are two ways to use the function.

The first one should be preferred when executing a static script.

The second one can be used to pass arguments to a script.

* `script` is the script to execute.
* `arguments` is an array of strings to pass as arguments to the script.

* `options.humanReadableOutput` is a boolean to tell the script what form to output. By default, `runAppleScript` returns its results in human-readable form: strings do not have quotes around them, characters are not escaped, braces for lists and records are omitted, etc. This is generally more useful, but can introduce ambiguities. For example, the lists `{"foo", "bar"}` and `{{"foo", {"bar"}}}` would both be displayed as ‘foo, bar’. To see the results in an unambiguous form that could be recompiled into the same value, set `humanReadableOutput` to `false`.
* `options.language` is a string to specify whether the script is using [`AppleScript`](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/introduction/ASLR_intro.html#//apple_ref/doc/uid/TP40000983) or [`JavaScript`](https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/Introduction.html#//apple_ref/doc/uid/TP40014508-CH111-SW1). By default, it will assume that it's using `AppleScript`.
* `options.signal` is a Signal object that allows you to abort the request if required via an AbortController object.
* `options.timeout` is a number. If greater than `0`, the parent will send the signal `SIGTERM` if the script runs longer than timeout milliseconds. By default, the execution will timeout after 10000ms (eg. 10s).
* `options.parseOutput` is a function that accepts the output of the script as an argument and returns the data the hooks will return - see [ParseExecOutputHandler](#parseexecoutputhandler). By default, the function will return `stdout` as a string.

Returns a Promise which resolves to a string by default. You can control what it returns by passing `options.parseOutput`.

### ParseExecOutputHandler

A function that accepts the output of the script as an argument and returns the data the function will return.

**Examples:**

Example 1 (ts):
```ts
function runAppleScript<T>(
  script: string,
  options?: {
    humanReadableOutput?: boolean;
    language?: "AppleScript" | "JavaScript";
    signal?: AbortSignal;
    timeout?: number;
    parseOutput?: ParseExecOutputHandler<T>;
  },
): Promise<T>;
```

Example 2 (ts):
```ts
function runAppleScript<T>(
  script: string,
  arguments: string[],
  options?: {
    humanReadableOutput?: boolean;
    language?: "AppleScript" | "JavaScript";
    signal?: AbortSignal;
    timeout?: number;
    parseOutput?: ParseExecOutputHandler<T>;
  },
): Promise<T>;
```

Example 3 (tsx):
```tsx
import { showHUD } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";

export default async function () {
  const res = await runAppleScript(
    `
on run argv
  return "hello, " & item 1 of argv & "."
end run
`,
    ["world"],
  );
  await showHUD(res);
}
```

Example 4 (ts):
```ts
export type ParseExecOutputHandler<T> = (args: {
  /** The output of the script on stdout. */
  stdout: string;
  /** The output of the script on stderr. */
  stderr: string;
  error?: Error | undefined;
  /** The numeric exit code of the process that was run. */
  exitCode: number | null;
  /** The name of the signal that was used to terminate the process. For example, SIGFPE. */
  signal: NodeJS.Signals | null;
  /** Whether the process timed out. */
  timedOut: boolean;
  /** The command that was run, for logging purposes. */
  command: string;
  /** The options passed to the script, for logging purposes. */
  options?: ExecOptions | undefined;
}) => T;
```

---

## Contribute to an Extension

**URL:** llms-txt#contribute-to-an-extension

**Contents:**
- Get source code
- Develop the extension

Learn how to import an extension to collaborate with others.

All published extensions are open-source and can be found in [this repository](https://github.com/raycast/extensions). This makes it easy for multiple developers to collaborate. This guide explains how to import an extension in order to fix a bug, add a new feature or otherwise contribute to it.

First, you need to find the source code of the extension. The easiest way to do this is to use the `Fork Extension` action in the Raycast's root search.

![Fork an extension](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d8248b215be20ea329b284134cce26609fb91dde%2Ffork-extension.webp?alt=media)

## Develop the extension

After you have the source code locally, open the Terminal and navigate to the extension's folder. Once there, run `npm install && npm run dev` from the extension folder in your Terminal to start developing the extension.

![Open imported extension](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d93798084581d66e02d4e51c48bb8c6edd66709d%2Fbasics-open-command.webp?alt=media) ![Icon list command](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-64a3aa26124f0f72eab167839b9858c06e41e84b%2Fbasics-icon-list.webp?alt=media)

You should see your forked extension at the top of your root search and can open its commands.

When you're done editing the extension, make sure to add yourself to the contributors section of its [manifest](https://developers.raycast.com/information/manifest#extension-properties). If you used the `Fork Extension` action, this should have happened automatically.

Additionally, ensure the `CHANGELOG.md` file is updated with your changes; create it if it doesn't exist. Use the `{PR_MERGE_DATE}` placeholder for the date – see the [Version History documentation](https://developers.raycast.com/prepare-an-extension-for-store#version-history) for details.

Once everything is ready, see [how to publish an extension](https://developers.raycast.com/basics/publish-an-extension) for instructions on validating and publishing the changes.

---

## Arguments

**URL:** llms-txt#arguments

**Contents:**
- Example
- Types
  - Arguments

Raycast supports arguments for your commands so that users can enter values right from Root Search before opening the command.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5820d335065ed715429f3d7c0ab5edff00c9182a%2Farguments.webp?alt=media)

Arguments are configured in the [manifest](https://developers.raycast.com/manifest#argument-properties) per command.

{% hint style="info" %}

* **Maximum number of arguments:** 3 (if you have a use case that requires more, please let us know via feedback or in the [Slack community](https://www.raycast.com/community))
* The order of the arguments specified in the manifest is important and is reflected by the fields shown in Root Search. To provide a better UX, put the required arguments before the optional ones.
  {% endhint %}

Let's say we want a command with three arguments. Its `package.json` will look like this:

The command itself will receive the arguments' values via the `arguments` prop:

A command receives the values of its arguments via a top-level prop named `arguments`. It is an object with the arguments' `name` as keys and their values as the property's values.

Depending on the `type` of the argument, the type of its value will be different.

| Argument type | Value type |
| ------------- | ---------- |
| `text`        | `string`   |
| `password`    | `string`   |
| `dropdown`    | `string`   |

{% hint style="info" %}
Raycast provides a global TypeScript namespace called `Arguments` which contains the types of the arguments of all the commands of the extension.

For example, if a command named `show-todos` accepts arguments, its `LaunchProps` can be described as `LaunchProps<{ arguments: Arguments.ShowTodos }>`. This will make sure that the types used in the command stay in sync with the manifest.
{% endhint %}

**Examples:**

Example 1 (json):
```json
{
  "name": "arguments",
  "title": "API Arguments",
  "description": "Example of Arguments usage in the API",
  "icon": "command-icon.png",
  "author": "raycast",
  "license": "MIT",
  "commands": [
    {
      "name": "my-command",
      "title": "Arguments",
      "subtitle": "API Examples",
      "description": "Demonstrates usage of arguments",
      "mode": "view",
      "arguments": [
        {
          "name": "title",
          "placeholder": "Title",
          "type": "text",
          "required": true
        },
        {
          "name": "subtitle",
          "placeholder": "Secret Subtitle",
          "type": "password"
        },
        {
          "name": "favoriteColor",
          "type": "dropdown",
          "placeholder": "Favorite Color",
          "required": true,
          "data": [
            {
              "title": "Red",
              "value": "red"
            },
            {
              "title": "Green",
              "value": "green"
            },
            {
              "title": "Blue",
              "value": "blue"
            }
          ]
        }
      ]
    }
  ],
  "dependencies": {
    "@raycast/api": "1.38.0"
  },
  "scripts": {
    "dev": "ray develop",
    "build": "ray build -e dist",
    "lint": "ray lint"
  }
}
```

Example 2 (typescript):
```typescript
import { Form, LaunchProps } from "@raycast/api";

export default function Todoist(props: LaunchProps<{ arguments: Arguments.MyCommand }>) {
  const { title, subtitle } = props.arguments;
  console.log(`title: ${title}, subtitle: ${subtitle}`);

  return (
    <Form>
      <Form.TextField id="title" title="Title" defaultValue={title} />
      <Form.TextField id="subtitle" title="Subtitle" defaultValue={subtitle} />
    </Form>
  );
}
```

---

## v1.31.0

**URL:** llms-txt#v1.31.0

**Contents:**
- `List.Item` with `accessoryTitle`
- `List.Item` with `accessoryIcon`
- `List.Item` with `accessoryTitle` and `accessoryIcon`

This version introduces support for multiple `<List.Item>` accessories via a new [`accessories` prop](https://developers.raycast.com/api-reference/user-interface/list#list.item.accessory).

{% hint style="info" %}
The `accessoryTitle` and `accessoryIcon` props still work, but are now marked as deprecated and may be removed in a future version. You will get helpful hints in your code editor to migrate your extension, and as usual we provide automated [migrations](https://developers.raycast.com/misc/migration) to help with the transition.
{% endhint %}

To migrate your extension manually, you need to ensure that all `List.Items` that specify `accessoryTitle` and/or `accessoryIcon` are updated as follows:

## `List.Item` with `accessoryTitle`

## `List.Item` with `accessoryIcon`

## `List.Item` with `accessoryTitle` and `accessoryIcon`

[Next Page](/llms-full.txt/1)

**Examples:**

Example 1 (typescript):
```typescript
<List.Item title="List item with accessory title" accessoryTitle="foo" />
// becomes
<List.Item title="List item with accessory title" accessories={[{ text: 'foo' }]}
```

Example 2 (typescript):
```typescript
<List.Item title="List item with accessory icon" accessoryIcon={getAccessoryIcon()} />
// becomes
<List.Item title="List item with accessory icon" accessories={[{ icon: getAccessoryIcon() }]}
```

Example 3 (typescript):
```typescript
<List.Item title="List item with accessory title and accessory icon" accessoryTitle="foo" accessoryIcon={getAccessoryIcon()} />
// becomes
<List.Item title="List item with accessory title and accessory icon" accessories={[{ text: "foo", icon: getAccessoryIcon() }]}
```

---

## runPowerShellScript

**URL:** llms-txt#runpowershellscript

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Types
  - ParseExecOutputHandler

Function that executes an PowerShell script.

{% hint style="info" %}
Only available on Windows
{% endhint %}

* `script` is the script to execute.

* `options.signal` is a Signal object that allows you to abort the request if required via an AbortController object.
* `options.timeout` is a number. If greater than `0`, the parent will send the signal `SIGTERM` if the script runs longer than timeout milliseconds. By default, the execution will timeout after 10000ms (eg. 10s).
* `options.parseOutput` is a function that accepts the output of the script as an argument and returns the data the hooks will return - see [ParseExecOutputHandler](#parseexecoutputhandler). By default, the function will return `stdout` as a string.

Returns a Promise which resolves to a string by default. You can control what it returns by passing `options.parseOutput`.

### ParseExecOutputHandler

A function that accepts the output of the script as an argument and returns the data the function will return.

**Examples:**

Example 1 (ts):
```ts
function runPowerShellScript<T>(
  script: string,
  options?: {
    signal?: AbortSignal;
    timeout?: number;
    parseOutput?: ParseExecOutputHandler<T>;
  },
): Promise<T>;
```

Example 2 (tsx):
```tsx
import { showHUD } from "@raycast/api";
import { runPowerShellScript } from "@raycast/utils";

export default async function () {
  const res = await runPowerShellScript(
    `
Write-Host "hello, world."
`,
  );
  await showHUD(res);
}
```

Example 3 (ts):
```ts
export type ParseExecOutputHandler<T> = (args: {
  /** The output of the script on stdout. */
  stdout: string;
  /** The output of the script on stderr. */
  stderr: string;
  error?: Error | undefined;
  /** The numeric exit code of the process that was run. */
  exitCode: number | null;
  /** The name of the signal that was used to terminate the process. For example, SIGFPE. */
  signal: NodeJS.Signals | null;
  /** Whether the process timed out. */
  timedOut: boolean;
  /** The command that was run, for logging purposes. */
  command: string;
  /** The options passed to the script, for logging purposes. */
  options?: ExecOptions | undefined;
}) => T;
```

---

## Developer Tools

**URL:** llms-txt#developer-tools

Raycast provides several tools to smoothen your experience when building extensions:

* [Manage Extensions Command](https://developers.raycast.com/information/developer-tools/manage-extensions-command) *- A Raycast command to manage your extensions, add new command, etc.*
* [CLI](https://developers.raycast.com/information/developer-tools/cli) *- A CLI to build, develop, and lint your extension*
* [ESLint](https://developers.raycast.com/information/developer-tools/eslint) *- An ESLint configuration helping you follow best practices as you build your extension*
* [Forked Extensions (community tool)](https://developers.raycast.com/information/developer-tools/forked-extensions) - *The extension for helping you manage your forked Raycast extensions*
* [VS Code (community tool)](https://developers.raycast.com/information/developer-tools/vscode) *- A VS Code extension to enhance your development experience*

---

## getProgressIcon

**URL:** llms-txt#getprogressicon

**Contents:**
- Signature
- Example

Icon to represent the progress of a task, a project, *something*.

![Progress Icon example](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8d31dd8b07fabd4eba1a4ab2d4f256bc50f0fb9c%2Futils-progress-icon.png?alt=media)

* `progress` is a number between 0 and 1 (0 meaning not started, 1 meaning finished).
* `color` is a Raycast `Color` or a hexadecimal representation of a color. By default it will be `Color.Red`.
* `options.background` is a Raycast `Color` or a hexadecimal representation of a color for the background of the progress icon. By default, it will be `white` if the Raycast's appearance is `dark`, and `black` if the appearance is `light`.
* `options.backgroundOpacity` is the opacity of the background of the progress icon. By default, it will be `0.1`.

Returns an [Image.Asset](https://developers.raycast.com/api-reference/user-interface/icons-and-images) that can be used where Raycast expects them.

**Examples:**

Example 1 (ts):
```ts
function getProgressIcon(
  progress: number,
  color?: Color | string,
  options?: {
    background?: Color | string;
    backgroundOpacity?: number;
  },
): Image.Asset;
```

Example 2 (tsx):
```tsx
import { List } from "@raycast/api";
import { getProgressIcon } from "@raycast/utils";

export default function Command() {
  return (
    <List>
      <List.Item icon={getProgressIcon(0.1)} title="Project" />
    </List>
  );
}
```

---

## Spotify Controls

**URL:** llms-txt#spotify-controls

**Contents:**
- Control Spotify macOS app
- Close Raycast main window

This example shows how to bundle multiple scripts into a single extension.

{% hint style="info" %}
The source code of the example can be found [here](https://github.com/raycast/extensions/tree/main/extensions/spotify-controls#readme). You can install it [here](https://www.raycast.com/thomas/spotify-controls).
{% endhint %}

This example shows how to build commands that don't show a UI in Raycast. This type of command is useful for interactions with other apps such as skipping songs in Spotify or just simply running some scripts that don't need visual confirmation.

![Example: Control the Spotify macOS app from Raycast](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8a6b74f0afa581918036d18742c8c0e3baa4a37e%2Fexample-spotify-controls.webp?alt=media)

## Control Spotify macOS app

Spotify's macOS app supports AppleScript. This is great to control the app without opening it. For this, we use the [`run-applescript`](https://www.npmjs.com/package/run-applescript) package. Let's start by toggling play pause:

## Close Raycast main window

When performing this command, you'll notice that Raycast toggles the play pause state of the Spotify macOS app but the Raycast main window stays open. Ideally the window closes after you run the command. Then you can carry on with what you did before.

Here is how you can close the main window:

Notice that we call the `closeMainWindow` function before running the AppleScript. This makes the command feel snappier.

With less than 10 lines of code, you executed a script and controlled the UI of Raycast. As a next step you could add more commands to skip a track.

**Examples:**

Example 1 (typescript):
```typescript
import { runAppleScript } from "run-applescript";

export default async function Command() {
  await runAppleScript('tell application "Spotify" to playpause');
}
```

Example 2 (typescript):
```typescript
import { closeMainWindow } from "@raycast/api";
import { runAppleScript } from "run-applescript";

export default async function Command() {
  await closeMainWindow();
  await runAppleScript('tell application "Spotify" to playpause');
}
```

---

## Hacker News

**URL:** llms-txt#hacker-news

**Contents:**
- Load top stories
- Render stories
- Add actions
- Handle errors
- Wrapping up

This example shows how to show an RSS feed as a List.

{% hint style="info" %}
The source code of the example can be found [here](https://github.com/raycast/extensions/tree/main/extensions/hacker-news#readme). You can install it [here](https://www.raycast.com/thomas/hacker-news).
{% endhint %}

Who doesn't like a good morning read on [Hacker News](https://news.ycombinator.com) with a warm coffee?! In this example, we create a simple list with the top stories on the frontpage.

![Example: Read frontpage of Hacker News](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-50ab2659c3f7430f15f90eb4dd6b7a6d6f0dd005%2Fexample-hacker-news.webp?alt=media)

First, let's get the latest top stories. For this we use a [RSS feed](https://hnrss.org):

* We use a third-party dependency to parse the RSS feed and initially the parser.
* We define our command state as a TypeScript interface.
* We use [React's `useEffect`](https://reactjs.org/docs/hooks-effect.html) hook to parse the RSS feed after the command did mount.
* We print the top stories to the console.
* We render a list and show the loading indicator as long as we load the stories.

Now that we got the data from Hacker News, we want to render the stories. For this, we create a new React component and a few helper functions that render a story:

To give the list item a nice look, we use a simple number emoji as icon, add the creator's name as subtitle and the points and comments as accessory title. Now we can render the `<StoryListItem>`:

When we select a story in the list, we want to be able to open it in the browser and also copy it's link so that we can share it in our watercooler Slack channel. For this, we create a new React Component:

The component takes a story and renders an [`<ActionPanel>`](https://developers.raycast.com/api-reference/user-interface/action-panel) with our required actions. We add the actions to the `<StoryListItem>`:

Lastly, we want to be a good citizen and handle errors appropriately to guarantee a smooth experience. We'll show a toast whenever our network request fails:

That's it, you have a working extension to read the frontpage of Hacker News. As next steps, you can add another command to show the jobs feed or add an action to copy a Markdown formatted link.

**Examples:**

Example 1 (typescript):
```typescript
import { Action, ActionPanel, List, showToast, Toast, Keyboard } from "@raycast/api";
import { useEffect, useState } from "react";
import Parser from "rss-parser";

const parser = new Parser();

interface State {
  items?: Parser.Item[];
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchStories() {
      try {
        const feed = await parser.parseURL("https://hnrss.org/frontpage?description=0&count=25");
        setState({ items: feed.items });
      } catch (error) {
        setState({
          error: error instanceof Error ? error : new Error("Something went wrong"),
        });
      }
    }

    fetchStories();
  }, []);

  console.log(state.items); // Prints stories

  return <List isLoading={!state.items && !state.error} />;
}
```

Example 2 (typescript):
```typescript
function StoryListItem(props: { item: Parser.Item; index: number }) {
  const icon = getIcon(props.index + 1);
  const points = getPoints(props.item);
  const comments = getComments(props.item);

  return (
    <List.Item
      icon={icon}
      title={props.item.title ?? "No title"}
      subtitle={props.item.creator}
      accessories={[{ text: `👍 ${points}` }, { text: `💬  ${comments}` }]}
    />
  );
}

const iconToEmojiMap = new Map<number, string>([
  [1, "1️⃣"],
  [2, "2️⃣"],
  [3, "3️⃣"],
  [4, "4️⃣"],
  [5, "5️⃣"],
  [6, "6️⃣"],
  [7, "7️⃣"],
  [8, "8️⃣"],
  [9, "9️⃣"],
  [10, "🔟"],
]);

function getIcon(index: number) {
  return iconToEmojiMap.get(index) ?? "⏺";
}

function getPoints(item: Parser.Item) {
  const matches = item.contentSnippet?.match(/(?<=Points:\s*)(\d+)/g);
  return matches?.[0];
}

function getComments(item: Parser.Item) {
  const matches = item.contentSnippet?.match(/(?<=Comments:\s*)(\d+)/g);
  return matches?.[0];
}
```

Example 3 (typescript):
```typescript
export default function Command() {
  const [state, setState] = useState<State>({});

  // ...

  return (
    <List isLoading={!state.items && !state.error}>
      {state.items?.map((item, index) => (
        <StoryListItem key={item.guid} item={item} index={index} />
      ))}
    </List>
  );
}
```

Example 4 (typescript):
```typescript
function Actions(props: { item: Parser.Item }) {
  return (
    <ActionPanel title={props.item.title}>
      <ActionPanel.Section>
        {props.item.link && <Action.OpenInBrowser url={props.item.link} />}
        {props.item.guid && <Action.OpenInBrowser url={props.item.guid} title="Open Comments in Browser" />}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.link && (
          <Action.CopyToClipboard
            content={props.item.link}
            title="Copy Link"
            shortcut={Keyboard.Shortcut.Common.Copy}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
```

---

## Debug an Extension

**URL:** llms-txt#debug-an-extension

**Contents:**
- Console
- Visual Studio Code
- Unhandled exceptions and Promise rejections
  - Extension Issue Dashboard
- React Developer Tools
  - Alternative: Global installation of React Developer Tools
- Environments

This guide covers how to find and fix bugs in your extension.

Bugs are unavoidable. Therefore it's important to have an easy way to discover and fix them. This guide shows you how to find problems in your extensions.

Use the `console` for simple debugging such as logging variables, function calls, or other helpful messages. All logs are shown in the terminal during [development mode](https://developers.raycast.com/information/developer-tools/cli#development). Here are a few examples:

For more, checkout the [Node.js documentation](https://nodejs.org/docs/latest-v22.x/api/console.html).

We automatically disable console logging for store extensions.

## Visual Studio Code

For more complex debugging you can install the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=tonka3000.raycast) to be able to attach a node.js debugger to the running Raycast session.

1. Activate your extension in dev mode via `npm run dev` or via the VSCode command `Raycast: Start Development Mode`
2. Start the VSCode command `Raycast: Attach Debugger`
3. Set your breakpoint like in any other node.js base project
4. Activate your command

## Unhandled exceptions and Promise rejections

All unhandled exceptions and Promise rejections are shown with an error overlay in Raycast.

![Unhandled exception in development mode](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b5a9bcaeefa6d23c38427b21408ffd98953722ef%2Fbasics-unhandled-exception.webp?alt=media)

During development, we show the stack trace and add an action to jump to the error to make it easy to fix it. In production, only the error message is shown. You should [show a toast](https://developers.raycast.com/api-reference/feedback/toast#showtoast) for all expected errors, e.g. a failing network request.

### Extension Issue Dashboard

When unhandled exceptions and Promise rejections occur in the production build of a public extension, Raycast tries to redact all potentially sensitive information they may include, and reports them to our error backend. As an extension author, or as the manager of an organisation, you can view and manage error reports for your public extensions by going to <https://www.raycast.com/extension-issues>, or by finding your extension in Raycast's root, `Store` command, or `Manage Extensions` command, and using the `View Issues` action. The dashboard should give you an overview of what issues occurred, how many times, how many users were affected, and more. Each issue additionally has a detail view, including a stack trace, breadcrumbs (typically the actions performed before the crash), extension release date, Raycast version, macOS version.

![Extension Issues](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e3c7a6de170fa071b3e0caf1ac8f93d283255a91%2Fextension-issues.webp?alt=media)

## React Developer Tools

We support [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) out-of-the-box. Use the tools to inspect and change the props of your React components, and see the results immediately in Raycast. This is especially useful for complex commands with a lot of states.

![React Developer Tools](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1f048664863696612821b23b146e8b134818b54d%2Fbasics-react-developer-tools.webp?alt=media)

To get started, add the `react-devtools` to your extension. Open a terminal, navigate to your extension directory and run the following command:

Then re-build your extension with `npm run dev`, open the command you want to debug in Raycast, and launch the React Developer Tools with `⌘` `⌥` `D`. Now select one of the React components, change a prop in the right sidebar, and hit enter. You'll notice the change immediately in Raycast.

### Alternative: Global installation of React Developer Tools

If you prefer to install the `react-devtools` globally, you can do the following:

Then you can run `react-devtools` from a terminal to launch the standalone DevTools app. Raycast connects automatically, and you can start debugging your component tree.

By default, extensions installed from the store run in Node production mode and development extensions in development mode. In development mode, the CLI output shows you additional errors and warnings (e.g. the infamous warning when you're missing the React `key` property for your list items); performance is generally better when running in production mode. You can force development extensions to run in Node production mode by going to Raycast Preferences > Advanced > "Use Node production environment".

At runtime, you can check which Node environment you're running in:

To check whether you're running the store or local development version:

**Examples:**

Example 1 (typescript):
```typescript
console.log("Hello World"); // Prints: Hello World

const name = "Thomas";
console.debug(`Hello ${name}`); // Prints: Hello Thomas

const error = new Error("Boom 💥");
console.error(error); // Prints: Boom 💥
```

Example 2 (typescript):
```typescript
npm install --save-dev react-devtools@6.1.1
```

Example 3 (bash):
```bash
npm install -g react-devtools@6.1.1
```

Example 4 (typescript):
```typescript
if (process.env.NODE_ENV === "development") {
  // running in development Node environment
}
```

---
