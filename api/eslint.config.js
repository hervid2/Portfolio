// ESLint flat config for the API (spec 000, plan §1.2).
// Order matters: presets first, then eslint-config-prettier, then the project rules,
// so that `max-len` stays on after Prettier's offs (CL-11).
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/**", "coverage/**", "**/*.tsbuildinfo"]
  },
  {
    linterOptions: { reportUnusedDisableDirectives: "error" }
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: { jsdoc },
    rules: {
      "max-len": [
        "error",
        // Single-specifier imports cannot be wrapped by Prettier (coordinator decision, T-19).
        { code: 100, tabWidth: 2, ignoreUrls: true, ignorePattern: "^\\s*import\\s" }
      ],
      "max-lines-per-function": ["error", { max: 40, skipBlankLines: true, skipComments: true }],
      "no-console": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false
          },
          contexts: [
            "VariableDeclarator > ArrowFunctionExpression",
            "VariableDeclarator > FunctionExpression"
          ],
          checkConstructors: false,
          publicOnly: false
        }
      ],
      "jsdoc/require-param": ["error", { checkDestructured: false }],
      "jsdoc/require-returns": "error"
    }
  },
  {
    // Test relaxations (CL-13).
    files: ["**/*.test.ts", "src/test/**"],
    rules: {
      "max-lines-per-function": "off",
      "jsdoc/require-jsdoc": "off"
    }
  },
  {
    // Diagnostic scripts print to the terminal on purpose (CL-13).
    files: ["src/scripts/**"],
    rules: {
      "no-console": "off"
    }
  }
);
