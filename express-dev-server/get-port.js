const findAvailablePort = require("detect-port");
const inquirer = require("inquirer");

const APP_PORT = process.env.PORT || 8080;
const portQuestion = availablePort => {
	return {
		type: "confirm",
		name: "tryAnotherPort",
		message: `port ${APP_PORT} is already in use, would you like to use ${availablePort} instead?`,
		default: true
	};
};

module.exports = () => {
	return new Promise((resolve, reject) => {
		findAvailablePort(APP_PORT)
			.then(availablePort => {
				availablePort === APP_PORT || !process.stdout.isTTY
					? resolve(APP_PORT)
					: inquirer
							.prompt([portQuestion(availablePort)])
							.then(answer => {
								answer.tryAnotherPort
									? resolve(availablePort)
									: resolve(APP_PORT);
							});
			})
			.catch(error => console.log(error));
	});
};
