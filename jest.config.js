module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  setupFiles: ["<rootDir>/jest.polyfills.js", "<rootDir>/jest.setup.ts"],
  globalSetup: "<rootDir>/jest.beforeAll.ts",
  globalTeardown: "<rootDir>/jest.afterAll.ts",
  forceExit: true,
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/prisma/generated/prisma/client",
    "^@prisma/enums$": "<rootDir>/prisma/generated/prisma/enums.ts",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
}
