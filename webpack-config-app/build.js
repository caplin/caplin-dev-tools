/* eslint no-param-reassign: "off" */

const webpack = require("webpack");

module.exports = function configureBuildDependentConfig(
  webpackConfig,
  version,
  uglifyOptions,
  isBuild,
  STATIC_DIR
) {
  if (isBuild) {
    webpackConfig.output.publicPath = `${STATIC_DIR}/`;

    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          VERSION: JSON.stringify(version)
        }
      })
    );

    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin(uglifyOptions)
    );
  } else {
    webpackConfig.output.publicPath = `/${STATIC_DIR}/`;
  }
};
