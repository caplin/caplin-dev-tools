const { dirname, join, relative, sep } = require("path");

const {
  copySync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync
} = require("fs-extra");
const glob = require("glob");
const rimraf = require("rimraf");

function deleteUnusedFiles(packagePath) {
  rimraf.sync(`${packagePath}/resources`);
  rimraf.sync(`${packagePath}/tests`);
  rimraf.sync(`${packagePath}/test-unit`);
  rimraf.sync(`${packagePath}/test-acceptance`);
  rimraf.sync(`${packagePath}/compiled`);
  rimraf.sync(`${packagePath}/src`);
  rimraf.sync(`${packagePath}/br-lib.conf`);
  rimraf.sync(`${packagePath}/.js-style`);
  rimraf.sync(`${packagePath}/_resources/aliases.xml`);
  rimraf.sync(`${packagePath}/_resources/aliasDefinitions.xml`);
  rimraf.sync(`${packagePath}/_resources-test-ut/aliases.xml`);
  rimraf.sync(`${packagePath}/_resources-test-ut/aliasDefinitions.xml`);
  rimraf.sync(`${packagePath}/_resources-test-at/aliases.xml`);
  rimraf.sync(`${packagePath}/_resources-test-at/aliasDefinitions.xml`);
  rimraf.sync(`${packagePath}/**/src-test`);
}

module.exports.deleteUnusedFiles = deleteUnusedFiles;

function fileExists(filePath) {
  try {
    lstatSync(filePath);
  } catch (err) {
    return false;
  }

  return true;
}

// Is the module you are importing located in the same package as the importer.
// For each import in a package `importingPackage` we check which
// package `importedModulePackage` is located inside.
function isImportIntraPackage(importingPackage) {
  return importedModulePackage => importedModulePackage === importingPackage;
}

// Is the module you are importing located in the application's `src` dir.
function isImportIntraApp(appPackages) {
  return importedModulePackage => appPackages.includes(importedModulePackage);
}

// Returns a function that checks if a given module source should be relative
// and if so convert it to relative. A module source should be relative if the
// import is for another module in the application `src` directory or if it's an
// import for a module in the same package as the importer.
// e.g. in `ct-caplin/func`, `ct-caplin/namespace` converts to `./namespace`.
//
// `importSourcePathPrefix` Prefix that converts the module source into
// absolute file path e.g. '/packages-caplin/', '/apps/fxtrader/src/'
function createImportSourceProcessor(
  shouldImportBeRelative,
  importSourcePathPrefix
) {
  // `importDeclarationSource` Import module e.g. `br-component/Component` or
  // `mobile-blotter/screens/orders/bulk_orders/BulkOrderStateManager`
  // `importingModulePath` Path to file doing the importing
  //  e.g. 'apps/mobile/src/config/aliases.js'
  return (importDeclarationSource, importingModulePath) => {
    const packageOfImportedModule = importDeclarationSource.split("/")[0];
    const shouldBeRelative = shouldImportBeRelative(packageOfImportedModule);

    if (shouldBeRelative === false) {
      return importDeclarationSource;
    }

    // `relative` requires absolute file paths.
    const importerFileDirectory = dirname(`/${importingModulePath}`);
    const importedFilePath = importSourcePathPrefix + importDeclarationSource;
    const relativePathToImportedModule = relative(
      importerFileDirectory,
      importedFilePath
    )
      // Convert Windows separator to Unix style for module URIs.
      .split(sep)
      .join("/");

    if (relativePathToImportedModule.startsWith(".")) {
      return relativePathToImportedModule;
    }

    // A file system path to a child directory can start without `./` but
    // modules require `./` to distinguish relative from package imports
    // i.e. 'child_directory/File' is converted to './child_directory/File'.
    return `./${relativePathToImportedModule}`;
  };
}

// If a relative conversion function isn't provided use the module source as is.
const modulesAreNotRelative = moduleSource => moduleSource;

function updateMappings(
  srcPath,
  moduleSources,
  makeImportSourceRelative = modulesAreNotRelative
) {
  let fileContents = readFileSync(srcPath, "utf8");
  const strings = fileContents.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);

  if (strings) {
    let needsWrite = false;

    strings.forEach(string => {
      const mapping = string.replace(/'/g, "").replace(/"/g, "");
      const value = moduleSources.get(mapping);

      if (mapping && value) {
        // Intra app and package imports should be relative.
        const relativeModuleSource = makeImportSourceRelative(value, srcPath);

        if (relativeModuleSource !== mapping) {
          fileContents = fileContents.replace(
            new RegExp(`['"]${mapping}['"]`, "g"),
            `'${relativeModuleSource}'`
          );
          needsWrite = true;
        }
      }

      if (mapping.indexOf("/src-test/") !== -1) {
        // a quick fix to relative "src-test" urls
        const fixedSrcTestSource = mapping.replace("/src-test/", "/_test-src/");

        fileContents = fileContents.replace(
          new RegExp(`['"]${mapping}['"]`, "g"),
          `'${fixedSrcTestSource}'`
        );
        needsWrite = true;
      }
    });

    if (needsWrite) {
      writeFileSync(srcPath, fileContents, "utf8");
    }
  }
}

