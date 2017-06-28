"use strict";

const { sep } = require("path");

const { runAppTests } = require("./test-runner-app");

function runTests(searchDir, argv) {
  const pathParts = searchDir.split(sep);
  const appOrPckName = pathParts.pop();
  const appOrPckDir = pathParts.pop();

  if (appOrPckDir === "apps") {
    console.log(`Running tests for ${appOrPckName} application.`);

    runAppTests(searchDir, argv);
  } else if (appOrPckDir === "caplin-packages" || appOrPckDir === "packages") {
    console.log(`Running tests for ${appOrPckName} package.`);

    console.warn("Running package tests feature still to be implemented.");
  } else {
    throw new Error("Execute test runner in an app or package directory.");
  }
}

module.exports.runTests = runTests;