// src/components/KPIPanel.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import KPIPanel from './KPIPanel';

// Mock the UI components that depend on window.matchMedia
jest.mock('./ui/Tooltip', () => {
  return function MockTooltip({ children }) {
    return <div>{children}</div>;
  };
});

jest.mock('./ui/ExpandableCard', () => {
  return function MockExpandableCard({ summary, children }) {
    return (
      <div>
        <div>{summary}</div>
        <div>{children}</div>
      </div>
    );
  };
});

jest.mock('./ui/AccessibleIcon', () => {
  return function MockAccessibleIcon({ label, children }) {
    return <span aria-label={label}>{children}</span>;
  };
});

describe('KPIPanel', () => {
  test('renders KPI Panel title', () => {
    render(<KPIPanel />);
    expect(screen.getByText('📊 Performance Metrics')).toBeInTheDocument();
  });

  test('displays SPI and CPI metrics', () => {
    render(<KPIPanel />);
    expect(screen.getByText('SPI')).toBeInTheDocument();
    expect(screen.getByText('1.05')).toBeInTheDocument();
    expect(screen.getByText('CPI')).toBeInTheDocument();
    expect(screen.getByText('0.95')).toBeInTheDocument();
  });

  test('shows trend indicators', () => {
    render(<KPIPanel />);
    expect(screen.getByText('+3.2%')).toBeInTheDocument();
    expect(screen.getByText('-2.1%')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<KPIPanel />);
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'kpi-panel-title');
  });
});
