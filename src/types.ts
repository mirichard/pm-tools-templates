export interface Template {
  id: string;
  name: string;
  description: string;
  methodology: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  lastUpdated: string;
  author: string;
  rating: number;
  usageCount: number;
  previewUrl?: string;
}

export interface TemplateMetadata {
  methodologies: string[];
  categories: string[];
  tags: string[];
}

export interface SearchFilters {
  methodology?: string;
  category?: string;
  complexity?: string;
  tags?: string[];
  author?: string;
  minRating?: number;
}

export interface SearchResult {
  templates: Template[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}
