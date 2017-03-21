const { join } = require("path");

const { readFileSync, writeFileSync } = require("fs-extra");
const yaml = require("js-yaml");

const { compiledBRLibPackageJSONTemplate } = require("./converter-data");
const { createNamespaceDirectoriesIfMissing } = require("./converter-utils");

// Some BR libs don't have directories for their namespaces. They put all their
// code in the `src` directory directly. Webpack can't load these packages, so
// we need to create the namespaced directories. This function returns the
// namespace directory.
function getNamespacedLibSrcDirName(packageDir) {
  const brLibFileName = join(packageDir, "br-lib.conf");
  const brLibYAML = yaml.safeLoad(readFileSync(brLibFileName, "utf8"));

  return join(packageDir, "src", brLibYAML.requirePrefix);
}

function createBRLibPackageJSON(
  packageDirectory,
  packageName,
  createPackageJSON
) {
  if (createPackageJSON) {
    const brLibPackageJSON = compiledBRLibPackageJSONTemplate({ packageName });

    writeFileSync(join(packageDirectory, "package.json"), brLibPackageJSON);
  }
}

module.exports.createBRLibPackageJSON = createBRLibPackageJSON;

// Given a BR lib with a `br-lib.conf` and a `src` directory make sure the lib
// has a complete namespaced directory structure.
module.exports.convertBRLibToPackage = function convertBRLibToPackage(
  packageDirectory,
  packageName,
  createPackageJSON
) {
  const namespacedLibSrcDir = getNamespacedLibSrcDirName(
    packageDirectory,
    packageName
  );

  createBRLibPackageJSON(packageDirectory, packageName, createPackageJSON);

  return createNamespaceDirectoriesIfMissing(
    namespacedLibSrcDir,
    packageDirectory
  );
};

// Given a BR lib that lacks a `br-lib.conf` make sure the lib has a complete
// namespaced directory.
module.exports.convertLibToPackage = function convertLibToPackage(
  packageDirectory,
  packageName,
  createPackageJSON
) {
  // The namespace is the package name if one isn't specified in `br-lib.conf`.
  const namespacedLibSrcDir = join(packageDirectory, "src", packageName);

  createBRLibPackageJSON(packageDirectory, packageName, createPackageJSON);

  return createNamespaceDirectoriesIfMissing(
    namespacedLibSrcDir,
    packageDirectory
  );
};
