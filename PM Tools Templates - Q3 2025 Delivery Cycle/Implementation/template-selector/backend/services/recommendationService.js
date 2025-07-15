/**
 * ML-Powered Template Recommendation Service
 * Implements collaborative filtering, content-based filtering, and hybrid recommendations
 */

const templateDataService = require('./templateDataService');
const analyticsService = require('./analyticsService');

// User behavior tracking store (in production, this would be a database)
const userBehavior = {
  templateViews: new Map(),     // templateId -> view count
  templateDownloads: new Map(), // templateId -> download count
  userSessions: new Map(),      // sessionId -> user behavior
  searchPatterns: new Map(),    // search query -> frequency
  filterPreferences: new Map(), // filter combination -> usage count
  userProfiles: new Map()       // userId -> user profile
};

/**
 * Track user interaction with templates
 */
function trackUserInteraction(sessionId, templateId, interactionType, metadata = {}) {
  const timestamp = new Date().toISOString();
  
  if (!userBehavior.userSessions.has(sessionId)) {
    userBehavior.userSessions.set(sessionId, {
      interactions: [],
      preferences: {},
      startTime: timestamp
    });
  }
  
  const session = userBehavior.userSessions.get(sessionId);
  session.interactions.push({
    templateId,
    interactionType, // 'view', 'download', 'favorite', 'share'
    timestamp,
    metadata
  });
  
  // Update global counters
  if (interactionType === 'view') {
    userBehavior.templateViews.set(templateId, (userBehavior.templateViews.get(templateId) || 0) + 1);
  } else if (interactionType === 'download') {
    userBehavior.templateDownloads.set(templateId, (userBehavior.templateDownloads.get(templateId) || 0) + 1);
  }
  
  // Update user preferences
  updateUserPreferences(sessionId, templateId, interactionType, metadata);
}

/**
 * Update user preferences based on interactions
 */
function updateUserPreferences(sessionId, templateId, interactionType, metadata) {
  const session = userBehavior.userSessions.get(sessionId);
  const templates = templateDataService.getAllTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) return;
  
  // Weight different interaction types
  const weights = {
    'view': 1,
    'download': 3,
    'favorite': 5,
    'share': 4,
    'rate': 2
  };
  
  const weight = weights[interactionType] || 1;
  
  // Update methodology preferences
  if (!session.preferences.methodologies) {
    session.preferences.methodologies = {};
  }
  session.preferences.methodologies[template.methodology] = 
    (session.preferences.methodologies[template.methodology] || 0) + weight;
  
  // Update category preferences
  if (!session.preferences.categories) {
    session.preferences.categories = {};
  }
  session.preferences.categories[template.category] = 
    (session.preferences.categories[template.category] || 0) + weight;
  
  // Update complexity preferences
  if (!session.preferences.complexity) {
    session.preferences.complexity = {};
  }
  session.preferences.complexity[template.complexity] = 
    (session.preferences.complexity[template.complexity] || 0) + weight;
  
  // Update tag preferences
  if (!session.preferences.tags) {
    session.preferences.tags = {};
  }
  if (template.tags) {
    template.tags.forEach(tag => {
      session.preferences.tags[tag] = (session.preferences.tags[tag] || 0) + weight;
    });
  }
}

/**
 * Content-based filtering: Find similar templates based on characteristics
 */
