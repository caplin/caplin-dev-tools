const findAvailablePort = require("detect-port");
const inquirer = require("inquirer");

const APP_PORT = process.env.PORT || 8080;
const portQuestion = {
	type: "confirm",
	name: "tryAnotherPort",
	message: `port ${APP_PORT} is already in use, would you like to try another port instead?`,
	default: true
};

module.exports = () => {
	return new Promise((resolve, reject) => {
		findAvailablePort(APP_PORT).then(availablePort => {
			availablePort === APP_PORT
				? resolve(port)
				: inquirer.prompt([portQuestion]).then(answer => {
						answer.tryAnotherPort
							? resolve(availablePort)
							: resolve(APP_PORT);
					});
		});
	});
};
