import { useState, useEffect, useCallback, useMemo } from 'react';
import { Template } from '../types';

// Enhanced search engine with fuzzy matching
export class EnhancedSearchEngine {
  private templates: Template[] = [];
  private searchIndex: Map<string, Set<number>> = new Map();
  
  constructor(templates: Template[]) {
    this.templates = templates;
    this.buildSearchIndex();
  }

  private buildSearchIndex() {
    this.searchIndex.clear();
    
    this.templates.forEach((template, index) => {
      const searchableText = this.getSearchableText(template);
      const words = this.tokenize(searchableText);
      
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(index);
      });
    });
  }

  private getSearchableText(template: Template): string {
    return [
      template.name,
      template.description,
      template.methodology,
      template.category,
      template.metadata?.author || '',
      template.metadata?.tags?.join(' ') || '',
      template.sections?.map(s => `${s.title} ${s.content}`).join(' ') || ''
    ].join(' ').toLowerCase();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private fuzzyMatch(query: string, word: string, threshold: number = 0.7): boolean {
    if (word.includes(query)) return true;
    
    const distance = this.levenshteinDistance(query, word);
    const maxLength = Math.max(query.length, word.length);
    const similarity = 1 - (distance / maxLength);
    
    return similarity >= threshold;
  }

  search(query: string, options: {
    fuzzy?: boolean;
    threshold?: number;
    limit?: number;
  } = {}): Template[] {
    const { fuzzy = true, threshold = 0.7, limit = 100 } = options;
    
    if (!query.trim()) return this.templates;
    
    const queryWords = this.tokenize(query);
    const templateScores = new Map<number, number>();
    
    queryWords.forEach(queryWord => {
      // Exact matches
      if (this.searchIndex.has(queryWord)) {
        this.searchIndex.get(queryWord)!.forEach(templateIndex => {
          templateScores.set(templateIndex, (templateScores.get(templateIndex) || 0) + 2);
        });
      }
      
      // Fuzzy matches
      if (fuzzy) {
        this.searchIndex.forEach((templateIndexes, word) => {
          if (this.fuzzyMatch(queryWord, word, threshold)) {
            templateIndexes.forEach(templateIndex => {
              templateScores.set(templateIndex, (templateScores.get(templateIndex) || 0) + 1);
            });
          }
        });
      }
    });
    
    // Sort by score and return results
    const sortedResults = Array.from(templateScores.entries())
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, limit)
      .map(([templateIndex]) => this.templates[templateIndex]);
    
    return sortedResults;
  }

  filter(filters: {
    methodology?: string;
    category?: string;
    complexity?: string;
    tags?: string[];
    rating?: number;
    usageCount?: number;
  }): Template[] {
    return this.templates.filter(template => {
      if (filters.methodology && template.methodology !== filters.methodology) {
        return false;
      }
      
      if (filters.category && template.category !== filters.category) {
        return false;
      }
      
      if (filters.complexity && template.metadata?.complexity !== filters.complexity) {
        return false;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        const templateTags = template.metadata?.tags || [];
        if (!filters.tags.some(tag => templateTags.includes(tag))) {
          return false;
        }
      }
      
      if (filters.rating && (template.metadata?.rating || 0) < filters.rating) {
        return false;
      }
      
      if (filters.usageCount && (template.metadata?.usageCount || 0) < filters.usageCount) {
        return false;
      }
      
      return true;
    });
  }

  searchAndFilter(query: string, filters: any, options: any = {}): Template[] {
    let results = this.templates;
    
    // Apply filters first
    if (Object.keys(filters).length > 0) {
      results = this.filter(filters);
    }
    
    // Then apply search
    if (query.trim()) {
      const searchEngine = new EnhancedSearchEngine(results);
      results = searchEngine.search(query, options);
    }
    
    return results;
  }
}

interface UseEnhancedSearchParams {
  templates: Template[];
  searchQuery: string;
  filters: {
    methodology?: string;
    category?: string;
    complexity?: string;
    tags?: string[];
    rating?: number;
    usageCount?: number;
  };
  options?: {
    fuzzy?: boolean;
    threshold?: number;
    limit?: number;
    debounceMs?: number;
  };
}

interface UseEnhancedSearchReturn {
  results: Template[];
  loading: boolean;
  searchEngine: EnhancedSearchEngine | null;
  totalResults: number;
  searchTime: number;
  suggestions: string[];
}

export const useEnhancedSearch = ({
  templates,
  searchQuery,
  filters,
  options = {}
}: UseEnhancedSearchParams): UseEnhancedSearchReturn => {
  const [results, setResults] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const { debounceMs = 300 } = options;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Memoize search engine
  const searchEngine = useMemo(() => {
    if (templates.length === 0) return null;
    return new EnhancedSearchEngine(templates);
  }, [templates]);

  // Generate search suggestions
  const generateSuggestions = useCallback((query: string, templates: Template[]): string[] => {
    if (!query.trim()) return [];
    
    const suggestions = new Set<string>();
    
    templates.forEach(template => {
      // Add similar template names
      if (template.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(template.name);
      }
      
      // Add methodology and category suggestions
      if (template.methodology.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(template.methodology);
      }
      
      if (template.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(template.category);
      }
      
      // Add tag suggestions
      template.metadata?.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, []);

  // Perform search
  const performSearch = useCallback(async () => {
    if (!searchEngine) return;
    
    setLoading(true);
    const startTime = performance.now();
    
    try {
      // Simulate async operation for UI feedback
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const searchResults = searchEngine.searchAndFilter(debouncedQuery, filters, options);
      
      setResults(searchResults);
      setTotalResults(searchResults.length);
      
      // Generate suggestions
      const newSuggestions = generateSuggestions(debouncedQuery, templates);
      setSuggestions(newSuggestions);
      
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      const endTime = performance.now();
      setSearchTime(endTime - startTime);
      setLoading(false);
    }
  }, [searchEngine, debouncedQuery, filters, options, generateSuggestions, templates]);

  // Effect to trigger search
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return {
    results,
    loading,
    searchEngine,
    totalResults,
    searchTime,
    suggestions
  };
};
