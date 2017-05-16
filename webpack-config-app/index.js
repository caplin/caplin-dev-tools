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

const { sourceMaps, variant } = parseArgs(process.argv.slice(2));
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
// Check the name of the running script as well as the npm life cycle event as
// when debugging npm isn't used so there is no life cycle event set.
const buildScriptRunning = basename(process.argv[1]) === "build.js";
const testsScriptRunning = basename(process.argv[1]) === "tests.js";
const isBuild = buildScriptRunning || lifeCycleEvent === "build";
const isTest = testsScriptRunning || lifeCycleEvent.startsWith("test");

module.exports.webpackConfigGenerator = function webpackConfigGenerator({
  basePath,
  version = "dev",
  i18nFileName = `i18n-${version}.js`,
  uglifyOptions
}) {
  // Object.create won't work as webpack only uses enumerable own properties.
  const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

  configureBundleEntryPoint(variant, webpackConfig, basePath);
  configureOutput(webpackConfig, version, basePath);
  configureBabelLoader(webpackConfig, basePath);
  configureI18nLoading(webpackConfig, i18nFileName, isTest);
  configureAliases(webpackConfig, basePath);
  configureDevtool(webpackConfig, sourceMaps);
  configureBuildDependentConfig(webpackConfig, version, uglifyOptions, isBuild);

  return webpackConfig;
};
