/**
 * Execution Context
 * Manages the state and variables during workflow execution
 */

export class ExecutionContext {
  constructor(options = {}) {
    this.executionId = options.executionId;
    this.workflowId = options.workflowId;
    this.startTime = options.startTime || Date.now();
    this.options = options.options || {};
    
    // Execution state
    this.status = 'running';
    this.variables = new Map();
    this.steps = [];
    this.metadata = new Map();
    
    // Control flow
    this.isPaused = false;
    this.isCancelled = false;
    this.pausePromise = null;
    this.pauseResolve = null;
    
    // Initialize context with provided data
    if (options.context) {
      this.initializeContext(options.context);
    }
    
    // Built-in variables
    this.setVariable('executionId', this.executionId);
    this.setVariable('workflowId', this.workflowId);
    this.setVariable('startTime', this.startTime);
    this.setVariable('timestamp', () => Date.now());
    this.setVariable('randomId', () => Math.random().toString(36).substr(2, 9));
  }

  /**
   * Initialize context with provided data
   */
  initializeContext(context) {
    if (typeof context === 'object' && context !== null) {
      for (const [key, value] of Object.entries(context)) {
        this.setVariable(key, value);
      }
    }
  }

  /**
   * Set a variable in the execution context
   */
  setVariable(name, value) {
    // Handle function variables
    if (typeof value === 'function') {
      this.variables.set(name, value);
    } else {
      // Deep clone non-function values to prevent mutation
      this.variables.set(name, JSON.parse(JSON.stringify(value)));
    }
  }

  /**
   * Get a variable from the execution context
   */
  getVariable(name) {
    const value = this.variables.get(name);
    
    // If it's a function, call it and return the result
    if (typeof value === 'function') {
      return value();
    }
    
    // Support dot notation for nested properties
    if (name.includes('.')) {
      return this.getNestedVariable(name);
    }
    
    return value;
  }

