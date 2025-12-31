# Repository File Structure

Repository: enableedge/playwright-typescript-enableedge

## Directory Structure

```
playwright-typescript-enableedge/
├── .github/                    # GitHub configuration
│   └── workflows/             # CI/CD workflows
├── tests/                     # Test files
│   ├── ui/                    # UI test cases
│   └── api/                   # API test cases
├── pages/                     # Page Object Model classes
├── utils/                     # Helper utilities and functions
├── fixtures/                  # Test fixtures and test data
├── allure-results/            # Generated test execution results
├── allure-report/             # Generated Allure HTML reports
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Node.js dependencies and scripts
├── package-lock.json          # Locked dependency versions
├── .gitignore                 # Git ignore patterns
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

## Key Files

### Configuration Files

- **playwright.config.ts**: Main Playwright test runner configuration
  - Test directory settings
  - Browser configurations
  - Reporter settings (Allure integration)
  - Retry and timeout policies
  - Screenshot and trace options

- **tsconfig.json**: TypeScript compiler settings
  - Target ES version
  - Module resolution
  - Type definitions
  - Source/output directories

- **package.json**: Project metadata and dependencies
  - Playwright framework
  - Allure reporter
  - TypeScript and type definitions
  - Test execution scripts

### Test Organization

- **tests/ui/**: User interface test cases
  - Page interaction tests
  - Form validation tests
  - Navigation tests
  - Visual regression tests (if configured)

- **tests/api/**: API endpoint test cases
  - RESTful API tests
  - Request/response validation
  - Authentication tests
  - Data validation tests

### Page Objects

- **pages/**: Page Object Model classes
  - Reusable page components
  - Locator definitions
  - Page action methods
  - Encapsulated page logic

### Support Files

- **utils/**: Helper functions and utilities
  - Common test helpers
  - Data generators
  - Custom assertions
  - Configuration utilities

- **fixtures/**: Test data and fixtures
  - Mock data
  - Test user credentials
  - API request/response templates
  - Reusable test contexts

## Test Artifacts

### Generated During Tests

- **allure-results/**: Raw test execution data (JSON)
  - Test step logs
  - Attachments (screenshots, traces)
  - Timing information
  - Test metadata

- **allure-report/**: HTML test report
  - Visual test results
  - Charts and graphs
  - Historical trends
  - Test categorization

### Additional Artifacts (if configured)

- **test-results/**: Playwright default output
- **screenshots/**: Failure screenshots
- **videos/**: Test execution recordings
- **traces/**: Playwright trace files for debugging

## Languages Detected

- **TypeScript**: 57.9% (primary language)
- **HTML**: 42.1% (reporting and templates)

## Repository Statistics

- **Total Files**: 37 items
- **Branches**: main
- **Commits**: 11
- **Stars**: 2
- **License**: MIT
