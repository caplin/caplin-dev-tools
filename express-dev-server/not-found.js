"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var NOT_FOUND_CODE = 404;

exports.default = function (application) {
	// Log a warning for any request that doesn't match a route. This route handler has to be the last
	// route handler registered otherwise it will capture/match all requests.
	application.use(function (req, res) {
		var notFoundWarning = "Resource for " + req.url + " not found.";

		console.warn(notFoundWarning); // eslint-disable-line

		res.status(NOT_FOUND_CODE).send(notFoundWarning);
	});
};