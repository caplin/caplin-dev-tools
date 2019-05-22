const { existsSync } = require("fs");
const { join, parse } = require("path");

const { addJSTDFiles } = require("@caplin/karma-jstd");
const { LOG_ERROR } = require("karma/lib/constants");

const { atsTestEntry, utsTestEntry } = require("./config");
const { getTestBrowser } = require("./utils");

const baseKarmaConfig = {
  logLevel: LOG_ERROR,
  plugins: ["karma-*"],
  reporters: ["log-update"],
  webpackMiddleware: {
    logLevel: "warn",
    stats: {
      all: false,
      colors: true,
      errors: true,
      moduleTrace: true,
      warnings: true
    }
  },
  browserDisconnectTolerance: 5
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
  const baseCopy = JSON.parse(JSON.stringify(baseKarmaConfig));
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

  if (coverageReport) {
    const { base } = parse(basePath);

    const coverageConfig = {
      coverageReporter: {
        type: "in-memory"
      },

      coverageIstanbulReporter: {
        reports: ["text-summary", "json"],
        fixWebpackSourcePaths: true,
        combineBrowserReports: true,
        skipFilesWithNoCoverage: false,
        "report-config": {
          // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
          html: {
            // outputs the report in ./coverage/html
            subdir: "html"
          },
          json: {
            file: `${base}-${testsType}-coverage-report.json`
          }
        }
      }
    };

    karmaConfig.reporters.push("coverage");
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
