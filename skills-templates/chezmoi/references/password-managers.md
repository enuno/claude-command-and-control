# chezmoi Password Manager Integration

chezmoi integrates with 15+ password managers to securely manage secrets in dotfiles.

## Overview

Password manager functions are used in templates to inject secrets at apply time. This allows you to:
- Keep dotfiles in a public repository
- Store secrets securely in your password manager
- Automatically populate secrets when applying dotfiles

## 1Password

### Setup
```bash
# Add account
op account add --address $SUBDOMAIN.1password.com --email $EMAIL

# Sign in
op signin
```

### Template Functions

| Function | Description |
|----------|-------------|
| `onepassword` | Get structured JSON from `op item get` |
| `onepasswordRead` | Execute `op read` for specific field |
| `onepasswordDocument` | Retrieve documents by UUID |
| `onepasswordDetailsFields` | Access fields by key |
| `onepasswordItemFields` | Access additional item fields |

### Basic Functions
```
{{ onepassword "item-name" }}
{{ onepassword "item-name" "vault-name" }}
{{ onepassword "item-name" "vault-name" "account-name" }}
```

### Read Specific Fields (Recommended)
```
{{ onepasswordRead "op://vault/item/field" }}
{{ onepasswordRead "op://Personal/GitHub/password" }}
{{ onepasswordRead "op://Work/AWS/access_key_id" }}
{{ onepasswordRead "op://app-prod/db/password" }}
```

### Documents
```
{{ onepasswordDocument "document-uuid" }}
{{ onepasswordDocument "document-uuid" "vault-name" }}
```

### Field Access
```
{{ (onepassword "item-name").fields }}
{{ (index (onepassword "$UUID").fields 1).value }}
{{ onepasswordDetailsFields "item-name" }}
{{ (onepasswordDetailsFields "$UUID").password.value }}
{{ onepasswordItemFields "item-name" }}
```

### Configuration
```toml
# chezmoi.toml
[onepassword]
    command = "op"
    prompt = false    # Restore legacy error behavior (default: true)
    mode = "account"  # account, connect, or service
```

### Operational Modes

**Account Mode** (default):
```toml
[onepassword]
    mode = "account"
```
Standard 1Password CLI with interactive sign-in.

**Connect Mode** (1Password Connect Server):
```bash
export OP_CONNECT_HOST="https://connect.example.com"
export OP_CONNECT_TOKEN="your-token"
```
```toml
[onepassword]
    mode = "connect"
```
Note: Disables `onepasswordDocument`, no multi-account access.

**Service Account Mode** (CI/CD, automation):
```bash
export OP_SERVICE_ACCOUNT_TOKEN="your-service-token"
```
```toml
[onepassword]
    mode = "service"
```
For restricted machines without desktop apps.

### Example: SSH Config
```
# private_dot_ssh/config.tmpl
Host github.com
    IdentityFile ~/.ssh/id_ed25519
    User {{ onepasswordRead "op://Personal/GitHub/username" }}
```

### Example: Database Credentials
```
# private_dot_env.tmpl
DB_HOST={{ onepasswordRead "op://Work/Database/host" }}
DB_USER={{ onepasswordRead "op://Work/Database/username" }}
DB_PASS={{ onepasswordRead "op://Work/Database/password" }}
```

## Bitwarden

chezmoi supports three Bitwarden CLI tools:
- **`bw`** - Official Bitwarden CLI
- **`bws`** - Bitwarden Secrets CLI (for Secrets Manager)
- **`rbw`** - Unofficial Rust-based CLI

### Setup (Official CLI)
```bash
# Login options
bw login $BITWARDEN_EMAIL
bw login --apikey
bw login --sso

# Unlock and set session (one-liner)
export BW_SESSION=$(bw unlock --raw)
```

### Auto-Unlock
Configure chezmoi to automatically call `bw unlock` when `BW_SESSION` isn't set:
```toml
# chezmoi.toml
[bitwarden]
    command = "bw"
    unlock = "auto"
```

### Template Functions

| Function | Description |
|----------|-------------|
| `bitwarden` | Get structured vault item data |
| `bitwardenFields` | Access custom field values |
| `bitwardenAttachment` | Download attachment by name + item ID |
| `bitwardenAttachmentByRef` | Download attachment by item reference |
| `bitwardenSecrets` | Access Bitwarden Secrets Manager |
| `rbw` | Use rbw CLI |
| `rbwFields` | Access rbw fields |

