# Test Directory

This directory contains automated tests for your portfolio application.

## 🧪 Test Suite

### portfolio.test.js
**Purpose:** Comprehensive automated testing of portfolio functionality

**Test Coverage:**
1. Server accessibility
2. HTML content verification
3. Configuration validation
4. Link verification
5. Security headers
6. Static asset accessibility
7. Error handling

---

## 🎯 Running Tests

### Run All Tests
```bash
# Make sure server is running first
npm start

# In another terminal
npm test
```

### Watch Mode (Auto-run on Changes)
```bash
npm run test:watch
```

---

## 📊 Test Details

### What Gets Tested

#### Server Tests
- ✅ Server is running on port 3000
- ✅ Returns HTTP 200 OK
- ✅ Serves HTML content

#### Content Tests
- ✅ Portfolio owner name present
- ✅ GitHub username configured
- ✅ Email address configured
- ✅ LinkedIn profile linked
- ✅ Trailblazer profile linked
- ✅ Buy Me a Coffee link present

#### Technical Tests
- ✅ Security headers configured
- ✅ CSS files accessible
- ✅ JavaScript files accessible
- ✅ 404 handling works
- ✅ Compression enabled

### Expected Output

```
Running Portfolio Tests...

✓ Server is running and accessible
✓ HTML content is served correctly
✓ GitHub username is configured
✓ Email address is configured
✓ LinkedIn profile is linked
✓ Trailblazer profile is linked
✓ Buy Me a Coffee link is present
✓ Security headers are configured
✓ CSS files are accessible
✓ JavaScript files are accessible
✓ 404 page returns HTML
✓ Compression is enabled

Test Summary:
Passed: 12
Total: 12
```

---

## 🔧 Adding New Tests

### Test Template

```javascript
await runTest('Your test description', async () => {
    const response = await makeRequest('/your-path');
    assert.strictEqual(response.statusCode, 200, 'Should return 200');
    assert.ok(response.body.includes('expected content'), 'Should contain content');
});
```

### Example: Test New Feature

```javascript
// Add this to portfolio.test.js
await runTest('Contact form is present', async () => {
    const response = await makeRequest('/');
    assert.ok(response.body.includes('contact-form'), 'Should have contact form');
});
```

---

## ⚙️ Test Configuration

### Environment Variables

```bash
# Set custom port
PORT=3001 npm test
```

### Test Timeout

Default: 5000ms (5 seconds)

Modify in `portfolio.test.js`:
```javascript
const TIMEOUT = 10000; // 10 seconds
```

---

## ⚠️ Troubleshooting

### "Server is not running"
```bash
# Start server first
npm start

# Then in another terminal
npm test
```

### Tests Fail
```bash
# Check server logs
npm start

# Visit in browser
open http://localhost:3000

# Check what's broken
```

### Port Already in Use
```bash
# Kill process on port 3000
./server-manager.sh stop

# Start fresh
npm start
npm test
```

---

## 🎓 Test Best Practices

### Before Deployment
Always run tests:
```bash
npm test
```

### During Development
Use watch mode:
```bash
npm run test:watch
```

### Automated Testing
Tests run automatically during:
```bash
npm run deploy  # Runs tests before deploying
npm run predeploy  # Explicitly runs tests
```

---

## 📈 Extending Tests

### Add More Test Files

Create new test files:
```bash
touch test/api.test.js
touch test/performance.test.js
```

Update package.json:
```json
"test": "node test/portfolio.test.js && node test/api.test.js"
```

### Test Categories

Consider adding:
- **Performance tests** - Load time, asset sizes
- **Accessibility tests** - ARIA labels, contrast
- **SEO tests** - Meta tags, structured data
- **API tests** - GitHub API integration
- **Integration tests** - Form submission, navigation

---

## 💡 Tips

1. **Always test before deploying**
   ```bash
   npm test && npm run deploy
   ```

2. **Use descriptive test names**
   ```javascript
   'GitHub username is configured and visible'
   ```

3. **Test both success and failure cases**
   ```javascript
   // Test 404 page
   await runTest('404 returns HTML', async () => {
       const response = await makeRequest('/nonexistent');
       assert.ok([200, 404].includes(response.statusCode));
   });
   ```

4. **Keep tests fast**
   - Current tests run in ~2 seconds
   - Add timeouts for slow operations

---

## 🎯 Quick Commands

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run validate        # Validate syntax only
npm run deploy          # Test + Deploy
```

---

## 📚 Learn More

See documentation:
- [docs/NEW_FEATURES.md](../docs/NEW_FEATURES.md) - Testing guide
- [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - Fix test issues

---

**12 tests ensure your portfolio works correctly!** ✅

**Run `npm test` before every deployment!** 🧪

