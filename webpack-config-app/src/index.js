import {readdirSync, statSync} from 'fs';
import {join, resolve} from 'path';

import {appendModulePatch} from '@caplin/patch-loader/patchesStore';
import parseArgs from 'minimist';
import webpack from 'webpack';

export function webpackConfigGenerator(argsMap) {
	const babelLoaderExclude = [];
	const basePath = argsMap.basePath;

	for (const packageDir of readdirSync(join(basePath, '../../packages'))) {
		try {
			statSync(join(basePath, `node_modules/${packageDir}/compiler.json`));
		} catch (packageShouldNotBeBabeledError) {
			babelLoaderExclude.push(join(basePath, `node_modules/${packageDir}/`));
		}
	}

	const variant = parseArgs(process.argv.slice(2)).variant;
	const entryFile = variant ? `index-${variant}.js` : 'index.js';
	const appEntryPoint = join(basePath, entryFile);
	const buildOutputDir = join(basePath, 'dist', 'public');
	const isBuild = process.env.npm_lifecycle_event === 'build'; // eslint-disable-line
	const bundleName = isBuild ? `bundle-${process.env.npm_package_version}.js` : 'bundle.js'; // eslint-disable-line
	const publicPath = isBuild ? 'public/' : '/public/';
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
				loader: '@caplin/patch-loader?minimize=false'
			}, {
				test: /\.properties$/,
				loader: '@caplin/i18n-loader'
			}, {
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}, {
				test: /\.xml$/,
				loader: '@caplin/xml-loader'
			}]
		},
		patchLoader: appendModulePatch(),
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': join(basePath, 'config', 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': join(basePath, 'config', 'metadata.js')
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
		webpackConfig.plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				}
			})
		);

		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
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

	// Add aliases for the app's code directories.
	const codeDirs = resolve(basePath, 'src');

	for (const codeDir of readdirSync(codeDirs)) {
		webpackConfig.resolve.alias[codeDir] = resolve(codeDirs, codeDir);
	}

	return webpackConfig;
}
