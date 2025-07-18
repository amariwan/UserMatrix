import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/__tests__/**/*.spec.[tj]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@types/(.*)$": "<rootDir>/types/$1",
    "^@assets/(.*)$": "<rootDir>/assets/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/test/__mocks__/fileMock.ts",
  },
  collectCoverage: true || process.env.CI === "true",
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/**/test-utils/**",
    "!src/**/types/**",
    "!src/main.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 95,
      statements: 95,
    },
  },
  coverageDirectory: "<rootDir>/coverage",
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./coverage", outputName: "junit.xml" }],
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/helpers/ioredis-mock.ts",
    "<rootDir>/test/helpers/teardown.ts",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
      isolatedModules: true,
      diagnostics: false,
    },
  },
  verbose: true,
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
};

export default config;
