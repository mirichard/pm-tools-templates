/**
 * Advanced Workflow Orchestration Engine
 * Main entry point
 */

export { WorkflowEngine } from './engine/WorkflowEngine.js';
export { WorkflowValidator } from './engine/WorkflowValidator.js';
export { ExecutionContext } from './engine/ExecutionContext.js';
export { ActionRegistry } from './engine/ActionRegistry.js';
export { ConditionEvaluator } from './engine/ConditionEvaluator.js';
export { Logger } from './utils/Logger.js';

// Export built-in actions
export { default as HttpRequestAction } from './engine/actions/http-request.js';
export { default as DelayAction } from './engine/actions/delay.js';
export { default as LogMessageAction } from './engine/actions/log-message.js';

/**
 * Create and initialize a workflow engine with default configuration
 */
export async function createWorkflowEngine(options = {}) {
  const { WorkflowEngine } = await import('./engine/WorkflowEngine.js');
  
  const engine = new WorkflowEngine({
    maxConcurrentWorkflows: 50,
    defaultTimeout: 300000, // 5 minutes
    retryAttempts: 3,
    parallelLimit: 10,
    enableMetrics: true,
    ...options
  });

  await engine.initialize();
  return engine;
}

/**
 * Workflow builder utility for creating workflow definitions
 */
export class WorkflowBuilder {
  constructor() {
    this.workflow = {
      id: '',
      name: '',
      version: '1.0.0',
      description: '',
      steps: []
    };
  }

  /**
   * Set workflow metadata
   */
  setMetadata({ id, name, version = '1.0.0', description = '' }) {
    this.workflow.id = id;
    this.workflow.name = name;
    this.workflow.version = version;
    this.workflow.description = description;
    return this;
  }

  /**
   * Add a step to the workflow
   */
  addStep(step) {
    this.workflow.steps.push(step);
    return this;
  }

  /**
   * Add an HTTP request step
   */
  addHttpRequest(name, { url, method = 'GET', headers = {}, body, timeout, retries, outputVariable, condition }) {
    return this.addStep({
      name,
      type: 'http-request',
      parameters: { url, method, headers, body, timeout, retries },
      outputVariable,
      condition
    });
  }

  /**
   * Add a delay step
   */
  addDelay(name, { duration, message, condition }) {
    return this.addStep({
      name,
      type: 'delay',
      parameters: { duration, message },
      condition
    });
  }

  /**
   * Add a log message step
   */
  addLogMessage(name, { message, level = 'info', data, condition }) {
    return this.addStep({
      name,
      type: 'log-message',
      parameters: { message, level, data },
      condition
    });
  }

  /**
   * Add a parallel execution step
   */
  addParallel(name, steps, condition) {
    return this.addStep({
      name,
      type: 'parallel',
      parallel: steps,
      condition
    });
  }

  /**
   * Add a conditional branch step
   */
  addBranch(name, branches, condition) {
    return this.addStep({
      name,
      type: 'branch',
      branches,
      condition
    });
  }

  /**
   * Build and return the workflow definition
   */
  build() {
    return { ...this.workflow };
  }

  /**
   * Reset the builder
   */
  reset() {
    this.workflow = {
      id: '',
      name: '',
      version: '1.0.0',
      description: '',
      steps: []
    };
    return this;
  }
}

/**
 * Pre-defined workflow templates
 */
export const WorkflowTemplates = {
  /**
   * Simple API monitoring workflow
   */
  apiMonitoring: {
    id: 'api-monitoring',
    name: 'API Health Check',
    version: '1.0.0',
    description: 'Monitors API endpoints and logs status',
    steps: [
      {
        name: 'check-api',
        type: 'http-request',
        parameters: {
          url: '{{apiUrl}}',
          method: 'GET',
          timeout: 10000
        },
        outputVariable: 'apiResponse',
        retryCount: 2,
        retryDelay: 1000
      },
      {
        name: 'log-success',
        type: 'log-message',
        parameters: {
          message: 'API check successful',
          level: 'info',
          data: {
            url: '{{apiUrl}}',
            status: '{{apiResponse.status}}',
            responseTime: '{{apiResponse.duration}}'
          }
        },
        condition: {
          operator: '>=',
          left: '{{apiResponse.status}}',
          right: 200
        }
      },
      {
        name: 'log-failure',
        type: 'log-message',
        parameters: {
          message: 'API check failed',
          level: 'error',
          data: {
            url: '{{apiUrl}}',
            status: '{{apiResponse.status}}',
            error: '{{apiResponse.error}}'
          }
        },
        condition: {
          operator: '<',
          left: '{{apiResponse.status}}',
          right: 200
        }
      }
    ]
  },

  /**
   * Data processing pipeline
   */
  dataProcessing: {
    id: 'data-processing',
    name: 'Data Processing Pipeline',
    version: '1.0.0',
    description: 'Processes data through multiple stages',
    steps: [
      {
        name: 'fetch-data',
        type: 'http-request',
        parameters: {
          url: '{{dataSourceUrl}}',
          method: 'GET'
        },
        outputVariable: 'rawData'
      },
      {
        name: 'log-start',
        type: 'log-message',
        parameters: {
          message: 'Starting data processing',
          level: 'info',
          data: {
            recordCount: '{{rawData.data.length}}'
          }
        }
      },
      {
        name: 'process-parallel',
        type: 'parallel',
        parallel: [
          {
            name: 'validate-data',
            type: 'log-message',
            parameters: {
              message: 'Validating data structure',
              level: 'debug'
            }
          },
          {
            name: 'enrich-data',
            type: 'log-message',
            parameters: {
              message: 'Enriching data with metadata',
              level: 'debug'
            }
          }
        ]
      },
      {
        name: 'log-completion',
        type: 'log-message',
        parameters: {
          message: 'Data processing completed',
          level: 'info'
        }
      }
    ]
  }
};

/**
 * Utility functions for workflow execution
 */
export const WorkflowUtils = {
  /**
   * Execute a workflow from a template with context
   */
  async executeTemplate(engine, templateName, context = {}) {
    const template = WorkflowTemplates[templateName];
    if (!template) {
      throw new Error(`Unknown workflow template: ${templateName}`);
    }

    return await engine.executeWorkflow(template, context);
  },

  /**
   * Create a simple workflow for testing
   */
  createTestWorkflow(name = 'test-workflow') {
    return new WorkflowBuilder()
      .setMetadata({
        id: name,
        name: `Test Workflow: ${name}`,
        description: 'A simple test workflow'
      })
      .addLogMessage('start', {
        message: 'Starting test workflow',
        level: 'info'
      })
      .addDelay('wait', {
        duration: 1000,
        message: 'Waiting 1 second'
      })
      .addLogMessage('finish', {
        message: 'Test workflow completed',
        level: 'info'
      })
      .build();
  },

  /**
   * Validate workflow definition
   */
  async validateWorkflow(workflow) {
    const { WorkflowValidator } = await import('./engine/WorkflowValidator.js');
    const validator = new WorkflowValidator();
    return await validator.validate(workflow);
  }
};

