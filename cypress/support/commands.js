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

// Custom screenshot with context
Cypress.Commands.add('screenshotWithContext', (name, context = '') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const screenshotName = `${timestamp}-${name}`
  
  cy.screenshot(screenshotName)
  
  if (context) {
    cy.log(`📸 Screenshot taken: ${screenshotName} - Context: ${context}`)
  } else {
    cy.log(`📸 Screenshot taken: ${screenshotName}`)
  }
})

// API request with logging
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
    cy.log(`🌐 API ${method} ${url} - Status: ${response.status}`)
    return cy.wrap(response)
  })
})