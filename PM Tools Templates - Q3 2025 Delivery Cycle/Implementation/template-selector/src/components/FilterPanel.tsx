import React from 'react';
import './FilterPanel.css';

interface FilterPanelProps {
  onMethodologyChange: (methodology: string) => void;
  onCategoryChange: (category: string) => void;
  selectedMethodology?: string;
  selectedCategory?: string;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onMethodologyChange,
  onCategoryChange,
  selectedMethodology,
  selectedCategory,
  onClose,
}) => {
  const methodologies = ['Agile', 'Waterfall', 'Hybrid'];
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

      <div className="filter-actions">
        <button
          onClick={() => {
            onMethodologyChange('');
            onCategoryChange('');
          }}
          className="clear-filters"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};
