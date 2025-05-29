# QA Craft Growth Challenge - Automation Framework

> Automation testing solution for laboratoriodetesting.com e-commerce platform  
> Built for Huge Inc. QA Craft Growth Challenge

## Challenge Overview

**Objective:** Enhance automation skills and readiness of QAs at Huge by resolving practical automation testing challenges.

**Target Site:** [laboratoriodetesting.com](https://www.laboratoriodetesting.com)  
**Challenge Context:** Sprint 6 of 18, 3 developers, solo QA role  
**Mission:** Design automation strategy and build Cypress solution for critical user journeys

## Architecture

### Framework Stack
- **Test Framework:** Cypress 13.17.0
- **Design Pattern:** Page Object Model (POM)
- **Language:** JavaScript
- **Reporting:** Mochawesome (HTML + JSON)
- **CI/CD:** GitHub Actions
- **Cross-Browser:** Chrome + Firefox

### Project Structure
```
laboratorio-testing-automation/
├── .github/workflows/
│   └── cypress.yml                      # CI/CD pipeline
├── cypress/
│   ├── e2e/critical-scenarios/          # Test suites
│   │   ├── authentication-flow.cy.js
│   │   ├── complete-purchase-journey.cy.js
│   │   └── user-registration-flow.cy.js
│   ├── fixtures/                        # Test data
│   │   ├── products.json
│   │   ├── test-data.json
│   │   └── users.json
│   ├── pages/                           # Page Object Model
│   │   ├── basePage.js
│   │   ├── cartPage.js
│   │   ├── checkoutPage.js
│   │   ├── loginPage.js
│   │   ├── productPage.js
│   │   └── registrationPage.js
│   ├── reports/                         # Generated reports
│   │   ├── .jsons/                      # JSON report files
│   │   └── report.html                  # Mochawesome HTML reports
│   ├── screenshots/                     # Failure screenshots
│   └── support/                         # Utilities
│       ├── commands.js
│       ├── e2e.js
│       └── emailGenerator.js
├── docs/                                # Challenge documentation
│   ├── Automation Strategy _ Automation challenge activity.pdf
│   ├── Automation Testing Strategy and results.pdf
│   └── Findings Documentation _ Automation challenge activity.pdf
├── node_modules/                        # Dependencies
├── cypress.config.js                    # Framework configuration
├── package.json                         # Project dependencies
├── package-lock.json                    # Dependency lock file
├── README.md                            # Project documentation
└── tsconfig.json                        # TypeScript configuration
```

## Quick Start

### Prerequisites
- Node.js 18+
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/Zarfet/laboratorio-testing-automation.git
cd laboratorio-testing-automation

# Install dependencies
npm install

# Verify Cypress installation
npx cypress verify
```

### Running Tests

**Interactive Mode (Development):**
```bash
# Open Cypress Test Runner
npx cypress open
```

**Headless Mode (CI/CD):**
```bash
# Run all tests
npx cypress run

# Run specific test suite
npx cypress run --spec "cypress/e2e/critical-scenarios/authentication-flow.cy.js"

# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
```

**Generate Reports:**
```bash
# Tests automatically generate Mochawesome reports
# Reports saved to: cypress/reports/report.html
```

## CI/CD Pipeline

### GitHub Actions Workflow
- **Trigger:** Push to main/develop, Pull Requests
- **Matrix Strategy:** Chrome + Firefox browsers
- **Real-Time Metrics:** Dynamic test results from JSON reports
- **Artifacts:** HTML reports, failure screenshots
- **Success Rate Tracking:** Automated calculation and reporting

### Viewing Results
1. **GitHub Actions Tab:** Real-time pipeline status
2. **Summary Reports:** Dynamic metrics and test results
3. **Artifacts Download:** Detailed HTML reports and screenshots
4. **Status Badge:** Pipeline health indicator in README

## Configuration

### Environment Configuration
```javascript
// cypress.config.js
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 2, openMode: 0 }
  }
});
```

### Custom Commands
```javascript
// Unique email generation
cy.generateUniqueEmail('prefix')

// Dynamic test data creation  
cy.generateUniqueTestData('context')
```

## Challenge Deliverables

### Completed Requirements
- **Automation Strategy:** Risk-based testing approach documented
- **Critical Scenarios:** Authentication, Purchase, Registration flows implemented
- **GitHub Repository:** Complete framework with CI/CD pipeline
- **Bug Documentation:** Production issues identified with business impact
- **Cross-Browser Testing:** Chrome + Firefox coverage
- **Comprehensive Reporting:** Mochawesome HTML + JSON reports

### Technical Achievements
- **Production Bug Discovery:** Real issues found affecting business operations
- **Dynamic CI/CD Metrics:** Real-time test result extraction with jq
- **Professional Framework:** Enterprise-ready automation solution
- **Comprehensive Documentation:** Complete setup and usage guide

## Contact

**Project:** QA Craft Growth Challenge  
**Team:** Huge QA Automation  
**Contact:** ebalvin@hugeinc.com  
**Deadline:** July 10th, 2025

---

**Framework Status:** Production-ready automation solution with comprehensive test coverage and CI/CD pipeline