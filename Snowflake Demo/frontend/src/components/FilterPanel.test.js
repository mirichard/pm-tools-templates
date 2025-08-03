// src/components/FilterPanel.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';

describe('FilterPanel', () => {
  const pmOptions = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve'];
  const statusOptions = ['Planned', 'In Progress', 'Completed', 'On Hold'];

  let onFilterChange;

  beforeEach(() => {
    onFilterChange = jest.fn();
  });

  it('calls onFilterChange once on mount with all options', () => {
    render(<FilterPanel onFilterChange={onFilterChange} />);
    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith({
      pms: pmOptions,
      status: statusOptions,
    });
  });

  it('toggles a project manager checkbox', () => {
    const { getByLabelText } = render(<FilterPanel onFilterChange={onFilterChange} />);
    const aliceCheckbox = getByLabelText('Alice');
    // initial state checked
    expect(aliceCheckbox.checked).toBe(true);
    fireEvent.click(aliceCheckbox);
    // now unchecked, onFilterChange called again
    expect(onFilterChange).toHaveBeenLastCalledWith(expect.objectContaining({
      pms: pmOptions.filter(x => x !== 'Alice'),
    }));
  });

  it('toggles a status checkbox', () => {
    const { getByLabelText } = render(<FilterPanel onFilterChange={onFilterChange} />);
    const plannedCheckbox = getByLabelText('Planned');
    expect(plannedCheckbox.checked).toBe(true);
    fireEvent.click(plannedCheckbox);
    expect(onFilterChange).toHaveBeenLastCalledWith(expect.objectContaining({
      status: statusOptions.filter(x => x !== 'Planned'),
    }));
  });

  it('resets filters when Reset Filters is clicked', () => {
    const { getByText, getByLabelText } = render(<FilterPanel onFilterChange={onFilterChange} />);
    const aliceCheckbox = getByLabelText('Alice');
    fireEvent.click(aliceCheckbox);
    expect(aliceCheckbox.checked).toBe(false);
    const resetButton = getByText('Reset Filters');
    fireEvent.click(resetButton);
    expect(onFilterChange).toHaveBeenLastCalledWith({
      pms: pmOptions,
      status: statusOptions,
    });
    // all should be checked again
    pmOptions.forEach(pm => {
      expect(getByLabelText(pm).checked).toBe(true);
    });
    statusOptions.forEach(st => {
      expect(getByLabelText(st).checked).toBe(true);
    });
  });
});

