const { sep } = require("path");
const fs = require("fs-extra");

const { runAppTests } = require("./test-runner-app");
const {
  isSingleTestFile,
  runSingleTestFile
} = require("./test-runner-single-file");

function runTests(searchDir, argv) {
  const pathParts = searchDir.split(sep);
  const appOrPkgName = pathParts.pop();
  const appOrPkgDir = pathParts.pop();
  const isApp = argv.app;
  const cleanCoverage = !argv.keepCoverage;

  if (cleanCoverage) {
    fs.removeSync("./coverage");
  }

  if (isSingleTestFile(argv, searchDir)) {
    console.log(`Running tests in ${argv._[0]}`);

    runSingleTestFile(searchDir, argv);
  } else if (appOrPkgDir === "apps" || isApp) {
    console.log(`Running tests for ${appOrPkgName} application.`);

    runAppTests(searchDir, argv);
  } else if (appOrPkgDir === "caplin-packages" || appOrPkgDir === "packages") {
    console.log(`Running tests for ${appOrPkgName} package.`);

    console.warn("Running package tests feature still to be implemented.");
  } else {
    throw new Error("Execute test runner in an app or package directory.");
  }
}

module.exports.runTests = runTests;
