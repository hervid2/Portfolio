// ESLint flat config for the frontend (spec 000, plan §1.2).
// Order matters: presets first, then eslint-config-prettier, then the project rules,
// so that `max-len` stays on after Prettier's offs (CL-11).
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// Single-specifier imports cannot be wrapped by Prettier (coordinator decision, T-19 / T-32).
const maxLenBase = {
  code: 100,
  tabWidth: 2,
  ignoreUrls: true,
  ignorePattern: "^\\s*import\\s"
};

export default defineConfig(
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "**/*.tsbuildinfo",
      "vite.config.js",
      "vite.config.d.ts",
      "tailwind.config.js",
      "tailwind.config.d.ts"
    ]
  },
  {
    linterOptions: { reportUnusedDisableDirectives: "error" }
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: { jsdoc, "react-hooks": reactHooks },
    rules: {
      "max-len": ["error", maxLenBase],
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
      "jsdoc/require-returns": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error"
    }
  },
  {
    // Long copy lives in dictionaries and data files (ASM-000-01).
    files: ["src/i18n/**", "src/data/**"],
    rules: {
      "max-len": ["error", { ...maxLenBase, ignoreStrings: true, ignoreTemplateLiterals: true }]
    }
  },
  {
    // Test relaxations (CL-13).
    files: ["**/*.test.{ts,tsx}", "src/test/**"],
    rules: {
      "max-lines-per-function": "off",
      "jsdoc/require-jsdoc": "off"
    }
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "writable" }
    }
  }
);
