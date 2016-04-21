/**
 * cli module
 *
 * @module cli
 */

var inquirer = require('inquirer');

var orderedCommands = require('./orderedCommands');

/**
 * Immediately runs the provided command with the chosen command options
 *
 * @param commandAndOptionList An array containing the chosen command object at position 0
 * followed by the command options
 */
var runCommand = function(commandAndOptionList) {
    var chosenCommand = commandAndOptionList[0];
    var chosenCommandOptions = commandAndOptionList.splice(1, commandAndOptionList.length);
    chosenCommand.commandFunction(chosenCommandOptions);
};

/**
 * Given a validated command, resolves a promise immediately if there are no options. If there are options, returns
 * promise that will resolve once all valid options have been provided by the user
 *
 * @param args The command that the user has chosen to run and the current list of command option values
 *
 * @returns {Promise} Returns a promise that will be resolved once valid option values have been sequentially
 * provided for all options
 */
var getAllOptionValues = function(args) {
    var chosenCommand = args[0];
    var chosenCommandOptions = chosenCommand.options || [];
    var chosenCommandOptionValues = args[1];
    var validCommandOptionValues = [];
    var questionsToAsk = [];

    chosenCommandOptions.forEach((function(commandOption, optionIndex) {

        var commandQuestion = commandOption.question;
        var currentOptionValue = chosenCommandOptionValues[optionIndex];
        var validate = commandOption.question.validate;

        if (validate && validate(currentOptionValue) !== true) {

            if (validate && currentOptionValue) {
                console.log(validate(currentOptionValue));
            };

            questionsToAsk.push(commandQuestion);

        } else {
            validCommandOptionValues.push(currentOptionValue);
        }

    }));


    if (questionsToAsk.length > 0) {

        return new Promise(function(resolve, reject) {

            inquirer.prompt(questionsToAsk).then(function(answersObject) {

                var answers = questionsToAsk.map(function(question, index) {
                   return answersObject[question.name]
                });

                resolve([chosenCommand].concat(validCommandOptionValues).concat(answers));

            })
            .catch(function(e) {
                console.log(e);
            });

        });

    } else {
        return Promise.resolve([chosenCommand].concat(validCommandOptionValues));
    }

};

/**
 * Given a command name, finds the associated command, validates the current working directory and resolves the returned
 * promise. If the command is invalid, ask the user which command they want to run. If the working directory is not
 * valid for the chosen command throw an error
 *
 * @param chosenCommandName The name of the chosen command
 * @param chosenCommandOptions The current array of option values
 *
 * @return {Promise} Resolves once a valid command has been run
 */
var getChosenCommand = function(chosenCommandName, chosenCommandOptionValues) {

    return new Promise(function(resolve, reject) {

        var chosenCommand = orderedCommands.filter(function(command) {
            return command.name == chosenCommandName
        })[0];

        if (!chosenCommand) {

            inquirer.prompt(getCommandQuestion(chosenCommandName))
                .then(function (answer) {

                    chosenCommand = orderedCommands.filter(function(command) {
                        return command.name == answer.commandName
                    })[0];

                    if (chosenCommand.isValidWorkingDirectory && chosenCommand.isValidWorkingDirectory(process.cwd()) !== true) {
                        throw new Error(chosenCommand.isValidWorkingDirectory(process.cwd()));
                    } else {
                        resolve([chosenCommand, chosenCommandOptionValues]);
                    }

                })
                .catch(function(e) {
                    console.log(e);
                });

        } else {

            if (chosenCommand.isValidWorkingDirectory && chosenCommand.isValidWorkingDirectory(process.cwd()) !== true) {
                throw new Error(chosenCommand.isValidWorkingDirectory(process.cwd()));
            } else {
                resolve([chosenCommand, chosenCommandOptionValues]);
            }

        }

    });

};

/**
 * Give a command name, generate a question using inquirer that can prompt the user for a valid command
 *
 * @param commandName The currently selected command
 *
 * @returns {InquirerQuestion} The question object that can be passed to inquirer
 */
var getCommandQuestion = function(commandName) {
    return {
        type: 'list',
        name: 'commandName',
        message: commandName ?
        'Command "' + commandName + '" not found, what command do you want to run:' :
            'What command do you want to run:',
        choices: orderedCommands.map(function(command) {return command.name})
    };
}

module.exports = {
    getChosenCommand: getChosenCommand,
    getAllOptionValues: getAllOptionValues,
    runCommand: runCommand
}