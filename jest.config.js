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
  // ★ ここを追加：react-markdown などの ESM パッケージを Jest にトランスフォームさせる
  transformIgnorePatterns: [
    "/node_modules/(?!react-markdown|vfile|unist-util-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|space-separated-tokens|comma-separated-tokens|hast-util-whitespace)",
  ],
};

module.exports = createJestConfig(customJestConfig);
