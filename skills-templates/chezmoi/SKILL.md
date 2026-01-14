# chezmoi - Dotfiles Manager

> Manage your dotfiles across multiple machines, securely.

## Quick Reference

### Installation
```bash
# macOS
brew install chezmoi

# Linux (snap)
snap install chezmoi --classic

# Linux (binary)
sh -c "$(curl -fsLS get.chezmoi.io)"

# Windows
winget install twpayne.chezmoi
# or
choco install chezmoi
```

### Essential Commands

| Command | Description |
|---------|-------------|
| `chezmoi init` | Initialize chezmoi on new machine |
| `chezmoi add ~/.bashrc` | Add file to source state |
| `chezmoi edit ~/.bashrc` | Edit file in source state |
| `chezmoi diff` | Preview changes before apply |
| `chezmoi apply` | Apply changes to home directory |
| `chezmoi update` | Pull from remote and apply |
| `chezmoi cd` | Open shell in source directory |
| `chezmoi doctor` | Check for common problems |

### Quick Start (New Machine)
```bash
# Initialize from GitHub (combines clone + apply)
chezmoi init --apply $GITHUB_USERNAME

# Or with full URL
chezmoi init --apply https://github.com/username/dotfiles.git
```

### Daily Workflow
```bash
# Add new dotfile
chezmoi add ~/.config/starship.toml

# Edit and apply in one command
chezmoi edit --apply ~/.bashrc

# Check what would change
chezmoi diff

# Apply all changes
chezmoi apply -v

# Push changes (in source directory)
chezmoi cd
git add . && git commit -m "Update dotfiles" && git push
```

## Source State Attributes

### File Prefixes

| Prefix | Effect | Example |
|--------|--------|---------|
| `dot_` | Adds `.` to filename | `dot_bashrc` → `.bashrc` |
| `private_` | Mode 0600 (user only) | `private_dot_ssh/` |
| `executable_` | Mode +x | `executable_dot_local/bin/script` |
| `readonly_` | Mode -w | `readonly_dot_config` |
| `encrypted_` | Encrypted file | `encrypted_private_dot_ssh/id_rsa` |
| `empty_` | Keep empty file | `empty_dot_gitkeep` |
| `create_` | Create only if missing | `create_dot_config` |
| `modify_` | Modify existing file | `modify_dot_bashrc` |
| `remove_` | Remove from target | `remove_dot_old_config` |
| `symlink_` | Create symlink | `symlink_dot_vimrc` |
| `exact_` | Remove unlisted items | `exact_dot_config/` |

### Template Suffix
Add `.tmpl` to process as Go template:
```
dot_gitconfig.tmpl
private_dot_ssh/config.tmpl
```

### Script Prefixes

| Prefix | Behavior |
|--------|----------|
| `run_` | Run every apply |
| `run_once_` | Run once (tracks hash) |
| `run_onchange_` | Run when content changes |
| `before_` | Run before file updates |
| `after_` | Run after file updates |

Example: `run_once_before_install-packages.sh.tmpl`

## Templates

### Basic Syntax
```
{{ .chezmoi.hostname }}
{{ .chezmoi.os }}
{{ .chezmoi.arch }}
{{ .chezmoi.username }}
{{ .chezmoi.homeDir }}
```

### Conditionals
```
{{ if eq .chezmoi.os "darwin" }}
# macOS specific
export HOMEBREW_PREFIX="/opt/homebrew"
{{ else if eq .chezmoi.os "linux" }}
# Linux specific
export PATH="$HOME/.local/bin:$PATH"
{{ end }}
```

### Complex Conditions
```
{{ if and (eq .chezmoi.os "linux") (eq .chezmoi.hostname "workstation") }}
# Work machine Linux config
{{ end }}
```

### Whitespace Control
```
{{- .variable -}}  # Trim both sides
{{- .variable }}   # Trim left only
{{ .variable -}}   # Trim right only
```

### View Available Data
```bash
chezmoi data
```

### Test Templates
```bash
chezmoi execute-template '{{ .chezmoi.hostname }}'
chezmoi cat ~/.bashrc  # Preview rendered template
```

## Password Manager Integration

### 1Password
```
{{ onepassword "item-name" }}
{{ onepasswordRead "op://vault/item/field" }}
{{ onepasswordDocument "document-uuid" }}
{{ onepasswordDetailsFields "item-name" }}
```

**Modes**: `account` (default), `connect`, `service` (for CI/CD)

### Bitwarden
```
{{ bitwarden "item" "example.com" }}
{{ (bitwarden "item" "example.com").login.password }}
{{ bitwardenFields "item" "example.com" }}
{{ bitwardenAttachment "id_rsa" "item-uuid" }}
{{ bitwardenSecrets "secret-id" }}
{{ rbw "item-name" }}
```

**Auto-unlock** (chezmoi.toml):
```toml
[bitwarden]
    unlock = "auto"
```

### pass (Unix Password Manager)
```
{{ pass "path/to/secret" }}
{{ passFields "path/to/secret" }}
```

### gopass
```
{{ gopass "path/to/secret" }}
```

### LastPass
```
{{ lastpass "item-id" }}
```

### AWS Secrets Manager
```
{{ awsSecretsManager "secret-name" }}
```

### Azure Key Vault
```
{{ azureKeyVault "secret-name" }}
```

### Vault (HashiCorp)
```
{{ vault "secret/path" }}
```

## Encryption

### Setup with age (Recommended)
```bash
# Generate key
age-keygen -o ~/.config/chezmoi/key.txt

# Configure chezmoi.toml
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipient = "age1..."
```

