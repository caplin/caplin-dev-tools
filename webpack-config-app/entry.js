const { join } = require("path");

module.exports = function configureBundleEntryPoint(
  variant,
  webpackConfig,
  basePath
) {
  // Certain apps can have variant entry points e.g. mobile.
  const entryFile = variant ? `index-${variant}.js` : "index.js";
  const appEntryPoint = join(basePath, "src", entryFile);
  const reactErrorOverlay = require.resolve("react-error-overlay");

  webpackConfig.entry = [reactErrorOverlay, appEntryPoint];
};
