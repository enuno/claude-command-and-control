# chezmoi Commands Reference

Complete reference for all 56 chezmoi commands.

## Getting Started Commands

### `chezmoi init`
Initialize chezmoi on a new machine.

```bash
# Basic initialization
chezmoi init

# From GitHub (shorthand for repos named "dotfiles")
chezmoi init $GITHUB_USERNAME

# From any Git URL
chezmoi init https://github.com/user/dotfiles.git

# Initialize and apply immediately
chezmoi init --apply $GITHUB_USERNAME

# Initialize with verbose output
chezmoi init --apply --verbose $GITHUB_USERNAME
```

### `chezmoi doctor`
Check for common problems and configuration issues.

```bash
chezmoi doctor
```

Checks: Git installation, editor availability, encryption tools, source directory status.

## Daily Operations

### `chezmoi add`
Add a file from home directory to source state.

```bash
# Basic add
chezmoi add ~/.bashrc

# Add as template
chezmoi add --template ~/.bashrc

# Add with encryption
chezmoi add --encrypt ~/.ssh/id_rsa

# Add entire directory
chezmoi add ~/.config/nvim/

# Add and follow symlinks
chezmoi add --follow ~/.config/link
```

### `chezmoi edit`
Edit the source version of a managed file.

```bash
# Edit file
chezmoi edit ~/.bashrc

# Edit and apply changes immediately
chezmoi edit --apply ~/.bashrc

# Edit with specific diff tool
chezmoi edit --diff ~/.bashrc
```

### `chezmoi apply`
Update dotfiles from source state.

```bash
# Apply all changes
chezmoi apply

# Verbose mode
chezmoi apply -v

# Dry run (preview only)
chezmoi apply -n

# Apply specific file
chezmoi apply ~/.bashrc

# Apply without running scripts
chezmoi apply --exclude=scripts

# Force apply (skip prompts)
chezmoi apply --force
```

### `chezmoi diff`
Show differences between target and source state.

```bash
# Show all diffs
chezmoi diff

# Diff specific file
chezmoi diff ~/.bashrc

# Use pager
chezmoi diff --pager less

# Reverse diff direction
chezmoi diff --reverse
```

### `chezmoi status`
Show what would change on next apply.

```bash
chezmoi status
```

Output codes:
- `A` - Added
- `D` - Deleted
- `M` - Modified
- `R` - Run script

### `chezmoi update`
Pull changes from remote and apply.

```bash
# Update from remote
chezmoi update

# Verbose update
chezmoi update -v

# Update without applying
chezmoi update --apply=false
```

### `chezmoi cd`
Open a subshell in the source directory.

```bash
chezmoi cd
# Now in ~/.local/share/chezmoi
git status
git add .
git commit -m "Update"
git push
exit  # Return to previous directory
```

## File Management

### `chezmoi cat`
Print target contents of a file (renders templates).

```bash
chezmoi cat ~/.bashrc
chezmoi cat ~/.config/git/config
```

### `chezmoi forget`
Stop managing a file (remove from source state).

```bash
chezmoi forget ~/.bashrc
chezmoi forget ~/.config/nvim/
```

### `chezmoi remove` / `chezmoi rm`
Remove a target from both source and destination.

```bash
chezmoi remove ~/.old_config
chezmoi rm ~/.deprecated_file
```

### `chezmoi re-add`
Re-add modified target files to source state.

```bash
# Re-add specific file
chezmoi re-add ~/.bashrc

# Re-add all modified files
chezmoi re-add
```

### `chezmoi merge`
Merge changes between source and target.

```bash
chezmoi merge ~/.bashrc
```

### `chezmoi merge-all`
Merge all files with conflicts.

```bash
chezmoi merge-all
```

### `chezmoi manage` / `chezmoi managed`
List or check managed files.

```bash
# List all managed files
chezmoi managed

# Check if file is managed
chezmoi manage ~/.bashrc

# List with include filter
chezmoi managed --include=files

# List with exclude filter
chezmoi managed --exclude=dirs
```

### `chezmoi unmanage` / `chezmoi unmanaged`
Stop managing or list unmanaged files.

```bash
# Stop managing file
chezmoi unmanage ~/.bashrc

# List unmanaged files in home
chezmoi unmanaged
```

### `chezmoi chattr`
Change source file attributes.

```bash
# Make file a template
chezmoi chattr +template ~/.bashrc

# Remove template attribute
chezmoi chattr -template ~/.bashrc

# Make executable
chezmoi chattr +executable ~/.local/bin/script

# Make private
chezmoi chattr +private ~/.ssh/config

# Multiple attributes
chezmoi chattr +private,+template ~/.config/secrets
```

Attributes: `after`, `before`, `create`, `empty`, `encrypted`, `exact`, `executable`, `external`, `once`, `onchange`, `private`, `readonly`, `remove`, `script`, `symlink`, `template`

## Path Commands

### `chezmoi source-path`
Print source path for a target.

```bash
chezmoi source-path ~/.bashrc
# Output: /home/user/.local/share/chezmoi/dot_bashrc
```

### `chezmoi target-path`
Print target path for a source file.

```bash
chezmoi target-path dot_bashrc
# Output: /home/user/.bashrc
```

## Configuration Commands

### `chezmoi cat-config`
Print current configuration.

```bash
chezmoi cat-config
```

