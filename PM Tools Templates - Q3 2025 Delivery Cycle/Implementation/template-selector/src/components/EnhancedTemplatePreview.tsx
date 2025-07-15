import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Template } from '../types';
import './EnhancedTemplatePreview.css';

interface PreviewCache {
  [key: string]: {
    renderedContent: string;
    timestamp: number;
    metadata: any;
  };
}

interface EnhancedTemplatePreviewProps {
  template: Template;
  onClose: () => void;
  onUse: (templateId: string) => void;
  onDownload?: (templateId: string) => void;
  onShare?: (templateId: string) => void;
  onFavorite?: (templateId: string) => void;
  isFavorite?: boolean;
  isLoading?: boolean;
  showAnalytics?: boolean;
}

interface TemplateAnalytics {
  usageCount: number;
  rating: number;
  lastUsed: string;
  popularSections: string[];
  estimatedTime: string;
  difficulty: string;
  successRate: number;
}

export const EnhancedTemplatePreview: React.FC<EnhancedTemplatePreviewProps> = ({
  template,
  onClose,
  onUse,
  onDownload,
  onShare,
  onFavorite,
  isFavorite = false,
  isLoading = false,
  showAnalytics = true
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'analytics'>('overview');
  const [renderedContent, setRenderedContent] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [previewCache, setPreviewCache] = useState<PreviewCache>({});
  const [analytics, setAnalytics] = useState<TemplateAnalytics | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Cache management
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedContent = useCallback((templateId: string) => {
    const cached = previewCache[templateId];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.renderedContent;
    }
    return null;
  }, [previewCache]);

  const setCachedContent = useCallback((templateId: string, content: string, metadata: any) => {
    setPreviewCache(prev => ({
      ...prev,
      [templateId]: {
        renderedContent: content,
        timestamp: Date.now(),
        metadata
      }
    }));
  }, []);

  // Template rendering with caching
  const renderTemplate = useCallback(async (template: Template) => {
    const cachedContent = getCachedContent(template.id);
    if (cachedContent) {
      setRenderedContent(cachedContent);
      return;
    }

    setIsRendering(true);
    try {
      // Simulate template rendering with markdown/HTML processing
      const mockRenderedContent = `
        <div class="template-render">
          <h1>${template.name}</h1>
          <div class="template-metadata">
            <span class="methodology">${template.methodology}</span>
            <span class="category">${template.category}</span>
            <span class="complexity">${template.metadata?.complexity || 'Medium'}</span>
          </div>
          <div class="template-description">
            <p>${template.description}</p>
          </div>
          ${template.sections?.map(section => `
            <div class="template-section">
              <h2>${section.title}</h2>
              <div class="section-content">${section.content}</div>
            </div>
          `).join('') || ''}
          <div class="template-structure">
            <h3>Template Structure</h3>
            <ul>
              <li>Executive Summary</li>
              <li>Project Objectives</li>
              <li>Scope Definition</li>
              <li>Timeline & Milestones</li>
              <li>Resource Requirements</li>
              <li>Risk Assessment</li>
              <li>Success Metrics</li>
            </ul>
          </div>
        </div>
      `;

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRenderedContent(mockRenderedContent);
      setCachedContent(template.id, mockRenderedContent, template.metadata);
    } catch (error) {
      console.error('Error rendering template:', error);
      setRenderedContent('<div class="error">Failed to render template preview</div>');
    } finally {
      setIsRendering(false);
    }
  }, [getCachedContent, setCachedContent]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (templateId: string) => {
    try {
      // Simulate analytics API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockAnalytics: TemplateAnalytics = {
        usageCount: Math.floor(Math.random() * 1000) + 100,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        popularSections: ['Executive Summary', 'Timeline', 'Risk Assessment'],
        estimatedTime: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 4) + 5} hours`,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
        successRate: Math.floor(Math.random() * 30) + 70
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  // Effects
  useEffect(() => {
    if (activeTab === 'preview') {
      renderTemplate(template);
    }
  }, [activeTab, template, renderTemplate]);

  useEffect(() => {
    if (activeTab === 'analytics' && showAnalytics) {
      fetchAnalytics(template.id);
    }
  }, [activeTab, template.id, showAnalytics, fetchAnalytics]);

  // Memoized components
  const TabNavigation = useMemo(() => (
    <div className="preview-tabs">
      <button
        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button>
      <button
        className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
        onClick={() => setActiveTab('preview')}
      >
        Preview
      </button>
      {showAnalytics && (
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      )}
    </div>
  ), [activeTab, showAnalytics]);

  const OverviewContent = useMemo(() => (
    <div className="preview-overview">
      <div className="overview-header">
        <div className="template-info">
          <h3>{template.name}</h3>
          <div className="template-tags">
            <span className="methodology-tag">{template.methodology}</span>
            <span className="category-tag">{template.category}</span>
            {template.metadata?.complexity && (
              <span className="complexity-tag">{template.metadata.complexity}</span>
            )}
          </div>
        </div>
        <div className="template-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < Math.floor(template.metadata?.rating || 4) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-count">
            ({template.metadata?.usageCount || 0} uses)
          </span>
        </div>
      </div>

      <div className="template-description">
        <p>{template.description}</p>
      </div>

      <div className="template-details">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Author</span>
            <span className="detail-value">{template.metadata?.author || 'PM Tools Team'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Version</span>
            <span className="detail-value">{template.metadata?.version || '1.0.0'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Updated</span>
            <span className="detail-value">{template.metadata?.lastUpdated || 'Recently'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Estimated Time</span>
            <span className="detail-value">{analytics?.estimatedTime || '2-4 hours'}</span>
          </div>
        </div>
      </div>

      {template.metadata?.tags && (
        <div className="template-tags-section">
          <h4>Tags</h4>
          <div className="tags-list">
            {template.metadata.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  ), [template, analytics]);

  const PreviewContent = useMemo(() => (
    <div className="preview-content">
      <div className="preview-controls">
        <div className="zoom-controls">
          <button 
            onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
            disabled={zoomLevel <= 50}
          >
            −
          </button>
          <span>{zoomLevel}%</span>
          <button 
            onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}
            disabled={zoomLevel >= 200}
          >
            +
          </button>
        </div>
        <button
          className="fullscreen-btn"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? '⤓' : '⤢'}
        </button>
      </div>
      
      <div className="template-preview-container">
        {isRendering ? (
          <div className="preview-loading">
            <div className="loading-spinner"></div>
            <p>Rendering template preview...</p>
          </div>
        ) : (
          <div 
            className="template-rendered"
            style={{ transform: `scale(${zoomLevel / 100})` }}
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        )}
      </div>
    </div>
  ), [renderedContent, isRendering, zoomLevel, isFullscreen]);

  const AnalyticsContent = useMemo(() => (
    <div className="preview-analytics">
      {analytics ? (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>Usage Statistics</h4>
            <div className="metric">
              <span className="metric-value">{analytics.usageCount}</span>
              <span className="metric-label">Times Used</span>
            </div>
            <div className="metric">
              <span className="metric-value">{analytics.rating}/5</span>
              <span className="metric-label">Average Rating</span>
            </div>
          </div>
          
          <div className="analytics-card">
            <h4>Project Success</h4>
            <div className="metric">
              <span className="metric-value">{analytics.successRate}%</span>
              <span className="metric-label">Success Rate</span>
            </div>
            <div className="metric">
              <span className="metric-value">{analytics.difficulty}</span>
              <span className="metric-label">Difficulty</span>
            </div>
          </div>
          
          <div className="analytics-card">
            <h4>Popular Sections</h4>
            <ul className="popular-sections">
              {analytics.popularSections.map((section, index) => (
                <li key={index}>{section}</li>
              ))}
            </ul>
          </div>
          
          <div className="analytics-card">
            <h4>Time Estimation</h4>
            <div className="metric">
              <span className="metric-value">{analytics.estimatedTime}</span>
              <span className="metric-label">Setup Time</span>
            </div>
            <div className="metric">
              <span className="metric-value">{analytics.lastUsed}</span>
              <span className="metric-label">Last Used</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      )}
    </div>
  ), [analytics]);

  return (
    <div className={`enhanced-template-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <div className="header-left">
          <h2>{template.name}</h2>
          <div className="header-actions">
            {onFavorite && (
              <button
                onClick={() => onFavorite(template.id)}
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '★' : '☆'}
              </button>
            )}
          </div>
        </div>
        <button onClick={onClose} className="close-button" aria-label="Close preview">
          ×
        </button>
      </div>

      {TabNavigation}

      <div className="preview-body">
        {activeTab === 'overview' && OverviewContent}
        {activeTab === 'preview' && PreviewContent}
        {activeTab === 'analytics' && AnalyticsContent}
      </div>

      <div className="preview-actions">
        <button 
          onClick={() => onUse(template.id)} 
          className="use-template-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Use Template'}
        </button>
        {onDownload && (
          <button 
            onClick={() => onDownload(template.id)} 
            className="download-btn"
          >
            Download
          </button>
        )}
        {onShare && (
          <button 
            onClick={() => onShare(template.id)} 
            className="share-btn"
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
};
