# Setup Claude CLI Action

A composite GitHub Action for installing and authenticating the Claude CLI in GitHub Actions workflows.

## Features

- 🚀 Automatic Claude CLI installation
- 🔐 Secure API key configuration
- 💾 Caching support for faster runs
- 🔍 OS and architecture detection
- ✅ Installation verification

## Usage

### Basic Example

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Setup Claude CLI
    uses: ./.github/actions/setup-claude
    with:
      anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}

  - name: Run Claude Command
    run: |
      claude --version
      # Run your Claude commands here
```

### Advanced Example with Caching

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Setup Claude CLI
    uses: ./.github/actions/setup-claude
    with:
      anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
      claude-version: 'latest'
      cache-enabled: 'true'

  - name: Invoke Maintenance Scan
    run: |
      claude command /maintenance-scan
```

## Inputs

### `anthropic-api-key` (required)

Anthropic API key for authenticating Claude CLI.

**Example:**
```yaml
anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### `claude-version` (optional)

Version of Claude CLI to install. Defaults to `'latest'`.

**Example:**
```yaml
claude-version: '1.2.3'
```

### `cache-enabled` (optional)

Enable caching of Claude CLI installation. Defaults to `'true'`.

Set to `'false'` to disable caching (useful for debugging).

**Example:**
```yaml
cache-enabled: 'false'
```

## Outputs

### `claude-version`

The installed version of Claude CLI.

**Example:**
```yaml
- name: Setup Claude CLI
  id: setup-claude
  uses: ./.github/actions/setup-claude
  with:
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}

- name: Display Version
  run: echo "Installed Claude CLI version: ${{ steps.setup-claude.outputs.claude-version }}"
```

### `cache-hit`

Boolean indicating whether the cache was restored (`'true'`) or not (`'false'`).

**Example:**
```yaml
- name: Setup Claude CLI
  id: setup-claude
  uses: ./.github/actions/setup-claude
  with:
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}

- name: Check Cache Status
  run: |
    if [ "${{ steps.setup-claude.outputs.cache-hit }}" == "true" ]; then
      echo "Cache was restored"
    else
      echo "Fresh installation"
    fi
```

## Requirements

### Repository Secrets

You must configure the `ANTHROPIC_API_KEY` secret in your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key
5. Click **Add secret**

### Supported Platforms

- **Operating Systems:** Linux, macOS
- **Architectures:** x64, arm64

## How It Works

1. **OS Detection:** Automatically detects runner OS and architecture
2. **Caching:** Restores Claude CLI from cache if available
3. **Installation:** Downloads and installs Claude CLI if not cached
4. **Authentication:** Configures API key for Claude CLI
5. **Verification:** Validates installation and authentication

## Caching Strategy

The action caches:
- `~/.claude` - Claude CLI configuration directory
- `~/claude-cli` - Claude CLI installation directory

**Cache Key Format:**
```
claude-cli-{os}-{arch}-{version}
```

**Example:**
```
claude-cli-linux-x64-latest
```

Caching significantly speeds up workflow execution:
- **First run (no cache):** ~30-60 seconds
- **Subsequent runs (cached):** ~5-10 seconds

## Troubleshooting

### Installation Failed

If the action fails to install Claude CLI:

1. **Check API key:** Ensure `ANTHROPIC_API_KEY` is correctly set
2. **Check platform:** Verify your runner OS/architecture is supported
3. **Disable caching:** Try setting `cache-enabled: 'false'` to force fresh install
4. **Check logs:** Review the action logs for specific error messages

### Authentication Failed

If authentication fails:

1. **Verify API key:** Check that your API key is valid
2. **Check permissions:** Ensure the workflow has access to the secret
3. **Review logs:** Look for authentication-related errors in the logs

### Cache Issues

If caching is causing problems:

1. **Clear cache:** Go to **Actions** → **Caches** and delete the Claude CLI cache
2. **Disable caching:** Set `cache-enabled: 'false'` temporarily
3. **Update cache key:** Change the `claude-version` input to force a new cache

## Example Workflows

### Maintenance Scan Workflow

```yaml
name: Monthly Maintenance Scan

on:
  schedule:
    - cron: '0 2 1 * *'  # 2 AM UTC on the 1st of each month
  workflow_dispatch:

jobs:
  maintenance-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Claude CLI
        uses: ./.github/actions/setup-claude
        with:
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Run Maintenance Scan
        run: |
          claude command /maintenance-scan
```

### Integration Pipeline Workflow

```yaml
name: Content Integration Pipeline

on:
  push:
    paths:
      - 'INTEGRATION/incoming/**'
  schedule:
    - cron: '0 9-17 * * 1-5'  # Hourly during work hours
  workflow_dispatch:

jobs:
  integration:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Claude CLI
        uses: ./.github/actions/setup-claude
        with:
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          cache-enabled: 'true'

      - name: Scan Files
        run: claude command /integration-scan

      - name: Validate Files
        run: claude command /integration-validate

      - name: Process Files
        run: claude command /integration-process
```

## Version History

- **1.0.0** (2026-01-21): Initial release
  - Claude CLI installation
  - Authentication configuration
  - Caching support
  - OS/architecture detection

## License

This action is part of the [claude-command-and-control](https://github.com/enuno/claude-command-and-control) repository.

## Contributing

Contributions are welcome! Please see the main repository for contribution guidelines.

## Support

For issues or questions:
- [GitHub Issues](https://github.com/enuno/claude-command-and-control/issues)
- [GitHub Discussions](https://github.com/enuno/claude-command-and-control/discussions)
