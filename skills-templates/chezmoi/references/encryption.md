# chezmoi Encryption Reference

chezmoi supports encrypting sensitive files so you can safely store dotfiles in public repositories.

## Supported Encryption Methods

| Method | Description | Recommendation |
|--------|-------------|----------------|
| **age** | Modern, simple encryption | Recommended |
| **gpg** | Traditional PGP encryption | Good for existing GPG users |
| **git-crypt** | Transparent git encryption | For team/shared repos |
| **transcrypt** | Git-based encryption | Alternative to git-crypt |

## age Encryption (Recommended)

### Setup

1. **Generate a key:**
```bash
age-keygen -o ~/.config/chezmoi/key.txt
# Output: Public key: age1...
```

2. **Configure chezmoi:**
```toml
# ~/.config/chezmoi/chezmoi.toml
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipient = "age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p"
```

3. **Protect the key:**
```bash
chmod 600 ~/.config/chezmoi/key.txt
```

### Multiple Recipients
Share encrypted files with multiple people:

```toml
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipients = [
        "age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p",
        "age1another-recipient-public-key",
    ]
```

### Using age with Passphrase
Encrypt key file itself with a passphrase:

```bash
# Generate passphrase-protected key
age-keygen | age -p > ~/.config/chezmoi/key.txt.age
```

```toml
[age]
    identity = "~/.config/chezmoi/key.txt.age"
    passphrase = true
    recipient = "age1..."
```

### Built-in age
chezmoi includes a built-in age implementation:

```toml
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipient = "age1..."
    # No external age binary needed
```

Force external age binary:
```bash
chezmoi --use-builtin-age=false apply
```

## GPG Encryption

### Setup

1. **Ensure GPG key exists:**
```bash
gpg --list-keys
# or generate: gpg --gen-key
```

2. **Configure chezmoi:**
```toml
# ~/.config/chezmoi/chezmoi.toml
[gpg]
    recipient = "your-gpg-key-id"
```

Or use email:
```toml
[gpg]
    recipient = "your-email@example.com"
```

### Multiple Recipients
```toml
[gpg]
    recipients = [
        "key-id-1",
        "key-id-2",
    ]
```

### Symmetric Encryption
Use passphrase instead of key:

```toml
[gpg]
    symmetric = true
```

### GPG Options
```toml
[gpg]
    recipient = "your-key-id"
    args = ["--armor", "--no-auto-check-trustdb"]
```

## Adding Encrypted Files

### Basic Usage
```bash
# Add file with encryption
chezmoi add --encrypt ~/.ssh/id_ed25519
chezmoi add --encrypt ~/.config/tokens.yaml
chezmoi add --encrypt ~/.netrc
```

### Result in Source Directory
```
~/.local/share/chezmoi/
├── encrypted_private_dot_ssh/
│   └── id_ed25519
├── encrypted_dot_config/
│   └── tokens.yaml
└── encrypted_dot_netrc
```

Files are stored in ASCII-armored format.

### Convert Existing File to Encrypted
```bash
# Remove unencrypted version
chezmoi forget ~/.config/secrets.yaml

# Re-add with encryption
chezmoi add --encrypt ~/.config/secrets.yaml
```

## Working with Encrypted Files

### Edit Encrypted Files
```bash
# Automatically decrypts, opens editor, re-encrypts
chezmoi edit ~/.ssh/id_ed25519
```

Or use the dedicated command:
```bash
chezmoi edit-encrypted ~/.ssh/id_ed25519
```

### View Encrypted Content
```bash
# Decrypt and display
chezmoi cat ~/.ssh/id_ed25519
```

### Manual Encrypt/Decrypt
```bash
# Encrypt a file
chezmoi encrypt plaintext.txt > encrypted.txt

# Decrypt a file
chezmoi decrypt encrypted.txt > plaintext.txt
```

## Encryption in Templates

### Decrypt Function
```
# In a template file
{{ decrypt (include "encrypted_file") }}
```

### Conditional Encryption
```
# .chezmoiignore
{{ if not .enableEncryption }}
encrypted_*
{{ end }}
```

