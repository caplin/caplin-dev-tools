const { existsSync } = require("fs");
const {
  appendModulePatch,
  defaultPatchesOptions
} = require("@caplin/patch-loader/patchesStore");

module.exports = function configurePatches(
  webpackConfig,
  patchesOptions = defaultPatchesOptions
) {
  const patchesPath = patchesOptions.cwd;

  if (existsSync(patchesPath)) {
    webpackConfig.module.rules.push({
      test: /\.js$/,
      loader: "@caplin/patch-loader",
      options: {
        appendModulePatch: appendModulePatch(patchesOptions)
      }
    });
  }
};
