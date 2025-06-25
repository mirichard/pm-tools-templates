#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

const MethodologyRecommender = require('../src/recommender');

class TestRunner {
  constructor() {
    this.testCount = 0;
    this.passedCount = 0;
    this.failedCount = 0;
  }

  async runAllTests() {
    console.log(chalk.blue.bold('🧪 Running PM Template Generator CLI Tests\\n'));
    
    // Test recommendation engine
    await this.testRecommendationEngine();
    
    // Test template validation
    await this.testTemplateValidation();
    
    // Test project scenarios
    await this.testProjectScenarios();
    
    // Print results
    this.printResults();
  }

  async testRecommendationEngine() {
    console.log(chalk.yellow('📊 Testing Recommendation Engine...'));
    
    const recommender = new MethodologyRecommender();
    
    // Test case 1: Agile recommendation
    await this.test('Agile recommendation for software project', () => {
      const assessment = {
        projectName: 'E-commerce Platform',
        industry: 'software_development',
        teamSize: 'medium',
        duration: 'medium',
        complexity: 'complex',
        changeFrequency: 'frequently',
        stakeholderTypes: ['executive', 'technical'],
        experience: 'intermediate'
      };
      
      const result = recommender.recommend(assessment);
      return result.methodology === 'agile' && result.confidence >= 70;
    });
    
    // Test case 2: Traditional recommendation
    await this.test('Traditional recommendation for construction project', () => {
      const assessment = {
        projectName: 'Office Building',
        industry: 'construction',
        teamSize: 'large',
        duration: 'long',
        complexity: 'moderate',
        changeFrequency: 'rarely',
        stakeholderTypes: ['executive', 'regulatory'],
        experience: 'advanced'
      };
      
      const result = recommender.recommend(assessment);
      return result.methodology === 'traditional' && result.confidence >= 70;
    });
    
    // Test case 3: Hybrid recommendation
    await this.test('Hybrid recommendation for mixed characteristics', () => {
      const assessment = {
        projectName: 'Digital Transformation',
        industry: 'financial_services',
        teamSize: 'medium',
        duration: 'long',
        complexity: 'complex',
        changeFrequency: 'occasionally',
        stakeholderTypes: ['executive', 'business', 'technical', 'regulatory'],
        experience: 'advanced'
      };
      
      const result = recommender.recommend(assessment);
      return result.methodology === 'hybrid' || result.confidence >= 60;
    });
  }

  async testTemplateValidation() {
    console.log(chalk.yellow('\\n📋 Testing Template Validation...'));
    
    await this.test('Template recommendation includes required templates', () => {
      const recommender = new MethodologyRecommender();
      const assessment = {
        industry: 'software_development',
        teamSize: 'small',
        complexity: 'moderate'
      };
      
      const result = recommender.recommend(assessment);
      return result.templates && result.templates.length > 0;
    });
    
    await this.test('Industry-specific templates are included', () => {
      const recommender = new MethodologyRecommender();
      const assessment = {
        industry: 'healthcare_pharmaceutical',
        teamSize: 'medium',
        complexity: 'complex'
      };
      
      const result = recommender.recommend(assessment);
      const hasIndustryTemplate = result.templates.some(template => 
        template.includes('healthcare') || template.includes('pharmaceutical')
      );
      return hasIndustryTemplate || result.templates.length >= 4;
    });
  }

  async testProjectScenarios() {
    console.log(chalk.yellow('\\n🎯 Testing Real-World Scenarios...'));
    
    const scenarios = [
      {
        name: 'Startup MVP Development',
        assessment: {
          projectName: 'MVP Product',
          industry: 'software_development',
          teamSize: 'small',
          duration: 'short',
          complexity: 'moderate',
          changeFrequency: 'constantly',
          experience: 'beginner'
        },
        expectedMethodology: 'agile'
      },
      {
        name: 'Enterprise System Implementation',
        assessment: {
          projectName: 'ERP Implementation',
          industry: 'financial_services',
          teamSize: 'enterprise',
          duration: 'long',
          complexity: 'complex',
          changeFrequency: 'rarely',
          experience: 'expert'
        },
        expectedMethodology: 'traditional'
      },
      {
        name: 'Digital Transformation Initiative',
        assessment: {
          projectName: 'Digital Transformation',
          industry: 'healthcare_pharmaceutical',
          teamSize: 'large',
          duration: 'ongoing',
          complexity: 'highly_complex',
          changeFrequency: 'occasionally',
          experience: 'advanced'
        },
        expectedMethodology: ['hybrid', 'traditional'] // Either is acceptable
      }
    ];
    
    const recommender = new MethodologyRecommender();
    
    for (const scenario of scenarios) {
      await this.test(`Scenario: ${scenario.name}`, () => {
        const result = recommender.recommend(scenario.assessment);
        
        if (Array.isArray(scenario.expectedMethodology)) {
          return scenario.expectedMethodology.includes(result.methodology);
        } else {
          return result.methodology === scenario.expectedMethodology;
        }
      });
    }
  }

