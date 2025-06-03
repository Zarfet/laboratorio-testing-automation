class BasePage {
  constructor() {
    this.timeout = 10000;
    this.pageName = this.constructor.name;
  }

  visit(path = '') {
    cy.log(`🌐 Navigating to: ${path || 'home page'}`);
    cy.visit(path);
    return this;
  }

  waitForPageLoad() {
    cy.log(`⏳ Waiting for ${this.pageName} to load`);
    cy.get('body').should('be.visible');
    cy.document().should('have.property', 'readyState', 'complete');
    cy.log(`✅ ${this.pageName} loaded successfully`);
    return this;
  }

  clickElement(selector) {
    cy.log(`🖱️ Clicking element: ${selector}`);
    cy.get(selector).should('be.visible').click();
    return this;
  }

  clickElementWhenVisible(selector, options = {}) {
    cy.log(`🖱️ Clicking element when visible: ${selector}`);
    cy.get(selector)
      .should('be.visible')
      .and('not.be.disabled')
      .click(options);
    return this;
  }

  typeText(selector, text) {
    cy.log(`⌨️ Typing "${text}" into: ${selector}`);
    cy.get(selector).should('be.visible').clear().type(text);
    return this;
  }

  typeTextWhenVisible(selector, text, options = {}) {
    cy.log(`⌨️ Typing "${text}" into: ${selector}`);
    cy.get(selector)
      .should('be.visible')
      .and('not.be.disabled')
      .clear()
      .type(text, options);
    return this;
  }

  verifyText(selector, text) {
    cy.log(`✅ Verifying text "${text}" in: ${selector}`);
    cy.get(selector).should('contain.text', text);
    return this;
  }

  verifyElementVisible(selector) {
    cy.log(`👁️ Verifying element is visible: ${selector}`);
    cy.get(selector).should('be.visible');
    return this;
  }

  verifyElementNotVisible(selector) {
    cy.log(`🚫 Verifying element is not visible: ${selector}`);
    cy.get(selector).should('not.be.visible');
    return this;
  }

  verifyElementExists(selector) {
    cy.log(`📍 Verifying element exists: ${selector}`);
    cy.get(selector).should('exist');
    return this;
  }

  verifyElementNotExists(selector) {
    cy.log(`❌ Verifying element does not exist: ${selector}`);
    cy.get(selector).should('not.exist');
    return this;
  }

  verifyUrl(expectedUrl) {
    cy.log(`🔗 Verifying URL contains: ${expectedUrl}`);
    cy.url().should('include', expectedUrl);
    return this;
  }

  verifyExactUrl(expectedUrl) {
    cy.log(`🔗 Verifying exact URL: ${expectedUrl}`);
    cy.url().should('eq', expectedUrl);
    return this;
  }

  // Enhanced logging methods for Mochawesome
  logStep(stepNumber, description) {
    const timestamp = new Date().toLocaleTimeString();
    cy.log(`📝 Step ${stepNumber} [${timestamp}]: ${description}`);
    return this;
  }

  logAction(action, target = '') {
    const targetInfo = target ? ` on ${target}` : '';
    cy.log(`🎯 Action: ${action}${targetInfo}`);
    return this;
  }

  logResult(result) {
    cy.log(`📊 Result: ${result}`);
    return this;
  }

  logWarning(warning) {
    cy.log(`⚠️ Warning: ${warning}`);
    return this;
  }

  logError(error) {
    cy.log(`🚨 Error: ${error}`);
    return this;
  }

  logKnownIssue(issue) {
    cy.log(`🐛 Known Issue: ${issue}`);
    return this;
  }

  // Enhanced wait methods
  waitForElement(selector, timeout = this.timeout) {
    cy.log(`⏳ Waiting for element: ${selector}`);
    cy.get(selector, { timeout }).should('exist');
    return this;
  }

  waitForElementVisible(selector, timeout = this.timeout) {
    cy.log(`⏳ Waiting for element to be visible: ${selector}`);
    cy.get(selector, { timeout }).should('be.visible');
    return this;
  }

  waitForElementNotVisible(selector, timeout = this.timeout) {
    cy.log(`⏳ Waiting for element to disappear: ${selector}`);
    cy.get(selector, { timeout }).should('not.be.visible');
    return this;
  }

  // Form interaction methods
  selectOption(selector, value) {
    cy.log(`🔽 Selecting option "${value}" from: ${selector}`);
    cy.get(selector).should('be.visible').select(value);
    return this;
  }

  checkCheckbox(selector) {
    cy.log(`☑️ Checking checkbox: ${selector}`);
    cy.get(selector).should('be.visible').check();
    return this;
  }

  uncheckCheckbox(selector) {
    cy.log(`☐ Unchecking checkbox: ${selector}`);
    cy.get(selector).should('be.visible').uncheck();
    return this;
  }

  // Screenshot methods for better reporting
  takeScreenshot(name, options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${this.pageName}-${name}-${timestamp}`;
    cy.log(`📸 Taking screenshot: ${screenshotName}`);
    cy.screenshot(screenshotName, {
      capture: 'fullPage',
      overwrite: false,
      ...options
    });
    return this;
  }

  takeScreenshotOnCondition(condition, name) {
    if (condition) {
      this.takeScreenshot(name);
    }
    return this;
  }

  // Enhanced debugging methods
  debugElement(selector) {
    cy.log(`🔍 Debugging element: ${selector}`);
    cy.get(selector).then(($el) => {
      cy.log(`Element text: "${$el.text().trim()}"`);
      cy.log(`Element visible: ${$el.is(':visible')}`);
      cy.log(`Element enabled: ${!$el.prop('disabled')}`);
      cy.log(`Element classes: ${$el.attr('class') || 'none'}`);
    });
    return this;
  }

  debugPage() {
    cy.log(`🔍 Debugging ${this.pageName}`);
    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });
    cy.title().then((title) => {
      cy.log(`Page title: ${title}`);
    });
    return this;
  }

  // Conditional actions based on element state
  clickIfVisible(selector, options = {}) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).is(':visible')) {
        cy.log(`🖱️ Element is visible, clicking: ${selector}`);
        cy.get(selector).click(options);
      } else {
        cy.log(`ℹ️ Element not visible, skipping click: ${selector}`);
      }
    });
    return this;
  }

  typeIfVisible(selector, text) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).is(':visible')) {
        cy.log(`⌨️ Element is visible, typing: ${selector}`);
        cy.get(selector).clear().type(text);
      } else {
        cy.log(`ℹ️ Element not visible, skipping type: ${selector}`);
      }
    });
    return this;
  }

  // Performance monitoring
  startTimer(timerName) {
    const startTime = performance.now();
    Cypress.env(`timer_${timerName}`, startTime);
    cy.log(`⏱️ Started timer: ${timerName}`);
    return this;
  }

  endTimer(timerName) {
    const startTime = Cypress.env(`timer_${timerName}`);
    if (startTime) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      cy.log(`⏱️ Timer ${timerName}: ${duration}ms`);
      return duration;
    } else {
      cy.log(`⚠️ Timer ${timerName} was not started`);
      return 0;
    }
  }

  // Enhanced error handling
  handleExpectedError(selector, expectedErrorText = '') {
    cy.log(`🚨 Handling expected error: ${selector}`);
    cy.get(selector).should('be.visible');
    if (expectedErrorText) {
      cy.get(selector).should('contain.text', expectedErrorText);
      cy.log(`✅ Expected error message confirmed: "${expectedErrorText}"`);
    }
    return this;
  }

  // Scroll methods
  scrollToElement(selector) {
    cy.log(`📜 Scrolling to element: ${selector}`);
    cy.get(selector).scrollIntoView();
    return this;
  }

  scrollToTop() {
    cy.log(`📜 Scrolling to top of page`);
    cy.scrollTo('top');
    return this;
  }

  scrollToBottom() {
    cy.log(`📜 Scrolling to bottom of page`);
    cy.scrollTo('bottom');
    return this;
  }

  // Utility methods
  getCurrentUrl() {
    return cy.url();
  }

  getCurrentTitle() {
    return cy.title();
  }

  getElementText(selector) {
    return cy.get(selector).invoke('text');
  }

  getElementValue(selector) {
    return cy.get(selector).invoke('val');
  }

  // Enhanced waiting with custom messages
  waitWithMessage(duration, message) {
    cy.log(`⏳ Waiting ${duration}ms: ${message}`);
    cy.wait(duration);
    return this;
  }
}

export default BasePage;