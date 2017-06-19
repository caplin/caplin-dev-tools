#! /usr/bin/env node

const path = require("path");

const check = require("check-node-version");
const parseArgs = require("minimist");

const convertor = require("./converter");

const packageJson = require(path.join(__dirname, "..", "package.json"));

const options = {
  node: packageJson.engines.node
};

function convertApplication() {
  const argv = parseArgs(process.argv.slice(2));

  convertor(argv);
}

function versionCheckCallback(versionError, result) {
  let errorMessage = "Not compatible with current node version, please update!";

  if (result.isSatisfied) {
    convertApplication();
  } else {
    if (versionError) {
      errorMessage = versionError.message;
    }

    console.error(errorMessage);
    process.exit(1);
  }
}

check(options, versionCheckCallback);
