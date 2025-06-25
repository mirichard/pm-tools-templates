/**
 * Delay Action
 * Introduces delays in workflow execution
 */

export default class DelayAction {
  constructor() {
    this.description = 'Introduces a delay in workflow execution';
    this.category = 'control';
    this.version = '1.0.0';
    this.parameters = [
      {
        name: 'duration',
        type: 'number',
        required: true,
        description: 'Delay duration in milliseconds'
      },
      {
        name: 'message',
        type: 'string',
        required: false,
        description: 'Optional message to log during delay'
      }
    ];
    this.examples = [
      {
        name: 'Simple delay',
        parameters: {
          duration: 5000,
          message: 'Waiting 5 seconds before next step'
        }
      }
    ];
  }

  /**
   * Execute delay
   */
  async execute(parameters, context) {
    const { duration, message } = parameters;

    if (message) {
      console.log(`⏱️ ${message} (${duration}ms)`);
    }

    const startTime = Date.now();
    
    await new Promise(resolve => {
      setTimeout(resolve, duration);
    });

    const actualDelay = Date.now() - startTime;

    return {
      requestedDuration: duration,
      actualDuration: actualDelay,
      message: message || `Delayed for ${actualDelay}ms`
    };
  }

  /**
   * Validate parameters
   */
  async validate(parameters) {
    const errors = [];
    
    if (typeof parameters.duration !== 'number') {
      errors.push('Duration must be a number');
    } else if (parameters.duration < 0) {
      errors.push('Duration must be non-negative');
    } else if (parameters.duration > 300000) { // 5 minutes max
      errors.push('Duration cannot exceed 5 minutes (300000ms)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Get schema for this action
   */
  getSchema() {
    return {
      type: 'object',
      properties: {
        duration: {
          type: 'number',
          minimum: 0,
          maximum: 300000,
          description: 'Delay duration in milliseconds'
        },
        message: {
          type: 'string',
          description: 'Optional message to log during delay'
        }
      },
      required: ['duration']
    };
  }
}

