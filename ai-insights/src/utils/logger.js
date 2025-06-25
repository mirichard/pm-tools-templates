/**
 * Logger Utility
 * Centralized logging for AI Insights System
 */

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedMessage = typeof message === 'object' 
      ? JSON.stringify(message, null, 2) 
      : message;
    
    const argsString = args.length > 0 
      ? ' ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ')
      : '';

    return `[${timestamp}] [${level.toUpperCase()}] ${formattedMessage}${argsString}`;
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }

  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }

  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, ...args));
    }
  }

  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, ...args));
    }
  }

  // Performance logging
  time(label) {
    console.time(label);
  }

  timeEnd(label) {
    console.timeEnd(label);
  }

  // ML-specific logging methods
  modelLog(modelName, action, metrics = {}) {
    this.info(`🤖 [${modelName}] ${action}`, metrics);
  }

  predictionLog(modelName, input, output, confidence) {
    this.debug(`🔮 [${modelName}] Prediction`, {
      input: typeof input === 'object' ? Object.keys(input) : input,
      output,
      confidence
    });
  }

  trainingLog(modelName, epoch, loss, accuracy) {
    this.info(`🏋️  [${modelName}] Training - Epoch ${epoch}`, {
      loss: loss?.toFixed(4),
      accuracy: accuracy?.toFixed(4)
    });
  }

  performanceLog(operation, duration, metadata = {}) {
    this.info(`⚡ Performance: ${operation} took ${duration}ms`, metadata);
  }
}

export const logger = new Logger();

