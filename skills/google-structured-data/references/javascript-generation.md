# JavaScript Structured Data Generation

## Overview

Google supports dynamically generating structured data using JavaScript. This enables SPAs, CMS integrations, and API-driven sites to create rich results markup.

## Methods

### 1. Google Tag Manager (GTM)

**Advantages:**
- Marketing teams can manage without code deployments
- Built-in variable system reduces duplication
- Easy to update and test
- No custom JavaScript required

**Setup Process:**
1. Install GTM container on site
2. Create Custom HTML tag
3. Add JSON-LD structured data with `{{variable}}` placeholders
4. Create GTM variables to extract page data
5. Set appropriate trigger (e.g., page view)
6. Publish container
7. Test with Rich Results Test (URL mode)

**Variable Types:**
- **Data Layer Variables**: Read from `dataLayer.push()` events
- **DOM Element Variables**: Extract from CSS selectors
- **JavaScript Variables**: Custom functions returning values
- **URL Variables**: Parse URL components

### 2. Custom JavaScript

**Advantages:**
- Full control over implementation
- Works with any framework
- Can integrate with APIs
- Conditional logic support

**Implementation Pattern:**
```javascript
function injectStructuredData(data) {
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
```

**Timing Considerations:**
- Inject before Google renders page
- Use `DOMContentLoaded` or framework lifecycle hooks
- Avoid race conditions with API data

### 3. Server-Side Rendering (SSR)

**Recommended for:**
- E-commerce product pages
- Content requiring immediate indexing
- Sites with frequent price/availability changes

**Advantages:**
- Most reliable for Google indexing
- No JavaScript rendering dependency
- Faster initial parsing

## Testing Requirements

**Critical:** Always use URL input in Rich Results Test

- Code input has JavaScript limitations
- URL input renders JavaScript like Google would
- Mobile-Friendly Test shows rendered HTML

## Limitations & Warnings

### Product Markup
Dynamic Product markup can:
- Reduce shopping crawl frequency
- Affect reliability for fast-changing data
- Require increased server capacity

### General Considerations
- Google must be able to execute JavaScript
- Complex SPAs may have rendering delays
- Consider SSR for critical structured data
- Monitor Search Console for rendering issues

## Framework Examples

### React (Client-Side)
```jsx
useEffect(() => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
  return () => document.head.removeChild(script);
}, [structuredData]);
```

### Next.js (SSR)
```jsx
<Head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
</Head>
```

### Vue/Nuxt
```javascript
head() {
  return {
    script: [{
      type: 'application/ld+json',
      json: this.structuredData
    }]
  }
}
```

## Best Practices

1. **Avoid duplication** - Extract data from page, don't hardcode
2. **Test thoroughly** - Use URL mode in Rich Results Test
3. **Monitor rendering** - Check Mobile-Friendly Test
4. **Consider SSR** - For critical e-commerce data
5. **Handle errors** - Graceful fallbacks for API failures
6. **Validate JSON** - Ensure valid JSON before injection

## Sources

- [Generate Structured Data with JavaScript](https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript)
