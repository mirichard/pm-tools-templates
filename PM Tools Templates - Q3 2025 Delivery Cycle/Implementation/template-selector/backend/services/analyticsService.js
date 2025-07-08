// In-memory analytics store (in production, this would be a database)
const analytics = {
  apiCalls: [],
  searchQueries: [],
  popularTemplates: new Map(),
  errorLogs: [],
  performanceMetrics: []
};

/**
 * Log an API call for analytics
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @param {Object} metadata - Additional metadata
 */
function logAPICall(method, endpoint, params = {}, metadata = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method,
    endpoint,
    params,
    metadata
  };
  
  analytics.apiCalls.push(logEntry);
  
  // Keep only last 1000 entries to prevent memory issues
  if (analytics.apiCalls.length > 1000) {
    analytics.apiCalls.shift();
  }
  
  // Track popular endpoints
  const endpointKey = `${method} ${endpoint}`;
  if (!analytics.popularTemplates.has(endpointKey)) {
    analytics.popularTemplates.set(endpointKey, 0);
  }
  analytics.popularTemplates.set(endpointKey, analytics.popularTemplates.get(endpointKey) + 1);
}

/**
 * Log a search query for analytics
 * @param {string} query - Search query
 * @param {Object} filters - Applied filters
 * @param {number} resultCount - Number of results
 */
function logSearchQuery(query, filters = {}, resultCount = 0) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    query,
    filters,
    resultCount
  };
  
  analytics.searchQueries.push(logEntry);
  
  // Keep only last 500 search queries
  if (analytics.searchQueries.length > 500) {
    analytics.searchQueries.shift();
  }
}

/**
 * Log an error for analytics
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
function logError(error, context = '') {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message: error.message,
    stack: error.stack,
    context
  };
  
  analytics.errorLogs.push(logEntry);
  
  // Keep only last 100 errors
  if (analytics.errorLogs.length > 100) {
    analytics.errorLogs.shift();
  }
}

/**
 * Log performance metrics
 * @param {string} operation - Operation name
 * @param {number} duration - Duration in milliseconds
 * @param {Object} metadata - Additional metadata
 */
function logPerformance(operation, duration, metadata = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    operation,
    duration,
    metadata
  };
  
  analytics.performanceMetrics.push(logEntry);
  
  // Keep only last 200 performance metrics
  if (analytics.performanceMetrics.length > 200) {
    analytics.performanceMetrics.shift();
  }
}

/**
 * Get analytics data
 * @returns {Object} Analytics summary
 */
function getAnalytics() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Filter recent data
  const recentAPICalls = analytics.apiCalls.filter(call => 
    new Date(call.timestamp) >= oneHourAgo
  );
  
  const recentSearches = analytics.searchQueries.filter(search => 
    new Date(search.timestamp) >= oneHourAgo
  );
  
  const recentErrors = analytics.errorLogs.filter(error => 
    new Date(error.timestamp) >= oneDayAgo
  );
  
  // Calculate statistics
  const topEndpoints = Array.from(analytics.popularTemplates.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([endpoint, count]) => ({ endpoint, count }));
  
  const topSearchQueries = analytics.searchQueries
    .filter(search => search.query && search.query.trim().length > 0)
    .reduce((acc, search) => {
      const query = search.query.toLowerCase();
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {});
  
  const topQueries = Object.entries(topSearchQueries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));
  
  // Performance statistics
  const performanceStats = analytics.performanceMetrics.reduce((acc, metric) => {
    if (!acc[metric.operation]) {
      acc[metric.operation] = {
        count: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0
      };
    }
    
    const stats = acc[metric.operation];
    stats.count++;
    stats.totalDuration += metric.duration;
    stats.minDuration = Math.min(stats.minDuration, metric.duration);
    stats.maxDuration = Math.max(stats.maxDuration, metric.duration);
    
    return acc;
  }, {});
  
  // Calculate averages
  Object.values(performanceStats).forEach(stats => {
    stats.avgDuration = stats.totalDuration / stats.count;
    stats.minDuration = stats.minDuration === Infinity ? 0 : stats.minDuration;
  });
  
  return {
    summary: {
      totalAPICalls: analytics.apiCalls.length,
      recentAPICalls: recentAPICalls.length,
      totalSearchQueries: analytics.searchQueries.length,
      recentSearchQueries: recentSearches.length,
      totalErrors: analytics.errorLogs.length,
      recentErrors: recentErrors.length,
      performanceMetricsCount: analytics.performanceMetrics.length
    },
    topEndpoints,
    topSearchQueries: topQueries,
    recentErrors: recentErrors.slice(0, 5), // Show last 5 errors
    performanceStats,
    trends: {
      apiCallsPerHour: recentAPICalls.length,
      searchesPerHour: recentSearches.length,
      errorRate: recentErrors.length / Math.max(recentAPICalls.length, 1)
    }
  };
}

/**
 * Get search analytics
 * @returns {Object} Search-specific analytics
 */
function getSearchAnalytics() {
  const searches = analytics.searchQueries;
  
  // Most popular search terms
  const termFrequency = {};
  searches.forEach(search => {
    if (search.query) {
      const terms = search.query.toLowerCase().split(/\s+/);
      terms.forEach(term => {
        if (term.length > 2) {
          termFrequency[term] = (termFrequency[term] || 0) + 1;
        }
      });
    }
  });
  
  const popularTerms = Object.entries(termFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([term, count]) => ({ term, count }));
  
  // Filter usage statistics
  const filterUsage = searches.reduce((acc, search) => {
    if (search.filters) {
      Object.keys(search.filters).forEach(filter => {
        if (search.filters[filter]) {
          acc[filter] = (acc[filter] || 0) + 1;
        }
      });
    }
    return acc;
  }, {});
  
  // No results queries
  const noResultsQueries = searches
    .filter(search => search.resultCount === 0)
    .map(search => search.query)
    .filter(query => query && query.trim().length > 0);
  
  return {
    totalSearches: searches.length,
    popularTerms,
    filterUsage,
    noResultsQueries: noResultsQueries.slice(0, 10),
    averageResultsPerQuery: searches.length > 0 
      ? searches.reduce((sum, search) => sum + search.resultCount, 0) / searches.length 
      : 0
  };
}

/**
 * Clear old analytics data
 */
function clearOldAnalytics() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  analytics.apiCalls = analytics.apiCalls.filter(call => 
    new Date(call.timestamp) >= oneWeekAgo
  );
  
  analytics.searchQueries = analytics.searchQueries.filter(search => 
    new Date(search.timestamp) >= oneWeekAgo
  );
  
  analytics.errorLogs = analytics.errorLogs.filter(error => 
    new Date(error.timestamp) >= oneWeekAgo
  );
  
  analytics.performanceMetrics = analytics.performanceMetrics.filter(metric => 
    new Date(metric.timestamp) >= oneWeekAgo
  );
}

module.exports = {
  logAPICall,
  logSearchQuery,
  logError,
  logPerformance,
  getAnalytics,
  getSearchAnalytics,
  clearOldAnalytics
};
