# chezmoi Source State Attributes

Reference for file naming conventions and attributes in the source directory.

## Overview

chezmoi uses special prefixes and suffixes in filenames to control how files are managed. The source directory (`~/.local/share/chezmoi`) contains files with these attributes, which are translated to target files in your home directory.

## File Attributes

### `dot_` - Hidden Files
Adds a leading period to the target filename.

| Source | Target |
|--------|--------|
| `dot_bashrc` | `.bashrc` |
| `dot_config/` | `.config/` |
| `dot_ssh/config` | `.ssh/config` |

### `private_` - Private Permissions
Sets mode to 0700 (directories) or 0600 (files), removing group and world access.

| Source | Target Permissions |
|--------|-------------------|
| `private_dot_ssh/` | `.ssh/` (0700) |
| `private_dot_netrc` | `.netrc` (0600) |

### `executable_` - Executable
Sets the executable bit (+x) on the target file.

| Source | Target |
|--------|--------|
| `executable_dot_local/bin/script` | `.local/bin/script` (0755) |
| `private_executable_dot_local/bin/secure-script` | `.local/bin/secure-script` (0700) |

### `readonly_` - Read-Only
Removes write permissions from the target.

| Source | Target Permissions |
|--------|-------------------|
| `readonly_dot_config` | `.config` (0444 or 0555) |

### `empty_` - Empty Files
Allows empty files to be managed (normally empty files are ignored).

| Source | Target |
|--------|--------|
| `empty_dot_gitkeep` | `.gitkeep` (empty file) |

### `encrypted_` - Encrypted Files
File is stored encrypted in source and decrypted when applied.

| Source | Target |
|--------|--------|
| `encrypted_private_dot_ssh/id_rsa` | `.ssh/id_rsa` (decrypted) |
| `encrypted_dot_config/secrets.yaml` | `.config/secrets.yaml` (decrypted) |

### `create_` - Create Only
File is only created if it doesn't exist; existing files are not modified.

| Source | Behavior |
|--------|----------|
| `create_dot_config/app/settings.json` | Only created if missing |

### `modify_` - Modify Scripts
Script that modifies existing file content. Receives current content on stdin, outputs modified content.

| Source | Behavior |
|--------|----------|
| `modify_dot_bashrc` | Modifies existing `.bashrc` |
| `modify_private_dot_ssh/config` | Modifies existing `.ssh/config` |

### `remove_` - Remove Files
Removes the target file from the destination.

| Source | Target |
|--------|--------|
| `remove_dot_old_config` | `.old_config` (removed) |

### `symlink_` - Symbolic Links
Creates a symbolic link to the specified target.

| Source | Target |
|--------|--------|
| `symlink_dot_vimrc` | `.vimrc` → target path in file |
| `symlink_dot_config/nvim` | `.config/nvim` → target path |

Symlink content is the link target path.

## Directory Attributes

### `exact_` - Exact Directories
Removes any files in target directory that aren't in source. Use with caution.

| Source | Behavior |
|--------|----------|
| `exact_dot_config/app/` | Only keeps files defined in source |

### `private_` and `readonly_`
Work the same as file attributes:

```
private_dot_ssh/
readonly_dot_config/important/
private_readonly_dot_secrets/
```

## Template Suffix

### `.tmpl` - Template Processing
Files with `.tmpl` suffix are processed as Go templates before being written.

| Source | Target |
|--------|--------|
| `dot_gitconfig.tmpl` | `.gitconfig` (rendered) |
| `private_dot_ssh/config.tmpl` | `.ssh/config` (rendered) |
| `executable_dot_local/bin/script.tmpl` | `.local/bin/script` (rendered) |

## Script Attributes

### `run_` - Run Scripts
Scripts executed during `chezmoi apply`.

| Source | Behavior |
|--------|----------|
| `run_setup.sh` | Runs every apply |

### `run_once_` - Run Once
Script runs only once, tracked by content hash.

| Source | Behavior |
|--------|----------|
| `run_once_install-packages.sh` | Runs once per content version |

