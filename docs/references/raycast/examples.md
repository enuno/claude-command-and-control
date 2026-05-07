# Raycast - Examples

**Pages:** 1

---

## Templates

**URL:** llms-txt#templates

**Contents:**
- Commands
  - Show Detail
  - Submit Form
  - Show Grid
  - Show List and Detail
  - Menu Bar Extra
  - Run Script
  - Show List
  - Show Typeahead Results
  - AI

Learn about the templates provided by Raycast to help kickstart your extension.

Raycast provides a variety of templates to kickstart your extension.

Raycast provides 3 types of templates:

* **Commands:** These are templates for [commands](https://developers.raycast.com/information/terminology).
* **Tools:** These are templates for [tools](https://developers.raycast.com/terminology#tool). You can select a different one for each tool that you add to your extension.
* **Extension Boilerplates:** These are fully built extensions designed to be tweaked by organizations for internal use.

<summary>Renders a simple Hello World from a markdown string.</summary>

![Detail Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e9490e58b081fe70c0c380534a452f981ed4d786%2Fdetail-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/user-interface/detail) for more information about customization.
{% endhint %}

<summary>Renders a form that showcases all available form elements.</summary>

![Submit Form Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ee2d5d4c3fa780b7f14309bf826073e9dde9a96e%2Fform-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/user-interface/form) for more information about customization.
{% endhint %}

<summary>Renders a grid of Icons available from Raycast.</summary>

Defaults to a large grid, but provides a selection menu to change the size.

![Grid Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-585a703929e53a7f7f995ed2b6bf8e0a48f04faa%2Fgrid-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/user-interface/grid) for more information about customization.

See here for information about [Icons](https://developers.raycast.com/api-reference/user-interface/icons-and-images).
{% endhint %}

### Show List and Detail

<summary>Renders a list of options. When an option is selected, a Detail view is displayed.</summary>

![List and Detail Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2b379c00faa242c756f1a2aaad0a054b1648f8d6%2Flist-detail-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/user-interface/list) for more information about customization.
{% endhint %}

<summary>Adds a simple Menu Bar Extra with a menu.</summary>

![Menu Bar Extra Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7bd81f2bcee7918b6921e552dae157b7f9c21733%2Fmenu-bar-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/menu-bar-commands) for more information about customization.
{% endhint %}

A example of a no-view command which shows a simple [HUD](https://developers.raycast.com/api-reference/feedback/hud).

<summary>Renders a static list with each entry containing an icon, title, subtitle, and accessory.</summary>

![List Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c15c646bcffee77a3945ebb25a79a7f03f0e6e2f%2Flist-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/user-interface/list) for more information about customization.
{% endhint %}

### Show Typeahead Results

<summary>Renders a dynamic and searchable list of NPM packages. The command fetches new items as the search is updated by the user.</summary>

![Typeahead Results Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-10b73f930dab0d742e677811c13b0b0c0706260b%2Ftypeahead-results-template.webp?alt=media)

<summary>Renders the output of an AI call in a Detail view.</summary>

![AI Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8af8468d2f78f69d28e7da00ef75198fce867b3c%2Fai-template.webp?alt=media)

<summary>A simple tool which asks for confirmation before executing.</summary>

![Tool with Confirmation Template Render](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-48fb942ab974ffd90cba6e3f0659fbd273a9a24f%2Ftool-with-confirmation-template.webp?alt=media)

{% hint style="info" %}
See the [API Reference](https://developers.raycast.com/api-reference/tool) for more information about customization.
{% endhint %}

## Extension Boilerplates

The Raycast Team has created high-quality templates to reinforce team experiences with the Raycast API.

Run `npm init raycast-extension -t <template-name>` to get started with these extensions. All templates can be found on the [templates page](https://www.raycast.com/templates).

Specific instructions about customizing the template can be found on the relevant [template page](https://www.raycast.com/templates). Simply customize the template as you see fit, then run `npm run publish` in the extension directory to allow your team to install the extension.

---
