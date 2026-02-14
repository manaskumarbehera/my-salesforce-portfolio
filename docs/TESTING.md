# 🧪 Testing Guide

## Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode (Auto-run)
```bash
npm run test:watch
```

---

## 📊 Test Results

Your project has **52 tests** covering:
- ✅ File organization
- ✅ Configuration files
- ✅ Portfolio content (all links)
- ✅ Feature functionality
- ✅ Documentation structure
- ✅ Deployment configuration
- ✅ Git configuration

---

## 🎯 What's Tested

### 1. File Organization (CRITICAL)
- ✅ Only README.md allowed in root directory
- ✅ All other .md files must be in docs/
- ✅ Required directories exist (docs, test, scripts, css, js)

### 2. Portfolio Content
- ✅ GitHub link: @manaskumarbehera
- ✅ LinkedIn profile link
- ✅ Salesforce Trailblazer link
- ✅ Buy Me a Coffee integration
- ✅ Email addresses configured

### 3. Configuration
- ✅ package.json properly configured
- ✅ jest.config.js exists and valid
- ✅ Procfile for Heroku
- ✅ .gitignore properly configured
- ✅ IntelliJ run configurations

### 4. Features
- ✅ GitHub username in main.js
- ✅ Build and deploy scripts
- ✅ Pre-commit git hooks
- ✅ Server.js syntax valid

### 5. Documentation
- ✅ At least 15 documentation files in docs/
- ✅ All required guides present
- ✅ All .md files have content

---

## 🔍 Test Individual Features

### Test File Organization
```bash
npm run test:md
```

### Test in CI Mode
```bash
npm run test:ci
```

### Test with Verbose Output
```bash
npm test -- --verbose
```

---

## 📁 Test Files

- **test/jest.test.js** - Main test suite (52 tests)
- **test/portfolio.integration.js** - Integration tests

---

## 🎯 Coverage Report

After running `npm run test:coverage`, view the report:
```bash
open coverage/index.html
```

Coverage includes:
- server.js
- test files
- All JavaScript functionality

---

## 🔧 Test Configuration

Located in: `jest.config.js`

Key settings:
- Test environment: Node.js
- Test timeout: 30 seconds
- Coverage directory: coverage/
- Reports: text, lcov, html

---

## ✅ Before Committing

Always run tests before committing:
```bash
npm run precommit
# Runs: validate + test
```

This happens automatically with git hooks!

---

## 🐛 Troubleshooting

### Tests Failing?
```bash
# Check syntax first
npm run validate

# Run with verbose output
npm test -- --verbose
```

### Coverage Not Generated?
```bash
# Explicitly generate coverage
npm run test:coverage
```

### Server Tests Failing?
```bash
# Make sure server is not running
# Tests run on port 3000
```

---

## 💡 Writing New Tests

Add tests to `test/jest.test.js`:

```javascript
describe('Your Feature', () => {
  test('should do something', () => {
    // Your test code
    expect(something).toBe(expected);
  });
});
```

Then run:
```bash
npm test
```

---

**Need Help?**
- See: [START_HERE.md](./START_HERE.md)
- See: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

