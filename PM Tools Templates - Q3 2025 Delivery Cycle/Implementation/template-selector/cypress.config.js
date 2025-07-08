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
    
    // Test retries
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:3001',
      coverage: false
    },
    
    setupNodeEvents(on, config) {
      // Task definitions
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Performance monitoring
        performanceReport(data) {
          console.log('Performance Report:', data);
          return null;
        }
      });
      
      // Browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
        }
        
        if (browser.name === 'firefox') {
          launchOptions.args.push('--disable-dev-shm-usage');
        }
        
        return launchOptions;
      });
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
  
  // Multi-reporter configuration
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress/reporter-config.json',
  },
});
