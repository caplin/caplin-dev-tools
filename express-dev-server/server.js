const dotenv = require("dotenv");
const express = require("express");

const poll = require("./poll");
const webpackMiddleware = require("./webpack");
const getPort = require("./get-port");

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

        app.listen(port, err =>
          console.log(err || `Listening on port ${port}`)
        );

        resolve(app);
      })
      .catch(error => console.log(error));
  });
};
