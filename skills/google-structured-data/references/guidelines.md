# Google Structured Data Guidelines

## Technical Requirements

### Supported Formats
- **JSON-LD** (Recommended) - JavaScript Object Notation for Linked Data
- **Microdata** - Inline HTML attributes
- **RDFa** - Resource Description Framework in Attributes

### Access Requirements
- Don't block structured data pages with robots.txt
- Don't use `noindex` on pages with structured data
- Ensure Googlebot can crawl and index pages

## Quality Guidelines

### Content Standards

**DO:**
- Mark up content visible to readers
- Ensure markup represents actual page content
- Use the most specific Schema.org type
- Include all required properties
- Provide recommended properties for higher quality

**DON'T:**
- Mark up hidden or invisible content
- Mark up irrelevant or misleading content
- Use structured data to deceive users
- Impersonate or misrepresent ownership
- Violate Google Search spam policies

### Relevance Examples

**Incorrect Usage:**
- Sports site labeling broadcasts as "events"
- Woodworking site labeling instructions as "recipes"
- Marking up content not on the page

**Correct Usage:**
- Recipe page with Recipe structured data
- Event page with Event structured data
- Article page with Article structured data

### Placement Rules

1. Place structured data on the page it describes
2. Duplicate pages must have identical markup across versions
3. Image URLs must be crawlable and indexable
4. Use canonical URLs consistently

## Multiple Items

### Nesting (Related Items)
```json
{
  "@context": "https://schema.org/",
  "@type": "Recipe",
  "name": "Banana Bread Recipe",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.7,
    "ratingCount": 123
  },
  "video": {
    "@type": "VideoObject",
    "name": "How To Make Banana Bread"
  }
}
```

### Array (Independent Items)
```json
[{
  "@context": "https://schema.org/",
  "@type": "Recipe",
  "name": "Banana Bread Recipe"
},
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}]
```

## Important Limitations

- Google does NOT guarantee rich results will display
- Search algorithms consider many variables
- Correct markup is necessary but not sufficient
- Violations can result in manual actions
- Manual actions remove rich result eligibility (not web ranking)

## Validation Process

1. Use Rich Results Test before deployment
2. Check for errors and warnings
3. Fix all required property issues
4. Address recommended property gaps
5. Deploy and monitor in Search Console

## Sources

- [Structured Data General Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
