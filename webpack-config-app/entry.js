const { join } = require("path");
const { existsSync } = require("fs");

module.exports = function configureBundleEntryPoint(
  variant,
  webpackConfig,
  basePath
) {
  const srcPath = join(basePath, "src");
  let appEntryPoint = join(srcPath, "index.js");

  // Certain apps can have variant entry points e.g. mobile.
  if (variant) {
    const customerEntryPoint = join(srcPath, "customers", variant, "index.js");
    // Keep backwards compatibility for apps that might already be using this
    const variantEntryPoint = join(srcPath, `index-${variant}.js`);

    appEntryPoint = existsSync(customerEntryPoint)
      ? customerEntryPoint
      : existsSync(variantEntryPoint)
        ? variantEntryPoint
        : appEntryPoint;
  }

  const reactErrorOverlay = require.resolve("react-error-overlay");

  webpackConfig.entry = [reactErrorOverlay, appEntryPoint];
};
