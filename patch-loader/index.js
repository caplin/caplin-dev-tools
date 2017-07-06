const loaderUtils = require("loader-utils");

function findPatchLoader({ loader }) {
  return loader === "@caplin/patch-loader";
}

module.exports = function patchLoader(moduleSource) {
  let options = loaderUtils.getOptions(this);

  // This check is required as a work around for this issue
  // https://github.com/mzgoddard/hard-source-webpack-plugin/issues/149
  if (options.appendModulePatch === undefined) {
    options = this.options.module.rules.find(findPatchLoader).options;
  }

  return options.appendModulePatch(this, moduleSource);
};
