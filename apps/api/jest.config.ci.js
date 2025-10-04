const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  // CI-specific configuration
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ci.ts"],
  testTimeout: 30000, // Increased timeout for CI environment
  maxWorkers: 1, // Force single worker to avoid database conflicts
  runInBand: true, // Sequential execution
  forceExit: true, // Force exit after tests complete
  detectOpenHandles: false, // Disable for faster CI runs
  collectCoverage: true,
  coverageDirectory: "../coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};


