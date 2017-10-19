const { webpackConfigGenerator } = require("@caplin/webpack-config-app");

module.exports = function createWebpackConfig() {
  const webpackConfig = webpackConfigGenerator({
    basePath: __dirname
  });

  webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  });

  return webpackConfig;
};
