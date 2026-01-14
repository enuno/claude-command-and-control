# Matomo PHP Tracking Client Reference

## Installation

### Composer
```bash
composer require matomo/matomo-php-tracker
```

### Manual
Download `MatomoTracker.php` from the Matomo repository.

## Basic Usage

```php
<?php
use MatomoTracker;

require_once 'vendor/autoload.php';

// Initialize tracker
$matomoTracker = new MatomoTracker($idSite = 1, 'https://matomo.example.com/');

// Track a page view
$matomoTracker->doTrackPageView('Page Title');
```

## Constructor

```php
__construct(int $idSite, string $apiUrl = null)
```

| Parameter | Description |
|-----------|-------------|
| `$idSite` | Website ID in Matomo |
| `$apiUrl` | Matomo tracking API URL (optional, can be set later) |

## Configuration Methods

### API Setup
```php
// Set Matomo URL
$tracker->setApiUrl('https://matomo.example.com/');

// Set page encoding (default: UTF-8)
$tracker->setPageCharset('UTF-8');
```

### Site & Authentication
```php
// Set site ID
$tracker->setIdSite(1);

// Set authentication token (required for admin features)
$tracker->setTokenAuth('your_token_auth');
```

### User Identification
```php
// Set user ID (email, username, UUID)
$tracker->setUserId('user@example.com');

// Force specific visitor ID (16 hex chars)
$tracker->setVisitorId('abc123def4567890');

// Force new visit
$tracker->setForceNewVisit();
```

### Page Information
```php
// Set page URL
$tracker->setUrl('https://example.com/page');

// Set referrer URL
$tracker->setUrlReferrer('https://google.com/search?q=example');
```

## Primary Tracking Methods

### Page View
```php
$tracker->doTrackPageView('Page Title');
```

### Event
```php
$tracker->doTrackEvent(
    'Category',     // Event category
    'Action',       // Event action
    'Name',         // Event name (optional)
    42              // Event value (optional, numeric)
);
```

### Goal Conversion
```php
$tracker->doTrackGoal(
    1,              // Goal ID
    49.99           // Custom revenue (optional)
);
```

### Site Search
```php
$tracker->doTrackSiteSearch(
    'search keyword',    // Keyword
    'Category',          // Search category (optional)
    15                   // Number of results (optional)
);
```

### Action (Download/Outlink)
```php
// Track download
$tracker->doTrackAction('https://example.com/file.pdf', 'download');

// Track outlink
$tracker->doTrackAction('https://external-site.com', 'link');
```

### Ping (Extend Session)
```php
// Ping to extend visit duration without recording new action
$tracker->doPing();
```

## Ecommerce Tracking

### Add Item to Cart
```php
$tracker->addEcommerceItem(
    'SKU123',           // Product SKU
    'Product Name',     // Product name
    'Category',         // Product category (string or array)
    29.99,              // Unit price
    2                   // Quantity
);
```

### Cart Update
```php
// Add items first
$tracker->addEcommerceItem('SKU123', 'Product 1', 'Electronics', 29.99, 2);
$tracker->addEcommerceItem('SKU456', 'Product 2', 'Accessories', 19.99, 1);

// Track cart update with grand total
$tracker->doTrackEcommerceCartUpdate(79.97);
```

### Complete Order
```php
// Add items
$tracker->addEcommerceItem('SKU123', 'Product 1', 'Electronics', 29.99, 2);
$tracker->addEcommerceItem('SKU456', 'Product 2', 'Accessories', 19.99, 1);

// Track order
$tracker->doTrackEcommerceOrder(
    'ORDER-12345',  // Order ID (required)
    79.97,          // Grand total (required)
    69.97,          // Subtotal (optional)
    5.00,           // Tax (optional)
    5.00,           // Shipping (optional)
    0               // Discount (optional)
);
```

### Product/Category View
```php
// Track product view
$tracker->setEcommerceView(
    'SKU123',           // Product SKU
    'Product Name',     // Product name
    'Electronics',      // Category
    29.99               // Price
);
$tracker->doTrackPageView('Product: Product Name');

// Track category view
$tracker->setEcommerceView(
    '',                 // No SKU
    '',                 // No product name
    'Electronics'       // Category only
);
$tracker->doTrackPageView('Category: Electronics');
```

