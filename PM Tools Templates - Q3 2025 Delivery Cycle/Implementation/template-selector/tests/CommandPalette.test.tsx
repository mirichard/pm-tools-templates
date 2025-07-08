import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CommandPalette } from '../src/components/CommandPalette';
import { commandPaletteUtils } from '../src/test-utils/commandPalette';

expect.extend(toHaveNoViolations);

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
    const { visibleCommands } = commandPaletteUtils.searchCommand('search');
    expect(visibleCommands).toContain('Search Templates');
    expect(visibleCommands).not.toContain('Clear All Filters');
  });

  it('should handle keyboard navigation', () => {
    render(<CommandPalette onCommand={mockOnCommand} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const commands = screen.getAllByRole('option');
    expect(commands[0]).toHaveClass('selected');
    expect(commands[0].querySelector('.command-label')?.textContent).toContain('Search Templates');
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(commands[1]).toHaveClass('selected');
    expect(commands[1].querySelector('.command-label')?.textContent).toContain('Clear All Filters');
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
