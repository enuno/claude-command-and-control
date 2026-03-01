# Raycast - Api

**Pages:** 31

---

## HUD

**URL:** llms-txt#hud

**Contents:**
- API Reference
  - showHUD

When the user takes an action that has the side effect of closing Raycast (for example when copying something in the [Clipboard](https://developers.raycast.com/api-reference/clipboard)), you can use a HUD to confirm that the action worked properly.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-690446648e9c7bb76403f9d177ecfc8a3851ee8a%2Fhud.webp?alt=media)

A HUD will automatically hide the main window and show a compact message at the bottom of the screen.

`showHUD` closes the main window when called, so you can use the same options as `closeMainWindow`:

| Name                                    | Description                                                                                                                          | Type                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| title<mark style="color:red;">\*</mark> | The title that will be displayed in the HUD.                                                                                         | `string`                                                                              |
| options                                 | Can be used to control the behaviour after closing the main window.                                                                  | `Object`                                                                              |
| options.clearRootSearch                 | Clears the text in the root search bar and scrolls to the top                                                                        | `boolean`                                                                             |
| options.popToRootType                   | Defines the pop to root behavior (PopToRootType); the default is to to respect the user's "Pop to Root Search" preference in Raycast | [`PopToRootType`](https://developers.raycast.com/window-and-search-bar#poptoroottype) |

A Promise that resolves when the HUD is shown.

**Examples:**

Example 1 (typescript):
```typescript
async function showHUD(
  title: string,
  options?: { clearRootSearch?: boolean; popToRootType?: PopToRootType }
): Promise<void>;
```

Example 2 (typescript):
```typescript
import { showHUD } from "@raycast/api";

export default async function Command() {
  await showHUD("Hey there 👋");
}
```

Example 3 (typescript):
```typescript
import { PopToRootType, showHUD } from "@raycast/api";

export default async function Command() {
  await showHUD("Hey there 👋", { clearRootSearch: true, popToRootType: PopToRootType.Immediate });
}
```

---

## Changelog

**URL:** llms-txt#changelog

**Contents:**
- 1.103.0 - 2025-09-15
- 1.98.0 - 2025-05-08
  - ✨ New
  - 💎 Improvements
  - 🐞 Fixes
- 1.94.0 - 2025-03-19
  - ✨ New
  - 💎 Improvements
- 1.93.0 - 2025-02-26
  - ✨ New

## 1.103.0 - 2025-09-15

Over the past few releases, we've made some additions to the API to better support it:

* there's a new `platforms` field in the manifest. We’ve intentionally chosen to release only extensions that we are tested on Windows. This is the field that allow extensions to be available on Windows. By default, if not specified, the field's value is `["macOS"]`. If you want to make an extension available on Windows, you can set it to `["macOS", "Windows"]`
* Keyboard Shortcuts are tricky. If you use the `Common` shortcuts, then they will be cross-platform. However, if you use shortcuts and specify a modifier like `cmd`, the shortcut will be ignored on Windows (and vice-versa, if you specify a modifier like `windows`, it won't be available on macOS). So we've added a new syntax where you can nest shortcuts per platform:

* Sometimes, you might want to change preferences depending on the platform (for example if it's a path). You can now specify the default as a object as well:

* We've also updated the `@raycast/utils` to make it cross platform and added a `runPowerShellScript` function.

## 1.98.0 - 2025-05-08

* New `Action.InstallMCPServer` to push a MCP installation form

* **Shortcuts**: It’s now possible to provide platform-specific shortcuts.

* Fixed an issue that caused extensions containing Swift code to not compile.

## 1.94.0 - 2025-03-19

* The extensions now run on Nodejs 22 and react 19. Among other benefits, this makes `fetch` globally available. There shouldn’t be any breaking change - but if you find some, please let us know! Additionally, new extensions will be bootstrapped with ESLint 9
* **Tools**: Tools can now specify some preferences, the same way Commands can

* **CLI**: When a tool or a command (when running in the background) times out, an error message will be printed in the terminal
* **CLI**: When publishing an extension, the PR to the extensions repository will be created as draft so you can fill the description up before submitting it

## 1.93.0 - 2025-02-26

* **Tools**: We are introducing a new type of entry points for extensions: Tools. They turn a regular extension into an AI Extension. As opposed to a command, they don’t show up in the root search and the user can’t directly interact with them. Instead, they are functionalities that the AI can use to interact with an extension.

## 1.91.0 - 2025-02-05

* **AI**: The models added in [Raycast 1.90.0](https://www.raycast.com/changelog/1-90-0) are now also part of the API
  * DeepSeek R1² reasoning model (powered by Together AI) and its distilled version¹ (powered by Groq)
  * OpenAI o1-mini² and o1-preview² reasoning models
  * OpenAI o3-mini¹
  * Google Gemini 1.5 Flash¹ and Gemini 1.5 Pro², Gemini 2.0 Flash¹ and Gemini 2.0 Flash Thinking¹ models
  * xAI Grok-2² model
  * Perplexity Sonar¹, Sonar Pro² and Sonar Reasoning¹ models

¹ available with Raycast Pro ² available with Raycast Pro + Advanced AI

* **Window Management**: Added missing types for `getActiveWindow`.

## 1.89.0 - 2025-01-15

* **Cache**: Clearing the cache will now delete all the files in the cache folder instead of the entire folder.

## 1.88.0 - 2024-12-16

* **Markdown**: Fixed a crash when trying to print invalid surrogate code points
* **Types**: Fixed an issue when generating the TypeScript definition for the preferences when one of their descriptions contained `*/`

## 1.87.0 - 2024-12-04

* **Docs**: You can now find a few txt files containing all the docs that you can feed to LLMs:
  * <https://raw.githubusercontent.com/raycast/extensions/refs/heads/gh-pages/llms-full.txt> → All the docs
  * <https://raw.githubusercontent.com/raycast/extensions/refs/heads/gh-pages/llms-api.txt> → The API docs
  * <https://raw.githubusercontent.com/raycast/extensions/refs/heads/gh-pages/llms-utils.txt> → The utils docs

* **CLI**: Fix a couple of issues when trying to publish an extension or pull contributions

## 1.86.0 - 2024-11-20

* **CLI**: The CLI that comes with `@raycast/api` does not use a platform/architecture-specific binary anymore. This should fix some issues that people encountered when trying to install the API.

## 1.84.0 - 2024-10-09

* When running a no-view command with arguments, only clear the argument inputs instead of clearing the entire search bar (which brings the behaviour in line with other no-view commands)

* Fixed a regression where `selectedItemId` wouldn’t be respected
* Fixed a typo in the extension template’s build script

## 1.81.0 - 2024-08-13

* **Detail:** You can now render LaTeX in the Detail views. We support the following delimiters:
  * Inline math: `\(...\)` and `\begin{math}...\end{math}`
  * Display math: `\[...\]`, `$$...$$` and `\begin{equation}...\end{equation}`

* You can now pick a different command template for each command that you add in the `Create Extension` command’s form.
* Added a new `Add Command` action for local extensions in the `Manage Extensions` command.

## 1.80.0 - 2024-07-31

* **AI:** OpenAI GPT-4o Mini can now be used in the API.
* **Quicklinks:** `CreateQuickLink` now accepts an `icon` prop that allows you to customize the icon of your Quicklink.

* **Menu Bar Commands** now show a confirmation toast when activated or refreshed.

## 1.79.0 - 2024-07-17

* **Navigation**: Added a second argument to `useNavigation().push` to specify a callback called when the pushed view will be popped. You can use it to update the current view when it will become active again. There’s also a new `onPop` prop on `Action.Push` to do the same thing.

* When creating or forking an extension, an alert will be shown if you specify an existing folder (and thus avoid overwriting files without warning)

## 1.78.0 - 2024-07-03

* In addition to the new Custom Window Management commands, we are introducing a `WindowManagement` API to give you total control to move your windows depending on any kind of logic you can imagine.
* You can now access the `ownerOrAuthorName` in the `environment`, useful for re-usable libraries.

* **Pagination**: Fixed the TypeScript definition of the `onLoadMore` callback.

## 1.77.0 - 2024-06-19

* Updated React version to 18.3.1 to prepare for the next major version of React. This shouldn't impact any extensions but let us know if you find any unexpected behaviour.

* **Menu Bar Extra**: fixed an issue where `Submenu` icons changed appearance based on Raycast's appearance, instead of the system's.

## 1.76.0 - 2024-06-05

* Some companies requires all package.json’s names to be name-spaced (eg. `@foo/bar`). However, Raycast only understands names that *aren’t* name-spaced. This prevented some people from creating internal extensions. In order to workaround this issue, you can now use the `@workaround` namespace in extension names (eg. `@workaround/bar`).

* **Clipboard**: Fixed an issue where 2 items were added to the pasteboard when copying a file (one with the file name, and one with the file url). It now correctly adds 1 item with 2 representations.

## 1.74.0 - 2024-05-15

* **AI:** The models available in the API now matches the ones available in the app (eg. GPt-4o, Llama-3, etc.). As part of this, the models are now part of an enum `AI.Model` which will make it easier to add and deprecate them as time goes on.
* **Utils:** we’ve added a new React hook called `useLocalStorage`. This hook simplifies managing a value in `LocalStorage`. Take a look at the [developer docs](https://developers.raycast.com/utilities/react-hooks/uselocalstorage) to learn more.

* **DX**: Improved the precision of warning messages when trying to add children to a react component that can’t accept them.

## 1.72.0 - 2024-04-24

* **Browser Extension**: You can now access the context of the focused browser via the Raycast Browser Extension. You can get the list of open tabs as well as the content of a tab.

* **Grid**: Fixed a bug that caused the selected Grid item to be brought into focus when paginating.

## 1.71.0 - 2024-04-10

* **Developer Hub:** you can now programmatically send error reports using the new `captureException` function.
* **Utils**: we’ve added a new React hook, `useStreamJSON`. The new hook simplifies the process of streaming through large JSON data sources, which normally would not fit in the extension’s memory. Take a look at the [developer docs](https://developers.raycast.com/utilities/react-hooks/usestreamjson) to learn more.
* **AI**: All the new models are also available in the API.

* `getApplications`, `getDefaultApplication`, and `Action.OpenWith` now support remote URLs and will return the installed Applications that can open remote URLs (usually browsers)

* **Pagination**: Fixed a bug that could cause pagination to not work when `filtering` was set to true.
* **CLI**: Fixed the cursor being kept hidden when interrupting a command

## 1.70.0 - 2024-03-20

* **Grid & List:** The placeholders shown while waiting for the next page to load are now animated
* **Application info:** Application object now returns the localized name if the application is running

* **Forms:** Fixed an issue which made it impossible to select a value of a controlled Dropdown after changing its value programmatically
* **Grid:** Fixed an issue where pagination would not work when scrolling to the bottom while `isLoading` is initially false
* **List:** Fixed an issue where pagination would not work if there was an empty section at the end
* Fixed a rare case where, when an extension throws an error, a different error saying “Could not communicate with command worker” would be thrown instead

## 1.69.0 - 2024-03-07

* `List` and `Grid` now have native pagination support! 🎉 If you want to update your extension to support pagination, head over to the [docs](https://developers.raycast.com/api-reference/user-interface/list#pagination) for instructions on how to get your extension to use pagination.
* Markdown: Added support for specifying a tint color in the url of a markdown image by adding a `raycast-tint-color` query string

* Lint: The eslint plugin and `ray` CLI has been updated to have the same algorithm to check if a string is in Title Case (using the definition from Apple)
* `getApplications` (and `Action.OpenWith`) will now show `Terminal` when using a path to a directory

* Fixed an issue where, when the user would change the selection in a List or Grid and rapidly trigger an action, the action of the previously selected item would execute instead

## 1.67.0 - 2024-02-07

* Fix a crash that could happen when exporting a function that would return another function.
* **Menu Bar Extra:** Fixed a bug that caused the text in text-only extras to be offset.

## 1.66.0 - 2024-01-24

* Improved some error messages in the `ray` CLI.

* **Form**: Fixed the display of full-day dates in the Date Picker.

## 1.65.0 - 2024-01-10

* **Developer Tools**: we've introduced a new developer option, `Use file logging instead of OSLog`, to work around an OS issue that causes some users to not see any extension logs in the terminal during development.

* **Form's Date Picker:** Future dates will be prioritised when parsing the date, f.e. if you type "8am" and itrs already "10am", then the parsed date will be "tomorrow 8am".

* Fixed an issue where the `ray` CLI could not communicate with the app.
* Fixed an issue where an OAuth authorization session triggered by a menu bar command would not be able to complete if a `background` launch was triggered between authorization starting and completing.
* Fixed an issue on multi-monitor setups, where sometimes MenuBarExtra icons would not appear dimmed on inactive displays.

## 1.64.0 - 2023-12-13

* **Form**: Introduced a new component `Form.LinkAccessory` to render a link displayed in the right-hand side of the search bar.
* **Arguments**: Introduced a new Argument type: `dropdown`. You can now [specify a list of options](https://developers.raycast.com/information/manifest#argument-properties) for the user choose from.
* **Developer Hub**: User preferences are now included in error reports. Password and text preferences will be replaced with `[REDACTED]`, file/directory/appPicker preferences will be scrubbed of PII, and dropdown/checkbox preferences will be sent as-is.

* **Window Capture**: Added a warning when trying to take a screenshot of Raycast if that screenshot won't match the requirement for the Store's extensions guidelines (eg. if Raycast is too close to an edge or if the screen doesn't have a high enough resolution).

* **Types generation**: Fixed the type of a required `appPicker` preference (even if it is `required`, the app might be undefined because it is missing).
* **Empty View**: Fixed an issue where the Empty View might not be showing in a certain case.
* **Menu Bar Extra**: \*\*\*\*icons tinted with `Color.PrimaryText` and `Color.SecondaryText` should now change based on the menu bar's appearance.
* **List Metadata:** `Link`s should be properly aligned again.

## 1.63.0 - 2023-11-29

* Improved runtime error handling when using a Swift project

* **Lists**: Fixed a race condition where the selected item would not be the first one after a list items update
* **MenuBarExtra:** `alternate` are no longer supported on pre-Sonoma versions of macOS, as they would often appear alongside their parent items.

## 1.62.0 - 2023-11-15

* **Menu Bar:** `MenuBarExtra.Item`s have a new prop, `alternate`. If an `alternate` is defined, it will replace its parent `MenuBarExtra.Item` when the user presses the ⌥ (option) key.
* The Node runtime has been updated to [Node 20](https://nodejs.org/en/blog/announcements/v20-release-announce/), the [current](https://github.com/nodejs/Release#release-schedule) Long-term Support (LTS) release.
* **AI**: You can now use the `gpt-4` model with `AI.ask`. If a user does not have access to this model, it will gracefully fall back to an available model. You can check if a user has access using `environment.canAccess('gpt-4')`.

* **Error Handling:** `Could not communicate with command worker` errors should not be reported anymore.

* **Toast:** Fixed an issue that caused toast actions to not work after a toast was updated.
* **Error Handling:** Fixed an edge case that could cause an out-of-memory error while an uncaught exception was processed, obfuscating the original error.
* **Performance**: Fixed an issue where some keyboard events would be dropped while an extension was loading.
* **Markdown**: Fixed a regression where HTML comments would show up in the rendered Markdown.

## 1.61.0 - 2023-11-02

* **Date Picker**: When specifying a min and/or max date, the suggestion will now always be within those bounds

* Fixed a bug that previously could cause a `no-view` command to display an error icon in the root search, with no means of removing the error.

## 1.60.0 - 2023-10-18

## Introducing the Extension Issues Dashboard

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e3c7a6de170fa071b3e0caf1ac8f93d283255a91%2Fextension-issues.webp?alt=media)

The new Extension Issues Dashboard is designed to help you quickly troubleshoot and resolve issues in any of your extensions by providing real-time visibility into errors encountered by users. You can access it at <https://www.raycast.com/extension-issues>, or by using the new `View Issues` action.

* It is now possible to write extensions [using ESM](https://developers.raycast.com/faq) instead of CommonJS

* Updated NodeJS runtime to 18.18.2
* When copying a deeplink with some arguments in the root search, copy the deeplink with those arguments

* Fixed an issue where animated toasts would hang around after the command was unloaded.

## 1.59.0 - 2023-09-21

* **PickDate**: Similar to `Form.DatePicker`, you can also check whether the user picked a full day or a specific time with `Action.PickDate.isFullDay(date)`.

* **Clipboard**: The `transient` option is renamed to `concealed`.

* **MenuBarExtra:** Right-clicking `MenuBarExtra.Item`s should now work in macOS Sonoma.

## 1.58.0 - 2023-09-06

* **Alert**: Add a new option `rememberUserChoice` to show a checkbox to remember the user choice the next time the same Alert would be shown.
* **DatePicker**: You can know check whether the user picked a full day or a specific time with `Form.DatePicker.isFullDay(date)`.

* The "Fork Extension" action is now also available in the Store for installed extensions.
* All the APIs that accepts a file path will now resolve `~` if necessary.

* Fix an issue where some Toasts would not disappear after the command was terminated.
* Fix an issue where List Item's accessories with an icon could have their text cut off.
* Fix `getFrontmostApplication` failing for some applications.
* The "Fork Extension" will now be more robust dealing with unexpected `package.json` formats.
* Fixed an issue where newly created Extensions would not use the correct username after it had been updated.
* Fix an issue where it was possible to set a multiline `searchText`

## 1.57.0 - 2023-08-09

* **Metadata**: Fixed various rendering issues with `TagList`.
* **Menu Bar Extra**: Fixed a bug that caused section titles to be unreadable on macOS Sonoma.
* **Menu Bar Extra**: Fixed a bug that could cause a menu bar command to be unloaded while its menu is open.
* **Form**: Fixed stale suggestions in the DatePicker when changing its type.
* **Icon**: Fixed the `AppWindowGrid2x2` icon only showing a square.

## 1.56.0 - 2023-07-26

* **Clipboard**: `Clipboard.read()` now supports an `offset` option to access the Clipboard History (limited to the last 5)
* **Grid:** Grid items can now have an icon accessory
* **Shortcuts:** Providing a consistent user experience should now be easier thanks to the new `Keyboard.Shortcut.Common` export.

* `getSelectedText` is now more reliable
* **Trash**: Improved behaviour of `trash` and `Action.Trash` to better handle missing files.
* **HUD**: `showHUD` now supports the same options as `closeMainWindow`
* **Command Launching:** Improved logic for deciding which version of a command gets launched when a user has both a production and a development version of an extension installed.
* **Tags:** Icon-only tags should now center the icon.

* **Form**: When working on a draft, updating a `Form.Checkbox` will update the draft.
* **Error Reports:** Improved error messages when an extension crashes during a background launch.
* **Shortcuts:** Previously, the API permitted the creation of shortcuts using keys reserved by Raycast (⌘+K, ⌘+W, ⌘+Esc, etc.), resulting in unexpected behavior. Raycast now ignores these and, during development mode, they will trigger a runtime warning.

## 1.55.0 - 2023-07-06

* **Fallback Commands**: Local commands will now have an indicator so that it's possible to differentiate them from the commands installed from the Store
* The NodeJS process used for Raycast extensions will now be named `Raycast Helper (Extensions)`
* Active menu bar commands will now be displayed in `Extension Diagnostics`.

* Fix an issue where Metadata's Tag items would sometimes not be updated
* Fix a bug where renamed commands appear in the root search with both the original and the updated name after an extension update.

## 1.54.0 - 2023-06-21

* Add an action to clear the local storage when an unexpected error occurs
* When using `showToast` while the Raycast window is closed (for example if a command is launched with a hotkey), a `HUD` will be shown instead
* Improve the error messages when a command fails to load
* The NodeJS inspector will now use a random free port instead of using the default 9229 port (which you can use for other NodeJS scripts)

* Fix a performance issue on the first render of Lists and Grids
* Fix an issue where required arguments wouldn't be required when launching a command right after installing it
* Fix a regression where the deprecated `render` method would not work anymore
* Fix an edge case where some Form items would not be updated if some items would be added at the same time

## 1.53.0 - 2023-06-07

* **Metadata**: `List.Item.Detail.Metadata.TagList.Item` and `Detail.Metadata.TagList.Item` now accepts an action handler via the `onAction` prop!
* Added [LaunchContext](https://developers.raycast.com/api-reference/command#launchcontext) support to `Create Quicklink` and `Create Snippet:`
  * `launchCommand({ ownerOrAuthorName: "raycast", extensionName: "raycast", name: "create-quicklink", type: LaunchType.UserInitiated, context: { name: "context name", application: "Xcode", }});`
  * `launchCommand({ ownerOrAuthorName: "raycast", extensionName: "snippets", name: "create-snippet", type: LaunchType.UserInitiated, context: { name: "context name", text: "context text", keyword: "context keyword" }})`
* **Date Pickers:** You can now add a minimum and maximum date to `Form.DatePicker` and `Action.PickDate` using the `min` and `max` props to limit the suggestions shown when entering a date.

* Updated NodeJS to 18.16.0
* Improve the "Fork Extension" action to avoid modifying the manifest as much as possible.

* Fixed a bug that sometimes caused `no-view` commands to not display errors.
* Fixed a bug that caused OAuth not to work if the `client.authorize(authorizationRequest)` was executed more than once.
* Fixed a problem where commands with background execution would not display the OAuth sign-in screen.
* **SVG**: Properly handle `currentColor`
* **List/Grid**: Fixed `selectedItemId` being sometimes ignored on the first render.
* **Form**: Fixed triggering `onChange` on the TextArea when using a markdown keyboard shortcut.

## 1.52.0 - 2023-05-24

* **SVG**: You can now use the Raycast `Color` in an SVG.

* Improve the error message when a required property is missing on a component

* Fixed an edge case where the keyboard events triggered while an extension is loading would not be passed down to the extension once loaded
* Fixed an issue where the fallback of an image would show while it is being loaded

## 1.51.0 - 2023-05-10

* **AI**: Introduced a new `AI` Pro API. Use `AI.ask` to seamlessly ask any prompt and enhance your extensions with artificial intelligence.
* **Pro APIs:** You can now check whether a user can access a certain API using `environment.canAccess(AI)`.

* **Custom Theme**: Deprecated `Color.Brown` as it is not part of the Raycast colors anymore.
* **Custom Theme:** Renamed `environment.theme` to `environment.appearance`.
* Improve the error message when an API is called with arguments of the wrong type.

* **Forms**: Fixed an issue where drafts would not save the value of a File Picker.
* **Forms**: Fixed an issue where `onChange` would not be triggered in certain cases for a File Picker.
* **Lists**: Fixed an issue that caused a List's section to re-render whenever an action panel's submenu was updated.
* **Colors:** Fixed a crash that could sometimes occur when using `adjustContrast` on a dynamic color.

## 1.50.0 - 2023-04-27

* Raycast now provides 2 global TypeScript namespaces called `**Preferences**` and `**Arguments**` which respectively contain the types of the preferences and the types of the arguments of all the commands of the extensions. For example, if a command named `show-todos` has some preferences, its `getPreferenceValues`'s return type can be specified with `getPreferenceValues<Preferences.ShowTodos>()`. This will make sure that the types used in the command stay in sync with the manifest.
* It is now possible to add commands that are disabled by default. A user will have to enable it manually before it shows up in Raycast's root search. This can be useful to provide commands for specific workflows without overwhelming everybody's root search.
* **Markdown Tables** are now properly supported.
* **Markdown** code blocks now support syntax highlighting. To enable it, make sure you specify the programming language at the start of the block.

* **Colors**: To improve accessibility, dynamic adjustment for raw colors (`HEX`, `rgb` etc) used in extensions has been switched from opt-in to opt-out. If your extension relies on accurate color reproduction, check the [documentation](https://developers.raycast.com/api-reference/user-interface/colors) for instructions on how to opt-out.
* **Images**: You can now suffix your local assets with `@dark` to automatically provide a dark theme option, eg: `icon.png` and `icon@dark.png`.

* **CLI**: Fix an issue where the CLI wouldn't want to bundle files named `foo.node.js`.

## 1.49.0 - 2023-03-29

* It is now possible to drag and drop items from Grids. Lists are also supported if their items have as `quickLook` properties.

* Extend `launchCommand` to allow inter-extension launches
* Extend `launchCommand` to allow to pass a `fallbackText`

* **SVG**: Ignore doctype and HTML comments
* Fix a flicker happening when there was a fallback text passed to a command
* Fix a rendering issue with multi-line `tag` text.

## 1.48.0 - 2023-02-22

* **Clipboard**: Added `transient` option to `Clipboard.copy` method.
* **Actions**: Added `type` prop to `Action.PickDate` to control the date components to be picked.

* Improve the time to interaction when launching a command that always renders the same view type.

* Changed `Deactivate Command` action shortcut to `⌘ ⌥ ⇧ D`, so it doesn't clash with `Copy Deeplink`
* Fixed an issue where restarting Raycast would not properly restore menu bar commands that sometimes didn't put anything in the menu bar.
* Locale: Respect the hourCycle, calendar, and numbering system locale.

## 1.47.0 - 2023-02-01

* **Clipboard**: Add a new `Clipboard.read()` method that reads the clipboard content as plain text, file path, or HTML.

* **List Accessories**: Tags can now use any color (we made some improvements to ensure that any color would have enough contrast to be readable)

* Fixed a bug where reloading menu bar commands in development mode would not respect certain manifest property updates (e.g. interval).
* Fixed a bug that caused `Metadata.Link`'s `title` to be cut off unnecessarily when using the large text size.
* Fixed a bug where `clearSearchBar` wouldn't clear the search bar when rendering a Grid.
* Fixed a bug where `ray lint` would fail if there were a .DS\_Store file in the `src` folder.

## 1.46.0 - 2023-01-18

⚠️️ **Global Fetch Deprecation**: We've removed the experimental support for global fetch in Node 18. The reason is that the feature is not stable yet (hence the warning on it being "experimental" in the dev console) and is not compatible with our new proxy feature in Raycast. We've scanned the public repository for extensions that make use of global fetch and replaced it with the *cross-fetch* dependency via separate PRs. If we missed an extension, let us know - in most cases, it should be a straightforward replacement.

* **Source maps** for production errors: source maps are now also enabled for production builds of an extension. When an exception occurs, you get cleaner stack traces with proper source locations in the TypeScript sources files (vs. the minified and unusable JavaScript locations). *Note*: An extension must be re-published to enable production source maps.
* **Action.PickDate**: We are introducing a new Action to allow users to set a Date directly from the action panel.

* **Dev Tools**: the "Start Development" command under "Manage Extensions" now starts development in iTerm if installed as the default terminal.
* In order to ensure that date formatting & other internationalization functions work as expected, the NodeJS process is now started with the `LC_ALL` environment variable set to the user's current locale.

* Fixed an issue where the first exec/spawn call for running a subprocess could be slower than subsequent calls.
* Fixed menu bar icon padding when there's no text.
* Fixed a problem where menu bar commands updated with a new required preference would not display the required preference screen.
* Fixed a rare bug with menu bar commands that could lead to Raycast hanging.
* Fixed an issue where menu bar commands launching view commands would cause stacking in the navigation hierarchy.
* Fixed an issue where fallback images in lists would flicker.
* Dev Tools: Fixed a bug when zip archiving extensions with special characters in file names.

## 1.45.0 - 2022-12-14

* **Fallback commands**: All commands (except menu-bar commands and commands with more than one required argument) can now be used as [fallback commands](https://manual.raycast.com/fallback-commands)! They should all work out of the box (e.g. a command that renders a List will receive `onSearchTextChange` with the fallback text on its first render, etc.) but you can customize the user experience with a new top-level prop `fallbackText`.
* **List Accessories:** `date` and `text` accessories can now be colored.
* **List Accessories:** We've added a new accessory type: `tag`.
* **Metadata:** Label text can now also be colored.
* **Proxy Support**: Extensions using popular networking libraries such as node-fetch/cross-fetch, got, Axios, or our useFetch hook are compatible with proxies if the user has turned on the new proxy preference in Raycast.

* **Background refresh**: when a command misses a required preference, instead of showing the error screen, the user is directed to the preference onboarding screen again.

* Fixed a bug where entered characters could be "swallowed" in controlled form components or the controlled search bar.
* Fixed the `launchContext` not being propagated to menu-bar and background launches when using the `launchCommand` API.
* Fixed a multi-monitor [bug](https://github.com/raycast/extensions/issues/2975) where menu bar extra text would be unreadable on the inactive screen.
* Fixed a bug where menu bar extra icon tinting would change based on Raycast's appearance instead of the system's.
* Fixed some memory leaks when using Form components

## 1.44.0 - 2022-11-23

* **Async Submenus and Dropdown**: Dropdowns and ActionPanel Submenus now also support the properties `onSearchTextChange, isLoading, throttle, filtering` - same as for List and Grid where you can perform custom logic when the user changes the search text.
* **Application:** You can now get the current frontmost Application of the system with the top-level `getFrontmostApplication` method.
* **File and Directory Preferences**: We've added two new preference types `"directory"` and `"file"`, supported via the manifest. Both types show a file picker component and let the user select directory or file paths.
* **Environment:** You can now get the user's text size via `environment.textSize`.

* **Pop To Root Behavior**: `closeMainWindow` accepts a new parameter `popToRootType` that lets you control when Raycast pops back to root: the default is as-is and respects the user's "Pop to Root Search" preference in Raycast. `PopToRootType.Immediate` closes the window *and* immediately pops back to root, regardless of the user's setting (so you can get rid of an additional `popToRoot()` call). The new mode `PopToRootType.Suspended` temporarily prevents Raycast from automatically popping back to root; this is useful for situations where a command needs to interact with an external system 00ity and then return the user back to the launching command.
* **Clipboard:** We added new options to copy and paste HTML content, which is useful for sharing formatted text, e.g. a link to a Notion page in Slack.
* **Markdown**: Markdown in a `Detail` component now supports convenience image references for icons and asset folder files such as: `![built-in icon](${Icon.AddPerson})` or `![local-assets-image](example.png)` (absolute URLs and user folder paths via `~` are also supported)
* **OAuth**: The client's `providerIcon` is now optional (extension icon as default) and accepts an `Image.ImageLike` type.
* **List and Detail Metadata**: Now show tooltips when labels get truncated.
* **Action.ToggleQuickLook**: Now also expands paths starting with `~`.

* **Dropdown**: Fixed triggering a dropdown component's `onChange` handler when navigating.
* **Dropdown**: Fixed the missing `placeholder` property in the search bar dropdown.
* **Forms**: Fixed submitting a form with marked text.

## 1.43.0 - 2022-11-09

* **Actions**: You can now specify an action to focus when opening the ActionPanel (and an ActionPanel.Submenu) by setting the `autoFocus` prop.
* **Forms**: Introducing a new Form Item `Form.FilePicker` to select one or multiple files (or directories)

* **DX**: A warning will now be shown in the console when using async entry points for view and menu-bar commands.
* **List/Grid**: Improved the keyword search algorithm to match intersecting keywords (for example, the search term "black cat" matches keywords \["black", "cat"]).
* **Grid**: The grid supports a new property for configuring how sections are ordered. Setting `filtering={{ keepSectionOrder: true }}` ensures that the sections' order is not changed based on items' ranking values; this can be useful for use cases where a small number of fixed sections should always appear in the same order when the user filters the grid. We are deprecating the `enableFiltering` property.

* Fixed the Grid or List's selection sometimes not being preserved when native filtering is disabled.
* The `Image.Mask.RoundedRectangle` mask will be more consistent regardless of the size of the image.
* Fixed an issue where the specified `searchText` property would not always be respected.

## 1.42.0 - 2022-10-26

* The Node runtime has been updated to [Node 18](https://nodejs.org/en/blog/announcements/v18-release-announce/), the [current](https://github.com/nodejs/Release#release-schedule) Long-term Support (LTS) release.
* Commands can now launch other commands! Using the new `launchCommand` method, you can now trigger a background refresh of another command in the same extension - or even open another command. Some use cases are updating a menu bar command from a view command or, vice versa, launching a companion view command from the menu bar. (Note that for now we only support launches of other commands within the same extension.)

* **Grid** now supports two new aspect ratios: 4/3 and 3/4.
* **Menu Bar** icon tinting is now theme-aware.
* **Background Refresh:** The shortest interval available is now 10s instead of 1m (use cautiously and also see our [best practices guide](https://developers.raycast.com/information/background-refresh#best-practices)).
* **Grid**: The grid supports a new property for configuring how sections are ordered. Setting `filtering={{ keepSectionOrder: true }}` ensures that the section order is not changed based on items' ranking values; this can be useful for use cases where a small number of fix sections should always appear in the same order when the user filters the list. We are deprecating the `enableFiltering` property.

* **List Item Metadata Link and Detail Metadata Link** styling should now be consistent with their respective **List Item Metadata Label** and **Detail Metadata Label** respectively.
* Fixed a bug where `List.Item`'s accessories might not be aligned.
* Fixed a bug where the last API call or log in a no-view command would not run before the command gets unloaded.

## 1.41.0 - 2022-10-12

* **Grid**: the `Grid` component accepts three new props that should give extension authors more flexibility: `columns`, `fit` and `aspectRatio`.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-274bdfb26a191e298c4248a6d7031d08d725f484%2Fgrid-styled-sections.webp?alt=media)

* **Grid Sections** don't all have to look the same anymore! The grid `Section` component now *also* accepts the `columns`, `fit` and `aspectRatio` props. When specified, they will override the value of the parent `Grid` component's prop.
* **List**: The list supports a new property for configuring how sections are ordered. Setting `filtering={{ keepSectionOrder: true }}` ensures that the section order is not changed based on items' ranking values; this can be useful for use cases where a small number of fix sections should always appear in the same order when the user filters the list. We are deprecating the `enableFiltering` property.
* **Menu Bar Extra:** added a new `Section` component, which can be used to better group related `Item`s and/or `Submenu`s. The component has an optional title for the section. At the same time, we are deprecating the `Separator` component.
* **Menu Bar Extra**: The `Item` component now accepts an optional `subtitle` prop.
* **Clipboard:** `Clipboard.copy()` and `Clipboard.paste()` methods now accept file paths as a parameter.

* Improved dark/light mode detection for **Menu Bar Extra** icons.
* If a **Menu Bar Extra**'s `title` spans multiple lines\*\*,\*\* only the first one will be displayed.

* Fixed certain error stack traces causing CPU spikes of the Node process.
* Fixed an issue with **macOS Ventura Beta** where **Menu Bar Extra**s would sometimes become unresponsive.
* Fixed the type of the List and Grid's `onSelectionChange`. It always used to return `null` when no items were selected but the type was `string | undefined`. It is now properly `string | null`. Note that this might trigger some TypeScript error when you upgrade but it should help you fix some bugs.

## 1.40.0 - 2022-09-28

* **Menu Bar Extras** can now be deactivated without disabling the menu bar command! To deactivate a menu bar command, run the `Deactivate Command` action from the command's Action Panel - or drag the menu bar extra out of the menu bar while holding down ⌘.
* Commands with **Background Refresh** also now have a `Deactivate Command` action!
* **Menu Bar Extras** now support both a primary and secondary action type (right click or control click).
* **Dropdown**'s items can now specify `keywords` to match more search terms.
* **Extension Diagnostics** command can now be used to help finding the cause behind any issues with extensions. It displays all `Loaded Commands`, commands with `Background Refresh` enabled and latest `Events` triggered.

* **Menu Bar Extra** action handlers will now either wait or force a render after finishing execution, to ensure any state updates performed in the action handler have had a chance to render.
* **Menu Bar** commands now automatically refresh when their or their parent extension's preferences change.
* **OAuth**: Path-based redirect URLs are now officially supported.
* **OAuth**: ⚠️️ API methods for OAuth request creation now throw an error when used from a background command - you can check the launch type of a command to see whether authorization can be performed
* **Types**: Node and React types have been added back as optional API peer dependencies and dev dependencies to the templates, so that VS Code autocompletion works.
* **Templates**: Updated to include the utils package.
* **DevX**: Added warnings when specifying a `value` without `onChange` or when changing a Form item from controlled to uncontrolled.
* **DevX**: For starting development, the CLI does not depend on metadata attributes any more

* **Forms**: The type of the `DatePicker`'s value is now `Date | null` (`null` happens when selecting `No Date`). ⚠️ This might cause some TypeScript errors but it will now reflect what is really happening, preventing bugs at runtime.
* Fixed an issue where `List.Item.Detail.Metadata` titles sometimes being cropped despite there being enough room.
* **Menu Bar Extra** `Item` and `Submenu` icons now change based on the system's dark / light mode, not Raycast's.
* **Forms**: Fixed a bug where the initial value for a controlled TextArea could not be deleted.
* **Forms**: Fixed the info icon and message not coming back after clearing an error on form items.
* **Forms**: Fixed updating the placeholder of the TagPicker item.
* **Empty View**: Fix an issue where an Empty View's actions would be rendered even thought the Empty View isn't.
* **OAuth**: Fixed a bug where multiple overlays could stack upon each other when OAuth was initiated from a menu bar or background launched command

## 1.39.2 - 2022-09-01

* **Bundler**: You can now import wasm files and they will bundle in the extension

* **SVG**: Accept a percentage for rect corner radius attributes
* **Actions**: `Action.Trash` is now a Destructive Action (meaning it will show up in red)

* **Metadata**: Fixes an issue where List Metadata would sometimes render Tags in the wrong position

## 1.39.0 - 2022-08-18

* **List.Item.Detail.Metadata**: We've added support for new `Link` and `TagList` item types.
* **Environment**: You can now check the `mode` of the current command *(as defined in the manifest)* *via* `environment.commandMode`.

* **CLI**: The ray CLI is now code-signed
* **CLI**: We've updated esbuild to v0.14.52
* **NPM size:** is now 0.5MB instead of 25MB *(binary files for ray CLI have been moved out of the NPM package)*

* **Navigation**: Top-level components can now dynamically return a different view type when used inside a navigation stack
* **Background Refresh**: Fixed an edge case where commands would run into a timeout that prevented further refreshing
* **Menu Bar Commands**: Fixed a bug where the error screen of menu bar commands would repeatedly be shown in the root search
* **Actions:** Triggering actions by *numeric shortcut / double-clicking* could trigger wrong actions or didn't work entirely
* **Form:** `TextArea` placeholder now won't highlight markdowns if it has `enabledMarkdown`

## 1.38.3 - 2022-08-03

* Added debug actions to all local development commands in root search
* Menu bar commands now show an activation button in preferences

* **Menu Bar Commands**: Fixed issues around hot reloading, unloading, and inconsistent action handler behavior
* **No-view Commands:** Fixed returning top-level props for commands that doesn't have arguments or drafts

## 1.38.1 - 2022-07-21

* 🍫 **Menu Bar Commands (Beta)**: For a long time, Commands could only live in the Raycast window. From today, Commands can put glanceable information in the Menu Bar 💪. Check out our [new docs section](https://developers.raycast.com/api-reference/menu-bar-commands) on how to develop your first native macOS menu bar command with hot reloading 🔥.
* 🔄 **Background Refresh (Beta)**: To keep Menu Bar Commands up-to-date, we ported Background Refresh from [Script Commands](https://github.com/raycast/script-commands) to Extensions. Background Refresh is configured with a new interval option in the Extension's [manifest](https://developers.raycast.com/information/manifest) and also works for "no-view" mode commands. Read more about it in a [new docs guide](https://developers.raycast.com/information/background-refresh).
* 🪝 **Utils**: We've released new React hooks to make it faster to build extensions that follow best practices. To do this, we looked at the Extension's repository for use cases and how we can improve them. Most Extensions connect to APIs: they make network requests, show a toast to handle errors, and add caching and optimistic updates to speed up interactions. Utils are available via a [new public npm package](https://www.npmjs.com/package/@raycast/utils).
* 🤬 **Arguments**: We also ported more functionality from Script Commands. Extensions can now define arguments, which enable simple forms that live in the root search of Raycast. Arguments can be defined via the [manifest](https://developers.raycast.com/information/manifest), and their entered values are passed to the main function of a command.
* ✍️ **Subtitle Updates**: We've added a new method `updateCommandMetadata` that allows you to update the subtitle of a command in root search. Combined with Background Refresh, this is another way to present information to the user as dashboard-like items in the root search.

## 1.38.0 - 2022-07-19

* **Redesign**: Along side the app's redesign, we are introducing a whole set of [new icons](https://developers.raycast.com/api-reference/user-interface/icons-and-images#icon) for you to pick to illustrate the actions in your extensions.
* **New Destructive Action:** You can now specify the `style` of an `Action` to highlight it in the Action Panel as destructive. Use it for actions where an end-user should be cautious with proceeding.

* **DevTools**: Turning on the "Use Node production environment" in the Advanced Preferences will also hide the debug actions. Previously it was only hiding them when there was no Action Panel specified.
* **DevTools**: The "Clear Local Storage" debug action has been renamed to "Clear Local Storage & Cache" and will clear the [Cache](https://developers.raycast.com/api-reference/cache) along side the [Local Storage](https://developers.raycast.com/api-reference/storage).
* **Dev Tools**: The "Start Development" action now quotes the extension folder path.
* **Dev Tools**: Added a new development advanced preference to keep the Raycast window always visible during development.
* **Dev Tools**: Added a new build status tooltip to the accessory icon of a development command in root search.
* **Dev Tools**: Improved the error handling for failed extension updates after invalid manifest changes; improved the error messages for general rendering errors.

* `require('os').tmpdir()` will now properly return the path to a temp directory.
* Fixed a rarely occurring crash happening when using some SVGs with a path that contains an arc where the ending point is the same as the starting point.
* Forms: Fixed a bug where stored form values could get cleared after extension updates.
* Forms: Fixed inconsistent behaviour of the `onBlur` handler that could get triggered for the `Form.TextField` when the form screen is popped in a navigation stack.
* List: Fixed the updating of tooltips for list accessory items.

## 1.37.0 - 2022-06-29

* **React 18**: React Suspense, `useSyncExternalStore`, etc.. A whole bunch of new features are available with the newest version of React. See the [migration guide](https://developers.raycast.com/migration/v1.37.0) for more information.
* **Quick Look:** Use the new `<Action.ToggleQuickLook />` action to show additional information with a Quick Look preview.
* **Forms:** Use the new validation feature to check if entered data is correctly formatted and show failure messages with a nice UX
* **Forms:** Drafts support - use the feature if you want Raycast to preserve non-submitted data, to provide the best experience for users
* **DevX:** Check out the new screenshot tool that takes a photo of Raycast from the best possible angle

* **List Accessories**: You can now pass `{date: Date}` as an accessory and it will be rendered nicely by Raycast.
* **Detail View:** Add support for `- [ ] task` and `- [x] task` in markdown views.
* **Action Panel**: Add a new `onOpen` callback on `ActionPanel.Submenu`. It can, for example, be used to lazily fetch the content of the Submenu.
* **Grid**: Add support for `ColorLike` as Grid.Item's content.
* **Forms:** New callbacks `onFocus` and `onBlur` for all the items
* **Forms:** Markdown highlighting for the `Form.TextArea`

* **Misc:** Fixed a crash when using `<List>{response?.website && <List.Item title={response.website} />}</List>` and `website` is an empty string ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1845](https://github.com/raycast/extensions/issues/1845)).
* **Dev Tools**: Fixed uninstalling of local development extensions via the Action Panel
* **Markdown**: Fixed rendering of transparent animated gifs in markdown
* **Forms:** Fixed an issue when entering characters with IME ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 739](https://github.com/raycast/extensions/issues/739)) in controlled text inputs
* **List Accessories:** Fixed the tooltip for grouped accessories; now the tooltip will be shown for the group instead of separately for the items

## 1.36.0 - 2022-06-01

The `<Grid />` component's made its way to our API. It's perfect to layout media-heavy information, such as icons, images or colors. The component allows you to layout differently sized items. We designed [its API](https://developers.raycast.com/api-reference/user-interface/list) close to the `<List />` component for smooth adoption.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4bb3d7e88613cf9ccba01c798f5d2aa62edfaeac%2Fgrid.webp?alt=media)

* Fixed the controlled mode for `Form.DatePicker`
* Fixed the dynamic appearance of form item's `info` accessory
* Fixed the OAuth logout preference not being shown for single-command extensions
* Fixed a bug where components that are pushed with the same properties values would not be updated ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1843](https://github.com/raycast/extensions/issues/1843))
* Fixed a bug where updated list metadata items would cause unnecessary list reloading
* Fixed an issue with tinted, resized icons appearing blurred in some cases (e.g. Alerts)

## 1.35.0 - 2022-05-18

* **List Item Metadata**: we've added a new `metadata` property to the `List.Item.Detail` component, allowing you to add structured metadata. The `metadata` property can be used together with `markdown`, in which case the detail view will be split horizontally, with the markdown being displayed in the top half and the metadata displayed in the bottom half (similar to the `File Search`, `Clipboard History` or `Search Contacts` commands). Alternatively, it can be used by itself, in which case the metadata will take up the entire height of the detail view.
* **Preferences**: We've added two new top-level methods `openExtensionPreferences` and `openCommandPreferences` that allow you to open both extension and command preferences, for example, via an Action ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 179](https://github.com/raycast/extensions/issues/179))

* Added a new development action to clear the local storage of an extension

* Fixed a bug where the wrong form element onChange handler would be called initially while the form was being updated ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1633](https://github.com/raycast/extensions/issues/1633))
* Fixed a bug where form elements would not be re-rendered correctly ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1663](https://github.com/raycast/extensions/issues/1663))
* Fixed a bug where a fully controlled form TextField/PasswordField behaves as stateful ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1093](https://github.com/raycast/extensions/issues/1093))
* Fixed `EmptyView` not being displayed when it would be reused in a navigation stack

## 1.34.0 - 2022-05-04

* OAuth: TokenSets are now included in the encrypted Raycast export (Raycast Preferences > Advanced > Export)
* OAuth: The convenience method `TokenSet.isExpired()` now includes some buffer time to reduce the risk of performing requests with expired access tokens

* Fixed an issue where updating the search bar accessory would result in the search bar text being selected
* Forms: We've fixed some inconsistencies around form item properties and added new warnings (e.g. when `defaultValue` and `value` are set at the same time); this also fixes [![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1104](https://github.com/raycast/extensions/issues/1104)
* Forms: Fixed an issue where updating form items would lead to unwanted scrolling; fixed the `autoFocus` property not scrolling to the focused item
* Fixed an issue with `Action.OpenWith` trying to perform a state update without checking whether it's still mounted ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue 1495](https://github.com/raycast/extensions/issues/1495)).
* Fixed an issue where `adjustContrast` would not be respected for colored TagPicker items.

## 1.33.0 - 2022-04-20

* **OAuth**: we've added a new API that enables you to authorize extensions through OAuth providers such as Google, Twitter, Dropbox or Spotify ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #178](https://github.com/raycast/extensions/issues/178)). The docs contain a [new detailed guide](https://developers.raycast.com/api-reference/oauth) and we've added some integration examples to the extensions repository. (Note that we currently only support OAuth 2.0 with PKCE, more on that in the [guide](https://developers.raycast.com/api-reference/oauth).)
* **Form Focus**: use the new imperative form API to programmatically focus form items. Want to make sure a particular input is focused on mount? Form items now accept an `autoFocus` prop! ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #66](https://github.com/raycast/extensions/issues/66))
* **Form Reset**: use the new imperative form API to reset form items' values to their initial values.
* **Form Info:** Use the new `info` prop on form items to show additional information about an item, e.g. to explain what this field is used for.
* The Raycast window opens automatically when you start a development session for an extension. You can turn the behavior off in the Advanced preferences tab.

* Improved detection of default editor when you open extensions from Raycast
* Improved templates for list, form and detail
* Removed `react-devtools` from `devDependencies` for newly created extensions (so that you don't have to download a big dependency that you might not use)

* Fixed an issue where animated gifs would be incorrectly scaled when size attributes are specified in markdown.
* Form Checkbox now returns proper boolean values on submit

## 1.32.0 - 2022-04-06

* **List Tooltips**: List items now support tooltips for the title, subtitle, icon, and each accessory item. For titles, you can use the new type `{ value: string, tooltip: string }`, for icons `{ value: Image.ImageLike, tooltip: string }`, and for accessories you just add the new property `tooltip`.
* **Animated Gifs**: the `Detail` component now renders animated gifs defined in markdown! 🎭

* Improved recovering the Node process after a crash and logging the error to the CLI output
* Added support for running CLI commands through `npx @raycast/api <commandName>`
* Improved the `Create Extension` command to add `README.md` and `CHANGELOG.md` files

* **Detail Metadata**: Fixed toggling (showing/hiding)
* **Detail Metadata**: Fixed only one separator item getting rendered
* **Detail Metadata**: Fixed a crash when using primary or secondary colors for tag items
* **List Accessories**: Fixed rendering when using `undefined` for accessory values
* **List EmptyView**: Fixed an issue where passing a `List.EmptyView` child to a `List.Section` would treat it as a `List.Item`
* **SVG**: Fixed rendering base64 encoded SVG images
* Fixed loading when a new command is launched by hotkey while another command is open

## 1.31.0 - 2022-03-23

* **Detail Metadata**: we've added a new property `metadata` to the `Detail` component; this allows you to add structured metadata that is displayed on the right side in a detail view (similar to the Linear, Asana or Jira extensions). We support types such as labels, coloured tags, links, and separators. ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #219](https://github.com/raycast/extensions/issues/219))
* **List Accessories**: list components can now show multiple accessory items through the new `accessories` property. (Previously you could only configure one `accessoryTitle` and `accesoryIcon`, both of which continue to work but have been marked deprecated.) Each item can be configured as text-only, icon-only, or icon + text. ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #72](https://github.com/raycast/extensions/issues/72))
* **List Empty View**: list components can define a new `EmptyView` that gives you control over the icon, title, description and optional actions to use when there are no items in a list. (Previously we would default to a "No results" view.) You can use the component to show a custom image and text when the search does not return results or the user is required to first perform some setup. ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #447](https://github.com/raycast/extensions/issues/447))

* **Environment**: the current theme (`"dark" | "light"`) configured via Raycast appearance preferences is now globally accessible through `environment.theme`
* **SVG**: You can now specify width and height attributes for images in markdown (`<img>` tag).
* **Dev Tools:** the "Create Extension" command lets you add categories to your extension; the categories are displayed alongside the new metadata on our revamped details page in the store.
* **Dev Tools**: added a new development action to clear the local assets cache, e.g. to render an updated list icon without having to restart Raycast. ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #1095](https://github.com/raycast/extensions/issues/1095))
* **Preferences**: the `required` property in manifest preferences is now optional.

* Fixed the extension icon not being updated during development.
* Fixed an extension's cached icon not being cleared when updated from the store. (Note that other dynamically loaded images in the assets folder may still be cached, so if you want to enforce an update for end users you need to rename them.)
* Fixed an edge case where some search bar characters would be wrongly passed to pushed lists in a navigation stack.

## 1.30.2 - 2022-03-11

* Fixed updating the list `isShowingDetail` property
* Fixed unnecessarily reloading the list detail view on search term changes

## 1.30.0 - 2022-03-09

* We've added the highly requested **search bar dropdown** 🎉 ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #72](https://github.com/raycast/extensions/issues/72)): you can now add a dropdown component as an accessory to the search bar; the dropdown shows up in the top-right corner and can be used for filtering lists and toggling list states. (So it's a good time to remove any workarounds with actions or navigation for showing a different set of items in the list.)
* The **search bar text** 🔎 can now be programmatically updated ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #281](https://github.com/raycast/extensions/issues/281)) while you can still opt into built-in filtering at the same time
* **List-detail views**: list views now support a `detail` property that allows you to display a detail view on the right-hand side of list items ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #83](https://github.com/raycast/extensions/issues/83)) 👯‍♂️; you can use the feature to display additional content side-by-side as users scroll through the list
* Support for rendering **SVG files** 🖼️ where images are accepted ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #77](https://github.com/raycast/extensions/issues/77)), including in the `Detail` view's markdown
* New method `Clipboard.readText()` to read the last copied text from the system's clipboard 📋
* Added a new prop `type` to `Form.DatePicker` 📅 to control the date components asked from the user

* **Toast action handlers** 🍞 can now still be called if the toast outlives a dismissed extension
* Support for multiple actions of type `Action.SubmitForm` in a form's Action Panel

* Fixed some flickering that could happen when using `React.memo`
* Fixed a few edge cases around Action Panels
* Fixed duplicated shortcut shown in the Action Panel's tooltip when setting the default shortcut explicitly on the primary action
* Fixed updating a `Form.Description` component

## 1.29.0 - 2022-02-23

* Add 2 new Actions: `Action.CreateSnippet` and `Action.CreateQuicklink`. Use them in your extensions to provide users an option to integrate deeper with Raycast, for example, by creating a Quicklink from a frequently visited website.

* Various documentation fixes and improvements such as new media for UI components.
* Synchronous React state update calls are now batched, leading to less re-rendering.
* Markdown comments will now be hidden in the `Detail` view

* Fixed a crash that could happen when switching between a development and store version of an extension or restarting the Node connection.
* Fixed an issue with React Developer Tools sometimes not getting opened.
* Limit the width that the `ActionPanel` can take.

## 1.28.0 - 2022-02-09

* Completely **revised (backwards-compatible) API** - new namespaces, better organisation, more consistency, updated templates, revamped docs. Check out the full [migration guide](https://developers.raycast.com/migration/v1.28.0) and get rid of those deprecation warnings. (At the same time, don't worry, your extension is going to work as before, even if you don't take immediate action.)
* We've **prettified the CLI output** 💅: all output is now more colourful, cleaner and easier to parse. Update the npm package to v1.28.0 to get the latest CLI for development.
* **Fallback images**: You can now specify local asset files or built-in icons that are displayed when image loading fails, for example when a remote file is missing (![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)[Issue #108](https://github.com/raycast/extensions/issues/108)); [see the docs](https://developers.raycast.com/api-reference/user-interface/icons-and-images)
* **Toasts** are now passed as argument to their action callback, so you can directly act on them in the handler function (for example, hiding them)
* **Extensions feedback:** We've added **better bug report and feature request actions** both to the store details page of an extension and to the error screen; the actions prefill some data already in the templates so that reporting issues and feature requests becomes easier for end users.

* Fixed tag picker images and emojis not being properly displayed (![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)[Issue #493](https://github.com/raycast/extensions/issues/493))

## 1.27.1 - 2022-01-28

* **Preferences:** Added a new app picker preference type - useful if you want to let users customize their apps to use for opening files, folders and URLs [![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #98](https://github.com/raycast/extensions/issues/98)
* **Forms:** Added new `Form.PasswordField` that allows you to show secure text fields ([Issue #319](https://github.com/raycast/extensions/issues/319) and [![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #44](https://github.com/raycast/extensions/issues/44))
* **Forms:** Added new `Form.Description` component that allows you to show a simple label
* Added a new top-level `open` method that gives you more flexibility for opening files, folders, and URLs with default apps or specified apps, often making using an external npm package unnecessary (the built-in open action use our method under the hood)
* **Node:** added security enhancements for the managed Node runtime such as verification of the executable, configuring executable permissions, and removing unnecessary files
* **CLI:** Added more error info output to build errors
* **CLI:** Added a new `—fix` flag to the `lint` command (applies ESLint and prettier fixes)
* **Create Extension Command:** Updated the templates to include a `fix-lint` script; added prettier to devDependencies

* **Forms:** Fixed `onChange` callback behaviour to be consistent across all components
* **Forms:** Fixed generic updates of titles for all components ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #687](https://github.com/raycast/extensions/issues/687))
* **Preferences:** Fixed a bug in dropdown preferences returning the defined default value, even if the default is not part of the list values
* **Preferences:** Fixed the `data` property not being treated as required for the dropdown
* **Preferences:** Fixed defined initial values not being ignored (use default only)
* **List:** Fixed same-rank items with identical names being non-deterministically ordered
* Fixed a bug with open actions causing double opening via the default and specified app
* **CLI:** Removed auto-installation of npm dependencies through the downloaded npm

## 1.27.0 - 2022-01-12

* **Developer Tools:** Added `Open Support Directory` action to local dev extensions
* **Developer Tools**: Removed auto-injecting of globals for enabling React Developer Tools in dev mode
* **Developer Tools**: Added `prettier` checks to CLI `lint` command
* **Documentation:** Updates and fixes

* **Forms:** Fixed controlled updates for the `Form.TagPicker`
* **Navigation**: Fixed a bug where a programmatic pop, followed by a manual pop (e.g. ESC) could lead to wrong state (![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)[Issue #571](https://github.com/raycast/extensions/issues/571))

## 1.26.3 - 2021-12-16

* New API for **Alert** views: Alerts are useful for destructive actions or actions that require user confirmation; new methods let you display our beautiful native Alert component\
  ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #48](https://github.com/raycast/extensions/issues/48))
* New API for **interactive Toasts**: you can now add buttons to Toasts, e.g. to give the user options for created items, to open the browser, or for any other relevant context ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #438](https://github.com/raycast/extensions/issues/438))
* New API for retrieving the current **Finder selection**: unlocks a couple of use cases for extensions that perform actions on selected files and folders ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #153](https://github.com/raycast/extensions/issues/153))

* Improved ranking for fuzzy search in lists with sections and keywords
* The icon of the `OpenWithAction` can now be customised
* The env var NODE\_EXTRA\_CA\_CERTS is now being propagated so that custom certificates can be configured
* Improved the CLI error message when an entry point file from the manifest is missing ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #495](https://github.com/raycast/extensions/issues/495))

* Textfields do not auto-transform certain characters such as dashes any more ([![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #491](https://github.com/raycast/extensions/issues/491) and [![](https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fexternal_integrations%2Fgithub-icon.png?width=12\&userId=\&cache=v2)Issue #360](https://github.com/raycast/extensions/issues/360))

* This CLI of this version contains an update of the build tool with changed (and "more compatible") heuristics around how `default` exports are handled. This means that you should double check whether `import` statements for certain npm packages need to be adjusted.\
  **Example**: `import caniuse from "caniuse-api"` has to be changed to `import * as caniuse from "caniuse-api"` because of the missing `default` export of the built `caniuse` library that has to run in a Node environment.

## 1.25.7 - 2021-11-26

* Keywords added to list items are now matched again by prefixes (exact matches were required previously)
* Extensions are now checked for version compatibility before updating and installation
* New and updated templates available in the "Create Extension" scaffolding command

* Modifications to list item keywords could result in wrong list filtering
* Fixed a regression where the CLI would not automatically install dependencies when building the extension
* DatePicker form element now returns the time component when specified
* Animated toasts are now automatically dismissed when the extension is unloaded
* Forms don't accidentally trigger draft creation mode any more
* Extensions which are off by default are now correctly disabled

## 1.25.5 - 2021-11-18

* Full fuzzy search by default for lists using built-in filtering
* Faster list loading times
* Better default auto-layout of list item title, subtitle and accessories
* Extension support directory does not need to be explicitly created any more
* Raycast is no longer automatically brought to the foreground for failure toasts
* New default action to open a bug report on production error screens in extensions

* Updated extension icons are now displayed without having to re-install the dev extension
* Focus is now kept on the current form element when re-rendering
* Caret does not jump to the end of the string in controlled textfields and textareas any more (one edge left that is going to be tackled in one of the next releases)
* "Disable pop to root search" developer preference is now only applied for commands that are under active development
* Documentation fixes and updates

## 1.25.4 - 2021-11-11

* Updating of items and submenus while the action panel is open
* Supporting all convenience actions with primary shortcut (cmd + enter) on form views
* Better error handling when the API cannot be loaded after failed app updates

* Loading indicator in detail views when used in a navigation stack

## 1.25.2 - 2021-10-28

* Improved ActionPanel updating performance

* `searchBarPlaceholder` updates when using the list in a navigation stack
* Wrong action panel actions when popping back in a navigation stack
* Empty state flickering when updating the `isLoading` property in lists
* Accessory and subtitle label truncation in lists
* Icon from assets tinting on dynamic theme changes
* Dynamic removal of form elements
* Open actions leading to Node env vars being set for the opened application
* Some extensions not getting loaded for a particular Node setup
* Local storage values being lost when extensions are automatically updated

## 1.25.1 - 2021-10-20

* Fixed configuring `tintColor` for icons in `ActionPanel` and `Form.Dropdown`
* Fixed displaying submenu icons from local assets
* Fixed tinting of icons provided from local assets
* Fixed a crash with the `getSelectedText` function
* Fixed the main window sometimes not shown when an error is thrown from a command
* Fixed the `OpenWithAction` not working for some apps
* Fixed the list empty state not being shown in certain cases when using custom filtering
* Fixed the the topmost item not automatically being selected for custom list filtering
* Fixed the line number info in error stack traces sometimes not being correct
* Fixed an issue where installing store extension would sometimes fail
* Fixed a crash that could be caused by sending invalid codepoints from an extension
* Fixed a bug where no error would be shown when the runtime download failed
* Fixed reaching the max. call stack size when logging recursive object structures (this could happen when you console logged a React component, for example).

## 1.25.0 - 2021-10-13

It's happening! We're opening up our API and store for public beta.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6de7d7ba17dddccdb8afa568bde72d292a5e2920%2Fchangelog-hello-world.webp?alt=media)

This is a big milestone for our community. We couldn't have pulled it off without our alpha testers. A massive shoutout to everybody who helped us shape the API. Now let's start building. We can't wait to see what you will come up with.

**Examples:**

Example 1 (js):
```js
{
  macOS: { modifiers: ["cmd", "shift"], key: "c" },
  Windows: { modifiers: ["ctrl", "shift"], key: "c" },
}
```

Example 2 (json):
```json
"default": {
  "macOS": "foo",
  "Windows": "bar"
}
```

---

## useFetch

**URL:** llms-txt#usefetch

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Argument dependent on List search text
- Mutation and Optimistic Updates
- Pagination
  - Full Example
- Types
  - AsyncState

Hook which fetches the URL and returns the [AsyncState](#asyncstate) corresponding to the execution of the fetch.

It follows the `stale-while-revalidate` cache invalidation strategy popularized by [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861). `useFetch` first returns the data from cache (stale), then sends the request (revalidate), and finally comes with the up-to-date data again.

The last value will be kept between command runs.

* `url` is the string representation of the URL to fetch.

* `options` extends [`RequestInit`](https://github.com/nodejs/undici/blob/v5.7.0/types/fetch.d.ts#L103-L117) allowing you to specify a body, headers, etc. to apply to the request.
* `options.parseResponse` is a function that accepts the Response as an argument and returns the data the hook will return. By default, the hook will return `response.json()` if the response has a JSON `Content-Type` header or `response.text()` otherwise.
* `options.mapResult` is an optional function that accepts whatever `options.parseResponse` returns as an argument, processes the response, and returns an object wrapping the result, i.e. `(response) => { return { data: response> } };`.

Including the [useCachedPromise](https://developers.raycast.com/utilities/react-hooks/usecachedpromise)'s options:

* `options.keepPreviousData` is a boolean to tell the hook to keep the previous results instead of returning the initial value if there aren't any in the cache for the new arguments. This is particularly useful when used for data for a List to avoid flickering. See [Argument dependent on List search text](#argument-dependent-on-list-search-text) for more information.

Including the [useCachedState](https://developers.raycast.com/utilities/react-hooks/usecachedstate)'s options:

* `options.initialData` is the initial value of the state if there aren't any in the Cache yet.

Including the [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise)'s options:

* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the fetch as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `revalidate` is a method to manually call the function with the same arguments again.
* `mutate` is a method to wrap an asynchronous update and gives some control over how the `useFetch`'s data should be updated while the update is going through. By default, the data will be revalidated (eg. the function will be called again) after the update is done. See [Mutation and Optimistic Updates](#mutation-and-optimistic-updates) for more information.

## Argument dependent on List search text

By default, when an argument passed to the hook changes, the function will be executed again and the cache's value for those arguments will be returned immediately. This means that in the case of new arguments that haven't been used yet, the initial data will be returned.

This behaviour can cause some flickering (initial data -> fetched data -> arguments change -> initial data -> fetched data, etc.). To avoid that, we can set `keepPreviousData` to `true` and the hook will keep the latest fetched data if the cache is empty for the new arguments (initial data -> fetched data -> arguments change -> fetched data).

## Mutation and Optimistic Updates

In an optimistic update, the UI behaves as though a change was successfully completed before receiving confirmation from the server that it was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

You can specify an `optimisticUpdate` function to mutate the data in order to reflect the change introduced by the asynchronous update.

When doing so, you can specify a `rollbackOnError` function to mutate back the data if the asynchronous update fails. If not specified, the data will be automatically rolled back to its previous value (before the optimistic update).

{% hint style="info" %}
When paginating, the hook will only cache the result of the first page.
{% endhint %}

The hook has built-in support for pagination. In order to enable pagination, `url`s type needs to change from `RequestInfo` to a function that receives a [PaginationOptions](#paginationoptions) argument, and returns a `RequestInfo`.

In practice, this means going from

or, if your data source uses cursor-based pagination, you can return a `cursor` alongside `data` and `hasMore`, and the cursor will be passed as an argument the next time the function gets called:

You'll notice that, in the second case, the hook returns an additional item: `pagination`. This can be passed to Raycast's `List` or `Grid` components in order to enable pagination. Another thing to notice is that `mapResult`, which is normally optional, is actually required when using pagination. Furthermore, its return type is

Every time the URL is fetched, the hook needs to figure out if it should paginate further, or if it should stop, and it uses the `hasMore` for this. In addition to this, the hook also needs `data`, and needs it to be an array, because internally it appends it to a list, thus making sure the `data` that the hook *returns* always contains the data for all of the pages that have been fetched so far.

An object corresponding to the execution state of the function.

A method to wrap an asynchronous update and gives some control about how the `useFetch`'s data should be updated while the update is going through.

### PaginationOptions

An object passed to a `PaginatedRequestInfo`, it has two properties:

* `page`: 0-indexed, this it's incremented every time the promise resolves, and is reset whenever `revalidate()` is called.
* `lastItem`: this is a copy of the last item in the `data` array from the last time the promise was executed. Provided for APIs that implement cursor-based pagination.
* `cursor`: this is the `cursor` property returned after the previous execution of `PaginatedPromise`. Useful when working with APIs that provide the next cursor explicitly.

**Examples:**

Example 1 (ts):
```ts
export function useFetch<V, U, T = V>(
  url: RequestInfo,
  options?: RequestInit & {
    parseResponse?: (response: Response) => Promise<V>;
    mapResult?: (result: V) => { data: T };
    initialData?: U;
    keepPreviousData?: boolean;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: T) => void;
    onWillExecute?: (args: [string, RequestInit]) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  },
): AsyncState<T> & {
  revalidate: () => void;
  mutate: MutatePromise<T | U | undefined>;
};
```

Example 2 (tsx):
```tsx
import { Detail, ActionPanel, Action } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const { isLoading, data, revalidate } = useFetch("https://api.example");

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
import { useState } from "react";
import { List, ActionPanel, Action } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data } = useFetch(`https://api.example?q=${searchText}`, {
    // to make sure the screen isn't flickering when the searchText changes
    keepPreviousData: true,
  });

  return (
    <List isLoading={isLoading} searchText={searchText} onSearchTextChange={setSearchText} throttle>
      {(data || []).map((item) => (
        <List.Item key={item.id} title={item.title} />
      ))}
    </List>
  );
}
```

Example 4 (tsx):
```tsx
import { Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const { isLoading, data, mutate } = useFetch("https://api.example");

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

---

## useCachedPromise

**URL:** llms-txt#usecachedpromise

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Promise Argument dependent on List search text
- Mutation and Optimistic Updates
- Pagination
  - Full Example
- Types
  - AsyncState

Hook which wraps an asynchronous function or a function that returns a Promise and returns the [AsyncState](#asyncstate) corresponding to the execution of the function.

It follows the `stale-while-revalidate` cache invalidation strategy popularized by [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861). `useCachedPromise` first returns the data from cache (stale), then executes the promise (revalidate), and finally comes with the up-to-date data again.

The last value will be kept between command runs.

{% hint style="info" %}
The value needs to be JSON serializable.\
The function is assumed to be constant (eg. changing it won't trigger a revalidation).
{% endhint %}

* `fn` is an asynchronous function or a function that returns a Promise.
* `args` is the array of arguments to pass to the function. Every time they change, the function will be executed again. You can omit the array if the function doesn't require any argument.

* `options.keepPreviousData` is a boolean to tell the hook to keep the previous results instead of returning the initial value if there aren't any in the cache for the new arguments. This is particularly useful when used for data for a List to avoid flickering. See [Promise Argument dependent on List search text](#promise-argument-dependent-on-list-search-text) for more information.

Including the [useCachedState](https://developers.raycast.com/utilities/react-hooks/usecachedstate)'s options:

* `options.initialData` is the initial value of the state if there aren't any in the Cache yet.

Including the [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise)'s options:

* `options.abortable` is a reference to an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel a previous call when triggering a new one.
* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the function as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `revalidate` is a method to manually call the function with the same arguments again.
* `mutate` is a method to wrap an asynchronous update and gives some control over how the `useCachedPromise`'s data should be updated while the update is going through. By default, the data will be revalidated (eg. the function will be called again) after the update is done. See [Mutation and Optimistic Updates](#mutation-and-optimistic-updates) for more information.

## Promise Argument dependent on List search text

By default, when an argument passed to the hook changes, the function will be executed again and the cache's value for those arguments will be returned immediately. This means that in the case of new arguments that haven't been used yet, the initial data will be returned.

This behaviour can cause some flickering (initial data -> fetched data -> arguments change -> initial data -> fetched data, etc.). To avoid that, we can set `keepPreviousData` to `true` and the hook will keep the latest fetched data if the cache is empty for the new arguments (initial data -> fetched data -> arguments change -> fetched data).

## Mutation and Optimistic Updates

In an optimistic update, the UI behaves as though a change was successfully completed before receiving confirmation from the server that it was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

You can specify an `optimisticUpdate` function to mutate the data in order to reflect the change introduced by the asynchronous update.

When doing so, you can specify a `rollbackOnError` function to mutate back the data if the asynchronous update fails. If not specified, the data will be automatically rolled back to its previous value (before the optimistic update).

{% hint style="info" %}
When paginating, the hook will only cache the result of the first page.
{% endhint %}

The hook has built-in support for pagination. In order to enable pagination, `fn`'s type needs to change from

> an asynchronous function or a function that returns a Promise

> a function that returns an asynchronous function or a function that returns a Promise

In practice, this means going from

or, if your data source uses cursor-based pagination, you can return a `cursor` alongside `data` and `hasMore`, and the cursor will be passed as an argument the next time the function gets called:

You'll notice that, in the second case, the hook returns an additional item: `pagination`. This can be passed to Raycast's `List` or `Grid` components in order to enable pagination.\
Another thing to notice is that the async function receives a [PaginationOptions](#paginationoptions) argument, and returns a specific data format:

Every time the promise resolves, the hook needs to figure out if it should paginate further, or if it should stop, and it uses `hasMore` for this.\
In addition to this, the hook also needs `data`, and needs it to be an array, because internally it appends it to a list, thus making sure the `data` that the hook *returns* always contains the data for all of the pages that have been loaded so far.

An object corresponding to the execution state of the function.

A method to wrap an asynchronous update and gives some control about how the `useCachedPromise`'s data should be updated while the update is going through.

### PaginationOptions

An object passed to a `PaginatedPromise`, it has two properties:

* `page`: 0-indexed, this it's incremented every time the promise resolves, and is reset whenever `revalidate()` is called.
* `lastItem`: this is a copy of the last item in the `data` array from the last time the promise was executed. Provided for APIs that implement cursor-based pagination.
* `cursor`: this is the `cursor` property returned after the previous execution of `PaginatedPromise`. Useful when working with APIs that provide the next cursor explicitly.

**Examples:**

Example 1 (ts):
```ts
type Result<T> = `type of the returned value of the returned Promise`;

function useCachedPromise<T, U>(
  fn: T,
  args?: Parameters<T>,
  options?: {
    initialData?: U;
    keepPreviousData?: boolean;
    abortable?: RefObject<AbortController | null | undefined>;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: Result<T>) => void;
    onWillExecute?: (args: Parameters<T>) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  },
): AsyncState<Result<T>> & {
  revalidate: () => void;
  mutate: MutatePromise<Result<T> | U>;
};
```

Example 2 (tsx):
```tsx
import { Detail, ActionPanel, Action } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

export default function Command() {
  const abortable = useRef<AbortController>();
  const { isLoading, data, revalidate } = useCachedPromise(
    async (url: string) => {
      const response = await fetch(url, { signal: abortable.current?.signal });
      const result = await response.text();
      return result;
    },
    ["https://api.example"],
    {
      initialData: "Some Text",
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
import { useState } from "react";
import { List, ActionPanel, Action } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data } = useCachedPromise(
    async (url: string) => {
      const response = await fetch(url);
      const result = await response.json();
      return result;
    },
    [`https://api.example?q=${searchText}`],
    {
      // to make sure the screen isn't flickering when the searchText changes
      keepPreviousData: true,
    },
  );

  return (
    <List isLoading={isLoading} searchText={searchText} onSearchTextChange={setSearchText} throttle>
      {(data || []).map((item) => (
        <List.Item key={item.id} title={item.title} />
      ))}
    </List>
  );
}
```

Example 4 (tsx):
```tsx
import { Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

export default function Command() {
  const { isLoading, data, mutate } = useCachedPromise(
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

---

## Action Panel

**URL:** llms-txt#action-panel

**Contents:**
- API Reference
  - ActionPanel
  - ActionPanel.Section
  - ActionPanel.Submenu
- Types
  - ActionPanel.Children
  - ActionPanel.Section.Children
  - ActionPanel.Submenu.Children

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-25a03b5271959426230e724a733f30e7597dd1bf%2Faction-panel.webp?alt=media)

Exposes a list of [actions](https://developers.raycast.com/api-reference/user-interface/actions) that can be performed by the user.

Often items are context-aware, e.g., based on the selected list item. Actions can be grouped into semantic\
sections and can have keyboard shortcuts assigned.

The first and second action become the primary and secondary action. They automatically get the default keyboard shortcuts assigned.\
In [List](https://developers.raycast.com/api-reference/user-interface/list), [Grid](https://developers.raycast.com/api-reference/user-interface/grid), and [Detail](https://developers.raycast.com/api-reference/user-interface/detail), this is `↵` for the primary and `⌘` `↵` for the secondary action. In [Form](https://developers.raycast.com/api-reference/user-interface/form) it's `⌘` `↵` for the primary and `⌘` `⇧` `↵` for the secondary.\
Keep in mind that while you can specify an alternative shortcut for the primary and secondary actions, it won't be displayed in the Action Panel.

| Prop     | Description                                                                                        | Type                                            | Default |
| -------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------- |
| children | Sections or Actions. If Action elements are specified, a default section is automatically created. | [`ActionPanel.Children`](#actionpanel.children) | -       |
| title    | The title displayed at the top of the panel                                                        | `string`                                        | -       |

### ActionPanel.Section

A group of visually separated items.

Use sections when the [ActionPanel](#actionpanel) contains a lot of actions to help guide the user to related actions.\
For example, create a section for all copy actions.

| Prop     | Description                       | Type                                                            | Default |
| -------- | --------------------------------- | --------------------------------------------------------------- | ------- |
| children | The item elements of the section. | [`ActionPanel.Section.Children`](#actionpanel.section.children) | -       |
| title    | Title displayed above the section | `string`                                                        | -       |

### ActionPanel.Submenu

A very specific action that replaces the current [ActionPanel](#actionpanel) with its children when selected.

This is handy when an action needs to select from a range of options. For example, to add a label to a GitHub pull request or an assignee to a todo.

| Prop                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                                                                               | Default |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The title displayed for submenu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `string`                                                                                           | -       |
| autoFocus                               | Indicates whether the ActionPanel.Submenu should be focused automatically when the parent ActionPanel (or Actionpanel.Submenu) opens.                                                                                                                                                                                                                                                                                                                                                               | `boolean`                                                                                          | -       |
| children                                | Items of the submenu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | [`ActionPanel.Submenu.Children`](#actionpanel.submenu.children)                                    | -       |
| filtering                               | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter the items. When `false`, the extension needs to take care of the filtering. You can further define how native filtering orders sections by setting an object with a `keepSectionOrder` property: When `true`, ensures that Raycast filtering maintains the section order as defined in the extension. When `false`, filtering may change the section order depending on the ranking values of items. | `boolean` or `{ keepSectionOrder: boolean }`                                                       | -       |
| icon                                    | The icon displayed for the submenu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| isLoading                               | Indicates whether a loading indicator should be shown or hidden next to the search bar                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                          | -       |
| onOpen                                  | Callback that is triggered when the Submenu is opened. This callback can be used to fetch its content lazily: `js function LazySubmenu() { const [content, setContent] = useState(null) return ( <ActionPanel.Submenu onOpen={() => fetchSubmenuContent().then(setContent)}> {content} </ActionPanel.Submenu> ) }`                                                                                                                                                                                  | `() => void`                                                                                       | -       |
| onSearchTextChange                      | Callback triggered when the search bar text changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `(text: string) => void`                                                                           | -       |
| shortcut                                | The keyboard shortcut for the submenu.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| throttle                                | Defines whether the `onSearchTextChange` handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests).                                                                                                                                                                                                                                          | `boolean`                                                                                          | -       |

### ActionPanel.Children

Supported children for the [ActionPanel](#actionpanel) component.

### ActionPanel.Section.Children

Supported children for the [ActionPanel.Section](#actionpanel.section) component.

### ActionPanel.Submenu.Children

Supported children for the [ActionPanel.Submenu](#actionpanel.submenu) component.

**Examples:**

Example 1 (typescript):
```typescript
import { ActionPanel, Action, List } from "@raycast/api";

export default function Command() {
  return (
    <List navigationTitle="Open Pull Requests">
      <List.Item
        title="Docs: Update API Reference"
        subtitle="#1"
        actions={
          <ActionPanel title="#1 in raycast/extensions">
            <Action.OpenInBrowser url="https://github.com/raycast/extensions/pull/1" />
            <Action.CopyToClipboard
              title="Copy Pull Request URL"
              content="https://github.com/raycast/extensions/pull/1"
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

Example 2 (typescript):
```typescript
import { ActionPanel, Action, List } from "@raycast/api";

export default function Command() {
  return (
    <List navigationTitle="Open Pull Requests">
      <List.Item
        title="Docs: Update API Reference"
        subtitle="#1"
        actions={
          <ActionPanel title="#1 in raycast/extensions">
            <ActionPanel.Section title="Copy">
              <Action.CopyToClipboard title="Copy Pull Request Number" content="#1" />
              <Action.CopyToClipboard
                title="Copy Pull Request URL"
                content="https://github.com/raycast/extensions/pull/1"
              />
              <Action.CopyToClipboard title="Copy Pull Request Title" content="Docs: Update API Reference" />
            </ActionPanel.Section>
            <ActionPanel.Section title="Danger zone">
              <Action title="Close Pull Request" onAction={() => console.log("Close PR #1")} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    </List>
  );
}
```

Example 3 (typescript):
```typescript
import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";

export default function Command() {
  return (
    <List navigationTitle="Open Pull Requests">
      <List.Item
        title="Docs: Update API Reference"
        subtitle="#1"
        actions={
          <ActionPanel title="#1 in raycast/extensions">
            <ActionPanel.Submenu title="Add Label">
              <Action
                icon={{ source: Icon.Circle, tintColor: Color.Red }}
                title="Bug"
                onAction={() => console.log("Add bug label")}
              />
              <Action
                icon={{ source: Icon.Circle, tintColor: Color.Yellow }}
                title="Enhancement"
                onAction={() => console.log("Add enhancement label")}
              />
              <Action
                icon={{ source: Icon.Circle, tintColor: Color.Blue }}
                title="Help Wanted"
                onAction={() => console.log("Add help wanted label")}
              />
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
    </List>
  );
}
```

Example 4 (typescript):
```typescript
ActionPanel.Children: ActionPanel.Section | ActionPanel.Section[] | ActionPanel.Section.Children | null
```

---

## VS Code (community tool)

**URL:** llms-txt#vs-code-(community-tool)

You can enhance your VS Code development experience by installing the [Raycast extension in the marketplace](https://marketplace.visualstudio.com/items?itemName=tonka3000.raycast). Here's a list of features provided by the extension:

* IntelliSense for image assets
* A tree view for easier navigation (commands and preferences)
* VS Code commands for creating new commands and preferences
* The possibility to attach a Node.js debugger
* VS Code commands for `ray` operations like `build`, `dev`, `lint`, or `fix-lint`

---

## Best Practices

**URL:** llms-txt#best-practices

**Contents:**
- General
  - Handle errors
  - Handle runtime dependencies
  - Show loading indicator
- Forms
  - Use Forms Validation

Tips to guarantee a good user experience for your extensions.

Network requests can fail, permissions to files can be missing… More generally, errors happen. By default, we handle every unhandled exception or unresolved Promise and show error screens. However, you should handle the "expected" error cases for your command. You should aim not to disrupt the user's flow just because something went wrong. For example, if a network request fails but you can read the cache, show the cache. A user might not need the fresh data straight away. In most cases, it's best to show a `Toast` with information about the error.

Here is an example of how to show a toast for an error:

### Handle runtime dependencies

Ideally, your extension doesn't depend on any runtime dependencies. In reality, sometimes locally installed apps or CLIs are required to perform functionality. Here are a few tips to guarantee a good user experience:

* If a command requires a runtime dependency to run (e.g. an app that needs to be installed by the user), show a helpful message.
  * If your extension is tightly coupled to an app, f.e. searching tabs in Safari or using AppleScript to control Spotify, checks don't always have to be strict because users most likely don't install the extension without having the dependency installed locally.
* If only some functionality of your extension requires the runtime dependency, consider making this functionality only available if the dependency is installed. Typically, this is the best case for [actions](https://developers.raycast.com/terminology#action), e.g. to open a URL in the desktop app instead of the browser.

### Show loading indicator

When commands need to load big data sets, it's best to inform the user about this. To keep your command snappy, it's important to render a React component as quickly as possible.

You can start with an empty list or a static form and then load the data to fill the view. To make the user aware of the loading process, you can use the `isLoading` prop on all top-level components, e.g. [`<Detail>`](https://developers.raycast.com/api-reference/user-interface/detail), [`<Form>`](https://developers.raycast.com/api-reference/user-interface/form), [`<Grid>`](https://developers.raycast.com/api-reference/user-interface/grid), or [`<List>`](https://developers.raycast.com/api-reference/user-interface/list).

Here is an example to show the loading indicator in a list:

### Use Forms Validation

Before submitting data, it is important to ensure all required form controls are filled out, in the correct format.

In Raycast, validation can be fully controlled from the API. To keep the same behavior as we have natively, the proper way of usage is to validate a `value` in the `onBlur` callback, update the `error` of the item and keep track of updates with the `onChange` callback to drop the `error` value. The [useForm](https://developers.raycast.com/utilities/react-hooks/useform) utils hook nicely wraps this behavior and is the recommended way to do deal with validations.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-06326f9b2b6de5d39b9c8aa37e677b23c122f26e%2Fform-validation.webp?alt=media)

{% hint style="info" %}
Keep in mind that if the Form has any errors, the [`Action.SubmitForm`](https://developers.raycast.com/api-reference/user-interface/actions#action.submitform) `onSubmit` callback won't be triggered.
{% endhint %}

{% tabs %}
{% tab title="FormValidationWithUtils.tsx" %}

{% tab title="FormValidationWithoutUtils.tsx" %}

{% endtab %}
{% endtabs %}

**Examples:**

Example 1 (typescript):
```typescript
import { Detail, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setTimeout(() => {
      setError(new Error("Booom 💥"));
    }, 1000);
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
        message: error.message,
      });
    }
  }, [error]);

  return <Detail markdown="Example for proper error handling" />;
}
```

Example 2 (typescript):
```typescript
import { List } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [items, setItems] = useState<string[]>();

  useEffect(() => {
    setTimeout(() => {
      setItems(["Item 1", "Item 2", "Item 3"]);
    }, 1000);
  }, []);

  return (
    <List isLoading={items === undefined}>
      {items?.map((item, index) => (
        <List.Item key={index} title={item} />
      ))}
    </List>
  );
}
```

Example 3 (tsx):
```tsx
import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

interface SignUpFormValues {
  name: string;
  password: string;
}

export default function Command() {
  const { handleSubmit, itemProps } = useForm<SignUpFormValues>({
    onSubmit(values) {
      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.name} account created`,
      });
    },
    validation: {
      name: FormValidation.Required,
      password: (value) => {
        if (value && value.length < 8) {
          return "Password must be at least 8 symbols";
        } else if (!value) {
          return "The item is required";
        }
      },
    },
  });
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Full Name" placeholder="Tim Cook" {...itemProps.name} />
      <Form.PasswordField title="New Password" {...itemProps.password} />
    </Form>
  );
}
```

Example 4 (typescript):
```typescript
import { Form } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [nameError, setNameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  function dropPasswordErrorIfNeeded() {
    if (passwordError && passwordError.length > 0) {
      setPasswordError(undefined);
    }
  }

  return (
    <Form>
      <Form.TextField
        id="nameField"
        title="Full Name"
        placeholder="Tim Cook"
        error={nameError}
        onChange={dropNameErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setNameError("The field should't be empty!");
          } else {
            dropNameErrorIfNeeded();
          }
        }}
      />
      <Form.PasswordField
        id="password"
        title="New Password"
        error={passwordError}
        onChange={dropPasswordErrorIfNeeded}
        onBlur={(event) => {
          const value = event.target.value;
          if (value && value.length > 0) {
            if (!validatePassword(value)) {
              setPasswordError("Password should be at least 8 characters!");
            } else {
              dropPasswordErrorIfNeeded();
            }
          } else {
            setPasswordError("The field should't be empty!");
          }
        }}
      />
      <Form.TextArea id="bioTextArea" title="Add Bio" placeholder="Describe who you are" />
      <Form.DatePicker id="birthDate" title="Date of Birth" />
    </Form>
  );
}

function validatePassword(value: string): boolean {
  return value.length >= 8;
}
```

---

## useExec

**URL:** llms-txt#useexec

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Argument dependent on user input
- Mutation and Optimistic Updates
- Types
  - AsyncState
  - MutatePromise
  - ParseExecOutputHandler

Hook that executes a command and returns the [AsyncState](#asyncstate) corresponding to the execution of the command.

It follows the `stale-while-revalidate` cache invalidation strategy popularized by [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861). `useExec` first returns the data from cache (stale), then executes the command (revalidate), and finally comes with the up-to-date data again.

The last value will be kept between command runs.

There are two ways to use the hook.

The first one should be preferred when executing a single file. The file and its arguments don't have to be escaped.

The second one can be used to execute more complex commands. The file and arguments are specified in a single `command` string. For example, `useExec('echo', ['Raycast'])` is the same as `useExec('echo Raycast')`.

If the file or an argument contains spaces, they must be escaped with backslashes. This matters especially if `command` is not a constant but a variable, for example with `environment.supportPath` or `process.cwd()`. Except for spaces, no escaping/quoting is needed.

The `shell` option must be used if the command uses shell-specific features (for example, `&&` or `||`), as opposed to being a simple file followed by its arguments.

* `file` is the path to the file to execute.
* `arguments` is an array of strings to pass as arguments to the file.

* `command` is the string to execute.

* `options.shell` is a boolean or a string to tell whether to run the command inside of a shell or not. If `true`, uses `/bin/sh`. A different shell can be specified as a string. The shell should understand the `-c` switch.

We recommend against using this option since it is:

* not cross-platform, encouraging shell-specific syntax.
  * slower, because of the additional shell interpretation.
  * unsafe, potentially allowing command injection.
* `options.stripFinalNewline` is a boolean to tell the hook to strip the final newline character from the output. By default, it will.
* `options.cwd` is a string to specify the current working directory of the child process. By default, it will be `process.cwd()`.
* `options.env` is a key-value pairs to set as the environment of the child process. It will extend automatically from `process.env`.
* `options.encoding` is a string to specify the character encoding used to decode the `stdout` and `stderr` output. If set to `"buffer"`, then `stdout` and `stderr` will be a `Buffer` instead of a string.
* `options.input` is a string or a Buffer to write to the `stdin` of the file.
* `options.timeout` is a number. If greater than `0`, the parent will send the signal `SIGTERM` if the child runs longer than timeout milliseconds. By default, the execution will timeout after 10000ms (eg. 10s).
* `options.parseOutput` is a function that accepts the output of the child process as an argument and returns the data the hooks will return - see [ParseExecOutputHandler](#parseexecoutputhandler). By default, the hook will return `stdout`.

Including the [useCachedPromise](https://developers.raycast.com/utilities/react-hooks/usecachedpromise)'s options:

* `options.keepPreviousData` is a boolean to tell the hook to keep the previous results instead of returning the initial value if there aren't any in the cache for the new arguments. This is particularly useful when used for data for a List to avoid flickering. See [Argument dependent on user input](#argument-dependent-on-user-input) for more information.

Including the [useCachedState](https://developers.raycast.com/utilities/react-hooks/usecachedstate)'s options:

* `options.initialData` is the initial value of the state if there aren't any in the Cache yet.

Including the [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise)'s options:

* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the command as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `revalidate` is a method to manually call the function with the same arguments again.
* `mutate` is a method to wrap an asynchronous update and gives some control over how the `useFetch`'s data should be updated while the update is going through. By default, the data will be revalidated (eg. the function will be called again) after the update is done. See [Mutation and Optimistic Updates](#mutation-and-optimistic-updates) for more information.

## Argument dependent on user input

By default, when an argument passed to the hook changes, the function will be executed again and the cache's value for those arguments will be returned immediately. This means that in the case of new arguments that haven't been used yet, the initial data will be returned.

This behaviour can cause some flickering (initial data -> fetched data -> arguments change -> initial data -> fetched data, etc.). To avoid that, we can set `keepPreviousData` to `true` and the hook will keep the latest fetched data if the cache is empty for the new arguments (initial data -> fetched data -> arguments change -> fetched data).

{% hint style="info" %}
When passing a user input to a command, be very careful about using the `shell` option as it could be potentially dangerous.
{% endhint %}

## Mutation and Optimistic Updates

In an optimistic update, the UI behaves as though a change was successfully completed before receiving confirmation from the server that it was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

You can specify an `optimisticUpdate` function to mutate the data in order to reflect the change introduced by the asynchronous update.

When doing so, you can specify a `rollbackOnError` function to mutate back the data if the asynchronous update fails. If not specified, the data will be automatically rolled back to its previous value (before the optimistic update).

An object corresponding to the execution state of the function.

A method to wrap an asynchronous update and gives some control about how the `useFetch`'s data should be updated while the update is going through.

### ParseExecOutputHandler

A function that accepts the output of the child process as an argument and returns the data the hooks will return.

**Examples:**

Example 1 (ts):
```ts
function useExec<T, U>(
  file: string,
  arguments: string[],
  options?: {
    shell?: boolean | string;
    stripFinalNewline?: boolean;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    encoding?: BufferEncoding | "buffer";
    input?: string | Buffer;
    timeout?: number;
    parseOutput?: ParseExecOutputHandler<T>;
    initialData?: U;
    keepPreviousData?: boolean;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: T) => void;
    onWillExecute?: (args: string[]) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  }
): AsyncState<T> & {
  revalidate: () => void;
  mutate: MutatePromise<T | U | undefined>;
};
```

Example 2 (ts):
```ts
function useExec<T, U>(
  command: string,
  options?: {
    shell?: boolean | string;
    stripFinalNewline?: boolean;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    encoding?: BufferEncoding | "buffer";
    input?: string | Buffer;
    timeout?: number;
    parseOutput?: ParseExecOutputHandler<T>;
    initialData?: U;
    keepPreviousData?: boolean;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: T) => void;
    onWillExecute?: (args: string[]) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  }
): AsyncState<T> & {
  revalidate: () => void;
  mutate: MutatePromise<T | U | undefined>;
};
```

Example 3 (tsx):
```tsx
import { List } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { cpus } from "os";
import { useMemo } from "react";

const brewPath = cpus()[0].model.includes("Apple") ? "/opt/homebrew/bin/brew" : "/usr/local/bin/brew";

export default function Command() {
  const { isLoading, data } = useExec(brewPath, ["info", "--json=v2", "--installed"]);
  const results = useMemo<{ id: string; name: string }[]>(() => JSON.parse(data || "{}").formulae || [], [data]);

  return (
    <List isLoading={isLoading}>
      {results.map((item) => (
        <List.Item key={item.id} title={item.name} />
      ))}
    </List>
  );
}
```

Example 4 (tsx):
```tsx
import { useState } from "react";
import { Detail, ActionPanel, Action } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data } = useExec("brew", ["info", searchText]);

  return <Detail isLoading={isLoading} markdown={data} />;
}
```

---

## withCache

**URL:** llms-txt#withcache

**Contents:**
- Signature
  - Arguments
  - Return
- Example

Higher-order function which wraps a function with caching functionality using Raycast's Cache API. Allows for caching of expensive functions like paginated API calls that rarely change.

`options` is an object containing:

* `options.validate`: an optional function that receives the cached data and returns a boolean depending on whether the data is still valid or not.
* `options.maxAge`: Maximum age of cached data in milliseconds after which the data will be considered invalid

Returns the wrapped function

**Examples:**

Example 1 (tsx):
```tsx
function withCache<Fn extends (...args: any) => Promise<any>>(
  fn: Fn,
  options?: {
    validate?: (data: Awaited<ReturnType<Fn>>) => boolean;
    maxAge?: number;
  },
): Fn & { clearCache: () => void };
```

Example 2 (tsx):
```tsx
import { withCache } from "@raycast/utils";

function fetchExpensiveData(query) {
  // ...
}

const cachedFunction = withCache(fetchExpensiveData, {
  maxAge: 5 * 60 * 1000, // Cache for 5 minutes
});

const result = await cachedFunction(query);
```

---

## Raycast Window & Search Bar

**URL:** llms-txt#raycast-window-&-search-bar

**Contents:**
- API Reference
  - clearSearchBar
  - closeMainWindow
  - popToRoot
- Types
  - PopToRootType

Clear the text in the search bar.

| Name                     | Description                                                                                                       | Type      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- | --------- |
| options                  | Can be used to control the behaviour after the search bar is cleared.                                             | `Object`  |
| options.forceScrollToTop | Can be used to force scrolling to the top. Defaults to scrolling to the top after the the search bar was cleared. | `boolean` |

A Promise that resolves when the search bar is cleared.

Closes the main Raycast window.

You can use the `popToRootType` parameter to temporarily prevent Raycast from applying the user's "Pop to Root Search" preference in Raycast; for example, when you need to interact with an external system utility and then allow the user to return back to the view command:

| Name                    | Description                                                                                                                          | Type                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| options                 | Can be used to control the behaviour after closing the main window.                                                                  | `Object`                          |
| options.clearRootSearch | Clears the text in the root search bar and scrolls to the top                                                                        | `boolean`                         |
| options.popToRootType   | Defines the pop to root behavior (PopToRootType); the default is to to respect the user's "Pop to Root Search" preference in Raycast | [`PopToRootType`](#poptoroottype) |

A Promise that resolves when the main window is closed.

Pops the navigation stack back to root search.

| Name                   | Description                                                               | Type      |
| ---------------------- | ------------------------------------------------------------------------- | --------- |
| options                | Can be used to control the behaviour after going back to the root search. | `Object`  |
| options.clearSearchBar |                                                                           | `boolean` |

A Promise that resolves when Raycast popped to root.

Defines the pop to root behavior when the main window is closed.

#### Enumeration members

| Name      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| Default   | Respects the user's "Pop to Root Search" preference in Raycast |
| Immediate | Immediately pops back to root                                  |
| Suspended | Prevents Raycast from popping back to root                     |

**Examples:**

Example 1 (typescript):
```typescript
async function clearSearchBar(options?: { forceScrollToTop?: boolean }): Promise<void>;
```

Example 2 (typescript):
```typescript
async function closeMainWindow(options?: { clearRootSearch?: boolean; popToRootType?: PopToRootType }): Promise<void>;
```

Example 3 (typescript):
```typescript
import { closeMainWindow } from "@raycast/api";
import { setTimeout } from "timers/promises";

export default async function Command() {
  await setTimeout(1000);
  await closeMainWindow({ clearRootSearch: true });
}
```

Example 4 (typescript):
```typescript
import { closeMainWindow, PopToRootType } from "@raycast/api";

export default async () => {
  await closeMainWindow({ popToRootType: PopToRootType.Suspended });
};
```

---

## Terminology

**URL:** llms-txt#terminology

**Contents:**
- Action
- Action Panel
- AI Extensions
- Command
- Extension
- Manifest
- Tool

An explanation of various terms used in this documentation.

Actions are accessible via the [Action Panel](#action-panel) in a [command](#command). They are little functionality to control something; for example, to add a label to the selected GitHub issue, copy the link to a Linear issue, or anything else. Actions can have assigned keyboard shortcuts.

Action Panel is located on the bottom right and can be opened with `⌘` `K`. It contains all currently available [actions](#action) and makes them easily discoverable.

AI Extensions are simply regular [extensions](#extension) that have [tools](#tool). Once an extension has some tools, a user can `@mention` the extension in Quick AI, or the AI Commands, or the AI Chat. When doing so, the AI will have the opportunity to call one or multiple tools of the extensions mentioned.

Commands are a type of entry point for an extension. Commands are available in the root search of Raycast. They can be a simple script or lists, forms, and more complex UI.

Extensions add functionality to Raycast. They consist of one or many [commands](#command) and can be installed from the Store.

Manifest is the `package.json` file of an [extension](#extension). It's an npm package mixed with Raycast specific metadata. The latter is necessary to identify the package for Raycast and publish it to the Store.

Tools are a type of entry point for an extension. As opposed to a [command](#command), they don’t show up in the root search and the user can’t directly interact with them. Instead, they are functionalities that the AI can use to interact with an extension.

---

## OAuthService

**URL:** llms-txt#oauthservice

**Contents:**
- Example
- Signature
  - Methods
  - Built-in Services
- Types
  - OAuthServiceOptions
  - ProviderOptions
  - ProviderWithDefaultClientOptions

The `OAuthService` class is designed to abstract the OAuth authorization process using the PKCE (Proof Key for Code Exchange) flow, simplifying the integration with various OAuth providers such as Asana, GitHub, and others.

Use [OAuthServiceOptions](#oauthserviceoptions) to configure the `OAuthService` class.

Initiates the OAuth authorization process or refreshes existing tokens if necessary. Returns a promise that resolves with the access token from the authorization flow.

### Built-in Services

Some services are exposed as static properties in `OAuthService` to make it easy to authenticate with them:

* [Asana](#asana)
* [GitHub](#github)
* [Google](#google)
* [Jira](#jira)
* [Linear](#linear)
* [Slack](#slack)
* [Zoom](#zoom)

Asana, GitHub, Linear, and Slack already have an OAuth app configured by Raycast so that you can use them right of the box by specifing only the permission scopes. You are still free to create an OAuth app for them if you want.

Google, Jira and Zoom don't have an OAuth app configured by Raycast so you'll have to create one if you want to use them.

Use [ProviderOptions](#provideroptions) or [ProviderWithDefaultClientOptions](#providerwithdefaultclientoptions) to configure these built-in services.

Google has verification processes based on the required scopes for your extension. Therefore, you need to configure your own client for it.

{% hint style="info" %}
Creating your own Google client ID is more tedious than other processes, so we’ve created a page to assist you: [Getting a Google client ID](https://developers.raycast.com/utilities/oauth/getting-google-client-id)
{% endhint %}

Jira requires scopes to be enabled manually in the OAuth app settings. Therefore, you need to configure your own client for it.

Zoom requires scopes to be enabled manually in the OAuth app settings. Therefore, you need to configure your own client for it.

### OAuthServiceOptions

| Property Name                                  | Description                                                                                                                        | Type                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| client<mark style="color:red;">\*</mark>       | The PKCE Client defined using `OAuth.PKCEClient` from `@raycast/api`                                                               | `OAuth.PKCEClient`                           |
| clientId<mark style="color:red;">\*</mark>     | The app's client ID                                                                                                                | `string`                                     |
| scope<mark style="color:red;">\*</mark>        | The scope of the access requested from the provider                                                                                | `string` \| `Array<string>`                  |
| authorizeUrl<mark style="color:red;">\*</mark> | The URL to start the OAuth flow                                                                                                    | `string`                                     |
| tokenUrl<mark style="color:red;">\*</mark>     | The URL to exchange the authorization code for an access token                                                                     | `string`                                     |
| refreshTokenUrl                                | The URL to refresh the access token if applicable                                                                                  | `string`                                     |
| personalAccessToken                            | A personal token if the provider supports it                                                                                       | `string`                                     |
| onAuthorize                                    | A callback function that is called once the user has been properly logged in through OAuth when used with `withAccessToken`        | `string`                                     |
| extraParameters                                | The extra parameters you may need for the authorization request                                                                    | `Record<string, string>`                     |
| bodyEncoding                                   | Specifies the format for sending the body of the request.                                                                          | `json` \| `url-encoded`                      |
| tokenResponseParser                            | Some providers returns some non-standard token responses. Specifies how to parse the JSON response to get the access token         | `(response: unknown) => OAuth.TokenResponse` |
| tokenRefreshResponseParser                     | Some providers returns some non-standard refresh token responses. Specifies how to parse the JSON response to get the access token | `(response: unknown) => OAuth.TokenResponse` |

| Property Name                                  | Description                                                                                                                        | Type                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| clientId<mark style="color:red;">\*</mark>     | The app's client ID                                                                                                                | `string`                                     |
| scope<mark style="color:red;">\*</mark>        | The scope of the access requested from the provider                                                                                | `string` \| `Array<string>`                  |
| authorizeUrl<mark style="color:red;">\*</mark> | The URL to start the OAuth flow                                                                                                    | `string`                                     |
| tokenUrl<mark style="color:red;">\*</mark>     | The URL to exchange the authorization code for an access token                                                                     | `string`                                     |
| refreshTokenUrl                                | The URL to refresh the access token if applicable                                                                                  | `string`                                     |
| personalAccessToken                            | A personal token if the provider supports it                                                                                       | `string`                                     |
| onAuthorize                                    | A callback function that is called once the user has been properly logged in through OAuth when used with `withAccessToken`        | `string`                                     |
| bodyEncoding                                   | Specifies the format for sending the body of the request.                                                                          | `json` \| `url-encoded`                      |
| tokenResponseParser                            | Some providers returns some non-standard token responses. Specifies how to parse the JSON response to get the access token         | `(response: unknown) => OAuth.TokenResponse` |
| tokenRefreshResponseParser                     | Some providers returns some non-standard refresh token responses. Specifies how to parse the JSON response to get the access token | `(response: unknown) => OAuth.TokenResponse` |

### ProviderWithDefaultClientOptions

| Property Name                           | Description                                                                                                                        | Type                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| scope<mark style="color:red;">\*</mark> | The scope of the access requested from the provider                                                                                | `string` \| `Array<string>`                  |
| clientId                                | The app's client ID                                                                                                                | `string`                                     |
| authorizeUrl                            | The URL to start the OAuth flow                                                                                                    | `string`                                     |
| tokenUrl                                | The URL to exchange the authorization code for an access token                                                                     | `string`                                     |
| refreshTokenUrl                         | The URL to refresh the access token if applicable                                                                                  | `string`                                     |
| personalAccessToken                     | A personal token if the provider supports it                                                                                       | `string`                                     |
| onAuthorize                             | A callback function that is called once the user has been properly logged in through OAuth when used with `withAccessToken`        | `string`                                     |
| bodyEncoding                            | Specifies the format for sending the body of the request.                                                                          | `json` \| `url-encoded`                      |
| tokenResponseParser                     | Some providers returns some non-standard token responses. Specifies how to parse the JSON response to get the access token         | `(response: unknown) => OAuth.TokenResponse` |
| tokenRefreshResponseParser              | Some providers returns some non-standard refresh token responses. Specifies how to parse the JSON response to get the access token | `(response: unknown) => OAuth.TokenResponse` |

**Examples:**

Example 1 (ts):
```ts
const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "GitHub",
  providerIcon: "extension_icon.png",
  providerId: "github",
  description: "Connect your GitHub account",
});

const github = new OAuthService({
  client,
  clientId: "7235fe8d42157f1f38c0",
  scope: "notifications repo read:org read:user read:project",
  authorizeUrl: "https://github.oauth.raycast.com/authorize",
  tokenUrl: "https://github.oauth.raycast.com/token",
});
```

Example 2 (ts):
```ts
constructor(options: OAuthServiceOptions): OAuthService
```

Example 3 (ts):
```ts
OAuthService.authorize(): Promise<string>;
```

Example 4 (typescript):
```typescript
const accessToken = await oauthService.authorize();
```

---

## Preferences

**URL:** llms-txt#preferences

**Contents:**
- API Reference
  - getPreferenceValues
  - openExtensionPreferences
  - openCommandPreferences
- Types
  - Preferences

Use the Preferences API to make your extension configurable.

Preferences are configured in the [manifest](https://developers.raycast.com/information/manifest#preference-properties) per command or shared in the context of an extension.

Required preferences need to be set by the user before a command opens. They are a great way to make sure that the user of your extension has everything set up properly.

### getPreferenceValues

A function to access the preference values that have been passed to the command.

Each preference name is mapped to its value, and the defined default values are used as fallback values.

{% hint style="info" %}
You don't need to manually set preference types as an interface since it is autogenerated in `raycast-env.d.ts` when you run the extension.
{% endhint %}

An object with the preference names as property key and the typed value as property value.

Depending on the type of the preference, the type of its value will be different.

| Preference type | Value type                                                            |
| --------------- | --------------------------------------------------------------------- |
| `textfield`     | `string`                                                              |
| `password`      | `string`                                                              |
| `checkbox`      | `boolean`                                                             |
| `dropdown`      | `string`                                                              |
| `appPicker`     | [`Application`](https://developers.raycast.com/utilities#application) |
| `file`          | `string`                                                              |
| `directory`     | `string`                                                              |

### openExtensionPreferences

Opens the extension's preferences screen.

A Promise that resolves when the extensions preferences screen is opened.

### openCommandPreferences

Opens the command's preferences screen.

A Promise that resolves when the command's preferences screen is opened.

A command receives the values of its preferences via the [`getPreferenceValues`](#getpreferencevalues) function. It is an object with the preferences' `name` as keys and their values as the property's values.

Depending on the type of the preference, the type of its value will be different.

| Preference type | Value type                                                            |
| --------------- | --------------------------------------------------------------------- |
| `textfield`     | `string`                                                              |
| `password`      | `string`                                                              |
| `checkbox`      | `boolean`                                                             |
| `dropdown`      | `string`                                                              |
| `appPicker`     | [`Application`](https://developers.raycast.com/utilities#application) |
| `file`          | `string`                                                              |
| `directory`     | `string`                                                              |

{% hint style="info" %}
Raycast provides a global TypeScript namespace called `Preferences` which contains the types of the preferences of all the commands of the extension.

For example, if a command named `show-todos` has some preferences, its `getPreferenceValues`'s return type can be specified with `getPreferenceValues<Preferences.ShowTodos>()`. This will make sure that the types used in the command stay in sync with the manifest.
{% endhint %}

**Examples:**

Example 1 (typescript):
```typescript
function getPreferenceValues(): { [preferenceName: string]: any };
```

Example 2 (typescript):
```typescript
import { getPreferenceValues } from "@raycast/api";

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();
  console.log(preferences);
}
```

Example 3 (typescript):
```typescript
export declare function openExtensionPreferences(): Promise<void>;
```

Example 4 (typescript):
```typescript
import { ActionPanel, Action, Detail, openExtensionPreferences } from "@raycast/api";

export default function Command() {
  const markdown = "API key incorrect. Please update it in extension preferences and try again.";

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
```

---

## useStreamJSON

**URL:** llms-txt#usestreamjson

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Mutation and Optimistic Updates
- Types
  - AsyncState

Hook which takes a `http://`, `https://` or `file:///` URL pointing to a JSON resource, caches it to the command's support folder, and streams through its content. Useful when dealing with large JSON arrays which would be too big to fit in the command's memory.

* `url` - The [`RequestInfo`](https://github.com/nodejs/undici/blob/v5.7.0/types/fetch.d.ts#L12) describing the resource that needs to be fetched. Strings starting with `http://`, `https://` and `Request` objects will use `fetch`, while strings starting with `file:///` will be copied to the cache folder.

* `options` extends [`RequestInit`](https://github.com/nodejs/undici/blob/v5.7.0/types/fetch.d.ts#L103-L117) allowing you to specify a body, headers, etc. to apply to the request.
* `options.pageSize` the amount of items to fetch at a time. By default, 20 will be used
* `options.dataPath` is a string or regular expression informing the hook that the array (or arrays) of data you want to stream through is wrapped inside one or multiple objects, and it indicates the path it needs to take to get to it.
* `options.transform` is a function called with each top-level object encountered while streaming. If the function returns an array, the hook will end up streaming through its children, and each array item will be passed to `options.filter`. If the function returns something other than an array, *it* will be passed to `options.filter`. Note that the hook will revalidate every time the filter function changes, so you need to use [useCallback](https://react.dev/reference/react/useCallback) to make sure it only changes when it needs to.
* `options.filter` is a function called with each object encountered while streaming. If it returns `true`, the object will be kept, otherwise it will be discarded. Note that the hook will revalidate every time the filter function changes, so you need to use [useCallback](https://react.dev/reference/react/useCallback) to make sure it only changes when it needs to.

Including the [useCachedPromise](https://developers.raycast.com/utilities/react-hooks/usecachedpromise)'s options:

* `options.keepPreviousData` is a boolean to tell the hook to keep the previous results instead of returning the initial value if there aren't any in the cache for the new arguments. This is particularly useful when used for data for a List to avoid flickering.

Including the [useCachedState](https://developers.raycast.com/utilities/react-hooks/usecachedstate)'s options:

* `options.initialData` is the initial value of the state if there aren't any in the Cache yet.

Including the [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise)'s options:

* `options.execute` is a boolean to indicate whether to actually execute the function or not. This is useful for cases where one of the function's arguments depends on something that might not be available right away (for example, depends on some user inputs). Because React requires every hook to be defined on the render, this flag enables you to define the hook right away but wait until you have all the arguments ready to execute the function.
* `options.onError` is a function called when an execution fails. By default, it will log the error and show a generic failure toast with an action to retry.
* `options.onData` is a function called when an execution succeeds.
* `options.onWillExecute` is a function called when an execution will start.
* `options.failureToastOptions` are the options to customize the title, message, and primary action of the failure toast.

Returns an object with the [AsyncState](#asyncstate) corresponding to the execution of the fetch as well as a couple of methods to manipulate it.

* `data`, `error`, `isLoading` - see [AsyncState](#asyncstate).
* `pagination` - the pagination object that Raycast [`List`s](https://developers.raycast.com/api-reference/user-interface/list#props) and [`Grid`s](https://developers.raycast.com/api-reference/user-interface/grid#props) expect.
* `revalidate` is a method to manually call the function with the same arguments again.
* `mutate` is a method to wrap an asynchronous update and gives some control over how the hook's data should be updated while the update is going through. By default, the data will be revalidated (eg. the function will be called again) after the update is done. See [Mutation and Optimistic Updates](#mutation-and-optimistic-updates) for more information.

## Mutation and Optimistic Updates

In an optimistic update, the UI behaves as though a change was successfully completed before receiving confirmation from the server that it was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

You can specify an `optimisticUpdate` function to mutate the data in order to reflect the change introduced by the asynchronous update.

When doing so, you can specify a `rollbackOnError` function to mutate back the data if the asynchronous update fails. If not specified, the data will be automatically rolled back to its previous value (before the optimistic update).

An object corresponding to the execution state of the function.

**Examples:**

Example 1 (ts):
```ts
export function useStreamJSON<T, U>(
  url: RequestInfo,
  options: RequestInit & {
    filter?: (item: T) => boolean;
    transform?: (item: any) => T;
    pageSize?: number;
    initialData?: U;
    keepPreviousData?: boolean;
    execute?: boolean;
    onError?: (error: Error) => void;
    onData?: (data: T) => void;
    onWillExecute?: (args: [string, RequestInit]) => void;
    failureToastOptions?: Partial<Pick<Toast.Options, "title" | "primaryAction" | "message">>;
  },
): AsyncState<Result<T>> & {
  revalidate: () => void;
};
```

Example 2 (ts):
```ts
import { Action, ActionPanel, List, environment } from "@raycast/api";
import { useStreamJSON } from "@raycast/utils";
import { join } from "path";
import { useCallback, useState } from "react";

type Formula = { name: string; desc?: string };

export default function Main(): React.JSX.Element {
  const [searchText, setSearchText] = useState("");

  const formulaFilter = useCallback(
    (item: Formula) => {
      if (!searchText) return true;
      return item.name.toLocaleLowerCase().includes(searchText);
    },
    [searchText],
  );

  const formulaTransform = useCallback((item: any): Formula => {
    return { name: item.name, desc: item.desc };
  }, []);

  const { data, isLoading, pagination } = useStreamJSON("https://formulae.brew.sh/api/formula.json", {
    initialData: [] as Formula[],
    pageSize: 20,
    filter: formulaFilter,
    transform: formulaTransform
  });

  return (
    <List isLoading={isLoading} pagination={pagination} onSearchTextChange={setSearchText}>
      <List.Section title="Formulae">
        {data.map((d) => (
          <List.Item key={d.name} title={d.name} subtitle={d.desc} />
        ))}
      </List.Section>
    </List>
  );
}
```

Example 3 (tsx):
```tsx
import { Action, ActionPanel, List, environment } from "@raycast/api";
import { useStreamJSON } from "@raycast/utils";
import { join } from "path";
import { useCallback, useState } from "react";
import { setTimeout } from "timers/promises";

type Formula = { name: string; desc?: string };

export default function Main(): React.JSX.Element {
  const [searchText, setSearchText] = useState("");

  const formulaFilter = useCallback(
    (item: Formula) => {
      if (!searchText) return true;
      return item.name.toLocaleLowerCase().includes(searchText);
    },
    [searchText],
  );

  const formulaTransform = useCallback((item: any): Formula => {
    return { name: item.name, desc: item.desc };
  }, []);

  const { data, isLoading, mutate, pagination } = useStreamJSON("https://formulae.brew.sh/api/formula.json", {
    initialData: [] as Formula[],
    pageSize: 20,
    filter: formulaFilter,
    transform: formulaTransform,
  });

  return (
    <List isLoading={isLoading} pagination={pagination} onSearchTextChange={setSearchText}>
      <List.Section title="Formulae">
        {data.map((d) => (
          <List.Item
            key={d.name}
            title={d.name}
            subtitle={d.desc}
            actions={
              <ActionPanel>
                <Action
                  title="Delete All Items But This One"
                  onAction={async () => {
                    mutate(setTimeout(1000), {
                      optimisticUpdate: () => {
                        return [d];
                      },
                    });
                  }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
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

## Cache

**URL:** llms-txt#cache

**Contents:**
- API Reference
  - Cache
  - Cache#get
  - Cache#has
  - Cache#set
  - Cache#remove
  - Cache#clear
  - Cache#subscribe
- Types
  - Cache.Options

Caching abstraction that stores data on disk and supports LRU (least recently used) access. Since extensions can only consume up to a max. heap memory size, the cache only maintains a lightweight index in memory and stores the actual data in separate files on disk in the extension's support directory.

The `Cache` class provides CRUD-style methods (get, set, remove) to update and retrieve data synchronously based on a key. The data must be a string and it is up to the client to decide which serialization format to use.\
A typical use case would be to use `JSON.stringify` and `JSON.parse`.

By default, the cache is shared between the commands of an extension. Use [Cache.Options](#cache.options) to configure a `namespace` per command if needed (for example, set it to [`environment.commandName`](https://developers.raycast.com/api-reference/environment)).

| Property                                  | Description                                              | Type      |
| ----------------------------------------- | -------------------------------------------------------- | --------- |
| isEmpty<mark style="color:red;">\*</mark> | Returns `true` if the cache is empty, `false` otherwise. | `boolean` |

| Method                                                                            |
| --------------------------------------------------------------------------------- |
| [`get(key: string): string \| undefined`](#cache-get)                             |
| [`has(key: string): boolean`](#cache-has)                                         |
| [`set(key: string, data: string): void`](#cache-set)                              |
| [`remove(key: string): boolean`](#cache-remove)                                   |
| [`clear(options = { notifySubscribers: true }): void`](#cache-clear)              |
| [`subscribe(subscriber: Cache.Subscriber): Cache.Subscription`](#cache-subscribe) |

Returns the data for the given key. If there is no data for the key, `undefined` is returned.\
If you want to just check for the existence of a key, use [has](#cache-has).

| Name                                  | Description                 | Type     |
| ------------------------------------- | --------------------------- | -------- |
| key<mark style="color:red;">\*</mark> | The key of the Cache entry. | `string` |

Returns `true` if data for the key exists, `false` otherwise.\
You can use this method to check for entries without affecting the LRU access.

| Name                                  | Description                 | Type     |
| ------------------------------------- | --------------------------- | -------- |
| key<mark style="color:red;">\*</mark> | The key of the Cache entry. | `string` |

Sets the data for the given key.\
If the data exceeds the configured `capacity`, the least recently used entries are removed.\
This also notifies registered subscribers (see [subscribe](#cache-subscribe)).

| Name                                   | Description                              | Type     |
| -------------------------------------- | ---------------------------------------- | -------- |
| key<mark style="color:red;">\*</mark>  | The key of the Cache entry.              | `string` |
| data<mark style="color:red;">\*</mark> | The stringified data of the Cache entry. | `string` |

Removes the data for the given key.\
This also notifies registered subscribers (see [subscribe](#cache-subscribe)).\
Returns `true` if data for the key was removed, `false` otherwise.

Clears all stored data.\
This also notifies registered subscribers (see [subscribe](#cache-subscribe)) unless the `notifySubscribers` option is set to `false`.

| Name    | Description                                                                                                                | Type     |
| ------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| options | Options with a `notifySubscribers` property. The default is `true`; set to `false` to disable notification of subscribers. | `object` |

Registers a new subscriber that gets notified when cache data is set or removed.\
Returns a function that can be called to remove the subscriber.

| Name       | Description                                                                                                                                                                                               | Type                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| subscriber | A function that is called when the Cache is updated. The function receives two values: the `key` of the Cache entry that was updated or `undefined` when the Cache is cleared, and the associated `data`. | [`Cache.Subscriber`](#cache.subscriber) |

The options for creating a new Cache.

| Property  | Description                                                                                                                                                                                                       | Type     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| capacity  | The capacity in bytes. If the stored data exceeds the capacity, the least recently used data is removed. The default capacity is 10 MB.                                                                           | `number` |
| namespace | If set, the Cache will be namespaced via a subdirectory. This can be useful to separate the caches for individual commands of an extension. By default, the cache is shared between the commands of an extension. | `string` |

Function type used as parameter for [subscribe](#cache-subscribe).

### Cache.Subscription

Function type returned from [subscribe](#cache-subscribe).

**Examples:**

Example 1 (typescript):
```typescript
constructor(options: Cache.Options): Cache
```

Example 2 (typescript):
```typescript
import { List, Cache } from "@raycast/api";

type Item = { id: string; title: string };
const cache = new Cache();
cache.set("items", JSON.stringify([{ id: "1", title: "Item 1" }]));

export default function Command() {
  const cached = cache.get("items");
  const items: Item[] = cached ? JSON.parse(cached) : [];

  return (
    <List>
      {items.map((item) => (
        <List.Item key={item.id} title={item.title} />
      ))}
    </List>
  );
}
```

Example 3 (typescript):
```typescript
get(key: string): string | undefined
```

Example 4 (typescript):
```typescript
has(key: string): boolean
```

---

## Command

**URL:** llms-txt#command

**Contents:**
- API Reference
  - launchCommand
  - updateCommandMetadata
- Types
  - LaunchContext
  - LaunchOptions

This set of utilities to work with Raycast commands.

Launches another command. If the command does not exist, or if it's not enabled, an error will be thrown.\
If the command is part of another extension, the user will be presented with a permission alert.\
Use this method if your command needs to open another command based on user interaction,\
or when an immediate background refresh should be triggered, for example when a command needs to update an associated menu-bar command.

| Name                                      | Description                                                                    | Type                              |
| ----------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------- |
| options<mark style="color:red;">\*</mark> | Options to launch a command within the same extension or in another extension. | [`LaunchOptions`](#launchoptions) |

A Promise that resolves when the command has been launched. (Note that this does not indicate that the launched command has finished executing.)

### updateCommandMetadata

Update the values of properties declared in the manifest of the current command. Note that currently only `subtitle` is supported. Pass `null` to clear the custom subtitle.

{% hint style="info" %}
The actual manifest file is not modified, so the update applies as long as the command remains installed.
{% endhint %}

A Promise that resolves when the command's metadata have been updated.

Represents the passed context object of programmatic command launches.

A parameter object used to decide which command should be launched and what data (arguments, context) it should receive.

#### IntraExtensionLaunchOptions

The options that can be used when launching a command from the same extension.

| Property                               | Description                                                                                                                                                             | Type                                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| name<mark style="color:red;">\*</mark> | Command name as defined in the extension's manifest                                                                                                                     | `string`                                                                                          |
| type<mark style="color:red;">\*</mark> | LaunchType.UserInitiated or LaunchType.Background                                                                                                                       | [`LaunchType`](https://developers.raycast.com/environment#launchtype)                             |
| arguments                              | Optional object for the argument properties and values as defined in the extension's manifest, for example: `{ "argument1": "value1" }`                                 | [`Arguments`](https://developers.raycast.com/information/lifecycle/arguments#arguments) or `null` |
| context                                | Arbitrary object for custom data that should be passed to the command and accessible as LaunchProps; the object must be JSON serializable (Dates and Buffers supported) | [`LaunchContext`](#launchcontext) or `null`                                                       |
| fallbackText                           | Optional string to send as fallback text to the command                                                                                                                 | `string` or `null`                                                                                |

#### InterExtensionLaunchOptions

The options that can be used when launching a command from a different extension.

| Property                                            | Description                                                                                                                                                             | Type                                                                                              |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| extensionName<mark style="color:red;">\*</mark>     | When launching command from a different extension, the extension name (as defined in the extension's manifest) is necessary                                             | `string`                                                                                          |
| name<mark style="color:red;">\*</mark>              | Command name as defined in the extension's manifest                                                                                                                     | `string`                                                                                          |
| ownerOrAuthorName<mark style="color:red;">\*</mark> | When launching command from a different extension, the owner or author (as defined in the extension's manifest) is necessary                                            | `string`                                                                                          |
| type<mark style="color:red;">\*</mark>              | LaunchType.UserInitiated or LaunchType.Background                                                                                                                       | [`LaunchType`](https://developers.raycast.com/environment#launchtype)                             |
| arguments                                           | Optional object for the argument properties and values as defined in the extension's manifest, for example: `{ "argument1": "value1" }`                                 | [`Arguments`](https://developers.raycast.com/information/lifecycle/arguments#arguments) or `null` |
| context                                             | Arbitrary object for custom data that should be passed to the command and accessible as LaunchProps; the object must be JSON serializable (Dates and Buffers supported) | [`LaunchContext`](#launchcontext) or `null`                                                       |
| fallbackText                                        | Optional string to send as fallback text to the command                                                                                                                 | `string` or `null`                                                                                |

**Examples:**

Example 1 (typescript):
```typescript
export async function launchCommand(options: LaunchOptions): Promise<void>;
```

Example 2 (typescript):
```typescript
import { launchCommand, LaunchType } from "@raycast/api";

export default async function Command() {
  await launchCommand({ name: "list", type: LaunchType.UserInitiated, context: { foo: "bar" } });
}
```

Example 3 (typescript):
```typescript
export async function updateCommandMetadata(metadata: { subtitle?: string | null }): Promise<void>;
```

Example 4 (typescript):
```typescript
import { updateCommandMetadata } from "@raycast/api";

async function fetchUnreadNotificationCount() {
  return 10;
}

export default async function Command() {
  const count = await fetchUnreadNotificationCount();
  await updateCommandMetadata({ subtitle: `Unread Notifications: ${count}` });
}
```

---

## Storage

**URL:** llms-txt#storage

**Contents:**
- API Reference
  - LocalStorage.getItem
  - LocalStorage.setItem
  - LocalStorage.removeItem
  - LocalStorage.allItems
  - LocalStorage.clear
- Types
  - LocalStorage.Values
  - LocalStorage.Value

The storage APIs can be used to store data in Raycast's [local encrypted database](https://developers.raycast.com/information/security#data-storage).

All commands in an extension have shared access to the stored data. Extensions can *not* access the storage of other extensions.

Values can be managed through functions such as [`LocalStorage.getItem`](#localstorage.getitem), [`LocalStorage.setItem`](#localstorage.setitem), or [`LocalStorage.removeItem`](#localstorage.removeitem). A typical use case is storing user-related data, for example entered todos.

{% hint style="info" %}
The API is not meant to store large amounts of data. For this, use [Node's built-in APIs to write files](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs), e.g. to the extension's [support directory](https://developers.raycast.com/environment#environment).
{% endhint %}

### LocalStorage.getItem

Retrieve the stored value for the given key.

| Name                                  | Description                                | Type     |
| ------------------------------------- | ------------------------------------------ | -------- |
| key<mark style="color:red;">\*</mark> | The key you want to retrieve the value of. | `string` |

A Promise that resolves with the stored value for the given key. If the key does not exist, `undefined` is returned.

### LocalStorage.setItem

Stores a value for the given key.

| Name                                    | Description                                               | Type                                        |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| key<mark style="color:red;">\*</mark>   | The key you want to create or update the value of.        | `string`                                    |
| value<mark style="color:red;">\*</mark> | The value you want to create or update for the given key. | [`LocalStorage.Value`](#localstorage.value) |

A Promise that resolves when the value is stored.

### LocalStorage.removeItem

Removes the stored value for the given key.

| Name                                  | Description                              | Type     |
| ------------------------------------- | ---------------------------------------- | -------- |
| key<mark style="color:red;">\*</mark> | The key you want to remove the value of. | `string` |

A Promise that resolves when the value is removed.

### LocalStorage.allItems

Retrieve all stored values in the local storage of an extension.

A Promise that resolves with an object containing all [Values](#localstorage.values).

### LocalStorage.clear

Removes all stored values of an extension.

A Promise that resolves when all values are removed.

### LocalStorage.Values

Values of local storage items.

For type-safe values, you can define your own interface. Use the keys of the local storage items as the property names.

| Name           | Type  | Description                             |
| -------------- | ----- | --------------------------------------- |
| \[key: string] | `any` | The local storage value of a given key. |

### LocalStorage.Value

Supported storage value types.

**Examples:**

Example 1 (typescript):
```typescript
async function getItem(key: string): Promise<Value | undefined>;
```

Example 2 (typescript):
```typescript
import { LocalStorage } from "@raycast/api";

export default async function Command() {
  await LocalStorage.setItem("favorite-fruit", "apple");
  const item = await LocalStorage.getItem<string>("favorite-fruit");
  console.log(item);
}
```

Example 3 (typescript):
```typescript
async function setItem(key: string, value: Value): Promise<void>;
```

Example 4 (typescript):
```typescript
import { LocalStorage } from "@raycast/api";

export default async function Command() {
  await LocalStorage.setItem("favorite-fruit", "apple");
  const item = await LocalStorage.getItem<string>("favorite-fruit");
  console.log(item);
}
```

---

## Review an Extension in a Pull Request

**URL:** llms-txt#review-an-extension-in-a-pull-request

**Contents:**
- Steps

Learn how to review a contribution from a Pull Request opened by a contributor.

All updates to an extension are made through a [Pull Request](https://github.com/raycast/extensions/pulls) - if you need to review whether the Pull Request works as expected, then you can checkout the fork within a few seconds.

1. Open a terminal window
2. Navigate to a folder where you want the repository to land
3. Run the below commands

*There are a few things you'll need to find and insert manually in the snippet below*

Open the PR and click on the incoming ref as shown below

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1a66bb065c6f9ccb78f4a42eebdcd3c70837fb1d%2Fgo-to-ref.webp?alt=media)

Now click the code button and copy the HTTPS path from the dropdown

You can see the branch on the above image (in this example it’s `notion-quicklinks`)

Click the `Files Changed` tab to see in which directory files have been changed (in this example it’s `notion`)

4. That's it, the extension should now be attached in Raycast

**Examples:**

Example 1 (unknown):
```unknown
BRANCH="ext/soundboard"
FORK_URL="https://github.com/pernielsentikaer/raycast-extensions.git"
EXTENSION_NAME="soundboard"

git clone -n --depth=1 --filter=tree:0 -b ${BRANCH} ${FORK_URL}
cd raycast-extensions
git sparse-checkout set --no-cone "extensions/${EXTENSION_NAME}"
git checkout
cd "extensions/${EXTENSION_NAME}"
npm install && npm run dev
```

---

## Browser Extension

**URL:** llms-txt#browser-extension

**Contents:**
- API Reference
  - BrowserExtension.getContent
  - BrowserExtension.getTabs
- Types
  - BrowserExtension.Tab

The Browser Extension API provides developers with deeper integration into the user's Browser *via* a [Browser Extension](https://raycast.com/browser-extension).

{% hint style="info" %}
Some users might not have installed the Browser Extension. If a user doesn't have the Browser Extension installed, they will be asked if they want to install it when your extension calls the Browser Extension API. If the user doesn't wish to install it, the API call will throw an error.

You can check if a user has the Browser Extension installed using [`environment.canAccess(BrowserExtension)`](https://developers.raycast.com/api-reference/environment).

The API is not accessible on Windows for now.
{% endhint %}

### BrowserExtension.getContent

Get the content of an opened browser tab.

{% tabs %}
{% tab title="Basic Usage" %}

{% tab title="CSS Selector" %}

{% endtab %}
{% endtabs %}

| Name                | Description                                                                                                                                                                                                                                                                                                                                                       | Type                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| options             | Options to control which content to get.                                                                                                                                                                                                                                                                                                                          | `Object`                             |
| options.cssSelector | Only returns the content of the element that matches the [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors). If the selector matches multiple elements, only the first one is returned. If the selector doesn't match any element, an empty string is returned. When using a CSS selector, the `format` option can not be `markdown`. | `string`                             |
| options.format      | The format of the content. - `html`: `document.documentElement.outerHTML` - `text`: `document.body.innerText` - `markdown`: A heuristic to get the "content" of the document and convert it to markdown. Think of it as the "reader mode" of a browser.                                                                                                           | `"html"` or `"text"` or `"markdown"` |
| options.tabId       | The ID of the tab to get the content from. If not specified, the content of the active tab of the focused window is returned.                                                                                                                                                                                                                                     | `number`                             |

A Promise that resolves with the content of the tab.

### BrowserExtension.getTabs

Get the list of open browser tabs.

A Promise that resolves with the list of [tabs](#browserextension.tab).

### BrowserExtension.Tab

| Property                                 | Description                                                                                                                                                        | Type      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| active<mark style="color:red;">\*</mark> | Whether the tab is active in its window. There can only be one active tab per window but if there are multiple browser windows, there can be multiple active tabs. | `boolean` |
| id<mark style="color:red;">\*</mark>     | The ID of the tab. Tab IDs are unique within a browser session.                                                                                                    | `number`  |
| url<mark style="color:red;">\*</mark>    | The URL the tab is displaying.                                                                                                                                     | `string`  |
| favicon                                  | The URL of the tab's [favicon](https://developer.mozilla.org/en-US/docs/Glossary/Favicon). It may also be `undefined` if the tab is loading.                       | `string`  |
| title                                    | The title of the tab. It may also be `undefined` if the tab is loading.                                                                                            | `string`  |

**Examples:**

Example 1 (typescript):
```typescript
async function getContent(options?: {
  cssSelector?: string;
  tabId?: number;
  format?: "html" | "text" | "markdown";
}): Promise<string>;
```

Example 2 (typescript):
```typescript
import { BrowserExtension, Clipboard } from "@raycast/api";

export default async function command() {
  const markdown = await BrowserExtension.getContent({ format: "markdown" });

  await Clipboard.copy(markdown);
}
```

Example 3 (typescript):
```typescript
import { BrowserExtension, Clipboard } from "@raycast/api";

export default async function command() {
  const title = await BrowserExtension.getContent({ format: "text", cssSelector: "title" });

  await Clipboard.copy(title);
}
```

Example 4 (typescript):
```typescript
async function getTabs(): Promise<Tab[]>;
```

---

## Manage Extensions Command

**URL:** llms-txt#manage-extensions-command

**Contents:**
- Add New Command

A Raycast command to manage your extensions, add new commands or attachments, etc.

Raycast provides a built-in command to manage your extensions.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-98a70fc3a77ad10cc32267b282a16b49a38abc00%2Fmanage-extensions.webp?alt=media)

For each extensions, there are a few actions to manage them.

One such action is the `Add New Command` action.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5843ab46283de8d365e94b4c04a36e11cf930344%2Fadd-new-command.webp?alt=media)

It will prompt you for the information about the new command before updating the manifest of the extension and creating the file for you based on the template you selected.

---

## Actions

**URL:** llms-txt#actions

**Contents:**
- API Reference
  - Action
  - Action.CopyToClipboard
  - Action.Open
  - Action.OpenInBrowser
  - Action.OpenWith
  - Action.Paste
  - Action.Push
  - Action.ShowInFinder
  - Action.SubmitForm

Our API includes a few built-in actions that can be used for common interactions, such as opening a link or copying some content to the clipboard. By using them, you make sure to follow our human interface guidelines. If you need something custom, use the [`Action`](#action) component. All built-in actions are just abstractions on top of it.

A context-specific action that can be performed by the user.

Assign keyboard shortcuts to items to make it easier for users to perform frequently used actions.

| Prop                                    | Description                                                                                                              | Type                                                                                               | Default |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The title displayed for the Action.                                                                                      | `string`                                                                                           | -       |
| autoFocus                               | Indicates whether the Action should be focused automatically when the parent ActionPanel (or Actionpanel.Submenu) opens. | `boolean`                                                                                          | -       |
| icon                                    | The icon displayed for the Action.                                                                                       | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onAction                                | Callback that is triggered when the Action is selected.                                                                  | `() => void`                                                                                       | -       |
| shortcut                                | The keyboard shortcut for the Action.                                                                                    | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| style                                   | Defines the visual style of the Action.                                                                                  | [`Alert.ActionStyle`](https://developers.raycast.com/feedback/alert#alert.actionstyle)             | -       |

### Action.CopyToClipboard

Action that copies the content to the clipboard.

The main window is closed, and a HUD is shown after the content was copied to the clipboard.

| Prop                                      | Description                                                                                                            | Type                                                                                                                         | Default |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| content<mark style="color:red;">\*</mark> | The contents that will be copied to the clipboard.                                                                     | `string` or `number` or [`Clipboard.Content`](https://developers.raycast.com/clipboard#clipboard.content)                    | -       |
| concealed                                 | Indicates whether the content be treated as confidential. If `true`, it will not be recorded in the Clipboard History. | `boolean`                                                                                                                    | -       |
| icon                                      | A optional icon displayed for the Action.                                                                              | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike)                           | -       |
| onCopy                                    | Callback when the content was copied to clipboard.                                                                     | `(content: string \| number \|` [`Clipboard.Content`](https://developers.raycast.com/clipboard#clipboard.content)`) => void` | -       |
| shortcut                                  | The keyboard shortcut for the Action.                                                                                  | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                                             | -       |
| title                                     | An optional title for the Action.                                                                                      | `string`                                                                                                                     | -       |

An action to open a file or folder with a specific application, just as if you had double-clicked the file's icon.

The main window is closed after the file is opened.

| Prop                                     | Description                                       | Type                                                                                               | Default |
| ---------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| target<mark style="color:red;">\*</mark> | The file, folder or URL to open.                  | `string`                                                                                           | -       |
| title<mark style="color:red;">\*</mark>  | The title for the Action.                         | `string`                                                                                           | -       |
| application                              | The application name to use for opening the file. | `string` or [`Application`](https://developers.raycast.com/utilities#application)                  | -       |
| icon                                     | The icon displayed for the Action.                | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onOpen                                   | Callback when the file or folder was opened.      | `(target: string) => void`                                                                         | -       |
| shortcut                                 | The keyboard shortcut for the Action.             | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |

### Action.OpenInBrowser

Action that opens a URL in the default browser.

The main window is closed after the URL is opened in the browser.

| Prop                                  | Description                                      | Type                                                                                               | Default |
| ------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| url<mark style="color:red;">\*</mark> | The URL to open.                                 | `string`                                                                                           | -       |
| icon                                  | The icon displayed for the Action.               | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onOpen                                | Callback when the URL was opened in the browser. | `(url: string) => void`                                                                            | -       |
| shortcut                              | The optional keyboard shortcut for the Action.   | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title                                 | An optional title for the Action.                | `string`                                                                                           | -       |

Action that opens a file or URL with a specific application.

The action opens a sub-menu with all applications that can open the file or URL. The main window is closed after the item is opened in the specified application.

| Prop                                   | Description                                  | Type                                                                                               | Default |
| -------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| path<mark style="color:red;">\*</mark> | The path to open.                            | `string`                                                                                           | -       |
| icon                                   | The icon displayed for the Action.           | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onOpen                                 | Callback when the file or folder was opened. | `(path: string) => void`                                                                           | -       |
| shortcut                               | The keyboard shortcut for the Action.        | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title                                  | The title for the Action.                    | `string`                                                                                           | -       |

Action that pastes the content to the front-most applications.

The main window is closed after the content is pasted to the front-most application.

| Prop                                      | Description                                                           | Type                                                                                                                         | Default |
| ----------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| content<mark style="color:red;">\*</mark> | The contents that will be pasted to the frontmost application.        | `string` or `number` or [`Clipboard.Content`](https://developers.raycast.com/clipboard#clipboard.content)                    | -       |
| icon                                      | The icon displayed for the Action.                                    | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike)                           | -       |
| onPaste                                   | Callback when the content was pasted into the front-most application. | `(content: string \| number \|` [`Clipboard.Content`](https://developers.raycast.com/clipboard#clipboard.content)`) => void` | -       |
| shortcut                                  | The keyboard shortcut for the Action.                                 | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                                             | -       |
| title                                     | An optional title for the Action.                                     | `string`                                                                                                                     | -       |

Action that pushes a new view to the navigation stack.

| Prop                                     | Description                                                  | Type                                                                                               | Default |
| ---------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| target<mark style="color:red;">\*</mark> | The target view that will be pushed to the navigation stack. | `React.ReactNode`                                                                                  | -       |
| title<mark style="color:red;">\*</mark>  | The title displayed for the Action.                          | `string`                                                                                           | -       |
| icon                                     | The icon displayed for the Action.                           | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onPop                                    | Callback when the target view will be popped.                | `() => void`                                                                                       | -       |
| onPush                                   | Callback when the target view was pushed.                    | `() => void`                                                                                       | -       |
| shortcut                                 | The keyboard shortcut for the Action.                        | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |

### Action.ShowInFinder

Action that shows a file or folder in the Finder.

The main window is closed after the file or folder is revealed in the Finder.

| Prop                                   | Description                                               | Type                                                                                               | Default |
| -------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| path<mark style="color:red;">\*</mark> | The path to open.                                         | `"fs".PathLike`                                                                                    | -       |
| icon                                   | A optional icon displayed for the Action.                 | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onShow                                 | Callback when the file or folder was shown in the Finder. | `(path: "fs".PathLike) => void`                                                                    | -       |
| shortcut                               | The keyboard shortcut for the Action.                     | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title                                  | An optional title for the Action.                         | `string`                                                                                           | -       |

### Action.SubmitForm

Action that adds a submit handler for capturing form values.

| Prop     | Description                                                                                               | Type                                                                                                                                       | Default |
| -------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| icon     | The icon displayed for the Action.                                                                        | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike)                                         | -       |
| onSubmit | Callback when the Form was submitted. The handler receives a the values object containing the user input. | `(input:` [`Form.Values`](https://developers.raycast.com/api-reference/form#form.values)`) => boolean \| void \| Promise<boolean \| void>` | -       |
| shortcut | The keyboard shortcut for the Action.                                                                     | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                                                           | -       |
| style    | Defines the visual style of the Action.                                                                   | [`Alert.ActionStyle`](https://developers.raycast.com/feedback/alert#alert.actionstyle)                                                     | -       |
| title    | The title displayed for the Action.                                                                       | `string`                                                                                                                                   | -       |

Action that moves a file or folder to the Trash.

| Prop                                    | Description                                      | Type                                                                                               | Default |
| --------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| paths<mark style="color:red;">\*</mark> | The item or items to move to the trash.          | `"fs".PathLike` or `"fs".PathLike[]`                                                               | -       |
| icon                                    | A optional icon displayed for the Action.        | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onTrash                                 | Callback when all items were moved to the trash. | `(paths: "fs".PathLike \| "fs".PathLike[]) => void`                                                | -       |
| shortcut                                | The optional keyboard shortcut for the Action.   | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title                                   | An optional title for the Action.                | `string`                                                                                           | -       |

### Action.CreateSnippet

Action that navigates to the the Create Snippet command with some or all of the fields prefilled.

| Prop                                      | Description                                                                                        | Type                                                                                               | Default |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| snippet<mark style="color:red;">\*</mark> |                                                                                                    | [`Snippet`](#snippet)                                                                              | -       |
| icon                                      | A optional icon displayed for the Action. See Image.ImageLike for the supported formats and types. | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| shortcut                                  | The keyboard shortcut for the Action.                                                              | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title                                     | An optional title for the Action.                                                                  | `string`                                                                                           | -       |

### Action.CreateQuicklink

Action that navigates to the the Create Quicklink command with some or all of the fields prefilled.

| Prop                                        | Description                                                                                        | Type                                                                                               | Default |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| quicklink<mark style="color:red;">\*</mark> | The Quicklink to create.                                                                           | [`Quicklink`](#quicklink)                                                                          | -       |
| icon                                        | A optional icon displayed for the Action. See Image.ImageLike for the supported formats and types. | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| shortcut                                    | The keyboard shortcut for the Action.                                                              | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title                                       | An optional title for the Action.                                                                  | `string`                                                                                           | -       |

### Action.ToggleQuickLook

Action that toggles the Quick Look to preview a file.

| Prop     | Description                           | Type                                                                                               | Default |
| -------- | ------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| icon     | The icon displayed for the Action.    | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| shortcut | The keyboard shortcut for the Action. | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                   | -       |
| title    | The title for the Action.             | `string`                                                                                           | -       |

Action to pick a date.

| Prop                                       | Description                                                                                                                                                                                                                                                                                                                                                    | Type                                                                                                                | Default |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| onChange<mark style="color:red;">\*</mark> | Callback when the Date was picked                                                                                                                                                                                                                                                                                                                              | `(date:` [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)`) => void` | -       |
| title<mark style="color:red;">\*</mark>    | A title for the Action.                                                                                                                                                                                                                                                                                                                                        | `string`                                                                                                            | -       |
| icon                                       | A optional icon displayed for the Action.                                                                                                                                                                                                                                                                                                                      | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike)                  | -       |
| max                                        | The maximum date (inclusive) allowed for selection. - If the PickDate type is `Type.Date`, only the full day date will be considered for comparison, ignoring the time components of the Date object. - If the PickDate type is `Type.DateTime`, both date and time components will be considered for comparison. The date should be a JavaScript Date object. | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                     | -       |
| min                                        | The minimum date (inclusive) allowed for selection. - If the PickDate type is `Type.Date`, only the full day date will be considered for comparison, ignoring the time components of the Date object. - If the PickDate type is `Type.DateTime`, both date and time components will be considered for comparison. The date should be a JavaScript Date object. | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                     | -       |
| shortcut                                   | The keyboard shortcut for the Action.                                                                                                                                                                                                                                                                                                                          | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                                    | -       |
| type                                       | Indicates what types of date components can be picked Defaults to Action.PickDate.Type.DateTime                                                                                                                                                                                                                                                                | [`Action.PickDate.Type`](#action.pickdate.type)                                                                     | -       |

| Property                               | Description                         | Type     |
| -------------------------------------- | ----------------------------------- | -------- |
| text<mark style="color:red;">\*</mark> | The snippet contents.               | `string` |
| keyword                                | The keyword to trigger the snippet. | `string` |
| name                                   | The snippet name.                   | `string` |

| Property                               | Description                                                                                                | Type                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| link<mark style="color:red;">\*</mark> | The URL or file path, optionally including placeholders such as in "<https://google.com/search?q={Query}>" | `string`                                                                          |
| application                            | The application that the quicklink should be opened in.                                                    | `string` or [`Application`](https://developers.raycast.com/utilities#application) |
| icon                                   | The icon to display for the quicklink.                                                                     | [`Icon`](https://developers.raycast.com/api-reference/icons-and-images#icon)      |
| name                                   | The quicklink name                                                                                         | `string`                                                                          |

Defines the visual style of the Action.

Use [Action.Style.Regular](#action.style) for displaying a regular actions. Use [Action.Style.Destructive](#action.style) when your action has something that user should be careful about. Use the confirmation [Alert](https://developers.raycast.com/api-reference/feedback/alert) if the action is doing something that user cannot revert.

### Action.PickDate.Type

The types of date components the user can pick with an `Action.PickDate`.

#### Enumeration members

| Name     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| DateTime | Hour and second can be picked in addition to year, month and day |
| Date     | Only year, month, and day can be picked                          |

### Action.PickDate.isFullDay

A method that determines if a given date represents a full day or a specific time.

**Examples:**

Example 1 (typescript):
```typescript
import { ActionPanel, Action, List } from "@raycast/api";

export default function Command() {
  return (
    <List navigationTitle="Open Pull Requests">
      <List.Item
        title="Docs: Update API Reference"
        subtitle="#1"
        actions={
          <ActionPanel title="#1 in raycast/extensions">
            <Action.OpenInBrowser url="https://github.com/raycast/extensions/pull/1" />
            <Action.CopyToClipboard title="Copy Pull Request Number" content="#1" />
            <Action title="Close Pull Request" onAction={() => console.log("Close PR #1")} />
          </ActionPanel>
        }
      />
    </List>
  );
}
```

Example 2 (typescript):
```typescript
import { ActionPanel, Action, Detail } from "@raycast/api";

export default function Command() {
  return (
    <Detail
      markdown="Press `⌘ + .` and share some love."
      actions={
        <ActionPanel>
          <Action.CopyToClipboard content="I ❤️ Raycast" shortcut={{ modifiers: ["cmd"], key: "." }} />
        </ActionPanel>
      }
    />
  );
}
```

Example 3 (typescript):
```typescript
import { ActionPanel, Detail, Action } from "@raycast/api";

export default function Command() {
  return (
    <Detail
      markdown="Check out your extension code."
      actions={
        <ActionPanel>
          <Action.Open title="Open Folder" target={__dirname} />
        </ActionPanel>
      }
    />
  );
}
```

Example 4 (typescript):
```typescript
import { ActionPanel, Detail, Action } from "@raycast/api";

export default function Command() {
  return (
    <Detail
      markdown="Join the gang!"
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url="https://raycast.com/jobs" />
        </ActionPanel>
      }
    />
  );
}
```

---

## useCachedState

**URL:** llms-txt#usecachedstate

**Contents:**
- Signature
  - Arguments
- Example

Hook which returns a stateful value, and a function to update it. It is similar to React's `useState` but the value will be kept between command runs.

{% hint style="info" %}
The value needs to be JSON serializable.
{% endhint %}

* `key` is the unique identifier of the state. This can be used to share the state across components and/or commands (hooks using the same key will share the same state, eg. updating one will update the others).

* `initialState` is the initial value of the state if there aren't any in the Cache yet.
* `config.cacheNamespace` is a string that can be used to namespace the key.

**Examples:**

Example 1 (ts):
```ts
function useCachedState<T>(
  key: string,
  initialState?: T,
  config?: {
    cacheNamespace?: string;
  },
): [T, (newState: T | ((prevState: T) => T)) => void];
```

Example 2 (tsx):
```tsx
import { List, ActionPanel, Action } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

export default function Command() {
  const [showDetails, setShowDetails] = useCachedState("show-details", false);

  return (
    <List
      isShowingDetail={showDetails}
      actions={
        <ActionPanel>
          <Action title={showDetails ? "Hide Details" : "Show Details"} onAction={() => setShowDetails((x) => !x)} />
        </ActionPanel>
      }
    >
      ...
    </List>
  );
}
```

---

## Keyboard

**URL:** llms-txt#keyboard

**Contents:**
- Types
  - Keyboard.Shortcut
  - Keyboard.Shortcut.Common
  - Keyboard.KeyEquivalent
  - Keyboard.KeyModifier

The Keyboard APIs are useful to make your actions accessible via the keyboard shortcuts. Shortcuts help users to use your command without touching the mouse.

{% hint style="info" %}
Use the [Common shortcuts](#keyboard.shortcut.common) whenever possible to keep a consistent user experience throughout Raycast.
{% endhint %}

### Keyboard.Shortcut

A keyboard shortcut is defined by one or more modifier keys (command, control, etc.) and a single key equivalent (a character or special key).

See [KeyModifier](#keyboard.keymodifier) and [KeyEquivalent](#keyboard.keyequivalent) for supported values.

| Property                                    | Description                                 | Type                                                |
| ------------------------------------------- | ------------------------------------------- | --------------------------------------------------- |
| key<mark style="color:red;">\*</mark>       | The key of the keyboard shortcut.           | [`Keyboard.KeyEquivalent`](#keyboard.keyequivalent) |
| modifiers<mark style="color:red;">\*</mark> | The modifier keys of the keyboard shortcut. | [`Keyboard.KeyModifier`](#keyboard.keymodifier)`[]` |

If the shortcut contains some "ambiguous" modifiers (eg. `ctrl`, or `cmd`, or `windows`), you will need to specify the shortcut for both platforms:

### Keyboard.Shortcut.Common

A collection of shortcuts that are commonly used throughout Raycast. Using them should help provide a more consistent experience and preserve muscle memory.

| Name            | macOS     | Windows              |
| --------------- | --------- | -------------------- |
| Copy            | ⌘ + ⇧ + C | `ctrl` + `shift` + C |
| CopyDeeplink    | ⌘ + ⇧ + C | `ctrl` + `shift` + C |
| CopyName        | ⌘ + ⇧ + . | `ctrl` + `alt` + C   |
| CopyPath        | ⌘ + ⇧ + , | `alt` + `shift` + C  |
| Save            | ⌘ + S     | `ctrl` + S           |
| Duplicate       | ⌘ + D     | `ctrl` + `shift` + S |
| Edit            | ⌘ + E     | `ctrl` + E           |
| MoveDown        | ⌘ + ⇧ + ↓ | `ctrl` + `shift` + ↓ |
| MoveUp          | ⌘ + ⇧ + ↑ | `ctrl` + `shift` + ↑ |
| New             | ⌘ + N     | `ctrl` + N           |
| Open            | ⌘ + O     | `ctrl` + O           |
| OpenWith        | ⌘ + ⇧ + O | `ctrl` + `shift` + O |
| Pin             | ⌘ + ⇧ + P | `ctrl` + .           |
| Refresh         | ⌘ + R     | `ctrl` + R           |
| Remove          | ⌃ + X     | `ctrl` + D           |
| RemoveAll       | ⌃ + ⇧ + X | `ctrl` + `shift` + D |
| ToggleQuickLook | ⌘ + Y     | `ctrl` + Y           |

### Keyboard.KeyEquivalent

KeyEquivalent of a [Shortcut](#keyboard.shortcut)

### Keyboard.KeyModifier

Modifier of a [Shortcut](#keyboard.shortcut).

Note that `"alt"` and `"opt"` are the same key, they are just named differently on macOS and Windows.

**Examples:**

Example 1 (typescript):
```typescript
import { Action, ActionPanel, Detail, Keyboard } from "@raycast/api";

export default function Command() {
  return (
    <Detail
      markdown="Let's play some games 👾"
      actions={
        <ActionPanel title="Game controls">
          <Action title="Up" shortcut={{ modifiers: ["opt"], key: "arrowUp" }} onAction={() => console.log("Go up")} />
          <Action
            title="Down"
            shortcut={{ modifiers: ["opt"], key: "arrowDown" }}
            onAction={() => console.log("Go down")}
          />
          <Action
            title="Left"
            shortcut={{ modifiers: ["opt"], key: "arrowLeft" }}
            onAction={() => console.log("Go left")}
          />
          <Action
            title="Right"
            shortcut={{ modifiers: ["opt"], key: "arrowRight" }}
            onAction={() => console.log("Go right")}
          />
          <Action title="Open" shortcut={Keyboard.Shortcut.Common.Open} onAction={() => console.log("Open")} />
        </ActionPanel>
      }
    />
  );
}
```

Example 2 (js):
```js
{
  macOS: { modifiers: ["cmd", "shift"], key: "c" },
  Windows: { modifiers: ["ctrl", "shift"], key: "c" },
}
```

Example 3 (typescript):
```typescript
KeyEquivalent: "a" |
  "b" |
  "c" |
  "d" |
  "e" |
  "f" |
  "g" |
  "h" |
  "i" |
  "j" |
  "k" |
  "l" |
  "m" |
  "n" |
  "o" |
  "p" |
  "q" |
  "r" |
  "s" |
  "t" |
  "u" |
  "v" |
  "w" |
  "x" |
  "y" |
  "z" |
  "0" |
  "1" |
  "2" |
  "3" |
  "4" |
  "5" |
  "6" |
  "7" |
  "8" |
  "9" |
  "." |
  "," |
  ";" |
  "=" |
  "+" |
  "-" |
  "[" |
  "]" |
  "{" |
  "}" |
  "«" |
  "»" |
  "(" |
  ")" |
  "/" |
  "\\" |
  "'" |
  "`" |
  "§" |
  "^" |
  "@" |
  "$" |
  "return" |
  "delete" |
  "deleteForward" |
  "tab" |
  "arrowUp" |
  "arrowDown" |
  "arrowLeft" |
  "arrowRight" |
  "pageUp" |
  "pageDown" |
  "home" |
  "end" |
  "space" |
  "escape" |
  "enter" |
  "backspace";
```

Example 4 (typescript):
```typescript
KeyModifier: "cmd" | "ctrl" | "opt" | "shift" | "alt" | "windows";
```

---

## Menu Bar Commands

**URL:** llms-txt#menu-bar-commands

**Contents:**
- Getting Started
- Lifecycle
  - From the root search
  - At a set interval
  - When the user clicks the command's icon / title in the menu bar
  - When Raycast is restarted
  - When a menu bar command is re-enabled in preferences
- Best practices
- API Reference
  - MenuBarExtra

The `MenuBarExtra` component can be used to create commands which populate the [extras](https://developer.apple.com/design/human-interface-guidelines/components/system-experiences/the-menu-bar#menu-bar-commands) section of macOS' menu bar.

{% hint style="info" %}
Menubar commands aren't available on Windows.
{% endhint %}

If you don't have an extension yet, follow the [getting started](https://developers.raycast.com/basics/getting-started) guide and then return to this page. Now that your extension is ready, let's open its `package.json` file and add a new entry to its `commands` array, ensuring its `mode` property is set to `menu-bar`. For this guide, let's add the following:

{% hint style="info" %}
Check out the [command properties entry](https://developers.raycast.com/information/manifest#command-properties) in the manifest file documentation for more detailed information on each of those properties.
{% endhint %}

Create `github-pull-requests.tsx` in your extensions `src/` folder and add the following:

If your development server is running, the command should appear in your root search, and running the command should result in the `GitHub` icon appearing in your menu bar.

![GitHub Pull Requests menu bar command](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d11d9547c3a590b50f9beacaf2211ee0056e4372%2Fmenu-bar-command.gif?alt=media)

{% hint style="info" %}
macOS has the final say on whether a given menu bar extra is displayed. If you have a lot of items there, it is possible that the command we just ran doesn't show up. If that's the case, try to clear up some space in the menu bar, either by closing some of the items you don't need or by hiding them using [HiddenBar](https://github.com/dwarvesf/hidden), [Bartender](https://www.macbartender.com/), or similar apps.
{% endhint %}

Of course, our pull request command wouldn't be of that much use if we had to tell it to update itself every single time. To add [background refresh](https://developers.raycast.com/information/lifecycle/background-refresh) to our command, we need to open the `package.json` file we modified earlier and add an `interval` key to the command configuration object:

Your root search should look similar to:

![Menu Bar Command - Activate Background Refresh](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-25f5659825806f33bb7cb303da04680bdb29bcbf%2Fmenu-bar-activate-command.webp?alt=media)

Running it once should activate it to:

![Menu Bar Command - Refresh](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8f655dafc225472ab9096af040de0243f651dfb3%2Fmenu-bar-refresh.webp?alt=media)

Although `menu-bar` commands can result in items permanently showing up in the macOS menu bar, they are not long-lived processes. Instead, as with other commands, Raycast loads them into memory on demand, executes their code and then tries to unload them at the next convenient time. There are five distinct events that can result in a `menu-bar`'s item being placed in the menu bar, so let's walk through each one.

### From the root search

Same as any other commands, `menu-bar` commands can be run directly from Raycast's root search. Eventually, they may result in a new item showing up in your menu bar (if you have enough room and if the command returns a `MenuBarExtra`), or in a previous item disappearing, if the command returns `null`. In this case, Raycast will load your command code, execute it, wait for the `MenuBarExtra`'s `isLoading` prop to switch to `false`, and unload the command.

{% hint style="danger" %}
If your command returns a `MenuBarExtra`, it *must* either not set `isLoading` - in which case Raycast will render and immediately unload the command, or set it to `true` while it's performing an async task (such as an API call) and then set it to `false` once it's done. Same as above, Raycast will load the command code, execute it, wait for `MenuBarExtra`'s `isLoading` prop to switch to `false`, and then unload the command.
{% endhint %}

### At a set interval

If your `menu-bar` command also makes use of [background refresh](https://developers.raycast.com/information/lifecycle/background-refresh) *and* it has background refresh activated, Raycast will run the command at set intervals. In your command, you can use `environment.launchType` to check whether it is launched in the background or by the user.

{% hint style="info" %}
To ease testing, commands configured to run in the background have an extra action in development mode:\
![Menu Bar Command - Run in Background](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5132ca095672c674588b6bc23879af43d9a303d9%2Fmenu-bar-run-in-background.webp?alt=media)
{% endhint %}

### When the user clicks the command's icon / title in the menu bar

One of the bigger differences to `view` or `no-view` commands is that `menu-bar` commands have an additional entry point: when the user clicks their item in the menu bar. If the item has a menu (i.e. `MenuBarExtra` provides at least one child), Raycast will load the command code, execute it and keep it in memory while the menu is open. When the menu closes (either by the user clicking outside, or by clicking a `MenuBarExtra.Item`), the command is then unloaded.

### When Raycast is restarted

This case assumes that your command has run at least once, resulting in an item being placed in the menu bar. If that's the case, quitting and starting Raycast again should put the same item in your menu bar. However, that item will be restored from Raycast's database - *not* by loading and executing the command.

### When a menu bar command is re-enabled in preferences

This case should work the same as when Raycast is restarted.

* make generous use of the [Cache API](https://developers.raycast.com/api-reference/cache) and our [Utilities](https://developers.raycast.com/utilities/getting-started) in order to provide quick feedback and ensure action handlers work as expected
* make sure you set `isLoading` to false when your command finishes executing
* avoid setting long titles in `MenuBarExtra`, `MenuBarExtra.Submenu` or `MenuBarExtra.Item`
* don't put identical `MenuBarExtra.Item`s at the same level (direct children of `MenuBarExtra` or in the same `Submenu`) as their `onAction` handlers will not be executed correctly

Adds an item to the menu bar, optionally with a menu attached in case its `children` prop is non-empty.

{% hint style="info" %}
`menu-bar` commands don't always need to return a `MenuBarExtra`. Sometimes it makes sense to remove an item from the menu bar, in which case you can write your command logic to return `null` instead.
{% endhint %}

| Prop      | Description                                                                                                                                                                                                                                                                   | Type                                                                                                | Default |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| children  | `MenuBarExtra.Item`s, `MenuBarExtra.Submenu`s, `MenuBarExtra.Separator` or a mix of either.                                                                                                                                                                                   | `React.ReactNode`                                                                                   | -       |
| icon      | The icon that is displayed in the menu bar.                                                                                                                                                                                                                                   | [`Image.ImageLike`](https://developers.raycast.com/user-interface/icons-and-images#image.imagelike) | -       |
| isLoading | Indicates to Raycast that it should not unload the command, as it is still executing. If you set make use of `isLoading`, you need to make sure you set it to `false` at the end of the task you are executing (such as an API call), so Raycast can then unload the command. | `boolean`                                                                                           | -       |
| title     | The string that is displayed in the menu bar.                                                                                                                                                                                                                                 | `string`                                                                                            | -       |
| tooltip   | A tooltip to display when the cursor hovers the item in the menu bar.                                                                                                                                                                                                         | `string`                                                                                            | -       |

### MenuBarExtra.Item

An item in the [MenuBarExtra](#menubarextra) or in a [MenuBarExtra.Submenu](#menubarextra.submenu).

{% tabs %}
{% tab title="ItemWithTitle.tsx" %}
An item that only provides a `title` prop will be rendered as disabled. Use this to create section titles.

{% tab title="ItemWithTitleAndIcon.tsx" %}
Similarly, an item that provides a `title` and an `icon` prop will also be rendered as disabled.

{% tab title="ItemWithAction.tsx" %}
An item that provides an `onAction` prop alongside `title` (and optionally `icon`) will *not* be rendered as disabled. When users click this item in the menu bar, the action handler will be executed.

{% tab title="ItemWithAlternate.tsx" %}
If an item provides another `MenuBarEtra.Item` via its `alternate`, prop, the second item will be shown then the user presses the ⌥ (opt) key. There are a few limitation:

1. The `alternate` item may not have a custom shortcut. Instead, it will inherit its parent's shortcut, with the addition of ⌥ (opt) as a modifier.
2. The `alternate` item may not also specify an alternate.
3. A parent item that provides an `alternate` may not use ⌥ (opt) as a modifier.

{% endtab %}
{% endtabs %}

| Prop                                    | Description                                                              | Type                                                                                                | Default |
| --------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The main title displayed for this item.                                  | `string`                                                                                            | -       |
| alternate                               | A MenuBarExtra.Item to be displayed when a user presses the ⌥ (opt) key. | `ReactElement<`[`MenuBarExtra.Item.Props`](#props)`>`                                               | -       |
| icon                                    | An optional icon for this item.                                          | [`Image.ImageLike`](https://developers.raycast.com/user-interface/icons-and-images#image.imagelike) | -       |
| onAction                                | An action handler called when the user clicks the item.                  | `(event:` [`MenuBarExtra.ActionEvent`](#menubarextra.actionevent)`) => void`                        | -       |
| shortcut                                | A shortcut used to invoke this item when its parent menu is open.        | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut)                    | -       |
| subtitle                                | The subtitle displayed for this item.                                    | `string`                                                                                            | -       |
| tooltip                                 | A tooltip to display when the cursor hovers the item.                    | `string`                                                                                            | -       |

### MenuBarExtra.Submenu

`MenuBarExtra.Submenu`s reveal their items when people interact with them. They're a good way to group items that naturally belong together, but keep in mind that submenus add complexity to your interface - so use them sparingly!

{% tabs %}
{% tab title="Bookmarks.tsx" %}

{% tab title="DisabledSubmenu.tsx" %}
Submenus with no children will show up as disabled.

{% endtab %}
{% endtabs %}

| Prop                                    | Description                                                                                 | Type                                                                                                | Default |
| --------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The main title displayed for this submenu.                                                  | `string`                                                                                            | -       |
| children                                | `MenuBarExtra.Item`s, `MenuBarExtra.Submenu`s, `MenuBarExtra.Separator` or a mix of either. | `React.ReactNode`                                                                                   | -       |
| icon                                    | An optional icon for this submenu.                                                          | [`Image.ImageLike`](https://developers.raycast.com/user-interface/icons-and-images#image.imagelike) | -       |

### MenuBarExtra.Section

An item to group related menu items. It has an optional title and a separator is added automatically between sections.

| Prop     | Description                       | Type              | Default |
| -------- | --------------------------------- | ----------------- | ------- |
| children | The item elements of the section. | `React.ReactNode` | -       |
| title    | Title displayed above the section | `string`          | -       |

### MenuBarExtra.ActionEvent

An interface describing Action events in callbacks.

| Property                               | Description                                                                                                                                                                       | Type                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| type<mark style="color:red;">\*</mark> | A type of the action event \* `left-click` is a left mouse click on the MenuBarExtra.Item or a Keyboard.Shortcut \* `right-click` is a right mouse click on the MenuBarExtra.Item | `"left-click"` or `"right-click"` |

**Examples:**

Example 1 (json):
```json
{
  "name": "github-pull-requests",
  "title": "Pull Requests",
  "subtitle": "GitHub",
  "description": "See your GitHub pull requests at a glance",
  "mode": "menu-bar"
},
```

Example 2 (typescript):
```typescript
import { MenuBarExtra } from "@raycast/api";

export default function Command() {
  return (
    <MenuBarExtra icon="https://github.githubassets.com/favicons/favicon.png" tooltip="Your Pull Requests">
      <MenuBarExtra.Item title="Seen" />
      <MenuBarExtra.Item
        title="Example Seen Pull Request"
        onAction={() => {
          console.log("seen pull request clicked");
        }}
      />
      <MenuBarExtra.Item title="Unseen" />
      <MenuBarExtra.Item
        title="Example Unseen Pull Request"
        onAction={() => {
          console.log("unseen pull request clicked");
        }}
      />
    </MenuBarExtra>
  );
}
```

Example 3 (json):
```json
{
  "name": "github-pull-requests",
  "title": "Pull Requests",
  "subtitle": "GitHub",
  "description": "See your GitHub pull requests at a glance",
  "mode": "menu-bar",
  "interval": "5m"
}
```

Example 4 (typescript):
```typescript
import { Icon, MenuBarExtra, open } from "@raycast/api";

const data = {
  archivedBookmarks: [{ name: "Google Search", url: "www.google.com" }],
  newBookmarks: [{ name: "Raycast", url: "www.raycast.com" }],
};

export default function Command() {
  return (
    <MenuBarExtra icon={Icon.Bookmark}>
      <MenuBarExtra.Section title="New">
        {data?.newBookmarks.map((bookmark) => (
          <MenuBarExtra.Item key={bookmark.url} title={bookmark.name} onAction={() => open(bookmark.url)} />
        ))}
      </MenuBarExtra.Section>
      <MenuBarExtra.Section title="Archived">
        {data?.archivedBookmarks.map((bookmark) => (
          <MenuBarExtra.Item key={bookmark.url} title={bookmark.name} onAction={() => open(bookmark.url)} />
        ))}
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
```

---

## Window Management

**URL:** llms-txt#window-management

**Contents:**
- API Reference
  - WindowManagement.getActiveWindow
  - WindowManagement.getWindowsOnActiveDesktop
  - WindowManagement.getDesktops
  - WindowManagement.setWindowBounds
- Types
  - WindowManagement.Window
  - WindowManagement.Desktop
  - WindowManagement.DesktopType

The Window Management API provides developers with some functions to create commands with some advanced logic to move [Window](#windowmanagement.window)s around.

{% hint style="info" %}
Some users might not have access to this API. If a user doesn't have access to Raycast Pro, they will be asked if they want to get access when your extension calls the Window Management API. If the user doesn't wish to get access, the API call will throw an error.

You can check if a user has access to the API using [`environment.canAccess(WindowManagement)`](https://developers.raycast.com/api-reference/environment).

The API is not accessible on Windows for now.
{% endhint %}

### WindowManagement.getActiveWindow

Gets the active [Window](#windowmanagement.window).

A Promise that resolves with the active [Window](#windowmanagement.window). If no window is active, the promise will be rejected.

### WindowManagement.getWindowsOnActiveDesktop

Gets the list of [Window](#windowmanagement.window)s on the active [Desktop](#windowmanagement.desktop).

A Promise that resolves with an array of Windows.

### WindowManagement.getDesktops

Gets the list of [Desktop](#windowmanagement.desktop)s available across all screens.

A Promise that resolves with the desktops.

### WindowManagement.setWindowBounds

Move a [Window](#windowmanagement.window) or make it fullscreen.

| Name                                      | Description | Type                                                                                                                                                                      |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options<mark style="color:red;">\*</mark> |             | `{ id: string }` or `{ bounds: { position?: { x?: number; y?: number }; size?: { height?: number; width?: number } }; desktopId?: string }` or `{ bounds: "fullscreen" }` |

A Promise that resolves with the window was moved. If the move isn't possible (for example trying to make a window fullscreen that doesn't support it), the promise will be rejected.

### WindowManagement.Window

A Window from an [Application](https://developers.raycast.com/utilities#application) on a [Desktop](#windowmanagement.desktop).

| Property                                             | Description | Type                                                                                                |
| ---------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| active<mark style="color:red;">\*</mark>             |             | `boolean`                                                                                           |
| bounds<mark style="color:red;">\*</mark>             |             | `{ position: { x: number; y: number }; size: { height: number; width: number } }` or `"fullscreen"` |
| desktopId<mark style="color:red;">\*</mark>          |             | `string`                                                                                            |
| fullScreenSettable<mark style="color:red;">\*</mark> |             | `boolean`                                                                                           |
| id<mark style="color:red;">\*</mark>                 |             | `string`                                                                                            |
| positionable<mark style="color:red;">\*</mark>       |             | `boolean`                                                                                           |
| resizable<mark style="color:red;">\*</mark>          |             | `boolean`                                                                                           |
| application                                          |             | [`Application`](https://developers.raycast.com/utilities#application)                               |

### WindowManagement.Desktop

A Desktop represents a virtual desktop on a Screen.

| Property                                   | Description | Type                                                            |
| ------------------------------------------ | ----------- | --------------------------------------------------------------- |
| active<mark style="color:red;">\*</mark>   |             | `boolean`                                                       |
| id<mark style="color:red;">\*</mark>       |             | `string`                                                        |
| screenId<mark style="color:red;">\*</mark> |             | `string`                                                        |
| size<mark style="color:red;">\*</mark>     |             | `{ height: number; width: number }`                             |
| type<mark style="color:red;">\*</mark>     |             | [`WindowManagement.DesktopType`](#windowmanagement.desktoptype) |

### WindowManagement.DesktopType

The type of a [Desktop](#windowmanagement.desktop).

#### Enumeration members

| Name       | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| User       | The default Desktop type. It can contain any number of [Window](#windowmanagement.window) |
| FullScreen | A Desktop made of a single fullscreen window                                              |

**Examples:**

Example 1 (typescript):
```typescript
async function getActiveWindow(): Promise<Window>;
```

Example 2 (typescript):
```typescript
import { WindowManagement, showToast } from "@raycast/api";

export default async function Command() {
  try {
    const window = await WindowManagement.getActiveWindow();
    if (window.positionable) {
      await WindowManagement.setWindowBounds({ id: window.id, bounds: { position: { x: 100 } } });
    }
  } catch (error) {
    showToast({ title: `Could not move window: ${error.message}`, style: Toast.Style.Failure });
  }
}
```

Example 3 (typescript):
```typescript
async function getWindowsOnActiveDesktop(): Promise<Window[]>;
```

Example 4 (typescript):
```typescript
import { WindowManagement, showToast } from "@raycast/api";

export default async function Command() {
  const windows = await WindowManagement.getWindowsOnActiveDesktop();
  const chrome = windows.find((x) => x.application?.bundleId === "com.google.Chrome");
  if (!chrome) {
    showToast({ title: "Couldn't find chrome", style: Toast.Style.Failure });
    return;
  }
  WindowManagement.setWindowBounds({ id: chrome.id, bounds: { position: { x: 100 } } });
}
```

---

## Environment

**URL:** llms-txt#environment

**Contents:**
- API Reference
  - environment
  - environment.canAccess
  - getSelectedFinderItems
  - getSelectedText
- Types
  - FileSystemItem
  - LaunchType

The Environment APIs are useful to get context about the setup in which your command runs. You can get information about the extension and command itself as well as Raycast. Furthermore, a few paths are injected and are helpful to construct file paths that are related to the command's assets.

Contains environment values such as the Raycast version, extension info, and paths.

| Property                                            | Description                                                                                                                       | Type                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| appearance<mark style="color:red;">\*</mark>        | The appearance used by the Raycast application.                                                                                   | `"dark"` or `"light"`                   |
| assetsPath<mark style="color:red;">\*</mark>        | The absolute path to the assets directory of the extension.                                                                       | `string`                                |
| commandMode<mark style="color:red;">\*</mark>       | The mode of the launched command, as specified in package.json                                                                    | `"view"` or `"no-view"` or `"menu-bar"` |
| commandName<mark style="color:red;">\*</mark>       | The name of the launched command, as specified in package.json                                                                    | `string`                                |
| extensionName<mark style="color:red;">\*</mark>     | The name of the extension, as specified in package.json                                                                           | `string`                                |
| isDevelopment<mark style="color:red;">\*</mark>     | Indicates whether the command is a development command (vs. an installed command from the Store).                                 | `boolean`                               |
| launchType<mark style="color:red;">\*</mark>        | The type of launch for the command (user initiated or background).                                                                | [`LaunchType`](#launchtype)             |
| ownerOrAuthorName<mark style="color:red;">\*</mark> | The name of the extension owner (if any) or author, as specified in package.json                                                  | `string`                                |
| raycastVersion<mark style="color:red;">\*</mark>    | The version of the main Raycast app                                                                                               | `string`                                |
| supportPath<mark style="color:red;">\*</mark>       | The absolute path for the support directory of an extension. Use it to read and write files related to your extension or command. | `string`                                |
| textSize<mark style="color:red;">\*</mark>          | The text size used by the Raycast application.                                                                                    | `"medium"` or `"large"`                 |
| canAccess<mark style="color:red;">\*</mark>         |                                                                                                                                   | `(api: unknown) => boolean`             |

### environment.canAccess

Checks whether the user can access a specific API or not.

A Boolean indicating whether the user running the command has access to the API.

### getSelectedFinderItems

Gets the selected items from Finder.

A Promise that resolves with the [selected file system items](#filesystemitem). If Finder is not the frontmost application, the promise will be rejected.

Gets the selected text of the frontmost application.

A Promise that resolves with the selected text. If no text is selected in the frontmost application, the promise will be rejected.

Holds data about a File System item. Use the [getSelectedFinderItems](#getselectedfinderitems) method to retrieve values.

| Property                               | Description          | Type     |
| -------------------------------------- | -------------------- | -------- |
| path<mark style="color:red;">\*</mark> | The path to the item | `string` |

Indicates the type of command launch. Use this to detect whether the command has been launched from the background.

#### Enumeration members

| Name          | Description                                                |
| ------------- | ---------------------------------------------------------- |
| UserInitiated | A regular launch through user interaction                  |
| Background    | Scheduled through an interval and launched from background |

**Examples:**

Example 1 (typescript):
```typescript
import { environment } from "@raycast/api";

export default async function Command() {
  console.log(`Raycast version: ${environment.raycastVersion}`);
  console.log(`Owner or Author name: ${environment.ownerOrAuthorName}`);
  console.log(`Extension name: ${environment.extensionName}`);
  console.log(`Command name: ${environment.commandName}`);
  console.log(`Command mode: ${environment.commandMode}`);
  console.log(`Assets path: ${environment.assetsPath}`);
  console.log(`Support path: ${environment.supportPath}`);
  console.log(`Is development mode: ${environment.isDevelopment}`);
  console.log(`Appearance: ${environment.appearance}`);
  console.log(`Text size: ${environment.textSize}`);
  console.log(`LaunchType: ${environment.launchType}`);
}
```

Example 2 (typescript):
```typescript
function canAccess(api: any): bool;
```

Example 3 (typescript):
```typescript
import { AI, showHUD, environment } from "@raycast/api";
import fs from "fs";

export default async function main() {
  if (environment.canAccess(AI)) {
    const answer = await AI.ask("Suggest 5 jazz songs");
    await Clipboard.copy(answer);
  } else {
    await showHUD("You don't have access :(");
  }
}
```

Example 4 (typescript):
```typescript
async function getSelectedFinderItems(): Promise<FileSystemItem[]>;
```

---

## OAuth Utils

**URL:** llms-txt#oauth-utils

**Contents:**
- Using a built-in provider
- Using your own client
- Using `onAuthorize` to initialize an SDK or similar

Dealing with OAuth can be tedious. So we've built a set of utilities to make that task way easier. There are two part to our utilities:

1. Authenticating with a service using [OAuthService](https://developers.raycast.com/utilities/oauth/oauthservice) or built-in providers (e.g GitHub with `OAuthService.github`)
2. Bringing authentication to Raycast commands using [withAccessToken](https://developers.raycast.com/utilities/oauth/withaccesstoken) and [`getAccessToken`](https://developers.raycast.com/utilities/oauth/getaccesstoken)

`OAuthService`, `withAccessToken`, and `getAccessToken` are designed to work together. You'll find below different use cases for which you can use these utils.

## Using a built-in provider

We provide built-in providers that you can use out of the box, such as GitHub or Linear. You don't need to configure anything for them apart from the scope your extension requires.

You can see our different providers on the following page: [OAuthService](https://developers.raycast.com/utilities/oauth/oauthservice)

## Using your own client

## Using `onAuthorize` to initialize an SDK or similar

This example is useful in cases where you want to initialize a third-party client and share it throughout your codebase.

**Examples:**

Example 1 (tsx):
```tsx
import { Detail, LaunchProps } from "@raycast/api";
import { withAccessToken, getAccessToken, OAuthService } from "@raycast/utils";

const github = OAuthService.github({
  scope: "notifications repo read:org read:user read:project",
});

function AuthorizedComponent(props: LaunchProps) {
  const { token } = getAccessToken();
  return <Detail markdown={`Access token: ${token}`} />;
}

export default withAccessToken(github)(AuthorizedComponent);
```

Example 2 (tsx):
```tsx
import { OAuth, Detail, LaunchProps } from "@raycast/api";
import { withAccessToken, getAccessToken, OAuthService } from "@raycast/utils";

const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Your Provider Name",
  providerIcon: "provider_icon.png",
  providerId: "yourProviderId",
  description: "Connect your {PROVIDER_NAME} account",
});

const provider = new OAuthService({
  client,
  clientId: "YOUR_CLIENT_ID",
  scope: "YOUR_SCOPES",
  authorizeUrl: "YOUR_AUTHORIZE_URL",
  tokenUrl: "YOUR_TOKEN_URL",
});

function AuthorizedComponent(props: LaunchProps) {
  const { token } = getAccessToken();
  return <Detail markdown={`Access token: ${token}`} />;
}

export default withAccessToken(provider)(AuthorizedComponent);
```

Example 3 (tsx):
```tsx
import { OAuthService } from "@raycast/utils";
import { LinearClient, LinearGraphQLClient } from "@linear/sdk";

let linearClient: LinearClient | null = null;

export const linear = OAuthService.linear({
  scope: "read write",
  onAuthorize({ token }) {
    linearClient = new LinearClient({ accessToken: token });
  },
});

export function withLinearClient<T>(Component: React.ComponentType<T>) {
  return withAccessToken<T>(linear)(Component);
}

export function getLinearClient(): { linearClient: LinearClient; graphQLClient: LinearGraphQLClient } {
  if (!linearClient) {
    throw new Error("No linear client initialized");
  }

  return { linearClient, graphQLClient: linearClient.client };
}
```

---

## useLocalStorage

**URL:** llms-txt#uselocalstorage

**Contents:**
- Signature
  - Arguments
  - Return
- Example

A hook to manage a value in the local storage.

* `key` - The key to use for the value in the local storage.
* `initialValue` - The initial value to use if the key doesn't exist in the local storage.

Returns an object with the following properties:

* `value` - The value from the local storage or the initial value if the key doesn't exist.
* `setValue` - A function to update the value in the local storage.
* `removeValue` - A function to remove the value from the local storage.
* `isLoading` - A boolean indicating if the value is loading.

**Examples:**

Example 1 (ts):
```ts
function useLocalStorage<T>(key: string, initialValue?: T): {
  value: T | undefined;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  isLoading: boolean;
}
```

Example 2 (tsx):
```tsx
import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";

const exampleTodos = [
  { id: "1", title: "Buy milk", done: false },
  { id: "2", title: "Walk the dog", done: false },
  { id: "3", title: "Call mom", done: false },
];

export default function Command() {
  const { value: todos, setValue: setTodos, isLoading } = useLocalStorage("todos", exampleTodos);

  async function toggleTodo(id: string) {
    const newTodos = todos?.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)) ?? [];
    await setTodos(newTodos);
  }

  return (
    <List isLoading={isLoading}>
      {todos?.map((todo) => (
        <List.Item
          icon={todo.done ? { source: Icon.Checkmark, tintColor: Color.Green } : Icon.Circle}
          key={todo.id}
          title={todo.title}
          actions={
            <ActionPanel>
              <Action title={todo.done ? "Uncomplete" : "Complete"} onAction={() => toggleTodo(todo.id)} />
              <Action title="Delete" style={Action.Style.Destructive} onAction={() => toggleTodo(todo.id)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

---

## Clipboard

**URL:** llms-txt#clipboard

**Contents:**
- API Reference
  - Clipboard.copy
  - Clipboard.paste
  - Clipboard.clear
  - Clipboard.read
  - Clipboard.readText
- Types
  - Clipboard.Content
  - Clipboard.ReadContent
  - Clipboard.CopyOptions

Use the Clipboard APIs to work with content from your clipboard. You can write contents to the clipboard through [`Clipboard.copy`](#clipboard.copy) and clear it through [`Clipboard.clear`](#clipboard.clear). The [`Clipboard.paste`](#clipboard.paste) function inserts text at the current cursor position in your frontmost app.

The action [`Action.CopyToClipboard`](https://developers.raycast.com/user-interface/actions#action.copytoclipboard) can be used to copy content of a selected list item to the clipboard and the action [`Action.Paste`](https://developers.raycast.com/user-interface/actions#action.paste) can be used to insert text in your frontmost app.

Copies text or a file to the clipboard.

| Name                                      | Description                           | Type                                                              |
| ----------------------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| content<mark style="color:red;">\*</mark> | The content to copy to the clipboard. | `string` or `number` or [`Clipboard.Content`](#clipboard.content) |
| options                                   | Options for the copy operation.       | [`Clipboard.CopyOptions`](#clipboard.copyoptions)                 |

A Promise that resolves when the content is copied to the clipboard.

Pastes text or a file to the current selection of the frontmost application.

| Name                                      | Description                          | Type                                                              |
| ----------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| content<mark style="color:red;">\*</mark> | The content to insert at the cursor. | `string` or `number` or [`Clipboard.Content`](#clipboard.content) |

A Promise that resolves when the content is pasted.

Clears the current clipboard contents.

A Promise that resolves when the clipboard is cleared.

Reads the clipboard content as plain text, file name, or HTML.

| Name           | Description                                                                                | Type     |
| -------------- | ------------------------------------------------------------------------------------------ | -------- |
| options        | Options for the read operation.                                                            | `Object` |
| options.offset | Specify an offset to access the Clipboard History. Minimum value is 0, maximum value is 5. | `number` |

A promise that resolves when the clipboard content was read as plain text, file name, or HTML.

### Clipboard.readText

Reads the clipboard as plain text.

| Name           | Description                                                                                | Type     |
| -------------- | ------------------------------------------------------------------------------------------ | -------- |
| options        | Options for the readText operation.                                                        | `Object` |
| options.offset | Specify an offset to access the Clipboard History. Minimum value is 0, maximum value is 5. | `number` |

A promise that resolves once the clipboard content is read as plain text.

### Clipboard.Content

Type of content that is copied and pasted to and from the Clipboard

### Clipboard.ReadContent

Type of content that is read from the Clipboard

### Clipboard.CopyOptions

Type of options passed to `Clipboard.copy`.

| Property  | Description                                                                                                            | Type      |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | --------- |
| concealed | Indicates whether the content be treated as confidential. If `true`, it will not be recorded in the Clipboard History. | `boolean` |

**Examples:**

Example 1 (typescript):
```typescript
async function copy(content: string | number | Content, options?: CopyOptions): Promise<void>;
```

Example 2 (typescript):
```typescript
import { Clipboard } from "@raycast/api";

export default async function Command() {
  // copy some text
  await Clipboard.copy("https://raycast.com");

  const textContent: Clipboard.Content = {
    text: "https://raycast.com",
  };
  await Clipboard.copy(textContent);

  // copy a file
  const file = "/path/to/file.pdf";
  try {
    const fileContent: Clipboard.Content = { file };
    await Clipboard.copy(fileContent);
  } catch (error) {
    console.log(`Could not copy file '${file}'. Reason: ${error}`);
  }

  // copy confidential data
  await Clipboard.copy("my-secret-password", { concealed: true });
}
```

Example 3 (typescript):
```typescript
async function paste(content: string | Content): Promise<void>;
```

Example 4 (typescript):
```typescript
import { Clipboard } from "@raycast/api";

export default async function Command() {
  await Clipboard.paste("I really like Raycast's API");
}
```

---

## OAuth

**URL:** llms-txt#oauth

**Contents:**
- Prerequisites
- OAuth Flow
- OAuth App
- Authorizing
- Token Storage
- Token Refresh
- Examples
- API Reference
  - OAuth.PKCEClient
  - OAuth.PKCEClient#authorizationRequest

A Raycast extension can use OAuth for authorizing access to a provider's resources on the user's behalf. Since Raycast is a desktop app and the extensions are considered "public", we only support the [PKCE flow](https://datatracker.ietf.org/doc/html/rfc7636) (Proof Key for Code Exchange, pronounced “pixy”). This flow is the official recommendation for native clients that cannot keep a client secret. With PKCE, the client dynamically creates a secret and uses the secret again during code exchange, ensuring that only the client that performed the initial request can exchange the code for the access token (”proof of possession”).

{% hint style="info" %}
Providers such as Google, Twitter, GitLab, Spotify, Zoom, Asana or Dropbox are all PKCE-ready.

However, if your provider doesn't support PKCE, you can use our [PKCE proxy](https://oauth.raycast.com). It allows extensions to securely use an OAuth flow without exposing any secret.
{% endhint %}

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-73fbf2da0684ab57bbdba779e06b3bbcfb895a01%2Foauth-overlay-twitter.webp?alt=media)

The OAuth flow from an extension looks like this:

1. The extension initiates the OAuth flow and starts authorization
2. Raycast shows the OAuth overlay ("Connect to provider…")
3. The user opens the provider's consent page in the web browser
4. After the user consent, the provider redirects back to Raycast
5. Raycast opens the extension where authorization is completed

When the flow is complete, the extension has received an access token from the provider and can perform API calls.\
The API provides functions for securely storing and retrieving token sets, so that an extension can check whether the user is already logged in and whether an expired access token needs to be refreshed. Raycast also automatically shows a logout preference.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fa10ad21218f2a0f28d9a4fef60575518e1c0f1a%2Foauth-overlay-twitter-success.webp?alt=media)

You first need to register a new OAuth app with your provider. This is usually done in the provider's developer portal. After registering, you will receive a client ID. You also need to configure a redirect URI, see the next section.

Note: Make sure to choose an app type that supports PKCE. Some providers still show you a client secret, which you don't need and should *not* hardcode in the extension, or support PKCE only for certain types such as "desktop", "native" or "mobile" app types.

An extension can initiate the OAuth flow and authorize by using the methods on [OAuth.PKCEClient](#oauth.pkceclient).

You can create a new client and configure it with a provider name, icon and description that will be shown in the OAuth overlay. You can also choose between different redirect methods; depending on which method you choose, you need to configure this value as redirect URI in your provider's registered OAuth app. (See the [OAuth.RedirectMethod](#oauth.redirectmethod) docs for each method to get concrete examples for supported redirect URI.) If you can choose, use `OAuth.RedirectMethod.Web` and enter `https://raycast.com/redirect?packageName=Extension` (whether you have to add the `?packageName=Extension` depends on the provider).

Next you create an authorization request with the authorization endpoint, client ID, and scope values. You receive all values from your provider's docs and when you register a new OAuth app.

The returned [AuthorizationRequest](#oauth.authorizationrequest) contains parameters such as the code challenge, verifier, state and redirect URI as standard OAuth authorization request. You can also customize the authorization URL through [OAuth.AuthorizationOptions](#oauth.authorizationoptions) if you need to.

To get the authorization code needed for the token exchange, you call [authorize](#oauth.pkceclient-authorize) with the request from the previous step.\
This call shows the Raycast OAuth overlay and provides the user with an option to open the consent page in the web browser.\
The authorize promise is resolved after the redirect back to Raycast and into the extension:

{% hint style="info" %}
When in development mode, make sure not to trigger auto-reloading (e.g. by saving a file) while you're testing an active OAuth authorization and redirect. This would cause an OAuth state mismatch when you're redirected back into the extension since the client would be reinitialized on reload.
{% endhint %}

Now that you have received the authorization code, you can exchange this code for an access token using your provider's token endpoint. This token exchange (and the following API calls) can be done with your preferred Node HTTP client library. Example using `node-fetch`:

The PKCE client exposes methods for storing, retrieving and deleting token sets. A [TokenSet](#oauth.tokenset) contains an access token and typically also a refresh token, expires value, and the current scope. Since this data is returned by the provider's token endpoint as standard OAuth JSON response, you can directly store the response ([OAuth.TokenResponse](#oauth.tokenresponse)) or alternatively use [OAuth.TokenSetOptions](#oauth.tokensetoptions):

Once the token set is stored, Raycast will automatically show a logout preference for the extension. When the user logs out, the token set gets removed.

The [TokenSet](#oauth.tokenset) also enables you to check whether the user is logged in before starting the authorization flow:

Since access tokens usually expire, an extension should provide a way to refresh the access token, otherwise users would be logged out or see errors.\
Some providers require you to add an offline scope so that you get a refresh token. (Twitter, for example, needs the scope `offline.access` or it only returns an access token.)\
A basic refresh flow could look like this:

This code would run before starting the authorization flow. It checks the presence of a token set to see whether the user is logged in and then checks whether there is a refresh token and the token set is expired (through the convenience method `isExpired()` on the [TokenSet](#oauth.tokenset)). If it is expired, the token is refreshed and updated in the token set. Example using `node-fetch`:

We've provided [OAuth example integrations for Google, Twitter, and Dropbox](https://github.com/raycast/extensions/tree/main/examples/api-examples) that demonstrate the entire flow shown above.

Use [OAuth.PKCEClient.Options](#oauth.pkceclient.options) to configure what's shown on the OAuth overlay.

| Method                                                                                                          |
| --------------------------------------------------------------------------------------------------------------- |
| [`authorizationRequest(options: AuthorizationRequestOptions): Promise`](#oauth.pkceclient-authorizationrequest) |
| [`authorize(options: AuthorizationRequest \| AuthorizationOptions): Promise`](#oauth.pkceclient-authorize)      |
| [`setTokens(options: TokenSetOptions \| TokenResponse): Promise`](#oauth.pkceclient-settokens)                  |
| [`getTokens(): Promise<TokenSet \| undefined>`](#oauth.pkceclient-gettokens)                                    |
| [`removeTokens(): Promise`](#oauth.pkceclient-removetokens)                                                     |

### OAuth.PKCEClient#authorizationRequest

Creates an authorization request for the provided authorization endpoint, client ID, and scopes. You need to first create the authorization request before calling [authorize](#oauth.pkceclient-authorize).

The generated code challenge for the PKCE request uses the S256 method.

| Name                                      | Type                                                                | Description                                           |
| ----------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| options<mark style="color:red;">\*</mark> | [`AuthorizationRequestOptions`](#oauth.authorizationrequestoptions) | The options used to create the authorization request. |

A promise for an [AuthorizationRequest](#oauth.authorizationrequest) that you can use as input for [authorize](#oauth.pkceclient-authorize).

### OAuth.PKCEClient#authorize

Starts the authorization and shows the OAuth overlay in Raycast. As parameter you can either directly use the returned request from [authorizationRequest](#oauth.authorizationrequest), or customize the URL by extracting parameters from [AuthorizationRequest](#oauth.authorizationrequest) and providing your own URL via [AuthorizationOptions](#oauth.authorizationoptions). Eventually the URL will be used to open the authorization page of the provider in the web browser.

| Name                                      | Type                                                                                                             | Description                    |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| options<mark style="color:red;">\*</mark> | [`AuthorizationRequest`](#oauth.authorizationrequest) `\|` [`AuthorizationOptions`](#oauth.authorizationoptions) | The options used to authorize. |

A promise for an [AuthorizationResponse](#oauth.authorizationresponse), which contains the authorization code needed for the token exchange. The promise is resolved when the user was redirected back from the provider's authorization page to the Raycast extension.

### OAuth.PKCEClient#setTokens

Securely stores a [TokenSet](#oauth.tokenset) for the provider. Use this after fetching the access token from the provider. If the provider returns a a standard OAuth JSON token response, you can directly pass the [TokenResponse](#oauth.tokenresponse).\
At a minimum, you need to set the `accessToken`, and typically you also set `refreshToken` and `isExpired`.

Raycast automatically shows a logout preference for the extension when a token set was saved.

If you want to make use of the convenience `isExpired()` method, the property `expiresIn` must be configured.

| Name                                      | Type                                                                                     | Description                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------- |
| options<mark style="color:red;">\*</mark> | [`TokenSetOptions`](#oauth.tokensetoptions) `\|` [`TokenResponse`](#oauth.tokenresponse) | The options used to store the token set. |

A promise that resolves when the token set has been stored.

### OAuth.PKCEClient#getTokens

Retrieves the stored [TokenSet](#oauth.tokenset) for the client. You can use this to initially check whether the authorization flow should be initiated or the user is already logged in and you might have to refresh the access token.

A promise that resolves when the token set has been retrieved.

### OAuth.PKCEClient#removeTokens

Removes the stored [TokenSet](#oauth.tokenset) for the client.\
Raycast automatically shows a logout preference that removes the token set. Use this method only if you need to provide an additional logout option in your extension or you want to remove the token set because of a migration.

A promise that resolves when the token set has been removed.

### OAuth.PKCEClient.Options

The options for creating a new [PKCEClient](#oauth.pkceclient).

| Property                                         | Description                                                                                                                                                                                                                             | Type                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| providerName<mark style="color:red;">\*</mark>   | The name of the provider, displayed in the OAuth overlay.                                                                                                                                                                               | `string`                                                                                            |
| redirectMethod<mark style="color:red;">\*</mark> | The redirect method for the OAuth flow. Make sure to set this to the correct method for the provider, see OAuth.RedirectMethod for more information.                                                                                    | [`OAuth.RedirectMethod`](#oauth.redirectmethod)                                                     |
| description                                      | An optional description, shown in the OAuth overlay. You can use this to customize the message for the end user, for example for handling scope changes or other migrations. Raycast shows a default message if this is not configured. | `string`                                                                                            |
| providerIcon                                     | An icon displayed in the OAuth overlay. Make sure to provide at least a size of 64x64 pixels.                                                                                                                                           | [`Image.ImageLike`](https://developers.raycast.com/user-interface/icons-and-images#image.imagelike) |
| providerId                                       | An optional ID for associating the client with a provider. Only set this if you use multiple different clients in your extension.                                                                                                       | `string`                                                                                            |

### OAuth.RedirectMethod

Defines the supported redirect methods for the OAuth flow. You can choose between web and app-scheme redirect methods, depending on what the provider requires when setting up the OAuth app. For examples on what redirect URI you need to configure, see the docs for each method.

#### Enumeration members

| Name   | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web    | <p>Use this type for a redirect back to the Raycast website, which will then open the extension. In the OAuth app, configure <code><https://raycast.com/redirect?packageName=Extension></code><br>(This is a static redirect URL for all extensions.)<br>If the provider does not accept query parameters in redirect URLs, you can alternatively use <code><https://raycast.com/redirect/extension></code> and then customize the <a href="#oauth.authorizationrequest">AuthorizationRequest</a> via its <code>extraParameters</code> property. For example add: <code>extraParameters: { "redirect\_uri": "<https://raycast.com/redirect/extension>" }</code></p> |
| App    | Use this type for an app-scheme based redirect that directly opens Raycast. In the OAuth app, configure `raycast://oauth?package_name=Extension`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| AppURI | <p>Use this type for a URI-style app scheme that directly opens Raycast. In the OAuth app, configure <code>com.raycast:/oauth?package\_name=Extension</code><br>(Note the single slash – Google, for example, would require this flavor for an OAuth app where the Bundle ID is <code>com.raycast</code>)</p>                                                                                                                                                                                                                                                                                                                                                       |

### OAuth.AuthorizationRequestOptions

The options for an authorization request via [authorizationRequest](#oauth.authorizationrequest).

| Property                                   | Description                                                                                                                                                                                                                                                                            | Type                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| clientId<mark style="color:red;">\*</mark> | The client ID of the configured OAuth app.                                                                                                                                                                                                                                             | `string`               |
| endpoint<mark style="color:red;">\*</mark> | The URL to the authorization endpoint for the OAuth provider.                                                                                                                                                                                                                          | `string`               |
| scope<mark style="color:red;">\*</mark>    | A space-delimited list of scopes for identifying the resources to access on the user's behalf. The scopes are typically shown to the user on the provider's consent screen in the browser. Note that some providers require the same scopes be configured in the registered OAuth app. | `string`               |
| extraParameters                            | Optional additional parameters for the authorization request. Note that some providers require additional parameters, for example to obtain long-lived refresh tokens.                                                                                                                 | `{ [string]: string }` |

### OAuth.AuthorizationRequestURLParams

Values of [AuthorizationRequest](#oauth.authorizationrequest).\
The PKCE client automatically generates the values for you and returns them for [authorizationRequest](#oauth.authorizationrequest)

| Property                                        | Description                      | Type     |
| ----------------------------------------------- | -------------------------------- | -------- |
| codeChallenge<mark style="color:red;">\*</mark> | The PKCE `code_challenge` value. | `string` |
| codeVerifier<mark style="color:red;">\*</mark>  | The PKCE `code_verifier` value.  | `string` |
| redirectURI<mark style="color:red;">\*</mark>   | The OAuth `redirect_uri` value.  | `string` |
| state<mark style="color:red;">\*</mark>         | The OAuth `state` value.         | `string` |

### OAuth.AuthorizationRequest

The request returned by [authorizationRequest](#oauth.authorizationrequest).\
Can be used as direct input to [authorize](#oauth.pkceclient-authorize), or to extract parameters for constructing a custom URL in [AuthorizationOptions](#oauth.authorizationoptions).

| Property                                        | Description                      | Type           |
| ----------------------------------------------- | -------------------------------- | -------------- |
| codeChallenge<mark style="color:red;">\*</mark> | The PKCE `code_challenge` value. | `string`       |
| codeVerifier<mark style="color:red;">\*</mark>  | The PKCE `code_verifier` value.  | `string`       |
| redirectURI<mark style="color:red;">\*</mark>   | The OAuth `redirect_uri` value.  | `string`       |
| state<mark style="color:red;">\*</mark>         | The OAuth `state` value.         | `string`       |
| toURL<mark style="color:red;">\*</mark>         |                                  | `() => string` |

| Name    | Type           | Description                            |
| ------- | -------------- | -------------------------------------- |
| toURL() | `() => string` | Constructs the full authorization URL. |

### OAuth.AuthorizationOptions

Options for customizing [authorize](#oauth.pkceclient-authorize).\
You can use values from [AuthorizationRequest](#oauth.authorizationrequest) to build your own URL.

| Property                              | Description                 | Type     |
| ------------------------------------- | --------------------------- | -------- |
| url<mark style="color:red;">\*</mark> | The full authorization URL. | `string` |

### OAuth.AuthorizationResponse

The response returned by [authorize](#oauth.pkceclient-authorize), containing the authorization code after the provider redirect. You can then exchange the authorization code for an access token using the provider's token endpoint.

| Property                                            | Description                                     | Type     |
| --------------------------------------------------- | ----------------------------------------------- | -------- |
| authorizationCode<mark style="color:red;">\*</mark> | The authorization code from the OAuth provider. | `string` |

Describes the TokenSet created from an OAuth provider's token response. The `accessToken` is the only required parameter but typically OAuth providers also return a refresh token, an expires value, and the scope.\
Securely store a token set via [setTokens](#oauth.pkceclient-settokens) and retrieve it via [getTokens](#oauth.pkceclient-gettokens).

| Property                                      | Description                                                                                                                                                                                                                                                                      | Type                                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| accessToken<mark style="color:red;">\*</mark> | The access token returned by an OAuth token request.                                                                                                                                                                                                                             | `string`                                                                                        |
| updatedAt<mark style="color:red;">\*</mark>   | The date when the token set was stored via OAuth.PKCEClient.setTokens.                                                                                                                                                                                                           | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| isExpired<mark style="color:red;">\*</mark>   |                                                                                                                                                                                                                                                                                  | `() => boolean`                                                                                 |
| expiresIn                                     | An optional expires value (in seconds) returned by an OAuth token request.                                                                                                                                                                                                       | `number`                                                                                        |
| idToken                                       | An optional id token returned by an identity request (e.g. /me, Open ID Connect).                                                                                                                                                                                                | `string`                                                                                        |
| refreshToken                                  | An optional refresh token returned by an OAuth token request.                                                                                                                                                                                                                    | `string`                                                                                        |
| scope                                         | The optional space-delimited list of scopes returned by an OAuth token request. You can use this to compare the currently stored access scopes against new access scopes the extension might require in a future version, and then ask the user to re-authorize with new scopes. | `string`                                                                                        |

| Name        | Type            | Description                                                                                                                                                                                                                                          |
| ----------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isExpired() | `() => boolean` | A convenience method for checking whether the access token has expired. The method factors in some seconds of "buffer", so it returns true a couple of seconds before the actual expiration time. This requires the `expiresIn` parameter to be set. |

### OAuth.TokenSetOptions

Options for a [TokenSet](#oauth.tokenset) to store via [setTokens](#oauth.pkceclient-settokens).

| Property                                      | Description                                                                       | Type     |
| --------------------------------------------- | --------------------------------------------------------------------------------- | -------- |
| accessToken<mark style="color:red;">\*</mark> | The access token returned by an OAuth token request.                              | `string` |
| expiresIn                                     | An optional expires value (in seconds) returned by an OAuth token request.        | `number` |
| idToken                                       | An optional id token returned by an identity request (e.g. /me, Open ID Connect). | `string` |
| refreshToken                                  | An optional refresh token returned by an OAuth token request.                     | `string` |
| scope                                         | The optional scope value returned by an OAuth token request.                      | `string` |

### OAuth.TokenResponse

Defines the standard JSON response for an OAuth token request.\
The response can be directly used to store a [TokenSet](#oauth.tokenset) via [setTokens](#oauth.pkceclient-settokens).

| Property                                        | Description                                                                               | Type     |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- | -------- |
| access\_token<mark style="color:red;">\*</mark> | The `access_token` value returned by an OAuth token request.                              | `string` |
| expires\_in                                     | An optional `expires_in` value (in seconds) returned by an OAuth token request.           | `number` |
| id\_token                                       | An optional `id_token` value returned by an identity request (e.g. /me, Open ID Connect). | `string` |
| refresh\_token                                  | An optional `refresh_token` value returned by an OAuth token request.                     | `string` |
| scope                                           | The optional `scope` value returned by an OAuth token request.                            | `string` |

**Examples:**

Example 1 (typescript):
```typescript
import { OAuth } from "@raycast/api";

const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Twitter",
  providerIcon: "twitter-logo.png",
  description: "Connect your Twitter account…",
});
```

Example 2 (typescript):
```typescript
const authRequest = await client.authorizationRequest({
  endpoint: "https://twitter.com/i/oauth2/authorize",
  clientId: "YourClientId",
  scope: "tweet.read users.read follows.read",
});
```

Example 3 (typescript):
```typescript
const { authorizationCode } = await client.authorize(authRequest);
```

Example 4 (typescript):
```typescript
async function fetchTokens(authRequest: OAuth.AuthorizationRequest, authCode: string): Promise<OAuth.TokenResponse> {
  const params = new URLSearchParams();
  params.append("client_id", "YourClientId");
  params.append("code", authCode);
  params.append("code_verifier", authRequest.codeVerifier);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", authRequest.redirectURI);

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    body: params,
  });
  if (!response.ok) {
    console.error("fetch tokens error:", await response.text());
    throw new Error(response.statusText);
  }
  return (await response.json()) as OAuth.TokenResponse;
}
```

---

## withAccessToken

**URL:** llms-txt#withaccesstoken

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Types
  - WithAccessTokenParameters
  - WithAccessTokenComponentOrFn

Higher-order function fetching an authorization token to then access it. This makes it easier to handle OAuth in your different commands whether they're `view` commands, `no-view` commands, or `menu-bar` commands.

`options` is an object containing:

* `options.authorize`: a function that initiates the OAuth token retrieval process. It returns a promise that resolves to an access token.
* `options.personalAccessToken`: an optional string that represents an already obtained personal access token. When `options.personalAccessToken` is provided, it uses that token. Otherwise, it calls `options.authorize` to fetch an OAuth token asynchronously.
* `options.client`: an optional instance of a PKCE Client that you can create using Raycast API. This client is used to return the `idToken` as part of the `onAuthorize` callback below.
* `options.onAuthorize`: an optional callback function that is called once the user has been properly logged in through OAuth. This function is called with the `token`, its type (`oauth` if it comes from an OAuth flow or `personal` if it's a personal access token), and `idToken` if it's returned from `options.client`'s initial token set.

Returns the wrapped component if used in a `view` command or the wrapped function if used in a `no-view` command.

{% hint style="info" %}
Note that the access token isn't injected into the wrapped component props. Instead, it's been set as a global variable that you can get with [getAccessToken](https://developers.raycast.com/utilities/oauth/getaccesstoken).
{% endhint %}

{% tabs %}
{% tab title="view\.tsx" %}

{% tab title="no-view\.tsx" %}

{% tab title="onAuthorize.tsx" %}

{% endtab %}
{% endtabs %}

### WithAccessTokenParameters

### WithAccessTokenComponentOrFn

**Examples:**

Example 1 (tsx):
```tsx
function withAccessToken<T = any>(
  options: WithAccessTokenParameters,
): <U extends WithAccessTokenComponentOrFn<T>>(
  fnOrComponent: U,
) => U extends (props: T) => Promise<void> | void ? Promise<void> : React.FunctionComponent<T>;
```

Example 2 (tsx):
```tsx
import { List } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize } from "./oauth";

function AuthorizedComponent(props) {
  return; // ...
}

export default withAccessToken({ authorize })(AuthorizedComponent);
```

Example 3 (tsx):
```tsx
import { showHUD } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize } from "./oauth";

async function AuthorizedCommand() {
  await showHUD("Authorized");
}

export default withAccessToken({ authorize })(AuthorizedCommand);
```

Example 4 (tsx):
```tsx
import { OAuthService } from "@raycast/utils";
import { LinearClient, LinearGraphQLClient } from "@linear/sdk";

let linearClient: LinearClient | null = null;

const linear = OAuthService.linear({
  scope: "read write",
  onAuthorize({ token }) {
    linearClient = new LinearClient({ accessToken: token });
  },
});

function MyIssues() {
  return; // ...
}

export default withAccessToken(linear)(View);
```

---
