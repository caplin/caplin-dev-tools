module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  rules: {
    "import/no-unresolved": [2, { commonjs: true }],
    "import/unambiguous": 0
  }
};
