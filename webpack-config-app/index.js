const { basename, resolve } = require("path");

const parseArgs = require("minimist");

const configureAliases = require("./aliases");
const configureBabelLoader = require("./babel");
const configureBuildDependentConfig = require("./build");
const { BASE_WEBPACK_CONFIG } = require("./config");
const configureDevtool = require("./devtool");
const configureBundleEntryPoint = require("./entry");
const configureI18nLoading = require("./i18n");
const configureOutput = require("./output");
const configureHotReloading = require("./hot-reloading");
const configurePatches = require("./patches");

const { sourcemaps, variant, hot } = parseArgs(process.argv.slice(2));
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
// Check the name of the running script as well as the npm life cycle event as
// when debugging npm isn't used so there is no life cycle event set.
const buildScriptRunning = basename(process.argv[1]) === "build.js";
const testsScriptRunning = basename(process.argv[1]) === "tests.js";
const isBuild = buildScriptRunning || lifeCycleEvent === "build";
const isTest =
  testsScriptRunning ||
  lifeCycleEvent.startsWith("test") ||
  lifeCycleEvent === "karma-test-runner";

module.exports.webpackConfigGenerator = function webpackConfigGenerator({
  basePath,
  version = "dev",
  i18nFileName = `i18n-${version}.js`,
  patchesOptions,
}) {
  // Object.create won't work as webpack only uses enumerable own properties.
  const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

  configureBundleEntryPoint(variant, webpackConfig, basePath);
  configureHotReloading(webpackConfig, hot);
  configureOutput(webpackConfig, version, basePath);
  configureBabelLoader(webpackConfig, basePath);
  configureI18nLoading(webpackConfig, i18nFileName, isTest);
  configureAliases(webpackConfig, basePath);
  configureDevtool(webpackConfig, sourcemaps);
  configureBuildDependentConfig(webpackConfig, version, isBuild);
  configurePatches(webpackConfig, patchesOptions);

  // `file:` (npm 5) and `link:` (yarn) dependencies are symlinked to instead
  // of being copied into `node_modules`.
  //
  // Webpack follows the node algorithm for resolving packages; it resolves
  // required packages relative to the requiring module. It searches
  // for the required package inside `node_modules` directories all the way to
  // the root of the file system from the requiring module.
  //
  // So a module inside `packages-caplin` (that Webpack is parsing due to
  // following a symlink) that requires another package will fail to find it as
  // yarn would have installed it in the app's `node_modules`.
  //
  // Given that we must configure webpack to search for packages within
  // `node_modules`, and the application's `node_modules` folder.
  webpackConfig.resolve.modules = [
    "node_modules",
    resolve(basePath, "node_modules"),
  ];

  return webpackConfig;
};
