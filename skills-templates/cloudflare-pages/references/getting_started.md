# Cloudflare-Pages - Getting Started

**Pages:** 2

---

## Design guide title

**URL:** llms-txt#design-guide-title

**Contents:**
- Introduction
  - Who is this for?
- Heading 1
  - Subheading 1
- Heading 2
  - Subheading 2
- Heading 3
  - Subheading 4
- Summary
- Purpose

## Introduction
Provide context to what this guide is going to cover. Ensure you describe the end state of the solution this guide will detail.

### Who is this for?
This reference architecture is designed for IT or security professionals with some responsibility over or familiarity with their organization’s existing infrastructure. It is useful to have some experience with technologies important to securing hybrid work, including identity providers (IdPs), user directories, single sign on (SSO), endpoint security or management (EPP, XDR, UEM, MDM), firewalls, routers, and point solutions like packet or content inspection hardware, threat prevention, and data loss prevention technologies.

## Heading 1
### Subheading 1

## Heading 2
### Subheading 2

## Heading 3
### Subheading 4

## Summary
yaml
pcx_content_type: faq
yaml
pcx_content_type: get-started
plaintext
---
weight: xx
pcx_content_type: get-started
---

**Examples:**

Example 1 (unknown):
```unknown
</page>

<page>
---
title: FAQ · Cloudflare Style Guide
description: The purpose of an FAQ is to provide simple answers to common questions.
lastUpdated: 2025-06-24T21:05:23.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/faq/
  md: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/faq/index.md
---

## Purpose

The purpose of an FAQ is to provide simple answers to common questions.

## Tone

Guiding, straightforward, educational, authoritative

## content\_type
```

Example 2 (unknown):
```unknown
For more details, refer to [`pcx_content_type`](https://developers.cloudflare.com/style-guide/frontmatter/custom-properties/#pcx_content_type).

## Overview

A Frequently Asked Questions (FAQ) page is a priority area for SEO and digital marketing, and can be a simple way to improve navigation for users.

An effective FAQ page should:

* Reflect the audience's need
* Cover a broad range of content
* Receive frequent updates
* Solve problems
* Drive page views
* Showcase expertise, trust, and authority

## What should you include in an FAQ page?

The FAQ should include a list of questions and answers to a particular topic, and should only be used if your page has a list of questions with answers.

Make sure each question includes the entire text of the question.

Make sure the answer includes the entire answer, and a direct response to the question (if the question is phrased in a Yes/No manner).

## Structure

### Smaller FAQ pages (5-10 questions)

Smaller FAQ pages will not need structuring into sections.

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): FAQ

[**Context**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): an introductory paragraph on the section and what users can expect from it.

Questions, answers

### Medium FAQ pages (10-15 questions)

Medium FAQ pages will need structuring into sections to facilitate readability and discoverability of content.

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): FAQ

[**Context**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): an introductory paragraph on the section and what users can expect from it.

Navigation menu with a list of section titles

Section titles

Questions, answers

### Large FAQ pages (more than 15 questions)

Large FAQ pages (for product suites like Teams/Cloudflare One) will need structuring into sections, and each section will have its own subpage, to facilitate readability and discoverability of content.

#### Main FAQ page

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): FAQ

[**Context**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/) (page): an introductory paragraph on the section and what users can expect from it.

Section titles

[**Context**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/) (section): a one-liner describing what users will find in that sub-section

Button: a button leading to the subpage with the actual questions

#### Child FAQ page

Breadcrumbs back to the main FAQ page

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): corresponds to the section header from the Main FAQ page

Questions, answers

***

## Question types

* **Yes/No**

  * Can I do something?
  * Can the product do something?

* **Procedural**

  * How do I do something?
  * How does something work?
  * How is something measured/counted?

* **Definitions**
  * What (is/are) ...?

* **Scenarios**
  * What if ...?

* **Troubleshooting**

  * I see `<ERROR>`.
  * `<PRODUCT>` fails, shows errors,

## Guidelines

### General

Write the questions from the customer's POV, so use the first person.

✅ Can I use wildcards when creating policies?

❌ Can users use wildcards when creating policies?

### Yes/No

With this question type, users want to inquire about capabilities. Does the product enable them to do something? Can the product do something?

* **Question**

  * Yes/no questions should start with structures like:

    * Can I....
    * (Can/Does) the product...

* **Answer**

  * Start the answer with Yes/No.

    * ✅ Yes. Cloudflare Access supports several providers simultaneously.
    * ❌ Cloudflare Access supports several providers simultaneously.

  * Always follow with a short contextualization. Give the user all the information they need.

### Procedural

This question type addresses doubts regarding how to achieve a goal with the product, or how the product works. They should normally be addressed by either tutorials or how-tos in the main documentation, but it is worth calling out some commonly asked procedural questions in the FAQ too, and linking back to other areas of the documentation.

* **Question**

  * Procedural questions should start with structures like:

    * How do I....
    * How does the product...
    * How does ... work?

* **Answer**

  * Give concise but complete answers
  * **Link out to relevant documentation** (tutorials, how-tos, even blog posts) for more in-depth information

### Definitions

With this question type, users want to know what certain elements are. While this type of question should be addressed by the glossary, it is helpful to call out some basic definitions in the FAQ too (think of definitions for essential, recurring features in the product), and link out to the relevant part of the documentation.

* **Question**
  * Definition questions should start with this structure:
    * What is/are...

* **Answer**

  * Think of a dictionary – short, concise, informational definitions help
  * Link out to the glossary or other relevant documentation if needed

### Scenarios

With this type of question, the user will know how to tie the product to a specific real-life scenario they have had happening, or think will happen. They want to know if the product is fit to help them in those cases, too. While **tutorials** should address this type of questions, it is worth calling out the most basic scenario-related questions in the FAQ too, so as to help the user decide whether the product is a good fit for their needs.

* **Question**
  * Scenario questions should start with this structure:
    * What if...

* **Answer**

  * Give the relevant answer in the first sentence. Does the product work in that scenario?
  * Add brief context in a couple more sentences. If the product works, how?
  * Link out to relevant documentation

### Troubleshooting

This is a peculiar question type, in that the user notices something unexpected with the product and starts by stating what it is; questions can be left implicit: "what is wrong and how do I fix it?"

* **Error**

  * I see...
  * `<Product>` does not work as expected when...

* **Answer**

  * Provide a **reason** why the user is seeing what they are seeing.
  * Provide short, lean, actionable steps to solve the error
  * Link out to tutorials or how-tos for more information.

## Additional Information

If the FAQ includes more than 5-10 questions, revisit the user workflow and determine if any of the content in the FAQ should live elsewhere in the doc set.

Use sections if your product is large or incorporates several other products (like Cloudflare One). Try to limit the number of questions in each example and revisit the user workflow if the number of FAQs grows unwieldy.

</page>

<page>
---
title: Get started · Cloudflare Style Guide
description: The purpose of Get started content is to help users go from not
  using a product to successfully configuring and setting up.
lastUpdated: 2025-06-24T21:05:23.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/get-started/
  md: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/get-started/index.md
---

## Purpose

The purpose of Get started content is to help users go from not using a product to successfully configuring and setting up.

## content\_type
```

