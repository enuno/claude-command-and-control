# Raycast - Extension Development

**Pages:** 6

---

## Manifest

**URL:** llms-txt#manifest

**Contents:**
- Extension properties
- Command properties
- Preference properties
  - Additional properties for `checkbox` Preference
  - Additional properties for `dropdown` Preference
- Argument properties
  - Additional properties for `dropdown` Argument
- Tool Properties
- AI Properties

The `package.json` manifest file is a superset of npm's `package.json` file. This way, you only need one file to configure your extension. This document covers only the Raycast specific fields. Refer to [npm's documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) for everything else.

Here is a typical manifest file:

## Extension properties

All Raycast related properties for an extension.

| Property                                      | Description                                                                                                                                                                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name<mark style="color:red;">\*</mark>        | A unique name for the extension. This is used in the Store link to your extension, so keep it short and URL compatible.                                                                                                                  |
| title<mark style="color:red;">\*</mark>       | The title of the extension that is shown to the user in the Store as well as the preferences. Use this title to describe your extension well that users can find it in the Store.                                                        |
| description<mark style="color:red;">\*</mark> | The full description of the extension shown in the Store.                                                                                                                                                                                |
| icon<mark style="color:red;">\*</mark>        | A reference to an icon file in the assets folder. Use png format with a size of 512 x 512 pixels. To support light and dark theme, add two icons, one with `@dark` as suffix, e.g. `icon.png` and `icon@dark.png`.                       |
| author <mark style="color:red;">\*</mark>     | Your Raycast Store handle (username)                                                                                                                                                                                                     |
| platforms <mark style="color:red;">\*</mark>  | An Array of platforms supported by the extension(`"macOS"` or `"Windows"`). If the extension uses some platform-specific APIs, restrict which platform can install it.                                                                   |
| categories<mark style="color:red;">\*</mark>  | An array of categories that your extension belongs in.                                                                                                                                                                                   |
| commands<mark style="color:red;">\*</mark>    | An array of [commands](https://developers.raycast.com/terminology#command) exposed by the extension, see [Command properties](#command-properties).                                                                                      |
| tools                                         | An array of tools that the AI can use to interact with this extension, see [Tool properties](#tool-properties).                                                                                                                          |
| ai                                            | Additional information related to the AI capabilities of the extension, see [AI properties](#ai-properties).                                                                                                                             |
| owner                                         | Used for extensions published under an organisation. When defined, the extension will be [private](https://developers.raycast.com/teams/getting-started) (except when specifying `access`).                                              |
| access                                        | Either `"public"` or `"private"`. Public extensions are downloadable by anybody, while [private](https://developers.raycast.com/teams/getting-started) extensions can only be downloaded by a member of a given organization.            |
| contributors                                  | An array of Raycast store handles (usernames) of people who have meaningfully contributed and are maintaining to this extension.                                                                                                         |
| pastContributors                              | An array of Raycast store handles (usernames) of people who have meaningfully contributed to the extension's commands but do not maintain it anymore.                                                                                    |
| keywords                                      | An array of keywords for which the extension can be searched for in the Store.                                                                                                                                                           |
| preferences                                   | Extensions can contribute preferences that are shown in Raycast Preferences > Extensions. You can use preferences for configuration values and passwords or personal access tokens, see [Preference properties](#preference-properties). |
| external                                      | An Array of package or file names that should be excluded from the build. The package will not be bundled, but the import is preserved and will be evaluated at runtime.                                                                 |

## Command properties

All properties for a [command](https://developers.raycast.com/terminology#command).

| Property                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name<mark style="color:red;">\*</mark>        | A unique id for the command. The name directly maps to the entry point file for the command. So a command named "index" would map to `src/index.ts` (or any other supported TypeScript or JavaScript file extension such as `.tsx`, `.js`, `.jsx`).                                                                                                                                                                                      |
| title<mark style="color:red;">\*</mark>       | The display name of the command, shown to the user in the Store, Preferences, and in Raycast's root search.                                                                                                                                                                                                                                                                                                                              |
| subtitle                                      | The optional subtitle of the command in the root search. Usually, this is the service or domain that your command is associated with. You can dynamically update this property using [`updateCommandMetadata`](https://developers.raycast.com/api-reference/command#updatecommandmetadata).                                                                                                                                              |
| description<mark style="color:red;">\*</mark> | It helps users understand what the command does. It will be displayed in the Store and in Preferences.                                                                                                                                                                                                                                                                                                                                   |
| icon                                          | <p>An optional reference to an icon file in the assets folder. Use png format with a size of at least 512 x 512 pixels. To support light and dark theme, add two icons, one with <code>@dark</code> as suffix, e.g. <code>icon.png</code> and <code><icon@dark.png></code>.</p><p>If no icon is specified, the extension icon will be used.</p>                                                                                          |
| mode<mark style="color:red;">\*</mark>        | A value of `view` indicates that the command will show a main view when performed. `no-view` means that the command does not push a view to the main navigation stack in Raycast. The latter is handy for directly opening a URL or other API functionalities that don't require a user interface. `menu-bar` indicates that this command will return a [Menu Bar Extra](https://developers.raycast.com/api-reference/menu-bar-commands) |
| interval                                      | The value specifies that a `no-view` or `menu-bar` command should be launched in the background every X seconds (s), minutes (m), hours (h) or days (d). Examples: 90s, 1m, 12h, 1d. The minimum value is 1 minute (1m).                                                                                                                                                                                                                 |
| keywords                                      | An optional array of keywords for which the command can be searched in Raycast.                                                                                                                                                                                                                                                                                                                                                          |
| arguments                                     | An optional array of arguments that are requested from user when the command is called, see [Argument properties](#argument-properties).                                                                                                                                                                                                                                                                                                 |
| preferences                                   | Commands can optionally contribute preferences that are shown in Raycast Preferences > Extensions when selecting the command. You can use preferences for configuration values and passwords or personal access tokens, see [Preference properties](#preference-properties). Commands automatically "inherit" extension preferences and can also override entries with the same `name`.                                                  |
| disabledByDefault                             | <p>Specify whether the command should be enabled by default or not. By default, all commands are enabled but there are some cases where you might want to include additional commands and let the user enable them if they need it.</p><p><em>Note that this flag is only used when installing a new extension or when there is a new command.</em></p>                                                                                  |

## Preference properties

All properties for extension or command-specific preferences. Use the [Preferences API](https://developers.raycast.com/api-reference/preferences) to access their values.

| Property                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name<mark style="color:red;">\*</mark>        | A unique id for the preference.                                                                                                                                                                                                                                                                                                                                                                                            |
| title<mark style="color:red;">\*</mark>       | <p>The display name of the preference shown in Raycast preferences.</p><p>For <code>"checkbox"</code>, <code>"textfield"</code> and <code>"password"</code>, it is shown as a section title above the respective input element.</p><p>If you want to group multiple checkboxes into a single section, set the <code>title</code> of the first checkbox and leave the <code>title</code> of the other checkboxes empty.</p> |
| description<mark style="color:red;">\*</mark> | It helps users understand what the preference does. It will be displayed as a tooltip when hovering over it.                                                                                                                                                                                                                                                                                                               |
| type<mark style="color:red;">\*</mark>        | The preference type. We currently support `"textfield"` and `"password"` (for secure entry), `"checkbox"`, `"dropdown"`, `"appPicker"`, `"file"`, and `"directory"`.                                                                                                                                                                                                                                                       |
| required<mark style="color:red;">\*</mark>    | Indicates whether the value is required and must be entered by the user before the extension is usable.                                                                                                                                                                                                                                                                                                                    |
| placeholder                                   | Text displayed in the preference's field when no value has been input.                                                                                                                                                                                                                                                                                                                                                     |
| default                                       | <p>The optional default value for the field. For textfields, this is a string value; for checkboxes a boolean; for dropdowns the value of an object in the data array; for appPickers an application name, bundle ID or path.</p><p>Additionally, you can specify a different value per plaform by passing an object: <code>{ "macOS": ..., "Windows": ... }</code>.</p>                                                   |

Depending on the `type` of the Preference, some additional properties can be required:

### Additional properties for `checkbox` Preference

| Property                                | Description                                            |
| --------------------------------------- | ------------------------------------------------------ |
| label<mark style="color:red;">\*</mark> | The label of the checkbox. Shown next to the checkbox. |

### Additional properties for `dropdown` Preference

| Property                               | Description                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| data<mark style="color:red;">\*</mark> | An array of objects with `title` and `value` properties, e.g.: `[{"title": "Item 1", "value": "1"}]` |

## Argument properties

All properties for command arguments. Use the [Arguments API](https://developers.raycast.com/information/lifecycle/arguments) to access their values.

| Property                                      | Description                                                                                                                                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name<mark style="color:red;">\*</mark>        | A unique id for the argument. This value will be used to as the key in the object passed as [top-level prop](https://developers.raycast.com/lifecycle/arguments#arguments).                                                                      |
| type<mark style="color:red;">\*</mark>        | The argument type. We currently support `"text"`, `"password"` (for secure entry), and `"dropdown"`. When the type is `password`, entered text will be replaced with asterisks. Most common use case – passing passwords or secrets to commands. |
| placeholder<mark style="color:red;">\*</mark> | Placeholder for the argument's input field.                                                                                                                                                                                                      |
| required                                      | Indicates whether the value is required and must be entered by the user before the command is opened. Default value for this is `false`.                                                                                                         |

Depending on the `type` of the Argument, some additional properties can be required:

### Additional properties for `dropdown` Argument

| Property                               | Description                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| data<mark style="color:red;">\*</mark> | An array of objects with `title` and `value` properties, e.g.: `[{"title": "Item 1", "value": "1"}]` |

All properties for a tool.

| Property                                      | Description                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name<mark style="color:red;">\*</mark>        | A unique id for the tool. The name directly maps to the entry point file for the tool. So a tool named "index" would map to `src/tools/index.ts` (or any other supported TypeScript file extension such as `.tsx`).                                                                                                                             |
| title<mark style="color:red;">\*</mark>       | The display name of the tool, shown to the user in the Store and Preferences.                                                                                                                                                                                                                                                                   |
| description<mark style="color:red;">\*</mark> | It helps users and the AI understand what the tool does. It will be displayed in the Store and in Preferences.                                                                                                                                                                                                                                  |
| icon                                          | <p>An optional reference to an icon file in the assets folder. Use png format with a size of at least 512 x 512 pixels. To support light and dark theme, add two icons, one with <code>@dark</code> as suffix, e.g. <code>icon.png</code> and <code><icon@dark.png></code>.</p><p>If no icon is specified, the extension icon will be used.</p> |

All properties for the AI capabilities of the extension. Alternatively, this object can be written in a `ai.json` (or `ai.yaml`) file at the root of the extension.

| Property     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| instructions | A string containing additional instructions for the AI. It will be added as a system message whenever the extension is mentioned. It can for example be used to help the AI respond with a format that makes more sense for the extension: `Always format pull requests and issues as markdown links: [pull-request-title](https://github.com/:org/:repo/pull/:number) and [issue-title](https://github.com/:org/:repo/issues/:number)` |
| evals        | Evals for AI Extension. [More details](https://raycastapp.notion.site/AI-Extensions-Evals-15fd6e4a8215800598cad77d8afb5dc8?pvs=73)                                                                                                                                                                                                                                                                                                      |

**Examples:**

Example 1 (javascript):
```javascript
{
  "name": "my-extension",
  "title": "My Extension",
  "description": "My extension that can do a lot of things",
  "icon": "icon.png",
  "author": "thomas",
  "platforms": ["macOS", "Windows"],
  "categories": ["Fun", "Communication"],
  "license": "MIT",
  "commands": [
    {
      "name": "index",
      "title": "Send Love",
      "description": "A command to send love to each other",
      "mode": "view"
    }
  ]
}
```

---

## Prepare an Extension for Store

**URL:** llms-txt#prepare-an-extension-for-store

**Contents:**
- Metadata and Configuration
- Extensions and Commands Naming
- Extension Icon
- Provide README if Additional Configuration Required
- Categories
  - All Categories
- Screenshots
  - Adding Screenshots
  - Specifications
  - Do's & Dont's

Learn how to get through review process quickly

Here you will find requirements and guidelines that you'll need to follow in order to get through the review before your extension becomes available in the Store. Please read it carefully because it will save time for you and for us. This document is constantly evolving so please do visit it from time to time.

## Metadata and Configuration

* Things to double-check in your `package.json`
  * Ensure you use your **Raycast** account username in the `author` field
  * Ensure you use `MIT` in the `license` field
  * Ensure you are using the latest Raycast API version
  * Ensure the `platforms` field matching the requirement of your extension, eg. if you use platform-specific APIs, restrict the `platforms` field to the corresponding platform
* Please use `npm` for installing dependencies and include `package-lock.json` in your pull request. We use `npm` on our Continuous Integration (CI) environment when building and publishing extensions so, by providing a `package-lock.json` file, we ensure that the dependencies on the server match the same versions as your local dependencies.
* Please check the terms of service of third-party services that your extension uses.
* Read the [Extension Guidelines](https://manual.raycast.com/extensions) and make sure that your Extension comply with it.
* Make sure to **run a distribution build** with `npm run build` locally before submitting the extension for review. This will perform additional type checking and create an optimized build. Open the extension in Raycast to check whether everything works as expected with the distribution build. In addition, you can perform linting and code style checks by running `npm run lint`. (Those checks will later also run via automated GitHub checks.)

## Extensions and Commands Naming

* Extension and command titles should follow [**Apple Style Guide**](https://help.apple.com/applestyleguide/#/apsgb744e4a3?sub=apdca93e113f1d64) convention
  * ✅ `Google Workplace`, `Doppler Share Secrets`, `Search in Database`
  * ❌ `Hacker news`, `my issues`
  * 🤔 It's okay to use lower case for names and trademarks that are canonically written with lower case letters. E.g. `iOS` , `macOS` , `npm`.
* **Extension title**
  * It will be used only in the Store and in the preferences
  * Make it easy for people to understand what it does when they see it in the Store
    * ✅ `Emoji Search`, `Airport - Discover Testflight Apps`, `Hacker News`
    * ❌ `Converter`, `Images`, `Code Review`, `Utils`
    * 🤔 In some cases, you can add additional information to the title similar to the Airport example above. Only do so if it adds context.
    * 💡 You can use more creative titles to differentiate your extension from other extensions with similar names.
  * Aim to use nouns rather than verbs
    * `Emoji Search` is better than `Search Emoji`
  * Avoid generic names for an extension when your extension doesn't provide a lot of commands
    * E.g. if your extension can only search pages in Notion, name it `Notion Search` instead of just `Notion`. This will help users to form the right expectations about your extension. If your extension covers a lot of functionality, it's okay to use a generic name like `Notion`. Example: [GitLab](https://www.raycast.com/tonka3000/gitlab).
    * **Rule of thumb:** If your extension has only one command, you probably need to name the extension close to what this command does. Example: [Visual Studio Code Recent Projects](https://www.raycast.com/thomas/visual-studio-code) instead of just `Visual Studio Code`.
* **Extension description**
  * In one sentence, what does your extension do? This will be shown in the list of extensions in the Store. Keep it short and descriptive. See how other approved extensions in the Store do it for inspiration.
* **Command title**
  * Usually it's `<verb> <noun>` structure or just `<noun>`
  * The best approach is to see how other commands are named in Raycast to get inspiration
    * ✅ `Search Recent Projects`, `Translate`, `Open Issues`, `Create Task`
    * ❌ `Recent Projects Search`, `Translation`, `New Task`
  * Avoid articles
    * ✅ `Search Emoji`, `Create Issue`
    * ❌ `Search an Emoji`, `Create an Issue`
  * Avoid just giving it a service name, be more specific about what the command does
    * ✅ `Search Packages`
    * ❌ `NPM`
* **Command subtitle**
  * Use subtitles to add context to your command. Usually, it's an app or service name that you integrate with. It makes command names more lightweight and removes the need to specify a service name in the command title.
  * The subtitle is indexed so you can still search using subtitle and title: `xcode recent projects` would return `Search Recent Projects` in the example above.
  * Don't use subtitles as descriptions for your command
    * ❌ `Quickly open Xcode recent projects`
  * Don't use a subtitle if it doesn't add context. Usually, this is the case with single command extensions.
    * There is no need for a subtitle for the `Search Emoji` command since it's self-explanatory
    * **Rule of thumb:** If your subtitle is almost a duplication of your command title, you probably don't need it

![Example of a good subtitle](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d482752e8c76fe94fcdd4adf8d5b8ab0b94126d9%2Fgood-subtitle.webp?alt=media)

{% hint style="info" %}
We made a new icon generator tool to ease the process of creating icons for your extensions. You can find it [here](https://icon.ray.so/).
{% endhint %}

* The published extension in the Store should have a 512x512px icon in `png` format
* The icon should look good in both light and dark themes (you can switch the theme in Raycast Preferences → Appearance)
* If you have separate light and dark icons, refer to the `package.json` [manifest](https://developers.raycast.com/information/manifest#extension-properties) documentation on how to configure them
* Extensions that use the default Raycast icon will be rejected
* This [Icon Template](https://www.figma.com/community/file/1030764827259035122/Extensions-Icon-Template) can help you with making and exporting a proper icon
* Make sure to remove unused assets and icons
* 💡 If you feel like designing icons is not up to your alley, ask [community](https://raycast.com/community) for help (#extensions channel)

## Provide README if Additional Configuration Required

* If your extension requires additional setup, such as getting an API access token, enabling some preferences in other applications, or has non-trivial use cases, please provide a README file at the root folder of your extension. When a README is provided, users will see the "About This Extension" button on the preferences onboarding screen.
* Supporting README media: Put all linked media files in a top-level `media` folder inside your extension directory. (This is different from assets that are required at runtime in your extension: they go inside the assets folder and will be bundled into your extension.)

![Onboarding button linking to the README file](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8bc31854cf0c64fdff60dd1782a7cce0c6acb97b%2Frequired-preference.webp?alt=media)

![Categories shown on an extension details screen](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b96d3ca00c7089cee075510e1e4b13a60eddfe64%2Fcategories-focus.webp?alt=media)

* All extensions should be published with at least one category
* Categories are case-sensitive and should follow the [Title Case](https://titlecaseconverter.com/rules/) convention
* Add categories in the `package.json` [manifest](https://developers.raycast.com/information/manifest) file or select the categories when you create a new extension using the **Create Extension** command

| Category        | Example                                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Applications    | [Cleanshot X](https://www.raycast.com/Aayush9029/cleanshotx) – Capture and record your screen                                                                   |
| Communication   | [Slack Status](https://www.raycast.com/petr/slack-status) – Quickly change your Slack status.                                                                   |
| Data            | [Random Data Generator](https://www.raycast.com/loris/random) – Generate random data using Faker library.                                                       |
| Documentation   | [Tailwind CSS Documentation](https://www.raycast.com/vimtor/tailwindcss) – Quickly search Tailwind CSS documentation and open it in the browser.                |
| Design Tools    | [Figma File Search](https://www.raycast.com/michaelschultz/figma-files-raycast-extension) – Lists Figma files allowing you to search and navigate to them.      |
| Developer Tools | [Brew](https://www.raycast.com/nhojb/brew) – Search and install Homebrew formulae.                                                                              |
| Finance         | [Coinbase Pro](https://www.raycast.com/farisaziz12/coinbase-pro) – View your Coinbase Pro portfolio.                                                            |
| Fun             | [8 Ball](https://www.raycast.com/rocksack/8-ball) – Returns an 8 ball like answer to questions.                                                                 |
| Media           | [Unsplash](https://www.raycast.com/eggsy/unsplash) – Search images or collections on Unsplash, download, copy or set them as wallpaper without leaving Raycast. |
| News            | [Hacker News](https://www.raycast.com/thomas/hacker-news) – Read the latest stories of Hacker News.                                                             |
| Productivity    | [Todoist](https://www.raycast.com/thomaslombart/todoist) – Check your Todoist tasks and quickly create new ones.                                                |
| Security        | [1Password 7](https://www.raycast.com/khasbilegt/1password7) – Search, open or edit your 1Password 7 passwords from Raycast.                                    |
| System          | [Coffee](https://www.raycast.com/mooxl/coffee) – Prevent the sleep function on your mac.                                                                        |
| Web             | [Wikipedia](https://www.raycast.com/vimtor/wikipedia) – Search Wikipedia articles and view them.                                                                |
| Other           | To be used if you think your extension doesn’t fit in any of the above categories.                                                                              |

![An example of an extension with screenshot metadata](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fd3ba451deb85e08069572e61a3d138530f3e27a%2Fhn-store.webp?alt=media)

* Screenshots are displayed in the metadata of an extension details screen, where users can click and browse through them to understand what your extension does in greater detail, before installing
* You can add a maximum of six screenshots. We recommend adding at least three, so your extensions detail screen looks beautiful.

### Adding Screenshots

In Raycast 1.37.0+ we made it easy for you to take beautiful pixel perfect screenshots of your extension with an ease.

1. Set up Window Capture in Advanced Preferences (Hotkey e.g.: `⌘⇧⌥+M`)
2. Ensure your extension is opened in development mode (Window Capture eliminates dev-related menus/icons).
3. Open the command
4. Press the hotkey, remember to tick `Save to Metadata`

{% hint style="info" %}
This tool will use your current background. Choose a background image with a good contrast that makes it clear and easy to see the app and extension you've made.

You can use [Raycast Wallpapers](https://www.raycast.com/wallpapers) to make your background look pretty
{% endhint %}

| Screenshot size                | Aspect ratio | Format | Dark mode support |
| ------------------------------ | ------------ | ------ | ----------------- |
| 2000 x 1250 pixels (landscape) | 16:10        | PNG    | No                |

* ✅ Choose a background with good contrast, that makes it clear and easy to see the app and extension you’ve made
* ✅ Select the most informative commands to showcase what your extension does – focus on giving the user as much detail as possible
* ❌ Do not use multiple backgrounds for different screenshots – be consistent and use the same across all screenshots
* ❌ Do not share sensitive data in your screenshots – these will be visible in the Store, as well as the Extension repository on GitHub
* ❌ Do not include screenshots of other applications - keep the focus entirely on your extension within Raycast
* ❌ Avoid using screenshots in different themes (light and dark), unless it is to demonstrate what your extension does

![A CHANGELOG.md file displayed in the app](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4e39429865f934bd7684631765f8cbfa902750f9%2Fversion-history.webp?alt=media)

* Make it easier for users to see exactly what notable changes have been made between each release of your extension with a `CHANGELOG.md` file in your extension metadata
  * To add Version History to your extension, add a `CHANGELOG.md` file to the root folder of your extension
* See an extension files structure with [screenshots and a changelog file](#adding-screenshots)
* With each modification, provide clear and descriptive details regarding the latest update, accompanied by a title formatted as an h2 header followed by `{PR_MERGE_DATE}`. This placeholder will be automatically replaced when the pull request is merged. While you may still use the date timestamp format YYYY-MM-DD, it is often more practical to use `{PR_MERGE_DATE}` since merging of a pull request can take several days (depending on the review comments, etc.).
  * Make sure your change title is within square brackets
  * Separate your title and date with a hyphen `-` and spaces either side of the hyphen
* Below is an example of a changelog that follows the correct format

---

## Publish an Extension

**URL:** llms-txt#publish-an-extension

**Contents:**
  - Validate your extension
  - Publish your extension
  - Waiting for review
  - Share your extension

Learn how to share your extension with our community.

Before you publish your extension, take a look at [how to prepare your extension](https://developers.raycast.com/basics/prepare-an-extension-for-store) for the Store. Making sure you follow the guidelines is the best way to help your extension pass the review.

### Validate your extension

Open your terminal, navigate to your extension directory, and run `npm run build` to verify your extension. The command should complete without any errors.

{% hint style="info" %}
`npm run build` validates your extension for distribution without publishing it to the store. Read more about it [here](https://developers.raycast.com/information/developer-tools/cli#build).
{% endhint %}

### Publish your extension

To share your extension with others, navigate to your extension directory, and run `npm run publish` to publish your extension.

{% hint style="info" %}
It is possible that the `publish` script doesn't exist (usually because the extension was created before the template was updated to include it). In that case, you can add the following line in the `scripts` object of the package.json `"publish": "npx @raycast/api@latest publish"` and then run `npm run publish` again.
{% endhint %}

You will be asked to authenticate with GitHub because the script will automatically open a pull request in our [`raycast/extensions`](https://github.com/raycast/extensions) repository.

The command will squash commits and their commit messages. If you want more control, see the [alternative way](#alternative-way) below.

{% hint style="info" %}
If someone contributes to your extension, or you make edits directly on GitHub, running `npm run publish` will fail until you run

in your git repository. This will merge the contributions with your code, asking you to fix the conflicts if any.
{% endhint %}

Once the pull request is opened, you can continue pushing more commits to it by running `npm run publish` again.

If you want more control over the publishing process, you can manually do what `npm run publish` does. You need to open a pull request in our [repository](https://github.com/raycast/extensions). For this, [fork our repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo), add your extension to your fork, push your changes, and open a pull request [via the GitHub web interface](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) into our `main` branch.

### Waiting for review

After you opened a pull request, we'll review your extension and request changes when required. Once accepted, the pull request is merged and your extension will be automatically published to the [Raycast Store](https://raycast.com/store).

{% hint style="info" %}
We're still figuring things out and updating our guidelines. If something is unclear, please tell us in [our community](https://raycast.com/community).
{% endhint %}

### Share your extension

Once your extension is published in the Raycast Store, you can share it with our community. Open the Manage Extensions command, search for your extension and press `⌘` `⌥` `.` to copy the link.

![Manage your extensions](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ce1f47d3a92c1377fa2cb9ace2eb4bee7cfaa58b%2Fbasics-manage-extensions.webp?alt=media)

🚀 Now it's time to share your work! Tweet about your extension, share it with our [Slack community](https://raycast.com/community) or send it to your teammates.

**Examples:**

Example 1 (bash):
```bash
npx @raycast/api@latest pull-contributions
```

---

## File Structure

**URL:** llms-txt#file-structure

**Contents:**
- Sources
- Assets
- Support files

Understand the file structure of an extension.

An extension consists of at least an entry point file (e.g. `src/index.ts`) and a `package.json` manifest file. We add a few more support files when scaffolding an extension to streamline development with modern JavaScript tooling.

The typical directory structure of a newly created extension looks like this:

The directory contains all source files, assets, and a few support files. Let's go over each of them:

Put all your source files into the `src` folder. We recommend using TypeScript as a programming language. Our API is fully typed, which helps you catch errors at compile time rather than runtime. `ts`, `tsx`, `js` and `jsx` are supported as file extensions. As a rule of thumb, use `tsx` or `jsx` for commands with a UI.

An extension consists of at least an entry point file (e.g. `src/command.ts`) per command and a `package.json` manifest file holding metadata about the extension, its commands, and its tools. The format of the manifest file is very similar to [that of npm packages](https://docs.npmjs.com/cli/v7/configuring-npm/package-json). In addition to some of the standard properties, there are some [additional properties](https://developers.raycast.com/information/manifest), in particular, the `commands` properties which describes the entry points exposed by the extension.

Each command has a property `name` that maps to its main entry point file in the `src` folder. For example, a command with the name `create` in the `package.json` file, maps to the file `src/create{.ts,.tsx,.js,.jsx}`.

The optional `assets` folder can contain icons that will be packaged into the extension archive. All bundled assets can be referenced at runtime. Additionally, icons can be used in the `package.json` as extension or command icons.

The directory contains a few more files that setup common JavaScript tooling:

* **eslint.config.js** describes rules for [ESLint](https://eslint.org), which you can run with `npm run lint`. It has recommendations for code style and best practices. Usually, you don't have to edit this file.
* **.prettierrc** contains default rules for [Prettier](https://prettier.io) to format your code. We recommend to setup the [VS Code extension](https://prettier.io/docs/en/editors.html#visual-studio-code) to keep your code pretty automatically.
* **node\_modules** contains all installed dependencies. You shouldn't make any manual changes to this folder.
* **package-lock.json** is a file generated by npm to install your dependencies. You shouldn't make any manual changes to this file.
* **package.json** is the [manifest file](https://developers.raycast.com/information/manifest) containing metadata about your extension such as its title, the commands, and its dependencies.
* **tsconfig.json** configures your project to use TypeScript. Most likely, you don't have to edit this file.

**Examples:**

Example 1 (bash):
```bash
extension
├── .prettierrc
├── assets
│   └── icon.png
├── eslint.config.js
├── node_modules
├── package-lock.json
├── package.json
├── src
│   ├── command.tsx
└── tsconfig.json
```

---

## Versioning

**URL:** llms-txt#versioning

**Contents:**
- Development
- End Users
- Version History
- API Evolution

Versioning your extensions is straightforward since we've designed the system in a way that **frees you from having to deal with versioning schemes and compatibility**. The model is similar to that of app stores where there's only one implicit *latest* version that will be updated when the extension is published in the store. Extensions are automatically updated for end users.

For **development**, this means that you do *not* declare a version property in the manifest. If you wish to use API features that were added in a later version, you just update your `@raycast/api` npm dependency, start using the feature, and submit an extension update to the store.

For **end-users** installing or updating your extension, Raycast automatically checks the compatibility between the API version that the extension actually uses and the user's current Raycast app version (which contains the API runtime and also manages the Node version). If there's a compatibility mismatch such as the user not having the required latest Raycast app version, we show a hint and prompt the user to update Raycast so that the next compatibility check succeeds.

Optionally, you can provide a `changelog.md` file in your extension, and give detailed changes with every update. These changes can be viewed by the user on the extension details screen, under Version History, as well as on the [raycast.com/store](https://raycast.com/store).

You can learn more about Version History [here](https://developers.raycast.com/basics/prepare-an-extension-for-store#version-history), how to add it to your extension, and the required format for the best appearance.

Generally, we follow an **API evolution** process, meaning that we stay backward-compatible and do not introduce breaking changes within the same major API version. We'll 1) add new functionality and 2) we'll mark certain API methods and components as *deprecated* over time, which signals to you that you should stop using those features and migrate to the new recommended alternatives. At some point in the future, we may introduce a new breaking major release; however, at this time, you will be notified, and there will be a transition period for migrating extensions.

---

## Publish a Private Extension

**URL:** llms-txt#publish-a-private-extension

Learn how to share an extension in your organization's private extension store

To publish an extension, run `npm run publish` in the extension directory. The command verifies, builds and publishes the extension to the owner's store. The extension is only available to members of this organization. A link to your extension is copied to your clipboard to share it with your teammates. Happy publishing 🥳

To mark an extension as private, you need to set the `owner` field in your `package.json` to your organization handle. If you don't know your handle, open the Manage Organization command, select your organization in the dropdown on the top right and perform the Copy Organization Handle action (`⌘` `⇧` `.`).

{% hint style="info" %}
Use the Create Extension command to create a private extension for your organization.
{% endhint %}

To be able to publish a private extension to an organization, you need to be logged in. Raycast takes care of logging you in with the CLI as well. In case you aren't logged in or need to switch an account, you can run `npx ray login` and `npx ray logout`.

---
