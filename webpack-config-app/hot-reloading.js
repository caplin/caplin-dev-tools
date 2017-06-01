/* eslint no-param-reassign: "off" */
const webpack = require("webpack");

module.exports = function configureHotReloading(webpackConfig, hot) {
  if (hot) {
    webpackConfig.entry.push(
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000"
    );

    webpackConfig.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin()
    );
  }
};
