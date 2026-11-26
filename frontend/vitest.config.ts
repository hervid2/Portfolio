import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

/**
 * Creates the Vitest configuration by extending the Vite config, so the `@` alias is shared.
 *
 * @returns Vitest configuration object.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      restoreMocks: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        reportsDirectory: "./coverage",
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "**/*.d.ts", "src/main.tsx"]
      }
    }
  })
);
