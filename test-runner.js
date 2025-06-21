#!/usr/bin/env node

/**
 * PM Tools Templates - Test Runner
 * Basic test runner for workflow validation
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 PM Tools Templates - Test Runner');
console.log('==================================');

// Basic tests
const tests = [
  {
    name: 'Package.json exists',
    test: () => fs.existsSync('package.json')
  },
  {
    name: 'Ecosystem gateway exists',
    test: () => fs.existsSync('ecosystem-gateway.js')
  },
  {
    name: 'README exists',
    test: () => fs.existsSync('README.md')
  },
  {
    name: 'Templates directory structure',
    test: () => {
      const templateDirs = ['PMBOK', 'Agile', 'Hybrid'];
      return templateDirs.some(dir => fs.existsSync(dir));
    }
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    if (test.test()) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name} (Error: ${error.message})`);
    failed++;
  }
});

console.log('');
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✅ All tests passed');
  process.exit(0);
}
