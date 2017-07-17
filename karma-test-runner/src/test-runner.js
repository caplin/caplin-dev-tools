const { sep } = require("path");

const { runAppTests } = require("./test-runner-app");

function runTests(searchDir, argv) {
  const pathParts = searchDir.split(sep);
  const appOrPkgName = pathParts.pop();
  const appOrPkgDir = pathParts.pop();

  if (appOrPkgDir === "apps") {
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
