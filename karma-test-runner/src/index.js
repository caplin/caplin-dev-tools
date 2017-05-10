const { resolve } = require("path");

const { Server } = require("karma");
const { LOG_ERROR } = require("karma/lib/constants");
const parseArgs = require("minimist");
const { DefinePlugin } = require("webpack");
const { onError } = require("karma-caplin-dots-reporter");

const {
  retrieveBrowserNameWithCorrectCasing,
  runOnlyATs,
  runOnlyUTs,
  showSummary
} = require("./utils");

const args = parseArgs(process.argv.slice(2));
const atsOnly = runOnlyATs(args);
const utsOnly = runOnlyUTs(args);
// Keeps browser/Karma running after test run.
const devMode = args.dev || false;
// Packages to test, if the user specifies none all packages will be tested.
const requestedPackagesToTest = args._;
const atsTestEntry = resolve(__dirname, "ats-test-entry.js");
const utsTestEntry = resolve(__dirname, "uts-test-entry.js");
const testBrowser = retrieveBrowserNameWithCorrectCasing(args);

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
  const testsType = testEntry === utsTestEntry ? "UTs" : "ATs";
  const karmaFiles = [...files, testEntry];

  const plugins = [
    ...webpackConfig.plugins,
    new DefinePlugin({ PACKAGE_DIRECTORY: `"${packageDirectory}"` })
  ];
  const packageWebpackConfig = Object.assign({}, webpackConfig, {
    entry: testEntry,
    plugins
  });
  const packageKarmaConfig = Object.assign({}, baseKarmaConfig, {
    preprocessors: {
      [testEntry]: ["webpack", "sourcemap"]
    },
    basePath: packageDirectory,
    files: karmaFiles,
    frameworks,
    webpack: packageWebpackConfig,
    testsType
  });

  return packageKarmaConfig;
}

module.exports.createPackageKarmaConfig = createPackageKarmaConfig;

function getShortPathFromBasePath(basePath) {
  return basePath.substring(basePath.indexOf("apps"));
}

function runPackageTests(
  packageKarmaConfig,
  resolvePromise,
  summary,
  packageName
) {
  console.log(
    `\nRunning ${packageKarmaConfig.testsType} for: \x1b[35m${packageName}\x1b[0m`
  );

  const server = new Server(packageKarmaConfig, () => {
    resolvePromise();
  });

  server.on("run_complete", (browsers, { success, failed, error }) => {
    summary.success += success;
    summary.failed += failed;
    summary.error = summary.error || error;
  });

  server.start();
}

function filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata) {
  return packagesTestMetadata.filter(({ packageName }) => {
    if (requestedPackagesToTest.length === 0) {
      return true;
    }

    return requestedPackagesToTest.includes(packageName);
  });
}

module.exports.createPackagesKarmaConfigs = function createPackagesKarmaConfigs(
  packagesTestMetadata
) {
  if (atsOnly) {
    return [];
  }

  return filterPackagesToTestIfFilterIsSpecified(
    packagesTestMetadata
  ).map(packageTestMetadata =>
    createPackageKarmaConfig(packageTestMetadata, utsTestEntry)
  );
};

module.exports.createPackagesATsKarmaConfigs = function createPackagesATsKarmaConfigs(
  packagesTestMetadata
) {
  if (utsOnly) {
    return [];
  }

  return filterPackagesToTestIfFilterIsSpecified(
    packagesTestMetadata
  ).map(packageTestMetadata =>
    createPackageKarmaConfig(packageTestMetadata, atsTestEntry)
  );
};

module.exports.runPackagesTests = async function runPackagesTests(
  packagesKarmaConfigs
) {
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
};
