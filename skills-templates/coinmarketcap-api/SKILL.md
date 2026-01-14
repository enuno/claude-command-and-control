# CoinMarketCap API

> Enterprise-grade cryptocurrency market data API with 40+ endpoints covering prices, market caps, exchanges, and historical data.

## Quick Reference

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://pro-api.coinmarketcap.com` |
| Sandbox | `https://sandbox-api.coinmarketcap.com` |

### Authentication

All requests require an API key in the header:

```bash
X-CMC_PRO_API_KEY: your-api-key-here
```

Get your API key at: https://coinmarketcap.com/api/

### Quick Start

**cURL:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10"
```

**Python:**
```python
import requests

url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"
headers = {"X-CMC_PRO_API_KEY": "YOUR_KEY"}
params = {"symbol": "BTC,ETH", "convert": "USD"}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data["data"]["BTC"]["quote"]["USD"]["price"])
```

**JavaScript:**
```javascript
const response = await fetch(
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC&convert=USD",
  {
    headers: { "X-CMC_PRO_API_KEY": "YOUR_KEY" }
  }
);
const data = await response.json();
console.log(data.data.BTC.quote.USD.price);
```

## Pricing Plans

| Plan | Monthly Credits | Endpoints | Price |
|------|-----------------|-----------|-------|
| **Free** | 10,000 | 9 | $0 |
| **Hobbyist** | 40,000 | 14 | $29 |
| **Startup** | 120,000 | 14 | $79 |
| **Standard** | 500,000 | 22 | $299 |
| **Professional** | 2,000,000 | 22+ | $699 |
| **Enterprise** | Custom | All | Contact |

**Credit Usage:** Typically 1 credit per 100 data points returned.

## Endpoint Categories

### Cryptocurrency Endpoints

| Endpoint | Path | Plan |
|----------|------|------|
| Map | `/v1/cryptocurrency/map` | Free |
| Info | `/v2/cryptocurrency/info` | Free |
| Listings Latest | `/v1/cryptocurrency/listings/latest` | Free |
| Listings Historical | `/v1/cryptocurrency/listings/historical` | Startup+ |
| Quotes Latest | `/v2/cryptocurrency/quotes/latest` | Free |
| Quotes Historical | `/v2/cryptocurrency/quotes/historical` | Startup+ |
| Market Pairs | `/v2/cryptocurrency/market-pairs/latest` | Standard+ |
| OHLCV Latest | `/v2/cryptocurrency/ohlcv/latest` | Startup+ |
| OHLCV Historical | `/v2/cryptocurrency/ohlcv/historical` | Startup+ |
| Price Performance | `/v2/cryptocurrency/price-performance-stats/latest` | Standard+ |
| Categories | `/v1/cryptocurrency/categories` | Free |
| Category | `/v1/cryptocurrency/category` | Free |
| Airdrops | `/v1/cryptocurrency/airdrops` | Standard+ |
| Trending Latest | `/v1/cryptocurrency/trending/latest` | Standard+ |
| Trending Most Visited | `/v1/cryptocurrency/trending/most-visited` | Standard+ |
| Trending Gainers/Losers | `/v1/cryptocurrency/trending/gainers-losers` | Standard+ |

### Exchange Endpoints

| Endpoint | Path | Plan |
|----------|------|------|
| Map | `/v1/exchange/map` | Startup+ |
| Info | `/v1/exchange/info` | Startup+ |
| Listings Latest | `/v1/exchange/listings/latest` | Startup+ |
| Quotes Latest | `/v1/exchange/quotes/latest` | Standard+ |
| Quotes Historical | `/v1/exchange/quotes/historical` | Standard+ |
| Market Pairs | `/v1/exchange/market-pairs/latest` | Standard+ |
| Assets | `/v1/exchange/assets` | Professional+ |

### Global Metrics

| Endpoint | Path | Plan |
|----------|------|------|
| Quotes Latest | `/v1/global-metrics/quotes/latest` | Free |
| Quotes Historical | `/v1/global-metrics/quotes/historical` | Startup+ |

### Tools

| Endpoint | Path | Plan |
|----------|------|------|
| Price Conversion | `/v2/tools/price-conversion` | Free |
| Postman | `/v1/tools/postman` | Free |

### Other Endpoints

| Endpoint | Path | Plan |
|----------|------|------|
| Fiat Map | `/v1/fiat/map` | Free |
| Blockchain Statistics | `/v1/blockchain/statistics/latest` | Standard+ |
| Key Info | `/v1/key/info` | Free |
| Fear & Greed Latest | `/v3/fear-and-greed/latest` | Standard+ |
| Fear & Greed Historical | `/v3/fear-and-greed/historical` | Standard+ |
| Content Posts | `/v1/content/posts/top` | Standard+ |
| Community Trending | `/v1/community/trending/token` | Standard+ |

## Core Endpoints

### Cryptocurrency Listings Latest

Get a paginated list of all active cryptocurrencies.

**Endpoint:** `GET /v1/cryptocurrency/listings/latest`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start` | int | No | Pagination offset (default: 1) |
| `limit` | int | No | Results per page (1-5000, default: 100) |
| `price_min` | float | No | Minimum price filter |
| `price_max` | float | No | Maximum price filter |
| `market_cap_min` | float | No | Minimum market cap filter |
| `market_cap_max` | float | No | Maximum market cap filter |
| `volume_24h_min` | float | No | Minimum 24h volume filter |
| `volume_24h_max` | float | No | Maximum 24h volume filter |
| `circulating_supply_min` | float | No | Minimum supply filter |
| `circulating_supply_max` | float | No | Maximum supply filter |
| `percent_change_24h_min` | float | No | Minimum 24h change filter |
| `percent_change_24h_max` | float | No | Maximum 24h change filter |
| `convert` | string | No | Currency to convert prices (USD, EUR, BTC) |
| `convert_id` | string | No | CMC ID of conversion currency |
| `sort` | string | No | Sort field (market_cap, name, symbol, etc.) |
| `sort_dir` | string | No | Sort direction (asc, desc) |
| `cryptocurrency_type` | string | No | Filter type (all, coins, tokens) |
| `tag` | string | No | Filter by tag (defi, filesharing) |
| `aux` | string | No | Additional fields to return |

