const { DefinePlugin } = require("webpack");

const { STATIC_DIR } = require("./config");

module.exports = function configureBuildDependentConfig(
  webpackConfig,
  version,
  isBuild
) {
  if (isBuild) {
    const definitions = {
      "process.env": {
        VERSION: JSON.stringify(version),
        NODE_ENV: JSON.stringify("production"),
      },
    };

    webpackConfig.mode = "production";
    webpackConfig.output.publicPath = `${STATIC_DIR}/`;
    webpackConfig.plugins.push(new DefinePlugin(definitions));
  } else {
    webpackConfig.mode = "development";
  }
};
