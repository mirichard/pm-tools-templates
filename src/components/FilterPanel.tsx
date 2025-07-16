import React from 'react';
import './FilterPanel.css';

type Complexity = 'Beginner' | 'Intermediate' | 'Advanced';

interface FilterPanelProps {
  onMethodologyChange: (methodology: string) => void;
  onCategoryChange: (category: string) => void;
  onComplexityChange: (complexity: Complexity) => void;
  selectedMethodology?: string;
  selectedCategory?: string;
  selectedComplexity?: Complexity;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onMethodologyChange,
  onCategoryChange,
  onComplexityChange,
  selectedMethodology,
  selectedCategory,
  selectedComplexity,
  onClose,
}) => {
  const methodologies = ['Agile', 'Waterfall', 'Hybrid'];
  const complexityLevels: Complexity[] = ['Beginner', 'Intermediate', 'Advanced'];
  const categories = {
    Agile: ['Planning', 'Execution', 'Monitoring'],
    Waterfall: ['Planning', 'Execution', 'Monitoring'],
    Hybrid: ['Planning', 'Execution', 'Monitoring'],
  };

  return (
    <div className="filter-panel" role="dialog" aria-label="Filter templates">
      <div className="filter-panel-header">
        <h2>Filters</h2>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close filters"
        >
          ×
        </button>
      </div>

      <div className="filter-sections">
        <div className="filter-section">
          <h3>Methodology</h3>
        {methodologies.map((methodology) => (
          <div key={methodology} className="methodology-group">
            <button
              className={`methodology-button ${
                selectedMethodology === methodology ? 'selected' : ''
              }`}
              onClick={() => onMethodologyChange(methodology)}
              aria-pressed={selectedMethodology === methodology}
            >
              {methodology}
            </button>
            {selectedMethodology === methodology && (
              <div className="category-list">
                {categories[methodology as keyof typeof categories].map((category) => (
                  <label key={category} className="category-option">
                    <input
                      type="checkbox"
                      checked={selectedCategory === category}
                      onChange={() => onCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>

        <div className="filter-section">
          <h3>Complexity</h3>
          <div className="complexity-options">
            {complexityLevels.map((complexity) => (
              <button
                key={complexity}
                className={`complexity-button ${
                  selectedComplexity === complexity ? 'selected' : ''
                }`}
                onClick={() => onComplexityChange(complexity)}
                aria-pressed={selectedComplexity === complexity}
              >
                {complexity}
                <span className="complexity-indicator">
                  {Array(complexity === 'Beginner' ? 1 : complexity === 'Intermediate' ? 2 : 3)
                    .fill('●')
                    .join(' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button
          onClick={() => {
            onMethodologyChange('');
            onCategoryChange('');
            onComplexityChange('' as Complexity);
          }}
          className="clear-filters"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};
