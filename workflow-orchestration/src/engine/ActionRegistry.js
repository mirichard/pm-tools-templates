/**
 * Action Registry
 * Manages workflow action types and their handlers
 */

export class ActionRegistry {
  constructor() {
    this.actions = new Map();
    this.categories = new Map();
    this.metadata = new Map();
  }

  /**
   * Initialize the action registry
   */
  async initialize() {
    // Registry is ready immediately
    return Promise.resolve();
  }

  /**
   * Register a new action type
   */
  register(actionType, actionHandler, options = {}) {
    if (!actionType || typeof actionType !== 'string') {
      throw new Error('Action type must be a non-empty string');
    }

    if (!actionHandler || typeof actionHandler.execute !== 'function') {
      throw new Error('Action handler must have an execute method');
    }

    // Validate action handler interface
    this.validateActionHandler(actionHandler);

    // Store the action
    this.actions.set(actionType, actionHandler);

    // Store metadata
    const metadata = {
      name: actionType,
      description: options.description || actionHandler.description || '',
      category: options.category || actionHandler.category || 'general',
      version: options.version || actionHandler.version || '1.0.0',
      parameters: options.parameters || actionHandler.parameters || [],
      examples: options.examples || actionHandler.examples || [],
      tags: options.tags || actionHandler.tags || [],
      registeredAt: Date.now()
    };

    this.metadata.set(actionType, metadata);

    // Update category index
    const category = metadata.category;
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category).add(actionType);

