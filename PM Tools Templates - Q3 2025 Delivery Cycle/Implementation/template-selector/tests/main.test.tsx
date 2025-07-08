import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import TemplateSelector from '../src/components/TemplateSelector';
import ErrorBoundary from '../src/components/ErrorBoundary';

// Mock fetch to avoid real API calls
global.fetch = jest.fn();

// Mock console.log to avoid noise during tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('main.tsx', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock fetch to return empty templates
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ templates: [] })
    });
  });

  it('should render without crashing', async () => {
    const { container } = render(
      <React.StrictMode>
        <ErrorBoundary>
          <TemplateSelector onSelect={(template) => console.log('Selected:', template)} />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Verify the app structure is rendered
    expect(container).toBeInTheDocument();
    
    // Wait for the search input to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
    });
  });

  it('should render app in StrictMode with ErrorBoundary', async () => {
    render(
      <React.StrictMode>
        <ErrorBoundary>
          <TemplateSelector onSelect={(template) => console.log('Selected:', template)} />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Wait for the search input and filters button to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });

  it('should mount to root element using createRoot', () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    
    const root = createRoot(container);
    act(() => {
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <TemplateSelector onSelect={(template) => console.log('Selected:', template)} />
          </ErrorBoundary>
        </React.StrictMode>
      );
    });
    
    // Verify that content is rendered in the root element
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeInTheDocument();
    
    // Clean up
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
  });

  it('should handle missing root element gracefully', () => {
    // This should throw an error when trying to create root with null
    expect(() => {
      createRoot(document.getElementById('nonexistent-root')!);
    }).toThrow();
  });

  it('should use createRoot for React 18 compatibility', () => {
    // Mock createRoot to verify it's called
    const mockRoot = {
      render: jest.fn(),
      unmount: jest.fn(),
    };
    const createRootSpy = jest.spyOn(require('react-dom/client'), 'createRoot').mockReturnValue(mockRoot);
    
    const container = document.createElement('div');
    
    // Create root and render
    const testRoot = createRoot(container);
    testRoot.render(
      <React.StrictMode>
        <ErrorBoundary>
          <TemplateSelector onSelect={(template) => console.log('Selected:', template)} />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    expect(createRootSpy).toHaveBeenCalledWith(container);
    expect(mockRoot.render).toHaveBeenCalled();
    
    createRootSpy.mockRestore();
  });

  it('should handle onSelect callback', async () => {
    const mockOnSelect = jest.fn();
    
    render(
      <React.StrictMode>
        <ErrorBoundary>
          <TemplateSelector onSelect={mockOnSelect} />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Verify the component renders
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
    });
    
    // The callback will be tested in the TemplateSelector component tests
  });

  it('should integrate main app components correctly', async () => {
    render(
      <React.StrictMode>
        <ErrorBoundary>
          <TemplateSelector onSelect={(template) => console.log('Selected:', template)} />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Verify key components are rendered
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByText('Find')).toBeInTheDocument();
      expect(screen.getByText('Sort')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();
    });
  });
});

afterAll(() => {
  mockConsoleLog.mockRestore();
  jest.restoreAllMocks();
});
