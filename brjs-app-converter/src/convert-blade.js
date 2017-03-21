const { join } = require("path");

const { copySync } = require("fs-extra");

const { createNamespaceDirectoriesIfMissing } = require("./converter-utils");

// Move a blade to the packages directory.
module.exports.moveBladeCodeToPackages = function moveBladeCodeToPackages(
  bladeName,
  bladesetName,
  bladesetBladesDir,
  conversionMetadata
) {
  const { applicationNamespaceRoot, packagesDir } = conversionMetadata;
  const bladeDir = join(bladesetBladesDir, bladeName);
  const bladePackageDir = join(packagesDir, bladeName);
  const bladeNamespaceDir = join(
    bladePackageDir,
    "src",
    applicationNamespaceRoot,
    bladesetName,
    bladeName
  );

  copySync(bladeDir, bladePackageDir);

  return createNamespaceDirectoriesIfMissing(
    bladeNamespaceDir,
    bladePackageDir
  );
};