**Example:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD&sort=market_cap&sort_dir=desc"
```

**Response:**
```json
{
  "status": {
    "timestamp": "2024-01-15T12:00:00.000Z",
    "error_code": 0,
    "error_message": null,
    "elapsed": 10,
    "credit_count": 1
  },
  "data": [
    {
      "id": 1,
      "name": "Bitcoin",
      "symbol": "BTC",
      "slug": "bitcoin",
      "num_market_pairs": 10000,
      "date_added": "2010-07-13T00:00:00.000Z",
      "max_supply": 21000000,
      "circulating_supply": 19500000,
      "total_supply": 19500000,
      "cmc_rank": 1,
      "quote": {
        "USD": {
          "price": 42500.00,
          "volume_24h": 25000000000,
          "volume_change_24h": 5.5,
          "percent_change_1h": 0.5,
          "percent_change_24h": 2.3,
          "percent_change_7d": -1.2,
          "percent_change_30d": 15.0,
          "percent_change_60d": 25.0,
          "percent_change_90d": 30.0,
          "market_cap": 828750000000,
          "market_cap_dominance": 50.5,
          "fully_diluted_market_cap": 892500000000,
          "last_updated": "2024-01-15T12:00:00.000Z"
        }
      }
    }
  ]
}
```

### Cryptocurrency Quotes Latest

Get latest market quotes for one or more cryptocurrencies.

**Endpoint:** `GET /v2/cryptocurrency/quotes/latest`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | No* | CMC IDs (comma-separated) |
| `slug` | string | No* | Slugs (comma-separated) |
| `symbol` | string | No* | Symbols (comma-separated) |
| `convert` | string | No | Quote currency (default: USD) |
| `convert_id` | string | No | CMC ID of quote currency |
| `aux` | string | No | Additional fields |
| `skip_invalid` | bool | No | Skip invalid symbols |

*One of `id`, `slug`, or `symbol` is required.

**Example:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,SOL&convert=USD"
```

**Response:**
```json
{
  "status": {
    "timestamp": "2024-01-15T12:00:00.000Z",
    "error_code": 0,
    "error_message": null,
    "elapsed": 15,
    "credit_count": 1
  },
  "data": {
    "BTC": [
      {
        "id": 1,
        "name": "Bitcoin",
        "symbol": "BTC",
        "slug": "bitcoin",
        "is_active": 1,
        "is_fiat": 0,
        "circulating_supply": 19500000,
        "total_supply": 19500000,
        "max_supply": 21000000,
        "date_added": "2010-07-13T00:00:00.000Z",
        "num_market_pairs": 10000,
        "cmc_rank": 1,
        "last_updated": "2024-01-15T12:00:00.000Z",
        "quote": {
          "USD": {
            "price": 42500.00,
            "volume_24h": 25000000000,
            "percent_change_1h": 0.5,
            "percent_change_24h": 2.3,
            "percent_change_7d": -1.2,
            "market_cap": 828750000000,
            "last_updated": "2024-01-15T12:00:00.000Z"
          }
        }
      }
    ]
  }
}
```

### Cryptocurrency Map

Get a mapping of all cryptocurrencies to CMC IDs.

