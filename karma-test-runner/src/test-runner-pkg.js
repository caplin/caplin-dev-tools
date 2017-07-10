const { sync } = require("glob");

function doesPkgHaveATs(packageDirectory) {
  return sync(`${packageDirectory}/**/_test-at/**/*.js`).length > 0;
}

module.exports.doesPkgHaveATs = doesPkgHaveATs;

function doesPkgHaveUTs(packageDirectory) {
  return sync(`${packageDirectory}/**/_test-ut/**/*.js`).length > 0;
}

module.exports.doesPkgHaveUTs = doesPkgHaveUTs;
