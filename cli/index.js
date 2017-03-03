#! /usr/bin/env node

var cli = require('./cli');

var args = require('minimist')(process.argv.slice(2));
var chosenCommandName = args._[0];
var chosenCommandOptions = args._.slice(1, args.length);

cli.getChosenCommand(chosenCommandName, chosenCommandOptions)
	.then(cli.getAllOptionValues)
	.then(cli.runCommand)
	.catch(function(e) {
		console.log(e);
	});
