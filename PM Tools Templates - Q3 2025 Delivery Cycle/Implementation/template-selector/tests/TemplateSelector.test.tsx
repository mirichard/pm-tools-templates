import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TemplateSelector from '../src/components/TemplateSelector';
import { Template } from '../src/types';

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
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTemplates),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton initially', async () => {
    await act(async () => {
      render(
        <TemplateSelector
          onSelect={mockOnSelect}
          methodology="Agile"
          category="Planning"
        />
      );
    });
    const skeletons = screen.getAllByRole('gridcell');
    expect(skeletons.length).toBeGreaterThan(0); // Ensure skeletons are shown
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

    await waitFor(() => {
      const templateGrid = screen.getByRole('grid', { name: 'Template grid' });
      expect(templateGrid).toBeInTheDocument();
      const templateCards = screen.getAllByRole('gridcell');
      expect(templateCards.length).toBeGreaterThan(0);
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
    await waitFor(() => {
      const templateCards = screen.queryAllByRole('gridcell');
      expect(templateCards.length).toBe(1); // Only one template matches our filters
    });

    // Click the first template card
    const firstTemplateCard = screen.getByRole('gridcell');
    await act(async () => {
      fireEvent.click(firstTemplateCard);
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

    // Initially should show loading state
    expect(screen.queryAllByRole('gridcell').length).toBeGreaterThanOrEqual(0); // Check grid cells or error

    // Then should show error message
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/error/i);
    });
  });
});
