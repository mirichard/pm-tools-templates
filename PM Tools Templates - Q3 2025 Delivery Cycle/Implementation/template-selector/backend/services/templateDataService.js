const fs = require('fs').promises;
const path = require('path');

// Enhanced template data with all required fields
const enhancedTemplateData = [
  {
    id: '1',
    name: 'Project Charter',
    description: 'Standard template for initiating a project and defining high-level project details',
    methodology: 'PMBOK',
    category: 'Initiation',
    complexity: 'beginner',
    tags: ['project-management', 'initiation', 'charter', 'stakeholders'],
    lastUpdated: '2024-12-01',
    author: 'PM Tools Team',
    rating: 4.5,
    usageCount: 847,
    previewUrl: '/templates/preview/project-charter.md'
  },
  {
    id: '2',
    name: 'Sprint Planning Template',
    description: 'Template for planning and organizing sprint activities with story estimation',
    methodology: 'Agile',
    category: 'Planning',
    complexity: 'intermediate',
    tags: ['agile', 'sprint', 'planning', 'scrum', 'estimation'],
    lastUpdated: '2024-11-28',
    author: 'Agile Team',
    rating: 4.7,
    usageCount: 1203,
    previewUrl: '/templates/preview/sprint-planning.md'
  },
  {
    id: '3',
    name: 'Risk Register',
    description: 'Comprehensive template for tracking and managing project risks',
    methodology: 'Hybrid',
    category: 'Risk Management',
    complexity: 'intermediate',
    tags: ['risk', 'management', 'tracking', 'mitigation', 'assessment'],
    lastUpdated: '2024-11-30',
    author: 'Risk Management Team',
    rating: 4.3,
    usageCount: 592,
    previewUrl: '/templates/preview/risk-register.md'
  },
  {
    id: '4',
    name: 'Stakeholder Register',
    description: 'Template for documenting and analyzing stakeholder information and engagement',
    methodology: 'PMBOK',
    category: 'Stakeholder Management',
    complexity: 'beginner',
    tags: ['stakeholder', 'communication', 'engagement', 'analysis'],
    lastUpdated: '2024-12-02',
    author: 'Communications Team',
    rating: 4.1,
    usageCount: 435,
    previewUrl: '/templates/preview/stakeholder-register.md'
  },
  {
    id: '5',
    name: 'Daily Standup Template',
    description: 'Quick and effective template for conducting daily standup meetings',
    methodology: 'Agile',
    category: 'Execution',
    complexity: 'beginner',
    tags: ['agile', 'standup', 'daily', 'scrum', 'meeting'],
    lastUpdated: '2024-11-25',
    author: 'Scrum Masters',
    rating: 4.6,
    usageCount: 1567,
    previewUrl: '/templates/preview/daily-standup.md'
  },
  {
    id: '6',
    name: 'Work Breakdown Structure',
    description: 'Hierarchical decomposition of project work into manageable tasks',
    methodology: 'PMBOK',
    category: 'Planning',
    complexity: 'intermediate',
    tags: ['wbs', 'decomposition', 'tasks', 'hierarchy', 'planning'],
    lastUpdated: '2024-11-29',
    author: 'Project Planning Team',
    rating: 4.4,
    usageCount: 789,
    previewUrl: '/templates/preview/wbs.md'
  },
  {
    id: '7',
    name: 'Sprint Retrospective',
    description: 'Template for conducting effective sprint retrospectives and continuous improvement',
    methodology: 'Agile',
    category: 'Monitoring',
    complexity: 'intermediate',
    tags: ['retrospective', 'improvement', 'agile', 'team', 'feedback'],
    lastUpdated: '2024-11-27',
    author: 'Agile Coaches',
    rating: 4.8,
    usageCount: 923,
    previewUrl: '/templates/preview/sprint-retrospective.md'
  },
  {
    id: '8',
    name: 'Change Request Template',
    description: 'Formal template for documenting and managing project changes',
    methodology: 'Hybrid',
    category: 'Change Management',
    complexity: 'intermediate',
    tags: ['change', 'request', 'control', 'approval', 'impact'],
    lastUpdated: '2024-12-01',
    author: 'Change Control Board',
    rating: 4.2,
    usageCount: 367,
    previewUrl: '/templates/preview/change-request.md'
  },
  {
    id: '9',
    name: 'Quality Assurance Plan',
    description: 'Comprehensive template for establishing quality standards and processes',
    methodology: 'PMBOK',
    category: 'Quality Management',
    complexity: 'advanced',
    tags: ['quality', 'assurance', 'standards', 'processes', 'testing'],
    lastUpdated: '2024-11-26',
    author: 'QA Team',
    rating: 4.5,
    usageCount: 234,
    previewUrl: '/templates/preview/qa-plan.md'
  },
  {
    id: '10',
    name: 'User Story Template',
    description: 'Template for writing effective user stories with acceptance criteria',
    methodology: 'Agile',
    category: 'Requirements',
    complexity: 'beginner',
    tags: ['user-story', 'requirements', 'acceptance', 'criteria', 'agile'],
    lastUpdated: '2024-11-30',
    author: 'Product Owners',
    rating: 4.7,
    usageCount: 1456,
    previewUrl: '/templates/preview/user-story.md'
  },
  {
    id: '11',
    name: 'Communication Plan',
    description: 'Template for planning and managing project communications',
    methodology: 'Hybrid',
    category: 'Communication',
    complexity: 'intermediate',
    tags: ['communication', 'plan', 'stakeholder', 'messaging', 'channels'],
    lastUpdated: '2024-12-02',
    author: 'Communications Team',
    rating: 4.3,
    usageCount: 512,
    previewUrl: '/templates/preview/communication-plan.md'
  },
  {
    id: '12',
    name: 'Release Planning Template',
    description: 'Template for planning and managing product releases',
    methodology: 'Agile',
    category: 'Release Management',
    complexity: 'advanced',
    tags: ['release', 'planning', 'deployment', 'features', 'timeline'],
    lastUpdated: '2024-11-28',
    author: 'Release Team',
    rating: 4.6,
    usageCount: 398,
    previewUrl: '/templates/preview/release-planning.md'
  }
];

