const {
  configureAliases
} = require("@caplin/alias-loader/alias-configuration");
const {
  webpackConfigGenerator
} = require("@caplin/webpack-config-app");

const aliases = require("./src/config/aliases");
const testAliases = require("./src/config/aliases-test");

const webpackAppAliases = {};

module.exports = function createWebpackConfig() {
  const webpackConfig = webpackConfigGenerator({
    basePath: __dirname
  });

  configureAliases(aliases, webpackConfig, testAliases, webpackAppAliases);

  return webpackConfig;
};
