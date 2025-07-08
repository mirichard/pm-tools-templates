const { getTemplateData } = require('./templateDataService');

// In-memory search index
let searchIndex = null;

/**
 * Create a search index for templates
 * This builds an inverted index for fast text search
 */
async function createTemplateIndex() {
  try {
    console.log('Building search index...');
    const templates = await getTemplateData();
    
    // Create inverted index
    const index = {
      terms: new Map(),
      documents: new Map()
    };
    
    templates.forEach(template => {
      // Store document
      index.documents.set(template.id, template);
      
      // Tokenize and index searchable text
      const searchableText = [
        template.name,
        template.description,
        template.methodology,
        template.category,
        template.author,
        ...template.tags
      ].join(' ').toLowerCase();
      
      // Simple tokenization (split by spaces and punctuation)
      const tokens = searchableText
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 1);
      
      tokens.forEach(token => {
        if (!index.terms.has(token)) {
          index.terms.set(token, new Set());
        }
        index.terms.get(token).add(template.id);
      });
    });
    
    searchIndex = index;
    console.log(`Search index built with ${templates.length} templates and ${index.terms.size} terms`);
  } catch (error) {
    console.error('Error building search index:', error);
    throw error;
  }
}

/**
 * Search the index with query and filters
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
async function searchTemplateIndex(options) {
  try {
    const {
      query = '',
      methodology,
      category,
      complexity,
      tags = [],
      minRating,
      page = 1,
      pageSize = 20
    } = options;
    
    if (!searchIndex) {
      await createTemplateIndex();
    }
    
    let candidateIds = new Set();
    
    // If there's a text query, use the search index
    if (query && query.trim().length > 0) {
      const queryTerms = query.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(term => term.length > 1);
      
      if (queryTerms.length > 0) {
        // Find documents containing any of the query terms
        queryTerms.forEach(term => {
          const termResults = searchIndex.terms.get(term);
          if (termResults) {
            if (candidateIds.size === 0) {
              candidateIds = new Set(termResults);
            } else {
              // Union of results (OR logic)
              termResults.forEach(id => candidateIds.add(id));
            }
          }
        });
      }
    } else {
      // No text query, include all documents
      candidateIds = new Set(searchIndex.documents.keys());
    }
    
    // Convert to array of template objects
    let results = Array.from(candidateIds)
      .map(id => searchIndex.documents.get(id))
      .filter(template => template); // Filter out any null/undefined
    
    // Apply filters
    if (methodology) {
      results = results.filter(template => template.methodology === methodology);
    }
    
    if (category) {
      results = results.filter(template => template.category === category);
    }
    
    if (complexity) {
      results = results.filter(template => template.complexity === complexity);
    }
    
    if (tags.length > 0) {
      results = results.filter(template =>
        tags.some(tag => template.tags.includes(tag))
      );
    }
    
    if (minRating) {
      results = results.filter(template => template.rating >= minRating);
    }
    
    // Calculate relevance scores if there's a text query
    if (query && query.trim().length > 0) {
      const queryTerms = query.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(term => term.length > 1);
      
      results = results.map(template => {
        let score = 0;
        const templateText = [
          template.name,
          template.description,
          template.methodology,
          template.category,
          ...template.tags
        ].join(' ').toLowerCase();
        
        queryTerms.forEach(term => {
          // Name matches get higher score
          if (template.name.toLowerCase().includes(term)) {
            score += 10;
          }
          // Description matches get medium score
          if (template.description.toLowerCase().includes(term)) {
            score += 5;
          }
          // Tag matches get medium score
          if (template.tags.some(tag => tag.toLowerCase().includes(term))) {
            score += 5;
          }
          // Other matches get lower score
          if (templateText.includes(term)) {
            score += 1;
          }
        });
        
        // Factor in popularity (rating and usage)
        score += template.rating * 2;
        score += Math.log(template.usageCount + 1);
        
        return { ...template, relevanceScore: score };
      });
      
      // Sort by relevance score
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else {
      // No text query, sort by popularity
      results.sort((a, b) => {
        const scoreA = a.rating * 0.7 + Math.log(a.usageCount + 1) * 0.3;
        const scoreB = b.rating * 0.7 + Math.log(b.usageCount + 1) * 0.3;
        return scoreB - scoreA;
      });
    }
    
    // Pagination
    const totalCount = results.length;
    const pageCount = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    return {
      templates: paginatedResults,
      totalCount,
      pageCount,
      currentPage: page,
      hasNext: endIndex < totalCount,
      hasPrev: startIndex > 0,
      searchInfo: {
        query,
        filtersApplied: {
          methodology: !!methodology,
          category: !!category,
          complexity: !!complexity,
          tags: tags.length > 0,
          minRating: !!minRating
        }
      }
    };
  } catch (error) {
    console.error('Error searching index:', error);
    throw error;
  }
}

/**
 * Get search suggestions based on partial query
 * @param {string} partialQuery - Partial search query
 * @returns {Array} Array of search suggestions
 */
function getSearchSuggestions(partialQuery) {
  try {
    if (!searchIndex || !partialQuery || partialQuery.length < 2) {
      return [];
    }
    
    const query = partialQuery.toLowerCase();
    const suggestions = [];
    
    // Find matching terms in the index
    for (const [term, docIds] of searchIndex.terms.entries()) {
      if (term.startsWith(query) && docIds.size > 0) {
        suggestions.push({
          term,
          resultCount: docIds.size
        });
      }
    }
    
    // Sort by result count (most popular first)
    suggestions.sort((a, b) => b.resultCount - a.resultCount);
    
    return suggestions.slice(0, 10); // Return top 10 suggestions
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
}

/**
 * Get popular search terms
 * @returns {Array} Array of popular search terms
 */
function getPopularSearchTerms() {
  try {
    if (!searchIndex) {
      return [];
    }
    
    const popularTerms = [];
    
    for (const [term, docIds] of searchIndex.terms.entries()) {
      if (term.length > 2 && docIds.size > 1) {
        popularTerms.push({
          term,
          resultCount: docIds.size
        });
      }
    }
    
    // Sort by result count and term length (prefer longer, more specific terms)
    popularTerms.sort((a, b) => {
      const scoreA = a.resultCount * a.term.length;
      const scoreB = b.resultCount * b.term.length;
      return scoreB - scoreA;
    });
    
    return popularTerms.slice(0, 20);
  } catch (error) {
    console.error('Error getting popular search terms:', error);
    return [];
  }
}

/**
 * Rebuild the search index (useful for when template data changes)
 */
async function rebuildSearchIndex() {
  try {
    console.log('Rebuilding search index...');
    searchIndex = null;
    await createTemplateIndex();
    console.log('Search index rebuilt successfully');
  } catch (error) {
    console.error('Error rebuilding search index:', error);
    throw error;
  }
}

/**
 * Get search index statistics
 * @returns {Object} Index statistics
 */
function getSearchIndexStats() {
  try {
    if (!searchIndex) {
      return {
        indexed: false,
        documentCount: 0,
        termCount: 0
      };
    }
    
    return {
      indexed: true,
      documentCount: searchIndex.documents.size,
      termCount: searchIndex.terms.size,
      averageTermsPerDocument: searchIndex.terms.size / searchIndex.documents.size
    };
  } catch (error) {
    console.error('Error getting search index stats:', error);
    return {
      indexed: false,
      documentCount: 0,
      termCount: 0,
      error: error.message
    };
  }
}

module.exports = {
  createTemplateIndex,
  searchTemplateIndex,
  getSearchSuggestions,
  getPopularSearchTerms,
  rebuildSearchIndex,
  getSearchIndexStats
};
