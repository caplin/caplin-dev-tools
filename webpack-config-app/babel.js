const { existsSync, readdirSync } = require("fs");
const { join, sep } = require("path");

// Windows uses `\` as directory separator, in a string `\` will act as an
// escape character so to represent `\` in a string literal you must write `\\`
// which will be converted to `\` when printing/viewing the value in a debugger.
// As `\` acts as an escape character in RegExps too when creating RegExps from
// strings `\` must be escaped twice. Once for the string value and again for
// the RegExp value, so `\\\\` is the string `\\` and the RegExp `\`.
const dirSep = sep === "\\" ? "\\\\" : sep;
// Find a `node_modules` that is not followed by any further `node_modules` (in
// other words the last `node_modules` in a string), and extract the path part
// following it (should be name of imported package).
const nodeModulesName = `node_modules(?!.*node_modules)${dirSep}(.*?)${dirSep}`;
const nodeModulesNameRegExp = new RegExp(nodeModulesName);
// Find a `packages-caplin` or `packages` and extract the path part following it
// (should be name of imported local package).
const pckNameRE = `(?:packages-caplin|packages)${dirSep}(.*?)${dirSep}`;
const pckNameRegExp = new RegExp(pckNameRE);

// Return an array of all the local packages/ones that are installed from the
// packages-caplin/packages directories.
function findAllLocalPackages(basePath) {
  const allPackages = [];
  const caplinPackagesDir = join(basePath, "../../packages-caplin");
  const clientPackagesDir = join(basePath, "../../packages");

  if (existsSync(clientPackagesDir)) {
    allPackages.push(...readdirSync(clientPackagesDir));
  }

  if (existsSync(caplinPackagesDir)) {
    // Filter out the thirdparty packages from the `packages-caplin` list as we
    // don't want to compile those.
    const caplinPackages = readdirSync(caplinPackagesDir).filter(pckName => {
      const convLib = join(caplinPackagesDir, pckName, "converted_library.js");

      return existsSync(convLib) === false;
    });

    allPackages.push(...caplinPackages);
  }

  return allPackages;
}

function extractPackageNameFromPath(sourcePath) {
  const nodeModulesMatch = sourcePath.match(nodeModulesNameRegExp);

  // Code that has been installed inside `node_modules`.
  if (nodeModulesMatch !== null) {
    return nodeModulesMatch[1];
  }

  const packagesMatch = sourcePath.match(pckNameRegExp);

  // Code that has been linked to e.g. "...packages-caplin/ct-grid/GridView.js"
  if (packagesMatch !== null) {
    return packagesMatch[1];
  }
}

function createIncludeFunction(basePath) {
  const allPackages = findAllLocalPackages(basePath);
  const applicationSrcPath = `${basePath}${sep}src`;
  const isSourceFile = new RegExp(/\.jsx?$/);

  return function includeFunction(sourcePath) {
    if (isSourceFile.test(sourcePath)) {
      if (sourcePath.startsWith(applicationSrcPath)) {
        return true;
      }

      const packageName = extractPackageNameFromPath(sourcePath);

      return allPackages.includes(packageName);
    }
  };
}

module.exports = function configureBabelLoader(webpackConfig, basePath) {
  const babelModulesRule = {
    test: createIncludeFunction(basePath),
    use: {
      loader: "babel-loader",
      options: {
        cacheDirectory: true
      }
    }
  };

  // Babel loader must be first for source maps to be shown in ES6
  // See https://github.com/webpack-contrib/transform-loader/issues/9
  webpackConfig.module.rules.unshift(babelModulesRule);
};
