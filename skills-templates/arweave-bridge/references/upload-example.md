# Arweave Bridge Upload Examples

## Node.js Upload Example

### Complete Implementation

```javascript
import { FormData, fileFromPath } from "formdata-node";
import fetch from "node-fetch";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const BASE_URL = "https://zigzag-arweave-bridge.herokuapp.com";

/**
 * Get current server timestamp
 */
async function getServerTime() {
  const response = await fetch(`${BASE_URL}/time`);
  const data = await response.json();
  return data.timestamp;
}

/**
 * Check remaining allocation for an address
 */
async function checkAllocation(address) {
  const response = await fetch(
    `${BASE_URL}/allocation/zksync?address=${address}`
  );
  const data = await response.json();
  return data.remaining_bytes;
}

/**
 * Create signature for upload authentication
 */
async function createSignature(wallet, timestamp) {
  const message = `${wallet.address}:${timestamp}`;
  return await wallet.signMessage(message);
}

/**
 * Upload a file to Arweave via the bridge
 */
async function uploadFile(filePath) {
  // Validate environment
  if (!process.env.ETH_PRIVKEY) {
    throw new Error("ETH_PRIVKEY environment variable not set");
  }

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Create wallet
  const wallet = new ethers.Wallet(process.env.ETH_PRIVKEY);
  const sender = wallet.address;

  // Check allocation
  const remainingBytes = await checkAllocation(sender);
  const fileSize = fs.statSync(filePath).size;

  if (fileSize > remainingBytes) {
    throw new Error(
      `File size (${fileSize} bytes) exceeds allocation (${remainingBytes} bytes)`
    );
  }

  // Get server time and create signature
  const timestamp = await getServerTime();
  const signature = await createSignature(wallet, timestamp);

  // Prepare form data
  const formData = new FormData();
  formData.append("sender", sender);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("file", await fileFromPath(filePath));

  // Upload
  const response = await fetch(`${BASE_URL}/arweave/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Upload failed: ${error.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Upload JSON data directly
 */
async function uploadJSON(data, filename = "data.json") {
  const tempPath = path.join("/tmp", filename);
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));

  try {
    const result = await uploadFile(tempPath);
    return result;
  } finally {
    fs.unlinkSync(tempPath); // Cleanup
  }
}

// Export functions
export { getServerTime, checkAllocation, uploadFile, uploadJSON };
```

### Usage Examples

```javascript
import { uploadFile, uploadJSON, checkAllocation } from "./arweave-bridge.js";

// Example 1: Upload a file
async function example1() {
  const result = await uploadFile("./my-document.pdf");
  console.log(`Uploaded! View at: https://arweave.net/${result.arweave_tx_id}`);
}

// Example 2: Upload JSON data
async function example2() {
  const metadata = {
    name: "My NFT",
    description: "A permanent NFT on Arweave",
    image: "https://example.com/image.png",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" }
    ]
  };

  const result = await uploadJSON(metadata, "nft-metadata.json");
  console.log(`Metadata URL: https://arweave.net/${result.arweave_tx_id}`);
}

