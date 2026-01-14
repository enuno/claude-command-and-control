# chezmoi Template Reference

chezmoi uses Go's `text/template` syntax extended with sprig functions.

## Basic Syntax

### Variable Access
```
{{ .variableName }}
{{ .chezmoi.hostname }}
{{ .data.custom.value }}
```

### Actions
All template actions are enclosed in `{{ }}`:
```
{{ action }}
{{- action }}    # Trim leading whitespace
{{ action -}}    # Trim trailing whitespace
{{- action -}}   # Trim both sides
```

## Built-in chezmoi Variables

### System Information
```
{{ .chezmoi.arch }}          # CPU architecture (amd64, arm64, etc.)
{{ .chezmoi.args }}          # Command line arguments
{{ .chezmoi.cacheDir }}      # Cache directory path
{{ .chezmoi.configFile }}    # Config file path
{{ .chezmoi.executable }}    # chezmoi binary path
{{ .chezmoi.fqdnHostname }}  # Fully qualified domain name
{{ .chezmoi.gid }}           # Group ID
{{ .chezmoi.group }}         # Group name
{{ .chezmoi.homeDir }}       # Home directory path
{{ .chezmoi.hostname }}      # Short hostname
{{ .chezmoi.kernel }}        # Kernel info (Linux only)
{{ .chezmoi.os }}            # Operating system (darwin, linux, windows)
{{ .chezmoi.osRelease }}     # OS release info
{{ .chezmoi.sourceDir }}     # Source directory path
{{ .chezmoi.uid }}           # User ID
{{ .chezmoi.username }}      # Username
{{ .chezmoi.version }}       # chezmoi version
{{ .chezmoi.workingTree }}   # Git working tree path
```

### OS Release Details (Linux)
```
{{ .chezmoi.osRelease.id }}           # distro ID (ubuntu, fedora, arch)
{{ .chezmoi.osRelease.idLike }}       # similar distros
{{ .chezmoi.osRelease.name }}         # full name
{{ .chezmoi.osRelease.versionID }}    # version number
{{ .chezmoi.osRelease.versionCodename }}  # codename (jammy, bookworm)
```

## Conditionals

### If/Else
```
{{ if condition }}
  content when true
{{ end }}

{{ if condition }}
  content when true
{{ else }}
  content when false
{{ end }}

{{ if condition1 }}
  ...
{{ else if condition2 }}
  ...
{{ else }}
  ...
{{ end }}
```

### Comparison Functions

**Equality:**
```
{{ if eq .chezmoi.os "darwin" }}...{{ end }}
{{ if eq .chezmoi.os "darwin" "linux" }}...{{ end }}  # OR for multiple values
{{ if ne .chezmoi.hostname "server" }}...{{ end }}
```

**Numeric:**
```
{{ if lt .value 10 }}...{{ end }}   # less than
{{ if le .value 10 }}...{{ end }}   # less than or equal
{{ if gt .value 10 }}...{{ end }}   # greater than
{{ if ge .value 10 }}...{{ end }}   # greater than or equal
```

**Boolean:**
```
{{ if not .disabled }}...{{ end }}
{{ if and .work .linux }}...{{ end }}
{{ if or .personal .home }}...{{ end }}
```

### Complex Conditions
```
{{ if and (eq .chezmoi.os "linux") (ne .chezmoi.hostname "server") }}
  Linux workstation config
{{ end }}

{{ if or (eq .chezmoi.os "darwin") (eq .chezmoi.os "linux") }}
  Unix-like config
{{ end }}

{{ if and .work (or (eq .chezmoi.os "darwin") (eq .chezmoi.os "linux")) }}
  Work Unix config
{{ end }}
```

## Loops

### Range Over Lists
```
{{ range .packages }}
{{ . }}
{{ end }}

{{ range $package := .packages }}
- {{ $package }}
{{ end }}

{{ range $index, $package := .packages }}
{{ $index }}: {{ $package }}
{{ end }}
```

### Range Over Maps
```
{{ range $key, $value := .settings }}
{{ $key }} = {{ $value }}
{{ end }}
```

### Range with Else
```
{{ range .packages }}
{{ . }}
{{ else }}
No packages defined
{{ end }}
```

## Variables

### Define Variables
```
{{ $name := "value" }}
{{ $os := .chezmoi.os }}
{{ $isLinux := eq .chezmoi.os "linux" }}

{{ if $isLinux }}...{{ end }}
```

### Variable Scope
Variables defined in blocks are scoped to that block:
```
{{ if true }}
  {{ $local := "value" }}  # Only available inside if block
{{ end }}
# $local not available here
```

## String Functions

### Basic String Operations
```
{{ upper .name }}              # UPPERCASE
{{ lower .name }}              # lowercase
{{ title .name }}              # Title Case
{{ trim .name }}               # Remove whitespace
{{ trimPrefix "prefix" .str }} # Remove prefix
{{ trimSuffix "suffix" .str }} # Remove suffix
{{ replace "old" "new" .str }} # Replace all occurrences
{{ contains "sub" .str }}      # Check substring
{{ hasPrefix "pre" .str }}     # Check prefix
{{ hasSuffix "suf" .str }}     # Check suffix
```

### String Formatting
```
{{ printf "%s@%s" .user .domain }}
{{ println .message }}
```

### Quote Strings
```
{{ quote .value }}             # "value"
{{ squote .value }}            # 'value'
```

## List Functions

