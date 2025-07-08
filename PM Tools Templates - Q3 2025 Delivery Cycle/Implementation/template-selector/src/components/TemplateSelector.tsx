import React, { useState, useEffect, useRef } from 'react';
import { mockTemplates } from '../mocks/templates';
import { Header } from './Header';
import { FilterPanel } from './FilterPanel';
import './TemplateSelector.css';
import { CommandPalette } from './CommandPalette';
import { useHotkeys } from '../hooks/useHotkeys';
import { Template } from '../types';
import { Modal } from './Modal';
import { TemplatePreview } from './TemplatePreview';
import { TemplateCardSkeleton } from './TemplateCardSkeleton';
import { Pagination } from './Pagination';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  methodology?: string;
  category?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [methodology, setMethodology] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const templateRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keyboard navigation
  useHotkeys('arrowleft', () => {
    setFocusedIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : templates.length - 1;
      templateRefs.current[newIndex]?.focus();
      return newIndex;
    });
  });

  useHotkeys('arrowright', () => {
    setFocusedIndex(prev => {
      const newIndex = prev < templates.length - 1 ? prev + 1 : 0;
      templateRefs.current[newIndex]?.focus();
      return newIndex;
    });
  });

  useHotkeys('enter', () => {
    if (focusedIndex >= 0 && focusedIndex < templates.length) {
      handleTemplateSelect(templates[focusedIndex]);
    }
  });

  useHotkeys('ctrl+k', () => setIsPaletteOpen(true));
  useHotkeys('esc', () => setIsPaletteOpen(false));

  const handleCommand = (command: string) => {
    switch (command) {
      case 'open-search':
        // focus search input
        break;
      case 'clear-filters':
        // clear filters logic
        break;
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        // Filter mock templates based on methodology and category
        const filteredTemplates = mockTemplates.filter(template => {
          if (methodology && template.methodology !== methodology) return false;
          if (category && template.category !== category) return false;
          return true;
        });
        setTemplates(filteredTemplates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [methodology, category]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <>
        <Header
          onSearch={(query) => setSearchQuery(query)}
          onToggleFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          onToggleHelp={() => setIsPaletteOpen(true)}
          onSort={() => console.log('Sort templates')}
        />
        <div className="template-selector">
          <div className="template-grid">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <TemplateCardSkeleton key={`skeleton-${index}`} />
              ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <Header
        onSearch={(query) => setSearchQuery(query)}
        onToggleFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        onToggleHelp={() => setIsPaletteOpen(true)}
        onSort={() => console.log('Sort templates')}
      />
      <div className="template-selector">
        {(methodology || category) && (
          <div className="active-filters">
            {methodology && (
              <span className="filter-tag">
                {methodology} <button onClick={() => setMethodology('')}>×</button>
              </span>
            )}
            {category && (
              <span className="filter-tag">
                {category} <button onClick={() => setCategory('')}>×</button>
              </span>
            )}
          </div>
        )}
        <div className="template-grid">
          {templates
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((template, index) => (
            <div
              key={template.id}
              ref={el => (templateRefs.current[index] = el)}
              className={`template-card ${
                selectedTemplate?.id === template.id ? 'selected' : ''
              } ${focusedIndex === index ? 'focused' : ''}`}
              onClick={() => handleTemplateSelect(template)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedTemplate?.id === template.id}
              aria-label={`Select ${template.name} template`}
            >
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-metadata">
                <span className="methodology">{template.methodology}</span>
                <span className="category">{template.category}</span>
              </div>
            </div>
          ))}
        </div>
        {templates.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(templates.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
        {isFilterPanelOpen && (
          <FilterPanel
            onMethodologyChange={setMethodology}
            onCategoryChange={setCategory}
            selectedMethodology={methodology}
            selectedCategory={category}
            onClose={() => setIsFilterPanelOpen(false)}
          />
        )}
        {isPaletteOpen && <CommandPalette onCommand={handleCommand} />}
        {isPreviewOpen && previewTemplate && (
          <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
            <TemplatePreview
              template={previewTemplate}
              onClose={() => setIsPreviewOpen(false)}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default TemplateSelector;
