const { readFileSync } = require("fs");
const { join, sep } = require("path");

const { sync } = require("glob");

const GLOB_OPTIONS = {
  cwd: join(process.cwd(), "..", "js-patches")
};
// Windows backslashes have to be escaped or else they are treated as special
// characters in the `RegExp`.
const esc = path => path.replace(/\\/g, "\\\\");
const patches = new Map();
const pathPrefix = new RegExp(
  `node_modules${esc(sep)}|packages-caplin${esc(sep)}`
);

module.exports.defaultPatchesOptions = GLOB_OPTIONS;

function appendPatchToPatchedModules(loaderAPI, moduleSource) {
  // Remove the absolute `node_modules` or `packages-caplin` path prefix from
  // `resourcePath` to calculate `importedModule` path.
  const importedModule = loaderAPI.resourcePath.split(pathPrefix).pop();
  const patchEntry = patches.get(importedModule);

  if (patchEntry) {
    return moduleSource + patchEntry;
  }

  return moduleSource;
}

module.exports.appendModulePatch = function appendModulePatch(options) {
  const patchesOptions = options || GLOB_OPTIONS;
  const patchFiles = sync("**/*.js", patchesOptions);

  patches.clear();
  patchFiles.forEach(patchFileName => {
    // node glob returns paths with unix backslashes even in windows so we
    // convert the slashes to the separator of the env to allow successful
    // matching in `appendPatchToPatchedModules`
    // see https://github.com/isaacs/node-glob/issues/173
    const convertedPatchFileName = patchFileName.replace(/\//g, sep);
    const patchFile = readFileSync(
      join(patchesOptions.cwd, patchFileName),
      "utf8"
    );

    patches.set(convertedPatchFileName, patchFile);
  });

  return appendPatchToPatchedModules;
};
