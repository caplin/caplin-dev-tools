import {
	existsSync,
	readdirSync
} from 'fs';
import {
	join
} from 'path';

import {
	appendModulePatch
} from '@caplin/patch-loader/patchesStore';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import parseArgs from 'minimist';
import webpack from 'webpack';

const {
	sourceMaps,
	variant
} = parseArgs(process.argv.slice(2));
const isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
const isTest = process.env.npm_lifecycle_event.startsWith('test'); // eslint-disable-line

function configureBundleEntryPoint(webpackConfig, basePath) {
	// Certain apps can have variant entry points e.g. mobile.
	const entryFile = variant ? `index-${variant}.js` : 'index.js';
	const appEntryPoint = join(basePath, 'src', entryFile);

	webpackConfig.entry = appEntryPoint;
}

function createBabelLoaderExcludeList(basePath) {
	const babelLoaderExclude = [/KeyMasterHack.js/];
	// Exclude `babel-polyfill`, IE11 issues, https://github.com/zloirock/core-js/issues/189
	const packagesToExclude = ['babel-polyfill'];
	const packagesDir = join(basePath, '../../packages');

	for (const packageDir of readdirSync(packagesDir)) {
		if (existsSync(join(packagesDir, `${packageDir}/converted_library.js`))) {
			packagesToExclude.push(packageDir);
		} else if (packageDir.startsWith('br-') || (packagesDir.startsWith('ct-') && packagesDir !== 'ct-services')) {
			packagesToExclude.push(packageDir);
		}
	}

	babelLoaderExclude.push(new RegExp(`(node_modules|packages)/(${packagesToExclude.join('|')})`));

	return babelLoaderExclude;
}

function configureBabelLoader(webpackConfig, basePath) {
	const babelLoaderConfig = {
		test: /\.js$/,
		loader: 'babel-loader',
		exclude: createBabelLoaderExcludeList(basePath),
		query: {
			cacheDirectory: true
		}
	};

	webpackConfig.module.loaders.push(babelLoaderConfig);
}

function configureI18nLoading(webpackConfig, i18nFileName) {
	const i18nLoaderConfig = {
		test: /\.properties$/
	}

	if (isTest) {
		i18nLoaderConfig.loader = '@caplin/i18n-loader/inline';
	} else {
		const i18nExtractorPlugin = new ExtractTextPlugin(i18nFileName, {allChunks: true});

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

		webpackConfig.plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					VERSION: JSON.stringify(version)
				}
			})
		);

		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				exclude: /i18n(.*)\.js/,
				output: {
					comments: false
				},
				compress: {
					warnings: false,
					screw_ie8: true // eslint-disable-line
				}
			})
		);
	} else {
		webpackConfig.output.publicPath = '/public/';
	}
}

export function webpackConfigGenerator({basePath, version = 'dev', i18nFileName = `i18n-${version}.js`}) {
	const webpackConfig = {
		output: {
			filename: `bundle-${version}.js`,
			path: join(basePath, 'build', 'dist', 'public')
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
		patchLoader: appendModulePatch(),
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': join(basePath, 'src', 'config', 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': join(basePath, 'src', 'config', 'metadata.js'),
				'ct-core/BRJSClassUtility$': join(__dirname, 'null.js'),
				'br/dynamicRefRequire$': join(__dirname, 'null.js')
			},
			// Module requires are resolved relative to the resource that is requiring them. When symlinking during
			// development modules will not be resolved unless we specify their parent directory.
			root: join(basePath, 'node_modules')
		},
		resolveLoader: {
			alias: {
				alias: '@caplin/alias-loader',
				'app-meta': '@caplin/app-meta-loader'
			},
			// Loaders are resolved relative to the resource they are applied to. So when symlinking packages during
			// development loaders will not be resolved unless we specify the directory that contains the loaders.
			root: join(basePath, 'node_modules')
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
