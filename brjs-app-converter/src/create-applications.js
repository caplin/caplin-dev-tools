const { join } = require("path");

const {
  copySync,
  existsSync,
  readdirSync,
  readJsonSync,
  writeJsonSync
} = require("fs-extra");

const { templateDir } = require("./converter-data");
const { isPackageDirectory } = require("./converter-utils");

function serverDirs(convertedAppDir) {
  let javaServerDir = join(convertedAppDir, "scripts");
  const serverDir = join(convertedAppDir, "server");
  let nodeServerDir = serverDir;

  if (existsSync(join(serverDir, "node"))) {
    nodeServerDir = join(serverDir, "node");
  }

  if (existsSync(join(serverDir, "java"))) {
    javaServerDir = join(serverDir, "java");
  }

  return {
    javaServerDir,
    nodeServerDir
  };
}

function setUpApplicationFiles(
  applicationName,
  convertedAppDir,
  conversionMetadata,
  defaultAspectDir
) {
  copySync(
    join("..", "conversion-data", applicationName),
    join(convertedAppDir)
  );
  copySync(join(templateDir, ".babelrc"), join(convertedAppDir, ".babelrc"));
  copySync(
    join(defaultAspectDir, "unbundled-resources"),
    join(convertedAppDir, "static/dev/unbundled-resources")
  );
  copySync(
    join(defaultAspectDir, "unbundled-resources"),
    join(convertedAppDir, "static/dev")
  );

  const { javaServerDir, nodeServerDir } = serverDirs(convertedAppDir);

  if (existsSync(conversionMetadata.privateKeyFileLocation)) {
    copySync(
      conversionMetadata.privateKeyFileLocation,
      join(nodeServerDir, "privatekey.pem")
    );
  }

  copySync(
    join(conversionMetadata.brjsApplicationDir, "WEB-INF"),
    join(javaServerDir, "WEB-INF")
  );
}

// Given an application populate its `package.json` with all the newly created
// packages as dependencies.
function populateApplicationPackageJSON(
  applicationName,
  convertedAppDir,
  { packagesDir, packagesDirName, packagesThatShouldBeLibs }
) {
  const appPackageJSON = readJsonSync(
    join("..", "conversion-data", applicationName, "package.json")
  );
  const appPackageJSONFileLocation = join(convertedAppDir, "package.json");

  for (const packageDir of readdirSync(packagesDir)) {
    const isNotLib = packagesThatShouldBeLibs.includes(packageDir) === false;
    const isPackage = isPackageDirectory(packagesDir, packageDir);

    if (isNotLib && isPackage) {
      appPackageJSON.dependencies[
        packageDir
      ] = `file:../../${packagesDirName}/${packageDir}`;
    }
  }

  writeJsonSync(appPackageJSONFileLocation, appPackageJSON, { spaces: 2 });
}

// Create application variant
function createApplication(
  applicationName,
  conversionMetadata,
  defaultAspectDir,
  conversionDataApplicationName
) {
  const convertedAppDir = join("apps", applicationName);

  setUpApplicationFiles(
    conversionDataApplicationName || applicationName,
    convertedAppDir,
    conversionMetadata,
    defaultAspectDir
  );
  populateApplicationPackageJSON(
    conversionDataApplicationName || applicationName,
    convertedAppDir,
    conversionMetadata
  );
}

// Create application and application variants directories.
module.exports.createApplicationAndVariants = conversionMetadata => {
  const {
    applicationName,
    conversionDataApplicationName,
    packagesDir
  } = conversionMetadata;
  const defaultAspectDir = join(
    packagesDir,
    `${applicationName}-default-aspect`
  );

  createApplication(
    applicationName,
    conversionMetadata,
    defaultAspectDir,
    conversionDataApplicationName
  );
};
