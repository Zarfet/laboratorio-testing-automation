// cypress/support/e2e.js

// Import commands.js using ES2015 syntax:
import './commands'

// ✅ cypress-mochawesome-reporter register
import 'cypress-mochawesome-reporter/register';

// Global error handling - Keep your existing approach but enhance it
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for debugging but don't fail the test for application errors
  cy.log(`🚨 Uncaught exception: ${err.message}`)
  
  // Return false to prevent the error from failing the test (your original behavior)
  // This maintains your current test stability
  return false
})

// Setup test data cleanup (keeping your existing pattern)
beforeEach(() => {
  // Your existing cleanup
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.viewport(1440, 900)
  
  // Enhanced logging for cypress-mochawesome-reporter
  if (Cypress.currentTest) {
    cy.log(`🧪 Test: ${Cypress.currentTest.title}`)
    cy.log(`📍 Spec: ${Cypress.spec.name}`)
    cy.log(`🌐 Browser: ${Cypress.browser.name}`)
    cy.log(`📱 Viewport: 1440x900`)
  }
})

// Enhanced screenshot naming for cypress-mochawesome-reporter
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshot = `${runnable.parent.title} -- ${test.title} (failed)`
    cy.screenshot(screenshot)
  }
})

// Performance monitoring for better reporting
let testStartTime

beforeEach(() => {
  testStartTime = performance.now()
})

afterEach(() => {
  if (testStartTime) {
    const testEndTime = performance.now()
    const duration = Math.round(testEndTime - testStartTime)
    cy.log(`⏱️ Test duration: ${duration}ms`)
  }
})

// Custom logging command for cypress-mochawesome-reporter
Cypress.Commands.add('logStep', (step, description = '') => {
  const timestamp = new Date().toLocaleTimeString()
  const message = description ? `${step}: ${description}` : step
  cy.log(`[${timestamp}] ${message}`)
})

// Enhanced assertions for better reporting
Cypress.Commands.add('shouldBeVisibleAndContain', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .should('be.visible')
    .and('contain.text', text)
})

// Environment information logging
before(() => {
  cy.log('🚀 Test Suite Starting')
  cy.log(`📋 Suite: ${Cypress.spec.name}`)
  cy.log(`🔗 Base URL: ${Cypress.config('baseUrl')}`)
  cy.log(`📱 Viewport: 1440x900`)
  cy.log(`🧪 Cypress Version: ${Cypress.version}`)
})

after(() => {
  cy.log('✅ Test Suite Completed')
})