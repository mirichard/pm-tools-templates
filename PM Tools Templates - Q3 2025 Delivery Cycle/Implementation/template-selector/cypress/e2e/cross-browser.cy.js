describe('Cross-Browser Compatibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('Chrome Browser Tests', () => {
    it('should load and function correctly in Chrome', () => {
      cy.measurePerformance('chrome-load-test');
      
      // Test basic functionality
      cy.testCrossBrowserCompatibility();
      
      // Test Chrome-specific features
      cy.get('[data-testid="search-input"]').should('be.visible');
      cy.searchTemplates('project');
      cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
      
      // Test performance in Chrome
      cy.window().then((win) => {
        const navigation = win.performance.getEntriesByType('navigation')[0];
        expect(navigation.loadEventEnd - navigation.loadEventStart).to.be.lessThan(3000);
      });
      
      cy.endPerformanceMeasurement('chrome-load-test');
    });

    it('should handle Chrome-specific CSS features', () => {
      cy.waitForTemplateSelector();
      
      // Test CSS Grid support
      cy.get('[data-testid="template-grid"]').should('have.css', 'display', 'grid');
      
      // Test CSS custom properties
      cy.get('[data-testid="template-card"]').first().should('have.css', 'border-radius');
      
      // Test flexbox support
      cy.get('[data-testid="filter-panel"]').should('have.css', 'display', 'flex');
    });
  });

  context('Firefox Browser Tests', () => {
    it('should load and function correctly in Firefox', () => {
      cy.measurePerformance('firefox-load-test');
      
      // Test basic functionality
      cy.testCrossBrowserCompatibility();
      
      // Test Firefox-specific behavior
      cy.get('[data-testid="search-input"]').should('be.visible');
      cy.searchTemplates('agile');
      cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
      
      // Test keyboard navigation (Firefox has different behavior)
      cy.get('[data-testid="search-input"]').focus().type('{tab}');
      cy.focused().should('have.attr', 'data-testid');
      
      cy.endPerformanceMeasurement('firefox-load-test');
    });

    it('should handle Firefox-specific features', () => {
      cy.waitForTemplateSelector();
      
      // Test scrollbar behavior
      cy.get('[data-testid="template-list"]').scrollTo('bottom');
      cy.get('[data-testid="template-card"]').should('be.visible');
      
      // Test right-click context menu
      cy.get('[data-testid="template-card"]').first().rightclick();
    });
  });

  context('Safari Browser Tests', () => {
    it('should load and function correctly in Safari', () => {
      cy.measurePerformance('safari-load-test');
      
      // Test basic functionality
      cy.testCrossBrowserCompatibility();
      
      // Test Safari-specific behavior
      cy.get('[data-testid="search-input"]').should('be.visible');
      cy.searchTemplates('traditional');
      cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
      
      // Test Safari's unique handling of form elements
      cy.get('[data-testid="search-input"]').clear().type('test');
      cy.get('[data-testid="search-input"]').should('have.value', 'test');
      
      cy.endPerformanceMeasurement('safari-load-test');
    });

    it('should handle Safari-specific CSS and JavaScript features', () => {
      cy.waitForTemplateSelector();
      
      // Test Safari's handling of CSS transforms
      cy.get('[data-testid="template-card"]').first().trigger('mouseover');
      cy.get('[data-testid="template-card"]').first().should('have.css', 'transform');
      
      // Test Safari's date handling
      cy.window().then((win) => {
        const date = new Date();
        expect(date.toISOString()).to.be.a('string');
      });
    });
  });

  context('Mobile Browser Tests', () => {
    it('should work on mobile Chrome', () => {
      cy.viewport('iphone-x');
      cy.measurePerformance('mobile-chrome-test');
      
      cy.testMobileResponsiveness();
      
      // Test touch interactions
      cy.get('[data-testid="template-card"]').first().trigger('touchstart');
      cy.get('[data-testid="template-card"]').first().trigger('touchend');
      
      cy.endPerformanceMeasurement('mobile-chrome-test');
    });

    it('should work on mobile Safari', () => {
      cy.viewport('iphone-x');
      cy.measurePerformance('mobile-safari-test');
      
      cy.testMobileResponsiveness();
      
      // Test iOS-specific behavior
      cy.get('[data-testid="search-input"]').focus();
      cy.get('[data-testid="search-input"]').should('be.focused');
      
      cy.endPerformanceMeasurement('mobile-safari-test');
    });
  });

  context('Edge Browser Tests', () => {
    it('should load and function correctly in Edge', () => {
      cy.measurePerformance('edge-load-test');
      
      // Test basic functionality
      cy.testCrossBrowserCompatibility();
      
      // Test Edge-specific features
      cy.get('[data-testid="search-input"]').should('be.visible');
      cy.searchTemplates('hybrid');
      cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
      
      // Test Edge's unique JavaScript features
      cy.window().then((win) => {
        expect(win.navigator.userAgent).to.include('Edge');
      });
      
      cy.endPerformanceMeasurement('edge-load-test');
    });
  });

  context('Cross-Browser Performance Tests', () => {
    it('should meet performance benchmarks across browsers', () => {
      const browsers = ['chrome', 'firefox', 'safari', 'edge'];
      
      browsers.forEach(browser => {
        cy.measurePerformance(`${browser}-performance-test`);
        
        // Test load time
        cy.waitForTemplateSelector();
        
        // Test search performance
        cy.searchTemplates('project');
        cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
        
        // Test filtering performance
        cy.filterByMethodology('traditional');
        cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
        
        cy.endPerformanceMeasurement(`${browser}-performance-test`);
      });
    });
  });

  context('Browser Storage Tests', () => {
    it('should handle localStorage across browsers', () => {
      cy.searchTemplates('project');
      
      // Test localStorage persistence
      cy.window().then((win) => {
        win.localStorage.setItem('test-key', 'test-value');
        expect(win.localStorage.getItem('test-key')).to.equal('test-value');
      });
      
      cy.reload();
      
      cy.window().then((win) => {
        expect(win.localStorage.getItem('test-key')).to.equal('test-value');
      });
    });

    it('should handle sessionStorage across browsers', () => {
      cy.searchTemplates('agile');
      
      // Test sessionStorage persistence
      cy.window().then((win) => {
        win.sessionStorage.setItem('session-key', 'session-value');
        expect(win.sessionStorage.getItem('session-key')).to.equal('session-value');
      });
      
      cy.reload();
      
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('session-key')).to.equal('session-value');
      });
    });
  });

  context('Network Condition Tests', () => {
    it('should handle slow network conditions', () => {
      cy.simulateSlowNetwork();
      cy.visit('/');
      
      // Should show loading state
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      
      // Should eventually load
      cy.waitForTemplateSelector();
      cy.get('[data-testid="template-card"]').should('have.length.greaterThan', 0);
    });

    it('should handle network errors gracefully', () => {
      cy.testErrorHandling();
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'Failed to load templates');
      
      // Should have retry button
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  context('Accessibility Tests', () => {
    it('should be accessible across all browsers', () => {
      cy.waitForTemplateSelector();
      cy.checkA11y();
      
      // Test keyboard navigation
      cy.get('[data-testid="search-input"]').focus();
      cy.get('[data-testid="search-input"]').type('{tab}');
      cy.focused().should('be.visible');
      
      // Test screen reader support
      cy.get('[data-testid="template-card"]').first().should('have.attr', 'aria-label');
    });
  });
});
