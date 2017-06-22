/* eslint no-await-in-loop: 0 */

const { resolve } = require("path");

const { LOG_ERROR } = require("karma/lib/constants");
const parseArgs = require("minimist");
const { DefinePlugin } = require("webpack");

const {
  filterPackagesToTest,
  getTestBrowser,
  runPackageTests,
  runOnlyATs,
  runOnlyUTs,
  showSummary
} = require("./utils");

const args = parseArgs(process.argv.slice(2));
const atsOnly = runOnlyATs(args);
const utsOnly = runOnlyUTs(args);
// If true keep browser open after test run.
const devMode = args.dev || false;
// Packages to test, if the user specifies none all packages will be tested.
const packagesToTest = args._;
const atsTestEntry = resolve(__dirname, "ats-test-entry.js");
const utsTestEntry = resolve(__dirname, "uts-test-entry.js");
const testBrowser = getTestBrowser(args);

const baseKarmaConfig = {
  browsers: [testBrowser],
  logLevel: LOG_ERROR,
  reporters: ["log-update"],
  singleRun: !devMode,
  failOnEmptyTestSuite: true,
  webpackMiddleware: {
    noInfo: true,
    stats: {
      assets: false,
      chunks: false,
      errors: true,
      hash: false,
      version: false,
      warnings: false
    }
  }
};

module.exports.baseKarmaConfig = baseKarmaConfig;

function createPackageKarmaConfig(
  { files = [], frameworks = [], packageDirectory, webpackConfig },
  testEntry
) {
  const karmaFiles = [...files, testEntry];
  const plugins = [
    ...webpackConfig.plugins,
    new DefinePlugin({ PACKAGE_DIRECTORY: `"${packageDirectory}"` })
  ];
  const packageWebpackConfig = Object.assign({}, webpackConfig, {
    entry: testEntry,
    plugins
  });
  const testsType = testEntry === utsTestEntry ? "UTs" : "ATs";

  return Object.assign({}, baseKarmaConfig, {
    preprocessors: {
      [testEntry]: ["webpack", "sourcemap"]
    },
    basePath: packageDirectory,
    files: karmaFiles,
    frameworks,
    webpack: packageWebpackConfig,
    testsType
  });
}

module.exports.createPackageKarmaConfig = createPackageKarmaConfig;

function createConfig(skipTests, packagesMetadata, testEntry) {
  if (skipTests) {
    return [];
  }

  return filterPackagesToTest(
    packagesMetadata,
    packagesToTest
  ).map(packageTestMetadata =>
    createPackageKarmaConfig(packageTestMetadata, testEntry));
}

function createPackagesKarmaConfigs(packagesMetadata) {
  return createConfig(atsOnly, packagesMetadata, utsTestEntry);
}

module.exports.createPackagesKarmaConfigs = createPackagesKarmaConfigs;

function createPackagesATsKarmaConfigs(packagesMetadata) {
  return createConfig(utsOnly, packagesMetadata, atsTestEntry);
}

module.exports.createPackagesATsKarmaConfigs = createPackagesATsKarmaConfigs;

async function runPackagesTests(packagesKarmaConfigs) {
  const results = [];

  // Pressing Control-C must exit the process even if we have queued test runs.
  process.on("SIGINT", process.exit);

  for (const packageKarmaConfig of packagesKarmaConfigs) {
    results.push(await runPackageTests(packageKarmaConfig));
  }

  showSummary(results, devMode);
}

module.exports.runPackagesTests = runPackagesTests;
