const { webpackConfigGenerator } = require("@caplin/webpack-config-app");

module.exports = function createWebpackConfig() {
  const webpackConfig = webpackConfigGenerator({
    basePath: __dirname
  });

  // Add polyfill as the first entry point for IE11 support
  webpackConfig.entry.unshift("babel-polyfill");

  webpackConfig.module.rules.push({
    test: /\.less$/,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "less-loader",
        options: {
          strictMath: true
        }
      }
    ]
  });

  return webpackConfig;
};
