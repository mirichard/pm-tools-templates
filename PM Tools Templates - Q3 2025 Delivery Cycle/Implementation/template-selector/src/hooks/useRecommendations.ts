import { useState, useEffect, useCallback } from 'react';
import { Template } from '../types';

// Generate or get existing session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('templateSelectorSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('templateSelectorSessionId', sessionId);
  }
  return sessionId;
};

interface RecommendationOptions {
  limit?: number;
  includeContentBased?: boolean;
  includeCollaborative?: boolean;
  includePopularity?: boolean;
  includeProgressive?: boolean;
  weights?: {
    contentBased?: number;
    collaborative?: number;
    popularity?: number;
    progressive?: number;
  };
}

interface Recommendation {
  template: Template;
  score: number;
  reason: string;
  confidence: number;
  types?: string[];
}

interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
trackInteraction: (templateId: string, interactionType: string, metadata?: unknown) => void;
  getHybridRecommendations: (options?: RecommendationOptions) => Promise<void>;
  getContentBasedRecommendations: (templateId: string, limit?: number) => Promise<void>;
  getCollaborativeRecommendations: (limit?: number) => Promise<void>;
  getPopularityRecommendations: (limit?: number) => Promise<void>;
  getProgressiveRecommendations: (limit?: number) => Promise<void>;
  clearRecommendations: () => void;
}

export const useRecommendations = (): UseRecommendationsReturn => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = getSessionId();

  // Track user interaction with templates
const trackInteraction = useCallback(async (templateId: string, interactionType: string, metadata: unknown = {}) => {
    try {
      await fetch('/api/recommendations/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          templateId,
          interactionType,
          metadata
        }),
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }, [sessionId]);

  // Get hybrid recommendations (combines all recommendation types)
  const getHybridRecommendations = useCallback(async (options: RecommendationOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          limit: options.limit || 10,
          options
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get hybrid recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Get content-based recommendations
  const getContentBasedRecommendations = useCallback(async (templateId: string, limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/content-based', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          limit
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get content-based recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get collaborative filtering recommendations
  const getCollaborativeRecommendations = useCallback(async (limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/collaborative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          limit
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get collaborative recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Get popularity-based recommendations
  const getPopularityRecommendations = useCallback(async (limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/popularity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          limit
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get popularity recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Get progressive disclosure recommendations
  const getProgressiveRecommendations = useCallback(async (limit: number = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/progressive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          limit
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get progressive recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Clear recommendations
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  // Auto-track page view when hook is first used
  useEffect(() => {
    trackInteraction('page', 'view', { timestamp: new Date().toISOString() });
  }, [trackInteraction]);

  return {
    recommendations,
    loading,
    error,
    trackInteraction,
    getHybridRecommendations,
    getContentBasedRecommendations,
    getCollaborativeRecommendations,
    getPopularityRecommendations,
    getProgressiveRecommendations,
    clearRecommendations
  };
};

// Hook for getting recommendations based on current template
export const useTemplateRecommendations = (templateId: string | null) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/recommendations/content-based', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId,
            limit: 5
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get template recommendations');
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [templateId]);

  return {
    recommendations,
    loading,
    error
  };
};

// Hook for progressive disclosure recommendations
export const useProgressiveDisclosure = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const sessionId = getSessionId();

  const { trackInteraction } = useRecommendations();

  const fetchProgressiveRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/progressive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          limit: 8
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get progressive recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    fetchProgressiveRecommendations();
  }, [fetchProgressiveRecommendations]);

  // Handle user progression
  const handleUserProgression = useCallback((templateId: string, complexity: 'beginner' | 'intermediate' | 'advanced') => {
    trackInteraction(templateId, 'progression', { complexity, userLevel });
    
    // Update user level based on template complexity
    if (complexity === 'advanced' && userLevel !== 'advanced') {
      setUserLevel('advanced');
    } else if (complexity === 'intermediate' && userLevel === 'beginner') {
      setUserLevel('intermediate');
    }
    
    // Refresh recommendations
    fetchProgressiveRecommendations();
  }, [trackInteraction, userLevel, fetchProgressiveRecommendations]);

  return {
    recommendations,
    loading,
    error,
    userLevel,
    handleUserProgression,
    refreshRecommendations: fetchProgressiveRecommendations
  };
};
