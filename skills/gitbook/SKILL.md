---
name: gitbook
description: GitBook documentation platform. Use when creating, publishing, or managing docs sites — content structure, blocks, Git Sync, customization, AI search, collaboration, and the GitBook API.
---

# GitBook Skill

Comprehensive assistance with GitBook — an AI-native documentation platform for creating, publishing, and managing product documentation, API references, and knowledge bases.

## When to Use This Skill

Trigger this skill when:

- **Creating documentation** in GitBook (spaces, pages, blocks, collections)
- **Setting up Git Sync** between a GitBook space and a GitHub or GitLab repository
- **Publishing a docs site** — custom domains, site structure, visibility settings
- **Configuring GitBook AI** — AI Search, GitBook Assistant, GitBook Agent
- **Collaborating on docs** — change requests, roles, permissions, comments
- **Importing content** from Notion, Confluence, GitHub, or other sources
- **Customizing site appearance** — themes, colors, fonts, logos, layout
- **Using the GitBook API** or building integrations
- **Embedding docs** into a product using Docs Embed
- **Troubleshooting** Git Sync conflicts, publishing issues, or permission problems

## Key Concepts

### Content Hierarchy
```
Organization
  └── Collection (group of spaces)
       └── Space (a documentation project)
            └── Page (a document)
                 └── Block (content unit: text, code, hint, table, etc.)
```

### Spaces vs Sites
- **Space** — where you write and organize content (private by default)
- **Docs Site** — the published version of one or more spaces; has its own URL, customization, and access controls

### Change Requests
GitBook's equivalent of Git pull requests. All edits happen in a change request (a branch of the live content), then get reviewed and merged — preserving a full audit trail.

---

## Getting Started

### Create an Account and First Space
1. Sign up at `app.gitbook.com`
2. Create a new space from the sidebar
3. Add pages using the `+` button or `/` command in the editor
4. Publish as a docs site when ready

### Import Existing Content
GitBook can import from:
- **Confluence** — via the import panel
- **Notion** — via the import panel
- **GitHub/GitLab** — via Git Sync (bi-directional)
- **Files** — Markdown, HTML, Word documents, CSV

```
Space menu → Import → Choose source
```

---

## Content Creation

### Blocks
GitBook is block-based — every element is a block. Insert with `/` in the editor.

| Block | Purpose |
|-------|---------|
| Paragraph | Standard text with inline formatting |
| Heading (H1/H2/H3) | Page structure and SEO |
| Code block | Syntax-highlighted code with language detection |
| Hint | Callouts: `info`, `warning`, `danger`, `success` |
| Table | Structured data |
| Tabs | Side-by-side content variants |
| Expandable | Collapsible FAQ-style sections |
| Stepper | Step-by-step guides |
| Cards | Visual navigation grids |
| Image | Single image or gallery |
| Embed | Video, Figma, CodePen, etc. |
| Reusable content | Synced block used across multiple pages |
| OpenAPI | Auto-rendered API reference from an OpenAPI spec |
| Drawing | Inline diagram editor |
| Math/TeX | Mathematical formulas |

### Hint Block Styles
```
{% hint style="info" %}    → Blue info box
{% hint style="warning" %} → Yellow warning
{% hint style="danger" %}  → Red alert
{% hint style="success" %} → Green success
{% endhint %}
```

### Code Blocks
- Set language for syntax highlighting
- Toggle line numbers, caption, line wrap
- One-click copy button for readers

### Reusable Content
Create once, sync everywhere. Edit one instance and all uses update automatically.
```
/ → Reusable content → Create new reusable block
Requires Pro or Enterprise plan
```

### Variables and Expressions
Define reusable text values (version numbers, product names) at the space level. Reference them inline with `{{ variable_name }}`. Useful for content that changes across versions.

### Version Control
Every change request merge creates a history entry. View the **Version history** side panel to see all changes — who made them, when, and what changed. Roll back by creating a new change request from a past version.

