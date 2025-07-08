import React from 'react';
import './TemplateCardSkeleton.css';

interface TemplateCardSkeletonProps {
  index: number;
}

export const TemplateCardSkeleton: React.FC<TemplateCardSkeletonProps> = ({ index }) => {
  return (
    <div 
      className="template-card-skeleton" 
      role="listitem"
      aria-label={`Loading template ${index + 1}`}
      aria-busy="true"
    >
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
