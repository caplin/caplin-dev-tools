const { sep } = require("path");
const fs = require("fs-extra");

const { runAppTests } = require("./test-runner-app");
const {
  isSingleTestFile,
  runSingleTestFile
} = require("./test-runner-single-file");

function runTests(searchDir, argv) {
  const cleanCoverage = argv.k;
  const directoryNestLevel = argv.n;
  const pathParts = searchDir.split(sep);
  const appOrPkgName = pathParts.pop();

  let appOrPkgDir = pathParts.pop();
  for (i = 0; i < directoryNestLevel; i++) {
    appOrPkgDir = pathParts.pop();
  }

  if (cleanCoverage) {
    fs.removeSync("./coverage");
  }

  if (isSingleTestFile(argv, searchDir)) {
    console.log(`Running tests in ${argv._[0]}`);

    runSingleTestFile(searchDir, argv);
  } else if (appOrPkgDir === "apps") {
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