    return true;
  }

  /**
   * Validate action handler interface
   */
  validateActionHandler(handler) {
    const requiredMethods = ['execute'];
    const optionalMethods = ['validate', 'getSchema', 'cleanup'];

    for (const method of requiredMethods) {
      if (typeof handler[method] !== 'function') {
        throw new Error(`Action handler must implement ${method} method`);
      }
    }

    // Check optional methods are functions if they exist
    for (const method of optionalMethods) {
      if (handler[method] && typeof handler[method] !== 'function') {
        throw new Error(`Action handler ${method} must be a function if provided`);
      }
    }
  }

  /**
   * Unregister an action type
   */
  unregister(actionType) {
    if (!this.actions.has(actionType)) {
      return false;
    }

    const metadata = this.metadata.get(actionType);
    
    // Remove from category index
    if (metadata && metadata.category) {
      const categoryActions = this.categories.get(metadata.category);
      if (categoryActions) {
        categoryActions.delete(actionType);
        if (categoryActions.size === 0) {
          this.categories.delete(metadata.category);
        }
      }
    }

    // Remove action and metadata
    this.actions.delete(actionType);
    this.metadata.delete(actionType);

    return true;
  }

  /**
   * Get an action handler by type
   */
  getAction(actionType) {
    return this.actions.get(actionType) || null;
  }

  /**
   * Check if an action type is registered
   */
  hasAction(actionType) {
    return this.actions.has(actionType);
  }

  /**
   * Get all registered action types
   */
  getActionTypes() {
    return Array.from(this.actions.keys());
  }

  /**
   * Get actions by category
   */
  getActionsByCategory(category) {
    const categoryActions = this.categories.get(category);
    return categoryActions ? Array.from(categoryActions) : [];
  }

  /**
   * Get all categories
   */
  getCategories() {
    return Array.from(this.categories.keys());
  }

  /**
   * Get action metadata
   */
  getActionMetadata(actionType) {
    return this.metadata.get(actionType) || null;
  }

  /**
   * Get all action metadata
   */
  getAllActionMetadata() {
    const result = {};
    for (const [actionType, metadata] of this.metadata.entries()) {
      result[actionType] = metadata;
    }
    return result;
  }

  /**
   * Search actions by criteria
   */
  searchActions(criteria) {
    const results = [];
    const query = criteria.query ? criteria.query.toLowerCase() : '';
    const category = criteria.category;
    const tags = criteria.tags || [];

    for (const [actionType, metadata] of this.metadata.entries()) {
      let matches = true;

      // Query matching (name or description)
      if (query) {
        const nameMatch = actionType.toLowerCase().includes(query);
        const descMatch = metadata.description.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) {
          matches = false;
        }
      }

      // Category matching
      if (category && metadata.category !== category) {
        matches = false;
      }

      // Tag matching
      if (tags.length > 0) {
        const hasMatchingTag = tags.some(tag => 
          metadata.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          matches = false;
        }
      }

      if (matches) {
        results.push({
          actionType,
          ...metadata
        });
      }
    }

    return results;
  }

  /**
   * Validate action parameters
   */
  async validateActionParameters(actionType, parameters) {
    const action = this.getAction(actionType);
    if (!action) {
      throw new Error(`Unknown action type: ${actionType}`);
    }

    // Use action's validate method if available
    if (typeof action.validate === 'function') {
      return await action.validate(parameters);
    }

    // Basic validation based on metadata
    const metadata = this.getActionMetadata(actionType);
    if (metadata && metadata.parameters) {
      return this.validateParametersAgainstSchema(parameters, metadata.parameters);
    }

    // No validation available
    return { valid: true, errors: [], warnings: [] };
  }

  /**
   * Validate parameters against schema
   */
  validateParametersAgainstSchema(parameters, schema) {
    const errors = [];
    const warnings = [];
    const params = parameters || {};

    for (const paramDef of schema) {
      const value = params[paramDef.name];

      // Check required parameters
      if (paramDef.required && (value === undefined || value === null)) {
        errors.push(`Missing required parameter: ${paramDef.name}`);
        continue;
      }

      // Skip validation if parameter is not provided and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Type validation
      if (paramDef.type) {
        const types = Array.isArray(paramDef.type) ? paramDef.type : [paramDef.type];
        const valueType = typeof value;
        
        if (!types.includes(valueType)) {
          errors.push(`Parameter ${paramDef.name} must be of type ${types.join(' or ')}, got ${valueType}`);
        }
      }

      // Enum validation
      if (paramDef.enum && !paramDef.enum.includes(value)) {
        errors.push(`Parameter ${paramDef.name} must be one of: ${paramDef.enum.join(', ')}`);
      }

      // Min/Max validation for numbers
      if (valueType === 'number') {
        if (paramDef.min !== undefined && value < paramDef.min) {
          errors.push(`Parameter ${paramDef.name} must be at least ${paramDef.min}`);
        }
        if (paramDef.max !== undefined && value > paramDef.max) {
          errors.push(`Parameter ${paramDef.name} must be at most ${paramDef.max}`);
        }
      }

      // Length validation for strings
      if (valueType === 'string') {
        if (paramDef.minLength !== undefined && value.length < paramDef.minLength) {
          errors.push(`Parameter ${paramDef.name} must be at least ${paramDef.minLength} characters`);
        }
        if (paramDef.maxLength !== undefined && value.length > paramDef.maxLength) {
          errors.push(`Parameter ${paramDef.name} must be at most ${paramDef.maxLength} characters`);
        }
      }

      // Pattern validation for strings
      if (valueType === 'string' && paramDef.pattern) {
        const regex = new RegExp(paramDef.pattern);
        if (!regex.test(value)) {
          errors.push(`Parameter ${paramDef.name} does not match required pattern`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get action count
   */
  getActionCount() {
    return this.actions.size;
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const categories = {};
    for (const [category, actions] of this.categories.entries()) {
      categories[category] = actions.size;
    }

    return {
      totalActions: this.actions.size,
      totalCategories: this.categories.size,
      categoriesBreakdown: categories
    };
  }

  /**
   * Export registry configuration
   */
  export() {
    const result = {
      actions: {},
      categories: {},
      exportedAt: Date.now()
    };

    // Export action metadata
    for (const [actionType, metadata] of this.metadata.entries()) {
      result.actions[actionType] = metadata;
    }

    // Export category mappings
    for (const [category, actions] of this.categories.entries()) {
      result.categories[category] = Array.from(actions);
    }

    return result;
  }

  /**
   * Bulk register actions from configuration
   */
  async bulkRegister(actionConfigs) {
    const results = {
      successful: [],
      failed: []
    };

    for (const config of actionConfigs) {
      try {
        const { actionType, handler, options } = config;
        this.register(actionType, handler, options);
        results.successful.push(actionType);
      } catch (error) {
        results.failed.push({
          actionType: config.actionType,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Get action execution hints
   */
  getActionHints(actionType) {
    const metadata = this.getActionMetadata(actionType);
    if (!metadata) {
      return null;
    }

    return {
      actionType,
      description: metadata.description,
      category: metadata.category,
      parameters: metadata.parameters,
      examples: metadata.examples,
      tips: [
        'Check parameter types and requirements',
        'Consider timeout settings for long-running actions',
        'Use proper error handling with continueOnError',
        'Set output variables to capture results'
      ]
    };
  }

  /**
   * Check action compatibility
   */
  checkCompatibility(actionType, environment = {}) {
    const action = this.getAction(actionType);
    if (!action) {
      return {
        compatible: false,
        reason: 'Action not found'
      };
    }

    // Check if action has compatibility method
    if (typeof action.checkCompatibility === 'function') {
      return action.checkCompatibility(environment);
    }

    // Default compatibility check
    return {
      compatible: true,
      reason: 'No specific compatibility requirements'
    };
  }

  /**
   * Clear all registered actions
   */
  clear() {
    this.actions.clear();
    this.categories.clear();
    this.metadata.clear();
  }

  /**
   * Create a registry snapshot
   */
  createSnapshot() {
    return {
      actions: new Map(this.actions),
      categories: new Map(this.categories),
      metadata: new Map(this.metadata),
      timestamp: Date.now()
    };
  }

  /**
   * Restore from snapshot
   */
  restoreFromSnapshot(snapshot) {
    this.actions = new Map(snapshot.actions);
    this.categories = new Map(snapshot.categories);
    this.metadata = new Map(snapshot.metadata);
  }
}

