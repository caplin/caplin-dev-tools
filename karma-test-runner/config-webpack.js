const { existsSync } = require("fs");
const { join } = require("path");
const { basename } = require("path");
const { findAppPackages } = require("./search");
const { DefinePlugin } = require("webpack");

function createWebpackConfig(appDir, argv) {
  const aliasesTestPath = join(appDir, "src/config/aliases-test.js");
  const webpackConfig = require(join(appDir, "webpack.config"))();
  const coverageReport = argv.c;

  if (existsSync(aliasesTestPath)) {
    webpackConfig.resolve.alias["$aliases-data$"] = aliasesTestPath;
  }

  // No `entry` as `karma-webpack` doesn't use it, it creates second redudant
  // chunk, slowing down build.
  delete webpackConfig.entry;

  if (coverageReport) {
    const packages = findAppPackages(appDir);

    let caplinPackages = [];
    if (argv._.length > 0) {
      caplinPackages = packages.filter(dir => argv._.includes(basename(dir)));
    }
    caplinPackages.push(join(appDir, "./src"));

    webpackConfig.module.rules.push({
      test: /\.js$/,
      loader: "istanbul-instrumenter-loader",
      options: {
        esModules: true
      },
      include: caplinPackages,
      exclude: /(test)/
    });
  }

  return webpackConfig;
}

module.exports.createWebpackConfig = createWebpackConfig;

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

function addWebpackConf(karmaConf, webpackConf, argv) {
  const definitions = {
    CODE_COVERAGE_REQUESTED: false,
    PACKAGE_DIRECTORY: `"${karmaConf.basePath}"`
  };

  if (argv.c) {
    definitions.CODE_COVERAGE_REQUESTED = true;
  }

  // Add `DefinePlugin` so test entry imports all package tests.
  const plugins = [...webpackConf.plugins, new DefinePlugin(definitions)];

  // Clone webpack conf to prevent interference between different test runs.
  webpackConf = Object.assign({}, webpackConf, { plugins });
  webpackConf = setAliasesPath(karmaConf.basePath, webpackConf);
  karmaConf.webpack = webpackConf;

  return karmaConf;
}

module.exports.addWebpackConf = addWebpackConf;
