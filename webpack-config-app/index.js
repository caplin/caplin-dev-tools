const {
  basename,
  join
} = require("path");

const parseArgs = require("minimist");

const configureBabelLoader = require("./babel");
const configureBuildDependentConfig = require("./build");
const { BASE_WEBPACK_CONFIG, STATIC_DIR } = require("./config");
const configureDevtool = require("./devtool");
const configureBundleEntryPoint = require("./entry");
const configureI18nLoading = require("./i18n");
const configureOutput = require("./output");
const configureServiceLoader = require("./service");

const {
  sourceMaps,
  variant
} = parseArgs(process.argv.slice(2));
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
const isBuild = lifeCycleEvent === "build";
const isTest = basename(process.argv[1]) === "tests.js" ||
  lifeCycleEvent.startsWith("test");

module.exports.webpackConfigGenerator = function webpackConfigGenerator(
  {
    basePath,
    version = "dev",
    i18nFileName = `i18n-${version}.js`,
    uglifyOptions
  }
) {
  const configDir = join(basePath, "src", "config");
  // Object.create won't work as webpack only uses enumerable own properties.
  const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

  configureOutput(webpackConfig, version, basePath);

  // `AliasRegistry` requires `alias!$aliases-data` loaded with `alias-loader`.
  webpackConfig.resolve.alias["$aliases-data$"] = join(configDir, "aliases.js");
  // `BRAppMetaService` requires `app-meta!$app-metadata` loaded with
  // `app-meta-loader`.
  webpackConfig.resolve.alias["$app-metadata$"] = join(
    configDir,
    "metadata.js"
  );

  // Module requires are resolved relative to the resource that is requiring
  // them. When symlinking during development modules will not be resolved
  // unless we specify their parent directory.
  webpackConfig.resolve.root = join(basePath, "node_modules");

  // Loaders are resolved relative to the resource they are applied to. So
  // when symlinking packages during development loaders will not be
  // resolved unless we specify the directory that contains the loaders.
  webpackConfig.resolveLoader.root = join(basePath, "node_modules");

  configureBundleEntryPoint(variant, webpackConfig, basePath);
  configureBabelLoader(webpackConfig, basePath);
  configureI18nLoading(webpackConfig, i18nFileName, isTest);
  configureServiceLoader(webpackConfig, isTest);
  configureDevtool(webpackConfig, sourceMaps);
  configureBuildDependentConfig(webpackConfig, version, uglifyOptions, isBuild);

  return webpackConfig;
};
