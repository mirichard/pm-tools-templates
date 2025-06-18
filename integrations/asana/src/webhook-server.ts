import express, { Request, Response, NextFunction } from 'express';
import { createHash, createHmac } from 'crypto';
import { EventEmitter } from 'events';
import winston from 'winston';
import Joi from 'joi';
import { AsanaSyncEngine, WebhookEvent } from './sync-engine';
import { AsanaConnector } from './connector';

// Webhook payload validation schema
const webhookEventSchema = Joi.object({
  gid: Joi.string().required(),
  resource: Joi.object({
    gid: Joi.string().required(),
    resource_type: Joi.string().required(),
    resource_subtype: Joi.string().optional()
  }).required(),
  user: Joi.object({
    gid: Joi.string().required(),
    name: Joi.string().required()
  }).required(),
  created_at: Joi.string().isoDate().required(),
  type: Joi.string().required(),
  action: Joi.string().required(),
  parent: Joi.object({
    gid: Joi.string().required(),
    resource_type: Joi.string().required()
  }).optional(),
  change: Joi.object({
    field: Joi.string().required(),
    new_value: Joi.any().optional(),
    old_value: Joi.any().optional()
  }).optional()
});

export interface WebhookServerConfig {
  port: number;
  webhookSecret: string;
  syncEngine: AsanaSyncEngine;
  connector: AsanaConnector;
  enableLogging?: boolean;
  logLevel?: string;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  cors?: {
    origin: string[];
    methods: string[];
  };
}

export interface WebhookSubscription {
  id: string;
  projectId: string;
  webhookUrl: string;
  filters: string[];
  active: boolean;
  createdAt: Date;
  lastEventAt?: Date;
  eventCount: number;
}

/**
 * Express-based webhook server for handling Asana webhook events
 */
export class AsanaWebhookServer extends EventEmitter {
  private app: express.Application;
  private server: any;
  private config: WebhookServerConfig;
  private logger: winston.Logger;
  private subscriptions: Map<string, WebhookSubscription> = new Map();
  private eventStats: Map<string, number> = new Map();

  constructor(config: WebhookServerConfig) {
    super();
    this.config = config;
    this.app = express();
    
    // Set up logging
    this.setupLogging();
    
    // Set up middleware
    this.setupMiddleware();
    
    // Set up routes
    this.setupRoutes();
    
    // Set up error handling
    this.setupErrorHandling();
  }

  /**
   * Configure logging with Winston
   */
  private setupLogging(): void {
    this.logger = winston.createLogger({
      level: this.config.logLevel || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'asana-webhook-server' },
      transports: [
        new winston.transports.File({ 
          filename: 'logs/webhook-error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/webhook-combined.log' 
        })
      ]
    });