---

## Git Sync

Bi-directional sync between a GitBook space and a GitHub or GitLab repo.

### Enabling GitHub Sync
1. Open space → **Configure** (top-right header)
2. Select **GitHub Sync** from the provider list
3. Authenticate with GitHub (one-time)
4. Choose repo, branch, and sync direction:
   - **GitHub → GitBook** (import existing docs)
   - **GitBook → GitHub** (export to repo)
   - **Bi-directional** (recommended)

### `.gitbook.yaml` Configuration
Place at the repo root to control how GitBook parses the repo:

```yaml
root: ./docs          # optional: look in a subdirectory
structure:
  readme: README.md   # the space's root page
  summary: SUMMARY.md # table of contents

redirects:
  previous/page: new-folder/page.md
```

### Monorepos
Point `root:` to a specific subdirectory to sync only part of a repo.

### How Content Maps
- Markdown files → GitBook pages
- Folders → page groups
- `SUMMARY.md` → sidebar structure (if present)
- Images in `.gitbook/assets` → embedded images

### Pull Request Previews
GitBook can add a preview comment to GitHub PRs showing a staging link before merge.

---

## Publishing Docs Sites

### Create a Docs Site
```
Organization home → New site → Link an existing space or create new
```

### Site Structure Options
- **Single space** — one space = one site
- **Site sections** — multiple spaces as tabbed sections (e.g., "Guides", "API Reference")
- **Content variants** — same space, multiple versions (e.g., v1, v2) or languages

### Custom Domain
1. Available on Premium and Ultimate plans
2. Add CNAME record pointing to `hosting.gitbook.io`
3. Enter domain in site settings → **Custom domain**
4. GitBook auto-provisions SSL

Custom subdirectory (e.g. `example.com/docs`) requires a Cloudflare Workers, Vercel, or AWS CloudFront proxy.

### Visibility Options
- **Public** — anyone can access without signing in
- **Unlisted** — accessible via direct link only
- **Private** — requires GitBook account with org membership
- **Share links** — invite-only access via secret URL
- **Authenticated access** — your own SSO/JWT visitor authentication

### Site Customization
- Logo, favicon, social image
- Color theme (light/dark/system)
- Font family
- Header links and footer
- Custom CSS (Ultimate plan)

### PDF Export
Enable in site settings → readers can export any page or the full site as PDF.

---

## Collaboration

### Change Requests
The primary editing workflow — all edits live in a change request until merged.

```
Space → New change request → Edit → Request review → Merge
```

- Multiple people can edit the same change request
- Reviewers get notified; can approve or request changes
- Merge rules can require N approvals before merging

### Roles

| Role | Can do |
|------|--------|
| Owner | Everything including billing and org deletion |
| Admin | Manage members, spaces, and settings |
| Creator | Create and publish spaces and sites |
| Editor | Edit content in spaces with edit access |
| Reviewer | Review and comment on change requests |
| Commenter | Comment only, no edits |
| Reader | View only |

### Permissions and Inheritance
GitBook uses cascading role-based permissions:
```
Organization role → inherited by all spaces
  └── Collection role → overrides org role for spaces in collection
       └── Space role → overrides for that space
            └── Site role → overrides for published site access
```
Setting a space to "No access" restricts it regardless of org-level role.

### Comments
Add inline comments on any block. Comments thread and resolve. Use `@mentions` to notify team members.

---

## AI Features

### GitBook AI Search
Replaces keyword search with semantic understanding. Users ask questions in natural language; AI answers using your docs as the source.

```
Site → Configure → Search → Enable AI Search
```

Options:
- **Keyword search** — default, always on
- **GitBook AI search** — semantic Q&A over your docs (Pro+)
- **GitBook AI search + Crawler** — also indexes external URLs

### GitBook Agent
An AI teammate that creates and maintains documentation inside GitBook.

