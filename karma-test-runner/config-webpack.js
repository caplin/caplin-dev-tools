const { existsSync } = require("fs");
const { join } = require("path");

const { DefinePlugin } = require("webpack");

function createWebpackConfig(appDir) {
  const aliasesTestPath = join(appDir, "src/config/aliases-test.js");
  const webpackConfig = require(join(appDir, "webpack.config"))();

  if (existsSync(aliasesTestPath)) {
    webpackConfig.resolve.alias["$aliases-data$"] = aliasesTestPath;
  }

  // No `entry` as `karma-webpack` doesn't use it, it creates second redudant
  // chunk, slowing down build.
  delete webpackConfig.entry;

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

function addWebpackConf(karmaConf, webpackConf) {
  // Add `DefinePlugin` so test entry imports all package tests.
  const plugins = [
    ...webpackConf.plugins,
    new DefinePlugin({ PACKAGE_DIRECTORY: `"${karmaConf.basePath}"` })
  ];

  // Clone webpack conf to prevent interference between different test runs.
  webpackConf = Object.assign({}, webpackConf, { plugins });
  webpackConf = setAliasesPath(karmaConf.basePath, webpackConf);
  karmaConf.webpack = webpackConf;

  return karmaConf;
}

module.exports.addWebpackConf = addWebpackConf;
