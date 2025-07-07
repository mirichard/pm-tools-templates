import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TemplateSelector from '../src/components/TemplateSelector';
import { Template } from '../src/types';

const mockTemplate: Template = {
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
};

describe('TemplateSelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockTemplate]),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <TemplateSelector
        onSelect={mockOnSelect}
        methodology="Agile"
        category="Planning"
      />
    );
    expect(screen.getByText('Loading templates...')).toBeInTheDocument();
  });

  it('renders templates after loading', async () => {
    render(
      <TemplateSelector
        onSelect={mockOnSelect}
        methodology="Agile"
        category="Planning"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Template')).toBeInTheDocument();
    });
  });

  it('calls onSelect when template is clicked', async () => {
    render(
      <TemplateSelector
        onSelect={mockOnSelect}
        methodology="Agile"
        category="Planning"
      />
    );

    await waitFor(() => {
      const templateCard = screen.getByText('Test Template').closest('div');
      if (templateCard) {
        fireEvent.click(templateCard);
      }
    });

    expect(mockOnSelect).toHaveBeenCalledWith(mockTemplate);
  });

  it('displays error message when fetch fails', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <TemplateSelector
        onSelect={mockOnSelect}
        methodology="Agile"
        category="Planning"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
