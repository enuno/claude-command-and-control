# Matomo JavaScript Tracking Client Reference

## Installation

### Standard Installation
```html
<!-- Matomo tracking code -->
<script>
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//your-matomo-domain.example/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
```

### Async Loading
```javascript
var _paq = window._paq = window._paq || [];
// Commands queued before matomo.js loads
_paq.push(['setTrackerUrl', 'https://matomo.example.com/matomo.php']);
_paq.push(['setSiteId', '1']);
_paq.push(['trackPageView']);
```

## Core Configuration

### Tracker Setup
```javascript
_paq.push(['setTrackerUrl', 'https://matomo.example.com/matomo.php']);
_paq.push(['setSiteId', '1']);
```

### Document Settings
```javascript
_paq.push(['setDocumentTitle', 'Custom Page Title']);
_paq.push(['setCustomUrl', 'https://example.com/custom/path']);
_paq.push(['setReferrerUrl', 'https://referrer.example.com']);
```

### Domain Configuration
```javascript
// Track across subdomains
_paq.push(['setDomains', ['*.example.com']]);

// Multiple domains
_paq.push(['setDomains', ['example.com', 'other-example.com']]);

// Enable cross-domain linking
_paq.push(['enableCrossDomainLinking']);
```

## Page Tracking

### Basic Page View
```javascript
_paq.push(['trackPageView']);
```

### Custom Page Title
```javascript
_paq.push(['trackPageView', 'Custom Page Title']);
```

### Single Page Applications
```javascript
// Update URL and title before tracking
_paq.push(['setCustomUrl', window.location.href]);
_paq.push(['setDocumentTitle', document.title]);

// Delete previous custom variables (optional)
_paq.push(['deleteCustomVariables', 'page']);

// Track the page view
_paq.push(['trackPageView']);
```

## Event Tracking

### Basic Event
```javascript
_paq.push(['trackEvent', 'Category', 'Action']);
```

### Event with Name
```javascript
_paq.push(['trackEvent', 'Category', 'Action', 'Event Name']);
```

### Event with Value
```javascript
_paq.push(['trackEvent', 'Category', 'Action', 'Event Name', 42]);
```

### Examples
```javascript
// Video tracking
_paq.push(['trackEvent', 'Videos', 'Play', 'Product Demo Video']);
_paq.push(['trackEvent', 'Videos', 'Pause', 'Product Demo Video', 30]); // 30 seconds in

// Form tracking
_paq.push(['trackEvent', 'Forms', 'Submit', 'Contact Form']);
_paq.push(['trackEvent', 'Forms', 'Error', 'Contact Form', 'Email Invalid']);

// Click tracking
_paq.push(['trackEvent', 'Navigation', 'Click', 'Main Menu']);
```

## Goal Tracking

### Manual Goal Conversion
```javascript
_paq.push(['trackGoal', 1]); // Goal ID 1
```

### Goal with Revenue
```javascript
_paq.push(['trackGoal', 1, 49.99]);
```

## Site Search

```javascript
_paq.push(['trackSiteSearch',
  'search keyword',    // Search keyword
  'Search Category',   // Optional category
  15                   // Optional number of results
]);
```

## Link Tracking

### Automatic Link Tracking
```javascript
_paq.push(['enableLinkTracking']);
```

### Manual Link Tracking
```javascript
_paq.push(['trackLink', 'https://example.com/file.pdf', 'download']);
_paq.push(['trackLink', 'https://external.com', 'link']);
```

### Configure Download Extensions
```javascript
// Add extensions
_paq.push(['addDownloadExtensions', 'xlsx|docx']);

// Remove extensions
_paq.push(['removeDownloadExtensions', 'pdf']);

// Set all extensions
_paq.push(['setDownloadExtensions', 'pdf|zip|rar|doc|xls']);
```

### Link Classes
```javascript
// Ignore links with specific classes
_paq.push(['setIgnoreClasses', ['no-track', 'ignore-link']]);

// Force download tracking
_paq.push(['setDownloadClasses', 'download-link']);

// Force outlink tracking
_paq.push(['setLinkClasses', 'external-link']);
```

## Content Tracking