### Basic Access
```
{{ bitwarden "item" "example.com" }}
{{ bitwarden "item-id" "organization-id" }}
```

### Field Access
```
{{ (bitwarden "item" "example.com").login.username }}
{{ (bitwarden "item" "example.com").login.password }}
{{ bitwardenFields "item" "example.com" }}
{{ (bitwardenFields "item" "example.com").token.value }}
```

### Attachments
```
# By filename and item ID
{{ bitwardenAttachment "id_rsa" "bf22e4b4-ae4a-4d1c-8c98-ac620004b628" }}

# By reference
{{ bitwardenAttachmentByRef "id_rsa" "item" "example.com" }}
```

### Bitwarden Secrets Manager
For service accounts and CI/CD:
```toml
# chezmoi.toml
[data]
    accessToken = "your-bws-access-token"

[bitwardenSecrets]
    command = "bws"
```

```
{{ bitwardenSecrets "secret-id" }}
{{ bitwardenSecrets "secret-id" .accessToken }}
```

### rbw (Unofficial Bitwarden CLI)
Lighter-weight alternative with better Unix integration:
```bash
# Install rbw
cargo install rbw

# Configure and login
rbw config set email your@email.com
rbw login
```

```
{{ rbw "item-name" }}
{{ rbw "item-name" "folder" }}
{{ rbwFields "item-name" }}
```

### Configuration
```toml
# chezmoi.toml
[bitwarden]
    command = "bw"
    unlock = "auto"  # Auto-unlock when BW_SESSION not set

[bitwardenSecrets]
    command = "bws"
```

### Example: Git Config
```
# dot_gitconfig.tmpl
[user]
    name = {{ (bitwarden "item" "git-config").login.username }}
    email = {{ (bitwarden "item" "git-config").login.notes }}

[credential "https://github.com"]
    helper = !echo password={{ (bitwarden "item" "github.com").login.password }}
```

### Example: SSH Private Key from Attachment
```
# encrypted_private_dot_ssh/id_rsa.tmpl
{{ bitwardenAttachment "id_rsa" "bf22e4b4-ae4a-4d1c-8c98-ac620004b628" }}
```

### Example: Environment File
```
# private_dot_env.tmpl
API_KEY={{ (bitwardenFields "item" "myapp").api_key.value }}
DATABASE_URL={{ (bitwarden "item" "database").login.uris | first | .uri }}
DB_PASSWORD={{ (bitwarden "item" "database").login.password }}
```

## pass (Unix Password Store)

### Basic Access
```
{{ pass "path/to/secret" }}
{{ pass "email/work" }}
```

### Multiline Secrets
```
{{ passFields "path/to/secret" }}
{{ (passFields "aws/credentials").access_key_id }}
{{ (passFields "aws/credentials").secret_access_key }}
```

### Raw Output
```
{{ passRaw "path/to/secret" }}
```

### Configuration
```toml
# chezmoi.toml
[pass]
    command = "pass"
```

### Example: AWS Credentials
```
# private_dot_aws/credentials.tmpl
[default]
aws_access_key_id = {{ (passFields "aws/credentials").access_key_id }}
aws_secret_access_key = {{ (passFields "aws/credentials").secret_access_key }}
```

## gopass

### Basic Access
```
{{ gopass "path/to/secret" }}
{{ gopass "email/personal" }}
```

### Raw Output
```
{{ gopassRaw "path/to/secret" }}
```

### Configuration
```toml
# chezmoi.toml
[gopass]
    command = "gopass"
```

## LastPass

### Basic Access
```
{{ lastpass "item-id" }}
{{ lastpass "item-id" "folder" }}
```

### Raw Output
```
{{ lastpassRaw "item-id" }}
```

### Configuration
```toml
# chezmoi.toml
[lastpass]
    command = "lpass"
```

### Example
```
# private_dot_npmrc.tmpl
//registry.npmjs.org/:_authToken={{ (lastpass "npm-token").password }}
```

## KeePassXC

### Basic Access
```
{{ keepassxc "entry-name" }}
{{ keepassxc "entry-name" "database.kdbx" }}
```

### Attributes
```
{{ keepassxcAttribute "entry-name" "attribute-name" }}
{{ keepassxcAttribute "SSH Key" "private-key" }}
```

