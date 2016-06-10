import {
	resolve
} from 'path';

import {
	Server
} from 'karma';
import {
	LOG_ERROR
} from 'karma/lib/constants';
import parseArgs from 'minimist';
import {
	DefinePlugin
} from 'webpack';

const args = parseArgs(process.argv.slice(2));
// Keeps browser/Karma running after test run.
const devMode = args.dev || false;
// Packages user wants to test, if the user specifies none all packages will be tested.
const requestedPackagesToTest = args._;
const testEntry = resolve(__dirname, 'test-entry.js');

export const baseKarmaConfig = {
	browsers: ['Chrome'],
	logLevel: LOG_ERROR,
	preprocessors: {
		[testEntry]: ['webpack', 'sourcemap']
	},
	reporters: ['dots'],
	singleRun: !devMode,
	webpackMiddleware: {
		noInfo: true,
		stats: {
			assets: false,
			chunks: false,
			errors: true,
			hash: false,
			version: false,
			warnings: false
		}
	}
};

function createPackageKarmaConfig({filesToServe, packageDirectory, webpackConfig, frameworks}) {
	const files = [testEntry];

	if (filesToServe) {
		files.push(filesToServe);
	}

	const plugins = [
		new DefinePlugin({PACKAGE_DIRECTORY: `"${packageDirectory}"`})
	];
	const packageWebpackConfig = {
		...webpackConfig,
		entry: testEntry,
		plugins
	};
	const packageKarmaConfig = {
		...baseKarmaConfig,
		basePath: packageDirectory,
		files,
		frameworks,
		webpack: packageWebpackConfig
	};

	return packageKarmaConfig;
}

function runPackageTests(packageKarmaConfig, resolvePromise) {
	console.log('Running tests for: \x1b[35m' + packageKarmaConfig.basePath + '\x1b[0m');

	const server = new Server(packageKarmaConfig, (exitCode) => {
		if (exitCode === 0) {
			resolvePromise();
		} else if (!devMode) {
			process.exit(exitCode); //eslint-disable-line
		}
	});

	server.start();
}

export function createPackagesKarmaConfigs(packagesTestMetadata) {
	return packagesTestMetadata
		.filter(({packageName}) => {
			if (requestedPackagesToTest.length === 0) {
				return true;
			}

			return requestedPackagesToTest.includes(packageName);
		})
		.map(createPackageKarmaConfig);
}

export async function runPackagesTests(packagesKarmaConfigs) {
	try {
		for (const packageKarmaConfig of packagesKarmaConfigs) {
			await new Promise((resolve) => runPackageTests(packageKarmaConfig, resolve));
		}
	} catch (err) {
		console.error(err);
	}

	if (!devMode) {
		process.exit(0);
	}
}
