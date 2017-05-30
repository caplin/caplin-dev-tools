const { existsSync, readdirSync, readFileSync } = require("fs");
const { join, sep } = require("path");

function isPackageToBeExcludedFromBabelCompilation(packagesDir, packageDir) {
  // The new HTML/XML services are written in ES2015.
  if (packageDir === "ct-services" || packageDir === "br-services") {
    return false;
  }

  // BR/CT libs have no ES2015+.
  if (packageDir.startsWith("br-") || packagesDir.startsWith("ct-")) {
    return true;
  }

  // Thirdparty library.
  if (existsSync(join(packagesDir, `${packageDir}/converted_library.js`))) {
    return true;
  }

  return false;
}

function createBabelLoaderExcludeList(basePath) {
  const babelLoaderExclude = [/KeyMasterHack.js/];
  const dirSep = sep === "\\" ? "\\\\" : sep;
  // Exclude `babel-polyfill`, IE11 issues,
  // https://github.com/zloirock/core-js/issues/189
  const packagesToExclude = ["babel-polyfill"];
  const packagesDir = join(basePath, "../../packages-caplin");
  const legacyPackagesDir = join(basePath, "../../packages");
  const legacyPackagesCaplinDir = join(basePath, "../../../packages-caplin");
  const rootExclusionDirs = "(node_modules|packages|packages-caplin)";

  // Legacy `packages` path.
  if (existsSync(legacyPackagesDir)) {
    for (const packageDir of readdirSync(legacyPackagesDir)) {
      if (
        isPackageToBeExcludedFromBabelCompilation(legacyPackagesDir, packageDir)
      ) {
        packagesToExclude.push(packageDir);
      }
    }
  }

  // Legacy `packages-caplin` path.
  if (existsSync(legacyPackagesCaplinDir)) {
    for (const packageDir of readdirSync(legacyPackagesCaplinDir)) {
      if (
        isPackageToBeExcludedFromBabelCompilation(
          legacyPackagesCaplinDir,
          packageDir
        )
      ) {
        packagesToExclude.push(packageDir);
      }
    }
  }

  if (existsSync(packagesDir)) {
    for (const packageDir of readdirSync(packagesDir)) {
      if (isPackageToBeExcludedFromBabelCompilation(packagesDir, packageDir)) {
        packagesToExclude.push(packageDir);
      }
    }
  }

  const packagesToExcludeGroup = `(${packagesToExclude.join("|")})`;
  const packagesToExcludeRegExpString = [
    rootExclusionDirs,
    dirSep,
    packagesToExcludeGroup,
    dirSep
  ].join("");

  babelLoaderExclude.push(new RegExp(packagesToExcludeRegExpString));

  return babelLoaderExclude;
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

  if (babelLoaderQuery.plugins) {
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
    exclude: createBabelLoaderExcludeList(basePath),
    options: createBabelLoaderOptions(basePath)
  };

  // Babel loader must be first for source maps to be shown in ES6
  // See https://github.com/webpack-contrib/transform-loader/issues/9
  webpackConfig.module.rules.unshift(babelModulesRule);
};
