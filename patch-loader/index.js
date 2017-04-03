const loaderUtils = require("loader-utils");

module.exports = function patchLoader(moduleSource) {
  const options = loaderUtils.getOptions(this);

  return options.appendModulePatch(this, moduleSource);
};
