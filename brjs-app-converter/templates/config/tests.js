import {readdirSync} from 'fs';
import {join} from 'path';

import {configurePackageTestDatatype} from '@caplin/jasmine-karma-test-runner';
import {createPackagesKarmaConfigs, runPackagesTests} from '@caplin/karma-test-runner';

import webpackConfig from './webpack.config';

webpackConfig.resolve.alias['$aliases-data$'] = join(__dirname, 'aliases-test.js');

const codeDirectories = readdirSync(join(__dirname, '../src'));
const packagesTestDatatypes = [{
	packageName: 'appcache',
	filesToServe: {
		pattern: '_test-ut/manifest.*',
		watched: false,
		included: false
	}
}, {
	packageName: 'appconsole'
}, {
	packageName: 'authenticationService'
}, {
	packageName: 'connection'
}, {
	packageName: 'currencyService'
}, {
	packageName: 'dateServices'
}, {
	packageName: 'formattedRates'
}, {
	packageName: 'fxtrading'
}, {
	packageName: 'icons',
	filesToServe: {
		pattern: '_resources-test-ut/*.svg',
		watched: false,
		included: false
	}
}, {
	packageName: 'infinite'
}, {
	packageName: 'instrumentdetails'
}, {
	packageName: 'keyboards'
}, {
	packageName: 'loading',
	filesToServe: {
		pattern: '_test-ut/*.*',
		watched: false,
		included: false
	}
}, {
	packageName: 'loginscreen'
}, {
	packageName: 'mobile-blotter'
}, {
	packageName: 'mobile-default-aspect'
}, {
	packageName: 'router'
}, {
	packageName: 'sljs-utils'
}, {
	packageName: 'smspanel'
}, {
	packageName: 'timeService'
}, {
	packageName: 'tokenpanel'
}, {
	packageName: 'trading'
}, {
	packageName: 'tradingstatus'
}, {
	packageName: 'ui'
}, {
	packageName: 'utils'
}, {
	packageName: 'watchlist'
}, {
	packageName: 'watchlistService'
}];

const jasminePackagesTestDatatypes = packagesTestDatatypes
	.map((packageTestDatatype) => {
		packageTestDatatype.webpackConfig = webpackConfig;
		packageTestDatatype.packageDirectory = join(__dirname, '../node_modules', packageTestDatatype.packageName);

		if (codeDirectories.includes(packageTestDatatype.packageName)) {
			packageTestDatatype.packageDirectory = join(__dirname, '../src', packageTestDatatype.packageName);
		}

		return packageTestDatatype;
	})
	.map(configurePackageTestDatatype);

const karmaConfigs = createPackagesKarmaConfigs(jasminePackagesTestDatatypes);

runPackagesTests(karmaConfigs);
