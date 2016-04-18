import {readdirSync, accessSync, F_OK} from 'fs';
import {join, resolve} from 'path';

import {appendModulePatch} from '@caplin/patch-loader/patchesStore';
import AppCachePlugin from 'appcache-webpack-plugin';
import {includePaths} from 'bourbon';
import parseArgs from 'minimist';

// Some thirdparty libraries use global `this` to reference `window`. webpack replaces such references to
// `this` with `undefined` when it wraps those modules. To load them without error you will therefore
// need to inject a reference to `window`. This can be done with the `imports-loader`.
function moduleUsesGlobal(absolutePath) {
	return absolutePath.match(/MutationObservers/) || absolutePath.match(/CustomElements/) ||
		absolutePath.match(/sinon/);
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

const webpackConfigGenerator = function(argsMap) {
	const babelLoaderExclude = [];
	const basePath = argsMap.basePath;

	for (const packageDir of readdirSync(join('../../packages'))) {
		try {
			accessSync(join(basePath, `node_modules/${packageDir}/compiler.json`), F_OK);
		} catch (e) {
			babelLoaderExclude.push(join(basePath, `node_modules/${packageDir}/`));
		}
	}

	const variant = parseArgs(process.argv.slice(2)).variant;
	const entryFile = variant ? 'entry-' + variant + '.js': 'entry.js';
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
		patchLoader: appendModulePatch(),
		sassLoader: {
			includePaths
		},
		resolve: {
			alias: {
				// `alias!$aliases-data` required in `AliasRegistry`, loaded with `alias-loader`.
				'$aliases-data$': join(basePath, 'aliases.js'),
				// `app-meta!$app-metadata` required in `BRAppMetaService`, loaded with `app-meta-loader`.
				'$app-metadata$': join(basePath, 'metadata.js'),
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
		webpackConfig.plugins.push(
			new AppCachePlugin({
				comment: `version ${process.env.npm_package_version}`, // eslint-disable-line
				output: '../manifest.appcache'
			})
		);
	}

	return webpackConfig;
}

module.exports = {webpackConfigGenerator};
