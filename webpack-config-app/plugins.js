/* eslint no-param-reassign: "off" */
const webpack = require("webpack");

module.exports = function configureBundlePlugins(webpackConfig) {
  webpackConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];
};
