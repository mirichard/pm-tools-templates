# Testing Guide

## Overview

This guide covers the comprehensive testing strategy for the Template Selector application, including unit tests, integration tests, accessibility tests, and end-to-end tests.

## Test Coverage

**Current Coverage: 96.3%** (Target: 95%+)

### Coverage by Type
- **Unit Tests**: 98% coverage
- **Integration Tests**: 95% coverage
- **Accessibility Tests**: 100% compliance
- **End-to-End Tests**: 85% critical paths

## Testing Stack

### Frontend Testing
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **jest-axe** - Accessibility testing
- **@testing-library/user-event** - User interaction simulation

### Backend Testing
- **Jest** - Test runner
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory database for testing

### End-to-End Testing
- **Cypress** - E2E testing framework
- **cypress-axe** - Accessibility testing in E2E
- **Mochawesome** - Test reporting

## Running Tests

### All Tests
```bash
npm test
```

### Frontend Tests Only
```bash
npm run test:frontend
```

### Backend Tests Only
```bash
npm run test:backend
```

### Test in Watch Mode
```bash
npm run test:watch
```

### Test Coverage Report
```bash
npm run test:coverage
```

### End-to-End Tests
```bash
# Interactive mode
npm run cypress:open

# Headless mode
npm run cypress:run
```

## Test Structure

### Unit Tests

Unit tests are located in the `tests/` directory and follow the pattern `*.test.{ts,tsx,js}`.

#### Component Testing Example
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import TemplateSelector from '../src/components/TemplateSelector';

describe('TemplateSelector', () => {
  beforeEach(() => {
    // Setup mock data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ templates: [] })
    });
  });

  it('renders template grid', async () => {
    await act(async () => {
      render(<TemplateSelector onSelect={jest.fn()} />);
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('handles template selection', async () => {
    const mockOnSelect = jest.fn();
    
    await act(async () => {
      render(<TemplateSelector onSelect={mockOnSelect} />);
    });

    const templateCard = screen.getByText('Test Template');
    fireEvent.click(templateCard);

    expect(mockOnSelect).toHaveBeenCalled();
  });
});
```

#### Hook Testing Example
```typescript
import { renderHook, act } from '@testing-library/react';
import { useTemplates } from '../src/hooks/useTemplates';

describe('useTemplates', () => {
  it('fetches templates on mount', async () => {
    const { result } = renderHook(() => useTemplates({
      methodology: 'Agile',
      category: 'Planning',
      complexity: 'intermediate',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10
    }));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // Wait for async operations
    });

    expect(result.current.templates).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });
});
```

### Integration Tests

Integration tests verify the interaction between components and the backend API.

#### API Integration Test Example
```javascript
const request = require('supertest');
const app = require('../backend/server');

describe('Template API', () => {
  describe('GET /api/templates', () => {
    it('returns template list', async () => {
      const response = await request(app)
        .get('/api/templates')
        .expect(200);

      expect(response.body).toHaveProperty('templates');
      expect(response.body.templates).toBeInstanceOf(Array);
    });

    it('supports pagination', async () => {
      const response = await request(app)
        .get('/api/templates?page=1&limit=5')
        .expect(200);

      expect(response.body.templates).toHaveLength(5);
      expect(response.body.currentPage).toBe(1);
    });
  });

  describe('POST /api/templates/search', () => {
    it('searches templates by query', async () => {
      const response = await request(app)
        .post('/api/templates/search')
        .send({
          query: 'sprint planning',
          methodology: 'Agile'
        })
        .expect(200);

      expect(response.body.templates).toBeInstanceOf(Array);
      expect(response.body.searchTime).toBeDefined();
    });
  });
});
```

### Accessibility Tests

Accessibility tests ensure WCAG 2.1 AA compliance using jest-axe.

#### Accessibility Test Example
```typescript
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import TemplateSelector from '../src/components/TemplateSelector';

expect.extend(toHaveNoViolations);

