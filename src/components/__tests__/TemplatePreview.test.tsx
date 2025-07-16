import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplatePreview } from '../TemplatePreview';

const mockTemplate = {
  id: '1',
  name: 'Test Template',
  description: 'A test description',
  methodology: 'Agile',
  category: 'Planning',
  metadata: {
    author: 'Test Author',
    lastUpdated: '2025-07-07',
    version: '1.0.0',
    usageCount: 100,
    complexity: 'Intermediate',
    tags: ['test', 'demo']
  },
  sections: [
    {
      title: 'Test Section',
      content: 'Test section content'
    }
  ]
};

describe('TemplatePreview', () => {
  const mockOnClose = jest.fn();
  const mockOnUse = jest.fn();
  const mockOnDownload = jest.fn();
  const mockOnShare = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders template information correctly', () => {
    render(
      <TemplatePreview
        template={mockTemplate}
        onClose={mockOnClose}
        onUse={mockOnUse}
        onDownload={mockOnDownload}
        onShare={mockOnShare}
      />
    );

    // Check basic template info
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    
    // Check metadata
    expect(screen.getByText('Agile')).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    
    // Check detailed metadata
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('2025-07-07')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    // Check sections
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test section content')).toBeInTheDocument();
  });

  it('calls action handlers correctly', () => {
    render(
      <TemplatePreview
        template={mockTemplate}
        onClose={mockOnClose}
        onUse={mockOnUse}
        onDownload={mockOnDownload}
        onShare={mockOnShare}
      />
    );

    // Test close button
    fireEvent.click(screen.getByRole('button', { name: /close preview/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Test use template button
    fireEvent.click(screen.getByRole('button', { name: /use template/i }));
    expect(mockOnUse).toHaveBeenCalledWith('1');

    // Test download button
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(mockOnDownload).toHaveBeenCalledWith('1');

    // Test share button
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(mockOnShare).toHaveBeenCalledWith('1');
  });

  it('renders without optional handlers', () => {
    render(
      <TemplatePreview
        template={mockTemplate}
        onClose={mockOnClose}
        onUse={mockOnUse}
      />
    );

    // Use template button should always be present
    expect(screen.getByRole('button', { name: /use template/i })).toBeInTheDocument();
    
    // Optional buttons should not be present
    expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
  });

  it('renders without optional metadata', () => {
    const templateWithoutMetadata = {
      id: '1',
      name: 'Test Template',
      description: 'A test description',
      methodology: 'Agile',
      category: 'Planning'
    };

    render(
      <TemplatePreview
        template={templateWithoutMetadata}
        onClose={mockOnClose}
        onUse={mockOnUse}
      />
    );

    // Basic info should still be present
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText('Agile')).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();

    // Optional metadata should not be present
    expect(screen.queryByText('Author')).not.toBeInTheDocument();
    expect(screen.queryByText('Version')).not.toBeInTheDocument();
  });
});
