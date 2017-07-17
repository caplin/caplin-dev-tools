/* eslint global-require: 0, import/no-dynamic-require: 0 */

const { existsSync } = require("fs");
const { join } = require("path");

const { addJSTDFiles } = require("@caplin/karma-jstd");
const { LOG_ERROR } = require("karma/lib/constants");

const { atsTestEntry, utsTestEntry } = require("./config");
const { getTestBrowser } = require("./utils");

const baseKarmaConfig = {
  frameworks: [],
  logLevel: LOG_ERROR,
  reporters: ["log-update"],
  webpackMiddleware: {
    noInfo: true,
    stats: {
      assets: false,
      chunks: false,
      errors: true,
      hash: false,
      version: false,
      warnings: false
    }
  }
};

function applyPackageConfig(packageDirectory, karmaConfig) {
  const packageTestConf = join(packageDirectory, "test.conf.js");

  if (existsSync(packageTestConf)) {
    const testConf = require(packageTestConf);

    testConf(karmaConfig);
  }

  // If the package test conf hasn't added a framework we default to JSTD.
  if (karmaConfig.frameworks.length === 0) {
    addJSTDFiles(karmaConfig);
  }
}

function createKarmaConf(packageDirectory, testEntry, testsType, argv) {
  const browser = getTestBrowser(argv);
  const watch = argv.w;
  const karmaConfig = Object.assign({}, baseKarmaConfig, {
    basePath: packageDirectory,
    browsers: [browser],
    files: [testEntry],
    preprocessors: {
      [testEntry]: ["webpack", "sourcemap"]
    },
    singleRun: !watch,
    testsType
  });

  applyPackageConfig(packageDirectory, karmaConfig);

  return karmaConfig;
}

function createATsKarmaConf(packageDirectory, argv) {
  return createKarmaConf(packageDirectory, atsTestEntry, "ATs", argv);
}

module.exports.createATsKarmaConf = createATsKarmaConf;

function createUTsKarmaConf(packageDirectory, argv) {
  return createKarmaConf(packageDirectory, utsTestEntry, "UTs", argv);
}

module.exports.createUTsKarmaConf = createUTsKarmaConf;
