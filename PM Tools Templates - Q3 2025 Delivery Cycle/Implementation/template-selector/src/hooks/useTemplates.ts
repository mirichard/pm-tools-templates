import { useState, useEffect, useCallback } from 'react';
import { Template } from '../types';

// Testing utility to check if we're in a test environment
const isTestEnvironment = () => {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
};

import Fuse from 'fuse.js';

interface UseTemplatesParams {
  methodology: string;
  category: string;
  complexity: string;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  debounceMs?: number;
}

interface UseTemplatesReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  debouncedSearchQuery: string;
}

export const useTemplates = ({
  methodology,
  category,
  complexity,
  searchQuery,
  currentPage,
  itemsPerPage,
  debounceMs = 300
}: UseTemplatesParams): UseTemplatesReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, isTestEnvironment() ? 0 : debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Memoized fetch function to avoid unnecessary re-renders
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
const hasFilters = debouncedSearchQuery.trim() || methodology || category || complexity;
      if (hasFilters) {
        const response = await fetch('/api/templates/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          query: debouncedSearchQuery.trim(),
            methodology: methodology || undefined,
            category: category || undefined,
            complexity: complexity?.toLowerCase() || undefined,
            page: currentPage,
            pageSize: itemsPerPage
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to search templates');
        }
        const data = await response.json();
        setTemplates(data.templates || []);
        setLoading(false);
      } else {
        // Client-side filtering with fuzzy matching
        const response = await fetch(`/api/templates`);
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        // Using Fuse.js for fuzzy search
        const fuse = new Fuse(data.templates || [], {
          keys: ['name', 'description', 'methodology', 'category', 'metadata.tags'],
          threshold: 0.3,
          includeScore: true
        });
        const results = fuse.search(debouncedSearchQuery.trim());
        const filteredTemplates = results.map(result => result.item);
        setTemplates(filteredTemplates);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTemplates([]);
      setLoading(false);
    }
  }, [methodology, category, complexity, debouncedSearchQuery, currentPage, itemsPerPage]);

  // Fetch templates with proper cleanup
  useEffect(() => {
    let isCancelled = false;
    
    const wrappedFetch = async () => {
      if (isCancelled) return;
      await fetchTemplates();
    };

    wrappedFetch();
    
    return () => {
      isCancelled = true;
    };
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    debouncedSearchQuery
  };
};
