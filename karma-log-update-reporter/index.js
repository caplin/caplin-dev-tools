// Karma DI doesn't handle classes so we can't export a class directly.
/* eslint func-names: 0 */
const logUpdate = require("log-update");

function testsStatus(
  { specsInfo: { total } },
  { success, failed, error, skipped }
) {
  let status = `specs: ${total}`;

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

  return status;
}

function logMessage({ testsType, packageDir, browser }, message) {
  return logUpdate(`${packageDir} ${testsType} in ${browser}: ${message}`);
}

function LogUpdateReporter(karmaConfig) {
  this.browser = karmaConfig.browsers[0];
  this.results = {
    success: 0,
    skipped: 0,
    failed: 0,
    error: false
  };
  this.packageDir = karmaConfig.packageDir;
  this.testsType = karmaConfig.testsType;

  logUpdate.done();

  logMessage(this, "Creating log update reporter.");
}

LogUpdateReporter.prototype.onRunComplete = function(browsers, results) {
  logMessage(this, testsStatus(this, results));
};

LogUpdateReporter.prototype.onBrowserStart = function(browser, specsInfo) {
  this.browser = browser.name;
  this.specsInfo = specsInfo;

  logMessage(this, testsStatus(this, this.results));
};

LogUpdateReporter.prototype.onRunStart = function() {
  logMessage(this, "Test run starting, compiling webpack bundle...");
};

LogUpdateReporter.prototype.onSpecComplete = function(browser, result) {
  if (result.success === true) {
    this.results.success = this.results.success + 1;
  } else if (result.success === false) {
    this.results.failed = this.results.failed + 1;
  } else if (result.skipped === true) {
    this.results.skipped = this.results.skipped + 1;
  }

  logMessage(this, testsStatus(this, this.results));
};

LogUpdateReporter.$inject = ["config"];

// PUBLISH DI MODULE
module.exports = {
  "reporter:log-update": ["type", LogUpdateReporter]
};
