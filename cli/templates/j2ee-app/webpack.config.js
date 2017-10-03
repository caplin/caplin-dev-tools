const { webpackConfigGenerator } = require("@caplin/webpack-config-app");

module.exports = function createWebpackConfig() {
  const webpackConfig = webpackConfigGenerator({
    basePath: __dirname
  });

  return webpackConfig;
};
