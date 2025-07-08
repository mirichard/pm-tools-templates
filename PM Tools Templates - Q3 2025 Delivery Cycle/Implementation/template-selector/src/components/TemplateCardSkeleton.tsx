import React from 'react';
import './TemplateCardSkeleton.css';

export const TemplateCardSkeleton: React.FC = () => {
  return (
    <div className="template-card-skeleton" aria-hidden="true">
      <div className="skeleton-title" />
      <div className="skeleton-description">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
      <div className="skeleton-metadata">
        <div className="skeleton-tag" />
        <div className="skeleton-tag" />
      </div>
    </div>
  );
};
