import BasePage from './basePage';

class LoginPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      // Form fields
      emailInput: 'input[name="email"]',
      passwordInput: 'input[name="password"]',
      loginButton: '[data-at="submit-login"]',
      
      // Error popup (SweetAlert2)
      errorPopup: '.swal2-popup.swal2-icon-error',
      errorMessage: '.swal2-html-container',
      errorTitle: '.swal2-title',
      errorCloseButton: 'button.swal2-confirm',
      
      // Success indicators - User menu elements
      userMenuAccount: 'a[href="/my-account"]',
      logoutButton: 'a[href="/auth/logout"]',
      favoritesLink: 'a[href="/whishlist"]',
      homeLink: 'a[href="/"]'
    };
  }

  visit() {
    cy.visit('/auth/login');
    this.waitForPageLoad();
    return this;
  }

  fillEmail(email) {
    cy.get(this.selectors.emailInput)
      .should('be.visible')
      .clear();
    
    if (email && email.trim() !== '') {
      cy.get(this.selectors.emailInput).type(email);
    }
    
    return this;
  }

  fillPassword(password) {
    cy.get(this.selectors.passwordInput)
      .should('be.visible')
      .clear();
    
    if (password && password.trim() !== '') {
      cy.get(this.selectors.passwordInput).type(password);
    }
    
    return this;
  }

  clickLogin() {
    cy.get(this.selectors.loginButton)
      .should('be.visible')
      .click({ force: true });
    return this;
  }

  login(email, password) {
    this.fillEmail(email)
      .fillPassword(password)
      .clickLogin();
    return this;
  }

  // ✅ FIXED: Simplified error validation - focus on what matters
  verifyLoginError(expectedMessage = null) {
    // Simple approach: Just check for the SweetAlert popup
    cy.get(this.selectors.errorPopup, { timeout: 10000 })
      .should('be.visible');
    
    cy.get(this.selectors.errorTitle)
      .should('be.visible')
      .and('contain.text', 'Error');
    
    if (expectedMessage) {
      cy.get(this.selectors.errorMessage)
        .should('contain.text', expectedMessage);
    } else {
      // Verify default error message
      cy.get(this.selectors.errorMessage)
        .should('contain.text', 'No pudimos iniciar sesión');
    }
    
    // ✅ IMPORTANT: Button should remain ENABLED for retry
    cy.get(this.selectors.loginButton)
      .should('not.be.disabled');
    
    return this;
  }

  closeErrorPopup() {
    cy.get('body').then($body => {
      if ($body.find(this.selectors.errorPopup).length > 0) {
        cy.get(this.selectors.errorCloseButton)
          .should('be.visible')
          .click();
        
        cy.get(this.selectors.errorPopup).should('not.exist');
      }
    });
    return this;
  }

  verifyLoginSuccess() {
    // 1. Verify no error popup exists
    cy.get(this.selectors.errorPopup).should('not.exist');
    
    // 2. Verify redirect to homepage
    cy.url().should('not.include', '/auth/login');
    cy.url().should('eq', 'https://www.laboratoriodetesting.com/');
    
    // 3. Verify logged-in user menu elements appear
    cy.get(this.selectors.userMenuAccount, { timeout: 10000 })
      .should('be.visible');
    
    cy.get(this.selectors.logoutButton)
      .should('be.visible');
    
    cy.get(this.selectors.favoritesLink)
      .should('be.visible');
    
    return this;
  }

  logout() {
    cy.get(this.selectors.logoutButton)
      .should('be.visible')
      .click();
    
    cy.get(this.selectors.userMenuAccount).should('not.exist');
    cy.get(this.selectors.logoutButton).should('not.exist');
    
    return this;
  }

  verifyUserIsLoggedIn() {
    cy.get(this.selectors.userMenuAccount).should('be.visible');
    cy.get(this.selectors.logoutButton).should('be.visible');
    cy.get(this.selectors.favoritesLink).should('be.visible');
    return this;
  }

  verifyUserIsLoggedOut() {
    cy.get(this.selectors.userMenuAccount).should('not.exist');
    cy.get(this.selectors.logoutButton).should('not.exist');
    return this;
  }

  verifyLoginButtonEnabled() {
    cy.get(this.selectors.loginButton).should('not.be.disabled');
    return this;
  }

  verifyLoginButtonDisabled() {
    cy.get(this.selectors.loginButton).should('be.disabled');
    return this;
  }

  verifyLoginPageElements() {
    cy.url().should('include', '/auth/login');
    cy.get(this.selectors.emailInput).should('be.visible');
    cy.get(this.selectors.passwordInput).should('be.visible');
    cy.get(this.selectors.loginButton).should('be.visible');
    return this;
  }

  verifyFormValidation() {
    cy.get(this.selectors.emailInput).should('have.attr', 'name', 'email');
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'password');
    return this;
  }

  verifyCanRetryAfterError() {
    cy.get(this.selectors.loginButton)
      .should('be.visible')
      .and('not.be.disabled');
    
    cy.get(this.selectors.emailInput).should('be.visible');
    cy.get(this.selectors.passwordInput).should('be.visible');
    
    return this;
  }
}

export default LoginPage;