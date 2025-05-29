const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: true,
    
    setupNodeEvents(on, config) {
      // Configure test events and plugins
      on('after:run', (results) => {
        // Ensure test results are available for processing
        return results;
      });

      // Handle browser launch arguments
      on('before:browser:launch', (browser = {}, launchOptions) => {
        // Add any browser-specific configurations if needed
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
        }
        return launchOptions;
      });
    },

    // Test file patterns
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*'],
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Retry configuration
    retries: {
      runMode: 2,    // Retry failed tests 2 times in CI
      openMode: 0    // Don't retry in interactive mode
    },

    // Environment variables
    env: {
      // Add any custom environment variables here
    },

    // Reporter configuration for Mochawesome
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,                    // Generate HTML report for viewing
      json: true,                    // ✅ CRITICAL: Generate JSON for jq processing
      charts: true,
      reportPageTitle: 'QA Craft Growth Challenge - Automation Test Results',
      embeddedScreenshots: true,
      inlineAssets: true,
      reportFilename: 'report',
      timestamp: 'mmddyyyy_HHMMss',
      quiet: false,
      consoleReporter: 'spec'
    }
  },

  // Component testing configuration (if needed in future)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});