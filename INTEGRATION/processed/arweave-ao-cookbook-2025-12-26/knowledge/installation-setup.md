# AO Installation and Setup Guide

## Prerequisites

- **NodeJS**: Version 20 or higher
- **NPM**: Comes with NodeJS
- **Code Editor**: VS Code, Sublime, or any editor
- **Arweave Wallet**: Optional, auto-generated if not provided

## Step-by-Step Installation

### 1. Verify NodeJS Version

```bash
node --version
# Should show v20.x.x or higher

npm --version
# Verify npm is installed
```

If NodeJS is not installed or version is < 20:
- Download from https://nodejs.org/
- Install LTS version (v20 or newer)

### 2. Install AOS Globally

```bash
# Install from official AO distribution
npm i -g https://get_ao.arweave.net

# Alternative: if above fails, try
npm install -g @permaweb/aos
```

### 3. Verify Installation

```bash
# Check aos command is available
aos --version

# Show help
aos --help
```

## Network Connection Options

### Option 1: HyperBEAM (Recommended)

Connect to the production HyperBEAM network for optimal performance:

```bash
aos --node https://forward.computer
```

**Benefits**:
- Instant HTTP access to process state
- High-performance message processing
- Production-ready infrastructure

### Option 2: Default Network

```bash
# Simple connection with defaults
aos
```

### Option 3: Custom Node

```bash
# Connect to specific node
aos --node https://your-custom-node.com
```

## Wallet Configuration

### Auto-Generated Wallet (Default)

```bash
# Let aos create wallet automatically
aos

# Wallet saved to: ~/.aos.json
```

**First run output**:
```
Creating new wallet at ~/.aos.json
Connected to AO
Your Process ID: <process-id>
aos>
```

### Custom Wallet

```bash
# Use existing Arweave wallet
aos --wallet ~/.arweave-wallet.json

# Or specify custom location
aos --wallet /path/to/wallet.json
```

**Wallet format**: Standard Arweave JWK format

## Verify Connection

Once connected, verify everything works:

```lua
-- Check process info
Name
-- Output: Your process name

Owner
-- Output: Your wallet address

-- Test basic functionality
print("Hello AO")
-- Output: Hello AO

-- Check inbox
#Inbox
-- Output: 0 (if new process)
```

## Common Setup Issues

### Issue: "aos: command not found"

**Solutions**:
1. Check npm global bin is in PATH:
   ```bash
   npm config get prefix
   # Add /bin to PATH if needed
   ```

2. Reinstall:
   ```bash
   npm uninstall -g aos
   npm i -g https://get_ao.arweave.net
   ```

3. Use npx:
   ```bash
   npx aos
   ```

### Issue: Connection timeout

**Solutions**:
- Check internet connection
- Try different node: `aos --node https://forward.computer`
- Disable firewall temporarily
- Check proxy settings

### Issue: Wallet permission errors

**Solutions**:
```bash
# Fix wallet file permissions
chmod 600 ~/.aos.json

# Or create new wallet
rm ~/.aos.json
aos  # Will create new wallet
```

## Environment Setup

### VS Code Integration

1. Install Lua extension
2. Create `.vscode/settings.json`:
```json
{
  "lua.diagnostics.globals": ["Handlers", "Send", "Spawn", "Inbox", "Owner", "Name"]
}
```

### Project Structure

```
my-ao-project/
├── src/
│   ├── handlers/
│   │   ├── auth.lua
│   │   ├── token.lua
│   │   └── game.lua
│   ├── utils/
│   │   ├── validation.lua
│   │   └── helpers.lua
│   └── main.lua
├── tests/
│   └── test_handlers.lua
└── README.md
```

### Loading Files in aos

```lua
-- In aos shell
.load src/utils/validation.lua
.load src/handlers/auth.lua
.load src/main.lua
```

## Next Steps

After successful setup:
1. ✅ Complete the "Begin" tutorial in AO Cookbook
2. ✅ Build your first message handler
3. ✅ Create a token or chatroom
4. ✅ Explore HTTP state access via HyperBEAM
5. ✅ Join the AO Discord community

---

**Installation complete!** You're ready to build on AO.
