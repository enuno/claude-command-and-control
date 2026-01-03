# x402-Turbo-Upload - Command Line Tool

**Repository:** [ardriveapp/x402-turbo-upload](https://github.com/ardriveapp/x402-turbo-upload)
**Language:** TypeScript (100%)
**Stars:** 0 (new repository - created November 2025)
**Status:** Active Development
**Purpose:** Simple TypeScript CLI tool for uploading data to x402 Turbo Upload Service

---

## Overview

A minimal command-line tool that demonstrates how to upload data items to the x402 Turbo Upload Service using EVM wallet authentication. This is a simplified reference implementation for understanding the x402 protocol integration with Turbo Upload.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/ardriveapp/x402-turbo-upload.git
cd x402-turbo-upload

# Install dependencies
yarn

# Build the TypeScript source
yarn build
```

---

## Usage

### Basic Command Structure

```bash
node dist/index.js [OPTIONS]
```

### Required Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--path DATA_PATH` | Path to file for upload | `--path ./data/file.txt` |
| `--wallet EVM_PKEY_OR_PATH` | EVM private key or file path | `--wallet "0xYOUR_KEY"` |

### Optional Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--upload-url UPLOAD_URL` | Custom upload endpoint | `https://upload.ardrive.io` |
| `--max-usdc MAX_USDC_VALUE` | Spending limit in USDC (e.g., 10 = $10) | No limit |
| `--content-type CONTENT_TYPE` | MIME type of upload data | Auto-detected |

### Example Usage

```bash
# Upload a text file with $10 USDC spending limit
node dist/index.js \
  --path ./data/file.txt \
  --wallet "0xYOUR_PRIVATE_KEY" \
  --max-usdc 10 \
  --content-type "text/plain"

# Upload using wallet from file
node dist/index.js \
  --path ./data/document.pdf \
  --wallet ./wallet/private-key.txt \
  --max-usdc 5 \
  --content-type "application/pdf"

# Upload to custom endpoint
node dist/index.js \
  --path ./data/image.png \
  --wallet "0xYOUR_PRIVATE_KEY" \
  --upload-url "https://custom.upload.endpoint" \
  --content-type "image/png"
```

---

## Key Features

### x402 Protocol Integration
- Uses EVM wallet signatures for authentication
- Supports custom upload service endpoints
- Configurable USDC spending limits
- Standard MIME type support

### Command Line Interface
- Simple parameter-based configuration
- Direct file path input
- Flexible wallet credential handling (inline or file-based)
- Custom endpoint specification

### Upload Service Integration
- Default integration with `https://upload.ardrive.io`
- Custom endpoint support for development/testing
- Automatic content type detection
- Transaction cost management via USDC limits

---

## Important Considerations

### Security
⚠️ **Warning:** This is a minimal demonstration tool. For production use:
- Never hardcode private keys in scripts
- Use environment variables or secure key management
- Implement proper key file permissions (chmod 600)
- Validate all inputs before processing
- Add comprehensive error handling

### Error Handling
The minimal implementation lacks:
- Robust error recovery
- Network failure handling
- Input validation
- Transaction retry logic
- Detailed error messages

### Production Requirements
Before production deployment:
1. Add comprehensive error handling
2. Implement transaction confirmation waiting
3. Add upload progress tracking
4. Implement retry mechanisms
5. Add logging and monitoring
6. Validate file sizes and types
7. Implement rate limiting
8. Add transaction receipt verification

---

## Technical Details

### x402 Protocol
- Uses EVM-compatible wallet signatures
- Integrates with Turbo Upload Service for Arweave storage
- Supports USDC-denominated pricing
- Provides permanent data storage via Arweave

### Implementation Notes
- Built with TypeScript for type safety
- Minimal dependencies for simplicity
- Command-line focused (no GUI)
- Synchronous execution model
- Direct API integration (no SDK wrapper)

---

## Repository Statistics

- **Total Commits:** 4
- **Created:** November 17, 2025
- **Primary Branch:** main
- **Open Issues:** 0
- **License:** Not specified
- **Topics/Tags:** None specified

---

## Related Tools

- **turbo-sdk** - Full-featured TypeScript SDK for Turbo Upload
- **turbo-python-sdk** - Python implementation of Turbo SDK
- **ArDrive** - File management and upload platform
- **Arweave** - Permanent decentralized storage network

---

## Use Cases

### Development & Testing
- Quick upload testing during development
- x402 protocol exploration
- Custom endpoint integration testing
- CLI automation scripts

### Simple Automation
- Batch file uploads
- CI/CD pipeline integration
- Automated backup scripts
- Simple data archival

### Learning & Documentation
- Understanding x402 protocol
- Turbo Upload API integration examples
- EVM wallet authentication patterns
- Minimal implementation reference

---

## Limitations

As a minimal demonstration tool, this implementation:
- ❌ No progress reporting
- ❌ No transaction confirmation waiting
- ❌ Limited error messages
- ❌ No retry mechanisms
- ❌ No upload verification
- ❌ No batch upload support
- ❌ No resume capability
- ❌ No metadata attachment
- ❌ No upload status checking

For production features, use the full **turbo-sdk** instead.

---

## Comparison with turbo-sdk

| Feature | x402-turbo-upload | turbo-sdk |
|---------|-------------------|-----------|
| **Purpose** | Minimal CLI demo | Full-featured SDK |
| **Language** | TypeScript | TypeScript |
| **Complexity** | Simple | Comprehensive |
| **Error Handling** | Minimal | Robust |
| **Progress Tracking** | No | Yes |
| **Retry Logic** | No | Yes |
| **Upload Verification** | No | Yes |
| **Metadata Support** | No | Yes |
| **Batch Uploads** | No | Yes |
| **Transaction Receipts** | No | Yes |
| **Production Ready** | No | Yes |
| **Use Case** | Learning/Testing | Production |

---

## When to Use x402-turbo-upload

✅ **Use this tool when:**
- Learning x402 protocol basics
- Testing custom upload endpoints
- Creating simple automation scripts
- Understanding minimal implementation
- Quick one-off uploads for testing

❌ **Don't use this tool for:**
- Production applications
- Large-scale uploads
- Mission-critical data
- Applications requiring error recovery
- Batch processing workflows
- Upload verification needs
- Progress monitoring requirements

**For production:** Use the full **turbo-sdk** instead.

---

## Additional Resources

- **Turbo Upload Service:** https://upload.ardrive.io
- **ArDrive Homepage:** https://ardrive.io/turbo/
- **turbo-sdk Repository:** https://github.com/ardriveapp/turbo-sdk
- **Arweave Documentation:** https://arweave.org

---

**Last Updated:** January 3, 2026
**Document Version:** 1.0
**Source:** GitHub repository analysis
