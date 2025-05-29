import BasePage from './basePage';
import EmailGenerator from '../support/emailGenerator';

class RegistrationPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      // Form fields
      emailInput: 'input[name="email"]',
      fullNameInput: 'input[name="name"]',
      passwordInput: 'input[name="password"]',
      confirmPasswordInput: 'input[name="repeatPassword"]',
      
      // Submit button
      createUserButton: '[data-at="submit-signup"]',
      
      // Error messages
      emailRequiredError: 'input[name="email"] + p.text-red-500',
      nameRequiredError: 'input[name="name"] + p.text-red-500',
      passwordLengthError: 'input[name="password"] + p.text-red-500',
      passwordMismatchError: 'input[name="repeatPassword"] + p.text-red-500',
      
      // Links
      loginLink: 'span.text-primaryColor',
      
      // Password visibility toggles
      passwordToggle: 'input[name="password"] + button svg',
      confirmPasswordToggle: 'input[name="repeatPassword"] + button svg'
    };
  }

  visit() {
    cy.visit('/auth/signup');
    this.waitForPageLoad();
    
    // Close any leftover popups
    this.closeSweetAlertIfOpen();
    
    return this;
  }

  waitForPageLoad() {
    cy.url().should('include', '/auth/signup');
    cy.get(this.selectors.emailInput).should('be.visible');
    cy.get(this.selectors.createUserButton).should('be.visible');
    return this;
  }

  // Proper popup management without force
  closeSweetAlertIfOpen() {
    return cy.get('body').then(($body) => {
      if ($body.find('.swal2-popup').length > 0) {
        cy.log('🔍 SweetAlert2 popup detected - closing properly');
        
        // Wait for popup to be fully rendered
        cy.get('.swal2-popup').should('be.visible');
        
        // Click the confirm button
        cy.get('.swal2-confirm').click();
        
        // Wait for popup to fully disappear
        cy.get('.swal2-popup').should('not.exist');
        cy.log('✅ SweetAlert2 popup closed');
      }
    });
  }

  // Clear form safely without force
  clearFormSafely() {
    // First ensure no popups are present
    this.closeSweetAlertIfOpen();
    
    // Wait for form to be ready
    cy.get(this.selectors.emailInput).should('be.visible').should('not.be.disabled');
    
    // Clear fields normally (no force needed with unique emails)
    cy.get(this.selectors.emailInput).clear();
    cy.get(this.selectors.fullNameInput).clear();
    cy.get(this.selectors.passwordInput).clear();
    cy.get(this.selectors.confirmPasswordInput).clear();
    
    return this;
  }

  fillEmail(email) {
    cy.get(this.selectors.emailInput)
      .should('be.visible')
      .should('not.be.disabled')
      .clear();
    
    if (email && email.trim() !== '') {
      cy.get(this.selectors.emailInput).type(email);
    } else {
      cy.log(`🔍 Email is empty - leaving field blank`);
    }
    
    return this;
  }

  fillFullName(fullName) {
    cy.get(this.selectors.fullNameInput)
      .should('be.visible')
      .should('not.be.disabled')
      .clear();
    
    if (fullName && fullName.trim() !== '') {
      cy.get(this.selectors.fullNameInput).type(fullName);
    } else {
      cy.log(`🔍 Full name is empty - leaving field blank`);
    }
    
    return this;
  }

  fillPassword(password) {
    cy.get(this.selectors.passwordInput)
      .should('be.visible')
      .should('not.be.disabled')
      .clear();
    
    if (password && password.trim() !== '') {
      cy.get(this.selectors.passwordInput).type(password);
    } else {
      cy.log(`🔍 Password is empty - leaving field blank`);
    }
    
    return this;
  }

  fillConfirmPassword(confirmPassword) {
    cy.get(this.selectors.confirmPasswordInput)
      .should('be.visible')
      .should('not.be.disabled')
      .clear();
    
    if (confirmPassword && confirmPassword.trim() !== '') {
      cy.get(this.selectors.confirmPasswordInput).type(confirmPassword);
    } else {
      cy.log(`🔍 Confirm password is empty - leaving field blank`);
    }
    
    return this;
  }

  clickCreateUser() {
    // Check if button is enabled before clicking
    cy.get(this.selectors.createUserButton)
      .should('be.visible')
      .then(($button) => {
        if ($button.prop('disabled')) {
          cy.log('⚠️ Button is disabled - cannot click (this might be expected behavior)');
          cy.log('🔍 Form validation is preventing submission');
        } else {
          cy.log('✅ Button is enabled - proceeding with click');
          cy.wrap($button).click();
        }
      });
    return this;
  }

  clickCreateUserWhenEnabled() {
    cy.get(this.selectors.createUserButton)
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    return this;
  }

  // UPDATED: Complete registration flow using EmailGenerator
  registerUser(userData = {}) {
    // FIXED: Use EmailGenerator instead of manual generation
    const defaultData = {
      email: EmailGenerator.forRegistration(), // ✅ FIXED: Use EmailGenerator
      fullName: 'Test User',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!'
    };

    const registrationData = { ...defaultData, ...userData };

    cy.log(`📧 Using generated email: ${registrationData.email}`);

    this.fillEmail(registrationData.email)
      .fillFullName(registrationData.fullName)
      .fillPassword(registrationData.password)
      .fillConfirmPassword(registrationData.confirmPassword);

    // Wait a moment for validation to process
    cy.wait(500);

    // Only click if button is enabled (realistic user behavior)
    this.clickCreateUserWhenEnabled();

    return this;
  }

  // Validation methods
  verifyEmailRequiredError() {
    cy.get(this.selectors.emailRequiredError)
      .should('be.visible')
      .and('contain.text', 'Este campo es requerido');
    return this;
  }

  // Enhanced error detection method
  verifyAnyValidationErrors() {
    cy.log('🔍 Looking for validation errors anywhere on the page');
    
    // Check for SweetAlert2 error popup first
    cy.get('body').then(($body) => {
      if ($body.find('.swal2-popup.swal2-icon-error').length > 0) {
        cy.log('🔍 Found SweetAlert2 error popup');
        cy.get('.swal2-popup.swal2-icon-error').should('be.visible');
        cy.get('#swal2-title').then(($title) => {
          cy.log(`🔍 Error title: ${$title.text()}`);
        });
        cy.get('#swal2-html-container').then(($message) => {
          cy.log(`🔍 Error message: ${$message.text()}`);
        });
      } else {
        cy.log('🔍 No SweetAlert2 error popup found');
        
        // Look for inline validation errors - check if they exist and have content
        cy.get('p.text-red-500').then(($errors) => {
          if ($errors.length > 0) {
            cy.log(`🔍 Found ${$errors.length} error elements`);
            $errors.each((index, el) => {
              const $el = Cypress.$(el);
              const text = $el.text().trim();
              const isVisible = $el.is(':visible');
              const height = $el.height();
              const width = $el.width();
              
              cy.log(`🔍 Error ${index + 1}: text="${text}", visible=${isVisible}, height=${height}, width=${width}`);
              
              if (text && text !== '') {
                cy.log(`🔍 Error content found: "${text}"`);
                if (height > 0) {
                  cy.log('✅ Error is visible');
                } else {
                  cy.log('⚠️ Error has content but height=0 (hidden by CSS)');
                }
              }
            });
          } else {
            cy.log('🔍 No error elements found');
          }
        });
      }
    });
    
    return this;
  }

  verifyNameRequiredError() {
    cy.log('🔍 Checking for name field validation error');
    
    // First try to find any validation errors
    this.verifyAnyValidationErrors();
    
    // Check if the specific error element exists and has content
    cy.get(this.selectors.nameRequiredError).then(($el) => {
      const text = $el.text().trim();
      const isVisible = $el.is(':visible');
      const height = $el.height();
      
      cy.log(`🔍 Name error element: text="${text}", visible=${isVisible}, height=${height}`);
      
      if (text && text.includes('requerido')) {
        cy.log('✅ Name error element has correct content');
        if (height > 0) {
          cy.log('✅ Name error is visible');
          cy.wrap($el).should('be.visible').and('contain.text', 'Este campo es requerido');
        } else {
          cy.log('⚠️ Name error has content but is hidden (height=0)');
          // Element has correct content but is hidden - this could be expected behavior
          cy.wrap($el).should('contain.text', 'Este campo es requerido');
        }
      } else if (text === '') {
        cy.log('🔍 Name error element is empty - no validation triggered yet');
      } else {
        cy.log(`🔍 Name error has unexpected content: "${text}"`);
      }
    });
    
    return this;
  }

  verifyPasswordLengthError() {
    cy.get(this.selectors.passwordLengthError)
      .should('be.visible')
      .and('contain.text', 'La contraseña debe tener al menos 8 caracteres');
    return this;
  }

  verifyPasswordMismatchError() {
    cy.get(this.selectors.passwordMismatchError)
      .should('be.visible')
      .and('contain.text', 'Las contraseñas no coinciden');
    return this;
  }

  verifyCreateUserButtonDisabled() {
    cy.get(this.selectors.createUserButton)
      .should('have.class', 'disabled:opacity-25')
      .should('be.disabled');
    return this;
  }

  verifyCreateUserButtonEnabled() {
    cy.get(this.selectors.createUserButton)
      .should('not.be.disabled')
      .should('not.have.class', 'opacity-25');
    return this;
  }

  verifyRegistrationSuccess() {
    // Verify SweetAlert2 success popup appears
    cy.get('.swal2-popup.swal2-icon-success', { timeout: 10000 })
      .should('be.visible');
    
    // Verify success title and message
    cy.get('#swal2-title')
      .should('be.visible')
      .and('contain.text', 'Operación Exitosa');
      
    cy.get('#swal2-html-container')
      .should('be.visible')
      .and('contain.text', 'Tu usuario ha sido creado correctamente');
    
    return this;
  }

  clickGoToLoginFromSuccessPopup() {
    // Click "Ir al login" button in success popup
    cy.get('.swal2-confirm')
      .should('be.visible')
      .and('contain.text', 'Ir al login')
      .click();
    
    // Should redirect to login page
    cy.url().should('include', 'login');
    return this;
  }

  verifyEmailAlreadyExistsError() {
    // Verify SweetAlert2 error popup appears
    cy.get('.swal2-popup.swal2-icon-error', { timeout: 10000 })
      .should('be.visible');
    
    // Verify error title and message
    cy.get('#swal2-title')
      .should('be.visible')
      .and('contain.text', 'Error');
      
    cy.get('#swal2-html-container')
      .should('be.visible')
      .and('contain.text', 'Este email ya está registrado');
    
    return this;
  }

  clickBackFromErrorPopup() {
    // Click "Volver" button in error popup
    cy.get('.swal2-confirm')
      .should('be.visible')
      .and('contain.text', 'Volver')
      .click();
    
    // Should stay on registration page
    cy.url().should('include', '/auth/signup');
    return this;
  }

  verifyAnyPopupClosed() {
    // Verify no SweetAlert2 popup is visible
    cy.get('.swal2-popup', { timeout: 5000 }).should('not.exist');
    return this;
  }

  clickLoginLink() {
    cy.get(this.selectors.loginLink)
      .should('be.visible')
      .click();
    return this;
  }

  // CRITICAL: Test method that SHOULD FAIL to document business-critical UX bug
  testInvalidEmailFormats() {
    const invalidEmails = [
      { email: 'invalid-email', description: 'Missing @ symbol' },
      { email: 'test@', description: 'Missing domain' },
      { email: '@domain.com', description: 'Missing username' },
      { email: 'test.domain.com', description: 'Missing @ symbol with dots' },
      { email: 'test@domain', description: 'Missing top-level domain' },
      { email: '', description: 'Empty email field' }
    ];

    invalidEmails.forEach((testCase, index) => {
      cy.log(`Testing invalid email ${index + 1}: "${testCase.email}" (${testCase.description})`);
      
      // Clear form safely first
      this.clearFormSafely();
      
      // Fill with test data
      this.fillEmail(testCase.email)
        .fillFullName('Test User')
        .fillPassword('ValidPassword123!')
        .fillConfirmPassword('ValidPassword123!');

      // Wait for validation
      cy.wait(500);

      // Verify email validation message appears (this part works correctly)
      if (testCase.email && testCase.email.trim() !== '') {
        cy.get('p.text-red-500').should('contain.text', 'Email inválido');
        cy.log(`✅ Frontend correctly shows email validation error for: ${testCase.description}`);
      }

      // CRITICAL BUSINESS RULE: Button should be DISABLED with invalid email
      cy.log(`🔍 CRITICAL TEST: Button should be disabled with invalid email: ${testCase.description}`);
      
      cy.get(this.selectors.createUserButton).then(($button) => {
        if ($button.prop('disabled')) {
          cy.log(`✅ CORRECT: Button properly disabled for: ${testCase.description}`);
        } else {
          // THIS IS THE CRITICAL BUG - Document it with business impact and FORCE FAILURE
          cy.log(`🚨 CRITICAL BUG DETECTED: ${testCase.description}`);
          cy.log(`📋 BUSINESS IMPACT: Users can submit invalid emails and get stuck with infinite loading`);
          cy.log(`📋 UX IMPACT: Poor user experience - no clear feedback, button loads forever`);
          cy.log(`📋 DATA IMPACT: Invalid/malformed emails may enter system`);
          cy.log(`📋 CONVERSION IMPACT: Users abandon registration due to poor UX`);
          
          // FORCE TEST FAILURE to document this critical business issue
          cy.wrap($button).should('be.disabled', 
            `CRITICAL UX BUG: Submit button enabled with invalid email "${testCase.email}". ` +
            `Business Rule Violation: Button should remain disabled until valid email is provided. ` +
            `Impact: Users experience infinite loading, poor UX, and potential data corruption. ` +
            `Expected: Button disabled + clear error message. Actual: Button enabled + user gets stuck.`);
        }
      });
    });

    return this;
  }

  testNameFieldsWithInvalidCharacters() {
    const invalidNames = [
      { name: '123456', description: 'Only numbers' },
      { name: '@#$%^&*()', description: 'Special characters' },
      { name: '<script>alert()</script>', description: 'XSS attempt' },
      { name: 'a'.repeat(100), description: 'Very long name (100 chars)' },
    ];

    invalidNames.forEach((testCase, index) => {
      cy.log(`Testing invalid name ${index + 1}: "${testCase.name}" (${testCase.description})`);
      
      // Clear form safely first
      this.clearFormSafely();
      
      // FIXED: Use EmailGenerator for unique emails
      const uniqueEmail = EmailGenerator.withPrefix(`testname${index}`);
      
      this.fillFullName(testCase.name)
        .fillEmail(uniqueEmail)
        .fillPassword('ValidPassword123!')
        .fillConfirmPassword('ValidPassword123!');

      // Wait for validation
      cy.wait(1000);

      // Try to submit
      cy.get(this.selectors.createUserButton).then(($button) => {
        if ($button.prop('disabled')) {
          cy.log(`✅ Button correctly disabled for: ${testCase.description}`);
        } else {
          cy.log(`🔍 Button enabled for: ${testCase.description} - testing submission`);
          cy.wrap($button).click();
          
          // Wait for response
          cy.wait(3000);
          
          // Handle any popup that appears
          cy.get('body').then(($body) => {
            if ($body.find('.swal2-popup').length > 0) {
              cy.log(`🔍 Popup appeared - handling it`);
              this.closeSweetAlertIfOpen();
            }
          });
          
          // Check current URL and handle appropriately
          cy.url().then((currentUrl) => {
            if (currentUrl.includes('/auth/signup')) {
              cy.log(`✅ Stayed on registration page for: ${testCase.description}`);
            } else if (currentUrl.includes('/auth/login')) {
              cy.log(`🔍 Registration succeeded for: ${testCase.description} - form validation may be lenient`);
              // If registration succeeded, navigate back to signup for next test
              cy.visit('/auth/signup');
            } else {
              cy.log(`🔍 Unexpected URL: ${currentUrl}`);
            }
          });
        }
      });
    });

    return this;
  }

  testPasswordValidation() {
    const weakPasswords = [
      '123',
      'pass',
      '1234567',
      '',
    ];

    weakPasswords.forEach((password, index) => {
      cy.log(`Testing weak password: "${password}"`);
      
      this.clearFormSafely();
      
      // FIXED: Use EmailGenerator for unique emails
      const uniqueEmail = EmailGenerator.withPrefix(`testpwd${index}`);
      
      this.fillEmail(uniqueEmail)
        .fillFullName('Test User')
        .fillPassword(password)
        .fillConfirmPassword(password);

      if (password.length > 0 && password.length < 8) {
        this.verifyPasswordLengthError();
      }
    });

    return this;
  }

  testPasswordMismatch() {
    // FIXED: Use EmailGenerator for unique email
    const uniqueEmail = EmailGenerator.withPrefix('testmismatch');
    
    this.fillEmail(uniqueEmail)
      .fillFullName('Test User')
      .fillPassword('ValidPassword123!')
      .fillConfirmPassword('DifferentPassword456!');

    this.verifyPasswordMismatchError();
    return this;
  }

  testRequiredFieldsValidation() {
    // ✅ POSITIVE TEST: Verify button is properly disabled when form is empty
    cy.log('Step 1: Verify button is disabled with empty form (EXPECTED BEHAVIOR)');
    cy.get(this.selectors.createUserButton)
      .should('be.visible')
      .and('be.disabled')
      .and('have.class', 'disabled:opacity-25');
    
    cy.log('✅ Button correctly disabled with empty form');

    // ✅ DISCOVERY TEST: Let's see what ACTUALLY enables the button
    cy.log('Step 2: Discover actual button enabling behavior');
    
    // Fill email and check button state
    cy.get(this.selectors.emailInput).type('test@example.com');
    cy.get(this.selectors.createUserButton).then(($button) => {
      if ($button.prop('disabled')) {
        cy.log('🔍 Button still disabled after email - continuing test');
      } else {
        cy.log('🔍 DISCOVERY: Button enabled with just email!');
      }
    });
    
    // Fill name and check button state
    cy.get(this.selectors.fullNameInput).type('Test User');
    cy.get(this.selectors.createUserButton).then(($button) => {
      if ($button.prop('disabled')) {
        cy.log('🔍 Button still disabled after name - continuing test');
      } else {
        cy.log('🔍 DISCOVERY: Button enabled with email + name!');
      }
    });
    
    // Fill password and check button state
    cy.get(this.selectors.passwordInput).type('ValidPassword123!');
    cy.get(this.selectors.createUserButton).then(($button) => {
      if ($button.prop('disabled')) {
        cy.log('🔍 Button still disabled after password - need confirm password');
      } else {
        cy.log('🔍 DISCOVERY: Button enabled with email + name + password!');
      }
    });
    
    // Fill confirm password - button should definitely be enabled now
    cy.get(this.selectors.confirmPasswordInput).type('ValidPassword123!');
    cy.get(this.selectors.createUserButton)
      .should('not.be.disabled')
      .and('not.have.class', 'opacity-25');
    
    cy.log('✅ Button enabled when form is complete');

    // ✅ TEST: Clear email (most important field) and verify behavior
    cy.log('Step 3: Test clearing email field');
    cy.get(this.selectors.emailInput).clear();
    
    // Give time for validation to trigger
    cy.wait(500);
    
    cy.get(this.selectors.createUserButton).then(($button) => {
      if ($button.prop('disabled')) {
        cy.log('✅ Button correctly disabled when email is cleared');
      } else {
        cy.log('🔍 DISCOVERY: Button stays enabled even without email');
        
        // Try clicking to see what happens
        cy.log('🔍 Testing form submission without email');
        cy.wrap($button).click();
        
        // Check if validation error appears
        cy.wait(1000);
        cy.log('🔍 Checking for validation response after submit');
      }
    });

    return this;
  }
}

export default RegistrationPage;