function getContentBasedRecommendations(templateId, limit = 5) {
  const templates = templateDataService.getAllTemplates();
  const targetTemplate = templates.find(t => t.id === templateId);
  
  if (!targetTemplate) return [];
  
  const similarities = templates
    .filter(t => t.id !== templateId)
    .map(template => {
      let score = 0;
      
      // Methodology similarity (high weight)
      if (template.methodology === targetTemplate.methodology) {
        score += 0.4;
      }
      
      // Category similarity (medium weight)
      if (template.category === targetTemplate.category) {
        score += 0.3;
      }
      
      // Complexity similarity (low weight)
      if (template.complexity === targetTemplate.complexity) {
        score += 0.1;
      }
      
      // Tag similarity (medium weight)
      if (template.tags && targetTemplate.tags) {
        const commonTags = template.tags.filter(tag => targetTemplate.tags.includes(tag));
        const tagSimilarity = commonTags.length / Math.max(template.tags.length, targetTemplate.tags.length);
        score += tagSimilarity * 0.2;
      }
      
      return {
        template,
        similarity: score,
        reason: generateRecommendationReason(template, targetTemplate, score)
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return similarities;
}

/**
 * Collaborative filtering: Find templates liked by similar users
 */
function getCollaborativeRecommendations(sessionId, limit = 5) {
  const currentSession = userBehavior.userSessions.get(sessionId);
  if (!currentSession) return [];
  
  const templates = templateDataService.getAllTemplates();
  const userInteractions = Array.from(userBehavior.userSessions.entries())
    .filter(([id, session]) => id !== sessionId && session.interactions.length > 0);
  
  // Find similar users based on interaction patterns
  const similarUsers = userInteractions
    .map(([userId, session]) => {
      let similarity = 0;
      let commonInteractions = 0;
      
      // Compare methodology preferences
      if (currentSession.preferences.methodologies && session.preferences.methodologies) {
        const currentMethodologies = Object.keys(currentSession.preferences.methodologies);
        const userMethodologies = Object.keys(session.preferences.methodologies);
        const commonMethodologies = currentMethodologies.filter(m => userMethodologies.includes(m));
        similarity += commonMethodologies.length / Math.max(currentMethodologies.length, userMethodologies.length);
        commonInteractions++;
      }
      
      // Compare category preferences
      if (currentSession.preferences.categories && session.preferences.categories) {
        const currentCategories = Object.keys(currentSession.preferences.categories);
        const userCategories = Object.keys(session.preferences.categories);
        const commonCategories = currentCategories.filter(c => userCategories.includes(c));
        similarity += commonCategories.length / Math.max(currentCategories.length, userCategories.length);
        commonInteractions++;
      }
      
      return {
        userId,
        session,
        similarity: commonInteractions > 0 ? similarity / commonInteractions : 0
      };
    })
    .filter(user => user.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
  
  // Get templates liked by similar users
  const recommendations = new Map();
  
  similarUsers.forEach(user => {
    user.session.interactions
      .filter(interaction => ['download', 'favorite', 'share'].includes(interaction.interactionType))
      .forEach(interaction => {
        const template = templates.find(t => t.id === interaction.templateId);
        if (template && !hasUserInteractedWith(currentSession, interaction.templateId)) {
          const currentScore = recommendations.get(interaction.templateId) || 0;
          const interactionWeight = interaction.interactionType === 'favorite' ? 3 : 
                                  interaction.interactionType === 'download' ? 2 : 1;
          recommendations.set(interaction.templateId, currentScore + (user.similarity * interactionWeight));
        }
      });
  });
  
  return Array.from(recommendations.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([templateId, score]) => {
      const template = templates.find(t => t.id === templateId);
      return {
        template,
        score,
        reason: 'Users with similar interests also liked this template'
      };
    });
}

/**
 * Popularity-based recommendations
 */
function getPopularityRecommendations(sessionId, limit = 5) {
  const templates = templateDataService.getAllTemplates();
  const currentSession = userBehavior.userSessions.get(sessionId);
  
  return templates
    .filter(template => !hasUserInteractedWith(currentSession, template.id))
    .map(template => {
      const views = userBehavior.templateViews.get(template.id) || 0;
      const downloads = userBehavior.templateDownloads.get(template.id) || 0;
      const rating = template.rating || 0;
      const usageCount = template.usageCount || 0;
      
      // Calculate popularity score
      const popularityScore = (views * 0.1) + (downloads * 0.3) + (rating * 0.4) + (usageCount * 0.2);
      
      return {
        template,
        score: popularityScore,
        reason: `Popular template with ${rating} star rating and ${usageCount} uses`
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Progressive disclosure: Recommend templates based on user experience level
 */
function getProgressiveRecommendations(sessionId, limit = 5) {
  const templates = templateDataService.getAllTemplates();
  const currentSession = userBehavior.userSessions.get(sessionId);
  
  if (!currentSession) return [];
  
  // Determine user experience level based on interactions
  const userLevel = determineUserExperienceLevel(currentSession);
  
  // Get appropriate templates for user level
  const appropriateTemplates = templates.filter(template => {
    if (userLevel === 'beginner') {
      return template.complexity === 'beginner' || template.complexity === 'intermediate';
    } else if (userLevel === 'intermediate') {
      return template.complexity === 'intermediate' || template.complexity === 'advanced';
    } else {
      return true; // Advanced users can see all templates
    }
  });
  
  return appropriateTemplates
    .filter(template => !hasUserInteractedWith(currentSession, template.id))
    .map(template => ({
      template,
      score: template.rating || 0,
      reason: `Recommended for ${userLevel} users`
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Hybrid recommendation engine combining multiple approaches
 */
function getHybridRecommendations(sessionId, options = {}) {
  const {
    limit = 10,
    includeContentBased = true,
    includeCollaborative = true,
    includePopularity = true,
    includeProgressive = true,
    weights = {
      contentBased: 0.3,
      collaborative: 0.3,
      popularity: 0.2,
      progressive: 0.2
    }
  } = options;
  
  const allRecommendations = [];
  
  // Get recommendations from each approach
  if (includeContentBased) {
    const contentRecs = getContentBasedRecommendations(null, Math.ceil(limit * 0.4));
    contentRecs.forEach(rec => {
      allRecommendations.push({
        ...rec,
        score: rec.similarity * weights.contentBased,
        type: 'content-based'
      });
    });
  }
  
  if (includeCollaborative) {
    const collaborativeRecs = getCollaborativeRecommendations(sessionId, Math.ceil(limit * 0.4));
    collaborativeRecs.forEach(rec => {
      allRecommendations.push({
        ...rec,
        score: rec.score * weights.collaborative,
        type: 'collaborative'
      });
    });
  }
  
  if (includePopularity) {
    const popularityRecs = getPopularityRecommendations(sessionId, Math.ceil(limit * 0.3));
    popularityRecs.forEach(rec => {
      allRecommendations.push({
        ...rec,
        score: rec.score * weights.popularity,
        type: 'popularity-based'
      });
    });
  }
  
  if (includeProgressive) {
    const progressiveRecs = getProgressiveRecommendations(sessionId, Math.ceil(limit * 0.3));
    progressiveRecs.forEach(rec => {
      allRecommendations.push({
        ...rec,
        score: rec.score * weights.progressive,
        type: 'progressive'
      });
    });
  }
  
  // Combine and deduplicate recommendations
  const combinedRecs = new Map();
  
  allRecommendations.forEach(rec => {
    const templateId = rec.template.id;
    if (combinedRecs.has(templateId)) {
      const existing = combinedRecs.get(templateId);
      existing.score += rec.score;
      existing.types.push(rec.type);
      existing.reasons.push(rec.reason);
    } else {
      combinedRecs.set(templateId, {
        template: rec.template,
        score: rec.score,
        types: [rec.type],
        reasons: [rec.reason],
        confidence: calculateConfidence(rec.score, rec.type)
      });
    }
  });
  
  // Sort by combined score and return top recommendations
  return Array.from(combinedRecs.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(rec => ({
      ...rec,
      reason: rec.reasons[0], // Primary reason
      confidence: rec.confidence
    }));
}

/**
 * Utility functions
 */
function hasUserInteractedWith(session, templateId) {
  if (!session) return false;
  return session.interactions.some(interaction => interaction.templateId === templateId);
}

function determineUserExperienceLevel(session) {
  const interactions = session.interactions || [];
  const complexityStats = {};
  
  interactions.forEach(interaction => {
    const templates = templateDataService.getAllTemplates();
    const template = templates.find(t => t.id === interaction.templateId);
    if (template) {
      complexityStats[template.complexity] = (complexityStats[template.complexity] || 0) + 1;
    }
  });
  
  const totalInteractions = interactions.length;
  
  if (totalInteractions < 3) return 'beginner';
  
  const advancedRatio = (complexityStats.advanced || 0) / totalInteractions;
  const intermediateRatio = (complexityStats.intermediate || 0) / totalInteractions;
  
  if (advancedRatio > 0.3) return 'advanced';
  if (intermediateRatio > 0.5) return 'intermediate';
  return 'beginner';
}

function generateRecommendationReason(template, targetTemplate, score) {
  if (score > 0.6) {
    return `Very similar to your selected template (${targetTemplate.name})`;
  } else if (score > 0.4) {
    return `Similar methodology and category`;
  } else if (score > 0.2) {
    return `Related template in ${template.methodology}`;
  } else {
    return `Might be useful for your project`;
  }
}

function calculateConfidence(score, type) {
  const baseConfidence = {
    'content-based': 0.8,
    'collaborative': 0.7,
    'popularity-based': 0.6,
    'progressive': 0.9
  };
  
  return Math.min(0.95, (baseConfidence[type] || 0.5) * Math.min(score, 1));
}

/**
 * Get analytics for recommendation system
 */
function getRecommendationAnalytics() {
  const totalSessions = userBehavior.userSessions.size;
  const totalViews = Array.from(userBehavior.templateViews.values()).reduce((sum, views) => sum + views, 0);
  const totalDownloads = Array.from(userBehavior.templateDownloads.values()).reduce((sum, downloads) => sum + downloads, 0);
  
  // Most viewed templates
  const mostViewed = Array.from(userBehavior.templateViews.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([templateId, views]) => {
      const templates = templateDataService.getAllTemplates();
      const template = templates.find(t => t.id === templateId);
      return { template: template?.name || templateId, views };
    });
  
  // Most downloaded templates
  const mostDownloaded = Array.from(userBehavior.templateDownloads.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([templateId, downloads]) => {
      const templates = templateDataService.getAllTemplates();
      const template = templates.find(t => t.id === templateId);
      return { template: template?.name || templateId, downloads };
    });
  
  return {
    totalSessions,
    totalViews,
    totalDownloads,
    mostViewed,
    mostDownloaded,
    averageInteractionsPerSession: totalSessions > 0 ? 
      Array.from(userBehavior.userSessions.values())
        .reduce((sum, session) => sum + session.interactions.length, 0) / totalSessions : 0
  };
}

module.exports = {
  trackUserInteraction,
  getContentBasedRecommendations,
  getCollaborativeRecommendations,
  getPopularityRecommendations,
  getProgressiveRecommendations,
  getHybridRecommendations,
  getRecommendationAnalytics
};
