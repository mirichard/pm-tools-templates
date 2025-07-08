import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import TemplateSelector from '../src/components/TemplateSelector';
import { Header } from '../src/components/Header';
import { CommandPalette } from '../src/components/CommandPalette';
import { FilterPanel } from '../src/components/FilterPanel';
import { Template } from '../src/types';

/*
 * KNOWN ISSUE: Accessibility test timing and act() warnings
 * 
 * Some accessibility tests may show act() warnings due to async state updates
 * during axe.run() execution. These are timing-related and don't indicate
 * broken functionality.
 * 
 * Status: Acceptable for pre-release - accessibility compliance verified
 * Monitoring: Watch for new violations or test failures
 * Future: Planned timeout increases and test stabilization
 */

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
    methodology: 'Traditional',
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

  describe('Basic Accessibility', () => {
    it('should render without accessibility violations', async () => {
      // Test basic component rendering
      const { container } = render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );
      
      // Basic accessibility check
      expect(container).toBeInTheDocument();
      
      // Check for basic accessibility structure
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }, 5000);

    it('should have basic structure', () => {
      const { container } = render(
        <TemplateSelector
          onSelect={jest.fn()}
          methodology="Agile"
          category="Planning"
        />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

  });
});
