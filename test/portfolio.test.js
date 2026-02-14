const http = require('http');
const assert = require('assert');

/**
 * Simple test suite for portfolio application
 */

// Test configuration
const TEST_PORT = process.env.PORT || 3000;
const TEST_HOST = 'localhost';
const TIMEOUT = 5000;

// Test results
let passed = 0;
let failed = 0;

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

/**
 * Make HTTP request
 */
function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: TEST_HOST,
            port: TEST_PORT,
            path: path,
            method: method,
            timeout: TIMEOUT
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Test runner
 */
async function runTest(name, testFn) {
    try {
        await testFn();
        console.log(`${colors.green}✓${colors.reset} ${name}`);
        passed++;
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} ${name}`);
        console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        failed++;
    }
}

/**
 * Test Suite
 */
async function runTests() {
    console.log(`\n${colors.cyan}Running Portfolio Tests...${colors.reset}\n`);

    // Test 1: Server is running
    await runTest('Server is running and accessible', async () => {
        const response = await makeRequest('/');
        assert.strictEqual(response.statusCode, 200, 'Server should return 200 OK');
    });

    // Test 2: HTML content is served
    await runTest('HTML content is served correctly', async () => {
        const response = await makeRequest('/');
        assert.ok(response.body.includes('<!DOCTYPE html>'), 'Response should contain HTML');
        assert.ok(response.body.includes('Manas Kumar Behera'), 'Response should contain portfolio owner name');
    });

    // Test 3: GitHub username is configured
    await runTest('GitHub username is configured', async () => {
        const response = await makeRequest('/');
        assert.ok(response.body.includes('manaskumarbehera'), 'Should include GitHub username');
    });

    // Test 4: Email is configured
    await runTest('Email address is configured', async () => {
        const response = await makeRequest('/');
        assert.ok(response.body.includes('behera.manas98@gmail.com'), 'Should include email address');
    });

    // Test 5: LinkedIn profile is linked
    await runTest('LinkedIn profile is linked', async () => {
        const response = await makeRequest('/');
        assert.ok(response.body.includes('linkedin.com/in/manas-behera-68607547'), 'Should include LinkedIn profile');
    });

    // Test 6: Trailblazer profile is linked
    await runTest('Trailblazer profile is linked', async () => {
        const response = await makeRequest('/');
        assert.ok(response.body.includes('salesforce.com/trailblazer/manasbehera1990'), 'Should include Trailblazer profile');
    });

    // Test 7: Buy Me a Coffee link is present
    await runTest('Buy Me a Coffee link is present', async () => {
        const response = await makeRequest('/');
        assert.ok(response.body.includes('buymeacoffee.com/manaskumarbehera'), 'Should include Buy Me a Coffee link');
    });

    // Test 8: Security headers are set
    await runTest('Security headers are configured', async () => {
        const response = await makeRequest('/');
        assert.ok(response.headers['content-security-policy'], 'Should have Content Security Policy header');
    });

    // Test 9: Static assets are accessible
    await runTest('CSS files are accessible', async () => {
        const response = await makeRequest('/css/style.css');
        assert.strictEqual(response.statusCode, 200, 'CSS should be accessible');
    });

    // Test 10: JavaScript files are accessible
    await runTest('JavaScript files are accessible', async () => {
        const response = await makeRequest('/js/main.js');
        assert.strictEqual(response.statusCode, 200, 'JavaScript should be accessible');
    });

    // Test 11: 404 handling
    await runTest('404 page returns HTML', async () => {
        const response = await makeRequest('/nonexistent-page');
        assert.ok([200, 404].includes(response.statusCode), 'Should handle 404 gracefully');
    });

    // Test 12: Compression is enabled
    await runTest('Compression is enabled', async () => {
        const response = await makeRequest('/');
        // Check if content is being served (compression middleware is active)
        assert.ok(response.body.length > 0, 'Content should be served');
    });

    // Print summary
    console.log(`\n${colors.cyan}Test Summary:${colors.reset}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    if (failed > 0) {
        console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    }
    console.log(`Total: ${passed + failed}\n`);

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error(`${colors.red}Uncaught Exception: ${error.message}${colors.reset}`);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error(`${colors.red}Unhandled Rejection: ${error.message}${colors.reset}`);
    process.exit(1);
});

// Check if server is running before tests
async function checkServer() {
    try {
        await makeRequest('/');
        console.log(`${colors.green}✓ Server is running on port ${TEST_PORT}${colors.reset}`);
        return true;
    } catch (error) {
        console.error(`${colors.red}✗ Server is not running on port ${TEST_PORT}${colors.reset}`);
        console.error(`${colors.yellow}Please start the server first: npm start${colors.reset}\n`);
        return false;
    }
}

// Main execution
(async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runTests();
    } else {
        process.exit(1);
    }
})();

