const dotenv = require("dotenv");
const express = require("express");
const address = require("address");
const parseArgs = require("minimist");
const chalk = require("chalk");

const poll = require("./poll");
const webpackMiddleware = require("./webpack");

const { hot } = parseArgs(process.argv.slice(2));

module.exports = ({ webpackConfig }) => {
  const app = express();
  const appRoot = process.cwd();

  // Load application environment variables from `.env` file, to inject into
  // JNDI tokens.
  dotenv.config();

  // Serve static files (HTML, XML, CSS), contained in application directory.
  app.use(express.static(appRoot));

  poll(app);
  // Handlers/middleware for webpack.
  webpackMiddleware(app, webpackConfig);

  const APP_PORT = process.env.PORT || 8080;

  app.listen(APP_PORT, err => {
    if (err) {
      console.log(err);
      return;
    }

    const IS_WIN = /^win/.test(process.platform);
    const APP_NAME = IS_WIN
      ? appRoot.split("\\").pop()
      : appRoot.split("/").pop();
    const ipAddress = address.ip();

    console.log(chalk.yellow(`Compiled successfully!\n`));
    console.log(`You can view ${chalk.green(APP_NAME)} in the browser.\n`);
    console.log(
      `Local Connection:  ${chalk.green("http://localhost:" + APP_PORT + "/")}`
    );
    console.log(
      `Remote Connection: ${chalk.green(
        "http://" + ipAddress + ":" + APP_PORT + "/"
      )}\n`
    );

    console.log(
      `Hot module replacement is ${hot
        ? chalk.green("enabled")
        : chalk.red("disabled")}\n`
    );
  });

  return app;
};
