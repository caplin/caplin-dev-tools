import { join } from "path";

import {
  copySync,
  existsSync,
  readdirSync,
  readJsonSync,
  statSync,
  writeJsonSync
} from "fs-extra";

import { templateDir } from "./converter-data";

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
    join(convertedAppDir, "public/dev/unbundled-resources")
  );
  copySync(
    join(defaultAspectDir, "unbundled-resources"),
    join(convertedAppDir, "public/dev")
  );

  const {
    javaServerDir,
    nodeServerDir
  } = serverDirs(convertedAppDir);

  copySync(
    conversionMetadata.privateKeyFileLocation,
    join(nodeServerDir, "privatekey.pem")
  );
  copySync(
    join(conversionMetadata.brjsApplicationDir, "WEB-INF"),
    join(javaServerDir, "WEB-INF")
  );
}

// Given an application populate its `package.json` with all the newly created packages as dependencies.
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
    const isDirectory = statSync(join(packagesDir, packageDir)).isDirectory();

    if (isNotLib && isDirectory) {
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
export function createApplicationAndVariants(conversionMetadata) {
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
}
