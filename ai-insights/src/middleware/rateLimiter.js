/**
 * Rate Limiting Middleware
 * Protects API from abuse and ensures fair usage
 */

import NodeCache from 'node-cache';
import { logger } from '../utils/logger.js';
import { TooManyRequestsError } from './errorHandler.js';

class RateLimiter {
  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: 60, // 1 minute default
      checkperiod: 10 // Check for expired keys every 10 seconds
    });
    
    // Rate limit configurations
    this.limits = {
      default: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100, // 100 requests per minute
        message: 'Too many requests, please try again later'
      },
      insights: {
        windowMs: 60 * 1000, // 1 minute  
        maxRequests: 20, // 20 AI insights per minute
        message: 'Too many AI insight requests, please slow down'
      },
      batch: {
        windowMs: 5 * 60 * 1000, // 5 minutes
        maxRequests: 5, // 5 batch requests per 5 minutes
        message: 'Too many batch requests, please wait before trying again'
      }
    };
  }

  /**
   * Generate cache key for rate limiting
   */
  getCacheKey(req, type = 'default') {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'unknown';
    return `${type}:${ip}:${userAgent.substring(0, 50)}`;
  }

  /**
   * Check rate limit for a request
   */
  checkLimit(req, limitType = 'default') {
    const config = this.limits[limitType] || this.limits.default;
    const key = this.getCacheKey(req, limitType);
    
    // Get current request count
    const requestCount = this.cache.get(key) || 0;
    
    // Check if limit exceeded
    if (requestCount >= config.maxRequests) {
      logger.warn('Rate limit exceeded:', {
        key,
        requests: requestCount,
        limit: config.maxRequests,
        ip: req.ip,
        endpoint: req.path
      });
      
      throw new TooManyRequestsError(config.message);
    }
    
    // Increment request count
    this.cache.set(key, requestCount + 1, config.windowMs / 1000);
    
    return {
      requests: requestCount + 1,
      limit: config.maxRequests,
      remaining: config.maxRequests - (requestCount + 1),
      resetTime: Date.now() + config.windowMs
    };
  }

  /**
   * Add rate limit headers to response
   */
  addHeaders(res, limitInfo) {
    res.set({
      'X-RateLimit-Limit': limitInfo.limit,
      'X-RateLimit-Remaining': limitInfo.remaining,
      'X-RateLimit-Reset': new Date(limitInfo.resetTime).toISOString()
    });
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(req, limitType = 'default') {
    const key = this.getCacheKey(req, limitType);
    this.cache.del(key);
    logger.info('Rate limit reset:', { key });
  }

  /**
   * Get current stats
   */
  getStats() {
    const keys = this.cache.keys();
    const stats = {
      totalKeys: keys.length,
      byType: {},
      memory: this.cache.getStats()
    };

    keys.forEach(key => {
      const type = key.split(':')[0];
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

/**
 * Default rate limiting middleware
 */
export const defaultRateLimit = (req, res, next) => {
  try {
    const limitInfo = rateLimiter.checkLimit(req, 'default');
    rateLimiter.addHeaders(res, limitInfo);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * AI insights rate limiting middleware
 */
export const insightsRateLimit = (req, res, next) => {
  try {
    const limitInfo = rateLimiter.checkLimit(req, 'insights');
    rateLimiter.addHeaders(res, limitInfo);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Batch processing rate limiting middleware
 */
export const batchRateLimit = (req, res, next) => {
  try {
    const limitInfo = rateLimiter.checkLimit(req, 'batch');
    rateLimiter.addHeaders(res, limitInfo);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Configurable rate limiting middleware factory
 */
export const createRateLimit = (limitType) => {
  return (req, res, next) => {
    try {
      const limitInfo = rateLimiter.checkLimit(req, limitType);
      rateLimiter.addHeaders(res, limitInfo);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limit bypass for development
 */
export const rateLimiter = process.env.NODE_ENV === 'development' 
  ? (req, res, next) => next() // Skip rate limiting in development
  : defaultRateLimit;

/**
 * Get rate limiter stats (for monitoring)
 */
export const getRateLimiterStats = () => {
  return rateLimiter.getStats();
};

/**
 * Reset rate limits for emergency situations
 */
export const resetRateLimit = (req, limitType) => {
  rateLimiter.reset(req, limitType);
};

export { rateLimiter as rateLimiterInstance };

