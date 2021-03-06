const { join } = require("path");

const {
  accessSync,
  copy,
  mkdirsSync,
  readdirSync,
  readFileSync,
  remove,
  renameSync,
  statSync
} = require("fs-extra");
const { safeLoad } = require("js-yaml");

// If a directory is present in the `conversion-data` override directory use it
// else use the template version.
function getBoilerplateDirLocation(
  backupDir,
  conversionDataDirContents,
  fileName,
  filePath
) {
  if (conversionDataDirContents.includes(fileName)) {
    return join("..", "conversion-data", filePath);
  }

  return join(backupDir, filePath);
}

// The user can provide a directory with files that override the boilerplate
// files the conversion tool uses by default. We check for the existance of
// these overrides and use them if present.
function useConversionDataDirectoryFilesIfPresent(backupDir, applicationName) {
  const conversionDataDirContents = readdirSync(join("..", "conversion-data"));
  let sdkJSLibrariesDir = getBoilerplateDirLocation(
    backupDir,
    conversionDataDirContents,
    "sdk",
    join("sdk", "libs", "javascript")
  );
  let privateKeyFileLocation = getBoilerplateDirLocation(
    backupDir,
    conversionDataDirContents,
    "privatekey.pem",
    join("conf", "keymaster", "privatekey.pem")
  );

  if (applicationName === "ct") {
    privateKeyFileLocation = join("..", "conversion-data", "ct-privatekey.pem");
    sdkJSLibrariesDir = join(backupDir, "ct-core", "sdk", "libs", "javascript");
  } else if (applicationName === "br") {
    privateKeyFileLocation = join("..", "conversion-data", "ct-privatekey.pem");
    sdkJSLibrariesDir = join(
      backupDir,
      "brjs-sdk",
      "sdk",
      "libs",
      "javascript"
    );
  }

  return {
    privateKeyFileLocation,
    sdkJSLibrariesDir
  };
}

function getApplicationFilePath(applicationName) {
  if (applicationName === "ct") {
    return join("ct-core", "apps", "fxtrader");
  } else if (applicationName === "br") {
    return join("brjs-sdk", "apps", "it-app");
  }

  return join("apps", applicationName);
}

// Create all the metadata required for converting an app, dir locations etc.
module.exports.createConversionMetadataDataType = applicationName => {
  const appFilePath = getApplicationFilePath(applicationName);
  const appConfFileName = join(appFilePath, "app.conf");
  let applicationNamespaceRoot = applicationName;
  // string: Directory that BRJS project is moved to.
  const backupDir = join("brjs-app-backup");
  // string: Directory that BRJS application is moved to.
  const brjsApplicationDir = join(backupDir, appFilePath);
  let conversionDataApplicationName = "";
  // string: Name of packages directory.
  const packagesDirName = "packages-caplin";
  const conversionData = useConversionDataDirectoryFilesIfPresent(
    backupDir,
    applicationName
  );

  if (statSync(appConfFileName).isFile()) {
    const appConfYAML = safeLoad(readFileSync(appConfFileName, "utf8"));

    applicationNamespaceRoot = appConfYAML.requirePrefix;
  }

  if (applicationName === "ct") {
    applicationName = "fxtrader";
    conversionDataApplicationName = "ct";
  } else if (applicationName === "br") {
    applicationName = "it-app";
    conversionDataApplicationName = "br";
  }

  return {
    applicationName,
    applicationNamespaceRoot,
    // string: The BRJS application's `libs` directory
    applicationLibsDir: join(brjsApplicationDir, "libs"),
    backupDir,
    brjsApplicationDir,
    conversionDataApplicationName,
    packagesDir: join(packagesDirName),
    packagesDirName,
    packagesThatShouldBeLibs: [],
    privateKeyFileLocation: conversionData.privateKeyFileLocation,
    sdkJSLibrariesDir: conversionData.sdkJSLibrariesDir
  };
};

// Certain libs/blades/bladesets don't have a complete namespaced directory
// structure inside them. This is something BRJS supports but bundlers like
// webpack don't, so we need to create these directories to allow them to load
// the required modules.
module.exports.createNamespaceDirectoriesIfMissing = (
  namespacedDir,
  packageDir
) => {
  try {
    accessSync(namespacedDir);
  } catch (namespacedDirectoryDoesNotExistError) {
    // We are either using BR's short directory feature, where the source is
    // directly inside a `src` directory, or there is no source code at all.
    const packageDirContents = readdirSync(packageDir);

    if (packageDirContents.includes("src")) {
      return new Promise((resolve, reject) => {
        function removeCallback(removeError) {
          if (removeError) {
            console.error(removeError);
          }

          resolve();
        }
        function copyCallback(copyError) {
          if (copyError) {
            console.error(copyError);
            reject(copyError);
          } else {
            remove(join(packageDir, "src-bck"), removeCallback);
          }
        }

        // webpack will need a complete namespaced directory structure to load
        // modules.
        renameSync(join(packageDir, "src"), join(packageDir, "src-bck"));
        mkdirsSync(namespacedDir);
        // This nested async mess is required to work around errors in Windows,
        // it doesn't like renaming a directory that has just been created.
        copy(join(packageDir, "src-bck"), namespacedDir, copyCallback);
      });
    }
  }

  return Promise.resolve();
};

// Put the current codebase in a new top level dir to clean up the project dir.
module.exports.moveCurrentCodebase = function moveCurrentCodebase({
  backupDir
}) {
  // Filter out hidden files, skips files like `.git`.
  const projectFiles = readdirSync(".").filter(
    fileName => !/^\./.test(fileName)
  );

  mkdirsSync(backupDir);

  for (const fileName of projectFiles) {
    renameSync(fileName, join(backupDir, fileName));
  }
};

// Fail fast if some of the CLI arguments are missing.
module.exports.verifyCLIArgs = function verifyCLIArgs(applicationName) {
  if (applicationName === undefined) {
    throw new Error("An application name must be provided.");
  }

  const parentDirContents = readdirSync("..");

  if (parentDirContents.includes("conversion-data") === false) {
    throw new Error("A conversion-data directory must be provided.");
  }

  const conversionDataDirContents = readdirSync(join("..", "conversion-data"));

  if (conversionDataDirContents.includes(applicationName) === false) {
    throw new Error(`Provide a conversion-data/${applicationName} directory.`);
  }

  let appFolderName = join("apps", applicationName);

  // If we are converting the `ct` repo change the location as it's structured
  // differently.
  if (applicationName === "ct") {
    appFolderName = join("ct-core", "apps", "fxtrader");
  } else if (applicationName === "br") {
    appFolderName = join("brjs-sdk", "apps", "it-app");
  }

  try {
    accessSync(appFolderName);
  } catch (appFolderInaccesibleError) {
    throw new Error(`The folder ${appFolderName} could not be found.`);
  }
};

module.exports.isPackageDirectory = function isPackageDirectory(
  packagesDir,
  packageName
) {
  const isFileVisible = packageName.startsWith(".") === false;
  const isDirectory = statSync(join(packagesDir, packageName)).isDirectory();

  return isFileVisible && isDirectory;
};
