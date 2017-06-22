const { Server } = require("karma");

function runOnlyATs(args) {
  return args.ats ||
    args.ATs ||
    args._.includes("--ats") ||
    args._.includes("--ATs") ||
    args._.includes("ats") ||
    args._.includes("ATs") ||
    false;
}

module.exports.runOnlyATs = runOnlyATs;

function runOnlyUTs(args) {
  return args.uts ||
    args.UTs ||
    args._.includes("--uts") ||
    args._.includes("--UTs") ||
    args._.includes("uts") ||
    args._.includes("UTs") ||
    false;
}

module.exports.runOnlyUTs = runOnlyUTs;

function getSelectedBrowser(commandLineArgs) {
  let browser = commandLineArgs.b || commandLineArgs.browser || "chrome";
  const optionlessArgs = commandLineArgs._;
  const browserIndex = optionlessArgs.indexOf("--browser");

  if (browserIndex !== -1) {
    browser = optionlessArgs[browserIndex + 1];
  }

  // To be removed once Chrome Headless supports Windows
  const isWin = /^win/.test(process.platform);
  if (browser === "headless") {
    if (isWin) {
      browser = "phantom-js";
    } else {
      browser = "chrome-headless";
    }
  }

  return browser.toLowerCase();
}

function getTestBrowser(commandLineArgs) {
  const selectedBrowser = getSelectedBrowser(commandLineArgs);

  switch (selectedBrowser) {
    case "ie":
      return "IE";
    case "firefox":
      return "Firefox";
    case "chrome":
      return "Chrome";
    case "chrome-headless":
      return "ChromeHeadless";
    case "phantom-js":
      return "PhantomJS";

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

module.exports.showSummary = showSummary;

function filterPackagesToTest(packagesTestMetadata, packagesToTest) {
  if (packagesToTest.length === 0) {
    return packagesTestMetadata;
  }

  return packagesTestMetadata.filter(({ packageName }) =>
    packagesToTest.includes(packageName));
}

module.exports.filterPackagesToTest = filterPackagesToTest;

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

module.exports.runPackageTests = runPackageTests;
