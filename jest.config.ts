import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@types/(.*)$": "<rootDir>/types/$1",
    "^@assets/(.*)$": "<rootDir>/assets/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/test-utils/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90,
    },
  },
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["./test/helpers/ioredis-mock.ts", "./test/helpers/teardown.ts"],
};

export default config;
