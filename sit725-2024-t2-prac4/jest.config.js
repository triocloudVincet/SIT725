export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/tests/**/*.js", "**/tests/**/*.test.js"],
  verbose: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/index.js"],
};
