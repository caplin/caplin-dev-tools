const dotenv = require("dotenv");
const express = require("express");

const poll = require("./poll");
const webpackMiddleware = require("./webpack");

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { HMR } = require("../webpack-config-app/config");
const isHotRealoadingActivated = HMR;

module.exports = ({ webpackConfig }) => {
  const app = express();
  const appRoot = process.cwd();

  // Load application environment variables from `.env` file, to inject into
  // JNDI tokens.
  dotenv.config();

  // Serve static files (HTML, XML, CSS), contained in application directory.
  app.use(express.static(appRoot));

  if (isHotRealoadingActivated) {
    const compiler = webpack(webpackConfig);

    app.use(
      webpackDevMiddleware(compiler, {
        hot: true,
        filename: "bundle.js",
        publicPath: "/assets/",
        stats: {
          colors: true
        },
        historyApiFallback: true
      })
    );

    app.use(
      webpackHotMiddleware(compiler, {
        log: console.log,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
      })
    );
  }

  poll(app);
  // Handlers/middleware for webpack.
  webpackMiddleware(app, webpackConfig);

  const APP_PORT = process.env.PORT || 8080;

  // Don't bind to `localhost` as that will mean the server won't be accessible
  // by other machines on the LAN.
  app.listen(APP_PORT, err =>
    console.log(err || `Listening on port ${APP_PORT}`));

  return app;
};
