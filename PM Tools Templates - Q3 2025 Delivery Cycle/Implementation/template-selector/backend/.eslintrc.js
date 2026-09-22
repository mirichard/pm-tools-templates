module.exports = {
  root: true,
  // tests/load-test.js is a k6 script (npm run test:load), not part of this
  // Express app - it runs under k6's own runtime, uses ESM import/export by
  // k6 convention, and imports from the 'k6'/'k6/http' packages that don't
  // exist in this project's node_modules. Linting it as Node/CommonJS would
  // be a category error, not a real finding.
  ignorePatterns: ['tests/load-test.js'],
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
};
