/* eslint no-param-reassign: "off" */

const { join } = require("path");

module.exports = function configureBundleEntryPoint(
  variant,
  webpackConfig,
  basePath,
  isHotRealoadingActivated
) {
  // Certain apps can have variant entry points e.g. mobile.
  const entryFile = variant ? `index-${variant}.js` : "index.js";
  const appEntryPoint = join(basePath, "src", entryFile);

  if (isHotRealoadingActivated) {
    webpackConfig.entry = [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      appEntryPoint
    ];
  } else {
    webpackConfig.entry = appEntryPoint;
  }
};
