# Raycast - Best Practices

**Pages:** 2

---

## Lifecycle

**URL:** llms-txt#lifecycle

**Contents:**
- Launch
  - LaunchProps
- Unloading

A command is typically launched, runs for a while, and then is unloaded.

When a command is launched in Raycast, the command code is executed right away. If the extension exports a default function, this function will automatically be called. If you return a React component in the exported default function, it will automatically be rendered as the root component. For commands that don't need a user interface (`mode` property set to "`no-view"` in the manifest), you can export an async function and perform API methods using async/await.

{% tabs %}
{% tab title="View Command" %}

{% tab title="No-View Command" %}

{% endtab %}
{% endtabs %}

There are different ways to launch a command:

* The user searches for the command in the root search and executes it.
* The user registers an alias for the command and presses it.
* Another command launches the command *via* [`launchCommand`](https://developers.raycast.com/api-reference/command#launchcommand).
* The command was launched in the [background](https://developers.raycast.com/information/lifecycle/background-refresh).
* A [Form's Draft](https://developers.raycast.com/api-reference/user-interface/form#drafts) was saved and the user executes it.
* A user registers the command as a [fallback command](https://manual.raycast.com/fallback-commands) and executes it when there are no results in the root search.
* A user clicks a [Deeplink](https://developers.raycast.com/information/lifecycle/deeplinks)

Depending on how the command was launched, different arguments will be passed to the exported default function.

| Property                                     | Description                                                                                                                                                                  | Type                                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| arguments<mark style="color:red;">\*</mark>  | Use these values to populate the initial state for your command.                                                                                                             | [`Arguments`](https://developers.raycast.com/information/arguments#arguments)                 |
| launchType<mark style="color:red;">\*</mark> | The type of launch for the command (user initiated or background).                                                                                                           | [`LaunchType`](https://developers.raycast.com/api-reference/environment#launchtype)           |
| draftValues                                  | When a user enters the command via a draft, this object will contain the user inputs that were saved as a draft. Use its values to populate the initial state for your Form. | [`Form.Values`](https://developers.raycast.com/api-reference/user-interface/form#form.values) |
| fallbackText                                 | When the command is launched as a fallback command, this string contains the text of the root search.                                                                        | `string`                                                                                      |
| launchContext                                | When the command is launched programmatically via `launchCommand`, this object contains the value passed to `context`.                                                       | [`LaunchContext`](https://developers.raycast.com/api-reference/command#launchcontext)         |

When the command is unloaded (typically by popping back to root search for view commands or after the script finishes for no-view commands), Raycast unloads the entire command from memory. Note that there are memory limits for commands, and if those limits are exceeded, the command gets terminated, and users will see an error message.

**Examples:**

Example 1 (typescript):
```typescript
import { Detail } from "@raycast/api";

// Returns the main React component for a view command
export default function Command() {
  return <Detail markdown="# Hello" />;
}
```

Example 2 (typescript):
```typescript
import { showHUD } from "@raycast/api";

// Runs async. code in a no-view command
export default async function Command() {
  await showHUD("Hello");
}
```

Example 3 (typescript):
```typescript
import { Detail, LaunchProps } from "@raycast/api";

// Access the different launch properties via the argument passed to the function
export default function Command(props: LaunchProps) {
  return <Detail markdown={props.fallbackText || "# Hello"} />;
}
```

---

## Security

**URL:** llms-txt#security

**Contents:**
- Raycast
- Publishing Process
- Runtime Model
- Permissions
- Data Storage
- Automatic Updates

{% hint style="info" %}
Note that this is *not* a guide on how to create secure Raycast extensions but rather an overview of security-related aspects on how extensions are built, distributed and run.
{% endhint %}

Raycast itself runs outside of the App Store as "Developer ID Application", **signed** with the Raycast certificate and verified by Apple's **notarization service** before the app is distributed. Raycast provides various commands that interact with OS-level functionality, some of which prompt the user for granting **permissions** when required. The app is **automatically kept up-to-date** to minimize the risk of running heavily outdated versions and to ship hotfixes quickly. Raycast is a local-first application that stores user data in a local **encrypted database**, makes use of the system **Keychain** where secure data is stored, and generally connects to third-party APIs directly rather than proxying data through Raycast servers.

## Publishing Process

All extensions are **open source** so the current source code can be inspected at all times. Before an extension gets merged into the **public repository**, members from Raycast and the community collaboratively **review** extensions, and follow our **store guidelines**. After the code review, the Continuous Integration system performs a set of **validations** to make sure that manifest conforms to the defined schema, required assets have the correct format, the author is valid, and no build and type errors are present. (More CI pipeline tooling for automated static security analysis is planned.) The built extension is then **archived and uploaded** to the Raycast Store, and eventually published for a registered user account. When an extension is installed or updated, the extension is downloaded from the store, unarchived to disk, and a record is updated in the local Raycast database. End-users install extensions through the built-in store or the web store.

In order to run extensions, Raycast launches a **single child Node.js process** where extensions get loaded and unloaded as needed; inter-process communication with Raycast happens through standard file handles and a thin RPC protocol that only exposes a **defined set of APIs**, that is, an extension cannot just perform any Raycast operation. The **Node runtime is managed** by Raycast and automatically downloaded to the user's machine. We use an official version and **verify the Node binary** to ensure it has not been tampered with.

An extension runs in its own **v8 isolate** (worker thread) and gets its own event loop, JavaScript engine and Node instance, and limited heap memory. That way, we ensure **isolation between extensions** when future Raycast versions may support background executions of multiple extensions running concurrently.

Extensions are **not further sandboxed** as far as policies for file I/O, networking, or other features of the Node runtime are concerned; this might change in the future as we want to carefully balance user/developer experience and security needs. By default and similar to other macOS apps, accessing special directories such as the user Documents directory or performing screen recording first requires users to give **permissions** to Raycast (parent process) via the **macOS Security & Preferences** pane, otherwise programmatic access is not permitted.

While extensions can access the file system and use their own methods of storing and accessing data, Raycast provides **APIs for securely storing data**: *password* preferences can be used to ask users for values such as access tokens, and the local storage APIs provide methods for reading and writing data payloads. In both cases, the data is stored in the local encrypted database and can only be accessed by the corresponding extension.

Both Raycast itself and extensions are **automatically updated** and we think of this as a security feature since countless exploits have happened due to outdated and vulnerable software. Our goal is that neither developers nor end-users need to worry about versions, and we **minimize the time from update to distribution** to end-users.

---
