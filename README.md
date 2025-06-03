# README.md

# QA Craft Growth Challenge - Automation Framework

**Professional E2E Automation Solution for Laboratorio Testing Platform**

*Built for Huge Inc. QA Craft Growth Challenge*

[🚀 Quick Start](#quick-start) • [📋 Test Reports](#test-reports) • [🏗️ Architecture](#architecture) • [🤝 Contributing](#contributing)

</div>

---

## 🎯 Challenge Overview

| **Aspect** | **Details** |
|:-----------|:------------|
| **Objective** | Enhance automation skills and QA readiness at Huge Inc. |
| **Target Platform** | [laboratoriodetesting.com](https://www.laboratoriodetesting.com) - E-commerce Site |
| **Project Context** | Sprint 6/18 • 3 Developers • Solo QA Role |
| **Mission** | Design automation strategy & build Cypress solution for critical user journeys |
| **Deadline** | July 10th, 2025 |

## ✨ Key Features & Achievements

- 🎯 **Critical Business Flows Covered** - Authentication, Purchase Journey, User Registration
- 🐛 **Production Bug Discovery** - Real issues identified with business impact analysis
- 🔄 **Advanced CI/CD Pipeline** - GitHub Actions with dynamic metrics extraction
- 📊 **Professional Reporting** - Mochawesome HTML reports with embedded screenshots
- 🌐 **Cross-Browser Testing** - Chrome & Firefox support
- 🏗️ **Enterprise Architecture** - Page Object Model with custom utilities
- 📈 **Real-time Metrics** - Automated test result tracking and reporting

## 🏗️ Architecture

### Technology Stack

| **Component** | **Technology** | **Version** | **Purpose** |
|:--------------|:---------------|:------------|:------------|
| **Test Framework** | Cypress | 14.4.0 | E2E Testing Engine |
| **Design Pattern** | Page Object Model | - | Maintainable Test Structure |
| **Language** | JavaScript | ES6+ | Test Implementation |
| **Reporting** | Mochawesome | 7.1.3 | HTML & JSON Reports |
| **CI/CD** | GitHub Actions | - | Automated Pipeline |
| **Browsers** | Chrome + Firefox | Latest | Cross-browser Coverage |

### Project Structure

```
laboratorio-testing-automation/
├── 🔧 .github/workflows/
│   └── cypress.yml                      # CI/CD pipeline configuration
├── 🧪 cypress/
│   ├── e2e/critical-scenarios/          # Core test suites
│   │   ├── authentication-flow.cy.js    # Login/logout scenarios
│   │   ├── complete-purchase-journey.cy.js # End-to-end purchase flow
│   │   └── user-registration-flow.cy.js # User registration process
│   ├── fixtures/                        # Test data management
│   │   ├── products.json               # Product test data
│   │   ├── test-data.json              # General test data
│   │   └── users.json                  # User credentials
│   ├── pages/                          # Page Object Model
│   │   ├── basePage.js                 # Base page functionality
│   │   ├── cartPage.js                 # Shopping cart operations
│   │   ├── checkoutPage.js             # Checkout process
│   │   ├── loginPage.js                # Authentication pages
│   │   ├── productPage.js              # Product catalog
│   │   └── registrationPage.js         # User registration
│   ├── reports/                        # Generated reports
│   │   ├── html/                       # Mochawesome HTML reports
│   │   └── screenshots/                # Failure screenshots
│   └── support/                        # Framework utilities
│       ├── commands.js                 # Custom Cypress commands
│       ├── e2e.js                      # Global configuration
│       └── emailGenerator.js           # Dynamic email generation
├── 📚 docs/                            # Challenge documentation
│   ├── Automation Strategy.pdf         # Test strategy document
│   ├── Testing Results.pdf             # Execution results
│   └── Findings Documentation.pdf      # Bug reports
├── ⚙️ cypress.config.js                # Framework configuration
├── 📦 package.json                     # Dependencies & scripts
└── 📖 README.md                        # This documentation
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** (latest version)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Zarfet/laboratorio-testing-automation.git
cd laboratorio-testing-automation

# 2. Install dependencies
npm install

# 3. Verify Cypress installation
npx cypress verify

# 4. Verify installation success
npm run cy:open
```

## 🧪 Running Tests

### Interactive Development Mode

Perfect for test development and debugging:

```bash
# Open Cypress Test Runner (GUI)
npm run cy:open

# Alternative command
npx cypress open
```

### Headless Execution (CI/CD Ready)

Optimized for automated pipelines:

```bash
# Run all test suites
npm run test:all

# Run critical scenarios only
npm run test:critical

# Browser-specific execution
npm run test:chrome    # Chrome browser
npm run test:firefox   # Firefox browser

# Individual test execution
npx cypress run --spec "cypress/e2e/critical-scenarios/authentication-flow.cy.js"
```

### Available NPM Scripts

| **Command** | **Description** | **Use Case** |
|:------------|:----------------|:-------------|
| `npm run cy:open` | Launch Cypress GUI | Development & debugging |
| `npm run test:all` | Execute all test suites | Full regression testing |
| `npm run test:critical` | Run critical scenarios only | Smoke testing |
| `npm run test:chrome` | Chrome-specific execution | Browser compatibility |
| `npm run test:firefox` | Firefox-specific execution | Cross-browser testing |
| `npm run report:generate` | Generate consolidated reports | Post-execution analysis |
| `npm run clean` | Clean reports & screenshots | Fresh test runs |

## 📊 Test Reports

### Automated Reporting

The framework generates comprehensive reports automatically:

- **📈 HTML Reports**: Interactive Mochawesome reports with charts
- **📸 Screenshots**: Automatic capture on test failures
- **📋 JSON Data**: Machine-readable test results
- **⏱️ Performance Metrics**: Execution time and success rates

### Accessing Reports

```bash
# Generate and view reports
npm run report:generate
npm run report:open

# Reports location
cypress/reports/html/index.html
```

### CI/CD Integration

GitHub Actions automatically:
- ✅ Executes tests on multiple browsers
- 📊 Extracts real-time metrics using `jq`
- 🔄 Uploads artifacts (reports + screenshots)
- 📈 Displays success rates in PR summaries

## ⚙️ Configuration

### Environment Settings

```javascript
// cypress.config.js - Key configurations
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: { runMode: 1, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true
  }
});
```

### Custom Test Commands

Enhance your test writing with custom commands:

```javascript
// Enhanced element interactions
cy.waitForElement(selector, timeout)        // Wait for element visibility
cy.safeClick(selector)                      // Safe click with validation
cy.clearAndType(selector, text)             // Clear and type text

// Advanced reporting
cy.screenshotWithContext(name, context)     // Screenshots with context
cy.addTestContext(data)                     // Add data to reports
cy.apiRequest(method, url, body)            // API testing with logging
```

## 🎯 Test Coverage

### Critical Business Scenarios

| **Test Suite** | **Scenarios** | **Coverage** | **Business Impact** |
|:---------------|:--------------|:-------------|:-------------------|
| **Authentication Flow** | Login, Logout, Session Management | 🟢 Complete | User access & security |
| **Purchase Journey** | Add to cart, Checkout, Payment | 🟢 Complete | Revenue generation |
| **User Registration** | Sign up, Validation, Confirmation | 🟢 Complete | User acquisition |

### Bug Discovery & Impact

The automation framework has successfully identified **real production issues**:

- 🐛 **Registration Flow Bugs**: Client-reported issues validated
- 💳 **Checkout Process Issues**: Payment workflow defects
- 📱 **Cross-browser Compatibility**: Browser-specific behaviors
- 🔒 **Security Validations**: Authentication edge cases

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Triggers:**
- Push to `main` or `develop` branches
- Pull Request creation/updates
- Manual workflow dispatch

**Pipeline Features:**
- 🌐 **Matrix Strategy**: Parallel execution on Chrome + Firefox
- 📊 **Dynamic Metrics**: Real-time test result extraction
- 📦 **Artifacts Management**: Automated report and screenshot uploads
- 🔔 **Status Reporting**: Success rate calculations and PR comments

### Pipeline Status

View real-time pipeline status and results:

1. **GitHub Actions Tab** - Live execution monitoring
2. **PR Comments** - Automated test summaries
3. **Artifacts Download** - Detailed reports and screenshots
4. **README Badge** - Overall pipeline health

## 🤝 Contributing

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-test-scenario

# 2. Implement changes
# Add tests in cypress/e2e/
# Update Page Objects in cypress/pages/
# Add test data in cypress/fixtures/

# 3. Test locally
npm run test:critical

# 4. Commit and push
git add .
git commit -m "feat: add new test scenario for feature X"
git push origin feature/new-test-scenario

# 5. Create Pull Request
```

### Code Quality Standards

- 📝 **Page Object Model**: Maintain clean separation of test logic
- 🏷️ **Descriptive Naming**: Clear, business-focused test names
- 📊 **Assertions**: Comprehensive validation with meaningful messages
- 🔄 **DRY Principle**: Reusable components and utilities
- 📸 **Error Handling**: Automatic screenshots and context on failures

## 📋 Challenge Requirements Status

### ✅ Completed Deliverables

| **Requirement** | **Status** | **Implementation** |
|:----------------|:-----------|:-------------------|
| Automation Strategy | ✅ Complete | Risk-based approach documented |
| Critical Scenarios (3+) | ✅ Complete | Authentication, Purchase, Registration |
| GitHub Repository | ✅ Complete | Professional framework with CI/CD |
| Bug Documentation | ✅ Complete | Production issues identified & documented |
| Cross-Browser Testing | ✅ Complete | Chrome + Firefox coverage |
| Comprehensive Reporting | ✅ Complete | Mochawesome HTML + JSON reports |

### 🏆 Technical Achievements

- **🎯 Real Bug Discovery**: Production issues found affecting business operations
- **⚡ Dynamic CI/CD**: Real-time metrics extraction with advanced pipeline
- **🏗️ Enterprise Framework**: Production-ready automation solution
- **📚 Complete Documentation**: Comprehensive setup and usage guides
- **🔧 Custom Utilities**: Enhanced commands and reporting capabilities

## 📞 Contact & Support

| **Aspect** | **Details** |
|:-----------|:------------|
| **Project** | QA Craft Growth Challenge |
| **Team** | Huge QA Automation |
| **Contact** | ebalvin@hugeinc.com |
| **Repository** | [GitHub Repository](https://github.com/Zarfet/laboratorio-testing-automation) |
| **Deadline** | July 10th, 2025 |

---

**🚀 Framework Status: Production-Ready**

*Professional automation solution with comprehensive test coverage, CI/CD pipeline, and enterprise-grade reporting*

**Built with ❤️ for Huge Inc. QA Craft Growth Challenge**