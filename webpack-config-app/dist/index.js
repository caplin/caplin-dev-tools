'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.webpackConfigGenerator = webpackConfigGenerator;

var _fs = require('fs');

var _path = require('path');

var _patchesStore = require('@caplin/patch-loader/patchesStore');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackConfigGenerator(_ref) {
	var basePath = _ref.basePath;

	var babelLoaderExclude = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _fs.readdirSync)((0, _path.join)(basePath, '../../packages'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var packageDir = _step.value;

			try {
				(0, _fs.statSync)((0, _path.join)(basePath, 'node_modules/' + packageDir + '/compiler.json'));
			} catch (packageShouldNotBeBabeledError) {
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

	var isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
	var isTest = process.env.npm_lifecycle_event.startsWith('test'); // eslint-disable-line
	var variant = (0, _minimist2.default)(process.argv.slice(2)).variant;
	var version = process.env.npm_package_version; // eslint-disable-line

	var entryFile = variant ? 'index-' + variant + '.js' : 'index.js';
	var appEntryPoint = (0, _path.join)(basePath, entryFile);
	var buildOutputDir = (0, _path.join)(basePath, 'dist', 'public');
	var bundleName = isBuild ? 'bundle-' + version + '.js' : 'bundle.js';
	var i18nFileName = isBuild ? 'i18n-' + version + '.js' : 'i18n.js';
	var i18nExtractorPlugin = new _extractTextWebpackPlugin2.default(i18nFileName, { allChunks: true });
	var i18nLoader = i18nExtractorPlugin.extract(['raw-loader', '@caplin/i18n-loader']);
	var publicPath = isBuild ? 'public/' : '/public/';

	if (isTest) {
		i18nLoader = '@caplin/i18n-loader/inline';
	}

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
				loaders: ['dom-loader', 'html-loader?minimize=false']
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
				loader: i18nLoader
			}, {
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}, {
				test: /\.xml$/,
				loader: '@caplin/xml-loader'
			}]
		},
		patchLoader: (0, _patchesStore.appendModulePatch)(),
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': (0, _path.join)(basePath, 'config', 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': (0, _path.join)(basePath, 'config', 'metadata.js'),
				'ct-core/BRClassUtility$': (0, _path.join)(__dirname, 'null.js'),
				'br/dynamicRefRequire$': (0, _path.join)(__dirname, 'null.js')
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
		plugins: [i18nExtractorPlugin]
	};

	if (isBuild) {
		webpackConfig.plugins.push(new _webpack2.default.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}));

		webpackConfig.plugins.push(new _webpack2.default.optimize.UglifyJsPlugin({
			exclude: /i18n(.*)\.js/,
			output: {
				comments: false
			},
			compress: {
				warnings: false,
				screw_ie8: true // eslint-disable-line
			}
		}));
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