function updateAllImportsInPackage(
  packagePath,
  moduleSources,
  makeModuleSourceRelative
) {
  const packageJSFiles = glob.sync(`${packagePath}/**/*.js`);

  packageJSFiles.forEach(jsFilePath =>
    updateMappings(jsFilePath, moduleSources, makeModuleSourceRelative)
  );
}

// Returns a function that updates all the import module sources to their new
// values and makes intra app `src` and intra package imports relative.
function createPackageImportsUpdater(packagesDir, appPackages, moduleSources) {
  // `packagePath` is in the format `packages-caplin/workbench`.
  return packagePath => {
    let importRelativeChecker;
    const packageName = packagePath.replace(`${packagesDir}/`, "");
    // Use relative imports if importing app level (in `src` directory) module.
    const isApplicationPackage = appPackages.includes(packageName);

    if (isApplicationPackage) {
      importRelativeChecker = isImportIntraApp(appPackages);
    } else {
      importRelativeChecker = isImportIntraPackage(packageName);
    }

    const importSourceProcessor = createImportSourceProcessor(
      importRelativeChecker,
      `/${packagesDir}/`
    );

    updateAllImportsInPackage(
      packagePath,
      moduleSources,
      importSourceProcessor
    );
  };
}

function getPackageSrcCommonPath(packageSrcFiles, commonRoot) {
  const directoryTree = packageSrcFiles
    .map(packageSrcFilePath => packageSrcFilePath.replace(commonRoot, ""))
    .map(packageSrcFilePath => packageSrcFilePath.split("/"))
    .reduce((partialDirectoryTree, filePaths) => {
      filePaths.reduce((currentTreeNode, filePath) => {
        if (currentTreeNode[filePath] === undefined) {
          currentTreeNode[filePath] = {};
        }

        return currentTreeNode[filePath];
      }, partialDirectoryTree);

      return partialDirectoryTree;
    }, {});

  let commonPath = "";
  let currentDirectory = directoryTree;

  while (
    Object.keys(currentDirectory).length === 1 &&
    !Object.keys(currentDirectory)[0].endsWith(".js")
  ) {
    const pathPart = Object.keys(currentDirectory)[0];

    commonPath = `${commonPath}${pathPart}/`;
    currentDirectory = currentDirectory[pathPart];
  }

  return commonPath;
}

// If the copied source has a patch; move the patch to the `js-patches` folder
// in its new location.
function copyJSPatch(
  backupDir,
  currentModuleSource,
  newSrcFilePath,
  packagesDir
) {
  const patchFileName = join(
    backupDir,
    "js-patches",
    `${currentModuleSource}.js`
  );

  if (fileExists(patchFileName)) {
    copySync(
      patchFileName,
      join("apps", "js-patches", newSrcFilePath.replace(`${packagesDir}/`, ""))
    );
  }
}

function copyPackageSrcToNewLocations(
  packagePath,
  packagesDir,
  moduleSources,
  backupDir
) {
  const packageSrcFiles = glob.sync(`${packagePath}/src/**/*.js`);
  const commonPath = getPackageSrcCommonPath(
    packageSrcFiles,
    `${packagePath}/src/`
  );
  const currentFileLocationRegExp = new RegExp(
    `${packagePath}\/src\/${commonPath}(.*)`
  );

  packageSrcFiles.forEach(packageSrcFile => {
    const currentModuleSource = packageSrcFile
      .replace(`${packagePath}/src/`, "")
      .replace(".js", "");
    const newSrcFilePath = packageSrcFile.replace(
      currentFileLocationRegExp,
      `${packagePath}/$1`
    );
    const newModuleSource = newSrcFilePath
      .replace(`${packagesDir}/`, "")
      .replace(".js", "");

    copyJSPatch(backupDir, currentModuleSource, newSrcFilePath, packagesDir);
    copySync(packageSrcFile, newSrcFilePath);
    moduleSources.set(currentModuleSource, newModuleSource);
  });
}

