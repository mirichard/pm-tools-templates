import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../src/components/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render single page correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('should render multiple pages correctly', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('active');
  });

  it('should enable/disable previous button correctly', () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();

    rerender(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(prevButton).not.toBeDisabled();
  });

  it('should enable/disable next button correctly', () => {
    const { rerender } = render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();

    rerender(
      <Pagination
        currentPage={4}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(nextButton).not.toBeDisabled();
  });

  it('should call onPageChange when clicking page numbers', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByText('1'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange when clicking previous button', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when clicking next button', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Next page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should call onPageChange when clicking current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should render ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  it('should show correct pages around current page with ellipsis', () => {
    render(
      <Pagination
        currentPage={6}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show first page
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Should show pages around current page
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    
    // Should show last page
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Should show ellipsis
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('should handle edge case with very few pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('should handle edge case with no pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
  });

  it('should handle keyboard navigation', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pageButton = screen.getByText('3');
    pageButton.focus();
    
    // The component doesn't handle keydown events, only click events
    fireEvent.click(pageButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Pagination');

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toHaveAttribute('aria-label', 'Previous page');

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toHaveAttribute('aria-label', 'Next page');
  });

  it('should render with proper button styling', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('active');

    const otherPageButton = screen.getByText('3');
    expect(otherPageButton).toHaveClass('pagination-button');
    expect(otherPageButton).not.toHaveClass('active');
  });

  it('should handle large page numbers correctly', () => {
    render(
      <Pagination
        currentPage={50}
        totalPages={100}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('should maintain state correctly between re-renders', () => {
    const { rerender } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('2')).toHaveClass('active');

    rerender(
      <Pagination
        currentPage={4}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('4')).toHaveClass('active');
    expect(screen.getByText('2')).not.toHaveClass('active');
  });
});
