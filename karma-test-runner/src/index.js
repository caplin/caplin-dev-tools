const { resolve } = require("path");

const { LOG_ERROR } = require("karma/lib/constants");
const parseArgs = require("minimist");
const { DefinePlugin } = require("webpack");
const { onError } = require("karma-caplin-dots-reporter");

const {
  filterPackagesToTest,
  getShortPathFromBasePath,
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
  caplinDotsReporter: {
    icon: {
      success: ".",
      failure: "F",
      ignore: "-"
    }
  },
  reporters: ["caplin-dots"],
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

function createPackagesKarmaConfigs(packagesTestMetadata) {
  if (atsOnly) {
    return [];
  }

  return filterPackagesToTest(
    packagesTestMetadata,
    packagesToTest
  ).map(packageTestMetadata =>
    createPackageKarmaConfig(packageTestMetadata, utsTestEntry)
  );
}

module.exports.createPackagesKarmaConfigs = createPackagesKarmaConfigs;

function createPackagesATsKarmaConfigs(packagesTestMetadata) {
  if (utsOnly) {
    return [];
  }

  return filterPackagesToTest(
    packagesTestMetadata,
    packagesToTest
  ).map(packageTestMetadata =>
    createPackageKarmaConfig(packageTestMetadata, atsTestEntry)
  );
}

module.exports.createPackagesATsKarmaConfigs = createPackagesATsKarmaConfigs;

async function runPackagesTests(packagesKarmaConfigs) {
  // This might cause issues if our tests start running concurrently,
  // but given we currently run package by package, it should be fine
  let packageName = "";
  const summary = {
    success: 0,
    failed: 0,
    error: false,
    errors: []
  };
  // When the user hits Control-C we want to exit the process even if we have
  // queued test runs.
  process.on("SIGINT", () => {
    console.log("\nTesting stopped due to the process termination\x1b[0m");

    showSummary(summary, devMode);
    process.exit();
  });
  onError(error => {
    summary.errors.push({ packageName, error });
  });

  try {
    for (const packageKarmaConfig of packagesKarmaConfigs) {
      packageName = getShortPathFromBasePath(packageKarmaConfig.basePath);
      await new Promise(resolve =>
        runPackageTests(packageKarmaConfig, resolve, summary, packageName)
      );
    }
  } catch (err) {
    showSummary(summary, devMode);
    console.error(err);
  }

  if (!devMode) {
    showSummary(summary, devMode);
    process.exit(0);
  }
}

module.exports.runPackagesTests = runPackagesTests;
