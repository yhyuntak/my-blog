module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Add custom rules here
    },
  },
  {
    ignores: ["node_modules/", "dist/"],
  },
];
