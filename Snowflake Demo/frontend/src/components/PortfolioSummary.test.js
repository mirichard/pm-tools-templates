// src/components/PortfolioSummary.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import PortfolioSummary from './PortfolioSummary';

const mockData = [
  {
    project_id: 1,
    name: 'Test Project',
    lifecycle: 'Active',
    scheduleHealth: 'Good',
    budgetHealth: 'Good',
    budgetPlan: '$100,000',
    budgetActual: '$95,000',
    scheduleSnapshot: 'On Track'
  },
  {
    project_id: 2,
    name: 'Another Project',
    lifecycle: 'Planning',
    scheduleHealth: 'Attention',
    budgetHealth: 'Good',
    budgetPlan: '$50,000',
    budgetActual: '$45,000',
    scheduleSnapshot: 'Behind Schedule'
  }
];

describe('PortfolioSummary', () => {
  test('renders Portfolio Summary title', () => {
    render(<PortfolioSummary data={mockData} />);
    expect(screen.getByText('Portfolio Summary')).toBeInTheDocument();
  });

  test('displays project names', () => {
    render(<PortfolioSummary data={mockData} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Another Project')).toBeInTheDocument();
  });

  test('shows lifecycle badges', () => {
    render(<PortfolioSummary data={mockData} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<PortfolioSummary data={mockData} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'portfolio-summary-title');
  });

  test('handles empty data array', () => {
    render(<PortfolioSummary data={[]} />);
    expect(screen.getByText('Portfolio Summary')).toBeInTheDocument();
  });
});
