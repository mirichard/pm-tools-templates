/**
 * Logger Utility
 * Provides structured logging for workflow orchestration
 */

export class Logger {
  constructor(context = 'WorkflowEngine') {
    this.context = context;
    this.logLevel = process.env.LOG_LEVEL || 'info';
    
    // Log levels (lower number = higher priority)
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
    
    this.currentLevel = this.levels[this.logLevel] !== undefined ? 
      this.levels[this.logLevel] : this.levels.info;
  }

  /**
   * Log error messages
   */
  error(message, meta = {}) {
    if (this.shouldLog('error')) {
      this.log('error', message, meta);
    }
  }

  /**
   * Log warning messages
   */
  warn(message, meta = {}) {
    if (this.shouldLog('warn')) {
      this.log('warn', message, meta);
    }
  }

  /**
   * Log info messages
   */
  info(message, meta = {}) {
    if (this.shouldLog('info')) {
      this.log('info', message, meta);
    }
  }

  /**
   * Log debug messages
   */
  debug(message, meta = {}) {
    if (this.shouldLog('debug')) {
      this.log('debug', message, meta);
    }
  }

  /**
   * Log trace messages
   */
  trace(message, meta = {}) {
    if (this.shouldLog('trace')) {
      this.log('trace', message, meta);
    }
  }

  /**
   * Check if we should log at the given level
   */
  shouldLog(level) {
    return this.levels[level] <= this.currentLevel;
  }

  /**
   * Core logging method
   */
  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      context: this.context,
      message,
      ...meta
    };

    // Format for console output
    const formattedMessage = this.formatMessage(logEntry);
    
    // Output to console based on level
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
      case 'trace':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  /**
   * Format log message for console output
   */
  formatMessage(logEntry) {
    const { timestamp, level, context, message, ...meta } = logEntry;
    
    let formatted = `[${timestamp}] ${level} [${context}] ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      formatted += ` ${JSON.stringify(meta)}`;
    }
    
    return formatted;
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext) {
    const childContext = this.context ? `${this.context}:${additionalContext}` : additionalContext;
    return new Logger(childContext);
  }

  /**
   * Set log level
   */
  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.logLevel = level;
      this.currentLevel = this.levels[level];
    }
  }

  /**
   * Get current log level
   */
  getLevel() {
    return this.logLevel;
  }
}