// Example 3: Check allocation before upload
async function example3() {
  const wallet = new ethers.Wallet(process.env.ETH_PRIVKEY);
  const bytes = await checkAllocation(wallet.address);
  console.log(`Available storage: ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}
```

---

## Python Upload Example

```python
import os
import json
import requests
from eth_account import Account
from eth_account.messages import encode_defunct

BASE_URL = "https://zigzag-arweave-bridge.herokuapp.com"

def get_server_time():
    """Get current server timestamp."""
    response = requests.get(f"{BASE_URL}/time")
    return response.json()["timestamp"]

def check_allocation(address):
    """Check remaining storage allocation."""
    response = requests.get(f"{BASE_URL}/allocation/zksync", params={"address": address})
    return response.json()["remaining_bytes"]

def create_signature(private_key, sender, timestamp):
    """Create ECDSA signature for authentication."""
    message = f"{sender}:{timestamp}"
    message_hash = encode_defunct(text=message)
    signed = Account.sign_message(message_hash, private_key)
    return signed.signature.hex()

def upload_file(file_path, private_key):
    """Upload a file to Arweave via the bridge."""
    # Create account
    account = Account.from_key(private_key)
    sender = account.address

    # Check allocation
    remaining = check_allocation(sender)
    file_size = os.path.getsize(file_path)

    if file_size > remaining:
        raise ValueError(f"File size ({file_size}) exceeds allocation ({remaining})")

    # Get timestamp and sign
    timestamp = get_server_time()
    signature = create_signature(private_key, sender, timestamp)

    # Prepare request
    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {
            "sender": sender,
            "timestamp": str(timestamp),
            "signature": signature
        }

        response = requests.post(
            f"{BASE_URL}/arweave/upload",
            data=data,
            files=files
        )

    if not response.ok:
        raise Exception(f"Upload failed: {response.text}")

    return response.json()

def upload_json(data, private_key, filename="data.json"):
    """Upload JSON data directly."""
    temp_path = f"/tmp/{filename}"

    with open(temp_path, "w") as f:
        json.dump(data, f, indent=2)

    try:
        result = upload_file(temp_path, private_key)
        return result
    finally:
        os.remove(temp_path)

# Usage
if __name__ == "__main__":
    private_key = os.environ["ETH_PRIVKEY"]

    # Upload a file
    result = upload_file("./document.pdf", private_key)
    print(f"Arweave URL: https://arweave.net/{result['arweave_tx_id']}")

    # Upload JSON
    metadata = {"name": "Test", "value": 123}
    result = upload_json(metadata, private_key)
    print(f"JSON URL: https://arweave.net/{result['arweave_tx_id']}")
```

### Python Requirements

```
requests>=2.28.0
eth-account>=0.8.0
```

---

## Browser Example (with Backend Signing)

Since private keys shouldn't be exposed in browsers, use a backend service:

### Frontend (React)

```jsx
import React, { useState } from "react";

function ArweaveUploader() {
  const [file, setFile] = useState(null);
  const [txId, setTxId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send to your backend which handles signing
      const response = await fetch("/api/arweave/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setTxId(result.arweave_tx_id);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload to Arweave"}
      </button>

      {txId && (
        <p>
          View file:{" "}
          <a href={`https://arweave.net/${txId}`} target="_blank">
            https://arweave.net/{txId}
          </a>
        </p>
      )}
    </div>
  );
}
```

### Backend (Express)

```javascript
import express from "express";
import multer from "multer";
import { uploadFile } from "./arweave-bridge.js";

const app = express();
const upload = multer({ dest: "/tmp/uploads/" });

app.post("/api/arweave/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadFile(req.file.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

---

## Batch Upload Example

```javascript
import { uploadFile } from "./arweave-bridge.js";
import fs from "fs";
import path from "path";

async function batchUpload(directory) {
  const files = fs.readdirSync(directory);
  const results = [];

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isFile()) {
      console.log(`Uploading: ${file}`);

      try {
        const result = await uploadFile(filePath);
        results.push({
          file,
          success: true,
          txId: result.arweave_tx_id,
          url: `https://arweave.net/${result.arweave_tx_id}`
        });

        // Rate limiting - wait 1 second between uploads
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          file,
          success: false,
          error: error.message
        });
      }
    }
  }

  return results;
}

// Usage
const results = await batchUpload("./documents");
console.log(JSON.stringify(results, null, 2));
```

---

## Error Handling Best Practices

```javascript
async function safeUpload(filePath) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFile(filePath);
    } catch (error) {
      lastError = error;

      // Don't retry on allocation errors
      if (error.message.includes("exceeds allocation")) {
        throw error;
      }

      // Don't retry on signature errors (likely config issue)
      if (error.message.includes("signature")) {
        throw error;
      }

      // Retry on network/timeout errors
      console.log(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```
