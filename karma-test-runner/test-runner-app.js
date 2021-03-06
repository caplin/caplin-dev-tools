const { basename } = require("path");

const { createATsKarmaConf, createUTsKarmaConf } = require("./config-karma");
const { addWebpackConf } = require("./config-webpack");
const { findAppPackages, getDependencies } = require("./search");
const { doesPkgHaveATs, doesPkgHaveUTs } = require("./test-runner-pkg");
const { runPackagesTests } = require("./utils");
const { createBlankCoverage } = require("./coverage/EmptyCoverageCreator");

// `f` are package name RegExps to filter out packages e.g. `^br-` or `^ct-`.
// `_` are the list of packages specified by the user on the CLI.
function filterPkgs(appPkgs, { _, f }) {
  // Specifying packages on the CLI trumps `-f` options.
  if (_.length > 0) {
    return appPkgs.filter(dir => _.includes(basename(dir)));
  }

  let regExpString = f;

  // Were we given multiple package regexps.
  if (Array.isArray(regExpString)) {
    regExpString = regExpString.join("|");
  }

  if (regExpString) {
    const filter = new RegExp(regExpString);

    return appPkgs.filter(dir => basename(dir).search(filter) === -1);
  }

  return appPkgs;
}

function getPkgsWithTests(searchDir, argv) {
  const appPkgs = findAppPackages(searchDir, argv);
  const validPks = filterPkgs(appPkgs, argv);
  const pkgsWithATs = argv.u ? [] : validPks.filter(doesPkgHaveATs);
  const pkgsWithUTs = argv.a ? [] : validPks.filter(doesPkgHaveUTs);

  return { pkgsWithATs, pkgsWithUTs, validPks };
}

function runAppTests(appDir, argv) {
  const { pkgsWithATs, pkgsWithUTs, validPks } = getPkgsWithTests(appDir, argv);
  if (argv.c) {
    createBlankCoverage(
      argv._,
      validPks,
      argv.includePackages,
      getDependencies(appDir)
    );
  }
  const atsKarmaConf = pkgsWithATs
    .map(dir => createATsKarmaConf(dir, argv))
    .map(karmaConf => addWebpackConf(karmaConf, appDir, argv));
  const utsKarmaConf = pkgsWithUTs
    .map(dir => createUTsKarmaConf(dir, argv))
    .map(karmaConf => addWebpackConf(karmaConf, appDir, argv));

  runPackagesTests(utsKarmaConf.concat(atsKarmaConf), argv.w, argv.c, appDir);
}

module.exports.runAppTests = runAppTests;
