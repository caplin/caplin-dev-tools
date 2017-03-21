const { sep } = require("path");

const { copySync } = require("fs-extra");
const glob = require("glob");

const {
  copyPackageFoldersToNewLocations,
  deleteUnusedFiles
} = require("./convert-packages");

module.exports.runPostConversionScript = function runPostConversionScript(
  conversionMetadata,
  convertPackages
) {
  let postConversionScript = () => {
    // The default post conversion script does nothing.
  };
  const scriptName = `post-conversion-${conversionMetadata.applicationName}`;
  // Convert Windows separator to Unix style for module URIs.
  const moduleURIPrefix = process.cwd().split(sep).join("/");
  // The location has to be absolute, cannot fathom why, even when correctly
  // relative to `cwd`.
  const scriptLocation = `${moduleURIPrefix}/../conversion-data/${scriptName}`;

  try {
    postConversionScript = require(scriptLocation);
  } catch (err) {
    // Ignore error if this application has no post conversion script to run.
  }

  postConversionScript(conversionMetadata, {
    convertPackages,
    copyPackageFoldersToNewLocations,
    copySync,
    deleteUnusedFiles,
    glob
  });
};
