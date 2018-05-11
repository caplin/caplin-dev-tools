const BaseReporter = require("karma/lib/reporters/base");
const ProgressColorReporter = require("karma/lib/reporters/progress_color");

function getPackageName(path) {
  return path.substring(path.lastIndexOf("/") + 1);
}

// Karma DI doesn't support classes hence the constructor + prototype funcs.
function LogUpdateReporter(karmaConfig, ...progressReporterArgs) {
  ProgressColorReporter.apply(this, progressReporterArgs);

  const packageName = getPackageName(karmaConfig.basePath);
  const progressReporterRender = this._render;
  const logPrefix = `${packageName} ${karmaConfig.testsType} `;

  this._render = function() {
    return logPrefix + progressReporterRender.call(this);
  };
}

// Tell Karma's DI to provide the karma config to `LogUpdateReporter`.
LogUpdateReporter.$inject = [
  "config",
  ...BaseReporter.decoratorFactory.$inject
];

// PUBLISH DI MODULE
module.exports = {
  "reporter:log-update": ["type", LogUpdateReporter]
};
