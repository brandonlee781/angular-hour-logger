module.exports = {
  "preset": "jest-preset-angular",
  "setupTestFrameworkScriptFile": "<rootDir>/src/setupJest.ts",
  "testMatch": [
    "**/__tests__/**/*.+(ts|js)?(x)",
    "**/+(*.)+(spec|test).+(ts|js)?(x)"
  ],
  "moduleNameMapper": {
    "^assets/(.*)": "<rootDir>/src/assets/$1",
    "^modules/(.*)": "<rootDir>/src/app/modules/$1",
    "^shared/(.*)": "<rootDir>/src/app/shared/$1",
    "^core/(.*)": "<rootDir>/src/app/core/$1"
  }
}