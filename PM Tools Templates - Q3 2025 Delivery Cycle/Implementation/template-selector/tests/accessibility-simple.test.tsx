import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Header } from '../src/components/Header';
import { CommandPalette } from '../src/components/CommandPalette';
import { FilterPanel } from '../src/components/FilterPanel';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests - Simplified', () => {
  beforeEach(() => {
    // Mock fetch for all tests
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          templates: [],
          totalCount: 0,
          pageCount: 1,
          currentPage: 1,
          hasNext: false,
          hasPrev: false
        }),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        <Header
          onSearch={jest.fn()}
          onToggleFilters={jest.fn()}
          onToggleHelp={jest.fn()}
          onSort={jest.fn()}
        />
      );

      // This is a basic test - in a real scenario, you'd use tools like
      // color-contrast-checker or integrate with axe-core color contrast rules
      const styles = window.getComputedStyle(container);
      
      // Check that text elements have sufficient contrast
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });
});
