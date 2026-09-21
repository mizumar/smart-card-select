// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = async () => {
  const makeConfig = createJestConfig(customJestConfig);
  const config = await makeConfig();

  // Pure ESM パッケージを Transform（Babel/SWCによる変換）対象に含める
  config.transformIgnorePatterns = [
    "/node_modules/(?!(react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-.*|space-separated-tokens|comma-separated-tokens|estree-util-.*|trim-lines|devlop|html-url-attributes|html-.*|ccount|markdown-table|escape-string-regexp)/)",
  ];

  return config;
};
