/* eslint no-param-reassign: "off" */

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const { DefinePlugin } = require("webpack");

const { STATIC_DIR, UGLIFY_OPTIONS } = require("./config");

module.exports = function configureBuildDependentConfig(
  webpackConfig,
  version,
  uglifyOptions = UGLIFY_OPTIONS,
  isBuild
) {
  if (isBuild) {
    const definitions = {
      "process.env": {
        VERSION: JSON.stringify(version)
      }
    };

    webpackConfig.output.publicPath = `${STATIC_DIR}/`;
    webpackConfig.plugins.push(new DefinePlugin(definitions));
    webpackConfig.plugins.push(new UglifyJSPlugin(uglifyOptions));
  }
};
