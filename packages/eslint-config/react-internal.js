const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parserOptions: {
    project,
  },
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
};
