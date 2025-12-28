# Just Command Runner - Complete Reference

## Overview

`just` is a command runner that saves and executes project-specific commands stored in a `justfile`. It's inspired by `make` but designed as a general-purpose task executor rather than a build system.

## Key Features

### Core Strengths
- Avoids `make`'s complexity—no `.PHONY` declarations needed
- Cross-platform support (Linux, macOS, Windows, BSD)
- Specific, informative error messages with source context
- Static error detection for unknown recipes and circular dependencies
- Automatic `.env` file loading
- Recipes callable from any subdirectory

### Language & Execution
- Support for arbitrary languages via shebang recipes
- Recipes in Python, Node.js, Perl, Ruby, Nushell, and more
- Command-line argument passing to recipes
- Variable substitution with `{{…}}` syntax

## Installation Methods

### Package Managers
- **Cargo**: `cargo install just`
- **Homebrew**: `brew install just`
- **apt**: Available in Debian/Ubuntu repositories
- **pacman**: Available in Arch Linux
- **dnf**: Available in Fedora
- **Plus**: 15+ other package managers across Linux, macOS, Windows, and BSD systems

### Pre-built Binaries
Available for Linux, macOS, and Windows from GitHub releases:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to DEST
```

### GitHub Actions
Use `extractions/setup-just` or `taiki-e/install-action`.

## Basic Syntax

### Minimal Justfile

```just
recipe-name:
  echo 'This is a recipe!'

another-recipe:
  @echo 'This is another recipe.'
```

**Notes**:
- Lines prefixed with `@` suppress echoing
- Lines without `@` print before execution
- Recipes are indented with tabs or spaces (consistent within file)

## Recipe Features

### Dependencies

Recipes can depend on other recipes, which execute first:

```just
build:
  cc main.c -o main

test: build
  ./test
```

### Parameters

Recipes accept command-line arguments with default values:

```just
build target='all':
  @echo 'Building {{target}}…'

# Variadic support
deploy *services:
  @echo 'Deploying: {{services}}'
```

**Parameter Types**:
- Required parameters: `param`
- Optional with default: `param='value'`
- Variadic (zero or more): `*params`
- Variadic (one or more): `+params`

### Attributes

Recipes support metadata for behavior control:

- `[default]` — Runs when no recipe specified
- `[private]` — Hide from `--list` output
- `[confirm]` — Require confirmation before running
- `[linux]`, `[macos]`, `[windows]` — Platform-specific
- `[no-cd]` — Don't change directory before executing
- `[no-exit-message]` — Suppress exit error messages

Example:
```just
[default]
build:
  cargo build --release

[confirm]
deploy:
  kubectl apply -f production.yaml

[linux]
install:
  apt-get install my-package
```

## Variables & Expressions

### Assignment

Variables use `:=` syntax:

```just
compiler := 'gcc'
flags := '-Wall -O2'

build:
  {{compiler}} {{flags}} main.c -o main
```

**Supported Operations**:
- Concatenation with `+`
- Path joining with `/`
- Backtick command evaluation: `` `command` ``
- Conditional expressions: `if condition { value } else { other }`

### String Interpolation

```just
name := 'world'
greeting := 'Hello, ' + name + '!'

greet:
  @echo '{{greeting}}'
```

### Built-in Functions

Over 50 functions available:

**System Info**:
- `arch()` — CPU architecture
- `os()` — Operating system
- `num_cpus()` — Number of logical CPUs

**Path Manipulation**:
- `absolute_path(path)` — Convert to absolute path
- `canonicalize(path)` — Resolve all symbolic links
- `parent_directory(path)` — Parent directory
- `file_name(path)` — File name component
- `extension(path)` — File extension

**String Operations**:
- `uppercase(s)` — Convert to uppercase
- `lowercase(s)` — Convert to lowercase
- `replace(s, from, to)` — Replace substring
- `trim(s)` — Remove whitespace
- `join(sep, values...)` — Join strings

**Hashing**:
- `sha256(s)` — SHA-256 hash
- `blake3(s)` — BLAKE3 hash

**Environment**:
- `env(key)` — Get environment variable (error if missing)
- `env(key, default)` — Get with default value

**And many more**: See official documentation for complete list

## Advanced Features

### Shebang Recipes

Execute recipes in different languages:

```just
python:
  #!/usr/bin/env python3
  print('Hello from Python!')

