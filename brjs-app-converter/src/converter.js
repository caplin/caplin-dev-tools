const {
  join
} = require("path");

const addPackageDependencies = require("./add-package-dependencies");
const { moveBRJSApplicationCodeToPackages } = require("./convert-app");
const { createPackagesFromLibs } = require("./convert-libs");
const { convertSDKToPackages } = require("./convert-sdk");
const { convertPackagesToNewFormat } = require("./convert-packages");
const {
  createConversionMetadataDataType,
  moveCurrentCodebase,
  verifyCLIArgs
} = require("./converter-utils");
const { createApplicationAndVariants } = require("./create-applications");
const { moveApplicationPackagesToLibs } = require("./move-libs");
const { injectI18nRequires } = require("./inject-i18n-requires");
const { injectHTMLRequires } = require("./inject-html-requires");
const { runPostConversionScript } = require("./post-conversion-script");

// Provide the name of the app to convert.
module.exports = ({ app }) => {
  verifyCLIArgs(app);

  let convertPackagesFunction = () => {
    // Used by the post conversion script to re-write require statements in code
    // that wasn't covered by the conversion tool.
  };
  const conversionMetadata = createConversionMetadataDataType(app);

  moveCurrentCodebase(conversionMetadata);

  const createPackages = createPackagesFromLibs(conversionMetadata);
  const moveBRJSCode = createPackages.then(
    () => moveBRJSApplicationCodeToPackages(conversionMetadata)
  );
  let convertSDK = moveBRJSCode.then(() =>
    convertSDKToPackages(conversionMetadata));

  if (app === "ct") {
    convertSDK = convertSDK.then(() => convertSDKToPackages({
      packagesDir: conversionMetadata.packagesDir,
      sdkJSLibrariesDir: join(
        "..",
        "conversion-data",
        "sdk",
        "libs",
        "javascript"
      )
    }));
  }

  const createApplications = convertSDK.then(() =>
    createApplicationAndVariants(conversionMetadata));
  const convertPackages = createApplications.then(() => {
    convertPackagesFunction = convertPackagesToNewFormat(conversionMetadata);
  });
  const structureUpdated = convertPackages.then(
    () => moveApplicationPackagesToLibs(conversionMetadata)
  );
  const i18nRequiresAdded = structureUpdated.then(() =>
    injectI18nRequires(conversionMetadata));
  const htmlRequiresAdded = i18nRequiresAdded.then(() => {
    console.log("Adding HTML requires");

    injectHTMLRequires(conversionMetadata);
  });
  const packageDependenciesAdded = htmlRequiresAdded.then(() => {
    console.log("Adding package dependencies.");

    addPackageDependencies(conversionMetadata);
  });
  const postConversionScript = packageDependenciesAdded.then(() => {
    console.log("Running post conversion script.");

    runPostConversionScript(conversionMetadata, convertPackagesFunction);
  });

  postConversionScript.catch(console.error);
};
