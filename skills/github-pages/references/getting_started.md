# GitHub Pages - Getting Started

**Pages:** 5

---

## What is GitHub Pages?

**URL:** https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages

> You can use GitHub Pages to host a website about yourself, your organization, or your project directly from a repository on GitHub.

# What is GitHub Pages?

You can use GitHub Pages to host a website about yourself, your organization, or your project directly from a repository on GitHub.

## About GitHub Pages

GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website. You can see examples of GitHub Pages sites in the [GitHub Pages examples collection](https://github.com/collections/github-pages-examples).

## Types of GitHub Pages sites

There are two types of GitHub Pages sites. Sites associated with a user or organization account, and sites for a specific project.

<table>
<thead>
<tr>
<th>Property</th>
<th>User and organization sites</th>
<th>Project sites</th>
</tr>
</thead>
<tbody>
<tr>
<th>Source files</th>
<td>Must be stored in a repository named <code>&lt;owner&gt;.github.io</code>, where <code>&lt;owner&gt;</code> is the personal or organization account name</td>
<td>Stored in a folder within the repository that contains the project&#39;s code</td>
</tr>
<tr>
<th>Limits</th>
<td>Maximum of one pages site per account</td>
<td>Maximum of one pages site per repository</td>
</tr>

<tr>
<th>Default site location</th>
<td><code>http(s)://&lt;owner&gt;.github.io</code></td>
<td><code>http(s)://&lt;owner&gt;.github.io/&lt;repositoryname&gt;</code></td>
</tr>

</tbody>
</table>

### Hosting on your own custom domain

You can host your site on GitHub's `github.io` domain or your own custom domain. See [Configuring a custom domain for your GitHub Pages site](/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Data collection

When a GitHub Pages site is visited, the visitor's IP address is logged and stored for security purposes, regardless of whether the visitor has signed into GitHub or not. For more information about GitHub's security practices, see [GitHub Privacy Statement](/en/site-policy/privacy-policies/github-privacy-statement).

## Further reading

* [GitHub Pages](https://github.com/skills/github-pages) on GitHub Skills
* [REST API endpoints for repositories](/en/rest/repos#pages)
* [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
* [About custom domains and GitHub Pages](/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages#using-a-custom-domain-across-multiple-repositories)

---

## Creating a GitHub Pages site

**URL:** https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

> You can create a GitHub Pages site in a new or existing repository.

# Creating a GitHub Pages site

You can create a GitHub Pages site in a new or existing repository.

## Creating a repository for your site

You can either create a repository or choose an existing repository for your site.

If you want to create a GitHub Pages site for a repository where not all of the files in the repository are related to the site, you will be able to configure a publishing source for your site. For example, you can have a dedicated branch and folder to hold your site source files, or you can use a custom GitHub Actions workflow to build and deploy your site source files.

If the account that owns the repository uses GitHub Free or GitHub Free for organizations, the repository must be public.

If you want to create a site in an existing repository, skip to the [Creating your site](#creating-your-site) section.

1. In the upper-right corner of any page, select <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-plus" aria-label="Create something new" role="img"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path></svg>, then click **New repository**.

   ![Screenshot of a GitHub dropdown menu showing options to create new items. The menu item "New repository" is outlined in dark orange.](/assets/images/help/repository/repo-create-global-nav-update.png)

2. Use the **Owner** dropdown menu to select the account you want to own the repository.
   ![Screenshot of the owner menu for a new GitHub repository. The menu shows two options, octocat and github.](/assets/images/help/repository/create-repository-owner.png)

3. Type a name for your repository and an optional description. If you're creating a user or organization site, your repository must be named `<user>.github.io` or `<organization>.github.io`. If your user or organization name contains uppercase letters, you must lowercase the letters.
   For more information, see [What is GitHub Pages?](/en/pages/getting-started-with-github-pages/what-is-github-pages#types-of-github-pages-sites).
   ![Screenshot of GitHub Pages settings in a repository. The repository name field contains the text "octocat.github.io" and is outlined in dark orange.](/assets/images/help/pages/create-repository-name-pages.png)

4. Choose a repository visibility. For more information, see [About repositories](/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility).

5. Toggle **Add README** to **On**.

6. Click **Create repository**.

## Creating your site

Before you can create your site, you must have a repository for your site on GitHub. If you're not creating your site in an existing repository, see [Creating a repository for your site](#creating-a-repository-for-your-site).

> \[!WARNING]
> GitHub Pages sites are publicly available on the internet, even if the repository for the site is private (if your plan or organization allows it). If you have sensitive data in your site's repository, you may want to remove the data before publishing. For more information, see [About repositories](/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility).

1. On GitHub, navigate to your site's repository.

2. Decide which publishing source you want to use. See [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

3. Create the entry file for your site. GitHub Pages will look for an `index.html`, `index.md`, or `README.md` file as the entry file for your site.

   If your publishing source is a branch and folder, the entry file must be at the top level of the source folder on the source branch. For example, if your publishing source is the `/docs` folder on the `main` branch, your entry file must be located in the `/docs` folder on a branch called `main`.

   If your publishing source is a GitHub Actions workflow, the artifact that you deploy must include the entry file at the top level of the artifact. Instead of adding the entry file to your repository, you may choose to have your GitHub Actions workflow generate your entry file when the workflow runs.

4. Configure your publishing source. See [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

5. Your GitHub Pages site is built and deployed with a GitHub Actions workflow. For more information, see [Viewing workflow run history](/en/actions/monitoring-and-troubleshooting-workflows/viewing-workflow-run-history).

   > \[!NOTE]
   > GitHub Actions is free for public repositories. Usage charges apply for private and internal repositories that go beyond the monthly allotment of free minutes. For more information, see [Billing and usage](/en/actions/learn-github-actions/usage-limits-billing-and-administration).

## Viewing your published site

1. Under your repository name, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-gear" aria-label="gear" role="img"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg> Settings**. If you cannot see the "Settings" tab, select the **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-kebab-horizontal" aria-label="More" role="img"><path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path></svg>** dropdown menu, then click **Settings**.

   ![Screenshot of a repository header showing the tabs. The "Settings" tab is highlighted by a dark orange outline.](/assets/images/help/repository/repo-actions-settings.png)
2. In the "Code and automation" section of the sidebar, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-browser" aria-label="browser" role="img"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25ZM14.5 6h-13v7.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm-6-3.5v2h6V2.75a.25.25 0 0 0-.25-.25ZM5 2.5v2h2v-2Zm-3.25 0a.25.25 0 0 0-.25.25V4.5h2v-2Z"></path></svg> Pages**.
3. To see your published site, under "GitHub Pages," click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-link-external" aria-label="link-external" role="img"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path></svg> Visit site**.

> \[!NOTE]
> It can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub. If you don't see your GitHub Pages site changes reflected in your browser after an hour, see [About Jekyll build errors for GitHub Pages sites](/en/pages/setting-up-a-github-pages-site-with-jekyll/about-jekyll-build-errors-for-github-pages-sites).
> \[!NOTE]
>
> * If you are publishing from a branch and your site has not published automatically, make sure someone with admin permissions and a verified email address has pushed to the publishing source.
> * Commits pushed by a GitHub Actions workflow that uses the `GITHUB_TOKEN` do not trigger a GitHub Pages build.

## Static site generators

GitHub Pages publishes any static files that you push to your repository. You can create your own static files or use a static site generator to build your site for you. You can also customize your own build process locally or on another server.

If you use a custom build process or a static site generator other than Jekyll, you can write a GitHub Actions workflow to build and publish your site. GitHub provides workflow templates for several static site generators. For more information, see [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

If you publish your site from a source branch, GitHub Pages will use Jekyll to build your site by default. If you want to use a static site generator other than Jekyll, we recommend that you write a GitHub Actions to build and publish your site instead. Otherwise, disable the Jekyll build process by creating an empty file called `.nojekyll` in the root of your publishing source, then follow your static site generator's instructions to build your site locally.

> \[!NOTE] GitHub Pages does not support server-side languages such as PHP, Ruby, or Python.

## MIME types on GitHub Pages

A MIME type is a header that a server sends to a browser, providing information about the nature and format of the files the browser requested. GitHub Pages supports more than 750 MIME types across thousands of file extensions. The list of supported MIME types is generated from the [mime-db project](https://github.com/jshttp/mime-db).

While you can't specify custom MIME types on a per-file or per-repository basis, you can add or modify MIME types for use on GitHub Pages. For more information, see [the mime-db contributing guidelines](https://github.com/jshttp/mime-db#adding-custom-media-types).

## Next steps

You can add more pages to your site by creating more new files. Each file will be available on your site in the same directory structure as your publishing source. For example, if the publishing source for your project site is the `gh-pages` branch, and you create a new file called `/about/contact-us.md` on the `gh-pages` branch, the file will be available at `https://<user>.github.io/<repository>/about/contact-us.html`.

You can also add a theme to customize your site’s look and feel. For more information, see [Adding a theme to your GitHub Pages site using Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll).

## Further reading

* [About GitHub Pages and Jekyll](/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll).
* [Troubleshooting Jekyll build errors for GitHub Pages sites](/en/pages/setting-up-a-github-pages-site-with-jekyll/troubleshooting-jekyll-build-errors-for-github-pages-sites)
* [Creating and deleting branches within your repository](/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository)
* [Creating new files](/en/repositories/working-with-files/managing-files/creating-new-files)
* [Troubleshooting 404 errors for GitHub Pages sites](/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)

---

## Configuring a publishing source for your GitHub Pages site

**URL:** https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

> You can configure your GitHub Pages site to publish when changes are pushed to a specific branch, or you can write a GitHub Actions workflow to publish your site.

# Configuring a publishing source for your GitHub Pages site

You can configure your GitHub Pages site to publish when changes are pushed to a specific branch, or you can write a GitHub Actions workflow to publish your site.

## About publishing sources

You can publish your site when changes are pushed to a specific branch, or you can write a GitHub Actions workflow to publish your site.

If you do not need any control over the build process for your site, we recommend that you publish your site when changes are pushed to a specific branch. You can specify which branch and folder to use as your publishing source. The source branch can be any branch in your repository, and the source folder can either be the root of the repository (`/`) on the source branch or a `/docs` folder on the source branch. Whenever changes are pushed to the source branch, the changes in the source folder will be published to your GitHub Pages site.

If you want to use a build process other than Jekyll or you do not want a dedicated branch to hold your compiled static files, we recommend that you write a GitHub Actions workflow to publish your site. GitHub provides workflow templates for common publishing scenarios to help you write your workflow.

> \[!WARNING]
> GitHub Pages sites are publicly available on the internet, even if the repository for the site is private (if your plan or organization allows it). If you have sensitive data in your site's repository, you may want to remove the data before publishing. For more information, see [About repositories](/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility).

## Publishing from a branch

1. Make sure the branch you want to use as your publishing source already exists in your repository.
2. On GitHub, navigate to your site's repository.
3. Under your repository name, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-gear" aria-label="gear" role="img"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg> Settings**. If you cannot see the "Settings" tab, select the **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-kebab-horizontal" aria-label="More" role="img"><path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path></svg>** dropdown menu, then click **Settings**.

   ![Screenshot of a repository header showing the tabs. The "Settings" tab is highlighted by a dark orange outline.](/assets/images/help/repository/repo-actions-settings.png)
4. In the "Code and automation" section of the sidebar, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-browser" aria-label="browser" role="img"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25ZM14.5 6h-13v7.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm-6-3.5v2h6V2.75a.25.25 0 0 0-.25-.25ZM5 2.5v2h2v-2Zm-3.25 0a.25.25 0 0 0-.25.25V4.5h2v-2Z"></path></svg> Pages**.
5. Under "Build and deployment", under "Source", select **Deploy from a branch**.
6. Under "Build and deployment", use the branch dropdown menu and select a publishing source.
   ![Screenshot of Pages settings in a GitHub repository. A menu to select a branch for a publishing source, labeled "None," is outlined in dark orange.](/assets/images/help/pages/publishing-source-drop-down.png)
7. Optionally, use the folder dropdown menu to select a folder for your publishing source.
   ![Screenshot of Pages settings in a GitHub repository. A menu to select a folder for a publishing source, labeled "/(root)," is outlined in dark orange.](/assets/images/help/pages/publishing-source-folder-drop-down.png)
8. Click **Save**.

### Troubleshooting publishing from a branch

> \[!NOTE]
> If your repository contains symbolic links, you will need to publish your site using a GitHub Actions workflow. For more information about GitHub Actions, see [GitHub Actions documentation](/en/actions).

> \[!NOTE]
>
> * If you are publishing from a branch and your site has not published automatically, make sure someone with admin permissions and a verified email address has pushed to the publishing source.
> * Commits pushed by a GitHub Actions workflow that uses the `GITHUB_TOKEN` do not trigger a GitHub Pages build.

If you choose the `docs` folder on any branch as your publishing source, then later remove the `/docs` folder from that branch in your repository, your site won't build and you'll get a page build error message for a missing `/docs` folder. For more information, see [Troubleshooting Jekyll build errors for GitHub Pages sites](/en/pages/setting-up-a-github-pages-site-with-jekyll/troubleshooting-jekyll-build-errors-for-github-pages-sites#missing-docs-folder).

Your GitHub Pages site will always be deployed with a GitHub Actions workflow run, even if you've configured your GitHub Pages site to be built using a different CI tool. Most external CI workflows "deploy" to GitHub Pages by committing the build output to the `gh-pages` branch of the repository, and typically include a `.nojekyll` file. When this happens, the GitHub Actions workflow will detect the state that the branch does not need a build step, and will execute only the steps necessary to deploy the site to GitHub Pages servers.

To find potential errors with either the build or deployment, you can check the workflow run for your GitHub Pages site by reviewing your repository's workflow runs. For more information, see [Viewing workflow run history](/en/actions/monitoring-and-troubleshooting-workflows/viewing-workflow-run-history). For more information about how to re-run the workflow in case of an error, see [Re-running workflows and jobs](/en/actions/managing-workflow-runs/re-running-workflows-and-jobs).

## Publishing with a custom GitHub Actions workflow

To configure your site to publish with GitHub Actions:

1. On GitHub, navigate to your site's repository.
2. Under your repository name, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-gear" aria-label="gear" role="img"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg> Settings**. If you cannot see the "Settings" tab, select the **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-kebab-horizontal" aria-label="More" role="img"><path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path></svg>** dropdown menu, then click **Settings**.

   ![Screenshot of a repository header showing the tabs. The "Settings" tab is highlighted by a dark orange outline.](/assets/images/help/repository/repo-actions-settings.png)
3. In the "Code and automation" section of the sidebar, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-browser" aria-label="browser" role="img"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25ZM14.5 6h-13v7.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm-6-3.5v2h6V2.75a.25.25 0 0 0-.25-.25ZM5 2.5v2h2v-2Zm-3.25 0a.25.25 0 0 0-.25.25V4.5h2v-2Z"></path></svg> Pages**.
4. Under "Build and deployment", under "Source", select **GitHub Actions**.
5. GitHub will suggest several workflow templates. If you already have a workflow to publish your site, you can skip this step. Otherwise, choose one of the options to create a GitHub Actions workflow. For more information about creating your custom workflow, see [Creating a custom GitHub Actions workflow to publish your site](#creating-a-custom-github-actions-workflow-to-publish-your-site).

   GitHub Pages does not associate a specific workflow to the GitHub Pages settings. However, the GitHub Pages settings will link to the workflow run that most recently deployed your site.

### Creating a custom GitHub Actions workflow to publish your site

For more information about GitHub Actions, see [GitHub Actions documentation](/en/actions).

When you configure your site to publish with GitHub Actions, GitHub will suggest workflow templates for common publishing scenarios. The general flow of a workflow is to:

1. Trigger whenever there is a push to the default branch of the repository or whenever the workflow is run manually from the Actions tab.
2. Use the [`actions/checkout`](https://github.com/actions/checkout) action to check out the repository contents.
3. If required by your site, build any static site files.
4. Use the [`actions/upload-pages-artifact`](https://github.com/actions/upload-pages-artifact) action to upload the static files as an artifact.
5. If the workflow was triggered by a push to the default branch, use the [`actions/deploy-pages`](https://github.com/actions/deploy-pages) action to deploy the artifact. This step is skipped if the workflow was triggered by a pull request.

The workflow templates use a deployment environment called `github-pages`. If your repository does not already include an environment called `github-pages`, the environment will be created automatically. We recommend that you add a deployment protection rule so that only the default branch can deploy to this environment. For more information, see [Managing environments for deployment](/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).

> \[!NOTE]
> A `CNAME` file in your repository file does not automatically add or remove a custom domain. Instead, you must configure the custom domain through your repository settings or through the API. For more information, see [Managing a custom domain for your GitHub Pages site](/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain) and [REST API endpoints for GitHub Pages](/en/rest/pages#update-information-about-a-github-pages-site).

### Troubleshooting publishing with a custom GitHub Actions workflow

For information about how to troubleshoot your GitHub Actions workflow, see [Monitor workflows](/en/actions/monitoring-and-troubleshooting-workflows/about-monitoring-and-troubleshooting).

---

## Using custom workflows with GitHub Pages

**URL:** https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

> You can take advantage of using GitHub Actions and GitHub Pages by creating a workflow file or choosing from the predefined workflows.

# Using custom workflows with GitHub Pages

You can take advantage of using GitHub Actions and GitHub Pages by creating a workflow file or choosing from the predefined workflows.

## About custom workflows

Custom workflows allow GitHub Pages sites to be built via the use of GitHub Actions. You can still select the branch you would like to use via the workflow file, but you are able to do much more with the use of custom workflows. To start using custom workflows you must first enable them for your current repository. For more information, see [Configuring a publishing source for your GitHub Pages site](/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow).

## Configuring the `configure-pages` action

GitHub Actions enables the use of GitHub Pages through the `configure-pages` action, which also lets you gather different metadata about a website. For more information, see the [`configure-pages`](https://github.com/marketplace/actions/configure-github-pages) action.

To use the action place this snippet under your `jobs` in the desired workflow.

```yaml
- name: Configure GitHub Pages
  uses: actions/configure-pages@v5
```

This action helps support deployment from any static site generator to GitHub Pages. To make this process less repetitive you can use workflow templates for some of the most widely used static site generators. For more information, see [Using workflow templates](/en/actions/learn-github-actions/using-starter-workflows).

## Configuring the `upload-pages-artifact` action

The `upload-pages-artifact` actions enables you to package and upload artifacts. The GitHub Pages artifact should be a compressed `gzip` archive containing a single `tar` file. The `tar` file must be under 10GB in size and should not contain any symbolic or hard links. For more information, see the [`upload-pages-artifact`](https://github.com/marketplace/actions/upload-github-pages-artifact) action.

To use the action in your current workflow place this snippet under `jobs`.

```yaml
- name: Upload GitHub Pages artifact
  uses: actions/upload-pages-artifact@v4
```

## Deploying GitHub Pages artifacts

The `deploy-pages` action handles the necessary setup for deploying artifacts. To ensure proper functionality, the following requirements should be met:

* The job must have a minimum of `pages: write` and `id-token: write` permissions.
* The `needs` parameter must be set to the `id` of the build step. Not setting this parameter may result in an independent deployment that continuously searches for an artifact that hasn't been created.
* An `environment` must be established to enforce branch/deployment protection rules. The default environment is `github-pages`.
* To specify the URL of the page as an output, utilize the `url:` field.

For more information, see the [`deploy-pages`](https://github.com/marketplace/actions/deploy-github-pages-site) action.

```yaml
# ...

jobs:
  deploy:
    permissions:
      contents: read
      pages: write
      id-token: write
    runs-on: ubuntu-latest
    needs: jekyll-build
    environment:
      name: github-pages
      url: ${{steps.deployment.outputs.page_url}}
    steps:
      - name: Deploy artifact
        id: deployment
        uses: actions/deploy-pages@v4
# ...
```

## Linking separate build and deploy jobs

You can link your `build` and `deploy` jobs in a single workflow file, eliminating the need to create two separate files to get the same result. To get started on your workflow file, under `jobs` you can define a `build` and `deploy` job to execute your jobs.

```yaml
# ...

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{steps.deployment.outputs.page_url}}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
# ...
```

In certain cases, you might choose to combine everything into a single job, especially if there is no need for a build process. Consequently, you would solely focus on the deployment step.

```yaml
# ...

jobs:
  # Single deploy job no building
  deploy:
    environment:
      name: github-pages
      url: ${{steps.deployment.outputs.page_url}}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v4
        with:
          # upload entire directory
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

# ...
```

You can define your jobs to be run on different runners, sequentially, or in parallel. For more information, see [Choosing what your workflow does](/en/actions/using-jobs).

---

## Securing your GitHub Pages site with HTTPS

**URL:** https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

> HTTPS adds a layer of encryption that prevents others from snooping on or tampering with traffic to your site. You can enforce HTTPS for your GitHub Pages site to transparently redirect all HTTP requests to HTTPS.

# Securing your GitHub Pages site with HTTPS

HTTPS adds a layer of encryption that prevents others from snooping on or tampering with traffic to your site. You can enforce HTTPS for your GitHub Pages site to transparently redirect all HTTP requests to HTTPS.

People with admin permissions for a repository can enforce HTTPS for a GitHub Pages site.

## About HTTPS and GitHub Pages

All GitHub Pages sites, including sites that are correctly configured with a custom domain, support HTTPS and HTTPS enforcement. For more information about custom domains, see [About custom domains and GitHub Pages](/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) and [Troubleshooting custom domains and GitHub Pages](/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages#https-errors).

GitHub Pages sites created after June 15, 2016, and using `github.io` domains are served over HTTPS automatically.

GitHub Pages sites shouldn't be used for sensitive transactions like sending passwords or credit card numbers.

> \[!WARNING]
> GitHub Pages sites are publicly available on the internet, even if the repository for the site is private (if your plan or organization allows it). If you have sensitive data in your site's repository, you may want to remove the data before publishing. For more information, see [About repositories](/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility).

> \[!NOTE]
> RFC3280 states that the maximum length of the common name should be 64 characters. Therefore, the entire domain name of your GitHub Pages site must be less than 64 characters long for a certificate to be successfully created.

## Enforcing HTTPS for your GitHub Pages site

1. On GitHub, navigate to your site's repository.
2. Under your repository name, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-gear" aria-label="gear" role="img"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg> Settings**. If you cannot see the "Settings" tab, select the **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-kebab-horizontal" aria-label="More" role="img"><path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path></svg>** dropdown menu, then click **Settings**.

   ![Screenshot of a repository header showing the tabs. The "Settings" tab is highlighted by a dark orange outline.](/assets/images/help/repository/repo-actions-settings.png)
3. In the "Code and automation" section of the sidebar, click **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-browser" aria-label="browser" role="img"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25ZM14.5 6h-13v7.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm-6-3.5v2h6V2.75a.25.25 0 0 0-.25-.25ZM5 2.5v2h2v-2Zm-3.25 0a.25.25 0 0 0-.25.25V4.5h2v-2Z"></path></svg> Pages**.
4. Under "GitHub Pages," select **Enforce HTTPS**.

## Troubleshooting certificate provisioning ("Certificate not yet created" error)

When you set or change your custom domain in the Pages settings, an automatic DNS check begins. This check determines if your DNS settings are configured to allow GitHub to obtain a certificate automatically. If the check is successful, GitHub queues a job to request a TLS certificate from [Let's Encrypt](https://letsencrypt.org/). On receiving a valid certificate, GitHub automatically uploads it to the servers that handle TLS termination for Pages. When this process completes successfully, a check mark is displayed beside your custom domain name.

The process may take some time. If the process has not completed several minutes after you clicked **Save**, try clicking **Remove** next to your custom domain name. Retype the domain name and click **Save** again. This will cancel and restart the provisioning process.

## Resolving problems with mixed content

If you enable HTTPS for your GitHub Pages site but your site's HTML still references images, CSS, or JavaScript over HTTP, then your site is serving *mixed content*. Serving mixed content may make your site less secure and cause trouble loading assets.

To remove your site's mixed content, make sure all your assets are served over HTTPS by changing `http://` to `https://` in your site's HTML.

Assets are commonly found in the following locations:

* If your site uses Jekyll, your HTML files will probably be found in the `_layouts` folder.
* CSS is usually found in the `<head>` section of your HTML file.
* JavaScript is usually found in the `<head>` section or just before the closing `</body>` tag.
* Images are often found in the `<body>` section.

> \[!TIP]
> If you can't find your assets in your site's source files, try searching your site's source files for `http://` in your text editor or on GitHub.

### Examples of assets referenced in an HTML file

| Asset type |                                              HTTP                                              |                                               HTTPS                                              |
| :--------: | :--------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|     CSS    |                `<link rel="stylesheet" href="http://example.com/css/main.css">`                |                 `<link rel="stylesheet" href="https://example.com/css/main.css">`                |
| JavaScript |         `<script type="text/javascript" src="http://example.com/js/main.js"></script>`         |          `<script type="text/javascript" src="https://example.com/js/main.js"></script>`         |
|    Image   | `<a href="http://www.somesite.com"><img src="http://www.example.com/logo.jpg" alt="Logo"></a>` | `<a href="https://www.somesite.com"><img src="https://www.example.com/logo.jpg" alt="Logo"></a>` |

## Verifying the DNS configuration

In some cases, a HTTPS certificate will not be able to be generated due to the DNS configuration of your custom domain. This can be caused by extra DNS records, or records not pointing to the IP addresses for GitHub Pages.

To ensure a HTTPS certificate generates correctly, we recommend the following configurations. Any additional `A`, `AAAA`, `ALIAS`, `ANAME` records with the `@` host, or `CNAME` records pointing to your `www` subdomain or other custom subdomain that you would like to use with GitHub Pages may prevent the HTTPS certificate from generating.

| Scenario                                                     | DNS record type    | DNS record name          | DNS record value(s)                                                                                    |
| ------------------------------------------------------------ | ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Apex domain<br />(`example.com`)                             | `A`                | `@`                      | `185.199.108.153`<br />`185.199.109.153`<br />`185.199.110.153`<br />`185.199.111.153`                 |
| Apex domain<br />(`example.com`)                             | `AAAA`             | `@`                      | `2606:50c0:8000::153`<br />`2606:50c0:8001::153`<br />`2606:50c0:8002::153`<br />`2606:50c0:8003::153` |
| Apex domain<br />(`example.com`)                             | `ALIAS` or `ANAME` | `@`                      | `USERNAME.github.io` or<br /> `ORGANIZATION.github.io`                                                 |
| Subdomain<br />(`ww​w.example.com`,<br />`blog.example.com`) | `CNAME`            | `SUBDOMAIN.example.com.` | `USERNAME.github.io` or<br /> `ORGANIZATION.github.io`                                                 |

---

