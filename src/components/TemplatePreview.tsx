import React from 'react';
import './TemplatePreview.css';

interface TemplateMetadata {
  author?: string;
  lastUpdated?: string;
  version?: string;
  rating?: number;
  usageCount?: number;
  complexity?: string;
  tags?: string[];
}

interface TemplateSection {
  title: string;
  content: string;
}

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    description: string;
    methodology: string;
    category: string;
    metadata?: TemplateMetadata;
    sections?: TemplateSection[];
  };
  onClose: () => void;
  onUse: (templateId: string) => void;
  onDownload?: (templateId: string) => void;
  onShare?: (templateId: string) => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  template, 
  onClose,
  onUse,
  onDownload,
  onShare 
}) => {
  return (
    <div className="template-preview">
      <div className="preview-header">
        <h2>{template.name}</h2>
        <button onClick={onClose} className="close-button" aria-label="Close preview">
          ×
        </button>
      </div>
      <div className="preview-content">
        <div className="preview-metadata">
          <div className="metadata-tags">
            <span className="methodology-tag">{template.methodology}</span>
            <span className="category-tag">{template.category}</span>
            {template.metadata?.complexity && (
              <span className="complexity-tag">{template.metadata.complexity}</span>
            )}
          </div>
          {template.metadata && (
            <div className="metadata-details">
              {template.metadata.author && (
                <div className="metadata-item">
                  <span className="metadata-label">Author</span>
                  <span className="metadata-value">{template.metadata.author}</span>
                </div>
              )}
              {template.metadata.lastUpdated && (
                <div className="metadata-item">
                  <span className="metadata-label">Last Updated</span>
                  <span className="metadata-value">{template.metadata.lastUpdated}</span>
                </div>
              )}
              {template.metadata.version && (
                <div className="metadata-item">
                  <span className="metadata-label">Version</span>
                  <span className="metadata-value">{template.metadata.version}</span>
                </div>
              )}
              {template.metadata.usageCount !== undefined && (
                <div className="metadata-item">
                  <span className="metadata-label">Times Used</span>
                  <span className="metadata-value">{template.metadata.usageCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="preview-description">
          <h3>Description</h3>
          <p>{template.description}</p>
        </div>

        {template.sections?.map((section, index) => (
          <div key={index} className="preview-section">
            <h3>{section.title}</h3>
            <div className="section-content">{section.content}</div>
          </div>
        ))}
      </div>
      <div className="preview-actions">
        <button 
          onClick={() => onUse(template.id)} 
          className="use-template"
        >
          Use Template
        </button>
        {onDownload && (
          <button 
            onClick={() => onDownload(template.id)} 
            className="download-template"
          >
            Download
          </button>
        )}
        {onShare && (
          <button 
            onClick={() => onShare(template.id)} 
            className="share-template"
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
};

