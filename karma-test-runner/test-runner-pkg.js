const { sync } = require("glob");

function doesPkgHaveATs(packageDirectory) {
  const globOpts = { ignore: [`${packageDirectory}/node_modules/**`] };

  const hasTests = sync(`${packageDirectory}/**/_test-at/**/*.js`, globOpts).length > 0;
  console.log("has ATs?", packageDirectory, hasTests);
  return hasTests;
}

module.exports.doesPkgHaveATs = doesPkgHaveATs;

function doesPkgHaveUTs(packageDirectory) {
  const globOpts = { ignore: [`${packageDirectory}/node_modules/**`] };
  const hasTests = sync(`${packageDirectory}/**/_test-ut/**/*.js`, globOpts).length > 0;

  console.log("has UTs?", packageDirectory, hasTests);
  return hasTests;
}

module.exports.doesPkgHaveUTs = doesPkgHaveUTs;
