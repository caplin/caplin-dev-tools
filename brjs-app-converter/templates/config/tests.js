import {join, resolve} from 'path';

import {Server} from 'karma';
import {DefinePlugin} from 'webpack';

import webpackConfig from './webpack.config';

const testEntry = resolve(__dirname, 'test-entry.js');

let module = null;
let devMode = false;
const args = process.argv.slice(2);

args.forEach(arg => {
	if (arg === '--dev') {
	console.log('Running test runner in dev mode');
	devMode = true;
} else {
	module = arg;
}
});

webpackConfig.entry = testEntry;
webpackConfig.resolve.alias['$aliases-data$'] = join(__dirname, 'aliases-test.js');

const baseKarmaConfig = {
	basePath: resolve(__dirname, '../node_modules'),
	browsers: ['Chrome'],
	frameworks: ['jasmine'],
	preprocessors: {
		[testEntry]: ['webpack']
	},
	singleRun: !devMode,
	webpackMiddleware: {
		stats: {
			assets: false,
			colors: true,
			chunks: false
		}
	}
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
			pattern: 'icons/_resources-test-ut/*.svg',
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
			pattern: 'loading/_test-ut/*.*',
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

const packageKarmaConfigs = packagesToTest.map(packageInfo => {
		if (module !== null) {
	if (module === packageInfo) {
		console.log(`Running tests for "${ packageInfo }" only`);
		return createPackageKarmaConfig(packageInfo)
	}
} else {
	console.log(`Running tests for "${ packageInfo }"`);
	return createPackageKarmaConfig(packageInfo)
}
return null;
});

function runPackageTests(packageKarmaConfig, resolve) {
	const server = new Server(packageKarmaConfig, (code) => {
			if (code === 0) {
		resolve();
	} else {
		if (!devMode) {
			process.exit(code);
		}
	}
});

	server.start();
}

async function runPackagesTests() {
	for (const packageKarmaConfig of packageKarmaConfigs) {
		if (packageKarmaConfig) {
			await new Promise((resolve) => runPackageTests(packageKarmaConfig, resolve));
		}
	}

	if (!devMode) {
		process.exit(0);
	}
}

runPackagesTests();