### Automatic Tracking
```javascript
// Track all content impressions on page load
_paq.push(['trackAllContentImpressions']);

// Track only visible content
_paq.push(['trackVisibleContentImpressions']);

// Track content impressions within element
_paq.push(['trackContentImpressionsWithinNode', document.getElementById('container')]);
```

### Manual Tracking
```javascript
_paq.push(['trackContentImpression', 'Banner', 'Summer Sale', 'https://example.com/sale']);
_paq.push(['trackContentInteraction', 'click', 'Banner', 'Summer Sale', 'https://example.com/sale']);
```

### HTML Attributes
```html
<div data-track-content
     data-content-name="Hero Banner"
     data-content-piece="Summer Sale Image"
     data-content-target="https://example.com/sale">
  <a href="https://example.com/sale">
    <img src="banner.jpg">
  </a>
</div>
```

## Ecommerce Tracking

### Product View
```javascript
_paq.push(['setEcommerceView',
  'SKU123',           // Product SKU
  'Product Name',     // Product name
  'Electronics',      // Product category (or array for hierarchy)
  29.99               // Product price
]);
_paq.push(['trackPageView']);
```

### Category View
```javascript
_paq.push(['setEcommerceView',
  false,              // No product SKU
  false,              // No product name
  'Electronics'       // Category
]);
_paq.push(['trackPageView']);
```

### Add Item to Cart
```javascript
_paq.push(['addEcommerceItem',
  'SKU123',           // Product SKU
  'Product Name',     // Product name
  'Electronics',      // Product category
  29.99,              // Unit price
  2                   // Quantity
]);
```

### Update Cart
```javascript
// Add items first
_paq.push(['addEcommerceItem', 'SKU123', 'Product 1', 'Cat1', 29.99, 2]);
_paq.push(['addEcommerceItem', 'SKU456', 'Product 2', 'Cat2', 19.99, 1]);

// Track cart update with total
_paq.push(['trackEcommerceCartUpdate', 79.97]);
```

### Complete Order
```javascript
// Add items to order
_paq.push(['addEcommerceItem', 'SKU123', 'Product 1', 'Electronics', 29.99, 2]);
_paq.push(['addEcommerceItem', 'SKU456', 'Product 2', 'Accessories', 19.99, 1]);

// Track order
_paq.push(['trackEcommerceOrder',
  'ORDER-12345',      // Order ID
  79.97,              // Grand total (required)
  69.97,              // Subtotal (optional)
  5.00,               // Tax (optional)
  5.00,               // Shipping (optional)
  0                   // Discount (optional)
]);
```

### Clear Cart
```javascript
_paq.push(['clearEcommerceCart']);
```

## User Identification

### User ID
```javascript
// Set user ID for logged-in users
_paq.push(['setUserId', 'USER-12345']);

// Track page view after setting
_paq.push(['trackPageView']);

// Reset on logout
_paq.push(['resetUserId']);
_paq.push(['trackPageView']);
```

### Visitor ID
```javascript
// Get current visitor ID
_paq.push([function() {
  var visitorId = this.getVisitorId();
  console.log(visitorId);
}]);
```

## Custom Variables

### Visit Scope (persists for entire visit)
```javascript
_paq.push(['setCustomVariable',
  1,                  // Index 1-5
  'UserType',         // Name
  'Premium',          // Value
  'visit'             // Scope
]);
```

### Page Scope (single page view)
```javascript
_paq.push(['setCustomVariable',
  1,                  // Index 1-5
  'PageType',         // Name
  'Product',          // Value
  'page'              // Scope
]);
_paq.push(['trackPageView']);
```

### Delete Custom Variable
```javascript
_paq.push(['deleteCustomVariable', 1, 'visit']);
```

## Custom Dimensions

### Set Custom Dimension
```javascript
// Visit scope dimension
_paq.push(['setCustomDimension', 1, 'Premium User']);

// Page scope dimension
_paq.push(['setCustomDimension', 2, 'Product Page']);
_paq.push(['trackPageView']);
```

### Delete Custom Dimension
```javascript
_paq.push(['deleteCustomDimension', 1]);
```

## Consent Management

