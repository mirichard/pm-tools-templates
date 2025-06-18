/**
 * Input Validation Utilities
 * Validates API requests and project data
 */

import Joi from 'joi';
import { logger } from './logger.js';

// Project data validation schema
const projectSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().optional(),
  phase: Joi.string().valid('planning', 'development', 'testing', 'deployment', 'maintenance').optional(),
  teamSize: Joi.number().integer().min(1).max(100).default(4),
  duration: Joi.number().integer().min(1).max(365).default(60),
  budget: Joi.number().min(1000).max(10000000).default(50000),
  complexity: Joi.string().valid('low', 'medium', 'high').default('medium'),
  methodology: Joi.string().valid('agile', 'waterfall', 'hybrid').optional(),
  stakeholders: Joi.number().integer().min(1).max(50).default(5),
  requirements: Joi.number().integer().min(1).max(1000).default(20),
  features: Joi.number().integer().min(1).max(500).default(10),
  riskFactors: Joi.array().items(Joi.string()).optional(),
  teamExperience: Joi.number().min(0).max(1).default(0.5),
  technologies: Joi.array().items(Joi.string()).optional(),
  historicalData: Joi.object({
    similarProjects: Joi.number().integer().min(0).max(1000).default(10),
    successRate: Joi.number().min(0).max(1).default(0.8),
    avgDelay: Joi.number().min(0).max(1).default(0.1)
  }).optional()
});

// Sentiment analysis validation schema
const sentimentSchema = Joi.object({
  text: Joi.string().min(1).max(10000).required(),
  context: Joi.string().optional(),
  language: Joi.string().valid('en', 'es', 'fr', 'de', 'it').default('en')
});

// Historical data validation schema
const historicalDataSchema = Joi.object({
  projects: Joi.array().items(projectSchema).min(1).max(1000).required(),
  timeRange: Joi.object({
    start: Joi.date().optional(),
    end: Joi.date().optional()
  }).optional(),
  filters: Joi.object({
    methodology: Joi.string().valid('agile', 'waterfall', 'hybrid').optional(),
    complexity: Joi.string().valid('low', 'medium', 'high').optional(),
    teamSize: Joi.object({
      min: Joi.number().integer().min(1).optional(),
      max: Joi.number().integer().max(100).optional()
    }).optional()
  }).optional()
});

/**
 * Validate project data middleware
 */
export const validateProjectData = (req, res, next) => {
  try {
    const { error, value } = projectSchema.validate(req.body, {
      allowUnknown: true,
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      logger.warn('Validation error:', details);

      return res.status(400).json({
        success: false,
        error: 'Invalid project data',
        details
      });
    }

    // Set validated data back to request
    req.body = value;
    next();
  } catch (error) {
    logger.error('Validation middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation error'
    });
  }
};

/**
 * Validate sentiment data middleware
 */
export const validateSentimentData = (req, res, next) => {
  try {
    const { error, value } = sentimentSchema.validate(req.body, {
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Invalid sentiment data',
        details
      });
    }

    req.body = value;
    next();
  } catch (error) {
    logger.error('Sentiment validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation error'
    });
  }
};

/**
 * Validate historical data middleware
 */
export const validateHistoricalData = (req, res, next) => {
  try {
    const { error, value } = historicalDataSchema.validate(req.body, {
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Invalid historical data',
        details
      });
    }

    req.body = value;
    next();
  } catch (error) {
    logger.error('Historical data validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation error'
    });
  }
};

/**
 * Validate batch requests
 */
export const validateBatchRequest = (req, res, next) => {
  try {
    const { projects } = req.body;

    if (!Array.isArray(projects)) {
      return res.status(400).json({
        success: false,
        error: 'Projects must be an array'
      });
    }

    if (projects.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one project required'
      });
    }

    if (projects.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 projects allowed per batch'
      });
    }

    // Validate each project
    const validationErrors = [];
    const validatedProjects = [];

    for (let i = 0; i < projects.length; i++) {
      const { error, value } = projectSchema.validate(projects[i], {
        allowUnknown: true,
        stripUnknown: true
      });

      if (error) {
        validationErrors.push({
          index: i,
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      } else {
        validatedProjects.push(value);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation errors in batch request',
        details: validationErrors
      });
    }

    req.body.projects = validatedProjects;
    next();
  } catch (error) {
    logger.error('Batch validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation error'
    });
  }
};

/**
 * Validate API key (if authentication is enabled)
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const requiredApiKey = process.env.AI_INSIGHTS_API_KEY;

  // Skip validation if no API key is configured
  if (!requiredApiKey) {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    });
  }

  if (apiKey !== requiredApiKey) {
    logger.warn('Invalid API key attempt:', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent') 
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  next();
};

/**
 * General purpose data sanitizer
 */
export const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    return data.trim().replace(/[<>]/g, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
};

/**
 * Validate numeric ranges
 */
export const validateRange = (value, min, max, fieldName) => {
  if (typeof value !== 'number') {
    throw new Error(`${fieldName} must be a number`);
  }
  
  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  
  return true;
};

export { projectSchema, sentimentSchema, historicalDataSchema };

