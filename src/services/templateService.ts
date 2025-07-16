import { Template, SearchFilters, SearchResult, TemplateMetadata } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export class TemplateService {
  static async searchTemplates(
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResult> {
    const response = await fetch(`${API_BASE_URL}/templates/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...filters,
        page,
        pageSize,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to search templates');
    }

    return response.json();
  }

  static async getTemplateMetadata(): Promise<TemplateMetadata> {
    const response = await fetch(`${API_BASE_URL}/templates/metadata`);

    if (!response.ok) {
      throw new Error('Failed to fetch template metadata');
    }

    return response.json();
  }

  static async getTemplateById(id: string): Promise<Template> {
    const response = await fetch(`${API_BASE_URL}/templates/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }

    return response.json();
  }

  static async getRecommendedTemplates(
    methodology?: string,
    category?: string
  ): Promise<Template[]> {
    const response = await fetch(`${API_BASE_URL}/templates/recommended`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        methodology,
        category,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommended templates');
    }

    return response.json();
  }

  static async rateTemplate(
    templateId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating,
        feedback,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit template rating');
    }
  }

  static async getTemplateStats(templateId: string): Promise<{
    usageCount: number;
    averageRating: number;
    ratingCount: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/templates/${templateId}/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch template statistics');
    }

    return response.json();
  }
}
