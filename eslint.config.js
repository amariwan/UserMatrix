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
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/return-await": "error",
      "no-magic-numbers": ["warn", { ignoreArrayIndexes: true, ignore: [0, 1, -1] }],
      "import/no-default-export": "warn",
      "import/no-cycle": "warn",
      "no-restricted-imports": ["warn", { patterns: ["src/*"] }],
      "prefer-arrow-callback": "warn",
      "no-unused-expressions": "error",
      "no-warning-comments": ["warn", { terms: ["todo", "fixme"], location: "anywhere" }],
      "no-debugger": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "object"],
          pathGroups: [
            {
              pattern: "@/config/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/constants/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/types/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/graphql/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/utils/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/services/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/middlewares/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/routes/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/test/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/assets/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // General rules
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
