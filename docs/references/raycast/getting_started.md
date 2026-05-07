# Raycast - Getting Started

**Pages:** 2

---

## Create Your First Extension

**URL:** llms-txt#create-your-first-extension

**Contents:**
- Create a new extension
- Build the extension
- Develop your extension
- Use your extension

Learn how to build your first extension and use it in Raycast.

## Create a new extension

Open the Create Extension command, name your extension "Hello World" and select the "Detail" template. Pick a parent folder in the Location field and press `⌘` `↵` to continue.

![Create Extension command in Raycast](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3cf0d0478508eca468e31c4f9ee871ea269d71e4%2Fhello-world.webp?alt=media)

{% hint style="info" %}
To create a private extension, select your organization in the first dropdown. You need to be logged in and part of an organization to see the dropdown. Learn more about Raycast for Teams [here](https://developers.raycast.com/teams/getting-started).
{% endhint %}

{% hint style="info" %}
To kickstart your extensions, Raycast provides various templates for commands and tools. Learn more [here](https://developers.raycast.com/information/developer-tools/templates).
{% endhint %}

Next, you'll need to follow the on-screen instructions to build the extension.

## Build the extension

Open your terminal, navigate to your extension directory and run `npm install && npm run dev`. Open Raycast, and you'll notice your extension at the top of the root search. Press `↵` to open it.

![Your first extension](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2927c54a56a87fd95fb0340b9acfcd26f48f0f40%2Fhello-world-2.webp?alt=media)

## Develop your extension

To make changes to your extension, open the `./src/index.tsx` file in your extension directory, change the `markdown` text and save it. Then, open your command in Raycast again and see your changes.

{% hint style="info" %}
`npm run dev` starts the extension in development mode with hot reloading, error reporting and [more](https://developers.raycast.com/information/developer-tools/cli#development).
{% endhint %}

## Use your extension

Now, you can press `⌃` `C` in your terminal to stop `npm run dev`. The extension stays in Raycast, and you can find its commands in the root when searching for the extension name "Hello World" or the command name "Render Markdown".

![Find your extension in the root search](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2927c54a56a87fd95fb0340b9acfcd26f48f0f40%2Fhello-world-2.webp?alt=media)

🎉 Congratulations! You built your first extension. Off to many more.

{% hint style="info" %}
Don't forget to run [`npm run dev`](https://developers.raycast.com/information/developer-tools/cli#development) again when you want to change something in your extension.
{% endhint %}

---

## Getting Started

**URL:** llms-txt#getting-started

**Contents:**
- Installation
- Changelog
  - v2.2.2
  - v2.2.1
  - v2.2.0
  - v2.1.1
  - v2.1.0
  - v2.0.1
  - v2.0.0
  - v1.19.1

In addition to the [Raycast API](https://developers.raycast.com/api-reference/cache) which is bundled as part of the app, we also provide a sibling package that contains a set of utilities to streamline common patterns and operations used in extensions.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2bee6f8564b36459e1157c54b2a542bf035a28d7%2Futils-illustration.jpg?alt=media)

This package can be installed independently using `npm`.

`@raycast/utils` has a [peer dependency](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies) on `@raycast/api`. This means that a certain version of `utils` will require a version above a certain version of `api`. `npm` will warn you if that is not the case.

* Fix `useCachedState` to preserve Date objects more precisely.

* Fix compiled file to actually make `useSQL` and `executeSQL` work on Windows.

* Make `useSQL` and `executeSQL` work on Windows.

* Fix the default size of `getFavicon`.

* `getFavicon` will now respect the user's setting for the favicon provider. Note that the `Apple` provider isn't supported since it relies on a native API.

* Fix types for ESM extensions

* The library can now be tree-shaken, reducing its size considerably.
* When using `usePromise` and mutating the data with an optimistic update before it is fetched, the current fetch will be aborted to avoid a race condition.
* Add a new [`runPowerShellScript`](https://developers.raycast.com/utilities/functions/runpowershellscript) function.

* Fixed an issue where arguments weren't passed to `withCache`.

* Add a new [`withCache`](https://developers.raycast.com/utilities/functions/withcache) function.

* Fixed an issue where setting `timeout` to `0` in `runAppleScript` would not work.

* Add a new [\`executeSQL](https://developers.raycast.com/utilities/functions/executesql) function.

* Add a new [`createDeeplink`](https://developers.raycast.com/utilities/functions/createdeeplink) function.

* Fixed the bug where `failureToastOptions` did not apply for `useExec` and `useStreamJSON` hooks.

* Avoid throwing an error when `useFetch` can't parse the `Content-Type` header of the response.

* Fix an issue where `URLSearchParams` couldn't be passed as an option to `useFetch` or `useCachedPromise`, causing extensions to crash.

* Fixed the refresh token flow to log out the user instead of throwing an error.

* Fixed an issue where `bodyEncoding` wasn't properly used in OAuthService.

* Add a `failureToastOptions` prop to `useFetch`, `useCachedPromise`, and `usePromise` to make it possible to customize the error displayed instead of a generic "Failed to fetch latest data".

* Add [`useLocalStorage`](https://developers.raycast.com/utilities/react-hooks/uselocalstorage) hook.

* Add [`useStreamJSON`](https://developers.raycast.com/utilities/react-hooks/usestreamjson) hook.

* Updated `useFetch`'s `mapResult` type to allow returning `cursor` in addition to `data` and `hasMore`.

* Extended `PaginationOptions` with `cursor`.

* Fixed non-paginated version of `useFetch` not being re-run when `url` changes.

* Fixed `optimisticUpdate` not working when paginating beyond the first page when using `useCachedPromise` or other hooks that build on top of it..
* Fixed `useFetch` type requiring `mapResult` for non-paginated overload.

* Added default OAuth URLs for Google, Jira, and Zoom

* Fixed `useFetch` type for non-paginated overload.

* Added pagination support to `usePromise`, `useCachedPromise` and `useFetch`.

* Add string array support for OAuth scope (Thanks @tonka3000!).

* Add `tokenResponseParser` and `tokenRefreshResponseParser` in the options of `OAuthService`.
* Fix built-in Slack OAuthServices.

* Fixed bodyEncoding for some built-in OAuthServices.

* Fixed types for `OAuthService.slack`.

* Fixed the refresh flow of `OAuthService` that would return outdated tokens.

* Removed some default OAuth clientIDs that could not work with generic scopes.
* Fixed `withAccessToken` when used in no-view commands.

* Fixed Google OAuth configuration.

* Added the [OAuth utils](https://developers.raycast.com/utilities/oauth).

* Fix an issue where the values passed to the `reset` function of the `useForm` hook wouldn't be respected.

* Add a new [`showFailureToast`](https://developers.raycast.com/utilities/functions/showfailuretoast) function.

* Fix an issue where `useForm`'s `reset` function would not reset the value of some fields (which defeats its purpose...)

* Add a new [`useFrecencySorting`](https://developers.raycast.com/utilities/react-hooks/usefrecencysorting) hook.
* Change the default `options.timeout` of `useExec` to 10s.

* Add a new [`runAppleScript`](https://developers.raycast.com/utilities/functions/runapplescript) function.
* Change the default `options.timeout` of `useExec` to 10s.

Change the signature of [`getProgressIcon`](https://developers.raycast.com/utilities/icons/getprogressicon) to accept a `Color` in addition to a string for the `options.background`.

Change the signature of [`getProgressIcon`](https://developers.raycast.com/utilities/icons/getprogressicon) to accept a `Color` in addition to a string for the `color`.

Added the [`useAI`](https://developers.raycast.com/utilities/react-hooks/useai) hook.

Added the [`useSQL`](https://developers.raycast.com/utilities/react-hooks/usesql) hook.

* Added the `reset` method to `useForm`.

* Added the `focus` method to `useForm`.
* Added the `input` option to `useExec`.

Added [`useExec`](https://developers.raycast.com/utilities/react-hooks/useexec) and [`useForm`](https://developers.raycast.com/utilities/react-hooks/useform) hooks.

Added [`getFavicon`](https://developers.raycast.com/utilities/icons/getfavicon) method.

First release of the utilities.

**Examples:**

Example 1 (unknown):
```unknown
npm install --save @raycast/utils
```

---
