const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // cypress-mochawesome-reporter configuration
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'QA Craft Growth Challenge - Automation Results',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/reports',
    reportFilename: 'report'
  },

  e2e: {
    // Base URL for the application under test
    baseUrl: 'https://www.laboratoriodetesting.com',
    
    // Viewport settings for consistent testing
    viewportWidth: 1440,
    viewportHeight: 900,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // SCREENSHOT SETTINGS ONLY
    video: false,  // No videos needed
    screenshotOnRunFailure: true,  // Screenshots always (local and CI)
    screenshotsFolder: 'cypress/screenshots',
    
    // Test files configuration
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    
    // Browser settings
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    
    // Experimental features
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    
    // Node events setup
    setupNodeEvents(on, config) {
      // cypress-mochawesome-reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // Task for custom logging
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Task for generating test data
        generateTestData() {
          const timestamp = Date.now();
          return {
            email: `test.user.${timestamp}@example.com`,
            password: 'TestPassword123!',
            timestamp: timestamp
          };
        }
      });
      
      return config;
    },
    
    // Environment variables for test configuration
    env: {
      // Test user credentials
      testUsers: {
        user1: {
          email: 'huge.test@gmail.com',
          password: 'Huge2025.',
          role: 'customer'
        },
        user2: {
          email: 'huge2.test@gmail.com',
          password: 'Monday12.',
          role: 'customer'
        }
      },
      
      // API configuration
      apiUrl: 'https://www.laboratoriodetesting.com/api',
      
      // Test environment settings
      environment: 'test',
      
      // Feature flags for conditional testing
      featureFlags: {
        newPaymentMethods: false,
        redesignedHomepage: false,
        apiIntegration: true
      }
    },
    
    // Test retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    }
  }
});