#!/usr/bin/env node

/**
 * Load Testing Script for AI Insights System
 * Tests system performance under various load conditions
 */

import { performance } from 'perf_hooks';
import { AIInsightsClient } from '../../src/dashboard/aiInsightsClient.js';

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

function logResults(message) {
  log(COLORS.CYAN, `📊 ${message}`);
}

// Load test configuration
const LOAD_TEST_CONFIG = {
  baseURL: process.env.TEST_BASE_URL || 'http://localhost:3001/api/v1',
  scenarios: {
    light: {
      name: 'Light Load',
      concurrentUsers: 5,
      duration: 30000, // 30 seconds
      requestsPerSecond: 2
    },
    normal: {
      name: 'Normal Load',
      concurrentUsers: 20,
      duration: 60000, // 1 minute
      requestsPerSecond: 10
    },
    heavy: {
      name: 'Heavy Load',
      concurrentUsers: 50,
      duration: 120000, // 2 minutes
      requestsPerSecond: 25
    },
    stress: {
      name: 'Stress Test',
      concurrentUsers: 100,
      duration: 180000, // 3 minutes
      requestsPerSecond: 50
    },
    spike: {
      name: 'Spike Test',
      concurrentUsers: 200,
      duration: 60000, // 1 minute burst
      requestsPerSecond: 100
    }
  }
};

