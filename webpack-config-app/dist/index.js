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

function webpackConfigGenerator({ basePath }) {
	const babelLoaderExclude = [];

	for (const packageDir of (0, _fs.readdirSync)((0, _path.join)(basePath, '../../packages'))) {
		try {
			(0, _fs.statSync)((0, _path.join)(basePath, `node_modules/${ packageDir }/compiler.json`));
		} catch (packageShouldNotBeBabeledError) {
			babelLoaderExclude.push((0, _path.join)(basePath, `node_modules/${ packageDir }/`));
		}
	}

	const args = (0, _minimist2.default)(process.argv.slice(2));
	const {
		sourceMaps,
		variant
	} = args;
	const isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
	const isTest = process.env.npm_lifecycle_event.startsWith('test'); // eslint-disable-line
	const version = process.env.npm_package_version; // eslint-disable-line

	const entryFile = variant ? `index-${ variant }.js` : 'index.js';
	const appEntryPoint = (0, _path.join)(basePath, 'src', entryFile);
	const buildOutputDir = (0, _path.join)(basePath, 'dist', 'public');
	const bundleName = isBuild ? `bundle-${ version }.js` : 'bundle.js';
	const i18nFileName = isBuild ? `i18n-${ version }.js` : 'i18n.js';
	const i18nExtractorPlugin = new _extractTextWebpackPlugin2.default(i18nFileName, { allChunks: true });
	let i18nLoader = i18nExtractorPlugin.extract(['raw-loader', '@caplin/i18n-loader']);
	const publicPath = isBuild ? 'public/' : '/public/';

	if (isTest) {
		i18nLoader = '@caplin/i18n-loader/inline';
	}

	const webpackConfig = {
		cache: true,
		entry: appEntryPoint,
		output: {
			path: buildOutputDir,
			filename: bundleName,
			publicPath
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
		patchLoader: (0, _patchesStore.appendModulePatch)({
			cwd: (0, _path.join)(basePath, '..', '..', 'brjs-app', 'js-patches')
		}),
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': (0, _path.join)(basePath, 'src', 'config', 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': (0, _path.join)(basePath, 'src', 'config', 'metadata.js'),
				'ct-core/BRJSClassUtility$': (0, _path.join)(__dirname, 'null.js'),
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

	if (sourceMaps) {
		webpackConfig.devtool = 'inline-source-map';
	}

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
	const codeDirs = (0, _path.resolve)(basePath, 'src');

	for (const codeDir of (0, _fs.readdirSync)(codeDirs)) {
		webpackConfig.resolve.alias[codeDir] = (0, _path.resolve)(codeDirs, codeDir);
	}

	return webpackConfig;
}