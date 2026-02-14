module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    '*.js',
    'test/**/*.js',
    '!test/**/*.test.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/js/bootstrap.*',
    '/css/'
  ],
  testTimeout: 30000,
  verbose: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverage: false
};

