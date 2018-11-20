const { existsSync, readdirSync, statSync } = require("fs");
const { basename, join } = require("path");

const IS_WIN = /^win/.test(process.platform);

// FIND PACKAGE DIRS TO TEST. Depth first `package.json` `dependencies` search.

function getDependenciesDirs(dependencies = {}, packageDirectory, appDir) {
  return (
    Object.values(dependencies)
      // To allow stripping of packages in client builds we surround the
      // targetted package with a comment dependency e.g. `"//":["orders"]` and
      // `"//":["endorders"]` so we must filter these arrays out.
      .filter(name => Array.isArray(name) === false)
      .filter(name => name.startsWith("link:") || name.startsWith("file:"))
      .map(name => name.replace("link:", "").replace("file:", ""))
      // Once we move to npm 5 (https://github.com/npm/npm/issues/16788 is
      // blocking) we can change this to `join(packageDirectory, name)`.
      .map(name => join(appDir, "node_modules", basename(name)))
  );
}

// `appDir` is a workaround that can be removed once npm 5 works correctly.
// What `appDir` does is change the packages Karma `basePath` directory to be
// inside `node_modules` as opposed to the `packages-caplin` location of a
// package.
//
// Ideally we'd want tests to run from `packages-caplin` as that's the location
// of the source. All an install with npm 4 does is copy that code into
// `node_modules`. There are then two locations for the test package code. One
// in `node_modules` and one in `packages-caplin` and other packages inside
// `node_modules` when referring to the package under test will get their code
// from `node_modules` while relative imports from the package under test will
// get theirs from `packages-caplin`.
//
// This is OK (apart from larger bundles) as long as the tests don't execute any
// `instanceof` checks which will fail. As we have tests like that we need to
// change the `basePath` location for the Karma tests to be in `node_modules`.
//
// With npm 5 the copying of relative packages stops and it uses symlinks
// instead, this should fix these issues as all requires will resolve to the
// same files.
function dependencySearch(pkgToSearch, foundPkgs, appDir = pkgToSearch) {
  const pkgJSON = require(join(pkgToSearch, "package.json"));
  const deps = getDependenciesDirs(pkgJSON.dependencies, pkgToSearch, appDir);
  const newDeps = deps.filter(name => !foundPkgs.includes(name));
  console.log("dependencies", pkgJSON.dependencies);
  console.log("foundPkgs", foundPkgs);
  foundPkgs.push(...newDeps);
  newDeps.forEach(name => {
    dependencySearch(name, foundPkgs, appDir);
  });
}

// Escape backslashes in Win paths.
function escSep(packageDirectory) {
  return IS_WIN ? packageDirectory.replace(/\\/g, "\\\\") : packageDirectory;
}

function getAppPackages(appDir) {
  const appSrc = join(appDir, "src");

  // The ct-sdk app exists only to run tests so doesn't have a `src` directory.
  if (existsSync(appSrc)) {
    return readdirSync(appSrc)
      .map(name => join(appSrc, name))
      .filter(name => statSync(name).isDirectory());
  }

  return [];
}

function findAppPackages(appDir) {
  const appPackagesDirs = getAppPackages(appDir);
  const foundPackages = [];

  dependencySearch(appDir, foundPackages);

  const escapedAppPackages = foundPackages.concat(appPackagesDirs).map(escSep);
  console.log("escaped app packages", escapedAppPackages);
  return escapedAppPackages;
}

module.exports.findAppPackages = findAppPackages;
