const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { HMR } = require("../webpack-config-app/config");
const isHotRealoadingActivated = HMR;

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);
  let devMiddlewareOptions;

  if (isHotRealoadingActivated) {
    devMiddlewareOptions = {
      hot: true,
      filename: "bundle.js",
      // Required, path to bind the middleware to.
      publicPath: webpackConfig.output.publicPath,
      noInfo: false,
      quiet: false,
      stats: {
        assets: false,
        colors: true,
        chunks: false,
        // Turn console output from the extract text plugin off.
        children: false
      },
      historyApiFallback: true
    };

    app.use(
      webpackHotMiddleware(compiler, {
        log: console.log,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
      })
    );
  }
  else {
    devMiddlewareOptions = {
      // Required, path to bind the middleware to.
      publicPath: webpackConfig.output.publicPath,
      noInfo: false,
      quiet: false,
      stats: {
        assets: false,
        colors: true,
        chunks: false,
        // Turn console output from the extract text plugin off.
        children: false
      }
    };
  }
  const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);

  application.use(devMiddleware);
};