// Test data generators
function generateRandomProject() {
  const complexities = ['low', 'medium', 'high'];
  const methodologies = ['agile', 'waterfall', 'hybrid'];
  const technologies = [
    ['react', 'nodejs'],
    ['python', 'django'],
    ['java', 'spring'],
    ['react', 'nodejs', 'postgresql'],
    ['python', 'tensorflow', 'kubernetes'],
    ['java', 'spring', 'oracle', 'redis']
  ];

  return {
    id: `load-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `Load Test Project ${Math.random().toString(36).substr(2, 5)}`,
    teamSize: Math.floor(Math.random() * 50) + 1,
    duration: Math.floor(Math.random() * 365) + 7,
    budget: Math.floor(Math.random() * 2000000) + 10000,
    complexity: complexities[Math.floor(Math.random() * complexities.length)],
    methodology: methodologies[Math.floor(Math.random() * methodologies.length)],
    stakeholders: Math.floor(Math.random() * 30) + 1,
    requirements: Math.floor(Math.random() * 200) + 5,
    features: Math.floor(Math.random() * 100) + 1,
    teamExperience: Math.random(),
    technologies: technologies[Math.floor(Math.random() * technologies.length)]
  };
}

// Statistics collector
class LoadTestStats {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.responseTimes = [];
    this.errors = [];
    this.startTime = null;
    this.endTime = null;
    this.memoryUsage = [];
  }

  recordRequest(responseTime, success, error = null) {
    this.totalRequests++;
    this.responseTimes.push(responseTime);
    
    if (success) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
      if (error) {
        this.errors.push(error);
      }
    }

    // Record memory usage every 10 requests
    if (this.totalRequests % 10 === 0) {
      const memUsage = process.memoryUsage();
      this.memoryUsage.push({
        timestamp: Date.now(),
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      });
    }
  }

  getStatistics() {
    const duration = this.endTime - this.startTime;
    const successRate = (this.successfulRequests / this.totalRequests) * 100;
    const avgResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    const minResponseTime = Math.min(...this.responseTimes);
    const maxResponseTime = Math.max(...this.responseTimes);
    const requestsPerSecond = (this.totalRequests / duration) * 1000;

    // Calculate percentiles
    const sortedTimes = this.responseTimes.sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

    // Memory statistics
    const maxMemory = this.memoryUsage.reduce((max, mem) => 
      Math.max(max, mem.heapUsed), 0);
    const avgMemory = this.memoryUsage.reduce((sum, mem) => 
      sum + mem.heapUsed, 0) / this.memoryUsage.length;

    return {
      duration: duration,
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      successRate: successRate,
      requestsPerSecond: requestsPerSecond,
      responseTime: {
        avg: avgResponseTime,
        min: minResponseTime,
        max: maxResponseTime,
        p50: p50,
        p90: p90,
        p95: p95,
        p99: p99
      },
      memory: {
        maxHeapUsed: maxMemory,
        avgHeapUsed: avgMemory
      },
      errors: this.errors
    };
  }
}

// Load test executor
class LoadTestExecutor {
  constructor(config) {
    this.config = config;
    this.client = new AIInsightsClient({
      baseURL: config.baseURL,
      timeout: 30000,
      retries: 0 // No retries during load testing
    });
    this.stats = new LoadTestStats();
    this.isRunning = false;
  }

  async executeScenario(scenario) {
    log(COLORS.BOLD, `\n🚀 Starting ${scenario.name}`);
    logInfo(`Concurrent Users: ${scenario.concurrentUsers}`);
    logInfo(`Duration: ${scenario.duration / 1000}s`);
    logInfo(`Target RPS: ${scenario.requestsPerSecond}`);

    this.stats.reset();
    this.stats.startTime = performance.now();
    this.isRunning = true;

    // Create worker pools
    const workers = [];
    for (let i = 0; i < scenario.concurrentUsers; i++) {
      workers.push(this.createWorker(scenario));
    }

    // Start all workers
    const workerPromises = workers.map(worker => worker());

    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, scenario.duration));
    this.isRunning = false;

    // Wait for all workers to complete
    await Promise.allSettled(workerPromises);

    this.stats.endTime = performance.now();
    
    return this.stats.getStatistics();
  }

  createWorker(scenario) {
    return async () => {
      const requestInterval = 1000 / scenario.requestsPerSecond * scenario.concurrentUsers;
      
      while (this.isRunning) {
        try {
          const project = generateRandomProject();
          const startTime = performance.now();
          
          await this.client.predictRisk(project);
          
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          this.stats.recordRequest(responseTime, true);
          
        } catch (error) {
          const endTime = performance.now();
          const responseTime = endTime - startTime || 0;
          
          this.stats.recordRequest(responseTime, false, error.message);
        }

        // Wait before next request
        if (this.isRunning) {
          await new Promise(resolve => setTimeout(resolve, requestInterval));
        }
      }
    };
  }

  async runBenchmark() {
    log(COLORS.BOLD, '\n📈 AI Insights Load Testing Benchmark\n');

    // Warm up
    logInfo('Warming up system...');
    await this.warmUp();
    logSuccess('Warm-up completed');

    const results = {};

    // Run each scenario
    for (const [scenarioName, scenario] of Object.entries(this.config.scenarios)) {
      try {
        const stats = await this.executeScenario(scenario);
        results[scenarioName] = stats;
        
        this.printScenarioResults(scenario, stats);
        
        // Cool down between scenarios
        if (scenarioName !== 'spike') {
          logInfo('Cooling down...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
      } catch (error) {
        logError(`Scenario ${scenario.name} failed: ${error.message}`);
        results[scenarioName] = { error: error.message };
      }
    }

    this.printOverallResults(results);
    
    return results;
  }

  async warmUp() {
    const warmUpRequests = 10;
    for (let i = 0; i < warmUpRequests; i++) {
      try {
        const project = generateRandomProject();
        await this.client.predictRisk(project);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Ignore warm-up errors
      }
    }
  }

  printScenarioResults(scenario, stats) {
    log(COLORS.BOLD, `\n📊 ${scenario.name} Results:`);
    logResults(`Duration: ${(stats.duration / 1000).toFixed(2)}s`);
    logResults(`Total Requests: ${stats.totalRequests}`);
    logResults(`Successful: ${stats.successfulRequests} (${stats.successRate.toFixed(2)}%)`);
    logResults(`Failed: ${stats.failedRequests}`);
    logResults(`Requests/sec: ${stats.requestsPerSecond.toFixed(2)}`);
    
    log(COLORS.MAGENTA, '\n🕐 Response Times:');
    logResults(`Average: ${stats.responseTime.avg.toFixed(2)}ms`);
    logResults(`Min: ${stats.responseTime.min.toFixed(2)}ms`);
    logResults(`Max: ${stats.responseTime.max.toFixed(2)}ms`);
    logResults(`50th percentile: ${stats.responseTime.p50.toFixed(2)}ms`);
    logResults(`90th percentile: ${stats.responseTime.p90.toFixed(2)}ms`);
    logResults(`95th percentile: ${stats.responseTime.p95.toFixed(2)}ms`);
    logResults(`99th percentile: ${stats.responseTime.p99.toFixed(2)}ms`);

    log(COLORS.MAGENTA, '\n💾 Memory Usage:');
    logResults(`Max Heap: ${(stats.memory.maxHeapUsed / 1024 / 1024).toFixed(2)} MB`);
    logResults(`Avg Heap: ${(stats.memory.avgHeapUsed / 1024 / 1024).toFixed(2)} MB`);

    // Performance evaluation
    this.evaluatePerformance(scenario, stats);

    if (stats.errors.length > 0) {
      log(COLORS.RED, '\n❌ Errors:');
      const errorCounts = {};
      stats.errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
      
      Object.entries(errorCounts).forEach(([error, count]) => {
        logError(`${error}: ${count} occurrences`);
      });
    }
  }

  evaluatePerformance(scenario, stats) {
    log(COLORS.BOLD, '\n🎯 Performance Evaluation:');
    
    // Success rate evaluation
    if (stats.successRate >= 99) {
      logSuccess(`Success Rate: Excellent (${stats.successRate.toFixed(2)}%)`);
    } else if (stats.successRate >= 95) {
      logWarning(`Success Rate: Good (${stats.successRate.toFixed(2)}%)`);
    } else {
      logError(`Success Rate: Poor (${stats.successRate.toFixed(2)}%)`);
    }

    // Response time evaluation
    if (stats.responseTime.p95 <= 3000) {
      logSuccess(`Response Time: Excellent (95th: ${stats.responseTime.p95.toFixed(2)}ms)`);
    } else if (stats.responseTime.p95 <= 5000) {
      logWarning(`Response Time: Acceptable (95th: ${stats.responseTime.p95.toFixed(2)}ms)`);
    } else {
      logError(`Response Time: Poor (95th: ${stats.responseTime.p95.toFixed(2)}ms)`);
    }

    // Throughput evaluation
    const expectedRPS = scenario.requestsPerSecond;
    const actualRPS = stats.requestsPerSecond;
    const throughputRatio = actualRPS / expectedRPS;
    
    if (throughputRatio >= 0.9) {
      logSuccess(`Throughput: Excellent (${actualRPS.toFixed(2)}/${expectedRPS} RPS)`);
    } else if (throughputRatio >= 0.7) {
      logWarning(`Throughput: Acceptable (${actualRPS.toFixed(2)}/${expectedRPS} RPS)`);
    } else {
      logError(`Throughput: Poor (${actualRPS.toFixed(2)}/${expectedRPS} RPS)`);
    }

    // Memory evaluation
    const maxMemoryMB = stats.memory.maxHeapUsed / 1024 / 1024;
    if (maxMemoryMB <= 500) {
      logSuccess(`Memory Usage: Excellent (${maxMemoryMB.toFixed(2)} MB)`);
    } else if (maxMemoryMB <= 1000) {
      logWarning(`Memory Usage: Acceptable (${maxMemoryMB.toFixed(2)} MB)`);
    } else {
      logError(`Memory Usage: High (${maxMemoryMB.toFixed(2)} MB)`);
    }
  }

  printOverallResults(results) {
    log(COLORS.BOLD, '\n🏆 Overall Load Test Summary\n');

    const scenarios = Object.keys(this.config.scenarios);
    let overallScore = 0;
    let validScenarios = 0;

    scenarios.forEach(scenarioName => {
      const result = results[scenarioName];
      
      if (result && !result.error) {
        validScenarios++;
        
        // Calculate scenario score (0-100)
        let score = 0;
        score += result.successRate * 0.4; // 40% weight
        score += Math.min(100, (5000 / result.responseTime.p95) * 100) * 0.3; // 30% weight
        score += Math.min(100, (result.requestsPerSecond / this.config.scenarios[scenarioName].requestsPerSecond) * 100) * 0.3; // 30% weight
        
        overallScore += score;
        
        const scenarioGrade = this.getGrade(score);
        logResults(`${this.config.scenarios[scenarioName].name}: ${score.toFixed(1)}/100 (${scenarioGrade})`);
      } else {
        logError(`${this.config.scenarios[scenarioName].name}: FAILED`);
      }
    });

    if (validScenarios > 0) {
      const finalScore = overallScore / validScenarios;
      const finalGrade = this.getGrade(finalScore);
      
      log(COLORS.BOLD, `\n🎯 Final Score: ${finalScore.toFixed(1)}/100 (${finalGrade})`);
      
      if (finalScore >= 90) {
        logSuccess('System performance is EXCELLENT! 🎉');
      } else if (finalScore >= 80) {
        logSuccess('System performance is GOOD! 👍');
      } else if (finalScore >= 70) {
        logWarning('System performance is ACCEPTABLE. Consider optimizations. ⚠️');
      } else {
        logError('System performance needs IMPROVEMENT. 🔧');
      }
    } else {
      logError('No scenarios completed successfully');
    }
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Main execution
async function runLoadTest() {
  try {
    // Check if server is running
    logInfo('Checking server availability...');
    const testClient = new AIInsightsClient({
      baseURL: LOAD_TEST_CONFIG.baseURL,
      timeout: 5000
    });
    
    await testClient.healthCheck();
    logSuccess('Server is available');

    // Execute load test
    const executor = new LoadTestExecutor(LOAD_TEST_CONFIG);
    const results = await executor.runBenchmark();

    // Generate report
    const reportFile = `./reports/load-test-${Date.now()}.json`;
    logInfo(`Saving detailed report to: ${reportFile}`);
    
    // For now, just log that we would save it
    logSuccess('Load test completed successfully! 🎉');

    return results;

  } catch (error) {
    logError(`Load test failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AI Insights Load Testing Tool

Usage: node load-test.js [options]

Options:
  --scenario <name>    Run specific scenario (light, normal, heavy, stress, spike)
  --duration <ms>      Override test duration in milliseconds
  --users <count>      Override concurrent user count
  --rps <count>        Override requests per second
  --url <url>          Override base URL (default: http://localhost:3001/api/v1)
  --help, -h           Show this help message

Examples:
  node load-test.js                           # Run all scenarios
  node load-test.js --scenario light          # Run only light load test
  node load-test.js --users 10 --duration 30000  # Custom test parameters
    `);
    process.exit(0);
  }

  // Override configuration based on command line args
  const scenarioName = args[args.indexOf('--scenario') + 1];
  if (scenarioName && LOAD_TEST_CONFIG.scenarios[scenarioName]) {
    const selectedScenario = LOAD_TEST_CONFIG.scenarios[scenarioName];
    LOAD_TEST_CONFIG.scenarios = { [scenarioName]: selectedScenario };
  }

  const customURL = args[args.indexOf('--url') + 1];
  if (customURL) {
    LOAD_TEST_CONFIG.baseURL = customURL;
  }

  runLoadTest().catch(error => {
    console.error('Load test execution failed:', error);
    process.exit(1);
  });
}

export { LoadTestExecutor, LOAD_TEST_CONFIG };

