// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global before hook
beforeEach(() => {
  // Set up API interceptors for consistent testing
  cy.intercept('GET', '/api/templates', { fixture: 'templates.json' }).as('getTemplates');
  cy.intercept('GET', '/api/templates/metadata', { fixture: 'metadata.json' }).as('getMetadata');
  cy.intercept('GET', '/api/templates/search*', { fixture: 'search-results.json' }).as('searchTemplates');
  
  // Performance monitoring
  cy.window().then((win) => {
    win.performance.mark('test-start');
  });
});

// Global after hook
afterEach(() => {
  // Capture performance metrics
  cy.window().then((win) => {
    win.performance.mark('test-end');
    win.performance.measure('test-duration', 'test-start', 'test-end');
    
    const measures = win.performance.getEntriesByType('measure');
    const testDuration = measures.find(m => m.name === 'test-duration');
    
    if (testDuration) {
      cy.task('performanceReport', {
        test: Cypress.currentTest.title,
        duration: testDuration.duration,
        browser: Cypress.browser.name,
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent the error from failing the test
  return false;
});
