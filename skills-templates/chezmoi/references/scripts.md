# chezmoi Scripts Reference

Scripts automate tasks during `chezmoi apply`, such as installing packages, reloading configurations, or setting up directories.

## Script Types Overview

| Type | Prefix | Runs When |
|------|--------|-----------|
| Regular | `run_` | Every apply |
| Once | `run_once_` | Once per content version |
| On Change | `run_onchange_` | When script content changes |

## Timing Modifiers

| Modifier | When | Use Case |
|----------|------|----------|
| `before_` | Before file updates | Setup directories, install dependencies |
| `after_` | After file updates | Reload services, compile configs |
| (none) | During file updates | Default behavior |

## Script Requirements

1. **Must have shebang**: `#!/bin/bash`, `#!/usr/bin/env python3`, etc.
2. **Must be executable**: Or in source with `executable_` prefix (automatic)
3. **Should be idempotent**: Safe to run multiple times

## Regular Scripts (`run_`)

Runs every time you execute `chezmoi apply`.

```bash
# run_update-shell.sh
#!/bin/bash
echo "Updating shell..."
source ~/.bashrc
```

**Use for:**
- Always-needed refreshes
- Quick operations
- Status checks

**Caution:** Avoid slow operations in regular scripts.

## Run Once Scripts (`run_once_`)

Runs once per unique script content. chezmoi tracks SHA256 hash.

```bash
# run_once_install-homebrew.sh
#!/bin/bash
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
```

**Hash tracking:**
- Script runs once
- If you modify script, it runs again
- Hash stored in chezmoi state

**Use for:**
- One-time installations
- Initial machine setup
- Creating directories/files

### Reset Run Once Scripts
```bash
# Re-run all run_once scripts
chezmoi state delete-bucket --bucket=scriptState

# Re-run specific script
chezmoi state delete --bucket=scriptState --key=sha256sum-of-script
```

## Run On Change Scripts (`run_onchange_`)

Runs when script content changes.

```bash
# run_onchange_install-packages.sh.tmpl
#!/bin/bash
# Packages: {{ include "dot_config/packages.txt" | sha256sum }}

sudo apt-get update
sudo apt-get install -y $(cat ~/.config/packages.txt)
```

**Trigger change detection:**
Include dependent file hashes in comments:
```bash
# Hash: {{ include "dot_bashrc.tmpl" | sha256sum }}
```

**Use for:**
- Package installation based on package list
- Config reloading when config changes
- Compilation/build steps

## Before/After Scripts

### Before Scripts
Run before any files are updated.

```bash
# run_once_before_create-directories.sh
#!/bin/bash
mkdir -p ~/.local/bin
mkdir -p ~/.config
mkdir -p ~/.cache
mkdir -p ~/projects
```

```bash
# run_once_before_install-package-manager.sh.tmpl
#!/bin/bash
{{ if eq .chezmoi.os "darwin" }}
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
{{ end }}
```

### After Scripts
Run after all files are updated.

```bash
# run_after_reload-shell.sh
#!/bin/bash
if [ -n "$BASH_VERSION" ]; then
    source ~/.bashrc
fi
```

```bash
# run_onchange_after_compile-terminfo.sh.tmpl
#!/bin/bash
# Terminfo: {{ include "dot_terminfo/tmux-256color.src" | sha256sum }}

tic -x ~/.terminfo/tmux-256color.src
```

## Template Scripts

Add `.tmpl` suffix to process as Go template.

```bash
# run_onchange_install-packages.sh.tmpl
#!/bin/bash

{{ if eq .chezmoi.os "darwin" -}}
brew bundle --file=/dev/stdin <<EOF
{{ range .packages.darwin -}}
brew "{{ . }}"
{{ end -}}
EOF
{{ else if eq .chezmoi.os "linux" -}}
{{ if eq .chezmoi.osRelease.id "ubuntu" -}}
sudo apt-get update
sudo apt-get install -y {{ range .packages.linux }}{{ . }} {{ end }}
{{ else if eq .chezmoi.osRelease.id "fedora" -}}
sudo dnf install -y {{ range .packages.linux }}{{ . }} {{ end }}
{{ else if eq .chezmoi.osRelease.id "arch" -}}
sudo pacman -Syu --noconfirm {{ range .packages.linux }}{{ . }} {{ end }}
{{ end -}}
{{ end -}}
```

### Skip Script Conditionally
Empty template output skips script execution:

```bash
# run_onchange_linux-only.sh.tmpl
{{ if ne .chezmoi.os "linux" }}
{{/* Skip on non-Linux */}}
{{ else }}
#!/bin/bash
echo "Running Linux-specific setup..."
{{ end }}
```

## Script Naming Examples

