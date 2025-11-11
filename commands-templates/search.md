---
description: "Searches for a keyword, filename, or code pattern across the codebase and outputs locations, context, and relevance ranking. Runs as /search [pattern]"
allowed-tools: ["Read", "Search", "Bash(grep)", "Bash(find)", "Bash(rg)"]
author: "Engineering Standards Committee"
version: "1.0"
---

# Search

## Purpose
Quickly locate code patterns, keywords, filenames, and functions across the codebase with context and relevance ranking.

## Usage

```
/search [pattern]
/search keyword
/search function_name
/search "exact phrase"
/search *.component.ts
/search error:404
```

## Search Execution Steps

### 1. Parse Search Query

Determine search type based on pattern:

```
Search Types:
1. Filename search: *.ext or file.*
2. Exact phrase: "text in quotes"
3. Regex pattern: /pattern/
4. Function/class: function-name, ClassName
5. Error/warning: error:404, warning:deprecated
6. Keyword search: simple keyword
```

### 2. Execute Multi-Method Search

#### Primary Search: Ripgrep (Fast)
```bash
# If ripgrep available, use it (fastest)
!rg "$SEARCH_PATTERN" --type-list 2>/dev/null && \
  rg "$SEARCH_PATTERN" --max-count=500 --no-heading --color=never -A2 -B1

# Fall back to grep if ripgrep unavailable
!grep -r "$SEARCH_PATTERN" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=.venv \
  --exclude-dir=dist \
  --exclude-dir=build \
  -n -C2 2>/dev/null | head -200
```

#### Filename Search
```bash
# Search for filenames
!find . -type f -name "*$SEARCH_PATTERN*" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" 2>/dev/null
```

#### Function/Class Search
```bash
# JavaScript/TypeScript functions and classes
!grep -r "function\|class\|const.*=.*=>" . \
  --include="*.js" --include="*.ts" \
  | grep -i "$SEARCH_PATTERN" | head -20

# Python functions and classes
!grep -r "^def\|^class" . --include="*.py" \
  | grep -i "$SEARCH_PATTERN" | head -20

# Java classes and methods
!grep -r "public\|private\|class\|void" . --include="*.java" \
  | grep -i "$SEARCH_PATTERN" | head -20
```

#### Specialized Searches
```bash
# Search in comments only
!grep -r "//.*\|#.*" . --include="*.js" --include="*.py" \
  | grep -i "$SEARCH_PATTERN" | head -20

# Search import/require statements
!grep -r "import\|require\|from" . --include="*.js" --include="*.ts" --include="*.py" \
  | grep -i "$SEARCH_PATTERN" | head -20

# Search error handling
!grep -r "throw\|Error\|catch\|except\|try" . \
  --include="*.js" --include="*.py" --include="*.java" \
  | grep -i "$SEARCH_PATTERN" | head -20

# Search TODO/FIXME/HACK comments
!grep -r "TODO\|FIXME\|HACK\|XXX\|BUG" . \
  --include="*.js" --include="*.py" --include="*.java" | head -20
```

### 3. Generate Search Results Report

Create **SEARCH_RESULTS.md**:

```markdown
# Search Results

**Query**: "$SEARCH_PATTERN"
**Timestamp**: [ISO 8601]
**Total Results**: [N matches in X files]

---

## 🎯 Top Results by Relevance

### Result #1: [File: path/to/file.js, Line 45]
**Relevance Score**: ⭐⭐⭐⭐⭐ (100%)

**Match Type**: [Function definition / Class / String / Comment]
**Context**:
\`\`\`javascript
// Line 42-48
function handleUserLogin(username, password) {
  // YOUR PATTERN appears here
  const result = authenticateUser(username, password);
  return result;
}
\`\`\`

**Location**: src/auth/login.js:45
**Function**: handleUserLogin()
**Related**: [2 other matches in file]

---

### Result #2: [File: path/to/file.ts, Line 120]
**Relevance Score**: ⭐⭐⭐⭐ (85%)

**Match Type**: [Import statement / API call / Configuration]
**Context**:
\`\`\`typescript
// Line 118-123
import { YourPattern } from './services';

export class UserService {
  constructor(private api: YourPattern) {}
}
\`\`\`

**Location**: src/services/user.service.ts:120
**Class**: UserService
**Related**: [1 other match in file]

---

## 📊 Results Summary

### By File Type
| Type | Count | Files |
|------|-------|-------|
| JavaScript | 15 | 5 |
| TypeScript | 12 | 4 |
| Python | 8 | 3 |
| Tests | 6 | 2 |

### By Category
- **Functions/Methods**: 18 matches
- **Variable Names**: 12 matches
- **Comments**: 8 matches
- **Strings/Constants**: 6 matches
- **Imports**: 4 matches

### By Location
- **Source Code**: 32 matches
- **Tests**: 6 matches
- **Documentation**: 4 matches
- **Config**: 2 matches

---

## 📁 Files Containing Matches

### Primary Matches (3+ occurrences)
1. **src/auth/login.js** (5 matches)
   - Line 12: [First context]
   - Line 45: [Context]
   - Line 78: [Context]
   - [Show more...]

2. **src/services/user.service.ts** (4 matches)
   - Line 8: [Context]
   - Line 120: [Context]
   - [Show more...]

### Secondary Matches (1-2 occurrences)
- src/components/LoginForm.jsx (2 matches)
- src/utils/helpers.js (1 match)
- tests/auth.test.js (1 match)
- docs/API.md (1 match)

---

## 🔍 Detailed Results

### Search Type: [Type]

#### [Filename/Function/Pattern]
- **File**: src/auth/login.js
- **Line**: 45
- **Type**: Function definition
- **Full Context**: [Complete function]
- **Usage**: Called in: [List of callers]
- **Related**: [List of related functions]

---

## 💡 Quick Navigation

### Jump to Results
- [Function Definition Results](#functions)
- [Test Results](#tests)
- [Comment/Documentation Results](#comments)
- [Import/Usage Results](#imports)

### Next Steps
- [ ] Review search results
- [ ] Navigate to specific matches: Use file+line numbers
- [ ] Replace pattern: Use search + replace feature
- [ ] Create watchlist: Monitor specific files for changes

---

## 🎯 Suggested Actions

### Refactoring
If results show code duplication:
\`\`\`
Suggested Refactoring:
- [File 1] Line 45: [Pattern]
- [File 2] Line 120: [Pattern]
- [File 3] Line 78: [Pattern]

Consider: Extract common logic to shared utility
\`\`\`

### Dead Code Detection
If no usages found:
\`\`\`
Defined: src/utils/oldFunction.js:12
Used: 0 times

Recommendation: Consider removing if deprecated
\`\`\`

### Vulnerability Scan
If searching for security patterns:
\`\`\`
⚠️ Potential issues found:
- [Pattern] in [File] - Review for SQL injection risk
- [Pattern] in [File] - Check password hashing
\`\`\`

---

## 📞 Advanced Searches

### Find All TODOs
\`\`\`
/search TODO
\`\`\`

### Find Deprecated Usage
\`\`\`
/search deprecated|DEPRECATED
\`\`\`

### Find Error Handling
\`\`\`
/search error|Error|exception
\`\`\`

### Find Configuration
\`\`\`
/search config|ENV|process.env
\`\`\`

### Find Database Queries
\`\`\`
/search SELECT|INSERT|UPDATE|DELETE
\`\`\`

---

**Search Generated**: [Timestamp]  
**Time to Search**: [X.XXs]  
**Files Scanned**: [N] files  
**Files Excluded**: node_modules, .git, dist, build

---
```

### 4. Display Search Summary

Show formatted output:

```
╔════════════════════════════════════════════════════╗
║           SEARCH RESULTS FOUND                     ║
╚════════════════════════════════════════════════════╝

QUERY: [search pattern]
RESULTS: [N] matches in [X] files

TOP 5 RESULTS:

1. ⭐⭐⭐⭐⭐ src/auth/login.js:45
   Match: handleUserLogin() function
   Context: [Brief context]

2. ⭐⭐⭐⭐ src/services/user.service.ts:120
   Match: UserService class import
   Context: [Brief context]

3. ⭐⭐⭐ tests/auth.test.js:89
   Match: Test case
   Context: [Brief context]

4. ⭐⭐⭐ src/utils/helpers.js:42
   Match: Utility function
   Context: [Brief context]

5. ⭐⭐ docs/API.md:156
   Match: Documentation reference
   Context: [Brief context]

SUMMARY:
  Functions/Methods: [Count]
  Variable Names: [Count]
  Comments: [Count]
  Tests: [Count]
  Documentation: [Count]

LOCATIONS:
  src/: [Count] matches
  tests/: [Count] matches
  docs/: [Count] matches

Time: [X.XXs]
Full Results: SEARCH_RESULTS.md
```

### 5. Provide Quick Jump Options

```
QUICK ACTIONS:

Go to result: 
  - Line 45 in src/auth/login.js
  - Line 120 in src/services/user.service.ts
  - Line 89 in tests/auth.test.js

Replace all occurrences: Run /replace [pattern] [replacement]
Filter results: Run /search [pattern] [filter]
Find usages: Run /search [function_name]
```

## Search Options

### Search Patterns
- **Keyword**: `/search authentication`
- **Filename**: `/search *.component.ts`
- **Exact phrase**: `/search "password reset"`
- **Regex**: `/search /^function.*auth/`
- **Type**: `/search function:handleLogin`
- **Error patterns**: `/search error:401`
- **TODOs**: `/search TODO`

### Filter Results
- By file type: `/search pattern --type=js`
- By directory: `/search pattern --path=src/`
- Exclude patterns: `/search pattern --exclude=test`
- Max results: `/search pattern --limit=50`

### Advanced Options
- Case sensitive: `/search -i pattern`
- Whole word: `/search -w pattern`
- Show context: `/search pattern -C 5` (5 lines context)
- Line numbers: `/search pattern -n`

## Key Features

- **Multi-Method**: Ripgrep, grep, find combinations
- **Relevance Ranking**: Results ordered by match quality
- **Context Display**: Shows code surrounding matches
- **File Statistics**: Count by type and location
- **Smart Filtering**: Excludes node_modules, .git, etc.
- **Usage Detection**: Shows who calls/uses found items
- **Fast Execution**: Optimized for large codebases
- **Detailed Report**: Comprehensive SEARCH_RESULTS.md

## Search Use Cases

| Use Case | Search Pattern | Example |
|----------|---|---|
| Find function | `function_name` | `/search handleLogin` |
| Find class | `ClassName` | `/search UserService` |
| Find TODOs | `TODO\|FIXME\|HACK` | `/search TODO` |
| Find errors | `throw\|Error` | `/search "throw Error"` |
| Find config | `process.env\|config` | `/search process.env` |
| Find queries | `SELECT\|INSERT\|UPDATE` | `/search SELECT` |
| Find tests | `test\|describe\|it` | `/search test:handleLogin` |
| Dead code | `Function name with 0 usages` | (Automated detection) |

## When to Use /search

- Finding where a function is used
- Locating all TODOs or FIXMEs
- Searching for deprecated code
- Finding dead code candidates
- Refactoring and renaming
- Security pattern detection
- Documentation references
- Configuration discovery
- Bug hunting and diagnosis

## Best Practices

1. **Be Specific**: More specific queries = better results
2. **Use Quotes**: "Exact phrases" reduce noise
3. **Check Context**: Always view surrounding code
4. **Follow Usages**: See where code is actually used
5. **Review Patterns**: Look for anti-patterns or duplicates
6. **Filter Noise**: Exclude test/doc results if needed
7. **Archive Results**: Save important search results
8. **Iterate**: Refine searches based on initial results