```
{{ list "a" "b" "c" }}         # Create list
{{ first .items }}             # First element
{{ last .items }}              # Last element
{{ rest .items }}              # All but first
{{ initial .items }}           # All but last
{{ len .items }}               # Length
{{ append .items "new" }}      # Add to end
{{ prepend .items "new" }}     # Add to start
{{ concat .list1 .list2 }}     # Combine lists
{{ has "item" .items }}        # Check membership
{{ uniq .items }}              # Remove duplicates
{{ sortAlpha .items }}         # Sort alphabetically
{{ reverse .items }}           # Reverse order
```

### Join Lists
```
{{ join "," .items }}          # "a,b,c"
{{ join "\n" .lines }}         # Multi-line
```

## Map/Dict Functions

```
{{ dict "key1" "val1" "key2" "val2" }}  # Create map
{{ get .map "key" }}                     # Get value
{{ set .map "key" "value" }}             # Set value
{{ hasKey .map "key" }}                  # Check key exists
{{ keys .map }}                          # Get all keys
{{ values .map }}                        # Get all values
{{ merge .map1 .map2 }}                  # Merge maps
{{ omit .map "key1" "key2" }}           # Remove keys
{{ pick .map "key1" "key2" }}           # Keep only keys
```

## Path Functions

```
{{ base "/path/to/file" }}     # "file"
{{ dir "/path/to/file" }}      # "/path/to"
{{ ext "/path/to/file.txt" }}  # ".txt"
{{ clean "/path//to/./file" }} # "/path/to/file"
{{ isAbs "/path" }}            # true
{{ joinPath "a" "b" "c" }}     # "a/b/c"
```

## Template Functions

### Include Templates
Create templates in `.chezmoitemplates/` directory:

```
# .chezmoitemplates/git-user
[user]
    name = {{ .name }}
    email = {{ .email }}
```

Include in other files:
```
# dot_gitconfig.tmpl
{{ template "git-user" . }}

[core]
    editor = nvim
```

### Pass Custom Data
```
{{ template "component" dict "name" .name "size" 12 }}
```

## chezmoi-Specific Functions

### Prompts (for .chezmoi.toml.tmpl)
```
{{ promptString "Enter your email" }}
{{ promptStringOnce . "email" "Enter your email" }}
{{ promptBool "Enable feature" }}
{{ promptBoolOnce . "feature" "Enable feature" }}
{{ promptInt "Enter port" }}
{{ promptChoice "Choose option" (list "a" "b" "c") }}
```

### Include Files
```
{{ include "path/to/file" }}
{{ include ".chezmoitemplates/partial" }}
{{ include "dot_bashrc.tmpl" | sha256sum }}  # For change detection
```

### Output Functions
```
{{ output "command" "arg1" "arg2" }}
{{ output "hostname" | trim }}
{{ output "git" "config" "user.email" | trim }}
```

### Stat Functions
```
{{ stat "/path/to/file" }}
{{ lstat "/path/to/symlink" }}
{{ glob "~/.config/*" }}
```

### Look Path
```
{{ lookPath "nvim" }}  # Returns path or empty string
{{ if lookPath "brew" }}
  # Homebrew is installed
{{ end }}
```

### Encryption
```
{{ decrypt "encrypted-content" }}
{{ include "encrypted_file" | decrypt }}
```

### GitHub Functions
```
{{ gitHubKeys "username" }}
{{ gitHubLatestRelease "owner/repo" }}
{{ gitHubLatestTag "owner/repo" }}
```

### Password Manager Functions
See password-managers.md for full list.

## Hash Functions

```
{{ sha256sum .content }}
{{ sha1sum .content }}
{{ md5sum .content }}
{{ adler32sum .content }}
```

## Encoding Functions

```
{{ .content | b64enc }}        # Base64 encode
{{ .content | b64dec }}        # Base64 decode
{{ toJson .data }}             # JSON encode
{{ fromJson .jsonString }}     # JSON decode
{{ toYaml .data }}             # YAML encode
{{ fromYaml .yamlString }}     # YAML decode
{{ toToml .data }}             # TOML encode
{{ fromToml .tomlString }}     # TOML decode
```

## Default Values

```
{{ default "fallback" .value }}
{{ .value | default "fallback" }}
{{ coalesce .primary .secondary .fallback }}  # First non-empty
```

## Type Conversion

```
{{ int "42" }}
{{ int64 "42" }}
{{ float64 "3.14" }}
{{ toString 42 }}
{{ toStrings .listOfInts }}
```

## Comments

```
{{/* This is a comment */}}

{{- /*
   Multi-line comment
   with whitespace trimming
*/ -}}
```

## Escaping

```
{{ "{{" }}  # Literal {{
{{ "}}" }}  # Literal }}
```

## Testing Templates

```bash
# Test from command line
chezmoi execute-template '{{ .chezmoi.hostname }}'

# Test from file
chezmoi execute-template < template.tmpl

# Preview rendered file
chezmoi cat ~/.bashrc

# Check template data
chezmoi data
```

## Best Practices

1. **Use whitespace control** (`{{-` and `-}}`) for clean output
2. **Test templates** with `execute-template` before applying
3. **Use `promptStringOnce`** instead of `promptString` to avoid repeated prompts
4. **Include checksums** in `run_onchange_` scripts for file-dependent triggers
5. **Use `lookPath`** to conditionally configure tools that may not be installed
6. **Quote strings** in TOML/YAML with `| quote` to handle special characters
