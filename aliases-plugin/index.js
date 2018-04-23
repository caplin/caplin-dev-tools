const { Stats } = require("fs");
const { basename, join } = require("path");
const logger = require("@caplin/node-logger");

// Record all aliases inside the `$aliases-data` module i.e. `aliases.js` or
// `aliases-test.js`.
let aliasesDataAliases = new Set();
// Record all aliases found during a compilation.
const importedAliases = new Set();
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
const stubFileStats = new Stats();
const testsScriptRunning = basename(process.argv[1]) === "tests.js";
const isTest = testsScriptRunning || lifeCycleEvent.startsWith("test");

// Helps trick webpack into believing there is a file for the alias.
stubFileStats.isFile = () => true;

// Delete the module object from webpack's module cache so each
// `require('service!alias-name')` goes to the `ServiceRegistry` afresh. This
// is necessary in tests where the services can be replaced by different stubs.
function createTestingServiceAliasModule(alias) {
  return `module.exports = require("br/ServiceRegistry").getService("${alias}");
  delete __webpack_require__.c[module.id];`;
}

function createServiceAliasModule(alias) {
  return `module.exports = require("br/ServiceRegistry").getService("${alias}");`;
}

function createAliasModule(alias) {
  return `module.exports = require("br/AliasRegistry").getClass("${alias}")`;
}

function registerVirtualFile(inputFileSystem, aliasFilePath, fileBuffer) {
  const statsStorageData = inputFileSystem._statStorage.data;
  const readFileStorageData = inputFileSystem._readFileStorage.data;

  statsStorageData.set(aliasFilePath, [null, stubFileStats]);
  readFileStorageData.set(aliasFilePath, [null, fileBuffer]);
}

// `aliasType` is either `alias` or `service`.
function createCommonAliasFileData(aliasType, moduleCreator, result, compiler) {
  const { context, inputFileSystem } = compiler;
  const alias = result.request.replace(`${aliasType}!`, "");
  const aliasModule = moduleCreator(alias);
  const aliasFilePath = join(
    `${context}/node_modules/@caplin/${aliasType}/${alias}.js`
  );
  const fileBuffer = Buffer.from(aliasModule);

  importedAliases.add(alias);
  // Change the `result` object `request` to point to a virtual file. Add
  // stat and file data for that file into webpack's `inputFileStorage`.
  // So when webpack goes to look for that file it a) believes it exists and
  // b) finds contents for the file.
  result.request = aliasFilePath;

  registerVirtualFile(inputFileSystem, aliasFilePath, fileBuffer);
}

function createServiceFileData(result, compiler) {
  const serviceModuleCreator = isTest
    ? createTestingServiceAliasModule
    : createServiceAliasModule;

  createCommonAliasFileData("service", serviceModuleCreator, result, compiler);
}

function createAliasFileData(result, compiler) {
  createCommonAliasFileData("alias", createAliasModule, result, compiler);
}

// `require` the `$aliases-data$` module to inspect the configured aliases.
function recordAliasesDataAliases(result, compiler) {
  const aliasesDataPath = compiler.options.resolve.alias["$aliases-data$"];
  const aliasesData = require(aliasesDataPath);

  aliasesDataAliases = new Set(Object.keys(aliasesData));
  // Remove the "alias!" prefix from the request or webpack searches for
  // an `alias` module/loader in the `AliasRegistry` folder. `$aliases-data`
  // is aliased in webpack to point toward the `aliases.js` module.
  result.request = "$aliases-data";
}

function handleAliasImports(result, callback, compiler) {
  const isImportingAlias = result && result.request.startsWith("alias!");
  const isImportingService = result && result.request.startsWith("service!");

  if (isImportingAlias) {
    const isImportingAliasesData = result.request.endsWith("$aliases-data");

    // The `$alias-data` file exists and contains the `AliasRegisty` data.
    if (isImportingAliasesData) {
      recordAliasesDataAliases(result, compiler);
    } else {
      createAliasFileData(result, compiler);
    }
  }

  if (isImportingService) {
    createServiceFileData(result, compiler);
  }

  return callback(null, result);
}

function verifyImportedAliasesAreRegistered() {
  for (const alias of importedAliases) {
    if (aliasesDataAliases.has(alias) === false) {
      logger.log({
        label: "aliases-plugin",
        level: "warn",
        message: `Alias "${alias}" not registered.`
      });
    }
  }
}

function nmfCreated(nmf, compiler) {
  // Called inside `NormalModuleFactory` during module creation.
  nmf.plugin("before-resolve", (result, callback) =>
    handleAliasImports(result, callback, compiler)
  );
}

class AliasesPlugin {
  apply(compiler) {
    // Every compilation we clear down the set of found aliases, used during
    // development when file watching.
    compiler.plugin("compile", () => importedAliases.clear());
    compiler.plugin("done", verifyImportedAliasesAreRegistered);
    // Called when `Compiler` creates `NormalModuleFactory`.
    compiler.plugin("normal-module-factory", nmf => nmfCreated(nmf, compiler));
  }
}

module.exports = AliasesPlugin;
