// CI/CD Test Setup
// This file is loaded before all tests in CI environment

import { join } from "path";
import { config } from "dotenv";

// Load environment variables for CI
config({ path: join(process.cwd(), "..", "..", ".env") });

// Set test timeout globally for CI
jest.setTimeout(30000);

// Global test setup for CI environment
beforeAll(async () => {
  // Ensure we're in test environment
  process.env.NODE_ENV = "test";

  // Wait a bit for database to be ready
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Global cleanup after all tests
afterAll(async () => {
  // Give time for cleanup operations
  await new Promise((resolve) => setTimeout(resolve, 500));
});