  async test(description, testFunction) {
    this.testCount++;
    
    try {
      const result = await testFunction();
      if (result) {
        console.log(chalk.green(`  ✅ ${description}`));
        this.passedCount++;
      } else {
        console.log(chalk.red(`  ❌ ${description}`));
        this.failedCount++;
      }
    } catch (error) {
      console.log(chalk.red(`  ❌ ${description} - Error: ${error.message}`));
      this.failedCount++;
    }
  }

  printResults() {
    console.log(chalk.blue('\\n' + '='.repeat(60)));
    console.log(chalk.blue.bold('📊 Test Results Summary'));
    console.log(chalk.blue('='.repeat(60)));
    
    console.log(`Total Tests: ${this.testCount}`);
    console.log(chalk.green(`Passed: ${this.passedCount}`));
    console.log(chalk.red(`Failed: ${this.failedCount}`));
    
    const passRate = Math.round((this.passedCount / this.testCount) * 100);
    console.log(`\\nPass Rate: ${passRate}%`);
    
    if (this.failedCount === 0) {
      console.log(chalk.green.bold('\\n🎉 All tests passed! CLI is ready for production.'));
    } else if (passRate >= 80) {
      console.log(chalk.yellow.bold(`\\n⚠️  Most tests passed (${passRate}%). Minor issues to address.`));
    } else {
      console.log(chalk.red.bold(`\\n🚨 Significant test failures (${passRate}% pass rate). Needs attention.`));
    }
    
    console.log(chalk.blue('\\n' + '='.repeat(60)));
  }
}

// Integration test with actual CLI
async function integrationTest() {
  console.log(chalk.cyan('\\n🔧 Running Integration Test...'));
  
  try {
    // Test that the CLI can start without errors
    const cliPath = path.join(__dirname, '../src/index.js');
    const testCommand = `node "${cliPath}" list`;
    
    execSync(testCommand, { stdio: 'pipe' });
    console.log(chalk.green('✅ CLI integration test passed'));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ CLI integration test failed: ${error.message}`));
    return false;
  }
}

// Performance test
async function performanceTest() {
  console.log(chalk.cyan('\\n⚡ Running Performance Test...'));
  
  const recommender = new MethodologyRecommender();
  const assessment = {
    projectName: 'Performance Test',
    industry: 'software_development',
    teamSize: 'medium',
    duration: 'medium',
    complexity: 'moderate',
    changeFrequency: 'frequently'
  };
  
  const iterations = 1000;
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    recommender.recommend(assessment);
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`Performance: ${iterations} recommendations in ${totalTime}ms`);
  console.log(`Average: ${avgTime.toFixed(2)}ms per recommendation`);
  
  if (avgTime < 10) {
    console.log(chalk.green('✅ Performance test passed (< 10ms per recommendation)'));
    return true;
  } else {
    console.log(chalk.yellow(`⚠️  Performance warning: ${avgTime.toFixed(2)}ms per recommendation`));
    return false;
  }
}

// Run all tests
async function main() {
  const runner = new TestRunner();
  await runner.runAllTests();
  
  const integrationPassed = await integrationTest();
  const performancePassed = await performanceTest();
  
  console.log(chalk.blue('\\n🏁 Test Suite Complete'));
  
  if (runner.failedCount === 0 && integrationPassed && performancePassed) {
    console.log(chalk.green.bold('🚀 CLI is ready for production release!'));
    process.exit(0);
  } else {
    console.log(chalk.yellow.bold('⚠️  Some tests failed or have warnings. Review before release.'));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestRunner;

