/**
 * AI Insights Dashboard Client
 * JavaScript client library for easy dashboard integration
 */

class AIInsightsClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:3001/api/v1';
    this.apiKey = options.apiKey || null;
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'X-API-Key': this.apiKey }),
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...options
    };

    let lastError;
    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new AIInsightsError(
            errorData.error || `HTTP ${response.status}`,
            response.status,
            errorData
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt < this.retries && this.isRetryableError(error)) {
          await this.sleep(this.retryDelay * attempt);
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError;
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    return (
      error.name === 'AbortError' ||
      error.code === 'NETWORK_ERROR' ||
      (error.status >= 500 && error.status < 600) ||
      error.status === 429
    );
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate comprehensive AI insights for a project
   */
  async generateInsights(projectData) {
    try {
      const response = await this.makeRequest('/insights/analyze', {
        body: projectData
      });
      
      return new AIInsightsResult(response.data);
    } catch (error) {
      throw new AIInsightsError(
        `Failed to generate insights: ${error.message}`,
        error.status,
        { originalError: error }
      );
    }
  }

  /**
   * Predict project risk level
   */
  async predictRisk(projectData) {
    const response = await this.makeRequest('/risk/predict', {
      body: projectData
    });
    
    return response.data;
  }

  /**
   * Optimize resource allocation
   */
  async optimizeResources(projectData) {
    const response = await this.makeRequest('/resources/optimize', {
      body: projectData
    });
    
    return response.data;
  }

  /**
   * Analyze project schedule
   */
  async analyzeSchedule(projectData) {
    const response = await this.makeRequest('/schedule/analyze', {
      body: projectData
    });
    
    return response.data;
  }

  /**
   * Predict quality metrics
   */
  async predictQuality(projectData) {
    const response = await this.makeRequest('/quality/predict', {
      body: projectData
    });
    
    return response.data;
  }

  /**
   * Analyze sentiment from text
   */
  async analyzeSentiment(text, context = null) {
    const response = await this.makeRequest('/sentiment/analyze', {
      body: { text, context }
    });
    
    return response.data;
  }

  /**
   * Recognize patterns from historical data
   */
  async recognizePatterns(historicalData) {
    const response = await this.makeRequest('/patterns/recognize', {
      body: { historicalData }
    });
    
    return response.data;
  }

  /**
   * Batch process multiple projects
   */
  async batchAnalyze(projects, options = {}) {
    if (!Array.isArray(projects)) {
      throw new AIInsightsError('Projects must be an array');
    }

    if (projects.length === 0) {
      throw new AIInsightsError('At least one project required');
    }

    if (projects.length > 100) {
      throw new AIInsightsError('Maximum 100 projects allowed per batch');
    }

    const response = await this.makeRequest('/insights/batch', {
      body: { projects, ...options }
    });
    
    return response.data;
  }

  /**
   * Get API performance metrics
   */
  async getPerformanceMetrics() {
    const response = await this.makeRequest('/performance/metrics', {
      method: 'GET'
    });
    
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`);
      return await response.json();
    } catch (error) {
      throw new AIInsightsError(`Health check failed: ${error.message}`);
    }
  }

  /**
   * Clear API cache
   */
  async clearCache() {
    const response = await this.makeRequest('/cache', {
      method: 'DELETE'
    });
    
    return response;
  }
}

/**
 * AI Insights Result wrapper
 */
class AIInsightsResult {
  constructor(data) {
    this.data = this.sanitizeData(data);
    this.timestamp = new Date().toISOString();
  }

  /**
   * Sanitize data to prevent XSS attacks
   */
  sanitizeData(data) {
    if (typeof data === 'string') {
      return data.replace(/[<>\"'&]/g, (match) => {
        const escapeMap = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return escapeMap[match];
      });
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[this.sanitizeData(key)] = this.sanitizeData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Get risk assessment
   */
  getRiskAssessment() {
    return this.data.riskPrediction;
  }

  /**
   * Get resource recommendations
   */
  getResourceRecommendations() {
    return this.data.resourceOptimization;
  }

  /**
   * Get schedule analysis
   */
  getScheduleAnalysis() {
    return this.data.scheduleAnalysis;
  }

  /**
   * Get quality predictions
   */
  getQualityPredictions() {
    return this.data.qualityPrediction;
  }

  /**
   * Get overall insights summary
   */
  getSummary() {
    return {
      riskLevel: this.data.riskPrediction?.riskLevel,
      confidence: this.data.riskPrediction?.confidence,
      keyInsights: this.data.insights?.slice(0, 5),
      priorityRecommendations: this.data.recommendations?.filter(r => r.priority === 'high'),
      estimatedImpact: this.calculateOverallImpact()
    };
  }

  /**
   * Calculate overall impact score
   */
  calculateOverallImpact() {
    const risk = this.data.riskPrediction;
    const resource = this.data.resourceOptimization;
    
    if (!risk || !resource) return null;

    const riskImpact = this.getRiskImpactScore(risk.riskLevel);
    const resourceImprovement = resource.efficiency?.improvement || 0;
    
    return {
      riskReduction: riskImpact,
      efficiencyGain: resourceImprovement,
      overallScore: Math.round((riskImpact + resourceImprovement) / 2 * 100) / 100
    };
  }

  /**
   * Get risk impact score
   */
  getRiskImpactScore(riskLevel) {
    const mapping = { low: 0.9, medium: 0.6, high: 0.3, critical: 0.1 };
    return mapping[riskLevel] || 0.5;
  }

  /**
   * Export results for dashboard display
   */
  toDisplayFormat() {
    return {
      summary: this.getSummary(),
      risk: this.getRiskAssessment(),
      resources: this.getResourceRecommendations(),
      schedule: this.getScheduleAnalysis(),
      quality: this.getQualityPredictions(),
      metadata: {
        timestamp: this.timestamp,
        confidence: this.data.riskPrediction?.confidence,
        completeness: this.calculateCompleteness()
      }
    };
  }

  /**
   * Calculate data completeness score
   */
  calculateCompleteness() {
    const sections = ['riskPrediction', 'resourceOptimization', 'scheduleAnalysis', 'qualityPrediction'];
    const available = sections.filter(section => this.data[section]).length;
    return Math.round((available / sections.length) * 100);
  }
}

/**
 * Custom error class for AI Insights
 */
class AIInsightsError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'AIInsightsError';
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Check if error is retryable
   */
  isRetryable() {
    return this.status >= 500 || this.status === 429 || this.status === null;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage() {
    const messages = {
      400: 'Invalid project data provided',
      401: 'Authentication required',
      403: 'Access denied',
      404: 'Service endpoint not found',
      429: 'Too many requests, please slow down',
      500: 'AI service temporarily unavailable',
      503: 'AI engine is starting up, please try again shortly'
    };
    
    return messages[this.status] || this.message;
  }
}

// React Hook for easy integration
function useAIInsights(client) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);

  const generateInsights = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.generateInsights(projectData);
      setInsights(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const clearInsights = useCallback(() => {
    setInsights(null);
    setError(null);
  }, []);

  return {
    insights,
    loading,
    error,
    generateInsights,
    clearInsights
  };
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = { AIInsightsClient, AIInsightsResult, AIInsightsError, useAIInsights };
} else if (typeof window !== 'undefined') {
  // Browser
  window.AIInsightsClient = AIInsightsClient;
  window.AIInsightsResult = AIInsightsResult;
  window.AIInsightsError = AIInsightsError;
  window.useAIInsights = useAIInsights;
}

// ES6 export
export { AIInsightsClient, AIInsightsResult, AIInsightsError, useAIInsights };