node:
  #!/usr/bin/env node
  console.log('Hello from Node!');

ruby:
  #!/usr/bin/env ruby
  puts "Hello from Ruby!"
```

### Script Recipes

`[script]` attribute avoids shebang limitations on Windows:

```just
[script('python')]
analyze:
  import sys
  print(f"Analyzing with Python {sys.version}")
```

### Modules

Submodules via `mod` statements organize complex projects:

```justfile
mod foo

a: foo::b
```

**In `foo.just`**:
```just
b:
  echo "Running foo::b"
```

### Imports

Include external justfiles:

```just
import 'common-tasks.just'

# Optional imports (don't error if missing)
import? 'local-overrides.just'
```

## Settings

Global configuration options control behavior:

```just
# Set default shell
set shell := ["bash", "-uc"]

# Windows-specific shell
set windows-shell := ["powershell.exe", "-Command"]

# Auto-load .env files
set dotenv-load

# Export all variables as environment vars
set export

# Use positional arguments ($1, $2, etc.)
set positional-arguments

# Other settings
set allow-duplicate-recipes  # Allow recipe redefinition
set ignore-comments          # Don't treat '#' as comments in recipes
```

## Command-Line Usage

### Common Commands

**Run Recipes**:
- `just` — Run default recipe
- `just RECIPE` — Run specific recipe
- `just RECIPE ARG1 ARG2` — Pass arguments

**List & Inspect**:
- `just --list` — List all recipes
- `just --list --unsorted` — List in source order
- `just --show RECIPE` — Display recipe definition
- `just --choose` — Interactive selector (requires fzf)
- `just --dump` — Output formatted justfile

**Formatting & Validation**:
- `just --fmt` — Format justfile canonically
- `just --fmt --check` — Check if formatted correctly

**Help & Documentation**:
- `just --help` — Show help
- `just --man` — Display man page
- `just --changelog` — Show changelog

### Command-Line Options

**File Location**:
- `-f/--justfile PATH` — Specify justfile location
- `-d/--working-directory DIR` — Set working directory

**Variables**:
- `--set VAR VALUE` — Override variable
- `--dotenv-filename FILE` — Use specific .env file
- `--dotenv-path DIR` — Search for .env in specific directory

**Execution Control**:
- `--dry-run` — Print commands without executing
- `--timestamp` — Print timestamps before commands
- `--verbose` — Show more output
- `--quiet` — Suppress output
- `--yes` — Auto-confirm prompts

**Recipe Selection**:
- `--choose` — Interactive chooser
- `--chooser COMMAND` — Use custom chooser
- `--list-prefix PREFIX` — Filter recipes by prefix

## Environment & Configuration

### .env File Support

With `set dotenv-load`, environment variables load from `.env` files:

```just
set dotenv-load

deploy:
  @echo "Deploying to {{env('ENVIRONMENT', 'staging')}}"
```

**.env file**:
```env
ENVIRONMENT=production
API_KEY=secret123
```

### Export Variables

Make variables available to recipes as environment variables:

**Option 1**: Global export setting
```just
set export

var := 'value'

recipe:
  echo $var  # Available as environment variable
```

**Option 2**: Per-variable export
```just
export VAR := 'value'

recipe:
  echo $VAR
```

**Option 3**: $ prefix
```just
$VAR := 'value'

recipe:
  echo $VAR
```

### Shell Configuration

Override default shell per-platform:

```just
# Unix-like systems
set shell := ["bash", "-uc"]

