/* eslint no-param-reassign: 0, no-underscore-dangle: 0, global-require: 0,
   import/no-dynamic-require: 0, class-methods-use-this: 0 */
const { Stats } = require("fs");
const { basename, join } = require("path");

// Record all aliases inside the `$aliases-data` module i.e. `aliases.js` or
// `aliases-test.js`.
let aliasesDataAliases = new Set();
// Record all aliases found during a compilation.
const importedAliases = new Set();
const lifeCycleEvent = process.env.npm_lifecycle_event || "";
const stubFileStats = new Stats();
const testsScriptRunning = basename(process.argv[1]) === "tests.js";
const isTest = testsScriptRunning || lifeCycleEvent.startsWith("test");
let aliasesModule = {};

// Helps trick webpack into believing there is a file for the alias.
stubFileStats.isFile = () => true;

// Delete the module object from webpack's module cache so each
// `require('service!alias-name')` goes to the `ServiceRegistry` afresh. This
// is necessary in tests where the services can be replaced by different stubs.
function createTestingServiceAliasModule(alias) {
  return `
  const ar = require("br/AliasRegistry");
  if (!ar.isAlias("${alias}") || !ar.isAliasAssigned("${alias}")) {
    ar.registerAliasProvider("${alias}", ${aliasesModule[alias].toString()});
  }
  module.exports = require("br/ServiceRegistry").getService("${alias}");
  delete __webpack_require__.c[module.id];`;
}

function createServiceAliasModule(alias) {
  return `
  const ar = require("br/AliasRegistry");
  if (!ar.isAlias("${alias}") || !ar.isAliasAssigned("${alias}")) {
    ar.registerAliasProvider("${alias}", ${aliasesModule[alias].toString()});
  }
  module.exports = require("br/ServiceRegistry").getService("${alias}");`
}

function createAliasModule(alias) {
  return `
  const ar = require("br/AliasRegistry");
  if (!ar.isAlias("${alias}") || !ar.isAliasAssigned("${alias}")) {
    ar.registerAliasProvider("${alias}", ${aliasesModule[alias].toString()});
  }
  module.exports = require("br/AliasRegistry").getClass("${alias}")`;
}

// `aliasType` is either `alias` or `service`.
function createCommonAliasFileData(aliasType, moduleCreator, result, compiler) {
  const { context, inputFileSystem } = compiler;
  const alias = result.request.replace(`${aliasType}!`, "");
  const aliasModule = moduleCreator(alias);

  const aliasRequest = join(`${context}/src/config/${alias}.js`);

  const aliasFilePath = aliasRequest;

  const fileBuffer = Buffer.from(aliasModule);

  importedAliases.add(alias);
  // Change the `result` object `request` to point to an illusionary file. Add
  // stat and file data for that file into webpack's `inputFileStorage`.
  // So when webpack goes to look for that file it a) believes it exists and
  // b) finds contents for the file.
  result.request = aliasFilePath;
  inputFileSystem._statStorage.data[aliasFilePath] = [null, stubFileStats];
  inputFileSystem._readFileStorage.data[aliasFilePath] = [null, fileBuffer];
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
  const { context } = compiler;
  const aliasRequest = join(`${context}/src/config/aliases-test.js`);

  result.request = aliasRequest;
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
      console.error(
        `
                ******************************************
                    Alias "${alias}" not registered.
                    Usage of this alias will fail.
                ******************************************
            `
      );
    }
  }
}

function nmfCreated(nmf, compiler) {
  // Called inside `NormalModuleFactory` during module creation.
  nmf.plugin(
    "before-resolve",
    (result, callback) => handleAliasImports(result, callback, compiler)
  );
}

class AliasesPlugin {
  apply(compiler) {
    // Every compilation we clear down the set of found aliases, used during
    // development when file watching.
    const { context, inputFileSystem, options } = compiler;
    const aliasesDataPath = options.resolve.alias["$aliases-data$"];
    const aliasesData = require(aliasesDataPath);
    aliasesModule = aliasesData;

    const aliasRequest = join(`${context}/src/config/aliases-test.js`);
    const aliasFilePath = aliasRequest;

    aliasesDataAliases = new Set(Object.keys(aliasesData));

    const fileBuffer = Buffer.from('module.exports = {};');
    // Remove the "alias!" prefix from the request or webpack searches for
    // an `alias` module/loader in the `AliasRegistry` folder. `$aliases-data`
    // is aliased in webpack to point toward the `aliases.js` module.
    inputFileSystem._statStorage.data[aliasFilePath] = [null, stubFileStats];
    inputFileSystem._readFileStorage.data[aliasFilePath] = [null, fileBuffer];

    compiler.plugin("compile", () => importedAliases.clear());
    compiler.plugin("done", verifyImportedAliasesAreRegistered);
    // Called when `Compiler` creates `NormalModuleFactory`.
    compiler.plugin("normal-module-factory", nmf => nmfCreated(nmf, compiler));
  }
}

module.exports = AliasesPlugin;
