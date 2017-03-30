/* eslint no-param-reassign: "off" */

module.exports = function configureDevtool(webpackConfig, sourceMaps) {
  if (sourceMaps) {
    webpackConfig.devtool = "inline-source-map";
  }
};
