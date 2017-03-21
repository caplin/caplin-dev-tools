const { join } = require("path");

const { move } = require("fs-extra");

module.exports.moveApplicationPackagesToLibs = (
  { applicationName, packagesThatShouldBeLibs, packagesDir }
) => {
  const convertedAppDir = join("apps", applicationName);

  const movePromises = packagesThatShouldBeLibs.map(
    packageThatIsLib => new Promise((resolve, reject) => {
      move(
        join(packagesDir, packageThatIsLib),
        join(convertedAppDir, "src", packageThatIsLib),
        err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    })
  );

  return Promise.all(movePromises);
};