**Endpoint:** `GET /v1/cryptocurrency/map`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `listing_status` | string | No | active, inactive, untracked (default: active) |
| `start` | int | No | Pagination offset |
| `limit` | int | No | Results per page (max: 5000) |
| `sort` | string | No | Sort by: cmc_rank, id |
| `symbol` | string | No | Filter by symbols |
| `aux` | string | No | Additional fields |

**Example:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=BTC,ETH"
```

**Best Practice:** Always resolve symbols to CMC IDs first. Symbols can collide across chains; IDs are unique.

### Price Conversion

Convert an amount from one currency to another.

**Endpoint:** `GET /v2/tools/price-conversion`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | float | Yes | Amount to convert |
| `id` | string | No* | CMC ID of source currency |
| `symbol` | string | No* | Symbol of source currency |
| `time` | string | No | Historical timestamp |
| `convert` | string | No | Target currency (default: USD) |
| `convert_id` | string | No | CMC ID of target currency |

**Example:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=BTC&convert=USD,EUR,ETH"
```

### Global Metrics

Get aggregate market statistics.

**Endpoint:** `GET /v1/global-metrics/quotes/latest`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `convert` | string | No | Quote currency |
| `convert_id` | string | No | CMC ID of quote currency |

**Example:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?convert=USD"
```

**Response includes:**
- Total market cap
- Total 24h volume
- BTC dominance percentage
- ETH dominance percentage
- Active cryptocurrencies count
- Active exchanges count
- Active market pairs count

### OHLCV Historical

Get historical OHLCV (candlestick) data.

**Endpoint:** `GET /v2/cryptocurrency/ohlcv/historical`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | No* | CMC ID |
| `slug` | string | No* | Slug |
| `symbol` | string | No* | Symbol |
| `time_period` | string | No | daily, weekly, monthly, yearly |
| `time_start` | string | Yes | Start time (ISO 8601) |
| `time_end` | string | No | End time (ISO 8601) |
| `count` | int | No | Number of intervals |
| `interval` | string | No | hourly, daily, weekly, monthly |
| `convert` | string | No | Quote currency |
| `convert_id` | string | No | CMC ID of quote currency |
| `skip_invalid` | bool | No | Skip invalid symbols |

**Example:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?symbol=BTC&time_start=2024-01-01&time_end=2024-01-31&interval=daily&convert=USD"
```

## Supported Currencies

### Fiat Currencies (93)

AUD, BRL, CAD, CHF, CLP, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PKR, PLN, RUB, SEK, SGD, THB, TRY, TWD, USD, ZAR, and more...

### Cryptocurrency Conversions

BTC, ETH, XRP, LTC, BCH (and others via CMC ID)

### Precious Metals (4)

