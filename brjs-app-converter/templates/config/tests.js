import {join, resolve} from 'path';

import {Server} from 'karma';
import {DefinePlugin} from 'webpack';

import webpackConfig from '../webpack.config';

const testEntry = resolve(__dirname, 'test-entry.js');

webpackConfig.entry = testEntry;
webpackConfig.resolve.alias['$aliases-data$'] = join(__dirname, '../test-aliases.js');

const baseKarmaConfig = {
	basePath: resolve(__dirname, '../node_modules'),
	browsers: ['Chrome'],
	frameworks: ['jasmine'],
	preprocessors: {
		[testEntry]: ['webpack']
	},
	singleRun: true
};

const packagesToTest = [
	{
		packageName: 'appcache',
		filesToServe: {
			pattern: 'appcache/_test-ut/manifest.*',
			watched: false,
			included: false
		}
	},
	'appconsole',
	'authenticationService',
	'connection',
	'currencyService',
	'dateServices',
	'formattedRates',
	'fxtrading',
	{
		packageName: 'icons',
		filesToServe: {
			pattern: 'icons/test-unit/resources/*.svg',
			watched: false,
			included: false
		}
	},
	'infinite',
	'instrumentdetails',
	'keyboards',
	{
		packageName: 'loading',
		filesToServe: {
			pattern: 'loading/test-unit/tests/*.*',
			watched: false,
			included: false
		}
	},
	'loginscreen',
	'mobile-blotter',
	'mobile-default-aspect',
	'router',
	'sljs-utils',
	'smspanel',
	'timeService',
	'tokenpanel',
	'trading',
	'tradingstatus',
	'ui',
	'utils',
	'watchlist',
	'watchlistService'
];

function createPackageKarmaConfig(packageInfo) {
	const files = [testEntry];
	const packageName = packageInfo.packageName || packageInfo;

	if (typeof packageInfo === 'object') {
		files.push(packageInfo.filesToServe);
	}

	const plugins = [
		new DefinePlugin({PACKAGE: `"${packageName}"`})
	];
	const packageWebpackConfig = {
		...webpackConfig,
		plugins
	};
	const packageKarmaConfig = {
		...baseKarmaConfig,
		files,
		webpack: packageWebpackConfig
	};

	return packageKarmaConfig;
}

const packageKarmaConfigs = packagesToTest.map(createPackageKarmaConfig);

function runPackageTests(packageKarmaConfig, resolve) {
	const server = new Server(packageKarmaConfig, (code) => {
		if (code === 0) {
			resolve();
		} else {
			process.exit(code);
		}
	});

	server.start();
}

async function runPackagesTests() {
	for (const packageKarmaConfig of packageKarmaConfigs) {
		await new Promise((resolve) => runPackageTests(packageKarmaConfig, resolve));
	}

	process.exit(0);
}

runPackagesTests();
