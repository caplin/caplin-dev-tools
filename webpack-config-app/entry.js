const { join } = require("path");
const { existsSync } = require("fs");

module.exports = function configureBundleEntryPoint(
  variant,
  webpackConfig,
  basePath
) {
  let entryFile = "index.js";

  // Certain apps can have variant entry points e.g. mobile.
  if (variant) {
    const customerEntryPoint = join("customers", variant, "index.js");
    // Keep backwards compatibility for apps that might already be using this
    const variantEntryPoint = `index-${variant}.js`;

    entryFile = existsSync(customerEntryPoint)
      ? customerEntryPoint
      : existsSync(variantEntryPoint)
        ? variantEntryPoint
        : entryFile;
  }

  const appEntryPoint = join(basePath, "src", entryFile);
  const reactErrorOverlay = require.resolve("react-error-overlay");

  webpackConfig.entry = [reactErrorOverlay, appEntryPoint];
};
