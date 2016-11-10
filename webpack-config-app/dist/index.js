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

const {
	sourceMaps,
	variant
} = (0, _minimist2.default)(process.argv.slice(2));
const isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
const isTest = process.env.npm_lifecycle_event.startsWith('test'); // eslint-disable-line

function configureBundleEntryPoint(webpackConfig, basePath) {
	// Certain apps can have variant entry points e.g. mobile.
	const entryFile = variant ? `index-${ variant }.js` : 'index.js';
	const appEntryPoint = (0, _path.join)(basePath, 'src', entryFile);

	webpackConfig.entry = appEntryPoint;
}

function configureBabelLoader(webpackConfig, basePath) {
	// Do not compile `babel-polyfill`/`core-js` using babel, it's not supported and causes
	// issues in older browsers (IE11) https://github.com/zloirock/core-js/issues/189
	const babelLoaderExclude = [(0, _path.join)(basePath, 'node_modules/babel-polyfill/')];
	const babelLoaderConfig = {
		test: /\.js$/,
		loader: 'babel-loader',
		exclude: babelLoaderExclude,
		query: {
			cacheDirectory: true
		}
	};

	for (const packageDir of (0, _fs.readdirSync)((0, _path.join)(basePath, '../../packages'))) {
		try {
			(0, _fs.statSync)((0, _path.join)(basePath, `node_modules/${ packageDir }/converted_library.js`));
			babelLoaderExclude.push((0, _path.join)(basePath, `node_modules/${ packageDir }/`));
		} catch (packageShouldBeBabeledError) {
			// Ignore.
		}
	}

	webpackConfig.module.loaders.push(babelLoaderConfig);
}

function configureI18nLoading(webpackConfig, i18nFileName) {
	const i18nLoaderConfig = {
		test: /\.properties$/
	};

	if (isTest) {
		i18nLoaderConfig.loader = '@caplin/i18n-loader/inline';
	} else {
		const i18nExtractorPlugin = new _extractTextWebpackPlugin2.default(i18nFileName, { allChunks: true });

		i18nLoaderConfig.loader = i18nExtractorPlugin.extract(['raw-loader', '@caplin/i18n-loader']);
		webpackConfig.plugins.push(i18nExtractorPlugin);
	}

	webpackConfig.module.loaders.push(i18nLoaderConfig);
}

function configureServiceLoader(webpackConfig) {
	if (isTest) {
		webpackConfig.resolveLoader.alias.service = '@caplin/service-loader/cache-deletion-loader';
	} else {
		webpackConfig.resolveLoader.alias.service = '@caplin/service-loader';
	}
}

function configureDevtool(webpackConfig) {
	if (sourceMaps) {
		webpackConfig.devtool = 'inline-source-map';
	}
}

function configureBuildDependentConfig(webpackConfig, version) {
	if (isBuild) {
		webpackConfig.output.publicPath = 'public/';

		webpackConfig.plugins.push(new _webpack2.default.DefinePlugin({
			'process.env': {
				VERSION: JSON.stringify(version)
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
	} else {
		webpackConfig.output.publicPath = '/public/';
	}
}

function webpackConfigGenerator({ basePath, version = 'dev', i18nFileName = `i18n-${ version }.js` }) {
	const webpackConfig = {
		output: {
			filename: `bundle-${ version }.js`,
			path: (0, _path.join)(basePath, 'build', 'dist', 'public')
		},
		module: {
			loaders: [{
				test: /\.html$/,
				loaders: ['@caplin/html-loader']
			}, {
				test: /\.(gif|jpg|png|svg|woff|woff2)$/,
				loader: 'file-loader'
			}, {
				test: /\.js$/,
				loader: '@caplin/patch-loader'
			}, {
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}, {
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			}, {
				test: /\.xml$/,
				loader: 'raw-loader'
			}]
		},
		patchLoader: (0, _patchesStore.appendModulePatch)(),
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': (0, _path.join)(basePath, 'src', 'config', 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': (0, _path.join)(basePath, 'src', 'config', 'metadata.js'),
				'ct-core/BRJSClassUtility$': (0, _path.join)(__dirname, 'null.js'),
				'br/dynamicRefRequire$': (0, _path.join)(__dirname, 'null.js')
			},
			// Module requires are resolved relative to the resource that is requiring them. When symlinking during
			// development modules will not be resolved unless we specify their parent directory.
			root: (0, _path.join)(basePath, 'node_modules')
		},
		resolveLoader: {
			alias: {
				alias: '@caplin/alias-loader',
				'app-meta': '@caplin/app-meta-loader'
			},
			// Loaders are resolved relative to the resource they are applied to. So when symlinking packages during
			// development loaders will not be resolved unless we specify the directory that contains the loaders.
			root: (0, _path.join)(basePath, 'node_modules')
		},
		plugins: []
	};

	configureBundleEntryPoint(webpackConfig, basePath);
	configureBabelLoader(webpackConfig, basePath);
	configureI18nLoading(webpackConfig, i18nFileName);
	configureServiceLoader(webpackConfig);
	configureDevtool(webpackConfig);
	configureBuildDependentConfig(webpackConfig, version);

	return webpackConfig;
}