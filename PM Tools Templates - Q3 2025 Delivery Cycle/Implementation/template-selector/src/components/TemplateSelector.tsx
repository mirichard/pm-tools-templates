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
  const [complexity, setComplexity] = useState<'Beginner' | 'Intermediate' | 'Advanced' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [gridColumns, setGridColumns] = useState(3); // Default to 3 columns
  const templateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

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
        setMethodology('');
        setCategory('');
        setComplexity('');
        setSearchQuery('');
        setCurrentPage(1);
        setIsPaletteOpen(false);
        break;
      case 'sort-by-name':
        // Sort templates by name
        setTemplates(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        setIsPaletteOpen(false);
        break;
      case 'sort-by-recent':
        // Sort templates by last updated
        setTemplates(prev => [...prev].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()));
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
      default:
        console.log(`Unknown command: ${command}`);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!gridRef.current) return;

    const updateGridColumns = () => {
      if (!gridRef.current) return;
      const gridWidth = gridRef.current.getBoundingClientRect().width;
      const cardWidth = 300; // Minimum card width
      const newColumns = Math.floor(gridWidth / cardWidth);
      setGridColumns(Math.max(1, newColumns));
    };

    const resizeObserver = new ResizeObserver(updateGridColumns);
    resizeObserver.observe(gridRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use search API if there's a query or filters, otherwise use basic listing
        const hasFilters = debouncedSearchQuery || methodology || category || complexity;
        
        if (hasFilters) {
          // Use search API
          const response = await fetch('/api/templates/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: debouncedSearchQuery,
              methodology: methodology || undefined,
              category: category || undefined,
              complexity: complexity?.toLowerCase() || undefined,
              page: currentPage,
              pageSize: itemsPerPage
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to search templates');
          }
          
          const data = await response.json();
          setTemplates(data.templates || []);
        } else {
          // Use basic listing API
          const response = await fetch(`/api/templates?page=${currentPage}&limit=${itemsPerPage}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch templates');
          }
          
          const data = await response.json();
          setTemplates(data.templates || []);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [methodology, category, complexity, debouncedSearchQuery, currentPage, itemsPerPage]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
    onSelect(template);
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
              aria-selected={selectedTemplate?.id === template.id}
              aria-label={`${template.name} template. ${template.description}`}
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
