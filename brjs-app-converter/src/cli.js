#! /usr/bin/env node

/* eslint-disable no-var */

var path = require('path');

var check = require('check-node-version');
var parseArgs = require('minimist');

var packageJson = require(path.join(__dirname, '..', 'package.json'));

var options = {
	node: packageJson.engines.node
};

function versionCheckCallback(versionError, result) {
	var errorMessage = 'Not compatible with current node version, please update!';

	if (result.nodeSatisfied) {
		convertApplication();
	} else {
		if (versionError) {
			errorMessage = versionError.message;
		}

		console.error(errorMessage); // eslint-disable-line
		process.exit(1); // eslint-disable-line
	}
}

check(options, versionCheckCallback);

// Can't rely on `babel-node` being globally installed so use the register hook instead.
// This allows the use of ES2015 in the CLI scripts.
require('babel-register')({
	// Compile `node_modules` as when the tool is installed it's located in `node_modules`.
	ignore: false
});

function convertApplication() {
	var convertor = require('./converter').default; // eslint-disable-line

	var argv = parseArgs(process.argv.slice(2));

	convertor(argv);
}
