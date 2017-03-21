const { join } = require("path");

const { copySync } = require("fs-extra");

// Move the application aspect code into the `pkgs` directory.
module.exports.moveAspectCode = function moveAspectCode(
  {
    applicationName,
    brjsApplicationDir,
    packagesDir,
    packagesThatShouldBeLibs
  },
  aspectName
) {
  const packageName = `${applicationName}-${aspectName}`;
  const aspectPackageDir = join(packagesDir, packageName);

  copySync(join(brjsApplicationDir, aspectName), aspectPackageDir);
  packagesThatShouldBeLibs.push(packageName);
};
