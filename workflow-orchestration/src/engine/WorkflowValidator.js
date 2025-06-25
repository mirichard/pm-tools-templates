/**
 * Workflow Validator
 * Validates workflow definitions for correctness and completeness
 */

export class WorkflowValidator {
  constructor() {
    this.requiredFields = {
      workflow: ['id', 'name', 'version', 'steps'],
      step: ['name', 'type'],
      branch: ['condition', 'steps'],
      parallel: ['steps']
    };

    this.validStepTypes = [
      'http-request', 'email-notification', 'slack-message', 'jira-update',
      'github-action', 'delay', 'log-message', 'data-transform', 'condition-check',
      'parallel', 'branch'
    ];
  }

  /**
   * Validate a complete workflow definition
   */
  async validate(workflowDefinition) {
    const errors = [];
    const warnings = [];

    try {
      // Basic structure validation
      this.validateWorkflowStructure(workflowDefinition, errors);
      
      // Steps validation
      if (workflowDefinition.steps) {
        this.validateSteps(workflowDefinition.steps, errors, warnings);
      }
      
      // Conditional logic validation
      this.validateConditionalLogic(workflowDefinition, errors);
      
      // Dependency validation
      this.validateDependencies(workflowDefinition, errors);
      
      // Performance validation
      this.validatePerformance(workflowDefinition, warnings);

      return {
        valid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return {
        valid: false,
        errors,
        warnings
      };
    }
  }

  /**
   * Validate basic workflow structure
   */
  validateWorkflowStructure(workflow, errors) {
    if (!workflow || typeof workflow !== 'object') {
      errors.push('Workflow definition must be an object');
      return;
    }

    // Check required fields
    for (const field of this.requiredFields.workflow) {
      if (!workflow[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate field types
    if (workflow.id && typeof workflow.id !== 'string') {
      errors.push('Workflow ID must be a string');
    }

    if (workflow.name && typeof workflow.name !== 'string') {
      errors.push('Workflow name must be a string');
    }

    if (workflow.version && typeof workflow.version !== 'string') {
      errors.push('Workflow version must be a string');
    }

    if (workflow.steps && !Array.isArray(workflow.steps)) {
      errors.push('Workflow steps must be an array');
    }

    if (workflow.timeout && typeof workflow.timeout !== 'number') {
      errors.push('Workflow timeout must be a number');
    }

    if (workflow.retryCount && typeof workflow.retryCount !== 'number') {
      errors.push('Workflow retryCount must be a number');
    }
  }

  /**
   * Validate workflow steps
   */
  validateSteps(steps, errors, warnings) {
    if (!Array.isArray(steps)) {
      errors.push('Steps must be an array');
      return;
    }

    if (steps.length === 0) {
      errors.push('Workflow must have at least one step');
      return;
    }

    const stepNames = new Set();
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepPrefix = `Step ${i + 1}`;

      // Check required fields
      for (const field of this.requiredFields.step) {
        if (!step[field]) {
          errors.push(`${stepPrefix}: Missing required field: ${field}`);
        }
      }

      // Validate step name uniqueness
      if (step.name) {
        if (stepNames.has(step.name)) {
          errors.push(`${stepPrefix}: Duplicate step name: ${step.name}`);
        } else {
          stepNames.add(step.name);
        }
      }

      // Validate step type
      if (step.type && !this.validStepTypes.includes(step.type)) {
        errors.push(`${stepPrefix}: Invalid step type: ${step.type}`);
      }

      // Validate step-specific configurations
      this.validateStepConfiguration(step, errors, warnings, stepPrefix);

      // Validate parallel steps
      if (step.type === 'parallel' && step.parallel) {
        this.validateSteps(step.parallel, errors, warnings);
      }

      // Validate branch steps
      if (step.type === 'branch' && step.branches) {
        this.validateBranches(step.branches, errors, warnings);
      }
    }
  }

  /**
   * Validate individual step configuration
   */
  validateStepConfiguration(step, errors, warnings, stepPrefix) {
    // Validate parameters
    if (step.parameters && typeof step.parameters !== 'object') {
      errors.push(`${stepPrefix}: Parameters must be an object`);
    }

    // Validate timeout
    if (step.timeout && typeof step.timeout !== 'number') {
      errors.push(`${stepPrefix}: Timeout must be a number`);
    }

    // Validate retry configuration
    if (step.retryCount && typeof step.retryCount !== 'number') {
      errors.push(`${stepPrefix}: RetryCount must be a number`);
    }

    if (step.retryDelay && typeof step.retryDelay !== 'number') {
      errors.push(`${stepPrefix}: RetryDelay must be a number`);
    }

    // Validate conditional logic
    if (step.condition) {
      this.validateCondition(step.condition, errors, `${stepPrefix} condition`);
    }

    // Validate output variable
    if (step.outputVariable && typeof step.outputVariable !== 'string') {
      errors.push(`${stepPrefix}: OutputVariable must be a string`);
    }

    // Validate continue on error
    if (step.continueOnError && typeof step.continueOnError !== 'boolean') {
      errors.push(`${stepPrefix}: ContinueOnError must be a boolean`);
    }

    // Type-specific validation
    this.validateStepTypeSpecific(step, errors, warnings, stepPrefix);
  }

  /**
   * Validate type-specific step configurations
   */
  validateStepTypeSpecific(step, errors, warnings, stepPrefix) {
    switch (step.type) {
      case 'http-request':
        this.validateHttpRequestStep(step, errors, warnings, stepPrefix);
        break;
      case 'email-notification':
        this.validateEmailStep(step, errors, warnings, stepPrefix);
        break;
      case 'slack-message':
        this.validateSlackStep(step, errors, warnings, stepPrefix);
        break;
      case 'jira-update':
        this.validateJiraStep(step, errors, warnings, stepPrefix);
        break;
      case 'github-action':
        this.validateGitHubStep(step, errors, warnings, stepPrefix);
        break;
      case 'delay':
        this.validateDelayStep(step, errors, warnings, stepPrefix);
        break;
      case 'data-transform':
        this.validateDataTransformStep(step, errors, warnings, stepPrefix);
        break;
    }
  }

  /**
   * Validate HTTP request step
   */
  validateHttpRequestStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.url) {
      errors.push(`${stepPrefix}: HTTP request requires URL parameter`);
    }

    if (params.method && !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(params.method)) {
      errors.push(`${stepPrefix}: Invalid HTTP method: ${params.method}`);
    }

    if (params.timeout && typeof params.timeout !== 'number') {
      errors.push(`${stepPrefix}: HTTP timeout must be a number`);
    }

    if (params.retries && typeof params.retries !== 'number') {
      errors.push(`${stepPrefix}: HTTP retries must be a number`);
    }
  }

  /**
   * Validate email notification step
   */
  validateEmailStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.to) {
      errors.push(`${stepPrefix}: Email notification requires 'to' parameter`);
    }

