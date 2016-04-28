'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

exports.default = function (applicationPath, application, appRoot) {
	var applicationAspectPrefix = 'libs' + applicationPath + '-';

	// Serve up unbundled-resources from `node_modules`.
	application.get('/unbundled-resources/*', function (_ref, res) {
		var params = _ref.params;

		var resourcePath = applicationAspectPrefix + 'default-aspect/unbundled-resources/' + params['0'];
		var absResourcePath = (0, _path.join)(appRoot, resourcePath);

		res.sendFile(absResourcePath);
	});
};