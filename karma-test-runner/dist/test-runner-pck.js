"use strict";

const { sync } = require("glob");

function doesPckHaveATs(packageDirectory) {
  return sync(`${packageDirectory}/**/_test-at/**/*.js`).length > 0;
}

module.exports.doesPckHaveATs = doesPckHaveATs;

function doesPckHaveUTs(packageDirectory) {
  return sync(`${packageDirectory}/**/_test-ut/**/*.js`).length > 0;
}

module.exports.doesPckHaveUTs = doesPckHaveUTs;