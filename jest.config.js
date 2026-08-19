const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Next.js アプリのパスを指定して next.config.js と .env を読み込ませる
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Path alias (tsconfig.json で @/ を設定している場合)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