## Custom Variables

### Visit Scope
```php
$tracker->setCustomVariable(
    1,                  // Index 1-5
    'UserType',         // Name
    'Premium',          // Value
    'visit'             // Scope
);
```

### Page Scope
```php
$tracker->setCustomVariable(
    1,                  // Index 1-5
    'PageType',         // Name
    'Product',          // Value
    'page'              // Scope
);
```

### Get Custom Variable
```php
$value = $tracker->getCustomVariable(1, 'visit');
```

### Delete Custom Variable
```php
$tracker->deleteCustomVariable(1, 'visit');
```

## Custom Dimensions

```php
// Set custom dimension
$tracker->setCustomDimension(1, 'Dimension Value');

// Get custom dimension
$value = $tracker->getCustomDimension(1);
```

## Custom Tracking Parameters

```php
// Add arbitrary tracking parameters
$tracker->setCustomTrackingParameter('custom_param', 'value');
```

## Device & Browser Information

### User Agent
```php
$tracker->setUserAgent($_SERVER['HTTP_USER_AGENT']);
```

### Client Hints (Modern Browsers)
```php
$tracker->setClientHints(
    $model,             // Device model
    $platform,          // Platform (Windows, macOS, etc.)
    $platformVersion,   // Platform version
    $fullVersionList,   // Browser versions
    $uaFullVersion      // Full UA version
);
```

### Screen Resolution
```php
$tracker->setResolution(1920, 1080);
```

### Browser Features
```php
$tracker->setBrowserHasCookies(true);
$tracker->setBrowserLanguage('en-US');
```

## Geolocation (requires token_auth)

```php
$tracker->setTokenAuth('your_token');

// Override visitor location
$tracker->setCountry('US');
$tracker->setRegion('CA');      // California
$tracker->setCity('San Francisco');
$tracker->setLatitude(37.7749);
$tracker->setLongitude(-122.4194);
```

## IP Override (requires token_auth)

```php
$tracker->setTokenAuth('your_token');
$tracker->setIp('203.0.113.50');
```

## Custom Timestamp (requires token_auth)

```php
$tracker->setTokenAuth('your_token');

// Track with custom datetime
$tracker->setForceVisitDateTime('2024-01-15 14:30:00');
```

## Performance Timing

```php
$tracker->setPerformanceTimings(
    $networkTime,       // Network time (ms)
    $serverTime,        // Server response time (ms)
    $transferTime,      // Transfer time (ms)
    $domProcessing,     // DOM processing time (ms)
    $domComplete,       // DOM complete time (ms)
    $onloadTime         // Onload time (ms)
);
```

## Error Tracking

### PHP Exceptions
```php
try {
    // Code that might throw
} catch (Exception $e) {
    $tracker->doTrackPhpThrowable($e, 'Application Errors');
}
```

### Manual Crash Reporting
```php
$tracker->doTrackCrash(
    'Error message',    // Error message
    'TypeError',        // Error type
    'Application',      // Category
    $stackTrace,        // Stack trace (optional)
    'file.php',         // File (optional)
    42,                 // Line number (optional)
    10                  // Column number (optional)
);
```

## Bulk Tracking

Process multiple tracking requests in a single HTTP call:

```php
// Enable bulk tracking
$tracker->enableBulkTracking();

// Queue multiple tracking calls
$tracker->doTrackPageView('Page 1');
$tracker->doTrackPageView('Page 2');
$tracker->doTrackEvent('Category', 'Action');

// Send all at once
$tracker->doBulkTrack();

// Disable bulk tracking
$tracker->disableBulkTracking();
```

### With Token Auth
```php
$tracker->enableBulkTracking();
$tracker->setTokenAuth('your_token');

// Queue requests...

// Token is automatically included in bulk request
$tracker->doBulkTrack();
```

## Cookie Management

### Enable Cookies
```php
$tracker->enableCookies(
    'example.com',      // Cookie domain
    '/',                // Cookie path
    true,               // Secure (HTTPS only)
    true,               // HttpOnly
    'Strict'            // SameSite attribute
);
```

### Disable Cookies
```php
$tracker->disableCookieSupport();
```

