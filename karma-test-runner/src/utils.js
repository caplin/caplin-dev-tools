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
      console.log(
        `${selectedBrowser} is not a supported browser, defaulting to Chrome`
      );
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

  for (const result of results) {
    error = error || result.error;
    failed += result.failed;
    // `skipped` is only set to a number if there are skipped tests.
    skipped += result.skipped || 0;
    success += result.success;
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

async function runPackagesTests(packagesKarmaConfigs, watching) {
  const results = [];

  // Pressing Control-C must exit the process even if we have queued test runs.
  process.on("SIGINT", process.exit);

  for (const packageKarmaConfig of packagesKarmaConfigs) {
    results.push(await runPackageTests(packageKarmaConfig));
  }

  showSummary(results, watching);
}

module.exports.runPackagesTests = runPackagesTests;
