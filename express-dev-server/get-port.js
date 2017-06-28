const findAvailablePort = require("detect-port");
const inquirer = require("inquirer");

const portQuestion = {
	type: "confirm",
	name: "tryAnotherPort",
	message: "Would you like to run on another port instead?",
	default: true
};

module.exports = () => {
	const APP_PORT = process.env.PORT || 8080;

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
