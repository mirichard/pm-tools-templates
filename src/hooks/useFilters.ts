import { useState, useCallback } from 'react';
import { Template } from '../types';

interface UseFiltersReturn {
  methodology: string;
  category: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | '';
  searchQuery: string;
  currentPage: number;
  setMethodology: (methodology: string) => void;
  setCategory: (category: string) => void;
  setComplexity: (complexity: 'Beginner' | 'Intermediate' | 'Advanced' | '') => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  clearFilters: () => void;
  sortTemplates: (templates: Template[], sortBy: 'name' | 'recent') => Template[];
}

export const useFilters = (): UseFiltersReturn => {
  const [methodology, setMethodology] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState<'Beginner' | 'Intermediate' | 'Advanced' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const clearFilters = useCallback(() => {
    setMethodology('');
    setCategory('');
    setComplexity('');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const sortTemplates = useCallback((templates: Template[], sortBy: 'name' | 'recent') => {
    const sortedTemplates = [...templates];
    
    switch (sortBy) {
      case 'name':
        return sortedTemplates.sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return sortedTemplates.sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      default:
        return sortedTemplates;
    }
  }, []);

  return {
    methodology,
    category,
    complexity,
    searchQuery,
    currentPage,
    setMethodology,
    setCategory,
    setComplexity,
    setSearchQuery,
    setCurrentPage,
    clearFilters,
    sortTemplates
  };
};