  /**
   * Get nested variable using dot notation
   */
  getNestedVariable(path) {
    const parts = path.split('.');
    const rootVar = this.variables.get(parts[0]);
    
    if (rootVar === undefined) {
      return undefined;
    }
    
    let current = rootVar;
    for (let i = 1; i < parts.length; i++) {
      if (current === null || current === undefined) {
        return undefined;
      }
      
      if (typeof current === 'object') {
        current = current[parts[i]];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  /**
   * Check if a variable exists
   */
  hasVariable(name) {
    if (name.includes('.')) {
      return this.getNestedVariable(name) !== undefined;
    }
    return this.variables.has(name);
  }

  /**
   * Delete a variable
   */
  deleteVariable(name) {
    return this.variables.delete(name);
  }

  /**
   * Get all variables as an object
   */
  getAllVariables() {
    const result = {};
    for (const [key, value] of this.variables.entries()) {
      if (typeof value === 'function') {
        result[key] = '<function>';
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Add a completed step to the execution history
   */
  addStep(name, status, result = null, error = null, duration = 0) {
    const step = {
      name,
      status, // 'completed', 'failed', 'skipped'
      result,
      error,
      duration,
      timestamp: Date.now()
    };
    
    this.steps.push(step);
    
    // Store step result as variable if successful
    if (status === 'completed' && result !== null) {
      this.setVariable(`${name}.result`, result);
      this.setVariable(`${name}.status`, status);
      this.setVariable(`${name}.duration`, duration);
    }
    
    if (status === 'failed' && error) {
      this.setVariable(`${name}.error`, error);
      this.setVariable(`${name}.status`, status);
    }
  }

  /**
   * Get the number of executed steps
   */
  getStepCount() {
    return this.steps.length;
  }

  /**
   * Get execution duration in milliseconds
   */
  getDuration() {
    return Date.now() - this.startTime;
  }

  /**
   * Get steps by status
   */
  getStepsByStatus(status) {
    return this.steps.filter(step => step.status === status);
  }

  /**
   * Get the last executed step
   */
  getLastStep() {
    return this.steps[this.steps.length - 1] || null;
  }

  /**
   * Get a specific step by name
   */
  getStep(name) {
    return this.steps.find(step => step.name === name) || null;
  }

  /**
   * Set metadata
   */
  setMetadata(key, value) {
    this.metadata.set(key, value);
  }

  /**
   * Get metadata
   */
  getMetadata(key) {
    return this.metadata.get(key);
  }

  /**
   * Get all metadata
   */
  getAllMetadata() {
    return Object.fromEntries(this.metadata.entries());
  }

  /**
   * Pause the execution
   */
  pause() {
    if (this.isPaused || this.isCancelled) {
      return;
    }
    
    this.isPaused = true;
    this.status = 'paused';
    
    // Create a promise that will be resolved when resumed
    this.pausePromise = new Promise(resolve => {
      this.pauseResolve = resolve;
    });
  }

  /**
   * Resume the execution
   */
  resume() {
    if (!this.isPaused || this.isCancelled) {
      return;
    }
    
    this.isPaused = false;
    this.status = 'running';
    
    // Resolve the pause promise
    if (this.pauseResolve) {
      this.pauseResolve();
      this.pausePromise = null;
      this.pauseResolve = null;
    }
  }

  /**
   * Cancel the execution
   */
  cancel() {
    this.isCancelled = true;
    this.status = 'cancelled';
    
    // Resume if paused to allow cancellation to proceed
    if (this.isPaused) {
      this.resume();
    }
  }

  /**
   * Check if execution should pause
   */
  async checkPause() {
    if (this.isPaused && this.pausePromise) {
      await this.pausePromise;
    }
  }

  /**
   * Check if execution is cancelled
   */
  isCancelledExecution() {
    return this.isCancelled;
  }

  /**
   * Check if execution is paused
   */
  isPausedExecution() {
    return this.isPaused;
  }

  /**
   * Update execution status
   */
  setStatus(status) {
    this.status = status;
  }

  /**
   * Get current execution status
   */
  getStatus() {
    return this.status;
  }

  /**
   * Create a snapshot of the current execution state
   */
  createSnapshot() {
    return {
      executionId: this.executionId,
      workflowId: this.workflowId,
      startTime: this.startTime,
      status: this.status,
      variables: this.getAllVariables(),
      steps: [...this.steps],
      metadata: this.getAllMetadata(),
      duration: this.getDuration(),
      stepCount: this.getStepCount(),
      isPaused: this.isPaused,
      isCancelled: this.isCancelled
    };
  }

  /**
   * Restore execution state from a snapshot
   */
  restoreFromSnapshot(snapshot) {
    this.executionId = snapshot.executionId;
    this.workflowId = snapshot.workflowId;
    this.startTime = snapshot.startTime;
    this.status = snapshot.status;
    this.steps = [...snapshot.steps];
    this.isPaused = snapshot.isPaused;
    this.isCancelled = snapshot.isCancelled;
    
    // Restore variables
    this.variables.clear();
    for (const [key, value] of Object.entries(snapshot.variables)) {
      this.setVariable(key, value);
    }
    
    // Restore metadata
    this.metadata.clear();
    for (const [key, value] of Object.entries(snapshot.metadata)) {
      this.setMetadata(key, value);
    }
  }

  /**
   * Clone the execution context
   */
  clone() {
    const cloned = new ExecutionContext({
      executionId: this.executionId,
      workflowId: this.workflowId,
      startTime: this.startTime,
      options: this.options
    });
    
    // Copy variables
    for (const [key, value] of this.variables.entries()) {
      cloned.setVariable(key, value);
    }
    
    // Copy steps
    cloned.steps = [...this.steps];
    
    // Copy metadata
    for (const [key, value] of this.metadata.entries()) {
      cloned.setMetadata(key, value);
    }
    
    // Copy state
    cloned.status = this.status;
    cloned.isPaused = this.isPaused;
    cloned.isCancelled = this.isCancelled;
    
    return cloned;
  }

  /**
   * Export context as JSON
   */
  toJSON() {
    return {
      executionId: this.executionId,
      workflowId: this.workflowId,
      startTime: this.startTime,
      status: this.status,
      variables: this.getAllVariables(),
      steps: this.steps,
      metadata: this.getAllMetadata(),
      duration: this.getDuration(),
      stepCount: this.getStepCount(),
      isPaused: this.isPaused,
      isCancelled: this.isCancelled,
      options: this.options
    };
  }

  /**
   * Create ExecutionContext from JSON
   */
  static fromJSON(data) {
    const context = new ExecutionContext({
      executionId: data.executionId,
      workflowId: data.workflowId,
      startTime: data.startTime,
      options: data.options
    });
    
    context.status = data.status;
    context.steps = data.steps || [];
    context.isPaused = data.isPaused || false;
    context.isCancelled = data.isCancelled || false;
    
    // Restore variables
    if (data.variables) {
      for (const [key, value] of Object.entries(data.variables)) {
        context.setVariable(key, value);
      }
    }
    
    // Restore metadata
    if (data.metadata) {
      for (const [key, value] of Object.entries(data.metadata)) {
        context.setMetadata(key, value);
      }
    }
    
    return context;
  }

  /**
   * Merge another context into this one
   */
  merge(otherContext) {
    // Merge variables
    for (const [key, value] of otherContext.variables.entries()) {
      this.setVariable(key, value);
    }
    
    // Merge metadata
    for (const [key, value] of otherContext.metadata.entries()) {
      this.setMetadata(key, value);
    }
    
    // Merge steps
    this.steps.push(...otherContext.steps);
  }

  /**
   * Clear all context data
   */
  clear() {
    this.variables.clear();
    this.steps = [];
    this.metadata.clear();
    this.status = 'running';
    this.isPaused = false;
    this.isCancelled = false;
    this.pausePromise = null;
    this.pauseResolve = null;
  }

  /**
   * Get context summary for logging
   */
  getSummary() {
    const completed = this.getStepsByStatus('completed').length;
    const failed = this.getStepsByStatus('failed').length;
    const skipped = this.getStepsByStatus('skipped').length;
    
    return {
      executionId: this.executionId,
      workflowId: this.workflowId,
      status: this.status,
      duration: this.getDuration(),
      totalSteps: this.getStepCount(),
      completed,
      failed,
      skipped,
      variableCount: this.variables.size,
      metadataCount: this.metadata.size
    };
  }
}