### Attachments
```
{{ keepassxcAttachment "entry-name" "attachment-name" }}
```

### Configuration
```toml
# chezmoi.toml
[keepassxc]
    command = "keepassxc-cli"
    database = "/path/to/database.kdbx"
    args = ["--no-password"]
```

## Dashlane

### Functions
```
{{ dashlanePassword "item-name" }}
{{ dashlaneNote "note-name" }}
```

### Configuration
```toml
# chezmoi.toml
[dashlane]
    command = "dcli"
```

## Doppler

### Basic Access
```
{{ doppler "SECRET_NAME" }}
{{ doppler "SECRET_NAME" "project" "config" }}
```

### Project JSON
```
{{ dopplerProjectJson "project" "config" }}
```

### Configuration
```toml
# chezmoi.toml
[doppler]
    command = "doppler"
    project = "default-project"
    config = "dev"
```

## HashiCorp Vault

### Basic Access
```
{{ vault "secret/data/path" }}
{{ (vault "secret/data/myapp").data.password }}
```

### Configuration
```toml
# chezmoi.toml
[vault]
    command = "vault"
```

### Example
```
# private_dot_env.tmpl
DATABASE_URL={{ (vault "secret/data/database").data.url }}
API_KEY={{ (vault "secret/data/api").data.key }}
```

## AWS Secrets Manager

### Basic Access
```
{{ awsSecretsManager "secret-name" }}
{{ (awsSecretsManager "db-credentials").username }}
{{ (awsSecretsManager "db-credentials").password }}
```

### Raw Output
```
{{ awsSecretsManagerRaw "secret-name" }}
```

### Configuration
```toml
# chezmoi.toml
[awsSecretsManager]
    profile = "default"
    region = "us-east-1"
```

## Azure Key Vault

### Basic Access
```
{{ azureKeyVault "secret-name" }}
{{ azureKeyVault "secret-name" "vault-name" }}
```

### Configuration
```toml
# chezmoi.toml
[azureKeyVault]
    defaultVault = "my-vault"
```

## Keeper

### Basic Access
```
{{ keeper "uid" }}
{{ keeperDataFields "uid" }}
{{ keeperFindPassword "title" }}
```

### Configuration
```toml
# chezmoi.toml
[keeper]
    command = "keeper"
```

## ejson

### Decrypt
```
{{ ejsonDecrypt "path/to/secrets.ejson" }}
{{ ejsonDecryptWithKey "path/to/secrets.ejson" "private-key" }}
```

## Passhole (KeePass via CLI)

```
{{ passhole "entry-path" }}
{{ passhole "Websites/GitHub" }}
```

## Proton Pass

### Basic Access
```
{{ protonPass "item-name" }}
{{ protonPassJSON "item-name" }}
```

## Best Practices

### 1. Use Template Variables
```toml
# chezmoi.toml
[data]
    onepassword_account = "my.1password.com"
```

```
# template
{{ onepasswordRead "op://vault/item/field" .onepassword_account }}
```

### 2. Cache Secrets
```toml
# chezmoi.toml
[onepassword]
    cache = true
```

### 3. Handle Missing Secrets Gracefully
```
{{ with onepassword "item" }}
{{ .fields.password.value }}
{{ else }}
# Secret not found - using placeholder
{{ end }}
```

### 4. Environment-Specific Secrets
```
{{ if eq .chezmoi.hostname "work-laptop" }}
{{ onepasswordRead "op://Work/API/key" }}
{{ else }}
{{ onepasswordRead "op://Personal/API/key" }}
{{ end }}
```

### 5. Combine with Encryption
For highly sensitive files, combine password manager with file encryption:
```bash
chezmoi add --encrypt ~/.ssh/id_ed25519
```

### 6. Test Before Applying
```bash
# Test password manager access
chezmoi execute-template '{{ onepasswordRead "op://vault/item/field" }}'

# Preview rendered file
chezmoi cat ~/.config/secrets
```

## Troubleshooting

### Authentication Issues
- Ensure you're logged into the password manager CLI
- Check that the CLI command is in your PATH
- Verify vault/account names are correct

### Caching Issues
```bash
# Clear chezmoi cache
rm -rf ~/.cache/chezmoi

# Disable caching temporarily
chezmoi apply --no-cache
```

### Debug Mode
```bash
chezmoi apply --debug
```
