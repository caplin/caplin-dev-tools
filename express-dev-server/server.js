'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _poll = require('./poll');

var _poll2 = _interopRequireDefault(_poll);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var webpackConfig = _ref.webpackConfig;

	var app = (0, _express2.default)();
	var APP_PORT = 8080;
	var appRoot = process.cwd();

	// Serve static files (HTML, XML, CSS), contained in application directory.
	app.use(_express2.default.static(appRoot));

	(0, _poll2.default)(app);
	// Handlers/middleware for webpack.
	(0, _webpack2.default)(app, webpackConfig);

	// Don't bind to `localhost` as that will mean the server won't be accessible by other machines on the LAN.
	app.listen(APP_PORT, function (err) {
		return console.log(err || 'Listening on port ' + APP_PORT);
	}); // eslint-disable-line

	return app;
};