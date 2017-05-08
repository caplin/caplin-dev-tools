"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { resolve } = require("path");

const { Server } = require("karma");
const { LOG_ERROR } = require("karma/lib/constants");
const parseArgs = require("minimist");
const { DefinePlugin } = require("webpack");
const { onError } = require("karma-caplin-dots-reporter");

const args = parseArgs(process.argv.slice(2));
const atsOnly = args.ats || args.ATs || args._.includes("--ats") || args._.includes("--ATs") || args._.includes("ats") || args._.includes("ATs") || false;
const utsOnly = args.uts || args.UTs || args._.includes("--uts") || args._.includes("--UTs") || args._.includes("uts") || args._.includes("UTs") || false;
// Keeps browser/Karma running after test run.
const devMode = args.dev || false;
// Packages user wants to test, if the user specifies none all packages will be
// tested.
const requestedPackagesToTest = args._;
const atsTestEntry = resolve(__dirname, "ats-test-entry.js");
const utsTestEntry = resolve(__dirname, "uts-test-entry.js");

function retrieveBrowserNameWithCorrectCasing(commandLineArgs) {
  const selectedBrowser = commandLineArgs._[2] || commandLineArgs.b || commandLineArgs.browser || "chrome";
  switch (selectedBrowser.toLowerCase()) {
    case "ie":
      return "IE";
    case "firefox":
      return "Firefox";
    case "chrome":
      return "Chrome";

    default:
      console.log(`${selectedBrowser} is not a supported browser, defaulting to Chrome`);
      return "Chrome";
  }
}

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

function createPackageKarmaConfig({ files = [], frameworks = [], packageDirectory, webpackConfig }, testEntry) {
  const isForUTs = testEntry === utsTestEntry;
  const karmaFiles = [...files, testEntry];

  const plugins = [...webpackConfig.plugins, new DefinePlugin({ PACKAGE_DIRECTORY: `"${packageDirectory}"` })];
  const packageWebpackConfig = _extends({}, webpackConfig, {
    entry: testEntry,
    plugins
  });
  const packageKarmaConfig = _extends({}, baseKarmaConfig, {
    preprocessors: {
      [testEntry]: ["webpack", "sourcemap"]
    },
    basePath: packageDirectory,
    files: karmaFiles,
    frameworks,
    webpack: packageWebpackConfig,
    isForUTs
  });

  return packageKarmaConfig;
}

module.exports.createPackageKarmaConfig = createPackageKarmaConfig;

function getShortPathFromBasePath(basePath) {
  return basePath.substring(basePath.indexOf("apps"));
}

function runPackageTests(packageKarmaConfig, resolvePromise, summary, packageName) {
  const testType = packageKarmaConfig.isForUTs ? "UTs" : "ATs";

  console.log(`\nRunning ${testType} for: \x1b[35m${packageName}\x1b[0m`);

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

module.exports.createPackagesKarmaConfigs = function createPackagesKarmaConfigs(packagesTestMetadata) {
  if (atsOnly) {
    return [];
  }

  return filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata).map(packageTestMetadata => createPackageKarmaConfig(packageTestMetadata, utsTestEntry));
};

module.exports.createPackagesATsKarmaConfigs = function createPackagesATsKarmaConfigs(packagesTestMetadata) {
  if (utsOnly) {
    return [];
  }

  return filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata).map(packageTestMetadata => createPackageKarmaConfig(packageTestMetadata, atsTestEntry));
};

function showSummary({ success, failed, error, errors }) {
  if (!devMode) {
    console.log("\n== Test Report ==");

    if (failed > 0 || error) {
      console.log("\n\x1b[41m\x1b[30mTesting ended with failures/errors!\x1b[0m");
      console.log(`${errors.map(({ packageName, error }) => `\nTest failed in: \x1b[35m${packageName}\n${error}`).join("\n")}\n`);
    } else {
      console.log("\n\x1b[42m\x1b[30mTesting ended with no failures!\x1b[0m");
    }

    console.log(`\x1b[35mPassed:\x1b[0m ${success}`);
    console.log(`\x1b[35mFailed:\x1b[0m ${failed}`);
    console.log(`\x1b[35mErrors:\x1b[0m ${error ? "Yes" : "No"}`);

    if (failed > 0 || error) {
      process.exit(1);
    }
  }
}

module.exports.runPackagesTests = (() => {
  var _ref = _asyncToGenerator(function* (packagesKarmaConfigs) {
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
    process.on("SIGINT", function () {
      console.log("\nTesting stopped due to the process termination\x1b[0m");

      showSummary(summary);
      process.exit();
    });
    onError(function (error) {
      summary.errors.push({ packageName, error });
    });

    try {
      for (const packageKarmaConfig of packagesKarmaConfigs) {
        packageName = getShortPathFromBasePath(packageKarmaConfig.basePath);
        yield new Promise(function (resolve) {
          return runPackageTests(packageKarmaConfig, resolve, summary, packageName);
        });
      }
    } catch (err) {
      showSummary(summary);
      console.error(err);
    }

    if (!devMode) {
      showSummary(summary);
      process.exit(0);
    }
  });

  function runPackagesTests(_x) {
    return _ref.apply(this, arguments);
  }

  return runPackagesTests;
})();
