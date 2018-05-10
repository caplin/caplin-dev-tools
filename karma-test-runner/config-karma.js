const { existsSync } = require("fs");
const { join, parse } = require("path");

const { addJSTDFiles } = require("@caplin/karma-jstd");
const { LOG_ERROR } = require("@caplin/karma/lib/constants");

const { atsTestEntry, utsTestEntry } = require("./config");
const { getTestBrowser } = require("./utils");

const baseReporters = ["log-update"];

const baseKarmaConfig = {
  logLevel: LOG_ERROR,
  reporters: baseReporters,
  webpackMiddleware: {
    logLevel: "warn",
    stats: {
      all: false,
      colors: true,
      errors: true,
      moduleTrace: true,
      warnings: true
    }
  }
};

function applyBasePathConfig(basePath, karmaConfig) {
  const basePathTestConf = join(basePath, "test.conf.js");

  if (existsSync(basePathTestConf)) {
    const testConf = require(basePathTestConf);

    testConf(karmaConfig);
  }

  // If the base path test conf hasn't added a framework we default to JSTD.
  if (karmaConfig.frameworks.length === 0) {
    addJSTDFiles(karmaConfig);
  }
}

function createKarmaConf(basePath, testEntry, testsType, argv) {
  const browser = getTestBrowser(argv);
  const watch = argv.w;
  const htmlReport = argv.h;
  const showConsoleLogs = argv['show-console-logs'];

  const karmaConfig = Object.assign({}, baseKarmaConfig, {
    basePath,
    reporters: showConsoleLogs ? ["progress"].concat(baseReporters) : baseReporters,
    browsers: [browser],
    files: [testEntry],
    frameworks: [],
    preprocessors: {
      [testEntry]: ["webpack", "sourcemap"]
    },
    singleRun: !watch,
    testsType
  });

  if (htmlReport) {
    const { base } = parse(basePath);
    const htmlFileName = `${testsType}-report-${base}.html`;
    const rootDir = process.cwd();

    karmaConfig.htmlReporter = {
      outputFile: `${rootDir}/reports-${testsType}/${htmlFileName}`,
      pageTitle: `${testsType} Report`,
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true
    };
    karmaConfig.reporters.push("html");
  }

  applyBasePathConfig(basePath, karmaConfig);

  return karmaConfig;
}

module.exports.createKarmaConf = createKarmaConf;

function createATsKarmaConf(packageDirectory, argv) {
  return createKarmaConf(packageDirectory, atsTestEntry, "ATs", argv);
}

module.exports.createATsKarmaConf = createATsKarmaConf;

function createUTsKarmaConf(packageDirectory, argv) {
  return createKarmaConf(packageDirectory, utsTestEntry, "UTs", argv);
}

module.exports.createUTsKarmaConf = createUTsKarmaConf;
