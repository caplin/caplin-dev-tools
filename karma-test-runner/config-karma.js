const { existsSync } = require("fs");
const { join, basename } = require("path");

const { addJSTDFiles } = require("@caplin/karma-jstd");
const { LOG_ERROR } = require("karma/lib/constants");

const { atsTestEntry, utsTestEntry } = require("./config");
const { getTestBrowser } = require("./utils");

const { cloneDeep } = require("lodash");

const baseKarmaConfig = {
  logLevel: LOG_ERROR,
  plugins: ["karma-*"],
  reporters: ["log-update"],
  browserDisconnectTimeout: 30000,
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
  const coverageReport = argv.c;
  // Takes a copy of baseKarmaConfig to prevent subjects from being modified.
  const baseCopy = cloneDeep(baseKarmaConfig);
  const karmaConfig = Object.assign({}, baseCopy, {
    basePath,
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
    const base = basename(basePath);
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

  if (coverageReport) {
    const base = basename(basePath);
    const coverageConfig = {
      coverageIstanbulReporter: {
        reports: ["json", "lcov"],
        fixWebpackSourcePaths: true,
        combineBrowserReports: true,
        skipFilesWithNoCoverage: false,
        "report-config": {
          json: {
            file: `${base}-${testsType}-coverage-report.json`
          }
        },
        instrumentation: {
          // To include `node_modules` code in the report.
          "default-excludes": false
        }
      }
    };

    karmaConfig.reporters.push("coverage-istanbul");

    Object.assign(karmaConfig, coverageConfig);
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
