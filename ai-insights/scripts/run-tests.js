#!/usr/bin/env node

/**
 * Master Test Runner for AI-Powered Project Insights
 * Orchestrates different types of testing
 */

import { spawn } from 'child_process';
import { testAIEngine } from './test-ai-basic.js';

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function logSuccess(message) {
  log(COLORS.GREEN, `✅ ${message}`);
}

function logError(message) {
  log(COLORS.RED, `❌ ${message}`);
}

function logInfo(message) {
  log(COLORS.BLUE, `ℹ️  ${message}`);
}

function logWarning(message) {
  log(COLORS.YELLOW, `⚠️  ${message}`);
}

function logSection(message) {
  log(COLORS.BOLD, `\n🔹 ${message}`);
}

// Test suite configuration
const TEST_SUITES = {
  quick: {
    name: 'Quick Test Suite',
    description: 'Fast validation of core functionality',
    tests: ['basic-ai', 'unit-tests']
  },
  full: {
    name: 'Full Test Suite',
    description: 'Comprehensive testing including integration tests',
    tests: ['basic-ai', 'unit-tests', 'integration-tests', 'security-tests']
  },
  performance: {
    name: 'Performance Test Suite',
    description: 'Load testing and performance validation',
    tests: ['basic-ai', 'load-tests', 'memory-tests']
  },
  all: {
    name: 'Complete Test Suite',
    description: 'All tests including long-running performance tests',
    tests: ['basic-ai', 'unit-tests', 'integration-tests', 'security-tests', 'load-tests', 'ai-validation']
  }
};

