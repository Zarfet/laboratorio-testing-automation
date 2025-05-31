const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    reportPageTitle: 'QA Craft Growth Challenge - Test Report',
    reportTitle: 'Laboratorio Testing Automation',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: true, // Cambiado de false a true para mejor manejo de imágenes
    quiet: false,
    debug: false,
    videoOnFailOnly: true
  },
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotsFolder: 'cypress/reports/screenshots',
    videosFolder: 'cypress/reports/videos',
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    setupNodeEvents(on, config) {
      // Plugin de cypress-mochawesome-reporter (debe ir primero)
      require('cypress-mochawesome-reporter/plugin')(on);

      // Log para debugging
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*']
  }
});