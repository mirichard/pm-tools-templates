import React, { useState, useRef } from 'react';
import { mockTemplates } from '../mocks/templates';
import { Header } from './Header';
import { FilterPanel } from './FilterPanel';
import './TemplateSelector.css';
import { CommandPalette } from './CommandPalette';
import { useHotkeys } from '../hooks/useHotkeys';
import { useTemplates } from '../hooks/useTemplates';
import { useGridColumns } from '../hooks/useGridColumns';
import { useFilters } from '../hooks/useFilters';
import { Template } from '../types';
import { Modal } from './Modal';
import { TemplatePreview } from './TemplatePreview';
import { EnhancedTemplatePreview } from './EnhancedTemplatePreview';
import { GuidedNavigationWizard } from './GuidedNavigationWizard';
import { TemplateCardSkeleton } from './TemplateCardSkeleton';
import { Pagination } from './Pagination';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  methodology?: string;
  category?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsPerPage = 9;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [favoriteTemplates, setFavoriteTemplates] = useState<Set<string>>(new Set());
  const [useEnhancedPreview, setUseEnhancedPreview] = useState(true);
  const templateRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Use custom hooks
  const {
    methodology,
    category,
    complexity,
    searchQuery,
    currentPage,
    setMethodology,
    setCategory,
    setComplexity,
    setSearchQuery,
    setCurrentPage,
    clearFilters,
    sortTemplates
  } = useFilters();
  
  const { gridColumns, gridRef } = useGridColumns(300);
  
  const { templates, loading, error, debouncedSearchQuery } = useTemplates({
    methodology,
    category,
    complexity,
    searchQuery,
    currentPage,
    itemsPerPage
  });

  // Keyboard navigation

  useHotkeys('arrowup', () => {
    setFocusedIndex(prev => {
      const newIndex = prev >= gridColumns ? prev - gridColumns : prev;
      templateRefs.current[newIndex]?.focus();
      return newIndex;
    });
  });

  useHotkeys('arrowdown', () => {
    setFocusedIndex(prev => {
      const newIndex = prev + gridColumns < templates.length ? prev + gridColumns : prev;
      templateRefs.current[newIndex]?.focus();
      return newIndex;
    });
  });

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

  useHotkeys('home', () => {
    setFocusedIndex(0);
    templateRefs.current[0]?.focus();
  });

  useHotkeys('end', () => {
    const lastIndex = templates.length - 1;
    setFocusedIndex(lastIndex);
    templateRefs.current[lastIndex]?.focus();
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
        // Focus search input in header
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        setIsPaletteOpen(false);
        break;
      case 'clear-filters':
        // Clear all filters
        clearFilters();
        setIsPaletteOpen(false);
        break;
      case 'sort-by-name':
        // Sort templates by name
        console.log('Sorting by name - handled by server-side sorting');
        setIsPaletteOpen(false);
        break;
      case 'sort-by-recent':
        // Sort templates by last updated
        console.log('Sorting by recent - handled by server-side sorting');
        setIsPaletteOpen(false);
        break;
      case 'toggle-view':
        // Toggle between grid and list view (future implementation)
        console.log('Toggle view mode');
        setIsPaletteOpen(false);
        break;
      case 'filter-methodology':
        setIsFilterPanelOpen(true);
        setIsPaletteOpen(false);
        break;
      case 'filter-category':
        setIsFilterPanelOpen(true);
        setIsPaletteOpen(false);
        break;
      case 'show-shortcuts':
        // Show keyboard shortcuts modal (future implementation)
        console.log('Show keyboard shortcuts');
        setIsPaletteOpen(false);
        break;
      case 'open-wizard':
        setIsWizardOpen(true);
        setIsPaletteOpen(false);
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
  };

  // All async logic is now handled by custom hooks

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
    onSelect(template);
  };

  const handleWizardComplete = (recommendations: Template[]) => {
    setIsWizardOpen(false);
    // Apply wizard recommendations as filters or display them
    if (recommendations.length > 0) {
      setSelectedTemplate(recommendations[0]);
      setPreviewTemplate(recommendations[0]);
      setIsPreviewOpen(true);
    }
  };

  const handleFavoriteToggle = (templateId: string) => {
    setFavoriteTemplates(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const handleDownload = (templateId: string) => {
    // Implementation for downloading template
    console.log('Downloading template:', templateId);
  };

  const handleShare = (templateId: string) => {
    // Implementation for sharing template
    console.log('Sharing template:', templateId);
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
        <div ref={gridRef} className="template-grid" role="list" aria-busy="true" aria-label="Loading templates">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <TemplateCardSkeleton key={`skeleton-${index}`} index={index} />
              ))}
          </div>
        </div>
      </>
    );
  }

if (error) {
    return <div className="error" role="alert">Error: {error}</div>;
  }

  return (
    <>
      <Header
        onSearch={(query) => setSearchQuery(query)}
        onToggleFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        onToggleHelp={() => setIsPaletteOpen(true)}
        onSort={() => console.log('Sort templates')}
      />
  <>
<>
    <Header
      onSearch={(query) => setSearchQuery(query)}
      onToggleFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
      onToggleHelp={() => setIsPaletteOpen(true)}
      onSort={() => console.log('Sort templates')}
    />
      <div className="wizard-trigger">
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="wizard-button"
        >
          🧙‍♂️ Need Help Choosing? Try Our Wizard
        </button>
      </div>
      <div className="template-selector">
        {(methodology || category || complexity || searchQuery) && (
          <div className="active-filters" role="status" aria-label="Active filters">
            {searchQuery && (
              <span className="filter-tag">
                Search: "{searchQuery}" <button onClick={() => setSearchQuery('')}>×</button>
              </span>
            )}
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
            {complexity && (
              <span className="filter-tag">
                {complexity} <button onClick={() => setComplexity('')}>×</button>
              </span>
            )}
          </div>
        )}
        <div ref={gridRef} className="template-grid" role="list" aria-label="Template grid">
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTemplateSelect(template);
                }
              }}
              role="listitem"
              tabIndex={0}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              aria-label={`${template.name} template. ${template.description}`}
              aria-current={selectedTemplate?.id === template.id ? 'true' : 'false'}
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
            selectedComplexity={complexity as 'Beginner' | 'Intermediate' | 'Advanced'}
            onComplexityChange={setComplexity}
            onClose={() => setIsFilterPanelOpen(false)}
          />
        )}
        {isPaletteOpen && <CommandPalette onCommand={handleCommand} />}
        {isPreviewOpen && previewTemplate && (
          <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
            {useEnhancedPreview ? (
              <EnhancedTemplatePreview
                template={previewTemplate}
                onClose={() => setIsPreviewOpen(false)}
                onUse={(templateId) => {
                  console.log('Using template:', templateId);
                  setIsPreviewOpen(false);
                }}
                onDownload={handleDownload}
                onShare={handleShare}
                onFavorite={handleFavoriteToggle}
                isFavorite={favoriteTemplates.has(previewTemplate.id)}
                showAnalytics={true}
              />
            ) : (
              <TemplatePreview
                template={previewTemplate}
                onClose={() => setIsPreviewOpen(false)}
              />
            )}
          </Modal>
        )}
        
        <GuidedNavigationWizard
          isOpen={isWizardOpen}
          templates={templates}
          onComplete={handleWizardComplete}
          onCancel={() => setIsWizardOpen(false)}
        />
      </div>
    </>
  );
};

export default TemplateSelector;
