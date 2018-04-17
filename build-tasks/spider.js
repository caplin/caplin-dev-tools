const { join } = require("path");

function getDependenciesDirs(dependencies = {}, packagePath) {
  return (
    Object.values(dependencies)
      // To allow stripping of packages in client builds we surround the
      // targetted package with a comment dependency e.g. `"//":["orders"]` and
      // `"//":["endorders"]` so we must filter these arrays out.
      .filter(name => Array.isArray(name) === false)
      .filter(name => name.startsWith("link:") || name.startsWith("file:"))
      .map(name => name.replace("link:", "").replace("file:", ""))
      .map(name => join(packagePath, name))
  );
}

function dependencySearch(packageToSpider, foundPkgs) {
  const { dependencies } = require(join(packageToSpider, "package.json"));
  const depsDirs = getDependenciesDirs(dependencies, packageToSpider);
  const newDeps = depsDirs.filter(name => !foundPkgs.includes(name));

  foundPkgs.push(...newDeps);
  newDeps.forEach(name => dependencySearch(name, foundPkgs));
}

const foundPackages = [];

dependencySearch(process.cwd(), foundPackages);

module.exports = foundPackages;
