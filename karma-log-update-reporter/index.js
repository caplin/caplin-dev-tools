// Karma DI doesn't support classes hence the constructor + prototype funcs.
/* eslint func-names: 0 */

const logUpdate = require("log-update");

const LENGTH_OF_PATH = 40;

// Outline the current tests run status (no. passed, no. failed, etc...)
function testsStatus(
  { endDate, startDate },
  { success, failed, error, skipped }
) {
  let status = "";

  if (success > 0) {
    status = `pass: ${success}`;
  }

  if (skipped > 0) {
    status = `${status} skip: ${skipped}`;
  }

  if (failed > 0) {
    status = `${status} fail: ${failed}`;
  }

  if (error === true) {
    status = `${status} error: true`;
  }

  if (endDate) {
    status = `${status} in ${endDate - startDate}ms`;
  }

  return status;
}

function logMessage({ testsType, basePath, browser }, message) {
  return logUpdate(`${basePath} ${testsType} in ${browser}: ${message}`);
}

function formatErrorText(errorText) {
  if (errorText === null) {
    return `\n  Error text is null.`
  }

  // Indent, strip any whitespace and indent content.
  return `\n  ${errorText.trim().replace(/\n/g, "\n  ")}`;
}

function logFailedResult(failedResult) {
  // Make failure logs appear as child of test header by indenting.
  const log = failedResult.log.map(formatErrorText);
  // Karma sometimes adds spaces/CR to the spec `description`.
  const name = failedResult.description.trim() || "Blank test name";
  // A suite can be a child of a suite, so `suites` is an array.
  const suites = failedResult.suite.join(":") || "Blank test suite";
  // Seperate each log entry.
  const testFailureLog = log.join("\n");
  const testHeading = `\n${suites} : ${name}\n`;
  // Join them or `console.error(x, y)` adds a space between the two strings.
  const testErrorOuput = `${testHeading}${testFailureLog}`;

  console.error(testErrorOuput);
}

function formatBasePath(basePath) {
  if (basePath.length <= LENGTH_OF_PATH) {
    const padding = " ".repeat(LENGTH_OF_PATH - basePath.length);

    return basePath + padding;
  }

  return `...${basePath.slice(-(LENGTH_OF_PATH - 3))}`;
}

function LogUpdateReporter(karmaConfig) {
  this.startDate = new Date();
  this.browser = karmaConfig.browsers[0];
  this.errorMessage = "";
  this.failedResults = [];
  this.results = {
    success: 0,
    skipped: 0,
    failed: 0,
    error: false
  };
  this.basePath = formatBasePath(karmaConfig.basePath);
  this.testsType = karmaConfig.testsType;
}

LogUpdateReporter.prototype.onRunStart = function() {
  logMessage(this, "Test run starting, compiling webpack bundle...");
};

LogUpdateReporter.prototype.onBrowserStart = function(browser) {
  this.browser = browser.name;

  logMessage(this, testsStatus(this, this.results));
};

// Error during parsing/building JS bundle.
LogUpdateReporter.prototype.onBrowserError = function(browser, error) {
  this.errorMessage = error;
};

LogUpdateReporter.prototype.onSpecComplete = function(browser, result) {
  if (result.success === true) {
    this.results.success = this.results.success + 1;
    // When running on jenkins we wish to prevent log lines for passing tests
    if (process.env.BUILD_NUMBER) {
      return;
    }
  } else if (result.success === false) {
    this.results.failed = this.results.failed + 1;
    this.failedResults.push(result);
  } else if (result.skipped === true) {
    this.results.skipped = this.results.skipped + 1;
  }

  logMessage(this, testsStatus(this, this.results));
};

LogUpdateReporter.prototype.onRunComplete = function(browsers, results) {
  this.endDate = new Date();
  logMessage(this, testsStatus(this, results));

  // Persist the logged output. The next test run will use a new log session.
  logUpdate.done();

  this.failedResults.forEach(logFailedResult);

  if (this.errorMessage !== "") {
    console.error("\n", this.errorMessage, "\n");
  }
};

// Tell Karma's DI to provide the karma config to `LogUpdateReporter`.
LogUpdateReporter.$inject = ["config"];

// PUBLISH DI MODULE
module.exports = {
  "reporter:log-update": ["type", LogUpdateReporter]
};