### `run_onchange_` - Run on Change
Script runs when its content changes.

| Source | Behavior |
|--------|----------|
| `run_onchange_reload-config.sh` | Runs when script changes |

### `before_` and `after_` - Timing
Controls when scripts run relative to file updates.

| Source | Behavior |
|--------|----------|
| `run_once_before_setup.sh` | Runs before file updates |
| `run_after_cleanup.sh` | Runs after file updates |

### Combined Script Attributes
```
run_once_before_install-password-manager.sh
run_onchange_after_reload-shell.sh.tmpl
```

## Attribute Combinations

Attributes can be combined in this order:
```
[create_|modify_|remove_|symlink_][encrypted_][private_][readonly_][empty_][executable_][once_|onchange_][before_|after_]dot_filename[.tmpl]
```

### Examples

| Source | Target | Description |
|--------|--------|-------------|
| `private_executable_dot_local/bin/script` | `.local/bin/script` (0700) | Private executable |
| `encrypted_private_dot_ssh/id_rsa` | `.ssh/id_rsa` | Encrypted private file |
| `readonly_dot_config/locked.conf` | `.config/locked.conf` (0444) | Read-only config |
| `create_empty_dot_gitkeep` | `.gitkeep` | Create empty file if missing |
| `exact_private_dot_ssh/` | `.ssh/` | Private dir, remove extras |
| `run_once_before_install.sh.tmpl` | (script) | Template script, run once before |

## Special Files

### `.chezmoi.toml.tmpl`
Configuration template, executed during `chezmoi init`.

### `.chezmoiignore`
Patterns for files to ignore (supports templates).

```
README.md
LICENSE
*.bak
{{ if ne .chezmoi.os "linux" }}
.config/i3/
{{ end }}
```

### `.chezmoiremove`
Patterns for files to remove from target.

```
.old_bashrc
.deprecated/
```

### `.chezmoiexternal.yaml` / `.chezmoiexternal.toml`
External files to download.

```yaml
".vim/autoload/plug.vim":
    type: file
    url: "https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim"
    refreshPeriod: 168h
```

### `.chezmoitemplates/`
Directory containing reusable template partials.

```
.chezmoitemplates/
├── git-user
├── shell-aliases
└── common-exports
```

### `.chezmoidata.yaml` / `.chezmoidata.toml` / `.chezmoidata.json`
Custom data accessible in templates.

```yaml
packages:
  common:
    - git
    - tmux
  work:
    - docker
```

### `.chezmoiscripts/`
Alternative location for scripts (keeps source root cleaner).

### `.chezmoiversion`
Minimum chezmoi version required.

```
2.40.0
```

## File Transformation

### Name Transformation Examples

| Source State | Target State |
|--------------|--------------|
| `dot_bashrc` | `.bashrc` |
| `dot_config/nvim/init.lua` | `.config/nvim/init.lua` |
| `private_dot_ssh/config` | `.ssh/config` |
| `executable_dot_local/bin/myscript` | `.local/bin/myscript` |
| `symlink_dot_vimrc` | `.vimrc` (symlink) |
| `run_once_setup.sh` | (executed, not installed) |
| `dot_gitconfig.tmpl` | `.gitconfig` (rendered) |

### Permission Transformation

| Attribute | Default Mode | With private_ | With executable_ |
|-----------|-------------|---------------|------------------|
| File | 0644 | 0600 | 0755 |
| Directory | 0755 | 0700 | N/A |
| With readonly_ | 0444 | 0400 | 0555 |

## Best Practices

1. **Use `private_` for sensitive files**: SSH keys, credentials, tokens
2. **Use `encrypted_` for secrets in public repos**: API keys, passwords
3. **Use `create_` for user-customizable files**: Prevent overwriting manual changes
4. **Use `exact_` sparingly**: Can delete unexpected files
5. **Use `.tmpl` for machine-specific config**: OS, hostname, email
6. **Use `run_once_` for package installation**: Avoids reinstalling every apply
7. **Use `run_onchange_` for config reloading**: Only runs when config changes
