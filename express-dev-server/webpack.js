const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const parseArgs = require("minimist");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");

const { hot } = parseArgs(process.argv.slice(2));
let isFirstTime = true;

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);

  compiler.plugin("done", stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      if (!isFirstTime) {
        console.log("Compiled successfully!");
      }
      isFirstTime = false;
    }

    if (messages.errors.length) {
      console.log("Failed to compile.\n");
      console.log(messages.errors.join("\n\n"));
      return;
    }

    if (messages.warnings.length) {
      console.log("Compiled with warnings.\n");
      console.log(messages.warnings.join("\n\n"));
    }
  });

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
