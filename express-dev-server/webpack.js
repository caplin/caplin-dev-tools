const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const parseArgs = require("minimist");

const { hot } = parseArgs(process.argv.slice(2));

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);

  let devMiddlewareOptions = {
    // Required, path to bind the middleware to.
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    quiet: false,
    stats: {
      assets: false,
      colors: true,
      chunks: false,
      // Turn output from the extract text plugin off.
      children: false
    }
  };

  if (hot) {
    devMiddlewareOptions.hot = true;
    devMiddlewareOptions.historyApiFallback = true;

    application.use(
      webpackHotMiddleware(compiler, {
        log: console.log,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
      })
    );
  }

  const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);

  application.use(devMiddleware);
};