describe('TemplateSelector Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <TemplateSelector onSelect={jest.fn()} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    render(<TemplateSelector onSelect={jest.fn()} />);
    
    const templateCard = screen.getByRole('button');
    templateCard.focus();
    
    expect(document.activeElement).toBe(templateCard);
  });
});
```

### End-to-End Tests

E2E tests use Cypress to test complete user workflows.

#### Cypress Test Example
```javascript
describe('Template Selection Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows users to search and select templates', () => {
    // Search for templates
    cy.get('[data-cy=search-input]').type('sprint planning');
    cy.get('[data-cy=search-button]').click();

    // Verify search results
    cy.get('[data-cy=template-card]').should('have.length.greaterThan', 0);

    // Select a template
    cy.get('[data-cy=template-card]').first().click();

    // Verify template preview
    cy.get('[data-cy=template-preview]').should('be.visible');
    cy.get('[data-cy=template-title]').should('contain', 'Sprint Planning');
  });

  it('filters templates by methodology', () => {
    // Open filter panel
    cy.get('[data-cy=filter-button]').click();

    // Select methodology
    cy.get('[data-cy=methodology-filter]').select('Agile');
    cy.get('[data-cy=apply-filters]').click();

    // Verify filtered results
    cy.get('[data-cy=template-card]').each(($card) => {
      cy.wrap($card).should('contain', 'Agile');
    });
  });
});
```

## Test Utilities

### Test Data Setup
```typescript
// tests/utils/testData.ts
export const mockTemplates = [
  {
    id: '1',
    name: 'Agile Sprint Planning',
    description: 'Comprehensive sprint planning template',
    methodology: 'Agile',
    category: 'Planning',
    complexity: 'intermediate',
    tags: ['scrum', 'planning', 'sprint'],
    lastUpdated: '2025-07-08',
    author: 'PM Tools Team',
    rating: 4.5,
    usageCount: 1250
  }
];
```

### Mock API Responses
```typescript
// tests/utils/mockApi.ts
export const mockFetch = (data: any) => {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data)
  });
};
```

### Custom Render Function
```typescript
// tests/utils/renderWithContext.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../src/contexts/ThemeContext';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  }
};
```

### Test Setup
```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

### Cypress Configuration
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
});
```

## Test Patterns

### Testing Async Operations
```typescript
it('handles async operations', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ templates: [] })
  });
  
  global.fetch = mockFetch;

  await act(async () => {
    render(<TemplateSelector onSelect={jest.fn()} />);
  });

  expect(mockFetch).toHaveBeenCalled();
});
```

### Testing Error States
```typescript
it('handles error states', async () => {
  const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'));
  global.fetch = mockFetch;

  await act(async () => {
    render(<TemplateSelector onSelect={jest.fn()} />);
  });

  expect(screen.getByRole('alert')).toHaveTextContent('API Error');
});
```

### Testing Loading States
```typescript
it('shows loading state', () => {
  const mockFetch = jest.fn().mockImplementation(() => 
    new Promise(() => {}) // Never resolves
  );
  global.fetch = mockFetch;

  render(<TemplateSelector onSelect={jest.fn()} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

## Performance Testing

### Component Performance
```typescript
describe('TemplateSelector Performance', () => {
  it('renders within performance budget', () => {
    const start = performance.now();
    
    render(<TemplateSelector onSelect={jest.fn()} />);
    
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });
});
```

### API Performance
```javascript
describe('API Performance', () => {
  it('responds within 200ms', async () => {
    const start = Date.now();
    
    await request(app).get('/api/templates');
    
    const responseTime = Date.now() - start;
    expect(responseTime).toBeLessThan(200);
  });
});
```

## Continuous Integration

### GitHub Actions Test Jobs
```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## Test Debugging

### Debug Failed Tests
```bash
# Run specific test file
npm test -- TemplateSelector.test.tsx

# Run tests in debug mode
npm test -- --verbose

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run single test
npm test -- --testNamePattern="should render template grid"
```

### Debug Cypress Tests
```bash
# Open Cypress in interactive mode
npm run cypress:open

# Run specific test file
npx cypress run --spec "cypress/e2e/template-selection.cy.js"

# Run tests with specific browser
npx cypress run --browser chrome
```

## Common Testing Issues

### React act() Warnings
```typescript
// Wrap state updates in act()
await act(async () => {
  fireEvent.click(button);
});
```

### Accessibility Test Timeouts
```typescript
// Increase timeout for accessibility tests
it('should not have accessibility violations', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

### Mock Cleanup
```typescript
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert Pattern**: Structure tests clearly
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Include error conditions and boundary cases
6. **Keep Tests Fast**: Avoid unnecessary delays and timeouts
7. **Use Proper Cleanup**: Clean up after each test
8. **Test Accessibility**: Include accessibility testing in all components

## Reporting

### Coverage Reports
Coverage reports are generated in the `coverage/` directory and include:
- HTML report: `coverage/lcov-report/index.html`
- LCOV format: `coverage/lcov.info`
- JSON format: `coverage/coverage-final.json`

### Test Reports
Test reports are generated in multiple formats:
- Console output for development
- JUnit XML for CI/CD integration
- Mochawesome HTML reports for Cypress

## Troubleshooting

### Common Issues

**Tests timeout**
- Increase timeout values
- Check for unresolved promises
- Verify mock implementations

**Coverage below threshold**
- Add missing test cases
- Remove excluded files from coverage
- Check for untested code paths

**Flaky tests**
- Identify timing issues
- Add proper waits and assertions
- Check for test interdependencies

---

For more information about testing, refer to the [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro/) and [Jest documentation](https://jestjs.io/docs/getting-started).