function copyPackageSrcTestToNewLocations(
  packagePath,
  packagesDir,
  moduleSources
) {
  const packageSrcTestFiles = glob.sync(`${packagePath}/**/src-test/**/*.js`);
  const commonPath = getPackageSrcCommonPath(packageSrcTestFiles, packagePath);
  const currentFileLocationRegExp = new RegExp(
    `${packagePath}(.*)${commonPath}(.*)`
  );

  packageSrcTestFiles.forEach(packageSrcTestFile => {
    const currentModuleSource = packageSrcTestFile
      .replace(/.*src-test\//, "")
      .replace(".js", "");
    const newSrcFilePath = packageSrcTestFile.replace(
      currentFileLocationRegExp,
      `${packagePath}/_test-src/$2`
    );
    const newModuleSource = newSrcFilePath
      .replace(`${packagesDir}/`, "")
      .replace(".js", "");

    copySync(packageSrcTestFile, newSrcFilePath);
    moduleSources.set(currentModuleSource, newModuleSource);
  });
}

function copyPackageFoldersToNewLocations(packagePath) {
  const packageFoldersThatMustBeMoved = [
    { src: `${packagePath}/resources`, dest: `${packagePath}/_resources` },
    {
      src: `${packagePath}/test-unit/resources`,
      dest: `${packagePath}/_resources-test-ut`
    },
    {
      src: `${packagePath}/test-acceptance/resources`,
      dest: `${packagePath}/_resources-test-at`
    },
    {
      src: `${packagePath}/tests/test-acceptance/js-test-driver/resources`,
      dest: `${packagePath}/_resources-test-at`
    },
    { src: `${packagePath}/test-unit/tests`, dest: `${packagePath}/_test-ut` },
    {
      src: `${packagePath}/test-unit/tests-es6`,
      dest: `${packagePath}/_test-ut`
    },
    {
      src: `${packagePath}/test-unit/js-test-driver/tests`,
      dest: `${packagePath}/_test-ut`
    },
    {
      src: `${packagePath}/test-acceptance/tests`,
      dest: `${packagePath}/_test-at`
    },
    {
      src: `${packagePath}/tests/test-unit/js-test-driver/resources`,
      dest: `${packagePath}/_resources-test-ut`
    },
    { src: `${packagePath}/tests/test-unit/`, dest: `${packagePath}/_test-ut` },
    {
      src: `${packagePath}/tests/test-acceptance/`,
      dest: `${packagePath}/_test-at`
    }
  ];

  packageFoldersThatMustBeMoved
    .filter(({ src }) => fileExists(src))
    .forEach(({ src, dest }) => copySync(src, dest));
}

module.exports.copyPackageFoldersToNewLocations = copyPackageFoldersToNewLocations;

// Every package except thirdparty ones.
function findAllPackagesThatRequireConversion(packagesDir) {
  return readdirSync(packagesDir)
    .map(packagesDirContent => `${packagesDir}/${packagesDirContent}`)
    .filter(packagesDirContentPath =>
      lstatSync(packagesDirContentPath).isDirectory()
    )
    .filter(
      packagesDirContentPath =>
        fileExists(`${packagesDirContentPath}/thirdparty-lib.manifest`) ===
        false
    );
}

module.exports.convertPackagesToNewFormat = ({
  applicationName,
  backupDir,
  packagesDir,
  packagesThatShouldBeLibs
}) => {
  const importSourcePathPrefix = `/apps/${applicationName}/src/`;
  const makeAppModulesRelative = createImportSourceProcessor(
    isImportIntraApp(packagesThatShouldBeLibs),
    importSourcePathPrefix
  );
  const moduleSources = new Map();
  const packagesToConvert = findAllPackagesThatRequireConversion(packagesDir);

  // Copy all the package folders to their new locations.
  packagesToConvert.forEach(copyPackageFoldersToNewLocations);
  // Copy all the src modules to their new locations.
  packagesToConvert.forEach(packagePath =>
    copyPackageSrcToNewLocations(
      packagePath,
      packagesDir,
      moduleSources,
      backupDir
    )
  );
  // Copy all the src-test modules to their new locations.
  packagesToConvert.forEach(packagePath =>
    copyPackageSrcTestToNewLocations(packagePath, packagesDir, moduleSources)
  );
  // Copy all the tests to their new locations.
  // Update all the require statements.
  packagesToConvert.forEach(
    createPackageImportsUpdater(
      packagesDir,
      packagesThatShouldBeLibs,
      moduleSources
    )
  );
  // Update the app and js-patches imports.
  updateAllImportsInPackage("apps", moduleSources, makeAppModulesRelative);
  updateAllImportsInPackage("brjs-app-backup/js-patches", moduleSources);
  // Delete all the old folders and files.
  packagesToConvert.forEach(deleteUnusedFiles);

  // Return a function that allows post conversion scripts to perform import
  // path updates.
  return (packagePath, srcPathModifier) => {
    // It's possible that the `srcPath` value provided to
    // `makeAppModulesRelative` will be for a file outside the application root,
    // this would result in incorrect relative paths if the module is moved
    // later as part of a build step. Allowing the post conversion script to
    // wrap the call to `makeAppModulesRelative` lets it modify `srcPath`.
    updateAllImportsInPackage(
      packagePath,
      moduleSources,
      srcPathModifier(makeAppModulesRelative)
    );
  };
};
