/**
 * Privacy-First Analytics Collection SDK
 *
 * This SDK provides opt-in analytics collection with granular privacy controls.
 * All data collection requires explicit user consent and follows GDPR/CCPA guidelines.
 */
export interface ConsentOptions {
    usageAnalytics: boolean;
    featureAdoption: boolean;
    performanceData: boolean;
    feedbackData: boolean;
    geographicData: boolean;
}
export interface AnalyticsEvent {
    type: string;
    data: Record<string, unknown>;
    timestamp: number;
    sessionId: string;
    userId?: string;
}
export interface UserMetadata {
    role?: string;
    industry?: string;
    methodology?: string;
    teamSize?: string;
    experience?: string;
}
export declare class AnalyticsCollector {
    private apiUrl;
    private apiKey;
    private consent;
    private sessionId;
    private userId?;
    private metadata;
    private queue;
    private flushInterval;
    constructor(config: {
        apiUrl: string;
        apiKey: string;
        userId?: string;
        flushIntervalMs?: number;
    });
    /**
     * Request user consent for analytics collection
     */
    requestConsent(options: Partial<ConsentOptions>): Promise<ConsentOptions>;
    /**
     * Update user metadata
     */
    setUserMetadata(metadata: Partial<UserMetadata>): void;
    /**
     * Track a custom event
     */
    track(eventType: string, data?: Record<string, unknown>): void;
    /**
     * Template-specific tracking methods
     */
    trackTemplateDownload(templateName: string, methodology: string): void;
    trackTemplateCompletion(templateName: string, completionTime: number): void;
    trackCLIUsage(command: string, success: boolean): void;
    trackFeedback(templateName: string, rating: number, comment?: string): void;
    trackPerformance(action: string, duration: number, success: boolean): void;
    /**
     * Flush queued events to the analytics API
     */
    flush(): Promise<void>;
    /**
     * Get current consent status
     */
    getConsent(): ConsentOptions;
    /**
     * Revoke all consent and clear data
     */
    revokeConsent(): void;
    /**
     * Cleanup resources
     */
    destroy(): void;
    private generateSessionId;
    private hasConsent;
    private sanitizeData;
    private isCriticalEvent;
    private startAutoFlush;
    private loadConsentFromStorage;
    private saveConsentToStorage;
    private loadMetadataFromStorage;
    private saveMetadataToStorage;
    private clearStoredData;
}
export declare function initAnalytics(config: {
    apiUrl: string;
    apiKey: string;
    userId?: string;
    flushIntervalMs?: number;
}): AnalyticsCollector;
export declare function getAnalytics(): AnalyticsCollector | null;
export declare function trackEvent(eventType: string, data?: Record<string, unknown>): void;
export declare function trackTemplateDownload(templateName: string, methodology: string): void;
export declare function trackTemplateCompletion(templateName: string, completionTime: number): void;
export declare function trackCLIUsage(command: string, success: boolean): void;
export declare function trackFeedback(templateName: string, rating: number, comment?: string): void;
export declare function trackPerformance(action: string, duration: number, success: boolean): void;
