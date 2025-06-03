// cypress/support/emailGenerator.js

class EmailGenerator {
  static generate(prefix = 'test', domain = 'example.com') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}.${timestamp}.${random}@${domain}`;
  }
  
  // Context-specific generators
  static forRegistration() {
    return this.generate('register');
  }
  
  static forCheckout() {
    return this.generate('checkout');
  }
  
  static forLogin() {
    return this.generate('login');
  }
  
  static forForgotPassword() {
    return this.generate('forgot');
  }
  
  // For when you need a specific prefix
  static withPrefix(prefix) {
    return this.generate(prefix);
  }
  
  // Generate multiple emails for batch testing
  static generateBatch(count = 5, prefix = 'test') {
    const emails = [];
    for (let i = 0; i < count; i++) {
      emails.push(this.generate(`${prefix}${i + 1}`));
    }
    return emails;
  }
}

export default EmailGenerator;