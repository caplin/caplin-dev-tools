const { existsSync } = require("fs");
const { basename, join } = require("path");
const { findAppPackages } = require("./search");
const { DefinePlugin } = require("webpack");
const { cloneDeep } = require("lodash");
const webPackFiles = {};

function createWebpackConfig(appDir, argv, packageName) {
  const aliasesTestPath = join(appDir, "src/config/aliases-test.js");
  // Prevents reloading resource for multiple app folders, which would cause crashing
  if (!webPackFiles[appDir]) {
    webPackFiles[appDir] = require(join(appDir, "webpack.config"))();
  }
  // Deepclone required as otherwise multiple runs will break everything as they modify the original object
  const webpackConfig = cloneDeep(webPackFiles[appDir]);
  const coverageReport = argv.c;
  const includeCrossPackageCoverage = argv.includeCrossPackageCoverage;

  if (existsSync(aliasesTestPath)) {
    webpackConfig.resolve.alias["$aliases-data$"] = aliasesTestPath;
  }

  // No `entry` as `karma-webpack` doesn't use it, it creates second redudant
  // chunk, slowing down build.
  delete webpackConfig.entry;

  if (coverageReport) {
    let packages = findAppPackages(appDir, argv);

    if (argv._.length > 0) {
      packages = packages.filter(dir => argv._.includes(basename(dir)));

      // Don't want to include src if packages are specified
    } else if (existsSync("./src")) {
      packages.push(join(appDir, "./src"));
    }

    if (!includeCrossPackageCoverage) {
      packages = packages.filter(dir => packageName === dir);
    }

    // Cleans up extra path slashes in Windows.
    packages = packages.map(packageName => join(packageName));

    webpackConfig.module.rules.push({
      test: /\.js$/,
      loader: "istanbul-instrumenter-loader",
      options: {
        esModules: true
      },
      include: packages,
      exclude: /(test)|node_modules.*node_modules/
    });
  }

  return webpackConfig;
}

function setAliasesPath(basePath, webpackConf) {
  // Set aliases-data to local version if one exists.
  const packageAliases = join(basePath, "aliases-test.js");

  // Bundle time is reduced if a package has its own smaller aliases file.
  if (existsSync(packageAliases)) {
    webpackConf.resolve = Object.assign({}, webpackConf.resolve);
    webpackConf.resolve.alias = Object.assign({}, webpackConf.resolve.alias);
    webpackConf.resolve.alias["$aliases-data$"] = packageAliases;
  }

  return webpackConf;
}

function addWebpackConf(karmaConf, appDir, argv) {
  let webpackConf = createWebpackConfig(appDir, argv, karmaConf.basePath);
  const definitions = {
    PACKAGE_DIRECTORY: `"${karmaConf.basePath}"`
  };

  // Add `DefinePlugin` so test entry imports all package tests.
  const plugins = [...webpackConf.plugins, new DefinePlugin(definitions)];

  // Clone webpack conf to prevent interference between different test runs.
  webpackConf = Object.assign({}, webpackConf, { plugins });
  webpackConf = setAliasesPath(karmaConf.basePath, webpackConf);
  karmaConf.webpack = webpackConf;

  return karmaConf;
}

module.exports.addWebpackConf = addWebpackConf;
