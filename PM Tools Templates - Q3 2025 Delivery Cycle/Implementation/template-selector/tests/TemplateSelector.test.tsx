import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TemplateSelector from '../src/components/TemplateSelector';
import { Template } from '../src/types';

/*
 * React act() warnings have been resolved by:
 * 1. Properly wrapping async operations in act()
 * 2. Using useCallback for memoized fetch functions
 * 3. Removing debounce in test environment
 * 4. Proper cleanup of async operations
 */

const mockTemplates: Template[] = [{
  id: '1',
  name: 'Test Template',
  description: 'A test template',
  methodology: 'Agile',
  category: 'Planning',
  complexity: 'beginner',
  tags: ['test', 'example'],
  lastUpdated: '2025-07-07',
  author: 'Test Author',
  rating: 4.5,
  usageCount: 100,
}];

describe('TemplateSelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (url.includes('/api/templates/search')) {
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
    jest.useRealTimers();
  });

  it('renders loading skeleton initially', async () => {
    let container: any;
    
    const result = render(
      <TemplateSelector
        onSelect={mockOnSelect}
        methodology="Agile"
        category="Planning"
      />
    );
    container = result.container;
    
    // Check for loading skeletons by looking for aria-busy="true" grid cells
    // The component should start in loading state before fetching data
    const busyElements = container.querySelectorAll('[aria-busy="true"]');
    expect(busyElements.length).toBeGreaterThan(0);
  });

  it('renders template grid after loading', async () => {
    await act(async () => {
      render(
        <TemplateSelector
          onSelect={mockOnSelect}
          methodology="Agile"
          category="Planning"
        />
      );
    });

    // Wait for templates to load and replace skeletons
    await act(async () => {
      // Fast-forward all timers to trigger any remaining debounced operations
      jest.runAllTimers();
      
      await waitFor(() => {
        const templateGrid = screen.getByRole('list', { name: 'Template grid' });
        expect(templateGrid).toBeInTheDocument();

        // Look for actual template cards (not loading skeletons)
        const templateCards = screen.getAllByRole('listitem');
        const nonBusyCards = templateCards.filter(card => card.getAttribute('aria-busy') !== 'true');
        expect(nonBusyCards.length).toBeGreaterThan(0);
      });
    });
  });

  it('calls onSelect when template is clicked', async () => {
    await act(async () => {
      render(
        <TemplateSelector
          onSelect={mockOnSelect}
          methodology="Agile"
          category="Planning"
        />
      );
    });

    // Wait for templates to load and skeletons to be replaced
    await act(async () => {
      jest.runAllTimers();
      
      await waitFor(() => {
        const templateCards = screen.getAllByRole('listitem');
        const nonBusyCards = templateCards.filter(card => card.getAttribute('aria-busy') !== 'true');
        expect(nonBusyCards.length).toBeGreaterThan(0);
      });
    });

    // Click the first non-busy template card
    const templateCards = screen.getAllByRole('listitem');
    const firstTemplateCard = templateCards.find(card => card.getAttribute('aria-busy') !== 'true');
    
    expect(firstTemplateCard).toBeTruthy();
    
    await act(async () => {
      fireEvent.click(firstTemplateCard!);
    });

    // Verify onSelect was called with the correct template
    expect(mockOnSelect).toHaveBeenCalledWith(mockTemplates[0]);
  });

  it('displays error message when fetch fails', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );

    await act(async () => {
      render(
        <TemplateSelector
          onSelect={mockOnSelect}
          methodology="Agile"
          category="Planning"
        />
      );
    });

    // Wait for error state to be reached
    await act(async () => {
      jest.runAllTimers();
      
      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toHaveTextContent(/error/i);
      });
    });
  });
});
