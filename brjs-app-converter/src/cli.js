#! /usr/bin/env node

// Can't rely on `babel-node` being globally installed so use the register hook instead.
// This allows the use of ES2015 in the CLI scripts.
require('babel-register')({
	// Compile `node_modules` as when the tool is installed it's located in `node_modules`.
	ignore: false
});
const minimist = require('minimist');

const convertor = require('./converter').default;

const argv = minimist(process.argv.slice(2));

convertor(argv);
