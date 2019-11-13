const combine = require("istanbul-combine");

module.exports = function combineCoverage(currentWorkingDirectory) {
  var opts = {
    dir: "coverage",
    pattern: "coverage/*.json",
    print: "summary",
    base: currentWorkingDirectory,
    reporters: {
      html: {
        dir: "coverage/html"
      },
      json: {
        dir: "coverage/jsonComb"
      }
    }
  };

  combine.sync(opts);
};
