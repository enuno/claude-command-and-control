# Arweave Bridge API Reference

## Base URL

```
https://zigzag-arweave-bridge.herokuapp.com
```

## Endpoints

### GET /time

Get current server timestamp for signature generation.

**Request:**
```http
GET /time HTTP/1.1
Host: zigzag-arweave-bridge.herokuapp.com
```

**Response:**
```json
{
  "timestamp": 1640000000000
}
```

**Usage:**
```javascript
const response = await fetch("https://zigzag-arweave-bridge.herokuapp.com/time");
const { timestamp } = await response.json();
```

---

### GET /allocation/zksync

Check remaining storage allocation for an address.

**Request:**
```http
GET /allocation/zksync?address={wallet_address} HTTP/1.1
Host: zigzag-arweave-bridge.herokuapp.com
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Ethereum wallet address (0x...) |

**Response:**
```json
{
  "remaining_bytes": 1048576
}
```

**Example:**
```bash
curl "https://zigzag-arweave-bridge.herokuapp.com/allocation/zksync?address=0x1234567890abcdef1234567890abcdef12345678"
```

**Response Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Invalid address format |
| 404 | No allocation found for address |

---

### POST /arweave/upload

Upload a file to permanent Arweave storage.

**Request:**
```http
POST /arweave/upload HTTP/1.1
Host: zigzag-arweave-bridge.herokuapp.com
Content-Type: multipart/form-data
```

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender | string | Yes | Ethereum wallet address |
| file | file | Yes | File to upload |
| timestamp | number | Yes | Current server timestamp (ms) |
| signature | string | Yes | ECDSA signature of `{sender}:{timestamp}` |

**Success Response:**
```json
{
  "arweave_tx_id": "abc123def456...",
  "remaining_bytes": 950000
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| 200 | Upload successful |
| 400 | Invalid request (missing fields, bad signature) |
| 401 | Invalid or expired signature |
| 402 | Insufficient storage allocation |
| 413 | File too large for remaining allocation |
| 500 | Server error |

---

## Authentication

### Signature Generation

1. **Get timestamp** from `/time` endpoint
2. **Create message**: `{sender_address}:{timestamp}`
3. **Sign message** using ECDSA with Ethereum private key

**Message Format:**
```
0xYourWalletAddress:1640000000000
```

**JavaScript Example:**
```javascript
import { ethers } from "ethers";

const wallet = new ethers.Wallet(privateKey);
const sender = wallet.address;
const timestamp = Date.now(); // Use server time in production
const message = `${sender}:${timestamp}`;
const signature = await wallet.signMessage(message);
```

### Signature Validation

The server validates:
1. Signature recovers to the sender address
2. Timestamp is within acceptable window (not stale)
3. Sender has sufficient allocation

---

## Rate Limits

| Limit Type | Value |
|------------|-------|
| Requests per minute | 60 |
| Max file size | Limited by allocation |
| Concurrent uploads | 5 per address |

---

## Data Types

### Address
- Format: `0x` followed by 40 hexadecimal characters
- Example: `0xcb7aca0cdea76c5bd5946714083c559e34627607`

### Timestamp
- Format: Unix timestamp in milliseconds
- Example: `1640000000000`

### Signature
- Format: Ethereum ECDSA signature (hex string)
- Length: 132 characters (with 0x prefix)
- Example: `0x1234...abcd`

### Arweave TX ID
- Format: Base64URL encoded string
- Length: 43 characters
- Example: `abc123def456ghi789jkl012mno345pqr678stu901`

---

## Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_ADDRESS | Address format incorrect | Use valid 0x address |
| INVALID_SIGNATURE | Signature verification failed | Check signing process |
| EXPIRED_TIMESTAMP | Timestamp too old | Get fresh timestamp |
| INSUFFICIENT_ALLOCATION | Not enough storage | Add more funds |
| FILE_TOO_LARGE | File exceeds allocation | Reduce file size or add funds |
| MISSING_FIELD | Required field missing | Include all required fields |

---

## Complete cURL Example

```bash
# Note: This won't work directly due to timestamp expiration
# Use the JavaScript example instead

# 1. Get server time
TIMESTAMP=$(curl -s "https://zigzag-arweave-bridge.herokuapp.com/time" | jq -r '.timestamp')

# 2. Sign message (requires external signing)
# MESSAGE="${SENDER}:${TIMESTAMP}"
# SIGNATURE=$(sign_message "$MESSAGE" "$PRIVATE_KEY")

# 3. Upload file
curl -X POST "https://zigzag-arweave-bridge.herokuapp.com/arweave/upload" \
  -F "sender=0xYourAddress" \
  -F "timestamp=$TIMESTAMP" \
  -F "signature=$SIGNATURE" \
  -F "file=@/path/to/file.json"
```

---

## SDK Support

Currently, the bridge provides a REST API. No official SDK exists, but the upload example demonstrates the complete flow:

```javascript
// See upload_example.js in the repository
// https://github.com/ZigZagExchange/arweave-bridge/blob/master/upload_example.js
```

---

## Webhooks

The bridge does not currently support webhooks. To check upload status:

1. Poll the Arweave network using the returned TX ID
2. Use Arweave gateway to verify data availability

```javascript
// Check if data is available
const arweaveUrl = `https://arweave.net/${arweave_tx_id}`;
const response = await fetch(arweaveUrl);
if (response.ok) {
  console.log("Data is available on Arweave");
}
```