# Windows
set windows-shell := ["powershell.exe", "-Command"]

# Custom shell with specific options
set shell := ["zsh", "-euo", "pipefail", "-c"]
```

## Editor Support

Syntax highlighting available for:

- **Vim/Neovim**: Built-in since version 9.1.1042/0.11
- **Emacs**: `just-mode` package
- **VS Code**: Community extension
- **JetBrains IDEs**: Plugin available
- **Helix**: Built-in since 23.05
- **Zed**: Built-in support
- **Sublime Text**: Package available
- **Kakoune**: Built-in support
- **Micro**: Plugin available

## Stability & Compatibility

Version 1.0+ guarantees **strong backwards compatibility**:
- No breaking changes to existing `justfile`s
- Unstable features require opt-in with `--unstable` flag
- Use `set unstable` or `JUST_UNSTABLE` environment variable for unstable features

## Examples

### Development Workflow

```just
# Default: Run tests
[default]
test: build
  cargo test

# Build the project
build:
  cargo build --release

# Run the application
run *args:
  cargo run -- {{args}}

# Format code
fmt:
  cargo fmt

# Check code
check:
  cargo check
  cargo clippy

# Clean build artifacts
clean:
  cargo clean
```

### Docker Workflow

```just
# Variables
image := 'myapp'
tag := `git describe --tags --always`

# Build Docker image
build:
  docker build -t {{image}}:{{tag}} .
  docker tag {{image}}:{{tag}} {{image}}:latest

# Run container
run port='3000':
  docker run -p {{port}}:3000 {{image}}:latest

# Push to registry
[confirm]
push:
  docker push {{image}}:{{tag}}
  docker push {{image}}:latest

# Clean up
clean:
  docker rmi {{image}}:{{tag}} {{image}}:latest
```

### Multi-Environment Deployment

```just
set dotenv-load

# Deploy to environment
deploy env='staging':
  #!/usr/bin/env bash
  set -euxo pipefail

  if [ "{{env}}" = "production" ]; then
    kubectl apply -f k8s/production/ --context=prod
  else
    kubectl apply -f k8s/staging/ --context=staging
  fi

# Database migration
[confirm]
migrate env='staging':
  DATABASE_URL={{env('DATABASE_URL_' + uppercase(env))}} \
    diesel migration run
```

## Additional Resources

- **Official Book**: https://just.systems/man/en/
- **Examples**: https://github.com/casey/just/tree/master/examples
- **Grammar**: Available in GRAMMAR.md in the repository
- **Man Page**: `just --man`
- **Changelog**: `just --changelog`

## Best Practices

1. **Use descriptive recipe names**: `deploy-production` not `dp`
2. **Add comments**: Explain complex recipes
3. **Set default recipe**: Makes `just` command useful
4. **Use .env for secrets**: Don't commit secrets to version control
5. **Platform-specific recipes**: Use `[linux]`, `[macos]`, `[windows]` attributes
6. **Confirm dangerous operations**: Use `[confirm]` attribute
7. **Format your justfile**: Run `just --fmt` regularly
8. **Hide internal recipes**: Use `[private]` for implementation details
9. **Use modules**: Organize large projects into separate files
10. **Document parameters**: Add comments for recipe arguments

## Common Patterns

### Task Automation
```just
# Install dependencies
install:
  npm install
  pip install -r requirements.txt

# Start development server
dev:
  npm run dev & python manage.py runserver
```

### Release Management
```just
# Bump version and create tag
release version:
  echo "{{version}}" > VERSION
  git add VERSION
  git commit -m "Release {{version}}"
  git tag -a "v{{version}}" -m "Release {{version}}"
  git push && git push --tags
```

### Testing
```just
# Run all tests
test-all: test-unit test-integration test-e2e

test-unit:
  pytest tests/unit/

test-integration:
  pytest tests/integration/

test-e2e:
  playwright test
```