| Filename | Behavior |
|----------|----------|
| `run_setup.sh` | Runs every apply |
| `run_once_install.sh` | Runs once |
| `run_onchange_reload.sh` | Runs when content changes |
| `run_before_prepare.sh` | Runs before file updates |
| `run_after_cleanup.sh` | Runs after file updates |
| `run_once_before_deps.sh` | Once, before files |
| `run_onchange_after_compile.sh` | On change, after files |
| `run_once_before_install.sh.tmpl` | Template, once, before |

## Execution Order

Scripts execute in this order:

1. `run_*_before_*` scripts (alphabetically)
2. File updates
3. `run_*_after_*` scripts (alphabetically)
4. Regular `run_*` scripts (alphabetically)

Within each category, scripts run in alphabetical order.

### Control Order with Prefixes
```
run_once_before_01-create-dirs.sh
run_once_before_02-install-brew.sh
run_once_before_03-install-packages.sh
```

## Practical Examples

### Complete Machine Setup
```bash
# run_once_before_00-directories.sh
#!/bin/bash
mkdir -p ~/.local/bin
mkdir -p ~/.config
mkdir -p ~/.ssh && chmod 700 ~/.ssh
```

```bash
# run_once_before_01-homebrew.sh.tmpl
#!/bin/bash
{{ if eq .chezmoi.os "darwin" -}}
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi
{{ end -}}
```

```bash
# run_once_before_02-packages.sh.tmpl
#!/bin/bash
{{ if eq .chezmoi.os "darwin" -}}
brew install git neovim tmux ripgrep fd
{{ else if eq .chezmoi.os "linux" -}}
sudo apt-get update
sudo apt-get install -y git neovim tmux ripgrep fd-find
{{ end -}}
```

### Package List Syncing
```yaml
# .chezmoidata.yaml
packages:
  common:
    - git
    - neovim
    - tmux
    - ripgrep
  darwin:
    - coreutils
    - gnu-sed
  linux:
    - build-essential
```

```bash
# run_onchange_install-packages.sh.tmpl
#!/bin/bash
# Packages hash: {{ include ".chezmoidata.yaml" | sha256sum }}

{{ if eq .chezmoi.os "darwin" -}}
brew install {{ range .packages.common }}{{ . }} {{ end }}{{ range .packages.darwin }}{{ . }} {{ end }}
{{ else if eq .chezmoi.os "linux" -}}
sudo apt-get install -y {{ range .packages.common }}{{ . }} {{ end }}{{ range .packages.linux }}{{ . }} {{ end }}
{{ end -}}
```

### Neovim Plugin Installation
```bash
# run_onchange_after_nvim-plugins.sh.tmpl
#!/bin/bash
# Config hash: {{ include "dot_config/nvim/init.lua" | sha256sum }}

if command -v nvim &> /dev/null; then
    nvim --headless "+Lazy! sync" +qa
fi
```

### SSH Key Permissions
```bash
# run_after_ssh-permissions.sh
#!/bin/bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_* 2>/dev/null || true
chmod 644 ~/.ssh/*.pub 2>/dev/null || true
chmod 600 ~/.ssh/config 2>/dev/null || true
```

### Shell Completion
```bash
# run_onchange_after_completions.sh.tmpl
#!/bin/bash
{{ if eq .chezmoi.os "darwin" -}}
# Zsh completions
if [ -d /opt/homebrew/share/zsh/site-functions ]; then
    chezmoi completion zsh > /opt/homebrew/share/zsh/site-functions/_chezmoi
fi
{{ end -}}
```

## Script Location

Scripts can be placed:
1. **Root of source directory**: `~/.local/share/chezmoi/run_*.sh`
2. **`.chezmoiscripts/` directory**: `~/.local/share/chezmoi/.chezmoiscripts/run_*.sh`

The `.chezmoiscripts/` directory keeps the source root cleaner.

## Debugging Scripts

### Verbose Output
```bash
chezmoi apply --verbose
```

### Debug Mode
```bash
chezmoi apply --debug
```

### Dry Run (Don't Execute)
```bash
chezmoi apply --dry-run
```

### View Script Contents
```bash
# See rendered template
chezmoi execute-template < run_script.sh.tmpl
```

### Test Script Independently
```bash
chezmoi cd
./run_once_setup.sh  # Test directly
```

## Best Practices

1. **Make scripts idempotent**: Check before installing/creating
2. **Use `run_once_` for slow operations**: Avoids reinstalling
3. **Include hashes for dependencies**: `{{ include "file" | sha256sum }}`
4. **Order scripts numerically**: `01-`, `02-`, `03-`
5. **Handle missing commands**: `if command -v foo &> /dev/null`
6. **Log progress**: Help debug issues
7. **Test templates**: Use `execute-template` before applying
8. **Use `.chezmoiscripts/`**: Keep source directory clean
