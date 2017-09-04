const dotenv = require("dotenv");
const express = require("express");
const address = require("address");
const parseArgs = require("minimist");
const chalk = require("chalk");
const path = require("path");

const poll = require("./poll");
const webpackMiddleware = require("./webpack");
const getPort = require("./get-port");

const { hot } = parseArgs(process.argv.slice(2));

function printStatus(appRoot, port) {
  const appName = path.parse(appRoot).name;
  const hmrStatus = hot ? chalk.green("enabled") : chalk.red("disabled");
  const ipAddress = address.ip();
  const remoteAddressed = chalk.green(`http://${ipAddress}:${port}/`);

  console.log(chalk.yellow(`Compiled successfully!\n`));
  console.log(`You can view ${chalk.green(appName)} in the browser.\n`);
  console.log(`Local Connection: ${chalk.green(`http://localhost:${port}/`)}`);
  console.log(`Remote Connection: ${remoteAddressed}\n`);
  console.log(`Hot module replacement is ${hmrStatus}\n`);
}

module.exports = ({ appCreated = () => {}, webpackConfig }) => {
  const app = express();
  const appRoot = process.cwd();

  // Allow user to register handlers before default ones to allow intercepting
  // requests, e.g. reroute a request for a static file such as `.jsp`.
  appCreated(app);
  // Load application environment variables from `.env` file, to inject into
  // JNDI tokens.
  dotenv.config();

  // Serve static files (HTML, XML, CSS), contained in application directory.
  app.use(express.static(appRoot));

  poll(app);

  // Handlers/middleware for webpack.
  webpackMiddleware(app, webpackConfig);

  function listenToPort(port) {
    app.listen(port, err => {
      if (err) {
        console.error(err);
      } else {
        printStatus(appRoot, port);
      }
    });

    return app;
  }

  return getPort()
    .then(listenToPort)
    .catch(error => console.error(error));
};
