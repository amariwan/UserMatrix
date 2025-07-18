/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@types/(.*)$": "<rootDir>/types/$1",
    "^@assets/(.*)$": "<rootDir>/assets/$1",
  },
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
};
