const { readdirSync } = require("fs");
const { join } = require("path");

const localPathPrefix = /^(link|file):/;

// Returns an Array<String> of local path packages directories.
function getDependenciesDirs(dependencies = {}, packagePath) {
  return (
    Object.values(dependencies)
      // To allow stripping of packages in client builds we surround the
      // optional package with a comment dependency e.g. `"//":["orders"]` and
      // `"//":["endorders"]` so we must filter these arrays out.
      .filter(name => Array.isArray(name) === false)
      // Only include local path dependencies.
      .filter(name => name.match(localPathPrefix))
      // Strip local path prefix in dependency path.
      .map(name => name.replace(localPathPrefix, ""))
      // Remove any trailing slashes.
      .map(name => name.replace(/\/$/, ""))
      .map(name => join(packagePath, name))
  );
}

function dependencySearch(packageToSpider, packagesFoundSoFar) {
  const { dependencies } = require(join(packageToSpider, "package.json"));
  const dependenciesDirs = getDependenciesDirs(dependencies, packageToSpider);

  for (const directory of dependenciesDirs) {
    if (packagesFoundSoFar.has(directory) === false) {
      packagesFoundSoFar.add(directory);
      dependencySearch(directory, packagesFoundSoFar);
    }
  }
}

const foundPackages = new Set();

dependencySearch(process.cwd(), foundPackages);

module.exports = foundPackages;

// Return a Set of packages directories for all the packages an application uses
// and also include all br/ct packages regardless of if they are used or not.
module.exports.packagesIncludingSDKOnes = function() {
  const brCTPackagesToAdd = new Set();
  const packagesCaplinPath = join(process.cwd(), "../../packages-caplin");
  const allPackages = readdirSync(packagesCaplinPath);

  for (const packageName of allPackages) {
    // Also match `br`/`ct` stand alone in case their use is removed.
    if (packageName.match(/^(br|ct)(-|$)/)) {
      const packagePath = join(packagesCaplinPath, packageName);

      if (foundPackages.has(packagePath) === false) {
        brCTPackagesToAdd.add(packagePath);
        dependencySearch(packagePath, brCTPackagesToAdd);
      }
    }
  }

  return new Set([...foundPackages, ...brCTPackagesToAdd]);
};
