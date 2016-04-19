'use strict';

const join = require('path').join;
const resolve = require('path').resolve;

require('babel-register');

const webpackConfig = require('./webpack.config').default;

webpackConfig.resolve.alias['$aliases-data$'] = join(
	__dirname, 'test-aliases.js'
);

const basePath = resolve('node_modules');
const karmaConfig = {
	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath,

	// client.clearContext

	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['jasmine'],

	// list of files / patterns to load in the browser
	files: [
		'appcache/test-unit/**/*.js',
		{
			pattern: 'appcache/_test-ut/manifest.*',
			watched: false,
			included: false
		},
		'appconsole/test-unit/**/*.js',
		'authenticationService/test-unit/**/*.js',
		'connection/test-unit/**/*.js',
		'currencyService/test-unit/**/*.js',
		'dateServices/test-unit/**/*.js',
		'formattedRates/tests/**/*.js',
		'fxtrading/test-unit/**/*.js',
		'icons/test-unit/**/*.js',
		{
			pattern: 'icons/test-unit/resources/*.svg',
			watched: false,
			included: false
		},
		'keyboards/test-unit/**/*.js',
		// 'loading/test-unit/**/*.js',
		// {
		// 	pattern: 'loading/test-unit/tests/*.*',
		// 	watched: false,
		// 	included: false
		// },
		// 'loginscreen/test-unit/**/*.js',
		'../test-index.js',
		// 'mobile-default-aspect/test-unit/**/*.js',
		// 'router/test-unit/**/*.js',
		// 'sljs-utils/test-unit/**/*.js',
		// 'smspanel/test-unit/**/*.js',
		// 'timeService/test-unit/**/*.js',
		// 'tokenpanel/test-unit/**/*.js',
		// 'trading/test-unit/**/*.js',
		// 'tradingstatus/test-unit/**/*.js',
		// 'utils/test-unit/**/*.js',
		// 'watchlistService/test-unit/**/*.js',
		// 'instrumentdetails/test-unit/**/*.js',
		// 'mobile-blotter/test-unit/**/*.js',
		// 'ui/test-unit/**/*.js',
		// 'watchlist/test-unit/**/*.js',
		// 'infinite/test-unit/**/*.js', // Tests fail in mobile, PR waiting for review.
	],

	// list of files to exclude
	exclude: [
		// 'instrumentdetails/test-unit/**/commonFXModelTest.js',
	],

	// preprocess matching files before serving them to the browser
	// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: {
		'appcache/test-unit/**/*.js': ['webpack'],
		'appconsole/test-unit/**/*.js': ['webpack'],
		'authenticationService/test-unit/**/*.js': ['webpack'],
		'connection/test-unit/**/*.js': ['webpack'],
		'currencyService/test-unit/**/*.js': ['webpack'],
		'dateServices/test-unit/**/*.js': ['webpack'],
		'formattedRates/tests/**/*.js': ['webpack'],
		'fxtrading/test-unit/**/*.js': ['webpack'],
		'icons/test-unit/**/*.js': ['webpack'],
		'keyboards/test-unit/**/*.js': ['webpack'],
		// 'loading/test-unit/**/*.js': ['webpack'],
		// 'loginscreen/test-unit/**/*.js': ['webpack'],
		// 'mobile-blotter/test-unit/**/*.js': ['webpack'],
		'../test-index.js': ['webpack'],
		// 'mobile-default-aspect/test-unit/**/*.js': ['webpack'],
		// 'router/test-unit/**/*.js': ['webpack'],
		// 'sljs-utils/test-unit/**/*.js': ['webpack'],
		// 'smspanel/test-unit/**/*.js': ['webpack'],
		// 'timeService/test-unit/**/*.js': ['webpack'],
		// 'tokenpanel/test-unit/**/*.js': ['webpack'],
		// 'trading/test-unit/**/*.js': ['webpack'],
		// 'tradingstatus/test-unit/**/*.js': ['webpack'],
		// 'ui/test-unit/**/*.js': ['webpack'],
		// 'utils/test-unit/**/*.js': ['webpack'],
		// 'watchlist/test-unit/**/*.js': ['webpack'],
		// 'watchlistService/test-unit/**/*.js': ['webpack'],
		// 'instrumentdetails/test-unit/**/*.js': ['webpack'],
		// 'infinite/test-unit/**/*.js': ['webpack'],
	},

	webpack: webpackConfig,

	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	reporters: ['progress'],

	// web server port
	port: 9876,

	// enable / disable colors in the output (reporters and logs)
	colors: true,

	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,

	// start these browsers
	// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
	browsers: ['Chrome'],

	// Continuous Integration mode
	// if true, Karma captures browsers, runs the tests and exits
	singleRun: false,

	// Concurrency level
	// how many browser should be started simultaneous
	concurrency: Infinity
};

module.exports = function setKarmaConfig(config) {
	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	karmaConfig.logLevel = config.LOG_ERROR;

	config.set(karmaConfig);
};
