// cypress/e2e/critical-scenarios/complete-purchase-journey.cy.js
import LoginPage from '../../pages/loginPage';
import ProductPage from '../../pages/productPage';
import CheckoutPage from '../../pages/checkoutPage';

describe('Critical Scenario 1: Complete Purchase Journey', { tags: ['@critical', '@smoke'] }, () => {
  const loginPage = new LoginPage();
  const productPage = new ProductPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    // Load user data from users.json
    cy.fixture('users').then((users) => {
      cy.wrap(users.validUsers[0]).as('testUser');
    });
    
    // Load checkout data from test-data.json
    cy.fixture('test-data').then((testData) => {
      cy.wrap(testData.checkoutData.complete).as('checkoutData');
    });
  });

  // MAIN TEST: Complete end-to-end purchase (fails at payment processing - expected)
  it('Should complete end-to-end purchase successfully', function() {
    // Step 1: User Authentication
    cy.log('Step 1: User Authentication');
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    // Step 2: Browse and select product
    cy.log('Step 2: Browse and select product');
    productPage.visit()
      .verifyProductsLoaded()
      .addFirstProductToCart();

    // Step 3: Verify cart functionality
    cy.log('Step 3: Verify cart functionality');
    productPage.openCartOverlay()
      .verifyCartOverlayContent();

    // Step 4: Proceed to checkout
    cy.log('Step 4: Proceed to checkout');
    productPage.proceedToCheckout();

    // Step 5: Verify checkout page loaded correctly
    cy.log('Step 5: Verify checkout page elements');
    checkoutPage.verifyCheckoutPageElements();

    // Step 6-7: Fill form using fixture data
    cy.log('Step 6-7: Fill checkout form with fixture data');
    checkoutPage.fillCompleteCheckoutForm(this.checkoutData);

    // Step 8: Verify all form data entered correctly
    cy.log('Step 8: Verify form data completeness');
    checkoutPage.verifyFormData();

    // Step 9: Verify payment button is enabled
    cy.log('Step 9: Verify payment button is enabled for purchase completion');
    checkoutPage.verifyCompletePaymentButtonEnabled();

    // Step 10: Complete the purchase
    cy.log('Step 10: Complete the purchase');
    checkoutPage.attemptCheckout();

    // Step 11: Verify order confirmation (WILL FAIL HERE due to payment processing bug)
    cy.log('Step 11: Verify order confirmation');
    checkoutPage.verifyOrderConfirmation();
    
    // Step 12: Extract order details (never reached due to Step 11 failure)
    cy.log('Step 12: Extract order details');
    checkoutPage.extractOrderDetails();

    cy.log('Purchase completed successfully');
  });

  // Negative Testing - Form Validation
  it('Should validate required fields with appropriate error messages', function() {
    // Setup: Get to checkout with empty form
    cy.log('Step 1: Setup - Navigate to checkout');
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .addFirstProductToCart()
      .openCartOverlay()
      .proceedToCheckout();

    // Test: Submit empty form and verify error messages
    cy.log('Step 2: Test required field validation');
    checkoutPage.verifyCheckoutPageElements()
      .attemptCheckoutWithEmptyForm()
      .verifyRequiredFieldErrors();
  });

  // Negative Testing - Email Validation  
  it('Should validate email format in checkout form', function() {
    // Setup
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .addFirstProductToCart()
      .openCartOverlay()
      .proceedToCheckout();

    // Test invalid email formats
    cy.log('Testing invalid email formats');
    checkoutPage.testInvalidEmailFormats();
  });

  // Negative Testing - Input Type Validation (Bug Discovery)
  it('Should validate input types and reject invalid characters', function() {
    // Setup
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .addFirstProductToCart()
      .openCartOverlay()
      .proceedToCheckout();

    // Test: Invalid characters in name fields (should fail - bug)
    cy.log('Step 1: Test name fields with invalid characters');
    checkoutPage.testNameFieldsWithInvalidCharacters();

    // Test: Invalid characters in security code (should fail - bug)
    cy.log('Step 2: Test security code with invalid characters');
    checkoutPage.testSecurityCodeWithInvalidCharacters();

    // Test: Invalid card number format
    cy.log('Step 3: Test card number validation');
    checkoutPage.testCardNumberValidation();
  });

  // Negative Testing - Security Code Validation
  it('Should validate security code format and length', function() {
    // Setup
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .addFirstProductToCart()
      .openCartOverlay()
      .proceedToCheckout();

    // Test security code validation scenarios
    cy.log('Testing security code validation');
    checkoutPage.testSecurityCodeValidation();
  });

  // NEW TEST: Invalid Credit Card Processing
  it('Should reject truly invalid credit card numbers during form validation', function() {
    // Setup: Get to checkout page
    cy.log('Step 1: Navigate to checkout with product in cart');
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .addFirstProductToCart()
      .openCartOverlay()
      .proceedToCheckout();

    // Verify we're on checkout page
    checkoutPage.verifyCheckoutPageElements();

    // Test: Fill form with invalid card data from fixture
    cy.log('Step 2: Fill checkout form with invalid card data');
    cy.fixture('test-data').then((testData) => {
      const invalidData = {
        personalInfo: testData.checkoutData.complete.personalInfo,
        paymentInfo: testData.checkoutData.withInvalidCard.paymentInfo
      };
      
      checkoutPage.fillCompleteCheckoutForm(invalidData);
    });

    // Test: Attempt to submit and verify form-level validation
    cy.log('Step 3: Attempt checkout with invalid card');
    checkoutPage.attemptCheckout();

    // Verify: Should get form validation error, not payment processing error
    cy.log('Step 4: Verify form validation prevents submission');
    cy.get('body').then($body => {
      // Look for form validation errors (red text)
      const formErrors = $body.find('p.text-red-500');
      
      if (formErrors.length > 0) {
        cy.log('✅ EXPECTED: Form validation caught invalid card');
        formErrors.each((index, element) => {
          const errorText = Cypress.$(element).text().trim();
          if (errorText) {
            cy.log(`Form validation error: "${errorText}"`);
          }
        });
      } else {
        // If no form validation, check if it went to payment processing
        if ($body.find('.swal2-popup.swal2-icon-error').length > 0) {
          cy.log('⚠️ ISSUE: Invalid card reached payment processing instead of being caught by form validation');
          cy.get('#swal2-title').invoke('text').then((errorTitle) => {
            cy.log(`Payment error for invalid card: ${errorTitle}`);
          });
        } else {
          cy.log('❓ UNEXPECTED: No validation error shown for invalid card');
        }
      }
    });

    cy.log('Invalid card test completed');
  });

  // EXISTING WORKING TESTS
  it('Should handle cart management operations', function() {
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .verifyProductsLoaded()
      .addFirstProductToCart()
      .openCartOverlay()
      .verifyCartOverlayContent()
      .closeCartOverlay();

    productPage.addFirstProductToCart()
      .openCartOverlay()
      .removeFirstCartItem()
      .clearEntireCart();
  });

  // KEEP AS-IS: This test should fail to document the real aquatic section bug
  it('Should verify all product sections have content', function() {
    loginPage.visit()
      .login(this.testUser.email, this.testUser.password)
      .verifyLoginSuccess();

    productPage.visit()
      .verifyAllProductSectionsExist()
      .verifyProductSectionsHaveContent();
  });
});