    if (!params.subject) {
      errors.push(`${stepPrefix}: Email notification requires 'subject' parameter`);
    }

    if (!params.body && !params.template) {
      errors.push(`${stepPrefix}: Email notification requires either 'body' or 'template' parameter`);
    }
  }

  /**
   * Validate Slack message step
   */
  validateSlackStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.channel && !params.user) {
      errors.push(`${stepPrefix}: Slack message requires either 'channel' or 'user' parameter`);
    }

    if (!params.text && !params.blocks) {
      errors.push(`${stepPrefix}: Slack message requires either 'text' or 'blocks' parameter`);
    }
  }

  /**
   * Validate JIRA update step
   */
  validateJiraStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.issueKey && !params.projectKey) {
      errors.push(`${stepPrefix}: JIRA update requires either 'issueKey' or 'projectKey' parameter`);
    }

    if (!params.action) {
      errors.push(`${stepPrefix}: JIRA update requires 'action' parameter`);
    }
  }

  /**
   * Validate GitHub action step
   */
  validateGitHubStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.repository) {
      errors.push(`${stepPrefix}: GitHub action requires 'repository' parameter`);
    }

    if (!params.action) {
      errors.push(`${stepPrefix}: GitHub action requires 'action' parameter`);
    }
  }

  /**
   * Validate delay step
   */
  validateDelayStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.duration) {
      errors.push(`${stepPrefix}: Delay step requires 'duration' parameter`);
    }

    if (params.duration && typeof params.duration !== 'number') {
      errors.push(`${stepPrefix}: Delay duration must be a number`);
    }
  }

  /**
   * Validate data transform step
   */
  validateDataTransformStep(step, errors, warnings, stepPrefix) {
    const params = step.parameters || {};
    
    if (!params.transformation && !params.script) {
      errors.push(`${stepPrefix}: Data transform requires either 'transformation' or 'script' parameter`);
    }
  }

  /**
   * Validate branch configurations
   */
  validateBranches(branches, errors, warnings) {
    if (!Array.isArray(branches)) {
      errors.push('Branches must be an array');
      return;
    }

    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      const branchPrefix = `Branch ${i + 1}`;

      // Check required fields
      for (const field of this.requiredFields.branch) {
        if (!branch[field]) {
          errors.push(`${branchPrefix}: Missing required field: ${field}`);
        }
      }

      // Validate branch condition
      if (branch.condition) {
        this.validateCondition(branch.condition, errors, `${branchPrefix} condition`);
      }

      // Validate branch steps
      if (branch.steps) {
        this.validateSteps(branch.steps, errors, warnings);
      }
    }
  }

  /**
   * Validate conditional logic
   */
  validateConditionalLogic(workflow, errors) {
    // Check for circular dependencies in conditions
    const stepNames = new Set();
    const dependencies = new Map();

    if (workflow.steps) {
      for (const step of workflow.steps) {
        stepNames.add(step.name);
        
        if (step.condition) {
          const deps = this.extractConditionDependencies(step.condition);
          dependencies.set(step.name, deps);
        }
      }

      // Check if condition dependencies exist
      for (const [stepName, deps] of dependencies) {
        for (const dep of deps) {
          if (!stepNames.has(dep)) {
            errors.push(`Step "${stepName}" has condition dependency on non-existent step: ${dep}`);
          }
        }
      }
    }
  }

  /**
   * Validate condition syntax
   */
  validateCondition(condition, errors, prefix) {
    if (typeof condition === 'string') {
      // Simple string condition - check for basic syntax
      if (condition.trim() === '') {
        errors.push(`${prefix}: Condition cannot be empty`);
      }
    } else if (typeof condition === 'object') {
      // Object-based condition
      if (!condition.expression && !condition.operator) {
        errors.push(`${prefix}: Condition object must have either 'expression' or 'operator' property`);
      }
    } else {
      errors.push(`${prefix}: Condition must be a string or object`);
    }
  }

  /**
   * Extract dependencies from condition
   */
  extractConditionDependencies(condition) {
    const dependencies = new Set();
    
    if (typeof condition === 'string') {
      // Extract variable references like {{stepName.result}}
      const matches = condition.match(/\{\{([^.}]+)\./g);
      if (matches) {
        for (const match of matches) {
          const stepName = match.replace(/\{\{([^.]+)\..*/, '$1');
          dependencies.add(stepName);
        }
      }
    }
    
    return Array.from(dependencies);
  }

  /**
   * Validate step dependencies
   */
  validateDependencies(workflow, errors) {
    if (!workflow.steps) return;

    const stepNames = new Set(workflow.steps.map(s => s.name));
    
    for (const step of workflow.steps) {
      // Check dependencies in parameters
      if (step.parameters) {
        const paramStr = JSON.stringify(step.parameters);
        const matches = paramStr.match(/\{\{([^.}]+)\./g);
        
        if (matches) {
          for (const match of matches) {
            const depName = match.replace(/\{\{([^.]+)\..*/, '$1');
            if (!stepNames.has(depName)) {
              errors.push(`Step "${step.name}" depends on non-existent step: ${depName}`);
            }
          }
        }
      }
    }
  }

  /**
   * Validate performance considerations
   */
  validatePerformance(workflow, warnings) {
    if (!workflow.steps) return;

    // Check for too many parallel steps
    for (const step of workflow.steps) {
      if (step.type === 'parallel' && step.parallel && step.parallel.length > 20) {
        warnings.push(`Step "${step.name}" has ${step.parallel.length} parallel operations, which may impact performance`);
      }
    }

    // Check for very long workflows
    if (workflow.steps.length > 50) {
      warnings.push(`Workflow has ${workflow.steps.length} steps, consider breaking into smaller workflows`);
    }

    // Check for missing timeouts
    for (const step of workflow.steps) {
      if (['http-request', 'email-notification', 'slack-message'].includes(step.type) && !step.timeout && !workflow.timeout) {
        warnings.push(`Step "${step.name}" of type "${step.type}" should have a timeout configured`);
      }
    }
  }

  /**
   * Validate a single step in isolation
   */
  validateStep(step) {
    const errors = [];
    const warnings = [];

    this.validateStepConfiguration(step, errors, warnings, 'Step');

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get validation schema for a step type
   */
  getStepSchema(stepType) {
    const baseSchema = {
      name: { type: 'string', required: true },
      type: { type: 'string', required: true },
      parameters: { type: 'object', required: false },
      timeout: { type: 'number', required: false },
      retryCount: { type: 'number', required: false },
      retryDelay: { type: 'number', required: false },
      condition: { type: ['string', 'object'], required: false },
      outputVariable: { type: 'string', required: false },
      continueOnError: { type: 'boolean', required: false }
    };

    // Add type-specific schema
    const typeSchemas = {
      'http-request': {
        'parameters.url': { type: 'string', required: true },
        'parameters.method': { type: 'string', required: false, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
        'parameters.headers': { type: 'object', required: false },
        'parameters.body': { type: ['string', 'object'], required: false }
      },
      'email-notification': {
        'parameters.to': { type: 'string', required: true },
        'parameters.subject': { type: 'string', required: true },
        'parameters.body': { type: 'string', required: false },
        'parameters.template': { type: 'string', required: false }
      },
      'delay': {
        'parameters.duration': { type: 'number', required: true }
      }
    };

    return {
      ...baseSchema,
      ...(typeSchemas[stepType] || {})
    };
  }
}

