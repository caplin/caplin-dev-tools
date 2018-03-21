"use strict";

let runPackagesTests = (() => {
  var _ref = _asyncToGenerator(function* (packagesKarmaConfigs, watching) {
    const results = [];

    // Pressing Control-C must exit the process even if we have queued test runs.
    process.on("SIGINT", process.exit);

    for (const packageKarmaConfig of packagesKarmaConfigs) {
      results.push((yield runPackageTests(packageKarmaConfig)));
    }

    showSummary(results, watching);
  });

  return function runPackagesTests(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint no-await-in-loop: 0 */

const { Server } = require("karma");

function getSelectedBrowser(commandLineArgs) {
  const browser = commandLineArgs.b;

  if (browser === "headless") {
    return "chrome-headless";
  }

  return browser.toLowerCase();
}

function getTestBrowser(argv) {
  const selectedBrowser = getSelectedBrowser(argv);

  switch (selectedBrowser) {
    case "ie":
      return "IE";
    case "firefox":
      return "Firefox";
    case "chrome":
      return "Chrome";
    case "chrome-headless":
      return "ChromeHeadless";

    default:
      console.log(`${selectedBrowser} is not a supported browser, defaulting to Chrome`);
      return "Chrome";
  }
}

module.exports.getTestBrowser = getTestBrowser;

function showSummary(results, watching) {
  let error = false;
  let exitCode = 0;
  let failed = 0;
  let skipped = 0;
  let success = 0;
  let disconnected = [];

  for (const result of results) {
    error = error || result.error;
    failed += result.failed;
    // `skipped` is only set to a number if there are skipped tests.
    skipped += result.skipped || 0;
    success += result.success;
    if (result.disconnected) {
      disconnected.push(result.packageName);
    }
  }

  let status = `\nspecs: ${failed + skipped + success}`;

  if (success > 0) {
    status = `${status}, pass: ${success}`;
  }

  if (skipped > 0) {
    status = `${status}, skip: ${skipped}`;
  }

  if (failed > 0) {
    status = `${status}, fail: ${failed}`;
  }

  if (error === true) {
    status = `${status}, error: true`;
  }

  if (disconnected.length > 0) {
    status = `${status} \n${disconnected.length} packages disconnected:\n${disconnected.join("\n")}`;
  }

  if (failed > 0 || error) {
    exitCode = 1;
  }

  console.log(status);

  if (watching === false) {
    process.exit(exitCode);
  }
}

function runPackageTests(karmaConfig) {
  return new Promise(resolve => {
    let testsResult;
    const server = new Server(karmaConfig, () => {
      // Wait until the server exit code callback is executed to resolve as
      // `run_complete` is called before the logger's `onRunComplete` is.
      resolve(testsResult);
    });

    server.on("run_complete", (browsers, result) => {
      testsResult = result;
    });

    server.start();
  });
}

module.exports.runPackagesTests = runPackagesTests;