### Tracking Consent
```javascript
// Require consent before any tracking
_paq.push(['requireConsent']);

// When user gives consent
_paq.push(['setConsentGiven']);

// Remember consent (stored in cookie)
_paq.push(['rememberConsentGiven', 720]); // 720 hours (30 days)

// Revoke consent
_paq.push(['forgetConsentGiven']);
```

### Cookie Consent (separate from tracking)
```javascript
// Require cookie consent (tracking works without cookies)
_paq.push(['requireCookieConsent']);

// When user accepts cookies
_paq.push(['setCookieConsentGiven']);

// Remember cookie consent
_paq.push(['rememberCookieConsentGiven', 720]);

// Revoke cookie consent
_paq.push(['forgetCookieConsentGiven']);
```

### User Opt-Out
```javascript
// Opt user out
_paq.push(['optUserOut']);

// Check opt-out status
_paq.push([function() {
  if (this.isUserOptedOut()) {
    // User has opted out
  }
}]);

// Opt back in
_paq.push(['forgetUserOptOut']);
```

## Cookie Configuration

### Cookie Domain & Path
```javascript
_paq.push(['setCookieDomain', '*.example.com']);
_paq.push(['setCookiePath', '/subdir']);
```

### Cookie Security
```javascript
_paq.push(['setSecureCookie', true]);       // HTTPS only
_paq.push(['setCookieSameSite', 'Strict']); // SameSite attribute
```

### Cookie Names
```javascript
_paq.push(['setCookieNamePrefix', 'pk_']);
```

### Cookie Expiration
```javascript
_paq.push(['setVisitorCookieTimeout', 33955200]);  // 393 days (seconds)
_paq.push(['setReferralCookieTimeout', 15778800]); // 6 months
_paq.push(['setSessionCookieTimeout', 1800]);      // 30 minutes
```

### Disable Cookies
```javascript
_paq.push(['disableCookies']);
```

## Heart Beat Timer

Keep session alive for accurate time tracking:

```javascript
// Send ping every 15 seconds while page is active
_paq.push(['enableHeartBeatTimer', 15]);
```

## Request Configuration

### Request Method
```javascript
_paq.push(['setRequestMethod', 'POST']); // More secure for sensitive data
```

### Custom Request Processing
```javascript
_paq.push(['setCustomRequestProcessing', function(request) {
  // Modify request before sending
  return request + '&custom_param=value';
}]);
```

### Request Content Type
```javascript
_paq.push(['setRequestContentType', 'application/json']);
```

## Campaign Tracking

### Custom Campaign Parameters
```javascript
_paq.push(['setCampaignNameKey', 'mtm_campaign']);
_paq.push(['setCampaignKeywordKey', 'mtm_kwd']);
```

### Attribution Window
```javascript
_paq.push(['setReferralCookieTimeout', 15778800]); // 6 months in seconds
```

## Performance

### Delay Tracking
```javascript
// Delay link tracking timer (milliseconds)
_paq.push(['setLinkTrackingTimer', 500]);
```

### Disable Features
```javascript
// Disable specific tracking features for performance
_paq.push(['disableBrowserFeatureDetection']);
```

## Debugging

### Debug Mode
```javascript
_paq.push(['enableDebugMode']);
```

### Get Tracker Info
```javascript
_paq.push([function() {
  console.log('Tracker URL:', this.getTrackerUrl());
  console.log('Site ID:', this.getSiteId());
  console.log('Visitor ID:', this.getVisitorId());
}]);
```

## Multiple Trackers

### Send to Multiple Matomo Instances
```javascript
// Create additional tracker
_paq.push(['addTracker', 'https://other-matomo.com/matomo.php', '2']);

// Access specific tracker
var tracker = Matomo.getTracker('https://other-matomo.com/matomo.php', '2');
tracker.trackPageView();
```

## Asynchronous Tracking

### Get Tracker Instance
```javascript
_paq.push([function() {
  var tracker = this;
  // Use tracker methods directly
  tracker.setCustomVariable(1, 'Name', 'Value', 'page');
  tracker.trackPageView();
}]);
```

### Tracker Ready Callback
```javascript
_paq.push([function() {
  // This runs when Matomo is loaded
  console.log('Matomo loaded!');
}]);
```
