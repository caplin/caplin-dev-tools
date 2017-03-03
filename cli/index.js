#! /usr/bin/env node

const args = require("minimist")(process.argv.slice(2));

const cli = require("./cli");

const chosenCommandName = args._[0];
const chosenCommandOptions = args._.slice(1, args.length);

cli
  .getChosenCommand(chosenCommandName, chosenCommandOptions)
  .then(cli.getAllOptionValues)
  .then(cli.runCommand)
  .catch(e => {
    console.log(e);
  });
