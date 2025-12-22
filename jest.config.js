const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.pre.js", ...(expoPreset.setupFiles || [])],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", ...(expoPreset.setupFilesAfterEnv || [])],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/", "/web/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/*.d.ts",
    "!src/**/styles.{ts,tsx}",
    "!src/**/style.{ts,tsx}",
    "!src/shared/theme.ts"
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/android/", "/ios/", "/web/"],
  coverageThreshold: {
    global: {
      functions: 100
    }
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};
