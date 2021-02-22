module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@/components(.*)$": "<rootDir>/src/components$1",
    "^@/contexts(.*)$": "<rootDir>/src/contexts$1",
    "^@/content$": "<rootDir>/src/lang/index.js",
    "^@/providers(.*)$": "<rootDir>/src/providers$1",
    "^@/models(.*)$": "<rootDir>/src/models$1",
    "^@/client-lib(.*)$": "<rootDir>/lib/client$1",
    "^@/server-lib(.*)$": "<rootDir>/lib/server$1",
    "^@/utils(.*)$": "<rootDir>/utils$1",
    "^@/pages(.*)$": "<rootDir>/pages$1",
  },
};