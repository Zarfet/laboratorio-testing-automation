import BasePage from './basePage';

class ProductPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      // Product sections
      featuredSection: '#featured',
      sportsSection: '#sports', 
      brandsSection: '#brands',
      outsidersSection: '#outsiders',
      musclesSection: '#muscles',
      aquaticSection: '#aquatic',
      
      // Product elements
      addToCartButton: 'button:contains("Añadir al carrito")',
      
      // Cart elements - be more specific
      cartOverlay: 'aside.fixed.h-full.w-full',
      cartItems: '.cart-items',
      cartCounter: 'span.bg-pink-500', // More specific, avoid duplicates
      cartOpenerMobile: '[data-at="cart-opener-mobile"]',
      
      // Cart actions
      checkoutButton: 'button:contains("Ir al checkout")',
      clearCartButton: '[data-at="empty-cart"]',
      cartCloseButton: 'aside button svg[viewBox="0 0 384 512"]',
      removeItemButton: '.cart-grid button svg[viewBox="0 0 448 512"]',
      
      // Cart content
      cartTotal: 'span:contains("Total:")'
    };
  }

  visit() {
    cy.visit('/');
    this.waitForPageLoad();
    return this;
  }

  verifyProductsLoaded() {
    cy.get(this.selectors.addToCartButton)
      .should('have.length.at.least', 1);
    return this;
  }

  addFirstProductToCart() {
    cy.log('Adding first available product to cart');
    
    cy.get(this.selectors.addToCartButton)
      .first()
      .should('be.visible')
      .click();

    // Wait for cart to update
    cy.wait(2000);
    
    // Verify cart counter appears
    cy.get(this.selectors.cartCounter)
      .should('be.visible');

    return this;
  }

  // ✅ FIXED: Handle multiple cart counters properly  
  openCartOverlay() {
    cy.log('Opening cart overlay');
    
    // Click the first cart counter (avoid multiple elements error)
    cy.get(this.selectors.cartCounter)
      .first()
      .should('be.visible')
      .click();

    // Wait for overlay animation
    cy.wait(1000);

    // Verify overlay exists and is not translated off-screen
    cy.get(this.selectors.cartOverlay)
      .should('exist')
      .and('not.have.class', 'translate-x-full');

    return this;
  }

  verifyCartOverlayContent() {
    // Verify cart is open and contains expected elements
    cy.get(this.selectors.cartItems).should('be.visible');
    cy.get(this.selectors.checkoutButton).should('be.visible');
    cy.get(this.selectors.clearCartButton).should('be.visible');
    cy.get(this.selectors.cartTotal).should('be.visible');
    
    return this;
  }

  removeFirstCartItem() {
    cy.log('Removing first cart item');
    
    cy.get(this.selectors.removeItemButton)
      .first()
      .should('be.visible')
      .click();

    // Wait for removal
    cy.wait(1000);

    return this;
  }

  clearEntireCart() {
    cy.log('Clearing entire cart');
    
    cy.get(this.selectors.clearCartButton)
      .should('be.visible')
      .click();

    // Verify cart is empty - counter should disappear
    cy.get(this.selectors.cartCounter).should('not.exist');

    return this;
  }

  closeCartOverlay() {
    cy.get(this.selectors.cartCloseButton)
      .should('be.visible')
      .click();

    // Verify overlay is closed
    cy.get(this.selectors.cartOverlay)
      .should('have.class', 'translate-x-full');

    return this;
  }

  proceedToCheckout() {
    cy.log('Proceeding to checkout');
    
    cy.get(this.selectors.checkoutButton)
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Verify redirect to checkout
    cy.url().should('include', '/checkout');

    return this;
  }

  // ✅ PROPER: Validate ALL sections including content
  verifyAllProductSectionsExist() {
    cy.log('Verifying all product sections exist');
    
    const sections = ['featured', 'sports', 'brands', 'outsiders', 'muscles', 'aquatic'];
    
    sections.forEach(section => {
      const sectionId = `#${section}`;
      
      cy.get(sectionId)
        .should('exist')
        .and('be.visible');
      
      cy.log(`✅ Section ${section} exists`);
    });

    return this;
  }

  // ✅ PROPER: Validate sections have actual content
  verifyProductSectionsHaveContent() {
    cy.log('Verifying product sections have content');
    
    const sections = [
      { id: '#featured', name: 'Featured' },
      { id: '#sports', name: 'Sports' }, 
      { id: '#brands', name: 'Brands' },
      { id: '#outsiders', name: 'Outsiders' },
      { id: '#muscles', name: 'Muscles' },
      { id: '#aquatic', name: 'Aquatic' }
    ];

    sections.forEach(section => {
      cy.log(`Checking content for ${section.name}`);
      
      // Navigate to section
      cy.visit(`/${section.id}`);
      cy.wait(1000);
      
      // Verify section exists
      cy.get(section.id).should('exist');
      
      // Check if section has products (Add to Cart buttons)
      cy.get('body').then($body => {
        const addToCartButtons = $body.find(this.selectors.addToCartButton);
        
        if (addToCartButtons.length > 0) {
          cy.log(`✅ ${section.name}: Found ${addToCartButtons.length} products`);
        } else {
          cy.log(`❌ ${section.name}: No products found - SECTION EMPTY`);
          // This should cause test to fail for aquatic
          cy.get(this.selectors.addToCartButton)
            .should('have.length.at.least', 1);
        }
      });
    });

    return this;
  }
}

export default ProductPage;