/**
 * Get all template data
 * @returns {Promise<Array>} Array of template objects
 */
async function getTemplateData() {
  try {
    // In a real implementation, this would fetch from a database
    // For now, return the enhanced mock data
    return enhancedTemplateData;
  } catch (error) {
    console.error('Error fetching template data:', error);
    throw error;
  }
}

/**
 * Search templates based on query and filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} Filtered template array
 */
async function searchTemplates(filters) {
  try {
    const templates = await getTemplateData();
    let results = templates;

    // Apply text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.methodology.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply methodology filter
    if (filters.methodology) {
      results = results.filter(template => template.methodology === filters.methodology);
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter(template => template.category === filters.category);
    }

    // Apply complexity filter
    if (filters.complexity) {
      results = results.filter(template => template.complexity === filters.complexity);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(template => 
        filters.tags.some(tag => template.tags.includes(tag))
      );
    }

    // Apply minimum rating filter
    if (filters.minRating) {
      results = results.filter(template => template.rating >= filters.minRating);
    }

    // Sort by relevance (rating * usage count)
    results.sort((a, b) => {
      const scoreA = a.rating * Math.log(a.usageCount + 1);
      const scoreB = b.rating * Math.log(b.usageCount + 1);
      return scoreB - scoreA;
    });

    return results;
  } catch (error) {
    console.error('Error searching templates:', error);
    throw error;
  }
}

/**
 * Get template metadata (methodologies, categories, tags)
 * @returns {Promise<Object>} Metadata object
 */
async function getTemplateMetadata() {
  try {
    const templates = await getTemplateData();
    
    const methodologies = [...new Set(templates.map(t => t.methodology))];
    const categories = [...new Set(templates.map(t => t.category))];
    const tags = [...new Set(templates.flatMap(t => t.tags))];
    
    return {
      methodologies: methodologies.sort(),
      categories: categories.sort(),
      tags: tags.sort()
    };
  } catch (error) {
    console.error('Error fetching template metadata:', error);
    throw error;
  }
}

/**
 * Get a single template by ID
 * @param {string} id - Template ID
 * @returns {Promise<Object|null>} Template object or null
 */
async function getTemplateById(id) {
  try {
    const templates = await getTemplateData();
    return templates.find(template => template.id === id) || null;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    throw error;
  }
}

/**
 * Get templates by methodology
 * @param {string} methodology - Methodology name
 * @returns {Promise<Array>} Array of templates
 */
async function getTemplatesByMethodology(methodology) {
  try {
    const templates = await getTemplateData();
    return templates.filter(template => template.methodology === methodology);
  } catch (error) {
    console.error('Error fetching templates by methodology:', error);
    throw error;
  }
}

/**
 * Get templates by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of templates
 */
async function getTemplatesByCategory(category) {
  try {
    const templates = await getTemplateData();
    return templates.filter(template => template.category === category);
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    throw error;
  }
}

/**
 * Get top rated templates
 * @param {number} limit - Number of templates to return
 * @returns {Promise<Array>} Array of top rated templates
 */
async function getTopRatedTemplates(limit = 5) {
  try {
    const templates = await getTemplateData();
    return templates
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top rated templates:', error);
    throw error;
  }
}

/**
 * Get most used templates
 * @param {number} limit - Number of templates to return
 * @returns {Promise<Array>} Array of most used templates
 */
async function getMostUsedTemplates(limit = 5) {
  try {
    const templates = await getTemplateData();
    return templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching most used templates:', error);
    throw error;
  }
}

module.exports = {
  getTemplateData,
  searchTemplates,
  getTemplateMetadata,
  getTemplateById,
  getTemplatesByMethodology,
  getTemplatesByCategory,
  getTopRatedTemplates,
  getMostUsedTemplates
};
