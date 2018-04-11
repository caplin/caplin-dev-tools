const logger = require("@caplin/node-logger");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const parseArgs = require("minimist");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const { yellow } = require("chalk");

const { hot } = parseArgs(process.argv.slice(2));

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);

  compiler.plugin("done", stats => {
    const jsonStats = stats.toJson({}, true);
    const messages = formatWebpackMessages(jsonStats);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      logger.info(`Compiled successfully in ${yellow(jsonStats.time)}ms`);
    }

    if (messages.errors.length) {
      logger.error(`Failed to compile.\n${messages.errors.join("\n\n")}`);
    } else if (messages.warnings.length) {
      logger.warn(`Compiled with warnings.\n${messages.warnings.join("\n\n")}`);
    }
  });

  // overrides hard-source-log's console output
  compiler.plugin("hard-source-log", () => {});

  const devMiddlewareOptions = {
    // Required, path to bind the middleware to.
    publicPath: webpackConfig.output.publicPath,
    clientLogLevel: "none",
    noInfo: true,
    quiet: true,
    stats: "none"
  };

  if (hot) {
    devMiddlewareOptions.hot = true;
    devMiddlewareOptions.historyApiFallback = true;

    application.use(
      webpackHotMiddleware(compiler, {
        log: () => {},
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
      })
    );
  }

  const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);

  application.use(devMiddleware);
};
