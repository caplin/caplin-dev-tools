const dotenv = require("dotenv");
const express = require("express");
const address = require("address");
const parseArgs = require("minimist");

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

    const APP_NAME = appRoot.split("\\").pop();
    const ipAddress = address.ip();

    console.log(`Compiled successfully!\n`);
    console.log(`You can view ${APP_NAME} in the browser.\n`);
    console.log(`Local Connection:  http://localhost:${APP_PORT}/`);
    console.log(`Remote Connection: http://${ipAddress}:${APP_PORT}/\n`);

    console.log(`Hot module replacement is ${hot ? "enabled" : "disabled"}\n`);
  });

  return app;
};
