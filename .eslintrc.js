const baseRules = require("eslint-config-airbnb-base/rules/style");

const [_, ...restricted] = baseRules.rules["no-restricted-syntax"];

module.exports = {
  extends: ["airbnb", "prettier"],
  rules: {
    // Let's allow for..in https://github.com/airbnb/javascript/issues/1122
    "no-restricted-syntax": [
      2,
      ...restricted.filter(r => r !== "ForOfStatement")
    ]
  }
};
