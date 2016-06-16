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
import { onError } from 'karma-caplin-dots-reporter';

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
	caplinDotsReporter: {
		icon: {
			success : '.',
			failure : 'F',
			ignore  : '-'
		}
	},
	reporters: ['caplin-dots'],
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

function getShortPathFromBasePath(basePath) {
	return basePath.substring(basePath.indexOf('apps'));
}

function runPackageTests(packageKarmaConfig, resolvePromise, summary) {
	console.log('\nRunning tests for: \x1b[35m' + getShortPathFromBasePath(packageKarmaConfig.basePath) + '\x1b[0m');

	const server = new Server(packageKarmaConfig, (exitCode) => {
		resolvePromise();
	});
	
	server.on('run_complete', (browsers, { success, failed, error, logs }) => {
		summary.success += success;
		summary.failed += failed;
		summary.error = summary.error || error;
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
	// When the user hits Control-C we want to exit the process even if we have queued test runs.
	process.on('SIGINT', () => {
		console.log('\nTesting has been terminated due to the process being exited!\x1b[0m');
		showSummary(summary);
		process.exit();
	});
	const summary = {
		success: 0,
		failed: 0,
		error: false,
		errors: []
	};
	onError(error => {
		summary.errors.push(error);
	});

	try {
		for (const packageKarmaConfig of packagesKarmaConfigs) {
			await new Promise((resolve) => runPackageTests(packageKarmaConfig, resolve, summary));
		}
	} catch (err) {
		showSummary(summary);
		console.error(err);
	}

	if (!devMode) {
		showSummary(summary);
		process.exit(0);
	}
}

function showSummary({ success, failed, error, errors }) {
	console.log(`\n== Test Report ==`);
	if (failed > 0 || error) {
		console.log(`\n\x1b[41m\x1b[30mTesting ended with failures/errors!\x1b[0m`);
		console.log(errors.join('\n') + '\n');
	} else {
		console.log(`\n\x1b[42m\x1b[30mTesting ended with no failures!\x1b[0m`);
	}
	console.log(`\x1b[35mPassed:\x1b[0m ${ success }`);
	console.log(`\x1b[35mFailed:\x1b[0m ${ failed }`);
	console.log(`\x1b[35mErrors:\x1b[0m ${ error ? 'Yes' : 'No' }`);
}