Capabilities:
- Write new pages from a prompt or outline
- Edit existing blocks via natural language instructions
- All edits happen in a change request for human review
- Follows custom style guides and instructions
- Translate docs into other languages
- Write from source materials (URLs or uploaded files)

Requires Pro or Enterprise plan.

### Docs Embed
Embed your documentation as a widget inside your own product:

```html
<script src="https://gitbook.com/assets/docs-embed.js"
        data-api-key="YOUR_KEY"></script>
```

```tsx
// React
import { GitBookEmbed } from '@gitbook/docs-embed/react';

<GitBookEmbed apiKey="YOUR_KEY" welcomeMessage="How can we help?" />
```

Supports AI Q&A, page browsing, custom welcome messages, and authenticated visitors.

### LLM-Ready Docs
Every GitBook page exposes a machine-readable endpoint:
```
GET https://your-site.gitbook.io/page-path.md
```

With live Q&A:
```
GET https://your-site.gitbook.io/page-path.md?ask=how do I set up git sync
```

### AI Insights
See what questions users are actually asking — identify documentation gaps.
```
Site → Insights → AI Insights
```

---

## Developer API

### Authentication
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.gitbook.com/v1/user
```

Generate tokens: `app.gitbook.com → Settings → Developer → API Tokens`

### Key Endpoints
```
GET  /v1/orgs/{orgId}/spaces           List spaces
GET  /v1/spaces/{spaceId}/content      Get space content
POST /v1/spaces/{spaceId}/content/page Create a page
GET  /v1/spaces/{spaceId}/revisions    List revision history
```

### Integrations SDK
Build custom GitBook integrations using `@gitbook/runtime`:
- Custom blocks rendered in the GitBook editor
- Webhooks triggered on space events
- External data source connections

---

## Examples

### Example 1: Set Up Git Sync for a Monorepo

```yaml
# .gitbook.yaml — docs live in /packages/docs/
root: ./packages/docs
structure:
  readme: index.md
  summary: SUMMARY.md
redirects:
  old-section/page: new-section/page.md
```

1. Space → Configure → GitHub Sync → select repo, branch `main`
2. After initial import, switch to bi-directional sync
3. Publish as docs site with custom domain

### Example 2: Version Variants for v1/v2 Docs

1. Create two spaces: `docs-v1` and `docs-v2`
2. Create docs site → **Add space** → configure as **Content variants**
3. GitBook shows a version picker; `/v1/` and `/v2/` paths both stay live

### Example 3: Reusable Warning Callout Across Spaces

```
Space settings → Reusable content → New reusable block
Add hint: {% hint style="warning" %}
          Breaking change in v2: the `id` field is now `uuid`.
          {% endhint %}
```

Embed this block on every affected page. Update once → all pages update.

### Example 4: Adaptive Content for Different User Plans

```
Site → Configure → Adaptive content
```
Define visitor properties (`plan: "free" | "pro" | "enterprise"`) via your auth token. Show/hide blocks conditionally based on `{{ visitor.plan }}`.

---

## Common Patterns

### Hint for Plan-Gated Features
```
{% hint style="info" %}
This feature is available on Pro and Enterprise plans.
{% endhint %}
```

### `.gitbook.yaml` with Redirects
```yaml
root: ./docs
structure:
  readme: README.md
  summary: SUMMARY.md
redirects:
  getting-started: introduction/quickstart.md
  api/v1/auth: api/authentication.md
```

### Variable Reference in Content
```
API base URL: {{ env.api_base_url }}
Current version: {{ product.version }}
```

---

## Resources

- **Docs**: `gitbook.com/docs`
- **LLMs.txt** (full doc index): `gitbook.com/docs/llms.txt`
- **API reference**: `gitbook.com/docs/developers/gitbook-api/api-reference`
- **Integrations SDK**: `gitbook.com/docs/developers/integrations`
- **Community**: `community.gitbook.com`
- **Status**: `gitbookstatus.com`
