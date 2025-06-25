/**
 * Advanced Workflow Orchestration Engine
 * Core system for executing complex multi-step workflows with conditional logic
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowValidator } from './WorkflowValidator.js';
import { ExecutionContext } from './ExecutionContext.js';
import { ActionRegistry } from './ActionRegistry.js';
import { ConditionEvaluator } from './ConditionEvaluator.js';
import { Logger } from '../utils/Logger.js';

export class WorkflowEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      maxConcurrentWorkflows: options.maxConcurrentWorkflows || 100,
      defaultTimeout: options.defaultTimeout || 300000, // 5 minutes
      retryAttempts: options.retryAttempts || 3,
      parallelLimit: options.parallelLimit || 10,
      enableMetrics: options.enableMetrics !== false,
      ...options
    };

    this.validator = new WorkflowValidator();
    this.actionRegistry = new ActionRegistry();
    this.conditionEvaluator = new ConditionEvaluator();
    this.logger = new Logger('WorkflowEngine');
    
    // Active workflow executions
    this.activeWorkflows = new Map();
    this.executionHistory = new Map();
    
    // Performance metrics
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      activeCount: 0
    };

    // Workflow templates cache
    this.templates = new Map();
    
    this.setupEventHandlers();
  }

  /**
   * Initialize the workflow engine
   */
  async initialize() {
    try {
      this.logger.info('🔧 Initializing Workflow Orchestration Engine...');
      
      // Initialize core components
      await this.actionRegistry.initialize();
      await this.loadBuiltinActions();
      await this.loadWorkflowTemplates();
      
      this.logger.info('✅ Workflow Engine initialized successfully');
      this.emit('engine:initialized');
      
    } catch (error) {
      this.logger.error('❌ Failed to initialize Workflow Engine:', error);
      throw error;
    }
  }

  /**
   * Execute a workflow definition
   */
  async executeWorkflow(workflowDefinition, context = {}, options = {}) {
    const executionId = uuidv4();
    const startTime = Date.now();
    
    try {
      // Validate workflow definition
      const validation = await this.validator.validate(workflowDefinition);
      if (!validation.valid) {
        throw new Error(`Invalid workflow: ${validation.errors.join(', ')}`);
      }

      // Create execution context
      const execContext = new ExecutionContext({
        executionId,
        workflowId: workflowDefinition.id,
        context,
        options: { ...this.options, ...options },
        startTime
      });

      // Track active workflow
      this.activeWorkflows.set(executionId, execContext);
      this.metrics.activeCount = this.activeWorkflows.size;
      this.metrics.totalExecutions++;

      this.logger.info(`🚀 Starting workflow execution: ${executionId}`, {
        workflowId: workflowDefinition.id,
        workflowName: workflowDefinition.name
      });

      this.emit('workflow:started', { executionId, workflowDefinition, context });

      // Execute the workflow
      const result = await this.executeSteps(workflowDefinition.steps, execContext);
      
      // Calculate execution time
      const executionTime = Date.now() - startTime;
      this.updateMetrics(true, executionTime);
      
      // Store execution history
      this.executionHistory.set(executionId, {
        ...execContext.toJSON(),
        result,
        executionTime,
        status: 'completed'
      });

      this.logger.info(`✅ Workflow completed: ${executionId}`, {
        executionTime: `${executionTime}ms`,
        stepsExecuted: execContext.getStepCount()
      });

      this.emit('workflow:completed', { executionId, result, executionTime });
      
      return {
        executionId,
        status: 'completed',
        result,
        executionTime,
        stepsExecuted: execContext.getStepCount()
      };

    } catch (error) {
      this.handleWorkflowError(executionId, error, startTime);
      throw error;
    } finally {
      // Cleanup active workflow
      this.activeWorkflows.delete(executionId);
      this.metrics.activeCount = this.activeWorkflows.size;
    }
  }

  /**
   * Execute workflow steps with conditional logic and parallel execution
   */
  async executeSteps(steps, execContext) {
    const results = [];
    
    for (const step of steps) {
      try {
        // Check if step should be executed based on conditions
        if (step.condition && !await this.evaluateCondition(step.condition, execContext)) {
          this.logger.debug(`⏭️ Skipping step: ${step.name} (condition not met)`);
          execContext.addStep(step.name, 'skipped', null, 'Condition not met');
          continue;
        }

        // Handle parallel execution
        if (step.type === 'parallel' && step.parallel) {
          const parallelResult = await this.executeParallelSteps(step.parallel, execContext);
          results.push(parallelResult);
          execContext.addStep(step.name, 'completed', parallelResult);
          continue;
        }

        // Handle conditional branching
        if (step.type === 'branch' && step.branches) {
          const branchResult = await this.executeBranch(step.branches, execContext);
          results.push(branchResult);
          execContext.addStep(step.name, 'completed', branchResult);
          continue;
        }

        // Execute single step
        const stepResult = await this.executeStep(step, execContext);
        results.push(stepResult);
        
        // Update context with step result
        if (step.outputVariable) {
          execContext.setVariable(step.outputVariable, stepResult);
        }

      } catch (error) {
        // Handle step failure based on retry configuration
        if (step.retryCount && step.retryCount > 0) {
          const retryResult = await this.retryStep(step, execContext, error);
          results.push(retryResult);
        } else if (step.continueOnError) {
          this.logger.warn(`⚠️ Step failed but continuing: ${step.name}`, { error: error.message });
          execContext.addStep(step.name, 'failed', null, error.message);
          results.push({ error: error.message, continued: true });
        } else {
          throw error;
        }
      }
    }

    return results;
  }

  /**
   * Execute a single workflow step
   */
  async executeStep(step, execContext) {
    const stepStartTime = Date.now();
    
    try {
      this.logger.debug(`🔧 Executing step: ${step.name}`, { type: step.type });
      
      // Get the action handler
      const actionHandler = this.actionRegistry.getAction(step.type);
      if (!actionHandler) {
        throw new Error(`Unknown action type: ${step.type}`);
      }

      // Prepare step parameters with context interpolation
      const parameters = this.interpolateParameters(step.parameters || {}, execContext);
      
      // Execute the action
      const result = await actionHandler.execute(parameters, execContext);
      
      const duration = Date.now() - stepStartTime;
      execContext.addStep(step.name, 'completed', result, null, duration);
      
      this.logger.debug(`✅ Step completed: ${step.name}`, { duration: `${duration}ms` });
      
      return result;

    } catch (error) {
      const duration = Date.now() - stepStartTime;
      execContext.addStep(step.name, 'failed', null, error.message, duration);
      
      this.logger.error(`❌ Step failed: ${step.name}`, { 
        error: error.message,
        duration: `${duration}ms`
      });
      
      throw error;
    }
  }

  /**
   * Execute multiple steps in parallel
   */
  async executeParallelSteps(parallelSteps, execContext) {
    const promises = parallelSteps.map(step => 
      this.executeStep(step, execContext).catch(error => ({ error: error.message, step: step.name }))
    );

    const results = await Promise.all(promises);
    
    // Check for failures
    const failures = results.filter(result => result && result.error);
    if (failures.length > 0) {
      this.logger.warn(`⚠️ Parallel execution had ${failures.length} failures`);
    }

    return results;
  }

  /**
   * Execute conditional branches
   */
  async executeBranch(branches, execContext) {
    for (const branch of branches) {
      if (await this.evaluateCondition(branch.condition, execContext)) {
        this.logger.debug(`🔀 Executing branch: ${branch.name}`);
        return await this.executeSteps(branch.steps, execContext);
      }
    }
    
    // No branch matched
    this.logger.debug('🔀 No branch condition matched, skipping');
    return null;
  }

  /**
   * Retry a failed step
   */
  async retryStep(step, execContext, originalError) {
    const maxRetries = step.retryCount || this.options.retryAttempts;
    let lastError = originalError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.info(`🔄 Retrying step: ${step.name} (attempt ${attempt}/${maxRetries})`);
        
        // Add delay before retry if specified
        if (step.retryDelay) {
          await new Promise(resolve => setTimeout(resolve, step.retryDelay));
        }
        
        const result = await this.executeStep(step, execContext);
        this.logger.info(`✅ Step retry successful: ${step.name}`);
        return result;
        
      } catch (error) {
        lastError = error;
        this.logger.warn(`❌ Step retry ${attempt} failed: ${step.name}`, { error: error.message });
      }
    }
    
    // All retries failed
    throw new Error(`Step failed after ${maxRetries} retries: ${lastError.message}`);
  }

  /**
   * Evaluate conditional logic
   */
  async evaluateCondition(condition, execContext) {
    try {
      return await this.conditionEvaluator.evaluate(condition, execContext);
    } catch (error) {
      this.logger.error('❌ Condition evaluation failed:', error);
      return false;
    }
  }

  /**
   * Interpolate parameters with context variables
   */
  interpolateParameters(parameters, execContext) {
    const interpolated = JSON.parse(JSON.stringify(parameters));
    
    const interpolateValue = (value) => {
      if (typeof value === 'string' && value.includes('{{')) {
        return value.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
          const trimmedVarName = varName.trim();
          const contextValue = execContext.getVariable(trimmedVarName);
          return contextValue !== undefined ? contextValue : match;
        });
      }
      return value;
    };

    const processObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          processObject(obj[key]);
        } else {
          obj[key] = interpolateValue(obj[key]);
        }
      }
    };

    processObject(interpolated);
    return interpolated;
  }

  /**
   * Handle workflow execution errors
   */
  handleWorkflowError(executionId, error, startTime) {
    const executionTime = Date.now() - startTime;
    this.updateMetrics(false, executionTime);
    
    // Store failed execution
    this.executionHistory.set(executionId, {
      executionId,
      status: 'failed',
      error: error.message,
      executionTime
    });

    this.logger.error(`❌ Workflow failed: ${executionId}`, { 
      error: error.message,
      executionTime: `${executionTime}ms`
    });

    this.emit('workflow:failed', { executionId, error, executionTime });
  }

  /**
   * Update performance metrics
   */
  updateMetrics(success, executionTime) {
    if (success) {
      this.metrics.successfulExecutions++;
    } else {
      this.metrics.failedExecutions++;
    }
    
    // Update average execution time
    const totalExecutions = this.metrics.successfulExecutions + this.metrics.failedExecutions;
    this.metrics.averageExecutionTime = 
      (this.metrics.averageExecutionTime * (totalExecutions - 1) + executionTime) / totalExecutions;
  }

  /**
   * Load built-in workflow actions
   */
  async loadBuiltinActions() {
    // Register built-in actions
    const builtinActions = [
      'http-request', 'email-notification', 'slack-message', 'jira-update',
      'github-action', 'delay', 'log-message', 'data-transform', 'condition-check'
    ];

    for (const actionType of builtinActions) {
      try {
        const ActionClass = await import(`./actions/${actionType}.js`);
        this.actionRegistry.register(actionType, new ActionClass.default());
        this.logger.debug(`📦 Loaded built-in action: ${actionType}`);
      } catch (error) {
        this.logger.warn(`⚠️ Failed to load built-in action: ${actionType}`, error);
      }
    }
  }

  /**
   * Load workflow templates
   */
  async loadWorkflowTemplates() {
    // Implementation for loading predefined workflow templates
    this.logger.info('📚 Loading workflow templates...');
    // Templates will be loaded from templates directory
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    this.on('workflow:started', (data) => {
      this.logger.debug('📊 Workflow started event', data.executionId);
    });

    this.on('workflow:completed', (data) => {
      this.logger.debug('📊 Workflow completed event', {
        executionId: data.executionId,
        duration: data.executionTime
      });
    });

    this.on('workflow:failed', (data) => {
      this.logger.debug('📊 Workflow failed event', {
        executionId: data.executionId,
        error: data.error.message
      });
    });
  }

  /**
   * Get workflow execution status
   */
  getExecutionStatus(executionId) {
    const active = this.activeWorkflows.get(executionId);
    if (active) {
      return {
        status: 'running',
        ...active.toJSON()
      };
    }

    const history = this.executionHistory.get(executionId);
    if (history) {
      return history;
    }

    return null;
  }

  /**
   * Get engine metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      templates: this.templates.size,
      actions: this.actionRegistry.getActionCount()
    };
  }

  /**
   * Cancel a running workflow
   */
  async cancelWorkflow(executionId) {
    const workflow = this.activeWorkflows.get(executionId);
    if (workflow) {
      workflow.cancel();
      this.activeWorkflows.delete(executionId);
      this.metrics.activeCount = this.activeWorkflows.size;
      
      this.logger.info(`🚫 Workflow cancelled: ${executionId}`);
      this.emit('workflow:cancelled', { executionId });
      
      return true;
    }
    return false;
  }

  /**
   * Pause a running workflow
   */
  async pauseWorkflow(executionId) {
    const workflow = this.activeWorkflows.get(executionId);
    if (workflow) {
      workflow.pause();
      this.logger.info(`⏸️ Workflow paused: ${executionId}`);
      this.emit('workflow:paused', { executionId });
      return true;
    }
    return false;
  }

  /**
   * Resume a paused workflow
   */
  async resumeWorkflow(executionId) {
    const workflow = this.activeWorkflows.get(executionId);
    if (workflow) {
      workflow.resume();
      this.logger.info(`▶️ Workflow resumed: ${executionId}`);
      this.emit('workflow:resumed', { executionId });
      return true;
    }
    return false;
  }

  /**
   * Shutdown the workflow engine gracefully
   */
  async shutdown() {
    this.logger.info('🔄 Shutting down Workflow Engine...');
    
    // Cancel all active workflows
    for (const [executionId] of this.activeWorkflows) {
      await this.cancelWorkflow(executionId);
    }
    
    this.logger.info('✅ Workflow Engine shutdown complete');
    this.emit('engine:shutdown');
  }
}

