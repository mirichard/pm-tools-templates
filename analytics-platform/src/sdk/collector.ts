/**
 * Privacy-First Analytics Collection SDK
 * 
 * This SDK provides opt-in analytics collection with granular privacy controls.
 * All data collection requires explicit user consent and follows GDPR/CCPA guidelines.
 */

export interface ConsentOptions {
  usageAnalytics: boolean;      // Template downloads, completion rates
  featureAdoption: boolean;     // CLI usage, integration adoption  
  performanceData: boolean;     // Load times, error rates
  feedbackData: boolean;        // Ratings, comments, suggestions
  geographicData: boolean;      // Regional usage patterns (anonymized)
}

export interface AnalyticsEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface UserMetadata {
  role?: string;               // PM, Product Owner, Developer, etc.
  industry?: string;           // IT, Construction, Healthcare, etc.
  methodology?: string;        // Agile, PMBOK, Hybrid
  teamSize?: string;          // 1-5, 6-20, 21-50, 50+
  experience?: string;        // Beginner, Intermediate, Advanced
}

export class AnalyticsCollector {
  private apiUrl: string;
  private apiKey: string;
  private consent: ConsentOptions;
  private sessionId: string;
  private userId?: string;
  private metadata: UserMetadata;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(config: {
    apiUrl: string;
    apiKey: string;
    userId?: string;
    flushIntervalMs?: number;
  }) {
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
  async requestConsent(options: Partial<ConsentOptions>): Promise<ConsentOptions> {
    const consent: ConsentOptions = {
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
  setUserMetadata(metadata: Partial<UserMetadata>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.saveMetadataToStorage(this.metadata);

    if (this.consent.usageAnalytics) {
      this.track('user_metadata_updated', { metadata: this.metadata });
    }
  }

  /**
   * Track a custom event
   */
  track(eventType: string, data: Record<string, any> = {}): void {
    if (!this.hasConsent(eventType)) {
      return; // Respect user consent
    }

    const event: AnalyticsEvent = {
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
  trackTemplateDownload(templateName: string, methodology: string): void {
    this.track('template_download', {
      templateName,
      methodology,
      userRole: this.metadata.role,
      userIndustry: this.metadata.industry,
    });
  }

  trackTemplateCompletion(templateName: string, completionTime: number): void {
    this.track('template_completion', {
      templateName,
      completionTimeMs: completionTime,
      userExperience: this.metadata.experience,
    });
  }

  trackCLIUsage(command: string, success: boolean): void {
    this.track('cli_usage', {
      command,
      success,
      userRole: this.metadata.role,
    });
  }

  trackFeedback(templateName: string, rating: number, comment?: string): void {
    this.track('feedback_submitted', {
      templateName,
      rating,
      hasComment: !!comment,
      commentLength: comment?.length || 0,
    });
  }

  trackPerformance(action: string, duration: number, success: boolean): void {
    if (!this.consent.performanceData) return;

    this.track('performance_metric', {
      action,
      durationMs: duration,
      success,
    });
  }

  /**
   * Flush queued events to the analytics API
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

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
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-queue events for retry
      this.queue.unshift(...events);
    }
  }

  /**
   * Get current consent status
   */
  getConsent(): ConsentOptions {
    return { ...this.consent };
  }

  /**
   * Revoke all consent and clear data
   */
  revokeConsent(): void {
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
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush(); // Final flush
  }

  // Private methods

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private hasConsent(eventType: string): boolean {
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

  private sanitizeData(data: Record<string, any>): Record<string, any> {
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

  private isCriticalEvent(eventType: string): boolean {
    const criticalEvents = ['error', 'security_incident', 'consent_updated'];
    return criticalEvents.includes(eventType);
  }

  private startAutoFlush(intervalMs: number): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, intervalMs);
  }

  private loadConsentFromStorage(): ConsentOptions {
    try {
      const stored = localStorage.getItem('pm-tools-analytics-consent');
      return stored ? JSON.parse(stored) : {
        usageAnalytics: false,
        featureAdoption: false,
        performanceData: false,
        feedbackData: false,
        geographicData: false,
      };
    } catch {
      return {
        usageAnalytics: false,
        featureAdoption: false,
        performanceData: false,
        feedbackData: false,
        geographicData: false,
      };
    }
  }

  private saveConsentToStorage(consent: ConsentOptions): void {
    try {
      localStorage.setItem('pm-tools-analytics-consent', JSON.stringify(consent));
    } catch {
      // Ignore storage errors
    }
  }

  private loadMetadataFromStorage(): UserMetadata {
    try {
      const stored = localStorage.getItem('pm-tools-user-metadata');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveMetadataToStorage(metadata: UserMetadata): void {
    try {
      localStorage.setItem('pm-tools-user-metadata', JSON.stringify(metadata));
    } catch {
      // Ignore storage errors
    }
  }

  private clearStoredData(): void {
    try {
      localStorage.removeItem('pm-tools-analytics-consent');
      localStorage.removeItem('pm-tools-user-metadata');
    } catch {
      // Ignore storage errors
    }
  }
}

// Export a singleton instance for convenience
let globalCollector: AnalyticsCollector | null = null;

export function initAnalytics(config: {
  apiUrl: string;
  apiKey: string;
  userId?: string;
  flushIntervalMs?: number;
}): AnalyticsCollector {
  globalCollector = new AnalyticsCollector(config);
  return globalCollector;
}

export function getAnalytics(): AnalyticsCollector | null {
  return globalCollector;
}

export function trackEvent(eventType: string, data?: Record<string, any>): void {
  globalCollector?.track(eventType, data);
}

export function trackTemplateDownload(templateName: string, methodology: string): void {
  globalCollector?.trackTemplateDownload(templateName, methodology);
}

export function trackTemplateCompletion(templateName: string, completionTime: number): void {
  globalCollector?.trackTemplateCompletion(templateName, completionTime);
}

export function trackCLIUsage(command: string, success: boolean): void {
  globalCollector?.trackCLIUsage(command, success);
}

export function trackFeedback(templateName: string, rating: number, comment?: string): void {
  globalCollector?.trackFeedback(templateName, rating, comment);
}

export function trackPerformance(action: string, duration: number, success: boolean): void {
  globalCollector?.trackPerformance(action, duration, success);
}

