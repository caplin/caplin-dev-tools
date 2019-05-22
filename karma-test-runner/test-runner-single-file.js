const { existsSync } = require("fs");
const { dirname, join } = require("path");

const { addWebpackConf, createWebpackConfig } = require("./config-webpack");
const { createKarmaConf } = require("./config-karma");
const { runPackagesTests } = require("./utils");

// The test file's `basePath` is the first directory above it with a test.conf,
// aliases-test file or the current directory ('.').
function findBasePath(testEntry) {
  const testDir = dirname(testEntry);
  const testConf = join(testDir, "test.conf.js");
  const aliasesTest = join(testDir, "aliases-test.js");

  if (existsSync(testConf) || existsSync(aliasesTest) || testDir === ".") {
    return testDir;
  }

  return findBasePath(testDir);
}

function runSingleTestFile(appDir, argv) {
  const relativeTestEntry = argv._[0];
  // Make abs as file paths are resolved from the `basePath` which can change.
  const absTestEntry = join(appDir, relativeTestEntry);
  const basePath = findBasePath(relativeTestEntry);
  // If `basePath` is relative it can be resolved incorrectly.
  const absBasePath = join(appDir, basePath);
  const testsType = relativeTestEntry.includes("_test-ut") ? "UTs" : "ATs";
  const karmaConf = createKarmaConf(absBasePath, absTestEntry, testsType, argv);
  const webpackConfig = createWebpackConfig(appDir, argv);
  const karmaConfWithWebpackConf = addWebpackConf(karmaConf, webpackConfig);

  runPackagesTests([karmaConfWithWebpackConf], argv.w);
}

module.exports.runSingleTestFile = runSingleTestFile;

function isSingleTestFile(argv, workingDir) {
  const optsLessArgs = argv._;

  if (optsLessArgs.length === 1) {
    const testFile = join(workingDir, optsLessArgs[0]);

    return existsSync(testFile);
  }

  return false;
}

module.exports.isSingleTestFile = isSingleTestFile;
