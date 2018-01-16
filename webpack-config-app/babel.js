const { existsSync, readdirSync, readFileSync } = require("fs");
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

function createBabelLoaderOptions(basePath) {
  const babelLoaderQuery = {
    cacheDirectory: true
  };
  const babelRC = JSON.parse(readFileSync(join(basePath, ".babelrc"), "utf8"));

  if (babelRC.presets) {
    babelLoaderQuery.presets = babelRC.presets.map(preset => {
      // Presets can be of type string|[string, {}] to allow configuring presets
      // https://babeljs.io/docs/plugins/#plugin-preset-options
      if (Array.isArray(preset)) {
        // Include the preset configuration `preset[1]` in returned value.
        return [require.resolve(`babel-preset-${preset[0]}`), preset[1]];
      }

      return require.resolve(`babel-preset-${preset}`);
    });
  }

  if (babelRC.plugins) {
    babelLoaderQuery.plugins = babelRC.plugins.map(plugin =>
      require.resolve(`babel-plugin-${plugin}`)
    );
  }

  return babelLoaderQuery;
}

module.exports = function configureBabelLoader(webpackConfig, basePath) {
  const babelModulesRule = {
    test: /\.jsx?$/,
    loader: "babel-loader",
    include: createIncludeFunction(basePath),
    options: createBabelLoaderOptions(basePath)
  };

  // Babel loader must be first for source maps to be shown in ES6
  // See https://github.com/webpack-contrib/transform-loader/issues/9
  webpackConfig.module.rules.unshift(babelModulesRule);
};
