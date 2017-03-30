/* eslint no-param-reassign: "off" */

const {
  join
} = require("path");

const { STATIC_DIR } = require("./config");

module.exports = function configureOutput(webpackConfig, version, basePath) {
  webpackConfig.output = {
    filename: `bundle-${version}.js`,
    path: join(basePath, "build", "dist", `${STATIC_DIR}`)
  };
};
