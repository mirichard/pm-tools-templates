const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import template data and services
const { getTemplateData, searchTemplates, getTemplateMetadata } = require('./services/templateDataService');
const { createTemplateIndex, searchTemplateIndex } = require('./services/searchService');
const { getCachedData, setCacheData } = require('./services/cacheService');
const { logAPICall, getAnalytics } = require('./services/analyticsService');

// Initialize search index on startup
createTemplateIndex();

// API Routes

// Get all templates with pagination
app.get('/api/templates', async (req, res) => {
  logAPICall('GET', '/api/templates', req.query);
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const methodology = req.query.methodology;
    const category = req.query.category;
    
    const cacheKey = `templates_${page}_${limit}_${methodology || 'all'}_${category || 'all'}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const templates = await getTemplateData();
    let filteredTemplates = templates;
    
    // Apply filters
    if (methodology) {
      filteredTemplates = filteredTemplates.filter(t => t.methodology === methodology);
    }
    if (category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);
    
    const result = {
      templates: paginatedTemplates,
      totalCount: filteredTemplates.length,
      pageCount: Math.ceil(filteredTemplates.length / limit),
      currentPage: page,
      hasNext: endIndex < filteredTemplates.length,
      hasPrev: startIndex > 0
    };
    
    setCacheData(cacheKey, result, 300); // Cache for 5 minutes
    res.json(result);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Advanced template search
app.post('/api/templates/search', async (req, res) => {
  logAPICall('POST', '/api/templates/search', req.body);
  
  try {
    const { query, methodology, category, complexity, tags, minRating, page = 1, pageSize = 20 } = req.body;
    
    const cacheKey = `search_${JSON.stringify(req.body)}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const searchResults = await searchTemplateIndex({
      query,
      methodology,
      category,
      complexity,
      tags,
      minRating,
      page,
      pageSize
    });
    
    setCacheData(cacheKey, searchResults, 300); // Cache for 5 minutes
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching templates:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get template metadata (methodologies, categories, tags)
app.get('/api/templates/metadata', async (req, res) => {
  logAPICall('GET', '/api/templates/metadata');
  
  try {
    const cacheKey = 'template_metadata';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const metadata = await getTemplateMetadata();
    setCacheData(cacheKey, metadata, 600); // Cache for 10 minutes
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// Get single template by ID
app.get('/api/templates/:id', async (req, res) => {
  logAPICall('GET', `/api/templates/${req.params.id}`);
  
  try {
    const templates = await getTemplateData();
    const template = templates.find(t => t.id === req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recommended templates based on methodology/category
app.post('/api/templates/recommended', async (req, res) => {
  logAPICall('POST', '/api/templates/recommended', req.body);
  
  try {
    const { methodology, category } = req.body;
    
    const cacheKey = `recommended_${methodology}_${category}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const templates = await getTemplateData();
    let recommended = templates;
    
    // Filter by methodology if provided
    if (methodology) {
      recommended = recommended.filter(t => t.methodology === methodology);
    }
    
    // Filter by category if provided
    if (category) {
      recommended = recommended.filter(t => t.category === category);
    }
    
    // Sort by rating and usage count
    recommended.sort((a, b) => {
      const scoreA = (a.rating || 0) * 0.7 + (a.usageCount || 0) * 0.3;
      const scoreB = (b.rating || 0) * 0.7 + (b.usageCount || 0) * 0.3;
      return scoreB - scoreA;
    });
    
    // Return top 10 recommended templates
    const result = recommended.slice(0, 10);
    
    setCacheData(cacheKey, result, 600); // Cache for 10 minutes
    res.json(result);
  } catch (error) {
    console.error('Error fetching recommended templates:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Rate a template
app.post('/api/templates/:id/rate', async (req, res) => {
  logAPICall('POST', `/api/templates/${req.params.id}/rate`, req.body);
  
  try {
    const { rating, feedback } = req.body;
    const templateId = req.params.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // In a real implementation, this would save to a database
    // For now, we'll just return success
    console.log(`Rating submitted for template ${templateId}: ${rating}/5`);
    if (feedback) {
      console.log(`Feedback: ${feedback}`);
    }
    
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get template statistics
app.get('/api/templates/:id/stats', async (req, res) => {
  logAPICall('GET', `/api/templates/${req.params.id}/stats`);
  
  try {
    const templateId = req.params.id;
    
    // In a real implementation, this would fetch from a database
    // For now, return mock statistics
    const stats = {
      usageCount: Math.floor(Math.random() * 1000) + 100,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      ratingCount: Math.floor(Math.random() * 50) + 10
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching template stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Template Selector API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