## git-crypt Integration

### Setup

1. **Install git-crypt:**
```bash
# macOS
brew install git-crypt

# Linux
apt install git-crypt
```

2. **Initialize in source directory:**
```bash
chezmoi cd
git-crypt init
```

3. **Configure .gitattributes:**
```
# In source directory
encrypted_* filter=git-crypt diff=git-crypt
```

4. **Add GPG key:**
```bash
git-crypt add-gpg-user your-gpg-key-id
```

### Usage
Files matching `encrypted_*` are automatically encrypted in git.

## transcrypt Integration

### Setup

1. **Initialize:**
```bash
chezmoi cd
transcrypt --cipher=aes-256-cbc
```

2. **Configure .gitattributes:**
```
encrypted_* filter=crypt diff=crypt merge=crypt
```

### Export Key for Other Machines
```bash
transcrypt --display
# Share the password securely
```

## Multi-Machine Key Management

### Option 1: Same Key Everywhere
Store key in password manager, retrieve during setup:

```bash
# .chezmoi.toml.tmpl
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipient = "age1..."
```

```bash
# run_once_before_setup-age-key.sh.tmpl
#!/bin/bash
if [ ! -f ~/.config/chezmoi/key.txt ]; then
    mkdir -p ~/.config/chezmoi
    {{ onepasswordRead "op://Personal/chezmoi-age-key/notes" }} > ~/.config/chezmoi/key.txt
    chmod 600 ~/.config/chezmoi/key.txt
fi
```

### Option 2: Different Keys Per Machine
Use multiple recipients so any machine can decrypt:

```toml
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipients = [
        "age1laptop...",
        "age1desktop...",
        "age1work...",
    ]
```

### Option 3: Central Key Server
Use age with SSH keys from GitHub:

```toml
[age]
    identity = "~/.config/chezmoi/key.txt"
    # Encrypt to SSH keys on GitHub
    recipientsFiles = ["~/.config/chezmoi/recipients.txt"]
```

## Best Practices

### 1. What to Encrypt
**Encrypt:**
- SSH private keys
- API tokens
- Database credentials
- Password manager configs
- Personal access tokens

**Don't encrypt:**
- SSH public keys
- General config files
- Non-sensitive settings

### 2. Key Backup
```bash
# Export and store securely
cat ~/.config/chezmoi/key.txt
# Store in password manager or secure backup
```

### 3. Test Encryption
```bash
# Verify encryption works
chezmoi apply --verbose

# Check file is encrypted in source
cat ~/.local/share/chezmoi/encrypted_private_dot_ssh/id_ed25519
# Should show encrypted content
```

### 4. Rotate Keys
When rotating encryption keys:

1. Decrypt all files with old key
2. Update key configuration
3. Re-encrypt all files
4. Commit changes

```bash
# Decrypt all
chezmoi decrypt ~/.local/share/chezmoi/encrypted_* > /tmp/decrypted/

# Update key
age-keygen -o ~/.config/chezmoi/key.txt
# Update chezmoi.toml with new recipient

# Re-encrypt
for f in /tmp/decrypted/*; do
    chezmoi encrypt "$f" > "~/.local/share/chezmoi/encrypted_$(basename $f)"
done
```

### 5. Exclude Key from Source
```
# .chezmoiignore
.config/chezmoi/key.txt
.gnupg/
```

## Troubleshooting

### "no identity matched any of the recipients"
- Key file doesn't match recipient
- Check `chezmoi.toml` has correct `recipient`
- Verify key file exists at `identity` path

### "failed to decrypt"
- Wrong key or corrupted file
- Try `chezmoi decrypt` manually to see error

### GPG passphrase issues
```toml
[gpg]
    recipient = "..."
    # Use gpg-agent for passphrase caching
    args = ["--pinentry-mode", "loopback"]
```

### Permission denied on key file
```bash
chmod 600 ~/.config/chezmoi/key.txt
chown $(whoami) ~/.config/chezmoi/key.txt
```
