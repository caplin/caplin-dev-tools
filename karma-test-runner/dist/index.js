'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.runPackagesTests = exports.baseKarmaConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let runPackagesTests = exports.runPackagesTests = (() => {
	var ref = _asyncToGenerator(function* (packagesKarmaConfigs) {
		// When the user hits Control-C we want to exit the process even if we have queued test runs.
		process.on('SIGINT', function () {
			console.log('\nTesting has been terminated due to the process being exited!\x1b[0m');
			showSummary(summary);
			process.exit();
		});
		const summary = {
			success: 0,
			failed: 0,
			error: false,
			errors: []
		};
		(0, _karmaCaplinDotsReporter.onError)(function (error) {
			summary.errors.push(error);
		});

		try {
			for (const packageKarmaConfig of packagesKarmaConfigs) {
				yield new Promise(function (resolve) {
					return runPackageTests(packageKarmaConfig, resolve, summary);
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
		return ref.apply(this, arguments);
	};
})();

exports.createPackagesKarmaConfigs = createPackagesKarmaConfigs;

var _path = require('path');

var _karma = require('karma');

var _constants = require('karma/lib/constants');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _webpack = require('webpack');

var _karmaCaplinDotsReporter = require('karma-caplin-dots-reporter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const args = (0, _minimist2.default)(process.argv.slice(2));
// Keeps browser/Karma running after test run.
const devMode = args.dev || false;
// Packages user wants to test, if the user specifies none all packages will be tested.
const requestedPackagesToTest = args._;
const testEntry = (0, _path.resolve)(__dirname, 'test-entry.js');

const baseKarmaConfig = exports.baseKarmaConfig = {
	browsers: ['Chrome'],
	logLevel: _constants.LOG_ERROR,
	preprocessors: {
		[testEntry]: ['webpack', 'sourcemap']
	},
	reporters: ['caplin-dots'],
	caplinDotsReporter: {
		icon: {
			success : '.',
			failure : 'F',
			ignore  : '-'
		}
	}
	singleRun: !devMode,
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

function createPackageKarmaConfig({ filesToServe, packageDirectory, webpackConfig, frameworks }) {
	const files = [testEntry];

	if (filesToServe) {
		files.push(filesToServe);
	}

	const plugins = [new _webpack.DefinePlugin({ PACKAGE_DIRECTORY: `"${ packageDirectory }"` })];
	const packageWebpackConfig = _extends({}, webpackConfig, {
		entry: testEntry,
		plugins
	});
	const packageKarmaConfig = _extends({}, baseKarmaConfig, {
		basePath: packageDirectory,
		files,
		frameworks,
		webpack: packageWebpackConfig
	});

	return packageKarmaConfig;
}

function runPackageTests(packageKarmaConfig, resolvePromise, summary) {
	console.log('Running tests for: \x1b[35m' + packageKarmaConfig.basePath + '\x1b[0m');

	const server = new _karma.Server(packageKarmaConfig, exitCode => {
		if (exitCode === 0) {
			resolvePromise();
		} else if (!devMode) {
			console.log(`\nTesting has been terminated early due to test(s) failing in: \x1b[35m${ packageKarmaConfig.basePath }\x1b[0m`);
			showSummary(summary);
			process.exit(0); //eslint-disable-line
		}
	});

	server.on('run_complete', (browsers, { success, failed, error, logs }) => {
		summary.success += success;
		summary.failed += failed;
		summary.error = summary.error || error;
	});

	server.start();
}

function createPackagesKarmaConfigs(packagesTestMetadata) {
	return packagesTestMetadata.filter(({ packageName }) => {
		if (requestedPackagesToTest.length === 0) {
			return true;
		}

		return requestedPackagesToTest.includes(packageName);
	}).map(createPackageKarmaConfig);
}

function showSummary({ success, failed, error }) {
	if (failed > 0 || error) {
		console.log(`\nSummary: \x1b[41m\x1b[30mTesting ended with failures/errors!\x1b[0m`);
		console.log(errors.join('\n') + '\n');
	} else {
		console.log(`\nSummary: \x1b[42m\x1b[30mTesting ended with no failures!\x1b[0m`);
	}
	console.log(`\x1b[35mPassed:\x1b[0m ${ success }`);
	console.log(`\x1b[35mFailed:\x1b[0m ${ failed }`);
	console.log(`\x1b[35mErrors:\x1b[0m ${ error ? 'Yes' : 'No' }`);
}