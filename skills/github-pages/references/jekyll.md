# GitHub Pages - Jekyll

**Pages:** 2

---

## About GitHub Pages and Jekyll

**URL:** https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll

> Jekyll is a static site generator with built-in support for GitHub Pages.

# About GitHub Pages and Jekyll

Jekyll is a static site generator with built-in support for GitHub Pages.

> \[!NOTE] While the `github-pages` gem remains supported for some workflows, GitHub Actions is now the recommended approach for deploying and automating GitHub Pages sites.

## About Jekyll

Jekyll is a static site generator with built-in support for GitHub Pages and a simplified build process. Jekyll takes Markdown and HTML files and creates a complete static website based on your choice of layouts. Jekyll supports Markdown and Liquid, a templating language that loads dynamic content on your site. For more information, see [Jekyll](https://jekyllrb.com/).

Jekyll is not officially supported for Windows. For more information, see [Jekyll on Windows](https://jekyllrb.com/docs/windows/#installation) in the Jekyll documentation.

We recommend using Jekyll with GitHub Pages. If you prefer, you can use other static site generators or customize your own build process locally or on another server. For more information, see [Creating a GitHub Pages site](/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#static-site-generators).

## Configuring Jekyll in your GitHub Pages site

You can configure most Jekyll settings, such as your site's theme and plugins, by editing your `_config.yml` file. For more information, see [Configuration](https://jekyllrb.com/docs/configuration/) in the Jekyll documentation.

Some configuration settings cannot be changed for GitHub Pages sites.

```yaml
lsi: false
safe: true
source: [your repo's top level directory]
incremental: false
highlighter: rouge
gist:
  noscript: false
kramdown:
  math_engine: mathjax
  syntax_highlighter: rouge
```

By default, Jekyll doesn't build files or folders that:

* Are located in a folder called `/node_modules` or `/vendor`
* Start with `_`, `.`, or `#`
* End with `~`
* Are excluded by the `exclude` setting in your configuration file

If you want Jekyll to process any of these files, you can use the `include` setting in your configuration file.

## Front matter

To set variables and metadata, such as a title and layout, for a page or post on your site, you can add YAML front matter to the top of any Markdown or HTML file. For more information, see [Front Matter](https://jekyllrb.com/docs/front-matter/) in the Jekyll documentation.

You can add `site.github` to a post or page to add any repository references metadata to your site. For more information, see [Using `site.github`](https://jekyll.github.io/github-metadata/site.github/) in the Jekyll Metadata documentation.

## Themes

You can add a Jekyll theme to your GitHub Pages site to customize the look and feel of your site. For more information, see [Themes](https://jekyllrb.com/docs/themes/) in the Jekyll documentation.

You can add a supported theme to your site on GitHub. For more information, see [Supported themes](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll#supported-themes) on the GitHub Pages site and [Adding a theme to your GitHub Pages site using Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll).

To use any other open source Jekyll theme hosted on GitHub, you can add the theme manually. For more information, see [themes hosted on GitHub](https://github.com/topics/jekyll-theme) and [Adding a theme to your GitHub Pages site using Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll).

You can override any of your theme's defaults by editing the theme's files. For more information, see your theme's documentation and [Overriding your theme's defaults](https://jekyllrb.com/docs/themes/#overriding-theme-defaults) in the Jekyll documentation.

## Plugins

You can download or create Jekyll plugins to extend the functionality of Jekyll for your site. For example, the [jemoji](https://github.com/jekyll/jemoji) plugin lets you use GitHub-flavored emoji in any page on your site the same way you would on GitHub. For more information, see [Plugins](https://jekyllrb.com/docs/plugins/) in the Jekyll documentation.

GitHub Pages uses plugins that are enabled by default and cannot be disabled:

* [`jekyll-coffeescript`](https://github.com/jekyll/jekyll-coffeescript)
* [`jekyll-default-layout`](https://github.com/benbalter/jekyll-default-layout)
* [`jekyll-gist`](https://github.com/jekyll/jekyll-gist)
* [`jekyll-github-metadata`](https://github.com/jekyll/github-metadata)
* [`jekyll-optional-front-matter`](https://github.com/benbalter/jekyll-optional-front-matter)
* [`jekyll-paginate`](https://github.com/jekyll/jekyll-paginate)
* [`jekyll-readme-index`](https://github.com/benbalter/jekyll-readme-index)
* [`jekyll-titles-from-headings`](https://github.com/benbalter/jekyll-titles-from-headings)
* [`jekyll-relative-links`](https://github.com/benbalter/jekyll-relative-links)

You can enable additional plugins by adding the plugin's gem to the `plugins` setting in your `_config.yml` file. For more information, see [Configuration](https://jekyllrb.com/docs/configuration/) in the Jekyll documentation.

For a list of supported plugins, see [Dependency versions](https://pages.github.com/versions.json) on the GitHub Pages site. For usage information for a specific plugin, see the plugin's documentation.

> \[!TIP]
> You can make sure you're using the latest version of all plugins by keeping the GitHub Pages gem updated. For more information, see [Testing your GitHub Pages site locally with Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll#updating-the-github-pages-gem) and [Dependency versions](https://pages.github.com/versions.json) on the GitHub Pages site.

GitHub Pages cannot build sites using unsupported plugins. If you want to use unsupported plugins, generate your site locally and then push your site's static files to GitHub.

## Syntax highlighting

To make your site easier to read, code snippets are highlighted on GitHub Pages sites the same way they're highlighted on GitHub. For more information about syntax highlighting, see [Creating and highlighting code blocks](/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks).

By default, code blocks on your site will be highlighted by Jekyll. Jekyll uses the [Rouge](https://github.com/rouge-ruby/rouge) highlighter (which is compatible with [Pygments](https://pygments.org/)). If you specify Pygments in your `_config.yml` file, Rouge will be used as the fallback instead. Jekyll cannot use any other syntax highlighter, and you'll get a page build warning if you specify another syntax highlighter in your `_config.yml` file. For more information, see [About Jekyll build errors for GitHub Pages sites](/en/pages/setting-up-a-github-pages-site-with-jekyll/about-jekyll-build-errors-for-github-pages-sites).

> \[!NOTE]
> Rouge only recognizes lower-case language identifiers for fenced code blocks. For a list of supported languages, see [Languages](https://rouge-ruby.github.io/docs/file.Languages.html).

If you want to use another highlighter, such as [highlight.js](https://github.com/highlightjs/highlight.js), you must disable Jekyll's syntax highlighting by updating your project's `_config.yml` file.

```yaml
kramdown:
  syntax_highlighter_opts:
    disable : true
```

If your theme doesn't include CSS for syntax highlighting, you can generate GitHub's syntax highlighting CSS and add it to your project's `style.css` file.

```shell
rougify style github > style.css
```

## Building your site locally

If you are publishing from a branch, changes to your site are published automatically when the changes are merged into your site's publishing source. If you are publishing from a custom GitHub Actions workflow, changes are published whenever your workflow is triggered (typically by a push to the default branch). If you want to preview your changes first, you can make the changes locally instead of on GitHub. Then, test your site locally. For more information, see [Testing your GitHub Pages site locally with Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll).

---

## Adding a theme to your GitHub Pages site using Jekyll

**URL:** https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll

> You can personalize your Jekyll site by adding and customizing a theme.

# Adding a theme to your GitHub Pages site using Jekyll

You can personalize your Jekyll site by adding and customizing a theme.

> \[!NOTE] While the `github-pages` gem remains supported for some workflows, GitHub Actions is now the recommended approach for deploying and automating GitHub Pages sites.

People with write permissions for a repository can add a theme to a GitHub Pages site using Jekyll.

If you are publishing from a branch, changes to your site are published automatically when the changes are merged into your site's publishing source. If you are publishing from a custom GitHub Actions workflow, changes are published whenever your workflow is triggered (typically by a push to the default branch). If you want to preview your changes first, you can make the changes locally instead of on GitHub. Then, test your site locally. For more information, see [Testing your GitHub Pages site locally with Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll).

## Supported themes

Out of the box, the following themes are supported:

* [Architect](https://github.com/pages-themes/architect)
* [Cayman](https://github.com/pages-themes/cayman)
* [Dinky](https://github.com/pages-themes/dinky)
* [Hacker](https://github.com/pages-themes/hacker)
* [Leap day](https://github.com/pages-themes/leap-day)
* [Merlot](https://github.com/pages-themes/merlot)
* [Midnight](https://github.com/pages-themes/midnight)
* [Minima](https://github.com/jekyll/minima)
* [Minimal](https://github.com/pages-themes/minimal)
* [Modernist](https://github.com/pages-themes/modernist)
* [Slate](https://github.com/pages-themes/slate)
* [Tactile](https://github.com/pages-themes/tactile)
* [Time machine](https://github.com/pages-themes/time-machine)

The [`jekyll-remote-theme`](https://github.com/benbalter/jekyll-remote-theme) Jekyll plugin is also available and lets you load other themes.

## Adding a theme

1. On GitHub, navigate to your site's repository.

2. Navigate to the publishing source for your site. For more information, see [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

3. Navigate to `_config.yml`.

4. In the upper right corner of the file view, click <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-pencil" aria-label="Edit file" role="img"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path></svg> to open the file editor.
   ![Screenshot of a file. In the header, a button, labeled with a pencil icon, is outlined in dark orange.](/assets/images/help/repository/edit-file-edit-button.png)

   > \[!NOTE]
   > Instead of editing and committing the file using the default file editor, you can optionally choose to use the [github.dev code editor](/en/codespaces/the-githubdev-web-based-editor) by selecting the <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-triangle-down" aria-label="More edit options" role="img"><path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path></svg> dropdown menu and clicking **github.dev**. You can also clone the repository and edit the file locally via GitHub Desktop by clicking **GitHub Desktop**.
   >
   > ![Screenshot of a file. In the header, a downwards-facing triangle icon is outlined in dark orange.](/assets/images/help/repository/edit-file-edit-dropdown.png)

5. Add a new line to the file for the theme name.
   * To use a supported theme, type `theme: THEME-NAME`, replacing THEME-NAME with the name of the theme as shown in the `_config.yml` of the theme's repository (most themes follow a `jekyll-theme-NAME` naming convention). For a list of supported themes, see [Supported themes](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll#supported-themes) on the GitHub Pages site. For example, to select the Minimal theme, type `theme: jekyll-theme-minimal`.
   * To use any other Jekyll theme hosted on GitHub, type `remote_theme: THEME-NAME`, replacing THEME-NAME with the name of the theme as shown in the README of the theme's repository.

6. Click **Commit changes...**

7. In the "Commit message" field, type a short, meaningful commit message that describes the change you made to the file. You can attribute the commit to more than one author in the commit message. For more information, see [Creating a commit with multiple authors](/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors).

8. If you have more than one email address associated with your account on GitHub, click the email address drop-down menu and select the email address to use as the Git author email address. Only verified email addresses appear in this drop-down menu. If you enabled email address privacy, then a no-reply will be the default commit author email address. For more information about the exact form the no-reply email address can take, see [Setting your commit email address](/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address).

   ![Screenshot of a GitHub pull request showing a dropdown menu with options to choose the commit author email address. octocat@github.com is selected.](/assets/images/help/repository/choose-commit-email-address.png)

9. Below the commit message fields, decide whether to add your commit to the current branch or to a new branch. If your current branch is the default branch, you should choose to create a new branch for your commit and then create a pull request. For more information, see [Creating a pull request](/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

   ![Screenshot of a GitHub pull request showing a radio button to commit directly to the main branch or to create a new branch. New branch is selected.](/assets/images/help/repository/choose-commit-branch.png)

10. Click **Commit changes** or **Propose changes**.

## Customizing your theme's CSS

These instructions work best with themes that are officially supported by GitHub Pages. For a complete list of supported themes, see [Supported themes](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll#supported-themes) on the GitHub Pages site.

Your theme's source repository may offer some help in customizing your theme. For example, see [Minimal's README](https://github.com/pages-themes/minimal#customizing).

1. On GitHub, navigate to your site's repository.

2. Navigate to the publishing source for your site. For more information, see [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

3. Create a new file called `/assets/css/style.scss`.

4. Add the following content to the top of the file:

   ```scss
   ---
   ---

   @import "{{ site.theme }}";
   ```

5. Add any custom CSS or Sass (including imports) you'd like immediately after the `@import` line.

## Customizing your theme's HTML layout

These instructions work best with themes that are officially supported by GitHub Pages. For a complete list of supported themes, see [Supported themes](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll#supported-themes) on the GitHub Pages site.

Your theme's source repository may offer some help in customizing your theme. For example, see [Minimal's README](https://github.com/pages-themes/minimal#customizing).

1. On GitHub, navigate to your theme's source repository. For example, the source repository for Minimal is `https://github.com/pages-themes/minimal`.
2. In the `_layouts` folder, navigate to your theme's `_default.html` file.
3. Copy the contents of the file.
4. On GitHub, navigate to your site's repository.
5. Navigate to the publishing source for your site. For more information, see [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
6. Create a file called `_layouts/default.html`.
7. Paste the default layout content you copied earlier.
8. Customize the layout as you'd like.

## Further reading

* [Creating new files](/en/repositories/working-with-files/managing-files/creating-new-files)

---

