const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const parseArgs = require("minimist");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const chalk = require("chalk");

const { hot } = parseArgs(process.argv.slice(2));
let isFirstTime = true;

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);

  compiler.plugin("done", stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      if (!isFirstTime) {
        console.log(chalk.yellow("Compiled successfully!"));
      }
      isFirstTime = false;
    }

    if (messages.errors.length) {
      console.log(chalk.red("Failed to compile.\n"));
      console.log(messages.errors.join("\n\n"));
      return;
    }

    if (messages.warnings.length) {
      console.log(chalk.magenta("Compiled with warnings.\n"));
      console.log(messages.warnings.join("\n\n"));
    }
  });

  // overrides hard-source-log's console output
  compiler.plugin('hard-source-log', () => {});

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
