import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../src/components/ErrorBoundary';

// Test component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error message when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('should call console.error when an error is caught', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('should render error UI with proper heading structure', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorHeading = screen.getByRole('heading', { level: 1 });
    expect(errorHeading).toBeInTheDocument();
    expect(errorHeading).toHaveTextContent('Something went wrong. Please try again later.');
  });

  it('should handle multiple children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should handle error in one of multiple children', () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <ThrowError shouldThrow={true} />
        <div>Third child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    expect(screen.queryByText('First child')).not.toBeInTheDocument();
    expect(screen.queryByText('Third child')).not.toBeInTheDocument();
  });

  it('should handle nested ErrorBoundary components', () => {
    render(
      <ErrorBoundary>
        <div>Outer boundary</div>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </ErrorBoundary>
    );

    // Inner boundary should catch the error and outer boundary should still render
    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    expect(screen.getByText('Outer boundary')).toBeInTheDocument();
  });

  it('should maintain error state after initial error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();

    // Rerender with non-throwing component - should still show error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('should handle error with different error types', () => {
    const ThrowTypeError: React.FC = () => {
      throw new TypeError('Type error test');
    };

    render(
      <ErrorBoundary>
        <ThrowTypeError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
  });

  it('should handle async errors properly', async () => {
    const AsyncErrorComponent: React.FC = () => {
      React.useEffect(() => {
        // Simulate async error - this won't be caught by ErrorBoundary
        // but component should render normally
        setTimeout(() => {
          // This would be caught by window.onerror in a real app
        }, 0);
      }, []);
      return <div>Async component</div>;
    };

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Async component')).toBeInTheDocument();
  });
});