### Setup with GPG
```bash
# Configure chezmoi.toml
[gpg]
    recipient = "your-gpg-key-id"
```

### Add Encrypted Files
```bash
chezmoi add --encrypt ~/.ssh/id_rsa
chezmoi add --encrypt ~/.config/secrets.yaml
```

Encrypted files use `encrypted_` prefix automatically.

## Configuration File

Location: `~/.config/chezmoi/chezmoi.toml`

### Common Settings
```toml
# Source directory (default: ~/.local/share/chezmoi)
sourceDir = "~/.dotfiles"

# Default editor
[edit]
    command = "nvim"

# Git auto-commit and push
[git]
    autoCommit = true
    autoPush = true

# Diff settings
[diff]
    pager = "delta"

# Merge tool
[merge]
    command = "nvim"
    args = ["-d", "{{ .Destination }}", "{{ .Source }}", "{{ .Target }}"]

# age encryption
[age]
    identity = "~/.config/chezmoi/key.txt"
    recipient = "age1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Machine-Specific Data
```toml
[data]
    email = "user@example.com"
    name = "Your Name"

[data.work]
    proxy = "http://proxy.work.com:8080"
```

Access in templates: `{{ .email }}`, `{{ .work.proxy }}`

## Machine-Specific Configuration

### Config Template (`.chezmoi.toml.tmpl`)
Create in source root for interactive setup:
```toml
[data]
    email = {{ promptString "email" | quote }}
    name = {{ promptString "name" | quote }}
{{- if eq .chezmoi.hostname "work-laptop" }}
    work = true
{{- end }}
```

### Data Files (`.chezmoidata.yaml`)
```yaml
packages:
  common:
    - git
    - tmux
    - neovim
  work:
    - docker
    - kubectl
```

Access: `{{ .packages.common }}`

### Conditional File Inclusion (`.chezmoiignore`)
```
# Ignore on non-Linux
{{ if ne .chezmoi.os "linux" }}
.config/i3/
.xinitrc
{{ end }}

# Ignore work config on personal machines
{{ if not .work }}
.config/work/
{{ end }}
```

## Scripts

### Install Packages (run_onchange)
```bash
#!/bin/bash
# run_onchange_install-packages.sh.tmpl

{{ if eq .chezmoi.os "darwin" -}}
brew bundle --file=/dev/stdin <<EOF
{{ range .packages.common -}}
brew "{{ . }}"
{{ end -}}
EOF
{{ else if eq .chezmoi.os "linux" -}}
sudo apt-get update
sudo apt-get install -y {{ range .packages.common }}{{ . }} {{ end }}
{{ end -}}
```

### One-Time Setup (run_once)
```bash
#!/bin/bash
# run_once_before_setup-directories.sh

mkdir -p ~/.local/bin
mkdir -p ~/.config
mkdir -p ~/.cache
```

### Trigger on File Change
```bash
#!/bin/bash
# run_onchange_reload-shell.sh.tmpl
# Hash: {{ include "dot_bashrc.tmpl" | sha256sum }}

source ~/.bashrc
```

## Common Patterns

### GitHub SSH Keys
```
# dot_ssh/authorized_keys.tmpl
{{ range gitHubKeys "username" }}
{{ . }}
{{ end }}
```

### Include Partial Templates
```
# .chezmoitemplates/git-config
[user]
    name = {{ .name }}
    email = {{ .email }}

# dot_gitconfig.tmpl
{{ template "git-config" . }}

[core]
    editor = nvim
```

### External Files
```yaml
# .chezmoiexternal.yaml
".vim/autoload/plug.vim":
    type: file
    url: "https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim"
    refreshPeriod: 168h

".oh-my-zsh":
    type: archive
    url: "https://github.com/ohmyzsh/ohmyzsh/archive/master.tar.gz"
    stripComponents: 1
```

## All Commands (56 Total)

**Core**: add, apply, archive, cat, cd, data, diff, edit, forget, init, manage, managed, merge, re-add, remove, source-path, status, target-path, unmanage, unmanaged, update, verify

**Config**: cat-config, dump-config, edit-config, edit-config-template

**Encryption**: age, age-keygen, decrypt, edit-encrypted, encrypt, secret

**Utility**: chattr, completion, destroy, doctor, dump, generate, git, help, ignored, import, license, list, merge-all, purge, ssh, state, upgrade

**Container**: docker

## Troubleshooting

### Check for Issues
```bash
chezmoi doctor
```

### Verbose Output
```bash
chezmoi apply -v
chezmoi diff -v
```

### Dry Run
```bash
chezmoi apply -n  # Preview without changes
```

### Debug Templates
```bash
chezmoi execute-template < file.tmpl
chezmoi cat ~/.config/file  # Show rendered content
```

### Reset State
```bash
chezmoi state delete-bucket --bucket=scriptState  # Re-run scripts
chezmoi forget ~/.config/file  # Stop managing file
```

## When to Use This Skill

- Setting up dotfiles management across machines
- Creating machine-specific configurations with templates
- Encrypting sensitive dotfiles (SSH keys, API tokens)
- Integrating password managers with dotfiles
- Writing install/setup scripts for new machines
- Syncing dotfiles via Git repository
- Managing complex multi-machine configurations

## Resources

- [Official Documentation](https://www.chezmoi.io/)
- [GitHub Repository](https://github.com/twpayne/chezmoi)
- [Quick Start Guide](https://www.chezmoi.io/quick-start/)
- [User Guide](https://www.chezmoi.io/user-guide/)
- [Reference](https://www.chezmoi.io/reference/)
