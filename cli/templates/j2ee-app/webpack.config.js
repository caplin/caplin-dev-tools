const { webpackConfigGenerator } = require("@caplin/webpack-config-app");

module.exports = function createWebpackConfig() {
  const webpackConfig = webpackConfigGenerator({
    basePath: __dirname
  });

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
