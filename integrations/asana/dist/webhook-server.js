"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsanaWebhookServer = void 0;
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const events_1 = require("events");
const express_rate_limit_1 = require("express-rate-limit");
const winston_1 = __importDefault(require("winston"));
const joi_1 = __importDefault(require("joi"));
// Webhook payload validation schema
const webhookEventSchema = joi_1.default.object({
    gid: joi_1.default.string().required(),
    resource: joi_1.default.object({
        gid: joi_1.default.string().required(),
        resource_type: joi_1.default.string().required(),
        resource_subtype: joi_1.default.string().optional()
    }).required(),
    user: joi_1.default.object({
        gid: joi_1.default.string().required(),
        name: joi_1.default.string().required()
    }).required(),
    created_at: joi_1.default.string().isoDate().required(),
    type: joi_1.default.string().required(),
    action: joi_1.default.string().required(),
    parent: joi_1.default.object({
        gid: joi_1.default.string().required(),
        resource_type: joi_1.default.string().required()
    }).optional(),
    change: joi_1.default.object({
        field: joi_1.default.string().required(),
        new_value: joi_1.default.any().optional(),
        old_value: joi_1.default.any().optional()
    }).optional()
});
/**
 * Express-based webhook server for handling Asana webhook events
 */
class AsanaWebhookServer extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.subscriptions = new Map();
        this.eventStats = new Map();
        this.config = config;
        this.app = (0, express_1.default)();
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
    setupLogging() {
        this.logger = winston_1.default.createLogger({
            level: this.config.logLevel || 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
            defaultMeta: { service: 'asana-webhook-server' },
            transports: [
                new winston_1.default.transports.File({
                    filename: 'logs/webhook-error.log',
                    level: 'error'
                }),
                new winston_1.default.transports.File({
                    filename: 'logs/webhook-combined.log'
                })
            ]
        });
        if (this.config.enableLogging !== false) {
            this.logger.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.simple()
            }));
        }
    }
    /**
     * Set up Express middleware
     */
    setupMiddleware() {
        // Raw body parser for webhook signature verification
        this.app.use('/webhooks', express_1.default.raw({ type: 'application/json' }));
        // JSON parser for other routes
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // CORS configuration
        if (this.config.cors) {
            this.app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', this.config.cors.origin.join(','));
                res.header('Access-Control-Allow-Methods', this.config.cors.methods.join(','));
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                if (req.method === 'OPTIONS') {
                    res.sendStatus(200);
                }
                else {
                    next();
                }
            });
        }
        // Rate limiting middleware
        if (this.config.rateLimit) {
            const rateLimitMap = new Map();
            this.app.use((req, res, next) => {
                const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
                const now = Date.now();
                const windowMs = this.config.rateLimit.windowMs;
                const maxRequests = this.config.rateLimit.maxRequests;
                const clientData = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + windowMs };
                if (now > clientData.resetTime) {
                    clientData.count = 1;
                    clientData.resetTime = now + windowMs;
                }
                else {
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
        // Initialize webhook-specific rate limiter using express-rate-limit
        this.webhookRateLimiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 60000, // 1 minute
            limit: 10, // Max 10 requests per minute per IP
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                this.logger.warn('Webhook rate limit exceeded', {
                    ip: req.ip,
                    url: req.url
                });
                res.status(429).json({
                    error: 'Webhook rate limit exceeded. Please slow down.',
                    retryAfter: req.rateLimit?.resetTime
                        ? Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
                        : 60
                });
            }
        });
        // Request logging
        this.app.use((req, res, next) => {
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
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                subscriptions: this.subscriptions.size,
                eventStats: Object.fromEntries(this.eventStats)
            });
        });
        // Webhook endpoint for Asana with express-rate-limit middleware
        this.app.post('/webhooks/asana', this.webhookRateLimiter, this.handleAsanaWebhook.bind(this));
        // Subscription management endpoints
        this.app.post('/subscriptions', this.createSubscription.bind(this));
        this.app.get('/subscriptions', this.getSubscriptions.bind(this));
        this.app.get('/subscriptions/:id', this.getSubscription.bind(this));
        this.app.put('/subscriptions/:id', this.updateSubscription.bind(this));
        this.app.delete('/subscriptions/:id', this.deleteSubscription.bind(this));
        // Statistics endpoint
        this.app.get('/stats', this.getStatistics.bind(this));
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({ error: 'Endpoint not found' });
        });
    }
    /**
     * Handle incoming Asana webhook events
     */
    async handleAsanaWebhook(req, res) {
        try {
            const rawBody = req.body;
            const signature = req.headers['x-hook-signature'];
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
            await this.processWebhookEvent(webhookData);
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
        }
        catch (error) {
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
    async processWebhookEvent(webhookEvent) {
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
        }
        catch (error) {
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
    findRelevantSubscriptions(webhookEvent) {
        const relevantSubscriptions = [];
        for (const subscription of this.subscriptions.values()) {
            if (!subscription.active)
                continue;
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
    verifyWebhookSignature(rawBody, signature) {
        if (!signature)
            return false;
        try {
            const expectedSignature = (0, crypto_1.createHmac)('sha256', this.config.webhookSecret)
                .update(rawBody)
                .digest('hex');
            // Remove 'sha256=' prefix if present
            const cleanSignature = signature.replace('sha256=', '');
            return cleanSignature === expectedSignature;
        }
        catch (error) {
            this.logger.error('Signature verification failed', { error });
            return false;
        }
    }
    /**
     * Update event statistics
     */
    updateEventStats(resourceType, action) {
        const key = `${resourceType}:${action}`;
        this.eventStats.set(key, (this.eventStats.get(key) || 0) + 1);
    }
    /**
     * Create new webhook subscription
     */
    async createSubscription(req, res) {
        try {
            const { projectId, webhookUrl, filters = [] } = req.body;
            if (!projectId || !webhookUrl) {
                res.status(400).json({ error: 'projectId and webhookUrl are required' });
                return;
            }
            const subscriptionId = (0, crypto_1.createHash)('sha256')
                .update(`${projectId}:${webhookUrl}:${Date.now()}`)
                .digest('hex')
                .substring(0, 16);
            const subscription = {
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
        }
        catch (error) {
            this.logger.error('Failed to create subscription', { error });
            res.status(500).json({ error: 'Failed to create subscription' });
        }
    }
    /**
     * Get all webhook subscriptions
     */
    async getSubscriptions(req, res) {
        const subscriptions = Array.from(this.subscriptions.values());
        res.json({ subscriptions });
    }
    /**
     * Get specific webhook subscription
     */
    async getSubscription(req, res) {
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
    async updateSubscription(req, res) {
        const { id } = req.params;
        const subscription = this.subscriptions.get(id);
        if (!subscription) {
            res.status(404).json({ error: 'Subscription not found' });
            return;
        }
        const { webhookUrl, filters, active } = req.body;
        if (webhookUrl !== undefined)
            subscription.webhookUrl = webhookUrl;
        if (filters !== undefined)
            subscription.filters = filters;
        if (active !== undefined)
            subscription.active = active;
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
    async deleteSubscription(req, res) {
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
    async getStatistics(req, res) {
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
    setupErrorHandling() {
        // Global error handler
        this.app.use((error, req, res, next) => {
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
        process.on('uncaughtException', (error) => {
            this.logger.error('Uncaught exception', { error: error.message, stack: error.stack });
            this.shutdown();
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            this.logger.error('Unhandled rejection', { reason, promise });
        });
    }
    /**
     * Start the webhook server
     */
    async start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.config.port, () => {
                    this.logger.info(`Asana webhook server started on port ${this.config.port}`);
                    this.emit('server_started', { port: this.config.port });
                    resolve();
                });
                this.server.on('error', (error) => {
                    this.logger.error('Server error', { error: error.message });
                    this.emit('server_error', error);
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Stop the webhook server
     */
    async stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    this.logger.info('Asana webhook server stopped');
                    this.emit('server_stopped');
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    /**
     * Graceful shutdown
     */
    async shutdown() {
        this.logger.info('Initiating graceful shutdown...');
        try {
            await this.stop();
            // Close sync engine connections
            await this.config.syncEngine.shutdown();
            // Close Asana connector
            await this.config.connector.disconnect();
            this.logger.info('Graceful shutdown completed');
            process.exit(0);
        }
        catch (error) {
            this.logger.error('Error during shutdown', { error });
            process.exit(1);
        }
    }
    /**
     * Get webhook server instance
     */
    getApp() {
        return this.app;
    }
    /**
     * Get current subscriptions
     */
    getSubscriptions() {
        return Array.from(this.subscriptions.values());
    }
    /**
     * Get event statistics
     */
    getEventStats() {
        return new Map(this.eventStats);
    }
}
exports.AsanaWebhookServer = AsanaWebhookServer;
exports.default = AsanaWebhookServer;
//# sourceMappingURL=webhook-server.js.map