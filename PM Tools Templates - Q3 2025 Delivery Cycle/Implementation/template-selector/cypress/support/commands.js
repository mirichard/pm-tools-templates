// Custom commands for Template Selector testing

// Command to wait for template selector to load
Cypress.Commands.add('waitForTemplateSelector', () => {
  cy.get('[data-testid="template-selector"]').should('be.visible');
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
});

// Command to search templates
Cypress.Commands.add('searchTemplates', (query) => {
  cy.get('[data-testid="search-input"]').clear().type(query);
  cy.wait('@searchTemplates');
});

// Command to filter by methodology
Cypress.Commands.add('filterByMethodology', (methodology) => {
  cy.get(`[data-testid="methodology-filter-${methodology}"]`).click();
});

// Command to filter by category
Cypress.Commands.add('filterByCategory', (category) => {
  cy.get(`[data-testid="category-filter-${category}"]`).click();
});

// Command to select a template
Cypress.Commands.add('selectTemplate', (templateId) => {
  cy.get(`[data-testid="template-card-${templateId}"]`).click();
});

// Command to check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Command to measure performance
Cypress.Commands.add('measurePerformance', (testName) => {
  cy.window().then((win) => {
    win.performance.mark(`${testName}-start`);
  });
  
  return cy.wrap(testName);
});

// Command to end performance measurement
Cypress.Commands.add('endPerformanceMeasurement', (testName) => {
  cy.window().then((win) => {
    win.performance.mark(`${testName}-end`);
    win.performance.measure(testName, `${testName}-start`, `${testName}-end`);
    
    const measures = win.performance.getEntriesByType('measure');
    const testMeasure = measures.find(m => m.name === testName);
    
    if (testMeasure) {
      cy.task('performanceReport', {
        test: testName,
        duration: testMeasure.duration,
        browser: Cypress.browser.name,
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Command to test cross-browser compatibility
Cypress.Commands.add('testCrossBrowserCompatibility', () => {
  // Test basic functionality across browsers
  cy.waitForTemplateSelector();
  
  // Test search functionality
  cy.searchTemplates('project');
  cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
  
  // Test filtering
  cy.filterByMethodology('traditional');
  cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
  
  // Test responsive design
  cy.viewport('iphone-x');
  cy.waitForTemplateSelector();
  cy.viewport('macbook-15');
  cy.waitForTemplateSelector();
  
  // Test keyboard navigation
  cy.get('[data-testid="search-input"]').focus().type('{enter}');
  cy.get('[data-testid="template-card"]').first().focus().type('{enter}');
});

// Command to test mobile responsiveness
Cypress.Commands.add('testMobileResponsiveness', () => {
  const devices = ['iphone-x', 'ipad-2', 'samsung-s10'];
  
  devices.forEach(device => {
    cy.viewport(device);
    cy.waitForTemplateSelector();
    
    // Test touch interactions
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="template-card"]').first().should('be.visible');
    
    // Test mobile-specific features
    cy.get('[data-testid="mobile-filter-button"]').should('be.visible');
  });
});

// Command to simulate slow network
Cypress.Commands.add('simulateSlowNetwork', () => {
  cy.intercept('GET', '/api/templates', (req) => {
    req.reply((res) => {
      res.delay(2000); // 2 second delay
      res.send({ fixture: 'templates.json' });
    });
  }).as('slowTemplates');
});

// Command to test error handling
Cypress.Commands.add('testErrorHandling', () => {
  cy.intercept('GET', '/api/templates', { statusCode: 500 }).as('serverError');
  cy.visit('/');
  cy.wait('@serverError');
  cy.get('[data-testid="error-message"]').should('be.visible');
});

// Command to test browser storage
Cypress.Commands.add('testBrowserStorage', () => {
  cy.searchTemplates('project');
  cy.reload();
  cy.get('[data-testid="search-input"]').should('have.value', 'project');
});
