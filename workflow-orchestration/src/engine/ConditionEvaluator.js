/**
 * Condition Evaluator
 * Evaluates conditional expressions in workflow steps
 */

export class ConditionEvaluator {
  constructor() {
    // Supported operators
    this.operators = {
      // Comparison operators
      '==': (a, b) => a == b,
      '===': (a, b) => a === b,
      '!=': (a, b) => a != b,
      '!==': (a, b) => a !== b,
      '>': (a, b) => a > b,
      '>=': (a, b) => a >= b,
      '<': (a, b) => a < b,
      '<=': (a, b) => a <= b,
      
      // Logical operators
      '&&': (a, b) => a && b,
      '||': (a, b) => a || b,
      '!': (a) => !a,
      
      // String operators
      'contains': (a, b) => String(a).includes(String(b)),
      'startsWith': (a, b) => String(a).startsWith(String(b)),
      'endsWith': (a, b) => String(a).endsWith(String(b)),
      'matches': (a, b) => new RegExp(b).test(String(a)),
      
      // Array operators
      'in': (a, b) => Array.isArray(b) ? b.includes(a) : false,
      'notIn': (a, b) => Array.isArray(b) ? !b.includes(a) : true,
      
      // Existence operators
      'exists': (a) => a !== undefined && a !== null,
      'notExists': (a) => a === undefined || a === null,
      
      // Type operators
      'isString': (a) => typeof a === 'string',
      'isNumber': (a) => typeof a === 'number',
      'isBoolean': (a) => typeof a === 'boolean',
      'isArray': (a) => Array.isArray(a),
      'isObject': (a) => typeof a === 'object' && a !== null && !Array.isArray(a)
    };

    // Built-in functions
    this.functions = {
      // Math functions
      'abs': Math.abs,
      'ceil': Math.ceil,
      'floor': Math.floor,
      'round': Math.round,
      'max': Math.max,
      'min': Math.min,
      
      // String functions
      'toLowerCase': (s) => String(s).toLowerCase(),
      'toUpperCase': (s) => String(s).toUpperCase(),
      'trim': (s) => String(s).trim(),
      'length': (s) => Array.isArray(s) || typeof s === 'string' ? s.length : 0,
      
      // Date functions
      'now': () => Date.now(),
      'today': () => new Date().toISOString().split('T')[0],
      
      // Utility functions
      'isEmpty': (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0),
      'isNotEmpty': (v) => !this.functions.isEmpty(v)
    };
  }

  /**
   * Evaluate a condition expression
   */
  async evaluate(condition, context) {
    try {
      if (typeof condition === 'boolean') {
        return condition;
      }

      if (typeof condition === 'string') {
        return this.evaluateStringExpression(condition, context);
      }

      if (typeof condition === 'object' && condition !== null) {
        return this.evaluateObjectExpression(condition, context);
      }

      // Default to false for unsupported condition types
      return false;

    } catch (error) {
      throw new Error(`Condition evaluation failed: ${error.message}`);
    }
  }

  /**
   * Evaluate string-based expressions
   */
  evaluateStringExpression(expression, context) {
    // Interpolate variables in the expression
    const interpolated = this.interpolateVariables(expression, context);
    
    // Handle simple boolean values
    if (interpolated === 'true') return true;
    if (interpolated === 'false') return false;
    
    // Try to parse and evaluate as JavaScript expression
    return this.evaluateJavaScriptExpression(interpolated, context);
  }

  /**
   * Evaluate object-based conditions
   */
  evaluateObjectExpression(condition, context) {
    if (condition.operator) {
      return this.evaluateOperatorExpression(condition, context);
    }

    if (condition.expression) {
      return this.evaluateStringExpression(condition.expression, context);
    }

    if (condition.and) {
      return this.evaluateLogicalAnd(condition.and, context);
    }

    if (condition.or) {
      return this.evaluateLogicalOr(condition.or, context);
    }

    if (condition.not) {
      return !this.evaluate(condition.not, context);
    }

    if (condition.if) {
      return this.evaluateConditional(condition, context);
    }

    throw new Error('Invalid condition object structure');
  }

