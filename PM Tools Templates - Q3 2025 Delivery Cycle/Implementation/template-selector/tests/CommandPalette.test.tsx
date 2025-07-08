import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CommandPalette } from '../src/components/CommandPalette';

describe('CommandPalette', () => {
  const mockOnCommand = jest.fn();

  beforeEach(() => {
    mockOnCommand.mockClear();
  });

  it('should render without accessibility violations', async () => {
    const { container } = render(<CommandPalette onCommand={mockOnCommand} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should filter commands based on search input', () => {
    render(<CommandPalette onCommand={mockOnCommand} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'search' } });
    expect(screen.getByText('Search Templates')).toBeInTheDocument();
    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    render(<CommandPalette onCommand={mockOnCommand} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Search Templates').parentElement).toHaveClass('selected');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Clear All Filters').parentElement).toHaveClass('selected');
  });

  it('should execute command on Enter', () => {
    render(<CommandPalette onCommand={mockOnCommand} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnCommand).toHaveBeenCalledWith('open-search');
  });

  it('should show section headers', () => {
    render(<CommandPalette onCommand={mockOnCommand} />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('should handle empty search results', () => {
    render(<CommandPalette onCommand={mockOnCommand} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'nonexistent' } });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });
});
