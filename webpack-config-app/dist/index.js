'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webpackConfigGenerator = webpackConfigGenerator;

var _fs = require('fs');

var _path = require('path');

var _patchesStore = require('@caplin/patch-loader/patchesStore');

var _appcacheWebpackPlugin = require('appcache-webpack-plugin');

var _appcacheWebpackPlugin2 = _interopRequireDefault(_appcacheWebpackPlugin);

var _bourbon = require('bourbon');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Some thirdparty libraries use global `this` to reference `window`. webpack replaces such references to
// `this` with `undefined` when it wraps those modules. To load them without error you will therefore
// need to inject a reference to `window`. This can be done with the `imports-loader`.
function moduleUsesGlobal(absolutePath) {
	return absolutePath.match(/MutationObservers/) || absolutePath.match(/CustomElements/) || absolutePath.match(/sinon/);
}

// Some thirdparty library modules check if `module` exists so they can export themself using it as
// opposed to attaching to the global. The way BRJS loaded them they didn't have access to `module` so to
// simulate a similar environment we need to remove `module`.
function moduleCannotBelieveItsACJSModule(absolutePath) {
	return absolutePath.match(/browser-modules/);
}

// Some thirdparty libraries use a check for `require` to set themself to CJS module mode.
function moduleCannotHaveRequire(absolutePath) {
	return absolutePath.match(/sinon/);
}

function webpackConfigGenerator(argsMap) {
	var babelLoaderExclude = [];
	var basePath = argsMap.basePath;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _fs.readdirSync)((0, _path.join)(basePath, '../../packages'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var packageDir = _step.value;

			try {
				(0, _fs.accessSync)((0, _path.join)(basePath, 'node_modules/' + packageDir + '/compiler.json'), _fs.F_OK);
			} catch (err) {
				babelLoaderExclude.push((0, _path.join)(basePath, 'node_modules/' + packageDir + '/'));
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var variant = (0, _minimist2.default)(process.argv.slice(2)).variant;
	var entryFile = variant ? 'index-' + variant + '.js' : 'index.js';
	var appEntryPoint = (0, _path.join)(basePath, entryFile);
	var buildOutputDir = (0, _path.join)(basePath, 'dist', 'public');
	var isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
	var bundleName = isBuild ? 'bundle-' + process.env.npm_package_version + '.js' : 'bundle.js'; // eslint-disable-line
	var publicPath = isBuild ? 'public/' : '/public/';
	var webpackConfig = {
		cache: true,
		entry: appEntryPoint,
		output: {
			path: buildOutputDir,
			filename: bundleName,
			publicPath: publicPath
		},
		module: {
			loaders: [{
				test: /\.html$/,
				loaders: ['dom-loader', 'html-loader']
			}, {
				test: /\.(jpg|png|svg|woff)$/,
				loader: 'file-loader'
			}, {
				test: /\.js$/,
				loader: 'babel-loader?cacheDirectory',
				exclude: babelLoaderExclude
			}, {
				test: /\.js$/,
				loader: '@caplin/patch-loader'
			}, {
				test: /\.properties$/,
				loader: '@caplin/i18n-loader'
			}, {
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}, {
				test: /\.xml$/,
				loader: '@caplin/xml-loader'
			}, {
				test: moduleUsesGlobal,
				loader: 'imports-loader?this=>window'
			}, {
				test: moduleCannotBelieveItsACJSModule,
				loader: 'imports-loader?module=>undefined'
			}, {
				test: moduleCannotHaveRequire,
				loader: 'imports-loader?require=>undefined'
			}]
		},
		patchLoader: (0, _patchesStore.appendModulePatch)(),
		sassLoader: {
			includePaths: _bourbon.includePaths
		},
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': (0, _path.join)(basePath, 'config', 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': (0, _path.join)(basePath, 'config', 'metadata.js'),
				// Application aliases, loaded with `alias-loader`.
				'caplin.fx.tenor.currency-tenors$': 'caplin-fx-aliases/caplin.fx.tenor.currency-tenors',
				// Application services, loaded with `service-loader`.
				'br.app-meta-service$': '@caplin/brjs-services/br.app-meta-service',
				'caplin.permission-service$': 'caplin-services/caplin.permission-service',
				'caplin.fx.business-date-service$': 'caplin-fx-services/caplin.fx.business-date-service',
				'caplin.fx.permission-service$': 'caplin-fx-services/caplin.fx.permission-service',
				'caplin.preference-service$': 'caplin-services/caplin.preference-service',
				'caplin.message-service$': 'caplin-services/caplin.message-service',
				'caplin.trade-service$': 'caplin-services/caplin.trade-service',
				'caplin.trade-message-service$': 'caplin-services/caplin.trade-message-service',
				jasmine: '@caplin/jstestdriver-functions'
			}
			// Needed for tests?
			// root: [ resolve('node_modules') ]
		},
		resolveLoader: {
			alias: {
				alias: '@caplin/alias-loader',
				'app-meta': '@caplin/app-meta-loader',
				service: '@caplin/service-loader'
			}
			// root: [resolve('node_modules')]
		},
		plugins: []
	};

	if (isBuild) {
		webpackConfig.plugins.push(new _appcacheWebpackPlugin2.default({
			cache: _glob2.default.sync('public/**/*.*').concat(_glob2.default.sync('v/**/*.*')),
			comment: 'version ' + process.env.npm_package_version, // eslint-disable-line
			output: '../manifest.appcache'
		}));
		webpackConfig.module.loaders.push({
			test: /\.js$/,
			loader: 'uglify'
		});
	}

	// Add aliases for the app's code directories.
	var codeDirs = (0, _path.resolve)(basePath, 'src');

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = (0, _fs.readdirSync)(codeDirs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var codeDir = _step2.value;

			webpackConfig.resolve.alias[codeDir] = (0, _path.resolve)(codeDirs, codeDir);
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return webpackConfig;
}