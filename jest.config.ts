/**
 * @jest-config-loader ts-node
 */
/** @type {import('jest').Config} */
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  roots: ["<rootDir>/src", "<rootDir>/test"],

  moduleFileExtensions: ["js", "ts", "json"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1",
    "^types/(.*)$": "<rootDir>/types/$1",
    "^assets/(.*)$": "<rootDir>/assets/$1",
  },

  transform: {
    "^.+\\.(ts|js)$": "babel-jest",
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/test-utils/**",
    "!src/config/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "text", "lcov"],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },

  setupFilesAfterEnv: [
    "<rootDir>/test/helpers/ioredis-mock.ts",
    "<rootDir>/test/helpers/teardown.ts",
  ],

  testMatch: ["**/test/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],

  verbose: true,
  watchPathIgnorePatterns: ["/node_modules/", "/coverage/"],
};

export default config;
