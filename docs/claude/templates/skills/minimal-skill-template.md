---
name: [skill-name]
version: 1.0.0
author: [your-team]
created: [YYYY-MM-DD]
status: active
complexity: simple
---

# [Skill Name]

## Description
[One sentence: Action verb + object + specific outcome for use case]

Example: "Generates standardized git commit messages following Conventional Commits format for code changes"

## When to Use This Skill
- [Explicit trigger 1 with action verb]
- [Explicit trigger 2 with action verb]
- [Explicit trigger 3 with action verb]

## Prerequisites
- [Required context/data/permission 1]
- [Required context/data/permission 2]

## Workflow

### Step 1: [Action Name]
[Clear, imperative instruction]
- [Sub-step with specifics]
- [Expected output format]

### Step 2: [Action Name]
[Clear, imperative instruction]
- [Sub-step with specifics]
- [Expected output format]

### Step 3: Output Delivery
[Final validation and handoff]

## Examples

### Example 1: [Happy Path Scenario]
**Input:**
```

[Concrete sample input]

```

**Expected Output:**
```

[Concrete sample output]

```

### Example 2: [Edge Case]
**Input:**
```

[Concrete sample input]

```

**Expected Output:**
```

[Concrete sample output]

```

## Quality Standards
- [Acceptance criterion 1]
- [Acceptance criterion 2]

## Common Pitfalls
- ❌ [What to avoid]
- ✅ [What to do instead]

## Version
1.0.0 (Last updated: [YYYY-MM-DD])
```

**Usage Example:**

```markdown
---
name: commit-message-generator
version: 1.0.0
author: engineering-team
created: 2025-11-22
status: active
complexity: simple
---

# Commit Message Generator

## Description
Generates standardized git commit messages following Conventional Commits format based on staged code changes.

## When to Use This Skill
- When the user says "generate commit message"
- When asked to "create a commit" or "write commit message"
- After code changes are staged for commit

## When NOT to Use This Skill
- When writing PR descriptions (use pr-description-generator instead)
- When creating release notes (use release-notes-generator instead)

## Prerequisites
- Git repository with staged changes
- Access to `git diff --cached`
- Understanding of changed file purposes

## Workflow

### Step 1: Analyze Staged Changes
```

git diff --cached --stat
git diff --cached

```
- Identify changed files
- Determine scope of changes
- Classify change type (feat/fix/docs/refactor/test/chore)

### Step 2: Determine Commit Type and Scope

**Type Classification:**
- `feat`: New feature or functionality
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring without behavior change
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, configs

**Scope:** Module, component, or file affected

### Step 3: Generate Message

**Format:**
```

<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>

```

**Rules:**
- Subject: ≤50 characters, imperative mood, lowercase, no period
- Body: Wrap at 72 characters, explain what and why
- Footer: References to issues (Refs #123, Closes #456)

## Examples

### Example 1: Feature Addition
**Input:**
```

Files changed:
src/auth/jwt.service.js | 45 +++++++++++++++++++++
src/auth/jwt.test.js    | 32 ++++++++++++++

Key changes:

- Added JWT token generation
- Added token validation method
- Added unit tests

```

**Expected Output:**
```

feat(auth): add JWT token generation and validation

- Implement generateToken() method with RS256 signing
- Implement validateToken() with expiration checking
- Add comprehensive unit test coverage

Refs #234

```

### Example 2: Bug Fix
**Input:**
```

Files changed:
src/api/users.controller.js | 3 ++-

Key changes:

- Fixed null pointer when email missing
- Added email validation

```

**Expected Output:**
```

fix(api): prevent null pointer on missing user email

Added null check before email access in users controller.

Closes #456

```

### Example 3: Documentation
**Input:**
```

Files changed:
README.md | 12 ++++++++++++

Key changes:

- Added installation instructions
- Updated usage examples

```

**Expected Output:**
```

docs(readme): add installation instructions and update examples

```

## Quality Standards
- Commit type accurately reflects change
- Scope is specific and clear
- Subject line ≤50 characters
- Body wraps at 72 characters (if present)
- Issue references included when applicable

## Common Pitfalls
- ❌ Vague subjects: "update stuff", "fix things"
- ✅ Specific subjects: "fix null pointer in user validation"

- ❌ Wrong type: Using "feat" for bug fixes
- ✅ Correct type: "fix" for bug fixes, "feat" for new features

- ❌ Missing scope: "add authentication"
- ✅ Include scope: "feat(auth): add JWT authentication"

## Version
1.0.0 (Last updated: 2025-11-22)
