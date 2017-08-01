const dotenv = require("dotenv");
const express = require("express");
const address = require("address");
const parseArgs = require("minimist");
const chalk = require("chalk");

const poll = require("./poll");
const webpackMiddleware = require("./webpack");
const getPort = require("./get-port");

const { hot } = parseArgs(process.argv.slice(2));

module.exports = ({ webpackConfig }) => {
  return new Promise((resolve, reject) => {
    const app = express();
    const appRoot = process.cwd();

    // Load application environment variables from `.env` file, to inject into
    // JNDI tokens.
    dotenv.config();

    // Serve static files (HTML, XML, CSS), contained in application directory.
    app.use(express.static(appRoot));

    poll(app);

    getPort()
      .then(port => {
        // Handlers/middleware for webpack.
        webpackMiddleware(app, webpackConfig);

        app.listen(port, err => {
          if (err) {
            console.log(err);
            return;
          }

          const APP_NAME = appRoot.split("\\").pop();
          const ipAddress = address.ip();

          console.log(chalk.yellow(`Compiled successfully!\n`));
          console.log(
            `You can view ${chalk.green(APP_NAME)} in the browser.\n`
          );
          console.log(
            `Local Connection:  ${chalk.green(
              "http://localhost:" + port + "/"
            )}`
          );
          console.log(
            `Remote Connection: ${chalk.green(
              "http://" + ipAddress + ":" + port + "/"
            )}\n`
          );

          console.log(
            `Hot module replacement is ${hot
              ? chalk.green("enabled")
              : chalk.red("disabled")}\n`
          );
        });

        resolve(app);
      })
      .catch(error => console.log(error));
  });
};
