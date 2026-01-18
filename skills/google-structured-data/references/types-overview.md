# Google Structured Data Types Overview

## Content & Publishing

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **Article** | News, blogs, sports articles | headline, image, datePublished, author |
| **NewsArticle** | News content specifically | Same as Article |
| **BlogPosting** | Blog posts | Same as Article |
| **Book** | Book pages with actions | name, author, workExample |
| **Recipe** | Cooking instructions | name, image, recipeIngredient, recipeInstructions |
| **Video** | Video content | name, thumbnailUrl, uploadDate |
| **Speakable** | Text-to-speech content | cssSelector or xpath |

## E-commerce & Shopping

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **Product** | Product pages | name, image, offers |
| **ProductGroup** | Product variants | name, variesBy, hasVariant |
| **Offer** | Pricing info | price, priceCurrency, availability |
| **AggregateOffer** | Price ranges | lowPrice, highPrice, offerCount |
| **Review** | Product reviews | author, reviewRating, itemReviewed |
| **AggregateRating** | Average ratings | ratingValue, ratingCount |

## Local & Business

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **LocalBusiness** | Physical locations | name, address, telephone |
| **Restaurant** | Restaurants | servesCuisine, menu, priceRange |
| **Organization** | Companies | name, url, logo, contactPoint |
| **ProfilePage** | Creator profiles | mainEntity (Person) |

## Events & Experiences

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **Event** | Concerts, conferences | name, startDate, location |
| **VacationRental** | Rental properties | name, address, geo |
| **Course** | Educational courses | name, provider, description |
| **CourseList** | Course catalogs | itemListElement |

## Knowledge & Q&A

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **FAQPage** | FAQ pages | mainEntity (Questions) |
| **QAPage** | Single Q&A | mainEntity (Question) |
| **DiscussionForumPosting** | Forum posts | headline, author, datePublished |
| **EducationalQ&A** | Learning Q&A | For educational sites |
| **ClaimReview** | Fact checking | claimReviewed, reviewRating |

## Navigation & Structure

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **BreadcrumbList** | Site navigation | itemListElement (ListItems) |
| **ItemList** | Carousels | itemListElement |
| **WebSite** | Site-level info | name, url, potentialAction |
| **SiteNavigationElement** | Navigation menus | name, url |
| **ImageObject** | Image metadata | contentUrl, license, creator |

## Media & Entertainment

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **VideoObject** | Videos | name, thumbnailUrl, uploadDate |
| **Clip** | Video segments | name, startOffset, url |
| **BroadcastEvent** | Livestreams | isLiveBroadcast, startDate |
| **Movie** | Movie pages | name, director, dateCreated |
| **SoftwareApplication** | Apps | name, operatingSystem, offers |

## Specialized

| Type | Use Case | Key Properties |
|------|----------|----------------|
| **MathSolver** | Math tools | potentialAction (SolveMathAction) |
| **Dataset** | Data resources | name, description, distribution |
| **JobPosting** | Job listings | title, hiringOrganization, jobLocation |
| **HowTo** | Instructions | name, step, totalTime |

## Quick Type Selection Guide

**I have a...**
- News article → `NewsArticle`
- Blog post → `BlogPosting`
- Product for sale → `Product` with `Offer`
- Restaurant → `Restaurant` (extends LocalBusiness)
- Store location → `LocalBusiness`
- Concert/Event → `Event`
- FAQ section → `FAQPage`
- Recipe → `Recipe`
- Video tutorial → `VideoObject`
- Course → `Course`
- Job listing → `JobPosting`
- App → `SoftwareApplication`

## Sources

- [Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Schema.org Full Hierarchy](https://schema.org/docs/full.html)
