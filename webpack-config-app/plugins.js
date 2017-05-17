/* eslint no-param-reassign: "off" */
const webpack = require("webpack");
const webpackVersion = require("../../webpack/package.json").version;
const WebpackErrorNotificationPlugin = require("webpack-error-notification");

module.exports = function configureBundlePlugins(
  webpackConfig,
  isHotRealoadingActivated
) {
  if (isHotRealoadingActivated) {
    if (webpackVersion !== "1.15.0") {
      webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      );
    } else {
      webpackConfig.plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
      );
    }
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  webpackConfig.plugins.push(
    new WebpackErrorNotificationPlugin(msg => console.log(msg), {})
  );
};
