import {
	readdirSync,
	statSync
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

export function webpackConfigGenerator({basePath, version = 'dev'}) {
	const babelLoaderExclude = [];

	for (const packageDir of readdirSync(join(basePath, '../../packages'))) {
		try {
			statSync(join(basePath, `node_modules/${packageDir}/converted_library.js`));
			babelLoaderExclude.push(join(basePath, `node_modules/${packageDir}/`));
		} catch (packageShouldBeBabeledError) {
			// Ignore.
		}
	}

	const args = parseArgs(process.argv.slice(2));
	const {
		sourceMaps,
		variant
	} = args;
	const isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
	const isTest = process.env.npm_lifecycle_event.startsWith('test'); // eslint-disable-line

	const entryFile = variant ? `index-${variant}.js` : 'index.js';
	const appEntryPoint = join(basePath, 'src', entryFile);
	const buildOutputDir = join(basePath, 'build', 'dist', 'public');
	const bundleName = `bundle-${version}.js`;
	const i18nFileName = `i18n-${version}.js`;
	const i18nExtractorPlugin = new ExtractTextPlugin(i18nFileName, {allChunks: true});
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
				test: /\.(gif|jpg|png|svg|woff)$/,
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
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			}, {
				test: /\.xml$/,
				loader: '@caplin/xml-loader'
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
		plugins: [
			i18nExtractorPlugin
		]
	};

	if (sourceMaps) {
		webpackConfig.devtool = 'inline-source-map';
	}

	if (isBuild) {
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
	}

	return webpackConfig;
}
