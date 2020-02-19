const logger = require("@caplin/node-logger");
const findAvailablePort = require("detect-port");
const inquirer = require("inquirer");

const portQuestion = (APP_PORT, availablePort) => {
  return {
    type: "confirm",
    name: "tryAnotherPort",
    message: `port ${APP_PORT} is already in use, would you like to use ${availablePort} instead?`,
    default: true
  };
};

module.exports = port => {
  const APP_PORT = port || parseInt(process.env.PORT, 10) || 8080;

  return new Promise(resolve => {
    findAvailablePort(APP_PORT)
      .then(availablePort => {
        availablePort === APP_PORT || !process.stdout.isTTY
          ? resolve(APP_PORT)
          : inquirer
              .prompt([portQuestion(APP_PORT, availablePort)])
              .then(answer => {
                answer.tryAnotherPort
                  ? resolve(availablePort)
                  : resolve(APP_PORT);
              });
      })
      .catch(error => {
        logger.log({
          label: "express-dev-server/get-port",
          level: "error",
          message: error
        });
      });
  });
};
