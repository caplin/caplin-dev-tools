import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.config';

const compiler = webpack(config);
const devMiddlewareOptions = {
	// Required, path to bind the middleware to.
	publicPath: config.output.publicPath
};
const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);

export default (application) => {
	application.use(devMiddleware);
};
