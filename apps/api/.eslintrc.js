/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@hackathon/eslint-config/nest.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
