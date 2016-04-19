'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (application, webpackConfig) {
	var compiler = (0, _webpack2.default)(webpackConfig);
	var devMiddlewareOptions = {
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
	var devMiddleware = (0, _webpackDevMiddleware2.default)(compiler, devMiddlewareOptions);

	application.use(devMiddleware);
};