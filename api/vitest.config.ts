import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the API: Node environment, colocated tests and a v8 coverage report.
 * This file sits outside `rootDir`, so it is linted but not type-checked (plan §1.5).
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "**/*.d.ts", "src/scripts/**", "src/server.ts"]
    }
  }
});
