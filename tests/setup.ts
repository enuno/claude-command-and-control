/**
 * Jest Test Setup
 *
 * Global setup for all test files.
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};

// Global afterAll to ensure clean shutdown
afterAll(async () => {
  // Allow pending operations to complete
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
});
