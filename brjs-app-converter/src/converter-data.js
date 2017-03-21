const { join } = require("path");

const { readFileSync } = require("fs-extra");
const template = require("lodash/string/template");

const templateDir = join(__dirname, "..", "templates");

module.exports.templateDir = templateDir;

const brPkgPackageJSONTemplate = readFileSync(
  join(templateDir, "_brpkg-package.json")
);
const thirdpartyPackageJSONTemplate = readFileSync(
  join(templateDir, "_thirdparty-package.json")
);

module.exports.compiledBRLibPackageJSONTemplate = template(
  brPkgPackageJSONTemplate
);
module.exports.compiledThirdpartyJSONTemplate = template(
  thirdpartyPackageJSONTemplate
);
