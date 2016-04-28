'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.runPackagesTests = exports.baseKarmaConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var runPackagesTests = exports.runPackagesTests = function () {
	var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(packagesKarmaConfigs) {
		var _this = this;

		var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

		return regeneratorRuntime.wrap(function _callee$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.prev = 0;
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context2.prev = 4;
						_loop = regeneratorRuntime.mark(function _loop() {
							var packageKarmaConfig;
							return regeneratorRuntime.wrap(function _loop$(_context) {
								while (1) {
									switch (_context.prev = _context.next) {
										case 0:
											packageKarmaConfig = _step.value;
											_context.next = 3;
											return new Promise(function (resolve) {
												return runPackageTests(packageKarmaConfig, resolve);
											});

										case 3:
										case 'end':
											return _context.stop();
									}
								}
							}, _loop, _this);
						});
						_iterator = packagesKarmaConfigs[Symbol.iterator]();

					case 7:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							_context2.next = 12;
							break;
						}

						return _context2.delegateYield(_loop(), 't0', 9);

					case 9:
						_iteratorNormalCompletion = true;
						_context2.next = 7;
						break;

					case 12:
						_context2.next = 18;
						break;

					case 14:
						_context2.prev = 14;
						_context2.t1 = _context2['catch'](4);
						_didIteratorError = true;
						_iteratorError = _context2.t1;

					case 18:
						_context2.prev = 18;
						_context2.prev = 19;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 21:
						_context2.prev = 21;

						if (!_didIteratorError) {
							_context2.next = 24;
							break;
						}

						throw _iteratorError;

					case 24:
						return _context2.finish(21);

					case 25:
						return _context2.finish(18);

					case 26:
						_context2.next = 31;
						break;

					case 28:
						_context2.prev = 28;
						_context2.t2 = _context2['catch'](0);

						console.error(_context2.t2);

					case 31:

						if (!devMode) {
							process.exit(0);
						}

					case 32:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee, this, [[0, 28], [4, 14, 18, 26], [19,, 21, 25]]);
	}));

	return function runPackagesTests(_x) {
		return ref.apply(this, arguments);
	};
}();

exports.createPackagesKarmaConfigs = createPackagesKarmaConfigs;

var _path = require('path');

var _karma = require('karma');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _webpack = require('webpack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var args = (0, _minimist2.default)(process.argv.slice(2));
// Keeps browser/Karma running after test run.
var devMode = args.dev || false;
// Packages user wants to test, if the user specifies none all packages will be tested.
var requestedPackagesToTest = args._;
var testEntry = (0, _path.resolve)(__dirname, 'test-entry.js');

var baseKarmaConfig = exports.baseKarmaConfig = {
	browsers: ['Chrome'],
	preprocessors: _defineProperty({}, testEntry, ['webpack']),
	singleRun: !devMode,
	webpackMiddleware: {
		stats: {
			assets: false,
			colors: true,
			chunks: false
		}
	}
};

function createPackageKarmaConfig(_ref) {
	var filesToServe = _ref.filesToServe;
	var packageDirectory = _ref.packageDirectory;
	var webpackConfig = _ref.webpackConfig;
	var frameworks = _ref.frameworks;

	var files = [testEntry];

	if (filesToServe) {
		files.push(filesToServe);
	}

	var plugins = [new _webpack.DefinePlugin({ PACKAGE_DIRECTORY: '"' + packageDirectory + '"' })];
	var packageWebpackConfig = _extends({}, webpackConfig, {
		entry: testEntry,
		plugins: plugins
	});
	var packageKarmaConfig = _extends({}, baseKarmaConfig, {
		basePath: packageDirectory,
		files: files,
		frameworks: frameworks,
		webpack: packageWebpackConfig
	});

	return packageKarmaConfig;
}

function runPackageTests(packageKarmaConfig, resolvePromise) {
	var server = new _karma.Server(packageKarmaConfig, function (exitCode) {
		if (exitCode === 0) {
			resolvePromise();
		} else if (!devMode) {
			process.exit(exitCode); //eslint-disable-line
		}
	});

	server.start();
}

function createPackagesKarmaConfigs(packagesTestMetadata) {
	return packagesTestMetadata.filter(function (_ref2) {
		var packageName = _ref2.packageName;

		if (requestedPackagesToTest.length === 0) {
			return true;
		}

		return requestedPackagesToTest.includes(packageName);
	}).map(createPackageKarmaConfig);
}