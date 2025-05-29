# Laboratorio Testing Automation Framework

## Overview

Comprehensive Cypress-based test automation framework developed for the **QA Craft Growth Challenge**. This framework provides automated testing for the [laboratoriodetesting.com](https://www.laboratoriodetesting.com) e-commerce platform with focus on critical business scenarios.

**Target Application:** https://www.laboratoriodetesting.com  
**Framework:** Cypress with Page Object Model  
**Reporting:** cypress-mochawesome-reporter with embedded screenshots  
**CI/CD:** GitHub Actions integration  

## Test Scenarios

The framework covers three critical business scenarios:

1. **Authentication Flow** - Login/logout functionality and session management
2. **Complete Purchase Journey** - End-to-end e-commerce workflow  
3. **User Registration Flow** - Account creation and validation

---

## Technical Stack

- **Test Framework:** Cypress 13.15.0
- **Architecture:** Page Object Model with centralized utilities
- **Data Management:** Fixtures-based with dynamic email generation
- **Reporting:** cypress-mochawesome-reporter with embedded screenshots
- **CI/CD:** GitHub Actions with cross-browser testing
- **Utilities:** Rimraf for cross-platform file cleanup
- **Languages:** JavaScript ES6+

## Prerequisites

- **Node.js** ≥ 18.x ([Download here](https://nodejs.org/))
- **npm** ≥ 8.x (comes with Node.js)
- **Git** for version control
- **Modern web browser** (Chrome/Firefox/Edge)

---

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Zarfet/laboratorio-testing-automation.git
cd laboratorio-testing-automation

# Install all dependencies (includes Cypress, Mochawesome, and utilities)
npm install

# Verify installation
npm run cy:version
```

> **Note:** Dependencies are automatically managed through `package.json`. No manual Cypress installation required.

---

## Test Execution

### **Interactive Test Runner**
```bash
# Open Cypress Test Runner (recommended for development)
npm run cy:open
```

### **Headless Execution**
```bash
# Run critical scenarios (the main test suite)
npm run cy:run:critical

# Run all tests with report generation
npm run test:all

# Run with specific browser
npm run cy:run:chrome
npm run cy:run:firefox
npm run cy:run:edge

# Run in headed mode (visible browser)
npm run cy:run:headed
```

### **Individual Test Suites**
```bash
# Run authentication flow only
npx cypress run --spec "cypress/e2e/critical-scenarios/authentication-flow.cy.js"

# Run purchase journey only
npx cypress run --spec "cypress/e2e/critical-scenarios/complete-purchase-journey.cy.js"

# Run registration flow only
npx cypress run --spec "cypress/e2e/critical-scenarios/user-registration-flow.cy.js"
```

### **Tagged Test Execution**
```bash
# Run smoke tests only
npm run test:smoke

# Run regression suite
npm run test:regression

# Run critical tagged tests
npm run test:critical
```

### **Complete Test Suite with Reports**
```bash
# Run all tests and generate Mochawesome reports (recommended)
npm run test:all

# Run critical tests with report generation
npm run test:critical
```

### **CI/CD Compatible**
```bash
# Execute tests in CI environment
npm run ci:test

# Execute all tests in CI environment
npm run ci:test:all
```

---

## Generate Reports

### **cypress-mochawesome-reporter**
```bash
# Reports are generated automatically after test execution
npm run test:all

# Open generated HTML report in browser
npm run report:open
```

### **Clean Up**
```bash
# Clean all artifacts (screenshots, reports, logs)
npm run clean

# Clean only reports
npm run clean:reports

# Clean only test artifacts
npm run clean:artifacts

# Clean only log files
npm run clean:logs

# Complete cleanup including cache
npm run clean:all
```

---

## Project Structure

```
laboratorio-testing-automation/
├── cypress/
│   ├── e2e/critical-scenarios/    # Critical business test scenarios
│   ├── pages/                     # Page Object Model classes
│   │   ├── basePage.js              # Base class with common methods
│   │   ├── loginPage.js             # Login functionality
│   │   ├── productPage.js           # Product browsing and cart
│   │   ├── checkoutPage.js          # Checkout form and payment
│   │   └── registrationPage.js     # User registration
│   ├── fixtures/                  # Test data files
│   │   ├── users.json               # User credentials
│   │   ├── test-data.json           # Checkout and payment data
│   │   └── products.json            # Product catalog data
│   ├── support/                   # Custom commands & configuration
│   │   ├── e2e.js                   # Support file entry point
│   │   ├── commands.js              # Custom Cypress commands
│   │   └── emailGenerator.js       # Dynamic email generation utility
│   └── reports/                   # Mochawesome JSON and HTML reports
├── .github/workflows/             # CI/CD pipeline configuration
├── docs/                          # Project documentation
├── logs/                          # Test execution logs
├── cypress.config.js              # Cypress configuration
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── tsconfig.json                  # TypeScript configuration (warnings suppression)
└── .gitignore                     # Git ignore rules
```

---

## Architecture Features

### **Page Object Model (POM)**
- **BasePage:** Common methods inherited by all page objects
- **Fluent Interface:** Method chaining for readable test flows
- **Centralized Selectors:** All element selectors organized by page
- **Reusable Methods:** Common actions abstracted into page methods

### **Dynamic Email Generation**
```javascript
// Centralized email generation utility
import EmailGenerator from '../support/emailGenerator';

// Context-specific emails
EmailGenerator.forRegistration() // → register.timestamp.random@example.com
EmailGenerator.forCheckout()     // → checkout.timestamp.random@example.com

// Custom Cypress commands
cy.generateUniqueEmail('test')   // → test.timestamp.random@example.com
cy.getUniqueEmail('context')     // → context-specific email
```

### **Fixtures-Based Data Management**
- **users.json:** Authentication credentials
- **test-data.json:** Form data with Colombian localization  
- **products.json:** Product catalog for testing
- **No Hard-coded Data:** All test data externalized

---

## Latest Test Results

### **Framework Quality Assessment: Professional Grade**

```
EXECUTION SUMMARY (Last Run)
=======================================
Total Test Scenarios:     25 tests across 3 modules
Overall Success Rate:     88% (22 passing, 3 failing)
Critical Bugs Detected:   3 business-impacting issues
Execution Time:           4 minutes 52 seconds
Evidence Collected:       Screenshots + videos for all failures
Framework Status:         PRODUCTION READY
```

### **Detailed Results by Module**

#### **1. Authentication Flow**
- **Status:** 7/7 tests passing (100% success rate)
- **Duration:** 20 seconds
- **Coverage:** Login, logout, session management, error handling
- **Business Impact:** Users can reliably access their accounts

#### **2. Complete Purchase Journey**
- **Status:** 5/7 tests passing (71% success rate) 
- **Duration:** 2 minutes 46 seconds
- **Coverage:** Product selection, cart management, checkout validation
- **Critical Issues Found:** 2 bugs blocking revenue
- **Business Impact:** **CRITICAL** - Payment completion blocked, product access limited

#### **3. User Registration Flow**
- **Status:** 10/11 tests passing (91% success rate)
- **Duration:** 1 minute 46 seconds  
- **Coverage:** Account creation, validation, error handling
- **Issues Found:** 1 UX inconsistency bug
- **Business Impact:** User experience affected during registration

### **Critical Bugs Discovered**

#### **Bug #1: Payment Flow Completion Failure**
- **Severity:** CRITICAL - Revenue Blocking
- **Location:** Checkout process  
- **Issue:** Payment button remains disabled with valid form data
- **Evidence:** 3 screenshots captured during test execution
- **Business Impact:** Direct revenue loss - customers cannot complete purchases

#### **Bug #2: Aquatic Products Section Missing**
- **Severity:** HIGH - Product Access Blocked
- **Location:** Product navigation
- **Issue:** Aquatic section link points to "#" instead of functional page
- **Evidence:** Screenshots showing navigation failure
- **Business Impact:** Entire product category inaccessible to customers

#### **Bug #3: Registration Email Validation Inconsistency**
- **Severity:** MEDIUM - User Experience Impact
- **Location:** Registration form
- **Issue:** Form submit button behavior inconsistent with email validation
- **Evidence:** Screenshots of form state inconsistencies
- **Business Impact:** Poor user experience during account creation

### **Framework Value Delivered**
- **Revenue Protection:** Identified payment flow blocking critical business operations
- **Product Discovery:** Found missing product category affecting sales
- **User Experience:** Detected registration inconsistencies affecting conversion
- **Quality Assurance:** Established reliable regression testing baseline
- **Evidence Collection:** Comprehensive visual documentation for development team

---

## Configuration

### **Environment Variables**
```bash
# Base URL (default: https://www.laboratoriodetesting.com)
CYPRESS_baseUrl=https://www.laboratoriodetesting.com

# Test user credentials are configured in cypress/fixtures/users.json
```

### **Browser Configuration**
- **Default:** Chrome (headless)
- **Supported:** Chrome, Firefox, Edge
- **Viewport:** 1440x900 (configurable)
- **Screenshots:** Always captured on failures (local + CI)
- **Screenshot Integration:** Embedded in Mochawesome reports via addContext

### **cypress-mochawesome-reporter Configuration**
- **Reports Directory:** `cypress/reports/`
- **Screenshots:** Automatically embedded in HTML reports
- **Charts:** Enabled for visual test metrics
- **Format:** Single HTML file with embedded screenshots
- **Zero Configuration:** Works out of the box

### **TypeScript Support**
- **tsconfig.json:** Basic configuration for IDE support and warning suppression
- **JavaScript First:** Framework uses JS but supports TS tooling integration
- **Cypress Types:** Full IntelliSense support for Cypress commands

---

## CI/CD Integration

### **GitHub Actions**
The framework includes automated testing pipeline that:

- Executes on push to `main`/`develop` branches and pull requests
- Runs tests across Chrome and Firefox browsers in parallel
- Generates cypress-mochawesome-reporter HTML reports with embedded screenshots
- Collects screenshots automatically for failed tests
- Uploads artifacts with 7-day retention
- Uses dependency caching for faster builds
- Configures proper viewport (1440x900) for consistent results
- Provides detailed test summaries in GitHub Actions

**Pipeline Status:** [Cypress E2E Tests](https://github.com/Zarfet/laboratorio-testing-automation/actions/workflows/cypress.yml)

### **Manual Trigger**
```bash
# Local execution matching CI environment
npm ci
npm run ci:test
```

### **Cost Optimization**
- **Free plan usage:** 4-10 minutes per run
- **Monthly estimate:** 200-500 executions within free tier
- **Artifact retention:** 7 days (configurable)
- **Video recording:** Disabled in CI to reduce storage costs

---

## Dependencies Management

All project dependencies are managed through `package.json`:

```json
{
  "devDependencies": {
    "cypress": "^13.15.0",
    "cypress-mochawesome-reporter": "^3.8.2",
    "rimraf": "^5.0.5"
  }
}
```

**Key features:**
- **Locked versions** via `package-lock.json`
- **Auto-verification** on install
- **Pre-test cleanup** automation
- **CI/CD compatibility**
- **Rich HTML reports** with embedded screenshots
- **Clean execution** without unnecessary warnings

---

## Mochawesome Features

### **Report Capabilities**
- **Interactive Charts** - Visual representation of test results
- **Embedded Screenshots** - Automatic screenshot attachment for failures
- **Beautiful UI** - Modern, responsive HTML reports
- **Mobile Friendly** - Reports work on all devices
- **Detailed Logs** - Step-by-step test execution details
- **Performance Metrics** - Test duration and timing information

### **Report Structure**
```
cypress/reports/
├── *.json              # Individual test JSON reports
├── merged-report.json  # Combined JSON report
└── html/
    └── merged-report.html  # Final HTML report with embedded screenshots
```

---

## Development Guidelines

### **Adding New Tests**
1. **Create Page Object:** Extend BasePage for new pages
2. **Use Fixtures:** Store test data in appropriate JSON files  
3. **Dynamic Emails:** Use EmailGenerator for unique test data
4. **Follow POM:** Keep tests thin, logic in page objects
5. **Tag Tests:** Use `@critical`, `@smoke`, `@regression` tags

### **Best Practices**
- **Stable Selectors:** Prefer `data-*` attributes over CSS classes
- **Explicit Waits:** Use `should()` assertions instead of `cy.wait()`
- **Page Object Pattern:** One file per page/component
- **Fixtures Over Hard-coding:** Externalize all test data
- **Descriptive Logging:** Use `cy.log()` for test documentation

### **Email Generation Usage**
```javascript
// In Page Objects
import EmailGenerator from '../support/emailGenerator';
const email = EmailGenerator.forCheckout();

// In Tests  
cy.generateUniqueEmail('prefix').then(email => {
  // Use generated email
});
```

---

## Documentation

- **[Automation Strategy Report](./docs/automation-strategy-report.md)** - Comprehensive testing approach and results analysis
- **[Bug Documentation](./docs/critical-bugs-found.md)** - Detailed findings and business impact assessment
- **[Framework Architecture](./docs/technical-architecture.md)** - Implementation details and design decisions

---

## Known Issues & Limitations

### **Critical Business Issues (Detected by Framework)**
- **Payment Flow:** Cannot complete end-to-end purchases due to disabled payment button
- **Product Navigation:** Aquatic products section completely inaccessible
- **Registration UX:** Email validation behavior inconsistent across form states

### **Test Data Limitations**
- **Credit Cards:** Provided test cards (`xxxx`) fail with "Tarjeta inválida" error
- **Payment Completion:** End-to-end purchase testing blocked by payment validation
- **Recommendation:** Contact `ebalvin@hugeinc.com` for functional test payment data

### **Framework Design Philosophy**
- **Real Bug Detection:** Tests fail when functionality is broken (no false positives)
- **Business Value Focus:** Prioritizes critical revenue and user experience flows
- **Evidence-Driven:** Comprehensive screenshots and documentation for development team
- **Professional Quality:** 88% success rate indicates healthy application with specific issues

---

## Troubleshooting

### **Common Issues**

**Tests fail with timeout errors:**
```bash
# Increase timeout in cypress.config.js or use:
npx cypress run --config defaultCommandTimeout=15000
```

**Mochawesome reports not generating:**
```bash
# Clean and regenerate reports
npm run clean:reports
npm run test:all
```

**Screenshots not appearing in reports:**
```bash
# Verify screenshot configuration in cypress.config.js
# Check that embedScreenshots: true is set in reporterOptions
```

**Browser launch issues:**
```bash
# Clear Cypress cache and reinstall
npx cypress cache clear
npm run postinstall
```

**Report generation fails:**
```bash
# Check if JSON reports exist
ls -la cypress/reports/*.json

# Manual report generation
npm run report:generate-and-open
```

**Video not recording locally:**
```bash
# Verify video setting in cypress.config.js
# Ensure video: process.env.CI ? false : true
```

### **Getting Help**

1. **Check logs:** `logs/execution-*.log` files
2. **Review artifacts:** Screenshots and videos in CI
3. **Validate config:** `cypress.config.js` settings
4. **Dependencies:** Ensure `npm install` completed successfully
5. **Reports:** Download Mochawesome HTML reports from artifacts

---

## Support

For questions or issues related to this framework:

- **Challenge Contact:** ebalvin@hugeinc.com
- **Documentation:** Check `/docs` folder for detailed guides
- **Issues:** Create GitHub issue for technical problems
- **CI/CD:** Monitor Actions tab for pipeline status

---

*Built for the QA Craft Growth Challenge - Delivering professional QA automation with 88% test success rate and 3 critical business bugs identified. Framework demonstrates enterprise-ready testing practices with comprehensive reporting and CI/CD integration.*