  /**
   * Evaluate operator-based expressions
   */
  evaluateOperatorExpression(condition, context) {
    const { operator, left, right } = condition;
    
    if (!this.operators[operator]) {
      throw new Error(`Unknown operator: ${operator}`);
    }

    const leftValue = this.resolveValue(left, context);
    
    // Handle unary operators
    if (operator === '!' || operator === 'exists' || operator === 'notExists' || 
        operator.startsWith('is')) {
      return this.operators[operator](leftValue);
    }

    // Handle binary operators
    const rightValue = this.resolveValue(right, context);
    return this.operators[operator](leftValue, rightValue);
  }

  /**
   * Evaluate logical AND conditions
   */
  async evaluateLogicalAnd(conditions, context) {
    for (const condition of conditions) {
      const result = await this.evaluate(condition, context);
      if (!result) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate logical OR conditions
   */
  async evaluateLogicalOr(conditions, context) {
    for (const condition of conditions) {
      const result = await this.evaluate(condition, context);
      if (result) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluate conditional (if-then-else) logic
   */
  async evaluateConditional(condition, context) {
    const ifResult = await this.evaluate(condition.if, context);
    
    if (ifResult && condition.then) {
      return this.evaluate(condition.then, context);
    } else if (!ifResult && condition.else) {
      return this.evaluate(condition.else, context);
    }
    
    return ifResult;
  }

  /**
   * Resolve a value from context or literal
   */
  resolveValue(value, context) {
    if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
      // Variable reference
      const varName = value.slice(2, -2).trim();
      return context.getVariable(varName);
    }

    if (typeof value === 'string' && value.includes('{{')) {
      // String interpolation
      return this.interpolateVariables(value, context);
    }

    if (typeof value === 'object' && value !== null && value.function) {
      // Function call
      return this.evaluateFunction(value, context);
    }

    // Literal value
    return value;
  }

  /**
   * Interpolate variables in a string
   */
  interpolateVariables(str, context) {
    return str.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const trimmedVarName = varName.trim();
      const value = context.getVariable(trimmedVarName);
      return value !== undefined ? value : match;
    });
  }

  /**
   * Evaluate JavaScript expressions safely
   */
  evaluateJavaScriptExpression(expression, context) {
    try {
      // Create a safe evaluation context
      const safeContext = this.createSafeContext(context);
      
      // Use Function constructor for safer evaluation than eval
      const func = new Function(...Object.keys(safeContext), `return (${expression})`);
      return func(...Object.values(safeContext));
      
    } catch (error) {
      throw new Error(`Invalid expression: ${expression}`);
    }
  }

  /**
   * Create a safe context for expression evaluation
   */
  createSafeContext(context) {
    const safeContext = {};
    
    // Add context variables
    for (const [key, value] of context.variables.entries()) {
      // Skip function variables for safety
      if (typeof value !== 'function') {
        safeContext[key] = value;
      }
    }
    
    // Add built-in functions
    for (const [name, func] of Object.entries(this.functions)) {
      safeContext[name] = func;
    }
    
    // Add safe Math operations
    safeContext.Math = {
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      max: Math.max,
      min: Math.min,
      pow: Math.pow,
      sqrt: Math.sqrt
    };
    
    return safeContext;
  }

  /**
   * Evaluate function calls
   */
  evaluateFunction(funcDef, context) {
    const { function: funcName, arguments: args = [] } = funcDef;
    
    if (!this.functions[funcName]) {
      throw new Error(`Unknown function: ${funcName}`);
    }
    
    // Resolve arguments
    const resolvedArgs = args.map(arg => this.resolveValue(arg, context));
    
    return this.functions[funcName](...resolvedArgs);
  }

  /**
   * Register a custom operator
   */
  registerOperator(name, implementation) {
    if (typeof implementation !== 'function') {
      throw new Error('Operator implementation must be a function');
    }
    
    this.operators[name] = implementation;
  }

  /**
   * Register a custom function
   */
  registerFunction(name, implementation) {
    if (typeof implementation !== 'function') {
      throw new Error('Function implementation must be a function');
    }
    
    this.functions[name] = implementation;
  }

  /**
   * Get available operators
   */
  getOperators() {
    return Object.keys(this.operators);
  }

  /**
   * Get available functions
   */
  getFunctions() {
    return Object.keys(this.functions);
  }

  /**
   * Validate condition syntax
   */
  validateCondition(condition) {
    const errors = [];
    
    try {
      this.validateConditionStructure(condition, errors);
    } catch (error) {
      errors.push(error.message);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate condition structure recursively
   */
  validateConditionStructure(condition, errors, path = '') {
    if (typeof condition === 'boolean' || typeof condition === 'string') {
      return; // Valid primitive conditions
    }
    
    if (typeof condition !== 'object' || condition === null) {
      errors.push(`${path}: Condition must be boolean, string, or object`);
      return;
    }
    
    const keys = Object.keys(condition);
    
    if (condition.operator) {
      if (!this.operators[condition.operator]) {
        errors.push(`${path}: Unknown operator '${condition.operator}'`);
      }
      
      if (!condition.hasOwnProperty('left')) {
        errors.push(`${path}: Operator conditions must have 'left' property`);
      }
      
      // Check if operator requires right operand
      const unaryOps = ['!', 'exists', 'notExists', 'isString', 'isNumber', 'isBoolean', 'isArray', 'isObject'];
      if (!unaryOps.includes(condition.operator) && !condition.hasOwnProperty('right')) {
        errors.push(`${path}: Operator '${condition.operator}' requires 'right' property`);
      }
    } else if (condition.and) {
      if (!Array.isArray(condition.and)) {
        errors.push(`${path}: 'and' must be an array`);
      } else {
        condition.and.forEach((subCondition, index) => {
          this.validateConditionStructure(subCondition, errors, `${path}.and[${index}]`);
        });
      }
    } else if (condition.or) {
      if (!Array.isArray(condition.or)) {
        errors.push(`${path}: 'or' must be an array`);
      } else {
        condition.or.forEach((subCondition, index) => {
          this.validateConditionStructure(subCondition, errors, `${path}.or[${index}]`);
        });
      }
    } else if (condition.not) {
      this.validateConditionStructure(condition.not, errors, `${path}.not`);
    } else if (condition.if) {
      this.validateConditionStructure(condition.if, errors, `${path}.if`);
      if (condition.then) {
        this.validateConditionStructure(condition.then, errors, `${path}.then`);
      }
      if (condition.else) {
        this.validateConditionStructure(condition.else, errors, `${path}.else`);
      }
    } else if (condition.expression) {
      if (typeof condition.expression !== 'string') {
        errors.push(`${path}: 'expression' must be a string`);
      }
    } else {
      errors.push(`${path}: Invalid condition structure`);
    }
  }

  /**
   * Create condition examples for documentation
   */
  getConditionExamples() {
    return {
      string: [
        "{{status}} === 'completed'",
        "{{score}} > 80",
        "{{name}} contains 'test'"
      ],
      object: [
        {
          operator: '===',
          left: '{{status}}',
          right: 'completed'
        },
        {
          and: [
            { operator: '>', left: '{{score}}', right: 80 },
            { operator: '===', left: '{{approved}}', right: true }
          ]
        },
        {
          or: [
            { operator: '===', left: '{{priority}}', right: 'high' },
            { operator: '===', left: '{{urgent}}', right: true }
          ]
        },
        {
          if: { operator: '>', left: '{{attempts}}', right: 3 },
          then: false,
          else: true
        }
      ],
      functions: [
        {
          operator: '>',
          left: { function: 'length', arguments: ['{{items}}'] },
          right: 0
        },
        {
          operator: '===',
          left: { function: 'toLowerCase', arguments: ['{{status}}'] },
          right: 'success'
        }
      ]
    };
  }
}

