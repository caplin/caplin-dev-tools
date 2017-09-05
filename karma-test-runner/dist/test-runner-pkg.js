"use strict";

const { sync } = require("glob");

function doesPkgHaveATs(packageDirectory) {
  const globOpts = { ignore: [`${packageDirectory}/node_modules/**`] };

  return sync(`${packageDirectory}/**/_test-at/**/*.js`, globOpts).length > 0;
}

module.exports.doesPkgHaveATs = doesPkgHaveATs;

function doesPkgHaveUTs(packageDirectory) {
  const globOpts = { ignore: [`${packageDirectory}/node_modules/**`] };

  return sync(`${packageDirectory}/**/_test-ut/**/*.js`, globOpts).length > 0;
}

module.exports.doesPkgHaveUTs = doesPkgHaveUTs;