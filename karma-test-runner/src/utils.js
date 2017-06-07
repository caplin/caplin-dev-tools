const { Server } = require("karma");
const { getTotalTime } = require("karma-caplin-dots-reporter");
const { getTotalTestsSkipped } = require("karma-caplin-dots-reporter");

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

function showSummary(
  { success, failed, error, errors, failures, browserError },
  devMode
) {
  if (!devMode) {
    console.log("\n====== Test Report ======");

    printErrors(errors, failures);
    printBrowserErrors(browserError);
    printNoTestRan();
    printSummaryStats(success, failures, errors, browserError);

    if (failed > 0 || browserError.length !== 0) {
      process.exit(1);
    }
  }
}

function printNoTestRan() {
  if (getTotalTime() === 0) {
    console.log(
      "\n\x1b[41m\x1b[30mNo tests were ran, please check your package name is correct.\x1b[0m"
    );
    process.exit(1);
  }
}

function printSummaryStats(success, failures, errors, browserError) {
  if (
    failures.length === 0 &&
    errors.length === 0 &&
    browserError.length === 0
  ) {
    console.log("\n\x1b[42m\x1b[30mTesting ended with no failures!\x1b[0m");
  }

  console.log(`\x1b[35mPassed:\x1b[0m ${success}`);
  console.log(`\x1b[35mFailed:\x1b[0m ${failures.length}`);
  console.log(`\x1b[35mErrors:\x1b[0m ${errors.length}`);
  console.log(`\x1b[35mTotal Tests Skipped:\x1b[0m ${getTotalTestsSkipped()}`);
  console.log(`\x1b[35mTotal Time:\x1b[0m ${getTotalTime() / 1000 + " secs"}`);
}

function printBrowserErrors(browserError) {
  if (browserError.length !== 0) {
    console.log(
      "\n\x1b[41m\x1b[30mTesting ended with Karma Error! A bundle error may have occured in your package.\x1b[0m"
    );
    console.log(
      `${browserError
        .map(packageName => `\nTest Errored in: \x1b[35m${packageName}\n`)
        .join("\n")}\n`
    );
  }
}

function printErrors(errors, failures) {
  if (failed > 0) {
    console.log("\n\x1b[41m\x1b[30mTesting ended with failures/errors!\x1b[0m");

    if (errors.length > 0) {
      console.log(
        `${errors
          .map(
            ({ packageName, error }) =>
              `\nTest errored in: \x1b[35m${packageName}\n${error}`
          )
          .join("\n")}\n`
      );
    }

    if (failures.length > 0) {
      console.log(
        `${failures
          .map(
            ({ packageName, failure }) =>
              `\nTest failed in: \x1b[35m${packageName}\n${failure}`
          )
          .join("\n")}\n`
      );
    }
  }
}

module.exports.showSummary = showSummary;

function getShortPathFromBasePath(basePath) {
  return basePath.substring(basePath.indexOf("apps"));
}

module.exports.getShortPathFromBasePath = getShortPathFromBasePath;

function filterPackagesToTest(packagesTestMetadata, packagesToTest) {
  if (packagesToTest.length === 0) {
    return packagesTestMetadata;
  }

  return packagesTestMetadata.filter(({ packageName }) =>
    packagesToTest.includes(packageName)
  );
}

module.exports.filterPackagesToTest = filterPackagesToTest;

function runPackageTests(karmaConfig, resolve, summary, packageName) {
  console.log(
    `\nRunning ${karmaConfig.testsType} for: \x1b[35m${packageName}\x1b[0m`
  );

  const server = new Server(karmaConfig, () => {
    resolve();
  });

  server.on("run_complete", (browsers, { success, failed, error }) => {
    summary.success += success;
    summary.failed += failed;
    summary.error = summary.error || error;
  });

  server.start();
}

module.exports.runPackageTests = runPackageTests;
