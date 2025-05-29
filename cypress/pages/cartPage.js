import BasePage from './basePage';

class CartPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      cartItems: '[data-cy="cart-item"], .cart-item',
      checkoutButton: '[data-cy="checkout"], .checkout-btn',
      cartTotal: '[data-cy="total"], .total'
    };
  }

  visit() {
    cy.visit('/cart');
    this.waitForPageLoad();
    return this;
  }

  verifyProductInCart() {
    cy.get(this.selectors.cartItems).should('have.length.at.least', 1);
    return this;
  }

  proceedToCheckout() {
    cy.get(this.selectors.checkoutButton)
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    return this;
  }
}

class CheckoutPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      firstNameInput: '[data-cy="shipping-first-name"], #shippingFirstName',
      lastNameInput: '[data-cy="shipping-last-name"], #shippingLastName',
      addressInput: '[data-cy="shipping-address"], #shippingAddress',
      cardNumberInput: '[data-cy="card-number"], #cardNumber',
      expiryInput: '[data-cy="card-expiry"], #cardExpiry',
      cvvInput: '[data-cy="card-cvv"], #cardCvv',
      placeOrderButton: '[data-cy="place-order"], .place-order-btn',
      orderConfirmation: '[data-cy="order-confirmation"], .order-confirmation'
    };
  }

  fillShippingInfo(data = {}) {
    const defaultData = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Test Street'
    };
    
    const shippingData = { ...defaultData, ...data };
    
    cy.get(this.selectors.firstNameInput).clear().type(shippingData.firstName);
    cy.get(this.selectors.lastNameInput).clear().type(shippingData.lastName);
    cy.get(this.selectors.addressInput).clear().type(shippingData.address);
    
    return this;
  }

  fillPaymentInfo(data = {}) {
    const defaultData = {
      cardNumber: '4111111111111111',
      expiry: '12/25',
      cvv: '123'
    };
    
    const paymentData = { ...defaultData, ...data };
    
    cy.get(this.selectors.cardNumberInput).clear().type(paymentData.cardNumber);
    cy.get(this.selectors.expiryInput).clear().type(paymentData.expiry);
    cy.get(this.selectors.cvvInput).clear().type(paymentData.cvv);
    
    return this;
  }

  submitOrder() {
    cy.get(this.selectors.placeOrderButton)
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    return this;
  }

  verifyOrderConfirmation() {
    cy.get(this.selectors.orderConfirmation, { timeout: 15000 })
      .should('be.visible');
    return this;
  }
}

export { CartPage, CheckoutPage };
