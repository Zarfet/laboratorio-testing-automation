// cypress/support/commands.js

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import mochawesome addContext for enhanced reporting
const addContext = require('mochawesome/addContext');

// Custom commands for enhanced testing

// Enhanced wait with logging
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible')
  cy.log(`✅ Element found: ${selector}`)
})

// Safe click with wait
Cypress.Commands.add('safeClick', (selector) => {
  cy.get(selector).should('be.visible').should('not.be.disabled').click()
  cy.log(`🖱️ Clicked: ${selector}`)
})

// Type with clear first
Cypress.Commands.add('clearAndType', (selector, text) => {
  cy.get(selector).clear().type(text)
  cy.log(`⌨️ Typed "${text}" in: ${selector}`)
})

// Wait for loading to disappear
Cypress.Commands.add('waitForLoadingToDisappear', (loadingSelector = '.loading') => {
  cy.get('body').then($body => {
    if ($body.find(loadingSelector).length > 0) {
      cy.get(loadingSelector).should('not.exist')
      cy.log('⏳ Loading disappeared')
    }
  })
})

// Enhanced assertions with logging
Cypress.Commands.add('shouldBeVisibleAndContain', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .should('be.visible')
    .and('contain.text', text)
    .then(() => {
      cy.log(`✅ Element contains: "${text}"`)
    })
})

// Custom screenshot with context for mochawesome reporting
Cypress.Commands.add('screenshotWithContext', (name, context = '') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const screenshotName = `${timestamp}-${name}`
  
  cy.screenshot(screenshotName).then(() => {
    // Add screenshot to mochawesome report
    cy.addTestContext(`Screenshot: ${screenshotName}`)
    
    if (context) {
      cy.log(`📸 Screenshot taken: ${screenshotName} - Context: ${context}`)
      cy.addTestContext(context)
    } else {
      cy.log(`📸 Screenshot taken: ${screenshotName}`)
    }
  })
})

// Command to add screenshots to mochawesome report
Cypress.Commands.add('addScreenshotToReport', (name) => {
  cy.screenshot(name).then(() => {
    cy.addTestContext(`Screenshot: ${name}`)
    cy.log(`📸 Screenshot added to report: ${name}`)
  })
})

// Command to add any context to mochawesome report
Cypress.Commands.add('addTestContext', (context) => {
  cy.window().then((win) => {
    // This ensures the context is added to the current test
    if (typeof context === 'string') {
      // For string context, just add it directly
      addContext({ test: win.test || Cypress.currentTest }, context)
    } else if (typeof context === 'object') {
      // For object context with title and value
      addContext({ test: win.test || Cypress.currentTest }, context)
    }
  })
  cy.task('log', `📎 Adding context: ${JSON.stringify(context)}`)
})

// Enhanced API request with logging and report context
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  const options = {
    method,
    url,
    failOnStatusCode: false
  }
  
  if (body) {
    options.body = body
  }
  
  cy.request(options).then((response) => {
    const logMessage = `🌐 API ${method} ${url} - Status: ${response.status}`
    cy.log(logMessage)
    
    // Add API response context to report
    cy.addTestContext({
      title: `API Request: ${method} ${url}`,
      value: {
        status: response.status,
        duration: response.duration,
        headers: response.headers,
        body: typeof response.body === 'object' ? JSON.stringify(response.body, null, 2) : response.body
      }
    })
    
    return cy.wrap(response)
  })
})

// Command to add failure context automatically
Cypress.Commands.add('addFailureContext', (errorMessage) => {
  cy.addTestContext({
    title: 'Failure Information',
    value: {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      url: location.href,
      viewport: `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`
    }
  })
})

// Automatic screenshot on test failure with context
Cypress.on('fail', (error) => {
  const testTitle = Cypress.currentTest?.title || 'unknown-test'
  const screenshotName = `failure-${testTitle.replace(/\s+/g, '-').toLowerCase()}`
  
  cy.screenshot(screenshotName, { capture: 'fullPage' })
  cy.addFailureContext(error.message)
  
  throw error
})