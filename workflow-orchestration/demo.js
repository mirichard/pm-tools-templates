#!/usr/bin/env node

/**
 * Advanced Workflow Orchestration Engine Demo
 * Demonstrates the capabilities of the workflow engine
 */

import { 
  createWorkflowEngine, 
  WorkflowBuilder, 
  WorkflowTemplates,
  WorkflowUtils 
} from './src/index.js';

async function runDemo() {
  console.log('🚀 Advanced Workflow Orchestration Engine Demo\n');

  try {
    // Create and initialize the workflow engine
    console.log('📋 Initializing workflow engine...');
    const engine = await createWorkflowEngine({
      maxConcurrentWorkflows: 10,
      defaultTimeout: 60000
    });
    console.log('✅ Workflow engine initialized\n');

    // Demo 1: Simple test workflow
    console.log('📝 Demo 1: Simple Test Workflow');
    console.log('================================');
    
    const testWorkflow = WorkflowUtils.createTestWorkflow('demo-test');
    console.log('Workflow Definition:', JSON.stringify(testWorkflow, null, 2));
    
    const testResult = await engine.executeWorkflow(testWorkflow);
    console.log('✅ Test workflow completed:', testResult);
    console.log();

    // Demo 2: API monitoring workflow (simulated)
    console.log('📝 Demo 2: API Monitoring Workflow');
    console.log('==================================');
    
    // Create a mock API monitoring workflow
    const apiWorkflow = new WorkflowBuilder()
      .setMetadata({
        id: 'mock-api-monitoring',
        name: 'Mock API Health Check',
        description: 'Simulates API monitoring with mock responses'
      })
      .addLogMessage('start-monitoring', {
        message: 'Starting API health check for {{serviceName}}',
        level: 'info',
        data: { 
          timestamp: '{{timestamp}}',
          service: '{{serviceName}}'
        }
      })
      .addDelay('preparation', {
        duration: 500,
        message: 'Preparing health check request'
      })
      .addLogMessage('check-status', {
        message: 'API is healthy and responding',
        level: 'info',
        data: {
          responseTime: 150,
          status: 'healthy'
        }
      })
      .addLogMessage('complete-monitoring', {
        message: 'API monitoring completed successfully',
        level: 'info'
      })
      .build();

    const apiContext = {
      serviceName: 'UserService',
      endpoint: 'https://api.example.com/health'
    };

    const apiResult = await engine.executeWorkflow(apiWorkflow, apiContext);
    console.log('✅ API monitoring workflow completed:', apiResult);
    console.log();

    // Demo 3: Parallel execution workflow
    console.log('📝 Demo 3: Parallel Execution Workflow');
    console.log('=====================================');
    
    const parallelWorkflow = new WorkflowBuilder()
      .setMetadata({
        id: 'parallel-demo',
        name: 'Parallel Processing Demo',
        description: 'Demonstrates parallel step execution'
      })
      .addLogMessage('start-parallel', {
        message: 'Starting parallel processing workflow',
        level: 'info'
      })
      .addParallel('parallel-tasks', [
        {
          name: 'task-1',
          type: 'log-message',
          parameters: {
            message: 'Executing task 1',
            level: 'info'
          }
        },
        {
          name: 'task-2',
          type: 'delay',
          parameters: {
            duration: 1000,
            message: 'Task 2 processing for 1 second'
          }
        },
        {
          name: 'task-3',
          type: 'log-message',
          parameters: {
            message: 'Executing task 3',
            level: 'info'
          }
        }
      ])
      .addLogMessage('end-parallel', {
        message: 'All parallel tasks completed',
        level: 'info'
      })
      .build();

    const parallelResult = await engine.executeWorkflow(parallelWorkflow);
    console.log('✅ Parallel workflow completed:', parallelResult);
    console.log();

    // Demo 4: Conditional workflow
    console.log('📝 Demo 4: Conditional Workflow');
    console.log('===============================');
    
    const conditionalWorkflow = new WorkflowBuilder()
      .setMetadata({
        id: 'conditional-demo',
        name: 'Conditional Logic Demo',
        description: 'Demonstrates conditional step execution'
      })
      .addLogMessage('start-conditional', {
        message: 'Starting conditional workflow with environment: {{environment}}',
        level: 'info'
      })
      .addLogMessage('production-setup', {
        message: 'Running production setup procedures',
        level: 'warn'
      }, {
        operator: '===',
        left: '{{environment}}',
        right: 'production'
      })
      .addLogMessage('development-setup', {
        message: 'Running development setup procedures',
        level: 'info'
      }, {
        operator: '===',
        left: '{{environment}}',
        right: 'development'
      })
      .addLogMessage('end-conditional', {
        message: 'Conditional workflow completed',
        level: 'info'
      })
      .build();

    // Run with different contexts
    const productionResult = await engine.executeWorkflow(conditionalWorkflow, { environment: 'production' });
    console.log('✅ Production workflow completed:', productionResult);
    
    const developmentResult = await engine.executeWorkflow(conditionalWorkflow, { environment: 'development' });
    console.log('✅ Development workflow completed:', developmentResult);
    console.log();

    // Demo 5: Error handling and recovery
    console.log('📝 Demo 5: Error Handling Demo');
    console.log('=============================');
    
    const errorWorkflow = new WorkflowBuilder()
      .setMetadata({
        id: 'error-demo',
        name: 'Error Handling Demo',
        description: 'Demonstrates error handling and recovery'
      })
      .addLogMessage('start-error-demo', {
        message: 'Starting error handling demonstration',
        level: 'info'
      })
      .addLogMessage('simulate-error', {
        message: 'This step would fail in real scenario',
        level: 'warn'
      })
      .addLogMessage('recovery-step', {
        message: 'Executing recovery procedures',
        level: 'info'
      })
      .addLogMessage('end-error-demo', {
        message: 'Error handling demo completed',
        level: 'info'
      })
      .build();

    const errorResult = await engine.executeWorkflow(errorWorkflow);
    console.log('✅ Error handling workflow completed:', errorResult);
    console.log();

    // Display engine metrics
    console.log('📊 Workflow Engine Metrics');
    console.log('==========================');
    const metrics = engine.getMetrics();
    console.log(JSON.stringify(metrics, null, 2));
    console.log();

    // Shutdown the engine
    console.log('🔄 Shutting down workflow engine...');
    await engine.shutdown();
    console.log('✅ Workflow engine shutdown complete');

    console.log('\n🎉 Demo completed successfully!');
    console.log('\nKey features demonstrated:');
    console.log('• Basic workflow execution');
    console.log('• Variable interpolation');
    console.log('• Parallel step execution');
    console.log('• Conditional logic');
    console.log('• Error handling');
    console.log('• Performance metrics');
    console.log('• Graceful shutdown');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}

