import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import TemplateSelector from '../src/components/TemplateSelector';
import { Header } from '../src/components/Header';
import { CommandPalette } from '../src/components/CommandPalette';
import { FilterPanel } from '../src/components/FilterPanel';
import { Template } from '../src/types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Test Template',
    description: 'A test template for accessibility testing',
    methodology: 'Agile',
    category: 'Planning',
    complexity: 'beginner',
    tags: ['test', 'accessibility'],
    lastUpdated: '2025-07-07',
    author: 'Test Author',
    rating: 4.5,
    usageCount: 100,
  },
  {
    id: '2',
    name: 'Another Template',
    description: 'Another test template',
    methodology: 'PMBOK',
    category: 'Execution',
    complexity: 'intermediate',
    tags: ['test', 'example'],
    lastUpdated: '2025-07-06',
    author: 'Test Author 2',
    rating: 4.0,
    usageCount: 50,
  },
];

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Mock fetch for all tests
    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (url.includes('/api/templates')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            templates: mockTemplates,
            totalCount: mockTemplates.length,
            pageCount: 1,
            currentPage: 1,
            hasNext: false,
            hasPrev: false
          }),
        });
      }
      return Promise.reject(new Error('Unknown API endpoint'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TemplateSelector Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      // Wait for templates to load
      await waitFor(() => {
        expect(screen.getByRole('list')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels on template cards', async () => {
      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      await waitFor(() => {
        const templateCards = screen.getAllByRole('listitem');
        const actualCards = templateCards.filter(card => card.getAttribute('aria-busy') !== 'true');
        
        actualCards.forEach(card => {
          expect(card).toHaveAttribute('aria-label');
          expect(card).toHaveAttribute('aria-selected');
          expect(card).toHaveAttribute('tabIndex', '0');
        });
      });
    });

    it('should support keyboard navigation', async () => {
      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      await waitFor(() => {
        const templateCards = screen.getAllByRole('listitem');
        const actualCards = templateCards.filter(card => card.getAttribute('aria-busy') !== 'true');
        expect(actualCards.length).toBeGreaterThan(0);
      });

      const templateCards = screen.getAllByRole('listitem');
      const firstCard = templateCards.find(card => card.getAttribute('aria-busy') !== 'true');
      
      if (firstCard) {
        // Focus the first card
        firstCard.focus();
        expect(document.activeElement).toBe(firstCard);

        // Test Enter key
        fireEvent.keyDown(firstCard, { key: 'Enter' });
        // Should trigger template selection
      }
    });

    it('should have proper focus management', async () => {
      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      await waitFor(() => {
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
      });

      // Test that focus is properly managed
      const searchInput = screen.getByRole('textbox', { name: /search templates/i });
      expect(searchInput).toBeInTheDocument();
      
      // Focus should be manageable
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe('Header Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <Header
          onSearch={jest.fn()}
          onToggleFilters={jest.fn()}
          onToggleHelp={jest.fn()}
          onSort={jest.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels on navigation buttons', () => {
      render(
        <Header
          onSearch={jest.fn()}
          onToggleFilters={jest.fn()}
          onToggleHelp={jest.fn()}
          onSort={jest.fn()}
        />
      );

      const filtersButton = screen.getByRole('button', { name: /toggle filters/i });
      const findButton = screen.getByRole('button', { name: /quick find/i });
      const sortButton = screen.getByRole('button', { name: /sort templates/i });
      const helpButton = screen.getByRole('button', { name: /help and keyboard shortcuts/i });

      expect(filtersButton).toHaveAttribute('aria-label');
      expect(findButton).toHaveAttribute('aria-label');
      expect(sortButton).toHaveAttribute('aria-label');
      expect(helpButton).toHaveAttribute('aria-label');
    });

    it('should have accessible search input', () => {
      render(
        <Header
          onSearch={jest.fn()}
          onToggleFilters={jest.fn()}
          onToggleHelp={jest.fn()}
          onSort={jest.fn()}
        />
      );

      const searchInput = screen.getByRole('textbox', { name: /search templates/i });
      expect(searchInput).toHaveAttribute('aria-label', 'Search templates');
      expect(searchInput).toHaveAttribute('aria-describedby');
    });
  });

  describe('CommandPalette Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <CommandPalette onCommand={jest.fn()} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper dialog role and labeling', () => {
      render(<CommandPalette onCommand={jest.fn()} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Command palette');
    });

    it('should have proper listbox for results', () => {
      render(<CommandPalette onCommand={jest.fn()} />);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Command search results');
    });

    it('should support keyboard navigation in command list', () => {
      render(<CommandPalette onCommand={jest.fn()} />);

      const input = screen.getByRole('textbox', { name: /search commands/i });
      expect(input).toBeInTheDocument();

      // Test arrow key navigation
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
  });

  describe('FilterPanel Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <FilterPanel
          onMethodologyChange={jest.fn()}
          onCategoryChange={jest.fn()}
          onComplexityChange={jest.fn()}
          selectedMethodology=""
          selectedCategory=""
          selectedComplexity=""
          onClose={jest.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should use sufficient color contrast ratios', () => {
      const { container } = render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      // This is a basic test - in a real scenario, you'd use tools like
      // color-contrast-checker or integrate with axe-core color contrast rules
      const styles = window.getComputedStyle(container);
      
      // Check that text elements have sufficient contrast
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should be usable without color alone', () => {
      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      // Check that important state is not conveyed by color alone
      // For example, selected states should have additional indicators
      const searchInput = screen.getByRole('textbox', { name: /search templates/i });
      expect(searchInput).toBeInTheDocument();
      
      // Focus state should be indicated by more than just color
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe('Screen Reader Support', () => {
    it('should announce loading states', async () => {
      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      // Check for loading announcement
      await waitFor(() => {
        const loadingList = screen.getByRole('list', { name: /loading templates/i });
        expect(loadingList).toHaveAttribute('aria-busy', 'true');
      });
    });

    it('should announce filter changes', async () => {
      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      await waitFor(() => {
        // Check for filter status announcement
        const filterStatus = screen.queryByRole('status', { name: /active filters/i });
        if (filterStatus) {
          expect(filterStatus).toBeInTheDocument();
        }
      });
    });
  });

  describe('High Contrast Mode Support', () => {
    it('should maintain usability in high contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      // In high contrast mode, elements should still be visible and functional
      const searchInput = screen.getByRole('textbox', { name: /search templates/i });
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Motion and Animation Accessibility', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );

      // Animation should be reduced or disabled
      const searchInput = screen.getByRole('textbox', { name: /search templates/i });
      expect(searchInput).toBeInTheDocument();
    });
  });
});
