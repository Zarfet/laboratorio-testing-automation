// Import commands.js using ES2015 syntax:
import './commands'

// Import mochawesome reporter
import 'cypress-mochawesome-reporter/register'

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  cy.log(`🚨 Uncaught exception: ${err.message}`)
  return false
})