Example 3 (unknown):
```unknown
For more details, refer to [`pcx_content_type`](https://developers.cloudflare.com/style-guide/frontmatter/custom-properties/#pcx_content_type).

## Structure

### Required components

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): Should be "Get started"

[**Prerequisites**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/prerequisites/): Which may include:

* An active zone
* Certain subscription / enabled product / plan
* Other tasks you might need to do to set up other things (your origin) outside of CF
* Do you need to make certain decisions before you start?

[**Steps**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/steps-tasks-procedures/): Steps that lead someone to whatever would be considered Product Adoption.

* Often, these can be partialized files from your How-to pages.
* This is usually the bare minimum (a single Bot Management FW rule) + the most general use case for a product.
* This may at times contradict the flow in the Cloudflare dashboard at times. If it does, consider raising it up to the Product team.

### Optional components

**Next steps**: Point someone towards additional configuration options.

## Template
```

---

## Get started

**URL:** llms-txt#get-started

**Contents:**
- Before you begin
- 1. Step description
- 2. Steps until you get to activation
- Next steps
- Example
- Purpose
- Tone
- content\_type
- Structure
  - Required components

All the things you need to do before you start configuring your product, both within Cloudflare and outside.

## 1. Step description

## 2. Steps until you get to activation

Point to more complex setup options.
yaml
pcx_content_type: how-to
plaintext
---
weight: xx
pcx_content_type: how-to
---

**Examples:**

Example 1 (unknown):
```unknown
## Example

[Waiting Room: Get started](https://developers.cloudflare.com/waiting-room/get-started/)

</page>

<page>
---
title: How to · Cloudflare Style Guide
description: The purpose of a how to is to explain how to complete a task within
  the product.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/how-to/
  md: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/how-to/index.md
---

## Purpose

The purpose of a how to is to explain how to complete a task within the product.

Note

If you are unsure about when to categorize something as a how-to or tutorial, remember:

Tutorials are typically longer form and contain multiple steps, usually involving multiple products, and help users connect products to real-world scenarios.

A how-to helps a user complete a singular task within a single product.

## Tone

instructional, straightforward

## content\_type
```

Example 2 (unknown):
```unknown
For more details, refer to [`pcx_content_type`](https://developers.cloudflare.com/style-guide/frontmatter/custom-properties/#pcx_content_type).

## Structure

### Required components

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): Short verb phrase in second-person imperative. Do not use gerund phrases.

[**Steps**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/steps-tasks-procedures/): Numbered steps that complete a task.

[**Next steps**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/next-steps/): What users should see as the end result of the steps and/or actionable next steps.

### Optional components

[**Context**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/context/): An introductory paragraph on the following steps and what they will accomplish.

Provide context to the reader that is not in the section heading.

End with a colon or a period. Use a colon if it immediately precedes the steps. Use a period if there is more material (such as a note) between the context and the procedure.

Do not provide context for steps with a partial sentence that is completed by the numbered steps.

[**Prerequisites**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/prerequisites/): Tasks or conditions that must be completed before a user can complete a series of steps.

[**Notes/warnings**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/notes-tips-warnings/)

[**Examples**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/examples/)

**Screenshots**

[**Related links**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/links/): Bulleted list of links to associated resources.

## Template

Single procedure how-to
```

---
