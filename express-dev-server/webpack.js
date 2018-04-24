const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const parseArgs = require("minimist");

const { hot } = parseArgs(process.argv.slice(2));

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);
  const devMiddlewareOptions = {
    // Required, path to bind the middleware to.
    publicPath: webpackConfig.output.publicPath,
    stats: {
      all: false,
      colors: true,
      errors: true,
      moduleTrace: true,
      timings: true,
      warnings: true
    }
  };

  if (hot) {
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
