"use strict";

const { basename } = require("path");

const { createATsKarmaConf, createUTsKarmaConf } = require("./config-karma");
const { addWebpackConf, createWebpackConfig } = require("./config-webpack");
const { findAppPackages } = require("./search");
const { doesPckHaveATs, doesPckHaveUTs } = require("./test-runner-pck");
const { runPackagesTests } = require("./utils");

// `f` are package name RegExps to filter out packages e.g. `^br-` or `^ct-`.
// `_` are the list of packages specified by the user on the CLI.
function filterPcks(appPcks, { _, f }) {
  // Specifying packages on the CLI trumps `-f` options.
  if (_.length > 0) {
    return appPcks.filter(dir => _.includes(basename(dir)));
  }

  let regExpString = f;

  // Were we given multiple package regexps.
  if (Array.isArray(regExpString)) {
    regExpString = regExpString.join("|");
  }

  if (regExpString) {
    const filter = new RegExp(regExpString);

    return appPcks.filter(dir => basename(dir).search(filter) === -1);
  }

  return appPcks;
}

function getPcksWithTests(searchDir, argv) {
  const appPcks = findAppPackages(searchDir);
  const validPks = filterPcks(appPcks, argv);
  const pcksWithATs = argv.u ? [] : validPks.filter(doesPckHaveATs);
  const pcksWithUTs = argv.a ? [] : validPks.filter(doesPckHaveUTs);

  return { pcksWithATs, pcksWithUTs };
}

function runAppTests(searchDir, argv) {
  const { pcksWithATs, pcksWithUTs } = getPcksWithTests(searchDir, argv);
  const webpackConfig = createWebpackConfig(searchDir);

  const atsKarmaConf = pcksWithATs.map(dir => createATsKarmaConf(dir, argv)).map(karmaConf => addWebpackConf(karmaConf, webpackConfig));
  const utsKarmaConf = pcksWithUTs.map(dir => createUTsKarmaConf(dir, argv)).map(karmaConf => addWebpackConf(karmaConf, webpackConfig));

  runPackagesTests(utsKarmaConf.concat(atsKarmaConf), argv.w);
}

module.exports.runAppTests = runAppTests;