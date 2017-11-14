const { BASE_WEBPACK_CONFIG } = require("@caplin/webpack-config-app/config");
const webpackConfig = Object.assign({}, BASE_WEBPACK_CONFIG);

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

module.exports = webpackConfig;