### Delete Cookies
```php
$tracker->deleteCookies();
```

### Get Cookie Values
```php
// Get visitor ID from cookie
$visitorId = $tracker->getVisitorId();

// Get attribution info
$attribution = $tracker->getAttributionInfo();
```

## Request Configuration

### Timeouts
```php
// Request timeout (seconds)
$tracker->setRequestTimeout(600);  // 10 minutes

// Connection timeout (seconds)
$tracker->setRequestConnectTimeout(300);  // 5 minutes
```

### Request Method
```php
// Use POST for sensitive data (recommended with token_auth)
$tracker->setRequestMethodNonBulk('POST');
```

### Proxy Configuration
```php
$tracker->setProxy('192.168.1.100', 8080);
```

### SSL Verification
```php
// Disable SSL verification (not recommended for production)
$tracker->setVerifySsl(false);
```

## URL Building (Without Sending)

Get tracking URLs instead of sending requests:

```php
// Get URL for page view
$url = $tracker->getUrlTrackPageView('Page Title');

// Get URL for event
$url = $tracker->getUrlTrackEvent('Category', 'Action', 'Name', 42);

// Get URL for goal
$url = $tracker->getUrlTrackGoal(1, 49.99);

// Get URL for action
$url = $tracker->getUrlTrackAction('https://example.com/file.pdf', 'download');

// Get URL for site search
$url = $tracker->getUrlTrackSiteSearch('keyword', 'category', 10);

// Get URL for ecommerce order
$url = $tracker->getUrlTrackEcommerceOrder('ORDER-123', 99.99);
```

## Debug Mode

```php
// Enable debug output
$tracker->enableDebugMode();

// Get debug info
$info = $tracker->getDebugInfo();
```

## Complete Examples

### Basic Page Tracking
```php
<?php
use MatomoTracker;

$tracker = new MatomoTracker(1, 'https://matomo.example.com/');
$tracker->setUrl($_SERVER['REQUEST_URI']);
$tracker->setUserAgent($_SERVER['HTTP_USER_AGENT']);
$tracker->setIp($_SERVER['REMOTE_ADDR']);
$tracker->doTrackPageView($_SERVER['REQUEST_URI']);
```

### Authenticated Tracking
```php
<?php
use MatomoTracker;

$tracker = new MatomoTracker(1, 'https://matomo.example.com/');
$tracker->setTokenAuth('your_token_auth');
$tracker->setUserId($currentUser->getId());
$tracker->setCustomDimension(1, $currentUser->getPlan()); // Premium, Free, etc.
$tracker->doTrackPageView('Dashboard');
```

### Ecommerce Order
```php
<?php
use MatomoTracker;

$tracker = new MatomoTracker(1, 'https://matomo.example.com/');
$tracker->setUserId($order->getCustomerId());

// Add order items
foreach ($order->getItems() as $item) {
    $tracker->addEcommerceItem(
        $item->getSku(),
        $item->getName(),
        $item->getCategory(),
        $item->getPrice(),
        $item->getQuantity()
    );
}

// Track the order
$tracker->doTrackEcommerceOrder(
    $order->getId(),
    $order->getTotal(),
    $order->getSubtotal(),
    $order->getTax(),
    $order->getShipping(),
    $order->getDiscount()
);
```

### Server-Side Event Tracking
```php
<?php
use MatomoTracker;

$tracker = new MatomoTracker(1, 'https://matomo.example.com/');
$tracker->setTokenAuth('your_token_auth');

// Track API call as event
$tracker->doTrackEvent(
    'API',
    'Call',
    '/api/v1/users',
    $responseTime  // Response time in ms
);
```

### Bulk Import Historical Data
```php
<?php
use MatomoTracker;

$tracker = new MatomoTracker(1, 'https://matomo.example.com/');
$tracker->setTokenAuth('your_token_auth');
$tracker->enableBulkTracking();

foreach ($historicalEvents as $event) {
    $tracker->setForceVisitDateTime($event['timestamp']);
    $tracker->setIp($event['ip']);
    $tracker->setUrl($event['url']);
    $tracker->doTrackPageView($event['title']);
}

$tracker->doBulkTrack();
```
