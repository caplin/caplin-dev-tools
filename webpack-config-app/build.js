/* eslint no-param-reassign: "off" */

const webpack = require("webpack");

const { STATIC_DIR, UGLIFY_OPTIONS } = require("./config");

module.exports = function configureBuildDependentConfig(
  webpackConfig,
  version,
  uglifyOptions = UGLIFY_OPTIONS,
  isBuild
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
  }
};
