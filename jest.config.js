module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
}
