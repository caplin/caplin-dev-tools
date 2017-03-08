const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

module.exports = (application, webpackConfig) => {
  const compiler = webpack(webpackConfig);
  const devMiddlewareOptions = {
    // Required, path to bind the middleware to.
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    quiet: false,
    stats: {
      assets: false,
      colors: true,
      chunks: false
    }
  };
  const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);

  application.use(devMiddleware);
};
