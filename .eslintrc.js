module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "prefer-destructuring": ["error", { object: true, array: false }],

    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
