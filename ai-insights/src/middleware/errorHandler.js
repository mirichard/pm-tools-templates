/**
 * Error Handling Middleware
 * Centralized error handling for API requests
 */

import { logger } from '../utils/logger.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (error, req, res, next) => {
  // Log the error
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = error.details;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.name === 'TooManyRequestsError') {
    statusCode = 429;
    message = 'Too many requests';
  } else if (error.message.includes('AI Engine not initialized')) {
    statusCode = 503;
    message = 'Service temporarily unavailable';
    details = 'AI Engine is initializing, please try again shortly';
  } else if (error.message.includes('prediction failed')) {
    statusCode = 500;
    message = 'AI prediction failed';
    details = 'Unable to generate AI insights at this time';
  }

  // Construct error response
  const errorResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Add details if available
  if (details) {
    errorResponse.details = details;
  }

  // Add request ID if available
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'POST /api/v1/insights/analyze',
      'POST /api/v1/risk/predict',
      'POST /api/v1/resources/optimize',
      'POST /api/v1/schedule/analyze',
      'POST /api/v1/quality/predict',
      'GET /api/v1/performance/metrics',
      'GET /health'
    ]
  });
};

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class TooManyRequestsError extends Error {
  constructor(message = 'Too many requests') {
    super(message);
    this.name = 'TooManyRequestsError';
  }
}

export class AIEngineError extends Error {
  constructor(message, model = null) {
    super(message);
    this.name = 'AIEngineError';
    this.model = model;
  }
}