    if (this.config.enableLogging !== false) {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  /**
   * Set up Express middleware
   */
  private setupMiddleware(): void {
    // Raw body parser for webhook signature verification
    this.app.use('/webhooks', express.raw({ type: 'application/json' }));
    
    // JSON parser for other routes
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // CORS configuration
    if (this.config.cors) {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', this.config.cors!.origin.join(','));
        res.header('Access-Control-Allow-Methods', this.config.cors!.methods.join(','));
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    // Rate limiting middleware
    if (this.config.rateLimit) {
      const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
      
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const windowMs = this.config.rateLimit!.windowMs;
        const maxRequests = this.config.rateLimit!.maxRequests;

        const clientData = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + windowMs };

        if (now > clientData.resetTime) {
          clientData.count = 1;
          clientData.resetTime = now + windowMs;
        } else {
          clientData.count++;
        }

        rateLimitMap.set(clientIp, clientData);

        if (clientData.count > maxRequests) {
          res.status(429).json({ error: 'Too many requests' });
          return;
        }

        next();
      });
    }

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      this.logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });
  }

  /**
   * Set up Express routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        subscriptions: this.subscriptions.size,
        eventStats: Object.fromEntries(this.eventStats)
      });
    });

    // Webhook endpoint for Asana
    this.app.post('/webhooks/asana', this.handleAsanaWebhook.bind(this));

    // Subscription management endpoints
    this.app.post('/subscriptions', this.createSubscription.bind(this));
    this.app.get('/subscriptions', this.getSubscriptions.bind(this));
    this.app.get('/subscriptions/:id', this.getSubscription.bind(this));
    this.app.put('/subscriptions/:id', this.updateSubscription.bind(this));
    this.app.delete('/subscriptions/:id', this.deleteSubscription.bind(this));

    // Statistics endpoint
    this.app.get('/stats', this.getStatistics.bind(this));

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
  }

  /**
   * Handle incoming Asana webhook events
   */
  private async handleAsanaWebhook(req: Request, res: Response): Promise<void> {
    try {
      const rawBody = req.body;
      const signature = req.headers['x-hook-signature'] as string;

      // Verify webhook signature
      if (!this.verifyWebhookSignature(rawBody, signature)) {
        this.logger.warn('Invalid webhook signature', { 
          signature,
          ip: req.ip 
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      // Parse webhook payload
      const webhookData = JSON.parse(rawBody.toString());

      // Validate webhook event structure
      const { error: validationError } = webhookEventSchema.validate(webhookData);
      if (validationError) {
        this.logger.warn('Invalid webhook payload', { 
          error: validationError.message,
          payload: webhookData 
        });
        res.status(400).json({ error: 'Invalid payload format' });
        return;
      }

      // Process webhook event
      await this.processWebhookEvent(webhookData as WebhookEvent);

      // Update statistics
      this.updateEventStats(webhookData.resource.resource_type, webhookData.action);

      // Send success response
      res.status(200).json({ 
        message: 'Webhook processed successfully',
        eventId: webhookData.gid,
        timestamp: new Date().toISOString()
      });

      this.logger.info('Webhook processed successfully', {
        eventId: webhookData.gid,
        resourceType: webhookData.resource.resource_type,
        action: webhookData.action
      });

    } catch (error) {
      this.logger.error('Webhook processing failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Process webhook event through sync engine
   */
  private async processWebhookEvent(webhookEvent: WebhookEvent): Promise<void> {
    try {
      // Find relevant subscriptions
      const relevantSubscriptions = this.findRelevantSubscriptions(webhookEvent);

      if (relevantSubscriptions.length === 0) {
        this.logger.debug('No relevant subscriptions found for webhook event', {
          eventId: webhookEvent.gid,
          resourceType: webhookEvent.resource.resource_type
        });
        return;
      }

      // Process through sync engine
      await this.config.syncEngine.handleAsanaWebhook(webhookEvent);

      // Update subscription stats
      relevantSubscriptions.forEach(subscription => {
        subscription.lastEventAt = new Date();
        subscription.eventCount++;
        this.subscriptions.set(subscription.id, subscription);
      });

      this.emit('webhook_processed', {
        webhookEvent,
        subscriptions: relevantSubscriptions.length
      });

    } catch (error) {
      this.emit('webhook_error', {
        webhookEvent,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Find subscriptions that match the webhook event
   */
  private findRelevantSubscriptions(webhookEvent: WebhookEvent): WebhookSubscription[] {
    const relevantSubscriptions: WebhookSubscription[] = [];

    for (const subscription of this.subscriptions.values()) {
      if (!subscription.active) continue;

      // Check if resource type matches filters
      const resourceTypeMatch = subscription.filters.length === 0 || 
        subscription.filters.includes(webhookEvent.resource.resource_type);

      // For project-specific subscriptions, check if event is from the project
      const projectMatch = !subscription.projectId || 
        webhookEvent.parent?.gid === subscription.projectId ||
        webhookEvent.resource.gid === subscription.projectId;

      if (resourceTypeMatch && projectMatch) {
        relevantSubscriptions.push(subscription);
      }
    }

    return relevantSubscriptions;
  }

  /**
   * Verify webhook signature using HMAC
   */
  private verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    if (!signature) return false;

    try {
      const expectedSignature = createHmac('sha256', this.config.webhookSecret)
        .update(rawBody)
        .digest('hex');

      // Remove 'sha256=' prefix if present
      const cleanSignature = signature.replace('sha256=', '');
      
      return cleanSignature === expectedSignature;
    } catch (error) {
      this.logger.error('Signature verification failed', { error });
      return false;
    }
  }

  /**
   * Update event statistics
   */
  private updateEventStats(resourceType: string, action: string): void {
    const key = `${resourceType}:${action}`;
    this.eventStats.set(key, (this.eventStats.get(key) || 0) + 1);
  }

  /**
   * Create new webhook subscription
   */
  private async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, webhookUrl, filters = [] } = req.body;

      if (!projectId || !webhookUrl) {
        res.status(400).json({ error: 'projectId and webhookUrl are required' });
        return;
      }

      const subscriptionId = createHash('sha256')
        .update(`${projectId}:${webhookUrl}:${Date.now()}`)
        .digest('hex')
        .substring(0, 16);

      const subscription: WebhookSubscription = {
        id: subscriptionId,
        projectId,
        webhookUrl,
        filters,
        active: true,
        createdAt: new Date(),
        eventCount: 0
      };

      this.subscriptions.set(subscriptionId, subscription);

      this.logger.info('Webhook subscription created', { subscriptionId, projectId });

      res.status(201).json({
        message: 'Subscription created successfully',
        subscription
      });

    } catch (error) {
      this.logger.error('Failed to create subscription', { error });
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }

  /**
   * Get all webhook subscriptions
   */
  private async getSubscriptions(req: Request, res: Response): Promise<void> {
    const subscriptions = Array.from(this.subscriptions.values());
    res.json({ subscriptions });
  }

  /**
   * Get specific webhook subscription
   */
  private async getSubscription(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    res.json({ subscription });
  }

  /**
   * Update webhook subscription
   */
  private async updateSubscription(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    const { webhookUrl, filters, active } = req.body;

    if (webhookUrl !== undefined) subscription.webhookUrl = webhookUrl;
    if (filters !== undefined) subscription.filters = filters;
    if (active !== undefined) subscription.active = active;

    this.subscriptions.set(id, subscription);

    this.logger.info('Webhook subscription updated', { subscriptionId: id });

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  }

  /**
   * Delete webhook subscription
   */
  private async deleteSubscription(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!this.subscriptions.has(id)) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    this.subscriptions.delete(id);

    this.logger.info('Webhook subscription deleted', { subscriptionId: id });

    res.json({ message: 'Subscription deleted successfully' });
  }

  /**
   * Get server statistics
   */
  private async getStatistics(req: Request, res: Response): Promise<void> {
    const stats = {
      subscriptions: {
        total: this.subscriptions.size,
        active: Array.from(this.subscriptions.values()).filter(s => s.active).length,
        inactive: Array.from(this.subscriptions.values()).filter(s => !s.active).length
      },
      events: Object.fromEntries(this.eventStats),
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    };

    res.json(stats);
  }

  /**
   * Set up error handling middleware
   */
  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      this.logger.error('Unhandled error', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method
      });

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal server error',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      this.shutdown();
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', { reason, promise });
    });
  }

  /**
   * Start the webhook server
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.config.port, () => {
          this.logger.info(`Asana webhook server started on port ${this.config.port}`);
          this.emit('server_started', { port: this.config.port });
          resolve();
        });

        this.server.on('error', (error: Error) => {
          this.logger.error('Server error', { error: error.message });
          this.emit('server_error', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the webhook server
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.logger.info('Asana webhook server stopped');
          this.emit('server_stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.logger.info('Initiating graceful shutdown...');
    
    try {
      await this.stop();
      
      // Close sync engine connections
      await this.config.syncEngine.shutdown();
      
      // Close Asana connector
      await this.config.connector.disconnect();
      
      this.logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during shutdown', { error });
      process.exit(1);
    }
  }

  /**
   * Get webhook server instance
   */
  getApp(): express.Application {
    return this.app;
  }

  /**
   * Get current subscriptions
   */
  getSubscriptions(): WebhookSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Get event statistics
   */
  getEventStats(): Map<string, number> {
    return new Map(this.eventStats);
  }
}

export default AsanaWebhookServer;

