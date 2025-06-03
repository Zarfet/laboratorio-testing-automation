import LoginPage from '../../pages/loginPage';

describe('Critical Scenario 2: Authentication Flow', { tags: ['@critical', '@smoke'] }, () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.wrap(users.validUsers[0]).as('validUser');
      cy.wrap(users.invalidUsers[0]).as('invalidUser');
    });
  });

  it('Should login successfully with valid credentials', function() {
    cy.log('Step 1: Navigate to login page');
    loginPage.visit()
      .verifyLoginPageElements();

    cy.log('Step 2: Verify initial logged-out state');
    loginPage.verifyUserIsLoggedOut();

    cy.log('Step 3: Perform login with valid credentials');
    loginPage.login(this.validUser.email, this.validUser.password);

    cy.log('Step 4: Verify successful login');
    loginPage.verifyLoginSuccess();

    cy.log('Step 5: Verify user session is established');
    loginPage.verifyUserIsLoggedIn();
  });

  // Simplified error handling
  it('Should show error popup with invalid credentials', function() {
    cy.log('Step 1: Navigate to login page');
    loginPage.visit();

    cy.log('Step 2: Attempt login with invalid credentials');
    loginPage.login(this.invalidUser.email, this.invalidUser.password);

    cy.log('Step 3: Verify error popup appears');
    loginPage.verifyLoginError('No pudimos iniciar sesión con estas credenciales');

    cy.log('Step 4: Verify can retry after error');
    loginPage.verifyCanRetryAfterError();

    cy.log('Step 5: Close error popup');
    loginPage.closeErrorPopup();

    cy.log('Step 6: Verify can attempt login again');
    loginPage.verifyLoginPageElements();
  });

  // ALTERNATIVE: Test with API verification (if you want to check network)
  it('Should verify API response on invalid login', function() {
    // CORRECT: Set up intercept BEFORE making the request
    cy.intercept('POST', '**/auth/login').as('loginRequest');
    
    cy.log('Step 1: Navigate to login page');
    loginPage.visit();

    cy.log('Step 2: Attempt login with invalid credentials');
    loginPage.login(this.invalidUser.email, this.invalidUser.password);

    cy.log('Step 3: Verify API returns 401');
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(401);
    });

    cy.log('Step 4: Verify error popup appears');
    loginPage.verifyLoginError();
  });

  it('Should enable login button only when both fields are filled', function() {
    cy.log('Step 1: Navigate to login page');
    loginPage.visit();

    cy.log('Step 2: Verify button is initially disabled');
    loginPage.verifyLoginButtonDisabled();

    cy.log('Step 3: Fill email only - button should remain disabled');
    loginPage.fillEmail(this.validUser.email);
    loginPage.verifyLoginButtonDisabled();

    cy.log('Step 4: Fill password - button should become enabled');
    loginPage.fillPassword(this.validUser.password);
    loginPage.verifyLoginButtonEnabled();

    cy.log('Step 5: Verify login can be submitted');
    loginPage.clickLogin();
    loginPage.verifyLoginSuccess();
  });

  it('Should handle complete login-logout flow', function() {
    cy.log('Step 1: Perform successful login');
    loginPage.visit()
      .login(this.validUser.email, this.validUser.password)
      .verifyLoginSuccess();

    cy.log('Step 2: Perform logout');
    loginPage.logout();

    cy.log('Step 3: Verify user is logged out');
    loginPage.verifyUserIsLoggedOut();
  });

  it('Should maintain session across page navigation', function() {
    cy.log('Step 1: Perform successful login');
    loginPage.visit()
      .login(this.validUser.email, this.validUser.password)
      .verifyLoginSuccess();

    cy.log('Step 2: Navigate to different pages and verify session');
    const pages = ['/', '/whishlist', '/my-account'];
    
    pages.forEach(page => {
      cy.log(`Testing session persistence on ${page}`);
      cy.visit(page);
      loginPage.verifyUserIsLoggedIn();
    });
  });

  // Simplified invalid scenarios
  it('Should handle various invalid credential scenarios', function() {
    const invalidScenarios = [
      { 
        email: 'invalid@email.com', 
        password: 'wrongpass', 
        description: 'Invalid email and password'
      },
      { 
        email: this.validUser.email, 
        password: 'wrongpass', 
        description: 'Valid email, invalid password'
      }
    ];

    invalidScenarios.forEach((scenario, index) => {
      cy.log(`Step ${index + 1}: Testing - ${scenario.description}`);
      
      loginPage.visit()
        .login(scenario.email, scenario.password)
        .verifyLoginError()
        .closeErrorPopup()
        .verifyCanRetryAfterError();
    });
  });
});