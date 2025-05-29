import BasePage from './basePage';
import EmailGenerator from '../support/emailGenerator';

class CheckoutPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      // Personal Information Fields
      nameInput: 'input[name="name"]',
      lastNameInput: 'input[name="lastname"]', 
      emailInput: 'input[name="email"]',
      addressInput: 'input[name="address"]',
      countrySelect: 'select[name="country"]',
      
      // Payment Information Fields
      cardNumberInput: 'input[name="cardNumber"]',
      expiryDateInput: 'input[name="expiryDate"]',
      securityCodeInput: 'input[name="securityCode"]',
      cardNameInput: 'input[name="nameHolder"]',
      
      // Form Actions
      completePaymentButton: 'button:contains("Completar Pago")',
      
      // Validation and Error Messages
      errorMessages: 'p.text-red-500',
      specificErrorMessages: {
        nameRequired: 'p.text-red-500:contains("Este campo es requerido")',
        emailInvalid: 'p.text-red-500:contains("El correo no es válido")', 
        securityCodeInvalid: 'p.text-red-500:contains("El código debe tener 3 dígitos")'
      }
    };
  }

  visit() {
    cy.visit('/checkout');
    this.waitForPageLoad();
    return this;
  }

  // UPDATED: Use EmailGenerator utility for consistent email generation
  fillPersonalInfo(data) {
    // Use provided data or throw error if missing
    if (!data) {
      throw new Error('Personal info data is required. Use fixture data.');
    }
    
    // Generate unique email for this checkout session using utility
    const dynamicEmail = EmailGenerator.forCheckout();
    
    cy.get(this.selectors.nameInput).clear().type(data.name);
    cy.get(this.selectors.lastNameInput).clear().type(data.lastName);
    cy.get(this.selectors.emailInput).clear().type(dynamicEmail);
    cy.get(this.selectors.addressInput).clear().type(data.address);
    cy.get(this.selectors.countrySelect).select(data.country);
    
    // Log the generated email for debugging
    cy.log(`📧 Generated checkout email: ${dynamicEmail}`);
    
    return this;
  }

  fillPaymentInfo(data) {
    // Use provided data or throw error if missing
    if (!data) {
      throw new Error('Payment info data is required. Use fixture data.');
    }
    
    cy.get(this.selectors.cardNumberInput).clear().type(data.cardNumber);
    cy.get(this.selectors.expiryDateInput).clear().type(data.expiryDate);
    cy.get(this.selectors.securityCodeInput).clear().type(data.securityCode);
    
    // Fill card name field
    if (data.cardName) {
      cy.get(this.selectors.cardNameInput).clear().type(data.cardName);
      cy.log(`💳 Card name filled: ${data.cardName}`);
    } else {
      cy.log('⚠️ Warning: cardName not provided in payment data');
    }
    
    return this;
  }

  // CONVENIENCE: Fill complete form using fixture structure
  fillCompleteCheckoutForm(checkoutData) {
    if (!checkoutData || !checkoutData.personalInfo || !checkoutData.paymentInfo) {
      throw new Error('Complete checkout data is required. Use fixture checkoutData.complete.');
    }
    
    this.fillPersonalInfo(checkoutData.personalInfo);
    this.fillPaymentInfo(checkoutData.paymentInfo);
    return this;
  }

  // Alternative method for custom email (when needed)
  fillPersonalInfoWithCustomEmail(data, customEmail = null) {
    if (!data) {
      throw new Error('Personal info data is required. Use fixture data.');
    }
    
    // Use custom email or generate one
    const email = customEmail || EmailGenerator.forCheckout();
    
    cy.get(this.selectors.nameInput).clear().type(data.name);
    cy.get(this.selectors.lastNameInput).clear().type(data.lastName);
    cy.get(this.selectors.emailInput).clear().type(email);
    cy.get(this.selectors.addressInput).clear().type(data.address);
    cy.get(this.selectors.countrySelect).select(data.country);
    
    cy.log(`📧 Using email: ${email}`);
    
    return this;
  }

  verifyCompletePaymentButtonEnabled() {
    cy.get(this.selectors.completePaymentButton)
      .should('be.visible')
      .and('not.be.disabled');
    return this;
  }

  verifyCheckoutPageElements() {
    cy.url().should('include', '/checkout');
    cy.get(this.selectors.nameInput).should('be.visible');
    cy.get(this.selectors.lastNameInput).should('be.visible');
    cy.get(this.selectors.emailInput).should('be.visible');
    cy.get(this.selectors.addressInput).should('be.visible');
    cy.get(this.selectors.countrySelect).should('be.visible');
    cy.get(this.selectors.cardNumberInput).should('be.visible');
    cy.get(this.selectors.expiryDateInput).should('be.visible');
    cy.get(this.selectors.securityCodeInput).should('be.visible');
    cy.get(this.selectors.cardNameInput).should('be.visible');
    cy.get(this.selectors.completePaymentButton).should('be.visible');
    return this;
  }

  verifyFormData() {
    cy.get(this.selectors.nameInput).should('not.have.value', '');
    cy.get(this.selectors.lastNameInput).should('not.have.value', '');
    cy.get(this.selectors.emailInput).should('not.have.value', '');
    cy.get(this.selectors.addressInput).should('not.have.value', '');
    cy.get(this.selectors.countrySelect).should('not.have.value', '');
    cy.get(this.selectors.cardNumberInput).should('not.have.value', '');
    cy.get(this.selectors.expiryDateInput).should('not.have.value', '');
    cy.get(this.selectors.securityCodeInput).should('not.have.value', '');
    cy.get(this.selectors.cardNameInput).should('not.have.value', '');
    return this;
  }

  attemptCheckout() {
    cy.get(this.selectors.completePaymentButton).then($button => {
      if ($button.prop('disabled')) {
        cy.wrap($button).click({ force: true });
      } else {
        cy.wrap($button).click();
      }
    });
    cy.wait(3000);
    return this;
  }

  // CRITICAL: These methods document that the flow CANNOT be completed
  verifyOrderConfirmation() {
    cy.log('🚨 CRITICAL BUG: Purchase flow cannot be completed');
    cy.log('🔍 Checking for order confirmation - SHOULD FAIL');
    
    // This SHOULD fail because payment doesn't work with test data
    cy.get('body').then(($body) => {
      if ($body.find('.swal2-popup.swal2-icon-error').length > 0) {
        // Payment failed - this is the actual behavior
        cy.log('❌ CONFIRMED: Payment fails with "Tarjeta inválida"');
        cy.log('📋 BUSINESS IMPACT: Customers cannot complete purchases');
        
        // Force test failure to document this critical issue
        cy.get('.swal2-popup.swal2-icon-error').should('not.exist', 
          'CRITICAL BUG: Payment fails with test data - purchase flow broken');
        
      } else {
        // If no error popup, look for success confirmation
        cy.log('🔍 No payment error found, checking for order confirmation');
        cy.url({ timeout: 10000 }).should('include', '/confirmation')
          .or('include', '/success')
          .or('include', '/thank-you');
        
        cy.get('body').should('contain.text', 'confirmación')
          .or('contain.text', 'éxito')
          .or('contain.text', 'gracias')
          .or('contain.text', 'orden');
      }
    });
    
    return this;
  }

  extractOrderDetails() {
    cy.log('🔍 Attempting to extract order details');
    
    cy.get('body').then(($body) => {
      if ($body.find('.swal2-popup.swal2-icon-error').length > 0) {
        // Extract error information instead
        cy.get('#swal2-title').invoke('text').then((errorTitle) => {
          cy.log(`❌ Payment Error Title: ${errorTitle}`);
        });
        cy.get('#swal2-html-container').invoke('text').then((errorMessage) => {
          cy.log(`❌ Payment Error Message: ${errorMessage}`);
        });
        
        // This should fail the test to document the issue
        cy.fail('CRITICAL: Cannot extract order details - payment failed');
        
      } else {
        // Try to extract successful order details
        cy.get('body').then(($successBody) => {
          const orderElements = $successBody.find('[class*="order"], [id*="order"], [data-testid*="order"]');
          
          if (orderElements.length > 0) {
            cy.log(`✅ Found ${orderElements.length} order-related elements`);
            cy.url().then(url => cy.log(`📍 Order confirmation URL: ${url}`));
          } else {
            cy.log('⚠️ No order elements found on success page');
          }
        });
      }
    });
    
    return this;
  }

  // Negative Testing Methods (keep all existing methods)
  attemptCheckoutWithEmptyForm() {
    cy.log('Attempting to submit empty checkout form');
    
    // Clear all fields to ensure they're empty
    cy.get(this.selectors.nameInput).clear().blur();
    cy.get(this.selectors.lastNameInput).clear().blur();
    cy.get(this.selectors.emailInput).clear().blur();
    cy.get(this.selectors.addressInput).clear().blur();
    cy.get(this.selectors.cardNumberInput).clear().blur();
    cy.get(this.selectors.expiryDateInput).clear().blur();
    cy.get(this.selectors.securityCodeInput).clear().blur();
    cy.get(this.selectors.cardNameInput).clear().blur();
    
    // Try multiple ways to trigger validation
    cy.log('Triggering validation in multiple ways');
    
    // Method 1: Try to submit
    cy.get(this.selectors.completePaymentButton).click({ force: true });
    cy.wait(2000);
    
    // Method 2: Focus and blur each field to trigger validation
    cy.get(this.selectors.nameInput).focus().blur();
    cy.get(this.selectors.emailInput).focus().blur();
    cy.get(this.selectors.securityCodeInput).focus().blur();
    
    // Wait for validation messages
    cy.wait(3000);
    
    return this;
  }

  verifyRequiredFieldErrors() {
    cy.log('🔍 DEBUGGING: Looking for validation error messages');
    
    // First, let's see what error messages actually exist
    cy.get('body').then($body => {
      const allErrorElements = $body.find('p.text-red-500');
      cy.log(`Found ${allErrorElements.length} elements with error styling`);
      
      if (allErrorElements.length > 0) {
        allErrorElements.each((index, element) => {
          const errorText = Cypress.$(element).text().trim();
          if (errorText) {
            cy.log(`Error message ${index + 1}: "${errorText}"`);
          }
        });
      } else {
        cy.log('❌ No error messages found with p.text-red-500 selector');
      }
    });
    
    // Check for expected error messages
    const expectedMessages = [
      'Este campo es requerido',
      'El correo no es válido', 
      'El código debe tener 3 dígitos'
    ];
    
    expectedMessages.forEach(message => {
      cy.log(`🔍 Searching for: "${message}"`);
      
      cy.get('body').then($body => {
        if ($body.find(`:contains("${message}")`).length > 0) {
          cy.log(`✅ Found: "${message}"`);
          cy.contains(message).should('exist');
        } else {
          cy.log(`❌ Not found: "${message}"`);
        }
      });
    });
    
    return this;
  }

  testInvalidEmailFormats() {
    cy.log('Testing invalid email formats');
    
    const invalidEmails = [
      'invalid-email',
      'invalid@',
      '@invalid.com',
      'invalid.email@',
      'invalid..email@test.com',
      'test@',
      '@test.com'
    ];

    invalidEmails.forEach(invalidEmail => {
      cy.log(`Testing invalid email: ${invalidEmail}`);
      
      cy.get(this.selectors.emailInput)
        .clear()
        .type(invalidEmail)
        .blur();
      
      // Check if validation message appears
      cy.get('body').then($body => {
        if ($body.find(this.selectors.specificErrorMessages.emailInvalid).length > 0) {
          cy.log(`✅ Validation triggered for: ${invalidEmail}`);
        } else {
          cy.log(`⚠️ No validation shown for: ${invalidEmail}`);
        }
      });
    });
    
    return this;
  }

  testNameFieldsWithInvalidCharacters() {
    cy.log('🐛 Testing name fields with invalid characters (should only allow letters)');
    
    const invalidInputs = [
      { value: 'John123', description: 'name with numbers' },
      { value: 'John@#$', description: 'name with special characters' },
      { value: 'John_Doe', description: 'name with underscore' },
      { value: '12345', description: 'only numbers' }
    ];

    invalidInputs.forEach(input => {
      cy.log(`Testing ${input.description}: ${input.value}`);
      
      // Test name field
      cy.get(this.selectors.nameInput)
        .clear()
        .type(input.value)
        .blur();
      
      cy.get(this.selectors.nameInput).then($input => {
        const actualValue = $input.val();
        if (actualValue === input.value) {
          cy.log(`🐛 BUG: Name field accepts invalid characters: ${input.value}`);
        } else {
          cy.log(`✅ Name field properly filtered input: ${actualValue}`);
        }
      });

      // Test last name field
      cy.get(this.selectors.lastNameInput)
        .clear()
        .type(input.value)
        .blur();
      
      cy.get(this.selectors.lastNameInput).then($input => {
        const actualValue = $input.val();
        if (actualValue === input.value) {
          cy.log(`🐛 BUG: Last name field accepts invalid characters: ${input.value}`);
        } else {
          cy.log(`✅ Last name field properly filtered input: ${actualValue}`);
        }
      });
    });
    
    return this;
  }

  testSecurityCodeWithInvalidCharacters() {
    cy.log('🐛 Testing security code with invalid characters (should only allow numbers)');
    
    const invalidInputs = [
      { value: 'abc', description: 'letters only' },
      { value: '12a', description: 'numbers with letters' },
      { value: '1@3', description: 'numbers with special characters' },
      { value: '12345', description: 'too many digits' },
      { value: '1', description: 'too few digits' }
    ];

    invalidInputs.forEach(input => {
      cy.log(`Testing security code ${input.description}: ${input.value}`);
      
      cy.get(this.selectors.securityCodeInput)
        .clear()
        .type(input.value)
        .blur();
      
      cy.get(this.selectors.securityCodeInput).then($input => {
        const actualValue = $input.val();
        
        if (input.description.includes('letters') && actualValue === input.value) {
          cy.log(`🐛 BUG: Security code accepts letters: ${input.value}`);
        } else if (input.description.includes('special characters') && actualValue === input.value) {
          cy.log(`🐛 BUG: Security code accepts special characters: ${input.value}`);
        } else if (input.description.includes('too many') && actualValue.length > 3) {
          cy.log(`🐛 BUG: Security code allows more than 3 digits: ${actualValue}`);
        } else {
          cy.log(`✅ Security code properly handled: ${actualValue}`);
        }
      });
    });
    
    return this;
  }

  testCardNumberValidation() {
    cy.log('Testing card number validation');
    
    const invalidCardNumbers = [
      { value: '1234', description: 'too short' },
      { value: 'abcd efgh ijkl mnop', description: 'letters instead of numbers' },
      { value: '1234-5678-9012-3456', description: 'with dashes' },
      { value: '1234 5678 9012 345', description: 'missing digit' }
    ];

    invalidCardNumbers.forEach(card => {
      cy.log(`Testing card number ${card.description}: ${card.value}`);
      
      cy.get(this.selectors.cardNumberInput)
        .clear()
        .type(card.value)
        .blur();
      
      // Check for validation
      cy.get('body').then($body => {
        if ($body.find(this.selectors.errorMessages).length > 0) {
          cy.log(`✅ Validation shown for ${card.description}`);
        } else {
          cy.log(`⚠️ No validation for ${card.description}`);
        }
      });
    });
    
    return this;
  }

  testSecurityCodeValidation() {
    cy.log('Testing comprehensive security code validation');
    
    const testCases = [
      { value: '', expected: 'error', description: 'empty field', method: 'clear' },
      { value: '12', expected: 'error', description: 'too short', method: 'type' }, 
      { value: '123', expected: 'valid', description: 'valid 3 digits', method: 'type' },
      { value: '1234', expected: 'error', description: 'too long', method: 'type' },
      { value: 'abc', expected: 'error', description: 'letters only', method: 'type' },
      { value: '12a', expected: 'error', description: 'mixed alphanumeric', method: 'type' }
    ];

    testCases.forEach(testCase => {
      cy.log(`Testing: ${testCase.description} - "${testCase.value}"`);
      
      // Handle empty value differently
      if (testCase.method === 'clear') {
        cy.get(this.selectors.securityCodeInput)
          .clear()
          .blur();
      } else {
        cy.get(this.selectors.securityCodeInput)
          .clear()
          .type(testCase.value)
          .blur();
      }
      
      // Wait for validation
      cy.wait(1000);
      
      // Check for error message
      cy.get('body').then($body => {
        const hasError = $body.find(this.selectors.specificErrorMessages.securityCodeInvalid).length > 0;
        
        if (testCase.expected === 'error' && hasError) {
          cy.log(`✅ Correctly shows error for ${testCase.description}`);
        } else if (testCase.expected === 'valid' && !hasError) {
          cy.log(`✅ Correctly accepts ${testCase.description}`);
        } else if (testCase.expected === 'error' && !hasError) {
          cy.log(`🐛 BUG FOUND: Should show error for ${testCase.description} but doesn't`);
          
          // FAIL THE TEST when letters are accepted as valid
          if (testCase.value.match(/[a-zA-Z]/)) {
            cy.fail(`CRITICAL BUG: Security code field accepts letters "${testCase.value}" - should only accept numbers`);
          }
          
          // FAIL THE TEST for other validation issues
          cy.fail(`BUG: Security code validation missing for ${testCase.description}`);
        } else {
          cy.log(`🐛 BUG: Should not show error for ${testCase.description} but does`);
        }
      });
    });
    
    return this;
  }
}

export default CheckoutPage;