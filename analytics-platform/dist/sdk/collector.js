"use strict";
/**
 * Privacy-First Analytics Collection SDK
 *
 * This SDK provides opt-in analytics collection with granular privacy controls.
 * All data collection requires explicit user consent and follows GDPR/CCPA guidelines.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsCollector = void 0;
exports.initAnalytics = initAnalytics;
exports.getAnalytics = getAnalytics;
exports.trackEvent = trackEvent;
exports.trackTemplateDownload = trackTemplateDownload;
exports.trackTemplateCompletion = trackTemplateCompletion;
exports.trackCLIUsage = trackCLIUsage;
exports.trackFeedback = trackFeedback;
exports.trackPerformance = trackPerformance;
const crypto_1 = require("crypto");
class AnalyticsCollector {
    constructor(config) {
        this.queue = [];
        this.flushInterval = null;
        this.apiUrl = config.apiUrl;
        this.apiKey = config.apiKey;
        this.userId = config.userId;
        this.sessionId = this.generateSessionId();
        this.consent = this.loadConsentFromStorage();
        this.metadata = this.loadMetadataFromStorage();
        // Auto-flush events every 30 seconds by default
        this.startAutoFlush(config.flushIntervalMs || 30000);
    }
    /**
     * Request user consent for analytics collection
     */
    async requestConsent(options) {
        const consent = {
            usageAnalytics: options.usageAnalytics || false,
            featureAdoption: options.featureAdoption || false,
            performanceData: options.performanceData || false,
            feedbackData: options.feedbackData || false,
            geographicData: options.geographicData || false,
        };
        this.consent = consent;
        this.saveConsentToStorage(consent);
        // Track consent decision (if consent given for usage analytics)
        if (consent.usageAnalytics) {
            this.track('consent_updated', { consent });
        }
        return consent;
    }
    /**
     * Update user metadata
     */
    setUserMetadata(metadata) {
        this.metadata = { ...this.metadata, ...metadata };
        this.saveMetadataToStorage(this.metadata);
        if (this.consent.usageAnalytics) {
            this.track('user_metadata_updated', { metadata: this.metadata });
        }
    }
    /**
     * Track a custom event
     */
    track(eventType, data = {}) {
        if (!this.hasConsent(eventType)) {
            return; // Respect user consent
        }
        const event = {
            type: eventType,
            data: this.sanitizeData(data),
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
        };
        this.queue.push(event);
        // Flush immediately for critical events
        if (this.isCriticalEvent(eventType)) {
            this.flush();
        }
    }
    /**
     * Template-specific tracking methods
     */
    trackTemplateDownload(templateName, methodology) {
        this.track('template_download', {
            templateName,
            methodology,
            userRole: this.metadata.role,
            userIndustry: this.metadata.industry,
        });
    }
    trackTemplateCompletion(templateName, completionTime) {
        this.track('template_completion', {
            templateName,
            completionTimeMs: completionTime,
            userExperience: this.metadata.experience,
        });
    }
    trackCLIUsage(command, success) {
        this.track('cli_usage', {
            command,
            success,
            userRole: this.metadata.role,
        });
    }
    trackFeedback(templateName, rating, comment) {
        this.track('feedback_submitted', {
            templateName,
            rating,
            hasComment: !!comment,
            commentLength: comment?.length || 0,
        });
    }
    trackPerformance(action, duration, success) {
        if (!this.consent.performanceData)
            return;
        this.track('performance_metric', {
            action,
            durationMs: duration,
            success,
        });
    }
    /**
     * Flush queued events to the analytics API
     */
    async flush() {
        if (this.queue.length === 0)
            return;
        const events = [...this.queue];
        this.queue = [];
        try {
            await fetch(`${this.apiUrl}/analytics/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Session-ID': this.sessionId,
                },
                body: JSON.stringify({
                    events,
                    metadata: this.metadata,
                    consent: this.consent,
                }),
            });
        }
        catch (error) {
            console.warn('Failed to send analytics events:', error);
            // Re-queue events for retry
            this.queue.unshift(...events);
        }
    }
    /**
     * Get current consent status
     */
    getConsent() {
        return { ...this.consent };
    }
    /**
     * Revoke all consent and clear data
     */
    revokeConsent() {
        this.consent = {
            usageAnalytics: false,
            featureAdoption: false,
            performanceData: false,
            feedbackData: false,
            geographicData: false,
        };
        this.saveConsentToStorage(this.consent);
        this.clearStoredData();
        this.queue = [];
    }
    /**
     * Cleanup resources
     */
    destroy() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
        this.flush(); // Final flush
    }
    // Private methods
    generateSessionId() {
        // Use crypto.randomBytes for cryptographically secure random values
        const randomPart = (0, crypto_1.randomBytes)(6).toString('hex');
        return `sess_${Date.now()}_${randomPart}`;
    }
    hasConsent(eventType) {
        switch (eventType) {
            case 'template_download':
            case 'template_completion':
            case 'consent_updated':
            case 'user_metadata_updated':
                return this.consent.usageAnalytics;
            case 'cli_usage':
            case 'integration_usage':
                return this.consent.featureAdoption;
            case 'performance_metric':
                return this.consent.performanceData;
            case 'feedback_submitted':
                return this.consent.feedbackData;
            default:
                return this.consent.usageAnalytics; // Default to usage analytics
        }
    }
    sanitizeData(data) {
        const sanitized = { ...data };
        // Remove potentially sensitive fields
        delete sanitized.email;
        delete sanitized.password;
        delete sanitized.token;
        delete sanitized.apiKey;
        delete sanitized.personalInfo;
        // Truncate long strings to prevent abuse
        Object.keys(sanitized).forEach(key => {
            if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
                sanitized[key] = sanitized[key].substring(0, 1000) + '...';
            }
        });
        return sanitized;
    }
    isCriticalEvent(eventType) {
        const criticalEvents = ['error', 'security_incident', 'consent_updated'];
        return criticalEvents.includes(eventType);
    }
    startAutoFlush(intervalMs) {
        this.flushInterval = setInterval(() => {
            this.flush();
        }, intervalMs);
    }
    loadConsentFromStorage() {
        try {
            const stored = localStorage.getItem('pm-tools-analytics-consent');
            return stored ? JSON.parse(stored) : {
                usageAnalytics: false,
                featureAdoption: false,
                performanceData: false,
                feedbackData: false,
                geographicData: false,
            };
        }
        catch {
            return {
                usageAnalytics: false,
                featureAdoption: false,
                performanceData: false,
                feedbackData: false,
                geographicData: false,
            };
        }
    }
    saveConsentToStorage(consent) {
        try {
            localStorage.setItem('pm-tools-analytics-consent', JSON.stringify(consent));
        }
        catch {
            // Ignore storage errors
        }
    }
    loadMetadataFromStorage() {
        try {
            const stored = localStorage.getItem('pm-tools-user-metadata');
            return stored ? JSON.parse(stored) : {};
        }
        catch {
            return {};
        }
    }
    saveMetadataToStorage(metadata) {
        try {
            localStorage.setItem('pm-tools-user-metadata', JSON.stringify(metadata));
        }
        catch {
            // Ignore storage errors
        }
    }
    clearStoredData() {
        try {
            localStorage.removeItem('pm-tools-analytics-consent');
            localStorage.removeItem('pm-tools-user-metadata');
        }
        catch {
            // Ignore storage errors
        }
    }
}
exports.AnalyticsCollector = AnalyticsCollector;
// Export a singleton instance for convenience
let globalCollector = null;
function initAnalytics(config) {
    globalCollector = new AnalyticsCollector(config);
    return globalCollector;
}
function getAnalytics() {
    return globalCollector;
}
function trackEvent(eventType, data) {
    globalCollector?.track(eventType, data);
}
function trackTemplateDownload(templateName, methodology) {
    globalCollector?.trackTemplateDownload(templateName, methodology);
}
function trackTemplateCompletion(templateName, completionTime) {
    globalCollector?.trackTemplateCompletion(templateName, completionTime);
}
function trackCLIUsage(command, success) {
    globalCollector?.trackCLIUsage(command, success);
}
function trackFeedback(templateName, rating, comment) {
    globalCollector?.trackFeedback(templateName, rating, comment);
}
function trackPerformance(action, duration, success) {
    globalCollector?.trackPerformance(action, duration, success);
}
