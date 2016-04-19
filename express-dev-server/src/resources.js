import {join} from 'path';

export default (applicationPath, application, appRoot) => {
	const applicationAspectPrefix = `node_modules${applicationPath}-`;

	// Serve up unbundled-resources from `node_modules`.
	application.get('/unbundled-resources/*', ({params}, res) => {
		const resourcePath = `${applicationAspectPrefix}default-aspect/unbundled-resources/${params['0']}`;
		const absResourcePath = join(appRoot, resourcePath);

		res.sendFile(absResourcePath);
	});
};
