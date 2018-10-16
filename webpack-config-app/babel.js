const { existsSync, readdirSync } = require("fs");
const { join, sep } = require("path");

const dirSep = sep === "\\" ? "\\\\" : sep;
// Find a `node_modules` that is not followed by any further `node_modules`,
// and extract the path part following it (should be name of imported package).
const pckNameRE = `node_modules(?!.*node_modules)${dirSep}(.*?)${dirSep}`;
const pckNameRegExp = new RegExp(pckNameRE);

function findCaplinPackagesDir(basePath) {
  // Once mobile and REX are moved into the main `apps` folder this can be
  // deleted.
  if (existsSync(join(basePath, "../../packages-caplin"))) {
    return join(basePath, "../../packages-caplin");
  }

  return join(basePath, "../../../packages-caplin");
}

function findAllPackages(basePath) {
  const caplinPackagesDir = findCaplinPackagesDir(basePath);
  const clientPackagesDir = join(basePath, "../../packages");
  const allPackages = [];

  if (existsSync(clientPackagesDir)) {
    allPackages.push(...readdirSync(clientPackagesDir));
  }

  if (existsSync(caplinPackagesDir)) {
    const caplinPackages = readdirSync(caplinPackagesDir).filter(pckName => {
      const convLib = join(caplinPackagesDir, pckName, "converted_library.js");

      return existsSync(convLib) === false;
    });

    allPackages.push(...caplinPackages);
  }

  return allPackages;
}

function createIncludeFunction(basePath) {
  const allPackages = findAllPackages(basePath);

  return function includeFunction(sourcePath) {
    const nodeModulesMatch = sourcePath.match(pckNameRegExp);

    if (nodeModulesMatch === null) {
      // If the file isn't in `node_modules` it's either a source file from
      // `basePath` (e.g. app's `src` folder) or a file inside a symlinked
      // development package (using Yarn's `link:` feature`).
      return true;
    }

    const packageName = nodeModulesMatch[1];

    return allPackages.includes(packageName);
  };
}

module.exports = function configureBabelLoader(webpackConfig, basePath) {
  const babelModulesRule = {
    test: /\.jsx?$/,
    // exclude: /(node_modules|bower_components)/,
    // include: createIncludeFunction(basePath),
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