XAU (Gold), XAG (Silver), XPT (Platinum), XPD (Palladium)

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 402 | Payment Required - Plan upgrade needed |
| 403 | Forbidden - Access denied |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "status": {
    "timestamp": "2024-01-15T12:00:00.000Z",
    "error_code": 1001,
    "error_message": "This API Key is invalid.",
    "elapsed": 0,
    "credit_count": 0
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1001 | Invalid API key |
| 1002 | API key disabled |
| 1003 | API key access denied for endpoint |
| 1004 | API key rate limit exceeded |
| 1005 | API key subscription expired |
| 1006 | Invalid parameter value |
| 1007 | Parameter value out of range |
| 1008 | Required parameter missing |

## Rate Limiting

- Rate limits are based on simultaneous HTTP calls within 60-second windows
- Limits increase with higher subscription tiers
- Exceeding limits triggers HTTP 429 errors
- Monitor usage via `/v1/key/info` endpoint

**Check API Key Usage:**
```bash
curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
  "https://pro-api.coinmarketcap.com/v1/key/info"
```

## Python Library

### Installation

```bash
pip install python-coinmarketcap
```

### Usage

```python
from coinmarketcapapi import CoinMarketCapAPI, CoinMarketCapAPIError

# Initialize client
cmc = CoinMarketCapAPI('YOUR_API_KEY')

# Get Bitcoin info
btc_info = cmc.cryptocurrency_info(symbol='BTC')
print(btc_info.data)

# Get latest listings
listings = cmc.cryptocurrency_listings_latest(limit=100, convert='USD')
for crypto in listings.data:
    print(f"{crypto['name']}: ${crypto['quote']['USD']['price']:.2f}")

# Price conversion
conversion = cmc.tools_priceconversion(amount=1, symbol='BTC', convert='USD')
print(f"1 BTC = ${conversion.data[0]['quote']['USD']['price']:.2f}")

# Error handling
try:
    result = cmc.cryptocurrency_quotes_latest(symbol='INVALID')
except CoinMarketCapAPIError as e:
    print(f"Error: {e.rep.error_message}")
```

### Response Object

```python
response = cmc.cryptocurrency_info(symbol='BTC')

response.data          # Result payload
response.status        # Status information
response.credit_count  # Credits consumed
response.elapsed       # Server processing time (ms)
response.total_elapsed # Total request time (ms)
response.timestamp     # Server timestamp
response.error_code    # Error code (0 = success)
response.error_message # Error details
response.error         # Boolean error flag
```

## Best Practices

### 1. Use CMC IDs Instead of Symbols

```python
# Bad: Symbols can collide
quotes = cmc.cryptocurrency_quotes_latest(symbol='UNI')  # Which UNI?

# Good: Resolve to IDs first
mapping = cmc.cryptocurrency_map(symbol='UNI')
cmc_id = mapping.data[0]['id']  # Get the specific one you want
quotes = cmc.cryptocurrency_quotes_latest(id=str(cmc_id))
```

### 2. Cache Map Data

```python
# Cache the ID mapping locally
import json

def get_crypto_map():
    try:
        with open('cmc_map.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        mapping = cmc.cryptocurrency_map(limit=5000)
        with open('cmc_map.json', 'w') as f:
            json.dump(mapping.data, f)
        return mapping.data
```

### 3. Handle Rate Limits

```python
import time

def safe_api_call(func, *args, **kwargs):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except CoinMarketCapAPIError as e:
            if e.rep.error_code == 1004:  # Rate limit
                time.sleep(60)  # Wait 60 seconds
                continue
            raise
    raise Exception("Max retries exceeded")
```

### 4. Proxy API Calls (Web Apps)

```javascript
// Backend proxy (Node.js/Express)
app.get('/api/crypto/prices', async (req, res) => {
  const response = await fetch(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC',
    { headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY } }
  );
  res.json(await response.json());
});
```

Never expose your API key in client-side JavaScript.

### 5. Paginate Large Requests

```python
def get_all_cryptocurrencies():
    all_cryptos = []
    start = 1
    limit = 5000

    while True:
        response = cmc.cryptocurrency_listings_latest(start=start, limit=limit)
        if not response.data:
            break
        all_cryptos.extend(response.data)
        start += limit
        if len(response.data) < limit:
            break

    return all_cryptos
```

## Common Use Cases

### Portfolio Tracker

```python
portfolio = {'BTC': 0.5, 'ETH': 2.0, 'SOL': 10}

# Get current prices
symbols = ','.join(portfolio.keys())
quotes = cmc.cryptocurrency_quotes_latest(symbol=symbols, convert='USD')

total_value = 0
for symbol, amount in portfolio.items():
    price = quotes.data[symbol][0]['quote']['USD']['price']
    value = price * amount
    total_value += value
    print(f"{symbol}: {amount} × ${price:.2f} = ${value:.2f}")

print(f"Total Portfolio: ${total_value:.2f}")
```

### Price Alert System

```python
def check_price_alerts(alerts):
    symbols = ','.join(set(a['symbol'] for a in alerts))
    quotes = cmc.cryptocurrency_quotes_latest(symbol=symbols, convert='USD')

    for alert in alerts:
        price = quotes.data[alert['symbol']][0]['quote']['USD']['price']
        if alert['type'] == 'above' and price > alert['target']:
            notify(f"{alert['symbol']} is above ${alert['target']}: ${price:.2f}")
        elif alert['type'] == 'below' and price < alert['target']:
            notify(f"{alert['symbol']} is below ${alert['target']}: ${price:.2f}")
```

### Market Dashboard

```python
# Get global metrics
global_data = cmc.globalmetrics_quotes_latest(convert='USD')
print(f"Total Market Cap: ${global_data.data['quote']['USD']['total_market_cap']:,.0f}")
print(f"BTC Dominance: {global_data.data['btc_dominance']:.1f}%")
print(f"24h Volume: ${global_data.data['quote']['USD']['total_volume_24h']:,.0f}")

# Get top 10
top10 = cmc.cryptocurrency_listings_latest(limit=10, convert='USD')
for crypto in top10.data:
    print(f"#{crypto['cmc_rank']} {crypto['symbol']}: ${crypto['quote']['USD']['price']:,.2f}")
```

## When to Use This Skill

- Building cryptocurrency price trackers or portfolios
- Creating trading bots or algorithmic trading systems
- Analyzing cryptocurrency market data
- Building dashboards with market metrics
- Implementing price alerts and notifications
- Converting between cryptocurrencies and fiat
- Researching historical price data
- Building DeFi analytics tools

## Resources

- [Official API Documentation](https://coinmarketcap.com/api/documentation/v1/)
- [API Dashboard](https://pro.coinmarketcap.com/)
- [Python Library](https://github.com/rsz44/python-coinmarketcap)
- [API FAQ](https://coinmarketcap.com/api/faq/)
- [Pricing Plans](https://coinmarketcap.com/api/pricing/)
