const chalk = require('chalk');
const logSymbols = require('log-symbols');
const util = require('util');

const onErrorCallbacks = [];

function CaplinDotsReporter(formatError, hasColors, options, adapter) {
	this.adapters = [adapter || process.stdout.write.bind(process.stdout)]
	chalk.enabled = hasColors;

	// Configuration
	options = options || {};
	options.nbDotsPerLine = options.nbDotsPerLine || 80;
	options.icon = options.icon || {};
	options.icon.failure = options.icon.failure || logSymbols.error;
	options.icon.success = options.icon.success || logSymbols.success;
	options.icon.ignore = options.icon.ignore || logSymbols.info;
	options.color = options.color || {};
	options.color.failure = options.color.failure || 'red';
	options.color.success = options.color.success || 'green';
	options.color.ignore = options.color.ignore || 'blue';

	if (hasColors) {
		this.USE_COLORS = true;
		options.icon.failure = colorInto(options.color.failure, options.icon.failure);
		options.icon.success = colorInto(options.color.success, options.icon.success);
		options.icon.ignore = colorInto(options.color.ignore, options.icon.ignore);
	} else {
		this.USE_COLORS = false;
		options.icon.failure = noColor(options.icon.failure);
		options.icon.success = noColor(options.icon.success);
		options.icon.ignore = noColor(options.icon.ignore);
	}

	this.TOTAL_SUCCESS = 0;
	this.TOTAL_FAILED = 0;
	this.FAILED = [];

	this.onRunStart = function () {
		this._dotsCount = 0;
	};

	this.specSuccess = function () {
		this._writeCharacter(options.icon.success);
		this.TOTAL_SUCCESS++;
	};

	this.specFailure = function (browser, result) {
		var msg = '\n' + chalk.red(browser.name + ' ' + result.suite.join(' ') + ' ' + result.description + '\n');

		result.log.forEach(function (log) {
			msg += formatError(log, '\t')
		})
		msg += '\n'
		
		this._writeCharacter(options.icon.failure);
		this.TOTAL_FAILED++;
		this.FAILED.push(msg);
		triggerOnErrorCallbacks(msg);
	};

	this.specSkipped = function () {
		this._writeCharacter(options.icon.ignore);
	};

	this.onSpecComplete = function (browser, result) {
		if (result.skipped) {
			this.specSkipped(browser, result);
		} else if (result.success) {
			this.specSuccess(browser, result);
		} else {
			this.specFailure(browser, result);
		}
	};

	this.onBrowserComplete = function (browser) {
		const results = browser.lastResult;
		const totalExecuted = results.success + results.failed;
		let msg = util.format('\n%s: Executed %d of %d', browser, totalExecuted, results.total);

		if (results.failed) {
			msg += chalk.red(` (${results.failed} FAILED)`);
		}
		if (results.skipped) {
			msg += util.format(' (skipped %d)', results.skipped);
		}

		msg += ' (' + (results.totalTime / 1000) + ' secs)';

		if (this.TOTAL_FAILED > 0) {
			this.FAILED.forEach(msg => write('\n' + msg));
		}	
		write(msg + '\n');
	};

	this._writeCharacter = function (character) {
		this._dotsCount = (1 + this._dotsCount) % options.nbDotsPerLine;
		write(this._dotsCount ? character : `${character}\n`);
	};
}

CaplinDotsReporter.$inject = ['formatError', 'config.colors', 'config.caplinDotsReporter'];

function triggerOnErrorCallbacks(error) {
	onErrorCallbacks.forEach(callback => callback(error));
}

module.exports = {
	'reporter:caplin-dots': ['type', CaplinDotsReporter],
	onError(callback) {
		onErrorCallbacks.push(callback);
	}
};

function colorInto(color, str) {
	return chalk[color](chalk.stripColor(str));
}

function noColor(str) {
	return chalk.stripColor(str);
}

function write(string) {
	process.stdout.write(string);
}
