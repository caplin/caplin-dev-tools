const { basename } = require("path");

const parseArgs = require("minimist");

const configureAliases = require("./aliases");
const configureBabelLoader = require("./babel");
const configureBuildDependentConfig = require("./build");
const { BASE_WEBPACK_CONFIG } = require("./config");
const configureDevtool = require("./devtool");
const configureBundleEntryPoint = require("./entry");
const configureI18nLoading = require("./i18n");
const configureOutput = require("./output");
const configureResolve = require("./resolve");
const configureServiceLoader = require("./service");

const { sourceMaps, variant } = parseArgs(process.argv.slice(2));
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
const isBuild = lifeCycleEvent === "build";
const testsScriptRunning = basename(process.argv[1]) === "tests.js";
const isTest = testsScriptRunning || lifeCycleEvent.startsWith("test");

module.exports.webpackConfigGenerator = function webpackConfigGenerator(
  {
    basePath,
    version = "dev",
    i18nFileName = `i18n-${version}.js`,
    uglifyOptions
  }
) {
  // Object.create won't work as webpack only uses enumerable own properties.
  const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

  configureOutput(webpackConfig, version, basePath);
  configureAliases(webpackConfig, basePath);
  configureResolve(webpackConfig, basePath);
  configureBundleEntryPoint(variant, webpackConfig, basePath);
  configureBabelLoader(webpackConfig, basePath);
  configureI18nLoading(webpackConfig, i18nFileName, isTest);
  configureServiceLoader(webpackConfig, isTest);
  configureDevtool(webpackConfig, sourceMaps);
  configureBuildDependentConfig(webpackConfig, version, uglifyOptions, isBuild);

  return webpackConfig;
};
