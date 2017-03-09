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
import {
	onError
} from 'karma-caplin-dots-reporter';

const args = parseArgs(process.argv.slice(2));
// Keeps browser/Karma running after test run.
const atsOnly = args.ats || args._.includes('--ats') || args._.includes('--ATs') || false;
const utsOnly = args.uts || args._.includes('--uts') || args._.includes('--UTs') || false;
const devMode = args.dev || false;
// Packages user wants to test, if the user specifies none all packages will be tested.
const requestedPackagesToTest = args._;
const atsTestEntry = resolve(__dirname, 'ats-test-entry.js');
const utsTestEntry = resolve(__dirname, 'uts-test-entry.js');

const testBrowser = retrieveBrowserNameWithCorrectCasing(args['browser']);

const baseKarmaConfig = {
	browsers: [testBrowser],
	logLevel: LOG_ERROR,
	caplinDotsReporter: {
		icon: {
			success : '.',
			failure : 'F',
			ignore  : '-'
		}
	},
	reporters: ['caplin-dots'],
	singleRun: !devMode,
	failOnEmptyTestSuite: true,
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

function retrieveBrowserNameWithCorrectCasing(browser) {
	let selectedBrowser = browser || 'chrome';
	switch (selectedBrowser.toLowerCase()) {

        case 'ie': return 'IE';
        case 'firefox': return 'Firefox';
        case 'chrome': return 'Chrome';

        default:
			console.log(browser + ' is not a supported browser, defaulting to Chrome');
			return 'Chrome';
	}
}

function createPackageKarmaConfig({files = [], frameworks = [], packageDirectory, webpackConfig}, testEntry) {
	const karmaFiles = [...files, testEntry];

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
		preprocessors: {
			[testEntry]: ['webpack', 'sourcemap']
		},
		basePath: packageDirectory,
		files: karmaFiles,
		frameworks,
		webpack: packageWebpackConfig
	};

	return packageKarmaConfig;
}

function getShortPathFromBasePath(basePath) {
	return basePath.substring(basePath.indexOf('apps'));
}

function runPackageTests(packageKarmaConfig, resolvePromise, summary, packageName) {
	console.log('\nRunning tests for: \x1b[35m' + packageName + '\x1b[0m');

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

function filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata) {
	return packagesTestMetadata
		.filter(({packageName}) => {
			if (requestedPackagesToTest.length === 0) {
				return true;
			}

			return requestedPackagesToTest.includes(packageName);
		});
}

export function createPackagesKarmaConfigs(packagesTestMetadata) {
	if (atsOnly) {
		return [];
	}

	return filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata)
		.map((packageTestMetadata) => createPackageKarmaConfig(packageTestMetadata, utsTestEntry));
}

export function createPackagesATsKarmaConfigs(packagesTestMetadata) {
	if (utsOnly) {
		return [];
	}

	return filterPackagesToTestIfFilterIsSpecified(packagesTestMetadata)
		.map((packageTestMetadata) => createPackageKarmaConfig(packageTestMetadata, atsTestEntry));
}

export async function runPackagesTests(packagesKarmaConfigs) {
	// When the user hits Control-C we want to exit the process even if we have queued test runs.
	process.on('SIGINT', () => {
		console.log('\nTesting has been terminated due to the process being exited!\x1b[0m');
		showSummary(summary);
		process.exit();
	});
	// this might bring up issues if our tests start running concurrently,
	// but given we currently run package by package, it should be fine
	let packageName = '';
	const summary = {
		success: 0,
		failed: 0,
		error: false,
		errors: []
	};
	onError(error => {
		summary.errors.push({ packageName, error });
	});

	try {
		for (const packageKarmaConfig of packagesKarmaConfigs) {
			packageName = getShortPathFromBasePath(packageKarmaConfig.basePath);
			await new Promise((resolve) => runPackageTests(packageKarmaConfig, resolve, summary, packageName));
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
	if (!devMode) {
		console.log(`\n== Test Report ==`);
		if (failed > 0 || error) {
			console.log(`\n\x1b[41m\x1b[30mTesting ended with failures/errors!\x1b[0m`);
			console.log(errors.map(({packageName, error}) => `\nTest failed in: \x1b[35m${packageName}\n${error}`).join('\n') + '\n');
		} else {
			console.log(`\n\x1b[42m\x1b[30mTesting ended with no failures!\x1b[0m`);
		}
		console.log(`\x1b[35mPassed:\x1b[0m ${ success }`);
		console.log(`\x1b[35mFailed:\x1b[0m ${ failed }`);
		console.log(`\x1b[35mErrors:\x1b[0m ${ error ? 'Yes' : 'No' }`);
		if (failed > 0 || error) {
			process.exit(1);
		}
	}
}
