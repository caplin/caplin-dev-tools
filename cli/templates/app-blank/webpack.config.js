const { webpackConfigGenerator } = require("@caplin/webpack-config-app");

module.exports = function createWebpackConfig() {
  const webpackConfig = webpackConfigGenerator({
    basePath: __dirname
  });

  // Add polyfill as the first entry point for IE11 support
  webpackConfig.entry.unshift("babel-polyfill");

  webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  });

  return webpackConfig;
};
