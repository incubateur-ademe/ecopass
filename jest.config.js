module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  globalSetup: "<rootDir>/jest.beforeAll.ts",
  globalTeardown: "<rootDir>/jest.afterAll.ts",
  forceExit: true,
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/prisma/generated/prisma/client",
    "^@prisma/enums$": "<rootDir>/prisma/generated/prisma/enums.ts",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
}
