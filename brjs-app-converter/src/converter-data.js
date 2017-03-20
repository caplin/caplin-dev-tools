const { join } = require("path");

const { readFileSync } = require("fs-extra");
const template = require("lodash/string/template");

export const templateDir = join(__dirname, "..", "templates");

const brPkgPackageJSONTemplate = readFileSync(
  join(templateDir, "_brpkg-package.json")
);
const thirdpartyPackageJSONTemplate = readFileSync(
  join(templateDir, "_thirdparty-package.json")
);

export const compiledBRLibPackageJSONTemplate = template(
  brPkgPackageJSONTemplate
);
export const compiledThirdpartyJSONTemplate = template(
  thirdpartyPackageJSONTemplate
);
