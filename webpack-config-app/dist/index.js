'use strict';

var _fs = require('fs');

var _path = require('path');

var _patchesStore = require('@caplin/patch-loader/patchesStore');

var _appcacheWebpackPlugin = require('appcache-webpack-plugin');

var _appcacheWebpackPlugin2 = _interopRequireDefault(_appcacheWebpackPlugin);

var _bourbon = require('bourbon');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

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

var webpackConfigGenerator = function webpackConfigGenerator(argsMap) {
	var babelLoaderExclude = [];
	var basePath = argsMap.basePath;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _fs.readdirSync)((0, _path.join)('../../packages'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var packageDir = _step.value;

			try {
				(0, _fs.accessSync)((0, _path.join)(basePath, 'node_modules/' + packageDir + '/compiler.json'), _fs.F_OK);
			} catch (e) {
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
	var entryFile = variant ? 'entry-' + variant + '.js' : 'entry.js';
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
				loaders: ['babel-loader?cacheDirectory'],
				exclude: babelLoaderExclude
			}, {
				test: /\.js$/,
				loaders: ['@caplin/patch-loader']
			}, {
				test: /\.properties$/,
				loader: 'i18n-loader'
			}, {
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
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
				'$aliases-data$': (0, _path.join)(basePath, 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': (0, _path.join)(basePath, 'metadata.js'),
				// Application aliases, loaded with `alias-loader`.
				'caplin.fx.tenor.currency-tenors$': 'caplin-fx-aliases/caplin.fx.tenor.currency-tenors',
				// Application services, loaded with `service-loader`.
				'br.app-meta-service$': 'brjs-services/br.app-meta-service',
				'caplin.permission-service$': 'caplin-services/caplin.permission-service',
				'caplin.fx.business-date-service$': 'caplin-fx-services/caplin.fx.business-date-service',
				'caplin.fx.permission-service$': 'caplin-fx-services/caplin.fx.permission-service',
				'caplin.preference-service$': 'caplin-services/caplin.preference-service',
				'caplin.message-service$': 'caplin-services/caplin.message-service',
				'caplin.trade-service$': 'caplin-services/caplin.trade-service',
				'caplin.trade-message-service$': 'caplin-services/caplin.trade-message-service',
				jasmine: 'jstestdriver-functions'
			},
			// Needed for tests?
			root: [
				// resolve('node_modules')
			]
		},
		// Needed for tests?
		//resolveLoader: {
		//	root: [
		//		resolve('node_modules')
		//	]
		//},
		plugins: []
	};

	if (isBuild) {
		webpackConfig.plugins.push(new _appcacheWebpackPlugin2.default({
			comment: 'version ' + process.env.npm_package_version, // eslint-disable-line
			output: '../manifest.appcache'
		}));
	}

	return webpackConfig;
};

module.exports = { webpackConfigGenerator: webpackConfigGenerator };

