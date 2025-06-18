/**
 * API Metrics Middleware
 * Collects performance and usage metrics
 */

import { logger } from '../utils/logger.js';

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        byEndpoint: new Map(),
        byMethod: new Map(),
        byStatus: new Map()
      },
      performance: {
        totalTime: 0,
        averageTime: 0,
        slowestRequest: { path: '', duration: 0 },
        fastestRequest: { path: '', duration: Infinity }
      },
      errors: {
        total: 0,
        byType: new Map(),
        recent: []
      },
      ai: {
        predictions: 0,
        totalPredictionTime: 0,
        averagePredictionTime: 0,
        byModel: new Map()
      }
    };
    
    this.startTime = Date.now();
    this.activeRequests = new Map();
  }

  /**
   * Record request start
   */
  startRequest(req) {
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    
    req.requestId = requestId;
    req.startTime = startTime;
    
    this.activeRequests.set(requestId, {
      method: req.method,
      path: req.path,
      startTime,
      ip: req.ip
    });
    
    return requestId;
  }

  /**
   * Record request completion
   */
  completeRequest(req, res) {
    const endTime = Date.now();
    const duration = endTime - req.startTime;
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    
    // Update request metrics
    this.metrics.requests.total++;
    this.updateMapCount(this.metrics.requests.byEndpoint, endpoint);
    this.updateMapCount(this.metrics.requests.byMethod, req.method);
    this.updateMapCount(this.metrics.requests.byStatus, res.statusCode);
    
    // Update performance metrics
    this.metrics.performance.totalTime += duration;
    this.metrics.performance.averageTime = 
      this.metrics.performance.totalTime / this.metrics.requests.total;
    
    // Track fastest/slowest requests
    if (duration > this.metrics.performance.slowestRequest.duration) {
      this.metrics.performance.slowestRequest = { 
        path: endpoint, 
        duration,
        timestamp: new Date().toISOString()
      };
    }
    
    if (duration < this.metrics.performance.fastestRequest.duration) {
      this.metrics.performance.fastestRequest = { 
        path: endpoint, 
        duration,
        timestamp: new Date().toISOString()
      };
    }
    
    // Record error if status indicates failure
    if (res.statusCode >= 400) {
      this.recordError(req, res, duration);
    }
    
    // Clean up active request
    this.activeRequests.delete(req.requestId);
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected:', {
        endpoint,
        duration,
        status: res.statusCode,
        ip: req.ip
      });
    }
  }

  /**
   * Record AI prediction metrics
   */
  recordAIPrediction(model, duration, success = true) {
    this.metrics.ai.predictions++;
    
    if (success) {
      this.metrics.ai.totalPredictionTime += duration;
      this.metrics.ai.averagePredictionTime = 
        this.metrics.ai.totalPredictionTime / this.metrics.ai.predictions;
    }
    
    // Track by model
    const modelStats = this.metrics.ai.byModel.get(model) || {
      predictions: 0,
      successes: 0,
      failures: 0,
      totalTime: 0,
      averageTime: 0
    };
    
    modelStats.predictions++;
    if (success) {
      modelStats.successes++;
      modelStats.totalTime += duration;
      modelStats.averageTime = modelStats.totalTime / modelStats.successes;
    } else {
      modelStats.failures++;
    }
    
    this.metrics.ai.byModel.set(model, modelStats);
  }

  /**
   * Record error
   */
  recordError(req, res, duration) {
    this.metrics.errors.total++;
    
    const errorType = this.getErrorType(res.statusCode);
    this.updateMapCount(this.metrics.errors.byType, errorType);
    
    // Keep recent errors (last 100)
    this.metrics.errors.recent.unshift({
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    if (this.metrics.errors.recent.length > 100) {
      this.metrics.errors.recent = this.metrics.errors.recent.slice(0, 100);
    }
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    
    return {
      uptime,
      timestamp: new Date().toISOString(),
      requests: {
        ...this.metrics.requests,
        byEndpoint: Object.fromEntries(this.metrics.requests.byEndpoint),
        byMethod: Object.fromEntries(this.metrics.requests.byMethod),
        byStatus: Object.fromEntries(this.metrics.requests.byStatus),
        active: this.activeRequests.size,
        rps: this.metrics.requests.total / (uptime / 1000) // requests per second
      },
      performance: {
        ...this.metrics.performance,
        averageTime: Math.round(this.metrics.performance.averageTime * 100) / 100
      },
      errors: {
        ...this.metrics.errors,
        byType: Object.fromEntries(this.metrics.errors.byType),
        errorRate: this.metrics.requests.total > 0 ? 
          (this.metrics.errors.total / this.metrics.requests.total * 100).toFixed(2) : 0
      },
      ai: {
        ...this.metrics.ai,
        byModel: Object.fromEntries(this.metrics.ai.byModel),
        averagePredictionTime: Math.round(this.metrics.ai.averagePredictionTime * 100) / 100,
        successRate: this.metrics.ai.predictions > 0 ?
          ((this.metrics.ai.predictions - this.getFailedPredictions()) / this.metrics.ai.predictions * 100).toFixed(2) : 0
      },
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        nodeVersion: process.version,
        platform: process.platform
      }
    };
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = {
      requests: {
        total: 0,
        byEndpoint: new Map(),
        byMethod: new Map(),
        byStatus: new Map()
      },
      performance: {
        totalTime: 0,
        averageTime: 0,
        slowestRequest: { path: '', duration: 0 },
        fastestRequest: { path: '', duration: Infinity }
      },
      errors: {
        total: 0,
        byType: new Map(),
        recent: []
      },
      ai: {
        predictions: 0,
        totalPredictionTime: 0,
        averagePredictionTime: 0,
        byModel: new Map()
      }
    };
    
    this.startTime = Date.now();
    this.activeRequests.clear();
    
    logger.info('Metrics reset');
  }

  // Helper methods
  updateMapCount(map, key) {
    map.set(key, (map.get(key) || 0) + 1);
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getErrorType(statusCode) {
    if (statusCode >= 400 && statusCode < 500) {
      return 'client_error';
    } else if (statusCode >= 500) {
      return 'server_error';
    }
    return 'unknown';
  }

  getFailedPredictions() {
    let failed = 0;
    for (const [, stats] of this.metrics.ai.byModel) {
      failed += stats.failures;
    }
    return failed;
  }
}

// Create singleton instance
const metricsCollector = new MetricsCollector();

/**
 * Metrics middleware
 */
export const apiMetrics = (req, res, next) => {
  // Start tracking request
  metricsCollector.startRequest(req);
  
  // Hook into response finish event
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);
    
    // Record completion
    metricsCollector.completeRequest(req, res);
  };
  
  next();
};

/**
 * AI prediction metrics recorder
 */
export const recordAIMetrics = (model, duration, success = true) => {
  metricsCollector.recordAIPrediction(model, duration, success);
};

/**
 * Get metrics endpoint handler
 */
export const getMetrics = (req, res) => {
  const metrics = metricsCollector.getMetrics();
  res.json({
    success: true,
    data: metrics
  });
};

/**
 * Reset metrics endpoint handler
 */
export const resetMetrics = (req, res) => {
  metricsCollector.reset();
  res.json({
    success: true,
    message: 'Metrics reset successfully'
  });
};

/**
 * Health check with basic metrics
 */
export const healthWithMetrics = (req, res) => {
  const metrics = metricsCollector.getMetrics();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: metrics.uptime,
    requests: {
      total: metrics.requests.total,
      active: metrics.requests.active,
      rps: metrics.requests.rps
    },
    errors: {
      total: metrics.errors.total,
      rate: metrics.errors.errorRate
    },
    ai: {
      predictions: metrics.ai.predictions,
      avgTime: metrics.ai.averagePredictionTime,
      successRate: metrics.ai.successRate
    },
    memory: metrics.system.memory
  });
};

export { metricsCollector };

