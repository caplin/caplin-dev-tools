'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

exports.default = (applicationPath, application, appRoot) => {
	const applicationAspectPrefix = `src${ applicationPath }-`;

	// Serve up unbundled-resources from `node_modules`.
	application.get('/unbundled-resources/*', ({ params }, res) => {
		const resourcePath = `${ applicationAspectPrefix }default-aspect/unbundled-resources/${ params['0'] }`;
		const absResourcePath = (0, _path.join)(appRoot, resourcePath);

		res.sendFile(absResourcePath);
	});
};