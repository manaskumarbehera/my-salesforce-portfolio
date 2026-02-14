{
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js", "**/*.test.js"],
  "collectCoverageFrom": [
    "test/**/*.js",
    "!test/**/*.test.js",
    "!node_modules/**"
  ],
  "testTimeout": 30000,
  "verbose": true,
  "coverageDirectory": "coverage",
  "collectCoverage": false
}

