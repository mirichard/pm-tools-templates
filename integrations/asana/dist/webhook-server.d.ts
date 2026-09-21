import express from 'express';
import { EventEmitter } from 'events';
import { AsanaSyncEngine } from './sync-engine';
import { AsanaConnector } from './connector';
export interface WebhookServerConfig {
    port: number;
    webhookSecret: string;
    syncEngine: AsanaSyncEngine;
    connector: AsanaConnector;
    enableLogging?: boolean;
    logLevel?: string;
    trustProxy?: string | number | boolean;
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
export declare class AsanaWebhookServer extends EventEmitter {
    private app;
    private server;
    private config;
    private logger;
    private subscriptions;
    private eventStats;
    private webhookRateLimiter;
    constructor(config: WebhookServerConfig);
    /**
     * Configure logging with Winston
     */
    private setupLogging;
    /**
     * Set up Express middleware
     */
    private setupMiddleware;
    /**
     * Set up Express routes
     */
    private setupRoutes;
    /**
     * Handle incoming Asana webhook events
     */
    private handleAsanaWebhook;
    /**
     * Process webhook event through sync engine
     */
    private processWebhookEvent;
    /**
     * Find subscriptions that match the webhook event
     */
    private findRelevantSubscriptions;
    /**
     * Verify webhook signature using HMAC
     */
    private verifyWebhookSignature;
    /**
     * Update event statistics
     */
    private updateEventStats;
    /**
     * Create new webhook subscription
     */
    private createSubscription;
    /**
     * Get all webhook subscriptions
     */
    private getSubscriptions;
    /**
     * Get specific webhook subscription
     */
    private getSubscription;
    /**
     * Update webhook subscription
     */
    private updateSubscription;
    /**
     * Delete webhook subscription
     */
    private deleteSubscription;
    /**
     * Get server statistics
     */
    private getStatistics;
    /**
     * Set up error handling middleware
     */
    private setupErrorHandling;
    /**
     * Start the webhook server
     */
    start(): Promise<void>;
    /**
     * Stop the webhook server
     */
    stop(): Promise<void>;
    /**
     * Graceful shutdown
     */
    shutdown(): Promise<void>;
    /**
     * Get webhook server instance
     */
    getApp(): express.Application;
    /**
     * Get current subscriptions (public API)
     */
    getAllSubscriptions(): WebhookSubscription[];
    /**
     * Get event statistics
     */
    getEventStats(): Map<string, number>;
}
export default AsanaWebhookServer;
//# sourceMappingURL=webhook-server.d.ts.map