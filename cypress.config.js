const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/json',
    reportPageTitle: 'QA Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: true
  },
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false, // 
    screenshotsFolder: 'cypress/reports/screenshots',
    videosFolder: 'cypress/reports/videos', 
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*']
  }
});