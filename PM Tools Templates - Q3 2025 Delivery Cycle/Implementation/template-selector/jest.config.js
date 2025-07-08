module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx,js}',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  preset: 'ts-jest',
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'backend/**/*.{js}',
    '!src/**/*.d.ts',
    '!backend/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};
