import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettierConfig from "eslint-config-prettier";

export default [
  // Ignored files/folders
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/types/graphql.ts",
      "**/__tests__/**",
      "**/node_modules/**",
      "**/prisma/**",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": typescriptPlugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      // Prettier integration
      ...prettierConfig.rules,

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/promise-function-async": "off",

      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // General rules
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
