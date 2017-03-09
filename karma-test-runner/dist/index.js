'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.runPackagesTests = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let runPackagesTests = exports.runPackagesTests = (() => {
	var _ref = _asyncToGenerator(function* (packagesKarmaConfigs) {
		// When the user hits Control-C we want to exit the process even if we have queued test runs.
		process.on('SIGINT', function () {
			console.log('\nTesting has been terminated due to the process being exited!\x1b[0m');
			showSummary(summary);
			process.exit();
		});
		// this might bring up issues if our tests start running concurrently,
		// but given we currently run package by package, it should be fine
		let packageName = '';
		const summary = {
			success: 0,
			failed: 0,
			error: false,
			errors: []
		};
		(0, _karmaCaplinDotsReporter.onError)(function (error) {
			summary.errors.push({ packageName, error });
		});

		try {
			for (const packageKarmaConfig of packagesKarmaConfigs) {
				packageName = getShortPathFromBasePath(packageKarmaConfig.basePath);
				yield new Promise(function (resolve) {
					return runPackageTests(packageKarmaConfig, resolve, summary, packageName);
				});
			}
		} catch (err) {
			showSummary(summary);
			console.error(err);
		}

		if (!devMode) {
			showSummary(summary);
			process.exit(0);
		}
	});

	return function runPackagesTests(_x) {
		return _ref.apply(this, arguments);
	};
})();

exports.createPackagesKarmaConfigs = createPackagesKarmaConfigs;
exports.createPackagesATsKarmaConfigs = createPackagesATsKarmaConfigs;

var _path = require('path');

var _karma = require('karma');

var _constants = require('karma/lib/constants');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _webpack = require('webpack');

var _karmaCaplinDotsReporter = require('karma-caplin-dots-reporter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const args = (0, _minimist2.default)(process.argv.slice(2));
// Keeps browser/Karma running after test run.
const atsOnly = args.ats || args._.includes('--ats') || args._.includes('--ATs') || false;
const utsOnly = args.uts || args._.includes('--uts') || args._.includes('--UTs') || false;
const devMode = args.dev || false;
// Packages user wants to test, if the user specifies none all packages will be tested.
const requestedPackagesToTest = args._;
const atsTestEntry = (0, _path.resolve)(__dirname, 'ats-test-entry.js');
const utsTestEntry = (0, _path.resolve)(__dirname, 'uts-test-entry.js');

const testBrowser = retrieveBrowserNameWithCorrectCasing(args);

const baseKarmaConfig = {
	browsers: [testBrowser],
	logLevel: _constants.LOG_ERROR,
	caplinDotsReporter: {
		icon: {
			success: '.',
			failure: 'F',
			ignore: '-'
		}
	},
	reporters: ['caplin-dots'],
	singleRun: !devMode,
	failOnEmptyTestSuite: true,
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

function retrieveBrowserNameWithCorrectCasing(commandLineArgs) {
	let browserArg = commandLineArgs['b'] || commandLineArgs['browser'] || 'chrome';
	switch (selectedBrowser.toLowerCase()) {

		case 'ie':
			return 'IE';
		case 'firefox':
			return 'Firefox';
		case 'chrome':
			return 'Chrome';

		default:
			console.log(browser + ' is not a supported browser, defaulting to Chrome');
			return 'Chrome';
	}
}

function createPackageKarmaConfig({ files = [], frameworks = [], packageDirectory, webpackConfig }, testEntry) {
	const karmaFiles = [...files, testEntry];

	const plugins = [new _webpack.DefinePlugin({ PACKAGE_DIRECTORY: `"${packageDirectory}"` })];
	const packageWebpackConfig = _extends({}, webpackConfig, {
		entry: testEntry,
		plugins
	});
	const packageKarmaConfig = _extends({}, baseKarmaConfig, {
		preprocessors: {
			[testEntry]: ['webpack', 'sourcemap']
		},
		basePath: packageDirectory,
		files: karmaFiles,
		frameworks,
		webpack: packageWebpackConfig
	});

	return packageKarmaConfig;
}

function getShortPathFromBasePath(basePath) {
	return basePath.substring(basePath.indexOf('apps'));
}

function runPackageTests(packageKarmaConfig, resolvePromise, summary, packageName) {
	console.log('\nRunning tests for: \x1b[35m' + packageName + '\x1b[0m');

	const server = new _karma.Server(packageKarmaConfig, exitCode => {
		resolvePromise();
	});

	server.on('run_complete', (browsers, { success, failed, error, logs }) => {
		summary.success += success;
		summary.failed += failed;
		summary.error = summary.error || error;
	});

	server.start();
}

function filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata) {
	return packagesTestMetadata.filter(({ packageName }) => {
		if (requestedPackagesToTest.length === 0) {
			return true;
		}

		return requestedPackagesToTest.includes(packageName);
	});
}

function createPackagesKarmaConfigs(packagesTestMetadata) {
	if (atsOnly) {
		return [];
	}

	return filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata).map(packageTestMetadata => createPackageKarmaConfig(packageTestMetadata, utsTestEntry));
}

function createPackagesATsKarmaConfigs(packagesTestMetadata) {
	if (utsOnly) {
		return [];
	}

	return filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata).map(packageTestMetadata => createPackageKarmaConfig(packageTestMetadata, atsTestEntry));
}

function showSummary({ success, failed, error, errors }) {
	if (!devMode) {
		console.log(`\n== Test Report ==`);
		if (failed > 0 || error) {
			console.log(`\n\x1b[41m\x1b[30mTesting ended with failures/errors!\x1b[0m`);
			console.log(errors.map(({ packageName, error }) => `\nTest failed in: \x1b[35m${packageName}\n${error}`).join('\n') + '\n');
		} else {
			console.log(`\n\x1b[42m\x1b[30mTesting ended with no failures!\x1b[0m`);
		}
		console.log(`\x1b[35mPassed:\x1b[0m ${success}`);
		console.log(`\x1b[35mFailed:\x1b[0m ${failed}`);
		console.log(`\x1b[35mErrors:\x1b[0m ${error ? 'Yes' : 'No'}`);
		if (failed > 0 || error) {
			process.exit(1);
		}
	}
}