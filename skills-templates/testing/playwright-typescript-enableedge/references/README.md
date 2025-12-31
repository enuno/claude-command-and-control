# GEN-AI Test Automation Framework

A comprehensive TypeScript-based testing solution combining Playwright with AI-assisted test generation through Playwright MCP integration.

## Overview

This repository provides a modern test automation framework that integrates:
- **Playwright** for robust UI and API testing
- **TypeScript** for type-safe test code
- **Playwright MCP** for AI-assisted test generation
- **Page Object Model** for maintainable test architecture
- **Allure Report** for comprehensive test reporting

## Features

### Testing Capabilities
- ✅ UI test automation with Playwright
- ✅ API test automation
- ✅ Multi-browser support (Chrome, Firefox, Safari, Edge)
- ✅ Page Object Model (POM) design pattern
- ✅ Allure Report integration
- ✅ TypeScript for type safety

### AI-Assisted Development
- 🤖 Playwright MCP (Model Context Protocol) integration
- 🤖 AI-powered test generation from natural language
- 🤖 VS Code extension integration
- 🤖 GitHub Copilot compatibility
- 🤖 Automated browser interaction recording

## Requirements

- **Node.js:** v14+ (required)
- **Java:** v11+ (required for Allure Report)
- **VS Code:** Latest version (recommended for MCP integration)
- **Playwright VS Code Extension:** For AI-assisted features

## Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/enableedge/playwright-typescript-enableedge.git
cd playwright-typescript-enableedge
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This will download and install all supported browser binaries.

## Usage

### Running Tests

#### Run UI Tests
```bash
npm run test:ui
```

#### Run API Tests
```bash
npm run test:api
```

#### Run Specific Test File
```bash
npm run test -- <path-to-test-file>
```

Example:
```bash
npm run test -- tests/example.spec.ts
```

### Test Development Workflow

1. Create test files in `tests/` directory
2. Use Page Object Model pattern for UI elements
3. Write test scenarios in TypeScript
4. Run tests locally before committing
5. Review Allure reports for results

## Playwright MCP Integration

### What is Playwright MCP?

Playwright MCP (Model Context Protocol) enables AI-assisted test generation and maintenance within VS Code. It allows developers to:

- Describe test scenarios in natural language
- Automatically generate Playwright test code
- Follow modern testing best practices
- Create maintainable test suites efficiently

### Setup Instructions

**1. Install Playwright VS Code Extension**

Search for "Playwright Test for VSCode" in VS Code marketplace and install.

**2. Enable MCP in Settings**

Add to your VS Code settings (`settings.json`):

```json
{
  "playwright.mcp.enabled": true
}
```

**3. Start MCP Server**

- Open Command Palette (Cmd/Ctrl + Shift + P)
- Search for "Playwright: Start MCP Server"
- Server will start and connect to VS Code

**4. Generate Tests with AI**

Describe your test scenario in natural language:

```
"Create a test that logs into the application with valid credentials,
navigates to the dashboard, and verifies the welcome message is displayed"
```

The MCP server will:
- Parse your description
- Generate corresponding Playwright test code
- Follow POM patterns
- Include proper assertions and waits

### How It Works

```
Natural Language Description
        ↓
  Playwright MCP
        ↓
  Code Generation
        ↓
  Executable Test Code
```

The MCP integration automates browser interactions to create test code that follows modern Playwright practices, including:

- Proper locator strategies
- Auto-waiting for elements
- Page Object Model patterns
- TypeScript type safety
- Best practice assertions

## Page Object Model (POM)

The framework implements POM for better test maintainability:

### Page Object Structure

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  get emailInput() {
    return this.page.locator('#email');
  }

  get passwordInput() {
    return this.page.locator('#password');
  }

  get loginButton() {
    return this.page.locator('button[type="submit"]');
  }

  // Actions
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Test Using Page Object

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user@example.com', 'password123');

  await expect(page).toHaveURL('/dashboard');
});
```

## Allure Report Integration

### Generating Reports

After running tests, generate Allure report:

```bash
# Run tests
npm run test

# Generate Allure report
npx allure generate ./allure-results -o ./allure-report --clean

# Open report in browser
npx allure open ./allure-report
```

### Report Features

- 📊 Test execution statistics
- 📈 Historical trend analysis
- 🏷️ Test categorization and tagging
- 📸 Screenshots on failure
- 📹 Video recordings (if enabled)
- 🔍 Detailed test step logs

## Project Structure

```
playwright-typescript-enableedge/
├── tests/              # Test files
│   ├── ui/            # UI test cases
│   └── api/           # API test cases
├── pages/             # Page Object Model classes
├── utils/             # Helper utilities
├── fixtures/          # Test fixtures and data
├── allure-results/    # Generated test results
├── playwright.config.ts   # Playwright configuration
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Configuration

### Playwright Config (`playwright.config.ts`)

Key configuration options:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright']
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

## AI-Assisted Test Creation Examples

### Example 1: Login Test

**Natural Language:**
```
Create a test that verifies login functionality with valid and invalid credentials
```

**Generated Code:**
```typescript
test.describe('Login Tests', () => {
  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'valid@example.com');
    await page.fill('#password', 'ValidPass123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'WrongPass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

### Example 2: API Test

**Natural Language:**
```
Create an API test that verifies user creation endpoint returns 201 status
```

**Generated Code:**
```typescript
test('create new user via API', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    }
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.id).toBeDefined();
  expect(body.email).toBe('john@example.com');
});
```

## Best Practices

1. **Use Page Objects:** Encapsulate page interactions in reusable classes
2. **Descriptive Test Names:** Use clear, descriptive test names
3. **Independent Tests:** Each test should run independently
4. **Proper Waits:** Use Playwright's auto-waiting, avoid hard waits
5. **Data-Driven Tests:** Use test data fixtures for reusability
6. **Screenshot on Failure:** Capture evidence for debugging
7. **Parallel Execution:** Run tests in parallel for speed

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 14
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-results
          path: allure-results/
```

## Troubleshooting

### Common Issues

**Issue:** Browsers not installed
```bash
# Solution
npx playwright install
```

**Issue:** Tests timing out
```bash
# Solution: Increase timeout in config
test.setTimeout(60000); // 60 seconds
```

**Issue:** Allure report not generating
```bash
# Solution: Ensure Java is installed
java -version
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright MCP Guide](https://playwright.dev/docs/mcp)
- [Allure Report](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [TypeScript](https://www.typescriptlang.org/)

## Support

For issues and questions:
- GitHub Issues: https://github.com/enableedge/playwright-typescript-enableedge/issues
- Playwright Discord: https://aka.ms/playwright/discord