### `chezmoi dump-config`
Dump configuration in JSON format.

```bash
chezmoi dump-config
chezmoi dump-config --format=yaml
```

### `chezmoi edit-config`
Edit the configuration file.

```bash
chezmoi edit-config
```

### `chezmoi edit-config-template`
Edit the configuration template.

```bash
chezmoi edit-config-template
```

## Template Commands

### `chezmoi data`
Print available template data.

```bash
chezmoi data
chezmoi data --format=json
chezmoi data --format=yaml
```

### `chezmoi execute-template`
Execute a template and print output.

```bash
# From string
chezmoi execute-template '{{ .chezmoi.hostname }}'

# From file
chezmoi execute-template < template.tmpl

# With init flag (simulate init)
chezmoi execute-template --init '{{ promptString "email" }}'
```

### `chezmoi dump`
Dump target state as JSON.

```bash
chezmoi dump ~/.bashrc
chezmoi dump --format=yaml
```

## Encryption Commands

### `chezmoi encrypt`
Encrypt a file.

```bash
chezmoi encrypt ~/.ssh/id_rsa
```

### `chezmoi decrypt`
Decrypt a file.

```bash
chezmoi decrypt encrypted_file
```

### `chezmoi edit-encrypted`
Edit an encrypted file (decrypt, edit, re-encrypt).

```bash
chezmoi edit-encrypted ~/.ssh/id_rsa
```

### `chezmoi age`
Execute age command.

```bash
chezmoi age encrypt file.txt
chezmoi age decrypt file.txt.age
```

### `chezmoi age-keygen`
Generate age key.

```bash
chezmoi age-keygen
chezmoi age-keygen -o ~/.config/chezmoi/key.txt
```

### `chezmoi secret`
Run secret manager commands.

```bash
chezmoi secret keyring get --service=chezmoi --user=config
chezmoi secret keyring set --service=chezmoi --user=config
```

## Utility Commands

### `chezmoi archive`
Create archive of target state.

```bash
chezmoi archive
chezmoi archive --format=tar.gz
chezmoi archive --output=dotfiles.tar.gz
```

### `chezmoi completion`
Generate shell completion script.

```bash
# Bash
chezmoi completion bash > ~/.local/share/bash-completion/completions/chezmoi

# Zsh
chezmoi completion zsh > "${fpath[1]}/_chezmoi"

# Fish
chezmoi completion fish > ~/.config/fish/completions/chezmoi.fish

# PowerShell
chezmoi completion powershell > chezmoi.ps1
```

### `chezmoi destroy`
Remove all managed targets.

```bash
chezmoi destroy
chezmoi destroy --force  # Skip confirmation
```

### `chezmoi generate`
Generate initial config or gitignore.

```bash
chezmoi generate gitignore
```

### `chezmoi git`
Run git command in source directory.

```bash
chezmoi git status
chezmoi git add .
chezmoi git commit -m "Update"
chezmoi git push
```

### `chezmoi ignored`
Print ignored targets.

```bash
chezmoi ignored
```

### `chezmoi import`
Import archive into source state.

```bash
chezmoi import archive.tar.gz
chezmoi import --destination=~/.config archive.tar.gz
```

### `chezmoi list`
List targets or sources.

```bash
chezmoi list
chezmoi list --include=files
chezmoi list --exclude=dirs
```

### `chezmoi purge`
Purge chezmoi configuration and data.

```bash
chezmoi purge
chezmoi purge --force
```

### `chezmoi state`
Manage chezmoi state.

```bash
# Show state
chezmoi state dump

# Delete script state (re-run scripts)
chezmoi state delete-bucket --bucket=scriptState

# Reset all state
chezmoi state reset
```

### `chezmoi verify`
Verify target matches source.

```bash
chezmoi verify
chezmoi verify ~/.bashrc
```

### `chezmoi upgrade`
Upgrade chezmoi to latest version.

```bash
chezmoi upgrade
```

### `chezmoi help`
Print help for any command.

```bash
chezmoi help
chezmoi help add
chezmoi help --all
```

### `chezmoi license`
Print license information.

```bash
chezmoi license
```

### `chezmoi docker`
Run chezmoi in Docker container.

```bash
chezmoi docker
```

### `chezmoi ssh`
Run SSH with chezmoi configuration.

```bash
chezmoi ssh hostname
```

## Global Flags

Available for all commands:

| Flag | Description |
|------|-------------|
| `--cache` | Set cache directory |
| `--color` | Enable/disable color output |
| `--config` | Set config file path |
| `--config-format` | Set config file format |
| `--debug` | Enable debug logging |
| `--destination` | Set destination directory |
| `--dry-run`, `-n` | Preview without changes |
| `--force` | Skip confirmation prompts |
| `--keep-going`, `-k` | Continue on errors |
| `--mode` | Set mode (file, symlink) |
| `--no-pager` | Disable pager |
| `--no-tty` | Disable TTY |
| `--output`, `-o` | Set output file |
| `--persistent-state` | Set state file path |
| `--progress` | Show progress |
| `--safe` | Disable destructive operations |
| `--source` | Set source directory |
| `--use-builtin-age` | Use built-in age |
| `--use-builtin-git` | Use built-in git |
| `--verbose`, `-v` | Enable verbose output |
| `--working-tree` | Set working tree |
