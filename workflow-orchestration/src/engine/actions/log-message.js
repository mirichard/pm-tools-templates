/**
 * Log Message Action
 * Logs messages during workflow execution
 */

export default class LogMessageAction {
  constructor() {
    this.description = 'Logs messages with configurable log levels';
    this.category = 'utility';
    this.version = '1.0.0';
    this.parameters = [
      {
        name: 'message',
        type: 'string',
        required: true,
        description: 'The message to log'
      },
      {
        name: 'level',
        type: 'string',
        required: false,
        default: 'info',
        enum: ['error', 'warn', 'info', 'debug'],
        description: 'Log level'
      },
      {
        name: 'data',
        type: 'object',
        required: false,
        description: 'Additional data to log'
      }
    ];
    this.examples = [
      {
        name: 'Simple info log',
        parameters: {
          message: 'Workflow step completed successfully',
          level: 'info'
        }
      },
      {
        name: 'Log with data',
        parameters: {
          message: 'Processing item',
          level: 'debug',
          data: {
            itemId: '{{currentItem.id}}',
            status: '{{currentItem.status}}'
          }
        }
      }
    ];
  }

  /**
   * Execute log message
   */
  async execute(parameters, context) {
    const { message, level = 'info', data } = parameters;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      executionId: context.executionId,
      workflowId: context.workflowId
    };

    if (data) {
      logEntry.data = data;
    }

    // Log to console based on level
    switch (level.toLowerCase()) {
      case 'error':
        console.error(`[${timestamp}] ERROR: ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN: ${message}`, data || '');
        break;
      case 'debug':
        console.debug(`[${timestamp}] DEBUG: ${message}`, data || '');
        break;
      default:
        console.log(`[${timestamp}] INFO: ${message}`, data || '');
    }

    return {
      logged: true,
      timestamp,
      level,
      message,
      data: data || null
    };
  }

  /**
   * Validate parameters
   */
  async validate(parameters) {
    const errors = [];
    
    if (!parameters.message || typeof parameters.message !== 'string') {
      errors.push('Message must be a non-empty string');
    }

    if (parameters.level && !['error', 'warn', 'info', 'debug'].includes(parameters.level.toLowerCase())) {
      errors.push('Level must be one of: error, warn, info, debug');
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
        message: {
          type: 'string',
          minLength: 1,
          description: 'The message to log'
        },
        level: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug'],
          default: 'info',
          description: 'Log level'
        },
        data: {
          type: 'object',
          description: 'Additional data to log'
        }
      },
      required: ['message']
    };
  }
}

