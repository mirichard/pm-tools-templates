/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  // Limit root-level Jest to stable, fast unit tests only.
  // Project-specific suites (TS/ESM/JSX, integration/UI) run via their own configs/scripts.
  testMatch: ['<rootDir>/src/**/*.test.js'],
  testPathIgnorePatterns: [
    '<rootDir>/PM Tools Templates - Q3 2025 Delivery Cycle/',
    '<rootDir>/integrations/',
    '<rootDir>/dashboard-mvp/',
    '<rootDir>/Snowflake Demo/',
    '<rootDir>/site/',
    '<rootDir>/workflow-orchestration/'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
