'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.runPackagesTests = exports.baseKarmaConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let runPackagesTests = exports.runPackagesTests = (() => {
	var ref = _asyncToGenerator(function* (packagesKarmaConfigs) {
		try {
			for (const packageKarmaConfig of packagesKarmaConfigs) {
				yield new Promise(function (resolve) {
					return runPackageTests(packageKarmaConfig, resolve);
				});
			}
		} catch (err) {
			console.error(err);
		}

		if (!devMode) {
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

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _webpack = require('webpack');

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
	preprocessors: {
		[testEntry]: ['webpack']
	},
	singleRun: !devMode,
	webpackMiddleware: {
		stats: {
			assets: false,
			colors: true,
			chunks: false,
			'errors-only': true
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

function runPackageTests(packageKarmaConfig, resolvePromise) {
	const server = new _karma.Server(packageKarmaConfig, exitCode => {
		if (exitCode === 0) {
			resolvePromise();
		} else if (!devMode) {
			process.exit(exitCode); //eslint-disable-line
		}
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