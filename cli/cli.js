/**
 * cli module
 *
 * @module cli
 */

const inquirer = require("inquirer");

const orderedCommands = require("./orderedCommands");

/**
 * Immediately runs the provided command with the chosen command options
 *
 * @param commandAndOptionList An array containing the chosen command object at
 * position 0 followed by the command options
 */
function runCommand(commandAndOptionList) {
  const chosenCommand = commandAndOptionList[0];
  const chosenCommandOptions = commandAndOptionList.splice(
    1,
    commandAndOptionList.length
  );
  chosenCommand.commandFunction(chosenCommandOptions);
}

/**
 * Given a validated command, resolves a promise immediately if there are no 
 * options. If there are options, returns promise that will resolve once all 
 * valid options have been provided by the user
 *
 * @param args The command that the user has chosen to run and the current list 
 * of command option values
 *
 * @returns {Promise} Returns a promise that will be resolved once valid option 
 * values have been sequentially provided for all options
 */
function getAllOptionValues(args) {
  const chosenCommand = args[0];
  const chosenCommandOptions = chosenCommand.options || [];
  const chosenCommandOptionValues = args[1];
  const validCommandOptionValues = [];
  const questionsToAsk = [];

  chosenCommandOptions.forEach((commandOption, optionIndex) => {
    const commandQuestion = commandOption.question;
    const currentOptionValue = chosenCommandOptionValues[optionIndex];
    const validate = commandOption.question.validate;

    if (validate && validate(currentOptionValue) !== true) {
      if (validate && currentOptionValue) {
        console.log(validate(currentOptionValue));
      }

      questionsToAsk.push(commandQuestion);
    } else {
      validCommandOptionValues.push(currentOptionValue);
    }
  });

  if (questionsToAsk.length > 0) {
    return new Promise(resolve => {
      inquirer
        .prompt(questionsToAsk)
        .then(answersObject => {
          const answers = questionsToAsk.map(
            question => answersObject[question.name]
          );

          resolve(
            [chosenCommand].concat(validCommandOptionValues).concat(answers)
          );
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  return Promise.resolve([chosenCommand].concat(validCommandOptionValues));
}

/**
 * Give a command name, generate a question using inquirer that can prompt the 
 * user for a valid command
 *
 * @param commandName The currently selected command
 *
 * @returns {InquirerQuestion} The question object that can be passed to 
 * inquirer
 */
function getCommandQuestion(commandName) {
  const message = commandName
    ? `Command "${commandName}" not found, what command do you want to run:`
    : "What command do you want to run:";

  return {
    type: "list",
    name: "commandName",
    message,
    choices: orderedCommands.map(command => command.name)
  };
}

/**
 * Given a command name, finds the associated command, validates the current 
 * working directory and resolves the returned promise. If the command is
 * invalid, ask the user which command they want to run. If the working
 * directory is not valid for the chosen command throw an error
 *
 * @param chosenCommandName The name of the chosen command
 * @param chosenCommandOptions The current array of option values
 *
 * @return {Promise} Resolves once a valid command has been run
 */
function getChosenCommand(chosenCommandName, chosenCommandOptionValues) {
  return new Promise(resolve => {
    let chosenCommand = orderedCommands.filter(
      command => command.name === chosenCommandName
    )[0];

    if (!chosenCommand) {
      inquirer
        .prompt(getCommandQuestion(chosenCommandName))
        .then(answer => {
          chosenCommand = orderedCommands.filter(
            command => command.name === answer.commandName
          )[0];

          if (
            chosenCommand.isValidWorkingDirectory &&
            chosenCommand.isValidWorkingDirectory(process.cwd()) !== true
          ) {
            throw new Error(
              chosenCommand.isValidWorkingDirectory(process.cwd())
            );
          } else {
            resolve([chosenCommand, chosenCommandOptionValues]);
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else if (
      chosenCommand.isValidWorkingDirectory &&
      chosenCommand.isValidWorkingDirectory(process.cwd()) !== true
    ) {
      throw new Error(chosenCommand.isValidWorkingDirectory(process.cwd()));
    } else {
      resolve([chosenCommand, chosenCommandOptionValues]);
    }
  });
}

module.exports = {
  getChosenCommand,
  getAllOptionValues,
  runCommand
};