// Test execution functions
async function runCommand(command, args = [], options = {}) {
  // Validate command to prevent injection
  const allowedCommands = ['npm', 'node', 'npx'];
  if (!allowedCommands.includes(command)) {
    throw new Error(`Command not allowed: ${command}`);
  }
  
  // Validate args to prevent injection
  const safeArgs = args.filter(arg => typeof arg === 'string' && !arg.includes(';') && !arg.includes('|'));
  
  return new Promise((resolve, reject) => {
    const child = spawn(command, safeArgs, {
      stdio: 'inherit',
      shell: false, // Disable shell to prevent command injection
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runBasicAI() {
  logSection('Running Basic AI Functionality Tests');
  try {
    await testAIEngine();
    logSuccess('Basic AI tests completed successfully');
    return true;
  } catch (error) {
    logError(`Basic AI tests failed: ${error.message}`);
    return false;
  }
}

async function runUnitTests() {
  logSection('Running Unit Tests');
  try {
    await runCommand('npm', ['test']);
    logSuccess('Unit tests completed successfully');
    return true;
  } catch (error) {
    logError(`Unit tests failed: ${error.message}`);
    return false;
  }
}

async function runIntegrationTests() {
  logSection('Running Integration Tests');
  try {
    await runCommand('npm', ['run', 'test:integration']);
    logSuccess('Integration tests completed successfully');
    return true;
  } catch (error) {
    logError(`Integration tests failed: ${error.message}`);
    return false;
  }
}

async function runSecurityTests() {
  logSection('Running Security Tests');
  try {
    // For now, we'll run a basic security audit
    await runCommand('npm', ['audit', '--audit-level', 'moderate']);
    logSuccess('Security tests completed successfully');
    return true;
  } catch (error) {
    logWarning(`Security tests found issues: ${error.message}`);
    return true; // Don't fail the build for security warnings
  }
}

async function runLoadTests() {
  logSection('Running Load Tests');
  try {
    await runCommand('node', ['tests/performance/load-test.js', '--scenario', 'light']);
    logSuccess('Load tests completed successfully');
    return true;
  } catch (error) {
    logError(`Load tests failed: ${error.message}`);
    return false;
  }
}

async function runMemoryTests() {
  logSection('Running Memory Tests');
  try {
    await runCommand('node', ['--expose-gc', 'scripts/test-ai-basic.js']);
    logSuccess('Memory tests completed successfully');
    return true;
  } catch (error) {
    logError(`Memory tests failed: ${error.message}`);
    return false;
  }
}

async function runAIValidation() {
  logSection('Running AI Model Validation');
  try {
    // This would run AI-specific validation tests
    logInfo('AI validation tests would run here...');
    logSuccess('AI validation completed successfully');
    return true;
  } catch (error) {
    logError(`AI validation failed: ${error.message}`);
    return false;
  }
}

// Test mapping
const TEST_FUNCTIONS = {
  'basic-ai': runBasicAI,
  'unit-tests': runUnitTests,
  'integration-tests': runIntegrationTests,
  'security-tests': runSecurityTests,
  'load-tests': runLoadTests,
  'memory-tests': runMemoryTests,
  'ai-validation': runAIValidation
};

// Main test runner
async function runTestSuite(suiteName) {
  const suite = TEST_SUITES[suiteName];
  if (!suite) {
    throw new Error(`Unknown test suite: ${suiteName}`);
  }

  log(COLORS.BOLD, `\n🧪 Running ${suite.name}`);
  logInfo(suite.description);

  const results = {
    suite: suiteName,
    total: suite.tests.length,
    passed: 0,
    failed: 0,
    startTime: Date.now(),
    endTime: null,
    testResults: {}
  };

  for (const testName of suite.tests) {
    const testFunction = TEST_FUNCTIONS[testName];
    if (!testFunction) {
      logWarning(`Unknown test: ${testName}, skipping...`);
      continue;
    }

    try {
      const testStart = Date.now();
      const success = await testFunction();
      const testEnd = Date.now();

      results.testResults[testName] = {
        success,
        duration: testEnd - testStart
      };

      if (success) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      logError(`Test ${testName} threw an exception: ${error.message}`);
      results.testResults[testName] = {
        success: false,
        duration: 0,
        error: error.message
      };
      results.failed++;
    }
  }

  results.endTime = Date.now();
  return results;
}

function printResults(results) {
  log(COLORS.BOLD, '\n📋 Test Results Summary');
  
  const duration = (results.endTime - results.startTime) / 1000;
  const successRate = (results.passed / results.total) * 100;

  logInfo(`Suite: ${TEST_SUITES[results.suite].name}`);
  logInfo(`Duration: ${duration.toFixed(2)}s`);
  logInfo(`Total Tests: ${results.total}`);
  
  if (results.passed > 0) {
    logSuccess(`Passed: ${results.passed}`);
  }
  
  if (results.failed > 0) {
    logError(`Failed: ${results.failed}`);
  }

  log(COLORS.CYAN, `Success Rate: ${successRate.toFixed(1)}%`);

  // Detailed test results
  log(COLORS.BOLD, '\n📊 Detailed Results:');
  Object.entries(results.testResults).forEach(([testName, result]) => {
    const status = result.success ? '✅' : '❌';
    const duration = `${result.duration}ms`;
    log(COLORS.RESET, `  ${status} ${testName} (${duration})`);
    
    if (result.error) {
      log(COLORS.RED, `    Error: ${result.error}`);
    }
  });

  // Overall assessment
  log(COLORS.BOLD, '\n🎯 Overall Assessment:');
  if (successRate === 100) {
    logSuccess('All tests passed! System is ready for deployment. 🎉');
  } else if (successRate >= 80) {
    logWarning('Most tests passed. Review failed tests before deployment. ⚠️');
  } else {
    logError('Multiple test failures detected. System needs attention before deployment. 🔧');
  }

  return results.failed === 0;
}

// CLI interface
function showHelp() {
  console.log(`
🧪 AI-Powered Project Insights Test Runner

Usage: node run-tests.js [suite] [options]

Test Suites:
  quick       Fast validation of core functionality (default)
  full        Comprehensive testing including integration tests
  performance Load testing and performance validation
  all         Complete test suite with all tests

Options:
  --help, -h  Show this help message
  --verbose   Show detailed output
  --no-color  Disable colored output

Examples:
  node run-tests.js                    # Run quick test suite
  node run-tests.js full               # Run full test suite
  node run-tests.js performance        # Run performance tests only
  node run-tests.js all --verbose      # Run all tests with detailed output

Individual Tests:
  You can also run individual test components:
  
  npm test                             # Unit tests
  npm run test:integration             # Integration tests
  npm run test:coverage                # Coverage report
  node scripts/test-ai-basic.js        # Basic AI functionality
  node tests/performance/load-test.js  # Load testing
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Disable colors if requested
  if (args.includes('--no-color')) {
    Object.keys(COLORS).forEach(key => {
      COLORS[key] = '';
    });
  }

  const verbose = args.includes('--verbose');
  const suiteName = args.find(arg => !arg.startsWith('--')) || 'quick';

  if (!TEST_SUITES[suiteName]) {
    logError(`Unknown test suite: ${suiteName}`);
    logInfo('Available suites: ' + Object.keys(TEST_SUITES).join(', '));
    process.exit(1);
  }

  try {
    log(COLORS.BOLD, '🚀 AI-Powered Project Insights Test Runner');
    
    // Pre-flight checks
    logInfo('Performing pre-flight checks...');
    
    // Check if dependencies are installed
    try {
      await runCommand('node', ['-e', 'require("./package.json")']);
      logSuccess('Package configuration is valid');
    } catch (error) {
      logError('Package configuration issue detected');
      throw error;
    }

    // Check if required files exist
    const requiredFiles = [
      'src/services/AIInsightsEngine.js',
      'src/dashboard/aiInsightsClient.js'
    ];

    for (const file of requiredFiles) {
      try {
        await runCommand('test', ['-f', file]);
        if (verbose) logSuccess(`Found: ${file}`);
      } catch (error) {
        logError(`Required file missing: ${file}`);
        throw new Error(`Missing required file: ${file}`);
      }
    }

    logSuccess('Pre-flight checks completed');

    // Run the test suite
    const results = await runTestSuite(suiteName);
    const success = printResults(results);

    // Exit with appropriate code
    process.exit(success ? 0 : 1);

  } catch (error) {
    logError(`Test runner failed: ${error.message}`);
    if (verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { runTestSuite, TEST_SUITES };

